"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { FiPlus, FiGrid, FiTrash2, FiSearch, FiX, FiCheckCircle } from "react-icons/fi";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

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
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('products').select('*, category:categories(*)')
      ]);
      const mappedCats = (catRes.data || []).map(c => ({ ...c, _id: c.id }));
      const mappedProds = (prodRes.data || []).map(p => ({ ...p, _id: p.id }));
      setCategories(mappedCats);
      setProducts(mappedProds);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('categories').insert({
        name: categoryName,
        description: categoryDescription,
        image: categoryImage || 'no-photo.jpg'
      });
      if (error) throw error;
      
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage("");
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.message || "Failed to create category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category? Products in it will be uncategorized.")) {
      try {
        await supabase.from('products').update({ category_id: null }).eq('category_id', id);
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (error) {
        console.error("Error deleting category", error);
      }
    }
  };

  const updateProductCategory = async (productId, categoryId) => {
    try {
      const newCatId = categoryId === "uncategorized" ? null : categoryId;
      const { error } = await supabase.from('products').update({ category_id: newCatId }).eq('id', productId);
      if (error) throw error;
      
      // Update local state to reflect change instantly
      setProducts(products.map(p => {
        if (p._id === productId) {
          return { ...p, category: newCatId ? categories.find(c => c._id === categoryId) : null, category_id: newCatId };
        }
        return p;
      }));
    } catch (error) {
      alert("Failed to update product category");
    }
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Category Management</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Create categories and organize your products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Categories List */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FiGrid /> Your Categories
              </h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
              >
                <FiPlus /> Add
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map(cat => (
                  <div key={cat._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      {cat.image && cat.image !== 'no-photo.jpg' ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                          <FiGrid />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</div>
                        <div className="text-xs text-slate-500">{products.filter(p => p.category?._id === cat._id).length} products</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                No categories found. Create one!
              </div>
            )}
          </div>
        </div>

        {/* Product Assignment Table */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Assign Categories to Products</h2>
                <p className="text-sm text-slate-500 mt-1">Select a category from the dropdown for each product.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold">Current Category</th>
                      <th className="p-4 font-semibold w-48">Assign To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          {product.images?.[0] && (
                            <img src={product.images[0]} alt="" className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 object-cover" />
                          )}
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</span>
                        </td>
                        <td className="p-4">
                          {product.category ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold rounded-full">
                              Uncategorized
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <select 
                            value={product.category?._id || "uncategorized"}
                            onChange={(e) => updateProductCategory(product._id, e.target.value)}
                            className="w-full p-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <option value="uncategorized">Uncategorized</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center flex-1">
                <p className="text-slate-500 mb-4">You have no products yet.</p>
                <button 
                  onClick={() => router.push('/admin/products')}
                  className="text-primary font-bold hover:underline"
                >
                  Go to Products Page to Add Some
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Add New Category</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                  <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Fresh Vegetables" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="Short description..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                  <input value={categoryImage} onChange={(e) => setCategoryImage(e.target.value)} type="url" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="https://example.com/icon.png" />
                </div>

                <div className="pt-4 mt-2">
                  <button type="submit" className="w-full py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-hover shadow-md shadow-primary/30 transition-colors">
                    Create Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
