const COIN_DICE_COPY = {
  ko: {
    sections: {
      howTo: '사용 방법',
      whatIs: '이 도구는 무엇인가요?',
      faq: 'FAQ',
      tryOtherTools: '다른 도구도 사용해보기',
      relatedTools: '관련 도구'
    },
    coinflip: {
      heroSubtitle: '1~20개의 동전을 한 번에 던져 빠른 결정, 게임 진행, 발표 순서 정하기에 바로 활용하세요.',
      guideSubtitle: '동전 던지기는 브라우저 안에서만 동작하며 앞/뒤 개수와 기록을 바로 확인하고 CSV로 내보낼 수 있습니다.',
      steps: [
        { title: '1. 동전 개수 정하기', body: '한 번에 던질 동전 수를 1~20개 사이에서 선택합니다.' },
        { title: '2. 속도 맞추기', body: '빠른 확인용 또는 화면 공유용에 맞게 애니메이션 시간을 조정합니다.' },
        { title: '3. 결과 기록하기', body: '앞/뒤 합계와 회차 기록을 확인하고 필요하면 CSV로 저장합니다.' }
      ],
      howTo: [
        '한 번에 던질 동전 수를 선택합니다.',
        '짧게 확인할지, 화면에서 보여줄지에 맞춰 애니메이션 시간을 정합니다.',
        '동전을 던진 뒤 앞/뒤 개수와 결과를 바로 확인합니다.',
        '이전 회차 기록을 살펴보고 필요하면 CSV로 저장합니다.'
      ],
      whatIs: [
        '동전 던지기는 50:50 결정, 발표 순서, 게임 선공 정하기, 간단한 추첨에 쓰기 좋은 브라우저 기반 도구입니다.',
        '모바일과 데스크톱에서 바로 사용할 수 있고, 별도 로그인 없이 결과 기록을 페이지에서 확인하고 저장할 수 있습니다.'
      ],
      faq: [
        { q: '모바일에서도 잘 작동하나요?', a: '네. 화면 크기에 맞춰 레이아웃이 자동으로 조정됩니다.' },
        { q: '동전을 여러 개 동시에 던질 수 있나요?', a: '네. 한 번에 1개부터 20개까지 던질 수 있어 빠른 비교나 팀별 결정에도 쓸 수 있습니다.' },
        { q: '결과 기록을 저장할 수 있나요?', a: '네. 각 회차 기록을 확인한 뒤 CSV로 내보낼 수 있습니다.' },
        { q: '데이터가 외부 서버로 전송되나요?', a: '아니요. 결과와 기록은 브라우저 안에서 처리됩니다.' }
      ]
    },
    dice: {
      heroSubtitle: '1~12개의 주사위를 동시에 굴려 게임, 수업, 간단한 추첨과 확률 확인에 바로 활용하세요.',
      guideSubtitle: '주사위 굴리기는 브라우저 안에서만 동작하며 각 눈, 합계, 평균, 기록을 한 화면에서 확인할 수 있습니다.',
      steps: [
        { title: '1. 개수 선택하기', body: '한 번에 굴릴 주사위 수를 1~12개 사이에서 고릅니다.' },
        { title: '2. 속도 조정하기', body: '빠른 테스트용이나 화면 공유용에 맞게 굴림 시간을 조정합니다.' },
        { title: '3. 결과 저장하기', body: '각 눈, 합계, 평균, 홀짝 리포트를 확인하고 CSV로 저장합니다.' }
      ],
      howTo: [
        '굴릴 주사위 개수를 선택합니다.',
        '짧은 확인용인지, 연출용인지에 맞춰 애니메이션 시간을 조정합니다.',
        '굴림을 실행한 뒤 각 눈과 합계, 평균, 홀짝 결과를 확인합니다.',
        '이전 회차 기록을 검토하고 필요하면 CSV로 내보냅니다.'
      ],
      whatIs: [
        '주사위 굴리기는 보드게임, TRPG, 수업 활동, 간단한 랜덤 결정에 쓰기 좋은 브라우저 기반 도구입니다.',
        '모바일과 데스크톱에서 바로 사용할 수 있고, 별도 로그인 없이 결과 이력과 요약값을 확인하고 저장할 수 있습니다.'
      ],
      faq: [
        { q: '모바일에서도 잘 작동하나요?', a: '네. 화면 크기에 맞춰 레이아웃이 자동으로 조정됩니다.' },
        { q: '주사위를 여러 개 동시에 굴릴 수 있나요?', a: '네. 한 번에 1개부터 12개까지 굴릴 수 있으며 각 눈과 합계를 함께 보여줍니다.' },
        { q: '결과 기록을 저장할 수 있나요?', a: '네. 회차별 결과를 CSV로 내보낼 수 있습니다.' },
        { q: '데이터가 외부 서버로 전송되나요?', a: '아니요. 결과와 기록은 브라우저 안에서 처리됩니다.' }
      ]
    }
  },
  en: {
    sections: {
      howTo: 'How to Use',
      whatIs: 'What Is This Tool?',
      faq: 'FAQ',
      tryOtherTools: 'Try Other Tools',
      relatedTools: 'Related tools'
    },
    coinflip: {
      heroSubtitle: 'Flip 1 to 20 coins at once for fair tie-breaks, classroom games, giveaways, and quick everyday decisions.',
      guideSubtitle: 'Coin Flip runs locally in your browser, shows clear heads and tails totals, and lets you export result history when you need a record.',
      steps: [
        { title: '1. Choose coin count', body: 'Pick how many coins to flip in one run, from 1 to 20.' },
        { title: '2. Set flip pace', body: 'Use a shorter or longer animation depending on whether you want speed or presentation.' },
        { title: '3. Review and export', body: 'Check the totals for each side and export the run history as CSV if needed.' }
      ],
      howTo: [
        'Choose how many coins to flip at once.',
        'Set a short or long animation depending on whether you want speed or a clearer reveal.',
        'Press Flip and review the heads and tails counts right away.',
        'Open the history panel and export CSV when you need a simple record.'
      ],
      whatIs: [
        'Coin Flip is a browser-based tool for fair 50:50 choices, tie-breaks, classroom activities, games, and quick group decisions.',
        'It keeps the result view simple on mobile and desktop, and you can review or export history without creating an account.'
      ],
      faq: [
        { q: 'Does it work well on mobile?', a: 'Yes. The layout adapts automatically to smaller screens.' },
        { q: 'Can I flip multiple coins at once?', a: 'Yes. You can flip from 1 to 20 coins in one run for quick comparisons or group decisions.' },
        { q: 'Can I save the result history?', a: 'Yes. Each run stays in the history list and can be exported as CSV.' },
        { q: 'Is my data sent to external servers?', a: 'No. Results and history stay in your browser.' }
      ]
    },
    dice: {
      heroSubtitle: 'Roll 1 to 12 dice at once for board games, tabletop RPGs, classroom activities, giveaways, and quick random checks.',
      guideSubtitle: 'Dice Roll runs locally in your browser, shows each face, total, and average, and lets you export roll history when you need a record.',
      steps: [
        { title: '1. Choose dice count', body: 'Select between 1 and 12 dice for a single run.' },
        { title: '2. Set roll pace', body: 'Adjust animation time for a quick check or a more visible reveal.' },
        { title: '3. Review totals and save', body: 'See each face, total, average, and history entry, then export CSV when needed.' }
      ],
      howTo: [
        'Choose how many dice to roll at once.',
        'Adjust animation time depending on whether you want speed or presentation.',
        'Press Roll and review each face, the total, the average, and the odd-even report.',
        'Open the history panel and export CSV if you need a record of the session.'
      ],
      whatIs: [
        'Dice Roll is a browser-based dice roller for board games, tabletop RPGs, classroom activities, and quick random decisions.',
        'It works on mobile and desktop, shows useful summaries for each run, and lets you keep or export the roll history without signing in.'
      ],
      faq: [
        { q: 'Does it work well on mobile?', a: 'Yes. The layout adapts automatically to smaller screens.' },
        { q: 'Can I roll multiple dice at once?', a: 'Yes. You can roll from 1 to 12 dice in one run and review each face together.' },
        { q: 'Can I save the roll history?', a: 'Yes. Each run stays in the history list and can be exported as CSV.' },
        { q: 'Is my data sent to external servers?', a: 'No. Results and history stay in your browser.' }
      ]
    }
  },
  ja: {
    sections: {
      howTo: '使い方',
      whatIs: 'このツールとは？',
      faq: 'FAQ',
      tryOtherTools: '他のツールも使ってみる',
      relatedTools: '関連ツール'
    },
    coinflip: {
      heroSubtitle: '1〜20枚のコインをまとめて投げて、すばやい判断やゲーム進行、抽選の確認に使えます。',
      guideSubtitle: 'コイントスはブラウザ内だけで動作し、表/裏の集計と履歴をその場で確認してCSVで保存できます。',
      steps: [
        { title: '1. 枚数を決める', body: '1回で投げるコインの枚数を1〜20枚から選びます。' },
        { title: '2. 速度を調整する', body: 'すぐ確認したい時と見せながら使いたい時でアニメーション時間を調整します。' },
        { title: '3. 結果を保存する', body: '表/裏の合計と履歴を確認し、必要ならCSVで書き出します。' }
      ],
      howTo: [
        '一度に投げるコインの枚数を選びます。',
        '用途に合わせてアニメーション時間を短くするか長くするか決めます。',
        'コインを投げて、表/裏の結果をすぐ確認します。',
        '履歴パネルを確認し、必要ならCSVで保存します。'
      ],
      whatIs: [
        'コイントスは、50:50の判断、順番決め、授業やゲームの進行、簡単な抽選に使いやすいブラウザベースのツールです。',
        'スマートフォンとデスクトップの両方で使え、ログインなしで結果履歴の確認と保存ができます。'
      ],
      faq: [
        { q: 'スマホでも使えますか？', a: 'はい。画面幅に合わせてレイアウトが自動で調整されます。' },
        { q: '複数のコインを同時に投げられますか？', a: 'はい。1〜20枚を一度に投げられるので、比較やグループ決定にも向いています。' },
        { q: '結果履歴は保存できますか？', a: 'はい。各回の履歴を確認し、CSVとして書き出せます。' },
        { q: 'データは外部サーバーに送信されますか？', a: 'いいえ。結果と履歴はブラウザ内で処理されます。' }
      ]
    },
    dice: {
      heroSubtitle: '1〜12個のサイコロを同時に振って、ゲームや授業、ランダム確認にすぐ使えます。',
      guideSubtitle: 'サイコロツールはブラウザ内だけで動作し、各出目、合計、平均、履歴をその場で確認できます。',
      steps: [
        { title: '1. 個数を選ぶ', body: '1回で振るサイコロの数を1〜12個から選びます。' },
        { title: '2. 速度を調整する', body: 'すぐ確認したい時と見せながら使いたい時でアニメーション時間を調整します。' },
        { title: '3. 結果を保存する', body: '各出目、合計、平均、履歴を確認し、必要ならCSVで保存します。' }
      ],
      howTo: [
        '一度に振るサイコロの数を選びます。',
        '用途に合わせてアニメーション時間を調整します。',
        'サイコロを振って、各出目、合計、平均、奇数/偶数の結果を確認します。',
        '履歴パネルを確認し、必要ならCSVで保存します。'
      ],
      whatIs: [
        'サイコロは、ボードゲーム、TRPG、授業でのランダム確認、簡単な決定に使いやすいブラウザベースのツールです。',
        'スマートフォンとデスクトップの両方で使え、ログインなしで履歴と要約結果を確認・保存できます。'
      ],
      faq: [
        { q: 'スマホでも使えますか？', a: 'はい。画面幅に合わせてレイアウトが自動で調整されます。' },
        { q: '複数のサイコロを同時に振れますか？', a: 'はい。1〜12個を一度に振れて、各出目と合計をまとめて確認できます。' },
        { q: '結果履歴は保存できますか？', a: 'はい。各回の履歴をCSVとして書き出せます。' },
        { q: 'データは外部サーバーに送信されますか？', a: 'いいえ。結果と履歴はブラウザ内で処理されます。' }
      ]
    }
  },
  'zh-cn': {
    sections: {
      howTo: '使用方法',
      whatIs: '这个工具是什么？',
      faq: 'FAQ',
      tryOtherTools: '试试其他工具',
      relatedTools: '相关工具'
    },
    coinflip: {
      heroSubtitle: '一次可抛 1 到 20 枚硬币，适合快速决策、课堂活动、抽签和游戏开局。',
      guideSubtitle: '抛硬币只在浏览器本地运行，可立即查看正反面统计，并在需要时导出 CSV 记录。',
      steps: [
        { title: '1. 选择数量', body: '选择这一轮要抛多少枚硬币，支持 1 到 20 枚。' },
        { title: '2. 调整节奏', body: '根据想要的展示速度，选择更短或更长的动画时间。' },
        { title: '3. 查看并导出', body: '查看正反面总数和历史记录，需要时导出 CSV。' }
      ],
      howTo: [
        '先选择这一轮要抛多少枚硬币。',
        '根据使用场景调整动画时间，适合快速确认或展示结果。',
        '点击抛硬币后，立即查看正反面结果和统计。',
        '打开历史面板，在需要时导出 CSV 记录。'
      ],
      whatIs: [
        '抛硬币是一个适合 50:50 决策、课堂活动、游戏开局和简单抽签的浏览器工具。',
        '它支持手机和桌面端，无需登录即可查看结果历史并保存记录。'
      ],
      faq: [
        { q: '手机上也能顺畅使用吗？', a: '可以。页面会根据屏幕宽度自动调整布局。' },
        { q: '可以一次抛多枚硬币吗？', a: '可以。每轮支持 1 到 20 枚，适合快速比较或小组决策。' },
        { q: '可以保存结果记录吗？', a: '可以。每轮结果都会进入历史列表，并可导出为 CSV。' },
        { q: '数据会发送到外部服务器吗？', a: '不会。结果和记录都在浏览器本地处理。' }
      ]
    },
    dice: {
      heroSubtitle: '一次可掷 1 到 12 个骰子，适合桌游、课堂活动、随机点数和快速判断。',
      guideSubtitle: '掷骰子只在浏览器本地运行，可同时查看每个点数、总和、平均值和历史记录。',
      steps: [
        { title: '1. 选择骰子数量', body: '选择这一轮要掷多少个骰子，支持 1 到 12 个。' },
        { title: '2. 调整节奏', body: '根据需要选择更快或更明显的动画时间。' },
        { title: '3. 查看并保存', body: '查看每个点数、总和、平均值和历史记录，需要时导出 CSV。' }
      ],
      howTo: [
        '先选择这一轮要掷多少个骰子。',
        '根据使用场景调整动画时间。',
        '点击掷骰子后，查看每个点数、总和、平均值以及奇偶报告。',
        '打开历史面板，在需要时导出 CSV 记录。'
      ],
      whatIs: [
        '掷骰子是一个适合桌游、TRPG、课堂活动和简单随机决策的浏览器工具。',
        '它支持手机和桌面端，无需登录即可查看历史结果和汇总信息。'
      ],
      faq: [
        { q: '手机上也能顺畅使用吗？', a: '可以。页面会根据屏幕宽度自动调整布局。' },
        { q: '可以一次掷多个骰子吗？', a: '可以。每轮支持 1 到 12 个，并会同时显示每个点数和总和。' },
        { q: '可以保存历史记录吗？', a: '可以。每轮结果都会进入历史列表，并可导出为 CSV。' },
        { q: '数据会发送到外部服务器吗？', a: '不会。结果和记录都在浏览器本地处理。' }
      ]
    }
  },
  'zh-tw': {
    sections: {
      howTo: '使用方式',
      whatIs: '這個工具是什麼？',
      faq: 'FAQ',
      tryOtherTools: '試試其他工具',
      relatedTools: '相關工具'
    },
    coinflip: {
      heroSubtitle: '一次可擲 1 到 20 枚硬幣，適合快速決定、課堂活動、抽籤與遊戲開局。',
      guideSubtitle: '擲硬幣只在瀏覽器本機運作，可立即查看正反面統計，並在需要時匯出 CSV 紀錄。',
      steps: [
        { title: '1. 選擇數量', body: '選擇這一輪要擲多少枚硬幣，支援 1 到 20 枚。' },
        { title: '2. 調整節奏', body: '依照需求選擇較短或較長的動畫時間。' },
        { title: '3. 查看並匯出', body: '查看正反面總數與歷史紀錄，需要時匯出 CSV。' }
      ],
      howTo: [
        '先選擇這一輪要擲多少枚硬幣。',
        '依照使用情境調整動畫時間，適合快速確認或展示結果。',
        '點擊擲硬幣後，立即查看正反面結果與統計。',
        '打開歷史面板，在需要時匯出 CSV 紀錄。'
      ],
      whatIs: [
        '擲硬幣是一個適合 50:50 決定、課堂活動、遊戲開局與簡單抽籤的瀏覽器工具。',
        '它支援手機與桌面端，無需登入即可查看結果歷史並保存紀錄。'
      ],
      faq: [
        { q: '手機上也能順暢使用嗎？', a: '可以。頁面會依照螢幕寬度自動調整版面。' },
        { q: '可以一次擲多枚硬幣嗎？', a: '可以。每輪支援 1 到 20 枚，適合快速比較或小組決定。' },
        { q: '可以保存結果紀錄嗎？', a: '可以。每輪結果都會進入歷史列表，並可匯出為 CSV。' },
        { q: '資料會傳送到外部伺服器嗎？', a: '不會。結果與紀錄都在瀏覽器本機處理。' }
      ]
    },
    dice: {
      heroSubtitle: '一次可擲 1 到 12 顆骰子，適合桌遊、課堂活動、隨機點數與快速判斷。',
      guideSubtitle: '擲骰子只在瀏覽器本機運作，可同時查看每顆點數、總和、平均值與歷史紀錄。',
      steps: [
        { title: '1. 選擇骰子數量', body: '選擇這一輪要擲多少顆骰子，支援 1 到 12 顆。' },
        { title: '2. 調整節奏', body: '依照需求選擇較快或較明顯的動畫時間。' },
        { title: '3. 查看並保存', body: '查看每顆點數、總和、平均值與歷史紀錄，需要時匯出 CSV。' }
      ],
      howTo: [
        '先選擇這一輪要擲多少顆骰子。',
        '依照使用情境調整動畫時間。',
        '點擊擲骰子後，查看每顆點數、總和、平均值與奇偶報告。',
        '打開歷史面板，在需要時匯出 CSV 紀錄。'
      ],
      whatIs: [
        '擲骰子是一個適合桌遊、TRPG、課堂活動與簡單隨機決定的瀏覽器工具。',
        '它支援手機與桌面端，無需登入即可查看歷史結果與摘要資訊。'
      ],
      faq: [
        { q: '手機上也能順暢使用嗎？', a: '可以。頁面會依照螢幕寬度自動調整版面。' },
        { q: '可以一次擲多顆骰子嗎？', a: '可以。每輪支援 1 到 12 顆，並會同時顯示每顆點數與總和。' },
        { q: '可以保存歷史紀錄嗎？', a: '可以。每輪結果都會進入歷史列表，並可匯出為 CSV。' },
        { q: '資料會傳送到外部伺服器嗎？', a: '不會。結果與紀錄都在瀏覽器本機處理。' }
      ]
    }
  },
  es: {
    sections: {
      howTo: 'Cómo usarlo',
      whatIs: '¿Qué es esta herramienta?',
      faq: 'FAQ',
      tryOtherTools: 'Probar otras herramientas',
      relatedTools: 'Herramientas relacionadas'
    },
    coinflip: {
      heroSubtitle: 'Lanza de 1 a 20 monedas a la vez para desempates rápidos, juegos, clases y decisiones del día a día.',
      guideSubtitle: 'Cara o cruz funciona localmente en tu navegador, muestra el total de caras y cruces, y te deja exportar el historial en CSV.',
      steps: [
        { title: '1. Elige cuántas monedas usar', body: 'Selecciona entre 1 y 20 monedas para una sola tirada.' },
        { title: '2. Ajusta el ritmo', body: 'Usa una animación más corta o más larga según quieras velocidad o una revelación más visible.' },
        { title: '3. Revisa y exporta', body: 'Comprueba el total de cada lado y exporta el historial en CSV si lo necesitas.' }
      ],
      howTo: [
        'Elige cuántas monedas quieres lanzar a la vez.',
        'Ajusta la duración de la animación según necesites rapidez o una presentación más clara.',
        'Pulsa lanzar y revisa al instante cuántas caras y cruces han salido.',
        'Abre el panel de historial y exporta CSV si necesitas guardar un registro simple.'
      ],
      whatIs: [
        'Cara o cruz es una herramienta en el navegador para decisiones 50:50, desempates, actividades en clase, juegos y elecciones rápidas en grupo.',
        'Funciona bien en móvil y escritorio, y te permite revisar o exportar el historial sin crear una cuenta.'
      ],
      faq: [
        { q: '¿Funciona bien en móvil?', a: 'Sí. El diseño se adapta automáticamente a pantallas pequeñas.' },
        { q: '¿Puedo lanzar varias monedas a la vez?', a: 'Sí. Puedes lanzar de 1 a 20 monedas en una sola tanda para comparar resultados o resolver decisiones grupales.' },
        { q: '¿Puedo guardar el historial?', a: 'Sí. Cada tanda queda en el historial y puedes exportarla como CSV.' },
        { q: '¿Se envían mis datos a servidores externos?', a: 'No. Los resultados y el historial se procesan en tu navegador.' }
      ]
    },
    dice: {
      heroSubtitle: 'Tira de 1 a 12 dados a la vez para juegos de mesa, clases, sorteos simples y comprobaciones rápidas al azar.',
      guideSubtitle: 'La tirada de dados funciona localmente en tu navegador y muestra cada cara, el total, el promedio y el historial.',
      steps: [
        { title: '1. Elige la cantidad de dados', body: 'Selecciona entre 1 y 12 dados para una sola tirada.' },
        { title: '2. Ajusta el ritmo', body: 'Configura una animación más rápida o más visible según el uso.' },
        { title: '3. Revisa y guarda', body: 'Consulta cada cara, el total, el promedio y exporta el historial en CSV si hace falta.' }
      ],
      howTo: [
        'Elige cuántos dados quieres tirar a la vez.',
        'Ajusta la duración de la animación según prefieras rapidez o una revelación más visible.',
        'Pulsa tirar y revisa cada resultado, el total, el promedio y el informe par/impar.',
        'Abre el panel de historial y exporta CSV si necesitas guardar la sesión.'
      ],
      whatIs: [
        'Tirar dados es una herramienta en el navegador para juegos de mesa, juegos de rol, actividades en clase y decisiones aleatorias rápidas.',
        'Funciona en móvil y escritorio, muestra resúmenes útiles de cada tirada y te permite conservar o exportar el historial sin iniciar sesión.'
      ],
      faq: [
        { q: '¿Funciona bien en móvil?', a: 'Sí. El diseño se adapta automáticamente a pantallas pequeñas.' },
        { q: '¿Puedo tirar varios dados a la vez?', a: 'Sí. Puedes tirar de 1 a 12 dados en una sola tanda y revisar todos los resultados juntos.' },
        { q: '¿Puedo guardar el historial de tiradas?', a: 'Sí. Cada tanda queda en el historial y puedes exportarla como CSV.' },
        { q: '¿Se envían mis datos a servidores externos?', a: 'No. Los resultados y el historial se procesan en tu navegador.' }
      ]
    }
  },
  fr: {
    sections: {
      howTo: "Comment l'utiliser",
      whatIs: 'Qu’est-ce que cet outil ?',
      faq: 'FAQ',
      tryOtherTools: "Essayer d'autres outils",
      relatedTools: 'Outils associés'
    },
    coinflip: {
      heroSubtitle: "Lancez 1 à 20 pièces d’un coup pour trancher vite, animer une classe, gérer un jeu ou départager un choix.",
      guideSubtitle: "Pile ou face fonctionne localement dans votre navigateur, affiche le total pile/face et permet d’exporter l’historique en CSV.",
      steps: [
        { title: '1. Choisir le nombre de pièces', body: 'Sélectionnez entre 1 et 20 pièces pour un même lancer.' },
        { title: '2. Régler le rythme', body: 'Choisissez une animation plus courte ou plus longue selon que vous voulez aller vite ou mieux montrer le résultat.' },
        { title: '3. Vérifier et exporter', body: 'Consultez le total de chaque face et exportez l’historique en CSV si nécessaire.' }
      ],
      howTo: [
        'Choisissez combien de pièces lancer en une fois.',
        'Réglez la durée de l’animation selon que vous voulez de la rapidité ou une révélation plus visible.',
        'Cliquez sur lancer et vérifiez immédiatement le nombre de piles et de faces.',
        'Ouvrez l’historique et exportez un CSV si vous avez besoin d’une trace simple.'
      ],
      whatIs: [
        'Pile ou face est un outil dans le navigateur pour les choix 50:50, les départages, les activités de classe, les jeux et les petites décisions en groupe.',
        'Il fonctionne sur mobile comme sur ordinateur et permet de consulter ou d’exporter l’historique sans créer de compte.'
      ],
      faq: [
        { q: 'Est-ce pratique sur mobile ?', a: 'Oui. La mise en page s’adapte automatiquement aux petits écrans.' },
        { q: 'Puis-je lancer plusieurs pièces à la fois ?', a: 'Oui. Vous pouvez lancer de 1 à 20 pièces dans une même série pour comparer rapidement les résultats.' },
        { q: 'Puis-je enregistrer l’historique ?', a: 'Oui. Chaque série reste dans l’historique et peut être exportée en CSV.' },
        { q: 'Mes données sont-elles envoyées vers des serveurs externes ?', a: 'Non. Les résultats et l’historique restent dans votre navigateur.' }
      ]
    },
    dice: {
      heroSubtitle: 'Lancez 1 à 12 dés à la fois pour les jeux de société, les jeux de rôle, la classe et les vérifications aléatoires rapides.',
      guideSubtitle: 'Le lancer de dés fonctionne localement dans votre navigateur et affiche chaque face, le total, la moyenne et l’historique.',
      steps: [
        { title: '1. Choisir le nombre de dés', body: 'Sélectionnez entre 1 et 12 dés pour une même série.' },
        { title: '2. Régler le rythme', body: 'Ajustez la durée de l’animation selon que vous voulez aller vite ou mieux montrer le lancer.' },
        { title: '3. Vérifier et enregistrer', body: 'Consultez chaque face, le total, la moyenne et exportez l’historique en CSV si besoin.' }
      ],
      howTo: [
        'Choisissez combien de dés lancer en une fois.',
        'Ajustez la durée de l’animation selon votre usage.',
        'Cliquez sur lancer puis vérifiez chaque résultat, le total, la moyenne et le rapport pair/impair.',
        'Ouvrez l’historique et exportez un CSV si vous voulez conserver la session.'
      ],
      whatIs: [
        'Lancer les dés est un outil dans le navigateur pour les jeux de société, les jeux de rôle sur table, les activités de classe et les décisions aléatoires rapides.',
        'Il fonctionne sur mobile comme sur ordinateur, affiche des résumés utiles à chaque série et permet d’exporter l’historique sans connexion.'
      ],
      faq: [
        { q: 'Est-ce pratique sur mobile ?', a: 'Oui. La mise en page s’adapte automatiquement aux petits écrans.' },
        { q: 'Puis-je lancer plusieurs dés à la fois ?', a: 'Oui. Vous pouvez lancer de 1 à 12 dés en une seule série et consulter tous les résultats ensemble.' },
        { q: 'Puis-je enregistrer l’historique des lancers ?', a: 'Oui. Chaque série reste dans l’historique et peut être exportée en CSV.' },
        { q: 'Mes données sont-elles envoyées vers des serveurs externes ?', a: 'Non. Les résultats et l’historique restent dans votre navigateur.' }
      ]
    }
  },
  de: {
    sections: {
      howTo: 'So verwendest du das Tool',
      whatIs: 'Was ist dieses Tool?',
      faq: 'FAQ',
      tryOtherTools: 'Weitere Tools ausprobieren',
      relatedTools: 'Verwandte Tools'
    },
    coinflip: {
      heroSubtitle: 'Wirf 1 bis 20 Münzen auf einmal für faire Stichentscheide, Spiele, Unterricht und schnelle Alltagsentscheidungen.',
      guideSubtitle: 'Der Münzwurf läuft lokal im Browser, zeigt Kopf/Zahl-Summen an und lässt sich bei Bedarf als CSV exportieren.',
      steps: [
        { title: '1. Anzahl wählen', body: 'Wähle zwischen 1 und 20 Münzen für einen Durchgang.' },
        { title: '2. Tempo einstellen', body: 'Stelle eine kürzere oder längere Animation ein, je nachdem ob du schnell prüfen oder sichtbarer präsentieren willst.' },
        { title: '3. Prüfen und exportieren', body: 'Sieh dir Kopf/Zahl-Summen an und exportiere den Verlauf bei Bedarf als CSV.' }
      ],
      howTo: [
        'Wähle, wie viele Münzen du gleichzeitig werfen möchtest.',
        'Passe die Animationsdauer an, je nachdem ob du Geschwindigkeit oder eine deutlichere Anzeige willst.',
        'Drücke auf Werfen und prüfe sofort die Anzahl von Kopf und Zahl.',
        'Öffne den Verlauf und exportiere bei Bedarf eine CSV-Datei.'
      ],
      whatIs: [
        'Münze werfen ist ein Browser-Tool für faire 50:50-Entscheidungen, Stichentscheide, Unterricht, Spiele und schnelle Gruppenentscheidungen.',
        'Es funktioniert auf Mobilgeräten und Desktop-Rechnern und erlaubt dir, den Verlauf ohne Konto anzusehen oder zu exportieren.'
      ],
      faq: [
        { q: 'Funktioniert das gut auf dem Handy?', a: 'Ja. Das Layout passt sich automatisch an kleinere Bildschirme an.' },
        { q: 'Kann ich mehrere Münzen gleichzeitig werfen?', a: 'Ja. Du kannst 1 bis 20 Münzen in einem Durchgang werfen und die Ergebnisse direkt vergleichen.' },
        { q: 'Kann ich den Verlauf speichern?', a: 'Ja. Jeder Durchgang bleibt im Verlauf und kann als CSV exportiert werden.' },
        { q: 'Werden meine Daten an externe Server gesendet?', a: 'Nein. Ergebnisse und Verlauf bleiben in deinem Browser.' }
      ]
    },
    dice: {
      heroSubtitle: 'Wirf 1 bis 12 Würfel auf einmal für Brettspiele, Pen-and-Paper-Runden, Unterricht und schnelle Zufallsprüfungen.',
      guideSubtitle: 'Das Würfel-Tool läuft lokal im Browser und zeigt jede Augenzahl, die Summe, den Durchschnitt und den Verlauf an.',
      steps: [
        { title: '1. Würfelanzahl wählen', body: 'Wähle zwischen 1 und 12 Würfeln für einen Durchgang.' },
        { title: '2. Tempo einstellen', body: 'Passe die Animation an, je nachdem ob du schnell prüfen oder den Wurf sichtbarer machen willst.' },
        { title: '3. Prüfen und speichern', body: 'Sieh dir Augenzahlen, Summe, Durchschnitt und Verlauf an und exportiere bei Bedarf eine CSV.' }
      ],
      howTo: [
        'Wähle, wie viele Würfel du gleichzeitig rollen möchtest.',
        'Passe die Animationsdauer an deinen Einsatz an.',
        'Drücke auf Rollen und prüfe jede Augenzahl, die Summe, den Durchschnitt und den Gerade/Ungerade-Bericht.',
        'Öffne den Verlauf und exportiere bei Bedarf eine CSV-Datei.'
      ],
      whatIs: [
        'Würfel werfen ist ein Browser-Tool für Brettspiele, Pen-and-Paper-Runden, Unterricht und schnelle Zufallsentscheidungen.',
        'Es funktioniert auf Handy und Desktop, zeigt nützliche Zusammenfassungen pro Wurf und erlaubt den Export des Verlaufs ohne Anmeldung.'
      ],
      faq: [
        { q: 'Funktioniert das gut auf dem Handy?', a: 'Ja. Das Layout passt sich automatisch an kleinere Bildschirme an.' },
        { q: 'Kann ich mehrere Würfel gleichzeitig rollen?', a: 'Ja. Du kannst 1 bis 12 Würfel in einem Durchgang rollen und alle Ergebnisse zusammen ansehen.' },
        { q: 'Kann ich den Würfelverlauf speichern?', a: 'Ja. Jeder Durchgang bleibt im Verlauf und kann als CSV exportiert werden.' },
        { q: 'Werden meine Daten an externe Server gesendet?', a: 'Nein. Ergebnisse und Verlauf bleiben in deinem Browser.' }
      ]
    }
  },
  'pt-br': {
    sections: {
      howTo: 'Como usar',
      whatIs: 'O que é esta ferramenta?',
      faq: 'FAQ',
      tryOtherTools: 'Testar outras ferramentas',
      relatedTools: 'Ferramentas relacionadas'
    },
    coinflip: {
      heroSubtitle: 'Jogue de 1 a 20 moedas de uma vez para decisões rápidas, dinâmicas em sala, sorteios simples e jogos.',
      guideSubtitle: 'Cara ou coroa roda localmente no navegador, mostra o total de caras e coroas e permite exportar o histórico em CSV.',
      steps: [
        { title: '1. Escolha a quantidade', body: 'Selecione de 1 a 20 moedas para uma rodada.' },
        { title: '2. Ajuste o ritmo', body: 'Use uma animação mais curta ou mais longa conforme você queira rapidez ou uma revelação mais visível.' },
        { title: '3. Revise e exporte', body: 'Confira o total de cada lado e exporte o histórico em CSV quando precisar.' }
      ],
      howTo: [
        'Escolha quantas moedas você quer jogar ao mesmo tempo.',
        'Ajuste a duração da animação conforme o seu uso.',
        'Clique em jogar e veja imediatamente quantas caras e coroas saíram.',
        'Abra o histórico e exporte um CSV se precisar guardar um registro simples.'
      ],
      whatIs: [
        'Cara ou coroa é uma ferramenta no navegador para decisões 50:50, desempates, atividades em sala, jogos e escolhas rápidas em grupo.',
        'Ela funciona bem no celular e no desktop e permite revisar ou exportar o histórico sem criar conta.'
      ],
      faq: [
        { q: 'Funciona bem no celular?', a: 'Sim. O layout se adapta automaticamente a telas menores.' },
        { q: 'Posso jogar várias moedas ao mesmo tempo?', a: 'Sim. Você pode jogar de 1 a 20 moedas em uma única rodada para comparar resultados rapidamente.' },
        { q: 'Posso salvar o histórico?', a: 'Sim. Cada rodada fica no histórico e pode ser exportada em CSV.' },
        { q: 'Os meus dados são enviados para servidores externos?', a: 'Não. Resultados e histórico ficam no seu navegador.' }
      ]
    },
    dice: {
      heroSubtitle: 'Role de 1 a 12 dados de uma vez para jogos de mesa, RPGs de mesa, atividades em sala e checagens aleatórias rápidas.',
      guideSubtitle: 'O rolar dados roda localmente no navegador e mostra cada face, a soma, a média e o histórico.',
      steps: [
        { title: '1. Escolha a quantidade de dados', body: 'Selecione de 1 a 12 dados para uma rodada.' },
        { title: '2. Ajuste o ritmo', body: 'Defina uma animação mais rápida ou mais visível conforme o uso.' },
        { title: '3. Revise e salve', body: 'Veja cada face, a soma, a média e exporte o histórico em CSV quando precisar.' }
      ],
      howTo: [
        'Escolha quantos dados você quer rolar ao mesmo tempo.',
        'Ajuste a duração da animação conforme o seu uso.',
        'Clique em rolar e confira cada face, a soma, a média e o relatório de ímpar/par.',
        'Abra o histórico e exporte um CSV se quiser guardar a sessão.'
      ],
      whatIs: [
        'Rolar dados é uma ferramenta no navegador para jogos de mesa, RPGs de mesa, atividades em sala e decisões aleatórias rápidas.',
        'Ela funciona no celular e no desktop, mostra resumos úteis de cada rodada e permite exportar o histórico sem login.'
      ],
      faq: [
        { q: 'Funciona bem no celular?', a: 'Sim. O layout se adapta automaticamente a telas menores.' },
        { q: 'Posso rolar vários dados ao mesmo tempo?', a: 'Sim. Você pode rolar de 1 a 12 dados em uma única rodada e revisar todos os resultados juntos.' },
        { q: 'Posso salvar o histórico das rolagens?', a: 'Sim. Cada rodada fica no histórico e pode ser exportada em CSV.' },
        { q: 'Os meus dados são enviados para servidores externos?', a: 'Não. Resultados e histórico ficam no seu navegador.' }
      ]
    }
  },
  hi: {
    sections: {
      howTo: 'उपयोग कैसे करें',
      whatIs: 'यह टूल क्या है?',
      faq: 'FAQ',
      tryOtherTools: 'अन्य टूल आज़माएँ',
      relatedTools: 'संबंधित टूल'
    },
    coinflip: {
      heroSubtitle: 'एक साथ 1 से 20 सिक्के उछालें और तेज फैसले, कक्षा गतिविधि, गेम और छोटे टाई-ब्रेक तुरंत करें।',
      guideSubtitle: 'कॉइन फ्लिप टूल ब्राउज़र में लोकली चलता है, परिणामों की गिनती दिखाता है और जरूरत पड़ने पर CSV एक्सपोर्ट देता है।',
      steps: [
        { title: '1. सिक्कों की संख्या चुनें', body: 'एक रन में 1 से 20 सिक्कों तक चुनें।' },
        { title: '2. गति तय करें', body: 'तेज जांच या साफ प्रस्तुति के लिए एनीमेशन समय समायोजित करें।' },
        { title: '3. देखें और सेव करें', body: 'दोनों तरफ के कुल परिणाम देखें और जरूरत हो तो इतिहास को CSV में एक्सपोर्ट करें।' }
      ],
      howTo: [
        'चुनें कि आप एक साथ कितने सिक्के उछालना चाहते हैं।',
        'अपने उपयोग के हिसाब से एनीमेशन समय कम या ज्यादा करें।',
        'Flip दबाएँ और तुरंत परिणामों की गिनती देखें।',
        'जरूरत हो तो हिस्ट्री पैनल खोलकर CSV एक्सपोर्ट करें।'
      ],
      whatIs: [
        'कॉइन फ्लिप एक ब्राउज़र आधारित टूल है जो 50:50 फैसलों, टाई-ब्रेक, कक्षा गतिविधियों, गेम और छोटे समूह निर्णयों के लिए उपयोगी है।',
        'यह मोबाइल और डेस्कटॉप दोनों पर काम करता है और बिना अकाउंट बनाए हिस्ट्री देखने या सेव करने देता है।'
      ],
      faq: [
        { q: 'क्या यह मोबाइल पर अच्छी तरह काम करता है?', a: 'हाँ। लेआउट छोटी स्क्रीन के अनुसार अपने आप बदल जाता है।' },
        { q: 'क्या मैं एक साथ कई सिक्के उछाल सकता हूँ?', a: 'हाँ। आप एक रन में 1 से 20 सिक्के उछाल सकते हैं।' },
        { q: 'क्या मैं परिणामों की हिस्ट्री सेव कर सकता हूँ?', a: 'हाँ। हर रन हिस्ट्री में रहता है और CSV में एक्सपोर्ट किया जा सकता है।' },
        { q: 'क्या मेरा डेटा बाहरी सर्वर पर भेजा जाता है?', a: 'नहीं। परिणाम और हिस्ट्री आपके ब्राउज़र में ही रहते हैं।' }
      ]
    },
    dice: {
      heroSubtitle: 'एक साथ 1 से 12 पासे घुमाएँ और बोर्ड गेम, कक्षा गतिविधि, त्वरित चयन और रैंडम जांच में उपयोग करें।',
      guideSubtitle: 'डाइस टूल ब्राउज़र में लोकली चलता है और हर फेस, कुल, औसत और हिस्ट्री एक साथ दिखाता है।',
      steps: [
        { title: '1. पासों की संख्या चुनें', body: 'एक रन में 1 से 12 पासों तक चुनें।' },
        { title: '2. गति तय करें', body: 'तेज जांच या साफ प्रस्तुति के लिए एनीमेशन समय समायोजित करें।' },
        { title: '3. देखें और सेव करें', body: 'हर फेस, कुल, औसत और हिस्ट्री देखें, फिर जरूरत हो तो CSV एक्सपोर्ट करें।' }
      ],
      howTo: [
        'चुनें कि आप एक साथ कितने पासे घुमाना चाहते हैं।',
        'अपने उपयोग के हिसाब से एनीमेशन समय समायोजित करें।',
        'Roll दबाएँ और हर फेस, कुल, औसत और odd/even रिपोर्ट देखें।',
        'जरूरत हो तो हिस्ट्री पैनल खोलकर CSV एक्सपोर्ट करें।'
      ],
      whatIs: [
        'डाइस टूल एक ब्राउज़र आधारित पासा रोलर है जो बोर्ड गेम, tabletop RPG, कक्षा गतिविधि और तेज रैंडम फैसलों के लिए उपयोगी है।',
        'यह मोबाइल और डेस्कटॉप दोनों पर काम करता है और बिना लॉगिन के हिस्ट्री व सारांश देखने देता है।'
      ],
      faq: [
        { q: 'क्या यह मोबाइल पर अच्छी तरह काम करता है?', a: 'हाँ। लेआउट छोटी स्क्रीन के अनुसार अपने आप बदल जाता है।' },
        { q: 'क्या मैं एक साथ कई पासे घुमा सकता हूँ?', a: 'हाँ। आप एक रन में 1 से 12 पासे घुमा सकते हैं और सभी परिणाम साथ देख सकते हैं।' },
        { q: 'क्या मैं रोल हिस्ट्री सेव कर सकता हूँ?', a: 'हाँ। हर रन हिस्ट्री में रहता है और CSV में एक्सपोर्ट किया जा सकता है।' },
        { q: 'क्या मेरा डेटा बाहरी सर्वर पर भेजा जाता है?', a: 'नहीं। परिणाम और हिस्ट्री आपके ब्राउज़र में ही रहते हैं।' }
      ]
    }
  },
  ar: {
    sections: {
      howTo: 'طريقة الاستخدام',
      whatIs: 'ما هذه الأداة؟',
      faq: 'FAQ',
      tryOtherTools: 'جرّب أدوات أخرى',
      relatedTools: 'أدوات ذات صلة'
    },
    coinflip: {
      heroSubtitle: 'اقلب من عملة واحدة إلى 20 عملة دفعة واحدة للحسم السريع، والأنشطة الصفية، والألعاب، والاختيارات اليومية.',
      guideSubtitle: 'أداة قلب العملة تعمل محليًا داخل المتصفح، وتعرض إجمالي النتائج، وتسمح بتصدير السجل بصيغة CSV عند الحاجة.',
      steps: [
        { title: '1. اختر عدد العملات', body: 'حدّد من 1 إلى 20 عملة في الجولة الواحدة.' },
        { title: '2. اضبط الإيقاع', body: 'اختر مدة حركة أقصر أو أطول بحسب حاجتك إلى السرعة أو العرض الواضح.' },
        { title: '3. راجع وصدّر', body: 'راجع إجمالي كل نتيجة وصدّر السجل بصيغة CSV إذا احتجت إلى حفظه.' }
      ],
      howTo: [
        'اختر عدد العملات التي تريد قلبها في المرة الواحدة.',
        'اضبط مدة الحركة بحسب سرعة الاستخدام أو وضوح العرض.',
        'اضغط على زر القلب وراجع النتائج مباشرة.',
        'افتح لوحة السجل وصدّر ملف CSV إذا احتجت إلى سجل بسيط.'
      ],
      whatIs: [
        'قلب العملة أداة تعمل في المتصفح لاتخاذ قرارات 50:50، وكسر التعادل، والأنشطة الصفية، والألعاب، والاختيارات السريعة داخل المجموعة.',
        'تعمل على الهاتف والكمبيوتر، وتتيح مراجعة السجل أو تصديره من دون إنشاء حساب.'
      ],
      faq: [
        { q: 'هل تعمل جيدًا على الهاتف؟', a: 'نعم. يتكيّف التصميم تلقائيًا مع الشاشات الصغيرة.' },
        { q: 'هل يمكنني قلب عدة عملات معًا؟', a: 'نعم. يمكنك قلب من 1 إلى 20 عملة في الجولة الواحدة.' },
        { q: 'هل يمكنني حفظ سجل النتائج؟', a: 'نعم. تبقى كل جولة في السجل ويمكن تصديرها بصيغة CSV.' },
        { q: 'هل يتم إرسال بياناتي إلى خوادم خارجية؟', a: 'لا. النتائج والسجل يبقيان داخل متصفحك.' }
      ]
    },
    dice: {
      heroSubtitle: 'ارمِ من حجر نرد واحد إلى 12 حجرًا دفعة واحدة لاستخدامها في الألعاب، والصف، والاختيارات العشوائية السريعة.',
      guideSubtitle: 'أداة رمي النرد تعمل محليًا داخل المتصفح وتعرض كل نتيجة، والمجموع، والمتوسط، والسجل في مكان واحد.',
      steps: [
        { title: '1. اختر عدد أحجار النرد', body: 'حدّد من 1 إلى 12 حجر نرد في الجولة الواحدة.' },
        { title: '2. اضبط الإيقاع', body: 'اختر مدة حركة مناسبة للسرعة أو لعرض أوضح.' },
        { title: '3. راجع واحفظ', body: 'راجع كل نتيجة والمجموع والمتوسط وصدّر السجل بصيغة CSV عند الحاجة.' }
      ],
      howTo: [
        'اختر عدد أحجار النرد التي تريد رميها دفعة واحدة.',
        'اضبط مدة الحركة بحسب طريقة الاستخدام.',
        'اضغط على زر الرمي ثم راجع كل نتيجة والمجموع والمتوسط وتقرير الفردي/الزوجي.',
        'افتح لوحة السجل وصدّر ملف CSV إذا أردت حفظ الجلسة.'
      ],
      whatIs: [
        'رمي النرد أداة تعمل في المتصفح لألعاب الطاولة، وألعاب تقمّص الأدوار، والأنشطة الصفية، والقرارات العشوائية السريعة.',
        'تعمل على الهاتف والكمبيوتر، وتعرض ملخصات مفيدة لكل جولة، وتسمح بتصدير السجل من دون تسجيل دخول.'
      ],
      faq: [
        { q: 'هل تعمل جيدًا على الهاتف؟', a: 'نعم. يتكيّف التصميم تلقائيًا مع الشاشات الصغيرة.' },
        { q: 'هل يمكنني رمي عدة أحجار نرد معًا؟', a: 'نعم. يمكنك رمي من 1 إلى 12 حجر نرد في الجولة الواحدة مع عرض كل النتائج معًا.' },
        { q: 'هل يمكنني حفظ سجل الرميات؟', a: 'نعم. تبقى كل جولة في السجل ويمكن تصديرها بصيغة CSV.' },
        { q: 'هل يتم إرسال بياناتي إلى خوادم خارجية؟', a: 'لا. النتائج والسجل يبقيان داخل متصفحك.' }
      ]
    }
  },
  ru: {
    sections: {
      howTo: 'Как пользоваться',
      whatIs: 'Что это за инструмент?',
      faq: 'FAQ',
      tryOtherTools: 'Попробовать другие инструменты',
      relatedTools: 'Похожие инструменты'
    },
    coinflip: {
      heroSubtitle: 'Подбрасывайте от 1 до 20 монет за раз для быстрых решений, игр, занятий и честных тай-брейков.',
      guideSubtitle: 'Инструмент работает локально в браузере, сразу показывает итоги по сторонам и позволяет экспортировать историю в CSV.',
      steps: [
        { title: '1. Выберите число монет', body: 'Задайте от 1 до 20 монет для одного запуска.' },
        { title: '2. Настройте темп', body: 'Выберите более короткую или более длинную анимацию в зависимости от того, что вам важнее: скорость или наглядность.' },
        { title: '3. Проверьте и экспортируйте', body: 'Смотрите итог по каждой стороне и при необходимости выгружайте историю в CSV.' }
      ],
      howTo: [
        'Выберите, сколько монет нужно подбросить одновременно.',
        'Настройте длительность анимации под быстрый просмотр или более наглядный показ.',
        'Нажмите кнопку и сразу проверьте количество результатов по каждой стороне.',
        'Откройте историю и экспортируйте CSV, если нужен простой отчет.'
      ],
      whatIs: [
        'Подбрасывание монеты — это инструмент в браузере для решений 50:50, тай-брейков, занятий, игр и быстрых групповых выборов.',
        'Он работает на телефоне и компьютере и позволяет просматривать или экспортировать историю без регистрации.'
      ],
      faq: [
        { q: 'Удобно ли пользоваться на телефоне?', a: 'Да. Интерфейс автоматически подстраивается под небольшой экран.' },
        { q: 'Можно ли подбрасывать несколько монет сразу?', a: 'Да. За один запуск можно подбросить от 1 до 20 монет.' },
        { q: 'Можно ли сохранить историю результатов?', a: 'Да. Каждый запуск остается в истории и может быть экспортирован в CSV.' },
        { q: 'Отправляются ли мои данные на внешние серверы?', a: 'Нет. Результаты и история остаются в вашем браузере.' }
      ]
    },
    dice: {
      heroSubtitle: 'Бросайте от 1 до 12 кубиков сразу для настольных игр, занятий, быстрых случайных проверок и игровых сессий.',
      guideSubtitle: 'Инструмент работает локально в браузере и показывает каждый результат, сумму, среднее значение и историю.',
      steps: [
        { title: '1. Выберите число кубиков', body: 'Задайте от 1 до 12 кубиков для одного запуска.' },
        { title: '2. Настройте темп', body: 'Подберите анимацию под быстрый просмотр или более заметный показ.' },
        { title: '3. Проверьте и сохраните', body: 'Смотрите каждый результат, сумму, среднее и экспортируйте историю в CSV при необходимости.' }
      ],
      howTo: [
        'Выберите, сколько кубиков нужно бросить одновременно.',
        'Настройте длительность анимации под ваш сценарий.',
        'Нажмите кнопку и проверьте каждый результат, сумму, среднее и отчет по четным/нечетным.',
        'Откройте историю и экспортируйте CSV, если хотите сохранить сессию.'
      ],
      whatIs: [
        'Бросок кубиков — это инструмент в браузере для настольных игр, настольных RPG, занятий и быстрых случайных решений.',
        'Он работает на телефоне и компьютере, показывает полезные сводки по каждому запуску и позволяет экспортировать историю без входа в аккаунт.'
      ],
      faq: [
        { q: 'Удобно ли пользоваться на телефоне?', a: 'Да. Интерфейс автоматически подстраивается под небольшой экран.' },
        { q: 'Можно ли бросать несколько кубиков сразу?', a: 'Да. За один запуск можно бросить от 1 до 12 кубиков и увидеть все результаты вместе.' },
        { q: 'Можно ли сохранить историю бросков?', a: 'Да. Каждый запуск остается в истории и может быть экспортирован в CSV.' },
        { q: 'Отправляются ли мои данные на внешние серверы?', a: 'Нет. Результаты и история остаются в вашем браузере.' }
      ]
    }
  },
  id: {
    sections: {
      howTo: 'Cara menggunakan',
      whatIs: 'Apa itu alat ini?',
      faq: 'FAQ',
      tryOtherTools: 'Coba alat lain',
      relatedTools: 'Alat terkait'
    },
    coinflip: {
      heroSubtitle: 'Lempar 1 sampai 20 koin sekaligus untuk keputusan cepat, kelas, permainan, dan penentuan giliran.',
      guideSubtitle: 'Alat lempar koin berjalan lokal di browser, menampilkan total hasil, dan bisa mengekspor riwayat ke CSV saat dibutuhkan.',
      steps: [
        { title: '1. Pilih jumlah koin', body: 'Tentukan 1 sampai 20 koin untuk satu putaran.' },
        { title: '2. Atur tempo', body: 'Sesuaikan durasi animasi untuk penggunaan cepat atau tampilan hasil yang lebih jelas.' },
        { title: '3. Tinjau dan ekspor', body: 'Lihat total tiap sisi dan ekspor riwayat ke CSV bila diperlukan.' }
      ],
      howTo: [
        'Pilih berapa banyak koin yang ingin dilempar sekaligus.',
        'Atur durasi animasi sesuai kebutuhan.',
        'Tekan Flip lalu lihat hasil dan totalnya secara langsung.',
        'Buka panel riwayat dan ekspor CSV jika perlu menyimpan catatan sederhana.'
      ],
      whatIs: [
        'Lempar koin adalah alat berbasis browser untuk keputusan 50:50, penentuan giliran, aktivitas kelas, permainan, dan pemilihan cepat dalam grup.',
        'Alat ini nyaman dipakai di ponsel maupun desktop dan memungkinkan Anda meninjau atau mengekspor riwayat tanpa membuat akun.'
      ],
      faq: [
        { q: 'Apakah nyaman dipakai di ponsel?', a: 'Ya. Tata letak menyesuaikan otomatis dengan layar kecil.' },
        { q: 'Bisakah saya melempar beberapa koin sekaligus?', a: 'Ya. Anda bisa melempar 1 sampai 20 koin dalam satu putaran.' },
        { q: 'Bisakah saya menyimpan riwayat hasil?', a: 'Ya. Setiap putaran tersimpan di riwayat dan dapat diekspor sebagai CSV.' },
        { q: 'Apakah data saya dikirim ke server luar?', a: 'Tidak. Hasil dan riwayat tetap di browser Anda.' }
      ]
    },
    dice: {
      heroSubtitle: 'Lempar 1 sampai 12 dadu sekaligus untuk board game, kelas, pemeriksaan acak cepat, dan sesi permainan.',
      guideSubtitle: 'Alat dadu berjalan lokal di browser dan menampilkan tiap sisi, total, rata-rata, serta riwayat dalam satu tampilan.',
      steps: [
        { title: '1. Pilih jumlah dadu', body: 'Tentukan 1 sampai 12 dadu untuk satu putaran.' },
        { title: '2. Atur tempo', body: 'Sesuaikan durasi animasi untuk penggunaan cepat atau tampilan hasil yang lebih jelas.' },
        { title: '3. Tinjau dan simpan', body: 'Lihat tiap sisi, total, rata-rata, lalu ekspor riwayat ke CSV bila diperlukan.' }
      ],
      howTo: [
        'Pilih berapa banyak dadu yang ingin dilempar sekaligus.',
        'Atur durasi animasi sesuai kebutuhan.',
        'Tekan Roll lalu lihat tiap hasil, total, rata-rata, dan laporan ganjil/genap.',
        'Buka panel riwayat dan ekspor CSV jika ingin menyimpan sesi.'
      ],
      whatIs: [
        'Lempar dadu adalah alat berbasis browser untuk board game, tabletop RPG, aktivitas kelas, dan keputusan acak cepat.',
        'Alat ini nyaman dipakai di ponsel maupun desktop, menampilkan ringkasan tiap putaran, dan memungkinkan ekspor riwayat tanpa login.'
      ],
      faq: [
        { q: 'Apakah nyaman dipakai di ponsel?', a: 'Ya. Tata letak menyesuaikan otomatis dengan layar kecil.' },
        { q: 'Bisakah saya melempar beberapa dadu sekaligus?', a: 'Ya. Anda bisa melempar 1 sampai 12 dadu dalam satu putaran dan melihat semua hasil bersama-sama.' },
        { q: 'Bisakah saya menyimpan riwayat lemparan?', a: 'Ya. Setiap putaran tersimpan di riwayat dan dapat diekspor sebagai CSV.' },
        { q: 'Apakah data saya dikirim ke server luar?', a: 'Tidak. Hasil dan riwayat tetap di browser Anda.' }
      ]
    }
  },
  tr: {
    sections: {
      howTo: 'Nasıl kullanılır',
      whatIs: 'Bu araç nedir?',
      faq: 'FAQ',
      tryOtherTools: 'Diğer araçları dene',
      relatedTools: 'İlgili araçlar'
    },
    coinflip: {
      heroSubtitle: 'Bir seferde 1-20 para atarak hızlı kararlar, sınıf etkinlikleri, oyunlar ve kura benzeri seçimler yapın.',
      guideSubtitle: 'Yazı tura aracı tarayıcıda yerel çalışır, sonuç toplamlarını gösterir ve gerektiğinde geçmişi CSV olarak dışa aktarır.',
      steps: [
        { title: '1. Para sayısını seç', body: 'Tek turda 1 ile 20 arasında para belirleyin.' },
        { title: '2. Hızı ayarla', body: 'Hızlı kullanım ya da daha görünür bir sonuç için animasyon süresini ayarlayın.' },
        { title: '3. İncele ve dışa aktar', body: 'Sonuç toplamlarını kontrol edin ve gerekirse geçmişi CSV olarak dışa aktarın.' }
      ],
      howTo: [
        'Aynı anda kaç para atmak istediğinizi seçin.',
        'Kullanım amacınıza göre animasyon süresini ayarlayın.',
        'Atıştan sonra sonuçları ve toplamları hemen kontrol edin.',
        'Basit bir kayıt gerekiyorsa geçmiş panelini açıp CSV dışa aktarın.'
      ],
      whatIs: [
        'Yazı tura, 50:50 kararlar, kura benzeri seçimler, sınıf içi etkinlikler, oyunlar ve hızlı grup kararları için kullanılan tarayıcı tabanlı bir araçtır.',
        'Telefon ve masaüstünde rahat çalışır; hesap açmadan geçmişi incelemenize veya dışa aktarmanıza izin verir.'
      ],
      faq: [
        { q: 'Mobilde iyi çalışır mı?', a: 'Evet. Düzen küçük ekranlara otomatik olarak uyum sağlar.' },
        { q: 'Aynı anda birden fazla para atabilir miyim?', a: 'Evet. Tek turda 1 ile 20 para atabilirsiniz.' },
        { q: 'Sonuç geçmişini kaydedebilir miyim?', a: 'Evet. Her tur geçmişte kalır ve CSV olarak dışa aktarılabilir.' },
        { q: 'Verilerim harici sunuculara gönderilir mi?', a: 'Hayır. Sonuçlar ve geçmiş tarayıcınızda kalır.' }
      ]
    },
    dice: {
      heroSubtitle: 'Bir seferde 1-12 zar atarak masa oyunları, sınıf etkinlikleri ve hızlı rastgele kontroller için kullanın.',
      guideSubtitle: 'Zar aracı tarayıcıda yerel çalışır ve her yüzü, toplamı, ortalamayı ve geçmişi tek ekranda gösterir.',
      steps: [
        { title: '1. Zar sayısını seç', body: 'Tek turda 1 ile 12 arasında zar belirleyin.' },
        { title: '2. Hızı ayarla', body: 'Daha hızlı kullanım ya da daha görünür bir sonuç için animasyon süresini ayarlayın.' },
        { title: '3. İncele ve kaydet', body: 'Her sonucu, toplamı ve ortalamayı kontrol edin; gerekirse geçmişi CSV olarak dışa aktarın.' }
      ],
      howTo: [
        'Aynı anda kaç zar atmak istediğinizi seçin.',
        'Kullanım amacınıza göre animasyon süresini ayarlayın.',
        'Atıştan sonra her sonuç, toplam, ortalama ve tek/çift raporunu kontrol edin.',
        'Oturumu saklamak isterseniz geçmiş panelini açıp CSV dışa aktarın.'
      ],
      whatIs: [
        'Zar atma aracı, masa oyunları, tabletop RPG oturumları, sınıf etkinlikleri ve hızlı rastgele kararlar için kullanılan tarayıcı tabanlı bir araçtır.',
        'Telefon ve masaüstünde rahat çalışır, her tur için faydalı özetler gösterir ve giriş yapmadan geçmişi dışa aktarmanıza izin verir.'
      ],
      faq: [
        { q: 'Mobilde iyi çalışır mı?', a: 'Evet. Düzen küçük ekranlara otomatik olarak uyum sağlar.' },
        { q: 'Aynı anda birden fazla zar atabilir miyim?', a: 'Evet. Tek turda 1 ile 12 zar atabilir ve tüm sonuçları birlikte görebilirsiniz.' },
        { q: 'Atış geçmişini kaydedebilir miyim?', a: 'Evet. Her tur geçmişte kalır ve CSV olarak dışa aktarılabilir.' },
        { q: 'Verilerim harici sunuculara gönderilir mi?', a: 'Hayır. Sonuçlar ve geçmiş tarayıcınızda kalır.' }
      ]
    }
  },
  it: {
    sections: {
      howTo: 'Come si usa',
      whatIs: "Cos'è questo strumento?",
      faq: 'FAQ',
      tryOtherTools: 'Prova altri strumenti',
      relatedTools: 'Strumenti correlati'
    },
    coinflip: {
      heroSubtitle: 'Lancia da 1 a 20 monete insieme per decisioni rapide, attività in classe, giochi e spareggi semplici.',
      guideSubtitle: 'Il lancio moneta funziona localmente nel browser, mostra il totale dei risultati e permette di esportare la cronologia in CSV.',
      steps: [
        { title: '1. Scegli il numero di monete', body: 'Seleziona da 1 a 20 monete per una singola manche.' },
        { title: '2. Regola il ritmo', body: 'Imposta un’animazione più breve o più lunga a seconda che tu voglia rapidità o una rivelazione più visibile.' },
        { title: '3. Controlla ed esporta', body: 'Verifica il totale di ciascun lato ed esporta la cronologia in CSV se serve.' }
      ],
      howTo: [
        'Scegli quante monete lanciare contemporaneamente.',
        'Regola la durata dell’animazione in base al tuo uso.',
        'Premi il pulsante e controlla subito i risultati totali.',
        'Apri la cronologia ed esporta un CSV se ti serve un registro semplice.'
      ],
      whatIs: [
        'Lancio moneta è uno strumento nel browser per decisioni 50:50, spareggi, attività in classe, giochi e scelte rapide in gruppo.',
        'Funziona bene su mobile e desktop e ti permette di consultare o esportare la cronologia senza creare un account.'
      ],
      faq: [
        { q: 'Funziona bene su mobile?', a: 'Sì. Il layout si adatta automaticamente agli schermi più piccoli.' },
        { q: 'Posso lanciare più monete insieme?', a: 'Sì. Puoi lanciare da 1 a 20 monete in una sola manche.' },
        { q: 'Posso salvare la cronologia dei risultati?', a: 'Sì. Ogni manche resta nella cronologia e può essere esportata in CSV.' },
        { q: 'I miei dati vengono inviati a server esterni?', a: 'No. Risultati e cronologia restano nel tuo browser.' }
      ]
    },
    dice: {
      heroSubtitle: 'Lancia da 1 a 12 dadi insieme per giochi da tavolo, attività in classe e verifiche casuali rapide.',
      guideSubtitle: 'Il lancio dadi funziona localmente nel browser e mostra ogni faccia, il totale, la media e la cronologia in un solo posto.',
      steps: [
        { title: '1. Scegli il numero di dadi', body: 'Seleziona da 1 a 12 dadi per una singola manche.' },
        { title: '2. Regola il ritmo', body: 'Imposta l’animazione in base alla rapidità o alla visibilità che desideri.' },
        { title: '3. Controlla e salva', body: 'Verifica ogni faccia, il totale, la media ed esporta la cronologia in CSV se serve.' }
      ],
      howTo: [
        'Scegli quanti dadi lanciare contemporaneamente.',
        'Regola la durata dell’animazione in base al tuo uso.',
        'Premi il pulsante e controlla ogni risultato, il totale, la media e il report pari/dispari.',
        'Apri la cronologia ed esporta un CSV se vuoi conservare la sessione.'
      ],
      whatIs: [
        'Lancio dadi è uno strumento nel browser per giochi da tavolo, giochi di ruolo da tavolo, attività in classe e decisioni casuali rapide.',
        'Funziona bene su mobile e desktop, mostra riepiloghi utili per ogni manche e permette di esportare la cronologia senza accesso.'
      ],
      faq: [
        { q: 'Funziona bene su mobile?', a: 'Sì. Il layout si adatta automaticamente agli schermi più piccoli.' },
        { q: 'Posso lanciare più dadi insieme?', a: 'Sì. Puoi lanciare da 1 a 12 dadi in una sola manche e vedere tutti i risultati insieme.' },
        { q: 'Posso salvare la cronologia dei lanci?', a: 'Sì. Ogni manche resta nella cronologia e può essere esportata in CSV.' },
        { q: 'I miei dati vengono inviati a server esterni?', a: 'No. Risultati e cronologia restano nel tuo browser.' }
      ]
    }
  },
  vi: {
    sections: {
      howTo: 'Cách dùng',
      whatIs: 'Công cụ này là gì?',
      faq: 'FAQ',
      tryOtherTools: 'Thử công cụ khác',
      relatedTools: 'Công cụ liên quan'
    },
    coinflip: {
      heroSubtitle: 'Tung 1 đến 20 đồng xu cùng lúc để ra quyết định nhanh, dùng trong lớp học, trò chơi và các lượt phân xử ngắn.',
      guideSubtitle: 'Công cụ tung đồng xu chạy cục bộ trên trình duyệt, hiển thị tổng kết quả và cho phép xuất lịch sử sang CSV khi cần.',
      steps: [
        { title: '1. Chọn số đồng xu', body: 'Chọn từ 1 đến 20 đồng xu cho một lượt tung.' },
        { title: '2. Điều chỉnh nhịp', body: 'Chỉnh thời gian hoạt ảnh theo nhu cầu xem nhanh hoặc trình bày rõ hơn.' },
        { title: '3. Xem và xuất', body: 'Kiểm tra tổng kết quả của từng mặt và xuất lịch sử sang CSV nếu cần.' }
      ],
      howTo: [
        'Chọn số đồng xu bạn muốn tung cùng lúc.',
        'Điều chỉnh thời gian hoạt ảnh theo cách bạn muốn sử dụng.',
        'Nhấn nút tung và xem kết quả ngay lập tức.',
        'Mở bảng lịch sử và xuất CSV nếu cần lưu lại một bản ghi đơn giản.'
      ],
      whatIs: [
        'Tung đồng xu là công cụ trên trình duyệt dành cho quyết định 50:50, phân xử, hoạt động lớp học, trò chơi và lựa chọn nhanh trong nhóm.',
        'Công cụ hoạt động tốt trên điện thoại và máy tính, đồng thời cho phép xem hoặc xuất lịch sử mà không cần tạo tài khoản.'
      ],
      faq: [
        { q: 'Có dùng tốt trên điện thoại không?', a: 'Có. Giao diện tự động thích ứng với màn hình nhỏ.' },
        { q: 'Tôi có thể tung nhiều đồng xu cùng lúc không?', a: 'Có. Bạn có thể tung từ 1 đến 20 đồng xu trong một lượt.' },
        { q: 'Tôi có thể lưu lịch sử kết quả không?', a: 'Có. Mỗi lượt đều nằm trong lịch sử và có thể xuất ra CSV.' },
        { q: 'Dữ liệu của tôi có bị gửi tới máy chủ bên ngoài không?', a: 'Không. Kết quả và lịch sử vẫn ở trong trình duyệt của bạn.' }
      ]
    },
    dice: {
      heroSubtitle: 'Tung 1 đến 12 xúc xắc cùng lúc cho board game, hoạt động lớp học và các lần kiểm tra ngẫu nhiên nhanh.',
      guideSubtitle: 'Công cụ xúc xắc chạy cục bộ trên trình duyệt và hiển thị từng mặt, tổng, trung bình cùng lịch sử trong một màn hình.',
      steps: [
        { title: '1. Chọn số xúc xắc', body: 'Chọn từ 1 đến 12 xúc xắc cho một lượt tung.' },
        { title: '2. Điều chỉnh nhịp', body: 'Chỉnh thời gian hoạt ảnh theo nhu cầu xem nhanh hoặc trình bày rõ hơn.' },
        { title: '3. Xem và lưu', body: 'Kiểm tra từng mặt, tổng, trung bình rồi xuất lịch sử sang CSV nếu cần.' }
      ],
      howTo: [
        'Chọn số xúc xắc bạn muốn tung cùng lúc.',
        'Điều chỉnh thời gian hoạt ảnh theo cách bạn muốn sử dụng.',
        'Nhấn nút tung và xem từng kết quả, tổng, trung bình cùng báo cáo chẵn/lẻ.',
        'Mở bảng lịch sử và xuất CSV nếu muốn lưu lại phiên làm việc.'
      ],
      whatIs: [
        'Tung xúc xắc là công cụ trên trình duyệt dành cho board game, tabletop RPG, hoạt động lớp học và các quyết định ngẫu nhiên nhanh.',
        'Công cụ hoạt động tốt trên điện thoại và máy tính, hiển thị tóm tắt hữu ích cho từng lượt và cho phép xuất lịch sử mà không cần đăng nhập.'
      ],
      faq: [
        { q: 'Có dùng tốt trên điện thoại không?', a: 'Có. Giao diện tự động thích ứng với màn hình nhỏ.' },
        { q: 'Tôi có thể tung nhiều xúc xắc cùng lúc không?', a: 'Có. Bạn có thể tung từ 1 đến 12 xúc xắc trong một lượt và xem tất cả kết quả cùng lúc.' },
        { q: 'Tôi có thể lưu lịch sử lượt tung không?', a: 'Có. Mỗi lượt đều nằm trong lịch sử và có thể xuất ra CSV.' },
        { q: 'Dữ liệu của tôi có bị gửi tới máy chủ bên ngoài không?', a: 'Không. Kết quả và lịch sử vẫn ở trong trình duyệt của bạn.' }
      ]
    }
  },
  th: {
    sections: {
      howTo: 'วิธีใช้งาน',
      whatIs: 'เครื่องมือนี้คืออะไร',
      faq: 'FAQ',
      tryOtherTools: 'ลองใช้เครื่องมืออื่น',
      relatedTools: 'เครื่องมือที่เกี่ยวข้อง'
    },
    coinflip: {
      heroSubtitle: 'โยนเหรียญ 1 ถึง 20 เหรียญพร้อมกันเพื่อช่วยตัดสินใจเร็ว ใช้ในห้องเรียน เกม และการจับสลากง่าย ๆ',
      guideSubtitle: 'เครื่องมือโยนเหรียญทำงานในเบราว์เซอร์ของคุณ แสดงผลรวมของแต่ละด้าน และส่งออกประวัติเป็น CSV ได้เมื่อจำเป็น',
      steps: [
        { title: '1. เลือกจำนวนเหรียญ', body: 'กำหนดจำนวนเหรียญต่อรอบได้ตั้งแต่ 1 ถึง 20 เหรียญ' },
        { title: '2. ปรับจังหวะ', body: 'ปรับเวลาแอนิเมชันให้เหมาะกับการดูผลเร็วหรือการแสดงผลที่ชัดขึ้น' },
        { title: '3. ตรวจสอบและส่งออก', body: 'ดูผลรวมของแต่ละด้านและส่งออกประวัติเป็น CSV เมื่อต้องการ' }
      ],
      howTo: [
        'เลือกจำนวนเหรียญที่ต้องการโยนพร้อมกัน',
        'ปรับเวลาแอนิเมชันให้เหมาะกับการใช้งานของคุณ',
        'กดปุ่มโยนแล้วดูผลได้ทันที',
        'เปิดแผงประวัติและส่งออก CSV หากต้องการเก็บบันทึกแบบง่าย'
      ],
      whatIs: [
        'เครื่องมือโยนเหรียญเป็นเครื่องมือบนเบราว์เซอร์สำหรับการตัดสินใจแบบ 50:50 การตัดสินแพ้ชนะ กิจกรรมในห้องเรียน เกม และการเลือกแบบรวดเร็วในกลุ่ม',
        'ใช้งานได้ดีทั้งบนมือถือและเดสก์ท็อป และให้คุณดูหรือส่งออกประวัติได้โดยไม่ต้องสมัครบัญชี'
      ],
      faq: [
        { q: 'ใช้งานบนมือถือได้ดีไหม?', a: 'ได้ หน้าเว็บจะปรับเลย์เอาต์ให้เหมาะกับหน้าจอขนาดเล็กโดยอัตโนมัติ' },
        { q: 'ฉันสามารถโยนหลายเหรียญพร้อมกันได้ไหม?', a: 'ได้ คุณสามารถโยนได้ตั้งแต่ 1 ถึง 20 เหรียญต่อรอบ' },
        { q: 'ฉันบันทึกประวัติผลลัพธ์ได้ไหม?', a: 'ได้ แต่ละรอบจะถูกเก็บไว้ในประวัติและส่งออกเป็น CSV ได้' },
        { q: 'ข้อมูลถูกส่งไปยังเซิร์ฟเวอร์ภายนอกหรือไม่?', a: 'ไม่ ผลลัพธ์และประวัติจะอยู่ในเบราว์เซอร์ของคุณ' }
      ]
    },
    dice: {
      heroSubtitle: 'ทอยลูกเต๋า 1 ถึง 12 ลูกพร้อมกันสำหรับเกมกระดาน กิจกรรมในห้องเรียน และการสุ่มอย่างรวดเร็ว',
      guideSubtitle: 'เครื่องมือทอยลูกเต๋าทำงานในเบราว์เซอร์ของคุณและแสดงแต่ละหน้า ผลรวม ค่าเฉลี่ย และประวัติในหน้าจอเดียว',
      steps: [
        { title: '1. เลือกจำนวนลูกเต๋า', body: 'กำหนดจำนวนลูกเต๋าต่อรอบได้ตั้งแต่ 1 ถึง 12 ลูก' },
        { title: '2. ปรับจังหวะ', body: 'ปรับเวลาแอนิเมชันให้เหมาะกับการดูผลเร็วหรือการแสดงผลที่ชัดขึ้น' },
        { title: '3. ตรวจสอบและบันทึก', body: 'ดูแต่ละหน้า ผลรวม ค่าเฉลี่ย และส่งออกประวัติเป็น CSV เมื่อต้องการ' }
      ],
      howTo: [
        'เลือกจำนวนลูกเต๋าที่ต้องการทอยพร้อมกัน',
        'ปรับเวลาแอนิเมชันให้เหมาะกับการใช้งานของคุณ',
        'กดปุ่มทอยแล้วดูผลแต่ละหน้า ผลรวม ค่าเฉลี่ย และรายงานคี่/คู่',
        'เปิดแผงประวัติและส่งออก CSV หากต้องการเก็บบันทึกของรอบนั้น'
      ],
      whatIs: [
        'เครื่องมือทอยลูกเต๋าเป็นเครื่องมือบนเบราว์เซอร์สำหรับเกมกระดาน เกมสวมบทบาทบนโต๊ะ กิจกรรมในห้องเรียน และการตัดสินใจแบบสุ่มอย่างรวดเร็ว',
        'ใช้งานได้ดีทั้งบนมือถือและเดสก์ท็อป แสดงสรุปที่มีประโยชน์ในแต่ละรอบ และให้คุณส่งออกประวัติได้โดยไม่ต้องเข้าสู่ระบบ'
      ],
      faq: [
        { q: 'ใช้งานบนมือถือได้ดีไหม?', a: 'ได้ หน้าเว็บจะปรับเลย์เอาต์ให้เหมาะกับหน้าจอขนาดเล็กโดยอัตโนมัติ' },
        { q: 'ฉันสามารถทอยหลายลูกพร้อมกันได้ไหม?', a: 'ได้ คุณสามารถทอยได้ตั้งแต่ 1 ถึง 12 ลูกต่อรอบและดูผลทั้งหมดพร้อมกัน' },
        { q: 'ฉันบันทึกประวัติการทอยได้ไหม?', a: 'ได้ แต่ละรอบจะถูกเก็บไว้ในประวัติและส่งออกเป็น CSV ได้' },
        { q: 'ข้อมูลถูกส่งไปยังเซิร์ฟเวอร์ภายนอกหรือไม่?', a: 'ไม่ ผลลัพธ์และประวัติจะอยู่ในเบราว์เซอร์ของคุณ' }
      ]
    }
  },
  nl: {
    sections: {
      howTo: 'Zo gebruik je het',
      whatIs: 'Wat is deze tool?',
      faq: 'FAQ',
      tryOtherTools: 'Probeer andere tools',
      relatedTools: 'Gerelateerde tools'
    },
    coinflip: {
      heroSubtitle: 'Gooi 1 tot 20 munten tegelijk voor snelle beslissingen, lessen, spelrondes en eerlijke tie-breaks.',
      guideSubtitle: 'Kop of munt draait lokaal in je browser, toont de totaalscore per zijde en laat je de geschiedenis als CSV exporteren.',
      steps: [
        { title: '1. Kies het aantal munten', body: 'Selecteer 1 tot 20 munten voor één beurt.' },
        { title: '2. Stel het tempo in', body: 'Kies een kortere of langere animatie voor snelheid of een duidelijkere onthulling.' },
        { title: '3. Controleer en exporteer', body: 'Bekijk de totalen per zijde en exporteer de geschiedenis als CSV wanneer nodig.' }
      ],
      howTo: [
        'Kies hoeveel munten je tegelijk wilt gooien.',
        'Pas de animatieduur aan op snelheid of zichtbaarheid.',
        'Druk op de knop en bekijk direct de resultaten en totalen.',
        'Open het geschiedenispaneel en exporteer CSV als je een eenvoudig log wilt bewaren.'
      ],
      whatIs: [
        'Kop of munt is een browsertool voor 50:50-keuzes, tie-breaks, klassikale activiteiten, spelletjes en snelle groepsbeslissingen.',
        'De tool werkt prettig op mobiel en desktop en laat je de geschiedenis bekijken of exporteren zonder account.'
      ],
      faq: [
        { q: 'Werkt dit goed op mobiel?', a: 'Ja. De lay-out past zich automatisch aan kleinere schermen aan.' },
        { q: 'Kan ik meerdere munten tegelijk gooien?', a: 'Ja. Je kunt 1 tot 20 munten in één beurt gooien.' },
        { q: 'Kan ik de resultaatgeschiedenis bewaren?', a: 'Ja. Elke beurt blijft in de geschiedenis staan en kan als CSV worden geëxporteerd.' },
        { q: 'Worden mijn gegevens naar externe servers gestuurd?', a: 'Nee. Resultaten en geschiedenis blijven in je browser.' }
      ]
    },
    dice: {
      heroSubtitle: 'Gooi 1 tot 12 dobbelstenen tegelijk voor bordspellen, lessen en snelle willekeurige controles.',
      guideSubtitle: 'De dobbelsteentool draait lokaal in je browser en toont elke worp, het totaal, het gemiddelde en de geschiedenis op één plek.',
      steps: [
        { title: '1. Kies het aantal dobbelstenen', body: 'Selecteer 1 tot 12 dobbelstenen voor één beurt.' },
        { title: '2. Stel het tempo in', body: 'Pas de animatie aan voor snelheid of een duidelijkere onthulling.' },
        { title: '3. Controleer en bewaar', body: 'Bekijk elke worp, het totaal, het gemiddelde en exporteer de geschiedenis als CSV wanneer nodig.' }
      ],
      howTo: [
        'Kies hoeveel dobbelstenen je tegelijk wilt gooien.',
        'Pas de animatieduur aan op jouw gebruik.',
        'Druk op de knop en bekijk elke worp, het totaal, het gemiddelde en het oneven/even-overzicht.',
        'Open het geschiedenispaneel en exporteer CSV als je de sessie wilt bewaren.'
      ],
      whatIs: [
        'Dobbelsteen gooien is een browsertool voor bordspellen, tabletop-RPG’s, klassikale activiteiten en snelle willekeurige beslissingen.',
        'De tool werkt prettig op mobiel en desktop, toont nuttige samenvattingen per beurt en laat je de geschiedenis exporteren zonder in te loggen.'
      ],
      faq: [
        { q: 'Werkt dit goed op mobiel?', a: 'Ja. De lay-out past zich automatisch aan kleinere schermen aan.' },
        { q: 'Kan ik meerdere dobbelstenen tegelijk gooien?', a: 'Ja. Je kunt 1 tot 12 dobbelstenen in één beurt gooien en alle resultaten samen bekijken.' },
        { q: 'Kan ik de worpgeschiedenis bewaren?', a: 'Ja. Elke beurt blijft in de geschiedenis staan en kan als CSV worden geëxporteerd.' },
        { q: 'Worden mijn gegevens naar externe servers gestuurd?', a: 'Nee. Resultaten en geschiedenis blijven in je browser.' }
      ]
    }
  }
};

module.exports = {
  COIN_DICE_COPY
};
