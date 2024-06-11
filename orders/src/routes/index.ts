/* import express, { Request, Response } from 'express';
import { requireAuth } from '@nhatickets2/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper'; // Importez le wrapper NATS

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('orders');

  res.send(orders);
});

export { router as indexOrderRouter };
 */
import express, { Request, Response } from 'express';
import { requireAuth } from '@nhatickets2/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket'); // Assurez-vous que la propriété est 'ticket' et non 'orders'

  res.send(orders);
});

export { router as indexOrderRouter };
