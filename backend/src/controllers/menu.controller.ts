import { Response, Request } from "express";
import MenuModel from "../models/menu.model";

export const addMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price) {
      res.status(400).json({ error: "Please provide both name and price." });
      return;
    }

    // Add new menu item to database

    const newMenuItem = await MenuModel.create({
      name,
      price,
      category,
    });

    res.json({ message: "Menu item added successfully", newMenuItem });
    return;
  } catch (error) {
    error;
    res.status(500).json({ error: "Server error", errorMessage: error });
    return;
  }
};

export const getAllItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allItems = await MenuModel.find();

    res.json({ allItems, success: true });
  } catch (error) {
    error;
    res.status(500).json({ error: "Server error", errorMessage: error });
    return;
  }
};

export const editItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, category, availability } = req.body;

    if (!id || !name || !price) {
      res.status(400).json({ error: "Please provide all required fields." });
      return;
    }

    const updatedItem = await MenuModel.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        availability,
      },
      { new: true }
    );

    if (!updatedItem) {
      res.status(404).json({ error: "Menu item not found." });
      return;
    }

    res.json({ message: "Menu item updated successfully", updatedItem });
    return;
  } catch (error) {
    error;
    res.status(500).json({ error: "Server error", errorMessage: error });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Please provide a valid ID." });
      return;
    }

    const deletedItem = await MenuModel.findByIdAndDelete(id);

    res.json({ message: "Menu item deleted successfully", deletedItem });
    return;
  } catch (error) {
    error;
    res.status(500).json({ error: "Server error", errorMessage: error });
    return;
  }
};
