import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type TenantUser = {
  id: string;
  role?: string;
};

@Injectable()
export class TenantSecurityService {
  constructor(private readonly prisma: PrismaService) {}

  private isPlatformAdmin(user: TenantUser): boolean {
    return user.role === 'ADMIN';
  }

  private denyUntilMembershipIsConfigured(): never {
    throw new ForbiddenException(
      'Tenant membership is not configured for this user. Access denied by default.',
    );
  }

  async assertUserCanAccessBusiness(
    user: TenantUser,
    businessId: string,
  ): Promise<void> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    if (this.isPlatformAdmin(user)) {
      return;
    }

    this.denyUntilMembershipIsConfigured();
  }

  async assertUserCanAccessBranch(
    user: TenantUser,
    branchId: string,
  ): Promise<void> {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found.');
    }

    await this.assertUserCanAccessBusiness(user, branch.businessId);
  }

  async assertUserCanAccessProduct(
    user: TenantUser,
    productId: string,
  ): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.assertUserCanAccessBusiness(user, product.businessId);
  }

  async assertUserCanAccessPosSale(
    user: TenantUser,
    saleId: string,
  ): Promise<void> {
    const sale = await this.prisma.posSale.findUnique({
      where: { id: saleId },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('POS sale not found.');
    }

    await this.assertUserCanAccessBusiness(user, sale.businessId);
  }

  async assertUserCanAccessInventoryMovement(
    user: TenantUser,
    movementId: string,
  ): Promise<void> {
    const movement = await this.prisma.inventoryMovement.findUnique({
      where: { id: movementId },
      select: {
        id: true,
        product: {
          select: {
            businessId: true,
          },
        },
      },
    });

    if (!movement) {
      throw new NotFoundException('Inventory movement not found.');
    }

    await this.assertUserCanAccessBusiness(user, movement.product.businessId);
  }
}
