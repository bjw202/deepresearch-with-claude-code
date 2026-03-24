// ============================================================
// Part C: Slides 61~85
// 전역 변수 (pptx, TOTAL_SLIDES, COLORS, FONTS, TABLE_STYLE,
//   TABLE_OPTIONS, CHART_STYLE, addTitleBar, addStyledTable,
//   addCard, addPageNumber, addFlowBox, addFlowArrow, addFlowDiamond)
// 는 Part A에서 정의됨.
// ============================================================

// ============================================================
// Slide 61: Section Divider — Part 5 레이저-물질 상호작용
// ============================================================
function slide61_section5() {
  const slide = pptx.addSlide();
  // 좌측 다크 패널
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 섹션 번호
  slide.addText('05', {
    x: 1.0, y: 2.3, w: 3.33, h: 1.6,
    fontSize: 80, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center', valign: 'middle'
  });
  // 우측 섹션 제목
  slide.addText('레이저-물질 상호작용', {
    x: 5.9, y: 2.4, w: 6.83, h: 0.85,
    fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_primary
  });
  // 설명
  slide.addText('레이저가 재료에 닿았을 때 일어나는 현상을 이해한다', {
    x: 5.9, y: 3.35, w: 6.83, h: 1.0,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  // 섹션 디바이더에는 페이지 번호 없음
}

// ============================================================
// Slide 62: 흡수/반사/투과 (다이어그램)
// ============================================================
function slide62_absorption_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '입사 빔의 에너지는 흡수 + 반사 + 투과로 분배된다');

  // --- 플로우 다이어그램 ---
  // 입사 빔 → 재료 표면
  addFlowBox(slide, 0.5, 1.9, 2.2, 0.65, '입사 빔 (Incident Beam)', COLORS.accent_blue, COLORS.text_on_dark);
  addFlowArrow(slide, 2.7, 2.22, 3.5, 2.22);
  addFlowBox(slide, 3.5, 1.9, 2.2, 0.65, '재료 표면 (Surface)', COLORS.bg_dark, COLORS.text_on_dark);

  // 세 방향 분기 화살표 및 박스
  // 반사 — 위
  addFlowArrow(slide, 4.6, 1.9, 4.6, 1.1);
  addFlowBox(slide, 3.5, 0.45, 2.2, 0.6, '반사 (Reflection): 돌아감', COLORS.accent_yellow, COLORS.bg_dark);

  // 흡수 — 오른쪽
  addFlowArrow(slide, 5.7, 2.22, 6.5, 2.22);
  addFlowBox(slide, 6.5, 1.9, 2.8, 0.65, '흡수 (Absorption): 열/전자 여기', COLORS.accent_red, COLORS.text_on_dark);
  addFlowArrow(slide, 9.3, 2.22, 10.1, 2.22);
  addFlowBox(slide, 10.1, 1.9, 2.6, 0.65, '가공 에너지', COLORS.accent_cyan, COLORS.bg_dark);

  // 투과 — 아래
  addFlowArrow(slide, 4.6, 2.55, 4.6, 3.3);
  addFlowBox(slide, 3.5, 3.3, 2.2, 0.7, '투과 (Transmission): 통과\n(금속에서는 거의 없음)', COLORS.text_tertiary, COLORS.text_on_dark);

  // 에너지 보존 식
  slide.addShape('roundRect', {
    x: 0.5, y: 4.3, w: 12.33, h: 0.65, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('에너지 보존: 흡수 + 반사 + 투과 = 1 (A + R + T = 1)', {
    x: 0.7, y: 4.32, w: 11.93, h: 0.6,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue, align: 'center', valign: 'middle'
  });

  // 주석
  slide.addText('금속에서 침투 깊이 = 10~100 nm (표면에 집중) — 대부분의 에너지가 극표면에서 소멸', {
    x: 0.5, y: 5.15, w: 12.33, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_tertiary, valign: 'middle'
  });

  addPageNumber(slide, 62, TOTAL_SLIDES);
}

// ============================================================
// Slide 63: 파장별 재료 흡수율 (1/2)
// ============================================================
function slide63_absorption1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '파장-재료 매칭이 가공 가능 여부를 결정한다 (1/2)');

  addStyledTable(slide,
    ['재료', 'CO₂ (10.6 μm)', '파이버 (~1 μm)', '그린 (532 nm)', 'UV (355 nm↓)'],
    [
      ['연강', '5~15 %', '30~40 %', '55~60 %', '60~65 %'],
      ['SUS (스테인리스)', '5~15 %', '35~45 %', '—', '~70 %'],
      ['알루미늄', '~2 %', '5~15 %', '—', '15~20 %'],
      ['구리 (Copper)', '1~2 %', '~5 %', '40~50 %', '40~60 %'],
    ],
    { y: 1.9, w: 12.13, rowH: [0.55, 0.6, 0.6, 0.6, 0.6] }
  );

  slide.addText([
    { text: '위 값은 상온·평탄 표면 기준. 가공 조건(온도↑·거칠기↑)에서 흡수율이 크게 상승한다.', options: { bullet: true, indentLevel: 0 } },
    { text: '파장이 짧을수록 금속 흡수율이 전반적으로 높다 (전자 밴드 구조).', options: { bullet: true, indentLevel: 0 } },
  ], {
    x: 0.6, y: 5.0, w: 12.13, h: 1.5,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top'
  });

  addPageNumber(slide, 63, TOTAL_SLIDES);
}

