import { CountryISO } from "../../common/enum/CountryISO";

export interface CreateAppointmentDto {
    readonly insuredId: string;
    readonly scheduleId: number;
    readonly countryISO: CountryISO;
}