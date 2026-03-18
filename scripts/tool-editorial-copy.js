const EDITORIAL_LABELS = {
  ko: {
    title: '실전 운영 기준',
    fit: '잘 맞는 상황',
    avoid: '다른 도구가 나은 상황',
    checklist: '운영 전 체크',
    mistakes: '자주 생기는 오해'
  },
  en: {
    title: 'Practical use guide',
    fit: 'Best fit',
    avoid: 'Use another tool when',
    checklist: 'Before you start',
    mistakes: 'Common mistakes'
  }
};

const TOOL_EDITORIAL_COPY = {
  ko: {
    roulette: {
      intro: '룰렛은 참가자 명단을 화면에 그대로 보여 주면서 한 명씩 뽑아야 할 때 가장 설명이 쉬운 추첨 방식입니다.',
      fit: '행사 경품, 발표자 선정, 질문 순서처럼 누가 후보였는지를 모두가 함께 봐야 하는 상황에 잘 맞습니다.',
      avoid: '좌석번호·응모권처럼 숫자 범위가 핵심이거나, 참가자와 결과를 한 번에 매칭해야 하면 번호 추첨기나 사다리타기가 더 적합합니다.',
      checklist: '중복 이름이 실제 중복 참여인지 확인하고, 당첨자 제외와 재추첨 규칙을 시작 전에 공지한 뒤, 여러 라운드면 기록을 저장해 두는 편이 좋습니다.',
      mistakes: '애니메이션 길이가 확률을 바꾸는 것은 아니며, 같은 이름을 여러 번 넣으면 그 수만큼 확률이 올라가고, 결과 후 명단을 바꾸면 공정성 설명이 어려워집니다.'
    },
    luckydraw: {
      intro: '번호 추첨기는 사람 이름보다 번호 자체가 결과의 기준일 때 더 명확한 도구입니다.',
      fit: '응모권, 좌석 번호, 대기 번호, 쿠폰 코드처럼 범위와 중복 허용 여부를 먼저 설명해야 하는 추첨에 잘 맞습니다.',
      avoid: '참가자 목록을 그대로 공개해야 하거나 결과를 상품·벌칙과 연결해 보여줘야 하면 룰렛이나 사다리타기가 더 직관적입니다.',
      checklist: '최소값과 최대값, 중복 허용 여부, 재추첨 조건을 먼저 정하고 실제 사용 번호 범위가 맞는지 한 번 더 검수해야 합니다.',
      mistakes: '번호 범위를 잘못 잡거나 티켓 번호와 참가자 수를 혼동하거나 선행 0이 있는 번호 표기를 무시하면 현장에서 바로 이의가 생깁니다.'
    },
    ladder: {
      intro: '사다리타기는 참가자와 결과를 한 번에 연결해야 할 때 설명력이 높은 공개 추첨 방식입니다.',
      fit: '상품 배정, 벌칙 배정, 발표 순서, 역할 나누기처럼 누가 무엇에 연결됐는지를 한 화면에서 보여줘야 할 때 잘 맞습니다.',
      avoid: '단순히 한 명만 뽑는 추첨이나 숫자 범위를 관리하는 작업에는 룰렛이나 번호 추첨기가 더 간단합니다.',
      checklist: '참가자 수와 결과 수를 맞추고, 시작 전에 라벨을 확정한 다음, 공개 진행이라면 전체 보드가 보이는 상태에서 시작하는 것이 좋습니다.',
      mistakes: '결과를 공개한 뒤 라벨을 바꾸거나, 참가자와 결과 개수가 다르거나, 중간 과정을 생략하면 신뢰를 잃기 쉽습니다.'
    },
    coinflip: {
      intro: '코인 던지기는 두 선택지 중 하나를 아주 빠르게 정해야 할 때 가장 부담이 적은 랜덤 도구입니다.',
      fit: '선공/후공, 예/아니오, 진행 순서처럼 결과가 정확히 두 개뿐이고 긴 설명이 필요 없는 상황에 잘 맞습니다.',
      avoid: '후보가 셋 이상이거나 가중치가 필요하거나 당첨자 추첨처럼 기록과 검토가 중요한 경우에는 다른 도구가 더 적합합니다.',
      checklist: '결과 두 개가 무엇인지 먼저 합의하고, 단판인지 여러 번 던질지 정한 뒤, 반복 결정이라면 이력 확인 기준도 미리 정하는 편이 안전합니다.',
      mistakes: '연속해서 같은 면이 나와도 이상한 일이 아니며, 코인 던지기는 복잡한 의사결정을 공정해 보이게 포장하는 용도로 쓰면 오히려 신뢰를 잃습니다.'
    },
    dice: {
      intro: '주사위 굴리기는 게임 수치, 확률 수업, 반복 라운드 결과처럼 숫자 합계와 분포가 중요한 상황에 맞는 도구입니다.',
      fit: '보드게임, TRPG, 수업 실험, 간단한 점수 이벤트처럼 눈금 결과와 여러 번의 기록이 의미를 갖는 경우에 잘 맞습니다.',
      avoid: '참가자 명단에서 한 명을 뽑거나 팀을 공정하게 나누는 목적이면 룰렛이나 팀 나누기 도구가 더 자연스럽습니다.',
      checklist: '주사위 개수와 면 수, 합계만 볼지 개별 눈을 볼지, 재굴림 규칙을 먼저 정하고 반복 결과가 중요하면 이력을 남겨야 합니다.',
      mistakes: '주사위를 여러 개 쓰면 결과가 가운데로 몰리기 쉽고, 평균값과 분포를 무시한 채 단일 결과만 보고 공정성을 판단하면 해석이 틀어집니다.'
    },
    'team-generator': {
      intro: '팀 나누기는 그냥 섞는 것보다 왜 이 조합이 나왔는지를 설명해야 할 때 가치가 커지는 도구입니다.',
      fit: '친목 모임처럼 빠른 랜덤 편성이 필요할 때도 쓰기 좋고, 경기나 워크숍처럼 전력 차이를 줄여야 할 때는 점수 밸런스 모드가 더 적합합니다.',
      avoid: '참가자 수가 계속 바뀌거나 점수가 오래된 상태라면 균형 결과가 오히려 불만을 만들 수 있으니, 그런 경우에는 완전 랜덤이 더 낫습니다.',
      checklist: '명단 오탈자와 결원 여부를 먼저 정리하고, 팀 수를 확정한 뒤, 점수 기준이 현재 실력을 반영하는지 확인하고 생성 결과를 바로 공유해야 합니다.',
      mistakes: '밸런스 모드가 완벽한 동등 전력을 보장한다고 설명하거나, 빈 점수와 최근 변동을 무시하거나, 생성 후 임의로 인원을 교체하면 공정성 설명이 무너집니다.'
    }
  },
  en: {
    roulette: {
      intro: 'The wheel works best when people need to see the full participant list and watch one name get selected in public.',
      fit: 'It suits giveaways, presenter picks, classroom turns, and any draw where the visible roster matters as much as the result.',
      avoid: 'If the real job is drawing number ranges or matching people to outcomes, a number picker or ladder draw is easier to explain.',
      checklist: 'Confirm duplicate names, explain exclusion and redraw rules before the first spin, and keep result history if you are running multiple rounds.',
      mistakes: 'Spin animation does not change probability, repeated names act like extra tickets, and editing the roster after a result makes fairness harder to defend.'
    },
    luckydraw: {
      intro: 'The number picker is clearer than a name wheel when the result should be a ticket number, seat number, or coded entry.',
      fit: 'It fits raffles, queue numbers, seat assignments, and coupon draws where the valid range and duplicate policy need to be explicit.',
      avoid: 'If users need to see the participant roster itself or follow a one-to-one pairing, the wheel or ladder draw is usually more intuitive.',
      checklist: 'Lock the minimum and maximum values, decide whether repeats are allowed, define redraw conditions, and verify that the live range matches the real event data.',
      mistakes: 'Wrong number ranges, confusion between ticket IDs and participant counts, and ignoring leading-zero formatting are common sources of disputes.'
    },
    ladder: {
      intro: 'Ladder draw is strongest when you need to connect participants and outcomes in one visible result map.',
      fit: 'It works well for prize assignments, penalties, speaking order, and role matching when the path from each participant to the outcome should stay visible.',
      avoid: 'If you only need one winner or a raw number result, a wheel or number picker is simpler and creates less setup overhead.',
      checklist: 'Make the participant count and outcome count match, freeze labels before starting, and keep the full board visible if the process is public.',
      mistakes: 'Changing labels after reveal, starting with mismatched counts, or skipping the visible path breaks trust faster than the random result itself.'
    },
    coinflip: {
      intro: 'Coin flip is the lightest tool for fast two-option decisions when you want the outcome immediately and do not need a long setup.',
      fit: 'It is a good match for first turn decisions, yes-or-no choices, and short sequencing calls where there are exactly two valid outcomes.',
      avoid: 'Use another tool when there are more than two options, weighted odds, or any situation where result logs and later review matter.',
      checklist: 'Agree on the two outcomes first, decide whether one flip is enough, and set a basic history rule if the same decision will be repeated many times.',
      mistakes: 'A streak of heads or tails is not suspicious by itself, and using coin flips to oversimplify complex decisions usually hurts trust instead of helping it.'
    },
    dice: {
      intro: 'Dice rolling fits situations where totals, ranges, and repeated numeric outcomes matter more than picking one person from a list.',
      fit: 'It is appropriate for board games, TRPG sessions, classroom probability demos, and simple score events where repeated rolls have meaning.',
      avoid: 'If the real goal is choosing a participant or building fair teams, a wheel or team generator matches that job better than dice.',
      checklist: 'Set the number of dice and sides, decide whether totals or individual values matter, define reroll rules, and keep history if repeated rounds affect outcomes.',
      mistakes: 'Multiple dice naturally pull results toward the middle, so fairness can be misread if people focus on a single roll and ignore the wider distribution.'
    },
    'team-generator': {
      intro: 'Team split pages become more useful when they explain why a roster was divided that way, not just when they output random groups quickly.',
      fit: 'Pure random mode is fine for casual mixing, while balanced mode is better for classes, matches, and workshops where strength gaps affect the experience.',
      avoid: 'If the roster keeps changing or the scores are stale, a balanced split can create more complaints than a simple random assignment.',
      checklist: 'Clean the roster first, lock the team count, confirm that the score inputs still reflect current ability, and share the generated result before manual tweaks begin.',
      mistakes: 'Balanced mode does not promise perfectly equal teams, and fairness breaks down when missing scores, recent skill changes, or post-generation swaps are ignored.'
    }
  }
};

module.exports = {
  EDITORIAL_LABELS,
  TOOL_EDITORIAL_COPY
};
