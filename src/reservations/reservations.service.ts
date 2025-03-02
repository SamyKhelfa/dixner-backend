import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservation.findMany({
      include: { user: true, event: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { user: true, event: true },
    });
  }

  async create(userId: string, data: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        userId,
        eventId: data.eventId,
        date: data.date,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, data: UpdateReservationDto) {
    return this.prisma.reservation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}
