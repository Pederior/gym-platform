import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // تشخیص اندازه صفحه
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // در موبایل، sidebar اولیه باید بسته باشد
      if (mobile) setIsSidebarCollapsed(true);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    // فقط در موبایل: toggle بین open/close
    // در دسکتاپ: toggle بین expanded/collapsed
    if (isMobile) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - فقط یکبار رندر شود */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        isMobile={isMobile}  // 👈 اضافه شده
      />
      
      {/* Main content */}
      <div 
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile ? 'mr-0' : (isSidebarCollapsed ? 'mr-16' : 'mr-64')
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}