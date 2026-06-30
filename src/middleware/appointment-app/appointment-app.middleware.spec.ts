import { AppointmentAppMiddleware } from './appointment-app.middleware';

describe('AppointmentAppMiddleware', () => {
    it('should be defined', () => {
        expect(new AppointmentAppMiddleware()).toBeDefined();
    });
});
