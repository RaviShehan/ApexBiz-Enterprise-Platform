import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: createProductDto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          sku: createProductDto.sku,
          barcode: createProductDto.barcode,
          description: createProductDto.description,
          sellingPriceCents: createProductDto.sellingPriceCents,
          costPriceCents: createProductDto.costPriceCents ?? 0,
          stockQuantity: createProductDto.stockQuantity ?? 0,
          reorderLevel: createProductDto.reorderLevel ?? 0,
          businessId: createProductDto.businessId,
        },
        include: {
          business: true,
        },
      });

      return {
        message: 'Product created successfully',
        product,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Product SKU or barcode already exists');
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        business: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          business: true,
        },
      });

      return {
        message: 'Product updated successfully',
        product,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Product SKU or barcode already exists');
      }

      throw error;
    }
  }

    async findLowStock() {
    const products = await this.prisma.product.findMany({
      orderBy: {
        stockQuantity: 'asc',
      },
      include: {
        business: true,
      },
    });

    return products.filter(
      (product) => product.stockQuantity <= product.reorderLevel,
    );
  }
}
