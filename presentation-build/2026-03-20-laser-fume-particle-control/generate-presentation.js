const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== 디자인 시스템 상수 =====
const COLORS = {
  bg_primary: 'FFFFFF',
  bg_secondary: 'F5F7FA',
  bg_dark: '1A1F36',
  text_primary: '1A1F36',
  text_secondary: '4A5568',
  text_tertiary: '718096',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7',
  accent_cyan: '00D4AA',
  accent_yellow: 'FFB020',
  accent_red: 'FF6B6B',
  accent_purple: '8B5CF6',
};

const CHART_STYLE = {
  base: {
    showTitle: true,
    titleFontFace: 'Pretendard',
    titleFontSize: 14,
    titleColor: COLORS.text_primary,
    showLegend: true,
    legendFontFace: 'Pretendard',
    legendFontSize: 9,
    legendColor: COLORS.text_secondary,
    catAxisLabelFontFace: 'Pretendard',
    catAxisLabelFontSize: 10,
    catAxisLabelColor: COLORS.text_tertiary,
    valAxisLabelFontFace: 'Pretendard',
    valAxisLabelFontSize: 10,
    valAxisLabelColor: COLORS.text_tertiary,
  },
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

const FONTS = {
  title: { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body: { fontFace: 'Pretendard', bold: false },
  caption: { fontFace: 'Pretendard Light', bold: false },
  serif: { fontFace: 'ChosunNm', bold: false },
  kpi: { fontFace: 'Pretendard Black', bold: true },
  deco: { fontFace: 'Pretendard Thin', bold: false },
};

const TABLE_STYLE = {
  header: {
    bold: true,
    fill: { color: COLORS.bg_dark },
    color: COLORS.text_on_dark,
    fontFace: 'Pretendard',
    fontSize: 11,
    align: 'center',
    valign: 'middle'
  },
  cell: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    valign: 'middle'
  },
  cellAlt: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    fill: { color: COLORS.bg_secondary },
    valign: 'middle'
  },
  cellRight: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    align: 'right',
    valign: 'middle'
  },
  cellCenter: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    align: 'center',
    valign: 'middle'
  }
};

const TABLE_OPTIONS = {
  x: 0.6,
  y: 1.8,
  w: 12.13,
  border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
  autoPage: false,
  margin: [5, 8, 5, 8]
};

// ===== 헬퍼 함수 =====
let slideCount = 0;

function addTitleBar(slide, title, subtitle) {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 11.5, h: 0.6,
    fontSize: 24, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.25, w: 10, h: 0.4,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_tertiary
    });
  }
}

