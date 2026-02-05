import type { CalculatorType } from '../types';

export interface NavItem {
  id: CalculatorType;
  label: string;
  icon: string;
  description: string;
  color?: string;
}

export const navItems: NavItem[] = [
  {
    id: 'bmi',
    label: 'BMI 计算器',
    icon: 'Scale',
    description: '身体质量指数计算',
    color: 'emerald',
  },
  {
    id: 'bmr',
    label: 'BMR/TDEE',
    icon: 'Flame',
    description: '基础代谢与每日消耗',
    color: 'orange',
  },
  {
    id: 'bodyfat',
    label: '体脂率',
    icon: 'Ruler',
    description: '身体脂肪百分比估算',
    color: 'blue',
  },
  {
    id: 'whr',
    label: '腰臀比',
    icon: 'Proportions',
    description: '腰臀比例与健康风险',
    color: 'purple',
  },
  {
    id: 'exercise',
    label: '运动消耗',
    icon: 'Activity',
    description: '运动卡路里计算',
    color: 'red',
  },
  {
    id: 'water',
    label: '饮水量',
    icon: 'Droplets',
    description: '每日饮水建议',
    color: 'cyan',
  },
  {
    id: 'nutrition',
    label: '营养计划',
    icon: 'Salad',
    description: '个性化饮食方案',
    color: 'green',
  },
  {
    id: 'report',
    label: '健康报告',
    icon: 'ChartPie',
    description: '综合健康分析',
    color: 'indigo',
  },
  {
    id: 'history',
    label: '历史记录',
    icon: 'History',
    description: '查看计算历史',
    color: 'gray',
  },
];

export const getNavItemById = (id: CalculatorType): NavItem | undefined => {
  return navItems.find(item => item.id === id);
};

export const getIconColorClass = (color?: string): string => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
    gray: 'bg-gray-500',
  };
  return colorMap[color || 'emerald'];
};
