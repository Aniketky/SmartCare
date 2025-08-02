import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientEmail, setPatientEmail] = useState('');

  const fetchAppointments = async (email) => {
    if (!email) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/appointments/patient/${email}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAppointments(patientEmail);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          My Appointments
        </h1>
        <p className="text-gray-600">
          View and manage your scheduled appointments
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            View Appointments
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctor_name}
                      </h3>
                      <p className="text-blue-600">{appointment.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.appointment_date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{appointment.patient_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{appointment.patient_email}</span>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.symptoms && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                      <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && appointments.length === 0 && patientEmail && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600">
            You don't have any appointments scheduled.
          </p>
        </div>
      )}
    </div>
  );
};

export default Appointments; 