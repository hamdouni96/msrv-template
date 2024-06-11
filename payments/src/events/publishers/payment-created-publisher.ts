import { Subjects, Publisher, PaymentCreatedEvent } from '@nhatickets2/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
