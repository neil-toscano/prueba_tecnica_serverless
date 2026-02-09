import { Appointment } from "../../domain/entities/Appointment";
import type { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { CreateAppointmentDto } from "../dtos/createAppointmentDto";
import type { IMessagePublisher } from "../../domain/ports/IMessagePublisher";

export class CreateAppointment {
    constructor(
        private readonly repository: AppointmentRepository,
        private readonly publisher: IMessagePublisher
    ) { }

    async execute(createAppointmentDto: CreateAppointmentDto
    ): Promise<Appointment> {

        const { insuredId, scheduleId, countryISO } = createAppointmentDto;

        const appointment = new Appointment(insuredId, scheduleId, countryISO);

        await this.repository.save(appointment);

        await this.publisher.publish(appointment.toPrimitives(), countryISO);

        return appointment;
    }
}