// ============================================================
// Slide 64: 파장별 재료 흡수율 (2/2)
// ============================================================
function slide64_absorption2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '파장-재료 매칭이 가공 가능 여부를 결정한다 (2/2)');

  addStyledTable(slide,
    ['재료', 'CO₂ (10.6 μm)', '파이버 (~1 μm)', '그린 (532 nm)', 'UV (355 nm↓)'],
    [
      ['유리/아크릴', '>90 %', '낮음 (투과)', '—', '중~높음'],
      ['폴리머/목재', '높음', '낮음', '—', '높음'],
    ],
    { y: 1.9, w: 12.13, rowH: [0.55, 0.65, 0.65] }
  );

  // 주의사항
  slide.addText([
    { text: '위 값은 상온/평탄 표면 기준. 가공 조건에서 흡수율 급상승', options: { bullet: true, indentLevel: 0 } },
    { text: '알루미늄: 상온 ~8-15 % → 가열 시 15~25 %로 상승', options: { bullet: true, indentLevel: 0 } },
    { text: '구리: 상온 IR(적외선) 흡수율 극저. 임계 온도 이상에서 비선형 급증 — 초기 가공 시작이 어려운 이유', options: { bullet: true, indentLevel: 0 } },
    { text: '표면 산화막·거칠기↑ → 다중 반사로 실효 흡수율↑ (Effective Absorptivity 증가)', options: { bullet: true, indentLevel: 0 } },
  ], {
    x: 0.6, y: 3.5, w: 12.13, h: 3.0,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.55, paraSpaceAfter: 6, valign: 'top'
  });

  addPageNumber(slide, 64, TOTAL_SLIDES);
}

// ============================================================
// Slide 65: 강도별 재료 반응 단계 (다이어그램)
// ============================================================
function slide65_intensity_stages() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 강도가 올라갈수록 재료 반응이 단계적으로 변한다');

  // 플로우 다이어그램 (수평, 왼→오)
  const stages = [
    { label: '낮은 강도\n(Low Intensity)', fill: COLORS.text_tertiary },
    { label: '가열\n(Heating)\n온도↑', fill: COLORS.accent_yellow },
    { label: '용융\n(Melting)\n액상', fill: COLORS.accent_blue },
    { label: '기화\n(Vaporization)\n증기', fill: COLORS.accent_cyan },
    { label: '플라즈마\n(Plasma)\n이온화', fill: COLORS.accent_red },
  ];
  const bW = 2.0, bH = 1.3, startX = 0.5, y = 1.9;
  const gap = 0.35;
  stages.forEach(function(st, i) {
    const x = startX + i * (bW + gap);
    addFlowBox(slide, x, y, bW, bH, st.label, st.fill, COLORS.text_on_dark);
    if (i < stages.length - 1) {
      addFlowArrow(slide, x + bW, y + bH / 2, x + bW + gap, y + bH / 2);
    }
  });

  // 하단 테이블
  addStyledTable(slide,
    ['공정', '파워 밀도', '특성'],
    [
      ['마킹 (Marking)', '10³~10⁴ W/cm²', '재료 제거 없음. 표면 변색·산화로 식별'],
      ['전도 용접 (Conduction Welding)', '10⁴~10⁶ W/cm²', '얕고 넓은 비드. 열전도로 용융'],
      ['절단/키홀 용접 (Keyhole Welding)', '10⁶~10⁷ W/cm²', '키홀(증기 채널) 형성. 깊고 좁은 용입'],
      ['드릴링/어블레이션 (Ablation)', '>10⁷ W/cm²', '재료 기화 제거. 초단펄스 영역'],
    ],
    { y: 3.55, w: 12.13, rowH: [0.5, 0.6, 0.6, 0.6, 0.6] }
  );

  addPageNumber(slide, 65, TOTAL_SLIDES);
}

// ============================================================
// Slide 66: 절단 — 3가지 메커니즘
// ============================================================
function slide66_cutting() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '절단 메커니즘은 가스와 강도 조합으로 결정된다');

  addStyledTable(slide,
    ['구분', '용융 절단 (Melt Cutting)', '승화 절단 (Sublimation Cutting)', '산화 절단 (Flame Cutting)'],
    [
      ['메커니즘', '레이저 용융 + 가스로 용융물 배출', '직접 기화 제거', '레이저 + O₂ 발열 반응 (재료 연소)'],
      ['어시스트 가스', 'N₂ (질소)', '없음 또는 Ar (아르곤)', 'O₂ (산소)'],
      ['절단면 품질', '산화 없음, 깨끗한 면', '매우 깨끗한 면', '산화막 발생, 열영향↑'],
      ['절단 속도', '중간', '느림 (에너지 집약)', '빠름 (발열 보조)'],
      ['주요 적용', 'SUS, 알루미늄 정밀 절단', '유기물, 세라믹, 반도체', '연강·탄소강 두꺼운 판재'],
    ],
    { y: 1.9, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 66, TOTAL_SLIDES);
}

