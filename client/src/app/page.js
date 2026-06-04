"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  { _id: "c1", name: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-green-100 dark:bg-green-900/30" },
  { _id: "c2", name: "Fresh Fruits", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-orange-100 dark:bg-orange-900/30" },
  { _id: "c3", name: "Dairy & Bakery", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-blue-100 dark:bg-blue-900/30" },
  { _id: "c4", name: "Snacks & Drinks", image: "https://images.unsplash.com/photo-1599508704512-2f19efd1eede?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-red-100 dark:bg-red-900/30" },
  { _id: "c5", name: "Cleaning Needs", image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-teal-100 dark:bg-teal-900/30" },
  { _id: "c6", name: "Meat & Fish", image: "https://images.unsplash.com/photo-1607623814075-e51df1bd682f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", color: "bg-rose-100 dark:bg-rose-900/30" },
];

const features = [
  { icon: <FiClock size={24} />, title: "10-Minute Delivery", desc: "Get your order delivered to your doorstep in minutes." },
  { icon: <FiShield size={24} />, title: "Premium Quality", desc: "We source only the best and freshest products for you." },
  { icon: <FiTruck size={24} />, title: "Free Delivery", desc: "Enjoy free delivery on all orders above ₹499." },
];

const popularProducts = [
  { _id: "p1", name: "Fresh Tomatoes", price: 40, unit: "1 kg", images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"] },
  { _id: "p2", name: "Farm Fresh Eggs", price: 65, unit: "6 pcs", images: ["https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"] },
  { _id: "p3", name: "Whole Wheat Bread", price: 45, unit: "400 g", images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"] },
  { _id: "p4", name: "Fresh Milk", price: 32, unit: "500 ml", images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"] },
];

export default function Home() {
  const [dbCategories, setDbCategories] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8)
        ]);
        
        // Map Supabase IDs to _id to keep component compatibility
        const mappedCats = (catRes.data || []).map(c => ({ ...c, _id: c.id }));
        const mappedProds = (prodRes.data || []).map(p => ({ ...p, _id: p.id }));

        setDbCategories(mappedCats.length > 0 ? mappedCats : categories);
        setDbProducts(mappedProds.length > 0 ? mappedProds : popularProducts);
      } catch (error) {
        console.error("Failed to load store data", error);
        setDbCategories(categories);
        setDbProducts(popularProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 py-12 md:py-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 dark:bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-primary font-semibold text-sm mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                🚀 Groceries delivered in 10 minutes
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                Fresh Groceries, <br/>
                <span className="text-primary">Delivered to You</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-8 max-w-lg">
                Shop from 5000+ products including fresh vegetables, fruits, dairy, and daily essentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold text-center transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  Shop Now <FiArrowRight />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Fresh Groceries" 
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800"
                />
                
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-orange-500 text-2xl">
                    🥕
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fresh veggies</div>
                    <div className="font-bold text-slate-800 dark:text-white">-20% Off Today</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Shop by Category</h2>
              <p className="text-slate-600 dark:text-slate-400">Discover fresh products across our wide range of categories</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:text-primary-hover transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {isLoading ? (
               <div className="col-span-full py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : dbCategories.length > 0 ? dbCategories.map((category, idx) => (
              <motion.div 
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
              >
                <div className={`aspect-square rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg hover:border-primary/50 relative overflow-hidden`}>
                  {category.image && category.image !== 'no-photo.jpg' ? (
                    <img src={category.image} alt={category.name} className="w-20 h-20 object-contain mb-3 drop-shadow-md rounded-xl" />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-xl mb-3 flex items-center justify-center text-slate-300 text-3xl">🛍️</div>
                  )}
                  <h3 className="font-bold text-center text-slate-800 dark:text-white text-sm md:text-base relative z-10 truncate w-full">{category.name}</h3>
                </div>
              </motion.div>
            )) : (
              <p className="col-span-full text-slate-500">Categories will appear here once added by admin.</p>
            )}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Bestsellers</h2>
              <p className="text-slate-600 dark:text-slate-400">Most loved products by our customers</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:text-primary-hover transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? (
               <div className="col-span-full py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : dbProducts.length > 0 ? dbProducts.map((product, idx) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative aspect-square mb-4 bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                    {product.unit}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-extrabold text-lg">₹{product.price}</span>
                    {product.discountPrice && <span className="text-slate-400 line-through text-sm">₹{product.discountPrice}</span>}
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Add to Cart
                </button>
              </motion.div>
            )) : (
              <p className="col-span-full text-slate-500">Products will appear here once added by admin.</p>
            )}
          </div>
        </div>
      </section>
      
      {/* App Download Banner */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
            
            <div className="relative z-10 md:w-1/2 text-white mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Get the TKS Balaji Maligai App</h2>
              <p className="text-green-50 mb-8 text-lg opacity-90 max-w-md">Download our app for the fastest ordering experience, exclusive offers, and real-time order tracking.</p>
              <div className="flex gap-4">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  Get on App Store
                </button>
                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  Get on Play Store
                </button>
              </div>
            </div>
            
            <div className="relative z-10 md:w-1/3 flex justify-center">
               <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Mobile App" className="w-64 rounded-3xl border-4 border-slate-800 shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
