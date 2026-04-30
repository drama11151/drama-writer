import { useState } from 'react';
import { LayoutGrid, CheckCircle2, ChevronRight, Clapperboard, Film, Tv, Mic, Palette, Headphones, Projector, BookOpen, BookText, PenLine, Pencil, Flower2, Music, Theater, Scroll, Target, Smile, Mic2, Briefcase, Smartphone, Volume2, Sparkle, Video, Lightbulb, Home } from 'lucide-react';

export type WritingFormat = 
  | 'short-drama' | 'movie' | 'tv-drama' | 'variety' | 'microfilm' | 'anime' | 'audio-drama' | 'documentary'
  | 'novel' | 'medium-story' | 'short-story' | 'micro-fiction'
  | 'poetry' | 'lyrics' | 'stage-play' | 'prose'
  | 'fairy-tale' | 'fable' | 'crosstalk' | 'sketch'
  | 'speech' | 'brand-story' | 'wechat-article' | 'advertising';

interface FormatSelectorProps {
  selectedFormat: WritingFormat | null;
  onFormatChange: (format: WritingFormat | null) => void;
}

// 根据创作形式返回动态的提示信息
const getFormatHint = (format: WritingFormat | null): { title: string; subtitle: string; icon: any } => {
  const hints: Record<WritingFormat, { title: string; subtitle: string; icon: any }> = {
    'short-drama': { title: '短剧剧本', subtitle: '竖屏短剧 · 70-80集 · 每集1-3分钟', icon: Clapperboard },
    'movie': { title: '电影剧本', subtitle: '90-120分钟 · 三幕结构', icon: Film },
    'tv-drama': { title: '电视剧', subtitle: '多集连续剧 · 每集45分钟', icon: Tv },
    'variety': { title: '综艺节目', subtitle: '娱乐/竞演/脱口秀', icon: Mic },
    'microfilm': { title: '微电影', subtitle: '短视频 · 5-15分钟', icon: Video },
    'anime': { title: '动漫剧本', subtitle: '动画剧本 · 分集连载', icon: Palette },
    'audio-drama': { title: '广播剧', subtitle: '纯音频 · 声音表演', icon: Headphones },
    'documentary': { title: '纪录片', subtitle: '真实记录 · 专题片', icon: Projector },
    'novel': { title: '长篇小说', subtitle: '百万字连载 · 起点/晋江', icon: BookOpen },
    'medium-story': { title: '中篇小说', subtitle: '3-10万字 · 完整故事', icon: BookText },
    'short-story': { title: '短篇小说', subtitle: '1-3万字 · 精炼叙事', icon: PenLine },
    'micro-fiction': { title: '微型小说', subtitle: '千字以内 · 精巧构思', icon: Pencil },
    'poetry': { title: '诗词创作', subtitle: '古体/近体/现代诗', icon: Flower2 },
    'lyrics': { title: '歌词创作', subtitle: '流行/民谣/说唱', icon: Music },
    'stage-play': { title: '话剧剧本', subtitle: '舞台表演 · 对话驱动', icon: Theater },
    'prose': { title: '散文随笔', subtitle: '抒情/叙事/议论', icon: Scroll },
    'fairy-tale': { title: '童话故事', subtitle: '儿童文学 · 寓教于乐', icon: Home },
    'fable': { title: '寓言故事', subtitle: '哲理短文 · 借事喻理', icon: Lightbulb },
    'crosstalk': { title: '相声剧本', subtitle: '传统曲艺 · 对口/单口', icon: Target },
    'sketch': { title: '小品剧本', subtitle: '喜剧小品 · 笑点密集', icon: Smile },
    'speech': { title: '演讲稿', subtitle: '激励/致辞/辩论', icon: Mic2 },
    'brand-story': { title: '品牌故事', subtitle: '企业文化 · 品牌传播', icon: Briefcase },
    'wechat-article': { title: '微信文章', subtitle: '新媒体运营 · 爆款文案', icon: Smartphone },
    'advertising': { title: '广告文案', subtitle: '品牌/产品/短视频脚本', icon: Volume2 },
  };
  
  if (format && hints[format]) {
    return hints[format];
  }
  return { title: '选择创作形式', subtitle: '根据您的创作需求选择合适的创作类型', icon: Sparkle };
};

