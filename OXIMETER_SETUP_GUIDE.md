# SmartCare Oximeter Integration Setup Guide

This guide will help you integrate an ESP32-based oximeter with your SmartCare application.

## Overview

The oximeter integration includes:
- ESP32 Arduino code for MAX30102 sensor
- Backend API for data storage and retrieval
- Frontend dashboard component for real-time display
- Database schema for historical data

## Prerequisites

### Hardware
- ESP32 development board
- MAX30102 pulse oximeter sensor
- Jumper wires
- Breadboard (optional)

### Software
- Arduino IDE with ESP32 support
- Node.js and npm (already installed)
- SmartCare application running

## Step 1: Hardware Setup

### Wiring
Connect the MAX30102 sensor to ESP32:

```
MAX30102 Pin    ESP32 Pin
VCC         ->  3.3V
GND         ->  GND
SDA         ->  GPIO 21
SCL         ->  GPIO 22
```

### Power Requirements
- ESP32: 3.3V (can be powered via USB)
- MAX30102: 3.3V (powered from ESP32)

## Step 2: Software Configuration

### 1. Install Arduino Libraries
In Arduino IDE, install these libraries:
- **ArduinoJson** (by Benoit Blanchon)
- **MAX30105lib** (by SparkFun)

### 2. Configure ESP32 Code
Edit `esp32_oximeter/esp32_oximeter.ino`:

```cpp
// Update these values
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:5000/api/oximeter/reading";
```

### 3. Find Your Server IP
Run this command to find your computer's IP address:

**Windows:**
```cmd
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

## Step 3: Backend Setup

The backend is already configured with:
- Oximeter API routes (`/api/oximeter/*`)
- Database table for storing readings
- CORS enabled for ESP32 communication

### Test the API
Start your server and test the oximeter endpoint:

```bash
cd server
npm start
```

Test with curl:
```bash
curl -X POST http://localhost:5000/api/oximeter/reading \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "test_device",
    "heartRate": 75,
    "spo2": 98.5,
    "irValue": 50000,
    "redValue": 45000,
    "fingerDetected": true
  }'
```

## Step 4: Frontend Setup

The frontend is already updated with:
- Oximeter component in the Health tab
- Real-time data display
- Statistics and historical readings

### Start the Frontend
```bash
cd client
npm start
```

## Step 5: Complete Integration

### 1. Upload ESP32 Code
1. Open `esp32_oximeter/esp32_oximeter.ino` in Arduino IDE
2. Select your ESP32 board and COM port
3. Upload the code

### 2. Test the Connection
1. Open Serial Monitor in Arduino IDE (115200 baud)
2. You should see:
   - WiFi connection status
   - "Oximeter initialized" message
   - "No finger detected" or sensor readings

### 3. View in Dashboard
1. Open SmartCare application
2. Go to Dashboard
3. Click on "Health" tab
4. You should see the oximeter interface

## Usage Instructions

### Taking a Reading
1. Place your finger on the MAX30102 sensor
2. Keep your finger still for 10-15 seconds
3. The device will automatically:
   - Detect your finger
   - Calculate heart rate and SpO2
   - Send data to the server
4. View the readings in the dashboard

### Understanding the Readings
- **Heart Rate**: Beats per minute (BPM)
  - Normal range: 60-100 BPM
  - Green: Normal range
  - Red: Outside normal range

- **SpO2**: Blood oxygen saturation (%)
  - Normal range: 95-100%
  - Green: Normal range
  - Red: Below 95%

### Dashboard Features
- **Current Reading**: Latest heart rate and SpO2
- **Connection Status**: Shows if ESP32 is connected
- **Statistics**: 7-day averages and trends
- **Recent Readings**: Last 5 readings with timestamps
- **Auto-refresh**: Updates every 5 seconds

## Troubleshooting

### ESP32 Issues
**Problem**: No WiFi connection
- Check WiFi credentials
- Verify network is 2.4GHz (ESP32 doesn't support 5GHz)
- Check signal strength

**Problem**: No data being sent
- Check server IP address
- Verify server is running
- Check serial monitor for error messages

### Server Issues
**Problem**: API not responding
- Check if server is running on port 5000
- Verify CORS settings
- Check firewall settings

**Problem**: Database errors
- Check if SQLite database exists
- Verify file permissions
- Check server logs

### Frontend Issues
**Problem**: No data displayed
- Check browser console for errors
- Verify API endpoints are accessible
- Check network connectivity

**Problem**: Stale data
- Click the refresh button
- Check if ESP32 is sending data
- Verify server is receiving data

## Safety and Medical Disclaimer

⚠️ **Important**: This oximeter integration is for educational and demonstration purposes only. It is NOT intended for:
- Medical diagnosis
- Medical treatment decisions
- Replacement of professional medical devices
- Emergency medical situations

Always consult with healthcare professionals for medical decisions and use certified medical devices for critical health monitoring.

## Technical Specifications

### ESP32
- Microcontroller: ESP32-WROOM-32
- WiFi: 802.11 b/g/n
- Bluetooth: 4.2
- Operating Voltage: 3.3V
- Input Voltage: 7-12V (via USB)

### MAX30102
- Heart Rate Range: 0-200 BPM
- SpO2 Range: 70-100%
- LED Wavelengths: 660nm (Red), 880nm (IR)
- Sampling Rate: Up to 1000 Hz
- Operating Voltage: 3.3V

### Data Transmission
- Protocol: HTTP POST
- Format: JSON
- Frequency: Every 2 seconds
- Data Size: ~200 bytes per reading

## Support

For technical support or questions:
1. Check the troubleshooting section
2. Review the Arduino serial monitor output
3. Check server logs
4. Verify all connections and configurations

## Future Enhancements

Potential improvements for the oximeter integration:
- WebSocket for real-time updates
- Data visualization charts
- Historical data export
- Multiple device support
- Advanced SpO2 algorithms
- Mobile app integration
- Cloud data storage

