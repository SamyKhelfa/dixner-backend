import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { get } from 'http';
import { RegisterEventDto } from './dto/register-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Récupérer tous les événements' })
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un événement par ID' })
  @ApiParam({ name: 'id', type: 'string', description: "ID de l'événement" })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer un nouvel événement (Admin uniquement)' })
  @ApiBody({ type: CreateEventDto })
  @Post()
  async create(@Body() data: CreateEventDto) {
    return this.eventsService.create(data);
  }

  @ApiOperation({ summary: 'Inscrire l’utilisateur connecté à un événement' })
  @ApiParam({ name: 'id', type: 'string', description: "ID de l'événement" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async registerUser(@Param('id') eventId: string, @Request() req) {
    const userId = req.user.userId;

    const event = await this.eventsService.findOne(eventId);
    if (!event) {
      throw new Error("L'événement n'existe pas.");
    }

    if (event.users && event.users.length >= event.maxParticipants) {
      throw new Error(
        'Le nombre maximal de participants est atteint pour cet événement.',
      );
    }

    return this.eventsService.registerUser(eventId, userId);
  }

  @ApiOperation({ summary: 'Supprimer un événement (Admin uniquement)' })
  @ApiParam({ name: 'id', type: 'string', description: "ID de l'événement" })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

  @ApiOperation({
    summary:
      'Récupérer tous les évènements auxquels un utilisateur est inscrit',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: "ID de l'utilisateur",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getEventsforUser(@Param('userId') userId: string) {
    return this.eventsService.getEventsforUser(userId);
  }

  @ApiOperation({ summary: "Se désinscrire d'un événement" })
  @ApiParam({ name: 'id', type: 'string', description: "ID de l'événement" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/unregister')
  async unregisterUser(
    @Param('id') eventId: string,
    @Body() data: RegisterEventDto,
  ) {
    if (!data.userId) {
      throw new Error('userId est requis pour se désinscrire');
    }
    return this.eventsService.unregisterUser(eventId, data.userId);
  }

  @ApiOperation({
    summary: "Se désinscrire de l'événement (utilisateur connecté)",
  })
  @ApiParam({ name: 'id', type: 'string', description: "ID de l'événement" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/unregister/me')
  async unregisterAuthenticatedUser(
    @Param('id') eventId: string,
    @Request() req,
  ) {
    return this.eventsService.unregisterAuthenticatedUser(
      eventId,
      req.user.userId,
    );
  }
}