// ============================================================
// Slide 67: 용접 — 전도 vs 키홀
// ============================================================
function slide67_welding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '키홀 용접은 깊은 용입을 만들지만 불안정성 위험이 있다');

  const cardW = 5.8, cardH = 3.4, topY = 1.85;

  // 전도 용접 카드
  addCard(slide, {
    x: 0.5, y: topY, w: cardW, h: cardH,
    title: '전도 용접 (Conduction Mode)',
    body: '파워 밀도 < 10⁶ W/cm²\n열전도로 용융 → 얕고 넓은 비드\n\n장점: 안정적, 기공(Porosity) 적음\n단점: 느림, 얕은 용입, 낮은 어스펙트비\n\n적용: 박판, 정밀 기기, 의료 부품',
    accentColor: COLORS.accent_blue
  });

  // 키홀 용접 카드
  addCard(slide, {
    x: 7.0, y: topY, w: cardW, h: cardH,
    title: '키홀 용접 (Keyhole Mode)',
    body: '파워 밀도 > 10⁶ W/cm²\n증기압으로 키홀(Keyhole) 형성 → 깊고 좁은 용입\n\n장점: 빠름, 깊은 용입, 높은 어스펙트비\n단점: 키홀 불안정 → 기공(Porosity), 스패터\n\n적용: 두꺼운 구조재, 배터리 탭, 자동차 바디',
    accentColor: COLORS.accent_red
  });

  // 하단 인사이트
  slide.addShape('roundRect', {
    x: 0.5, y: 5.5, w: 12.33, h: 0.65, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('링+코어 빔(Ring+Core Beam) 프로파일로 키홀 안정화 → 기공률 90% 감소 사례 보고 (IPG, nLIGHT)', {
    x: 0.7, y: 5.52, w: 11.93, h: 0.6,
    fontSize: 13, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.accent_blue, align: 'center', valign: 'middle'
  });

  addPageNumber(slide, 67, TOTAL_SLIDES);
}

// ============================================================
// Slide 68: 용접 결함 유형
// ============================================================
function slide68_weld_defects() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 용접 결함을 알면 파라미터 조정 방향을 잡을 수 있다');

  addStyledTable(slide,
    ['결함', '주요 원인', '대책'],
    [
      ['기공 (Porosity)', '키홀 붕괴, 가스 포획, 이물질 증발', '속도 조정, 빔 셰이핑(링+코어), 차폐가스 강화'],
      ['크랙 (Crack)', '급속 열응력, 재료 취성, 합금 성분', '예열, 후열처리, 용접 순서 최적화'],
      ['스패터 (Spatter)', '키홀 불안정, 과도한 증기압', '출력/속도 조정, 빔 프로파일 개선'],
      ['불완전 용입 (Lack of Fusion)', '에너지 부족, 초점 이탈', '출력↑, 속도↓, 초점 위치 재조정'],
      ['언더컷 (Undercut)', '가장자리 용융 과다, 속도 불균형', '속도 조정, 초점 위치 최적화'],
    ],
    { y: 1.9, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 68, TOTAL_SLIDES);
}

// ============================================================
// Slide 69: 마킹/클래딩/드릴링/표면처리
// ============================================================
function slide69_other_processes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저는 하나의 도구로 다양한 공정을 수행한다');

  const cW = 5.8, cH = 2.2;
  addCard(slide, {
    x: 0.5, y: 1.8, w: cW, h: cH,
    title: '마킹 (Marking)',
    body: '표면 산화, 어닐링, 어블레이션, 색변화를 이용한 식별 표시.\n파이버 + 갈바노 스캐너로 고속 처리 가능.',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 7.0, y: 1.8, w: cW, h: cH,
    title: '클래딩/DED (Directed Energy Deposition)',
    body: '파우더·와이어 공급 + 레이저 용융으로 표면 보수 또는 적층.\n별도 피딩(Feeding) 시스템 필요.',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.5, y: 4.15, w: cW, h: 2.3,
    title: '드릴링 (Drilling)',
    body: '타공(Percussion): 정점에서 반복 펄스로 홀 성형.\n트레파닝(Trepanning): 원형 경로를 따라 절단.\n깊은 소구경 홀에는 Percussion 방식이 유리.',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 7.0, y: 4.15, w: cW, h: 2.3,
    title: '표면처리 (Surface Treatment)',
    body: '열처리(경화), 텍스처링(미세 패턴), 세정(오염 제거).\n비접촉 + 선택적 처리로 복잡한 형상에도 적용 가능.',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 69, TOTAL_SLIDES);
}

// ============================================================
// Slide 70: 초단펄스 냉간 가공
// ============================================================
function slide70_ultrashort_cold() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에너지 입력 시간 < 열확산 시간 = Cold Ablation (냉간 가공)');

  addStyledTable(slide,
    ['펄스폭', '열영향부 (HAZ)', '가공면 품질', '주요 메커니즘', '적합 용도'],
    [
      ['나노초 (ns)', '크고 불규칙', '버(Burr)·리캐스트 많음', '열적 (Thermal)', '일반 절단·마킹'],
      ['피코초 (ps)', '작음', '깨끗한 면', '혼합 (Mixed)', '정밀 가공·의료'],
      ['펨토초 (fs)', '극소', '매우 깨끗한 면', '비열적 (쿨롱 폭발, Coulomb Explosion)', '초정밀·반도체·바이오'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.7, 0.7, 0.7] }
  );

  // 반증/주의
  slide.addShape('roundRect', {
    x: 0.5, y: 3.95, w: 12.33, h: 1.1, rectRadius: 0.08,
    fill: { color: 'FFF5F5' }, line: { color: COLORS.accent_red, width: 1 }
  });
  slide.addText('주의 — 반증', {
    x: 0.75, y: 4.0, w: 2.0, h: 0.35,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_red
  });
  slide.addText('fs 반복률↑ → 펄스간 열 누적 → HAZ가 다시 커진다. 또한 fs 장비 비용이 극히 높아 ps가 현실적 선택인 경우가 많다.', {
    x: 0.75, y: 4.35, w: 11.83, h: 0.65,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });

  // 이질 도메인
  slide.addShape('roundRect', {
    x: 0.5, y: 5.2, w: 12.33, h: 0.85, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('[이질 도메인: EDM (방전가공)] 방전가공의 펄스 폭 최적화와 동일 원리 — "에너지 입력 시간 < 열확산 시간"으로 정밀도를 높이는 구조', {
    x: 0.7, y: 5.23, w: 11.93, h: 0.8,
    fontSize: 13, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4, valign: 'middle'
  });

  addPageNumber(slide, 70, TOTAL_SLIDES);
}

// ============================================================
// Slide 71: 사양서 읽는 법 (1/2)
// ============================================================
function slide71_spec_sheet1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '스펙 항목이 가공에 무엇을 의미하는지 연결한다 (1/2)');

  addStyledTable(slide,
    ['스펙 항목', '단위', '가공 의미'],
    [
      ['정격 출력 (Rated Power)', 'W / kW', '최대 가공 가능 두께, 속도 상한 결정'],
      ['파장 (Wavelength)', 'nm / μm', '재료별 흡수율 결정. 광학계 호환성 확인'],
      ['빔 품질 M²', '무차원', 'M²×2 → 스폿 지름×√2 → 에너지밀도 1/4 감소'],
      ['BPP (빔 파라미터 곱)', 'mm·mrad', '작을수록 더 작은 스폿 가능 (광학 불변량)'],
      ['파이버 코어 지름', 'μm', '작을수록 정밀 (고 BPP 요구). 100~200 μm 범용'],
      ['펄스 에너지', 'J / mJ', '어블레이션 임계값(Fluence Threshold)과 직접 비교'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 71, TOTAL_SLIDES);
}

// ============================================================
// Slide 72: 사양서 읽는 법 (2/2)
// ============================================================
function slide72_spec_sheet2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '스펙 항목이 가공에 무엇을 의미하는지 연결한다 (2/2)');

  addStyledTable(slide,
    ['스펙 항목', '단위', '가공 의미'],
    [
      ['펄스폭 (Pulse Width)', 'ns / ps / fs', '짧을수록 HAZ↓, 피크파워↑. 공정 특성 결정'],
      ['반복률 (Repetition Rate)', 'Hz / kHz', '높으면 가공속도↑, 단위 펄스 에너지↓'],
      ['냉각수 요구', 'L/min, °C', '칠러(Chiller) 사양에 직접 입력. 부족하면 열렌즈 악화'],
      ['전력 소비', 'kW / kVA', '설치 전기 용량 확인 필수'],
      ['인터페이스', '—', 'EtherCAT → PSO 연동 가능. ModBus → 기능 제한'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  // 읽기 예시
  slide.addShape('roundRect', {
    x: 0.5, y: 4.9, w: 12.33, h: 1.65, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('읽기 예시', {
    x: 0.75, y: 4.97, w: 2.5, h: 0.35,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });
  slide.addText(
    '"3 kW 파이버: 출력 3000 W / 파장 1070 nm / M²<1.1 / BPP<0.4 mm·mrad / 코어 100 μm / QBH / 10 L/min"\n→ M²<1.1 = 우수한 빔 품질, QBH = 산업 표준 커넥터 (Precitec·Trumpf 헤드 호환)',
    {
      x: 0.75, y: 5.33, w: 11.83, h: 1.15,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.45
    }
  );

  addPageNumber(slide, 72, TOTAL_SLIDES);
}

// ============================================================
// Slide 73: Section Divider — Part 6 실무 가이드
// ============================================================
function slide73_section6() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('06', {
    x: 1.0, y: 2.3, w: 3.33, h: 1.6,
    fontSize: 80, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center', valign: 'middle'
  });
  slide.addText('실무 가이드', {
    x: 5.9, y: 2.4, w: 6.83, h: 0.85,
    fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_primary
  });
  slide.addText('트러블슈팅과 의사결정을 위한 실전 참고 자료', {
    x: 5.9, y: 3.35, w: 6.83, h: 1.0,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  // 섹션 디바이더에는 페이지 번호 없음
}

// ============================================================
// Slide 74: 트러블슈팅 — 가공 품질 (1/2)
// ============================================================
function slide74_troubleshoot1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 불량 증상에서 원인과 조치를 역추적한다 (1/2)');

  addStyledTable(slide,
    ['증상', '원인', '조치'],
    [
      ['절단 안 됨 (No Cut-Through)', '플루언스 < 임계값', '출력↑ 또는 속도↓ 또는 초점 위치 재조정'],
      ['HAZ (열영향부) 과다', '에너지 입력 과다', '속도↑, 출력↓, 펄스폭↓'],
      ['버(Burr) 과다', '용융물 미제거', '가스 압력↑, 노즐 거리 최적화'],
      ['고속 드로스 (침상형)', '속도 과다 — 용융물 응고 불완전', '속도↓ 또는 출력↑'],
      ['저속 드로스 (둥근형)', '과열 — 용융물 과다 축적', '속도↑'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 74, TOTAL_SLIDES);
}

// ============================================================
// Slide 75: 트러블슈팅 — 가공 품질 (2/2)
// ============================================================
function slide75_troubleshoot2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 불량 증상에서 원인과 조치를 역추적한다 (2/2)');

  addStyledTable(slide,
    ['증상', '원인', '조치'],
    [
      ['절단면 산화·황변', 'O₂ 혼입 또는 N₂ 순도↓', 'N₂/Ar으로 교체, 순도 99.95%↑ 확인'],
      ['스트리에이션 (줄무늬)', '속도/파워 불균형, 가스 유동 불안정', '파라미터 밸런스 재조정, 가스·노즐 점검'],
      ['마킹 불균일', '갈바노 정렬 이탈, f-theta 렌즈 오염', '교정 패턴(Cal. Pattern) 테스트, 렌즈 클리닝'],
      ['코너 과가공', 'PSO 미사용 — 코너에서 속도 감속 중 출력 유지', 'PSO 활성화, 코너 게이팅(Gate) 설정'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.7, 0.7, 0.7, 0.7] }
  );

  addPageNumber(slide, 75, TOTAL_SLIDES);
}

// ============================================================
// Slide 76: 트러블슈팅 — 시스템 문제
// ============================================================
function slide76_troubleshoot_system() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '시스템 문제의 빠른 진단과 조치');

  addStyledTable(slide,
    ['증상', '원인', '진단 방법', '조치'],
    [
      ['출력 저하', '광학 오염', '렌즈·미러 육안/UV 검사', '클리닝 또는 교체'],
      ['출력 저하', '정렬 이탈', '빔 프로파일러·번 페이퍼', '빔 재정렬'],
      ['빔 품질 변동', '열렌즈 (Thermal Lensing)', '초기 vs 정상상태 품질 비교', '예열 루틴, 수냉 확인, 보호윈도우 교체'],
      ['빔 품질 갑작스런 저하', 'TMI (모드 불안정성)', '출력 진동 패턴 확인', '제조사 상담, 출력 제한 운영'],
      ['역반사 손상 경고', '역반사 (Back Reflection)', '파워 모니터 역류 신호', '아이솔레이터 확인·교체'],
      ['흄 누출', '집진 부족', '기류(Air Flow) 테스트', '필터 교체, 덕트 밀봉'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.45, 0.55, 0.55, 0.65, 0.65, 0.55, 0.55] }
  );

  addPageNumber(slide, 76, TOTAL_SLIDES);
}

// ============================================================
// Slide 77: 역방향 의사결정 가이드 (1/2)
// ============================================================
function slide77_reverse_decision1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이런 결과가 나오면 → 이 파라미터를 조정한다 (1/2)');

  addStyledTable(slide,
    ['문제 (결과)', '조정 대상', '방향', '이유'],
    [
      ['절단 미관통', '출력 / 속도 / 초점', '출력↑, 속도↓', '플루언스(Fluence) 부족'],
      ['HAZ 넓음', '펄스폭 / 속도', '펄스폭↓, 속도↑', '열확산 시간 줄임'],
      ['버(Burr) 많음', '가스 압력 / 노즐', '가스↑, 노즐 거리 최적화', '용융물 제거 불충분'],
      ['절단면 산화', '가스 종류', 'O₂ → N₂/Ar으로 교체', '산화 억제'],
      ['스폿 예상보다 큼', '광학계 / M²', '보호윈도우 교체, 빔 프로파일러 확인', '오염·열렌즈·정렬 이탈'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.65, 0.65, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 77, TOTAL_SLIDES);
}

// ============================================================
// Slide 78: 역방향 의사결정 가이드 (2/2)
// ============================================================
function slide78_reverse_decision2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이런 결과가 나오면 → 이 파라미터를 조정한다 (2/2)');

  addStyledTable(slide,
    ['문제 (결과)', '조정 대상', '방향', '이유'],
    [
      ['초기 vs 수시간 후 품질 차이', '열렌즈', '예열 루틴 도입, 수냉 확인', '열 평형 미도달'],
      ['고반사 재료 가공 시작 불가', '파장 / 피크파워', '그린(532 nm) 검토, 피크파워↑, 표면 산화 처리', '초기 흡수율 극저'],
      ['용접 기공 과다', '빔 프로파일 / 속도', '링+코어 빔 채택, 속도 조정', '키홀(Keyhole) 불안정'],
      ['열 누적 문제', '반복률', '반복률↓', '펄스간 냉각 시간 확보'],
      ['유지보수 비용 과다', '소스 종류', '파이버(Fiber) 레이저로 전환 검토', '월등한 WPE, 밀봉 구조, 정렬 불필요'],
    ],
    { y: 1.85, w: 12.13, rowH: [0.5, 0.65, 0.7, 0.65, 0.65, 0.65] }
  );

  addPageNumber(slide, 78, TOTAL_SLIDES);
}

// ============================================================
// Slide 79: 엔드투엔드 의사결정 흐름도 (1/2)
// ============================================================
function slide79_e2e_flow1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '새 가공 과제를 받았을 때의 체계적 접근 흐름 (1/2)');

  // 세 단계 플로우
  const bW = 11.0, bH = 0.95, startX = 1.0;

  addFlowBox(slide, startX, 1.85, bW, bH,
    '1. 가공 요구사항 정의\n재료 + 두께 + 표면 품질 + 처리 속도 + 비용 목표',
    COLORS.accent_blue, COLORS.text_on_dark);
  addFlowArrow(slide, startX + bW / 2, 1.85 + bH, startX + bW / 2, 1.85 + bH + 0.35);

  addFlowBox(slide, startX, 1.85 + bH + 0.35, bW, bH,
    '2. 레이저 소스 선택\n파장 → 흡수율 매칭 / CW vs 펄스 선택 / 출력 산정 / TCO 비교',
    COLORS.accent_cyan, COLORS.bg_dark);
  addFlowArrow(slide, startX + bW / 2, 1.85 + (bH + 0.35) * 2, startX + bW / 2, 1.85 + (bH + 0.35) * 2 + 0.35);

  addFlowBox(slide, startX, 1.85 + (bH + 0.35) * 2, bW, bH,
    '3. 광학계 설계\n초점거리 선택 / 스폿 크기 목표 / DOF 확인 / 빔 프로파일(Ring vs Gaussian) 결정',
    COLORS.accent_yellow, COLORS.bg_dark);

  // 계속 안내
  slide.addText('→ 계속: Slide 80 (하드웨어 구성~시험 가공)', {
    x: 1.0, y: 6.8, w: 11.0, h: 0.35,
    fontSize: 13, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_tertiary, align: 'right'
  });

  addPageNumber(slide, 79, TOTAL_SLIDES);
}

// ============================================================
// Slide 80: 엔드투엔드 의사결정 흐름도 (2/2)
// ============================================================
function slide80_e2e_flow2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '하드웨어 구성에서 시험 가공까지 (2/2)');

  const bW = 11.0, bH = 0.9, startX = 1.0;

  addFlowBox(slide, startX, 1.85, bW, bH,
    '4. 하드웨어 구성\n모션 시스템(갠트리/갈바노/로봇) / 어시스트 가스 & 노즐 / 냉각 / 안전 인터록',
    COLORS.accent_blue, COLORS.text_on_dark);
  addFlowArrow(slide, startX + bW / 2, 1.85 + bH, startX + bW / 2, 1.85 + bH + 0.3);

  addFlowBox(slide, startX, 1.85 + bH + 0.3, bW, bH,
    '5. 초기 파라미터 설정\n출력 70~90% / 속도 / 초점 위치 / 가스 압력 / PSO 활성화',
    COLORS.accent_purple, COLORS.text_on_dark);
  addFlowArrow(slide, startX + bW / 2, 1.85 + (bH + 0.3) * 2, startX + bW / 2, 1.85 + (bH + 0.3) * 2 + 0.3);

  addFlowBox(slide, startX, 1.85 + (bH + 0.3) * 2, bW, bH,
    '6. 시험 가공 + 검증\n절단면/비드 검사 / HAZ·버·드로스 측정 / 파라미터 최적화 반복',
    COLORS.accent_cyan, COLORS.bg_dark);
  addFlowArrow(slide, startX + bW / 2, 1.85 + (bH + 0.3) * 3, startX + bW / 2, 1.85 + (bH + 0.3) * 3 + 0.28);

  // 피드백 루프 박스
  slide.addShape('roundRect', {
    x: startX, y: 1.85 + (bH + 0.3) * 3 + 0.28, w: bW, h: 0.55,
    rectRadius: 0.07, fill: { color: COLORS.bg_secondary },
    line: { color: COLORS.accent_red, width: 1 }
  });
  slide.addText('▲ 피드백 루프: 문제 발생 시 → 트러블슈팅 참조 (Slide 74~78) → 파라미터 재조정', {
    x: startX + 0.2, y: 1.85 + (bH + 0.3) * 3 + 0.3, w: bW - 0.4, h: 0.4,
    fontSize: 12, fontFace: FONTS.body.fontFace,
    color: COLORS.accent_red, valign: 'middle'
  });

  // 하단 명언
  slide.addText('"소스 선택은 공구 선택이 아니라 공정 설계다"', {
    x: 1.0, y: 7.05, w: 11.0, h: 0.3,
    fontSize: 12, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_tertiary, align: 'center'
  });

  addPageNumber(slide, 80, TOTAL_SLIDES);
}

