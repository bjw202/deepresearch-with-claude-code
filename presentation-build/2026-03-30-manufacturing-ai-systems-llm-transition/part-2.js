// === Part 2 시작 ===

function slide12_comparisonTable() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '7개 기업 종합 비교: 제어 유형 × AI 기법 × 도입 × 검증');

  const headers = ['기업', '제어 유형', 'AI 기법', '도입 수준', 'LLM 적극성', '검증 수준'];
  const dataRows = [
    ['IMUBIT', 'Closed-loop 자율', 'DNN+RL', 'Production 100+', '★★☆', '★★☆'],
    ['TIGNIS', 'Closed-loop R2R', '물리+ML', 'Production', '★☆☆', '★★☆'],
    ['Lam Research', 'Semi-closed HitL', 'Bayesian Opt.', 'R&D+임베디드', '★★☆', '★★★'],
    ['Siemens', 'Open-loop 보조', 'GPT-4+KG', 'Pilot 100+', '★★★', '★★☆'],
    ['Bosch', 'Semi-auto', 'Multi-agent+LLM', '내부 배포', '★★★', '★☆☆'],
    ['Samsung', '전략 선언', 'GPU+디지털트윈', '파일럿 초기', '★★☆', '★☆☆'],
    ['Intel', 'Closed-loop(결함)', 'CNN+CV', 'Production', '★☆☆', '★★★'],
  ];

  addStyledTable(slide, headers, dataRows, {
    x: 0.6,
    y: 1.8,
    w: 12.13,
    h: 4.9,
    colW: [1.4, 1.9, 1.7, 1.8, 1.7, 1.63],
    fontSize: 11,
  });

  addPageNumber(slide, 12, TOTAL_SLIDES);
}

function slide13_successPatterns() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '성공적 배포의 3가지 공통 패턴');

  const patterns = [
    {
      num: '1',
      title: '인간 개입 권한 유지',
      body: 'IMUBIT(오퍼레이터 개입), Lam(Human-First), Intel(엔지니어 최종 결정) — 모든 성공 사례에서 인간이 최종 결정권을 유지함',
      accent: COLORS.accent_blue,
    },
    {
      num: '2',
      title: '기존 프로토콜 활용 비침습적 통합',
      body: 'OPC-UA, DCS 직접 연결, 추가 장비 불필요 — 기존 인프라를 교체하지 않고 위에 레이어를 추가하는 방식',
      accent: COLORS.accent_cyan,
    },
    {
      num: '3',
      title: '도메인 특화 접근',
      body: '정유(IMUBIT), 반도체(TIGNIS, Lam) — 범용 AI보다 특정 공정에 집중한 사례가 더 높은 성과',
      accent: COLORS.accent_yellow,
    },
  ];

  patterns.forEach((p, i) => {
    const yPos = 1.9 + i * 1.45;

    // 번호 뱃지
    slide.addShape('ellipse', {
      x: 0.6,
      y: yPos,
      w: 0.42,
      h: 0.42,
      fill: { color: p.accent },
      line: { color: p.accent },
    });
    slide.addText(p.num, {
      x: 0.6,
      y: yPos,
      w: 0.42,
      h: 0.42,
      fontSize: 14,
      fontFace: FONTS.kpi.fontFace,
      bold: true,
      color: COLORS.text_on_dark,
      align: 'center',
      valign: 'middle',
    });

    // 제목
    slide.addText(p.title, {
      x: 1.18,
      y: yPos,
      w: 11.55,
      h: 0.38,
      fontSize: 15,
      fontFace: FONTS.subtitle.fontFace,
      bold: FONTS.subtitle.bold,
      color: COLORS.text_primary,
      valign: 'middle',
    });

    // 본문
    slide.addText(p.body, {
      x: 1.18,
      y: yPos + 0.4,
      w: 11.55,
      h: 0.85,
      fontSize: 12,
      fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      valign: 'top',
      lineSpacingMultiple: 1.3,
    });
  });

  // 경고 박스
  slide.addShape('rect', {
    x: 0.6,
    y: 6.25,
    w: 12.13,
    h: 0.6,
    fill: { color: 'FFF0F0' },
    line: { color: 'FFCCCC', pt: 1 },
  });
  slide.addText('⚠️ 주의: 공개된 성공 사례 기반 분석. 실패 사례·TCO 데이터 미포함 (생존자 편향 가능)', {
    x: 0.85,
    y: 6.28,
    w: 11.63,
    h: 0.52,
    fontSize: 11,
    fontFace: FONTS.body.fontFace,
    color: 'CC3333',
    valign: 'middle',
    bold: true,
  });

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

