// === Part 4 시작 ===

// [37] KPI — 2025 시장 규모 + 시장 데이터 출처 비교 테이블
function slide37_market_kpi() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '2025 시장 $2.4~2.9B, CAGR 15~17% — 아시아-태평양 38%로 1위');

  // KPI 카드 3개
  const kpiCards = [
    { ...CARD_KPI_3[0], accentColor: COLORS.accent_blue,   label: '2025 시장 규모',       value: '$2.4~2.9B',  note: '6개 시장보고서 종합 ★★' },
    { ...CARD_KPI_3[1], accentColor: COLORS.accent_cyan,   label: 'CAGR (2025~2031)',      value: '15~17%',     note: '현실적 중간값, 범위 9.5~21%' },
    { ...CARD_KPI_3[2], accentColor: COLORS.accent_yellow, label: '아시아-태평양',          value: '38% (1위)',  note: 'CAGR ~18%, 웨이퍼 팹·기가팩토리·디스플레이' },
  ];

  kpiCards.forEach(card => {
    slide.addShape('roundRect', {
      x: card.x, y: card.y, w: card.w, h: card.h, rectRadius: 0.1,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.75 }
    });
    slide.addShape('rect', {
      x: card.x + 0.02, y: card.y, w: card.w - 0.04, h: 0.06,
      fill: { color: card.accentColor }
    });
    slide.addText(card.label, {
      x: card.x + 0.15, y: card.y + 0.12, w: card.w - 0.3, h: 0.32,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
    slide.addText(card.value, {
      x: card.x + 0.15, y: card.y + 0.46, w: card.w - 0.3, h: 0.5,
      fontSize: 26, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_primary, autoFit: true
    });
    slide.addText(card.note, {
      x: card.x + 0.15, y: card.y + 0.98, w: card.w - 0.3, h: 0.28,
      fontSize: 9.5, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary
    });
  });

  // 하단 테이블 — 시장 데이터 출처 비교
  const headers = ['출처', '2025 규모', 'CAGR', '전망'];
  const dataRows = [
    ['Fortune Business', '$2.57B', '16.62% (2025~34)', '2034: $10.26B'],
    ['Grand View',       '$2.45B', '21.0% (2026~33)',  '2033: $10.61B'],
    ['Mordor',           '$3.29B (2026)', '15.07% (2026~31)', '2031: $6.64B'],
    ['IMARC',            '$2.4B (2024)', '13% (2025~33)', '2033: $7.1B'],
  ];

  addStyledTable(slide, headers, dataRows, { x: 0.6, y: 3.85, w: 12.13, rowH: 0.48 });

  // 주석
  slide.addText('CAGR 편차: fs만 포함 vs fs+ps, 광학부품 포함 여부 정의 차이에 기인', {
    x: 0.6, y: 6.8, w: 12.13, h: 0.32,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
    italic: true
  });

  addPageNumber(slide, 37, TOTAL_SLIDES);
}

// [38] Cards 2×2 — 4대 성장 드라이버
function slide38_growth_drivers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4대 성장 드라이버: EV 배터리 + 반도체 + 디스플레이 + 의료기기');

  const cards = [
    {
      x: 0.6, y: 1.9, w: 5.915, h: 2.45,
      accentColor: COLORS.accent_blue,
      title: 'EV 배터리 기가팩토리',
      body: '전극 패터닝·노칭, 모듈 용접, 냉각판 실링. NREL BatMan 1,200 m+ 롤투롤 처리. 기가팩토리 설비투자 직결 — EV 수요 둔화 시 리스크 ★★'
    },
    {
      x: 6.815, y: 1.9, w: 5.515, h: 2.45,
      accentColor: COLORS.accent_cyan,
      title: '반도체 첨단 패키징',
      body: 'HBM 적층(CoWoS), TSV 종횡비 10:1 이상. 삼성·SK하이닉스 이미 fs 레이저 배포. 3D 패키징 수요 지속 성장 ★★'
    },
    {
      x: 0.6, y: 4.55, w: 5.915, h: 2.45,
      accentColor: COLORS.accent_yellow,
      title: '디스플레이 (OLED/UTG)',
      body: '폴더블·롤러블 디스플레이 확산. 형상 커팅 + UTG 필라멘테이션 표준화. 한국·일본 패널 업체 중심 수요 집중'
    },
    {
      x: 6.815, y: 4.55, w: 5.515, h: 2.45,
      accentColor: COLORS.accent_purple,
      title: '의료기기',
      body: '안과(fs 레이저 수술 표준화) + 피부과(ps 레이저 성장). 안과 분야 USP 시장 점유 41.9%. 규제 승인 지연이 성장 제약'
    },
  ];

  cards.forEach(c => addCard(slide, c));

  addPageNumber(slide, 38, TOTAL_SLIDES);
}

