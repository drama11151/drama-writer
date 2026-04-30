import { useState } from 'react';
import { Sparkles, Copy, Check, RotateCcw, Wand2, MessageSquare, Sparkle, Lightbulb } from 'lucide-react';

interface PolishEditorProps {
  content: string;
  format?: string;
  onPolishedChange: (data: PolishedData) => void;
}

interface PolishedData {
  original: string;
  polished: string;
  suggestions: string[];
  mode: 'polish' | 'suggest';
}

const POLISH_MODES = [
  { id: 'polish', label: '润色优化', icon: Sparkle, desc: '改善表达，提升文采' },
  { id: 'suggest', label: '建议修改', icon: Lightbulb, desc: '发现问题，提出建议' },
];

const POLISH_LEVELS = [
  { id: 'light', label: '轻度润色', desc: '保持原意，仅调整表达' },
  { id: 'medium', label: '中度优化', desc: '改善节奏和流畅度' },
  { id: 'heavy', label: '深度改写', desc: '大幅提升，可改变结构' },
];

export default function PolishEditor({ content, format, onPolishedChange }: PolishEditorProps) {
  const [originalContent, setOriginalContent] = useState(content || '');
  const [polishedContent, setPolishedContent] = useState('');
  const [selectedMode, setSelectedMode] = useState<'polish' | 'suggest'>('polish');
  const [selectedLevel, setSelectedLevel] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handlePolish = async () => {
    if (!originalContent.trim()) return;
    
    setIsProcessing(true);
    
    // 模拟AI润色过程
    setTimeout(() => {
      const polished = originalContent
        .replace(/的/g, '的')
        .replace(/了/g, '了');
      
      setPolishedContent(polished);
      setSuggestions([
        '建议增加一些环境描写来烘托氛围',
        '人物对话可以更加口语化',
        '结尾略显仓促，建议增加一个反转或悬念',
      ]);
      setIsProcessing(false);
      
      onPolishedChange({
        original: originalContent,
        polished,
        suggestions: [
          '建议增加一些环境描写来烘托氛围',
          '人物对话可以更加口语化',
          '结尾略显仓促，建议增加一个反转或悬念',
        ],
        mode: selectedMode,
      });
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(polishedContent || originalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPolishedContent('');
    setSuggestions([]);
    onPolishedChange({
      original: originalContent,
      polished: '',
      suggestions: [],
      mode: selectedMode,
    });
  };

  return (
    <div className="space-y-8">
      {/* 创作形式 */}
      {format && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">当前创作形式：</span>
            <span className="text-sm text-blue-600 font-semibold">
              {format === 'poetry' ? '诗词' :
               format === 'prose' ? '散文' :
               format === 'lyrics' ? '歌词' :
               format === 'novel' ? '小说' :
               format === 'short-drama' ? '短剧' :
               format === 'crosstalk' ? '相声' :
               format === 'sketch' ? '小品' :
               format === 'stage-play' ? '话剧' :
               format === 'fable' ? '寓言' :
               format === 'fairy-tale' ? '童话' :
               format === 'speech' ? '演讲稿' :
               format === 'brand-story' ? '品牌故事' :
               format === 'wechat-article' ? '公众号文章' :
               format === 'advertising' ? '广告文案' : '故事'}
            </span>
          </div>
        </div>
      )}

      {/* 润色模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择润色模式
        </label>
        <div className="grid grid-cols-2 gap-4">
          {POLISH_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id as 'polish' | 'suggest')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedMode === mode.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <mode.icon className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">{mode.label}</span>
              </div>
              <p className="text-sm text-gray-500">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 润色程度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          润色程度
        </label>
        <div className="flex gap-2">
          {POLISH_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id as 'light' | 'medium' | 'heavy')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                selectedLevel === level.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="font-medium text-gray-900 text-sm">{level.label}</div>
              <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 原文输入 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            原文
          </label>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            重置
          </button>
        </div>
        <textarea
          value={originalContent}
          onChange={(e) => setOriginalContent(e.target.value)}
          placeholder="粘贴你想要润色的内容..."
          rows={10}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* 操作按钮 */}
      <button
        onClick={handlePolish}
        disabled={!originalContent.trim() || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            润色中...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            开始{selectedMode === 'polish' ? '润色' : '建议'}
          </>
        )}
      </button>

      {/* 润色结果 */}
      {polishedContent && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">润色结果</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    复制
                  </>
                )}
              </button>
            </div>
            <textarea
              value={polishedContent}
              onChange={(e) => setPolishedContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-green-200 bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
            />
          </div>

          {/* 建议列表 */}
          {suggestions.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">修改建议</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/50 rounded-lg px-3 py-2">
                    <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded">建议 {i + 1}</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
