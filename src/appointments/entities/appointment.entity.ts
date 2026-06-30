import { DoctorProfile } from 'src/doctor-profiles/entities/doctor-profile.entity';
import { PatientProfile } from 'src/patient-profiles/entities/patient-profile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PatientProfile)
    patient: PatientProfile;

    @ManyToOne(() => DoctorProfile)
    doctor: DoctorProfile;

    @Column()
    appointment_date: Date;

    @Column()
    appointment_status: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    diagnosis: string;

    @Column()
    total_bills: number;

    @Column()
    paid: boolean;
}
