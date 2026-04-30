import React, { useState } from 'react';
import { FileText, Sparkles, Crown, Heart, Award, Users } from 'lucide-react';

interface BrandStoryWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 品牌调性
const BRAND_TONES = [
  { id: 'craftsman', name: '匠人精神', desc: '精益求精，注重品质' },
  { id: 'youth', name: '年轻潮流', desc: '时尚活力，引领潮流' },
  { id: 'warmth', name: '温情陪伴', desc: '温暖亲和，情感连接' },
  { id: 'tech', name: '科技创新', desc: '技术领先，未来感' },
  { id: 'luxury', name: '高端奢华', desc: '品质卓越，尊贵体验' },
  { id: 'simple', name: '简约自然', desc: '返璞归真，环保健康' },
];

// 叙事风格
const NARRATIVE_STYLES = [
  { id: 'origin', name: '起源故事', desc: '讲述品牌/产品诞生的故事' },
  { id: 'struggle', name: '奋斗历程', desc: '从困难到成功的励志叙事' },
  { id: 'inheritance', name: '传承故事', desc: '几代人的坚守与传承' },
  { id: 'breakthrough', name: '突破创新', desc: '技术/理念的重大突破' },
];

// 情感基点
const EMOTIONAL_ANCHORS = [
  { id: 'nostalgia', name: '怀旧情感' },
  { id: 'pride', name: '自豪感' },
  { id: 'trust', name: '信任感' },
  { id: 'belonging', name: '归属感' },
  { id: 'aspiration', name: '向往感' },
];

const BrandStoryWriter: React.FC<BrandStoryWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [brandTone, setBrandTone] = useState(BRAND_TONES[0]);
  const [narrativeStyle, setNarrativeStyle] = useState(NARRATIVE_STYLES[0]);
  const [emotionalAnchor, setEmotionalAnchor] = useState(EMOTIONAL_ANCHORS[0]);
  const [coreStory, setCoreStory] = useState(''); // 核心故事线
  const [brandStoryContent, setBrandStoryContent] = useState(initialContent);
  const [showGuide, setShowGuide] = useState(false);

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      brandTone: brandTone.name,
      narrativeStyle: narrativeStyle.name,
      emotionalAnchor: emotionalAnchor.name,
      coreStory,
      content: brandStoryContent,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="font-medium text-gray-800">品牌故事写作</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showGuide ? '隐藏指南' : '创作指南'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            保存故事
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 品牌故事创作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 好的品牌故事要有情感共鸣点，让读者产生连接</li>
                <li>• 真实的故事最能打动人，避免过度夸大</li>
                <li>• {topic || '围绕品牌核心价值'}，用故事传递品牌理念</li>
                <li>• 结尾要自然升华，与品牌/产品关联</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">故事标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入品牌故事标题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
            />
          </div>

          {/* 品牌调性 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4 text-amber-500" />
                品牌调性
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BRAND_TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setBrandTone(tone)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    brandTone.id === tone.id
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-white border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    brandTone.id === tone.id ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {tone.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{tone.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 叙事风格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-purple-500" />
                叙事风格
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {NARRATIVE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setNarrativeStyle(style)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    narrativeStyle.id === style.id
                      ? 'bg-purple-50 border-purple-400'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    narrativeStyle.id === style.id ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {style.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 情感基点 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500" />
                情感基点
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONAL_ANCHORS.map((anchor) => (
                <button
                  key={anchor.id}
                  onClick={() => setEmotionalAnchor(anchor)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    emotionalAnchor.id === anchor.id
                      ? 'bg-rose-100 border-rose-400 text-rose-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300'
                  }`}
                >
                  {anchor.name}
                </button>
              ))}
            </div>
          </div>

          {/* 核心故事线 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                核心故事线
              </span>
            </label>
            <textarea
              value={coreStory}
              onChange={(e) => setCoreStory(e.target.value)}
              placeholder="概括品牌故事的核心脉络...
如：从创始人一个小小的梦想开始，经过多年坚持，终于实现了..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 text-sm"
            />
          </div>

          {/* 故事正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">故事正文</label>
            <textarea
              value={brandStoryContent}
              onChange={(e) => setBrandStoryContent(e.target.value)}
              placeholder="开始撰写品牌故事...

背景设定：故事发生的时代/环境
人物塑造：创始人/核心团队的特质
冲突与挑战：遇到的困难
转折与突破：如何克服
升华与关联：故事如何体现品牌价值"
              rows={15}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {brandStoryContent.length} 字
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStoryWriter;
