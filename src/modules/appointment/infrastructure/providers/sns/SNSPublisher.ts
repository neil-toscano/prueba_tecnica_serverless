
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { IMessagePublisher } from '../../../domain/ports';


export class SNSPublisher implements IMessagePublisher {
    private readonly topicArn = process.env.APPOINTMENTS_TOPIC_ARN!;

    constructor(
        private readonly client: SNSClient = new SNSClient({})
    ) { }

    async publish(message: any, countryISO: string): Promise<void> {
        try {
            await this.client.send(new PublishCommand({
                TopicArn: this.topicArn,
                Message: JSON.stringify(message),
                MessageAttributes: {
                    countryISO: {
                        DataType: 'String',
                        StringValue: countryISO
                    }
                }
            }));
        }
        catch (error) {
            console.error("Error publishing to SNS:", error);
            throw new Error("No se pudo enviar el mensaje al tópico de notificaciones.");
        }
    }
}