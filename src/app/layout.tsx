"use client";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";
import Link from "next/link";
import { UtensilsCrossed, Calendar, LogOut, Search, MapPin, ChevronLeft, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState("");
  const [navCity, setNavCity] = useState("Select Location");

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(false);
      return;
    }
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled((prev) => {
        if (currentScroll > 320) return true;
        if (currentScroll < 240) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setNavSearchInput(params.get("search") || "");
      
      const city = params.get("city") || localStorage.getItem("selected_city") || "Select Location";
      setNavCity(city);
    }
  }, [pathname]);

  useEffect(() => {
    const handleCityUpdate = () => {
      const city = localStorage.getItem("selected_city") || "Select Location";
      setNavCity(city);
    };
    window.addEventListener("selected_city_changed", handleCityUpdate);
    return () => window.removeEventListener("selected_city_changed", handleCityUpdate);
  }, []);

  // Read auth state from localStorage — re-runs on pathname change AND on auth_changed event
  const readAuthFromStorage = () => {
    const isBusiness = pathname?.startsWith('/business');
    const isAdmin = pathname?.startsWith('/admin');
    let userKey = 'user_customer';
    if (isAdmin) userKey = 'user_super_admin';
    else if (isBusiness) userKey = 'user_business_admin';
    const userStr = localStorage.getItem(userKey);
    setUser(userStr ? JSON.parse(userStr) : null);
  };

  useEffect(() => {
    readAuthFromStorage();
  }, [pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Listen for auth_changed event so header updates immediately after
  // login/register inside the booking drawer (no page refresh needed)
  useEffect(() => {
    window.addEventListener('auth_changed', readAuthFromStorage);
    return () => window.removeEventListener('auth_changed', readAuthFromStorage);
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
              <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
                isHomePage && !scrolled
                  ? 'bg-black/40 backdrop-blur-md border-white/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <div className="flex justify-between items-center h-20 relative">
                    
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                      <div className="bg-rose-600 p-2 rounded-lg group-hover:scale-105 transition-transform logo-box">
                        <UtensilsCrossed size={24} className="text-white" />
                      </div>
                      <span className={`text-xl font-bold tracking-tight transition-all ${
                        (isHomePage && !scrolled) ? 'text-white' : 'text-foreground'
                      }`}>
                        Book My Bota
                      </span>
                    </Link>

                    {/* User Action Links */}
                    <div className="flex gap-4 sm:gap-6 items-center shrink-0">
                      {user ? (
                        <div className="flex items-center gap-4 sm:gap-6">
                          {user.role === 'customer' && (
                            <Link href="/customer/dashboard" className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                              isHomePage && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                            }`} title="My Reservations">
                              <Calendar size={18} className="sm:hidden" />
                              <span className="hidden sm:inline">My Reservations</span>
                            </Link>
                          )}
                          {user.role === 'business_admin' && (
                            <Link href="/business" className={`text-sm font-medium transition-colors ${
                              isHomePage && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}>
                              Dashboard
                            </Link>
                          )}
                          {user.role === 'super_admin' && (
                            <Link href="/admin" className={`text-sm font-medium transition-colors ${
                              isHomePage && !scrolled ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'
                            }`}>
                              Admin Panel
                            </Link>
                          )}
                          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-400 transition-colors cursor-pointer" title="Log out">
                            <LogOut size={18} className="sm:hidden" />
                            <span className="hidden sm:inline">Log out</span>
                          </button>
                        </div>
                      ) : (
                        <>
                           <Link
                             href="/business"
                             className={`px-2.5 py-1.5 text-[11px] sm:px-3.5 sm:py-2 sm:text-xs font-bold rounded-xl transition-all border whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                               isHomePage && !scrolled
                                 ? "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
                                 : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                             }`}
                           >
                             Partner with Us
                           </Link>
                          <Link href="/login" className="btn-primary text-sm px-5 py-2.5">
                            Sign In
                          </Link>
                        </>
                      )}
                    </div>

                  </div>

                  {/* Row 2: Mobile Sticky Search Capsule */}
                  {isHomePage && scrolled && (
                    <div className="md:hidden border-t border-slate-100 pt-2 pb-3">
                      <button
                        onClick={() => setMobileSearchActive(true)}
                        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin size={16} className="text-rose-600 shrink-0" />
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {navCity !== 'Select Location' ? navCity : 'Select Location'}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Search size={14} className="text-slate-500" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Full width mobile search overlay inside layout header */}
                  {isHomePage && scrolled && mobileSearchActive && (
                    <div className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 animate-fadeIn">
                      {/* Close button */}
                      <button 
                        onClick={() => setMobileSearchActive(false)}
                        className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      
                      {/* Combined Select + Input */}
                      <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 gap-2 min-w-0">
                        {/* City select */}
                        <div className="relative shrink-0">
                          <select 
                            value={navCity}
                            onChange={(e) => {
                              setNavCity(e.target.value);
                              localStorage.setItem('selected_city', e.target.value);
                              window.dispatchEvent(new Event('selected_city_changed'));
                            }}
                            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none appearance-none pr-4 max-w-[80px] truncate"
                          >
                            <option value="Select Location" disabled>City</option>
                            {["Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Pune", "Hyderabad"].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        <span className="h-4 w-px bg-slate-200 shrink-0"></span>
                        
                        {/* Search Input */}
                        <input 
                          type="text"
                          placeholder="Search restaurants, cuisines..."
                          value={navSearchInput}
                          onChange={(e) => setNavSearchInput(e.target.value)}
                          className="flex-1 bg-transparent text-xs text-slate-850 focus:outline-none py-1.5 min-w-0"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const params = new URLSearchParams(window.location.search);
                              if (navSearchInput) params.set('search', navSearchInput);
                              else params.delete('search');
                              if (navCity && navCity !== 'Select Location') params.set('city', navCity);
                              window.location.href = `/?${params.toString()}`;
                            }
                          }}
                        />
                        {navSearchInput && (
                          <button onClick={() => setNavSearchInput("")} className="text-slate-350 hover:text-slate-500 shrink-0">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      
                      {/* Go search */}
                      <button 
                        onClick={() => {
                          const params = new URLSearchParams(window.location.search);
                          if (navSearchInput) params.set('search', navSearchInput);
                          else params.delete('search');
                          if (navCity && navCity !== 'Select Location') params.set('city', navCity);
                          window.location.href = `/?${params.toString()}`;
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer shrink-0"
                      >
                        Search
                      </button>
                    </div>
                  )}

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
