// === Part 1 시작 ===
const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const TOTAL_SLIDES = 47;

const COLORS = {
  bg_primary:    'FFFFFF',
  bg_secondary:  'F7F9FC',
  bg_dark:       '1A1F36',
  text_primary:  '1A1F36',
  text_secondary:'4A5568',
  text_tertiary: 'A0AEC0',
  text_on_dark:  'FFFFFF',
  accent_blue:   '4A7BF7',
  accent_cyan:   '00D4AA',
  accent_yellow: 'FFB020',
  accent_red:    'FF6B6B',
  accent_purple: '8B5CF6'
};

const FONTS = {
  title:    { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold',  bold: true },
  body:     { fontFace: 'Pretendard',            bold: false },
  caption:  { fontFace: 'Pretendard Light',      bold: false },
  serif:    { fontFace: 'ChosunNm',              bold: false },
  kpi:      { fontFace: 'Pretendard Black',      bold: true },
  deco:     { fontFace: 'Pretendard Thin',       bold: false },
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

// 카드 레이아웃 상수 (3개 KPI 카드)
const CARD_KPI_3 = [
  { x: 0.6, y: 2.2, w: 3.8, h: 1.4 },
  { x: 4.7, y: 2.2, w: 3.8, h: 1.4 },
  { x: 8.8, y: 2.2, w: 3.8, h: 1.4 },
];

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
      x: 0.6, y: 1.58, w: 12.13, h: 0.38,
      fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
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
    BAR:      pptx.charts.BAR,
    LINE:     pptx.charts.LINE,
    PIE:      pptx.charts.PIE,
    DOUGHNUT: pptx.charts.DOUGHNUT,
    AREA:     pptx.charts.AREA,
    RADAR:    pptx.charts.RADAR,
    SCATTER:  pptx.charts.SCATTER,
    BUBBLE:   pptx.charts.BUBBLE
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

// [01] Title
function slide01_title() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });

  // 배경 그라데이션 느낌 — 우하 빛 번짐 효과 (반투명 레이어)
  slide.addShape('roundRect', {
    x: 6.5, y: 3.5, w: 7.0, h: 5.0, rectRadius: 3.0,
    fill: { color: '0A3060' }, line: { color: '0A3060', width: 0 }
  });

  // 레이저 빔 장식선 (수평 빔)
  slide.addShape('rect', { x: 0, y: 3.1, w: 13.33, h: 0.03, fill: { color: COLORS.accent_blue } });
  slide.addShape('rect', { x: 0, y: 3.13, w: 13.33, h: 0.015, fill: { color: COLORS.accent_cyan } });

  // 좌측 세로 강조 바
  slide.addShape('rect', { x: 0.8, y: 1.6, w: 0.07, h: 3.0, fill: { color: COLORS.accent_blue } });

  // 상단 태그라인
  slide.addText('레이저 가공/프로세싱 엔지니어를 위한 심화 세미나', {
    x: 1.1, y: 1.55, w: 11.0, h: 0.45,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.accent_cyan
  });

  // 메인 타이틀
  slide.addText('초단파 레이저\n멀티도메인 어플리케이션', {
    x: 1.1, y: 2.0, w: 10.5, h: 2.2,
    fontSize: 44, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, charSpacing: -0.8, lineSpacingMultiple: 1.2
  });

  // 부제
  slide.addText('펨토/피코초 레이저의 산업·의료·과학 활용과 의사결정 가이드', {
    x: 1.1, y: 4.3, w: 10.5, h: 0.55,
    fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue
  });

  // 구분선
  slide.addShape('rect', { x: 1.1, y: 5.05, w: 5.0, h: 0.03, fill: { color: '3A4460' } });

  // 키워드 태그
  slide.addText('산업 제조  |  의료/안과  |  바이오/과학  |  시장 분석  |  TCO 의사결정', {
    x: 1.1, y: 5.2, w: 11.0, h: 0.4,
    fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary
  });

  // 날짜
  slide.addText('2026-03-25', {
    x: 1.1, y: 6.85, w: 4.0, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: '505878'
  });
}

// [02] USP 레이저 4개 도메인 개요
function slide02_overview() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'USP 레이저는 4개 도메인에서 혁신을 만들고 있다');

  const items = [
    {
      label: '산업 제조',
      color: COLORS.accent_blue,
      text: '반도체·디스플레이·배터리·EV 등 8대 어플리케이션에서 양산 확립\n→ 고반복률·GHz 버스트 모드가 처리속도와 품질 동시 달성'
    },
    {
      label: '의료',
      color: COLORS.accent_cyan,
      text: '안과(FS-LASIK, SMILE, FLACS) 임상 확립, 피부과 ps 레이저 표준화\n→ 서브-mm 정밀 절제로 생체 열손상 최소화'
    },
    {
      label: '바이오/과학',
      color: COLORS.accent_yellow,
      text: 'PLAL 나노입자 합성, 2PP 3D 나노프린팅, 아토초 과학(2023 노벨 물리학상)\n→ 극한 시공간 분해능으로 기초과학 패러다임 전환'
    },
    {
      label: '시장',
      color: COLORS.accent_purple,
      text: '$2.4~2.9B, CAGR 15~17% (2025~2031), 아시아-태평양 38% 1위\n→ 배터리·반도체 수요가 성장 엔진, 섬유 레이저가 점유율 확대 중'
    },
  ];

  items.forEach((item, i) => {
    const yBase = 1.9 + i * 1.22;
    // 카드 배경
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 1.1,
      rectRadius: 0.07, fill: { color: COLORS.bg_secondary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    // 좌측 색상 바
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 1.1, fill: { color: item.color } });
    // 번호
    slide.addText(`0${i + 1}`, {
      x: 0.62, y: yBase + 0.3, w: 0.27, h: 0.45,
      fontSize: 15, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center'
    });
    // 라벨
    slide.addText(item.label, {
      x: 1.1, y: yBase + 0.08, w: 2.0, h: 0.42,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });
    // 내용
    slide.addText(item.text, {
      x: 3.2, y: yBase + 0.08, w: 9.3, h: 0.92,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top'
    });
  });

  addPageNumber(slide, 2, TOTAL_SLIDES);
}

// [03] 학습 목표 5가지
function slide03_learning_objectives() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 프레젠테이션에서 얻어갈 5가지', '학습 목표');

  const goals = [
    {
      title: 'USP "콜드 어블레이션"의 근본 원리',
      body:  'HAZ 13배 감소가 어떻게 가능한지 — 전자-격자 열화 시간보다 짧은 펄스의 물리적 의미',
      color: COLORS.accent_blue
    },
    {
      title: '"fs > ps" 통념이 틀린 이유',
      body:  '재료별 열확산 시간 기반 최적 펄스폭 선택 — 비용과 성능의 실제 트레이드오프',
      color: COLORS.accent_cyan
    },
    {
      title: 'GHz 버스트 + kW급 고출력의 산업적 의의',
      body:  '처리 속도와 품질 동시 달성이 배터리·반도체 양산 진입을 어떻게 열었는가',
      color: COLORS.accent_yellow
    },
    {
      title: '산업/의료/과학 각 도메인의 성숙도',
      body:  '양산 확립 vs. 임상 확립 vs. 연구 단계 — 도메인별 현재 상태와 핵심 성과',
      color: COLORS.accent_purple
    },
    {
      title: 'TCO 관점의 도입 의사결정 가이드',
      body:  '역방향 조건-행동 테이블: "결과가 X이면 → Y를 선택하라" 프레임워크',
      color: COLORS.accent_red
    },
  ];

  goals.forEach((g, i) => {
    const yBase = 1.85 + i * 0.98;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 0.88,
      rectRadius: 0.07, fill: { color: i % 2 === 1 ? COLORS.bg_secondary : COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    // 번호 원형
    slide.addShape('roundRect', {
      x: 0.72, y: yBase + 0.17, w: 0.5, h: 0.5, rectRadius: 0.25,
      fill: { color: g.color }, line: { color: g.color, width: 0 }
    });
    slide.addText(`${i + 1}`, {
      x: 0.72, y: yBase + 0.17, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle'
    });
    slide.addText(g.title, {
      x: 1.38, y: yBase + 0.07, w: 10.2, h: 0.34,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });
    slide.addText(g.body, {
      x: 1.38, y: yBase + 0.43, w: 10.2, h: 0.36,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });

  addPageNumber(slide, 3, TOTAL_SLIDES);
}

// [04] 로드맵 플로우차트
function slide04_roadmap() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '원리 → 적용 → 선택 → 시장 → 의사결정 순서로 진행한다', '프레젠테이션 로드맵');

  // 배경 전체 패널
  slide.addShape('rect', {
    x: 0.6, y: 1.85, w: 12.13, h: 4.9,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });

  // 6개 스텝 박스 (가로 배열)
  const steps = [
    { label: 'Part B', title: 'USP 원리', sub: '콜드 어블레이션\nfs/ps/ns 비교', color: COLORS.accent_blue },
    { label: 'Part C', title: '산업 제조', sub: '8대 어플리케이션\n양산 실적', color: COLORS.accent_cyan },
    { label: 'Part D', title: '의료/과학', sub: '안과·피부과\nPLAL·2PP·아토초', color: COLORS.accent_yellow },
    { label: 'Part E', title: 'fs vs ps 선택', sub: '재료별 기준\nTCO 최적화', color: COLORS.accent_purple },
    { label: 'Part F', title: '시장', sub: '$2.4~2.9B\nCAGR 15~17%', color: COLORS.accent_red },
    { label: 'Part G', title: '의사결정', sub: '역방향 가이드\n도입 체크리스트', color: '38BDF8' },
  ];

  const boxW = 1.75;
  const boxH = 2.4;
  const startX = 0.75;
  const boxY = 2.2;
  const arrowY = boxY + boxH / 2 - 0.05;
  const gap = 0.28;  // 박스 사이 간격

  steps.forEach((s, i) => {
    const x = startX + i * (boxW + gap);

    // 박스
    slide.addShape('roundRect', {
      x, y: boxY, w: boxW, h: boxH, rectRadius: 0.1,
      fill: { color: COLORS.bg_primary },
      line: { color: s.color, width: 1.5 }
    });

    // 상단 색상 헤더 바
    slide.addShape('rect', {
      x, y: boxY, w: boxW, h: 0.55,
      fill: { color: s.color }
    });

    // Part 라벨
    slide.addText(s.label, {
      x, y: boxY + 0.04, w: boxW, h: 0.48,
      fontSize: 13, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle'
    });

    // 타이틀
    slide.addText(s.title, {
      x: x + 0.1, y: boxY + 0.65, w: boxW - 0.2, h: 0.5,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, align: 'center'
    });

    // 서브 설명
    slide.addText(s.sub, {
      x: x + 0.1, y: boxY + 1.2, w: boxW - 0.2, h: 1.1,
      fontSize: 10, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      align: 'center', lineSpacingMultiple: 1.4, valign: 'top'
    });

    // 화살표 (마지막 박스 제외)
    if (i < steps.length - 1) {
      const arrowX = x + boxW + 0.04;
      slide.addText('→', {
        x: arrowX, y: arrowY, w: gap + 0.01, h: 0.4,
        fontSize: 18, fontFace: FONTS.body.fontFace,
        color: COLORS.text_tertiary, align: 'center', valign: 'middle'
      });
    }
  });

  // 하단 메모
  slide.addText('각 Part는 독립적으로 참조 가능 — 필요한 섹션만 선택적으로 활용하라', {
    x: 0.6, y: 6.6, w: 12.13, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary, align: 'center'
  });

  addPageNumber(slide, 4, TOTAL_SLIDES);
}

