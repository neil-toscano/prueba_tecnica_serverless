import type { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { UpdateAppointmentDTO } from "../dtos/updateAppointmentDto";

export class UpdateAppointment {
    constructor(
        private readonly repository: AppointmentRepository,
    ) { }

    async execute(updateAppointmentDto: UpdateAppointmentDTO
    ): Promise<{ id: string; status: string; message: string }> {

        await this.repository.updateStatus(updateAppointmentDto);


        return {
            id: updateAppointmentDto.appointmentId,
            status: updateAppointmentDto.status,
            message: 'El agendamiento ha sido actualizado exitosamente'
        };
    }
}