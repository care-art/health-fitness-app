import React, { useState } from 'react';
import { Input, Button, Card } from '../common';
import { calculateBMI, getIdealWeightRange } from '../../utils/calculations';
import { useHealthHistory } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../i18n/LanguageContext';
import type { BMIResult } from '../../types';

export const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});
  const { addRecord } = useHealthHistory();
  const { t } = useLanguage();

  const validateInputs = (): boolean => {
    const newErrors: { height?: string; weight?: string } = {};

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = t('bmi.heightPlaceholder') || 'Please enter a valid height';
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = t('bmi.weightPlaceholder') || 'Please enter a valid weight';
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

  const getCategoryLabel = (category: string): string => {
    return t(`bmi.categories.${category}`) || category;
  };

  const getRecommendation = (category: string): string => {
    return t(`bmi.adviceList.${category}`) || '';
  };

  return (
    <div className="space-y-6">
      <Card
        title={t('bmi.title')}
        description={t('bmi.description')}
        icon="⚖️"
      >
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
            {t('bmi.metric')} (cm/kg)
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
            {t('bmi.imperial')} (in/lbs)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('bmi.height')}
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '170' : '67'}
            unit={unit === 'metric' ? t('bmi.cm') : 'in'}
            error={errors.height}
          />
          <Input
            label={t('bmi.weight')}
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '65' : '143'}
            unit={unit === 'metric' ? t('bmi.kg') : 'lbs'}
            error={errors.weight}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleCalculate} size="lg" className="flex-1">
            {t('bmi.calculate')}
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            {t('common.reset')}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card className={getResultColor(result.category)}>
            <div className="text-center">
              <p className="text-sm font-medium opacity-80">{t('bmi.result')}</p>
              <p className="text-5xl font-bold my-2">{result.bmi}</p>
              <p className="text-lg font-semibold">
                {getCategoryLabel(result.category)}
              </p>
            </div>
          </Card>

          <Card title={t('bmi.scale')} icon="📊">
            <div className="space-y-3">
              {[
                { label: getCategoryLabel('underweight'), range: '< 18.5', color: 'bg-blue-500', category: 'underweight' },
                { label: getCategoryLabel('normal'), range: '18.5 - 24.9', color: 'bg-green-500', category: 'normal' },
                { label: getCategoryLabel('overweight'), range: '25 - 29.9', color: 'bg-yellow-500', category: 'overweight' },
                { label: getCategoryLabel('obese'), range: '≥ 30', color: 'bg-red-500', category: 'obese' },
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

          {idealWeight && (
            <Card title={t('bmi.idealWeight')} icon="🎯">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {idealWeight.min} - {idealWeight.max} {unit === 'metric' ? t('bmi.kg') : 'lbs'}
                </p>
                <p className="text-gray-600 mt-2">
                  {t('bmi.idealWeightDescription')}
                </p>
              </div>
            </Card>
          )}

          <Card title={t('bmi.advice')} icon="💡">
            <p className="text-gray-700 leading-relaxed">
              {getRecommendation(result.category)}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
