import { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  User, 
  FileText, 
  Tag, 
  ChevronDown, 
  ChevronUp,
  X,
  ArrowLeft,
  MessageCircle,
  Heart,
  Copy,
  ExternalLink,
  Star
} from 'lucide-react';

interface MarketItem {
  id: string;
  title: string;
  type: string;
  author: string;
  authorId: string;
  price: number;
  description: string;
  tags: string[];
  views: number;
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
  coverImage?: string;
  rating?: number;
  sales?: number;
}

const MOCK_ITEMS: MarketItem[] = [
  {
    id: '1',
    title: '《长安十二时辰》短剧剧本',
    type: 'short-drama',
    author: '张三',
    authorId: 'user1',
    price: 5000,
    description: '古装悬疑短剧，70集完整剧本，已备案。讲述上元节前夕，长安城陷入危局，死囚张小敬与名士檀棋携手在十二时辰内拯救长安的故事。',
    tags: ['古装', '悬疑', '热门IP'],
    views: 1280,
    createdAt: '2026-04-20',
    status: 'available',
    rating: 4.8,
    sales: 3
  },
  {
    id: '2',
    title: '都市爱情小说《遇见》',
    type: 'novel',
    author: '李四',
    authorId: 'user2',
    price: 8000,
    description: '30万字长篇小说，已出版，影视改编权出售。讲述都市男女在命运的安排下相遇、相知、相爱的故事，文笔细腻，情感真挚。',
    tags: ['都市', '爱情', '出版'],
    views: 890,
    createdAt: '2026-04-18',
    status: 'available',
    rating: 4.6,
    sales: 5
  },
  {
    id: '3',
    title: '品牌故事《匠心》',
    type: 'brand-story',
    author: '王五',
    authorId: 'user3',
    price: 2000,
    description: '非遗传承主题品牌故事，适合茶叶/工艺品品牌。讲述老字号传人坚守匠心的感人故事，适用于品牌宣传和内容营销。',
    tags: ['品牌', '非遗', '营销'],
    views: 456,
    createdAt: '2026-04-15',
    status: 'available',
    rating: 4.9,
    sales: 12
  },
  {
    id: '4',
    title: '纪录片脚本《手艺》',
    type: 'documentary',
    author: '赵六',
    authorId: 'user4',
    price: 12000,
    description: '传统手工艺纪录片，6集，已拍摄完成。记录六位非遗传承人的匠心故事，展现传统技艺的传承与创新。',
    tags: ['纪录片', '非遗', '已制作'],
    views: 2340,
    createdAt: '2026-04-10',
    status: 'available',
    rating: 4.7,
    sales: 2
  },
  {
    id: '5',
    title: '《星际穿越》科幻短剧剧本',
    type: 'short-drama',
    author: '钱七',
    authorId: 'user5',
    price: 6800,
    description: '科幻题材短剧，45集完整剧本。讲述人类在星际移民途中遭遇的生存挑战与情感纠葛，画面感强，适合AI生成。',
    tags: ['科幻', '星际', '冒险'],
    views: 1890,
    createdAt: '2026-04-08',
    status: 'available',
    rating: 4.5,
    sales: 8
  },
  {
    id: '6',
    title: '诗歌集《静夜思》',
    type: 'poetry',
    author: '孙九',
    authorId: 'user6',
    price: 500,
    description: '现代诗歌集，收录50首原创诗歌。风格清新淡雅，富有禅意，适合公众号投稿和文化周边产品。',
    tags: ['诗歌', '文学', '原创'],
    views: 567,
    createdAt: '2026-04-05',
    status: 'available',
    rating: 4.3,
    sales: 15
  }
];

const TYPE_NAMES: Record<string, string> = {
  'short-drama': '短剧剧本',
  'movie': '电影剧本',
  'tv-drama': '电视剧本',
  'documentary': '纪录片',
  'novel': '小说',
  'poetry': '诗词',
  'lyrics': '歌词',
  'brand-story': '品牌故事',
  'speech': '演讲稿',
  'wechat-article': '公众号文章'
};

