export interface Exercise {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'code' | 'short-answer';
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'code' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  hint?: string;
}

export interface Test {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // 分钟
  passingScore: number; // 百分比
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedExercises: string[];
  completedTests: {
    testId: string;
    score: number;
    date: string;
  }[];
  totalProgress: number; // 0-100
}

export const exercises: Exercise[] = [
  {
    id: 'ex1',
    courseId: '1',
    lessonId: '1-1-2',
    title: 'Python基础练习',
    description: '测试你对Python基础语法的理解',
    type: 'multiple-choice',
    difficulty: 'easy',
    questions: [
      {
        id: 'q1',
        text: 'Python中，以下哪个是正确的变量名？',
        type: 'multiple-choice',
        options: ['123abc', 'abc123', 'abc-123', 'abc 123'],
        correctAnswer: 'abc123',
        points: 10
      },
      {
        id: 'q2',
        text: 'Python中，print("Hello")的作用是什么？',
        type: 'multiple-choice',
        options: ['定义一个变量', '打印Hello到控制台', '创建一个函数', '导入一个模块'],
        correctAnswer: '打印Hello到控制台',
        points: 10
      }
    ]
  },
  {
    id: 'ex2',
    courseId: '2',
    lessonId: '2-2-1',
    title: 'Pandas数据处理练习',
    description: '测试你对Pandas DataFrame的操作能力',
    type: 'code',
    difficulty: 'medium',
    questions: [
      {
        id: 'q1',
        text: '创建一个包含姓名和年龄的DataFrame，然后筛选出年龄大于25的行',
        type: 'code',
        correctAnswer: 'import pandas as pd\ndf = pd.DataFrame({"name": ["Alice", "Bob", "Charlie"], "age": [25, 30, 35]})\ndf[df["age"] > 25]',
        points: 20,
        hint: '使用布尔索引来筛选数据'
      }
    ]
  }
];

export const tests: Test[] = [
  {
    id: 'test1',
    courseId: '1',
    title: 'Python基础测试',
    description: '测试你对Python基础知识的掌握程度',
    questions: [
      {
        id: 'q1',
        text: 'Python的官方网站是？',
        type: 'multiple-choice',
        options: ['www.python.com', 'www.python.org', 'www.python.net', 'www.python.dev'],
        correctAnswer: 'www.python.org',
        points: 10
      },
      {
        id: 'q2',
        text: '以下哪个不是Python的数据类型？',
        type: 'multiple-choice',
        options: ['int', 'float', 'string', 'array'],
        correctAnswer: 'array',
        points: 10
      },
      {
        id: 'q3',
        text: '编写一个函数，计算两个数的和',
        type: 'code',
        correctAnswer: 'def add(a, b):\n    return a + b',
        points: 20
      }
    ],
    timeLimit: 30,
    passingScore: 60
  }
];

export const getUserProgress = (userId: string, courseId: string): UserProgress => {
  // 模拟用户进度数据
  return {
    userId,
    courseId,
    completedLessons: ['1-1-1', '1-1-2'],
    completedExercises: ['ex1'],
    completedTests: [
      {
        testId: 'test1',
        score: 85,
        date: new Date().toISOString()
      }
    ],
    totalProgress: 45
  };
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};

export const getTestById = (id: string): Test | undefined => {
  return tests.find(test => test.id === id);
};

export const getExercisesByLesson = (lessonId: string): Exercise[] => {
  return exercises.filter(exercise => exercise.lessonId === lessonId);
};

export const getTestsByCourse = (courseId: string): Test[] => {
  return tests.filter(test => test.courseId === courseId);
};