// ============================================================
// Slide 81: 예상 밖 핵심 발견 (1/2)
// ============================================================
function slide81_findings1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '리서치에서 발견된 5가지 비직관적 사실 (1/3)');

  const cW = 3.8, cH = 3.8, topY = 1.85;

  addCard(slide, {
    x: 0.4, y: topY, w: cW, h: cH,
    title: '① 후판(>25 mm)에서 CO₂가 아직 살아있다',
    body: '파이버 레이저의 짧은 파장(~1 μm)은 두꺼운 금속에서 키홀(Keyhole)이 불안정해진다.\n\nCO₂(10.6 μm)는 오히려 후판 절단에서 더 안정적인 키홀을 형성하여 경쟁력이 유지된다.',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 4.77, y: topY, w: cW, h: cH,
    title: '② BPP는 광학계로 줄일 수 없다',
    body: 'BPP = 빔 허리 반경 × 발산각. 이는 광학 불변량(Optical Invariant)이다.\n\n렌즈·미러로 초점을 바꿔도 BPP는 변하지 않는다.\n→ BPP는 소스 선택 단계에서 결정된다.',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 9.13, y: topY, w: cW, h: cH,
    title: '③ 보호 윈도우 오염이 열렌즈를 증폭한다',
    body: '보호 윈도우에 이물질이 붙으면 투과율↓ + 흡수↑ → 렌즈 자체가 뜨거워져 열렌즈 발생.\n\n→ 초점 위치 드리프트 → 가공 품질 점진적 저하.\n정기 교체가 핵심 예방책.',
    accentColor: COLORS.accent_yellow
  });

  addPageNumber(slide, 81, TOTAL_SLIDES);
}

