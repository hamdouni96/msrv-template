import { connect, NatsConnection, JetStreamClient } from 'nats';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

async function start() {
  const nc: NatsConnection = await connect({
    servers: 'nats://localhost:4222',
  });
  const jsc: JetStreamClient = await nc.jetstream();

  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(jsc);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
}

start().catch(console.error);
