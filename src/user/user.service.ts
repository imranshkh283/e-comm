import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from './users.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    data: CreateUserDto,
  ): Promise<Omit<User, 'createdAt' | 'updatedAt' | 'id'>> {
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
  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async updateProfile(user, data) {
    //console.log(data);
    //console.log(user.id);
    //console.log(typeof user.id);
    const profileExist = await this.prisma.profile.findFirst({
      where: {
        userId: user?.id,
      },
      select: {
        userId: true,
      },
    });
    console.log(profileExist);
    if (profileExist !== null) {
      // console.log('if');
      return this.prisma.profile.update({
        where: { userId: profileExist.userId },
        data: {
          ...data,
        },
      });
    } else {
      // console.log('else');
      return this.prisma.profile.create({
        data: {
          ...data,
          userId: user.id,
        },
        select: {
          address: true,
          city: true,
          pincode: true,
        },
      });
    }
  }

  createAdmin() {
    return this.prisma.user.create({
      data: {
        fullname: 'admin',
        email: 'admin@admin.com',
        password: 'admin@123',
        role: 'ADMIN',
      },
      select: {
        id: true,
      },
    });
  }
}
