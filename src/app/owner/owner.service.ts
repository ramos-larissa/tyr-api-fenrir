import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Owner } from '@prisma/client';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOwnerDto: CreateOwnerDto) {
    const isCpfCnpjExists = await this.prisma.owner.findUnique({
      where: {
        cpf_cnpj: createOwnerDto.cpf_cnpj,
      },
    });

    if (isCpfCnpjExists) {
      throw new Error('CPF/CNPJ already exists');
    }

    const data: Prisma.OwnerCreateInput = {
      ...createOwnerDto,
    };

    const createdOwner = await this.prisma.owner.create({ data });

    return {
      ...createdOwner,
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const take = limit;
    const customers = await this.prisma.owner.findMany({
      skip: isNaN(skip) ? 0 : skip,
      take: isNaN(take) ? 2 : take,
    });
    const total = await this.prisma.owner.count();
    return { data: customers, total };
  }

  async findById(id: string): Promise<Owner> {
    if (!id) {
      throw new Error('ID is required');
    }
    return await this.prisma.owner.findUnique({ where: { id } });
  }

  async findOne(value: string): Promise<Owner> {
    if (!value) {
      throw new Error('Value is required');
    }
    let owner: any;
    switch (true) {
      case value.includes('@'): // assume it's an email
        owner = await this.prisma.owner.findMany({ where: { email: value } });
        break;
      default: // assume it's cpf_cnpj
        owner = await this.prisma.owner.findUnique({
          where: { cpf_cnpj: value },
        });
        break;
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: UpdateOwnerDto) {
    return await this.prisma.owner.update({
      where: {
        id: id,
      },
      data: updateOwnerDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.owner.delete({
      where: {
        id: id,
      },
    });
  }
}
