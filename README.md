# SmartCare - AI-Powered Telemedicine Platform

<div align="center">

![SmartCare Logo](https://img.shields.io/badge/SmartCare-AI%20Powered%20Healthcare-blue?style=for-the-badge&logo=medical-cross)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**A comprehensive telemedicine platform combining AI-powered medical consultations with IoT health monitoring**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

SmartCare is a full-stack telemedicine web application that revolutionizes healthcare delivery by combining:

- **AI-Powered Medical Analysis** using Google Gemini AI
- **Real-time Health Monitoring** with ESP32-based oximeter
- **Comprehensive Doctor Management** system
- **Intelligent Appointment Scheduling**
- **Secure File Upload** for medical documents

The platform provides instant medical insights, connects patients with specialists, and offers continuous health monitoring through IoT devices.

## 🚀 Features

### 🤖 AI-Powered Healthcare Assistant
- **Intelligent Symptom Analysis**: Chat with AI to describe symptoms and get instant analysis
- **Medical File Processing**: Upload lab results, X-rays, and medical reports for comprehensive analysis
- **Smart Recommendations**: Get diagnosis suggestions, severity assessment, and specialist recommendations
- **Follow-up Questions**: AI generates relevant follow-up questions for better understanding
- **Prescription Suggestions**: AI provides medication recommendations (for informational purposes)

### 👨‍⚕️ Doctor Management System
- **Specialist Database**: Comprehensive database of registered medical specialists
- **Smart Filtering**: Filter doctors by medical specialty based on AI diagnosis
- **Availability Tracking**: Real-time availability and appointment slot management
- **Rating System**: Doctor ratings, experience, and patient feedback
- **Specialty Matching**: AI matches symptoms to appropriate medical specialties

### 📅 Intelligent Appointment Scheduling
- **Easy Booking**: Simple and intuitive appointment booking interface
- **Smart Slot Management**: Real-time availability checking and slot reservation
- **Appointment History**: Complete history of past and upcoming appointments
- **Status Tracking**: Track appointment status (pending, confirmed, cancelled, completed)
- **Reminder System**: Automated appointment reminders

### 📊 IoT Health Monitoring
- **Real-time Oximeter**: ESP32-based pulse oximeter for continuous monitoring
- **Heart Rate Tracking**: Continuous heart rate monitoring with alerts
- **SpO2 Monitoring**: Blood oxygen saturation tracking
- **Historical Data**: 7-day trends and statistics
- **Health Dashboard**: Visual representation of health metrics

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean and modern UI with easy-to-use interface
- **Real-time Updates**: Live updates for appointments and chat messages
- **File Management**: Drag-and-drop file upload with preview
- **Dark/Light Mode**: Adaptive UI themes

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime**: Node.js (v20.15.0+)
- **Framework**: Express.js (v4.18.2)
- **Database**: SQLite3 (v5.1.6) with easy PostgreSQL migration support
- **AI Integration**: Google Gemini AI (Gemini 2.0 Flash)
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **File Upload**: Multer (v1.4.5-lts.1)
- **Security**: Helmet.js (v7.1.0), CORS (v2.8.5)
- **Rate Limiting**: express-rate-limit (v7.1.5)
- **Email**: Nodemailer (v7.0.5)

### Frontend Technologies
- **Framework**: React (v18.2.0)
- **Routing**: React Router DOM (v6.20.1)
- **Styling**: Tailwind CSS (v4.1.11)
- **Icons**: Lucide React (v0.294.0)
- **Animations**: Framer Motion (v12.23.12)
- **Forms**: React Hook Form (v7.48.2)
- **HTTP Client**: Axios (v1.6.2)
- **Notifications**: React Hot Toast (v2.4.1)
- **Date Handling**: date-fns (v2.30.0)

### IoT & Hardware
- **Microcontroller**: ESP32-WROOM-32
- **Sensor**: MAX30102 Pulse Oximeter
- **Communication**: WiFi (802.11 b/g/n)
- **Programming**: Arduino IDE with ESP32 support
- **Libraries**: ArduinoJson, MAX30105lib

### Development Tools
- **Package Manager**: npm
- **Development Server**: Concurrently (v8.2.2)
- **Hot Reload**: Nodemon (v3.0.2)
- **Build Tool**: Create React App
- **Version Control**: Git

## 📁 Project Structure

```
SmartCare/
├── 📁 client/                     # React Frontend
│   ├── 📁 public/                 # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable components
│   │   │   ├── Header.js          # Navigation header
│   │   │   ├── Sidebar.js         # Side navigation
│   │   │   └── Oximeter.js        # Health monitoring component
│   │   ├── 📁 pages/              # Page components
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── Chat.js            # AI chat interface
│   │   │   ├── Doctors.js         # Doctor listings
│   │   │   ├── Appointments.js    # Appointment management
│   │   │   ├── AppointmentBooking.js # Booking interface
│   │   │   └── Dashboard.js       # Main dashboard
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   └── package.json               # Client dependencies
├── 📁 server/                     # Node.js Backend
│   ├── 📁 database/
│   │   └── init.js                # Database initialization
│   ├── 📁 routes/                 # API routes
│   │   ├── chat.js                # Chat/AI endpoints
│   │   ├── doctors.js             # Doctor management
│   │   ├── appointments.js        # Appointment handling
│   │   ├── upload.js              # File upload
│   │   └── oximeter.js            # IoT device endpoints
│   ├── 📁 services/
│   │   └── geminiService.js       # AI integration service
│   ├── 📁 uploads/                # Uploaded files storage
│   ├── index.js                   # Server entry point
│   ├── smartcare.db               # SQLite database
│   └── package.json               # Server dependencies
├── 📁 esp32_oximeter/             # IoT Hardware Code
│   ├── esp32_max30100_adapted.ino # Main oximeter code
│   ├── esp32_oximeter.ino         # Alternative implementation
│   ├── MAX30105.h/.cpp            # Sensor library
│   ├── heartRate.h                # Heart rate algorithms
│   └── README.md                  # Hardware setup guide
├── 📄 OXIMETER_SETUP_GUIDE.md     # Complete setup guide
├── 📄 package.json                # Root package configuration
└── 📄 README.md                   # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v20.15.0 or higher
- **npm**: v10.0.0 or higher
- **Arduino IDE**: For ESP32 programming
- **Google Gemini API Key**: [Get your API key here](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SmartCare.git
cd SmartCare
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DB_PATH=./smartcare.db

# Security
JWT_SECRET=your_jwt_secret_here
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📡 API Documentation

### Chat & AI Endpoints
```http
POST /api/chat/start
Content-Type: application/json

{
  "patientName": "John Doe",
  "patientEmail": "john@example.com"
}
```

```http
POST /api/chat/analyze
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "symptoms": "I have a headache and fever for 2 days"
}
```

### Doctor Management
```http
GET /api/doctors
GET /api/doctors/specialty/:specialty
GET /api/doctors/available/:specialty
```

### Appointment System
```http
POST /api/appointments
Content-Type: application/json

