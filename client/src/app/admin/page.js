"use client";

import { motion } from "framer-motion";
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiArrowUpRight, FiMoreVertical } from "react-icons/fi";

const stats = [
  { title: "Total Revenue", value: "₹0", increase: "+0%", icon: <FiDollarSign />, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  { title: "Total Orders", value: "0", increase: "+0%", icon: <FiShoppingBag />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { title: "Customers", value: "0", increase: "+0%", icon: <FiUsers />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { title: "Conversion", value: "0%", increase: "+0%", icon: <FiTrendingUp />, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
];

const recentOrders = [];
const lowStockItems = [];

export default function AdminDashboard() {
  const handleDownloadReport = () => {
    // Generate simple CSV from dynamic stats
    let csvContent = "data:text/csv;charset=utf-8,Metric,Value,Increase\n";
    stats.forEach(stat => {
      csvContent += `${stat.title},${stat.value.replace(/,/g, '')},${stat.increase}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `store_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Welcome back, Admin! Here's what's happening with your store today.</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors w-full md:w-auto"
        >
          Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                <FiArrowUpRight /> {stat.increase}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Recent Orders</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                      <td className="p-4 text-slate-500 text-sm">{order.date}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <FiMoreVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                <FiShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No orders yet</h3>
              <p className="text-slate-500 text-sm max-w-sm">When customers place orders on your store, they will appear here.</p>
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Low Stock Alerts</h2>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            {lowStockItems.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 flex-1">
                  {lowStockItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${item.stock < 5 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${item.stock * 5}%` }}></div>
                          </div>
                          <span className={`text-xs font-bold ${item.stock < 5 ? 'text-red-500' : 'text-orange-500'}`}>{item.stock} left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Update Inventory
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-4">
                  <FiTrendingUp size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Stock levels optimal</h3>
                <p className="text-slate-500 text-sm">All your products are sufficiently stocked right now.</p>
                <button className="mt-6 text-primary text-sm font-semibold hover:underline">
                  Add New Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
