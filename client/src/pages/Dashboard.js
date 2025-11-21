import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Activity,
  ArrowUp,
  ArrowDown,
  Plus,
  Bell
} from 'lucide-react';
import Oximeter from '../components/Oximeter';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = [
    { title: 'Total Appointments', value: '24', change: '+12%', trend: 'up', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { title: 'Active Chats', value: '8', change: '+5%', trend: 'up', icon: MessageCircle, color: 'from-green-500 to-green-600' },
    { title: 'Doctors Available', value: '12', change: '-2%', trend: 'down', icon: User, color: 'from-purple-500 to-purple-600' },
    { title: 'Health Score', value: '92', change: '+8%', trend: 'up', icon: Heart, color: 'from-red-500 to-red-600' }
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: 'Today', time: '2:00 PM', status: 'confirmed' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'Neurology', date: 'Tomorrow', time: '10:30 AM', status: 'pending' },
    { id: 3, doctor: 'Dr. Emily Rodriguez', specialty: 'Dermatology', date: 'Dec 15', time: '3:15 PM', status: 'confirmed' }
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'Booked appointment with Dr. Johnson', time: '2 hours ago', icon: Calendar },
    { id: 2, type: 'chat', message: 'Started AI consultation for headache', time: '4 hours ago', icon: MessageCircle },
    { id: 3, type: 'health', message: 'Updated health profile information', time: '1 day ago', icon: Heart },
    { id: 4, type: 'doctor', message: 'Viewed Dr. Chen\'s profile', time: '2 days ago', icon: User }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle }
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your health.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            <Plus className="w-4 h-4 inline mr-2" />
            Book Appointment
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="border-b border-gray-100">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Upcoming Appointments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
                
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
                
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Appointments</h3>
              <p className="text-gray-600">Manage your upcoming appointments here.</p>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Oximeter />
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600">View your chat history and messages here.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Need Medical Help?</h3>
            <p className="text-blue-100">Start an AI consultation or book an appointment with our specialists.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              Start AI Chat
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              Find Doctor
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
