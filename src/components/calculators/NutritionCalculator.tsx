import React, { useState } from 'react';
import { Input, Button, Card, Select } from '../common';
import { calculateTDEE, generateNutritionPlan, activityLevels } from '../../utils/calculations';
import type { NutritionPlan, GoalType, ActivityLevel } from '../../types';

export const NutritionCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [goal, setGoal] = useState<GoalType>('maintain');
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [errors, setErrors] = useState<{ age?: string; height?: string; weight?: string }>({});

  const activityOptions = activityLevels.map(level => ({
    value: level.value,
    label: `${level.label} - ${level.description}`,
  }));

  const goalOptions = [
    { value: 'lose', label: '减脂 - 减少体脂，保持健康体重' },
    { value: 'maintain', label: '维持 - 保持当前体重和体型' },
    { value: 'gain', label: '增肌 - 增加肌肉量，提高力量' },
  ];

  const validateInputs = (): boolean => {
    const newErrors: { age?: string; height?: string; weight?: string } = {};
    
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      newErrors.age = '请输入有效的年龄(10-120岁)';
    }
    
    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = '请输入有效的身高(cm)';
    }
    
    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = '请输入有效的体重(kg)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const tdeeInput = {
      gender,
      age: parseFloat(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
    };
    
    const { tdee } = calculateTDEE(tdeeInput);
    const nutritionPlan = generateNutritionPlan(tdee, goal);
    setPlan(nutritionPlan);
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setHeight('');
    setWeight('');
    setActivityLevel('moderately_active');
    setGoal('maintain');
    setPlan(null);
    setErrors({});
  };

  const getGoalLabel = (g: GoalType) => {
    const labels: Record<GoalType, string> = {
      lose: '减脂',
      maintain: '维持',
      gain: '增肌',
    };
    return labels[g];
  };

  const getGoalColor = (g: GoalType) => {
    const colors: Record<GoalType, string> = {
      lose: 'bg-blue-100 text-blue-800 border-blue-300',
      maintain: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      gain: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[g];
  };

  return (
    <div className="space-y-6">
      <Card 
        title="营养计划生成器" 
        description="根据您的身体数据和目标生成个性化营养方案"
        icon="🥗"
      >
        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setGender('male');
                setPlan(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                gender === 'male'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨 男性
            </button>
            <button
              onClick={() => {
                setGender('female');
                setPlan(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                gender === 'female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👩 女性
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="年龄"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            unit="岁"
            error={errors.age}
          />
          <Input
            label="身高"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            unit="cm"
            error={errors.height}
          />
          <Input
            label="体重"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="65"
            unit="kg"
            error={errors.weight}
          />
        </div>

        {/* Activity Level */}
        <Select
          label="活动水平"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          options={activityOptions}
        />

        {/* Goal Selection */}
        <Select
          label="目标"
          value={goal}
          onChange={(e) => setGoal(e.target.value as GoalType)}
          options={goalOptions}
        />

        {/* Goal Info */}
        <div className={`mt-4 p-4 rounded-lg ${getGoalColor(goal)}`}>
          <p className="text-sm font-medium">
            当前目标: {getGoalLabel(goal)}
          </p>
          <p className="text-sm mt-1 opacity-80">
            {goal === 'lose' && '蛋白质30% | 碳水35% | 脂肪35% | 热量缺口500千卡'}
            {goal === 'maintain' && '蛋白质25% | 碳水45% | 脂肪30% | 维持当前热量'}
            {goal === 'gain' && '蛋白质30% | 碳水50% | 脂肪20% | 热量盈余300千卡'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            生成营养计划
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {plan && (
        <div className="space-y-4">
          {/* Calorie Overview */}
          <Card title="每日营养目标" icon="🎯" className={getGoalColor(goal)}>
            <div className="text-center py-4">
              <p className="text-sm font-medium opacity-80">每日热量目标</p>
              <p className="text-5xl font-bold my-2">{plan.calories}</p>
              <p className="text-gray-600">千卡</p>
            </div>
            
            {/* Macros */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{plan.protein}g</p>
                <p className="text-sm text-gray-600">蛋白质</p>
                <p className="text-xs text-gray-500">{Math.round(plan.protein * 4)}千卡</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{plan.carbs}g</p>
                <p className="text-sm text-gray-600">碳水化合物</p>
                <p className="text-xs text-gray-500">{Math.round(plan.carbs * 4)}千卡</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{plan.fat}g</p>
                <p className="text-sm text-gray-600">脂肪</p>
                <p className="text-xs text-gray-500">{Math.round(plan.fat * 9)}千卡</p>
              </div>
            </div>
          </Card>

          {/* Meal Plans */}
          <Card title="餐食分配建议" icon="🍽️">
            <div className="space-y-4">
              {plan.meals.map((meal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{meal.name}</h4>
                    <span className="text-emerald-600 font-bold">{meal.calories}千卡</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>蛋白质: {meal.protein}g</span>
                    <span>碳水: {meal.carbs}g</span>
                    <span>脂肪: {meal.fat}g</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {meal.suggestions.map((suggestion, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-white rounded text-xs text-gray-600 border"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card title="营养小贴士" icon="💡">
            <div className="space-y-3 text-sm text-gray-700">
              {goal === 'lose' && (
                <>
                  <p>• 控制总热量摄入，创造适度热量缺口(500千卡)</p>
                  <p>• 增加蛋白质摄入，帮助维持肌肉量</p>
                  <p>• 选择低GI碳水化合物，延长饱腹感</p>
                  <p>• 多吃蔬菜，增加膳食纤维摄入</p>
                  <p>• 避免高糖高脂食物，减少空热量摄入</p>
                </>
              )}
              {goal === 'maintain' && (
                <>
                  <p>• 保持均衡饮食，各类营养素比例适中</p>
                  <p>• 规律进餐时间，避免暴饮暴食</p>
                  <p>• 多吃全谷物、蔬菜、水果和优质蛋白</p>
                  <p>• 适量摄入健康脂肪，如坚果、橄榄油</p>
                  <p>• 保持水分充足，每天至少8杯水</p>
                </>
              )}
              {goal === 'gain' && (
                <>
                  <p>• 增加热量摄入，创造热量盈余(300千卡)</p>
                  <p>• 提高碳水化合物比例，为训练提供能量</p>
                  <p>• 保证充足蛋白质，支持肌肉生长</p>
                  <p>• 训练后及时补充蛋白质和碳水</p>
                  <p>• 选择营养密度高的食物，避免垃圾食品</p>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
