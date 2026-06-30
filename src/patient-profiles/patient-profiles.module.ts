import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfilesService } from './patient-profiles.service';
import { PatientProfilesController } from './patient-profiles.controller';
import { PatientProfile } from './entities/patient-profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PatientProfile])],
    controllers: [PatientProfilesController],
    providers: [PatientProfilesService],
    exports: [PatientProfilesService, TypeOrmModule],
})
export class PatientProfilesModule {}
