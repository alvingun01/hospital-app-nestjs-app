import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
    @IsInt()
    @IsNotEmpty()
    patient: number;

    @IsInt()
    @IsNotEmpty()
    doctor: number;

    @IsDateString()
    @IsNotEmpty()
    appointment_date: string;
}
