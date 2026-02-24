import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, RefreshCw, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshLocation, setSession, session } = useAppContext();

  const isHome = location.pathname === '/';
  const title = location.pathname === '/settings' ? '设置' :
                location.pathname === '/districts' ? '商圈管理' :
                location.pathname.startsWith('/districts/') ? '商圈管理详情' : '';

  const handleReset = () => {
    if (window.confirm('确定要重置并回到场外模式吗？')) {
      setSession(null);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-lg">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {!isHome ? (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
            <ChevronLeft size={28} />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
        
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        
        {isHome ? (
          <div className="flex items-center space-x-2">
            {session && (
              <button onClick={handleReset} className="p-2 text-gray-600">
                <RefreshCw size={24} />
              </button>
            )}
            <button onClick={() => navigate('/settings')} className="p-2 text-gray-600">
              <Settings size={24} />
            </button>
          </div>
        ) : (
          <div className="w-10"></div>
        )}
      </header>
      
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};
