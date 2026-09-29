import React from 'react';
import { Home, Video, Sun, ScanLine, User } from 'lucide-react';
import { Language } from '../types/weather';
import { translations } from '../i18n/translations';

interface BottomNavbarProps {
  lang: Language;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  threatCount?: number;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  lang,
  activeTab = 'weather',
  onSelectTab,
  threatCount = 0,
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'live', label: t.navLive, icon: Video, badge: 'live' },
    { id: 'weather', label: t.navWeather, icon: Sun, isActive: true },
    { id: 'detections', label: t.navDetections, icon: ScanLine, count: threatCount },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.id === activeTab || item.isActive;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(item.id)}
              className={`group flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all ${
                isItemActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`relative flex items-center justify-center px-3.5 py-1 rounded-full transition-all ${
                  isItemActive ? 'bg-emerald-50 text-emerald-700 shadow-2xs' : 'group-hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isItemActive ? 'text-emerald-700' : 'text-slate-600'}`} />

                {item.badge === 'live' && (
                  <>
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
                  </>
                )}

                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-headline text-[10px] flex items-center justify-center font-bold shadow-xs">
                    {item.count}
                  </span>
                )}
              </div>

              <span className="font-headline text-[11px] uppercase tracking-wider mt-0.5 font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
