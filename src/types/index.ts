// BMI Types
export interface BMIInput {
  height: number;
  weight: number;
  unit: 'metric' | 'imperial';
}

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  recommendation: string;
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BMICategoryInfo {
  category: BMICategory;
  label: string;
  min: number;
  max: number | null;
  color: string;
  recommendation: string;
}

// BMR & TDEE Types
export interface BMRInput {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
}

export interface TDEEInput extends BMRInput {
  activityLevel: ActivityLevel;
}

export type ActivityLevel = 
  | 'sedentary' 
  | 'lightly_active' 
  | 'moderately_active' 
  | 'very_active' 
  | 'extremely_active';

export interface ActivityLevelInfo {
  value: ActivityLevel;
  label: string;
  multiplier: number;
  description: string;
}

export interface BMRResult {
  bmr: number;
}

export interface TDEEResult extends BMRResult {
  tdee: number;
}

// Body Fat Types
export interface BodyFatInput {
  gender: 'male' | 'female';
  waist: number;
  neck: number;
  hip?: number;
  height: number;
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: BodyFatCategory;
}

export type BodyFatCategory = 'essential' | 'athletes' | 'fitness' | 'average' | 'obese';

// WHR Types
export interface WHRInput {
  gender: 'male' | 'female';
  waist: number;
  hip: number;
}

export interface WHRResult {
  whr: number;
  riskLevel: WHRRiskLevel;
}

export type WHRRiskLevel = 'low' | 'moderate' | 'high';

// Exercise Types
export interface ExerciseInput {
  activity: string;
  duration: number;
  weight: number;
}

export interface ExerciseResult {
  caloriesBurned: number;
  met: number;
}

export interface METActivity {
  name: string;
  met: number;
  category: string;
}

// Water Intake Types
export interface WaterInput {
  weight: number;
  activityLevel: ActivityLevel;
  climate: 'temperate' | 'hot' | 'cold';
}

export interface WaterResult {
  dailyIntake: number;
  glasses: number;
}

// Nutrition Types
export interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: MealPlan[];
}

export interface MealPlan {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  suggestions: string[];
}

export type GoalType = 'lose' | 'maintain' | 'gain';

// Health Report Types
export interface HealthReport {
  bmi: BMIResult | null;
  tdee: TDEEResult | null;
  bodyFat: BodyFatResult | null;
  whr: WHRResult | null;
  date: string;
}

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  createdAt: string;
  updatedAt: string;
}

// Navigation Types
export type CalculatorType = 
  | 'bmi' 
  | 'bmr' 
  | 'bodyfat' 
  | 'whr' 
  | 'exercise' 
  | 'water' 
  | 'nutrition' 
  | 'report'
  | 'history';

export interface NavItem {
  id: CalculatorType;
  label: string;
  icon: string;
  description: string;
}
