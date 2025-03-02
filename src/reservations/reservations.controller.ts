import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Récupérer toutes les réservations (Admin)' })
  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer une réservation par ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de a réservation' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiBody({ type: CreateReservationDto })
  @Post()
  async create(@Request() req, @Body() data: CreateReservationDto) {
    return this.reservationsService.create(req.user.userId, data);
  }

  @ApiOperation({ summary: 'Modifier une réservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la réservation' })
  @ApiBody({ type: UpdateReservationDto })
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateReservationDto) {
    return this.reservationsService.update(id, data);
  }

  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la réservation' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }
}