function slide14_sectionTransition() {
  const slide = pptx.addSlide();

  // 좌측 다크 패널 (40%)
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 5.12,
    h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { color: COLORS.bg_dark },
  });

  // 좌측 장식 텍스트
  slide.addText('LLM\n&\n온톨로지', {
    x: 0.4,
    y: 2.0,
    w: 4.32,
    h: 3.5,
    fontSize: 42,
    fontFace: FONTS.deco.fontFace,
    bold: true,
    color: COLORS.accent_blue,
    align: 'center',
    valign: 'middle',
    lineSpacingMultiple: 1.2,
  });

  // 우측 밝은 패널 (60%)
  slide.addShape('rect', {
    x: 5.12,
    y: 0,
    w: 7.88,
    h: 7.5,
    fill: { color: COLORS.bg_primary },
    line: { color: COLORS.bg_primary },
  });

  // 우측 제목
  slide.addText('LLM/온톨로지는 제조에 어떻게 들어오는가', {
    x: 5.52,
    y: 2.6,
    w: 7.08,
    h: 1.2,
    fontSize: 26,
    fontFace: FONTS.title.fontFace,
    bold: FONTS.title.bold,
    color: COLORS.text_primary,
    align: 'left',
    valign: 'middle',
  });

  // 우측 부제
  slide.addText('4가지 전환 유형과 구조적 장벽', {
    x: 5.52,
    y: 3.9,
    w: 7.08,
    h: 0.6,
    fontSize: 18,
    fontFace: FONTS.subtitle.fontFace,
    bold: false,
    color: COLORS.text_secondary,
    align: 'left',
    valign: 'middle',
  });

  // 섹션 번호
  slide.addText('SECTION 03', {
    x: 5.52,
    y: 5.2,
    w: 4.0,
    h: 0.4,
    fontSize: 11,
    fontFace: FONTS.caption.fontFace,
    color: COLORS.accent_blue,
    bold: true,
  });
}

function slide15_fourTransitionTypes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 전환 유형: 현실적인 것은 2가지뿐이다');

  const cards = [
    {
      x: 0.6,
      y: 1.8,
      w: 5.8,
      h: 2.3,
      title: '레이어 추가형 ★★★',
      body: '기존 ML 위에 LLM을 설명/인터페이스로 추가\nSiemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.93,
      y: 1.8,
      w: 5.8,
      h: 2.3,
      title: '하이브리드형 ★★☆',
      body: '수치→ML, 판단→LLM, 지식→KG 역할 분리\nSiemens IFM(개발중), ISA-95+LLM+KG(연구)',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.6,
      y: 4.35,
      w: 5.8,
      h: 2.3,
      title: '교체형 ★☆☆',
      body: '전체 파이프라인을 Foundation Model로 교체\n해당 사례 없음, 구조적 장벽 (실시간, 정밀도, 인증)',
      accentColor: COLORS.accent_red,
    },
    {
      x: 6.93,
      y: 4.35,
      w: 5.8,
      h: 2.3,
      title: '불필요형 ★★★',
      body: '기존 ML이 이미 최적\nPID 튜닝, 수렴된 RL, 고주파 제어 — LLM 추가가 오히려 복잡도 증가',
      accentColor: COLORS.accent_yellow,
    },
  ];

  cards.forEach(card => {
    addCard(slide, card);
  });

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

function slide16_layeredStack() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이어 추가형: 기존 ML 위에 LLM을 얹는 현실적 경로');

  const layers = [
    {
      label: 'LLM 레이어',
      description: '설명·인터페이스·코드생성 — Siemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent',
      color: COLORS.accent_blue,
    },
    {
      label: 'ML/RL 모델',
      description: '수치 최적화 유지 — DNN, Bayesian Opt., CNN 등 기존 모델 변경 없음',
      color: COLORS.accent_cyan,
    },
    {
      label: 'PLC/DCS/장비',
      description: '실시간 제어 — OPC-UA, SCADA, MES 기존 인프라 그대로',
      color: COLORS.accent_purple,
    },
  ];

  addLayeredStack(slide, layers);

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

function slide17_hybridProcessFlow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '하이브리드형: 수치→ML, 판단→LLM, 지식→KG 역할 분리');

  const steps = [
    {
      label: 'KG (도메인 지식)',
      description: '온톨로지 기반 공정 지식 구조화, ISA-95 정렬',
    },
    {
      label: 'LLM (의도 파악)',
      description: '자연어 → 공정 파라미터 매핑, 계획 수립, 설명 생성',
    },
    {
      label: 'ML/DO (수치 최적화)',
      description: '정밀 파라미터 계산, 물리 모델 + 데이터 기반',
    },
    {
      label: 'PLC (실행)',
      description: 'Validator 검증 후 실행, 안전 제약 확인',
    },
  ];

  addProcessFlow(slide, steps);

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

