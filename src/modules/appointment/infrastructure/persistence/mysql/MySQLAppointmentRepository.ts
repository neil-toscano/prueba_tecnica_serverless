import { Connection } from 'mysql2/promise';
import { MysqlRepository } from '../../../domain/repositories/MysqlRepository';
import { createMySQLConnection } from './MySqlConfig';
import { ConfirmedAppointmentDTO } from '../../../application/dtos';


export class MySQLAppointmentRepository implements MysqlRepository {
    private connection: Connection | null = null;

    private async getConnection(): Promise<Connection> {
        if (!this.connection) {
            const dbName = process.env.DB_NAME;

            if (!dbName) {
                throw new Error("La variable de entorno DB_NAME no está definida");
            }

            this.connection = await createMySQLConnection(dbName);
        }
        return this.connection;
    }

    async save(confirmedAppointmentDTO: ConfirmedAppointmentDTO): Promise<void> {
        try {

            const { appointmentId, countryISO, insuredId, scheduleId, status } = confirmedAppointmentDTO;

            const connection = await this.getConnection() || "appointments";

            const tableName = process.env.DB_TABLE;

            const query = `
            INSERT INTO ${tableName} 
                (appointment_id, insured_id, schedule_id, country_iso, status)
            VALUES (?, ?, ?, ?, ?)
        `;

            await connection.execute(query, [
                appointmentId,
                insuredId,
                scheduleId,
                countryISO,
                status,
            ]);
        } catch (error) {
            console.error("Error saving to MySQL:", error);
            throw new Error("No se pudo persistir la cita en MySQL.");
        }
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            console.log('MySQL connection closed');
        }
    }
}