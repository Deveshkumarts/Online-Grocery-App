export const getCart = () => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const id = product._id || product.id;
  const existingItemIndex = cart.findIndex((item) => item.id === id);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ 
      id: id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images ? product.images[0] : (product.image || "https://via.placeholder.com/300"),
      quantity: 1
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${product.name} added to cart!`);
  }
};

export const updateQuantity = (productId, delta) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((item) => item.id === productId);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += delta;
    if (cart[existingItemIndex].quantity <= 0) {
      cart.splice(existingItemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

export const clearCart = () => {
  localStorage.removeItem("cart");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};
