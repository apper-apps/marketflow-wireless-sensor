import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterSidebar = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandChange,
  minRating,
  onRatingChange,
  showInStock,
  showOnSale,
  onAvailabilityChange,
  onClearAll,
  availableBrands = []
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, icon, section, children }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name={icon} size={18} className="text-primary" />
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <ApperIcon 
          name={expandedSections[section] ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-500" 
        />
      </button>
      {expandedSections[section] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-gray-900 flex items-center">
          <ApperIcon name="Filter" size={20} className="mr-2 text-primary" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
<SectionHeader title="Categories" icon="Grid3X3" section="categories">
        <button
          key="all"
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
      </SectionHeader>

      {/* Price Range */}
      <SectionHeader title="Price Range" icon="DollarSign" section="price">
        <div className="space-y-4">
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={priceRange.max}
              onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$0</span>
              <span>$3000+</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <Input
                type="number"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                placeholder="$0"
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <Input
                type="number"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 3000 })}
                placeholder="$3000"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </SectionHeader>

      {/* Brands */}
      <SectionHeader title="Brands" icon="Tag" section="brands">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onBrandChange([...selectedBrands, brand]);
                  } else {
                    onBrandChange(selectedBrands.filter(b => b !== brand));
                  }
                }}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </SectionHeader>

      {/* Customer Rating */}
      <SectionHeader title="Customer Rating" icon="Star" section="rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
<input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => onRatingChange(rating)}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <ApperIcon
                    key={`star-${rating}-${i}`}
                    name="Star"
                    size={14}
                    className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">{rating}+ Stars</span>
              </div>
            </label>
          ))}
<label key="all-ratings" className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => onRatingChange(0)}
              className="border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">All Ratings</span>
          </label>
        </div>
      </SectionHeader>

      {/* Availability */}
      <SectionHeader title="Availability" icon="Package" section="availability">
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={(e) => onAvailabilityChange('inStock', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={14} className="text-green-500" />
              <span className="text-sm text-gray-700">In Stock</span>
            </div>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnSale}
              onChange={(e) => onAvailabilityChange('onSale', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="flex items-center space-x-2">
              <ApperIcon name="Percent" size={14} className="text-red-500" />
              <span className="text-sm text-gray-700">On Sale</span>
            </div>
          </label>
        </div>
      </SectionHeader>
    </div>
  );
};

export default FilterSidebar;