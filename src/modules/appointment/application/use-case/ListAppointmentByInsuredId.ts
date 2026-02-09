import { Appointment } from "../../domain/entities/Appointment";
import type { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";

export class ListAppointmentsByInsuredId {
    constructor(
        private readonly repository: AppointmentRepository
    ) { }

    async execute(insuredId: string): Promise<Appointment[]> {
        const appointments = await this.repository.findByInsuredId(insuredId);

        return appointments;
    }
}