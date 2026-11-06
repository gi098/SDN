"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Trash2, CheckCircle, UserPlus, ShieldAlert, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRealtimeSubscription } from "@/lib/realtimeClient";
import { useLanguage } from "@/lib/languageContext";

export default function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const userId = (session?.user as any)?.id;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef<number>(0);
  const prevNotifIdsRef = useRef<Set<string>>(new Set());

  const fetchNotifications = async (isPolling = false) => {
    if (!userId) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        const newNotifs: any[] = data.notifications || [];
        const newUnread: number = data.unreadCount || 0;

        if (isPolling) {
          const currentIds = new Set(newNotifs.map((n: any) => n.id));
          const brandNew = newNotifs.filter(
            (n: any) => !prevNotifIdsRef.current.has(n.id) && !n.isRead
          );

          if (brandNew.length > 0) {
            brandNew.forEach((notif: any) => {
              toast.custom(
                (tToast) => (
                  <div
                    className={`${
                      tToast.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-[#0c1222] text-white shadow-2xl rounded-2xl pointer-events-auto flex p-4 border border-emerald-500/30`}
                  >
                    <div className="flex-1 w-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            <Bell className="w-4 h-4 animate-bounce" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-xs font-bold text-white">{notif.title}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-l border-white/10 pl-3">
                      <button
                        onClick={() => toast.dismiss(tToast.id)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ),
                { duration: 5000 }
              );
            });
          }

          prevNotifIdsRef.current = currentIds;
        } else {
          prevNotifIdsRef.current = new Set(newNotifs.map((n: any) => n.id));
        }

        prevUnreadRef.current = newUnread;
        setNotifications(newNotifs);
        setUnreadCount(newUnread);
      }
    } catch {}
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  useRealtimeSubscription({
    channel: userId ? `user-${userId}` : null,
    onEvent: (event, data) => {
      if (event === "notification:new" && data) {
        setNotifications((prev) => {
          if (prev.find((n) => n.id === data.id)) return prev;
          prevNotifIdsRef.current.add(data.id);
          return [data, ...prev];
        });
        setUnreadCount((c) => c + 1);
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All marked as read");
      }
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await fetch("/api/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: notif.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = notifications.find((n) => n.id === id);
        if (deleted && !deleted.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "TASK_ASSIGNED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "TEAM_INVITATION":
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case "ROLE_UPDATED":
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-slate-950 shadow-sm ring-2 ring-[#070a12] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0c1222] p-4 shadow-2xl z-[100] border border-white/10 animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 px-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm">{t("notifications")}</h4>
              {unreadCount > 0 && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                {t("markAllRead")}
              </button>
            )}
          </div>

          {/* List of notifications */}
          <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                <Bell className="w-7 h-7 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">{t("noNotifications")}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all pt-3 ${
                    notif.isRead
                      ? "hover:bg-white/5 opacity-75"
                      : "bg-emerald-500/10 hover:bg-emerald-500/15 border-l-2 border-emerald-400"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-white/10 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNotification(e, notif.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-white/10 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
