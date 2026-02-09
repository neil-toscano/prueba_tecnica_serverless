import { SQSEvent } from 'aws-lambda';
import { AppointmentStatus } from '../../../../common/enum/AppointmentStatus';
import { ProcessChileAppointment } from '../../../../application/use-case/ProcessChileAppointment';

export class ChileQueueController {
    constructor(private readonly processChileAppointment: ProcessChileAppointment) { }

    async execute(event: SQSEvent): Promise<void> {

        for (const record of event.Records) {
            const { insuredId, scheduleId, countryISO, appointmentId } = JSON.parse(record.body);

            await this.processChileAppointment.execute({
                appointmentId,
                insuredId,
                scheduleId,
                countryISO,
                status: AppointmentStatus.COMPLETED
            })
        }
    }
}