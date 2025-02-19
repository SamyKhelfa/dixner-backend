import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.group.findMany({
      include: { members: true, event: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: { members: true, event: true },
    });
  }

  async create(eventId: string) {
    return this.prisma.group.create({
      data: { eventId },
    });
  }

  async delete(id: string) {
    return this.prisma.group.delete({ where: { id } });
  }

  async addUserToGroup(groupId: string, userId: string) {
    return this.prisma.groupUser.create({
      data: { groupId, userId },
    });
  }

  async removeUserFromGroup(groupId: string, userId: string) {
    return this.prisma.groupUser.deleteMany({
      where: { groupId, userId },
    });
  }
}
