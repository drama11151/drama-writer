import React, { useState } from 'react';
import { FileText, Sparkles, Feather, Heart, AlignLeft } from 'lucide-react';

interface ProseWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 散文类型
const PROSE_TYPES = [
  { id: 'narrative', name: '叙事散文', desc: '以记叙人物、事件为主' },
  { id: 'lyric', name: '抒情散文', desc: '以抒发感情为主' },
  { id: 'scenic', name: '写景散文', desc: '以描写景物为主' },
  { id: 'philosophical', name: '哲理散文', desc: '以阐述道理为主' },
  { id: 'essay', name: '随笔杂文', desc: '自由随性，见解独特' },
];

// 修辞手法
const RHETORIC = [
  '比喻', '拟人', '排比', '夸张', '对偶', '反复', '设问', '反问', '借代', '象征'
];

const ProseWriter: React.FC<ProseWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [proseType, setProseType] = useState(PROSE_TYPES[0]);
  const [proseContent, setProseContent] = useState(initialContent);
  const [emotion, setEmotion] = useState(''); // 情感基调
  const [theme, setTheme] = useState(''); // 主题立意
  const [selectedRhetoric, setSelectedRhetoric] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  // 切换修辞
  const toggleRhetoric = (r: string) => {
    setSelectedRhetoric(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: proseType.name,
      emotion,
      theme,
      rhetoric: selectedRhetoric,
      content: proseContent,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Feather className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">散文写作</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showGuide ? '隐藏指南' : '创作指南'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            保存散文
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 创作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 散文特点是"形散神聚"，选材自由但主题集中</li>
                <li>• 注重情感的真实与细腻表达</li>
                <li>• 善用修辞，让文字更具感染力</li>
                <li>• {topic || '围绕选定主题'}，融入个人独特体验</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入散文标题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 散文类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">散文类型</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PROSE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProseType(type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    proseType.id === type.id
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    proseType.id === type.id ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {type.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 情感基调 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500" />
                情感基调
              </span>
            </label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="如：温暖感伤、宁静悠远、激昂奋进..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 主题立意 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <AlignLeft className="w-4 h-4 text-purple-500" />
                主题立意
              </span>
            </label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="明确你想要表达的核心思想或感悟..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
            />
          </div>

          {/* 修辞手法 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">可运用修辞</label>
            <div className="flex flex-wrap gap-2">
              {RHETORIC.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRhetoric(r)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedRhetoric.includes(r)
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* 散文正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">正文</label>
            <textarea
              value={proseContent}
              onChange={(e) => setProseContent(e.target.value)}
              placeholder="挥洒笔墨，写下你的散文..."
              rows={15}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {proseContent.length} 字
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProseWriter;
