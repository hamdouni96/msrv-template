/* import { connect, NatsConnection, JetStreamClient, JetStreamManager } from 'nats';

class NatsWrapper {
  private _client?: NatsConnection;
  private _js?: JetStreamClient;
  private _jms?: JetStreamManager;

  get client(): NatsConnection {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  get js(): JetStreamClient {
    if (!this._js) {
      throw new Error('Cannot access JetStream client before connecting');
    }
    return this._js;
  }

  async connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = await connect({ servers: url, name: clientId });

    this._js = this._client.jetstream();
    this._jms = await this._client.jetstreamManager();

    console.log('Connected to NATS');
  }

  async createStream(streamName: string, subjects: string[]): Promise<void> {
    if (!this._jms) {
      throw new Error('Cannot access JetStream Manager before connecting');
    }

    await this._jms.streams.add({ name: streamName, subjects });
  }
  
  // Ajoutez cette méthode pour obtenir le client JetStream
  getJetStreamClient(): JetStreamClient {
    if (!this._js) {
      throw new Error('Cannot access JetStream client before connecting');
    }
    return this._js;
  }
}

export const natsWrapper = new NatsWrapper();
 */import { connect, NatsConnection, JetStreamClient, JetStreamManager } from 'nats';

class NatsWrapper {
  private _client?: NatsConnection;
  private _jetStreamClient?: JetStreamClient;
  private _jetStreamManager?: JetStreamManager;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  get jetStreamClient() {
    if (!this._jetStreamClient) {
      throw new Error('Cannot access JetStream client before connecting');
    }
    return this._jetStreamClient;
  }

  get jetStreamManager() {
    if (!this._jetStreamManager) {
      throw new Error('Cannot access JetStream manager before connecting');
    }
    return this._jetStreamManager;
  }

  async connect(clusterId: string, clientId: string, url: string) {
    this._client = await connect({ servers: url });

    this._jetStreamClient = this._client.jetstream();
    this._jetStreamManager = await this._client.jetstreamManager();

    console.log('Connected to NATS');

    this._client.closed()
      .then(err => {
        if (err) {
          console.error(`NATS connection closed with error: ${err.message}`);
        } else {
          console.log('NATS connection closed');
        }
      })
      .catch(err => {
        console.error(`NATS connection closed with error: ${err.message}`);
      });
  }
}

export const natsWrapper = new NatsWrapper();