{
  "patientEmail": "patient@example.com",
  "doctorId": "doctor-id",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "symptoms": "Follow-up consultation"
}
```

### IoT Oximeter Integration
```http
POST /api/oximeter/reading
Content-Type: application/json

{
  "deviceId": "ESP32_Oximeter_001",
  "heartRate": 75,
  "spo2": 98.5,
  "irValue": 50000,
  "redValue": 45000,
  "fingerDetected": true
}
```

### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data

FormData: {
  "file": [medical_report.pdf],
  "sessionId": "session-uuid",
  "description": "Lab results"
}
```

## 🔧 ESP32 Oximeter Setup

### Hardware Requirements
- ESP32 development board
- MAX30102 pulse oximeter sensor
- Jumper wires
- Breadboard (optional)

### Wiring Diagram
```
MAX30102    ESP32
VCC    ->   3.3V
GND    ->   GND
SDA    ->   GPIO 21
SCL    ->   GPIO 22
```

### Software Configuration
1. Install Arduino libraries:
   - ArduinoJson (by Benoit Blanchon)
   - MAX30105lib (by SparkFun)

2. Update WiFi credentials in `esp32_oximeter/esp32_max30100_adapted.ino`:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/oximeter/reading";
```

3. Upload code to ESP32 and monitor serial output

For detailed setup instructions, see [OXIMETER_SETUP_GUIDE.md](./OXIMETER_SETUP_GUIDE.md)

## 🎯 Usage Guide

### 1. Starting an AI Consultation
1. Navigate to the "AI Chat" section
2. Enter your name and email
3. Describe your symptoms in detail
4. Upload any relevant medical files
5. Get instant AI analysis and recommendations

### 2. Booking an Appointment
1. Use AI recommendations to find the right specialist
2. Browse available doctors by specialty
3. Select preferred time slots
4. Confirm appointment details
5. Receive confirmation and reminders

### 3. Health Monitoring
1. Set up ESP32 oximeter following the setup guide
2. Place finger on sensor for readings
3. View real-time data in the dashboard
4. Monitor trends and statistics
5. Get alerts for abnormal readings

## 🔒 Security Features

- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin resource sharing control
- **Helmet.js**: Security headers implementation
- **Input Validation**: Comprehensive data validation
- **File Upload Security**: Secure file handling and validation
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set production values
2. **Database**: Migrate to PostgreSQL for production
3. **HTTPS**: Enable SSL/TLS certificates
4. **Authentication**: Implement user authentication
5. **Monitoring**: Set up application monitoring
6. **Backup**: Implement database backup strategy

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile for server
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test chat functionality
curl -X POST http://localhost:5000/api/chat/start \
  -H "Content-Type: application/json" \
  -d '{"patientName":"Test User","patientEmail":"test@example.com"}'
```

