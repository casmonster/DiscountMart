import { insertOrderSchema, orderItemsArraySchema } from "../schema";
import { placeOrder } from "../storage";
import { Router } from "express";
import { ZodError } from "zod";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const orderData = insertOrderSchema.parse(req.body.order);
    const itemsData = orderItemsArraySchema.parse(req.body.items);

    const createdOrder = await placeOrder(orderData, itemsData);

    return res.status(201).json(createdOrder);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Invalid order data", error });
    }
    return res.status(500).json({ message: "Failed to place order" });
  }
});
export const ordersRouter = router;


