import React, { useState } from 'react';
import { Input, Button, Card } from '../common';
import { calculateWHR, getWHRRiskLabel, getWHRRecommendation } from '../../utils/calculations';
import type { WHRResult } from '../../types';

export const WHRCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [result, setResult] = useState<WHRResult | null>(null);
  const [errors, setErrors] = useState<{ waist?: string; hip?: string }>({});

  const validateInputs = (): boolean => {
    const newErrors: { waist?: string; hip?: string } = {};
    
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    
    if (isNaN(waistNum) || waistNum <= 0) {
      newErrors.waist = '请输入有效的腰围(cm)';
    }
    
    if (isNaN(hipNum) || hipNum <= 0) {
      newErrors.hip = '请输入有效的臀围(cm)';
    }
    
    // Validate that waist and hip are reasonable
    if (!isNaN(waistNum) && !isNaN(hipNum)) {
      if (waistNum >= hipNum) {
        newErrors.waist = '腰围应小于臀围，请检查输入';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    const input = {
      gender,
      waist: parseFloat(waist),
      hip: parseFloat(hip),
    };
    
    const whrResult = calculateWHR(input);
    setResult(whrResult);
  };

  const handleReset = () => {
    setGender('male');
    setWaist('');
    setHip('');
    setResult(null);
    setErrors({});
  };

  const getRiskColor = (riskLevel: string): string => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 border-green-300 text-green-800',
      moderate: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      high: 'bg-red-100 border-red-300 text-red-800',
    };
    return colors[riskLevel] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getRiskRanges = (gender: 'male' | 'female') => {
    if (gender === 'male') {
      return [
        { label: '低风险', range: '< 0.90', color: 'bg-green-500', riskLevel: 'low' },
        { label: '中等风险', range: '0.90 - 1.00', color: 'bg-yellow-500', riskLevel: 'moderate' },
        { label: '高风险', range: '> 1.00', color: 'bg-red-500', riskLevel: 'high' },
      ];
    } else {
      return [
        { label: '低风险', range: '< 0.85', color: 'bg-green-500', riskLevel: 'low' },
        { label: '中等风险', range: '0.85 - 0.95', color: 'bg-yellow-500', riskLevel: 'moderate' },
        { label: '高风险', range: '> 0.95', color: 'bg-red-500', riskLevel: 'high' },
      ];
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="腰臀比 (WHR) 计算器" 
        description="腰臀比是评估腹部脂肪和心血管疾病风险的重要指标"
        icon="📐"
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
            label="臀围"
            type="number"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            placeholder="95"
            unit="cm"
            error={errors.hip}
          />
        </div>

        {/* Measurement Guide */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">📏 测量指南</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 腰围: 肚脐水平位置，呼气末测量</li>
            <li>• 臀围: 臀部最突出处水平测量</li>
            <li>• 保持卷尺水平，贴合但不压迫皮肤</li>
            <li>• 建议测量2-3次取平均值</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            计算腰臀比
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* WHR Result */}
          <Card className={getRiskColor(result.riskLevel)}>
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">您的腰臀比</p>
              <p className="text-5xl font-bold my-2">{result.whr}</p>
              <p className="text-lg font-semibold">
                {getWHRRiskLabel(result.riskLevel)}
              </p>
            </div>
          </Card>

          {/* WHR Scale */}
          <Card title="健康风险参考标准" icon="📊">
            <div className="space-y-3">
              {getRiskRanges(gender).map((item) => (
                <div
                  key={item.riskLevel}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.riskLevel === item.riskLevel
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
                <span className="font-medium">腰臀比 (WHR)</span> 是评估脂肪分布和心血管疾病风险的重要指标。
              </p>
              <p>
                <span className="font-medium">苹果型身材</span> (腰臀比高): 脂肪主要分布在腹部，与心血管疾病、糖尿病风险增加相关。
              </p>
              <p>
                <span className="font-medium">梨型身材</span> (腰臀比低): 脂肪主要分布在臀部和大腿，健康风险相对较低。
              </p>
            </div>
          </Card>

          {/* Recommendation */}
          <Card title="健康建议" icon="🎯">
            <p className="text-gray-700 leading-relaxed">
              {getWHRRecommendation(result.riskLevel)}
            </p>
          </Card>

          {/* Formula Info */}
          <Card title="计算公式" icon="📐">
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">腰臀比 = 腰围 / 臀围</span>
              </p>
              <p className="text-gray-600">
                世界卫生组织 (WHO) 建议的健康腰臀比标准:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                <li>男性: 低风险 &lt; 0.90, 中等风险 0.90-1.00, 高风险 &gt; 1.00</li>
                <li>女性: 低风险 &lt; 0.85, 中等风险 0.85-0.95, 高风险 &gt; 0.95</li>
              </ul>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