// [05] Section Divider — Part B
function slide05_section_partB() {
  const slide = pptx.addSlide();

  // 좌 40% 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 60% 밝은 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 8.0, h: 7.5, fill: { color: COLORS.bg_secondary } });

  // 좌 — 섹션 번호
  slide.addText('Part B', {
    x: 0.5, y: 2.2, w: 4.5, h: 0.7,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });

  // 좌 — 섹션 타이틀
  slide.addText('USP 레이저는\n왜 다른가', {
    x: 0.5, y: 2.9, w: 4.5, h: 2.0,
    fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.2
  });

  // 좌 — 구분선
  slide.addShape('rect', { x: 0.5, y: 5.1, w: 3.5, h: 0.04, fill: { color: '3A4460' } });

  // 우 — 미리보기 제목
  slide.addText('이 파트에서 다루는 내용', {
    x: 5.8, y: 2.0, w: 6.8, h: 0.5,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  // 우 — 미리보기 항목
  const previews = [
    'ns vs ps vs fs: 펄스폭이 결정하는 모든 것 (HAZ·메커니즘·용도)',
    '"콜드 어블레이션"의 물리적 근거 — 전자-격자 열화 시간의 의미',
    '레이저 소스 종류별 특성: Ti:Sapphire / Yb:fiber / Yb:YAG / UV 변환',
    '고반복률(>1 MHz) 열 누적 현상 — 이상적 콜드 어블레이션 가정의 한계',
  ];

  previews.forEach((p, i) => {
    slide.addShape('roundRect', {
      x: 5.8, y: 2.65 + i * 1.0, w: 6.8, h: 0.85,
      rectRadius: 0.07, fill: { color: COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: 5.8, y: 2.65 + i * 1.0, w: 0.08, h: 0.85,
      fill: { color: [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple][i] }
    });
    slide.addText(p, {
      x: 6.05, y: 2.65 + i * 1.0 + 0.12, w: 6.4, h: 0.6,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      lineSpacingMultiple: 1.3, valign: 'top'
    });
  });
}

// [06] TwoColumn — USP 콜드 어블레이션 vs ns 레이저
function slide06_cold_ablation() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'USP는 열이 전달되기 전에 물질을 제거한다');

  const colY = 1.9;
  const colH = 4.6;
  const leftW = 5.9;
  const rightW = 6.0;
  const leftX = 0.6;
  const rightX = 6.8;

  // 좌 — 다크 패널 (ns 레이저)
  slide.addShape('roundRect', {
    x: leftX, y: colY, w: leftW, h: colH, rectRadius: 0.1,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 }
  });
  slide.addShape('rect', { x: leftX, y: colY, w: leftW, h: 0.5, fill: { color: COLORS.accent_red } });
  slide.addText('기존 ns 레이저 (열 가공)', {
    x: leftX + 0.2, y: colY + 0.06, w: leftW - 0.4, h: 0.38,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark
  });

  const nsPoints = [
    '열 용융/증발 메커니즘',
    'HAZ: 수십 ~ 수백 µm',
    '디브리·용융물 다량 발생',
    '재용착층(resolidification layer) 형성',
    '주변 구조물·소재에 열손상 전달',
  ];
  nsPoints.forEach((pt, i) => {
    slide.addShape('roundRect', {
      x: leftX + 0.18, y: colY + 0.65 + i * 0.74, w: leftW - 0.36, h: 0.62,
      rectRadius: 0.06, fill: { color: '252B45' }, line: { color: '3A4460', width: 0.5 }
    });
    slide.addShape('rect', {
      x: leftX + 0.18, y: colY + 0.65 + i * 0.74, w: 0.07, h: 0.62,
      fill: { color: COLORS.accent_red }
    });
    slide.addText(pt, {
      x: leftX + 0.35, y: colY + 0.65 + i * 0.74 + 0.12, w: leftW - 0.55, h: 0.36,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_on_dark
    });
  });

  // 우 — 밝은 패널 (USP 콜드 어블레이션)
  slide.addShape('roundRect', {
    x: rightX, y: colY, w: rightW, h: colH, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.75 }
  });
  slide.addShape('rect', { x: rightX, y: colY, w: rightW, h: 0.5, fill: { color: COLORS.accent_cyan } });
  slide.addText('USP 콜드 어블레이션 (fs/ps)', {
    x: rightX + 0.2, y: colY + 0.06, w: rightW - 0.4, h: 0.38,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  const uspPoints = [
    '다광자 이온화 → 쿨롱 폭발(Coulomb explosion)',
    'HAZ ≤ 1.5 µm (Al, fs 조건)',
    '디브리 극소 — 후처리 부담 대폭 감소',
    '재용착층 없음 — 클린 절단면',
    '핵심: 펄스폭 < 전자-격자 열화 시간(1~10 ps)',
  ];
  uspPoints.forEach((pt, i) => {
    slide.addShape('roundRect', {
      x: rightX + 0.18, y: colY + 0.65 + i * 0.74, w: rightW - 0.36, h: 0.62,
      rectRadius: 0.06, fill: { color: COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: rightX + 0.18, y: colY + 0.65 + i * 0.74, w: 0.07, h: 0.62,
      fill: { color: COLORS.accent_cyan }
    });
    slide.addText(pt, {
      x: rightX + 0.35, y: colY + 0.65 + i * 0.74 + 0.12, w: rightW - 0.55, h: 0.36,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });

  // 출처
  slide.addText('출처: MDPI Micromachines 2014; IntechOpen 2016', {
    x: 0.6, y: 6.7, w: 9.0, h: 0.28,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });

  addPageNumber(slide, 6, TOTAL_SLIDES);
}

// [07] Table — ns/ps/fs 3종 비교
function slide07_pulse_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'ns/ps/fs 레이저 3종 비교 — 펄스폭이 모든 차이를 만든다');

  const headers = ['구분', '나노초 (ns)', '피코초 (ps)', '펨토초 (fs)'];
  const dataRows = [
    ['펄스 폭', '10⁻⁹ s  (1 ns)', '10⁻¹² s  (1 ps)', '10⁻¹⁵ s  (1 fs)'],
    ['열-기계 결합', '강함 (열 전도 지배)', '약함 (경계선)', '거의 없음 (콜드 어블레이션)'],
    ['HAZ (Al 기준)', '수십 ~ 수백 µm', '수 µm', '≤ 1.5 µm (실측)'],
    ['가공 메커니즘', '열 용융/증발', '다광자 흡수 + 부분 열', '다광자 이온화, 쿨롱 폭발'],
    ['디브리/용융물', '많음 — 후처리 필수', '적음', '극소 — 클린 절단면'],
    ['주요 적용', '일반 절삭, 마킹, 조각', '정밀 마이크로머시닝', '초정밀, 세라믹/유리, 생체조직'],
  ];

  // 커스텀 테이블 (헤더 색상 분리)
  const rows = [];

  // 헤더 행
  rows.push(headers.map((h, hi) => ({
    text: h,
    options: {
      bold: true,
      fill: { color: hi === 0 ? COLORS.bg_dark : hi === 1 ? '3A4460' : hi === 2 ? '1A4060' : '0A3060' },
      color: COLORS.text_on_dark,
      fontFace: 'Pretendard', fontSize: 12, align: 'center', valign: 'middle'
    }
  })));

  // 데이터 행
  dataRows.forEach((row, ri) => {
    const isAlt = ri % 2 === 1;
    rows.push(row.map((cell, ci) => {
      const base = {
        fontFace: 'Pretendard', fontSize: 11,
        fill: { color: isAlt ? COLORS.bg_secondary : COLORS.bg_primary },
        color: ci === 0 ? COLORS.text_primary : COLORS.text_secondary,
        bold: ci === 0,
        valign: 'middle',
        align: ci === 0 ? 'left' : 'center'
      };
      return { text: cell, options: base };
    }));
  });

  slide.addTable(rows, {
    x: 0.6, y: 1.85, w: 12.13, h: 5.0,
    border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
    autoPage: false, margin: [6, 8, 6, 8],
    rowH: 0.68
  });

  addPageNumber(slide, 7, TOTAL_SLIDES);
}

// [08] KPI 카드 — HAZ 13배 차이
function slide08_haz_kpi() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'HAZ 13배 차이: Al에서 200 fs → 1.5 µm vs 8 ns → 20 µm');

  // KPI 카드 3개
  const cards = [
    {
      ...CARD_KPI_3[0],
      title: 'fs HAZ',
      kpi: '≤ 1.5 µm',
      sub: '200 fs 펄스\nAl 기준 실측값',
      color: COLORS.accent_blue
    },
    {
      ...CARD_KPI_3[1],
      title: 'ns HAZ',
      kpi: '20 µm',
      sub: '8 ns 펄스\nAl 기준 비교값',
      color: COLORS.accent_red
    },
    {
      ...CARD_KPI_3[2],
      title: '품질 차이',
      kpi: '13× 감소',
      sub: 'fs 채용 시\nHAZ 폭 기준',
      color: COLORS.accent_cyan
    },
  ];

  cards.forEach(c => {
    // 카드 배경
    slide.addShape('roundRect', {
      x: c.x, y: c.y, w: c.w, h: c.h, rectRadius: 0.1,
      fill: { color: COLORS.bg_primary }, line: { color: 'E2E8F0', width: 0.75 }
    });
    // 상단 컬러 바
    slide.addShape('rect', {
      x: c.x + 0.02, y: c.y, w: c.w - 0.04, h: 0.07,
      fill: { color: c.color }
    });
    // 타이틀
    slide.addText(c.title, {
      x: c.x + 0.2, y: c.y + 0.15, w: c.w - 0.4, h: 0.38,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_secondary, align: 'center'
    });
    // KPI 수치
    slide.addText(c.kpi, {
      x: c.x + 0.1, y: c.y + 0.52, w: c.w - 0.2, h: 0.65,
      fontSize: 34, fontFace: FONTS.kpi.fontFace, bold: true,
      color: c.color, align: 'center', autoFit: true
    });
    // 서브 텍스트
    slide.addText(c.sub, {
      x: c.x + 0.15, y: c.y + 1.18, w: c.w - 0.3, h: 0.55,
      fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
      align: 'center', lineSpacingMultiple: 1.3
    });
  });

  // 시각 비교 바 (비율 표현)
  const barY = 3.85;
  slide.addText('HAZ 폭 시각 비교 (Al, 상대적 크기)', {
    x: 0.6, y: barY, w: 12.13, h: 0.35,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  // fs 바
  slide.addShape('rect', { x: 0.6, y: barY + 0.45, w: 0.9, h: 0.45, fill: { color: COLORS.accent_blue } });
  slide.addText('fs: 1.5 µm', {
    x: 1.6, y: barY + 0.47, w: 4.0, h: 0.4,
    fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_primary
  });

  // ns 바 (13배)
  slide.addShape('rect', { x: 0.6, y: barY + 1.05, w: 11.0, h: 0.45, fill: { color: COLORS.accent_red } });
  slide.addText('ns: 20 µm', {
    x: 0.6, y: barY + 1.05, w: 10.9, h: 0.45,
    fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_on_dark, align: 'right', valign: 'middle'
  });

  // 출처 및 주의
  slide.addText('출처: MDPI Micromachines 2014 (200 fs vs 8 ns, Al 기준)', {
    x: 0.6, y: 6.55, w: 9.5, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });
  slide.addText('주의: 고반복률(>1 MHz) 시 열 누적으로 HAZ 증가 가능 — 파라미터 최적화 필수', {
    x: 0.6, y: 6.78, w: 12.0, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.accent_red
  });

  addPageNumber(slide, 8, TOTAL_SLIDES);
}

// [09] Content — 재료별 fs/ps 선택 기준
function slide09_material_selection() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '경계 조건: 재료에 따라 fs/ps 선택 기준이 달라진다');

  const items = [
    {
      title: '금속',
      body: '전자-격자 열화 시간 ~1~10 ps\n→ 10 ps 이하에서 fs와 ps 품질 차이 미미 — ps가 비용 효율적\n→ 단, 고반복률 공정에서는 열 누적 설계 필수',
      color: COLORS.accent_blue,
      example: 'Cu, Al, Ti, 스테인리스'
    },
    {
      title: '투명 유전체 (유리 / SiC)',
      body: '열확산 시간 50~100 ps\n→ ps도 fs와 유사한 냉간 절제 달성 가능\n→ OLED 유리 다이싱: 산업 표준 = ps (비용·신뢰성 우수)',
      color: COLORS.accent_cyan,
      example: '붕규산 유리, 사파이어, SiC'
    },
    {
      title: '생체 조직',
      body: '정밀도 요구 극대 — fs 필수\n→ 안과(FS-LASIK, SMILE, FLACS): 각막 절개 깊이 µm 수준 정밀 제어\n→ 신경외과, 조직 미세 절제 연구에서 fs 이외 대안 없음',
      color: COLORS.accent_yellow,
      example: '각막, 연조직, 신경 조직'
    },
    {
      title: '경계선 영역 (~10~50 ps)',
      body: '금속 기준 fs-ps 품질 차이가 작아지는 구간\n→ 비용 합리적 ps 선택 가능 — "최고 스펙(fs)"이 아닌 "적합 스펙"이 TCO 최적화\n→ 결정 기준: (요구 HAZ) vs (ps 장비 비용 절감분)',
      color: COLORS.accent_purple,
      example: 'PCB 다층 구조, 세라믹 복합재'
    },
  ];

  items.forEach((item, i) => {
    const yBase = 1.9 + i * 1.15;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 1.05,
      rectRadius: 0.07, fill: { color: i % 2 === 1 ? COLORS.bg_secondary : COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    // 색상 바
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 1.05, fill: { color: item.color } });
    // 재료명 라벨
    slide.addText(item.title, {
      x: 1.05, y: yBase + 0.07, w: 2.8, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });
    // 예시 태그
    slide.addShape('roundRect', {
      x: 1.05, y: yBase + 0.5, w: 2.8, h: 0.42,
      rectRadius: 0.05, fill: { color: item.color }, line: { color: item.color, width: 0 }
    });
    slide.addText(`ex) ${item.example}`, {
      x: 1.08, y: yBase + 0.5, w: 2.74, h: 0.42,
      fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.text_on_dark,
      valign: 'middle', align: 'center'
    });
    // 본문
    slide.addText(item.body, {
      x: 4.0, y: yBase + 0.07, w: 8.5, h: 0.9,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      lineSpacingMultiple: 1.35, valign: 'top'
    });
  });

  // 하단 요약
  slide.addShape('roundRect', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.6,
    rectRadius: 0.07, fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 }
  });
  slide.addText('"최고 스펙(fs)"이 아닌 "적합 스펙"이 TCO를 최적화한다', {
    x: 0.8, y: 6.52, w: 11.73, h: 0.56,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center', valign: 'middle'
  });

  addPageNumber(slide, 9, TOTAL_SLIDES);
}

