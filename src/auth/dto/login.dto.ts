import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({example:'john@example.com', description:"Email de l'utilisateur"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example:'123456', description: 'Mot de passe'})
    @IsString()
    @IsNotEmpty()
    password: string;
}