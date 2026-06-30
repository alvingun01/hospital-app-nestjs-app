import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { PatientProfile } from '../patient-profiles/entities/patient-profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(PatientProfile)
        private readonly patientProfileRepository: Repository<PatientProfile>,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto): Promise<UserResponseDto> {
        const {
            name,
            email,
            password,
            phone,
            address,
            city,
            state,
            zip_code,
            country,
        } = registerDto;

        // Check if user already exists
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictException(
                'A user with this email address already exists',
            );
        }

        // Split name into first_name and last_name
        const [first_name, ...lastNames] = name.trim().split(' ');
        const last_name = lastNames.join(' ') || '';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the User
        const user = this.userRepository.create({
            username: email, // use email as username
            email,
            password: hashedPassword,
            first_name,
            last_name,
            role: 'patient',
        });
        const savedUser = await this.userRepository.save(user);

        // Create the Patient Profile
        const patientProfile = this.patientProfileRepository.create({
            user: savedUser,
            phone,
            address,
            city,
            state,
            zip_code,
            country,
        });
        await this.patientProfileRepository.save(patientProfile);

        return {
            id: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            first_name: savedUser.first_name || '',
            last_name: savedUser.last_name || '',
            role: savedUser.role,
        };
    }

    async login(
        loginDto: LoginDto,
    ): Promise<{ token: string; user: UserResponseDto }> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Compare password hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                role: user.role,
            },
        };
    }
}
