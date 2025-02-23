import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    return this.prisma.user.create({ data });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("L'utilisateur n'existe pas");
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async update(id: string, data: Partial<CreateUserDto>) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new Error(`L'utilisateur avec l'ID ${id} n'existe pas.`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async promoteToAdmin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
    });
  }
}
