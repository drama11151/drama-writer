import { useState, useEffect } from 'react';
import { User, LogIn, UserPlus, Cloud, CloudOff, Settings, LogOut, Check, X, Mail, Lock, RefreshCw } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
  lastSyncAt?: string;
}

// ==================== 侧边栏入口组件 ====================
interface UserCenterSidebarProps {
  onOpen: () => void;
  isLoggedIn?: boolean;
  nickname?: string;
}

export function UserCenterSidebar({ onOpen, isLoggedIn, nickname }: UserCenterSidebarProps) {
  return (
    <button
      onClick={onOpen}
      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
      aria-label={isLoggedIn ? `用户中心 - ${nickname}` : '用户中心 - 登录/注册'}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">用户中心</h3>
            <p className="text-xs text-white">{isLoggedIn ? nickname : '登录/注册'}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </button>
  );
}

// ==================== 右侧弹出面板 ====================
interface UserCenterPanelProps {
  onClose: () => void;
}

export default function UserCenter({ onClose }: UserCenterPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('drama-writer-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      const mockUser: UserInfo = {
        id: 'user-' + Date.now(),
        email,
        nickname: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem('drama-writer-user', JSON.stringify(mockUser));
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } else {
      setError('请填写邮箱和密码');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password && nickname) {
      const mockUser: UserInfo = {
        id: 'user-' + Date.now(),
        email,
        nickname,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem('drama-writer-user', JSON.stringify(mockUser));
      setShowRegister(false);
      setEmail('');
      setPassword('');
      setNickname('');
    } else {
      setError('请填写所有必填项');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('drama-writer-user');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (user) {
      const updatedUser = { ...user, lastSyncAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('drama-writer-user', JSON.stringify(updatedUser));
    }
    
    setIsSyncing(false);
    setSyncStatus('success');
    setTimeout(() => setSyncStatus('idle'), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '从未';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full overflow-y-auto">
      {!isLoggedIn ? (
        // 未登录：显示登录/注册
        <div className="p-6 space-y-6">
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">欢迎回来</h3>
            <p className="text-sm text-gray-600">登录后可同步数据到云端</p>
          </div>
          
          {!showLogin && !showRegister ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                登录
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                注册账号
              </button>
            </div>
          ) : showLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">邮箱</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">密码</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-600/30 transition-all"
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => { setShowLogin(false); setError(''); }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                返回
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">昵称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="怎么称呼你"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">邮箱</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">密码</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-600/30 transition-all"
              >
                注册
              </button>
              <button
                type="button"
                onClick={() => { setShowRegister(false); setError(''); }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                返回
              </button>
            </form>
          )}
        </div>
      ) : (
        // 已登录：显示用户信息
        <div className="p-6 space-y-6">
          {/* 用户信息 */}
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
              {user?.nickname?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{user?.nickname}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* 云端同步 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                {user?.lastSyncAt ? (
                  <Cloud className="w-4 h-4 text-green-500" />
                ) : (
                  <CloudOff className="w-4 h-4 text-gray-400" />
                )}
                云端同步
              </span>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? '同步中' : '立即同步'}
              </button>
            </div>
            {syncStatus === 'success' && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                同步成功
              </div>
            )}
            <p className="text-xs text-gray-400">
              上次同步: {formatDate(user?.lastSyncAt)}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              账号设置
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
