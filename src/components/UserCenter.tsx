import { useState, useEffect } from 'react';
import { User, LogIn, UserPlus, Cloud, CloudOff, Settings, LogOut, ChevronDown, ChevronUp, ChevronRight, Check, X, Mail, Lock, RefreshCw } from 'lucide-react';

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

export default function UserCenter() {
  const [isExpanded, setIsExpanded] = useState(false);
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
    
    // Demo login - in real app this would be an API call
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
    
    // Simulate sync
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-700 to-blue-700 flex items-center justify-between text-white hover:from-cyan-800 hover:to-blue-800 transition-all"
        aria-expanded={isExpanded}
        aria-controls="user-center-content"
      >
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" aria-hidden="true" />
          <span className="font-bold">用户中心</span>
          {isLoggedIn && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {user?.nickname}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="user-center-content" className="p-4">
          {!isLoggedIn ? (
            // Not logged in
            <div className="space-y-3">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-600 text-sm">登录后可同步数据到云端</p>
              </div>
              
              {!showLogin && !showRegister ? (
                <div className="space-y-2">
                    <button
                    onClick={() => setShowLogin(true)}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    登录
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    注册账号
                  </button>
                </div>
              ) : showLogin ? (
                <form onSubmit={handleLogin} className="space-y-3" aria-label="登录表单">
                  {error && (
                    <div id="login-error" className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg flex items-center gap-2" role="alert" aria-live="assertive">
                      <X className="w-4 h-4" aria-hidden="true" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="login-email" className="block text-sm text-gray-600 mb-1">邮箱</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="your@email.com"
                        autoComplete="email"
                        aria-describedby={error ? "login-error" : undefined}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm text-gray-600 mb-1">密码</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        aria-describedby={error ? "login-error" : undefined}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
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
                <form onSubmit={handleRegister} className="space-y-3" aria-label="注册表单">
                  {error && (
                    <div id="register-error" className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg flex items-center gap-2" role="alert" aria-live="assertive">
                      <X className="w-4 h-4" aria-hidden="true" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="register-nickname" className="block text-sm text-gray-600 mb-1">
                      昵称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="register-nickname"
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="怎么称呼你"
                      autoComplete="nickname"
                      required
                      aria-required="true"
                      aria-describedby={error ? "register-error" : undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor="register-email" className="block text-sm text-gray-600 mb-1">邮箱</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="your@email.com"
                        autoComplete="email"
                        aria-describedby={error ? "register-error" : undefined}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="register-password" className="block text-sm text-gray-600 mb-1">密码</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-describedby={error ? "register-error" : undefined}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
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
            // Logged in
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.nickname?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{user?.nickname}</h4>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Sync Status */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
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
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? '同步中' : '立即同步'}
                  </button>
                </div>
                {syncStatus === 'success' && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    同步成功
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  上次同步: {formatDate(user?.lastSyncAt)}
                </p>
              </div>

              {/* Settings */}
              <div className="space-y-2">
                <button className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                  aria-label="账号设置"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  账号设置
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-2"
                  aria-label="退出登录"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