function addPageNumber(slide) {
  slideCount++;
  slide.addText(`${slideCount}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right'
  });
}

function addStyledTable(slide, headers, dataRows, opts = {}) {
  const rows = [];
  rows.push(headers.map(h => ({ text: h, options: { ...TABLE_STYLE.header } })));
  dataRows.forEach((row, i) => {
    const isAlt = i % 2 === 1;
    const baseStyle = isAlt ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    rows.push(row.map(cell => {
      if (typeof cell === 'string') return { text: cell, options: { ...baseStyle } };
      return { text: cell.text, options: { ...baseStyle, ...cell.options } };
    }));
  });
  slide.addTable(rows, { ...TABLE_OPTIONS, ...opts });
}

function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 }
  });
  slide.addShape('rect', {
    x: x + 0.02, y, w: w - 0.04, h: 0.06,
    fill: { color: accentColor || COLORS.accent_blue }
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.35,
    fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 12, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
}

function addStyledChart(slide, type, chartData, opts = {}) {
  const typeMap = {
    BAR: pptx.charts.BAR, LINE: pptx.charts.LINE, PIE: pptx.charts.PIE,
    DOUGHNUT: pptx.charts.DOUGHNUT, AREA: pptx.charts.AREA,
    RADAR: pptx.charts.RADAR
  };
  const defaults = {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    ...CHART_STYLE.base,
    chartColors: CHART_STYLE.colors.slice(0, chartData.length || 6),
    ...opts
  };
  if (type === 'BAR') {
    defaults.barGapWidthPct = 80;
    defaults.catAxisOrientation = 'minMax';
    defaults.valAxisOrientation = 'minMax';
  }
  slide.addChart(typeMap[type], chartData, defaults);
}

// ===== 슬라이드 생성 =====

// ── Slide 1: Title ──
function createSlide01() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('레이저 싱귤레이션\n흄/파티클 2차 오염 제어 전략', {
    x: 1.5, y: 2.5, w: 10.33, h: 1.5,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.2
  });
  slide.addText('몰딩 기판 패키지 어레이의 피코초 레이저 절단 공정 최적화', {
    x: 1.5, y: 4.2, w: 10.33, h: 0.6,
    fontSize: 18, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center'
  });
  slide.addText('2026.03.20  |  Deep Research Report', {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center'
  });
  addPageNumber(slide);
}

// ── Slide 2: Executive Summary ──
function createSlide02() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3중 방어 체계가 최적의 오염 제어 전략이다');
  const bullets = [
    { text: '구리와 EMC의 어블레이션 임계값 ~10배 차이가 근본 문제 → 층별 적응형 파라미터 전략 필요', options: { bullet: true, indentLevel: 0 } },
    { text: '"발생 억제 + 즉시 배출 + 재증착 방지"의 3중 방어가 최적 전략', options: { bullet: true, indentLevel: 0 } },
    { text: 'ps 레이저가 생산성과 품질의 최적 균형점 (ns 대비 debris 현저 감소, fs 대비 비용 유리)', options: { bullet: true, indentLevel: 0 } },
    { text: '다층 구조의 재료 인터페이스 전환점이 최대 오염 위험 구간', options: { bullet: true, indentLevel: 0 } },
    { text: '과도한 어시스트 가스 압력은 Mach Stem Disk 형성으로 역효과', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6, paraSpaceAfter: 10, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 3: Problem Definition ──
function createSlide03() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구리와 EMC의 임계값 ~10배 차이가 근본 문제이다');
  slide.addText('반도체 패키지 레이저 싱귤레이션의 3대 도전', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.4,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });
  const items = [
    { text: '어블레이션 부산물(흄, 파티클)이 인접 다이/패키지에 재증착 → 전기적 단락, 접합 불량, 외관 불량', options: { bullet: true, indentLevel: 0 } },
    { text: '다양한 재료(Cu + EMC + FR-4)가 혼합된 구조로 부산물 조성이 복잡', options: { bullet: true, indentLevel: 0 } },
    { text: '생산성(처리 속도)과 품질(오염 최소화) 사이의 트레이드오프', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(items, {
    x: 0.6, y: 2.3, w: 12.13, h: 2.5,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6, paraSpaceAfter: 10, valign: 'top'
  });
  // Key insight box
  slide.addShape('roundRect', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.3, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', {
    x: 0.6, y: 5.0, w: 0.08, h: 1.3,
    fill: { color: COLORS.accent_red }
  });
  slide.addText('핵심 인사이트: 단일 파라미터 세트로는 Cu(문턱값 0.05-0.07 J/cm²)와 EMC(문턱값 0.23-0.55 J/cm²) 양쪽 모두에서 부산물을 최소화할 수 없다. 층별 적응형 파라미터 전략이 필수이다.', {
    x: 0.9, y: 5.1, w: 11.63, h: 1.1,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_primary,
    lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 4: KPI Dashboard ──
function createSlide04() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '리서치 핵심 수치');
  const kpis = [
    { value: '3중', label: '방어 체계', sub: '발생억제 + 배출 + 방지' },
    { value: '~10x', label: '임계값 차이', sub: 'Cu vs EMC 어블레이션' },
    { value: '5개', label: '핵심 결론', sub: '3 Researcher + Critic' },
    { value: '12개', label: '근거 검증', sub: '신뢰도 매트릭스' },
  ];
  const n = kpis.length;
  const gap = 0.3;
  const cardW = (12.13 - gap * (n - 1)) / n;
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: 1.8, w: cardW, h: 2.2, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });
    slide.addText(kpi.value, {
      x: x + 0.15, y: 1.9, w: cardW - 0.3, h: 1.0,
      fontSize: 44, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: CHART_STYLE.colors[i % 6], align: 'center'
    });
    slide.addText(kpi.label, {
      x: x + 0.15, y: 2.9, w: cardW - 0.3, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, align: 'center'
    });
    slide.addText(kpi.sub, {
      x: x + 0.15, y: 3.3, w: cardW - 0.3, h: 0.4,
      fontSize: 11, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center'
    });
  });
  addPageNumber(slide);
}

// ── Slide 5: Research Structure ──
function createSlide05() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '본 리서치는 3개 관점에서 병렬 조사되었다');
  const cards = [
    { title: 'Researcher 1', body: '레이저 파라미터 최적화\n\n펄스폭, 파장, 플루언스, 반복률,\n빔 프로파일, 멀티패스, 버스트 모드', color: CHART_STYLE.colors[0] },
    { title: 'Researcher 2', body: '배출 및 제거 시스템\n\n어시스트 가스, 흡입/배기,\n보호 필름, 세정, 인라인 모니터링', color: CHART_STYLE.colors[1] },
    { title: 'Researcher 3', body: '재료별 어블레이션 특성\n\nCu, EMC, FR-4, 솔더마스크,\n다층 인터페이스, 오염 메커니즘', color: CHART_STYLE.colors[2] },
    { title: 'Critic', body: '교차 검증 (6개 체크리스트)\n\n도메인 적용성, 수치 근거,\n상충점, 누락, 확신도, 문제 정의', color: CHART_STYLE.colors[3] },
  ];
  const CARD_W = 5.915, CARD_H = 2.45, GAP = 0.3;
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: CARD_W, h: CARD_H,
      title: card.title, body: card.body, accentColor: card.color
    });
  });
  addPageNumber(slide);
}

// ── Slide 6: Section 1 Divider ──
function createSlide06() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('01', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('어블레이션 메커니즘과\n부산물 생성', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('재료별 어블레이션 거동과 부산물 특성을 이해하여\n효과적인 제어 전략의 기반을 마련한다', {
    x: 6.0, y: 3.9, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// ── Slide 7: Pulse Width Comparison Table ──
function createSlide07() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '펄스폭에 따라 어블레이션 메커니즘이 근본적으로 달라진다');
  addStyledTable(slide,
    ['펄스폭', '메커니즘', '열영향부 (HAZ)', '부산물 특성', '비용/생산성'],
    [
      ['ns (>1 ns)', '열적 어블레이션\n(photothermal)', '넓음\n(40+ um)', '마이크론급 구형 입자\n용융 재증착, 탄화', '낮은 비용\n높은 속도'],
      ['ps (1-100 ps)', '준-냉간 어블레이션\n(플라즈마 플룸 지배)', '매우 좁음\n(수 um)', '나노~서브마이크론 입자\nns 대비 현저히 적은 debris', '중간 비용\n중간 속도'],
      ['fs (<1 ps)', '냉간 어블레이션\n(cold ablation)', '극소\n(<2 um)', '가장 작은 나노입자\n응집체 형성 경향', '높은 비용\n낮은 속도'],
    ],
    { y: 1.8, rowH: [0.4, 1.0, 1.0, 1.0] }
  );
  addPageNumber(slide);
}

// ── Slide 8: ps Laser Optimal Balance ──
function createSlide08() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'ps 레이저가 생산성과 품질의 최적 균형점이다');
  // Radar chart
  addStyledChart(slide, 'RADAR',
    [
      { name: 'ns 레이저', labels: ['Debris 감소', '가공 속도', '비용 효율', 'HAZ 최소화', '표면 품질'], values: [30, 90, 90, 20, 30] },
      { name: 'ps 레이저', labels: ['Debris 감소', '가공 속도', '비용 효율', 'HAZ 최소화', '표면 품질'], values: [75, 65, 65, 80, 75] },
      { name: 'fs 레이저', labels: ['Debris 감소', '가공 속도', '비용 효율', 'HAZ 최소화', '표면 품질'], values: [85, 30, 30, 95, 90] },
    ],
    { x: 0.6, y: 1.8, w: 7.28, h: 5.0, showTitle: false, showLegend: true, legendPos: 'b' }
  );
  // Insight panel
  slide.addShape('roundRect', {
    x: 8.18, y: 1.8, w: 4.55, h: 5.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('핵심 판단 기준', {
    x: 8.38, y: 1.95, w: 4.15, h: 0.4,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary
  });
  const insights = [
    '• ps는 ns 대비 debris를 현저히 감소시키면서도 실용적 가공 속도를 유지',
    '• fs는 HAZ 극소화에 최적이지만 장비 비용 2-3배, 속도 저하',
    '• 산업 현장에서 ps가 de facto 표준으로 자리잡는 추세',
    '• 품질 최우선 시 fs, 범용 생산 시 ps 선택',
  ];
  slide.addText(insights.join('\n\n'), {
    x: 8.38, y: 2.5, w: 4.15, h: 4.1,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 9: fs Paradox ──
function createSlide09() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'fs 레이저는 HAZ를 줄이지만 나노파티클 수는 증가한다');
  // Left column
  slide.addText('Cold Ablation의 통념', {
    x: 0.6, y: 1.8, w: 5.865, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });
  const leftBullets = [
    { text: 'fs 레이저 = "깨끗한 가공" 으로 알려져 있음', options: { bullet: true } },
    { text: 'HAZ < 2 um (실질적 열영향 없음)', options: { bullet: true } },
    { text: '용융 재증착(recast) 거의 없음', options: { bullet: true } },
    { text: '표면 rim 형성 최소', options: { bullet: true } },
  ];
  slide.addText(leftBullets, {
    x: 0.6, y: 2.35, w: 5.865, h: 2.5,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top'
  });

  // Right column
  slide.addText('실제 발견: 파티클 역설', {
    x: 6.865, y: 1.8, w: 5.865, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_red
  });
  const rightBullets = [
    { text: 'fs는 오히려 더 많은 수의 나노파티클 생성', options: { bullet: true } },
    { text: '개별 입자는 수십 nm이지만 응집체 5-10 um', options: { bullet: true } },
    { text: '높은 수밀도(number density)로 포집 난이도 증가', options: { bullet: true } },
    { text: '"깨끗함"은 HAZ 관점에서만 사실', options: { bullet: true } },
  ];
  slide.addText(rightBullets, {
    x: 6.865, y: 2.35, w: 5.865, h: 2.5,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top'
  });

  // Bottom insight
  slide.addShape('roundRect', {
    x: 0.6, y: 5.2, w: 12.13, h: 1.3, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', {
    x: 0.6, y: 5.2, w: 0.08, h: 1.3,
    fill: { color: COLORS.accent_yellow }
  });
  slide.addText('의사결정 포인트: fs 선택 시 HAZ 최소화 이점은 확실하지만, 나노파티클 관리를 위한 추가적인 흡입/필터 시스템 강화가 필요하다. 파티클 관리 부담까지 고려하면 ps가 총합적으로 유리한 경우가 많다.', {
    x: 0.9, y: 5.3, w: 11.63, h: 1.1,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_primary, lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 10: Ablation Threshold Table ──
function createSlide10() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구리와 EMC의 어블레이션 임계값이 ~10배 차이난다');
  addStyledTable(slide,
    ['재료', '펄스폭', '파장', '문턱값 플루언스', '출처'],
    [
      ['구리', '0.9 ps', '532 nm', '0.05-0.07 J/cm²', 'MDPI Materials 2022'],
      ['구리', '6 ps', '532 nm', '~0.07 J/cm²', 'MDPI Materials 2022'],
      ['FR-4', '0.9 ps', '532 nm', '0.52-0.55 J/cm²', 'MDPI Materials 2022'],
      ['FR-4', '6 ps', '532 nm', '0.23-0.26 J/cm²', 'MDPI Materials 2022'],
      ['에폭시(CFRP)', 'USP', '1064 nm', '16.3 J/cm²', 'PMC 7763314'],
    ],
    { y: 1.8, rowH: [0.4, 0.35, 0.35, 0.35, 0.35, 0.35] }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 4.6, w: 12.13, h: 1.8, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', {
    x: 0.6, y: 4.6, w: 0.08, h: 1.8,
    fill: { color: COLORS.accent_red }
  });
  slide.addText([
    { text: '근본적 도전: ', options: { bold: true, color: COLORS.text_primary } },
    { text: '구리 문턱값(0.05-0.07 J/cm²)과 FR-4/EMC 문턱값(0.23-0.55 J/cm²)의 ~10배 차이는 하나의 플루언스로 모든 재료를 최적 절단하기 어렵다는 것을 의미한다. 8 J/cm² 이상 고플루언스에서는 "두 번째 어블레이션 체제"가 나타나 부산물이 급증한다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 4.7, w: 11.63, h: 1.6,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 11: Cu vs EMC ──
function createSlide11() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구리 vs EMC: 상반된 어블레이션 거동');
  // Left column - Cu
  slide.addShape('roundRect', {
    x: 0.6, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 }
  });
  slide.addShape('rect', { x: 0.62, y: 1.8, w: 5.825, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('구리 (Cu)', {
    x: 0.8, y: 1.95, w: 5.465, h: 0.4,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  const cuBullets = [
    { text: '전도성 나노파티클 → 전기적 단락 최대 위험', options: { bullet: true } },
    { text: 'CuO/Cu₂O 산화물 형성 (자기제한 5.5nm)', options: { bullet: true } },
    { text: '높은 열전도율 → 열소산 빠름', options: { bullet: true } },
    { text: '낮은 어블레이션 문턱값 (0.05-0.07 J/cm²)', options: { bullet: true } },
    { text: 'N₂ assist gas로 산화 방지 필수', options: { bullet: true } },
  ];
  slide.addText(cuBullets, {
    x: 0.8, y: 2.5, w: 5.465, h: 3.8,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6, valign: 'top'
  });

  // Right column - EMC
  slide.addShape('roundRect', {
    x: 6.865, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 }
  });
  slide.addShape('rect', { x: 6.885, y: 1.8, w: 5.825, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('EMC (Epoxy Molding Compound)', {
    x: 7.065, y: 1.95, w: 5.465, h: 0.4,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });
  const emcBullets = [
    { text: '유기 VOC 흄 + 실리카 필러 이원적 부산물', options: { bullet: true } },
    { text: '페놀, 비스페놀A 유도체 등 유해 VOC 발생', options: { bullet: true } },
    { text: '필러 크기가 어블레이션 효율 좌우', options: { bullet: true } },
    { text: '높은 어블레이션 문턱값 (0.23-0.55 J/cm²)', options: { bullet: true } },
    { text: 'Chemical deflash + waterjet 후세정 필수', options: { bullet: true } },
  ];
  slide.addText(emcBullets, {
    x: 7.065, y: 2.5, w: 5.465, h: 3.8,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 12: Multi-layer Interface ──
function createSlide12() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '다층 인터페이스 전환점이 최대 오염 위험 구간이다');
  const bullets = [
    { text: '에너지 흡수 특성 급변: 유기물(낮은 임계값) → 금속(높은 임계값) 전환 시 과잉 에너지가 폭발적 파티클 방출 유발', options: { bullet: true } },
    { text: '혼합 부산물 생성: Cu 나노파티클 + 에폭시 탄화물 + 실리카 필러 복합 debris → 단일 세정법으로 제거 곤란', options: { bullet: true } },
    { text: '재증착 복합 오염: 전도성(Cu) + 절연성(SiO₂) + 유기(탄화물) 파티클 혼재 → 전기적 거동 예측 불가', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.0,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 10, valign: 'top'
  });
  // Bottom insight
  slide.addShape('roundRect', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.5, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', { x: 0.6, y: 5.0, w: 0.08, h: 1.5, fill: { color: COLORS.accent_purple } });
  slide.addText([
    { text: '대응 전략: ', options: { bold: true, color: COLORS.text_primary } },
    { text: '인터페이스 통과 시 에너지를 점진적으로 조정하는 공정 설계 수준의 접근 필요. 레이저 파라미터와 세정 기술 각각의 최적화만으로는 해결되지 않는다.\n출처: ScienceDirect 2025, 구리/기판 다층 구조 레이저 선택적 제거 연구', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 5.1, w: 11.63, h: 1.3,
    fontSize: 13, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 13: 4 Materials Card Grid ──
function createSlide13() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 재료가 각각 다른 부산물을 생성한다');
  const cards = [
    { title: 'Cu (구리)', body: '• 전도성 나노파티클\n• CuO/Cu₂O 산화물\n• 전기적 단락 최대 위험\n• N₂ 분위기 필수' },
    { title: 'EMC (에폭시 몰딩)', body: '• VOC 흄 + SiO₂ 파티클\n• 탄화 잔류물\n• 필러 크기 의존적\n• Chemical deflash 필수' },
    { title: 'FR-4 (기판)', body: '• 유리섬유 분진\n• 에폭시 VOC\n• 극단적 열적 차이\n• UV 레이저 권장' },
    { title: '솔더마스크', body: '• 저분자 유기 VOC\n• Smear 잔류물\n• UV 광화학 분해 최적\n• 선택적 제거 가능' },
  ];
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i % 6]
    });
  });
  addPageNumber(slide);
}

// ── Slide 14: EMC Filler Size ──
function createSlide14() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'EMC 필러 크기가 어블레이션 전략 자체를 좌우한다');
  addStyledTable(slide,
    ['어블레이션 메커니즘', '플루언스 범위', '필러 거동', '부산물 특성'],
    [
      ['증발 (Evaporation)', '저플루언스', '수지만 제거, 필러 잔류', '유기 VOC 위주, 필러 노출'],
      ['직접 방출 (Direct Ejection)', '고플루언스', '필러 입자 통째로 방출', '대형 파티클, 높은 제거율'],
      ['전이 구간 (Transition)', '중간', '두 메커니즘 혼합', '혼합 부산물, 예측 곤란'],
    ],
    { y: 1.8, rowH: [0.4, 0.7, 0.7, 0.7] }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 4.6, w: 12.13, h: 1.8, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', { x: 0.6, y: 4.6, w: 0.08, h: 1.8, fill: { color: COLORS.accent_yellow } });
  slide.addText([
    { text: '핵심 발견 (Zhang & Shin, J. Manuf. Process, 2025): ', options: { bold: true, color: COLORS.text_primary } },
    { text: '큰 필러의 EMC는 동일 조건에서 어블레이션 효율이 낮으며, 직접 방출 개시에 더 높은 레이저 파워가 필요하다. EMC 재료 사양(필러 크기/함량)이 레이저 공정 파라미터의 독립 변수임이 확인되었다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 4.7, w: 11.63, h: 1.6,
    fontSize: 13, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 15: Section 2 Divider ──
function createSlide15() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('레이저 파라미터 최적화로\n발생을 억제한다', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('1선 방어: 레이저 파라미터 조정으로 흄/파티클 발생 자체를 최소화', {
    x: 6.0, y: 3.9, w: 6.73, h: 0.8,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// ── Slide 16: Wavelength Comparison ──
function createSlide16() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '파장 선택이 구리 흡수율과 EMC 분해 방식을 결정한다');
  addStyledTable(slide,
    ['파장', '구리 흡수율', 'EMC/에폭시 메커니즘', '부산물 특성', '권장 용도'],
    [
      ['IR (1064 nm)', '낮음 (높은 반사율)', '열적 분해 지배', '넓은 HAZ, 탄화, 많은 debris', '비권장'],
      ['Green (532 nm)', '중~높음', '열적+광화학 혼합', '적절한 HAZ, 깨끗한 절단', '복합재료 실용적 최적'],
      ['UV (355 nm)', '높음', '광화학 어블레이션 지배', '최소 HAZ, 최소 debris', '최고 품질 (비용 높음)'],
    ],
    { y: 1.8, rowH: [0.4, 0.7, 0.7, 0.7] }
  );
  slide.addText('출처: Tunna et al. (구리 파장별 효율), Semiconductor Digest 2008, Spectra-Physics Application Note', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 17: 532nm Green Optimal ──
function createSlide17() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '532nm Green 레이저가 복합재료에 실용적 최적이다');
  const bullets = [
    { text: '구리에서 어블레이션 효율이 가장 높음 (Tunna et al. 연구)', options: { bullet: true } },
    { text: '1064nm에서는 구리 반사율이 높아 비효율적, 355nm에서는 플라즈마 차폐 효과 증가', options: { bullet: true } },
    { text: 'Spectra-Physics Talon GR70 (532nm, 70W)으로 Cu/PI/Cu FPCB 절단 시 "debris와 용융물이 특히 주목할 만큼 없었다"', options: { bullet: true } },
    { text: 'UV 대비 비용 효과적이면서 Cu와 유기물 모두에 합리적 성능', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.5,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText([
    { text: '주의: ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: '"532nm 최적"은 Nd:YAG ns 레이저 기반 데이터이다. ps 레이저에서는 플라즈마 차폐 패턴이 달라질 수 있으며, ps 레이저에서의 파장별 구리 어블레이션 효율 비교 데이터는 제한적이다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.8, y: 5.55, w: 11.73, h: 0.9,
    fontSize: 12, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 18: Optimal Fluence ──
function createSlide18() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '문턱값의 e²배 근처에서 어블레이션 효율이 최대가 된다');
  const bullets = [
    { text: 'Nolte et al.의 이론: 최적 플루언스 = e² × Fth (문턱값의 약 7.4배)', options: { bullet: true } },
    { text: '이보다 높으면: 과잉 에너지가 열로 전환 → 용융/비산/재증착 증가', options: { bullet: true } },
    { text: '이보다 낮으면: 어블레이션 속도 저하 → 생산성 감소', options: { bullet: true } },
    { text: '구리 최적 플루언스: ~e² × 0.06 ≈ 0.44 J/cm² (이론적)', options: { bullet: true } },
    { text: '구리에서 8 J/cm² 이상: "두 번째 어블레이션 체제" → 열침투 깊이 지배, 부산물 급증', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.5,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addText('출처: MDPI Materials 15(11):3932, 2022; SPIE 2015, "Understanding laser ablation efficiency"', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 19: Adaptive Parameter ──
function createSlide19() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '단일 파라미터로 Cu와 EMC 모두를 최적화할 수 없다');
  slide.addText('적응형 파라미터 전략', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.4,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  addStyledTable(slide,
    ['절단 층', '플루언스', '반복률', '이유'],
    [
      ['Cu 층 진입', '높은 플루언스\n(~0.4 J/cm²)', '100-300 kHz', '구리의 높은 반사율 + 낮은 문턱값 대응'],
      ['EMC 층 전환', '낮은 플루언스', '200-500 kHz', '유기물의 낮은 문턱값, 탄화 방지'],
      ['인터페이스 통과', '점진적 조정', '적응형', '혼합 debris 최소화'],
    ],
    { y: 2.4, rowH: [0.4, 0.6, 0.6, 0.6] }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.5, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText([
    { text: '구현 방법: ', options: { bold: true, color: COLORS.text_primary } },
    { text: 'LIBS(레이저 유도 플라즈마 분광) 또는 광다이오드 기반 인라인 모니터링으로 재료 전환을 실시간 감지 → 파라미터 자동 전환. 현재 연구 단계이나, threshold alarm 기반 이상 감지는 즉시 구현 가능.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 5.1, w: 11.63, h: 1.3,
    fontSize: 13, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 20: Multipass vs Single ──
function createSlide20() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '저에너지 멀티패스가 고에너지 싱글패스보다 debris를 줄인다');
  // Left
  slide.addText('멀티패스 전략의 장점', {
    x: 0.6, y: 1.8, w: 5.865, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });
  const leftBullets = [
    { text: 'HAZ 및 debris 현저히 감소', options: { bullet: true } },
    { text: '깨끗한 엣지 품질', options: { bullet: true } },
    { text: '총 에너지 관점에서도 20-48% 효율적', options: { bullet: true } },
    { text: '패스 간 열소산 허용', options: { bullet: true } },
  ];
  slide.addText(leftBullets, {
    x: 0.6, y: 2.4, w: 5.865, h: 2.5,
    fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, valign: 'top'
  });
  // Right
  slide.addText('최적 조건', {
    x: 6.865, y: 1.8, w: 5.865, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  const rightBullets = [
    { text: '패스당 제거 깊이: 수~수십 um', options: { bullet: true } },
    { text: '교차 스캔(cross-hatch) 방식 권장', options: { bullet: true } },
    { text: '패키지 1mm 기준: 약 10회 패스', options: { bullet: true } },
    { text: '스캔 속도: 10-100 mm/s 범위', options: { bullet: true } },
  ];
  slide.addText(rightBullets, {
    x: 6.865, y: 2.4, w: 5.865, h: 2.5,
    fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, valign: 'top'
  });
  slide.addText('출처: Semiconductor Digest 2008, PMC 6189863 (ps 레이저), MDPI Materials 2022 (배터리 전극)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 21: Multipass Detail ──
function createSlide21() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '8-12회 다회 패스가 실용적 최적이다');
  const bullets = [
    { text: 'Semiconductor Digest (2008): "단일 패스로 1mm 관통 가능하지만, 과도한 HAZ 발생. 약 10회 패스가 속도와 엣지 품질의 최적 조합"', options: { bullet: true } },
    { text: 'PMC 6189863 (2017): ps 레이저에서 정지 빔 다회 펄스는 재증착으로 깊이 정체. 스캔 다회 패스가 재증착을 피하며 완전 관통 달성', options: { bullet: true } },
    { text: 'MDPI Materials (2022): 저플루언스 + 다회 패스가 총 에너지 관점에서도 20-48% 더 효율적', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.5,
    fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 10, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText([
    { text: '확신도 교정: ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: '위 데이터는 2008년 ns 레이저 + 배터리 전극 데이터 기반이다. ps 레이저 + EMC/Cu 복합재료에서의 최적 패스 수는 재검증이 필요하다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.8, y: 5.55, w: 11.73, h: 0.9,
    fontSize: 12, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 22: Repetition Rate ──
function createSlide22() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '반복률 100-500 kHz에서 열축적과 생산성이 균형을 이룬다');
  addStyledTable(slide,
    ['반복률 범위', '열축적 효과', '입자 차폐', '표면 품질', '권장 조건'],
    [
      ['~kHz', '미미', '없음', '기준선', '정밀 작업, 열에 민감한 재료'],
      ['~100 kHz', '시작됨', '미미', '양호', '실용적 생산 범위'],
      ['~MHz', '현저함', '마이크로초 스케일', '고반복률에서 roughness 증가 가능', '열관리 주의 필요'],
    ],
    { y: 1.8, rowH: [0.4, 0.6, 0.6, 0.6] }
  );
  slide.addText([
    { text: '인큐베이션 효과: ', options: { bold: true, color: COLORS.text_primary } },
    { text: '반복 펄스가 어블레이션 문턱값을 낮춰 더 낮은 플루언스에서도 제거가 가능해지는 긍정적 측면도 있다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 4.5, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// ── Slide 23: Beam Profile ──
function createSlide23() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Top-hat 빔 프로파일이 균일한 어블레이션을 달성한다');
  addStyledTable(slide,
    ['특성', 'Gaussian', 'Top-hat (Flat-top)'],
    [
      ['에너지 분포', '중심 피크, 주변 감소', '균일 분포'],
      ['어블레이션 균일성', '불균일 (중심 과어블레이션)', '균일한 어블레이션 깊이'],
      ['Debris/재증착', '불균일한 방출, 응집 경향', '제어된 제거, 재증착 감소'],
      ['에너지 효율', '낮음 (주변부 낭비)', '높음 (>96% throughput)'],
      ['입자 균일도', '넓은 분포', '좁은 분포 (~10-20 nm)'],
    ],
    { y: 1.8, rowH: [0.4, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  slide.addText('출처: Edmund Optics, PMC 12927492 (2026), SPIE 11107 (2019)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 24: Burst Mode ──
function createSlide24() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'MHz 버스트 모드가 대형 파티클 형성을 억제한다');
  addStyledTable(slide,
    ['모드', '특성', '표면 조도', 'Debris 효과'],
    [
      ['단일 펄스', '기준선', '기준선', '기준선'],
      ['MHz 버스트 (3-6)', '인큐베이션 효과 활용', '0.1-0.63 um', '재증착 감소'],
      ['GHz 버스트', '극단적 열축적', '0.55 um', '폴리싱 단계 적합'],
      ['Biburst (MHz+GHz)', '2단계 조합', '0.45 um', 'MHz 제거 → GHz 마무리'],
    ],
    { y: 1.8, rowH: [0.4, 0.55, 0.55, 0.55, 0.55] }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.5, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText([
    { text: '확신도: 낮음-중간. ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: '버스트 모드 데이터는 210 fs 펄스 + 구리/스테인리스강 단일 재료 기반(PMC 9890557). ps 펄스 + EMC/Cu 복합재료에서는 유사한 효과가 기대되나 정량적 검증이 필요하다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 5.1, w: 11.63, h: 1.3,
    fontSize: 12, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.4, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 25: Parameter Summary Table ──
function createSlide25() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 파라미터 종합 권장안');
  addStyledTable(slide,
    ['파라미터', '권장 범위', '근거', '확신도'],
    [
      ['펄스폭', '1-10 ps', 'ns 대비 debris 현저 감소', '높음'],
      ['파장', '532 nm 또는 355 nm', 'Cu 흡수율 + EMC 광화학', '높음 (ns 데이터)'],
      ['플루언스', 'Cu: ~0.4 / EMC: 별도', '문턱값의 e²배 근처', '중간'],
      ['패스 전략', '저에너지 8-12회', '2008 ns + 배터리 전극', '중간'],
      ['빔 프로파일', 'Top-hat 권장', '단일 재료 검증', '중간'],
      ['반복률', '100-500 kHz', '열축적 최소화 + 생산성', '높음'],
    ],
    { y: 1.8, rowH: [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  addPageNumber(slide);
}

// ── Slide 26: Section 3 Divider ──
function createSlide26() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('어시스트 가스와 흡입으로\n즉시 배출한다', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('2선 방어: 발생한 흄/파티클을 즉시 배출하여 재증착을 방지', {
    x: 6.0, y: 3.9, w: 6.73, h: 0.8,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// ── Slide 27: Assist Gas Comparison ──
function createSlide27() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'N₂가 EMC 절단용 어시스트 가스의 최적 선택이다');
  addStyledTable(slide,
    ['가스', '주요 용도', '절단 특성', '흄/파티클 영향'],
    [
      ['N₂ (질소)', '반도체 패키지 절단 표준', '비반응성, 산화 방지', '산화물 형성 억제'],
      ['Ar (아르곤)', '반응성 재료', '완전 불활성, 높은 밀도', 'Debris 배출 효과적 (비용 높음)'],
      ['Air (압축공기)', '저비용 범용', '21% O₂, 약간 산화', 'EMC 탄화물 생성 가능'],
      ['He (헬륨)', '특수 용도', '낮은 밀도, 높은 열전도', 'Compact flow 형성에 유리'],
    ],
    { y: 1.8, rowH: [0.4, 0.6, 0.6, 0.6, 0.6] }
  );
  slide.addText('출처: Riveiro et al., Materials 12(1):157, 2019 (PMC6337310)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 28: Gas Pressure Paradox ──
function createSlide28() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '과도한 가스 압력은 Mach Stem Disk를 형성하여 역효과를 낳는다');
  const bullets = [
    { text: 'Mach Stem Disk(MSD) 형성: 고압 가스가 커프 입구에서 정상충격파 형성 → 가스 침투력 감소', options: { bullet: true } },
    { text: '경계층 분리: 커프 내벽에서 가스 흐름 분리 → 용융물 제거 효율 저하', options: { bullet: true } },
    { text: '외기 혼입: 충격파와 와류가 주변 공기를 끌어들여 가스 순도 저하', options: { bullet: true } },
    { text: '실험 사례: 7 bar → 4 bar 감압 시 커프 내 질량유량 오히려 증가, 품질 개선', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.5,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText([
    { text: '도메인 주의: ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: '위 데이터는 금속 판재 절단(mm급 커프) 기반이다. 반도체 패키지 싱귤레이션(수십 um급 커프)에서 동일한 유체역학 현상이 발생하는지 검증이 필요하다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.8, y: 5.55, w: 11.73, h: 0.9,
    fontSize: 12, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 29: Nozzle Types ──
function createSlide29() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Side-blow가 Coaxial보다 debris 배출에 효과적이다');
  // Left
  slide.addText('분사 방식 비교', {
    x: 0.6, y: 1.8, w: 5.865, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  addStyledTable(slide,
    ['방식', '장점', '단점'],
    [
      ['Coaxial', '균일 가스 분포\n빔 경로 보호', '~90% 면적 차단\n(choking 발생)'],
      ['Cross-jet\nSide-blow', 'Choking 감소\n측면 debris 배출', '비대칭 가스 분포\n일측 품질 차이'],
      ['Dual/Hybrid', '빔 보호 + 배출\n동시 달성', '시스템 복잡\n유량 최적화 필요'],
    ],
    { x: 0.6, y: 2.4, w: 5.865, rowH: [0.4, 0.7, 0.7, 0.7] }
  );
  // Right
  slide.addShape('roundRect', {
    x: 6.865, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('Choking 문제', {
    x: 7.065, y: 1.95, w: 5.465, h: 0.35,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red
  });
  slide.addText('La Rocca(1991)는 coaxial nozzle에서 가스 제트의 단면적이 커프보다 훨씬 커서 ~90%의 면적 차단(area blockage)이 발생함을 발견하였다.\n\n커프 폭과 유사한 출구 직경의 비동축 노즐 사용을 권장한다.\n\n특히 반도체 패키지의 좁은 스트리트(< 100 um)에서는 side-blow 방식이 필수적이다.', {
    x: 7.065, y: 2.5, w: 5.465, h: 3.8,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 30: Patent Design ──
function createSlide30() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가스 튜브를 레이저 경로와 평행 배치하여 실시간 배출한다');
  slide.addText('특허 WO2019054945A1 (2019) — EMC 기판 직접 대상', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.4,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  const bullets = [
    { text: '가스 튜브가 레이저 빔 경로를 따라 평행하게 배치', options: { bullet: true } },
    { text: '절단 스트리트(singulation street)를 따라 압축 가스 분사', options: { bullet: true } },
    { text: '기판은 진공 지그 위에 고정 (1-3cm 깊이, 1mm 이상 폭의 트렌치)', options: { bullet: true } },
    { text: '펄스 레이저(10kHz 이상 반복률)로 다중 패스 절단', options: { bullet: true } },
    { text: '실시간으로 ablation 파티클, 수지 입자, 열 잔류물을 배출', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 2.3, w: 12.13, h: 3.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.8, w: 12.13, h: 0.8, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('이 특허 구조는 EMC 기판 절단에 직접 적용된 검증된 설계이며, 가스 튜브의 방향이 레이저 이동 방향과 일치하는 것이 핵심이다.', {
    x: 0.8, y: 5.85, w: 11.73, h: 0.7,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_primary,
    lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 31: Filter System ──
function createSlide31() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'HEPA + 활성탄 필터 조합이 SiO₂와 VOC를 동시 처리한다');
  addStyledTable(slide,
    ['필터 단계', '기능', '대상 물질', '사양'],
    [
      ['Pre-filter', '대형 입자·스파크 포집', '금속 파편, 대형 debris', '금속 메시, 세척 가능'],
      ['HEPA', '미세 입자 포집', 'SiO₂ 필러, Cu 나노파티클', '0.3 um 이상 99.97%'],
      ['활성탄', 'VOC·유기 가스 흡착', '에폭시 분해 가스, 페놀', 'EMC/솔더마스크 필수'],
      ['(선택) 정전기 집진', '하전 debris 포집', '금속 나노파티클', '추가 포집 효율 향상'],
    ],
    { y: 1.8, rowH: [0.4, 0.55, 0.55, 0.55, 0.55] }
  );
  slide.addText('EMC 절단 시 SiO₂ 미립자(HEPA)와 유기 VOC(활성탄)를 동시에 처리해야 하므로, HEPA + 활성탄 복합 시스템이 필수적이다.', {
    x: 0.6, y: 5.5, w: 12.13, h: 0.6,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_primary,
    lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// ── Slide 32: HogoMax ──
function createSlide32() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'DISCO HogoMax가 재증착 방지의 업계 표준이다');
  addStyledTable(slide,
    ['특성', '수치/설명'],
    [
      ['점도', '235 cP'],
      ['금속 불순물 (Na, K, Fe, Cu)', '< 50 ppb'],
      ['코팅 두께 (1000 rpm)', '1.58 um'],
      ['코팅 두께 (3000 rpm)', '0.82 um'],
      ['두께 편차 (1000 rpm)', '0.04 um (최대)'],
      ['제거 방법', 'DI water, 30초'],
      ['FT-IR 검증', '세정 후 잔류물 없음 확인'],
    ],
    { x: 0.6, y: 1.8, w: 6.0, rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4] }
  );
  // Right panel
  slide.addShape('roundRect', {
    x: 6.865, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addText('기술적 차별점', {
    x: 7.065, y: 1.95, w: 5.465, h: 0.35,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  slide.addText('• 표면장력 최적화로 볼 범프, 전극 등 요철부에서도 균일 코팅\n\n• 레이저 열에 의한 가교결합(cross-linking) 억제 설계 — 경쟁 제품은 열에 의해 응고되어 제거 곤란\n\n• 30초 DI water 세정 완전 제거 검증\n\n출처: DISCO TR21-02 (2022, 원문 확인 완료)', {
    x: 7.065, y: 2.5, w: 5.465, h: 3.8,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 33: Post-Cleaning Comparison ──
function createSlide33() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '후세정 기술별 특성과 적용 조건이 다르다');
  addStyledTable(slide,
    ['방법', '세정 원리', '입자 제거 능력', '반도체 적합성', '주요 특징'],
    [
      ['CO₂ 스노우', '열충격 + 기계적\n+ 용매 + 승화', '3-5 nm, 99.9%+', '높음 (건식)', '인라인 가능, 비접촉'],
      ['플라즈마', '이온화 가스\n화학적 에칭', '유기물 우수', '중간', '진공 필요, 손상 우려'],
      ['초음파', '액체 내\n캐비테이션', '마이크론급', '낮음 (습식)', '기판 손상, 재오염 위험'],
      ['Chemical deflash\n+ Waterjet', '화학 용해\n+ 고압 세정', 'EMC 잔류물 우수', '높음', 'STMicro QFN 실증'],
    ],
    { y: 1.8, rowH: [0.4, 0.75, 0.75, 0.75, 0.75] }
  );
  addPageNumber(slide);
}

// ── Slide 34: Chemical Deflash Required ──
function createSlide34() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'EMC 가공 후에는 Chemical deflash가 필수이다');
  slide.addText('STMicroelectronics QFN 패키지 실증 데이터 (Antilano & Arellano, 2019)', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.4,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue
  });
  const bullets = [
    { text: '레이저: 파장 1030 nm, 40W, 200-800 kHz, 펄스폭 800 ± 200 fs', options: { bullet: true } },
    { text: '결과: EMC 어블레이션 후 리드프레임 측벽 노출 성공, HAZ 미관찰', options: { bullet: true } },
    { text: '잔류물: 잔류 수지 및 필러 → Chemical deflash + 고압 waterjet으로 제거', options: { bullet: true } },
    { text: 'DI water 세정만으로는 EMC 탄화물과 실리카 잔류물 불충분', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 2.4, w: 12.13, h: 3.0,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', { x: 0.6, y: 5.5, w: 0.08, h: 1.0, fill: { color: COLORS.accent_cyan } });
  slide.addText('Critic 검증: R2(CO₂ 스노우)와 R3(Chemical deflash) 간 상충에서, 실제 EMC 패키지 가공 사례(STMicro)에 기반한 R3의 주장을 우선 채택하였다.', {
    x: 0.9, y: 5.55, w: 11.63, h: 0.9,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_primary,
    lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 35: Inline Monitoring ──
function createSlide35() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '인라인 파티클 모니터링으로 이상을 즉시 감지한다');
  addStyledTable(slide,
    ['기술', '대표 제품', '검출 한계', '적용 방식'],
    [
      ['에어로졸 파티클 카운터', 'PMS Airnet II', '0.2 um+', '배기 라인 실시간 농도'],
      ['인라인 파티클 센서', 'CyberOptics IPS', '0.1 um', '고출력 블루 레이저 기반'],
      ['LIBS', '연구 단계', '원소 수준', '실시간 플라즈마 조성 분석'],
      ['광다이오드', '다수 연구', '프로세스 의존', '방출 광 강도로 간접 추론'],
    ],
    { y: 1.8, rowH: [0.4, 0.55, 0.55, 0.55, 0.55] }
  );
  slide.addText([
    { text: '현재 상태: ', options: { bold: true, color: COLORS.text_primary } },
    { text: '실시간 피드백 제어(흄 농도 기반 레이저 자동 조정)는 연구 단계. 파티클 카운터 기반 threshold alarm은 즉시 구현 가능.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 5.5, w: 12.13, h: 0.6,
    fontSize: 14, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// ── Slide 36: LPBF Cross-flow ──
function createSlide36() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LPBF 크로스플로우 원리를 차용하여 가스 유동을 최적화한다');
  slide.addText('[이질 도메인: 금속 적층제조 (LPBF/SLM)]', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.35,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.accent_purple
  });
  addStyledTable(slide,
    ['LPBF 원리', 'EMC 절단 적용', '근거'],
    [
      ['Cross-flow 균일성이\n부품 품질 결정', '절단 스트리트 전체에\n균일한 가스 흐름', 'Ferrar et al.'],
      ['바이패스 시스템으로\n재순환 감소', '흄 재순환 방지용\n바이패스 설계', 'ANSYS Fluent 시뮬레이션'],
      ['노즐 최적화로\n난류 감소', '좁은 스트리트에 맞춘\n노즐 단면 설계', 'Chen et al., IHPC'],
      ['Coanda 효과 관리', '가스가 챔버 벽면을\n따라 흐르는 현상', 'IJCESEN paper'],
    ],
    { y: 2.3, w: 12.13, rowH: [0.4, 0.65, 0.65, 0.65, 0.65] }
  );
  slide.addText([
    { text: '스케일 차이 주의: ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: 'LPBF의 1.5 m/s 가스 유속은 분말층 위 수평 흐름 기준이다. EMC 절단의 좁은 커프와 상이한 debris 특성으로 최적 유속은 다를 것이다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 6.2, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// ── Slide 37: Section 4 Divider ──
function createSlide37() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('재료마다 다른\n오염 경로가 존재한다', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('2차 오염 메커니즘과 재료 의존적 대응 전략', {
    x: 6.0, y: 3.9, w: 6.73, h: 0.8,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary
  });
  addPageNumber(slide);
}

// ── Slide 38: Cu Nanoparticle Risk ──
function createSlide38() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구리 나노파티클 재증착이 전기적 단락의 최대 위험이다');
  const bullets = [
    { text: 'Cu 나노파티클이 인접 패드/트레이스 간 브릿지 형성 → 전기적 단락', options: { bullet: true } },
    { text: 'Cu₂O 자기제한 산화층: 5.5 ± 0.7 nm (Nilsson et al., in situ STEM)', options: { bullet: true } },
    { text: '100℃ 이상에서 Kirkendall void와 함께 산화 급격 진행', options: { bullet: true } },
    { text: '금속 Cu = 직접 단락, CuO/Cu₂O = 반도체 특성으로 접촉 저항 불안정', options: { bullet: true } },
    { text: '재증착 방지가 최우선, 불가피 시 산화 환경 제어가 2차 방어선', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addText('출처: Liu et al. (UC Berkeley), Nilsson et al. (in situ STEM), Girardi et al. (JMEP 2015)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// ── Slide 39: EMC Dual Byproducts ──
function createSlide39() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'EMC는 유기 VOC와 실리카 파티클을 동시에 생성한다');
  addStyledTable(slide,
    ['부산물 유형', '특성', '위험도'],
    [
      ['유기 VOC 흄', '페놀, 비스페놀A 파생물, CO, CO₂', '호흡기 자극, 작업자 안전'],
      ['탄화 잔류물 (char)', '불완전 분해 시 커프 벽면 탄소질', '표면 오염, 접착 불량'],
      ['실리카 파티클', '미분해 필러의 물리적 방출 (um급)', '비전도성, 기계적 오염'],
      ['혼합 응집체', '탄화물 + 실리카 + 수지 잔류물', '세정 난이도 증가'],
    ],
    { y: 1.8, rowH: [0.4, 0.6, 0.6, 0.6, 0.6] }
  );
  slide.addText('fs 레이저 "cold ablation"에서도 초점 체적 내 순간 800-1200 K에 도달 (Zhang & Shin, 2025, 시뮬레이션)', {
    x: 0.6, y: 5.5, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary,
    lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// ── Slide 40: FR-4 Characteristics ──
function createSlide40() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'FR-4는 유리섬유와 에폭시의 극단적 열적 차이로 선택적 어블레이션이 일어난다');
  const bullets = [
    { text: '유리섬유 E-glass 융점 ~1725℃ vs 에폭시 Tg ~130-180℃ → 극단적 차이', options: { bullet: true } },
    { text: '에폭시가 먼저 기화/분해 → VOC 흄 발생, 유리섬유가 잔류', options: { bullet: true } },
    { text: 'CO₂ 레이저(10.6 um): 탄화 경향 증가 → UV 레이저(355 nm) 권장', options: { bullet: true } },
    { text: 'LPKF CleanCut 기술: 탄화, 연소, HAZ 없이 기술적 청정도 달성', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  slide.addShape('roundRect', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }
  });
  slide.addShape('rect', { x: 0.6, y: 5.5, w: 0.08, h: 1.0, fill: { color: COLORS.accent_purple } });
  slide.addText([
    { text: '숨은 변수: ', options: { bold: true, color: COLORS.text_primary } },
    { text: 'FR-4의 수분 함량(0.10-0.20%)이 레이저 가공 시 급격한 증기화를 일으켜 디라미네이션 및 예측 불가능한 파티클 방출을 유발할 수 있다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.9, y: 5.55, w: 11.63, h: 0.9,
    fontSize: 13, fontFace: FONTS.body.fontFace, lineSpacingMultiple: 1.3, valign: 'middle'
  });
  addPageNumber(slide);
}

// ── Slide 41: Contamination Pathways ──
function createSlide41() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '2차 오염은 전기적 단락, 접합 불량, 외관 불량으로 이어진다');
  addStyledTable(slide,
    ['오염 경로', '원인 재료', '메커니즘', '위험도'],
    [
      ['Cu 나노파티클 재증착', 'Cu 리드프레임/배선', '전도성 파티클이 패드 간 브릿지', '최고'],
      ['Cu 산화물 파티클', 'Cu 어블레이션 후 산화', 'CuO/Cu₂O 조건부 전도', '높음'],
      ['탄화 잔류물', 'EMC, 솔더마스크', '탄소질 잔류물 부분 전도', '중간'],
      ['와이어본딩 불량', '본딩 패드 위 재증착', 'Au-Cu 본딩 계면 오염', '높음'],
      ['솔더링 불량', 'Cu 산화물, EMC 잔류물', '솔더 습윤성 저하', '높음'],
    ],
    { y: 1.8, rowH: [0.4, 0.55, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide);
}

// ── Slide 42: Material Strategy Table ──
function createSlide42() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '재료별로 최우선 과제와 대응 전략이 다르다');
  addStyledTable(slide,
    ['재료', '최우선 과제', '권장 레이저', '필수 후처리', '특수 고려사항'],
    [
      ['Cu', '재증착 방지\n(전기적 단락)', 'fs/ps', 'DI water + IPA', 'N₂ assist gas'],
      ['EMC', '필러 잔류물\n+ 탄화물 제거', 'fs', 'Chemical deflash\n+ waterjet', '필러 크기별 최적화'],
      ['FR-4', '유리섬유 분진\n+ 탄화 방지', 'UV (355nm)', '디스미어\n(필요 시)', 'CO₂ 회피, 수분 관리'],
      ['인터페이스', '혼합 debris\n방지', '재료별 전환', '복합 세정', '에너지 점진적 조정'],
    ],
    { y: 1.8, rowH: [0.4, 0.7, 0.7, 0.7, 0.7] }
  );
  addPageNumber(slide);
}

// ── Slide 43: Safety ──
function createSlide43() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'EMC 어블레이션 흄은 작업자 안전 위험을 수반한다');
  const bullets = [
    { text: '에폭시 수지 열분해 시 페놀, 비스페놀A 유도체, 이소시아네이트 등 유해물 발생 가능', options: { bullet: true } },
    { text: 'EMC SDS: GHS H314 — 심한 피부 화상 및 눈 손상 유발', options: { bullet: true } },
    { text: '결정질 실리카 필러 포함 시 호흡성 분진으로 규폐증 위험', options: { bullet: true } },
    { text: '국소 배기(LEV: Local Exhaust Ventilation) 없이는 VOC 노출 위험', options: { bullet: true } },
    { text: 'HEPA + 활성탄 복합 필터 시스템이 반도체 클린룸 환경의 표준', options: { bullet: true } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });
  addPageNumber(slide);
}

// ── Slide 44: Section 5 Divider ──
function createSlide44() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('05', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('3중 방어 체계로\n오염을 최소화한다', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('발생 억제 + 즉시 배출 + 재증착 방지의 통합 전략', {
    x: 6.0, y: 3.9, w: 6.73, h: 0.8,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary
  });
  addPageNumber(slide);
}

// ── Slide 45: 3-Layer Defense Timeline ──
function createSlide45() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 전→중→후 단계별 3중 방어 체계');
  // Timeline bar
  slide.addShape('rect', {
    x: 0.6, y: 1.8, w: 0.06, h: 5.0,
    fill: { color: COLORS.accent_blue }
  });
  const items = [
    { step: '가공 전', title: '3선 방어 — 재증착 방지', desc: 'HogoMax 수용성 보호 필름 코팅 (0.82-1.58 um)\ndebris 재증착의 1차 방어선' },
    { step: '가공 중 — 1선', title: '1선 방어 — 발생 억제', desc: '저에너지 멀티패스 + 적절한 펄스폭/파장\n층별 적응형 파라미터 전략' },
    { step: '가공 중 — 2선', title: '2선 방어 — 즉시 배출', desc: 'N₂ side-blow + 로컬 흡입 + 파티클 모니터링\nHEPA + 활성탄 필터' },
    { step: '가공 후', title: '3선 방어 — 후세정', desc: '1차: DI water (HogoMax 제거)\n2차: Chemical deflash + waterjet (EMC)\n보조: CO₂ 스노우 (잔류 나노파티클)' },
  ];
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', {
      x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
      fill: { color: COLORS.accent_blue }
    });
    slide.addText(item.step, {
      x: 1.0, y: itemY, w: 2.5, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard', bold: true,
      color: COLORS.accent_blue
    });
    slide.addText(item.title, {
      x: 1.0, y: itemY + 0.35, w: 11.73, h: 0.3,
      fontSize: 14, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary
    });
    slide.addText(item.desc, {
      x: 1.0, y: itemY + 0.65, w: 11.73, h: itemH - 0.8,
      fontSize: 12, fontFace: 'Pretendard',
      color: COLORS.text_secondary, valign: 'top', lineSpacingMultiple: 1.3
    });
    if (i < items.length - 1) {
      slide.addShape('line', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
        line: { color: 'E2E8F0', width: 0.5 }
      });
    }
  });
  addPageNumber(slide);
}

// ── Slide 46: 1st Line Cards ──
function createSlide46() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '1선 방어: 레이저 파라미터 4대 핵심 요소');
  const cards = [
    { title: '펄스폭', body: '1-10 ps 권장\n\nns 대비 debris 현저 감소\nfs 대비 비용/생산성 유리' },
    { title: '파장', body: '532nm Green 또는\n355nm UV\n\nCu 흡수율 + EMC 광화학' },
    { title: '플루언스', body: '문턱값의 ~e²배\n\nCu: ~0.4 J/cm²\nEMC: 별도 최적화' },
    { title: '패스 전략', body: '저에너지 8-12회\n\n교차 스캔 방식\n패스 간 열소산' },
  ];
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i % 6]
    });
  });
  addPageNumber(slide);
}

// ── Slide 47: 2nd Line Cards ──
function createSlide47() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '2선 방어: 배출 시스템 4대 구성 요소');
  const cards = [
    { title: '가스 종류', body: 'N₂ (순도 99.9%+)\n\nCu 산화 방지\nEMC 탄화물 억제' },
    { title: '분사 방식', body: 'Side-blow / Cross-jet\n\nCoaxial의 choking 회피\n커프 폭 대응 노즐' },
    { title: '로컬 흡입', body: '절단점 근방 음압 형성\n\n가스 튜브 평행 배치\n(WO2019054945A1)' },
    { title: '필터 시스템', body: 'HEPA + 활성탄 필수\n\nSiO₂ + VOC 동시 처리\n실시간 필터 모니터링' },
  ];
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i % 6]
    });
  });
  addPageNumber(slide);
}

// ── Slide 48: 3rd Line Cards ──
function createSlide48() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3선 방어: 재증착 방지 및 후세정 단계');
  const cards = [
    { title: 'HogoMax 보호 필름', body: '가공 전 코팅\n\n재증착 1차 방어선\n30초 DI water 제거' },
    { title: 'DI Water 세정', body: '가공 후 1차\n\nHogoMax + 표면 debris\n동시 제거 (30초)' },
    { title: 'Chemical Deflash', body: 'EMC 가공 시 필수\n\n잔류 수지, 실리카 필러\n+ 고압 waterjet' },
    { title: 'CO₂ 스노우', body: '보조 세정\n\n3-5 nm 파티클 제거\n건식, 비접촉, 인라인' },
  ];
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i % 6]
    });
  });
  addPageNumber(slide);
}

// ── Slide 49: Decision Guide ──
function createSlide49() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '조건별로 전략 조합이 달라져야 한다');
  addStyledTable(slide,
    ['조건', '권장 전략', '이유'],
    [
      ['Cu층 두꺼움 (>18 um)', '532nm + N₂ 필수 + 보호 필름', 'Cu debris 지배적 → 산화방지 최우선'],
      ['EMC 대형 필러 (>20 um)', '높은 레이저 파워 + 물리적 흡입 강화', '직접 방출 모드 → 대형 파티클'],
      ['택트타임 여유 있음', '저에너지 멀티패스 + UV + fs/short ps', '최고 품질, debris 최소'],
      ['택트타임 제약 강함', '532nm + 500kHz + 8-10 패스 + N₂', '품질과 생산성 균형'],
      ['스트리트 폭 < 50 um', 'Side-blow 필수, 보호필름 두께 검토', '좁은 커프에서 choking 심화'],
      ['후세정 wet 불허', 'CO₂ 스노우 + 플라즈마 (건식 조합)', '건식만 허용 시 선택지'],
    ],
    { y: 1.8, rowH: [0.4, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide);
}

// ── Slide 50: Reverse Decision Table ──
function createSlide50() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '결과 기반 조정: 문제 발견 시 파라미터를 이렇게 바꿔라');
  addStyledTable(slide,
    ['발견 문제', '1차 조치', '2차 조치', '3차 조치'],
    [
      ['Cu 재증착 발견', 'N₂ 유량 증가\n(MSD 이하에서)', 'HogoMax 미사용 시\n도입', '멀티패스 수 증가\n(패스당 플루언스 감소)'],
      ['EMC 탄화물 잔류', '파장 → UV 전환\n(광화학 어블레이션)', '플루언스 감소\n+ 패스 수 증가', 'Chemical deflash\n후세정 강화'],
      ['커프 엣지 품질 불량', '가스 압력 단계적 감소\n(MSD 의심)', '반복률 감소\n(열축적 억제)', '패스 간 냉각 시간\n추가'],
    ],
    { y: 1.8, rowH: [0.4, 0.9, 0.9, 0.9] }
  );
  addPageNumber(slide);
}

// ── Slide 51: Section 6 Divider ──
function createSlide51() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('06', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('근거 검증과\n후속 과제', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('Critic 검증 결과와 본 리서치의 한계', {
    x: 6.0, y: 3.9, w: 6.73, h: 0.8,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary
  });
  addPageNumber(slide);
}

// ── Slide 52: Confidence Matrix ──
function createSlide52() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 주장 12개의 근거 신뢰도가 상이하다');
  addStyledTable(slide,
    ['핵심 주장', '도메인 일치', '확신도'],
    [
      ['ps가 ns 대비 debris 현저 감소', '높음', '높음'],
      ['Cu/EMC 임계값 ~10배 차이', '높음', '높음'],
      ['HogoMax 30초 완전 제거', '높음', '높음'],
      ['Chemical deflash EMC 필수', '높음', '높음'],
      ['532nm Cu 최적 파장', '중간 (ns 데이터)', '중간-높음'],
      ['N₂가 EMC 최적 가스', '중간 (간접 추론)', '중간'],
      ['멀티패스 > 싱글패스', '중간 (2008 ns)', '중간'],
      ['Top-hat > Gaussian', '중간 (단일 재료)', '중간'],
      ['MSD 역효과', '낮음-중간 (금속)', '중간'],
      ['MHz 버스트 모드 효과', '낮음 (fs, 단일 금속)', '낮음-중간'],
      ['CO₂ 스노우 99.9%+ 효율', '낮음 (제조사 자료)', '낮음'],
    ],
    { y: 1.6, rowH: [0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35] }
  );
  addPageNumber(slide);
}

// ── Slide 53: Conflict Resolution ──
function createSlide53() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3개 상충점을 근거 강도 기반으로 해결하였다');
  addStyledTable(slide,
    ['상충 항목', 'R1 주장', 'R3 주장', '판단'],
    [
      ['최적 펄스폭', 'ps = 종합 최적', 'fs = 정밀 가공 권장', '양립 가능\nps 범용, fs 품질 최우선'],
      ['fs 파티클 특성', '"가장 작은 나노입자"', '"수밀도 높음,\n응집체 5-10 um"', '동일 현상의 다른 프레이밍\n실효 크기는 응집체 기준'],
      ['EMC 후세정', 'R2: CO₂ 스노우\n/DI water 충분', 'R3: Chemical deflash\n+ waterjet 필수', 'R3 우선 채택\nSTMicro QFN 실증 근거'],
    ],
    { y: 1.8, rowH: [0.4, 0.9, 0.9, 0.9] }
  );
  addPageNumber(slide);
}

// ── Slide 54: Limitations ──
function createSlide54() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '비용 정량화, 경쟁 기술 비교, 실패 모드 분석이 후속 과제이다');
  const cards = [
    { title: '비용/생산성 정량화 부재', body: '장비 가격, 공정 추가 비용, 택트타임 영향의 정량 비교 없음. 의사결정자는 별도 벤치마크 필요.' },
    { title: '경쟁 기술 대비 맥락 부재', body: '블레이드/플라즈마/스텔스 다이싱 대비 레이저 흄 문제 심각도 미비교. "왜 레이저인가" 미답변.' },
    { title: '실패 모드 미분석', body: '레이저 출력 드리프트, 보호 필름 코팅 불량, 필터 포화 등 실패 시나리오 대응 미포함.' },
    { title: '대상 도메인 직접 데이터 부족', body: '핵심 주장 다수가 인접 도메인(금속 판재, 배터리 전극) 도출. ps + EMC/Cu 직접 실험 데이터 제한적.' },
  ];
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }
  ];
  cards.forEach((card, i) => {
    addCard(slide, {
      x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45,
      title: card.title, body: card.body,
      accentColor: COLORS.accent_red
    });
  });
  addPageNumber(slide);
}

// ── Slide 55: Closing ──
function createSlide55() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3중 방어 체계 + 재료별 맞춤 전략이 핵심이다');
  const points = [
    '발생 억제(레이저 파라미터) + 즉시 배출(가스/흡입) + 재증착 방지(보호 필름/후세정)의 3중 방어 체계를 구축하라',
    'Cu와 EMC의 ~10배 임계값 차이를 인식하고, 층별 적응형 파라미터 전략을 설계하라',
    '다층 인터페이스 전환점의 혼합 오염이 최대 위험임을 고려하여 인터페이스 통과 시 에너지를 점진적으로 조정하라',
  ];
  points.forEach((point, i) => {
    const y = 1.9 + i * 1.0;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue }
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle'
    });
    slide.addText(point, {
      x: 1.5, y: y, w: 11.23, h: 0.8,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle',
      lineSpacingMultiple: 1.3
    });
  });

  // Divider
  slide.addShape('line', {
    x: 0.6, y: 5.1, w: 12.13, h: 0,
    line: { color: 'E2E8F0', width: 0.5 }
  });

  // Next steps
  slide.addText('후속 탐색 질문', {
    x: 0.6, y: 5.3, w: 12.13, h: 0.35,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });
  const nextSteps = [
    { text: '1. EMC 필러 크기/함량별 최적 레이저 파라미터 맵 구축', options: { bullet: false } },
    { text: '2. 인터페이스 전환 감지 및 적응형 제어의 현재 기술 수준 조사', options: { bullet: false } },
    { text: '3. 레이저 vs 블레이드/플라즈마/스텔스 다이싱의 패키지 유형별 적합성 기준', options: { bullet: false } },
  ];
  slide.addText(nextSteps, {
    x: 0.6, y: 5.7, w: 12.13, h: 1.2,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, valign: 'top'
  });
  addPageNumber(slide);
}

// ===== 실행 =====
createSlide01();
createSlide02();
createSlide03();
createSlide04();
createSlide05();
createSlide06();
createSlide07();
createSlide08();
createSlide09();
createSlide10();
createSlide11();
createSlide12();
createSlide13();
createSlide14();
createSlide15();
createSlide16();
createSlide17();
createSlide18();
createSlide19();
createSlide20();
createSlide21();
createSlide22();
createSlide23();
createSlide24();
createSlide25();
createSlide26();
createSlide27();
createSlide28();
createSlide29();
createSlide30();
createSlide31();
createSlide32();
createSlide33();
createSlide34();
createSlide35();
createSlide36();
createSlide37();
createSlide38();
createSlide39();
createSlide40();
createSlide41();
createSlide42();
createSlide43();
createSlide44();
createSlide45();
createSlide46();
createSlide47();
createSlide48();
createSlide49();
createSlide50();
createSlide51();
createSlide52();
createSlide53();
createSlide54();
createSlide55();

const outputPath = path.join(__dirname, 'laser-fume-particle-control.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`저장 완료: ${outputPath}`))
  .catch(err => console.error('저장 실패:', err));
