'use client';

import { useCart } from '../../context/CartContext';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    imageUrl: string;
    price: number;
    discountPrice?: number | null; // ✅ Allow null or undefined
  };
}

const CartPage = () => {
  const {
    cartItems,
    isLoading,
    removeItem,
    updateQuantity,
  } = useCart();

  // ✅ Normalize cart items to avoid TS errors with discountPrice
  const normalizedCartItems: CartItem[] = cartItems.map((item) => ({
    ...item,
    product: {
      ...item.product,
      discountPrice:
        item.product.discountPrice === null
          ? undefined
          : item.product.discountPrice,
    },
  }));

  const handleQuantityChange = (
    item: CartItem,
    action: 'increase' | 'decrease'
  ) => {
    const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;
    updateQuantity(item.id, newQty);
  };

  const handleRemove = (itemId: number) => {
    removeItem(itemId);
  };

  if (isLoading) return <p className="p-4">Loading cart...</p>;
  if (normalizedCartItems.length === 0)
    return <p className="p-4">Your cart is empty.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <ul className="space-y-4">
        {normalizedCartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 border p-4 rounded-lg"
          >
            {item.product?.imageUrl && (
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h2 className="font-semibold">
                {item.product?.name ?? 'Unnamed product'}
              </h2>
              <p className="text-sm text-gray-500">
                RWF{' '}
                {(
                  item.product?.discountPrice ?? item.product?.price ?? 0
                ).toLocaleString()}{' '}
                × {item.quantity}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item, 'decrease')}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  –
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, 'increase')}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
