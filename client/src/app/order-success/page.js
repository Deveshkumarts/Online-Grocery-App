"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiMapPin, FiClock } from "react-icons/fi";

export default function OrderSuccess() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center shadow-xl mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle size={48} />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          Thank you for shopping with TKS Balaji Maligai. Your order has been received and is being processed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800/50 py-4 px-6 rounded-2xl inline-flex mb-8">
          <div className="text-left pr-4 border-r border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
            <p className="font-bold text-slate-900 dark:text-white">#TKS-8492-451</p>
          </div>
          <div className="text-left pl-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Estimated Delivery</p>
            <p className="font-bold text-primary flex items-center gap-2"><FiClock /> 10-15 Minutes</p>
          </div>
        </div>
      </motion.div>

      {/* Order Tracking Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h2 className="font-bold text-xl mb-8 flex items-center gap-2">
          <FiMapPin className="text-primary" /> Track Your Order
        </h2>
        
        <div className="relative pl-8 md:pl-0">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
          <div className="hidden md:block absolute top-1/2 left-0 w-1/3 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-1000"></div>
          
          <div className="md:hidden absolute top-0 left-4 w-1 h-full bg-slate-200 dark:bg-slate-800 z-0 rounded-full"></div>
          <div className="md:hidden absolute top-0 left-4 w-1 h-1/3 bg-primary z-0 rounded-full transition-all duration-1000"></div>

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
            {/* Step 1 */}
            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                <FiCheckCircle size={20} />
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Order Placed</h3>
                <p className="text-xs text-slate-500">12:30 PM</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0 animate-pulse">
                <FiPackage size={20} />
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Packing</h3>
                <p className="text-xs text-primary font-medium">In Progress</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0">
                <FiTruck size={20} />
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-400">Out for Delivery</h3>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0">
                <FiHome size={20} />
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-400">Delivered</h3>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link href="/" className="inline-block bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
