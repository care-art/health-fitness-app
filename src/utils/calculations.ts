import type {
  BMIInput,
  BMIResult,
  BMICategory,
  BMICategoryInfo,
  BMRInput,
  BMRResult,
  TDEEInput,
  TDEEResult,
  ActivityLevel,
  ActivityLevelInfo,
  BodyFatInput,
  BodyFatResult,
  WHRInput,
  WHRResult,
  ExerciseInput,
  ExerciseResult,
  WaterInput,
  WaterResult,
  GoalType,
  NutritionPlan,
} from '../types';

// ==================== BMI Calculations ====================

export const bmiCategories: BMICategoryInfo[] = [
  {
    category: 'underweight',
    label: '偏瘦',
    min: 0,
    max: 18.5,
    color: '#3b82f6',
    recommendation: '建议适当增加营养摄入，进行力量训练以增加肌肉量。咨询营养师制定增重计划。',
  },
  {
    category: 'normal',
    label: '正常',
    min: 18.5,
    max: 24.9,
    color: '#10b981',
    recommendation: '恭喜！您的体重在健康范围内。保持均衡饮食和规律运动，维持当前状态。',
  },
  {
    category: 'overweight',
    label: '超重',
    min: 25,
    max: 29.9,
    color: '#f59e0b',
    recommendation: '建议控制饮食热量，增加有氧运动。每周至少150分钟中等强度运动。',
  },
  {
    category: 'obese',
    label: '肥胖',
    min: 30,
    max: null,
    color: '#ef4444',
    recommendation: '建议咨询医生制定减重计划。控制饮食、增加运动，关注血压血糖指标。',
  },
];

export function calculateBMI(input: BMIInput): BMIResult {
  const { height, weight, unit } = input;
  
  let bmi: number;
  
  if (unit === 'metric') {
    // BMI = weight(kg) / height(m)^2
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    // BMI = 703 * weight(lbs) / height(in)^2
    bmi = (703 * weight) / (height * height);
  }
  
  const category = getBMICategory(bmi);
  const categoryInfo = bmiCategories.find(c => c.category === category)!;
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    recommendation: categoryInfo.recommendation,
  };
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function getBMICategoryInfo(category: BMICategory): BMICategoryInfo {
  return bmiCategories.find(c => c.category === category)!;
}

export function getIdealWeightRange(height: number, unit: 'metric' | 'imperial'): { min: number; max: number } {
  if (unit === 'metric') {
    const heightInMeters = height / 100;
    return {
      min: Math.round(18.5 * heightInMeters * heightInMeters * 10) / 10,
      max: Math.round(24.9 * heightInMeters * heightInMeters * 10) / 10,
    };
  } else {
    return {
      min: Math.round((18.5 * height * height) / 703 * 10) / 10,
      max: Math.round((24.9 * height * height) / 703 * 10) / 10,
    };
  }
}

// ==================== BMR & TDEE Calculations ====================

export const activityLevels: ActivityLevelInfo[] = [
  {
    value: 'sedentary',
    label: '久坐不动',
    multiplier: 1.2,
    description: '很少或不运动',
  },
  {
    value: 'lightly_active',
    label: '轻度活动',
    multiplier: 1.375,
    description: '每周轻度运动1-3天',
  },
  {
    value: 'moderately_active',
    label: '中度活动',
    multiplier: 1.55,
    description: '每周中度运动3-5天',
  },
  {
    value: 'very_active',
    label: '高度活动',
    multiplier: 1.725,
    description: '每周高强度运动6-7天',
  },
  {
    value: 'extremely_active',
    label: '极高活动',
    multiplier: 1.9,
    description: '每天高强度运动或体力工作',
  },
];

export function calculateBMR(input: BMRInput): BMRResult {
  const { gender, age, weight, height } = input;
  
  // Mifflin-St Jeor Equation
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  return {
    bmr: Math.round(bmr),
  };
}

export function calculateTDEE(input: TDEEInput): TDEEResult {
  const { activityLevel } = input;
  const { bmr } = calculateBMR(input);
  
  const activityMultiplier = activityLevels.find(
    level => level.value === activityLevel
  )?.multiplier || 1.2;
  
  return {
    bmr,
    tdee: Math.round(bmr * activityMultiplier),
  };
}

export function getActivityLevelInfo(level: ActivityLevel): ActivityLevelInfo {
  return activityLevels.find(l => l.value === level)!;
}

