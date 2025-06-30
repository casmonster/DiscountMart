// routes/adminOrders.ts

import {Router,  Request, Response, NextFunction } from "express";
import { db } from "../db.js"; 
import { orders, orderItems } from "../schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        orderItems: {
          with: { product: true },
        },
      },
    });

     res.json({
      message: "All orders retrieved successfully",
      orders: allOrders,
    });return
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
     res.status(500).json({
      message: "An unexpected error occurred while fetching all orders",
    });return;
  }
});

// Admin endpoint to delete order
  router.delete("orders/:id", async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         res.status(400).json({ message: "Invalid order ID" });
         return;
      }

      const deleted = await db.delete(orderItems).where(eq(orderItems.orderId, id));
      
      // Delete the order
       const result = await db.delete(orders).where(eq(orders.id, id));
      if (!deleted) {
         res.status(404).json({ message: "Order not found" });
         return;
      }
      
      res.status(204).send();
    } catch (error) {
       console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

// GET /admin/orders - Admin: get all orders with items and products
router.get("/admin/orders", async (_req: Request, res: Response): Promise<void> => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        orderItems: { with: { product: true } },
      },
    });
     res.json({
      message: "All orders retrieved successfully",
      orders: allOrders,
    });return;
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
     res.status(500).json({
      message: "An unexpected error occurred while fetching all orders",
    });return;
  }
});


export default router;