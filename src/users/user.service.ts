import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
        const user = this.userRepository.create(createUserDto);
        const createdUser = await this.userRepository.save(user);
        return {
            email: createdUser.email,
            id: createdUser.id,
            role: createdUser.role,
            username: createdUser.username,
            first_name: createdUser.first_name,
            last_name: createdUser.last_name,
        };
    }

    private async findEntity(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();
        return users.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
        }));
    }

    async findOne(id: number): Promise<UserResponseDto> {
        const user = await this.findEntity(id);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
        };
    }

    async update(
        id: number,
        updateUserDto: UpdateUserDto,
    ): Promise<UpdateUserResponseDto> {
        await this.findEntity(id); // Ensure user exists
        await this.userRepository.update(id, updateUserDto);
        const updatedUser = await this.findEntity(id);
        return {
            email: updatedUser.email,
            id: updatedUser.id,
            role: updatedUser.role,
            username: updatedUser.username,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
        };
    }

    async remove(id: number): Promise<void> {
        const user = await this.findEntity(id); // Ensure user exists
        await this.userRepository.remove(user);
    }
}
