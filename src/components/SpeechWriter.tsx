import React, { useState } from 'react';
import { FileText, Sparkles, Mic, Users, Target, Clock, Volume2 } from 'lucide-react';

interface SpeechWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 演讲风格
const SPEECH_STYLES = [
  { id: 'passionate', name: '激情澎湃', desc: '情绪饱满，富有感染力' },
  { id: 'calm', name: '沉稳有力', desc: '语调平稳，逻辑清晰' },
  { id: 'humorous', name: '幽默风趣', desc: '轻松诙谐，寓教于乐' },
  { id: 'gentle', name: '娓娓道来', desc: '柔和细腻，以情动人' },
  { id: 'inspirational', name: '励志激励', desc: '振奋人心，鼓舞斗志' },
];

// 受众类型
const AUDIENCE_TYPES = [
  { id: 'students', name: '学生群体' },
  { id: 'professionals', name: '职场人士' },
  { id: 'entrepreneurs', name: '创业者' },
  { id: 'executives', name: '企业高管' },
  { id: 'general', name: '大众听众' },
];

// 演讲结构
const SPEECH_STRUCTURES = [
  { id: 'problem-solution', name: '问题-解决', desc: '提出问题→分析原因→给出方案' },
  { id: 'story-telling', name: '故事线', desc: '讲述故事→提炼感悟→行动号召' },
  { id: 'three-points', name: '三点式', desc: '观点一→观点二→观点三→总结升华' },
  { id: 'contrast', name: '对比式', desc: '过去/负面→现在/正面→对比冲击' },
];

const SpeechWriter: React.FC<SpeechWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [speechStyle, setSpeechStyle] = useState(SPEECH_STYLES[0]);
  const [audience, setAudience] = useState(AUDIENCE_TYPES[0]);
  const [structure, setStructure] = useState(SPEECH_STRUCTURES[0]);
  const [duration, setDuration] = useState('10'); // 分钟
  const [coreMessage, setCoreMessage] = useState(''); // 核心信息
  const [speechContent, setSpeechContent] = useState(initialContent);
  const [showGuide, setShowGuide] = useState(false);

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      style: speechStyle.name,
      audience: audience.name,
      structure: structure.name,
      duration,
      coreMessage,
      content: speechContent,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-cyan-600" />
          <h3 className="font-medium text-gray-800">演讲写作</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-gray-500 hover:text-cyan-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showGuide ? '隐藏指南' : '创作指南'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            保存演讲稿
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 演讲写作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 好的演讲要有清晰的核心信息，一句话能说清楚</li>
                <li>• 开场要抓人，结尾要有力，中间要有干货</li>
                <li>• {topic || '围绕选定主题'}，用具体案例或故事支撑观点</li>
                <li>• 注意演讲时长控制，语速适中</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">演讲标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入演讲标题..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
          </div>

          {/* 演讲风格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-cyan-500" />
                演讲风格
              </span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SPEECH_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSpeechStyle(style)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    speechStyle.id === style.id
                      ? 'bg-cyan-50 border-cyan-400'
                      : 'bg-white border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    speechStyle.id === style.id ? 'text-cyan-700' : 'text-gray-700'
                  }`}>
                    {style.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 受众 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                目标受众
              </span>
            </label>
            <select
              value={audience.id}
              onChange={(e) => setAudience(AUDIENCE_TYPES.find(a => a.id === e.target.value) || AUDIENCE_TYPES[0])}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            >
              {AUDIENCE_TYPES.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* 演讲时长 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                演讲时长
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="120"
                className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
              />
              <span className="text-gray-500">分钟</span>
              <span className="text-xs text-gray-400 ml-2">
                （约 {Math.round(parseInt(duration) * 200)} 字）
              </span>
            </div>
          </div>

          {/* 演讲结构 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-500" />
                演讲结构
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SPEECH_STRUCTURES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStructure(s)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    structure.id === s.id
                      ? 'bg-purple-50 border-purple-400'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    structure.id === s.id ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 核心信息 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              核心信息（一句话概括）
            </label>
            <textarea
              value={coreMessage}
              onChange={(e) => setCoreMessage(e.target.value)}
              placeholder="用一句话概括演讲的核心观点或价值..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 text-sm"
            />
          </div>

          {/* 演讲正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">演讲正文</label>
            <textarea
              value={speechContent}
              onChange={(e) => setSpeechContent(e.target.value)}
              placeholder="开始撰写你的演讲稿...

开场：引起注意，引入主题
正文：展开论述，案例支撑
结尾：总结升华，行动号召"
              rows={15}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {speechContent.length} 字
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechWriter;
