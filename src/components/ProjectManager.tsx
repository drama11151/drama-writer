import { useState, useEffect } from 'react';
import { FolderOpen, Clock, Star, Trash2, FileText, Sparkles, ChevronDown, ChevronUp, ChevronRight, Plus, Download, Upload, ArrowLeft, X, Search, UploadCloud, Import, Edit, Eye } from 'lucide-react';

interface SavedProject {
  id: string;
  title: string;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
  episodes?: number;
  ideas?: number;
  characters?: number;
  format?: string;
}

interface SavedIdea {
  id: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

interface ProjectManagerProps {
  onOpen?: () => void;
}

// 项目管理主组件（保留原有功能）
export default function ProjectManager({ onOpen }: ProjectManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'ideas'>('projects');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    const savedProjects = localStorage.getItem('drama-writer-projects');
    const savedIdeas = localStorage.getItem('drama-writer-ideas');
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('drama-writer-projects', JSON.stringify(updated));
  };

  const deleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem('drama-writer-ideas', JSON.stringify(updated));
  };

  const exportData = () => {
    const data = { projects, ideas, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drama-writer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      idea: '灵感',
      format: '格式',
      topic: '选题',
      outline: '大纲',
      character: '人物',
      script: '剧本',
      review: '审核',
    };
    return labels[step] || step;
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      'short-drama': '短剧', 'movie': '电影', 'tv-drama': '电视剧', 'variety': '综艺',
      'microfilm': '微电影', 'anime': '动画', 'audio-drama': '广播剧', 'documentary': '纪录片',
      'novel': '长篇小说', 'medium-story': '中篇小说', 'short-story': '短篇小说', 'micro-fiction': '微小说',
      'poetry': '诗词', 'prose': '散文', 'lyrics': '歌词', 'fairy-tale': '童话', 'fable': '寓言',
      'stage-play': '话剧', 'crosstalk': '相声', 'sketch': '小品',
      'speech': '演讲稿', 'brand-story': '品牌故事', 'wechat-article': '公众号文章', 'advertising': '广告文案',
    };
    return labels[format] || format;
  };

  // 根据 format 判断内容单位
  const episodeFormats = ['short-drama', 'tv-drama'];
  const sceneFormats = ['movie', 'microfilm', 'stage-play', 'anime', 'audio-drama', 'variety', 'documentary'];
  const chapterFormats = ['novel', 'medium-story', 'short-story', 'micro-fiction'];
  const noEpisodeFormats = ['poetry', 'prose', 'lyrics', 'fable', 'fairy-tale', 'crosstalk', 'sketch', 'speech', 'brand-story', 'wechat-article', 'advertising'];
  const getEpisodeUnit = (format: string) => {
    if (episodeFormats.includes(format)) return '集';
    if (sceneFormats.includes(format)) return '场';
    if (chapterFormats.includes(format)) return '章';
    return '';
  };
  const isEpisodeMode = (format: string) => format === 'short-drama' || format === 'tv-drama';
  const getEpisodeLabel = (format: string) => {
    if (episodeFormats.includes(format)) return '计划集数';
    if (sceneFormats.includes(format)) return '计划场数';
    if (chapterFormats.includes(format)) return '计划章数';
    return '';
  };

  const totalCount = projects.length + ideas.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 flex items-center justify-between text-white hover:from-blue-800 hover:to-cyan-800 transition-all"
        aria-expanded={isExpanded}
        aria-controls="project-manager-content"
      >
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" aria-hidden="true" />
          <span className="font-bold">项目管理</span>
          {totalCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {totalCount} 项
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="project-manager-content" className="p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              项目 ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'ideas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              灵感 ({ideas.length})
            </button>
          </div>

          {/* Projects List */}
          {activeTab === 'projects' && (
            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无保存的项目</p>
                </div>
              ) : (
                projects.map(project => (
                  <div
                    key={project.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {project.title || '未命名项目'}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(project.updatedAt)}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {getStepLabel(project.currentStep)}
                          </span>
                          {project.format && (
                            <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">
                              {getFormatLabel(project.format)}
                            </span>
                          )}
                          {project.episodes && getEpisodeUnit(project.format || '') && (
                            <span>{project.episodes}{getEpisodeUnit(project.format || '')}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="删除项目"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Ideas List */}
          {activeTab === 'ideas' && (
            <div className="space-y-2">
              {ideas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无保存的灵感</p>
                </div>
              ) : (
                ideas.map(idea => (
                  <div
                    key={idea.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {idea.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(idea.createdAt)}
                          </span>
                          {idea.tags && idea.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {idea.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all ml-2"
                        aria-label="删除灵感"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Actions */}
          {totalCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={exportData}
                className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
              <button
                onClick={() => {
                  if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                    localStorage.removeItem('drama-writer-projects');
                    localStorage.removeItem('drama-writer-ideas');
                    setProjects([]);
                    setIdeas([]);
                  }
                }}
                className="py-2 px-3 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
            </div>
          )}

          {/* 导出中心 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4 text-blue-500" />
              导出中心
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                title="导出为 Word 格式"
              >
                <span className="font-bold">.docx</span>
              </button>
              <button
                className="py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                title="导出为 PDF 格式"
              >
                <span className="font-bold">.pdf</span>
              </button>
              <button
                className="py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                title="导出为 Final Draft 格式"
              >
                <span className="font-bold">.fdx</span>
              </button>
              <button
                className="py-2 px-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                title="导出为纯文本格式"
              >
                <span className="font-bold">.txt</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">选择格式导出您的作品</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 侧边栏入口组件
export function ProjectManagerSidebar({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
      aria-label="打开项目管理 - 管理您的项目"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">项目管理</h3>
            <p className="text-xs text-white/80">管理您的项目</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}

// 全屏项目管理页面
export function ProjectManagerPage({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'ideas'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // 焦点管理：打开弹窗时移动焦点，关闭时恢复
  useEffect(() => {
    if (selectedProject) {
      // 延迟确保 DOM 已更新
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          }
        }
      }, 100);
    } else {
      // 弹窗关闭时恢复焦点
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [selectedProject]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProjects = localStorage.getItem('drama-writer-projects');
    const savedIdeas = localStorage.getItem('drama-writer-ideas');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('drama-writer-projects', JSON.stringify(updated));
  };

  const deleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem('drama-writer-ideas', JSON.stringify(updated));
  };

  const exportData = () => {
    const data = { projects, ideas, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drama-writer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      idea: '灵感',
      format: '格式',
      topic: '选题',
      outline: '大纲',
      character: '人物',
      script: '剧本',
      review: '审核',
    };
    return labels[step] || step;
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      'short-drama': '短剧',
      'movie': '电影',
      'tv-drama': '电视剧',
      'novel': '小说',
      'poetry': '诗词',
      'lyrics': '歌词',
    };
    return labels[format] || format;
  };

  const getStepProgress = (step: string) => {
    const steps = ['idea', 'topic', 'outline', 'character', 'script', 'review'];
    return steps.indexOf(step);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIdeas = ideas.filter(i => 
    i.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportFormats = [
    { ext: '.docx', label: 'Word文档', color: 'from-blue-700 to-blue-800' },
    { ext: '.pdf', label: 'PDF文件', color: 'from-red-700 to-red-800' },
    { ext: '.fdx', label: 'Final Draft', color: 'from-purple-700 to-purple-800' },
    { ext: '.txt', label: '纯文本', color: 'from-gray-700 to-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回创作
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-7 h-7 text-blue-500" />
              项目管理
            </h1>
          </div>
          
          {/* 搜索栏 */}
          <div className="flex-1 max-w-xl mx-8">
            <label htmlFor="project-search" className="sr-only">搜索项目</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="project-search"
                type="text"
                placeholder="搜索项目名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="搜索项目"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              导出数据
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">项目总数</p>
                <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">灵感总数</p>
                <p className="text-3xl font-bold text-cyan-600">{ideas.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">内容总量</p>
                <p className="text-3xl font-bold text-purple-600">
                  {projects.reduce((acc, p) => acc + (p.episodes || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">数据容量</p>
                <p className="text-3xl font-bold text-gray-600">
                  {((JSON.stringify({projects, ideas}).length) / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 导出中心 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-500" />
            导出中心
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {exportFormats.map((format) => (
              <button
                key={format.ext}
                className={`py-4 px-6 bg-gradient-to-r ${format.color} text-white rounded-xl font-medium hover:shadow-lg transition-all flex flex-col items-center gap-2`}
              >
                <span className="text-2xl font-bold">{format.ext}</span>
                <span className="text-sm opacity-80">{format.label}</span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">选择格式导出您的作品为不同格式</p>
        </div>

        {/* 主内容区 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-4 px-6 text-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              项目列表 ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex-1 py-4 px-6 text-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'ideas'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              灵感库 ({ideas.length})
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6">
            {activeTab === 'projects' && (
              <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">暂无保存的项目</p>
                    <p className="text-sm mt-2">开始创作您的第一个项目吧</p>
                  </div>
                ) : (
                  filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all cursor-pointer group"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {project.title || '未命名项目'}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {formatDate(project.updatedAt)}
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {getStepLabel(project.currentStep)}
                            </span>
                            {project.format && (
                              <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                                {getFormatLabel(project.format)}
                              </span>
                            )}
                            {project.episodes && getEpisodeUnit(project.format || '') && (
                              <span className="text-sm text-gray-500">
                                {project.episodes} {getEpisodeUnit(project.format || '')}
                              </span>
                            )}
                          </div>
                          
                          {/* 进度条 */}
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                style={{ width: `${(getStepProgress(project.currentStep) / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">
                              {Math.round((getStepProgress(project.currentStep) / 5) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="查看项目详情"
                          >
                            <Eye className="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="编辑项目"
                          >
                            <Edit className="w-5 h-5" aria-hidden="true" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('确定要删除这个项目吗？此操作不可恢复。')) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="删除项目"
                          >
                            <Trash2 className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'ideas' && (
              <div className="space-y-4">
                {filteredIdeas.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">暂无保存的灵感</p>
                    <p className="text-sm mt-2">记录下您的创作灵感</p>
                  </div>
                ) : (
                  filteredIdeas.map(idea => (
                    <div
                      key={idea.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-700 leading-relaxed">
                            {idea.content}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm text-gray-400">
                              {formatDate(idea.createdAt)}
                            </span>
                            {idea.tags && idea.tags.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {idea.tags.slice(0, 5).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="删除灵感"
                        >
                          <Trash2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 批量操作 */}
        {projects.length > 0 && (
          <div className="mt-6 flex justify-between items-center bg-white rounded-2xl shadow-lg border border-blue-100 p-4">
            <span className="text-gray-500">
              共 {projects.length} 个项目，{ideas.length} 条灵感
            </span>
            <div className="flex gap-3">
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                导出全部数据
              </button>
              <button 
                onClick={() => {
                  if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                    localStorage.removeItem('drama-writer-projects');
                    localStorage.removeItem('drama-writer-ideas');
                    setProjects([]);
                    setIdeas([]);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                清空所有数据
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 项目详情弹窗 */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
          onClick={() => { setSelectedProject(null); triggerRef.current?.focus(); }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title || '项目详情'}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSelectedProject(null);
              triggerRef.current?.focus();
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              // Focus trap
              if (e.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements) return;
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
            }}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedProject.title || '未命名项目'}
              </h2>
              <button
                ref={(el) => { if (el) triggerRef.current = el; }}
                onClick={() => { setSelectedProject(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="关闭弹窗"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">创作形式</span>
                  <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {getFormatLabel(selectedProject.format || '')}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">当前阶段</span>
                  <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {getStepLabel(selectedProject.currentStep)}
                    </span>
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">{getEpisodeLabel(selectedProject.format || '')}</span>
                  <p className="font-medium text-gray-800 mt-1">
                    {selectedProject.episodes || 0} {getEpisodeUnit(selectedProject.format || '')}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">创建时间</span>
                  <p className="font-medium text-gray-800 mt-1">
                    {formatDate(selectedProject.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">创作进度</h4>
                <div
                  role="progressbar"
                  aria-valuenow={getStepProgress(selectedProject.currentStep)}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-label={`创作进度：${Math.round((getStepProgress(selectedProject.currentStep) / 5) * 100)}%`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                        style={{ width: `${(getStepProgress(selectedProject.currentStep) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round((getStepProgress(selectedProject.currentStep) / 5) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>灵感</span>
                  <span>选题</span>
                  <span>大纲</span>
                  <span>人物</span>
                  <span>剧本</span>
                  <span>审核</span>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  继续创作
                </button>
                <button className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  导出项目
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}