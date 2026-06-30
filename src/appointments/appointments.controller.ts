import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AppointmentServices } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateAppointmentResponseDto } from './dto/create-appointment-response.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { UpdateAppointmentResponseDto } from './dto/update-appointment-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AppointmentServicesDoctorImpl } from './core/appointment-services-doctor-impl';
import { AppointmentServicesPatientImpl } from './core/appointment-services-patient-impl';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(
        private readonly appointmentsService: AppointmentServices,
        private readonly appointmentServicesDoctorImpl: AppointmentServicesDoctorImpl,
        private readonly appointmentServicesPatientImpl: AppointmentServicesPatientImpl,
    ) { }

    @Post()
    async create(
        @Body() createAppointmentDto: CreateAppointmentDto,
    ): Promise<CreateAppointmentResponseDto> {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    async findAll(
        @Req() req: { user: { sub: number; role: string } },
    ): Promise<AppointmentResponseDto[]> {
        let service: AppointmentServices;
        if (req.user.role == 'patient') {
            service = this.appointmentServicesPatientImpl;
        } else if (req.user.role == 'doctor') {
            service = this.appointmentServicesDoctorImpl;
        } else {
            throw new Error('Invalid user');
        }
        return service.findAll(req.user);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<AppointmentResponseDto> {
        return this.appointmentsService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAppointmentDto: UpdateAppointmentDto,
    ): Promise<UpdateAppointmentResponseDto> {
        return this.appointmentsService.update(+id, updateAppointmentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(+id);
    }
}
