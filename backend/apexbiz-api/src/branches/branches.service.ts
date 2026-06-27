import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    const business = await this.prisma.business.findUnique({
      where: {
        id: createBranchDto.businessId,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const existingBranch = await this.prisma.branch.findUnique({
      where: {
        code: createBranchDto.code,
      },
    });

    if (existingBranch) {
      throw new BadRequestException('Branch code already exists');
    }

    const branch = await this.prisma.branch.create({
      data: createBranchDto,
      include: {
        business: true,
      },
    });

    return {
      message: 'Branch created successfully',
      branch,
    };
  }

  async findAll() {
    return this.prisma.branch.findMany({
      include: {
        business: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id);

    const branch = await this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
      include: {
        business: true,
      },
    });

    return {
      message: 'Branch updated successfully',
      branch,
    };
  }
}
