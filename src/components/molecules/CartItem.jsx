import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.productId);
    } else {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {item.product.title}
        </h4>
        <p className="text-sm text-gray-500">
          ${item.product.price.toFixed(2)} each
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>
        
        <span className="w-8 text-center font-medium text-gray-900">
          {item.quantity}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 p-0"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-900">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;