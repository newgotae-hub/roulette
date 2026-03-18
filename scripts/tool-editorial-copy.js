const EDITORIAL_LABELS = {
  ko: {
    title: "실전 운영 기준",
    fit: "잘 맞는 상황",
    avoid: "다른 도구가 나은 상황",
    checklist: "운영 전 체크",
    mistakes: "자주 생기는 오해"
  },
  en: {
    title: "Practical use guide",
    fit: "Best fit",
    avoid: "Use another tool when",
    checklist: "Before you start",
    mistakes: "Common mistakes"
  },
  ja: {
    title: "実務運用ガイド",
    fit: "向いている場面",
    avoid: "別のツールがよい場面",
    checklist: "開始前の確認",
    mistakes: "よくある誤解"
  },
  "zh-cn": {
    title: "实际使用指南",
    fit: "适合的场景",
    avoid: "更适合其他工具的场景",
    checklist: "开始前检查",
    mistakes: "常见误解"
  },
  "zh-tw": {
    title: "實際使用指南",
    fit: "適合的場景",
    avoid: "更適合其他工具的場景",
    checklist: "開始前檢查",
    mistakes: "常見誤解"
  },
  es: {
    title: "Guia practica de uso",
    fit: "Cuando encaja bien",
    avoid: "Cuando conviene otra herramienta",
    checklist: "Antes de empezar",
    mistakes: "Errores habituales"
  },
  fr: {
    title: "Guide d'utilisation pratique",
    fit: "Quand cet outil convient",
    avoid: "Quand un autre outil est preferable",
    checklist: "A verifier avant de commencer",
    mistakes: "Erreurs frequentes"
  },
  de: {
    title: "Praxisleitfaden",
    fit: "Geeignete Einsatze",
    avoid: "Wann ein anderes Tool besser ist",
    checklist: "Vor dem Start prufen",
    mistakes: "Haufige Missverstandnisse"
  },
  "pt-br": {
    title: "Guia pratico de uso",
    fit: "Quando faz sentido",
    avoid: "Quando outra ferramenta e melhor",
    checklist: "Antes de começar",
    mistakes: "Erros comuns"
  },
  hi: {
    title: "व्यावहारिक उपयोग मार्गदर्शिका",
    fit: "कब यह सही है",
    avoid: "कब दूसरा टूल बेहतर है",
    checklist: "शुरू करने से पहले",
    mistakes: "आम गलतफहमियां"
  },
  ar: {
    title: "دليل الاستخدام العملي",
    fit: "متى تكون مناسبة",
    avoid: "متى تكون أداة اخرى افضل",
    checklist: "ما يجب مراجعته قبل البدء",
    mistakes: "أخطاء شائعة"
  },
  ru: {
    title: "Практическое руководство",
    fit: "Когда инструмент подходит",
    avoid: "Когда лучше другой инструмент",
    checklist: "Что проверить до запуска",
    mistakes: "Частые ошибки"
  },
  id: {
    title: "Panduan penggunaan praktis",
    fit: "Saat alat ini cocok",
    avoid: "Saat alat lain lebih tepat",
    checklist: "Sebelum mulai",
    mistakes: "Kesalahan yang sering terjadi"
  },
  tr: {
    title: "Pratik kullanim rehberi",
    fit: "Uygun oldugu durumlar",
    avoid: "Baska bir arac daha iyi oldugunda",
    checklist: "Baslamadan once",
    mistakes: "Yaygin hatalar"
  },
  it: {
    title: "Guida pratica all'uso",
    fit: "Quando funziona bene",
    avoid: "Quando e meglio un altro strumento",
    checklist: "Da controllare prima di iniziare",
    mistakes: "Errori frequenti"
  },
  vi: {
    title: "Huong dan su dung thuc te",
    fit: "Khi cong cu nay phu hop",
    avoid: "Khi cong cu khac phu hop hon",
    checklist: "Can kiem tra truoc khi dung",
    mistakes: "Nhung hieu nham thuong gap"
  },
  th: {
    title: "แนวทางใช้งานจริง",
    fit: "สถานการณ์ที่เหมาะ",
    avoid: "เมื่อเครื่องมืออื่นเหมาะกว่า",
    checklist: "ตรวจก่อนเริ่ม",
    mistakes: "ความเข้าใจผิดที่พบบ่อย"
  },
  nl: {
    title: "Praktische gebruiksgids",
    fit: "Wanneer dit goed past",
    avoid: "Wanneer een andere tool beter is",
    checklist: "Controleer vooraf",
    mistakes: "Veelgemaakte fouten"
  }
};

