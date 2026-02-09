import { SQSEvent } from 'aws-lambda';
import { AppointmentStatus } from '../../../../common/enum';
import { ProcessPeruAppointment } from '../../../../application/use-case/ProcessPeruAppointment';

export class PeruQueueController {
    constructor(private readonly processPeruAppointment: ProcessPeruAppointment) { }

    async execute(event: SQSEvent): Promise<void> {

        for (const record of event.Records) {
            const { insuredId, scheduleId, countryISO, appointmentId } = JSON.parse(record.body);

            await this.processPeruAppointment.execute({
                appointmentId,
                insuredId,
                scheduleId,
                countryISO,
                status: AppointmentStatus.COMPLETED
            })
        }
    }
}