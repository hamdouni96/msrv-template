import { connect, NatsConnection, JetStreamClient } from 'nats';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

async function start() {
  const nc: NatsConnection = await connect({ servers: 'nats://localhost:4222' });
  const jsm = await nc.jetstreamManager();
  const jsc: JetStreamClient = await nc.jetstream();

  // Ensure the stream exists
  await jsm.streams.add({ name: 'TICKET_EVENTS', subjects: ['ticket:created'] });

  console.log('Listener connected to NATS');

  const listener = new TicketCreatedListener(jsc);
  await listener.listen();
}

start().catch(console.error);
