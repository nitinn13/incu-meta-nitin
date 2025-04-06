// src/layouts/StartupLayout.tsx

import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  CalendarClock, 
  LogOut, 
  Menu, 
  X, 
  UserCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/contexts/StartupAuthContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StartupLayoutProps {
  children: React.ReactNode;
}

export const StartupLayout = ({ children }: StartupLayoutProps) => {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPageTitle, setCurrentPageTitle] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/startup/login');
  };

  const navItems = [
    { path: '/startup/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/startup/announcements', label: 'Announcements', icon: <Bell size={18} /> },
    { path: '/startup/events', label: 'Upcoming Events', icon: <Calendar size={18} /> },
    { path: '/startup/schedules', label: 'Scheduled Meetings', icon: <CalendarClock size={18} /> },
  ];

  useEffect(() => {
    const currentItem = navItems.find(item => location.pathname.startsWith(item.path));
    if (currentItem) {
      setCurrentPageTitle(currentItem.label);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-white border-r ${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          <span className={`text-lg font-bold ${!sidebarOpen && 'hidden'}`}>Startup Panel</span>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        <nav className="flex flex-col p-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              {item.icon}
              {sidebarOpen && item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-b p-4">
          <h1 className="text-lg font-semibold">{currentPageTitle}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.photoURL || ''} alt="User" />
                  <AvatarFallback><UserCircle className="w-6 h-6" /></AvatarFallback>
                </Avatar>
                {user?.displayName || 'Startup'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
