import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateAppointmentResponseDto } from './dto/create-appointment-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';

import { PatientProfile } from '../patient-profiles/entities/patient-profile.entity';
import { DoctorProfile } from '../doctor-profiles/entities/doctor-profile.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepository: Repository<Appointment>,
        @InjectRepository(PatientProfile)
        private readonly patientProfileRepository: Repository<PatientProfile>,
        @InjectRepository(DoctorProfile)
        private readonly doctorProfileRepository: Repository<DoctorProfile>,
    ) {}
    async create(
        createAppointmentDto: CreateAppointmentDto,
    ): Promise<CreateAppointmentResponseDto> {
        const appointment = this.appointmentRepository.create({
            patient: { id: createAppointmentDto.patient },
            doctor: { id: createAppointmentDto.doctor },
            appointment_date: new Date(createAppointmentDto.appointment_date),
            appointment_status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
            diagnosis: '',
            total_bills: 0,
            paid: false,
        });

        const savedAppointment =
            await this.appointmentRepository.save(appointment);
        return savedAppointment;
    }

    async findAll(user: { sub: number; role: string }) {
        if (user.role === 'patient') {
            const patientProfile = await this.patientProfileRepository.findOne({
                where: { user: { id: user.sub } },
            });
            if (!patientProfile) {
                return [];
            }
            return this.appointmentRepository.find({
                where: { patient: { id: patientProfile.id } },
                relations: {
                    patient: { user: true },
                    doctor: { user: true },
                },
            });
        }

        if (user.role === 'doctor') {
            const doctorProfile = await this.doctorProfileRepository.findOne({
                where: { user: { id: user.sub } },
            });
            if (!doctorProfile) {
                return [];
            }
            return this.appointmentRepository.find({
                where: { doctor: { id: doctorProfile.id } },
                relations: {
                    patient: { user: true },
                    doctor: { user: true },
                },
            });
        }

        return this.appointmentRepository.find({
            relations: {
                patient: { user: true },
                doctor: { user: true },
            },
        });
    }

    async findOne(id: number) {
        const appointment = await this.appointmentRepository.findOneBy({ id });
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    }

    async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
        const appointment = await this.findOne(id);
        if (updateAppointmentDto.appointment_date) {
            appointment.appointment_date = new Date(
                updateAppointmentDto.appointment_date,
            );
        }
        if (updateAppointmentDto.patient) {
            appointment.patient = {
                id: updateAppointmentDto.patient,
            } as PatientProfile;
        }
        if (updateAppointmentDto.doctor) {
            appointment.doctor = {
                id: updateAppointmentDto.doctor,
            } as DoctorProfile;
        }
        appointment.updated_at = new Date();
        return await this.appointmentRepository.save(appointment);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.appointmentRepository.delete(id);
        return;
    }
}
