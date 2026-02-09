import { AppointmentStatus, CountryISO } from "../../../../../src/modules/appointment/common/enum";
import { Appointment } from "../../../../../src/modules/appointment/domain/entities/Appointment";

describe('Appointment Entity', () => {
    it('debería crear una instancia de cita válida', () => {
        const insuredId = '00001';
        const scheduleId = 2;
        const countryISO = 'PE';

        const appointment = new Appointment(insuredId, scheduleId, CountryISO.PERU);

        expect(appointment.insuredId).toBe(insuredId);
        expect(appointment.countryISO).toBe(countryISO);
        expect(appointment.id).toBeDefined();
        expect(appointment.status).toBe(AppointmentStatus.PENDING);
        expect(typeof appointment.id).toBe('string');
    });
});


describe('Validaciones de Negocio', () => {

    it('debería lanzar un error si el insuredId no tiene exactamente 5 dígitos', () => {
        expect(() => {
            new Appointment('001', 101, CountryISO.PERU);
        }).toThrow("El insuredId debe tener exactamente 5 dígitos.");
    });


    it('debería lanzar un error si el insuredId contiene letras', () => {
        expect(() => {
            new Appointment('12A45', 101, CountryISO.PERU);
        }).toThrow("El insuredId debe tener exactamente 5 dígitos.");
    });

    it('debería lanzar un error si el país no es soportado', () => {

        const pais = 'BR';
        const expectedMessage = `País no soportado: ${pais}. Solo 'PE' o 'CL'.`;

        expect(() => {
            new Appointment('12345', 101, 'BR' as any);
        }).toThrow(expectedMessage);
    });
});