"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiMapPin, FiSun, FiMoon, FiArrowLeft } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const hideShoppingFeatures = isAdminPage || (user && user.role === "admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Check local storage for user on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    
    checkAuth();

    // Check dark mode preference
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("authChange", checkAuth);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${
        scrolled ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-4" : "bg-white dark:bg-slate-900 py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Back Button & Logo */}
        <div className="flex items-center gap-3">
          {pathname !== "/" && (
            <button 
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Go Back"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl leading-tight text-primary">TKS Balaji</span>
              <span className="font-semibold text-xs leading-tight text-slate-500 dark:text-slate-400">Maligai</span>
            </div>
          </Link>
        </div>

        {/* Location (Desktop) */}
        {!hideShoppingFeatures && (
          <div className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer">
            <FiMapPin className="text-primary" />
            <span>Deliver to <span className="font-bold text-black dark:text-white">Chennai</span></span>
          </div>
        )}

        {/* Search Bar (Desktop) */}
        {!hideShoppingFeatures && (
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative group">
            <input
              type="text"
              placeholder="Search for groceries, vegetables, and more..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          {user ? (
            <div className="group relative flex items-center gap-2 cursor-pointer">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-primary/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="hidden lg:inline text-sm font-bold text-slate-700 dark:text-slate-200">{user.name?.split(" ")[0]}</span>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2 flex flex-col">
                  {user.role === "admin" && (
                    <Link href="/admin" className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Admin Dashboard</Link>
                  )}
                  <Link href="/profile" className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">My Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">
              <FiUser size={20} />
              <span className="hidden lg:inline">Login</span>
            </Link>
          )}
          
          {!hideShoppingFeatures && (
            <Link href="/cart" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors font-medium shadow-sm shadow-primary/20">
              <div className="relative">
                <FiShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  0
                </span>
              </div>
              <span className="hidden lg:inline">My Cart</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-300">
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          {!hideShoppingFeatures && (
            <Link href="/cart" className="relative text-slate-600 dark:text-slate-300">
              <FiShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          )}
          <button
            className="text-slate-600 dark:text-slate-300 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      {!hideShoppingFeatures && (
        <div className="md:hidden px-4 pb-3 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300 hover:text-primary p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300 hover:text-primary p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300 hover:text-primary p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                <FiUser size={20} /> My Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
