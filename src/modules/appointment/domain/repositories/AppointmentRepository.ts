import type { Appointment } from "../entities/Appointment";

export interface AppointmentUpdateStatus {
    readonly insuredId: string;
    readonly appointmentId: string;
    readonly status: string;
}

export interface AppointmentRepository {
    save(appointment: Appointment): Promise<void>;
    findByInsuredId(insuredId: string): Promise<Appointment[]>;
    updateStatus(data: AppointmentUpdateStatus): Promise<void>;
}