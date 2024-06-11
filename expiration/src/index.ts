import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    const client = natsWrapper.client;

    client.closed().then(() => {
      console.log('NATS connection closed!');
      process.exit();
    }).catch((err) => {
      console.error('Error closing NATS connection', err);
      process.exit(1);
    });

    process.on('SIGINT', () => client.close());
    process.on('SIGTERM', () => client.close());

    // Utilisez natsWrapper.js pour accéder à JetStreamClient
    const js = natsWrapper.js;

    // Créez une instance de OrderCreatedListener en utilisant JetStreamClient
    new OrderCreatedListener(js).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
