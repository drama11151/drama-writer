import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Sun, Moon, Sunrise, Sunset, Wand2, Zap, Heart, AlertTriangle, Users, Camera, MessageSquare, Sparkles, Cloud, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Character, StoryOutline, Episode, Scene, Dialogue } from '../types';
import ScriptGenerator from './ScriptGenerator';
import { useScriptSync } from '../hooks/useScriptSync';
import { isAuthenticated } from '../services/api/auth';

interface ScriptWriterProps {
  characters: Character[];
  outline?: StoryOutline | null;
  episodes: Episode[];
  onEpisodesChange: (episodes: Episode[]) => void;
  projectTitle?: string;
  projectGenre?: string;
  writingFormat?: string;
  projectId?: string; // 新增：项目 ID，用于云端同步
}

// 格式模板（迷你版）
const FORMAT_GUIDE: Record<string, { name: string; tips: string[] }> = {
  'short-drama': {
    name: '短剧剧本',
    tips: ['【场景标头】时间+地点+人物', '【对白/独白】角色台词', '【动作提示】（括号内动作）', '每集结尾留钩子，单集800-1200字'],
  },
  'web-novel': {
    name: '网文小说',
    tips: ['【章节标题】第X章 名', '【正文】每段2-3句', '开篇黄金三章定生死', '每章结尾留钩子，2000-3000字/章'],
  },
  'movie': {
    name: '电影剧本',
    tips: ['【场景标头】INT./EXT. 时间 地点', '【场景描述】画面内容', '【对白】角色名：台词', '三幕结构：建置-对抗-解决'],
  },
  'tv-drama': {
    name: '电视剧剧本',
    tips: ['【集号/集名】第X集', '【场景标头】日内/夜外', '【场景描述+对白】', '每集建置-对抗-解决结构'],
  },
  'variety': {
    name: '综艺节目',
    tips: ['【环节名称】环节标题', '【环节时长】约X分钟', '【流程】环节步骤', '预留广告插入点'],
  },
  'microfilm': {
    name: '微电影',
    tips: ['【片名+时长】X分钟', '【场景标头】时间 地点', '【正文】场景描述+对白', '5-30分钟内讲完完整故事'],
  },
  'prose': {
    name: '散文',
    tips: ['【标题】', '【开头】起——引入', '【正文】承上启下', '【结尾】合——点题升华'],
  },
  'poetry': {
    name: '诗词',
    tips: ['【标题】', '【正文】按格律展开', '起承转合，情景交融', '语言精炼，意象典型'],
  },
  'lyrics': {
    name: '歌词',
    tips: ['【主歌A】叙事铺垫，4-8句', '【副歌Hook】高潮记忆点', '【桥段Bridge】情绪转折', '韵脚统一，朗朗上口'],
  },
  'stage-play': {
    name: '话剧剧本',
    tips: ['【人物】角色表', '【场景标头】', '【舞台指示】布景/道具/灯光', '【台词】角色名：台词'],
  },
  'anime': {
    name: '动画剧本',
    tips: ['【画面描述】动画画面内容', '【配音提示】角色：台词（语气）', '【音效/音乐提示】', '分镜脚本决定制作成本'],
  },
  'audio-drama': {
    name: '广播剧',
    tips: ['【场景标头】时间 地点 环境声', '【SFX】环境/动作/转场音效', '【BGM】背景音乐', '【台词/旁白】角色：台词'],
  },
};

// 场景类型配置
const sceneTypes = [
  { id: 'indoor', label: '室内', icon: '🏠' },
  { id: 'outdoor', label: '室外', icon: '🌳' },
  { id: 'vehicle', label: '车内', icon: '🚗' },
  { id: 'office', label: '办公', icon: '💼' },
  { id: 'street', label: '街道', icon: '🛤️' },
  { id: 'special', label: '特殊', icon: '✨' },
];

