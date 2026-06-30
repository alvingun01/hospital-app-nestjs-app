import { User } from 'src/users/entities/user.entity';

export class CreateDoctorProfileResponseDto {
    id: number;
    specialization: string;
    experience: string;
    bio: string;
    user: User;
}
