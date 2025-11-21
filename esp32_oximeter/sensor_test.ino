/*
MAX30100 Sensor Test
This will help us see if the sensor is detecting anything
*/

#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

PulseOximeter pox;

void setup() {
    Serial.begin(115200);
    delay(2000);
    
    Serial.println("=== MAX30100 Sensor Test ===");
    
    if (!pox.begin(PULSEOXIMETER_DEBUGGINGMODE_RAW_VALUES)) {
        Serial.println("ERROR: MAX30100 not found!");
        Serial.println("Check wiring: SDA->GPIO21, SCL->GPIO22, VCC->3.3V, GND->GND");
        for(;;);
    }
    
    Serial.println("MAX30100 found! Place your finger on the sensor.");
    Serial.println("You should see changing values when finger is detected.");
}

void loop() {
    pox.update();
    
    // Get raw values to see if sensor is detecting anything
    float heartRate = pox.getHeartRate();
    float spo2 = pox.getSpO2();
    
    Serial.print("Heart Rate: ");
    Serial.print(heartRate);
    Serial.print(" | SpO2: ");
    Serial.print(spo2);
    
    if (heartRate > 0 && spo2 > 0) {
        Serial.println(" <- FINGER DETECTED!");
    } else {
        Serial.println(" <- No finger detected");
    }
    
    delay(1000);
}