function slide18_structuralBarriers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구조적 장벽 4가지와 해소 시기 전망');

  const headers = ['장벽', '현황', '해소 시기'];
  const dataRows = [
    ['실시간 제약 (LLM 수초 vs PLC ms)', '엣지/클라우드 분리로 우회 중', '~2028'],
    ['수치 정밀도 (LLM 부동소수점 오류)', '수치는 ML, 판단은 LLM 분리', '구조적 한계'],
    ['안전 인증 (IEC 61508 비결정론 미수용)', '인증 경로 미정립', '~2030+'],
    ['데이터 주권 (레시피 기밀 외부 전송)', '온프레미스 LLM/도메인 소형 모델, SemiKong 등 부상', '진행 중'],
    ['온톨로지 구축 (도메인 전문가 노력)', 'LLM 기반 자동 KG 생성 연구 활발', '~2027'],
  ];

  addStyledTable(slide, headers, dataRows, {
    x: 0.6,
    y: 1.8,
    w: 12.13,
    h: 4.8,
    colW: [3.5, 5.5, 3.13],
    fontSize: 12,
  });

  addPageNumber(slide, 18, TOTAL_SLIDES);
}

function slide19_whyReplacementImpossible() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '교체형은 왜 단기 불가능한가');

  // 좌측 제목
  slide.addText('기술 조건 (미충족)', {
    x: 0.6,
    y: 1.85,
    w: 5.9,
    h: 0.4,
    fontSize: 16,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold,
    color: COLORS.accent_red,
    valign: 'middle',
  });

  const leftItems = [
    'LLM 추론 지연 <10ms 필요 (현재 수초)',
    '수치 정밀도: 온도 ±0.1°C, 두께 ±1nm',
    '안전 인증 프레임워크 확립 필요',
    '결정론적 검증 레이어 없이는 불가',
  ];

  slide.addText(leftItems.map(item => `• ${item}`).join('\n'), {
    x: 0.6,
    y: 2.35,
    w: 5.9,
    h: 4.2,
    fontSize: 13,
    fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.7,
    valign: 'top',
  });

  // 구분선
  slide.addShape('rect', {
    x: 6.615,
    y: 1.85,
    w: 0.01,
    h: 4.95,
    fill: { color: 'E2E8F0' },
    line: { color: 'E2E8F0' },
  });

  // 우측 제목
  slide.addText('전문가 의견', {
    x: 6.83,
    y: 1.85,
    w: 5.9,
    h: 0.4,
    fontSize: 16,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue,
    valign: 'middle',
  });

  const rightItems = [
    '"LLM의 수치 추론 결함은 학습 데이터나 스케일링으로 해결 불가" — ACL 2023',
    '"미래는 AI가 SCADA를 대체하는 것이 아니라 강화하는 것" — controlsys.org',
    '"안전 기능에 AI 적용 시 56%가 응답 시간 장벽 보고" — 2025 설문',
    '결론: 레이어 추가/하이브리드가 현실적',
  ];

  slide.addText(rightItems.map((item, i) => (i < 3 ? `❝ ${item}` : `→ ${item}`)).join('\n'), {
    x: 6.83,
    y: 2.35,
    w: 5.9,
    h: 4.2,
    fontSize: 12,
    fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6,
    valign: 'top',
  });

  addPageNumber(slide, 19, TOTAL_SLIDES);
}

function slide20_newPlayers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '주목할 신규 플레이어 3곳');

  addCard(slide, {
    x: 0.6,
    y: 1.8,
    w: 3.7,
    h: 4.8,
    title: 'SemiKong (Aitomatic)',
    body: 'Llama 기반 반도체 도메인 전용 LLM\nMeta AI 협력, 시장 출시 20~30% 단축 주장\n\n⚠️ 독립 벤치마크 미확인 ★★☆',
    accentColor: COLORS.accent_blue,
  });

  addCard(slide, {
    x: 4.52,
    y: 1.8,
    w: 3.7,
    h: 4.8,
    title: 'EthonAI',
    body: '인과 AI(Causal AI) 기반 제조 효율화\nSeries A $16M (2024)\n\nLLM 대신 인과관계/설명가능성으로 차별화',
    accentColor: COLORS.accent_cyan,
  });

  addCard(slide, {
    x: 8.43,
    y: 1.8,
    w: 4.3,
    h: 4.8,
    title: 'Blockbrain',
    body: 'Siemens AI Award 수상\n숍플로어 지식 포착 LLM\n\n현장 암묵지 디지털화 특화',
    accentColor: COLORS.accent_yellow,
  });

  addPageNumber(slide, 20, TOTAL_SLIDES);
}

function slide21_roadmap() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환 로드맵: 2026 → 2028 → 2030+');

  const milestones = [
    {
      date: '2026',
      title: '레이어 추가형 확산',
      description: 'Siemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent 배포 중',
    },
    {
      date: '2027',
      title: '자동 온톨로지 성숙',
      description: 'OntoKGen 등 LLM 기반 KG 자동 생성, 중소 제조 진입 장벽 하락',
    },
    {
      date: '2028',
      title: '하이브리드형 파일럿',
      description: 'Siemens IFM 출시 전망, 엣지 LLM 성숙, 도메인 소형 모델 검증',
    },
    {
      date: '2030+',
      title: '교체형 논의 시작',
      description: 'IEC 61508 개정, LLM 추론 <100ms, 안전 인증 경로 확립 시',
    },
  ];

  addRoadmap(slide, milestones);

  addPageNumber(slide, 21, TOTAL_SLIDES);
}

// === Part 2 끝 ===
