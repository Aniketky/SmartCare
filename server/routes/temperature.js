const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database path
const dbPath = path.join(__dirname, '..', 'smartcare.db');

// Create temperature readings table if it doesn't exist
const initializeTemperatureTable = () => {
  const db = new sqlite3.Database(dbPath);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS temperature_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating temperature_readings table:', err);
    } else {
      console.log('Temperature readings table initialized');
    }
  });
  
  db.close();
};

// Initialize table on startup
initializeTemperatureTable();

// POST /api/temperature/reading - Store new temperature reading
router.post('/reading', (req, res) => {
  const { deviceId, temperature, humidity, timestamp } = req.body;
  
  // Validate required fields
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }
  
  if (temperature === undefined || temperature === null) {
    return res.status(400).json({ error: 'Temperature is required' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  const sql = `
    INSERT INTO temperature_readings 
    (device_id, temperature, humidity, timestamp)
    VALUES (?, ?, ?, ?)
  `;
  
  const values = [
    deviceId,
    temperature,
    humidity || null,
    timestamp ? new Date(timestamp) : new Date()
  ];
  
  db.run(sql, values, function(err) {
    if (err) {
      console.error('Error storing temperature reading:', err);
      res.status(500).json({ error: 'Failed to store temperature reading' });
    } else {
      res.json({ 
        success: true, 
        id: this.lastID,
        message: 'Temperature reading stored successfully' 
      });
    }
    db.close();
  });
});

// GET /api/temperature/readings - Get temperature readings
router.get('/readings', (req, res) => {
  const { deviceId, limit = 100, offset = 0, startDate, endDate } = req.query;
  
  let sql = 'SELECT * FROM temperature_readings WHERE 1=1';
  const params = [];
  
  if (deviceId) {
    sql += ' AND device_id = ?';
    params.push(deviceId);
  }
  
  if (startDate) {
    sql += ' AND timestamp >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    sql += ' AND timestamp <= ?';
    params.push(endDate);
  }
  
  sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const db = new sqlite3.Database(dbPath);
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching temperature readings:', err);
      res.status(500).json({ error: 'Failed to fetch temperature readings' });
    } else {
      res.json({ 
        success: true, 
        readings: rows,
        count: rows.length 
      });
    }
    db.close();
  });
});

// GET /api/temperature/readings/latest - Get latest temperature reading
router.get('/readings/latest', (req, res) => {
  const { deviceId } = req.query;
  
  let sql = 'SELECT * FROM temperature_readings WHERE 1=1';
  const params = [];
  
  if (deviceId) {
    sql += ' AND device_id = ?';
    params.push(deviceId);
  }
  
  sql += ' ORDER BY timestamp DESC LIMIT 1';
  
  const db = new sqlite3.Database(dbPath);
  
  db.get(sql, params, (err, row) => {
    if (err) {
      console.error('Error fetching latest temperature reading:', err);
      res.status(500).json({ error: 'Failed to fetch latest temperature reading' });
    } else if (row) {
      res.json({ 
        success: true, 
        reading: row 
      });
    } else {
      res.json({ 
        success: true, 
        reading: null,
        message: 'No readings found' 
      });
    }
    db.close();
  });
});

// GET /api/temperature/readings/stats - Get temperature statistics
router.get('/readings/stats', (req, res) => {
  const { deviceId, days = 7 } = req.query;
  
  let sql = `
    SELECT 
      AVG(temperature) as avg_temperature,
      MIN(temperature) as min_temperature,
      MAX(temperature) as max_temperature,
      AVG(humidity) as avg_humidity,
      MIN(humidity) as min_humidity,
      MAX(humidity) as max_humidity,
      COUNT(*) as total_readings
    FROM temperature_readings 
    WHERE timestamp >= datetime('now', '-${parseInt(days)} days')
  `;
  
  const params = [];
  
  if (deviceId) {
    sql += ' AND device_id = ?';
    params.push(deviceId);
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.get(sql, params, (err, row) => {
    if (err) {
      console.error('Error fetching temperature statistics:', err);
      res.status(500).json({ error: 'Failed to fetch temperature statistics' });
    } else {
      res.json({ 
        success: true, 
        stats: {
          avgTemperature: row.avg_temperature ? Math.round(row.avg_temperature * 10) / 10 : 0,
          minTemperature: row.min_temperature || 0,
          maxTemperature: row.max_temperature || 0,
          avgHumidity: row.avg_humidity ? Math.round(row.avg_humidity * 10) / 10 : 0,
          minHumidity: row.min_humidity || 0,
          maxHumidity: row.max_humidity || 0,
          totalReadings: row.total_readings || 0
        }
      });
    }
    db.close();
  });
});

// DELETE /api/temperature/readings/:id - Delete specific reading
router.delete('/readings/:id', (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run('DELETE FROM temperature_readings WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting temperature reading:', err);
      res.status(500).json({ error: 'Failed to delete temperature reading' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Reading not found' });
    } else {
      res.json({ 
        success: true, 
        message: 'Temperature reading deleted successfully' 
      });
    }
    db.close();
  });
});

module.exports = router;

