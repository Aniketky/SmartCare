const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'smartcare.db');

console.log('Checking oximeter readings in database...');

const db = new sqlite3.Database(dbPath);

// Get the latest 5 readings
db.all('SELECT * FROM oximeter_readings ORDER BY timestamp DESC LIMIT 5', (err, rows) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Latest 5 readings:');
        rows.forEach((row, index) => {
            console.log(`${index + 1}. ID: ${row.id}, Heart Rate: ${row.heart_rate}, SpO2: ${row.spo2}, Finger: ${row.finger_detected}, Time: ${row.timestamp}`);
        });
    }
    
    db.close();
});
