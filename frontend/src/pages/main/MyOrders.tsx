import { Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IndianRupee } from "lucide-react";
import { useState } from "react";
import { Input } from "../../components/ui/input";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  menuItemId: MenuItem;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: "Pending" | "Completed" | "Cancelled";
  totalAmount: number;
  items: OrderItem[];
}

const MyOrders = () => {
  const [statusSearch, setStatusSearch] = useState<string>("");

  const { data: myOrders, error } = useQuery<Order[], Error>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8080/order/all", {
          withCredentials: true,
        });

        if (response.data.error) throw new Error(response.data.error);
        return response.data.allOrders;
      } catch (error: any) {
        error;
        const errorMessage = error.response?.data?.error || "An error occurred";
        throw new Error(errorMessage);
      }
    },
  });

  // Filter orders based on the status search term
  const filteredOrders = myOrders?.filter((order) =>
    order.status.toLowerCase().includes(statusSearch.toLowerCase())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h2>

      {/* Search Input for order status */}
      <div className="mb-6">
        <Input
          placeholder="Search by status (Pending, Completed)"
          className="bg-white w-[300px] md:w-[500px] mx-auto"
          onChange={(e) => setStatusSearch(e.target.value)}
        />
      </div>

      {filteredOrders?.map((order) => (
        <div
          key={order._id}
          className="bg-gray-100 p-6 mb-6 rounded-lg shadow-sm"
        >
          <div className="mb-6 border-b border-gray-300 pb-4">
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-bold">Order ID:</span> {order._id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Order Date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">Status:</span> {order.status}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="font-bold">Total Price:</span>{" "}
              <IndianRupee className="w-4 h-4" />
              {order.totalAmount.toFixed(2)}
            </p>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.menuItemId.name}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Quantity:</span> {item.quantity}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-bold">Price per Item:</span>{" "}
                  <p className="flex">
                    <IndianRupee className="w-4 h-4 items-center" />
                    {item.menuItemId.price.toFixed(2)}
                  </p>
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-bold">Total for this Item:</span>
                  <p className="flex items-center ">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-sm">
                      {(item.quantity * item.menuItemId.price).toFixed(2)}
                    </span>
                  </p>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default MyOrders;
