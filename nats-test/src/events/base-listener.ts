import { JetStreamClient, JSONCodec, consumerOpts, JsMsg } from 'nats';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: JsMsg): void;
  protected client: JetStreamClient;
  protected ackWait = 5 * 1000;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  async listen() {
    const opts = consumerOpts()
      .ackWait(this.ackWait)
      .manualAck()
      .durable(this.queueGroupName)
      .deliverTo(this.queueGroupName)
      .deliverAll();

    const subscription = await this.client.subscribe(this.subject, opts);
    const jc = JSONCodec<T['data']>();

    for await (const msg of subscription) {
      const parsedData = jc.decode(msg.data);
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      this.onMessage(parsedData, msg);
    }
  }
}
