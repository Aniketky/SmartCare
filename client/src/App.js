import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import AppointmentBooking from './pages/AppointmentBooking';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/book-appointment" element={<AppointmentBooking />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default App; 