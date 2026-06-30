import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from 'src/patient-profiles/entities/patient-profile.entity';
import { DoctorProfile } from 'src/doctor-profiles/entities/doctor-profile.entity';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { CreateAppointmentResponseDto } from 'src/appointments/dto/create-appointment-response.dto';
import { UpdateAppointmentDto } from 'src/appointments/dto/update-appointment.dto';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export abstract class AppointmentServices {
    constructor(
        @InjectRepository(Appointment)
        protected readonly appointmentRepository: Repository<Appointment>,
        @InjectRepository(PatientProfile)
        protected readonly patientProfileRepository: Repository<PatientProfile>,
        @InjectRepository(DoctorProfile)
        protected readonly doctorProfileRepository: Repository<DoctorProfile>,
    ) { }
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

    abstract findAll(user: {
        sub: number;
        role: string;
    }): Promise<Appointment[]>;

    abstract findOne(id: number): Promise<Appointment>;

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
