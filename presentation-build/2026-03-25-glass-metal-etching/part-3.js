// === Part 3 시작 ===

// 슬라이드 49~55: 섹션 5 비교와 선택 + 마무리

function slide49_section5_divider() {
  const slide = pptx.addSlide();

  // 좌측 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 우측 배경
  slide.addShape('rect', {
    x: 5.33, y: 0, w: 7.4, h: 7.5,
    fill: { color: COLORS.bg_primary }
  });

  // 섹션 번호
  slide.addText('섹션 5', {
    x: 0.3, y: 1.6, w: 4.7, h: 0.6,
    fontSize: 18,
    color: COLORS.accent_cyan,
    fontFace: FONTS.subtitle.fontFace,
    bold: true,
    align: 'left'
  });

  // 섹션 제목
  slide.addText('내 상황에 맞는\n에칭 방식 고르기', {
    x: 0.3, y: 2.3, w: 4.7, h: 1.8,
    fontSize: 30,
    color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold,
    align: 'left'
  });

  // 구분선
  slide.addShape('rect', {
    x: 0.3, y: 4.2, w: 4.0, h: 0.01,
    fill: { color: COLORS.accent_cyan }
  });

  // 섹션 설명
  slide.addText('지금까지 배운 모든 에칭 방식을\n한눈에 비교하고,\n내 상황에 맞는 방식을 선택한다.', {
    x: 0.3, y: 4.4, w: 4.7, h: 1.5,
    fontSize: 14,
    color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace,
    align: 'left'
  });

  // 우측: 이 섹션의 슬라이드 목록
  slide.addText('이 섹션에서 다루는 내용', {
    x: 6.0, y: 1.6, w: 6.0, h: 0.5,
    fontSize: 16,
    color: COLORS.text_secondary,
    fontFace: FONTS.subtitle.fontFace,
    bold: true,
    align: 'left'
  });

  const items = [
    { num: '50', text: '소재별 에칭 방식 적합도 매트릭스' },
    { num: '51', text: '비용 규모 비교: 수백만원에서 수십억원까지' },
    { num: '52', text: '방식별 Top-3 실패 모드와 예방법' },
    { num: '53', text: '에칭 방식 의사결정 흐름도' },
  ];

  items.forEach((item, i) => {
    const yPos = 2.3 + i * 0.8;
    slide.addShape('rect', {
      x: 6.0, y: yPos, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue }
    });
    slide.addText(item.num, {
      x: 6.0, y: yPos, w: 0.45, h: 0.45,
      fontSize: 12,
      color: COLORS.text_on_dark,
      fontFace: FONTS.body.fontFace,
      bold: true,
      align: 'center',
      valign: 'middle'
    });
    slide.addText(item.text, {
      x: 6.55, y: yPos + 0.05, w: 5.8, h: 0.4,
      fontSize: 13,
      color: COLORS.text_primary,
      fontFace: FONTS.body.fontFace,
      align: 'left'
    });
  });
}

function slide50_material_matrix() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '소재별 에칭 방식 적합도 매트릭스', '◎ 최적  ○ 가능  △ 제한적  × 부적합');
  addPageNumber(slide, 50, TOTAL_SLIDES);

  const headers = ['소재', '습식 화학', 'RIE/건식', '스퍼터/FIB', '레이저', '샌드블라스팅'];
  const rows = [
    ['소다라임 유리',    '◎ HF',       '△',         '△',          '○ CO₂',    '◎'],
    ['보로실리케이트', '◎ BOE',      '△',         '△',          '○ CO₂/UV', '○'],
    ['퓨즈드 실리카',   '◎ HF 49%',  '○',         '△',          '◎ 펨토초',  '○'],
    ['구리',             '◎ FeCl₃',   '△ 비휘발성', '○',          '○ 파이버',  '△'],
    ['알루미늄',         '◎ NaOH',    '◎ Cl₂',     '○',          '○ 파이버',  '○'],
    ['스테인리스',       '○ FeCl₃+HCl','△',         '○',          '◎ 파이버',  '○'],
    ['Si (반도체)',       '○ KOH',     '◎ RIE/DRIE', '◎',         '△',         '×'],
    ['귀금속 (Pt, Au)',   '×',         '×',          '◎ 스퍼터',   '○ 펨토초',  '△'],
  ];

  addTitledTable(slide, '', headers, rows, {
    x: 0.4, y: 1.6, w: 12.5, h: 5.0,
    headerColor: COLORS.bg_dark,
    fontSize: 12,
    rowH: 0.55
  });

  // 범례 보충
  slide.addText('* 티타늄: 습식 ○ HF+HNO₃ / 스퍼터 ○ / 레이저 ○  |  SiO₂: 습식 ◎ / RIE ◎ — 행 통합 표시', {
    x: 0.4, y: 6.8, w: 12.0, h: 0.3,
    fontSize: 10,
    color: COLORS.text_tertiary,
    fontFace: FONTS.body.fontFace,
    italic: true
  });
}

