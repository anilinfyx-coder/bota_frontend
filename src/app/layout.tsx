"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { usePathname } from "next/navigation";
import { StoreProvider } from "@/providers/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminOrBusiness = pathname?.startsWith('/admin') || pathname?.startsWith('/business');
  const isHomePage = pathname === '/';

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const isBusiness = pathname?.startsWith('/business');
    const isAdmin = pathname?.startsWith('/admin');
    let userKey = 'user_customer';
    if (isAdmin) userKey = 'user_super_admin';
    else if (isBusiness) userKey = 'user_business_admin';

    const userStr = localStorage.getItem(userKey);
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    const isBusiness = pathname?.startsWith('/business');
    const isAdmin = pathname?.startsWith('/admin');
    let tokenKey = 'token_customer';
    let userKey = 'user_customer';
    if (isAdmin) {
      tokenKey = 'token_super_admin';
      userKey = 'user_super_admin';
    } else if (isBusiness) {
      tokenKey = 'token_business_admin';
      userKey = 'user_business_admin';
    }

    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    window.location.href = '/login';
  };

  return (
    <html lang="en" className={isAdminOrBusiness ? "admin-theme" : "customer-theme"}>
      <body className={inter.className}>
        <StoreProvider>
          {!isAdminOrBusiness && (
            <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${isHomePage
              ? 'bg-black/40 backdrop-blur-md border-white/10'
              : 'glass-panel border-border'
              }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-rose-600 p-2 rounded-lg group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                      <UtensilsCrossed size={24} className="text-white" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${isHomePage ? 'text-white' : 'text-foreground'}`}>Book My Bota</span>
                  </Link>

                  <div className="flex gap-6 items-center">
                    {user ? (
                      <div className="flex items-center gap-6">
                        {user.role === 'customer' && (
                          <Link href="/customer/dashboard" className={`text-sm font-medium transition-colors ${isHomePage ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                            My Reservations
                          </Link>
                        )}
                        {user.role === 'business_admin' && (
                          <Link href="/business" className={`text-sm font-medium transition-colors ${isHomePage ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                            Dashboard
                          </Link>
                        )}
                        {user.role === 'super_admin' && (
                          <Link href="/admin" className={`text-sm font-medium transition-colors ${isHomePage ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="text-sm font-medium text-rose-500 hover:text-rose-400 transition-colors cursor-pointer">
                          Log out
                        </button>
                      </div>
                    ) : (
                      <>
                        <Link href="/business" className={`text-sm font-medium transition-colors ${isHomePage ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                          Partner with Us
                        </Link>
                        <Link href="/login" className="btn-primary text-sm px-5 py-2.5">
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          )}
          <main className={!isAdminOrBusiness ? "pt-20" : ""}>
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
