import React, { useState } from 'react';
import { Input, Button, Card, Select } from '../common';
import { calculateBMR, calculateTDEE, getActivityLevelInfo, activityLevels } from '../../utils/calculations';
import type { BMRResult, TDEEResult, ActivityLevel } from '../../types';

export const BMRTDEECalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [bmrResult, setBmrResult] = useState<BMRResult | null>(null);
  const [tdeeResult, setTdeeResult] = useState<TDEEResult | null>(null);
  const [errors, setErrors] = useState<{ age?: string; height?: string; weight?: string }>({});

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
    
    const input = {
      gender,
      age: parseFloat(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
    };
    
    const bmr = calculateBMR(input);
    const tdee = calculateTDEE(input);
    
    setBmrResult(bmr);
    setTdeeResult(tdee);
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setHeight('');
    setWeight('');
    setActivityLevel('moderately_active');
    setBmrResult(null);
    setTdeeResult(null);
    setErrors({});
  };

  const activityOptions = activityLevels.map(level => ({
    value: level.value,
    label: `${level.label} - ${level.description}`,
  }));

  return (
    <div className="space-y-6">
      <Card 
        title="BMR & TDEE 计算器" 
        description="基础代谢率(BMR)和每日总能量消耗(TDEE)计算"
        icon="🔥"
      >
        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                gender === 'male'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨 男性
            </button>
            <button
              onClick={() => setGender('female')}
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

        {/* Activity Level Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{getActivityLevelInfo(activityLevel).label}:</span>{' '}
            {getActivityLevelInfo(activityLevel).description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {bmrResult && tdeeResult && (
        <div className="space-y-4">
          {/* BMR Result */}
          <Card title="基础代谢率 (BMR)" icon="⚡" className="bg-gradient-to-br from-orange-50 to-red-50">
            <div className="text-center py-4">
              <p className="text-5xl font-bold text-orange-600">{bmrResult.bmr}</p>
              <p className="text-gray-600 mt-2">千卡/天</p>
              <p className="text-sm text-gray-500 mt-4">
                这是您身体在完全休息状态下维持生命所需的最低热量
              </p>
            </div>
          </Card>

          {/* TDEE Result */}
          <Card title="每日总能量消耗 (TDEE)" icon="🔥" className="bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="text-center py-4">
              <p className="text-5xl font-bold text-emerald-600">{tdeeResult.tdee}</p>
              <p className="text-gray-600 mt-2">千卡/天</p>
              <p className="text-sm text-gray-500 mt-4">
                根据您的活动水平，这是您每天需要消耗的总热量
              </p>
            </div>
          </Card>

          {/* Calorie Goals */}
          <Card title="每日热量目标建议" icon="🎯">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">减重</p>
                <p className="text-2xl font-bold text-blue-700">{tdeeResult.tdee - 500}</p>
                <p className="text-xs text-blue-500">千卡/天 (-500)</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-600 font-medium">维持</p>
                <p className="text-2xl font-bold text-emerald-700">{tdeeResult.tdee}</p>
                <p className="text-xs text-emerald-500">千卡/天</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">增重</p>
                <p className="text-2xl font-bold text-purple-700">{tdeeResult.tdee + 300}</p>
                <p className="text-xs text-purple-500">千卡/天 (+300)</p>
              </div>
            </div>
          </Card>

          {/* Formula Info */}
          <Card title="计算公式" icon="📐">
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">BMR (Mifflin-St Jeor 公式):</span>
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>男性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5</li>
                <li>女性: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <span className="font-medium">TDEE:</span> TDEE = BMR × 活动系数
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>久坐: 1.2 | 轻度活动: 1.375 | 中度活动: 1.55</li>
                <li>高度活动: 1.725 | 极高活动: 1.9</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
