import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User as UserIcon, Menu, X, Book, Code, Trophy, Home } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/courses', label: '课程', icon: Book },
    { path: '/data-analysis', label: '实战项目', icon: Code },
    { path: '/achievements', label: '成就', icon: Trophy },
  ];

  return (
    <>
      {/* 桌面导航栏 */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-primary py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-white'}`}
            >
              数据分析学习平台
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(path)
                      ? isScrolled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-white text-primary hover:bg-white/90'
                  }`}
                >
                  <UserIcon size={16} />
                  {user.email?.split('@')[0]}
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    登录
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-white text-primary hover:bg-white/90'
                    }`}
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
            
            {/* 移动端菜单按钮 */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 shadow-lg">
          <div className="px-4 py-6 space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
            
            <div className="border-t pt-4 mt-4">
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium bg-primary/10 text-primary"
                >
                  <UserIcon size={20} />
                  {user.email?.split('@')[0]}
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                  >
                    登录
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-base font-medium bg-primary text-white hover:bg-primary/90"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 面包屑导航组件
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.path ? (
            <Link
              to={item.path}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// 页脚组件
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">数据分析学习平台</h3>
            <p className="text-sm text-gray-400">
              专为商务数据分析与应用专业学生设计的在线学习平台
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-white transition-colors">课程中心</Link></li>
              <li><Link to="/data-analysis" className="hover:text-white transition-colors">实战项目</Link></li>
              <li><Link to="/achievements" className="hover:text-white transition-colors">成就中心</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">学习路径</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-white transition-colors">Python基础</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">数据分析</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">数据可视化</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">帮助与支持</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">常见问题</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">联系我们</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">使用条款</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 数据分析学习平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};
