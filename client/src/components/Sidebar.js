import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  Users, 
  Calendar, 
  Plus, 
  BarChart3, 
  Settings, 
  X,
  User,
  Shield,
  Heart
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home', color: 'from-blue-500 to-blue-600' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard', color: 'from-purple-500 to-purple-600' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat', color: 'from-green-500 to-green-600' },
    { path: '/doctors', icon: Users, label: 'Doctors', color: 'from-orange-500 to-orange-600' },
    { path: '/appointments', icon: Calendar, label: 'Appointments', color: 'from-red-500 to-red-600' },
    { path: '/book-appointment', icon: Plus, label: 'Book Appointment', color: 'from-indigo-500 to-indigo-600' },
  ];

  const sidebarVariants = {
    closed: { x: '-100%', opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">SmartCare</h2>
                    <p className="text-blue-100 text-sm">Your Health Partner</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* User Info */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Welcome Back!</p>
                    <p className="text-blue-100 text-sm">Sign in to continue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive(item.path) 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.path) ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute right-2 w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Shield className="w-5 h-5" />
                  <span>Privacy</span>
                </button>
              </div>
              
              {/* Sign In Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Sign In
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
