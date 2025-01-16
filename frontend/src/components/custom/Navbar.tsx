import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router"; // Fixed import for Link
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthUser } from "../../App";
import { ShoppingCart } from "lucide-react";
import { useContext, useState } from "react";
import { cartContext } from "../../context/CartContext";
import { Menu, X } from "lucide-react"; // Added Menu and X icons for mobile menu
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const context = useContext(cartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!context) return null;

  const { cart } = context;
  const { data: authUser } = useQuery<AuthUser>({
    queryKey: ["authUser"],
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.get(
          "https://full-stack-task-management-app-zlja.onrender.com/auth/logout",
          {
            withCredentials: true,
          }
        );
        if (response.data.error) throw new Error(response.data.error);
      } catch (error: any) {
        const errorMessage = error.response.data.error;
        errorMessage;
        throw new Error(errorMessage);
      }
    },
    onSuccess: async () => {
      // Invalidate queries related to authUser and remove it from the cache
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      await queryClient.removeQueries({ queryKey: ["authUser"] });
      // Optionally, remove cart or other localStorage items
      localStorage.removeItem("cart");
      localStorage.removeItem("foodApp");
      toast.success("Logout successful");
      navigate("/login");
    },
    onError: (error) => {
      error;
      toast.error(error.message);
    },
  });

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="flex px-3 sm:px-10 md:px-20 h-16 shadow-md items-center justify-between">
      <Link to={"/"}>
        <h1 className="text-2xl md:text-4xl font-bold cursor-pointer text-blue-500 logo">
          FoodExpress
        </h1>
      </Link>

      {/* Desktop view */}
      <div className="hidden md:flex items-center gap-5">
        <Link to={"/"}>
          <Button size="small" variant="outlined">
            Home
          </Button>
        </Link>{" "}
        <div>
          <Popover>
            <PopoverTrigger>
              <Button variant="outlined" size="small">
                Profile
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-10">
              <p>
                <span className="font-medium text-muted-foreground">
                  Username
                </span>{" "}
                : {authUser?.displayName || authUser?.username}
              </p>
              <p>
                <span className="font-medium text-muted-foreground">Id :</span>{" "}
                {authUser?._id}
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <Link to={"/myorders"}>
          <Button variant="outlined" size="small">
            My Orders
          </Button>
        </Link>
        <div className="relative flex">
          <Link to={"/cart"}>
            <ShoppingCart className="w-10 h-10" />{" "}
            <span className="absolute -top-3 left-8 font-bold px-2 text-red-500">
              {cart?.length === 0 ? "" : cart.length}
            </span>
          </Link>
        </div>
        {isPending ? (
          <Button variant="outlined" color="error" disabled>
            Loading
          </Button>
        ) : (
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-5">
        <div className="relative flex">
          <Link to={"/cart"}>
            <ShoppingCart />
            <span className="absolute -top-3 left-4 font-bold px-2 text-red-500">
              {cart?.length === 0 ? "" : cart.length}
            </span>
          </Link>
        </div>
        <Button onClick={toggleMenu} variant="outlined" size="small">
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
        {isMenuOpen && (
          <div className="absolute top-16 right-3 bg-white shadow-md p-4 rounded-lg z-10 flex flex-col gap-4">
            <div className="flex gap-4">
              <Link to={"/"}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  Home
                </Button>
              </Link>{" "}
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outlined"
                    size="small"
                    // onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    Profile
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-10">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Username
                    </span>{" "}
                    : {authUser?.displayName || authUser?.username}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Id :
                    </span>{" "}
                    {authUser?._id}
                  </p>
                </PopoverContent>
              </Popover>
              <Link to={"/myorders"}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <span className="">My Orders</span>
                </Button>
              </Link>
              {isPending ? (
                <Button variant="outlined" color="error" disabled size="small">
                  Loading
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  size="small"
                  // onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
