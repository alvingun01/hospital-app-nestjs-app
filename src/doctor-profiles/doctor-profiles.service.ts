import { Injectable } from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { Repository } from 'typeorm';
import { CreateDoctorProfileResponseDto } from './dto/create-doctor-profile-response.dto';
import { DoctorProfileResponseDto } from './dto/doctor-profile-response.dto';

@Injectable()
export class DoctorProfilesService {
    constructor(
        @InjectRepository(DoctorProfile)
        private readonly doctorProfileRepository: Repository<DoctorProfile>,
    ) {}
    async create(
        createDoctorProfileDto: CreateDoctorProfileDto,
    ): Promise<CreateDoctorProfileResponseDto> {
        const doctorProfile = await this.doctorProfileRepository.save(
            createDoctorProfileDto,
        );
        return {
            bio: doctorProfile.bio,
            experience: doctorProfile.experience,
            id: doctorProfile.id,
            specialization: doctorProfile.specialization,
            user: doctorProfile.user,
        };
    }

    async findAll(): Promise<DoctorProfileResponseDto[]> {
        const doctorProfiles = await this.doctorProfileRepository.find({
            relations: { user: true },
        });
        return doctorProfiles.map((doctorProfile) => ({
            bio: doctorProfile.bio,
            experience: doctorProfile.experience,
            id: doctorProfile.id,
            specialization: doctorProfile.specialization,
            user: doctorProfile.user,
        }));
    }

    async findOne(id: number): Promise<DoctorProfileResponseDto> {
        const doctorProfile = await this.doctorProfileRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!doctorProfile) {
            throw new Error('Doctor profile not found');
        }
        return {
            bio: doctorProfile.bio,
            experience: doctorProfile.experience,
            id: doctorProfile.id,
            specialization: doctorProfile.specialization,
            user: doctorProfile.user,
        };
    }

    async update(
        id: number,
        updateDoctorProfileDto: UpdateDoctorProfileDto,
    ): Promise<DoctorProfileResponseDto> {
        await this.findOne(id);
        await this.doctorProfileRepository.update(id, updateDoctorProfileDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.doctorProfileRepository.delete(id);
        return;
    }
}
