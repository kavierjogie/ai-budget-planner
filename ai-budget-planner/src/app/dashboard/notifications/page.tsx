'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, RefreshCcw, AlertCircle, Target, Lightbulb } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Notification } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { EmptyState, LoadingSpinner, Badge } from '@/components/ui';

const notifIcons: Record<string, React.ReactNode> = {
  missed_expense: <RefreshCcw size={16} className="text-amber-400" />,
  goal_progress: <Target size={16} className="text-emerald-400" />,
  budget_alert: <AlertCircle size={16} className="text-red-400" />,
  tip: <Lightbulb size={16} className="text-indigo-400" />,
};

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setNotifications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    setMarking(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    await fetchNotifications();
    setMarking(false);
  };

  const markRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteNotification = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead} loading={marking}>
            <CheckCheck size={14} />
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent>
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell size={28} />}
              title="No notifications"
              description="You're all caught up. Notifications for recurring expenses, goal milestones, and budget alerts will appear here."
            />
          ) : (
            <div className="divide-y divide-slate-700/50">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 py-4 group transition-colors ${!notif.is_read ? 'bg-indigo-500/3' : ''}`}
                  onClick={() => { if (!notif.is_read) markRead(notif.id); }}
                >
                  <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${!notif.is_read ? 'bg-slate-700' : 'bg-slate-700/50'}`}>
                    {notifIcons[notif.type] || <Bell size={16} className="text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${!notif.is_read ? 'text-slate-200' : 'text-slate-400'}`}>
                          {notif.title}
                          {!notif.is_read && <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400 align-middle" />}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-slate-600 mt-1">{formatDate(notif.created_at)}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 rounded-lg p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
