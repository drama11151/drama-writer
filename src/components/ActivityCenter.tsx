import { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Calendar, Clock, Users, Gift, ChevronRight, Search, Filter,
  X, ExternalLink, Bell, BellOff, CheckCircle, AlertCircle, Upload,
  FileText, Award, TrendingUp, Building2, Globe, Star, Timer
} from 'lucide-react';

// ==================== 类型定义 ====================
interface Prize {
  rank: string;
  reward: string;
  count: number;
}

interface Competition {
  id: string;
  title: string;
  organizer: string;
  organizerType: 'domestic' | 'international' | 'platform' | 'company' | 'festival';
  coverImage: string;
  format: string[];
  requirements: string;
  theme?: string;
  registrationStart: string;
  registrationEnd: string;
  submissionEnd: string;
  resultDate: string;
  prizes: Prize[];
  totalBonus?: number;
  entryUrl?: string;
  entryType: 'external' | 'internal';
  status: 'upcoming' | 'ongoing' | 'ended';
  participants: number;
  description: string;
  evaluationCriteria?: string[];
}

interface Submission {
  id: string;
  competitionId: string;
  userId: string;
  userName: string;
  projectTitle: string;
  projectDescription: string;
  fileUrl?: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'under_review' | 'awarded';
  award?: string;
}

interface Reminder {
  id: string;
  competitionId: string;
  userId: string;
  reminderType: 'registration' | 'submission' | 'result';
  enabled: boolean;
  notifyAt?: string;
}

