import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePosSaleDto } from './dto/create-pos-sale.dto';

@Injectable()
export class PosSalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPosSaleDto: CreatePosSaleDto) {
    const discountCents = createPosSaleDto.discountCents ?? 0;
    const taxCents = createPosSaleDto.taxCents ?? 0;
    const saleNumber =
      createPosSaleDto.saleNumber ?? `POS-${Date.now().toString()}`;

    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.findUnique({
        where: { id: createPosSaleDto.businessId },
      });

      if (!business) {
        throw new NotFoundException('Business not found');
      }

      const branch = await tx.branch.findUnique({
        where: { id: createPosSaleDto.branchId },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }

      if (branch.businessId !== createPosSaleDto.businessId) {
        throw new BadRequestException('Branch does not belong to this business');
      }

      const cashier = await tx.user.findUnique({
        where: { id: createPosSaleDto.cashierId },
      });

      if (!cashier) {
        throw new NotFoundException('Cashier user not found');
      }

      if (createPosSaleDto.walletId) {
        const wallet = await tx.wallet.findUnique({
          where: { id: createPosSaleDto.walletId },
        });

        if (!wallet) {
          throw new NotFoundException('Wallet not found');
        }
      }

      let subtotalCents = 0;

      const saleItemsData: {
        productId: string;
        quantity: number;
        unitPriceCents: number;
        lineTotalCents: number;
      }[] = [];

      for (const item of createPosSaleDto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product not found: ${item.productId}`);
        }

        if (product.businessId !== createPosSaleDto.businessId) {
          throw new BadRequestException(
            `Product ${product.name} does not belong to this business`,
          );
        }

        if (product.status !== ProductStatus.ACTIVE) {
          throw new BadRequestException(`Product ${product.name} is not active`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          );
        }

        const lineTotalCents = product.sellingPriceCents * item.quantity;
        subtotalCents += lineTotalCents;

        saleItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPriceCents: product.sellingPriceCents,
          lineTotalCents,
        });
      }

      const totalAmountCents = subtotalCents - discountCents + taxCents;

      if (totalAmountCents < 0) {
        throw new BadRequestException('Total amount cannot be negative');
      }

      const sale = await tx.posSale.create({
        data: {
          saleNumber,
          businessId: createPosSaleDto.businessId,
          branchId: createPosSaleDto.branchId,
          cashierId: createPosSaleDto.cashierId,
          walletId: createPosSaleDto.walletId,
          paymentMethod: createPosSaleDto.paymentMethod,
          subtotalCents,
          discountCents,
          taxCents,
          totalAmountCents,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          business: true,
          branch: true,
          cashier: true,
          wallet: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      for (const item of createPosSaleDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return {
        message: 'POS sale created successfully',
        sale,
      };
    });
  }

  async findAll() {
    return this.prisma.posSale.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        business: true,
        branch: true,
        cashier: true,
        wallet: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.posSale.findUnique({
      where: { id },
      include: {
        business: true,
        branch: true,
        cashier: true,
        wallet: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException('POS sale not found');
    }

    return sale;
  }

  async findByBusiness(businessId: string) {
    return this.prisma.posSale.findMany({
      where: {
        businessId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        business: true,
        branch: true,
        cashier: true,
        wallet: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