// 各格式标准写作模板
const FORMAT_TEMPLATES: Record<WritingFormat, { name: string; category: string; description: string; structure: string[]; tips: string[] }> = {
  'short-drama': {
    name: '短剧剧本',
    category: '视频类',
    description: '竖屏短剧，每集1-3分钟，70-80集，适合抖音/快手平台',
    structure: [
      '【场景标头】时间+地点+人物',
      '【对白/独白】角色台词',
      '【动作提示】（括号内的动作描述）',
      '【转折钩子】每集结尾留悬念',
    ],
    tips: ['每集结尾留钩子', '70-80集节奏：第1-20集觉醒，第21-40集对抗，第41-55集扩张，第56-70集终章', '单集字数800-1200字', '强情绪、强反转、快节奏'],
  },
  'web-novel': {
    name: '网文小说',
    category: '文字类',
    description: '长篇连载网络小说，百万字起步，适合起点/晋江/番茄',
    structure: [
      '【书名/简介】核心卖点一句话',
      '【世界观】力量体系/社会设定',
      '【人物小传】主角+核心配角',
      '【章纲】每10章一个大情节点',
      '【正文】每章2000-3000字',
    ],
    tips: ['开篇黄金三章定生死', '每章结尾留钩子', '保持日更4000字以上', '核心爽点要密集'],
  },
  'movie': {
    name: '电影剧本',
    category: '视频类',
    description: '院线电影剧本，90-120分钟，分幕结构清晰',
    structure: [
      '【场景标头】INT./EXT. 时间 地点',
      '【场景描述】画面内容',
      '【对白】角色名：台词',
      '【动作提示】（镜头指示）',
    ],
    tips: ['三幕结构：建置(1-30页)、对抗(30-90页)、解决(90-120页)', '每10页一个情节点', '主题明确，一条主线贯穿', '人物弧光完整'],
  },
  'tv-drama': {
    name: '电视剧剧本',
    category: '视频类',
    description: '电视剧剧本，45分钟/集，20-40集，卫视或流媒体',
    structure: [
      '【集号/集名】第X集',
      '【场景标头】日内/夜外 场景名',
      '【场号】场景序号',
      '【场景描述】画面+动作',
      '【对白/独白】',
      '【本集重点】本集核心情节点',
    ],
    tips: ['每集建置-对抗-解决结构', '每集开头接上集结尾', '单集3-5个情节点', '季末留大悬念', '集数一般为20/30/40集'],
  },
  'variety': {
    name: '综艺节目',
    category: '综艺类',
    description: '综艺节目脚本，含环节设计、流程控制、嘉宾台词提示',
    structure: [
      '【节目名称】',
      '【环节名称】环节标题',
      '【环节时长】约X分钟',
      '【流程】环节步骤',
      '【主持人台词】',
      '【嘉宾互动】',
      '【规则说明】',
    ],
    tips: ['环节设计要有节奏感', '预留广告插入点', '每环节5-10分钟', '嘉宾要有互动点', '笑点/泪点/燃点分布'],
  },
  'microfilm': {
    name: '微电影',
    category: '视频类',
    description: '5-30分钟短片，适合网络平台，成本低，时长短',
    structure: [
      '【片名】',
      '【时长】X分钟',
      '【类型】',
      '【故事概述】1-2段',
      '【人物】主角/配角简介',
      '【场景标头】时间 地点',
      '【正文】场景描述+对白',
    ],
    tips: ['5-30分钟内讲完完整故事', '主题鲜明，一条主线', '人物不宜超过3个', '结尾有回味或反转', '开头3分钟抓住观众'],
  },
  'prose': {
    name: '散文',
    category: '文学类',
    description: '文学散文，记叙/议论/抒情三大类，形散神聚',
    structure: [
      '【标题】',
      '【开头】起——引入场景或话题',
      '【正文】承上启下，托物言志/借景抒情',
      '【高潮】情感或思想最浓烈处',
      '【结尾】合——点题升华，卒章显志',
    ],
    tips: ['形散神聚，线索清晰', '语言优美，意境深远', '情感真挚，避免空洞', '首尾呼应，点题升华', '500-2000字为宜'],
  },
  'poetry': {
    name: '诗词',
    category: '文学类',
    description: '古典诗词或现代诗歌，有韵律节奏或自由体',
    structure: [
      '【标题】',
      '【格式】古体/近体/词牌/现代诗',
      '【韵脚】韵部',
      '【正文】按格律或意象展开',
      '【注释】生僻字词解释（可选）',
    ],
    tips: ['古体诗不限格律，近体诗需押平仄', '起承转合，情景交融', '意象选取要典型', '现代诗自由但需有节奏感', '情感要真挚，语言要精炼'],
  },
  'lyrics': {
    name: '歌词',
    category: '歌词类',
    description: '歌曲歌词，含主歌/副歌/桥段，有韵律和流行性',
    structure: [
      '【歌名】',
      '【风格】流行/摇滚/民谣/说唱',
      '【主歌A1】叙事或铺垫，4-8句',
      '【副歌Hook】高潮记忆点，4-6句',
      '【主歌A2】递进或转折',
      '【副歌Hook】重复或变体',
      '【桥段Bridge】情绪爆发或转折',
      '【尾声】结束句',
    ],
    tips: ['副歌要有记忆点（Hook）', '韵脚统一或自然变换', '主歌铺垫，副歌爆发', '歌词押韵朗朗上口', '长度2-5分钟'],
  },
  'stage-play': {
    name: '话剧剧本',
    category: '戏剧类',
    description: '舞台戏剧剧本，注重台词和舞台指示',
    structure: [
      '【剧名】',
      '【人物】角色表',
      '【第一幕/场】场景标头',
      '【舞台指示】布景、道具、灯光',
      '【台词】角色名：台词',
      '【幕间】幕间休息提示',
    ],
    tips: ['台词是核心，动作要配合', '场景不宜过多（控制成本）', '人物台词要符合性格', '注意戏剧冲突', '一般2-3幕'],
  },
  'anime': {
    name: '动画剧本',
    category: '视频类',
    description: '动画剧本，含画面描述和配音指示，适合动画制作',
    structure: [
      '【集号/片名】',
      '【时长】24分钟/11分钟等',
      '【画面描述】动画画面内容',
      '【配音提示】角色：台词（语气指示）',
      '【音效/音乐提示】',
      '【分镜注释】（可选）',
    ],
    tips: ['画面要具体可执行', '分镜脚本决定动画制作成本', '配音语气要有提示', '注意动画与实拍的区别', '儿童向/成人向定位清晰'],
  },
  'audio-drama': {
    name: '广播剧',
    category: '戏剧类',
    description: '纯音频广播剧，靠声音叙事，无画面',
    structure: [
      '【剧名】',
      '【集号】',
      '【场景标头】时间 地点 环境声',
      '【音效提示】【SFX】环境/动作/转场音效',
      '【BGM提示】【BGM】背景音乐',
      '【台词】角色：台词',
      '【独白/旁白】叙述性台词',
    ],
    tips: ['声音是唯一媒介', '环境音效要丰富', '角色声音要有辨识度', '旁白辅助叙事', '时长一般10-30分钟'],
  },
  'documentary': {
    name: '纪录片',
    category: '视频类',
    description: '纪实性视频节目，真实素材为主，可有旁白和访谈',
    structure: [
      '【片名】',
      '【类型】自然/人文/历史/社会/科技',
      '【时长】一般45-90分钟',
      '【主题】核心观点一句话',
      '【结构】线性/多线性/主题块',
      '【素材】实拍画面/档案/访谈/动画',
      '【旁白】解说词',
    ],
    tips: ['真实性是第一原则', '主题鲜明，有社会价值', '素材要丰富多样', '旁白要简洁有力', '叙事要有节奏感', '画面和解说相辅相成'],
  },
  'novel': {
    name: '长篇小说',
    category: '小说类',
    description: '长篇叙事文学，20万字以上，适合出版或长篇连载',
    structure: [
      '【书名/副标题】',
      '【类型/标签】都市/玄幻/悬疑等',
      '【简介】300字内核心卖点',
      '【世界观设定】力量体系/社会背景',
      '【人物小传】主角+核心配角5-10人',
      '【主线/副线】主要冲突线',
      '【章纲】每卷10-30章，全书50-200章',
    ],
    tips: ['开篇黄金三章定生死', '人物要有成长弧光', '情节要有起伏波折', '每章结尾留钩子', '保持更新节奏稳定', '核心爽点/虐点要密集'],
  },
  'medium-story': {
    name: '中篇小说',
    category: '小说类',
    description: '2-10万字叙事文学，单线叙事为主，适合杂志或单本出版',
    structure: [
      '【标题】',
      '【篇幅】2-10万字',
      '【类型】',
      '【人物】主角+2-4个配角',
      '【情节线】起承转合完整',
      '【核心事件】1-2个主要事件',
    ],
    tips: ['篇幅适中，事件要精选', '人物关系不宜太复杂', '单线叙事更紧凑', '开头要吸引人', '结尾要有回味', '情感要真挚动人'],
  },
  'short-story': {
    name: '短篇小说',
    category: '小说类',
    description: '5千-2万字短篇，一人一事，结尾往往有反转或留白',
    structure: [
      '【标题】',
      '【篇幅】5千-2万字',
      '【人物】1-3个主要人物',
      '【事件】一个核心事件',
      '【主题】一句话核心立意',
    ],
    tips: ['篇幅精炼，一人一事', '开头要抓人', '结尾要有意外或留白', '不写废话，字字珠玑', '立意要深刻', '可借鉴欧亨利式结尾'],
  },
  'micro-fiction': {
    name: '微小说',
    category: '小说类',
    description: '1500字以内的超短篇，极度精炼，结尾反转或留白',
    structure: [
      '【标题】（可选）',
      '【篇幅】1500字以内',
      '【人物】1-2人',
      '【事件】一个瞬间或片段',
    ],
    tips: ['惜字如金', '开头即冲突', '结尾要出人意料', '大量留白', '一句话能改写命运', '适合微博/公众号发布'],
  },
  'fairy-tale': {
    name: '童话',
    category: '儿童文学',
    description: '儿童故事，真善美为主角，常有魔法元素和美好结局',
    structure: [
      '【标题】',
      '【适龄】3-6岁/7-10岁',
      '【主角】拟人化或儿童角色',
      '【配角】正派/反派/辅助',
      '【情节】遇到困难→成长蜕变→获得成功',
      '【主题】善良/勇敢/诚实/友爱',
    ],
    tips: ['语言要儿童化', '情节要简单明了', '善恶分明，结局美好', '可以有魔法但要有代价', '蕴含教育意义', '适合亲子阅读'],
  },
  'fable': {
    name: '寓言',
    category: '儿童文学',
    description: '短小精悍的故事，动物为主角，借事喻理，结尾点明寓意',
    structure: [
      '【标题】',
      '【主角】动物或拟人化角色',
      '【情节】事件发展',
      '【寓意】结尾揭示的道理',
    ],
    tips: ['篇幅极短，50-500字', '动物要有代表性', '寓意要深刻且普世', '故事要生动有趣', '结尾直接点题', '可对比伊索寓言风格'],
  },
  'crosstalk': {
    name: '相声',
    category: '曲艺类',
    description: '传统曲艺形式，对口为主，包袱要密，铺平垫稳',
    structure: [
      '【作品名】',
      '【演员】逗哏/捧哏',
      '【垫话】开场引入',
      '【瓢把儿】过渡段',
      '【正活】核心段子',
      '【底】结尾收束',
    ],
    tips: ['包袱要三翻四抖', '铺平垫稳，不急于抖包袱', '说学逗唱皆可用', '语言要幽默机智', '要有地方文化特色', '经典段子可反复打磨'],
  },
  'sketch': {
    name: '小品',
    category: '曲艺类',
    description: '戏剧小品，5-10分钟，有戏剧冲突，适合舞台或春晚',
    structure: [
      '【作品名】',
      '【演员】3-5人',
      '【时长】5-10分钟',
      '【场景】单一场景为主',
      '【人物】性格鲜明的角色',
      '【冲突】核心矛盾',
      '【转折】情绪爆发点',
      '【结局】欢乐或感人收尾',
    ],
    tips: ['人物要有鲜明性格', '矛盾冲突要集中', '台词要生活化', '煽情要适度', '笑点要自然不尴尬', '结尾要有升华'],
  },
  'speech': {
    name: '演讲稿',
    category: '应用文类',
    description: '口头表达文稿，适合商务/励志/竞选/颁奖等场景',
    structure: [
      '【标题】',
      '【场合】商务/励志/竞选/颁奖/论坛',
      '【时长】5-30分钟',
      '【开头】引人入胜的切入',
      '【正文】2-3个核心观点',
      '【高潮】情感最强烈处',
      '【结尾】号召/升华/呼应开头',
    ],
    tips: ['开头要抓人', '观点要清晰有力', '事例要生动具体', '语言要口语化', '适当重复强调重点', '结尾要有号召力'],
  },
  'brand-story': {
    name: '品牌故事',
    category: '营销文类',
    description: '品牌背书文案，讲述品牌起源/理念/价值观',
    structure: [
      '【品牌名】',
      '【创始人故事】起源',
      '【创立初心】为什么做',
      '【核心价值观】坚持什么',
      '【里程碑事件】关键节点',
      '【未来愿景】使命召唤',
    ],
    tips: ['故事要有情感温度', '真实感比完美重要', '与竞品形成差异化', '便于传播和记忆', '体现品牌调性', '可结合创始人IP'],
  },
  'wechat-article': {
    name: '公众号文章',
    category: '营销文类',
    description: '微信图文消息，标题即流量，正文要有信息增量',
    structure: [
      '【标题】吸引点击',
      '【副标题】补充说明',
      '【开头】引发共鸣/提出问题',
      '【正文】观点+案例+金句',
      '【结尾】总结+行动号召',
      '【配图建议】',
    ],
    tips: ['标题决定打开率', '开头决定阅读完成率', '每段要有信息增量', '适当使用小标题', '金句要便于转发', '排版要简洁美观'],
  },
  'advertising': {
    name: '广告文案',
    category: '营销文类',
    description: '商业广告语/详情页/短视频脚本，追求转化',
    structure: [
      '【产品名】',
      '【卖点提炼】核心优势',
      '【目标人群】痛点需求',
      '【使用场景】',
      '【广告语】主标题slogan',
      '【详情正文】产品介绍',
    ],
    tips: ['一句话说清卖点', '解决用户痛点', '语言要精准有力', '可制造紧迫感', '品牌调性一致', 'A/B测试优化'],
  },
};

