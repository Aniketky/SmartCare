import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  MessageCircle, 
  Users, 
  Calendar, 
  Shield, 
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Diagnosis',
      description: 'Get instant medical insights from our advanced AI chatbot powered by Google Gemini.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Connect with qualified specialists across various medical fields.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with your preferred doctors at convenient times.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health information is protected with industry-standard security.',
      color: 'bg-red-100 text-red-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Patients Served', icon: Users },
    { number: '50+', label: 'Expert Doctors', icon: Stethoscope },
    { number: '24/7', label: 'AI Support', icon: Clock },
    { number: '4.9', label: 'Patient Rating', icon: Star }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Health, Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of healthcare with AI-powered consultations, 
            expert doctors, and seamless appointment booking - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start AI Consultation</span>
            </Link>
            <Link
              to="/doctors"
              className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Find Doctors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose SmartCare?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge AI technology with human expertise to provide 
            you with the best possible healthcare experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of patients who trust SmartCare for their healthcare needs. 
          Start your journey to better health today.
        </p>
        <Link
          to="/book-appointment"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
        >
          <span>Book Your First Appointment</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* How It Works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600">
            Get started with SmartCare in just three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Describe Your Symptoms
            </h3>
            <p className="text-gray-600">
              Chat with our AI assistant to describe your symptoms and upload any relevant medical files.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get AI Analysis
            </h3>
            <p className="text-gray-600">
              Receive instant analysis, recommendations, and specialist suggestions from our AI.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Book Appointment
            </h3>
            <p className="text-gray-600">
              Schedule an appointment with a recommended specialist for personalized care.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 