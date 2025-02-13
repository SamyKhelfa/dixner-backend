import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany()
    }

    async findOne(id : string){
        return this.prisma.user.findUnique({where:{id}})
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(data : {name: string; email: string; password: string}){
        return this.prisma.user.create({data})
    }

    async delete(id: string) {
        return this.prisma.user.delete({where: {id}})
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


}
