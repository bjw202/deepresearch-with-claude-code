// === Part 2 시작 ===

function slide25_section3_divider() {
  const slide = pptx.addSlide();
  // 좌 40% 다크
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 7.4, h: 7.5, fill: { color: COLORS.bg_primary } });
  // 섹션 번호
  slide.addText('SECTION 3', {
    x: 0.4, y: 2.2, w: 4.5, h: 0.5,
    fontSize: 11, bold: true, color: COLORS.accent_cyan,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  // 섹션 제목
  slide.addText('반도체 에칭', {
    x: 0.4, y: 2.8, w: 4.5, h: 0.7,
    fontSize: 28, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  // 부제
  slide.addText('왜 건식으로 바뀌었나', {
    x: 0.4, y: 3.55, w: 4.5, h: 0.5,
    fontSize: 16, bold: false, color: COLORS.text_secondary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  // 구분선
  slide.addShape('rect', { x: 0.4, y: 4.2, w: 2.5, h: 0.03, fill: { color: COLORS.accent_cyan } });
  // 우측 커버리지
  slide.addText('이 섹션에서 배울 것', {
    x: 6.0, y: 2.0, w: 5.8, h: 0.45,
    fontSize: 13, bold: true, color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  const items = [
    '습식 에칭의 한계와 건식 전환 이유',
    '플라즈마의 개념과 에칭에서의 두 역할',
    '반응성 이온 에칭(RIE) 원리와 파라미터',
    '보쉬 프로세스(DRIE)로 깊이 파는 기술',
    '유도결합 플라즈마(ICP)와 원자층 에칭(ALE)',
    '소재별 에칭 가스 선택 원칙',
    '3D NAND 극한 에칭의 도전',
  ];
  items.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 6.0, y: 2.55 + i * 0.42, w: 6.0, h: 0.38,
      fontSize: 12, color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace, align: 'left'
    });
  });
}

function slide26_semiconductor_flow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '반도체 공정에서 에칭은 수십 번 반복된다', 'FEOL → BEOL 공정 흐름 속 에칭의 위치');

  // 비유 텍스트
  slide.addText('포토리소그래피가 "그림을 그리는" 단계라면, 에칭은 "실제로 깎는" 단계다.', {
    x: 0.6, y: 1.85, w: 12.13, h: 0.38,
    fontSize: 12, color: COLORS.accent_cyan, italic: true,
    fontFace: FONTS.body.fontFace, align: 'left'
  });

  // FEOL 박스
  slide.addShape('rect', { x: 0.6, y: 2.35, w: 5.5, h: 3.8, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('FEOL — 트랜지스터 형성', {
    x: 0.7, y: 2.42, w: 5.3, h: 0.38,
    fontSize: 12, bold: true, color: COLORS.accent_blue,
    fontFace: FONTS.body.fontFace, align: 'center'
  });
  const feolSteps = [
    { label: '① 포토리소그래피', sub: '노광 → 현상 → 마스크 완성', color: COLORS.bg_dark },
    { label: '② 에칭 ★', sub: 'Si / SiO₂ / Si₃N₄ 패터닝', color: COLORS.accent_red },
    { label: '③ 이온 주입', sub: '도핑 (Doping)', color: COLORS.bg_dark },
    { label: '④ 박막 증착', sub: 'CVD / PVD', color: COLORS.bg_dark },
  ];
  feolSteps.forEach((s, i) => {
    slide.addShape('rect', { x: 0.8, y: 2.9 + i * 0.67, w: 5.1, h: 0.55, fill: { color: s.color }, line: { color: COLORS.text_tertiary, width: 0.5 } });
    slide.addText(s.label, { x: 0.85, y: 2.92 + i * 0.67, w: 5.0, h: 0.28, fontSize: 11, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace });
    slide.addText(s.sub, { x: 0.85, y: 3.18 + i * 0.67, w: 5.0, h: 0.22, fontSize: 9, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 화살표
  slide.addShape('rect', { x: 6.2, y: 4.1, w: 0.4, h: 0.03, fill: { color: COLORS.accent_yellow } });
  slide.addText('→', { x: 6.15, y: 3.95, w: 0.6, h: 0.4, fontSize: 20, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // BEOL 박스
  slide.addShape('rect', { x: 6.83, y: 2.35, w: 5.5, h: 3.8, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_purple, width: 1.5 } });
  slide.addText('BEOL — 배선 연결', {
    x: 6.93, y: 2.42, w: 5.3, h: 0.38,
    fontSize: 12, bold: true, color: COLORS.accent_purple,
    fontFace: FONTS.body.fontFace, align: 'center'
  });
  const beolSteps = [
    { label: '⑤ 층간 절연막 형성', sub: 'Low-k 유전체 증착', color: COLORS.bg_dark },
    { label: '⑥ 에칭 ★', sub: '비아(Via) / 트렌치 형성 — Cu 배선', color: COLORS.accent_red },
    { label: '⑦ 금속 증착 + 충전', sub: 'Cu 전기도금', color: COLORS.bg_dark },
    { label: '⑧ CMP 평탄화', sub: '화학기계적 연마', color: COLORS.bg_dark },
  ];
  beolSteps.forEach((s, i) => {
    slide.addShape('rect', { x: 7.03, y: 2.9 + i * 0.67, w: 5.1, h: 0.55, fill: { color: s.color }, line: { color: COLORS.text_tertiary, width: 0.5 } });
    slide.addText(s.label, { x: 7.08, y: 2.92 + i * 0.67, w: 5.0, h: 0.28, fontSize: 11, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace });
    slide.addText(s.sub, { x: 7.08, y: 3.18 + i * 0.67, w: 5.0, h: 0.22, fontSize: 9, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 하단 노트
  slide.addShape('rect', { x: 0.6, y: 6.25, w: 12.13, h: 0.55, fill: { color: COLORS.bg_secondary } });
  slide.addText('★ 에칭은 FEOL·BEOL 모두에 필수. 공정 전체에서 수십 회 반복 — 웨이퍼 한 장이 완성되기까지 에칭만 30~50번 이상 진행된다.', {
    x: 0.7, y: 6.3, w: 12.0, h: 0.45,
    fontSize: 10.5, color: COLORS.accent_yellow, bold: true,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  addPageNumber(slide, 26, TOTAL_SLIDES);
}

function slide27_wet_vs_dry_limit() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '습식 에칭의 한계: 3nm 선폭에서 옆으로 파이면 끝이다', '언더컷(Undercut) vs 수직 측벽');

  // 좌 컬럼 — 습식 에칭
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 4.9, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addText('습식 에칭 (Wet Etching)', {
    x: 0.7, y: 1.92, w: 5.6, h: 0.38,
    fontSize: 13, bold: true, color: COLORS.accent_red,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  // 단면도 — 등방성 언더컷
  slide.addShape('rect', { x: 1.5, y: 2.42, w: 1.2, h: 0.3, fill: { color: COLORS.text_tertiary } }); // 마스크 좌
  slide.addShape('rect', { x: 3.7, y: 2.42, w: 1.2, h: 0.3, fill: { color: COLORS.text_tertiary } }); // 마스크 우
  // 에칭된 재료 (밥그릇 모양 시뮬레이션 — 직사각형 + 라운드로 암시)
  slide.addShape('rect', { x: 1.4, y: 2.72, w: 3.6, h: 1.2, fill: { color: COLORS.accent_blue } });
  // 언더컷 표시 — 마스크 아래 공간
  slide.addShape('rect', { x: 1.5, y: 2.72, w: 0.4, h: 0.5, fill: { color: COLORS.bg_secondary } }); // 좌 언더컷
  slide.addShape('rect', { x: 4.5, y: 2.72, w: 0.4, h: 0.5, fill: { color: COLORS.bg_secondary } }); // 우 언더컷
  slide.addText('← 언더컷', { x: 1.0, y: 2.78, w: 1.3, h: 0.3, fontSize: 9, color: COLORS.accent_red, fontFace: FONTS.body.fontFace, bold: true });
  slide.addText('언더컷 →', { x: 4.5, y: 2.78, w: 1.3, h: 0.3, fontSize: 9, color: COLORS.accent_red, fontFace: FONTS.body.fontFace, bold: true, align: 'right' });
  slide.addText('밥그릇 단면 (등방성 에칭)', { x: 1.0, y: 4.0, w: 4.5, h: 0.3, fontSize: 9.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });

  // 습식 특성
  const wetPoints = [
    '모든 방향으로 균등히 녹음 (등방성)',
    '마스크 아래까지 침식 → 언더컷',
    '선폭 ~수μm 이하에서 패턴 붕괴',
    '3nm 노드? → 원천적으로 불가',
    '환경 규제 / 폐액 처리 부담',
  ];
  wetPoints.forEach((p, i) => {
    slide.addText('✗ ' + p, {
      x: 0.75, y: 4.45 + i * 0.42, w: 5.5, h: 0.38,
      fontSize: 11, color: COLORS.accent_red,
      fontFace: FONTS.body.fontFace
    });
  });

  // 우 컬럼 — 건식 에칭
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 4.9, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  slide.addText('건식 에칭 (Dry Etching)', {
    x: 6.965, y: 1.92, w: 5.6, h: 0.38,
    fontSize: 13, bold: true, color: COLORS.accent_cyan,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  // 단면도 — 수직 측벽
  slide.addShape('rect', { x: 7.8, y: 2.42, w: 1.2, h: 0.3, fill: { color: COLORS.text_tertiary } }); // 마스크 좌
  slide.addShape('rect', { x: 10.0, y: 2.42, w: 1.2, h: 0.3, fill: { color: COLORS.text_tertiary } }); // 마스크 우
  // 수직 홈
  slide.addShape('rect', { x: 7.8, y: 2.72, w: 1.2, h: 1.2, fill: { color: COLORS.accent_blue } }); // 좌 벽
  slide.addShape('rect', { x: 10.0, y: 2.72, w: 1.2, h: 1.2, fill: { color: COLORS.accent_blue } }); // 우 벽
  slide.addShape('rect', { x: 9.0, y: 3.62, w: 1.0, h: 0.32, fill: { color: COLORS.accent_blue } }); // 바닥
  // 수직 화살표
  slide.addText('↓ 수직', { x: 9.05, y: 2.75, w: 0.9, h: 0.8, fontSize: 14, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('90° 수직 측벽', { x: 7.3, y: 4.0, w: 4.5, h: 0.3, fontSize: 9.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });

  // 건식 특성
  const dryPoints = [
    '이온이 수직으로 쏟아짐 (이방성)',
    '측벽 침식 없음 → 수직 프로파일',
    '3~5nm 선폭 패터닝 가능',
    '진공 건식 공정 → 오염 최소',
    '가스/파워로 정밀 제어 가능',
  ];
  dryPoints.forEach((p, i) => {
    slide.addText('✓ ' + p, {
      x: 7.0, y: 4.45 + i * 0.42, w: 5.5, h: 0.38,
      fontSize: 11, color: COLORS.accent_cyan,
      fontFace: FONTS.body.fontFace
    });
  });

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

function slide28_plasma_basics() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '플라즈마는 이온과 전자가 뒤섞인 전기적 기체다', '물질의 4번째 상태 — 에칭에서 두 역할');

  // 4가지 상태 다이어그램
  const states = [
    { label: '고체', sub: '분자 결합\n단단히 고정', color: COLORS.accent_blue, x: 0.6 },
    { label: '액체', sub: '결합 느슨\n유동 가능', color: COLORS.accent_cyan, x: 3.5 },
    { label: '기체', sub: '분자 자유 이동\n결합 없음', color: COLORS.accent_yellow, x: 6.4 },
    { label: '플라즈마', sub: '전자 분리\n이온+전자 혼재', color: COLORS.accent_red, x: 9.3 },
  ];
  states.forEach((s, i) => {
    slide.addShape('rect', { x: s.x, y: 1.85, w: 2.6, h: 1.5, fill: { color: s.color }, line: { color: COLORS.bg_dark, width: 0.5 } });
    slide.addText(s.label, { x: s.x, y: 1.92, w: 2.6, h: 0.45, fontSize: 16, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
    slide.addText(s.sub, { x: s.x, y: 2.4, w: 2.6, h: 0.8, fontSize: 9.5, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
    if (i < 3) {
      slide.addText('→', { x: s.x + 2.62, y: 2.2, w: 0.6, h: 0.5, fontSize: 18, bold: true, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center' });
    }
  });
  slide.addText('열 또는 에너지 증가', { x: 0.6, y: 3.45, w: 12.13, h: 0.3, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });

  // 일상 예시
  slide.addShape('rect', { x: 0.6, y: 3.85, w: 12.13, h: 0.03, fill: { color: COLORS.text_tertiary } });
  slide.addText('일상 속 플라즈마', { x: 0.6, y: 3.95, w: 12.13, h: 0.35, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  const examples = ['번개 — 자연 방전 플라즈마', '네온사인 — 유리관 안 플라즈마', '형광등 — 수은 증기 이온화', '태양 — 거대 플라즈마 덩어리'];
  examples.forEach((e, i) => {
    slide.addText('• ' + e, { x: 0.8 + i * 3.1, y: 4.35, w: 2.9, h: 0.35, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 에칭에서 두 역할
  slide.addShape('rect', { x: 0.6, y: 4.85, w: 12.13, h: 0.03, fill: { color: COLORS.text_tertiary } });
  slide.addText('에칭에서 플라즈마의 두 역할', { x: 0.6, y: 4.95, w: 12.13, h: 0.35, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });

  // 역할 1: 화학적
  slide.addShape('rect', { x: 0.6, y: 5.38, w: 5.9, h: 1.45, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1 } });
  slide.addText('역할 1: 화학적 에칭', { x: 0.7, y: 5.45, w: 5.7, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_blue, fontFace: FONTS.body.fontFace });
  slide.addText('반응성 라디칼(F·, Cl·)이 재료와 반응\nSi + 4F· → SiF₄(기체) → 펌프로 배출\n→ 화학 반응으로 재료 제거', { x: 0.7, y: 5.85, w: 5.7, h: 0.9, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  // 역할 2: 물리적
  slide.addShape('rect', { x: 6.83, y: 5.38, w: 5.9, h: 1.45, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1 } });
  slide.addText('역할 2: 물리적 스퍼터링', { x: 6.93, y: 5.45, w: 5.7, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });
  slide.addText('이온이 전기장에 가속 → 수직으로 충돌\n운동에너지로 표면 원자를 직접 타격\n→ 이방성(수직 에칭) 확보', { x: 6.93, y: 5.85, w: 5.7, h: 0.9, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

function slide29_rie_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '반응성 이온 에칭(RIE): 이온이 수직으로 떨어져 아래만 깎는다', 'RIE 챔버 개념도 — RF 전원이 수직 이온 충돌을 만드는 원리');

  // 챔버 외곽
  slide.addShape('rect', { x: 1.2, y: 1.85, w: 5.6, h: 5.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_secondary, width: 1.5 } });
  slide.addText('RIE 챔버 (진공 + 에칭 가스)', { x: 1.25, y: 1.9, w: 5.5, h: 0.35, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });

  // 가스 주입
  slide.addShape('rect', { x: 1.5, y: 2.35, w: 1.5, h: 0.4, fill: { color: COLORS.accent_blue } });
  slide.addText('에칭 가스 주입\nSF₆ / Cl₂ / HBr', { x: 1.5, y: 2.35, w: 1.5, h: 0.4, fontSize: 8, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 플라즈마 영역
  slide.addShape('rect', { x: 1.5, y: 2.9, w: 5.0, h: 1.1, fill: { color: COLORS.accent_purple } });
  slide.addText('플라즈마 영역\n이온⁺ + 라디칼 + 전자⁻', { x: 1.5, y: 2.9, w: 5.0, h: 1.1, fontSize: 10.5, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 이온 가속 화살표들
  const arrowXs = [2.0, 2.6, 3.2, 3.8, 4.4, 5.0, 5.6];
  arrowXs.forEach(x => {
    slide.addShape('rect', { x: x, y: 4.05, w: 0.04, h: 0.55, fill: { color: COLORS.accent_yellow } });
    slide.addText('↓', { x: x - 0.1, y: 4.55, w: 0.25, h: 0.25, fontSize: 10, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  });
  slide.addText('이온 가속 영역 (Sheath) — 음극 바이어스로 수직 가속', { x: 1.35, y: 4.05, w: 5.5, h: 0.35, fontSize: 9, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // 웨이퍼
  slide.addShape('rect', { x: 1.5, y: 4.9, w: 5.0, h: 0.45, fill: { color: COLORS.accent_cyan } });
  slide.addText('웨이퍼 (RF 전극 위 — 음극 바이어스 형성)', { x: 1.5, y: 4.9, w: 5.0, h: 0.45, fontSize: 10, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 배기
  slide.addShape('rect', { x: 3.5, y: 5.45, w: 1.5, h: 0.35, fill: { color: COLORS.text_tertiary } });
  slide.addText('진공 펌프 (부산물 배출)', { x: 3.2, y: 5.45, w: 2.0, h: 0.35, fontSize: 8.5, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // RF 전원 표시
  slide.addShape('rect', { x: 6.4, y: 4.75, w: 1.4, h: 0.55, fill: { color: COLORS.accent_red } });
  slide.addText('RF 전원\n13.56 MHz', { x: 6.4, y: 4.75, w: 1.4, h: 0.55, fontSize: 9, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addShape('rect', { x: 6.5, y: 5.0, w: 0.6, h: 0.03, fill: { color: COLORS.accent_red } });

  // 우측 설명
  slide.addText('핵심 원리', { x: 7.9, y: 1.92, w: 4.7, h: 0.38, fontSize: 13, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  const principles = [
    ['① 가스 주입', 'SF₆, Cl₂ 등 반응성 가스 → 챔버 내부'],
    ['② 플라즈마 생성', 'RF 에너지로 가스 이온화 → 이온+라디칼'],
    ['③ 음극 바이어스', 'RF가 웨이퍼 쪽에 음(-) 전압 형성'],
    ['④ 수직 가속', '양이온(+)이 음극에 끌려 수직으로 충돌'],
    ['⑤ 이방성 에칭', '수직 방향만 깎임 → 측벽 보존'],
  ];
  principles.forEach(([title, body], i) => {
    slide.addText(title, { x: 7.9, y: 2.45 + i * 0.78, w: 4.7, h: 0.3, fontSize: 11, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
    slide.addText(body, { x: 7.9, y: 2.75 + i * 0.78, w: 4.7, h: 0.35, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

function slide30_rie_parameters() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'RIE 공정 파라미터: 5가지 조절 노브', '각 파라미터가 에칭 결과에 미치는 영향');

  addTitledTable(slide, '', ['파라미터', '일반 범위', '높이면', '낮추면', '주요 용도'],
    [
      ['RF 파워', '50–1,000 W', '에칭 속도↑, 이온 손상↑, 플라즈마 밀도↑', '속도↓, 손상↓, 선택비↑', '에칭 속도와 손상 균형 조절'],
      ['챔버 압력', '10–500 mTorr', '등방성↑, 충돌↑, 언더컷 가능성↑', '이방성↑, 이온 직진성↑', '수직 측벽이 필요하면 저압'],
      ['가스 종류', '재료별 선택', 'F 함량↑ → 화학적 에칭 증가', 'Ar 증가 → 물리적 스퍼터 증가', 'Si=SF₆, SiO₂=C₄F₈, Al=Cl₂'],
      ['가스 유량', '10–200 sccm', '반응 물질 공급↑ → 균일성↑', '가스 부족 → 에칭 속도 한계', '균일성 및 부산물 배출 제어'],
      ['기판 온도', '-100 ~ +200°C', '반응 속도↑, 패시베이션 약화', '측벽 보호막 강화, 이방성↑', '저온: 보쉬 프로세스 측벽 보호'],
    ],
    { x: 0.6, y: 1.9, colW: [1.6, 1.5, 2.7, 2.7, 3.0] }
  );

  // 하단 요약
  slide.addShape('rect', { x: 0.6, y: 6.15, w: 12.13, h: 0.65, fill: { color: COLORS.bg_secondary } });
  slide.addText('핵심 트레이드오프: RF 파워↑ → 속도 빠르지만 이온 손상↑ | 압력↓ → 이방성↑ 하지만 속도↓\n가스 배합으로 화학적/물리적 비율을 조절하는 것이 RIE 엔지니어링의 핵심이다.', {
    x: 0.7, y: 6.18, w: 12.0, h: 0.6,
    fontSize: 10.5, color: COLORS.accent_yellow,
    fontFace: FONTS.body.fontFace
  });

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

function slide31_bosch_process() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '보쉬 프로세스: 에칭-보호 반복으로 깊이 판다', 'DRIE(깊은 반응성 이온 에칭) — SF₆ ↔ C₄F₈ 사이클');

  // 왼쪽: 사이클 다이어그램
  // 1단계 박스
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.5, h: 2.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addText('1단계: 에칭 (SF₆ 주입)', { x: 0.7, y: 1.97, w: 5.3, h: 0.38, fontSize: 12, bold: true, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });
  slide.addText('SF₆ → F· 라디칼 생성\nSi + 4F· → SiF₄(기체) 방출\n방향: 등방성 (위아래 + 옆으로 깎임)', { x: 0.7, y: 2.4, w: 5.3, h: 1.3, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  // 순환 화살표
  slide.addText('⟲ 수백~수천 회 반복', { x: 1.0, y: 4.0, w: 5.0, h: 0.38, fontSize: 12, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // 2단계 박스
  slide.addShape('rect', { x: 0.6, y: 4.45, w: 5.5, h: 2.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('2단계: 패시베이션 (C₄F₈ 주입)', { x: 0.7, y: 4.52, w: 5.3, h: 0.38, fontSize: 12, bold: true, color: COLORS.accent_blue, fontFace: FONTS.body.fontFace });
  slide.addText('C₄F₈ → 불소 폴리머 막 코팅\n테플론(Teflon)-like 보호막 형성\n측벽 + 바닥 모두 코팅됨', { x: 0.7, y: 4.95, w: 5.3, h: 1.3, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  // 오른쪽: 단면 진행 시각화
  slide.addText('사이클 진행에 따른 단면 변화', { x: 6.5, y: 1.9, w: 6.0, h: 0.38, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace, align: 'center' });

  const cycleLabels = ['초기', '1사이클', '3사이클', '10사이클'];
  const depths = [0, 0.4, 0.9, 1.5];
  cycleLabels.forEach((label, i) => {
    const bx = 6.5 + i * 1.55;
    // 마스크
    slide.addShape('rect', { x: bx, y: 2.38, w: 0.5, h: 0.2, fill: { color: COLORS.text_tertiary } });
    slide.addShape('rect', { x: bx + 0.9, y: 2.38, w: 0.5, h: 0.2, fill: { color: COLORS.text_tertiary } });
    // 실리콘 재료
    slide.addShape('rect', { x: bx, y: 2.58, w: 1.4, h: 1.7, fill: { color: COLORS.accent_blue } });
    // 에칭된 홈
    if (depths[i] > 0) {
      slide.addShape('rect', { x: bx + 0.45, y: 2.58, w: 0.5, h: depths[i], fill: { color: COLORS.bg_secondary } });
    }
    slide.addText(label, { x: bx, y: 4.35, w: 1.4, h: 0.3, fontSize: 9.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center' });
  });

  // 스캘럽 설명
  slide.addShape('rect', { x: 6.5, y: 4.75, w: 6.0, h: 1.55, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('스캘럽(Scallop) 현상', { x: 6.6, y: 4.82, w: 5.8, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  slide.addText('에칭 사이클마다 측벽에 작은 물결 무늬(scallop)가 남는다.\n• 사이클 짧게 → 스캘럽 감소, 하지만 속도↓\n• DRIE 달성: 종횡비 100:1, 깊이 수백 μm 가능', { x: 6.6, y: 5.2, w: 5.8, h: 1.0, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  addPageNumber(slide, 31, TOTAL_SLIDES);
}

function slide32_icp_etching() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유도결합 플라즈마(ICP): 플라즈마 밀도와 이온 에너지를 분리 제어한다', 'RIE 한계 → ICP 해결책');

  // RIE 한계
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.7, h: 2.35, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addText('RIE의 한계', { x: 0.7, y: 1.97, w: 5.5, h: 0.38, fontSize: 13, bold: true, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });
  slide.addText('하나의 RF 전원으로 두 가지를 동시에 제어:', { x: 0.7, y: 2.42, w: 5.5, h: 0.32, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  slide.addText('• 플라즈마 밀도 (에칭 속도 결정)\n• 이온 에너지 (표면 손상 결정)', { x: 0.7, y: 2.78, w: 5.5, h: 0.65, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  slide.addShape('rect', { x: 0.7, y: 3.5, w: 5.5, h: 0.55, fill: { color: COLORS.accent_red } });
  slide.addText('문제: RF 올리면 속도↑지만 손상도↑ — 동시 개선 불가', { x: 0.7, y: 3.5, w: 5.5, h: 0.55, fontSize: 10.5, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 화살표
  slide.addText('→ 해결', { x: 6.35, y: 2.85, w: 1.0, h: 0.5, fontSize: 14, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // ICP 해결책
  slide.addShape('rect', { x: 7.43, y: 1.9, w: 5.3, h: 2.35, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  slide.addText('ICP의 해결책: 2개 RF 분리', { x: 7.53, y: 1.97, w: 5.1, h: 0.38, fontSize: 13, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
  slide.addShape('rect', { x: 7.53, y: 2.42, w: 5.1, h: 0.6, fill: { color: COLORS.accent_blue } });
  slide.addText('코일(위) RF → 플라즈마 밀도 독립 제어', { x: 7.53, y: 2.42, w: 5.1, h: 0.6, fontSize: 10.5, color: COLORS.text_on_dark, bold: true, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addShape('rect', { x: 7.53, y: 3.1, w: 5.1, h: 0.6, fill: { color: COLORS.accent_purple } });
  slide.addText('하부 RF → 이온 에너지(바이어스) 독립 제어', { x: 7.53, y: 3.1, w: 5.1, h: 0.6, fontSize: 10.5, color: COLORS.text_on_dark, bold: true, fontFace: FONTS.body.fontFace, align: 'center' });

  // 결과 비교표
  addTitledTable(slide, 'RIE vs ICP 비교', ['항목', 'RIE', 'ICP'],
    [
      ['플라즈마 밀도', '10⁹–10¹⁰ cm⁻³', '10¹¹–10¹² cm⁻³ (100배 이상)'],
      ['이온 에너지 제어', '밀도와 연동됨', '독립 제어 가능'],
      ['에칭 속도', '중간', '빠름'],
      ['기판 손상', '상대적으로 높음', '낮음 (저에너지 이온)'],
      ['대표 응용', '일반 반도체 패터닝', 'MEMS, 3D NAND, FinFET'],
    ],
    { x: 0.6, y: 4.45, colW: [2.8, 3.5, 5.83] }
  );

  addPageNumber(slide, 32, TOTAL_SLIDES);
}

function slide33_ale() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '원자층 에칭(ALE): 원자 한 층씩 깎는 궁극의 정밀도', 'ALD의 반대 개념 — 2단계 자기제한 사이클');

  // ALD vs ALE 비교 헤더
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.7, h: 0.5, fill: { color: COLORS.text_tertiary } });
  slide.addText('ALD (원자층 증착) — 한 층씩 쌓기', { x: 0.6, y: 1.9, w: 5.7, h: 0.5, fontSize: 12, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addShape('rect', { x: 6.63, y: 1.9, w: 6.1, h: 0.5, fill: { color: COLORS.accent_cyan } });
  slide.addText('ALE (원자층 에칭) — 한 층씩 제거', { x: 6.63, y: 1.9, w: 6.1, h: 0.5, fontSize: 12, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // ALE 2단계 사이클
  slide.addText('ALE 사이클 (2단계 반복)', { x: 0.6, y: 2.55, w: 12.13, h: 0.38, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });

  // 1단계: 표면 개질
  slide.addShape('rect', { x: 0.6, y: 3.05, w: 5.7, h: 2.2, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('1단계: 표면 개질 (Surface Modification)', { x: 0.7, y: 3.12, w: 5.5, h: 0.38, fontSize: 11.5, bold: true, color: COLORS.accent_blue, fontFace: FONTS.body.fontFace });
  slide.addText('Cl₂ 등 반응 가스 흡착\n→ 최표면 원자층만 반응 (화학 결합 변경)\n→ 자기제한(Self-limiting): 더 깊이 침투 안 함\n→ 가스 퍼지로 잔여 가스 제거', { x: 0.7, y: 3.58, w: 5.5, h: 1.55, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  // 사이클 화살표
  slide.addText('→', { x: 6.35, y: 4.0, w: 0.6, h: 0.5, fontSize: 20, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // 2단계: 제거
  slide.addShape('rect', { x: 7.03, y: 3.05, w: 5.7, h: 2.2, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addText('2단계: 제거 (Removal)', { x: 7.13, y: 3.12, w: 5.5, h: 0.38, fontSize: 11.5, bold: true, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });
  slide.addText('이온 또는 중성 빔 조사\n→ 개질된 층만 휘발 (아래층은 건드리지 않음)\n→ 1사이클 = ~0.1 nm 제거 (원자 1층)\n→ 가스 퍼지 후 1단계로 반복', { x: 7.13, y: 3.58, w: 5.5, h: 1.55, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  // 하단 의의
  slide.addShape('rect', { x: 0.6, y: 5.38, w: 12.13, h: 1.42, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('왜 ALE가 필수인가', { x: 0.7, y: 5.45, w: 12.0, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  slide.addText('3nm 이하 반도체에서는 원자 1~2층의 두께 오차가 소자 전기 특성에 치명적이다. RIE로는 이 수준의 제어가 불가능하다.\n→ ALE는 현재 EUV 리소그래피와 함께 첨단 노드(3nm, 2nm)의 핵심 기술로 자리잡았다. 삼성 3nm GAA, TSMC N2 공정에 적용 중.', { x: 0.7, y: 5.83, w: 12.0, h: 0.9, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  addPageNumber(slide, 33, TOTAL_SLIDES);
}

function slide34_etching_gas_by_material() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '소재마다 에칭 가스가 다르다', '반응하면 기체로 날아가는 화합물을 만드는 가스를 선택한다');

  // 2x3 카드 레이아웃
  const cards = [
    {
      title: '실리콘 (Si)',
      color: COLORS.accent_blue,
      gas: 'SF₆ / Cl₂ / HBr',
      body: '• SF₆: F 라디칼 → SiF₄ (빠름, 등방성)\n• Cl₂: SiCl₄ → 이방성 우수\n• HBr: 측벽 보호막 형성 → 고선택비\n용도: DRAM 셀, FinFET 게이트'
    },
    {
      title: '산화막 (SiO₂)',
      color: COLORS.accent_cyan,
      gas: 'C₄F₈ / CHF₃ / CF₄',
      body: '• 불소화탄소계 가스 사용\n• CFₓ 라디칼 → Si-O 결합 파괴\n• C/F 비율로 선택비 조절\n용도: 트렌치, 층간 절연막, 게이트 산화막'
    },
    {
      title: '질화막 (Si₃N₄)',
      color: COLORS.accent_purple,
      gas: 'CHF₃ + O₂ / CF₄ + O₂',
      body: '• SiO₂와 선택적 에칭 가능\n• 습식: 인산(H₃PO₄) 160°C — 선택비 10:1\n• 건식: CHF₃ 비율 조정\n용도: CMP 스톱층, 에칭 마스크'
    },
    {
      title: '알루미늄 (Al)',
      color: COLORS.accent_yellow,
      gas: 'Cl₂ + BCl₃',
      body: '• AlCl₃(휘발성)으로 변환 후 제거\n• 주의: 에칭 후 수분에 즉시 부식\n• 포토레지스트 즉시 제거 필수\n용도: BEOL 배선 (Al 세대)'
    },
    {
      title: '구리 (Cu) — 다마신',
      color: COLORS.accent_red,
      gas: '직접 에칭 ✗ → 주변 유전체 에칭',
      body: '• CuClₓ 부산물이 상온에서 비휘발성\n• 해결: 다마신 공정 — 트렌치 먼저 파고\n  Cu 채운 뒤 CMP로 평탄화\n용도: 현대 BEOL 배선 표준'
    },
    {
      title: '텅스텐 (W)',
      color: COLORS.text_tertiary,
      gas: 'SF₆ + Ar / NF₃',
      body: '• WF₆(휘발성)으로 변환 후 제거\n• Ar은 물리적 스퍼터 보조 역할\n용도: 비아 플러그, 게이트 전극\n특징: 고내열성 금속 에칭에 유리'
    },
  ];

  const cols = [0.6, 4.743, 8.886];
  const rows = [1.85, 4.3];
  cards.forEach((card, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = cols[col];
    const y = rows[row];
    slide.addShape('rect', { x, y, w: 3.843, h: 2.25, fill: { color: COLORS.bg_secondary }, line: { color: card.color, width: 1.5 } });
    slide.addShape('rect', { x, y, w: 3.843, h: 0.42, fill: { color: card.color } });
    slide.addText(card.title, { x, y, w: 3.843, h: 0.28, fontSize: 11, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
    slide.addText(card.gas, { x, y: y + 0.28, w: 3.843, h: 0.18, fontSize: 8.5, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center', italic: true });
    slide.addText(card.body, { x: x + 0.08, y: y + 0.47, w: 3.7, h: 1.74, fontSize: 9.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 34, TOTAL_SLIDES);
}

function slide35_3d_nand_etching() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3D NAND는 종횡비 100:1의 극한 에칭이다', '머리카락 굵기 홀을 6m 깊이로 파는 비율 — ARDE와 극저온 대응');

  // 핵심 수치
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 12.13, h: 0.68, fill: { color: COLORS.accent_red } });
  slide.addText('직경 ~100nm 홀 × 깊이 6μm+ = 종횡비 60:1~100:1   |   머리카락(70μm) 굵기 홀을 6m 깊이로 파는 것과 같은 비율', {
    x: 0.7, y: 1.93, w: 12.0, h: 0.62,
    fontSize: 11.5, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  // 구조 설명
  slide.addShape('rect', { x: 0.6, y: 2.72, w: 5.5, h: 3.7, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1 } });
  slide.addText('3D NAND 구조', { x: 0.7, y: 2.79, w: 5.3, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_blue, fontFace: FONTS.body.fontFace });
  // 층 시각화
  const layerColors = [COLORS.accent_blue, COLORS.text_tertiary, COLORS.accent_blue, COLORS.text_tertiary, COLORS.accent_blue, COLORS.text_tertiary, COLORS.accent_blue, COLORS.text_tertiary];
  layerColors.forEach((c, i) => {
    slide.addShape('rect', { x: 0.85, y: 3.2 + i * 0.27, w: 3.0, h: 0.22, fill: { color: c } });
  });
  slide.addText('산화막/질화막 교대 적층\n(ONON 스택)', { x: 3.9, y: 3.5, w: 2.1, h: 0.7, fontSize: 9.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  // 홀
  slide.addShape('rect', { x: 1.8, y: 3.2, w: 0.3, h: 2.16, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 2.4, y: 3.2, w: 0.3, h: 2.16, fill: { color: COLORS.bg_secondary } });
  slide.addText('←홀→\n직경 ~100nm', { x: 0.9, y: 5.42, w: 1.5, h: 0.55, fontSize: 8.5, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('300mm 웨이퍼 1장 = 약 100조(10¹⁴)개 홀', { x: 0.7, y: 6.18, w: 5.3, h: 0.18, fontSize: 9, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, italic: true });

  // ARDE 문제 + 해결책
  slide.addShape('rect', { x: 6.4, y: 2.72, w: 6.33, h: 3.7, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1 } });
  slide.addText('핵심 도전 과제', { x: 6.5, y: 2.79, w: 6.13, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });

  const challenges = [
    ['ARDE (종횡비 의존 에칭)', '홀이 깊어질수록 에칭이 느려짐\n가스·이온 공급 감소 → 홀마다 깊이 편차\n→ 불량 메모리 셀 발생'],
    ['극저온 에칭 대응', '-100°C 이하 에칭\n측벽 보호막 형성 강화 → 수직 프로파일\n에칭 속도 2.5배 향상 효과'],
    ['펄스 플라즈마', '이온과 라디칼 비율을 시간에 따라 조절\nARDE 억제, 균일 깊이 확보'],
  ];
  challenges.forEach(([title, body], i) => {
    slide.addText(title, { x: 6.5, y: 3.25 + i * 1.05, w: 6.13, h: 0.32, fontSize: 11, bold: true, color: i === 0 ? COLORS.accent_red : COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
    slide.addText(body, { x: 6.5, y: 3.57 + i * 1.05, w: 6.13, h: 0.65, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 35, TOTAL_SLIDES);
}

function slide36_section3_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '섹션 3 핵심 요약', '건식 에칭 — 나노 세계를 가능하게 한 기술');

  const summaryItems = [
    { icon: '①', title: '건식 에칭 = 이방성 확보', body: '습식 에칭의 "옆으로도 깎이는" 한계를 극복. 이온이 수직으로 충돌하여 수직 측벽 실현 → 나노미터 패터닝 가능.', color: COLORS.accent_blue },
    { icon: '②', title: 'RIE → ICP → ALE 진화', body: 'RIE(이방성 기본 확보) → ICP(밀도·에너지 분리 제어, 고속+저손상) → ALE(원자층 단위 0.1nm 제어). 점점 더 정밀해지는 방향.', color: COLORS.accent_cyan },
    { icon: '③', title: '보쉬 프로세스 = 깊이 파는 핵심', body: 'SF₆ 에칭 + C₄F₈ 패시베이션 반복. 종횡비 100:1 이상의 깊은 홀/트렌치 실현. MEMS, 3D NAND의 핵심.', color: COLORS.accent_purple },
    { icon: '④', title: '소재별 가스 선택이 핵심', body: 'Si=SF₆/HBr, SiO₂=C₄F₈, Al=Cl₂+BCl₃, Cu=다마신 우회. "반응하면 기체로 날아가는 화합물" 만드는 가스를 선택한다.', color: COLORS.accent_yellow },
  ];

  summaryItems.forEach((item, i) => {
    const x = i % 2 === 0 ? 0.6 : 6.815;
    const y = i < 2 ? 1.85 : 4.35;
    slide.addShape('rect', { x, y, w: 5.915, h: 2.2, fill: { color: COLORS.bg_secondary }, line: { color: item.color, width: 1.5 } });
    slide.addShape('rect', { x, y, w: 0.5, h: 2.2, fill: { color: item.color } });
    slide.addText(item.icon, { x, y: y + 0.7, w: 0.5, h: 0.6, fontSize: 16, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
    slide.addText(item.title, { x: x + 0.55, y: y + 0.12, w: 5.3, h: 0.4, fontSize: 12, bold: true, color: item.color, fontFace: FONTS.body.fontFace });
    slide.addText(item.body, { x: x + 0.55, y: y + 0.57, w: 5.3, h: 1.55, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 전환 문구
  slide.addShape('rect', { x: 0.6, y: 6.62, w: 12.13, h: 0.6, fill: { color: COLORS.accent_blue } });
  slide.addText('다음: RIE에서 이온 충돌이 핵심이었다. 이 물리적 메커니즘을 극대화하면? → 섹션 4: 물리적 에칭', {
    x: 0.7, y: 6.66, w: 12.0, h: 0.52,
    fontSize: 11.5, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  addPageNumber(slide, 36, TOTAL_SLIDES);
}


function slide37_section4_divider() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 5.33, y: 0, w: 7.4, h: 7.5, fill: { color: COLORS.bg_primary } });
  slide.addText('SECTION 4', {
    x: 0.4, y: 2.2, w: 4.5, h: 0.5,
    fontSize: 11, bold: true, color: COLORS.accent_yellow,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  slide.addText('물리적 에칭', {
    x: 0.4, y: 2.8, w: 4.5, h: 0.7,
    fontSize: 28, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  slide.addText('입자와 빛으로 깎는다', {
    x: 0.4, y: 3.55, w: 4.5, h: 0.5,
    fontSize: 16, bold: false, color: COLORS.text_secondary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  slide.addShape('rect', { x: 0.4, y: 4.2, w: 2.5, h: 0.03, fill: { color: COLORS.accent_yellow } });
  slide.addText('이 섹션에서 배울 것', {
    x: 6.0, y: 2.0, w: 5.8, h: 0.45,
    fontSize: 13, bold: true, color: COLORS.text_primary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });
  const items = [
    '화학적 vs 물리적 에칭의 근본 차이',
    '스퍼터 에칭: Ar 이온으로 어떤 재료든',
    '집속이온빔(FIB): 갈륨 이온 바늘 조각',
    '레이저 에칭: 펄스 길이가 품질을 결정',
    '나노초 / 피코초 / 펨토초 비교',
    'CO₂ / 파이버 / 엑시머 / 펨토초 레이저',
    '펨토초의 유리 내부 가공과 LIPSS',
    '샌드블라스팅 vs 전기화학 가공(ECM)',
  ];
  items.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 6.0, y: 2.55 + i * 0.42, w: 6.0, h: 0.38,
      fontSize: 12, color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace, align: 'left'
    });
  });
}

function slide38_chem_vs_physical() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '화학적 vs 물리적: 녹이냐 두드리냐', '제거 원리의 근본적 차이 — 5가지 비교');

  // 좌: 화학적
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 4.95, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 0.5, fill: { color: COLORS.accent_blue } });
  slide.addText('화학적 에칭', { x: 0.6, y: 1.85, w: 5.865, h: 0.5, fontSize: 14, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('식초가 달걀껍데기를 서서히 녹이듯\n화학물질이 재료와 반응하여 용해', {
    x: 0.7, y: 2.43, w: 5.6, h: 0.65, fontSize: 10.5, italic: true, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center'
  });
  const chemItems = [
    ['제거 원리', '화학 반응 (용해·분해)'],
    ['방향성', '등방성 — 모든 방향으로 파임'],
    ['소재 선택성', '재료별 반응성 차이 활용'],
    ['처리 환경', '액체 화학약품 (습식)'],
    ['처리 규모', '대량 일괄 처리에 유리'],
  ];
  chemItems.forEach(([k, v], i) => {
    slide.addShape('rect', { x: 0.7, y: 3.2 + i * 0.6, w: 5.6, h: 0.03, fill: { color: COLORS.text_tertiary } });
    slide.addText(k + ':', { x: 0.7, y: 3.25 + i * 0.6, w: 1.5, h: 0.38, fontSize: 11, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
    slide.addText(v, { x: 2.2, y: 3.25 + i * 0.6, w: 4.1, h: 0.38, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 우: 물리적
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 4.95, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 0.5, fill: { color: COLORS.accent_red } });
  slide.addText('물리적 에칭', { x: 6.865, y: 1.85, w: 5.865, h: 0.5, fontSize: 14, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('샌드블라스터로 돌에 모래를 쏘듯\n운동에너지로 표면 원자를 때려 냄', {
    x: 6.965, y: 2.43, w: 5.6, h: 0.65, fontSize: 10.5, italic: true, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center'
  });
  const physItems = [
    ['제거 원리', '입자 충돌 (운동에너지)'],
    ['방향성', '이방성 — 입자 방향으로만'],
    ['소재 선택성', '비교적 재료 무관 가공'],
    ['처리 환경', '건식 (진공 또는 가스)'],
    ['처리 규모', '정밀 패터닝에 강점'],
  ];
  physItems.forEach(([k, v], i) => {
    slide.addShape('rect', { x: 6.965, y: 3.2 + i * 0.6, w: 5.6, h: 0.03, fill: { color: COLORS.text_tertiary } });
    slide.addText(k + ':', { x: 6.965, y: 3.25 + i * 0.6, w: 1.5, h: 0.38, fontSize: 11, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
    slide.addText(v, { x: 8.465, y: 3.25 + i * 0.6, w: 4.1, h: 0.38, fontSize: 11, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 38, TOTAL_SLIDES);
}

function slide39_sputter_etching() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '스퍼터 에칭: Ar 이온으로 어떤 재료든 깎는다', '당구공 충돌 원리 — 스퍼터링 수율(S)과 응용');

  // 당구공 비유 다이어그램
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.5, h: 3.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('당구공 충돌 비유', { x: 0.7, y: 1.97, w: 5.3, h: 0.32, fontSize: 11, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });
  // 이온 (큰 공)
  slide.addShape('roundRect', { x: 1.3, y: 2.45, w: 0.6, h: 0.6, rectRadius: 0.3, fill: { color: COLORS.accent_red } });
  slide.addText('Ar⁺\n이온', { x: 1.3, y: 2.45, w: 0.6, h: 0.6, fontSize: 7, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  // 화살표
  slide.addShape('rect', { x: 1.95, y: 2.72, w: 0.5, h: 0.03, fill: { color: COLORS.accent_yellow } });
  slide.addText('→', { x: 1.95, y: 2.55, w: 0.5, h: 0.4, fontSize: 14, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  // 표면 원자들
  const atomX = [2.55, 3.05, 3.55, 2.8, 3.3];
  const atomY = [2.45, 2.45, 2.45, 2.95, 2.95];
  atomX.forEach((ax, i) => {
    slide.addShape('roundRect', { x: ax, y: atomY[i], w: 0.45, h: 0.45, rectRadius: 0.22, fill: { color: COLORS.accent_blue } });
  });
  // 튕겨나간 원자
  slide.addShape('roundRect', { x: 2.7, y: 1.95, w: 0.35, h: 0.35, rectRadius: 0.17, fill: { color: COLORS.accent_blue } });
  slide.addText('↑ 튕겨남', { x: 2.5, y: 1.75, w: 0.9, h: 0.2, fontSize: 8, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  slide.addText('빠른 이온(Ar⁺) → 정지 원자(표면) 충돌\n→ 표면 원자가 튕겨나옴 = 스퍼터링', {
    x: 0.7, y: 3.6, w: 5.3, h: 0.7, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center'
  });
  // 왜 Ar인가
  slide.addShape('rect', { x: 0.6, y: 5.0, w: 5.5, h: 1.75, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1 } });
  slide.addText('왜 아르곤(Ar)인가?', { x: 0.7, y: 5.07, w: 5.3, h: 0.32, fontSize: 11, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
  slide.addText('• 화학적으로 불활성 → 표면 재료와 반응 안 함\n• 원자량 40 amu → 충돌 효율 높음\n• 지구 대기 ~1% → 저렴하고 구하기 쉬움', {
    x: 0.7, y: 5.42, w: 5.3, h: 1.2, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace
  });

  // 우측: 스퍼터링 수율 + 장단점
  slide.addText('스퍼터링 수율 (S)', { x: 6.4, y: 1.97, w: 6.0, h: 0.32, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  slide.addText('S = 방출된 표면 원자 수 / 입사 이온 수', { x: 6.4, y: 2.33, w: 6.0, h: 0.3, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, italic: true });

  addTitledTable(slide, '', ['재료', 'S (Ar⁺ 500eV)', '특징'],
    [
      ['실리콘 (Si)', '~0.5', '반도체 표준'],
      ['알루미늄 (Al)', '~1.0', '연한 금속'],
      ['구리 (Cu)', '~2.3', '잘 깎임'],
      ['금 (Au)', '~2.8', '귀금속 중 최고'],
      ['텅스텐 (W)', '~0.6', '고경도 내화금속'],
    ],
    { x: 6.4, y: 2.7, colW: [2.0, 2.0, 2.2] }
  );

  // 장단점
  slide.addShape('rect', { x: 6.4, y: 5.0, w: 6.0, h: 1.75, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.8 } });
  slide.addText('장점: 소재 무관 · 청결한 표면 · 조성 변화 없음', { x: 6.5, y: 5.07, w: 5.8, h: 0.35, fontSize: 10.5, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
  slide.addText('단점: 느린 속도 · 재증착(Redeposition) · 낮은 선택비', { x: 6.5, y: 5.45, w: 5.8, h: 0.35, fontSize: 10.5, color: COLORS.accent_red, fontFace: FONTS.body.fontFace });
  slide.addText('응용: MRAM 자성 소자 · 귀금속(Pt, Ir) 패터닝 · TEM 시편 제작', { x: 6.5, y: 5.85, w: 5.8, h: 0.7, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  addPageNumber(slide, 39, TOTAL_SLIDES);
}

function slide40_fib() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '집속이온빔(FIB): 갈륨 이온 바늘로 나노 조각한다', '붓 vs 바늘 — 5~10nm 분해능의 나노 가공 도구');

  // 비유 다이어그램
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.5, h: 2.5, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_purple, width: 1 } });
  slide.addText('넓은빔 vs FIB', { x: 0.7, y: 1.97, w: 5.3, h: 0.32, fontSize: 11, bold: true, color: COLORS.accent_purple, fontFace: FONTS.body.fontFace, align: 'center' });
  // 넓은빔
  slide.addShape('rect', { x: 0.9, y: 2.38, w: 2.0, h: 1.5, fill: { color: COLORS.accent_blue } });
  slide.addText('넓은빔\n(BIB)\n전면 에칭', { x: 0.9, y: 2.38, w: 2.0, h: 1.5, fontSize: 10, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center', bold: false });
  slide.addText('붓으로 넓게', { x: 0.9, y: 3.95, w: 2.0, h: 0.25, fontSize: 9, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });
  // FIB
  slide.addShape('roundRect', { x: 3.5, y: 2.38, w: 0.4, h: 1.5, rectRadius: 0.08, fill: { color: COLORS.accent_red } });
  slide.addShape('roundRect', { x: 3.6, y: 3.6, w: 0.18, h: 0.28, rectRadius: 0.05, fill: { color: COLORS.accent_yellow } });
  slide.addText('FIB\n나노 조각', { x: 3.2, y: 2.4, w: 1.0, h: 1.0, fontSize: 9, color: COLORS.accent_red, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('바늘 끝으로', { x: 3.1, y: 3.95, w: 1.2, h: 0.25, fontSize: 9, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, align: 'center', italic: true });

  // FIB 작동 원리
  slide.addShape('rect', { x: 0.6, y: 4.48, w: 5.5, h: 2.3, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('갈륨(Ga⁺) 이온 소스 원리', { x: 0.7, y: 4.55, w: 5.3, h: 0.32, fontSize: 11, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  const steps = [
    'Ga 금속을 텅스텐 바늘 끝에 녹여 유지 (융점 29.8°C)',
    '강한 전기장(10⁸ V/m)으로 Ga⁺ 이온 추출',
    '전자기 렌즈로 이온빔 집속 → 빔 지름 5~10 nm',
    'Ga⁺ (가속 5~30 kV) → 표면 충돌 → 국소 스퍼터 에칭',
  ];
  steps.forEach((s, i) => {
    slide.addText((i + 1) + '. ' + s, { x: 0.7, y: 4.93 + i * 0.42, w: 5.3, h: 0.38, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 우측: 응용
  slide.addText('FIB 핵심 응용 분야', { x: 6.4, y: 1.97, w: 6.0, h: 0.32, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  const apps = [
    { title: '회로 수정 (Circuit Edit)', body: '반도체 칩 배선을 직접 끊거나 연결\n→ 설계 검증 · CPU 디버깅 (Intel 활용)', color: COLORS.accent_blue },
    { title: '단면 분석 (Cross-Section)', body: 'SEM-FIB 복합 장비로 소자 단면 절개\n→ 나노미터 정밀도 내부 구조 관찰', color: COLORS.accent_cyan },
    { title: 'TEM 시편 제작', body: '특정 위치의 초박막(~100nm) 라멜라 제작\n→ 투과전자현미경 분석용', color: COLORS.accent_purple },
    { title: '마스크 리페어', body: 'EUV 포토마스크 결함을 nm 단위 수정\n→ 수억짜리 마스크 재생', color: COLORS.accent_yellow },
  ];
  apps.forEach((app, i) => {
    const y = 2.35 + i * 1.12;
    slide.addShape('rect', { x: 6.4, y, w: 6.0, h: 1.05, fill: { color: COLORS.bg_secondary }, line: { color: app.color, width: 1 } });
    slide.addText(app.title, { x: 6.5, y: y + 0.07, w: 5.8, h: 0.3, fontSize: 11, bold: true, color: app.color, fontFace: FONTS.body.fontFace });
    slide.addText(app.body, { x: 6.5, y: y + 0.4, w: 5.8, h: 0.58, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 40, TOTAL_SLIDES);
}

function slide41_laser_pulse_principle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 에칭의 핵심: 펄스 길이가 품질을 결정한다', '나노초(열 주도) vs 펨토초(비열적 냉각 어블레이션)');

  // 나노초 영역
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.7, h: 3.7, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 } });
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.7, h: 0.45, fill: { color: COLORS.accent_red } });
  slide.addText('나노초(ns) 레이저 — 느린 다리미', { x: 0.65, y: 1.9, w: 5.6, h: 0.45, fontSize: 12, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('펄스 시간: 10⁻⁹ s (1 ns = 10억분의 1초)', { x: 0.7, y: 2.43, w: 5.5, h: 0.3, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, italic: true });
  const nsFlow = ['레이저 에너지 흡수', '→ 전자 여기', '→ 격자 진동 (열 발생)', '→ 온도 상승', '→ 용융 · 기화'];
  nsFlow.forEach((step, i) => {
    const c = i === 0 ? COLORS.accent_blue : i === 4 ? COLORS.accent_red : COLORS.bg_dark;
    slide.addShape('rect', { x: 0.7, y: 2.82 + i * 0.42, w: 5.4, h: 0.36, fill: { color: c } });
    slide.addText(step, { x: 0.7, y: 2.82 + i * 0.42, w: 5.4, h: 0.36, fontSize: 10.5, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  });
  slide.addShape('rect', { x: 0.7, y: 5.02, w: 5.4, h: 0.45, fill: { color: COLORS.accent_red } });
  slide.addText('결과: 넓은 열 영향부(HAZ) · 재주조층 · 버(Burr)', { x: 0.7, y: 5.02, w: 5.4, h: 0.45, fontSize: 10.5, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 중앙 vs
  slide.addText('vs', { x: 6.35, y: 3.6, w: 0.6, h: 0.6, fontSize: 22, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // 펨토초 영역
  slide.addShape('rect', { x: 7.03, y: 1.9, w: 5.7, h: 3.7, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  slide.addShape('rect', { x: 7.03, y: 1.9, w: 5.7, h: 0.45, fill: { color: COLORS.accent_cyan } });
  slide.addText('펨토초(fs) 레이저 — 순간 번개', { x: 7.08, y: 1.9, w: 5.6, h: 0.45, fontSize: 12, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('펄스 시간: 10⁻¹⁵ s (1 fs = 1,000조분의 1초)', { x: 7.1, y: 2.43, w: 5.5, h: 0.3, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, italic: true });
  const fsFlow = ['극초단 펄스 → 전자에 에너지 집중', '→ 전자 온도만 수만 K (격자는 차가움)', '→ 열 확산 시간보다 펄스가 짧음', '→ 다광자 흡수 / 쿨롱 폭발', '→ 재료 직접 기화 · 이온화'];
  fsFlow.forEach((step, i) => {
    const c = i === 4 ? COLORS.accent_cyan : COLORS.bg_dark;
    slide.addShape('rect', { x: 7.1, y: 2.82 + i * 0.42, w: 5.4, h: 0.36, fill: { color: c } });
    slide.addText(step, { x: 7.1, y: 2.82 + i * 0.42, w: 5.4, h: 0.36, fontSize: 10.5, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  });
  slide.addShape('rect', { x: 7.1, y: 5.02, w: 5.4, h: 0.45, fill: { color: COLORS.accent_cyan } });
  slide.addText('결과: HAZ 최소 · 재주조층 없음 · 날카로운 경계', { x: 7.1, y: 5.02, w: 5.4, h: 0.45, fontSize: 10.5, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 하단 비유
  slide.addShape('rect', { x: 0.6, y: 5.7, w: 12.13, h: 0.55, fill: { color: COLORS.bg_secondary } });
  slide.addText('비유: 나노초 = 느린 다리미 → 열이 퍼져 주변이 눌림  |  펨토초 = 순간 번개 → 닿는 순간만 작용하고 열이 퍼지기 전에 끝남', {
    x: 0.7, y: 5.74, w: 12.0, h: 0.47, fontSize: 10.5, italic: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center'
  });

  addPageNumber(slide, 41, TOTAL_SLIDES);
}

function slide42_pulse_comparison_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '펄스 길이별 비교: 나노초, 피코초, 펨토초', '시간 범위 / 열적 특성 / 정밀도 / 열 영향부 / 대표 응용');

  addTitledTable(slide, '', ['펄스 구분', '시간 범위', '열적 특성', '정밀도', '열 영향부(HAZ)', '대표 응용'],
    [
      ['나노초 (ns)', '10⁻⁹ s\n(1~수백 ns)', '열 주도\n(용융·기화)', '낮음\n±수십 μm', '큼\n수십~수백 μm', '마킹, 절단\n금속 조각'],
      ['피코초 (ps)', '10⁻¹² s\n(0.1~100 ps)', '부분 열 축적\n열-기계적 어블레이션', '중간\n±수 μm', '중간\n수 μm', '미세 가공\n정밀 절단'],
      ['펨토초 (fs)', '10⁻¹⁵ s\n(10~900 fs)', '비열적 (콜드)\n쿨롱 폭발', '매우 높음\n±수십 nm', '최소\n<1 μm', '나노 패터닝\n유리 내부 가공'],
    ],
    { x: 0.6, y: 1.9, colW: [1.5, 1.6, 2.1, 1.5, 2.0, 2.53] }
  );

  // 보충 설명
  slide.addShape('rect', { x: 0.6, y: 5.1, w: 12.13, h: 1.65, fill: { color: COLORS.bg_secondary } });
  slide.addText('실무 선택 기준', { x: 0.7, y: 5.17, w: 12.0, h: 0.32, fontSize: 12, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  const criteria = [
    ['속도 우선', '나노초 — 빠르고 저렴. 마킹, 조각, 대량 처리에 최적'],
    ['균형', '피코초 — 중간 정밀도. 반도체 마이크로 가공, 정밀 절단'],
    ['정밀도 우선', '펨토초 — HAZ 최소. 의료기기, 나노 패터닝, 유리 내부 가공'],
  ];
  criteria.forEach(([k, v], i) => {
    slide.addText(k + ': ', { x: 0.85, y: 5.53 + i * 0.38, w: 1.5, h: 0.35, fontSize: 10.5, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
    slide.addText(v, { x: 2.35, y: 5.53 + i * 0.38, w: 10.0, h: 0.35, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 42, TOTAL_SLIDES);
}

function slide43_laser_types_cards() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 종류별 특성과 용도', 'CO₂ / 파이버 / 엑시머 / 펨토초 — 용도에 맞는 파장 선택');

  const cards = [
    {
      title: 'CO₂ 레이저',
      sub: '파장 10.6 μm (적외선)',
      color: COLORS.accent_red,
      body: '• 유리, 아크릴, 폴리머에 잘 흡수됨\n• 금속은 반사율 높아 비효율\n• 열적 에칭 → 서리낀 텍스처 마킹\n• 응용: 유리 마킹, 가죽 패터닝, 아크릴 절단\n• 출력: 수십 W ~ 수 kW'
    },
    {
      title: '파이버 레이저',
      sub: '파장 1.064 μm (근적외선)',
      color: COLORS.accent_blue,
      body: '• 금속 흡수율 높음 → 금속 가공 최적\n• 집광 스폿 작음 → 에너지 밀도 높음\n• 수명 25,000시간+, 유지보수 불필요\n• 응용: SUS/Al/Cu 마킹·에칭\n• MOPA 타입: 펄스 폭 4~200 ns 조절'
    },
    {
      title: '엑시머 레이저',
      sub: '파장 193~351 nm (UV)',
      color: COLORS.accent_purple,
      body: '• UV 광자 에너지 높음 → 광분해\n• 분자 결합을 직접 끊음 (화학적 분해)\n• HAZ 거의 없음\n• 응용: 폴리이미드(PI) 가공, 의료 카테터\n  EUV 리소그래피 광원 전 세대'
    },
    {
      title: '펨토초 레이저',
      sub: '파장 800 nm / 1030 nm (Ti:사파이어 / Yb)',
      color: COLORS.accent_cyan,
      body: '• 비열적 콜드 어블레이션\n• HAZ 최소 · 재주조층 없음\n• 유리 내부 가공 가능 (3D)\n• 응용: 나노 패터닝, 스텔스 다이싱\n  LIPSS 생성, 의료기기 정밀 가공'
    },
  ];

  const positions = [
    { x: 0.6, y: 1.85 },
    { x: 6.815, y: 1.85 },
    { x: 0.6, y: 4.55 },
    { x: 6.815, y: 4.55 },
  ];
  cards.forEach((card, i) => {
    const { x, y } = positions[i];
    slide.addShape('rect', { x, y, w: 5.915, h: 2.45, fill: { color: COLORS.bg_secondary }, line: { color: card.color, width: 1.5 } });
    slide.addShape('rect', { x, y, w: 5.915, h: 0.55, fill: { color: card.color } });
    slide.addText(card.title, { x: x + 0.1, y: y + 0.03, w: 5.7, h: 0.3, fontSize: 13, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace });
    slide.addText(card.sub, { x: x + 0.1, y: y + 0.3, w: 5.7, h: 0.22, fontSize: 9, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, italic: true });
    slide.addText(card.body, { x: x + 0.12, y: y + 0.6, w: 5.7, h: 1.78, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 43, TOTAL_SLIDES);
}

function slide44_femtosecond_glass() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '펨토초 레이저는 유리 내부도 가공할 수 있다', '표면 손상 없이 내부 균열/기포 생성 — 스텔스 다이싱');

  // 원리 다이어그램
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.5, h: 3.8, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  slide.addText('유리 내부 가공 원리', { x: 0.7, y: 1.97, w: 5.3, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace, align: 'center' });

  // 레이저 빔 → 유리 내부 초점
  slide.addShape('rect', { x: 2.8, y: 2.42, w: 0.04, h: 0.6, fill: { color: COLORS.accent_red } }); // 빔
  slide.addText('레이저 빔 ↓', { x: 2.0, y: 2.3, w: 1.8, h: 0.25, fontSize: 9, color: COLORS.accent_red, fontFace: FONTS.body.fontFace, align: 'center' });

  // 유리 단면
  slide.addShape('rect', { x: 1.2, y: 3.05, w: 3.6, h: 2.0, fill: { color: COLORS.accent_blue } });
  slide.addText('유리 (SiO₂)', { x: 1.25, y: 3.1, w: 3.5, h: 0.3, fontSize: 10, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });

  // 내부 초점 표시
  slide.addShape('roundRect', { x: 2.55, y: 3.85, w: 0.5, h: 0.5, rectRadius: 0.25, fill: { color: COLORS.accent_yellow } });
  slide.addText('★ 내부 초점\n균열/기포', { x: 1.8, y: 4.42, w: 1.9, h: 0.5, fontSize: 8.5, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace, align: 'center' });

  // 유리 특성 설명
  slide.addShape('rect', { x: 0.6, y: 5.78, w: 5.5, h: 0.9, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.8 } });
  slide.addText('유리 열전도율 ~1 W/m·K (알루미늄의 1/200)\n→ 열이 퍼지지 않고 집중 → 내부 국소 가공 가능', {
    x: 0.7, y: 5.83, w: 5.3, h: 0.8, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace
  });

  // 우측: 응용 사례
  slide.addText('응용 사례', { x: 6.4, y: 1.97, w: 6.0, h: 0.35, fontSize: 13, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });

  const apps = [
    {
      title: '내부 마킹 (Subsurface Engraving)',
      body: '초점을 내부에 맞춰 표면 손상 없이\n미세 균열/기포 어레이 생성\n→ 크리스탈 기념품, 보안 마킹, 의료기기 인식',
      color: COLORS.accent_blue
    },
    {
      title: '스텔스 다이싱 (Stealth Dicing)',
      body: '반도체 웨이퍼 내부에 균열선 생성\n→ 외력으로 깔끔하게 절단\n기존 블레이드 다이싱 대비 파편·오염 감소',
      color: COLORS.accent_purple
    },
    {
      title: '3D 포토닉 구조',
      body: '유리 내부에 3차원 광도파로 패턴\n→ 광통신, AR 광학, 센서 칩 응용\n다른 에칭 방법으로는 구현 불가능한 영역',
      color: COLORS.accent_cyan
    },
  ];
  apps.forEach((app, i) => {
    slide.addShape('rect', { x: 6.4, y: 2.42 + i * 1.42, w: 6.0, h: 1.32, fill: { color: COLORS.bg_secondary }, line: { color: app.color, width: 1 } });
    slide.addText(app.title, { x: 6.5, y: 2.49 + i * 1.42, w: 5.8, h: 0.32, fontSize: 11, bold: true, color: app.color, fontFace: FONTS.body.fontFace });
    slide.addText(app.body, { x: 6.5, y: 2.84 + i * 1.42, w: 5.8, h: 0.82, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 44, TOTAL_SLIDES);
}

function slide45_lipss() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LIPSS: 레이저가 만드는 뜻밖의 나노 구조', '레이저 유도 주기적 표면 구조 — 불량에서 의도적 활용으로');

  // 원리 설명
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 5.7, h: 2.55, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_purple, width: 1.5 } });
  slide.addText('LIPSS 생성 원리', { x: 0.7, y: 1.97, w: 5.5, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_purple, fontFace: FONTS.body.fontFace });
  slide.addText(
    'Laser-Induced Periodic Surface Structures\n\n레이저 빔과 표면에서 형성된 표면 전자기파(surface electromagnetic wave)의\n간섭 → 주기적 세기 패턴 → 재료가 주기적으로 제거 → 나노 줄무늬(ripple)',
    { x: 0.7, y: 2.38, w: 5.5, h: 1.75, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace }
  );
  // 비유 박스
  slide.addShape('rect', { x: 0.6, y: 4.52, w: 5.7, h: 0.85, fill: { color: COLORS.accent_purple } });
  slide.addText(
    '비유: 바닷가에서 파도가 밀려오면 모래사장에 규칙적인 파문이 생기듯\n레이저파와 표면파의 간섭이 규칙적인 나노 패턴을 만든다.',
    { x: 0.7, y: 4.57, w: 5.5, h: 0.75, fontSize: 10, italic: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace }
  );

  // LIPSS 특성
  slide.addShape('rect', { x: 0.6, y: 5.45, w: 5.7, h: 1.25, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.8 } });
  slide.addText('주요 특성', { x: 0.7, y: 5.52, w: 5.5, h: 0.3, fontSize: 11, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  slide.addText('• 주기: 레이저 파장의 0.5~1배 (수백 nm)\n• 형성 조건: 다중 펄스 조사 + 적절한 플루언스(J/cm²)\n• 출처: Springer Applied Physics A, 2025 (Cr/Ag 박막 LIPSS 연구)', {
    x: 0.7, y: 5.85, w: 5.5, h: 0.8, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace
  });

  // 우측: 응용
  slide.addText('LIPSS 응용 분야', { x: 6.5, y: 1.97, w: 6.0, h: 0.35, fontSize: 13, bold: true, color: COLORS.text_primary, fontFace: FONTS.body.fontFace });
  const apps = [
    { icon: '👁', title: '반사방지 구조', body: '나노 주기 구조로 빛 반사 억제\n반사율 95% → 0.1% 수준까지 감소\n→ 태양전지, 광학 렌즈', color: COLORS.accent_yellow },
    { icon: '💧', title: '친수/소수성 제어', body: '표면 에너지를 나노 구조로 조절\n→ 생의료 임플란트 표면 기능화\n세포 부착성 향상', color: COLORS.accent_cyan },
    { icon: '⚙', title: '마찰 제어', body: '윤활 특성 조절 — 자동차 엔진 부품\n피스톤/실린더 표면 처리\n마찰계수 최대 40% 감소', color: COLORS.accent_blue },
    { icon: '🎨', title: '구조색 (착색)', body: '금속 표면에 나노 구조로 구조색 생성\n페인트 없이 색상 구현\n위조 방지 보안 마킹에 활용', color: COLORS.accent_purple },
  ];
  apps.forEach((app, i) => {
    const y = 2.42 + i * 1.18;
    slide.addShape('rect', { x: 6.5, y, w: 6.0, h: 1.1, fill: { color: COLORS.bg_secondary }, line: { color: app.color, width: 1 } });
    slide.addText(app.title, { x: 6.6, y: y + 0.07, w: 5.8, h: 0.3, fontSize: 11, bold: true, color: app.color, fontFace: FONTS.body.fontFace });
    slide.addText(app.body, { x: 6.6, y: y + 0.42, w: 5.8, h: 0.62, fontSize: 10, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  addPageNumber(slide, 45, TOTAL_SLIDES);
}

function slide46_sandblast_ecm() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '샌드블라스팅과 전기화학 가공(ECM)', '저비용 대면적 vs 초정밀 무마모 — 서로 다른 니치');

  // 좌: 샌드블라스팅
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 5.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1.5 } });
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 0.5, fill: { color: COLORS.accent_yellow } });
  slide.addText('샌드블라스팅 (연마 분사)', { x: 0.6, y: 1.85, w: 5.865, h: 0.5, fontSize: 13, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  // 원리
  slide.addText('원리: 압축공기(0.3~0.8 MPa)로 연마 입자를 고속 분사\n→ 표면과 충돌 → 미세 파편 제거', { x: 0.7, y: 2.43, w: 5.6, h: 0.65, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  addTitledTable(slide, '주요 연마재', ['연마재', '경도(Mohs)', '특징'],
    [
      ['모래(SiO₂)', '6.5–7', '저렴, 유리 분진 유해'],
      ['알루미나(Al₂O₃)', '9', '고경도, 재사용 가능'],
      ['글라스 비드', '5.5–6', '구형, 부드러운 피닝'],
      ['탄화규소(SiC)', '9–9.5', '초경도 재료 가공'],
    ],
    { x: 0.7, y: 3.15, colW: [2.0, 1.5, 2.1] }
  );

  const sbProps = ['적용: 유리 무광 텍스처, 금속 앵커 패턴, 도막 제거', '정밀도: 0.5mm 이하 구현 어려움', '장점: 저비용 · 대면적 처리 · 장비 간단', '단점: 분진 관리 필수 · 깊이 제어 어려움'];
  sbProps.forEach((p, i) => {
    slide.addText(p, { x: 0.7, y: 5.32 + i * 0.38, w: 5.6, h: 0.35, fontSize: 10.5, color: i < 2 ? COLORS.text_secondary : i === 2 ? COLORS.accent_cyan : COLORS.accent_red, fontFace: FONTS.body.fontFace });
  });

  // 우: ECM
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 5.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 0.5, fill: { color: COLORS.accent_cyan } });
  slide.addText('전기화학 가공 (ECM)', { x: 6.865, y: 1.85, w: 5.865, h: 0.5, fontSize: 13, bold: true, color: COLORS.bg_dark, fontFace: FONTS.body.fontFace, align: 'center' });
  slide.addText('원리: 공작물(+) / 공구(-) / 전해질 용액\n→ 전기분해로 금속 원자를 이온화하여 제거\nFe → Fe²⁺ + 2e⁻', { x: 6.965, y: 2.43, w: 5.6, h: 0.75, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });

  const ecmFeatures = [
    ['공구 마모 없음', '공구가 직접 접촉 안 함 → 복잡 형상 무한 반복'],
    ['잔류 응력 없음', '절삭력 없음 → 내부 응력 발생 안 함'],
    ['소재 무관', '경도 관계없이 전도성 금속이면 가공 가능'],
    ['한계', '전도성 재료만 가능 · 전해질 폐수 처리 필요'],
  ];
  ecmFeatures.forEach(([k, v], i) => {
    const color = i < 3 ? COLORS.accent_cyan : COLORS.accent_red;
    slide.addText(k + ': ', { x: 6.965, y: 3.28 + i * 0.55, w: 2.0, h: 0.35, fontSize: 11, bold: true, color, fontFace: FONTS.body.fontFace });
    slide.addText(v, { x: 8.965, y: 3.28 + i * 0.55, w: 3.6, h: 0.35, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });
  slide.addText('적용: 항공기 터빈 블레이드 · 의료기기 임플란트 · 금형', { x: 6.965, y: 5.52, w: 5.6, h: 0.35, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace, italic: true });

  addPageNumber(slide, 46, TOTAL_SLIDES);
}

function slide47_femtosecond_haz_caveat() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '펨토초 레이저의 "열 없음"은 조건부다', '고반복률에서 열 축적 발생 — 반복률과 플루언스 동시 관리');

  // 경고 배너
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 12.13, h: 0.65, fill: { color: COLORS.accent_red } });
  slide.addText('⚠ Critic 지적: "펨토초 = HAZ 없음"은 단순화된 표현. 고반복률(>MHz) 조건에서는 열 축적이 발생한다.', {
    x: 0.7, y: 1.95, w: 12.0, h: 0.55,
    fontSize: 11.5, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  // 메커니즘
  slide.addShape('rect', { x: 0.6, y: 2.68, w: 5.7, h: 3.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('열 축적 메커니즘', { x: 0.7, y: 2.75, w: 5.5, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent_yellow, fontFace: FONTS.body.fontFace });
  slide.addText(
    '펨토초 레이저의 단일 펄스는 비열적이다.\n그러나 반복률이 MHz 이상이 되면:\n\n• 다음 펄스가 오기 전에 이전 펄스의 열이 완전히 식지 않음\n• 펄스마다 소량의 열이 축적됨\n• 축적 열 → HAZ 발생 가능\n\n→ "펄스 에너지"와 "반복률"을 동시에 제어해야 한다',
    { x: 0.7, y: 3.18, w: 5.5, h: 2.4, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace }
  );

  // 조건 비교표
  addTitledTable(slide, '반복률별 열 축적 특성', ['반복률', '펄스 간격', '열 축적 위험', '대응책'],
    [
      ['< 100 kHz', '> 10 μs', '낮음 (충분히 식음)', '표준 펨토초 가공'],
      ['100 kHz ~ 1 MHz', '1~10 μs', '중간 (조건 의존)', '플루언스 낮춰 보정'],
      ['> 1 MHz', '< 1 μs', '높음 (주의 필요)', '버스트 모드 또는 저출력'],
    ],
    { x: 6.5, y: 2.68, colW: [1.8, 1.8, 2.0, 2.2] }
  );

  // 실무 가이드라인
  slide.addShape('rect', { x: 0.6, y: 5.78, w: 12.13, h: 1.0, fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1 } });
  slide.addText('실무 가이드라인', { x: 0.7, y: 5.85, w: 12.0, h: 0.3, fontSize: 11, bold: true, color: COLORS.accent_cyan, fontFace: FONTS.body.fontFace });
  slide.addText('열에 민감한 재료(유리, 얇은 박막) + 고반복률 가공 시 → 플루언스(J/cm²) + 반복률을 함께 모니터링. "펨토초 = 무조건 안전"이라는 가정은 피해야 한다.', {
    x: 0.7, y: 6.18, w: 12.0, h: 0.55, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace
  });

  addPageNumber(slide, 47, TOTAL_SLIDES);
}

function slide48_section4_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '섹션 4 핵심 요약', '물리적 에칭 — 재료를 가리지 않는 가공 기술');

  const summaryItems = [
    { icon: '①', title: '재료 무관 가공 가능', body: '화학 반응 없이 운동에너지(이온)나 빛(레이저)으로 어떤 재료든 에칭. 귀금속, 세라믹, 유리 모두 가능. 단, 재증착과 낮은 선택비 주의.', color: COLORS.accent_yellow },
    { icon: '②', title: '레이저는 펄스 길이 선택이 핵심', body: 'ns = 빠르지만 HAZ 있음 / ps = 중간 / fs = HAZ 최소, 유리 내부 가공·LIPSS 등 독특한 응용. 단, 고반복률에서는 열 축적 발생.', color: COLORS.accent_cyan },
    { icon: '③', title: '재증착 / HAZ가 주요 실패 모드', body: '스퍼터 에칭의 재증착(떨어진 원자가 다시 붙음), 나노초 레이저의 HAZ/재주조층이 품질을 떨어뜨리는 주요 원인.', color: COLORS.accent_red },
    { icon: '④', title: 'FIB · ECM은 특수 정밀 공구', body: 'FIB: 마스크 없이 나노 가공, 반도체 디버깅에 필수. ECM: 공구 마모 없음, 잔류 응력 없음 — 항공·의료 부품에 활용.', color: COLORS.accent_blue },
  ];

  summaryItems.forEach((item, i) => {
    const x = i % 2 === 0 ? 0.6 : 6.815;
    const y = i < 2 ? 1.85 : 4.35;
    slide.addShape('rect', { x, y, w: 5.915, h: 2.2, fill: { color: COLORS.bg_secondary }, line: { color: item.color, width: 1.5 } });
    slide.addShape('rect', { x, y, w: 0.5, h: 2.2, fill: { color: item.color } });
    slide.addText(item.icon, { x, y: y + 0.7, w: 0.5, h: 0.6, fontSize: 16, bold: true, color: COLORS.text_on_dark, fontFace: FONTS.body.fontFace, align: 'center' });
    slide.addText(item.title, { x: x + 0.55, y: y + 0.12, w: 5.3, h: 0.4, fontSize: 12, bold: true, color: item.color, fontFace: FONTS.body.fontFace });
    slide.addText(item.body, { x: x + 0.55, y: y + 0.57, w: 5.3, h: 1.55, fontSize: 10.5, color: COLORS.text_secondary, fontFace: FONTS.body.fontFace });
  });

  // 전환 문구
  slide.addShape('rect', { x: 0.6, y: 6.62, w: 12.13, h: 0.6, fill: { color: COLORS.accent_yellow } });
  slide.addText('다음: 화학적 · 반도체 · 물리적 에칭 모두 배웠다. 내 상황에는 어떤 방식을 써야 하는가? → 섹션 5: 비교와 선택', {
    x: 0.7, y: 6.66, w: 12.0, h: 0.52,
    fontSize: 11.5, bold: true, color: COLORS.bg_dark,
    fontFace: FONTS.body.fontFace, align: 'center'
  });

  addPageNumber(slide, 48, TOTAL_SLIDES);
}

// === Part 2 끝 ===