// ============================================================
// Slide 82: 예상 밖 핵심 발견 (2/2)
// ============================================================
function slide82_findings2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '리서치에서 발견된 5가지 비직관적 사실 (2/3 → 4·5)');

  const cW = 5.8, cH = 4.0, topY = 1.85;

  addCard(slide, {
    x: 0.5, y: topY, w: cW, h: cH,
    title: '④ EDM과 fs 레이저는 같은 원리다',
    body: '[이질 도메인: EDM (방전가공)]\n\n두 공정 모두 "에너지 입력 시간 < 열확산 시간"이라는 동일 원리로 정밀도를 확보한다.\n\nEDM: μs~ns 방전 펄스로 열영향 최소화\nfs 레이저: <10⁻¹³ 초 펄스로 쿨롱 폭발\n\n→ EDM에서 축적된 펄스 최적화 노하우를 레이저 도메인에 직접 차용할 수 있다.',
    accentColor: COLORS.accent_purple
  });

  addCard(slide, {
    x: 7.0, y: topY, w: cW, h: cH,
    title: '⑤ 다이오드 효율 >50%의 함정',
    body: '다이오드 레이저 칩 수준 전기-광 변환 효율은 50% 이상 가능.\n\n그러나 시스템 수준(전원·냉각·빔 정형 포함)에서는 40~50%로 낮아진다.\n\n더 큰 문제: M² 5~30의 낮은 빔 품질.\n→ 실제 가공에 집중할 수 있는 유효 출력이 크게 줄어든다.\n\n"효율 숫자만 보고 소스를 선택하면 안 된다."',
    accentColor: COLORS.accent_red
  });

  addPageNumber(slide, 82, TOTAL_SLIDES);
}

