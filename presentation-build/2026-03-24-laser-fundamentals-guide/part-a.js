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