// [10] TwoColumn — 고반복률 열 누적
function slide10_heat_accumulation() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '고반복률(>1 MHz)에서 "콜드 어블레이션" 가정이 깨진다');

  const colY = 1.9;
  const colH = 3.7;
  const leftX = 0.6;
  const leftW = 5.85;
  const rightX = 6.8;
  const rightW = 5.93;

  // 좌 — 저반복률 (이상적)
  slide.addShape('roundRect', {
    x: leftX, y: colY, w: leftW, h: colH, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_cyan, width: 1.5 }
  });
  slide.addShape('rect', { x: leftX, y: colY, w: leftW, h: 0.5, fill: { color: COLORS.accent_cyan } });
  slide.addText('단일 펄스 / 저반복률 (< 1 MHz)', {
    x: leftX + 0.2, y: colY + 0.06, w: leftW - 0.4, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  const lowRepPoints = [
    '펄스 간 열 확산 충분 — 완전 냉각',
    '이상적 콜드 어블레이션 구현',
    'HAZ 극소 — fs/ps 이론값에 근접',
    '연구용·정밀 가공 공정에 적합',
  ];
  lowRepPoints.forEach((pt, i) => {
    slide.addShape('roundRect', {
      x: leftX + 0.18, y: colY + 0.62 + i * 0.72, w: leftW - 0.36, h: 0.62,
      rectRadius: 0.06, fill: { color: COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: leftX + 0.18, y: colY + 0.62 + i * 0.72, w: 0.07, h: 0.62,
      fill: { color: COLORS.accent_cyan }
    });
    slide.addText(pt, {
      x: leftX + 0.35, y: colY + 0.62 + i * 0.72 + 0.12, w: leftW - 0.55, h: 0.38,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });

  // 우 — 고반복률 (열 누적)
  slide.addShape('roundRect', {
    x: rightX, y: colY, w: rightW, h: colH, rectRadius: 0.1,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_red, width: 1.5 }
  });
  slide.addShape('rect', { x: rightX, y: colY, w: rightW, h: 0.5, fill: { color: COLORS.accent_red } });
  slide.addText('고반복률 (> 1 MHz) — 열 누적 발생', {
    x: rightX + 0.2, y: colY + 0.06, w: rightW - 0.4, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark
  });

  const highRepPoints = [
    '펄스 간 열 잔류 — 누적 ΔT ~7,000°C 가능',
    'HAZ 이론값보다 실측값 훨씬 증가',
    '가공 균일성 저하, 미세 크랙 위험',
    '배터리 전극 롤투롤: 고속 + 균일성 상충',
  ];
  highRepPoints.forEach((pt, i) => {
    slide.addShape('roundRect', {
      x: rightX + 0.18, y: colY + 0.62 + i * 0.72, w: rightW - 0.36, h: 0.62,
      rectRadius: 0.06, fill: { color: COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: rightX + 0.18, y: colY + 0.62 + i * 0.72, w: 0.07, h: 0.62,
      fill: { color: COLORS.accent_red }
    });
    slide.addText(pt, {
      x: rightX + 0.35, y: colY + 0.62 + i * 0.72 + 0.12, w: rightW - 0.55, h: 0.38,
      fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
  });

  // 경고 박스
  slide.addShape('roundRect', {
    x: 0.6, y: 5.78, w: 12.13, h: 0.62,
    rectRadius: 0.07, fill: { color: 'FFF0F0' },
    line: { color: COLORS.accent_red, width: 1.5 }
  });
  slide.addShape('rect', {
    x: 0.6, y: 5.78, w: 0.3, h: 0.62,
    fill: { color: COLORS.accent_red }
  });
  slide.addText('설계 제약: 열 누적이 가공 파라미터(반복률·펄스 에너지·스캔 속도) 설계를 결정한다 — 파라미터 최적화 필수', {
    x: 1.05, y: 5.82, w: 11.5, h: 0.54,
    fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_red, valign: 'middle'
  });

  // 출처
  slide.addText('출처: De Gruyter 배터리 레이저 가공 리뷰', {
    x: 0.6, y: 6.72, w: 9.5, h: 0.25,
    fontSize: 9, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary
  });

  addPageNumber(slide, 10, TOTAL_SLIDES);
}

// [11] Content — USP 레이저 소스
function slide11_laser_sources() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'USP 레이저 소스: 섬유 레이저가 산업 주류를 장악 중');

  const sources = [
    {
      name: 'Ti:Sapphire',
      badge: '연구용 표준',
      badgeColor: COLORS.accent_purple,
      specs: '파장: 800 nm | 펄스폭: 수십 fs | 가격: 고가',
      pros: '최단 펄스·최고 첨두 출력 달성 가능',
      cons: '유지 복잡, MTBF 낮음, 산업 라인 부적합',
      share: ''
    },
    {
      name: 'Yb:Fiber (섬유 레이저)',
      badge: '산업 표준',
      badgeColor: COLORS.accent_cyan,
      specs: '파장: 1030/1064 nm | 펄스폭: 수백 fs ~ 수 ps | MTBF: 50,000시간+',
      pros: '점유율 ~46% — 생산라인 가동률 신뢰성',
      cons: '극초단 펄스(< 200 fs)는 구현 어려움',
      share: '~46%'
    },
    {
      name: 'Yb:YAG / Nd:YAG',
      badge: 'ps 레이저 주류',
      badgeColor: COLORS.accent_blue,
      specs: '파장: 1030/1064 nm | 펄스폭: 수 ps ~ 수십 ps',
      pros: 'fs 대비 비용 효율 우수, 고출력 확보 용이',
      cons: '초정밀 생체/반도체 응용에서 fs 대비 제한',
      share: ''
    },
    {
      name: 'UV 변환 (343/355 nm)',
      badge: '특수 용도',
      badgeColor: COLORS.accent_yellow,
      specs: '파장: 343 nm (Yb 3배) 또는 355 nm (Nd 3배)',
      pros: 'PCB·반도체·유기재료 전용 — 더 작은 초점 크기, 흡수율 향상',
      cons: '변환 손실 존재, 출력 제한',
      share: ''
    },
  ];

  sources.forEach((s, i) => {
    const yBase = 1.88 + i * 1.17;
    // 카드 배경
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 1.07,
      rectRadius: 0.07, fill: { color: i % 2 === 1 ? COLORS.bg_secondary : COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    // 색상 바
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 1.07, fill: { color: s.badgeColor } });

    // 레이저명
    slide.addText(s.name, {
      x: 1.05, y: yBase + 0.06, w: 3.5, h: 0.38,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });

    // 배지
    slide.addShape('roundRect', {
      x: 1.05, y: yBase + 0.55, w: 2.2, h: 0.38,
      rectRadius: 0.08, fill: { color: s.badgeColor }, line: { color: s.badgeColor, width: 0 }
    });
    slide.addText(s.badge, {
      x: 1.05, y: yBase + 0.55, w: 2.2, h: 0.38,
      fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_on_dark,
      align: 'center', valign: 'middle'
    });

    // 점유율 (있을 경우)
    if (s.share) {
      slide.addText(s.share, {
        x: 3.4, y: yBase + 0.53, w: 1.5, h: 0.42,
        fontSize: 22, fontFace: FONTS.kpi.fontFace, bold: true, color: s.badgeColor
      });
    }

    // 스펙
    slide.addText(s.specs, {
      x: 4.0, y: yBase + 0.06, w: 8.5, h: 0.38,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary
    });
    // 장단점
    slide.addText(`+ ${s.pros}    - ${s.cons}`, {
      x: 4.0, y: yBase + 0.5, w: 8.5, h: 0.45,
      fontSize: 11, fontFace: FONTS.body.fontFace, color: COLORS.text_primary,
      lineSpacingMultiple: 1.3
    });
  });

  // 하단 키 메시지
  slide.addShape('roundRect', {
    x: 0.6, y: 6.55, w: 12.13, h: 0.52,
    rectRadius: 0.06, fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 }
  });
  slide.addText('섬유 레이저 MTBF 50,000시간+ → 생산라인 가동률 신뢰성이 채택을 결정한다', {
    x: 0.8, y: 6.57, w: 11.73, h: 0.48,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center', valign: 'middle'
  });

  addPageNumber(slide, 11, TOTAL_SLIDES);
}

// [12] Section Divider — Part C
function slide12_section_partC() {
  const slide = pptx.addSlide();

  // 좌 40% 다크 배경
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 60% 밝은 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 8.0, h: 7.5, fill: { color: COLORS.bg_secondary } });

  // 좌 — 섹션 번호
  slide.addText('Part C', {
    x: 0.5, y: 2.0, w: 4.5, h: 0.7,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan
  });

  // 좌 — 섹션 타이틀
  slide.addText('산업 제조\n8대 핵심 어플리케이션', {
    x: 0.5, y: 2.7, w: 4.5, h: 2.1,
    fontSize: 30, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.2
  });

  // 좌 — 구분선
  slide.addShape('rect', { x: 0.5, y: 5.0, w: 3.5, h: 0.04, fill: { color: '3A4460' } });

  // 우 — 미리보기 제목
  slide.addText('8대 어플리케이션 미리보기', {
    x: 5.8, y: 1.5, w: 6.8, h: 0.5,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
  });

  const appList = [
    { num: '01', name: '반도체', detail: 'Via drilling, Wafer dicing, 결함 수리', color: COLORS.accent_blue },
    { num: '02', name: '디스플레이', detail: 'OLED 봉지 절단, μLED 리페어', color: COLORS.accent_cyan },
    { num: '03', name: '배터리/EV', detail: '전극 패터닝, 탭 용접, 롤투롤 고속 가공', color: COLORS.accent_yellow },
    { num: '04', name: '표면 텍스처링', detail: 'DLIP 구조 창출, 항마찰·항균 기능 부여', color: COLORS.accent_purple },
    { num: '05', name: '금속 정밀 가공', detail: '항공우주 Ni합금·Ti 드릴링', color: COLORS.accent_red },
    { num: '06', name: '세라믹/복합재', detail: 'SiC, Al₂O₃ 냉간 절제', color: COLORS.accent_blue },
    { num: '07', name: '유리 용접/접합', detail: 'LBGW — HAZ 없는 직접 본딩', color: COLORS.accent_cyan },
    { num: '08', name: '태양전지', detail: 'CIGS 스크라이빙, Si 다이싱', color: COLORS.accent_yellow },
  ];

  appList.forEach((app, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 5.8 + col * 3.55;
    const y = 2.15 + row * 1.2;

    slide.addShape('roundRect', {
      x, y, w: 3.3, h: 1.05,
      rectRadius: 0.07, fill: { color: COLORS.bg_primary },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', { x, y, w: 0.28, h: 1.05, fill: { color: app.color } });
    slide.addText(app.num, {
      x: x + 0.02, y: y + 0.28, w: 0.24, h: 0.45,
      fontSize: 10, fontFace: FONTS.kpi.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center'
    });
    slide.addText(app.name, {
      x: x + 0.38, y: y + 0.06, w: 2.7, h: 0.38,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary
    });
    slide.addText(app.detail, {
      x: x + 0.38, y: y + 0.47, w: 2.7, h: 0.48,
      fontSize: 10, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary,
      lineSpacingMultiple: 1.2
    });
  });
}

// === Part 1 끝 ===

function slide13_sic_dicing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'SiC 다이싱: 3가지 USP 공정이 재료 손실 30~40%를 해결한다');

  const headers = ['공정 방식', '레이저', '핵심 성과', '확신도'];
  const dataRows = [
    [
      '6패스 fs 레이어드 스텔스 다이싱',
      '펨토초 ~270 fs',
      '개질층 <8 µm, Ra 224 nm, 종횡비 9.85',
      '★★★'
    ],
    [
      '멀티포컬 ps 슬라이싱 (4-focal)',
      '피코초 1064 nm',
      'Ra 1.3→0.432 µm, 6인치 4H-SiC 분리',
      '★★'
    ],
    [
      '시간형상 펄스열 슬라이싱',
      '펨토초 (복굴절 결정)',
      '개질층 16.5 µm (재료 손실 최소화)',
      '★★'
    ],
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.75 });

  // 하단 출처/임계값 박스
  slide.addShape('rect', { x: 0.6, y: 5.3, w: 12.13, h: 1.55, fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('출처: MDPI JMMP SiC 리뷰 2025-12-19', {
    x: 0.8, y: 5.37, w: 11.7, h: 0.32,
    fontSize: 10, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.text_secondary
  });
  slide.addText('SiC 어블레이션 임계값: 2.35 J/cm² (개질) | 4.97 J/cm² (변환) | 1035 nm fs 기준', {
    x: 0.8, y: 5.72, w: 11.7, h: 0.32,
    fontSize: 10.5, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });
  slide.addText('재료 손실 30~40% 저감 = 고단가 SiC 웨이퍼 원가 절감의 핵심 레버', {
    x: 0.8, y: 6.07, w: 11.7, h: 0.32,
    fontSize: 10.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue
  });

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

function slide14_pcb_via_tsv() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'PCB/TSV 비아홀: UV fs로 직경 <10 µm, 종횡비 10:1 달성');

  const bullets = [
    { label: 'UV 펨토초 레이저(515 nm)', desc: 'MPI 기판 드릴링, HAZ 없음, 탄화 없음' },
    { label: '공정 파라미터', desc: '단일 펄스 에너지 3.4~8 µJ, 펄스 중첩률 96~98%' },
    { label: '피코초 레이저', desc: '2025년 현재 단일층 PCB 직경 <10 µm 홀, 0~2 µm 간격 실현' },
    { label: 'TSV 적용', desc: 'HBM 3D 패키징에서 삼성·SK하이닉스 배포 중 (Mordor 2026)' },
  ];

  const accentColors = [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: accentColors[i] } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 인사이트 박스
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_dark } });
  slide.addText('피코초 레이저가 나노초 대비 탄화를 완전히 제거 → 고밀도 HDI 기판 가능', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 14, TOTAL_SLIDES);
}

