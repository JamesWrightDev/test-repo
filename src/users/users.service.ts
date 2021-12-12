import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async user(extnernal_id: string, username: string): Promise<User | null> {
    let user: User;
    const existingUser = await this.prisma.user.findFirst({
      where: { external_Id: extnernal_id },
    });
    if (!existingUser) {
      user = await this.prisma.user.create({
        data: { external_Id: extnernal_id, username: username },
      });
    } else {
      user = existingUser;
    }

    return user;
  }

  findOrCreate(id: string, username: string) {
    return `This action returns a #${id} user`;
  }
}
