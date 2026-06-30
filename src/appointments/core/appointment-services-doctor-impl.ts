import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { PatientProfile } from '../../patient-profiles/entities/patient-profile.entity';
import { DoctorProfile } from '../../doctor-profiles/entities/doctor-profile.entity';
import { AppointmentServices } from '../appointments.service';

@Injectable()
export class AppointmentServicesDoctorImpl extends AppointmentServices {
    constructor(
        @InjectRepository(Appointment)
        appointmentRepository: Repository<Appointment>,
        @InjectRepository(PatientProfile)
        patientProfileRepository: Repository<PatientProfile>,
        @InjectRepository(DoctorProfile)
        doctorProfileRepository: Repository<DoctorProfile>,
    ) {
        super(
            appointmentRepository,
            patientProfileRepository,
            doctorProfileRepository,
        );
    }
    async findAll(user: { sub: number; role: string }): Promise<Appointment[]> {
        return this.appointmentRepository.find({
            where: {
                doctor: {
                    user: { id: user.sub },
                },
            },
            relations: {
                patient: { user: true },
                doctor: { user: true },
            },
        });
    }
    async findOne(id: number): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                patient: { user: true },
                doctor: { user: true },
            },
        });
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    }
}