// ==================== 示例比赛数据 ====================
const COMPETITIONS: Competition[] = [
  {
    id: 'comp-001',
    title: '2026抖音短剧创作大赛',
    organizer: '抖音',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop',
    format: ['短剧'],
    theme: '温暖治愈',
    requirements: '单集1-5分钟，系列不低于10集，画面清晰，配音完整',
    registrationStart: '2026-03-01',
    registrationEnd: '2026-06-30',
    submissionEnd: '2026-07-15',
    resultDate: '2026-08-15',
    prizes: [
      { rank: '一等奖', reward: '奖金10万 + 流量扶持', count: 1 },
      { rank: '二等奖', reward: '奖金5万 + 平台签约', count: 3 },
      { rank: '三等奖', reward: '奖金1万', count: 10 },
    ],
    totalBonus: 500000,
    entryType: 'external',
    entryUrl: 'https://douyin.com/short-drama-2026',
    status: 'ongoing',
    participants: 2847,
    description: '抖音官方主办的年度短剧盛事，面向全平台创作者征集优秀短剧作品。鼓励温暖治愈、情感共鸣的内容创作。',
    evaluationCriteria: ['剧情创意 30%', '制作质量 25%', '用户互动 25%', '商业价值 20%'],
  },
  {
    id: 'comp-002',
    title: 'FIRST青年电影展创投会',
    organizer: 'FIRST影展组委会',
    organizerType: 'festival',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop',
    format: ['电影'],
    theme: '华语新导演',
    requirements: '未公映的长片项目，需有完整剧本或详细大纲',
    registrationStart: '2026-02-15',
    registrationEnd: '2026-05-01',
    submissionEnd: '2026-05-15',
    resultDate: '2026-07-20',
    prizes: [
      { rank: '最佳项目', reward: '奖金50万 + 发行支持', count: 1 },
      { rank: '特别关注', reward: '奖金20万', count: 3 },
      { rank: '入围项目', reward: '奖金5万', count: 10 },
    ],
    totalBonus: 2000000,
    entryType: 'external',
    entryUrl: 'https://firstfilm.org.cn/callforentry',
    status: 'ongoing',
    participants: 456,
    description: '发掘华语电影新生力量，为青年导演提供制作资金和发行资源支持。',
    evaluationCriteria: ['剧本质量 40%', '导演阐述 30%', '预算合理性 15%', '商业潜力 15%'],
  },
  {
    id: 'comp-003',
    title: '起点中文网现实题材征文',
    organizer: '阅文集团',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    format: ['小说'],
    theme: '平凡奋斗',
    requirements: '长篇小说，20万字以上，现实题材，弘扬正能量',
    registrationStart: '2026-01-01',
    registrationEnd: '2026-12-31',
    submissionEnd: '2026-12-31',
    resultDate: '2027-03-01',
    prizes: [
      { rank: '金奖', reward: '奖金30万 + 出版签约', count: 1 },
      { rank: '银奖', reward: '奖金10万', count: 3 },
      { rank: '铜奖', reward: '奖金3万', count: 10 },
    ],
    totalBonus: 800000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 8934,
    description: '鼓励现实主义题材创作，记录时代变迁，书写平凡人的奋斗故事。',
    evaluationCriteria: ['文学性 35%', '故事性 30%', '人物塑造 20%', '社会价值 15%'],
  },
  {
    id: 'comp-004',
    title: '中华诗词大会·高校专场',
    organizer: '央视',
    organizerType: 'domestic',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop',
    format: ['诗词'],
    requirements: '原创格律诗词，主题不限，需附简要注释',
    registrationStart: '2026-04-01',
    registrationEnd: '2026-05-15',
    submissionEnd: '2026-05-20',
    resultDate: '2026-06-10',
    prizes: [
      { rank: '诗部冠军', reward: '奖金5万 + 央视舞台', count: 1 },
      { rank: '词部冠军', reward: '奖金5万 + 央视舞台', count: 1 },
      { rank: '优秀作品', reward: '奖金1万 + 诗集收录', count: 20 },
    ],
    totalBonus: 450000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 12560,
    description: '面向全国高校学生征集原创格律诗词，传承中华诗词文化。',
    evaluationCriteria: ['格律规范 40%', '意境营造 30%', '情感真挚 20%', '创新意识 10%'],
  },
  {
    id: 'comp-005',
    title: '网易云音乐词曲创作大赛',
    organizer: '网易云音乐',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
    format: ['歌词', '歌曲'],
    theme: '城市故事',
    requirements: '原创词曲，附音频小样优先，风格不限',
    registrationStart: '2026-03-15',
    registrationEnd: '2026-06-30',
    submissionEnd: '2026-07-15',
    resultDate: '2026-08-30',
    prizes: [
      { rank: '最佳作词', reward: '奖金8万 + 制作发行', count: 1 },
      { rank: '最佳作曲', reward: '奖金8万 + 制作发行', count: 1 },
      { rank: '最佳演绎', reward: '奖金5万', count: 3 },
    ],
    totalBonus: 600000,
    entryType: 'external',
    entryUrl: 'https://music.163.com/song-contest-2026',
    status: 'ongoing',
    participants: 4521,
    description: '为原创音乐人打造的词曲创作赛事，鼓励讲述城市故事、抒发真实情感的音乐作品。',
    evaluationCriteria: ['歌词质量 35%', '旋律优美 30%', '编曲制作 20%', '情感表达 15%'],
  },
  {
    id: 'comp-006',
    title: '快手微电影大赛',
    organizer: '快手',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
    format: ['微电影'],
    theme: '家乡故事',
    requirements: '5-15分钟微电影，手机拍摄可，鼓励真实故事',
    registrationStart: '2026-04-10',
    registrationEnd: '2026-07-20',
    submissionEnd: '2026-08-10',
    resultDate: '2026-09-15',
    prizes: [
      { rank: '最佳影片', reward: '奖金15万', count: 1 },
      { rank: '最佳导演', reward: '奖金8万', count: 1 },
      { rank: '最佳故事', reward: '奖金5万', count: 3 },
    ],
    totalBonus: 500000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 3289,
    description: '用镜头记录家乡故事，发现身边的美好。鼓励用手机拍摄的真实创作。',
    evaluationCriteria: ['故事性 35%', '创意性 25%', '制作质量 20%', '情感共鸣 20%'],
  },
  {
    id: 'comp-007',
    title: '中国纪录片学院奖',
    organizer: '中国纪录片研究中心',
    organizerType: 'domestic',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    format: ['纪录片'],
    requirements: '已完成的纪录片作品，时长不限，需有完整成片',
    registrationStart: '2026-03-01',
    registrationEnd: '2026-09-30',
    submissionEnd: '2026-10-15',
    resultDate: '2026-12-01',
    prizes: [
      { rank: '最佳纪录片', reward: '奖金20万 + 发行支持', count: 1 },
      { rank: '最佳短片', reward: '奖金8万', count: 3 },
      { rank: '优秀作品', reward: '奖金2万', count: 10 },
    ],
    totalBonus: 800000,
    entryType: 'external',
    entryUrl: 'https://cdaj.org.cn/award',
    status: 'ongoing',
    participants: 876,
    description: '中国纪录片领域最高荣誉之一，鼓励真实记录、深度思考的纪录片创作。',
    evaluationCriteria: ['真实性 30%', '艺术性 25%', '社会价值 25%', '制作水平 20%'],
  },
  {
    id: 'comp-008',
    title: '知乎故事计划',
    organizer: '知乎',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=300&fit=crop',
    format: ['小说', '散文'],
    theme: '真实经历',
    requirements: '基于真实经历改编的故事，字数5000-50000',
    registrationStart: '2026-01-15',
    registrationEnd: '2026-12-31',
    submissionEnd: '2026-12-31',
    resultDate: '2027-02-01',
    prizes: [
      { rank: '年度故事', reward: '奖金20万 + 影视改编', count: 1 },
      { rank: '月度之星', reward: '奖金1万', count: 12 },
    ],
    totalBonus: 500000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 15632,
    description: '征集基于真实经历改编的故事作品，优秀作品有机会获得影视改编。',
    evaluationCriteria: ['真实感 30%', '文学性 25%', '故事性 25%', '可读性 20%'],
  },
  {
    id: 'comp-009',
    title: '戛纳国际电影节短片竞赛',
    organizer: '戛纳电影节组委会',
    organizerType: 'international',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop',
    format: ['短剧', '微电影'],
    requirements: '时长不超过30分钟，全球首映优先，需英文字幕',
    registrationStart: '2026-01-01',
    registrationEnd: '2026-04-01',
    submissionEnd: '2026-04-15',
    resultDate: '2026-05-25',
    prizes: [
      { rank: '金棕榈短片', reward: '国际声誉 + 发行支持', count: 1 },
      { rank: '评审团短片', reward: '奖金2万欧元', count: 2 },
    ],
    entryType: 'external',
    entryUrl: 'https://festival-cannes.com/shortfilm',
    status: 'ended',
    participants: 2340,
    description: '全球最具影响力的短片竞赛单元，为新锐导演提供国际舞台。',
    evaluationCriteria: ['艺术性 35%', '原创性 30%', '技术完成度 20%', '情感力量 15%'],
  },
  {
    id: 'comp-010',
    title: '金鹰奖短视频竞赛',
    organizer: '中国电视艺术家协会',
    organizerType: 'domestic',
    coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
    format: ['短视频'],
    theme: '记录美好生活',
    requirements: '3分钟以内竖屏短视频，主题积极向上',
    registrationStart: '2026-05-01',
    registrationEnd: '2026-08-31',
    submissionEnd: '2026-09-15',
    resultDate: '2026-10-15',
    prizes: [
      { rank: '最佳短视频', reward: '奖金10万 + 官方认证', count: 3 },
      { rank: '优秀创作者', reward: '奖金2万', count: 20 },
    ],
    totalBonus: 700000,
    entryType: 'internal',
    status: 'upcoming',
    participants: 0,
    description: '金鹰奖官方短视频单元，鼓励用短视频记录和分享美好生活。',
    evaluationCriteria: ['创意性 30%', '制作质量 25%', '传播力 25%', '正能量 20%'],
  },
  {
    id: 'comp-011',
    title: '王者荣耀创意故事大赛',
    organizer: '腾讯游戏',
    organizerType: 'company',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    format: ['小说', '剧本'],
    theme: '王者世界',
    requirements: '基于王者荣耀世界观创作的同人故事，小说5万字以上，剧本需完整分集',
    registrationStart: '2026-04-15',
    registrationEnd: '2026-07-31',
    submissionEnd: '2026-08-31',
    resultDate: '2026-10-01',
    prizes: [
      { rank: '最佳故事', reward: '奖金15万 + 官方合作', count: 1 },
      { rank: '优秀作品', reward: '奖金3万', count: 10 },
    ],
    totalBonus: 600000,
    entryType: 'internal',
    status: 'upcoming',
    participants: 0,
    description: '为王者荣耀玩家打造的同人创作大赛，用你的故事丰富王者世界。',
    evaluationCriteria: ['世界观契合 30%', '故事性 30%', '人物塑造 25%', '创意性 15%'],
  },
  {
    id: 'comp-012',
    title: '哔哩哔哩动画剧本大赛',
    organizer: '哔哩哔哩',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1618856641392-2f1f8c4f5f29?w=400&h=300&fit=crop',
    format: ['剧本'],
    theme: 'Z世代故事',
    requirements: '动画剧本格式，系列剧集设计，每集15-25分钟',
    registrationStart: '2026-05-10',
    registrationEnd: '2026-09-30',
    submissionEnd: '2026-10-30',
    resultDate: '2026-12-15',
    prizes: [
      { rank: '最佳剧本', reward: '奖金20万 + 动画制作', count: 1 },
      { rank: '优秀剧本', reward: '奖金5万', count: 5 },
    ],
    totalBonus: 800000,
    entryType: 'internal',
    status: 'upcoming',
    participants: 0,
    description: '面向B站用户的动画剧本创作大赛，让你的故事变成动画。',
    evaluationCriteria: ['剧本质量 35%', '动画适配 25%', '市场潜力 20%', '创新性 20%'],
  },
  {
    id: 'comp-013',
    title: '咪咕文学网言情征文',
    organizer: '咪咕数媒',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
    format: ['小说'],
    theme: '现代言情',
    requirements: '现代背景言情小说，20万字以上，人物关系清晰',
    registrationStart: '2026-02-01',
    registrationEnd: '2026-12-31',
    submissionEnd: '2026-12-31',
    resultDate: '2027-02-01',
    prizes: [
      { rank: '金榜作品', reward: '奖金15万 + 全版权运营', count: 2 },
      { rank: '银榜作品', reward: '奖金5万', count: 5 },
    ],
    totalBonus: 550000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 6723,
    description: '咪咕文学年度言情征文，优秀作品获得全版权运营支持。',
    evaluationCriteria: ['故事性 35%', '人物魅力 25%', '情感细腻度 20%', '更新稳定性 20%'],
  },
  {
    id: 'comp-014',
    title: '北京国际电影节创投',
    organizer: '北京国际电影节',
    organizerType: 'festival',
    coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=300&fit=crop',
    format: ['电影', '剧本'],
    theme: '华语电影新力量',
    requirements: '未公映的电影项目，需有完整剧本，导演需有至少一部作品',
    registrationStart: '2026-01-01',
    registrationEnd: '2026-04-15',
    submissionEnd: '2026-04-30',
    resultDate: '2026-04-30',
    prizes: [
      { rank: '项目大奖', reward: '奖金100万 + 制作支持', count: 1 },
      { rank: '市场选择', reward: '奖金30万', count: 3 },
    ],
    totalBonus: 2000000,
    entryType: 'external',
    entryUrl: 'https://bjiff.com/project-market',
    status: 'ended',
    participants: 689,
    description: '北京国际电影节官方创投平台，为优质电影项目对接资本和资源。',
    evaluationCriteria: ['剧本质量 35%', '导演能力 25%', '市场潜力 25%', '团队配置 15%'],
  },
  {
    id: 'comp-015',
    title: '喜马拉雅有声书创作大赛',
    organizer: '喜马拉雅',
    organizerType: 'platform',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
    format: ['小说', '剧本'],
    theme: '耳朵里的好故事',
    requirements: '适合有声演绎的故事，悬疑/都市/古言优先，需提供试读章节',
    registrationStart: '2026-03-01',
    registrationEnd: '2026-10-31',
    submissionEnd: '2026-11-15',
    resultDate: '2027-01-10',
    prizes: [
      { rank: '最佳有声改编', reward: '奖金20万 + 录制支持', count: 1 },
      { rank: '优秀作品', reward: '奖金5万', count: 10 },
    ],
    totalBonus: 700000,
    entryType: 'internal',
    status: 'ongoing',
    participants: 4521,
    description: '为好故事寻找最好的声音，让你的文字被更多人听见。',
    evaluationCriteria: ['故事适合度 35%', '文本质量 30%', '改编潜力 20%', '商业价值 15%'],
  },
];

