import { Button, Card, CardContent, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ItemCard from "./ItemCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Item } from "../../App";

export interface FormData {
  name: string;
  price: number;
  category: string;
  availability: boolean;
}

const MenuItems: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    category: "",
    availability: true,
  });

  const {
    data: menuItems,
    isLoading,
    error,
  } = useQuery<Item[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8080/menu", {
          withCredentials: true,
        });

        if (response.data.error) throw new Error(response.data.error);
        return response.data?.allItems;
      } catch (error: any) {
        console.error(
          error.response?.data?.error || "Failed to fetch menu items"
        );
        throw new Error(
          error.response?.data?.error || "Failed to fetch menu items"
        );
      }
    },
  });

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const { name, category, price } = formData;
        const response = await axios.post(
          "http://localhost:8080/menu",
          {
            name,
            price,
            category,
          },
          { withCredentials: true }
        );
        if (response.data.error) throw new Error(response.data.error);
        return response.data;
      } catch (error: any) {
        error;
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Item added successfully");
      setFormData({
        name: "",
        price: 0,
        category: "",
        availability: true,
      });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const handleAddItem = (e: any) => {
    e.preventDefault();
    addItem(formData);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filtering the menuItems based on the search value
  const filteredMenuItems = menuItems?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="mt-20 mx-20">
        <Skeleton variant="rectangular" height={600} />
      </div>
    );
  if (error) return <p>Error loading menu items: {error.message}</p>;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center font-medium my-10">
        <h1 className="text-3xl">
          Welcome to <span className="logo">FoodExpress</span>
        </h1>
      </div>

      <div className="my-3">
        <Input
          placeholder="Search"
          className="bg-white w-[300px] md:w-[500px] mx-auto"
          onChange={handleSearch} // Handle search input changes
        />
      </div>
      <Card>
        <CardContent>
          <div className="flex justify-between pb-4">
            <h2 className="text-2xl font-medium mb-5">Menu Items</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outlined">Add Items</Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={() => setOpen(false)}
              >
                <DialogHeader>
                  <DialogTitle>Add Item</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="grid gap-4 py-4"
                  onSubmit={(e) => handleAddItem(e)}
                >
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      className="col-span-3"
                      placeholder="Pizza"
                      onChange={(e) =>
                        setFormData((prev) => ({
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
                      className="col-span-3"
                      placeholder="00"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-center items-center gap-5">
                    <label htmlFor="category">Category</label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appetizers">Appetizers</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="MainCourse">Main Course</SelectItem>
                        <SelectItem value="Beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between mx-10">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    {isPending ? (
                      <Button type="submit" variant="outlined" disabled>
                        <Loader2 className="animate-spin" /> Loading
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="outlined"
                        onClick={() => setOpen(false)}
                      >
                        Add Item
                      </Button>
                    )}
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredMenuItems?.map((menuItem: Item) => (
              <ItemCard key={menuItem._id} menuItem={menuItem} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuItems;
