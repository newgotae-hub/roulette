#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { NON_KO_LOCALES, FOOTER_LABELS, RTL_LOCALES } = require('./legal-shared');

const ROOT = path.resolve(__dirname, '..');
const TARGET_LOCALES = NON_KO_LOCALES.filter((locale) => locale !== 'en');
const GUIDE_ORDER = [
  { slug: 'which-random-tool-to-use', tool: 'roulette' },
  { slug: 'fair-random-draw', tool: 'roulette' },
  { slug: 'event-draw-checklist', tool: 'ladder' },
  { slug: 'winner-records', tool: 'luckydraw' },
  { slug: 'classroom-random-picker', tool: 'roulette' },
  { slug: 'balanced-team-generator', tool: 'team-generator' }
];

const DATA = {
  ja: {
    hubTitle: '抽選ガイド',
    hubSummary: 'このページでは、Randomly Pick の主要ガイドを日本語で要点整理し、必要に応じて英語の詳細版も確認できるようにしています。ツール選び、公平な抽選運営、授業利用、チーム分け、記録管理までまとめて追えます。',
    backHome: 'ホームに戻る',
    englishGuides: '英語ガイド',
    openGuide: 'ガイドを見る',
    guideList: 'ガイド一覧',
    openTool: 'おすすめツールを開く',
    englishGuide: '英語版ガイド',
    localizedSummaryHeading: 'このページの要点',
    keyPointsHeading: '確認ポイント',
    usageHeading: 'Randomly Pick で使う時の見方',
    englishReferenceHeading: '英語の詳細ガイド',
    referenceIntro: '下には英語版の詳細ガイドをそのまま載せています。用語や補足を確認したいときに使ってください。',
    hybridNote: 'このページは日本語の要点整理と、英語の詳細リファレンスを続けて読める構成です。',
    trustTitle: '運営情報とポリシー',
    trustBody: 'ガイドと合わせて、運営者情報、お問い合わせ、プライバシーポリシー、利用規約も確認できます。',
    guideWord: 'ガイド',
    pages: {
      'which-random-tool-to-use': {
        title: 'どのランダム抽選ツールを使うべきか',
        summary: 'ルーレット、番号抽選、あみだくじ、チーム分け、コイントス、サイコロは、機能一覧よりも結果の説明方法で選ぶ方が実運用では失敗しにくくなります。',
        points: [
          '名簿そのものを見せたいときはルーレットが向いています。',
          'チケット番号や座席番号のような数値結果は番号抽選の方が整理しやすいです。',
          '対応付け、バランス調整、二択、ゲーム判定が目的なら別の専用ツールを選ぶ方が自然です。'
        ],
        usage: '抽選後に何をどう説明する必要があるかを先に決め、その説明に合う Randomly Pick のツールを開くと運営がぶれません。'
      },
      'fair-random-draw': {
        title: '公平なランダム抽選を進める方法',
        summary: '公平さはボタンそのものより、参加者リストの確定、除外ルールの事前告知、後で示せる記録の有無で判断されます。',
        points: [
          '最初の抽選前に参加者リストを確定させます。',
          '重複、除外、再抽選のルールは結果を見る前に説明します。',
          'あとで確認できるようにログや保存結果を残します。'
        ],
        usage: 'ルーレットや番号抽選を使うときは、設定状態と保存結果を画面に見せながら進行すると信頼を得やすくなります。'
      },
      'event-draw-checklist': {
        title: 'イベント抽選のチェックリスト',
        summary: '公開抽選や配信前には、参加者確認、ルール表示、画面準備、記録方法、テスト実行の五つを先に確認しておくと事故が減ります。',
        points: [
          '重複や直前の名簿変更を確認します。',
          '開始前にルールを参加者にも見える形で示します。',
          '全画面、音量、結果保存を一度テストします。'
        ],
        usage: 'あみだくじ、景品抽選、授業、配信イベントの準備中にこのチェックリストを横に置いて確認すると運営が安定します。'
      },
      'winner-records': {
        title: '当選記録を残すべき理由',
        summary: '当選ログがあると、複数ラウンドの抽選後でも異議対応、引き継ぎ、後追い確認を落ち着いて処理できます。',
        points: [
          '誰がいつ当選したか、どのルールで進行したかを一緒に残します。',
          'CSV やテキスト保存は記憶よりも後で検証しやすいです。',
          '後続ラウンドで当選者を除外する運営ほど記録の価値が上がります。'
        ],
        usage: '抽選が終わるたびに結果をその場で保存しておくと、後で再構成する無駄を避けられます。'
      },
      'classroom-random-picker': {
        title: '授業でランダム抽選ツールを使うコツ',
        summary: '授業用のランダムツールは、ルールが生徒に伝わり、授業のテンポを崩さず、同じ生徒ばかりに偏らないことが重要です。',
        points: [
          '発表順、簡単なゲーム、チーム分けではルールを先に見せます。',
          '1 回ごとの処理を短くして授業を止めすぎないようにします。',
          '選ばれた生徒を次の回でも対象にするか先に決めます。'
        ],
        usage: '名前選びはルーレット、短い二択はコイントスやサイコロ、バランス重視の班分けはチーム分けを使うと整理しやすいです。'
      },
      'balanced-team-generator': {
        title: 'バランス型チーム分けを使う前に見るポイント',
        summary: '戦力差が活動の満足度を下げる場面ではバランス型チーム分けが有効ですが、入力する評価が今の状況に合っていることが前提です。',
        points: [
          '気軽な混成なら完全ランダムだけでも十分です。',
          '競争の質が大事な場面ではスコアベースの調整が役立ちます。',
          'バランス調整は偏りを減らす手段であり、完全な同戦力保証ではありません。'
        ],
        usage: '見た目の演出よりロスターの公平感が重要なときは、チーム生成ツールを優先して使う方が説明しやすくなります。'
      }
    }
  },
  'zh-cn': {
    hubTitle: '抽签指南',
    hubSummary: '这个页面把 Randomly Pick 的核心指南先用简体中文整理要点，再附上英文详细版，方便你同时查看操作原则、工具选择、课堂使用、团队分配和记录保存。',
    backHome: '返回首页',
    englishGuides: '英文指南',
    openGuide: '查看指南',
    guideList: '指南列表',
    openTool: '打开推荐工具',
    englishGuide: '英文原版',
    localizedSummaryHeading: '本页重点',
    keyPointsHeading: '检查重点',
    usageHeading: '在 Randomly Pick 中怎么用',
    englishReferenceHeading: '英文详细指南',
    referenceIntro: '下面附上英文详细版，适合对照术语或继续查看完整说明。',
    hybridNote: '本页先提供中文重点摘要，再继续附上英文详细参考内容。',
    trustTitle: '站点信息与政策',
    trustBody: '除了指南之外，你也可以继续查看运营者信息、联系方式、隐私政策和使用条款。',
    guideWord: '指南',
    pages: {
      'which-random-tool-to-use': {
        title: '该选哪种随机工具',
        summary: '转盘、号码抽签、梯子抽签、分队工具、抛硬币和骰子，不应该只按功能表来选，更应该按你事后要如何解释结果来选。',
        points: [
          '需要让大家直接看到名单本身时，转盘最直观。',
          '抽票号、座位号和数字区间时，号码抽签更清晰。',
          '如果重点是配对、平衡、二选一或游戏判定，就该改用对应的专用工具。'
        ],
        usage: '先想清楚抽签结束后你要向参与者解释什么，再打开对应的 Randomly Pick 工具，流程会更稳。'
      },
      'fair-random-draw': {
        title: '怎样进行公平的随机抽签',
        summary: '公平感往往来自名单先锁定、排除规则先说明、结果可以留档，而不是只来自按钮本身。',
        points: [
          '在第一次抽签前先固定参与名单。',
          '重复、排除和重抽规则要在大家看结果前说明。',
          '保留日志或导出结果，方便之后核对。'
        ],
        usage: '使用转盘或号码抽签时，把当前设置和结果记录同时展示出来，会更容易建立信任。'
      },
      'event-draw-checklist': {
        title: '活动抽签检查清单',
        summary: '公开抽奖或直播前，先检查参与名单、规则显示、画面布局、记录方式和一次试跑，能大幅减少临场失误。',
        points: [
          '先检查重复报名和最后一刻变更。',
          '开始前把规则公开给参与者看。',
          '正式开始前先测试全屏、声音和结果保存。'
        ],
        usage: '在搭建梯子抽签、赠品抽奖、课堂点名或直播活动时，把这份清单放在旁边逐项确认。'
      },
      'winner-records': {
        title: '为什么要保留中奖记录',
        summary: '有中奖记录后，多轮抽签后的争议处理、交接说明和后续查询都会轻松得多。',
        points: [
          '把中奖者、时间和当时适用的规则一起记下来。',
          'CSV 或文本导出比事后凭记忆回想可靠得多。',
          '如果后续轮次会排除中奖者，记录的重要性会更高。'
        ],
        usage: '每一轮结束后立刻导出结果，不要等活动结束后再回头拼凑。'
      },
      'classroom-random-picker': {
        title: '课堂中使用随机工具的建议',
        summary: '课堂随机工具最重要的是让学生理解规则、不拖慢节奏，并避免总是让同一批学生被点到。',
        points: [
          '点名、小游戏和分组前都要先说明抽取规则。',
          '每次操作尽量短，避免打断课堂节奏。',
          '提前决定已经被选中的学生下一轮是否继续参与。'
        ],
        usage: '抽名字用转盘，短平快活动用硬币或骰子，需要兼顾组队平衡时再用分队工具。'
      },
      'balanced-team-generator': {
        title: '使用平衡分队前要先确认什么',
        summary: '当实力差距会明显影响活动体验时，平衡分队很有价值，但前提是你输入的评分确实反映当前水平。',
        points: [
          '如果只是轻松混合，纯随机分队通常已经足够。',
          '如果竞争质量很重要，按分数平衡会更有帮助。',
          '平衡分队能降低偏差，但不代表绝对同等实力。'
        ],
        usage: '当你更需要阵容公平而不是抽签仪式感时，优先使用分队工具会更容易解释。'
      }
    }
  },
  'zh-tw': {
    hubTitle: '抽籤指南',
    hubSummary: '這個頁面會先用繁體中文整理 Randomly Pick 的重點指南，再附上英文詳細版，方便你同時查看工具選擇、公開抽籤、課堂使用、分隊與記錄保存。',
    backHome: '返回首頁',
    englishGuides: '英文指南',
    openGuide: '查看指南',
    guideList: '指南列表',
    openTool: '開啟推薦工具',
    englishGuide: '英文原版',
    localizedSummaryHeading: '本頁重點',
    keyPointsHeading: '檢查重點',
    usageHeading: '在 Randomly Pick 中怎麼用',
    englishReferenceHeading: '英文詳細指南',
    referenceIntro: '下方附上英文詳細版，適合對照術語或繼續查看完整說明。',
    hybridNote: '本頁先提供中文重點摘要，後面再接上英文詳細參考內容。',
    trustTitle: '網站資訊與政策',
    trustBody: '除了指南之外，你也可以繼續查看營運者資訊、聯絡方式、隱私權政策與使用條款。',
    guideWord: '指南',
    pages: {
      'which-random-tool-to-use': {
        title: '該選哪一種隨機工具',
        summary: '轉盤、號碼抽籤、梯子抽籤、分隊工具、擲硬幣和骰子，不該只看功能表，而要看你事後要怎麼向參與者說明結果。',
        points: [
          '需要讓大家直接看到名單本身時，轉盤最直覺。',
          '抽票號、座位號或數字區間時，號碼抽籤更清楚。',
          '若重點是配對、平衡、二選一或遊戲判定，就應改用對應的專用工具。'
        ],
        usage: '先決定抽籤結束後要說明什麼，再打開對應的 Randomly Pick 工具，整體流程會更穩。'
      },
      'fair-random-draw': {
        title: '如何進行公平的隨機抽籤',
        summary: '公平感通常來自名單先鎖定、排除規則先公告、結果可留存，而不是只來自按鈕本身。',
        points: [
          '第一次抽籤前先固定參與名單。',
          '重複、排除與重抽規則要在大家看結果前說清楚。',
          '保留紀錄或匯出結果，方便後續核對。'
        ],
        usage: '使用轉盤或號碼抽籤時，同時展示目前設定與結果紀錄，通常更容易建立信任。'
      },
      'event-draw-checklist': {
        title: '活動抽籤檢查清單',
        summary: '公開抽獎或直播前，先檢查參與名單、規則顯示、畫面配置、紀錄方式與一次試跑，可以大幅降低臨場失誤。',
        points: [
          '先檢查重複報名與最後一刻的名單變動。',
          '開始前把規則明確展示給參與者看。',
          '正式上線前先測試全螢幕、聲音與結果保存。'
        ],
        usage: '在準備梯子抽籤、贈品抽獎、課堂點名或直播活動時，把這份清單放在旁邊逐項確認。'
      },
      'winner-records': {
        title: '為什麼要保留中獎紀錄',
        summary: '只要有中獎紀錄，多輪抽籤後的爭議處理、交接說明與後續查詢都會容易很多。',
        points: [
          '把中獎者、時間與當時適用的規則一起記下來。',
          'CSV 或文字匯出比事後憑記憶回想可靠得多。',
          '如果後續輪次會排除中獎者，紀錄的重要性會更高。'
        ],
        usage: '每輪結束後立刻匯出結果，不要等活動結束後再回頭重建。'
      },
      'classroom-random-picker': {
        title: '課堂中使用隨機工具的建議',
        summary: '課堂隨機工具最重要的是讓學生理解規則、不拖慢節奏，並避免總是讓同一批學生被點到。',
        points: [
          '點名、活動或分組前都要先說明抽取規則。',
          '每次操作要盡量短，避免打斷上課節奏。',
          '先決定已被選中的學生下一輪是否仍然保留資格。'
        ],
        usage: '抽名字用轉盤，短平快活動用硬幣或骰子，需要兼顧分組平衡時再用分隊工具。'
      },
      'balanced-team-generator': {
        title: '使用平衡分隊前要先確認什麼',
        summary: '當實力差距會明顯影響活動體驗時，平衡分隊很有價值，但前提是你輸入的評分能反映目前狀況。',
        points: [
          '如果只是輕鬆混合，純隨機分隊通常已經足夠。',
          '若比賽品質很重要，分數平衡會更有幫助。',
          '平衡分隊可以降低偏差，但不代表絕對同等實力。'
        ],
        usage: '當你更在意陣容公平而不是抽籤儀式感時，優先使用分隊工具會更容易說明。'
      }
    }
  },
  es: {
    hubTitle: 'Guías de sorteos',
    hubSummary: 'Esta sección resume en español las guías principales de Randomly Pick y añade la versión detallada en inglés para que puedas revisar criterios operativos, elección de herramientas, uso en clase, equipos y registros.',
    backHome: 'Volver al inicio',
    englishGuides: 'Guías en inglés',
    openGuide: 'Ver guía',
    guideList: 'Lista de guías',
    openTool: 'Abrir herramienta recomendada',
    englishGuide: 'Guía en inglés',
    localizedSummaryHeading: 'Resumen local',
    keyPointsHeading: 'Puntos clave',
    usageHeading: 'Cómo aplicarlo en Randomly Pick',
    englishReferenceHeading: 'Guía detallada en inglés',
    referenceIntro: 'Debajo aparece la versión completa en inglés para contrastar términos o seguir leyendo con más detalle.',
    hybridNote: 'Esta página combina un resumen en español con una referencia detallada en inglés.',
    trustTitle: 'Información del sitio y políticas',
    trustBody: 'Además de las guías, también puedes revisar la información del operador, el contacto, la política de privacidad y los términos de uso.',
    guideWord: 'Guía',
    pages: {
      'which-random-tool-to-use': {
        title: 'Qué herramienta aleatoria conviene usar',
        summary: 'Ruleta, selector de números, ladder draw, generador de equipos, moneda y dados se eligen mejor por la forma en que tendrás que explicar el resultado, no solo por la lista de funciones.',
        points: [
          'La ruleta funciona mejor cuando la lista visible es parte del proceso.',
          'Los números de boleto, asiento o rango se manejan mejor con el selector numérico.',
          'Si lo importante es emparejar, equilibrar, resolver un 50:50 o seguir reglas de juego, conviene usar la herramienta específica.'
        ],
        usage: 'Primero decide qué tendrás que explicar después del sorteo y luego abre la herramienta de Randomly Pick que mejor se ajuste a esa explicación.'
      },
      'fair-random-draw': {
        title: 'Cómo ejecutar un sorteo aleatorio justo',
        summary: 'La sensación de justicia depende más de una lista cerrada, reglas de exclusión anunciadas y registros verificables que del botón en sí.',
        points: [
          'Cierra la lista de participantes antes del primer sorteo.',
          'Explica las reglas de duplicados, exclusión y repetición antes de mostrar el resultado.',
          'Guarda registros o exportaciones para responder preguntas posteriores.'
        ],
        usage: 'Si usas ruleta o selector numérico, mostrar al mismo tiempo la configuración y el historial guardado suele aumentar la confianza.'
      },
      'event-draw-checklist': {
        title: 'Checklist para sorteos de eventos',
        summary: 'Antes de un sorteo público o en directo conviene revisar participantes, reglas visibles, pantalla, método de registro y una prueba rápida.',
        points: [
          'Verifica duplicados y cambios de última hora en la lista.',
          'Haz visibles las reglas antes de empezar.',
          'Prueba una vez la pantalla completa, el sonido y la captura de resultados.'
        ],
        usage: 'Mantén esta lista abierta mientras preparas sorteos en ladder, giveaways, clases o eventos en streaming.'
      },
      'winner-records': {
        title: 'Por qué conviene guardar registros de ganadores',
        summary: 'Los registros de ganadores reducen disputas, facilitan relevos internos y ayudan a responder preguntas después de sorteos con varias rondas.',
        points: [
          'Anota quién ganó, cuándo ocurrió y qué reglas estaban activas.',
          'Un CSV o un TXT se revisa mejor después que un recuerdo improvisado.',
          'Los registros importan más cuando los ganadores quedan excluidos de rondas posteriores.'
        ],
        usage: 'Exporta los resultados justo después de cada ronda en lugar de intentar reconstruirlos al final.'
      },
      'classroom-random-picker': {
        title: 'Cómo usar selectores aleatorios en clase',
        summary: 'En el aula, la herramienta aleatoria funciona mejor cuando el alumnado entiende la regla, el ritmo no se rompe y no siempre sale el mismo grupo de estudiantes.',
        points: [
          'Muestra la regla antes de usarla para turnos, actividades o equipos.',
          'Mantén cada ronda corta para no frenar la clase.',
          'Decide de antemano si un estudiante seleccionado sigue siendo elegible después.'
        ],
        usage: 'Usa la ruleta para nombres, moneda o dados para actividades rápidas y el generador de equipos cuando importe equilibrar grupos.'
      },
      'balanced-team-generator': {
        title: 'Qué revisar antes de usar un generador de equipos equilibrados',
        summary: 'Equilibrar equipos aporta valor cuando las diferencias de nivel afectarían la actividad, pero depende de que las puntuaciones usadas sean actuales y relevantes.',
        points: [
          'Para mezclar por diversión, los equipos completamente aleatorios suelen bastar.',
          'Si la competitividad importa, el equilibrio basado en puntuación ayuda más.',
          'Equilibrar reduce la variación, pero no garantiza fuerzas idénticas.'
        ],
        usage: 'Cuando la prioridad sea la justicia del plantel más que la ceremonia del sorteo, abre primero el generador de equipos.'
      }
    }
  },
  fr: {
    hubTitle: 'Guides de tirage',
    hubSummary: 'Cette section résume en français les principaux guides de Randomly Pick et ajoute la version détaillée en anglais, afin de couvrir le choix de l’outil, les règles de tirage, l’usage en classe, les équipes et les enregistrements.',
    backHome: 'Retour à l’accueil',
    englishGuides: 'Guides en anglais',
    openGuide: 'Voir le guide',
    guideList: 'Liste des guides',
    openTool: 'Ouvrir l’outil recommandé',
    englishGuide: 'Guide anglais',
    localizedSummaryHeading: 'Résumé local',
    keyPointsHeading: 'Points à vérifier',
    usageHeading: 'Application dans Randomly Pick',
    englishReferenceHeading: 'Guide détaillé en anglais',
    referenceIntro: 'La version détaillée en anglais apparaît ci-dessous si vous souhaitez comparer la terminologie ou lire la version complète.',
    hybridNote: 'Cette page réunit un résumé en français et une référence détaillée en anglais.',
    trustTitle: 'Informations du site et politiques',
    trustBody: 'En plus des guides, vous pouvez aussi consulter les informations sur l’opérateur, le contact, la politique de confidentialité et les conditions.',
    guideWord: 'Guide',
    pages: {
      'which-random-tool-to-use': {
        title: 'Quel outil aléatoire faut-il choisir ?',
        summary: 'Roue, tirage de numéros, ladder draw, répartition en équipes, pile ou face et dés se choisissent mieux selon la manière dont vous devrez expliquer le résultat que selon une simple liste de fonctions.',
        points: [
          'La roue convient quand la liste visible fait partie du processus.',
          'Les numéros de ticket, de siège ou de plage se gèrent mieux avec un tirage numérique.',
          'Si l’objectif réel est l’appariement, l’équilibre, un choix binaire ou une règle de jeu, il vaut mieux utiliser l’outil dédié.'
        ],
        usage: 'Commencez par définir ce que vous devrez expliquer après le tirage, puis ouvrez l’outil Randomly Pick le plus cohérent avec cette logique.'
      },
      'fair-random-draw': {
        title: 'Comment organiser un tirage aléatoire équitable',
        summary: 'L’impression d’équité dépend surtout d’une liste verrouillée, de règles d’exclusion annoncées et de traces consultables, pas du bouton seul.',
        points: [
          'Validez la liste des participants avant le premier tirage.',
          'Expliquez les règles sur les doublons, les exclusions et les relances avant le résultat.',
          'Conservez des journaux ou des exports pour répondre aux questions plus tard.'
        ],
        usage: 'Avec la roue ou le tirage numérique, afficher en même temps les réglages actifs et l’historique sauvegardé renforce souvent la confiance.'
      },
      'event-draw-checklist': {
        title: 'Checklist pour un tirage en événement',
        summary: 'Avant un tirage public ou en direct, il faut vérifier la liste des participants, les règles visibles, l’écran, la méthode d’enregistrement et un essai rapide.',
        points: [
          'Contrôlez les doublons et les modifications de dernière minute.',
          'Affichez les règles avant de commencer.',
          'Testez une fois le plein écran, le son et l’enregistrement du résultat.'
        ],
        usage: 'Gardez cette checklist ouverte pendant la préparation d’un ladder draw, d’un giveaway, d’une activité de classe ou d’un live.'
      },
      'winner-records': {
        title: 'Pourquoi conserver les enregistrements des gagnants',
        summary: 'Les historiques de gagnants réduisent les litiges, facilitent les passations et aident à répondre aux questions après plusieurs tours de tirage.',
        points: [
          'Notez qui a gagné, à quel moment et sous quelles règles.',
          'Un export CSV ou TXT se relit mieux qu’un souvenir approximatif.',
          'Les enregistrements deviennent encore plus importants quand les gagnants sont exclus des tours suivants.'
        ],
        usage: 'Exportez les résultats juste après chaque tirage au lieu d’essayer de les reconstruire plus tard.'
      },
      'classroom-random-picker': {
        title: 'Comment utiliser les sélecteurs aléatoires en classe',
        summary: 'En classe, l’outil aléatoire fonctionne mieux lorsque la règle est comprise, que le rythme reste fluide et que les mêmes élèves ne sortent pas sans cesse.',
        points: [
          'Annoncez la règle avant de l’utiliser pour des tours de parole, des activités ou des équipes.',
          'Gardez des manches courtes pour ne pas casser le rythme du cours.',
          'Décidez à l’avance si un élève déjà sélectionné reste éligible ensuite.'
        ],
        usage: 'Utilisez la roue pour les noms, pile ou face ou les dés pour les activités rapides, et le générateur d’équipes quand l’équilibre des groupes compte.'
      },
      'balanced-team-generator': {
        title: 'Que vérifier avant d’utiliser un générateur d’équipes équilibrées',
        summary: 'L’équilibrage des équipes est utile lorsque les écarts de niveau nuiraient à l’activité, mais il dépend de notes réellement actuelles et pertinentes.',
        points: [
          'Pour un simple mélange convivial, des équipes entièrement aléatoires suffisent souvent.',
          'Quand la qualité de la compétition compte, un équilibre basé sur les scores aide davantage.',
          'L’équilibrage réduit la variance sans garantir des forces identiques.'
        ],
        usage: 'Si la priorité est l’équité des compositions plutôt que la cérémonie du tirage, ouvrez d’abord le générateur d’équipes.'
      }
    }
  },
  de: {
    hubTitle: 'Ziehungsleitfäden',
    hubSummary: 'Dieser Bereich fasst die wichtigsten Randomly-Pick-Leitfäden auf Deutsch zusammen und ergänzt sie um die ausführliche englische Version. So lassen sich Werkzeugwahl, faire Ziehungen, Unterrichtsnutzung, Teamaufteilung und Protokolle gemeinsam prüfen.',
    backHome: 'Zur Startseite',
    englishGuides: 'Englische Guides',
    openGuide: 'Guide öffnen',
    guideList: 'Guide-Übersicht',
    openTool: 'Empfohlenes Tool öffnen',
    englishGuide: 'Englischer Guide',
    localizedSummaryHeading: 'Kurzfassung',
    keyPointsHeading: 'Wichtige Punkte',
    usageHeading: 'So nutzt du es in Randomly Pick',
    englishReferenceHeading: 'Ausführlicher Guide auf Englisch',
    referenceIntro: 'Darunter findest du die vollständige englische Version, wenn du Begriffe abgleichen oder weiter ins Detail gehen willst.',
    hybridNote: 'Diese Seite kombiniert eine deutsche Kurzfassung mit einer ausführlichen englischen Referenz.',
    trustTitle: 'Betreiber- und Richtlinienseiten',
    trustBody: 'Neben den Guides kannst du auch Betreiberinformationen, Kontakt, Datenschutz und Nutzungsbedingungen prüfen.',
    guideWord: 'Guide',
    pages: {
      'which-random-tool-to-use': {
        title: 'Welches Zufallstool solltest du verwenden?',
        summary: 'Wheel, Zahlenauswahl, Ladder Draw, Teamgenerator, Münzwurf und Würfel wählt man in der Praxis besser danach aus, wie das Ergebnis später erklärt werden muss, nicht nur nach einer Funktionsliste.',
        points: [
          'Das Wheel ist stark, wenn die sichtbare Liste selbst wichtig ist.',
          'Losnummern, Sitzplätze und Zahlenbereiche lassen sich mit einem Zahlentool sauberer abwickeln.',
          'Wenn Zuordnung, Balance, 50:50-Entscheidung oder Spielregeln im Mittelpunkt stehen, ist das jeweilige Spezialtool sinnvoller.'
        ],
        usage: 'Lege zuerst fest, was du nach der Ziehung erklären musst, und öffne dann das Randomly-Pick-Tool, das genau zu dieser Erklärung passt.'
      },
      'fair-random-draw': {
        title: 'Wie man eine faire Zufallsziehung durchführt',
        summary: 'Fairness entsteht meist durch eine fixierte Liste, vorab erklärte Ausschlussregeln und nachprüfbare Aufzeichnungen, nicht durch den Button allein.',
        points: [
          'Schließe die Teilnehmerliste vor der ersten Ziehung ab.',
          'Erkläre Regeln zu Duplikaten, Ausschlüssen und Wiederholungen vor dem Ergebnis.',
          'Bewahre Logs oder Exporte auf, um spätere Fragen beantworten zu können.'
        ],
        usage: 'Wenn du Wheel oder Zahlenauswahl nutzt, hilft es meist, aktive Einstellungen und gespeicherte Ergebnisse gleichzeitig sichtbar zu machen.'
      },
      'event-draw-checklist': {
        title: 'Checkliste für Event-Ziehungen',
        summary: 'Vor einer öffentlichen Ziehung oder einem Live-Event sollten Teilnehmerliste, sichtbare Regeln, Bildschirmaufbau, Protokollierung und ein kurzer Testlauf geprüft werden.',
        points: [
          'Prüfe doppelte Einträge und Last-Minute-Änderungen.',
          'Zeige die Regeln sichtbar, bevor es losgeht.',
          'Teste Vollbild, Sound und Ergebnisspeicherung einmal im Voraus.'
        ],
        usage: 'Halte diese Checkliste nebenbei offen, wenn du Ladder Draws, Giveaways, Unterrichtsziehungen oder Streams vorbereitest.'
      },
      'winner-records': {
        title: 'Warum Gewinnerprotokolle wichtig sind',
        summary: 'Gewinnerprotokolle verringern Streitfälle, erleichtern Übergaben und helfen bei Rückfragen nach mehreren Ziehungsrunden.',
        points: [
          'Notiere, wer gewonnen hat, wann es passiert ist und welche Regeln galten.',
          'CSV- oder TXT-Exporte lassen sich später besser prüfen als Erinnerungen.',
          'Besonders wichtig werden Protokolle, wenn Gewinner aus späteren Runden ausgeschlossen werden.'
        ],
        usage: 'Exportiere die Ergebnisse direkt nach jeder Runde, statt sie später mühsam rekonstruieren zu müssen.'
      },
      'classroom-random-picker': {
        title: 'Zufallstools sinnvoll im Unterricht einsetzen',
        summary: 'Im Unterricht funktioniert ein Zufallstool am besten, wenn die Regel klar ist, das Tempo erhalten bleibt und nicht immer dieselben Lernenden ausgewählt werden.',
        points: [
          'Zeige die Regel vor dem Einsatz für Reihenfolge, Aktivitäten oder Teams.',
          'Halte einzelne Ziehungen kurz, damit der Unterrichtsfluss nicht leidet.',
          'Entscheide vorher, ob bereits ausgewählte Schüler in späteren Runden wieder teilnehmen dürfen.'
        ],
        usage: 'Nutze das Wheel für Namen, Münze oder Würfel für kurze Aktivitäten und den Teamgenerator, wenn Gruppenausgleich wichtig ist.'
      },
      'balanced-team-generator': {
        title: 'Was vor einem ausgeglichenen Teamgenerator zu prüfen ist',
        summary: 'Ausgeglichene Teams helfen dann, wenn Leistungsunterschiede die Aktivität spürbar verzerren würden. Die Grundlage müssen aber aktuelle und relevante Werte sein.',
        points: [
          'Für lockeres Mischen reichen oft komplett zufällige Teams.',
          'Wenn Wettbewerbsqualität zählt, hilft eine punktbasierte Balance stärker.',
          'Balance reduziert Streuung, garantiert aber keine identische Stärke.'
        ],
        usage: 'Wenn faire Kader wichtiger sind als Showeffekte beim Ziehen, solltest du zuerst den Teamgenerator öffnen.'
      }
    }
  },
  'pt-br': {
    hubTitle: 'Guias de sorteio',
    hubSummary: 'Esta área resume em português do Brasil os principais guias do Randomly Pick e inclui a versão detalhada em inglês, cobrindo escolha de ferramenta, sorteios justos, uso em sala, divisão de times e registro de resultados.',
    backHome: 'Voltar ao início',
    englishGuides: 'Guias em inglês',
    openGuide: 'Ver guia',
    guideList: 'Lista de guias',
    openTool: 'Abrir ferramenta recomendada',
    englishGuide: 'Guia em inglês',
    localizedSummaryHeading: 'Resumo local',
    keyPointsHeading: 'Pontos principais',
    usageHeading: 'Como aplicar no Randomly Pick',
    englishReferenceHeading: 'Guia detalhado em inglês',
    referenceIntro: 'Abaixo está a versão completa em inglês para conferir termos ou continuar lendo com mais detalhes.',
    hybridNote: 'Esta página junta um resumo em português com uma referência detalhada em inglês.',
    trustTitle: 'Informações do site e políticas',
    trustBody: 'Além dos guias, você também pode consultar informações do operador, contato, política de privacidade e termos de uso.',
    guideWord: 'Guia',
    pages: {
      'which-random-tool-to-use': {
        title: 'Qual ferramenta aleatória usar',
        summary: 'Roleta, sorteio numérico, ladder draw, gerador de times, moeda e dados funcionam melhor quando você escolhe pela forma de explicar o resultado, e não só pela lista de recursos.',
        points: [
          'A roleta é melhor quando a lista visível faz parte do processo.',
          'Bilhetes, assentos e intervalos numéricos ficam mais claros com um sorteador de números.',
          'Se o objetivo for parear, equilibrar, decidir um 50:50 ou seguir uma regra de jogo, use a ferramenta específica.'
        ],
        usage: 'Primeiro defina o que precisa ser explicado depois do sorteio e então abra a ferramenta do Randomly Pick que mais combina com essa explicação.'
      },
      'fair-random-draw': {
        title: 'Como conduzir um sorteio aleatório justo',
        summary: 'A percepção de justiça depende mais de lista travada, regras de exclusão anunciadas e registros verificáveis do que do botão em si.',
        points: [
          'Feche a lista de participantes antes do primeiro sorteio.',
          'Explique regras de duplicidade, exclusão e novo sorteio antes do resultado.',
          'Guarde logs ou exportações para responder dúvidas depois.'
        ],
        usage: 'Se você usar roleta ou sorteio numérico, mostrar as configurações ativas e o histórico salvo ao mesmo tempo costuma aumentar a confiança.'
      },
      'event-draw-checklist': {
        title: 'Checklist para sorteios em eventos',
        summary: 'Antes de um sorteio público ou ao vivo, vale revisar lista de participantes, regras visíveis, tela, método de registro e um teste rápido.',
        points: [
          'Verifique duplicidades e mudanças de última hora.',
          'Deixe as regras visíveis antes de começar.',
          'Teste uma vez o modo tela cheia, o som e a gravação do resultado.'
        ],
        usage: 'Mantenha este checklist aberto ao preparar ladder draws, giveaways, atividades em sala ou eventos transmitidos.'
      },
      'winner-records': {
        title: 'Por que guardar registros de vencedores',
        summary: 'Registros de vencedores reduzem disputas, facilitam repasses internos e ajudam a responder perguntas depois de várias rodadas.',
        points: [
          'Anote quem venceu, quando aconteceu e quais regras estavam valendo.',
          'Exportações em CSV ou TXT são mais confiáveis do que tentar lembrar depois.',
          'Os registros ficam ainda mais importantes quando vencedores são excluídos de rodadas futuras.'
        ],
        usage: 'Exporte os resultados logo após cada rodada em vez de tentar reconstruí-los no fim do evento.'
      },
      'classroom-random-picker': {
        title: 'Como usar seletores aleatórios em sala de aula',
        summary: 'Em sala, a ferramenta aleatória funciona melhor quando a turma entende a regra, o ritmo da aula continua e os mesmos alunos não são chamados o tempo todo.',
        points: [
          'Mostre a regra antes de usar para apresentação, atividade ou divisão de grupos.',
          'Mantenha cada rodada curta para não travar a aula.',
          'Decida antes se um aluno já escolhido continua elegível nas rodadas seguintes.'
        ],
        usage: 'Use a roleta para nomes, moeda ou dados para atividades curtas e o gerador de times quando o equilíbrio dos grupos importar.'
      },
      'balanced-team-generator': {
        title: 'O que verificar antes de usar um gerador de times equilibrados',
        summary: 'Equilibrar times ajuda quando a diferença de nível prejudicaria a atividade, mas isso depende de pontuações atuais e realmente relevantes.',
        points: [
          'Para mistura casual, times totalmente aleatórios costumam bastar.',
          'Se a qualidade da disputa importa, o equilíbrio por pontuação ajuda mais.',
          'Equilibrar reduz a variação, mas não garante forças idênticas.'
        ],
        usage: 'Quando a prioridade for justiça na composição dos times e não a cerimônia do sorteio, abra primeiro o gerador de times.'
      }
    }
  },
  hi: {
    hubTitle: 'ड्रॉ गाइड',
    hubSummary: 'यह सेक्शन Randomly Pick की मुख्य गाइडों को हिंदी में संक्षेप में समझाता है और साथ में अंग्रेज़ी का विस्तृत संस्करण भी देता है, ताकि टूल चयन, निष्पक्ष ड्रॉ, कक्षा उपयोग, टीम संतुलन और रिकॉर्ड प्रबंधन एक साथ समझे जा सकें।',
    backHome: 'होम पर लौटें',
    englishGuides: 'अंग्रेज़ी गाइड',
    openGuide: 'गाइड खोलें',
    guideList: 'गाइड सूची',
    openTool: 'सुझाया गया टूल खोलें',
    englishGuide: 'अंग्रेज़ी गाइड',
    localizedSummaryHeading: 'स्थानीय सार',
    keyPointsHeading: 'मुख्य बिंदु',
    usageHeading: 'Randomly Pick में इसे कैसे लागू करें',
    englishReferenceHeading: 'अंग्रेज़ी में विस्तृत गाइड',
    referenceIntro: 'नीचे पूरा अंग्रेज़ी संस्करण दिया गया है, जिससे आप शब्दावली मिलान कर सकते हैं या अधिक विस्तार पढ़ सकते हैं।',
    hybridNote: 'इस पेज में हिंदी सारांश और अंग्रेज़ी विस्तृत संदर्भ दोनों शामिल हैं।',
    trustTitle: 'साइट जानकारी और नीतियाँ',
    trustBody: 'गाइड के अलावा आप ऑपरेटर जानकारी, संपर्क, गोपनीयता नीति और उपयोग की शर्तें भी देख सकते हैं।',
    guideWord: 'गाइड',
    pages: {
      'which-random-tool-to-use': {
        title: 'कौन सा रैंडम टूल चुनना चाहिए',
        summary: 'व्हील, नंबर पिकर, लैडर ड्रॉ, टीम जनरेटर, कॉइन फ्लिप और डाइस को सिर्फ फीचर सूची से नहीं, बल्कि इस आधार पर चुनना बेहतर है कि बाद में परिणाम कैसे समझाना होगा।',
        points: [
          'जब स्क्रीन पर सूची खुद दिखना ज़रूरी हो, तब व्हील सबसे उपयोगी है।',
          'टिकट नंबर, सीट नंबर और संख्या-आधारित परिणाम नंबर पिकर से बेहतर संभलते हैं।',
          'अगर मकसद मैचिंग, बैलेंस, 50:50 फैसला या गेम नियम है, तो अलग समर्पित टूल चुनें।'
        ],
        usage: 'पहले तय करें कि ड्रॉ के बाद आपको क्या समझाना होगा, फिर उसी तर्क से मेल खाने वाला Randomly Pick टूल खोलें।'
      },
      'fair-random-draw': {
        title: 'निष्पक्ष रैंडम ड्रॉ कैसे चलाएँ',
        summary: 'निष्पक्षता की भावना केवल बटन से नहीं, बल्कि पहले से तय सूची, घोषित बहिष्करण नियम और बाद में दिखाए जा सकने वाले रिकॉर्ड से बनती है।',
        points: [
          'पहले ड्रॉ से पहले प्रतिभागी सूची लॉक करें।',
          'डुप्लिकेट, बहिष्करण और री-ड्रॉ नियम परिणाम से पहले समझाएँ।',
          'बाद के सवालों के लिए लॉग या एक्सपोर्ट सुरक्षित रखें।'
        ],
        usage: 'अगर आप व्हील या नंबर ड्रॉ चला रहे हैं, तो सक्रिय सेटिंग और सेव किया गया इतिहास साथ दिखाना भरोसा बढ़ाता है।'
      },
      'event-draw-checklist': {
        title: 'इवेंट ड्रॉ चेकलिस्ट',
        summary: 'सार्वजनिक ड्रॉ या लाइव इवेंट से पहले प्रतिभागी सूची, नियम दृश्यता, स्क्रीन सेटअप, रिकॉर्डिंग विधि और एक टेस्ट रन देख लेना चाहिए।',
        points: [
          'डुप्लिकेट और अंतिम समय के बदलाव जाँचें।',
          'शुरू होने से पहले नियम स्पष्ट रूप से दिखाएँ।',
          'फुलस्क्रीन, साउंड और रिज़ल्ट सेविंग एक बार टेस्ट करें।'
        ],
        usage: 'लैडर ड्रॉ, गिवअवे, कक्षा गतिविधि या स्ट्रीम इवेंट तैयार करते समय यह चेकलिस्ट साथ रखें।'
      },
      'winner-records': {
        title: 'विजेता रिकॉर्ड क्यों ज़रूरी हैं',
        summary: 'विजेता रिकॉर्ड विवाद कम करते हैं, टीम हैंडऑफ आसान बनाते हैं और कई राउंड वाले ड्रॉ के बाद पूछे गए सवालों का जवाब देना आसान करते हैं।',
        points: [
          'कौन जीता, कब जीता और उस समय कौन से नियम लागू थे, यह दर्ज करें।',
          'CSV या TXT एक्सपोर्ट बाद में याददाश्त से बेहतर साबित होते हैं।',
          'जब विजेताओं को अगले राउंड से हटाया जाता है, तब रिकॉर्ड और भी अहम हो जाते हैं।'
        ],
        usage: 'हर राउंड के तुरंत बाद परिणाम एक्सपोर्ट करें, बाद में उन्हें फिर से बनाने की कोशिश न करें।'
      },
      'classroom-random-picker': {
        title: 'कक्षा में रैंडम पिकर कैसे उपयोग करें',
        summary: 'कक्षा में रैंडम टूल तब बेहतर काम करता है जब छात्र नियम समझें, गति बनी रहे और हर बार वही छात्र न चुने जाएँ।',
        points: [
          'प्रेज़ेंटेशन क्रम, गतिविधि या समूह बनाने से पहले नियम दिखाएँ।',
          'हर राउंड छोटा रखें ताकि कक्षा की गति न टूटे।',
          'पहले तय करें कि चुना गया छात्र अगली बार फिर पात्र रहेगा या नहीं।'
        ],
        usage: 'नामों के लिए व्हील, तेज गतिविधियों के लिए कॉइन या डाइस और समूह संतुलन के लिए टीम जनरेटर चुनें।'
      },
      'balanced-team-generator': {
        title: 'संतुलित टीम जनरेटर इस्तेमाल करने से पहले क्या देखें',
        summary: 'जब कौशल अंतर गतिविधि की गुणवत्ता बिगाड़ सकता है, तब संतुलित टीम बनाना उपयोगी है, लेकिन यह वर्तमान और सही स्कोर इनपुट पर निर्भर करता है।',
        points: [
          'हल्के-फुल्के मिश्रण के लिए पूरी तरह रैंडम टीम पर्याप्त हो सकती है।',
          'प्रतिस्पर्धा की गुणवत्ता महत्वपूर्ण हो तो स्कोर-आधारित संतुलन मदद करता है।',
          'संतुलन भिन्नता कम करता है, पूरी तरह समान ताकत की गारंटी नहीं देता।'
        ],
        usage: 'जब टीम संरचना की निष्पक्षता समारोह से अधिक महत्वपूर्ण हो, तब पहले टीम जनरेटर खोलना बेहतर है।'
      }
    }
  },
  ar: {
    hubTitle: 'أدلة السحب',
    hubSummary: 'تقدّم هذه الصفحة ملخصًا عربيًا لأهم أدلة Randomly Pick، ثم تضع النسخة الإنجليزية المفصلة تحتها حتى تتمكن من مراجعة اختيار الأداة، وعدالة السحب، والاستخدام في الصف، وتقسيم الفرق، وحفظ السجلات في مكان واحد.',
    backHome: 'العودة إلى الرئيسية',
    englishGuides: 'الأدلة الإنجليزية',
    openGuide: 'فتح الدليل',
    guideList: 'قائمة الأدلة',
    openTool: 'فتح الأداة المقترحة',
    englishGuide: 'الدليل الإنجليزي',
    localizedSummaryHeading: 'الملخص المحلي',
    keyPointsHeading: 'نقاط مهمة',
    usageHeading: 'كيفية تطبيق ذلك في Randomly Pick',
    englishReferenceHeading: 'الدليل الإنجليزي المفصل',
    referenceIntro: 'ستجد أدناه النسخة الإنجليزية الكاملة إذا أردت مراجعة المصطلحات أو قراءة الشرح بالتفصيل.',
    hybridNote: 'تجمع هذه الصفحة بين ملخص عربي ومرجع إنجليزي مفصل.',
    trustTitle: 'معلومات الموقع والسياسات',
    trustBody: 'إلى جانب الأدلة، يمكنك أيضًا مراجعة معلومات المشغّل وصفحة التواصل وسياسة الخصوصية وشروط الاستخدام.',
    guideWord: 'دليل',
    pages: {
      'which-random-tool-to-use': {
        title: 'ما الأداة العشوائية المناسبة؟',
        summary: 'عجلة الأسماء، واختيار الأرقام، والسلم، وتقسيم الفرق، ورمي العملة، والنرد لا ينبغي اختيارها من قائمة الميزات فقط، بل وفق الطريقة التي ستشرح بها النتيجة لاحقًا.',
        points: [
          'العجلة هي الأنسب عندما تكون القائمة الظاهرة جزءًا مهمًا من العملية.',
          'الأرقام الخاصة بالتذاكر أو المقاعد أو النطاقات العددية تناسب أداة الأرقام أكثر.',
          'إذا كان الهدف الحقيقي هو المطابقة أو التوازن أو قرار 50:50 أو قاعدة لعبة، فالأفضل استخدام الأداة المتخصصة.'
        ],
        usage: 'حدّد أولًا ما الذي ستحتاج إلى شرحه بعد السحب، ثم افتح أداة Randomly Pick التي تدعم هذا الشرح بشكل أوضح.'
      },
      'fair-random-draw': {
        title: 'كيف تدير سحبًا عشوائيًا عادلًا',
        summary: 'الإحساس بالعدالة لا يأتي من الزر وحده، بل من تثبيت القائمة مسبقًا، وإعلان قواعد الاستبعاد، والاحتفاظ بسجل يمكن الرجوع إليه لاحقًا.',
        points: [
          'ثبّت قائمة المشاركين قبل أول عملية سحب.',
          'اشرح قواعد التكرار والاستبعاد وإعادة السحب قبل ظهور النتيجة.',
          'احتفظ بسجلات أو ملفات تصدير لتجيب عن الأسئلة لاحقًا.'
        ],
        usage: 'عند استخدام العجلة أو أداة الأرقام، فإن إظهار الإعدادات الحالية وسجل النتائج المحفوظ يزيد الثقة عادةً.'
      },
      'event-draw-checklist': {
        title: 'قائمة فحص لسحب الفعاليات',
        summary: 'قبل أي سحب علني أو بث مباشر، يجدر بك مراجعة قائمة المشاركين، وإظهار القواعد، وتجهيز الشاشة، وخطة الحفظ، وتنفيذ تجربة سريعة.',
        points: [
          'تحقق من التكرارات والتعديلات الأخيرة على القائمة.',
          'اعرض القواعد بوضوح قبل البداية.',
          'اختبر ملء الشاشة والصوت وحفظ النتيجة مرة واحدة قبل الانطلاق.'
        ],
        usage: 'أبقِ هذه القائمة أمامك أثناء تجهيز سحب السلم أو الجوائز أو أنشطة الصف أو الفعاليات المباشرة.'
      },
      'winner-records': {
        title: 'لماذا يجب حفظ سجلات الفائزين',
        summary: 'سجلات الفائزين تقلل النزاعات، وتسهّل تسليم العمل بين الفرق، وتساعد على الرد على الأسئلة بعد عدة جولات من السحب.',
        points: [
          'سجّل من فاز ومتى حدث ذلك وما القواعد التي كانت فعّالة.',
          'ملفات CSV أو TXT أسهل للمراجعة لاحقًا من الاعتماد على الذاكرة.',
          'تصبح السجلات أهم عندما يتم استبعاد الفائزين من الجولات التالية.'
        ],
        usage: 'صدّر النتائج مباشرة بعد كل جولة بدل محاولة إعادة بنائها في نهاية الحدث.'
      },
      'classroom-random-picker': {
        title: 'استخدام أدوات الاختيار العشوائي في الصف',
        summary: 'في الصف، تعمل الأداة العشوائية بشكل أفضل عندما يفهم الطلاب القاعدة، ويستمر إيقاع الدرس، ولا يتم اختيار المجموعة نفسها كل مرة.',
        points: [
          'اعرض القاعدة قبل استخدامها لترتيب العروض أو النشاطات أو تقسيم المجموعات.',
          'اجعل كل جولة قصيرة حتى لا يتوقف سير الحصة.',
          'قرّر مسبقًا ما إذا كان الطالب المختار يبقى مؤهلًا في الجولات التالية.'
        ],
        usage: 'استخدم العجلة للأسماء، والعملات أو النرد للأنشطة السريعة، ومولّد الفرق عندما يكون توازن المجموعات مهمًا.'
      },
      'balanced-team-generator': {
        title: 'ما الذي يجب التحقق منه قبل استخدام مولد فرق متوازن',
        summary: 'تقسيم الفرق بشكل متوازن مفيد عندما قد تؤثر فروق المستوى في النشاط، لكنه يعتمد على وجود تقييمات حديثة ومرتبطة بالوضع الحالي.',
        points: [
          'إذا كان الهدف مجرد خلط بسيط، فقد تكفي الفرق العشوائية تمامًا.',
          'إذا كانت جودة المنافسة مهمة، فإن التوازن المبني على الدرجات يساعد أكثر.',
          'التوازن يقلل التفاوت لكنه لا يضمن قوة متطابقة تمامًا.'
        ],
        usage: 'عندما تكون عدالة التشكيل أهم من شكل السحب نفسه، فمن الأفضل فتح مولد الفرق أولًا.'
      }
    }
  },
  ru: {
    hubTitle: 'Руководства по розыгрышам',
    hubSummary: 'Этот раздел кратко объясняет основные руководства Randomly Pick на русском языке и добавляет подробную английскую версию, чтобы можно было вместе оценить выбор инструмента, честность розыгрыша, использование в классе, деление на команды и ведение записей.',
    backHome: 'Вернуться на главную',
    englishGuides: 'Руководства на английском',
    openGuide: 'Открыть руководство',
    guideList: 'Список руководств',
    openTool: 'Открыть рекомендуемый инструмент',
    englishGuide: 'Английская версия',
    localizedSummaryHeading: 'Краткое резюме',
    keyPointsHeading: 'Ключевые моменты',
    usageHeading: 'Как применять это в Randomly Pick',
    englishReferenceHeading: 'Подробное руководство на английском',
    referenceIntro: 'Ниже размещена полная английская версия, если нужно сверить термины или прочитать больше деталей.',
    hybridNote: 'Эта страница сочетает русское резюме и подробную английскую справку.',
    trustTitle: 'Информация о сайте и политики',
    trustBody: 'Помимо руководств, вы можете также открыть сведения об операторе, страницу контактов, политику конфиденциальности и условия использования.',
    guideWord: 'Руководство',
    pages: {
      'which-random-tool-to-use': {
        title: 'Какой случайный инструмент выбрать',
        summary: 'Колесо, выбор числа, лестница, генератор команд, монета и кубик лучше выбирать не по списку функций, а по тому, как вы будете объяснять результат после розыгрыша.',
        points: [
          'Колесо удобно, когда сама видимая таблица участников важна для доверия.',
          'Номера билетов, мест и диапазоны чисел лучше обрабатывать числовым инструментом.',
          'Если цель — сопоставление, баланс, решение 50:50 или игровая механика, стоит брать специализированный инструмент.'
        ],
        usage: 'Сначала определите, что именно придется объяснять после розыгрыша, а затем откройте тот инструмент Randomly Pick, который делает это объяснение самым понятным.'
      },
      'fair-random-draw': {
        title: 'Как провести честный случайный розыгрыш',
        summary: 'Ощущение честности создают не кнопки сами по себе, а заранее зафиксированный список, объявленные правила исключения и записи, которые можно показать позже.',
        points: [
          'Зафиксируйте список участников до первого запуска.',
          'Объясните правила дублей, исключений и перезапуска до появления результата.',
          'Сохраняйте логи или выгрузки, чтобы отвечать на вопросы позже.'
        ],
        usage: 'Если вы используете колесо или числовой розыгрыш, одновременный показ активных настроек и сохраненной истории обычно повышает доверие.'
      },
      'event-draw-checklist': {
        title: 'Чек-лист для розыгрыша на мероприятии',
        summary: 'Перед публичным розыгрышем или трансляцией стоит проверить список участников, видимые правила, экран, способ сохранения результатов и сделать один тестовый прогон.',
        points: [
          'Проверьте дубли и изменения списка в последний момент.',
          'Сделайте правила видимыми до начала.',
          'Один раз протестируйте полноэкранный режим, звук и сохранение результата.'
        ],
        usage: 'Держите этот чек-лист под рукой, когда готовите лестницу, giveaway, активность в классе или стрим-событие.'
      },
      'winner-records': {
        title: 'Почему важно хранить записи о победителях',
        summary: 'Журнал победителей уменьшает споры, упрощает передачу процесса другим и помогает отвечать на вопросы после нескольких раундов розыгрыша.',
        points: [
          'Записывайте, кто победил, когда это произошло и какие правила действовали.',
          'CSV или TXT удобнее проверять позже, чем полагаться на память.',
          'Записи особенно важны, если победители исключаются из следующих раундов.'
        ],
        usage: 'Экспортируйте результаты сразу после каждого раунда, а не пытайтесь восстанавливать их потом по памяти.'
      },
      'classroom-random-picker': {
        title: 'Как использовать случайные выборы в классе',
        summary: 'В учебной среде случайный инструмент полезен тогда, когда ученики понимают правило, темп урока не ломается и одни и те же дети не выбираются постоянно.',
        points: [
          'Покажите правило до использования для очередности выступлений, активности или команд.',
          'Делайте раунды короткими, чтобы не тормозить урок.',
          'Заранее решите, остается ли уже выбранный ученик в следующих раундах.'
        ],
        usage: 'Для имен используйте колесо, для коротких активностей — монету или кубик, а для баланса групп — генератор команд.'
      },
      'balanced-team-generator': {
        title: 'Что проверить перед использованием генератора сбалансированных команд',
        summary: 'Сбалансированное деление на команды полезно, когда разница в уровне может испортить активность, но оно опирается на актуальные и действительно значимые оценки.',
        points: [
          'Для простого перемешивания часто хватает полностью случайных команд.',
          'Если качество соревнования важно, баланс по очкам помогает больше.',
          'Баланс снижает разброс, но не гарантирует абсолютно равную силу.'
        ],
        usage: 'Когда важнее справедливость составов, чем церемония самого розыгрыша, сначала открывайте генератор команд.'
      }
    }
  },
  id: {
    hubTitle: 'Panduan undian',
    hubSummary: 'Bagian ini merangkum panduan utama Randomly Pick dalam bahasa Indonesia dan menambahkan versi Inggris yang lebih rinci, supaya pemilihan alat, keadilan undian, penggunaan di kelas, pembagian tim, dan pencatatan hasil bisa dilihat sekaligus.',
    backHome: 'Kembali ke beranda',
    englishGuides: 'Panduan bahasa Inggris',
    openGuide: 'Buka panduan',
    guideList: 'Daftar panduan',
    openTool: 'Buka alat yang disarankan',
    englishGuide: 'Panduan Inggris',
    localizedSummaryHeading: 'Ringkasan lokal',
    keyPointsHeading: 'Poin penting',
    usageHeading: 'Cara menerapkannya di Randomly Pick',
    englishReferenceHeading: 'Panduan detail dalam bahasa Inggris',
    referenceIntro: 'Versi lengkap berbahasa Inggris ada di bawah jika Anda ingin mencocokkan istilah atau membaca lebih rinci.',
    hybridNote: 'Halaman ini menggabungkan ringkasan bahasa Indonesia dengan referensi bahasa Inggris yang lebih detail.',
    trustTitle: 'Informasi situs dan kebijakan',
    trustBody: 'Selain panduan, Anda juga dapat melihat informasi operator, kontak, kebijakan privasi, dan ketentuan penggunaan.',
    guideWord: 'Panduan',
    pages: {
      'which-random-tool-to-use': {
        title: 'Alat acak mana yang sebaiknya dipakai',
        summary: 'Wheel, pengacak angka, ladder draw, pembagi tim, lempar koin, dan dadu sebaiknya dipilih berdasarkan cara Anda menjelaskan hasilnya nanti, bukan hanya dari daftar fiturnya.',
        points: [
          'Wheel paling cocok saat daftar peserta yang terlihat memang bagian penting dari proses.',
          'Nomor tiket, kursi, atau rentang angka lebih rapi dikelola dengan pengacak angka.',
          'Jika tujuan utamanya adalah pencocokan, keseimbangan, keputusan 50:50, atau aturan permainan, gunakan alat khususnya.'
        ],
        usage: 'Tentukan dulu apa yang harus Anda jelaskan setelah undian selesai, lalu buka alat Randomly Pick yang paling cocok dengan penjelasan tersebut.'
      },
      'fair-random-draw': {
        title: 'Cara menjalankan undian acak yang adil',
        summary: 'Kesan adil biasanya datang dari daftar yang sudah dikunci, aturan pengecualian yang diumumkan, dan catatan yang bisa ditunjukkan kembali, bukan dari tombolnya saja.',
        points: [
          'Kunci daftar peserta sebelum undian pertama.',
          'Jelaskan aturan duplikasi, pengecualian, dan pengundian ulang sebelum hasil tampil.',
          'Simpan log atau hasil ekspor untuk menjawab pertanyaan nanti.'
        ],
        usage: 'Saat memakai wheel atau pengacak angka, menampilkan pengaturan aktif dan riwayat hasil secara bersamaan biasanya meningkatkan kepercayaan.'
      },
      'event-draw-checklist': {
        title: 'Checklist undian untuk acara',
        summary: 'Sebelum undian publik atau siaran langsung, periksa daftar peserta, aturan yang terlihat, tampilan layar, cara pencatatan hasil, dan satu kali uji coba singkat.',
        points: [
          'Periksa entri ganda dan perubahan daftar di menit terakhir.',
          'Tampilkan aturan sebelum acara dimulai.',
          'Uji fullscreen, suara, dan penyimpanan hasil satu kali sebelum live.'
        ],
        usage: 'Biarkan checklist ini tetap terbuka saat menyiapkan ladder draw, giveaway, aktivitas kelas, atau acara streaming.'
      },
      'winner-records': {
        title: 'Mengapa catatan pemenang penting',
        summary: 'Catatan pemenang mengurangi sengketa, memudahkan serah terima, dan membantu menjawab pertanyaan setelah beberapa putaran undian.',
        points: [
          'Catat siapa yang menang, kapan hasil itu muncul, dan aturan apa yang berlaku.',
          'Ekspor CSV atau TXT lebih mudah ditinjau lagi dibanding mengandalkan ingatan.',
          'Catatan menjadi lebih penting saat pemenang dikeluarkan dari putaran berikutnya.'
        ],
        usage: 'Ekspor hasil segera setelah tiap putaran selesai, jangan menunggu sampai acara selesai lalu mencoba menyusunnya ulang.'
      },
      'classroom-random-picker': {
        title: 'Cara memakai pemilih acak di kelas',
        summary: 'Di kelas, alat acak paling berguna jika siswa memahami aturannya, tempo pelajaran tetap terjaga, dan tidak selalu siswa yang sama yang terpilih.',
        points: [
          'Tunjukkan aturan sebelum alat dipakai untuk giliran presentasi, aktivitas, atau pembagian kelompok.',
          'Buat tiap putaran singkat agar ritme kelas tidak terhenti.',
          'Putuskan sejak awal apakah siswa yang sudah terpilih tetap boleh ikut lagi.'
        ],
        usage: 'Gunakan wheel untuk nama, koin atau dadu untuk aktivitas cepat, dan generator tim saat keseimbangan kelompok lebih penting.'
      },
      'balanced-team-generator': {
        title: 'Apa yang perlu dicek sebelum memakai generator tim seimbang',
        summary: 'Pembagian tim seimbang berguna ketika selisih kemampuan bisa merusak jalannya aktivitas, tetapi tetap bergantung pada nilai input yang relevan dan terbaru.',
        points: [
          'Untuk campuran santai, tim acak penuh biasanya sudah cukup.',
          'Jika kualitas persaingan penting, keseimbangan berbasis skor lebih membantu.',
          'Penyeimbangan mengurangi variasi, tetapi tidak menjamin kekuatan yang benar-benar sama.'
        ],
        usage: 'Saat keadilan komposisi tim lebih penting daripada seremoni undian, buka generator tim lebih dulu.'
      }
    }
  },
  tr: {
    hubTitle: 'Çekiliş rehberleri',
    hubSummary: 'Bu bölüm, Randomly Pick’in temel rehberlerini Türkçe olarak özetler ve ayrıntılı İngilizce sürümü de ekler. Böylece araç seçimi, adil çekiliş, sınıf kullanımı, takım bölme ve kayıt tutma aynı yerde incelenebilir.',
    backHome: 'Ana sayfaya dön',
    englishGuides: 'İngilizce rehberler',
    openGuide: 'Rehberi aç',
    guideList: 'Rehber listesi',
    openTool: 'Önerilen aracı aç',
    englishGuide: 'İngilizce rehber',
    localizedSummaryHeading: 'Yerel özet',
    keyPointsHeading: 'Önemli noktalar',
    usageHeading: 'Bunu Randomly Pick içinde nasıl uygularsın',
    englishReferenceHeading: 'İngilizce ayrıntılı rehber',
    referenceIntro: 'Aşağıda tam İngilizce sürüm yer alıyor; terimleri karşılaştırmak veya daha ayrıntılı okumak için kullanabilirsiniz.',
    hybridNote: 'Bu sayfa Türkçe bir özet ile ayrıntılı İngilizce referansı bir araya getirir.',
    trustTitle: 'Site bilgileri ve politikalar',
    trustBody: 'Rehberlerin yanında işletmeci bilgisi, iletişim, gizlilik politikası ve kullanım koşullarını da inceleyebilirsiniz.',
    guideWord: 'Rehber',
    pages: {
      'which-random-tool-to-use': {
        title: 'Hangi rastgele araç kullanılmalı',
        summary: 'Çark, sayı seçici, ladder draw, takım oluşturucu, yazı tura ve zar; sadece özellik listesine göre değil, sonucu sonradan nasıl açıklayacağınıza göre seçilmelidir.',
        points: [
          'Görünen listenin kendisi sürecin önemli bir parçasıysa çark daha uygundur.',
          'Bilet numarası, koltuk numarası ve sayı aralıkları için sayı seçici daha temiz bir çözümdür.',
          'Amaç eşleştirme, dengeleme, 50:50 karar ya da oyun kuralıysa özel aracı kullanmak daha doğrudur.'
        ],
        usage: 'Önce çekiliş bittikten sonra neyi açıklamanız gerektiğine karar verin, sonra bu açıklamayı en net destekleyen Randomly Pick aracını açın.'
      },
      'fair-random-draw': {
        title: 'Adil bir rastgele çekiliş nasıl yapılır',
        summary: 'Adillik hissi tek başına düğmeden değil; önceden sabitlenen listeden, duyurulan dışlama kurallarından ve sonradan gösterilebilen kayıtlardan gelir.',
        points: [
          'İlk çekilişten önce katılımcı listesini kilitleyin.',
          'Tekrarlı kayıt, dışlama ve yeniden çekim kurallarını sonuçtan önce açıklayın.',
          'Sonradan sorular gelirse cevaplayabilmek için log veya dışa aktarma saklayın.'
        ],
        usage: 'Çark veya sayı seçici kullanırken aktif ayarları ve kaydedilmiş sonucu birlikte göstermek genelde güveni artırır.'
      },
      'event-draw-checklist': {
        title: 'Etkinlik çekilişi kontrol listesi',
        summary: 'Herkese açık çekiliş veya canlı yayın öncesinde katılımcı listesi, görünür kurallar, ekran düzeni, kayıt planı ve kısa bir prova kontrol edilmelidir.',
        points: [
          'Çift kayıtları ve son dakika liste değişikliklerini kontrol edin.',
          'Başlamadan önce kuralları görünür hale getirin.',
          'Tam ekran, ses ve sonuç kaydını bir kez test edin.'
        ],
        usage: 'Ladder draw, çekiliş kampanyası, sınıf etkinliği veya yayın kurulumu yaparken bu listeyi açık tutun.'
      },
      'winner-records': {
        title: 'Kazanan kayıtları neden önemlidir',
        summary: 'Kazanan kayıtları itirazları azaltır, iç devri kolaylaştırır ve çok turlu çekilişlerden sonra gelen soruları yanıtlamayı kolaylaştırır.',
        points: [
          'Kimin kazandığını, ne zaman kazandığını ve hangi kuralların geçerli olduğunu kaydedin.',
          'CSV veya TXT dışa aktarımları, sonradan hafızaya güvenmekten daha güvenilirdir.',
          'Kazananlar sonraki turlardan çıkarılıyorsa kayıtların değeri daha da artar.'
        ],
        usage: 'Her turun hemen ardından sonuçları dışa aktarın; etkinlik bittiğinde yeniden oluşturmaya çalışmayın.'
      },
      'classroom-random-picker': {
        title: 'Sınıfta rastgele seçiciler nasıl kullanılır',
        summary: 'Sınıfta rastgele araç, öğrenciler kuralı anladığında, ders temposu bozulmadığında ve sürekli aynı öğrenciler seçilmediğinde en iyi sonucu verir.',
        points: [
          'Sunum sırası, etkinlik veya grup bölmeden önce kuralı gösterin.',
          'Ders akışını kesmemek için her turu kısa tutun.',
          'Seçilen öğrencinin sonraki turlarda tekrar dahil olup olmayacağına önceden karar verin.'
        ],
        usage: 'İsimler için çarkı, kısa etkinlikler için para veya zarı, grup dengesi önemliyse takım oluşturucuyu kullanın.'
      },
      'balanced-team-generator': {
        title: 'Dengeli takım oluşturucu kullanmadan önce ne kontrol edilmeli',
        summary: 'Seviye farkı etkinliği bozacaksa dengeli takım oluşturmak faydalıdır; ancak bunun için kullanılan puanların güncel ve gerçekten anlamlı olması gerekir.',
        points: [
          'Rahat bir karışım için tamamen rastgele takımlar çoğu zaman yeterlidir.',
          'Rekabet kalitesi önemliyse puan tabanlı dengeleme daha çok yardımcı olur.',
          'Dengeleme farkı azaltır ama tamamen eşit güç garanti etmez.'
        ],
        usage: 'Takım yapısındaki adalet, çekiliş seremonisinden daha önemliyse önce takım oluşturucuyu açın.'
      }
    }
  },
  it: {
    hubTitle: 'Guide ai sorteggi',
    hubSummary: 'Questa sezione riassume in italiano le guide principali di Randomly Pick e aggiunge la versione inglese completa, così puoi valutare scelta dello strumento, correttezza del sorteggio, uso in classe, divisione squadre e registri dei risultati in un unico punto.',
    backHome: 'Torna alla home',
    englishGuides: 'Guide in inglese',
    openGuide: 'Apri guida',
    guideList: 'Elenco guide',
    openTool: 'Apri lo strumento consigliato',
    englishGuide: 'Guida inglese',
    localizedSummaryHeading: 'Sintesi locale',
    keyPointsHeading: 'Punti chiave',
    usageHeading: 'Come applicarlo in Randomly Pick',
    englishReferenceHeading: 'Guida dettagliata in inglese',
    referenceIntro: 'Qui sotto trovi la versione completa in inglese se vuoi confrontare i termini o leggere i dettagli completi.',
    hybridNote: 'Questa pagina unisce una sintesi in italiano a una referenza inglese più dettagliata.',
    trustTitle: 'Informazioni del sito e policy',
    trustBody: 'Oltre alle guide, puoi consultare anche i dettagli sull’operatore, i contatti, l’informativa sulla privacy e i termini di utilizzo.',
    guideWord: 'Guida',
    pages: {
      'which-random-tool-to-use': {
        title: 'Quale strumento casuale conviene usare',
        summary: 'Ruota, estrazione numerica, ladder draw, generatore di squadre, lancio della moneta e dadi vanno scelti soprattutto in base a come dovrai spiegare il risultato, non solo in base alle funzioni disponibili.',
        points: [
          'La ruota è ideale quando la lista visibile deve far parte del processo.',
          'Biglietti, posti e intervalli numerici si gestiscono meglio con un’estrazione di numeri.',
          'Se il punto è abbinare, bilanciare, decidere un 50:50 o seguire una regola di gioco, è meglio usare lo strumento dedicato.'
        ],
        usage: 'Prima chiarisci che cosa dovrai spiegare dopo il sorteggio, poi apri lo strumento Randomly Pick più coerente con quella spiegazione.'
      },
      'fair-random-draw': {
        title: 'Come gestire un sorteggio casuale corretto',
        summary: 'La percezione di correttezza nasce più da una lista bloccata, da regole di esclusione dichiarate e da registri verificabili che dal pulsante in sé.',
        points: [
          'Blocca l’elenco dei partecipanti prima della prima estrazione.',
          'Spiega prima del risultato le regole su duplicati, esclusioni e nuove estrazioni.',
          'Conserva log o esportazioni per rispondere a eventuali domande successive.'
        ],
        usage: 'Quando usi ruota o estrazione numerica, mostrare insieme impostazioni attive e storico salvato aumenta spesso la fiducia.'
      },
      'event-draw-checklist': {
        title: 'Checklist per un sorteggio evento',
        summary: 'Prima di un’estrazione pubblica o di una diretta conviene controllare elenco partecipanti, regole visibili, schermo, piano di registrazione e una prova rapida.',
        points: [
          'Verifica duplicati e modifiche dell’ultimo minuto.',
          'Rendi visibili le regole prima di iniziare.',
          'Prova una volta fullscreen, audio e salvataggio del risultato.'
        ],
        usage: 'Tieni aperta questa checklist mentre prepari ladder draw, giveaway, attività scolastiche o eventi in streaming.'
      },
      'winner-records': {
        title: 'Perché conviene salvare i registri dei vincitori',
        summary: 'I registri dei vincitori riducono le contestazioni, facilitano il passaggio di consegne e aiutano a rispondere alle domande dopo più round di sorteggio.',
        points: [
          'Annota chi ha vinto, quando e con quali regole attive.',
          'Le esportazioni CSV o TXT si verificano meglio in seguito rispetto ai ricordi.',
          'I registri contano ancora di più quando i vincitori vengono esclusi dai round successivi.'
        ],
        usage: 'Esporta i risultati subito dopo ogni round invece di provare a ricostruirli a fine evento.'
      },
      'classroom-random-picker': {
        title: 'Come usare i selettori casuali in classe',
        summary: 'In classe uno strumento casuale funziona meglio quando gli studenti capiscono la regola, il ritmo non rallenta e non vengono scelti sempre gli stessi.',
        points: [
          'Mostra la regola prima di usarla per turni, attività o gruppi.',
          'Mantieni i round brevi per non interrompere il ritmo della lezione.',
          'Decidi in anticipo se uno studente già scelto resta idoneo nei round successivi.'
        ],
        usage: 'Usa la ruota per i nomi, moneta o dadi per attività rapide e il generatore di squadre quando conta l’equilibrio dei gruppi.'
      },
      'balanced-team-generator': {
        title: 'Cosa controllare prima di usare un generatore di squadre bilanciate',
        summary: 'Bilanciare le squadre è utile quando le differenze di livello danneggerebbero l’attività, ma dipende da punteggi attuali e davvero pertinenti.',
        points: [
          'Per un semplice mescolamento spesso bastano squadre completamente casuali.',
          'Se conta la qualità della competizione, il bilanciamento basato sul punteggio aiuta di più.',
          'Bilanciare riduce la variabilità, ma non garantisce forze identiche.'
        ],
        usage: 'Quando la priorità è la correttezza delle formazioni più che la cerimonia del sorteggio, conviene aprire prima il generatore di squadre.'
      }
    }
  },
  vi: {
    hubTitle: 'Hướng dẫn quay số',
    hubSummary: 'Phần này tóm tắt bằng tiếng Việt các hướng dẫn chính của Randomly Pick và kèm theo bản tiếng Anh đầy đủ, để bạn xem cùng lúc cách chọn công cụ, vận hành quay số công bằng, dùng trong lớp học, chia đội và lưu kết quả.',
    backHome: 'Quay lại trang chủ',
    englishGuides: 'Hướng dẫn tiếng Anh',
    openGuide: 'Mở hướng dẫn',
    guideList: 'Danh sách hướng dẫn',
    openTool: 'Mở công cụ được gợi ý',
    englishGuide: 'Bản tiếng Anh',
    localizedSummaryHeading: 'Tóm tắt bản địa',
    keyPointsHeading: 'Điểm chính',
    usageHeading: 'Áp dụng trong Randomly Pick như thế nào',
    englishReferenceHeading: 'Hướng dẫn chi tiết bằng tiếng Anh',
    referenceIntro: 'Bên dưới là bản tiếng Anh đầy đủ nếu bạn muốn đối chiếu thuật ngữ hoặc đọc chi tiết hơn.',
    hybridNote: 'Trang này kết hợp phần tóm tắt tiếng Việt với bản tham khảo tiếng Anh chi tiết.',
    trustTitle: 'Thông tin trang web và chính sách',
    trustBody: 'Ngoài hướng dẫn, bạn cũng có thể xem thông tin người vận hành, liên hệ, chính sách quyền riêng tư và điều khoản sử dụng.',
    guideWord: 'Hướng dẫn',
    pages: {
      'which-random-tool-to-use': {
        title: 'Nên dùng công cụ ngẫu nhiên nào',
        summary: 'Vòng quay, bộ chọn số, ladder draw, chia đội, tung xu và xúc xắc nên được chọn theo cách bạn cần giải thích kết quả, chứ không chỉ theo danh sách tính năng.',
        points: [
          'Vòng quay phù hợp khi danh sách hiện trên màn hình là một phần quan trọng của quy trình.',
          'Vé số, số ghế và khoảng số nên dùng bộ chọn số để dễ theo dõi hơn.',
          'Nếu mục tiêu là ghép cặp, cân bằng, quyết định 50:50 hoặc luật trò chơi, hãy dùng công cụ chuyên biệt tương ứng.'
        ],
        usage: 'Trước hết hãy xác định bạn cần giải thích điều gì sau khi quay số, rồi mở công cụ Randomly Pick phù hợp nhất với cách giải thích đó.'
      },
      'fair-random-draw': {
        title: 'Cách vận hành một lượt chọn ngẫu nhiên công bằng',
        summary: 'Cảm giác công bằng thường đến từ danh sách đã chốt, quy tắc loại trừ được công bố trước và hồ sơ có thể xem lại, chứ không chỉ từ nút bấm.',
        points: [
          'Chốt danh sách người tham gia trước lượt quay đầu tiên.',
          'Giải thích trước các quy tắc trùng lặp, loại trừ và quay lại.',
          'Lưu log hoặc file xuất để trả lời câu hỏi về sau.'
        ],
        usage: 'Khi dùng vòng quay hoặc bộ chọn số, việc hiển thị đồng thời cài đặt đang bật và lịch sử đã lưu thường giúp tăng độ tin cậy.'
      },
      'event-draw-checklist': {
        title: 'Checklist cho quay số sự kiện',
        summary: 'Trước một lượt quay công khai hoặc phát trực tiếp, nên kiểm tra danh sách người tham gia, quy tắc hiển thị, màn hình, cách lưu kết quả và một lần chạy thử.',
        points: [
          'Kiểm tra tên trùng và thay đổi phút cuối.',
          'Hiển thị rõ quy tắc trước khi bắt đầu.',
          'Thử một lần chế độ toàn màn hình, âm thanh và lưu kết quả.'
        ],
        usage: 'Hãy để checklist này mở bên cạnh khi chuẩn bị ladder draw, giveaway, hoạt động lớp học hoặc sự kiện phát trực tiếp.'
      },
      'winner-records': {
        title: 'Vì sao nên lưu hồ sơ người thắng',
        summary: 'Hồ sơ người thắng giúp giảm tranh cãi, hỗ trợ bàn giao nội bộ và trả lời câu hỏi sau nhiều vòng quay.',
        points: [
          'Ghi lại ai thắng, khi nào và quy tắc nào đang áp dụng.',
          'CSV hoặc TXT dễ xem lại hơn là cố nhớ sau này.',
          'Hồ sơ càng quan trọng khi người thắng bị loại khỏi các vòng tiếp theo.'
        ],
        usage: 'Hãy xuất kết quả ngay sau mỗi vòng thay vì để đến cuối sự kiện mới cố tổng hợp lại.'
      },
      'classroom-random-picker': {
        title: 'Cách dùng công cụ chọn ngẫu nhiên trong lớp học',
        summary: 'Trong lớp học, công cụ ngẫu nhiên hiệu quả nhất khi học sinh hiểu quy tắc, tiết học không bị chậm nhịp và không phải lúc nào cũng gọi trúng cùng một nhóm.',
        points: [
          'Hiển thị quy tắc trước khi dùng cho thứ tự phát biểu, hoạt động hoặc chia nhóm.',
          'Giữ mỗi lượt ngắn để không làm chậm tiết học.',
          'Quyết định trước liệu học sinh đã được chọn có tiếp tục đủ điều kiện ở vòng sau hay không.'
        ],
        usage: 'Dùng vòng quay cho tên, xu hoặc xúc xắc cho hoạt động nhanh và công cụ chia đội khi cần cân bằng nhóm.'
      },
      'balanced-team-generator': {
        title: 'Cần kiểm tra gì trước khi dùng công cụ chia đội cân bằng',
        summary: 'Chia đội cân bằng hữu ích khi chênh lệch trình độ có thể làm giảm chất lượng hoạt động, nhưng điều đó phụ thuộc vào điểm đầu vào còn phù hợp và cập nhật.',
        points: [
          'Nếu chỉ cần trộn nhóm nhẹ nhàng, đội hoàn toàn ngẫu nhiên thường đã đủ.',
          'Nếu chất lượng cạnh tranh quan trọng, cân bằng theo điểm sẽ hữu ích hơn.',
          'Cân bằng giúp giảm chênh lệch nhưng không đảm bảo sức mạnh hoàn toàn ngang nhau.'
        ],
        usage: 'Khi ưu tiên là sự công bằng của đội hình hơn là phần nghi thức quay số, hãy mở công cụ chia đội trước.'
      }
    }
  },
  th: {
    hubTitle: 'คู่มือการสุ่ม',
    hubSummary: 'ส่วนนี้สรุปคู่มือหลักของ Randomly Pick เป็นภาษาไทย และแนบฉบับภาษาอังกฤษแบบละเอียดไว้ด้านล่าง เพื่อให้ตรวจสอบการเลือกเครื่องมือ ความยุติธรรมของการสุ่ม การใช้ในห้องเรียน การแบ่งทีม และการเก็บบันทึกได้ในที่เดียว',
    backHome: 'กลับหน้าแรก',
    englishGuides: 'คู่มือภาษาอังกฤษ',
    openGuide: 'เปิดคู่มือ',
    guideList: 'รายการคู่มือ',
    openTool: 'เปิดเครื่องมือที่แนะนำ',
    englishGuide: 'คู่มืออังกฤษ',
    localizedSummaryHeading: 'สรุปภาษาไทย',
    keyPointsHeading: 'ประเด็นสำคัญ',
    usageHeading: 'วิธีนำไปใช้ใน Randomly Pick',
    englishReferenceHeading: 'คู่มือภาษาอังกฤษฉบับละเอียด',
    referenceIntro: 'ด้านล่างคือฉบับภาษาอังกฤษเต็ม หากต้องการเทียบคำศัพท์หรืออ่านรายละเอียดเพิ่มเติม',
    hybridNote: 'หน้านี้รวมสรุปภาษาไทยและเอกสารอ้างอิงภาษาอังกฤษแบบละเอียดไว้ด้วยกัน',
    trustTitle: 'ข้อมูลเว็บไซต์และนโยบาย',
    trustBody: 'นอกจากคู่มือแล้ว คุณยังสามารถดูข้อมูลผู้ดูแล ช่องทางติดต่อ นโยบายความเป็นส่วนตัว และข้อกำหนดการใช้งานได้ด้วย',
    guideWord: 'คู่มือ',
    pages: {
      'which-random-tool-to-use': {
        title: 'ควรใช้เครื่องมือสุ่มแบบไหน',
        summary: 'วงล้อ ตัวสุ่มเลข ladder draw ตัวแบ่งทีม เหรียญ และลูกเต๋า ควรถูกเลือกจากวิธีที่คุณต้องอธิบายผลลัพธ์หลังจบการสุ่ม ไม่ใช่แค่ดูจากรายการฟังก์ชันเท่านั้น',
        points: [
          'ถ้ารายชื่อที่แสดงบนหน้าจอมีความสำคัญ วงล้อจะเหมาะที่สุด',
          'เลขบัตร เลขที่นั่ง และช่วงตัวเลขเหมาะกับตัวสุ่มเลขมากกว่า',
          'ถ้าเป้าหมายคือการจับคู่ การถ่วงดุล การตัดสินแบบ 50:50 หรือกติกาเกม ควรใช้เครื่องมือเฉพาะทาง'
        ],
        usage: 'เริ่มจากคิดก่อนว่าหลังการสุ่มคุณต้องอธิบายอะไร แล้วค่อยเปิดเครื่องมือของ Randomly Pick ที่รองรับการอธิบายนั้นได้ชัดที่สุด'
      },
      'fair-random-draw': {
        title: 'วิธีดำเนินการสุ่มแบบยุติธรรม',
        summary: 'ความรู้สึกว่ายุติธรรมมักเกิดจากการล็อกรายชื่อไว้ก่อน การประกาศกติกาการตัดสิทธิ์ และการมีบันทึกย้อนดูได้ มากกว่าการพึ่งปุ่มสุ่มเพียงอย่างเดียว',
        points: [
          'ล็อกรายชื่อผู้เข้าร่วมก่อนเริ่มสุ่มครั้งแรก',
          'อธิบายกติกาเรื่องชื่อซ้ำ การตัดสิทธิ์ และการสุ่มใหม่ก่อนแสดงผล',
          'เก็บ log หรือไฟล์ export ไว้ตอบคำถามภายหลัง'
        ],
        usage: 'ถ้าใช้วงล้อหรือตัวสุ่มเลข การแสดงค่าตั้งต้นที่เปิดอยู่พร้อมประวัติผลลัพธ์ที่บันทึกไว้จะช่วยเพิ่มความน่าเชื่อถือ'
      },
      'event-draw-checklist': {
        title: 'เช็กลิสต์ก่อนสุ่มในงานอีเวนต์',
        summary: 'ก่อนการสุ่มสาธารณะหรือการถ่ายทอดสด ควรตรวจสอบรายชื่อผู้เข้าร่วม กติกาที่มองเห็น การจัดหน้าจอ วิธีบันทึกผล และการทดสอบสั้น ๆ หนึ่งครั้ง',
        points: [
          'ตรวจสอบชื่อซ้ำและการเปลี่ยนรายชื่อในนาทีสุดท้าย',
          'ทำให้กติกามองเห็นได้ก่อนเริ่ม',
          'ทดสอบโหมดเต็มหน้าจอ เสียง และการบันทึกผลหนึ่งครั้งก่อนขึ้นจริง'
        ],
        usage: 'เปิดเช็กลิสต์นี้ไว้ข้าง ๆ ระหว่างเตรียม ladder draw กิจกรรมแจกของ ห้องเรียน หรือไลฟ์สตรีม'
      },
      'winner-records': {
        title: 'ทำไมควรเก็บบันทึกผู้ชนะ',
        summary: 'บันทึกผู้ชนะช่วยลดข้อโต้แย้ง ทำให้ส่งต่องานได้ง่ายขึ้น และตอบคำถามหลังการสุ่มหลายรอบได้สะดวกกว่าเดิม',
        points: [
          'บันทึกว่าใครชนะ เมื่อไร และใช้กติกาใดในตอนนั้น',
          'ไฟล์ CSV หรือ TXT ตรวจสอบย้อนหลังได้ง่ายกว่าการอาศัยความจำ',
          'ยิ่งต้องตัดผู้ชนะออกจากรอบถัดไป บันทึกก็ยิ่งสำคัญ'
        ],
        usage: 'ส่งออกผลลัพธ์ทันทีหลังแต่ละรอบ แทนที่จะรอจนจบงานแล้วค่อยพยายามย้อนประกอบข้อมูล'
      },
      'classroom-random-picker': {
        title: 'วิธีใช้เครื่องมือสุ่มในห้องเรียน',
        summary: 'ในห้องเรียน เครื่องมือสุ่มจะได้ผลดีที่สุดเมื่อผู้เรียนเข้าใจกติกา จังหวะการสอนไม่สะดุด และไม่ได้มีแต่นักเรียนกลุ่มเดิมที่ถูกเลือกซ้ำ ๆ',
        points: [
          'แสดงกติกาก่อนใช้กับลำดับการนำเสนอ กิจกรรม หรือการแบ่งกลุ่ม',
          'ทำให้แต่ละรอบสั้นเพื่อไม่ให้จังหวะการสอนช้าลง',
          'ตัดสินใจล่วงหน้าว่านักเรียนที่ถูกเลือกแล้วจะยังมีสิทธิ์ในรอบต่อไปหรือไม่'
        ],
        usage: 'ใช้วงล้อสำหรับรายชื่อ ใช้เหรียญหรือลูกเต๋าสำหรับกิจกรรมสั้น และใช้ตัวแบ่งทีมเมื่อความสมดุลของกลุ่มสำคัญกว่า'
      },
      'balanced-team-generator': {
        title: 'ควรตรวจอะไรบ้างก่อนใช้ตัวแบ่งทีมแบบสมดุล',
        summary: 'การแบ่งทีมแบบสมดุลมีประโยชน์เมื่อความต่างของฝีมืออาจทำให้กิจกรรมเสียคุณภาพ แต่ต้องอาศัยคะแนนที่ยังเป็นปัจจุบันและสะท้อนสถานการณ์จริง',
        points: [
          'ถ้าต้องการแค่คละกลุ่มแบบสบาย ๆ ทีมสุ่มล้วนก็มักเพียงพอ',
          'ถ้าคุณภาพการแข่งขันสำคัญ การถ่วงดุลตามคะแนนจะช่วยได้มากกว่า',
          'การถ่วงดุลช่วยลดความต่าง แต่ไม่ได้รับประกันว่าความสามารถจะเท่ากันเป๊ะ'
        ],
        usage: 'ถ้าความยุติธรรมของรายชื่อทีมสำคัญกว่าพิธีการสุ่ม ควรเปิดตัวแบ่งทีมก่อนเป็นลำดับแรก'
      }
    }
  },
  nl: {
    hubTitle: 'Gidsen voor lotingen',
    hubSummary: 'Deze sectie vat de belangrijkste Randomly Pick-gidsen in het Nederlands samen en voegt de uitgebreide Engelse versie toe, zodat je toolkeuze, eerlijke lotingen, gebruik in de klas, teamverdeling en resultaatregistratie samen kunt beoordelen.',
    backHome: 'Terug naar home',
    englishGuides: 'Engelse gidsen',
    openGuide: 'Gids openen',
    guideList: 'Gidsoverzicht',
    openTool: 'Aanbevolen tool openen',
    englishGuide: 'Engelse gids',
    localizedSummaryHeading: 'Lokale samenvatting',
    keyPointsHeading: 'Belangrijke punten',
    usageHeading: 'Hoe je dit toepast in Randomly Pick',
    englishReferenceHeading: 'Uitgebreide Engelse gids',
    referenceIntro: 'Hieronder staat de volledige Engelse versie als je termen wilt vergelijken of dieper wilt lezen.',
    hybridNote: 'Deze pagina combineert een Nederlandse samenvatting met een uitgebreidere Engelse referentie.',
    trustTitle: 'Site-informatie en beleid',
    trustBody: 'Naast de gidsen kun je ook informatie over de beheerder, contact, privacybeleid en gebruiksvoorwaarden bekijken.',
    guideWord: 'Gids',
    pages: {
      'which-random-tool-to-use': {
        title: 'Welke willekeurige tool moet je kiezen',
        summary: 'Wheel, nummerkiezer, ladder draw, teamgenerator, muntworp en dobbelsteen kies je in de praktijk beter op basis van hoe je de uitkomst moet uitleggen dan alleen op een functielijst.',
        points: [
          'Een wheel werkt het best wanneer de zichtbare lijst zelf onderdeel van het proces is.',
          'Ticketnummers, stoelnummers en getalbereiken zijn duidelijker met een nummerkiezer.',
          'Als het echte doel koppelen, balanceren, een 50:50-keuze of een spelregel is, gebruik dan liever de gespecialiseerde tool.'
        ],
        usage: 'Bepaal eerst wat je na de trekking moet uitleggen en open daarna de Randomly Pick-tool die dat verhaal het duidelijkst ondersteunt.'
      },
      'fair-random-draw': {
        title: 'Hoe je een eerlijke willekeurige trekking uitvoert',
        summary: 'Het gevoel van eerlijkheid ontstaat meestal door een vastgezette lijst, vooraf aangekondigde uitsluitingsregels en gegevens die je later kunt laten zien, niet door de knop alleen.',
        points: [
          'Zet de deelnemerslijst vast voordat de eerste trekking start.',
          'Leg regels over dubbele vermeldingen, uitsluiting en opnieuw trekken uit vóór de uitkomst.',
          'Bewaar logs of exports om latere vragen te kunnen beantwoorden.'
        ],
        usage: 'Als je een wheel of nummertool gebruikt, vergroot het meestal het vertrouwen wanneer actieve instellingen en opgeslagen resultaten tegelijk zichtbaar zijn.'
      },
      'event-draw-checklist': {
        title: 'Checklist voor lotingen bij evenementen',
        summary: 'Voor een publieke trekking of livestream is het slim om deelnemerslijst, zichtbare regels, schermopstelling, opslagplan en één korte test vooraf te controleren.',
        points: [
          'Controleer dubbele inschrijvingen en last-minute wijzigingen.',
          'Maak de regels zichtbaar voordat je begint.',
          'Test fullscreen, geluid en resultaatopslag één keer vooraf.'
        ],
        usage: 'Houd deze checklist open terwijl je ladder draws, giveaways, klasactiviteiten of stream-events voorbereidt.'
      },
      'winner-records': {
        title: 'Waarom winnaarsregistraties belangrijk zijn',
        summary: 'Registraties van winnaars verminderen discussies, maken overdrachten eenvoudiger en helpen bij vragen na meerdere trekkingsrondes.',
        points: [
          'Noteer wie heeft gewonnen, wanneer dat gebeurde en welke regels toen actief waren.',
          'CSV- of TXT-exports zijn later beter te controleren dan herinneringen.',
          'Registraties worden nog belangrijker wanneer winnaars uit latere rondes worden uitgesloten.'
        ],
        usage: 'Exporteer de resultaten direct na elke ronde in plaats van ze later opnieuw te moeten reconstrueren.'
      },
      'classroom-random-picker': {
        title: 'Hoe je willekeurige selectietools in de klas gebruikt',
        summary: 'In de klas werkt een willekeurige tool het best wanneer leerlingen de regel begrijpen, het tempo van de les intact blijft en niet steeds dezelfde leerlingen aan de beurt komen.',
        points: [
          'Toon de regel voordat je de tool gebruikt voor spreekbeurten, activiteiten of teams.',
          'Houd elke ronde kort zodat de les niet stilvalt.',
          'Beslis vooraf of eerder gekozen leerlingen later opnieuw mee mogen doen.'
        ],
        usage: 'Gebruik het wheel voor namen, munt of dobbelsteen voor korte activiteiten en de teamgenerator wanneer groepsbalans belangrijk is.'
      },
      'balanced-team-generator': {
        title: 'Wat je moet controleren vóór je een gebalanceerde teamgenerator gebruikt',
        summary: 'Gebalanceerde teams zijn nuttig wanneer niveauverschillen de activiteit zouden verstoren, maar het blijft afhankelijk van actuele en relevante scores.',
        points: [
          'Voor informeel mengen zijn volledig willekeurige teams vaak al genoeg.',
          'Als de kwaliteit van de competitie telt, helpt scoregebaseerde balans meer.',
          'Balans verkleint spreiding, maar garandeert geen identieke sterkte.'
        ],
        usage: 'Wanneer eerlijke teamopstellingen belangrijker zijn dan de ceremonie van het trekken zelf, open dan eerst de teamgenerator.'
      }
    }
  }
};

function escHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function localePrefix(locale) {
  return `/${locale}`;
}

function toolHref(locale, tool) {
  const prefix = localePrefix(locale);
  return tool === 'roulette' ? `${prefix}/` : `${prefix}/${tool}/`;
}

function urlFor(locale, slug) {
  return `https://randomly-pick.com/${locale}/guides/${slug ? `${slug}/` : ''}`;
}

function pagePath(locale, slug) {
  return slug ? `/${locale}/guides/${slug}/` : `/${locale}/guides/`;
}

function englishGuideInner(slug) {
  const file = path.join(ROOT, 'en', 'guides', slug, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/<article>([\s\S]*?)<div class="links">/i);
  if (!match) {
    throw new Error(`Could not extract English guide body for ${slug}`);
  }

  let inner = match[1]
    .replace(/^\s*<p class="meta">[\s\S]*?<\/p>\s*/i, '')
    .replace(/<h1>/i, '<h3 class="ref-title">')
    .replace(/<\/h1>/i, '</h3>')
    .replace(/<h2>/g, '<h4>')
    .replace(/<\/h2>/g, '</h4>');

  return inner.trim();
}

function renderHub(locale, copy) {
  const labels = FOOTER_LABELS[locale];
  const cards = GUIDE_ORDER.map(({ slug }) => {
    const page = copy.pages[slug];
    return `
      <article class="card">
        <h2>${escHtml(page.title)}</h2>
        <p>${escHtml(page.summary)}</p>
        <a class="btn" href="/${locale}/guides/${slug}/">${escHtml(copy.openGuide)}</a>
      </article>`;
  }).join('');

  return `<!doctype html>
<html lang="${locale}"${RTL_LOCALES.has(locale) ? ' dir="rtl"' : ''}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(copy.hubTitle)} | Randomly Pick</title>
  <meta name="description" content="${escHtml(copy.hubSummary)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${urlFor(locale, '')}" />
  <link rel="alternate" hreflang="ko" href="https://randomly-pick.com/guides/" />
  <link rel="alternate" hreflang="en" href="https://randomly-pick.com/en/guides/" />
  <link rel="alternate" hreflang="${locale}" href="${urlFor(locale, '')}" />
  <link rel="alternate" hreflang="x-default" href="https://randomly-pick.com/en/guides/" />
  <link rel="icon" href="/favicon-r.svg" type="image/svg+xml" />
  <style>
    body { margin: 0; font-family: "Noto Sans", "Noto Sans KR", "Noto Sans JP", Arial, sans-serif; background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); color: #0f172a; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 18px 72px; }
    .hero, .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 18px 40px rgba(15,23,42,.06); }
    .hero { padding: 30px 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 22px; }
    .card { padding: 22px; }
    h1 { margin: 12px 0 10px; font-size: clamp(30px, 4vw, 42px); line-height: 1.15; }
    h2 { margin: 0 0 10px; font-size: 22px; }
    p, li { color: #475569; line-height: 1.75; }
    a { color: #111827; }
    .eyebrow { display: inline-flex; padding: 6px 12px; border-radius: 999px; background: #eef2ff; color: #3730a3; font-size: 12px; font-weight: 700; }
    .btn { display: inline-flex; align-items: center; justify-content: center; margin-top: 14px; padding: 10px 14px; border-radius: 999px; border: 1px solid #cbd5e1; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <span class="eyebrow">Randomly Pick Guides</span>
      <h1>${escHtml(copy.hubTitle)}</h1>
      <p>${escHtml(copy.hubSummary)}</p>
      <a class="btn" href="/${locale}/">${escHtml(copy.backHome)}</a>
      <a class="btn" href="/en/guides/">${escHtml(copy.englishGuides)}</a>
    </section>

    <section class="grid">${cards}
    </section>

    <section class="hero" style="margin-top:22px;">
      <span class="eyebrow">Trust</span>
      <h2>${escHtml(copy.trustTitle)}</h2>
      <p>${escHtml(copy.trustBody)}</p>
      <a class="btn" href="/${locale}/about/">${escHtml(labels.about)}</a>
      <a class="btn" href="/${locale}/privacy/">${escHtml(labels.privacy)}</a>
      <a class="btn" href="/${locale}/terms/">${escHtml(labels.terms)}</a>
      <a class="btn" href="/${locale}/contact/">${escHtml(labels.contact)}</a>
    </section>
  </main>
</body>
</html>
`;
}