const TYPE_ICONS: Record<string, string> = {
  'short-drama': '🎬',
  'movie': '🎥',
  'tv-drama': '📺',
  'documentary': '🎞️',
  'novel': '📚',
  'poetry': '✒️',
  'lyrics': '🎵',
  'brand-story': '📝',
  'speech': '🎤',
  'wechat-article': '📱'
};

interface MarketplacePageProps {
  onClose: () => void;
}

export default function MarketplacePage({ onClose }: MarketplacePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const formatTypes = useMemo(() => {
    const types = new Set(MOCK_ITEMS.map(item => item.type));
    return Array.from(types);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回创作</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">文创市场</h1>
              <p className="text-sm text-gray-500">创意作品交易平台</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索作品、作者、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <button className="px-5 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            发布作品
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-white border-r border-blue-100 p-5 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">作品类型</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center justify-between ${
                  selectedType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">📦</span>
                  <span>全部作品</span>
                </span>
                <span className={`text-xs ${selectedType === 'all' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {MOCK_ITEMS.length}
                </span>
              </button>
              {formatTypes.map(type => {
                const count = MOCK_ITEMS.filter(item => item.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center justify-between ${
                      selectedType === type
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{TYPE_ICONS[type] || '📄'}</span>
                      <span>{TYPE_NAMES[type] || type}</span>
                    </span>
                    <span className={`text-xs ${selectedType === type ? 'text-blue-100' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">价格区间</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">全部价格</button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">¥1000 以下</button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">¥1000 - ¥5000</button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">¥5000 - ¥10000</button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">¥10000 以上</button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {['古装', '都市', '悬疑', '科幻', '爱情', '非遗', '品牌'].map(tag => (
                <span key={tag} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              共找到 <span className="font-semibold text-blue-600">{filteredItems.length}</span> 个作品
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">排序：</span>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option>综合推荐</option>
                <option>最新发布</option>
                <option>价格从低到高</option>
                <option>价格从高到低</option>
                <option>浏览量最高</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
              >
                {/* Card Header with Type Badge */}
                <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    {TYPE_NAMES[item.type] || item.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.has(item.id)
                        ? 'bg-red-50 text-red-500'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="px-5 pb-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </span>
                    {item.rating && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        {item.rating}
                      </span>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-2xl font-bold text-blue-600">
                      ¥{item.price.toLocaleString()}
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">暂无匹配的作品</h3>
              <p className="text-sm text-gray-400">试试调整筛选条件或关键词</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">
                  {TYPE_NAMES[selectedItem.type] || selectedItem.type}
                </span>
                {selectedItem.status !== 'available' && (
                  <span className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                    {selectedItem.status === 'sold' ? '已售出' : '预留中'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedItem.title}</h2>
              
              {/* Stats Row */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedItem.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{selectedItem.views} 次浏览</span>
                </div>
                {selectedItem.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-600">{selectedItem.rating}</span>
                  </div>
                )}
                {selectedItem.sales && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">已售</span>
                    <span className="text-gray-600">{selectedItem.sales}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">作品简介</h3>
                <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map(tag => (
                    <span key={tag} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">价格</span>
                    <div className="text-3xl font-bold text-blue-600">¥{selectedItem.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>发布于 {selectedItem.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  联系作者
                </button>
                <button 
                  onClick={() => toggleFavorite(selectedItem.id)}
                  className={`px-5 py-3.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                    favorites.has(selectedItem.id)
                      ? 'bg-red-50 text-red-500 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.has(selectedItem.id) ? 'fill-current' : ''}`} />
                  收藏
                </button>
                <button className="px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 简化的侧边栏入口组件
interface MarketplaceSidebarProps {
  onOpen: () => void;
}

export function MarketplaceSidebar({ onOpen }: MarketplaceSidebarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      <button
        onClick={onOpen}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="font-medium">文创市场</span>
        <ChevronRight className="w-4 h-4 ml-auto" />
      </button>
    </div>
  );
}