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
    return { ...product };
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