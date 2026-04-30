import { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, DollarSign, CheckCircle2, AlertCircle, Sparkles, Film, Tv, Globe, Heart, BarChart3, Grid3X3, X, ChevronDown, Search, Star } from 'lucide-react';
import type { Idea, Topic, Project } from '../types';

interface TopicEvaluatorProps {
  ideas: Idea[];
  onTopicSelect: (topic: Topic | null) => void;
  selectedTopic: Topic | null;
  onProjectUpdate: (updates: Partial<Project>) => void;
  selectedGenres?: string[];
  onGenresChange?: (genres: string[]) => void;
  onAudienceChange?: (audience: string) => void;
  format?: string;
}

// ===== 各创作形式的题材类型配置 =====
const GENRE_CONFIGS: Record<string, {
  label: string;
  icon: any;
  items: { value: string; score: number; trend: string; competition: string; category?: string }[];
}> = {
  'short-drama': {
    label: '题材类型',
    icon: Target,
    items: [
      // 热门推荐
      { value: '闪婚甜宠', score: 92, trend: '上升', competition: '激烈', category: '热门' },
      { value: '打脸虐渣', score: 88, trend: '上升', competition: '激烈', category: '热门' },
      { value: '先婚后爱', score: 85, trend: '上升', competition: '中等', category: '热门' },
      { value: '萌宝团宠', score: 86, trend: '上升', competition: '中等', category: '热门' },
      { value: '都市重生', score: 80, trend: '上升', competition: '激烈', category: '热门' },
      // 穿越异世
      { value: '穿书穿书', score: 82, trend: '稳定', competition: '中等', category: '穿越异世' },
      { value: '玄幻仙侠', score: 78, trend: '稳定', competition: '中等', category: '穿越异世' },
      { value: '种田穿越', score: 68, trend: '上升', competition: '一般', category: '穿越异世' },
      { value: '王妃女尊', score: 74, trend: '稳定', competition: '中等', category: '穿越异世' },
      { value: '古风穿越', score: 65, trend: '下降', competition: '激烈', category: '穿越异世' },
      // 情感纠葛
      { value: '追妻二婚', score: 75, trend: '上升', competition: '一般', category: '情感纠葛' },
      { value: '现言甜宠', score: 70, trend: '稳定', competition: '激烈', category: '情感纠葛' },
      { value: '民国谍战', score: 72, trend: '稳定', competition: '一般', category: '情感纠葛' },
      // 类型创新
      { value: '悬疑推理', score: 72, trend: '上升', competition: '一般', category: '类型创新' },
      { value: '职场商战', score: 68, trend: '稳定', competition: '一般', category: '类型创新' },
      // 新增类型
      { value: '星际科幻', score: 75, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '赛博朋克', score: 73, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '末日生存', score: 71, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '双男主', score: 78, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '马甲大佬', score: 77, trend: '稳定', competition: '中等', category: '新增类型' },
      { value: '团宠萌娃', score: 76, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '黑莲花', score: 79, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '病娇反派', score: 74, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '替身文学', score: 72, trend: '稳定', competition: '中等', category: '新增类型' },
      { value: '豪门总裁', score: 82, trend: '稳定', competition: '激烈', category: '热门' },
    ],
  },
  'movie': {
    label: '电影类型',
    icon: Film,
    items: [
      // 热门推荐
      { value: '悬疑犯罪', score: 90, trend: '上升', competition: '中等', category: '热门' },
      { value: '科幻片', score: 88, trend: '上升', competition: '中等', category: '热门' },
      { value: '喜剧片', score: 85, trend: '稳定', competition: '激烈', category: '热门' },
      { value: '动作片', score: 83, trend: '稳定', competition: '中等', category: '热门' },
      { value: '动画片', score: 86, trend: '上升', competition: '中等', category: '热门' },
      // 剧情文艺
      { value: '剧情片', score: 82, trend: '稳定', competition: '中等', category: '剧情文艺' },
      { value: '爱情片', score: 80, trend: '稳定', competition: '激烈', category: '剧情文艺' },
      { value: '文艺片', score: 75, trend: '稳定', competition: '一般', category: '剧情文艺' },
      { value: '家庭片', score: 70, trend: '稳定', competition: '一般', category: '剧情文艺' },
      { value: '传记片', score: 68, trend: '稳定', competition: '一般', category: '剧情文艺' },
      // 类型片
      { value: '惊悚恐怖', score: 78, trend: '上升', competition: '一般', category: '类型片' },
      { value: '奇幻片', score: 76, trend: '上升', competition: '中等', category: '类型片' },
      { value: '战争片', score: 74, trend: '稳定', competition: '一般', category: '类型片' },
      { value: '谍战片', score: 73, trend: '上升', competition: '一般', category: '类型片' },
      { value: '纪录片', score: 72, trend: '上升', competition: '一般', category: '类型片' },
      // 新增类型
      { value: '超级英雄', score: 82, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '游戏改编', score: 78, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '漫改电影', score: 76, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '国风武侠', score: 74, trend: '稳定', competition: '一般', category: '新增类型' },
      { value: '体育竞技', score: 72, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '灾难片', score: 73, trend: '稳定', competition: '一般', category: '新增类型' },
      { value: '音乐歌舞', score: 68, trend: '稳定', competition: '一般', category: '新增类型' },
      { value: '黑色幽默', score: 75, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '赛博朋克', score: 77, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '轻科幻', score: 79, trend: '上升', competition: '中等', category: '新增类型' },
    ],
  },
  'tv-drama': {
    label: '剧集类型',
    icon: Tv,
    items: [
      // 热门推荐
      { value: '涉案悬疑', score: 90, trend: '上升', competition: '中等', category: '热门' },
      { value: '都市情感', score: 88, trend: '稳定', competition: '激烈', category: '热门' },
      { value: '古装剧', score: 85, trend: '稳定', competition: '激烈', category: '热门' },
      { value: '刑侦剧', score: 86, trend: '上升', competition: '一般', category: '热门' },
      // 行业剧
      { value: '医疗剧', score: 82, trend: '稳定', competition: '中等', category: '行业剧' },
      { value: '职场剧', score: 80, trend: '稳定', competition: '中等', category: '行业剧' },
      { value: '律政剧', score: 78, trend: '上升', competition: '一般', category: '行业剧' },
      { value: '金融剧', score: 76, trend: '稳定', competition: '一般', category: '行业剧' },
      // 情感剧
      { value: '家庭伦理', score: 74, trend: '稳定', competition: '一般', category: '情感剧' },
      { value: '校园剧', score: 78, trend: '稳定', competition: '激烈', category: '情感剧' },
      { value: '年代剧', score: 75, trend: '稳定', competition: '一般', category: '情感剧' },
      { value: '军旅剧', score: 76, trend: '上升', competition: '一般', category: '情感剧' },
      // 类型创新
      { value: '玄幻仙侠', score: 72, trend: '下降', competition: '激烈', category: '类型创新' },
      { value: '喜剧', score: 70, trend: '稳定', competition: '中等', category: '类型创新' },
      { value: '谍战剧', score: 73, trend: '上升', competition: '一般', category: '类型创新' },
      { value: '科幻剧', score: 71, trend: '上升', competition: '中等', category: '类型创新' },
      // 新增类型
      { value: '漫改剧', score: 77, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '双男主', score: 79, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '姐弟恋', score: 78, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '电竞剧', score: 75, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '旅行冒险', score: 72, trend: '上升', competition: '一般', category: '新增类型' },
      { value: '美食剧', score: 74, trend: '稳定', competition: '一般', category: '新增类型' },
      { value: '玄学剧', score: 76, trend: '上升', competition: '中等', category: '新增类型' },
      { value: '轻喜剧', score: 73, trend: '稳定', competition: '中等', category: '新增类型' },
    ],
  },
  'documentary': {
    label: '纪实题材',
    icon: Globe,
    items: [
      // 热门推荐
      { value: '社会现实', score: 88, trend: '上升', competition: '一般', category: '热门' },
      { value: '非遗文化', score: 86, trend: '上升', competition: '一般', category: '热门' },
      { value: '自然地理', score: 85, trend: '上升', competition: '一般', category: '热门' },
      // 文化历史
      { value: '人文历史', score: 82, trend: '稳定', competition: '中等', category: '文化历史' },
      { value: '人物传记', score: 78, trend: '稳定', competition: '一般', category: '文化历史' },
      { value: '非遗传承', score: 84, trend: '上升', competition: '一般', category: '文化历史' },
      // 科技自然
      { value: '科技数码', score: 80, trend: '上升', competition: '中等', category: '科技自然' },
      { value: '生态环保', score: 74, trend: '上升', competition: '一般', category: '科技自然' },
      { value: '探险极限', score: 75, trend: '上升', competition: '一般', category: '科技自然' },
      // 生活百科
      { value: '美食旅行', score: 83, trend: '稳定', competition: '中等', category: '生活百科' },
      { value: '体育运动', score: 70, trend: '稳定', competition: '一般', category: '生活百科' },
      { value: '财经商业', score: 72, trend: '稳定', competition: '一般', category: '生活百科' },
      // 特殊题材
      { value: '军事国防', score: 73, trend: '稳定', competition: '一般', category: '特殊题材' },
      { value: '庭审纪实', score: 76, trend: '上升', competition: '一般', category: '特殊题材' },
      { value: '医疗健康', score: 78, trend: '上升', competition: '一般', category: '特殊题材' },
      { value: '教育成长', score: 76, trend: '上升', competition: '中等' },
      { value: '艺术审美', score: 71, trend: '稳定', competition: '一般' },
      { value: '宗教哲学', score: 68, trend: '稳定', competition: '一般' },
    ],
  },
  'novel': {
    label: '小说类型',
    icon: Target,
    items: [
      { value: '都市异能', score: 90, trend: '上升', competition: '激烈' },
      { value: '玄幻奇幻', score: 88, trend: '稳定', competition: '激烈' },
      { value: '仙侠修真', score: 85, trend: '稳定', competition: '激烈' },
      { value: '穿越重生', score: 82, trend: '下降', competition: '激烈' },
      { value: '悬疑推理', score: 86, trend: '上升', competition: '中等' },
      { value: '科幻末世', score: 83, trend: '上升', competition: '中等' },
      { value: '言情甜宠', score: 80, trend: '稳定', competition: '激烈' },
      { value: '武侠江湖', score: 75, trend: '稳定', competition: '中等' },
      { value: '现代言情', score: 78, trend: '稳定', competition: '激烈' },
      { value: '古代言情', score: 76, trend: '稳定', competition: '激烈' },
      { value: '游戏电竞', score: 74, trend: '上升', competition: '中等' },
      { value: '校园青春', score: 72, trend: '稳定', competition: '激烈' },
      { value: '耽美纯爱', score: 70, trend: '稳定', competition: '中等' },
      { value: '民国风云', score: 68, trend: '上升', competition: '一般' },
      { value: '现实主义', score: 66, trend: '稳定', competition: '一般' },
    ],
  },
  'poetry': {
    label: '诗词风格',
    icon: Target,
    items: [
      { value: '古典律诗', score: 90, trend: '稳定', competition: '一般', category: '古典诗词' },
      { value: '词牌填词', score: 88, trend: '稳定', competition: '一般', category: '古典诗词' },
      { value: '绝句', score: 85, trend: '稳定', competition: '一般', category: '古典诗词' },
      { value: '古风乐府', score: 82, trend: '上升', competition: '一般', category: '古典诗词' },
      { value: '现代诗', score: 85, trend: '上升', competition: '中等', category: '现代诗' },
      { value: '自由诗', score: 80, trend: '上升', competition: '中等', category: '现代诗' },
      { value: '散文诗', score: 78, trend: '上升', competition: '中等', category: '现代诗' },
      { value: '咏物', score: 80, trend: '稳定', competition: '一般', category: '意境主题' },
      { value: '写景抒情', score: 85, trend: '稳定', competition: '一般', category: '意境主题' },
      { value: '思念离别', score: 82, trend: '稳定', competition: '一般', category: '意境主题' },
      { value: '田园山水', score: 78, trend: '稳定', competition: '一般', category: '意境主题' },
      { value: '节令节气', score: 76, trend: '上升', competition: '一般', category: '意境主题' },
    ],
  },
  'prose': {
    label: '散文类型',
    icon: Target,
    items: [
      { value: '叙事散文', score: 88, trend: '稳定', competition: '一般', category: '基础类型' },
      { value: '抒情散文', score: 90, trend: '稳定', competition: '一般', category: '基础类型' },
      { value: '哲思散文', score: 82, trend: '上升', competition: '中等', category: '基础类型' },
      { value: '游记散文', score: 80, trend: '上升', competition: '中等', category: '基础类型' },
      { value: '回忆随笔', score: 85, trend: '稳定', competition: '一般', category: '风格' },
      { value: '自然文学', score: 78, trend: '上升', competition: '一般', category: '风格' },
      { value: '人物速写', score: 76, trend: '稳定', competition: '一般', category: '风格' },
    ],
  },
  'lyrics': {
    label: '曲风类型',
    icon: Target,
    items: [
      { value: '流行情歌', score: 92, trend: '上升', competition: '激烈', category: '热门曲风' },
      { value: 'R&B/Soul', score: 88, trend: '上升', competition: '中等', category: '热门曲风' },
      { value: '民谣', score: 85, trend: '上升', competition: '中等', category: '热门曲风' },
      { value: '国风', score: 90, trend: '上升', competition: '中等', category: '热门曲风' },
      { value: '摇滚', score: 80, trend: '稳定', competition: '中等', category: '其他曲风' },
      { value: '说唱', score: 85, trend: '上升', competition: '激烈', category: '其他曲风' },
      { value: '电子舞曲', score: 78, trend: '上升', competition: '中等', category: '其他曲风' },
      { value: '抒情慢歌', score: 82, trend: '稳定', competition: '激烈', category: '其他曲风' },
    ],
  },
  'fairy-tale': {
    label: '童话类型',
    icon: Target,
    items: [
      { value: '经典公主故事', score: 88, trend: '稳定', competition: '中等', category: '经典风格' },
      { value: '冒险探索', score: 90, trend: '上升', competition: '中等', category: '经典风格' },
      { value: '魔法奇幻', score: 92, trend: '上升', competition: '中等', category: '经典风格' },
      { value: '动物寓言', score: 85, trend: '稳定', competition: '一般', category: '经典风格' },
      { value: '成长励志', score: 86, trend: '上升', competition: '中等', category: '现代风格' },
      { value: '环保主题', score: 80, trend: '上升', competition: '一般', category: '现代风格' },
      { value: '多元文化', score: 78, trend: '上升', competition: '一般', category: '现代风格' },
    ],
  },
  'fable': {
    label: '寓言类型',
    icon: Target,
    items: [
      { value: '动物寓言', score: 90, trend: '稳定', competition: '一般', category: '传统类型' },
      { value: '人物寓言', score: 85, trend: '稳定', competition: '一般', category: '传统类型' },
      { value: '社会讽刺', score: 82, trend: '上升', competition: '中等', category: '传统类型' },
      { value: '哲理短篇', score: 80, trend: '稳定', competition: '一般', category: '现代类型' },
      { value: '科技寓言', score: 78, trend: '上升', competition: '一般', category: '现代类型' },
    ],
  },
  'stage-play': {
    label: '话剧类型',
    icon: Target,
    items: [
      { value: '现实主义话剧', score: 88, trend: '稳定', competition: '中等', category: '剧种' },
      { value: '历史剧', score: 85, trend: '稳定', competition: '中等', category: '剧种' },
      { value: '心理悬疑剧', score: 90, trend: '上升', competition: '中等', category: '剧种' },
      { value: '喜剧', score: 88, trend: '上升', competition: '中等', category: '剧种' },
      { value: '实验剧', score: 75, trend: '上升', competition: '一般', category: '剧种' },
      { value: '青春校园剧', score: 80, trend: '上升', competition: '中等', category: '剧种' },
    ],
  },
  'crosstalk': {
    label: '相声类型',
    icon: Target,
    items: [
      { value: '传统相声', score: 88, trend: '稳定', competition: '中等', category: '形式' },
      { value: '新式相声', score: 90, trend: '上升', competition: '中等', category: '形式' },
      { value: '对口相声', score: 85, trend: '稳定', competition: '中等', category: '形式' },
      { value: '单口相声', score: 82, trend: '上升', competition: '中等', category: '形式' },
      { value: '生活题材', score: 88, trend: '上升', competition: '中等', category: '主题' },
      { value: '社会讽刺', score: 85, trend: '上升', competition: '中等', category: '主题' },
      { value: '时事吐槽', score: 82, trend: '上升', competition: '激烈', category: '主题' },
    ],
  },
  'sketch': {
    label: '小品类型',
    icon: Target,
    items: [
      { value: '喜剧小品', score: 92, trend: '上升', competition: '激烈', category: '类型' },
      { value: '情感小品', score: 85, trend: '稳定', competition: '中等', category: '类型' },
      { value: '社会题材', score: 88, trend: '上升', competition: '中等', category: '类型' },
      { value: '春晚风格', score: 82, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '网络短剧风', score: 90, trend: '上升', competition: '激烈', category: '类型' },
    ],
  },
  // ===== 视频类 =====
  'microfilm': {
    label: '微电影类型',
    icon: Target,
    items: [
      { value: '情感类', score: 90, trend: '稳定', competition: '中等', category: '类型' },
      { value: '励志类', score: 88, trend: '上升', competition: '中等', category: '类型' },
      { value: '悬疑类', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '幽默类', score: 82, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '公益类', score: 78, trend: '稳定', competition: '一般', category: '类型' },
    ],
  },
  'anime': {
    label: '动画类型',
    icon: Target,
    items: [
      { value: '热血冒险', score: 90, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '校园日常', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '奇幻魔法', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '科幻机甲', score: 80, trend: '上升', competition: '一般', category: '类型' },
      { value: '治愈温馨', score: 82, trend: '稳定', competition: '中等', category: '类型' },
    ],
  },
  'audio-drama': {
    label: '广播剧类型',
    icon: Target,
    items: [
      { value: '悬疑推理', score: 90, trend: '上升', competition: '中等', category: '类型' },
      { value: '言情甜宠', score: 88, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '科幻未来', score: 80, trend: '上升', competition: '一般', category: '类型' },
      { value: '古风武侠', score: 85, trend: '稳定', competition: '中等', category: '类型' },
      { value: '耽美BL', score: 82, trend: '稳定', competition: '中等', category: '类型' },
    ],
  },
  'variety': {
    label: '综艺类型',
    icon: Target,
    items: [
      { value: '真人秀', score: 90, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '选秀竞演', score: 85, trend: '上升', competition: '激烈', category: '类型' },
      { value: '脱口秀', score: 88, trend: '上升', competition: '中等', category: '类型' },
      { value: '慢综艺', score: 82, trend: '稳定', competition: '中等', category: '类型' },
      { value: '竞技挑战', score: 80, trend: '稳定', competition: '中等', category: '类型' },
    ],
  },
  // ===== 小说类 =====
  'medium-story': {
    label: '中篇类型',
    icon: Target,
    items: [
      { value: '都市情感', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '职场商战', score: 82, trend: '上升', competition: '一般', category: '类型' },
      { value: '悬疑推理', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '青春成长', score: 80, trend: '稳定', competition: '中等', category: '类型' },
    ],
  },
  'short-story': {
    label: '短篇类型',
    icon: Target,
    items: [
      { value: '都市情感', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '悬疑惊悚', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '科幻脑洞', score: 82, trend: '上升', competition: '一般', category: '类型' },
      { value: '现实主义', score: 78, trend: '稳定', competition: '一般', category: '类型' },
    ],
  },
  'micro-fiction': {
    label: '微小说类型',
    icon: Target,
    items: [
      { value: '反转结局', score: 90, trend: '上升', competition: '激烈', category: '特点' },
      { value: '温情治愈', score: 85, trend: '稳定', competition: '中等', category: '特点' },
      { value: '犀利毒舌', score: 82, trend: '上升', competition: '中等', category: '特点' },
      { value: '脑洞创意', score: 88, trend: '上升', competition: '激烈', category: '特点' },
    ],
  },
  // ===== 营销文类 =====
  'speech': {
    label: '演讲类型',
    icon: Target,
    items: [
      { value: '商业路演', score: 90, trend: '上升', competition: '中等', category: '类型' },
      { value: ' TED演讲', score: 85, trend: '稳定', competition: '中等', category: '类型' },
      { value: '励志演讲', score: 88, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '产品发布会', score: 82, trend: '上升', competition: '一般', category: '类型' },
      { value: '学术报告', score: 75, trend: '稳定', competition: '一般', category: '类型' },
    ],
  },
  'brand-story': {
    label: '品牌类型',
    icon: Target,
    items: [
      { value: '创始故事', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '产品故事', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '用户故事', score: 82, trend: '稳定', competition: '中等', category: '类型' },
      { value: '品牌理念', score: 80, trend: '稳定', competition: '一般', category: '类型' },
    ],
  },
  'wechat-article': {
    label: '文章类型',
    icon: Target,
    items: [
      { value: '观点论述', score: 90, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '故事叙事', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '干货教程', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '热点追评', score: 82, trend: '上升', competition: '激烈', category: '类型' },
      { value: '清单盘点', score: 78, trend: '稳定', competition: '中等', category: '类型' },
    ],
  },
  'advertising': {
    label: '广告类型',
    icon: Target,
    items: [
      { value: '品牌广告', score: 88, trend: '稳定', competition: '中等', category: '类型' },
      { value: '产品广告', score: 90, trend: '稳定', competition: '激烈', category: '类型' },
      { value: '情感广告', score: 85, trend: '上升', competition: '中等', category: '类型' },
      { value: '功效广告', score: 82, trend: '稳定', competition: '激烈', category: '类型' },
    ],
  },
};

