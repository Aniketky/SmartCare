import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Heart, 
  ShoppingCart,
  MessageCircle,
  Calendar
} from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, title: 'Appointment Reminder', message: 'Your appointment with Dr. Smith is in 2 hours', time: '2 min ago', type: 'reminder' },
    { id: 2, title: 'New Message', message: 'Dr. Johnson sent you a message', time: '1 hour ago', type: 'message' },
    { id: 3, title: 'Test Results', message: 'Your lab results are ready', time: '3 hours ago', type: 'results' }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'results': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reminder': return 'border-l-blue-500';
      case 'message': return 'border-l-green-500';
      case 'results': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartCare
                </h1>
                <p className="text-xs text-gray-500">Your Health Partner</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors, specialties, symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                to="/chat"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              </Link>
              
              <Link
                to="/book-appointment"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
              </Link>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-500">You have {notifications.length} new notifications</p>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 border-l-4 ${getNotificationColor(notification.type)} hover:bg-gray-50 transition-colors cursor-pointer`}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 