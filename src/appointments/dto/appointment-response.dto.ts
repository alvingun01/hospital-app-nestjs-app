import { DoctorProfile } from 'src/doctor-profiles/entities/doctor-profile.entity';
import { PatientProfile } from 'src/patient-profiles/entities/patient-profile.entity';

export class AppointmentResponseDto {
    id: number;
    patient: PatientProfile;
    doctor: DoctorProfile;
    appointment_date: Date;
    appointment_status: string;
    created_at: Date;
    updated_at: Date;
    diagnosis: string;
    total_bills: number;
    paid: boolean;
}
