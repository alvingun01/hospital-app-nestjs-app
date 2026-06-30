import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Enable CORS for requests from the frontend
    app.setGlobalPrefix('api'); // Match the frontend's expected prefix
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strips away any unexpected properties sent by the client
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
