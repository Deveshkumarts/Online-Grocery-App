"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiStar, FiMinus, FiPlus, FiShoppingCart, FiHeart, FiShare2, FiChevronRight, FiShield, FiTruck } from "react-icons/fi";
import { use } from "react";

const productData = {
  id: 1,
  name: "Fresh Organic Tomatoes",
  price: 40,
  originalPrice: 50,
  discount: "20% OFF",
  unit: "1 kg",
  category: "Fresh Vegetables",
  rating: 4.8,
  reviews: 124,
  stock: 50,
  description: "Our premium quality organic tomatoes are hand-picked directly from local farms. They are rich in flavor, bright red in color, and perfect for salads, curries, and daily cooking. 100% natural and grown without any harmful pesticides.",
  features: [
    "Sourced fresh from local organic farms",
    "Rich in Vitamin C and antioxidants",
    "No artificial colors or pesticides",
    "Extended shelf life of 4-5 days"
  ],
  images: [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
};

export default function ProductDetails({ params }) {
  const unwrappedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <FiChevronRight size={14} />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <FiChevronRight size={14} />
        <Link href={`/shop?category=${productData.category}`} className="hover:text-primary transition-colors">{productData.category}</Link>
        <FiChevronRight size={14} />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{productData.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Product Images */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={productData.images[activeImage]} 
              alt={productData.name} 
              className="w-full h-full object-cover"
            />
            {productData.discount && (
              <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                {productData.discount}
              </div>
            )}
            <button className="absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
              <FiHeart size={20} />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {productData.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl cursor-pointer overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-primary' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <img src={img} alt={`${productData.name} ${idx+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col">
          <div className="mb-2 text-primary font-semibold text-sm">{productData.category}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{productData.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 px-2 py-1 rounded text-sm font-bold">
              <span>{productData.rating}</span>
              <FiStar className="fill-current" size={14} />
            </div>
            <span className="text-slate-500 text-sm hover:underline cursor-pointer">{productData.reviews} Reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹{productData.price}</span>
            {productData.originalPrice && (
              <span className="text-xl text-slate-400 line-through mb-1">₹{productData.originalPrice}</span>
            )}
            <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded ml-2 mb-1">
              {productData.unit}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
            {productData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-full sm:w-32 border border-slate-200 dark:border-slate-700 h-14">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                <FiMinus />
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                <FiPlus />
              </button>
            </div>
            
            <button className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 h-14 transition-all shadow-lg shadow-primary/30">
              <FiShoppingCart size={20} /> Add to Cart
            </button>
          </div>

          {/* Key Features List */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Why buy from us?</h3>
            <ul className="space-y-3">
              {productData.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-primary flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle size={12} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                <FiTruck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Free Delivery</h4>
                <p className="text-xs text-slate-500 mt-1">Get free delivery on orders above ₹499. Super fast 10-minute delivery in selected areas.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                <FiShield size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Quality Guarantee</h4>
                <p className="text-xs text-slate-500 mt-1">100% fresh and quality products. Hassle-free returns if you are not satisfied.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Dummy icon component since FiCheckCircle wasn't imported from react-icons/fi above
function FiCheckCircle(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
