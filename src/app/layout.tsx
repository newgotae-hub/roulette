import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'PickWheel - 초간단 랜덤 룰렛 돌림판',
  description: '로그인 없이 즉시 사용하는 세련된 랜덤 룰렛. 점심 메뉴, 이름 뽑기, 경품 추첨을 쉽고 빠르게 해결하세요!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans bg-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
