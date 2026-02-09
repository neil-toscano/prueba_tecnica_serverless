import { SQSEvent } from 'aws-lambda';

import { ProcessPeruAppointment } from "../../../../application/use-case/ProcessPeruAppointment";
import { EventBridgePublisher } from "../../../providers/eventbridge/EventBridgePublisher";
import { PeruQueueController } from "../controllers/PeruQueueController";
import { MySQLAppointmentRepository } from '../../../persistence/mysql/MySQLAppointmentRepository';

export const handler = async (event: SQSEvent) => {

    const eventBridgePublisher = new EventBridgePublisher();
    const mysqlRepository = new MySQLAppointmentRepository();

    const processPeruAppointment = new ProcessPeruAppointment(eventBridgePublisher, mysqlRepository);
    const peruQueueController = new PeruQueueController(processPeruAppointment);
    const response = await peruQueueController.execute(event);

    return { status: "Processed" };
};