function slide15_display_oled_utg() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '디스플레이: OLED 형상 커팅 + UTG 필라멘테이션 4가지 핵심 성과');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'OLED 형상 커팅',
    body: 'UV fs 레이저, HAZ <10 µm, 카메라홀·비직선 형상, 픽셀 수리(인접 손상 없음)',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: 'PI/HC/PET 적층 커팅',
    body: 'UV ps 레이저(IceFyre 355-50, 1.25 MHz, ~10 ps, >50 W), 속도 >400 mm/s, HAZ <10 µm (LiM 2021 ★★★)',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'UTG 필라멘테이션',
    body: 'Bessel 빔/TOP Cleave 광학계, 내부 개질→제어 균열, 제로 테이퍼·제로 커프, 거울 표면, 속도 최대 1 m/s (TRUMPF ★★★)',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: '강화유리 주의',
    body: '화학적 강화유리 잔류응력 → 크랙 이탈 위험. 50 µm 미만 박판: 펄스 <1 ps 필요. 공정 윈도우 협소',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

function slide16_battery_electrode_patterning() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '배터리 전극 패터닝: kWh당 $1.3~1.5로 4C 충전 성능 2배');

  // 좌 컬럼
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 5.865, h: 4.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.75 } });
  slide.addText('기존 전극 (평면 구조)', {
    x: 0.75, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  const leftPoints = [
    'Li⁺ 이온 확산 거리 길어 → 고속 충전 한계',
    '두꺼운 전극 = 에너지 밀도 ↑ but 충전 속도 ↓',
    '기계적 다이커터: 버(burr)/박리 → 배터리 열화, 쇼트 위험',
  ];
  leftPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 0.8, y: 2.52 + i * 0.9, w: 5.5, h: 0.75,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.35
    });
  });

  // 우 컬럼
  slide.addShape('roundRect', { x: 6.865, y: 1.9, w: 5.865, h: 4.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('레이저 패터닝 전극 (마이크로채널)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue
  });
  const rightPoints = [
    'fs 레이저 어블레이션으로 기공·채널 구조 형성',
    'Li⁺ 이동 경로 단축 → NREL: 4C 충전 시 용량 최대 2배, 사이클 수명 향상',
    '경제성: 기존 생산라인 통합 시 비용 증가 ~$1.3~1.5/kWh (~2%)',
    'NREL BatMan 프로젝트: 160 mm 폭 양면 그라파이트 1,200 m+ 롤투롤 처리',
  ];
  rightPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 7.05, y: 2.52 + i * 0.78, w: 5.55, h: 0.68,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 경고 박스
  slide.addShape('roundRect', { x: 0.6, y: 6.05, w: 12.13, h: 0.72, rectRadius: 0.07,
    fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1.5 } });
  slide.addText('[양산 검증 필요 ★★] 벤치스케일 결과 — 롤투롤 균일성은 검증 초기 단계', {
    x: 0.8, y: 6.12, w: 11.7, h: 0.55,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_yellow
  });

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

