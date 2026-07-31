"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheck, FiMapPin, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { getCart, clearCart } from "@/lib/cart";

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 499 ? 0 : 30;
  const tax = Math.round(itemTotal * 0.05); // 5% GST
  const finalTotal = itemTotal + deliveryFee + tax;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${step === 1 ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-200 dark:border-slate-800'} overflow-hidden transition-all duration-300`}>
            <div className={`p-4 md:p-6 flex items-center gap-4 ${step === 1 ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-white text-primary' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                {step > 1 ? <FiCheck /> : "1"}
              </div>
              <h2 className={`font-bold text-lg ${step === 1 ? 'text-white' : ''}`}>Delivery Address</h2>
            </div>
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div 
                    onClick={() => setSelectedAddress(1)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${selectedAddress === 1 ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 font-bold">
                        <FiMapPin className={selectedAddress === 1 ? 'text-primary' : 'text-slate-400'} /> Home
                      </div>
                      {selectedAddress === 1 && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white"><FiCheck size={12} /></div>}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      123 Grocery Street, Market Area<br/>
                      Chennai, Tamil Nadu - 600001<br/>
                      Ph: +91 98765 43210
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedAddress(2)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${selectedAddress === 2 ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 font-bold">
                        <FiMapPin className={selectedAddress === 2 ? 'text-primary' : 'text-slate-400'} /> Office
                      </div>
                      {selectedAddress === 2 && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white"><FiCheck size={12} /></div>}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      456 Tech Park, OMR Road<br/>
                      Chennai, Tamil Nadu - 600097<br/>
                      Ph: +91 98765 43210
                    </p>
                  </div>
                </div>
                
                <button className="text-primary font-bold hover:underline mb-6 block">+ Add New Address</button>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
                  >
                    Deliver Here
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${step === 2 ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-200 dark:border-slate-800'} overflow-hidden transition-all duration-300`}>
            <div className={`p-4 md:p-6 flex items-center gap-4 ${step === 2 ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-white text-primary' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                2
              </div>
              <h2 className={`font-bold text-lg ${step === 2 ? 'text-white' : ''}`}>Payment Method</h2>
            </div>
            
            {step === 2 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 md:p-6">
                <div className="space-y-4 mb-8">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-primary focus:ring-primary mr-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><FiDollarSign /></div>
                      <div>
                        <div className="font-bold">Cash on Delivery</div>
                        <div className="text-sm text-slate-500">Pay at your doorstep</div>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary focus:ring-primary mr-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><FiCreditCard /></div>
                      <div>
                        <div className="font-bold">Credit / Debit Card</div>
                        <div className="text-sm text-slate-500">Visa, Mastercard, RuPay</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-primary focus:ring-primary mr-4" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">U</div>
                      <div>
                        <div className="font-bold">UPI (GPay, PhonePe, Paytm)</div>
                        <div className="text-sm text-slate-500">Instant payment using UPI ID</div>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(1)} className="font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    Back
                  </button>
                  <Link onClick={() => clearCart()} href="/order-success" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
                    Place Order - ₹{finalTotal}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-xl mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">Order Summary</h2>
            
            <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{item.quantity}x {item.name}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>Delivery Fee</span>
                <span className="text-primary font-bold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Amount to Pay</span>
                <span className="font-extrabold text-xl text-primary">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
