import React, { useState } from 'react';
import { Castle, Sparkles, Users, Wand2 } from 'lucide-react';

interface FairyTaleWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 童话类型
const FAIRY_TYPES = [
  { id: 'magic', name: '魔法童话', desc: '有魔法元素的奇幻故事' },
  { id: 'animal', name: '动物童话', desc: '以动物为主角的温馨故事' },
  { id: 'adventure', name: '冒险童话', desc: '主角踏上冒险之旅' },
  { id: 'fantasy', name: '幻想童话', desc: '充满想象力的奇妙世界' },
];

// 常见童话元素
const FAIRY_ELEMENTS = [
  '魔法', '精灵', '公主', '王子', '龙', '巫师', '独角兽', '会说话的动物',
  '神奇的物品', '许愿', '变形', '隐身', '时间魔法', '空间魔法'
];

interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'helper' | 'mentor';
  desc: string;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const FairyTaleWriter: React.FC<FairyTaleWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [fairyType, setFairyType] = useState(FAIRY_TYPES[0]);
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: '', role: 'protagonist', desc: '' },
  ]);
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', title: '第一章', content: '' },
  ]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [moral, setMoral] = useState(''); // 故事寓意
  const [showGuide, setShowGuide] = useState(false);

  // 切换童话元素
  const toggleElement = (element: string) => {
    setSelectedElements(prev =>
      prev.includes(element) ? prev.filter(e => e !== element) : [...prev, element]
    );
  };

  // 添加角色
  const addCharacter = () => {
    setCharacters([...characters, { id: Date.now().toString(), name: '', role: 'helper', desc: '' }]);
  };

  // 更新角色
  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // 添加章节
  const addChapter = () => {
    setChapters([...chapters, { id: Date.now().toString(), title: `第${chapters.length + 1}章`, content: '' }]);
  };

  // 更新章节
  const updateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters(chapters.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: fairyType.name,
      elements: selectedElements,
      characters,
      chapters,
      moral,
    });
    onSave(fullContent);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      protagonist: '主角',
      antagonist: '反派',
      helper: '帮助者',
      mentor: '导师'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      protagonist: 'blue',
      antagonist: 'rose',
      helper: 'green',
      mentor: 'purple'
    };
    return colors[role] || 'gray';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Castle className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">童话写作</h3>
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
            保存童话
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
                <li>• 童话要符合儿童心理，简洁有趣</li>
                <li>• 善恶分明，结局要美好</li>
                <li>• 想象丰富，但要有逻辑</li>
                <li>• {topic || '围绕选定主题'}，讲述一个精彩的故事</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">童话名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入童话名..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 童话类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">童话类型</label>
            <div className="grid grid-cols-2 gap-2">
              {FAIRY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFairyType(type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    fairyType.id === type.id
                      ? 'bg-pink-50 border-pink-400'
                      : 'bg-white border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className={`font-medium ${fairyType.id === type.id ? 'text-pink-700' : 'text-gray-700'}`}>
                    {type.name}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 童话元素 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Wand2 className="w-4 h-4 text-purple-500" />
                魔法元素（可选）
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {FAIRY_ELEMENTS.map((element) => (
                <button
                  key={element}
                  onClick={() => toggleElement(element)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedElements.includes(element)
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          {/* 角色设定 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  角色设定
                </span>
              </label>
              <button
                onClick={addCharacter}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加角色
              </button>
            </div>
            <div className="space-y-2">
              {characters.map((char) => (
                <div key={char.id} className="flex gap-2 items-start">
                  <select
                    value={char.role}
                    onChange={(e) => updateCharacter(char.id, { role: e.target.value as Character['role'] })}
                    className={`text-xs px-2 py-1 border rounded ${
                      getRoleColor(char.role) === 'blue' ? 'border-blue-300 bg-blue-50' :
                      getRoleColor(char.role) === 'rose' ? 'border-rose-300 bg-rose-50' :
                      getRoleColor(char.role) === 'green' ? 'border-green-300 bg-green-50' :
                      'border-purple-300 bg-purple-50'
                    }`}
                  >
                    <option value="protagonist">主角</option>
                    <option value="antagonist">反派</option>
                    <option value="helper">帮助者</option>
                    <option value="mentor">导师</option>
                  </select>
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                    placeholder="角色名"
                    className="w-28 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                  <input
                    type="text"
                    value={char.desc}
                    onChange={(e) => updateCharacter(char.id, { desc: e.target.value })}
                    placeholder="角色特点"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 章节内容 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">故事正文</label>
              <button
                onClick={addChapter}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加章节
              </button>
            </div>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                      className="font-medium text-gray-700 bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <textarea
                    value={chapter.content}
                    onChange={(e) => updateChapter(chapter.id, { content: e.target.value })}
                    placeholder={`写下${chapter.title || '这一章'}的故事内容...\n\n• 注意语言要生动有趣，适合儿童阅读\n• 善恶分明，结局美好\n• 可以加入之前选择的魔法元素`}
                    rows={6}
                    className="w-full px-4 py-3 text-sm leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 故事寓意 */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-pink-800 mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                故事寓意（可选）
              </span>
            </label>
            <textarea
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              placeholder="这个童话想要告诉小读者什么道理？"
              rows={2}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairyTaleWriter;
