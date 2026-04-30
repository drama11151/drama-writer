import { useState, useMemo } from 'react';
import { ShoppingBag, Search, Filter, Eye, User, FileText, Tag, ChevronDown, ChevronUp, ChevronRight, ArrowLeft, X } from 'lucide-react';

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
}

const MOCK_ITEMS: MarketItem[] = [
  {
    id: '1',
    title: '《长安十二时辰》短剧剧本',
    type: 'short-drama',
    author: '张三',
    authorId: 'user1',
    price: 5000,
    description: '古装悬疑短剧，70集完整剧本，已备案',
    tags: ['古装', '悬疑', '热门IP'],
    views: 1280,
    createdAt: '2026-04-20',
    status: 'available'
  },
  {
    id: '2',
    title: '都市爱情小说《遇见》',
    type: 'novel',
    author: '李四',
    authorId: 'user2',
    price: 8000,
    description: '30万字长篇小说，已出版，影视改编权出售',
    tags: ['都市', '爱情', '出版'],
    views: 890,
    createdAt: '2026-04-18',
    status: 'available'
  },
  {
    id: '3',
    title: '品牌故事《匠心》',
    type: 'brand-story',
    author: '王五',
    authorId: 'user3',
    price: 2000,
    description: '非遗传承主题品牌故事，适合茶叶/工艺品品牌',
    tags: ['品牌', '非遗', '营销'],
    views: 456,
    createdAt: '2026-04-15',
    status: 'available'
  },
  {
    id: '4',
    title: '纪录片脚本《手艺》',
    type: 'documentary',
    author: '赵六',
    authorId: 'user4',
    price: 12000,
    description: '传统手工艺纪录片，6集，已拍摄完成',
    tags: ['纪录片', '非遗', '已制作'],
    views: 2340,
    createdAt: '2026-04-10',
    status: 'available'
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

export default function Marketplace() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

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

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">文创市场</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {/* 搜索和筛选 */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索作品、作者、标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                  selectedType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {formatTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                    selectedType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {TYPE_NAMES[type] || type}
                </button>
              ))}
            </div>
          </div>

          {/* 作品列表 */}
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        {TYPE_NAMES[item.type] || item.type}
                      </span>
                      {item.status === 'sold' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">已售出</span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                      <span>{item.createdAt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-blue-600">¥{item.price.toLocaleString()}</div>
                    <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无匹配的作品</p>
            </div>
          )}
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {TYPE_NAMES[selectedItem.type] || selectedItem.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">{selectedItem.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">作者</span>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedItem.author}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">价格</span>
                    <p className="font-bold text-blue-600 text-lg">¥{selectedItem.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">浏览量</span>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {selectedItem.views}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">发布时间</span>
                    <p className="font-medium text-gray-800">{selectedItem.createdAt}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">标签</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                    联系作者
                  </button>
                  <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    收藏作品
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 侧边栏入口组件
export function MarketplaceSidebar({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
      aria-label="打开文创市场 - 交易创意作品"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">文创市场</h3>
            <p className="text-xs text-white/80">交易创意作品</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}

// 全屏市场页面
export function MarketplacePage({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showDetail, setShowDetail] = useState<MarketItem | null>(null);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchPrice = priceRange === 'all' || 
        (priceRange === 'low' && item.price < 3000) ||
        (priceRange === 'medium' && item.price >= 3000 && item.price <= 8000) ||
        (priceRange === 'high' && item.price > 8000);
      return matchSearch && matchType && matchPrice;
    });
  }, [searchTerm, selectedType, priceRange]);

  const typeLabels: Record<string, string> = {
    'short-drama': '短剧剧本',
    'novel': '小说',
    'movie': '电影剧本',
    'tv-drama': '电视剧',
    'brand-story': '品牌故事',
    'lyrics': '歌词',
    'poetry': '诗词',
  };

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
              <ShoppingBag className="w-7 h-7 text-blue-500" />
              文创市场
            </h1>
          </div>
          
          {/* 搜索栏 */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索作品、作者、标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            共 {filteredItems.length} 件作品
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* 左侧筛选栏 */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 sticky top-28">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              筛选条件
            </h3>
            
            {/* 作品类型 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">作品类型</h4>
              <div className="space-y-2">
                {['all', 'short-drama', 'novel', 'movie', 'tv-drama', 'brand-story', 'lyrics', 'poetry'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === type 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {type === 'all' ? '全部类型' : typeLabels[type] || type}
                  </button>
                ))}
              </div>
            </div>

            {/* 价格区间 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">价格区间</h4>
              <div className="space-y-2">
                {[
                  { value: 'all', label: '全部价格' },
                  { value: 'low', label: '¥3000 以下' },
                  { value: 'medium', label: '¥3000-8000' },
                  { value: 'high', label: '¥8000 以上' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPriceRange(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      priceRange === option.value 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧作品网格 */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无符合条件的产品</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => setShowDetail(item)}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all"
                >
                  {/* 封面 */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-blue-400" />
                  </div>
                  
                  {/* 信息 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 line-clamp-2">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        item.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status === 'available' ? '可售' : item.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">¥{item.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.views}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.author}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗 */}
      {showDetail && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8"
          onClick={() => setShowDetail(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{showDetail.title}</h2>
              <button 
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 弹窗内容 */}
            <div className="p-6 space-y-6">
              {/* 封面 */}
              <div className="h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-24 h-24 text-blue-400" />
              </div>
              
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">作者</span>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {showDetail.author}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">价格</span>
                  <p className="font-bold text-blue-600 text-2xl mt-1">¥{showDetail.price.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">浏览量</span>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Eye className="w-4 h-4" />
                    {showDetail.views} 次
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <span className="text-gray-500 text-sm">发布时间</span>
                  <p className="font-medium text-gray-800 mt-1">{showDetail.createdAt}</p>
                </div>
              </div>
              
              {/* 作品描述 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">作品描述</h4>
                <p className="text-gray-600 leading-relaxed">{showDetail.description}</p>
              </div>
              
              {/* 标签 */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {showDetail.tags.map(tag => (
                    <span key={tag} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  联系作者
                </button>
                <button className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  收藏作品
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
