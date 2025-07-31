import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import CartDrawer from "@/components/organisms/CartDrawer";
import Footer from "@/components/organisms/Footer";
import categoryService from "@/services/api/categoryService";
import { toast } from "react-toastify";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("marketflow-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("marketflow-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.Id);
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          productId: product.Id,
          quantity: 1,
          product: product
        }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    toast.info("Item removed from cart");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setActiveCategory("all"); // Reset category when searching
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(""); // Clear search when changing category
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        cartItemCount={totalCartItems}
        onCartToggle={() => setIsCartOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Category Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Mobile Category Filter */}
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto space-x-3 pb-4">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-primary to-accent text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {searchQuery && (
              <div className="mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">
                  Search results for "{searchQuery}"
                </h2>
              </div>
            )}
            
            <ProductGrid
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default HomePage;