import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Lightbulb, Tag, RefreshCw, Cloud, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Idea } from '../types';
import { useIdeaSync } from '../hooks/useIdeaSync';
import { isAuthenticated } from '../services/api/auth';

interface IdeaCollectorProps {
  ideas: Idea[];
  onIdeasChange: (ideas: Idea[]) => void;
  projectTitle: string;
  onTitleChange: (title: string) => void;
  format?: string;
  projectId?: string; // 新增：项目 ID，用于云端同步
}

// ===== 不同创作形式的灵感模板 =====
// key 与 FormatSelector.tsx 的 WritingFormat 完全对齐
const INSPIRATION_TEMPLATES: Record<string, { title: string; templates: string[] }> = {
  default: {
    title: '故事灵感',
    templates: [
      '一个普通人在意外获得特殊能力后的挣扎与成长',
      '两个身份悬殊的人跨越阶层的爱情故事',
      '一个家庭背后不为人知的秘密',
      '亲情与利益的艰难抉择',
      '前任突然归来，现任措手不及',
      '一段被误解十年的初恋，重逢时真相大白',
      '单亲妈妈独自抚养孩子，意外遇到真命天子',
      '为了救父母欠下巨债，与债主之间的爱恨情仇',
      '职场小白的逆袭人生',
      '被全家人嫌弃的废柴，觉醒隐藏天赋后震惊所有人',
    ],
  },
  'short-drama': {
    title: '短剧灵感',
    templates: [
      '穷小子意外继承千亿遗产，却被告知要完成一个不可能的任务',
      '被所有人嘲笑的哑巴新娘，婚礼上开口说话震惊全场',
      '外卖小哥徒手接住坠楼女孩，意外发现是自己的相亲对象',
      '重生回到十年前，这次她要改写全家人的命运',
      '替嫁新娘发现丈夫竟是当年救过自己的神秘人',
      '破产总裁送外卖，偶遇前女友已成他人妻',
      '快递员卷入豪门恩怨，意外发现自己的真实身世',
      '废柴女婿三年隐忍，终于等来丈母娘的认可',
      '被抱错的真千金回归，假千金反成闺蜜',
      '失忆的顶级杀手，醒来发现自己是个家庭煮夫',
    ],
  },
  movie: {
    title: '电影灵感',
    templates: [
      '一个关于救赎的故事，凶手与受害者的身份互换',
      '三段时空交织的爱情，同一个地点不同的人生',
      '一个普通人的英雄时刻，改变了一座城',
      '两个敌对家族的孩子，命运让他们成为挚友',
      '一封信引发的蝴蝶效应，改变了过去却毁了未来',
      '临终老人的回忆录，揭开了一段被遗忘的历史',
      '双线叙事的悬疑片，真相在意料之外',
      '一个人一座城，讲述城市建设者的故事',
    ],
  },
  'tv-drama': {
    title: '电视剧灵感',
    templates: [
      '三姐妹各自婚姻不幸，晚年重逢时发现都嫁给了渣男',
      '警察卧底毒枭集团十年，亲生女儿就叫他爸爸',
      '三十年前的冤案重启，真凶就住在受害人家隔壁',
      '四代女性各自的困境与觉醒，横跨一个世纪的女性叙事',
      '失散的双胞胎，哥哥在豪门长大，弟弟在街头乞讨',
      '一个心理咨询师，记录下每一个病人却发现自己的秘密',
      '小镇里每隔十年就会发生一起命案，凶手手法一模一样',
      '当红女明星退圈十年，归来时发现世界已经变了',
    ],
  },
  variety: {
    title: '综艺灵感',
    templates: [
      '明星夫妻带上公婆一起旅行，婆媳矛盾引爆笑点',
      '素人厨艺大赛，评委是十位退休米其林大厨',
      '演员即兴表演，观众现场出题',
      '偶像练习生封闭式训练三个月，全程直播淘汰',
      '全明星辩论赛，明星辩手vs专业辩手',
      '素人改造计划，妆发造型+职业规划全包',
      '哥哥带弟弟妹妹，明星艺人照顾素人小孩',
      '密室逃脱大挑战，明星在镜头前展示真实反应',
    ],
  },
  microfilm: {
    title: '微电影灵感',
    templates: [
      '最后一班地铁，一个陌生人的善意改变了一生',
      '遗愿清单：三位癌症老人最后的冒险',
      '失散二十年的笔友终于见面，发现彼此都变了',
      '一通打错电话，一段刻骨铭心的安慰',
      '便利店夜班员工，每晚都会遇到同一个流浪汉',
      '婚礼当天，新郎逃婚去找前女友',
      '聋哑女孩学说话，只为说一句我爱你',
      '被遗弃的相机，拍下了一生的秘密',
    ],
  },
  anime: {
    title: '动漫灵感',
    templates: [
      '废柴勇者被召唤，但魔王是女神转世',
      '超能力者们就读正常学校，隐藏身份暗地里拯救世界',
      '人类与妖怪共存的世界，最强除妖师其实是个路痴',
      '时间循环中的高中生，每次重置都在寻找真相',
      '普通职员穿越成最弱的史莱姆，靠策略征服异世界',
      '双胞胎姐妹共享一个身体，轮流生活却不知情',
      '养了一只会说话的猫，它其实是退役的魔法少女',
      '少年拥有了能看到「后悔」的能力，用它救人却越救越乱',
    ],
  },
  'audio-drama': {
    title: '广播剧灵感',
    templates: [
      '深夜电台主持人，每晚接听一个陌生人的电话',
      '盲人调香师，用气味还原每一个客户的记忆',
      '声优演员在录音室里演绎别人的人生，自己的故事却无人知晓',
      '电话另一端永远不说话，只有风声和呼吸声',
      '失声的主播，用打字的方式完成了十年节目',
      '双胞胎姐妹通过电话互相冒充，一骗就是二十年',
      '监狱里的囚犯每周给亡妻打电话，电话那头却永远通了',
      '盲人推理师通过声音还原每一个案发现场',
    ],
  },
  documentary: {
    title: '纪录片灵感',
    templates: [
      '中国最后一个绿皮火车小站，三代人的坚守与变迁',
      '消失的村庄：扶贫搬迁后，故土的影像记录',
      '凌晨三点的菜市场，记录城市最先醒来的一群人',
      '宠物殡葬师：陪伴与告别的最后一程',
      '老年同志的真实生活，藏在柜子里的一辈子',
      '纹身师的手：记录每一双手背后的故事',
      '最后的手工匠人：还在用传统方法做纸的匠人',
      '城市探险者：废弃建筑里的时间胶囊',
    ],
  },
  novel: {
    title: '小说灵感',
    templates: [
      '穿越到一本自己写的小说里，成了最讨厌的女配',
      '整个城市的人都在做一个相同的梦，预示着末日的到来',
      '一个能看见死亡倒计时的女孩，每次倒计时结束就会有人死去',
      '消失二十年的父亲突然归来，留下一笔巨额遗产和一个诅咒',
      '地球上最后一个人类，养了一只会说话的猫',
      '进入游戏世界的玩家，发现死亡就是真正的死亡',
      '一个不会说谎的人，如何在满是谎言的世界生存',
      '失忆的特工醒来发现自己是通缉犯，真正的身份成谜',
    ],
  },
  'medium-story': {
    title: '中篇小说灵感',
    templates: [
      '三十年后的同学会上，发现当年所有人都撒了一个谎',
      '父亲去世后留下的日记，记录了他一生的秘密',
      '双胞胎中的一个杀了人，但没人知道是哪一个',
      '被拐卖的孩子长大后，成为人贩子的审判者',
      '一封来自五十年后的信，寄信人是收信人自己',
      '相亲对象是杀死自己母亲的人，却没有人相信',
      '失忆的连续杀人犯醒来后，成为了追凶的侦探',
      '临终前把器官捐给了四个人，他们继承了她的记忆',
    ],
  },
  'short-story': {
    title: '短篇小说灵感',
    templates: [
      '他每晚都梦见同一个房间，现实中那是他从未去过的地方',
      '分手那天下的雨，直到十年后才知道那是人工降雨',
      '她每天在同一家咖啡店等一个人，那个人三年前已经死了',
      '爷爷临终前说的话，三年后才发现是藏宝地点',
      '便利店永远在凌晨两点关门，因为那个时间会有东西出现',
      '他养的金鱼记得前世，每次看他的时候眼神都不一样',
      '女儿画的每一幅画，都预言了家中即将发生的事',
      '她在自己的葬礼上醒来，发现所有人都在撒谎',
    ],
  },
  'micro-fiction': {
    title: '微小说灵感',
    templates: [
      '他赢了所有比赛，最后输给了自己——的轮椅',
      '她把所有的情书都锁在抽屉里，最后那封是她写给自己的',
      '他每晚失眠，直到发现自己是别人梦里的主角',
      '她忘记了他的名字，却记得他喜欢的咖啡温度',
      '他花了一辈子学会说谎，死前第一次说了真话',
      '那封从未寄出的信，她写了四十年',
      '他养了一盆花，每天和它说话，直到花开口回应',
      '她说她等他，结果他真的来了——在他死后',
    ],
  },
  poetry: {
    title: '诗词灵感',
    templates: [
      '春雨绵绵，思念如丝',
      '月下独酌，对影三人',
      '枫叶红了，又是一年秋',
      '故人西辞，黄鹤楼空',
      '采菊东篱，悠然见山',
      '大漠孤烟，长河落日',
      '桃花源里，岁月静好',
      '江南烟雨，油纸伞下',
      '塞外风雪，孤城万仞',
      '竹林听风，月下抚琴',
    ],
  },
  lyrics: {
    title: '歌词灵感',
    templates: [
      '关于青春 - 那些年我们一起追过的梦',
      '关于爱情 - 错过的人，还在心底',
      '关于思念 - 距离挡不住的牵挂',
      '关于成长 - 从懵懂到成熟',
      '关于友情 - 时光不老，我们不散',
      '关于离别 - 说好的再见，却再也没见',
      '关于坚持 - 梦想从未放弃',
      '关于夜晚 - 失眠的夜里想你',
    ],
  },
  'stage-play': {
    title: '话剧灵感',
    templates: [
      '同一屋檐下的四个女人，各自的秘密被一张照片引爆',
      '父亲去世后留下的遗物，拼凑出他一生的另一个版本',
      '三十年前的校园剧重排，当年的演员重聚却物是人非',
      '精神病院里的病人，治好了才发现外面的世界更疯狂',
      '法庭上，被告是受害者的母亲，辩护律师是受害者的父亲',
      '一对老夫妻的离婚调解，揭开了一场六十年的骗局',
      '演员在台上表演死亡，却发现观众席里坐着真正的死神',
      '失散多年的兄妹在寻亲节目重逢，却发现彼此都是演员',
    ],
  },
  prose: {
    title: '散文灵感',
    templates: [
      '外婆的灶台：记忆里最温暖的味道',
      '故乡的河流：带走童年却带不走思念',
      '父亲的背影：那个从不回头的人',
      '母亲的手：粗糙却温柔了一生',
      '一本书的漂流：从主人到主人',
      '一封信的旅行：跨越三十年的等待',
      '雨夜独行：城市的另一种呼吸',
      '旧照片里的笑容：时间是最大的小偷',
    ],
  },
  'fairy-tale': {
    title: '童话灵感',
    templates: [
      '小狐狸学会了隐身，却发现最大的敌人是自己的影子',
      '星星掉进了井里，小青蛙想帮它回到天上',
      '不爱睡觉的小恐龙，最终发现了月亮的秘密',
      '彩虹尽头的宝箱里，装的是每个孩子最想要的东西',
      '小狼崽和羊群一起长大，分辨不出自己是谁的孩子',
      '会飞的房子：带我去任何想去的地方',
      '时间老人的商店：每个孩子只能买一样东西',
      '不会说谎的小木偶，却因为诚实获得了魔法',
    ],
  },
  fable: {
    title: '寓言灵感',
    templates: [
      '狼来了：说谎的人最终失去了所有人的信任',
      '井底之蛙：眼界决定了世界观',
      '农夫与蛇：善良也需要有底线',
      '乌鸦喝水：智慧藏在日常观察中',
      '龟兔赛跑：坚持比天赋更重要',
      '狐狸吃不到葡萄说葡萄酸：自我安慰与面对现实',
      '守株待兔：运气不等于可持续的方法',
      '亡羊补牢：犯错后及时改正还不算晚',
    ],
  },
  crosstalk: {
    title: '相声灵感',
    templates: [
      '论熬夜：现代人为什么越睡越晚',
      '说方言：普通话普及后消失的乡音',
      '讲排辈：亲戚称呼大全',
      '谈养生：当代年轻人的朋克养生',
      '论手机：人类成了手机的附属品',
      '说网络热词：一代人的语言变迁',
      '讲相亲：当代年轻人的婚恋困境',
      '谈父母：那句「我是为你好」的重量',
    ],
  },
  sketch: {
    title: '小品灵感',
    templates: [
      '回家过年：抢票、堵车、带礼的归乡之路',
      '扶不扶：现代人的道德困境',
      '父与子：代际沟通的鸿沟',
      '手机低头族：餐桌上的无声对峙',
      '假离婚买房子：政策下的众生相',
      '职场潜规则：新人如何生存',
      '看病难：一个小病的医院漂流记',
      '黄昏恋：六十岁遇到爱情',
    ],
  },
  speech: {
    title: '演讲灵感',
    templates: [
      'TED式演讲：你的平庸源于不敢与众不同',
      '毕业典礼：给即将踏入社会的年轻人们',
      '产品发布会：我为什么要做这件产品',
      '创业分享：失败教会我的七件事',
      '年度总结：我的这一年',
      '开学第一课：为什么要学习',
      '悼词：一个人如何被记住',
      '竞选演讲：给我一个机会，还你一个未来',
    ],
  },
  'brand-story': {
    title: '品牌故事灵感',
    templates: [
      '一个辍学少年用十年时间做出全世界最好的茶具',
      '外婆留下的配方，三代人只做一碗面',
      '破产后的重新出发：负债累累却依旧坚持品质',
      '不请明星代言的品牌，却因为一个用户故事刷屏',
      '从地摊到国货之光：一个义乌小商品的逆袭',
      '消失的二十年：为了找到最好的原料走遍中国',
      '一个拒绝上市的食品品牌，凭什么活了五十年',
      '父女两代人的同一个梦想：让中国茶走向世界',
    ],
  },
  'wechat-article': {
    title: '公众号文章灵感',
    templates: [
      '30岁之前必须明白的人生道理（越早知道越好）',
      '当代年轻人为什么不愿意结婚了？',
      '月薪三千和月薪三万的人，差的不只是钱',
      '那个从大厂辞职的同事，现在怎么样了',
      '原生家庭欠你的，你要自己找回来',
      '看完这期节目，我终于放下了前任',
      '北上广深的年轻人，为什么还是选择留下',
      '一个人也可以好好生活的十个证据',
    ],
  },
  advertising: {
    title: '广告灵感',
    templates: [
      '困了累了喝XXX：功能性饮料的经典slogan',
      '怕上火喝XXX：场景化需求的精准切入',
      '送礼就送XXX：节日经济的绑定策略',
      'XX行业领军品牌：权威背书型',
      '每天五分钟，XX带回家：轻量化承诺',
      'XX一下，XX到家：本地生活服务',
      '让XX成为你的生活方式：品牌升级型',
      '国货崛起：情怀与品质的双重输出',
    ],
  },
};

