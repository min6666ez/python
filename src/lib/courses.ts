export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
  coverImage: string;
  category: 'python' | 'data-analysis' | 'visualization' | 'business-analysis';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'code';
  duration?: string;
  codeExample?: string;
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Python基础入门',
    description: '掌握Python编程的基本概念和语法，为数据分析打下坚实基础',
    level: 'beginner',
    duration: '10小时',
    category: 'python',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20basics%20for%20data%20analysis&image_size=landscape_16_9',
    modules: [
      {
        id: '1-1',
        title: 'Python环境搭建',
        lessons: [
          {
            id: '1-1-1',
            title: 'Python安装与配置',
            content: '学习如何在不同操作系统上安装和配置Python环境',
            type: 'text',
            duration: '30分钟'
          },
          {
            id: '1-1-2',
            title: '第一个Python程序',
            content: '编写并运行你的第一个Python程序',
            type: 'code',
            codeExample: 'print("Hello, Data Analysis!")'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Python基础语法',
        lessons: [
          {
            id: '1-2-1',
            title: '变量与数据类型',
            content: '学习Python的基本数据类型和变量声明',
            type: 'text'
          },
          {
            id: '1-2-2',
            title: '条件语句与循环',
            content: '掌握if语句、for循环和while循环的使用',
            type: 'code',
            codeExample: 'for i in range(5):\n    print(i)'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '数据分析库应用',
    description: '学习NumPy、Pandas等核心数据分析库的使用',
    level: 'intermediate',
    duration: '15小时',
    category: 'data-analysis',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20libraries%20NumPy%20and%20Pandas&image_size=landscape_16_9',
    modules: [
      {
        id: '2-1',
        title: 'NumPy基础',
        lessons: [
          {
            id: '2-1-1',
            title: 'NumPy数组操作',
            content: '学习NumPy数组的创建、索引和基本操作',
            type: 'code',
            codeExample: 'import numpy as np\narr = np.array([1, 2, 3, 4, 5])'
          }
        ]
      },
      {
        id: '2-2',
        title: 'Pandas数据处理',
        lessons: [
          {
            id: '2-2-1',
            title: 'DataFrame操作',
            content: '掌握Pandas DataFrame的创建和基本操作',
            type: 'code',
            codeExample: 'import pandas as pd\ndf = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: '数据可视化',
    description: '使用Matplotlib和Seaborn创建精美的数据可视化图表',
    level: 'intermediate',
    duration: '12小时',
    category: 'visualization',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20with%20Matplotlib%20and%20Seaborn&image_size=landscape_16_9',
    modules: [
      {
        id: '3-1',
        title: 'Matplotlib基础',
        lessons: [
          {
            id: '3-1-1',
            title: '折线图与散点图',
            content: '学习如何创建基本的折线图和散点图',
            type: 'code',
            codeExample: 'import matplotlib.pyplot as plt\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 6, 8, 10]\nplt.plot(x, y)\nplt.show()'
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: '商务数据分析实战',
    description: '应用数据分析技能解决实际商务问题',
    level: 'advanced',
    duration: '20小时',
    category: 'business-analysis',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20dashboard&image_size=landscape_16_9',
    modules: [
      {
        id: '4-1',
        title: '销售数据分析',
        lessons: [
          {
            id: '4-1-1',
            title: '销售趋势分析',
            content: '分析销售数据的趋势和模式',
            type: 'code'
          }
        ]
      }
    ]
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return courses.filter(course => course.category === category);
};