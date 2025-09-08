import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const practiceTests = [
  {
    id: 1,
    subject: 'Algorithms',
    title: 'Algorithm Fundamentals',
    description: 'Practice core concepts in algorithm design and analysis.',
    questionPool: [
      { id: 1, text: 'Explain the concept of time complexity in algorithms with an example.' },
      { id: 2, text: 'Describe how a binary search algorithm works and its advantages.' },
      { id: 3, text: 'Discuss the trade-offs between iterative and recursive approaches in algorithm design.' },
      { id: 4, text: 'Explain the role of dynamic programming in solving optimization problems.' },
    ],
  },
  {
    id: 2,
    subject: 'Data Structures',
    title: 'Data Structures Basics',
    description: 'Explore fundamental data structures and their applications.',
    questionPool: [
      { id: 1, text: 'Describe the differences between arrays and linked lists.' },
      { id: 2, text: 'Explain how a binary tree is used in real-world applications.' },
      { id: 3, text: 'Discuss the advantages of using a hash table for data storage.' },
      { id: 4, text: 'Explain the concept of a stack and its use in function call management.' },
    ],
  },
  {
    id: 3,
    subject: 'English Literature',
    title: 'Essay Writing',
    description: 'Improve your essay writing skills with structured response practice.',
    questionPool: [
      { id: 1, text: 'Write a short essay (100-150 words) about the importance of reading.' },
      { id: 2, text: 'Analyze the main character in a book you recently read.' },
      { id: 3, text: 'Discuss the impact of symbolism in a novel of your choice.' },
      { id: 4, text: 'Explain how narrative structure affects a story’s impact.' },
    ],
  },
  {
    id: 4,
    subject: 'Physics',
    title: 'Mechanics Fundamentals',
    description: 'Test your understanding of basic mechanics principles.',
    questionPool: [
      { id: 1, text: 'Explain Newton’s First Law of Motion with an example.' },
      { id: 2, text: 'Describe the difference between speed and velocity.' },
      { id: 3, text: 'Discuss the concept of momentum and its conservation.' },
      { id: 4, text: 'Explain how friction affects motion in real-world scenarios.' },
    ],
  },
  {
    id: 5,
    subject: 'Chemistry',
    title: 'Chemical Reactions',
    description: 'Practice identifying and balancing chemical equations.',
    questionPool: [
      { id: 1, text: 'Explain what a catalyst does in a chemical reaction.' },
      { id: 2, text: 'Describe the difference between exothermic and endothermic reactions.' },
      { id: 3, text: 'Discuss the role of activation energy in chemical reactions.' },
      { id: 4, text: 'Explain how Le Chatelier’s Principle applies to chemical equilibrium.' },
    ],
  },
  {
    id: 6,
    subject: 'History',
    title: 'World War II',
    description: 'Test your knowledge of key events and figures from World War II.',
    questionPool: [
      { id: 1, text: 'Explain the significance of the D-Day invasion.' },
      { id: 2, text: 'Describe the impact of World War II on civilian life.' },
      { id: 3, text: 'Discuss the role of propaganda during World War II.' },
      { id: 4, text: 'Explain the consequences of the Yalta Conference.' },
    ],
  },
];

const StudentDashboard = () => {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState(null);
  const [testHistory, setTestHistory] = useState({});

  const getRandomQuestions = (questionPool, usedQuestions = [], count = 2) => {
    const availableQuestions = questionPool.filter((q) => !usedQuestions.includes(q.id));
    if (availableQuestions.length < count) {
      return questionPool.sort(() => Math.random() - 0.5).slice(0, count);
    }
    return availableQuestions.sort(() => Math.random() - 0.5).slice(0, count);
  };

  const handleTestSelect = (test) => {
    const usedQuestions = testHistory[test.id] || [];
    const selectedQuestions = getRandomQuestions(test.questionPool, usedQuestions);
    setSelectedTest({ ...test, questions: selectedQuestions });
    setAnswers({});
    setResults(null);
    setTestHistory((prev) => ({
      ...prev,
      [test.id]: [...usedQuestions, ...selectedQuestions.map((q) => q.id)],
    }));
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const simulateAIEvaluation = async (test, answers) => {
    setIsEvaluating(true);
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 5000));
    
    const evaluation = {};
    let score = 0;
    test.questions.forEach((question) => {
      const answer = answers[question.id] || '';
      let answerScore = 0;
      let feedback;

      if (answer.length === 0) {
        answerScore = 0;
        feedback = 'No answer provided. Please submit a response to receive a score.';
      } else if (answer.length < 50) {
        answerScore = Math.min(40, Math.floor(answer.length / 50 * 40)); // 0-40% for very short answers
        feedback = question.id === 1 
          ? 'Your response is too brief. Provide a detailed explanation with an example.'
          : 'This answer is incomplete. Expand with more specific details.';
      } else if (answer.length < 100) {
        answerScore = Math.min(70, Math.floor((answer.length - 50) / 50 * 30 + 40)); // 40-70% for medium-length answers
        feedback = question.id === 1 
          ? 'Moderate attempt. Include a concrete example to improve your explanation.'
          : 'Partially addressed. Add further elaboration to strengthen your response.';
      } else {
        answerScore = Math.floor(Math.random() * 30 + 70); // 70-100% for detailed answers
        feedback = question.id === 1 
          ? 'Excellent work! Enhance it with a real-world algorithm example.'
          : 'Strong answer! Consider including practical use cases for clarity.';
      }
      score += answerScore;
      evaluation[question.id] = { score: answerScore, feedback };
    });

    setIsEvaluating(false);
    setResults({
      totalScore: Math.round(score / test.questions.length),
      evaluation,
    });
  };

  const handleSubmit = () => {
    if (selectedTest) {
      simulateAIEvaluation(selectedTest, answers);
    }
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome, {currentUser?.name}
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start your learning journey with these practice tests.
          </p>
        </div>

        {/* Practice Tests Section */}
        {!selectedTest ? (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Practice Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceTests.map((test) => (
                <div
                  key={test.id}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'} hover:shadow-md transition-shadow`}
                >
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {test.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {test.subject}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {test.description}
                  </p>
                  <button
                    onClick={() => handleTestSelect(test)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              {selectedTest.title} - {selectedTest.subject}
            </h2>
            {results ? (
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Test Results
                </h3>
                <p className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'} mb-4`}>
                  Total Score: {results.totalScore}%
                </p>
                {selectedTest.questions.map((question) => (
                  <div key={question.id} className="mb-6">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {question.text}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Your Answer: {answers[question.id] || 'No answer provided'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'} mt-1`}>
                      Score: {results.evaluation[question.id].score}%
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Feedback: {results.evaluation[question.id].feedback}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedTest(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Practice Tests
                </button>
              </div>
            ) : (
              <div>
                {selectedTest.questions.map((question) => (
                  <div key={question.id} className="mb-6">
                    <label
                      className={`block font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}
                    >
                      {question.text}
                    </label>
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className={`w-full p-3 rounded-lg ${
                        isDark ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      rows="4"
                      placeholder="Type your answer here..."
                    />
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  disabled={isEvaluating}
                  className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    isEvaluating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Submit Answers
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;