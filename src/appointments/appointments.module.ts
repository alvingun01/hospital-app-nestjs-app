import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientProfilesModule } from '../patient-profiles/patient-profiles.module';
import { DoctorProfilesModule } from '../doctor-profiles/doctor-profiles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment]),
        PatientProfilesModule,
        DoctorProfilesModule,
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService, TypeOrmModule],
})
export class AppointmentsModule {}
