import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { PatientProfilesService } from './patient-profiles.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientProfilesController {
    constructor(
        private readonly patientProfilesService: PatientProfilesService,
    ) {}

    @Post()
    create(@Body() createPatientProfileDto: CreatePatientProfileDto) {
        return this.patientProfilesService.create(createPatientProfileDto);
    }

    @Get()
    findAll() {
        return this.patientProfilesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.patientProfilesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePatientProfileDto: UpdatePatientProfileDto,
    ) {
        return this.patientProfilesService.update(+id, updatePatientProfileDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.patientProfilesService.remove(+id);
    }
}