// ==================== Body Fat Calculations ====================

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const { gender, waist, neck, hip, height } = input;
  
  // US Navy Method
  let bodyFatPercentage: number;
  
  if (gender === 'male') {
    // Men: %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const logWaistNeck = Math.log10(waist - neck);
    const logHeight = Math.log10(height);
    bodyFatPercentage = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
  } else {
    // Women: %BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    if (!hip) throw new Error('女性计算需要臀围数据');
    const logWaistHipNeck = Math.log10(waist + hip - neck);
    const logHeight = Math.log10(height);
    bodyFatPercentage = 495 / (1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight) - 450;
  }
  
  const category = getBodyFatCategory(bodyFatPercentage, gender);
  
  return {
    bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
    category,
  };
}

export function getBodyFatCategory(percentage: number, gender: 'male' | 'female'): BodyFatResult['category'] {
  if (gender === 'male') {
    if (percentage < 6) return 'essential';
    if (percentage < 14) return 'athletes';
    if (percentage < 18) return 'fitness';
    if (percentage < 25) return 'average';
    return 'obese';
  } else {
    if (percentage < 14) return 'essential';
    if (percentage < 21) return 'athletes';
    if (percentage < 25) return 'fitness';
    if (percentage < 32) return 'average';
    return 'obese';
  }
}

export function getBodyFatCategoryLabel(category: BodyFatResult['category']): string {
  const labels: Record<BodyFatResult['category'], string> = {
    essential: '必需脂肪',
    athletes: '运动员',
    fitness: '健康',
    average: '平均',
    obese: '肥胖',
  };
  return labels[category];
}

// ==================== WHR Calculations ====================

export function calculateWHR(input: WHRInput): WHRResult {
  const { gender, waist, hip } = input;
  
  const whr = waist / hip;
  
  let riskLevel: WHRResult['riskLevel'];
  
  if (gender === 'male') {
    if (whr < 0.9) riskLevel = 'low';
    else if (whr <= 1.0) riskLevel = 'moderate';
    else riskLevel = 'high';
  } else {
    if (whr < 0.85) riskLevel = 'low';
    else if (whr <= 0.95) riskLevel = 'moderate';
    else riskLevel = 'high';
  }
  
  return {
    whr: Math.round(whr * 100) / 100,
    riskLevel,
  };
}

export function getWHRRiskLabel(riskLevel: WHRResult['riskLevel']): string {
  const labels: Record<WHRResult['riskLevel'], string> = {
    low: '低风险',
    moderate: '中等风险',
    high: '高风险',
  };
  return labels[riskLevel];
}

export function getWHRRecommendation(riskLevel: WHRResult['riskLevel']): string {
  const recommendations: Record<WHRResult['riskLevel'], string> = {
    low: '您的腰臀比处于健康范围，继续保持！',
    moderate: '建议通过有氧运动和核心训练减少腹部脂肪。',
    high: '建议咨询医生，制定减腹计划，降低心血管疾病风险。',
  };
  return recommendations[riskLevel];
}

// ==================== Exercise Calculations ====================

export const metActivities = [
  { name: '静坐', met: 1.0, category: '日常' },
  { name: '慢走(4km/h)', met: 2.5, category: '日常' },
  { name: '快走(6km/h)', met: 3.5, category: '有氧' },
  { name: '慢跑(8km/h)', met: 8.0, category: '有氧' },
  { name: '跑步(10km/h)', met: 10.0, category: '有氧' },
  { name: '跑步(12km/h)', met: 12.5, category: '有氧' },
  { name: '游泳(慢速)', met: 6.0, category: '有氧' },
  { name: '游泳(中速)', met: 8.0, category: '有氧' },
  { name: '游泳(快速)', met: 10.0, category: '有氧' },
  { name: '骑行(慢速)', met: 4.0, category: '有氧' },
  { name: '骑行(中速)', met: 8.0, category: '有氧' },
  { name: '骑行(快速)', met: 12.0, category: '有氧' },
  { name: '瑜伽', met: 2.5, category: '柔韧' },
  { name: '普拉提', met: 3.0, category: '柔韧' },
  { name: '力量训练', met: 5.0, category: '力量' },
  { name: '高强度间歇训练(HIIT)', met: 11.0, category: '高强度' },
  { name: '跳绳', met: 10.0, category: '有氧' },
  { name: '篮球', met: 6.5, category: '球类' },
  { name: '足球', met: 7.0, category: '球类' },
  { name: '羽毛球', met: 5.5, category: '球类' },
  { name: '乒乓球', met: 4.0, category: '球类' },
  { name: '网球', met: 7.0, category: '球类' },
  { name: '登山', met: 6.5, category: '户外' },
  { name: '滑雪', met: 7.0, category: '户外' },
  { name: '滑冰', met: 7.0, category: '户外' },
];

export function calculateExerciseCalories(input: ExerciseInput): ExerciseResult {
  const { activity, duration, weight } = input;
  
  const met = metActivities.find(a => a.name === activity)?.met || 5;
  
  // Calories = MET * weight(kg) * time(hours)
  const caloriesBurned = met * weight * (duration / 60);
  
  return {
    caloriesBurned: Math.round(caloriesBurned),
    met,
  };
}

