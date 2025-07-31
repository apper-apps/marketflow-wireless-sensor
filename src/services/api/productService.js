import mockProducts from "@/services/mockData/products.json";

const productService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockProducts];
  },

async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = mockProducts.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    
    // Return enhanced product data for detail page
    return { 
      ...product,
      detailedDescription: product.description + " This premium product offers exceptional quality and performance, carefully crafted to meet the highest standards. Perfect for both everyday use and special occasions.",
      specifications: this.getSpecifications(product.category),
      shippingInfo: {
        freeShipping: product.price > 50,
        estimatedDays: product.inStock ? "2-3 business days" : "Currently unavailable"
      }
    };
  },

  getSpecifications(category) {
    const specs = {
      electronics: {
        warranty: "2 years manufacturer warranty",
        support: "24/7 technical support",
        compatibility: "Universal compatibility"
      },
      clothing: {
        material: "Premium quality fabric",
        care: "Machine washable",
        fit: "True to size"
      },
      "home-garden": {
        material: "Durable construction",
        maintenance: "Low maintenance required",
        installation: "Easy setup included"
      },
      books: {
        pages: "Comprehensive content",
        format: "Print and digital available",
        language: "English"
      },
      sports: {
        quality: "Professional grade",
        usage: "All skill levels",
        durability: "Built to last"
      }
    };
    
    return specs[category] || {
      quality: "Premium quality",
      support: "Customer support available",
      satisfaction: "100% satisfaction guarantee"
    };
  },

  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return mockProducts.filter(p => p.category === categoryId).map(p => ({ ...p }));
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    return mockProducts
      .filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
      .map(p => ({ ...p }));
  },

  async create(productData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...mockProducts.map(p => p.Id)) + 1;
    const newProduct = {
      Id: newId,
      ...productData,
      createdAt: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...productData,
      Id: parseInt(id), // Ensure Id stays the same
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockProducts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = mockProducts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deletedProduct = mockProducts.splice(index, 1)[0];
    return { ...deletedProduct };
  }
};

export default productService;