// ============================================================
// Slide 83: 후속 학습 주제
// ============================================================
function slide83_next_topics() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이번 교육에서 다루지 않았지만 다음에 학습해야 할 주제');

  const topics = [
    {
      num: '1',
      title: '파라미터 결정 트리',
      desc: '새 재료·두께에 대해 시행착오 없이 초기 파라미터를 설정하는 체계적 방법론. 재료별 임계 플루언스(Threshold Fluence) 데이터베이스와 연계하면 효과적.'
    },
    {
      num: '2',
      title: '인라인 프로세스 모니터링',
      desc: '실시간 플라즈마 발광(OES), 음향 방출(AE), OCT(광간섭단층촬영) 모니터링 + 피드백 제어. 품질의 실시간 확인과 가공 중 파라미터 자동 조정 가능.'
    },
    {
      num: '3',
      title: 'TMI (모드 불안정성) 임계값',
      desc: '고출력 파이버 레이저에서 갑작스럽게 나타나는 빔 품질 불안정. 소스 선택 시 흔히 간과되는 숨은 변수. 출력 예비율 설계에 직결.'
    }
  ];

  topics.forEach(function(item, i) {
    const y = 1.85 + i * 1.6;
    slide.addShape('ellipse', {
      x: 0.55, y: y + 0.05, w: 0.55, h: 0.55,
      fill: { color: [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow][i] }
    });
    slide.addText(item.num, {
      x: 0.55, y: y + 0.05, w: 0.55, h: 0.55,
      fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle'
    });
    slide.addText(item.title, {
      x: 1.35, y: y, w: 11.28, h: 0.5,
      fontSize: 19, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 1.35, y: y + 0.52, w: 11.28, h: 0.95,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.4, valign: 'top'
    });
  });

  addPageNumber(slide, 83, TOTAL_SLIDES);
}

