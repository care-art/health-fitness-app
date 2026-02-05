import React from 'react';
import { Card, Button } from './common';
import { useHealthHistory } from '../hooks/useLocalStorage';

export const HistoryView: React.FC = () => {
  const { history, deleteRecord, clearHistory } = useHealthHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bmi: 'BMI计算',
      bmr: 'BMR/TDEE计算',
      bodyfat: '体脂率计算',
      whr: '腰臀比计算',
      exercise: '运动消耗计算',
      water: '饮水量计算',
      nutrition: '营养计划',
      report: '健康报告',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      bmi: '⚖️',
      bmr: '🔥',
      bodyfat: '📏',
      whr: '📐',
      exercise: '🏃',
      water: '💧',
      nutrition: '🥗',
      report: '📊',
    };
    return icons[type] || '📝';
  };

  const renderRecordData = (type: string, data: Record<string, number | string | boolean | undefined>) => {
    switch (type) {
      case 'bmi':
        return (
          <div className="text-sm">
            <p>BMI: <span className="font-medium">{data.bmi}</span></p>
            <p>分类: <span className="font-medium">{data.category}</span></p>
          </div>
        );
      case 'bmr':
        return (
          <div className="text-sm">
            <p>BMR: <span className="font-medium">{data.bmr} 千卡</span></p>
            <p>TDEE: <span className="font-medium">{data.tdee} 千卡</span></p>
          </div>
        );
      case 'bodyfat':
        return (
          <div className="text-sm">
            <p>体脂率: <span className="font-medium">{data.bodyFatPercentage}%</span></p>
            <p>分类: <span className="font-medium">{data.category}</span></p>
          </div>
        );
      case 'whr':
        return (
          <div className="text-sm">
            <p>腰臀比: <span className="font-medium">{data.whr}</span></p>
            <p>风险: <span className="font-medium">{data.riskLevel}</span></p>
          </div>
        );
      case 'exercise':
        return (
          <div className="text-sm">
            <p>消耗: <span className="font-medium">{data.caloriesBurned} 千卡</span></p>
            <p>运动: <span className="font-medium">{data.activity}</span></p>
          </div>
        );
      case 'water':
        return (
          <div className="text-sm">
            <p>建议: <span className="font-medium">{data.dailyIntake}ml</span></p>
            <p>杯数: <span className="font-medium">{data.glasses} 杯</span></p>
          </div>
        );
      default:
        return (
          <div className="text-sm text-gray-500">
            详细数据已保存
          </div>
        );
    }
  };

  if (history.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-4xl mb-4">📋</p>
        <p className="text-gray-500">暂无历史记录</p>
        <p className="text-sm text-gray-400 mt-2">
          使用各个计算器后，数据将自动保存到这里
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card 
        title="历史记录" 
        description="查看您之前的所有计算记录"
        icon="📋"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            共 {history.length} 条记录
          </p>
          <Button 
            onClick={clearHistory} 
            variant="outline" 
            size="sm"
          >
            清空历史
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {history.map((record) => (
          <Card key={record.id} className="relative">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getTypeIcon(record.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {getTypeLabel(record.type)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(record.date)}
                  </span>
                </div>
                {renderRecordData(record.type, record.data)}
              </div>
              <button
                onClick={() => deleteRecord(record.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="删除记录"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
