import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({example:'John Doe', description: "Nom de l'utilisateur"})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'john@example.com', description:"Email de l'utilisateur"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: '123456', description: 'Mot de passe (min 6 caractères)'})
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}