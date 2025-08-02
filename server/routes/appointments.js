const express = require('express');
const router = express.Router();
const { db } = require('../database/init');

// Create new appointment
router.post('/', (req, res) => {
  try {
    const { 
      patientName, 
      patientEmail, 
      doctorId, 
      appointmentDate, 
      appointmentTime, 
      symptoms 
    } = req.body;

    if (!patientName || !patientEmail || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ 
        error: 'Patient name, email, doctor ID, date, and time are required' 
      });
    }

    // Check if doctor exists
    const checkDoctorStmt = db.prepare(`
      SELECT id, name, specialty FROM doctors WHERE id = ?
    `);

    checkDoctorStmt.get([doctorId], (err, doctor) => {
      if (err) {
        console.error('Error checking doctor:', err);
        return res.status(500).json({ error: 'Failed to verify doctor' });
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      // Check if appointment slot is available
      const checkAvailabilityStmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'
      `);

      checkAvailabilityStmt.get([doctorId, appointmentDate, appointmentTime], (err, result) => {
        if (err) {
          console.error('Error checking availability:', err);
          return res.status(500).json({ error: 'Failed to check availability' });
        }

        if (result.count >= 3) {
          return res.status(400).json({ 
            error: 'This time slot is fully booked. Please choose another time.' 
          });
        }

        // Create appointment
        const createAppointmentStmt = db.prepare(`
          INSERT INTO appointments (patient_name, patient_email, doctor_id, appointment_date, appointment_time, symptoms)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        createAppointmentStmt.run([
          patientName, 
          patientEmail, 
          doctorId, 
          appointmentDate, 
          appointmentTime, 
          symptoms
        ], function(err) {
          if (err) {
            console.error('Error creating appointment:', err);
            return res.status(500).json({ error: 'Failed to create appointment' });
          }

          res.json({
            appointmentId: this.lastID,
            doctor: doctor,
            appointmentDate,
            appointmentTime,
            message: 'Appointment booked successfully'
          });
        });

        createAppointmentStmt.finalize();
      });

      checkAvailabilityStmt.finalize();
    });

    checkDoctorStmt.finalize();
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT a.*, d.name as doctor_name, d.specialty, d.email as doctor_email, d.phone as doctor_phone
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `);

    stmt.get([id], (err, appointment) => {
      if (err) {
        console.error('Error fetching appointment:', err);
        return res.status(500).json({ error: 'Failed to fetch appointment' });
      }

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({
        appointment,
        message: 'Appointment retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointments by patient email
router.get('/patient/:email', (req, res) => {
  try {
    const { email } = req.params;

    const stmt = db.prepare(`
      SELECT a.*, d.name as doctor_name, d.specialty, d.email as doctor_email
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_email = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);

    stmt.all([email], (err, appointments) => {
      if (err) {
        console.error('Error fetching patient appointments:', err);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
      }

      res.json({
        appointments,
        message: 'Patient appointments retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointments by doctor ID
router.get('/doctor/:doctorId', (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    let query = `
      SELECT a.*, d.name as doctor_name, d.specialty
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.doctor_id = ?
    `;
    
    let params = [doctorId];

    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }

    query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';

    const stmt = db.prepare(query);

    stmt.all(params, (err, appointments) => {
      if (err) {
        console.error('Error fetching doctor appointments:', err);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
      }

      res.json({
        appointments,
        message: 'Doctor appointments retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update appointment status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status is required (pending, confirmed, cancelled, completed)' 
      });
    }

    const stmt = db.prepare(`
      UPDATE appointments SET status = ? WHERE id = ?
    `);

    stmt.run([status, id], function(err) {
      if (err) {
        console.error('Error updating appointment status:', err);
        return res.status(500).json({ error: 'Failed to update appointment status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({
        message: 'Appointment status updated successfully',
        status
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel appointment
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      UPDATE appointments SET status = 'cancelled' WHERE id = ?
    `);

    stmt.run([id], function(err) {
      if (err) {
        console.error('Error cancelling appointment:', err);
        return res.status(500).json({ error: 'Failed to cancel appointment' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({
        message: 'Appointment cancelled successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/slots/:doctorId', (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Get doctor's availability
    const getDoctorStmt = db.prepare(`
      SELECT availability FROM doctors WHERE id = ?
    `);

    getDoctorStmt.get([doctorId], (err, doctor) => {
      if (err) {
        console.error('Error fetching doctor:', err);
        return res.status(500).json({ error: 'Failed to fetch doctor' });
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      // Get booked appointments for the date
      const getBookedStmt = db.prepare(`
        SELECT appointment_time 
        FROM appointments 
        WHERE doctor_id = ? AND appointment_date = ? AND status != 'cancelled'
      `);

      getBookedStmt.all([doctorId, date], (err, bookedSlots) => {
        if (err) {
          console.error('Error fetching booked slots:', err);
          return res.status(500).json({ error: 'Failed to fetch booked slots' });
        }

        const bookedTimes = bookedSlots.map(slot => slot.appointment_time);
        
        // Generate available time slots (9 AM to 5 PM, 1-hour intervals)
        const allSlots = [];
        for (let hour = 9; hour <= 17; hour++) {
          const time = `${hour.toString().padStart(2, '0')}:00`;
          allSlots.push({
            time,
            available: !bookedTimes.includes(time) && bookedTimes.filter(t => t === time).length < 3
          });
        }

        res.json({
          doctorId,
          date,
          availableSlots: allSlots.filter(slot => slot.available),
          bookedSlots: bookedTimes,
          message: 'Available slots retrieved successfully'
        });
      });

      getBookedStmt.finalize();
    });

    getDoctorStmt.finalize();
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 