function renderGuide(locale, copy, slug, index, tool) {
  const labels = FOOTER_LABELS[locale];
  const page = copy.pages[slug];
  const englishRef = englishGuideInner(slug);

  return `<!doctype html>
<html lang="${locale}"${RTL_LOCALES.has(locale) ? ' dir="rtl"' : ''}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(page.title)} | Randomly Pick</title>
  <meta name="description" content="${escHtml(page.summary)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${urlFor(locale, slug)}" />
  <link rel="alternate" hreflang="ko" href="https://randomly-pick.com/guides/${slug}/" />
  <link rel="alternate" hreflang="en" href="https://randomly-pick.com/en/guides/${slug}/" />
  <link rel="alternate" hreflang="${locale}" href="${urlFor(locale, slug)}" />
  <link rel="alternate" hreflang="x-default" href="https://randomly-pick.com/en/guides/${slug}/" />
  <link rel="icon" href="/favicon-r.svg" type="image/svg+xml" />
  <style>
    body { margin: 0; font-family: "Noto Sans", "Noto Sans KR", "Noto Sans JP", Arial, sans-serif; background: #f8fafc; color: #0f172a; }
    main { max-width: 860px; margin: 0 auto; padding: 32px 18px 64px; line-height: 1.8; }
    article { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 30px 24px; box-shadow: 0 16px 36px rgba(15,23,42,.05); }
    h1 { margin: 0 0 12px; font-size: clamp(30px, 4vw, 40px); line-height: 1.18; }
    h2 { margin-top: 28px; font-size: 22px; }
    h3 { margin-top: 24px; font-size: 20px; }
    h4 { margin-top: 20px; font-size: 18px; }
    p, li { color: #475569; }
    .meta { color: #64748b; font-size: 14px; }
    ul { padding-left: 20px; }
    a { color: #111827; }
    .links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 999px; text-decoration: none; font-weight: 700; }
    .panel { margin-top: 22px; padding: 18px 18px; border-radius: 20px; background: #f8fafc; border: 1px solid #e2e8f0; }
    .ref { margin-top: 28px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .ref-title { margin-top: 0; }
  </style>
</head>
<body>
  <main>
    <article>
      <p class="meta">${escHtml(copy.guideWord)} ${index + 1} · 2026-03-18</p>
      <h1>${escHtml(page.title)}</h1>
      <p>${escHtml(page.summary)}</p>

      <section class="panel">
        <h2>${escHtml(copy.localizedSummaryHeading)}</h2>
        <p>${escHtml(copy.hybridNote)}</p>
      </section>

      <h2>${escHtml(copy.keyPointsHeading)}</h2>
      <ul>
        ${page.points.map((point) => `<li>${escHtml(point)}</li>`).join('\n        ')}
      </ul>

      <h2>${escHtml(copy.usageHeading)}</h2>
      <p>${escHtml(page.usage)}</p>

      <section class="ref">
        <h2>${escHtml(copy.englishReferenceHeading)}</h2>
        <p>${escHtml(copy.referenceIntro)}</p>
        ${englishRef}
      </section>

      <div class="links">
        <a class="btn" href="/${locale}/guides/">${escHtml(copy.guideList)}</a>
        <a class="btn" href="${toolHref(locale, tool)}">${escHtml(copy.openTool)}</a>
        <a class="btn" href="/en/guides/${slug}/">${escHtml(copy.englishGuide)}</a>
        <a class="btn" href="/${locale}/about/">${escHtml(labels.about)}</a>
        <a class="btn" href="/${locale}/privacy/">${escHtml(labels.privacy)}</a>
        <a class="btn" href="/${locale}/contact/">${escHtml(labels.contact)}</a>
      </div>
    </article>
  </main>
</body>
</html>
`;
}

let written = 0;
for (const locale of TARGET_LOCALES) {
  const copy = DATA[locale];
  if (!copy) throw new Error(`Missing localized guide data for ${locale}`);

  const hubDir = path.join(ROOT, locale, 'guides');
  fs.mkdirSync(hubDir, { recursive: true });
  fs.writeFileSync(path.join(hubDir, 'index.html'), renderHub(locale, copy));
  written += 1;

  GUIDE_ORDER.forEach(({ slug, tool }, index) => {
    const dir = path.join(hubDir, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderGuide(locale, copy, slug, index, tool));
    written += 1;
  });
}

console.log(`localized guides generated: ${written}`);
