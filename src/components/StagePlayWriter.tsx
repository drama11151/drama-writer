import React, { useState } from 'react';
import { Theater, Sparkles, Users } from 'lucide-react';

interface StagePlayWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 话剧类型
const PLAY_TYPES = [
  { id: 'tragedy', name: '悲剧', desc: '命运悲剧，性格悲剧' },
  { id: 'comedy', name: '喜剧', desc: '讽刺喜剧，幽默喜剧' },
  { id: 'drama', name: '正剧', desc: '严肃深刻' },
  { id: 'musical', name: '音乐剧', desc: '歌舞结合' },
];

interface Character {
  id: string;
  name: string;
  desc: string;
}

interface Act {
  id: string;
  title: string;
  scenes: Scene[];
}

interface Scene {
  id: string;
  title: string;
  location: string;
  time: string;
  elements: SceneElement[];
}

interface SceneElement {
  id: string;
  type: 'action' | 'dialogue' | 'stage-direction';
  content: string;
  character?: string;
}

const StagePlayWriter: React.FC<StagePlayWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [playType, setPlayType] = useState(PLAY_TYPES[1]);
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: '', desc: '' },
  ]);
  const [acts, setActs] = useState<Act[]>([
    { id: '1', title: '第一幕', scenes: [{ id: '1', title: '第一场', location: '', time: '', elements: [] }] },
  ]);
  const [showGuide, setShowGuide] = useState(false);

  // 添加角色
  const addCharacter = () => {
    setCharacters([...characters, { id: Date.now().toString(), name: '', desc: '' }]);
  };

  // 更新角色
  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setCharacters(characters.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // 添加幕
  const addAct = () => {
    const newAct: Act = {
      id: Date.now().toString(),
      title: `第${['一', '二', '三', '四', '五'][acts.length]}幕`,
      scenes: [{ id: Date.now().toString(), title: '第一场', location: '', time: '', elements: [] }],
    };
    setActs([...acts, newAct]);
  };

  // 添加场景
  const addScene = (actId: string) => {
    const act = acts.find(a => a.id === actId);
    setActs(acts.map(a => {
      if (a.id === actId) {
        return {
          ...a,
          scenes: [...a.scenes, {
            id: Date.now().toString(),
            title: `第${['一', '二', '三', '四'][act?.scenes.length || 0]}场`,
            location: '',
            time: '',
            elements: []
          }]
        };
      }
      return a;
    }));
  };

  // 添加元素
  const addElement = (actId: string, sceneId: string, type: 'action' | 'dialogue' | 'stage-direction') => {
    const newElement: SceneElement = {
      id: Date.now().toString(),
      type,
      content: '',
      character: type === 'dialogue' ? characters[0]?.name : undefined,
    };
    setActs(acts.map(a => {
      if (a.id === actId) {
        return {
          ...a,
          scenes: a.scenes.map(s => {
            if (s.id === sceneId) {
              return { ...s, elements: [...s.elements, newElement] };
            }
            return s;
          })
        };
      }
      return a;
    }));
  };

  // 更新元素
  const updateElement = (actId: string, sceneId: string, elementId: string, updates: Partial<SceneElement>) => {
    setActs(acts.map(a => {
      if (a.id === actId) {
        return {
          ...a,
          scenes: a.scenes.map(s => {
            if (s.id === sceneId) {
              return {
                ...s,
                elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e)
              };
            }
            return s;
          })
        };
      }
      return a;
    }));
  };

  // 删除元素
  const deleteElement = (actId: string, sceneId: string, elementId: string) => {
    setActs(acts.map(a => {
      if (a.id === actId) {
        return {
          ...a,
          scenes: a.scenes.map(s => {
            if (s.id === sceneId) {
              return { ...s, elements: s.elements.filter(e => e.id !== elementId) };
            }
            return s;
          })
        };
      }
      return a;
    }));
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: playType.name,
      characters,
      acts,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Theater className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">话剧写作</h3>
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
            保存剧本
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 创作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 话剧讲究"三一律"：时间、地点、情节统一</li>
                <li>• 对话是灵魂，要符合人物性格</li>
                <li>• 舞台提示要精炼，交代关键信息</li>
                <li>• {topic || '围绕主题'}，制造戏剧冲突</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">剧名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入话剧名..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 话剧类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">戏剧类型</label>
            <div className="flex flex-wrap gap-2">
              {PLAY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPlayType(type)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    playType.id === type.id
                      ? 'bg-blue-100 border-blue-400 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {type.name}
                  <span className="text-xs text-gray-400 ml-1">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 人物表 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-purple-500" />
                  人物表
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
              {characters.map((char, index) => (
                <div key={char.id} className="flex gap-2">
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                    placeholder={`角色${index + 1}名`}
                    className="w-1/3 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    value={char.desc}
                    onChange={(e) => updateCharacter(char.id, { desc: e.target.value })}
                    placeholder="人物简介"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 剧本结构 */}
          <div className="space-y-6">
            {acts.map((act) => (
              <div key={act.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-medium text-gray-800">
                  {act.title}
                </div>
                
                {act.scenes.map((scene) => (
                  <div key={scene.id} className="border-b border-gray-200 last:border-b-0">
                    {/* 场景标题 */}
                    <div className="bg-gray-50 px-4 py-2 flex items-center gap-4 border-b border-gray-200">
                      <span className="font-medium text-gray-700">{scene.title}</span>
                      <input
                        type="text"
                        value={scene.location}
                        onChange={(e) => {
                          setActs(acts.map(a => ({
                            ...a,
                            scenes: a.scenes.map(s => s.id === scene.id ? { ...s, location: e.target.value } : s)
                          })));
                        }}
                        placeholder="场景地点"
                        className="flex-1 text-sm bg-transparent border-none focus:outline-none"
                      />
                      <input
                        type="text"
                        value={scene.time}
                        onChange={(e) => {
                          setActs(acts.map(a => ({
                            ...a,
                            scenes: a.scenes.map(s => s.id === scene.id ? { ...s, time: e.target.value } : s)
                          })));
                        }}
                        placeholder="时间"
                        className="w-24 text-sm bg-transparent border-none focus:outline-none"
                      />
                    </div>

                    {/* 场景内容 */}
                    <div className="p-4 space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => addElement(act.id, scene.id, 'stage-direction')}
                          className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded"
                        >
                          + 舞台提示
                        </button>
                        <button
                          onClick={() => addElement(act.id, scene.id, 'action')}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                        >
                          + 动作
                        </button>
                        <button
                          onClick={() => addElement(act.id, scene.id, 'dialogue')}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          + 对话
                        </button>
                      </div>

                      {scene.elements.map((element) => (
                        <div key={element.id} className="flex gap-2 items-start">
                          {element.type === 'dialogue' ? (
                            <>
                              <span className="w-20 text-sm font-medium text-blue-700 pt-2">
                                {element.character}
                              </span>
                              <div className="flex-1">
                                <textarea
                                  value={element.content}
                                  onChange={(e) => updateElement(act.id, scene.id, element.id, { content: e.target.value })}
                                  placeholder="台词..."
                                  rows={2}
                                  className="w-full px-3 py-2 border border-blue-200 rounded text-sm resize-none"
                                />
                              </div>
                              <select
                                value={element.character || ''}
                                onChange={(e) => updateElement(act.id, scene.id, element.id, { character: e.target.value })}
                                className="text-xs border rounded px-1"
                              >
                                {characters.map(c => (
                                  <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </>
                          ) : element.type === 'action' ? (
                            <>
                              <span className="w-12 text-xs text-gray-400 pt-2">动作</span>
                              <div className="flex-1 flex gap-2">
                                <textarea
                                  value={element.content}
                                  onChange={(e) => updateElement(act.id, scene.id, element.id, { content: e.target.value })}
                                  placeholder="动作描写..."
                                  rows={1}
                                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm resize-none"
                                />
                                <button
                                  onClick={() => deleteElement(act.id, scene.id, element.id)}
                                  className="text-xs text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="w-12 text-xs text-amber-500 pt-2">[</span>
                              <div className="flex-1 flex gap-1">
                                <textarea
                                  value={element.content}
                                  onChange={(e) => updateElement(act.id, scene.id, element.id, { content: e.target.value })}
                                  placeholder="舞台提示..."
                                  rows={1}
                                  className="flex-1 px-2 py-1 border border-amber-200 rounded text-sm resize-none"
                                />
                                <span className="text-xs text-amber-500 pt-1">]</span>
                                <button
                                  onClick={() => deleteElement(act.id, scene.id, element.id)}
                                  className="text-xs text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="px-4 py-2 bg-gray-50">
                  <button
                    onClick={() => addScene(act.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + 添加场景
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addAct}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + 添加一幕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagePlayWriter;