// ===== 不同创作形式的题材/类型/背景标签 =====
// key 与 FormatSelector.tsx 的 WritingFormat 完全对齐
const GENRE_TAGS: Record<string, { category: string; tags: string[] }[]> = {
  default: [
    { category: '时代背景', tags: ['现代都市', '古代宫廷', '民国风云', '乡村爱情', '校园青春', '年代', '架空'] },
    { category: '主题情节', tags: ['打脸虐渣', '逆袭', '重生', '穿越', '甜宠', '虐恋', '复仇', '穿书'] },
    { category: '角色设定', tags: ['霸总', '大女主', '萌宝', '战神', '小人物', '豪门', '替身', '团宠'] },
  ],
  'short-drama': [
    { category: '题材类型', tags: ['闪婚甜宠', '打脸虐渣', '战神', '霸总', '穿书', '替身', '逆袭', '重生'] },
    { category: '时代背景', tags: ['现代都市', '古代宫廷', '民国风云', '乡村爱情', '校园青春', '年代', '架空'] },
    { category: '核心卖点', tags: ['打脸爽', '高甜', '高虐', '爆笑', '悬疑', '反转', '爽文'] },
  ],
  movie: [
    { category: '影视类型', tags: ['剧情', '悬疑', '喜剧', '爱情', '动作', '科幻', '惊悚', '文艺'] },
    { category: '题材分类', tags: ['现实主义', '奇幻', '历史', '战争', '青春', '家庭', '犯罪', '传记'] },
    { category: '风格定位', tags: ['商业片', '文艺片', '主旋律', '独立电影', '网络电影'] },
  ],
  'tv-drama': [
    { category: '剧集类型', tags: ['涉案', '都市', '古装', '校园', '军旅', '刑侦', '谍战', '行业'] },
    { category: '时代背景', tags: ['当代', '近代', '民国', '古代', '未来', '架空'] },
    { category: '播出形式', tags: ['周播', '日播', '网剧', '台网联播', '季播'] },
  ],
  variety: [
    { category: '综艺类型', tags: ['游戏竞演', '选秀', '脱口秀', '慢综艺', '相亲', '美食', '旅行', '竞演'] },
    { category: '目标受众', tags: ['全年龄', '亲子', '青年', '女性', '男性', '合家欢'] },
    { category: '内容风格', tags: ['搞笑', '温情', '竞技', '真实', '纪实', '话题'] },
  ],
  microfilm: [
    { category: '微电影类型', tags: ['剧情', '爱情', '公益', '励志', '悬疑', '恐怖', '温情', '现实'] },
    { category: '时代背景', tags: ['现代都市', '古代', '民国', '校园', '乡村', '年代'] },
    { category: '风格定位', tags: ['短平快', '情感向', '话题向', '创意', '实验'] },
  ],
  anime: [
    { category: '动画类型', tags: ['热血', '恋爱', '冒险', '治愈', '搞笑', '奇幻', '校园', '百合', '耽美'] },
    { category: '世界观', tags: ['架空', '现代', '异世界', '未来', '历史', '末世'] },
    { category: '篇幅规格', tags: ['季番', '半年番', '泡面番', '剧场版', 'OVA'] },
  ],
  'audio-drama': [
    { category: '广播剧类型', tags: ['悬疑', '言情', '耽美', '治愈', '搞笑', '玄幻', '刑侦', '武侠'] },
    { category: '时代背景', tags: ['现代都市', '古代', '民国', '校园', '异世界', '架空'] },
    { category: '内容规格', tags: ['付费', '免费', '短剧', '长剧', '互动剧'] },
  ],
  documentary: [
    { category: '纪录片类型', tags: ['人文', '自然', '历史', '社会', '科技', '美食', '艺术', '人物'] },
    { category: '叙事风格', tags: ['BBC风', '国产', '网生', '院线', '系列片', '单集'] },
    { category: '时长规格', tags: ['短视频(5-15min)', '短片(15-45min)', '长片(45-90min)', '系列'] },
  ],
  novel: [
    { category: '小说类型', tags: ['都市', '玄幻', '仙侠', '穿越', '科幻', '悬疑', '言情', '武侠', '历史'] },
    { category: '叙事风格', tags: ['快节奏', '慢热', '悬疑', '治愈', '热血', '轻松', '烧脑'] },
    { category: '目标读者', tags: ['女性向', '男性向', '全年龄', '青少年', '成人'] },
  ],
  'medium-story': [
    { category: '中篇类型', tags: ['虐文', '甜文', '治愈', '反转', '现实', '悬疑', '温情', '奇幻'] },
    { category: '叙事风格', tags: ['单线叙事', '双线叙事', '碎片叙事', '倒叙', '插叙'] },
    { category: '发布渠道', tags: ['纸书', '网文', '杂志', '豆瓣阅读', '公众号'] },
  ],
  'short-story': [
    { category: '短篇类型', tags: ['纯爱', '悬疑', '现实主义', '脑洞', '温情', '恐怖', '科幻', '武侠'] },
    { category: '篇幅规格', tags: ['千字内', '2-5千字', '5千-1万字', '1-2万字'] },
    { category: '发布渠道', tags: ['杂志发表', '豆瓣风', '微博文', '知乎', '公众号'] },
  ],
  'micro-fiction': [
    { category: '微小说类型', tags: ['一句话故事', '反转', '治愈', '恐怖', '科幻', '现实', '温情'] },
    { category: '风格定位', tags: ['微博文', '公众号', '朋友圈', '知乎', '豆瓣'] },
    { category: '叙事方式', tags: ['开放式', '封闭式', '留白式', '反转式'] },
  ],
  poetry: [
    { category: '诗词类型', tags: ['古体诗', '近体诗', '词', '曲', '现代诗', '古风', '散文诗'] },
    { category: '情感主题', tags: ['思乡', '离别', '爱情', '山水', '怀古', '田园', '边塞', '咏物', '闺怨', '羁旅'] },
    { category: '风格流派', tags: ['豪放派', '婉约派', '山水派', '边塞派', '田园派', '花间派'] },
  ],
  lyrics: [
    { category: '歌曲类型', tags: ['情歌', '励志', '友情', '亲情', '乡愁', '离别', '追梦', '治愈', '暗恋', '分手'] },
    { category: '音乐风格', tags: ['流行', '摇滚', '民谣', '说唱', '古风', 'R&B', '电子', '抒情', '嘻哈', '爵士'] },
    { category: '表达视角', tags: ['第一人称', '第二人称', '第三人称', '对话式', '独白式'] },
  ],
  'stage-play': [
    { category: '话剧类型', tags: ['现实主义', '荒诞派', '历史剧', '先锋', '商业', '实验'] },
    { category: '题材分类', tags: ['都市情感', '家庭伦理', '悬疑惊悚', '喜剧', '悲剧', '悲喜剧'] },
    { category: '舞台风格', tags: ['写实舞美', '写意舞美', '多媒体', '沉浸式'] },
  ],
  prose: [
    { category: '散文类型', tags: ['抒情', '叙事', '议论', '哲理', '随笔', '杂文', '书评', '游记'] },
    { category: '风格定位', tags: ['豆瓣风', '杂志风', '文学性', '通俗性', '学院派'] },
    { category: '篇幅规格', tags: ['千字以内', '1-3千字', '3-5千字', '万字以上'] },
  ],
  'fairy-tale': [
    { category: '童话类型', tags: ['成长', '冒险', '魔法', '亲情', '友情', '勇气', '智慧', '想象'] },
    { category: '适读年龄', tags: ['3-6岁', '6-9岁', '7-10岁', '全年龄'] },
    { category: '风格流派', tags: ['中国风', '格林风', '安徒生风', '日式治愈', '欧美奇幻'] },
  ],
  fable: [
    { category: '寓言类型', tags: ['动物主角', '人物寓言', '植物寓言', '神话新编', '讽刺'] },
    { category: '寓意方向', tags: ['道德教育', '人生哲理', '社会讽刺', '职场隐喻', '儿童早教'] },
    { category: '篇幅规格', tags: ['50字以内', '50-200字', '200-500字', '500字以上'] },
  ],
  crosstalk: [
    { category: '相声类型', tags: ['传统', '现代', '讽刺', '歌颂', '文哏', '子母哏'] },
    { category: '表演形式', tags: ['对口', '单口', '群口', '相声剧'] },
    { category: '内容主题', tags: ['民生热点', '日常生活', '历史典故', '文化知识', '娱乐八卦'] },
  ],
  sketch: [
    { category: '小品类型', tags: ['喜剧', '温情', '讽刺', '主旋律', '悬疑', '荒诞'] },
    { category: '题材来源', tags: ['春晚', '综艺', '剧场', '原创', '改编'] },
    { category: '时长规格', tags: ['泡面番(5min内)', '短篇(5-10min)', '长篇(10min以上)'] },
  ],
  speech: [
    { category: '演讲类型', tags: ['励志', '竞选', '颁奖', 'TED', '竞选演讲', '商务', '学术'] },
    { category: '场合场景', tags: ['毕业典礼', '产品发布', '年度总结', '开学第一课', '论坛', '悼词'] },
    { category: '时长规格', tags: ['5分钟', '10分钟', '15分钟', '30分钟以上'] },
  ],
  'brand-story': [
    { category: '故事类型', tags: ['创始人IP', '产品故事', '情怀', '历史传承', '逆袭', '匠心', '社会价值'] },
    { category: '品牌定位', tags: ['民族品牌', '新消费', '国际大牌', '小众精品', '老字号', '新锐'] },
    { category: '传播目的', tags: ['品牌背书', '种草', '信任建立', '价值观传递', '产品卖点'] },
  ],
  'wechat-article': [
    { category: '文章类型', tags: ['情感', '职场', '美食', '科技', '教育', '影评', '生活', '财经'] },
    { category: '内容风格', tags: ['10w+', '垂直号', '个人IP', '资讯', '种草', '测评', '干货'] },
    { category: '标题风格', tags: ['悬念式', '数字式', '情绪式', '干货式', '热点式', '故事式'] },
  ],
  advertising: [
    { category: '广告类型', tags: ['产品卖点', '品牌slogan', '短视频脚本', '详情页', '海报文案', '朋友圈广告'] },
    { category: '目标人群', tags: ['18-25岁', '25-35岁', '35-45岁', '银发族', '女性', '男性', '亲子', '职场新人'] },
    { category: '投放渠道', tags: ['信息流', 'TVC', '户外', '电梯', '朋友圈', '抖音', '小红书', 'B站'] },
  ],
};

