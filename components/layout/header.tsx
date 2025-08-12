'use client';

import { ModeToggle } from '@/components/layout/mode-toggle';
import { useUnreadNotificationsCount } from '@/hooks/use-notifications';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: unreadCount } = useUnreadNotificationsCount();
  const notificationCount = unreadCount?.count || 0;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:ml-64">
        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}