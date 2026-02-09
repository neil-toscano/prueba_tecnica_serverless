import { mockClient } from 'aws-sdk-client-mock';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { SNSPublisher } from '../../../../../../src/modules/appointment/infrastructure/providers/sns';


const snsMock = mockClient(SNSClient);

describe('SNSPublisher', () => {
    let publisher: SNSPublisher;

    beforeEach(() => {
        snsMock.reset();
        process.env.APPOINTMENTS_TOPIC_ARN = 'arn:aws:sns:pe-1:123:my-topic';
        publisher = new SNSPublisher(snsMock as any);
    });

    it('debería publicar un mensaje con los atributos de mensaje correctos', async () => {
        const message = { id: 'test-123', status: 'completed' };
        const country = 'PE';

        snsMock.on(PublishCommand).resolves({ MessageId: 'msg-123' });

        await publisher.publish(message, country);

        const calls = snsMock.calls();
        expect(calls).toHaveLength(1);

        const input = calls[0].args[0].input as PublishCommandInput;

        expect(input.TopicArn).toBe('arn:aws:sns:pe-1:123:my-topic');
        expect(input.Message).toBe(JSON.stringify(message));

        expect(input.MessageAttributes?.countryISO).toEqual({
            DataType: 'String',
            StringValue: country
        });
    });

    it('debería lanzar un error descriptivo si SNS falla', async () => {
        snsMock.on(PublishCommand).rejects(new Error('SNS Internal Error'));

        await expect(publisher.publish({}, 'PE'))
            .rejects.toThrow("No se pudo enviar el mensaje al tópico de notificaciones.");
    });
});