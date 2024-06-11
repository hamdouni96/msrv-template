import {JsMsg } from 'nats'; // Importer JsMsg pour les messages JetStream
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@nhatickets2/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Créer une instance du listener
  const listener = new TicketCreatedListener(natsWrapper.getJetStreamClient()); // Utiliser le client JetStream

  // Créer un faux événement de données
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Créer un faux objet de message
  // @ts-ignore
  const msg: JsMsg = { // Utiliser JsMsg pour indiquer que c'est un message JetStream
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Appeler la fonction onMessage avec l'objet de données + l'objet de message
  await listener.onMessage(data, msg);

  // Écrire des assertions pour vérifier qu'un billet a été créé !
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // Appeler la fonction onMessage avec l'objet de données + l'objet de message
  await listener.onMessage(data, msg);

  // Écrire des assertions pour vérifier que la fonction ack est appelée
  expect(msg.ack).toHaveBeenCalled();
});
