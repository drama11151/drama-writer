import { useState, useEffect } from 'react';
import { GitBranch, Plus, Trash2, ChevronRight, Film, BookOpen, Sparkles, Layers, Clapperboard, Tv2, BookText, Mic, LayoutList, Swords, Zap, Flag, Eye, Clock, Users, Target, Cloud, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { StoryOutline, Act, Character, Idea } from '../types';
import { useOutlineSync } from '../hooks/useOutlineSync';
import { isAuthenticated } from '../services/api/auth';

interface OutlineBuilderProps {
  characters?: Character[];
  onOutlineChange: (outline: StoryOutline) => void;
  outline: StoryOutline | null;
  totalEpisodes: number;
  onTotalEpisodesChange: (n: number) => void;
  ideas?: Idea[];
  selectedGenres?: string[];
  format?: string;
  projectId?: string; // 新增：项目 ID，用于云端同步
}

// ==================== 格式专属大纲配置 ====================
interface OutlineConfig {
  mode: 'drama' | 'movie' | 'tv' | 'novel' | 'anime' | 'stage' | 'short-story' | 'microfilm' | 'variety' | 'documentary';
  title: string;
  subtitle: string;
  icon: any;
  presetLabel: string;        // 总X数
  presetUnit: string;         // 场/集/章/集
  presetRange: number[];      // 快捷预设
  presets: { label: string; value: string; acts: Omit<Act, 'episodes' | 'description'>[]; descriptions: string[] }[];
  loglineLabel: string;
  loglinePlaceholder: string;
  themeLabel: string;
  themePlaceholder: string;
  conflictLabel: string;
  conflictPlaceholder: string;
  structureTitle: string;
}

const OUTLINE_CONFIGS: Record<string, OutlineConfig> = {
  default: {
    mode: 'drama',
    title: '故事大纲',
    subtitle: '设计你的故事结构与关键事件',
    icon: GitBranch,
    presetLabel: '总集数',
    presetUnit: '集',
    presetRange: [70, 80],
    presets: [
      {
        label: '七幕结构（短剧节奏）',
        value: '7-act',
        acts: [
          { id: 1, title: '第一幕：觉醒（第1-10集）' },
          { id: 2, title: '第二幕：冲突（第11-20集）' },
          { id: 3, title: '第三幕：转折（第21-30集）' },
          { id: 4, title: '第四幕：高潮前（第31-40集）' },
          { id: 5, title: '第五幕：危机（第41-50集）' },
          { id: 6, title: '第六幕：逆转（第51-60集）' },
          { id: 7, title: '第七幕：结局（第61-70集）' },
        ],
        descriptions: ['开场介绍，铺设背景和人物关系', '冲突出现，主角开始行动', '剧情转折，引入新变量', '矛盾全面爆发', '最大危机，主角陷入绝境', '绝地反击，形势逆转', '完美结局，收束所有线索'],
      },
    ],
    loglineLabel: '一句话故事（Logline）',
    loglinePlaceholder: '格式：在一个XX（背景）下，XX（主角）因为XX（起因）必须XX（目标），否则XX（后果）。',
    themeLabel: '核心主题',
    themePlaceholder: '例如：爱的力量、正义终将战胜邪恶',
    conflictLabel: '主要冲突',
    conflictPlaceholder: '例如：主角必须在亲情和爱情之间做出选择',
    structureTitle: '幕结构设计',
  },
  'short-drama': {
    mode: 'drama',
    title: '故事大纲',
    subtitle: '设计短剧的幕结构与关键情节点',
    icon: Film,
    presetLabel: '总集数',
    presetUnit: '集',
    presetRange: [70, 80],
    presets: [
      {
        label: '七幕结构（短剧节奏）',
        value: '7-act',
        acts: [
          { id: 1, title: '第一幕：觉醒（第1-10集）' },
          { id: 2, title: '第二幕：冲突（第11-20集）' },
          { id: 3, title: '第三幕：转折（第21-30集）' },
          { id: 4, title: '第四幕：高潮前（第31-40集）' },
          { id: 5, title: '第五幕：危机（第41-50集）' },
          { id: 6, title: '第六幕：逆转（第51-60集）' },
          { id: 7, title: '第七幕：结局（第61-70集）' },
        ],
        descriptions: ['开场介绍，铺设背景和人物关系', '冲突出现，主角开始行动', '剧情转折，引入新变量', '矛盾全面爆发', '最大危机，主角陷入绝境', '绝地反击，形势逆转', '完美结局，收束所有线索'],
      },
      {
        label: '四幕结构（快节奏）',
        value: '4-act',
        acts: [
          { id: 1, title: '第一幕：建置（第1-20集）' },
          { id: 2, title: '第二幕：对抗（第21-45集）' },
          { id: 3, title: '第三幕：危机（第46-60集）' },
          { id: 4, title: '第四幕：解决（第61-80集）' },
        ],
        descriptions: ['介绍主要人物和世界观，建立主角的日常生活', '主角面临主要冲突，开始成长和改变', '主角遭遇最大失败或危机', '高潮和结局，解决所有主要冲突'],
      },
    ],
    loglineLabel: '一句话故事（Logline）',
    loglinePlaceholder: '格式：在一个XX（背景）下，XX（主角）因为XX（起因）必须XX（目标），否则XX（后果）。&#10;短剧Logline要能在前3集内制造强烈冲突和反转。',
    themeLabel: '核心主题',
    themePlaceholder: '例如：真爱能战胜一切障碍',
    conflictLabel: '核心爽点/虐点',
    conflictPlaceholder: '例如：女主每次被打脸后绝地反击的高光时刻',
    structureTitle: '幕结构设计',
  },
  'movie': {
    mode: 'movie',
    title: '分场大纲',
    subtitle: '按场景展开你的院线电影',
    icon: Clapperboard,
    presetLabel: '总场数',
    presetUnit: '场',
    presetRange: [40, 80],
    presets: [],
    loglineLabel: '电影Logline',
    loglinePlaceholder: '院线电影的Logline要能在30秒内勾起观众的观影欲望。&#10;格式：[类型] + [人物] + [核心冲突] + [独特卖点]&#10;例：一个失业父亲带着女儿穿越到游戏世界，必须在30天内通关否则永远困在里面。',
    themeLabel: '导演表达意图',
    themePlaceholder: '这部电影最想传达什么？观众看完会有什么感受？',
    conflictLabel: '核心戏剧冲突',
    conflictPlaceholder: '推动故事发展的主要矛盾是什么？',
    structureTitle: '分场梗概',
  },
  'tv-drama': {
    mode: 'tv',
    title: '分集大纲',
    subtitle: '设计电视剧每集的核心情节点',
    icon: Tv2,
    presetLabel: '总集数',
    presetUnit: '集',
    presetRange: [20, 40],
    presets: [],
    loglineLabel: '剧集Logline',
    loglinePlaceholder: '电视剧Logline要能支撑起20-40集的故事体量。&#10;包含：时代背景 + 主要人物 + 核心悬念/冲突 + 情感主线。',
    themeLabel: '剧集主题',
    themePlaceholder: '这部长剧最核心要表达的主题是什么？',
    conflictLabel: '贯穿全剧的主线冲突',
    conflictPlaceholder: '从第一集贯穿到最后一集的核心矛盾',
    structureTitle: '分集设计',
  },
  'novel': {
    mode: 'novel',
    title: '章纲设计',
    subtitle: '设计长篇小说的章节节奏',
    icon: BookText,
    presetLabel: '总章节数',
    presetUnit: '章',
    presetRange: [50, 200],
    presets: [
      {
        label: '三卷结构',
        value: '3-volume',
        acts: [
          { id: 1, title: '第一卷：起源（第1-50章）' },
          { id: 2, title: '第二卷：崛起（第51-120章）' },
          { id: 3, title: '第三卷：终章（第121-200章）' },
        ],
        descriptions: ['世界观建立，主角成长初期，埋下核心冲突种子', '主角经历重大挫折与突破，核心冲突全面爆发', '最终决战与结局，收束所有伏笔'],
      },
    ],
    loglineLabel: '小说简介',
    loglinePlaceholder: '网文小说简介要能在一分钟内抓住读者。&#10;格式：穿越/重生/系统 + 主角身份 + 金手指/特殊能力 + 核心爽点/目标。',
    themeLabel: '核心爽点',
    themePlaceholder: '读者追这本书的最大动力是什么？装逼打脸？热血逆袭？',
    conflictLabel: '主线矛盾',
    conflictPlaceholder: '主角的核心敌人/目标是什么？',
    structureTitle: '卷纲设计',
  },
  'anime': {
    mode: 'anime',
    title: '集纲设计',
    subtitle: '设计动画番剧的集数结构',
    icon: Film,
    presetLabel: '总集数',
    presetUnit: '集',
    presetRange: [12, 24],
    presets: [],
    loglineLabel: '番剧Logline',
    loglinePlaceholder: '动画番剧的Logline要能体现作品风格定位。&#10;包含：类型（热血/恋爱/冒险）+ 核心设定 + 目标受众。',
    themeLabel: '作品风格',
    themePlaceholder: '热血王道？恋爱治愈？悬疑智斗？作品的整体基调是什么？',
    conflictLabel: '核心剧情线',
    conflictPlaceholder: '贯穿全季的核心事件/主线目标',
    structureTitle: '集纲设计',
  },
  'stage-play': {
    mode: 'stage',
    title: '幕场设计',
    subtitle: '设计话剧的幕场结构与舞台指示',
    icon: Layers,
    presetLabel: '总幕数',
    presetUnit: '幕',
    presetRange: [2, 4],
    presets: [],
    loglineLabel: '话剧Logline',
    loglinePlaceholder: '话剧Logline要体现戏剧的核心冲突张力。&#10;格式：[人物] + [困境] + [选择] = [悲剧/喜剧结局]。',
    themeLabel: '戏剧主题',
    themePlaceholder: '这部话剧的文学性和思想性是什么？',
    conflictLabel: '核心戏剧冲突',
    conflictPlaceholder: '话剧的灵魂在于冲突，这场戏的核心矛盾是什么？',
    structureTitle: '幕场结构',
  },
  'variety': {
    mode: 'variety',
    title: '环节设计',
    subtitle: '设计综艺节目的核心环节流程',
    icon: LayoutList,
    presetLabel: '总环节数',
    presetUnit: '个',
    presetRange: [5, 10],
    presets: [],
    loglineLabel: '节目核心创意',
    loglinePlaceholder: '节目最核心的看点是什么？是什么让观众欲罢不能？',
    themeLabel: '节目定位',
    themePlaceholder: '下饭综艺/爆款综艺/慢综艺/竞演综艺？',
    conflictLabel: '核心看点设计',
    conflictPlaceholder: '每一期节目最大的看点/笑点/泪点是什么？',
    structureTitle: '环节设计',
  },
  'documentary': {
    mode: 'documentary',
    title: '结构设计',
    subtitle: '设计纪录片的叙事结构',
    icon: Eye,
    presetLabel: '总段落数',
    presetUnit: '段',
    presetRange: [4, 8],
    presets: [],
    loglineLabel: '纪录片核心主题',
    loglinePlaceholder: '这部纪录片最想传达的核心观点/发现是什么？&#10;观众看完会有什么认知上的改变或情感上的触动？',
    themeLabel: '社会价值定位',
    themePlaceholder: '这部纪录片有什么样的社会意义？希望引发什么讨论？',
    conflictLabel: '核心叙事线索',
    conflictPlaceholder: '用什么主线串起整个纪录片的故事？',
    structureTitle: '段落设计',
  },
};

// 辅助：构建默认Act
function buildDefaultActs(preset: { acts: Omit<Act, 'episodes' | 'description'>[]; descriptions: string[] }, total: number): Act[] {
  return preset.acts.map((act, idx) => ({
    ...act,
    description: preset.descriptions[idx] || '',
    episodes: [],
  }));
}

function distributeEpisodes(acts: Act[], total: number): Act[] {
  return acts.map((act, index) => {
    const perAct = Math.ceil(total / acts.length);
    const start = index * perAct + 1;
    const end = Math.min((index + 1) * perAct, total);
    return {
      ...act,
      episodes: Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i),
    };
  });
}

