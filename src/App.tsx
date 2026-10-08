import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Plus,
  Globe,
  Loader2,
  Sprout,
} from 'lucide-react';
import { FarmLocation, WeatherData, Language } from './types/weather';
import { fetchFarmWeather } from './services/weatherApi';
import { FarmBlock } from './components/FarmBlock';
import { AddFarmModal } from './components/AddFarmModal';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('agroeye_lang') as Language) || 'en';
  });

  // By default there should be NO farms
  const [farms, setFarms] = useState<FarmLocation[]>(() => {
    const saved = localStorage.getItem('agroeye_saved_farms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude any legacy demo farms
        return Array.isArray(parsed) ? parsed.filter((f: FarmLocation) => !f.isDemo) : [];
      } catch (e) {
        console.error('Failed to parse farms', e);
      }
    }
    return [];
  });

  const [activeFarmId, setActiveFarmId] = useState<string | null>(() => {
    return localStorage.getItem('agroeye_active_farm_id') || null;
  });

  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const isHi = lang === 'hi';

  // Toggle Language
  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('agroeye_lang', nextLang);
  };

  // Fetch weather for a farm
  const loadFarmWeather = useCallback(async (farm: FarmLocation, language: Language) => {
    setLoadingMap((prev) => ({ ...prev, [farm.id]: true }));
    try {
      const data = await fetchFarmWeather(farm.lat, farm.lng, farm.name, language);
      setWeatherMap((prev) => ({ ...prev, [farm.id]: data }));
    } catch (err) {
      console.error(`Failed to load weather for ${farm.name}:`, err);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [farm.id]: false }));
    }
  }, []);

  // Fetch weather for all farms when farms or language changes
  useEffect(() => {
    farms.forEach((f) => {
      loadFarmWeather(f, lang);
    });
  }, [farms, lang, loadFarmWeather]);

  // Persist farms
  useEffect(() => {
    localStorage.setItem('agroeye_saved_farms', JSON.stringify(farms));
    if (farms.length > 0 && (!activeFarmId || !farms.some((f) => f.id === activeFarmId))) {
      setActiveFarmId(farms[0].id);
      localStorage.setItem('agroeye_active_farm_id', farms[0].id);
    }
  }, [farms, activeFarmId]);

  // Add New Farm (Location only)
  const handleAddFarmLocation = (lat: number, lng: number, placeName: string) => {
    const newFarm: FarmLocation = {
      id: `farm_${Date.now()}`,
      name: placeName,
      lat,
      lng,
      isDemo: false,
    };

    const updated = [newFarm, ...farms];
    setFarms(updated);
    setActiveFarmId(newFarm.id);
    localStorage.setItem('agroeye_saved_farms', JSON.stringify(updated));
    localStorage.setItem('agroeye_active_farm_id', newFarm.id);
    loadFarmWeather(newFarm, lang);
  };

  // Delete Farm
  const handleDeleteFarm = (id: string) => {
    const updated = farms.filter((f) => f.id !== id);
    setFarms(updated);
    if (activeFarmId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null;
      setActiveFarmId(nextId);
      if (nextId) localStorage.setItem('agroeye_active_farm_id', nextId);
      else localStorage.removeItem('agroeye_active_farm_id');
    }
  };

  const currentFarm = farms.find((f) => f.id === activeFarmId) || farms[0];
  const currentWeatherData = currentFarm ? weatherMap[currentFarm.id] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header Bar matching AgroEye */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="h-16 px-4 max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-headline font-bold text-lg shadow-sm">
              🌱
            </div>
            <div>
              <span className="font-headline text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none block">
                AgroEye
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                {isHi ? 'मौसम एवं आपदा रडार' : 'Weather & Calamity Radar'}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add Farm, Demo Farm, Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Add New Farm Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isHi ? 'खेत जोड़ें' : 'Add Farm'}</span>
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={handleToggleLang}
              className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-headline text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHi ? 'EN' : 'HI (हिंदी)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Case A: Empty State (No farms added yet) */}
        {farms.length === 0 && (
          <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-4xl shadow-inner">
              <Sprout className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-extrabold text-slate-900 tracking-tight">
                {isHi ? 'कोई खेत नहीं जोड़ा गया' : 'No Farms Added Yet'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {isHi
                  ? 'अपने खेत का स्थान दर्ज करें ताकि आप वास्तविक तापमान, नमी, हवा की गति, 7 दिनों का पूर्वानुमान और आपदा चेतावनियाँ देख सकें।'
                  : 'Add your farm location to monitor live temperature, humidity, wind velocity, 7-day Open-Meteo forecast, and severe weather warnings.'}
              </p>
            </div>

            {/* Empty State Call to Action */}
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>{isHi ? '+ नया खेत जोड़ें' : '+ Add New Farm'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Case B: Farms Exist -> Farm Selector Tabs (if multiple farms) + Farm Block */}
        {farms.length > 0 && (
          <div className="space-y-4">
            {/* Multiple Farm Tabs (if user added more than 1 farm) */}
            {farms.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {farms.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFarmId(f.id)}
                    className={`h-9 px-3.5 rounded-xl font-headline text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 border ${
                      f.id === activeFarmId
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span>📍</span>
                    <span className="truncate max-w-[140px]">{f.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Farm Block */}
            {currentFarm && (
              <div>
                {loadingMap[currentFarm.id] && !currentWeatherData ? (
                  <div className="p-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3 shadow-xs">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="font-headline text-sm font-bold text-slate-700">
                      {isHi
                        ? 'ओपन-मेटियो से वास्तविक मौसम डेटा प्राप्त किया जा रहा है...'
                        : 'Fetching 100% live Open-Meteo meteorological feed...'}
                    </span>
                  </div>
                ) : currentWeatherData ? (
                  <FarmBlock
                    farm={currentFarm}
                    weather={currentWeatherData}
                    lang={lang}
                    onDeleteFarm={handleDeleteFarm}
                    onRefresh={() => loadFarmWeather(currentFarm, lang)}
                    isLoading={loadingMap[currentFarm.id]}
                  />
                ) : (
                  <div className="p-8 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-4 text-center shadow-xs">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h3 className="font-headline text-lg font-bold text-slate-900">{currentFarm.name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {currentFarm.lat.toFixed(4)}°N, {currentFarm.lng.toFixed(4)}°E
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadFarmWeather(currentFarm, lang)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-bold rounded-xl shadow-xs transition-colors"
                    >
                      {isHi ? 'मौसम डेटा लोड करें' : 'Load Farm Weather'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Add Farm Modal (Location Only) */}
      <AddFarmModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFarm={handleAddFarmLocation}
        lang={lang}
      />
    </div>
  );
}

export default App;
