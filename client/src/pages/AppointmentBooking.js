import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/doctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      const response = await axios.get(`/api/appointments/slots/${selectedDoctor.id}`, {
        params: { date: selectedDate }
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Failed to fetch available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select a doctor, date, and time');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await axios.post('/api/appointments', {
        ...formData,
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime
      });

      toast.success('Appointment booked successfully!');
      
      // Reset form
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setFormData({
        patientName: '',
        patientEmail: '',
        symptoms: ''
      });
      setAvailableSlots([]);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Book an Appointment
        </h1>
        <p className="text-gray-600">
          Schedule a consultation with one of our expert doctors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Patient Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.patientEmail}
                onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        </div>

        {/* Doctor Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Doctor
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm">{doctor.experience_years} years experience</p>
                <p className="text-gray-600 text-sm">Rating: {doctor.rating}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        {selectedDoctor && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Date & Time
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {selectedDate && availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 text-sm rounded appointment-slot ${
                          selectedTime === slot.time ? 'selected' : ''
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Symptoms */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Symptoms (Optional)
          </h2>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe your symptoms or reason for visit..."
          />
        </div>

        {/* Booking Summary */}
        {selectedDoctor && selectedDate && selectedTime && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Booking Summary
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Doctor:</strong> {selectedDoctor.name} ({selectedDoctor.specialty})</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Patient:</strong> {formData.patientName}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedDoctor || !selectedDate || !selectedTime || bookingLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {bookingLoading ? (
            <div className="spinner"></div>
          ) : (
            <Calendar className="w-5 h-5" />
          )}
          <span>{bookingLoading ? 'Booking Appointment...' : 'Book Appointment'}</span>
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking; 