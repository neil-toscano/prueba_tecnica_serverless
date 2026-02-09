import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Appointment } from '../../../domain/entities/Appointment';
import type { AppointmentRepository } from '../../../domain/repositories/AppointmentRepository';
import { UpdateAppointmentDTO } from '../../../application/dtos/updateAppointmentDto';


export class DynamoDBAppointmentRepository implements AppointmentRepository {
    private readonly tableName = process.env.APPOINTMENTS_TABLE_NAME!;

    constructor(
        private readonly docClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
    ) { }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {

        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId
            }
        });

        try {
            const { Items } = await this.docClient.send(command);

            if (!Items) return [];

            return Items.map(item => Appointment.fromPrimitives({
                ...item,
                appointmentId: item.appointmentId ?? item.id,
            }));
        } catch (error) {
            console.error("Error al listar desde DynamoDB:", error);
            throw new Error("No se pudo obtener el listado de citas.");
        }
    }

    async updateStatus(updateAppointmentDto: UpdateAppointmentDTO): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: {
                insuredId: updateAppointmentDto.insuredId,
                appointmentId: updateAppointmentDto.appointmentId,
            },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',

            ExpressionAttributeNames: {
                '#status': 'status'
            },

            ExpressionAttributeValues: {
                ':status': updateAppointmentDto.status,
                ':updatedAt': new Date().toISOString()
            }
        });

        try {
            await this.docClient.send(command);
        } catch (error) {
            console.error("Error al actualizar en DynamoDB:", error);
            throw new Error("Error al intentar actualizar el estado en la base de datos.");
        }
    }

    async save(appointment: Appointment): Promise<void> {
        try {
            const command = new PutCommand({
                TableName: this.tableName,
                Item: appointment.toPrimitives(),
            });

            await this.docClient.send(command);
        } catch (error) {
            console.error("Error al guardar en DynamoDB:", error);
            throw new Error("No se pudo persistir la cita en la base de datos.");
        }
    }
}