import React, { useState } from 'react';
import { Music2, Sparkles, Mic, Repeat } from 'lucide-react';

interface LyricsWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 曲风类型
const MUSIC_STYLES = [
  { id: 'pop', name: '流行', desc: '朗朗上口，易于传唱' },
  { id: 'rock', name: '摇滚', desc: '节奏强烈，情感激烈' },
  { id: 'ballad', name: '民谣', desc: '叙事性强，情感细腻' },
  { id: 'rnb', name: 'R&B', desc: '旋律流畅，转音技巧' },
  { id: 'hiphop', name: '说唱', desc: '节奏密集，押韵密集' },
  { id: 'ballad2', name: '抒情', desc: '慢节奏，深情款款' },
];

// 歌词段落类型
const SECTION_TYPES = [
  { id: 'intro', name: '前奏/Intro', color: 'gray' },
  { id: 'verse', name: '主歌/Verse', color: 'blue' },
  { id: 'pre-chorus', name: '预副歌/Pre-Chorus', color: 'purple' },
  { id: 'chorus', name: '副歌/Chorus', color: 'rose' },
  { id: 'bridge', name: '桥段/Bridge', color: 'amber' },
  { id: 'outro', name: '尾奏/Outro', color: 'gray' },
];

interface LyricSection {
  id: string;
  type: string;
  content: string;
}

const LyricsWriter: React.FC<LyricsWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState(MUSIC_STYLES[0]);
  const [bpm, setBpm] = useState('');
  const [sections, setSections] = useState<LyricSection[]>([
    { id: '1', type: 'verse', content: '' },
    { id: '2', type: 'chorus', content: '' },
  ]);
  const [showGuide, setShowGuide] = useState(false);

  // 添加段落
  const addSection = (type: string) => {
    const newSection: LyricSection = {
      id: Date.now().toString(),
      type,
      content: '',
    };
    // 副歌后插入预副歌或主歌
    const chorusIndex = sections.findIndex(s => s.type === 'chorus');
    if (chorusIndex >= 0 && type === 'verse') {
      setSections([...sections.slice(0, chorusIndex), newSection, ...sections.slice(chorusIndex)]);
    } else {
      setSections([...sections, newSection]);
    }
  };

  // 更新段落内容
  const updateSection = (id: string, content: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  // 删除段落
  const deleteSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      style: style.name,
      bpm,
      sections,
    });
    onSave(fullContent);
  };

  const getTypeColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-600 border-gray-300',
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      rose: 'bg-rose-100 text-rose-700 border-rose-300',
      amber: 'bg-amber-100 text-amber-700 border-amber-300',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">歌词创作</h3>
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
            保存歌词
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
                <li>• {topic || '围绕选定主题'}，构思核心情感</li>
                <li>• 主歌叙述，副歌升华（Hook 要抓耳）</li>
                <li>• 注意押韵和节奏感</li>
                <li>• {inspiration || '用简洁有力的语言触动人心'}</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">歌曲名</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入歌曲名..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BPM（可选）</label>
              <input
                type="text"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="如：120"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          {/* 曲风选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Mic className="w-4 h-4 text-pink-500" />
                曲风
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSIC_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    style.id === s.id
                      ? 'bg-pink-100 border-pink-400 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* 段落结构 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                <span className="flex items-center gap-1">
                  <Repeat className="w-4 h-4 text-purple-500" />
                  歌词结构
                </span>
              </label>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="text-sm text-blue-600 hover:text-blue-700">
                  + 添加段落
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-lg w-48 border">
                  {SECTION_TYPES.map((type) => (
                    <li key={type.id}>
                      <button
                        onClick={() => addSection(type.id)}
                        className="text-sm"
                      >
                        {type.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => {
                const sectionType = SECTION_TYPES.find(t => t.id === section.type);
                return (
                  <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`px-3 py-2 flex items-center justify-between ${getTypeColor(sectionType?.color || 'gray')}`}>
                      <span className="text-sm font-medium">{sectionType?.name || section.type}</span>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-xs hover:text-red-600"
                      >
                        删除
                      </button>
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      placeholder={
                        section.type === 'chorus'
                          ? '[Hook]\n写出最抓耳的旋律线...'
                          : section.type === 'bridge'
                          ? '桥段：转折或升华...'
                          : '填入歌词...'
                      }
                      rows={section.type === 'chorus' ? 6 : 4}
                      className="w-full px-4 py-3 text-sm leading-relaxed focus:outline-none resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsWriter;
