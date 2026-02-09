export interface IEventPublisher {
    publish(event: unknown): Promise<void>;
}
