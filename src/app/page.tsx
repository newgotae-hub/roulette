"use client";
import { useState, useEffect } from 'react';
import RouletteWheel from '@/components/wheel/RouletteWheel';
import { parseSmartInput, RouletteItem } from '@/lib/parser';

export default function MainPage() {
  const [input, setInput] = useState("짜장면, 짬뽕, 볶음밥\\n마라탕*3");
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
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            로그인 없이 즉시 사용
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Panel: 스마트 입력 */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 transition-all">
              <label className="block text-lg font-bold text-slate-800 mb-2">항목 입력</label>
              <p className="text-sm text-slate-500 mb-4">줄바꿈, 콤마(,), 점(.) 등으로 자유롭게 구분하세요.<br/>가중치는 <b>*숫자</b> (예: 꽝*3)</p>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-56 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-slate-700"
                placeholder="항목을 입력하세요..."
              />
              <div className="mt-4 text-sm text-slate-500 text-right">
                총 <b>{items.length}</b>개 항목 인식됨
              </div>
            </div>

            {/* 당첨 결과 알림 */}
            {result && (
              <div className="bg-indigo-600 p-6 rounded-3xl border border-indigo-500 shadow-xl text-white transform transition-all animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-bold text-indigo-200 text-sm mb-1">🎉 당첨 결과</h3>
                <div className="text-4xl font-black my-2 tracking-tight">{result}</div>
                <button
                  onClick={() => setResult(null)}
                  className="mt-4 px-5 py-2.5 w-full bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  확인
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: 룰렛 휠 */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200 w-full">
            <RouletteWheel items={items} onResult={(item) => setResult(item.text)} />
          </div>

        </div>
      </div>
    </main>
  );
}
