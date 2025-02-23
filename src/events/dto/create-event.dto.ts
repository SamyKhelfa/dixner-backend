import { IsString, IsDateString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(1)
  maxParticipants: number;
}
