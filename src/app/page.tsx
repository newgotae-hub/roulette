"use client";
import { useState, useEffect } from 'react';
import RouletteWheel from '@/components/wheel/RouletteWheel';
import { parseSmartInput, RouletteItem } from '@/lib/parser';
import { useAuth } from '@/components/auth/AuthProvider';
import { TEMPLATES } from '@/lib/templates';

export default function MainPage() {
  const { user, signIn, logOut, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("짜장면, 짬뽕, 볶음밥\n마라탕*3");
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [result, setResult] = useState<string | null>(null);

  // 하이드레이션 오류 방지용 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setItems(parseSmartInput(input));
      setResult(null);
    }
  }, [input, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold">로딩 중...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
            🎡 PickWheel
          </h1>
          <div className="flex items-center gap-4">
            {loading ? (
              <span className="text-xs text-slate-400">...</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ""} alt="p" className="w-8 h-8 rounded-full border border-slate-200" />
                <span className="text-sm font-bold text-slate-700 hidden md:block">{user.displayName}</span>
                <button onClick={logOut} className="text-xs font-medium text-slate-400">로그아웃</button>
              </div>
            ) : (
              <button onClick={signIn} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">로그인</button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button 
                  key={t.slug}
                  onClick={() => setInput(t.defaultInput.split(', ').join('\n'))}
                  className="p-3 text-xs font-bold border border-slate-50 rounded-2xl hover:bg-indigo-50 text-slate-600 flex flex-col items-center gap-1 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{t.emoji}</span>
                  <span className="truncate w-full text-center">{t.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all">
              <label className="block text-lg font-bold text-slate-800 mb-2">항목 입력</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-56 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-slate-700 font-medium"
              />
            </div>

            {result && (
              <div className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 shadow-2xl text-white transform transition-all animate-in fade-in zoom-in-95">
                <div className="text-4xl font-black mb-4">{result}</div>
                <button onClick={() => setResult(null)} className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black">확인</button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white p-6 md:p-12 rounded-[40px] shadow-sm border border-slate-200 w-full min-h-[600px]">
            <RouletteWheel items={items} onResult={(item) => setResult(item.text)} />
          </div>
        </div>
      </div>
    </main>
  );
}
