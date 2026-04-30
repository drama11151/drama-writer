import { useState } from 'react';
import {
  BookOpen, Video, Play, Search, Star, ShoppingCart,
  ChevronRight, ChevronDown, CheckCircle2, Clock,
  Users, Award, X, FileText, Lightbulb, Layers
} from 'lucide-react';

// ==================== 类型定义 ====================
interface CreationGuide {
  format: string;
  formatName: string;
  formatCategory: string;
  standardFormat: string;
  coreSkills: string[];
  methodology: { step: number; title: string; content: string }[];
  relatedCourseIds: string[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  instructor: string;
  instructorAvatar: string;
  price: number;
  originalPrice: number;
  coverImage: string;
  description: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  tags: string[];
  videoUrl?: string;
  hasVideo: boolean;
  isBought?: boolean;
}

// ==================== 创作指南数据（25种格式全覆盖）====================
const CREATION_GUIDES: CreationGuide[] = [
  {
    format: 'short-drama',
    formatName: '短剧剧本',
    formatCategory: '视频类',
    standardFormat: `【短剧剧本标准格式】

一、封面信息
- 剧名：《XXXX》
- 集数：第X集
- 时长：1-3分钟
- 类型：闪婚甜宠/打脸虐渣/战神/霸总...

二、场景标头
格式：内/外 · 场景地点 · 时间
示例：内·总裁办公室·日

三、场景内容
△动作描述（△开头，描述角色动作和表情）
【旁白/内心独白】（可选）

角色对白（加粗）：具体台词内容。

四、集末钩子
- 悬念设置
- 情绪高点
- 引导点击`,
    coreSkills: [
      '前3秒必须制造冲突或反转，吸引观众停留',
      '每30秒设置一个情绪爆点，维持观众注意力',
      '结尾留悬念，钩子要硬，让观众想看下一集',
      '人物性格要鲜明，一两句话就能让观众记住',
      '台词要口语化、生活化，避免书面语'
    ],
    methodology: [
      { step: 1, title: '确定题材赛道', content: '选择热门题材类型（闪婚/打脸/战神等），研究同类爆款短剧的核心冲突模式' },
      { step: 2, title: '设计核心人设', content: '主角要有明确的目标和困境，反派要有合理的作恶动机，配角要有独特的功能定位' },
      { step: 3, title: '搭建故事骨架', content: '按照"冲突→误会→反转→高潮→钩子"的节奏设计每集，确保情节推进迅速' },
      { step: 4, title: '写出第一集', content: '前3秒必须有爆点，结尾留悬念，第一集决定观众是否会继续看' },
      { step: 5, title: '批量生产', content: '保持更新频率，建立自己的故事素材库，形成可持续的创作节奏' }
    ],
    relatedCourseIds: ['c1', 'c2']
  },
  {
    format: 'movie',
    formatName: '电影剧本',
    formatCategory: '视频类',
    standardFormat: `【电影剧本标准格式】

一、封面信息
- 片名：《XXXX》
- 编剧：XXX
- 日期：XXXX年XX月

二、场景标头
格式：场景编号. 内/外·场景地点·时间
示例：1. 内·咖啡厅·日

三、场景描写
描述视觉画面、空间环境、光线氛围、人物动作。

四、对白格式
角色名（居中加粗）
对白内容（左对齐，与角色名同页，不可跨页）

五、镜头指示
- 推/拉/摇/移/跟/俯/仰
- 特写/全景/中景/近景

六、过渡指示
叠化、淡入淡出、切换`,
    coreSkills: [
      '开篇10分钟必须抓住观众，建立核心冲突或悬念',
      '人物弧光要完整，主角必须经历内在和外在的双重变化',
      '每场戏必须有存在的理由，不能推动情节或揭示人物的戏要删掉',
      '对白要潜台词充足，好的对白是"说A指B"',
      '结局要满足观众的情感期待，同时要有新意'
    ],
    methodology: [
      { step: 1, title: '找到核心主题', content: '先问自己：我想通过这个故事表达什么？这是整个剧本的灵魂' },
      { step: 2, title: '设计主角弧光', content: '主角从A状态到B状态，中间的转变就是故事的核心' },
      { step: 3, title: '搭建三幕结构', content: '第一幕建置（25%）、第二幕对抗（50%）、第三幕解决（25%）' },
      { step: 4, title: '写分场大纲', content: '按场景列出所有情节点，确保节奏和冲突分布均匀' },
      { step: 5, title: '逐场写作', content: '从第一场开始写，不要等"灵感来了"再写' },
      { step: 6, title: '修改润色', content: '初稿写完后放几天再改，重点检查节奏、人物、对白' }
    ],
    relatedCourseIds: ['c3', 'c4']
  },
  {
    format: 'tv-drama',
    formatName: '电视剧剧本',
    formatCategory: '视频类',
    standardFormat: `【电视剧剧本标准格式】

一、封面信息
- 剧名：《XXXX》
- 集数：第X集（共XX集）
- 本集梗概：（100字以内）

二、场景标头
同电影剧本格式

三、场次内容
△动作描写
角色对白（加粗）
【画外音】（可选）

四、集末钩子
- 本集核心事件
- 集末悬念
- 下集预告`,
    coreSkills: [
      '主线贯穿全剧，每集都要推进主线情节点',
      '单集要有独立的起承转合，同时是整部剧大情节的一部分',
      '人物关系要有化学反应，CP感是观众追剧的动力',
      '每集结尾要有钩子，让观众想看下一集',
      '控制节奏，不要在一个情节点上拖太久'
    ],
    methodology: [
      { step: 1, title: '确定剧集定位', content: '目标受众、播出平台、集数规模，决定剧本的整体基调' },
      { step: 2, title: '设计核心冲突', content: '找到贯穿全剧的主线冲突，这是观众追剧的核心动力' },
      { step: 3, title: '规划人物关系网', content: '主角与反派、主角与搭档、反派内部等，关系越复杂越好写' },
      { step: 4, title: '写分集大纲', content: '每集至少3个情节点，规划好每集的节奏和情感走向' },
      { step: 5, title: '分配集数', content: '主线剧情占60%，支线剧情占30%，留10%给意外惊喜' },
      { step: 6, title: '逐集写作', content: '保持稳定的更新节奏，注意前后集的衔接' }
    ],
    relatedCourseIds: ['c3', 'c5']
  },
  {
    format: 'novel',
    formatName: '长篇小说',
    formatCategory: '小说类',
    standardFormat: `【长篇小说标准格式】

一、封面
- 书名
- 作者
- 类型/标签

二、目录结构
卷一：起源（1-30章）
卷二：崛起（31-60章）
卷三：终章（61-80章）

三、章节格式
第X章 章名
正文内容（每段首行缩进2字符）

四、视角
第一人称/第三人称全知/第三人称限知

五、对话格式
"对白内容。"角色说。
或：
角色开口："对白内容。"`,
    coreSkills: [
      '开篇3万字必须留住读者，前10章决定读者会不会追下去',
      '主线清晰，支线丰富，但支线要服务于主线',
      '人物要有成长，不能从头到尾一成不变',
      '节奏把控：打脸爽点、情感高潮、悬念揭露要穿插分布',
      '建立世界观规则，一旦建立不能随意打破'
    ],
    methodology: [
      { step: 1, title: '确定类型和平台', content: '不同平台读者喜好不同，明确目标平台和读者群体' },
      { step: 2, title: '设计核心卖点', content: '一句话能说清楚的核心看点，是爆款的关键' },
      { step: 3, title: '搭建世界观', content: '如果涉及架空/穿越/异世界，需要先建立完整的世界规则' },
      { step: 4, title: '设计人物弧光', content: '主角的成长路线要清晰，每个重要配角的弧光也要设计' },
      { step: 5, title: '写细纲', content: '按章节列出每章的核心情节点和字数目标' },
      { step: 6, title: '保持更新', content: '稳定更新是积累读者的关键，日更4000字是基本门槛' }
    ],
    relatedCourseIds: ['c6', 'c7']
  },
  {
    format: 'poetry',
    formatName: '诗词',
    formatCategory: '文学类',
    standardFormat: `【诗词标准格式】

一、格律选择
- 古体诗：不要求格律
- 近体诗：五言/七言，绝句/律诗
- 词：选择词牌名，遵守词谱格律
- 曲：散曲小令

二、格式要素
标题
（可选小序）

正文
（注意对仗、平仄、押韵）

三、词牌格式示例（沁园春）
上阙：四、四、四、四、三、三、四（押韵）
下阙：同结构

四、标注
- 押韵位置（仄声/平声）
- 入声字标注`,
    coreSkills: [
      '意境第一，形式第二，不要为了格律牺牲诗意',
      '善用意象，"山"不直接说山，用"峰"、"峦"、"岭"变化',
      '炼字要准，一个字能改就别用两个',
      '起句要有画面感，承句要推进情绪',
      '转句要出人意料，合句要有余韵'
    ],
    methodology: [
      { step: 1, title: '确定情感内核', content: '先想清楚你要表达什么情感：思乡、怀人、咏物、言志...' },
      { step: 2, title: '选择形式', content: '根据情感选择合适的体裁：豪放用词/婉约用词牌/沉思用五律' },
      { step: 3, title: '确定意象', content: '选择2-3个核心意象贯穿全篇，形成意象群' },
      { step: 4, title: '谋篇布局', content: '起承转合，每句各司其职' },
      { step: 5, title: '炼字打磨', content: '逐字推敲，追求"语意双关"的境界' },
      { step: 6, title: '朗读检验', content: '读出来不通顺的地方一定有问题' }
    ],
    relatedCourseIds: ['c8', 'c9']
  },
  {
    format: 'lyrics',
    formatName: '歌词',
    formatCategory: '文学类',
    standardFormat: `【歌词标准格式】

一、基础信息
- 歌名
- 风格：流行/摇滚/民谣/R&B/说唱...
- BPM：（可选）
- 调式：（可选）

二、段落结构
【前奏】
【主歌1】Verse 1
【主歌2】Verse 2
【副歌】Chorus（Hook）
【过渡/Bridge】
【副歌】Chorus
【尾声】

三、格式规范
- 每句一行
- 段与段之间空行
- 对齐格式要统一
- 押韵位置标注（可选）`,
    coreSkills: [
      'Hook（副歌）是灵魂，一句让人记住的旋律和词',
      '主歌铺垫，副歌爆发，节奏要把握好',
      '歌词要有画面感，让人"看见"你在唱什么',
      '押韵不要太刻意，自然流畅比押韵更重要',
      '共鸣是关键，写"大家都知道但没说出口"的情感'
    ],
    methodology: [
      { step: 1, title: '确定歌曲主题', content: '想表达什么情感或故事？这是整首歌的核心' },
      { step: 2, title: '设计Hook', content: '先想好副歌那句最抓人的歌词和旋律' },
      { step: 3, title: '规划结构', content: '主歌2段+副歌2段+桥段，设计好段落长度' },
      { step: 4, title: '写主歌', content: '用具体细节描写场景和情绪，不要空洞' },
      { step: 5, title: '写副歌', content: '用最直接、最有力的语言表达核心情感' },
      { step: 6, title: '打磨细节', content: '检查押韵、口语化程度、情感连贯性' }
    ],
    relatedCourseIds: ['c10', 'c11']
  },
  {
    format: 'documentary',
    formatName: '纪录片',
    formatCategory: '视频类',
    standardFormat: `【纪录片标准格式】

一、项目信息
- 片名
- 类型：人文/自然/历史/社会...
- 时长
- 目标受众

二、主题定位
- 核心主题
- 社会价值
- 观众共鸣点

三、结构设计
【开场】
吸引注意力的开场方式

【主体段落】
段落1：主题引入
段落2：核心内容
段落3：深度挖掘
...

【结尾】
升华主题，呼唤行动

四、解说词格式
[画面描述]
（解说词内容）

五、素材清单
- 实地拍摄
- 历史影像
- 图文资料
- 专家访谈`,
    coreSkills: [
      '真实是纪录片的生命，不能为了戏剧性虚构内容',
      '主题要鲜明，100分钟讲清楚一个问题比30分钟讲三个问题好',
      '用故事化的手法拍纪录片，采访+画面+解说词三位一体',
      '开头决定观众会不会看下去，要有冲击力或悬念感',
      '结尾要升华，让观众带着思考离开'
    ],
    methodology: [
      { step: 1, title: '确定选题', content: '选择有社会价值、观众关心、有拍摄可行性的题材' },
      { step: 2, title: '前期调研', content: '深入了解选题，阅读相关资料，采访关键人物' },
      { step: 3, title: '设计结构', content: '确定叙事线索和段落划分，规划好每一段的节奏' },
      { step: 4, title: '撰写脚本', content: '写好解说词，设计好采访问题和画面衔接' },
      { step: 5, title: '拍摄素材', content: '按照脚本拍摄，同时保持对意外发现的敏感' },
      { step: 6, title: '后期剪辑', content: '用画面讲故事，解说词是辅助，画面本身要能说话' }
    ],
    relatedCourseIds: ['c12']
  },
  {
    format: 'advertising',
    formatName: '广告文案',
    formatCategory: '营销文类',
    standardFormat: `【广告文案标准格式】

一、策略层
- 品牌/产品名称
- 目标受众
- 核心卖点
- 行动号召（CTA）

二、创意层
- 主标题：（核心诉求，一句话）
- 副标题：（补充说明）
- 正文：（详细描述）
- 尾注：（可选，法律/限制信息）

三、投放渠道
- 信息流广告
- 户外广告
- TVC
- 社交媒体

四、创意公式
AIDA：注意→兴趣→欲望→行动
或
PAS：问题→ agitation → 解决方案`,
    coreSkills: [
      '3秒法则：用户只会给广告3秒钟，必须立刻说重点',
      '痛点+解决方案是最有效的广告逻辑',
      '卖点要单一，一次只传达一个核心信息',
      '行动号召要明确，告诉用户下一步做什么',
      '语言要口语化，用户视角而不是品牌视角'
    ],
    methodology: [
      { step: 1, title: '了解产品/品牌', content: '深入了解产品特点、优势、使用场景、目标用户' },
      { step: 2, title: '明确传播目标', content: '是品牌曝光、产品销售还是用户留存？目标决定策略' },
      { step: 3, title: '找准用户痛点', content: '用户最关心什么？最担心什么？最想要什么？' },
      { step: 4, title: '提炼核心卖点', content: '从N个卖点中找到那个最能打动用户的"唯一卖点"' },
      { step: 5, title: '写出初稿', content: '按照AIDA或PAS公式，完整写出各层级文案' },
      { step: 6, title: '测试优化', content: 'A/B测试不同版本，选择效果最好的' }
    ],
    relatedCourseIds: ['c13', 'c14']
  },
  {
    format: 'crosstalk',
    formatName: '相声',
    formatCategory: '曲艺类',
    standardFormat: `【相声剧本标准格式】

一、基本信息
- 节目名称
- 类型：对口/单口/群口
- 时长

二、人物设定
- 甲（逗哏）
- 乙（捧哏）

三、结构设计
【垫话】（开场暖场，与正活相关）
【瓢把儿】（过渡到正活）
【正活】（核心包袱段落）
【底】（最后的大包袱，收束全篇）

四、包袱类型
- 生理性包袱（打嗝、放屁...）
- 伦理包袱（我是你爸爸...）
- 谐音包袱（同音字替换）
- 反转包袱（意料之外）
- 三番四抖（铺垫→递进→反转→抖开）`,
    coreSkills: [
      '铺平垫稳，三番四抖，包袱要有节奏感',
      '逗哏负责抖，捧哏负责捧，分工要明确',
      '语言要生动鲜活，多用生活化的细节',
      '内容要有内涵，笑完之后有回味更好',
      '注意尺度，避免触碰敏感话题'
    ],
    methodology: [
      { step: 1, title: '确定相声类型', content: '传统段子改编/新编时事/原创故事...' },
      { step: 2, title: '设计核心笑点', content: '先想好"底"是什么，反向推导整个结构' },
      { step: 3, title: '写垫话', content: '用观众熟悉的话题暖场，自然过渡到正活' },
      { step: 4, title: '铺包袱', content: '按三番四抖的节奏铺垫，不能太早抖开' },
      { step: 5, title: '写捧哏台词', content: '捧哏的接话要精准，起到"翻"的作用' },
      { step: 6, title: '反复试演', content: '相声是舞台艺术，必须现场试演才能检验效果' }
    ],
    relatedCourseIds: ['c15']
  },
  {
    format: 'micro-fiction',
    formatName: '微小说',
    formatCategory: '小说类',
    standardFormat: `【微小说标准格式】

一、字数限制
通常200-500字，极端可至几十字

二、结构要求
起（建立场景）
承（推进情节）
转（核心反转）
合（戛然而止，留白）

三、写作要点
- 开篇就要抓人，第一句话决定读者会不会继续读
- 结尾反转要有力，但不是刻意反转
- 留白比说透更有效
- 细节描写替代长篇大论
- 一句话可以是一个段落`,
    coreSkills: [
      '字数限制是优势也是挑战，每个字都要有用',
      '开头第一句话就要抓住读者，没有第二机会',
      '反转要合理又意外，让读者惊呼"原来如此"',
      '留白比说透更有力量，给读者想象空间',
      '情感要真实，虚构的夸张要服务于情感真实'
    ],
    methodology: [
      { step: 1, title: '捕捉灵感', content: '一个画面、一个对话、一个念头，都可以成为微小说的种子' },
      { step: 2, title: '确定核心', content: '一句话说清楚你的故事要表达什么' },
      { step: 3, title: '设计反转', content: '想好结尾的反转是什么，这是微小说的灵魂' },
      { step: 4, title: '快速写作', content: '一气呵成，不要回头修改，写完再说' },
      { step: 5, title: '删减优化', content: '每个字都问一遍：这句话删掉会损失什么？' },
      { step: 6, title: '放一放再读', content: '24小时后再读，很多问题会显现出来' }
    ],
    relatedCourseIds: ['c6', 'c16']
  },
  {
    format: 'fairy-tale',
    formatName: '童话',
    formatCategory: '文学类',
    standardFormat: `【童话标准格式】

一、基本信息
- 故事名称
- 目标年龄段（3-6岁/7-10岁/亲子）
- 故事类型：成长/冒险/亲情/友情...

二、角色设定
- 主角：（性格特点、面临的挑战）
- 配角：（帮助者/对立者）
- 反派：（障碍来源）

三、故事结构
【开头】介绍主人公和ta面临的问题
【经过】遇到帮助者，经历冒险/挑战
【高潮】最危险的时刻
【结尾】问题解决，获得成长/领悟

四、语言特点
- 简洁易懂
- 生动形象
- 善用拟人、夸张
- 避免复杂句式`,
    coreSkills: [
      '主题要正向积极，传递正确的价值观',
      '语言要符合目标年龄，太难或太简单都不行',
      '角色要有成长，从遇到问题到解决问题',
      '善用拟人手法，动植物、玩具都可以是主角',
      '故事要有趣味性，用幽默化解紧张'
    ],
    methodology: [
      { step: 1, title: '确定目标读者', content: '写给谁看？不同年龄段需要不同的语言和主题深度' },
      { step: 2, title: '设计核心主题', content: '想传递什么道理或价值观？这是故事的灵魂' },
      { step: 3, title: '创造角色', content: '主角要有缺点也有优点，配角要有功能' },
      { step: 4, title: '设计困难', content: '主角要面对什么挑战？这是故事的动力' },
      { step: 5, title: '讲述故事', content: '用孩子听得懂的语言讲完整个故事' },
      { step: 6, title: '检验效果', content: '讲给目标年龄段的孩子听，看他们的反应' }
    ],
    relatedCourseIds: ['c17']
  },
  {
    format: 'speech',
    formatName: '演讲稿',
    formatCategory: '营销文类',
    standardFormat: `【演讲稿标准格式】

一、演讲信息
- 演讲主题
- 演讲场合
- 时长要求
- 目标受众

二、结构设计
【开场】（30秒-1分钟）
- 问好
- 自我介绍（可选）
- 切入主题（故事/数据/问题）

【主体】（核心内容）
- 观点1 + 论证
- 观点2 + 论证
- 观点3 + 论证

【结尾】
- 总结核心观点
- 升华主题
- 行动号召
- 致谢

三、语言特点
- 口语化
- 短句为主
- 多用排比
- 留有停顿标记`,
    coreSkills: [
      '开场30秒决定全场氛围，可以用故事、数据、问题切入',
      '核心观点不要超过3个，多了听众记不住',
      '每个观点要有故事或案例支撑，空洞的说教没人听',
      '结尾要有力量，让听众带着情绪离开',
      '写完之后要大声朗读，读不通顺的地方要改'
    ],
    methodology: [
      { step: 1, title: '明确目标', content: '你想让听众听完之后做什么？想/信/做什么？' },
      { step: 2, title: '了解听众', content: '他们的痛点是什么？关心什么？' },
      { step: 3, title: '设计结构', content: '按"问题-解决方案"或"过去-现在-未来"组织' },
      { step: 4, title: '准备故事', content: '每个核心观点配一个故事或案例' },
      { step: 5, title: '写初稿', content: '先完整写出来，不用管语言' },
      { step: 6, title: '朗读打磨', content: '大声朗读，调整语感，删减冗余' }
    ],
    relatedCourseIds: ['c18']
  },
  {
    format: 'wechat-article',
    formatName: '公众号文章',
    formatCategory: '营销文类',
    standardFormat: `【公众号文章标准格式】

一、基础信息
- 标题：（决定打开率）
- 副标题：（可选，补充说明）
- 作者：（可选）
- 发布时间

二、内容结构
【开头】（决定完读率）
- 痛点场景
- 引发共鸣
- 引出主题

【正文】
- 核心内容分点阐述
- 每个观点配案例/数据
- 适当配图

【结尾】
- 总结要点
- 互动引导（评论区）
- 转发引导

三、排版规范
- 段落不超过5行
- 多用小标题
- 重点内容加粗
- 留白要充足`,
    coreSkills: [
      '标题决定打开率，花70%的时间写一个好标题',
      '开头300字决定完读率，开头要抓人',
      '内容要有干货，让读者觉得"有用"或"有趣"',
      '配图要精美，与内容相关',
      '结尾要有互动引导，评论区是运营重点'
    ],
    methodology: [
      { step: 1, title: '确定选题', content: '结合热点、用户需求、自身擅长选一个话题' },
      { step: 2, title: '收集素材', content: '案例、数据、金句、图片都提前准备好' },
      { step: 3, title: '设计结构', content: '按"是什么-为什么-怎么办"或"故事-感悟"组织' },
      { step: 4, title: '写开头', content: '用痛点、故事或悬念开头，吸引读者读下去' },
      { step: 5, title: '填充内容', content: '按结构填充内容，注意段落的节奏' },
      { step: 6, title: '优化标题', content: '写10个标题选1个，选择打开率最高的' }
    ],
    relatedCourseIds: ['c19']
  },
  {
    format: 'microfilm',
    formatName: '微电影',
    formatCategory: '视频类',
    standardFormat: `【微电影剧本标准格式】

一、项目信息
- 片名
- 时长（通常5-30分钟）
- 类型
- 目标平台

二、场景标头
同电影剧本格式

三、场次内容
△动作描写
角色对白
【音效/音乐】（可选）

四、特殊标注
- 特效镜头
- 关键道具
- 情绪提示

五、技术参数
- 拍摄方式
- 场景数量
- 演员数量`,
    coreSkills: [
      '时长有限，每一秒都要充分利用',
      '主题要单一，30分钟讲清楚一个问题',
      '情感要真挚，微电影靠情感打动人',
      '画面要有电影感，即使是小成本也要注意构图',
      '结尾要有回味，让观众记住'
    ],
    methodology: [
      { step: 1, title: '确定主题', content: '想通过这个故事表达什么？情感要真实' },
      { step: 2, title: '设计故事', content: '用"一句话故事"概括整个微电影' },
      { step: 3, title: '规划场景', content: '微电影场景不宜过多，控制在10个以内' },
      { step: 4, title: '写剧本', content: '保持节奏感，不要拖沓' },
      { step: 5, title: '后期剪辑', content: '剪辑是微电影的第二次创作' }
    ],
    relatedCourseIds: ['c3', 'c20']
  },
  {
    format: 'stage-play',
    formatName: '话剧剧本',
    formatCategory: '曲艺类',
    standardFormat: `【话剧剧本标准格式】

一、基本信息
- 剧目名称
- 编剧
- 首演时间

二、角色表
角色名：（性格简介）
角色名：（性格简介）

三、幕场结构
第一幕
第一场
【舞台指示】
【场景描述】

【角色对白】（居中加粗）

四、舞台指示
- 布景说明
- 灯光提示
- 道具清单
- 演员上下场

五、幕间隔
（幕间休息X分钟）`,
    coreSkills: [
      '戏剧是"冲突的艺术"，没有冲突就没有戏',
      '人物对白要性格化，不同角色说话方式要不同',
      '舞台指示要具体，让导演和演员知道你的意图',
      '台词要有潜台词，有言外之意更好',
      '注意上下场的逻辑，角色为什么上场、为什么下场'
    ],
    methodology: [
      { step: 1, title: '确定主题', content: '想通过这个戏表达什么？这是戏剧的灵魂' },
      { step: 2, title: '设计冲突', content: '找到核心戏剧冲突，这是全剧的动力' },
      { step: 3, title: '设计人物', content: '每个角色都要有欲望和障碍' },
      { step: 4, title: '规划幕场', content: '按戏剧结构规划好每幕每场的内容' },
      { step: 5, title: '写台词', content: '用角色的声音说话，不是作者的声音' },
      { step: 6, title: '添加舞台指示', content: '写清楚场景、动作、情绪要求' }
    ],
    relatedCourseIds: ['c21']
  },
  {
    format: 'sketch',
    formatName: '小品',
    formatCategory: '曲艺类',
    standardFormat: `【小品剧本标准格式】

一、基本信息
- 小品名称
- 演员人数
- 类型：喜剧/温情/讽刺

二、人物设定
角色名：（性格特点）
角色名：（性格特点）

三、场景设定
时间、地点、环境

四、剧本格式
【舞台指示】
△动作描写

人物对白（加粗）
（括号内：表情/动作提示）

五、节奏提示
- 开场（前1分钟）
- 发展（2-3分钟）
- 高潮（1-2分钟）
- 结尾（煽情/反转）`,
    coreSkills: [
      '开场30秒要抓住观众，可以用"意料之外"的方式',
      '喜剧小品：笑点要密集，每30秒一个小高潮',
      '温情小品：煽情点要精准，不能硬煽',
      '人物关系要简单清晰，复杂了演不过来',
      '结尾要有力量，无论是笑还是泪'
    ],
    methodology: [
      { step: 1, title: '确定类型', content: '喜剧/温情/讽刺？类型决定风格' },
      { step: 2, title: '设计核心事件', content: '用一个核心事件贯穿全篇' },
      { step: 3, title: '设计人物关系', content: '简单但有戏剧张力' },
      { step: 4, title: '设计笑点/泪点', content: '提前规划好"炸点"的位置' },
      { step: 5, title: '写剧本', content: '台词要口语化，动作要具体' },
      { step: 6, title: '排练打磨', content: '小品是表演艺术，必须排练才能发现问题' }
    ],
    relatedCourseIds: ['c15', 'c22']
  },
  {
    format: 'prose',
    formatName: '散文',
    formatCategory: '文学类',
    standardFormat: `【散文标准格式】

一、基本信息
- 标题
- 副标题（可选）
- 情感基调

二、结构类型
【叙事散文】
时间/空间为线索

【抒情散文】
情感为线索

【议论散文】
观点为线索

三、写作要点
- 形散神聚
- 语言优美
- 情感真挚
- 善用修辞

四、段落安排
- 开头：引人入胜
- 中段：丰富充实
- 结尾：余韵悠长`,
    coreSkills: [
      '形散神聚，所有素材都要服务于一个中心',
      '语言要美，散文是语言的艺术',
      '情感要真，虚情假意读者能感受到',
      '善用意象，用具体的事物表达抽象的情感',
      '留白和含蓄，比直白更有味道'
    ],
    methodology: [
      { step: 1, title: '确定主题', content: '想表达什么情感或思考？这是散文的灵魂' },
      { step: 2, title: '选择素材', content: '从记忆、观察、阅读中选取与主题相关的素材' },
      { step: 3, title: '确定线索', content: '时间/空间/情感/意象，选一条贯穿全文的线' },
      { step: 4, title: '设计开头', content: '用一个画面、一句话、一个意象开头' },
      { step: 5, title: '展开叙述', content: '围绕线索展开，素材之间要有内在联系' },
      { step: 6, title: '写好结尾', content: '余韵悠长，不说破，让读者回味' }
    ],
    relatedCourseIds: ['c23']
  },
  {
    format: 'variety',
    formatName: '综艺节目',
    formatCategory: '视频类',
    standardFormat: `【综艺台本标准格式】

一、节目信息
- 节目名称
- 节目类型
- 单集时长
- 目标受众

二、节目定位
- 核心看点
- 目标人群
- 平台调性

三、环节设计
【环节1】
环节名称：
环节时长：
核心规则：
执行流程：
笑点设计：
【环节2】
...

四、嘉宾人设
- 嘉宾姓名
- 角色定位
- 预期表现

五、串场设计
- 开场主持词
- 环节过渡语
- 结尾收束语`,
    coreSkills: [
      '综艺的核心是"人"，嘉宾人设比节目形式更重要',
      '环节设计要简单易懂，规则复杂了观众看不懂',
      '笑点要设计，但不能太刻意，要让嘉宾自然发挥',
      '节奏要快，综艺没有"无聊"的资格',
      '后期包装是综艺的灵魂，剪辑决定节目效果'
    ],
    methodology: [
      { step: 1, title: '确定节目类型', content: '真人秀/选秀/游戏/脱口秀...不同类型不同逻辑' },
      { step: 2, title: '设计核心看点', content: '观众为什么要看？有什么是别的地方看不到的？' },
      { step: 3, title: '选择/设计环节', content: '环节要简单有趣，能让嘉宾展示真实性格' },
      { step: 4, title: '邀请嘉宾', content: '嘉宾要适配节目，有综艺感的人比咖位更重要' },
      { step: 5, title: '写台本', content: '写清楚每个环节的流程和预期效果' },
      { step: 6, title: '预录测试', content: '正式录制前测试环节，发现问题' }
    ],
    relatedCourseIds: ['c5', 'c24']
  },
  {
    format: 'brand-story',
    formatName: '品牌故事',
    formatCategory: '营销文类',
    standardFormat: `【品牌故事标准格式】

一、品牌基础
- 品牌名称
- 品牌定位
- 目标用户
- 核心价值观

二、故事结构
【创始人故事】
- 起点/初心
- 困难/挑战
- 转折/突破
- 成就/愿景

【品牌故事】
- 起源（时间、地点、契机）
- 发展（关键里程碑）
- 价值观（品牌主张）
- 愿景（未来方向）

三、写作要点
- 有温度，不是冷冰冰的企业介绍
- 有细节，让故事更真实
- 有共鸣，连接用户情感
- 有高度，超越产品本身`,
    coreSkills: [
      '好故事要有人物，有冲突，有情感',
      '从用户视角讲故事，不要从企业视角',
      '细节是故事的灵魂，具体的细节比笼统的描述更有力量',
      '价值观要贯穿始终，不能前后矛盾',
      '结尾要有升华，让品牌故事有超越产品的意义'
    ],
    methodology: [
      { step: 1, title: '了解品牌', content: '深入了解品牌历史、创始人、产品、用户' },
      { step: 2, title: '找到故事核', content: '品牌最打动人心的故事是什么？' },
      { step: 3, title: '设计叙事', content: '按"起承转合"组织故事，冲突和转折是亮点' },
      { step: 4, title: '写初稿', content: '用讲故事的方式写，不是写说明书' },
      { step: 5, title: '打磨语言', content: '让语言有温度，有画面感' },
      { step: 6, title: '检查一致性', content: '品牌故事要与品牌形象、用户认知一致' }
    ],
    relatedCourseIds: ['c13', 'c25']
  },
  {
    format: 'medium-story',
    formatName: '中篇小说',
    formatCategory: '小说类',
    standardFormat: `【中篇小说标准格式】

一、基本信息
- 标题
- 类型/题材
- 预估字数（2-10万字）

二、结构设计
【开篇】建立场景和人物
【发展】核心冲突推进
【高潮】矛盾爆发
【结尾】解决/留白

三、人物设置
- 主角（1-2个）
- 配角（3-5个）
- 主角团/对手阵营

四、叙事视角
第一人称/第三人称限知/第三人称全知`,
    coreSkills: [
      '字数适中，要有完整的故事弧光',
      '人物不能太多，主角1-2个，配角3-5个足够',
      '节奏要紧凑，中篇没有空间浪费',
      '结尾要有力量感，不能草草收场',
      '主题要明确，中篇不适合复杂的多主题'
    ],
    methodology: [
      { step: 1, title: '确定故事核', content: '一句话说清楚要讲什么故事' },
      { step: 2, title: '设计人物', content: '主角要有清晰的欲望和障碍' },
      { step: 3, title: '规划结构', content: '按起承转合规划好每部分的内容和字数' },
      { step: 4, title: '写开篇', content: '用具体的场景和细节开场' },
      { step: 5, title: '推进情节', content: '让冲突不断升级，推动故事向前' },
      { step: 6, title: '写结尾', content: '高潮过后给一个有力的收束' }
    ],
    relatedCourseIds: ['c6', 'c7']
  },
  {
    format: 'short-story',
    formatName: '短篇小说',
    formatCategory: '小说类',
    standardFormat: `【短篇小说标准格式】

一、基本信息
- 标题
- 类型/题材
- 字数（5000-2万字）

二、结构要求
【开头】（10%）：建立场景和核心冲突
【发展】（50%）：冲突推进，细节丰富
【高潮】（20%）：矛盾爆发
【结尾】（20%）：解决/揭示/留白

三、写作要点
- 人物精简，1-2个核心人物
- 场景集中，2-3个主要场景
- 主题单一，一个核心主题
- 细节精准，每个细节都要有意义`,
    coreSkills: [
      '字数有限，每个字都要有价值',
      '人物要立体，寥寥数笔就能让读者记住',
      '结尾要出人意料又在情理之中',
      '主题要深刻，用小故事讲大道理',
      '留白是艺术，不要把话说得太满'
    ],
    methodology: [
      { step: 1, title: '捕捉灵感', content: '一个画面、一句话、一个念头都可能成为短篇的种子' },
      { step: 2, title: '确定主题', content: '想通过这个故事表达什么？' },
      { step: 3, title: '设计人物', content: '1-2个核心人物，他们的欲望和障碍是什么？' },
      { step: 4, title: '规划结构', content: '用最精简的方式组织故事' },
      { step: 5, title: '写作', content: '一气呵成，不要回头修改' },
      { step: 6, title: '修改', content: '删减冗余，每个字都要有意义' }
    ],
    relatedCourseIds: ['c6', 'c16']
  },
  {
    format: 'anime',
    formatName: '动画剧本',
    formatCategory: '视频类',
    standardFormat: `【动画剧本标准格式】

一、项目信息
- 作品名称
- 集数/总时长
- 类型/风格
- 目标受众

二、人物设定
- 角色名：（性格、特点）
- 外形描述：（发型、服装等）
- 声优建议：（可选）

三、集纲格式
第X集 集名
【本集核心事件】
【本集亮点】
【分镜备注】

四、场景标头
同影视剧本格式

五、特殊标注
- 变身/特效
- 重要道具
- 音乐提示`,
    coreSkills: [
      '动画的核心是"想象力"，要敢想',
      '人物设计要有记忆点，外形要独特',
      '剧情要"燃"，少年漫的核心是热血',
      '要建立完整的世界观规则',
      '分镜要有画面感，考虑动画的可实现性'
    ],
    methodology: [
      { step: 1, title: '确定类型和风格', content: '热血/恋爱/治愈/搞笑...决定整体基调' },
      { step: 2, title: '设计世界观', content: '如果是架空世界，需要建立完整的规则' },
      { step: 3, title: '设计角色', content: '主角要有成长空间，反派要有魅力' },
      { step: 4, title: '规划集数', content: '按季番/半年番规划故事体量' },
      { step: 5, title: '写集纲', content: '每集至少2-3个情节点' },
      { step: 6, title: '写剧本', content: '考虑动画的分镜和特效实现' }
    ],
    relatedCourseIds: ['c26']
  },
  {
    format: 'audio-drama',
    formatName: '广播剧',
    formatCategory: '视频类',
    standardFormat: `【广播剧剧本标准格式】

一、项目信息
- 作品名称
- 集数
- 类型（悬疑/言情/耽美/治愈...）
- 时长

二、声音人设
角色名：（声音特点描述）
- 音色：（低沉/甜美/沙哑...）
- 语气：（冷静/活泼/稳重...）
- 说话习惯：（口头禅、语速...）

三、剧本格式
【场景名称】
（音效提示）

角色名：台词内容。
（动作/情绪提示）

四、音效清单
- 场景音效
- 背景音乐
- 情绪音乐`,
    coreSkills: [
      '广播剧是"声音的艺术"，对白要适合"听"',
      '声音要有辨识度，不同角色音色要有区分',
      '音效是画面的替代，要用音效引导听众想象',
      '节奏要快，广播剧不能"慢"',
      '留白是声音的艺术，沉默有时候比声音更有力量'
    ],
    methodology: [
      { step: 1, title: '确定题材', content: '广播剧适合悬疑、言情、耽美等情感向题材' },
      { step: 2, title: '设计声音人设', content: '每个角色的声音都要有独特性' },
      { step: 3, title: '设计场景音效', content: '用音效构建画面感' },
      { step: 4, title: '写对白', content: '对白要自然，适合"听"而不是"看"' },
      { step: 5, title: '设计节奏', content: '留白、高潮、转折要有节奏感' },
      { step: 6, title: '后期混音', content: '人声、音效、背景音乐的比例要协调' }
    ],
    relatedCourseIds: ['c27']
  },
  {
    format: 'fable',
    formatName: '寓言',
    formatCategory: '文学类',
    standardFormat: `【寓言标准格式】

一、基本信息
- 标题
- 目标读者（儿童/成人/通用）

二、结构要求
【故事】（主体）
用动物或人物的故事传达寓意

【寓意】（结尾）
通常1-2句话，点明故事要说明的道理

三、写作要点
- 主角：动物/植物/物品/人物
- 特点：拟人化
- 寓意：要明确但不说教
- 篇幅：短小精悍（300-1000字）`,
    coreSkills: [
      '故事要生动有趣，能吸引读者/听众',
      '寓意要明确，但不能太直白地说出来',
      '主角要有代表性，能让读者代入',
      '情节要简单，1-2个转折足够',
      '结尾要出人意料又合乎情理'
    ],
    methodology: [
      { step: 1, title: '确定寓意', content: '想说明什么道理？这是寓言的核心' },
      { step: 2, title: '选择主角', content: '动物/植物/物品/人物，选择最有代表性的' },
      { step: 3, title: '设计情节', content: '用最简单的方式呈现寓意' },
      { step: 4, title: '写故事', content: '让故事本身说话，不要直接说教' },
      { step: 5, title: '检验寓意', content: '故事能否传达你想说的道理？' }
    ],
    relatedCourseIds: ['c17']
  }
];

// ==================== 专业课程数据 ====================
const COURSES: Course[] = [
  {
    id: 'c1',
    title: '短剧创作实战：从0到100集的爆款方法论',
    category: 'short-drama',
    categoryName: '短剧创作',
    instructor: '李明老师',
    instructorAvatar: 'LM',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course1/400/225',
    description: '系统讲解短剧创作的核心方法，从题材选择、人设设计到剧本写作，帮助你快速掌握爆款短剧的密码。',
    duration: '12小时',
    lessons: 36,
    rating: 4.8,
    students: 2356,
    tags: ['短剧', '爆款', '实战'],
    hasVideo: true
  },
  {
    id: 'c2',
    title: '短剧编剧进阶：钩子设计与情绪节奏控制',
    category: 'short-drama',
    categoryName: '短剧创作',
    instructor: '王芳老师',
    instructorAvatar: 'WF',
    price: 149,
    originalPrice: 299,
    coverImage: 'https://picsum.photos/seed/course2/400/225',
    description: '深入讲解短剧的开头钩子、情绪节奏和结尾悬念设计，让你的短剧完播率提升300%。',
    duration: '8小时',
    lessons: 24,
    rating: 4.9,
    students: 1823,
    tags: ['钩子', '节奏', '进阶'],
    hasVideo: true
  },
  {
    id: 'c3',
    title: '影视剧本写作：大师带你从构思到完成',
    category: 'movie',
    categoryName: '影视编剧',
    instructor: '张伟导演',
    instructorAvatar: 'ZW',
    price: 399,
    originalPrice: 799,
    coverImage: 'https://picsum.photos/seed/course3/400/225',
    description: '20年资深导演亲授，从电影剧本的结构设计、人物弧光到分场大纲，系统学习商业电影剧本创作。',
    duration: '20小时',
    lessons: 50,
    rating: 4.9,
    students: 1542,
    tags: ['电影', '大师课', '编剧'],
    hasVideo: true
  },
  {
    id: 'c4',
    title: '独立电影编剧：用小成本拍出好故事',
    category: 'movie',
    categoryName: '影视编剧',
    instructor: '陈可导演',
    instructorAvatar: 'CK',
    price: 299,
    originalPrice: 599,
    coverImage: 'https://picsum.photos/seed/course4/400/225',
    description: '专注独立电影创作，讲解如何在有限预算下讲好故事，适合新人导演和编剧。',
    duration: '15小时',
    lessons: 40,
    rating: 4.7,
    students: 876,
    tags: ['独立电影', '小成本', '创作'],
    hasVideo: true
  },
  {
    id: 'c5',
    title: '网剧创作指南：从选题到分集大纲设计',
    category: 'tv-drama',
    categoryName: '影视编剧',
    instructor: '刘涛编剧',
    instructorAvatar: 'LT',
    price: 349,
    originalPrice: 699,
    coverImage: 'https://picsum.photos/seed/course5/400/225',
    description: '揭秘网剧创作的核心秘密，从选题分析到分集大纲，手把手教你设计出让观众追剧的剧本。',
    duration: '18小时',
    lessons: 45,
    rating: 4.8,
    students: 2134,
    tags: ['网剧', '分集', '实战'],
    hasVideo: true
  },
  {
    id: 'c6',
    title: '网络小说写作：从新手到月入过万',
    category: 'novel',
    categoryName: '小说创作',
    instructor: '赵敏老师',
    instructorAvatar: 'ZM',
    price: 249,
    originalPrice: 499,
    coverImage: 'https://picsum.photos/seed/course6/400/225',
    description: '起点中文网白金作者亲授，从选题、人设、节奏到更新技巧，全面提升你的网文创作能力。',
    duration: '16小时',
    lessons: 42,
    rating: 4.9,
    students: 4521,
    tags: ['网文', '月入过万', '实战'],
    hasVideo: true
  },
  {
    id: 'c7',
    title: '小说创作核心技能：人物塑造与情节设计',
    category: 'novel',
    categoryName: '小说创作',
    instructor: '孙悦老师',
    instructorAvatar: 'SY',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course7/400/225',
    description: '深入讲解小说创作中的人物塑造和情节设计技巧，让你的角色活起来，让你的故事动起来。',
    duration: '10小时',
    lessons: 30,
    rating: 4.8,
    students: 2876,
    tags: ['人物', '情节', '技巧'],
    hasVideo: true
  },
  {
    id: 'c8',
    title: '古诗词创作入门：从格律到意境',
    category: 'poetry',
    categoryName: '诗词创作',
    instructor: '陈教授',
    instructorAvatar: 'CP',
    price: 179,
    originalPrice: 359,
    coverImage: 'https://picsum.photos/seed/course8/400/225',
    description: '诗词名家亲授，从格律基础到意境营造，带你领略古典诗词之美，掌握诗词创作的核心技巧。',
    duration: '14小时',
    lessons: 35,
    rating: 4.9,
    students: 1654,
    tags: ['诗词', '格律', '意境'],
    hasVideo: true
  },
  {
    id: 'c9',
    title: '现代诗创作工坊：意象、节奏与情感的完美融合',
    category: 'poetry',
    categoryName: '诗词创作',
    instructor: '顾城学院',
    instructorAvatar: 'GC',
    price: 159,
    originalPrice: 319,
    coverImage: 'https://picsum.photos/seed/course9/400/225',
    description: '专注于现代诗创作，从意象选择、节奏控制到情感表达，帮助你找到属于自己的诗歌声音。',
    duration: '8小时',
    lessons: 24,
    rating: 4.7,
    students: 987,
    tags: ['现代诗', '意象', '工坊'],
    hasVideo: true
  },
  {
    id: 'c10',
    title: '歌词创作实战：从灵感到成品',
    category: 'lyrics',
    categoryName: '歌词创作',
    instructor: '林夕工作室',
    instructorAvatar: 'LX',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course10/400/225',
    description: '知名词作家亲授，从Hook设计、段落结构到旋律配合，系统学习歌词创作的核心方法。',
    duration: '12小时',
    lessons: 32,
    rating: 4.8,
    students: 1432,
    tags: ['歌词', 'Hook', '实战'],
    hasVideo: true
  },
  {
    id: 'c11',
    title: '流行音乐歌词创作：写出打动人心的歌词',
    category: 'lyrics',
    categoryName: '歌词创作',
    instructor: '方文山',
    instructorAvatar: 'FWS',
    price: 299,
    originalPrice: 599,
    coverImage: 'https://picsum.photos/seed/course11/400/225',
    description: '周杰伦御用作词人方文山亲授，从中国风到情歌，分享歌词创作的心路历程和实用技巧。',
    duration: '10小时',
    lessons: 28,
    rating: 5.0,
    students: 3456,
    tags: ['大师课', '方文山', '流行'],
    hasVideo: true
  },
  {
    id: 'c12',
    title: '纪录片创作全流程：从选题到成片',
    category: 'documentary',
    categoryName: '纪录片',
    instructor: '贾樟柯工作室',
    instructorAvatar: 'JZK',
    price: 349,
    originalPrice: 699,
    coverImage: 'https://picsum.photos/seed/course12/400/225',
    description: '国际获奖导演系统讲解纪录片创作，从选题策划、前期调研到拍摄剪辑，完成你的第一部纪录片。',
    duration: '18小时',
    lessons: 48,
    rating: 4.9,
    students: 876,
    tags: ['纪录片', '大师', '全流程'],
    hasVideo: true
  },
  {
    id: 'c13',
    title: '广告文案写作：写出让人掏钱的文案',
    category: 'advertising',
    categoryName: '广告文案',
    instructor: '华杉老师',
    instructorAvatar: 'HS',
    price: 249,
    originalPrice: 499,
    coverImage: 'https://picsum.photos/seed/course13/400/225',
    description: '知名广告人亲授，从用户洞察、卖点提炼到文案写作，让你的广告文案有效又有趣。',
    duration: '12小时',
    lessons: 36,
    rating: 4.8,
    students: 2154,
    tags: ['广告', '文案', '实战'],
    hasVideo: true
  },
  {
    id: 'c14',
    title: '短视频文案脚本：从标题到结尾全攻略',
    category: 'advertising',
    categoryName: '广告文案',
    instructor: '抖音学院',
    instructorAvatar: 'DY',
    price: 99,
    originalPrice: 199,
    coverImage: 'https://picsum.photos/seed/course14/400/225',
    description: '专注短视频文案创作，讲解爆款视频的文案结构、开头写法、结尾技巧，快速提升短视频质量。',
    duration: '6小时',
    lessons: 20,
    rating: 4.7,
    students: 5632,
    tags: ['短视频', '脚本', '爆款'],
    hasVideo: true
  },
  {
    id: 'c15',
    title: '相声创作入门：从垫话到正活',
    category: 'crosstalk',
    categoryName: '曲艺创作',
    instructor: '郭德纲学院',
    instructorAvatar: 'GDG',
    price: 299,
    originalPrice: 599,
    coverImage: 'https://picsum.photos/seed/course15/400/225',
    description: '德云社编剧团队亲授，从相声的基本结构到包袱设计，手把手教你写出好笑的相声段子。',
    duration: '14小时',
    lessons: 38,
    rating: 4.9,
    students: 1234,
    tags: ['相声', '包袱', '入门'],
    hasVideo: true
  },
  {
    id: 'c16',
    title: '微小说写作：300字的艺术',
    category: 'micro-fiction',
    categoryName: '小说创作',
    instructor: '文学导师',
    instructorAvatar: 'WX',
    price: 99,
    originalPrice: 199,
    coverImage: 'https://picsum.photos/seed/course16/400/225',
    description: '专注于微小说创作，讲解如何在极短的篇幅内讲好一个完整的故事，包含反转和情感。',
    duration: '5小时',
    lessons: 16,
    rating: 4.6,
    students: 987,
    tags: ['微小说', '短篇', '技巧'],
    hasVideo: true
  },
  {
    id: 'c17',
    title: '童话与寓言创作：给孩子讲故事的艺术',
    category: 'fairy-tale',
    categoryName: '儿童文学',
    instructor: '郑渊洁工作室',
    instructorAvatar: 'ZYJ',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course17/400/225',
    description: '童话大王郑渊洁团队亲授，从故事构思到语言表达，教你写出能打动孩子的童话和寓言。',
    duration: '10小时',
    lessons: 28,
    rating: 4.9,
    students: 1567,
    tags: ['童话', '寓言', '儿童'],
    hasVideo: true
  },
  {
    id: 'c18',
    title: '演讲稿写作：让你的演讲直击人心',
    category: 'speech',
    categoryName: '演讲写作',
    instructor: 'TED中国',
    instructorAvatar: 'TED',
    price: 179,
    originalPrice: 359,
    coverImage: 'https://picsum.photos/seed/course18/400/225',
    description: '借鉴TED演讲技巧，讲解如何写出有感染力的演讲稿，从开场到结尾，让你的演讲深入人心。',
    duration: '8小时',
    lessons: 24,
    rating: 4.8,
    students: 2134,
    tags: ['演讲', 'TED', '感染力'],
    hasVideo: true
  },
  {
    id: 'c19',
    title: '公众号爆款文章写作：10万+的秘诀',
    category: 'wechat-article',
    categoryName: '内容创作',
    instructor: '新榜学院',
    instructorAvatar: 'XB',
    price: 149,
    originalPrice: 299,
    coverImage: 'https://picsum.photos/seed/course19/400/225',
    description: '揭秘公众号10万+文章的写作秘诀，从选题到标题，从开头到结尾，系统提升你的内容创作能力。',
    duration: '10小时',
    lessons: 30,
    rating: 4.7,
    students: 3456,
    tags: ['公众号', '10万+', '爆款'],
    hasVideo: true
  },
  {
    id: 'c20',
    title: '微电影创作实战：用手机拍出电影感',
    category: 'microfilm',
    categoryName: '影视创作',
    instructor: '导演老黑',
    instructorAvatar: 'DLH',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course20/400/225',
    description: '专注微电影创作，从剧本到拍摄到剪辑，用最简单设备拍出有电影感的作品。',
    duration: '12小时',
    lessons: 34,
    rating: 4.6,
    students: 1234,
    tags: ['微电影', '拍摄', '实战'],
    hasVideo: true
  },
  {
    id: 'c21',
    title: '话剧剧本创作：从构思到舞台呈现',
    category: 'stage-play',
    categoryName: '戏剧创作',
    instructor: '国家话剧院',
    instructorAvatar: 'GJ',
    price: 299,
    originalPrice: 599,
    coverImage: 'https://picsum.photos/seed/course21/400/225',
    description: '国家话剧院编剧团队亲授，从话剧剧本结构到台词写作，让你的剧本能走上舞台。',
    duration: '14小时',
    lessons: 40,
    rating: 4.8,
    students: 567,
    tags: ['话剧', '舞台', '专业'],
    hasVideo: true
  },
  {
    id: 'c22',
    title: '小品创作指南：春晚小品的幕后故事',
    category: 'sketch',
    categoryName: '曲艺创作',
    instructor: '春晚编剧组',
    instructorAvatar: 'CW',
    price: 249,
    originalPrice: 499,
    coverImage: 'https://picsum.photos/seed/course22/400/225',
    description: '揭秘春晚小品创作过程，从选题到剧本到排练，分享喜剧小品创作的核心技巧。',
    duration: '10小时',
    lessons: 28,
    rating: 4.9,
    students: 876,
    tags: ['小品', '春晚', '喜剧'],
    hasVideo: true
  },
  {
    id: 'c23',
    title: '散文写作工坊：用文字捕捉生活的美',
    category: 'prose',
    categoryName: '文学创作',
    instructor: '作家余华',
    instructorAvatar: 'YH',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course23/400/225',
    description: '茅盾文学奖得主余华亲授，从生活观察到文字表达，分享散文的写作之道。',
    duration: '8小时',
    lessons: 24,
    rating: 5.0,
    students: 2345,
    tags: ['散文', '大师', '文学'],
    hasVideo: true
  },
  {
    id: 'c24',
    title: '综艺节目策划：从节目模式到台本设计',
    category: 'variety',
    categoryName: '综艺创作',
    instructor: '芒果TV学院',
    instructorAvatar: 'MG',
    price: 299,
    originalPrice: 599,
    coverImage: 'https://picsum.photos/seed/course24/400/225',
    description: '湖南卫视制作团队亲授，从综艺节目模式设计到台本写作，全面掌握综艺创作技能。',
    duration: '16小时',
    lessons: 42,
    rating: 4.8,
    students: 1456,
    tags: ['综艺', '策划', '台本'],
    hasVideo: true
  },
  {
    id: 'c25',
    title: '品牌故事写作：让用户爱上你的品牌',
    category: 'brand-story',
    categoryName: '营销文案',
    instructor: '华与华',
    instructorAvatar: 'HYH',
    price: 249,
    originalPrice: 499,
    coverImage: 'https://picsum.photos/seed/course25/400/225',
    description: '知名营销咨询公司亲授，从品牌故事结构到文案写作，让你的品牌故事有温度又有力度。',
    duration: '10小时',
    lessons: 30,
    rating: 4.7,
    students: 1234,
    tags: ['品牌', '故事', '营销'],
    hasVideo: true
  },
  {
    id: 'c26',
    title: '动画剧本创作：从人设到分镜的完整流程',
    category: 'anime',
    categoryName: '动画创作',
    instructor: '玄机科技',
    instructorAvatar: 'XJ',
    price: 349,
    originalPrice: 699,
    coverImage: 'https://picsum.photos/seed/course26/400/225',
    description: '国漫制作公司编剧团队亲授，从动画世界观设计到分集剧本，手把手教你创作动画作品。',
    duration: '18小时',
    lessons: 48,
    rating: 4.8,
    students: 987,
    tags: ['动画', '国漫', '分镜'],
    hasVideo: true
  },
  {
    id: 'c27',
    title: '广播剧创作：从声音设计到剧本写作',
    category: 'audio-drama',
    categoryName: '声音创作',
    instructor: '喜马拉雅学院',
    instructorAvatar: 'XM',
    price: 199,
    originalPrice: 399,
    coverImage: 'https://picsum.photos/seed/course27/400/225',
    description: '专注于广播剧创作，从声音人设到剧本写作，从音效设计到后期混音，系统学习声音叙事。',
    duration: '12小时',
    lessons: 32,
    rating: 4.7,
    students: 1543,
    tags: ['广播剧', '声音', '音频'],
    hasVideo: true
  }
];

// ==================== 格式分类列表 ====================
const FORMAT_CATEGORIES = [
  { name: '视频类', formats: ['short-drama', 'movie', 'tv-drama', 'variety', 'microfilm', 'anime', 'audio-drama', 'documentary'] },
  { name: '小说类', formats: ['novel', 'medium-story', 'short-story', 'micro-fiction'] },
  { name: '文学类', formats: ['poetry', 'lyrics', 'prose', 'fairy-tale', 'fable'] },
  { name: '曲艺类', formats: ['stage-play', 'crosstalk', 'sketch'] },
  { name: '营销文类', formats: ['speech', 'brand-story', 'wechat-article', 'advertising'] }
];

const COURSE_CATEGORIES = [
  { id: 'all', name: '全部课程' },
  { id: 'short-drama', name: '短剧创作' },
  { id: 'movie', name: '影视编剧' },
  { id: 'novel', name: '小说创作' },
  { id: 'poetry', name: '诗词创作' },
  { id: 'lyrics', name: '歌词创作' },
  { id: 'advertising', name: '广告文案' },
  { id: 'documentary', name: '纪录片' },
  { id: 'other', name: '其他' }
];

// ==================== 组件 ====================
interface LearningCenterProps {
  onClose: () => void;
}

export default function LearningCenter({ onClose }: LearningCenterProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'course'>('guide');
  const [selectedFormat, setSelectedFormat] = useState<string>('short-drama');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState<CreationGuide | null>(null);
  const [expandedMethodology, setExpandedMethodology] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [boughtCourses, setBoughtCourses] = useState<string[]>(['c1', 'c6']);

  // 过滤课程
  const filteredCourses = COURSES.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' ||
      (selectedCategory === 'other' ? !['short-drama', 'movie', 'novel', 'poetry', 'lyrics', 'advertising', 'documentary'].includes(course.category) : course.category === selectedCategory);
    return matchSearch && matchCategory;
  });

  // 获取当前选中的创作指南
  const currentGuide = CREATION_GUIDES.find(g => g.format === selectedFormat) || CREATION_GUIDES[0];

  // 添加到购物车
  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId) && !boughtCourses.includes(courseId)) {
      setCart([...cart, courseId]);
    }
  };

  // 购买课程（模拟）
  const buyCourse = (courseId: string) => {
    if (!boughtCourses.includes(courseId)) {
      setBoughtCourses([...boughtCourses, courseId]);
      setCart(cart.filter(id => id !== courseId));
      setSelectedCourse(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-auto">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h1 className="text-xl font-bold text-gray-900">学习创作</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* 购物车 */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              {/* 已购课程 */}
              <button
                onClick={() => {
                  setActiveTab('course');
                  setSelectedCategory('bought');
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                我的课程 ({boughtCourses.length})
              </button>
            </div>
          </div>
          {/* Tab切换 */}
          <div className="flex gap-1 pb-0">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'guide'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                创作指南
              </div>
              {activeTab === 'guide' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === 'course'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                专业课程
              </div>
              {activeTab === 'course' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'guide' ? (
          // ==================== 创作指南 ====================
          <div className="flex gap-6">
            {/* 左侧格式列表 */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-28">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索创作形式..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {FORMAT_CATEGORIES.map((category) => {
                    const filteredGuides = CREATION_GUIDES.filter(g =>
                      category.formats.includes(g.format) &&
                      (searchQuery === '' || g.formatName.includes(searchQuery))
                    );
                    if (filteredGuides.length === 0) return null;
                    return (
                      <div key={category.name} className="border-b border-gray-100 last:border-0">
                        <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {category.name}
                        </div>
                        {filteredGuides.map((guide) => (
                          <button
                            key={guide.format}
                            onClick={() => setSelectedFormat(guide.format)}
                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${
                              selectedFormat === guide.format ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="font-medium">{guide.formatName}</span>
                            {selectedFormat === guide.format && (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右侧指南详情 */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {/* 头部 */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/80 uppercase tracking-wider">{currentGuide.formatCategory}</span>
                      <h2 className="text-2xl font-bold text-white mt-1">{currentGuide.formatName} 创作指南</h2>
                    </div>
                    {currentGuide.relatedCourseIds.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab('course');
                          const relatedCourse = COURSES.find(c => c.id === currentGuide.relatedCourseIds[0]);
                          if (relatedCourse) setSelectedCourse(relatedCourse);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        相关课程
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* 标准格式 */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <FileText className="w-5 h-5 text-blue-500" />
                      标准格式
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                      {currentGuide.standardFormat}
                    </div>
                  </div>

                  {/* 核心创作技巧 */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      核心创作技巧
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {currentGuide.coreSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100"
                        >
                          <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 从0开始的方法论 */}
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <Layers className="w-5 h-5 text-purple-500" />
                      从0开始的方法论
                    </h3>
                    <div className="space-y-3">
                      {currentGuide.methodology.map((method) => (
                        <div
                          key={method.step}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedMethodology(
                              expandedMethodology === method.step ? null : method.step
                            )}
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">
                                {method.step}
                              </div>
                              <span className="font-medium text-gray-900">{method.title}</span>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedMethodology === method.step ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {expandedMethodology === method.step && (
                            <div className="px-4 py-4 bg-white border-t border-gray-100">
                              <p className="text-gray-600 leading-relaxed">{method.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ==================== 专业课程 ====================
          <div>
            {/* 分类筛选 */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {COURSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* 课程列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(selectedCategory === 'bought' ? COURSES.filter(c => boughtCourses.includes(c.id)) : filteredCourses).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                  onClick={() => setSelectedCourse(course)}
                >
                  {/* 封面 */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {course.categoryName}
                    </div>
                    {boughtCourses.includes(course.id) && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        已购
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {course.lessons}课时
                      </span>
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {course.instructorAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{course.instructor}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>{course.rating}</span>
                          </div>
                          <span>·</span>
                          <span>{course.students.toLocaleString()}人学习</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600">¥{course.price}</span>
                        <span className="text-sm text-gray-400 line-through">¥{course.originalPrice}</span>
                      </div>
                      {boughtCourses.includes(course.id) ? (
                        <button className="px-3 py-2 bg-green-100 text-green-600 rounded-lg text-sm flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          开始学习
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(course.id);
                          }}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                        >
                          立即购买
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 课程详情弹窗 */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCourse(null)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="relative h-56">
              <img
                src={selectedCourse.coverImage}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {boughtCourses.includes(selectedCourse.id) && (
                <div className="absolute top-4 left-4 px-3 py-2 bg-green-500 text-white text-sm rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  已购买
                </div>
              )}
            </div>

            <div className="p-6">
              {/* 课程信息 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {selectedCourse.categoryName}
                  </span>
                  {selectedCourse.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedCourse.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {selectedCourse.instructorAvatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedCourse.instructor}</p>
                      <p className="text-sm text-gray-500">资深讲师</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {selectedCourse.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedCourse.students.toLocaleString()}人
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedCourse.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* 课程描述 */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">课程介绍</h3>
                <p className="text-gray-600 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {/* 课程目录（模拟） */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">课程目录</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {i}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">第{i}章 {i === 1 ? '课程导学' : i === 2 ? '基础理论' : i === 3 ? '核心技巧' : i === 4 ? '实战演练' : '总结提升'}</p>
                        <p className="text-sm text-gray-500">{20 + i * 10}分钟</p>
                      </div>
                      {boughtCourses.includes(selectedCourse.id) ? (
                        <Play className="w-5 h-5 text-blue-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">共{selectedCourse.lessons}课时</p>
              </div>

              {/* 价格和购买 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">¥{selectedCourse.price}</span>
                  <span className="text-lg text-gray-400 line-through">¥{selectedCourse.originalPrice}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                    省¥{selectedCourse.originalPrice - selectedCourse.price}
                  </span>
                </div>
                {boughtCourses.includes(selectedCourse.id) ? (
                  <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors">
                    <Play className="w-5 h-5" />
                    开始学习
                  </button>
                ) : (
                  <button
                    onClick={() => buyCourse(selectedCourse.id)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    立即购买
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 侧边栏入口组件 ====================
export function LearningCenterSidebar({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
      aria-label="打开学习创作中心 - 教程与课程"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">学习创作</h3>
            <p className="text-xs text-white/80">教程与课程</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}
