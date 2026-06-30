import { User } from 'src/users/entities/user.entity';

export class DoctorProfileResponseDto {
    id: number;
    specialization: string;
    experience: string;
    bio: string;
    user: User;
}
