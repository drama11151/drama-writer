import { useState, useEffect } from 'react';
import { Feather, Save, BookOpen, Sparkles, ArrowLeft, ArrowRight, Quote, Moon, Sun, Wind } from 'lucide-react';

// 文学形式配置
const LITERARY_FORMATS = [
  { key: 'poetry', name: '诗词', icon: '🌸', desc: '古风今韵，诗意盎然' },
  { key: 'prose', name: '散文', icon: '🍃', desc: '形散神聚，随性而至' },
  { key: 'lyrics', name: '歌词', icon: '🎵', desc: '旋律流淌，词韵悠长' },
  { key: 'fairy-tale', name: '童话', icon: '✨', desc: '童心未泯，梦幻世界' },
  { key: 'fable', name: '寓言', icon: '🦊', desc: '借物喻理，含蓄深远' },
  { key: 'crosstalk', name: '相声', icon: '🎭', desc: '说学逗唱，妙趣横生' },
  { key: 'sketch', name: '小品', icon: '🎬', desc: '短小精悍，一针见血' },
];

interface FreeWriteModeProps {
  format: string;
  onClose?: () => void;
  onSave?: (content: string, format: string) => void;
}

export default function FreeWriteMode({ format, onClose, onSave }: FreeWriteModeProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(format || 'poetry');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 从 localStorage 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem(`free-write-${selectedFormat}`);
    if (draft) {
      const parsed = JSON.parse(draft);
      setContent(parsed.content || '');
      setTitle(parsed.title || '');
      if (parsed.savedAt) {
        setLastSaved(new Date(parsed.savedAt));
      }
    } else {
      setContent('');
      setTitle('');
    }
  }, [selectedFormat]);

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content || title) {
        saveDraft();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, title, selectedFormat]);

  const saveDraft = () => {
    setIsSaving(true);
    const draft = {
      content,
      title,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(`free-write-${selectedFormat}`, JSON.stringify(draft));
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
    onSave?.(content, selectedFormat);
  };

  const currentFormatInfo = LITERARY_FORMATS.find(f => f.key === selectedFormat) || LITERARY_FORMATS[0];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 顶部装饰 */}
      <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      
      {/* 留白模式标题 */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 pl-16">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
              <Feather className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">留白创作</h1>
              <p className="text-xs text-gray-500">自由书写，随心而作</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isSaving ? (
              <span className="text-blue-500 flex items-center gap-1">
                <Sparkles className="w-4 h-4 animate-pulse" /> 保存中...
              </span>
            ) : lastSaved ? (
              <span className="text-green-500">✓ 已保存 {formatTime(lastSaved)}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* 创作区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 形式选择 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {LITERARY_FORMATS.map((fmt) => (
            <button
              key={fmt.key}
              onClick={() => setSelectedFormat(fmt.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all ${
                selectedFormat === fmt.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="mr-1">{fmt.icon}</span>
              {fmt.name}
            </button>
          ))}
        </div>

        {/* 当前形式提示 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
              {currentFormatInfo.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{currentFormatInfo.name}</h3>
              <p className="text-sm text-gray-500">{currentFormatInfo.desc}</p>
            </div>
          </div>
        </div>

        {/* 创作面板 */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 标题输入 */}
          <div className="px-6 pt-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getTitlePlaceholder(selectedFormat)}
              className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none bg-transparent"
            />
            <div className="h-px bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 my-4" />
          </div>

          {/* 内容输入 */}
          <div className="px-6 pb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getContentPlaceholder(selectedFormat)}
              className="w-full h-96 text-gray-700 leading-relaxed placeholder-gray-300 border-none outline-none resize-none bg-transparent"
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* 底部工具栏 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">
                {content.length} 字
              </span>
              {lastSaved && (
                <span className="text-xs text-gray-400">
                  自动保存于 {formatTime(lastSaved)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveDraft}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>

        {/* 创作提示 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <Quote className="w-6 h-6 text-blue-400 mb-2" />
            <h4 className="font-bold text-gray-700 mb-1">灵感随记</h4>
            <p className="text-xs text-gray-500">捕捉一闪而过的灵感，随性记录</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <Moon className="w-6 h-6 text-purple-400 mb-2" />
            <h4 className="font-bold text-gray-700 mb-1">心绪流淌</h4>
            <p className="text-xs text-gray-500">让情感自然流露，不拘形式</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-100">
            <Wind className="w-6 h-6 text-pink-400 mb-2" />
            <h4 className="font-bold text-gray-700 mb-1">留白之美</h4>
            <p className="text-xs text-gray-500">不求完美，只求真诚表达</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 根据形式获取标题占位符
function getTitlePlaceholder(format: string): string {
  const placeholders: Record<string, string> = {
    poetry: '无题',
    prose: '散文的标题',
    lyrics: '歌曲名称',
    'fairy-tale': '童话故事名',
    fable: '寓言标题',
    crosstalk: '相声节目名',
    sketch: '小品名称',
  };
  return placeholders[format] || '无题';
}

// 根据形式获取内容占位符
function getContentPlaceholder(format: string): string {
  const placeholders: Record<string, string> = {
    poetry: '落霞与孤鹜齐飞，秋水共长天一色...\n\n在这里挥洒你的诗意',
    prose: '提笔写下心中的思绪，让文字自由流淌...\n\n散文之美，在于形散神聚',
    lyrics: '前奏响起，旋律在心中流淌...\n\n填入你的词句',
    'fairy-tale': '很久很久以前...\n\n编织属于你的童话世界',
    fable: '在一片神秘的森林里...\n\n讲述一个深刻的道理',
    crosstalk: '甲：各位观众朋友们好！\n乙：您好您您好！\n\n开始你的相声创作',
    sketch: '道具：\n人物：\n\n开始你的小品剧本',
  };
  return placeholders[format] || '开始你的创作...';
}
