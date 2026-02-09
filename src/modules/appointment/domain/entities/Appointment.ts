
import { v4 as uuidv4 } from 'uuid';
import { AppointmentStatus } from "../../common/enum/AppointmentStatus";
import { CountryISO } from "../../common/enum/CountryISO";


export class Appointment {

    public readonly id: string;
    public readonly createdAt: string;
    public readonly updatedAt: string;

    constructor(
        public readonly insuredId: string,
        public readonly scheduleId: number,
        public readonly countryISO: CountryISO,
        public readonly status: AppointmentStatus = AppointmentStatus.PENDING,
        id?: string,
        createdAt?: string,
        updatedAt?: string
    ) {
        this.validateInsuredId(insuredId);
        this.validateCountry(countryISO);

        this.id = id || uuidv4();

        const now = new Date().toISOString();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }

    private validateInsuredId(id: string) {
        if (!/^\d{5}$/.test(id)) {
            throw new Error("El insuredId debe tener exactamente 5 dígitos.");
        }
    }

    private validateCountry(iso: CountryISO): void {
        if (!Object.values(CountryISO).includes(iso)) {
            throw new Error(`País no soportado: ${iso}. Solo 'PE' o 'CL'.`);
        }
    }

    public static fromPrimitives(data: any): Appointment {
        return new Appointment(
            data.insuredId,
            data.scheduleId,
            data.countryISO,
            data.status as AppointmentStatus,
            data.appointmentId || data.id,
            data.createdAt,
            data.updatedAt
        );
    }

    public toPrimitives() {
        return {
            appointmentId: this.id,
            insuredId: this.insuredId,
            scheduleId: this.scheduleId,
            countryISO: this.countryISO,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}