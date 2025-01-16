import { Navigate, Route, Routes, useLocation } from "react-router";
import "./App.css";
import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/main/DashboardPage";
import RegisterPage from "./pages/auth/register";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import { useState, useEffect } from "react";
import CartPage from "./pages/main/CartPage";
import Navbar from "./components/custom/Navbar";
import MyOrders from "./pages/main/MyOrders";

export interface foodToken {
  username: string;
  _id: string;
  displayName: string;
}

export interface AuthUser {
  _id: string;
  username: string;
  displayName: string;
}

export interface Item {
  _id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

function App() {
  const { pathname } = useLocation();

  const [cart, setCart] = useState<Item[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  // console.log(pathname);

  const foodToken = localStorage?.getItem("foodApp");

  // if (foodToken) {
  //   <Navigate to={"/login"} />;
  //   return;
  // }

  const { data: authUser, isLoading } = useQuery<foodToken>({
    queryKey: ["foodToken"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "https://full-stack-task-management-app-zlja.onrender.com/auth/getMe",
          {
            withCredentials: true,
          }
        );
        if (response.data.error) throw new Error(response.data.error);
        return response.data;
      } catch (error: any) {
        error;
        throw new Error(error);
      }
    },
  });

  if (authUser) console.log(authUser);

  // console.log(foodToken);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (isLoading) {
    return (
      <div className="mt-20 mx-20">
        <Skeleton variant="rectangular" height={600} />
      </div>
    );
  }

  const disableNavbar = ["/login", "/signup"];
  const showNavbar = !disableNavbar.includes(pathname);

  return (
    <div className="bg-gray-100">
      <CartProvider value={{ cart, setCart }}>
        {showNavbar && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={!foodToken ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!foodToken ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={foodToken ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={foodToken ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/myorders"
            element={foodToken ? <MyOrders /> : <Navigate to="/login" />}
          />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;
