export interface RouletteItem {
  id: string;
  text: string;
  weight: number;
  color: string;
}

const PALETTE = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#3b82f6", 
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#14b8a6",
  "#eab308", "#84cc16", "#ef4444"
];

export const parseSmartInput = (input: string): RouletteItem[] => {
  // 1. 공백만 있는 경우 처리
  if (!input.trim()) return [];

  // 2. 여러 가지 구분자(줄바꿈, 콤마, 세미콜론, 마침표)를 기준으로 항목 분리
  const rawItems = input
    .split(/[\\n,;.]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // 3. 가중치 파싱 (예: 사과*5) 및 색상 할당
  return rawItems.map((item, index) => {
    const parts = item.split("*");
    const text = parts[0].trim();
    
    let weight = 1;
    if (parts.length > 1) {
      const parsedWeight = parseInt(parts[1].trim(), 10);
      if (!isNaN(parsedWeight) && parsedWeight > 0) {
        weight = parsedWeight;
      }
    }
    
    return {
      id: `${index}-${text}`,
      text: text,
      weight: weight,
      color: PALETTE[index % PALETTE.length]
    };
  });
};