// [39] TwoColumn — GHz 버스트 + kW급 출력
function slide39_burst_kw() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'GHz 버스트 + kW급 출력 = 양산 진입의 열쇠');

  // 구분선
  slide.addShape('rect', { x: 6.73, y: 1.85, w: 0.03, h: 5.25, fill: { color: 'E2E8F0' } });

  // === 좌측: 버스트 모드 혁신 ===
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 0.06, h: 0.32, fill: { color: COLORS.accent_cyan } });
  slide.addText('버스트 모드 혁신', {
    x: 0.75, y: 1.85, w: 5.7, h: 0.32,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary
  });

  const leftItems = [
    { label: 'BiBurst(GHz in MHz)', desc: 'Si 어블레이션 23배 향상, 공기 이온화 방지' },
    { label: '유리 처리',           desc: '버스트당 10~30 µm 절제, 최대 60 kJ/cm² 플루언스에서 재료 분쇄 없음' },
    { label: '파라미터 사례',       desc: '133 MHz 인트라버스트, 70펄스/버스트, 240 µJ/버스트, 1 kHz 인터버스트율' },
    { label: '재료 의존성',         desc: 'Cu, STS에서 GHz가 단일 대비 MRR 낮을 수 있음 → 사전 테스트 필수' },
  ];

  leftItems.forEach((item, i) => {
    const yBase = 2.35 + i * 1.12;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 5.9, h: 1.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.25, h: 1.0, fill: { color: COLORS.accent_cyan } });
    slide.addText(item.label, {
      x: 0.95, y: yBase + 0.08, w: 5.4, h: 0.32,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 0.95, y: yBase + 0.46, w: 5.4, h: 0.42,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // === 우측: kW급 평균 출력 ===
  slide.addShape('rect', { x: 6.9, y: 1.85, w: 0.06, h: 0.32, fill: { color: COLORS.accent_blue } });
  slide.addText('kW급 평균 출력', {
    x: 7.05, y: 1.85, w: 5.7, h: 0.32,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary
  });

  const rightItems = [
    { label: 'TRUMPF 1kW USP (2024년 8월)', desc: 'Fraunhofer ILT 배터리·반도체 공정 시험 중 ★★★' },
    { label: '2kW 전광섬유 (1064 nm)',       desc: '76.6% 효율, 1.39 GHz 반복률, 비선형 왜곡 억제' },
    { label: 'EU 지원 1.5kW 시스템',         desc: 'GW급 첨두 출력 + 기본 모드 빔 품질' },
    { label: '스케일링 과제',                desc: 'TMI(횡모드 불안정), 비선형 효과(SPM·SRS), 단일 채널 출력 한계' },
  ];

  rightItems.forEach((item, i) => {
    const yBase = 2.35 + i * 1.12;
    slide.addShape('roundRect', {
      x: 6.9, y: yBase, w: 5.83, h: 1.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x: 6.9, y: yBase, w: 0.25, h: 1.0, fill: { color: COLORS.accent_blue } });
    slide.addText(item.label, {
      x: 7.25, y: yBase + 0.08, w: 5.33, h: 0.32,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 7.25, y: yBase + 0.46, w: 5.33, h: 0.42,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  addPageNumber(slide, 39, TOTAL_SLIDES);
}

// [40] Cards 2×2 — 신흥 어플리케이션 4선
function slide40_emerging_apps() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '신흥 어플리케이션 4선: 양자컴퓨팅·국방·나노포토닉·리소그래피');

  const cards = [
    {
      x: 0.6, y: 1.9, w: 5.915, h: 2.45,
      accentColor: COLORS.accent_blue,
      title: '양자컴퓨팅 ★★★',
      body: 'NKT Photonics–IonQ 파트너십(2024): 바륨이온 양자컴퓨터용 모듈식 랙 마운트 레이저 서브시스템 2025년 납품. 다이아몬드 Tin-vacancy 센터 단광자 생성 + 양자 스핀'
    },
    {
      x: 6.815, y: 1.9, w: 5.515, h: 2.45,
      accentColor: COLORS.accent_yellow,
      title: '국방·항공우주 ★★',
      body: 'Cornell/ONR: 비선형 광학 결정 이용 NIR→MIR 변환 효율 수배 향상 → 야전 배치형 열추적 미사일 교란 레이저. DARPA PULSE: 탁상형 코히런트 X선 소스'
    },
    {
      x: 0.6, y: 4.55, w: 5.915, h: 2.45,
      accentColor: COLORS.accent_cyan,
      title: '나노포토닉 가속기 ★',
      body: '500 µm 거리에서 전자 에너지 43% 향상 (class5photonics 2024). 소형 입자 가속기 원천기술. 현재 연구 단계'
    },
    {
      x: 6.815, y: 4.55, w: 5.515, h: 2.45,
      accentColor: COLORS.accent_purple,
      title: 'TPP 나노리소그래피 ★★',
      body: '2광자 중합 고반복률 fs 레이저로 양산 진입 준비 중. 나노스케일 3D 패터닝. 기존 포토리소그래피 대체 가능성 연구 단계'
    },
  ];

  cards.forEach(c => addCard(slide, c));

  addPageNumber(slide, 40, TOTAL_SLIDES);
}

// [41] Content — 중국 USP 시장
function slide41_china_market() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '중국 USP 시장이 2030년 $2.19B로 2배 성장한다');

  const bullets = [
    {
      accent: COLORS.accent_blue,
      label: '중국 단독 시장 성장',
      desc: '2025년 $1.11B → 2030년 $2.19B (CAGR 14.46%) ★★★ — ResearchAndMarkets 2025'
    },
    {
      accent: COLORS.accent_cyan,
      label: 'Amplitude Laser Group',
      desc: '2024년 8월 Suzhou 현지 생산·서비스 거점 설립'
    },
    {
      accent: COLORS.accent_yellow,
      label: '내수 업체 성장',
      desc: 'JPT, Raycus 등 중국산 USP 레이저 급성장 → 서구 업체 마진 압박 가능성'
    },
    {
      accent: COLORS.accent_purple,
      label: '전략적 고려사항',
      desc: '중국산 장비 검토 시 빔 품질(M²), MTBF, 서비스 인프라를 서구 제품과 직접 비교 필요'
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.0;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 0.88, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.88, fill: { color: b.accent } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.3,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.44, w: 11.5, h: 0.32,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 후속 탐색 질문
  slide.addShape('roundRect', {
    x: 0.6, y: 6.2, w: 12.13, h: 0.65, rectRadius: 0.08,
    fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1.0 }
  });
  slide.addText('후속 탐색 질문: 중국 USP 업체 기술 격차와 가격 경쟁 본격화 시점은?', {
    x: 0.85, y: 6.28, w: 11.7, h: 0.38,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_yellow
  });

  addPageNumber(slide, 41, TOTAL_SLIDES);
}

// [42] Section — Part G 섹션 구분
function slide42_section_g() {
  const slide = pptx.addSlide();

  // 좌 40% 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 60% 밝은 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 8.0, h: 7.5, fill: { color: COLORS.bg_primary } });

  // 좌측 섹션 번호
  slide.addText('G', {
    x: 0.6, y: 1.8, w: 4.4, h: 2.0,
    fontSize: 120, fontFace: FONTS.kpi.fontFace, bold: true,
    color: '2A3050', align: 'left'
  });
  slide.addShape('rect', { x: 0.6, y: 3.9, w: 3.5, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('Part G', {
    x: 0.6, y: 4.1, w: 4.4, h: 0.4,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue
  });
  slide.addText('내일 업무에 적용하는\n의사결정 가이드', {
    x: 0.6, y: 4.6, w: 4.4, h: 1.6,
    fontSize: 22, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.3
  });

  // 우측 내용
  slide.addText('이번 파트의 내용', {
    x: 5.8, y: 2.2, w: 7.0, h: 0.45,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
  });
  slide.addShape('rect', { x: 5.8, y: 2.72, w: 6.8, h: 0.05, fill: { color: 'E2E8F0' } });

  const items = [
    { icon: 'TCO 비교',         desc: 'ns vs ps vs fs — 초기 투자비가 전부가 아니다' },
    { icon: '역방향 의사결정', desc: '만약 X이면 → Y를 하라 (8개 결정 가이드)' },
    { icon: '실패 모드',        desc: '간과하면 공정이 실패하는 5가지 주의사항' },
    { icon: '후속 탐색',        desc: '이번 리서치가 답하지 못한 질문 3가지' },
  ];

  items.forEach((item, i) => {
    const yBase = 3.05 + i * 0.9;
    slide.addShape('roundRect', {
      x: 5.8, y: yBase, w: 7.0, h: 0.72, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x: 5.8, y: yBase, w: 0.28, h: 0.72, fill: { color: COLORS.accent_blue } });
    slide.addText(item.icon, {
      x: 6.18, y: yBase + 0.06, w: 6.4, h: 0.28,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 6.18, y: yBase + 0.38, w: 6.4, h: 0.26,
      fontSize: 10.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });
  // 페이지 번호 없음 (섹션 슬라이드)
}

// [43] Table — TCO 비교
function slide43_tco_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'TCO 비교: ns vs ps vs fs — 초기 투자비가 전부가 아니다');

  const headers = ['항목', '나노초(ns)', '피코초(ps)', '펨토초(fs)'];
  const dataRows = [
    ['초기 투자비',          '낮음',               '높음',         '매우 높음'],
    ['소모품(공구·연마재)',  '높음',               '거의 없음',    '없음'],
    ['후처리 비용',          '높음 (재작업·폴리싱)', '낮음',         '매우 낮음'],
    ['부품당 비용(양산)',    '수명 기준 높음',      '낮음',         '낮음'],
    ['자동화 적합성',        '중간',               '우수',         '우수'],
    ['수율·안정성',          '낮음',               '높음',         '높음'],
    ['투자 회수 기간',       '—',                  '1~3년 (고정밀)', '1~3년 (고정밀)'],
  ];

  addStyledTable(slide, headers, dataRows, { x: 0.6, y: 1.9, w: 12.13, rowH: 0.5 });

  // 하단 정량 지표 박스
  slide.addShape('rect', {
    x: 0.6, y: 5.7, w: 12.13, h: 1.45,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addShape('rect', { x: 0.6, y: 5.7, w: 0.28, h: 1.45, fill: { color: COLORS.accent_cyan } });
  slide.addText('정량 지표 (복수 출처 합성 ★★)', {
    x: 1.0, y: 5.75, w: 11.5, h: 0.3,
    fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary
  });
  slide.addText(
    '총 생산 비용 절감: 15~30%  |  후가공 비용 절감: 최대 60%  |  다중빔 처리 시 처리량 향상: 최대 400%\nPCD 공구: 연간 ~$280K 절감  ⚠️ 제조사 자료 — 독립 검증 미확인',
    {
      x: 1.0, y: 6.1, w: 11.5, h: 0.9,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5
    }
  );

  addPageNumber(slide, 43, TOTAL_SLIDES);
}

// [44] Table — 역방향 의사결정 가이드
function slide44_reverse_decision() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '역방향 의사결정 가이드: 만약 X이면 → Y를 하라');

  const headers = ['만약...', '그러면...'];
  const dataRows = [
    ['공차 ±0.01 mm 이하, HAZ <5 µm 필수',        'ns 대신 USP(ps 이상) 도입 검토'],
    ['공차 ±0.005 mm 이하, Ra <0.1 µm 필요',       'ps가 아닌 fs 선택'],
    ['유리/사파이어 절단 + 양산 처리량 우선',       'fs 대신 ps (Bessel 빔 + 필라멘테이션) — OLED 표준'],
    ['배터리 전극 패터닝 검토 중',                  '벤치스케일 성과(NREL)를 roll-to-roll에서 재검증 (★★ 양산 미확인)'],
    ['반복률 >1 MHz 운용 예정',                     '열 누적 모델링 선행 — 콜드 어블레이션 가정 붕괴 가능'],
    ['중국산 USP 레이저 검토 중',                   '빔 품질(M²), MTBF, 서비스 인프라를 서구 제품과 직접 비교'],
    ['GHz 버스트 모드 도입 검토',                   '재료 의존성 강함 — 대상 재료에서 반드시 사전 테스트'],
    ['투자 회수 3년 초과 전망',                     'ps로 다운그레이드 또는 기존 ns/기계 공정 유지'],
  ];

  addStyledTable(slide, headers, dataRows, {
    x: 0.6, y: 1.85, w: 12.13, rowH: 0.48,
    colW: [5.5, 6.63]
  });

  slide.addText('출처: 00-synthesis.md §7 역방향 의사결정 가이드', {
    x: 0.6, y: 7.0, w: 12.13, h: 0.28,
    fontSize: 9.5, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary, italic: true
  });

  addPageNumber(slide, 44, TOTAL_SLIDES);
}

// [45] Content — 실패 모드 + 안전
function slide45_failure_modes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '주의: 이것을 간과하면 공정이 실패한다');

  const items = [
    {
      accent: COLORS.accent_red,
      label: 'Class 4 레이저 안전',
      desc: '인터록 시스템, 차폐, 보호 안경 필수. 직접 노출 시 즉각 실명 위험'
    },
    {
      accent: COLORS.accent_yellow,
      label: '나노입자/퓸(fume) — 건강 이슈',
      desc: '금속 가공 시 발생 나노입자 — 작업자 건강 이슈, 배기·HEPA 필터 시스템 필수'
    },
    {
      accent: COLORS.accent_purple,
      label: '유리 필라멘테이션 실패 모드',
      desc: '강화유리 잔류응력 → 크랙 전파 방향 이탈, 비정상 파단'
    },
    {
      accent: COLORS.accent_cyan,
      label: '배터리 전극 패터닝 실패',
      desc: '채널 깊이 불균일 → 전해액 편류, 국부 리튬 도금 위험'
    },
    {
      accent: COLORS.accent_blue,
      label: '경쟁 기술 영역 — USP가 항상 정답이 아님',
      desc: 'DRIE(MEMS 높은 종횡비 대량 양산), EDM(금형·미세홀 비용 경쟁력), ns 레이저(마킹·거친 절삭 TCO 우위)'
    },
  ];

  items.forEach((item, i) => {
    const yBase = 2.0 + i * 0.99;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 0.86, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.86, fill: { color: item.accent } });
    slide.addText(item.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.3,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 1.05, y: yBase + 0.44, w: 11.5, h: 0.32,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  addPageNumber(slide, 45, TOTAL_SLIDES);
}

// [46] Content — 후속 탐색 질문
function slide46_followup_questions() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '후속 탐색 질문 — 이번 리서치가 답하지 못한 것');

  const questions = [
    {
      accent: COLORS.accent_yellow,
      label: '중국 USP 레이저 업체 기술 격차',
      desc: 'JPT, Raycus 등이 서구·일본 대비 어느 수준? 가격 경쟁 본격화 시점은? (★ 후속 조사 필요)'
    },
    {
      accent: COLORS.accent_cyan,
      label: 'GHz 버스트 모드 양산 적용 사례',
      desc: 'R&D를 넘어 실제 생산라인에 통합된 검증 사례가 있는가? (★★ 확인 필요)'
    },
    {
      accent: COLORS.accent_red,
      label: '"USP 레이저가 실패한 어플리케이션"',
      desc: '시도되었다가 ns/기계 가공으로 회귀한 사례 — 성공 편향 교정을 위해 반드시 조사 필요'
    },
  ];

  questions.forEach((q, i) => {
    const yBase = 2.1 + i * 1.2;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 1.05, rectRadius: 0.1,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.75 }
    });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.35, h: 1.05, fill: { color: q.accent } });
    slide.addText(q.label, {
      x: 1.1, y: yBase + 0.1, w: 11.4, h: 0.35,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(q.desc, {
      x: 1.1, y: yBase + 0.52, w: 11.4, h: 0.4,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 인용 박스 (accent_blue 테두리)
  slide.addShape('roundRect', {
    x: 0.6, y: 5.9, w: 12.13, h: 0.85, rectRadius: 0.08,
    fill: { color: 'EFF4FF' }, line: { color: COLORS.accent_blue, width: 1.5 }
  });
  slide.addShape('rect', { x: 0.6, y: 5.9, w: 0.06, h: 0.85, fill: { color: COLORS.accent_blue } });
  slide.addText('"품질 우선은 느려도 된다는 뜻이지, 불필요하게 비효율적이어도 된다는 뜻은 아니다"', {
    x: 0.85, y: 5.98, w: 11.7, h: 0.6,
    fontSize: 13, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.accent_blue, align: 'center', valign: 'middle'
  });

  addPageNumber(slide, 46, TOTAL_SLIDES);
}

// [47] Closing — USP 레이저 전환 선언
function slide47_closing() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });

  // 배경 장식 — 우하 빛 번짐
  slide.addShape('roundRect', {
    x: 7.0, y: 4.5, w: 6.5, h: 4.5, rectRadius: 3.5,
    fill: { color: '0A2540' }, line: { color: '0A2540', width: 0 }
  });

  // 상단 레이저 빔 라인
  slide.addShape('rect', { x: 0, y: 2.65, w: 13.33, h: 0.03, fill: { color: COLORS.accent_blue } });
  slide.addShape('rect', { x: 0, y: 2.68, w: 13.33, h: 0.015, fill: { color: COLORS.accent_cyan } });

  // 좌측 강조 바
  slide.addShape('rect', { x: 0.8, y: 1.0, w: 0.07, h: 2.8, fill: { color: COLORS.accent_blue } });

  // 메인 제목
  slide.addText("USP 레이저는 '정밀도 프리미엄'에서\n'양산 필수'로 전환 중이다", {
    x: 1.1, y: 0.95, w: 11.0, h: 2.2,
    fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.25, charSpacing: -0.5
  });

  // 핵심 메시지 5개
  const messages = [
    { num: '01', text: '콜드 어블레이션 → HAZ 13배 감소, 후처리 제거, 신소재 가공 가능' },
    { num: '02', text: '"fs > ps" 통념 불식 → 재료별 적합 스펙 선택이 TCO 최적화' },
    { num: '03', text: 'GHz 버스트 + 1kW USP → 양산 진입 장벽 해소' },
    { num: '04', text: '$2.4~2.9B 시장, CAGR 15~17% → EV·반도체·디스플레이 드라이버' },
    { num: '05', text: 'TCO 관점 → 초기 투자비가 아닌 재료 절감·후처리 제거·수율로 평가' },
  ];

  messages.forEach((msg, i) => {
    const yBase = 2.95 + i * 0.72;
    slide.addShape('rect', {
      x: 0.8, y: yBase + 0.15, w: 0.55, h: 0.35,
      fill: { color: COLORS.accent_blue }
    });
    slide.addText(msg.num, {
      x: 0.8, y: yBase + 0.15, w: 0.55, h: 0.35,
      fontSize: 11, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle'
    });
    slide.addText(msg.text, {
      x: 1.55, y: yBase + 0.1, w: 10.7, h: 0.42,
      fontSize: 13.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_on_dark, lineSpacingMultiple: 1.3
    });
  });

  // 하단 구분선
  slide.addShape('rect', { x: 0.8, y: 7.0, w: 5.5, h: 0.03, fill: { color: '3A4460' } });

  // 감사 인사 + 문의 안내
  slide.addText('감사합니다  |  질문 및 토론 환영합니다', {
    x: 0.8, y: 7.1, w: 11.5, h: 0.32,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: false,
    color: COLORS.accent_cyan
  });

  // 페이지 번호 없음 (closing 슬라이드)
}

// === Part 4 끝 ===