// ==================== Water Intake Calculations ====================

export function calculateWaterIntake(input: WaterInput): WaterResult {
  const { weight, activityLevel, climate } = input;
  
  // Base: 35ml per kg
  let dailyIntake = weight * 35;
  
  // Activity adjustment
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1,
    lightly_active: 1.1,
    moderately_active: 1.2,
    very_active: 1.3,
    extremely_active: 1.4,
  };
  
  dailyIntake *= activityMultipliers[activityLevel];
  
  // Climate adjustment
  const climateMultipliers = {
    temperate: 1,
    hot: 1.2,
    cold: 0.9,
  };
  
  dailyIntake *= climateMultipliers[climate];
  
  // Convert to glasses (250ml per glass)
  const glasses = Math.round(dailyIntake / 250);
  
  return {
    dailyIntake: Math.round(dailyIntake),
    glasses,
  };
}

// ==================== Nutrition Plan ====================

export function generateNutritionPlan(tdee: number, goal: GoalType): NutritionPlan {
  let targetCalories: number;
  let proteinRatio: number;
  let carbsRatio: number;
  let fatRatio: number;
  
  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500; // 500 calorie deficit
      proteinRatio = 0.35;
      carbsRatio = 0.30;
      fatRatio = 0.35;
      break;
    case 'gain':
      targetCalories = tdee + 300; // 300 calorie surplus
      proteinRatio = 0.30;
      carbsRatio = 0.50;
      fatRatio = 0.20;
      break;
    case 'maintain':
    default:
      targetCalories = tdee;
      proteinRatio = 0.25;
      carbsRatio = 0.45;
      fatRatio = 0.30;
      break;
  }
  
  const protein = Math.round((targetCalories * proteinRatio) / 4); // 4 calories per gram
  const carbs = Math.round((targetCalories * carbsRatio) / 4);
  const fat = Math.round((targetCalories * fatRatio) / 9); // 9 calories per gram
  
  // Meal distribution
  const meals: NutritionPlan['meals'] = [
    {
      name: '早餐',
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.25),
      suggestions: goal === 'lose' 
        ? ['燕麦粥', '水煮蛋', '无糖豆浆', '全麦面包']
        : goal === 'gain'
        ? ['全麦面包配花生酱', '鸡蛋', '牛奶', '香蕉']
        : ['全麦面包', '鸡蛋', '牛奶', '水果'],
    },
    {
      name: '午餐',
      calories: Math.round(targetCalories * 0.40),
      protein: Math.round(protein * 0.40),
      carbs: Math.round(carbs * 0.40),
      fat: Math.round(fat * 0.40),
      suggestions: goal === 'lose'
        ? ['鸡胸肉/鱼肉', '糙米饭(小份)', '大量蔬菜', '清汤']
        : goal === 'gain'
        ? ['牛肉/鸡肉', '糙米饭(大份)', '蔬菜', '汤']
        : ['瘦肉/鱼肉', '米饭', '蔬菜', '汤'],
    },
    {
      name: '晚餐',
      calories: Math.round(targetCalories * 0.30),
      protein: Math.round(protein * 0.30),
      carbs: Math.round(carbs * 0.30),
      fat: Math.round(fat * 0.30),
      suggestions: goal === 'lose'
        ? ['鱼肉/豆腐', '蔬菜沙拉', '少量主食', '避免油腻']
        : goal === 'gain'
        ? ['鸡胸肉/鱼肉', '红薯/土豆', '蔬菜', '牛奶']
        : ['瘦肉/鱼肉', '主食', '蔬菜', '适量油脂'],
    },
    {
      name: '加餐',
      calories: Math.round(targetCalories * 0.05),
      protein: Math.round(protein * 0.05),
      carbs: Math.round(carbs * 0.05),
      fat: Math.round(fat * 0.05),
      suggestions: goal === 'lose'
        ? ['坚果(少量)', '无糖酸奶', '水果']
        : goal === 'gain'
        ? ['坚果', '酸奶', '水果', '蛋白粉']
        : ['坚果', '酸奶', '水果'],
    },
  ];
  
  return {
    calories: targetCalories,
    protein,
    carbs,
    fat,
    meals,
  };
}

// ==================== Utility Functions ====================

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

export function validatePositiveNumber(value: number, fieldName: string): string | null {
  if (isNaN(value) || value <= 0) {
    return `${fieldName}必须大于0`;
  }
  return null;
}

export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (isNaN(value) || value < min || value > max) {
    return `${fieldName}必须在${min}-${max}之间`;
  }
  return null;
}
