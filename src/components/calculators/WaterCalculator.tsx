import React, { useState } from 'react';
import { Input, Button, Card, Select } from '../common';
import { calculateWaterIntake, activityLevels } from '../../utils/calculations';
import type { WaterResult, ActivityLevel } from '../../types';

export const WaterCalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [climate, setClimate] = useState<'temperate' | 'hot' | 'cold'>('temperate');
  const [result, setResult] = useState<WaterResult | null>(null);
  const [errors, setErrors] = useState<{ weight?: string }>({});

  const activityOptions = activityLevels.map(level => ({
    value: level.value,
    label: `${level.label} - ${level.description}`,
  }));

  const climateOptions = [
    { value: 'temperate', label: '温带/舒适 - 正常温度环境' },
    { value: 'hot', label: '炎热/潮湿 - 高温或高湿度环境' },
    { value: 'cold', label: '寒冷/干燥 - 低温或干燥环境' },
  ];

  const validateInputs = (): boolean => {
    const newErrors: { weight?: string } = {};
    
    const weightNum = parseFloat(weight);
    
    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = '请输入有效的体重(kg)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const input = {
      weight: parseFloat(weight),
      activityLevel,
      climate,
    };
    
    const waterResult = calculateWaterIntake(input);
    setResult(waterResult);
  };

  const handleReset = () => {
    setWeight('');
    setActivityLevel('moderately_active');
    setClimate('temperate');
    setResult(null);
    setErrors({});
  };

  const getClimateLabel = (c: string) => {
    const labels: Record<string, string> = {
      temperate: '温带',
      hot: '炎热',
      cold: '寒冷',
    };
    return labels[c] || c;
  };

  return (
    <div className="space-y-6">
      <Card 
        title="每日饮水量计算器" 
        description="根据体重、活动水平和气候条件计算每日建议饮水量"
        icon="💧"
      >
        {/* Weight Input */}
        <Input
          label="体重"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="65"
          unit="kg"
          error={errors.weight}
        />

        {/* Activity Level */}
        <Select
          label="活动水平"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          options={activityOptions}
        />

        {/* Climate */}
        <Select
          label="气候条件"
          value={climate}
          onChange={(e) => setClimate(e.target.value as 'temperate' | 'hot' | 'cold')}
          options={climateOptions}
        />

        {/* Formula Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">计算公式:</span> 基础饮水量 = 体重(kg) × 35ml
          </p>
          <p className="text-xs text-blue-600 mt-1">
            根据活动水平和气候条件进行调整
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算饮水量
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Water Result */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800">每日建议饮水量</p>
              <div className="flex items-center justify-center gap-2 my-2">
                <span className="text-5xl font-bold text-blue-600">{result.dailyIntake}</span>
                <span className="text-xl text-blue-500">ml</span>
              </div>
              <p className="text-gray-600">
                约 <span className="font-bold text-blue-600">{result.glasses}</span> 杯
                <span className="text-sm text-gray-400 ml-1">(250ml/杯)</span>
              </p>
            </div>
          </Card>

          {/* Drinking Schedule */}
          <Card title="建议饮水时间表" icon="⏰">
            <div className="space-y-3">
              {[
                { time: '起床后', amount: Math.round(result.dailyIntake * 0.1), desc: '补充夜间流失水分' },
                { time: '早餐前', amount: Math.round(result.dailyIntake * 0.1), desc: '促进消化' },
                { time: '上午', amount: Math.round(result.dailyIntake * 0.15), desc: '保持水分' },
                { time: '午餐前', amount: Math.round(result.dailyIntake * 0.1), desc: '餐前补水' },
                { time: '下午', amount: Math.round(result.dailyIntake * 0.2), desc: '工作学习' },
                { time: '晚餐前', amount: Math.round(result.dailyIntake * 0.1), desc: '餐前补水' },
                { time: '晚间', amount: Math.round(result.dailyIntake * 0.15), desc: '睡前2小时' },
                { time: '运动中', amount: Math.round(result.dailyIntake * 0.1), desc: '根据运动补充' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-16">{item.time}</span>
                    <span className="text-sm text-gray-500">{item.desc}</span>
                  </div>
                  <span className="font-medium text-blue-600">{item.amount}ml</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card title="饮水小贴士" icon="💡">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-500">💧</span>
                <p>少量多次饮水，不要等到口渴才喝水</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">🌡️</span>
                <p>
                  当前气候: <span className="font-medium">{getClimateLabel(climate)}</span> - 
                  {climate === 'hot' && ' 炎热天气需要额外增加饮水量'}
                  {climate === 'cold' && ' 寒冷天气可适当减少但仍需保持充足'}
                  {climate === 'temperate' && ' 正常温度下保持标准饮水量'}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">🏃</span>
                <p>运动前后要额外补充水分，每运动30分钟补充200-300ml</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">🍵</span>
                <p>茶、咖啡、汤等也计入每日水分摄入，但纯净水最佳</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500">⚠️</span>
                <p>睡前2小时减少饮水，避免夜间频繁起夜</p>
              </div>
            </div>
          </Card>

          {/* Hydration Tracker */}
          <Card title="今日饮水追踪" icon="📊">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">目标: {result.glasses} 杯</span>
                <span className="text-blue-600 font-medium">每杯 250ml</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: Math.min(result.glasses, 16) }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-blue-100 flex items-center justify-center text-blue-300 hover:bg-blue-200 hover:text-blue-500 transition-colors cursor-pointer"
                    title={`第 ${i + 1} 杯`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                点击杯子标记已完成的饮水量
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
