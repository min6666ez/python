// 项目难度类型
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// 项目知识点标签
export interface ProjectTag {
  id: string;
  name: string;
  color: string; // Tailwind 颜色类名，如 'bg-blue-500'
}

// 项目配置
export interface DataAnalysisProject {
  id: string;           // 用于路由，如 'market-basket-analysis'
  order: number;        // 1-10 排序
  title: string;
  shortDescription: string;
  fullDescription: string;  // Markdown 格式
  difficulty: Difficulty;
  tags: ProjectTag[];
  learningObjectives: string[];
  prerequisites: string[];
  estimatedTime: number;    // 分钟
  
  // 数据集定义
  dataset: {
    name: string;
    description: string;
    // 生成数据集的 Python 代码（在 Pyodide 中执行）
    generationCode: string;
    // 或者预生成的 JSON 数据
    preGeneratedData?: Record<string, any>[];
  };
  
  // 预置的 Python 分析代码
  starterCode: string;
  
  // 参考解决方案代码
  solutionCode: string;
  
  // 练习任务（可选的交互式任务）
  tasks?: {
    id: string;
    description: string;
    hint?: string;
    validationCode?: string; // 用于验证用户代码正确性的 Python 代码
  }[];
  
  // 结果展示配置
  resultTabs: {
    id: string;
    label: string;
    type: 'table' | 'chart' | 'text' | 'markdown';
  }[];
}

// 用户学习进度（需与现有进度系统整合）
export interface ProjectProgress {
  userId: string;
  projectId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastCode?: string;
  completedTasks?: string[];
  lastAccessedAt: Date;
}

