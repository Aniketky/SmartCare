const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing server health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running:', healthResponse.data);

    console.log('\nTesting chat start...');
    const startResponse = await axios.post('http://localhost:5000/api/chat/start', {
      patientName: 'Test Patient',
      patientEmail: 'test@example.com'
    });
    console.log('✅ Chat session started:', startResponse.data);

    const sessionId = startResponse.data.sessionId;

    console.log('\nTesting symptom analysis...');
    const analyzeResponse = await axios.post('http://localhost:5000/api/chat/analyze', {
      sessionId: sessionId,
      symptoms: 'I have a headache and fever',
      uploadedFiles: []
    });
    console.log('✅ Analysis result:', JSON.stringify(analyzeResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testAPI();