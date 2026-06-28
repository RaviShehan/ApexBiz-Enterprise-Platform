import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MlInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessInsights() {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    const products = await (this.prisma as any).product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    const posSales = await (this.prisma as any).posSale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });

    const sales = posSales.flatMap((sale: any) => {
      const saleDate = sale.createdAt || new Date();

      return (sale.items || []).map((item: any) => ({
        productId: item.productId,
        productName: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        totalAmountCents:
          item.totalAmountCents ||
          item.lineTotalCents ||
          item.subtotalCents ||
          sale.totalAmountCents ||
          sale.totalCents ||
          0,
        saleDate,
      }));
    });

    const productStock = products.map((product: any) => ({
      productId: product.id,
      productName: product.name,
      stockQuantity: product.stockQuantity || 0,
      reorderLevel: product.reorderLevel || 0,
    }));

    try {
      const response = await fetch(`${mlServiceUrl}/analytics/business-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sales,
          products: productStock,
        }),
      });

      if (!response.ok) {
        throw new Error(`ML service returned status ${response.status}`);
      }

      const insights = await response.json();

      return {
        source: 'ApexBiz ML Service',
        mlServiceUrl,
        productsAnalyzed: productStock.length,
        salesRecordsAnalyzed: sales.length,
        insights,
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        message: 'ML service is not available. Start ml-service on port 8000.',
        mlServiceUrl,
        error: error instanceof Error ? error.message : 'Unknown ML service error',
      });
    }
  }
}
