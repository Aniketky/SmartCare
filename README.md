# SmartCare - AI-Powered Telemedicine Platform

SmartCare is a full-stack telemedicine web application that combines AI-powered medical consultations with traditional healthcare services. The platform features a chatbot interface powered by Google Gemini AI for symptom analysis and doctor recommendations.

## 🚀 Features

### AI-Powered Healthcare Assistant
- **Symptom Analysis**: Chat with AI to describe symptoms and get instant analysis
- **File Upload**: Upload medical reports, lab results, and images for comprehensive analysis
- **Intelligent Recommendations**: Get diagnosis suggestions, severity assessment, and specialist recommendations
- **Follow-up Questions**: AI generates relevant follow-up questions for better understanding

### Doctor Management System
- **Specialist Database**: Comprehensive database of registered medical specialists
- **Specialty Filtering**: Filter doctors by medical specialty based on AI diagnosis
- **Availability Tracking**: Real-time availability and appointment slot management
- **Rating System**: Doctor ratings and experience information

### Appointment Scheduling
- **Easy Booking**: Simple appointment booking interface
- **Slot Management**: Real-time availability checking and slot reservation
- **Appointment History**: View and manage past and upcoming appointments
- **Status Tracking**: Track appointment status (pending, confirmed, cancelled, completed)

### Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean and modern UI with easy-to-use interface
- **Real-time Updates**: Live updates for appointments and chat messages
- **File Management**: Drag-and-drop file upload with preview

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database (easily upgradable to PostgreSQL)
- **Google Gemini AI** for medical analysis
- **Multer** for file uploads
- **JWT** for authentication (ready for implementation)

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartcare
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### 3. Environment Setup
```bash
# Copy environment example
cp server/env.example server/.env

# Edit the .env file with your configuration
nano server/.env
```

Update the following variables in `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Database
DB_PATH=./smartcare.db

# Security
JWT_SECRET=your_jwt_secret_here
```

### 4. Start the Application
```bash
# Start both server and client in development mode
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
smartcare/
├── server/                 # Backend Node.js application
│   ├── database/          # Database initialization and models
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic (Gemini AI service)
│   ├── uploads/           # File upload directory
│   ├── index.js           # Main server file
│   └── package.json       # Server dependencies
├── client/                # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # React entry point
│   └── package.json       # Client dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 API Endpoints

### Chat Routes
- `POST /api/chat/start` - Start a new chat session
- `POST /api/chat/analyze` - Analyze symptoms with AI
- `POST /api/chat/follow-up` - Get follow-up questions
- `GET /api/chat/session/:sessionId` - Get session details
- `GET /api/chat/patient/:email` - Get patient sessions

### Doctor Routes
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/specialty/:specialty` - Get doctors by specialty
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/available/:specialty` - Get available doctors
- `GET /api/doctors/specialties/list` - Get all specialties

### Appointment Routes
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/patient/:email` - Get patient appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor appointments
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/slots/:doctorId` - Get available time slots

### Upload Routes
- `POST /api/upload` - Upload medical files
- `GET /api/upload/session/:sessionId` - Get session files
- `DELETE /api/upload/:fileId` - Delete uploaded file

## 🎯 Usage Guide

### 1. Starting an AI Consultation
1. Navigate to the "AI Chat" section
2. Enter your name and email
3. Describe your symptoms in detail
4. Optionally upload medical files (reports, images)
5. Receive AI analysis and recommendations

### 2. Booking an Appointment
1. Go to "Book Appointment" page
2. Fill in your personal information
3. Select a doctor from the available specialists
4. Choose a convenient date and time slot
5. Add any additional symptoms or notes
6. Confirm your booking

### 3. Managing Appointments
1. Visit "Appointments" page
2. Enter your email to view your appointments
3. Check appointment status and details
4. Contact the doctor if needed

## 🔒 Security Features

- **Rate Limiting**: API endpoints are protected against abuse
- **File Upload Security**: Restricted file types and size limits
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Protection**: Configured for production security
- **Helmet.js**: Security headers for Express.js

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
cd server
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build React app
cd client
npm run build

# Serve static files
npx serve -s build
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_production_gemini_key
JWT_SECRET=your_secure_jwt_secret
DB_PATH=/path/to/production/database.db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

- **Medical Disclaimer**: This AI analysis is for informational purposes only and should not replace professional medical advice
- **Data Privacy**: Ensure compliance with healthcare data protection regulations (HIPAA, GDPR, etc.)
- **API Limits**: Be aware of Google Gemini API usage limits and costs
- **Production Setup**: Implement proper authentication, HTTPS, and database backups for production use

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the health check endpoint: `GET /api/health`

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Video consultation integration
- [ ] Prescription management
- [ ] Medical history tracking
- [ ] Payment integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced AI features (image analysis, voice recognition)

---

**SmartCare** - Revolutionizing healthcare with AI-powered telemedicine solutions. 