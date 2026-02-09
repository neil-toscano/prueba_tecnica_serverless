import { ConfirmedAppointmentDTO } from "../dtos/ConfAppointmentDTO";
import { IEventPublisher } from "../../domain/ports/IEventPublisher";
import { MysqlRepository } from "../../domain/repositories/MysqlRepository";

export class ProcessPeruAppointment {
    constructor(private eventPublisher: IEventPublisher, private mysqlRepository: MysqlRepository) { }

    async execute(confirmedAppointmentDTO: ConfirmedAppointmentDTO): Promise<void> {

        try {
            await this.mysqlRepository.save(confirmedAppointmentDTO);
            await this.eventPublisher.publish(confirmedAppointmentDTO);

        } finally {
            await this.mysqlRepository.close();
        }

    }
}
