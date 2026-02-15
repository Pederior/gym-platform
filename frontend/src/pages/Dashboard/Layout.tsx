import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const shouldShowSidebar = isMobile ? isMobileSidebarOpen : !isSidebarCollapsed;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={!shouldShowSidebar} 
        onToggle={toggleSidebar}
        isMobile={isMobile}  
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