import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@nhatickets2/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';
import { JsMsg } from 'nats';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.js);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'alskdjf',
    userId: 'alskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdfj',
      price: 10,
    },
  };

  // Mock the message object for JetStream
  const msg: Partial<JsMsg> = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg as JsMsg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg as JsMsg);

  expect(msg.ack).toHaveBeenCalled();
});
