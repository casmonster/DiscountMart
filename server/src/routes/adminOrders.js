// routes/adminOrders.ts
import { Router } from "express";
import { db } from "../db.js"; 
const router = Router();
router.get("/", async (_req, res, next) => {
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
        });
        return;
    }
    catch (error) {
        console.error("Failed to fetch all orders:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching all orders",
        });
        return;
    }
});
// GET /admin/orders - Admin: get all orders with items and products
router.get("/admin/orders", async (_req, res) => {
    try {
        const allOrders = await db.query.orders.findMany({
            with: {
                orderItems: { with: { product: true } },
            },
        });
        res.json({
            message: "All orders retrieved successfully",
            orders: allOrders,
        });
        return;
    }
    catch (error) {
        console.error("Failed to fetch all orders:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching all orders",
        });
        return;
    }
});
export default router;
