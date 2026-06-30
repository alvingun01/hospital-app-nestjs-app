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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateAppointmentResponseDto } from './dto/create-appointment-response.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { UpdateAppointmentResponseDto } from './dto/update-appointment-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

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
        return this.appointmentsService.findAll(req.user);
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
