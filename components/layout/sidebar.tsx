'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  Bell, 
  User, 
  LogOut, 
  Menu,
  X,
  Globe,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useLogout } from '@/hooks/use-auth-api';
import { useUnreadNotificationsCount } from '@/hooks/use-notifications';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Mes tâches', href: '/tasks/mine', icon: CheckSquare },
  { name: 'Tâches publiques', href: '/tasks/public', icon: Globe },
  { name: 'Créer une tâche', href: '/tasks/create', icon: Plus },
  { name: 'Mes abonnements', href: '/subscriptions', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profil', href: '/profile', icon: User },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <CheckSquare className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">ATodo</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isNotifications = item.name === 'Notifications';
            const notificationCount = unreadCount?.count || 0;

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary text-secondary-foreground'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                  {isNotifications && notificationCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-4 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{user?.fullName || 'Utilisateur'}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-background shadow-lg">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn('hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-background md:border-r', className)}>
        <NavContent />
      </div>
    </>
  );
}