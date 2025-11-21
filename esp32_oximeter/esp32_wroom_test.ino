/*
ESP32 WROOM DA Module Test
This will help verify your specific module is working
*/

void setup() {
  Serial.begin(115200);
  delay(2000); // Give time for ESP32 to initialize
  
  Serial.println("========================================");
  Serial.println("ESP32 WROOM DA Module Test");
  Serial.println("========================================");
  Serial.println("ESP32 Chip Model: ESP32");
  Serial.println("Chip Revision: " + String(ESP.getChipRevision()));
  Serial.println("CPU Frequency: " + String(ESP.getCpuFreqMHz()) + " MHz");
  Serial.println("Flash Size: " + String(ESP.getFlashChipSize() / 1024 / 1024) + " MB");
  Serial.println("Free Heap: " + String(ESP.getFreeHeap()) + " bytes");
  Serial.println("========================================");
  Serial.println("If you see this, your ESP32 WROOM DA is working!");
  Serial.println("========================================");
}

void loop() {
  Serial.println("ESP32 WROOM DA Loop - " + String(millis()));
  delay(2000);
}
