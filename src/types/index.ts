// 类型定义
export interface Project {
  id: string;
  title: string;
  genre: string;
  targetAudience: string;
  episodes: number;
  currentStep: WorkflowStep;
  format: string; // 创作形式
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowStep = 
  | 'format' // 创作形式
  | 'idea' // 创意灵感
  | 'topic' // 选题
  | 'worldbuilding' // 世界观设定
  | 'outline' // 故事大纲
  | 'character' // 人物设定
  | 'plot' // 情节设计
  | 'script' // 故事写作（通用）
  | 'poetry' // 诗词创作
  | 'prose' // 散文写作
  | 'lyrics' // 歌词创作
  | 'story' // 故事写作
  | 'crosstalk' // 相声写作
  | 'sketch' // 小品写作
  | 'stage-play' // 话剧写作
  | 'fable' // 寓言写作
  | 'fairy-tale' // 童话写作
  | 'review' // 市场分析
  | 'polish' // 润色修改
  | 'speech-writing' // 演讲写作
  | 'brand-story-writing' // 品牌故事写作
  | 'wechat-article-writing' // 公众号文章写作
  | 'advertising-writing'; // 广告文案写作

// 工作流步骤配置
export interface WorkflowStepConfig {
  key: WorkflowStep;
  label: string;
  icon: string;
  component?: string; // 对应的组件名称
}

// 创作形式配置
export interface FormatConfig {
  id: string;
  name: string;
  icon: string;
  steps: WorkflowStepConfig[];
}

// 创作形式列表
export const FORMAT_CONFIGS: FormatConfig[] = [
  {
    id: 'drama',
    name: '短剧剧本',
    icon: '🎬',
    steps: [
      { key: 'idea', label: '创意灵感', icon: '💡' },
      { key: 'topic', label: '选题分析', icon: '📊' },
      { key: 'outline', label: '故事大纲', icon: '📋' },
      { key: 'script', label: '剧本写作', icon: '✍️' },
      { key: 'review', label: '市场分析', icon: '📈' },
    ],
  },
  {
    id: 'novel',
    name: '小说',
    icon: '📚',
    steps: [
      { key: 'idea', label: '创意灵感', icon: '💡' },
      { key: 'topic', label: '选题分析', icon: '📊' },
      { key: 'character', label: '人物设定', icon: '👥' },
      { key: 'outline', label: '章节大纲', icon: '📋' },
      { key: 'script', label: '章节写作', icon: '✍️' },
      { key: 'polish', label: '润色修改', icon: '✨' },
    ],
  },
  {
    id: 'story',
    name: '故事',
    icon: '📖',
    steps: [
      { key: 'idea', label: '创意灵感', icon: '💡' },
      { key: 'character', label: '人物设定', icon: '👥' },
      { key: 'plot', label: '情节设计', icon: '🎭' },
      { key: 'script', label: '故事写作', icon: '✍️' },
    ],
  },
  {
    id: 'poetry',
    name: '诗词',
    icon: '🎋',
    steps: [
      { key: 'idea', label: '创作灵感', icon: '💡' },
      { key: 'topic', label: '主题风格', icon: '🎨' },
      { key: 'poetry', label: '诗词创作', icon: '✍️' },
      { key: 'polish', label: '润色修改', icon: '✨' },
    ],
  },
  {
    id: 'lyrics',
    name: '歌词',
    icon: '🎵',
    steps: [
      { key: 'idea', label: '创作灵感', icon: '💡' },
      { key: 'topic', label: '曲风主题', icon: '🎶' },
      { key: 'lyrics', label: '歌词创作', icon: '✍️' },
      { key: 'polish', label: '润色修改', icon: '✨' },
    ],
  },
  {
    id: 'script',
    name: '影视剧本',
    icon: '🎥',
    steps: [
      { key: 'idea', label: '创意灵感', icon: '💡' },
      { key: 'topic', label: '选题分析', icon: '📊' },
      { key: 'outline', label: '分场大纲', icon: '📋' },
      { key: 'script', label: '剧本写作', icon: '✍️' },
      { key: 'review', label: '市场分析', icon: '📈' },
    ],
  },
];

export interface Idea {
  id: string;
  content: string;
  inspiration: string;
  tags: string[];
  selectedTags: string[];
  createdAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  logline: string;
  genre: string;
  targetAudience: string;
  trendScore: number;
  competitionLevel: 'low' | 'medium' | 'high';
  commercialValue: number;
  notes: string;
}

export interface StoryOutline {
  id: string;
  acts: Act[];
  totalEpisodes: number;
  mainConflict: string;
  theme: string;
  logline?: string;
  characters?: Character[];
  genres?: string[];
}

export interface Act {
  id: number;
  title: string;
  description: string;
  episodes: number[];
  keyEvents: string[];
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  age: string;
  occupation: string;
  personality: string[];
  background: string;
  motivation: string;
  arc: string;
  relationships: CharacterRelationship[];
}

export interface CharacterRelationship {
  characterId: string;
  type: 'family' | 'friend' | 'romantic' | 'enemy' | 'professional';
  description: string;
}

export interface Episode {
  id: number;
  title: string;
  synopsis: string;
  scenes: Scene[];
  wordCount: number;
  status: 'draft' | 'revised' | 'final';
}

export interface Scene {
  id: string;
  location: string;
  time: 'day' | 'night' | 'dawn' | 'dusk';
  characters: string[];
  action: string;
  dialogue: Dialogue[];
}

export interface Dialogue {
  characterId: string;
  content: string;
}

export interface MarketReference {
  id: string;
  platform: string;
  title: string;
  genre: string;
  views: number;
  rating: number;
  analysis: string;
}

export interface ScoreResult {
  overall: number;
  marketFit: number;
  originality: number;
  commercial: number;
  structure: number;
  character: number;
  suggestions: string[];
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// 同步状态
export type SyncStatus = 'loading' | 'synced' | 'syncing' | 'local' | 'error';
