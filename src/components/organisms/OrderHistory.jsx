import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import orderService from '@/services/api/orderService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'orderNumber':
          aValue = a.orderNumber;
          bValue = b.orderNumber;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancel(orderId);
        await loadOrders();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return 'Clock';
      case 'shipped': return 'Truck';
      case 'delivered': return 'CheckCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Package';
    }
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loading message="Loading your orders..." />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search orders by number or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="Search"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Sort Options */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="total-desc">Highest Amount</option>
          <option value="total-asc">Lowest Amount</option>
          <option value="status-asc">Status A-Z</option>
        </select>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {currentOrders.length} of {filteredOrders.length} orders
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty 
          message="No orders found" 
          description="Your order history will appear here"
          icon="Package"
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {currentOrders.map((order) => (
              <motion.div
                key={order.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                        <Badge variant={getStatusColor(order.status)}>
                          <ApperIcon name={getStatusIcon(order.status)} size={14} />
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <span>Ordered: {format(new Date(order.date), 'MMM dd, yyyy')}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>${order.total.toFixed(2)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'processing' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.Id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                      {order.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info(`Tracking: ${order.trackingNumber}`)}
                        >
                          <ApperIcon name="Truck" size={14} />
                          <span className="ml-1">Track</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedOrder(expandedOrder === order.Id ? null : order.Id)}
                      >
                        <ApperIcon 
                          name={expandedOrder === order.Id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                <AnimatePresence>
                  {expandedOrder === order.Id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6 pt-4">
                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.Id} className="flex items-center gap-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                          <h4 className="font-medium mb-3">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <ApperIcon name="Download" size={14} />
                            <span className="ml-1">Download Invoice</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <ApperIcon name="MessageCircle" size={14} />
                            <span className="ml-1">Contact Support</span>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              <ApperIcon name="RotateCcw" size={14} />
                              <span className="ml-1">Return Item</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;