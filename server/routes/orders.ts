import { Router, Request, Response, NextFunction } from "express";
import { z,  } from "zod";
import { db } from "../db";
import {
  insertOrderSchema,
  orderItemValidationSchema,
  orders,
  orderItems,
  createOrderSchema,
} from "../schema";
import { eq } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";


const router = Router();

// POST /orders - Create a new order
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("Order request body:", JSON.stringify(req.body, null, 2));

    // Validate top-level structure
    const orderSchema = z.object({
    order: z.object({
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerPhone: z.string(),
    totalAmount: z.number(),
    status: z.enum(["pending", "completed", "cancelled"]).default("pending"),
    cartId: z.string().uuid(),// optionally add cartId here if required
  }),
    items: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
});
    

    const { order, items } = orderSchema.parse(req.body);

    if (items.length === 0) {
       res.status(400).json({ message: "Order must contain at least one item" });
       return;
    }

    // Create the order
    type NewOrder = InferInsertModel<typeof orders>;

    const orderData: NewOrder = {
     ...order,
     createdAt: new Date(), // optional if DB defaults this
    };

    const [newOrder] = await db.insert(orders).values(orderData).returning();

    

    // Map orderId into each item
    const itemRecords = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));

    // Insert order items
    await db.insert(orderItems).values(itemRecords);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      items: itemRecords,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ message: "Invalid order data", errors: error.errors });
        return;
    }

    console.error("Failed to create order:", error);
     res.status(500).json({ message: "Failed to create order" });
         return;
  }
});

// GET /orders/:id - Get a specific order and its items
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const orderId = Number(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID provided" });
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
      with: { product: true },
    });

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
      items,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return res.status(500).json({
      message: "An unexpected error occurred while fetching the order",
    });
  }
});

export default router;
