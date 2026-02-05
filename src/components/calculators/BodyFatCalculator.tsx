import React, { useState } from 'react';
import { Input, Button, Card } from '../common';
import { calculateBodyFat, getBodyFatCategoryLabel } from '../../utils/calculations';
import type { BodyFatResult } from '../../types';

export const BodyFatCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [errors, setErrors] = useState<{ waist?: string; neck?: string; hip?: string; height?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { waist?: string; neck?: string; hip?: string; height?: string } = {};
    
    const waistNum = parseFloat(waist);
    const neckNum = parseFloat(neck);
    const heightNum = parseFloat(height);
    
    if (isNaN(waistNum) || waistNum <= 0) {
      newErrors.waist = '请输入有效的腰围(cm)';
    }
    
    if (isNaN(neckNum) || neckNum <= 0) {
      newErrors.neck = '请输入有效的颈围(cm)';
    }
    
    if (gender === 'female') {
      const hipNum = parseFloat(hip);
      if (isNaN(hipNum) || hipNum <= 0) {
        newErrors.hip = '请输入有效的臀围(cm)';
      }
    }
    
    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = '请输入有效的身高(cm)';
    }
    
    // Validate that waist > neck
    if (!isNaN(waistNum) && !isNaN(neckNum) && waistNum <= neckNum) {
      newErrors.waist = '腰围必须大于颈围';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const input = {
      gender,
      waist: parseFloat(waist),
      neck: parseFloat(neck),
      hip: gender === 'female' ? parseFloat(hip) : undefined,
      height: parseFloat(height),
    };
    
    const bodyFatResult = calculateBodyFat(input);
    setResult(bodyFatResult);
  };

  const handleReset = () => {
    setGender('male');
    setWaist('');
    setNeck('');
    setHip('');
    setHeight('');
    setResult(null);
    setErrors({});
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      essential: 'bg-blue-100 border-blue-300 text-blue-800',
      athletes: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      fitness: 'bg-green-100 border-green-300 text-green-800',
      average: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      obese: 'bg-red-100 border-red-300 text-red-800',
    };
    return colors[category] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getBodyFatRanges = (gender: 'male' | 'female') => {
    if (gender === 'male') {
      return [
        { label: '必需脂肪', range: '2-5%', min: 2, max: 5, color: 'bg-blue-500', category: 'essential' },
        { label: '运动员', range: '6-13%', min: 6, max: 13, color: 'bg-emerald-500', category: 'athletes' },
        { label: '健康', range: '14-17%', min: 14, max: 17, color: 'bg-green-500', category: 'fitness' },
        { label: '平均', range: '18-24%', min: 18, max: 24, color: 'bg-yellow-500', category: 'average' },
        { label: '肥胖', range: '25%+', min: 25, max: 100, color: 'bg-red-500', category: 'obese' },
      ];
    } else {
      return [
        { label: '必需脂肪', range: '10-13%', min: 10, max: 13, color: 'bg-blue-500', category: 'essential' },
        { label: '运动员', range: '14-20%', min: 14, max: 20, color: 'bg-emerald-500', category: 'athletes' },
        { label: '健康', range: '21-24%', min: 21, max: 24, color: 'bg-green-500', category: 'fitness' },
        { label: '平均', range: '25-31%', min: 25, max: 31, color: 'bg-yellow-500', category: 'average' },
        { label: '肥胖', range: '32%+', min: 32, max: 100, color: 'bg-red-500', category: 'obese' },
      ];
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="体脂率计算器" 
        description="使用美国海军公式估算身体脂肪百分比"
        icon="📏"
      >
        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setGender('male');
                setResult(null);
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
                setResult(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="腰围"
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder="80"
            unit="cm"
            error={errors.waist}
          />
          <Input
            label="颈围"
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="35"
            unit="cm"
            error={errors.neck}
          />
          {gender === 'female' && (
            <Input
              label="臀围"
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="95"
              unit="cm"
              error={errors.hip}
            />
          )}
          <Input
            label="身高"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            unit="cm"
            error={errors.height}
          />
        </div>

        {/* Measurement Guide */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">📏 测量指南</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 腰围: 肚脐水平绕腹部一周</li>
            <li>• 颈围: 喉结下方绕颈部一周</li>
            {gender === 'female' && <li>• 臀围: 臀部最宽处水平绕一周</li>}
            <li>• 保持卷尺贴合但不紧绷</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算体脂率
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Body Fat Result */}
          <Card className={getCategoryColor(result.category)}>
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">您的体脂率</p>
              <p className="text-5xl font-bold my-2">{result.bodyFatPercentage}%</p>
              <p className="text-lg font-semibold">
                {getBodyFatCategoryLabel(result.category)}
              </p>
            </div>
          </Card>

          {/* Body Fat Scale */}
          <Card title="体脂率参考标准" icon="📊">
            <div className="space-y-3">
              {getBodyFatRanges(gender).map((item) => (
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

          {/* Health Implications */}
          <Card title="健康意义" icon="💡">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">必需脂肪:</span> 维持生命所需的最低脂肪量
              </p>
              <p>
                <span className="font-medium">运动员:</span> 优秀体能表现的最佳范围
              </p>
              <p>
                <span className="font-medium">健康:</span> 一般健康成年人的理想范围
              </p>
              <p>
                <span className="font-medium">平均:</span> 普通人群常见范围
              </p>
              <p>
                <span className="font-medium">肥胖:</span> 健康风险增加，建议咨询专业人士
              </p>
            </div>
          </Card>

          {/* Formula Info */}
          <Card title="计算公式" icon="📐">
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                使用美国海军体脂计算公式 (US Navy Method):
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>男性: 495 / (1.0324 - 0.19077×log₁₀(腰围-颈围) + 0.15456×log₁₀(身高)) - 450</li>
                <li>女性: 495 / (1.29579 - 0.35004×log₁₀(腰围+臀围-颈围) + 0.22100×log₁₀(身高)) - 450</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
