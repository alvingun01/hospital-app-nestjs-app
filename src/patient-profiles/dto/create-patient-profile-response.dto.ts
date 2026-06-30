import { User } from 'src/users/entities/user.entity';

export class CreatePatientProfileResponseDto {
    id: number;
    user: User;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
}