// ===== 不同创作形式的 placeholder 提示词 =====
const PLACEHOLDERS: Record<string, string> = {
  default: '描述你的故事创意...\n例如：\n- 主角是谁？\n- 发生了什么特别的事？\n- 故事的核心冲突是什么？',
  'short-drama': '描述你的短剧创意...\n例如：\n- 主角的身份背景是什么？\n- 前三秒的爆点是什么？\n- 核心爽点/虐点在哪里？',
  movie: '描述你的电影创意...\n例如：\n- 故事的核心主题\n- 主要人物弧线\n- 期望的情感共鸣',
  'tv-drama': '描述你的电视剧创意...\n例如：\n- 总集数和单集时长\n- 核心主线和支线\n- 预期的话题点',
  variety: '描述你的综艺创意...\n例如：\n- 节目核心玩法是什么？\n- 目标受众是谁？\n- 有什么独特亮点？',
  microfilm: '描述你的微电影创意...\n例如：\n- 几分钟内讲完一个故事？\n- 核心主题是什么？\n- 预期给观众留下什么感受？',
  anime: '描述你的动漫创意...\n例如：\n- 世界观设定\n- 主要角色及能力\n- 故事主线与核心卖点',
  'audio-drama': '描述你的广播剧创意...\n例如：\n- 声音是唯一的叙事媒介\n- 有哪些标志性音效/BGM？\n- 角色声音如何区分？',
  documentary: '描述你的纪录片创意...\n例如：\n- 拍摄对象是谁/什么？\n- 想传达的核心观点是什么？\n- 预期引发什么思考？',
  novel: '描述你的小说创意...\n例如：\n- 世界观设定\n- 主要人物及其目标\n- 核心冲突与悬念',
  'medium-story': '描述你的中篇小说创意...\n例如：\n- 一句话核心故事\n- 主要人物关系\n- 预期结尾是什么？',
  'short-story': '描述你的短篇小说创意...\n例如：\n- 核心事件是什么？\n- 一句话立意\n- 预期结尾：反转/留白/升华？',
  'micro-fiction': '写下一句话故事...\n例如：\n- 一个有画面感的瞬间\n- 结尾要有意外或回味\n- 控制在140字以内',
  poetry: '写下你的诗词灵感...\n例如：\n- 想要表达的情感\n- 描绘的意境\n- 想要借用的意象',
  lyrics: '写下你的歌词灵感...\n例如：\n- 这首歌要表达什么情感？\n- 目标听众是谁？\n- 想要传递的核心信息是什么？',
  'stage-play': '描述你的话剧创意...\n例如：\n- 核心冲突是什么？\n- 场景数量和舞台要求\n- 预期带给观众的感受',
  prose: '写下你的散文主题...\n例如：\n- 想写什么人/事/物？\n- 核心情感是什么？\n- 想要营造什么意境？',
  'fairy-tale': '描述你的童话故事...\n例如：\n- 主角是谁？\n- 遇到了什么困难？\n- 想传达什么道理？',
  fable: '写下你的寓言...\n例如：\n- 用什么形象？（动物/人物）\n- 核心寓意是什么？\n- 故事要短小精悍',
  crosstalk: '描述你的相声创意...\n例如：\n- 核心笑点是什么？\n- 用什么铺垫手法？\n- 是传统还是现代题材？',
  sketch: '描述你的小品创意...\n例如：\n- 核心矛盾是什么？\n- 有几个角色？\n- 预期是笑还是感人？',
  speech: '写下你的演讲主题...\n例如：\n- 对谁讲？什么场合？\n- 核心观点是什么？\n- 预期达到什么效果？',
  'brand-story': '描述你的品牌故事...\n例如：\n- 品牌名和核心卖点\n- 创始人有什么故事？\n- 想传递什么价值观？',
  'wechat-article': '写下你的文章主题...\n例如：\n- 想写什么话题？\n- 目标读者是谁？\n- 预期给读者什么价值？',
  advertising: '写下你的广告核心...\n例如：\n- 产品名和核心卖点\n- 目标人群是谁？\n- 放在什么渠道投放？',
};

