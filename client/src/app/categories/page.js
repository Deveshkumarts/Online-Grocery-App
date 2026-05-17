"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiShoppingCart, FiSearch } from "react-icons/fi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        ]);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    // Assuming cart logic
    alert(`Added ${product.name} to cart`);
  };

  const displayedProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => (p.category?._id === activeCategory || p.category === activeCategory));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900 pt-6 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Shop by Category</h1>
          <p className="text-slate-500 dark:text-slate-400">Find exactly what you need, organized just for you.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Top Navigation for Categories */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 sticky top-[100px] overflow-x-auto md:overflow-visible flex md:flex-col gap-2 no-scrollbar">
              <button 
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-3 w-max md:w-full px-4 py-3 rounded-2xl transition-all font-semibold whitespace-nowrap ${
                  activeCategory === "all" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                All Products
                <span className="ml-auto bg-white/20 dark:bg-slate-900/20 text-xs px-2 py-0.5 rounded-full">{products.length}</span>
              </button>
              
              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`flex items-center gap-3 w-max md:w-full px-4 py-3 rounded-2xl transition-all font-semibold whitespace-nowrap ${
                    activeCategory === cat._id ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.image && <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-md object-cover" />}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px]">
              
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeCategory === "all" ? "All Products" : categories.find(c => c._id === activeCategory)?.name}
                </h2>
                <div className="text-sm font-medium text-slate-500">
                  {displayedProducts.length} items
                </div>
              </div>

              {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {displayedProducts.map((product, idx) => (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full cursor-pointer relative overflow-hidden"
                    >
                      {product.discountPrice && (
                        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </div>
                      )}
                      
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white">
                        <img 
                          src={product.images?.[0] || "https://via.placeholder.com/300?text=No+Image"} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-hover"
                        >
                          <FiShoppingCart />
                        </button>
                      </div>
                      
                      <div className="flex flex-col flex-grow">
                        <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                          {product.category?.name || "Category"}
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-tight mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{product.unit || "1 kg"}</p>
                        
                        <div className="mt-auto flex items-center gap-2">
                          <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                            ₹{product.discountPrice || product.price}
                          </span>
                          {product.discountPrice && (
                            <span className="text-sm text-slate-400 line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 mb-6">
                    <FiSearch size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">There are currently no products available in this category.</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