// ===== 各创作形式的目标受众配置 =====
const AUDIENCE_CONFIGS: Record<string, {
  items: { value: string; score: number; description: string }[];
}> = {
  'short-drama': {
    items: [
      { value: '18-25岁女性', score: 90, description: '主流消费群体，付费意愿强' },
      { value: '25-35岁女性', score: 85, description: '经济独立，注重品质' },
      { value: '全年龄段', score: 70, description: '覆盖面广，但针对性弱' },
      { value: '中年女性', score: 60, description: '用户基数较小' },
    ],
  },
  'movie': {
    items: [
      { value: '文艺青年', score: 85, description: '追求深度，豆瓣核心用户' },
      { value: '合家欢受众', score: 88, description: '档期爆款，春节/暑期主力' },
      { value: '类型片爱好者', score: 82, description: '悬疑/科幻/恐怖等垂直用户' },
      { value: '情侣群体', score: 80, description: '爱情/喜剧主力观众' },
      { value: '学生群体', score: 75, description: '校园/青春类型核心受众' },
      { value: '中年男性', score: 70, description: '动作/军事/悬疑主力' },
    ],
  },
  'tv-drama': {
    items: [
      { value: '卫视黄金档', score: 88, description: '合家欢题材，受众广泛' },
      { value: '网络剧集', score: 85, description: '年轻用户为主，题材多元' },
      { value: '悬疑剧迷', score: 83, description: '高粘性，追剧意愿强' },
      { value: '古装剧迷', score: 80, description: '女性为主，付费意愿高' },
      { value: '都市白领', score: 78, description: '情感/职场类型核心' },
      { value: '学生群体', score: 72, description: '校园/青春类型主力' },
    ],
  },
  'documentary': {
    items: [
      { value: '知识爱好者', score: 88, description: '高学历，追求深度内容' },
      { value: '大众科普', score: 85, description: 'B站/短视频泛受众' },
      { value: '专业学术', score: 75, description: '学术圈，垂类深度' },
      { value: '中老年群体', score: 70, description: '历史/健康类偏好' },
      { value: '国际传播', score: 72, description: '对外传播，文化出海' },
      { value: '亲子教育', score: 73, description: '自然/动物/科普类' },
    ],
  },
  'novel': {
    items: [
      { value: '女性读者', score: 90, description: '言情/古言/现言核心' },
      { value: '男性读者', score: 82, description: '玄幻/都市/悬疑主力' },
      { value: '学生群体', score: 78, description: '校园/轻小说偏好' },
      { value: '资深书虫', score: 85, description: '老白读者，粘性极高' },
      { value: '泛娱乐用户', score: 75, description: '听书/漫画转化' },
    ],
  },
  'poetry': {
    items: [
      { value: '古典文学爱好者', score: 90, description: '传统诗词核心受众，鉴赏能力强' },
      { value: '文学青年', score: 85, description: '现代诗/先锋诗主力' },
      { value: '学生群体', score: 80, description: '课业需求+兴趣爱好' },
      { value: '文化传播受众', score: 75, description: '国风/传统文化粉丝' },
    ],
  },
  'prose': {
    items: [
      { value: '文学爱好者', score: 88, description: '散文核心读者群' },
      { value: '中年读者', score: 85, description: '偏好回忆与哲思类散文' },
      { value: '学生群体', score: 78, description: '阅读与写作练习需求' },
      { value: '都市白领', score: 80, description: '短篇随笔，碎片化阅读' },
    ],
  },
  'lyrics': {
    items: [
      { value: '年轻音乐听众', score: 92, description: '15-30岁，流行/国风主力' },
      { value: '音乐创作者', score: 88, description: '有填词需求的独立音乐人' },
      { value: '国风爱好者', score: 85, description: '古风/中国风核心受众' },
      { value: '泛娱乐用户', score: 75, description: '追星/KTV/短视频用户' },
    ],
  },
  'fairy-tale': {
    items: [
      { value: '亲子家庭', score: 92, description: '3-10岁儿童家长，购买力强' },
      { value: '儿童读者', score: 88, description: '直接阅读受众' },
      { value: '童书创作者', score: 80, description: '有出版需求的作者' },
      { value: '教育机构', score: 85, description: '幼儿园/早教中心采购' },
    ],
  },
  'fable': {
    items: [
      { value: '亲子家庭', score: 88, description: '寓教于乐，家长首选' },
      { value: '中小学生', score: 85, description: '道德教育/语文阅读需求' },
      { value: '哲学爱好者', score: 78, description: '现代寓言/社会讽刺读者' },
      { value: '教育工作者', score: 82, description: '课堂教学素材需求' },
    ],
  },
  'stage-play': {
    items: [
      { value: '话剧爱好者', score: 90, description: '剧场核心观众，付费意愿强' },
      { value: '文艺青年', score: 85, description: '豆瓣/小红书文化圈' },
      { value: '学生群体', score: 80, description: '校园话剧团/戏剧专业' },
      { value: '都市白领', score: 78, description: '周末文化消费主力' },
    ],
  },
  'crosstalk': {
    items: [
      { value: '相声老粉', score: 90, description: '传统相声忠实听众' },
      { value: '年轻受众', score: 85, description: '德云社/新式相声粉丝' },
      { value: '全年龄段', score: 80, description: '家庭娱乐，合家欢属性' },
      { value: '综艺观众', score: 75, description: '通过综艺触达的泛受众' },
    ],
  },
  'sketch': {
    items: [
      { value: '全年龄段', score: 92, description: '小品覆盖面广，合家欢属性强' },
      { value: '春晚观众', score: 88, description: '节庆文化消费主力' },
      { value: '短视频用户', score: 85, description: '网络小品/二创核心受众' },
      { value: '中老年群体', score: 80, description: '传统小品忠实受众' },
    ],
  },
  // ===== 视频类 =====
  'microfilm': {
    items: [
      { value: '年轻女性', score: 88, description: '情感/励志类微电影核心受众' },
      { value: '职场人群', score: 82, description: '职场/励志类受众' },
      { value: '学生群体', score: 80, description: '创意/公益类微电影受众' },
    ],
  },
  'anime': {
    items: [
      { value: '二次元群体', score: 90, description: '动漫核心受众，付费意愿强' },
      { value: '青少年', score: 85, description: '热血/校园类型主力' },
      { value: '全年龄段', score: 70, description: '合家欢动画受众' },
    ],
  },
  'audio-drama': {
    items: [
      { value: '声控群体', score: 88, description: '广播剧核心听众，注重配音' },
      { value: '通勤人群', score: 85, description: '利用碎片时间收听' },
      { value: '年轻女性', score: 82, description: '言情/悬疑类主力' },
    ],
  },
  'variety': {
    items: [
      { value: '年轻女性', score: 88, description: '选秀/真人秀核心受众' },
      { value: '全家收视', score: 85, description: '合家欢综艺主力' },
      { value: '白领群体', score: 78, description: '脱口秀/慢综艺受众' },
    ],
  },
  // ===== 小说类 =====
  'medium-story': {
    items: [
      { value: '女性读者', score: 88, description: '都市情感类核心受众' },
      { value: '资深读者', score: 85, description: '追求故事深度与完整性' },
      { value: '学生群体', score: 75, description: '课余阅读需求' },
    ],
  },
  'short-story': {
    items: [
      { value: '碎片时间用户', score: 88, description: '利用通勤等碎片时间阅读' },
      { value: '悬疑爱好者', score: 85, description: '短篇悬疑核心受众' },
      { value: '泛娱乐用户', score: 78, description: '追求快速阅读体验' },
    ],
  },
  'micro-fiction': {
    items: [
      { value: '社交媒体用户', score: 90, description: '微博/朋友圈短内容受众' },
      { value: '年轻群体', score: 85, description: '追求快速阅读与反转刺激' },
      { value: '泛娱乐用户', score: 80, description: '短视频/图文内容消费群体' },
    ],
  },
  // ===== 营销文类 =====
  'speech': {
    items: [
      { value: '投资人/创业者', score: 90, description: '商业路演核心受众' },
      { value: '职场人士', score: 85, description: '职场技能/励志演讲受众' },
      { value: '知识追求者', score: 80, description: 'TED/思想分享类演讲受众' },
    ],
  },
  'brand-story': {
    items: [
      { value: '品牌消费者', score: 88, description: '品牌故事影响消费决策' },
      { value: '创业者/企业家', score: 85, description: '学习品牌建设' },
      { value: '营销从业者', score: 80, description: '品牌案例学习参考' },
    ],
  },
  'wechat-article': {
    items: [
      { value: '职场白领', score: 88, description: '职场/干货类文章核心读者' },
      { value: '年轻女性', score: 85, description: '情感/观点类文章主力读者' },
      { value: '学生群体', score: 78, description: '干货/成长类文章受众' },
    ],
  },
  'advertising': {
    items: [
      { value: '目标消费者', score: 90, description: '广告触达核心群体' },
      { value: '品牌粉丝', score: 85, description: '情感连接型广告受众' },
      { value: '泛受众', score: 70, description: '大众品牌广告覆盖' },
    ],
  },
};

