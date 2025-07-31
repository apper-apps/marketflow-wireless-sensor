import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [shipping, setShipping] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Load cart data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
    toast.success('Quantity updated');
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    toast.success('Item removed from cart');
  };

  const handleCalculateShipping = async () => {
    if (!zipCode.trim()) {
      toast.error('Please enter a zip code');
      return;
    }

    setIsCalculatingShipping(true);
    try {
      const totals = cartService.calculateTotals(cartItems, 0, appliedPromo?.discountAmount || 0);
      const shippingResult = await cartService.calculateShipping(zipCode, totals.subtotal);
      setShipping(shippingResult.cost);
      setShippingInfo(shippingResult);
      toast.success('Shipping calculated successfully');
    } catch (error) {
      toast.error(error.message);
      setShipping(0);
      setShippingInfo(null);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    try {
      const totals = cartService.calculateTotals(cartItems, 0, 0);
      const promoResult = await cartService.validatePromoCode(promoCode, totals.subtotal);
      setAppliedPromo(promoResult);
      toast.success(`Promo code applied: ${promoResult.description}`);
    } catch (error) {
      toast.error(error.message);
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.success('Promo code removed');
  };

  const totals = cartService.calculateTotals(
    cartItems, 
    shipping, 
    appliedPromo?.discountAmount || 0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onSearch={() => {}}
          cartItemCount={0}
          onCartToggle={() => {}}
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ApperIcon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-400" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
              <p className="text-gray-600">Add some products to get started!</p>
            </div>
            
            <Button onClick={() => navigate('/')} size="lg">
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={() => {}}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-primary hover:text-primary/80 mb-4 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                
                <div className="space-y-0">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Shipping Calculator */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calculate Shipping
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter zip code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCalculateShipping}
                      disabled={isCalculatingShipping}
                      variant="outline"
                      size="sm"
                    >
                      {isCalculatingShipping ? (
                        <ApperIcon name="Loader2" size={14} className="animate-spin" />
                      ) : (
                        <ApperIcon name="Calculator" size={14} />
                      )}
                    </Button>
                  </div>
                  {shippingInfo && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-medium">{shippingInfo.method}</p>
                      <p>{shippingInfo.estimatedDays}</p>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-success">{appliedPromo.code}</p>
                        <p className="text-sm text-success/80">{appliedPromo.description}</p>
                      </div>
                      <Button
                        onClick={handleRemovePromoCode}
                        variant="ghost"
                        size="sm"
                        className="text-success hover:text-success/80"
                      >
                        <ApperIcon name="X" size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyPromoCode}
                        disabled={isValidatingPromo}
                        variant="outline"
                        size="sm"
                      >
                        {isValidatingPromo ? (
                          <ApperIcon name="Loader2" size={14} className="animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full mt-6" size="lg">
                  <ApperIcon name="CreditCard" size={16} className="mr-2" />
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure checkout powered by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;