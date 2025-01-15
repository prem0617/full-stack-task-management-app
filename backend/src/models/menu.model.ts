import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    // required: true,
    enum: ["Appetizers", "MainCourse", "Dessert", "Beverage"],
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

const MenuModel = mongoose.model("Menu", MenuSchema);

export default MenuModel;
