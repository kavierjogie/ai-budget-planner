import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';
import ChatBot from '@/components/chatbot/ChatBot';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user.id)
    .single();

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  const userName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar userName={userName} unreadCount={unreadCount || 0} />
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        {children}
      </main>
      <ChatBot />
    </div>
  );
}
