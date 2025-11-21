const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database path
const dbPath = path.join(__dirname, '..', 'smartcare.db');

// Create oximeter readings table if it doesn't exist
const initializeOximeterTable = () => {
  const db = new sqlite3.Database(dbPath);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS oximeter_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      heart_rate INTEGER,
      spo2 REAL,
      ir_value INTEGER,
      red_value INTEGER,
      finger_detected BOOLEAN,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating oximeter_readings table:', err);
    } else {
      console.log('Oximeter readings table initialized');
    }
  });
  
  db.close();
};

// Initialize table on startup
initializeOximeterTable();

// POST /api/oximeter/reading - Store new oximeter reading
router.post('/reading', (req, res) => {
  const { deviceId, heartRate, spo2, irValue, redValue, fingerDetected, timestamp } = req.body;
  
  // Validate required fields
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  const sql = `
    INSERT INTO oximeter_readings 
    (device_id, heart_rate, spo2, ir_value, red_value, finger_detected, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    deviceId,
    heartRate || null,
    spo2 || null,
    irValue || null,
    redValue || null,
    fingerDetected || false,
    timestamp ? new Date(timestamp) : new Date()
  ];
  
  db.run(sql, values, function(err) {
    if (err) {
      console.error('Error storing oximeter reading:', err);
      res.status(500).json({ error: 'Failed to store oximeter reading' });
    } else {
      res.json({ 
        success: true, 
        id: this.lastID,
        message: 'Oximeter reading stored successfully' 
      });
    }
    db.close();
  });
});

// GET /api/oximeter/readings - Get oximeter readings
router.get('/readings', (req, res) => {
  const { deviceId, limit = 100, offset = 0, startDate, endDate } = req.query;
  
  let sql = 'SELECT * FROM oximeter_readings WHERE 1=1';
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
      console.error('Error fetching oximeter readings:', err);
      res.status(500).json({ error: 'Failed to fetch oximeter readings' });
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

// GET /api/oximeter/readings/latest - Get latest oximeter reading
router.get('/readings/latest', (req, res) => {
  const { deviceId } = req.query;
  
  let sql = 'SELECT * FROM oximeter_readings WHERE 1=1';
  const params = [];
  
  if (deviceId) {
    sql += ' AND device_id = ?';
    params.push(deviceId);
  }
  
  sql += ' ORDER BY timestamp DESC LIMIT 1';
  
  const db = new sqlite3.Database(dbPath);
  
  db.get(sql, params, (err, row) => {
    if (err) {
      console.error('Error fetching latest oximeter reading:', err);
      res.status(500).json({ error: 'Failed to fetch latest oximeter reading' });
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

// GET /api/oximeter/readings/stats - Get oximeter statistics
router.get('/readings/stats', (req, res) => {
  const { deviceId, days = 7 } = req.query;
  
  let sql = `
    SELECT 
      AVG(heart_rate) as avg_heart_rate,
      MIN(heart_rate) as min_heart_rate,
      MAX(heart_rate) as max_heart_rate,
      AVG(spo2) as avg_spo2,
      MIN(spo2) as min_spo2,
      MAX(spo2) as max_spo2,
      COUNT(*) as total_readings,
      COUNT(CASE WHEN finger_detected = 1 THEN 1 END) as valid_readings
    FROM oximeter_readings 
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
      console.error('Error fetching oximeter statistics:', err);
      res.status(500).json({ error: 'Failed to fetch oximeter statistics' });
    } else {
      res.json({ 
        success: true, 
        stats: {
          avgHeartRate: row.avg_heart_rate ? Math.round(row.avg_heart_rate) : 0,
          minHeartRate: row.min_heart_rate || 0,
          maxHeartRate: row.max_heart_rate || 0,
          avgSpO2: row.avg_spo2 ? Math.round(row.avg_spo2 * 10) / 10 : 0,
          minSpO2: row.min_spo2 || 0,
          maxSpO2: row.max_spo2 || 0,
          totalReadings: row.total_readings || 0,
          validReadings: row.valid_readings || 0
        }
      });
    }
    db.close();
  });
});

// DELETE /api/oximeter/readings/:id - Delete specific reading
router.delete('/readings/:id', (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run('DELETE FROM oximeter_readings WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting oximeter reading:', err);
      res.status(500).json({ error: 'Failed to delete oximeter reading' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Reading not found' });
    } else {
      res.json({ 
        success: true, 
        message: 'Oximeter reading deleted successfully' 
      });
    }
    db.close();
  });
});

module.exports = router;