// ===== Logline 提示词模板 =====
const LOGLINE_TEMPLATES: Record<string, { label: string; placeholder: string; hint: string }> = {
  'short-drama': {
    label: '一句话故事（Logline）',
    placeholder: '用一句话概括你的故事核心...\n格式：在一个XX（背景）下，XX（主角）因为XX（起因）必须XX（目标），否则XX（后果）。',
    hint: '好的Logline能让观众一眼看出故事的核心吸引力',
  },
  'movie': {
    label: '一句话故事（Logline）',
    placeholder: '用一句话概括你的电影故事...\n格式：讲述一个XX（类型）的故事，XX（主角）在XX（情境）中必须XX（行动），最终XX（结果）。',
    hint: '院线电影的Logline要能在30秒内勾起观众的观影欲望',
  },
  'tv-drama': {
    label: '一句话故事（Logline）',
    placeholder: '用一句话概括你的剧集故事...\n格式：在XX（背景）下，XX（主角/群像）面临XX（核心冲突），引出XX（主线悬念）。',
    hint: '电视剧的Logline要能支撑起20-40集的故事体量',
  },
  'documentary': {
    label: '一句话主题',
    placeholder: '用一句话概括你的纪录片主题...\n格式：通过XX（视角/人物/事件），探讨/揭示/呈现XX（核心议题/主题）。',
    hint: '纪录片的Logline要能体现选题的社会价值与观众共鸣',
  },
  'novel': {
    label: '一句话故事（Logline）',
    placeholder: '用一句话概括你的小说核心...\n格式：XX（世界观/设定）下，XX（主角）面临XX（核心矛盾），最终走向XX（命运/结局）。',
    hint: '网络小说的Logline决定了读者是否会点进第一章',
  },
  'poetry': {
    label: '意境描述',
    placeholder: '用一句话描述你想营造的意境...\n例：借秋日落叶，抒写离人思乡之情，意境清寂而深远。',
    hint: '好的意境描述能帮助确定诗词的情感基调与意象选择',
  },
  'prose': {
    label: '散文主旨',
    placeholder: '用一句话概括散文的主旨...\n例：通过故乡老屋的记忆，呈现时光流逝中人与土地的深情羁绊。',
    hint: '散文的主旨决定了情感的走向与素材的取舍',
  },
  'lyrics': {
    label: '歌词主题',
    placeholder: '用一句话概括歌词的核心主题...\n例：写给异地恋人的一封情书，在距离与思念中寻找坚持的力量。',
    hint: '明确主题能帮助歌词在情感上保持统一性与感染力',
  },
  'fairy-tale': {
    label: '一句话故事',
    placeholder: '用一句话概括童话的故事核心...\n例：一个怕黑的小女孩，在魔法森林中学会了勇敢面对黑暗。',
    hint: '童话的核心故事要简单、有趣，并传递正向价值观',
  },
  'fable': {
    label: '寓言寓意',
    placeholder: '用一句话概括寓言想传达的道理...\n例：通过乌鸦学鹰飞翔最终失败的故事，说明认清自身局限的重要性。',
    hint: '寓言的寓意要清晰，故事要简短有力',
  },
  'stage-play': {
    label: '戏剧主题',
    placeholder: '用一句话概括话剧的戏剧主题...\n例：一个家庭三代人在老宅拆迁前夕的最后团聚，揭示代际间深埋的误解与和解。',
    hint: '话剧主题要具有舞台张力，能够支撑完整的戏剧冲突',
  },
  'crosstalk': {
    label: '相声主题',
    placeholder: '用一句话概括相声的核心主题...\n例：围绕"外卖小哥送餐记"展开，讽刺现代都市人的焦虑与效率崇拜。',
    hint: '相声主题要贴近生活，包袱要自然植入，避免强硬说教',
  },
  'sketch': {
    label: '小品主题',
    placeholder: '用一句话概括小品的核心笑点与主题...\n例：误把领导认成外卖员引发的连环误会，折射出职场中人际关系的微妙。',
    hint: '小品要在笑声中传递温情或思考，结尾往往需要情感升华',
  },
  // ===== 视频类 =====
  'microfilm': {
    label: '微电影主题',
    placeholder: '用一句话概括微电影的核心主题...\n格式：在XX（场景）中，XX（人物）因为XX（冲突）展现了XX（情感/主题）。',
    hint: '微电影主题要能在5-15分钟内完整呈现并打动观众',
  },
  'anime': {
    label: '动画主题',
    placeholder: '用一句话概括动画的核心主题...\n格式：在XX（世界观）下，XX（主角）追求/守护XX（目标/信念），展现了XX（核心主题）。',
    hint: '动画主题要能吸引目标年龄段观众，并传递正向价值观',
  },
  'audio-drama': {
    label: '广播剧主题',
    placeholder: '用一句话概括广播剧的核心主题...\n格式：XX（世界观/设定）下，XX（主角）面临XX（核心事件），展开XX（故事线）。',
    hint: '广播剧主题要适合纯听觉呈现，冲突要有张力',
  },
  'variety': {
    label: '综艺主题',
    placeholder: '用一句话概括综艺的核心创意...\n格式：一档XX（类型）的综艺节目，通过XX（核心环节/设定）呈现XX（看点/价值）。',
    hint: '综艺主题要能持续吸引观众注意力，有娱乐点',
  },
  // ===== 小说类 =====
  'medium-story': {
    label: '中篇主题',
    placeholder: '用一句话概括中篇小说的核心主题...\n格式：在XX（背景/设定）下，XX（人物）经历了XX（核心事件），揭示了XX（主题）。',
    hint: '中篇小说主题要能在3-10万字内完整呈现',
  },
  'short-story': {
    label: '短篇主题',
    placeholder: '用一句话概括短篇小说的核心主题...\n格式：XX（人物/情境）因为XX（冲突），最终展现了XX（主题/感悟）。',
    hint: '短篇主题要集中，通常聚焦一个核心冲突或感悟',
  },
  'micro-fiction': {
    label: '微小说主题',
    placeholder: '用一句话概括微小说的核心创意...\n格式：在一个XX（反转/设定）下，XX（人物）展现了XX（主题/情感）。',
    hint: '微小说主题要能在几百字内完整呈现并有反转或亮点',
  },
  // ===== 营销文类 =====
  'speech': {
    label: '演讲主题',
    placeholder: '用一句话概括演讲的核心观点...\n格式：我想通过这次演讲传达XX（核心观点），让听众感受到/认识到XX（价值）。',
    hint: '演讲主题要清晰有力度，能在短时间内打动听众',
  },
  'brand-story': {
    label: '品牌主题',
    placeholder: '用一句话概括品牌故事的核心...\n格式：我们的品牌从XX（起源点）出发，致力于XX（使命），核心故事围绕XX（关键事件）。',
    hint: '品牌故事主题要与品牌定位高度契合',
  },
  'wechat-article': {
    label: '文章主题',
    placeholder: '用一句话概括公众号文章的核心论点...\n格式：这篇文章的核心论点是XX（观点），通过XX（切入角度）吸引读者共鸣。',
    hint: '文章主题要能引发读者点击和分享欲望',
  },
  'advertising': {
    label: '广告主题',
    placeholder: '用一句话概括广告的核心信息...\n格式：这个广告要传达XX（核心卖点/情感），让目标用户XX（产生行动）。',
    hint: '广告主题要简洁有力，一句话打动消费者',
  },
};

