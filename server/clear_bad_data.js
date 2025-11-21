const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'smartcare.db');

console.log('Clearing bad oximeter data...');

const db = new sqlite3.Database(dbPath);

// Delete all readings with heart rate = 1 and spo2 = null
db.run('DELETE FROM oximeter_readings WHERE heart_rate = 1 AND spo2 IS NULL', function(err) {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log(`Deleted ${this.changes} bad readings from database`);
    }
    
    // Check remaining readings
    db.all('SELECT COUNT(*) as count FROM oximeter_readings', (err, rows) => {
        if (err) {
            console.error('Error:', err);
        } else {
            console.log(`Remaining readings in database: ${rows[0].count}`);
        }
        db.close();
    });
});
