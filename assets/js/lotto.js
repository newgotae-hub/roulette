(function () {
  const { parseEntries, detectLocale, downloadText } = window.RLTUtils;

  const i18n = {
    ko: {
      title: '무작위 번호 추첨기 | 로또·난수·랜덤번호 뽑기 Randomly Pick',
      desc: '무작위 번호 추첨, 난수추첨, 랜덤번호 추첨을 지원하는 Randomly Pick 로또 추첨기. 6/45 기본 모드와 커스텀 명단 추첨, CSV 저장을 제공합니다.',
      ogTitle: '무작위 번호 추첨기 | 로또·난수·랜덤번호 뽑기 Randomly Pick',
      ogDesc: '무작위 번호 추첨, 난수추첨, 랜덤번호 추첨을 지원하는 온라인 로또 추첨기.',
      twTitle: '무작위 번호 추첨기 | 로또·난수·랜덤번호 뽑기 Randomly Pick',
      twDesc: '난수추첨과 랜덤번호 추첨을 빠르게 처리하는 로또 번호 추첨기',
      navSpin: '룰렛돌리기',
      navLotto: '로또추첨기',
      navHistory: '사다리타기',
      navCoin: '코인던지기',
      navDice: '주사위굴리기',
      navGuide: '가이드',
      fullscreenHint: '전체화면을 눌러주세요!',
      fullscreen: '전체화면',
      fullscreenExit: '화면해제',
      heroTitle: '로또 번호 추첨기',
      heroTitleCustom: '랜덤 추첨기',
      heroSubtitle: '빠르고 부드러운 애니메이션, 기본 로또 번호부터 명단 입력까지 지원합니다.',
      tabBasic: '기본 설정',
      tabCustom: '직접 입력',
      labelTotalBalls: '전체 공 개수 (1~100)',
      labelDrawCount: '뽑을 개수',
      labelCustomDrawCount: '뽑을 개수',
      customPlaceholder: '이름이나 번호를 입력하세요. 줄바꿈, 쉼표, 공백 자동 인식',
      labelAllowDup: '중복 추첨 허용',
      labelSound: '효과음 재생',
      labelSpeed: '추첨 속도',
      speed1: '느림', speed2: '보통', speed3: '빠름',
      btnQuick: '애니메이션 스킵 (빠른 추첨)',
      btnDraw: '추첨 시작',
      statusReady: '설정을 확인하고 추첨 시작을 누르세요.',
      statusDrawing: '추첨이 진행 중입니다...',
      statusDone: '추첨이 완료되었습니다.',
      statusErrorNum: '입력값을 확인해주세요.',
      resultTitle: '이번 추첨 결과',
      sortOrder: '추첨순',
      sortAsc: '오름차순',
      btnCopy: '결과 복사',
      historyTitle: '추첨 기록',
      btnExport: 'CSV 저장',
      historyEmpty: '아직 기록이 없습니다.',
      guideTitle: '자주 묻는 질문',
      faq1Q: '원하는 번호나 이름을 넣을 수 있나요?',
      faq1A: '네. 직접 입력 탭을 선택하고 공백, 쉼표, 줄바꿈 등으로 구분된 항목을 입력하면 해당 명단으로 추첨이 진행됩니다.',
      faq2Q: '결과를 오름차순으로 볼 수 있나요?',
      faq2A: '결과 패널의 오름차순 버튼을 누르면 정렬되어 표시됩니다.',
      faq3Q: '추첨 기록은 어떻게 저장하나요?',
      faq3A: '추첨 기록 패널 상단의 CSV 저장 버튼을 누르면 파일로 내려받을 수 있습니다.',
      faq4Q: '입력 데이터는 안전한가요?',
      faq4A: '입력 데이터는 브라우저 내부에서만 처리되며 외부 서버로 전송되거나 저장되지 않습니다.',
      footerTerms: '이용약관',
      footerPrivacy: '개인정보처리방침',
      copied: '복사되었습니다!',
      noCopy: '복사할 결과가 없습니다.'
    },
    en: {
      title: 'Random Number Generator & Lucky Draw | Randomly Pick',
      desc: 'Free random number generator and lucky draw tool with smooth animation, custom list picks, and CSV export.',
      ogTitle: 'Random Number Generator & Lucky Draw | Randomly Pick',
      ogDesc: 'Generate random numbers, run lucky draws, and pick winners from custom lists instantly.',
      twTitle: 'Random Number Generator & Lucky Draw | Randomly Pick',
      twDesc: 'Run random number picks and lucky draws with fast animation and export.',
      navSpin: 'Wheel of Names',
      navLotto: 'Lucky Draw',
      navHistory: 'Ladder Draw',
      navCoin: 'Coin Flip',
      navDice: 'Dice Roll',
      navGuide: 'Guide',
      fullscreenHint: 'Tap Fullscreen for focus mode.',
      fullscreen: 'Fullscreen',
      fullscreenExit: 'Exit Full',
      heroTitle: 'Random Name Picker',
      heroTitleCustom: 'Random Ball Draw',
      heroSubtitle: 'Random Name Picker with smooth animation for giveaways, classrooms, team picks, and instant custom list draws.',
      tabBasic: 'Basic',
      tabCustom: 'Custom List',
      labelTotalBalls: 'Total Balls (1~100)',
      labelDrawCount: 'Draw Count',
      labelCustomDrawCount: 'Draw Count',
      customPlaceholder: 'Enter names or items. New lines, commas, and spaces are detected automatically.',
      labelAllowDup: 'Allow Duplicates',
      labelSound: 'Sound Effects',
      labelSpeed: 'Speed',
      speed1: 'Slow', speed2: 'Normal', speed3: 'Fast',
      btnQuick: 'Skip Animation (Quick Draw)',
      btnDraw: 'Start Draw',
      statusReady: 'Check settings and press Start.',
      statusDrawing: 'Drawing in progress...',
      statusDone: 'Draw complete.',
      statusErrorNum: 'Check input values.',
      resultTitle: 'Current Result',
      sortOrder: 'Order',
      sortAsc: 'Ascending',
      btnCopy: 'Copy',
      historyTitle: 'Draw History',
      btnExport: 'Export CSV',
      historyEmpty: 'No history yet.',
      guideTitle: 'FAQ',
      faq1Q: 'Can I use custom names or numbers?',
      faq1A: 'Yes. Select Custom List and enter items separated by spaces, commas, tabs, or line breaks.',
      faq2Q: 'Can I sort the results?',
      faq2A: 'Yes. Use Ascending to sort results numerically or alphabetically.',
      faq3Q: 'How do I save the history?',
      faq3A: 'Click Export CSV to download all draw sets as a spreadsheet file.',
      faq4Q: 'Is my data safe?',
      faq4A: 'Yes. All processing is local in your browser. No input is sent to external servers.',
      footerTerms: 'Terms',
      footerPrivacy: 'Privacy',
      copied: 'Copied!',
      noCopy: 'Nothing to copy.'
    }
  };
  i18n.ja = {
    ...i18n.en,
    title: 'ランダム抽選ツール | 数字・名前のオンライン抽選',
    desc: '数字抽選と名前抽選をすばやく実行。アニメーション抽選、履歴保存、CSV出力に対応。',
    ogTitle: 'ランダム抽選ツール | 数字・名前のオンライン抽選',
    ogDesc: '数字や名前をランダム抽選して、そのまま履歴管理できる抽選ツール。',
    twTitle: 'ランダム抽選ツール | 数字・名前のオンライン抽選',
    twDesc: '数字抽選・名前抽選を高速に実行し、結果を保存できます。',
    navSpin: 'ルーレット',
    navLotto: 'ラッキードロー',
    navHistory: 'あみだくじ',
    navCoin: 'コイントス',
    navDice: 'サイコロ',
    navGuide: 'ガイド',
    fullscreenHint: '集中モードは全画面を押してください。',
    fullscreen: '全画面',
    fullscreenExit: '終了',
    heroTitle: 'ランダム抽選ツール',
    heroTitleCustom: 'カスタム抽選',
    heroSubtitle: '数字・名前をスムーズに抽選して、結果をすぐに確認できます。',
    tabBasic: '基本設定',
    tabCustom: '直接入力',
    labelTotalBalls: '全体数 (1~100)',
    labelDrawCount: '抽選数',
    labelCustomDrawCount: '抽選数',
    customPlaceholder: '名前または項目を入力。改行・カンマ・空白を自動認識します。',
    labelAllowDup: '重複抽選を許可',
    labelSound: '効果音',
    labelSpeed: '抽選速度',
    speed1: '遅い', speed2: '標準', speed3: '速い',
    btnQuick: 'アニメーション省略（高速抽選）',
    btnDraw: '抽選開始',
    statusReady: '設定を確認して抽選開始を押してください。',
    statusDrawing: '抽選中です...',
    statusDone: '抽選が完了しました。',
    statusErrorNum: '入力値を確認してください。',
    resultTitle: '今回の結果',
    sortOrder: '抽選順',
    sortAsc: '昇順',
    btnCopy: 'コピー',
    historyTitle: '抽選履歴',
    btnExport: 'CSV保存',
    historyEmpty: '履歴がありません。',
    guideTitle: 'よくある質問',
    faq1Q: '任意の名前や番号で抽選できますか？',
    faq1A: 'はい。直接入力タブで改行・空白・カンマ区切りの項目を抽選できます。',
    faq2Q: '結果を並び替えできますか？',
    faq2A: '昇順ボタンで数値/文字順に並び替えられます。',
    faq3Q: '履歴は保存できますか？',
    faq3A: 'CSV保存ボタンで抽選履歴をファイルとして保存できます。',
    faq4Q: '入力データは安全ですか？',
    faq4A: 'すべてブラウザ内で処理され、外部サーバーに送信されません。',
    footerTerms: '利用規約',
    footerPrivacy: 'プライバシー',
    copied: 'コピーしました！',
    noCopy: 'コピーできる結果がありません。'
  };
  i18n["zh-cn"] = {
    ...i18n.en,
    title: '随机抽签工具 | 数字与名单抽取',
    desc: '免费随机抽签工具，支持顺滑动画、自定义名单抽取和 CSV 导出。',
    ogTitle: '随机抽签工具 | 数字与名单抽取',
    ogDesc: '快速随机抽取数字或名单，并保存历史记录。',
    twTitle: '随机抽签工具 | 数字与名单抽取',
    twDesc: '快速进行数字与名单抽签，支持结果导出。',
    navSpin: '转盘',
    navLotto: '幸运抽签',
    navHistory: '爬梯抽签',
    navCoin: '抛硬币',
    navDice: '掷骰子',
    navGuide: '指南',
    fullscreenHint: '点击全屏进入专注模式。',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    heroTitle: '随机抽签',
    heroTitleCustom: '自定义名单抽签',
    heroSubtitle: '适用于活动抽奖、课堂点名、分组选择的随机抽签工具。',
    tabBasic: '基础设置',
    tabCustom: '自定义名单',
    labelTotalBalls: '总球数 (1~100)',
    labelDrawCount: '抽取数量',
    labelCustomDrawCount: '抽取数量',
    customPlaceholder: '请输入姓名或项目。自动识别换行、逗号和空格。',
    labelAllowDup: '允许重复抽取',
    labelSound: '音效',
    labelSpeed: '速度',
    speed1: '慢',
    speed2: '标准',
    speed3: '快',
    btnQuick: '跳过动画（快速抽签）',
    btnDraw: '开始抽签',
    statusReady: '请检查设置后点击开始。',
    statusDrawing: '正在抽签...',
    statusDone: '抽签完成。',
    statusErrorNum: '请检查输入值。',
    resultTitle: '本次结果',
    sortOrder: '抽取顺序',
    sortAsc: '升序',
    btnCopy: '复制',
    historyTitle: '抽签记录',
    btnExport: '导出 CSV',
    historyEmpty: '暂无记录。',
    guideTitle: '常见问题',
    faq1Q: '可以用自定义名字或数字吗？',
    faq1A: '可以。在自定义名单中，使用空格、逗号、制表符或换行分隔项目即可抽取。',
    faq2Q: '可以排序结果吗？',
    faq2A: '可以。点击升序可按数字或字母顺序排列结果。',
    faq3Q: '如何保存抽签记录？',
    faq3A: '点击导出 CSV，可下载全部抽签结果。',
    faq4Q: '输入数据安全吗？',
    faq4A: '安全。所有处理都在你的浏览器本地完成，不会上传到外部服务器。',
    footerTerms: '使用条款',
    footerPrivacy: '隐私政策',
    copied: '已复制！',
    noCopy: '没有可复制的结果。'
  };
  i18n["zh-tw"] = {
    ...i18n.en,
    title: '隨機抽籤工具 | 數字與名單抽取',
    desc: '免費隨機抽籤工具，支援流暢動畫、自訂名單抽取與 CSV 匯出。',
    ogTitle: '隨機抽籤工具 | 數字與名單抽取',
    ogDesc: '快速隨機抽出數字或名單，並保存歷史紀錄。',
    twTitle: '隨機抽籤工具 | 數字與名單抽取',
    twDesc: '快速進行數字與名單抽籤，支援結果匯出。',
    navSpin: '轉盤',
    navLotto: '幸運抽籤',
    navHistory: '爬梯抽籤',
    navCoin: '擲硬幣',
    navDice: '擲骰子',
    navGuide: '指南',
    fullscreenHint: '點擊全螢幕進入專注模式。',
    fullscreen: '全螢幕',
    fullscreenExit: '離開全螢幕',
    heroTitle: '隨機抽籤',
    heroTitleCustom: '自訂名單抽籤',
    heroSubtitle: '適用於抽籤活動、課堂點名、分組挑選的隨機抽籤工具。',
    tabBasic: '基本設定',
    tabCustom: '自訂名單',
    labelTotalBalls: '總球數 (1~100)',
    labelDrawCount: '抽取數量',
    labelCustomDrawCount: '抽取數量',
    customPlaceholder: '請輸入姓名或項目。自動辨識換行、逗號與空白。',
    labelAllowDup: '允許重複抽取',
    labelSound: '音效',
    labelSpeed: '速度',
    speed1: '慢',
    speed2: '標準',
    speed3: '快',
    btnQuick: '略過動畫（快速抽籤）',
    btnDraw: '開始抽籤',
    statusReady: '請確認設定後點擊開始。',
    statusDrawing: '抽籤進行中...',
    statusDone: '抽籤完成。',
    statusErrorNum: '請檢查輸入值。',
    resultTitle: '本次結果',
    sortOrder: '抽取順序',
    sortAsc: '遞增',
    btnCopy: '複製',
    historyTitle: '抽籤紀錄',
    btnExport: '匯出 CSV',
    historyEmpty: '尚無紀錄。',
    guideTitle: '常見問題',
    faq1Q: '可以使用自訂名字或數字嗎？',
    faq1A: '可以。在自訂名單中，以空白、逗號、Tab 或換行分隔項目即可抽取。',
    faq2Q: '可以排序結果嗎？',
    faq2A: '可以。點擊遞增可依數字或字母順序排列結果。',
    faq3Q: '如何保存抽籤紀錄？',
    faq3A: '點擊匯出 CSV，可下載全部抽籤結果。',
    faq4Q: '輸入資料安全嗎？',
    faq4A: '安全。所有處理都在你的瀏覽器本地完成，不會傳送到外部伺服器。',
    footerTerms: '使用條款',
    footerPrivacy: '隱私權政策',
    copied: '已複製！',
    noCopy: '沒有可複製的結果。'
  };
                i18n.es = {
          ...i18n.en,
          title: 'Sorteador Aleatorio | Números y Nombres',
          desc: 'Sorteador aleatorio gratis con animación fluida, lista personalizada y exportación CSV.',
          ogTitle: 'Sorteador Aleatorio | Números y Nombres',
          ogDesc: 'Genera números o nombres al azar y guarda el historial de resultados.',
          twTitle: 'Sorteador Aleatorio | Números y Nombres',
          twDesc: 'Sortea números y nombres rápidamente con exportación.',
          navSpin: 'Ruleta',
          navLotto: 'Sorteo',
          navHistory: 'Escalera',
          navCoin: 'Moneda',
          navDice: 'Dados',
          navGuide: 'Guía',
          fullscreenHint: 'Pulsa pantalla completa para modo enfoque.',
          fullscreen: 'Pantalla completa',
          fullscreenExit: 'Salir de pantalla completa',
          heroTitle: 'Sorteo Aleatorio',
          heroTitleCustom: 'Sorteo de Lista',
          heroSubtitle: 'Extrae números o nombres en segundos con animación suave.',
          tabBasic: 'Básico',
          tabCustom: 'Lista personalizada',
          labelTotalBalls: 'Total de bolas (1~100)',
          labelDrawCount: 'Cantidad a sortear',
          labelCustomDrawCount: 'Cantidad a sortear',
          customPlaceholder: 'Ingresa nombres o elementos. Se detectan saltos de línea, comas y espacios automáticamente.',
          labelAllowDup: 'Permitir duplicados',
          labelSound: 'Efectos de sonido',
          labelSpeed: 'Velocidad',
          speed1: 'Lento',
          speed2: 'Normal',
          speed3: 'Rápido',
          btnQuick: 'Saltar animación (sorteo rápido)',
          btnDraw: 'Iniciar sorteo',
          statusReady: 'Revisa la configuración y pulsa iniciar.',
          statusDrawing: 'Sorteando...',
          statusDone: 'Sorteo completado.',
          statusErrorNum: 'Revisa los valores ingresados.',
          resultTitle: 'Resultado actual',
          sortOrder: 'Orden',
          sortAsc: 'Ascendente',
          btnCopy: 'Copiar',
          historyTitle: 'Historial',
          btnExport: 'Exportar CSV',
          historyEmpty: 'Aún no hay historial.',
          guideTitle: 'FAQ',
          faq1Q: '¿Puedo usar nombres o números personalizados?',
          faq1A: 'Sí. En Lista personalizada, separa elementos por espacios, comas, tabulaciones o saltos de línea.',
          faq2Q: '¿Puedo ordenar los resultados?',
          faq2A: 'Sí. Usa Ascendente para ordenar alfabética o numéricamente.',
          faq3Q: '¿Cómo guardo el historial?',
          faq3A: 'Pulsa Exportar CSV para descargar todos los sorteos.',
          faq4Q: '¿Mis datos están seguros?',
          faq4A: 'Sí. Todo se procesa localmente en tu navegador.',
          footerTerms: 'Términos',
          footerPrivacy: 'Privacidad',
          copied: '¡Copiado!',
          noCopy: 'No hay resultados para copiar.'
        };
                i18n.fr = {
          ...i18n.en,
          title: 'Tirage Aléatoire | Nombres et Noms',
          desc: 'Outil de tirage aléatoire gratuit avec animation fluide, liste personnalisée et export CSV.',
          ogTitle: 'Tirage Aléatoire | Nombres et Noms',
          ogDesc: 'Tirez des numéros ou des noms aléatoirement et conservez l’historique.',
          twTitle: 'Tirage Aléatoire | Nombres et Noms',
          twDesc: 'Tirage rapide de numéros et noms avec export.',
          navSpin: 'Roulette',
          navLotto: 'Tirage',
          navHistory: 'Échelle',
          navCoin: 'Pile ou Face',
          navDice: 'Dés',
          navGuide: 'Guide',
          fullscreenHint: 'Appuyez sur plein écran pour le mode focus.',
          fullscreen: 'Plein écran',
          fullscreenExit: 'Quitter le plein écran',
          heroTitle: 'Tirage Aléatoire',
          heroTitleCustom: 'Tirage Liste Personnalisée',
          heroSubtitle: 'Tirez des numéros ou des noms en quelques secondes.',
          tabBasic: 'Base',
          tabCustom: 'Liste personnalisée',
          labelTotalBalls: 'Total de boules (1~100)',
          labelDrawCount: 'Nombre de tirages',
          labelCustomDrawCount: 'Nombre de tirages',
          customPlaceholder: 'Entrez des noms ou des éléments. Les retours à la ligne, virgules et espaces sont détectés automatiquement.',
          labelAllowDup: 'Autoriser les doublons',
          labelSound: 'Effets sonores',
          labelSpeed: 'Vitesse',
          speed1: 'Lent',
          speed2: 'Normal',
          speed3: 'Rapide',
          btnQuick: 'Ignorer l\'animation (tirage rapide)',
          btnDraw: 'Lancer le tirage',
          statusReady: 'Vérifiez les paramètres puis lancez le tirage.',
          statusDrawing: 'Tirage en cours...',
          statusDone: 'Tirage terminé.',
          statusErrorNum: 'Vérifiez les valeurs saisies.',
          resultTitle: 'Résultat actuel',
          sortOrder: 'Ordre',
          sortAsc: 'Croissant',
          btnCopy: 'Copier',
          historyTitle: 'Historique',
          btnExport: 'Exporter CSV',
          historyEmpty: 'Aucun historique pour le moment.',
          guideTitle: 'FAQ',
          faq1Q: 'Puis-je utiliser des noms ou numéros personnalisés ?',
          faq1A: 'Oui. Dans Liste personnalisée, séparez les éléments par espaces, virgules, tabulations ou retours ligne.',
          faq2Q: 'Puis-je trier les résultats ?',
          faq2A: 'Oui. Utilisez Croissant pour trier par ordre alphabétique ou numérique.',
          faq3Q: 'Comment enregistrer l\'historique ?',
          faq3A: 'Cliquez sur Exporter CSV pour télécharger l\'ensemble des tirages.',
          faq4Q: 'Mes données sont-elles sécurisées ?',
          faq4A: 'Oui. Le traitement se fait localement dans votre navigateur.',
          footerTerms: 'Conditions',
          footerPrivacy: 'Confidentialité',
          copied: 'Copié !',
          noCopy: 'Aucun résultat à copier.'
        };
                i18n.de = {
          ...i18n.en,
          title: 'Zufallsziehung | Zahlen und Namen',
          desc: 'Kostenloses Zufallsziehungs-Tool mit sanfter Animation, benutzerdefinierter Liste und CSV-Export.',
          ogTitle: 'Zufallsziehung | Zahlen und Namen',
          ogDesc: 'Zahlen oder Namen zufällig ziehen und Verlauf speichern.',
          twTitle: 'Zufallsziehung | Zahlen und Namen',
          twDesc: 'Schnelle Ziehung von Zahlen und Namen mit Export.',
          navSpin: 'Rad',
          navLotto: 'Auslosung',
          navHistory: 'Leiter',
          navCoin: 'Münzwurf',
          navDice: 'Würfel',
          navGuide: 'Anleitung',
          fullscreenHint: 'Für Fokusmodus Vollbild antippen.',
          fullscreen: 'Vollbild',
          fullscreenExit: 'Vollbild beenden',
          heroTitle: 'Zufallsziehung',
          heroTitleCustom: 'Benutzerdefinierte Ziehung',
          heroSubtitle: 'Ziehe Zahlen oder Namen in Sekunden mit weicher Animation.',
          tabBasic: 'Basis',
          tabCustom: 'Benutzerliste',
          labelTotalBalls: 'Gesamtzahl Kugeln (1~100)',
          labelDrawCount: 'Anzahl Ziehungen',
          labelCustomDrawCount: 'Anzahl Ziehungen',
          customPlaceholder: 'Namen oder Einträge eingeben. Zeilenumbrüche, Kommas und Leerzeichen werden automatisch erkannt.',
          labelAllowDup: 'Duplikate erlauben',
          labelSound: 'Soundeffekte',
          labelSpeed: 'Geschwindigkeit',
          speed1: 'Langsam',
          speed2: 'Normal',
          speed3: 'Schnell',
          btnQuick: 'Animation überspringen (Schnellziehung)',
          btnDraw: 'Ziehung starten',
          statusReady: 'Einstellungen prüfen und Start drücken.',
          statusDrawing: 'Ziehung läuft...',
          statusDone: 'Ziehung abgeschlossen.',
          statusErrorNum: 'Eingabewerte prüfen.',
          resultTitle: 'Aktuelles Ergebnis',
          sortOrder: 'Reihenfolge',
          sortAsc: 'Aufsteigend',
          btnCopy: 'Kopieren',
          historyTitle: 'Verlauf',
          btnExport: 'CSV exportieren',
          historyEmpty: 'Noch kein Verlauf.',
          guideTitle: 'FAQ',
          faq1Q: 'Kann ich eigene Namen oder Zahlen verwenden?',
          faq1A: 'Ja. In der benutzerdefinierten Liste Elemente per Leerzeichen, Komma, Tab oder Zeilenumbruch trennen.',
          faq2Q: 'Kann ich Ergebnisse sortieren?',
          faq2A: 'Ja. Mit Aufsteigend alphabetisch oder numerisch sortieren.',
          faq3Q: 'Wie speichere ich den Verlauf?',
          faq3A: 'Auf CSV exportieren klicken, um alle Ziehungen herunterzuladen.',
          faq4Q: 'Sind meine Daten sicher?',
          faq4A: 'Ja. Alles wird lokal im Browser verarbeitet.',
          footerTerms: 'Nutzungsbedingungen',
          footerPrivacy: 'Datenschutz',
          copied: 'Kopiert!',
          noCopy: 'Keine Ergebnisse zum Kopieren.'
        };
    i18n['pt-br'] = {
    ...i18n.en,
    title: 'Sorteador Aleatório | Números e Nomes',
    desc: 'Ferramenta gratuita de sorteio aleatório com animação fluida, lista personalizada e exportação CSV.',
    ogTitle: 'Sorteador Aleatório | Números e Nomes',
    ogDesc: 'Sorteie números ou nomes rapidamente e salve o histórico.',
    twTitle: 'Sorteador Aleatório | Números e Nomes',
    twDesc: 'Sorteio rápido de números e nomes com exportação.',
    navSpin: 'Roleta',
    navLotto: 'Sorteio',
    navHistory: 'Escada',
          navCoin: 'Moeda',
    navDice: 'Dados',
    navGuide: 'Guia',
    heroTitle: 'Sorteio Aleatório',
    heroTitleCustom: 'Sorteio com Lista',
    heroSubtitle: 'Sorteie números ou nomes em segundos com animação suave.',
    tabBasic: 'Básico',
    tabCustom: 'Lista personalizada',
    btnDraw: 'Iniciar sorteio',
    historyTitle: 'Histórico',
    guideTitle: 'FAQ',
    footerTerms: 'Termos',
    footerPrivacy: 'Privacidade'
  };
                i18n.hi = {
          ...i18n.en,
          title: 'रैंडम ड्रॉ टूल | नंबर और नाम चयन',
          desc: 'मुफ्त रैंडम ड्रॉ टूल जिसमें स्मूथ एनीमेशन, कस्टम सूची और CSV एक्सपोर्ट शामिल है।',
          ogTitle: 'रैंडम ड्रॉ टूल | नंबर और नाम चयन',
          ogDesc: 'नंबर या नाम तुरंत चुनें और हिस्ट्री सेव करें।',
          twTitle: 'रैंडम ड्रॉ टूल | नंबर और नाम चयन',
          twDesc: 'तेज़ नंबर और नाम ड्रॉ के लिए ऑनलाइन टूल।',
          navSpin: 'रूलेट',
          navLotto: 'ड्रॉ',
          navHistory: 'लैडर',
          navCoin: 'कॉइन',
          navDice: 'डाइस',
          navGuide: 'गाइड',
          fullscreenHint: 'फोकस मोड के लिए फुलस्क्रीन दबाएं।',
          fullscreen: 'फुलस्क्रीन',
          fullscreenExit: 'फुलस्क्रीन बंद करें',
          heroTitle: 'रैंडम ड्रॉ',
          heroTitleCustom: 'कस्टम सूची ड्रॉ',
          heroSubtitle: 'स्मूथ एनीमेशन के साथ नंबर या नाम जल्दी चुनें।',
          tabBasic: 'बेसिक',
          tabCustom: 'कस्टम सूची',
          labelTotalBalls: 'कुल बॉल (1~100)',
          labelDrawCount: 'ड्रॉ संख्या',
          labelCustomDrawCount: 'ड्रॉ संख्या',
          customPlaceholder: 'नाम या आइटम दर्ज करें। नई पंक्ति, कॉमा और स्पेस अपने आप पहचाने जाते हैं।',
          labelAllowDup: 'डुप्लिकेट अनुमति दें',
          labelSound: 'साउंड इफेक्ट',
          labelSpeed: 'स्पीड',
          speed1: 'धीमा',
          speed2: 'सामान्य',
          speed3: 'तेज़',
          btnQuick: 'एनीमेशन छोड़ें (क्विक ड्रॉ)',
          btnDraw: 'ड्रॉ शुरू करें',
          statusReady: 'सेटिंग जांचें और शुरू करें दबाएं।',
          statusDrawing: 'ड्रॉ जारी है...',
          statusDone: 'ड्रॉ पूरा हुआ।',
          statusErrorNum: 'इनपुट मान जांचें।',
          resultTitle: 'वर्तमान परिणाम',
          sortOrder: 'क्रम',
          sortAsc: 'आरोही',
          btnCopy: 'कॉपी',
          historyTitle: 'इतिहास',
          btnExport: 'CSV निर्यात',
          historyEmpty: 'अभी कोई हिस्ट्री नहीं।',
          guideTitle: 'सामान्य प्रश्न',
          faq1Q: 'क्या मैं कस्टम नाम या नंबर उपयोग कर सकता हूँ?',
          faq1A: 'हाँ। कस्टम सूची में आइटम स्पेस, कॉमा, टैब या नई पंक्ति से अलग करें।',
          faq2Q: 'क्या परिणाम क्रमबद्ध कर सकता हूँ?',
          faq2A: 'हाँ। आरोही चुनकर संख्या या टेक्स्ट क्रम देखें।',
          faq3Q: 'हिस्ट्री कैसे सेव करूँ?',
          faq3A: 'CSV निर्यात दबाकर सभी ड्रॉ डाउनलोड करें।',
          faq4Q: 'क्या मेरा डेटा सुरक्षित है?',
          faq4A: 'हाँ। सारा प्रोसेस आपके ब्राउज़र में लोकली होता है।',
          footerTerms: 'नियम',
          footerPrivacy: 'गोपनीयता',
          copied: 'कॉपी हो गया!',
          noCopy: 'कॉपी करने के लिए कुछ नहीं।'
        };
                i18n.ar = {
          ...i18n.en,
          title: 'مولد أرقام عشوائي | سحب سريع أونلاين',
          desc: 'أداة سحب عشوائي مجانية مع حركة سلسة وقائمة مخصصة وتصدير CSV.',
          ogTitle: 'مولد أرقام عشوائي | سحب سريع أونلاين',
          ogDesc: 'اسحب الأرقام أو الأسماء بسرعة واحفظ السجل.',
          twTitle: 'مولد أرقام عشوائي | سحب سريع أونلاين',
          twDesc: 'سحب أرقام وأسماء بسرعة مع حفظ النتائج.',
          navSpin: 'العجلة',
          navLotto: 'السحب',
          navHistory: 'السلم',
          navCoin: 'العملة',
          navDice: 'النرد',
          navGuide: 'الدليل',
          fullscreenHint: 'اضغط ملء الشاشة لوضع التركيز.',
          fullscreen: 'ملء الشاشة',
          fullscreenExit: 'إنهاء ملء الشاشة',
          heroTitle: 'سحب عشوائي',
          heroTitleCustom: 'سحب من قائمة مخصصة',
          heroSubtitle: 'سحب أرقام أو أسماء بسرعة مع حفظ النتائج.',
          tabBasic: 'أساسي',
          tabCustom: 'قائمة مخصصة',
          labelTotalBalls: 'إجمالي الكرات (1~100)',
          labelDrawCount: 'عدد السحوبات',
          labelCustomDrawCount: 'عدد السحوبات',
          customPlaceholder: 'أدخل أسماء أو عناصر. يتم اكتشاف السطر الجديد والفاصلة والمسافة تلقائيًا.',
          labelAllowDup: 'السماح بالتكرار',
          labelSound: 'المؤثرات الصوتية',
          labelSpeed: 'السرعة',
          speed1: 'بطيء',
          speed2: 'عادي',
          speed3: 'سريع',
          btnQuick: 'تخطي الحركة (سحب سريع)',
          btnDraw: 'ابدأ السحب',
          statusReady: 'تحقق من الإعدادات ثم اضغط بدء.',
          statusDrawing: 'جارٍ السحب...',
          statusDone: 'اكتمل السحب.',
          statusErrorNum: 'تحقق من القيم المدخلة.',
          resultTitle: 'النتيجة الحالية',
          sortOrder: 'الترتيب',
          sortAsc: 'تصاعدي',
          btnCopy: 'نسخ',
          historyTitle: 'السجل',
          btnExport: 'تصدير CSV',
          historyEmpty: 'لا يوجد سجل بعد.',
          guideTitle: 'الأسئلة الشائعة',
          faq1Q: 'هل يمكنني استخدام أسماء أو أرقام مخصصة؟',
          faq1A: 'نعم. في القائمة المخصصة، افصل العناصر بمسافة أو فاصلة أو تبويب أو سطر جديد.',
          faq2Q: 'هل يمكنني ترتيب النتائج؟',
          faq2A: 'نعم. استخدم تصاعدي لفرز النتائج نصيًا أو رقميًا.',
          faq3Q: 'كيف أحفظ السجل؟',
          faq3A: 'اضغط تصدير CSV لتنزيل جميع السحوبات.',
          faq4Q: 'هل بياناتي آمنة؟',
          faq4A: 'نعم. كل المعالجة تتم محليًا داخل متصفحك.',
          footerTerms: 'الشروط',
          footerPrivacy: 'الخصوصية',
          copied: 'تم النسخ!',
          noCopy: 'لا توجد نتائج للنسخ.'
        };
                i18n.ru = {
          ...i18n.en,
          title: 'Генератор Случайных Чисел | Быстрый Розыгрыш',
          desc: 'Бесплатный инструмент случайной жеребьевки с плавной анимацией, пользовательским списком и экспортом CSV.',
          ogTitle: 'Генератор Случайных Чисел | Быстрый Розыгрыш',
          ogDesc: 'Быстро выбирайте числа или имена и сохраняйте историю.',
          twTitle: 'Генератор Случайных Чисел | Быстрый Розыгрыш',
          twDesc: 'Быстрый розыгрыш чисел и имен с сохранением результатов.',
          navSpin: 'Колесо',
          navLotto: 'Розыгрыш',
          navHistory: 'Лестница',
          navCoin: 'Монета',
          navDice: 'Кости',
          navGuide: 'Гид',
          fullscreenHint: 'Нажмите полноэкранный режим для фокуса.',
          fullscreen: 'Полный экран',
          fullscreenExit: 'Выйти из полного экрана',
          heroTitle: 'Случайный Розыгрыш',
          heroTitleCustom: 'Розыгрыш по списку',
          heroSubtitle: 'Быстрый выбор чисел или имен с сохранением истории.',
          tabBasic: 'Базовый',
          tabCustom: 'Свой список',
          labelTotalBalls: 'Всего шаров (1~100)',
          labelDrawCount: 'Количество выборов',
          labelCustomDrawCount: 'Количество выборов',
          customPlaceholder: 'Введите имена или элементы. Переносы строк, запятые и пробелы распознаются автоматически.',
          labelAllowDup: 'Разрешить дубликаты',
          labelSound: 'Звуковые эффекты',
          labelSpeed: 'Скорость',
          speed1: 'Медленно',
          speed2: 'Нормально',
          speed3: 'Быстро',
          btnQuick: 'Пропустить анимацию (быстрый розыгрыш)',
          btnDraw: 'Начать розыгрыш',
          statusReady: 'Проверьте настройки и нажмите старт.',
          statusDrawing: 'Розыгрыш идет...',
          statusDone: 'Розыгрыш завершен.',
          statusErrorNum: 'Проверьте введенные значения.',
          resultTitle: 'Текущий результат',
          sortOrder: 'Порядок',
          sortAsc: 'По возрастанию',
          btnCopy: 'Копировать',
          historyTitle: 'История',
          btnExport: 'Экспорт CSV',
          historyEmpty: 'История пока пуста.',
          guideTitle: 'FAQ',
          faq1Q: 'Можно использовать свои имена или числа?',
          faq1A: 'Да. В режиме списка разделяйте элементы пробелами, запятыми, табами или переносами строк.',
          faq2Q: 'Можно отсортировать результаты?',
          faq2A: 'Да. Выберите По возрастанию для сортировки по алфавиту или числам.',
          faq3Q: 'Как сохранить историю?',
          faq3A: 'Нажмите Экспорт CSV, чтобы скачать все наборы результатов.',
          faq4Q: 'Мои данные в безопасности?',
          faq4A: 'Да. Обработка выполняется локально в браузере.',
          footerTerms: 'Условия',
          footerPrivacy: 'Конфиденциальность',
          copied: 'Скопировано!',
          noCopy: 'Нет данных для копирования.'
        };
                i18n.id = {
          ...i18n.en,
          title: 'Generator Angka Acak | Lucky Draw Online',
          desc: 'Alat undian acak gratis dengan animasi halus, daftar kustom, dan ekspor CSV.',
          ogTitle: 'Generator Angka Acak | Lucky Draw Online',
          ogDesc: 'Pilih angka atau nama secara acak dan simpan riwayat hasil.',
          twTitle: 'Generator Angka Acak | Lucky Draw Online',
          twDesc: 'Undian angka dan nama cepat dengan fitur ekspor.',
          navSpin: 'Roda',
          navLotto: 'Undian',
          navHistory: 'Tangga',
          navCoin: 'Koin',
          navDice: 'Dadu',
          navGuide: 'Panduan',
          fullscreenHint: 'Ketuk layar penuh untuk mode fokus.',
          fullscreen: 'Layar penuh',
          fullscreenExit: 'Keluar layar penuh',
          heroTitle: 'Undian Acak',
          heroTitleCustom: 'Undian Daftar Kustom',
          heroSubtitle: 'Tarik angka atau nama dengan cepat dan simpan hasil.',
          tabBasic: 'Dasar',
          tabCustom: 'Daftar kustom',
          labelTotalBalls: 'Total bola (1~100)',
          labelDrawCount: 'Jumlah undian',
          labelCustomDrawCount: 'Jumlah undian',
          customPlaceholder: 'Masukkan nama atau item. Baris baru, koma, dan spasi terdeteksi otomatis.',
          labelAllowDup: 'Izinkan duplikat',
          labelSound: 'Efek suara',
          labelSpeed: 'Kecepatan',
          speed1: 'Lambat',
          speed2: 'Normal',
          speed3: 'Cepat',
          btnQuick: 'Lewati animasi (undian cepat)',
          btnDraw: 'Mulai Undian',
          statusReady: 'Periksa pengaturan lalu tekan mulai.',
          statusDrawing: 'Sedang mengundi...',
          statusDone: 'Undian selesai.',
          statusErrorNum: 'Periksa nilai input.',
          resultTitle: 'Hasil saat ini',
          sortOrder: 'Urutan',
          sortAsc: 'Naik',
          btnCopy: 'Salin',
          historyTitle: 'Riwayat',
          btnExport: 'Ekspor CSV',
          historyEmpty: 'Belum ada riwayat.',
          guideTitle: 'FAQ',
          faq1Q: 'Bisakah memakai nama atau angka kustom?',
          faq1A: 'Ya. Di daftar kustom, pisahkan item dengan spasi, koma, tab, atau baris baru.',
          faq2Q: 'Bisakah hasil diurutkan?',
          faq2A: 'Ya. Pilih Naik untuk urut alfabet atau angka.',
          faq3Q: 'Bagaimana menyimpan riwayat?',
          faq3A: 'Tekan Ekspor CSV untuk mengunduh semua hasil undian.',
          faq4Q: 'Apakah data saya aman?',
          faq4A: 'Ya. Semua proses berjalan lokal di browser Anda.',
          footerTerms: 'Ketentuan',
          footerPrivacy: 'Privasi',
          copied: 'Tersalin!',
          noCopy: 'Tidak ada hasil untuk disalin.'
        };
                i18n.tr = {
          ...i18n.en,
          title: 'Rastgele Sayı Üretici | Hızlı Çekiliş',
          desc: 'Akıcı animasyon, özel liste ve CSV dışa aktarma sunan ücretsiz rastgele çekiliş aracı.',
          ogTitle: 'Rastgele Sayı Üretici | Hızlı Çekiliş',
          ogDesc: 'Sayı veya isimleri hızlıca çekin ve geçmişi kaydedin.',
          twTitle: 'Rastgele Sayı Üretici | Hızlı Çekiliş',
          twDesc: 'Hızlı sayı ve isim çekilişi için çevrimiçi araç.',
          navSpin: 'Çark',
          navLotto: 'Çekiliş',
          navHistory: 'Merdiven',
          navCoin: 'Yazı Tura',
          navDice: 'Zar',
          navGuide: 'Rehber',
          fullscreenHint: 'Odak modu için tam ekranı açın.',
          fullscreen: 'Tam ekran',
          fullscreenExit: 'Tam ekrandan çık',
          heroTitle: 'Rastgele Çekiliş',
          heroTitleCustom: 'Özel Liste Çekilişi',
          heroSubtitle: 'Numara veya isim çekilişini hızlıca yapın ve kaydedin.',
          tabBasic: 'Temel',
          tabCustom: 'Özel liste',
          labelTotalBalls: 'Toplam top (1~100)',
          labelDrawCount: 'Çekiliş sayısı',
          labelCustomDrawCount: 'Çekiliş sayısı',
          customPlaceholder: 'Ad veya öğe girin. Satır sonu, virgül ve boşluk otomatik algılanır.',
          labelAllowDup: 'Yinelenenlere izin ver',
          labelSound: 'Ses efektleri',
          labelSpeed: 'Hız',
          speed1: 'Yavaş',
          speed2: 'Normal',
          speed3: 'Hızlı',
          btnQuick: 'Animasyonu atla (hızlı çekiliş)',
          btnDraw: 'Çekilişi Başlat',
          statusReady: 'Ayarları kontrol edin ve başlatın.',
          statusDrawing: 'Çekiliş sürüyor...',
          statusDone: 'Çekiliş tamamlandı.',
          statusErrorNum: 'Giriş değerlerini kontrol edin.',
          resultTitle: 'Geçerli sonuç',
          sortOrder: 'Sıra',
          sortAsc: 'Artan',
          btnCopy: 'Kopyala',
          historyTitle: 'Geçmiş',
          btnExport: 'CSV dışa aktar',
          historyEmpty: 'Henüz geçmiş yok.',
          guideTitle: 'SSS',
          faq1Q: 'Özel isim veya sayı kullanabilir miyim?',
          faq1A: 'Evet. Özel liste modunda öğeleri boşluk, virgül, sekme veya satır sonuyla ayırın.',
          faq2Q: 'Sonuçları sıralayabilir miyim?',
          faq2A: 'Evet. Artan seçeneğiyle metin veya sayı sıralaması yapabilirsiniz.',
          faq3Q: 'Geçmişi nasıl kaydederim?',
          faq3A: 'CSV dışa aktar ile tüm çekilişleri indirebilirsiniz.',
          faq4Q: 'Verilerim güvenli mi?',
          faq4A: 'Evet. Tüm işlem tarayıcınızda yerel olarak yapılır.',
          footerTerms: 'Koşullar',
          footerPrivacy: 'Gizlilik',
          copied: 'Kopyalandı!',
          noCopy: 'Kopyalanacak sonuç yok.'
        };
  i18n.it = {
    ...i18n.en,
    title: 'Generatore Casuale | Numeri e Nomi',
    desc: 'Strumento di estrazione casuale con animazione fluida, liste personalizzate ed esportazione CSV.',
    ogTitle: 'Generatore Casuale | Numeri e Nomi',
    ogDesc: 'Estrai numeri o nomi in pochi secondi e salva la cronologia.',
    twTitle: 'Generatore Casuale | Numeri e Nomi',
    twDesc: 'Estrazione rapida con risultati immediati e salvataggio.',
    navSpin: 'Ruota',
    navLotto: 'Sorteggio',
    navHistory: 'Scala',
    navCoin: 'Moneta',
    navDice: 'Dadi',
    navGuide: 'Guida',
    fullscreenHint: 'Premi schermo intero per la modalità focus.',
    fullscreen: 'Schermo intero',
    fullscreenExit: 'Esci',
    heroTitle: 'Estrazione Casuale',
    heroTitleCustom: 'Estrazione Lista Personalizzata',
    heroSubtitle: 'Estrai numeri o nomi rapidamente con animazione fluida.',
    tabBasic: 'Impostazioni Base',
    tabCustom: 'Lista Personalizzata',
    labelTotalBalls: 'Totale Sfere (1~100)',
    labelDrawCount: 'Numero Estrazioni',
    labelCustomDrawCount: 'Numero Estrazioni',
    customPlaceholder: 'Inserisci nomi o elementi. Righe, virgole e spazi vengono riconosciuti automaticamente.',
    labelAllowDup: 'Consenti Ripetizioni',
    labelSound: 'Effetti Sonori',
    labelSpeed: 'Velocità',
    speed1: 'Lenta', speed2: 'Normale', speed3: 'Veloce',
    btnQuick: 'Salta Animazione (Rapida)',
    btnDraw: 'Avvia Estrazione',
    statusReady: 'Controlla le impostazioni e premi Avvia.',
    statusDrawing: 'Estrazione in corso...',
    statusDone: 'Estrazione completata.',
    statusErrorNum: 'Controlla i valori inseriti.',
    resultTitle: 'Risultato Corrente',
    sortOrder: 'Ordine',
    sortAsc: 'Crescente',
    btnCopy: 'Copia',
    historyTitle: 'Cronologia',
    btnExport: 'Esporta CSV',
    historyEmpty: 'Nessuna cronologia.',
    guideTitle: 'FAQ',
    faq1Q: 'Posso usare nomi o numeri personalizzati?',
    faq1A: 'Sì. Nella lista personalizzata puoi inserire elementi separati da spazio, virgola, tab o invio.',
    faq2Q: 'Posso ordinare i risultati?',
    faq2A: 'Sì. Usa Crescente per ordinare numeri o testo.',
    faq3Q: 'Come salvo la cronologia?',
    faq3A: 'Premi Esporta CSV per scaricare tutti i risultati.',
    faq4Q: 'I miei dati sono al sicuro?',
    faq4A: 'Sì. Tutto viene elaborato localmente nel browser.',
    footerTerms: 'Termini',
    footerPrivacy: 'Privacy',
    copied: 'Copiato!',
    noCopy: 'Nessun risultato da copiare.'
  };
  i18n.vi = {
    ...i18n.en,
    title: 'Bốc Thăm Ngẫu Nhiên | Số và Danh Sách',
    desc: 'Công cụ bốc thăm ngẫu nhiên với animation mượt, danh sách tùy chỉnh và xuất CSV.',
    ogTitle: 'Bốc Thăm Ngẫu Nhiên | Số và Danh Sách',
    ogDesc: 'Rút số hoặc tên nhanh chóng và lưu lịch sử kết quả.',
    twTitle: 'Bốc Thăm Ngẫu Nhiên | Số và Danh Sách',
    twDesc: 'Bốc thăm nhanh, xem kết quả ngay và xuất dữ liệu.',
    navSpin: 'Vòng quay',
    navLotto: 'Bốc thăm',
    navHistory: 'Cầu thang',
    navCoin: 'Tung xu',
    navDice: 'Xúc xắc',
    navGuide: 'Hướng dẫn',
    fullscreenHint: 'Nhấn toàn màn hình để tập trung.',
    fullscreen: 'Toàn màn hình',
    fullscreenExit: 'Thoát',
    heroTitle: 'Bốc Thăm Ngẫu Nhiên',
    heroTitleCustom: 'Bốc Thăm Danh Sách',
    heroSubtitle: 'Rút số hoặc tên nhanh với hiệu ứng mượt.',
    tabBasic: 'Cài đặt cơ bản',
    tabCustom: 'Danh sách tùy chỉnh',
    labelTotalBalls: 'Tổng bóng (1~100)',
    labelDrawCount: 'Số lượng rút',
    labelCustomDrawCount: 'Số lượng rút',
    customPlaceholder: 'Nhập tên hoặc mục. Tự nhận diện xuống dòng, dấu phẩy và khoảng trắng.',
    labelAllowDup: 'Cho phép trùng',
    labelSound: 'Âm thanh',
    labelSpeed: 'Tốc độ',
    speed1: 'Chậm', speed2: 'Vừa', speed3: 'Nhanh',
    btnQuick: 'Bỏ qua animation (rút nhanh)',
    btnDraw: 'Bắt đầu rút',
    statusReady: 'Kiểm tra cài đặt và nhấn Bắt đầu.',
    statusDrawing: 'Đang bốc thăm...',
    statusDone: 'Bốc thăm hoàn tất.',
    statusErrorNum: 'Vui lòng kiểm tra dữ liệu nhập.',
    resultTitle: 'Kết quả hiện tại',
    sortOrder: 'Thứ tự rút',
    sortAsc: 'Tăng dần',
    btnCopy: 'Sao chép',
    historyTitle: 'Lịch sử',
    btnExport: 'Xuất CSV',
    historyEmpty: 'Chưa có lịch sử.',
    guideTitle: 'FAQ',
    faq1Q: 'Có thể dùng tên/số tùy chỉnh không?',
    faq1A: 'Có. Ở tab danh sách tùy chỉnh, nhập mục với khoảng trắng, dấu phẩy, tab hoặc xuống dòng.',
    faq2Q: 'Có thể sắp xếp kết quả không?',
    faq2A: 'Có. Chọn tăng dần để sắp xếp số hoặc chữ.',
    faq3Q: 'Lưu lịch sử như thế nào?',
    faq3A: 'Nhấn Xuất CSV để tải toàn bộ kết quả.',
    faq4Q: 'Dữ liệu có an toàn không?',
    faq4A: 'Có. Dữ liệu chỉ xử lý cục bộ trong trình duyệt.',
    footerTerms: 'Điều khoản',
    footerPrivacy: 'Riêng tư',
    copied: 'Đã sao chép!',
    noCopy: 'Không có kết quả để sao chép.'
  };
  i18n.th = {
    ...i18n.en,
    title: 'สุ่มรายชื่อและตัวเลข | เครื่องมือจับสลาก',
    desc: 'เครื่องมือสุ่มรายชื่อ/ตัวเลข พร้อมแอนิเมชันลื่นไหล รายการกำหนดเอง และส่งออก CSV',
    ogTitle: 'สุ่มรายชื่อและตัวเลข | เครื่องมือจับสลาก',
    ogDesc: 'สุ่มตัวเลขหรือรายชื่อได้รวดเร็ว พร้อมบันทึกประวัติผลลัพธ์',
    twTitle: 'สุ่มรายชื่อและตัวเลข | เครื่องมือจับสลาก',
    twDesc: 'จับสลากรวดเร็ว ดูผลทันที และส่งออกข้อมูลได้',
    navSpin: 'วงล้อ',
    navLotto: 'จับสลาก',
    navHistory: 'บันได',
    navCoin: 'โยนเหรียญ',
    navDice: 'ทอยเต๋า',
    navGuide: 'คู่มือ',
    fullscreenHint: 'กดเต็มหน้าจอเพื่อโหมดโฟกัส',
    fullscreen: 'เต็มหน้าจอ',
    fullscreenExit: 'ออก',
    heroTitle: 'จับสลากแบบสุ่ม',
    heroTitleCustom: 'จับสลากจากรายการ',
    heroSubtitle: 'สุ่มชื่อหรือเลขได้รวดเร็วด้วยแอนิเมชันลื่นไหล',
    tabBasic: 'ตั้งค่าพื้นฐาน',
    tabCustom: 'รายการกำหนดเอง',
    labelTotalBalls: 'จำนวนลูกทั้งหมด (1~100)',
    labelDrawCount: 'จำนวนที่สุ่ม',
    labelCustomDrawCount: 'จำนวนที่สุ่ม',
    customPlaceholder: 'กรอกชื่อหรือรายการ ระบบแยกบรรทัดใหม่ เครื่องหมายจุลภาค และช่องว่างอัตโนมัติ',
    labelAllowDup: 'อนุญาตซ้ำ',
    labelSound: 'เสียงเอฟเฟกต์',
    labelSpeed: 'ความเร็ว',
    speed1: 'ช้า', speed2: 'ปกติ', speed3: 'เร็ว',
    btnQuick: 'ข้ามแอนิเมชัน (สุ่มเร็ว)',
    btnDraw: 'เริ่มสุ่ม',
    statusReady: 'ตรวจสอบการตั้งค่าแล้วกดเริ่มสุ่ม',
    statusDrawing: 'กำลังสุ่ม...',
    statusDone: 'สุ่มเสร็จแล้ว',
    statusErrorNum: 'กรุณาตรวจสอบค่าที่กรอก',
    resultTitle: 'ผลลัพธ์ปัจจุบัน',
    sortOrder: 'ลำดับสุ่ม',
    sortAsc: 'เรียงจากน้อยไปมาก',
    btnCopy: 'คัดลอก',
    historyTitle: 'ประวัติ',
    btnExport: 'ส่งออก CSV',
    historyEmpty: 'ยังไม่มีประวัติ',
    guideTitle: 'FAQ',
    faq1Q: 'ใช้ชื่อหรือเลขที่กำหนดเองได้ไหม?',
    faq1A: 'ได้ ในแท็บรายการกำหนดเองสามารถกรอกข้อมูลคั่นด้วยช่องว่าง จุลภาค แท็บ หรือขึ้นบรรทัดใหม่',
    faq2Q: 'เรียงผลลัพธ์ได้ไหม?',
    faq2A: 'ได้ ใช้ปุ่มเรียงจากน้อยไปมากเพื่อเรียงตัวเลข/ข้อความ',
    faq3Q: 'บันทึกประวัติอย่างไร?',
    faq3A: 'กดส่งออก CSV เพื่อดาวน์โหลดผลลัพธ์ทั้งหมด',
    faq4Q: 'ข้อมูลปลอดภัยหรือไม่?',
    faq4A: 'ปลอดภัย ข้อมูลประมวลผลในเบราว์เซอร์ของคุณเท่านั้น',
    footerTerms: 'ข้อกำหนด',
    footerPrivacy: 'ความเป็นส่วนตัว',
    copied: 'คัดลอกแล้ว!',
    noCopy: 'ไม่มีผลลัพธ์ให้คัดลอก'
  };
  i18n.nl = {
    ...i18n.en,
    title: 'Willekeurige Trekker | Nummers en Namen',
    desc: 'Tool voor willekeurige trekking met soepele animatie, aangepaste lijsten en CSV-export.',
    ogTitle: 'Willekeurige Trekker | Nummers en Namen',
    ogDesc: 'Kies snel willekeurige nummers of namen en bewaar de geschiedenis.',
    twTitle: 'Willekeurige Trekker | Nummers en Namen',
    twDesc: 'Snelle trekking met directe resultaten en export.',
    navSpin: 'Namenrad',
    navLotto: 'Loting',
    navHistory: 'Ladder',
    navCoin: 'Munt',
    navDice: 'Dobbelsteen',
    navGuide: 'Gids',
    fullscreenHint: 'Druk op fullscreen voor focusmodus.',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Afsluiten',
    heroTitle: 'Willekeurige Trekking',
    heroTitleCustom: 'Trekking met Eigen Lijst',
    heroSubtitle: 'Trek snel nummers of namen met vloeiende animatie.',
    tabBasic: 'Basisinstellingen',
    tabCustom: 'Eigen lijst',
    labelTotalBalls: 'Totaal ballen (1~100)',
    labelDrawCount: 'Aantal trekkingen',
    labelCustomDrawCount: 'Aantal trekkingen',
    customPlaceholder: 'Voer namen of items in. Nieuwe regels, komma’s en spaties worden automatisch herkend.',
    labelAllowDup: 'Duplicaten toestaan',
    labelSound: 'Geluidseffecten',
    labelSpeed: 'Snelheid',
    speed1: 'Langzaam', speed2: 'Normaal', speed3: 'Snel',
    btnQuick: 'Animatie overslaan (snel)',
    btnDraw: 'Start trekking',
    statusReady: 'Controleer de instellingen en druk op Start.',
    statusDrawing: 'Trekking bezig...',
    statusDone: 'Trekking voltooid.',
    statusErrorNum: 'Controleer de ingevoerde waarden.',
    resultTitle: 'Huidig resultaat',
    sortOrder: 'Volgorde',
    sortAsc: 'Oplopend',
    btnCopy: 'Kopiëren',
    historyTitle: 'Geschiedenis',
    btnExport: 'Exporteer CSV',
    historyEmpty: 'Nog geen geschiedenis.',
    guideTitle: 'FAQ',
    faq1Q: 'Kan ik eigen namen of nummers gebruiken?',
    faq1A: 'Ja. In Eigen lijst kun je items invoeren met spaties, komma’s, tabs of nieuwe regels.',
    faq2Q: 'Kan ik resultaten sorteren?',
    faq2A: 'Ja. Gebruik Oplopend om numeriek of alfabetisch te sorteren.',
    faq3Q: 'Hoe sla ik de geschiedenis op?',
    faq3A: 'Klik op Exporteer CSV om alle trekkingen te downloaden.',
    faq4Q: 'Zijn mijn gegevens veilig?',
    faq4A: 'Ja. Alles wordt lokaal in je browser verwerkt.',
    footerTerms: 'Voorwaarden',
    footerPrivacy: 'Privacy',
    copied: 'Gekopieerd!',
    noCopy: 'Niets om te kopiëren.'
  };
  const LANG_OPTIONS = ["ko", "en", "ja", "zh-cn", "es", "fr", "de", "pt-br", "hi", "ar", "ru", "id", "tr", "it", "vi", "th", "nl"];
  const SUPPORTED_LOCALES = [...LANG_OPTIONS, "zh-tw"];
  const LANG_SET = new Set(SUPPORTED_LOCALES);
  const localeNames = {
    ko: { native: "한국어", en: "Korean", flag: "kr" },
    en: { native: "English", en: "English", flag: "us" },
    ja: { native: "日本語", en: "Japanese", flag: "jp" },
    "zh-cn": { native: "简体中文", en: "Chinese", flag: "cn" },
    "zh-tw": { native: "繁體中文", en: "Chinese (Traditional)", flag: "tw" },
    es: { native: "Español", en: "Spanish", flag: "es" },
    fr: { native: "Français", en: "French", flag: "fr" },
    de: { native: "Deutsch", en: "German", flag: "de" },
    "pt-br": { native: "Português (Brasil)", en: "Portuguese (Brazil)", flag: "br" },
    hi: { native: "हिन्दी", en: "Hindi", flag: "in" },
    ar: { native: "العربية", en: "Arabic", flag: "ae" },
    ru: { native: "Русский", en: "Russian", flag: "ru" },
    id: { native: "Bahasa Indonesia", en: "Indonesian", flag: "id" },
    tr: { native: "Türkçe", en: "Turkish", flag: "tr" },
    it: { native: "Italiano", en: "Italian", flag: "it" },
    vi: { native: "Tiếng Việt", en: "Vietnamese", flag: "vn" },
    th: { native: "ไทย", en: "Thai", flag: "th" },
    nl: { native: "Nederlands", en: "Dutch", flag: "nl" }
  };

  const state = {
    locale: detectLocale(),
    mode: 'basic',
    pool: [],
    availableIds: [],
    currentResult: [],
    history: [],
    drawing: false,
    sortMode: 'order',
    quickMode: false,
    balls: [],
    raf: null,
    audio: null,
    fullscreenHintTimer: null
  };

  const ui = {
    langTrigger: document.getElementById('lang-trigger'),
    langButtonLabel: document.getElementById('lang-button-label'),
    langCurrentFlag: document.getElementById('lang-current-flag'),
    langMenu: document.getElementById('lang-menu'),
    langSearch: document.getElementById('lang-search'),
    langList: document.getElementById('lang-list'),
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
    fullscreenIcon: document.getElementById('fullscreen-icon'),
    fullscreenLabel: document.getElementById('fullscreen-label'),
    fullscreenHint: document.getElementById('fullscreen-hint'),
    fullscreenHintText: document.getElementById('fullscreen-hint-text'),
    tabBasicBtn: document.getElementById('tab-btn-basic'),
    tabCustomBtn: document.getElementById('tab-btn-custom'),
    customHint: document.getElementById('custom-list-hint'),
    tabBasic: document.getElementById('tab-basic'),
    tabCustom: document.getElementById('tab-custom'),
    inpTotal: document.getElementById('input-total-balls'),
    inpDrawBasic: document.getElementById('input-draw-count'),
    inpCustomList: document.getElementById('custom-list'),
    inpDrawCustom: document.getElementById('input-custom-draw-count'),
    togDup: document.getElementById('toggle-dup'),
    togSound: document.getElementById('toggle-sound'),
    sliderSpeed: document.getElementById('slider-speed'),
    labelSpeedVal: document.getElementById('label-speed-val'),
    btnQuick: document.getElementById('btn-quick-draw'),
    btnReset: document.getElementById('btn-reset'),
    btnDraw: document.getElementById('btn-draw'),
    statusBanner: document.getElementById('status-banner'),
    machineWrap: document.getElementById('machine-wrap'),
    resultSlots: document.getElementById('result-slots'),
    btnSortOrder: document.getElementById('sort-order'),
    btnSortAsc: document.getElementById('sort-asc'),
    btnCopy: document.getElementById('btn-copy'),
    historyList: document.getElementById('history-list'),
    btnExport: document.getElementById('btn-export'),
    canvas: document.getElementById('lotto-canvas')
  };

  const ctx = ui.canvas.getContext('2d');
  const CX = 300;
  const CY = 300;
  const RADIUS = 276;

  function getBallRadius(count) {
    if (count > 80) return 12;
    if (count > 45) return 16;
    if (count > 20) return 20;
    return 24;
  }

  function t(key) {
    const pack = i18n[state.locale] || i18n.en;
    return pack[key] || i18n.en[key] || i18n.ko[key] || key;
  }

  function getLocaleLabel(locale) {
    const row = localeNames[locale];
    if (!row) return locale;
    return `${row.native} (${row.en})`;
  }

  function getLocaleFlagUrl(locale) {
    const row = localeNames[locale];
    const code = row && row.flag ? row.flag : "us";
    return `https://flagcdn.com/w20/${code}.png`;
  }

  function renderLanguageList(query) {
    const q = String(query || "").trim().toLowerCase();
    const filtered = LANG_OPTIONS.filter((code) => {
      if (!q) return true;
      const row = localeNames[code];
      const haystack = `${code} ${row.native} ${row.en}`.toLowerCase();
      return haystack.includes(q);
    });
    ui.langList.innerHTML = filtered.map((code) => {
      const active = state.locale === code;
      const row = localeNames[code] || { native: code, en: code };
      return `
        <button type="button" data-lang="${code}" class="w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${active ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"}">
          <span class="inline-flex items-center gap-2">
            <img src="${getLocaleFlagUrl(code)}" alt="${row.en}" class="w-4 h-3 rounded-[2px] object-cover border border-slate-200">
            <span>${getLocaleLabel(code)}</span>
          </span>
        </button>
      `;
    }).join("");
  }

  function openLangMenu() {
    ui.langMenu.classList.remove("hidden");
    renderLanguageList(ui.langSearch.value);
    window.setTimeout(() => ui.langSearch.focus(), 0);
  }

  function closeLangMenu() {
    ui.langMenu.classList.add("hidden");
  }

  function syncLangLinks() {
    const toolPathRegex = /^\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?(roulette|luckydraw|ladder|coinflip|dice)\/?$/i;
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;
      const m = url.pathname.match(toolPathRegex);
      if (m) {
        const tool = m[2].toLowerCase();
        url.pathname = state.locale === "ko" ? `/${tool}/` : `/${state.locale}/${tool}/`;
        url.searchParams.delete("lang");
        a.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
        return;
      }
      if (state.locale === "ko") url.searchParams.delete("lang");
      else url.searchParams.set("lang", state.locale);
      a.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
  }

  function setText(id, key) {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  }

  function applyI18n() {
    document.documentElement.lang = state.locale;
    document.title = t('title');
    document.getElementById('meta-description').content = t('desc');
    document.getElementById('meta-og-title').content = t('ogTitle');
    document.getElementById('meta-og-description').content = t('ogDesc');
    document.getElementById('meta-twitter-title').content = t('twTitle');
    document.getElementById('meta-twitter-description').content = t('twDesc');

    setText('nav-spin', 'navSpin');
    setText('nav-lotto', 'navLotto');
    setText('nav-history', 'navHistory');
    setText('nav-coin', 'navCoin');
    setText('nav-dice', 'navDice');
    setText('nav-guide', 'navGuide');
    setText('hero-title', 'heroTitle');
    setText('hero-subtitle', 'heroSubtitle');
    setText('tab-btn-basic', 'tabBasic');
    setText('tab-btn-custom', 'tabCustom');
    setText('label-total-balls', 'labelTotalBalls');
    setText('label-draw-count', 'labelDrawCount');
    setText('label-custom-draw-count', 'labelCustomDrawCount');
    if (ui.inpCustomList) ui.inpCustomList.placeholder = t('customPlaceholder');
    setText('label-allow-dup', 'labelAllowDup');
    setText('label-sound', 'labelSound');
    setText('label-speed', 'labelSpeed');
    setText('label-btn-quick', 'btnQuick');
    setText('label-btn-draw', 'btnDraw');
    setText('label-result-title', 'resultTitle');
    setText('sort-order', 'sortOrder');
    setText('sort-asc', 'sortAsc');
    setText('label-btn-copy', 'btnCopy');
    setText('label-history-title', 'historyTitle');
    setText('label-btn-export', 'btnExport');
    setText('guide-title', 'guideTitle');
    setText('faq1-q', 'faq1Q');
    setText('faq1-a', 'faq1A');
    setText('faq2-q', 'faq2Q');
    setText('faq2-a', 'faq2A');
    setText('faq3-q', 'faq3Q');
    setText('faq3-a', 'faq3A');
    setText('faq4-q', 'faq4Q');
    setText('faq4-a', 'faq4A');
    setText('footer-terms', 'footerTerms');
    setText('footer-privacy', 'footerPrivacy');
    if (document.getElementById('footer-terms')) document.getElementById('footer-terms').textContent = 'Terms';
    if (document.getElementById('footer-privacy')) document.getElementById('footer-privacy').textContent = 'Privacy';
    ui.statusBanner.textContent = t('statusReady');
    ui.fullscreenLabel.textContent = document.fullscreenElement ? t('fullscreenExit') : t('fullscreen');
    if (ui.fullscreenHintText) ui.fullscreenHintText.textContent = t('fullscreenHint');
    ui.langButtonLabel.textContent = "LANGUAGE";
    ui.langSearch.placeholder = "Search language";
    ui.langCurrentFlag.src = getLocaleFlagUrl(state.locale);
    ui.langCurrentFlag.alt = (localeNames[state.locale] && localeNames[state.locale].en) || state.locale;
    renderLanguageList(ui.langSearch.value);
    syncLangLinks();

    updateSpeedLabel();
    renderHistory();
    renderSlots(state.currentResult);
    applyModeHeading();
    updateCustomHint();
  }

  function applyModeHeading() {
    const titleEl = document.getElementById('hero-title');
    if (!titleEl) return;
    titleEl.textContent = state.mode === 'custom' ? t('heroTitleCustom') : t('heroTitle');
  }

  function updateCustomHint() {
    if (!ui.customHint) return;
    const showHint = state.locale === 'en' && state.mode === 'basic';
    ui.customHint.classList.toggle('hidden', !showHint);
  }

  function updateSpeedLabel() {
    ui.labelSpeedVal.textContent = t(`speed${ui.sliderSpeed.value}`);
  }

  function showFullscreenHint() {
    if (!ui.fullscreenHint) return;
    ui.fullscreenHint.classList.remove('hidden');
    clearTimeout(state.fullscreenHintTimer);
    state.fullscreenHintTimer = setTimeout(() => {
      ui.fullscreenHint.classList.add('hidden');
    }, 4200);
  }

  class Ball {
    constructor(id, label, radius) {
      this.id = id;
      this.label = String(label);
      this.r = radius;
      this.x = CX + (Math.random() - 0.5) * 180;
      this.y = CY + 70 + (Math.random() - 0.5) * 120;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.state = 'mixing';
      this.color = ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'][id % 4];
    }

    update() {
      if (this.state === 'drawn') return;

      if (this.state === 'suction') {
        const tx = CX;
        const ty = CY - RADIUS - 20;
        this.vx = (tx - this.x) * 0.09;
        this.vy = (ty - this.y) * 0.09;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < ty + 26) this.state = 'drawn';
        return;
      }

      this.vy += 0.25;
      if (this.y > CY + 40 && Math.abs(this.x - CX) < 110) {
        this.vy -= Math.random() * 1.2 + 0.5;
        this.vx += (Math.random() - 0.5) * 0.8;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;

      const dx = this.x - CX;
      const dy = this.y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > RADIUS - this.r) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x = CX + nx * (RADIUS - this.r);
        this.y = CY + ny * (RADIUS - this.r);
        const dot = this.vx * nx + this.vy * ny;
        this.vx = (this.vx - 2 * dot * nx) * 0.8;
        this.vy = (this.vy - 2 * dot * ny) * 0.8;
      }
    }

    draw(context) {
      if (this.state === 'drawn') return;
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
      context.strokeStyle = 'rgba(15,23,42,0.12)';
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = '#0f172a';
      context.font = `600 ${this.r * 0.8}px Inter`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(this.label.length > 2 ? this.label.slice(0, 2) : this.label, this.x, this.y + 1);
    }
  }

  function resolveCollisions() {
    for (let i = 0; i < state.balls.length; i++) {
      const a = state.balls[i];
      if (a.state !== 'mixing') continue;
      for (let j = i + 1; j < state.balls.length; j++) {
        const b = state.balls[j];
        if (b.state !== 'mixing') continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const min = a.r + b.r;
        if (dist > 0 && dist < min) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = (min - dist) * 0.5;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
          a.vx -= nx * 0.3;
          a.vy -= ny * 0.3;
          b.vx += nx * 0.3;
          b.vy += ny * 0.3;
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, 600, 600);
    for (const b of state.balls) b.update();
    resolveCollisions();
    for (const b of state.balls) b.draw(ctx);
    state.raf = requestAnimationFrame(loop);
  }

  function pickNextBallId(available, skip) {
    if (!available.length) return null;
    if (skip) return available[Math.floor(Math.random() * available.length)];

    const tx = CX;
    const ty = CY - RADIUS - 20;
    const topCandidates = [];

    for (const id of available) {
      const ball = state.balls.find((b) => b.id === id);
      if (!ball || ball.state === 'drawn') continue;

      const dx = ball.x - tx;
      const dy = ball.y - ty;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const upwardBonus = Math.max(0, -ball.vy) * 22;
      const centerPenalty = Math.abs(dx) * 0.35;
      const lowerPenalty = Math.max(0, ball.y - (CY + 10)) * 0.28;
      const jitter = Math.random() * 12;
      const score = dist + centerPenalty + lowerPenalty - upwardBonus + jitter;

      topCandidates.push({ id, score });
    }

    if (!topCandidates.length) {
      return available[Math.floor(Math.random() * available.length)];
    }

    topCandidates.sort((a, b) => a.score - b.score);
    const pickBand = topCandidates.slice(0, Math.min(3, topCandidates.length));
    return pickBand[Math.floor(Math.random() * pickBand.length)].id;
  }

  function initEngine(pool) {
    cancelAnimationFrame(state.raf);
    const r = getBallRadius(pool.length);
    state.balls = pool.map((label, idx) => new Ball(idx, label, r));
    loop();
  }

  function syncCustomPoolSmooth() {
    const nextPool = parseEntries(ui.inpCustomList.value, { allowDuplicates: false });
    const radius = getBallRadius(nextPool.length);

    if (!state.balls.length) {
      state.pool = nextPool;
      state.availableIds = nextPool.map((_, i) => i);
      state.currentResult = [];
      renderSlots([]);
      initEngine(nextPool);
      return;
    }

    const oldByLabel = new Map(state.balls.map((b) => [b.label, b]));
    const nextBalls = nextPool.map((label, idx) => {
      const existing = oldByLabel.get(String(label));
      if (existing) {
        existing.id = idx;
        existing.label = String(label);
        if (existing.state === 'drawn') existing.state = 'mixing';
        existing.r = radius;
        return existing;
      }
      const ball = new Ball(idx, label, radius);
      ball.x = CX + (Math.random() - 0.5) * 80;
      ball.y = CY + (Math.random() - 0.5) * 80;
      return ball;
    });

    state.pool = nextPool;
    state.availableIds = nextPool.map((_, i) => i);
    state.currentResult = [];
    state.balls = nextBalls;
    renderSlots([]);
  }

  function preparePool() {
    state.pool = [];
    if (state.mode === 'basic') {
      let total = Number(ui.inpTotal.value) || 45;
      total = Math.max(1, Math.min(100, total));
      ui.inpTotal.value = String(total);
      for (let i = 1; i <= total; i++) state.pool.push(String(i));
    } else {
      state.pool = parseEntries(ui.inpCustomList.value, { allowDuplicates: false });
    }
    state.availableIds = state.pool.map((_, i) => i);
    state.currentResult = [];
    renderSlots([]);
    initEngine(state.pool);
  }

  function switchTab(mode) {
    if (state.drawing) return;
    state.mode = mode;
    if (mode === 'basic') {
      ui.tabBasic.classList.add('active');
      ui.tabCustom.classList.remove('active');
      ui.tabBasicBtn.className = 'flex-1 py-2.5 text-xs font-semibold rounded-xl bg-white shadow-sm text-slate-900 border border-slate-200/60';
      ui.tabCustomBtn.className = 'flex-1 py-2.5 text-xs font-medium rounded-xl text-slate-500 hover:text-slate-900';
    } else {
      ui.tabCustom.classList.add('active');
      ui.tabBasic.classList.remove('active');
      ui.tabCustomBtn.className = 'flex-1 py-2.5 text-xs font-semibold rounded-xl bg-white shadow-sm text-slate-900 border border-slate-200/60';
      ui.tabBasicBtn.className = 'flex-1 py-2.5 text-xs font-medium rounded-xl text-slate-500 hover:text-slate-900';
    }
    applyModeHeading();
    updateCustomHint();
    preparePool();
  }

  function getDrawCount() {
    const val = Number(state.mode === 'basic' ? ui.inpDrawBasic.value : ui.inpDrawCustom.value) || 1;
    return Math.max(1, val);
  }

  function getResultBallVisual(id) {
    const bg = [
      'linear-gradient(135deg,#fff,#f1f5f9)',
      'linear-gradient(135deg,#f8fafc,#e2e8f0)',
      'linear-gradient(135deg,#f1f5f9,#cbd5e1)',
      'linear-gradient(135deg,#334155,#0f172a)'
    ][id % 4];
    return {
      background: bg,
      color: id % 4 === 3 ? '#ffffff' : '#0f172a'
    };
  }

  function createResultBallNode(item) {
    const node = document.createElement('div');
    if (!item) {
      node.className = 'result-ball empty';
      node.textContent = '?';
      return node;
    }
    const visual = getResultBallVisual(item.id);
    node.className = 'result-ball';
    node.style.background = visual.background;
    node.style.color = visual.color;
    node.textContent = item.label;
    return node;
  }

  async function animateResultTransfer(item, speed) {
    if (!ui.machineWrap || !ui.resultSlots) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = ui.resultSlots.querySelector('.result-ball.empty');
    if (!target) return;

    const machineRect = ui.machineWrap.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (!machineRect.width || !targetRect.width) return;

    const startX = machineRect.left + (CX / 600) * machineRect.width;
    const startY = machineRect.top + ((CY - RADIUS - 20) / 600) * machineRect.height;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const visual = getResultBallVisual(item.id);
    const fly = document.createElement('div');
    fly.className = 'draw-fly-ball';
    fly.style.left = `${startX}px`;
    fly.style.top = `${startY}px`;
    fly.style.background = visual.background;
    fly.style.color = visual.color;
    fly.textContent = item.label;
    document.body.appendChild(fly);

    const duration = speed === 1 ? 820 : (speed === 2 ? 620 : 460);
    const peak = Math.max(30, Math.min(96, Math.abs(endY - startY) * 0.38));
    const curve = (Math.random() * 18 + 10) * (Math.random() < 0.5 ? -1 : 1);
    const rotateStart = (Math.random() * 22 - 11);

    await new Promise((resolve) => {
      const started = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const sideDrift = Math.sin(Math.PI * eased) * curve;
        const x = startX + (endX - startX) * eased + sideDrift;
        const y = startY + (endY - startY) * eased - Math.sin(Math.PI * eased) * peak;
        const scale = 1.16 - eased * 0.22 + Math.sin(Math.PI * eased) * 0.04;
        const rot = rotateStart * (1 - eased) + 5 * eased;

        fly.style.left = `${x}px`;
        fly.style.top = `${y}px`;
        fly.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`;
        fly.style.boxShadow = `inset 0 -2px 6px rgba(15,23,42,0.08), 0 ${10 + (1 - eased) * 6}px ${18 + (1 - eased) * 8}px rgba(15,23,42,0.2)`;
        fly.style.opacity = progress > 0.8 ? String((1 - progress) / 0.2) : '1';

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        const ring = document.createElement('div');
        ring.className = 'draw-land-ring';
        ring.style.left = `${endX}px`;
        ring.style.top = `${endY}px`;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 380);

        fly.remove();
        resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  function renderSlots(results) {
    const drawCount = getDrawCount();
    const list = [...results];
    if (state.sortMode === 'asc') {
      list.sort((a, b) => {
        const na = Number(a.label); const nb = Number(b.label);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return a.label.localeCompare(b.label);
      });
    }

    const columns = drawCount <= 4 ? drawCount : (drawCount <= 6 ? 3 : 5);
    ui.resultSlots.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    ui.resultSlots.style.maxWidth = drawCount > 6 ? '320px' : '240px';

    ui.resultSlots.innerHTML = '';
    for (let i = 0; i < drawCount; i++) {
      const item = list[i];
      const node = createResultBallNode(item);
      ui.resultSlots.appendChild(node);
    }
  }

  function renderHistory() {
    if (!state.history.length) {
      ui.historyList.innerHTML = `<div class="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400"><iconify-icon icon="solar:ghost-smile-linear" class="text-3xl mb-2"></iconify-icon><p class="text-xs">${t('historyEmpty')}</p></div>`;
      return;
    }
    ui.historyList.innerHTML = state.history.map((set, i) => `
      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
        <div class="flex items-center gap-3 min-w-0">
          <span class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-500">${i + 1}</span>
          <div class="min-w-0">
            <p class="text-sm font-medium text-slate-900 truncate">${set.results.join(', ')}</p>
            <p class="text-[11px] text-slate-400">${set.time}</p>
          </div>
        </div>
        <button data-history-index="${i}" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all" aria-label="Remove history item">
          <iconify-icon icon="solar:close-circle-linear" stroke-width="1.5"></iconify-icon>
        </button>
      </div>
    `).reverse().join('');
  }

  function setLocked(flag) {
    state.drawing = flag;
    ui.btnDraw.disabled = flag;
    ui.btnQuick.disabled = flag;
    ui.btnReset.disabled = flag;
    ui.inpTotal.disabled = flag;
    ui.inpDrawBasic.disabled = flag;
    ui.inpCustomList.disabled = flag;
    ui.inpDrawCustom.disabled = flag;
    ui.statusBanner.textContent = flag ? t('statusDrawing') : t('statusDone');
  }

  function tone(freq, dur, type, vol) {
    if (!ui.togSound.checked) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!state.audio) state.audio = new AudioCtx();
    if (state.audio.state === 'suspended') state.audio.resume();
    const osc = state.audio.createOscillator();
    const gain = state.audio.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, state.audio.currentTime);
    gain.gain.setValueAtTime(0.0001, state.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol || 0.05, state.audio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audio.currentTime + dur);
    osc.connect(gain); gain.connect(state.audio.destination);
    osc.start(); osc.stop(state.audio.currentTime + dur + 0.02);
  }

  async function drawSequence(skip) {
    if (state.drawing) return;
    const drawCount = getDrawCount();
    if (!state.pool.length) {
      ui.statusBanner.textContent = t('statusErrorNum');
      return;
    }

    setLocked(true);
    state.currentResult = [];
    renderSlots([]);

    let available = [...state.availableIds];
    let count = drawCount;
    if (!ui.togDup.checked && count > available.length) count = available.length;

    const speed = Number(ui.sliderSpeed.value);
    const suctionDelay = skip ? 0 : (speed === 1 ? 700 : speed === 2 ? 450 : 250);
    const between = skip ? 0 : (speed === 1 ? 1050 : speed === 2 ? 700 : 420);

    for (let i = 0; i < count; i++) {
      if (!available.length) break;
      const selectedId = pickNextBallId(available, skip);
      if (selectedId == null) break;
      const pickIndex = available.indexOf(selectedId);
      const label = state.pool[selectedId];
      const picked = { id: selectedId, label };

      if (!ui.togDup.checked) available.splice(pickIndex, 1);

      const ball = state.balls.find((b) => b.id === selectedId);
      if (ball && !skip) {
        ball.state = 'suction';
        tone(650, 0.06, 'triangle', 0.04);
        await new Promise((r) => setTimeout(r, suctionDelay));
      }

      if (!skip) await animateResultTransfer(picked, speed);

      state.currentResult.push(picked);
      renderSlots(state.currentResult);
      tone(420, 0.09, 'sine', 0.06);

      if (!skip && i < count - 1) await new Promise((r) => setTimeout(r, between));
    }

    tone(523, 0.2, 'triangle', 0.07);

    const time = new Date().toLocaleTimeString(state.locale === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const save = [...state.currentResult];
    if (state.sortMode === 'asc') {
      save.sort((a, b) => {
        const na = Number(a.label); const nb = Number(b.label);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return a.label.localeCompare(b.label);
      });
    }
    state.history.push({ time, results: save.map((r) => r.label) });
    renderHistory();

    if (!ui.togDup.checked) {
      state.availableIds = [...available];
      state.balls = state.balls.filter((b) => available.includes(b.id));
    } else {
      initEngine(state.pool);
    }

    setLocked(false);
  }

  function exportCsv() {
    if (!state.history.length) return;
    const header = state.locale === 'ko' ? ['순번', '시간', '결과'] : ['Set', 'Time', 'Results'];
    const rows = state.history.map((item, i) => [i + 1, item.time, item.results.join(' | ')]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadText(`rlt-lotto-${Date.now()}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8');
  }

  function copyResult() {
    if (!state.currentResult.length) {
      alert(t('noCopy'));
      return;
    }
    const text = state.currentResult.map((r) => r.label).join(', ');
    navigator.clipboard.writeText(text).then(() => alert(t('copied')));
  }

  function bind() {
    ui.langTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      if (ui.langMenu.classList.contains('hidden')) openLangMenu();
      else closeLangMenu();
    });
    ui.langSearch.addEventListener('input', () => renderLanguageList(ui.langSearch.value));
    ui.langList.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-lang]');
      if (!btn) return;
      const locale = btn.getAttribute('data-lang');
      if (!LANG_SET.has(locale)) return;
      state.locale = locale;
      try { localStorage.setItem('rlt-lang', locale); } catch (e) {}
      try {
        const url = new URL(window.location.href);
        const currentToolMatch = url.pathname.match(/^\/(?:(ko|en|ja|zh-cn|zh-tw|es|fr|de|pt-br|hi|ar|ru|id|tr|it|vi|th|nl)\/)?(roulette|luckydraw|ladder|coinflip|dice)\/?$/i);
        if (currentToolMatch) {
          const tool = currentToolMatch[2].toLowerCase();
          const nextPath = locale === 'ko' ? `/${tool}/` : `/${locale}/${tool}/`;
          window.history.replaceState({}, '', `${nextPath}${url.hash}`);
        } else {
          if (locale === 'ko') url.searchParams.delete('lang');
          else url.searchParams.set('lang', locale);
          window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
        }
      } catch (e) {}
      applyI18n();
      closeLangMenu();
    });
    document.addEventListener('click', (event) => {
      if (ui.langMenu.classList.contains('hidden')) return;
      if (ui.langMenu.contains(event.target) || ui.langTrigger.contains(event.target)) return;
      closeLangMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLangMenu();
    });

    ui.tabBasicBtn.addEventListener('click', () => switchTab('basic'));
    ui.tabCustomBtn.addEventListener('click', () => switchTab('custom'));

    ui.inpTotal.addEventListener('input', () => !state.drawing && preparePool());
    ui.inpCustomList.addEventListener('input', () => {
      if (state.drawing) return;
      if (state.mode === 'custom') {
        syncCustomPoolSmooth();
      } else {
        preparePool();
      }
    });

    ui.sliderSpeed.addEventListener('input', updateSpeedLabel);

    ui.btnDraw.addEventListener('click', () => drawSequence(false));
    ui.btnQuick.addEventListener('click', () => drawSequence(true));
    ui.btnReset.addEventListener('click', preparePool);

    ui.btnSortOrder.addEventListener('click', () => {
      state.sortMode = 'order';
      ui.btnSortOrder.className = 'px-2 py-1 text-[10px] font-semibold rounded-md bg-white text-slate-900 shadow-sm';
      ui.btnSortAsc.className = 'px-2 py-1 text-[10px] font-semibold rounded-md text-slate-500 hover:text-slate-900';
      renderSlots(state.currentResult);
    });
    ui.btnSortAsc.addEventListener('click', () => {
      state.sortMode = 'asc';
      ui.btnSortAsc.className = 'px-2 py-1 text-[10px] font-semibold rounded-md bg-white text-slate-900 shadow-sm';
      ui.btnSortOrder.className = 'px-2 py-1 text-[10px] font-semibold rounded-md text-slate-500 hover:text-slate-900';
      renderSlots(state.currentResult);
    });

    ui.btnCopy.addEventListener('click', copyResult);
    ui.btnExport.addEventListener('click', exportCsv);

    ui.historyList.addEventListener('click', (event) => {
      const target = event.target.closest('button[data-history-index]');
      if (!target) return;
      const idx = Number(target.getAttribute('data-history-index'));
      if (Number.isNaN(idx)) return;
      state.history.splice(idx, 1);
      renderHistory();
    });

    ui.fullscreenToggle.addEventListener('click', async () => {
      if (ui.fullscreenHint) ui.fullscreenHint.classList.add('hidden');
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
      ui.fullscreenIcon.setAttribute('icon', document.fullscreenElement ? 'solar:minimize-linear' : 'solar:maximize-linear');
      ui.fullscreenLabel.textContent = document.fullscreenElement ? t('fullscreenExit') : t('fullscreen');
    });
  }

  try {
    bind();
    applyI18n();
    switchTab(state.mode);
    preparePool();
    showFullscreenHint();
  } catch (error) {
    console.error('[lotto] initialization failed:', error);
  } finally {
    document.documentElement.classList.remove('i18n-pending');
  }
})();
