import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { getExerciseById } from '../lib/exercises';

export default function Exercise() {
  const { id } = useParams<{ id: string }>();
  const exercise = getExerciseById(id || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">练习不存在</h1>
          <Link
            to="/courses"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    let totalScore = 0;
    const newFeedback: Record<string, string> = {};

    exercise.questions.forEach(question => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        totalScore += question.points;
        newFeedback[question.id] = '正确！';
      } else {
        newFeedback[question.id] = `错误，正确答案是: ${question.correctAnswer}`;
      }
    });

    setScore(totalScore);
    setFeedback(newFeedback);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                数据分析学习平台
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-gray-700 hover:text-indigo-600">
                首页
              </Link>
              <Link to="/courses" className="text-sm text-indigo-600 font-medium">
                课程
              </Link>
              <Link to="/profile" className="text-sm text-gray-700 hover:text-indigo-600">
                个人中心
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 练习内容 */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 练习头部 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              exercise.difficulty === 'easy'
                ? 'bg-green-100 text-green-800'
                : exercise.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{exercise.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>共 {exercise.questions.length} 题</span>
          </div>
        </div>

        {/* 问题列表 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {exercise.questions.map((question, index) => (
            <div key={question.id} className="mb-8 last:mb-0">
              <div className="flex items-start mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                  {index + 1}
                </span>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{question.text}</h3>
                  {question.hint && (
                    <p className="text-sm text-gray-500 mb-4">提示: {question.hint}</p>
                  )}

                  {/* 选择题 */}
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            type="radio"
                            id={`option-${question.id}-${idx}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            disabled={submitted}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label
                            htmlFor={`option-${question.id}-${idx}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 代码题 */}
                  {question.type === 'code' && (
                    <div className="border rounded-md overflow-hidden">
                      <CodeMirror
                        value={answers[question.id] || ''}
                        onChange={submitted ? undefined : (value) => handleAnswerChange(question.id, value)}
                        extensions={[python(), oneDark]}
                        className="min-h-[200px]"
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
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                        placeholder="请输入答案..."
                      />
                    </div>
                  )}

                  {/* 反馈 */}
                  {submitted && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${
                      feedback[question.id]?.startsWith('正确')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {feedback[question.id]}
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              提交答案
            </button>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">得分: {score}</h2>
              <p className="text-gray-600 mb-4">
                总分数: {exercise.questions.reduce((total, q) => total + q.points, 0)}
              </p>
              <a
                href={`/course/${exercise.courseId}`}
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                返回课程
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2026 数据分析学习平台. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}