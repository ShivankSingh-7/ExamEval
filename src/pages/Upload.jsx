import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CpuChipIcon,
  AcademicCapIcon,
  StarIcon,
  UserIcon,
  BookOpenIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const Upload = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState('question');
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  
  // Student information state
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    class: '',
    subject: ''
  });

  // Sample evaluation results
  const evaluationResults = [
    {
      totalMarks: 85,
      maxMarks: 100,
      grade: "A",
      feedback: "Excellent understanding of core concepts. Strong analytical skills demonstrated throughout.",
      strengths: ["Clear explanations", "Good use of examples", "Logical structure"],
      improvements: ["Could expand on theoretical foundations"]
    },
    {
      totalMarks: 92,
      maxMarks: 100,
      grade: "A+",
      feedback: "Outstanding performance with comprehensive answers and innovative thinking.",
      strengths: ["Exceptional depth", "Creative problem-solving", "Perfect formatting"],
      improvements: ["Minor grammatical errors"]
    },
    {
      totalMarks: 78,
      maxMarks: 100,
      grade: "B+",
      feedback: "Good grasp of fundamentals with room for deeper analysis in complex topics.",
      strengths: ["Clear methodology", "Good examples", "Neat presentation"],
      improvements: ["Need more detailed explanations", "Could improve time management"]
    },
    {
      totalMarks: 88,
      maxMarks: 100,
      grade: "A",
      feedback: "Strong performance with well-structured answers and good critical thinking.",
      strengths: ["Excellent organization", "Strong reasoning", "Good use of diagrams"],
      improvements: ["Could include more recent research"]
    },
    {
      totalMarks: 73,
      maxMarks: 100,
      grade: "B",
      feedback: "Solid understanding with consistent effort across all questions.",
      strengths: ["Consistent quality", "Good effort", "Clear handwriting"],
      improvements: ["Need deeper analysis", "Work on conclusion writing"]
    },
    {
      totalMarks: 95,
      maxMarks: 100,
      grade: "A+",
      feedback: "Exceptional work demonstrating mastery of subject matter and excellent presentation.",
      strengths: ["Perfect structure", "Innovative approach", "Comprehensive coverage"],
      improvements: ["Already at excellent level"]
    },
    {
      totalMarks: 52,
      maxMarks: 100,
      grade: "D+",
      feedback: "Basic understanding evident but requires significant improvement in key concepts and application.",
      strengths: ["Attempted all questions", "Clear handwriting", "Good effort shown"],
      improvements: ["Study fundamental concepts thoroughly", "Practice problem-solving techniques", "Focus on time management", "Seek additional help from instructor"]
    },
    {
      totalMarks: 45,
      maxMarks: 100,
      grade: "D",
      feedback: "Limited understanding of course material. Answers lack depth and accuracy in most areas.",
      strengths: ["Neat presentation", "Completed the exam"],
      improvements: ["Review all course materials", "Practice past papers extensively", "Focus on basic concepts first", "Attend tutoring sessions", "Improve study habits"]
    },
    {
      totalMarks: 38,
      maxMarks: 100,
      grade: "F",
      feedback: "Significant gaps in understanding. Failed to demonstrate minimum competency in required areas.",
      strengths: ["Showed up for exam"],
      improvements: ["Retake foundational courses", "Develop consistent study schedule", "Use additional learning resources", "Meet with academic advisor", "Consider supplemental instruction"]
    },
    {
      totalMarks: 29,
      maxMarks: 100,
      grade: "F",
      feedback: "Major deficiencies across all topics. Immediate intervention required to address learning gaps.",
      strengths: ["Attempted the examination"],
      improvements: ["Complete course remediation", "Focus on basic principles", "Utilize all available academic support", "Reassess study methods", "Consider retaking the course"]
    },
    {
      totalMarks: 48,
      maxMarks: 100,
      grade: "D",
      feedback: "Marginal performance with some understanding but critical weaknesses in application and analysis.",
      strengths: ["Shows potential", "Good attendance record", "Asks questions in class"],
      improvements: ["Strengthen problem-solving skills", "Practice analytical thinking", "Review homework assignments", "Form study groups", "Use office hours effectively"]
    },
    {
      totalMarks: 55,
      maxMarks: 100,
      grade: "D+",
      feedback: "Below average performance but shows glimpses of understanding in certain areas.",
      strengths: ["Good effort on practical questions", "Organized answers", "Shows improvement from midterm"],
      improvements: ["Focus on theoretical foundations", "Practice more complex problems", "Improve exam technique", "Review feedback from previous assignments"]
    }
  ];

  // Show student info modal when component mounts
  useEffect(() => {
    setShowStudentInfoModal(true);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStudentInfoSubmit = (e) => {
    e.preventDefault();
    if (studentInfo.name && studentInfo.class && studentInfo.subject) {
      setShowStudentInfoModal(false);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setShowResult(false);

    // Simulate upload progress (10-15 seconds)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Start AI analysis after upload
          setTimeout(() => {
            setIsAnalyzing(true);
            
            // Show result after analysis (1 minute)
            setTimeout(() => {
              const randomResult = evaluationResults[Math.floor(Math.random() * evaluationResults.length)];
              // Merge student info with evaluation result
              setCurrentResult({
                ...randomResult,
                studentName: studentInfo.name,
                studentClass: studentInfo.class,
                subject: studentInfo.subject
              });
              setIsAnalyzing(false);
              setShowResult(true);
              
              // Reset files after showing result
              setTimeout(() => {
                setFiles([]);
                setUploadProgress(0);
              }, 1000);
            }, 60000); // 1 minute of analysis
          }, 1000);
          
          return 100;
        }
        return prev + Math.random() * 8 + 2; // Variable progress speed
      });
    }, 800); // Slower progress updates for 10-15 second total
  };

  const closeResult = () => {
    setShowResult(false);
    setCurrentResult(null);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    }
    return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-500';
    if (grade === 'B+' || grade === 'B') return 'text-blue-500';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-500';
    if (grade === 'D+' || grade === 'D') return 'text-orange-500';
    return 'text-red-500'; // F grade
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upload Exam Materials
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload question papers, model answers, or student responses for ExamEval's AI evaluation.
          </p>
          
          {/* Display student info if available */}
          {studentInfo.name && (
            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border`}>
              <div className="flex items-center text-sm">
                <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Student: {studentInfo.name}
                </span>
                <BuildingLibraryIcon className="h-4 w-4 ml-4 mr-2 text-blue-500" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Class: {studentInfo.class}
                </span>
                <BookOpenIcon className="h-4 w-4 ml-4 mr-2 text-blue-500" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject: {studentInfo.subject}
                </span>
                <button
                  onClick={() => setShowStudentInfoModal(true)}
                  className={`ml-auto text-xs px-3 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100'} border`}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Type Selection */}
        <div className="mb-8">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            What are you uploading?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUploadType('question')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                uploadType === 'question'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDark 
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <DocumentTextIcon className={`h-8 w-8 mb-3 ${uploadType === 'question' ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`font-semibold ${uploadType === 'question' ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
                Question Papers & Model Answers
              </h3>
              <p className={`text-sm mt-2 ${uploadType === 'question' ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload question papers with their corresponding model answers and evaluation rubrics
              </p>
            </button>
            
            <button
              onClick={() => setUploadType('answer')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                uploadType === 'answer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDark 
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <PhotoIcon className={`h-8 w-8 mb-3 ${uploadType === 'answer' ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`font-semibold ${uploadType === 'answer' ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
                Student Answer Sheets
              </h3>
              <p className={`text-sm mt-2 ${uploadType === 'answer' ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload student answer sheets (handwritten or typed) for AI evaluation
              </p>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              dragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : isDark
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Drop files here or click to upload
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Supports PDF, DOC, DOCX, JPG, PNG, and JPEG files up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    {getFileIcon(file)}
                    <div className="ml-3">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {file.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-colors`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Uploading files...
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploadProgress}%
              </span>
            </div>
            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {isAnalyzing && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="flex items-center justify-center">
              <CpuChipIcon className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
              <div className="text-center">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  AI is analyzing the exam papers...
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Processing handwriting, evaluating answers, and calculating scores
                </p>
                <div className="flex justify-center mt-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Complete */}
        {uploadProgress === 100 && !uploading && !isAnalyzing && !showResult && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Upload Complete!
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your files have been uploaded successfully and are being processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading || isAnalyzing || !studentInfo.name}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              files.length === 0 || uploading || isAnalyzing || !studentInfo.name
                ? isDark 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {/* Instructions */}
        <div className={`mt-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                For Question Papers:
              </h4>
              <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Include clear question numbers and marks allocation</li>
                <li>• Provide detailed model answers</li>
                <li>• Add evaluation rubrics when available</li>
                <li>• Ensure text is readable and well-formatted</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                For Answer Sheets:
              </h4>
              <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Ensure handwriting is clearly visible</li>
                <li>• Include student name and roll number</li>
                <li>• Upload in high resolution (300 DPI minimum)</li>
                <li>• Group by question or subject for better analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Student Information Modal */}
      {showStudentInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full`}>
            <form onSubmit={handleStudentInfoSubmit} className="p-6">
              <div className="flex items-center mb-6">
                <UserIcon className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Student Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={studentInfo.name}
                    onChange={(e) => handleStudentInfoChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter student's full name"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Class/Grade *
                  </label>
                  <input
                    type="text"
                    value={studentInfo.class}
                    onChange={(e) => handleStudentInfoChange('class', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="e.g., 10th Grade, Class XII, Year 2"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={studentInfo.subject}
                    onChange={(e) => handleStudentInfoChange('subject', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="e.g., Mathematics, English, Physics"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluation Result Modal */}
      {showResult && currentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    AI Evaluation Complete
                  </h2>
                </div>
                <button
                  onClick={closeResult}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Student Information Header */}
              <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Student</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentResult.studentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BuildingLibraryIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Class</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentResult.studentClass}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Subject</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {currentResult.subject}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className={`h-6 w-6 mr-2 ${getGradeColor(currentResult.grade)}`} />
                    <span className={`text-2xl font-bold ${getGradeColor(currentResult.grade)}`}>
                      {currentResult.grade}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {currentResult.totalMarks}
                      <span className={`text-lg font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        /{currentResult.maxMarks}
                      </span>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Score ({Math.round((currentResult.totalMarks / currentResult.maxMarks) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  AI Feedback
                </h4>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {currentResult.feedback}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {currentResult.strengths.map((strength, index) => (
                      <li key={index} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-start`}>
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {currentResult.improvements.map((improvement, index) => (
                      <li key={index} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-start`}>
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeResult}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;