// ============================================================
// Slide 84: 교육 요약 — 핵심 메시지 6가지
// ============================================================
function slide84_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6개 파트의 핵심을 한 문장씩');

  const items = [
    { num: '01', part: '물리 (Physics)', msg: '유도방출 + 반전분포 + 공진기 = 레이저의 3대 조건', color: COLORS.accent_blue },
    { num: '02', part: '소스 (Source)', msg: '파장-재료 매칭이 소스 선택의 출발점', color: COLORS.accent_cyan },
    { num: '03', part: '광학 (Optics)', msg: 'BPP는 불변, 스폿↓ ↔ DOF↓ 트레이드오프', color: COLORS.accent_yellow },
    { num: '04', part: '하드웨어 (Hardware)', msg: 'PSO와 냉각수 관리가 가공 안정성의 핵심', color: COLORS.accent_purple },
    { num: '05', part: '상호작용 (Interaction)', msg: '강도 단계 이해가 공정 설계의 기초', color: COLORS.accent_red },
    { num: '06', part: '실무 (Practice)', msg: '트러블슈팅은 역방향 — 결과에서 원인으로', color: COLORS.accent_blue },
  ];

  items.forEach(function(item, i) {
    const y = 1.8 + i * 0.84;
    slide.addShape('roundRect', {
      x: 0.5, y, w: 12.33, h: 0.72, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });
    slide.addShape('rect', { x: 0.5, y, w: 0.08, h: 0.72, fill: { color: item.color } });
    slide.addText(item.num, {
      x: 0.75, y, w: 0.55, h: 0.72,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: item.color, align: 'center', valign: 'middle'
    });
    slide.addText(item.part, {
      x: 1.4, y, w: 2.6, h: 0.72,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle'
    });
    slide.addText(item.msg, {
      x: 4.1, y, w: 8.73, h: 0.72,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle'
    });
  });

  addPageNumber(slide, 84, TOTAL_SLIDES);
}

