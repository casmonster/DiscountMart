"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "../../types/cart"; 
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart`);
        if (!res.ok) throw new Error("Failed to fetch cart items");
        const data: CartItem[] = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {loading ? (
        <p>Loading cart items...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex gap-4 items-center">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: RWF {item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
