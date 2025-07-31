import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { motion } from "framer-motion";
const ProductCard = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const getPlaceholderImage = () => {
    // Generate a consistent placeholder based on product title
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100'];
    const colorIndex = product.title.length % colors.length;
    return colors[colorIndex];
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
    <Link to={`/product/${product.Id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden card-hover group cursor-pointer"
      >
        <div className="relative overflow-hidden">
          {imageLoading && (
            <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
              <ApperIcon name="Image" size={24} className="text-gray-400" />
            </div>
          )}
          
          {imageError ? (
            <div className={`w-full h-48 ${getPlaceholderImage()} flex flex-col items-center justify-center`}>
              <ApperIcon name="Package" size={32} className="text-gray-500 mb-2" />
              <span className="text-sm text-gray-600 font-medium">{product.title}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.title}
              className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          )}
          
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
    </Link>
  );
};

export default ProductCard;