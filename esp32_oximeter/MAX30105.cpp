#include "MAX30105.h"

MAX30105::MAX30105() {
  _i2caddr = MAX30105_ADDRESS;
}

bool MAX30105::begin(TwoWire &wirePort, uint32_t i2cSpeed) {
  _i2cPort = &wirePort;
  _i2cPort->begin();
  _i2cPort->setClock(i2cSpeed);
  
  // Check if device responds
  uint8_t partId = readRegister(REG_PART_ID);
  if (partId != 0x15) {
    return false;
  }
  
  return true;
}

void MAX30105::setup() {
  softReset();
  delay(100);
  
  // Set up the sensor
  writeRegister(REG_INTR_ENABLE_1, 0xC0); // INTR setting
  writeRegister(REG_INTR_ENABLE_2, 0x00);
  writeRegister(REG_FIFO_WR_PTR, 0x00); // FIFO_WR_PTR[4:0]
  writeRegister(REG_OVF_COUNTER, 0x00); // OVF_COUNTER[4:0]
  writeRegister(REG_FIFO_RD_PTR, 0x00); // FIFO_RD_PTR[4:0]
  writeRegister(REG_FIFO_CONFIG, 0x0F); // sample avg = 1, fifo rollover=false, fifo almost full = 17
  writeRegister(REG_MODE_CONFIG, 0x03); // 0x02 for Red only, 0x03 for SpO2 mode 0x07 multimode LED
  writeRegister(REG_SPO2_CONFIG, 0x27); // SPO2_ADC range = 4096nA, SPO2 sample rate (100 Hz), LED pulseWidth (411uS)
  writeRegister(REG_LED1_PA, 0x24); // Choose value for ~ 7mA for LED1
  writeRegister(REG_LED2_PA, 0x24); // Choose value for ~ 7mA for LED2
  writeRegister(REG_PILOT_PA, 0x7F); // Choose value for ~ 25mA for Pilot LED
}

void MAX30105::setPulseAmplitudeRed(uint8_t value) {
  writeRegister(REG_LED1_PA, value);
}

void MAX30105::setPulseAmplitudeGreen(uint8_t value) {
  writeRegister(REG_LED2_PA, value);
}

uint32_t MAX30105::getRed() {
  uint32_t temp = readRegister(REG_FIFO_DATA);
  temp |= readRegister(REG_FIFO_DATA) << 8;
  temp |= readRegister(REG_FIFO_DATA) << 16;
  temp &= 0x03FFFF;
  return temp;
}

uint32_t MAX30105::getIR() {
  uint32_t temp = readRegister(REG_FIFO_DATA);
  temp |= readRegister(REG_FIFO_DATA) << 8;
  temp |= readRegister(REG_FIFO_DATA) << 16;
  temp &= 0x03FFFF;
  return temp;
}

void MAX30105::softReset() {
  writeRegister(REG_MODE_CONFIG, 0x40);
}

void MAX30105::writeRegister(uint8_t address, uint8_t data) {
  _i2cPort->beginTransmission(_i2caddr);
  _i2cPort->write(address);
  _i2cPort->write(data);
  _i2cPort->endTransmission();
}

uint8_t MAX30105::readRegister(uint8_t address) {
  _i2cPort->beginTransmission(_i2caddr);
  _i2cPort->write(address);
  _i2cPort->endTransmission();
  _i2cPort->requestFrom(_i2caddr, 1);
  return _i2cPort->read();
}

