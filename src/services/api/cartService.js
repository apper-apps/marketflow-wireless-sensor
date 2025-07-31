const cartService = {
  // Calculate shipping based on zip code and cart value
  async calculateShipping(zipCode, cartValue) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!zipCode || zipCode.length < 5) {
      throw new Error("Please enter a valid zip code");
    }

    // Free shipping over $50
    if (cartValue >= 50) {
      return {
        cost: 0,
        method: "Free Standard Shipping",
        estimatedDays: "3-5 business days"
      };
    }

    // Mock shipping rates based on zip code patterns
    const firstDigit = parseInt(zipCode.charAt(0));
    let baseCost = 8.99;
    let days = "3-5";

    if (firstDigit >= 9) {
      baseCost = 12.99; // West Coast
      days = "4-6";
    } else if (firstDigit >= 6) {
      baseCost = 10.99; // Central
      days = "3-4";
    }

    return {
      cost: baseCost,
      method: "Standard Shipping",
      estimatedDays: `${days} business days`
    };
  },

  // Validate and apply promo codes
  async validatePromoCode(code, cartValue) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const promoCodes = {
      'SAVE10': { discount: 0.10, minOrder: 25, type: 'percentage' },
      'WELCOME20': { discount: 0.20, minOrder: 50, type: 'percentage' },
      'FREESHIP': { discount: 10, minOrder: 0, type: 'fixed' },
      'SAVE5': { discount: 5, minOrder: 0, type: 'fixed' },
      'NEWUSER': { discount: 0.15, minOrder: 30, type: 'percentage' }
    };

    const promo = promoCodes[code.toUpperCase()];
    
    if (!promo) {
      throw new Error("Invalid promo code");
    }

    if (cartValue < promo.minOrder) {
      throw new Error(`Minimum order of $${promo.minOrder} required for this code`);
    }

    let discountAmount;
    if (promo.type === 'percentage') {
      discountAmount = cartValue * promo.discount;
    } else {
      discountAmount = promo.discount;
    }

    return {
      code: code.toUpperCase(),
      discountAmount: Math.min(discountAmount, cartValue), // Cap at cart value
      type: promo.type,
      description: promo.type === 'percentage' 
        ? `${(promo.discount * 100).toFixed(0)}% off`
        : `$${promo.discount} off`
    };
  },

  // Calculate cart totals with all fees
  calculateTotals(cartItems, shipping = 0, discount = 0, taxRate = 0.08) {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    
    const discountAmount = Math.min(discount, subtotal);
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * taxRate;
    const total = discountedSubtotal + tax + shipping;

    return {
      subtotal: Math.max(0, subtotal),
      discount: discountAmount,
      tax: Math.max(0, tax),
      shipping,
      total: Math.max(0, total)
    };
  }
};

export default cartService;