### Frontend Testing
```bash
cd client
npm test
```

## 📊 Performance Metrics

- **Frontend Load Time**: < 2 seconds
- **API Response Time**: < 500ms average
- **Database Queries**: Optimized with indexes
- **File Upload**: Supports up to 10MB files
- **Real-time Updates**: 2-second intervals for IoT data

## 🔮 Future Enhancements

### Planned Features
- [ ] **User Authentication**: Complete auth system with JWT
- [ ] **Video Consultations**: WebRTC integration
- [ ] **Prescription Management**: Digital prescription system
- [ ] **Medical History**: Comprehensive patient records
- [ ] **Payment Integration**: Stripe/PayPal integration
- [ ] **Mobile App**: React Native mobile application
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced AI**: Image analysis, voice recognition
- [ ] **Telemetry Dashboard**: Advanced IoT monitoring
- [ ] **Integration APIs**: Third-party medical systems

### Technical Improvements
- [ ] **WebSocket Support**: Real-time communication
- [ ] **GraphQL API**: Modern API architecture
- [ ] **Microservices**: Service-oriented architecture
- [ ] **Cloud Deployment**: AWS/Azure integration
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Performance Optimization**: Caching and optimization
- [ ] **Security Hardening**: Advanced security measures

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Follow conventional commits
- Ensure cross-browser compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**Important**: This application is for educational and demonstration purposes only. It is NOT intended for:
- Medical diagnosis or treatment
- Replacement of professional medical advice
- Emergency medical situations
- Clinical decision making

Always consult with qualified healthcare professionals for medical decisions and use certified medical devices for critical health monitoring.

## 🆘 Support & Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 5000 is available
- Verify environment variables are set
- Ensure all dependencies are installed

**ESP32 connection issues:**
- Verify WiFi credentials
- Check server IP address
- Ensure server is running and accessible

**AI responses not working:**
- Verify Gemini API key is valid
- Check API quota and limits
- Review server logs for errors

### Getting Help
- 📧 **Email**: support@smartcare.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/SmartCare/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/SmartCare/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/SmartCare/discussions)

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful medical analysis capabilities
- **React Team** for the amazing frontend framework
- **Express.js Team** for the robust backend framework
- **Arduino Community** for ESP32 and sensor libraries
- **Open Source Contributors** who made this project possible

---

<div align="center">

**SmartCare** - Revolutionizing healthcare with AI-powered telemedicine solutions. 

Made with ❤️ by the SmartCare Team

[⭐ Star this repository](https://github.com/yourusername/SmartCare) • [🐛 Report Bug](https://github.com/yourusername/SmartCare/issues) • [💡 Request Feature](https://github.com/yourusername/SmartCare/issues)

</div>