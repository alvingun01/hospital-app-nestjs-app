import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProfilesService } from './doctor-profiles.service';

describe('DoctorProfilesService', () => {
    let service: DoctorProfilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DoctorProfilesService],
        }).compile();

        service = module.get<DoctorProfilesService>(DoctorProfilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
