import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
 Lightbulb, 
 Target, 
 GitBranch, 
 Users, 
 FileText, 
 BarChart3,
 ChevronRight,
 ChevronLeft,
 CheckCircle2,
 LayoutGrid,
 Sparkles,
 PenTool,
 Music,
 RefreshCw
} from 'lucide-react';
import IdeaCollector from './components/IdeaCollector';
import FormatSelector from './components/FormatSelector';
import OutlineBuilder from './components/OutlineBuilder';
import CharacterManager from './components/CharacterManager';
import ScriptWriter from './components/ScriptWriter';
import MarketAnalyzer from './components/MarketAnalyzer';
import ScorePanel from './components/ScorePanel';
import UserCenter, { UserCenterSidebar } from './components/UserCenter';
import TopicEvaluator from './components/TopicEvaluator';
import WorldBuilding from './components/WorldBuilding';
import PlotDesigner from './components/PlotDesigner';
import FreeWriteMode from './components/FreeWriteMode';
import { Feather } from 'lucide-react';
import PoetryWriter from './components/PoetryWriter';
import ProseWriter from './components/ProseWriter';
import LyricsWriter from './components/LyricsWriter';
import CrosstalkWriter from './components/CrosstalkWriter';
import SketchWriter from './components/SketchWriter';
import StagePlayWriter from './components/StagePlayWriter';
import FableWriter from './components/FableWriter';
import FairyTaleWriter from './components/FairyTaleWriter';
import SpeechWriter from './components/SpeechWriter';
import BrandStoryWriter from './components/BrandStoryWriter';
import WechatArticleWriter from './components/WechatArticleWriter';
import AdvertisingWriter from './components/AdvertisingWriter';
import PolishEditor from './components/PolishEditor';
import { ProjectManagerSidebar, ProjectManagerPage } from './components/ProjectManager';
import { MarketplaceSidebar, MarketplacePage } from './components/Marketplace';
import LearningCenter, { LearningCenterSidebar } from './components/LearningCenter';
import ActivityCenter, { ActivityCenterSidebar } from './components/ActivityCenter';
import DelightDemo from './components/DelightDemo';
import type { Project, WorkflowStep, Idea, Topic, StoryOutline, Character, Episode, ScoreResult, FORMAT_CONFIGS } from './types';

