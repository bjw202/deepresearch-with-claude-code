// === Part 1 시작 ===
const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const TOTAL_SLIDES = 55;

const COLORS = {
  bg_primary: 'FFFFFF',
  bg_secondary: 'F7F8FA',
  bg_dark: '1A1F36',
  text_primary: '1A1F36',
  text_secondary: '4A5568',
  text_tertiary: '9CA3AF',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7',
  accent_cyan: '00D4AA',
  accent_yellow: 'FFB020',
  accent_red: 'FF6B6B',
  accent_purple: '8B5CF6',
};

const FONTS = {
  title:    { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body:     { fontFace: 'Pretendard', bold: false },
  caption:  { fontFace: 'Pretendard Light', bold: false },
  serif:    { fontFace: 'ChosunNm', bold: false },
  kpi:      { fontFace: 'Pretendard Black', bold: true },
  deco:     { fontFace: 'Pretendard Thin', bold: false },
};

const TABLE_STYLE = {
  header: {
    bold: true, fill: { color: COLORS.bg_dark }, color: COLORS.text_on_dark,
    fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle'
  },
  cell: {
    fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, valign: 'middle'
  },
  cellRight: {
    fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, align: 'right', valign: 'middle'
  },
  cellAlt: {
    fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary,
    fill: { color: COLORS.bg_secondary }, valign: 'middle'
  },
  cellTotal: {
    bold: true, fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_primary,
    border: [{ type: 'solid', pt: 1.5, color: COLORS.text_primary }, null, null, null], valign: 'middle'
  }
};

const TABLE_OPTIONS = {
  x: 0.6, y: 1.8, w: 12.13,
  border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
  autoPage: false, margin: [5, 8, 5, 8]
};

const CHART_STYLE = {
  base: {
    showTitle: true, titleFontFace: 'Pretendard', titleFontSize: 14, titleColor: COLORS.text_primary,
    showLegend: true, legendFontFace: 'Pretendard', legendFontSize: 9, legendColor: COLORS.text_secondary,
    catAxisLabelFontFace: 'Pretendard', catAxisLabelFontSize: 10, catAxisLabelColor: COLORS.text_tertiary,
    valAxisLabelFontFace: 'Pretendard', valAxisLabelFontSize: 10, valAxisLabelColor: COLORS.text_tertiary,
  },
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

// ── 헬퍼 함수 ──────────────────────────────────────────────────────────────

function addTitleBar(slide, title, subtitle = '') {
  slide.addShape('rect', { x: 0.6, y: 0.5, w: 1.2, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3, autoFit: true
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.6, w: 12.13, h: 0.4,
      fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
    });
  }
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

function addTitledTable(slide, tableTitle, headers, dataRows, opts = {}) {
  const colCount = headers.length;
  const rows = [];
  rows.push([{
    text: tableTitle,
    options: {
      colspan: colCount, bold: true,
      fill: { color: COLORS.bg_dark }, color: COLORS.text_on_dark,
      fontFace: 'Pretendard', fontSize: 13, align: 'center', valign: 'middle'
    }
  }]);
  rows.push(headers.map(h => ({
    text: h, options: {
      bold: true, fill: { color: COLORS.bg_secondary }, color: COLORS.text_primary,
      fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle'
    }
  })));
  dataRows.forEach((row, i) => {
    const isAlt = i % 2 === 1;
    rows.push(row.map(cell => {
      const base = isAlt ? { ...TABLE_STYLE.cellAlt } : { ...TABLE_STYLE.cell };
      if (typeof cell === 'string') return { text: cell, options: base };
      return { text: cell.text, options: { ...base, ...cell.options } };
    }));
  });
  slide.addTable(rows, { ...TABLE_OPTIONS, ...opts });
}

function addStyledChart(slide, type, chartData, opts = {}) {
  const typeMap = {
    BAR: pptx.charts.BAR, LINE: pptx.charts.LINE, PIE: pptx.charts.PIE,
    DOUGHNUT: pptx.charts.DOUGHNUT, AREA: pptx.charts.AREA,
    RADAR: pptx.charts.RADAR, SCATTER: pptx.charts.SCATTER, BUBBLE: pptx.charts.BUBBLE
  };
  const defaults = {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    ...CHART_STYLE.base,
    chartColors: CHART_STYLE.colors.slice(0, chartData.length || 6),
    ...opts
  };
  slide.addChart(typeMap[type], chartData, defaults);
}

function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: COLORS.bg_primary },
    line: { color: 'E2E8F0', width: 0.75 }
  });
  slide.addShape('rect', {
    x: x + 0.02, y, w: w - 0.04, h: 0.06,
    fill: { color: accentColor || COLORS.accent_blue }
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.35,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, autoFit: true
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
  });
}

function addPageNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary, align: 'right'
  });
}

// ── 슬라이드 함수 ──────────────────────────────────────────────────────────

function slide01_title() {
  const slide = pptx.addSlide();
  // 풀블리드 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 좌측 강조 바
  slide.addShape('rect', { x: 0.7, y: 2.3, w: 0.08, h: 2.6, fill: { color: COLORS.accent_blue } });
  // 태그라인
  slide.addText('제조업 현장 엔지니어를 위한 교육 세미나', {
    x: 1.0, y: 2.2, w: 10.5, h: 0.5,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan
  });
  // 메인 타이틀
  slide.addText('에칭 기술 완전 가이드', {
    x: 1.0, y: 2.7, w: 10.5, h: 1.1,
    fontSize: 46, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, charSpacing: -1.0
  });
  slide.addText('화학에서 레이저까지', {
    x: 1.0, y: 3.75, w: 10.5, h: 0.75,
    fontSize: 32, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });
  // 구분선
  slide.addShape('rect', { x: 1.0, y: 4.65, w: 4.5, h: 0.03, fill: { color: '3A4460' } });
  // 하단 메타
  slide.addText('화학적 에칭  |  반도체 에칭  |  물리적 에칭  |  레이저 에칭  |  에칭 방식 선택 가이드', {
    x: 1.0, y: 4.85, w: 11.0, h: 0.4,
    fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
  });
  slide.addText('2026-03-25', {
    x: 1.0, y: 6.8, w: 4.0, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: '505878'
  });
}

