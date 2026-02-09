import { AppointmentStatus } from "../../common/enum/AppointmentStatus";

export interface UpdateAppointmentDTO {
    readonly insuredId: string;
    readonly appointmentId: string;
    readonly status: AppointmentStatus;
}