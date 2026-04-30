import React, { useState } from 'react';
import { Clapperboard, Sparkles, Laugh, Users } from 'lucide-react';

interface SketchWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 小品类型
const SKETCH_TYPES = [
  { id: 'comedy', name: '喜剧小品', desc: '以笑为主' },
  { id: 'sentimental', name: '煽情小品', desc: '催泪感人' },
  { id: 'satire', name: '讽刺小品', desc: '针砭时弊' },
  { id: 'absurdist', name: '荒诞小品', desc: '天马行空' },
];

interface Character {
  id: string;
  name: string;
  role: string;
}

interface SceneElement {
  id: string;
  type: 'action' | 'dialogue' | 'stage-direction';
  content: string;
  character?: string;
  isJoke?: boolean;
}

interface Scene {
  id: string;
  title: string;
  location: string;
  elements: SceneElement[];
}

const SketchWriter: React.FC<SketchWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [sketchType, setSketchType] = useState(SKETCH_TYPES[0]);
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: '角色A', role: '' },
    { id: '2', name: '角色B', role: '' },
  ]);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: '1', title: '开场', location: '场景设定', elements: [] },
  ]);
  const [showGuide, setShowGuide] = useState(false);

  // 添加角色
  const addCharacter = () => {
    const newChar: Character = {
      id: Date.now().toString(),
      name: `角色${String.fromCharCode(65 + characters.length)}`,
      role: '',
    };
    setCharacters([...characters, newChar]);
  };

  // 更新角色
  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // 添加场景
  const addScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      title: `场景${scenes.length + 1}`,
      location: '',
      elements: [],
    };
    setScenes([...scenes, newScene]);
  };

  // 添加元素
  const addElement = (sceneId: string, type: 'action' | 'dialogue' | 'stage-direction') => {
    const newElement: SceneElement = {
      id: Date.now().toString(),
      type,
      content: '',
      character: type === 'dialogue' ? characters[0]?.name : undefined,
      isJoke: false,
    };
    setScenes(scenes.map(s => {
      if (s.id === sceneId) {
        return { ...s, elements: [...s.elements, newElement] };
      }
      return s;
    }));
  };

  // 更新元素
  const updateElement = (sceneId: string, elementId: string, updates: Partial<SceneElement>) => {
    setScenes(scenes.map(s => {
      if (s.id === sceneId) {
        return {
          ...s,
          elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e)
        };
      }
      return s;
    }));
  };

  // 删除元素
  const deleteElement = (sceneId: string, elementId: string) => {
    setScenes(scenes.map(s => {
      if (s.id === sceneId) {
        return { ...s, elements: s.elements.filter(e => e.id !== elementId) };
      }
      return s;
    }));
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: sketchType.name,
      characters,
      scenes,
    });
    onSave(fullContent);
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'action': return '💬';
      case 'dialogue': return '🎭';
      case 'stage-direction': return '📝';
      default: return '•';
    }
  };

  const getElementBg = (type: string) => {
    switch (type) {
      case 'action': return 'bg-gray-50 border-gray-300';
      case 'dialogue': return 'bg-blue-50 border-blue-300';
      case 'stage-direction': return 'bg-amber-50 border-amber-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clapperboard className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">小品写作</h3>
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
            保存小品
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
                <li>• 小品要"小中见大"，短小精悍</li>
                <li>• 建立喜剧冲突，推进情节</li>
                <li>• 笑点要自然，不尴尬</li>
                <li>• {topic || '围绕选定主题'}，制造戏剧冲突</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">小品名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入小品名..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 小品类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Laugh className="w-4 h-4 text-rose-500" />
                小品类型
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SKETCH_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSketchType(type)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    sketchType.id === type.id
                      ? 'bg-rose-100 border-rose-400 text-rose-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* 人物设定 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-500" />
                  人物设定
                </span>
              </label>
              <button
                onClick={addCharacter}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 添加角色
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {characters.map((char) => (
                <div key={char.id} className="flex gap-2">
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                    placeholder="角色名"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    value={char.role}
                    onChange={(e) => updateCharacter(char.id, { role: e.target.value })}
                    placeholder="人物特点"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 场景结构 */}
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div key={scene.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={scene.title}
                      onChange={(e) => {
                        setScenes(scenes.map(s => s.id === scene.id ? { ...s, title: e.target.value } : s));
                      }}
                      className="font-medium text-gray-700 bg-transparent border-none focus:outline-none"
                    />
                    <input
                      type="text"
                      value={scene.location}
                      onChange={(e) => {
                        setScenes(scenes.map(s => s.id === scene.id ? { ...s, location: e.target.value } : s));
                      }}
                      placeholder="场景地点"
                      className="flex-1 text-sm text-gray-500 bg-transparent border-none focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => addElement(scene.id, 'stage-direction')}
                      className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                    >
                      + 舞台提示
                    </button>
                    <button
                      onClick={() => addElement(scene.id, 'action')}
                      className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                    >
                      + 动作描写
                    </button>
                    <button
                      onClick={() => addElement(scene.id, 'dialogue')}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + 对话
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {scene.elements.map((element) => (
                    <div key={element.id} className={`p-3 rounded-lg border ${getElementBg(element.type)}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getElementIcon(element.type)}</span>
                        <div className="flex-1">
                          {element.type === 'dialogue' ? (
                            <div className="space-y-1">
                              <select
                                value={element.character || ''}
                                onChange={(e) => updateElement(scene.id, element.id, { character: e.target.value })}
                                className="text-sm font-medium border rounded px-1"
                              >
                                {characters.map(c => (
                                  <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                              <textarea
                                value={element.content}
                                onChange={(e) => updateElement(scene.id, element.id, { content: e.target.value })}
                                placeholder="输入台词..."
                                rows={2}
                                className="w-full px-2 py-1 border rounded text-sm resize-none"
                              />
                            </div>
                          ) : (
                            <textarea
                              value={element.content}
                              onChange={(e) => updateElement(scene.id, element.id, { content: e.target.value })}
                              placeholder={element.type === 'action' ? '描写动作...' : '舞台提示...'}
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-sm resize-none"
                            />
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <label className="flex items-center gap-1 text-xs text-rose-600">
                              <input
                                type="checkbox"
                                checked={element.isJoke || false}
                                onChange={(e) => updateElement(scene.id, element.id, { isJoke: e.target.checked })}
                                className="rounded"
                              />
                              笑点
                            </label>
                            <button
                              onClick={() => deleteElement(scene.id, element.id)}
                              className="text-xs text-red-500 hover:text-red-600 ml-auto"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addScene}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + 添加场景
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchWriter;
