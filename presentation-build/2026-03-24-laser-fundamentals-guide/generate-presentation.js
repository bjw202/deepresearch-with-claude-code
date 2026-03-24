// ============================================================
// 레이저 기초 완전 가이드 — Part A (슬라이드 1~30)
// 전체 슬라이드: 85장
// ============================================================

const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const TOTAL_SLIDES = 85;

const COLORS = {
  bg_primary: 'FFFFFF', bg_secondary: 'F5F7FA', bg_dark: '1A1F36',
  text_primary: '1A1F36', text_secondary: '4A5568', text_tertiary: '718096',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7', accent_cyan: '00D4AA', accent_yellow: 'FFB020',
  accent_red: 'FF6B6B', accent_purple: '8B5CF6',
};

const FONTS = {
  title: { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body: { fontFace: 'Pretendard', bold: false },
  caption: { fontFace: 'Pretendard Light', bold: false },
  serif: { fontFace: 'ChosunNm', bold: false },
  kpi: { fontFace: 'Pretendard Black', bold: true },
};

const TABLE_STYLE = {
  header: { bold: true, fill: { color: '1A1F36' }, color: 'FFFFFF', fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle' },
  cell: { fontFace: 'Pretendard', fontSize: 11, color: '4A5568', valign: 'middle' },
  cellAlt: { fontFace: 'Pretendard', fontSize: 11, color: '4A5568', fill: { color: 'F5F7FA' }, valign: 'middle' },
  cellRight: { fontFace: 'Pretendard', fontSize: 11, color: '4A5568', align: 'right', valign: 'middle' },
};

const TABLE_OPTIONS = { x: 0.6, y: 1.8, w: 12.13, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' }, autoPage: false, margin: [5, 8, 5, 8] };

const CHART_STYLE = {
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

// ============================================================
// 헬퍼 함수
// ============================================================

function addTitleBar(slide, title, subtitle) {
  slide.addShape('rect', { x: 0.6, y: 0.5, w: 1.2, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText(title, { x: 0.6, y: 0.65, w: 12.13, h: 0.9, fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, charSpacing: -0.3, autoFit: true });
  if (subtitle) { slide.addText(subtitle, { x: 0.6, y: 1.6, w: 12.13, h: 0.3, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary }); }
}

function addStyledTable(slide, headers, dataRows, opts) {
  const rows = [];
  rows.push(headers.map(h => ({ text: h, options: { ...TABLE_STYLE.header } })));
  dataRows.forEach((row, i) => {
    const base = i % 2 === 1 ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    rows.push(row.map(cell => {
      if (typeof cell === 'string') return { text: cell, options: { ...base } };
      return { text: cell.text, options: { ...base, ...cell.options } };
    }));
  });
  slide.addTable(rows, { ...TABLE_OPTIONS, ...opts });
}

function addCard(slide, opts) {
  const { x, y, w, h, title, body, accentColor } = opts;
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: x + 0.02, y, w: w - 0.04, h: 0.06, fill: { color: accentColor || COLORS.accent_blue } });
  slide.addText(title, { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.35, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, autoFit: true });
  slide.addText(body, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.3, valign: 'top', autoFit: true });
}

function addPageNumber(slide, num, total) {
  slide.addText(num + ' / ' + total, { x: 12.0, y: 7.05, w: 1.0, h: 0.3, fontSize: 9, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'right' });
}

// 플로우차트 헬퍼
function addFlowBox(slide, x, y, w, h, text, fill, textColor) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.08, fill: { color: fill || COLORS.accent_blue } });
  slide.addText(text, { x, y, w, h, fontSize: 11, fontFace: 'Pretendard', bold: true, color: textColor || 'FFFFFF', align: 'center', valign: 'middle', autoFit: true });
}

function addFlowArrow(slide, x1, y1, x2, y2) {
  // Use simple rect arrow indicator instead of line shape to avoid OOXML issues
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
    // Horizontal arrow - draw thin rect
    const startX = Math.min(x1, x2);
    const w = Math.abs(x2 - x1);
    slide.addShape('rect', { x: startX, y: midY - 0.02, w: w, h: 0.04, fill: { color: '718096' } });
    // Arrowhead triangle
    if (x2 > x1) {
      slide.addText('\u25B6', { x: x2 - 0.15, y: midY - 0.12, w: 0.3, h: 0.24, fontSize: 10, color: '718096', align: 'center', valign: 'middle' });
    } else {
      slide.addText('\u25C0', { x: x2 - 0.15, y: midY - 0.12, w: 0.3, h: 0.24, fontSize: 10, color: '718096', align: 'center', valign: 'middle' });
    }
  } else {
    // Vertical arrow
    const startY = Math.min(y1, y2);
    const h = Math.abs(y2 - y1);
    slide.addShape('rect', { x: midX - 0.02, y: startY, w: 0.04, h: h, fill: { color: '718096' } });
    if (y2 > y1) {
      slide.addText('\u25BC', { x: midX - 0.15, y: y2 - 0.15, w: 0.3, h: 0.24, fontSize: 10, color: '718096', align: 'center', valign: 'middle' });
    } else {
      slide.addText('\u25B2', { x: midX - 0.15, y: y2 - 0.05, w: 0.3, h: 0.24, fontSize: 10, color: '718096', align: 'center', valign: 'middle' });
    }
  }
}

function addFlowDiamond(slide, x, y, w, h, text) {
  // Use roundRect with yellow fill as decision node (avoiding diamond/rotate issues)
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.05, fill: { color: COLORS.accent_yellow }, line: { color: 'E09800', width: 1 } });
  slide.addText(text, { x, y, w, h, fontSize: 10, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, align: 'center', valign: 'middle', autoFit: true });
}

// ============================================================
// 슬라이드 함수
// ============================================================

// Slide 1: Title (표지 — 페이지 번호 없음)
function slide01_title() {
  const slide = pptx.addSlide();
  // 다크 배경 풀블리드
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 상단 액센트 라인
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: COLORS.accent_blue } });
  // 제목
  slide.addText('레이저 기초 완전 가이드', {
    x: 1.0, y: 2.2, w: 11.33, h: 1.4,
    fontSize: 48, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, charSpacing: -0.5, autoFit: true,
  });
  // 부제
  slide.addText('절삭가공 엔지니어를 위한 레이저 소스 · 광학계 · 하드웨어 교육자료', {
    x: 1.0, y: 3.75, w: 11.33, h: 0.6,
    fontSize: 20, fontFace: 'Pretendard',
    color: COLORS.accent_cyan, lineSpacingMultiple: 1.4,
  });
  // 하단 구분선
  slide.addShape('rect', { x: 1.0, y: 6.2, w: 11.33, h: 0.03, fill: { color: '4A5568' } });
  // 하단 텍스트
  slide.addText('2026-03-24  |  레이저 가공 엔지니어링 교육', {
    x: 1.0, y: 6.35, w: 11.33, h: 0.4,
    fontSize: 13, fontFace: 'Pretendard',
    color: COLORS.text_tertiary,
  });
}

// Slide 2: 이 교육의 목적
function slide02_purpose() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '절삭가공 전문가가 레이저 전문인력과 대등하게 토론한다');

  const bullets = [
    '레이저 소스의 종류와 선택 기준을 이해한다',
    '광학계의 핵심 파라미터와 설계 의사결정 논리를 파악한다',
    '하드웨어 시스템 구성과 레이저-물질 상호작용을 연결한다',
  ];
  bullets.forEach((text, i) => {
    slide.addShape('rect', { x: 0.7, y: 2.2 + i * 0.9, w: 0.06, h: 0.45, fill: { color: COLORS.accent_blue } });
    slide.addText(text, {
      x: 0.9, y: 2.2 + i * 0.9, w: 11.5, h: 0.45,
      fontSize: 18, fontFace: 'Pretendard', color: COLORS.text_primary,
      valign: 'middle',
    });
  });

  // 대상 박스
  slide.addShape('roundRect', { x: 0.6, y: 5.2, w: 12.13, h: 1.4, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText('대상 수강생', {
    x: 0.9, y: 5.35, w: 2.5, h: 0.3,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue,
  });
  slide.addText('절삭가공 배경 엔지니어 — 물리적 직관은 있으나 레이저 전문용어가 약한 상태', {
    x: 0.9, y: 5.7, w: 11.5, h: 0.5,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
  });

  addPageNumber(slide, 2, TOTAL_SLIDES);
}

// Slide 3: 혼란 포인트 1/2
function slide03_confusion1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '절삭가공 엔지니어가 처음 레이저에서 부딪히는 5가지 혼란 (1/2)');

  const cards = [
    {
      x: 0.6, y: 1.9, w: 3.8, h: 2.3,
      title: '① 공구 없이 재료 제거?',
      body: '광자 에너지가 재료에 흡수 → 용융/기화로 제거\n접촉 없이도 에너지 전달이 가능하다',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 4.7, y: 1.9, w: 3.8, h: 2.3,
      title: '② 같은 출력인데 왜 결과가 다른가?',
      body: '파장별 재료 흡수율이 극적으로 다름\n예: 구리는 IR에서 반사율 ~95%, 그린에서 ~40%',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 8.8, y: 1.9, w: 3.9, h: 2.3,
      title: '③ 초점이 왜 이렇게 중요한가?',
      body: 'DOF (심도)가 수십 μm~수 mm로 극도로 얕음\n초점 오차가 스폿 크기를 수 배 이상 변화시킴',
      accentColor: COLORS.accent_yellow,
    },
  ];
  cards.forEach(c => addCard(slide, c));

  addPageNumber(slide, 3, TOTAL_SLIDES);
}

// Slide 4: 혼란 포인트 2/2
function slide04_confusion2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '절삭가공 엔지니어가 처음 레이저에서 부딪히는 5가지 혼란 (2/2)');

  const cards = [
    {
      x: 2.2, y: 1.9, w: 4.0, h: 2.5,
      title: '④ 파라미터가 왜 이렇게 많은가?',
      body: '절삭가공: 이송속도, 회전수, 절삭깊이 등 3~4개\n레이저: 출력, 속도, 반복률, 펄스폭, 스폿, 가스, 초점 등 10개 이상',
      accentColor: COLORS.accent_purple,
    },
    {
      x: 6.9, y: 1.9, w: 4.0, h: 2.5,
      title: '⑤ 빔을 왜 키웠다가 모으는가?',
      body: 'D_beam을 키우면 발산각(빔 분산) 감소\n집속 렌즈 통과 시 더 작은 스폿 달성 가능\n빔 확장기 → 집속 렌즈 조합이 표준 구성',
      accentColor: COLORS.accent_red,
    },
  ];
  cards.forEach(c => addCard(slide, c));

  addPageNumber(slide, 4, TOTAL_SLIDES);
}

