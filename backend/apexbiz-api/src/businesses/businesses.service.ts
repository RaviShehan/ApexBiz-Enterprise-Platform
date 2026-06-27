import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto) {
    const existingBusiness = await this.prisma.business.findUnique({
      where: {
        name: createBusinessDto.name,
      },
    });

    if (existingBusiness) {
      throw new BadRequestException('Business name already exists');
    }

    const business = await this.prisma.business.create({
      data: createBusinessDto,
    });

    return {
      message: 'Business created successfully',
      business,
    };
  }

  async findAll() {
    return this.prisma.business.findMany({
      include: {
        branches: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        branches: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto) {
    await this.findOne(id);

    const business = await this.prisma.business.update({
      where: { id },
      data: updateBusinessDto,
    });

    return {
      message: 'Business updated successfully',
      business,
    };
  }
}
