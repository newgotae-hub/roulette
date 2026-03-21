(() => {
  const copy = window.__BRICK_BREAKER_COPY__ || {};
  const meta = window.__BRICK_BREAKER_META__ || {};
  const canvas = document.getElementById('brick-breaker-board');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = 640;
  const H = 760;
  const STORAGE_KEY = 'rlt-brick-breaker-best-v1';
  const deterministicMode = Boolean(navigator.webdriver || meta.deterministic);
  const BRICK_ROWS = 5;
  const BRICK_COLS = 6;
  const BRICK_GAP = 8;
  const BRICK_TOP = 92;
  const BRICK_W = 90;
  const BRICK_H = 24;
  const BRICK_LEFT = Math.round((W - (BRICK_COLS * BRICK_W + (BRICK_COLS - 1) * BRICK_GAP)) / 2);
  const PADDLE_Y = H - 42;
  const PADDLE_W = 116;
  const PADDLE_H = 14;
  const BALL_R = 7;
  const BASE_SPEED = 5.1;
  const MAX_SPEED = 7.4;
  const FLOOR_Y = H - 14;
  const TOP_Y = 22;
  const MAX_PARTICLES = 120;

  const els = {
    status: document.getElementById('brick-breaker-status'),
    score: document.getElementById('brick-breaker-score'),
    best: document.getElementById('brick-breaker-best'),
    lives: document.getElementById('brick-breaker-lives'),
    combo: document.getElementById('brick-breaker-combo'),
    bricksLeft: document.getElementById('brick-breaker-bricks-left'),
    speed: document.getElementById('brick-breaker-speed'),
    mode: document.getElementById('brick-breaker-mode'),
    hint: document.getElementById('brick-breaker-hint'),
    start: document.getElementById('brick-breaker-start'),
    pause: document.getElementById('brick-breaker-pause'),
    reset: document.getElementById('brick-breaker-reset')
  };

  const buttons = {
    left: document.getElementById('brick-breaker-left'),
    right: document.getElementById('brick-breaker-right')
  };

  const state = {
    phase: 'ready',
    score: 0,
    best: Number(window.localStorage?.getItem(STORAGE_KEY) || '0') || 0,
    lives: 3,
    combo: 0,
    bricks: [],
    bricksLeft: 0,
    paddle: { x: W / 2, y: PADDLE_Y, w: PADDLE_W, h: PADDLE_H, speed: 8.8 },
    ball: { x: W / 2, y: PADDLE_Y - PADDLE_H / 2 - BALL_R - 1, vx: 0, vy: 0, r: BALL_R, attached: true },
    particles: [],
    trail: [],
    pointerActive: false,
    keys: { left: false, right: false },
    autoServeOnAdvance: true,
    message: copy.readyStatus || 'Press Start or an arrow key to begin.',
    modeLabel: copy.modeLabel || 'Arcade',
    lastHitAt: 0,
    rafId: 0
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function saveBest() {
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, String(state.best));
    }
  }

  function buildBricks() {
    const bricks = [];
    for (let row = 0; row < BRICK_ROWS; row += 1) {
      for (let col = 0; col < BRICK_COLS; col += 1) {
        const x = BRICK_LEFT + col * (BRICK_W + BRICK_GAP);
        const y = BRICK_TOP + row * (BRICK_H + 10);
        bricks.push({
          row,
          col,
          x,
          y,
          w: BRICK_W,
          h: BRICK_H,
          hp: row < 2 ? 2 : 1,
          maxHp: row < 2 ? 2 : 1,
          alive: true
        });
      }
    }
    return bricks;
  }

  function setMessage(text) {
    state.message = text;
    syncHud();
  }

  function updateBest(score) {
    if (score > state.best) {
      state.best = score;
      saveBest();
    }
  }

  function phaseLabel() {
    if (state.phase === 'playing') return copy.playingLabel || 'Playing';
    if (state.phase === 'paused') return copy.pausedLabel || 'Paused';
    if (state.phase === 'won') return copy.wonLabel || 'Complete';
    if (state.phase === 'gameover') return copy.gameoverLabel || 'Game over';
    return copy.readyLabel || 'Ready';
  }

  function formatSpeed() {
    return `${Math.hypot(state.ball.vx, state.ball.vy).toFixed(1)} /s`;
  }

  function syncHud() {
    if (els.status) els.status.textContent = state.message;
    if (els.score) els.score.textContent = String(state.score);
    if (els.best) els.best.textContent = String(state.best);
    if (els.lives) els.lives.textContent = String(state.lives);
    if (els.combo) els.combo.textContent = String(state.combo);
    if (els.bricksLeft) els.bricksLeft.textContent = String(state.bricksLeft);
    if (els.speed) els.speed.textContent = formatSpeed();
    if (els.mode) {
      els.mode.dataset.state = state.phase;
      els.mode.textContent = `${state.modeLabel} · ${phaseLabel()}`;
    }
    if (els.hint) els.hint.textContent = copy.hint || '';
    if (els.start) {
      els.start.textContent = state.phase === 'paused'
        ? (copy.resumeButton || 'Resume')
        : state.phase === 'won' || state.phase === 'gameover'
          ? (copy.restartButton || 'Restart')
          : state.phase === 'playing'
            ? (copy.playingLabel || 'Playing')
            : (copy.startButton || 'Start');
      els.start.disabled = state.phase === 'playing' && !state.ball.attached;
    }
    if (els.pause) {
      els.pause.textContent = state.phase === 'paused'
        ? (copy.resumeButton || 'Resume')
        : (copy.pauseButton || 'Pause');
    }
    if (els.reset) els.reset.textContent = copy.resetButton || 'Reset';
  }

  function resetBall() {
    state.ball.attached = true;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.ball.x = state.paddle.x;
    state.ball.y = state.paddle.y - state.paddle.h / 2 - state.ball.r - 1;
  }

  function reset() {
    state.phase = 'ready';
    state.score = 0;
    state.lives = 3;
    state.combo = 0;
    state.bricks = buildBricks();
    state.bricksLeft = state.bricks.length;
    state.paddle.x = W / 2;
    state.paddle.y = PADDLE_Y;
    state.autoServeOnAdvance = true;
    state.message = copy.readyStatus || 'Press Start or an arrow key to begin.';
    resetBall();
    state.particles = [];
    state.trail = [];
    state.lastHitAt = 0;
    render();
    syncHud();
    return render_game_to_text();
  }

  function launchBall() {
    const offset = clamp((state.paddle.x - W / 2) / (W / 2), -0.9, 0.9);
    const angle = (-Math.PI / 2) + offset * 0.42;
    const speed = BASE_SPEED + Math.min(1.2, state.combo * 0.03);
    state.ball.attached = false;
    state.ball.vx = Math.cos(angle) * speed;
    state.ball.vy = Math.sin(angle) * speed;
    state.phase = 'playing';
    state.message = copy.playingStatus || 'The ball is in play. Keep the board open and watch the angle.';
    syncHud();
  }

  function beginOrResume() {
    if (state.phase === 'won' || state.phase === 'gameover') {
      reset();
      launchBall();
      return;
    }
    if (state.phase === 'paused') {
      state.phase = 'playing';
      state.message = copy.playingStatus || 'The ball is in play. Keep the board open and watch the angle.';
      syncHud();
      return;
    }
    if (state.phase === 'ready') {
      state.phase = 'playing';
      launchBall();
      return;
    }
    if (state.ball.attached) {
      launchBall();
    }
  }

  function togglePause() {
    if (state.phase === 'won' || state.phase === 'gameover') {
      reset();
      launchBall();
      return;
    }
    if (state.phase === 'paused') {
      state.phase = 'playing';
      state.message = copy.playingStatus || 'The ball is in play. Keep the board open and watch the angle.';
    } else if (state.phase === 'playing') {
      state.phase = 'paused';
      state.message = copy.pausedStatus || 'Paused. Resume when you are ready.';
    } else {
      beginOrResume();
      return;
    }
    syncHud();
  }

  function nudgePaddle(direction) {
    state.paddle.x = clamp(state.paddle.x + direction * state.paddle.speed * 2.2, state.paddle.w / 2 + 18, W - state.paddle.w / 2 - 18);
    if (state.phase === 'ready') {
      beginOrResume();
    }
    if (state.ball.attached) {
      resetBall();
    }
    render();
  }

  function addParticles(x, y, tint, count = 8) {
    const spread = [
      { x: -1.3, y: -2.2 },
      { x: -0.8, y: -1.6 },
      { x: -0.3, y: -2.6 },
      { x: 0.2, y: -1.8 },
      { x: 0.8, y: -2.4 },
      { x: 1.1, y: -1.4 },
      { x: -1.6, y: -0.7 },
      { x: 1.5, y: -0.8 }
    ];
    for (let i = 0; i < count; i += 1) {
      const vec = spread[i % spread.length];
      state.particles.push({
        x,
        y,
        vx: vec.x * 0.9,
        vy: vec.y * 0.9,
        life: 24 + (i % 4) * 2,
        size: 3 + (i % 3),
        tint
      });
    }
    if (state.particles.length > MAX_PARTICLES) {
      state.particles.splice(0, state.particles.length - MAX_PARTICLES);
    }
  }

  function circleRectHit(ball, rect) {
    const closestX = clamp(ball.x, rect.x, rect.x + rect.w);
    const closestY = clamp(ball.y, rect.y, rect.y + rect.h);
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    return dx * dx + dy * dy <= ball.r * ball.r;
  }

  function hitBrick(brick, prevX, prevY) {
    brick.hp -= 1;
    state.combo += 1;
    state.score += brick.maxHp === 2 ? 15 : 10;
    updateBest(state.score);
    state.lastHitAt = state.combo;
    state.ball.vx *= 1.02;
    state.ball.vy *= 1.02;
    const speed = Math.hypot(state.ball.vx, state.ball.vy);
    if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed;
      state.ball.vx *= scale;
      state.ball.vy *= scale;
    }

    const fromLeft = prevX + state.ball.r <= brick.x && state.ball.x + state.ball.r > brick.x;
    const fromRight = prevX - state.ball.r >= brick.x + brick.w && state.ball.x - state.ball.r < brick.x + brick.w;
    const fromTop = prevY + state.ball.r <= brick.y && state.ball.y + state.ball.r > brick.y;
    const fromBottom = prevY - state.ball.r >= brick.y + brick.h && state.ball.y - state.ball.r < brick.y + brick.h;

    if (fromLeft || fromRight) {
      state.ball.vx *= -1;
      state.ball.x = fromLeft ? brick.x - state.ball.r - 0.1 : brick.x + brick.w + state.ball.r + 0.1;
    } else if (fromTop || fromBottom) {
      state.ball.vy *= -1;
      state.ball.y = fromTop ? brick.y - state.ball.r - 0.1 : brick.y + brick.h + state.ball.r + 0.1;
    } else {
      state.ball.vy *= -1;
    }

    if (brick.hp <= 0) {
      brick.alive = false;
      state.bricksLeft -= 1;
    }

    state.message = state.bricksLeft === 0
      ? (copy.wonStatus || 'Board cleared. Start a new round or keep going in your head.')
      : (copy.brickHitStatus || 'Nice hit. Keep the angle open and look for the next brick.');
    addParticles(
      brick.x + brick.w / 2,
      brick.y + brick.h / 2,
      brick.maxHp === 2 ? '#f59e0b' : '#60a5fa'
    );

    if (state.bricksLeft <= 0) {
      state.phase = 'won';
      state.ball.attached = true;
      state.ball.vx = 0;
      state.ball.vy = 0;
      updateBest(state.score);
    }
  }

  function bouncePaddle(prevY) {
    const paddleTop = state.paddle.y - state.paddle.h / 2;
    const paddleLeft = state.paddle.x - state.paddle.w / 2;
    const paddleRight = paddleLeft + state.paddle.w;
    if (state.ball.vy <= 0) return false;
    if (state.ball.y + state.ball.r < paddleTop - 2) return false;
    if (state.ball.y - state.ball.r > state.paddle.y + state.paddle.h) return false;
    if (state.ball.x < paddleLeft - state.ball.r || state.ball.x > paddleRight + state.ball.r) return false;
    if (prevY + state.ball.r > paddleTop + 12) return false;

    state.ball.y = paddleTop - state.ball.r - 0.1;
    const offset = clamp((state.ball.x - state.paddle.x) / (state.paddle.w / 2), -1, 1);
    const speed = Math.min(MAX_SPEED, Math.max(BASE_SPEED, Math.hypot(state.ball.vx, state.ball.vy) * 1.012));
    const maxHorizontal = speed * 0.82;
    state.ball.vx = offset * maxHorizontal;
    state.ball.vy = -Math.sqrt(Math.max(1.8, speed * speed - state.ball.vx * state.ball.vx));
    state.combo = Math.max(0, state.combo);
    state.message = copy.paddleHitStatus || 'Good rebound. The next angle is now in your control.';
    addParticles(state.ball.x, paddleTop - 4, '#34d399', 6);
    return true;
  }

  function loseLife() {
    state.lives -= 1;
    state.combo = 0;
    if (state.lives <= 0) {
      state.phase = 'gameover';
      state.message = copy.gameoverStatus || 'Game over. Restart to try a cleaner run.';
      updateBest(state.score);
      state.ball.attached = true;
      state.ball.vx = 0;
      state.ball.vy = 0;
      return;
    }
    state.phase = 'ready';
    state.autoServeOnAdvance = false;
    state.message = copy.loseLifeStatus || 'Life lost. Re-center the paddle and serve again.';
    resetBall();
  }

  function updateParticles() {
    state.particles = state.particles.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.vy += 0.02;
      particle.life -= 1;
      return particle.life > 0;
    });
  }

  function updateTrail() {
    state.trail.push({ x: state.ball.x, y: state.ball.y });
    if (state.trail.length > 14) state.trail.shift();
  }

  function stepFrame() {
    if (state.phase !== 'playing') {
      if (state.phase === 'ready' && state.ball.attached) {
        resetBall();
      }
      return;
    }

    const prevX = state.ball.x;
    const prevY = state.ball.y;

    if (!state.ball.attached) {
      state.ball.x += state.ball.vx;
      state.ball.y += state.ball.vy;
    }

    if (state.ball.x - state.ball.r <= 18) {
      state.ball.x = 18 + state.ball.r;
      state.ball.vx *= -1;
      state.message = copy.wallHitStatus || 'Wall bounce. Keep the board open.';
      addParticles(state.ball.x, state.ball.y, '#93c5fd', 5);
    } else if (state.ball.x + state.ball.r >= W - 18) {
      state.ball.x = W - 18 - state.ball.r;
      state.ball.vx *= -1;
      state.message = copy.wallHitStatus || 'Wall bounce. Keep the board open.';
      addParticles(state.ball.x, state.ball.y, '#93c5fd', 5);
    }

    if (state.ball.y - state.ball.r <= TOP_Y) {
      state.ball.y = TOP_Y + state.ball.r;
      state.ball.vy *= -1;
      addParticles(state.ball.x, state.ball.y, '#bfdbfe', 4);
    }

    if (state.ball.y + state.ball.r >= FLOOR_Y) {
      loseLife();
      render();
      syncHud();
      return;
    }

    if (bouncePaddle(prevY)) {
      updateTrail();
      render();
      syncHud();
      return;
    }

    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      if (circleRectHit(state.ball, brick)) {
        hitBrick(brick, prevX, prevY);
        break;
      }
    }

    if (state.bricksLeft <= 0) {
      state.phase = 'won';
      updateBest(state.score);
    }

    updateTrail();
    state.score = Math.max(state.score, 0);
    updateBest(state.score);
  }

  function renderBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#eef2ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#c7d2fe';
    ctx.beginPath();
    ctx.arc(W - 72, 70, 96, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(148,163,184,.10)';
    ctx.lineWidth = 1;
    for (let y = 20; y < H; y += 28) {
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(W - 18, y);
      ctx.stroke();
    }
  }

  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function brickColor(brick) {
    const palettes = [
      ['#dbeafe', '#93c5fd'],
      ['#e0f2fe', '#38bdf8'],
      ['#fef3c7', '#f59e0b'],
      ['#fee2e2', '#f87171'],
      ['#dcfce7', '#22c55e']
    ];
    return palettes[brick.row % palettes.length];
  }

  function renderTrail() {
    for (let i = 0; i < state.trail.length; i += 1) {
      const point = state.trail[i];
      const alpha = (i + 1) / state.trail.length * 0.18;
      ctx.fillStyle = `rgba(59,130,246,${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, BALL_R * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderParticles() {
    for (const particle of state.particles) {
      ctx.save();
      ctx.globalAlpha = clamp(particle.life / 28, 0, 1);
      ctx.fillStyle = particle.tint;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function renderBricks() {
    for (const brick of state.bricks) {
      if (!brick.alive) continue;
      const [base, hi] = brickColor(brick);
      ctx.save();
      const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x + brick.w, brick.y + brick.h);
      gradient.addColorStop(0, base);
      gradient.addColorStop(1, hi);
      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(15,23,42,.12)';
      ctx.shadowBlur = 10;
      roundedRect(brick.x, brick.y, brick.w, brick.h, 11);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (brick.hp > 1) {
        ctx.fillStyle = 'rgba(15,23,42,.22)';
        ctx.font = '700 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('2', brick.x + brick.w / 2, brick.y + brick.h / 2 + 0.5);
      }
      ctx.restore();
    }
  }

  function renderPaddleAndBall() {
    ctx.save();
    const paddleX = state.paddle.x - state.paddle.w / 2;
    const paddleY = state.paddle.y - state.paddle.h / 2;
    const paddleGradient = ctx.createLinearGradient(paddleX, paddleY, paddleX + state.paddle.w, paddleY);
    paddleGradient.addColorStop(0, '#334155');
    paddleGradient.addColorStop(0.5, '#0f172a');
    paddleGradient.addColorStop(1, '#334155');
    ctx.fillStyle = paddleGradient;
    ctx.shadowColor = 'rgba(15,23,42,.18)';
    ctx.shadowBlur = 14;
    roundedRect(paddleX, paddleY, state.paddle.w, state.paddle.h, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.26)';
    roundedRect(paddleX + 4, paddleY + 3, state.paddle.w - 8, 3, 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(state.ball.x - 2, state.ball.y - 2, state.ball.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderOverlay() {
    if (state.phase !== 'won' && state.phase !== 'gameover') return;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,.72)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 34px "Noto Sans KR", "Segoe UI", sans-serif';
    ctx.fillText(state.phase === 'won' ? (copy.wonLabel || 'Complete') : (copy.gameoverLabel || 'Game over'), W / 2, H / 2 - 14);
    ctx.font = '600 15px "Noto Sans KR", "Segoe UI", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(state.phase === 'won'
      ? (copy.wonStatus || 'Board cleared. Start a new round or keep going in your head.')
      : (copy.gameoverStatus || 'Game over. Restart to try a cleaner run.'), W / 2, H / 2 + 22);
    ctx.restore();
  }

  function render() {
    renderBackground();
    renderBricks();
    renderTrail();
    renderParticles();
    renderPaddleAndBall();
    renderOverlay();
  }

  function updateStateForFrame() {
    if (state.phase === 'ready') {
      resetBall();
    }
    if (state.phase === 'playing') {
      if (state.keys.left && !state.keys.right) nudgePaddle(-0.35);
      if (state.keys.right && !state.keys.left) nudgePaddle(0.35);
      if (state.ball.attached) {
        resetBall();
      }
      stepFrame();
    }
    updateParticles();
    syncHud();
    render();
  }

  function advanceTime(ms = 0) {
    const steps = Math.max(1, Math.round(Number(ms || 0) / 16.6667));
    if (state.phase === 'ready' && state.autoServeOnAdvance) {
      state.autoServeOnAdvance = false;
      beginOrResume();
    }
    for (let i = 0; i < steps; i += 1) {
      stepFrame();
      updateParticles();
      if (state.phase === 'won' || state.phase === 'gameover') break;
    }
    syncHud();
    render();
    return render_game_to_text();
  }

  function render_game_to_text() {
    return JSON.stringify({
      slug: 'brick-breaker',
      phase: state.phase,
      score: state.score,
      best: state.best,
      lives: state.lives,
      combo: state.combo,
      bricksRemaining: state.bricksLeft,
      target: state.bricks.length,
      paddle: {
        x: Number(state.paddle.x.toFixed(2)),
        y: state.paddle.y,
        w: state.paddle.w,
        h: state.paddle.h
      },
      ball: {
        x: Number(state.ball.x.toFixed(2)),
        y: Number(state.ball.y.toFixed(2)),
        vx: Number(state.ball.vx.toFixed(2)),
        vy: Number(state.ball.vy.toFixed(2)),
        attached: state.ball.attached
      },
      bricks: state.bricks.filter((brick) => brick.alive).map((brick) => ({
        row: brick.row,
        col: brick.col,
        x: brick.x,
        y: brick.y,
        hp: brick.hp
      })),
      coordinateSystem: 'origin at top-left; x grows right, y grows down',
      qaReady: true
    });
  }

  function handlePointerDown(event) {
    state.pointerActive = true;
    canvas.setPointerCapture?.(event.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (W / rect.width);
    state.paddle.x = clamp(x, state.paddle.w / 2 + 18, W - state.paddle.w / 2 - 18);
    if (state.phase === 'ready') beginOrResume();
    if (state.ball.attached) resetBall();
    render();
  }

  function handlePointerMove(event) {
    if (!state.pointerActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (W / rect.width);
    state.paddle.x = clamp(x, state.paddle.w / 2 + 18, W - state.paddle.w / 2 - 18);
    if (state.ball.attached) resetBall();
    render();
  }

  function handlePointerUp() {
    state.pointerActive = false;
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      event.preventDefault();
      state.keys.left = true;
      nudgePaddle(-1);
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      event.preventDefault();
      state.keys.right = true;
      nudgePaddle(1);
    } else if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      if (state.phase === 'paused') {
        togglePause();
      } else if (state.phase === 'playing') {
        togglePause();
      } else {
        beginOrResume();
      }
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      reset();
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      toggleFullscreen();
    }
  }

  function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      state.keys.left = false;
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      state.keys.right = false;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function bind() {
    if (els.start) els.start.addEventListener('click', beginOrResume);
    if (els.pause) els.pause.addEventListener('click', togglePause);
    if (els.reset) els.reset.addEventListener('click', reset);
    if (buttons.left) buttons.left.addEventListener('click', () => nudgePaddle(-1));
    if (buttons.right) buttons.right.addEventListener('click', () => nudgePaddle(1));

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', render);
    document.addEventListener('fullscreenchange', render);
  }

  function realTimeLoop(now) {
    if (deterministicMode) return;
    if (!state.lastFrameTime) state.lastFrameTime = now;
    const elapsed = Math.min(40, now - state.lastFrameTime);
    state.lastFrameTime = now;
    if (state.phase === 'playing') {
      const frames = Math.max(1, Math.round(elapsed / 16.6667));
      for (let i = 0; i < frames; i += 1) {
        if (state.keys.left && !state.keys.right) {
          state.paddle.x = clamp(state.paddle.x - state.paddle.speed, state.paddle.w / 2 + 18, W - state.paddle.w / 2 - 18);
        }
        if (state.keys.right && !state.keys.left) {
          state.paddle.x = clamp(state.paddle.x + state.paddle.speed, state.paddle.w / 2 + 18, W - state.paddle.w / 2 - 18);
        }
        if (state.ball.attached) {
          resetBall();
        }
        stepFrame();
        updateParticles();
      }
      syncHud();
    }
    render();
    state.rafId = window.requestAnimationFrame(realTimeLoop);
  }

  bind();
  reset();
  window.QA_READY = true;
  window.__BRICK_BREAKER_QA_READY__ = true;
  window.render_game_to_text = render_game_to_text;
  window.advanceTime = advanceTime;
  window.reset = reset;
  window.resetGame = reset;

  if (!deterministicMode) {
    state.rafId = window.requestAnimationFrame(realTimeLoop);
  }
})();
