import { SQSEvent } from "aws-lambda";
import { UpdateAppointment } from "../../../../application/use-case/UpdateAppointment";

export class UpdateAppointmentController {
    constructor(
        private readonly updateAppointment: UpdateAppointment
    ) { }


    async updateStatus(event: SQSEvent) {
        if (event.Records) {
            for (const record of event.Records) {

                const { detail } = JSON.parse(record.body);

                await this.updateAppointment.execute({
                    insuredId: detail.insuredId,
                    appointmentId: detail.appointmentId,
                    status: detail.status,
                });
            }
            return { message: "Procesado desde SQS" };
        }
    }
}