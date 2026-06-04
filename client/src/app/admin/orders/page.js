"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { FiShoppingCart, FiSearch, FiMoreVertical, FiEye, FiClock, FiCheckCircle, FiTruck, FiPackage, FiXCircle } from "react-icons/fi";

const statusIcons = {
  "Order received": <FiClock className="text-blue-500" />,
  "Packing": <FiPackage className="text-orange-500" />,
  "Out for delivery": <FiTruck className="text-purple-500" />,
  "Delivered": <FiCheckCircle className="text-green-500" />,
  "Cancelled": <FiXCircle className="text-red-500" />
};

const statusColors = {
  "Order received": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Packing": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "Out for delivery": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  "Cancelled": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Admin Guard
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*, user:profiles(*)').order('created_at', { ascending: false });
      if (error) throw error;
      const mappedOrders = (data || []).map(o => ({
        ...o,
        _id: o.id,
        createdAt: o.created_at,
        shippingAddress: o.shipping_address || {},
        totalPrice: o.total_price || 0,
        orderItems: o.order_items || [],
        isPaid: o.is_paid,
        paidAt: o.paid_at,
        orderStatus: o.order_status,
        paymentMethod: o.payment_method,
        itemsPrice: o.items_price || 0,
        taxPrice: o.tax_price || 0,
        shippingPrice: o.shipping_price || 0
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', id);
      if (error) throw error;
      
      // Update locally
      setOrders(orders.map(order => order._id === id ? { ...order, orderStatus: newStatus } : order));
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.user && o.user.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Orders Management</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Track and manage all customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-sm"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="text-sm font-semibold text-slate-500 flex gap-4">
          <div>Total: <span className="text-primary">{orders.length}</span></div>
          <div>Pending: <span className="text-orange-500">{orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length}</span></div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order ID & Date</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Fulfillment Status</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white uppercase text-sm">#{order._id.substring(order._id.length - 8)}</div>
                      <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{order.user?.name || 'Guest User'}</div>
                      <div className="text-xs text-slate-500">{order.shippingAddress?.city}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">₹{order.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{order.orderItems.length} items</div>
                    </td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded flex w-max items-center gap-1">
                          <FiCheckCircle size={12} /> Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded flex w-max items-center gap-1">
                          <FiXCircle size={12} /> Unpaid
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 mt-1">{order.paymentMethod}</div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${statusColors[order.orderStatus]}`}
                      >
                        <option value="Order received">Order received</option>
                        <option value="Packing">Packing</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FiShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Orders Found</h3>
            <p className="text-slate-500 max-w-sm">When customers checkout, their orders will appear here.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
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
              className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Order #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                  </h2>
                  <p className="text-sm text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1 flex flex-col md:flex-row gap-8">
                
                {/* Left Side: Items */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200 dark:border-slate-800" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                          <div className="text-xs text-slate-500">Qty: {item.qty}</div>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
                      <span>Tax</span>
                      <span>₹{selectedOrder.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
                      <span>Shipping</span>
                      <span>₹{selectedOrder.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-primary mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <span>Total</span>
                      <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/3 space-y-6">
                  
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Customer Info</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-slate-900 dark:text-white">{selectedOrder.user?.name}</p>
                      <p>{selectedOrder.user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Shipping Address</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p>{selectedOrder.shippingAddress?.street}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                      <p>{selectedOrder.shippingAddress?.zipCode}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">Status</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Payment</span>
                        {selectedOrder.isPaid ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Paid on {new Date(selectedOrder.paidAt).toLocaleDateString()}</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Not Paid</span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Fulfillment</span>
                        <select 
                          value={selectedOrder.orderStatus}
                          onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                          className={`w-full text-xs font-bold px-2 py-2 rounded-lg border outline-none cursor-pointer ${statusColors[selectedOrder.orderStatus]}`}
                        >
                          <option value="Order received">Order received</option>
                          <option value="Packing">Packing</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
