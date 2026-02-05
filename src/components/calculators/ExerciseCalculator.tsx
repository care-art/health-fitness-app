import React, { useState } from 'react';
import { Input, Button, Card, Select } from '../common';
import { calculateExerciseCalories, metActivities } from '../../utils/calculations';
import type { ExerciseResult } from '../../types';

export const ExerciseCalculator: React.FC = () => {
  const [activity, setActivity] = useState<string>('慢跑(8km/h)');
  const [duration, setDuration] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [errors, setErrors] = useState<{ duration?: string; weight?: string }>({});

  // Group activities by category
  const activityCategories = metActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, typeof metActivities>);

  const activityOptions = Object.entries(activityCategories).flatMap(([category, activities]) => [
    { value: '', label: `── ${category} ──`, disabled: true },
    ...activities.map(a => ({ value: a.name, label: `${a.name} (MET: ${a.met})` })),
  ]);

  const validateInputs = (): boolean => {
    const newErrors: { duration?: string; weight?: string } = {};
    
    const durationNum = parseFloat(duration);
    const weightNum = parseFloat(weight);
    
    if (isNaN(durationNum) || durationNum <= 0 || durationNum > 480) {
      newErrors.duration = '请输入有效的运动时长(1-480分钟)';
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
      activity,
      duration: parseFloat(duration),
      weight: parseFloat(weight),
    };
    
    const exerciseResult = calculateExerciseCalories(input);
    setResult(exerciseResult);
  };

  const handleReset = () => {
    setActivity('慢跑(8km/h)');
    setDuration('');
    setWeight('');
    setResult(null);
    setErrors({});
  };

  const selectedActivity = metActivities.find(a => a.name === activity);

  return (
    <div className="space-y-6">
      <Card 
        title="运动卡路里计算器" 
        description="根据运动类型、时长和体重计算消耗的卡路里"
        icon="🏃"
      >
        {/* Activity Selection */}
        <Select
          label="运动类型"
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value);
            setResult(null);
          }}
          options={activityOptions}
        />

        {/* Activity Info */}
        {selectedActivity && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">{selectedActivity.name}</span> - 
              MET值: {selectedActivity.met} 
              <span className="text-blue-600 ml-2">
                ({selectedActivity.met < 3 ? '低强度' : selectedActivity.met < 6 ? '中等强度' : '高强度'})
              </span>
            </p>
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="运动时长"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            unit="分钟"
            error={errors.duration}
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

        {/* Formula Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">计算公式:</span> 卡路里 = MET × 体重(kg) × 时间(小时)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MET (代谢当量) 表示运动强度相对于静息状态的倍数
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算消耗
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Calories Result */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-800">消耗的卡路里</p>
              <p className="text-5xl font-bold text-orange-600 my-2">{result.caloriesBurned}</p>
              <p className="text-gray-600">千卡</p>
              <p className="text-sm text-gray-500 mt-2">
                MET值: {result.met} | 运动: {activity}
              </p>
            </div>
          </Card>

          {/* Comparison */}
          <Card title="相当于" icon="🍔">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { food: '米饭(碗)', calories: 200, icon: '🍚' },
                { food: '香蕉', calories: 105, icon: '🍌' },
                { food: '可乐(罐)', calories: 140, icon: '🥤' },
                { food: '巧克力', calories: 230, icon: '🍫' },
              ].map((item) => {
                const count = (result.caloriesBurned / item.calories).toFixed(1);
                return (
                  <div key={item.food} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl">{item.icon}</p>
                    <p className="text-lg font-bold text-gray-800">{count}</p>
                    <p className="text-xs text-gray-500">{item.food}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Activity Suggestions */}
          <Card title="要达到相同消耗，您还可以选择" icon="💡">
            <div className="space-y-2">
              {metActivities
                .filter(a => a.name !== activity)
                .slice(0, 5)
                .map((a) => {
                  const durationNeeded = (result.caloriesBurned / (a.met * parseFloat(weight || '65')) * 60).toFixed(0);
                  return (
                    <div key={a.name} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-gray-700">{a.name}</span>
                      <span className="text-sm text-gray-500">约 {durationNeeded} 分钟</span>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
