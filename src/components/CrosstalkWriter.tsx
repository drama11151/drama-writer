import React, { useState } from 'react';
import { Mic2, Sparkles, Laugh, Users } from 'lucide-react';

interface CrosstalkWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 相声类型
const CROSTALK_TYPES = [
  { id: 'duikou', name: '对口相声', desc: '甲乙两人表演' },
  { id: 'dan', name: '单口相声', desc: '一人表演' },
  { id: 'xianchang', name: '现场相声', desc: '互动性强' },
  { id: 'music', name: '太平歌词', desc: '唱为主' },
];

// 包袱类型
const BAOFU_TYPES = [
  { id: 'fancha', name: '翻包子', desc: '先铺后翻' },
  { id: 'sanfan', name: '三番四抖', desc: '反复铺垫' },
  { id: 'lianhu', name: '三翻四抖', desc: '多次反转' },
  { id: 'jianjin', name: '先贱后紧', desc: '先松后紧' },
  { id: 'pidian', name: '皮笑肉不笑', desc: '冷幽默' },
];

interface Dialogue {
  id: string;
  role: 'jia' | 'yi';
  content: string;
  isBaofu: boolean;
  rhythm?: '快' | '慢' | '停顿';
}

interface Section {
  id: string;
  title: string;
  dialogues: Dialogue[];
}

const CrosstalkWriter: React.FC<CrosstalkWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [crosstalkType, setCrosstalkType] = useState(CROSTALK_TYPES[0]);
  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: '垫话', dialogues: [] },
    { id: '2', title: '正活', dialogues: [] },
    { id: '3', title: '攒底', dialogues: [] },
  ]);
  const [currentRole, setCurrentRole] = useState<'jia' | 'yi'>('jia');
  const [showGuide, setShowGuide] = useState(false);

  // 添加对话
  const addDialogue = (sectionId: string) => {
    const newDialogue: Dialogue = {
      id: Date.now().toString(),
      role: currentRole,
      content: '',
      isBaofu: false,
      rhythm: '慢',
    };
    
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, dialogues: [...s.dialogues, newDialogue] };
      }
      return s;
    }));
    
    // 角色切换
    setCurrentRole(currentRole === 'jia' ? 'yi' : 'jia');
  };

  // 更新对话
  const updateDialogue = (sectionId: string, dialogueId: string, updates: Partial<Dialogue>) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          dialogues: s.dialogues.map(d => d.id === dialogueId ? { ...d, ...updates } : d)
        };
      }
      return s;
    }));
  };

  // 删除对话
  const deleteDialogue = (sectionId: string, dialogueId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, dialogues: s.dialogues.filter(d => d.id !== dialogueId) };
      }
      return s;
    }));
  };

  // 删除段落
  const deleteSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: crosstalkType.name,
      sections,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">相声写作</h3>
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
            保存相声
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
                <li>• 相声讲究"说学逗唱"，语言要生动有趣</li>
                <li>• 铺垫要扎实，包袱要抖得响亮</li>
                <li>• 注意节奏：三番四抖，铺平垫稳</li>
                <li>• {topic || '围绕选定主题'}，找准笑点</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">相声名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入相声名..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 相声类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-purple-500" />
                表演形式
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CROSTALK_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCrosstalkType(type)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    crosstalkType.id === type.id
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {type.name}
                  <span className="text-xs text-gray-400 ml-1">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 角色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Laugh className="w-4 h-4 text-rose-500" />
                当前说话角色
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentRole('jia')}
                className={`px-6 py-2 rounded-lg border font-medium ${
                  currentRole === 'jia'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                甲
              </button>
              <button
                onClick={() => setCurrentRole('yi')}
                className={`px-6 py-2 rounded-lg border font-medium ${
                  currentRole === 'yi'
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                乙
              </button>
            </div>
          </div>

          {/* 包袱类型提示 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">包袱类型</label>
            <div className="flex flex-wrap gap-2">
              {BAOFU_TYPES.map((type) => (
                <span
                  key={type.id}
                  className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm"
                  title={type.desc}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          {/* 段落结构 */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
                  <span className="font-medium text-gray-700">{section.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addDialogue(section.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + 添话
                    </button>
                    {sections.length > 1 && (
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {section.dialogues.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      点击"添话"开始创作
                    </p>
                  ) : (
                    section.dialogues.map((dialogue) => (
                      <div key={dialogue.id} className="flex gap-2 items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          dialogue.role === 'jia'
                            ? 'bg-blue-600 text-white'
                            : 'bg-rose-500 text-white'
                        }`}>
                          {dialogue.role === 'jia' ? '甲' : '乙'}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={dialogue.content}
                            onChange={(e) => updateDialogue(section.id, dialogue.id, { content: e.target.value })}
                            placeholder="输入台词..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <label className="flex items-center gap-1 text-xs text-amber-600">
                              <input
                                type="checkbox"
                                checked={dialogue.isBaofu}
                                onChange={(e) => updateDialogue(section.id, dialogue.id, { isBaofu: e.target.checked })}
                                className="rounded"
                              />
                              包袱点
                            </label>
                            <select
                              value={dialogue.rhythm || '慢'}
                              onChange={(e) => updateDialogue(section.id, dialogue.id, { rhythm: e.target.value as '快' | '慢' | '停顿' })}
                              className="text-xs border border-gray-200 rounded px-1 py-0.5"
                            >
                              <option value="慢">慢</option>
                              <option value="快">快</option>
                              <option value="停顿">停顿</option>
                            </select>
                            <button
                              onClick={() => deleteDialogue(section.id, dialogue.id)}
                              className="text-xs text-red-500 hover:text-red-600 ml-auto"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosstalkWriter;
