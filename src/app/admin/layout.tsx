"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  FileText, 
  Users, 
  LogOut,
  Settings
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Global Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Businesses Onboarding', href: '/admin/businesses', icon: Store },
    { name: 'Subscription & Billing', href: '/admin/billing', icon: CreditCard },
    { name: 'Content Management', href: '/admin/content', icon: FileText },
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token_super_admin');
    localStorage.removeItem('user_super_admin');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-background admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/5 fixed h-full z-40 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-rose-600 p-1.5 rounded-lg text-white">
              <Settings size={20} />
            </span>
            Super Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Header */}
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
           <h1 className="text-xl font-semibold text-white">
              {navigation.find(n => n.href === pathname)?.name || 'Admin Panel'}
           </h1>
           <div className="flex items-center gap-4">
             <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer">
               <LogOut size={16} />
               <span>Sign Out</span>
             </button>
           </div>
        </header>
        
        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
