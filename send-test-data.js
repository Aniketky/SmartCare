const axios = require('axios');

let readingCount = 0;

const sendTestReading = async () => {
    try {
        readingCount++;
        
        // Generate varying heart rate (70-85 BPM)
        const heartRate = 70 + Math.floor(Math.random() * 16);
        
        // Generate varying SpO2 (96.0-99.0%)
        const spo2 = 96.0 + (Math.random() * 3);
        
        // Generate varying IR and Red values
        const irValue = 46000 + Math.floor(Math.random() * 8000);
        const redValue = 43000 + Math.floor(Math.random() * 6000);
        
        const fingerDetected = Math.random() > 0.1; // 90% chance of finger detected
        
        const readingData = {
            timestamp: Date.now(),
            heartRate: heartRate,
            spo2: Math.round(spo2 * 10) / 10, // Round to 1 decimal
            irValue: irValue,
            redValue: redValue,
            fingerDetected: fingerDetected,
            deviceId: 'ESP32_TEST_001'
        };
        
        console.log(`📊 Sending reading #${readingCount}: HR=${heartRate}, SpO2=${readingData.spo2}, Finger=${fingerDetected}`);
        
        const response = await axios.post('http://localhost:5000/api/oximeter/reading', readingData);
        
        if (response.data.success) {
            console.log(`✅ Success: ${response.data.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

// Send reading every 2 seconds
console.log('🚀 Starting test data sender...');
console.log('📡 Sending varying sensor data every 2 seconds');
console.log('🛑 Press Ctrl+C to stop\n');

sendTestReading(); // Send immediately
const interval = setInterval(sendTestReading, 2000);

process.on('SIGINT', () => {
    console.log('\n🛑 Stopping test data sender...');
    clearInterval(interval);
    console.log('✅ Stopped. Check your SmartCare dashboard!');
    process.exit(0);
});

