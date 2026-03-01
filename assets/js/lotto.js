(function () {
  const { parseEntries, detectLocale, downloadText } = window.RLTUtils;

  const i18n = {
    ko: {
      title: '로또 추첨기 | 랜덤추첨 뽑기게임 RLT',
      desc: '고급스러운 모션의 온라인 로또 추첨기. 6/45 기본 모드 및 커스텀 명단 입력 지원, 결과 정렬, CSV 저장, 전체화면 기능을 제공합니다.',
      ogTitle: '로또 추첨기 | 랜덤추첨 뽑기게임 RLT',
      ogDesc: '화려하고 부드러운 애니메이션의 로또 번호 추첨기. 번호 및 명단을 뽑고 결과를 저장하세요.',
      twTitle: '로또 추첨기 | 랜덤추첨 뽑기게임 RLT',
      twDesc: '깔끔한 UX와 부드러운 모션을 자랑하는 로또 번호/명단 추첨기',
      navSpin: '룰렛돌리기',
      navLotto: '로또추첨기',
      navHistory: '사다리타기',
      navGuide: '가이드',
      fullscreen: '전체화면',
      fullscreenExit: '화면해제',
      heroTitle: '로또 번호 추첨기',
      heroSubtitle: '빠르고 부드러운 애니메이션, 기본 로또 번호부터 명단 입력까지 지원합니다.',
      tabBasic: '기본 설정',
      tabCustom: '직접 입력',
      labelTotalBalls: '전체 공 개수 (1~100)',
      labelDrawCount: '뽑을 개수',
      labelCustomDrawCount: '뽑을 개수',
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
      title: 'Lotto Draw | Random Picker RLT',
      desc: 'Premium online lotto drawer with smooth motion. Supports default 6/45 mode and custom list input, sorting, CSV export, and fullscreen.',
      ogTitle: 'Lotto Draw | Random Picker RLT',
      ogDesc: 'Smooth lotto number picker with custom lists, sorting, and history export.',
      twTitle: 'Lotto Draw | Random Picker RLT',
      twDesc: 'Clean UX and smooth motion for lotto number and name draws',
      navSpin: 'Wheel of Names',
      navLotto: 'Lotto Draw',
      navHistory: 'Ladder Draw',
      navGuide: 'Guide',
      fullscreen: 'Fullscreen',
      fullscreenExit: 'Exit Full',
      heroTitle: 'Lotto Number Drawer',
      heroSubtitle: 'Smooth animation and flexible draw modes for numbers and custom lists.',
      tabBasic: 'Basic',
      tabCustom: 'Custom List',
      labelTotalBalls: 'Total Balls (1~100)',
      labelDrawCount: 'Draw Count',
      labelCustomDrawCount: 'Draw Count',
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
    audio: null
  };

  const ui = {
    langKo: document.getElementById('lang-ko'),
    langEn: document.getElementById('lang-en'),
    fullscreenToggle: document.getElementById('fullscreen-toggle'),
    fullscreenIcon: document.getElementById('fullscreen-icon'),
    fullscreenLabel: document.getElementById('fullscreen-label'),
    tabBasicBtn: document.getElementById('tab-btn-basic'),
    tabCustomBtn: document.getElementById('tab-btn-custom'),
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

  function t(key) {
    const pack = i18n[state.locale] || i18n.ko;
    return pack[key] || i18n.ko[key] || key;
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
    setText('nav-guide', 'navGuide');
    setText('hero-title', 'heroTitle');
    setText('hero-subtitle', 'heroSubtitle');
    setText('tab-btn-basic', 'tabBasic');
    setText('tab-btn-custom', 'tabCustom');
    setText('label-total-balls', 'labelTotalBalls');
    setText('label-draw-count', 'labelDrawCount');
    setText('label-custom-draw-count', 'labelCustomDrawCount');
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
    ui.statusBanner.textContent = t('statusReady');
    ui.fullscreenLabel.textContent = document.fullscreenElement ? t('fullscreenExit') : t('fullscreen');

    ui.langKo.className = `px-2.5 py-1 text-xs font-semibold rounded-full ${state.locale === 'ko' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`;
    ui.langEn.className = `px-2.5 py-1 text-xs font-semibold rounded-full ${state.locale === 'en' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'}`;

    updateSpeedLabel();
    renderHistory();
    renderSlots(state.currentResult);
  }

  function updateSpeedLabel() {
    ui.labelSpeedVal.textContent = t(`speed${ui.sliderSpeed.value}`);
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

  function initEngine(pool) {
    cancelAnimationFrame(state.raf);
    let r = 24;
    if (pool.length > 80) r = 12;
    else if (pool.length > 45) r = 16;
    else if (pool.length > 20) r = 20;
    state.balls = pool.map((label, idx) => new Ball(idx, label, r));
    loop();
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
    preparePool();
  }

  function getDrawCount() {
    const val = Number(state.mode === 'basic' ? ui.inpDrawBasic.value : ui.inpDrawCustom.value) || 1;
    return Math.max(1, val);
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
      const node = document.createElement('div');
      const item = list[i];
      if (!item) {
        node.className = 'result-ball empty';
        node.textContent = '?';
      } else {
        node.className = 'result-ball';
        node.style.background = ['linear-gradient(135deg,#fff,#f1f5f9)','linear-gradient(135deg,#f8fafc,#e2e8f0)','linear-gradient(135deg,#f1f5f9,#cbd5e1)','linear-gradient(135deg,#334155,#0f172a)'][item.id % 4];
        node.style.color = item.id % 4 === 3 ? '#ffffff' : '#0f172a';
        node.textContent = item.label;
      }
      ui.resultSlots.appendChild(node);
    }
  }

  function renderHistory() {
    if (!state.history.length) {
      ui.historyList.innerHTML = `<div class="h-full flex flex-col items-center justify-center text-slate-400"><iconify-icon icon="solar:ghost-smile-linear" class="text-3xl mb-2"></iconify-icon><p class="text-xs">${t('historyEmpty')}</p></div>`;
      return;
    }
    ui.historyList.innerHTML = state.history.map((set, i) => `
      <div class="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] font-bold text-slate-400">SET ${i + 1}</span>
          <span class="text-[10px] text-slate-400">${set.time}</span>
        </div>
        <div class="text-sm font-medium text-slate-800 break-words leading-snug">${set.results.join(', ')}</div>
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
      const pickIndex = Math.floor(Math.random() * available.length);
      const selectedId = available[pickIndex];
      const label = state.pool[selectedId];

      if (!ui.togDup.checked) available.splice(pickIndex, 1);

      const ball = state.balls.find((b) => b.id === selectedId);
      if (ball && !skip) {
        ball.state = 'suction';
        tone(650, 0.06, 'triangle', 0.04);
        await new Promise((r) => setTimeout(r, suctionDelay));
      }

      state.currentResult.push({ id: selectedId, label });
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
    ui.langKo.addEventListener('click', () => { state.locale = 'ko'; localStorage.setItem('rlt-lang', 'ko'); applyI18n(); });
    ui.langEn.addEventListener('click', () => { state.locale = 'en'; localStorage.setItem('rlt-lang', 'en'); applyI18n(); });

    ui.tabBasicBtn.addEventListener('click', () => switchTab('basic'));
    ui.tabCustomBtn.addEventListener('click', () => switchTab('custom'));

    ui.inpTotal.addEventListener('input', () => !state.drawing && preparePool());
    ui.inpCustomList.addEventListener('input', () => !state.drawing && preparePool());

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

    ui.fullscreenToggle.addEventListener('click', async () => {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
      ui.fullscreenIcon.setAttribute('icon', document.fullscreenElement ? 'solar:minimize-linear' : 'solar:maximize-linear');
      ui.fullscreenLabel.textContent = document.fullscreenElement ? t('fullscreenExit') : t('fullscreen');
    });
  }

  bind();
  applyI18n();
  switchTab('basic');
  preparePool();
})();
