import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { group } from 'console';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany({
      include: { users: true, group: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { users: true, group: true },
    });
  }

  async create(data: CreateEventDto) {
    const event = await this.prisma.event.create({
      data,
    });

    await this.prisma.group.create({
      data: {
        eventId: event.id,
      },
    });

    return event;
  }

  async delete(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }

  async registerUser(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { group: true, users: true },
    });

    if (!event) {
      throw new Error('Event non trouvé');
    }

    const alreadyRegistered = await this.prisma.eventUser.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (alreadyRegistered) {
      throw new Error('Utilisateur déjà inscrit à cet événement');
    }

    const currentParticipants = event.users.length;
    if (currentParticipants >= event.maxParticipants) {
      throw new Error(
        'Le nombre maximal de participants est atteint pour cet évènement',
      );
    }

    await this.prisma.eventUser.create({
      data: { eventId, userId },
    });

    if (event.group) {
      await this.prisma.groupUser.create({
        data: { groupId: event.group.id, userId },
      });
    }

    return { message: "Utilisateur inscrit à l'événement et ajouté au groupe" };
  }

  async getEventsforUser(userId: string) {
    return this.prisma.event.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: { group: true },
    });
  }

  async unregisterUser(eventId: string, userId: string) {
    const userEvent = await this.prisma.eventUser.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!userEvent) {
      throw new Error("L'utilisateur n'est pas inscrit à cet événement.");
    }

    return this.prisma.eventUser.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
  }

  async unregisterAuthenticatedUser(eventId: string, userId: string) {
    const userEvent = await this.prisma.eventUser.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!userEvent) {
      throw new Error("Vous n'êtes pas inscrit à cet événement.");
    }

    await this.prisma.eventUser.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    return { message: "Vous vous êtes désinscrit de l'événement avec succès." };
  }
}
