import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockInDto } from './dto/stock-in.dto';
import { StockOutDto } from './dto/stock-out.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCommonData(
    tx: Prisma.TransactionClient,
    productId: string,
    businessId: string,
    branchId: string | undefined,
    createdById: string,
  ) {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.businessId !== businessId) {
      throw new BadRequestException('Product does not belong to this business');
    }

    const business = await tx.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (branchId) {
      const branch = await tx.branch.findUnique({
        where: { id: branchId },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }

      if (branch.businessId !== businessId) {
        throw new BadRequestException('Branch does not belong to this business');
      }
    }

    const user = await tx.user.findUnique({
      where: { id: createdById },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return product;
  }

  async stockIn(stockInDto: StockInDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.validateCommonData(
        tx,
        stockInDto.productId,
        stockInDto.businessId,
        stockInDto.branchId,
        stockInDto.createdById,
      );

      const stockBefore = product.stockQuantity;
      const stockAfter = stockBefore + stockInDto.quantity;

      const updatedProduct = await tx.product.update({
        where: { id: stockInDto.productId },
        data: {
          stockQuantity: stockAfter,
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          reference: stockInDto.reference ?? `STOCK-IN-${Date.now()}`,
          type: InventoryMovementType.STOCK_IN,
          productId: stockInDto.productId,
          businessId: stockInDto.businessId,
          branchId: stockInDto.branchId,
          createdById: stockInDto.createdById,
          quantityChange: stockInDto.quantity,
          stockBefore,
          stockAfter,
          reason: stockInDto.reason ?? 'Stock added',
        },
        include: {
          product: true,
          business: true,
          branch: true,
          createdBy: true,
        },
      });

      return {
        message: 'Stock added successfully',
        updatedProduct,
        movement,
      };
    });
  }

  async stockOut(stockOutDto: StockOutDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.validateCommonData(
        tx,
        stockOutDto.productId,
        stockOutDto.businessId,
        stockOutDto.branchId,
        stockOutDto.createdById,
      );

      const stockBefore = product.stockQuantity;

      if (stockBefore < stockOutDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${stockBefore}`,
        );
      }

      const stockAfter = stockBefore - stockOutDto.quantity;

      const updatedProduct = await tx.product.update({
        where: { id: stockOutDto.productId },
        data: {
          stockQuantity: stockAfter,
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          reference: stockOutDto.reference ?? `STOCK-OUT-${Date.now()}`,
          type: InventoryMovementType.STOCK_OUT,
          productId: stockOutDto.productId,
          businessId: stockOutDto.businessId,
          branchId: stockOutDto.branchId,
          createdById: stockOutDto.createdById,
          quantityChange: -stockOutDto.quantity,
          stockBefore,
          stockAfter,
          reason: stockOutDto.reason ?? 'Stock removed',
        },
        include: {
          product: true,
          business: true,
          branch: true,
          createdBy: true,
        },
      });

      return {
        message: 'Stock removed successfully',
        updatedProduct,
        movement,
      };
    });
  }

  async adjustStock(adjustStockDto: AdjustStockDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await this.validateCommonData(
        tx,
        adjustStockDto.productId,
        adjustStockDto.businessId,
        adjustStockDto.branchId,
        adjustStockDto.createdById,
      );

      const stockBefore = product.stockQuantity;
      const stockAfter = adjustStockDto.newStockQuantity;
      const quantityChange = stockAfter - stockBefore;

      const updatedProduct = await tx.product.update({
        where: { id: adjustStockDto.productId },
        data: {
          stockQuantity: stockAfter,
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          reference: adjustStockDto.reference ?? `ADJUST-${Date.now()}`,
          type: InventoryMovementType.ADJUSTMENT,
          productId: adjustStockDto.productId,
          businessId: adjustStockDto.businessId,
          branchId: adjustStockDto.branchId,
          createdById: adjustStockDto.createdById,
          quantityChange,
          stockBefore,
          stockAfter,
          reason: adjustStockDto.reason ?? 'Stock adjusted',
        },
        include: {
          product: true,
          business: true,
          branch: true,
          createdBy: true,
        },
      });

      return {
        message: 'Stock adjusted successfully',
        updatedProduct,
        movement,
      };
    });
  }

  async findAllMovements() {
    return this.prisma.inventoryMovement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: true,
        business: true,
        branch: true,
        createdBy: true,
      },
    });
  }

  async findMovementsByProduct(productId: string) {
    return this.prisma.inventoryMovement.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: true,
        business: true,
        branch: true,
        createdBy: true,
      },
    });
  }
}
