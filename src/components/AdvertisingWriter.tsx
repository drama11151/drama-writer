import { useState } from 'react';
import { FileText, Zap, Target, Users, Sparkles, Plus, Trash2 } from 'lucide-react';
import type { Idea } from '../types';

interface AdvertisingWriterProps {
  ideas: Idea[];
  onSave?: (data: AdvertisingData) => void;
}

interface AdvertisingData {
  adType: string;
  copyStyle: string;
  targetUser: string;
  corePain: string;
  coreValue: string;
  headline: string;
  body: string;
  cta: string;
  copies: CopyVariant[];
}

interface CopyVariant {
  id: string;
  label: string;
  headline: string;
  body: string;
  cta: string;
}

const AD_TYPES = [
  { value: 'brand', label: '品牌广告', desc: '提升品牌认知' },
  { value: 'product', label: '产品广告', desc: '突出产品卖点' },
  { value: 'event', label: '活动广告', desc: '限时促销/活动' },
  { value: 'social', label: '社媒广告', desc: '朋友圈/信息流' },
  { value: 'content', label: '内容广告', desc: '种草/软广' },
  { value: 'search', label: '搜索广告', desc: 'SEM关键词文案' },
];

const COPY_STYLES = [
  { value: 'emotional', label: '情感共鸣', desc: '触动内心，建立情感连接' },
  { value: 'rational', label: '理性说服', desc: '数据/事实驱动' },
  { value: 'story', label: '故事叙事', desc: '场景代入，真实感' },
  { value: 'humor', label: '幽默趣味', desc: '轻松调侃，提高记忆' },
  { value: 'authority', label: '权威背书', desc: '专家/数据/认证' },
  { value: 'urgency', label: '紧迫稀缺', desc: '限时限量，促进行动' },
];

const CTA_TEMPLATES = [
  '立即了解', '马上购买', '免费试用', '获取报价',
  '点击咨询', '扫码领券', '预约体验', '限时抢购',
];

