import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, SQSEvent } from "aws-lambda";
import type { CreateAppointment } from "../../../../application/use-case/CreateAppointment";
import { appointmentSchema, listAppointmentSchema } from "../schema/createAppointmentSchema";
import { ListAppointmentsByInsuredId } from "../../../../application/use-case";

export class AppointmentController {
    constructor(private readonly createAppointment: CreateAppointment, private readonly listAppointments: ListAppointmentsByInsuredId
    ) { }

    async create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {

        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "Body requerido" })
            };
        }

        const validation = appointmentSchema.safeParse(JSON.parse(event.body));

        if (!validation.success) {
            const errorDetails = validation.error.issues.map(issue => {
                const field = issue.path.join('.');
                return `${field}: ${issue.message}`;
            });

            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success: false,
                    errors: errorDetails
                })
            };

        }


        const appointment = await this.createAppointment.execute(validation.data);

        return {
            statusCode: 201,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: true,
                message: "Cita creada correctamente",
                data: appointment.toPrimitives()
            })
        };
    }

    async list(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {


        const validation = listAppointmentSchema.safeParse(event.pathParameters);

        if (!validation.success) {
            const errorDetails = validation.error.issues.map(issue => {
                const field = issue.path.join('.');
                return `${field}: ${issue.message}`;
            });

            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success: false,
                    errors: errorDetails
                })
            };
        }

        try {
            const appointments = await this.listAppointments.execute(validation.data.insuredId);

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success: true,
                    data: appointments.map(appointment => appointment.toPrimitives())
                })
            };
        } catch (error: any) {
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success: false,
                    errors: [error.message]
                })
            };
        }

    }

}