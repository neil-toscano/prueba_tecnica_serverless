import { AppointmentStatus } from "../../common/enum/AppointmentStatus";
import { CountryISO } from "../../common/enum/CountryISO";

export interface ConfirmedAppointmentDTO {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountryISO;
    status: AppointmentStatus.COMPLETED
}