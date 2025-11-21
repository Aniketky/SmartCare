# ESP32 Sensor Connections Guide

## Complete Wiring Diagram

### 1. MAX30102 Pulse Oximeter Sensor

```
MAX30102 Sensor    →    ESP32
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VCC (Power)        →    3.3V
GND (Ground)       →    GND
SDA (Data)         →    GPIO 21
SCL (Clock)        →    GPIO 22
```

**Important Notes:**
- MAX30102 uses I2C communication (SDA/SCL)
- Requires 3.3V power (do not use 5V)
- Make sure all 4 wires are connected

---

### 2. DHT22/DHT11 Temperature & Humidity Sensor

```
DHT22/DHT11 Sensor  →    ESP32
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VCC (Power)         →    3.3V or 5V
                    →    (DHT22 works with both, DHT11 prefers 5V)
GND (Ground)        →    GND
DATA (Signal)       →    GPIO 4
                    →    (Change DHTPIN in code if using different pin)

Optional: Add 10KΩ pull-up resistor between DATA and VCC
         (Most DHT modules have this built-in)
```

**Important Notes:**
- If your DHT module has 3 pins: VCC, GND, DATA (no resistor needed, built-in)
- If your DHT sensor has 4 pins: VCC, GND, DATA, NC (not connected)
- If using a bare DHT sensor, add a 10KΩ resistor between DATA and VCC
- Default pin is GPIO 4, but you can change it in the code (DHTPIN)

---

## Complete Connection Summary

### ESP32 Pin Connections:

| ESP32 Pin | Connected To | Purpose |
|-----------|--------------|---------|
| 3.3V      | MAX30102 VCC, DHT VCC | Power supply |
| GND       | MAX30102 GND, DHT GND | Ground |
| GPIO 21   | MAX30102 SDA | I2C Data (Oximeter) |
| GPIO 22   | MAX30102 SCL | I2C Clock (Oximeter) |
| GPIO 4    | DHT DATA     | Temperature/Humidity data |

---

## Visual Connection Layout

```
┌─────────────────────────────────────────┐
│           ESP32 Board                    │
│                                          │
│  3.3V ────┬───────────────┐            │
│           │               │            │
│  GND  ────┼───────┬───────┼───────┐   │
│           │       │       │       │   │
│  GPIO21 ──┘       │       │       │   │
│                   │       │       │   │
│  GPIO22 ──────────┘       │       │   │
│                            │       │   │
│  GPIO4 ───────────────────┘       │   │
│                                    │   │
└────────────────────────────────────┼───┘
                                     │
        ┌────────────────────────────┼────────────────────┐
        │                            │                    │
┌───────▼────────┐          ┌────────▼────────┐          │
│  MAX30102      │          │  DHT22/DHT11    │          │
│  Oximeter      │          │  Temperature    │          │
│                │          │  Sensor         │          │
│  VCC ←─────────┘          │  VCC ←──────────┘          │
│  GND ←────────────────────┼── GND ←───────────────────┘
│  SDA ←──────────┐         │  DATA ←─────────┐
│  SCL ←──────────┘         └─────────────────┘
└─────────────────┘
```

---

## Step-by-Step Connection Instructions

### Step 1: Connect MAX30102 Oximeter
1. Take 4 jumper wires
2. Connect MAX30102 VCC → ESP32 3.3V
3. Connect MAX30102 GND → ESP32 GND
4. Connect MAX30102 SDA → ESP32 GPIO 21
5. Connect MAX30102 SCL → ESP32 GPIO 22

### Step 2: Connect DHT Sensor
1. Take 3 jumper wires (or 4 if your sensor has 4 pins)
2. Connect DHT VCC → ESP32 3.3V (or 5V for DHT11)
3. Connect DHT GND → ESP32 GND
4. Connect DHT DATA → ESP32 GPIO 4
5. (If using bare DHT, add 10KΩ resistor between DATA and VCC)

### Step 3: Power Up
1. Connect ESP32 to computer via USB
2. Check Serial Monitor at 115200 baud to verify connections
3. You should see initialization messages

---

## Troubleshooting Connections

### MAX30102 Not Detected
- ✅ Check all 4 wires are connected
- ✅ Verify SDA is on GPIO 21 and SCL is on GPIO 22
- ✅ Check power connection (3.3V, not 5V)
- ✅ Try different I2C pins if needed (change in Wire.begin() if using different pins)

### DHT Sensor Not Reading
- ✅ Check DATA pin is on GPIO 4 (or change DHTPIN in code)
- ✅ Verify power connection (3.3V or 5V)
- ✅ Check ground connection
- ✅ Add 10KΩ pull-up resistor if using bare sensor
- ✅ Wait 2 seconds after power-on for sensor to stabilize
- ✅ Check Serial Monitor for error messages

### Common Issues
- **Wrong voltage**: MAX30102 must use 3.3V, not 5V
- **Loose connections**: Make sure all wires are securely connected
- **Wrong pins**: Double-check GPIO pin numbers
- **Missing pull-up resistor**: DHT sensors often need 10KΩ resistor (usually built into modules)

---

## Alternative Pin Configurations

If you need to use different pins, modify these lines in the code:

```cpp
// For DHT sensor - change pin number
#define DHTPIN 4  // Change to your desired GPIO pin

// For MAX30102 - if using different I2C pins, modify Wire.begin()
// In setup(), change:
Wire.begin(21, 22);  // SDA, SCL (if using default pins)
// To:
Wire.begin(YOUR_SDA_PIN, YOUR_SCL_PIN);  // Your custom pins
```

**Note**: ESP32 I2C pins can be changed, but GPIO 21/22 are the default.

---

## Required Components

- ✅ ESP32 Development Board
- ✅ MAX30102 Pulse Oximeter Sensor Module
- ✅ DHT22 or DHT11 Temperature/Humidity Sensor Module
- ✅ Jumper Wires (at least 7 wires)
- ✅ Breadboard (optional, but recommended)
- ✅ USB Cable for ESP32
- ✅ 10KΩ Resistor (only if using bare DHT sensor, not needed for modules)

---

## Safety Notes

⚠️ **Important:**
- Always double-check connections before powering on
- MAX30102 uses 3.3V - using 5V will damage it
- Make sure ground connections are secure
- Do not hot-plug sensors (power off before connecting/disconnecting)
- Use proper jumper wires with secure connections

---

## Testing Connections

After connecting everything:

1. Open Arduino IDE Serial Monitor (115200 baud)
2. Upload the code to ESP32
3. You should see:
   - "WiFi connected!"
   - "Oximeter initialized. Place your finger on the sensor."
   - "DHT sensor initialized."
   - Temperature and humidity readings every 5 seconds
   - Heart rate and SpO2 when finger is detected

If you see error messages, check the connection guide above.

