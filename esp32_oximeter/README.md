# ESP32 Health Monitoring Integration

This directory contains the Arduino code for integrating a MAX30102 pulse oximeter sensor and DHT temperature/humidity sensor with ESP32 for the SmartCare application.

## Hardware Requirements

- ESP32 development board
- MAX30102 pulse oximeter sensor
- DHT22 or DHT11 temperature and humidity sensor
- Jumper wires
- Breadboard (optional)

## Wiring Diagram

### MAX30102 Oximeter Sensor
Connect the MAX30102 sensor to ESP32 as follows:

```
MAX30102    ESP32
VCC    ->   3.3V
GND    ->   GND
SDA    ->   GPIO 21
SCL    ->   GPIO 22
```

### DHT Temperature/Humidity Sensor
Connect the DHT sensor to ESP32 as follows:

```
DHT22/DHT11    ESP32
VCC         ->   3.3V or 5V
GND         ->   GND
DATA        ->   GPIO 4 (change DHTPIN in code if using different pin)
```

**Note**: If using DHT11, change `DHTTYPE DHT22` to `DHTTYPE DHT11` in the code.

## Software Setup

### 1. Install Required Libraries

Install these libraries in Arduino IDE:
- ArduinoJson (by Benoit Blanchon)
- MAX30105lib (by SparkFun)
- DHT sensor library (by Adafruit)
- Adafruit Unified Sensor (dependency for DHT library)

### 2. Configure WiFi and Sensors

Edit the following lines in `esp32_oximeter.ino`:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* oximeterServerURL = "http://YOUR_SERVER_IP:5000/api/oximeter/reading";
const char* temperatureServerURL = "http://YOUR_SERVER_IP:5000/api/temperature/reading";

#define DHTPIN 4          // Pin connected to DHT sensor
#define DHTTYPE DHT22     // DHT 22 (AM2302) or DHT11
```

Replace:
- `YOUR_WIFI_SSID` with your WiFi network name
- `YOUR_WIFI_PASSWORD` with your WiFi password
- `YOUR_SERVER_IP` with your computer's IP address running the SmartCare server
- `DHTPIN` with the GPIO pin number where your DHT sensor is connected
- `DHTTYPE` to `DHT11` if you're using a DHT11 sensor instead of DHT22

### 3. Upload Code

1. Open `esp32_oximeter.ino` in Arduino IDE
2. Select your ESP32 board and COM port
3. Upload the code to your ESP32

## Usage

1. Power on the ESP32
2. Place your finger on the MAX30102 sensor
3. The device will automatically:
   - Detect your finger and calculate heart rate and SpO2
   - Read temperature and humidity from DHT sensor
   - Send oximeter data to the server every 2 seconds
   - Send temperature/humidity data to the server every 5 seconds
4. View all readings in the SmartCare dashboard under the "Health" tab

## Features

- **Real-time monitoring**: Continuous heart rate, SpO2, temperature, and humidity measurement
- **Finger detection**: Only sends oximeter data when finger is properly placed
- **Multi-sensor support**: Simultaneously reads from oximeter and DHT sensors
- **WiFi connectivity**: Sends data wirelessly to the server
- **Data validation**: Filters out invalid readings
- **Automatic reconnection**: Handles WiFi disconnections gracefully

## Troubleshooting

### No Data in Dashboard
- Check WiFi connection
- Verify server IP address
- Ensure server is running
- Check serial monitor for error messages

### Inaccurate Readings
- **Oximeter**: Ensure finger is properly placed on sensor, keep finger still during measurement
- **Temperature/Humidity**: Ensure DHT sensor is not exposed to direct heat/cold sources, check sensor connections
- Check sensor connections
- Verify sensors are not damaged

### Connection Issues
- Check WiFi credentials
- Verify server URL
- Check firewall settings
- Ensure server is accessible from ESP32

## Technical Details

### Heart Rate Calculation
The code uses a simplified peak detection algorithm to calculate heart rate from the IR sensor data.

### SpO2 Calculation
SpO2 is calculated using a simplified ratio method between red and IR sensor values. For production use, a more sophisticated algorithm should be implemented.

### Data Format

**Oximeter Data** (sent to `/api/oximeter/reading`):
```json
{
  "timestamp": 1234567890,
  "heartRate": 75,
  "spo2": 98.5,
  "irValue": 50000,
  "redValue": 45000,
  "fingerDetected": true,
  "deviceId": "ESP32_Oximeter_001"
}
```

**Temperature Data** (sent to `/api/temperature/reading`):
```json
{
  "timestamp": 1234567890,
  "temperature": 25.5,
  "humidity": 60.2,
  "deviceId": "ESP32_Oximeter_001"
}
```

## Safety Notes

- This is a prototype implementation
- Not intended for medical diagnosis
- Always consult healthcare professionals for medical decisions
- Ensure proper sensor calibration for accurate readings

