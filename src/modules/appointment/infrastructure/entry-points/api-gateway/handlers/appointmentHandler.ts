import { SNSPublisher } from "../../../providers/sns/SNSPublisher";
import { DynamoDBAppointmentRepository } from "../../../persistence/dynamodb/DynamoDBRepository";
import { AppointmentController } from "../controllers/AppointmentController";
import { CreateAppointment, ListAppointmentsByInsuredId } from "../../../../application/use-case";

export const handler = async (event: any) => {
    const createAppointmentUseCase = new CreateAppointment(new DynamoDBAppointmentRepository(), new SNSPublisher());
    const listAppointmentUseCase = new ListAppointmentsByInsuredId(new DynamoDBAppointmentRepository());

    const appointmentController = new AppointmentController(createAppointmentUseCase, listAppointmentUseCase);


    const method = event.requestContext?.http?.method;

    if (!method) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Evento no reconocido como HTTP" })
        };
    }

    switch (method) {
        case 'POST':
            return await appointmentController.create(event);
        case 'GET':
            return await appointmentController.list(event);
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: `Método ${method} no permitido` })
            };
    }
}