function slide17_battery_cutting_welding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '배터리 전극 커팅 + 모듈 용접: 버 없는 고속 공정 확립');

  const bullets = [
    {
      label: '전극 노칭/슬리팅',
      desc: '120 W fs + 패스트 버스트 모드 (Luxinar LXR® USP) — 버 없는 고속 절삭',
      color: COLORS.accent_blue
    },
    {
      label: '세라믹 전해질 커팅',
      desc: 'LATP/LAGTP 경도·취성 → ps 레이저로 정밀 커팅',
      color: COLORS.accent_cyan
    },
    {
      label: '모듈 용접',
      desc: 'TRUMPF 1 kW USP 레이저 — 배터리 모듈 용접·냉각판 실링·알루미늄 코팅 전처리',
      color: COLORS.accent_yellow
    },
    {
      label: '부식 방지 처리',
      desc: '레이저 표면 활성화로 접착 전처리 대체',
      color: COLORS.accent_purple
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 출처 박스
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_dark } });
  slide.addText('TRUMPF 1kW USP (2024년 8월 출하, Fraunhofer ILT 검증 ★★★)', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

function slide18_lipss_texturing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LIPSS 표면 텍스처링: 5가지 기능성 표면을 레이저 한 번으로');

  // 행1: 3개 카드
  addCard(slide, {
    x: 0.6, y: 1.9, w: 3.87, h: 2.2,
    title: '초발수(Superhydrophobic)',
    body: '접촉각 >150°, 방오·방빙·방부식. 소재: STS, Al. 조건: fs/ps + 낮은 플루언스',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 4.73, y: 1.9, w: 3.87, h: 2.2,
    title: '저마찰(Tribology)',
    body: '주기적 기둥/홈 패턴. 금형 이형성·베어링 수명. STS 적용',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 8.86, y: 1.9, w: 3.87, h: 2.2,
    title: '항균(Antibacterial)',
    body: 'LIPSS + DLIP 조합. 식품·의료기기 표면. 금속·폴리머',
    accentColor: COLORS.accent_yellow
  });

  // 행2: 2개 카드
  addCard(slide, {
    x: 0.6, y: 4.3, w: 3.87, h: 2.2,
    title: '반사 저감(Anti-reflective)',
    body: 'fs 나노 구조. 광학 코팅 대체 가능. 유리·폴리머',
    accentColor: COLORS.accent_purple
  });

  addCard(slide, {
    x: 4.73, y: 4.3, w: 3.87, h: 2.2,
    title: '대면적 스케일업',
    body: 'Pulsar Photonics 폴리곤 스캐너 + 고출력 USP: 10 m²+ 처리 시스템 구축. 처리 속도 ~0.14 cm²/min (8×8 빔 어레이)',
    accentColor: COLORS.accent_red
  });

  addPageNumber(slide, 18, TOTAL_SLIDES);
}

