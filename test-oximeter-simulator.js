const axios = require('axios');

// Simulate ESP32 oximeter sending data to SmartCare server
const simulateOximeterData = async () => {
    const serverURL = 'http://localhost:5000/api/oximeter/reading';
    
    console.log('🔬 Starting Oximeter Data Simulator...');
    console.log('📡 Sending simulated sensor data to SmartCare server');
    console.log('⏰ Updates every 2 seconds (like real ESP32)');
    console.log('🛑 Press Ctrl+C to stop\n');
    
    let readingCount = 0;
    
    const sendReading = async () => {
        try {
            readingCount++;
            
            // Generate realistic varying sensor readings
            const baseHeartRate = 75;
            const heartRateVariation = Math.sin(Date.now() / 1000) * 10; // ±10 BPM variation
            const randomVariation = (Math.random() - 0.5) * 6; // ±3 BPM random
            const heartRate = Math.round(baseHeartRate + heartRateVariation + randomVariation);
            
            const baseSpO2 = 97.5;
            const spo2Variation = Math.sin(Date.now() / 2000) * 1.5; // ±1.5% variation
            const randomSpO2 = (Math.random() - 0.5) * 1; // ±0.5% random
            const spo2 = Math.round((baseSpO2 + spo2Variation + randomSpO2) * 10) / 10;
            
            // Generate realistic IR and Red values that vary
            const baseIR = 48000;
            const irVariation = Math.sin(Date.now() / 500) * 2000;
            const randomIR = (Math.random() - 0.5) * 5000;
            const irValue = Math.round(baseIR + irVariation + randomIR);
            
            const baseRed = 45000;
            const redVariation = Math.sin(Date.now() / 800) * 1500;
            const randomRed = (Math.random() - 0.5) * 4000;
            const redValue = Math.round(baseRed + redVariation + randomRed);
            
            const fingerDetected = irValue > 40000 && redValue > 35000;
            
            const readingData = {
                timestamp: Date.now(),
                heartRate: heartRate,
                spo2: spo2,
                irValue: irValue,
                redValue: redValue,
                fingerDetected: fingerDetected,
                deviceId: 'ESP32_SIMULATOR_001'
            };
            
            console.log(`📊 Reading #${readingCount}:`);
            console.log(`   💓 Heart Rate: ${heartRate} BPM`);
            console.log(`   🫁 SpO2: ${spo2}%`);
            console.log(`   👆 Finger: ${fingerDetected ? 'Detected' : 'Not Detected'}`);
            console.log(`   📡 IR: ${irValue}, Red: ${redValue}`);
            
            const response = await axios.post(serverURL, readingData);
            
            if (response.data.success) {
                console.log(`   ✅ Success: ${response.data.message}\n`);
            } else {
                console.log(`   ❌ Error: ${response.data.error}\n`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to send reading #${readingCount}:`, error.message);
            console.log('   🔍 Make sure SmartCare server is running on http://localhost:5000\n');
        }
    };
    
    // Send initial reading
    await sendReading();
    
    // Send readings every 3 seconds (slower for testing)
    const interval = setInterval(sendReading, 3000);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping oximeter simulator...');
        clearInterval(interval);
        console.log('✅ Simulator stopped. Check your SmartCare dashboard for real-time updates!');
        process.exit(0);
    });
};

// Check if server is running before starting
const checkServer = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/health');
        console.log('✅ SmartCare server is running');
        return true;
    } catch (error) {
        console.error('❌ SmartCare server is not running!');
        console.log('   Please start the server first:');
        console.log('   cd server && npm start');
        console.log('   or');
        console.log('   npm run dev (from project root)');
        return false;
    }
};

// Start the simulator
const startSimulator = async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await simulateOximeterData();
    }
};

startSimulator();
