// File: server/routes/orderRoutes.ts
import { Router } from "express";
import { db } from "../db";
import { z, } from "zod";
import { orders } from "../schema";
import { eq } from "drizzle-orm";
const router = Router();
// PATCH /orders/:id/status - Admin: update order status
router.patch("/:id/status", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid order ID provided" });
            return;
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
            res.status(404).json({ message: "Order not found to update" });
            return;
        }
        res.json({
            message: `Order status updated to '${status}' successfully`,
            order: updatedOrder,
        });
        return;
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid status value submitted",
                errors: error.errors,
            });
            return;
        }
        console.error("Failed to update order status:", error);
        res.status(500).json({
            message: "An unexpected error occurred while updating the order status",
        });
        return;
    }
});
export default router;
