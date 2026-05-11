"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, getUnreadNotificationsCount, markAsRead, markAllAsRead } from "@/lib/notification-actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Animação GSAP para entrada fluida das notificações
  useLayoutEffect(() => {
    if (isOpen && !isLoading && notifications.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".notification-item", {
          y: 15,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out"
        });
      }, listRef);
      return () => ctx.revert();
    }
  }, [isOpen, isLoading, notifications]);

  useEffect(() => {
    // Get current user ID
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUserId(data.user.id);
    });

    fetchUnreadCount();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload: any) => {
          if (currentUserId && payload.new.user_id === currentUserId) {
            fetchUnreadCount();
            if (isOpen) fetchNotifications();

            toast(payload.new.title, {
              description: payload.new.message,
              action: payload.new.action_url ? {
                label: "Ver",
                onClick: () => {
                   if (payload.new.action_url) {
                     setIsOpen(false);
                     router.push(payload.new.action_url);
                   }
                }
              } : undefined,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, currentUserId]);

  async function fetchUnreadCount() {
    const count = await getUnreadNotificationsCount();
    setUnreadCount(count);
  }

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const data = await getNotifications(10);
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open) fetchNotifications();
  }

  async function handleNotificationClick(notification: Notification) {
    if (!notification.is_read) {
      await markAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
    }

    if (notification.action_url) {
      setIsOpen(false);
      router.push(notification.action_url);
    }
  }

  async function handleMarkAllAsRead() {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex items-center justify-center rounded-full p-2.5 text-sm font-medium magnetic-hover bg-background border border-border/50 shadow-sm hover:shadow-md transition-all outline-none"
        >
          <Bell className="h-5 w-5 text-foreground/80" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white ring-2 ring-background">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 sm:w-96 p-0 rounded-[2.5rem] cinematic-glass overflow-hidden border-border/40 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/30">
          <h3 className="text-base font-bold tracking-tight">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10 rounded-full transition-all"
              onClick={handleMarkAllAsRead}
            >
              Marcar tudo
            </Button>
          )}
        </div>
        
        <div className="max-h-[420px] overflow-y-auto" ref={listRef}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="h-16 w-16 rounded-3xl bg-muted/30 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-bold">Tudo limpo por aqui</p>
              <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Você está em dia com todas as suas atualizações!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item flex flex-col gap-1.5 p-5 border-b border-border/10 last:border-0 cursor-pointer hover:bg-primary/5 transition-all relative ${!notification.is_read ? 'bg-primary/[0.02]' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sm tracking-tight ${!notification.is_read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {notification.title}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
