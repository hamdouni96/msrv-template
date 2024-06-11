import mongoose from 'mongoose';
import { OrderStatus, OrderCancelledEvent } from '@nhatickets2/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { JsMsg } from 'nats';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.js);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asldkfj',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asldkfj',
    },
  };

  // Mock the message object for JetStream
  const msg: Partial<JsMsg> = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg as JsMsg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg as JsMsg);

  expect(msg.ack).toHaveBeenCalled();
});
