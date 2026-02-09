import { CreateAppointment } from "../../../../../src/modules/appointment/application/use-case";
import { CountryISO } from "../../../../../src/modules/appointment/common/enum";

describe('CreateAppointment Use Case', () => {
    const mockRepository = {
        save: jest.fn(),
        findByInsuredId: jest.fn(),
    };

    const mockPublisher = {
        publish: jest.fn(),
    };


    const useCase = new CreateAppointment(mockRepository as any, mockPublisher as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería crear, guardar y publicar una cita exitosamente', async () => {
        const dto = {
            insuredId: '00002',
            scheduleId: 2,
            countryISO: CountryISO.PERU
        };

        const result = await useCase.execute(dto);

        expect(result.insuredId).toBe('00002');
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(mockPublisher.publish).toHaveBeenCalledWith(
            expect.objectContaining({
                insuredId: '00002',
                countryISO: CountryISO.PERU
            }),
            CountryISO.PERU
        );
    });

    it('no debería llamar al repositorio si la entidad lanza error de validación', async () => {
        const dto = {
            insuredId: '000000008',
            scheduleId: 100,
            countryISO: CountryISO.PERU
        };

        await expect(useCase.execute(dto)).rejects.toThrow();

        expect(mockRepository.save).not.toHaveBeenCalled();
        expect(mockPublisher.publish).not.toHaveBeenCalled();
    });
});