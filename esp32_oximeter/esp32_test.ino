/*
Simple ESP32 Test Code
This will help us verify if your ESP32 is working
*/

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 Test - Starting...");
  delay(1000);
  Serial.println("ESP32 is working!");
}

void loop() {
  Serial.println("ESP32 Loop - " + String(millis()));
  delay(1000);
}
