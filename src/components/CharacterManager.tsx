import { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Heart, Shield, User, Crown, Swords, Mic, BookOpen, Music, MessageCircle, Lightbulb, Cloud, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Character, CharacterRelationship, StoryOutline } from '../types';
import { useCharacterSync } from '../hooks/useCharacterSync';
import { isAuthenticated } from '../services/api/auth';

// ==================== 类型定义 ====================
interface CharacterManagerProps {
  characters: Character[];
  onCharactersChange: (characters: Character[]) => void;
  outline?: StoryOutline | null;
  _outlineUnused?: StoryOutline | null;
  format?: string;
  projectId?: string; // 新增：项目 ID，用于云端同步
}

// 角色定位类型
type RoleDefinition = {
  value: string;
  label: string;
  icon: any;
  color: string;
};

// 专属字段定义
interface ExtraField {
  key: string;
  label: string;
  placeholder: string;
  rows?: number;
}

// 格式专属配置
interface FormatConfig {
  roles: RoleDefinition[];
  extraFields: ExtraField[];
  relationshipTypes: { value: string; label: string }[];
  cardFieldOrder: string[];
  quickHints: string[];
}

// ==================== 格式专属配置表 ====================
const CHARACTER_CONFIGS: Record<string, FormatConfig> = {
  // ==================== 视频类 ====================
  'short-drama': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '女主/男主搭档', icon: Shield, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'mentor', label: '导师/助攻', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { value: 'minor', label: '龙套/工具人', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'actorSuggestion', label: '演员建议', placeholder: '外形/气质/演技特点，如：长相甜美的年轻女演员，有古装剧经验...' },
      { key: 'coreDialogue', label: '核心台词', placeholder: '角色标志性台词，如："男人，你成功引起了我的注意"' },
      { key: 'arcStage', label: '弧光阶段', placeholder: '角色弧光：觉醒→成长→蜕变' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人' },
      { value: 'friend', label: '闺蜜/兄弟' },
      { value: 'enemy', label: '宿敌' },
      { value: 'professional', label: '上下级' },
      { value: 'stranger', label: '陌生人' },
    ],
    cardFieldOrder: ['age', 'occupation', 'actorSuggestion', 'coreDialogue', 'arcStage'],
    quickHints: ['建议至少设置1个主角+1个反派', '主角需要有明确的目标和成长'],
  },
  'movie': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'deuteragonist', label: '男/女二号', icon: Shield, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'mentor', label: '导师', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'actorSuggestion', label: '演员建议', placeholder: '外形/气质/演技要求，如：需要有层次感的实力派演员...' },
      { key: 'coreDialogue', label: '核心台词/金句', placeholder: '角色标志性台词，如："生活就像一盒巧克力..."' },
      { key: 'arcStage', label: '弧光设计', placeholder: '起点→转折点→终点，如：自私→失去挚爱→懂得牺牲' },
      { key: 'screenTime', label: '戏份占比', placeholder: '如：主线40%、支线30%、客串30%' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人/爱人' },
      { value: 'friend', label: '挚友' },
      { value: 'enemy', label: '宿敌' },
      { value: 'mentor', label: '师徒/引导者' },
      { value: 'stranger', label: '陌生人/擦肩而过' },
    ],
    cardFieldOrder: ['age', 'actorSuggestion', 'screenTime', 'coreDialogue', 'arcStage'],
    quickHints: ['主角需要有清晰的弧光设计', '反派要有合理的动机，不能纯粹为坏而坏'],
  },
  'tv-drama': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'deuteragonist', label: '男/女二号', icon: Shield, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'friend', label: '闺蜜/兄弟', icon: User, color: 'bg-green-100 text-green-700 border-green-300' },
      { value: 'mentor', label: '导师/贵人', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'actorSuggestion', label: '演员建议', placeholder: '外形/气质要求，如：古装扮相英气的女演员...' },
      { key: 'emotionalArc', label: '情感走向', placeholder: '集数→情感状态，如：第1-10集：暗恋；第11-20集：热恋...' },
      { key: 'keyScenes', label: '关键场次', placeholder: '需要重场戏的集数和场景描述' },
      { key: 'pairing', label: '对手戏设计', placeholder: '与XX的CP感设计：欢喜冤家/相互扶持...' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人' },
      { value: 'friend', label: '闺蜜/兄弟' },
      { value: 'enemy', label: '死对头' },
      { value: 'professional', label: '上下级/同事' },
      { value: 'rival', label: '竞争者' },
    ],
    cardFieldOrder: ['age', 'occupation', 'pairing', 'emotionalArc', 'keyScenes'],
    quickHints: ['主角团配置：建议3-5人，有明确分工', '反派要有成长线，不能一坏到底'],
  },
  'variety': {
    roles: [
      { value: 'protagonist', label: '常驻MC', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'supporting', label: '嘉宾', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'minor', label: '观众/路人', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'persona', label: '人设定位', placeholder: '如：毒舌、暖心、学霸、搞笑担当...' },
      { key: 'style', label: '风格标签', placeholder: '如：高冷、话痨、呆萌、霸气...' },
      { key: 'interaction', label: '互动模式', placeholder: '与其他MC/嘉宾的互动特点' },
    ],
    relationshipTypes: [
      { value: 'team', label: '同团队' },
      { value: 'rival', label: '竞争对手' },
      { value: 'friend', label: '朋友' },
    ],
    cardFieldOrder: ['persona', 'style', 'interaction'],
    quickHints: ['MC需要有差异化的人设，形成互补', '每期嘉宾需要与节目调性匹配'],
  },
  'microfilm': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '对立面', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'minor', label: '配角', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'actorSuggestion', label: '演员建议', placeholder: '外形/气质要求' },
      { key: 'coreDialogue', label: '核心台词', placeholder: '角色的标志性台词' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人' },
      { value: 'friend', label: '朋友' },
      { value: 'stranger', label: '陌生人' },
    ],
    cardFieldOrder: ['age', 'occupation', 'actorSuggestion', 'coreDialogue'],
    quickHints: ['角色精简，控制在3-5人', '主角需要在短时间内完成弧光展现'],
  },
  'anime': {
    roles: [
      { value: 'protagonist', label: '主人公', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '宿敌/ Boss', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'friend', label: '伙伴/队友', icon: Shield, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'mentor', label: '导师/前辈', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'voiceActor', label: '声优建议', placeholder: '声线/代表作，如：成熟男低音，代表作《XX》...' },
      { key: 'appearance', label: '外形特征', placeholder: '发色/瞳色/服装特点/标志性动作' },
      { key: 'moePoint', label: '萌点/燃点', placeholder: '如：傲娇、三无、热血、中二...' },
      { key: 'transformation', label: '变身/成长设计', placeholder: '如：普通高中生→机甲战士，觉醒条件：危机时刻' },
    ],
    relationshipTypes: [
      { value: 'team', label: '队友' },
      { value: 'rival', label: '宿敌' },
      { value: 'mentor', label: '师徒' },
      { value: 'romantic', label: '暧昧/官配' },
      { value: 'family', label: '家人' },
    ],
    cardFieldOrder: ['age', 'voiceActor', 'appearance', 'moePoint', 'transformation'],
    quickHints: ['外形特征要具体，便于原画设计', '萌点/燃点设计要鲜明，便于角色立住'],
  },
  'audio-drama': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'voiceActor', label: '配音演员建议', placeholder: '声线特点，如：磁性低沉、有爆发力...' },
      { key: 'voiceStyle', label: '声音风格', placeholder: '如：播音腔、烟嗓、萝莉音、御姐音...' },
      { key: 'audioCue', label: '声音标识', placeholder: '标志性声音设计，如：笑声、叹息、特定口癖' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人' },
      { value: 'friend', label: '挚友' },
      { value: 'enemy', label: '宿敌' },
    ],
    cardFieldOrder: ['age', 'voiceActor', 'voiceStyle', 'audioCue'],
    quickHints: ['声音设计要符合角色性格', '注意区分不同角色的声线，避免混淆'],
  },
  'documentary': {
    roles: [
      { value: 'protagonist', label: '主人公/受访者', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'supporting', label: '相关人物', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'expert', label: '专家/学者', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    ],
    extraFields: [
      { key: 'realOrFictional', label: '真实/虚构', placeholder: '真实人物 or 虚构角色' },
      { key: 'appearanceMode', label: '出镜方式', placeholder: '出镜/画外音/受访/档案照片' },
      { key: 'background', label: '身份背景', placeholder: '职业/经历/与主题的关联' },
      { key: 'keyQuote', label: '核心语录', placeholder: '受访者的标志性观点或金句' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'colleague', label: '同事/同行' },
      { value: 'interview', label: '采访对象' },
      { value: 'expert', label: '专家顾问' },
    ],
    cardFieldOrder: ['realOrFictional', 'appearanceMode', 'background', 'keyQuote'],
    quickHints: ['真实人物需注明来源和授权情况', '受访者需要能清晰表达、有镜头感'],
  },

  // ==================== 小说类 ====================
  'novel': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'deuteragonist', label: '女主/男二', icon: Shield, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'antagonist', label: '反派/BOSS', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '支线人物', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
      { value: 'minor', label: '背景板/工具人', icon: User, color: 'bg-gray-50 text-gray-500 border-gray-200' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙事视角', placeholder: '第一人称/第三人称全知/第三人称限知' },
      { key: 'appearance', label: '外貌描写', placeholder: '面部特征/身材/衣着风格/标志性装扮' },
      { key: 'appearanceFreq', label: '出场频率', placeholder: '贯穿全书/中段出场/客串出场' },
      { key: 'teamPosition', label: '主角团定位', placeholder: '如：军师/战斗担当/情感核心/情报贩子' },
      { key: 'coreDialogue', label: '标志性语言', placeholder: '口头禅/说话风格，如：说话喜欢用"呵呵"...' },
    ],
    relationshipTypes: [
      { value: 'team', label: '主角团成员' },
      { value: 'rival', label: '宿敌' },
      { value: 'romantic', label: '暧昧/官配' },
      { value: 'mentor', label: '导师' },
      { value: 'mysterious', label: '神秘人物' },
      { value: 'tool', label: '工具人' },
    ],
    cardFieldOrder: ['age', 'viewpoint', 'appearance', 'appearanceFreq', 'teamPosition', 'coreDialogue'],
    quickHints: ['主角视角定位决定叙事方式', '主角团成员需有明确分工，避免同质化'],
  },
  'medium-story': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '对立面', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙事视角', placeholder: '第一人称/第三人称' },
      { key: 'appearance', label: '外貌特征', placeholder: '1-2句话的外貌勾勒' },
      { key: 'coreDialogue', label: '标志性语言', placeholder: '口头禅或说话风格' },
    ],
    relationshipTypes: [
      { value: 'romantic', label: '恋人' },
      { value: 'family', label: '家人' },
      { value: 'friend', label: '朋友' },
      { value: 'enemy', label: '对立' },
    ],
    cardFieldOrder: ['age', 'viewpoint', 'appearance', 'coreDialogue'],
    quickHints: ['角色控制在3-5人', '主角需要有清晰的目标和转变'],
  },
  'short-story': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '对立面', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'minor', label: '过客', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙事视角', placeholder: '第一人称/第三人称' },
      { key: 'appearance', label: '外貌特征', placeholder: '用一句话抓住最具辨识度的特征' },
    ],
    relationshipTypes: [
      { value: 'romantic', label: '恋人' },
      { value: 'family', label: '家人' },
      { value: 'stranger', label: '陌生人' },
    ],
    cardFieldOrder: ['viewpoint', 'appearance'],
    quickHints: ['短篇角色精简，1-3人为宜', '每个角色都要服务于核心主题'],
  },
  'micro-fiction': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'minor', label: '陪衬', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙事视角', placeholder: '第一人称/第三人称' },
    ],
    relationshipTypes: [
      { value: 'romantic', label: '恋人' },
      { value: 'family', label: '家人' },
      { value: 'stranger', label: '陌生人' },
    ],
    cardFieldOrder: ['viewpoint'],
    quickHints: ['微小说角色尽量控制在1-2人', '用最少的角色讲最完整的故事'],
  },

  // ==================== 文学类 ====================
  'poetry': {
    roles: [
      { value: 'narrator', label: '叙述者', icon: BookOpen, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'subject', label: '倾诉/吟咏对象', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙述视角', placeholder: '第一人称（我）/ 第二人称（你）/ 第三人称（他）' },
      { key: 'imagery', label: '意象寄托', placeholder: '如：以"月"寄托思乡，以"柳"寄托离别' },
      { key: 'emotionCore', label: '情感内核', placeholder: '怀人/咏物/言志/羁旅/闺怨/山水田园' },
      { key: 'artisticDevice', label: '艺术手法', placeholder: '比兴/用典/借景抒情/托物言志' },
    ],
    relationshipTypes: [
      { value: 'beloved', label: '思念之人' },
      { value: 'self', label: '自我投射' },
      { value: 'nature', label: '自然意象' },
    ],
    cardFieldOrder: ['viewpoint', 'imagery', 'emotionCore', 'artisticDevice'],
    quickHints: ['诗词角色更多是情感载体', '明确情感内核，选择合适的意象'],
  },
  'prose': {
    roles: [
      { value: 'narrator', label: '叙述者', icon: BookOpen, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'subject', label: '描写对象', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙述视角', placeholder: '第一人称/第三人称' },
      { key: 'emotionCore', label: '情感基调', placeholder: '温暖/感伤/哲思/怀旧/明快' },
      { key: 'tone', label: '文风调性', placeholder: '如：细腻温婉/冷峻克制/幽默诙谐' },
    ],
    relationshipTypes: [
      { value: 'beloved', label: '思念之人' },
      { value: 'family', label: '亲人' },
      { value: 'friend', label: '故友' },
      { value: 'self', label: '自我' },
    ],
    cardFieldOrder: ['viewpoint', 'emotionCore', 'tone'],
    quickHints: ['散文注重情感的真实与细腻', '选好情感基调，保持全文统一'],
  },
  'fairy-tale': {
    roles: [
      { value: 'protagonist', label: '小主人公', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'mentor', label: '智者/引路人', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
      { value: 'antagonist', label: '对立面', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '伙伴/配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'ageGroup', label: '适读年龄', placeholder: '3-6岁/7-10岁/亲子共读' },
      { key: 'appearance', label: '外形特征', placeholder: '如：大耳朵的小兔子，有一对蓝色的眼睛' },
      { key: 'moral', label: '寓意传达', placeholder: '如：勇气/善良/诚实/分享/友谊' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'friend', label: '朋友' },
      { value: 'mentor', label: '导师' },
      { value: 'enemy', label: '对立' },
    ],
    cardFieldOrder: ['ageGroup', 'appearance', 'moral'],
    quickHints: ['角色要有儿童可辨识的外形特征', '寓意要通过故事自然传达，不说教'],
  },
  'fable': {
    roles: [
      { value: 'protagonist', label: '主角（动物/人物）', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '对立面', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'mentor', label: '智者', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    ],
    extraFields: [
      { key: 'animalType', label: '动物类型', placeholder: '如：狐狸/狼/兔子/乌鸦/驴' },
      { key: 'moral', label: '寓言寓意', placeholder: '如：聪明反被聪明误/贪婪下场/团结力量大' },
      { key: 'style', label: '风格来源', placeholder: '伊索风格/中国古典/现代新编' },
    ],
    relationshipTypes: [
      { value: 'rival', label: '对手' },
      { value: 'predator', label: '捕食关系' },
      { value: 'wise', label: '智者引导' },
    ],
    cardFieldOrder: ['animalType', 'moral', 'style'],
    quickHints: ['动物形象要有鲜明特征', '寓意要简洁有力，一句话说明道理'],
  },

  // ==================== 曲艺/戏剧类 ====================
  'stage-play': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'stageDirection', label: '舞台指示', placeholder: '出场方式/站位/肢体动作要求' },
      { key: 'coreDialogue', label: '核心台词', placeholder: '角色最重要的几句台词' },
      { key: 'emotionArc', label: '情感走向', placeholder: '如：压抑→爆发→释然' },
    ],
    relationshipTypes: [
      { value: 'family', label: '家人' },
      { value: 'romantic', label: '恋人' },
      { value: 'enemy', label: '宿敌' },
      { value: 'friend', label: '挚友' },
    ],
    cardFieldOrder: ['age', 'stageDirection', 'coreDialogue', 'emotionArc'],
    quickHints: ['角色设计要考虑舞台呈现', '台词要有戏剧张力，适合舞台表达'],
  },
  'crosstalk': {
    roles: [
      { value: 'main', label: '逗哏（主）', icon: MessageCircle, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'supporting', label: '捧哏（辅）', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'minor', label: '配角/助演', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'roleDivision', label: '捧逗分工', placeholder: '逗：主导叙事、制造笑点；捧：接话、翻包袱' },
      { key: 'jokeType', label: '包袱类型', placeholder: '生理/伦理/谐音/反转/三翻四抖/文哏' },
      { key: 'languageStyle', label: '语言风格', placeholder: '如：怯口/贯口/倒口/书面语/口语化' },
      { key: 'coreDialogue', label: '标志性台词', placeholder: '口头禅或经典对白' },
    ],
    relationshipTypes: [
      { value: 'partner', label: '搭档' },
      { value: 'rival', label: '对立' },
      { value: 'audience', label: '与观众互动' },
    ],
    cardFieldOrder: ['roleDivision', 'jokeType', 'languageStyle', 'coreDialogue'],
    quickHints: ['捧逗要有鲜明分工和默契', '包袱设计要有层次，铺垫→翻抖'],
  },
  'sketch': {
    roles: [
      { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'supporting', label: '配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'roleDivision', label: '角色分工', placeholder: '如：一个认真一个糊涂，制造反差' },
      { key: 'comedyType', label: '喜剧类型', placeholder: '讽刺/温情/荒诞/无厘头/生活流' },
      { key: 'conflictDesign', label: '冲突设计', placeholder: '核心矛盾是什么，如何制造笑点' },
      { key: 'emotionalPoint', label: '煽情点', placeholder: '是否有煽情结尾，如有则设计在哪里' },
    ],
    relationshipTypes: [
      { value: 'partner', label: '搭档/夫妻' },
      { value: 'enemy', label: '对立' },
      { value: 'friend', label: '朋友' },
    ],
    cardFieldOrder: ['roleDivision', 'comedyType', 'conflictDesign', 'emotionalPoint'],
    quickHints: ['小品类角色2-3人为宜', '冲突设计要清晰，笑点要密集'],
  },

  // ==================== 歌词类 ====================
  'lyrics': {
    roles: [
      { value: 'narrator', label: '叙述者（我）', icon: Music, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'subject', label: '倾诉对象（你）', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'viewpoint', label: '叙述视角', placeholder: '第一人称（我）/ 第二人称（你）/ 第三人称' },
      { key: 'emotionCore', label: '情感内核', placeholder: '如：失恋疗伤/热恋甜蜜/追梦励志/亲情感恩' },
      { key: 'hookRole', label: 'Hook角色设定', placeholder: '副歌里的"你"是什么形象：前任/梦中人/理想' },
      { key: 'musicGenre', label: '音乐风格', placeholder: '流行/摇滚/民谣/R&B/说唱/古风' },
    ],
    relationshipTypes: [
      { value: 'beloved', label: '倾诉对象（你）' },
      { value: 'self', label: '自我对话' },
      { value: 'other', label: '第三人称' },
    ],
    cardFieldOrder: ['viewpoint', 'emotionCore', 'hookRole', 'musicGenre'],
    quickHints: ['叙述者决定了歌词的视角和情感走向', 'Hook角色的设定要清晰，便于副歌情感爆发'],
  },

  // ==================== 营销文类 ====================
  'speech': {
    roles: [
      { value: 'narrator', label: '演讲者', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'audience', label: '受众代表', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'speakerStyle', label: '演讲风格', placeholder: '如：激情澎湃/沉稳有力/幽默风趣/娓娓道来' },
      { key: 'audienceProfile', label: '受众画像', placeholder: '年龄/身份/诉求，如：应届大学毕业生' },
      { key: 'coreArgument', label: '核心论点', placeholder: '演讲要传达的最主要观点' },
    ],
    relationshipTypes: [
      { value: 'speaker', label: '演讲者本人' },
      { value: 'audience', label: '听众' },
    ],
    cardFieldOrder: ['speakerStyle', 'audienceProfile', 'coreArgument'],
    quickHints: ['演讲者风格要贯穿全文', '核心论点要能一句话概括'],
  },
  'brand-story': {
    roles: [
      { value: 'founder', label: '创始人/品牌', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'consumer', label: '用户/消费者', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'brandPersona', label: '品牌人设', placeholder: '如：匠人精神/年轻潮流/温情陪伴/科技创新' },
      { key: 'consumerPortrait', label: '目标消费者', placeholder: '画像描述，如：25-35岁都市女性，注重生活品质' },
      { key: 'coreStory', label: '核心故事线', placeholder: '如：从0到1的创业艰辛/几代人的传承坚守' },
    ],
    relationshipTypes: [
      { value: 'founder', label: '品牌创始人' },
      { value: 'consumer', label: '用户' },
      { value: 'history', label: '历史传承' },
    ],
    cardFieldOrder: ['brandPersona', 'consumerPortrait', 'coreStory'],
    quickHints: ['品牌人设要统一、有记忆点', '核心故事要有情感共鸣点'],
  },
  'wechat-article': {
    roles: [
      { value: 'author', label: '作者（我）', icon: BookOpen, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'reader', label: '读者（你）', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    extraFields: [
      { key: 'authorStyle', label: '作者人设', placeholder: '如：职场导师/情感博主/美食达人/科技观察者' },
      { key: 'readerProfile', label: '目标读者', placeholder: '画像，如：一二线城市30岁+职场女性' },
      { key: 'coreViewpoint', label: '核心观点', placeholder: '文章要传达的主要观点或价值' },
    ],
    relationshipTypes: [
      { value: 'author', label: '作者' },
      { value: 'reader', label: '读者' },
    ],
    cardFieldOrder: ['authorStyle', 'readerProfile', 'coreViewpoint'],
    quickHints: ['作者人设要鲜明，读者才有关注动机', '核心观点要能引发共鸣或讨论'],
  },
  'advertising': {
    roles: [
      { value: 'brand', label: '品牌/产品', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
      { value: 'consumer', label: '目标用户', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
      { value: 'testimonial', label: '用户见证', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
    ],
    extraFields: [
      { key: 'brandTone', label: '品牌调性', placeholder: '如：高端奢华/年轻活力/科技感/温暖亲和' },
      { key: 'consumerPortrait', label: '目标用户画像', placeholder: '年龄/职业/痛点/需求' },
      { key: 'sellingPoint', label: '核心卖点', placeholder: '产品最主打的一个卖点' },
      { key: 'callToAction', label: '行动号召', placeholder: '如：立即购买/扫码参与/限时优惠' },
    ],
    relationshipTypes: [
      { value: 'brand', label: '品牌' },
      { value: 'consumer', label: '用户' },
    ],
    cardFieldOrder: ['brandTone', 'consumerPortrait', 'sellingPoint', 'callToAction'],
    quickHints: ['卖点要聚焦，一个核心卖点打透', '行动号召要具体、有吸引力'],
  },
};

// 默认配置（未匹配到格式时使用）
const DEFAULT_CONFIG: FormatConfig = {
  roles: [
    { value: 'protagonist', label: '主角', icon: Crown, color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
    { value: 'antagonist', label: '反派', icon: Swords, color: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'supporting', label: '配角', icon: User, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'minor', label: '龙套', icon: User, color: 'bg-gray-100 text-gray-600 border-gray-300' },
  ],
  extraFields: [
    { key: 'actorSuggestion', label: '演员/形象建议', placeholder: '外形/气质/演技要求' },
    { key: 'coreDialogue', label: '核心台词', placeholder: '角色标志性台词' },
  ],
  relationshipTypes: [
    { value: 'family', label: '家人' },
    { value: 'romantic', label: '恋人' },
    { value: 'friend', label: '朋友' },
    { value: 'enemy', label: '敌人' },
  ],
  cardFieldOrder: ['age', 'occupation', 'actorSuggestion', 'coreDialogue'],
  quickHints: ['建议设置主角和反派以制造冲突'],
};

// 通用字段配置（所有格式都有）
const COMMON_FIELDS = [
  { key: 'name', label: '姓名', placeholder: '角色姓名', required: true },
  { key: 'role', label: '角色定位', placeholder: '选择定位', required: true },
  { key: 'age', label: '年龄', placeholder: '如：28', required: false },
  { key: 'occupation', label: '职业/身份', placeholder: '如：企业高管、医生', required: false },
  { key: 'background', label: '人物背景', placeholder: '描述角色的过去、成长环境、重要经历...', rows: 3, required: false },
  { key: 'motivation', label: '核心动机', placeholder: '角色最想要什么？推动故事发展的核心动力', rows: 2, required: false },
  { key: 'arc', label: '成长弧', placeholder: '角色经历了什么变化？', rows: 2, required: false },
];

// ==================== 组件主体 ====================
export default function CharacterManager({
  characters,
  onCharactersChange,
  outline: _outline,
  _outlineUnused: _unused,
  format,
  projectId,
}: CharacterManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPersonality, setNewPersonality] = useState('');

  // 云端同步 Hook
  const { syncStatus, lastSynced, save } = useCharacterSync({
    projectId,
    localData: characters,
    onLocalChange: onCharactersChange,
    debounceMs: 2000,
  });

  // 覆写保存方法，支持云端同步
  const handleSave = (newCharacters: Character[]) => {
    save(newCharacters);
  };

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

    const config = statusConfig[syncStatus];
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 text-xs ${config.color}`}>
        <Icon className={`w-4 h-4 ${config.animate ? 'animate-spin' : ''}`} />
        <span>{config.label}</span>
        {lastSynced && syncStatus === 'synced' && (
          <span className="text-gray-400">
            · {lastSynced.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    );
  };

  // 根据 format 获取配置
  const config = CHARACTER_CONFIGS[format || ''] || DEFAULT_CONFIG;

  // 动态表单数据
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    role: config.roles[0]?.value || 'protagonist',
    age: '',
    occupation: '',
    personality: [],
    background: '',
    motivation: '',
    arc: '',
    relationships: [],
    // 专属字段初始化
    ...Object.fromEntries(config.extraFields.map(f => [f.key, ''])),
  });

  const resetForm = () => {
    const initial: Record<string, any> = {
      name: '',
      role: config.roles[0]?.value || 'protagonist',
      age: '',
      occupation: '',
      personality: [],
      background: '',
      motivation: '',
      arc: '',
      relationships: [],
    };
    config.extraFields.forEach(f => {
      initial[f.key] = '';
    });
    setFormData(initial);
    setNewPersonality('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddCharacter = () => {
    if (!formData.name) return;

    const character: Character = {
      id: crypto.randomUUID(),
      name: formData.name,
      role: formData.role || 'protagonist',
      age: formData.age || '',
      occupation: formData.occupation || '',
      personality: formData.personality || [],
      background: formData.background || '',
      motivation: formData.motivation || '',
      arc: formData.arc || '',
      relationships: formData.relationships || [],
      // 附加专属字段
      ...Object.fromEntries(config.extraFields.map(f => [f.key, formData[f.key] || ''])),
    };

    handleSave([...characters, character]);
    resetForm();
  };

  const handleUpdateCharacter = () => {
    if (!editingId || !formData.name) return;

    const updatedCharacters = characters.map(c =>
      c.id === editingId
        ? {
            ...c,
            ...formData,
            personality: formData.personality || [],
            relationships: formData.relationships || [],
          }
        : c
    ) as Character[];

    handleSave(updatedCharacters);
    resetForm();
  };

  const handleEdit = (character: Character) => {
    setFormData({
      name: character.name,
      role: character.role,
      age: character.age,
      occupation: character.occupation,
      personality: character.personality,
      background: character.background,
      motivation: character.motivation,
      arc: character.arc,
      relationships: character.relationships,
      // 专属字段
      ...Object.fromEntries(config.extraFields.map(f => [f.key, (character as any)[f.key] || ''])),
    });
    setEditingId(character.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    handleSave(characters.filter(c => c.id !== id));
  };

  const handleAddPersonality = () => {
    if (!newPersonality.trim()) return;
    setFormData(f => ({
      ...f,
      personality: [...(f.personality || []), newPersonality.trim()],
    }));
    setNewPersonality('');
  };

  const handleRemovePersonality = (index: number) => {
    setFormData(f => ({
      ...f,
      personality: (f.personality || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleAddRelationship = (characterId: string) => {
    const targetCharacter = characters.find(c => c.id === characterId);
    if (!targetCharacter) return;

    const relationship: CharacterRelationship = {
      characterId,
      type: 'friend',
      description: '',
    };

    setFormData(f => ({
      ...f,
      relationships: [...(f.relationships || []), relationship],
    }));
  };

  const handleUpdateRelationship = (index: number, updates: Partial<CharacterRelationship>) => {
    setFormData(f => ({
      ...f,
      relationships: (f.relationships || []).map((r: CharacterRelationship, i: number) =>
        i === index ? { ...r, ...updates } : r
      ),
    }));
  };

  const handleRemoveRelationship = (index: number) => {
    setFormData(f => ({
      ...f,
      relationships: (f.relationships || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const protagonist = characters.find(c => c.role === 'protagonist' || c.role === 'main' || c.role === 'narrator');
  const antagonist = characters.find(c => c.role === 'antagonist');

  // 获取当前选中角色的图标和颜色
  const getRoleConfig = (roleValue: string) => {
    return config.roles.find(r => r.value === roleValue) || config.roles[0];
  };

  // 渲染卡片中的专属字段
  const renderCardExtraFields = (character: Character) => {
    return config.extraFields
      .filter(f => (character as any)[f.key])
      .map(f => (
        <p key={f.key} className="text-sm opacity-80 mb-1">
          <span className="font-medium">{f.label}：</span>
          {(character as any)[f.key]}
        </p>
      ));
  };

  return (
    <div className="space-y-8">
      {/* 同步状态指示器 */}
      <div className="flex items-center justify-between">
        {renderSyncIndicator()}
      </div>

      {/* 快捷提示 */}
      {config.quickHints.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-4">
          <div className="flex flex-wrap gap-2">
            {config.quickHints.map((hint, i) => (
              <span key={i} className="text-sm text-blue-700 bg-white/60 px-3 py-1 rounded-full flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />{hint}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => {
          const roleConfig = getRoleConfig(character.role);
          const RoleIcon = roleConfig?.icon || User;

          return (
            <div
              key={character.id}
              className={`rounded-xl border-2 p-4 ${roleConfig?.color || 'bg-gray-100 text-gray-700 border-gray-300'} relative`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{character.name}</h4>
                    <p className="text-sm opacity-80">
                      {character.age && `${character.age}岁`} {character.occupation}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(character)}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="p-2 bg-white/50 rounded-lg hover:bg-red-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {character.personality.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {character.personality.map((trait, index) => (
                    <span key={index} className="px-2 py-0.5 bg-white/50 rounded text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              {/* 渲染专属字段 */}
              {renderCardExtraFields(character)}

              {character.motivation && (
                <p className="text-sm opacity-80 mb-1">
                  <span className="font-medium">动机：</span>{character.motivation}
                </p>
              )}

              {character.arc && (
                <p className="text-sm opacity-80">
                  <span className="font-medium">成长弧：</span>{character.arc}
                </p>
              )}
            </div>
          );
        })}

        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-xl border-2 border-dashed border-gray-300 p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer min-h-[180px] flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-gray-500">添加人物</span>
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            {editingId ? '编辑人物' : '新增人物'}
            {format && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {format}
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="角色姓名"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* 角色定位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色定位 *
              </label>
              <select
                value={formData.role || config.roles[0]?.value}
                onChange={(e) => setFormData(f => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {config.roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* 年龄（通用） */}
            {COMMON_FIELDS.find(f => f.key === 'age') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年龄
                </label>
                <input
                  type="text"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(f => ({ ...f, age: e.target.value }))}
                  placeholder="如：28"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {/* 职业/身份（通用） */}
            {COMMON_FIELDS.find(f => f.key === 'occupation') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职业/身份
                </label>
                <input
                  type="text"
                  value={formData.occupation || ''}
                  onChange={(e) => setFormData(f => ({ ...f, occupation: e.target.value }))}
                  placeholder="如：企业高管、医生"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* 专属字段 */}
          {config.extraFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {config.extraFields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={field.rows || 2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* 性格特点（通用） */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性格特点
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPersonality}
                onChange={(e) => setNewPersonality(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPersonality();
                  }
                }}
                placeholder="添加性格特点..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <button
                onClick={handleAddPersonality}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.personality || []).map((trait: string, index: number) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {trait}
                  <button
                    onClick={() => handleRemovePersonality(index)}
                    className="ml-1 hover:text-red-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 动机 & 成长弧（通用） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                核心动机
              </label>
              <textarea
                value={formData.motivation || ''}
                onChange={(e) => setFormData(f => ({ ...f, motivation: e.target.value }))}
                placeholder="角色最想要什么？推动故事发展的核心动力"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                成长弧
              </label>
              <textarea
                value={formData.arc || ''}
                onChange={(e) => setFormData(f => ({ ...f, arc: e.target.value }))}
                placeholder="角色经历了什么变化？"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* 背景（通用） */}
          {COMMON_FIELDS.find(f => f.key === 'background') && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                人物背景
              </label>
              <textarea
                value={formData.background || ''}
                onChange={(e) => setFormData(f => ({ ...f, background: e.target.value }))}
                placeholder="描述角色的过去、成长环境、重要经历..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          )}

          {/* Relationships */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              人物关系
            </label>

            <div className="space-y-3 mb-3">
              {(formData.relationships || []).map((rel: CharacterRelationship, index: number) => {
                const relatedChar = characters.find(c => c.id === rel.characterId);
                return (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <span className="font-medium text-sm">{relatedChar?.name || '未知'}</span>
                    <select
                      value={rel.type}
                      onChange={(e) => handleUpdateRelationship(index, { type: e.target.value as CharacterRelationship['type'] })}
                      className="px-2 py-1 rounded border border-gray-200 text-sm"
                    >
                      {config.relationshipTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={rel.description}
                      onChange={(e) => handleUpdateRelationship(index, { description: e.target.value })}
                      placeholder="关系描述"
                      className="flex-1 px-2 py-1 rounded border border-gray-200 text-sm"
                    />
                    <button
                      onClick={() => handleRemoveRelationship(index)}
                      className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <select
              value=""
              onChange={(e) => handleAddRelationship(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="">添加人物关系...</option>
              {characters
                .filter(c => c.id !== editingId && !(formData.relationships || []).some((r: CharacterRelationship) => r.characterId === c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              }
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={editingId ? handleUpdateCharacter : handleAddCharacter}
              disabled={!formData.name}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {editingId ? '保存修改' : '添加人物'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Required Characters Reminder */}
      {characters.length > 0 && !protagonist && (
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
          <p className="text-cyan-700 text-sm">
            建议：添加主角以推动
            {format === 'lyrics' || format === 'poetry' ? '情感表达' :
             format === 'crosstalk' ? '叙事发展' :
             format === 'prose' ? '情感抒发' :
             format === 'sketch' ? '剧情推进' :
             format === 'stage-play' ? '戏剧冲突' :
             format === 'fable' ? '寓意传达' :
             format === 'fairy-tale' ? '奇幻冒险' : '故事发展'}
          </p>
        </div>
      )}

      {characters.length > 0 && !antagonist && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-red-700 text-sm">
            建议：添加{format === 'crosstalk' ? '对立角色' : format === 'poetry' || format === 'prose' || format === 'lyrics' ? '对立意象' : '反派'}以制造
            {format === 'lyrics' || format === 'poetry' ? '情感张力' :
             format === 'prose' ? '情感对比' :
             format === 'fable' || format === 'fairy-tale' ? '戏剧张力' : '戏剧冲突'}
          </p>
        </div>
      )}

      {characters.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>还没有添加人物</p>
          <p className="text-sm mt-1">点击上方按钮创建第一个角色</p>
        </div>
      )}
    </div>
  );
}
