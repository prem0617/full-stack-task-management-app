import { createContext, Dispatch, SetStateAction } from "react";

// Define the type for cart and setCart
interface CartContextType {
  cart: any[];
  setCart: Dispatch<SetStateAction<any[]>>;
}

export const cartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider = cartContext.Provider;
