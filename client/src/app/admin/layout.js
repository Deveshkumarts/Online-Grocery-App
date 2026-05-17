"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBox, FiGrid, FiUsers, FiShoppingCart, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin" },
    { name: "Products", icon: <FiBox />, path: "/admin/products" },
    { name: "Categories", icon: <FiGrid />, path: "/admin/categories" },
    { name: "Orders", icon: <FiShoppingCart />, path: "/admin/orders" },
    { name: "Customers", icon: <FiUsers />, path: "/admin/customers" },
    { name: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 w-full mt-[-80px] pt-[80px]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-[80px] left-0 h-[calc(100vh-80px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center md:hidden">
          <span className="font-bold text-lg text-primary">Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Main Menu</div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                  pathname === item.path 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`${pathname === item.path ? 'text-primary' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-[80px] z-30">
          <span className="font-bold text-lg text-slate-800 dark:text-white">Admin Dashboard</span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <FiMenu size={20} />
          </button>
        </div>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
