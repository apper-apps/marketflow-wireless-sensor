import mockCategories from "@/services/mockData/categories.json";

const categoryService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCategories];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const category = mockCategories.find(c => c.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = `category-${Date.now()}`;
    const newCategory = {
      id: newId,
      ...categoryData,
      productCount: 0,
      createdAt: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    mockCategories[index] = {
      ...mockCategories[index],
      ...categoryData,
      id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockCategories[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const deletedCategory = mockCategories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
};

export default categoryService;