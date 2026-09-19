export interface IDomainEvent<T = any> {
  name: string;
  occurredOn: Date;
  payload: T;
}

export type EventHandler<T = any> = (event: IDomainEvent<T>) => Promise<void> | void;

export interface IEventBus {
  publish(event: IDomainEvent): Promise<void>;
  publishAll(events: IDomainEvent[]): Promise<void>;
  subscribe(eventName: string, handler: EventHandler): void;
}
