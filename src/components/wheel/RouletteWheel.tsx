"use client";
import React, { useRef, useEffect, useState } from 'react';
import { RouletteItem } from '@/lib/parser';
import confetti from 'canvas-confetti';

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

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      return;
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = rotationAngle;

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

    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

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
    const spinAngle = (Math.random() * 5 + 5) * 2 * Math.PI; 
    const startAngle = currentRotationRef.current;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 4); 
      const currentAngle = startAngle + spinAngle * easeOut;
      
      currentRotationRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const winner = determineWinner(currentAngle);
        if (winner) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: items.map(i => i.color)
          });
          onResult(winner);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalAngle: number) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const normalizedAngle = finalAngle % (2 * Math.PI);
    let pointerAngle = (2 * Math.PI - normalizedAngle) % (2 * Math.PI);
    if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

    let accumulatedAngle = 0;
    for (const item of items) {
      const sliceAngle = (item.weight / totalWeight) * 2 * Math.PI;
      if (pointerAngle >= accumulatedAngle && pointerAngle < accumulatedAngle + sliceAngle) {
        return item;
      }
      accumulatedAngle += sliceAngle;
    }
    return items.length > 0 ? items[0] : null;
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
        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-3xl hover:bg-indigo-700 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
      >
        {isSpinning ? "SPINNING..." : "PUSH TO SPIN"}
      </button>
    </div>
  );
}
