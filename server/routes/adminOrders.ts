// routes/adminOrders.ts

import {Router,  Request, Response } from "express";
import { db } from "../db";
import { z,  } from "zod";
import{orders} from "../schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: Request, res: Response): Promise<any> => {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        orderItems: {
          with: { product: true },
        },
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
// GET /admin/orders - Admin: get all orders with items and products
router.get("/admin/orders", async (_req: Request, res: Response): Promise<any> => {
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


export default router;