"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiSettings, FiShoppingBag, FiTruck, FiCreditCard, FiPercent } from "react-icons/fi";

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Settings State (Mocked or loaded from LocalStorage for now)
  const [settings, setSettings] = useState({
    storeName: "TKS Balaji Maligai",
    supportEmail: "support@tksbalaji.com",
    supportPhone: "+91 98765 43210",
    storeAddress: "123 Market Street, Chennai, TN, India",
    
    deliveryFee: "50",
    freeDeliveryThreshold: "500",
    deliveryRadius: "10",
    
    enableCOD: true,
    enableOnlinePayment: false,
    
    taxRate: "5"
  });

  useEffect(() => {
    // Admin Guard
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }

    const savedSettings = localStorage.getItem("storeSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API Call
    setTimeout(() => {
      localStorage.setItem("storeSettings", JSON.stringify(settings));
      window.dispatchEvent(new Event("settingsChange"));
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <FiSettings className="text-primary" /> Store Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Configure your shop preferences, delivery options, and taxes.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70"
        >
          {isSaving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</>
          ) : (
            <><FiSave size={18} /> Save Changes</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-colors ${activeTab === "general" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <FiShoppingBag size={18} /> General Info
          </button>
          <button 
            onClick={() => setActiveTab("delivery")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-colors ${activeTab === "delivery" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <FiTruck size={18} /> Delivery Rules
          </button>
          <button 
            onClick={() => setActiveTab("payment")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-colors ${activeTab === "payment" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <FiCreditCard size={18} /> Payment Methods
          </button>
          <button 
            onClick={() => setActiveTab("tax")}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-colors ${activeTab === "tax" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <FiPercent size={18} /> Taxes & Fees
          </button>
        </div>

        {/* Settings Form Content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">General Store Information</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Store Name</label>
                  <input name="storeName" value={settings.storeName} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Support Email</label>
                    <input name="supportEmail" value={settings.supportEmail} onChange={handleInputChange} type="email" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Support Phone Number</label>
                    <input name="supportPhone" value={settings.supportPhone} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Physical Store Address</label>
                  <textarea name="storeAddress" value={settings.storeAddress} onChange={handleInputChange} rows="3" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"></textarea>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Delivery Configuration</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Flat Delivery Fee (₹)</label>
                    <input name="deliveryFee" value={settings.deliveryFee} onChange={handleInputChange} type="number" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Free Delivery Threshold (₹)</label>
                    <input name="freeDeliveryThreshold" value={settings.freeDeliveryThreshold} onChange={handleInputChange} type="number" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Orders over 500 get free delivery" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Maximum Delivery Radius (km)</label>
                  <input name="deliveryRadius" value={settings.deliveryRadius} onChange={handleInputChange} type="number" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                  <p className="text-xs text-slate-500 mt-2">Customers outside this radius will not be able to checkout.</p>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Payment Methods</h2>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:border-primary transition-colors">
                    <div className="mt-1">
                      <input name="enableCOD" checked={settings.enableCOD} onChange={handleInputChange} type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</div>
                      <div className="text-sm text-slate-500 mt-1">Allow customers to pay in cash when the delivery arrives.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:border-primary transition-colors opacity-70">
                    <div className="mt-1">
                      <input disabled name="enableOnlinePayment" checked={settings.enableOnlinePayment} onChange={handleInputChange} type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Online Payments (UPI/Cards) <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded uppercase font-bold text-slate-600 dark:text-slate-400">Coming Soon</span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">Accept payments via Razorpay or Stripe. Requires API keys.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "tax" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Taxes & Fees</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Default Tax/GST Rate (%)</label>
                  <input name="taxRate" value={settings.taxRate} onChange={handleInputChange} type="number" className="w-full md:w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" />
                  <p className="text-xs text-slate-500 mt-2">This percentage will be applied to the order subtotal automatically.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