// ==================== 格式名称映射 ====================
const FORMAT_NAMES: Record<string, string> = {
  '短剧': '短剧',
  '电影': '电影',
  '电视剧': '电视剧',
  '纪录片': '纪录片',
  '微电影': '微电影',
  '短视频': '短视频',
  '小说': '小说',
  '诗词': '诗词',
  '歌词': '歌词',
  '歌曲': '歌曲',
  '剧本': '剧本',
  '散文': '散文',
  '动漫': '动漫',
  '小品': '小品',
  '相声': '相声',
  '话剧': '话剧',
  '广播剧': '广播剧',
  '广告': '广告',
  '营销文案': '营销文案',
  '儿歌': '儿歌',
  '童话': '童话',
  '寓言': '寓言',
  '人物传记': '人物传记',
  '回忆录': '回忆录',
  '解说词': '解说词',
};

// ==================== 主办方类型映射 ====================
const ORGANIZER_TYPES: Record<string, { label: string; icon: any; color: string }> = {
  'domestic': { label: '国内赛事', icon: Building2, color: 'text-blue-600' },
  'international': { label: '国际赛事', icon: Globe, color: 'text-purple-600' },
  'platform': { label: '平台赛事', icon: TrendingUp, color: 'text-green-600' },
  'company': { label: '企业赛事', icon: Building2, color: 'text-orange-600' },
  'festival': { label: '影展节展', icon: Award, color: 'text-red-600' },
};

