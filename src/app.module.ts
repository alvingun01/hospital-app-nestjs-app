import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { PatientProfilesModule } from './patient-profiles/patient-profiles.module';
import { DoctorProfilesModule } from './doctor-profiles/doctor-profiles.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: 'db.sqlite',
            autoLoadEntities: true,
            synchronize: true,
        }),
        UserModule,
        PatientProfilesModule,
        DoctorProfilesModule,
        AppointmentsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