// 创作形式到工作流步骤的映射
const FORMAT_WORKFLOWS: Record<string, { key: WorkflowStep; label: string; icon: any }[]> = {
  // ==================== 视频类 ====================
  // P1 优化：统一 ≤5 步目标（去除冗余步骤，合并可合并的步骤）
  'short-drama': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'outline', label: '故事大纲', icon: GitBranch },
    { key: 'script', label: '剧本写作', icon: FileText },
    { key: 'review', label: '市场分析', icon: BarChart3 },
  ],
  'movie': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'outline', label: '分场大纲', icon: GitBranch },
    { key: 'script', label: '剧本写作', icon: FileText },
    { key: 'review', label: '市场分析', icon: BarChart3 },
  ],
  'tv-drama': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'character', label: '人物设定', icon: Users },
    { key: 'outline', label: '分集大纲', icon: GitBranch },
    { key: 'script', label: '剧本写作', icon: FileText },
    { key: 'review', label: '市场分析', icon: BarChart3 },
  ],
  'variety': [
    { key: 'idea', label: '节目创意', icon: Lightbulb },
    { key: 'topic', label: '节目定位', icon: Target },
    { key: 'outline', label: '环节设计', icon: GitBranch },
    { key: 'character', label: '嘉宾人设', icon: Users },
    { key: 'script', label: '台本写作', icon: FileText },
    { key: 'review', label: '效果预估', icon: BarChart3 },
  ],
  'microfilm': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'outline', label: '故事梗概', icon: GitBranch },
    { key: 'character', label: '人物设定', icon: Users },
    { key: 'script', label: '剧本写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'anime': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'character', label: '人设原画', icon: Users },
    { key: 'outline', label: '集纲设计', icon: GitBranch },
    { key: 'script', label: '配音脚本', icon: FileText },
    { key: 'review', label: '市场分析', icon: BarChart3 },
  ],
  'audio-drama': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'outline', label: '剧目大纲', icon: GitBranch },
    { key: 'character', label: '声音人设', icon: Users },
    { key: 'script', label: '剧本写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'documentary': [
    { key: 'idea', label: '题材灵感', icon: Lightbulb },
    { key: 'topic', label: '主题定位', icon: Target },
    { key: 'outline', label: '结构设计', icon: GitBranch },
    { key: 'script', label: '解说词写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],

  // ==================== 小说类 ====================
  'novel': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'character', label: '人物设定', icon: Users },
    { key: 'outline', label: '章纲设计', icon: GitBranch },
    { key: 'script', label: '章节写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'medium-story': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '选题分析', icon: Target },
    { key: 'character', label: '人物设定', icon: Users },
    { key: 'outline', label: '情节设计', icon: GitBranch },
    { key: 'script', label: '章节写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'short-story': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '立意构思', icon: Target },
    { key: 'outline', label: '构思设计', icon: GitBranch },
    { key: 'script', label: '写作创作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'micro-fiction': [
    { key: 'idea', label: '灵感捕捉', icon: Lightbulb },
    { key: 'plot', label: '核心构思', icon: GitBranch },
    { key: 'script', label: '微写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],

  // ==================== 文学类 ====================
  'poetry': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '主题意境', icon: Target },
    { key: 'poetry', label: '诗词创作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'prose': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '情感基调', icon: Target },
    { key: 'prose', label: '散文写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'fairy-tale': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'character', label: '角色设定', icon: Users },
    { key: 'topic', label: '主题风格', icon: Target },
    { key: 'fairy-tale', label: '童话写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'fable': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '寓意构思', icon: Target },
    { key: 'plot', label: '故事设计', icon: GitBranch },
    { key: 'fable', label: '寓言写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],

  // ==================== 曲艺/戏剧类 ====================
  'stage-play': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'character', label: '人物设定', icon: Users },
    { key: 'topic', label: '主题立意', icon: Target },
    { key: 'stage-play', label: '话剧写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'crosstalk': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '相声类型', icon: Target },
    { key: 'crosstalk', label: '相声写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'sketch': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '喜剧风格', icon: Target },
    { key: 'sketch', label: '小品写作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],

  // ==================== 歌词类 ====================
  'lyrics': [
    { key: 'idea', label: '创作灵感', icon: Lightbulb },
    { key: 'topic', label: '曲风主题', icon: Music },
    { key: 'lyrics', label: '歌词创作', icon: PenTool },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],

  // ==================== 营销文类 ====================
  'speech': [
    { key: 'idea', label: '演讲灵感', icon: Lightbulb },
    { key: 'topic', label: '主题定位', icon: Target },
    { key: 'plot', label: '观点提炼', icon: GitBranch },
    { key: 'speech-writing', label: '演讲写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'brand-story': [
    { key: 'idea', label: '品牌灵感', icon: Lightbulb },
    { key: 'topic', label: '品牌定位', icon: Target },
    { key: 'plot', label: '核心故事', icon: GitBranch },
    { key: 'brand-story-writing', label: '品牌写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'wechat-article': [
    { key: 'idea', label: '选题灵感', icon: Lightbulb },
    { key: 'topic', label: '选题定位', icon: Target },
    { key: 'plot', label: '爆点设计', icon: GitBranch },
    { key: 'wechat-article-writing', label: '文章写作', icon: FileText },
    { key: 'polish', label: '润色修改', icon: Sparkles },
  ],
  'advertising': [
    { key: 'idea', label: '创意灵感', icon: Lightbulb },
    { key: 'topic', label: '用户洞察', icon: Target },
    { key: 'plot', label: '卖点提炼', icon: GitBranch },
    { key: 'advertising-writing', label: '文案写作', icon: FileText },
    { key: 'review', label: '效果预估', icon: BarChart3 },
  ],
};

// 获取创作形式的显示名称
const FORMAT_NAMES: Record<string, string> = {
  'short-drama': '短剧剧本',
  'movie': '电影剧本',
  'tv-drama': '电视剧剧本',
  'microfilm': '微电影',
  'anime': '动画剧本',
  'audio-drama': '广播剧',
  'documentary': '纪录片',
  'novel': '长篇小说',
  'medium-story': '中篇小说',
  'short-story': '短篇小说',
  'micro-fiction': '微小说',
  'poetry': '诗词',
  'lyrics': '歌词',
  'prose': '散文',
  'fairy-tale': '童话',
  'fable': '寓言',
  'stage-play': '话剧剧本',
  'crosstalk': '相声',
  'sketch': '小品',
  'speech': '演讲稿',
  'brand-story': '品牌故事',
  'wechat-article': '公众号文章',
  'advertising': '广告文案',
};

function App() {
  // 愉悦体验Demo模式
  const [showDelightDemo, setShowDelightDemo] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('idea');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [project, setProject] = useState<Partial<Project>>({
    id: crypto.randomUUID(),
    title: '',
    genre: '',
    targetAudience: '',
    episodes: 70,
    currentStep: 'idea',
    format: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 项目 ID - 用于云端同步
  const projectId = project.id;

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [outline, setOutline] = useState<StoryOutline | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [autoSaveStatus] = useState<'saved' | 'saving'>('saved');
  // P0-1 修复：统一抽屉面板状态，替代6个全屏传送门 early return
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [freeWriteFormat, setFreeWriteFormat] = useState('poetry'); // P0-2 修复：动态 format

  // WCAG 2.1.2 - 模态框焦点管理
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 当模态框打开时，保存当前焦点并移动到模态框
  useEffect(() => {
    if (activeOverlay) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // 延迟设置焦点，确保 DOM 已更新
      setTimeout(() => {
        if (overlayRef.current) {
          const focusableElements = overlayRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          }
        }
      }, 100);
    } else {
      // 模态框关闭时，恢复之前的焦点
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [activeOverlay]);

  // Focus trap：在模态框内循环焦点
  const handleOverlayKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Escape' && e.key !== 'Tab') return;
    
    if (e.key === 'Escape') {
      setActiveOverlay(null);
      return;
    }

    // Tab 键焦点陷阱
    if (overlayRef.current) {
      const focusableElements = overlayRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);

  // 级联更新：当选择项目时，自动加载该项目的数据
  const handleProjectSelect = (selectedProject: Project) => {
    setProject(selectedProject);
    // 重置各模块数据（等待从云端加载）
    setIdeas([]);
    setSelectedTopic(null);
    setOutline(null);
    setCharacters([]);
    setEpisodes([]);
    // 从 localStorage 加载本地数据
    try {
      const savedIdeas = localStorage.getItem(`drama-writer-ideas-${selectedProject.id}`);
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
      
      const savedOutline = localStorage.getItem(`drama-writer-outline-${selectedProject.id}`);
      if (savedOutline) setOutline(JSON.parse(savedOutline));
      
      const savedCharacters = localStorage.getItem(`drama-writer-characters-${selectedProject.id}`);
      if (savedCharacters) setCharacters(JSON.parse(savedCharacters));
      
      const savedEpisodes = localStorage.getItem(`drama-writer-episodes-${selectedProject.id}`);
      if (savedEpisodes) setEpisodes(JSON.parse(savedEpisodes));
    } catch (e) {
      console.warn('加载本地数据失败:', e);
    }
  };

  // 根据选中的创作形式获取当前工作流步骤
  const currentWorkflow = useMemo(() => {
    if (selectedFormat && FORMAT_WORKFLOWS[selectedFormat]) {
      return FORMAT_WORKFLOWS[selectedFormat];
    }
    // 默认显示格式选择
    return [{ key: 'idea' as WorkflowStep, label: '选择创作形式', icon: LayoutGrid }];
  }, [selectedFormat]);

  const currentStepIndex = currentWorkflow.findIndex(s => s.key === currentStep);

  const handleNext = () => {
    if (currentStepIndex < currentWorkflow.length - 1) {
      const nextStep = currentWorkflow[currentStepIndex + 1].key;
      setCurrentStep(nextStep);
      setProject(p => ({ ...p, currentStep: nextStep, updatedAt: new Date() }));
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentWorkflow[currentStepIndex - 1].key;
      setCurrentStep(prevStep);
      setProject(p => ({ ...p, currentStep: prevStep, updatedAt: new Date() }));
    }
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    setProject(p => ({ ...p, format, updatedAt: new Date() }));
    // 自动跳转到第一个步骤
    if (FORMAT_WORKFLOWS[format]) {
      setCurrentStep(FORMAT_WORKFLOWS[format][0].key);
    }
  };

  const renderStepContent = () => {
    // 如果还没有选择创作形式，显示格式选择器
    if (!selectedFormat) {
      return (
        <FormatSelector
          selectedFormat={null}
          onFormatChange={handleFormatChange}
        />
      );
    }

    switch (currentStep) {
      case 'idea':
        return (
          <IdeaCollector 
            ideas={ideas} 
            onIdeasChange={setIdeas}
            projectTitle={project.title || ''}
            onTitleChange={(title) => setProject(p => ({ ...p, title }))}
            format={project.format}
            projectId={projectId}
          />
        );
      case 'topic':
        return (
          <TopicEvaluator
            ideas={ideas}
            format={selectedFormat || undefined}
            onTopicSelect={setSelectedTopic}
            selectedTopic={selectedTopic}
            onGenresChange={(genres) => setProject(p => ({ ...p, genre: genres.join(',') }))}
            onAudienceChange={(audience) => setProject(p => ({ ...p, targetAudience: audience }))}
          />
        );
      case 'worldbuilding':
        return (
          <WorldBuilding
            ideas={ideas}
            onWorldBuildingChange={(data) => console.log('WorldBuilding:', data)}
          />
        );
      case 'outline':
        return (
          <OutlineBuilder 
            onOutlineChange={setOutline}
            outline={outline}
            totalEpisodes={project.episodes || 70}
            onTotalEpisodesChange={(n) => setProject(p => ({ ...p, episodes: n }))}
            ideas={ideas}
            selectedGenres={ideas.flatMap(i => i.selectedTags || i.tags || [])}
            format={selectedFormat || undefined}
            projectId={projectId}
          />
        );
      case 'character':
        return (
          <CharacterManager
            characters={characters}
            onCharactersChange={setCharacters}
            format={selectedFormat || undefined}
            projectId={projectId}
          />
        );
      case 'plot':
        return (
          <PlotDesigner
            ideas={ideas}
            characters={characters}
            onPlotChange={(data) => console.log('Plot:', data)}
          />
        );
      case 'script':
        return (
          <ScriptWriter 
            characters={characters}
            outline={outline}
            episodes={episodes}
            onEpisodesChange={setEpisodes}
            writingFormat={selectedFormat as any}
            projectId={projectId}
          />
        );
      case 'poetry':
        return (
          <PoetryWriter
            ideas={ideas}
            onPoetryChange={(data) => console.log('Poetry:', data)}
          />
        );
      case 'lyrics':
        return (
          <LyricsWriter
            ideas={ideas}
            onLyricsChange={(data) => console.log('Lyrics:', data)}
          />
        );
      case 'prose':
        return (
          <ProseWriter
            ideas={ideas}
            onProseChange={(data) => console.log('Prose:', data)}
          />
        );
      case 'fairy-tale':
        return (
          <FairyTaleWriter
            ideas={ideas}
            onFairyTaleChange={(data) => console.log('FairyTale:', data)}
          />
        );
      case 'fable':
        return (
          <FableWriter
            ideas={ideas}
            onFableChange={(data) => console.log('Fable:', data)}
          />
        );
      case 'stage-play':
        return (
          <StagePlayWriter
            ideas={ideas}
            onStagePlayChange={(data) => console.log('StagePlay:', data)}
          />
        );
      case 'crosstalk':
        return (
          <CrosstalkWriter
            ideas={ideas}
            onCrosstalkChange={(data) => console.log('Crosstalk:', data)}
          />
        );
      case 'sketch':
        return (
          <SketchWriter
            ideas={ideas}
            onSketchChange={(data) => console.log('Sketch:', data)}
          />
        );
      case 'speech-writing':
        return (
          <SpeechWriter
            ideas={ideas}
            onSave={(data) => console.log('Speech:', data)}
          />
        );
      case 'brand-story-writing':
        return (
          <BrandStoryWriter
            ideas={ideas}
            onSave={(data) => console.log('BrandStory:', data)}
          />
        );
      case 'wechat-article-writing':
        return (
          <WechatArticleWriter
            ideas={ideas}
            onSave={(data) => console.log('WechatArticle:', data)}
          />
        );
      case 'advertising-writing':
        return (
          <AdvertisingWriter
            ideas={ideas}
            onSave={(data) => console.log('Advertising:', data)}
          />
        );
      case 'polish':
        return (
          <PolishEditor
            content={episodes.length > 0 ? JSON.stringify(episodes) : ideas.map(i => i.content).join('\n')}
            format={selectedFormat}
            onPolishedChange={(data) => console.log('Polished:', data)}
          />
        );
      case 'review':
        return (
          <MarketAnalyzer 
            project={project as Project}
            episodes={episodes}
            characters={characters}
            outline={outline}
            onScoreCalculated={setScore}
            format={selectedFormat as string}
          />
        );
      default:
        return (
          <FormatSelector
            selectedFormat={selectedFormat as any}
            onFormatChange={handleFormatChange}
          />
        );
    }
  };

  // 如果是Demo模式，显示愉悦体验Demo页面
  if (showDelightDemo) {
    return (
      <>
        <DelightDemo />
        <button
          onClick={() => setShowDelightDemo(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          ← 返回创作平台
        </button>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundImage: 'url(/banner.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* WCAG 2.4.1 - 跳过导航链接 */}
      <a href="#main-content" className="skip-to-content">跳到主要内容</a>

      {/* P0-1 修复：侧边抽屉面板（全屏替换 → 保留创作上下文） */}
      {activeOverlay && (
        <>
          {/* 半透明遮罩 */}
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setActiveOverlay(null)}
            aria-hidden="true"
          />
          {/* 抽屉主体 - WCAG 2.1.2 焦点管理 */}
          <div
            ref={overlayRef}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label={activeOverlay === 'marketplace' ? '文创市场' :
                       activeOverlay === 'project-manager' ? '项目管理' :
                       activeOverlay === 'learning-center' ? '学习中心' :
                       activeOverlay === 'activity-center' ? '活动中心' :
                       activeOverlay === 'user-center' ? '用户中心' :
                       activeOverlay === 'free-write' ? '留白创作' : '面板'}
            onKeyDown={handleOverlayKeyDown}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-bold text-gray-900">
                {activeOverlay === 'marketplace' && '文创市场'}
                {activeOverlay === 'project-manager' && '项目管理'}
                {activeOverlay === 'learning-center' && '学习中心'}
                {activeOverlay === 'activity-center' && '活动中心'}
                {activeOverlay === 'user-center' && '用户中心'}
                {activeOverlay === 'free-write' && '留白创作'}
              </h2>
              <button
                onClick={() => setActiveOverlay(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                aria-label="关闭面板"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="p-0">
              {activeOverlay === 'marketplace' && <MarketplacePage onClose={() => setActiveOverlay(null)} />}
              {activeOverlay === 'project-manager' && <ProjectManagerPage onClose={() => setActiveOverlay(null)} />}
              {activeOverlay === 'learning-center' && <LearningCenter onClose={() => setActiveOverlay(null)} />}
              {activeOverlay === 'activity-center' && <ActivityCenter onClose={() => setActiveOverlay(null)} />}
              {activeOverlay === 'user-center' && <UserCenter onClose={() => setActiveOverlay(null)} />}
              {activeOverlay === 'free-write' && <FreeWriteMode format={freeWriteFormat} onClose={() => setActiveOverlay(null)} />}
            </div>
          </div>
        </>
      )}

      {/* 顶部标题栏 - 固定 */}
      <header className="flex-shrink-0 bg-white border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-10 w-10 object-cover rounded-full" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">观复文创</h1>
              <p className="text-xs text-gray-500">创作者的一站式服务平台</p>
            </div>
          </div>
        </div>
      </header>

      {/* 工作流步骤条 - 固定 / WCAG 1.3.1: nav landmark */}
      <nav className="flex-shrink-0 bg-white" aria-label="创作工作流导航">
        <div className="max-w-6xl mx-auto px-6 py-3">
          {/* 当前创作形式标签 */}
          {selectedFormat && (
            <div className="mb-3 flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-medium">
                {FORMAT_NAMES[selectedFormat] || selectedFormat}
              </span>
              <button
                onClick={() => {
                  setSelectedFormat(null);
                  setCurrentStep('idea');
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="切换创作形式"
                aria-label="切换创作形式"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-6 overflow-x-auto pb-1" role="tablist" aria-label="工作流步骤">
            {currentWorkflow.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.key === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer flex-1 justify-center ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : isCompleted
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${step.label}${isCompleted ? '（已完成）' : isActive ? '（当前步骤）' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4" aria-label="已完成" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 可滚动内容区 - WCAG 1.3.1: main landmark */}
      <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
        {/* Banner背景图 */}
        <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="h-48 rounded-2xl overflow-hidden relative">
          <img
            src="/banner.png"
            alt="观复文创横幅：蓝白中国风设计，展示产品理念"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/30 to-cyan-700/30 flex items-center justify-between px-12">
            <div className="text-left">
              <p className="text-lg text-white drop-shadow-lg italic" style={{ fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.1em' }}>"夫物芸芸，各复归其根。</p>
              <p className="text-lg text-white drop-shadow-lg italic" style={{ fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.1em' }}>归根曰静，是谓复命。"</p>
            </div>
            <img src="/logo.png" alt="观复文创logo" className="h-20 w-20 object-cover rounded-full" />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-6">
          {/* 左侧主内容 */}
          <div className="flex-1 space-y-4">
            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const currentStepData = currentWorkflow[currentStepIndex];
                    if (currentStepData) {
                      const Icon = currentStepData.icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    }
                    return <LayoutGrid className="w-6 h-6 text-white" />;
                  })()}
                  <h2 className="text-xl font-bold text-white">
                    {selectedFormat
                      ? (currentWorkflow[currentStepIndex]?.label || '选择创作形式')
                      : '选择创作形式'
                    }
                  </h2>
                </div>
              </div>
              <div className="p-5">
                {renderStepContent()}
              </div>
            </div>

            {/* Navigation */}
            {selectedFormat && currentWorkflow.length > 1 && (
              <div className="flex items-center justify-between" role="navigation" aria-label="工作流导航">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="上一步"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  上一步
                </button>

                <div className="text-sm text-gray-700" aria-live="polite">
                  第 {currentStepIndex + 1} / {currentWorkflow.length} 步
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === currentWorkflow.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="下一步"
                >
                  下一步
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* 右侧侧边栏 */}
          <aside className="w-72 flex-shrink-0 space-y-[15.5px]" aria-label="侧边工具栏">
            {/* 项目概览 */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                项目概览
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">当前阶段</span>
                  <span className="font-semibold text-blue-600">
                    {selectedFormat
                      ? (currentWorkflow[currentStepIndex]?.label || '未开始')
                      : '选择形式'
                    }
                  </span>
                </div>
                {selectedFormat && (
                  <>
                    {project.title && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">项目名称</span>
                        <span className="font-semibold text-blue-600 text-right max-w-[120px] truncate">{project.title}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">创作形式</span>
                      <span className="font-semibold text-blue-600">{FORMAT_NAMES[selectedFormat]}</span>
                    </div>
                    {currentStep === 'idea' && ideas.length > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">灵感数量</span>
                          <span className="font-semibold text-blue-600">{ideas.length}</span>
                        </div>
                        {ideas.some(i => i.selectedTags?.length) && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">选中元素</span>
                            <span className="font-semibold text-blue-600">
                              {ideas.reduce((acc, i) => acc + (i.selectedTags?.length || 0), 0)} 个
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {currentStep === 'topic' && project.targetAudience && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">目标受众</span>
                        <span className="font-semibold text-blue-600">{project.targetAudience}</span>
                      </div>
                    )}
                    {currentStep === 'character' && characters.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">人物数量</span>
                        <span className="font-semibold text-blue-600">{characters.length}</span>
                      </div>
                    )}
                    {(currentStep === 'script' || currentStep === 'review') && (() => {
                      // 根据 format 决定项目概览的"集/场/篇"语义
                      const episodeFormats = ['short-drama', 'tv-drama'];
                      const sceneFormats = ['movie', 'microfilm', 'stage-play', 'anime', 'audio-drama', 'variety', 'documentary'];
                      const chapterFormats = ['novel', 'medium-story', 'short-story', 'micro-fiction'];
                      const noEpisodeFormats = ['poetry', 'prose', 'lyrics', 'fable', 'fairy-tale', 'crosstalk', 'sketch', 'speech', 'brand-story', 'wechat-article', 'advertising'];
                      const fmt = selectedFormat || '';
                      if (noEpisodeFormats.includes(fmt)) return null;
                      const unitLabel = episodeFormats.includes(fmt) ? '集' : sceneFormats.includes(fmt) ? '场' : chapterFormats.includes(fmt) ? '章' : '集';
                      const countLabel = episodeFormats.includes(fmt) ? '剧集进度' : sceneFormats.includes(fmt) ? '场景进度' : chapterFormats.includes(fmt) ? '章节进度' : '内容进度';
                      const wordsPerUnit = chapterFormats.includes(fmt) ? 3000 : 1500;
                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{countLabel}</span>
                            <span className="font-semibold text-blue-600">{episodes.length} / {project.episodes || 0} {unitLabel}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">预估字数</span>
                            <span className="font-semibold text-blue-600">{project.episodes ? `${project.episodes * wordsPerUnit} 字` : '0'}</span>
                          </div>
                        </>
                      );
                    })()}
                    {currentStep === 'review' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">完成进度</span>
                        <span className="font-semibold text-blue-600">
                          {Math.round((currentStepIndex / (currentWorkflow.length - 1)) * 100)}%
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={selectedFormat ? Math.round((currentStepIndex / (currentWorkflow.length - 1)) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label="项目完成进度">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                  style={{
                    width: selectedFormat
                      ? `${(currentStepIndex / (currentWorkflow.length - 1)) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            {/* Score Preview */}
            {score && (
              <ScorePanel score={score} compact />
            )}

            {/* 创作提示 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-cyan-500" />
                创作提示
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {!selectedFormat && (
                  <p>首先选择您想要创作的类型，不同的创作形式会有不同的工作流程。</p>
                )}
                {selectedFormat && currentStep === 'idea' && (
                  <p>记录下你所有的灵感碎片，不必追求完美，有时候一个有趣的想法就是好故事的开始。</p>
                )}
                {selectedFormat && currentStep === 'topic' && (
                  <p>选题要综合考虑市场趋势和自身擅长领域，热门题材竞争激烈，冷门题材可能更有突破。</p>
                )}
                {selectedFormat && currentStep === 'outline' && (
                  <p>大纲是剧本的骨架，好的开头能吸引观众，留有悬念的结尾能让人期待下一集。</p>
                )}
                {selectedFormat && currentStep === 'character' && (
                  <p>人物要有成长弧度，反派也要有合理的动机，扁平的角色难以打动人心。</p>
                )}
                {selectedFormat && currentStep === 'plot' && (
                  <p>情节要有起承转合，适当设置冲突和高潮，让故事节奏张弛有度。</p>
                )}
                {selectedFormat && currentStep === 'script' && (
                  <p>剧本是对话的艺术，用人物的语言展现性格，用场景描写营造氛围。</p>
                )}
                {selectedFormat && currentStep === 'review' && (
                  <p>分析作品的市场潜力，了解目标受众，让创作更有针对性。</p>
                )}
                {selectedFormat && currentStep === 'polish' && (
                  <p>好文章是改出来的，注意语言的精炼和节奏的把控，让文字更有感染力。</p>
                )}
                {selectedFormat && currentStep === 'market' && (
                  <p>了解市场趋势和竞品情况，定位目标受众，制定合适的推广策略。</p>
                )}
                {selectedFormat && currentStep === 'advertising-writing' && (
                  <p>广告文案要简洁有力，突出产品卖点，一句话打动消费者。</p>
                )}
              </div>
            </div>

            {/* 用户中心 */}
            <UserCenterSidebar onOpen={() => setActiveOverlay('user-center')} />

            {/* 学习创作 */}
            <LearningCenterSidebar onOpen={() => setActiveOverlay('learning-center')} />

            {/* 活动中心 */}
            <ActivityCenterSidebar onOpen={() => setActiveOverlay('activity-center')} />

            {/* 项目管理 */}
            <ProjectManagerSidebar onOpen={() => setActiveOverlay('project-manager')} />

            {/* 文创市场 */}
            <MarketplaceSidebar onOpen={() => setActiveOverlay('marketplace')} />

            {/* 留白创作 - 自由写作入口（P0-2: 动态 format） */}
            <button
              onClick={() => {
                // 根据当前选中的创作形式决定默认 format
                const literaryFormats = ['poetry', 'prose', 'lyrics', 'fairy-tale', 'fable', 'crosstalk', 'sketch'];
                setFreeWriteFormat(literaryFormats.includes(selectedFormat || '') ? (selectedFormat as string) : 'poetry');
                setActiveOverlay('free-write');
              }}
              className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
              aria-label="打开留白创作 - 诗词散文·自由书写"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <Feather className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">留白创作</h3>
                    <p className="text-xs text-white/80">诗词散文·自由书写</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </button>
          </aside>
        </div>
      </div>
      </main>
    </div>
  );
}

export default App;
