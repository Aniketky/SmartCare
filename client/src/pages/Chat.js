import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageCircle, Send, Upload, FileText, User, Bot, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Chat = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSymptoms, setCurrentSymptoms] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChatSession = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/chat/start', data);
      setSessionId(response.data.sessionId);
      
      // Add welcome message
      const welcomeMessage = {
        id: 'welcome',
        type: 'ai',
        content: `Hello ${data.patientName}! I'm your AI healthcare assistant. I'm here to help you with your health concerns. Please describe your symptoms, and feel free to upload any relevant medical files.`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      reset();
    } catch (error) {
      console.error('Error starting chat session:', error);
      toast.error('Failed to start chat session');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSymptoms = async () => {
    if (!sessionId || !currentSymptoms.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: currentSymptoms,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Upload files if any
      let uploadedFileIds = [];
      if (uploadedFiles.length > 0) {
        const formData = new FormData();
        formData.append('sessionId', sessionId);
        uploadedFiles.forEach(file => {
          formData.append('files', file);
        });

        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedFileIds = uploadResponse.data.uploadedFiles.map((f) => f.id);
      }

      // Analyze symptoms
      const response = await axios.post('/api/chat/analyze', {
        sessionId,
        symptoms: currentSymptoms,
        uploadedFiles: uploadedFileIds
      });

      const analysis = response.data.analysis;
      
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your symptoms, here's my analysis:

**Diagnosis:** ${analysis.diagnosis}
**Severity:** ${analysis.severity}
**Recommended Specialty:** ${analysis.recommendedSpecialty}

**Analysis:** ${analysis.symptomsAnalysis}

**Recommendations:** ${analysis.recommendations}

**Lifestyle Advice:** ${analysis.lifestyleAdvice}

${analysis.urgentAttention ? '⚠️ **URGENT:** This requires immediate medical attention. Please consult a healthcare professional right away.' : ''}

${analysis.prescriptionSuggestions.length > 0 ? `**Suggested Medications:** ${analysis.prescriptionSuggestions.join(', ')}` : ''}

**Follow-up Questions:**
${analysis.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
        timestamp: new Date(),
        analysis
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentSymptoms('');
      setUploadedFiles([]);
      setShowFileUpload(false);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      analyzeSymptoms();
    }
  };

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Start Your AI Consultation
            </h1>
            <p className="text-gray-600">
              Please provide your information to begin your medical consultation
            </p>
          </div>

          <form onSubmit={handleSubmit(startChatSession)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('patientName', { required: 'Name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
              {errors.patientName && (
                <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('patientEmail', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
              {errors.patientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.patientEmail.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Starting Session...' : 'Start Consultation'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Healthcare Assistant</h2>
              <p className="text-sm text-gray-500">Powered by Google Gemini</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="spinner"></div>
                    <span className="text-sm text-gray-600">Analyzing your symptoms...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Section */}
        {showFileUpload && (
          <div className="border-t p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Medical Files (Optional)
              </label>
              <div className="file-upload-area rounded-lg p-4 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  Choose files
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  PDF, images, or documents (max 10MB each)
                </p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected files:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Section */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <textarea
                value={currentSymptoms}
                onChange={(e) => setCurrentSymptoms(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowFileUpload(!showFileUpload)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Upload files"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={analyzeSymptoms}
                disabled={!currentSymptoms.trim() || isLoading}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {messages.length > 1 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 