function slide19_ghz_burst_milling() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'GHz 버스트 모드: Si 어블레이션 속도 23배 향상');

  // KPI 카드 3개
  const kpiCards = [
    { title: 'BiBurst 효과', value: '23× 속도 향상', color: COLORS.accent_blue, x: 0.6 },
    { title: 'MRR (>300 W)', value: '≥40 mm³/min', color: COLORS.accent_cyan, x: 4.73 },
    { title: '버스트 계층', value: '단일→MHz→GHz→BiBurst', color: COLORS.accent_yellow, x: 8.86 },
  ];

  kpiCards.forEach(k => {
    slide.addShape('roundRect', { x: k.x, y: 1.9, w: 3.87, h: 2.1, rectRadius: 0.1,
      fill: { color: COLORS.bg_dark }, line: { color: k.color, width: 2 } });
    slide.addShape('rect', { x: k.x + 0.02, y: 1.9, w: 3.83, h: 0.06,
      fill: { color: k.color } });
    slide.addText(k.title, {
      x: k.x + 0.2, y: 2.02, w: 3.47, h: 0.4,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_tertiary, align: 'center'
    });
    slide.addText(k.value, {
      x: k.x + 0.15, y: 2.52, w: 3.57, h: 1.2,
      fontSize: k.value.length > 12 ? 20 : 28,
      fontFace: FONTS.kpi.fontFace, bold: true,
      color: k.color, align: 'center', valign: 'middle', autoFit: true
    });
  });

  // 하단 비교 테이블
  const bHeaders = ['모드', '구성', '특성'];
  const bRows = [
    ['단일 펄스', '—', '최고 품질 / 낮은 MRR'],
    ['MHz 버스트 (~64.5 MHz)', '복수 펄스, MHz 간격', '품질 유지 + MRR↑'],
    ['GHz 버스트 (~2.5 GHz)', '복수 펄스, GHz 간격', 'MRR 대폭↑ / 일부 품질↓'],
    ['BiBurst (GHz in MHz)', 'GHz 군집 × MHz 반복', '공기이온화 방지 + 고속'],
  ];

  addStyledTable(slide, bHeaders, bRows, { y: 4.2, rowH: 0.42 });

  // 출처/주의
  slide.addShape('rect', { x: 0.6, y: 6.55, w: 12.13, h: 0.62,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('출처: EurekAlert/RIKEN 2023-04  |  주의: 재료 의존성 강함 — Cu, STS에서는 GHz가 단일 대비 MRR 낮을 수 있음', {
    x: 0.8, y: 6.62, w: 11.7, h: 0.45,
    fontSize: 10, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 19, TOTAL_SLIDES);
}

function slide20_ceramic_hard_brittle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '세라믹/경취성 소재: USP로 균열 저항 60% 개선');

  const bullets = [
    {
      label: '사파이어(LED 기판)',
      desc: 'fs 스텔스 다이싱 주류 — 비접촉 고속, 표면 데브리 없음',
      color: COLORS.accent_blue
    },
    {
      label: '석영(Quartz)',
      desc: 'fs 1단계 내부 개질 분리 → 균열 저항 60% 개선 (기계적 다이아몬드 절단 대비)',
      color: COLORS.accent_cyan
    },
    {
      label: '지르코니아(치과 보철)',
      desc: 'ps 텍스처링 → 친수성·생체적합성 향상',
      color: COLORS.accent_yellow
    },
    {
      label: '알루미나',
      desc: 'ps 폴리싱 → 나노입자 재결정화 → 서브마이크론 Ra 달성',
      color: COLORS.accent_purple
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 파라미터 노트
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('가공 파라미터: SiC 어블레이션 임계값 2.35 J/cm²(1035 nm, fs 기준). 결정 방위·도핑·편광 방향에 따라 품질 가변', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 10.5, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 20, TOTAL_SLIDES);
}

function slide21_glass_welding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'USP 유리 용접: 접합 강도가 모재를 초과한다');

  // 좌 컬럼
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 5.865, h: 4.1, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.75 } });
  slide.addText('기존 유리 접합', {
    x: 0.75, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  const leftPoints = [
    '접착제: 내열성/화학내성 한계, 두께 증가',
    '패스너/프레임: 설계 제약, 이물질 가능성',
    '유리-금속 직접 접합 불가',
  ];
  leftPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 0.8, y: 2.55 + i * 0.95, w: 5.5, h: 0.82,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.35
    });
  });

  // 우 컬럼
  slide.addShape('roundRect', { x: 6.865, y: 1.9, w: 5.865, h: 4.1, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('USP 레이저 용접 (ps 기반)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue
  });
  const rightPoints = [
    '다광자 흡수로 유리 내부에서만 국소 용융 → 계면 접합',
    '유리-유리 / 유리-세라믹 / 유리-금속(스테인리스, Al) 직접 접합',
    '기계적 파괴 테스트: 모재 파단 (용접부 강도 > 모재)',
    '산업 사례: Spectra-Physics IceFyre® 1064-50 (50 W IR ps) 시연 (★★, MKS AP52)',
  ];
  rightPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 7.05, y: 2.5 + i * 0.84, w: 5.55, h: 0.72,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 하단 박스
  slide.addShape('roundRect', { x: 0.6, y: 6.1, w: 12.13, h: 0.72, rectRadius: 0.07,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('센서 밀봉·의료기기 패키징·전자 케이스에 새로운 설계 자유도 제공. 광접촉(gap ≤ λ/4) 요구가 핵심 공정 과제', {
    x: 0.8, y: 6.17, w: 11.7, h: 0.55,
    fontSize: 11.5, fontFace: FONTS.body.fontFace,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 21, TOTAL_SLIDES);
}

function slide22_solar_scribing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '박막 태양전지 P1~P3 스크라이빙: 선폭 ≤25 µm 달성');

  const bullets = [
    {
      label: 'P1 (도전층)',
      desc: 'UV 레이저(355 nm), 펄스폭 <1 ps → 선폭 ≤25 µm',
      color: COLORS.accent_blue
    },
    {
      label: 'P2 (페로브스카이트/수송층)',
      desc: 'UV 레이저 필수 (IR 적용 불가 — 흡수 불충분, 하부 전극 손상)',
      color: COLORS.accent_cyan
    },
    {
      label: 'P3 (후면 전극 분리)',
      desc: 'HAZ 최소화로 인접 셀 광전 활성도 보존 → 모듈 직렬 저항 감소 → PCE 향상',
      color: COLORS.accent_yellow
    },
    {
      label: '반증 사례',
      desc: 'ns 레이저 P1에서 효율 12.5~21% 달성 사례 존재 → USP 대비 비용 분석 필요',
      color: COLORS.accent_red
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 노트
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('페로브스카이트 조성(할라이드 종류)에 따라 흡수 파장 최적점 달라짐', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 10.5, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 22, TOTAL_SLIDES);
}

function slide23_industry_maturity_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '산업 제조 8대 분야 성숙도 총괄');

  const headers = ['분야', '핵심 어플리케이션', '권장 레이저', '대표 성과', '성숙도'];
  const dataRows = [
    ['반도체', 'Si/SiC 다이싱, PCB 비아홀', 'fs/ps', 'SiC 개질층 <8 µm, 비아홀 <10 µm', '양산'],
    ['디스플레이', 'OLED 커팅, UTG 필라멘테이션', 'UV ps/fs', 'HAZ <10 µm, 속도 1 m/s', '양산'],
    ['배터리/EV', '전극 노칭·패터닝', 'fs (버스트)', '4C 용량 ~2배(벤치)', '양산 진입'],
    ['표면 텍스처링', 'LIPSS, 초발수/항균', 'fs/ps', '10 m²+ 대면적 시스템', '양산'],
    ['금속 마이크로머시닝', '고속 절삭·드릴링', 'ps (버스트)', 'MRR ≥40 mm³/min', '양산'],
    ['세라믹/경취성', '사파이어·석영·지르코니아', 'fs/ps', '균열 저항 60% 개선', '양산'],
    ['유리 용접', '유리-유리/유리-금속', 'ps', '모재 파단 강도', '산업화 초기'],
    ['태양전지', 'P1~P3 스크라이빙', 'UV fs/ps', '선폭 ≤25 µm', '양산 진입'],
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.85, rowH: 0.52 });

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

function slide24_section_d_divider() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 60% 밝은 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 8.0, h: 7.5, fill: { color: COLORS.bg_primary } });

  // 섹션 넘버
  slide.addText('SECTION D', {
    x: 0.4, y: 2.2, w: 4.5, h: 0.5,
    fontSize: 11, bold: true, color: COLORS.accent_cyan,
    fontFace: FONTS.body.fontFace, align: 'left'
  });

  // 섹션 타이틀
  slide.addText('의료·바이오·과학', {
    x: 0.4, y: 2.8, w: 4.5, h: 0.7,
    fontSize: 26, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace, align: 'left'
  });

  // 부제
  slide.addText('USP의 또 다른 전선', {
    x: 0.4, y: 3.6, w: 4.5, h: 0.45,
    fontSize: 15, bold: false, color: COLORS.text_secondary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });

  // 구분선
  slide.addShape('rect', { x: 0.4, y: 4.2, w: 2.5, h: 0.04, fill: { color: COLORS.accent_cyan } });

  // 우측 커버리지
  slide.addText('의료 3대 어플리케이션 임상 확립 + 바이오/기초과학 확장', {
    x: 5.7, y: 2.5, w: 7.1, h: 0.55,
    fontSize: 17, bold: true, color: COLORS.text_primary,
    fontFace: FONTS.subtitle.fontFace, align: 'left'
  });

  const coverageItems = [
    '안과: FS-LASIK · SMILE · FLACS — 임상 표준 확립',
    '피부과: 피코초 타투 제거 · 멜라스마 — ps가 ns 대비 세션 절반',
    '신경외과·치과·옵토포레이션 — 전임상·연구 단계',
    '바이오: PLAL 나노입자 · 2PP 3D 바이오프린팅 · 2광자 현미경',
    '기초과학: 아토초 과학(2023 노벨상) · 광원자시계 · LWFA',
    '산업 채택의 선행 사례로 읽는 의료 성숙 경로',
  ];

  coverageItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 5.7, y: 3.22 + i * 0.52, w: 7.1, h: 0.45,
      fontSize: 12.5, color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace, align: 'left'
    });
  });
}


