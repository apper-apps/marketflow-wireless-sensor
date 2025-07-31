import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productData = await productService.getById(parseInt(id));
      setProduct(productData);

      // Load category data for breadcrumb
      const categories = await categoryService.getAll();
      const productCategory = categories.find(cat => cat.id === productData.category);
      setCategory(productCategory);
    } catch (err) {
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    // Add to cart logic would go here
    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" size={16} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  const getProductImages = () => {
    if (!product) return [];
    
    // Generate additional images for gallery (in real app, these would come from the API)
    return [
      product.image,
      product.image + "?variant=1",
      product.image + "?variant=2",
      product.image + "?variant=3"
    ];
  };

  const getCategoryName = () => {
    if (!category) return product?.category || "";
    return category.name || category.id;
  };

  const getKeyFeatures = () => {
    // Generate key features based on category (in real app, would come from API)
    const features = {
      electronics: [
        "Latest technology integration",
        "Energy efficient design",
        "Premium build quality",
        "Extended warranty included",
        "User-friendly interface"
      ],
      clothing: [
        "Premium fabric quality",
        "Comfortable fit design",
        "Easy care instructions",
        "Durable construction",
        "Style versatility"
      ],
      "home-garden": [
        "Durable materials",
        "Easy assembly",
        "Weather resistant",
        "Low maintenance",
        "Space efficient design"
      ],
      books: [
        "Expert author credentials",
        "Comprehensive coverage",
        "Easy to understand",
        "Practical examples",
        "Updated content"
      ],
      sports: [
        "Professional grade quality",
        "Performance optimized",
        "Durable construction",
        "Ergonomic design",
        "Suitable for all levels"
      ]
    };

    return features[product?.category] || [
      "High quality materials",
      "Excellent craftsmanship",
      "Great value for money",
      "Customer satisfaction guaranteed",
      "Fast shipping available"
    ];
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <Error message="Product not found" onRetry={() => navigate("/")} />;
  }

  const images = getProductImages();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="hover:text-primary transition-colors cursor-pointer">
            {getCategoryName()}
          </span>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900 font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Back to Results */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span>Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative mb-4">
              <motion.div
                className={`relative overflow-hidden rounded-xl bg-white shadow-lg ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setIsZoomed(!isZoomed)}
                animate={{ scale: isZoomed ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={images[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="danger" className="text-white bg-red-500 text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-primary shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
                {product.title}
              </h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              <span className="text-4xl font-display font-bold gradient-text">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {getKeyFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <ApperIcon name="Check" size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 p-0"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 p-0"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-4 text-lg font-semibold"
                  size="lg"
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-3" />
                  {product.inStock ? `Add ${quantity} to Cart` : "Out of Stock"}
                </Button>
              </motion.div>

              {/* Additional Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 py-3"
                  onClick={() => toast.info("Added to wishlist!")}
                >
                  <ApperIcon name="Heart" size={18} className="mr-2" />
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3"
                  onClick={() => toast.info("Share link copied!")}
                >
                  <ApperIcon name="Share2" size={18} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={product.inStock ? "CheckCircle" : "XCircle"} 
                size={20} 
                className={product.inStock ? "text-green-500" : "text-red-500"} 
              />
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock - Ready to Ship" : "Currently Out of Stock"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;