import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Heart, 
  Star, 
  Zap, 
  Coffee, 
  Feather, 
  BookOpen, 
  Award,
  Gift,
  MessageCircle,
  Bell,
  ChevronRight,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

// ==================== 趣味文案系统 ====================
const WHIMSY_MESSAGES = {
  // 加载状态
  loading: [
    "烹茶待水沸，开卷待君来...",
    "炉火正旺，墨香渐浓...",
    "春蚕食叶声，笔下生波澜...",
    "纸窗云影间，字句渐次明...",
  ],
  
  // 保存成功
  saved: [
    "墨迹已干，玉成此篇。",
    "落笔如有神，文成自天成。",
    "妙笔生花，篇成锦绣。",
    "一字一句，皆是心血。",
  ],
  
  // 灵感添加
  inspirationAdded: [
    "灵感已收入囊中，静待日后化用。",
    "佳句偶得，文思泉涌。",
    "一点灵光，化作千言。",
    "此念一起，万象更新。",
  ],
  
  // 步骤完成
  stepComplete: [
    "此卷已就，静待下一章。",
    "功到自然成，厚积而薄发。",
    "今日之功，明日之基。",
    "行百里者半九十，继续前行。",
  ],
  
  // 错误提示
  error: [
    "墨洇纸背，行文有阻。再试一遭？",
    "文章本天成，妙手偶失手。勿急。",
    "山重水复疑无路，柳暗花明又一村。",
    "磨刀不误砍柴工，理清思路再出发。",
  ],
  
  // 空状态
  empty: {
    title: "灵感如露，静待采撷",
    subtitle: "落笔之前，先养几分气？",
    hint: "世间万物，皆可入文。",
  },
  
  // 欢迎语
  welcome: "与君初相识，犹似故人归。",
};

// ==================== 成就徽章数据 ====================
const ACHIEVEMENTS = [
  { id: 'first-step', icon: '🌱', title: '初试啼声', desc: '完成第一个创作项目', rarity: 'common' },
  { id: 'persistence', icon: '📚', title: '笔耕不辍', desc: '连续7天有创作记录', rarity: 'rare' },
  { id: 'wordsmith', icon: '✒️', title: '妙笔生花', desc: '累计创作突破10万字', rarity: 'epic' },
  { id: 'eureka', icon: '💡', title: '妙手偶得', desc: '灵感模板创作出佳作', rarity: 'common' },
  { id: 'master', icon: '🏔️', title: '登堂入室', desc: '完整体验全部步骤', rarity: 'rare' },
  { id: 'confident', icon: '🎋', title: '胸有成竹', desc: '大纲一次性通过', rarity: 'epic' },
  { id: 'gold-touch', icon: '💎', title: '点石成金', desc: '润色评分提升30%', rarity: 'legendary' },
  { id: 'night-owl', icon: '🌙', title: '秉烛夜游', desc: '凌晨创作', rarity: 'rare' },
  { id: 'lotus', icon: '🪷', title: '出淤泥染', desc: '逆境创作出佳作', rarity: 'epic' },
  { id: 'swift', icon: '⚡', title: '删繁就简', desc: '30分钟内完成创作', rarity: 'rare' },
];

// 稀有度颜色
const RARITY_COLORS = {
  common: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', glow: 'shadow-gray-200' },
  rare: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', glow: 'shadow-blue-200' },
  epic: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', glow: 'shadow-purple-200' },
  legendary: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-400', glow: 'shadow-amber-300' },
};

// ==================== 成就解锁弹窗 ====================
interface AchievementPopupProps {
  achievement: typeof ACHIEVEMENTS[0];
  onClose: () => void;
}

function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const colors = RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS];
  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* 成就卡片 */}
      <div className={`
        relative ${colors.bg} border-2 ${colors.border} rounded-3xl p-8 
        shadow-2xl ${colors.glow} animate-achievement-unlock
        pointer-events-auto
      `}>
        {/* 印章动画 */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-seal-stamp">
          <span className="text-2xl">🏆</span>
        </div>
        
        {/* 恭喜标题 */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">🎉 新成就解锁</p>
          <h3 className="text-2xl font-bold text-gray-900">{achievement.title}</h3>
        </div>
        
        {/* 徽章图标 */}
        <div className="flex justify-center mb-4">
          <div className={`
            w-24 h-24 rounded-2xl ${colors.bg} border-2 ${colors.border}
            flex items-center justify-center text-5xl
            shadow-lg transform hover:scale-110 transition-transform cursor-pointer
          `}>
            {achievement.icon}
          </div>
        </div>
        
        {/* 描述 */}
        <p className={`text-center ${colors.text} font-medium`}>{achievement.desc}</p>
        
        {/* 稀有度标签 */}
        <div className="mt-4 flex justify-center">
          <span className={`
            px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${colors.bg} ${colors.text} border ${colors.border}
          `}>
            {achievement.rarity}
          </span>
        </div>
        
        {/* 关闭提示 */}
        <p className="text-center text-xs text-gray-400 mt-4">点击任意处关闭</p>
      </div>
    </div>
  );
}