// Slide 5: 절삭가공 → 레이저 개념 매핑표 (1/2)
function slide05_mapping1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '익숙한 절삭가공 개념으로 레이저를 이해한다 (1/2)');

  const headers = ['절삭가공', '레이저 대응', '핵심 차이'];
  const rows = [
    ['절삭력', '에너지 밀도 (플루언스, Fluence)', '힘이 아닌 에너지로 재료 제거'],
    ['이송속도', '스캔 속도', '높을수록 단위 면적 에너지 감소'],
    ['절삭깊이', '침투 깊이', '출력/속도/반복 횟수로 제어'],
    ['주축 RPM', '반복률 (Rep Rate)', '에너지 입력 빈도 결정'],
    ['공구 지름', '스폿 크기', '작으면 정밀, 크면 고속 가공에 유리'],
    ['공구 마모', '광학 오염/열화', '빔 품질 저하로 직결'],
    ['절삭유', '어시스트 가스 (Assist Gas)', '용융물 제거 + 산화 제어'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.8 });

  addPageNumber(slide, 5, TOTAL_SLIDES);
}

// Slide 6: 매핑표 (2/2)
function slide06_mapping2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '익숙한 절삭가공 개념으로 레이저를 이해한다 (2/2)');

  const headers = ['절삭가공', '레이저 대응', '핵심 차이'];
  const rows = [
    ['절삭 각도', '입사각 / 편광 방향', '흡수율에 직접 영향'],
    ['스핀들 모터', '레이저 소스', '광자 에너지원'],
    ['공구홀더 + 인서트', '가공 헤드', '렌즈 + 노즐 + 보호 윈도우'],
    ['CNC 축', '모션 시스템', '갈바노 스캐너는 관성 거의 없음'],
    ['칩 컨베이어', '집진기 (Fume Extractor)', '나노입자 분진 처리 필수'],
    ['표면 조도 (Ra)', 'HAZ + 버 + 리캐스트층', '열 손상 추가 고려'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.2 });

  addPageNumber(slide, 6, TOTAL_SLIDES);
}

// Slide 7: 전체 구성 안내
function slide07_overview() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '교육 구성: 6개 파트로 레이저를 체계적으로 이해한다');

  const parts = [
    { num: 'Part 1', title: '레이저 물리 기초', desc: '유도방출, 공진기, 편광', color: COLORS.accent_blue },
    { num: 'Part 2', title: '레이저 소스 가이드', desc: '7종 소스, 선택 기준, 총소유비용(TCO)', color: COLORS.accent_cyan },
    { num: 'Part 3', title: '광학계', desc: '빔 특성, 부품, 전달, 집속', color: COLORS.accent_yellow },
    { num: 'Part 4', title: '하드웨어 / 시스템', desc: '모션, 제어, 냉각, 안전', color: COLORS.accent_purple },
    { num: 'Part 5', title: '레이저-물질 상호작용', desc: '흡수, 가공 공정', color: COLORS.accent_red },
    { num: 'Part 6', title: '실무 가이드', desc: '트러블슈팅, 의사결정', color: '38BDF8' },
  ];

  // 타임라인 수직선
  slide.addShape('rect', { x: 1.55, y: 1.85, w: 0.05, h: 5.0, fill: { color: 'E2E8F0' } });

  parts.forEach((p, i) => {
    const y = 1.85 + i * 0.83;
    // 원형 마커
    slide.addShape('ellipse', { x: 1.28, y: y + 0.08, w: 0.55, h: 0.38, fill: { color: p.color } });
    slide.addText(String(i + 1), { x: 1.28, y: y + 0.08, w: 0.55, h: 0.38, fontSize: 12, fontFace: 'Pretendard', bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    slide.addText(p.num + '  ' + p.title, {
      x: 2.1, y: y, w: 5.5, h: 0.35,
      fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
    });
    slide.addText(p.desc, {
      x: 2.1, y: y + 0.35, w: 10.5, h: 0.3,
      fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_tertiary,
    });
  });

  addPageNumber(slide, 7, TOTAL_SLIDES);
}

// Slide 8: Section Divider — Part 1 (페이지 번호 없음)
function slide08_section1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: COLORS.accent_blue } });
  slide.addText('01', {
    x: 0.8, y: 1.8, w: 2.5, h: 1.4,
    fontSize: 96, fontFace: FONTS.kpi.fontFace, bold: true,
    color: '2D3A5C', align: 'left',
  });
  slide.addText('레이저 물리 기초', {
    x: 0.8, y: 3.3, w: 11.0, h: 1.0,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, charSpacing: -0.3,
  });
  slide.addText('빛이 레이저가 되는 과정을 이해한다', {
    x: 0.8, y: 4.4, w: 11.0, h: 0.5,
    fontSize: 20, fontFace: 'Pretendard',
    color: COLORS.accent_cyan,
  });
}

