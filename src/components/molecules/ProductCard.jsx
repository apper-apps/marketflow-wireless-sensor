import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { motion } from "framer-motion";

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden card-hover group"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" className="text-white bg-red-500">
              Out of Stock
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <ApperIcon name="Heart" size={16} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-display font-bold gradient-text">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-1">
              ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          size="sm"
        >
          <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;