// ==================== 浮动反馈 ====================
interface FloatingFeedbackProps {
  messages: string[];
  onComplete: () => void;
}

function FloatingFeedback({ messages, onComplete }: FloatingFeedbackProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (index < messages.length - 1) {
        setVisible(false);
        setTimeout(() => {
          setIndex(index + 1);
          setVisible(true);
        }, 300);
      } else {
        onComplete();
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [index, messages.length, onComplete]);
  
  return (
    <div className={`
      fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50
      px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl
      border border-blue-200 transition-all duration-300
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <p className="text-blue-700 font-medium text-center whitespace-nowrap">
        {messages[index]}
      </p>
    </div>
  );
}

// ==================== 彩蛋触发器 ====================
interface EasterEggProps {
  type: 'confetti' | 'fireworks' | 'ink' | 'petals';
}

function EasterEgg({ type }: EasterEggProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  
  useEffect(() => {
    const emojis = {
      confetti: ['🎊', '🎉', '✨', '💫', '⭐'],
      fireworks: ['🌟', '💥', '✨', '🎆', '🌠'],
      ink: ['🪷', '🌸', '🍃', '💧', '✨'],
      petals: ['🌸', '🪷', '💮', '🏵️', '✿'],
    };
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50,
      emoji: emojis[type][Math.floor(Math.random() * emojis[type].length)],
    }));
    
    setParticles(newParticles);
    
    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [type]);
  
  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50 text-3xl animate-float-up"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.id * 0.1}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </>
  );
}

// ==================== 主组件 ====================
export default function DelightDemo() {
  const [activeTab, setActiveTab] = useState<'interactions' | 'messages' | 'achievements' | 'easter-eggs' | 'empty-states'>('interactions');
  const [showAchievement, setShowAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [showFloating, setShowFloating] = useState(false);
  const [floatingMessages, setFloatingMessages] = useState<string[]>([]);
  const [easterEgg, setEasterEgg] = useState<'confetti' | 'fireworks' | 'ink' | 'petals' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [buttonClicks, setButtonClicks] = useState<Record<string, number>>({});
  const logoRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);
  
  // Logo 彩蛋
  const handleLogoClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      setEasterEgg('ink');
      setClickCount(0);
      setTimeout(() => setEasterEgg(null), 4000);
    }
  }, [clickCount]);
  
  // 随机文案
  const getRandomMessage = (category: keyof typeof WHIMSY_MESSAGES) => {
    const msgs = WHIMSY_MESSAGES[category];
    if (Array.isArray(msgs)) {
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
    return '';
  };
  
  // 加载演示
  const handleLoadingDemo = () => {
    setIsLoading(true);
    let index = 0;
    const loadingMessages = WHIMSY_MESSAGES.loading;
    
    const interval = setInterval(() => {
      setLoadingText(loadingMessages[index % loadingMessages.length]);
      index++;
      if (index >= 6) {
        clearInterval(interval);
        setIsLoading(false);
        setFloatingMessages(WHIMSY_MESSAGES.saved);
        setShowFloating(true);
      }
    }, 800);
  };
  
  // 保存演示
  const handleSaveDemo = () => {
    setSaved(true);
    setFloatingMessages(WHIMSY_MESSAGES.saved);
    setShowFloating(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  // 添加灵感演示
  const handleAddInspiration = () => {
    const key = `inspiration-${Date.now()}`;
    setButtonClicks(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    setFloatingMessages(WHIMSY_MESSAGES.inspirationAdded);
    setShowFloating(true);
  };
  
  // 解锁成就演示
  const handleUnlockAchievement = () => {
    const randomAchievement = ACHIEVEMENTS[Math.floor(Math.random() * ACHIEVEMENTS.length)];
    setShowAchievement(randomAchievement);
  };
  
  // 触发彩蛋
  const handleTriggerEasterEgg = (type: 'confetti' | 'fireworks' | 'ink' | 'petals') => {
    setEasterEgg(type);
    setTimeout(() => setEasterEgg(null), 4000);
  };
  
  // Tab 配置
  const tabs = [
    { id: 'interactions' as const, label: '微交互', icon: Zap },
    { id: 'messages' as const, label: '趣味文案', icon: MessageCircle },
    { id: 'achievements' as const, label: '成就系统', icon: Award },
    { id: 'easter-eggs' as const, label: '隐藏彩蛋', icon: Gift },
    { id: 'empty-states' as const, label: '空状态美学', icon: Coffee },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* 彩蛋效果层 */}
      {easterEgg && <EasterEgg type={easterEgg} />}
      
      {/* 成就弹窗 */}
      {showAchievement && (
        <AchievementPopup 
          achievement={showAchievement} 
          onClose={() => setShowAchievement(null)} 
        />
      )}
      
      {/* 浮动反馈 */}
      {showFloating && (
        <FloatingFeedback 
          messages={floatingMessages}
          onComplete={() => setShowFloating(false)}
        />
      )}
      
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo 彩蛋区域 */}
              <div 
                ref={logoRef}
                onClick={handleLogoClick}
                className="relative cursor-pointer group"
                title="点击5次试试？"
              >
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 
                  flex items-center justify-center shadow-lg
                  group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                  ${clickCount > 0 ? 'animate-pulse' : ''}
                `}>
                  <Feather className="w-6 h-6 text-white" />
                </div>
                {/* 涟漪效果 */}
                {clickCount > 0 && (
                  <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ripple" />
                )}
                {clickCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {clickCount}
                  </span>
                )}
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">✨ 愉悦体验 Demo</h1>
                <p className="text-xs text-gray-500">观复文创 · 趣味交互设计展示</p>
              </div>
            </div>
            
            {/* 声音开关 */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`
                p-2 rounded-lg transition-all
                ${soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}
              `}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Tab 导航 */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* ==================== 微交互 ==================== */}
        {activeTab === 'interactions' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">微交互设计</h2>
              <p className="text-gray-600">让每个操作都有"回应感"，赋予界面生命力</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 按钮悬停 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  按钮悬停效果
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="btn-whimsy px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg"
                  >
                    悬停看我 ✨
                  </button>
                  <button className="btn-bounce px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg">
                    弹跳效果
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  悬停时：轻微上浮 + 光泽滑动 + 柔和阴影
                </p>
              </div>
              
              {/* 灵感添加 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  灵感添加反馈
                </h3>
                <button 
                  onClick={handleAddInspiration}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium shadow-lg btn-sparkle"
                >
                  ✨ 添加灵感
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  点击后：火花飞溅 + 文案提示 + 计数器动画
                </p>
              </div>
              
              {/* 加载动画 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  加载状态
                </h3>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="loading-whimsy flex justify-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" />
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.16s' }} />
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.32s' }} />
                    </div>
                    <p className="text-center text-blue-600 font-medium text-sm animate-pulse">
                      {loadingText}
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={handleLoadingDemo}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg"
                  >
                    模拟加载
                  </button>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  文言文案 + 节奏动画，减少等待焦虑
                </p>
              </div>
              
              {/* 保存成功 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  保存成功
                </h3>
                <button 
                  onClick={handleSaveDemo}
                  className={`
                    w-full px-6 py-4 rounded-xl font-medium shadow-lg transition-all
                    ${saved 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white scale-95' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }
                  `}
                >
                  {saved ? '✓ 墨迹已干' : '保存创作'}
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  即时反馈 + 诗意文案，让保存也有仪式感
                </p>
              </div>
              
              {/* 进度条 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  进度完成
                </h3>
                <div className="space-y-4">
                  <div className="progress-writing h-3 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-400 animate-progress-fill" />
                  </div>
                  <button className="progress-complete-btn w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg">
                    完成本步
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  书写动画 + 庆祝特效，每步都有成就感
                </p>
              </div>
              
              {/* 步骤导航 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  步骤切换
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
                    <div className="flex-1 h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-green-400 to-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-500">已完成</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold animate-pulse-slow">2</div>
                    <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 animate-shimmer" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">进行中</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                    <span className="text-sm text-gray-400">待开始</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  进度可视化 + 当前步骤高亮，清晰不迷茫
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* ==================== 趣味文案 ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">趣味文案系统</h2>
              <p className="text-gray-600">让冷冰冰的提示变成有温度的对话</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 加载状态 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Coffee className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-gray-900">加载状态</h3>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-amber-800 font-medium text-center italic">
                    "烹茶待水沸，开卷待君来..."
                  </p>
                </div>
                <div className="space-y-2">
                  {WHIMSY_MESSAGES.loading.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-amber-400 rounded-full" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 保存成功 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-gray-900">保存成功</h3>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-green-800 font-medium text-center italic">
                    "墨迹已干，玉成此篇。"
                  </p>
                </div>
                <div className="space-y-2">
                  {WHIMSY_MESSAGES.saved.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 灵感添加 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">灵感添加</h3>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-yellow-800 font-medium text-center italic">
                    "灵感已收入囊中，静待日后化用。"
                  </p>
                </div>
                <div className="space-y-2">
                  {WHIMSY_MESSAGES.inspirationAdded.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 步骤完成 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-gray-900">步骤完成</h3>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                  <p className="text-purple-800 font-medium text-center italic">
                    "此卷已就，静待下一章。"
                  </p>
                </div>
                <div className="space-y-2">
                  {WHIMSY_MESSAGES.stepComplete.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-purple-400 rounded-full" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 错误提示 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-gray-900">错误提示</h3>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-red-800 font-medium text-center italic">
                    "墨洇纸背，行文有阻。再试一遭？"
                  </p>
                </div>
                <div className="space-y-2">
                  {WHIMSY_MESSAGES.error.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-red-400 rounded-full" />
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 欢迎语 */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-gray-900">欢迎语</h3>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-4">
                  <p className="text-pink-800 font-medium text-center italic">
                    "与君初相识，犹似故人归。"
                  </p>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  首次登录时的惊喜问候，文人雅韵，沁人心脾
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* ==================== 成就系统 ==================== */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">创作成就系统</h2>
              <p className="text-gray-600">以"文人雅事"包装成就，激励持续创作</p>
            </div>
            
            {/* 解锁演示按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleUnlockAchievement}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold shadow-lg btn-sparkle text-lg"
              >
                🎲 随机解锁一个成就
              </button>
            </div>
            
            {/* 成就网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ACHIEVEMENTS.map(achievement => {
                const colors = RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS];
                return (
                  <div 
                    key={achievement.id}
                    className={`
                      bg-white rounded-2xl border-2 ${colors.border} p-4 
                      hover:scale-105 hover:shadow-xl transition-all cursor-pointer
                      group
                    `}
                  >
                    {/* 徽章图标 */}
                    <div className={`
                      w-16 h-16 mx-auto rounded-xl ${colors.bg}
                      flex items-center justify-center text-3xl mb-3
                      group-hover:scale-110 transition-transform
                      shadow-md
                    `}>
                      {achievement.icon}
                    </div>
                    
                    {/* 标题 */}
                    <h4 className="text-center font-bold text-gray-900 mb-1">
                      {achievement.title}
                    </h4>
                    
                    {/* 描述 */}
                    <p className="text-xs text-gray-500 text-center mb-2">
                      {achievement.desc}
                    </p>
                    
                    {/* 稀有度 */}
                    <div className="flex justify-center">
                      <span className={` 
                        px-2 py-0 rounded text-xs font-bold uppercase
                        ${colors.bg} ${colors.text}
                      `}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 稀有度图例 */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">稀有度说明</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(RARITY_COLORS).map(([rarity, colors]) => (
                  <div key={rarity} className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg ${colors.bg} border ${colors.border}
                      flex items-center justify-center text-lg
                    `}>
                      🏅
                    </div>
                    <div>
                      <p className={`font-bold ${colors.text} capitalize`}>{rarity}</p>
                      <p className="text-xs text-gray-500">
                        {rarity === 'common' && '常见成就'}
                        {rarity === 'rare' && '稀有成就'}
                        {rarity === 'epic' && '史诗成就'}
                        {rarity === 'legendary' && '传说成就'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* ==================== 彩蛋 ==================== */}
        {activeTab === 'easter-eggs' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">隐藏彩蛋</h2>
              <p className="text-gray-600">奖励好奇心重的用户，惊喜无处不在</p>
            </div>
            
            {/* 彩蛋触发器 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <button
                onClick={() => handleTriggerEasterEgg('confetti')}
                className="bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🎊</div>
                <h3 className="font-bold text-lg">彩带庆祝</h3>
                <p className="text-sm opacity-80">任务完成时</p>
              </button>
              
              <button
                onClick={() => handleTriggerEasterEgg('fireworks')}
                className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🎆</div>
                <h3 className="font-bold text-lg">烟花绽放</h3>
                <p className="text-sm opacity-80">重大成就解锁</p>
              </button>
              
              <button
                onClick={() => handleTriggerEasterEgg('ink')}
                className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🪷</div>
                <h3 className="font-bold text-lg">墨染荷花</h3>
                <p className="text-sm opacity-80">连续点击Logo</p>
              </button>
              
              <button
                onClick={() => handleTriggerEasterEgg('petals')}
                className="bg-gradient-to-br from-pink-300 to-purple-400 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="font-bold text-lg">落樱缤纷</h3>
                <p className="text-sm opacity-80">春季限定</p>
              </button>
            </div>
            
            {/* 已知彩蛋列表 */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                已发现的彩蛋
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-bold text-gray-900">连续点击Logo 5次</h4>
                  </div>
                  <p className="text-sm text-gray-600">触发墨染荷花效果，解锁隐藏成就</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📝</span>
                    <h4 className="font-bold text-gray-900">输入特定关键词</h4>
                  </div>
                  <p className="text-sm text-gray-600">在灵感输入框输入"蓦然回首"触发惊喜</p>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🌙</span>
                    <h4 className="font-bold text-gray-900">夜间创作模式</h4>
                  </div>
                  <p className="text-sm text-gray-600">晚上8-10点创作自动开启月光氛围</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎨</span>
                    <h4 className="font-bold text-gray-900">连续创作7天</h4>
                  </div>
                  <p className="text-sm text-gray-600">解锁专属"笔耕不辍"皮肤</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ==================== 空状态美学 ==================== */}
        {activeTab === 'empty-states' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">空状态美学</h2>
              <p className="text-gray-600">让"什么都没有"变得"充满期待"</p>
            </div>
            
            {/* 灵感收集空状态 */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl shadow-xl border border-blue-100 p-12 text-center">
              <div className="mb-8">
                <div className="text-7xl mb-4 animate-float">🪷</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  灵感如露，静待采撷
                </h3>
                <p className="text-gray-500 text-lg italic">
                  "落笔之前，先养几分气？"
                </p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg btn-whimsy">
                  ✨ 点击这里，写下你的第一个灵感
                </button>
                
                <p className="text-sm text-gray-400">
                  或者，从灵感模板中获取灵感
                </p>
                
                <div className="flex justify-center gap-3">
                  {['💡 剧情反转', '💕 甜宠日常', '🔥 逆袭人生', '🌙 悬疑烧脑'].map((template, i) => (
                    <button 
                      key={i}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 项目管理空状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100 p-8 text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  还没有创作项目
                </h3>
                <p className="text-gray-500 mb-6">
                  开启你的第一个故事，万丈高楼平地起
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg">
                  🚀 创建新项目
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100 p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  成就徽章待解锁
                </h3>
                <p className="text-gray-500 mb-6">
                  完成创作任务，解锁专属成就
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg">
                  📜 查看成就
                </button>
              </div>
            </div>
            
            {/* 文案对比 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-6 bg-gray-50">
                  <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    原始文案
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>❌ "暂无数据"</p>
                    <p>❌ "加载失败"</p>
                    <p>❌ "操作失败"</p>
                    <p>❌ "请先登录"</p>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                  <h4 className="font-bold text-green-600 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    趣味升级
                  </h4>
                  <div className="space-y-3 text-sm text-green-700">
                    <p>✨ "墨池未干，静候点染"</p>
                    <p>✨ "春风不度玉门，暂候消息"</p>
                    <p>✨ "墨洇纸背，再试一遭？"</p>
                    <p>✨ "与君初相识，请先入座"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* 页脚 */}
      <footer className="border-t border-blue-100 bg-white/60 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-500">
            观复文创 · 创作者的一站式服务平台 · 愉悦体验设计 Demo
          </p>
          <p className="text-xs text-gray-400 mt-1 italic">
            "落笔惊风雨，诗成泣鬼神。"
          </p>
        </div>
      </footer>
    </div>
  );
}
