import { TEMPLATES } from "@/lib/templates";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// 정적 배포를 위해 미리 경로 생성
export function generateStaticParams() {
  return TEMPLATES.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const template = TEMPLATES.find((t) => t.slug === params.slug);
  if (!template) return { title: "Not Found" };

  return {
    title: `${template.title} - PickWheel`,
    description: template.description,
    openGraph: {
      title: template.title,
      description: template.description,
    },
  };
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const template = TEMPLATES.find((t) => t.slug === params.slug);
  if (!template) notFound();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-6 animate-bounce">{template.emoji}</div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">{template.title}</h1>
      <p className="text-lg text-slate-500 mb-8 max-w-md">{template.description}</p>
      
      <Link 
        href={`/?input=${encodeURIComponent(template.defaultInput)}`}
        className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl hover:bg-indigo-700 transition-all shadow-2xl hover:scale-105 active:scale-95"
      >
        이 룰렛 바로 돌리기
      </Link>
      
      <Link href="/" className="mt-8 text-slate-400 font-bold hover:text-indigo-600 transition-colors">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
