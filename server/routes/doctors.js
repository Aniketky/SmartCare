const express = require('express');
const router = express.Router();
const { db } = require('../database/init');

// Get all doctors
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM doctors 
      ORDER BY rating DESC, name ASC
    `);

    stmt.all([], (err, doctors) => {
      if (err) {
        console.error('Error fetching doctors:', err);
        return res.status(500).json({ error: 'Failed to fetch doctors' });
      }

      res.json({
        doctors,
        message: 'Doctors retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get doctors by specialty
router.get('/specialty/:specialty', (req, res) => {
  try {
    const { specialty } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM doctors 
      WHERE specialty LIKE ? 
      ORDER BY rating DESC, name ASC
    `);

    stmt.all([`%${specialty}%`], (err, doctors) => {
      if (err) {
        console.error('Error fetching doctors by specialty:', err);
        return res.status(500).json({ error: 'Failed to fetch doctors' });
      }

      res.json({
        doctors,
        specialty,
        message: 'Doctors retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get doctor by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM doctors WHERE id = ?
    `);

    stmt.get([id], (err, doctor) => {
      if (err) {
        console.error('Error fetching doctor:', err);
        return res.status(500).json({ error: 'Failed to fetch doctor' });
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.json({
        doctor,
        message: 'Doctor retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available doctors for appointment
router.get('/available/:specialty', (req, res) => {
  try {
    const { specialty } = req.params;
    const { date, time } = req.query;

    let query = `
      SELECT d.*, 
             COUNT(a.id) as appointment_count
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id 
        AND a.appointment_date = ? 
        AND a.appointment_time = ?
        AND a.status != 'cancelled'
      WHERE d.specialty LIKE ?
      GROUP BY d.id
      HAVING appointment_count < 3
      ORDER BY d.rating DESC, d.name ASC
    `;

    const stmt = db.prepare(query);

    stmt.all([date, time, `%${specialty}%`], (err, doctors) => {
      if (err) {
        console.error('Error fetching available doctors:', err);
        return res.status(500).json({ error: 'Failed to fetch available doctors' });
      }

      res.json({
        doctors,
        specialty,
        date,
        time,
        message: 'Available doctors retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching available doctors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all specialties
router.get('/specialties/list', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT DISTINCT specialty 
      FROM doctors 
      ORDER BY specialty ASC
    `);

    stmt.all([], (err, specialties) => {
      if (err) {
        console.error('Error fetching specialties:', err);
        return res.status(500).json({ error: 'Failed to fetch specialties' });
      }

      res.json({
        specialties: specialties.map(s => s.specialty),
        message: 'Specialties retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new doctor (admin function)
router.post('/', (req, res) => {
  try {
    const { 
      name, 
      specialty, 
      email, 
      phone, 
      experience_years, 
      availability, 
      rating = 0,
      image_url 
    } = req.body;

    if (!name || !specialty || !email) {
      return res.status(400).json({ error: 'Name, specialty, and email are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO doctors (name, specialty, email, phone, experience_years, availability, rating, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      name, 
      specialty, 
      email, 
      phone, 
      experience_years, 
      availability, 
      rating, 
      image_url
    ], function(err) {
      if (err) {
        console.error('Error adding doctor:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Doctor with this email already exists' });
        }
        return res.status(500).json({ error: 'Failed to add doctor' });
      }

      res.json({
        id: this.lastID,
        message: 'Doctor added successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update doctor (admin function)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      specialty, 
      email, 
      phone, 
      experience_years, 
      availability, 
      rating,
      image_url 
    } = req.body;

    const stmt = db.prepare(`
      UPDATE doctors 
      SET name = ?, specialty = ?, email = ?, phone = ?, 
          experience_years = ?, availability = ?, rating = ?, image_url = ?
      WHERE id = ?
    `);

    stmt.run([
      name, 
      specialty, 
      email, 
      phone, 
      experience_years, 
      availability, 
      rating, 
      image_url,
      id
    ], function(err) {
      if (err) {
        console.error('Error updating doctor:', err);
        return res.status(500).json({ error: 'Failed to update doctor' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.json({
        message: 'Doctor updated successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete doctor (admin function)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      DELETE FROM doctors WHERE id = ?
    `);

    stmt.run([id], function(err) {
      if (err) {
        console.error('Error deleting doctor:', err);
        return res.status(500).json({ error: 'Failed to delete doctor' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      res.json({
        message: 'Doctor deleted successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 