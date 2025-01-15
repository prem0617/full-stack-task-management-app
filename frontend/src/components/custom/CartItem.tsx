import { Item } from "../../App";
import { cartContext } from "../../context/CartContext";
import { Button } from "@mui/material";
import { Minus, Plus } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

interface CartItemProps {
  item: Item;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const context = useContext(cartContext);

  if (!context) return null;

  const { cart, setCart } = context;

  const removeItem = (itemId: string) => {
    const updatedCart = cart.filter((item: Item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    if (newQuantity > 10) return;

    setQuantity(newQuantity);

    const updatedCart = cart.map((cartItem: Item) =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div>
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between items-center bg-gray-100 p-4 mb-4 rounded-lg shadow-lg transition-colors duration-300 hover:bg-gray-200">
        <div className="flex flex-col">
          <p className="font-semibold text-lg text-gray-800">{item.name}</p>
          <p className="text-gray-500">₹{item.price}</p>
          <p className="text-gray-500">Quantity: {quantity}</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeItem(item._id)}
          >
            Remove
          </Button>
          <div className="flex gap-5 items-center justify-center">
            <Button
              variant="outlined"
              onClick={() => updateQuantity(quantity - 1)}
              size="small" // Default small size for mobile
              className="sm:size-medium md:size-large" // Use Tailwind classes for larger screens
            >
              <Minus />
            </Button>
            <p>{quantity}</p>
            <Button
              variant="outlined"
              onClick={() => updateQuantity(quantity + 1)}
              className="text-sm"
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
