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
