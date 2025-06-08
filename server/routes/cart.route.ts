// server/routes/cart.route.ts
import { Router } from "express";

const router = Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Cart API works!" });
});

export default router;
