export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: string;
}

export interface UserAchievement {
  userId: string;
  badges: {
    badgeId: string;
    obtainedAt: string;
  }[];
  points: number;
  level: number;
  completedCourses: string[];
  totalLearningTime: number; // 分钟
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: number;
  rank: number;
}

export const badges: Badge[] = [
  {
    id: 'badge1',
    name: '初学者',
    description: '完成第一个Python课程',
    icon: '🎯',
    rarity: 'common',
    condition: '完成Python基础入门课程'
  },
  {
    id: 'badge2',
    name: '数据分析新手',
    description: '完成数据分析库应用课程',
    icon: '📊',
    rarity: 'uncommon',
    condition: '完成数据分析库应用课程'
  },
  {
    id: 'badge3',
    name: '可视化大师',
    description: '完成数据可视化课程',
    icon: '📈',
    rarity: 'rare',
    condition: '完成数据可视化课程'
  },
  {
    id: 'badge4',
    name: '商务分析师',
    description: '完成商务数据分析实战课程',
    icon: '💼',
    rarity: 'epic',
    condition: '完成商务数据分析实战课程'
  },
  {
    id: 'badge5',
    name: '练习达人',
    description: '完成10个练习',
    icon: '🏋️',
    rarity: 'uncommon',
    condition: '完成10个练习'
  },
  {
    id: 'badge6',
    name: '测试高手',
    description: '通过5个测试',
    icon: '🎓',
    rarity: 'rare',
    condition: '通过5个测试'
  },
  {
    id: 'badge7',
    name: '学习先锋',
    description: '连续学习7天',
    icon: '🔥',
    rarity: 'legendary',
    condition: '连续学习7天'
  }
];

export const getUserAchievements = (userId: string): UserAchievement => {
  // 模拟用户成就数据
  return {
    userId,
    badges: [
      {
        badgeId: 'badge1',
        obtainedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        badgeId: 'badge2',
        obtainedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        badgeId: 'badge5',
        obtainedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    points: 1250,
    level: 3,
    completedCourses: ['1', '2'],
    totalLearningTime: 1200 // 20小时
  };
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  // 模拟排行榜数据
  return [
    {
      userId: '1',
      username: '张三',
      points: 3200,
      level: 5,
      rank: 1
    },
    {
      userId: '2',
      username: '李四',
      points: 2800,
      level: 4,
      rank: 2
    },
    {
      userId: '3',
      username: '王五',
      points: 2500,
      level: 4,
      rank: 3
    },
    {
      userId: '4',
      username: '赵六',
      points: 1800,
      level: 3,
      rank: 4
    },
    {
      userId: '5',
      username: '孙七',
      points: 1250,
      level: 3,
      rank: 5
    }
  ];
};

export const getBadgeById = (id: string): Badge | undefined => {
  return badges.find(badge => badge.id === id);
};