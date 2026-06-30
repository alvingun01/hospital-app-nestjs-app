import { Module } from '@nestjs/common';
import { AppointmentServices } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientProfilesModule } from '../patient-profiles/patient-profiles.module';
import { DoctorProfilesModule } from '../doctor-profiles/doctor-profiles.module';
import { AppointmentServicesDoctorImpl } from './core/appointment-services-doctor-impl';
import { AppointmentServicesPatientImpl } from './core/appointment-services-patient-impl';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment]),
        PatientProfilesModule,
        DoctorProfilesModule,
    ],
    controllers: [AppointmentsController],
    providers: [
        AppointmentServicesDoctorImpl,
        AppointmentServicesPatientImpl,
        {
            provide: AppointmentServices,
            useClass: AppointmentServicesPatientImpl,
        },
    ],
    exports: [
        AppointmentServices,
        AppointmentServicesDoctorImpl,
        AppointmentServicesPatientImpl,
        TypeOrmModule,
    ],
})
export class AppointmentsModule { }
