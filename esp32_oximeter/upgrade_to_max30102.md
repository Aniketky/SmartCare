# Upgrading from MAX30100 to MAX30102

## Hardware Differences:
- MAX30102 has better accuracy
- More stable readings
- Better finger detection
- Higher resolution

## Code Changes:
1. Replace MAX30100 library with MAX30105 library
2. Use the existing `esp32_oximeter.ino` code
3. Update wiring if needed (same pinout)

## Benefits:
- More accurate heart rate detection
- Better SpO2 calculations
- Raw sensor data access
- Improved signal processing