function getDefaultGenreItems() {
  return GENRE_CONFIGS['short-drama'].items;
}

function getDefaultAudienceItems() {
  return AUDIENCE_CONFIGS['short-drama'].items;
}

export default function TopicEvaluator({
  ideas,
  onTopicSelect,
  selectedTopic,
  onProjectUpdate,
  selectedGenres = [],
  onGenresChange,
  onAudienceChange,
  format,
}: TopicEvaluatorProps) {
  const [logline, setLogline] = useState('');
  const [selectedGenresLocal, setSelectedGenresLocal] = useState<string[]>(selectedGenres);
  const [selectedAudience, setSelectedAudience] = useState('');
  const [notes, setNotes] = useState('');

  // 获取当前创作形式
  const currentFormat = format || 'short-drama';
  const LITERARY_FORMATS = ['poetry', 'prose', 'lyrics', 'fairy-tale', 'fable'];
  const isLiteraryFormat = LITERARY_FORMATS.includes(currentFormat);

  // 高级功能状态
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid'); // 视图模式（文学类强制网格视图）
  const [filterTrend, setFilterTrend] = useState<string | null>(null); // 趋势筛选
  const [filterCompetition, setFilterCompetition] = useState<string | null>(null); // 竞争度筛选
  const [favorites, setFavorites] = useState<Set<string>>(new Set()); // 收藏
  const [compareList, setCompareList] = useState<string[]>([]); // 对比列表
  const [showCompareModal, setShowCompareModal] = useState(false); // 对比弹窗

  // 折叠功能状态 - 默认全折叠
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [audienceCollapsed, setAudienceCollapsed] = useState(true); // 目标受众折叠
  const [genreSearchQuery, setGenreSearchQuery] = useState(''); // 类型搜索

  const genreConfig = GENRE_CONFIGS[currentFormat] || GENRE_CONFIGS['short-drama'];
  const audienceConfig = AUDIENCE_CONFIGS[currentFormat] || AUDIENCE_CONFIGS['short-drama'];
  const loglineConfig = LOGLINE_TEMPLATES[currentFormat] || LOGLINE_TEMPLATES['short-drama'];

  const genreOptions = genreConfig.items;
  const audienceOptions = audienceConfig.items;

  useEffect(() => {
    if (ideas.length > 0 && !logline) {
      setLogline(ideas[0].content.slice(0, 100) + (ideas[0].content.length > 100 ? '...' : ''));
    }
  }, [ideas]);

  // 同步外部传入的题材
  useEffect(() => {
    if (selectedGenres.length > 0) {
      setSelectedGenresLocal(selectedGenres);
    }
  }, [selectedGenres]);

  // 初始化折叠状态 - 默认全折叠
  useEffect(() => {
    const categories = [...new Set(genreOptions.map(g => g.category || '其他'))];
    setCollapsedCategories(new Set(categories));
  }, []);

  // 切换 format 时重置选中状态
  useEffect(() => {
    setSelectedGenresLocal([]);
    setSelectedAudience('');
    setNotes('');
    setCollapsedCategories(new Set([...new Set(genreOptions.map(g => g.category || '其他'))])); // 重置折叠状态
    setGenreSearchQuery(''); // 重置搜索
  }, [format]);

  const primaryGenre = selectedGenresLocal[0] || '';

  const handleGenreToggle = (genre: string) => {
    const newSelected = selectedGenresLocal.includes(genre)
      ? selectedGenresLocal.filter(g => g !== genre)
      : [...selectedGenresLocal, genre];
    setSelectedGenresLocal(newSelected);
    onGenresChange?.(newSelected);
  };

  const handleAudienceSelect = (audience: string) => {
    setSelectedAudience(audience);
    onAudienceChange?.(audience);
  };

  // 渲染类型卡片
  const renderGenreCard = (genre: typeof genreOptions[0]) => {
    const isUserSelected = selectedGenresLocal.includes(genre.value);
    
    // 文学类格式：简洁风格，仅显示名称
    if (isLiteraryFormat) {
      return (
        <div
          key={genre.value}
          className={`p-3 rounded-lg border-2 text-center transition-all cursor-pointer hover:scale-102 hover:shadow-md ${
            isUserSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleGenreToggle(genre.value)}
        >
          <div className="font-medium text-gray-900 text-sm">{genre.value}</div>
        </div>
      );
    }
    
    // 非文学类格式：显示完整的商业化信息
    return (
      <div
        key={genre.value}
        className={`group relative p-2.5 rounded-lg border-2 text-left transition-all cursor-pointer hover:scale-102 hover:shadow-md ${
          isUserSelected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleGenreToggle(genre.value)}
      >
        {favorites.has(genre.value) && (
          <Heart className="absolute top-1 right-1 w-3 h-3 text-red-500 fill-current" />
        )}
        {compareList.includes(genre.value) && (
          <div className="absolute top-1 right-5 w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center">
            <BarChart3 className="w-2 h-2 text-white" />
          </div>
        )}
        <div className="font-medium text-gray-900 text-xs">{genre.value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-1 py-0.5 rounded text-xs ${
            genre.trend === '上升' ? 'bg-green-100 text-green-700' :
            genre.trend === '下降' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {genre.trend === '上升' ? '↑' : genre.trend === '下降' ? '↓' : '→'}
          </span>
          <span className="text-xs text-gray-400">{genre.competition === '一般' ? '低' : genre.competition === '中等' ? '中' : '高'}</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(genre.value); }}
            className={`p-0.5 rounded ${favorites.has(genre.value) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <Heart className={`w-3 h-3 ${favorites.has(genre.value) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(genre.value); }}
            className={`p-0.5 rounded ${compareList.includes(genre.value) ? 'text-orange-500' : 'text-gray-400 hover:text-orange-400'}`}
          >
            <BarChart3 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const handleGenerateTopic = () => {
    if (!logline || selectedGenresLocal.length === 0 || !selectedAudience) return;

    const genreData = genreOptions.find(g => g.value === primaryGenre);
    const audienceData = audienceOptions.find(a => a.value === selectedAudience);

    const trendScore = genreData ? (genreData.trend === '上升' ? 90 : genreData.trend === '稳定' ? 70 : 50) : 70;
    const competitionLevel = genreData ?
      (genreData.competition === '激烈' ? 'high' : genreData.competition === '中等' ? 'medium' : 'low') : 'medium';
    const commercialValue = ((genreData?.score || 70) + (audienceData?.score || 70)) / 2;

    const topic: Topic = {
      id: crypto.randomUUID(),
      title: ideas[0]?.content.slice(0, 20) || '未命名项目',
      logline,
      genre: primaryGenre,
      targetAudience: selectedAudience,
      trendScore,
      competitionLevel,
      commercialValue,
      notes,
    };

    onTopicSelect(topic);
    onProjectUpdate({
      title: topic.title,
      genre: primaryGenre,
      targetAudience: selectedAudience,
    });
  };

  const selectedGenreData = genreOptions.find(g => g.value === primaryGenre);
  const selectedAudienceData = audienceOptions.find(a => a.value === selectedAudience);

  // 筛选后的类型列表
  const filteredGenreOptions = genreOptions.filter(genre => {
    if (filterTrend && genre.trend !== filterTrend) return false;
    if (filterCompetition && genre.competition !== filterCompetition) return false;
    return true;
  });

  // 收藏切换
  const toggleFavorite = (genre: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(genre)) {
      newFavorites.delete(genre);
    } else {
      newFavorites.add(genre);
    }
    setFavorites(newFavorites);
  };

  // 对比切换
  const toggleCompare = (genre: string) => {
    if (compareList.includes(genre)) {
      setCompareList(compareList.filter(g => g !== genre));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, genre]);
    }
  };

  // 图表视图的数据
  const chartData = filteredGenreOptions.map(genre => ({
    ...genre,
    score: genre.score,
    // 机会指数 = 评分 * (趋势权重) * (竞争度权重)
    opportunity: genre.score * (genre.trend === '上升' ? 1.2 : genre.trend === '下降' ? 0.7 : 1) * (genre.competition === '一般' ? 1.3 : genre.competition === '激烈' ? 0.7 : 1),
  })).sort((a, b) => b.opportunity - a.opportunity);

  return (
    <div className="space-y-8">
      {/* Logline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {loglineConfig.label}
        </label>
        <textarea
          value={logline}
          onChange={(e) => setLogline(e.target.value)}
          placeholder={loglineConfig.placeholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
        <p className="mt-2 text-sm text-gray-500">
          {loglineConfig.hint}
        </p>
      </div>

      {/* 高级工具栏：筛选器 + 视图切换 + 收藏对比 - 仅非文学类显示 */}
      {!isLiteraryFormat && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* 视图切换 */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                网格
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                  viewMode === 'chart' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                图表
              </button>
            </div>

            <div className="h-6 w-px bg-blue-200" />

            {/* 趋势筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">趋势:</span>
              <button
                onClick={() => setFilterTrend(filterTrend === '上升' ? null : '上升')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterTrend === '上升'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                ↑ 上升
              </button>
              <button
                onClick={() => setFilterTrend(filterTrend === '稳定' ? null : '稳定')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterTrend === '稳定'
                    ? 'bg-gray-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                → 稳定
              </button>
              <button
                onClick={() => setFilterTrend(filterTrend === '下降' ? null : '下降')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterTrend === '下降'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
                }`}
              >
                ↓ 下降
              </button>
            </div>

            <div className="h-6 w-px bg-blue-200" />

            {/* 竞争度筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">竞争:</span>
              <button
                onClick={() => setFilterCompetition(filterCompetition === '一般' ? null : '一般')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCompetition === '一般'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                低
              </button>
              <button
                onClick={() => setFilterCompetition(filterCompetition === '中等' ? null : '中等')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCompetition === '中等'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                }`}
              >
                中
              </button>
              <button
                onClick={() => setFilterCompetition(filterCompetition === '激烈' ? null : '激烈')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  filterCompetition === '激烈'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'
                }`}
              >
                高
              </button>
            </div>

            <div className="h-6 w-px bg-blue-200" />

            {/* 快捷筛选：只看机会 */}
            <button
              onClick={() => {
                setFilterTrend(filterTrend === '上升' ? null : '上升');
                setFilterCompetition(filterCompetition === '一般' ? null : '一般');
              }}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium hover:shadow-md transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              只看机会
            </button>

            {/* 收藏和对比 */}
            <div className="flex-1" />

            <button
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length === 0}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                compareList.length > 0
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              对比({compareList.length})
            </button>
          </div>
        </div>
      )}

      {/* Genre/Type Selection - dynamic based on format */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <genreConfig.icon className="w-4 h-4 text-blue-500" />
            {genreConfig.label}
            {selectedGenres.length > 0 && <span className="text-xs text-cyan-600 font-normal">(已从创意灵感同步)</span>}
          </label>
          <span className="text-xs text-gray-400">
            {filteredGenreOptions.length} / {genreOptions.length} 个
          </span>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={genreSearchQuery}
            onChange={(e) => setGenreSearchQuery(e.target.value)}
            placeholder="搜索类型..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {genreSearchQuery && (
            <button
              onClick={() => setGenreSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {viewMode === 'chart' ? (
          /* 图表视图：机会指数排名 */
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                机会指数排名
              </h3>
              <span className="text-xs text-gray-400">综合评分×趋势×竞争度</span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {chartData.slice(0, 15).map((genre, index) => (
                <div
                  key={genre.value}
                  onClick={() => handleGenreToggle(genre.value)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                    selectedGenresLocal.includes(genre.value) ? 'bg-blue-50 border border-blue-300' : 'border border-transparent'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{genre.value}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        genre.trend === '上升' ? 'bg-green-100 text-green-700' :
                        genre.trend === '下降' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{genre.trend}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        genre.competition === '一般' ? 'bg-green-100 text-green-700' :
                        genre.competition === '中等' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>竞:{genre.competition}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `${genre.opportunity}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-blue-600">{genre.opportunity.toFixed(0)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(genre.value); }}
                    className={`p-2 rounded-lg transition-all ${
                      favorites.has(genre.value) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(genre.value) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCompare(genre.value); }}
                    className={`p-2 rounded-lg transition-all ${
                      compareList.includes(genre.value) ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 分类折叠视图 */
          <div className="space-y-2">
            {/* 获取所有分类 */}
            {(() => {
              const categories = [...new Set(filteredGenreOptions.map(g => g.category || '其他'))];
              const filteredBySearch = genreSearchQuery
                ? filteredGenreOptions.filter(g => g.value.includes(genreSearchQuery) || g.category?.includes(genreSearchQuery))
                : filteredGenreOptions;

              // 如果有搜索结果，不显示分类折叠，直接显示结果
              if (genreSearchQuery) {
                return (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {filteredBySearch.map((genre) => renderGenreCard(genre))}
                  </div>
                );
              }

              return categories.map((category) => {
                const categoryItems = filteredBySearch.filter(g => (g.category || '其他') === category);
                const isCollapsed = collapsedCategories.has(category);
                const isHot = category === '热门';

                return (
                  <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* 分类标题 */}
                    <button
                      onClick={() => {
                        const newCollapsed = new Set(collapsedCategories);
                        if (newCollapsed.has(category)) {
                          newCollapsed.delete(category);
                        } else {
                          newCollapsed.add(category);
                        }
                        setCollapsedCategories(newCollapsed);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${
                        isHot ? 'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isHot && <Star className="w-4 h-4 text-orange-500 fill-orange-500" />}
                        <span className={`font-medium text-sm ${isHot ? 'text-orange-700' : 'text-gray-700'}`}>{category}</span>
                        <span className="text-xs text-gray-400">({categoryItems.length})</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                    </button>

                    {/* 分类内容 */}
                    {!isCollapsed && (
                      <div className="p-3">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {categoryItems.map((genre) => renderGenreCard(genre))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Audience Selection - dynamic based on format */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 折叠头部 */}
        <button
          onClick={() => setAudienceCollapsed(!audienceCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-700">目标受众</span>
            {selectedAudience && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                已选：{selectedAudience}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{audienceOptions.length} 个选项</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${audienceCollapsed ? '-rotate-90' : ''}`} />
          </div>
        </button>

        {/* 折叠内容 */}
        {!audienceCollapsed && (
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {audienceOptions.map((audience) => (
                <button
                  key={audience.value}
                  onClick={() => handleAudienceSelect(audience.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer hover:scale-102 hover:shadow-md ${
                    selectedAudience === audience.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 text-sm">{audience.value}</div>
                  <div className="mt-1 text-xs text-gray-500 line-clamp-2">{audience.description}</div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                        style={{ width: `${audience.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{audience.score}分</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选题备注
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="补充选题的其他考虑因素：市场差异化、竞品分析、自身优势..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateTopic}
        disabled={!logline || selectedGenresLocal.length === 0 || !selectedAudience}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        生成选题评估
      </button>

      {/* Topic Preview */}
      {selectedTopic && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            选题评估结果
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedTopic.trendScore}</div>
              <div className="text-xs text-gray-500 mt-0.5">趋势指数</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">优秀</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cyan-600">{selectedTopic.commercialValue.toFixed(0)}</div>
              <div className="text-xs text-gray-500 mt-0.5">商业价值</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <DollarSign className="w-4 h-4 text-cyan-500" />
                <span className="text-xs text-cyan-600">潜力大</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{
                selectedTopic.competitionLevel === 'low' ? '低' :
                selectedTopic.competitionLevel === 'medium' ? '中' : '高'
              }</div>
              <div className="text-xs text-gray-500 mt-0.5">竞争程度</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {selectedTopic.competitionLevel === 'low' ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-cyan-500" />
                )}
                <span className="text-xs">{
                  selectedTopic.competitionLevel === 'low' ? '蓝海' :
                  selectedTopic.competitionLevel === 'medium' ? '稳健' : '红海'
                }</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{
                ((selectedTopic.trendScore + selectedTopic.commercialValue) / 2).toFixed(0)
              }</div>
              <div className="text-xs text-gray-500 mt-0.5">综合评分</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-purple-600">推荐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <h4 className="font-medium text-gray-900 text-sm mb-2">选题亮点</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>题材「{selectedTopic.genre}」{selectedGenreData?.trend === '上升' ? '趋势向好' : '需求稳定'}</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>目标用户「{selectedTopic.targetAudience}」{selectedAudienceData?.description}</span>
              </li>
              <li className="flex items-start gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Logline清晰，市场差异化潜力大</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {ideas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>请先在「创意灵感」中收集一些想法</p>
        </div>
      )}

      {/* 对比弹窗 */}
      {showCompareModal && compareList.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                题材对比分析
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">指标</th>
                    {compareList.map(genre => (
                      <th key={genre} className="text-center py-2 px-3 font-medium text-gray-900">
                        {genre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-500">综合评分</td>
                    {compareList.map(genre => {
                      const data = genreOptions.find(g => g.value === genre);
                      return (
                        <td key={genre} className="text-center py-2 px-3 font-medium text-blue-600">
                          {data?.score || 0}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-500">市场趋势</td>
                    {compareList.map(genre => {
                      const data = genreOptions.find(g => g.value === genre);
                      return (
                        <td key={genre} className="text-center py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            data?.trend === '上升' ? 'bg-green-100 text-green-700' :
                            data?.trend === '下降' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {data?.trend || '-'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-500">竞争程度</td>
                    {compareList.map(genre => {
                      const data = genreOptions.find(g => g.value === genre);
                      return (
                        <td key={genre} className="text-center py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            data?.competition === '一般' ? 'bg-green-100 text-green-700' :
                            data?.competition === '中等' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {data?.competition || '-'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-500">机会指数</td>
                    {compareList.map(genre => {
                      const data = chartData.find(g => g.value === genre);
                      return (
                        <td key={genre} className="text-center py-2 px-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                                style={{ width: `${data?.opportunity || 0}%` }}
                              />
                            </div>
                            <span className="font-bold text-orange-600">{data?.opportunity.toFixed(0) || 0}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500">
                机会指数 = 综合评分 × 趋势权重 × 竞争度权重
              </p>
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                清空对比
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