// 辅助：从ideas提取logline
function getLoglineFromIdeas(ideas: Idea[]): string {
  if (!ideas || ideas.length === 0) return '';
  return ideas[0].content?.slice(0, 200) || '';
}

export default function OutlineBuilder({
  characters,
  onOutlineChange,
  outline,
  totalEpisodes,
  onTotalEpisodesChange,
  ideas = [],
  selectedGenres = [],
  format,
  projectId,
}: OutlineBuilderProps) {
  const config = OUTLINE_CONFIGS[format || 'default'] || OUTLINE_CONFIGS['default'];

  // 云端同步 Hook
  const { syncStatus, lastSynced, save } = useOutlineSync({
    projectId,
    localData: outline,
    onLocalChange: onOutlineChange,
    debounceMs: 3000,
  });

  // 覆写保存方法
  const handleSaveOutline = (data: StoryOutline) => {
    save(data);
  };

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

    const config2 = statusConfig[syncStatus];
    const Icon = config2.icon;

    return (
      <div className={`flex items-center gap-2 text-xs ${config2.color}`}>
        <Icon className={`w-4 h-4 ${config2.animate ? 'animate-spin' : ''}`} />
        <span>{config2.label}</span>
        {lastSynced && syncStatus === 'synced' && (
          <span className="text-gray-400">
            · {lastSynced.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    );
  };

  const [logline, setLogline] = useState('');
  const [acts, setActs] = useState<Act[]>([]);
  const [mainConflict, setMainConflict] = useState('');
  const [theme, setTheme] = useState('');
  const [editingActIndex, setEditingActIndex] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState('');
  const [selectedStructure, setSelectedStructure] = useState(
    config.presets.length > 0 ? config.presets[0].value : 'custom'
  );
  const [episodeInput, setEpisodeInput] = useState(String(totalEpisodes));

  // 电影分场数据
  const [scenes, setScenes] = useState<{ id: string; num: number; location: string; time: string; event: string; characters: string[] }[]>([]);
  // 电视剧/动漫分集数据
  const [episodeOutlines, setEpisodeOutlines] = useState<{ id: string; num: number; name: string; event: string; hook: string; emotion: string }[]>([]);
  // 话剧场数据
  const [stageScenes, setStageScenes] = useState<{ id: string; act: number; num: number; location: string; description: string; duration: string }[]>([]);
  // 综艺环节数据
  const [segments, setSegments] = useState<{ id: string; num: number; name: string; duration: string; highlights: string }[]>([]);
  // 纪录片段落数据
  const [docSegments, setDocSegments] = useState<{ id: string; num: number; title: string; content: string; keyPoints: string }[]>([]);

  // 初始化
  useEffect(() => {
    if (outline) {
      setActs(outline.acts || []);
      setMainConflict(outline.mainConflict || '');
      setTheme(outline.theme || '');
    } else if (config.presets.length > 0) {
      const defaultPreset = config.presets[0];
      const defaultActs = buildDefaultActs(defaultPreset, totalEpisodes);
      const distributed = distributeEpisodes(defaultActs, totalEpisodes);
      setActs(distributed);
    }
    setLogline(getLoglineFromIdeas(ideas));
  }, []);

  useEffect(() => {
    if (config.presets.length > 0) {
      const currentPreset = config.presets.find(p => p.value === selectedStructure) || config.presets[0];
      const newActs = buildDefaultActs(currentPreset, totalEpisodes);
      const distributed = distributeEpisodes(newActs, totalEpisodes);
      setActs(distributed);
    }
  }, [totalEpisodes]);

  const saveOutline = (updatedActs?: Act[]) => {
    const newOutline: StoryOutline = {
      id: crypto.randomUUID(),
      acts: updatedActs || acts,
      totalEpisodes,
      mainConflict,
      theme,
    };
    handleSaveOutline(newOutline);
  };

  const handleSaveAll = () => saveOutline(acts);

  const handleStructureChange = (templateId: string) => {
    setSelectedStructure(templateId);
    const preset = config.presets.find(p => p.value === templateId);
    if (preset) {
      const newActs = buildDefaultActs(preset, totalEpisodes);
      const distributed = distributeEpisodes(newActs, totalEpisodes);
      setActs(distributed);
      const newOutline: StoryOutline = {
        id: crypto.randomUUID(),
        acts: distributed,
        totalEpisodes,
        mainConflict,
        theme,
      };
      handleSaveOutline(newOutline);
    }
  };

  const handleEpisodeInputBlur = () => {
    const n = parseInt(episodeInput);
    if (!isNaN(n) && n >= 1 && n <= 500) {
      onTotalEpisodesChange(n);
      if (config.presets.length > 0) {
        const currentPreset = config.presets.find(p => p.value === selectedStructure) || config.presets[0];
        const newActs = buildDefaultActs(currentPreset, n);
        const distributed = distributeEpisodes(newActs, n);
        setActs(distributed);
      }
    } else {
      setEpisodeInput(String(totalEpisodes));
    }
  };

  const handleAddEvent = (actIndex: number) => {
    if (!newEvent.trim()) return;
    const updatedActs = [...acts];
    updatedActs[actIndex] = {
      ...updatedActs[actIndex],
      keyEvents: [...updatedActs[actIndex].keyEvents, newEvent.trim()],
    };
    setActs(updatedActs);
    setNewEvent('');
    const newOutline: StoryOutline = {
      id: crypto.randomUUID(),
      acts: updatedActs,
      totalEpisodes,
      mainConflict,
      theme,
    };
    handleSaveOutline(newOutline);
  };

  const handleDeleteEvent = (actIndex: number, eventIndex: number) => {
    const updatedActs = [...acts];
    updatedActs[actIndex] = {
      ...updatedActs[actIndex],
      keyEvents: updatedActs[actIndex].keyEvents.filter((_, i) => i !== eventIndex),
    };
    setActs(updatedActs);
    const newOutline: StoryOutline = {
      id: crypto.randomUUID(),
      acts: updatedActs,
      totalEpisodes,
      mainConflict,
      theme,
    };
    handleSaveOutline(newOutline);
  };

  const handleUpdateActDescription = (actIndex: number, description: string) => {
    const updatedActs = [...acts];
    updatedActs[actIndex] = { ...updatedActs[actIndex], description };
    setActs(updatedActs);
    const newOutline: StoryOutline = {
      id: crypto.randomUUID(),
      acts: updatedActs,
      totalEpisodes,
      mainConflict,
      theme,
    };
    handleSaveOutline(newOutline);
  };

  // ====== 电影：分场管理 ======
  const addScene = () => {
    setScenes(prev => [
      ...prev,
      { id: crypto.randomUUID(), num: prev.length + 1, location: '', time: '', event: '', characters: [] },
    ]);
  };
  const updateScene = (id: string, field: string, value: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })));
  };

  // ====== 电视剧/动漫：分集管理 ======
  const addEpisode = () => {
    setEpisodeOutlines(prev => [
      ...prev,
      { id: crypto.randomUUID(), num: prev.length + 1, name: '', event: '', hook: '', emotion: '平稳' },
    ]);
  };
  const updateEpisode = (id: string, field: string, value: string) => {
    setEpisodeOutlines(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const deleteEpisode = (id: string) => {
    setEpisodeOutlines(prev => prev.filter(e => e.id !== id).map((e, i) => ({ ...e, num: i + 1 })));
  };

  // ====== 话剧：场管理 ======
  const addStageScene = () => {
    const currentAct = stageScenes.length > 0 ? stageScenes[stageScenes.length - 1].act : 1;
    setStageScenes(prev => [
      ...prev,
      { id: crypto.randomUUID(), act: currentAct, num: prev.filter(s => s.act === currentAct).length + 1, location: '', description: '', duration: '' },
    ]);
  };
  const updateStageScene = (id: string, field: string, value: string) => {
    setStageScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteStageScene = (id: string) => {
    setStageScenes(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })));
  };

  // ====== 综艺：环节管理 ======
  const addSegment = () => {
    setSegments(prev => [
      ...prev,
      { id: crypto.randomUUID(), num: prev.length + 1, name: '', duration: '', highlights: '' },
    ]);
  };
  const updateSegment = (id: string, field: string, value: string) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })));
  };

  // ====== 纪录片：段落管理 ======
  const addDocSegment = () => {
    setDocSegments(prev => [
      ...prev,
      { id: crypto.randomUUID(), num: prev.length + 1, title: '', content: '', keyPoints: '' },
    ]);
  };
  const updateDocSegment = (id: string, field: string, value: string) => {
    setDocSegments(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const deleteDocSegment = (id: string) => {
    setDocSegments(prev => prev.filter(s => s.id !== id).map((s, i) => ({ ...s, num: i + 1 })));
  };

  const IconComp = config.icon;

  // ==================== 渲染专属视图 ====================

  // ------ 电影：分场大纲视图 ------
  const renderMovieView = () => (
    <div className="space-y-6">
      {/* 分场列表 */}
      <div className="space-y-3">
        {scenes.map((scene) => (
          <div key={scene.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                {scene.num}
              </span>
              <input
                type="text"
                value={scene.time}
                onChange={e => updateScene(scene.id, 'time', e.target.value)}
                placeholder="时间（例：清晨/夜晚/十年前）"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={scene.location}
                onChange={e => updateScene(scene.id, 'location', e.target.value)}
                placeholder="地点（例：咖啡厅/办公室/街道）"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => deleteScene(scene.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={scene.event}
              onChange={e => updateScene(scene.id, 'event', e.target.value)}
              placeholder="本场核心事件：本场发生什么？主角做了什么决定？与上下场如何衔接？"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          onClick={addScene}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> 添加分场
        </button>
      </div>
      {/* 侧边统计 */}
      {scenes.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '已设计场数', value: scenes.length, icon: Clapperboard },
            { label: '内景数', value: scenes.filter(s => !s.time.includes('外')).length, icon: Layers },
            { label: '外景数', value: scenes.filter(s => s.time.includes('外') || s.location.includes('外')).length, icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-blue-50 rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-700">{value}</div>
              <div className="text-xs text-blue-500">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ------ 电视剧/动漫：分集大纲视图 ------
  const renderTVView = () => (
    <div className="space-y-3">
      {episodeOutlines.map((ep) => (
        <div key={ep.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-cyan-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {ep.num}
            </span>
            <input
              type="text"
              value={ep.name}
              onChange={e => updateEpisode(ep.id, 'name', e.target.value)}
              placeholder="集名（如：命运的相遇）"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={ep.emotion}
              onChange={e => updateEpisode(ep.id, 'emotion', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option>升</option>
              <option>稳</option>
              <option>降</option>
            </select>
            <button onClick={() => deleteEpisode(ep.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <textarea
              value={ep.event}
              onChange={e => updateEpisode(ep.id, 'event', e.target.value)}
              placeholder="本集核心事件（2-3个情节点）：主角在本集做了什么？发生了什么事？"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={ep.hook}
              onChange={e => updateEpisode(ep.id, 'hook', e.target.value)}
              placeholder="集末钩子：本集结尾如何留悬念/勾起观众继续看下一集？"
              className="w-full px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 text-sm focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addEpisode}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-cyan-400 hover:text-cyan-500 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> 添加集数
      </button>
      {episodeOutlines.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '已设计', value: episodeOutlines.length, icon: Tv2, color: 'cyan' },
            { label: '情感上升', value: episodeOutlines.filter(e => e.emotion === '升').length, icon: Zap, color: 'green' },
            { label: '情感平稳', value: episodeOutlines.filter(e => e.emotion === '稳').length, icon: Target, color: 'blue' },
            { label: '情感下降', value: episodeOutlines.filter(e => e.emotion === '降').length, icon: Swords, color: 'red' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-${color}-50 rounded-xl p-4 text-center`}>
              <Icon className={`w-5 h-5 text-${color}-500 mx-auto mb-1`} />
              <div className={`text-2xl font-bold text-${color}-700`}>{value}</div>
              <div className={`text-xs text-${color}-500`}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ------ 话剧：幕场视图 ------
  const renderStageView = () => (
    <div className="space-y-3">
      {stageScenes.map((scene) => (
        <div key={scene.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
              第{scene.act}幕
            </span>
            <span className="w-7 h-7 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {scene.num}
            </span>
            <input
              type="text"
              value={scene.location}
              onChange={e => updateStageScene(scene.id, 'location', e.target.value)}
              placeholder="场景（例：客厅/书房/街头）"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={scene.duration}
              onChange={e => updateStageScene(scene.id, 'duration', e.target.value)}
              placeholder="时长（如5分钟）"
              className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={() => deleteStageScene(scene.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={scene.description}
            onChange={e => updateStageScene(scene.id, 'description', e.target.value)}
            placeholder="舞台指示：本场发生什么？角色动作与台词方向？舞台布景/灯光提示？"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}
      <button
        onClick={addStageScene}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-500 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> 添加场次
      </button>
      {stageScenes.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '总场数', value: stageScenes.length, color: 'purple' },
            { label: '幕数', value: Math.max(...stageScenes.map(s => s.act), 1), color: 'indigo' },
            { label: '平均时长', value: stageScenes.length > 0 ? '待定' : '0', color: 'pink' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}-50 rounded-xl p-4 text-center`}>
              <Layers className={`w-5 h-5 text-${color}-500 mx-auto mb-1`} />
              <div className={`text-2xl font-bold text-${color}-700`}>{value}</div>
              <div className={`text-xs text-${color}-500`}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ------ 综艺：环节视图 ------
  const renderVarietyView = () => (
    <div className="space-y-3">
      {segments.map((seg) => (
        <div key={seg.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {seg.num}
            </span>
            <input
              type="text"
              value={seg.name}
              onChange={e => updateSegment(seg.id, 'name', e.target.value)}
              placeholder="环节名称（如：才艺展示/互动游戏）"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              value={seg.duration}
              onChange={e => updateSegment(seg.id, 'duration', e.target.value)}
              placeholder="时长（如15分钟）"
              className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500"
            />
            <button onClick={() => deleteSegment(seg.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={seg.highlights}
            onChange={e => updateSegment(seg.id, 'highlights', e.target.value)}
            placeholder="环节亮点：本环节的核心笑点/泪点/燃点？嘉宾如何互动？规则是什么？"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      ))}
      <button
        onClick={addSegment}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> 添加环节
      </button>
    </div>
  );

  // ------ 纪录片：段落视图 ------
  const renderDocView = () => (
    <div className="space-y-3">
      {docSegments.map((seg) => (
        <div key={seg.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-teal-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
              {seg.num}
            </span>
            <input
              type="text"
              value={seg.title}
              onChange={e => updateDocSegment(seg.id, 'title', e.target.value)}
              placeholder="段落主题（如：起源/困境/突破）"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500"
            />
            <button onClick={() => deleteDocSegment(seg.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <textarea
              value={seg.content}
              onChange={e => updateDocSegment(seg.id, 'content', e.target.value)}
              placeholder="段落内容：本段落的核心叙事内容，包含了哪些素材/访谈/画面？"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              value={seg.keyPoints}
              onChange={e => updateDocSegment(seg.id, 'keyPoints', e.target.value)}
              placeholder="关键信息点：本段落要传达的3-5个核心信息点是什么？"
              rows={1}
              className="w-full px-3 py-2 rounded-lg border border-teal-100 bg-teal-50 text-sm resize-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
      ))}
      <button
        onClick={addDocSegment}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-400 hover:text-teal-500 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> 添加段落
      </button>
    </div>
  );

  // ------ 默认/小说视图：幕结构时间线 ------
  const renderDefaultView = () => (
    <div>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500" />
        <div className="space-y-6">
          {acts.map((act, index) => (
            <div key={act.id} className="relative pl-14">
              <div className={`absolute left-3 w-6 h-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-500' : index === acts.length - 1 ? 'bg-blue-600' : 'bg-cyan-500'}`}>
                <span className="text-white text-xs font-bold">{act.id}</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{act.title}</h4>
                    <p className="text-sm text-gray-500">
                      {(act.episodes?.length ?? 0) > 0 ? `第${act.episodes[0]}-${act.episodes[act.episodes.length - 1]}${config.presetUnit}` : `${config.presetUnit}数待定`}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {(act.episodes?.length ?? 0)}{config.presetUnit}
                  </span>
                </div>
                <div className="mb-4">
                  <textarea
                    value={act.description}
                    onChange={(e) => handleUpdateActDescription(index, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">关键情节点</span>
                    <span className="text-xs text-gray-400">{(act.keyEvents?.length ?? 0)}个</span>
                  </div>
                  {(act.keyEvents?.length ?? 0) > 0 && (
                    <div className="space-y-2 mb-3">
                      {act.keyEvents?.map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                          <ChevronRight className="w-4 h-4 text-blue-500" />
                          <span className="flex-1 text-sm text-gray-700">{event}</span>
                          <button onClick={() => handleDeleteEvent(index, eventIndex)} className="p-1 text-gray-400 hover:text-red-500 cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingActIndex === index ? newEvent : ''}
                      onChange={(e) => { setNewEvent(e.target.value); setEditingActIndex(index); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEvent(index); } }}
                      placeholder={`添加情节点，按回车确认...`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={() => handleAddEvent(index)} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== 主渲染 ====================
  return (
    <div className="space-y-8">
      {/* 同步状态指示器 */}
      <div className="flex items-center justify-end">
        {renderSyncIndicator()}
      </div>

      {/* 已选题材 */}
      {selectedGenres.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium text-gray-700">已选题材</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((tag) => (
              <span key={tag} className="px-3 py-2 rounded-full text-sm bg-blue-500 text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Logline */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {config.loglineLabel}
        </label>
        <textarea
          value={logline}
          onChange={(e) => setLogline(e.target.value)}
          placeholder={config.loglinePlaceholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* 主题 + 冲突 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{config.themeLabel}</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => { setTheme(e.target.value); setTimeout(handleSaveAll, 500); }}
            placeholder={config.themePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{config.conflictLabel}</label>
          <input
            type="text"
            value={mainConflict}
            onChange={(e) => { setMainConflict(e.target.value); setTimeout(handleSaveAll, 500); }}
            placeholder={config.conflictPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* 结构模板选择器（仅幕结构模式显示） */}
      {config.mode === 'drama' || config.mode === 'novel' ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">{config.structureTitle}</h3>
          </div>
          {config.presets.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {config.presets.map((tpl) => (
                <button
                  key={tpl.value}
                  onClick={() => handleStructureChange(tpl.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all cursor-pointer hover:scale-102 ${selectedStructure === tpl.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300'}`}
                >
                  <span className="font-medium text-sm">{tpl.label}</span>
                  <span className="block mt-0.5 text-xs opacity-60">{tpl.acts.length}幕</span>
                </button>
              ))}
            </div>
          )}
          {/* 集数输入 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{config.presetLabel}：</label>
            <input
              type="number"
              value={episodeInput}
              onChange={(e) => setEpisodeInput(e.target.value)}
              onBlur={handleEpisodeInputBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              min={1}
              max={500}
              className="w-28 px-4 py-2 rounded-xl border border-gray-200 text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">{config.presetUnit}</span>
            {config.presetRange && (
              <div className="flex gap-2 ml-4">
                {config.presetRange.map(n => (
                  <button
                    key={n}
                    onClick={() => {
                      onTotalEpisodesChange(n);
                      setEpisodeInput(String(n));
                      if (config.presets.length > 0) {
                        const currentPreset = config.presets.find(p => p.value === selectedStructure) || config.presets[0];
                        const newActs = buildDefaultActs(currentPreset, n);
                        const distributed = distributeEpisodes(newActs, n);
                        setActs(distributed);
                      }
                    }}
                    className={`px-3 py-2 rounded-full text-sm transition-all cursor-pointer ${totalEpisodes === n ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* 专属大纲内容区 */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconComp className="w-5 h-5 text-blue-500" />
          {config.title}
          <span className="text-sm font-normal text-gray-500 ml-2">{config.subtitle}</span>
        </h3>

        {config.mode === 'movie' && renderMovieView()}
        {(config.mode === 'tv' || config.mode === 'anime') && renderTVView()}
        {config.mode === 'stage' && renderStageView()}
        {config.mode === 'variety' && renderVarietyView()}
        {config.mode === 'documentary' && renderDocView()}
        {(config.mode === 'drama' || config.mode === 'novel' || config.mode === 'short-story' || config.mode === 'microfilm') && renderDefaultView()}
      </div>

      {/* 保存按钮 */}
      <button
        onClick={handleSaveAll}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
      >
        <Flag className="w-5 h-5" />
        保存大纲
      </button>
    </div>
  );
}
