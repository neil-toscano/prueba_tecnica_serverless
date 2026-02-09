import { mockClient } from 'aws-sdk-client-mock';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

import { EventBridgePublisher } from '../../../../../../src/modules/appointment/infrastructure/providers/eventbridge';
const ebMock = mockClient(EventBridgeClient);

describe('EventBridgePublisher', () => {
    let publisher: EventBridgePublisher;

    beforeEach(() => {
        ebMock.reset();
        publisher = new EventBridgePublisher(ebMock as any);
        process.env.EVENT_BUS_NAME = 'test-bus';
    });

    it('debería lanzar un error si EventBridge reporta FailedEntryCount > 0', async () => {
        ebMock.on(PutEventsCommand).resolves({
            FailedEntryCount: 1,
            Entries: [{ ErrorCode: 'InternalError' }]
        });

        await expect(publisher.publish({} as any))
            .rejects.toThrow("Fallo al enviar evento: FailedEntryCount > 0");
    });

    it('debería manejar errores de conexión con AWS', async () => {
        ebMock.on(PutEventsCommand).rejects(new Error('Network Error'));

        await expect(publisher.publish({} as any))
            .rejects.toThrow("No se pudo conectar con el servicio de eventos.");
    });
});