function slide51_cost_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '비용 규모 비교: 수백만원에서 수십억원까지', '의사결정 초기 "감잡기"용 — 실제 도입 시 벤더 견적 필수');
  addPageNumber(slide, 51, TOTAL_SLIDES);

  const headers = ['에칭 방식', '초기 장비 투자', '소모품/운영(월)', '폐수·후처리', '비고'];
  const rows = [
    ['습식 에칭 (소규모)', '수백만원', '수십만원', '수십~수백만원/년', '진입 장벽 가장 낮음'],
    ['습식 에칭 (산업 자동화)', '수천만원', '수백만원', '수천만원/년', 'PCB 대량 생산 기준'],
    ['샌드블라스팅', '수백만원', '수십만원', '분진 처리 비용', '물리적 에칭 최저비용'],
    ['CO₂ 레이저', '수백만~수천만원', '수십만원', '없음 (건식)', '비금속·유리 마킹'],
    ['파이버 레이저 (나노초)', '수천만원~1억원', '수십만원', '없음 (건식)', '금속 마킹·에칭'],
    ['RIE (연구용)', '수천만~1억원', '수백만원', '최소 (가스 스크러버)', '대학/연구소 클린룸'],
    ['펨토초 레이저', '수억~수십억원', '수백만원', '없음', '나노 정밀 가공'],
    ['ICP-RIE / DRIE / ALE', '수억~수십억원+', '수천만원 이상', '중간 (가스 처리)', '반도체 팹 전용'],
  ];

  addTitledTable(slide, '', headers, rows, {
    x: 0.4, y: 1.6, w: 12.5, h: 4.9,
    headerColor: COLORS.bg_dark,
    fontSize: 11,
    rowH: 0.55
  });

  slide.addText('※ FIB(집속이온빔): 수억~수십억원, 소모품 수백만원/월 — R&D·단면분석 특화', {
    x: 0.4, y: 6.7, w: 12.0, h: 0.3,
    fontSize: 10,
    color: COLORS.text_tertiary,
    fontFace: FONTS.body.fontFace,
    italic: true
  });
}

