import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@nhatickets2/common';
import { stripe } from '../../stripe';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

// Mock the JetStream publish function
jest.mock('../../nats-wrapper', () => {
  const originalModule = jest.requireActual('../../nats-wrapper');
  return {
    ...originalModule,
    natsWrapper: {
      js: {
        publish: jest.fn().mockResolvedValue(undefined),
      },
    },
  };
});

it('returns a 201 with valid inputs', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: orderId,
    version: 0,
    userId: 'testuserid',
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === 20 * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  expect(natsWrapper.js.publish).toHaveBeenCalled();
});