// ============================================================
// Slide 85: Closing
// ============================================================
function slide85_closing() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });

  // 상단 accent 라인
  slide.addShape('rect', { x: 1.5, y: 2.15, w: 2.0, h: 0.07, fill: { color: COLORS.accent_cyan } });

  // 메인 제목
  slide.addText('레이저 기초 완전 가이드', {
    x: 1.5, y: 2.35, w: 10.33, h: 1.1,
    fontSize: 44, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center', charSpacing: -0.5
  });

  // 부제목
  slide.addText('절삭가공 엔지니어를 위한 레이저 소스 · 광학계 · 하드웨어 교육자료', {
    x: 1.5, y: 3.55, w: 10.33, h: 0.6,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: 'FFFFFF', transparency: 25, align: 'center'
  });

  // 구분선
  slide.addShape('rect', { x: 3.5, y: 4.4, w: 6.33, h: 0.02, fill: { color: COLORS.accent_cyan } });

  // 하단 정보
  slide.addText('문의: 레이저 가공 엔지니어링  |  2026-03-24', {
    x: 1.5, y: 4.65, w: 10.33, h: 0.5,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: 'FFFFFF', transparency: 40, align: 'center'
  });

  // 슬라이드 수 표시
  slide.addText(`총 ${TOTAL_SLIDES}장`, {
    x: 1.5, y: 5.2, w: 10.33, h: 0.4,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: 'FFFFFF', transparency: 55, align: 'center'
  });

  addPageNumber(slide, 85, TOTAL_SLIDES);
}


// ============================================================
// === 실행부 ===
// ============================================================

// Part A (slides 1-30)
slide01_title(); slide02_purpose(); slide03_confusion1(); slide04_confusion2();
slide05_mapping1(); slide06_mapping2(); slide07_overview();
slide08_section1(); slide09_laser_definition(); slide10_stimulated_emission();
slide11_emission_diagram(); slide12_population_inversion(); slide13_energy_levels();
slide14_resonator(); slide15_gain_medium(); slide16_coherence();
slide17_polarization(); slide18_polarization_fiber();
slide19_section2(); slide20_sources_table1(); slide21_sources_table2();
slide22_co2(); slide23_fiber(); slide24_fiber_limits();
slide25_disk(); slide26_ndyag_diode(); slide27_ultrashort_principle();
slide28_ultrashort_compare(); slide29_source_selection(); slide30_tco();

// Part B (slides 31-60)
slide31_source_flowchart(); slide32_part2_summary();
slide33_section3(); slide34_beam_metrics(); slide35_gaussian();
slide36_waist_rayleigh(); slide37_bpp(); slide38_formulas();
slide39_beam_profiles(); slide40_optical_components(); slide41_lens_material();
slide42_collimator_expander(); slide43_window_isolator(); slide44_beam_delivery();
slide45_processing_head(); slide46_focal_length(); slide47_why_expand();
slide48_beam_shaping(); slide49_galvo_ftheta(); slide50_thermal_lensing();
slide51_maintenance(); slide52_part3_summary();
slide53_section4(); slide54_system_diagram(); slide55_motion();
slide56_pso(); slide57_control(); slide58_cooling();
slide59_assist_gas(); slide60_fume_safety();

// Part C (slides 61-85)
slide61_section5(); slide62_absorption_diagram(); slide63_absorption1();
slide64_absorption2(); slide65_intensity_stages(); slide66_cutting();
slide67_welding(); slide68_weld_defects(); slide69_other_processes();
slide70_ultrashort_cold(); slide71_spec_sheet1(); slide72_spec_sheet2();
slide73_section6(); slide74_troubleshoot1(); slide75_troubleshoot2();
slide76_troubleshoot_system(); slide77_reverse_decision1(); slide78_reverse_decision2();
slide79_e2e_flow1(); slide80_e2e_flow2(); slide81_findings1();
slide82_findings2(); slide83_next_topics(); slide84_summary();
slide85_closing();

// 저장
const path = require('path');
const outPath = path.join(__dirname, 'laser-fundamentals-guide.pptx');
pptx.writeFile({ fileName: outPath })
  .then(() => console.log('저장 완료:', outPath))
  .catch(err => console.error('저장 실패:', err));
