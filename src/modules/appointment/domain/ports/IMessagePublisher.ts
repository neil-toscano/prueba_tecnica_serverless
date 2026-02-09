
export interface IMessagePublisher {
    publish(message: any, countryISO: string): Promise<void>;

}