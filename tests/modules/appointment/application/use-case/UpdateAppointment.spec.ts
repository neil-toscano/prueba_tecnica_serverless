import { UpdateAppointment } from '../../../../../src/modules/appointment/application/use-case';
import { AppointmentStatus } from '../../../../../src/modules/appointment/common/enum/AppointmentStatus';

describe('UpdateAppointment Use Case', () => {

    const mockRepository = {
        updateStatus: jest.fn().mockResolvedValue(undefined),
        save: jest.fn(),
        findByInsuredId: jest.fn()
    };

    const useCase = new UpdateAppointment(mockRepository as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería actualizar el estado de la cita correctamente', async () => {
        const dto = {
            appointmentId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            insuredId: '00006',
            status: AppointmentStatus.COMPLETED
        };

        const result = await useCase.execute(dto);

        expect(mockRepository.updateStatus).toHaveBeenCalledWith(dto);
        expect(mockRepository.updateStatus).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            id: dto.appointmentId,
            status: AppointmentStatus.COMPLETED,
            message: 'El agendamiento ha sido actualizado exitosamente'
        });
    });

    it('debería propagar el error si el repositorio falla', async () => {
        mockRepository.updateStatus.mockRejectedValue(new Error('DynamoDB Error'));

        const dto = {
            appointmentId: '123',
            insuredId: '00006',
            status: AppointmentStatus.COMPLETED
        };

        await expect(useCase.execute(dto)).rejects.toThrow('DynamoDB Error');
    });
});