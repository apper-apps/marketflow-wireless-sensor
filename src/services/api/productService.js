import { toast } from 'react-toastify';

const productService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "title",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await apperClient.getRecordById('product', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }

      // Return enhanced product data for detail page
      const product = response.data;
      return { 
        ...product,
        detailedDescription: product.description + " This premium product offers exceptional quality and performance, carefully crafted to meet the highest standards. Perfect for both everyday use and special occasions.",
        specifications: this.getSpecifications(product.category?.Name || product.category),
        shippingInfo: {
          freeShipping: product.price > 50,
          estimatedDays: product.inStock ? "2-3 business days" : "Currently unavailable"
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  getSpecifications(categoryName) {
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
    
    return specs[categoryName] || {
      quality: "Premium quality",
      support: "Customer support available",
      satisfaction: "100% satisfaction guarantee"
    };
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [parseInt(categoryId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching products by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "rating" } },
          { field: { Name: "reviewCount" } },
          { field: { Name: "inStock" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "title",
            Operator: "Contains",
            Values: [query]
          }
        ]
      };

      const response = await apperClient.fetchRecords('product', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching products:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: productData.Name,
            title: productData.title,
            price: parseFloat(productData.price),
            image: productData.image,
            rating: parseInt(productData.rating),
            reviewCount: parseInt(productData.reviewCount) || 0,
            inStock: !!productData.inStock,
            description: productData.description,
            category: parseInt(productData.category),
            Tags: productData.Tags || ''
          }
        ]
      };

      const response = await apperClient.createRecord('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create product ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async update(id, productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (productData.Name !== undefined) updateData.Name = productData.Name;
      if (productData.title !== undefined) updateData.title = productData.title;
      if (productData.price !== undefined) updateData.price = parseFloat(productData.price);
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.rating !== undefined) updateData.rating = parseInt(productData.rating);
      if (productData.reviewCount !== undefined) updateData.reviewCount = parseInt(productData.reviewCount);
      if (productData.inStock !== undefined) updateData.inStock = !!productData.inStock;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.category !== undefined) updateData.category = parseInt(productData.category);
      if (productData.Tags !== undefined) updateData.Tags = productData.Tags;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update product ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('product', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete product ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting product:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default productService;