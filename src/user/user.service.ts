import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto) {
    const { fullname, email, password } = data;
    const emailExist = await this.prisma.user.findUnique({
      select: {
        email: true,
      },
      where: {
        email: data.email,
      },
    });
    if (emailExist) throw new ConflictException(`Email already exists.`);

    const newUser = await this.prisma.user.create({
      data: {
        fullname,
        email,
        password,
      },
    });
    if (newUser) {
      return newUser;
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
