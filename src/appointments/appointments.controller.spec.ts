import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentServices } from './appointments.service';
import { AppointmentServicesDoctorImpl } from './core/appointment-services-doctor-impl';
import { AppointmentServicesPatientImpl } from './core/appointment-services-patient-impl';

describe('AppointmentsController', () => {
    let controller: AppointmentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppointmentsController],
            providers: [
                {
                    provide: AppointmentServices,
                    useValue: {},
                },
                {
                    provide: AppointmentServicesDoctorImpl,
                    useValue: {},
                },
                {
                    provide: AppointmentServicesPatientImpl,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<AppointmentsController>(AppointmentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