// 情绪氛围配置
const moodOptions = [
  { id: 'tense', label: '紧张', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { id: 'warm', label: '温馨', color: 'bg-orange-100 text-orange-700', icon: Heart },
  { id: 'suspense', label: '悬疑', color: 'bg-purple-100 text-purple-700', icon: Zap },
  { id: 'romantic', label: '浪漫', color: 'bg-pink-100 text-pink-700', icon: Heart },
  { id: 'comedy', label: '喜剧', color: 'bg-yellow-100 text-yellow-700', icon: MessageSquare },
  { id: 'sad', label: '悲伤', color: 'bg-blue-100 text-blue-700', icon: AlertTriangle },
  { id: 'action', label: '动作', color: 'bg-gray-100 text-gray-700', icon: Zap },
  { id: 'calm', label: '平静', color: 'bg-green-100 text-green-700', icon: Sun },
];

// 镜头语言配置
const cameraOptions = [
  { id: 'wide', label: '全景', desc: '展示整体环境' },
  { id: 'medium', label: '中景', desc: '人物半身' },
  { id: 'close', label: '特写', desc: '面部表情' },
  { id: 'pov', label: '主观', desc: '角色视角' },
  { id: 'tracking', label: '跟拍', desc: '移动镜头' },
  { id: 'static', label: '固定', desc: '静止镜头' },
];

// 剧情节点类型
const plotPointTypes = [
  { id: 'opening', label: '开场', color: 'bg-blue-500' },
  { id: 'conflict', label: '冲突', color: 'bg-red-500' },
  { id: 'twist', label: '反转', color: 'bg-purple-500' },
  { id: 'emotion', label: '情感', color: 'bg-pink-500' },
  { id: 'climax', label: '高潮', color: 'bg-orange-500' },
  { id: 'resolution', label: '解决', color: 'bg-green-500' },
];

const timeIcons = {
  day: Sun,
  night: Moon,
  dawn: Sunrise,
  dusk: Sunset,
};

const timeLabels = {
  day: '日',
  night: '夜',
  dawn: '黎明',
  dusk: '黄昏',
};

export default function ScriptWriter({ 
  characters, 
  outline, 
  episodes, 
  onEpisodesChange,
  writingFormat,
  projectId,
}: ScriptWriterProps) {
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);

  // 云端同步 Hook
  const { syncStatus, lastSynced, save } = useScriptSync({
    projectId,
    localData: episodes,
    onLocalChange: onEpisodesChange,
    debounceMs: 3000,
  });

  // 渲染同步状态指示器
  const renderSyncIndicator = () => {
    const isLoggedIn = isAuthenticated();
    if (!isLoggedIn) return null;

    const statusConfig = {
      loading: { icon: Loader2, color: 'text-gray-400', label: '加载中', animate: true },
      synced: { icon: Cloud, color: 'text-green-500', label: '已同步', animate: false },
      syncing: { icon: Loader2, color: 'text-blue-500', label: '保存中', animate: true },
      local: { icon: CheckCircle2, color: 'text-gray-400', label: '本地保存', animate: false },
      error: { icon: AlertCircle, color: 'text-red-500', label: '同步失败', animate: false },
    };

    const cfg = statusConfig[syncStatus];
    const Icon = cfg.icon;

    return (
      <div 
        className={`flex items-center gap-2 text-xs ${cfg.color}`}
        aria-live={syncStatus === 'synced' || syncStatus === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        role={syncStatus === 'synced' ? 'status' : syncStatus === 'error' ? 'alert' : undefined}
      >
        <Icon className={`w-4 h-4 ${cfg.animate ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span>{cfg.label}</span>
        {lastSynced && syncStatus === 'synced' && (
          <span className="text-gray-500">
            · {lastSynced.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    );
  };

  // 覆写保存方法
  const handleSaveEpisodes = (data: Episode[]) => {
    save(data);
  };

  // 根据 format 判断是否为"集"模式（短剧/电视剧）还是"场"模式（电影等）
  const isEpisodeMode = writingFormat === 'short-drama' || writingFormat === 'tv-drama';
  const episodeLabel = isEpisodeMode ? '集' : '场';
  const episodeListTitle = isEpisodeMode ? '剧集列表' : '场景列表';
  const [isEditing, setIsEditing] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sceneForm, setSceneForm] = useState<{
    location: string;
    time: 'day' | 'night' | 'dawn' | 'dusk';
    characters: string[];
    action: string;
    dialogue: Dialogue[];
    sceneType: string;
    mood: string;
    camera: string;
    plotPoint: string;
  }>({
    location: '',
    time: 'day',
    characters: [],
    action: '',
    dialogue: [],
    sceneType: 'indoor',
    mood: 'calm',
    camera: 'medium',
    plotPoint: 'conflict',
  });

  useEffect(() => {
    // Initialize episodes if empty
    if (episodes.length === 0 && outline) {
      const initialEpisodes: Episode[] = Array.from({ length: outline.totalEpisodes }, (_, i) => ({
        id: i + 1,
        title: `第${i + 1}集`,
        synopsis: '',
        scenes: [],
        wordCount: 0,
        status: 'draft',
      }));
      handleSaveEpisodes(initialEpisodes);
    }
  }, [outline]);

  const getCurrentEpisode = () => episodes.find(e => e.id === currentEpisode);

  const updateEpisode = (updates: Partial<Episode>) => {
    const updated = episodes.map(e =>
      e.id === currentEpisode ? { ...e, ...updates } : e
    );
    handleSaveEpisodes(updated);
  };

  const handleAddScene = () => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    const newScene: Scene = {
      id: crypto.randomUUID(),
      location: sceneForm.location || '待定',
      time: sceneForm.time || 'day',
      characters: sceneForm.characters || [],
      action: sceneForm.action || '',
      dialogue: sceneForm.dialogue || [],
    };

    const updatedScenes = [...episode.scenes, newScene];
    updateEpisode({ scenes: updatedScenes });
    setSceneForm({ 
      location: '', 
      time: 'day', 
      characters: [], 
      action: '', 
      dialogue: [],
      sceneType: 'indoor',
      mood: 'calm',
      camera: 'medium',
      plotPoint: 'conflict',
    });
    setIsEditing(false);
  };

  const handleDeleteScene = (sceneId: string) => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    updateEpisode({
      scenes: episode.scenes.filter(s => s.id !== sceneId),
    });
  };

  const handleUpdateScene = (sceneId: string, updates: Partial<Scene>) => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    updateEpisode({
      scenes: episode.scenes.map(s =>
        s.id === sceneId ? { ...s, ...updates } : s
      ),
    });
  };

  const handleAddDialogue = (sceneId: string) => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    const scene = episode.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    const newDialogue: Dialogue = {
      characterId: scene.characters[0] || '',
      content: '',
    };

    handleUpdateScene(sceneId, {
      dialogue: [...scene.dialogue, newDialogue],
    });
  };

  const handleUpdateDialogue = (sceneId: string, dialogueIndex: number, updates: Partial<Dialogue>) => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    const scene = episode.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    const updatedDialogue = scene.dialogue.map((d, i) =>
      i === dialogueIndex ? { ...d, ...updates } : d
    );

    handleUpdateScene(sceneId, { dialogue: updatedDialogue });
  };

  const handleDeleteDialogue = (sceneId: string, dialogueIndex: number) => {
    const episode = getCurrentEpisode();
    if (!episode) return;

    const scene = episode.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    handleUpdateScene(sceneId, {
      dialogue: scene.dialogue.filter((_, i) => i !== dialogueIndex),
    });
  };

  const renderScriptContent = (episode: Episode) => {
    if (episode.scenes.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>还没有场景</p>
          <p className="text-sm mt-1">点击下方按钮添加第一个场景</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {episode.scenes.map((scene, index) => {
          const TimeIcon = timeIcons[scene.time];
          return (
            <div key={scene.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              {/* Scene Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={scene.location}
                      onChange={(e) => handleUpdateScene(scene.id, { location: e.target.value })}
                      className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <TimeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{timeLabels[scene.time]}</span>
                      {scene.characters.length > 0 && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm text-gray-500">
                            {scene.characters.map(id => characters.find(c => c.id === id)?.name || '未知').join('、')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddDialogue(scene.id)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteScene(scene.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  场景描述
                </label>
                <textarea
                  value={scene.action}
                  onChange={(e) => handleUpdateScene(scene.id, { action: e.target.value })}
                  placeholder="描述这一场景中发生的动作和环境..."
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Dialogue */}
              {scene.dialogue.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    对话
                  </label>
                  {scene.dialogue.map((dialogue, dIndex) => (
                    <div key={dIndex} className="flex items-start gap-2 bg-white rounded-lg p-2 border border-gray-100">
                      <select
                        value={dialogue.characterId}
                        onChange={(e) => handleUpdateDialogue(scene.id, dIndex, { characterId: e.target.value })}
                        className="px-2 py-1 rounded border border-gray-200 text-sm bg-gray-50"
                      >
                        <option value="">选择角色</option>
                        {characters.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={dialogue.content}
                        onChange={(e) => handleUpdateDialogue(scene.id, dIndex, { content: e.target.value })}
                        placeholder="输入台词..."
                        className="flex-1 px-2 py-1 rounded border border-gray-200 text-sm"
                      />
                      <button
                        onClick={() => handleDeleteDialogue(scene.id, dIndex)}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 同步状态指示器 */}
      <div className="flex items-center justify-end">
        {renderSyncIndicator()}
      </div>

      {/* Episode Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {episodeListTitle}
          </h3>
          <span className="text-sm text-gray-500">
            已写 {episodes.filter(e => e.scenes.length > 0).length} / {episodes.length} {episodeLabel}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {episodes.map(episode => (
            <button
              key={episode.id}
              onClick={() => setCurrentEpisode(episode.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentEpisode === episode.id
                  ? 'bg-blue-500 text-white'
                  : episode.scenes.length > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {episode.id}
            </button>
          ))}
        </div>
      </div>

      {/* Current Episode */}
      {getCurrentEpisode() && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Episode Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  第{currentEpisode}{episodeLabel}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {getCurrentEpisode()?.scenes.length || 0}个场景 |
                  约{Math.round(getCurrentEpisode()?.wordCount || 0)}字
                </p>
              </div>
              <div className="flex gap-2">
                {writingFormat && FORMAT_GUIDE[writingFormat] && (
                  <div className="bg-white/20 rounded-lg px-3 py-2 text-sm text-white">
                    📝 {FORMAT_GUIDE[writingFormat].name}
                  </div>
                )}
                <button
                  onClick={() => setShowAIHelper(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  AI助手
                </button>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  AI生成
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  添加场景
                </button>
              </div>
            </div>
          </div>

          {/* 写作格式提示 */}
          {writingFormat && FORMAT_GUIDE[writingFormat] && (
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-2">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-blue-500 font-medium mb-1">格式提示 · {FORMAT_GUIDE[writingFormat].name}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                    {FORMAT_GUIDE[writingFormat].tips.map((tip, i) => (
                      <span key={i} className="text-xs text-blue-600">{tip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Script Content */}
          <div className="p-6">
            {/* Synopsis */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                本集概要
              </label>
              <textarea
                value={getCurrentEpisode()?.synopsis || ''}
                onChange={(e) => updateEpisode({ synopsis: e.target.value })}
                placeholder="描述这一集的主要内容..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Scenes */}
            {renderScriptContent(getCurrentEpisode()!)}
          </div>
        </div>
      )}

      {/* Add Scene Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">添加场景</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-5">
              {/* 场景类型 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-500" />
                  场景类型
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sceneTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSceneForm(f => ({ ...f, sceneType: type.id }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex items-center gap-2 ${
                        sceneForm.sceneType === type.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 情绪氛围 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  情绪氛围
                </label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setSceneForm(f => ({ ...f, mood: mood.id }))}
                      className={`px-3 py-2 rounded-full text-sm transition-all cursor-pointer ${
                        sceneForm.mood === mood.id
                          ? mood.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 镜头语言 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Camera className="w-4 h-4 text-green-500" />
                  镜头语言
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cameraOptions.map(cam => (
                    <button
                      key={cam.id}
                      onClick={() => setSceneForm(f => ({ ...f, camera: cam.id }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        sceneForm.camera === cam.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div>{cam.label}</div>
                      <div className="text-xs opacity-70">{cam.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 剧情节点 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  剧情节点
                </label>
                <div className="flex flex-wrap gap-2">
                  {plotPointTypes.map(point => (
                    <button
                      key={point.id}
                      onClick={() => setSceneForm(f => ({ ...f, plotPoint: point.id }))}
                      className={`px-3 py-2 rounded-full text-sm transition-all cursor-pointer text-white ${
                        sceneForm.plotPoint === point.id
                          ? point.color
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {point.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* 基础信息 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  场景地点
                </label>
                <input
                  type="text"
                  value={sceneForm.location || ''}
                  onChange={(e) => setSceneForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="如：医院、咖啡厅、办公室"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  时间
                </label>
                <div className="flex gap-2">
                  {(['day', 'night', 'dawn', 'dusk'] as const).map(t => {
                    const Icon = timeIcons[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setSceneForm(f => ({ ...f, time: t }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                          sceneForm.time === t
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {timeLabels[t]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  出场人物
                </label>
                <div className="flex flex-wrap gap-2">
                  {characters.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        const current = sceneForm.characters || [];
                        const updated = current.includes(c.id)
                          ? current.filter(id => id !== c.id)
                          : [...current, c.id];
                        setSceneForm(f => ({ ...f, characters: updated }));
                      }}
                      className={`px-3 py-2 rounded-full text-sm transition-all cursor-pointer ${
                        (sceneForm.characters || []).includes(c.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  场景动作
                </label>
                <textarea
                  value={sceneForm.action || ''}
                  onChange={(e) => setSceneForm(f => ({ ...f, action: e.target.value }))}
                  placeholder="描述场景中的动作..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* AI生成按钮 */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-blue-500" />
                      AI智能生成
                    </p>
                    <p className="text-sm text-gray-500 mt-1">根据角色关系和大纲自动生成场景</p>
                  </div>
                  <button
                    onClick={() => {
                      // 模拟AI生成
                      const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
                      const randomCamera = cameraOptions[Math.floor(Math.random() * cameraOptions.length)];
                      const randomPlot = plotPointTypes[Math.floor(Math.random() * plotPointTypes.length)];
                      setSceneForm(f => ({
                        ...f,
                        mood: randomMood.id,
                        camera: randomCamera.id,
                        plotPoint: randomPlot.id,
                        action: f.action || 'AI根据当前情境生成了场景描述...'
                      }));
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    生成建议
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddScene}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
              >
                添加场景
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSceneForm({ location: '', time: 'day', characters: [], action: '', dialogue: [], sceneType: 'indoor', mood: 'calm', camera: 'medium', plotPoint: 'conflict' });
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showGenerator && (
        <ScriptGenerator
          characters={characters}
          outline={outline}
          existingEpisodes={episodes}
          projectTitle="短剧剧本"
          onApply={(scenes) => {
            const episode = getCurrentEpisode();
            if (!episode) return;
            
            const updatedScenes = [...episode.scenes, ...scenes];
            updateEpisode({ scenes: updatedScenes });
            setShowGenerator(false);
          }}
          onClose={() => setShowGenerator(false)}
        />
      )}

      {/* AI Helper Modal */}
      {showAIHelper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI 助手
              </h3>
              <button
                onClick={() => {
                  setShowAIHelper(false);
                  setAiPrompt('');
                  setAiResult('');
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* AI 功能选项 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => setAiPrompt('请续写当前场景的内容：')}
                className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-all text-left hover:scale-102"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-gray-900 text-sm">智能续写</span>
                </div>
                <p className="text-xs text-gray-500">自动续写剧情</p>
              </button>
              <button
                onClick={() => setAiPrompt('请润色优化以下内容：')}
                className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-400 transition-all text-left hover:scale-102"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-gray-900 text-sm">一键润色</span>
                </div>
                <p className="text-xs text-gray-500">优化文字表达</p>
              </button>
              <button
                onClick={() => setAiPrompt('请为以下场景生成对话：')}
                className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-all text-left hover:scale-102"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-gray-900 text-sm">对话生成</span>
                </div>
                <p className="text-xs text-gray-500">生成精彩对白</p>
              </button>
              <button
                onClick={() => setAiPrompt('请为当前情节提供建议：')}
                className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-all text-left hover:scale-102"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-gray-900 text-sm">情节建议</span>
                </div>
                <p className="text-xs text-gray-500">剧情走向建议</p>
              </button>
            </div>

            {/* 输入区域 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                描述您的需求
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="输入您想要 AI 帮助的内容..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* 生成按钮 */}
            <button
              onClick={() => {
                setIsGenerating(true);
                // 模拟 AI 生成
                setTimeout(() => {
                  setAiResult(`【智能生成结果】

根据您的需求，AI 为您生成了以下内容：

场景描述：
咖啡厅内，阳光透过落地窗洒在木质桌面上。林小雨坐在角落，神情有些紧张，手中的咖啡已经凉了。

对话生成：
林小雨：（低头搅动咖啡）其实...我也不知道该怎么开口。
陈默：（看着她）没关系，想说什么就说什么。
林小雨：（深吸一口气）我最近...总是在想，如果当初做了不同的选择，现在会不会不一样。

【建议】您可以考虑在这个场景中加入一些环境细节，比如咖啡厅的背景音乐、窗外的人群等，来增强画面感。`);
                  setIsGenerating(false);
                }, 1500);
              }}
              disabled={!aiPrompt.trim() || isGenerating}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成
                </>
              )}
            </button>

            {/* 结果展示 */}
            {aiResult && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">生成结果</span>
                  <button
                    onClick={() => {
                      // 复制到剪贴板
                      navigator.clipboard.writeText(aiResult);
                    }}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    复制内容
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans leading-relaxed">
                  {aiResult}
                </pre>
                <button
                  onClick={() => {
                    // 这里可以将内容应用到当前场景
                    setShowAIHelper(false);
                    setAiPrompt('');
                    setAiResult('');
                  }}
                  className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all cursor-pointer"
                >
                  应用到当前场景
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
