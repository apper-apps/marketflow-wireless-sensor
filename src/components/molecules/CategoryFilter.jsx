import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center">
        <ApperIcon name="Filter" size={20} className="mr-2 text-primary" />
        Categories
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200",
            activeCategory === "all"
              ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name="Grid3X3" size={16} />
            <span className="font-medium">All Products</span>
          </div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200",
              activeCategory === category.id
                ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name={category.icon} size={16} />
              <span className="font-medium">{category.name}</span>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {category.productCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;