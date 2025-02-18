import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';
import { group } from 'console';
@Controller('groups')
@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Récupérer tous les groupes' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.groupsService.findAll;
  }

  @ApiOperation({ summary: 'Récupérer un groupe par ID' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string', description: 'ID du groupe' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Créer un groupe automatiquement après un évènement',
  })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'eventId',
    type: 'string',
    description: `ID de l'évènement`,
  })
  @Post(':eventId')
  async create(@Param('eventId') eventId: string) {
    return this.groupsService.create(eventId);
  }

  @ApiOperation({ summary: 'Supprimer un groupe' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.groupsService.delete(id);
  }

  @ApiOperation({ summary: 'Ajouter un utilisateur à un groupe' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'groupId', type: 'string' })
  @ApiParam({ name: 'userId', type: 'string' })
  @Post(':groupId/addUser/:userId')
  async addUser(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupsService.addUserToGroup(groupId, userId);
  }

  @ApiOperation({ summary: 'Retirer un utilisateur d"un groupe' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'groupId', type: 'string' })
  @ApiParam({ name: 'userId', type: 'string' })
  @Delete(':groupId/removeUser/:userId')
  async deleteUser(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupsService.removeUserFromGroup(groupId, userId);
  }
}
