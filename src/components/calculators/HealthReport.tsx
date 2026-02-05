import React, { useState } from 'react';
import { Input, Button, Card, Select } from '../common';
import { 
  calculateBMI, 
  calculateTDEE, 
  calculateBodyFat, 
  calculateWHR,
  getBMICategoryInfo,
  getBodyFatCategoryLabel,
  getWHRRiskLabel,
  getWHRRecommendation,
  activityLevels 
} from '../../utils/calculations';
import type { 
  BMIResult, 
  TDEEResult, 
  BodyFatResult, 
  WHRResult,
  ActivityLevel 
} from '../../types';

interface CompleteHealthData {
  bmi: BMIResult;
  tdee: TDEEResult;
  bodyFat: BodyFatResult;
  whr: WHRResult;
}

export const HealthReport: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [report, setReport] = useState<CompleteHealthData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityOptions = activityLevels.map(level => ({
    value: level.value,
    label: `${level.label} - ${level.description}`,
  }));

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    const neckNum = parseFloat(neck);
    
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      newErrors.age = '请输入有效的年龄(10-120岁)';
    }
    
    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = '请输入有效的身高(cm)';
    }
    
    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = '请输入有效的体重(kg)';
    }
    
    if (isNaN(waistNum) || waistNum <= 0) {
      newErrors.waist = '请输入有效的腰围(cm)';
    }
    
    if (isNaN(hipNum) || hipNum <= 0) {
      newErrors.hip = '请输入有效的臀围(cm)';
    }
    
    if (isNaN(neckNum) || neckNum <= 0) {
      newErrors.neck = '请输入有效的颈围(cm)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateReport = () => {
    if (!validateInputs()) return;
    
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const ageNum = parseFloat(age);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);
    const neckNum = parseFloat(neck);
    
    // Calculate all metrics
    const bmi = calculateBMI({ height: heightNum, weight: weightNum, unit: 'metric' });
    const tdee = calculateTDEE({ gender, age: ageNum, height: heightNum, weight: weightNum, activityLevel });
    const bodyFat = calculateBodyFat({ gender, waist: waistNum, neck: neckNum, hip: hipNum, height: heightNum });
    const whr = calculateWHR({ gender, waist: waistNum, hip: hipNum });
    
    setReport({ bmi, tdee, bodyFat, whr });
  };

  const handleReset = () => {
    setGender('male');
    setAge('');
    setHeight('');
    setWeight('');
    setWaist('');
    setHip('');
    setNeck('');
    setActivityLevel('moderately_active');
    setReport(null);
    setErrors({});
  };

  const getHealthScore = (report: CompleteHealthData): number => {
    let score = 100;
    
    // BMI scoring
    if (report.bmi.category === 'normal') score += 0;
    else if (report.bmi.category === 'overweight') score -= 10;
    else if (report.bmi.category === 'obese') score -= 20;
    else score -= 15;
    
    // Body fat scoring
    if (report.bodyFat.category === 'fitness' || report.bodyFat.category === 'athletes') score += 0;
    else if (report.bodyFat.category === 'average') score -= 5;
    else if (report.bodyFat.category === 'obese') score -= 15;
    
    // WHR scoring
    if (report.whr.riskLevel === 'low') score += 0;
    else if (report.whr.riskLevel === 'moderate') score -= 10;
    else score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '需改善';
  };

  return (
    <div className="space-y-6">
      <Card 
        title="综合健康报告" 
        description="输入您的身体数据，生成全面的健康分析报告"
        icon="📊"
      >
        {/* Gender Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setGender('male');
                setReport(null);
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
                setReport(null);
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

        {/* Basic Info */}
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

        {/* Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Input
            label="颈围"
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="35"
            unit="cm"
            error={errors.neck}
          />
        </div>

        {/* Activity Level */}
        <Select
          label="活动水平"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          options={activityOptions}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleGenerateReport} size="lg" className="flex-1">
            生成健康报告
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            重置
          </Button>
        </div>
      </Card>

      {/* Report Results */}
      {report && (
        <div className="space-y-4">
          {/* Health Score */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="text-center py-4">
              <p className="text-sm font-medium text-gray-600">综合健康评分</p>
              <p className={`text-6xl font-bold my-2 ${getScoreColor(getHealthScore(report))}`}>
                {getHealthScore(report)}
              </p>
              <p className={`text-lg font-semibold ${getScoreColor(getHealthScore(report))}`}>
                {getScoreLabel(getHealthScore(report))}
              </p>
            </div>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BMI */}
            <Card title="BMI 指数" icon="⚖️">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{report.bmi.bmi}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {getBMICategoryInfo(report.bmi.category).label}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {report.bmi.recommendation}
                </p>
              </div>
            </Card>

            {/* TDEE */}
            <Card title="每日热量消耗" icon="🔥">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{report.tdee.tdee}</p>
                <p className="text-sm text-gray-600 mt-1">千卡/天</p>
                <p className="text-xs text-gray-500 mt-2">
                  基础代谢: {report.tdee.bmr} 千卡
                </p>
              </div>
            </Card>

            {/* Body Fat */}
            <Card title="体脂率" icon="📏">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{report.bodyFat.bodyFatPercentage}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {getBodyFatCategoryLabel(report.bodyFat.category)}
                </p>
              </div>
            </Card>

            {/* WHR */}
            <Card title="腰臀比" icon="📐">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{report.whr.whr}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {getWHRRiskLabel(report.whr.riskLevel)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {getWHRRecommendation(report.whr.riskLevel)}
                </p>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card title="健康总结与建议" icon="💡">
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">体重管理</h4>
                <p>{report.bmi.recommendation}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">运动建议</h4>
                <p>
                  您的每日热量消耗为 {report.tdee.tdee} 千卡。
                  {report.tdee.tdee < 1800 
                    ? '建议适当增加运动量，提高基础代谢率。'
                    : report.tdee.tdee > 2500
                    ? '您的基础代谢较高，保持当前活动水平。'
                    : '您的活动水平适中，继续保持规律运动。'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">身体成分</h4>
                <p>
                  体脂率 {report.bodyFat.bodyFatPercentage}% 处于{getBodyFatCategoryLabel(report.bodyFat.category)}范围。
                  {report.bodyFat.category === 'obese' 
                    ? '建议通过有氧运动和饮食控制降低体脂。'
                    : report.bodyFat.category === 'average'
                    ? '可以通过力量训练进一步优化身体成分。'
                    : '您的体脂控制得很好，继续保持！'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">心血管健康</h4>
                <p>
                  腰臀比 {report.whr.whr} 表示您处于{getWHRRiskLabel(report.whr.riskLevel)}水平。
                  {getWHRRecommendation(report.whr.riskLevel)}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Plan */}
          <Card title="行动计划" icon="🎯">
            <div className="space-y-3">
              {report.bmi.category !== 'normal' && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">⚖️</span>
                  <div>
                    <p className="font-medium text-blue-800">体重管理</p>
                    <p className="text-sm text-blue-600">
                      {report.bmi.category === 'underweight' 
                        ? '增加营养摄入，进行力量训练增加肌肉量。'
                        : '控制饮食热量，增加有氧运动，每周至少150分钟。'}
                    </p>
                  </div>
                </div>
              )}
              
              {report.whr.riskLevel !== 'low' && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600">🏃</span>
                  <div>
                    <p className="font-medium text-yellow-800">核心训练</p>
                    <p className="text-sm text-yellow-600">
                      增加有氧运动和核心训练，减少腹部脂肪堆积。
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                <span className="text-emerald-600">🥗</span>
                <div>
                  <p className="font-medium text-emerald-800">均衡饮食</p>
                  <p className="text-sm text-emerald-600">
                    保持均衡饮食，蛋白质、碳水、脂肪比例合理，多吃蔬菜水果。
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600">💧</span>
                <div>
                  <p className="font-medium text-purple-800">充足水分</p>
                  <p className="text-sm text-purple-600">
                    每日饮水 {Math.round(parseFloat(weight || '0') * 35)}ml，保持身体水分平衡。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
