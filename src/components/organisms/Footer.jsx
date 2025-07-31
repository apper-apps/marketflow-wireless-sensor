import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const footerLinks = {
    "Customer Service": [
      { name: "Contact Us", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Live Chat", href: "#" },
      { name: "Order Status", href: "#" }
    ],
    "Shopping": [
      { name: "All Products", href: "#" },
      { name: "New Arrivals", href: "#" },
      { name: "Best Sellers", href: "#" },
      { name: "Sale Items", href: "#" }
    ],
    "Policies": [
      { name: "Shipping Info", href: "#" },
      { name: "Returns", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "#" },
    { name: "Twitter", icon: "Twitter", href: "#" },
    { name: "Instagram", icon: "Instagram", href: "#" },
    { name: "LinkedIn", icon: "Linkedin", href: "#" }
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-display font-bold gradient-text">
                MarketFlow
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your premium e-commerce destination for quality products across all categories. 
              Shop with confidence and enjoy fast, reliable delivery.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-100 hover:bg-gradient-to-br hover:from-primary hover:to-accent rounded-lg flex items-center justify-center transition-all duration-200 hover:text-white group"
                >
                  <ApperIcon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-gray-900 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h4 className="font-display font-semibold text-gray-900 mb-2">
                Stay updated with our latest offers
              </h4>
              <p className="text-gray-600">
                Subscribe to our newsletter and get 10% off your first purchase
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-12">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 MarketFlow. All rights reserved. Built with ❤️ for amazing shopping experiences.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;