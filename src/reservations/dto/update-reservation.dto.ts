import { ReservationStatus } from '@prisma/client';

export class UpdateReservationDto {
  status?: ReservationStatus;
}