// Slide 9: LASER란 무엇인가
function slide09_laser_definition() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, 'LASER = 유도방출에 의한 빛의 증폭');

  // 좌측 설명
  slide.addText('Light Amplification by Stimulated Emission of Radiation', {
    x: 0.6, y: 1.85, w: 6.0, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, italic: true,
  });

  const props = ['단색성 (Monochromaticity)', '코히런스 (Coherence)', '지향성 (Directionality)'];
  props.forEach((t, i) => {
    slide.addShape('ellipse', { x: 0.6, y: 2.55 + i * 0.55, w: 0.22, h: 0.22, fill: { color: COLORS.accent_blue } });
    slide.addText(t, {
      x: 0.95, y: 2.52 + i * 0.55, w: 5.5, h: 0.3,
      fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_primary,
    });
  });

  // 비유 박스
  slide.addShape('roundRect', { x: 0.6, y: 4.3, w: 6.0, h: 1.4, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText('비유 (절삭가공 관점)', {
    x: 0.8, y: 4.45, w: 5.6, h: 0.3, fontSize: 12, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue,
  });
  slide.addText('일반 광원 = 샌드블라스팅 (사방 분사)\n레이저 = 수십 μm 초정밀 드릴 (집중 관통)', {
    x: 0.8, y: 4.8, w: 5.6, h: 0.7, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });

  // 우측 비교표
  const headers = ['특성', '일반 광원', '레이저'];
  const rows = [
    ['파장', '넓은 범위 (가시광 전체)', '거의 단일 파장'],
    ['위상', '무작위', '일치 (코히런스)'],
    ['방향', '전방향 확산', '거의 퍼지지 않음'],
  ];
  addStyledTable(slide, headers, rows, { x: 7.0, y: 1.85, w: 5.7, h: 2.5 });

  addPageNumber(slide, 9, TOTAL_SLIDES);
}

// Slide 10: 유도방출 vs 자연방출
function slide10_stimulated_emission() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '유도방출: 1개 광자가 들어가면 동일한 2개가 나온다');

  // 좌측: 자연방출
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 5.8, h: 4.5, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addText('자연방출 (Spontaneous Emission)', {
    x: 0.8, y: 2.0, w: 5.2, h: 0.45, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    '• 들뜬 원자가 랜덤 타이밍/방향으로 광자 방출\n• 방향, 위상, 파장이 모두 무작위\n• 증폭 없음 → 레이저 불가',
    { x: 0.8, y: 2.55, w: 5.2, h: 1.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' }
  );
  slide.addShape('roundRect', { x: 0.8, y: 4.3, w: 5.2, h: 0.8, rectRadius: 0.08, fill: { color: 'FFF7ED' } });
  slide.addText('비유: 무작위로 떨어지는 빗방울', {
    x: 0.9, y: 4.45, w: 5.0, h: 0.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.accent_yellow, bold: true,
  });

  // 우측: 유도방출
  slide.addShape('roundRect', { x: 6.9, y: 1.85, w: 5.9, h: 4.5, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText('유도방출 (Stimulated Emission)', {
    x: 7.2, y: 2.0, w: 5.4, h: 0.45, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue,
  });
  slide.addText(
    '• 입사 광자가 들뜬 원자에서 동일 광자를 유도\n• 같은 파장, 같은 위상, 같은 방향\n• 1 → 2 → 4 → 8 ... 지수적 증폭',
    { x: 7.2, y: 2.55, w: 5.4, h: 1.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' }
  );
  slide.addShape('roundRect', { x: 7.2, y: 4.3, w: 5.4, h: 0.8, rectRadius: 0.08, fill: { color: 'EEF2FF' } });
  slide.addText('비유: 도미노처럼 정렬된 연쇄 반응', {
    x: 7.3, y: 4.45, w: 5.2, h: 0.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.accent_blue, bold: true,
  });

  addPageNumber(slide, 10, TOTAL_SLIDES);
}

// Slide 11: 유도방출 프로세스 다이어그램
function slide11_emission_diagram() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '유도방출은 레이저 증폭의 핵심 메커니즘이다');

  const boxW = 1.8;
  const boxH = 0.75;
  const startX = 0.4;
  const y = 2.8;
  const gap = 2.1;

  const steps = [
    { text: '펌핑 에너지\n투입', color: COLORS.accent_yellow },
    { text: '원자 들뜸\n(고에너지 준위)', color: COLORS.accent_blue },
    { text: '입사 광자\n도달', color: COLORS.accent_cyan },
    { text: '유도방출:\n동일 광자 2개', color: '00D4AA' },
    { text: '공진기 왕복\n→ 지수적 증폭', color: COLORS.accent_purple },
    { text: '레이저 빔\n출력', color: COLORS.accent_red },
  ];

  steps.forEach((s, i) => {
    const x = startX + i * gap;
    addFlowBox(slide, x, y, boxW, boxH, s.text, s.color, 'FFFFFF');
    if (i < steps.length - 1) {
      addFlowArrow(slide, x + boxW, y + boxH / 2, x + gap, y + boxH / 2);
    }
  });

  // 단계 번호
  steps.forEach((s, i) => {
    const x = startX + i * gap;
    slide.addText(String(i + 1), {
      x: x, y: y - 0.5, w: boxW, h: 0.35,
      fontSize: 12, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_tertiary, align: 'center',
    });
  });

  // 설명 박스
  slide.addShape('roundRect', { x: 0.4, y: 4.2, w: 12.5, h: 0.9, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText(
    '핵심: 각 유도방출은 입력 광자와 동일한 파장·위상·방향의 광자를 생성 → 공진기 내에서 반복하며 빛이 기하급수적으로 증폭됨',
    { x: 0.6, y: 4.3, w: 12.1, h: 0.7, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_primary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 11, TOTAL_SLIDES);
}

// Slide 12: 반전분포
function slide12_population_inversion() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '반전분포 없이는 흡수가 유도방출을 이긴다');

  // 정상 상태
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 5.9, h: 2.2, rectRadius: 0.1, fill: { color: 'FFF1F1' } });
  slide.addText('정상 상태 (No Lasing)', {
    x: 0.8, y: 2.0, w: 5.3, h: 0.4, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
  });
  slide.addText('저에너지 준위 원자 수 > 고에너지 준위\n→ 빛이 흡수됨 → 증폭 불가',
    { x: 0.8, y: 2.5, w: 5.3, h: 0.9, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  // 반전분포
  slide.addShape('roundRect', { x: 6.9, y: 1.85, w: 5.9, h: 2.2, rectRadius: 0.1, fill: { color: 'ECFDF5' } });
  slide.addText('반전분포 (Population Inversion)', {
    x: 7.2, y: 2.0, w: 5.4, h: 0.4, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan,
  });
  slide.addText('고에너지 준위 원자 수 > 저에너지 준위\n→ 유도방출 우세 → 증폭 가능',
    { x: 7.2, y: 2.5, w: 5.4, h: 0.9, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  // 만드는 방법
  slide.addShape('rect', { x: 0.5, y: 4.3, w: 12.3, h: 0.05, fill: { color: 'E2E8F0' } });
  slide.addText('반전분포를 만드는 방법 — 펌핑 (Pumping)', {
    x: 0.6, y: 4.5, w: 12.0, h: 0.4, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });

  const pumps = [
    { title: '광펌핑', desc: '플래시 램프 / 다이오드 레이저', color: COLORS.accent_yellow },
    { title: '전기 방전', desc: 'CO₂ 레이저 등 기체 레이저', color: COLORS.accent_blue },
    { title: '전류 주입', desc: '반도체(다이오드) 레이저', color: COLORS.accent_purple },
  ];
  pumps.forEach((p, i) => {
    addCard(slide, { x: 0.5 + i * 4.3, y: 5.05, w: 4.1, h: 1.7, title: p.title, body: p.desc, accentColor: p.color });
  });

  addPageNumber(slide, 12, TOTAL_SLIDES);
}

// Slide 13: 3준위 vs 4준위 시스템
function slide13_energy_levels() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '4준위 시스템이 산업용 레이저의 표준인 이유');

  const headers = ['항목', '3준위 시스템 (예: Ruby)', '4준위 시스템 (예: Nd:YAG)'];
  const rows = [
    ['반전분포 조건', '전체 원자의 50% 이상 펌핑 필요', '소량만 펌핑해도 달성'],
    ['효율', '낮음', '높음'],
    ['임계값 (Threshold)', '높음', '낮음'],
    ['연속파 동작 (CW)', '어려움', '용이'],
    ['대표 레이저', 'Ruby, Er:glass', 'Nd:YAG, Yb:파이버'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.0 });

  slide.addShape('roundRect', { x: 0.6, y: 6.1, w: 12.13, h: 0.9, rectRadius: 0.08, fill: { color: 'ECFDF5' } });
  slide.addText(
    '산업 현장에서는 4준위 시스템이 표준 — Nd:YAG, Yb:파이버, Yb:YAG 디스크 레이저가 모두 4준위 기반이다',
    { x: 0.8, y: 6.2, w: 11.8, h: 0.7, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_primary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

// Slide 14: 공진기 구조 다이어그램
function slide14_resonator() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '공진기: 두 미러 사이에서 빛을 왕복시켜 증폭한다');

  // 다이어그램 가로 배치
  const y = 3.0;
  const boxH = 0.9;

  // HR 미러
  slide.addShape('rect', { x: 0.5, y: y - 0.3, w: 0.25, h: boxH + 0.6, fill: { color: COLORS.text_primary } });
  slide.addText('HR 미러\n(반사율 99.9%)', {
    x: 0.1, y: y + 0.6, w: 1.1, h: 0.6, fontSize: 9, fontFace: 'Pretendard', color: COLORS.text_secondary, align: 'center',
  });

  // 이득 매질
  addFlowBox(slide, 2.5, y, 3.5, boxH, '이득 매질 (Gain Medium)\n펌핑 에너지 흡수 → 원자 들뜸 → 유도방출', COLORS.accent_cyan, 'FFFFFF');

  // OC 미러
  slide.addShape('rect', { x: 9.2, y: y - 0.3, w: 0.25, h: boxH + 0.6, fill: { color: '718096' } });
  slide.addText('OC 미러\n(출력 커플러, 부분 반사 ~90%)', {
    x: 8.7, y: y + 0.6, w: 1.5, h: 0.6, fontSize: 9, fontFace: 'Pretendard', color: COLORS.text_secondary, align: 'center',
  });

  // 레이저 빔 출력
  addFlowBox(slide, 10.3, y + 0.1, 2.6, 0.7, '레이저 빔 출력', COLORS.accent_red, 'FFFFFF');

  // 왕복 화살표
  slide.addShape('rect', { x: 0.75, y: y + 0.23, w: 1.75, h: 0.04, fill: { color: COLORS.accent_blue } });
  slide.addText('\u25B6', { x: 2.35, y: y + 0.12, w: 0.3, h: 0.3, fontSize: 10, color: COLORS.accent_blue, align: 'center', valign: 'middle' });
  slide.addShape('rect', { x: 6.0, y: y + 0.23, w: 1.75, h: 0.04, fill: { color: COLORS.accent_blue } });
  slide.addText('\u25B6', { x: 7.6, y: y + 0.12, w: 0.3, h: 0.3, fontSize: 10, color: COLORS.accent_blue, align: 'center', valign: 'middle' });
  slide.addShape('rect', { x: 2.5, y: y + 0.63, w: 3.5, h: 0.04, fill: { color: COLORS.accent_blue } });
  slide.addText('\u25C0', { x: 2.35, y: y + 0.52, w: 0.3, h: 0.3, fontSize: 10, color: COLORS.accent_blue, align: 'center', valign: 'middle' });
  slide.addShape('rect', { x: 9.2, y: y + 0.23, w: 1.1, h: 0.04, fill: { color: COLORS.accent_red } });
  slide.addText('\u25B6', { x: 10.15, y: y + 0.12, w: 0.3, h: 0.3, fontSize: 10, color: COLORS.accent_red, align: 'center', valign: 'middle' });

  // "빔 왕복" 라벨
  slide.addText('← 빔 왕복 →', {
    x: 0.5, y: y - 0.7, w: 8.9, h: 0.35, fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'center',
  });

  // 하단 설명
  slide.addShape('roundRect', { x: 0.5, y: 4.7, w: 12.3, h: 1.5, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText(
    '공진기 길이와 파장이 정수 관계인 빛만 살아남아 단색성·지향성을 부여\n\n절삭 비유: 절삭가공에서 공진 진동이 문제인 것과 달리, 레이저에서는 공진이 핵심 원리로 작동함',
    { x: 0.7, y: 4.8, w: 12.0, h: 1.3, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_primary, lineSpacingMultiple: 1.5, valign: 'top' }
  );

  addPageNumber(slide, 14, TOTAL_SLIDES);
}

// Slide 15: 이득 매질 분류
function slide15_gain_medium() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '이득 매질이 레이저의 파장과 특성을 결정한다');

  const headers = ['분류', '대표 물질', '파장', '특성'];
  const rows = [
    ['고체 결정', 'Nd:YAG, Yb:YAG', '1064nm, 1030nm', '고출력, Q-스위칭 가능'],
    ['광섬유', 'Yb-doped fiber', '~1070nm', '빔 품질 우수, 유지보수 최소'],
    ['기체', 'CO₂ (CO₂+N₂+He 혼합)', '10.6μm', '비금속 흡수율 높음'],
    ['반도체', 'GaAs, InGaAs', '780~1100nm', '소형, 고효율, 펌핑용으로 사용'],
    ['엑시머', 'ArF, KrF, XeCl', '193~308nm', 'UV, 광화학 반응 기반'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.2 });

  slide.addShape('roundRect', { x: 0.6, y: 6.25, w: 12.13, h: 0.7, rectRadius: 0.08, fill: { color: 'F5F7FA' } });
  slide.addText(
    '이득 매질 → 파장 결정 → 재료 흡수율 결정 → 가공 특성 결정: 이 인과 사슬이 소스 선택의 핵심',
    { x: 0.8, y: 6.32, w: 11.8, h: 0.55, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary }
  );

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

// Slide 16: 코히런스
function slide16_coherence() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '공간적 코히런스가 가공에서 가장 중요하다');

  // 시간적 코히런스
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 5.9, h: 2.4, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 0.52, y: 1.85, w: 5.86, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('시간적 코히런스 (Temporal Coherence)', {
    x: 0.8, y: 2.0, w: 5.3, h: 0.4, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    '빔 길이(전파) 방향의 위상 일관성\n\n• 대역폭이 좁을수록 코히런스 길이↑\n• 간섭계, 홀로그래피에 중요\n• 가공에서는 직접 영향 제한적',
    { x: 0.8, y: 2.5, w: 5.3, h: 1.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  // 공간적 코히런스
  slide.addShape('roundRect', { x: 6.9, y: 1.85, w: 5.9, h: 2.4, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addShape('rect', { x: 6.92, y: 1.85, w: 5.86, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('공간적 코히런스 (Spatial Coherence)', {
    x: 7.2, y: 2.0, w: 5.4, h: 0.4, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue,
  });
  slide.addText(
    '빔 단면 내 위상 일관성\n\n• M² 팩터와 직결 → 집속 성능 결정\n• 공간 코히런스↑ → 더 작은 스폿 가능\n• 싱글모드 파이버 레이저가 이 값이 우수',
    { x: 7.2, y: 2.5, w: 5.4, h: 1.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  // 주의 박스
  slide.addShape('roundRect', { x: 0.5, y: 4.55, w: 12.3, h: 1.4, rectRadius: 0.1, fill: { color: 'FFF7ED' } });
  slide.addText('주의: 고 코히런스가 항상 좋은 것은 아니다', {
    x: 0.8, y: 4.7, w: 12.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow,
  });
  slide.addText(
    '스팩클(Speckle) 노이즈: 코히런스가 높은 빔이 거친 표면에 반사 시 간섭 패턴(얼룩) 발생 → 일부 측정 및 가공에서 문제',
    { x: 0.8, y: 5.1, w: 12.0, h: 0.7, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

// Slide 17: 편광
function slide17_polarization() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '편광은 금속 절단에서 흡수율을 크게 변화시킨다');

  const headers = ['편광 유형', '특성', '권장 용도'];
  const rows = [
    ['P편광 (P-polarization)', '절단 방향 정렬 시 최고 흡수율', '일방향 직선 절단'],
    ['S편광 (S-polarization)', 'P편광의 직각. 절단면 경사에서 반사↑', '특수 용도 (일반적으로 불리)'],
    ['원형 편광 (Circular)', '방향 무관 균일 흡수율', '3D 가공, 윤곽 절단'],
    ['방사형 편광 (Radial)', '후판에서 1.5~2배 속도 향상 가능 (모델링 연구 기반)', '후판 금속 절단'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 3.2 });

  // 주의 텍스트
  slide.addShape('roundRect', { x: 0.6, y: 5.3, w: 12.13, h: 0.75, rectRadius: 0.08, fill: { color: 'FFF7ED' } });
  slide.addText(
    '주의: 방사형 편광 1.5~2배 속도 향상은 모델링/연구 결과 기반. 박판에서는 차이가 미미하며, 실제 적용 전 조건별 검증 필요',
    { x: 0.8, y: 5.4, w: 11.8, h: 0.55, fontSize: 11, fontFace: 'Pretendard', color: COLORS.accent_yellow }
  );

  // 비유
  slide.addShape('roundRect', { x: 0.6, y: 6.2, w: 12.13, h: 0.75, rectRadius: 0.08, fill: { color: 'EEF2FF' } });
  slide.addText(
    '비유: 절삭가공에서 경사각(Rake Angle)이 칩 형성과 절삭력에 영향 주는 것처럼, 편광 방향은 레이저 에너지의 흡수율에 영향을 준다',
    { x: 0.8, y: 6.3, w: 11.8, h: 0.55, fontSize: 11, fontFace: 'Pretendard', color: COLORS.accent_blue }
  );

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

// Slide 18: 편광 — 파이버 레이저에서 다른 이유
function slide18_polarization_fiber() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '파이버 레이저는 랜덤 편광이 기본이다');

  const items = [
    {
      icon: '①', title: '파이버 내부 랜덤 편광',
      body: '파이버 내부에서 편광 상태가 무작위로 변화 → 출력 빔은 랜덤 편광',
      color: COLORS.accent_blue,
    },
    {
      icon: '②', title: '원형 편광과 유사한 효과',
      body: '랜덤 편광은 통계적으로 원형 편광과 유사 → 방향 무관 가공에 유리',
      color: COLORS.accent_cyan,
    },
    {
      icon: '③', title: '편광 유지 파이버(PM Fiber)',
      body: '편광 방향을 고정할 수 있으나 비용↑. 간섭계·센서 응용에서 필요',
      color: COLORS.accent_yellow,
    },
    {
      icon: '④', title: 'CO₂ 레이저와 비교',
      body: 'CO₂ 레이저: 보통 직선 편광 출력 → 윤곽 절단 시 원형 편광 변환 필요 (λ/4 파장판 사용)',
      color: COLORS.accent_purple,
    },
  ];

  items.forEach((item, i) => {
    const x = i < 2 ? 0.5 : 0.5;
    const y = i < 2 ? 1.9 + i * 2.0 : 1.9 + i * 2.0;
    const col = i % 2;
    const row = Math.floor(i / 2);
    addCard(slide, {
      x: 0.5 + col * 6.4, y: 1.9 + row * 2.4, w: 6.1, h: 2.1,
      title: item.icon + ' ' + item.title, body: item.body, accentColor: item.color,
    });
  });

  addPageNumber(slide, 18, TOTAL_SLIDES);
}

// Slide 19: Section Divider — Part 2 (페이지 번호 없음)
function slide19_section2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: COLORS.accent_cyan } });
  slide.addText('02', {
    x: 0.8, y: 1.8, w: 2.5, h: 1.4,
    fontSize: 96, fontFace: FONTS.kpi.fontFace, bold: true,
    color: '1A3A3A', align: 'left',
  });
  slide.addText('레이저 소스 가이드', {
    x: 0.8, y: 3.3, w: 11.0, h: 1.0,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, charSpacing: -0.3,
  });
  slide.addText('7종 소스의 특성을 비교하고 선택 기준을 세운다', {
    x: 0.8, y: 4.4, w: 11.0, h: 0.5,
    fontSize: 20, fontFace: 'Pretendard',
    color: COLORS.accent_cyan,
  });
}

// Slide 20: 소스 7종 비교표 (1/2)
function slide20_sources_table1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '산업용 레이저 소스 7종 핵심 특성 비교 (1/2)');

  const headers = ['종류', '파장', '출력 범위', 'M² (빔 품질)', '벽면효율(WPE)'];
  const rows = [
    ['CO₂', '10.6 μm', '수십W ~ 수십kW', 'SM: 1.0~1.5  /  MM: 2~5', '10~15%'],
    ['파이버 (Yb)', '~1070 nm', '수W ~ 수십kW', '≤1.1 (싱글모드)', '30~50%'],
    ['디스크 (Yb:YAG)', '~1030 nm', '수백W ~ 수십kW', '1.0~1.2', '50~80% (광-광)'],
    ['Nd:YAG', '1064 nm', '수W ~ 수kW', 'SM: 1.5~5  /  MM: 3~10', '10~25%'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.0 });

  slide.addText('SM = 싱글모드 (Single-Mode),  MM = 멀티모드 (Multi-Mode),  WPE = 벽면효율 (Wall-Plug Efficiency)',
    { x: 0.6, y: 6.15, w: 12.13, h: 0.4, fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_tertiary }
  );

  addPageNumber(slide, 20, TOTAL_SLIDES);
}

// Slide 21: 소스 7종 비교표 (2/2)
function slide21_sources_table2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '산업용 레이저 소스 7종 핵심 특성 비교 (2/2)');

  const headers = ['종류', '파장', '출력 범위', 'M² (빔 품질)', '벽면효율(WPE)'];
  const rows = [
    ['다이오드 (Diode)', '780~1100 nm', '수W ~ 수kW', '5~30', '>50% (칩 수준)'],
    ['초단펄스 (fs/ps)', '~1030 nm', '수W ~ 수백W', '1.0~1.5', '5~30%'],
    ['엑시머 (Excimer)', '193~351 nm', '수십~수백W', '10~30', '<5%'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 3.0 });

  slide.addText('SM = 싱글모드 (Single-Mode),  MM = 멀티모드 (Multi-Mode),  WPE = 벽면효율 (Wall-Plug Efficiency)',
    { x: 0.6, y: 5.1, w: 12.13, h: 0.4, fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_tertiary }
  );

  // 요약 인사이트
  slide.addShape('roundRect', { x: 0.6, y: 5.65, w: 12.13, h: 1.3, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addText(
    '파이버 레이저: WPE + M² 조합에서 최고 밸런스 → 범용 금속 가공 1순위\n디스크: 광-광 효율 최고 수준이나 시스템 복잡도↑\n엑시머/초단펄스: HAZ 극소 정밀 가공, 비용↑',
    { x: 0.8, y: 5.75, w: 11.8, h: 1.1, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_primary, lineSpacingMultiple: 1.5, valign: 'top' }
  );

  addPageNumber(slide, 21, TOTAL_SLIDES);
}

// Slide 22: CO₂ 레이저
function slide22_co2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, 'CO₂ 레이저: 비금속 가공의 최강자, 후판 절단에서 여전히 경쟁력');

  // 좌측 원리
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 5.9, h: 4.5, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addText('원리 및 구성', {
    x: 0.8, y: 2.0, w: 5.3, h: 0.4, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    '• 파장 10.6 μm → 유기물/비금속에서 흡수율 >90%\n• CO₂ + N₂ + He 혼합 가스 + 전기 방전 펌핑\n• 빔 전달: 미러(자유공간) 또는 관절 암 사용\n  (광섬유로 전달 불가 — 적외선 영역 광섬유 손실 과다)',
    { x: 0.8, y: 2.5, w: 5.3, h: 2.5, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, valign: 'top' }
  );

  // 우측 장단점
  slide.addShape('roundRect', { x: 6.9, y: 1.85, w: 5.9, h: 2.0, rectRadius: 0.1, fill: { color: 'ECFDF5' } });
  slide.addText('장점', {
    x: 7.2, y: 2.0, w: 5.4, h: 0.35, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan,
  });
  slide.addText(
    '• 비금속 절단면 매우 깨끗\n• 후판 절단면 품질 우수\n• 기술 성숙도 높음',
    { x: 7.2, y: 2.4, w: 5.4, h: 1.2, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  slide.addShape('roundRect', { x: 6.9, y: 4.05, w: 5.9, h: 2.3, rectRadius: 0.1, fill: { color: 'FFF1F1' } });
  slide.addText('단점 및 트렌드', {
    x: 7.2, y: 4.2, w: 5.4, h: 0.35, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
  });
  slide.addText(
    '• WPE 10~15% → 전력비 높음\n• 미러 정렬 유지보수 필요\n• 가스 소모 비용\n• 트렌드: 파이버 레이저에 시장 점유율 잠식\n  단, 비금속 및 일부 영역에서 대체 불가',
    { x: 7.2, y: 4.6, w: 5.4, h: 1.55, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  addPageNumber(slide, 22, TOTAL_SLIDES);
}

// Slide 23: 파이버 레이저
function slide23_fiber() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '파이버 레이저가 산업을 지배하는 이유: M²≤1.1 + 벽면효율(WPE) 50%');

  const cards = [
    {
      x: 0.5, y: 1.9, w: 5.9, h: 2.4,
      title: '빔 품질',
      body: 'M²≤1.1 (싱글모드), BPP ~0.3~1.5 mm·mrad\n→ 회절 한계에 근접한 초미세 스폿 집속 가능',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.9, y: 1.9, w: 5.9, h: 2.4,
      title: '효율',
      body: '벽면효율(WPE) 30~50%\n→ CO₂ 대비 전력비 1/3~1/5\n→ 냉각 부하도 대폭 감소',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.5, y: 4.5, w: 5.9, h: 2.4,
      title: '유지보수',
      body: '밀봉 구조로 정렬 불필요\n다이오드 펌프 수명 ~100,000시간\n→ 가동률 극대화',
      accentColor: COLORS.accent_yellow,
    },
    {
      x: 6.9, y: 4.5, w: 5.9, h: 2.4,
      title: '빔 전달 유연성',
      body: '광섬유로 빔 전달 → 로봇 암 장착 유연\n환경 진동·온도 변화에 강인\n다헤드(Multi-head) 구성 용이',
      accentColor: COLORS.accent_purple,
    },
  ];
  cards.forEach(c => addCard(slide, c));

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

// Slide 24: 파이버 레이저 — 한계
function slide24_fiber_limits() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '파이버 레이저도 만능은 아니다');

  const limits = [
    { title: '비금속 가공 부적합', body: 'CO₂(10.6μm) 대비 아크릴, 목재, 가죽 절단에서 흡수율 낮음 → 절단면 품질 열위', color: COLORS.accent_red },
    { title: '고반사 재료 역반사 위험', body: '구리, 알루미늄 가공 시 역반사(Back-Reflection) → 소스 손상 위험. 아이솔레이터(Isolator) 또는 반사 방지 코팅 필수', color: COLORS.accent_yellow },
    { title: '후판 절단면 품질', body: '탄소강 25mm 이상에서 CO₂가 여전히 절단면 품질 우위. 드로스(Dross) 발생↑', color: COLORS.accent_blue },
    { title: 'TMI (Transverse Mode Instability)', body: '고출력(수kW 이상)에서 횡모드 불안정성 발생 가능 → 빔 품질 급격 저하. 설계로 완화 가능하나 한계 존재', color: COLORS.accent_purple },
    { title: 'BPP는 광학 불변량', body: '소스 BPP가 최종 스폿 크기의 하한을 결정. 광학계로 스폿을 줄이면 DOF가 짧아짐 → 소스 자체의 한계가 최종 성능 결정', color: COLORS.accent_cyan },
  ];

  limits.forEach((item, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    if (i < 4) {
      addCard(slide, {
        x: 0.5 + col * 6.4, y: 1.9 + row * 2.1, w: 6.1, h: 1.85,
        title: item.title, body: item.body, accentColor: item.color,
      });
    } else {
      // 마지막 항목 전폭
      addCard(slide, { x: 0.5, y: 6.15, w: 12.3, h: 0.95, title: item.title, body: item.body, accentColor: item.color });
    }
  });

  addPageNumber(slide, 24, TOTAL_SLIDES);
}

// Slide 25: 디스크 레이저
function slide25_disk() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '디스크 레이저: 열을 면 방향으로 빼서 고출력에서 빔 품질 유지');

  // 원리
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 12.3, h: 2.0, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addText('핵심 원리', {
    x: 0.8, y: 1.95, w: 11.7, h: 0.35, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    'Yb:YAG 얇은 디스크(두께 ~200μm)를 이득 매질로 사용 → 열 구배가 빔 축과 수직 방향으로 형성\n→ 열렌즈 효과(Thermal Lensing) 최소화 → 고출력에서도 M² 안정 유지',
    { x: 0.8, y: 2.35, w: 11.7, h: 0.9, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  const features = [
    { title: '초단펄스 증폭', body: 'Regenerative Amplifier로 활용 가능\n → ps/fs 레이저의 에너지 증폭에 적합', color: COLORS.accent_blue },
    { title: '대표 제품', body: 'TRUMPF TruDisk 시리즈\n수kW~수십kW급 산업 응용', color: COLORS.accent_cyan },
    { title: '파이버 레이저 대비', body: '단가↑, 시스템 복잡도↑\n빔 품질 유사, 초고출력에서 강점', color: COLORS.accent_yellow },
  ];
  features.forEach((f, i) => {
    addCard(slide, { x: 0.5 + i * 4.3, y: 4.1, w: 4.1, h: 2.6, title: f.title, body: f.body, accentColor: f.color });
  });

  addPageNumber(slide, 25, TOTAL_SLIDES);
}

// Slide 26: Nd:YAG & 다이오드 레이저
function slide26_ndyag_diode() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, 'Nd:YAG는 레거시, 다이오드는 넓은 면적 가공에 강하다');

  // Nd:YAG
  slide.addShape('roundRect', { x: 0.5, y: 1.85, w: 5.9, h: 4.5, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 0.52, y: 1.85, w: 5.86, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('Nd:YAG 레이저', {
    x: 0.8, y: 2.0, w: 5.3, h: 0.4, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    '• 파장: 1064nm\n• Q-스위칭으로 고피크파워 펄스 생성 가능\n• 램프 펌핑(Lamp-Pumped): WPE ~1~3% — 매우 비효율\n• DPSS (다이오드 펌핑 고체 레이저)로 전환 중\n  → WPE 10~25%로 개선\n• 레거시 장비에서 여전히 사용\n• 파이버 레이저로의 교체가 ROI상 유리',
    { x: 0.8, y: 2.5, w: 5.3, h: 3.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, valign: 'top' }
  );

  // 다이오드
  slide.addShape('roundRect', { x: 6.9, y: 1.85, w: 5.9, h: 4.5, rectRadius: 0.1, fill: { color: 'EEF2FF' } });
  slide.addShape('rect', { x: 6.92, y: 1.85, w: 5.86, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('다이오드 레이저 (Diode Laser)', {
    x: 7.2, y: 2.0, w: 5.4, h: 0.4, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    '• 파장: 780~1100nm (소재별 다양)\n• 칩 수준 WPE >50% — 최고 효율\n• M² 5~30 → 정밀 집속 가공 부적합\n• 넓은 스폿 활용 분야:\n  - 표면 열처리 / 경화 (Heat Treatment)\n  - 직접 금속 용접 (Wide-bead)\n  - 플라스틱 용접\n• 파이버/디스크의 펌프 소스로도 사용',
    { x: 7.2, y: 2.5, w: 5.4, h: 3.5, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, valign: 'top' }
  );

  addPageNumber(slide, 26, TOTAL_SLIDES);
}

// Slide 27: 초단펄스 레이저 — 콜드 가공의 원리
function slide27_ultrashort_principle() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '펄스가 열확산보다 빠르면 \'냉간 가공\'이 된다');

  // 짧은 펄스 (fs/ps) 경로
  slide.addText('짧은 펄스 (fs/ps) — 냉간 어블레이션', {
    x: 0.6, y: 1.9, w: 12.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan,
  });
  const coldSteps = [
    { text: '펄스 에너지\n입력 (fs/ps)', color: COLORS.accent_blue },
    { text: '전자 여기\n(재료 표면)', color: COLORS.accent_cyan },
    { text: '열확산 前\n어블레이션', color: COLORS.accent_yellow },
    { text: 'HAZ 극소\n리캐스트 없음', color: '38BDF8' },
  ];
  const bw = 2.6; const bh = 0.75; const by = 2.35;
  coldSteps.forEach((s, i) => {
    addFlowBox(slide, 0.6 + i * 3.1, by, bw, bh, s.text, s.color, 'FFFFFF');
    if (i < coldSteps.length - 1) {
      addFlowArrow(slide, 0.6 + i * 3.1 + bw, by + bh / 2, 0.6 + (i + 1) * 3.1, by + bh / 2);
    }
  });

  // 긴 펄스 경로
  slide.addText('긴 펄스 (ns/μs) — 열 손상 발생', {
    x: 0.6, y: 3.5, w: 12.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
  });
  const hotSteps = [
    { text: '긴 펄스\n(ns/μs)', color: COLORS.accent_yellow },
    { text: '전자→격자\n열전달', color: 'FF8C42' },
    { text: '열확산\n발생', color: COLORS.accent_red },
    { text: 'HAZ 크고\n리캐스트층 형성', color: 'C0392B' },
  ];
  hotSteps.forEach((s, i) => {
    addFlowBox(slide, 0.6 + i * 3.1, 3.95, bw, bh, s.text, s.color, 'FFFFFF');
    if (i < hotSteps.length - 1) {
      addFlowArrow(slide, 0.6 + i * 3.1 + bw, 3.95 + bh / 2, 0.6 + (i + 1) * 3.1, 3.95 + bh / 2);
    }
  });

  // 핵심 원리
  slide.addShape('roundRect', { x: 0.5, y: 5.15, w: 12.3, h: 0.7, rectRadius: 0.08, fill: { color: 'ECFDF5' } });
  slide.addText('핵심: 에너지 입력 시간 < 열확산 시간 → Cold Ablation (냉간 어블레이션) — HAZ 극소화',
    { x: 0.7, y: 5.25, w: 12.0, h: 0.5, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan }
  );

  // 이질 도메인
  slide.addShape('roundRect', { x: 0.5, y: 6.0, w: 12.3, h: 0.95, rectRadius: 0.08, fill: { color: 'F5F7FA' } });
  slide.addText('[이질 도메인: EDM (방전가공)]  동일 원리: 짧은 방전 → 정밀 가공, 긴 방전 → 열 손상\n에너지 입력 시간 제어가 정밀도를 결정한다는 구조가 레이저와 동일함',
    { x: 0.7, y: 6.08, w: 12.0, h: 0.8, fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

// Slide 28: 초단펄스 비교표
function slide28_ultrashort_compare() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, 'ns vs ps vs fs: 펄스폭이 짧을수록 정밀하지만 비용이 높다');

  const headers = ['펄스폭', '열 영향부(HAZ)', '가공면 품질', '적합 용도', '장비 비용'];
  const rows = [
    ['ns (나노초)', '크고 불규칙', '버(Burr)/리캐스트층 존재', '일반 절단, 마킹, 천공', '낮음'],
    ['ps (피코초)', '작음', '깨끗한 절단면', '정밀 마이크로 가공, 의료부품', '중간'],
    ['fs (펨토초)', '극소', '매우 깨끗, 거의 무손상', '초정밀 의료/반도체/유리 가공', '높음'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 3.2 });

  // 주의
  slide.addShape('roundRect', { x: 0.6, y: 5.35, w: 12.13, h: 1.65, rectRadius: 0.1, fill: { color: 'FFF7ED' } });
  slide.addText('주의: fs가 모든 가공에 최적은 아니다', {
    x: 0.8, y: 5.5, w: 12.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow,
  });
  slide.addText(
    '반복률(Rep Rate)을 높이면 펄스 간 열이 누적 → HAZ가 다시 커짐. 실제 공정에서는 "평균 출력 × 스캔 속도 × 반복" 최적화가 필수.\n재료 제거율(MRR)도 ns 대비 낮아 생산성과 품질 사이의 트레이드오프 발생.',
    { x: 0.8, y: 5.9, w: 12.0, h: 0.9, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

// Slide 29: 소스 선택 의사결정 가이드
function slide29_source_selection() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '가공 상황에 따른 레이저 소스 선택 가이드');

  const headers = ['가공 상황', '권장 소스', '이유'];
  const rows = [
    ['스테인리스/연강 3mm 이하 정밀 절단', '파이버 레이저', 'M²≤1.1, 낮은 운전비'],
    ['아크릴 / 목재 / 가죽 / 직물 절단', 'CO₂ 레이저', '10.6μm 흡수율 탁월, 절단면 깨끗'],
    ['탄소강 20mm 이상 후판 절단', 'CO₂ 또는 고출력 파이버', '후판 절단면 품질, 드로스(Dross) 제어'],
    ['구리 / 알루미늄 용접', '그린(532nm) 또는 고피크파워 파이버', 'IR 고반사율 회피, 안정적 흡수'],
    ['반도체 패터닝 / 유리 가공', '엑시머 / fs 레이저', '광화학/냉간 어블레이션, HAZ 극소'],
    ['넓은 면적 열처리 / 표면 경화', '다이오드 레이저', '고효율(>50%), 넓은 스폿 균일 조사'],
    ['고속 마킹 / 소형 부품 가공', '파이버 + 갈바노 스캐너', 'M² 우수 + 고속 스캔 조합'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.9 });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

// Slide 30: TCO 총소유비용 비교
function slide30_tco() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '초기 투자비보다 운영비가 소스 선택을 결정한다');

  const headers = ['총소유비용(TCO) 항목', '파이버 레이저', 'CO₂ 레이저', 'Nd:YAG (램프 펌핑)'];
  const rows = [
    ['초기 투자', '중~고', '중', '낮음 (구형 장비)'],
    ['전력 비용', '낮음 (WPE 30~50%)', '높음 (WPE 10~15%)', '매우 높음 (WPE 1~3%)'],
    ['소모품', '보호 윈도우, 노즐', 'ZnSe 렌즈 (고가), 혼합 가스', '플래시 램프, 렌즈'],
    ['유지보수', '밀봉 구조, 정렬 최소', '미러 정렬, 가스 보충', '램프 교체 주기적'],
    ['다운타임', '낮음', '정렬 유지보수 시 중단', '램프 교체 시 중단'],
  ];
  addStyledTable(slide, headers, rows, { y: 1.85, h: 4.0 });

  slide.addShape('roundRect', { x: 0.6, y: 6.1, w: 12.13, h: 0.95, rectRadius: 0.08, fill: { color: 'ECFDF5' } });
  slide.addText(
    'Nd:YAG 램프 펌핑 장비의 수명 종료 시 파이버 레이저로 전환하는 ROI 계산이 가능 — 일반적으로 2~3년 내 투자 회수\n→ 전력비 + 유지보수비 절감이 교체 비용을 초과하는 시나리오 검토 권장',
    { x: 0.8, y: 6.2, w: 11.8, h: 0.75, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_primary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

// ============================================================
// 실행: 슬라이드 생성 순서
// ============================================================
slide01_title();
slide02_purpose();
slide03_confusion1();
slide04_confusion2();
slide05_mapping1();
slide06_mapping2();
slide07_overview();
slide08_section1();
slide09_laser_definition();
slide10_stimulated_emission();
slide11_emission_diagram();
slide12_population_inversion();
slide13_energy_levels();
slide14_resonator();
slide15_gain_medium();
slide16_coherence();
slide17_polarization();
slide18_polarization_fiber();
slide19_section2();
slide20_sources_table1();
slide21_sources_table2();
slide22_co2();
slide23_fiber();
slide24_fiber_limits();
slide25_disk();
slide26_ndyag_diode();
slide27_ultrashort_principle();
slide28_ultrashort_compare();
slide29_source_selection();
slide30_tco();

// PPTX 파일 저장
pptx.writeFile({ fileName: 'laser-fundamentals-guide.pptx' })
  .then(() => console.log('Part A (슬라이드 1~30) 저장 완료: laser-fundamentals-guide.pptx'))
  .catch(err => console.error('저장 실패:', err));

// === Part A 끝 (슬라이드 1~30) ===
// Part B (slides 31-60)와 Part C (slides 61-85)는 별도 파일에서 이어짐


function slide31_source_flowchart() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 요구사항에서 소스 선택까지의 의사결정 흐름');
  addFlowDiamond(slide, 1.5, 2.0, 1.8, 1.0, '재료?');
  addFlowDiamond(slide, 5.0, 3.5, 1.8, 1.0, '정밀도?');
  addFlowDiamond(slide, 5.0, 5.2, 1.8, 1.0, '고반사?');
  addFlowBox(slide, 4.5, 1.5, 1.8, 0.7, 'CO₂ 레이저', COLORS.accent_blue);
  addFlowBox(slide, 8.5, 3.2, 2.0, 0.7, '초단펄스 (fs/ps)', COLORS.accent_purple);
  addFlowBox(slide, 8.5, 5.0, 2.0, 0.7, '그린/블루 레이저', '00D4AA');
  addFlowBox(slide, 8.5, 6.0, 2.0, 0.7, '파이버 레이저', COLORS.accent_blue);
  addFlowArrow(slide, 3.3, 2.5, 4.5, 1.85);
  addFlowArrow(slide, 3.3, 2.5, 5.0, 4.0);
  addFlowArrow(slide, 6.8, 4.0, 8.5, 3.55);
  addFlowArrow(slide, 5.9, 4.5, 5.9, 5.2);
  addFlowArrow(slide, 6.8, 5.7, 8.5, 5.35);
  addFlowArrow(slide, 5.9, 6.2, 8.5, 6.35);
  slide.addText('비금속', { x: 3.3, y: 1.6, w: 1.2, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('금속', { x: 3.5, y: 3.0, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('μm급', { x: 7.0, y: 3.2, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('일반', { x: 5.1, y: 4.6, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('예', { x: 7.0, y: 5.0, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('아니오', { x: 5.1, y: 6.0, w: 1.5, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  addPageNumber(slide, 31, TOTAL_SLIDES);
}

function slide32_part2_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Part 2 핵심: 소스 선택은 파장-재료 매칭이 출발점');
  slide.addText([
    { text: '파장이 재료 흡수율을 결정한다 — 소스 선택의 1차 기준', options: { bullet: true, indentLevel: 0 } },
    { text: '빔 품질(M²/BPP)은 광학 불변량 — 소스에서 결정되면 렌즈로 개선 불가', options: { bullet: true, indentLevel: 0 } },
    { text: 'TCO 관점: WPE 차이가 장기 운영비를 지배한다', options: { bullet: true, indentLevel: 0 } },
    { text: '트렌드: 파이버 레이저가 대부분의 금속 가공 시장을 지배 중', options: { bullet: true, indentLevel: 0 } },
  ], { x: 0.6, y: 1.8, w: 12.13, h: 4.5, fontSize: 20, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.8, paraSpaceAfter: 12, valign: 'top' });
  addPageNumber(slide, 32, TOTAL_SLIDES);
}

function slide33_section3() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('광학계', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('빔의 형태와 전달, 집속의 원리를 이해한다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
}

function slide34_beam_metrics() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 빔을 기술하는 4가지 핵심 지표');
  addStyledTable(slide, ['지표', '정의', '가공 영향', '좋은 방향'], [
    ['M²', '이상적 가우시안 대비 빔 품질', 'M²×2 → 스폿×2 → 에너지밀도 1/4', '낮을수록'],
    ['BPP (mm·mrad)', 'w₀ × θ, 광학 불변량', '작을수록 같은 광학계로 작은 스폿', '낮을수록'],
    ['빔 프로파일', '단면 에너지 분포 형태', '가우시안:최소스폿, 탑햇:균일', '공정별 상이'],
    ['DOF (초점심도)', '빔 웨이스트 전후 유효 범위', '짧으면 정밀, 길면 후판 유리', '공정별 상이'],
  ]);
  addPageNumber(slide, 34, TOTAL_SLIDES);
}

function slide35_gaussian() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가우시안 빔: 중심이 가장 강하고 가장자리로 감소한다');
  slide.addText([
    { text: '1/e² 정의', options: { bold: true, fontSize: 18 } },
    { text: '\n빔 반지름 = 중심 세기의 13.5% 지점까지의 거리', options: {} },
    { text: '\n이 범위 안에 전체 에너지의 86.5% 포함', options: {} },
    { text: '\n빔 직경 d = 2w (카탈로그 기본 수치)', options: {} },
  ], { x: 0.6, y: 1.8, w: 5.8, h: 3.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addCard(slide, { x: 7.0, y: 1.8, w: 5.7, h: 3.5, title: '절삭가공 비유', body: '드릴 직경 = 유효 가공 범위와 유사.\n\n차이: 레이저는 경계가 부드러움\n→ 가장자리 에너지가 점진적 감소\n→ 불균일 가공의 원인 가능', accentColor: COLORS.accent_cyan });
  addPageNumber(slide, 35, TOTAL_SLIDES);
}

function slide36_waist_rayleigh() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 웨이스트 = 초점, 레일리 길이 = 유효 초점 범위');
  slide.addText('빔 웨이스트 (Beam Waist)', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: 'w₀: 빔 반지름 최소 위치', options: { bullet: true } },
    { text: '피가공물 표면 = 빔 웨이스트에 배치', options: { bullet: true } },
    { text: 'w₀ 작을수록 정밀 가공 가능', options: { bullet: true } },
  ], { x: 0.6, y: 2.3, w: 5.8, h: 2.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  slide.addText('레일리 길이 (Rayleigh Length)', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: 'z_R: 빔 단면적이 2배 되는 거리', options: { bullet: true } },
    { text: 'z_R = π·w₀² / (M²·λ)', options: { bullet: true } },
    { text: 'DOF ≈ 2·z_R', options: { bullet: true } },
    { text: '핵심: w₀↓ → z_R↓ (정밀 vs DOF 트레이드오프)', options: { bullet: true } },
  ], { x: 6.8, y: 2.3, w: 5.9, h: 2.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addPageNumber(slide, 36, TOTAL_SLIDES);
}

function slide37_bpp() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'BPP는 광학 불변량 — 렌즈로는 줄일 수 없다');
  slide.addText([
    { text: '발산각 θ: 원거리에서 빔이 퍼지는 각도', options: { bullet: true } },
    { text: 'BPP = w₀ × θ [mm·mrad]', options: { bullet: true } },
    { text: 'BPP = M² × λ / π', options: { bullet: true } },
    { text: 'BPP는 보존량. w₀↓ → θ↑ (역도 성립)', options: { bullet: true } },
    { text: '파이버 커플링: 코어에 입사 가능한 BPP 상한 존재', options: { bullet: true } },
  ], { x: 0.6, y: 1.8, w: 8.0, h: 4.0, fontSize: 18, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, valign: 'top' });
  addCard(slide, { x: 9.0, y: 1.8, w: 3.7, h: 4.0, title: '핵심 인사이트', body: '소스 선택에서\nM²/BPP가 결정적인 이유:\n\n아무리 좋은 렌즈를 써도\n소스 자체의 BPP를\n개선할 수 없다.', accentColor: COLORS.accent_red });
  addPageNumber(slide, 37, TOTAL_SLIDES);
}

function slide38_formulas() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 3가지 공식만 알면 빔 파라미터를 추론할 수 있다');
  addCard(slide, { x: 0.6, y: 1.8, w: 3.8, h: 4.5, title: '스폿 직경', body: 'd_s = 4·M²·λ·f / (π·D_beam)\n\n파장↓ → 작은 스폿\nM²↓ → 작은 스폿\n빔 직경↑ → 작은 스폿\n초점거리↓ → 작은 스폿', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 1.8, w: 3.8, h: 4.5, title: '초점심도 (DOF)', body: 'DOF = 2π·w₀² / (M²·λ)\n\n작은 스폿 = 얕은 DOF\n(필연적 트레이드오프)\n\n두꺼운 재료 → 긴 FL\n→ 큰 스폿 감수', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 1.8, w: 3.8, h: 4.5, title: 'BPP', body: 'BPP = M²·λ / π\n\n광학 불변량.\n소스 결정, 변경 불가.\n\n파이버: ~0.3~1.5\nCO₂: ~2~6 mm·mrad', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 38, TOTAL_SLIDES);
}

function slide39_beam_profiles() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 프로파일이 가공 품질을 직접 결정한다');
  addStyledTable(slide, ['프로파일', '형태', '에너지 분포', '적합 용도'], [
    ['가우시안', '종 모양', '중심 최대, 가장자리 감소', '정밀 절단, 마킹, 드릴링'],
    ['탑햇 (Top-hat)', '평탄', '균일 분포', '열처리, 균일 용융, 박막'],
    ['링 (Ring/Donut)', '도넛', '중심 저, 가장자리 고', '키홀 용접 안정화'],
    ['멀티모드', '불규칙', '불균일', '저비용 범용 (정밀도↓)'],
  ]);
  slide.addText('최근 트렌드: 링+코어 빔 성형으로 용접 기공률 90% 감소 사례', { x: 0.6, y: 5.8, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_blue, italic: true });
  addPageNumber(slide, 39, TOTAL_SLIDES);
}

function slide40_optical_components() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6가지 광학 부품의 역할과 선택 기준');
  addStyledTable(slide, ['부품', '역할', '핵심 선택 기준'], [
    ['집속 렌즈', '빔을 스폿으로 모음', '재질(파장 적합), FL(스폿 vs DOF)'],
    ['콜리메이터', '발산 빔 → 평행 빔', '콜리/집속 FL 비율 = 배율 레버'],
    ['빔 익스팬더', '빔 직경 확대', '작은 스폿, 손상 방지, 발산↓'],
    ['보호 윈도우', '내부 광학계 보호', '가장 중요한 소모품'],
    ['미러', '빔 방향 변경', '유전체(고LIDT) vs 금속(광대역)'],
    ['아이솔레이터', '역반사 차단', '고반사 재료 가공 시 필수'],
  ]);
  addPageNumber(slide, 40, TOTAL_SLIDES);
}

function slide41_lens_material() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '잘못된 렌즈 재질 = 즉시 손상');
  addStyledTable(slide, ['재질', '투과 파장', '적합 레이저', '주의'], [
    ['Fused Silica', '200nm~3.5μm', '파이버, Nd:YAG, UV', 'CO₂ 사용 금지(흡수→파손)'],
    ['ZnSe (황화아연)', '0.6~20μm', 'CO₂ (10.6μm) 전용', '독성 물질, 취급 주의'],
    ['CaF₂ (불화칼슘)', 'UV~8μm', '엑시머, UV', '고습도에 약함'],
  ]);
  slide.addText('인서트 재질(초경/CBN/다이아)을 재료에 맞춰 선택하는 것과 같은 원리', { x: 0.6, y: 5.0, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 41, TOTAL_SLIDES);
}

function slide42_collimator_expander() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '콜리메이터는 평행화, 빔 익스팬더는 확대');
  slide.addText('콜리메이터: 파이버 출사 → 발산 빔 → 평행 빔. 콜리/집속 FL 비율 = 스폿 크기 레버', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  slide.addText('빔 익스팬더 — "왜 빔을 키우는가?"', { x: 0.6, y: 2.6, w: 12.13, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addCard(slide, { x: 0.6, y: 3.2, w: 3.8, h: 3.2, title: '1. 발산각 감소', body: '빔 키우면 θ↓\n→ 장거리 전달 시\n빔 퍼짐 최소화', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 3.2, w: 3.8, h: 3.2, title: '2. 작은 스폿', body: 'd_s ∝ 1/D_beam\n→ D_beam↑ = d_s↓\n→ 에너지 밀도↑', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 3.2, w: 3.8, h: 3.2, title: '3. 광학 보호', body: '면적↑ → 단위면적 에너지↓\n→ LIDT 안전 마진 확보\n→ 고출력에서 필수', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 42, TOTAL_SLIDES);
}

function slide43_window_isolator() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '보호 윈도우 관리가 가공 안정성의 핵심');
  addCard(slide, { x: 0.6, y: 1.8, w: 5.8, h: 4.8, title: '보호 윈도우', body: '가공 헤드 최하단, 스패터/흄 차단\n\n오염 연쇄: 투과율↓ → 열흡수↑\n→ 열렌즈 강화 → 초점 이동\n→ 가공 드리프트\n\n예방적 교체가 가장 경제적', accentColor: COLORS.accent_red });
  addCard(slide, { x: 6.8, y: 1.8, w: 5.9, h: 4.8, title: '아이솔레이터', body: '고반사 재료(Cu, Al) 가공 시 필수\n\n역반사 빔 → 소스 영구 손상 위험\n(파이버 레이저 특히 취약)\n\n패러데이 아이솔레이터가 일반적\n→ 편광 회전으로 역방향 차단', accentColor: COLORS.accent_purple });
  addPageNumber(slide, 43, TOTAL_SLIDES);
}

function slide44_beam_delivery() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 전달 방식은 파장과 유연성 요구에 따라 결정');
  addStyledTable(slide, ['방식', '적합 레이저', '장점', '단점'], [
    ['광섬유', '파이버, Nd:YAG (1μm대)', '유연, 정렬 불필요, 로봇 장착', 'CO₂ 불가'],
    ['자유공간 (미러)', 'CO₂, 고출력', '고파워 전달', '정렬 민감, 진동 영향'],
    ['관절 암', 'CO₂ (다축 필요)', '다축 자유도', '유지보수, 손실 누적'],
  ]);
  slide.addText('광섬유 전달의 편의성이 파이버 레이저 시장 지배의 핵심 이유', { x: 0.6, y: 5.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_blue, italic: true });
  addPageNumber(slide, 44, TOTAL_SLIDES);
}

function slide45_processing_head() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 헤드 = 공구홀더 + 인서트에 해당');
  slide.addText('구성: 콜리메이터 → (빔 익스팬더) → 집속 렌즈 → 보호 윈도우 → 노즐', { x: 0.6, y: 1.8, w: 12.13, h: 0.5, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addStyledTable(slide, ['헤드 종류', '특성', '핵심 포인트'], [
    ['절단 헤드', '동축 가스 노즐, 얇은 스폿', '가스 압력/노즐 직경 = 품질 결정'],
    ['용접 헤드', '차폐 가스, 넓은 DOF', '초점 위치 제어 = 용입 결정'],
    ['클래딩 헤드', '파우더/와이어 피더 통합', '재료 공급-빔 동기화 필요'],
  ], { y: 2.5 });
  addPageNumber(slide, 45, TOTAL_SLIDES);
}

function slide46_focal_length() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '초점거리는 스폿 크기와 DOF의 트레이드오프');
  addStyledTable(slide, ['재료 두께', '권장 FL', '스폿', 'DOF', '에너지 밀도'], [
    ['< 6mm (박판)', '100~200 mm', '작음', '얕음', '높음'],
    ['6~25 mm', '200~300 mm', '중간', '중간', '중간'],
    ['> 25mm (후판)', '300~450 mm', '넓음', '깊음', '낮음 (보상 필요)'],
  ]);
  slide.addText('짧은 FL = 작은 공구 반경 + 짧은 돌출 = 정밀하지만 접근성 제한', { x: 0.6, y: 5.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 46, TOTAL_SLIDES);
}

function slide47_why_expand() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 확대 후 집속 = 더 작은 스폿 + 안전한 광학계');
  addCard(slide, { x: 0.6, y: 1.8, w: 3.8, h: 4.5, title: '1. 작은 스폿', body: 'd_s ∝ λ·f / D_beam\n\nD_beam 2배\n→ 스폿 1/2\n→ 에너지밀도 4배', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 1.8, w: 3.8, h: 4.5, title: '2. 발산 감소', body: 'BPP = w₀ × θ (불변)\n\n빔 키우면 θ↓\n→ 장거리 전달 유리', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 1.8, w: 3.8, h: 4.5, title: '3. 광학 보호', body: 'D 2배 → 면적 4배\n→ 단위면적 에너지 1/4\n→ LIDT 여유 확보', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 47, TOTAL_SLIDES);
}

function slide48_beam_shaping() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 성형으로 가공 품질을 능동적으로 제어한다');
  const pos = [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }];
  const cards = [
    { title: 'DOE (회절 광학 소자)', body: '빔 분할, 패턴 생성.\n멀티빔 병렬 가공 가능.', accentColor: COLORS.accent_blue },
    { title: '빔 호모지나이저', body: '가우시안 → 탑햇 변환.\n균일 열처리에 필수.', accentColor: COLORS.accent_cyan },
    { title: '링+코어 빔', body: '코어: 키홀 유지\n링: 용융풀 안정화.\n기공률 90% 감소 사례.', accentColor: COLORS.accent_yellow },
    { title: '적응 광학', body: '변형 미러 실시간 제어.\n초점 드리프트 보상.\n고비용, 고성능.', accentColor: COLORS.accent_purple },
  ];
  cards.forEach((c, i) => addCard(slide, { ...pos[i], w: 5.915, h: 2.45, ...c }));
  addPageNumber(slide, 48, TOTAL_SLIDES);
}

function slide49_galvo_ftheta() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '갈바노 스캐너: 빔을 수~수십 m/s로 조향한다');
  slide.addText('갈바노 스캐너', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: '2개 미러(X/Y) + 모터로 빔 방향 제어', options: { bullet: true } },
    { text: '관성 극소 → 극고속 위치 변경', options: { bullet: true } },
    { text: '영역: 100×100 ~ 500×500 mm', options: { bullet: true } },
    { text: '마킹, 미세가공, SLM 핵심', options: { bullet: true } },
  ], { x: 0.6, y: 2.3, w: 5.8, h: 3.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  slide.addText('f-theta 렌즈', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: '미러 각도 θ → 위치 f·θ 선형 변환', options: { bullet: true } },
    { text: '평면 초점 유지 (일반 렌즈는 구면)', options: { bullet: true } },
    { text: 'FL × 스캔 각도 = 작업 범위', options: { bullet: true } },
  ], { x: 6.8, y: 2.3, w: 5.9, h: 3.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addPageNumber(slide, 49, TOTAL_SLIDES);
}

function slide50_thermal_lensing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '고출력에서 초점이 움직이는 열렌즈 효과');
  slide.addText('원인: 광학부품 에너지 흡수 → 온도↑ → 굴절률 변화 + 열팽창 → 초점거리 변화', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addStyledTable(slide, ['대책', '방법', '효과'], [
    ['1. 예열 루틴', '가동 전 일정 시간 운전', '열 평형에서 시작'],
    ['2. 수냉 광학계', '렌즈/미러에 수냉 채널', '온도 상승 억제'],
    ['3. 저흡수 코팅', 'LIDT 높은 유전체 코팅', '흡수 최소화'],
    ['4. 보호윈도우 교체', '오염 시 주기적 교체', '열렌즈 강화 차단'],
    ['5. 적응 광학', '변형 미러 실시간 보정', '자동 초점 보상'],
  ], { y: 2.6 });
  addPageNumber(slide, 50, TOTAL_SLIDES);
}

function slide51_maintenance() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '예방적 광학 관리 = 가장 경제적인 품질 유지');
  addStyledTable(slide, ['부품', '점검 주기', '교체 기준', '클리닝'], [
    ['보호 윈도우', '매일~매주', '투과율 5%↓, 흐림', '전용 클리너 + 무진 와이프'],
    ['집속 렌즈', '월 1회', '투과율↓, 열렌즈 징후', '전용 클리너'],
    ['파이버 커넥터', '탈착 시마다', '오염/손상 즉시', '현미경 + 클리닝 키트'],
    ['미러 코팅', '분기 1회', '코팅 박리, 반사율↓', '전문 클리닝/교체'],
    ['콜리메이터', '반기 1회', '빔 품질 모니터링', '제조사 지침'],
  ]);
  addPageNumber(slide, 51, TOTAL_SLIDES);
}

function slide52_part3_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Part 3 핵심: BPP는 불변, 광학은 트레이드오프의 연속');
  slide.addText([
    { text: 'BPP = 광학 불변량. 소스가 결정, 렌즈로 불가', options: { bullet: true } },
    { text: '스폿↓ ↔ DOF↓ = 필연적 트레이드오프', options: { bullet: true } },
    { text: '보호 윈도우 관리 = 열렌즈 억제 = 가공 안정성 핵심', options: { bullet: true } },
    { text: '빔 성형으로 공정별 최적 프로파일 설계 가능', options: { bullet: true } },
  ], { x: 0.6, y: 1.8, w: 12.13, h: 4.5, fontSize: 20, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.8, valign: 'top' });
  addPageNumber(slide, 52, TOTAL_SLIDES);
}

function slide53_section4() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('하드웨어/시스템', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('레이저 시스템의 전체 구성과 주변 장치를 이해한다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide54_system_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 시스템 = 소스 + 빔 전달 + 가공 헤드 + 모션 + 제어');
  addFlowBox(slide, 0.8, 2.0, 2.0, 0.8, '전원 공급', COLORS.bg_dark);
  addFlowArrow(slide, 2.8, 2.4, 3.3, 2.4);
  addFlowBox(slide, 3.3, 2.0, 2.2, 0.8, '레이저 소스', COLORS.accent_blue);
  addFlowArrow(slide, 5.5, 2.4, 6.0, 2.4);
  addFlowBox(slide, 6.0, 2.0, 2.2, 0.8, '빔 전달 광학계', COLORS.accent_cyan);
  addFlowArrow(slide, 8.2, 2.4, 8.7, 2.4);
  addFlowBox(slide, 8.7, 2.0, 2.0, 0.8, '가공 헤드', COLORS.accent_yellow);
  addFlowArrow(slide, 10.7, 2.4, 11.2, 2.4);
  addFlowBox(slide, 11.2, 2.0, 1.8, 0.8, '피가공물', COLORS.accent_red);
  addFlowBox(slide, 3.3, 3.3, 2.2, 0.7, '냉각기 (Chiller)', '718096');
  addFlowArrow(slide, 4.4, 2.8, 4.4, 3.3);
  addFlowBox(slide, 6.5, 3.3, 2.5, 0.7, '모션 시스템', '718096');
  addFlowBox(slide, 3.0, 4.5, 2.5, 0.7, '제어기 (CNC/PLC)', COLORS.bg_dark);
  addFlowBox(slide, 6.5, 4.5, 2.0, 0.7, '안전 (인터록)', COLORS.accent_red);
  addFlowBox(slide, 9.5, 4.5, 2.0, 0.7, '집진기', '718096');
  slide.addText('절삭 대응: 소스=스핀들, 빔전달=주축→공구홀더, 가공헤드=인서트, 모션=CNC축', { x: 0.6, y: 5.8, w: 12.13, h: 0.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 54, TOTAL_SLIDES);
}

function slide55_motion() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모션 시스템: 정밀도/속도/유연성 트레이드오프');
  addStyledTable(slide, ['기준', '갠트리', '갈바노 스캐너', '5축 로봇'], [
    ['정밀도', '±0.02~0.05mm', '±수 μm', '±0.1~0.5mm'],
    ['속도', '~120 m/min', '수~수십 m/s', '중간'],
    ['영역', '수백mm~수m', '100~500mm²', '반경 내 전방향'],
    ['용도', '대면적 평판 절단', '마킹, 미세가공', '복잡 3D'],
    ['구동', '볼스크류/선형모터', '전류→미러 각도', '서보+감속기'],
  ]);
  addPageNumber(slide, 55, TOTAL_SLIDES);
}

function slide56_pso() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'PSO: 코너 감속에서도 균일한 가공 보장');
  addCard(slide, { x: 0.6, y: 1.8, w: 5.8, h: 4.5, title: '문제: 시간 기반 제어', body: '일정 시간 간격 레이저 발사\n\n코너 감속 시:\n이동 거리↓ + 에너지 동일\n→ 단위 길이당 에너지↑\n→ 코너 번인(Burn)\n→ 불균일 가공', accentColor: COLORS.accent_red });
  addCard(slide, { x: 6.8, y: 1.8, w: 5.9, h: 4.5, title: '해결: PSO', body: '위치 기반: x mm마다 레이저 발사\n→ 속도 무관 균일 가공\n\nEtherCAT 실시간 통신\nμs 수준 위치 피드백\n\n비유: mm당 칩 로드 일정 유지', accentColor: COLORS.accent_cyan });
  addPageNumber(slide, 56, TOTAL_SLIDES);
}

function slide57_control() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 제어: 게이팅, 변조, 아날로그의 조합');
  addStyledTable(slide, ['방식', '신호', '기능', '특성'], [
    ['게이팅', '디지털 ON/OFF', '레이저 발사/정지', '가장 기본'],
    ['PWM 변조', '디지털 펄스', '듀티 사이클 출력 조절', '빠른 변경'],
    ['아날로그', '0~10V / 4~20mA', '비례 출력 제어', '연속 조절'],
  ]);
  slide.addText([
    { text: '인터페이스:', options: { bold: true } },
    { text: ' RS232(레거시) | EtherCAT(산업 표준, PSO 적합) | 아날로그(단순 출력)', options: {} },
  ], { x: 0.6, y: 5.0, w: 12.13, h: 0.8, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 57, TOTAL_SLIDES);
}

function slide58_cooling() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '냉각수 관리 실수가 레이저 고장의 주요 원인');
  addStyledTable(slide, ['항목', '파이버 레이저', 'CO₂ 레이저'], [
    ['냉각수', '탈이온수 (DI)', '증류수'],
    ['전도도', '<1~5 μS/cm', '<10 μS/cm'],
    ['교체 주기', '3개월', '3개월'],
    ['배관 세정', '6개월', '6개월'],
    ['온도', '15~25°C', '15~25°C'],
  ]);
  slide.addShape('roundRect', { x: 0.6, y: 5.8, w: 5.8, h: 0.7, rectRadius: 0.06, fill: { color: 'FFF5F5' } });
  slide.addText('수돗물 사용 금지 → 이온 오염 → 전기 단락/부식', { x: 0.8, y: 5.85, w: 5.4, h: 0.6, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red, valign: 'middle' });
  slide.addShape('roundRect', { x: 6.8, y: 5.8, w: 5.9, h: 0.7, rectRadius: 0.06, fill: { color: 'FFFFF0' } });
  slide.addText('온도 과저 → 결로(Condensation) → 광학계 오염', { x: 7.0, y: 5.85, w: 5.5, h: 0.6, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow, valign: 'middle' });
  addPageNumber(slide, 58, TOTAL_SLIDES);
}

function slide59_assist_gas() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '어시스트 가스: 용융물 제거 + 산화 제어');
  addStyledTable(slide, ['가스', '적합 재료', '메커니즘', '압력'], [
    ['O₂', '연강, 탄소강', '발열 산화 반응', '3~10 bar'],
    ['N₂', 'SUS, 알루미늄', '비반응, 블로', '15~30 bar'],
    ['압축 공기', '박판 ≤6mm', 'N₂+O₂ 혼합', '3~8 bar'],
    ['Ar', '티타늄, 특수합금', '완전 불활성', '2~5 bar'],
  ]);
  slide.addText('압력은 Linde 기준. 노즐/장비/두께별로 차이 큼', { x: 0.6, y: 5.5, w: 12.13, h: 0.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_tertiary, italic: true });
  addPageNumber(slide, 59, TOTAL_SLIDES);
}

function slide60_fume_safety() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 흄은 나노입자 — 집진 필수 + 안전 등급');
  slide.addText('집진: 프리필터 → HEPA → 활성탄 3단 구성', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('레이저 안전 등급 (IEC 60825)', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addStyledTable(slide, ['Class', '위험도', '필요 조치'], [
    ['1', '안전', '없음 (인클로저 내장)'],
    ['2', '저위험', '눈 보호 (가시광)'],
    ['3B', '위험', '보호 고글 필수'],
    ['4', '매우 위험', '인클로저+인터록+고글+교육'],
  ], { x: 6.8, y: 2.3, w: 5.9 });
  slide.addText('산업용 가공 레이저 = 대부분 Class 4', { x: 0.6, y: 6.2, w: 12.13, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_red, italic: true });
  addPageNumber(slide, 60, TOTAL_SLIDES);
}

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

slide61_section5(); slide62_absorption_diagram(); slide63_absorption1();
slide64_absorption2(); slide65_intensity_stages(); slide66_cutting();
slide67_welding(); slide68_weld_defects(); slide69_other_processes();
slide70_ultrashort_cold(); slide71_spec_sheet1(); slide72_spec_sheet2();
slide73_section6(); slide74_troubleshoot1(); slide75_troubleshoot2();
slide76_troubleshoot_system(); slide77_reverse_decision1(); slide78_reverse_decision2();
slide79_e2e_flow1(); slide80_e2e_flow2(); slide81_findings1();
slide82_findings2(); slide83_next_topics(); slide84_summary();
slide85_closing();

const path = require('path');
const outPath = path.join(__dirname, 'laser-fundamentals-guide.pptx');
pptx.writeFile({ fileName: outPath })
  .then(() => console.log('저장 완료:', outPath))
  .catch(err => console.error('저장 실패:', err));