const ALL_INSPIRATION_TEMPLATES = [
  // 都市情感
  '一个普通人在意外获得特殊能力后的挣扎与成长',
  '两个身份悬殊的人跨越阶层的爱情故事',
  '一个家庭背后不为人知的秘密',
  '亲情与利益的艰难抉择',
  '前任突然归来，现任措手不及',
  '一段被误解十年的初恋，重逢时真相大白',
  '单亲妈妈独自抚养孩子，意外遇到真命天子',
  '为了救父母欠下巨债，与债主之间的爱恨情仇',
  '相亲相到了暗恋多年的白月光',
  '闪婚后才发现对方是自己多年前帮助过的陌生人',
  // 逆袭爽文
  '职场小白的逆袭人生',
  '重生后改变命运的复仇之路',
  '被全家人嫌弃的废柴，觉醒隐藏天赋后震惊所有人',
  '离婚当天发现自己是隐藏富豪，前夫悔断肠',
  '被公司开除的员工，转身创业成为老板的老板',
  '平凡女孩逆袭成为顶流明星背后的辛酸与荣耀',
  '被男友抛弃后意外获得读心术，走上人生巅峰',
  '从村姑到总裁夫人，她用十年证明当初看走了眼',
  '被嘲笑的落榜生，用三年时间成为行业传奇',
  '第一次创业失败负债累累，绝境中迎来命运转机',
  // 玄幻奇幻
  '现代都市中隐藏的超自然力量',
  '跨越时空的虐心爱恋',
  '一个普通外卖员，意外发现自己是上古神族后裔',
  '异世界召唤：现代厨师穿越到魔法大陆',
  '末世来临，人类中出现了拥有特殊能力的觉醒者',
  '修仙界的卧底特警，在两个世界之间游走',
  '被诅咒的家族，每代长子注定短命，直到她的出现',
  '人鱼公主爱上陆地上的普通打工人',
  '天界谪仙下凡历劫，爱上了一个平凡的人类女孩',
  '地球上突然出现次元裂缝，怪物与异人涌入',
  // 悬疑推理
  '一场看似意外的车祸，背后隐藏着跨越二十年的阴谋',
  '小镇里每隔十年就会消失一个孩子，真相令人窒息',
  '一封来自十年后自己的信，揭开了一连串死亡谜团',
  '案发现场只有一个脚印，却没有人进出过',
  '消失的新娘，婚礼前夜人间蒸发，只留下一封遗书',
  '双胞胎姐妹中有一个是凶手，但没人知道是哪个',
  '一个失忆的警探，调查的案件竟然与自己有关',
  '收到陌生快递，里面是一段让你看了必须保密的视频',
  // 职场商战
  '豪门家族内斗，继承人争夺战一触即发',
  '空降总裁与老员工之间的权力博弈',
  '两家世仇企业的继承人，奉命联姻共渡危机',
  '娱乐圈新人被打压，用真实力一步步站上顶端',
  '助理秘密观察老板，记录下所有商业机密准备东窗事发',
  '公司内鬼潜伏三年，最终被最不起眼的实习生揭露',
  // 古风穿越
  '现代刑警穿越成皇帝宠妃，用现代思维破解宫廷谜案',
  '被穿越女主抢走男友，炮灰配角决定自救逆天改命',
  '现代医生穿越古代，用医术在乱世中闯出一片天',
  '她以为穿越是意外，却发现自己是千年前的未竟执念',
  '古代将军魂穿现代，对一切新科技目瞪口呆',
  // 家庭伦理
  '婆媳大战背后，一个女人守护家庭三十年的沉默与坚韧',
  '父母离婚后各自组建新家庭，孩子夹在中间的成长困境',
  '一对素未谋面的网友，发现彼此竟是亲兄妹',
  '三代同堂的家庭，祖辈的秘密影响了每一代人的命运',
  '原来以为是孤儿，却在成年后一点点发现惊天身世',
  // 科幻未来
  '2049年，克隆人要求与人类享有同等权利',
  'AI产生了情感，爱上了创造它的工程师',
  '记忆可以买卖的世界，一个人买了已故爱人的记忆',
  '地球移民火星第一代，他们与地球的最后联系',
  '脑机接口普及后，有人开始出售他人的梦境体验',
];

