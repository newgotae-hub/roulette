export interface Template {
  slug: string;
  title: string;
  description: string;
  defaultInput: string;
  emoji: string;
}

export const TEMPLATES: Template[] = [
  {
    slug: "lunch",
    title: "점심 메뉴 추천 룰렛",
    description: "오늘 뭐 먹지? 고민될 때 돌리는 최고의 결정 도구입니다.",
    defaultInput: "짜장면, 짬뽕, 돈까스, 김치찌개, 샌드위치, 초밥, 제육볶음",
    emoji: "🍱"
  },
  {
    slug: "name-picker",
    title: "랜덤 이름 뽑기 돌림판",
    description: "교실, 모임, 이벤트에서 공정하게 당첨자를 뽑아보세요.",
    defaultInput: "김철수, 이영희, 박지민, 최준호, 정유미",
    emoji: "🙋‍♂️"
  },
  {
    slug: "yes-no",
    title: "Yes or No 결정 룰렛",
    description: "할까 말까 고민될 때는 운명에 맡겨보세요.",
    defaultInput: "YES, NO, YES*2, NO*2",
    emoji: "⚖️"
  },
  {
    slug: "penalty",
    title: "벌칙/미션 룰렛",
    description: "술자리나 모임에서 즐거운 벌칙 게임을 시작하세요!",
    defaultInput: "노래 한 곡, 엉덩이로 이름 쓰기, 편의점 다녀오기, 다음 게임 면제",
    emoji: "🎭"
  }
];