function slide25_ophthalmology() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '안과: fs 레이저 3대 수술이 임상 표준으로 확립되었다');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'FS-LASIK',
    body: 'fs로 각막 플랩 생성 → 엑시머로 스트로마 절제. 파라미터: 100 fs~10 ps, 5~50 µJ, 20~200 kHz. 마이크로케라톰 대비 플랩 두께·재현성 우수',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: 'SMILE',
    body: 'fs 레이저 단독, 소절개창 2~4 mm. 42명 RCT(ASCRS 2024): SMILE vs Contoura LASIK 3개월 나안시력 통계적 동등. 각막 전방 스트로마 보존 → 생체역학 안정 ★★★',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'FLACS (백내장)',
    body: '낭원절개 정밀도 우수. CDE 33~70% 감소. 후낭파열 0건(수동 2건). 비용: 시스템 수억원+. 주의: 학습 곡선 초기 후낭파열률 최대 7.5%',
    accentColor: COLORS.accent_yellow
  });

  addPageNumber(slide, 25, TOTAL_SLIDES);
}

function slide26_dermatology() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '피코초가 나노초 대비 타투 제거 세션을 절반으로 줄인다');

  // 좌측 패널
  slide.addShape('roundRect', {
    x: 0.6, y: 1.9, w: 5.9, h: 5.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addText('피코초 레이저 (300~900 ps)', {
    x: 0.8, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_cyan
  });
  const leftItems = [
    '기전: 광음향(photomechanical disruption) — 멜라노솜 미세분쇄',
    '세션 수: 4~8회, 최대 90% 제거',
    '파장: 755/1064 nm (PicoSure, PicoWay)',
    'Fitzpatrick IV~VI형에서도 안전',
    '2024: 2회 후 평균 61% 제거 ★★★'
  ];
  leftItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 0.8, y: 2.52 + i * 0.75, w: 5.5, h: 0.65,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 우측 패널
  slide.addShape('roundRect', {
    x: 6.815, y: 1.9, w: 5.915, h: 5.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addText('Q-스위치 나노초 (5~20 ns)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_secondary
  });
  const rightItems = [
    '기전: 광열 효과(photothermal)',
    '세션 수: 8~12회, 50~75% 제거',
    '파장: 1064/532 nm',
    'Fitzpatrick V~VI형 색소 위험 ↑',
    '반증: 황색·형광 색상에서 ps/ns 차이 미미 ★★'
  ];
  rightItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 7.0, y: 2.52 + i * 0.75, w: 5.5, h: 0.65,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 하단 메모
  slide.addText('멜라스마: ps Nd:YAG 1064 nm MASI 개선 35.9% vs ps alex 755 nm 25.5%. 병합요법(ps+트라넥삼산) 1,182명 메타분석 최고 효능 ★★★', {
    x: 0.6, y: 7.0, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary
  });

  addPageNumber(slide, 26, TOTAL_SLIDES);
}

function slide27_neuro_dental() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전임상/연구: 뇌전증 87% 발작 감소, 단일세포 유전자 전달');

  const bullets = [
    '신경외과 — 뇌전증: Cornell 2024, fs 레이저 피질절개 ~20 µm. 발작 87% 감소, 전파 95% 차단. ⚠️ 마우스 모델 ★ — 인간 전환 불확실',
    '치과: 에나멜·상아질 절제 정밀도 확인. 치명적 장벽: AR(절제율)이 임상 요구치에 미달 — 현재 연구 단계',
    '옵토포레이션: 단일세포 선택적 기공 형성 → 유전자/단백질 전달. MCF-7 단일세포 형질전환 실증. CRISPR 전달 벡터 대체 연구',
    'LIBS: 레이저 플라스마 발광 스펙트럼 → 수술 중 암 조직 vs 정상 조직 실시간 구분 연구 중'
  ];

  const accentColors = [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple];

  bullets.forEach((text, i) => {
    const yBase = 2.05 + i * 1.1;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 0.95, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: 0.6, y: yBase, w: 0.3, h: 0.95,
      fill: { color: accentColors[i] }
    });
    slide.addText(text, {
      x: 1.05, y: yBase + 0.1, w: 11.5, h: 0.75,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

function slide28_bio_nano() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '바이오: PLAL 나노입자부터 2PP 나노 3D 프린팅까지');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'PLAL 나노입자',
    body: 'fs레이저+액체→플라스마→나노입자. Fe-Au: MRI+CT+NIR 광열 in vitro 100% 암세포 사멸. TiN ~30 nm: 640~700 nm 광열치료 ★★★',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: '2광자 중합 (2PP)',
    body: 'fs 고피크강도 → 초점에서만 2광자 흡수. 해상도 ~100 nm (회절한계 이하). 3D 바이오스캐폴드, 신경세포 가이드, pH 반응형 마이크로그리퍼',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: '2광자 현미경',
    body: 'NIR fs → 심부 조직 이미징. FACED: 400 Hz 전압 이미징, 투과 >800 µm 피질. miniBB2p 헤드피스 2.6 g (Nature Commun. 2025)',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: 'LWFA 방사선치료',
    body: '레이저 웨이크필드 가속 100 GV/m. FLASH 방사선치료 전임상 진입(INRS 2023). VHEE >100 MeV, 정상조직 선량 20~70% 감소(시뮬레이션). ★★ 5~10년 상용화',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

function slide29_science_timeline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '기초과학: 아토초 → 주파수 빗 → 초고속 분광 → 산업 연결');

  const boxes = [
    {
      x: 0.6, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_blue,
      title: '아토초 과학',
      content: 'HHG로 250 as 펄스 생성\n2023 노벨 물리학상\n전자 동역학 실시간 관측\nXUV→반도체 메트롤로지'
    },
    {
      x: 3.9, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_cyan,
      title: '주파수 빗',
      content: '모드잠금 레이저\n다중 종모드 위상 동기\n광학 원자시계 18자리\nGPS보다 수십억 배 정확'
    },
    {
      x: 7.2, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_yellow,
      title: '초고속 분광',
      content: '펌프-프로브 fs 분해\n화학반응 중간체 관측\n단백질 구조변화 관측\nCARS 현미경'
    },
    {
      x: 10.5, y: 2.2, w: 2.23, h: 3.8,
      fill: COLORS.accent_purple,
      title: '산업 연결',
      content: 'HHG 기반 XUV\n→ 반도체 EUV\n마스크 검사 개시\n기초→산업 가속 중'
    }
  ];

  boxes.forEach((box) => {
    slide.addShape('roundRect', {
      x: box.x, y: box.y, w: box.w, h: box.h, rectRadius: 0.1,
      fill: { color: box.fill }, line: { color: box.fill, width: 0.5 }
    });
    slide.addText(box.title, {
      x: box.x + 0.1, y: box.y + 0.15, w: box.w - 0.2, h: 0.45,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_on_dark, align: 'center'
    });
    slide.addText(box.content, {
      x: box.x + 0.1, y: box.y + 0.7, w: box.w - 0.2, h: 3.0,
      fontSize: 10.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_on_dark, lineSpacingMultiple: 1.5
    });
  });

  // 화살표
  slide.addText('→', {
    x: 3.4, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue, align: 'center'
  });
  slide.addText('→', {
    x: 6.7, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('→', {
    x: 10.0, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_yellow, align: 'center'
  });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

function slide30_medical_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '의료/바이오/과학 성숙도 총괄');

  const headers = ['분야', '어플리케이션', '레이저', '성숙도'];
  const dataRows = [
    ['안과', 'FS-LASIK, SMILE, FLACS', 'fs', '임상 확립'],
    ['피부과', '타투 제거, 멜라스마', 'ps (755/1064 nm)', '임상 확립'],
    ['치과', '경조직 절제', 'fs', '연구 단계 (속도 미달)'],
    ['신경외과', '뇌전증 피질절개', 'fs', '전임상 ★ (마우스)'],
    ['세포 조작', '옵토포레이션', 'fs', '연구'],
    ['나노입자(PLAL)', 'Au/Fe-Au/TiN 합성', 'fs', '연구→상용화'],
    ['2PP', '3D 바이오스캐폴드', 'fs', '연구→상용화'],
    ['2광자 현미경', 'in vivo 뇌 이미징', 'fs', '연구 표준'],
    ['아토초/HHG', '전자 동역학, XUV 광원', 'fs', '연구 인프라'],
    ['LWFA', 'FLASH 방사선치료 전임상', 'fs (TW~PW)', '전임상']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.38 });

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

function slide31_section_e() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 좌측 텍스트
  slide.addText('Part E', {
    x: 0.3, y: 2.2, w: 4.7, h: 0.9,
    fontSize: 42, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark
  });
  slide.addText('펨토초 vs 피코초\n무엇을 선택할 것인가', {
    x: 0.3, y: 3.2, w: 4.7, h: 1.2,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.4
  });

  // 우측 텍스트
  slide.addText("핵심 메시지: 'fs가 항상 ps보다 우월하다'는 통념은 틀렸다", {
    x: 5.63, y: 2.6, w: 7.0, h: 0.7,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  slide.addText('재료·요구사항이 선택을 결정한다', {
    x: 5.63, y: 3.4, w: 7.0, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });
}

function slide32_fs_ps_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'fs vs ps 물리적 차이 — 실측 데이터 기반');

  const headers = ['지표', '펨토초 (fs)', '피코초 (ps)', '출처/비고'];
  const dataRows = [
    ['대표 펄스폭', '50~500 fs', '1~100 ps', '—'],
    ['HAZ (Al, 실측)', '≤1.5 µm', '2~5 µm', 'MDPI Micromachines 2014 ★★★'],
    ['Ra (금속)', '0.02~0.1 µm', '0.1~0.5 µm', '복수 학술 출처'],
    ['처리 속도', '기준', '15~30% 빠름', '⚠️ [제조사 주장: opmtlaser.com]'],
    ['MRR (금속, >300 W)', '낮음~중간', '0.1~1 mm³/min/W', '고부피 제거 ps 우위'],
    ['초기 투자비', '매우 높음', '높음 (fs 대비 저렴)', '—']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9 });

  slide.addText('금속 10~50 ps 경계: fs와 ps 품질 차이 미미 → ps가 비용 합리적', {
    x: 0.6, y: 6.35, w: 12.13, h: 0.45,
    fontSize: 12, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue
  });

  addPageNumber(slide, 32, TOTAL_SLIDES);
}

