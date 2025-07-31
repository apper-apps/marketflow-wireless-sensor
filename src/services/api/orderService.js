import mockOrders from '@/services/mockData/orders.json';
import { toast } from 'react-toastify';

// Internal data store (copy of mock data)
let orders = [...mockOrders];
let nextId = Math.max(...orders.map(o => o.Id)) + 1;

export const orderService = {
  // Get all orders
  getAll() {
    return Promise.resolve([...orders]);
  },

  // Get order by ID
  getById(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid order ID'));
    }
    
    const order = orders.find(o => o.Id === numericId);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }
    
    return Promise.resolve({ ...order });
  },

  // Get orders by status
  getByStatus(status) {
    const filteredOrders = orders.filter(o => 
      status === 'all' || o.status === status
    );
    return Promise.resolve([...filteredOrders]);
  },

  // Search orders
  search(query) {
    const searchTerm = query.toLowerCase();
    const filteredOrders = orders.filter(o => 
      o.orderNumber.toLowerCase().includes(searchTerm) ||
      o.items.some(item => item.name.toLowerCase().includes(searchTerm))
    );
    return Promise.resolve([...filteredOrders]);
  },

  // Update order status
  updateStatus(id, newStatus) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid order ID'));
    }

    const orderIndex = orders.findIndex(o => o.Id === numericId);
    if (orderIndex === -1) {
      return Promise.reject(new Error('Order not found'));
    }

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return Promise.reject(new Error('Invalid status'));
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status: newStatus
    };

    toast.success(`Order ${orders[orderIndex].orderNumber} status updated to ${newStatus}`);
    return Promise.resolve({ ...orders[orderIndex] });
  },

  // Cancel order
  cancel(id) {
    return this.updateStatus(id, 'cancelled');
  },

  // Get order statistics
  getStats() {
    const stats = {
      total: orders.length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalValue: orders.reduce((sum, o) => sum + o.total, 0)
    };
    
    return Promise.resolve(stats);
  }
};

export default orderService;