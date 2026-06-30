import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { Repository } from 'typeorm';
import { CreatePatientProfileResponseDto } from './dto/create-patient-profile-response.dto';
import { PatientProfileResponseDto } from './dto/patient-profile-response.dto';

@Injectable()
export class PatientProfilesService {
    constructor(
        @InjectRepository(PatientProfile)
        private readonly patientProfileRepository: Repository<PatientProfile>,
    ) {}

    async create(
        createPatientProfileDto: CreatePatientProfileDto,
    ): Promise<CreatePatientProfileResponseDto> {
        const createUser = await this.patientProfileRepository.save(
            createPatientProfileDto,
        );
        return {
            id: createUser.id,
            user: createUser.user,
            phone: createUser.phone,
            address: createUser.address,
            city: createUser.city,
            state: createUser.state,
            zip_code: createUser.zip_code,
            country: createUser.country,
        };
    }

    async findAll(): Promise<PatientProfileResponseDto[]> {
        const patientProfiles = await this.patientProfileRepository.find({
            relations: { user: true },
        });
        return patientProfiles.map((patientProfile) => ({
            id: patientProfile.id,
            user: patientProfile.user,
            phone: patientProfile.phone,
            address: patientProfile.address,
            city: patientProfile.city,
            state: patientProfile.state,
            zip_code: patientProfile.zip_code,
            country: patientProfile.country,
        }));
    }

    async findOne(id: number): Promise<PatientProfileResponseDto> {
        const patientProfile = await this.patientProfileRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!patientProfile) {
            throw new NotFoundException(
                `Patient profile with ID ${id} not found`,
            );
        }
        return {
            id: patientProfile.id,
            user: patientProfile.user,
            phone: patientProfile.phone,
            address: patientProfile.address,
            city: patientProfile.city,
            state: patientProfile.state,
            zip_code: patientProfile.zip_code,
            country: patientProfile.country,
        };
    }

    async update(
        id: number,
        updatePatientProfileDto: UpdatePatientProfileDto,
    ): Promise<PatientProfileResponseDto> {
        await this.findOne(id); // Ensure user exists
        await this.patientProfileRepository.update(id, updatePatientProfileDto);
        const updatedPatientProfile = await this.findOne(id);
        return updatedPatientProfile;
    }

    async remove(id: number) {
        await this.findOne(id); // Ensure user exists
        await this.patientProfileRepository.delete(id);
        return;
    }
}
