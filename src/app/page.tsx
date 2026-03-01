"use client";
import { useState, useEffect } from 'react';
import RouletteWheel from '@/components/wheel/RouletteWheel';
import { parseSmartInput, RouletteItem } from '@/lib/parser';
import { useAuth } from '@/components/auth/AuthProvider';
import { TEMPLATES } from '@/lib/templates';

export default function MainPage() {
  const { user, signIn, logOut } = useAuth();
  const [input, setInput] = useState("짜장면, 짬뽕, 볶음밥\n마라탕*3");
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [result, setResult] = useState<string | null>(null);

  // 입력값이 변경될 때마다 파싱하여 룰렛에 반영
  useEffect(() => {
    setItems(parseSmartInput(input));
    setResult(null); // 입력 변경 시 이전 결과 숨김
  }, [input]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
            🎡 PickWheel
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ""} alt="profile" className="w-8 h-8 rounded-full border border-slate-200" />
                <span className="text-sm font-bold text-slate-700 hidden md:block">{user.displayName}님</span>
                <button onClick={logOut} className="text-xs font-medium text-slate-400 hover:text-slate-600">로그아웃</button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Panel: 스마트 입력 */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            {/* Template Selector */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button 
                  key={t.slug}
                  onClick={() => setInput(t.defaultInput.split(', ').join('\n'))}
                  className="p-3 text-xs font-bold border border-slate-50 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 transition-all text-slate-600 flex flex-col items-center gap-1 group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">{t.emoji}</span>
                  <span className="truncate w-full text-center">{t.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all">
              <label className="block text-lg font-bold text-slate-800 mb-2">항목 입력</label>
              <p className="text-sm text-slate-500 mb-4">줄바꿈, 콤마(,), 점(.) 등으로 자유롭게 구분하세요.<br/>가중치는 <b>*숫자</b> (예: 꽝*3)</p>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-56 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-slate-700 font-medium"
                placeholder="항목을 입력하세요..."
              />
              <div className="mt-4 text-sm text-slate-500 text-right">
                총 <b>{items.length}</b>개 항목 인식됨
              </div>
            </div>

            {/* 당첨 결과 알림 */}
            {result && (
              <div className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 shadow-2xl text-white transform transition-all animate-in fade-in zoom-in-95 duration-300">
                <h3 className="font-bold text-indigo-200 text-xs mb-1 uppercase tracking-widest">Congratulations!</h3>
                <div className="text-4xl font-black my-2 tracking-tight leading-tight">{result}</div>
                <button
                  onClick={() => setResult(null)}
                  className="mt-6 px-5 py-3 w-full bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
                >
                  COOL!
                </button>
              </div>
            )}

            {!user && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-dashed border-2">
                <p className="text-sm font-medium text-slate-500 mb-3 text-center">로그인하면 이전 기록을 보관할 수 있습니다.</p>
                <button onClick={signIn} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                  구글로 3초 로그인
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: 룰렛 휠 */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white p-6 md:p-12 rounded-[40px] shadow-sm border border-slate-200 w-full min-h-[600px]">
            <RouletteWheel items={items} onResult={(item) => setResult(item.text)} />
          </div>

        </div>
      </div>
    </main>
  );
}
