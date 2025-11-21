#ifndef MAX30105_H
#define MAX30105_H

#include <Wire.h>

#define MAX30105_ADDRESS 0x57

// Register addresses
#define REG_INTR_STATUS_1 0x00
#define REG_INTR_STATUS_2 0x01
#define REG_INTR_ENABLE_1 0x02
#define REG_INTR_ENABLE_2 0x03
#define REG_FIFO_WR_PTR 0x04
#define REG_OVF_COUNTER 0x05
#define REG_FIFO_RD_PTR 0x06
#define REG_FIFO_DATA 0x07
#define REG_FIFO_CONFIG 0x08
#define REG_MODE_CONFIG 0x09
#define REG_SPO2_CONFIG 0x0A
#define REG_LED1_PA 0x0C
#define REG_LED2_PA 0x0D
#define REG_PILOT_PA 0x10
#define REG_MULTI_LED_CTRL1 0x11
#define REG_MULTI_LED_CTRL2 0x12
#define REG_TEMP_INTR 0x13
#define REG_TEMP_FRAC 0x14
#define REG_TEMP_CONFIG 0x15
#define REG_PROX_INT_THRESH 0x16
#define REG_REV_ID 0xFE
#define REG_PART_ID 0xFF

class MAX30105 {
public:
  MAX30105();
  bool begin(TwoWire &wirePort = Wire, uint32_t i2cSpeed = 100000);
  void setup();
  void setPulseAmplitudeRed(uint8_t value);
  void setPulseAmplitudeGreen(uint8_t value);
  uint32_t getRed();
  uint32_t getIR();
  void softReset();
  
private:
  TwoWire *_i2cPort;
  uint8_t _i2caddr;
  void writeRegister(uint8_t address, uint8_t data);
  uint8_t readRegister(uint8_t address);
};

#endif

