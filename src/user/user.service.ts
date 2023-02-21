import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const defaultPermission = createUserDto.permission;

    if (!defaultPermission || defaultPermission === '') {
      createUserDto.permission = 'user';
    }

    if (defaultPermission !== 'admin' && defaultPermission !== 'user') {
      createUserDto.permission = 'user';
    }

    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });

    return newUser;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findOneByCpf(cpf: string) {
    return await this.prisma.user.findUnique({
      where: {
        cpf: cpf,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
