import React, { useState } from 'react';
import { BookOpen, Sparkles, Lightbulb, Rabbit, Bird } from 'lucide-react';

interface FableWriterProps {
  initialContent?: string;
  onSave: (content: string) => void;
  inspiration?: string;
  topic?: string;
}

// 寓言类型
const FABLE_TYPES = [
  { id: 'animal', name: '动物寓言', desc: '以动物为主角', icon: Rabbit },
  { id: 'plant', name: '植物寓言', desc: '以植物为主角', icon: BookOpen },
  { id: 'object', name: '器物寓言', desc: '以物品为主角', icon: BookOpen },
  { id: 'mythical', name: '神话寓言', desc: '神仙妖怪为主', icon: Bird },
];

// 经典寓言角色
const CLASSIC_CHARACTERS = [
  '狼', '羊', '狐狸', '乌鸦', '老虎', '兔子', '蛇', '龟', '鹤', '乌鸦',
  '井底之蛙', '南郭先生', '叶公好龙', '画蛇添足', '亡羊补牢'
];

const FableWriter: React.FC<FableWriterProps> = ({
  initialContent = '',
  onSave,
  inspiration = '',
  topic = '',
}) => {
  const [title, setTitle] = useState('');
  const [fableType, setFableType] = useState(FABLE_TYPES[0]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [storyContent, setStoryContent] = useState('');
  const [moral, setMoral] = useState(''); // 寓意
  const [showGuide, setShowGuide] = useState(false);

  // 添加角色
  const addCharacter = (char: string) => {
    if (char && !characters.includes(char)) {
      setCharacters([...characters, char]);
    }
  };

  // 删除角色
  const removeCharacter = (char: string) => {
    setCharacters(characters.filter(c => c !== char));
  };

  // 自动保存
  const handleSave = () => {
    const fullContent = JSON.stringify({
      title,
      type: fableType.name,
      characters,
      story: storyContent,
      moral,
    });
    onSave(fullContent);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">寓言写作</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            {showGuide ? '隐藏指南' : '创作指南'}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            保存寓言
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 创作指南 */}
          {showGuide && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium mb-2">💡 创作提示</p>
              <ul className="space-y-1 text-amber-700">
                <li>• 寓言特点：篇幅短小，寓意深刻</li>
                <li>• 故事要生动有趣，能吸引读者</li>
                <li>• 寓意要鲜明，画龙点睛</li>
                <li>• {topic || '围绕选定主题'}，用小故事讲大道理</li>
              </ul>
            </div>
          )}

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">寓言名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入寓言名..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* 寓言类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">寓言类型</label>
            <div className="grid grid-cols-2 gap-2">
              {FABLE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFableType(type)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      fableType.id === type.id
                        ? 'bg-green-50 border-green-400'
                        : 'bg-white border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${fableType.id === type.id ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${fableType.id === type.id ? 'text-green-700' : 'text-gray-700'}`}>
                        {type.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 角色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                角色（可选）
              </span>
            </label>
            <div className="mb-2">
              <div className="flex flex-wrap gap-2">
                {characters.map((char) => (
                  <span
                    key={char}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {char}
                    <button
                      onClick={() => removeCharacter(char)}
                      className="text-blue-500 hover:text-blue-700 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {characters.length === 0 && (
                  <span className="text-sm text-gray-400">点击下方角色添加</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CLASSIC_CHARACTERS.filter(c => !characters.includes(c)).map((char) => (
                <button
                  key={char}
                  onClick={() => addCharacter(char)}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200"
                >
                  + {char}
                </button>
              ))}
            </div>
          </div>

          {/* 故事正文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">故事正文</label>
            <textarea
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              placeholder={`讲述一个${fableType.name}故事...\n\n注意：\n• 故事要简洁，不宜过长\n• 情节要生动有趣\n• 通过角色的行为展现主题\n• 为最后的寓意做铺垫`}
              rows={12}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {storyContent.length} 字
            </div>
          </div>

          {/* 寓意 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-green-800 mb-2">
              <span className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                寓意 / 道理
              </span>
            </label>
            <textarea
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              placeholder="这个寓言想要告诉读者什么道理？\n\n例如：\n• 不要贪婪，要知足常乐\n• 不要自作聪明，结果害了自己\n• 团结就是力量..."
              rows={3}
              className="w-full px-4 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
          </div>

          {/* 经典示例 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">经典寓言参考</label>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-amber-500">🐺</span>
                <div>
                  <p className="font-medium">《狼来了》</p>
                  <p className="text-xs text-gray-400">教育意义：做人要诚实，不要欺骗他人</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500">🐢</span>
                <div>
                  <p className="font-medium">《龟兔赛跑》</p>
                  <p className="text-xs text-gray-400">教育意义：坚持就是胜利，骄傲使人落后</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500">🦊</span>
                <div>
                  <p className="font-medium">《狐狸与葡萄》</p>
                  <p className="text-xs text-gray-400">教育意义：得不到就说不好，是自我安慰</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FableWriter;
