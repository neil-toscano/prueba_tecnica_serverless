import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { DynamoDBAppointmentRepository } from "../../../../../../src/modules/appointment/infrastructure/persistence/dynamodb";
import { Appointment } from '../../../../../../src/modules/appointment/domain/entities/Appointment';
import { AppointmentStatus, CountryISO } from '../../../../../../src/modules/appointment/common/enum';


const ddbMock = mockClient(DynamoDBDocumentClient);

describe('DynamoDBAppointmentRepository', () => {
    let repository: DynamoDBAppointmentRepository;

    beforeEach(() => {
        ddbMock.reset();
        repository = new DynamoDBAppointmentRepository(ddbMock as any);
    });

    it('debería guardar una cita medica exitosamente', async () => {

        const appointment = new Appointment('00011', 23452, CountryISO.PERU);
        ddbMock.on(PutCommand).resolves({});

        await expect(repository.save(appointment)).resolves.not.toThrow();
        expect(ddbMock.calls()).toHaveLength(1);
    });


    it('debería listar citas por insuredId - findByInsuredId', async () => {
        const insuredId = '00023';
        ddbMock.on(QueryCommand).resolves({
            Items: [
                { appointmentId: 'uuid-prueba-id', insuredId, scheduleId: 1742, countryISO: 'PE', status: 'pending' }
            ]
        });

        const result = await repository.findByInsuredId(insuredId);

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Appointment);
        expect(result[0].insuredId).toBe(insuredId);
    });

    it('debería lanzar error si DynamoDB falla en el listado', async () => {
        ddbMock.on(QueryCommand).rejects(new Error('Dynamo Error'));

        await expect(repository.findByInsuredId('12345'))
            .rejects.toThrow("No se pudo obtener el listado de citas.");
    });

    it('debería actualizar el estado exitosamente - updateStatus', async () => {
        const dto = {
            appointmentId: 'uuid-test-peru',
            insuredId: '00012',
            status: AppointmentStatus.COMPLETED
        };

        ddbMock.on(UpdateCommand).resolves({});

        await expect(repository.updateStatus(dto)).resolves.not.toThrow();
    });
});