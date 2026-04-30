import { useState } from 'react';
import { BarChart3, Search, Eye, Star, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { Project, Episode, Character, StoryOutline, ScoreResult, MarketReference } from '../types';

interface MarketAnalyzerProps {
  project: Project;
  episodes: Episode[];
  characters: Character[];
  outline?: StoryOutline | null;
  onScoreCalculated: (score: ScoreResult) => void;
  format?: string;
}

// 模拟市场参考数据
const mockMarketRefs: MarketReference[] = [
  { id: '1', platform: '抖音', title: '《闪婚后发现老公是首富》', genre: '闪婚甜宠', views: 3.2, rating: 4.9, analysis: '开篇即冲突，第三集完成身份反转，闪婚设定制造天然张力' },
  { id: '2', platform: '快手', title: '《重生后我继承了万亿遗产》', genre: '都市重生', views: 2.8, rating: 4.7, analysis: '系统金手指设定明确，主角目标清晰，观众代入感强' },
  { id: '3', platform: '抖音', title: '《萌宝送上门：爹地请接收》', genre: '萌宝团宠', views: 2.5, rating: 4.8, analysis: '萌娃+豪门设定吸引女性观众，亲情线与爱情线并行' },
  { id: '4', platform: '腾讯微视', title: '《契约恋人：总裁的假新娘》', genre: '先婚后爱', views: 2.1, rating: 4.6, analysis: '契约关系制造天然冲突，反派角色塑造成功，观众共情度高' },
  { id: '5', platform: 'B站', title: '《穿书后我成了全民偶像》', genre: '穿书穿书', views: 1.9, rating: 4.5, analysis: '穿书设定新颖，女主人设反套路，娱乐圈设定节奏明快' },
  { id: '6', platform: '抖音', title: '《王妃她只想搞事业》', genre: '王妃女尊', views: 2.3, rating: 4.7, analysis: '女尊设定独特，王妃人设不傻白甜，权谋线与爱情线双线并行' },
  { id: '7', platform: '快手', title: '《师尊他重生了》', genre: '玄幻仙侠', views: 2.0, rating: 4.6, analysis: '师尊人设禁欲系，男二反转出彩，虐恋线拉满观众情绪' },
  { id: '8', platform: '抖音', title: '《顾医生他高冷又粘人》', genre: '现言甜宠', views: 1.8, rating: 4.5, analysis: '医患设定日常感强，甜中带虐，高冷男主追妻火葬场' },
  { id: '9', platform: '腾讯微视', title: '《我在民国当大佬》', genre: '民国谍战', views: 1.6, rating: 4.4, analysis: '民国+谍战双设定，动作戏精彩，但需注意历史考据细节' },
  { id: '10', platform: 'B站', title: '《炮灰觉醒后全员火葬场》', genre: '打脸虐渣', views: 2.2, rating: 4.8, analysis: '穿书炮灰逆袭打脸爽文，情绪释放点密集，男主腹黑设定加分' },
  { id: '11', platform: '抖音', title: '《老婆孩子都穿书了》', genre: '种田穿越', views: 1.5, rating: 4.3, analysis: '种田+穿越反套路设定，轻松治愈，但需加强前期钩子' },
  { id: '12', platform: '快手', title: '《离婚后我被顶流求婚了》', genre: '追妻二婚', views: 2.4, rating: 4.7, analysis: '追妻火葬场+顶流设定，爽感足，女性独立主题突出' },
];

const genreKeywords: Record<string, string[]> = {
  '闪婚甜宠': ['豪门', '闪婚', '总裁', '逆袭', '身份差', '先婚后爱'],
  '都市重生': ['系统', '继承', '逆袭', '首富', '打脸', '金手指'],
  '萌宝团宠': ['萌宝', '豪门', '团宠', '天才', '爹地', '妈咪'],
  '先婚后爱': ['契约', '假结婚', '总裁', '日久生情', '追妻', '虐恋'],
  '穿书穿书': ['穿书', '系统', '逆袭', '打脸', '娱乐圈', '炮灰'],
  '王妃女尊': ['王妃', '女帝', '权谋', '宫斗', '王爷', '公主'],
  '玄幻仙侠': ['修仙', '师尊', '渡劫', '灵宠', '宗门', '天骄'],
  '现言甜宠': ['甜宠', '医生', '霸总', '追妻', '暗恋', '青梅竹马'],
  '民国谍战': ['民国', '谍战', '军阀', '特工', '复仇', '乱世'],
  '打脸虐渣': ['打脸', '虐渣', '逆袭', '炮灰', '重生', '复仇'],
  '种田穿越': ['种田', '穿越', '空间', '美食', '发家致富', '治愈'],
  '追妻二婚': ['追妻', '二婚', '顶流', '火葬场', '破镜重圆', '闪婚'],
  '都市言情': ['豪门', '总裁', '甜宠', '虐恋', '闪婚', '契约'],
  '都市重生': ['重生', '系统', '金手指', '打脸', '逆袭', '继承'],
  '玄幻奇幻': ['穿越', '修仙', '系统', '废柴逆袭', '师尊', '萌宠'],
  '悬疑推理': ['复仇', '阴谋', '推理', '惊悚', '高能', '反转'],
  '职场商战': ['职场', '创业', '逆袭', '商战', '精英', '草根'],
  '古风穿越': ['重生', '宫斗', '宅斗', '王爷', '公主', '权谋'],
};

export default function MarketAnalyzer({ project, episodes, characters, onScoreCalculated, format }: MarketAnalyzerProps) {
  const [searchKeyword, setSearchKeyword] = useState('');

  // 根据 format 判断是否为"集"模式
  const isEpisodeMode = format === 'short-drama' || format === 'tv-drama';
  const episodeLabel = isEpisodeMode ? '集' : '场';
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [marketRefs, setMarketRefs] = useState<MarketReference[]>(mockMarketRefs);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchCollapsed, setSearchCollapsed] = useState(true); // 搜索参考默认折叠

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    
    // 模拟搜索结果
    const genre = project.genre || '都市情感';
    const keywords = genreKeywords[genre] || [];
    const newRefs: MarketReference[] = keywords.slice(0, 3).map((kw, i) => ({
      id: `search-${i}`,
      platform: ['抖音', '快手', '腾讯微视'][i],
      title: `《${searchKeyword}${kw}》`,
      genre,
      views: Math.round(Math.random() * 3 * 10) / 10,
      rating: 4 + Math.random(),
      analysis: `基于关键词「${kw}」的爆款剧本分析...`,
    }));
    
    setMarketRefs(prev => [...newRefs, ...prev]);
    setSearchKeyword('');
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // 模拟分析过程
    setTimeout(() => {
      const score: ScoreResult = {
        overall: 78,
        marketFit: 85,
        originality: 72,
        commercial: 80,
        structure: 75,
        character: 82,
        suggestions: [
          '前三集节奏偏慢，建议加快冲突节奏，第一集结尾设置悬念钩子',
          '主角人设鲜明，但配角形象较为单薄，建议增加配角动机描写',
          '第15-20集出现剧情拖沓现象，建议精简支线剧情',
          '建议参考《契约恋人》的反转设计，增加观众期待感',
          '结尾略显仓促，建议增加大团圆前的情感高潮戏',
        ],
      };
      
      onScoreCalculated(score);
      setIsAnalyzing(false);
    }, 2000);
  };

  const filteredRefs = marketRefs.filter(ref => {
    if (selectedPlatform !== 'all' && ref.platform !== selectedPlatform) return false;
    return true;
  });

  const completionRate = Math.round((episodes.filter(e => e.scenes.length > 0).length / Math.max(episodes.length, 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
          <div className="text-xs text-gray-600 mt-0.5">完成度</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{characters.length}</div>
          <div className="text-xs text-gray-600 mt-0.5">人物数</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-600">{episodes.filter(e => e.status === 'final').length}</div>
          <div className="text-xs text-gray-600 mt-0.5">定稿{episodeLabel}数</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 text-center">
          <div className="text-lg font-bold text-purple-600 truncate">{project.genre || '-'}</div>
          <div className="text-xs text-gray-600 mt-0.5">题材</div>
        </div>
      </div>

      {/* Search References - Collapsible */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 折叠标题栏 */}
        <button
          onClick={() => setSearchCollapsed(!searchCollapsed)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            搜索市场参考
          </h3>
          {searchCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* 折叠内容 */}
        {!searchCollapsed && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="输入关键词搜索同类爆款..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all cursor-pointer"
              >
                搜索
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {['all', '抖音', '快手', '腾讯微视', 'B站'].map(platform => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    selectedPlatform === platform
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {platform === 'all' ? '全部平台' : platform}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredRefs.map(ref => (
                <div key={ref.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{ref.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {ref.platform}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                          {ref.genre}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{ref.views}亿播放</span>
                      <Star className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm text-gray-600">{ref.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{ref.analysis}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || episodes.length === 0}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            正在分析剧本...
          </>
        ) : (
          <>
            <BarChart3 className="w-6 h-6" />
            一键分析剧本质量
          </>
        )}
      </button>

      {/* Analysis Tips */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-5">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-500" />
          市场分析要点
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">1.</span>
            <span>参考同类爆款的开篇节奏，前3集必须制造足够吸引力</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">2.</span>
            <span>分析爆款的核心冲突设计，找到差异化切入点</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500">3.</span>
            <span>关注平台用户画像，选择与目标受众匹配的平台主推</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
