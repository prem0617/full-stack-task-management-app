import { cartContext } from "../../context/CartContext";
import { useContext, useEffect, useState } from "react";
import CartItem from "../../components/custom/CartItem";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface PlaceOrder {
  orderArray: { menuItemId: string; quantity: number }[];
  price: number;
}

const CartPage = () => {
  const [price, setPrice] = useState<number>(0);

  const context = useContext(cartContext);

  if (!context) return null;

  const { cart, setCart } = context;

  useEffect(() => {
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setPrice(totalPrice);
  }, [cart]);

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async ({ orderArray, price }: PlaceOrder) => {
      try {
        const response = await axios.post(
          "https://full-stack-task-management-app-zlja.onrender.com/order",
          {
            items: orderArray,
            totalAmount: price,
          },
          { withCredentials: true }
        );

        if (response.data.error) throw new Error(response.data.error);
      } catch (error: any) {
        const errorMessage = error.response.data.error;
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      toast.success("Order Placed Successfully!");
      setCart([]);
      localStorage.removeItem("cart");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOrder = async () => {
    let orderArray = cart.map((item) => ({
      menuItemId: item._id,
      quantity: item.quantity,
    }));

    placeOrder({ orderArray, price });
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {cart.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Your cart is empty!</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <CartItem item={item} key={index} />
          ))}

          <div className="flex justify-between mt-6">
            <div className="text-lg text-gray-700">
              <span className="font-semibold">Total Price: </span>${price}
            </div>
            {isPending ? (
              <Button
                variant="outlined"
                onClick={handleOrder}
                className="gap-2"
                disabled
              >
                <Loader2 className="animate-spin" /> Loading
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleOrder}>
                Make Order
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
