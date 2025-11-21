#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// DHT Sensor Library - Use DHTesp for ESP32 (better compatibility)
// Install from: https://github.com/beegee-tokyo/DHTesp
#include <DHTesp.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server details
const char* oximeterServerURL = "http://YOUR_SERVER_IP:5000/api/oximeter/reading";
const char* temperatureServerURL = "http://YOUR_SERVER_IP:5000/api/temperature/reading";

// MAX30102 sensor
MAX30105 particleSensor;

// DHT Sensor configuration
#define DHTPIN 4          // Pin connected to DHT sensor (change if needed)
// DHTesp library handles DHT22/DHT11 automatically
DHTesp dht;

// Heart rate calculation variables
const byte RATE_SIZE = 4; // Increase this for more averaging
byte rates[RATE_SIZE]; // Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; // Time at which the last beat occurred

// Variables for oximeter readings
float beatsPerMinute;
int beatAvg;
int32_t irValue;
int32_t redValue;
float spo2;
bool fingerDetected = false;

// Timing variables
unsigned long lastReadingTime = 0;
const unsigned long readingInterval = 2000; // Send data every 2 seconds

// Temperature and humidity variables
float temperature = 0.0;
float humidity = 0.0;
unsigned long lastTemperatureReading = 0;
const unsigned long temperatureInterval = 5000; // Read temperature every 5 seconds (DHT needs more time)

void setup() {
  Serial.begin(115200);
  
  // Initialize WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Initialize MAX30102 sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 was not found. Please check wiring/power. ");
    while (1);
  }
  
  // Configure sensor
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
  
  // Initialize DHT sensor
  dht.setup(DHTPIN, DHTesp::DHT22); // Use DHTesp::DHT11 if using DHT11
  delay(2000); // Give sensor time to initialize
  
  Serial.println("Oximeter initialized. Place your finger on the sensor.");
  Serial.println("DHT sensor initialized.");
}

void loop() {
  // Read sensor data
  irValue = particleSensor.getIR();
  redValue = particleSensor.getRed();
  
  // Check if finger is detected
  if (irValue > 50000) {
    fingerDetected = true;
    
    // Calculate heart rate
    if (checkForBeat(irValue)) {
      long delta = millis() - lastBeat;
      lastBeat = millis();
      
      beatsPerMinute = 60 / (delta / 1000.0);
      
      if (beatsPerMinute < 255 && beatsPerMinute > 20) {
        rates[rateSpot++] = (byte)beatsPerMinute;
        rateSpot %= RATE_SIZE;
        
        // Take average reading
        beatAvg = 0;
        for (byte x = 0; x < RATE_SIZE; x++)
          beatAvg += rates[x];
        beatAvg /= RATE_SIZE;
      }
    }
    
    // Calculate SpO2 (simplified calculation)
    // In a real implementation, you'd need more sophisticated algorithms
    float ratio = (float)redValue / (float)irValue;
    spo2 = 100 - (ratio * 20); // Simplified SpO2 calculation
    spo2 = constrain(spo2, 70, 100); // Keep within reasonable range
    
  } else {
    fingerDetected = false;
    beatsPerMinute = 0;
    beatAvg = 0;
    spo2 = 0;
  }
  
  // Send oximeter data to server every readingInterval
  if (millis() - lastReadingTime >= readingInterval) {
    if (fingerDetected && beatAvg > 0) {
      sendOximeterData();
    }
    lastReadingTime = millis();
  }
  
  // Read temperature and humidity from DHT sensor
  if (millis() - lastTemperatureReading >= temperatureInterval) {
    // Read temperature and humidity using DHTesp library
    TempAndHumidity newValues = dht.getTempAndHumidity();
    
    // Check if readings are valid (DHTesp returns NaN on failure)
    if (!isnan(newValues.temperature) && !isnan(newValues.humidity)) {
      temperature = newValues.temperature;
      humidity = newValues.humidity;
      
      // Send temperature data to server
      sendTemperatureData();
      
      Serial.print("Temperature: ");
      Serial.print(temperature, 1);
      Serial.print("°C, Humidity: ");
      Serial.print(humidity, 1);
      Serial.println("%");
    } else {
      Serial.println("Failed to read from DHT sensor! Check connections.");
    }
    
    lastTemperatureReading = millis();
  }
  
  // Print readings to serial for debugging
  if (fingerDetected) {
    Serial.print("HR: ");
    Serial.print(beatAvg);
    Serial.print(" bpm, SpO2: ");
    Serial.print(spo2, 1);
    Serial.print("%, IR: ");
    Serial.print(irValue);
    Serial.print(", Red: ");
    Serial.println(redValue);
  } else {
    Serial.println("No finger detected");
  }
  
  delay(100);
}

void sendOximeterData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(oximeterServerURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["timestamp"] = millis();
    doc["heartRate"] = beatAvg;
    doc["spo2"] = spo2;
    doc["irValue"] = irValue;
    doc["redValue"] = redValue;
    doc["fingerDetected"] = fingerDetected;
    doc["deviceId"] = "ESP32_Oximeter_001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Oximeter data sent successfully. Response: " + response);
    } else {
      Serial.println("Error sending oximeter data. HTTP Code: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

void sendTemperatureData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(temperatureServerURL);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON payload
    DynamicJsonDocument doc(512);
    doc["timestamp"] = millis();
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["deviceId"] = "ESP32_Oximeter_001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Temperature data sent successfully. Response: " + response);
    } else {
      Serial.println("Error sending temperature data. HTTP Code: " + String(httpResponseCode));
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

// Heart rate detection function (simplified)
bool checkForBeat(int32_t sample) {
  static int32_t lastSample = 0;
  static int32_t threshold = 0;
  static int32_t peak = 0;
  static int32_t trough = 0;
  static bool lookingForPeak = true;
  
  int32_t delta = sample - lastSample;
  lastSample = sample;
  
  if (lookingForPeak) {
    if (delta > 0) {
      peak = sample;
    } else {
      threshold = (peak + trough) / 2;
      lookingForPeak = false;
    }
  } else {
    if (delta < 0) {
      trough = sample;
    } else {
      if (sample > threshold) {
        lookingForPeak = true;
        return true;
      }
    }
  }
  
  return false;
}

