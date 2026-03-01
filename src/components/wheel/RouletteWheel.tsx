"use client";
import React, { useRef, useEffect, useState } from 'react';
import { RouletteItem } from '@/lib/parser';

interface Props {
  items: RouletteItem[];
  onResult: (item: RouletteItem) => void;
}

export default function RouletteWheel({ items, onResult }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const currentRotationRef = useRef(0);

  const drawWheel = (rotationAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 레티나 디스플레이 및 반응형 처리를 위한 기본 설정 (간단히 600 고정)
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30; // 포인터 여백 확보

    ctx.clearRect(0, 0, width, height);

    // 항목이 없을 때 기본 원 그리기
    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      return;
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = rotationAngle;

    // 조각 그리기
    items.forEach((item) => {
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // 텍스트 그리기
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(item.text, radius - 30, 0);
      ctx.restore();

      startAngle += sliceAngle;
    });

    // 중앙 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // 포인터 (우측 0도 위치)
    ctx.beginPath();
    ctx.moveTo(width - 35, centerY - 15);
    ctx.lineTo(width - 5, centerY);
    ctx.lineTo(width - 35, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#1e293b';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);

    const duration = 4000;
    // 최소 5바퀴 + 랜덤 바퀴 (난수)
    const spinAngle = (Math.random() * 5 + 5) * 2 * Math.PI; 
    const startAngle = currentRotationRef.current;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quartic Ease-Out 애니메이션 (자연스러운 감속)
      const easeOut = 1 - Math.pow(1 - progress, 4); 
      const currentAngle = startAngle + spinAngle * easeOut;
      
      currentRotationRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        determineWinner(currentAngle);
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalAngle: number) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    // 0도 (포인터 위치)를 기준으로 결과 계산
    const normalizedAngle = finalAngle % (2 * Math.PI);
    let pointerAngle = (2 * Math.PI - normalizedAngle) % (2 * Math.PI);
    if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

    let accumulatedAngle = 0;
    for (const item of items) {
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      if (pointerAngle >= accumulatedAngle && pointerAngle < accumulatedAngle + sliceAngle) {
        onResult(item);
        return;
      }
      accumulatedAngle += sliceAngle;
    }
    
    // 만약 예외 상황 발생시 안전 장치로 첫 번째 아이템 반환
    if(items.length > 0) onResult(items[0]);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="relative w-full aspect-square flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          className="w-full max-w-full h-auto drop-shadow-2xl rounded-full" 
        />
      </div>
      <button
        onClick={spin}
        disabled={isSpinning || items.length < 2}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:active:scale-100 disabled:shadow-none"
      >
        {isSpinning ? "회전 중..." : "SPIN!"}
      </button>
    </div>
  );
}
