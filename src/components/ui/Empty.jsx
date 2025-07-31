import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Try adjusting your search or browse our categories",
  actionText = "Browse All Products",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">{description}</p>
        </div>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="ShoppingBag" size={16} />
            <span>{actionText}</span>
          </button>
        )}
        
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Search" size={20} className="text-primary" />
            </div>
            <p className="text-xs text-gray-500">Search products</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Filter" size={20} className="text-accent" />
            </div>
            <p className="text-xs text-gray-500">Filter by category</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Star" size={20} className="text-secondary" />
            </div>
            <p className="text-xs text-gray-500">Browse featured</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;