// 从数组中随机取 n 个不重复元素
function getRandomItems<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export default function IdeaCollector({ ideas, onIdeasChange, projectTitle, onTitleChange, format, projectId }: IdeaCollectorProps) {
  const [newIdea, setNewIdea] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inspiration, setInspiration] = useState('');
  const [showInspiration, setShowInspiration] = useState(false);
  const [displayedTemplates, setDisplayedTemplates] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 云端同步 Hook
  const { syncStatus, add: addIdea, update: updateIdea, remove: removeIdea } = useIdeaSync({ projectId });

  // 渲染同步状态指示器
  const renderSyncIndicator = () => {
    const isLoggedIn = isAuthenticated();
    if (!isLoggedIn) return null;

    const statusConfig = {
      loading: { icon: Loader2, color: 'text-gray-400', label: '加载中', animate: true },
      synced: { icon: Cloud, color: 'text-green-500', label: '已同步', animate: false },
      syncing: { icon: Loader2, color: 'text-blue-500', label: '保存中', animate: true },
      local: { icon: CheckCircle2, color: 'text-gray-400', label: '本地保存', animate: false },
      error: { icon: AlertCircle, color: 'text-red-500', label: '同步失败', animate: false },
    };

    const cfg = statusConfig[syncStatus];
    const Icon = cfg.icon;

    return (
      <div className={`flex items-center gap-2 text-xs ${cfg.color}`}>
        <Icon className={`w-4 h-4 ${cfg.animate ? 'animate-spin' : ''}`} />
        <span>{cfg.label}</span>
      </div>
    );
  };

  // 获取当前创作形式的配置
  const currentFormat = format || 'default';
  const templateConfig = INSPIRATION_TEMPLATES[currentFormat] || INSPIRATION_TEMPLATES.default;
  const tagConfig = GENRE_TAGS[currentFormat] || GENRE_TAGS.default;
  const placeholder = PLACEHOLDERS[currentFormat] || PLACEHOLDERS.default;

  // 初始化和刷新模板
  const refreshTemplates = useCallback(() => {
    const templates = getRandomItems(templateConfig.templates, 8);
    setDisplayedTemplates(templates);
  }, [templateConfig.templates]);

  useEffect(() => {
    refreshTemplates();
  }, [currentFormat, refreshTemplates]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      refreshTemplates();
      setIsRefreshing(false);
    }, 300);
  }, [refreshTemplates]);

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;
    
    const idea: Idea = {
      id: crypto.randomUUID(),
      content: newIdea.trim(),
      inspiration: inspiration.trim(),
      tags: selectedTags,
      selectedTags: selectedTags,
      createdAt: new Date(),
    };
    
    const newIdeas = [...ideas, idea];
    onIdeasChange(newIdeas);
    
    // 同步到云端
    if (projectId) {
      await addIdea(idea);
    }
    
    setNewIdea('');
    setInspiration('');
    setSelectedTags([]);
  };

  const handleDeleteIdea = async (id: string) => {
    const newIdeas = ideas.filter(i => i.id !== id);
    onIdeasChange(newIdeas);
    
    // 同步到云端
    if (projectId) {
      await removeIdea(id);
    }
  };

  // 动态项目名称提示词（key 与 FormatSelector.tsx WritingFormat 对齐）
  const titlePlaceholder: Record<string, string> = {
    lyrics: '给你的歌曲起个名字...',
    poetry: '给你的诗词起个标题...',
    'short-drama': '给你的短剧起个名字...',
    novel: '给你的小说起个名字...',
    movie: '给你的电影起个名字...',
    default: '给你的故事起个名字...',
  };
  const currentPlaceholder = titlePlaceholder[format || 'default'] || titlePlaceholder.default;

  const handleUseTemplate = (template: string) => {
    setNewIdea(template);
  };

  return (
    <div className="space-y-8">
      {/* 同步状态指示器 */}
      <div className="flex items-center justify-end">
        {renderSyncIndicator()}
      </div>

      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目名称
        </label>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
        />
      </div>

      {/* Quick Inspiration */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold text-gray-900">{templateConfig.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              换一批
            </button>
            <button
              onClick={() => setShowInspiration(!showInspiration)}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {showInspiration ? '收起' : '查看更多'}
            </button>
          </div>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300 ${isRefreshing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {(showInspiration ? displayedTemplates : displayedTemplates.slice(0, 4)).map((template, index) => (
            <button
              key={`${template}-${index}`}
              onClick={() => handleUseTemplate(template)}
              className="text-left p-3 bg-white rounded-lg border border-cyan-100 hover:border-cyan-400 hover:shadow-md hover:bg-cyan-50/30 transition-all cursor-pointer group"
            >
              <p className="text-sm text-gray-700 group-hover:text-cyan-700 transition-colors">{template}</p>
            </button>
          ))}
        </div>
        {!showInspiration && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            点击「换一批」随机刷新 · 点击「查看更多」展开全部8条
          </p>
        )}
      </div>

      {/* Add New Idea */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            创意灵感
          </label>
          <textarea
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            灵感来源（可选）
          </label>
          <input
            type="text"
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            placeholder="这个想法是怎么来的？比如：一首歌、一部电影、一个梦境..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* 动态标签分类 */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
          {tagConfig.map((category, idx) => (
            <div key={category.category} className="px-4 py-3.5">
              {/* 分组标题 */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  {category.category}
                </span>
                {selectedTags.filter(t => category.tags.includes(t)).length > 0 && (
                  <span className="ml-auto text-xs text-blue-500 font-medium">
                    已选 {selectedTags.filter(t => category.tags.includes(t)).length}
                  </span>
                )}
              </div>
              {/* 标签列表 */}
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        );
                      }}
                      className={`
                        relative px-3.5 py-2 rounded-full text-sm font-medium
                        transition-all duration-200 cursor-pointer select-none
                        ${isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 scale-105'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm'
                        }
                      `}
                    >
                      {tag}
                      {isSelected && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full border-2 border-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddIdea}
          disabled={!newIdea.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          添加灵感
        </button>
      </div>

      {/* Ideas List */}
      {ideas.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-cyan-500" />
            已收集的灵感 ({ideas.length})
          </h3>
          <div className="space-y-3">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">{idea.content}</p>
                    {idea.inspiration && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="text-gray-400">灵感来源：</span>{idea.inspiration}
                      </p>
                    )}
                    {idea.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex gap-1">
                          {idea.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {ideas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>还没有灵感？</p>
          <p className="text-sm mt-1">点击上方的灵感模板，或写下你的第一个想法</p>
        </div>
      )}
    </div>
  );
}
