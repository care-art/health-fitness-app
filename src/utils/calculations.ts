import type {
  BMIInput,
  BMIResult,
  BMICategory,
  BMRInput,
  BMRResult,
  TDEEInput,
  TDEEResult,
  ActivityLevel,
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

export const bmiCategories: {
  category: BMICategory;
  min: number;
  max: number | null;
  color: string;
}[] = [
  { category: 'underweight', min: 0, max: 18.5, color: '#3b82f6' },
  { category: 'normal', min: 18.5, max: 24.9, color: '#10b981' },
  { category: 'overweight', min: 25, max: 29.9, color: '#f59e0b' },
  { category: 'obese', min: 30, max: null, color: '#ef4444' },
];

export function calculateBMI(input: BMIInput): BMIResult {
  const { height, weight, unit } = input;

  let bmi: number;

  if (unit === 'metric') {
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    bmi = (703 * weight) / (height * height);
  }

  const category = getBMICategory(bmi);

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
  };
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function getBMICategoryInfo(category: BMICategory) {
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

export const activityLevels: {
  value: ActivityLevel;
  multiplier: number;
}[] = [
  { value: 'sedentary', multiplier: 1.2 },
  { value: 'lightly_active', multiplier: 1.375 },
  { value: 'moderately_active', multiplier: 1.55 },
  { value: 'very_active', multiplier: 1.725 },
  { value: 'extremely_active', multiplier: 1.9 },
];

export function calculateBMR(input: BMRInput): BMRResult {
  const { gender, age, weight, height } = input;

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

export function getActivityMultiplier(level: ActivityLevel): number {
  return activityLevels.find(l => l.value === level)?.multiplier || 1.2;
}

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const { gender, waist, neck, hip, height } = input;

  let bodyFatPercentage: number;

  if (gender === 'male') {
    const logWaistNeck = Math.log10(waist - neck);
    const logHeight = Math.log10(height);
    bodyFatPercentage = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
  } else {
    if (!hip) throw new Error('Hip measurement required for female calculation');
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

export function calculateExerciseCalories(input: ExerciseInput): ExerciseResult {
  const { activity, duration, weight } = input;

  const met = metActivities.find(a => a.name === activity)?.met || 5;
  const caloriesBurned = met * weight * (duration / 60);

  return {
    caloriesBurned: Math.round(caloriesBurned),
    met,
  };
}

export const metActivities = [
  { name: '静坐', met: 1.0, category: 'daily' },
  { name: '慢走(4km/h)', met: 2.5, category: 'cardio' },
  { name: '快走(6km/h)', met: 3.5, category: 'cardio' },
  { name: '慢跑(8km/h)', met: 8.0, category: 'cardio' },
  { name: '跑步(10km/h)', met: 10.0, category: 'cardio' },
  { name: '跑步(12km/h)', met: 12.5, category: 'cardio' },
  { name: '游泳(慢速)', met: 6.0, category: 'cardio' },
  { name: '游泳(中速)', met: 8.0, category: 'cardio' },
  { name: '游泳(快速)', met: 10.0, category: 'cardio' },
  { name: '骑行(慢速)', met: 4.0, category: 'cardio' },
  { name: '骑行(中速)', met: 8.0, category: 'cardio' },
  { name: '骑行(快速)', met: 12.0, category: 'cardio' },
  { name: '瑜伽', met: 2.5, category: 'flexibility' },
  { name: '普拉提', met: 3.0, category: 'flexibility' },
  { name: '力量训练', met: 5.0, category: 'strength' },
  { name: '高强度间歇训练(HIIT)', met: 11.0, category: 'hiit' },
  { name: '跳绳', met: 10.0, category: 'cardio' },
  { name: '篮球', met: 6.5, category: 'sports' },
  { name: '足球', met: 7.0, category: 'sports' },
  { name: '羽毛球', met: 5.5, category: 'sports' },
  { name: '乒乓球', met: 4.0, category: 'sports' },
  { name: '网球', met: 7.0, category: 'sports' },
  { name: '登山', met: 6.5, category: 'outdoor' },
  { name: '滑雪', met: 7.0, category: 'outdoor' },
  { name: '滑冰', met: 7.0, category: 'outdoor' },
];

export function calculateWaterIntake(input: WaterInput): WaterResult {
  const { weight, activityLevel, climate } = input;

  let dailyIntake = weight * 35;

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1,
    lightly_active: 1.1,
    moderately_active: 1.2,
    very_active: 1.3,
    extremely_active: 1.4,
  };

  dailyIntake *= activityMultipliers[activityLevel];

  const climateMultipliers = {
    temperate: 1,
    hot: 1.2,
    cold: 0.9,
  };

  dailyIntake *= climateMultipliers[climate];

  const glasses = Math.round(dailyIntake / 250);

  return {
    dailyIntake: Math.round(dailyIntake),
    glasses,
  };
}

export function generateNutritionPlan(tdee: number, goal: GoalType): NutritionPlan {
  let targetCalories: number;
  let proteinRatio: number;
  let carbsRatio: number;
  let fatRatio: number;

  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500;
      proteinRatio = 0.35;
      carbsRatio = 0.30;
      fatRatio = 0.35;
      break;
    case 'gain':
      targetCalories = tdee + 300;
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

  const protein = Math.round((targetCalories * proteinRatio) / 4);
  const carbs = Math.round((targetCalories * carbsRatio) / 4);
  const fat = Math.round((targetCalories * fatRatio) / 9);

  const meals: NutritionPlan['meals'] = [
    {
      name: 'breakfast',
      calories: Math.round(targetCalories * 0.25),
      protein: Math.round(protein * 0.25),
      carbs: Math.round(carbs * 0.25),
      fat: Math.round(fat * 0.25),
      suggestions: [],
    },
    {
      name: 'lunch',
      calories: Math.round(targetCalories * 0.40),
      protein: Math.round(protein * 0.40),
      carbs: Math.round(carbs * 0.40),
      fat: Math.round(fat * 0.40),
      suggestions: [],
    },
    {
      name: 'dinner',
      calories: Math.round(targetCalories * 0.30),
      protein: Math.round(protein * 0.30),
      carbs: Math.round(carbs * 0.30),
      fat: Math.round(fat * 0.30),
      suggestions: [],
    },
    {
      name: 'snack',
      calories: Math.round(targetCalories * 0.05),
      protein: Math.round(protein * 0.05),
      carbs: Math.round(carbs * 0.05),
      fat: Math.round(fat * 0.05),
      suggestions: [],
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

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}