function slide52_failure_modes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '방식별 Top-3 실패 모드와 예방법', '에칭 실패는 대부분 전후 공정 연결 고리에서 발생한다');
  addPageNumber(slide, 52, TOTAL_SLIDES);

  // 그룹 1: 습식 화학 에칭
  slide.addShape('rect', {
    x: 0.4, y: 1.55, w: 12.3, h: 0.35,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText('습식 화학 에칭', {
    x: 0.5, y: 1.58, w: 12.0, h: 0.3,
    fontSize: 12,
    color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  addStyledTable(slide,
    ['순위', '실패 모드', '원인', '예방법'],
    [
      ['1위', '과에칭(Over-etch)', '에칭 시간 초과·온도 과다', '타이머+온도 ±2°C 관리, 쿠폰 사전 테스트'],
      ['2위', '언더컷 과다', '에칭 팩터 미달·마스크 접착 불량', '양면에칭·스프레이 방식·아트워크 보정 설계'],
      ['3위', '마스크 박리·손상', '에칭액이 마스크 공격', '마스크-에칭액 호환성 확인, 라미네이션 품질 관리'],
    ],
    { x: 0.4, y: 1.9, w: 12.3, h: 1.3, fontSize: 10, rowH: 0.42 }
  );

  // 그룹 2: RIE/건식 에칭
  slide.addShape('rect', {
    x: 0.4, y: 3.3, w: 12.3, h: 0.35,
    fill: { color: COLORS.accent_purple }
  });
  slide.addText('RIE·건식 에칭 (반도체)', {
    x: 0.5, y: 3.33, w: 12.0, h: 0.3,
    fontSize: 12,
    color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  addStyledTable(slide,
    ['순위', '실패 모드', '원인', '예방법'],
    [
      ['1위', '보잉(Bowing)', '측벽 보호막 부족·이온 산란', 'C₄F₈ 비율 증가, 저온 운전'],
      ['2위', '노칭(Notching)', '바닥에서 이온 반사·과집중', '압력 조절, 에칭 종점 검출(EPD) 활용'],
      ['3위', 'ARDE(종횡비 의존 에칭)', '좁은 구멍에 가스·이온 공급 부족', '보쉬 사이클 최적화, 더미 패턴, 펄스 플라즈마'],
    ],
    { x: 0.4, y: 3.65, w: 12.3, h: 1.3, fontSize: 10, rowH: 0.42 }
  );

  // 그룹 3: 물리적 에칭
  slide.addShape('rect', {
    x: 0.4, y: 5.05, w: 12.3, h: 0.35,
    fill: { color: COLORS.accent_red }
  });
  slide.addText('물리적 에칭 (스퍼터·FIB·레이저)', {
    x: 0.5, y: 5.08, w: 12.0, h: 0.3,
    fontSize: 12,
    color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  addStyledTable(slide,
    ['순위', '실패 모드', '원인', '예방법'],
    [
      ['1위', '재증착(Redeposition)', '제거 원자가 측벽에 재부착', '시료 각도 조절, 가스 보조(CAIBE) 사용'],
      ['2위', '열 영향부(HAZ) — 레이저', '나노초 레이저의 열 확산', '펨토초 레이저 전환, 반복률·플루언스 최적화'],
      ['3위', '이온빔 손상·Ga 오염 — FIB', 'Ga⁺ 이온 시료 내 주입', 'Xe⁺ PFIB 사용, 저에너지 마무리 패스'],
    ],
    { x: 0.4, y: 5.4, w: 12.3, h: 1.3, fontSize: 10, rowH: 0.42 }
  );
}

function slide53_decision_flowchart() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 방식 의사결정 흐름도', '소재 → 목적 → 규모/허용조건 3단계로 최적 방식을 선택한다');
  addPageNumber(slide, 53, TOTAL_SLIDES);

  // ─── 헬퍼: 박스 그리기 ───
  const BOX_W = 2.1;
  const BOX_H = 0.55;
  const ARROW_COLOR = COLORS.text_secondary;

  function addBox(x, y, text, fillColor, textColor) {
    const fc = fillColor || COLORS.bg_secondary;
    const tc = textColor || COLORS.text_primary;
    slide.addShape('roundRect', {
      x, y, w: BOX_W, h: BOX_H,
      fill: { color: fc },
      line: { color: COLORS.text_tertiary, pt: 1 },
      rectRadius: 0.08
    });
    slide.addText(text, {
      x, y, w: BOX_W, h: BOX_H,
      fontSize: 10,
      color: tc,
      fontFace: FONTS.body.fontFace,
      align: 'center',
      valign: 'middle',
      bold: false
    });
  }

  function addArrow(x1, y1, x2, y2) {
    // 화살표를 얇은 rect로 표현 (수직선)
    const isVertical = Math.abs(x1 - x2) < 0.05;
    if (isVertical) {
      slide.addShape('rect', {
        x: x1 - 0.01, y: y1, w: 0.02, h: y2 - y1,
        fill: { color: ARROW_COLOR }
      });
      // 화살표 머리
      slide.addShape('rect', {
        x: x1 - 0.06, y: y2 - 0.12, w: 0.12, h: 0.12,
        fill: { color: ARROW_COLOR }
      });
    } else {
      const minX = Math.min(x1, x2);
      const w = Math.abs(x2 - x1);
      slide.addShape('rect', {
        x: minX, y: y1 - 0.01, w: w, h: 0.02,
        fill: { color: ARROW_COLOR }
      });
    }
  }

  function addLabel(x, y, text, color) {
    slide.addText(text, {
      x, y, w: 1.0, h: 0.25,
      fontSize: 9,
      color: color || COLORS.accent_blue,
      fontFace: FONTS.body.fontFace,
      bold: true,
      align: 'center'
    });
  }

  // ─── 시작 박스 ───
  const startX = 5.2;
  const startY = 1.65;
  addBox(startX, startY, '에칭 방식 선택', COLORS.bg_dark, COLORS.text_on_dark);

  // 시작 → Q1 (수직 화살표)
  addArrow(startX + BOX_W / 2, startY + BOX_H, startX + BOX_W / 2, startY + BOX_H + 0.25);

  // ─── Q1: 소재 분기 ───
  const q1X = startX;
  const q1Y = startY + BOX_H + 0.25;
  addBox(q1X, q1Y, '1단계: 대상 소재는?', COLORS.accent_blue, COLORS.text_on_dark);

  // Q1 → 유리/세라믹 (좌)
  const col1X = 0.3;
  const col2X = 4.1;
  const col3X = 8.0;
  const q2Y = q1Y + BOX_H + 0.55;

  addArrow(startX, q1Y + BOX_H / 2, col1X + BOX_W / 2, q1Y + BOX_H / 2);
  addLabel(col1X + 0.1, q1Y + BOX_H / 2 - 0.3, '유리·세라믹', COLORS.accent_blue);

  addArrow(startX + BOX_W / 2, q1Y + BOX_H, startX + BOX_W / 2, q2Y);
  addLabel(startX + BOX_W / 2 - 0.5, q1Y + BOX_H, '금속', COLORS.accent_blue);

  addArrow(startX + BOX_W, q1Y + BOX_H / 2, col3X, q1Y + BOX_H / 2);
  addLabel(col3X - 0.2, q1Y + BOX_H / 2 - 0.3, '반도체 웨이퍼', COLORS.accent_blue);

  // 수직선 내려오기
  addArrow(col1X + BOX_W / 2, q1Y + BOX_H / 2, col1X + BOX_W / 2, q2Y);
  addArrow(col3X + BOX_W / 2, q1Y + BOX_H / 2, col3X + BOX_W / 2, q2Y);

  // ─── Q2: 각 소재의 2단계 질문 ───
  addBox(col1X, q2Y, '2단계: 목적은?', COLORS.accent_cyan, COLORS.bg_dark);
  addBox(startX, q2Y, '2단계: 생산 규모는?', COLORS.accent_cyan, COLORS.bg_dark);
  addBox(col3X, q2Y, '2단계: 선폭 요구는?', COLORS.accent_cyan, COLORS.bg_dark);

  // ─── 결론 박스 ───
  const ansY = q2Y + BOX_H + 0.55;

  // 유리 → 결론들
  addArrow(col1X + BOX_W / 2, q2Y + BOX_H, col1X + BOX_W / 2, ansY);
  slide.addText('대면적/장식 → 습식 HF\n또는 샌드블라스팅\n마이크로채널 → BOE\n나노/내부 → 펨토초 레이저', {
    x: col1X, y: ansY, w: BOX_W, h: 1.3,
    fontSize: 9,
    color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace,
    align: 'left',
    valign: 'top'
  });
  slide.addShape('roundRect', {
    x: col1X, y: ansY, w: BOX_W, h: 1.3,
    fill: { color: COLORS.bg_secondary },
    line: { color: COLORS.accent_blue, pt: 1 },
    rectRadius: 0.06
  });
  slide.addText('대면적/장식 → 습식 HF 또는 샌드블라스팅\n마이크로채널(<100µm) → BOE\n나노 패터닝 → 펨토초 레이저\n마킹/로고 → CO₂ 레이저', {
    x: col1X + 0.05, y: ansY + 0.05, w: BOX_W - 0.1, h: 1.2,
    fontSize: 9,
    color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace,
    align: 'left',
    valign: 'top'
  });

  // 금속 → 결론들
  addArrow(startX + BOX_W / 2, q2Y + BOX_H, startX + BOX_W / 2, ansY);
  slide.addShape('roundRect', {
    x: col2X, y: ansY, w: BOX_W, h: 1.3,
    fill: { color: COLORS.bg_secondary },
    line: { color: COLORS.accent_cyan, pt: 1 },
    rectRadius: 0.06
  });
  slide.addText('대량(PCB/리드프레임) → 화학 PCE\n  FeCl₃ 또는 CuCl₂\n소량 정밀+HAZ 허용 → 파이버 레이저\n소량 정밀+HAZ 불허 → 펨토초/ECM', {
    x: col2X + 0.05, y: ansY + 0.05, w: BOX_W - 0.1, h: 1.2,
    fontSize: 9,
    color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace,
    align: 'left',
    valign: 'top'
  });

  // 반도체 → 결론들
  addArrow(col3X + BOX_W / 2, q2Y + BOX_H, col3X + BOX_W / 2, ansY);
  slide.addShape('roundRect', {
    x: col3X, y: ansY, w: BOX_W, h: 1.3,
    fill: { color: COLORS.bg_secondary },
    line: { color: COLORS.accent_purple, pt: 1 },
    rectRadius: 0.06
  });
  slide.addText('>1µm → 습식 or RIE\n10nm~1µm → ICP-RIE\n<10nm (첨단 노드) → ALE\n(원자층 에칭)', {
    x: col3X + 0.05, y: ansY + 0.05, w: BOX_W - 0.1, h: 1.2,
    fontSize: 9,
    color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace,
    align: 'left',
    valign: 'top'
  });

  // 소재 레이블 (결론 박스 위)
  addBox(col1X, ansY - 0.32, '유리·세라믹', COLORS.accent_blue, COLORS.text_on_dark);
  addBox(col2X, ansY - 0.32, '금속', COLORS.accent_cyan, COLORS.bg_dark);
  addBox(col3X, ansY - 0.32, '반도체 웨이퍼', COLORS.accent_purple, COLORS.text_on_dark);
}

function slide54_key_messages() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '오늘의 핵심 5가지를 기억하자', '이 5가지만 이해하면 어떤 에칭 상황에서도 판단할 수 있다');
  addPageNumber(slide, 54, TOTAL_SLIDES);

  const messages = [
    {
      num: '1',
      title: '에칭은 "선택적 제거"다',
      body: '화학물질·이온·레이저 등 수단은 달라도, "원하는 곳만 깎는다"는 본질은 같다.\n수단 선택이 곧 품질·비용·정밀도를 결정한다.',
      color: COLORS.accent_blue
    },
    {
      num: '2',
      title: '모든 에칭은 화학–물리 스펙트럼 위에 있다',
      body: '습식(순수 화학) ~ RIE(하이브리드) ~ 스퍼터(순수 물리)의 연속체로 이해하면 방식 간 관계가 명확해진다. 이분법은 혼란을 낳는다.',
      color: COLORS.accent_cyan
    },
    {
      num: '3',
      title: '선택비·등방성·에칭속도 3요소가 품질을 좌우한다',
      body: '이 세 개념만 이해하면 어떤 에칭 방식이든 핵심 성능을 평가할 수 있다.\n선택비 높을수록, 이방성 강할수록, 속도는 목적에 맞게.',
      color: COLORS.accent_yellow
    },
    {
      num: '4',
      title: '소재–목적–규모가 에칭 방식을 결정한다',
      body: '"무엇을(소재), 왜(목적/정밀도), 얼마나(규모/비용)" 세 질문으로 최적 방식을 좁힐 수 있다.\n매트릭스와 흐름도를 활용하라.',
      color: COLORS.accent_purple
    },
    {
      num: '5',
      title: '에칭은 단독 공정이 아닌 연결체다',
      body: '마스킹-에칭-검사-클리닝이 한 세트다.\n실패 모드 대부분은 이 연결 고리(전처리·후처리)에서 발생한다.',
      color: COLORS.accent_red
    },
  ];

  messages.forEach((msg, i) => {
    const yPos = 1.65 + i * 1.02;
    // 번호 원형
    slide.addShape('roundRect', {
      x: 0.4, y: yPos, w: 0.5, h: 0.5,
      fill: { color: msg.color },
      rectRadius: 0.25
    });
    slide.addText(msg.num, {
      x: 0.4, y: yPos, w: 0.5, h: 0.5,
      fontSize: 16,
      color: COLORS.text_on_dark,
      fontFace: FONTS.subtitle.fontFace,
      bold: true,
      align: 'center',
      valign: 'middle'
    });

    // 제목
    slide.addText(msg.title, {
      x: 1.0, y: yPos + 0.02, w: 11.5, h: 0.28,
      fontSize: 13,
      color: msg.color,
      fontFace: FONTS.subtitle.fontFace,
      bold: true
    });

    // 본문
    slide.addText(msg.body, {
      x: 1.0, y: yPos + 0.3, w: 11.5, h: 0.6,
      fontSize: 11,
      color: COLORS.text_primary,
      fontFace: FONTS.body.fontFace
    });

    // 구분선 (마지막 제외)
    if (i < messages.length - 1) {
      slide.addShape('rect', {
        x: 0.4, y: yPos + 0.97, w: 12.3, h: 0.01,
        fill: { color: COLORS.bg_secondary }
      });
    }
  });
}

function slide55_closing() {
  const slide = pptx.addSlide();

  // 배경: 다크 전체
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 상단 강조 바
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 0.08,
    fill: { color: COLORS.accent_blue }
  });

  // 메인 타이틀
  slide.addText('감사합니다', {
    x: 0.6, y: 1.0, w: 8.0, h: 1.0,
    fontSize: 42,
    color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold
  });

  slide.addText('Q & A', {
    x: 0.6, y: 2.0, w: 4.0, h: 0.7,
    fontSize: 28,
    color: COLORS.accent_cyan,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  // 구분선
  slide.addShape('rect', {
    x: 0.6, y: 2.85, w: 5.5, h: 0.04,
    fill: { color: COLORS.accent_blue }
  });

  // 핵심 요약 3포인트
  slide.addText('오늘 배운 것', {
    x: 0.6, y: 3.1, w: 5.5, h: 0.35,
    fontSize: 13,
    color: COLORS.text_secondary,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  const summaryPoints = [
    '에칭 = 선택적 제거. 화학-물리 스펙트럼으로 모든 방식을 이해한다.',
    '선택비·등방성·에칭속도 3요소가 품질의 핵심 지표다.',
    '소재-목적-규모 3질문으로 최적 방식을 좁힌다.',
  ];

  summaryPoints.forEach((point, i) => {
    slide.addShape('roundRect', {
      x: 0.6, y: 3.55 + i * 0.65, w: 0.28, h: 0.28,
      fill: { color: COLORS.accent_cyan },
      rectRadius: 0.14
    });
    slide.addText(point, {
      x: 1.0, y: 3.53 + i * 0.65, w: 5.1, h: 0.35,
      fontSize: 11,
      color: COLORS.text_on_dark,
      fontFace: FONTS.body.fontFace
    });
  });

  // 우측: 후속 학습 안내
  slide.addShape('rect', {
    x: 7.2, y: 1.0, w: 5.7, h: 5.8,
    fill: { color: COLORS.bg_secondary }
  });

  slide.addText('후속 학습 자료', {
    x: 7.5, y: 1.2, w: 5.1, h: 0.4,
    fontSize: 14,
    color: COLORS.text_primary,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  slide.addShape('rect', {
    x: 7.5, y: 1.65, w: 5.0, h: 0.03,
    fill: { color: COLORS.accent_blue }
  });

  const resources = [
    { label: '01-chemical-etching.md', desc: '화학적 에칭 — HF·FeCl₃ 실무,\n안전·환경 가이드 (유리/금속)' },
    { label: '02-semiconductor-etching.md', desc: 'RIE·DRIE·ICP·ALE 심층 분석,\n반도체 공정 응용 사례' },
    { label: '03-physical-etching.md', desc: '스퍼터·FIB·레이저·ECM,\n펨토초 레이저 나노 가공' },
  ];

  resources.forEach((res, i) => {
    const yPos = 1.85 + i * 1.35;
    slide.addShape('rect', {
      x: 7.5, y: yPos, w: 5.0, h: 0.01,
      fill: { color: COLORS.text_tertiary }
    });
    slide.addText(res.label, {
      x: 7.5, y: yPos + 0.1, w: 5.0, h: 0.3,
      fontSize: 11,
      color: COLORS.accent_blue,
      fontFace: FONTS.subtitle.fontFace,
      bold: true
    });
    slide.addText(res.desc, {
      x: 7.5, y: yPos + 0.42, w: 5.0, h: 0.55,
      fontSize: 10,
      color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace
    });
  });

  // 후속 탐색 질문
  slide.addText('후속 탐색 질문', {
    x: 7.5, y: 5.15, w: 5.1, h: 0.35,
    fontSize: 12,
    color: COLORS.text_primary,
    fontFace: FONTS.subtitle.fontFace,
    bold: true
  });

  const nextQs = [
    '레이저 vs 화학 에칭의 손익분기점은 몇 개부터?',
    '레이저 어블레이션 후 잔류 응력과 장기 신뢰성?',
    '나노임프린트(NIL) vs 레이저 에칭 — 어느 쪽이 경제적?',
  ];

  nextQs.forEach((q, i) => {
    slide.addText('Q' + (i + 1) + '. ' + q, {
      x: 7.5, y: 5.55 + i * 0.38, w: 5.1, h: 0.35,
      fontSize: 9.5,
      color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace,
      italic: true
    });
  });

  // 하단 슬라이드 번호
  addPageNumber(slide, 55, TOTAL_SLIDES);
}

// === Part 3 끝 ===
