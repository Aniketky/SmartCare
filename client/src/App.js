import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import AppointmentBooking from './pages/AppointmentBooking';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
        </Routes>
      </main>
    </div>
  );
};

export default App; 