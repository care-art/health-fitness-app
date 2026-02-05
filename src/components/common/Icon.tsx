import React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  color?: string;
  strokeWidth?: number;
  variant?: 'outline' | 'filled' | 'duotone';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className = '',
  color,
  strokeWidth = 2.5,
  // variant = 'outline', // Reserved for future use
}) => {
  const LucideIcon = LucideIcons[name] as LucideIcon;
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  const iconSize = typeof size === 'string' ? sizeMap[size] : size;

  return (
    <LucideIcon 
      size={iconSize} 
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

// Icon with background container for better visibility
interface IconBoxProps extends Omit<IconProps, 'size'> {
  boxSize?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  iconColor?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const boxSizeMap = {
  sm: { box: 32, icon: 16 },
  md: { box: 40, icon: 20 },
  lg: { box: 48, icon: 24 },
  xl: { box: 64, icon: 32 },
};

const roundedMap = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export const IconBox: React.FC<IconBoxProps> = ({ 
  name,
  boxSize = 'md',
  bgColor = 'bg-gray-100',
  iconColor,
  rounded = 'lg',
  className = '',
  ...props
}) => {
  const sizes = boxSizeMap[boxSize];
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center
        ${bgColor}
        ${roundedMap[rounded]}
        ${className}
      `}
      style={{ width: sizes.box, height: sizes.box }}
    >
      <Icon 
        name={name} 
        size={sizes.icon} 
        color={iconColor}
        strokeWidth={2.5}
        {...props} 
      />
    </div>
  );
};

// Common icon presets for the health app - 使用更易辨认的图标
export const AppIcons = {
  // Navigation - 使用更直观的图标
  bmi: 'Scale',           // 体重秤
  bmr: 'Flame',           // 火焰表示热量
  bodyfat: 'Percent',     // 百分比表示体脂
  whr: 'MoveDiagonal',    // 对角线表示比例
  exercise: 'Dumbbell',   // 哑铃表示运动
  water: 'GlassWater',    // 水杯表示饮水
  nutrition: 'Apple',     // 苹果表示营养
  report: 'FileText',     // 文档表示报告
  history: 'Clock',       // 时钟表示历史
  
  // Actions
  calculate: 'Calculator',
  reset: 'RotateCcw',
  save: 'Save',
  delete: 'Trash2',
  edit: 'Pencil',
  close: 'X',
  menu: 'Menu',
  back: 'ArrowLeft',
  forward: 'ArrowRight',
  
  // Status - 使用填充感更强的图标
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle',
  info: 'Info',
  
  // Health
  heart: 'Heart',
  weight: 'Weight',
  height: 'Ruler',
  age: 'Calendar',
  gender: 'Users',
  fire: 'Flame',
  clock: 'Clock',
  target: 'Target',
  trend: 'TrendingUp',
  
  // Misc
  settings: 'Settings',
  help: 'HelpCircle',
  search: 'Search',
  filter: 'Filter',
  download: 'Download',
  share: 'Share2',
  print: 'Printer',
} as const;

// Helper component for app-specific icons
interface AppIconProps extends Omit<IconProps, 'name'> {
  type: keyof typeof AppIcons;
}

export const AppIcon: React.FC<AppIconProps> = ({ type, ...props }) => {
  return <Icon name={AppIcons[type]} {...props} />;
};

// App icon with background box
interface AppIconBoxProps extends Omit<IconBoxProps, 'name'> {
  type: keyof typeof AppIcons;
}

export const AppIconBox: React.FC<AppIconBoxProps> = ({ type, ...props }) => {
  return <IconBox name={AppIcons[type]} {...props} />;
};

// Color mappings for different app sections
export const iconColorMap: Record<string, { bg: string; icon: string }> = {
  bmi: { bg: 'bg-emerald-100', icon: '#059669' },
  bmr: { bg: 'bg-orange-100', icon: '#ea580c' },
  bodyfat: { bg: 'bg-blue-100', icon: '#2563eb' },
  whr: { bg: 'bg-purple-100', icon: '#7c3aed' },
  exercise: { bg: 'bg-red-100', icon: '#dc2626' },
  water: { bg: 'bg-cyan-100', icon: '#0891b2' },
  nutrition: { bg: 'bg-green-100', icon: '#16a34a' },
  report: { bg: 'bg-indigo-100', icon: '#4f46e5' },
  history: { bg: 'bg-gray-100', icon: '#4b5563' },
};

// Pre-styled app icon component
interface StyledAppIconProps {
  type: keyof typeof AppIcons;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StyledAppIcon: React.FC<StyledAppIconProps> = ({ 
  type, 
  size = 'md',
  className = '',
}) => {
  const colors = iconColorMap[type] || { bg: 'bg-gray-100', icon: '#6b7280' };
  
  return (
    <IconBox
      name={AppIcons[type]}
      boxSize={size}
      bgColor={colors.bg}
      iconColor={colors.icon}
      rounded="lg"
      className={className}
    />
  );
};
