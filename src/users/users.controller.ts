import { Controller, Get, Post, Param, Delete, Body, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({summary: 'Récupérer tous les utilisateursn (admin uniquement)'})
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(){
        return this.usersService.findAll()
    }

    @ApiOperation({summary:'Récupérer un utilisateur par ID'})
    @UseGuards(JwtAuthGuard)
    @ApiParam({name: 'id', type: 'string', description:`ID de l'utilisateur`})
    @Get(':id')
    async findOne(@Param('id') id:string){
        return this.usersService.findOne(id)
    }

    @ApiOperation({summary:'Créer un utilisateur'})
    @ApiBody({schema: {example:{name: 'John Doe', email: 'john@example.com', password: '123456'}}})
    @Post()
    async create(@Body() data:{name: string, email: string, password: string}) {
        return this.usersService.create(data)
    }

    @ApiOperation({ summary: 'Supprimer un utilisateur (seulement si c’est son propre compte)' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }

    @ApiOperation({ summary: 'Mettre à jour un utilisateur'})
    @UseGuards(JwtAuthGuard)
    @ApiParam({name:'id', type:'string', description:`ID de l'utilisateur`})
    @ApiBody({type: UpdateUserDto})
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return this.usersService.update(id, updateUserDto)
    }
}