const TOOL_EDITORIAL_COPY = {
  ko: {
    roulette: {
      intro: "룰렛은 참가자 명단을 화면에 그대로 보여 주면서 한 명씩 뽑아야 할 때 가장 설명이 쉬운 추첨 방식입니다.",
      fit: "행사 경품, 발표자 선정, 질문 순서처럼 누가 후보였는지를 모두가 함께 봐야 하는 상황에 잘 맞습니다.",
      avoid: "좌석번호·응모권처럼 숫자 범위가 핵심이거나, 참가자와 결과를 한 번에 매칭해야 하면 번호 추첨기나 사다리타기가 더 적합합니다.",
      checklist: "중복 이름이 실제 중복 참여인지 확인하고, 당첨자 제외와 재추첨 규칙을 시작 전에 공지한 뒤, 여러 라운드면 기록을 저장해 두는 편이 좋습니다.",
      mistakes: "애니메이션 길이가 확률을 바꾸는 것은 아니며, 같은 이름을 여러 번 넣으면 그만큼 확률이 올라가고, 결과 후 명단을 바꾸면 공정성 설명이 어려워집니다."
    },
    luckydraw: {
      intro: "번호 추첨기는 사람 이름보다 번호 자체가 결과의 기준일 때 더 명확한 도구입니다.",
      fit: "응모권, 좌석 번호, 대기 번호, 쿠폰 코드처럼 범위와 중복 허용 여부를 먼저 설명해야 하는 추첨에 잘 맞습니다.",
      avoid: "참가자 목록을 그대로 공개해야 하거나 결과를 상품·벌칙과 연결해 보여줘야 하면 룰렛이나 사다리타기가 더 직관적입니다.",
      checklist: "최소값과 최대값, 중복 허용 여부, 재추첨 조건을 먼저 정하고 실제 사용 번호 범위가 맞는지 한 번 더 검수해야 합니다.",
      mistakes: "번호 범위를 잘못 잡거나 티켓 번호와 참가자 수를 혼동하거나 선행 0이 있는 번호 표기를 무시하면 현장에서 바로 이의가 생깁니다."
    },
    ladder: {
      intro: "사다리타기는 참가자와 결과를 한 번에 연결해야 할 때 설명력이 높은 공개 추첨 방식입니다.",
      fit: "상품 배정, 벌칙 배정, 발표 순서, 역할 나누기처럼 누가 무엇에 연결됐는지를 한 화면에서 보여줘야 할 때 잘 맞습니다.",
      avoid: "단순히 한 명만 뽑는 추첨이나 숫자 범위를 관리하는 작업에는 룰렛이나 번호 추첨기가 더 간단합니다.",
      checklist: "참가자 수와 결과 수를 맞추고, 시작 전에 라벨을 확정한 다음, 공개 진행이라면 전체 보드가 보이는 상태에서 시작하는 것이 좋습니다.",
      mistakes: "결과를 공개한 뒤 라벨을 바꾸거나, 참가자와 결과 개수가 다르거나, 중간 과정을 생략하면 신뢰를 잃기 쉽습니다."
    },
    coinflip: {
      intro: "코인 던지기는 두 선택지 중 하나를 아주 빠르게 정해야 할 때 가장 부담이 적은 랜덤 도구입니다.",
      fit: "선공/후공, 예/아니오, 진행 순서처럼 결과가 정확히 두 개뿐이고 긴 설명이 필요 없는 상황에 잘 맞습니다.",
      avoid: "후보가 셋 이상이거나 가중치가 필요하거나 당첨자 추첨처럼 기록과 검토가 중요한 경우에는 다른 도구가 더 적합합니다.",
      checklist: "결과 두 개가 무엇인지 먼저 합의하고, 단판인지 여러 번 던질지 정한 뒤, 반복 결정이라면 이력 확인 기준도 미리 정하는 편이 안전합니다.",
      mistakes: "연속해서 같은 면이 나와도 이상한 일이 아니며, 코인 던지기는 복잡한 의사결정을 공정해 보이게 포장하는 용도로 쓰면 오히려 신뢰를 잃습니다."
    },
    dice: {
      intro: "주사위 굴리기는 게임 수치, 확률 수업, 반복 라운드 결과처럼 숫자 합계와 분포가 중요한 상황에 맞는 도구입니다.",
      fit: "보드게임, TRPG, 수업 실험, 간단한 점수 이벤트처럼 눈금 결과와 여러 번의 기록이 의미를 갖는 경우에 잘 맞습니다.",
      avoid: "참가자 명단에서 한 명을 뽑거나 팀을 공정하게 나누는 목적이면 룰렛이나 팀 나누기 도구가 더 자연스럽습니다.",
      checklist: "주사위 개수와 면 수, 합계만 볼지 개별 눈을 볼지, 재굴림 규칙을 먼저 정하고 반복 결과가 중요하면 이력을 남겨야 합니다.",
      mistakes: "주사위를 여러 개 쓰면 결과가 가운데로 몰리기 쉽고, 평균값과 분포를 무시한 채 단일 결과만 보고 공정성을 판단하면 해석이 틀어집니다."
    },
    "team-generator": {
      intro: "팀 나누기는 그냥 섞는 것보다 왜 이 조합이 나왔는지를 설명해야 할 때 가치가 커지는 도구입니다.",
      fit: "친목 모임처럼 빠른 랜덤 편성이 필요할 때도 쓰기 좋고, 경기나 워크숍처럼 전력 차이를 줄여야 할 때는 점수 밸런스 모드가 더 적합합니다.",
      avoid: "참가자 수가 계속 바뀌거나 점수가 오래된 상태라면 균형 결과가 오히려 불만을 만들 수 있으니, 그런 경우에는 완전 랜덤이 더 낫습니다.",
      checklist: "명단 오탈자와 결원 여부를 먼저 정리하고, 팀 수를 확정한 뒤, 점수 기준이 현재 실력을 반영하는지 확인하고 생성 결과를 바로 공유해야 합니다.",
      mistakes: "밸런스 모드가 완벽한 동등 전력을 보장한다고 설명하거나, 빈 점수와 최근 변동을 무시하거나, 생성 후 임의로 인원을 교체하면 공정성 설명이 무너집니다."
    }
  },
  en: {
    roulette: {
      intro: "The wheel works best when people need to see the full participant list and watch one name get selected in public.",
      fit: "It suits giveaways, presenter picks, classroom turns, and any draw where the visible roster matters as much as the result.",
      avoid: "If the real job is drawing number ranges or matching people to outcomes, a number picker or ladder draw is easier to explain.",
      checklist: "Confirm duplicate names, explain exclusion and redraw rules before the first spin, and keep result history if you are running multiple rounds.",
      mistakes: "Spin animation does not change probability, repeated names act like extra tickets, and editing the roster after a result makes fairness harder to defend."
    },
    luckydraw: {
      intro: "The number picker is clearer than a name wheel when the result should be a ticket number, seat number, or coded entry.",
      fit: "It fits raffles, queue numbers, seat assignments, and coupon draws where the valid range and duplicate policy need to be explicit.",
      avoid: "If users need to see the participant roster itself or follow a one-to-one pairing, the wheel or ladder draw is usually more intuitive.",
      checklist: "Lock the minimum and maximum values, decide whether repeats are allowed, define redraw conditions, and verify that the live range matches the real event data.",
      mistakes: "Wrong number ranges, confusion between ticket IDs and participant counts, and ignoring leading-zero formatting are common sources of disputes."
    },
    ladder: {
      intro: "Ladder draw is strongest when you need to connect participants and outcomes in one visible result map.",
      fit: "It works well for prize assignments, penalties, speaking order, and role matching when the path from each participant to the outcome should stay visible.",
      avoid: "If you only need one winner or a raw number result, a wheel or number picker is simpler and creates less setup overhead.",
      checklist: "Make the participant count and outcome count match, freeze labels before starting, and keep the full board visible if the process is public.",
      mistakes: "Changing labels after reveal, starting with mismatched counts, or skipping the visible path breaks trust faster than the random result itself."
    },
    coinflip: {
      intro: "Coin flip is the lightest tool for fast two-option decisions when you want the outcome immediately and do not need a long setup.",
      fit: "It is a good match for first turn decisions, yes-or-no choices, and short sequencing calls where there are exactly two valid outcomes.",
      avoid: "Use another tool when there are more than two options, weighted odds, or any situation where result logs and later review matter.",
      checklist: "Agree on the two outcomes first, decide whether one flip is enough, and set a basic history rule if the same decision will be repeated many times.",
      mistakes: "A streak of heads or tails is not suspicious by itself, and using coin flips to oversimplify complex decisions usually hurts trust instead of helping it."
    },
    dice: {
      intro: "Dice rolling fits situations where totals, ranges, and repeated numeric outcomes matter more than picking one person from a list.",
      fit: "It is appropriate for board games, TRPG sessions, classroom probability demos, and simple score events where repeated rolls have meaning.",
      avoid: "If the real goal is choosing a participant or building fair teams, a wheel or team generator matches that job better than dice.",
      checklist: "Set the number of dice and sides, decide whether totals or individual values matter, define reroll rules, and keep history if repeated rounds affect outcomes.",
      mistakes: "Multiple dice naturally pull results toward the middle, so fairness can be misread if people focus on a single roll and ignore the wider distribution."
    },
    "team-generator": {
      intro: "Team split pages become more useful when they explain why a roster was divided that way, not just when they output random groups quickly.",
      fit: "Pure random mode is fine for casual mixing, while balanced mode is better for classes, matches, and workshops where strength gaps affect the experience.",
      avoid: "If the roster keeps changing or the scores are stale, a balanced split can create more complaints than a simple random assignment.",
      checklist: "Clean the roster first, lock the team count, confirm that the score inputs still reflect current ability, and share the generated result before manual tweaks begin.",
      mistakes: "Balanced mode does not promise perfectly equal teams, and fairness breaks down when missing scores, recent skill changes, or post-generation swaps are ignored."
    }
  },
  ja: {
    roulette: {
      intro: "ルーレットは、参加者リストを見せたまま公開で一人を選ぶ必要があるときに最も説明しやすい抽選方法です。",
      fit: "景品抽選、発表者選び、授業の順番決めなど、候補一覧が見えていること自体が大切な場面に向いています。",
      avoid: "本当の目的が番号範囲の抽選や参加者と結果の対応付けなら、番号抽選やあみだくじの方が説明しやすくなります。",
      checklist: "重複名が意図したものか確認し、除外ルールと再抽選ルールを開始前に示し、複数ラウンドなら結果記録も残してください。",
      mistakes: "回転アニメーションは確率を変えず、同じ名前を増やせば当選確率も増え、結果後に名簿を直すと公平性の説明が難しくなります。"
    },
    luckydraw: {
      intro: "番号抽選は、名前よりも番号そのものが結果の基準になる場面で使う方が分かりやすいツールです。",
      fit: "応募券番号、座席番号、整理番号、クーポンコードなど、範囲と重複可否を先に示す必要がある抽選に向いています。",
      avoid: "参加者一覧そのものを見せたい場合や、結果と商品や罰ゲームを対応付けたい場合は、ルーレットやあみだくじの方が直感的です。",
      checklist: "最小値と最大値、重複可否、再抽選条件を先に確定し、実際の番号範囲と一致しているか本番前に確認してください。",
      mistakes: "番号範囲の設定ミス、チケット番号と参加人数の混同、先頭ゼロの扱い忘れは現場での異議につながりやすいポイントです。"
    },
    ladder: {
      intro: "あみだくじは、参加者と結果を一度に見える形で結び付けたいときに説明力が高い公開抽選です。",
      fit: "景品配分、罰ゲーム割り当て、発表順、役割決めのように、誰がどの結果につながったかを一画面で示したい場面に向いています。",
      avoid: "単純に一人だけ選びたい場合や数字結果だけが必要な場合は、ルーレットや番号抽選の方が準備が軽く済みます。",
      checklist: "参加者数と結果数をそろえ、ラベルを開始前に確定し、公開運用なら全体の盤面が見える状態で始めるのが安全です。",
      mistakes: "公開後にラベルを変えたり、人数と結果数がずれたり、経路表示を省くと、抽選結果そのものより先に信頼を失います。"
    },
    coinflip: {
      intro: "コイントスは、二択をすぐ決めたいときに最も負担が小さいランダムツールです。",
      fit: "先攻後攻、はい・いいえ、短い順番決めのように、正しい結果が二つだけで長い説明が不要な場面に向いています。",
      avoid: "選択肢が三つ以上ある場合、重み付けが必要な場合、結果ログや後確認が重要な場合は別のツールを使う方が適切です。",
      checklist: "表と裏が何を意味するかを先に合意し、一回で決めるのか複数回投げるのかを決め、繰り返し使うなら履歴の見方も決めておきます。",
      mistakes: "同じ面が続いてもそれ自体は不自然ではなく、複雑な意思決定を無理にコイントスで片付けると、かえって納得感を損ねます。"
    },
    dice: {
      intro: "サイコロは、合計値や範囲、繰り返し出る数値結果が重要で、人を一人選ぶことが目的ではない場面に向くツールです。",
      fit: "ボードゲーム、TRPG、確率の授業、簡単な得点イベントなど、複数回の出目や合計に意味がある使い方に向いています。",
      avoid: "本当の目的が参加者選びや公平なチーム分けなら、サイコロよりルーレットやチーム分けツールの方が自然に説明できます。",
      checklist: "サイコロの個数と面数、合計を見るのか個別の目を見るのか、振り直し条件はあるのかを先に決め、繰り返し結果は履歴で残してください。",
      mistakes: "サイコロが増えると結果は中央寄りになりやすく、一回の出目だけを見て公平性を判断すると分布の読み方を誤りやすくなります。"
    },
    "team-generator": {
      intro: "チーム分けは、単にシャッフルするだけでなく、なぜその編成になったのかを説明するときに価値が大きくなるツールです。",
      fit: "気軽な混成には完全ランダムで十分ですが、授業、試合、ワークショップのように実力差が体験に影響する場面ではバランスモードが役立ちます。",
      avoid: "参加者が頻繁に変わる場合やスコアが古い場合は、バランス分けの方が不満を生みやすく、単純ランダムの方が説明しやすいことがあります。",
      checklist: "先に名簿を整え、チーム数を確定し、入力スコアが現在の実力を反映しているか確認してから、生成結果を共有してください。",
      mistakes: "バランスモードは完全な同戦力を保証せず、未入力スコア、最近の実力変化、生成後の手作業変更を無視すると公平性の説明が崩れます。"
    }
  },
  "zh-cn": {
    roulette: {
      intro: "转盘最适合在公开场景里展示完整名单，并让大家看着结果从名单中选出一个名字。",
      fit: "它适合抽奖、选发言人、课堂点名和任何需要让参与者同时看到名单与结果的场景。",
      avoid: "如果真正的任务是抽取数字范围，或者把参与者与结果一一对应，那么号码抽签或梯子抽签会更容易解释。",
      checklist: "先确认重复名字是否有效，提前说明排除和重抽规则，如果有多轮抽签，就把结果记录保留下来。",
      mistakes: "转盘动画不会改变概率，重复名字会像额外票数一样提高机会，而在出结果后再改名单会让公平性很难说明。"
    },
    luckydraw: {
      intro: "当结果本身应该是票号、座位号或编码时，号码抽签比名字转盘更清楚。",
      fit: "它适合抽奖券、排队号、座位号和优惠码等需要先说明有效范围与是否允许重复的场景。",
      avoid: "如果用户需要直接看到参与名单，或者需要把人和结果一一连起来展示，转盘或梯子抽签通常更直观。",
      checklist: "先锁定最小值和最大值，决定是否允许重复，说明重抽条件，并核对现场使用的数字范围与真实数据一致。",
      mistakes: "数字范围设错、把票号和参与人数混在一起、忽略前导零格式，都是最常引发争议的问题。"
    },
    ladder: {
      intro: "梯子抽签最强的地方在于，它能把参与者和结果放在同一张可视化路径图里展示。",
      fit: "它适合奖品分配、惩罚分配、发言顺序和角色对应等需要看清每个人最终连到哪里的场景。",
      avoid: "如果你只需要抽出一个人，或者只需要一个数字结果，转盘和号码抽签通常更简单，准备成本也更低。",
      checklist: "确保参与人数和结果数量一致，开始前冻结标签，如果是公开操作，就让大家能看到完整路径板。",
      mistakes: "结果公布后再改标签、人数和结果数不一致、或者跳过可视路径，都会比随机结果本身更快破坏信任。"
    },
    coinflip: {
      intro: "抛硬币是最快的二选一随机工具，适合希望立刻得到结果、又不想做复杂设置的情况。",
      fit: "它适合先后手、是或否、短顺序决定等只有两个有效结果的场景。",
      avoid: "如果选项超过两个、需要加权概率，或者结果日志和后续复核很重要，就应该用别的工具。",
      checklist: "先约定正反面分别代表什么，确认一次是否足够，如果同类决定会重复出现，就先定好最基本的记录规则。",
      mistakes: "连续出现同一面本身并不奇怪，而用抛硬币去包装复杂决策，只会让人觉得过程过于草率。"
    },
    dice: {
      intro: "掷骰子更适合看总和、范围和多次数值结果的场景，而不是从名单里选出一个人。",
      fit: "它适合桌游、TRPG、概率课堂演示和简单积分活动等需要反复掷出数值结果的用法。",
      avoid: "如果真正目标是选参与者或分出相对公平的队伍，转盘或分队工具会比骰子更合适。",
      checklist: "先确定骰子数量和面数，决定是看总和还是看每颗点数，说明是否允许重掷，并在多轮使用时保留历史。",
      mistakes: "骰子数量增加后，结果更容易向中间集中，所以只看单次结果而忽略整体分布，常常会误读公平性。"
    },
    "team-generator": {
      intro: "分队页在解释为什么会分成这样的阵容时，价值会比单纯快速生成随机队伍更高。",
      fit: "随意混编时纯随机已经够用，而在课堂、比赛、工作坊这类实力差会影响体验的场景里，平衡模式更合适。",
      avoid: "如果名单一直在变，或者评分已经过时，平衡分队反而可能带来更多抱怨，这时简单随机通常更稳。",
      checklist: "先整理名单，锁定队伍数量，确认输入分数还能反映当前水平，再把生成结果先公开出去。",
      mistakes: "平衡模式并不保证绝对同等实力，如果忽略缺失分数、近期状态变化或生成后的手动换人，公平性解释就会失效。"
    }
  },
  "zh-tw": {
    roulette: {
      intro: "轉盤最適合在公開情境中直接顯示完整名單，並讓大家看著結果從名單裡選出一個名字。",
      fit: "它適合抽獎、選發言者、課堂點名，以及任何需要同時看見名單與結果的場合。",
      avoid: "如果真正的工作是抽數字區間，或是把參與者和結果一一對應，那麼號碼抽籤或梯子抽籤會更容易說明。",
      checklist: "先確認重複名字是否有效，提前說明排除與重抽規則，如果有多輪抽籤，就把結果紀錄保留下來。",
      mistakes: "轉盤動畫不會改變機率，重複名字會像額外票數一樣提高中選率，而在結果出來後再改名單會讓公平性很難解釋。"
    },
    luckydraw: {
      intro: "當結果本身應該是票號、座位號或代碼時，號碼抽籤會比名字轉盤更清楚。",
      fit: "它適合抽獎券、排隊號、座位號與優惠碼等，需要先說明有效範圍與是否允許重複的情境。",
      avoid: "如果使用者需要直接看到參與名單，或要把人與結果一一連起來展示，轉盤或梯子抽籤通常更直覺。",
      checklist: "先鎖定最小值與最大值，決定是否允許重複，說明重抽條件，並核對現場數字範圍與真實資料一致。",
      mistakes: "數字範圍設錯、把票號和參與人數混在一起、忽略前導零格式，都是最常引起爭議的問題。"
    },
    ladder: {
      intro: "梯子抽籤最強的地方在於，它能把參與者與結果放在同一張可視化路徑圖裡呈現。",
      fit: "它適合獎品分配、懲罰分配、發言順序與角色對應等，需要看清每個人最後連到哪裡的場景。",
      avoid: "如果你只需要抽出一個人，或只需要單純的數字結果，轉盤與號碼抽籤通常更簡單，準備成本也更低。",
      checklist: "確保參與人數與結果數量一致，開始前固定標籤，如果是公開操作，就讓大家能看到完整路徑板。",
      mistakes: "公布後再改標籤、人數與結果數不一致、或跳過可視路徑，都會比隨機結果本身更快破壞信任。"
    },
    coinflip: {
      intro: "擲硬幣是最快的二選一隨機工具，適合想立刻得到結果又不想做複雜設定的時候。",
      fit: "它適合先後手、是或否、短順序決定等只有兩個有效結果的場景。",
      avoid: "如果選項超過兩個、需要加權機率，或是結果日誌與後續複核很重要，就應該改用其他工具。",
      checklist: "先約定正反面分別代表什麼，確認一次是否足夠，如果同類決定會重複出現，就先定好最基本的紀錄規則。",
      mistakes: "連續出現同一面本身並不奇怪，而用擲硬幣去處理複雜決策，只會讓人覺得流程太草率。"
    },
    dice: {
      intro: "擲骰子更適合看總和、範圍與多次數值結果的場景，而不是從名單中選出一個人。",
      fit: "它適合桌遊、TRPG、機率課堂示範與簡單積分活動等，需要反覆擲出數值結果的用法。",
      avoid: "如果真正目標是選參與者或分出相對公平的隊伍，轉盤或分隊工具會比骰子更合適。",
      checklist: "先設定骰子數量與面數，決定是看總和還是看每顆點數，說明是否允許重擲，並在多輪使用時保留歷史。",
      mistakes: "骰子數量增加後，結果更容易往中間集中，所以只看單次結果而忽略整體分布，常常會誤讀公平性。"
    },
    "team-generator": {
      intro: "分隊頁在說明為什麼會分成這樣的陣容時，價值會比單純快速產生隨機隊伍更高。",
      fit: "輕鬆混編時純隨機已經夠用，而在課堂、比賽、工作坊這類實力差會影響體驗的情境裡，平衡模式更合適。",
      avoid: "如果名單一直在變，或評分已經過時，平衡分隊反而可能帶來更多抱怨，這時簡單隨機通常更穩。",
      checklist: "先整理名單，鎖定隊伍數量，確認輸入分數仍能反映目前水準，再把生成結果先公開出去。",
      mistakes: "平衡模式不保證絕對同等實力，如果忽略缺失分數、近期狀態變化或生成後的手動換人，公平性說明就會失效。"
    }
  },
  es: {
    roulette: {
      intro: "La ruleta funciona mejor cuando la gente necesita ver la lista completa de participantes y observar como se elige un nombre en publico.",
      fit: "Encaja bien en sorteos, eleccion de presentadores, turnos de clase y cualquier escenario donde la lista visible importa tanto como el resultado.",
      avoid: "Si el trabajo real es sacar un rango de numeros o vincular personas con resultados, un selector numerico o una escalera aleatoria suele explicarse mejor.",
      checklist: "Confirma los nombres duplicados, explica las reglas de exclusion y repeticion antes del primer giro y conserva el historial si vas a hacer varias rondas.",
      mistakes: "La animacion no cambia la probabilidad, los nombres repetidos funcionan como boletos extra y editar la lista despues del resultado complica defender la equidad."
    },
    luckydraw: {
      intro: "El selector de numeros es mas claro que una ruleta de nombres cuando el resultado debe ser un numero de boleto, asiento o codigo.",
      fit: "Sirve para rifas, turnos, asientos y cupones donde el rango valido y la politica de repeticion deben quedar claros desde el inicio.",
      avoid: "Si los usuarios necesitan ver la lista de participantes o seguir una correspondencia uno a uno, la ruleta o la escalera suelen ser mas intuitivas.",
      checklist: "Fija el minimo y el maximo, decide si se permiten repetidos, define las condiciones de repeticion y verifica que el rango activo coincida con los datos reales.",
      mistakes: "Los rangos mal definidos, confundir numeros de boleto con cantidad de participantes e ignorar ceros iniciales son fuentes frecuentes de reclamos."
    },
    ladder: {
      intro: "La escalera aleatoria es mas fuerte cuando necesitas conectar participantes y resultados dentro de un mismo mapa visible.",
      fit: "Funciona bien para repartir premios, castigos, turnos de palabra y roles cuando conviene que el recorrido hacia el resultado siga siendo visible.",
      avoid: "Si solo necesitas un ganador o un numero simple, la ruleta o el selector de numeros son mas sencillos y requieren menos preparacion.",
      checklist: "Haz coincidir la cantidad de participantes y resultados, congela las etiquetas antes de empezar y mantén visible todo el tablero si el proceso es publico.",
      mistakes: "Cambiar etiquetas tras revelar el resultado, empezar con cantidades distintas u ocultar el recorrido rompe la confianza mas rapido que el azar mismo."
    },
    coinflip: {
      intro: "Cara o cruz es la opcion mas ligera para decisiones de dos opciones cuando quieres un resultado inmediato sin montar una configuracion grande.",
      fit: "Es util para decidir el primer turno, respuestas de si o no y ordenes breves donde solo existen dos resultados validos.",
      avoid: "Usa otra herramienta si hay mas de dos opciones, probabilidades ponderadas o una necesidad real de guardar registros y revisarlos despues.",
      checklist: "Acordad primero que significa cada lado, decidid si una sola tirada basta y fijad una regla simple de historial si la misma decision se repetira varias veces.",
      mistakes: "Una racha de la misma cara no es sospechosa por si sola, y usar cara o cruz para simplificar decisiones complejas suele dañar la confianza en vez de ayudar."
    },
    dice: {
      intro: "Tirar dados encaja mejor cuando importan las sumas, los rangos y los resultados numericos repetidos, no cuando hay que elegir a una persona de una lista.",
      fit: "Es apropiado para juegos de mesa, sesiones de rol, demostraciones de probabilidad y eventos de puntuacion donde varias tiradas tienen significado.",
      avoid: "Si el objetivo real es elegir un participante o formar equipos justos, una ruleta o un generador de equipos se ajustan mejor que los dados.",
      checklist: "Define el numero de dados y caras, decide si importan las sumas o los valores individuales, aclara reglas de repeticion y guarda historial si hay rondas repetidas.",
      mistakes: "Con varios dados, los resultados tienden al centro, asi que mirar solo una tirada e ignorar la distribucion general suele llevar a interpretar mal la equidad."
    },
    "team-generator": {
      intro: "Las paginas de equipos ganan valor cuando explican por que la lista se dividio asi, y no solo cuando generan grupos aleatorios con rapidez.",
      fit: "El modo totalmente aleatorio sirve para mezclar grupos sin tension, mientras que el modo equilibrado es mejor en clases, partidos y talleres donde la diferencia de nivel importa.",
      avoid: "Si la lista cambia todo el tiempo o las puntuaciones estan desactualizadas, un reparto equilibrado puede generar mas quejas que una asignacion aleatoria simple.",
      checklist: "Limpia primero la lista, fija la cantidad de equipos, confirma que las puntuaciones siguen reflejando el nivel actual y comparte el resultado antes de hacer ajustes manuales.",
      mistakes: "El modo equilibrado no promete equipos exactamente iguales, y la sensacion de justicia se rompe si ignoras puntuaciones faltantes, cambios recientes o intercambios posteriores."
    }
  },
  fr: {
    roulette: {
      intro: "La roue est la plus utile quand il faut afficher toute la liste des participants et montrer publiquement quel nom est choisi.",
      fit: "Elle convient aux cadeaux, aux tours de parole, aux choix d'intervenant et a toute situation ou la liste visible compte autant que le resultat.",
      avoid: "Si le vrai besoin est de tirer une plage de numeros ou de relier des personnes a des resultats, un tirage numerique ou une echelle aleatoire se justifie mieux.",
      checklist: "Verifiez les doublons, annoncez les regles d'exclusion et de nouveau tirage avant le premier lancement, et gardez un historique si plusieurs tours sont prevus.",
      mistakes: "L'animation ne change pas la probabilite, les noms repetes agissent comme des billets supplementaires, et modifier la liste apres le resultat fragilise l'argument d'equite."
    },
    luckydraw: {
      intro: "Le tirage de numeros est plus clair qu'une roue de noms quand le resultat attendu est un numero de ticket, de siege ou un code.",
      fit: "Il convient aux tombolas, files d'attente, places assises et coupons quand la plage valide et la regle de repetition doivent etre explicites.",
      avoid: "Si les utilisateurs doivent voir la liste des participants ou suivre une correspondance une a une, la roue ou l'echelle sont souvent plus intuitives.",
      checklist: "Fixez le minimum et le maximum, decidez si les repetitions sont autorisees, definissez les cas de nouveau tirage et verifiez que la plage active correspond aux donnees reelles.",
      mistakes: "Une mauvaise plage de numeros, la confusion entre numero de ticket et nombre de participants, ou l'oubli des zeros initiaux provoquent souvent des contestations."
    },
    ladder: {
      intro: "Le tirage en echelle est le plus fort quand il faut relier participants et resultats dans une seule carte visuelle.",
      fit: "Il fonctionne bien pour attribuer des lots, des gages, un ordre de passage ou des roles quand le chemin menant au resultat doit rester visible.",
      avoid: "Si vous avez seulement besoin d'un gagnant ou d'un resultat numerique simple, la roue ou le tirage de numeros demandent moins de preparation.",
      checklist: "Faites correspondre le nombre de participants et de resultats, figez les etiquettes avant le debut, et gardez tout le tableau visible si le processus est public.",
      mistakes: "Changer les etiquettes apres revelation, demarrer avec des comptes differents ou masquer le trajet casse la confiance plus vite que le hasard lui-meme."
    },
    coinflip: {
      intro: "Le pile ou face est l'outil le plus leger pour trancher entre deux options quand vous voulez un resultat immediat sans mise en place lourde.",
      fit: "Il convient au choix du premier tour, aux decisions oui ou non et aux petits ordres de passage avec exactement deux issues valides.",
      avoid: "Utilisez un autre outil s'il y a plus de deux options, des probabilites ponderees, ou un vrai besoin de conserver des journaux et de les revoir ensuite.",
      checklist: "Mettez-vous d'accord sur la signification de chaque face, decidez si un seul lancer suffit, et fixez une regle simple d'historique si la meme decision revient souvent.",
      mistakes: "Une serie de la meme face n'est pas suspecte en soi, et utiliser le pile ou face pour simplifier des decisions complexes tend a reduire la confiance au lieu de l'ameliorer."
    },
    dice: {
      intro: "Le lancer de des convient mieux quand les totaux, les plages et les resultats numeriques repetes comptent plus que le fait de choisir une personne dans une liste.",
      fit: "Il est adapte aux jeux de societe, aux sessions de jeu de role, aux demonstrations de probabilite et aux evenements de score ou plusieurs lancers ont un sens.",
      avoid: "Si le but reel est de choisir un participant ou de constituer des equipes equitables, une roue ou un generateur d'equipes correspondent mieux que les des.",
      checklist: "Definissez le nombre de des et de faces, decidez si les totaux ou les valeurs individuelles comptent, precisez les regles de relance et gardez un historique pour les tours repetes.",
      mistakes: "Avec plusieurs des, les resultats se concentrent davantage au centre, donc regarder un seul lancer sans tenir compte de la distribution globale fausse souvent l'analyse."
    },
    "team-generator": {
      intro: "Les pages de repartition d'equipes prennent plus de valeur quand elles expliquent pourquoi la liste a ete partagee ainsi, pas seulement quand elles sortent des groupes rapidement.",
      fit: "Le mode aleatoire pur suffit pour melanger un groupe sans enjeu, tandis que le mode equilibre convient mieux aux cours, matchs et ateliers ou l'ecart de niveau influence l'experience.",
      avoid: "Si la liste change sans cesse ou si les scores sont anciens, une repartition equilibree peut susciter plus de plaintes qu'une attribution aleatoire simple.",
      checklist: "Nettoyez d'abord la liste, fixez le nombre d'equipes, verifiez que les scores saisis refleten encore le niveau actuel, puis partagez le resultat avant tout ajustement manuel.",
      mistakes: "Le mode equilibre ne promet pas des equipes parfaitement egales, et la perception d'equite s'effondre si l'on ignore les scores manquants, les progres recents ou les echanges apres generation."
    }
  },
  de: {
    roulette: {
      intro: "Das Rad passt am besten, wenn alle die komplette Teilnehmerliste sehen und nachvollziehen sollen, welcher Name offentlich ausgewahlt wird.",
      fit: "Es eignet sich fur Gewinnspiele, Sprecherauswahl, Unterrichtsreihenfolgen und alle Ziehungen, bei denen die sichtbare Liste genauso wichtig ist wie das Ergebnis.",
      avoid: "Wenn eigentlich Zahlenbereiche gezogen oder Personen eindeutig mit Ergebnissen verknupft werden sollen, lassen sich Nummernziehung oder Leiterziehung besser erklaren.",
      checklist: "Prufen Sie doppelte Namen, erklaren Sie Ausschluss- und Neuziehungsregeln vor dem ersten Dreh und speichern Sie eine Historie, wenn mehrere Runden geplant sind.",
      mistakes: "Die Animation andert die Wahrscheinlichkeit nicht, doppelte Namen wirken wie Zusatzlose, und nachtragliche Listenanderungen machen Fairness nur schwer nachvollziehbar."
    },
    luckydraw: {
      intro: "Der Nummernzieher ist klarer als ein Namensrad, wenn das Ergebnis eine Losnummer, Sitznummer oder ein Code sein soll.",
      fit: "Er passt zu Tombolas, Wartelisten, Sitzplatzen und Gutscheincodes, wenn Zahlenbereich und Wiederholungsregel von Anfang an eindeutig sein mussen.",
      avoid: "Wenn Nutzer die Teilnehmerliste selbst sehen oder eine Eins-zu-eins-Zuordnung verfolgen sollen, sind Rad oder Leiter meist intuitiver.",
      checklist: "Legen Sie Minimum und Maximum fest, entscheiden Sie uber Wiederholungen, definieren Sie Neuziehungsfalle und gleichen Sie den aktiven Bereich mit den echten Eventdaten ab.",
      mistakes: "Falsche Zahlenbereiche, Verwechslungen zwischen Losnummern und Teilnehmerzahl sowie ignorierte fuhrende Nullen sorgen besonders oft fur Streit."
    },
    ladder: {
      intro: "Die Leiterziehung ist besonders stark, wenn Teilnehmer und Ergebnisse in einem sichtbaren Ablauf zusammengefuhrt werden sollen.",
      fit: "Sie eignet sich fur Preiszuweisungen, Strafen, Reihenfolgen und Rollen, wenn der Weg jeder Person zum Ergebnis sichtbar bleiben soll.",
      avoid: "Wenn Sie nur einen Gewinner oder ein einfaches Zahlenergebnis brauchen, sind Rad oder Nummernziehung einfacher und schneller vorbereitet.",
      checklist: "Stimmen Sie Teilnehmerzahl und Ergebniszahl aufeinander ab, frieren Sie die Beschriftungen vor dem Start ein und halten Sie das gesamte Brett sichtbar, wenn der Prozess offentlich ist.",
      mistakes: "Nachtraglich geanderte Labels, ungleiche Anzahlen oder ein ubersprungener sichtbarer Pfad zerstoren Vertrauen schneller als das Zufallsergebnis selbst."
    },
    coinflip: {
      intro: "Der Munzwurf ist das leichteste Werkzeug fur schnelle Zwei-Optionen-Entscheidungen, wenn sofort ein Ergebnis gebraucht wird und kein grosser Aufbau notig ist.",
      fit: "Er passt zu Erstoerechten, Ja-nein-Entscheidungen und kurzen Reihenfolgen mit genau zwei gultigen Ausgangen.",
      avoid: "Nutzen Sie etwas anderes, wenn es mehr als zwei Optionen, gewichtete Chancen oder einen echten Bedarf an Protokollen und Nachprufung gibt.",
      checklist: "Legen Sie zuerst fest, wofur Kopf und Zahl stehen, entscheiden Sie, ob ein Wurf reicht, und definieren Sie bei wiederkehrenden Entscheidungen eine einfache Verlaufsregel.",
      mistakes: "Mehrere gleiche Seiten hintereinander sind fur sich genommen nicht verdaachtig, und komplexe Entscheidungen per Munzwurf zu vereinfachen schwacht die Akzeptanz oft eher."
    },
    dice: {
      intro: "Wurfel passen besser zu Situationen, in denen Summen, Bereiche und wiederholte Zahlenergebnisse wichtiger sind als die Auswahl einer Person aus einer Liste.",
      fit: "Sie sind sinnvoll fur Brettspiele, TRPG-Runden, Wahrscheinlichkeitsunterricht und einfache Punktevents, bei denen mehrere Wurfe Bedeutung haben.",
      avoid: "Wenn das eigentliche Ziel die Auswahl einer Person oder die faire Teamverteilung ist, passen Rad oder Teamgenerator besser als Wurfel.",
      checklist: "Bestimmen Sie Anzahl und Seiten der Wurfel, entscheiden Sie zwischen Summe und Einzelwerten, erklaren Sie Neuwurfel-Regeln und speichern Sie Verlaufsdaten bei wiederholten Runden.",
      mistakes: "Mit mehreren Wurfeln wandern Ergebnisse naturlich zur Mitte, daher fuhrt der Blick auf einen Einzelwurf ohne Gesamtverteilung oft zu falschen Fairnessschlussen."
    },
    "team-generator": {
      intro: "Teamseiten gewinnen dann an Wert, wenn sie erklaren, warum eine Liste genau so aufgeteilt wurde, statt nur schnell zufallige Gruppen auszugeben.",
      fit: "Der reine Zufallsmodus reicht fur lockere Durchmischung, wahrend der Ausgleichsmodus fur Unterricht, Spiele und Workshops besser ist, wenn Leistungsunterschiede das Erlebnis pragen.",
      avoid: "Wenn sich die Liste standig andert oder die Bewertungen veraltet sind, fuhrt eine ausbalancierte Aufteilung oft zu mehr Beschwerden als eine einfache Zufallsverteilung.",
      checklist: "Bereinigen Sie zuerst die Liste, legen Sie die Teamzahl fest, prufen Sie die Aktualitat der Bewertungsdaten und teilen Sie das Ergebnis, bevor manuell eingegriffen wird.",
      mistakes: "Der Balance-Modus garantiert keine perfekt gleichen Teams, und Fairness bricht schnell weg, wenn fehlende Werte, aktuelle Formanderungen oder nachtragliche Tauschungen ignoriert werden."
    }
  },
  "pt-br": {
    roulette: {
      intro: "A roleta funciona melhor quando todos precisam ver a lista completa de participantes e acompanhar publicamente qual nome foi escolhido.",
      fit: "Ela combina com sorteios, escolha de apresentador, ordem em sala e qualquer caso em que a lista visivel importa tanto quanto o resultado.",
      avoid: "Se o trabalho real e sortear faixas numericas ou ligar pessoas a resultados, um sorteador de numeros ou uma escada costuma ser mais facil de explicar.",
      checklist: "Confirme nomes duplicados, explique as regras de exclusao e novo sorteio antes da primeira rodada e mantenha o historico se houver varias rodadas.",
      mistakes: "A animacao nao altera a probabilidade, nomes repetidos funcionam como bilhetes extras e editar a lista depois do resultado enfraquece a explicacao de justica."
    },
    luckydraw: {
      intro: "O sorteador de numeros e mais claro do que uma roleta de nomes quando o resultado precisa ser um numero de bilhete, assento ou codigo.",
      fit: "Ele serve para rifas, filas, assentos e cupons quando a faixa valida e a regra de repeticao precisam ficar explicitas desde o inicio.",
      avoid: "Se os usuarios precisam ver a lista de participantes ou acompanhar uma correspondencia um a um, a roleta ou a escada costumam ser mais intuitivas.",
      checklist: "Defina minimo e maximo, decida se repeticoes sao permitidas, explique quando refazer o sorteio e confira se a faixa ativa bate com os dados reais do evento.",
      mistakes: "Faixas numericas erradas, confundir numero de bilhete com quantidade de participantes e ignorar zeros a esquerda costumam gerar contestacao."
    },
    ladder: {
      intro: "A escada aleatoria e mais forte quando voce precisa conectar participantes e resultados em um unico mapa visivel.",
      fit: "Ela funciona bem para distribuir premios, castigos, ordem de fala e papeis quando o caminho de cada participante ate o resultado deve continuar visivel.",
      avoid: "Se voce precisa apenas de um vencedor ou de um numero simples, roleta ou sorteador de numeros exigem menos preparacao.",
      checklist: "Mantenha a quantidade de participantes e resultados igual, congele os rotulos antes de comecar e deixe o quadro inteiro visivel se o processo for publico.",
      mistakes: "Trocar rotulos depois da revelacao, iniciar com quantidades diferentes ou esconder o caminho quebra a confianca mais rapido do que o acaso em si."
    },
    coinflip: {
      intro: "Cara ou coroa e a opcao mais leve para decisoes de duas escolhas quando voce quer um resultado imediato sem uma configuracao longa.",
      fit: "Ele e util para decidir quem comeca, respostas de sim ou nao e pequenas ordens de sequencia com exatamente dois resultados validos.",
      avoid: "Use outra ferramenta se houver mais de duas opcoes, chances ponderadas ou necessidade real de guardar registros e revisa-los depois.",
      checklist: "Combinem primeiro o significado de cada lado, decidam se um unico lancamento basta e definam uma regra simples de historico se a mesma decisao se repetir.",
      mistakes: "Uma sequencia da mesma face nao e suspeita por si so, e usar cara ou coroa para simplificar decisoes complexas costuma reduzir a confianca."
    },
    dice: {
      intro: "Rolar dados combina melhor com situacoes em que somas, faixas e resultados numericos repetidos importam mais do que escolher uma pessoa de uma lista.",
      fit: "E apropriado para jogos de tabuleiro, sessoes de RPG, demonstracoes de probabilidade e eventos simples de pontuacao em que varias rolagens fazem sentido.",
      avoid: "Se o objetivo real e escolher um participante ou montar equipes justas, uma roleta ou um gerador de equipes combinam melhor do que dados.",
      checklist: "Defina a quantidade de dados e faces, decida se importam os totais ou os valores individuais, explique regras de rerrolagem e mantenha historico em rodadas repetidas.",
      mistakes: "Com varios dados, os resultados tendem naturalmente ao meio, entao olhar apenas uma rolagem e ignorar a distribuicao geral costuma distorcer a leitura de justica."
    },
    "team-generator": {
      intro: "Paginas de divisao em equipes ganham valor quando explicam por que a lista foi separada daquela forma, e nao apenas quando geram grupos aleatorios rapidamente.",
      fit: "O modo totalmente aleatorio basta para misturas casuais, enquanto o modo equilibrado e melhor para aulas, partidas e workshops em que a diferenca de nivel afeta a experiencia.",
      avoid: "Se a lista muda o tempo todo ou as pontuacoes estao desatualizadas, uma divisao equilibrada pode gerar mais reclamacoes do que uma distribuicao aleatoria simples.",
      checklist: "Limpe a lista primeiro, fixe a quantidade de equipes, confirme que as notas ainda refletem a habilidade atual e compartilhe o resultado antes de ajustes manuais.",
      mistakes: "O modo equilibrado nao promete equipes perfeitamente iguais, e a sensacao de justica se perde quando pontuacoes ausentes, mudancas recentes ou trocas posteriores sao ignoradas."
    }
  },
  hi: {
    roulette: {
      intro: "रूलेेट तब सबसे उपयोगी होता है जब लोगों को पूरी प्रतिभागी सूची दिखनी चाहिए और सबके सामने एक नाम चुना जाना चाहिए।",
      fit: "यह उपहार ड्रॉ, प्रस्तुतकर्ता चुनने, कक्षा क्रम तय करने और उन स्थितियों में अच्छा है जहां दिखाई देने वाली सूची परिणाम जितनी ही महत्वपूर्ण होती है।",
      avoid: "अगर असली काम संख्या-सीमा निकालना है या लोगों को परिणामों से जोड़ना है, तो नंबर पिकर या लैडर ड्रॉ समझाना आसान होता है।",
      checklist: "डुप्लिकेट नाम जांचें, पहले स्पिन से पहले exclusion और redraw नियम समझाएं, और कई राउंड हों तो परिणाम इतिहास सुरक्षित रखें।",
      mistakes: "स्पिन एनीमेशन संभावना नहीं बदलता, दोहराए गए नाम अतिरिक्त टिकट की तरह काम करते हैं, और परिणाम के बाद सूची बदलना निष्पक्षता को समझाना मुश्किल बना देता है।"
    },
    luckydraw: {
      intro: "जब परिणाम खुद टिकट नंबर, सीट नंबर या कोड होना चाहिए, तब नंबर पिकर नामों वाली रूलेेट से ज्यादा साफ रहता है।",
      fit: "यह raffle, queue number, seat assignment और coupon draw जैसी स्थितियों के लिए अच्छा है जहां valid range और repeat policy पहले से साफ होनी चाहिए।",
      avoid: "अगर उपयोगकर्ताओं को प्रतिभागी सूची खुद देखनी है या एक-से-एक मिलान समझना है, तो रूलेेट या लैडर ड्रॉ ज्यादा सहज रहते हैं।",
      checklist: "न्यूनतम और अधिकतम सीमा तय करें, repeat की अनुमति है या नहीं तय करें, redraw conditions समझाएं, और active range को वास्तविक data से मिलाएं।",
      mistakes: "गलत number range, ticket ID और participant count का भ्रम, और leading zero format को नजरअंदाज करना विवाद का आम कारण है।"
    },
    ladder: {
      intro: "लैडर ड्रॉ तब सबसे मजबूत होता है जब प्रतिभागियों और परिणामों को एक ही दृश्य map में जोड़कर दिखाना हो।",
      fit: "यह prize assignment, penalty, speaking order और role matching के लिए अच्छा है जब हर प्रतिभागी का path दिखना चाहिए।",
      avoid: "अगर आपको सिर्फ एक विजेता या सरल numeric result चाहिए, तो रूलेेट या नंबर पिकर कम setup के साथ आसान रहते हैं।",
      checklist: "प्रतिभागी संख्या और परिणाम संख्या बराबर रखें, शुरू होने से पहले labels फाइनल करें, और सार्वजनिक प्रक्रिया हो तो पूरा board दिखाई देना चाहिए।",
      mistakes: "रिजल्ट दिखने के बाद labels बदलना, unequal counts से शुरू करना, या visible path छिपाना भरोसा जल्दी तोड़ देता है।"
    },
    coinflip: {
      intro: "कॉइन फ्लिप दो विकल्पों वाले फैसलों के लिए सबसे हल्का random tool है, खासकर जब तुरंत परिणाम चाहिए और लंबी setup नहीं चाहिए।",
      fit: "यह first turn, yes-or-no decision और छोटे sequencing call के लिए अच्छा है जहां केवल दो valid outcome होते हैं।",
      avoid: "अगर दो से ज्यादा विकल्प हों, weighted odds हों, या बाद में review के लिए logs जरूरी हों, तो दूसरा tool बेहतर है।",
      checklist: "पहले तय करें कि head और tail किसका मतलब है, एक flip काफी है या नहीं तय करें, और बार-बार होने वाले फैसलों के लिए basic history rule रखें।",
      mistakes: "एक ही side लगातार आना अपने आप में suspicious नहीं है, और complex decisions को coin flip से छोटा दिखाना अक्सर भरोसा घटा देता है।"
    },
    dice: {
      intro: "डाइस रोल उन स्थितियों के लिए बेहतर है जहां total, range और दोहराए गए numeric result महत्वपूर्ण हों, न कि सूची से एक व्यक्ति चुनना।",
      fit: "यह board game, TRPG session, probability class demo और simple score event के लिए उपयुक्त है जहां कई rolls का मतलब होता है।",
      avoid: "अगर असली लक्ष्य किसी participant को चुनना या fairly teams बनाना है, तो wheel या team generator dice से बेहतर बैठता है।",
      checklist: "dice की संख्या और sides तय करें, total देखना है या individual value यह तय करें, reroll rule समझाएं, और repeated round हों तो history रखें।",
      mistakes: "कई dice होने पर परिणाम स्वाभाविक रूप से बीच की ओर आते हैं, इसलिए सिर्फ एक roll देखकर fairness तय करना अक्सर गलत निष्कर्ष देता है।"
    },
    "team-generator": {
      intro: "टीम पेज तब ज्यादा उपयोगी बनते हैं जब वे यह भी समझाते हैं कि roster को उस तरह क्यों बांटा गया, सिर्फ random group निकालने से नहीं।",
      fit: "casual mixing के लिए pure random mode काफी है, जबकि balanced mode class, match और workshop में बेहतर है जहां skill gap अनुभव बदलता है।",
      avoid: "अगर roster बार-बार बदल रहा है या scores पुराने हैं, तो balanced split simple random assignment से ज्यादा शिकायतें पैदा कर सकता है।",
      checklist: "पहले roster साफ करें, team count लॉक करें, scores अभी भी current ability दिखाते हैं या नहीं जांचें, और manual change से पहले generated result साझा करें।",
      mistakes: "balanced mode पूरी तरह समान टीमों की गारंटी नहीं देता, और missing score, हाल की skill change या बाद की swapping को अनदेखा करने पर fairness टूट जाती है।"
    }
  },
  ar: {
    roulette: {
      intro: "تعمل العجلة بشكل افضل عندما يحتاج الجميع الى رؤية قائمة المشاركين كاملة ومشاهدة اختيار اسم واحد بشكل علني.",
      fit: "هي مناسبة للسحوبات والهدايا واختيار المتحدثين وترتيب الادوار في الصف وكل حالة تكون فيها القائمة الظاهرة مهمة بقدر النتيجة نفسها.",
      avoid: "اذا كانت المهمة الحقيقية هي سحب نطاق ارقام او ربط الاشخاص بالنتائج، فان اداة الارقام او السلم العشوائي تكون اسهل في الشرح.",
      checklist: "تحقق من الاسماء المكررة، واشرح قواعد الاستبعاد واعادة السحب قبل اول تدوير، واحتفظ بسجل للنتائج اذا كانت هناك عدة جولات.",
      mistakes: "الرسوم المتحركة لا تغير الاحتمال، والاسماء المكررة تعمل كتذاكر اضافية، وتعديل القائمة بعد النتيجة يجعل شرح العدالة اصعب بكثير."
    },
    luckydraw: {
      intro: "تكون اداة سحب الارقام اوضح من عجلة الاسماء عندما يجب ان تكون النتيجة رقما لتذكرة او مقعد او رمزا.",
      fit: "هي مناسبة للرافلات وارقام الانتظار والمقاعد والقسائم عندما يجب توضيح النطاق الصحيح وسياسة التكرار منذ البداية.",
      avoid: "اذا كان المستخدمون يحتاجون الى رؤية قائمة المشاركين نفسها او متابعة مطابقة واحد لواحد، فعادة ما تكون العجلة او السلم اوضح.",
      checklist: "حدد الحد الادنى والحد الاقصى، وقرر ما اذا كان التكرار مسموحا، واشرح حالات اعادة السحب، وتاكد من تطابق النطاق الفعلي مع بيانات الحدث الحقيقية.",
      mistakes: "النطاقات الخاطئة، والخلط بين رقم التذكرة وعدد المشاركين، وتجاهل الاصفار في البداية من اكثر اسباب الاعتراض شيوعا."
    },
    ladder: {
      intro: "يكون السلم العشوائي اقوى عندما تحتاج الى ربط المشاركين بالنتائج داخل خريطة مرئية واحدة.",
      fit: "هو مناسب لتوزيع الجوائز والعقوبات وترتيب الحديث والادوار عندما يجب ان يبقى المسار من كل مشارك الى نتيجته واضحا.",
      avoid: "اذا كنت تحتاج فقط الى فائز واحد او نتيجة رقمية بسيطة، فالعجلة او اداة الارقام اسهل وتتطلب اعدادا اقل.",
      checklist: "اجعل عدد المشاركين مساويا لعدد النتائج، وثبت التسميات قبل البداية، وابق اللوحة كاملة مرئية اذا كانت العملية علنية.",
      mistakes: "تغيير التسميات بعد الاعلان، او البدء بعدد غير متطابق، او اخفاء المسار المرئي يضعف الثقة اسرع من العشوائية نفسها."
    },
    coinflip: {
      intro: "رمي العملة هو اخف اداة لاتخاذ قرار بين خيارين عندما تريد نتيجة فورية من دون اعداد طويل.",
      fit: "هو مناسب لتحديد من يبدأ، وقرارات نعم او لا، وترتيب قصير عندما لا توجد الا نتيجتان صحيحتان.",
      avoid: "استخدم اداة اخرى اذا كان هناك اكثر من خيارين، او احتمالات مرجحة، او حاجة حقيقية الى سجلات ومراجعة لاحقة.",
      checklist: "اتفقوا اولا على معنى كل وجه، وقرروا هل تكفي رمية واحدة، وضعوا قاعدة بسيطة للسجل اذا كان القرار نفسه سيتكرر كثيرا.",
      mistakes: "تكرار الوجه نفسه ليس امرا مشبوها بحد ذاته، واستخدام رمي العملة لتبسيط قرارات معقدة يقلل الثقة غالبا بدل ان يزيدها."
    },
    dice: {
      intro: "يلائم رمي النرد الحالات التي تكون فيها المجاميع والنطاقات والنتائج الرقمية المتكررة اهم من اختيار شخص واحد من قائمة.",
      fit: "هو مناسب للالعاب اللوحية وجلسات تقمص الادوار ودروس الاحتمالات والفعاليات البسيطة التي يكون لتكرار الرميات فيها معنى.",
      avoid: "اذا كان الهدف الحقيقي اختيار مشارك او تكوين فرق عادلة، فالعجلة او مولد الفرق انسب من النرد.",
      checklist: "حدد عدد النرد واوجهه، وقرر هل يهمك المجموع او القيم الفردية، واشرح قواعد اعادة الرمي، واحتفظ بالسجل اذا كانت هناك جولات متكررة.",
      mistakes: "مع زيادة عدد النرد تميل النتائج طبيعيا نحو الوسط، لذلك فان الحكم على العدالة من رمية واحدة فقط يؤدي كثيرا الى قراءة خاطئة."
    },
    "team-generator": {
      intro: "تصبح صفحات تقسيم الفرق اكثر فائدة عندما تشرح لماذا قسمت القائمة بهذه الطريقة، وليس فقط عندما تنتج مجموعات عشوائية بسرعة.",
      fit: "يكفي الوضع العشوائي الخالص للخلط غير الرسمي، بينما يكون الوضع المتوازن افضل في الصفوف والمباريات وورش العمل عندما يؤثر فرق المستوى على التجربة.",
      avoid: "اذا كانت القائمة تتغير باستمرار او كانت الدرجات قديمة، فقد يسبب التقسيم المتوازن شكاوى اكثر من التوزيع العشوائي البسيط.",
      checklist: "نظف القائمة اولا، وثبت عدد الفرق، وتحقق من ان الدرجات ما زالت تعكس المستوى الحالي، ثم شارك النتيجة قبل اي تعديل يدوي.",
      mistakes: "الوضع المتوازن لا يضمن فرقا متطابقة تماما، وتنهار فكرة العدالة عند تجاهل الدرجات المفقودة او تغير المستوى حديثا او التبديل بعد التوليد."
    }
  },
  ru: {
    roulette: {
      intro: "Колесо лучше всего подходит, когда всем нужно видеть полный список участников и наблюдать публичный выбор одного имени.",
      fit: "Оно удобно для розыгрышей, выбора выступающего, очередности в классе и любых сценариев, где видимый список так же важен, как и результат.",
      avoid: "Если на самом деле нужно тянуть диапазон чисел или связывать людей с результатами, номерной выбор или лестница объясняются проще.",
      checklist: "Проверьте дубли имён, заранее объясните правила исключения и повторного выбора и сохраняйте историю, если проводится несколько раундов.",
      mistakes: "Анимация не меняет вероятность, повторяющиеся имена работают как дополнительные билеты, а редактирование списка после результата усложняет разговор о честности."
    },
    luckydraw: {
      intro: "Выбор по номерам понятнее, чем колесо имён, когда результатом должен быть номер билета, места или код.",
      fit: "Он подходит для лотерей, очередей, посадочных мест и купонов, где диапазон чисел и правило повторов должны быть очевидны заранее.",
      avoid: "Если пользователям нужно видеть сам список участников или следить за связкой один к одному, колесо или лестница обычно воспринимаются проще.",
      checklist: "Зафиксируйте минимум и максимум, решите, допустимы ли повторы, опишите условия повторного выбора и сверяйте активный диапазон с реальными данными события.",
      mistakes: "Неверный числовой диапазон, путаница между номером билета и количеством участников, а также игнорирование ведущих нулей часто вызывают споры."
    },
    ladder: {
      intro: "Лестничная жеребьёвка особенно сильна, когда нужно показать участников и результаты в одной видимой схеме соответствия.",
      fit: "Она удобна для распределения призов, наказаний, очередности выступления и ролей, когда путь каждого участника к результату должен оставаться видимым.",
      avoid: "Если нужен только один победитель или простое числовое значение, колесо или выбор по номерам проще и требуют меньше подготовки.",
      checklist: "Сделайте одинаковым число участников и результатов, зафиксируйте подписи до запуска и держите всю схему открытой, если процесс проходит публично.",
      mistakes: "Смена подписей после показа результата, несовпадающее количество элементов или скрытый путь разрушают доверие быстрее, чем сам случайный исход."
    },
    coinflip: {
      intro: "Подбрасывание монеты — самый лёгкий инструмент для быстрых решений между двумя вариантами, когда нужен мгновенный результат без длинной настройки.",
      fit: "Он подходит для выбора первого хода, решений да или нет и коротких очередностей, где допустимы ровно два исхода.",
      avoid: "Используйте другой инструмент, если вариантов больше двух, нужны взвешенные шансы или важно сохранять журналы и возвращаться к ним позже.",
      checklist: "Сначала договоритесь, что означает каждая сторона монеты, решите, достаточно ли одного броска, и задайте простое правило истории, если решение будет повторяться.",
      mistakes: "Серия одинаковых сторон сама по себе не подозрительна, а попытка упростить сложные решения монетой обычно снижает доверие, а не повышает его."
    },
    dice: {
      intro: "Бросок кубиков лучше подходит для ситуаций, где важны суммы, диапазоны и повторяющиеся числовые результаты, а не выбор одного человека из списка.",
      fit: "Он уместен в настольных играх, TRPG-сессиях, на уроках вероятности и в простых событиях с очками, где несколько бросков действительно что-то значат.",
      avoid: "Если настоящая цель — выбрать участника или собрать более справедливые команды, колесо или генератор команд подходят лучше, чем кубики.",
      checklist: "Определите число кубиков и граней, решите, важны ли суммы или отдельные значения, опишите правила переброса и сохраняйте историю при повторяющихся раундах.",
      mistakes: "При большем числе кубиков результаты естественно тянутся к середине, поэтому оценка честности по одному броску без общей картины часто бывает ошибочной."
    },
    "team-generator": {
      intro: "Страницы деления на команды становятся полезнее, когда они объясняют, почему состав был разделён именно так, а не просто быстро выдают случайные группы.",
      fit: "Режима чистой случайности достаточно для непринуждённого смешивания, а сбалансированный режим лучше подходит для уроков, матчей и воркшопов, где разница в силе меняет впечатление.",
      avoid: "Если список постоянно меняется или оценки устарели, сбалансированное деление может вызвать больше жалоб, чем простое случайное распределение.",
      checklist: "Сначала очистите список, зафиксируйте число команд, проверьте, что оценки всё ещё отражают текущий уровень, и покажите результат до ручных правок.",
      mistakes: "Сбалансированный режим не обещает идеально равные команды, и ощущение честности быстро исчезает, если игнорировать пропуски в оценках, недавние изменения уровня или обмены после генерации."
    }
  },
  id: {
    roulette: {
      intro: "Roda undian paling cocok saat semua orang perlu melihat daftar peserta lengkap dan menyaksikan satu nama dipilih secara terbuka.",
      fit: "Alat ini cocok untuk giveaway, memilih pembicara, giliran kelas, dan situasi lain ketika daftar yang terlihat sama pentingnya dengan hasil.",
      avoid: "Jika pekerjaan sebenarnya adalah mengambil rentang angka atau memasangkan orang dengan hasil, pengacak angka atau ladder draw biasanya lebih mudah dijelaskan.",
      checklist: "Periksa nama ganda, jelaskan aturan pengecualian dan pengundian ulang sebelum putaran pertama, dan simpan riwayat jika ada beberapa ronde.",
      mistakes: "Animasi putaran tidak mengubah peluang, nama yang diulang bertindak seperti tiket tambahan, dan mengedit daftar setelah hasil keluar membuat keadilan lebih sulit dijelaskan."
    },
    luckydraw: {
      intro: "Pengacak angka lebih jelas daripada roda nama ketika hasil yang dibutuhkan adalah nomor tiket, nomor kursi, atau kode.",
      fit: "Ini cocok untuk raffle, nomor antrean, kursi, dan kupon ketika rentang angka yang valid serta aturan pengulangan harus dijelaskan sejak awal.",
      avoid: "Jika pengguna perlu melihat daftar peserta itu sendiri atau mengikuti pasangan satu per satu, roda atau ladder draw biasanya lebih intuitif.",
      checklist: "Tetapkan angka minimum dan maksimum, putuskan apakah duplikasi diperbolehkan, jelaskan syarat undian ulang, dan cocokkan rentang aktif dengan data acara yang sebenarnya.",
      mistakes: "Rentang angka yang salah, kebingungan antara nomor tiket dan jumlah peserta, serta mengabaikan nol di depan adalah sumber protes yang paling umum."
    },
    ladder: {
      intro: "Ladder draw paling kuat ketika Anda perlu menghubungkan peserta dan hasil dalam satu peta visual yang terlihat jelas.",
      fit: "Ini cocok untuk pembagian hadiah, hukuman, urutan bicara, dan peran ketika jalur dari tiap peserta ke hasil akhir harus tetap terlihat.",
      avoid: "Jika Anda hanya perlu satu pemenang atau hasil angka sederhana, roda atau pengacak angka lebih mudah dan butuh persiapan lebih ringan.",
      checklist: "Samakan jumlah peserta dan hasil, kunci label sebelum mulai, dan pastikan seluruh papan terlihat jika prosesnya dilakukan secara publik.",
      mistakes: "Mengubah label setelah hasil ditampilkan, memulai dengan jumlah yang tidak cocok, atau menyembunyikan jalur visual merusak kepercayaan lebih cepat daripada hasil acak itu sendiri."
    },
    coinflip: {
      intro: "Lempar koin adalah alat paling ringan untuk keputusan dua pilihan ketika Anda butuh hasil cepat tanpa setup yang panjang.",
      fit: "Ini cocok untuk menentukan giliran pertama, keputusan ya atau tidak, dan urutan singkat ketika hanya ada dua hasil yang valid.",
      avoid: "Gunakan alat lain jika pilihannya lebih dari dua, butuh peluang berbobot, atau hasilnya perlu dicatat dan ditinjau lagi nanti.",
      checklist: "Sepakati dulu arti sisi kepala dan ekor, tentukan apakah satu lemparan cukup, dan buat aturan riwayat sederhana jika keputusan yang sama akan berulang.",
      mistakes: "Rangkaian sisi yang sama bukan hal mencurigakan dengan sendirinya, dan memakai lempar koin untuk menyederhanakan keputusan rumit biasanya justru menurunkan kepercayaan."
    },
    dice: {
      intro: "Lempar dadu lebih cocok untuk situasi ketika total, rentang, dan hasil angka berulang lebih penting daripada memilih satu orang dari daftar.",
      fit: "Ini tepat untuk board game, sesi TRPG, demo probabilitas di kelas, dan acara skor sederhana ketika banyak lemparan memang bermakna.",
      avoid: "Jika tujuan sebenarnya adalah memilih peserta atau membentuk tim yang lebih adil, roda atau pembagi tim lebih cocok daripada dadu.",
      checklist: "Tentukan jumlah dadu dan sisinya, putuskan apakah total atau nilai tiap dadu yang penting, jelaskan aturan lempar ulang, dan simpan riwayat jika ada ronde berulang.",
      mistakes: "Semakin banyak dadu, hasil alami akan cenderung ke tengah, jadi melihat satu lemparan saja tanpa distribusi keseluruhan sering membuat fairness disalahartikan."
    },
    "team-generator": {
      intro: "Halaman pembagi tim menjadi lebih bernilai ketika menjelaskan mengapa daftar dibagi seperti itu, bukan hanya saat menghasilkan grup acak dengan cepat.",
      fit: "Mode acak penuh cukup untuk pencampuran santai, sedangkan mode seimbang lebih tepat untuk kelas, pertandingan, dan workshop ketika selisih kemampuan memengaruhi pengalaman.",
      avoid: "Jika roster terus berubah atau skor sudah usang, pembagian seimbang justru bisa memicu lebih banyak keluhan daripada pembagian acak sederhana.",
      checklist: "Rapikan daftar dulu, tetapkan jumlah tim, pastikan skor masih mencerminkan kemampuan saat ini, lalu bagikan hasil sebelum ada perubahan manual.",
      mistakes: "Mode seimbang tidak menjanjikan tim yang benar-benar sama, dan rasa adil akan runtuh jika skor kosong, perubahan kemampuan terbaru, atau pertukaran setelah hasil diabaikan."
    }
  },
  tr: {
    roulette: {
      intro: "Cark, herkesin tam katilimci listesini gormesi ve bir ismin acik sekilde secildigini izlemesi gerektiginde en uygun arac olur.",
      fit: "Cekilisler, sunucu secimi, sinif sirasi ve gorunen listenin sonuc kadar onemli oldugu tum durumlarda iyi calisir.",
      avoid: "Asil is sayi araligi cekmek ya da kisileri sonuclarla eslestirmekse, sayi secici veya merdiven cekilisi genelde daha kolay anlatilir.",
      checklist: "Cift isimleri kontrol edin, ilk dondurmadan once dislama ve yeniden cekme kurallarini aciklayin, birden fazla tur varsa gecmis kaydini saklayin.",
      mistakes: "Animasyon olasiligi degistirmez, tekrar eden isimler ekstra bilet gibi calisir ve sonuc ciktiktan sonra listeyi degistirmek adalet savunmasini zorlastirir."
    },
    luckydraw: {
      intro: "Sonucun bilet numarasi, koltuk numarasi veya kod olmasi gerektiginde sayi secici isim carkindan daha nettir.",
      fit: "Rafle, sira numarasi, koltuk ve kupon kullanimlarinda gecerli aralik ile tekrar kurali bastan acik olmalidir ve bu arac buna uygundur.",
      avoid: "Kullanicilarin katilimci listesini gormesi ya da bire bir eslesmeyi takip etmesi gerekiyorsa, cark veya merdiven cekilisi daha sezgisel olabilir.",
      checklist: "Minimum ve maksimum degeri sabitleyin, tekrar izni olup olmadigini belirleyin, yeniden cekim kosullarini yazin ve aktif araligi gercek etkinlik verisiyle eslestirin.",
      mistakes: "Yanlis sayi araliklari, bilet numarasi ile katilimci sayisini karistirmak ve basindaki sifirlari gormezden gelmek itirazlarin yaygin nedenleridir."
    },
    ladder: {
      intro: "Merdiven cekilisi, katilimcilari ve sonuclari tek bir gorunur harita icinde baglamaniz gerektiginde en guclu hale gelir.",
      fit: "Odul, ceza, konusma sirasi ve rol atamalarinda her kisinin hangi sonuca gittiginin gorulmesi gerektiginde iyi calisir.",
      avoid: "Sadece tek kazanan ya da basit bir sayi sonucu gerekiyorsa, cark veya sayi secici daha az kurulum ister ve daha sadedir.",
      checklist: "Katilimci sayisi ile sonuc sayisini esit tutun, etiketleri baslamadan once sabitleyin ve surec herkese aciksa tum tahtayi gorunur halde tutun.",
      mistakes: "Sonuc aciklandiktan sonra etiketi degistirmek, sayilari esitlemeden baslamak veya gorunur yolu gizlemek guveni sonuctan daha hizli bozar."
    },
    coinflip: {
      intro: "Yazi tura, sonucu hemen almak istediginiz ve uzun kurulum istemediginiz iki secenekli kararlar icin en hafif aracdir.",
      fit: "Ilk hamle secimi, evet-hayir kararleri ve yalnizca iki gecerli sonucun oldugu kisa sira kararlarinda uygundur.",
      avoid: "Iki secenekten fazlasi varsa, agirlikli olasilik gerekiyorsa veya sonradan incelenecek kayitlar onemliyse baska bir arac kullanin.",
      checklist: "Once yazi ve turanin ne anlama geldigini kararlastirin, tek atisin yetip yetmeyecegini belirleyin ve ayni karar tekrar edecekse basit bir gecmis kurali koyun.",
      mistakes: "Ayni yuzun ust uste gelmesi tek basina supheli degildir ve karmasik kararlarini yazi turayla sadeleştirmek genelde guveni arttirmak yerine azaltir."
    },
    dice: {
      intro: "Zar atma, toplamlarin, araliklarin ve tekrar eden sayisal sonuclarin bir listeden bir kisi secmekten daha onemli oldugu durumlara daha cok uyar.",
      fit: "Masa oyunlari, TRPG oturumlari, olasilik dersleri ve coklu atislarin anlamli oldugu basit puan etkinlikleri icin uygundur.",
      avoid: "Gercek amac bir katilimci secmek ya da daha adil takimlar olusturmaksa, cark veya takim olusturucu zar yerine daha uygun olur.",
      checklist: "Zar sayisini ve yuz sayisini belirleyin, toplam mi tekil deger mi onemli karar verin, yeniden atis kurallarini aciklayin ve tekrarli turlarda gecmisi saklayin.",
      mistakes: "Zar sayisi arttikca sonuclar dogal olarak orta degerlere yaklasir; bu nedenle tek bir atisa bakip genel dagilimi gormemek adaleti yanlis yorumlatir."
    },
    "team-generator": {
      intro: "Takim sayfalari, liste neden o sekilde bolundu diye aciklama yaptiklarinda, sadece hizli rastgele grup urettiklerinden daha degerli hale gelir.",
      fit: "Saf rastgele mod rahat karisimlar icin yeterlidir; dengeli mod ise seviye farkinin deneyimi etkiledigi ders, mac ve atolyelerde daha uygundur.",
      avoid: "Liste surekli degisiyorsa veya puanlar guncel degilse, dengeli bolum basit rastgele atamadan daha fazla sikayet uretebilir.",
      checklist: "Once listeyi temizleyin, takim sayisini sabitleyin, puanlarin guncel yetenegi yansittigini kontrol edin ve elle mudahale etmeden once sonucu paylasin.",
      mistakes: "Dengeli mod tam esit takimlar garanti etmez; eksik puanlari, yeni seviye degisimlerini veya sonradan yapilan oyuncu degisikliklerini yok saymak adalet algisini bozar."
    }
  },
  it: {
    roulette: {
      intro: "La ruota funziona meglio quando tutti devono vedere l'elenco completo dei partecipanti e osservare pubblicamente quale nome viene scelto.",
      fit: "E adatta a giveaway, scelta del relatore, turni in classe e a ogni situazione in cui l'elenco visibile conta quanto il risultato.",
      avoid: "Se il vero compito e estrarre intervalli numerici o collegare persone e risultati, un estrattore di numeri o la scala casuale si spiegano meglio.",
      checklist: "Controlla i nomi duplicati, spiega le regole di esclusione e di nuova estrazione prima del primo giro e conserva lo storico se ci saranno piu round.",
      mistakes: "L'animazione non cambia la probabilita, i nomi ripetuti agiscono come biglietti extra e modificare la lista dopo il risultato rende molto piu difficile difendere l'equita."
    },
    luckydraw: {
      intro: "L'estrattore di numeri e piu chiaro di una ruota di nomi quando il risultato deve essere un numero di biglietto, di posto o un codice.",
      fit: "E adatto a lotterie, numeri di coda, posti a sedere e coupon quando l'intervallo valido e la regola sui duplicati devono essere espliciti fin dall'inizio.",
      avoid: "Se gli utenti devono vedere l'elenco dei partecipanti o seguire un abbinamento uno a uno, ruota o scala risultano spesso piu intuitive.",
      checklist: "Blocca minimo e massimo, decidi se sono ammessi numeri ripetuti, definisci quando rifare l'estrazione e verifica che l'intervallo attivo coincida con i dati reali dell'evento.",
      mistakes: "Intervalli numerici sbagliati, confusione tra numero del biglietto e numero dei partecipanti e zeri iniziali ignorati sono tra le cause piu comuni di contestazione."
    },
    ladder: {
      intro: "La scala casuale e piu forte quando devi collegare partecipanti e risultati dentro una mappa visiva unica.",
      fit: "Funziona bene per assegnare premi, penitenze, ordine di parola e ruoli quando il percorso di ogni persona verso il risultato deve restare visibile.",
      avoid: "Se ti serve solo un vincitore o un numero semplice, ruota o estrattore numerico richiedono meno preparazione e restano piu lineari.",
      checklist: "Fai combaciare numero di partecipanti e risultati, congela le etichette prima di iniziare e mantieni visibile l'intera tabella se il processo e pubblico.",
      mistakes: "Cambiare le etichette dopo la rivelazione, partire con quantita diverse o nascondere il percorso visibile rompe la fiducia piu in fretta del caso stesso."
    },
    coinflip: {
      intro: "Testa o croce e lo strumento piu leggero per decisioni a due opzioni quando vuoi un risultato immediato senza una preparazione lunga.",
      fit: "Si adatta alla scelta di chi parte, alle decisioni si o no e agli ordini brevi in cui esistono esattamente due esiti validi.",
      avoid: "Usa un altro strumento se ci sono piu di due opzioni, probabilita pesate o una reale necessita di conservare log e rivederli dopo.",
      checklist: "Concordate prima il significato di ciascun lato, decidete se basta un solo lancio e fissate una regola semplice di storico se la stessa decisione tornera spesso.",
      mistakes: "Una serie della stessa faccia non e sospetta di per se, e usare testa o croce per semplificare decisioni complesse spesso riduce la fiducia invece di aumentarla."
    },
    dice: {
      intro: "Il lancio dei dadi si adatta meglio alle situazioni in cui contano somme, intervalli e risultati numerici ripetuti, piu che scegliere una persona da un elenco.",
      fit: "E adatto a giochi da tavolo, sessioni TRPG, dimostrazioni di probabilita e semplici eventi a punteggio in cui piu lanci hanno un significato.",
      avoid: "Se il vero obiettivo e scegliere un partecipante o creare squadre piu eque, ruota o generatore di squadre si adattano meglio dei dadi.",
      checklist: "Definisci numero di dadi e facce, decidi se contano i totali o i valori singoli, spiega le regole di rilancio e conserva lo storico se i round si ripetono.",
      mistakes: "Con piu dadi i risultati tendono naturalmente verso il centro, quindi guardare un solo lancio senza considerare la distribuzione complessiva porta spesso a leggere male l'equita."
    },
    "team-generator": {
      intro: "Le pagine di divisione squadre diventano piu utili quando spiegano perche il roster e stato diviso in quel modo, non solo quando generano gruppi casuali rapidamente.",
      fit: "La modalita completamente casuale basta per mescolare gruppi informali, mentre la modalita bilanciata e migliore per lezioni, partite e workshop in cui il divario di livello cambia l'esperienza.",
      avoid: "Se il roster cambia di continuo o i punteggi sono vecchi, una divisione bilanciata puo creare piu lamentele di un'assegnazione casuale semplice.",
      checklist: "Pulisci prima il roster, fissa il numero di squadre, verifica che i punteggi riflettano ancora l'abilita attuale e condividi il risultato prima di ritocchi manuali.",
      mistakes: "La modalita bilanciata non promette squadre perfettamente uguali, e la percezione di equita crolla se ignori punteggi mancanti, cambi recenti o scambi dopo la generazione."
    }
  },
  vi: {
    roulette: {
      intro: "Vong quay phu hop nhat khi moi nguoi can nhin thay day du danh sach nguoi tham gia va xem cong khai mot ten duoc chon ra.",
      fit: "No hop voi giveaway, chon nguoi phat bieu, thu tu trong lop va moi tinh huong ma danh sach hien thi quan trong ngang voi ket qua.",
      avoid: "Neu cong viec thuc su la rut mot khoang so hoac gan nguoi voi ket qua, bo chon so hoac ladder draw thuong de giai thich hon.",
      checklist: "Kiem tra ten bi trung, giai thich quy tac loai tru va quay lai truoc lan quay dau tien, va luu lich su neu se co nhieu vong.",
      mistakes: "Hoat anh quay khong lam thay doi xac suat, ten lap lai hoat dong nhu ve bo sung, va sua danh sach sau khi co ket qua se lam viec giai thich tinh cong bang kho hon."
    },
    luckydraw: {
      intro: "Bo chon so ro rang hon vong quay ten khi ket qua can la ma ve, so ghe hoac ma code.",
      fit: "No phu hop voi raffle, so thu tu, ghe ngoi va coupon khi khoang so hop le va quy tac lap lai can duoc noi ro ngay tu dau.",
      avoid: "Neu nguoi dung can thay danh sach tham gia hoac theo doi ghep cap mot-mot, vong quay hoac ladder draw thuong truc quan hon.",
      checklist: "Khoa gia tri nho nhat va lon nhat, quyet dinh co cho phep trung hay khong, mo ta dieu kien rut lai, va doi chieu khoang so dang dung voi du lieu that cua su kien.",
      mistakes: "Khoang so sai, nham lan giua ma ve va so nguoi tham gia, va bo qua dinh dang co so 0 o dau la nhung nguon tranh cai pho bien nhat."
    },
    ladder: {
      intro: "Ladder draw manh nhat khi ban can noi nguoi tham gia va ket qua trong cung mot ban do hien thi de nhin.",
      fit: "No hop cho viec chia thuong, hinh phat, thu tu phat bieu va vai tro khi duong di tu moi nguoi den ket qua can duoc giu hien ro.",
      avoid: "Neu ban chi can mot nguoi thang hoac mot ket qua so don gian, vong quay hoac bo chon so se don gian va it ton cong chuan bi hon.",
      checklist: "Dam bao so nguoi tham gia bang so ket qua, khoa nhan truoc khi bat dau, va giu toan bo bang nhin thay neu quy trinh dien ra cong khai.",
      mistakes: "Doi nhan sau khi lo ket qua, bat dau voi so luong khong khop, hoac an duong di hien thi se lam mat long tin nhanh hon ca tinh ngau nhien."
    },
    coinflip: {
      intro: "Tung dong xu la cong cu nhe nhat cho cac quyet dinh hai lua chon khi ban can ket qua ngay lap tuc ma khong muon thiet lap dai dong.",
      fit: "No phu hop cho viec quyet dinh luot dau, chon co hay khong, va cac quyet dinh thu tu ngan khi chi co hai ket qua hop le.",
      avoid: "Hay dung cong cu khac neu co hon hai lua chon, can xac suat co trong so, hoac can luu log de xem lai sau nay.",
      checklist: "Thong nhat truoc xem mat nao mang y nghia gi, xac dinh mot lan tung co du khong, va dat mot quy tac lich su don gian neu cung mot quyet dinh lap lai nhieu lan.",
      mistakes: "Chuoi ra cung mot mat khong tu dong la dang ngo, va dung dong xu de xu ly cac quyet dinh phuc tap thuong lam giam long tin hon la tang len."
    },
    dice: {
      intro: "Tung xuc xac phu hop hon trong cac tinh huong tong diem, khoang gia tri va ket qua so lap lai quan trong hon viec chon mot nguoi tu danh sach.",
      fit: "No hop voi board game, buoi TRPG, demo xac suat tren lop va cac su kien tinh diem don gian noi nhieu lan tung deu co y nghia.",
      avoid: "Neu muc tieu thuc su la chon mot nguoi tham gia hoac chia doi cong bang hon, vong quay hoac cong cu chia doi hop hon xuc xac.",
      checklist: "Dat so luong xuc xac va so mat, quyet dinh xem tong hay tung gia tri rieng la quan trong, mo ta quy tac tung lai, va giu lich su neu co nhieu vong.",
      mistakes: "Nhieu xuc xac se tu nhien keo ket qua ve giua, vi vay chi nhin mot lan tung ma bo qua phan bo tong the thuong dan den danh gia sai ve tinh cong bang."
    },
    "team-generator": {
      intro: "Trang chia doi co gia tri hon khi no giai thich vi sao roster duoc chia theo cach do, khong chi don thuan tao nhom ngau nhien nhanh."
      ,fit: "Che do ngau nhien thuần tuy du cho viec tron nhom thoai mai, trong khi che do can bang phu hop hon voi lop hoc, tran dau va workshop noi chenh lech trinh do anh huong den trai nghiem.",
      avoid: "Neu roster thay doi lien tuc hoac diem so da cu, cach chia can bang co the tao nhieu phan nan hon so voi viec chia ngau nhien don gian.",
      checklist: "Lam sach roster truoc, khoa so doi, xac nhan diem dau vao van phan anh nang luc hien tai, roi chia se ket qua truoc khi co sua doi thu cong.",
      mistakes: "Che do can bang khong dam bao cac doi bang nhau hoan hao, va cam nhan cong bang se sup do neu ban bo qua diem thieu, thay doi gan day hoac viec doi nguoi sau khi tao ket qua."
    }
  },
  th: {
    roulette: {
      intro: "วงล้อเหมาะที่สุดเมื่อทุกคนต้องเห็นรายชื่อผู้เข้าร่วมทั้งหมดและดูการเลือกชื่อหนึ่งคนแบบเปิดเผยต่อหน้า",
      fit: "เหมาะกับการจับรางวัล การเลือกผู้พูด ลำดับในห้องเรียน และทุกกรณีที่รายชื่อที่มองเห็นได้สำคัญพอ ๆ กับผลลัพธ์",
      avoid: "ถ้างานจริงคือการสุ่มช่วงตัวเลขหรือจับคู่คนกับผลลัพธ์ เครื่องมือสุ่มตัวเลขหรือบันไดสุ่มมักอธิบายได้ง่ายกว่า",
      checklist: "ตรวจสอบชื่อซ้ำ อธิบายกติกาการตัดออกและการสุ่มใหม่ก่อนหมุนครั้งแรก และเก็บประวัติผลลัพธ์ไว้หากมีหลายรอบ",
      mistakes: "แอนิเมชันการหมุนไม่ได้เปลี่ยนความน่าจะเป็น ชื่อที่ซ้ำทำหน้าที่เหมือนตั๋วเพิ่ม และการแก้รายชื่อหลังผลออกแล้วทำให้การอธิบายความยุติธรรมยากขึ้น"
    },
    luckydraw: {
      intro: "เครื่องมือสุ่มตัวเลขชัดเจนกว่าวงล้อชื่อเมื่อผลลัพธ์ควรเป็นหมายเลขบัตร หมายเลขที่นั่ง หรือรหัส",
      fit: "เหมาะกับ raffle คิว หมายเลขที่นั่ง และคูปองที่ต้องอธิบายช่วงตัวเลขที่ใช้ได้และนโยบายการซ้ำตั้งแต่ต้น",
      avoid: "ถ้าผู้ใช้ต้องเห็นรายชื่อผู้เข้าร่วมหรือเข้าใจการจับคู่แบบหนึ่งต่อหนึ่ง วงล้อหรือบันไดสุ่มมักตรงไปตรงมากว่า",
      checklist: "กำหนดค่าต่ำสุดและสูงสุด ตัดสินใจว่าจะอนุญาตให้ซ้ำหรือไม่ อธิบายเงื่อนไขการสุ่มใหม่ และตรวจว่าช่วงตัวเลขตรงกับข้อมูลจริงของงาน",
      mistakes: "ช่วงตัวเลขผิด สับสนระหว่างเลขบัตรกับจำนวนผู้เข้าร่วม และมองข้ามเลขศูนย์นำหน้า เป็นสาเหตุของการโต้แย้งที่พบบ่อยมาก"
    },
    ladder: {
      intro: "บันไดสุ่มแข็งแรงที่สุดเมื่อคุณต้องเชื่อมผู้เข้าร่วมกับผลลัพธ์ภายในแผนผังที่มองเห็นได้ในหน้าจอเดียว",
      fit: "เหมาะกับการแจกของรางวัล บทลงโทษ ลำดับการพูด และการจับคู่บทบาท เมื่อเส้นทางจากแต่ละคนไปสู่ผลลัพธ์ควรถูกมองเห็นได้ชัด",
      avoid: "ถ้าคุณต้องการเพียงผู้ชนะคนเดียวหรือผลลัพธ์ตัวเลขง่าย ๆ วงล้อหรือเครื่องมือสุ่มตัวเลขจะง่ายกว่าและใช้การเตรียมน้อยกว่า",
      checklist: "ทำให้จำนวนผู้เข้าร่วมเท่ากับจำนวนผลลัพธ์ ตรึงป้ายกำกับก่อนเริ่ม และถ้าเป็นการดำเนินการสาธารณะให้เห็นกระดานทั้งหมด",
      mistakes: "การเปลี่ยนป้ายหลังประกาศผล การเริ่มด้วยจำนวนที่ไม่ตรงกัน หรือการซ่อนเส้นทางที่มองเห็นได้ จะทำลายความเชื่อถือเร็วกว่าผลสุ่มเสียอีก"
    },
    coinflip: {
      intro: "การโยนเหรียญเป็นเครื่องมือที่เบาที่สุดสำหรับการตัดสินใจสองทางเมื่อคุณต้องการผลลัพธ์ทันทีโดยไม่ต้องตั้งค่านาน",
      fit: "เหมาะกับการตัดสินว่าใครเริ่มก่อน การตอบใช่หรือไม่ใช่ และการเรียงลำดับสั้น ๆ ที่มีผลลัพธ์ที่ถูกต้องเพียงสองแบบ",
      avoid: "ควรใช้เครื่องมืออื่นหากมีตัวเลือกมากกว่าสองแบบ ต้องการโอกาสแบบถ่วงน้ำหนัก หรือจำเป็นต้องเก็บบันทึกไว้ตรวจสอบภายหลัง",
      checklist: "ตกลงก่อนว่าหัวและก้อยหมายถึงอะไร ตัดสินใจว่าการโยนครั้งเดียวพอหรือไม่ และกำหนดกติกาประวัติอย่างง่ายถ้าการตัดสินใจแบบเดิมจะเกิดซ้ำหลายครั้ง",
      mistakes: "การออกหน้าเดิมต่อเนื่องไม่ใช่เรื่องน่าสงสัยด้วยตัวเอง และการใช้โยนเหรียญเพื่อทำให้การตัดสินใจซับซ้อนดูง่ายเกินไป มักทำให้ความเชื่อถือลดลง"
    },
    dice: {
      intro: "การทอยลูกเต๋าเหมาะกับสถานการณ์ที่ผลรวม ช่วงค่า และผลลัพธ์ตัวเลขที่เกิดซ้ำมีความสำคัญมากกว่าการเลือกคนหนึ่งคนจากรายชื่อ",
      fit: "เหมาะกับบอร์ดเกม เซสชัน TRPG การสาธิตความน่าจะเป็นในห้องเรียน และกิจกรรมให้คะแนนง่าย ๆ ที่การทอยหลายครั้งมีความหมาย",
      avoid: "ถ้าเป้าหมายจริงคือเลือกผู้เข้าร่วมหรือสร้างทีมที่ยุติธรรมกว่า วงล้อหรือเครื่องมือแบ่งทีมจะเข้ากับงานมากกว่าลูกเต๋า",
      checklist: "กำหนดจำนวนลูกเต๋าและจำนวนหน้า ตัดสินใจว่าจะดูผลรวมหรือค่ารายลูก อธิบายกติกาการทอยใหม่ และเก็บประวัติหากมีหลายรอบ",
      mistakes: "เมื่อลูกเต๋ามีหลายลูก ผลลัพธ์จะโน้มเข้าหาค่ากลางตามธรรมชาติ ดังนั้นการดูเพียงครั้งเดียวโดยไม่ดูการกระจายรวมมักทำให้ตีความความยุติธรรมผิด"
    },
    "team-generator": {
      intro: "หน้าสร้างทีมจะมีคุณค่ามากขึ้นเมื่ออธิบายได้ว่าทำไมรายชื่อจึงถูกแบ่งออกแบบนั้น ไม่ใช่แค่สร้างกลุ่มแบบสุ่มได้เร็วเท่านั้น",
      fit: "โหมดสุ่มล้วนเพียงพอสำหรับการคละกลุ่มแบบสบาย ๆ ส่วนโหมดสมดุลเหมาะกว่าสำหรับห้องเรียน การแข่งขัน และเวิร์กช็อปที่ความต่างของฝีมือมีผลต่อประสบการณ์",
      avoid: "ถ้ารายชื่อเปลี่ยนตลอดเวลาหรือคะแนนล้าสมัย การแบ่งแบบสมดุลอาจสร้างคำบ่นมากกว่าการสุ่มแบบง่าย",
      checklist: "จัดระเบียบรายชื่อก่อน ล็อกจำนวนทีม ตรวจสอบว่าคะแนนยังสะท้อนความสามารถปัจจุบัน และแชร์ผลลัพธ์ก่อนมีการปรับมือ",
      mistakes: "โหมดสมดุลไม่ได้รับประกันว่าทีมจะเท่ากันสมบูรณ์ และความรู้สึกยุติธรรมจะหายไปทันทีหากมองข้ามคะแนนที่หายไป การเปลี่ยนฟอร์มล่าสุด หรือการสลับคนหลังสร้างผลลัพธ์"
    }
  },
  nl: {
    roulette: {
      intro: "Het rad werkt het best wanneer iedereen de volledige deelnemerslijst moet zien en publiek kan volgen welke naam wordt gekozen.",
      fit: "Het past bij weggeefacties, het kiezen van een spreker, klasbeurten en elke situatie waarin de zichtbare lijst net zo belangrijk is als de uitkomst.",
      avoid: "Als het echte werk draait om het trekken van een nummerbereik of het koppelen van mensen aan uitkomsten, zijn een nummertrekker of laddertrekking meestal makkelijker uit te leggen.",
      checklist: "Controleer dubbele namen, leg uitsluitings- en herhaalregels uit voor de eerste draai en bewaar de geschiedenis als je meerdere rondes draait.",
      mistakes: "De animatie verandert de kans niet, dubbele namen werken als extra loten en het aanpassen van de lijst na de uitslag maakt eerlijkheid moeilijker te onderbouwen."
    },
    luckydraw: {
      intro: "De nummertrekker is duidelijker dan een namenrad wanneer de uitkomst een lotnummer, stoelnummer of code moet zijn.",
      fit: "Hij past bij loterijen, wachtnummers, zitplaatsen en coupons waarbij het geldige bereik en het beleid rond herhaling vooraf duidelijk moeten zijn.",
      avoid: "Als gebruikers de deelnemerslijst zelf moeten zien of een een-op-een-koppeling moeten volgen, zijn het rad of de ladder vaak intuïtiever.",
      checklist: "Zet minimum en maximum vast, bepaal of herhalingen zijn toegestaan, leg hertekensituaties uit en controleer of het actieve bereik overeenkomt met de echte eventdata.",
      mistakes: "Verkeerde nummerbereiken, verwarring tussen lotnummer en aantal deelnemers en het negeren van voorloopnullen veroorzaken vaak discussie."
    },
    ladder: {
      intro: "De laddertrekking is het sterkst wanneer je deelnemers en uitkomsten in één zichtbare kaart met elkaar moet verbinden.",
      fit: "Hij werkt goed voor prijsverdeling, strafopdrachten, spreekvolgorde en roltoewijzing wanneer het pad van elke deelnemer naar het resultaat zichtbaar moet blijven.",
      avoid: "Als je alleen één winnaar of een eenvoudig getal nodig hebt, vragen rad of nummertrekker minder voorbereiding en zijn ze eenvoudiger.",
      checklist: "Laat het aantal deelnemers en uitkomsten overeenkomen, zet labels vast voor de start en houd het volledige bord zichtbaar als het proces openbaar is.",
      mistakes: "Labels wijzigen na de onthulling, starten met ongelijke aantallen of het zichtbare pad verbergen breekt vertrouwen sneller af dan de willekeur zelf."
    },
    coinflip: {
      intro: "Kop of munt is het lichtste hulpmiddel voor snelle beslissingen tussen twee opties wanneer je meteen een uitkomst wilt zonder lange instelling.",
      fit: "Het is geschikt voor bepalen wie begint, ja-of-nee-besluiten en korte volgordekwesties met precies twee geldige uitkomsten.",
      avoid: "Gebruik iets anders als er meer dan twee opties zijn, gewogen kansen nodig zijn of als logboeken en latere controle echt belangrijk zijn.",
      checklist: "Spreek eerst af wat kop en munt betekenen, bepaal of één worp genoeg is en leg een simpele geschiedenislijn vast als dezelfde beslissing vaker terugkomt.",
      mistakes: "Een reeks van dezelfde kant is op zichzelf niet verdacht, en complexe beslissingen terugbrengen tot kop of munt verkleint meestal juist het vertrouwen."
    },
    dice: {
      intro: "Dobbelstenen passen beter bij situaties waarin totalen, bereiken en herhaalde numerieke uitkomsten belangrijker zijn dan één persoon uit een lijst kiezen.",
      fit: "Ze zijn geschikt voor bordspellen, TRPG-sessies, kansdemonstraties en eenvoudige score-evenementen waarbij meerdere worpen betekenis hebben.",
      avoid: "Als het echte doel is om een deelnemer te kiezen of eerlijkere teams te vormen, passen een rad of teamgenerator beter dan dobbelstenen.",
      checklist: "Bepaal het aantal dobbelstenen en zijden, kies of totalen of losse waarden tellen, leg herworpregels uit en bewaar geschiedenis bij herhaalde rondes.",
      mistakes: "Met meerdere dobbelstenen trekken resultaten vanzelf naar het midden, dus alleen naar één worp kijken zonder de totale verdeling mee te nemen geeft snel een verkeerd beeld van eerlijkheid."
    },
    "team-generator": {
      intro: "Teamverdelingspagina's worden waardevoller wanneer ze uitleggen waarom een lijst zo is opgesplitst, niet alleen wanneer ze snel willekeurige groepen tonen.",
      fit: "Volledig willekeurig is prima voor informeel mengen, terwijl de gebalanceerde modus beter is voor lessen, wedstrijden en workshops waar niveauverschillen de ervaring beïnvloeden.",
      avoid: "Als de lijst voortdurend verandert of scores verouderd zijn, kan een gebalanceerde verdeling meer klachten oproepen dan een eenvoudige willekeurige toewijzing.",
      checklist: "Maak eerst de lijst schoon, zet het aantal teams vast, controleer of de scores het huidige niveau nog weerspiegelen en deel het resultaat voordat er handmatig wordt aangepast.",
      mistakes: "De gebalanceerde modus garandeert geen perfect gelijke teams, en het gevoel van eerlijkheid verdwijnt snel wanneer ontbrekende scores, recente vormveranderingen of latere wissels worden genegeerd."
    }
  }
};

module.exports = {
  EDITORIAL_LABELS,
  TOOL_EDITORIAL_COPY
};
