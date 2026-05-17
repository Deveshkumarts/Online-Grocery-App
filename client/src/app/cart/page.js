"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShield } from "react-icons/fi";

const cartItems = [
  { id: 1, name: "Fresh Tomatoes", price: 40, unit: "1 kg", quantity: 2, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 2, name: "Whole Wheat Bread", price: 45, unit: "400 g", quantity: 1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  { id: 3, name: "Farm Fresh Eggs", price: 65, unit: "6 pcs", quantity: 1, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
];

export default function Cart() {
  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 499 ? 0 : 30;
  const tax = Math.round(itemTotal * 0.05); // 5% GST
  const finalTotal = itemTotal + deliveryFee + tax;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-bold text-lg">Items in Cart ({cartItems.length})</h2>
            </div>
            
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {cartItems.map((item) => (
                <li key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-100 dark:border-slate-700" />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{item.name}</h3>
                    <div className="text-sm text-slate-500 mb-2">{item.unit}</div>
                    <div className="font-extrabold text-lg text-primary">₹{item.price}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button className="p-2 text-slate-600 hover:text-primary transition-colors"><FiMinus /></button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button className="p-2 text-slate-600 hover:text-primary transition-colors"><FiPlus /></button>
                    </div>
                    
                    <div className="text-right sm:w-24">
                      <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                    </div>
                    
                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-xl mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Item Total</span>
                <span className="font-medium text-slate-900 dark:text-white">₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="text-xs text-primary bg-primary/10 p-2 rounded-lg text-center font-medium">
                  Add items worth ₹{499 - itemTotal} more to get free delivery!
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxes & Charges (5%)</span>
                <span className="font-medium text-slate-900 dark:text-white">₹{tax}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl">Grand Total</span>
                <span className="font-extrabold text-2xl text-primary">₹{finalTotal}</span>
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">Inclusive of all taxes</p>
            </div>
            
            <Link href="/checkout" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 text-lg">
              Proceed to Checkout <FiArrowRight />
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
              <FiShield className="text-green-500" /> Safe and secure payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