// 格式分类
const CATEGORIES: Record<string, WritingFormat[]> = {
  '视频类': ['short-drama', 'movie', 'tv-drama', 'microfilm', 'anime', 'audio-drama', 'documentary'],
  '小说类': ['novel', 'medium-story', 'short-story', 'micro-fiction'],
  '文学类': ['poetry', 'prose', 'fairy-tale', 'fable'],
  '曲艺类': ['stage-play', 'crosstalk', 'sketch'],
  '歌词类': ['lyrics'],
  '营销文类': ['advertising', 'brand-story', 'wechat-article', 'speech'],
};

export default function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  const [activeCategory, setActiveCategory] = useState('视频类');
  const [showTemplate, setShowTemplate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const currentFormats = CATEGORIES[activeCategory] || [];

  // 详情弹窗
  if (showDetail && selectedFormat) {
    const template = FORMAT_TEMPLATES[selectedFormat];
    return (
      <div className="space-y-5">
        {/* 详情面板 */}
        <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 flex items-center gap-2">
            <h3 className="text-white font-semibold">{template.name}</h3>
            <span className="ml-auto text-white/80 text-sm">{template.category}</span>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">格式说明</h4>
              <p className="text-sm text-gray-600 bg-blue-50 rounded-xl px-4 py-3">{template.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">标准格式模板</h4>
              <div className="bg-gray-900 rounded-xl p-4">
                <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                  {template.structure.map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">写作要点</h4>
              <div className="grid grid-cols-1 gap-2">
                {template.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={() => setShowDetail(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 cursor-pointer"
            >
              ← 返回格式选择
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 动态提示面板 */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            {(() => {
              const Hint = getFormatHint(selectedFormat).icon;
              return <Hint className="w-6 h-6 text-white" />;
            })()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-700">
              {selectedFormat ? getFormatHint(selectedFormat).title : '选择创作形式'}
            </h3>
            <p className="text-sm text-gray-600">
              {getFormatHint(selectedFormat).subtitle}
            </p>
          </div>
        </div>
        {selectedFormat && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
              {FORMAT_TEMPLATES[selectedFormat].category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">
              {FORMAT_TEMPLATES[selectedFormat].structure.length}个结构模块
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs">
              {FORMAT_TEMPLATES[selectedFormat].tips.length}个写作要点
            </span>
          </div>
        )}
      </div>

      {/* 视频类 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">视频类</div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES['视频类'].map(format => {
            const info = FORMAT_TEMPLATES[format];
            const isSelected = selectedFormat === format;
            return (
              <button
                key={format}
                onClick={() => onFormatChange(isSelected ? null : format)}
                className={`text-center py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 小说类 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">小说类</div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES['小说类'].map(format => {
            const info = FORMAT_TEMPLATES[format];
            const isSelected = selectedFormat === format;
            return (
              <button
                key={format}
                onClick={() => onFormatChange(isSelected ? null : format)}
                className={`text-center py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 文学类 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">文学类</div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES['文学类'].map(format => {
            const info = FORMAT_TEMPLATES[format];
            const isSelected = selectedFormat === format;
            return (
              <button
                key={format}
                onClick={() => onFormatChange(isSelected ? null : format)}
                className={`text-center py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 曲艺类 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">曲艺类</div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES['曲艺类'].map(format => {
            const info = FORMAT_TEMPLATES[format];
            const isSelected = selectedFormat === format;
            return (
              <button
                key={format}
                onClick={() => onFormatChange(isSelected ? null : format)}
                className={`text-center py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 营销文类 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">营销文类</div>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES['营销文类'].map(format => {
            const info = FORMAT_TEMPLATES[format];
            const isSelected = selectedFormat === format;
            return (
              <button
                key={format}
                onClick={() => onFormatChange(isSelected ? null : format)}
                className={`text-center py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
