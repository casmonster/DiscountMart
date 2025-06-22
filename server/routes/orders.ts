import { Router, Request, Response } from "express";
import { z, ZodRawShape } from "zod";
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
router.post("/", async (req: Request, res: Response) => {
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
      return res.status(400).json({ message: "Order must contain at least one item" });
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
      return res.status(400).json({ message: "Invalid order data", errors: error.errors });
    }

    console.error("Failed to create order:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
});

// GET /orders/:id - Get a specific order and its items
router.get("/:id", async (req: Request, res: Response) => {
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

// GET /admin/orders - Admin: get all orders with items and products
router.get("/admin/orders", async (_req: Request, res: Response) => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        orderItems: { with: { product: true } },
      },
    });

    return res.json({
      message: "All orders retrieved successfully",
      orders: allOrders,
    });
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return res.status(500).json({
      message: "An unexpected error occurred while fetching all orders",
    });
  }
});

// PATCH /orders/:id/status - Admin: update order status
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID provided" });
    }

    const statusSchema = z.object({
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    });

    const { status } = statusSchema.parse(req.body);

    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found to update" });
    }

    return res.json({
      message: `Order status updated to '${status}' successfully`,
      order: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid status value submitted",
        errors: error.errors,
      });
    }
    console.error("Failed to update order status:", error);
    return res.status(500).json({
      message: "An unexpected error occurred while updating the order status",
    });
  }
});


export default router;
