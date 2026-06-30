import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentServices } from './appointments.service';

describe('AppointmentServices', () => {
    let service: AppointmentServices;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AppointmentServices,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<AppointmentServices>(AppointmentServices);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
