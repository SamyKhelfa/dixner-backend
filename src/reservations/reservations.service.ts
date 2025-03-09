import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import * as nodemailer from 'nodemailer';

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

  async cancelReservation(userId: string, eventId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!reservation) {
      throw new Error('Aucune réservation trouvée pour cet événement.');
    }

    await this.prisma.reservation.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { users: true },
    });

    if (event && event.users.length < event.maxParticipants) {
      const availableUsers = await this.prisma.user.findMany({
        where: {
          id: { notIn: event.users.map((user) => user.userId) },
        },
      });

      availableUsers.forEach((user) => {
        this.sendNotification(user.email, event.name);
      });
    }

    return { message: 'Votre réservation a bien été annulée.' };
  }

  async sendNotification(email: string, eventName: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Une place s’est libérée !',
      text: `Une place s'est libérée pour l'événement ${eventName} ! Réservez vite avant qu'il ne soit complet !`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Email envoyé à ${email} !`);
  }
}
