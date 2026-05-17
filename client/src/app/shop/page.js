"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiFilter, FiChevronDown, FiStar } from "react-icons/fi";

const categories = ["All", "Fresh Vegetables", "Fresh Fruits", "Dairy & Bakery", "Snacks & Drinks", "Cleaning Needs", "Meat & Fish"];

const products = [
  { id: 1, name: "Fresh Tomatoes", price: 40, unit: "1 kg", category: "Fresh Vegetables", rating: 4.8, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 2, name: "Farm Fresh Eggs", price: 65, unit: "6 pcs", category: "Dairy & Bakery", rating: 4.5, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 3, name: "Whole Wheat Bread", price: 45, unit: "400 g", category: "Dairy & Bakery", rating: 4.6, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 4, name: "Fresh Milk", price: 32, unit: "500 ml", category: "Dairy & Bakery", rating: 4.9, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 5, name: "Organic Potatoes", price: 35, unit: "1 kg", category: "Fresh Vegetables", rating: 4.7, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 6, name: "Green Apples", price: 120, unit: "1 kg", category: "Fresh Fruits", rating: 4.5, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 7, name: "Orange Juice", price: 90, unit: "1 L", category: "Snacks & Drinks", rating: 4.3, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 8, name: "Dishwashing Liquid", price: 85, unit: "500 ml", category: "Cleaning Needs", rating: 4.6, image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Shop Our Products</h1>
        <p className="text-slate-600 dark:text-slate-400">Find exactly what you need with our wide range of high-quality products.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <FiFilter /> Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button 
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === category 
                        ? "bg-primary text-white" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <button className="flex items-center gap-1 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
                Relevance <FiChevronDown />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
              >
                <Link href={`/product/${product.id}`} className="block relative aspect-square mb-4 bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden cursor-pointer">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                    {product.unit}
                  </div>
                </Link>
                <div className="flex-grow">
                  <div className="text-xs text-primary font-medium mb-1">{product.category}</div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 truncate cursor-pointer hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mb-3">
                    <FiStar className="fill-current" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-extrabold text-lg">₹{product.price}</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-slate-500">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
