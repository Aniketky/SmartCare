/*
Debug version of your ESP32 code
This will help us see where the issue is
*/

#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define REPORTING_PERIOD_MS     1000

// WiFi credentials
const char* ssid = "Aniiiiii";
const char* password = "imbatman";

// Server details
const char* serverURL = "http://10.131.166.81:5000/api/oximeter/reading";

// PulseOximeter instance
PulseOximeter pox;
uint32_t tsLastReport = 0;

// Callback fired when a pulse is detected
void onBeatDetected() {
    Serial.println("B:1");
}

void setup() {
    Serial.begin(115200);
    Serial.println("=== ESP32 Debug Starting ===");
    
    // Initialize WiFi
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // Initialize the PulseOximeter
    Serial.println("Initializing MAX30100...");
    if (!pox.begin(PULSEOXIMETER_DEBUGGINGMODE_PULSEDETECT)) {
        Serial.println("ERROR: Failed to initialize pulse oximeter");
        Serial.println("Check wiring: SDA->GPIO21, SCL->GPIO22, VCC->3.3V, GND->GND");
        for(;;);
    }
    Serial.println("MAX30100 initialized successfully!");

    pox.setOnBeatDetectedCallback(onBeatDetected);
    Serial.println("=== Setup Complete ===");
}

void loop() {
    // Make sure to call update as fast as possible
    pox.update();

    // Asynchronously dump heart rate and oxidation levels to the serial
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
        Serial.print("H:");
        Serial.println(pox.getHeartRate());

        Serial.print("O:");
        Serial.println(pox.getSpO2());
        
        // Send data to SmartCare server
        sendToSmartCare();
        
        delay(500);
        tsLastReport = millis();
    }
}

void sendToSmartCare() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");
        
        // Create JSON payload for SmartCare API
        DynamicJsonDocument doc(1024);
        doc["timestamp"] = millis();
        doc["heartRate"] = (int)pox.getHeartRate();
        doc["spo2"] = pox.getSpO2();
        doc["irValue"] = 50000;
        doc["redValue"] = 45000;
        doc["fingerDetected"] = (pox.getHeartRate() > 0 && pox.getSpO2() > 0);
        doc["deviceId"] = "ESP32_MAX30100_001";
        
        String jsonString;
        serializeJson(doc, jsonString);
        
        int httpResponseCode = http.POST(jsonString);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("SmartCare: " + response);
        } else {
            Serial.println("SmartCare Error: " + String(httpResponseCode));
        }
        
        http.end();
    } else {
        Serial.println("WiFi not connected");
    }
}
