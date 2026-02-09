import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { IEventPublisher } from "../../../domain/ports/IEventPublisher";
import { ConfirmedAppointmentDTO } from "../../../application/dtos/ConfAppointmentDTO";

const EVENT_SOURCE = "app.appointments.service";
const DETAIL_TYPE = "AppointmentCreated";

export class EventBridgePublisher implements IEventPublisher {

    constructor(
        private readonly client: EventBridgeClient = new EventBridgeClient({})
    ) { }

    async publish(data: ConfirmedAppointmentDTO) {

        const eventPayload = {
            insuredId: data.insuredId,
            appointmentId: data.appointmentId,
            scheduleId: data.scheduleId,
            countryISO: data.countryISO,
            status: data.status,
            createdAt: new Date().toISOString()
        };

        const command = new PutEventsCommand({
            Entries: [
                {
                    Source: EVENT_SOURCE,
                    DetailType: DETAIL_TYPE,

                    Detail: JSON.stringify(eventPayload),

                    EventBusName: process.env.EVENT_BUS_NAME || "default",
                },
            ],
        });

        try {
            const response = await this.client.send(command);

            if ((response.FailedEntryCount ?? 0) > 0) {
                console.error("Error al enviar a EventBridge:", response.Entries);
                throw new Error("Fallo al enviar evento: FailedEntryCount > 0");
            }
        } catch (error: any) {
            if (error?.message === "Fallo al enviar evento: FailedEntryCount > 0") {
                throw error;
            }

            throw new Error("No se pudo conectar con el servicio de eventos.");
        }
    }
}
