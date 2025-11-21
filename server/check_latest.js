const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'smartcare.db');

console.log('Checking ALL recent readings...');

const db = new sqlite3.Database(dbPath);

// Get the latest 20 readings to see if new data is coming in
db.all('SELECT * FROM oximeter_readings ORDER BY timestamp DESC LIMIT 20', (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Latest 20 readings:');
        rows.forEach((row, index) => {
            console.log(`${index + 1}. ID: ${row.id}, HR: ${row.heart_rate}, SpO2: ${row.spo2}, Finger: ${row.finger_detected}, Device: ${row.device_id}, Time: ${row.timestamp}`);
        });
        
        // Check if we have any readings with device ID from fake data
        const fakeReadings = rows.filter(row => row.device_id === 'ESP32_FAKE_TEST_001');
        console.log(`\nFound ${fakeReadings.length} readings from fake data (ESP32_FAKE_TEST_001)`);
        
        if (fakeReadings.length > 0) {
            console.log('Latest fake reading:');
            console.log(`HR: ${fakeReadings[0].heart_rate}, SpO2: ${fakeReadings[0].spo2}`);
        }
    }
    
    db.close();
});
