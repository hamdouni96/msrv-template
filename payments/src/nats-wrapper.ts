import { connect, JetStreamClient, NatsConnection } from 'nats';

class NatsWrapper {
  private _client?: NatsConnection;
  private _js?: JetStreamClient;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }

  get js() {
    if (!this._js) {
      throw new Error('Cannot access JetStream client before connecting');
    }
    return this._js;
  }

  async connect(clusterId: string, clientId: string, url: string) {
    this._client = await connect({ servers: url, name: clientId });
    this._js = this._client.jetstream();
    console.log('Connected to JetStream');
  }

  async close() {
    if (this._client) {
      await this._client.close();
    }
  }
}

export const natsWrapper = new NatsWrapper();