function slide02_learning_objectives() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '오늘 배울 것: 에칭의 원리, 종류, 선택법', '학습 목표 및 강의 구성');

  // 학습 목표 4개 — 좌측
  const goals = [
    ['에칭이란 무엇인가', '화학-물리 스펙트럼 위에 있는 에칭 방식의 전체 지도를 이해한다'],
    ['화학적 에칭의 원리와 실무', '유리·금속별 에칭액 선택, 언더컷·에칭팩터, HF 안전 관리를 익힌다'],
    ['반도체·물리적 에칭', 'RIE, DRIE, ALE, 레이저 에칭의 원리와 차이를 파악한다'],
    ['현장 의사결정', '소재-목적-비용 기준으로 최적 에칭 방식을 선택하는 프레임워크를 갖는다'],
  ];

  goals.forEach((g, i) => {
    const yBase = 2.0 + i * 1.15;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 7.5, h: 1.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.35, h: 1.0,
      fill: { color: [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple][i] } });
    slide.addText(`0${i + 1}`, {
      x: 0.62, y: yBase + 0.28, w: 0.32, h: 0.4,
      fontSize: 16, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center'
    });
    slide.addText(g[0], {
      x: 1.1, y: yBase + 0.1, w: 6.85, h: 0.35,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });
    slide.addText(g[1], {
      x: 1.1, y: yBase + 0.48, w: 6.85, h: 0.4,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });

  // 우측 목차 박스
  slide.addShape('roundRect', { x: 8.5, y: 2.0, w: 4.2, h: 4.6, rectRadius: 0.1,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('강의 구성', {
    x: 8.7, y: 2.15, w: 3.8, h: 0.4,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });
  const sections = [
    ['섹션 1', '에칭의 기초', '8장'],
    ['섹션 2', '화학적 에칭', '14장'],
    ['섹션 3', '반도체 에칭', '12장'],
    ['섹션 4', '물리적 에칭', '12장'],
    ['섹션 5', '비교와 선택', '5장'],
    ['마무리', 'Q&A', '2장'],
  ];
  sections.forEach((s, i) => {
    const y = 2.65 + i * 0.62;
    slide.addShape('rect', { x: 8.7, y: y + 0.17, w: 0.04, h: 0.28, fill: { color: COLORS.accent_blue } });
    slide.addText(s[0], { x: 8.85, y: y + 0.1, w: 1.0, h: 0.3,
      fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_cyan });
    slide.addText(s[1], { x: 8.85, y: y + 0.3, w: 2.6, h: 0.28,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_on_dark });
    slide.addText(s[2], { x: 11.5, y: y + 0.3, w: 0.9, h: 0.28,
      fontSize: 11, fontFace: FONTS.caption.fontFace, color: '606880', align: 'right' });
  });

  addPageNumber(slide, 2, TOTAL_SLIDES);
}

function slide03_section1_divider() {
  const slide = pptx.addSlide();
  // 좌 40% 다크
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 섹션 번호
  slide.addText('01', {
    x: 0.5, y: 1.5, w: 4.3, h: 1.8,
    fontSize: 100, fontFace: FONTS.kpi.fontFace, bold: true,
    color: '2A3050'
  });
  slide.addShape('rect', { x: 0.5, y: 3.5, w: 2.0, h: 0.05, fill: { color: COLORS.accent_blue } });
  slide.addText('섹션 1', {
    x: 0.5, y: 3.7, w: 4.3, h: 0.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan
  });
  slide.addText('에칭이란\n무엇인가', {
    x: 0.5, y: 4.2, w: 4.3, h: 1.4,
    fontSize: 30, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.2
  });
  // 우측 설명
  slide.addText('이 섹션에서 배울 것', {
    x: 6.0, y: 2.2, w: 6.8, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  const bullets = [
    '에칭의 정의와 핵심 원리 — "선택적 제거"',
    '화학-물리 스펙트럼으로 보는 에칭 방식의 전체 지도',
    '선택비·등방성·에칭속도 3대 핵심 개념 정리',
    '언더컷과 에칭팩터(EF)의 실무적 의미',
    '1950s부터 현재까지 에칭 기술 발전 로드맵',
  ];
  bullets.forEach((b, i) => {
    slide.addShape('rect', { x: 6.0, y: 2.85 + i * 0.72, w: 0.15, h: 0.15,
      fill: { color: COLORS.accent_blue } });
    slide.addText(b, {
      x: 6.3, y: 2.78 + i * 0.72, w: 6.5, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });
}

function slide04_etching_definition() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭은 원하는 부분만 골라서 깎는 기술이다', '에칭(Etching)의 정의와 핵심 원리');

  // 중앙 정의 박스
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 12.13, h: 1.1, rectRadius: 0.1,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('에칭(Etching) = 화학물질, 이온, 레이저 등을 이용해 재료 표면의 일부를 선택적으로 제거하는 가공 기술', {
    x: 0.9, y: 1.98, w: 11.6, h: 0.9,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center', valign: 'middle'
  });

  // 비유 카드 3개
  const analogies = [
    { icon: '🖋', title: '도장 파기', body: '고무 도장을 칼로 파는 것처럼,\n원하는 부분만 남기고\n나머지를 깎아낸다', color: COLORS.accent_blue },
    { icon: '🧊', title: '눈사람 녹이기', body: '비닐봉지를 씌운 곳은 그대로,\n드러난 곳만 녹는다.\n마스크가 곧 보호막', color: COLORS.accent_cyan },
    { icon: '⚡', title: '선택적 제거', body: '"수단"은 다르지만 "원하는 곳만\n깎는다"는 본질은 동일하다.\n수단 선택 = 품질/비용 결정', color: COLORS.accent_purple },
  ];

  analogies.forEach((a, i) => {
    const x = 0.6 + i * 4.17;
    addCard(slide, { x, y: 3.2, w: 3.97, h: 3.4, title: a.title, body: a.body, accentColor: a.color });
  });

  addPageNumber(slide, 4, TOTAL_SLIDES);
}

function slide05_spectrum_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 방식은 화학-물리 스펙트럼 위에 있다', '순수 화학에서 순수 물리까지 — 이분법이 아닌 연속체');

  // 스펙트럼 배경 바
  // 좌측(파랑)~우측(빨강) 그라데이션 효과: 블록 4개로 표현
  const specColors = ['3A7BD5', '6A5FBF', 'A64F9A', 'D94040'];
  specColors.forEach((c, i) => {
    slide.addShape('rect', { x: 0.6 + i * 3.03, y: 2.1, w: 3.03, h: 0.55, fill: { color: c } });
  });
  slide.addText('순수 화학', { x: 0.6, y: 2.72, w: 2.0, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: '3A7BD5', align: 'center' });
  slide.addText('순수 물리', { x: 10.73, y: 2.72, w: 2.0, h: 0.3,
    fontSize: 10, fontFace: FONTS.caption.fontFace, color: 'D94040', align: 'center' });

  // 방식 노드 7개
  const nodes = [
    { label: '습식 에칭', sub: 'HF, FeCl₃\n액체에 담가 녹임', x: 0.6, color: '3A7BD5' },
    { label: '플라즈마\n화학 에칭', sub: '반응 가스 라디칼\n화학 반응 주도', x: 2.2, color: '4F6EC0' },
    { label: 'RIE', sub: '반응성 이온 에칭\n이온 폭격+화학', x: 4.7, color: '8B5CF6' },
    { label: 'CAIBE', sub: '화학보조 이온빔\n이온빔+반응가스', x: 7.1, color: 'B44F88' },
    { label: '스퍼터 에칭', sub: 'Ar+ 이온 충돌\n운동에너지 제거', x: 9.0, color: 'D94040' },
    { label: 'FIB', sub: '집속이온빔\nGa+/Xe+ 조각', x: 10.5, color: 'E05050' },
    { label: '레이저', sub: '광에너지→기화\n비열적 제거', x: 12.0, color: 'C03030' },
  ];

  nodes.forEach(n => {
    const boxW = 1.5;
    slide.addShape('roundRect', { x: n.x, y: 3.1, w: boxW, h: 1.15, rectRadius: 0.1,
      fill: { color: n.color }, line: { color: n.color, width: 0 } });
    slide.addText(n.label, { x: n.x + 0.05, y: 3.12, w: boxW - 0.1, h: 0.45,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    slide.addText(n.sub, { x: n.x + 0.05, y: 3.55, w: boxW - 0.1, h: 0.65,
      fontSize: 9, fontFace: FONTS.caption.fontFace,
      color: 'D0D8F0', align: 'center', lineSpacingMultiple: 1.2 });
  });

  // 화살표(rect 얇은 선으로 대체)
  slide.addShape('rect', { x: 0.6, y: 2.35, w: 12.13, h: 0.03, fill: { color: 'FFFFFF' } });

  // 핵심 포인트 박스
  slide.addShape('roundRect', { x: 0.6, y: 4.55, w: 12.13, h: 1.75, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: 0.6, y: 4.55, w: 0.08, h: 1.75, fill: { color: COLORS.accent_purple } });
  slide.addText('핵심 포인트', { x: 0.85, y: 4.65, w: 3.0, h: 0.3,
    fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_purple });
  slide.addText(
    'RIE(반응성 이온 에칭)는 화학과 물리의 경계에 있는 하이브리드 기술이다. 같은 RIE 장비라도 가스 종류와 이온 에너지 비율에 따라 화학 쪽이나 물리 쪽으로 성격이 변한다. "건식 에칭"과 "물리적 에칭" 두 섹션에서 모두 다루는 이유가 여기에 있다.',
    { x: 0.85, y: 5.0, w: 11.7, h: 1.2,
      fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  addPageNumber(slide, 5, TOTAL_SLIDES);
}

function slide06_three_concepts() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 3대 핵심 개념: 선택비, 등방성, 에칭속도', '이 세 가지를 이해하면 어떤 에칭 방식이든 평가할 수 있다');

  // 2x2 카드 레이아웃 (4번째는 종합)
  const cards = [
    {
      x: 0.6, y: 1.9, w: 5.915, h: 2.3,
      title: '선택비 (Selectivity)',
      body: '에칭 대상 속도 ÷ 마스크 속도\n\n손톱만 깎고 손가락은 안 다치는 능력\n→ 숫자가 높을수록 정밀\n\n예: HF의 유리/포토레지스트 = 10:1',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.815, y: 1.9, w: 5.915, h: 2.3,
      title: '등방성 / 이방성',
      body: '등방성: 사방으로 균일하게 깎임 (사과를 설탕물에)\n이방성: 수직 방향으로만 깎임 (나무를 나뭇결 따라)\n\n→ 미세 패턴에는 이방성이 필수\n→ 습식 에칭은 기본적으로 등방성',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.6, y: 4.45, w: 5.915, h: 2.3,
      title: '에칭 속도 (Etch Rate)',
      body: '단위 시간당 재료가 녹는 깊이 (µm/min)\n\n습식 HF(유리): 0.1~8 µm/min\n습식 FeCl₃(구리): 25~50 µm/min\nALE: ~0.1 nm/사이클\n\n→ 온도·농도·교반으로 제어',
      accentColor: COLORS.accent_yellow,
    },
    {
      x: 6.815, y: 4.45, w: 5.915, h: 2.3,
      title: '왜 3가지를 함께 봐야 하나',
      body: '세 지표는 서로 트레이드오프 관계\n\n빠른 속도 → 선택비 저하 가능\n높은 이방성 → 장비 비용 증가\n높은 선택비 → 화학 반응 의존 → 등방성\n\n→ "목적에 맞는 균형점"을 찾는 것이 에칭 설계',
      accentColor: COLORS.accent_purple,
    },
  ];

  cards.forEach(c => addCard(slide, c));
  addPageNumber(slide, 6, TOTAL_SLIDES);
}

function slide07_isotropy_vs_anisotropy() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '등방성은 사방으로, 이방성은 수직으로만 깎는다', '에칭 방향성의 차이와 실무적 의미');

  // 좌측: 등방성
  slide.addShape('roundRect', { x: 0.6, y: 1.85, w: 5.865, h: 4.8, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('등방성 에칭 (Isotropic)', {
    x: 0.8, y: 2.0, w: 5.4, h: 0.4,
    fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  // 등방성 단면도 (도형으로 표현)
  // 기판
  slide.addShape('rect', { x: 1.0, y: 2.6, w: 5.0, h: 1.2, fill: { color: 'B0C4DE' } });
  // 마스크 좌
  slide.addShape('rect', { x: 1.0, y: 2.3, w: 1.6, h: 0.32, fill: { color: '4A5568' } });
  // 마스크 우
  slide.addShape('rect', { x: 3.4, y: 2.3, w: 1.6, h: 0.32, fill: { color: '4A5568' } });
  // 에칭 볼 (반원 형태 — roundRect로 근사)
  slide.addShape('ellipse', { x: 1.95, y: 2.3, w: 1.5, h: 1.1, fill: { color: COLORS.bg_primary }, line: { color: COLORS.accent_cyan, width: 1.5 } });
  // 화살표 방향 표시 (좌우 화살표 — rect)
  slide.addText('← 언더컷 →', { x: 1.9, y: 3.55, w: 1.6, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_red, align: 'center' });

  slide.addText('비유: 사과를 설탕물에 담그면 모든 방향에서 골고루 녹는다', {
    x: 0.8, y: 3.85, w: 5.4, h: 0.5,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.3
  });
  const isoPoints = [
    '모든 방향으로 동일한 속도로 에칭',
    '마스크 아래로 언더컷(Undercut) 발생 필연',
    '유리, 구리, 알루미늄 등 다결정/비정질 재료',
    '패턴 정밀도 한계: 깊이 1µm = 옆 방향도 ~1µm 손실',
  ];
  isoPoints.forEach((p, i) => {
    slide.addShape('rect', { x: 0.85, y: 4.45 + i * 0.45, w: 0.12, h: 0.12, fill: { color: COLORS.accent_cyan } });
    slide.addText(p, { x: 1.1, y: 4.4 + i * 0.45, w: 5.2, h: 0.38,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });

  // 우측: 이방성
  slide.addShape('roundRect', { x: 6.865, y: 1.85, w: 5.865, h: 4.8, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('이방성 에칭 (Anisotropic)', {
    x: 7.1, y: 2.0, w: 5.4, h: 0.4,
    fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  // 이방성 단면도
  slide.addShape('rect', { x: 7.35, y: 2.6, w: 5.0, h: 1.2, fill: { color: 'B0C4DE' } });
  // 마스크
  slide.addShape('rect', { x: 7.35, y: 2.3, w: 1.6, h: 0.32, fill: { color: '4A5568' } });
  slide.addShape('rect', { x: 9.75, y: 2.3, w: 1.6, h: 0.32, fill: { color: '4A5568' } });
  // 수직 에칭 홈
  slide.addShape('rect', { x: 8.95, y: 2.3, w: 0.8, h: 1.2, fill: { color: COLORS.bg_primary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('수직 측벽', { x: 8.95, y: 3.55, w: 0.8, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_blue, align: 'center' });

  slide.addText('비유: 나무를 나뭇결 따라 쪼개면 한 방향으로만 갈라진다', {
    x: 7.1, y: 3.85, w: 5.4, h: 0.5,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
    lineSpacingMultiple: 1.3
  });
  const anisoPoints = [
    '수직 방향으로만 에칭 (이온이 수직 가속)',
    '언더컷 최소 → 미세 패턴 구현 가능',
    'RIE, DRIE: 반도체 공정의 표준 방식',
    '3nm 선폭 구현의 핵심 요건',
  ];
  anisoPoints.forEach((p, i) => {
    slide.addShape('rect', { x: 7.1, y: 4.45 + i * 0.45, w: 0.12, h: 0.12, fill: { color: COLORS.accent_blue } });
    slide.addText(p, { x: 7.35, y: 4.4 + i * 0.45, w: 5.2, h: 0.38,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });

  addPageNumber(slide, 7, TOTAL_SLIDES);
}

function slide08_undercut_etch_factor() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '언더컷은 등방성 에칭의 숙명이다', '에칭팩터(EF)로 정밀도를 정량화한다');

  // 언더컷 개념 박스
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 6.5, h: 2.5, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('언더컷(Undercut)이란?', {
    x: 0.85, y: 2.0, w: 6.0, h: 0.4,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  slide.addText(
    '마스크 가장자리 아래로 에칭액이 파고들어 보호해야 할 영역까지 재료가 녹는 현상.\n등방성 에칭(습식)에서 피할 수 없는 부산물이다.',
    { x: 0.85, y: 2.45, w: 6.0, h: 0.9,
      fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );
  // 단면 다이어그램
  // 기판
  slide.addShape('rect', { x: 1.0, y: 3.55, w: 5.8, h: 0.7, fill: { color: 'B0C4DE' } });
  // 마스크 L
  slide.addShape('rect', { x: 1.0, y: 3.25, w: 1.5, h: 0.32, fill: { color: '4A5568' } });
  // 마스크 R
  slide.addShape('rect', { x: 5.3, y: 3.25, w: 1.5, h: 0.32, fill: { color: '4A5568' } });
  // 에칭된 영역 (언더컷 포함)
  slide.addShape('ellipse', { x: 2.3, y: 3.2, w: 3.2, h: 1.05, fill: { color: COLORS.bg_primary }, line: { color: COLORS.accent_red, width: 1.5 } });
  // 치수 표시
  slide.addShape('rect', { x: 2.3, y: 4.35, w: 0.6, h: 0.02, fill: { color: COLORS.accent_yellow } });
  slide.addShape('rect', { x: 5.1, y: 4.35, w: 0.6, h: 0.02, fill: { color: COLORS.accent_yellow } });
  slide.addText('언더컷', { x: 2.1, y: 4.38, w: 0.9, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_yellow, align: 'center' });
  slide.addText('언더컷', { x: 5.0, y: 4.38, w: 0.9, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_yellow, align: 'center' });

  // 에칭팩터 설명
  slide.addShape('roundRect', { x: 7.4, y: 1.9, w: 5.2, h: 2.5, rectRadius: 0.1,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('에칭팩터(Etch Factor, EF)', {
    x: 7.65, y: 2.05, w: 4.7, h: 0.4,
    fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });
  slide.addText('EF = 에칭 깊이 ÷ 언더컷 거리', {
    x: 7.65, y: 2.55, w: 4.7, h: 0.45,
    fontSize: 18, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark
  });
  slide.addText('EF가 높을수록 측면 손실이 적고 정밀도가 높다', {
    x: 7.65, y: 3.05, w: 4.7, h: 0.35,
    fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
  });
  slide.addText('EF ≥ 3.0 → 고정밀 가공 기준', {
    x: 7.65, y: 3.45, w: 4.7, h: 0.35,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_yellow
  });

  // 수치 예시 박스
  slide.addShape('roundRect', { x: 0.6, y: 4.7, w: 12.13, h: 1.95, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('실제 수치 예시 — 두께 150µm 금속판 관통 에칭', {
    x: 0.85, y: 4.82, w: 11.6, h: 0.35,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  slide.addText('에칭 깊이: 150µm  |  양측 언더컷: 각 50µm  |  EF = 150 ÷ 50 = 3.0  |  실제 슬롯 폭 = 설계 폭 + 100µm (언더컷 보상 필수)', {
    x: 0.85, y: 5.2, w: 11.6, h: 0.55,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  slide.addText('→ CAD 설계 시 언더컷 분량만큼 아트워크(포토마스크)를 미리 수축 보정해야 한다', {
    x: 0.85, y: 5.78, w: 11.6, h: 0.7,
    fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue
  });

  addPageNumber(slide, 8, TOTAL_SLIDES);
}

function slide09_timeline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 기술은 60년간 진화해왔다', '1950년대 화학 밀링에서 현재 하이브리드 공정까지');

  // 타임라인 수평선
  slide.addShape('rect', { x: 0.7, y: 3.85, w: 12.0, h: 0.05, fill: { color: 'D1D9E6' } });

  const milestones = [
    { year: '1950s', label: '화학 밀링\n(Chemical Milling)', detail: '항공우주\n금속 대형 가공', x: 0.6, color: COLORS.accent_blue },
    { year: '1960s', label: '습식 에칭\n(Wet Etching)', detail: '반도체\n초기 공정', x: 2.4, color: COLORS.accent_cyan },
    { year: '1970s', label: '플라즈마/RIE\n건식 에칭 등장', detail: '이방성 에칭\n첫 구현', x: 4.2, color: COLORS.accent_purple },
    { year: '1990s', label: 'DRIE / ICP\n고종횡비 가능', detail: 'MEMS\n딥 트렌치', x: 6.0, color: COLORS.accent_yellow },
    { year: '2010s', label: 'ALE\n원자층 에칭', detail: '10nm 이하\n반도체 표준화', x: 7.8, color: COLORS.accent_red },
    { year: '현재', label: '하이브리드 공정\n에칭+증착 복합', detail: '3D NAND\nGAA 트랜지스터', x: 9.6, color: COLORS.accent_blue },
    { year: '레이저', label: '펨토초 레이저\nCold Ablation', detail: '비열적 나노\n가공 실현', x: 11.4, color: COLORS.accent_cyan },
  ];

  milestones.forEach((m, i) => {
    const nodeX = m.x + 0.75;
    const isUpper = i % 2 === 0;
    // 노드 원
    slide.addShape('ellipse', { x: nodeX - 0.15, y: 3.7, w: 0.3, h: 0.3, fill: { color: m.color }, line: { color: m.color, width: 0 } });
    // 연결 수직선
    if (isUpper) {
      slide.addShape('rect', { x: nodeX - 0.01, y: 2.05, w: 0.02, h: 1.65, fill: { color: 'C0C8D8' } });
    } else {
      slide.addShape('rect', { x: nodeX - 0.01, y: 4.0, w: 0.02, h: 1.65, fill: { color: 'C0C8D8' } });
    }
    // 연도
    slide.addText(m.year, { x: m.x, y: isUpper ? 1.62 : 5.72, w: 1.5, h: 0.3,
      fontSize: 11, fontFace: FONTS.subtitle.fontFace, bold: true, color: m.color, align: 'center' });
    // 라벨
    slide.addText(m.label, { x: m.x, y: isUpper ? 1.92 : 6.02, w: 1.5, h: 0.7,
      fontSize: 10, fontFace: FONTS.body.fontFace, color: COLORS.text_primary,
      align: 'center', lineSpacingMultiple: 1.2 });
    // 상세
    slide.addText(m.detail, { x: m.x, y: isUpper ? 2.62 : 6.7, w: 1.5, h: 0.55,
      fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
      align: 'center', lineSpacingMultiple: 1.2 });
  });

  // 하단 전환 메시지
  slide.addShape('roundRect', { x: 0.6, y: 7.0, w: 12.13, h: 0.35, rectRadius: 0.06,
    fill: { color: 'EEF2FF' }, line: { color: COLORS.accent_blue, width: 0.5 } });
  slide.addText('다음 섹션: 가장 오래되고 직관적인 방식인 화학적 에칭(습식 에칭)부터 시작한다', {
    x: 0.8, y: 7.02, w: 11.8, h: 0.3,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue, align: 'center'
  });

  addPageNumber(slide, 9, TOTAL_SLIDES);
}

function slide10_section1_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '섹션 1 핵심 요약', '에칭의 기초 — 꼭 기억해야 할 4가지');

  const summaries = [
    {
      num: '01', color: COLORS.accent_blue,
      title: '에칭 = 선택적 제거',
      body: '화학물질, 이온, 레이저 등 수단은 다르지만\n"원하는 곳만 깎는다"는 본질은 동일하다.\n수단 선택이 곧 품질/비용/정밀도를 결정한다.'
    },
    {
      num: '02', color: COLORS.accent_cyan,
      title: '화학-물리 연속 스펙트럼',
      body: '습식(순수 화학) ~ RIE(하이브리드) ~ 스퍼터/레이저(순수 물리).\nRIE는 스펙트럼 중앙의 하이브리드 기술.\n이분법으로 나누면 혼란이 생긴다.'
    },
    {
      num: '03', color: COLORS.accent_yellow,
      title: '3대 성능 지표',
      body: '선택비(마스크 보호 능력) + 등방성/이방성(방향) + 에칭속도.\n이 세 가지만 이해하면 어떤 에칭 방식이든 핵심 성능을 평가할 수 있다.'
    },
    {
      num: '04', color: COLORS.accent_purple,
      title: '언더컷과 에칭팩터(EF)',
      body: '등방성 에칭에서 언더컷은 피할 수 없다.\nEF = 에칭 깊이 ÷ 언더컷 거리. EF 3.0 이상이 고정밀.\n설계 단계에서 언더컷 보상이 필수.'
    },
  ];

  summaries.forEach((s, i) => {
    const yBase = 1.9 + i * 1.18;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 1.05, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.55, h: 1.05, fill: { color: s.color } });
    slide.addText(s.num, { x: 0.6, y: yBase + 0.32, w: 0.55, h: 0.4,
      fontSize: 15, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center' });
    slide.addText(s.title, { x: 1.3, y: yBase + 0.08, w: 11.2, h: 0.38,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    slide.addText(s.body, { x: 1.3, y: yBase + 0.48, w: 11.2, h: 0.5,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.3 });
  });

  // 전환 화살표
  slide.addShape('roundRect', { x: 0.6, y: 6.7, w: 12.13, h: 0.55, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('다음 섹션 2: 가장 직관적인 에칭 방식 — 화학적 에칭(습식 에칭)의 원리와 실무', {
    x: 0.8, y: 6.76, w: 11.8, h: 0.42,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan, align: 'center'
  });

  addPageNumber(slide, 10, TOTAL_SLIDES);
}

function slide11_section2_divider() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', {
    x: 0.5, y: 1.5, w: 4.3, h: 1.8,
    fontSize: 100, fontFace: FONTS.kpi.fontFace, bold: true, color: '2A3050'
  });
  slide.addShape('rect', { x: 0.5, y: 3.5, w: 2.0, h: 0.05, fill: { color: COLORS.accent_cyan } });
  slide.addText('섹션 2', { x: 0.5, y: 3.7, w: 4.3, h: 0.5,
    fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan });
  slide.addText('화학적 에칭\n액체로 녹여서\n깎는다', {
    x: 0.5, y: 4.2, w: 4.3, h: 1.8,
    fontSize: 26, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.2
  });
  slide.addText('이 섹션에서 배울 것', {
    x: 6.0, y: 2.2, w: 6.8, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  const bullets = [
    '습식 에칭 원리 — 산화·용해·확산 3단계 메커니즘',
    '유리 에칭 실무 — HF, BOE, 유리 종류별 특성',
    '금속 에칭 실무 — 소재별 에칭액 매칭',
    'PCB 공정의 구리 에칭 — FeCl₃의 70% 점유율',
    'HF 안전 — 무증상 피부침투의 치명적 위험',
    '에칭 폐액 처리 — 중화·침전·분리 3단계',
  ];
  bullets.forEach((b, i) => {
    slide.addShape('rect', { x: 6.0, y: 2.85 + i * 0.65, w: 0.15, h: 0.15, fill: { color: COLORS.accent_cyan } });
    slide.addText(b, { x: 6.3, y: 2.78 + i * 0.65, w: 6.5, h: 0.5,
      fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });
}

function slide12_wet_etching_mechanism() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '습식 에칭은 산화-용해-확산 3단계로 작동한다', '화학 반응의 세 단계 — 가장 느린 단계가 전체 속도를 결정');

  // 3단계 플로 박스
  const steps = [
    {
      num: '1', title: '산화 (Oxidation)',
      body: '에칭액의 산 또는 산화제가\n재료 표면 원자를 이온으로 변환\n\n예: HF + SiO₂\n→ SiF₄(기체) + H₂O',
      color: COLORS.accent_blue, x: 0.6
    },
    {
      num: '2', title: '용해 (Dissolution)',
      body: '이온화된 재료가 에칭액에\n녹아들어 표면에서 분리\n\n마치 각설탕이 물에 녹아\n없어지는 것처럼',
      color: COLORS.accent_cyan, x: 4.4
    },
    {
      num: '3', title: '확산 (Diffusion)',
      body: '녹아 나온 이온이 에칭액 속으로\n퍼지고, 신선한 에칭액이\n표면에 다시 접근\n\n교반으로 속도 촉진 가능',
      color: COLORS.accent_purple, x: 8.2
    },
  ];

  steps.forEach(s => {
    slide.addShape('roundRect', { x: s.x, y: 2.0, w: 3.6, h: 3.8, rectRadius: 0.1,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('ellipse', { x: s.x + 1.4, y: 2.15, w: 0.8, h: 0.8,
      fill: { color: s.color }, line: { color: s.color, width: 0 } });
    slide.addText(s.num, { x: s.x + 1.4, y: 2.22, w: 0.8, h: 0.6,
      fontSize: 22, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center' });
    slide.addText(s.title, { x: s.x + 0.2, y: 3.05, w: 3.2, h: 0.45,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
    slide.addText(s.body, { x: s.x + 0.2, y: 3.55, w: 3.2, h: 2.1,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top' });
  });

  // 화살표 (rect 얇은 선)
  slide.addShape('rect', { x: 4.25, y: 3.85, w: 0.15, h: 0.03, fill: { color: COLORS.text_tertiary } });
  slide.addShape('rect', { x: 8.05, y: 3.85, w: 0.15, h: 0.03, fill: { color: COLORS.text_tertiary } });

  // 핵심 결론 박스
  slide.addShape('roundRect', { x: 0.6, y: 6.1, w: 12.13, h: 0.95, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('핵심: 세 단계 중 가장 느린 단계가 전체 에칭 속도를 결정한다.  교반(Agitation)은 확산 단계를 빠르게 해 전체 속도를 높인다.', {
    x: 0.85, y: 6.22, w: 11.7, h: 0.7,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_on_dark, lineSpacingMultiple: 1.4
  });

  addPageNumber(slide, 12, TOTAL_SLIDES);
}

function slide13_etch_rate_factors() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 속도는 온도, 농도, 교반으로 결정된다', '5가지 영향 요인 — 조절 가능한 것과 재료 고유 특성');

  addStyledTable(slide,
    ['영향 요인', '속도 증가 방향', '실무 조절 가능', '비고'],
    [
      ['온도', '높을수록 빠름', { text: '가능 (히터/쿨러)', options: { color: COLORS.accent_cyan } },
       '10°C 상승 시 반응속도 약 1.5~2배 (아레니우스 법칙)\nHF는 활성화 에너지 낮아 실제 1.5~2배 범위'],
      ['농도', '높을수록 빠름 (포화 후 정체)', { text: '가능 (희석/농축)', options: { color: COLORS.accent_cyan } },
       '일정 수준 이상에서 속도 포화 — 과도한 농도는 낭비'],
      ['교반 (Agitation)', '교반할수록 빠름', { text: '가능 (스프레이/버블)', options: { color: COLORS.accent_cyan } },
       '소진된 에칭액을 신선한 액으로 교체하는 효과\n확산 단계 속도 향상'],
      ['에칭 시간', '길수록 깊어짐', { text: '가능 (타이머)', options: { color: COLORS.accent_cyan } },
       '과에칭(Over-etch) 주의 — 타이머+소형 쿠폰 테스트 필수'],
      ['재료 결정 구조', '다결정 > 단결정', { text: '불가 (재료 고유)', options: { color: COLORS.accent_red } },
       '결정립계(grain boundary)에서 에칭 빠름\n단결정 Si는 KOH로 이방성 에칭 가능'],
    ],
    { y: 1.85, h: 0.58 }
  );

  // 핵심 포인트
  slide.addShape('roundRect', { x: 0.6, y: 5.3, w: 12.13, h: 1.5, rectRadius: 0.08,
    fill: { color: 'EEF2FF' }, line: { color: COLORS.accent_blue, width: 0.5 } });
  slide.addText('실무 포인트', { x: 0.85, y: 5.42, w: 3.0, h: 0.32,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue });
  slide.addText(
    '온도·농도·교반은 모두 조절 가능하다. 공정 초기 "소형 쿠폰 테스트"로 목표 에칭 속도를 캘리브레이션한 뒤 양산에 적용하는 것이 원칙이다. 에칭 속도는 ±50% 범위 변동이 흔하며, 문헌 수치를 그대로 믿으면 안 된다.',
    { x: 0.85, y: 5.77, w: 11.7, h: 0.95,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 }
  );

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

function slide14_glass_process_flow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유리 에칭 공정 흐름: 세정에서 검사까지', '8단계 플로차트 — 에칭은 공정의 일부, 전후 단계가 품질을 좌우한다');

  const steps = [
    { num: '01', label: '기판 세정\n(Cleaning)', sub: '유기물·오염물 제거\nDI Water + 탈지', color: COLORS.accent_blue },
    { num: '02', label: '마스크 증착\n(Deposition)', sub: '포토레지스트 또는\nCr/Au 금속막 도포', color: '3A7BD5' },
    { num: '03', label: 'UV 노광\n(Exposure)', sub: '포토마스크 밀착\n패턴 전사', color: '5A6FC0' },
    { num: '04', label: '현상\n(Development)', sub: '노광 영역 마스크 제거\n패턴 오픈', color: COLORS.accent_purple },
    { num: '05', label: '에칭\n(Wet Etching)', sub: 'HF 또는 BOE 침지\n목표 깊이까지', color: COLORS.accent_red },
    { num: '06', label: '린스\n(Rinse)', sub: 'DI Water 세척\n에칭액 잔류 제거', color: 'D97040' },
    { num: '07', label: '마스크 제거\n(Strip)', sub: '유기 용제(NMP) 또는\nO₂ 플라즈마', color: 'C09030' },
    { num: '08', label: '최종 검사\n(Inspection)', sub: '에칭 깊이·치수·\n표면 거칠기 확인', color: COLORS.accent_cyan },
  ];

  steps.forEach((s, i) => {
    const x = 0.6 + (i % 4) * 3.18;
    const y = i < 4 ? 2.0 : 4.35;
    slide.addShape('roundRect', { x, y, w: 2.98, h: 2.05, rectRadius: 0.1,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('ellipse', { x: x + 1.09, y: y + 0.18, w: 0.8, h: 0.8,
      fill: { color: s.color }, line: { color: s.color, width: 0 } });
    slide.addText(s.num, { x: x + 1.09, y: y + 0.25, w: 0.8, h: 0.6,
      fontSize: 14, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center' });
    slide.addText(s.label, { x: x + 0.1, y: y + 1.05, w: 2.78, h: 0.55,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, align: 'center', lineSpacingMultiple: 1.2 });
    slide.addText(s.sub, { x: x + 0.1, y: y + 1.58, w: 2.78, h: 0.42,
      fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
      align: 'center', lineSpacingMultiple: 1.2 });
    // 화살표 (→) — rect 얇게
    if (i % 4 < 3) {
      slide.addShape('rect', { x: x + 3.0, y: y + 0.97, w: 0.18, h: 0.04, fill: { color: COLORS.text_tertiary } });
    }
  });

  addPageNumber(slide, 14, TOTAL_SLIDES);
}

function slide15_hf_principle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'HF는 유리(SiO₂)를 기체로 바꿔 없앤다', '불산(Hydrofluoric Acid)의 반응 원리와 농도별 에칭 속도');

  // 반응식 박스
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 12.13, h: 1.15, rectRadius: 0.1,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('SiO₂  +  4HF  →  SiF₄↑  +  2H₂O', {
    x: 0.6, y: 2.05, w: 12.13, h: 0.6,
    fontSize: 26, fontFace: FONTS.kpi.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('사불화규소(SiF₄)는 기체로 날아가고 물(H₂O)만 남는다 — 각설탕이 물에 녹아 없어지듯', {
    x: 0.6, y: 2.65, w: 12.13, h: 0.35,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary, align: 'center'
  });

  // 농도별 에칭 속도 표
  addStyledTable(slide,
    ['HF 농도', '에칭 속도 (µm/min)', '표면 품질', '주요 용도'],
    [
      ['1~5% HF', '0.1~0.5', '매끄러움 (Ra < 0.5 µm)', '마이크로구조 정밀 패터닝, MEMS'],
      ['10~25% HF', '0.5~2.0', '중간 품질', '일반 유리 에칭, 반도체 BOE 대체'],
      ['49% HF (진한 불산)', '2~8+', '거칠어질 수 있음', '깊은 에칭 (>600µm), 퓨즈드 실리카'],
    ],
    { y: 3.2, h: 0.65 }
  );

  // 주의사항 박스
  slide.addShape('roundRect', { x: 0.6, y: 5.4, w: 12.13, h: 1.35, rectRadius: 0.08,
    fill: { color: 'FFF3CD' }, line: { color: COLORS.accent_yellow, width: 1.0 } });
  slide.addShape('rect', { x: 0.6, y: 5.4, w: 0.08, h: 1.35, fill: { color: COLORS.accent_yellow } });
  slide.addText('수치 투명성 주의', { x: 0.85, y: 5.52, w: 3.5, h: 0.3,
    fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true, color: '8B6914' });
  slide.addText(
    '에칭 속도는 유리 종류·온도·교반에 따라 크게 달라진다. 49% HF의 8 µm/min은 퓨즈드 실리카·교반·25°C 조건의 상한값이다. 소다라임 유리는 퓨즈드 실리카보다 15~30% 빠르다. (출처: Iliescu et al., 2012 microfluidics review)\n실제 공정 적용 전 소형 쿠폰 테스트 필수.',
    { x: 0.85, y: 5.85, w: 11.7, h: 0.8,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: '5A4500', lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

function slide16_hf_vs_boe() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'HF vs BOE: 속도냐 안정성이냐', '완충산화에칭액(BOE = HF + NH₄F)의 원리와 비교');

  // 좌: 순수 HF
  slide.addShape('roundRect', { x: 0.6, y: 1.85, w: 5.865, h: 4.85, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: 0.6, y: 1.85, w: 5.865, h: 0.06, fill: { color: COLORS.accent_red } });
  slide.addText('순수 HF', {
    x: 0.85, y: 2.0, w: 5.3, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  slide.addText('빠르지만 불안정', {
    x: 0.85, y: 2.45, w: 5.3, h: 0.35,
    fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_red
  });
  const hfPoints = [
    ['에칭 속도', '높음 (농도 의존)'],
    ['속도 균일성', '변동 큼 — F⁻ 이온 소진으로 점점 느려짐'],
    ['표면 품질', '가변적, 조건에 민감'],
    ['PR 호환성', 'HF가 포토레지스트를 공격할 수 있음'],
    ['반도체 적합성', '낮음 — 속도 제어 어려움'],
  ];
  hfPoints.forEach((p, i) => {
    slide.addText(p[0] + ':', { x: 0.85, y: 2.95 + i * 0.6, w: 1.8, h: 0.35,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    slide.addText(p[1], { x: 2.7, y: 2.95 + i * 0.6, w: 3.5, h: 0.35,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });

  // 우: BOE
  slide.addShape('roundRect', { x: 6.865, y: 1.85, w: 5.865, h: 4.85, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addShape('rect', { x: 6.865, y: 1.85, w: 5.865, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('BOE (완충 산화 에칭액)', {
    x: 7.1, y: 2.0, w: 5.3, h: 0.45,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  slide.addText('느리지만 안정적 — CMOS 공정 표준', {
    x: 7.1, y: 2.45, w: 5.3, h: 0.35,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan
  });
  const boePoints = [
    ['에칭 속도', '낮고 안정적 (~1 µm/min)'],
    ['속도 균일성', '매우 안정 — NH₄F가 F⁻ 이온 지속 공급'],
    ['표면 품질', '균일, 재현성 높음'],
    ['PR 호환성', '포토레지스트와 잘 호환'],
    ['반도체 적합성', '높음 — CMOS 공정 표준'],
  ];
  boePoints.forEach((p, i) => {
    slide.addText(p[0] + ':', { x: 7.1, y: 2.95 + i * 0.6, w: 1.8, h: 0.35,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    slide.addText(p[1], { x: 8.95, y: 2.95 + i * 0.6, w: 3.7, h: 0.35,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });

  // BOE 원리
  slide.addShape('roundRect', { x: 6.865, y: 5.6, w: 5.865, h: 1.05, rectRadius: 0.08,
    fill: { color: 'EEF8F5' }, line: { color: COLORS.accent_cyan, width: 0.5 } });
  slide.addText('BOE 원리: NH₄F → NH₄⁺ + F⁻ 로 F⁻ 이온을 지속 공급하여 반응 속도를 일정하게 유지\n레시피 예: NH₄F 40g + DI water 60ml + 49% HF 10ml (조성은 목적에 따라 6:1, 10:1 등 다양)', {
    x: 7.05, y: 5.68, w: 5.5, h: 0.9,
    fontSize: 10, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

function slide17_glass_types() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유리 종류마다 에칭 속도가 다르다', '소다라임·보로실리케이트·퓨즈드실리카·알루미노실리케이트 비교');

  addStyledTable(slide,
    ['유리 종류', '주요 성분', 'HF 에칭 속도', '표면 거칠기', '특징', '주요 응용'],
    [
      ['소다라임\n(Soda-lime)', 'SiO₂ 73%\nNa₂O 14%', '빠름\n~2~3 µm/min',
       'Ra 수 µm\n(거칠어질 수 있음)', '알칼리 이온 많아\n에칭 빠르나 불균일', '건축용 유리\n장식 에칭, 음각'],
      ['보로실리케이트\n(Borosilicate,\n파이렉스 등)', 'SiO₂ 80%\nB₂O₃ 13%', '중간\n~1~2 µm/min',
       'Ra <1 µm\n비교적 매끄러움', '열충격 강함\nB₂O₃ 비율에 따라\n에칭 속도 변동', '마이크로플루이딕스\n실험실 기기, MEMS'],
      ['퓨즈드 실리카\n(Fused Silica)', 'SiO₂ >99.9%', '느림\n~1~1.5 µm/min',
       'Ra <0.5 µm\n매우 매끄러움', '최고 순도 SiO₂\nUV 투과 우수', '반도체 공정\nUV 광학계, 고정밀'],
      ['알루미노실리케이트\n(스마트폰 강화유리)', 'SiO₂, Al₂O₃\n알루미나 치환', '매우 느림',
       '균일', 'Al₂O₃ 함유로\nHF 반응성 낮음', '스마트폰 커버 유리\n고강도 응용'],
    ],
    { y: 1.85, h: 0.82 }
  );

  slide.addShape('roundRect', { x: 0.6, y: 6.05, w: 12.13, h: 0.72, rectRadius: 0.08,
    fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 0.5 } });
  slide.addText('주의: 보로실리케이트의 에칭 속도는 B₂O₃ 함량에 따라 달라지므로, 특정 제품은 반드시 데이터시트로 확인해야 한다. 에칭 속도 역전 사례는 문헌에서 직접 보고된 바 없으나, 고함량 B₂O₃에서 가능성 있음.', {
    x: 0.85, y: 6.12, w: 11.7, h: 0.6,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: '8B6914', lineSpacingMultiple: 1.4
  });

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

function slide18_metal_etching_cards() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '금속 에칭의 핵심: 소재-에칭액 매칭', '소재마다 에칭액이 다르다 — 4가지 핵심 조합');

  const cards = [
    {
      x: 0.6, y: 1.9, w: 5.915, h: 2.45,
      title: '구리 (Copper) — FeCl₃',
      body: '에칭액: 염화철(FeCl₃) 35~45% 수용액\n속도: 25~50 µm/min (30~45°C)\n\n반응: Cu + 2FeCl₃ → CuCl₂ + 2FeCl₂\nPCB 제조의 70% 이상이 FeCl₃ 사용\nCuCl₂는 재사용 가능 — 환경 선호도 증가',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.815, y: 1.9, w: 5.915, h: 2.45,
      title: '알루미늄 (Al) — NaOH',
      body: '에칭액: 수산화나트륨(NaOH) 5~20%\n온도: 50~70°C\n\n반응: 2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑\n수소 가스 발생 → 밀폐 공간 사용 금지\n박막 Al 배선은 H₃PO₄:HNO₃ 혼합 사용',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.6, y: 4.55, w: 5.915, h: 2.45,
      title: '스테인리스 (SUS) — FeCl₃+HCl',
      body: '에칭액: FeCl₃ 600 g/L + HCl 적량\n온도: 40~50°C\n\nCr₂O₃ 부동태 피막을 HCl의 Cl⁻ 이온이 파괴\nFeCl₃만으로는 에칭이 느림 (HCl 필수)\nSUS304 기준: 1~5 µm/min',
      accentColor: COLORS.accent_yellow,
    },
    {
      x: 6.815, y: 4.55, w: 5.915, h: 2.45,
      title: '티타늄 (Ti) — HF+HNO₃',
      body: '에칭액: HF 1~5% + HNO₃ 15~30% 혼합\n온도: 20~25°C\n\nHF: TiO₂ 부동태 피막 파괴\nHNO₃: Ti 금속 산화\n의료 임플란트 표면 처리 (골유착 향상)\nHNO₃ 비율이 높으면 부동태화 → 에칭 중단',
      accentColor: COLORS.accent_purple,
    },
  ];

  cards.forEach(c => addCard(slide, c));
  addPageNumber(slide, 18, TOTAL_SLIDES);
}

function slide19_pcb_copper_etching() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'PCB 제조의 70%는 FeCl₃ 구리 에칭이다', '포토화학 에칭(PCE) 공정 개요와 에칭액 비교');

  // 좌측 — PCE 개요
  slide.addShape('roundRect', { x: 0.6, y: 1.85, w: 5.865, h: 4.85, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('PCE(포토화학 에칭) 핵심 흐름', {
    x: 0.85, y: 2.0, w: 5.3, h: 0.4,
    fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });
  const pceSteps = [
    '금속 판재 → 세정(탈지)',
    '드라이 필름 포토레지스트 라미네이션',
    'UV 노광 (포토마스크 밀착)',
    '현상 (비노광부 PR 제거)',
    '화학 에칭 (FeCl₃ 스프레이)',
    'PR 스트립 → 린스 → 검사',
  ];
  pceSteps.forEach((s, i) => {
    const y = 2.52 + i * 0.6;
    slide.addShape('ellipse', { x: 0.85, y: y + 0.07, w: 0.25, h: 0.25,
      fill: { color: COLORS.accent_blue }, line: { color: COLORS.accent_blue, width: 0 } });
    slide.addText(`${i + 1}`, { x: 0.85, y: y + 0.06, w: 0.25, h: 0.27,
      fontSize: 10, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center' });
    slide.addText(s, { x: 1.2, y, w: 5.0, h: 0.42,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });
  slide.addText('응용: PCB·리드프레임·스텐실·항공우주 부품', {
    x: 0.85, y: 6.1, w: 5.3, h: 0.45,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });

  // 우측 — FeCl₃ vs CuCl₂ 비교
  addTitledTable(slide, 'FeCl₃ vs CuCl₂ 에칭액 비교',
    ['항목', 'FeCl₃', 'CuCl₂ (산성)'],
    [
      ['에칭 속도', '중간 (25~50 µm/min)', '빠름 (40~80 µm/min)'],
      ['재사용', '어려움', '용이 (HCl+O₂로 재생)'],
      ['폐수 처리', '복잡 (철·구리 이온)', '비교적 간단'],
      ['비용', '저가', '중간'],
      ['환경 규제', '철 이온 처리 필요', '선호도 증가 중'],
      ['시장 점유', '~70% (PCB 기준)', '증가 추세'],
    ],
    { x: 6.865, y: 1.85, w: 5.865, h: 0.52 }
  );

  addPageNumber(slide, 19, TOTAL_SLIDES);
}

function slide20_etch_factor_improvement() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 팩터 높이기: 4가지 방법', 'EF = 에칭 깊이 ÷ 언더컷 거리 — 높을수록 정밀한 가공');

  // EF 공식 표시
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 12.13, h: 0.72, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('EF(에칭팩터) = 에칭 깊이 ÷ 언더컷 거리    |    EF ≥ 3.0 → 고정밀 기준    |    목표: 설계 정밀도 확보', {
    x: 0.8, y: 2.0, w: 11.9, h: 0.52,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center', valign: 'middle'
  });

  // 4가지 방법 — 2x2
  const methods = [
    {
      x: 0.6, y: 2.78, w: 5.915, h: 2.15,
      title: '1. 양면 에칭 (Double-Side)',
      body: '위아래에서 동시에 에칭하면 각 방향의 깊이가 절반으로 줄어들고,\n각 측면의 언더컷도 절반으로 감소\n→ EF가 약 2배 향상\n→ 두께 150µm 금속판에 효과적',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.815, y: 2.78, w: 5.915, h: 2.15,
      title: '2. 스프레이 에칭 (Spray)',
      body: '담금(Immersion) 방식보다 신선한 에칭액을 지속 공급\n소진된 에칭 부산물을 빠르게 제거\n→ 확산 단계 속도 향상 → EF 개선\n→ 대량 생산 PCB 라인의 표준 방식',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.6, y: 5.1, w: 5.915, h: 2.15,
      title: '3. 아트워크 보정 (Artwork Compensation)',
      body: 'CAD 설계 단계에서 예상 언더컷 분량만큼 포토마스크 패턴을 미리 수축 보정\n→ 실제 에칭 결과가 설계 치수와 일치\n→ 비용 없이 정밀도 향상\n→ 언더컷 거리를 사전 캘리브레이션으로 예측',
      accentColor: COLORS.accent_yellow,
    },
    {
      x: 6.815, y: 5.1, w: 5.915, h: 2.15,
      title: '4. 온도/농도/시간 최적화',
      body: '과에칭(Over-etch)이 언더컷 주요 원인\n→ 온도 ±2°C 관리, 에칭 시간 타이머 제어\n→ 소형 쿠폰 사전 테스트로 최적점 확인\n→ 에칭 종점 검출(End-Point Detection) 활용',
      accentColor: COLORS.accent_purple,
    },
  ];

  methods.forEach(m => addCard(slide, m));
  addPageNumber(slide, 20, TOTAL_SLIDES);
}

function slide21_masking_materials() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '마스킹 재료 선택: 에칭 깊이가 기준이다', '포토레지스트·크롬금·폴리실리콘·드라이필름 비교');

  addStyledTable(slide,
    ['마스크 재료', 'HF 내성', '패턴 해상도', '적합 에칭 깊이', '비고'],
    [
      ['포토레지스트 (PR)\n액상/드라이필름', '낮음~중간', '높음\n(<1 µm 가능)', '<20 µm',
       '얕은 패턴에 경제적\nUV 노광 표준 공정'],
      ['크롬/금 금속 마스크\n(Cr/Au)', '매우 높음', '매우 높음\n(서브마이크론)', '>100 µm',
       '반도체급 정밀 공정\n스퍼터 증착 후 리프트오프'],
      ['폴리실리콘\n(Poly-Si)', '높음', '높음', '>200 µm',
       'MEMS 공정 표준\n깊은 트렌치에 최적'],
      ['왁스/파라핀', '낮음', '낮음\n(수작업 수십 µm)', '수십 µm',
       '예술·공예 에칭\n비정밀 장식용'],
      ['드라이 필름 레지스트\n(DFR)', '중간', '중간\n(~50 µm)', '30~80 µm',
       '소량 맞춤 생산\n롤투롤 라미네이션'],
    ],
    { y: 1.85, h: 0.7 }
  );

  slide.addShape('roundRect', { x: 0.6, y: 5.8, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('선택 원칙', { x: 0.85, y: 5.9, w: 2.5, h: 0.3,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  slide.addText(
    '에칭 깊이 < 20µm → 포토레지스트(경제적)  |  20~80µm → 드라이 필름  |  > 100µm → 크롬/금 또는 폴리실리콘\n마스크 재료와 에칭액 호환성을 반드시 사전 확인한다. 호환성 불량은 마스크 박리·언더컷 과다로 이어진다.',
    { x: 0.85, y: 6.22, w: 11.7, h: 0.52,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 21, TOTAL_SLIDES);
}

function slide22_hf_safety() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'HF는 무증상 피부침투로 심장을 멈출 수 있다', '불산의 특수 독성 — 일반 산과 근본적으로 다른 위험');

  // 경고 배너
  slide.addShape('rect', { x: 0.6, y: 1.9, w: 12.13, h: 0.65, fill: { color: COLORS.accent_red } });
  slide.addText('경고: HF는 10~25% 저농도에서도 피부 접촉 후 수 시간이 지나야 통증이 시작된다 — 무증상 = 안전 아님', {
    x: 0.8, y: 1.98, w: 11.9, h: 0.48,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center'
  });

  // 위험 경로 표
  addStyledTable(slide,
    ['노출 경로', '위험', '응급 처치'],
    [
      ['피부 접촉', '지연성 화상·뼈 손상·심장 부정맥\nF⁻ 이온이 칼슘·마그네슘 결합 → 혈중 Ca 급감',
       '즉시 흐르는 물로 15분 세척\n칼슘글루코네이트 2.5% 젤 도포\n무증상이어도 즉시 응급실'],
      ['눈 접촉', '즉각적 화상·각막 손상·실명 위험',
       '대량의 물로 15분 이상 세척\n즉시 안과 또는 응급실'],
      ['흡입', '폐부종·호흡 정지',
       '신선한 공기로 이동\n즉시 병원 (지연 시 사망 위험)'],
      ['섭취', '치명적 — 소량도 위험',
       '즉시 응급실 (구토 유발 금지)'],
    ],
    { y: 2.65, h: 0.62 }
  );

  // PPE + 비치품목
  slide.addShape('roundRect', { x: 0.6, y: 5.45, w: 5.8, h: 1.3, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('필수 PPE', { x: 0.85, y: 5.55, w: 5.3, h: 0.3,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  slide.addText('화학 방호 고글  |  네오프렌/부틸 고무 장갑 (라텍스 불가)  |  얼굴 보호대  |  화학 방호 앞치마  |  퓸 후드(환기 필수)', {
    x: 0.85, y: 5.88, w: 5.3, h: 0.8,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });

  slide.addShape('roundRect', { x: 6.7, y: 5.45, w: 6.0, h: 1.3, rectRadius: 0.08,
    fill: { color: 'FFF0F0' }, line: { color: COLORS.accent_red, width: 1.0 } });
  slide.addText('작업장 필수 비치 품목', { x: 6.95, y: 5.55, w: 5.5, h: 0.3,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red });
  slide.addText('칼슘글루코네이트 2.5% 젤 — 피부 노출 시 즉시 도포\nOSHA 기준: 8시간 평균 3 ppm / ACGIH 권고 0.5 ppm\n손가락 한두 개 면적 노출로도 사망 사례 보고됨', {
    x: 6.95, y: 5.88, w: 5.5, h: 0.8,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });

  addPageNumber(slide, 22, TOTAL_SLIDES);
}

function slide23_waste_treatment() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에칭 폐액은 중화-침전-분리 3단계로 처리한다', '국내 불소 방류 기준 15 mg/L 준수 필수');

  // HF 폐액 흐름
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 12.13, h: 0.4, rectRadius: 0.06,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('HF 폐액 처리 흐름', { x: 0.85, y: 1.96, w: 11.8, h: 0.28,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan });

  const hfSteps = [
    { label: '1. 중화', detail: 'Ca(OH)₂ 또는 CaCO₃ 첨가\nHF + Ca(OH)₂ → CaF₂↓ + H₂O', color: COLORS.accent_blue },
    { label: '2. 침전', detail: 'CaF₂(형석) 침전 형성\npH 조정 (7~9 목표)', color: COLORS.accent_cyan },
    { label: '3. 분리·처리', detail: '여과 분리 → 탈수\n불소 농도 15 mg/L 이하 확인', color: COLORS.accent_purple },
    { label: '4. 인계', detail: '지정 폐수 처리 업체 인계\n또는 재활용 가능 형태로 처리', color: COLORS.accent_yellow },
  ];
  hfSteps.forEach((s, i) => {
    const x = 0.6 + i * 3.18;
    slide.addShape('roundRect', { x, y: 2.45, w: 2.98, h: 1.55, rectRadius: 0.1,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x, y: 2.45, w: 2.98, h: 0.06, fill: { color: s.color } });
    slide.addText(s.label, { x: x + 0.15, y: 2.56, w: 2.68, h: 0.35,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    slide.addText(s.detail, { x: x + 0.15, y: 2.93, w: 2.68, h: 1.0,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.3 });
    if (i < 3) {
      slide.addShape('rect', { x: x + 3.0, y: 3.17, w: 0.18, h: 0.03, fill: { color: COLORS.text_tertiary } });
    }
  });

  // FeCl₃ 폐액 표
  addTitledTable(slide, 'FeCl₃ 구리 폐액 처리',
    ['단계', '처리 방법', '결과'],
    [
      ['중화', 'NaOH 투입 → Fe³⁺ + 3OH⁻ → Fe(OH)₃↓', '수산화철 침전 형성'],
      ['중금속 처리', 'Cu²⁺ 포함 → 중금속 폐수 별도 분류', '폐수 배출 시설 허가 필요'],
      ['친환경 대안', 'CuCl₂ 재생 시스템: HCl + O₂로 재산화', 'FeCl₃ 대비 폐수 감소'],
    ],
    { x: 0.6, y: 4.15, w: 12.13, h: 0.55 }
  );

  // 국내 규제 박스
  slide.addShape('roundRect', { x: 0.6, y: 5.85, w: 12.13, h: 1.0, rectRadius: 0.08,
    fill: { color: 'EEF2FF' }, line: { color: COLORS.accent_blue, width: 0.5 } });
  slide.addText('국내 규제', { x: 0.85, y: 5.95, w: 2.5, h: 0.3,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue });
  slide.addText(
    '불소 화합물: 「수질 및 수생태계 보전에 관한 법률」 — 방류 기준 15 mg/L 이하 (특정 수질 유해 물질)\n중금속(Cu, Fe, Ni) 폐수: 「폐수 배출 시설 설치 허가」 필요  |  친환경 동향: CuCl₂ 재생 시스템 도입 가속화',
    { x: 0.85, y: 6.27, w: 11.7, h: 0.52,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 }
  );

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

function slide24_section2_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '섹션 2 핵심 요약', '화학적 에칭 — 기억해야 할 5가지');

  const summaries = [
    {
      num: '01', color: COLORS.accent_blue,
      title: '습식 에칭 = 빠르고 저렴하지만 등방성',
      body: '산화→용해→확산 3단계. 유리 HF 최대 8µm/min, 구리 FeCl₃ 최대 50µm/min. 단, 등방성이므로 언더컷이 필연적으로 발생한다.'
    },
    {
      num: '02', color: COLORS.accent_cyan,
      title: '소재별 에칭액 매칭이 핵심',
      body: '구리→FeCl₃, 알루미늄→NaOH, 스테인리스→FeCl₃+HCl, 티타늄→HF+HNO₃. 에칭액과 소재의 조합이 맞지 않으면 에칭 자체가 불가하거나 부동태화된다.'
    },
    {
      num: '03', color: COLORS.accent_yellow,
      title: 'EF로 정밀도를 관리한다',
      body: '에칭팩터(EF) = 에칭 깊이 ÷ 언더컷. EF ≥ 3.0이 고정밀 기준. 양면 에칭·스프레이·아트워크 보정 3가지 방법으로 EF를 높인다.'
    },
    {
      num: '04', color: COLORS.accent_red,
      title: 'HF 안전 최우선 — 무증상이어도 병원',
      body: '저농도 HF는 수 시간 무증상 후 심장 부정맥 유발 가능. 칼슘글루코네이트 젤 필수 비치, 노출 즉시 응급실.'
    },
    {
      num: '05', color: COLORS.accent_purple,
      title: '폐액 처리는 법적 의무다',
      body: '불소 방류 기준 15 mg/L, 중금속 폐수는 배출 시설 허가 필요. 환경 규제 준수 = 공정 설계의 일부.'
    },
  ];

  summaries.forEach((s, i) => {
    const yBase = 1.88 + i * 0.92;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.82, rectRadius: 0.07,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.5, h: 0.82, fill: { color: s.color } });
    slide.addText(s.num, { x: 0.6, y: yBase + 0.24, w: 0.5, h: 0.32,
      fontSize: 13, fontFace: FONTS.kpi.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center' });
    slide.addText(s.title, { x: 1.22, y: yBase + 0.06, w: 11.3, h: 0.3,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    slide.addText(s.body, { x: 1.22, y: yBase + 0.38, w: 11.3, h: 0.38,
      fontSize: 10.5, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary });
  });

  // 전환
  slide.addShape('roundRect', { x: 0.6, y: 6.5, w: 12.13, h: 0.68, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('다음 섹션 3: 습식 에칭은 옆으로도 깎이는 한계가 있다 — 반도체는 이 한계를 어떻게 넘었는가?', {
    x: 0.8, y: 6.58, w: 11.8, h: 0.52,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan, align: 'center'
  });

  addPageNumber(slide, 24, TOTAL_SLIDES);
}

// ── 모듈 export (Part 2, Part 3가 사용) ───────────────────────────────────

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


// === 슬라이드 실행 ===
slide01_title();
slide02_learning_objectives();
slide03_section1_divider();
slide04_etching_definition();
slide05_spectrum_diagram();
slide06_three_concepts();
slide07_isotropy_vs_anisotropy();
slide08_undercut_etch_factor();
slide09_timeline();
slide10_section1_summary();
slide11_section2_divider();
slide12_wet_etching_mechanism();
slide13_etch_rate_factors();
slide14_glass_process_flow();
slide15_hf_principle();
slide16_hf_vs_boe();
slide17_glass_types();
slide18_metal_etching_cards();
slide19_pcb_copper_etching();
slide20_etch_factor_improvement();
slide21_masking_materials();
slide22_hf_safety();
slide23_waste_treatment();
slide24_section2_summary();
slide25_section3_divider();
slide26_semiconductor_flow();
slide27_wet_vs_dry_limit();
slide28_plasma_basics();
slide29_rie_diagram();
slide30_rie_parameters();
slide31_bosch_process();
slide32_icp_etching();
slide33_ale();
slide34_etching_gas_by_material();
slide35_3d_nand_etching();
slide36_section3_summary();
slide37_section4_divider();
slide38_chem_vs_physical();
slide39_sputter_etching();
slide40_fib();
slide41_laser_pulse_principle();
slide42_pulse_comparison_table();
slide43_laser_types_cards();
slide44_femtosecond_glass();
slide45_lipss();
slide46_sandblast_ecm();
slide47_femtosecond_haz_caveat();
slide48_section4_summary();
slide49_section5_divider();
slide50_material_matrix();
slide51_cost_comparison();
slide52_failure_modes();
slide53_decision_flowchart();
slide54_key_messages();
slide55_closing();

pptx.writeFile({ fileName: 'etching-seminar.pptx' })
  .then(() => console.log('저장 완료: etching-seminar.pptx'))
  .catch(err => console.error('저장 실패:', err));
