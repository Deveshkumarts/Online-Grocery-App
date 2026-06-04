"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { FiUser, FiPackage, FiMapPin, FiSettings, FiEdit2, FiLogOut, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
      });
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error } = await supabase.from('profiles').update({
          name: formData.name,
          phone: formData.phone
        }).eq('id', session.user.id);
        
        if (error) throw error;
      }
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("authChange"));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-12 pb-12 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] pt-6 pb-12 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">My Account</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile, orders, and addresses.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white dark:border-slate-800 shadow-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || "U"
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user?.email}</p>
              
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full uppercase tracking-wider">
                Role: <span className={user?.role === 'admin' ? 'text-primary' : ''}>{user?.role || 'Customer'}</span>
              </div>
            </div>

            <nav className="bg-white dark:bg-slate-800 rounded-3xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col space-y-1">
              <button 
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-semibold ${
                  activeTab === "details" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <FiUser size={20} /> Personal Details
              </button>
              
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-semibold ${
                  activeTab === "orders" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <FiPackage size={20} /> Order History
              </button>
              
              <button 
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-semibold ${
                  activeTab === "addresses" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <FiMapPin size={20} /> Saved Addresses
              </button>

              {user?.role === "admin" && (
                <Link 
                  href="/admin"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <FiSettings size={20} /> Admin Dashboard
                </Link>
              )}
              
              <hr className="my-2 border-slate-100 dark:border-slate-700" />
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLogOut size={20} /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px]"
            >
              
              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <div>
                  <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Details</h2>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors bg-primary/10 px-4 py-2 rounded-xl"
                      >
                        <FiEdit2 /> Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button 
                          type="submit"
                          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex-1"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name || "",
                              email: user.email || "",
                              phone: user.phone || "",
                            });
                          }}
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-8 py-3 rounded-xl font-bold transition-all flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-sm mb-1">Full Name</div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-sm mb-1">Email Address</div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white">{user?.email}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-sm mb-1">Phone Number</div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white">{user?.phone || "Not provided"}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-sm mb-1">Account Type</div>
                        <div className="font-bold text-lg text-slate-900 dark:text-white capitalize">{user?.role || "Customer"}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">Order History</h2>
                  
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 mb-6">
                      <FiShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No orders yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">When you place an order, it will appear here so you can track its status.</p>
                    <Link href="/shop" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-primary/20 transition-all">
                      Start Shopping
                    </Link>
                  </div>
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Addresses</h2>
                    <button className="flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors bg-primary/10 px-4 py-2 rounded-xl">
                      + Add New
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-2 border-primary bg-primary/5 rounded-2xl p-6 relative">
                      <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Default</div>
                      <div className="font-bold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2"><FiMapPin /> Home</div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                        123 Main Street, Appt 4B<br/>
                        Chennai, Tamil Nadu<br/>
                        India - 600001
                      </p>
                      <div className="flex gap-3">
                        <button className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Edit</button>
                        <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    </div>

                    <button className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all min-h-[200px]">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FiMapPin size={24} />
                      </div>
                      <span className="font-bold">Add New Address</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
