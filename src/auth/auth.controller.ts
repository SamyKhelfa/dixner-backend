import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Créer un compte utilisateur' })
    @ApiBody({ type: RegisterDto })  
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return this.authService.register(data.name, data.email, data.password);
    }

    @ApiOperation({ summary: 'Se connecter' })
    @ApiBody({ type: LoginDto })  
    @Post('login')
    async login(@Body() data: LoginDto) {
        return this.authService.login(data.email, data.password);
    }
}