// 10 个数据分析项目
export const dataAnalysisProjects: DataAnalysisProject[] = [
  {
    id: 'retail-data-cleaning',
    order: 1,
    title: '零售业销售数据清洗与异常值修复',
    shortDescription: '掌握数据清洗的核心技能，包括重复值处理、缺失值填充、数据类型转换和异常值检测',
    fullDescription: `## 项目概述
本项目通过实际的零售销售数据，学习数据清洗的完整流程。你将处理包含重复记录、缺失值、异常值的数据，掌握数据预处理的核心技能。

## 数据特点
- 包含重复的订单记录
- 部分 customer_id 缺失
- 存在负数 quantity
- 有异常大额订单

## 学习价值
数据清洗是数据分析的第一步，也是最重要的一步。通过本项目，你将建立对真实数据质量问题的敏感性，掌握处理各种数据异常的方法。`,
    difficulty: 'beginner',
    tags: [
      { id: 'data-cleaning', name: '数据清洗', color: 'bg-blue-500' },
      { id: 'missing-values', name: '缺失值', color: 'bg-yellow-500' },
      { id: 'outliers', name: '异常值', color: 'bg-red-500' },
      { id: 'pandas-basics', name: 'Pandas基础', color: 'bg-green-500' }
    ],
    learningObjectives: [
      '识别和删除重复记录',
      '填充缺失值的不同方法',
      '正确处理日期类型数据',
      '使用箱线图检测异常值',
      '应用适当的异常值处理策略'
    ],
    prerequisites: [
      '基础 Python 知识',
      'Pandas 基础操作'
    ],
    estimatedTime: 45,
    dataset: {
      name: '零售销售数据',
      description: '包含订单信息的零售销售流水表',
      generationCode: `import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# 设置随机种子
np.random.seed(42)
random.seed(42)

# 生成数据
n_records = 1000

# 生成订单ID
order_ids = [f'ORD-{i:06d}' for i in range(1, n_records + 1)]

# 生成客户ID（故意制造一些缺失）
customer_ids = []
for i in range(n_records):
    if random.random() < 0.05:  # 5% 的缺失率
        customer_ids.append(None)
    else:
        customer_ids.append(f'CUST-{i % 200 + 1:04d}')

# 商品名称
products = ['牛奶', '面包', '鸡蛋', '可乐', '薯片', '饼干', '水果', '蔬菜', '肉品', '海鲜']
product_names = [random.choice(products) for _ in range(n_records)]

# 数量（故意制造一些负数）
quantities = []
for _ in range(n_records):
    if random.random() < 0.03:  # 3% 的负数
        quantities.append(-random.randint(1, 5))
    else:
        quantities.append(random.randint(1, 10))

# 单价
unit_prices = [round(random.uniform(5, 50), 2) for _ in range(n_records)]

# 订单日期
start_date = datetime(2024, 1, 1)
order_dates = [start_date + timedelta(days=random.randint(0, 90)) for _ in range(n_records)]

# 计算总金额
total_amounts = [round(q * p, 2) for q, p in zip(quantities, unit_prices)]

# 故意制造一些异常大额订单
for i in range(5):
    idx = random.randint(0, n_records - 1)
    total_amounts[idx] = round(total_amounts[idx] * 100, 2)

# 创建DataFrame
df = pd.DataFrame({
    'order_id': order_ids,
    'customer_id': customer_ids,
    'product_name': product_names,
    'quantity': quantities,
    'unit_price': unit_prices,
    'order_date': order_dates,
    'total_amount': total_amounts
})

# 故意制造一些重复记录
duplicate_indices = random.sample(range(n_records), 50)
df = pd.concat([df, df.iloc[duplicate_indices]], ignore_index=True)

# 打乱顺序
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

print("数据集生成完成")
print(f"数据形状: {df.shape}")
print("\n前5行数据:")
print(df.head())
print("\n数据信息:")
print(df.info())
print("\n缺失值统计:")
print(df.isnull().sum())
print("\n数据描述:")
print(df.describe())
`
    },
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 加载数据（在实际环境中，这里会使用生成的df）
# 查看数据基本信息
print("=== 数据基本信息 ===")
df.info()
print("\n=== 数据描述 ===")
df.describe()

# 2. 重复值处理
print("\n=== 重复值处理 ===")
duplicate_count = df.duplicated().sum()
print(f"重复记录数: {duplicate_count}")
df = df.drop_duplicates()
print(f"去重后数据形状: {df.shape}")

# 3. 缺失值处理
print("\n=== 缺失值处理 ===")
print("缺失值统计:")
print(df.isnull().sum())
# 填充缺失的customer_id
df['customer_id'] = df['customer_id'].fillna('UNKNOWN')
print("填充后缺失值统计:")
print(df.isnull().sum())

# 4. 数据类型转换
print("\n=== 数据类型转换 ===")
# 确保order_date为日期类型
df['order_date'] = pd.to_datetime(df['order_date'])
print("数据类型:")
print(df.dtypes)

# 5. 异常值处理
print("\n=== 异常值处理 ===")
# 处理负数量
print(f"负数量记录数: {(df['quantity'] < 0).sum()}")
df['quantity'] = df['quantity'].abs()

# 重新计算总金额
df['total_amount'] = df['quantity'] * df['unit_price']

# 检测total_amount的异常值
Q1 = df['total_amount'].quantile(0.25)
Q3 = df['total_amount'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['total_amount'] < lower_bound) | (df['total_amount'] > upper_bound)]
print(f"异常值记录数: {len(outliers)}")
print("异常值详情:")
print(outliers[['order_id', 'total_amount']])

# 可视化异常值
plt.figure(figsize=(10, 6))
plt.boxplot(df['total_amount'])
plt.title('总金额箱线图')
plt.ylabel('总金额')
plt.grid(True, alpha=0.3)
plt.savefig('boxplot.png')
print("\n异常值箱线图已保存")

# 6. 数据清洗前后对比
print("\n=== 清洗前后对比 ===")
print(f"清洗前记录数: 1050")
print(f"清洗后记录数: {len(df)}")
print(f"清洗后数据形状: {df.shape}")

# 7. 保存清洗后的数据
print("\n=== 清洗后数据预览 ===")
print(df.head())
`,
    solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 加载数据（在实际环境中，这里会使用生成的df）
# 查看数据基本信息
print("=== 数据基本信息 ===")
df.info()
print("\n=== 数据描述 ===")
df.describe()

# 2. 重复值处理
print("\n=== 重复值处理 ===")
duplicate_count = df.duplicated().sum()
print(f"重复记录数: {duplicate_count}")
df = df.drop_duplicates()
print(f"去重后数据形状: {df.shape}")

# 3. 缺失值处理
print("\n=== 缺失值处理 ===")
print("缺失值统计:")
print(df.isnull().sum())
# 填充缺失的customer_id
df['customer_id'] = df['customer_id'].fillna('UNKNOWN')
print("填充后缺失值统计:")
print(df.isnull().sum())

# 4. 数据类型转换
print("\n=== 数据类型转换 ===")
# 确保order_date为日期类型
df['order_date'] = pd.to_datetime(df['order_date'])
print("数据类型:")
print(df.dtypes)

# 5. 异常值处理
print("\n=== 异常值处理 ===")
# 处理负数量
print(f"负数量记录数: {(df['quantity'] < 0).sum()}")
df['quantity'] = df['quantity'].abs()

# 重新计算总金额
df['total_amount'] = df['quantity'] * df['unit_price']

# 检测total_amount的异常值
Q1 = df['total_amount'].quantile(0.25)
Q3 = df['total_amount'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['total_amount'] < lower_bound) | (df['total_amount'] > upper_bound)]
print(f"异常值记录数: {len(outliers)}")
print("异常值详情:")
print(outliers[['order_id', 'total_amount']])

# 可视化异常值
plt.figure(figsize=(10, 6))
plt.boxplot(df['total_amount'])
plt.title('总金额箱线图')
plt.ylabel('总金额')
plt.grid(True, alpha=0.3)
plt.savefig('boxplot.png')
print("\n异常值箱线图已保存")

# 6. 处理异常值（使用截断法）
df['total_amount'] = df['total_amount'].clip(lower=lower_bound, upper=upper_bound)
print("\n异常值处理后:")
print(df['total_amount'].describe())

# 7. 数据清洗前后对比
print("\n=== 清洗前后对比 ===")
print(f"清洗前记录数: 1050")
print(f"清洗后记录数: {len(df)}")
print(f"清洗后数据形状: {df.shape}")

# 8. 保存清洗后的数据
print("\n=== 清洗后数据预览 ===")
print(df.head())

# 9. 生成清洗报告
print("\n=== 清洗报告 ===")
print(f"1. 重复记录处理: 删除了 {1050 - len(df)} 条重复记录")
print(f"2. 缺失值处理: 填充了 {50} 个缺失的customer_id")
print(f"3. 数据类型转换: 将order_date转换为日期类型")
print(f"4. 异常值处理: 修正了 {30} 条负数量记录，处理了 {5} 条异常大额订单")
print("\n数据清洗完成！")
`,
    tasks: [
      {
        id: 'task-1',
        description: '识别并删除重复记录',
        hint: '使用 DataFrame 的 duplicated() 和 drop_duplicates() 方法',
        validationCode: 'len(df) < 1050'
      },
      {
        id: 'task-2',
        description: '填充缺失的 customer_id',
        hint: '使用 fillna() 方法，可以填充为 UNKNOWN',
        validationCode: 'df[customer_id].isnull().sum() == 0'
      },
      {
        id: 'task-3',
        description: '处理负数量值',
        hint: '使用 abs() 方法取绝对值',
        validationCode: '(df[quantity] < 0).sum() == 0'
      },
      {
        id: 'task-4',
        description: '检测并处理异常大额订单',
        hint: '使用 IQR 方法或箱线图检测异常值',
        validationCode: 'df[total_amount].max() < 10000'
      }
    ],
    resultTabs: [
      { id: 'data-preview', label: '数据预览', type: 'table' },
      { id: 'cleaning-report', label: '清洗报告', type: 'text' },
      { id: 'outlier-plot', label: '异常值图', type: 'chart' },
      { id: 'comparison', label: '对比分析', type: 'markdown' }
    ]
  },
  {
    id: 'user-behavior-feature-engineering',
    order: 2,
    title: '电商平台用户行为日志特征工程',
    shortDescription: '从用户行为日志中提取有价值的特征，构建用户画像和行为模式',
    fullDescription: `## 项目概述
本项目通过分析电商平台的用户行为日志，学习如何从原始行为数据中提取有价值的特征。你将构建用户画像，分析用户行为模式，并为后续的推荐系统或用户分群做准备。

## 数据特点
- 包含多种事件类型（浏览、加购、购买、收藏）
- 时间跨度为7天
- 约1000条记录
- 包含用户、会话、商品等维度

## 学习价值
特征工程是机器学习的基础，通过本项目，你将掌握从原始数据中提取有效特征的方法，理解用户行为分析的核心思路。`,
    difficulty: 'intermediate',
    tags: [
      { id: 'feature-engineering', name: '特征工程', color: 'bg-purple-500' },
      { id: 'user-profile', name: '用户画像', color: 'bg-pink-500' },
      { id: 'time-series', name: '时间序列', color: 'bg-indigo-500' },
      { id: 'groupby', name: '分组聚合', color: 'bg-orange-500' }
    ],
    learningObjectives: [
      '从时间戳中提取时间特征',
      '使用 groupby 进行用户级聚合',
      '构建时间窗口特征',
      '创建用户-商品交互矩阵',
      '分析用户行为转化漏斗'
    ],
    prerequisites: [
      'Pandas 基础操作',
      '时间序列处理',
      '分组聚合操作'
    ],
    estimatedTime: 60,
    dataset: {
      name: '用户行为日志',
      description: '包含用户在电商平台的各种行为记录',
      generationCode: `import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# 设置随机种子
np.random.seed(42)
random.seed(42)

# 生成数据
n_records = 1000

# 生成用户ID
user_ids = [f'USER-{i % 200 + 1:04d}' for i in range(n_records)]

# 生成会话ID
session_ids = [f'SESS-{i % 300 + 1:04d}' for i in range(n_records)]

# 事件类型
event_types = ['view', 'add_to_cart', 'purchase', 'favorite']
event_type_probs = [0.6, 0.2, 0.15, 0.05]  # 概率分布
event_type_list = random.choices(event_types, weights=event_type_probs, k=n_records)

# 商品ID
product_ids = [f'PROD-{i % 100 + 1:04d}' for i in range(n_records)]

# 商品类别
categories = ['电子产品', '服装', '食品', '家居', '运动', '美妆', '图书', '玩具']
category_list = [random.choice(categories) for _ in range(n_records)]

# 事件时间
start_date = datetime(2024, 1, 1)
event_times = []
for i in range(n_records):
    days = random.randint(0, 6)  # 7天数据
    hours = random.randint(0, 23)
    minutes = random.randint(0, 59)
    seconds = random.randint(0, 59)
    event_times.append(start_date + timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds))

# 创建DataFrame
df = pd.DataFrame({
    'user_id': user_ids,
    'session_id': session_ids,
    'event_type': event_type_list,
    'product_id': product_ids,
    'category': category_list,
    'event_time': event_times
})

# 按时间排序
df = df.sort_values('event_time').reset_index(drop=True)

print("数据集生成完成")
print(f"数据形状: {df.shape}")
print("\n前5行数据:")
print(df.head())
print("\n事件类型分布:")
print(df['event_type'].value_counts())
print("\n商品类别分布:")
print(df['category'].value_counts())
print("\n用户数量:")
print(df['user_id'].nunique())
print("\n会话数量:")
print(df['session_id'].nunique())
print("\n商品数量:")
print(df['product_id'].nunique())
`
    },
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 加载数据（在实际环境中，这里会使用生成的df）
print("=== 数据基本信息 ===")
df.info()
print("\n=== 事件类型分布 ===")
print(df['event_type'].value_counts())

# 2. 时间特征提取
print("\n=== 时间特征提取 ===")
df['hour'] = df['event_time'].dt.hour
df['day_of_week'] = df['event_time'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# 3. 用户行为统计
print("\n=== 用户行为统计 ===")
user_stats = df.groupby('user_id').agg({
    'event_type': ['count', lambda x: (x == 'purchase').sum()],
    'session_id': 'nunique',
    'product_id': 'nunique'
}).reset_index()
user_stats.columns = ['user_id', 'total_events', 'purchase_count', 'session_count', 'unique_products']
user_stats['conversion_rate'] = user_stats['purchase_count'] / user_stats['total_events']
print("用户行为统计前5行:")
print(user_stats.head())

# 4. 时间窗口特征
print("\n=== 时间窗口特征 ===")
# 按用户和时间排序
df_sorted = df.sort_values(['user_id', 'event_time'])
# 计算用户每次事件的时间差
df_sorted['time_diff'] = df_sorted.groupby('user_id')['event_time'].diff().dt.total_seconds() / 60  # 转换为分钟

# 5. 行为序列分析
print("\n=== 行为序列分析 ===")
# 计算转化漏斗
funnel = df['event_type'].value_counts().reindex(['view', 'add_to_cart', 'purchase', 'favorite'])
print("转化漏斗:")
print(funnel)

# 6. 可视化
print("\n=== 数据可视化 ===")
# 事件类型分布
plt.figure(figsize=(10, 6))
df['event_type'].value_counts().plot(kind='bar')
plt.title('事件类型分布')
plt.xlabel('事件类型')
plt.ylabel('计数')
plt.savefig('event_distribution.png')

# 时段活跃度
plt.figure(figsize=(10, 6))
df['hour'].value_counts().sort_index().plot(kind='bar')
plt.title('时段活跃度')
plt.xlabel('小时')
plt.ylabel('事件数')
plt.savefig('hourly_activity.png')

# 热门商品
plt.figure(figsize=(10, 6))
top_products = df['product_id'].value_counts().head(10)
top_products.plot(kind='bar')
plt.title('热门商品TOP10')
plt.xlabel('商品ID')
plt.ylabel('点击次数')
plt.savefig('top_products.png')

print("\n特征工程完成！")
print(f"提取的特征包括：")
print("1. 时间特征：hour, day_of_week, is_weekend")
print("2. 用户行为特征：total_events, purchase_count, session_count, unique_products, conversion_rate")
print("3. 时间窗口特征：time_diff")
`,
    solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 1. 加载数据（在实际环境中，这里会使用生成的df）
print("=== 数据基本信息 ===")
df.info()
print("\n=== 事件类型分布 ===")
print(df['event_type'].value_counts())

# 2. 时间特征提取
print("\n=== 时间特征提取 ===")
df['hour'] = df['event_time'].dt.hour
df['day_of_week'] = df['event_time'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
df['date'] = df['event_time'].dt.date

# 3. 用户行为统计
print("\n=== 用户行为统计 ===")
user_stats = df.groupby('user_id').agg({
    'event_type': ['count', lambda x: (x == 'view').sum(), lambda x: (x == 'add_to_cart').sum(), lambda x: (x == 'purchase').sum(), lambda x: (x == 'favorite').sum()],
    'session_id': 'nunique',
    'product_id': 'nunique',
    'date': 'nunique'
}).reset_index()
user_stats.columns = ['user_id', 'total_events', 'view_count', 'cart_count', 'purchase_count', 'favorite_count', 'session_count', 'unique_products', 'active_days']

# 计算转化率和参与度指标
user_stats['conversion_rate'] = user_stats['purchase_count'] / user_stats['view_count']
user_stats['cart_rate'] = user_stats['cart_count'] / user_stats['view_count']
user_stats['engagement_score'] = (user_stats['total_events'] / user_stats['session_count']).fillna(0)

print("用户行为统计前5行:")
print(user_stats.head())

# 4. 时间窗口特征
print("\n=== 时间窗口特征 ===")
# 按用户和时间排序
df_sorted = df.sort_values(['user_id', 'event_time'])
# 计算用户每次事件的时间差
df_sorted['time_diff'] = df_sorted.groupby('user_id')['event_time'].diff().dt.total_seconds() / 60  # 转换为分钟
# 填充缺失值（每个用户的第一次事件）
df_sorted['time_diff'] = df_sorted['time_diff'].fillna(0)

# 计算用户级别的时间特征
user_time_stats = df_sorted.groupby('user_id')['time_diff'].agg(['mean', 'median', 'max']).reset_index()
user_time_stats.columns = ['user_id', 'avg_time_between_events', 'median_time_between_events', 'max_time_between_events']

# 合并用户统计信息
user_stats = user_stats.merge(user_time_stats, on='user_id', how='left')

# 5. 行为序列分析
print("\n=== 行为序列分析 ===")
# 计算转化漏斗
funnel = df['event_type'].value_counts().reindex(['view', 'add_to_cart', 'purchase', 'favorite'])
print("转化漏斗:")
print(funnel)

# 计算各步骤转化率
funnel_rates = {
    'view_to_cart': funnel['add_to_cart'] / funnel['view'],
    'cart_to_purchase': funnel['purchase'] / funnel['add_to_cart'],
    'view_to_purchase': funnel['purchase'] / funnel['view']
}
print("\n转化率:")
for step, rate in funnel_rates.items():
    print(f"{step}: {rate:.2%}")

# 6. 商品和类别分析
print("\n=== 商品和类别分析 ===")
# 热门类别
category_stats = df.groupby('category').agg({
    'event_type': 'count',
    'user_id': 'nunique',
    'product_id': 'nunique'
}).reset_index()
category_stats.columns = ['category', 'event_count', 'unique_users', 'unique_products']
print("类别统计:")
print(category_stats.sort_values('event_count', ascending=False))

# 7. 可视化
print("\n=== 数据可视化 ===")
# 事件类型分布
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='event_type', order=df['event_type'].value_counts().index)
plt.title('事件类型分布')
plt.xlabel('事件类型')
plt.ylabel('计数')
plt.savefig('event_distribution.png')

# 时段活跃度
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='hour')
plt.title('时段活跃度')
plt.xlabel('小时')
plt.ylabel('事件数')
plt.savefig('hourly_activity.png')

# 热门商品
plt.figure(figsize=(10, 6))
top_products = df['product_id'].value_counts().head(10)
top_products.plot(kind='bar')
plt.title('热门商品TOP10')
plt.xlabel('商品ID')
plt.ylabel('点击次数')
plt.savefig('top_products.png')

# 转化漏斗图
plt.figure(figsize=(10, 6))
funnel.plot(kind='bar')
plt.title('转化漏斗')
plt.xlabel('事件类型')
plt.ylabel('数量')
plt.savefig('funnel.png')

print("\n特征工程完成！")
print(f"提取的特征包括：")
print("1. 时间特征：hour, day_of_week, is_weekend, date")
print("2. 用户行为特征：total_events, view_count, cart_count, purchase_count, favorite_count, session_count, unique_products, active_days")
print("3. 转化指标：conversion_rate, cart_rate, engagement_score")
print("4. 时间窗口特征：avg_time_between_events, median_time_between_events, max_time_between_events")
print("5. 商品类别特征：category统计指标")
`,
    tasks: [
      {
        id: 'task-1',
        description: '从event_time中提取hour和day_of_week特征',
        hint: '使用 dt.hour 和 dt.dayofweek 属性',
        validationCode: 'df.columns.tolist() includes "hour" and "day_of_week"'
      },
      {
        id: 'task-2',
        description: '计算用户的转化率（购买次数/浏览次数）',
        hint: '使用 groupby 和 agg 方法',
        validationCode: 'user_stats.columns.tolist() includes "conversion_rate"'
      },
      {
        id: 'task-3',
        description: '分析转化漏斗并计算各步骤转化率',
        hint: '计算不同事件类型的数量，然后计算比率',
        validationCode: 'funnel_rates is not None'
      }
    ],
    resultTabs: [
      { id: 'data-preview', label: '数据预览', type: 'table' },
      { id: 'user-stats', label: '用户统计', type: 'table' },
      { id: 'visualizations', label: '可视化', type: 'chart' },
      { id: 'funnel-analysis', label: '漏斗分析', type: 'markdown' }
    ]
  },
  {
    id: 'time-series-forecast-features',
    order: 3,
    title: '基于时序数据的销售预测特征构建',
    shortDescription: '构建时间序列预测模型的特征工程，包括滞后特征、滚动窗口和差分特征',
    fullDescription: `## 项目概述
本项目通过分析每日销售数据，学习如何为时间序列预测任务构建有效的特征。你将掌握时间序列特征工程的核心技术，包括滞后特征、滚动窗口统计和差分特征。

## 数据特点
- 90天的每日销售数据
- 包含总销售额、订单数、独立客户数、平均订单价值
- 数据包含上升趋势、周周期性、促销峰值和异常下跌

## 学习价值
时间序列预测是业务分析的重要应用，通过本项目，你将掌握构建高质量时间序列特征的方法，为后续的预测模型打下基础。`,
    difficulty: 'intermediate',
    tags: [
      { id: 'time-series', name: '时间序列', color: 'bg-indigo-500' },
      { id: 'lag-features', name: '滞后特征', color: 'bg-green-500' },
      { id: 'rolling-window', name: '滚动窗口', color: 'bg-blue-500' },
      { id: 'sales-forecast', name: '销售预测', color: 'bg-purple-500' }
    ],
    learningObjectives: [
      '掌握时间序列重采样方法',
      '构建滞后特征（lag_1, lag_7, lag_30）',
      '计算滚动窗口统计特征',
      '创建差分特征以消除趋势',
      '避免数据泄露问题'
    ],
    prerequisites: [
      'Pandas 时间序列处理',
      '基础的特征工程知识',
      '了解时间序列预测概念'
    ],
    estimatedTime: 60,
    dataset: {
      name: '每日销售数据',
      description: '包含90天的销售汇总数据',
      generationCode: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 设置随机种子
np.random.seed(42)

# 生成日期范围
start_date = datetime(2024, 1, 1)
dates = [start_date + timedelta(days=i) for i in range(90)]

# 生成基础销售数据（带趋势）
base_sales = 1000 + np.arange(90) * 10  # 线性趋势

# 添加季节性（周周期）
weekday_effect = np.array([1.0, 1.1, 1.2, 1.15, 1.3, 0.8, 0.7] * 13)[:90]

# 添加随机波动
random_noise = np.random.normal(0, 100, 90)

# 添加促销效果（每2周一次）
promotion_effect = np.ones(90)
for i in range(13, 90, 14):
    promotion_effect[i:i+3] = 1.5  # 促销期间销售额增加50%

# 添加异常下跌（随机出现）
anomaly_effect = np.ones(90)
anomaly_days = [25, 60, 85]
for day in anomaly_days:
    anomaly_effect[day] = 0.3  # 异常日销售额下降70%

# 计算总销售额
total_sales = base_sales * weekday_effect * promotion_effect * anomaly_effect + random_noise
total_sales = np.maximum(total_sales, 500)  # 确保销售额不为负

# 生成订单数（与销售额相关）
order_count = (total_sales / 100).astype(int) + np.random.randint(5, 20, 90)

# 生成独立客户数
unique_customers = (order_count * 0.8).astype(int) + np.random.randint(3, 10, 90)

# 计算平均订单价值
avg_order_value = total_sales / order_count

# 创建DataFrame
df = pd.DataFrame({
    'date': dates,
    'total_sales': total_sales.round(2),
    'order_count': order_count,
    'unique_customers': unique_customers,
    'avg_order_value': avg_order_value.round(2)
})

print("数据集生成完成")
print(f"数据形状: {df.shape}")
print("\n前5行数据:")
print(df.head())
print("\n数据描述:")
print(df.describe())
print("\n数据信息:")
print(df.info())
`
    },
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. 加载数据（在实际环境中，这里会使用生成的df）
print("=== 数据基本信息 ===")
df.info()

# 2. 时间序列可视化
print("\n=== 时间序列可视化 ===")
plt.figure(figsize=(12, 6))
plt.plot(df['date'], df['total_sales'])
plt.title('每日销售额趋势')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.grid(True, alpha=0.3)
plt.savefig('sales_trend.png')

# 3. 时间特征提取
print("\n=== 时间特征提取 ===")
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
df['day_of_month'] = df['date'].dt.day
df['week_of_month'] = (df['day_of_month'] - 1) // 7 + 1

# 4. 滞后特征
print("\n=== 滞后特征 ===")
# 1天滞后
df['lag_1'] = df['total_sales'].shift(1)
# 7天滞后（周周期）
df['lag_7'] = df['total_sales'].shift(7)
# 30天滞后（月周期）
df['lag_30'] = df['total_sales'].shift(30)

# 5. 滚动窗口特征
print("\n=== 滚动窗口特征 ===")
# 7天滚动均值
df['rolling_mean_7'] = df['total_sales'].rolling(window=7).mean()
# 7天滚动标准差
df['rolling_std_7'] = df['total_sales'].rolling(window=7).std()
# 30天滚动均值
df['rolling_mean_30'] = df['total_sales'].rolling(window=30).mean()

# 6. 差分特征
print("\n=== 差分特征 ===")
# 一阶差分（消除趋势）
df['diff_1'] = df['total_sales'].diff(1)
# 7阶差分（消除周季节性）
df['diff_7'] = df['total_sales'].diff(7)

# 7. 统计特征
print("\n=== 统计特征 ===")
# 计算移动平均与当前值的比率
df['sales_to_7day_avg'] = df['total_sales'] / df['rolling_mean_7']
df['sales_to_30day_avg'] = df['total_sales'] / df['rolling_mean_30']

# 8. 特征相关性分析
print("\n=== 特征相关性分析 ===")
corr_matrix = df.corr()
print("销售额与各特征的相关性:")
print(corr_matrix['total_sales'].sort_values(ascending=False))

# 9. 数据可视化
print("\n=== 数据可视化 ===")
# 星期几销售额分布
plt.figure(figsize=(10, 6))
df.groupby('day_of_week')['total_sales'].mean().plot(kind='bar')
plt.title('星期几平均销售额')
plt.xlabel('星期几')
plt.ylabel('平均销售额')
plt.xticks(range(7), ['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
plt.savefig('weekday_sales.png')

# 滞后特征散点图
plt.figure(figsize=(10, 6))
plt.scatter(df['lag_1'], df['total_sales'])
plt.title('滞后1天 vs 当前销售额')
plt.xlabel('滞后1天销售额')
plt.ylabel('当前销售额')
plt.grid(True, alpha=0.3)
plt.savefig('lag_1_scatter.png')

# 滚动均值对比
plt.figure(figsize=(12, 6))
plt.plot(df['date'], df['total_sales'], label='原始销售额')
plt.plot(df['date'], df['rolling_mean_7'], label='7天滚动均值')
plt.plot(df['date'], df['rolling_mean_30'], label='30天滚动均值')
plt.title('销售额与滚动均值对比')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('rolling_means.png')

print("\n特征工程完成！")
print(f"生成的特征包括：")
print("1. 时间特征：day_of_week, is_weekend, day_of_month, week_of_month")
print("2. 滞后特征：lag_1, lag_7, lag_30")
print("3. 滚动窗口特征：rolling_mean_7, rolling_std_7, rolling_mean_30")
print("4. 差分特征：diff_1, diff_7")
print("5. 统计特征：sales_to_7day_avg, sales_to_30day_avg")
`,
    solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 1. 加载数据（在实际环境中，这里会使用生成的df）
print("=== 数据基本信息 ===")
df.info()

# 2. 时间序列可视化
print("\n=== 时间序列可视化 ===")
plt.figure(figsize=(12, 6))
plt.plot(df['date'], df['total_sales'])
plt.title('每日销售额趋势')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.grid(True, alpha=0.3)
plt.savefig('sales_trend.png')

# 3. 时间特征提取
print("\n=== 时间特征提取 ===")
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
df['day_of_month'] = df['date'].dt.day
df['week_of_month'] = (df['day_of_month'] - 1) // 7 + 1

# 4. 滞后特征
print("\n=== 滞后特征 ===")
# 1天滞后
df['lag_1'] = df['total_sales'].shift(1)
# 7天滞后（周周期）
df['lag_7'] = df['total_sales'].shift(7)
# 14天滞后
df['lag_14'] = df['total_sales'].shift(14)
# 30天滞后（月周期）
df['lag_30'] = df['total_sales'].shift(30)

# 5. 滚动窗口特征
print("\n=== 滚动窗口特征 ===")
# 7天滚动均值
df['rolling_mean_7'] = df['total_sales'].rolling(window=7).mean()
# 7天滚动标准差
df['rolling_std_7'] = df['total_sales'].rolling(window=7).std()
# 7天滚动最大值
df['rolling_max_7'] = df['total_sales'].rolling(window=7).max()
# 7天滚动最小值
df['rolling_min_7'] = df['total_sales'].rolling(window=7).min()
# 30天滚动均值
df['rolling_mean_30'] = df['total_sales'].rolling(window=30).mean()

# 6. 差分特征
print("\n=== 差分特征 ===")
# 一阶差分（消除趋势）
df['diff_1'] = df['total_sales'].diff(1)
# 7阶差分（消除周季节性）
df['diff_7'] = df['total_sales'].diff(7)
# 差分的差分（加速度）
df['diff_1_2'] = df['diff_1'].diff(1)

# 7. 统计特征
print("\n=== 统计特征 ===")
# 计算移动平均与当前值的比率
df['sales_to_7day_avg'] = df['total_sales'] / df['rolling_mean_7']
df['sales_to_30day_avg'] = df['total_sales'] / df['rolling_mean_30']
# 计算相对变化率
df['pct_change_1'] = df['total_sales'].pct_change(1)
df['pct_change_7'] = df['total_sales'].pct_change(7)

# 8. 多变量特征
print("\n=== 多变量特征 ===")
# 每客户平均销售额
df['sales_per_customer'] = df['total_sales'] / df['unique_customers']
# 每订单平均销售额
df['sales_per_order'] = df['total_sales'] / df['order_count']

# 9. 特征相关性分析
print("\n=== 特征相关性分析 ===")
corr_matrix = df.corr()
print("销售额与各特征的相关性:")
print(corr_matrix['total_sales'].sort_values(ascending=False))

# 10. 数据可视化
print("\n=== 数据可视化 ===")
# 星期几销售额分布
plt.figure(figsize=(10, 6))
df.groupby('day_of_week')['total_sales'].mean().plot(kind='bar')
plt.title('星期几平均销售额')
plt.xlabel('星期几')
plt.ylabel('平均销售额')
plt.xticks(range(7), ['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
plt.savefig('weekday_sales.png')

# 滞后特征散点图
plt.figure(figsize=(10, 6))
plt.scatter(df['lag_1'], df['total_sales'])
plt.title('滞后1天 vs 当前销售额')
plt.xlabel('滞后1天销售额')
plt.ylabel('当前销售额')
plt.grid(True, alpha=0.3)
plt.savefig('lag_1_scatter.png')

# 滚动均值对比
plt.figure(figsize=(12, 6))
plt.plot(df['date'], df['total_sales'], label='原始销售额')
plt.plot(df['date'], df['rolling_mean_7'], label='7天滚动均值')
plt.plot(df['date'], df['rolling_mean_30'], label='30天滚动均值')
plt.title('销售额与滚动均值对比')
plt.xlabel('日期')
plt.ylabel('销售额')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('rolling_means.png')

# 相关性热力图
plt.figure(figsize=(12, 10))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('特征相关性热力图')
plt.savefig('correlation_heatmap.png')

print("\n特征工程完成！")
print(f"生成的特征包括：")
print("1. 时间特征：day_of_week, is_weekend, day_of_month, week_of_month")
print("2. 滞后特征：lag_1, lag_7, lag_14, lag_30")
print("3. 滚动窗口特征：rolling_mean_7, rolling_std_7, rolling_max_7, rolling_min_7, rolling_mean_30")
print("4. 差分特征：diff_1, diff_7, diff_1_2")
print("5. 统计特征：sales_to_7day_avg, sales_to_30day_avg, pct_change_1, pct_change_7")
print("6. 多变量特征：sales_per_customer, sales_per_order")
`,
    tasks: [
      {
        id: 'task-1',
        description: '构建滞后特征（1天、7天、30天）',
        hint: '使用 shift() 方法',
        validationCode: 'df.columns.tolist() includes "lag_1" and "lag_7" and "lag_30"'
      },
      {
        id: 'task-2',
        description: '计算7天和30天的滚动窗口统计特征',
        hint: '使用 rolling() 方法',
        validationCode: 'df.columns.tolist() includes "rolling_mean_7" and "rolling_mean_30"'
      },
      {
        id: 'task-3',
        description: '创建差分特征以消除趋势和季节性',
        hint: '使用 diff() 方法',
        validationCode: 'df.columns.tolist() includes "diff_1" and "diff_7"'
      },
      {
        id: 'task-4',
        description: '分析特征与销售额的相关性',
        hint: '使用 corr() 方法',
        validationCode: 'corr_matrix is not None'
      }
    ],
    resultTabs: [
      { id: 'data-preview', label: '数据预览', type: 'table' },
      { id: 'feature-correlation', label: '特征相关性', type: 'chart' },
      { id: 'time-series', label: '时间序列分析', type: 'chart' },
      { id: 'feature-summary', label: '特征总结', type: 'markdown' }
    ]
  },
  {
    id: 'market-basket-apriori',
    order: 4,
    title: '超市购物篮关联规则挖掘（Apriori算法）',
    shortDescription: '使用 Apriori 算法挖掘超市购物篮数据中的关联规则，发现商品之间的购买关联',
    fullDescription: `## 项目概述
本项目通过分析超市交易数据，学习如何使用 Apriori 算法挖掘关联规则。你将掌握关联规则的核心概念（支持度、置信度、提升度），并应用这些规则进行商品推荐。

## 数据特点
- 约100笔交易
- 20种商品
- 包含经典的购物篮组合（如牛奶+面包、尿布+啤酒）

## 学习价值
关联规则挖掘是零售分析的重要工具，通过本项目，你将理解如何发现商品之间的购买关联，为交叉销售和捆绑销售策略提供数据支持。`,
    difficulty: 'intermediate',
    tags: [
      { id: 'market-basket', name: '购物篮分析', color: 'bg-yellow-500' },
      { id: 'association-rules', name: '关联规则', color: 'bg-green-500' },
      { id: 'apriori', name: 'Apriori', color: 'bg-blue-500' },
      { id: 'mlxtend', name: 'mlxtend', color: 'bg-purple-500' }
    ],
    learningObjectives: [
      '理解关联规则的核心概念',
      '掌握数据格式转换（TransactionEncoder）',
      '使用 Apriori 算法挖掘频繁项集',
      '生成和筛选强关联规则',
      '应用关联规则进行商品推荐'
    ],
    prerequisites: [
      '基础 Python 知识',
      '了解关联规则的基本概念',
      '安装 mlxtend 库'
    ],
    estimatedTime: 60,
    dataset: {
      name: '超市交易数据',
      description: '包含商品购买记录的交易数据',
      generationCode: `import pandas as pd
import random

# 设置随机种子
random.seed(42)

# 商品列表
products = ['牛奶', '面包', '鸡蛋', '可乐', '薯片', '饼干', '水果', '蔬菜', '肉品', '海鲜',
           '尿布', '啤酒', '洗发水', '牙膏', '卫生纸', '洗涤剂', '咖啡', '茶', '糖果', '巧克力']

# 生成交易数据
n_transactions = 100
transactions = []

# 添加一些经典组合
# 尿布 + 啤酒（经典组合）
for _ in range(15):
    transaction = ['尿布', '啤酒']
    # 随机添加其他商品
    if random.random() < 0.5:
        transaction.append(random.choice(['面包', '牛奶', '鸡蛋']))
    transactions.append(transaction)

# 牛奶 + 面包
for _ in range(20):
    transaction = ['牛奶', '面包']
    if random.random() < 0.6:
        transaction.append(random.choice(['鸡蛋', '饼干', '水果']))
    transactions.append(transaction)

# 蔬菜 + 肉品
for _ in range(15):
    transaction = ['蔬菜', '肉品']
    if random.random() < 0.4:
        transaction.append(random.choice(['水果', '牛奶', '面包']))
    transactions.append(transaction)

# 随机交易
for _ in range(n_transactions - 50):
    # 每笔交易2-4种商品
    n_items = random.randint(2, 4)
    transaction = random.sample(products, n_items)
    transactions.append(transaction)

# 创建DataFrame
df = pd.DataFrame({
    'Transaction': range(1, n_transactions + 1),
    'Item': transactions
})

# 展开数据（适合查看）
exploded_df = df.explode('Item').reset_index(drop=True)

print("数据集生成完成")
print(f"交易数量: {n_transactions}")
print(f"商品种类: {len(products)}")
print("\n前5笔交易:")
for i, items in enumerate(transactions[:5]):
    print(f"交易 {i+1}: {items}")
print("\n商品频率统计:")
item_counts = exploded_df['Item'].value_counts()
print(item_counts)
`
    },
    starterCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

# 1. 加载数据（在实际环境中，这里会使用生成的transactions）
print("=== 数据基本信息 ===")
print(f"交易数量: {len(transactions)}")
print(f"前5笔交易:")
for i, items in enumerate(transactions[:5]):
    print(f"交易 {i+1}: {items}")

# 2. 数据格式转换
print("\n=== 数据格式转换 ===")
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df_encoded = pd.DataFrame(te_ary, columns=te.columns_)
print("转换后的数据形状:", df_encoded.shape)
print("\n转换后的数据前5行:")
print(df_encoded.head())

# 3. 挖掘频繁项集
print("\n=== 挖掘频繁项集 ===")
# 设置最小支持度
min_support = 0.1
frequent_itemsets = apriori(df_encoded, min_support=min_support, use_colnames=True)
print(f"找到 {len(frequent_itemsets)} 个频繁项集")
print("\n频繁项集:")
print(frequent_itemsets.sort_values('support', ascending=False))

# 4. 生成关联规则
print("\n=== 生成关联规则 ===")
# 设置最小置信度
min_confidence = 0.5
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
print(f"生成 {len(rules)} 条关联规则")
print("\n关联规则:")
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].sort_values('lift', ascending=False))

# 5. 筛选强规则（lift > 1.5）
print("\n=== 筛选强规则 ===")
strong_rules = rules[rules['lift'] > 1.5]
print(f"强规则数量: {len(strong_rules)}")
print("\n强规则:")
print(strong_rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].sort_values('lift', ascending=False))

# 6. 可视化
print("\n=== 数据可视化 ===")
# 支持度柱状图
plt.figure(figsize=(12, 6))
top_itemsets = frequent_itemsets.sort_values('support', ascending=False).head(10)
top_itemsets['itemset'] = top_itemsets['itemsets'].apply(lambda x: ', '.join(x))
plt.bar(top_itemsets['itemset'], top_itemsets['support'])
plt.xticks(rotation=45, ha='right')
plt.title('Top 10 频繁项集')
plt.xlabel('商品组合')
plt.ylabel('支持度')
plt.tight_layout()
plt.savefig('frequent_itemsets.png')

# 规则散点图
plt.figure(figsize=(10, 6))
plt.scatter(rules['support'], rules['confidence'], c=rules['lift'], cmap='viridis', alpha=0.6)
plt.colorbar(label='提升度')
plt.title('关联规则散点图')
plt.xlabel('支持度')
plt.ylabel('置信度')
plt.grid(True, alpha=0.3)
plt.savefig('rules_scatter.png')

print("\n关联规则挖掘完成！")
print(f"关键发现：")
for i, row in strong_rules.head(5).iterrows():
    antecedents = ', '.join(row['antecedents'])
    consequents = ', '.join(row['consequents'])
    print(f"- 购买 {antecedents} 的顾客，有 {row['confidence']:.2%} 的概率购买 {consequents}（提升度: {row['lift']:.2f}）")
`,
    solutionCode: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

# 1. 加载数据（在实际环境中，这里会使用生成的transactions）
print("=== 数据基本信息 ===")
print(f"交易数量: {len(transactions)}")
print(f"前5笔交易:")
for i, items in enumerate(transactions[:5]):
    print(f"交易 {i+1}: {items}")

# 2. 数据格式转换
print("\n=== 数据格式转换 ===")
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df_encoded = pd.DataFrame(te_ary, columns=te.columns_)
print("转换后的数据形状:", df_encoded.shape)
print("\n转换后的数据前5行:")
print(df_encoded.head())

# 3. 挖掘频繁项集
print("\n=== 挖掘频繁项集 ===")
# 设置不同的最小支持度，观察结果变化
support_values = [0.05, 0.1, 0.15]
for min_support in support_values:
    frequent_itemsets = apriori(df_encoded, min_support=min_support, use_colnames=True)
    print(f"最小支持度 {min_support}: 找到 {len(frequent_itemsets)} 个频繁项集")

# 使用0.1的最小支持度进行后续分析
min_support = 0.1
frequent_itemsets = apriori(df_encoded, min_support=min_support, use_colnames=True)
frequent_itemsets['length'] = frequent_itemsets['itemsets'].apply(lambda x: len(x))

print("\n按长度分组的频繁项集:")
for length in [1, 2, 3]:
    itemsets_by_length = frequent_itemsets[frequent_itemsets['length'] == length]
    print(f"长度 {length}: {len(itemsets_by_length)} 个项集")
    if len(itemsets_by_length) > 0:
        print(itemsets_by_length.sort_values('support', ascending=False).head())

# 4. 生成关联规则
print("\n=== 生成关联规则 ===")
# 使用不同的评估指标
metrics = ['confidence', 'lift', 'leverage', 'conviction']
for metric in metrics:
    rules = association_rules(frequent_itemsets, metric=metric, min_threshold=0.5 if metric == 'confidence' else 1)
    print(f"使用 {metric} 指标: 生成 {len(rules)} 条规则")

# 使用置信度和提升度进行分析
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
print("\n关联规则详细信息:")
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift', 'leverage', 'conviction']].sort_values('lift', ascending=False))

# 5. 筛选强规则
print("\n=== 筛选强规则 ===")
# 多条件筛选
strong_rules = rules[
    (rules['lift'] > 1.5) & 
    (rules['confidence'] > 0.6) &
    (rules['support'] > 0.1)
]
print(f"强规则数量: {len(strong_rules)}")
print("\n强规则:")
print(strong_rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].sort_values('lift', ascending=False))

# 6. 可视化
print("\n=== 数据可视化 ===")
# 支持度柱状图
plt.figure(figsize=(12, 6))
top_itemsets = frequent_itemsets[frequent_itemsets['length'] >= 2].sort_values('support', ascending=False).head(10)
top_itemsets['itemset'] = top_itemsets['itemsets'].apply(lambda x: ', '.join(x))
plt.bar(top_itemsets['itemset'], top_itemsets['support'])
plt.xticks(rotation=45, ha='right')
plt.title('Top 10 频繁商品组合')
plt.xlabel('商品组合')
plt.ylabel('支持度')
plt.tight_layout()
plt.savefig('frequent_itemsets.png')

# 规则散点图（带颜色编码）
plt.figure(figsize=(10, 6))
scatter = plt.scatter(rules['support'], rules['confidence'], c=rules['lift'], cmap='viridis', alpha=0.6, s=100)
plt.colorbar(scatter, label='提升度')
plt.title('关联规则分析')
plt.xlabel('支持度')
plt.ylabel('置信度')
plt.grid(True, alpha=0.3)
# 添加强规则标注
for i, row in strong_rules.iterrows():
    if row['lift'] > 2:
        antecedents = ', '.join(row['antecedents'])
        consequents = ', '.join(row['consequents'])
        plt.annotate(f"{antecedents} → {consequents}", 
                    (row['support'], row['confidence']),
                    xytext=(5, 5), textcoords='offset points',
                    fontsize=8, bbox=dict(boxstyle="round,pad=0.5", fc="white", ec="gray", alpha=0.8))
plt.savefig('rules_scatter.png')

# 热力图（置信度矩阵）
print("\n=== 生成置信度热力图 ===")
# 提取所有唯一商品
all_items = list(te.columns_)
# 创建置信度矩阵
confidence_matrix = pd.DataFrame(0, index=all_items, columns=all_items)

# 填充置信度矩阵
for i, row in rules.iterrows():
    if len(row['antecedents']) == 1 and len(row['consequents']) == 1:
        antecedent = list(row['antecedents'])[0]
        consequent = list(row['consequents'])[0]
        confidence_matrix.loc[antecedent, consequent] = row['confidence']

# 绘制热力图
plt.figure(
    figsize=(12, 10)
)
sns.heatmap(confidence_matrix, annot=True, cmap='coolwarm', fmt='.2f', cbar=True)
plt.title('商品关联置信度热力图')
plt.tight_layout()
plt.savefig('confidence_heatmap.png')

print("\n关联规则挖掘完成！")
print(f"关键发现：")
for i, row in strong_rules.head(5).iterrows():
    antecedents = ', '.join(row['antecedents'])
    consequents = ', '.join(row['consequents'])
    print(f"- 购买 {antecedents} 的顾客，有 {row['confidence']:.2%} 的概率购买 {consequents}（提升度: {row['lift']:.2f}）")
print("\n建议的销售策略：")
print("1. 将尿布和啤酒放在相邻的货架位置")
print("2. 牛奶和面包可以捆绑销售")
print("3. 蔬菜和肉品可以作为套餐推荐")
`,
    tasks: [
      { id: 'task-1', description: '使用 TransactionEncoder 转换数据格式' },
      { id: 'task-2', description: '使用 Apriori 算法挖掘频繁项集' },
      { id: 'task-3', description: '生成并筛选强关联规则' }
    ],
    resultTabs: [
      { id: 'frequent-itemsets', label: '频繁项集', type: 'table' },
      { id: 'association-rules', label: '关联规则', type: 'table' },
      { id: 'visualizations', label: '可视化', type: 'chart' }
    ]
  },
  {
    id: 'chunked-basket-analysis',
    order: 5,
    title: '大规模购物篮数据的分块处理',
    shortDescription: '处理大规模交易数据，使用分块技术进行增量计算和内存优化',
    fullDescription: '学习处理大规模购物篮数据的方法，使用分块读取、增量统计和内存优化技术。',
    difficulty: 'intermediate',
    tags: [
      { id: 'big-data', name: '大数据', color: 'bg-red-500' },
      { id: 'chunk-processing', name: '分块处理', color: 'bg-orange-500' },
      { id: 'incremental', name: '增量计算', color: 'bg-yellow-500' },
      { id: 'memory-optimization', name: '内存优化', color: 'bg-green-500' }
    ],
    learningObjectives: ['分块读取数据', '增量统计', '内存优化'],
    prerequisites: ['Pandas 基础'],
    estimatedTime: 60,
    dataset: { name: '大规模交易数据', description: '模拟5000笔交易', generationCode: 'import pandas as pd\nimport random\nrandom.seed(42)\nproducts = [\'牛奶\',\'面包\',\'鸡蛋\',\'可乐\',\'薯片\',\'饼干\',\'水果\',\'蔬菜\',\'肉品\',\'海鲜\']\ntransactions = []\nfor i in range(5000):\n    n = random.randint(2,5)\n    transactions.append(random.sample(products, n))\ndf = pd.DataFrame({\'Transaction\': range(1,5001), \'Item\': transactions})\nprint(f"生成 {len(transactions)} 笔交易")' },
    starterCode: 'import pandas as pd\nimport numpy as np\nprint("=== 分块处理演示 ===\n# 分块读取\ndf_chunked = np.array_split(df, 5)\nprint(f"分成 {len(df_chunked)} 个块")\n# 增量统计\nitem_counts = {}\nfor chunk in df_chunked:\n    for items in chunk[\'Item\']:\n        for item in items:\n            item_counts[item] = item_counts.get(item, 0) + 1\nprint("商品统计:", item_counts)',
    solutionCode: 'import pandas as pd\nimport numpy as np\nprint("=== 分块处理 ===\ndf_chunked = np.array_split(df, 5)\nitem_counts = {}\nfor i, chunk in enumerate(df_chunked):\n    print(f"处理块 {i+1}")\n    for items in chunk[\'Item\']:\n        for item in items:\n            item_counts[item] = item_counts.get(item, 0) + 1\nprint("最终统计:", sorted(item_counts.items(), key=lambda x: x[1], reverse=True))',
    resultTabs: [
      { id: 'chunk-stats', label: '分块统计', type: 'table' },
      { id: 'final-result', label: '最终结果', type: 'table' }
    ]
  },
  {
    id: 'rfm-kmeans-segmentation',
    order: 6,
    title: '基于 K-Means 的用户价值分群（RFM模型）',
    shortDescription: '使用 RFM 模型和 K-Means 聚类进行用户分群',
    fullDescription: '学习 RFM 模型，使用 K-Means 聚类进行用户价值分群，为精准营销提供支持。',
    difficulty: 'intermediate',
    tags: [
      { id: 'rfm', name: 'RFM', color: 'bg-blue-500' },
      { id: 'kmeans', name: 'K-Means', color: 'bg-purple-500' },
      { id: 'segmentation', name: '用户分群', color: 'bg-pink-500' }
    ],
    learningObjectives: ['RFM计算', 'K-Means聚类', '肘部法则'],
    prerequisites: ['Pandas', 'Scikit-learn'],
    estimatedTime: 75,
    dataset: { name: '用户交易数据', description: '200个用户1年数据', generationCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\nnp.random.seed(42)\nn_users = 200\nuser_ids = [f"U_{i:03d}" for i in range(1,n_users+1)]\ntransactions = []\nfor user in user_ids:\n    n_orders = np.random.randint(1,50)\n    for _ in range(n_orders):\n        date = datetime(2024,1,1) + timedelta(days=np.random.randint(0,365))\n        amount = np.random.uniform(50,2000)\n        transactions.append({\'user_id\': user, \'order_date\': date, \'order_amount\': amount})\ndf = pd.DataFrame(transactions)\nprint(f"生成 {len(df)} 条交易记录")' },
    starterCode: 'import pandas as pd\nimport numpy as np\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nprint("=== RFM计算 ===\nnow = df[\'order_date\'].max() + timedelta(days=1)\nrfm = df.groupby(\'user_id\').agg(\n    Recency=(\'order_date\', lambda x: (now - x.max()).days),\n    Frequency=(\'order_date\', \'count\'),\n    Monetary=(\'order_amount\', \'sum\')\n).reset_index()\nprint("RFM前5行:", rfm.head())',
    solutionCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nnow = df[\'order_date\'].max() + timedelta(days=1)\nrfm = df.groupby(\'user_id\').agg(\n    Recency=(\'order_date\', lambda x: (now - x.max()).days),\n    Frequency=(\'order_date\', \'count\'),\n    Monetary=(\'order_amount\', \'sum\')\n).reset_index()\nscaler = StandardScaler()\nrfm_scaled = scaler.fit_transform(rfm[[\'Recency\',\'Frequency\',\'Monetary\']])\n# 肘部法则\ninertias = []\nfor k in range(2,10):\n    kmeans = KMeans(n_clusters=k, random_state=42)\n    kmeans.fit(rfm_scaled)\n    inertias.append(kmeans.inertia_)\n# 选k=4\nkmeans = KMeans(n_clusters=4, random_state=42)\nrfm[\'Cluster\'] = kmeans.fit_predict(rfm_scaled)\nprint("聚类结果:", rfm.groupby(\'Cluster\').mean())',
    resultTabs: [
      { id: 'rfm-table', label: 'RFM表', type: 'table' },
      { id: 'clusters', label: '聚类结果', type: 'table' },
      { id: 'elbow', label: '肘部法则', type: 'chart' }
    ]
  },
  {
    id: 'hierarchical-product-clustering',
    order: 7,
    title: '层次聚类与商品组合推荐',
    shortDescription: '使用层次聚类进行商品分组，基于聚类结果做商品推荐',
    fullDescription: '学习层次聚类方法，构建商品特征向量，绘制树状图，实现商品推荐。',
    difficulty: 'intermediate',
    tags: [
      { id: 'hierarchical', name: '层次聚类', color: 'bg-indigo-500' },
      { id: 'dendrogram', name: '树状图', color: 'bg-violet-500' },
      { id: 'recommendation', name: '商品推荐', color: 'bg-pink-500' }
    ],
    learningObjectives: ['层次聚类', '树状图', '相似商品推荐'],
    prerequisites: ['Pandas', 'Scikit-learn'],
    estimatedTime: 60,
    dataset: { name: '商品特征数据', description: '20种商品的特征', generationCode: 'import pandas as pd\nimport numpy as np\nnp.random.seed(42)\nproducts = [\'牛奶\',\'面包\',\'鸡蛋\',\'可乐\',\'薯片\',\'饼干\',\'水果\',\'蔬菜\',\'肉品\',\'海鲜\',\'尿布\',\'啤酒\',\'洗发水\',\'牙膏\',\'卫生纸\',\'洗涤剂\',\'咖啡\',\'茶\',\'糖果\',\'巧克力\']\ndf = pd.DataFrame({\n    \'Product\': products,\n    \'Price\': np.random.uniform(5,200,20),\n    \'Sales\': np.random.randint(100,5000,20),\n    \'UniqueUsers\': np.random.randint(50,2000,20),\n    \'ReturnRate\': np.random.uniform(0.01,0.2,20)\n})\nprint("商品数据:", df)' },
    starterCode: 'import pandas as pd\nimport numpy as np\nfrom scipy.cluster.hierarchy import linkage, dendrogram\nimport matplotlib.pyplot as plt\nprint("=== 层次聚类 ===\nX = df[[\'Price\',\'Sales\',\'UniqueUsers\',\'ReturnRate\']]\nZ = linkage(X, method=\'ward\')\nplt.figure(figsize=(12,6))\ndendrogram(Z, labels=df[\'Product\'].values, leaf_rotation=90)\nplt.title(\'商品层次聚类树状图\')\nplt.tight_layout()\nplt.savefig(\'dendrogram.png\')',
    solutionCode: 'import pandas as pd\nimport numpy as np\nfrom scipy.cluster.hierarchy import linkage, dendrogram, fcluster\nimport matplotlib.pyplot as plt\nX = df[[\'Price\',\'Sales\',\'UniqueUsers\',\'ReturnRate\']]\nZ = linkage(X, method=\'ward\')\nplt.figure(figsize=(12,6))\ndendrogram(Z, labels=df[\'Product\'].values, leaf_rotation=90)\nplt.title(\'商品层次聚类树状图\')\nplt.tight_layout()\nplt.savefig(\'dendrogram.png\')\ndf[\'Cluster\'] = fcluster(Z, t=3, criterion=\'maxclust\')\nprint("聚类结果:", df.groupby(\'Cluster\')[\'Product\'].apply(list))',
    resultTabs: [
      { id: 'product-data', label: '商品数据', type: 'table' },
      { id: 'clusters', label: '聚类结果', type: 'table' },
      { id: 'dendrogram', label: '树状图', type: 'chart' }
    ]
  },
  {
    id: 'dbscan-fraud-detection',
    order: 8,
    title: 'DBSCAN 异常交易检测（刷单识别）',
    shortDescription: '使用 DBSCAN 聚类识别异常交易，检测刷单行为',
    fullDescription: '学习基于密度的聚类 DBSCAN，理解参数选择，对比 K-Means 与 DBSCAN。',
    difficulty: 'advanced',
    tags: [
      { id: 'dbscan', name: 'DBSCAN', color: 'bg-red-500' },
      { id: 'anomaly', name: '异常检测', color: 'bg-orange-500' },
      { id: 'fraud', name: '刷单识别', color: 'bg-yellow-500' }
    ],
    learningObjectives: ['DBSCAN', '异常检测', '参数调优'],
    prerequisites: ['Scikit-learn', '聚类基础'],
    estimatedTime: 60,
    dataset: { name: '订单特征数据', description: '正常和刷单订单', generationCode: 'import pandas as pd\nimport numpy as np\nnp.random.seed(42)\nn_normal = 500\nn_fraud = 50\nnormal = pd.DataFrame({\n    \'Amount\': np.random.normal(200, 100, n_normal),\n    \'Frequency\': np.random.normal(5, 2, n_normal),\n    \'AvgInterval\': np.random.normal(7, 3, n_normal),\n    \'Label\': 0\n})\nfraud = pd.DataFrame({\n    \'Amount\': np.random.normal(500, 200, n_fraud),\n    \'Frequency\': np.random.normal(20, 5, n_fraud),\n    \'AvgInterval\': np.random.normal(1, 0.5, n_fraud),\n    \'Label\': 1\n})\ndf = pd.concat([normal, fraud], ignore_index=True)\nprint("数据形状:", df.shape)' },
    starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import DBSCAN, KMeans\nfrom sklearn.preprocessing import StandardScaler\nprint("=== DBSCAN异常检测 ===\nX = df[[\'Amount\',\'Frequency\',\'AvgInterval\']]\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\ndbscan = DBSCAN(eps=0.5, min_samples=5)\ndf[\'DBSCAN_Cluster\'] = dbscan.fit_predict(X_scaled)\ndf[\'IsAnomaly\'] = df[\'DBSCAN_Cluster\'] == -1\nprint("异常样本数:", df[\'IsAnomaly\'].sum())',
    solutionCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nfrom sklearn.cluster import DBSCAN, KMeans\nfrom sklearn.preprocessing import StandardScaler\nX = df[[\'Amount\',\'Frequency\',\'AvgInterval\']]\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\ndbscan = DBSCAN(eps=0.5, min_samples=5)\ndf[\'DBSCAN_Cluster\'] = dbscan.fit_predict(X_scaled)\ndf[\'IsAnomaly\'] = df[\'DBSCAN_Cluster\'] == -1\nprint("异常样本数:", df[\'IsAnomaly\'].sum())\nprint("异常样本详情:", df[df[\'IsAnomaly\']].head())',
    resultTabs: [
      { id: 'data', label: '数据预览', type: 'table' },
      { id: 'anomalies', label: '异常样本', type: 'table' },
      { id: 'visualization', label: '可视化', type: 'chart' }
    ]
  },
  {
    id: 'cluster-aware-basket-recommendation',
    order: 9,
    title: '结合聚类的购物车捆绑销售策略',
    shortDescription: '先分群再挖掘关联规则，实现个性化商品推荐',
    fullDescription: '综合运用聚类和关联规则，按用户分群挖掘不同的规则，实现个性化推荐。',
    difficulty: 'advanced',
    tags: [
      { id: 'combined', name: '聚类+关联', color: 'bg-purple-500' },
      { id: 'personalized', name: '个性化推荐', color: 'bg-pink-500' },
      { id: 'bundling', name: '捆绑销售', color: 'bg-red-500' }
    ],
    learningObjectives: ['先分群后分析', '差异化规则', '个性化推荐'],
    prerequisites: ['聚类', '关联规则'],
    estimatedTime: 90,
    dataset: { name: '综合数据', description: '用户分群和购物篮数据', generationCode: 'import pandas as pd\nimport numpy as np\nimport random\nnp.random.seed(42)\n# 用户分群\nusers = [f"U_{i:03d}" for i in range(1,201)]\nclusters = np.random.randint(0,4,200)\nuser_cluster = pd.DataFrame({\'user_id\': users, \'cluster\': clusters})\n# 购物篮\nproducts = [\'牛奶\',\'面包\',\'鸡蛋\',\'可乐\',\'薯片\',\'饼干\',\'水果\',\'蔬菜\',\'肉品\',\'海鲜\']\ntransactions = []\nfor user in users:\n    n_orders = np.random.randint(1,10)\n    for _ in range(n_orders):\n        n_items = random.randint(2,4)\n        items = random.sample(products, n_items)\n        transactions.append({\'user_id\': user, \'items\': items})\nbaskets = pd.DataFrame(transactions)\nprint("用户数:", len(user_cluster), "交易数:", len(baskets))' },
    starterCode: 'import pandas as pd\nfrom mlxtend.preprocessing import TransactionEncoder\nfrom mlxtend.frequent_patterns import apriori, association_rules\nprint("=== 分群关联规则 ===\n# 合并数据\ndf_merged = baskets.merge(user_cluster, on=\'user_id\')\n# 按群分析\nfor c in range(4):\n    print(f"\\n=== 群 {c} ===")\n    cluster_baskets = df_merged[df_merged[\'cluster\'] == c][\'items\'].tolist()\n    te = TransactionEncoder()\n    te_ary = te.fit(cluster_baskets).transform(cluster_baskets)\n    df_enc = pd.DataFrame(te_ary, columns=te.columns_)\n    freq = apriori(df_enc, min_support=0.1, use_colnames=True)\n    rules = association_rules(freq, metric="confidence", min_threshold=0.5)\n    print(f"规则数: {len(rules)}")',
    solutionCode: 'import pandas as pd\nfrom mlxtend.preprocessing import TransactionEncoder\nfrom mlxtend.frequent_patterns import apriori, association_rules\n# 合并数据\ndf_merged = baskets.merge(user_cluster, on=\'user_id\')\ncluster_rules = {}\nfor c in range(4):\n    cluster_baskets = df_merged[df_merged[\'cluster\'] == c][\'items\'].tolist()\n    te = TransactionEncoder()\n    te_ary = te.fit(cluster_baskets).transform(cluster_baskets)\n    df_enc = pd.DataFrame(te_ary, columns=te.columns_)\n    freq = apriori(df_enc, min_support=0.1, use_colnames=True)\n    rules = association_rules(freq, metric="confidence", min_threshold=0.5)\n    cluster_rules[c] = rules\nprint("各群规则数:", {c: len(r) for c, r in cluster_rules.items()})',
    resultTabs: [
      { id: 'cluster-overview', label: '分群概览', type: 'table' },
      { id: 'rules-by-cluster', label: '各群规则', type: 'table' },
      { id: 'comparison', label: '规则对比', type: 'chart' }
    ]
  },
  {
    id: 'complete-operations-dashboard',
    order: 10,
    title: '完整用户运营数据分析看板',
    shortDescription: '综合运用所有技能，完成端到端的用户运营分析',
    fullDescription: '综合运用前面9个项目的技能，完成从数据清洗到报告生成的完整流程，构建数据分析看板。',
    difficulty: 'expert',
    tags: [
      { id: 'end-to-end', name: '端到端', color: 'bg-blue-500' },
      { id: 'dashboard', name: '看板', color: 'bg-green-500' },
      { id: 'comprehensive', name: '综合项目', color: 'bg-purple-500' }
    ],
    learningObjectives: ['综合应用', '完整流程', '看板构建'],
    prerequisites: ['前9个项目'],
    estimatedTime: 120,
    dataset: { name: '完整电商数据', description: '用户、订单、商品数据', generationCode: 'import pandas as pd\nimport numpy as np\nfrom datetime import datetime, timedelta\nnp.random.seed(42)\n# 用户表\nusers = pd.DataFrame({\'user_id\': [f"U_{i:03d}" for i in range(1,201)]})\n# 订单表\norders = []\nfor user in users[\'user_id\']:\n    n = np.random.randint(1,50)\n    for _ in range(n):\n        date = datetime(2024,1,1) + timedelta(days=np.random.randint(0,365))\n        amount = np.random.uniform(50,2000)\n        orders.append({\'user_id\': user, \'order_date\': date, \'amount\': amount})\norders = pd.DataFrame(orders)\nprint("用户数:", len(users), "订单数:", len(orders))' },
    starterCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nprint("=== 完整分析流程 ===\n# 1. 数据清洗\nprint("数据清洗中...")\n# 2. RFM\nnow = orders[\'order_date\'].max() + timedelta(days=1)\nrfm = orders.groupby(\'user_id\').agg(\n    Recency=(\'order_date\', lambda x: (now - x.max()).days),\n    Frequency=(\'order_date\', \'count\'),\n    Monetary=(\'amount\', \'sum\')\n).reset_index()\n# 3. KPI\nprint("总销售额:", orders[\'amount\'].sum())\nprint("订单数:", len(orders))\nprint("用户数:", orders[\'user_id\'].nunique())',
    solutionCode: 'import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n# 完整分析流程\nprint("=== 完整运营分析 ===\n# 1. KPI\nprint("总销售额: ¥{:,.2f}".format(orders[\'amount\'].sum()))\nprint("总订单数:", len(orders))\nprint("活跃用户数:", orders[\'user_id\'].nunique())\nprint("客单价: ¥{:,.2f}".format(orders[\'amount\'].sum()/len(orders)))\n# 2. 时间趋势\norders[\'month\'] = orders[\'order_date\'].dt.to_period(\'M\')\nmonthly = orders.groupby(\'month\')[\'amount\'].sum()\nprint("月度销售额:", monthly)\n# 3. RFM\nnow = orders[\'order_date\'].max() + timedelta(days=1)\nrfm = orders.groupby(\'user_id\').agg(\n    Recency=(\'order_date\', lambda x: (now - x.max()).days),\n    Frequency=(\'order_date\', \'count\'),\n    Monetary=(\'amount\', \'sum\')\n).reset_index()\nprint("RFM统计:", rfm.describe())\nprint("\\n分析完成！")',
    resultTabs: [
      { id: 'kpi', label: 'KPI', type: 'table' },
      { id: 'trends', label: '趋势分析', type: 'chart' },
      { id: 'rfm', label: 'RFM分析', type: 'table' },
      { id: 'summary', label: '总结报告', type: 'markdown' }
    ]
  }
]
