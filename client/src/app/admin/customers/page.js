"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { FiUsers, FiSearch, FiShoppingCart, FiDollarSign } from "react-icons/fi";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Admin Guard
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all orders to extract customer order history
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { withCredentials: true });
      const orders = res.data.data;
      
      // Group orders by customer
      const customerMap = {};
      
      orders.forEach(order => {
        // If order has a user attached
        if (order.user) {
          const userId = order.user._id || order.user.id;
          if (!customerMap[userId]) {
            customerMap[userId] = {
              id: userId,
              name: order.user.name || "Unknown User",
              orders: [],
              totalSpent: 0,
              lastOrderDate: order.createdAt
            };
          }
          
          customerMap[userId].orders.push(order._id);
          customerMap[userId].totalSpent += order.totalPrice;
          
          if (new Date(order.createdAt) > new Date(customerMap[userId].lastOrderDate)) {
            customerMap[userId].lastOrderDate = order.createdAt;
          }
        }
      });
      
      // Convert map to array and sort by total spent (highest first)
      const customersArray = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(customersArray);

    } catch (error) {
      console.error("Failed to fetch customer data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.orders.some(orderId => orderId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">View your customers and their complete order history.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Customer Name or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="text-sm font-semibold text-slate-500 flex gap-4">
          <div>Total Customers: <span className="text-primary">{customers.length}</span></div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Customer Name</th>
                  <th className="p-4 font-semibold text-center">Total Orders</th>
                  <th className="p-4 font-semibold">Lifetime Spent</th>
                  <th className="p-4 font-semibold">Order IDs</th>
                  <th className="p-4 font-semibold text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{customer.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold rounded-xl text-sm border border-blue-100 dark:border-blue-800/50">
                        {customer.orders.length}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 dark:text-white text-base">₹{customer.totalSpent.toFixed(2)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {customer.orders.map(orderId => (
                          <span 
                            key={orderId} 
                            onClick={() => router.push(`/admin/orders`)}
                            className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors"
                            title={orderId}
                          >
                            #{orderId.substring(orderId.length - 6)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right text-sm text-slate-500">
                      {new Date(customer.lastOrderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FiUsers size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Customers Yet</h3>
            <p className="text-slate-500 max-w-sm">When users place orders, their customer profiles will automatically appear here with their order history.</p>
          </div>
        )}
      </div>
    </div>
  );
}
