import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Music } from 'lucide-react';

interface PoetryWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 诗词格式配置
const POETRY_FORMS = [
  { id: 'ju jue', name: '五言绝句', lines: 4, charsPerLine: 5, tone: '平起平收' },
  { id: 'lv ju jue', name: '七言绝句', lines: 4, charsPerLine: 7, tone: '仄起平收' },
  { id: 'ju lv', name: '五言律诗', lines: 8, charsPerLine: 5, tone: '平起仄收' },
  { id: 'lv lv', name: '七言律诗', lines: 8, charsPerLine: 7, tone: '仄起仄收' },
  { id: 'ci', name: '词牌', lines: 0, charsPerLine: 0, tone: '词谱' },
  { id: 'free', name: '自由诗', lines: 0, charsPerLine: 0, tone: '不限' },
];

// 常见韵脚
const RHYME_PATTERNS = [
  { id: 'ping', name: '平声韵', examples: '东、红、风、情、天、年' },
  { id: 'ze', name: '仄声韵', examples: '去、雨、暮、梦、意、泪' },
  { id: 'rong', name: '入声韵', examples: '白、竹、月、客、色、不' },
];

const PoetryWriter: React.FC<PoetryWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [selectedForm, setSelectedForm] = useState(POETRY_FORMS[0]);
  const [rhyme, setRhyme] = useState(RHYME_PATTERNS[0]);
  const [poemContent, setPoemContent] = useState(initialContent);
  const [mood, setMood] = useState(''); // 意境/情感
  const [showGuide, setShowGuide] = useState(false);

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      form: selectedForm.name,
      rhyme: rhyme.name,
      mood,
      content: poemContent,
    });
    onSave(fullContent);
  };

  // 词牌名提示
  const CI_FORMS = [
    '沁园春', '水调歌头', '念奴娇', '满江红', '西江月',
    '蝶恋花', '菩萨蛮', '清平乐', '虞美人', '临江仙'
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">诗词创作</h3>
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
            保存诗词
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
                <li>• {topic || '根据选定的主题'}，展开意境描写</li>
                <li>• 注重炼字，一字传神</li>
                <li>• 追求情景交融，意在言外</li>
                <li>• {inspiration || '融入个人情感与独特视角'}</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">诗题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入诗题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 格式选择 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 诗体选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">体裁</label>
              <div className="flex flex-wrap gap-2">
                {POETRY_FORMS.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      selectedForm.id === form.id
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {form.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 韵脚选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">韵部</label>
              <div className="flex flex-wrap gap-2">
                {RHYME_PATTERNS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRhyme(r)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      rhyme.id === r.id
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'
                    }`}
                    title={r.examples}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 词牌名（当选择词牌时显示） */}
          {selectedForm.id === 'ci' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">词牌选择</label>
              <div className="flex flex-wrap gap-2">
                {CI_FORMS.map((ci) => (
                  <button
                    key={ci}
                    onClick={() => setTitle(ci)}
                    className="px-3 py-2 text-sm rounded-lg border bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                  >
                    {ci}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 意境描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">意境 / 情感</label>
            <textarea
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="描述你想要营造的意境或情感..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm"
            />
          </div>

          {/* 诗词正文 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {selectedForm.id === 'ci' ? '词作正文' : '诗作正文'}
                {selectedForm.lines > 0 && (
                  <span className="text-gray-400 font-normal ml-2">
                    （{selectedForm.lines}句 · 每句{selectedForm.charsPerLine}字）
                  </span>
                )}
              </label>
              {selectedForm.lines > 0 && (
                <span className="text-xs text-gray-400">
                  当前字数：{poemContent.replace(/\s/g, '').length}
                </span>
              )}
            </div>
            <textarea
              value={poemContent}
              onChange={(e) => setPoemContent(e.target.value)}
              placeholder={
                selectedForm.id === 'free'
                  ? '自由挥洒，写下你的诗句...'
                  : selectedForm.lines > 0
                  ? `每句${selectedForm.charsPerLine}字，共${selectedForm.lines}句...\n注意押韵，平仄协调`
                  : '选择词牌后，参照词谱格式创作...'
              }
              rows={selectedForm.lines > 0 ? Math.max(6, selectedForm.lines / 2) : 8}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-lg leading-relaxed font-serif focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              style={{ fontFamily: 'serif' }}
            />
          </div>

          {/* 韵脚提示 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Music className="w-4 h-4" />
              <span className="font-medium">韵脚参考</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rhyme.examples.split('、').map((char) => (
                <span
                  key={char}
                  className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 text-sm"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoetryWriter;
