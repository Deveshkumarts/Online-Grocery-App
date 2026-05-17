"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  const [storeInfo, setStoreInfo] = useState({
    address: "123 Grocery Street, Market Area, Chennai, TN 600001",
    phone: "+91 98765 43210",
    email: "support@tksbalajimaligai.com"
  });

  useEffect(() => {
    // Check local storage for settings
    const checkSettings = () => {
      const savedSettings = localStorage.getItem("storeSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setStoreInfo({
          address: parsed.storeAddress || storeInfo.address,
          phone: parsed.supportPhone || storeInfo.phone,
          email: parsed.supportEmail || storeInfo.email
        });
      }
    };

    checkSettings();

    // Listen for storage changes if updated in another tab or directly
    window.addEventListener("storage", checkSettings);
    
    // Also listen to a custom event just in case we update it in the same window
    window.addEventListener("settingsChange", checkSettings);

    return () => {
      window.removeEventListener("storage", checkSettings);
      window.removeEventListener("settingsChange", checkSettings);
    };
  }, []);

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl leading-tight text-primary">TKS Balaji</span>
                <span className="font-semibold text-xs leading-tight text-slate-500 dark:text-slate-400">Maligai</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Your premium local grocery delivery platform. Get fresh vegetables, daily essentials, and top-quality groceries delivered to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-colors">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-slate-200">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/shop?category=vegetables" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Fresh Vegetables</Link></li>
              <li><Link href="/shop?category=fruits" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Fresh Fruits</Link></li>
              <li><Link href="/shop?category=dairy" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Dairy & Bakery</Link></li>
              <li><Link href="/shop?category=snacks" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Snacks & Beverages</Link></li>
              <li><Link href="/shop?category=cleaning" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Cleaning Essentials</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-slate-200">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">FAQ & Help</Link></li>
              <li><Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-slate-200">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <span className="text-slate-600 dark:text-slate-400 text-sm">{storeInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary flex-shrink-0" size={18} />
                <span className="text-slate-600 dark:text-slate-400 text-sm">{storeInfo.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary flex-shrink-0" size={18} />
                <span className="text-slate-600 dark:text-slate-400 text-sm">{storeInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} TKS Balaji Maligai. All rights reserved.
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
          </div>
        </div>
      </div>
    </footer>
  );
}
