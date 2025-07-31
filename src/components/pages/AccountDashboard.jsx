import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import OrderHistory from '@/components/organisms/OrderHistory';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

const AccountDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'orders',
      label: 'Order History',
      icon: 'Package',
      path: '/account/orders',
      component: OrderHistory
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: 'User',
      path: '/account/profile',
      component: () => <div className="p-6">Profile Settings - Coming Soon</div>
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'MapPin',
      path: '/account/addresses',
      component: () => <div className="p-6">Addresses - Coming Soon</div>
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      icon: 'CreditCard',
      path: '/account/payment',
      component: () => <div className="p-6">Payment Methods - Coming Soon</div>
    }
  ];

  const currentPath = location.pathname;
  const activeItem = menuItems.find(item => currentPath.startsWith(item.path)) || menuItems[0];

  // Auto-redirect to orders if on base account path
  React.useEffect(() => {
    if (currentPath === '/account' || currentPath === '/account/') {
      navigate('/account/orders', { replace: true });
    }
  }, [currentPath, navigate]);

  const handleMenuClick = (item) => {
    navigate(item.path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4"
            >
              <ApperIcon name="Menu" size={16} />
              <span className="ml-2">Account Menu</span>
            </Button>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={false}
            animate={{
              x: sidebarOpen ? 0 : '-100%',
              opacity: sidebarOpen ? 1 : 0
            }}
            className={`
              fixed lg:relative top-0 left-0 z-50 lg:z-auto
              w-80 lg:w-64 h-full lg:h-auto
              bg-white lg:bg-transparent
              shadow-xl lg:shadow-none
              lg:translate-x-0 lg:opacity-100
              ${sidebarOpen ? 'block' : 'hidden lg:block'}
            `}
          >
            <div className="p-6 lg:p-0">
              {/* Mobile Close Button */}
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-semibold">My Account</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Account Header */}
              <div className="hidden lg:block mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Account</h1>
                <p className="text-gray-600">Manage your account settings and view your order history</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                      ${currentPath.startsWith(item.path)
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={20} 
                      className={currentPath.startsWith(item.path) ? 'text-white' : 'text-gray-500'} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm"
            >
              <Routes>
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                    <p className="text-gray-600">Profile management coming soon...</p>
                  </div>
                } />
                <Route path="/addresses" element={
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping Addresses</h2>
                    <p className="text-gray-600">Address management coming soon...</p>
                  </div>
                } />
                <Route path="/payment" element={
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                    <p className="text-gray-600">Payment method management coming soon...</p>
                  </div>
                } />
              </Routes>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountDashboard;