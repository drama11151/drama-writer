import { Star, TrendingUp, Target, Award, Users, BarChart3, ChevronRight } from 'lucide-react';
import type { ScoreResult } from '../types';

interface ScorePanelProps {
  score: ScoreResult;
  compact?: boolean;
}

const scoreConfig = [
  { key: 'marketFit', label: '市场匹配', icon: Target, color: 'orange' },
  { key: 'originality', label: '创新程度', icon: Star, color: 'yellow' },
  { key: 'commercial', label: '商业价值', icon: TrendingUp, color: 'green' },
  { key: 'structure', label: '结构完整', icon: BarChart3, color: 'blue' },
  { key: 'character', label: '人物塑造', icon: Users, color: 'purple' },
];

export default function ScorePanel({ score, compact = false }: ScorePanelProps) {
  const getScoreColor = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 70) return 'text-cyan-600';
    return 'text-red-600';
  };

  const getScoreBg = (value: number) => {
    if (value >= 85) return 'bg-green-100';
    if (value >= 70) return 'bg-cyan-100';
    return 'bg-red-100';
  };

  const getGrade = (value: number) => {
    if (value >= 90) return 'S';
    if (value >= 80) return 'A';
    if (value >= 70) return 'B';
    if (value >= 60) return 'C';
    return 'D';
  };

  if (compact) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-500" />
          剧本评分
        </h3>
        
        <div className="text-center mb-4">
          <div className={`text-5xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getScoreBg(score.overall)} ${getScoreColor(score.overall)}`}>
            {getGrade(score.overall)}级作品
          </div>
        </div>

        <div className="space-y-2">
          {scoreConfig.map(item => {
            const value = score[item.key as keyof Omit<ScoreResult, 'overall' | 'suggestions'>];
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${item.color}-500`} />
                <span className="flex-1 text-sm text-gray-600">{item.label}</span>
                <span className={`font-medium ${getScoreColor(value as number)}`}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>

        {score.suggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {score.suggestions.length}条改进建议
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-cyan-500" />
        剧本市场评估报告
      </h3>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
          <div>
            <div className={`text-5xl font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
            </div>
            <div className="text-sm text-gray-500">综合评分</div>
          </div>
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getScoreBg(score.overall)} ${getScoreColor(score.overall)}`}>
          {getGrade(score.overall)}级作品 - {
            score.overall >= 90 ? '顶级爆款潜力' :
            score.overall >= 80 ? '优秀佳作' :
            score.overall >= 70 ? '良好可投' :
            score.overall >= 60 ? '需修改' : '较大问题'
          }
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {scoreConfig.map(item => {
          const value = score[item.key as keyof Omit<ScoreResult, 'overall' | 'suggestions'>];
          const Icon = item.icon;
          return (
            <div key={item.key} className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-${item.color}-50 mb-2`}>
                <Icon className={`w-6 h-6 text-${item.color}-500`} />
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(value as number)}`}>
                {value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-blue-500" />
          改进建议
        </h4>
        <ul className="space-y-3">
          {score.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3 bg-white rounded-lg p-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-green-700 font-medium">
          综合评估：剧本具备投放市场的基本条件，建议根据上述建议进行针对性修改后可提交平台审核。
        </p>
      </div>
    </div>
  );
}
