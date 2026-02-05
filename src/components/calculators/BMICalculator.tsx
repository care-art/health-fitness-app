import React, { useState } from 'react';
import { Input, Button, Card } from '../common';
import { calculateBMI, getBMICategoryInfo, getIdealWeightRange } from '../../utils/calculations';
import { useHealthHistory } from '../../hooks/useLocalStorage';
import type { BMIResult } from '../../types';

export const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});
  const { addRecord } = useHealthHistory();

  const validateInputs = (): boolean => {
    const newErrors: { height?: string; weight?: string } = {};
    
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = unit === 'metric' ? '请输入有效的身高(cm)' : '请输入有效的身高(in)';
    }
    
    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = unit === 'metric' ? '请输入有效的体重(kg)' : '请输入有效的体重(lbs)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const input = {
      height: parseFloat(height),
      weight: parseFloat(weight),
      unit,
    };
    
    const bmiResult = calculateBMI(input);
    setResult(bmiResult);
    
    // Save to history
    addRecord('bmi', {
      height: input.height,
      weight: input.weight,
      unit: input.unit,
      bmi: bmiResult.bmi,
      category: bmiResult.category,
    });
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setResult(null);
    setErrors({});
  };

  const getResultColor = (category: string): string => {
    const colors: Record<string, string> = {
      underweight: 'bg-blue-100 border-blue-300 text-blue-800',
      normal: 'bg-green-100 border-green-300 text-green-800',
      overweight: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      obese: 'bg-red-100 border-red-300 text-red-800',
    };
    return colors[category] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const idealWeight = result ? getIdealWeightRange(parseFloat(height), unit) : null;

  return (
    <div className="space-y-6">
      <Card 
        title="BMI 计算器" 
        description="身体质量指数(BMI)是衡量体重与身高关系的国际标准"
        icon="⚖️"
      >
        {/* Unit Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setUnit('metric');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              unit === 'metric'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            公制 (cm/kg)
          </button>
          <button
            onClick={() => {
              setUnit('imperial');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              unit === 'imperial'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            英制 (in/lbs)
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={unit === 'metric' ? '身高' : '身高'}
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '170' : '67'}
            unit={unit === 'metric' ? 'cm' : 'in'}
            error={errors.height}
          />
          <Input
            label={unit === 'metric' ? '体重' : '体重'}
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '65' : '143'}
            unit={unit === 'metric' ? 'kg' : 'lbs'}
            error={errors.weight}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算 BMI
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* BMI Result Card */}
          <Card className={getResultColor(result.category)}>
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">您的 BMI 指数</p>
              <p className="text-5xl font-bold my-2">{result.bmi}</p>
              <p className="text-lg font-semibold">
                {getBMICategoryInfo(result.category).label}
              </p>
            </div>
          </Card>

          {/* BMI Scale */}
          <Card title="BMI 参考标准" icon="📊">
            <div className="space-y-3">
              {[
                { label: '偏瘦', range: '< 18.5', color: 'bg-blue-500', category: 'underweight' },
                { label: '正常', range: '18.5 - 24.9', color: 'bg-green-500', category: 'normal' },
                { label: '超重', range: '25 - 29.9', color: 'bg-yellow-500', category: 'overweight' },
                { label: '肥胖', range: '≥ 30', color: 'bg-red-500', category: 'obese' },
              ].map((item) => (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.category === item.category
                      ? 'bg-gray-100 ring-2 ring-emerald-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-gray-600">{item.range}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Ideal Weight */}
          {idealWeight && (
            <Card title="理想体重范围" icon="🎯">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {idealWeight.min} - {idealWeight.max} {unit === 'metric' ? 'kg' : 'lbs'}
                </p>
                <p className="text-gray-600 mt-2">
                  基于您的身高计算的健康体重范围
                </p>
              </div>
            </Card>
          )}

          {/* Recommendation */}
          <Card title="健康建议" icon="💡">
            <p className="text-gray-700 leading-relaxed">
              {result.recommendation}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
