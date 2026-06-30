import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { DoctorProfile } from './doctor-profiles/entities/doctor-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

const doctorsData = [
    {
        email: 'elizabeth.blackwell@hospital.com',
        first_name: 'Elizabeth',
        last_name: 'Blackwell',
        specialization: 'Cardiology',
        experience: '12 years',
        bio: 'Specializes in cardiovascular health and preventative care.',
    },
    {
        email: 'benjamin.spock@hospital.com',
        first_name: 'Benjamin',
        last_name: 'Spock',
        specialization: 'Pediatrics',
        experience: '15 years',
        bio: 'Dedicated pediatrician focused on adolescent health and child development.',
    },
    {
        email: 'sigmund.freud@hospital.com',
        first_name: 'Sigmund',
        last_name: 'Freud',
        specialization: 'Psychiatry',
        experience: '20 years',
        bio: 'Expert in clinical psychiatry and cognitive behavioral therapy.',
    },
    {
        email: 'virginia.apgar@hospital.com',
        first_name: 'Virginia',
        last_name: 'Apgar',
        specialization: 'Anesthesiology',
        experience: '8 years',
        bio: 'Experienced anesthesiologist and intensive care specialist.',
    },
    {
        email: 'jonas.salk@hospital.com',
        first_name: 'Jonas',
        last_name: 'Salk',
        specialization: 'Immunology',
        experience: '18 years',
        bio: 'Focused on infectious disease prevention and immunology research.',
    },
];

async function bootstrap() {
    console.log('Bootstrapping NestJS application context for seeding...');
    // Create application context (loads TypeORM and runs synchronize)
    const app = await NestFactory.createApplicationContext(AppModule);

    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const doctorProfileRepository = app.get<Repository<DoctorProfile>>(
        getRepositoryToken(DoctorProfile),
    );

    const passwordHash = await bcrypt.hash('DoctorPass123!', 10);

    for (const data of doctorsData) {
        let user = await userRepository.findOneBy({ email: data.email });

        if (!user) {
            // Create user
            user = userRepository.create({
                username: data.email,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                password: passwordHash,
                role: 'doctor',
            });
            user = await userRepository.save(user);
            console.log(
                `Created user for Dr. ${data.first_name} ${data.last_name}`,
            );
        } else {
            // Update user properties
            user.first_name = data.first_name;
            user.last_name = data.last_name;
            user.role = 'doctor';
            user = await userRepository.save(user);
            console.log(
                `User for Dr. ${data.first_name} ${data.last_name} already exists`,
            );
        }

        // Handle profile
        let profile = await doctorProfileRepository.findOne({
            where: { user: { id: user.id } },
        });

        if (!profile) {
            profile = doctorProfileRepository.create({
                user,
                specialization: data.specialization,
                experience: data.experience,
                bio: data.bio,
            });
            await doctorProfileRepository.save(profile);
            console.log(
                `Created profile for Dr. ${data.first_name} ${data.last_name}`,
            );
        } else {
            profile.specialization = data.specialization;
            profile.experience = data.experience;
            profile.bio = data.bio;
            await doctorProfileRepository.save(profile);
            console.log(
                `Updated profile for Dr. ${data.first_name} ${data.last_name}`,
            );
        }
    }

    console.log('Mock doctors population complete.');
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
