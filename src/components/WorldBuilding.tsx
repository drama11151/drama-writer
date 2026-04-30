import { useState } from 'react';
import { Globe, Plus, Trash2, Sparkles } from 'lucide-react';
import type { Idea } from '../types';

interface WorldBuildingProps {
  ideas: Idea[];
  onWorldBuildingChange: (data: WorldData) => void;
}

interface WorldData {
  name: string;
  genre: string;
  time: string;
  location: string;
  rules: string[];
  factions: string[];
  history: string[];
}

const WORLD_TEMPLATES = [
  { name: '现代都市', icon: '🏙️', desc: '当代城市背景，贴近现实生活' },
  { name: '古代王朝', icon: '🏯', desc: '历史穿越或架空古代背景' },
  { name: '未来科幻', icon: '🚀', desc: '科技发展，宇宙探索' },
  { name: '魔法异界', icon: '✨', desc: '魔法体系，玄幻世界观' },
  { name: '末日废土', icon: '☢️', desc: '生存挑战，资源匮乏' },
  { name: '校园青春', icon: '📚', desc: '青春成长，情感萌芽' },
];

export default function WorldBuilding({ ideas, onWorldBuildingChange }: WorldBuildingProps) {
  const [worldName, setWorldName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [timeSetting, setTimeSetting] = useState('');
  const [location, setLocation] = useState('');
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');
  const [factions, setFactions] = useState<string[]>([]);
  const [newFaction, setNewFaction] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [newHistory, setNewHistory] = useState('');

  const handleAddRule = () => {
    if (newRule.trim()) {
      const updated = [...rules, newRule.trim()];
      setRules(updated);
      setNewRule('');
      onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules: updated, factions, history });
    }
  };

  const handleRemoveRule = (index: number) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
    onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules: updated, factions, history });
  };

  const handleAddFaction = () => {
    if (newFaction.trim()) {
      const updated = [...factions, newFaction.trim()];
      setFactions(updated);
      setNewFaction('');
      onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules, factions: updated, history });
    }
  };

  const handleRemoveFaction = (index: number) => {
    const updated = factions.filter((_, i) => i !== index);
    setFactions(updated);
    onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules, factions: updated, history });
  };

  const handleAddHistory = () => {
    if (newHistory.trim()) {
      const updated = [...history, newHistory.trim()];
      setHistory(updated);
      setNewHistory('');
      onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules, factions, history: updated });
    }
  };

  const handleRemoveHistory = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location, rules, factions, history: updated });
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setWorldName(template);
    onWorldBuildingChange({ name: template, genre: '', time: timeSetting, location, rules, factions, history });
  };

  return (
    <div className="space-y-8">
      {/* 灵感来源 */}
      {ideas.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">来自创意灵感</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ideas.slice(0, 3).map((idea, i) => (
              <span key={i} className="px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-blue-100">
                {idea.content.slice(0, 50)}...
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 世界观模板 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择世界观模板（可选）
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WORLD_TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => handleTemplateSelect(template.name)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedTemplate === template.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1">{template.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 世界名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          世界/作品名称
        </label>
        <input
          type="text"
          value={worldName}
          onChange={(e) => {
            setWorldName(e.target.value);
            onWorldBuildingChange({ name: e.target.value, genre: '', time: timeSetting, location, rules, factions, history });
          }}
          placeholder="为你的故事世界起个名字..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 时间设定 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          时间设定
        </label>
        <input
          type="text"
          value={timeSetting}
          onChange={(e) => {
            setTimeSetting(e.target.value);
            onWorldBuildingChange({ name: worldName, genre: '', time: e.target.value, location, rules, factions, history });
          }}
          placeholder="例如：2024年、现代都市、远古时代、未来3000年..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 地点设定 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          主要地点
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            onWorldBuildingChange({ name: worldName, genre: '', time: timeSetting, location: e.target.value, rules, factions, history });
          }}
          placeholder="故事发生的主要场景或地点..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 世界规则 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          世界规则 / 设定
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
            placeholder="添加一条世界规则..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            onClick={handleAddRule}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
        <div className="space-y-2">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-700">{rule}</span>
              <button
                onClick={() => handleRemoveRule(i)}
                className="p-1 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 势力/阵营 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          主要势力 / 阵营
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newFaction}
            onChange={(e) => setNewFaction(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFaction()}
            placeholder="添加一个势力或阵营..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            onClick={handleAddFaction}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {factions.map((faction, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {faction}
              <button
                onClick={() => handleRemoveFaction(i)}
                className="hover:text-red-500 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 世界历史 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          重要历史事件
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newHistory}
            onChange={(e) => setNewHistory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddHistory()}
            placeholder="添加一个重要的历史事件..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            onClick={handleAddHistory}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
        <div className="space-y-2">
          {history.map((event, i) => (
            <div key={i} className="flex items-start justify-between bg-gray-50 rounded-lg px-4 py-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">#{i + 1}</span>
                <span className="text-sm text-gray-700">{event}</span>
              </div>
              <button
                onClick={() => handleRemoveHistory(i)}
                className="p-1 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
