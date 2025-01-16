import { Button } from "@mui/material";
import { Delete, ModeEditOutlineOutlined } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { cartContext } from "../../context/CartContext";
import { Item } from "../../App";

interface ItemCardProps {
  menuItem: Item;
}

interface EditData {
  name: string;
  price: number;
  category: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ menuItem }) => {
  const context = useContext(cartContext);

  if (!context) return null;

  const { cart, setCart } = context;

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState<EditData>({
    name: menuItem.name,
    price: menuItem.price,
    category: menuItem.category,
  });

  const { mutate: editIetmData } = useMutation({
    mutationFn: async (data: EditData) => {
      try {
        const { name, category, price } = data;
        const response = await axios.put(
          `https://full-stack-task-management-app-zlja.onrender.com/menu/${menuItem._id}`,
          { name, category, price },
          {
            withCredentials: true,
          }
        );
        //  (response);
        if (response.data.error) throw new Error(response.data.error);
        return response.data;
      } catch (error: any) {
        //  (error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
    onError: (error) => {
      error;
    },
  });

  const handleEditItem = (e: any) => {
    e.preventDefault();
    //  (editData);
    editIetmData(editData);
  };

  const { mutate: deleteItem } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.delete(
          `https://full-stack-task-management-app-zlja.onrender.com/menu/${menuItem._id}`,
          { withCredentials: true }
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response.data;
      } catch (error: any) {
        //  (error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const handleDelete = (e: any) => {
    e.preventDefault();
    deleteItem();
  };

  const updateCartInLocalStorage = (updatedCart: Item[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCart = (item: Item) => {
    const isAlreadyInCart = cart.some(
      (element: Item) => element._id === item._id
    );

    if (isAlreadyInCart) {
      // updateCartInLocalStorage(updatedCart);
      toast.error("Item is already in cart");
    } else {
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart);
      updateCartInLocalStorage(updatedCart);
      toast.success("Item added to cart");
    }
  };

  //  (cart);

  return (
    <div className="p-4 border rounded shadow space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">{menuItem.name}</h1>
        <Button variant="outlined" onClick={() => handleCart(menuItem)}>
          <h3 className="text-muted-foreground">Add to Cart</h3>
        </Button>
      </div>
      <h2 className="text-base">{menuItem.category}</h2>
      <p className="text-lg">{menuItem.price.toFixed(2)}</p>
      <div className="flex justify-between">
        <p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outlined">Edit Items</Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onInteractOutside={() => setOpen(false)}
            >
              <DialogHeader>
                <DialogTitle>
                  <ModeEditOutlineOutlined /> Edit
                </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form
                className="grid gap-4 py-4"
                onSubmit={(e) => handleEditItem(e)}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={editData.name}
                    className="col-span-3"
                    onChange={(e) =>
                      setEditData((prev: EditData) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="price" className="text-right">
                    Price
                  </label>
                  <Input
                    id="price"
                    value={editData.price}
                    type="number"
                    className="col-span-3"
                    onChange={(e) =>
                      setEditData((prev: EditData) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right">
                    Category
                  </label>
                  <Input
                    id="category"
                    value={editData.category}
                    type="text"
                    className="col-span-3"
                    onChange={(e) =>
                      setEditData((prev: EditData) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="outlined"
                    onClick={() => setOpen(false)}
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* </Button> */}
        </p>
        <p>
          <Button
            variant="outlined"
            color="error"
            className="bg-red-500"
            onClick={(e) => handleDelete(e)}
          >
            <Delete />
            Delete
          </Button>
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
