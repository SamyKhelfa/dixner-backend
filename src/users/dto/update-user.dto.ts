import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ example: 'John Doe', description: "Nom de l'utilisateur", required: false })
    name?: string;

    @ApiProperty({ example: 'john@example.com', description: "Email de l'utilisateur", required: false })
    email?: string;

    @ApiProperty({ example: 'newpassword123', description: 'Nouveau mot de passe', required: false })
    password?: string;
}