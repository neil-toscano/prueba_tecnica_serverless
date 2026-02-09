import { SQSEvent } from 'aws-lambda';

import { EventBridgePublisher } from "../../../providers/eventbridge/EventBridgePublisher";
import { ProcessChileAppointment } from '../../../../application/use-case/ProcessChileAppointment';
import { ChileQueueController } from '../controllers/ChileQueueController';
import { MySQLAppointmentRepository } from '../../../persistence/mysql/MySQLAppointmentRepository';

export const handler = async (event: SQSEvent) => {

    const eventBridgePublisher = new EventBridgePublisher();
    const mysqlRepository = new MySQLAppointmentRepository();

    const processChileAppointment = new ProcessChileAppointment(eventBridgePublisher, mysqlRepository);
    const chileQueueController = new ChileQueueController(processChileAppointment);
    const response = await chileQueueController.execute(event);

    return { status: "Processed" };
};
