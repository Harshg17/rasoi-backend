const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const courseData = [
  {
    id: "cake-baking-frosting",
    category: "Baking",
    title: "Cake Baking & Frosting",
    hasTiers: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    description: "Master the art of baking the perfect sponge and decorating it like a professional.",
    basic: { price: "₹2,500", items: ["Vanilla Sponge", "Chocolate Sponge", "Basic Buttercream", "Nozzle Piping Basics"] },
    advanced: { price: "₹4,500", items: ["Fondant Basics", "Tiered Cake Assembly", "Truffle Glaze", "Sugar Flowers"] }
  },
  {
    id: "artisan-breads",
    category: "Baking",
    title: "Artisan Breads",
    hasTiers: false,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    description: "Learn the science of yeast and sourdough to bake bakery-quality breads at home.",
    basic: { price: "₹1,800", items: ["Sourdough Starter", "Focaccia", "Garlic Knots", "Whole Wheat Loaf"] }
  },
  {
    id: "north-indian-masterclass",
    category: "Cooking",
    title: "North Indian Masterclass",
    hasTiers: true,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    description: "Bring the authentic dhaba and restaurant style flavors into your own kitchen.",
    basic: { price: "₹3,000", items: ["Dal Makhani", "Paneer Butter Masala", "Butter Naan", "Jeera Rice"] },
    advanced: { price: "₹5,500", items: ["Dum Biryani", "Mutton Rogan Josh", "Stuffed Kulcha", "Advanced Plating"] }
  },
  {
    id: "pizza-workshop",
    category: "Workshops",
    title: "One-Day Pizza Workshop",
    hasTiers: false,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description: "A fun, fast-paced workshop dedicated entirely to perfecting the pizza pie.",
    basic: { price: "₹999", items: ["Dough from scratch", "Classic Margherita", "Stuffed Crust", "Garlic Bread"] }
  }
];

// Connect to DB, clear old data, insert new data, then exit
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    await Course.deleteMany({}); // Clear existing courses to avoid duplicates
    await Course.insertMany(courseData);
    console.log('✅ Courses successfully loaded into database!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });