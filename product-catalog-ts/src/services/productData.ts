import type { Product } from "../types/Product";
import laptop from "../assets/laptop.jpg";
import mouse from "../assets/mouse.jpg";
import keyboard from "../assets/keyboard.jpg";
import monitor from "../assets/monitor.jpg";
import chair from "../assets/chair.jpg";

export const productData: Product[] = [

  {
    id: 1,
    name: "Dell Laptop",
    category: "Electronics",
    price: 55000,
    description: "15.6-inch Full HD Laptop with Intel i5 Processor",
    image: laptop,
    inStock: true,
  },

  {
    id: 2,
    name: "Wireless Mouse",
    category: "Accessories",
    price: 1200,
    description: "Ergonomic wireless mouse",
    image: mouse,
    inStock: true,
  },

  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 3500,
    description: "RGB Mechanical Gaming Keyboard",
    image: keyboard,
    inStock: false,
  },

  {
    id: 4,
    name: "Samsung Monitor",
    category: "Electronics",
    price: 18000,
    description: "24-inch IPS Full HD Monitor",
    image: monitor,
    inStock: true,
  },

  {
    id: 5,
    name: "Office Chair",
    category: "Furniture",
    price: 8500,
    description: "Comfortable ergonomic office chair",
    image: chair,
    inStock: false,
  }

];