export default function AdvertisingWriter({ ideas, onSave }: AdvertisingWriterProps) {
  const [adType, setAdType] = useState('product');
  const [copyStyle, setCopyStyle] = useState('emotional');
  const [targetUser, setTargetUser] = useState('');
  const [corePain, setCorePain] = useState('');
  const [coreValue, setCoreValue] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('立即了解');
  const [copies, setCopies] = useState<CopyVariant[]>([]);
  const [activeTab, setActiveTab] = useState<'brief' | 'write' | 'variants'>('brief');

  const ideasText = ideas.map(i => i.content).filter(Boolean).join('\n');

  const addVariant = () => {
    const newVariant: CopyVariant = {
      id: crypto.randomUUID(),
      label: `方案 ${copies.length + 1}`,
      headline: '',
      body: '',
      cta: '立即了解',
    };
    setCopies([...copies, newVariant]);
  };

  const updateVariant = (id: string, updates: Partial<CopyVariant>) => {
    setCopies(copies.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteVariant = (id: string) => {
    setCopies(copies.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave?.({ adType, copyStyle, targetUser, corePain, coreValue, headline, body, cta, copies });
  };

  return (
    <div className="space-y-5">
      {/* 标签导航 */}
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {[
          { key: 'brief', label: '创作简报' },
          { key: 'write', label: '文案撰写' },
          { key: 'variants', label: '多版本对比' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 创作简报 */}
      {activeTab === 'brief' && (
        <div className="space-y-5">
          {/* 广告类型 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              广告类型
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AD_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setAdType(type.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    adType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 文案风格 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              文案风格
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COPY_STYLES.map(style => (
                <button
                  key={style.value}
                  onClick={() => setCopyStyle(style.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    copyStyle === style.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{style.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 目标用户 + 核心痛点 + 核心价值 */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                目标用户画像
              </label>
              <input
                type="text"
                value={targetUser}
                onChange={e => setTargetUser(e.target.value)}
                placeholder="例：25-35岁职场女性，追求品质生活，有消费能力"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                核心痛点
              </label>
              <input
                type="text"
                value={corePain}
                onChange={e => setCorePain(e.target.value)}
                placeholder="例：工作繁忙，皮肤状态差，没时间护肤"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                核心卖点/价值
              </label>
              <input
                type="text"
                value={coreValue}
                onChange={e => setCoreValue(e.target.value)}
                placeholder="例：3分钟快速护肤，成分温和有效"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 灵感参考 */}
          {ideasText && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-medium text-amber-700 mb-2">💡 创意灵感参考</p>
              <p className="text-sm text-amber-800 whitespace-pre-wrap leading-relaxed line-clamp-4">{ideasText}</p>
            </div>
          )}

          <button
            onClick={() => setActiveTab('write')}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            进入文案撰写 →
          </button>
        </div>
      )}

      {/* 文案撰写 */}
      {activeTab === 'write' && (
        <div className="space-y-5">
          {/* 简报回顾 */}
          {(targetUser || corePain || coreValue) && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 grid grid-cols-3 gap-3 text-center text-sm">
              {targetUser && <div><span className="text-gray-500 text-xs">目标用户</span><p className="font-medium text-blue-700 mt-0.5 text-xs line-clamp-1">{targetUser}</p></div>}
              {corePain && <div><span className="text-gray-500 text-xs">核心痛点</span><p className="font-medium text-orange-600 mt-0.5 text-xs line-clamp-1">{corePain}</p></div>}
              {coreValue && <div><span className="text-gray-500 text-xs">核心价值</span><p className="font-medium text-green-600 mt-0.5 text-xs line-clamp-1">{coreValue}</p></div>}
            </div>
          )}

          {/* 标题文案 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              标题文案（Hook）
              <span className="text-xs text-gray-400 font-normal">最重要的一句话，决定点击率</span>
            </label>
            <textarea
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="写一句能抓住眼球的标题文案...&#10;例：忙到没时间护肤？3分钟，回来水光肌"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">当前字数：{headline.length} 字</p>
          </div>

          {/* 正文文案 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              正文文案（Body）
              <span className="text-xs text-gray-400 font-normal">展开痛点+卖点+信任背书</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="展开描述产品/服务的价值，可以包括：&#10;· 场景描写（用户面临的问题）&#10;· 解决方案（产品/服务能做什么）&#10;· 信任背书（数据/用户评价/权威认证）&#10;· 情感升华（买了之后的美好状态）"
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">当前字数：{body.length} 字</p>
          </div>

          {/* 行动号召 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              行动号召（CTA）
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {CTA_TEMPLATES.map(t => (
                <button
                  key={t}
                  onClick={() => setCta(t)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    cta === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={cta}
              onChange={e => setCta(e.target.value)}
              placeholder="自定义行动号召..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 预览 */}
          {(headline || body) && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-3">📋 文案预览</p>
              {headline && <p className="text-base font-bold text-gray-900 mb-3">{headline}</p>}
              {body && <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{body}</p>}
              {cta && (
                <div className="mt-4">
                  <span className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                    {cta}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              保存文案
            </button>
            <button
              onClick={() => setActiveTab('variants')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              制作多版本 →
            </button>
          </div>
        </div>
      )}

      {/* 多版本对比 */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">创建多个文案版本，用于 A/B 测试</p>
            <button
              onClick={addVariant}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              新增版本
            </button>
          </div>

          {copies.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm">点击"新增版本"添加文案方案</p>
              <p className="text-xs mt-1">建议至少创建 2-3 个版本对比测试效果</p>
            </div>
          )}

          {copies.map((copy, index) => (
            <div key={copy.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={copy.label}
                  onChange={e => updateVariant(copy.id, { label: e.target.value })}
                  className="text-sm font-medium text-gray-800 border-none outline-none bg-transparent"
                />
                <button
                  onClick={() => deleteVariant(copy.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={copy.headline}
                onChange={e => updateVariant(copy.id, { headline: e.target.value })}
                placeholder="标题文案..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <textarea
                value={copy.body}
                onChange={e => updateVariant(copy.id, { body: e.target.value })}
                placeholder="正文文案..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <input
                type="text"
                value={copy.cta}
                onChange={e => updateVariant(copy.id, { cta: e.target.value })}
                placeholder="行动号召..."
                className="w-full px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
