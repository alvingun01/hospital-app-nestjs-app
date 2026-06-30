import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppointmentAppMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const startTime = Date.now();

        // Listen for when the response finishes processing back to the user
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            console.log(
                `[Request Log] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
            );
        });

        // CRITICAL: If you don't call next(), the request freezes and hangs forever!
        next();
    }
}
