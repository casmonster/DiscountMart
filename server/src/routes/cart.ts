import { db } from "../db.js"; 
import { cartItems } from "../schema.js";
import { eq, and } from "drizzle-orm";
import { Router, Request, Response } from "express";


import { z } from "zod";

const router = Router();


// ✅ Zod Schemas
const cartSchema = z.object({
  cartId: z.string(),
  productId: z.number(),
  quantity: z.number().min(1),
});

const quantitySchema = z.object({
  quantity: z.number().min(1),
});

// ✅ Helper: remove one item
export const removeCartItem = async (id: number): Promise<boolean> => {
  const result = await db.delete(cartItems).where(eq(cartItems.id, id)).execute();
  return (result.rowCount ?? 0) > 0;
};

// ✅ Helper: clear cart by cartId
export const clearCart = async (cartId: string): Promise<void> => {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId)).execute();
};

// ✅ GET /cart/:cartId - Fetch all cart items
router.get("/:cartId", async (req: Request, res: Response): Promise<void> => {
  const { cartId } = req.params;
  if (!cartId) {
     res.status(400).json({ error: "Missing cartId" });
    return;
  }

  try {
    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
      with: { product: true },
    });
    console.log(`Fetched cart items for cartId=${cartId}:`, items);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ POST /cart - Add or update item
router.post("/", async (req: Request, res: Response) => {
  console.log("POST /api/cart body:", req.body);
  try {
    const validatedData = cartSchema.parse(req.body);
    const { cartId, productId, quantity } = validatedData;

    const existingItem = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)),
    });

    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
      console.log(`Updated cart item for cartId=${cartId}, productId=${productId}`);
    } else {
      await db.insert(cartItems).values({ cartId, productId, quantity });
      console.log(`Inserted new cart item for cartId=${cartId}, productId=${productId}`);
    }

    res.status(201).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(400).json({ error: "Invalid data or failed to add item" });
  }
});

// ✅ PUT /cart/:id - Update quantity
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
        res.status(400).json({ message: "Invalid cart item ID" });
        return;
    }

    const { quantity } = quantitySchema.parse(req.body);

    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();

    if (!updated) {
       res.status(404).json({ message: "Cart item not found" });
       return;
    }

    res.json({ message: "Quantity updated", item: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ message: "Invalid quantity", errors: error.errors });
        return;
    }
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

// ✅ DELETE /cart/:id - Remove one item
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)){
     res.status(400).json({ message: "Invalid ID" });
      return;
  }

  const success = await removeCartItem(id);
  if (!success){
      res.status(404).json({ message: "Cart item not found" });
      return;
  }

  res.status(204).send();
});

// ✅ DELETE /cart/clear/:cartId - Remove all items
router.delete("/clear/:cartId", async (req: Request, res: Response) => {
  try {
    const { cartId } = req.params;
    await clearCart(cartId);
    res.status(204).send();
  } catch (error) {
    console.error("Failed to clear cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;


