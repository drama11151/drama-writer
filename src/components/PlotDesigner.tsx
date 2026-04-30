import { useState } from 'react';
import { Play, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, BookOpen, Swords, Flame, Sparkle } from 'lucide-react';
import type { Idea, Character } from '../types';

interface PlotDesignerProps {
  ideas: Idea[];
  characters: Character[];
  onPlotChange: (data: PlotData) => void;
}

interface PlotPoint {
  id: string;
  title: string;
  description: string;
  type: 'setup' | 'conflict' | 'climax' | 'resolution';
  characters: string[];
}

interface PlotData {
  title: string;
  theme: string;
  plotPoints: PlotPoint[];
}

const PLOT_TYPES = [
  { type: 'setup', label: '铺垫', color: 'bg-blue-100 text-blue-700', icon: BookOpen },
  { type: 'conflict', label: '冲突', color: 'bg-red-100 text-red-700', icon: Swords },
  { type: 'climax', label: '高潮', color: 'bg-orange-100 text-orange-700', icon: Flame },
  { type: 'resolution', label: '结局', color: 'bg-green-100 text-green-700', icon: Sparkle },
];

export default function PlotDesigner({ ideas, characters, onPlotChange }: PlotDesignerProps) {
  const [plotTitle, setPlotTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([]);
  const [newPointTitle, setNewPointTitle] = useState('');
  const [newPointDesc, setNewPointDesc] = useState('');
  const [newPointType, setNewPointType] = useState<PlotPoint['type']>('setup');

  const updateData = (updated: Partial<PlotData>) => {
    onPlotChange({
      title: plotTitle,
      theme,
      plotPoints,
      ...updated,
    });
  };

  const handleAddPlotPoint = () => {
    if (!newPointTitle.trim()) return;
    
    const newPoint: PlotPoint = {
      id: crypto.randomUUID(),
      title: newPointTitle.trim(),
      description: newPointDesc.trim(),
      type: newPointType,
      characters: [],
    };
    
    const updated = [...plotPoints, newPoint];
    setPlotPoints(updated);
    setNewPointTitle('');
    setNewPointDesc('');
    onPlotChange({ title: plotTitle, theme, plotPoints: updated });
  };

  const handleRemovePlotPoint = (id: string) => {
    const updated = plotPoints.filter(p => p.id !== id);
    setPlotPoints(updated);
    onPlotChange({ title: plotTitle, theme, plotPoints: updated });
  };

  const handleMovePlotPoint = (id: string, direction: 'up' | 'down') => {
    const index = plotPoints.findIndex(p => p.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      const updated = [...plotPoints];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setPlotPoints(updated);
      onPlotChange({ title: plotTitle, theme, plotPoints: updated });
    } else if (direction === 'down' && index < plotPoints.length - 1) {
      const updated = [...plotPoints];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setPlotPoints(updated);
      onPlotChange({ title: plotTitle, theme, plotPoints: updated });
    }
  };

  return (
    <div className="space-y-8">
      {/* 灵感来源 */}
      {ideas.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">来自创意灵感</span>
          </div>
          <p className="text-sm text-gray-600">{ideas[0]?.content}</p>
        </div>
      )}

      {/* 情节标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          情节主线标题
        </label>
        <input
          type="text"
          value={plotTitle}
          onChange={(e) => {
            setPlotTitle(e.target.value);
            updateData({ title: e.target.value });
          }}
          placeholder="给你的情节起个名字..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 核心主题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          核心主题 / 中心思想
        </label>
        <textarea
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            updateData({ theme: e.target.value });
          }}
          placeholder="这个故事想要表达什么？探讨什么主题？..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* 情节点列表 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          情节设计
        </label>
        
        {plotPoints.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Play className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">还没有添加情节点</p>
            <p className="text-sm text-gray-400 mt-1">从下方添加第一个情节点开始设计</p>
          </div>
        ) : (
          <div className="space-y-3">
            {plotPoints.map((point, index) => {
              const plotType = PLOT_TYPES.find(pt => pt.type === point.type);
              return (
                <div
                  key={point.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${plotType?.color}`}>
                        {plotType?.icon} {plotType?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMovePlotPoint(point.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMovePlotPoint(point.id, 'down')}
                        disabled={index === plotPoints.length - 1}
                        className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemovePlotPoint(point.id)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{point.title}</h4>
                  {point.description && (
                    <p className="text-sm text-gray-600">{point.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 添加新情节点 */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">添加情节点</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={newPointTitle}
            onChange={(e) => setNewPointTitle(e.target.value)}
            placeholder="情节点标题..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <textarea
            value={newPointDesc}
            onChange={(e) => setNewPointDesc(e.target.value)}
            placeholder="详细描述这个情节点..."
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {PLOT_TYPES.map((pt) => (
                <button
                  key={pt.type}
                  onClick={() => setNewPointType(pt.type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    newPointType === pt.type
                      ? pt.color
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <pt.icon className="w-4 h-4" /> {pt.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddPlotPoint}
              disabled={!newPointTitle.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
