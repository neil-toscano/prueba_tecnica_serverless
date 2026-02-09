import { ConfirmedAppointmentDTO } from "../../../../../src/modules/appointment/application/dtos/ConfAppointmentDTO";
import { ProcessChileAppointment } from "../../../../../src/modules/appointment/application/use-case";
import { AppointmentStatus, CountryISO } from "../../../../../src/modules/appointment/common/enum";

describe('ProcessChileAppointment Use Case', () => {

    const mockMysqlRepository = {
        save: jest.fn(),
        close: jest.fn()
    };

    const mockEventPublisher = {
        publish: jest.fn()
    };

    const useCase = new ProcessChileAppointment(
        mockEventPublisher as any,
        mockMysqlRepository as any
    );

    const mockDTO: ConfirmedAppointmentDTO = {
        appointmentId: 'uuid-chile-123',
        insuredId: '00007',
        scheduleId: 23459,
        countryISO: CountryISO.CHILE,
        status: AppointmentStatus.COMPLETED
    };


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería guardar en MySQL, publicar evento y cerrar conexión exitosamente', async () => {

        await useCase.execute(mockDTO);

        expect(mockMysqlRepository.save).toHaveBeenCalledWith(mockDTO);
        expect(mockEventPublisher.publish).toHaveBeenCalledWith(mockDTO);
        expect(mockMysqlRepository.close).toHaveBeenCalledTimes(1);
    });

    it('debería cerrar la conexión de MySQL incluso si el guardado falla', async () => {

        mockMysqlRepository.save.mockRejectedValue(new Error('DB Error'));

        await expect(useCase.execute(mockDTO)).rejects.toThrow('DB Error');

        expect(mockMysqlRepository.close).toHaveBeenCalled();
        expect(mockEventPublisher.publish).not.toHaveBeenCalled();
    });
});