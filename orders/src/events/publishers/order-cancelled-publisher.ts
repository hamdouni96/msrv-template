import { Subjects, Publisher, OrderCancelledEvent } from '@nhatickets2/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
