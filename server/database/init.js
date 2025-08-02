const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../smartcare.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create doctors table
      db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          experience_years INTEGER,
          availability TEXT,
          rating REAL DEFAULT 0,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create appointments table
      db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name TEXT NOT NULL,
          patient_email TEXT NOT NULL,
          doctor_id INTEGER NOT NULL,
          appointment_date TEXT NOT NULL,
          appointment_time TEXT NOT NULL,
          symptoms TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (doctor_id) REFERENCES doctors (id)
        )
      `);

      // Create chat_sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT UNIQUE NOT NULL,
          patient_name TEXT,
          patient_email TEXT,
          symptoms TEXT,
          diagnosis TEXT,
          severity TEXT,
          recommended_specialty TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create uploaded_files table
      db.run(`
        CREATE TABLE IF NOT EXISTS uploaded_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size INTEGER,
          upload_path TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id)
        )
      `);

      // Insert sample doctors data
      const sampleDoctors = [
        {
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          email: 'sarah.johnson@smartcare.com',
          phone: '+1-555-0101',
          experience_years: 15,
          availability: 'Mon-Fri 9AM-5PM',
          rating: 4.8,
          image_url: '/images/doctor1.jpg'
        },
        {
          name: 'Dr. Michael Chen',
          specialty: 'Neurology',
          email: 'michael.chen@smartcare.com',
          phone: '+1-555-0102',
          experience_years: 12,
          availability: 'Mon-Thu 10AM-6PM',
          rating: 4.7,
          image_url: '/images/doctor2.jpg'
        },
        {
          name: 'Dr. Emily Rodriguez',
          specialty: 'Dermatology',
          email: 'emily.rodriguez@smartcare.com',
          phone: '+1-555-0103',
          experience_years: 8,
          availability: 'Tue-Sat 8AM-4PM',
          rating: 4.9,
          image_url: '/images/doctor3.jpg'
        },
        {
          name: 'Dr. James Wilson',
          specialty: 'Orthopedics',
          email: 'james.wilson@smartcare.com',
          phone: '+1-555-0104',
          experience_years: 20,
          availability: 'Mon-Fri 8AM-6PM',
          rating: 4.6,
          image_url: '/images/doctor4.jpg'
        },
        {
          name: 'Dr. Lisa Thompson',
          specialty: 'Pediatrics',
          email: 'lisa.thompson@smartcare.com',
          phone: '+1-555-0105',
          experience_years: 10,
          availability: 'Mon-Fri 9AM-5PM',
          rating: 4.8,
          image_url: '/images/doctor5.jpg'
        },
        {
          name: 'Dr. Robert Kim',
          specialty: 'Psychiatry',
          email: 'robert.kim@smartcare.com',
          phone: '+1-555-0106',
          experience_years: 14,
          availability: 'Mon-Thu 11AM-7PM',
          rating: 4.7,
          image_url: '/images/doctor6.jpg'
        }
      ];

      const insertDoctor = db.prepare(`
        INSERT OR IGNORE INTO doctors 
        (name, specialty, email, phone, experience_years, availability, rating, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleDoctors.forEach(doctor => {
        insertDoctor.run([
          doctor.name,
          doctor.specialty,
          doctor.email,
          doctor.phone,
          doctor.experience_years,
          doctor.availability,
          doctor.rating,
          doctor.image_url
        ]);
      });

      insertDoctor.finalize((err) => {
        if (err) {
          console.error('Error inserting sample doctors:', err);
          reject(err);
        } else {
          console.log('✅ Database initialized successfully');
          console.log('👨‍⚕️ Sample doctors data inserted');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initializeDatabase }; 