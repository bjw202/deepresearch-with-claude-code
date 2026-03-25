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
module.exports = {
  pptx,
  COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE,
  addTitleBar, addStyledTable, addTitledTable, addStyledChart, addCard, addPageNumber,
  TOTAL_SLIDES,
  slide01_title,
  slide02_learning_objectives,
  slide03_section1_divider,
  slide04_etching_definition,
  slide05_spectrum_diagram,
  slide06_three_concepts,
  slide07_isotropy_vs_anisotropy,
  slide08_undercut_etch_factor,
  slide09_timeline,
  slide10_section1_summary,
  slide11_section2_divider,
  slide12_wet_etching_mechanism,
  slide13_etch_rate_factors,
  slide14_glass_process_flow,
  slide15_hf_principle,
  slide16_hf_vs_boe,
  slide17_glass_types,
  slide18_metal_etching_cards,
  slide19_pcb_copper_etching,
  slide20_etch_factor_improvement,
  slide21_masking_materials,
  slide22_hf_safety,
  slide23_waste_treatment,
  slide24_section2_summary,
};
// === Part 1 끝 ===
