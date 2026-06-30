import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
        @Body() loginDto: LoginDto,
    ): Promise<{ token: string; user: UserResponseDto }> {
        return this.authService.login(loginDto);
    }
}
