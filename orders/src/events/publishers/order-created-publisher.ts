import { Publisher, OrderCreatedEvent, Subjects } from '@nhatickets2/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
