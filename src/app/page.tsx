"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RouletteWheel from '@/components/wheel/RouletteWheel';
import { parseSmartInput, RouletteItem } from '@/lib/parser';
import { useAuth } from '@/components/auth/AuthProvider';
import { TEMPLATES } from '@/lib/templates';

function RouletteContent() {
  const searchParams = useSearchParams();
  const { user, signIn, logOut, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("짜장면, 짬뽕, 볶음밥\n마라탕*3");
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const q = searchParams.get('input');
      if (q) setInput(decodeURIComponent(q));
    }
  }, [searchParams, mounted]);

  useEffect(() => {
    if (mounted) {
      setItems(parseSmartInput(input));
      setResult(null);
    }
  }, [input, mounted]);

  // 서버사이드 렌더링 시 레이아웃 깨짐 방지
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">LOADING...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter flex items-center gap-2">
            🎡 PICKWHEEL
          </h1>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3 bg-slate-50 p-1 pr-4 rounded-full border border-slate-100">
                <img src={user.photoURL || ""} alt="p" className="w-8 h-8 rounded-full border border-white shadow-sm" />
                <button onClick={logOut} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">로그아웃</button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                className="text-sm font-bold text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 flex flex-col gap-6 w-full sticky top-24">
            {/* Template Selector */}
            <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-200/50 grid grid-cols-4 gap-1">
              {TEMPLATES.map(t => (
                <button 
                  key={t.slug}
                  onClick={() => setInput(t.defaultInput.split(', ').join('\n'))}
                  title={t.title}
                  className="p-3 rounded-2xl hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-1 group active:scale-90"
                >
                  <span className="text-2xl group-hover:rotate-12 transition-transform">{t.emoji}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
              <label className="block text-xl font-black text-slate-800 mb-4 tracking-tight">ITEMS</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none text-slate-700 font-bold leading-relaxed text-lg shadow-inner"
                placeholder="항목을 입력하세요..."
              />
              <div className="mt-4 text-xs font-black text-slate-400 tracking-widest text-right">
                TOTAL {items.length} SLOTS
              </div>
            </div>

            {result && (
              <div className="bg-indigo-600 p-10 rounded-[2.5rem] border border-indigo-500 shadow-2xl text-white transform transition-all animate-in fade-in zoom-in-95 duration-500 shadow-indigo-500/40">
                <h3 className="font-black text-indigo-200 text-xs mb-2 uppercase tracking-[0.2em]">The Winner is</h3>
                <div className="text-4xl font-black my-4 tracking-tighter leading-tight drop-shadow-md">{result}</div>
                <button
                  onClick={() => setResult(null)}
                  className="mt-6 px-5 py-4 w-full bg-white text-indigo-600 rounded-3xl font-black hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
                >
                  GOT IT!
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white p-6 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-200 w-full min-h-[650px] relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
             <RouletteWheel items={items} onResult={(item) => setResult(item.text)} />
          </div>

        </div>
      </div>
    </main>
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">LOADING...</div>}>
      <RouletteContent />
    </Suspense>
  );
}
