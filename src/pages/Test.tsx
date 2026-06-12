import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTestById } from '../lib/exercises';
import { Navbar, Footer } from '../components/Navigation';
import { auth } from '../lib/firebase';
import { Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function Test() {
  const user = auth.currentUser;
  const { id } = useParams<{ id: string }>();
  const test = getTestById(id || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (test && !submitted) {
      setTimeRemaining(test.timeLimit * 60);
      
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, submitted]);

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">测试不存在</h1>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              返回课程列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    const newFeedback: Record<string, string> = {};
    const totalPoints = test.questions.reduce((total, q) => total + q.points, 0);

    test.questions.forEach(question => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        totalScore += question.points;
        newFeedback[question.id] = '正确！';
      } else {
        newFeedback[question.id] = `错误，正确答案是: ${question.correctAnswer}`;
      }
    });

    setScore(Math.round((totalScore / totalPoints) * 100));
    setFeedback(newFeedback);
    setSubmitted(true);
  };

  const isPassing = score >= test.passingScore;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      {/* 测试内容 */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-24">
        {/* 测试头部 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
              <p className="text-gray-600">{test.description}</p>
            </div>
            <div className="text-center md:text-right">
              <div className={`text-2xl font-bold mb-2 ${
                timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
              }`}>
                <div className="flex items-center gap-2 justify-center md:justify-end">
                  <Clock size={24} />
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                及格分数: {test.passingScore}%
              </div>
            </div>
          </div>

          {/* 进度条 */}
          {!submitted && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>已完成</span>
                <span>{Object.keys(answers).length} / {test.questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / test.questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 问题列表 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          {test.questions.map((question, index) => (
            <div key={question.id} className="mb-8 last:mb-0 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </span>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.text}</h3>
                  <div className="text-sm text-gray-500 mb-4">({question.points} 分)</div>

                  {/* 选择题 */}
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center p-3 rounded-lg border transition-all ${
                            submitted
                              ? option === question.correctAnswer
                                ? 'border-green-200 bg-green-50'
                                : answers[question.id] === option && option !== question.correctAnswer
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-100'
                              : 'border-gray-200 hover:border-primary/30 hover:bg-primary/5 cursor-pointer'
                          }`}
                        >
                          <input
                            type="radio"
                            id={`option-${question.id}-${idx}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            disabled={submitted}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <label
                            htmlFor={`option-${question.id}-${idx}`}
                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer flex-1"
                          >
                            {option}
                            {submitted && option === question.correctAnswer && (
                              <CheckCircle className="inline-block w-4 h-4 text-green-600 ml-2" />
                            )}
                            {submitted && answers[question.id] === option && option !== question.correctAnswer && (
                              <XCircle className="inline-block w-4 h-4 text-red-600 ml-2" />
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 代码题 */}
                  {question.type === 'code' && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300">
                        Python 代码
                      </div>
                      <textarea
                        value={answers[question.id] || ''}
                        onChange={submitted ? undefined : (e) => handleAnswerChange(question.id, e.target.value)}
                        disabled={submitted}
                        className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 min-h-[200px] resize-none focus:outline-none"
                        spellCheck={false}
                        placeholder="请输入代码..."
                      />
                    </div>
                  )}

                  {/* 简答题 */}
                  {question.type === 'short-answer' && (
                    <div>
                      <textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        disabled={submitted}
                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700"
                        rows={4}
                        placeholder="请输入答案..."
                      />
                    </div>
                  )}

                  {/* 反馈 */}
                  {submitted && (
                    <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
                      feedback[question.id]?.startsWith('正确')
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {feedback[question.id]?.startsWith('正确') ? (
                          <CheckCircle size={18} />
                        ) : (
                          <XCircle size={18} />
                        )}
                        {feedback[question.id]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 提交按钮和分数 */}
        <div className="flex flex-col items-center">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              提交答案
            </button>
          ) : (
            <div className="text-center bg-white rounded-xl shadow-md p-8 w-full max-w-md">
              <div className={`text-5xl font-bold mb-4 ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {score}%
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {isPassing ? '测试通过！🎉' : '测试未通过'}
              </h2>
              <p className="text-gray-600 mb-6">
                及格分数: {test.passingScore}%
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/course/${test.courseId}`}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  返回课程
                </Link>
                <Link
                  to="/courses"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  查看其他课程
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
