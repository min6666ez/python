export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
  coverImage: string;
  rating: number;
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
    duration: '15小时',
    rating: 4.8,
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
            title: 'Anaconda环境管理',
            content: '使用Anaconda管理Python环境和包',
            type: 'text',
            duration: '25分钟'
          },
          {
            id: '1-1-3',
            title: '第一个Python程序',
            content: '编写并运行你的第一个Python程序',
            type: 'code',
            duration: '20分钟',
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
            content: '学习Python的基本数据类型：整数、浮点数、字符串、布尔值',
            type: 'text',
            duration: '40分钟'
          },
          {
            id: '1-2-2',
            title: '运算符与表达式',
            content: '掌握算术运算符、比较运算符和逻辑运算符的使用',
            type: 'code',
            duration: '35分钟',
            codeExample: 'a = 10\nb = 3\nprint(a + b)\nprint(a / b)\nprint(a ** b)'
          },
          {
            id: '1-2-3',
            title: '条件语句',
            content: '掌握if语句、elif语句和else子句的使用',
            type: 'code',
            duration: '40分钟',
            codeExample: 'score = 85\nif score >= 90:\n    print("优秀")\nelif score >= 60:\n    print("及格")\nelse:\n    print("不及格")'
          },
          {
            id: '1-2-4',
            title: '循环结构',
            content: '掌握for循环和while循环的使用',
            type: 'code',
            duration: '45分钟',
            codeExample: 'for i in range(5):\n    print(i)\n\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1'
          }
        ]
      },
      {
        id: '1-3',
        title: '数据结构',
        lessons: [
          {
            id: '1-3-1',
            title: '列表与元组',
            content: '学习列表和元组的创建、操作和应用场景',
            type: 'code',
            duration: '50分钟',
            codeExample: 'fruits = ["苹果", "香蕉", "橙子"]\nfruits.append("葡萄")\nprint(fruits[0])\nprint(len(fruits))'
          },
          {
            id: '1-3-2',
            title: '字典操作',
            content: '掌握字典的创建、访问、修改和遍历',
            type: 'code',
            duration: '45分钟',
            codeExample: 'person = {"name": "张三", "age": 25}\nperson["city"] = "北京"\nprint(person["name"])\nfor key, value in person.items():\n    print(f"{key}: {value}")'
          },
          {
            id: '1-3-3',
            title: '集合与集合运算',
            content: '学习集合的创建和交集、并集、差集运算',
            type: 'code',
            duration: '40分钟',
            codeExample: 'set1 = {1, 2, 3, 4}\nset2 = {3, 4, 5, 6}\nprint(set1 & set2)\nprint(set1 | set2)\nprint(set1 - set2)'
          }
        ]
      },
      {
        id: '1-4',
        title: '函数与模块',
        lessons: [
          {
            id: '1-4-1',
            title: '函数定义与调用',
            content: '学习如何定义和调用函数，参数传递和返回值',
            type: 'code',
            duration: '50分钟',
            codeExample: 'def greet(name):\n    return f"你好, {name}!"\n\nresult = greet("小明")\nprint(result)'
          },
          {
            id: '1-4-2',
            title: 'lambda函数',
            content: '掌握lambda表达式的使用场景',
            type: 'code',
            duration: '30分钟',
            codeExample: 'square = lambda x: x ** 2\nprint(square(5))\n\nnumbers = [3, 1, 4, 1, 5]\nnumbers.sort(key=lambda x: -x)\nprint(numbers)'
          },
          {
            id: '1-4-3',
            title: '模块导入',
            content: '学习如何导入和使用Python标准库模块',
            type: 'code',
            duration: '35分钟',
            codeExample: 'import math\nprint(math.pi)\nprint(math.sqrt(16))\n\nfrom random import randint\nprint(randint(1, 100))'
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
    duration: '20小时',
    rating: 4.6,
    category: 'data-analysis',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20analysis%20libraries%20NumPy%20and%20Pandas&image_size=landscape_16_9',
    modules: [
      {
        id: '2-1',
        title: 'NumPy基础',
        lessons: [
          {
            id: '2-1-1',
            title: 'NumPy数组创建',
            content: '学习使用NumPy创建数组的各种方法',
            type: 'code',
            duration: '40分钟',
            codeExample: 'import numpy as np\narr1 = np.array([1, 2, 3, 4, 5])\narr2 = np.zeros(10)\narr3 = np.arange(0, 10, 2)\narr4 = np.random.rand(3, 3)\nprint(arr1, arr2, arr3, arr4)'
          },
          {
            id: '2-1-2',
            title: '数组索引与切片',
            content: '掌握NumPy数组的索引和切片操作',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import numpy as np\narr = np.array([10, 20, 30, 40, 50])\nprint(arr[0])\nprint(arr[1:4])\nprint(arr[::2])\n\nmatrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nprint(matrix[0, :])'
          },
          {
            id: '2-1-3',
            title: '数组运算与统计',
            content: '学习NumPy数组的数学运算和统计函数',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint(np.sum(arr))\nprint(np.mean(arr))\nprint(np.std(arr))\nprint(np.max(arr), np.min(arr))'
          },
          {
            id: '2-1-4',
            title: '数组变形与合并',
            content: '掌握数组的reshape、transpose和合并操作',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import numpy as np\narr = np.arange(12)\nreshaped = arr.reshape(3, 4)\nprint(reshaped)\n\narr1 = np.array([[1, 2], [3, 4]])\narr2 = np.array([[5, 6], [7, 8]])\nmerged = np.concatenate([arr1, arr2], axis=0)\nprint(merged)'
          }
        ]
      },
      {
        id: '2-2',
        title: 'Pandas数据处理',
        lessons: [
          {
            id: '2-2-1',
            title: 'Series创建与操作',
            content: '学习Pandas Series的创建和基本操作',
            type: 'code',
            duration: '35分钟',
            codeExample: 'import pandas as pd\ns = pd.Series([10, 20, 30, 40], index=[\'a\', \'b\', \'c\', \'d\'])\nprint(s[\'a\'])\nprint(s.values)'
          },
          {
            id: '2-2-2',
            title: 'DataFrame创建',
            content: '掌握DataFrame的多种创建方式',
            type: 'code',
            duration: '40分钟',
            codeExample: 'import pandas as pd\ndf = pd.DataFrame({\n    "name": ["Alice", "Bob", "Charlie"],\n    "age": [25, 30, 35],\n    "city": ["北京", "上海", "广州"]\n})\nprint(df)'
          },
          {
            id: '2-2-3',
            title: '数据选择与过滤',
            content: '学习DataFrame的行选择和列过滤',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import pandas as pd\ndf = pd.DataFrame({\n    "name": ["Alice", "Bob", "Charlie"],\n    "age": [25, 30, 35],\n    "salary": [5000, 6000, 7000]\n})\nprint(df[df["age"] > 25])\nprint(df[["name", "salary"]])'
          },
          {
            id: '2-2-4',
            title: '数据清洗',
            content: '处理缺失值、重复数据和异常值',
            type: 'code',
            duration: '55分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\n    "name": ["Alice", "Bob", "Alice", None],\n    "age": [25, 30, 25, np.nan],\n    "salary": [5000, 6000, 5000, 7000]\n})\ndf_clean = df.dropna()\ndf_clean = df_clean.drop_duplicates()\nprint(df_clean)'
          },
          {
            id: '2-2-5',
            title: '数据聚合与分组',
            content: '掌握groupby进行数据聚合分析',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import pandas as pd\ndf = pd.DataFrame({\n    "department": ["销售", "技术", "销售", "技术"],\n    "name": ["Alice", "Bob", "Charlie", "David"],\n    "salary": [5000, 6000, 5500, 6500]\n})\ngrouped = df.groupby("department").agg({"salary": ["mean", "sum"]})\nprint(grouped)'
          }
        ]
      },
      {
        id: '2-3',
        title: '数据合并与重塑',
        lessons: [
          {
            id: '2-3-1',
            title: 'concat合并',
            content: '使用pd.concat合并多个DataFrame',
            type: 'code',
            duration: '40分钟',
            codeExample: 'import pandas as pd\ndf1 = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})\ndf2 = pd.DataFrame({"name": ["Charlie", "David"], "age": [35, 40]})\nmerged = pd.concat([df1, df2], ignore_index=True)\nprint(merged)'
          },
          {
            id: '2-3-2',
            title: 'merge连接',
            content: '使用pd.merge进行表连接',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import pandas as pd\ndf1 = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})\ndf2 = pd.DataFrame({"name": ["Alice", "Bob"], "salary": [5000, 6000]})\nmerged = pd.merge(df1, df2, on="name")\nprint(merged)'
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
    duration: '18小时',
    rating: 4.7,
    category: 'visualization',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Data%20visualization%20with%20Matplotlib%20and%20Seaborn&image_size=landscape_16_9',
    modules: [
      {
        id: '3-1',
        title: 'Matplotlib基础',
        lessons: [
          {
            id: '3-1-1',
            title: '图表创建与保存',
            content: '学习Matplotlib的基本图表创建和保存方法',
            type: 'code',
            duration: '35分钟',
            codeExample: 'import matplotlib.pyplot as plt\nplt.figure(figsize=(10, 6))\nplt.plot([1, 2, 3, 4], [1, 4, 9, 16])\nplt.xlabel("X轴")\nplt.ylabel("Y轴")\nplt.title("简单折线图")\nplt.savefig("plot.png")\nplt.show()'
          },
          {
            id: '3-1-2',
            title: '折线图与散点图',
            content: '创建和自定义折线图和散点图',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import matplotlib.pyplot as plt\nimport numpy as np\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\nplt.scatter(x, y, c=y, cmap="viridis")\nplt.colorbar()\nplt.title("正弦曲线散点图")\nplt.show()'
          },
          {
            id: '3-1-3',
            title: '柱状图与饼图',
            content: '创建柱状图和饼图进行数据对比',
            type: 'code',
            duration: '40分钟',
            codeExample: 'import matplotlib.pyplot as plt\ncategories = ["Python", "Java", "C++", "JavaScript"]\nvalues = [45, 30, 15, 10]\nplt.figure(figsize=(12, 5))\nplt.subplot(1, 2, 1)\nplt.bar(categories, values)\nplt.subplot(1, 2, 2)\nplt.pie(values, labels=categories, autopct="%1.1f%%")\nplt.show()'
          }
        ]
      },
      {
        id: '3-2',
        title: 'Seaborn高级可视化',
        lessons: [
          {
            id: '3-2-1',
            title: 'Seaborn入门',
            content: '了解Seaborn的基本用法和样式设置',
            type: 'code',
            duration: '35分钟',
            codeExample: 'import seaborn as sns\nimport matplotlib.pyplot as plt\nsns.set_style("whitegrid")\ntips = sns.load_dataset("tips")\nprint(tips.head())'
          },
          {
            id: '3-2-2',
            title: '关系图与分布图',
            content: '使用relplot和displot创建关系图和分布图',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import seaborn as sns\nimport matplotlib.pyplot as plt\ntips = sns.load_dataset("tips")\nsns.relplot(data=tips, x="total_bill", y="tip", hue="smoker")\nplt.show()'
          },
          {
            id: '3-2-3',
            title: '分类数据可视化',
            content: '使用catplot可视化分类数据',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import seaborn as sns\nimport matplotlib.pyplot as plt\ntips = sns.load_dataset("tips")\nsns.catplot(data=tips, x="day", y="total_bill", kind="box")\nplt.show()'
          },
          {
            id: '3-2-4',
            title: '热力图与集群图',
            content: '创建热力图和层次聚类图',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import seaborn as sns\nimport matplotlib.pyplot as plt\nimport numpy as np\ndata = np.random.rand(10, 10)\nsns.heatmap(data, annot=True, fmt=".2f", cmap="coolwarm")\nplt.title("热力图示例")\nplt.show()'
          }
        ]
      },
      {
        id: '3-3',
        title: 'Pandas内置可视化',
        lessons: [
          {
            id: '3-3-1',
            title: 'Pandas绘图基础',
            content: '使用Pandas内置的plot方法快速绘图',
            type: 'code',
            duration: '40分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\ndf = pd.DataFrame(np.random.randn(100, 4), columns=list("ABCD"))\ndf.cumsum().plot()\nplt.show()'
          },
          {
            id: '3-3-2',
            title: '时间序列图表',
            content: '创建时间序列数据的可视化',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\ndates = pd.date_range("20240101", periods=30)\ndf = pd.DataFrame({\n    "date": dates,\n    "value": np.random.randn(30).cumsum()\n})\ndf.plot(x="date", y="value")\nplt.show()'
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
    duration: '25小时',
    rating: 4.9,
    category: 'business-analysis',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20data%20analysis%20dashboard&image_size=landscape_16_9',
    modules: [
      {
        id: '4-1',
        title: '销售数据分析',
        lessons: [
          {
            id: '4-1-1',
            title: '销售数据清洗',
            content: '处理销售数据中的重复、缺失和异常值',
            type: 'code',
            duration: '60分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({\n    "order_id": [1, 2, 2, 3, None],\n    "customer": ["Alice", "Bob", "Bob", "Charlie", "David"],\n    "amount": [100, 200, 200, 300, -50]\n})\ndf_clean = df.drop_duplicates().dropna()\ndf_clean = df_clean[df_clean["amount"] > 0]\nprint(df_clean)'
          },
          {
            id: '4-1-2',
            title: '销售趋势分析',
            content: '分析销售数据的时间趋势和模式',
            type: 'code',
            duration: '55分钟',
            codeExample: 'import pandas as pd\nimport matplotlib.pyplot as plt\nsales = pd.DataFrame({\n    "month": ["1月", "2月", "3月", "4月"],\n    "sales": [1000, 1200, 1100, 1500]\n})\nplt.plot(sales["month"], sales["sales"], marker="o")\nplt.title("月度销售趋势")\nplt.show()'
          },
          {
            id: '4-1-3',
            title: '客户分析与分群',
            content: '使用RFM模型进行客户价值分群',
            type: 'code',
            duration: '60分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\ncustomers = pd.DataFrame({\n    "customer_id": [1, 2, 3, 4],\n    "recency": [10, 30, 5, 60],\n    "frequency": [5, 3, 8, 2],\n    "monetary": [5000, 3000, 8000, 2000]\n})\ncustomers["segment"] = pd.cut(customers["monetary"], bins=[0, 4000, 6000, 10000], labels=["普通", "重要", "VIP"])\nprint(customers)'
          }
        ]
      },
      {
        id: '4-2',
        title: '用户行为分析',
        lessons: [
          {
            id: '4-2-1',
            title: '用户漏斗分析',
            content: '分析用户从访问到转化的漏斗转化率',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import pandas as pd\nimport matplotlib.pyplot as plt\nfunnel = pd.DataFrame({\n    "stage": ["访问", "注册", "浏览商品", "加入购物车", "下单"],\n    "users": [10000, 5000, 3000, 1500, 800]\n})\nplt.barh(funnel["stage"], funnel["users"])\nplt.title("用户漏斗转化")\nplt.show()'
          },
          {
            id: '4-2-2',
            title: '留存分析',
            content: '计算用户留存率和Cohort分析',
            type: 'code',
            duration: '55分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\nusers = pd.DataFrame({\n    "user_id": [1, 1, 1, 2, 2, 3],\n    "login_date": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-01", "2024-01-02", "2024-01-01"],\n    "days_active": [1, 2, 3, 1, 2, 1]\n})\nretention = users.groupby("days_active")["user_id"].count()\nprint(retention)'
          },
          {
            id: '4-2-3',
            title: '用户路径分析',
            content: '追踪用户在产品中的行为路径',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import pandas as pd\npaths = pd.DataFrame({\n    "session_id": [1, 1, 1, 2, 2],\n    "step": [1, 2, 3, 1, 2],\n    "page": ["首页", "商品页", "下单页", "首页", "注册页"]\n})\npath_counts = paths.groupby("page")["session_id"].count().sort_values(ascending=False)\nprint(path_counts)'
          }
        ]
      },
      {
        id: '4-3',
        title: '财务数据分析',
        lessons: [
          {
            id: '4-3-1',
            title: '收入分析',
            content: '分析收入结构、增长趋势和预测',
            type: 'code',
            duration: '55分钟',
            codeExample: 'import pandas as pd\nimport numpy as np\nrevenue = pd.DataFrame({\n    "quarter": ["Q1", "Q2", "Q3", "Q4"],\n    "revenue": [100, 120, 115, 150]\n})\ngrowth = revenue["revenue"].pct_change() * 100\nprint(f"季度增长率: {growth.fillna(0).round(2)}%")'
          },
          {
            id: '4-3-2',
            title: '成本分析',
            content: '分析成本结构和成本控制',
            type: 'code',
            duration: '50分钟',
            codeExample: 'import pandas as pd\ncosts = pd.DataFrame({\n    "category": ["人力", "租金", "营销", "运营"],\n    "amount": [50000, 20000, 15000, 10000]\n})\ncosts["占比"] = (costs["amount"] / costs["amount"].sum() * 100).round(2)\nprint(costs)'
          },
          {
            id: '4-3-3',
            title: '利润分析',
            content: '计算和分析利润率及其变化',
            type: 'code',
            duration: '45分钟',
            codeExample: 'import pandas as pd\nfinancials = pd.DataFrame({\n    "quarter": ["Q1", "Q2", "Q3", "Q4"],\n    "revenue": [100, 120, 115, 150],\n    "cost": [60, 65, 60, 75]\n})\nfinancials["profit"] = financials["revenue"] - financials["cost"]\nfinancials["margin"] = (financials["profit"] / financials["revenue"] * 100).round(2)\nprint(financials)'
          }
        ]
      },
      {
        id: '4-4',
        title: '数据报告与仪表盘',
        lessons: [
          {
            id: '4-4-1',
            title: '数据报告撰写',
            content: '学习如何撰写清晰的数据分析报告',
            type: 'text',
            duration: '40分钟'
          },
          {
            id: '4-4-2',
            title: '数据仪表盘设计',
            content: '使用Python创建交互式数据仪表盘',
            type: 'code',
            duration: '60分钟',
            codeExample: 'import pandas as pd\nimport matplotlib.pyplot as plt\nfrom matplotlib import rcParams\nrcParams["font.size"] = 10\nfig, axes = plt.subplots(2, 2, figsize=(12, 10))\nfig.suptitle("销售数据仪表盘")\naxes[0, 0].pie([30, 40, 30], labels=["产品A", "产品B", "产品C"])\naxes[0, 1].bar(["Q1", "Q2", "Q3", "Q4"], [100, 120, 115, 150])\nplt.tight_layout()\nplt.show()'
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