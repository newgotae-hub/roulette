(function () {
  const utils = window.RLTUtils || {};
  const config = window.__TEAM_GENERATOR_CONFIG__ || {};
  const Random = window.RLTRandom || {
    float: () => Math.random(),
    shuffle: (list) => {
      const out = Array.isArray(list) ? list.slice() : [];
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[j];
        out[j] = tmp;
      }
      return out;
    }
  };

  const STORAGE_KEY = "rlt-team-generator-state-v1";
  const MAX_TEAM_COUNT = 12;
  const DEFAULT_SAMPLE_RANDOM = [
    "김민수",
    "박지수",
    "이서연",
    "최도윤",
    "정하린",
    "윤시우",
    "한지호",
    "서가은"
  ];
  const DEFAULT_SAMPLE_BALANCED = [
    "김민수\t98",
    "박지수\t94",
    "이서연\t91",
    "최도윤\t89",
    "정하린\t84",
    "윤시우\t82",
    "한지호\t79",
    "서가은\t76",
    "임주원\t73",
    "오나현\t70",
    "강도현\t66",
    "신아린\t63"
  ];
  const messages = Object.assign({
    memberCount: "{count}명",
    teamCountText: "{count}팀",
    scoreText: "{value}점",
    scoreMissing: "평균 {score}",
    modeBeforeGenerate: "생성 전",
    modeRandom: "완전 랜덤",
    modeBalanced: "점수 밸런스",
    summaryNoScore: "점수 미사용",
    summaryParticipants: "참가자 {count}명",
    resultMetaDefault: "이름만 붙여넣어도 완전 랜덤으로 팀이 생성되고, 점수를 함께 넣으면 밸런스 모드로 총점 차이를 줄일 수 있습니다.",
    resultMetaBalanced: "입력된 점수 분포를 기준으로 여러 번 시뮬레이션 후 가장 안정적인 배치를 선택했습니다. 완벽한 동일 점수는 보장하지 않지만, 실제 점수 편차를 줄이도록 조정합니다.",
    resultMetaRandom: "참가자 명단을 무작위로 섞어 순수 랜덤 팀을 생성했습니다.",
    warningHeaderSkipped: "첫 줄 헤더는 자동으로 제외했습니다.",
    warningMaxTeamCount: "팀 수는 최대 {max}팀까지 지원합니다.",
    warningTeamCountAdjusted: "참가자 수보다 팀 수가 많아서 {count}팀으로 자동 조정했습니다.",
    warningBalancedFallback: "점수 정보가 없어서 이번 배정은 완전 랜덤으로 처리했습니다.",
    warningMissingScores: "점수 미입력 {count}명은 입력된 점수 평균 {score}으로 계산했습니다.",
    teamCountHintDefault: "명단을 붙여넣으면 예상 팀 크기가 바로 계산됩니다.",
    teamCountHintSingle: "참가자가 1명이면 팀 생성이 불가능합니다.",
    teamCountHintSized: "{teamCount}팀 기준 예상 인원수: {sizes}",
    validationMinPlayers: "최소 2명 이상의 명단이 필요합니다.",
    toastNeedPlayers: "참가자 2명 이상이 필요합니다.",
    cardEyebrow: "Team {index}",
    cardTitle: "{index}팀",
    cardAssigned: "{count}명 배정",
    cardBadgeAverage: "Average",
    cardBadgeMembers: "Members",
    cardTotalLabel: "총점 {value}",
    plainMode: "모드",
    plainTeamCount: "팀 수",
    plainParticipantCount: "참가자 수",
    plainTeamLayout: "팀 구성",
    plainGeneratedAt: "생성 시각",
    plainTeamHeader: "{index}팀 ({members}{scorePart})",
    plainScorePart: " / 총점 {total}",
    plainMemberScore: " - {score}",
    plainMemberMissing: " - 평균 반영 {score}",
    toastCsvSaved: "CSV 파일을 저장했습니다.",
    toastCopied: "팀 결과를 복사했습니다.",
    scoreToggleBtn: "점수입력",
    scorePanelTitle: "팀원 점수 입력",
    scoreSummaryPending: "팀을 나눈 뒤 팀원 점수를 개별 입력하면 팀 평균과 총점을 계산합니다.",
    scoreSummaryPartial: "{entered}/{count}명 입력됨. 모든 팀원 점수를 입력하면 승리 팀을 계산합니다.",
    scoreSummaryWinner: "승리 팀: {team} (평균 {average} / 총점 {total})",
    scoreSummaryTie: "공동 1위: {teams} (평균 {average})",
    scoreStatusPending: "대기",
    scoreStatusPartial: "입력중",
    scoreStatusWinner: "승리",
    scoreStatusTie: "동점",
    scoreInputLabel: "{member} 점수",
    scoreInputPlaceholder: "점수",
    scoreEntryProgress: "{entered}/{count}명 입력",
    cardMatchAverageLabel: "팀 평균",
    cardMatchTotalLabel: "총점 {value}",
    plainWinnerLabel: "승팀",
    plainTieLabel: "공동 1위",
    plainScoreProgressLabel: "점수 입력",
    plainTeamAverageLabel: "팀 평균",
    plainTeamTotalLabel: "팀 총점",
    plainMemberMatchScore: " / 개인 점수 {score}"
  }, config.messages || {});
  const localeTag = config.localeTag || document.documentElement.lang || "ko-KR";
  const SAMPLE_RANDOM = Array.isArray(config.sampleRandom) && config.sampleRandom.length
    ? config.sampleRandom
    : DEFAULT_SAMPLE_RANDOM;
  const SAMPLE_BALANCED = Array.isArray(config.sampleBalanced) && config.sampleBalanced.length
    ? config.sampleBalanced
    : DEFAULT_SAMPLE_BALANCED;

  function t(key, vars) {
    const template = Object.prototype.hasOwnProperty.call(messages, key) ? messages[key] : key;
    if (!vars) return String(template);
    return String(template).replace(/\{(\w+)\}/g, (_, name) => (
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : ""
    ));
  }

  const ui = {
    fullscreenToggle: document.getElementById("fullscreen-toggle"),
    fullscreenIcon: document.getElementById("fullscreen-icon"),
    fullscreenLabel: document.getElementById("fullscreen-label"),
    fullscreenHint: document.getElementById("fullscreen-hint"),
    fullscreenHintText: document.getElementById("fullscreen-hint-text"),
    workspaceShell: document.getElementById("workspace-shell"),
    rosterInput: document.getElementById("roster-input"),
    teamCount: document.getElementById("team-count"),
    teamCountHint: document.getElementById("team-count-hint"),
    quickTeamButtons: Array.from(document.querySelectorAll("[data-team-count]")),
    generateBtn: document.getElementById("generate-btn"),
    rerollBtn: document.getElementById("reroll-btn"),
    copyBtn: document.getElementById("copy-btn"),
    exportBtn: document.getElementById("export-btn"),
    resultPanel: document.getElementById("team-results-panel"),
    clearBtn: document.getElementById("clear-btn"),
    sampleRandomBtn: document.getElementById("sample-random-btn"),
    sampleBalancedBtn: document.getElementById("sample-balanced-btn"),
    participantCount: document.getElementById("participant-count"),
    scoredCount: document.getElementById("scored-count"),
    missingCount: document.getElementById("missing-count"),
    emptyState: document.getElementById("empty-state"),
    teamGrid: document.getElementById("team-grid"),
    toast: document.getElementById("toast"),
    scoreToggleBtn: null,
    scorePanel: null,
    scorePanelTitle: null,
    scorePanelBody: null,
    scoreStatusBadge: null
  };

  const state = {
    parsed: parseRoster(""),
    result: null,
    toastTimer: null,
    fullscreenHintTimer: null,
    scoreEditorOpen: false,
    memberScoreInputs: []
  };

  function fallbackDownload(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function downloadText(filename, content, mime) {
    if (typeof utils.downloadText === "function") {
      utils.downloadText(filename, content, mime);
      return;
    }
    fallbackDownload(filename, content);
  }

  function formatNow() {
    if (typeof utils.formatNow === "function") return utils.formatNow(localeTag);
    return new Date().toLocaleString(localeTag);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatScore(value) {
    if (!Number.isFinite(value)) return "-";
    if (Math.abs(value - Math.round(value)) < 1e-9) return String(Math.round(value));
    return value.toFixed(2).replace(/\.?0+$/, "");
  }

  function formatMemberCount(count) {
    return t("memberCount", { count });
  }

  function formatTeamCount(count) {
    return t("teamCountText", { count });
  }

  function formatScoreText(value) {
    return t("scoreText", { value: formatScore(value) });
  }

  function formatTeamLabel(index) {
    return t("cardTitle", { index: index + 1 });
  }

  function normalizeMemberScoreInputs(result) {
    if (!result) {
      state.memberScoreInputs = [];
      return;
    }

    state.memberScoreInputs = result.teams.map((team, teamIndex) => {
      const currentTeam = Array.isArray(state.memberScoreInputs[teamIndex]) ? state.memberScoreInputs[teamIndex] : [];
      return team.members.map((_, memberIndex) => {
        const value = currentTeam[memberIndex];
        return typeof value === "string" ? value : "";
      });
    });
  }

  function resetMemberScoreInputs(result) {
    state.memberScoreInputs = result ? result.teams.map((team) => team.members.map(() => "")) : [];
  }

  function parseScoreToken(raw) {
    const value = String(raw || "").trim().replace(/[%]/g, "");
    if (!value) return null;
    let normalized = value.replace(/\s+/g, "");
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normalized)) {
      normalized = normalized.replace(/,/g, "");
    } else if (/^-?\d+,\d+$/.test(normalized) && !normalized.includes(".")) {
      normalized = normalized.replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function parseRosterLine(line) {
    const cells = String(line || "").split(/\t+/).map((cell) => cell.trim()).filter(Boolean);
    if (cells.length >= 2) {
      let score = null;
      for (let i = cells.length - 1; i >= 1; i -= 1) {
        score = parseScoreToken(cells[i]);
        if (score !== null) break;
      }
      return { name: cells[0], score };
    }

    const matched = String(line || "").match(/^(.*?)(?:\s*(?:,|\/|\|)\s*|\s+)(-?\d+(?:[.,]\d+)?)$/);
    if (matched) {
      return {
        name: matched[1].trim(),
        score: parseScoreToken(matched[2])
      };
    }

    return { name: String(line || "").trim(), score: null };
  }

  function looksLikeHeaderLine(line) {
    const compact = String(line || "").toLowerCase().replace(/\s+/g, "");
    const hasName = /(?:name|participant|player|member|nickname|이름|참가자|플레이어|닉네임|名前|参加者|氏名|姓名|成员|成員|玩家|membre|joueur|nom|mitglied|teilnehmer|nome|participante|nombre|miembro|नाम|खिलाड़ी|सदस्य|الاسم|المشارك|اللاعب|имя|участник|игрок|nama|peserta|anggota|isim|oyuncu|ad|giocatore|membro|tên|ngườichơi|thànhviên|ชื่อ|ผู้เล่น|deelnemer|speler)/.test(compact);
    const hasScore = /(?:score|scores|rating|mmr|point|points|점수|실력|티어|スコア|点数|評点|分数|得分|評分|puntaje|puntuación|score|note|bewertung|punkte|pontuação|pontos|स्कोर|अंक|रेटिंग|النتيجة|النقاط|التقييم|очки|рейтинг|skor|puan|punteggio|punti|điểm|xếphạng|แต้ม|คะแนน|punten|beoordeling)/.test(compact);
    return hasName && (hasScore || compact === "name" || compact === "이름");
  }

  function parseRoster(rawText) {
    const lines = String(rawText || "").replace(/\r\n?/g, "\n").split("\n");
    const players = [];
    let headerSkipped = false;

    lines.forEach((line) => {
      const raw = line.trim();
      if (!raw) return;
      if (!headerSkipped && players.length === 0 && looksLikeHeaderLine(raw)) {
        headerSkipped = true;
        return;
      }
      const parsed = parseRosterLine(raw);
      if (!parsed.name) return;
      players.push({
        id: players.length + 1,
        name: parsed.name,
        score: parsed.score === null ? 0 : parsed.score,
        hasScore: parsed.score !== null
      });
    });

    const scoredPlayers = players.filter((player) => player.hasScore);
    const scoredCount = scoredPlayers.length;
    const missingCount = Math.max(0, players.length - scoredCount);
    const imputedScore = scoredCount > 0
      ? scoredPlayers.reduce((sum, player) => sum + player.score, 0) / scoredCount
      : null;

    const normalizedPlayers = players.map((player) => (
      player.hasScore
        ? player
        : Object.assign({}, player, {
          score: imputedScore === null ? 0 : imputedScore
        })
    ));

    return {
      players: normalizedPlayers,
      scoredCount,
      missingCount,
      headerSkipped,
      imputedScore
    };
  }

  function getSelectedMode() {
    const active = document.querySelector('input[name="team-mode"]:checked');
    return active ? active.value : "random";
  }

  function setSelectedMode(mode) {
    const target = document.querySelector(`input[name="team-mode"][value="${mode}"]`);
    if (target) target.checked = true;
  }

  function normalizeTeamCount(requested, playerCount) {
    const parsed = Math.floor(Number(requested) || 2);
    const maxByPlayers = playerCount >= 2 ? Math.min(playerCount, MAX_TEAM_COUNT) : MAX_TEAM_COUNT;
    return Math.min(Math.max(parsed, 2), Math.max(2, maxByPlayers));
  }

  function computeCapacities(playerCount, teamCount) {
    const base = Math.floor(playerCount / teamCount);
    const extra = playerCount % teamCount;
    return Array.from({ length: teamCount }, (_, index) => base + (index < extra ? 1 : 0));
  }

  function teamObjective(total, target) {
    const scale = Math.max(1, Math.abs(target));
    const diff = total - target;
    return (diff * diff) / scale;
  }

  function calcObjective(teams, targets) {
    return teams.reduce((sum, team, index) => sum + teamObjective(team.total, targets[index]), 0);
  }

  function createTeams(capacities) {
    return capacities.map((capacity, index) => ({
      id: index,
      capacity,
      members: [],
      total: 0
    }));
  }

  function sortTeamMembers(team, sortByScore) {
    if (!sortByScore) {
      team.members.sort((left, right) => left.id - right.id);
      return;
    }
    team.members.sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.hasScore !== right.hasScore) return Number(right.hasScore) - Number(left.hasScore);
      return left.id - right.id;
    });
  }

  function finalizeTeams(teams, sortByScore) {
    teams.forEach((team) => sortTeamMembers(team, sortByScore));
    return teams;
  }

  function assignRandomTeams(players, capacities) {
    const teams = createTeams(capacities);
    const slots = [];
    capacities.forEach((capacity, teamIndex) => {
      for (let i = 0; i < capacity; i += 1) slots.push(teamIndex);
    });

    const shuffledPlayers = Random.shuffle(players);
    const shuffledSlots = Random.shuffle(slots);
    shuffledPlayers.forEach((player, index) => {
      const team = teams[shuffledSlots[index]];
      team.members.push(player);
      team.total += player.score;
    });

    return finalizeTeams(teams, players.some((player) => player.hasScore));
  }

  function chooseBalancedTeam(teams, player, targets, averageScore) {
    const candidates = Random.shuffle(teams.filter((team) => team.members.length < team.capacity));
    let bestTeam = candidates[0];
    let bestPenalty = Infinity;

    candidates.forEach((team) => {
      const nextCount = team.members.length + 1;
      const nextTotal = team.total + player.score;
      const remainingCount = team.capacity - nextCount;
      const target = targets[team.id];
      const remainingTarget = target - nextTotal;
      const futurePenalty = remainingCount > 0
        ? Math.abs((remainingTarget / remainingCount) - averageScore)
        : 0;
      const penalty = (teamObjective(nextTotal, target) * 2.4)
        + (futurePenalty * 0.9)
        + ((nextCount / team.capacity) * 0.02);

      if (penalty < bestPenalty - 1e-9) {
        bestPenalty = penalty;
        bestTeam = team;
      }
    });

    return bestTeam;
  }

  function optimizeBalancedTeams(teams, targets) {
    const playerCount = teams.reduce((sum, team) => sum + team.members.length, 0);
    const maxPasses = playerCount > 90 ? 8 : 20;

    for (let pass = 0; pass < maxPasses; pass += 1) {
      let bestMove = null;
      let bestGain = 0;

      for (let leftIndex = 0; leftIndex < teams.length; leftIndex += 1) {
        for (let rightIndex = leftIndex + 1; rightIndex < teams.length; rightIndex += 1) {
          const leftTeam = teams[leftIndex];
          const rightTeam = teams[rightIndex];
          const basePairScore = teamObjective(leftTeam.total, targets[leftIndex]) + teamObjective(rightTeam.total, targets[rightIndex]);

          for (let a = 0; a < leftTeam.members.length; a += 1) {
            for (let b = 0; b < rightTeam.members.length; b += 1) {
              const leftPlayer = leftTeam.members[a];
              const rightPlayer = rightTeam.members[b];
              const nextLeftTotal = leftTeam.total - leftPlayer.score + rightPlayer.score;
              const nextRightTotal = rightTeam.total - rightPlayer.score + leftPlayer.score;
              const nextPairScore = teamObjective(nextLeftTotal, targets[leftIndex]) + teamObjective(nextRightTotal, targets[rightIndex]);
              const gain = basePairScore - nextPairScore;

              if (gain > bestGain + 1e-9) {
                bestGain = gain;
                bestMove = { leftIndex, rightIndex, a, b, nextLeftTotal, nextRightTotal };
              }
            }
          }
        }
      }

      if (!bestMove) break;

      const leftTeam = teams[bestMove.leftIndex];
      const rightTeam = teams[bestMove.rightIndex];
      const leftPlayer = leftTeam.members[bestMove.a];
      leftTeam.members[bestMove.a] = rightTeam.members[bestMove.b];
      rightTeam.members[bestMove.b] = leftPlayer;
      leftTeam.total = bestMove.nextLeftTotal;
      rightTeam.total = bestMove.nextRightTotal;
    }
  }

  function buildBalancedCandidate(players, capacities, targets) {
    const teams = createTeams(capacities);
    const averageScore = players.reduce((sum, player) => sum + player.score, 0) / Math.max(1, players.length);
    const ordered = players
      .map((player) => ({ player, tie: Random.float() }))
      .sort((left, right) => right.player.score - left.player.score || left.tie - right.tie)
      .map((entry) => entry.player);

    ordered.forEach((player) => {
      const targetTeam = chooseBalancedTeam(teams, player, targets, averageScore);
      targetTeam.members.push(player);
      targetTeam.total += player.score;
    });

    optimizeBalancedTeams(teams, targets);
    return {
      teams,
      objective: calcObjective(teams, targets)
    };
  }

  function assignBalancedTeams(players, capacities) {
    const totalScore = players.reduce((sum, player) => sum + player.score, 0);
    const targets = capacities.map((capacity) => totalScore * (capacity / Math.max(1, players.length)));
    const iterations = Math.min(200, Math.max(48, players.length * 6));
    let best = null;

    for (let i = 0; i < iterations; i += 1) {
      const candidate = buildBalancedCandidate(players, capacities, targets);
      if (!best || candidate.objective < best.objective) best = candidate;
    }

    return finalizeTeams(best ? best.teams : createTeams(capacities), true);
  }

  function buildResult(parsed, teams, requestedMode, effectiveMode, capacities) {
    const totals = teams.map((team) => team.total);
    const averages = teams.map((team) => team.members.length ? team.total / team.members.length : 0);
    const maxTotal = totals.length ? Math.max(...totals) : 0;
    const minTotal = totals.length ? Math.min(...totals) : 0;
    const maxAverage = averages.length ? Math.max(...averages) : 0;
    const minAverage = averages.length ? Math.min(...averages) : 0;

    return {
      teams,
      capacities,
      parsed,
      requestedMode,
      effectiveMode,
      generatedAt: formatNow(),
      totalScore: totals.reduce((sum, value) => sum + value, 0),
      teamAverages: averages,
      teamTotals: totals,
      scoreRange: maxTotal - minTotal,
      averageRange: maxAverage - minAverage
    };
  }

  function getScoreboardTone(mode) {
    switch (mode) {
      case "winner":
        return {
          panel: "border-emerald-200 bg-emerald-50/70",
          badge: "bg-emerald-100 text-emerald-700",
          card: "border-emerald-300 bg-emerald-50/40",
          pill: "bg-emerald-100 text-emerald-700"
        };
      case "tie":
        return {
          panel: "border-sky-200 bg-sky-50/70",
          badge: "bg-sky-100 text-sky-700",
          card: "border-sky-300 bg-sky-50/40",
          pill: "bg-sky-100 text-sky-700"
        };
      case "partial":
        return {
          panel: "border-amber-200 bg-amber-50/70",
          badge: "bg-amber-100 text-amber-700",
          card: "border-amber-300 bg-amber-50/40",
          pill: "bg-amber-100 text-amber-700"
        };
      default:
        return {
          panel: "border-slate-200 bg-slate-50/80",
          badge: "bg-slate-200 text-slate-600",
          card: "border-slate-200 bg-white/95",
          pill: "bg-slate-100 text-slate-600"
        };
    }
  }

  function getWinningTeamMode(scoreboard, teamIndex) {
    if (!scoreboard || !Array.isArray(scoreboard.winnerIndices)) return "none";
    if (scoreboard.mode !== "winner" && scoreboard.mode !== "tie") return "none";
    return scoreboard.winnerIndices.includes(teamIndex) ? scoreboard.mode : "none";
  }

  function computeScoreboard(result) {
    if (!result || !Array.isArray(result.teams) || !result.teams.length) {
      return {
        mode: "empty",
        teamStats: [],
        enteredMemberCount: 0,
        totalMembers: 0,
        winnerIndices: [],
        topAverage: null,
        hasAny: false,
        isComplete: false,
        summaryBody: t("scoreSummaryPending"),
        statusLabel: t("scoreStatusPending")
      };
    }

    normalizeMemberScoreInputs(result);

    const teamStats = result.teams.map((team, teamIndex) => {
      const memberValues = team.members.map((_, memberIndex) => parseScoreToken(state.memberScoreInputs[teamIndex][memberIndex]));
      const enteredCount = memberValues.filter((value) => value !== null).length;
      const total = memberValues.reduce((sum, value) => sum + (value === null ? 0 : value), 0);
      const average = enteredCount ? total / enteredCount : null;
      return {
        memberValues,
        enteredCount,
        pendingCount: Math.max(0, team.members.length - enteredCount),
        total,
        average,
        complete: enteredCount === team.members.length && team.members.length > 0
      };
    });

    const enteredMemberCount = teamStats.reduce((sum, teamStat) => sum + teamStat.enteredCount, 0);
    const totalMembers = result.teams.reduce((sum, team) => sum + team.members.length, 0);
    const allComplete = teamStats.length > 0 && teamStats.every((teamStat) => teamStat.complete);

    if (enteredMemberCount === 0) {
      return {
        mode: "empty",
        teamStats,
        enteredMemberCount,
        totalMembers,
        winnerIndices: [],
        topAverage: null,
        hasAny: false,
        isComplete: false,
        summaryBody: t("scoreSummaryPending"),
        statusLabel: t("scoreStatusPending")
      };
    }

    if (!allComplete) {
      return {
        mode: "partial",
        teamStats,
        enteredMemberCount,
        totalMembers,
        winnerIndices: [],
        topAverage: null,
        hasAny: true,
        isComplete: false,
        summaryBody: t("scoreSummaryPartial", {
          entered: enteredMemberCount,
          count: totalMembers
        }),
        statusLabel: t("scoreStatusPartial")
      };
    }

    const topAverage = Math.max(...teamStats.map((teamStat) => teamStat.average));
    const winnerIndices = teamStats.reduce((list, teamStat, index) => {
      if (Math.abs(teamStat.average - topAverage) < 1e-9) list.push(index);
      return list;
    }, []);
    const teamLabels = winnerIndices.map((index) => formatTeamLabel(index)).join(", ");

    if (winnerIndices.length === 1) {
      const winnerTeamStat = teamStats[winnerIndices[0]];
      return {
        mode: "winner",
        teamStats,
        enteredMemberCount,
        totalMembers,
        winnerIndices,
        topAverage,
        hasAny: true,
        isComplete: true,
        summaryBody: t("scoreSummaryWinner", {
          team: teamLabels,
          average: formatScoreText(topAverage),
          total: formatScoreText(winnerTeamStat.total)
        }),
        statusLabel: t("scoreStatusWinner")
      };
    }

    return {
      mode: "tie",
      teamStats,
      enteredMemberCount,
      totalMembers,
      winnerIndices,
      topAverage,
      hasAny: true,
      isComplete: true,
      summaryBody: t("scoreSummaryTie", {
        teams: teamLabels,
        average: formatScoreText(topAverage)
      }),
      statusLabel: t("scoreStatusTie")
    };
  }

  function ensureScoreUi() {
    if (!ui.scoreToggleBtn && ui.rerollBtn && ui.rerollBtn.parentElement) {
      const button = document.createElement("button");
      button.id = "score-toggle-btn";
      button.type = "button";
      button.className = "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";
      button.textContent = t("scoreToggleBtn");
      button.setAttribute("aria-expanded", "false");
      ui.rerollBtn.insertAdjacentElement("beforebegin", button);
      ui.scoreToggleBtn = button;
    }

    if (!ui.scorePanel && ui.resultPanel && ui.emptyState) {
      const panel = document.createElement("section");
      panel.id = "score-panel";
      panel.className = "hidden mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4";
      panel.innerHTML = `
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 id="score-panel-title" class="text-sm font-semibold text-slate-900"></h3>
            <p id="score-panel-body" class="mt-1 max-w-2xl text-sm leading-6 text-slate-600"></p>
          </div>
          <span id="score-status-badge" class="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"></span>
        </div>
      `;
      ui.resultPanel.insertBefore(panel, ui.emptyState);
      ui.scorePanel = panel;
      ui.scorePanelTitle = document.getElementById("score-panel-title");
      ui.scorePanelBody = document.getElementById("score-panel-body");
      ui.scoreStatusBadge = document.getElementById("score-status-badge");
    }
  }

  function updateScoreToggleButton() {
    if (!ui.scoreToggleBtn) return;
    const active = !!state.scoreEditorOpen;
    ui.scoreToggleBtn.textContent = t("scoreToggleBtn");
    ui.scoreToggleBtn.setAttribute("aria-expanded", active ? "true" : "false");
    ui.scoreToggleBtn.classList.toggle("bg-slate-900", active);
    ui.scoreToggleBtn.classList.toggle("border-slate-900", active);
    ui.scoreToggleBtn.classList.toggle("text-white", active);
    ui.scoreToggleBtn.classList.toggle("bg-white", !active);
    ui.scoreToggleBtn.classList.toggle("border-slate-200", !active);
    ui.scoreToggleBtn.classList.toggle("text-slate-600", !active);
  }

  function getTeamMetricView(team, teamStat, showRosterScores) {
    if (teamStat && teamStat.enteredCount > 0) {
      return {
        label: t("cardMatchAverageLabel"),
        value: formatScoreText(teamStat.average),
        meta: `${t("cardMatchTotalLabel", { value: formatScore(teamStat.total) })} · ${t("scoreEntryProgress", { entered: teamStat.enteredCount, count: team.members.length })}`
      };
    }

    if (showRosterScores) {
      return {
        label: t("cardBadgeAverage"),
        value: formatScoreText(team.members.length ? team.total / team.members.length : 0),
        meta: t("cardTotalLabel", { value: formatScore(team.total) })
      };
    }

    return {
      label: t("cardBadgeMembers"),
      value: formatMemberCount(team.members.length),
      meta: ""
    };
  }

  function syncRenderedScoreState(result) {
    if (!result || !ui.teamGrid) return;
    const showRosterScores = result.parsed.scoredCount > 0 || result.effectiveMode === "balanced";
    const scoreboard = computeScoreboard(result);

    result.teams.forEach((team, index) => {
      const teamStat = scoreboard.teamStats[index];
      const winningMode = getWinningTeamMode(scoreboard, index);
      const tone = getScoreboardTone(winningMode);
      const view = getTeamMetricView(team, teamStat, showRosterScores);
      const card = ui.teamGrid.querySelector(`[data-team-card="${index}"]`);
      const pill = ui.teamGrid.querySelector(`[data-team-winner-pill="${index}"]`);
      const statLabel = ui.teamGrid.querySelector(`[data-team-stat-label="${index}"]`);
      const statValue = ui.teamGrid.querySelector(`[data-team-stat-value="${index}"]`);
      const statMeta = ui.teamGrid.querySelector(`[data-team-stat-meta="${index}"]`);

      if (card) {
        card.className = `rounded-2xl border p-4 shadow-sm ${winningMode === "none" ? "border-slate-200 bg-white/95" : tone.card}`;
      }
      if (pill) {
        if (winningMode === "none") {
          pill.className = "hidden";
          pill.textContent = "";
        } else {
          pill.className = `mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.pill}`;
          pill.textContent = winningMode === "winner" ? t("scoreStatusWinner") : t("scoreStatusTie");
        }
      }
      if (statLabel) statLabel.textContent = view.label;
      if (statValue) statValue.textContent = view.value;
      if (statMeta) {
        statMeta.textContent = view.meta;
        statMeta.classList.toggle("hidden", !view.meta);
      }

      team.members.forEach((_, memberIndex) => {
        const input = ui.teamGrid.querySelector(`[data-member-score-input="${index}-${memberIndex}"]`);
        if (!input) return;
        const nextValue = state.memberScoreInputs[index][memberIndex];
        if (document.activeElement !== input && input.value !== nextValue) {
          input.value = nextValue;
        }
      });
    });
  }

  function renderSummary(result) {
    ensureScoreUi();
    updateScoreToggleButton();

    if (!ui.scorePanel) return;

    if (!result) {
      ui.scorePanel.classList.add("hidden");
      return;
    }

    const scoreboard = computeScoreboard(result);
    const shouldShowPanel = state.scoreEditorOpen || scoreboard.hasAny;

    if (!shouldShowPanel) {
      ui.scorePanel.classList.add("hidden");
      return;
    }

    const tone = getScoreboardTone(scoreboard.mode);
    ui.scorePanel.className = `mt-4 rounded-[1.5rem] border p-4 ${tone.panel}`;
    ui.scorePanelTitle.textContent = t("scorePanelTitle");
    ui.scorePanelBody.textContent = scoreboard.summaryBody;
    ui.scoreStatusBadge.className = `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`;
    ui.scoreStatusBadge.textContent = scoreboard.statusLabel;
    ui.scorePanel.classList.remove("hidden");
  }

  function renderTeams(result) {
    if (!result) {
      ui.emptyState.classList.remove("hidden");
      ui.teamGrid.innerHTML = "";
      return;
    }

    normalizeMemberScoreInputs(result);
    const showRosterScores = result.parsed.scoredCount > 0 || result.effectiveMode === "balanced";
    const scoreboard = computeScoreboard(result);
    const showMemberScoreInputs = state.scoreEditorOpen;
    ui.emptyState.classList.add("hidden");
    ui.teamGrid.innerHTML = result.teams.map((team, index) => {
      const teamStat = scoreboard.teamStats[index];
      const winningMode = getWinningTeamMode(scoreboard, index);
      const highlightTone = getScoreboardTone(winningMode);
      const articleTone = winningMode === "none" ? "border-slate-200 bg-white/95" : highlightTone.card;
      const metricView = getTeamMetricView(team, teamStat, showRosterScores);
      const memberHtml = team.members.map((member, memberIndex) => {
        const rosterScoreBadge = showRosterScores
          ? `<span class="inline-flex items-center rounded-full bg-slate-900/5 px-2 py-1 text-[11px] font-semibold text-slate-600">${member.hasScore ? formatScoreText(member.score) : t("scoreMissing", { score: formatScoreText(member.score) })}</span>`
          : "";
        const scoreInputHtml = showMemberScoreInputs
          ? `
            <input
              data-member-score-input="${index}-${memberIndex}"
              data-team-index="${index}"
              data-member-index="${memberIndex}"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              class="w-20 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-right text-xs font-semibold text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="${escapeHtml(t("scoreInputPlaceholder"))}"
              value="${escapeHtml(state.memberScoreInputs[index][memberIndex])}"
              aria-label="${escapeHtml(t("scoreInputLabel", { member: member.name }))}"
            />
          `
          : "";
        const rightColumnHtml = rosterScoreBadge || scoreInputHtml
          ? `
            <div class="flex shrink-0 flex-col items-end gap-2">
              ${rosterScoreBadge}
              ${scoreInputHtml}
            </div>
          `
          : "";
        return `
          <li class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
            <span class="min-w-0 truncate text-sm font-medium text-slate-800">${escapeHtml(member.name)}</span>
            ${rightColumnHtml}
          </li>
        `;
      }).join("");
      const winnerPillHtml = winningMode === "none"
        ? `<p data-team-winner-pill="${index}" class="hidden"></p>`
        : `<p data-team-winner-pill="${index}" class="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${highlightTone.pill}">${winningMode === "winner" ? t("scoreStatusWinner") : t("scoreStatusTie")}</p>`;
      const statMetaHtml = metricView.meta
        ? `<p data-team-stat-meta="${index}" class="mt-1 text-[11px] text-slate-300">${metricView.meta}</p>`
        : `<p data-team-stat-meta="${index}" class="hidden"></p>`;

      return `
        <article data-team-card="${index}" class="rounded-2xl border p-4 shadow-sm ${articleTone}">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">${t("cardEyebrow", { index: index + 1 })}</p>
              <h3 class="mt-1 text-xl font-semibold tracking-tight text-slate-900">${t("cardTitle", { index: index + 1 })}</h3>
              <p class="mt-1 text-sm text-slate-500">${t("cardAssigned", { count: team.members.length })}</p>
              ${winnerPillHtml}
            </div>
            <div class="rounded-2xl bg-slate-900 px-3 py-2 text-right text-white shadow-sm">
              <p data-team-stat-label="${index}" class="text-[11px] uppercase tracking-[0.18em] text-slate-300">${metricView.label}</p>
              <p data-team-stat-value="${index}" class="mt-1 text-lg font-semibold">${metricView.value}</p>
              ${statMetaHtml}
            </div>
          </div>
          <ul class="mt-4 space-y-2">${memberHtml}</ul>
        </article>
      `;
    }).join("");
    syncRenderedScoreState(result);
  }

  function updateActionState() {
    const canGenerate = state.parsed.players.length >= 2;
    ui.generateBtn.disabled = !canGenerate;
    ui.rerollBtn.disabled = !canGenerate;
    ui.copyBtn.disabled = !state.result;
    ui.exportBtn.disabled = !state.result;
    if (ui.scoreToggleBtn) ui.scoreToggleBtn.disabled = !state.result;
  }

  function setQuickTeamButtonsActive(teamCount) {
    ui.quickTeamButtons.forEach((button) => {
      const active = Number(button.dataset.teamCount) === teamCount;
      button.classList.toggle("bg-slate-900", active);
      button.classList.toggle("text-white", active);
      button.classList.toggle("border-slate-900", active);
      button.classList.toggle("bg-white", !active);
      button.classList.toggle("text-slate-600", !active);
      button.classList.toggle("border-slate-200", !active);
    });
  }

  function invalidateResult() {
    state.result = null;
    state.scoreEditorOpen = false;
    state.memberScoreInputs = [];
    renderSummary(null);
    renderTeams(null);
    updateActionState();
  }

  function refreshPreview() {
    state.parsed = parseRoster(ui.rosterInput.value);
    const requestedTeamCount = Math.floor(Number(ui.teamCount.value) || 2);
    const effectiveTeamCount = normalizeTeamCount(requestedTeamCount, state.parsed.players.length);
    const requestedMode = getSelectedMode();
    const effectiveMode = requestedMode === "balanced" && state.parsed.scoredCount === 0 ? "random" : requestedMode;

    ui.participantCount.textContent = formatMemberCount(state.parsed.players.length);
    ui.scoredCount.textContent = formatMemberCount(state.parsed.scoredCount);
    ui.missingCount.textContent = formatMemberCount(state.parsed.missingCount);

    if (state.parsed.players.length >= 2) {
      const plan = computeCapacities(state.parsed.players.length, effectiveTeamCount);
      ui.teamCountHint.textContent = t("teamCountHintSized", {
        teamCount: effectiveTeamCount,
        sizes: plan.map((size) => formatMemberCount(size)).join(" / ")
      });
    } else if (state.parsed.players.length === 1) {
      ui.teamCountHint.textContent = t("teamCountHintSingle");
    } else {
      ui.teamCountHint.textContent = t("teamCountHintDefault");
    }

    setQuickTeamButtonsActive(Math.min(effectiveTeamCount, MAX_TEAM_COUNT));
    updateActionState();
    saveState();
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        roster: ui.rosterInput.value,
        teamCount: ui.teamCount.value,
        mode: getSelectedMode()
      }));
    } catch (error) {}
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved.roster === "string") ui.rosterInput.value = saved.roster;
      if (saved && saved.teamCount) ui.teamCount.value = String(saved.teamCount);
      if (saved && saved.mode) setSelectedMode(saved.mode);
    } catch (error) {}
  }

  function generateTeams() {
    state.parsed = parseRoster(ui.rosterInput.value);
    const requestedTeamCount = Math.floor(Number(ui.teamCount.value) || 2);

    if (state.parsed.players.length < 2) {
      invalidateResult();
      showToast(t("toastNeedPlayers"));
      return;
    }

    const effectiveTeamCount = normalizeTeamCount(requestedTeamCount, state.parsed.players.length);
    ui.teamCount.value = String(effectiveTeamCount);

    const requestedMode = getSelectedMode();
    const effectiveMode = requestedMode === "balanced" && state.parsed.scoredCount === 0 ? "random" : requestedMode;
    const capacities = computeCapacities(state.parsed.players.length, effectiveTeamCount);
    const keepScoreEditorOpen = state.scoreEditorOpen;
    const teams = effectiveMode === "balanced"
      ? assignBalancedTeams(state.parsed.players, capacities)
      : assignRandomTeams(state.parsed.players, capacities);

    state.result = buildResult(state.parsed, teams, requestedMode, effectiveMode, capacities);
    state.scoreEditorOpen = keepScoreEditorOpen;
    resetMemberScoreInputs(state.result);
    renderSummary(state.result);
    renderTeams(state.result);
    updateActionState();
    saveState();
  }

  function buildPlainText(result) {
    const scoreboard = computeScoreboard(result);
    const lines = [
      `${t("plainMode")}: ${result.effectiveMode === "balanced" ? t("modeBalanced") : t("modeRandom")}`,
      `${t("plainTeamCount")}: ${result.teams.length}`,
      `${t("plainParticipantCount")}: ${result.parsed.players.length}`,
      `${t("plainTeamLayout")}: ${result.teams.map((team) => formatMemberCount(team.members.length)).join(" / ")}`,
      `${t("plainGeneratedAt")}: ${result.generatedAt}`
    ];

    if (scoreboard.mode === "winner") {
      const winnerTeamStat = scoreboard.teamStats[scoreboard.winnerIndices[0]];
      lines.push(`${t("plainWinnerLabel")}: ${formatTeamLabel(scoreboard.winnerIndices[0])} (${t("plainTeamAverageLabel")}: ${formatScoreText(scoreboard.topAverage)}, ${t("plainTeamTotalLabel")}: ${formatScoreText(winnerTeamStat.total)})`);
    } else if (scoreboard.mode === "tie") {
      lines.push(`${t("plainTieLabel")}: ${scoreboard.winnerIndices.map((index) => formatTeamLabel(index)).join(", ")} (${t("plainTeamAverageLabel")}: ${formatScoreText(scoreboard.topAverage)})`);
    } else if (scoreboard.mode === "partial") {
      lines.push(`${t("plainScoreProgressLabel")}: ${scoreboard.enteredMemberCount}/${scoreboard.totalMembers}`);
    }

    result.teams.forEach((team, index) => {
      const scorePart = (result.parsed.scoredCount > 0 || result.effectiveMode === "balanced")
        ? t("plainScorePart", { total: formatScoreText(team.total) })
        : "";
      const teamStat = scoreboard.teamStats[index];
      lines.push("");
      lines.push(t("plainTeamHeader", {
        index: index + 1,
        members: formatMemberCount(team.members.length),
        scorePart
      }));
      if (teamStat && teamStat.enteredCount > 0) {
        lines.push(`${t("plainScoreProgressLabel")}: ${teamStat.enteredCount}/${team.members.length}`);
        lines.push(`${t("plainTeamAverageLabel")}: ${formatScoreText(teamStat.average)}`);
        lines.push(`${t("plainTeamTotalLabel")}: ${formatScoreText(teamStat.total)}`);
      }
      team.members.forEach((member, memberIndex) => {
        const rosterSuffix = (result.parsed.scoredCount > 0 || result.effectiveMode === "balanced")
          ? (member.hasScore
            ? t("plainMemberScore", { score: formatScoreText(member.score) })
            : t("plainMemberMissing", { score: formatScoreText(member.score) }))
          : "";
        const matchValue = teamStat ? teamStat.memberValues[memberIndex] : null;
        const matchSuffix = matchValue === null ? "" : t("plainMemberMatchScore", { score: formatScoreText(matchValue) });
        lines.push(`${member.name}${rosterSuffix}${matchSuffix}`);
      });
    });

    return lines.join("\n");
  }

  function csvEscape(value) {
    const text = String(value == null ? "" : value);
    if (!/[,"\n]/.test(text)) return text;
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  function exportCsv() {
    if (!state.result) return;
    const scoreboard = computeScoreboard(state.result);
    const rows = [["team_no", "team_label", "member_name", "score", "score_input", "team_size", "team_total", "mode", "generated_at", "member_match_score", "team_match_average", "team_match_total", "winner_status"]];
    state.result.teams.forEach((team, index) => {
      const teamStat = scoreboard.teamStats[index];
      const winnerStatus = scoreboard.winnerIndices.includes(index)
        ? (scoreboard.mode === "winner" ? "winner" : scoreboard.mode === "tie" ? "tie" : "")
        : "";
      team.members.forEach((member, memberIndex) => {
        rows.push([
          index + 1,
          `${index + 1}팀`,
          member.name,
          member.score,
          member.hasScore ? "yes" : "no",
          team.members.length,
          team.total,
          state.result.effectiveMode,
          state.result.generatedAt,
          teamStat.memberValues[memberIndex] === null ? "" : teamStat.memberValues[memberIndex],
          teamStat.average === null ? "" : teamStat.average,
          teamStat.enteredCount > 0 ? teamStat.total : "",
          winnerStatus
        ]);
      });
    });
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    downloadText(`team-generator-${Date.now()}.csv`, `\uFEFF${csv}`, "text/csv;charset=utf-8");
    showToast(t("toastCsvSaved"));
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "readonly");
    area.style.position = "fixed";
    area.style.top = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  async function copyResults() {
    if (!state.result) return;
    const text = buildPlainText(state.result);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      showToast(t("toastCopied"));
    } catch (error) {
      fallbackCopy(text);
      showToast(t("toastCopied"));
    }
  }

  function showToast(message) {
    if (!ui.toast) return;
    ui.toast.textContent = message;
    ui.toast.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
    ui.toast.classList.add("opacity-100", "translate-y-0");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => {
      ui.toast.classList.add("opacity-0", "translate-y-3", "pointer-events-none");
      ui.toast.classList.remove("opacity-100", "translate-y-0");
    }, 1800);
  }

  function getFullscreenEnterLabel() {
    if (!ui.fullscreenLabel) return "";
    return ui.fullscreenLabel.dataset.enter || ui.fullscreenLabel.textContent || "";
  }

  function getFullscreenExitLabel() {
    if (!ui.fullscreenLabel) return "";
    return ui.fullscreenLabel.dataset.exit || getFullscreenEnterLabel();
  }

  function updateFullscreenButton() {
    if (!ui.fullscreenLabel || !ui.fullscreenIcon) return;
    const active = !!document.fullscreenElement;
    ui.fullscreenIcon.setAttribute("icon", active ? "solar:minimize-linear" : "solar:maximize-linear");
    ui.fullscreenLabel.textContent = active ? getFullscreenExitLabel() : getFullscreenEnterLabel();
  }

  function showFullscreenHint() {
    if (!ui.fullscreenHint || window.innerWidth < 768) return;
    ui.fullscreenHint.classList.remove("hidden");
    window.clearTimeout(state.fullscreenHintTimer);
    state.fullscreenHintTimer = window.setTimeout(() => {
      ui.fullscreenHint.classList.add("hidden");
    }, 2400);
  }

  function scrollWorkspaceIntoView() {
    if (!ui.workspaceShell) return;
    const top = ui.workspaceShell.getBoundingClientRect().top + window.scrollY - 8;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
  }

  function syncFullscreenLayout() {
    const active = !!document.fullscreenElement;
    document.body.classList.toggle("team-fullscreen-active", active);
    updateFullscreenButton();
    if (!active) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollWorkspaceIntoView);
    });
  }

  async function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    if (ui.fullscreenHint) ui.fullscreenHint.classList.add("hidden");
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {}
  }

  function bindEvents() {
    if (ui.fullscreenToggle) ui.fullscreenToggle.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", syncFullscreenLayout);

    ui.rosterInput.addEventListener("input", () => {
      invalidateResult();
      refreshPreview();
    });

    ui.teamCount.addEventListener("input", () => {
      invalidateResult();
      refreshPreview();
    });

    document.querySelectorAll('input[name="team-mode"]').forEach((input) => {
      input.addEventListener("change", () => {
        invalidateResult();
        refreshPreview();
      });
    });

    ui.quickTeamButtons.forEach((button) => {
      button.addEventListener("click", () => {
        ui.teamCount.value = button.dataset.teamCount;
        invalidateResult();
        refreshPreview();
      });
    });

    ui.generateBtn.addEventListener("click", generateTeams);
    ui.rerollBtn.addEventListener("click", generateTeams);
    ui.copyBtn.addEventListener("click", copyResults);
    ui.exportBtn.addEventListener("click", exportCsv);
    if (ui.scoreToggleBtn) {
      ui.scoreToggleBtn.addEventListener("click", () => {
        if (!state.result) return;
        state.scoreEditorOpen = !state.scoreEditorOpen;
        renderSummary(state.result);
        renderTeams(state.result);
        updateActionState();
      });
    }
    if (ui.teamGrid) {
      ui.teamGrid.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-member-score-input") || !state.result) return;
        const teamIndex = Number(target.getAttribute("data-team-index"));
        const memberIndex = Number(target.getAttribute("data-member-index"));
        if (!Number.isInteger(teamIndex) || !Number.isInteger(memberIndex) || !state.memberScoreInputs[teamIndex]) return;
        state.memberScoreInputs[teamIndex][memberIndex] = target.value;
        renderSummary(state.result);
        syncRenderedScoreState(state.result);
      });
    }

    if (ui.clearBtn) {
      ui.clearBtn.addEventListener("click", () => {
        ui.rosterInput.value = "";
        invalidateResult();
        refreshPreview();
      });
    }

    if (ui.sampleRandomBtn) {
      ui.sampleRandomBtn.addEventListener("click", () => {
        ui.rosterInput.value = SAMPLE_RANDOM.join("\n");
        ui.teamCount.value = "2";
        setSelectedMode("random");
        invalidateResult();
        refreshPreview();
        generateTeams();
      });
    }

    if (ui.sampleBalancedBtn) {
      ui.sampleBalancedBtn.addEventListener("click", () => {
        ui.rosterInput.value = SAMPLE_BALANCED.join("\n");
        ui.teamCount.value = "3";
        setSelectedMode("balanced");
        invalidateResult();
        refreshPreview();
        generateTeams();
      });
    }
  }

  function init() {
    ensureScoreUi();
    loadState();
    renderSummary(null);
    renderTeams(null);
    bindEvents();
    refreshPreview();
    syncFullscreenLayout();
    showFullscreenHint();
  }

  init();
})();
