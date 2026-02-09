import { UpdateAppointment } from "../../../../application/use-case/UpdateAppointment";
import { DynamoDBAppointmentRepository } from "../../../persistence/dynamodb/DynamoDBRepository";
import { UpdateAppointmentController } from "../controllers/updateAppointmentHandler";

export const handler = async (event: any) => {

    const updateAppointmentUseCase = new UpdateAppointment(new DynamoDBAppointmentRepository());

    const appointmentController = new UpdateAppointmentController(updateAppointmentUseCase);

    return await appointmentController.updateStatus(event);

}