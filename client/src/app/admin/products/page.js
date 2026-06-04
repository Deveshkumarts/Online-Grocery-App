"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage, FiPackage, FiDollarSign } from "react-icons/fi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    images: "",
    category: "",
    stock: "",
    unit: "1 kg",
  });

  const router = useRouter();

  useEffect(() => {
    // Admin Guard
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*, category:categories(*)');
      if (error) throw error;
      const mappedProds = (data || []).map(p => ({ ...p, _id: p.id, discountPrice: p.discount_price }));
      setProducts(mappedProds);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || "",
        images: product.images[0] || "",
        category: product.category?._id || product.category || "",
        stock: product.stock,
        unit: product.unit || "1 kg",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        images: "",
        category: "",
        stock: "",
        unit: "1 kg",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        images: [formData.images],
        category_id: formData.category || null,
        stock: parseInt(formData.stock, 10),
        unit: formData.unit,
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      alert(error.message || "Failed to save product. Make sure you fill all required fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product", error);
      }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Product Management</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Add, update, or remove your grocery items.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <FiPlus size={20} /> Add New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="text-sm font-semibold text-slate-500">
          Total Products: <span className="text-primary">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <FiImage />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.unit}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-primary">₹{product.price}</div>
                      {product.discountPrice && <div className="text-xs line-through text-slate-400">₹{product.discountPrice}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock > 0 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FiPackage size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-slate-500 max-w-sm mb-6">You don't have any products yet. Click the button above to add your first grocery item.</p>
            <button 
              onClick={() => openModal()}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
            >
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-20">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={closeModal} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-full transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Aashirvaad Atta" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="Brief product description..."></textarea>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Regular Price (₹) *</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="price" value={formData.price} onChange={handleInputChange} type="number" min="0" className="w-full pl-9 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="100" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Price (₹)</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} type="number" min="0" className="w-full pl-9 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="90" />
                      </div>
                    </div>
                  </div>

                  {/* Inventory & Image */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Stock Quantity *</label>
                      <input required name="stock" value={formData.stock} onChange={handleInputChange} type="number" min="0" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                      <input required name="unit" value={formData.unit} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 1 kg, 500g, 1 piece" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL *</label>
                      <input required name="images" value={formData.images} onChange={handleInputChange} type="url" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none" placeholder="https://example.com/image.jpg" />
                    </div>
                    
                    {formData.images && (
                      <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-center">
                        <img src={formData.images} alt="Preview" className="h-24 w-24 object-cover rounded-lg shadow-sm" onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Invalid+Image"} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-hover shadow-md shadow-primary/30 transition-colors">
                    {editingId ? "Save Changes" : "Create Product"}
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
