const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the correct model name
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeSymptoms(symptoms, uploadedFiles = []) {
    try {
      let prompt = this.buildMedicalPrompt(symptoms, uploadedFiles);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAIResponse(text);
    } catch (error) {
      console.error('Error analyzing symptoms with Gemini:', error);
      
      // Return a fallback response instead of throwing
      return {
        diagnosis: 'Unable to provide specific diagnosis at this time',
        severity: 'moderate',
        recommendedSpecialty: 'General Medicine',
        symptomsAnalysis: 'Please consult with a healthcare professional for proper evaluation. Our AI service is temporarily unavailable.',
        recommendations: 'Schedule an appointment with a healthcare provider for proper diagnosis and treatment.',
        followUpQuestions: [
          'How long have you been experiencing these symptoms?',
          'Have you had similar symptoms before?',
          'Are you currently taking any medications?',
          'What makes your symptoms better or worse?'
        ],
        urgentAttention: false,
        prescriptionSuggestions: [],
        lifestyleAdvice: 'Maintain a healthy lifestyle and consult a healthcare professional for proper medical advice.'
      };
    }
  }

  buildMedicalPrompt(symptoms, uploadedFiles) {
    let prompt = `You are a medical AI assistant. Analyze the following patient symptoms and provide a professional medical assessment.

PATIENT SYMPTOMS:
${symptoms}

`;

    if (uploadedFiles.length > 0) {
      prompt += `UPLOADED MEDICAL FILES:
${uploadedFiles.map(file => `- ${file.originalName}: ${file.description || 'Medical document/image'}`).join('\n')}

`;
    }

    prompt += `Please provide your analysis in the following JSON format:
{
  "diagnosis": "Brief diagnosis or condition description",
  "severity": "mild|moderate|severe",
  "recommended_specialty": "Primary medical specialty needed",
  "symptoms_analysis": "Detailed analysis of symptoms",
  "recommendations": "General recommendations for the patient",
  "follow_up_questions": ["Question 1", "Question 2", "Question 3"],
  "urgent_attention": true/false,
  "prescription_suggestions": ["Suggestion 1", "Suggestion 2"],
  "lifestyle_advice": "Lifestyle recommendations"
}

IMPORTANT GUIDELINES:
- Be professional and medical in tone
- If symptoms suggest severe conditions, mark urgent_attention as true
- Recommend appropriate medical specialties based on symptoms
- Provide evidence-based recommendations
- Always suggest consulting a healthcare professional for serious conditions
- Be conservative in diagnosis - when in doubt, recommend professional consultation

Respond only with the JSON format above.`;

    return prompt;
  }

  parseAIResponse(responseText) {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const requiredFields = ['diagnosis', 'severity', 'recommended_specialty', 'symptoms_analysis'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return {
        diagnosis: parsed.diagnosis,
        severity: parsed.severity.toLowerCase(),
        recommendedSpecialty: parsed.recommended_specialty,
        symptomsAnalysis: parsed.symptoms_analysis,
        recommendations: parsed.recommendations || '',
        followUpQuestions: parsed.follow_up_questions || [],
        urgentAttention: parsed.urgent_attention || false,
        prescriptionSuggestions: parsed.prescription_suggestions || [],
        lifestyleAdvice: parsed.lifestyle_advice || ''
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback response
      return {
        diagnosis: 'Unable to provide specific diagnosis',
        severity: 'moderate',
        recommendedSpecialty: 'General Medicine',
        symptomsAnalysis: 'Please consult with a healthcare professional for proper evaluation.',
        recommendations: 'Schedule an appointment with a healthcare provider for proper diagnosis.',
        followUpQuestions: [
          'How long have you been experiencing these symptoms?',
          'Have you had similar symptoms before?',
          'Are you currently taking any medications?'
        ],
        urgentAttention: false,
        prescriptionSuggestions: [],
        lifestyleAdvice: 'Maintain a healthy lifestyle and consult a healthcare professional.'
      };
    }
  }

  async generateFollowUpQuestions(previousAnalysis, newSymptoms) {
    try {
      const prompt = `Based on the previous medical analysis and new symptoms, generate relevant follow-up questions.

PREVIOUS ANALYSIS:
${JSON.stringify(previousAnalysis, null, 2)}

NEW SYMPTOMS:
${newSymptoms}

Generate 3-5 specific follow-up questions to better understand the patient's condition. Focus on:
- Clarifying symptoms
- Understanding timeline
- Identifying triggers
- Assessing severity changes

Respond with a JSON array of questions.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return [
        'How have your symptoms changed since our last conversation?',
        'Are there any specific triggers that make your symptoms worse?',
        'Have you noticed any new symptoms?'
      ];
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [
        'How have your symptoms changed since our last conversation?',
        'Are there any specific triggers that make your symptoms worse?',
        'Have you noticed any new symptoms?'
      ];
    }
  }
}

module.exports = new GeminiService(); 