// ==================== 状态配置 ====================
const STATUS_CONFIG = {
  upcoming: { label: '即将开始', color: 'bg-amber-100 text-amber-700', icon: Clock },
  ongoing: { label: '报名中', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ended: { label: '已结束', color: 'bg-gray-100 text-gray-500', icon: AlertCircle },
};

// ==================== 主组件 ====================
interface ActivityCenterProps {
  onClose: () => void;
}

export default function ActivityCenter({ onClose }: ActivityCenterProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOrganizer, setFilterOrganizer] = useState<string>('all');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  
  // 投稿相关状态
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('activity-submissions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionDraft, setSubmissionDraft] = useState({
    projectTitle: '',
    projectDescription: '',
    fileUrl: '',
  });
  
  // 提醒相关状态
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('activity-reminders');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('activity-submissions', JSON.stringify(submissions));
  }, [submissions]);
  
  useEffect(() => {
    localStorage.setItem('activity-reminders', JSON.stringify(reminders));
  }, [reminders]);

  // 过滤比赛列表
  const filteredCompetitions = useMemo(() => {
    return COMPETITIONS.filter(comp => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = comp.title.toLowerCase().includes(query);
        const matchOrganizer = comp.organizer.toLowerCase().includes(query);
        const matchTheme = comp.theme?.toLowerCase().includes(query);
        if (!matchTitle && !matchOrganizer && !matchTheme) return false;
      }
      
      // 创作形式过滤
      if (filterFormat !== 'all' && !comp.format.includes(filterFormat)) {
        return false;
      }
      
      // 状态过滤
      if (filterStatus !== 'all' && comp.status !== filterStatus) {
        return false;
      }
      
      // 主办方类型过滤
      if (filterOrganizer !== 'all' && comp.organizerType !== filterOrganizer) {
        return false;
      }
      
      return true;
    });
  }, [searchQuery, filterFormat, filterStatus, filterOrganizer]);

  // 获取我的参赛
  const myCompetitions = useMemo(() => {
    const compIds = submissions.map(s => s.competitionId);
    return COMPETITIONS.filter(comp => compIds.includes(comp.id));
  }, [submissions]);

  // 切换提醒
  const toggleReminder = (competitionId: string, type: Reminder['reminderType']) => {
    setReminders(prev => {
      const existing = prev.find(r => r.competitionId === competitionId && r.reminderType === type);
      if (existing) {
        return prev.map(r => 
          r.competitionId === competitionId && r.reminderType === type
            ? { ...r, enabled: !r.enabled }
            : r
        );
      } else {
        return [...prev, {
          id: `reminder-${Date.now()}`,
          competitionId,
          userId: 'current-user',
          reminderType: type,
          enabled: true,
        }];
      }
    });
  };

  // 提交作品
  const handleSubmit = () => {
    if (!selectedCompetition || !submissionDraft.projectTitle) return;
    
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      competitionId: selectedCompetition.id,
      userId: 'current-user',
      userName: '当前用户',
      projectTitle: submissionDraft.projectTitle,
      projectDescription: submissionDraft.projectDescription,
      fileUrl: submissionDraft.fileUrl || undefined,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
    setShowSubmissionForm(false);
    setSubmissionDraft({ projectTitle: '', projectDescription: '', fileUrl: '' });
  };

  // 获取提醒状态
  const getReminderStatus = (competitionId: string, type: Reminder['reminderType']) => {
    const reminder = reminders.find(r => r.competitionId === competitionId && r.reminderType === type);
    return reminder?.enabled ?? false;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 获取剩余时间
  const getRemainingDays = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '已截止';
    if (diff === 0) return '今日截止';
    if (diff === 1) return '明天截止';
    return `${diff}天后截止`;
  };

  // 获取报名状态
  const getRegistrationStatus = (comp: Competition) => {
    const now = new Date();
    const regStart = new Date(comp.registrationStart);
    const regEnd = new Date(comp.registrationEnd);
    const subEnd = new Date(comp.submissionEnd);
    
    if (now < regStart) return { text: `报名未开始（${formatDate(comp.registrationStart)}）`, type: 'upcoming' };
    if (now >= regStart && now <= regEnd) return { text: `报名进行中，截止${formatDate(comp.registrationEnd)}`, type: 'ongoing' };
    if (now > regEnd && now <= subEnd) return { text: `投稿进行中，截止${formatDate(comp.submissionEnd)}`, type: 'ongoing' };
    return { text: '已结束', type: 'ended' };
  };

  // 获取我的参赛状态
  const getMySubmission = (compId: string) => {
    return submissions.find(s => s.competitionId === compId);
  };

  // 可用的创作形式列表
  const availableFormats = useMemo(() => {
    const formats = new Set<string>();
    COMPETITIONS.forEach(comp => {
      comp.format.forEach(f => formats.add(f));
    });
    return Array.from(formats);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">活动中心</h1>
              <p className="text-sm text-gray-500">发现比赛机会，实现创作价值</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        {/* Tab切换 */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            比赛大厅
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'my'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            我的参赛 {submissions.length > 0 && `(${submissions.length})`}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'browse' ? (
          <>
            {/* 筛选栏 */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                {/* 搜索 */}
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索比赛名称、主办方、主题..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* 创作形式筛选 */}
                <select
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部形式</option>
                  {availableFormats.map(format => (
                    <option key={format} value={format}>{FORMAT_NAMES[format] || format}</option>
                  ))}
                </select>
                
                {/* 状态筛选 */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部状态</option>
                  <option value="upcoming">即将开始</option>
                  <option value="ongoing">进行中</option>
                  <option value="ended">已结束</option>
                </select>
                
                {/* 主办方类型筛选 */}
                <select
                  value={filterOrganizer}
                  onChange={(e) => setFilterOrganizer(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部主办方</option>
                  <option value="domestic">国内赛事</option>
                  <option value="international">国际赛事</option>
                  <option value="platform">平台赛事</option>
                  <option value="company">企业赛事</option>
                  <option value="festival">影展节展</option>
                </select>
              </div>
            </div>

            {/* 比赛列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitions.map(comp => {
                const statusConfig = STATUS_CONFIG[comp.status];
                const StatusIcon = statusConfig.icon;
                const regStatus = getRegistrationStatus(comp);
                
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompetition(comp)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  >
                    {/* 封面图 */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={comp.coverImage}
                        alt={comp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                      {comp.theme && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                            #{comp.theme}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 内容 */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{comp.title}</h3>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className={ORGANIZER_TYPES[comp.organizerType]?.color}>
                          {(() => {
                            const Icon = ORGANIZER_TYPES[comp.organizerType]?.icon;
                            return Icon ? <Icon className="w-4 h-4 inline" /> : null;
                          })()}
                        </span>
                        <span>{comp.organizer}</span>
                        <span className="mx-2">·</span>
                        <Users className="w-4 h-4" />
                        <span>{comp.participants.toLocaleString()}人</span>
                      </div>
                      
                      {/* 支持的创作形式 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {comp.format.map(f => (
                          <span key={f} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                            {FORMAT_NAMES[f] || f}
                          </span>
                        ))}
                      </div>
                      
                      {/* 截止时间 */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Timer className="w-4 h-4" />
                          <span>{regStatus.text}</span>
                        </div>
                        {comp.totalBonus && (
                          <div className="flex items-center gap-1 text-amber-600 font-medium">
                            <Gift className="w-4 h-4" />
                            <span>¥{(comp.totalBonus / 10000).toFixed(0)}万</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCompetitions.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">暂无符合条件的比赛</h3>
                <p className="text-sm text-gray-400 mt-1">试试调整筛选条件</p>
              </div>
            )}
          </>
        ) : (
          /* 我的参赛 */
          <div>
            {submissions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">还没有参赛记录</h3>
                <p className="text-sm text-gray-400 mt-1">去比赛大厅发现适合你的比赛吧</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  浏览比赛
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map(sub => {
                  const comp = COMPETITIONS.find(c => c.id === sub.competitionId);
                  if (!comp) return null;
                  
                  return (
                    <div key={sub.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-4">
                        <img
                          src={comp.coverImage}
                          alt={comp.title}
                          className="w-24 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{comp.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">投稿作品：{sub.projectTitle}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              sub.status === 'submitted' ? 'bg-green-100 text-green-700' :
                              sub.status === 'under_review' ? 'bg-amber-100 text-amber-700' :
                              sub.status === 'awarded' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {sub.status === 'submitted' ? '已提交' :
                               sub.status === 'under_review' ? '审核中' :
                               sub.status === 'awarded' ? `获奖：${sub.award}` :
                               '草稿'}
                            </span>
                            <span className="text-xs text-gray-400">
                              提交时间：{new Date(sub.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCompetition(comp)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 比赛详情弹窗 */}
      {selectedCompetition && !showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedCompetition.coverImage}
                alt={selectedCompetition.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button
                onClick={() => setSelectedCompetition(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedCompetition.status].color}`}>
                    {STATUS_CONFIG[selectedCompetition.status].label}
                  </span>
                  {selectedCompetition.theme && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      #{selectedCompetition.theme}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedCompetition.title}</h2>
                <p className="text-white/80 mt-1">{selectedCompetition.organizer}</p>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-auto p-6">
              {/* 关键数据 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{selectedCompetition.participants.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">已报名人数</p>
                </div>
                {selectedCompetition.totalBonus && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <Gift className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-600">¥{(selectedCompetition.totalBonus / 10000).toFixed(0)}万</p>
                    <p className="text-xs text-gray-500">总奖金池</p>
                  </div>
                )}
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-green-600">{formatDate(selectedCompetition.submissionEnd)}</p>
                  <p className="text-xs text-gray-500">投稿截止</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-purple-600">{selectedCompetition.prizes.length}个</p>
                  <p className="text-xs text-gray-500">奖项数量</p>
                </div>
              </div>

              {/* 提醒按钮 */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => toggleReminder(selectedCompetition.id, 'registration')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    getReminderStatus(selectedCompetition.id, 'registration')
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getReminderStatus(selectedCompetition.id, 'registration') ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                  <span>报名提醒</span>
                </button>
                <button
                  onClick={() => toggleReminder(selectedCompetition.id, 'submission')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    getReminderStatus(selectedCompetition.id, 'submission')
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getReminderStatus(selectedCompetition.id, 'submission') ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                  <span>截止提醒</span>
                </button>
                <button
                  onClick={() => toggleReminder(selectedCompetition.id, 'result')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    getReminderStatus(selectedCompetition.id, 'result')
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getReminderStatus(selectedCompetition.id, 'result') ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                  <span>结果提醒</span>
                </button>
              </div>

              {/* 详细信息 */}
              <div className="grid grid-cols-3 gap-6">
                {/* 左侧：详情 */}
                <div className="col-span-2 space-y-6">
                  {/* 比赛介绍 */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">比赛介绍</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedCompetition.description}</p>
                  </div>

                  {/* 参赛要求 */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">参赛要求</h3>
                    <p className="text-gray-600">{selectedCompetition.requirements}</p>
                  </div>

                  {/* 赛程时间线 */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">赛程安排</h3>
                    <div className="relative">
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-blue-500 z-10" />
                          <div>
                            <p className="font-medium text-gray-900">报名开始</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedCompetition.registrationStart)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-amber-500 z-10" />
                          <div>
                            <p className="font-medium text-gray-900">报名截止 / 投稿开始</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedCompetition.registrationEnd)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-red-500 z-10" />
                          <div>
                            <p className="font-medium text-gray-900">投稿截止</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedCompetition.submissionEnd)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 relative">
                          <div className="w-4 h-4 rounded-full bg-purple-500 z-10" />
                          <div>
                            <p className="font-medium text-gray-900">结果公布</p>
                            <p className="text-sm text-gray-500">{formatDate(selectedCompetition.resultDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 评审标准 */}
                  {selectedCompetition.evaluationCriteria && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">评审标准</h3>
                      <div className="space-y-2">
                        {selectedCompetition.evaluationCriteria.map((criteria, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-medium">
                              {i + 1}
                            </div>
                            <span className="text-gray-600">{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 右侧：奖项 */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">奖项设置</h3>
                  {selectedCompetition.prizes.map((prize, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-4 ${
                        i === 0 ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300' :
                        i === 1 ? 'bg-gradient-to-br from-gray-100 to-slate-100 border border-gray-300' :
                        i === 2 ? 'bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200' :
                        'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {i === 0 && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                        <span className="font-bold text-gray-900">{prize.rank}</span>
                        <span className="text-xs text-gray-500">x{prize.count}</span>
                      </div>
                      <p className="text-sm text-gray-600">{prize.reward}</p>
                    </div>
                  ))}

                  {/* 支持的创作形式 */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-2">支持的创作形式</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompetition.format.map(f => (
                        <span key={f} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {FORMAT_NAMES[f] || f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {getRegistrationStatus(selectedCompetition).text}
              </div>
              <div className="flex gap-3">
                {getMySubmission(selectedCompetition.id) ? (
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    已投稿
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    立即投稿
                  </button>
                )}
                {selectedCompetition.entryType === 'external' && selectedCompetition.entryUrl && (
                  <a
                    href={selectedCompetition.entryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    官方报名
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 投稿表单弹窗 */}
      {selectedCompetition && showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">提交作品</h3>
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作品标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={submissionDraft.projectTitle}
                  onChange={(e) => setSubmissionDraft(prev => ({ ...prev, projectTitle: e.target.value }))}
                  placeholder="请输入作品标题"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作品简介
                </label>
                <textarea
                  value={submissionDraft.projectDescription}
                  onChange={(e) => setSubmissionDraft(prev => ({ ...prev, projectDescription: e.target.value }))}
                  placeholder="请简要介绍你的作品"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作品文件链接
                </label>
                <input
                  type="text"
                  value={submissionDraft.fileUrl}
                  onChange={(e) => setSubmissionDraft(prev => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="上传到网盘/云存储后粘贴链接"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  支持百度网盘、腾讯微云等，请确保链接有效期不少于30天
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">投稿须知</p>
                    <ul className="mt-2 space-y-1 text-blue-600">
                      <li>• 请确保作品为原创，未侵犯他人权益</li>
                      <li>• 投稿后将进入审核阶段，请保持联系方式畅通</li>
                      <li>• 审核结果可在「我的参赛」中查看</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!submissionDraft.projectTitle}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 侧边栏入口组件 ====================
export function ActivityCenterSidebar({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
      aria-label="打开活动中心 - 比赛与机会"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">活动中心</h3>
            <p className="text-xs text-white/80">比赛与机会</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}
