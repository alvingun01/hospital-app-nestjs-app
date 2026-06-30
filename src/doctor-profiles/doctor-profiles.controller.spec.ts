import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProfilesController } from './doctor-profiles.controller';
import { DoctorProfilesService } from './doctor-profiles.service';

describe('DoctorProfilesController', () => {
    let controller: DoctorProfilesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DoctorProfilesController],
            providers: [DoctorProfilesService],
        }).compile();

        controller = module.get<DoctorProfilesController>(
            DoctorProfilesController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
