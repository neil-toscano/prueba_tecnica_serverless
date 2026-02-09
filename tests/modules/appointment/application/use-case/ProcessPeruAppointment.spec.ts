import { ConfirmedAppointmentDTO } from "../../../../../src/modules/appointment/application/dtos/ConfAppointmentDTO";
import { ProcessPeruAppointment } from "../../../../../src/modules/appointment/application/use-case";
import { AppointmentStatus, CountryISO } from "../../../../../src/modules/appointment/common/enum";

describe('ProcessPeruAppointment Use Case', () => {

    const mockMysqlRepository = {
        save: jest.fn(),
        close: jest.fn()
    };

    const mockEventPublisher = {
        publish: jest.fn()
    };

    const useCase = new ProcessPeruAppointment(
        mockEventPublisher as any,
        mockMysqlRepository as any
    );

    const mockDTO: ConfirmedAppointmentDTO = {
        appointmentId: 'uuid-peru-123',
        insuredId: '00006',
        scheduleId: 7712,
        countryISO: CountryISO.PERU,
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