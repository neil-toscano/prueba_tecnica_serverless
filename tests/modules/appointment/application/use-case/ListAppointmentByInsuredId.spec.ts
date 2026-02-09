import { Appointment } from '../../../../../src/modules/appointment/domain/entities/Appointment';
import { CountryISO } from '../../../../../src/modules/appointment/common/enum/CountryISO';
import { ListAppointmentsByInsuredId } from '../../../../../src/modules/appointment/application/use-case';

describe('ListAppointmentsByInsuredId Use Case', () => {
    const mockRepository = {
        findByInsuredId: jest.fn(),
        save: jest.fn(),
        updateStatus: jest.fn()
    };

    const useCase = new ListAppointmentsByInsuredId(mockRepository as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería retornar una lista de citas cuando el repositorio encuentra datos', async () => {

        const insuredId = '00008';

        const mockAppointments = [
            new Appointment(insuredId, 101, CountryISO.PERU),
        ];

        mockRepository.findByInsuredId.mockResolvedValue(mockAppointments);

        const result = await useCase.execute(insuredId);

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Appointment);
        expect(mockRepository.findByInsuredId).toHaveBeenCalledWith(insuredId);
    });

    it('debería retornar un array vacío si el repositorio no encuentra nada', async () => {
        mockRepository.findByInsuredId.mockResolvedValue([]);

        const insuredId = "99999";
        const result = await useCase.execute(insuredId);

        expect(result).toEqual([]);
    });
});