import { DomainEvent } from './domain-event.base';
import { DomainEventClass, DomainEvents } from './domain-events';

export abstract class DomainEventHandler {
  constructor(private readonly event: DomainEventClass) {}

  abstract handle(event: DomainEvent): Promise<void>;

  public listen(): void {
    DomainEvents.subscribe(this.event, this);
  }
}
