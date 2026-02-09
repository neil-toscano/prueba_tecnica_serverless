import { AppointmentStatus, CountryISO } from "../../common/enum";

export interface AppointmentPersistenceData {
    appointmentId: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountryISO;
    status: AppointmentStatus;
}

export interface MysqlRepository {
    save(appointment: AppointmentPersistenceData): Promise<void>;
    close(): Promise<void>;
}