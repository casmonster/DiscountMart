import { Router } from 'express';
import { ZodError } from 'zod';
import { db } from '../db';
import { insertOrderSchema, orderItemsArraySchema, orders, orderItems } from '../schema';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const orderData = insertOrderSchema.parse(req.body.order);
    const itemsData = orderItemsArraySchema.parse(req.body.items);

    // Create the order
    const [createdOrder] = await db.insert(orders).values(orderData).returning();

    // Add orderId to each item and insert all
    const itemsWithOrderId = itemsData.map((item) => ({
      ...item,
      orderId: createdOrder.id,
    }));

    await db.insert(orderItems).values(itemsWithOrderId);

    return res.status(201).json({ order: createdOrder, items: itemsWithOrderId });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid order data', error: error.flatten() });
    }

    console.error('Order placement failed:', error);
    return res.status(500).json({ message: 'Failed to place order' });
  }
});

export const ordersRouter = router;
