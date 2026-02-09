import { MySQLAppointmentRepository } from '../../../../../../src/modules/appointment/infrastructure/persistence/mysql';
import { AppointmentStatus, CountryISO } from '../../../../../../src/modules/appointment/common/enum';
import { createMySQLConnection } from '../../../../../../src/modules/appointment/infrastructure/persistence/mysql/MySqlConfig';
import { ConfirmedAppointmentDTO } from '../../../../../../src/modules/appointment/application/dtos';

jest.mock('../../../../../../src/modules/appointment/infrastructure/persistence/mysql/MySqlConfig');

describe('MySQLAppointmentRepository', () => {
    let repository: MySQLAppointmentRepository;


    const mockConnection = {
        execute: jest.fn().mockResolvedValue([{}]),
        end: jest.fn().mockResolvedValue(undefined)
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.DB_NAME = 'test_db';
        process.env.DB_TABLE = 'appointments_test';

        repository = new MySQLAppointmentRepository();

        (createMySQLConnection as jest.Mock).mockResolvedValue(mockConnection);
    });

    it('debería insertar una cita correctamente en la base de datos', async () => {
        const dto: ConfirmedAppointmentDTO = {
            appointmentId: 'uuid-test-123',
            insuredId: '00006',
            scheduleId: 7712,
            countryISO: CountryISO.PERU,
            status: AppointmentStatus.COMPLETED
        };

        await repository.save(dto);

        expect(mockConnection.execute).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO appointments_test'),
            [dto.appointmentId, dto.insuredId, dto.scheduleId, dto.countryISO, dto.status]
        );
    });

    it('debería cerrar la conexión correctamente', async () => {
        await repository.save({} as any);

        await repository.close();

        expect(mockConnection.end).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar un error si falla la ejecución del query', async () => {
        mockConnection.execute.mockRejectedValue(new Error('Syntax Error'));

        await expect(repository.save({} as any)).rejects.toThrow("No se pudo persistir la cita en MySQL.");
    });
});