import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Eye, Heart, Zap } from 'lucide-react';

interface WechatArticleWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 文章类型
const ARTICLE_TYPES = [
  { id: 'opinion', name: '观点输出', desc: '表达独到见解，引发思考' },
  { id: 'story', name: '故事叙事', desc: '用故事传递价值' },
  { id: 'tutorial', name: '干货教程', desc: '实用性强，干货满满' },
  { id: 'news', name: '热点解读', desc: '解读热点事件' },
  { id: 'listicle', name: '清单列表', desc: '条理清晰，便于收藏' },
  { id: 'interview', name: '人物访谈', desc: '对话/采访形式' },
];

// 标题风格
const TITLE_STYLES = [
  { id: 'question', name: '疑问式', desc: '"为什么..."引发好奇' },
  { id: 'number', name: '数字式', desc: '"5个方法..."增加可信度' },
  { id: 'shock', name: '震惊式', desc: '"竟然..."制造反差' },
  { id: 'benefit', name: '利益式', desc: '"学会这招..."承诺价值' },
  { id: 'story', name: '故事式', desc: '用场景引人入胜' },
];

// 开头模式
const OPENING_PATTERNS = [
  { id: 'scene', name: '场景切入', desc: '用具体场景引发共鸣' },
  { id: 'data', name: '数据开头', desc: '用数据增加说服力' },
  { id: 'question', name: '提问开场', desc: '用问题引发思考' },
  { id: 'quote', name: '金句开篇', desc: '用金句奠定基调' },
  { id: 'news', name: '热点切入', desc: '借势热点话题' },
];

const WechatArticleWriter: React.FC<WechatArticleWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(''); // 副标题
  const [articleType, setArticleType] = useState(ARTICLE_TYPES[0]);
  const [titleStyle, setTitleStyle] = useState(TITLE_STYLES[0]);
  const [openingPattern, setOpeningPattern] = useState(OPENING_PATTERNS[0]);
  const [readingTime, setReadingTime] = useState('5'); // 分钟
  const [coreViewpoint, setCoreViewpoint] = useState(''); // 核心观点
  const [articleContent, setArticleContent] = useState(initialContent);
  const [showGuide, setShowGuide] = useState(false);

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      subtitle,
      articleType: articleType.name,
      titleStyle: titleStyle.name,
      openingPattern: openingPattern.name,
      readingTime,
      coreViewpoint,
      content: articleContent,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-rose-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-rose-600" />
          <h3 className="font-medium text-gray-800">公众号文章写作</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showGuide ? '隐藏指南' : '创作指南'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            保存文章
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 公众号文章创作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 公众号文章要有"钩子"——让读者想读下去</li>
                <li>• 标题决定打开率，内容决定转发率</li>
                <li>• {topic || '围绕核心观点'}，层层递进，有理有据</li>
                <li>• 结尾要有互动引导或转发激励</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">文章标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题（要足够吸引人）..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
            />
          </div>

          {/* 副标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">副标题（可选）</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="补充说明，增强吸引力..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
            />
          </div>

          {/* 文章类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-rose-500" />
                文章类型
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ARTICLE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setArticleType(type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    articleType.id === type.id
                      ? 'bg-rose-50 border-rose-400'
                      : 'bg-white border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    articleType.id === type.id ? 'text-rose-700' : 'text-gray-700'
                  }`}>
                    {type.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 标题风格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-purple-500" />
                标题风格
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TITLE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setTitleStyle(style)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    titleStyle.id === style.id
                      ? 'bg-purple-100 border-purple-400 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          {/* 开头模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                开头模式
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {OPENING_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setOpeningPattern(pattern)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    openingPattern.id === pattern.id
                      ? 'bg-amber-100 border-amber-400 text-amber-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                  }`}
                >
                  {pattern.name}
                </button>
              ))}
            </div>
          </div>

          {/* 阅读时长 */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-blue-500" />
                  预估阅读时长
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  min="1"
                  max="60"
                  className="w-20 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                />
                <span className="text-gray-500">分钟</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500" />
                  核心观点
                </span>
              </label>
              <input
                type="text"
                value={coreViewpoint}
                onChange={(e) => setCoreViewpoint(e.target.value)}
                placeholder="一句话核心观点"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
              />
            </div>
          </div>

          {/* 文章正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">文章正文</label>
            <textarea
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              placeholder="开始撰写公众号文章...

开头（钩子）：制造悬念/引发共鸣/提出问题
正文：层层递进，案例+观点结合
结尾：总结升华，互动引导/转发激励"
              rows={15}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {articleContent.length} 字（约 {Math.round(articleContent.length / 600)} 分钟阅读）
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WechatArticleWriter;
