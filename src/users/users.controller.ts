import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs (admin uniquement)',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string', description: `ID de l'utilisateur` })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiBody({
    schema: {
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      },
    },
  })
  @Post()
  async create(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.usersService.create(data);
  }

  @ApiOperation({
    summary: 'Supprimer un utilisateur (seulement si c’est son propre compte)',
  })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string', description: `ID de l'utilisateur` })
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    this.logger.log(`ID utilisateur connecté: ${req.user.userId}`);
    this.logger.log(`ID utilisateur à supprimer: ${id}`);

    if (req.user.userId !== id) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que votre propre compte.',
      );
    }

    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: 'string', description: `ID de l'utilisateur` })
  @ApiBody({ type: UpdateUserDto })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.userId != id) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre compte',
      );
    }

    return this.usersService.update(id, updateUserDto);
  }
}
