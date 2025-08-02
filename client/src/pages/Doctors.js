import React, { useState, useEffect } from 'react';
import { Users, Star, Clock, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('/api/doctors/specialties/list');
      setSpecialties(response.data.specialties);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const filteredDoctors = selectedSpecialty === 'all' 
    ? doctors 
    : doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Our Expert Doctors
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with qualified specialists across various medical fields. 
          All our doctors are experienced professionals committed to providing the best care.
        </p>
      </div>

      {/* Filter */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Specialty
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">
                  {doctor.specialty}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {doctor.rating} ({doctor.experience_years} years exp.)
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No doctors found
          </h3>
          <p className="text-gray-600">
            No doctors available for the selected specialty.
          </p>
        </div>
      )}
    </div>
  );
};

export default Doctors; 