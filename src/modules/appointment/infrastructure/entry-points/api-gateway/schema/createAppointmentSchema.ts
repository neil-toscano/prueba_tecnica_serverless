import { z } from "zod";
import { CountryISO } from "../../../../common/enum/CountryISO";

export const appointmentSchema = z.object({
    insuredId: z.string().length(5, "Debe tener 5 dígitos").regex(/^\d+$/, "Solo números"),
    scheduleId: z.number().positive(),
    countryISO: z.nativeEnum(CountryISO, {
        error: "Solo se permite 'PE' o 'CL'"
    })
});

export const listAppointmentSchema = z.object({
    insuredId: z.string()
        .length(5, "Debe tener exactamente 5 dígitos")
        .regex(/^\d+$/, "Solo se permiten números")
});