function slide33_decision_flow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '재료별 경계 조건 의사결정 플로우');

  // 시작 박스
  slide.addShape('roundRect', {
    x: 0.6, y: 2.0, w: 2.5, h: 0.6, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0.5 }
  });
  slide.addText('가공 재료는?', {
    x: 0.6, y: 2.0, w: 2.5, h: 0.6,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark, align: 'center', valign: 'middle'
  });

  // 화살표
  slide.addText('↓', {
    x: 0.6, y: 2.65, w: 2.5, h: 0.35,
    fontSize: 18, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.text_secondary, align: 'center'
  });

  // 4개 분기 박스
  const branches = [
    {
      x: 0.3, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '금속\n(Fe/Al/Cu/Ti)',
      content: '10 ps 이하 → fs/ps 품질 유사\n공차 ±0.005 mm / Ra<0.1 µm → fs\n그 외 → ps (비용 효율)'
    },
    {
      x: 3.4, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '투명 유전체\n(유리/사파이어)',
      content: '양산 처리량 우선 → ps (Bessel+필라멘테이션)\nOLED 유리 ps 표준\n특수 박막 → fs'
    },
    {
      x: 6.5, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '생체조직',
      content: '항상 fs 필수\n안과·신경외과\n조직 정밀도 요구'
    },
    {
      x: 9.6, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '반도체/\n복합소재',
      content: '서브-10 µm / HAZ<1 µm → fs\n양산 다이싱 → ps\nCFRP 열응력 → fs'
    }
  ];

  branches.forEach((branch) => {
    slide.addShape('roundRect', {
      x: branch.x, y: branch.y, w: branch.w, h: branch.h, rectRadius: 0.08,
      fill: { color: branch.fill }, line: { color: 'E2E8F0', width: 0.75 }
    });
    slide.addText(branch.title, {
      x: branch.x + 0.1, y: branch.y + 0.12, w: branch.w - 0.2, h: 0.7,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, lineSpacingMultiple: 1.3
    });
    slide.addText(branch.content, {
      x: branch.x + 0.1, y: branch.y + 0.9, w: branch.w - 0.2, h: 1.75,
      fontSize: 10, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.4
    });
  });

  addPageNumber(slide, 33, TOTAL_SLIDES);
}

function slide34_application_matrix() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '어플리케이션별 fs/ps 선택 매트릭스');

  const headers = ['어플리케이션', '권장', '이유', '확신도'];
  const dataRows = [
    ['의료기기 (스텐트·카테터)', 'fs', 'HAZ <1 µm, 생체적합성 유지 필수', '★★★'],
    ['MEMS/반도체 서브-10 µm', 'fs', '크랙·리캐스트층 최소화', '★★★'],
    ['안과 수술 (LASIK·백내장)', 'fs', '조직 정밀 절제', '★★★'],
    ['항공우주 CFRP', 'fs', '열 응력 임계', '★★'],
    ['EV 배터리 전극 구조화', 'fs (고반복률)', '롤투롤, 열 제어 필수', '★★'],
    ['2광자 중합(2PP)', 'fs', '비선형 흡수 필수', '★★★'],
    ['PCD 공구 제작 (자동차)', 'ps', '처리속도+비용 효율 [제조사 주장]', '★★★'],
    ['OLED/FPD 디스플레이 유리', 'ps', 'fs 불필요, 비용 우위, 생산라인 적합', '★★★'],
    ['유리/사파이어 절단 (양산)', 'ps', '50~100 ps 유리도 냉간 절제 달성', '★★★'],
    ['반도체 다이싱 (양산)', 'ps', '높은 처리량, 자동화', '★★'],
    ['텍스처링·마킹 (금속)', 'ps', '속도·비용 균형', '★★★'],
    ['고정밀 금형 마이크로 피처', 'fs', 'Ra <0.1 µm 요구', '★★'],
    ['연구/시간분해 분광/양자', 'fs', '시간 분해능 핵심', '★★★']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.33 });

  addPageNumber(slide, 34, TOTAL_SLIDES);
}

function slide35_oled_case() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'OLED 유리 절단: ps가 fs를 이긴다 — 칩핑 5 µm, 조도 0.343 µm');

  // KPI 카드 3개
  addCard(slide, {
    x: 0.6, y: 1.9, w: 3.8, h: 1.4,
    title: 'ps 칩핑',
    body: '~5 µm',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 4.77, y: 1.9, w: 3.8, h: 1.4,
    title: 'ps 조도',
    body: 'Ra 0.343 µm',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 8.93, y: 1.9, w: 3.8, h: 1.4,
    title: '처리량',
    body: 'ps 우위',
    accentColor: COLORS.accent_yellow
  });

  // 비교 테이블
  const headers = ['요소', '피코초', '펨토초'];
  const dataRows = [
    ['칩핑', '~5 µm', '거의 없음'],
    ['표면 조도', '0.343 µm (Bessel+CO₂)', '서브마이크론'],
    ['두께 적용성', '0.1~6+ mm 검증', '주로 박막 전문'],
    ['처리량', '높음 (50 kHz, 70 W)', '낮음 (R&D 중심)'],
    ['생산라인 적합성', '우수', '제한적']
  ];

  addStyledTable(slide, headers, dataRows, { y: 3.5, w: 12.13 });

  slide.addText('결론: ps의 \'적합 스펙\'이 OLED 양산 표준 — 초과 스펙(fs) 불필요', {
    x: 0.6, y: 6.65, w: 12.13, h: 0.45,
    fontSize: 12, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 35, TOTAL_SLIDES);
}

function slide36_section_f() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 좌측 텍스트
  slide.addText('Part F', {
    x: 0.3, y: 2.2, w: 4.7, h: 0.9,
    fontSize: 42, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark
  });
  slide.addText('시장과 기술은\n어디로 가고 있는가', {
    x: 0.3, y: 3.2, w: 4.7, h: 1.2,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.4
  });

  // 우측 텍스트
  slide.addText('시장 규모 + 성장 드라이버 + 최신 기술 + 신흥 어플리케이션', {
    x: 5.63, y: 2.8, w: 7.0, h: 0.9,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.4
  });
}


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

slide01_title();
slide02_overview();
slide03_learning_objectives();
slide04_roadmap();
slide05_section_partB();
slide06_cold_ablation();
slide07_pulse_comparison();
slide08_haz_kpi();
slide09_material_selection();
slide10_heat_accumulation();
slide11_laser_sources();
slide12_section_partC();
slide13_sic_dicing();
slide14_pcb_via_tsv();
slide15_display_oled_utg();
slide16_battery_electrode_patterning();
slide17_battery_cutting_welding();
slide18_lipss_texturing();
slide19_ghz_burst_milling();
slide20_ceramic_hard_brittle();
slide21_glass_welding();
slide22_solar_scribing();
slide23_industry_maturity_summary();
slide24_section_d_divider();
slide25_ophthalmology();
slide26_dermatology();
slide27_neuro_dental();
slide28_bio_nano();
slide29_science_timeline();
slide30_medical_summary();
slide31_section_e();
slide32_fs_ps_comparison();
slide33_decision_flow();
slide34_application_matrix();
slide35_oled_case();
slide36_section_f();
slide37_market_kpi();
slide38_growth_drivers();
slide39_burst_kw();
slide40_emerging_apps();
slide41_china_market();
slide42_section_g();
slide43_tco_comparison();
slide44_reverse_decision();
slide45_failure_modes();
slide46_followup_questions();
slide47_closing();

pptx.writeFile({ fileName: 'presentation-build/2026-03-25-ultrafast-laser-applications/ultrafast-laser.pptx' }).then(() => console.log('저장 완료')).catch(err => console.error('오류:', err));
