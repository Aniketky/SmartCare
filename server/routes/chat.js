const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/init');
const geminiService = require('../services/geminiService');

// Start a new chat session
router.post('/start', async (req, res) => {
  try {
    const { patientName, patientEmail } = req.body;
    const sessionId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO chat_sessions (session_id, patient_name, patient_email)
      VALUES (?, ?, ?)
    `);

    stmt.run([sessionId, patientName, patientEmail], function(err) {
      if (err) {
        console.error('Error creating chat session:', err);
        return res.status(500).json({ error: 'Failed to start chat session' });
      }

      res.json({
        sessionId,
        message: 'Chat session started successfully',
        patientName,
        patientEmail
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error in chat start:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analyze symptoms and get AI response
router.post('/analyze', async (req, res) => {
  try {
    const { sessionId, symptoms, uploadedFiles = [] } = req.body;

    if (!sessionId || !symptoms) {
      return res.status(400).json({ error: 'Session ID and symptoms are required' });
    }

    // Get uploaded files for this session
    const getFilesStmt = db.prepare(`
      SELECT original_name, file_type, upload_path 
      FROM uploaded_files 
      WHERE session_id = ?
    `);

    getFilesStmt.all([sessionId], async (err, files) => {
      if (err) {
        console.error('Error fetching uploaded files:', err);
        return res.status(500).json({ error: 'Failed to fetch uploaded files' });
      }

      try {
        // Analyze symptoms with Gemini AI
        const analysis = await geminiService.analyzeSymptoms(symptoms, files);

        // Update chat session with analysis
        const updateStmt = db.prepare(`
          UPDATE chat_sessions 
          SET symptoms = ?, diagnosis = ?, severity = ?, recommended_specialty = ?
          WHERE session_id = ?
        `);

        updateStmt.run([
          symptoms,
          analysis.diagnosis,
          analysis.severity,
          analysis.recommendedSpecialty,
          sessionId
        ], function(err) {
          if (err) {
            console.error('Error updating chat session:', err);
          }
        });

        updateStmt.finalize();

        res.json({
          sessionId,
          analysis,
          message: 'Symptoms analyzed successfully'
        });
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        res.status(500).json({ 
          error: 'Failed to analyze symptoms',
          message: aiError.message 
        });
      }
    });

    getFilesStmt.finalize();
  } catch (error) {
    console.error('Error in symptom analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get follow-up questions
router.post('/follow-up', async (req, res) => {
  try {
    const { sessionId, newSymptoms } = req.body;

    if (!sessionId || !newSymptoms) {
      return res.status(400).json({ error: 'Session ID and new symptoms are required' });
    }

    // Get previous analysis
    const getAnalysisStmt = db.prepare(`
      SELECT symptoms, diagnosis, severity, recommended_specialty
      FROM chat_sessions 
      WHERE session_id = ?
    `);

    getAnalysisStmt.get([sessionId], async (err, session) => {
      if (err) {
        console.error('Error fetching session:', err);
        return res.status(500).json({ error: 'Failed to fetch session data' });
      }

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      try {
        const previousAnalysis = {
          symptoms: session.symptoms,
          diagnosis: session.diagnosis,
          severity: session.severity,
          recommendedSpecialty: session.recommended_specialty
        };

        const followUpQuestions = await geminiService.generateFollowUpQuestions(
          previousAnalysis, 
          newSymptoms
        );

        res.json({
          sessionId,
          followUpQuestions,
          message: 'Follow-up questions generated successfully'
        });
      } catch (aiError) {
        console.error('AI follow-up error:', aiError);
        res.status(500).json({ 
          error: 'Failed to generate follow-up questions',
          message: aiError.message 
        });
      }
    });

    getAnalysisStmt.finalize();
  } catch (error) {
    console.error('Error in follow-up questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat session history
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM chat_sessions WHERE session_id = ?
    `);

    stmt.get([sessionId], (err, session) => {
      if (err) {
        console.error('Error fetching session:', err);
        return res.status(500).json({ error: 'Failed to fetch session' });
      }

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({
        session,
        message: 'Session retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sessions for a patient
router.get('/patient/:email', (req, res) => {
  try {
    const { email } = req.params;

    const stmt = db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE patient_email = ? 
      ORDER BY created_at DESC
    `);

    stmt.all([email], (err, sessions) => {
      if (err) {
        console.error('Error fetching patient sessions:', err);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }

      res.json({
        sessions,
        message: 'Patient sessions retrieved successfully'
      });
    });

    stmt.finalize();
  } catch (error) {
    console.error('Error fetching patient sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 