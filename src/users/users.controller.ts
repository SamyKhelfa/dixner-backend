import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({summary: 'Récupérer tous les utilisateurs'})
    @Get()
    async findAll(){
        return this.usersService.findAll()
    }

    @ApiOperation({summary:'Récupérer un utilisateur par ID'})
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

    @ApiOperation({summary: 'Supprimer un utilisateur'})
    @ApiParam({name:'id', type: 'String', description:`ID de l'utilisateur`})
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id)
    }
}
