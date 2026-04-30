import { useState } from 'react';
import { Wand2, Sparkles, ChevronRight, Copy, Check, Loader2 } from 'lucide-react';
import type { Character, StoryOutline, Episode, Scene } from '../types';

export interface GeneratedScript {
  title: string;
  summary: string;
  scenes: GeneratedScene[];
}

interface GeneratedScene {
  id: string;
  location: string;
  time: string;
  characters: string[];
  mood: string;
  camera: string;
  plotPoint: string;
  action: string;
  dialogues: { character: string; content: string }[];
}

interface ScriptGeneratorProps {
  characters: Character[];
  outline?: StoryOutline | null;
  existingEpisodes: Episode[];
  projectTitle?: string;
  onApply: (scenes: Scene[]) => void;
  onClose: () => void;
}

export default function ScriptGenerator({
  characters,
  outline,
  existingEpisodes,
  projectTitle = '未命名剧本',
  onApply,
  onClose,
}: ScriptGeneratorProps) {
  const [step, setStep] = useState<'configure' | 'generating' | 'preview'>('configure');
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [copied, setCopied] = useState(false);

  // 配置选项
  const [config, setConfig] = useState({
    episodeCount: 1,
    scenesPerEpisode: 5,
    primaryCharacter: '',
    theme: '',
    tone: '紧张',
    targetAudience: '年轻女性',
    plotDirection: '',
  });

  // 可选剧情方向
  const plotDirections = [
    '感情升温',
    '误会冲突',
    '事业突破',
    '家庭危机',
    '悬疑揭秘',
    '热血复仇',
    '甜蜜日常',
    '命运转折',
  ];

  // 情绪基调
  const tones = [
    { id: '紧张', color: 'bg-red-500', desc: '高能紧凑，悬念迭起' },
    { id: '温馨', color: 'bg-orange-500', desc: '温暖治愈，情感细腻' },
    { id: '搞笑', color: 'bg-yellow-500', desc: '轻松幽默，欢乐解压' },
    { id: '虐心', color: 'bg-purple-500', desc: '情感冲击，催人泪下' },
    { id: '热血', color: 'bg-blue-500', desc: '激昂澎湃，热血沸腾' },
    { id: '悬疑', color: 'bg-gray-700', desc: '神秘烧脑，层层反转' },
  ];

  // 模拟生成剧本
  const handleGenerate = () => {
    setStep('generating');
    
    // 模拟AI生成过程
    setTimeout(() => {
      const script: GeneratedScript = {
        title: `${projectTitle} 第${config.episodeCount}集`,
        summary: `本集聚焦于${characters.find(c => c.id === config.primaryCharacter)?.name || '主角'}在${config.plotDirection || '关键剧情'}中的成长与转变，经历了与家人的冲突、与朋友的误会，最终在关键时刻做出重要选择，推动故事进入新阶段。`,
        scenes: [],
      };

      // 生成场景
      for (let i = 0; i < config.scenesPerEpisode; i++) {
        const sceneCharacters = characters.slice(0, Math.floor(Math.random() * 3) + 1).map(c => c.id);
        
        script.scenes.push({
          id: crypto.randomUUID(),
          location: getRandomLocation(i),
          time: i < 3 ? 'day' : i < 5 ? 'dusk' : 'night',
          characters: sceneCharacters,
          mood: config.tone,
          camera: ['wide', 'medium', 'close', 'tracking'][Math.floor(Math.random() * 4)],
          plotPoint: getPlotPoint(i, config.scenesPerEpisode),
          action: generateAction(i, config),
          dialogues: generateDialogues(sceneCharacters, i, config),
        });
      }

      setGeneratedScript(script);
      setStep('preview');
    }, 2000);
  };

  const getRandomLocation = (index: number) => {
    const locations = [
      '主角家中', '公司办公室', '咖啡厅', '餐厅', '街道', 
      '公园', '商场', '医院', '学校', '酒吧', '车内'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getPlotPoint = (index: number, total: number) => {
    const points = ['opening', 'conflict', 'emotion', 'twist', 'climax', 'resolution'];
    if (index === 0) return 'opening';
    if (index === total - 1) return 'resolution';
    if (index === Math.floor(total / 2)) return 'climax';
    return points[Math.floor(Math.random() * 3) + 1];
  };

  const generateAction = (index: number, cfg: typeof config) => {
    const actions = [
      `${characters.find(c => c.id === cfg.primaryCharacter)?.name || '主角'}走进{location}，神情凝重地看了看手机。`,
      `{character}正在和助理讨论工作，突然被一个电话打断。`,
      `咖啡厅里，{character}和{character2}相对而坐，气氛有些尴尬。`,
      `{character}独自走在回家的路上，回想着今天发生的一切。`,
      `办公室里，{character}正在加班，窗外已经天黑了。`,
    ];
    return actions[index % actions.length];
  };

  const generateDialogues = (sceneCharacters: string[], index: number, cfg: typeof config) => {
    const dialogues = [];
    const charNames = sceneCharacters.map(id => characters.find(c => c.id === id)?.name || '未知');
    
    if (charNames.length > 0) {
      dialogues.push({
        character: charNames[0],
        content: getDialogueContent(index, cfg),
      });
    }
    if (charNames.length > 1) {
      dialogues.push({
        character: charNames[1],
        content: getResponseContent(index, cfg),
      });
    }
    return dialogues;
  };

  const getDialogueContent = (index: number, cfg: typeof config) => {
    const contents = [
      `我真的不知道该怎么办了，这件事情太突然了。`,
      `你听我解释，事情不是你想象的那样...`,
      `不管怎样，我都不会放弃的，这是我的选择。`,
      `谢谢你一直陪在我身边，没有你我真的撑不下去。`,
      `我必须做出决定，哪怕这个决定很艰难。`,
    ];
    return contents[index % contents.length];
  };

  const getResponseContent = (index: number, cfg: typeof config) => {
    const contents = [
      `我理解你的感受，但有些事情需要时间。`,
      `别担心，我们会一起面对的。`,
      `也许这就是命运的安排吧。`,
      `我相信你，你一定可以做到的。`,
      `不管发生什么，我都站在你这边。`,
    ];
    return contents[index % contents.length];
  };

  const handleApply = () => {
    if (!generatedScript) return;
    
    // 转换GeneratedScene为Scene
    const scenes: Scene[] = generatedScript.scenes.map(gs => ({
      id: gs.id,
      location: gs.location,
      time: gs.time as Scene['time'],
      characters: gs.characters,
      action: gs.action,
      dialogue: gs.dialogues.map(d => ({
        characterId: characters.find(c => c.name === d.character)?.id || '',
        content: d.content,
      })),
    }));
    
    onApply(scenes);
    onClose();
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    
    let text = `# ${generatedScript.title}\n\n`;
    text += `## 剧情概要\n${generatedScript.summary}\n\n`;
    
    generatedScript.scenes.forEach((scene, index) => {
      text += `---\n\n### 场景${index + 1}: ${scene.location} (${scene.time === 'day' ? '日' : scene.time === 'night' ? '夜' : scene.time === 'dusk' ? '黄昏' : '黎明'})\n\n`;
      text += `**情绪**: ${scene.mood} | **镜头**: ${scene.camera} | **节点**: ${scene.plotPoint}\n\n`;
      text += `**场景动作**: ${scene.action}\n\n`;
      scene.dialogues.forEach(d => {
        text += `【${d.character}】\n${d.content}\n\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">AI一键生成剧本</h2>
                <p className="text-sm text-gray-500">结合角色、大纲生成完整剧本</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-2">
              ✕
            </button>
          </div>
          
          {/* 步骤指示器 */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${step === 'configure' ? 'bg-blue-500 text-white' : 'bg-green-100 text-green-700'}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {step !== 'configure' ? '✓' : '1'}
              </span>
              配置
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              step === 'preview' ? 'bg-green-100 text-green-700' : step === 'generating' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {step === 'preview' ? '✓' : step === 'generating' ? '...' : '2'}
              </span>
              生成
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              step === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
              预览
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'configure' && (
            <div className="space-y-6">
              {/* 基本配置 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">集数与场景</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">生成集数</label>
                    <select
                      value={config.episodeCount}
                      onChange={(e) => setConfig(c => ({ ...c, episodeCount: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>第{existingEpisodes.length + n}集</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">每集场景数</label>
                    <select
                      value={config.scenesPerEpisode}
                      onChange={(e) => setConfig(c => ({ ...c, scenesPerEpisode: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {[3, 4, 5, 6, 8, 10].map(n => (
                        <option key={n} value={n}>{n}个场景</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 主角选择 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">主角设置</h3>
                <div className="flex flex-wrap gap-2">
                  {characters.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setConfig(cf => ({ ...cf, primaryCharacter: c.id }))}
                      className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                        config.primaryCharacter === c.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 剧情方向 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">剧情方向</h3>
                <div className="flex flex-wrap gap-2">
                  {plotDirections.map(dir => (
                    <button
                      key={dir}
                      onClick={() => setConfig(cf => ({ ...cf, plotDirection: dir }))}
                      className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                        config.plotDirection === dir
                          ? 'bg-purple-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              {/* 情绪基调 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">情绪基调</h3>
                <div className="grid grid-cols-3 gap-3">
                  {tones.map(tone => (
                    <button
                      key={tone.id}
                      onClick={() => setConfig(cf => ({ ...cf, tone: tone.id }))}
                      className={`px-4 py-3 rounded-xl text-sm transition-all cursor-pointer text-white ${tone.color} ${
                        config.tone === tone.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="font-medium">{tone.id}</div>
                      <div className="text-xs opacity-80 mt-1">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题描述 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-4">剧情主题（可选）</h3>
                <textarea
                  value={config.theme}
                  onChange={(e) => setConfig(cf => ({ ...cf, theme: e.target.value }))}
                  placeholder="输入本集的核心主题或关键事件，例如：主角面临艰难选择，在事业和感情之间摇摆..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                />
              </div>

              {/* 已有数据预览 */}
              {outline && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    将结合以下数据进行生成
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    {outline.logline && <div>• 一句话故事：{outline.logline}</div>}
                    {outline.characters?.length > 0 && (
                      <div>• 角色：{outline.characters.map(c => c.name).join('、')}</div>
                    )}
                    {outline.genres?.length > 0 && (
                      <div>• 类型：{outline.genres.join('/')}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI正在创作中...</h3>
              <p className="text-gray-500">正在结合角色、大纲、剧情方向生成剧本</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}

          {step === 'preview' && generatedScript && (
            <div className="space-y-4">
              {/* 脚本头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{generatedScript.title}</h3>
                <p className="opacity-90">{generatedScript.summary}</p>
                <button
                  onClick={handleCopyScript}
                  className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制剧本'}
                </button>
              </div>

              {/* 场景列表 */}
              <div className="space-y-4">
                {generatedScript.scenes.map((scene, index) => (
                  <div key={scene.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{scene.location}</h4>
                          <p className="text-sm text-gray-500">
                            {scene.time === 'day' ? '日' : scene.time === 'night' ? '夜' : scene.time === 'dusk' ? '黄昏' : '黎明'}
                            {' · '}
                            {scene.mood}
                            {' · '}
                            {scene.camera === 'wide' ? '全景' : scene.camera === 'medium' ? '中景' : scene.camera === 'close' ? '特写' : scene.camera === 'tracking' ? '跟拍' : '固定'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${
                        scene.plotPoint === 'opening' ? 'bg-blue-500' :
                        scene.plotPoint === 'climax' ? 'bg-orange-500' :
                        scene.plotPoint === 'resolution' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}>
                        {scene.plotPoint === 'opening' ? '开场' :
                         scene.plotPoint === 'climax' ? '高潮' :
                         scene.plotPoint === 'resolution' ? '解决' :
                         scene.plotPoint === 'twist' ? '反转' :
                         scene.plotPoint === 'emotion' ? '情感' : '冲突'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 italic">{scene.action}</p>
                    
                    <div className="space-y-2">
                      {scene.dialogues.map((d, dIndex) => (
                        <div key={dIndex} className="flex gap-3">
                          <span className="text-blue-500 font-medium text-sm whitespace-nowrap">
                            {d.character}：
                          </span>
                          <span className="text-gray-700 text-sm">{d.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            {step === 'configure' && (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!config.primaryCharacter}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  一键生成剧本
                </button>
              </>
            )}
            
            {step === 'generating' && (
              <div className="w-full text-center text-gray-500">
                生成中，请稍候...
              </div>
            )}
            
            {step === 'preview' && (
              <>
                <button
                  onClick={() => setStep('configure')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all cursor-pointer"
                >
                  重新配置
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  应用到剧本
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 导出类型供外部使用
export type { GeneratedScene };