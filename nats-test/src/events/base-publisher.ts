import { JetStreamClient, JSONCodec } from 'nats';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: JetStreamClient;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  async publish(data: T['data']): Promise<void> {
    const jc = JSONCodec<T['data']>();
    await this.client.publish(this.subject, jc.encode(data));
    console.log('Event published to subject', this.subject);
  }
}
