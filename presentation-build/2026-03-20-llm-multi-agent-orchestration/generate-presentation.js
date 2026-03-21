const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== DESIGN SYSTEM =====
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

const FONTS = {
  title: { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body: { fontFace: 'Pretendard', bold: false },
  caption: { fontFace: 'Pretendard Light', bold: false },
  serif: { fontFace: 'ChosunNm', bold: false },
  kpi: { fontFace: 'Pretendard Black', bold: true },
};

const CHART_STYLE = {
  base: {
    showTitle: false,
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
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8'],
};

const TABLE_STYLE = {
  header: {
    bold: true,
    fill: { color: COLORS.bg_dark },
    color: COLORS.text_on_dark,
    fontFace: 'Pretendard',
    fontSize: 11,
    align: 'center',
    valign: 'middle',
  },
  cell: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    valign: 'middle',
  },
  cellRight: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    align: 'right',
    valign: 'middle',
  },
  cellAlt: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    fill: { color: COLORS.bg_secondary },
    valign: 'middle',
  },
  cellCenter: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    align: 'center',
    valign: 'middle',
  },
};

const TABLE_OPTIONS = {
  x: 0.6,
  y: 1.8,
  w: 12.13,
  border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
  autoPage: false,
  margin: [5, 8, 5, 8],
};

// ===== HELPER FUNCTIONS =====
let slideCount = 0;
const totalSlides = 52;

function addPageNumber(slide) {
  slideCount++;
  slide.addText(`${slideCount} / ${totalSlides}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right',
  });
}

function addTitleBar(slide, title, subtitle) {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue },
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 10, h: 0.6,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.25, w: 10, h: 0.4,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_tertiary,
    });
  }
}

function addStyledTable(slide, headers, dataRows, opts = {}) {
  const rows = [];
  rows.push(headers.map(h => ({ text: h, options: { ...TABLE_STYLE.header } })));
  dataRows.forEach((row, i) => {
    const isAlt = i % 2 === 1;
    const baseStyle = isAlt ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    rows.push(
      row.map(cell => {
        if (typeof cell === 'string') return { text: cell, options: { ...baseStyle } };
        return { text: cell.text, options: { ...baseStyle, ...cell.options } };
      })
    );
  });
  slide.addTable(rows, { ...TABLE_OPTIONS, ...opts });
}

function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 },
  });
  slide.addShape('rect', {
    x: x + 0.02, y, w: w - 0.04, h: 0.06,
    fill: { color: accentColor || COLORS.accent_blue },
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.35,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary,
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top',
  });
}

function addStyledChart(slide, type, chartData, opts = {}) {
  const typeMap = {
    BAR: pptx.charts.BAR, LINE: pptx.charts.LINE, PIE: pptx.charts.PIE,
    DOUGHNUT: pptx.charts.DOUGHNUT, AREA: pptx.charts.AREA,
    RADAR: pptx.charts.RADAR,
  };
  const defaults = {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    ...CHART_STYLE.base,
    chartColors: CHART_STYLE.colors.slice(0, chartData.length || 6),
    ...opts,
  };
  if (type === 'BAR') {
    defaults.barGapWidthPct = 80;
    defaults.catAxisOrientation = 'minMax';
    defaults.valAxisOrientation = 'minMax';
  }
  if (type === 'LINE') {
    defaults.lineDataSymbol = 'circle';
    defaults.lineDataSymbolSize = 8;
  }
  if (type === 'DOUGHNUT') {
    defaults.showPercent = true;
    defaults.showLegend = true;
    defaults.legendPos = 'b';
    defaults.chartColors = CHART_STYLE.colors.slice(0, chartData[0]?.values?.length || 6);
  }
  slide.addChart(typeMap[type], chartData, defaults);
}

// Two Column constants
const COL_W = 5.865;
const COL_GAP = 0.4;
const COL_LEFT_X = 0.6;
const COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP;

// Card Grid constants
const CARD_2X2 = {
  w: 5.915, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 },
  ],
};
const CARD_2X3 = {
  w: 3.843, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 4.743, y: 4.55 }, { x: 8.886, y: 4.55 },
  ],
};

// ============================================================
// SLIDE 1: Title
// ============================================================
function slide01_title() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('자체 호스팅 LLM을\n멀티에이전트 시스템으로 확장할 수 있다', {
    x: 1.5, y: 2.5, w: 10.33, h: 1.5,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.2,
  });
  slide.addText('Qwen3-235B-A22B 기반 멀티에이전트 오케스트레이션 아키텍처 리서치', {
    x: 1.5, y: 4.2, w: 10.33, h: 0.6,
    fontSize: 18, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center',
  });
  slide.addText('2026-03-20', {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center',
  });
  addPageNumber(slide);
}

// ============================================================
// SLIDE 2: TOC
// ============================================================
function slide02_toc() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 프레젠테이션은 6개 섹션으로 구성되어 있다');
  const sections = [
    { num: '01', title: '배경 및 문제 정의', desc: '왜 멀티에이전트가 필요한가' },
    { num: '02', title: '모델 성능 분석', desc: 'Qwen3-235B-A22B의 강점과 약점' },
    { num: '03', title: '프레임워크 비교 분석', desc: '6개 프레임워크의 아키텍처와 호환성' },
    { num: '04', title: '구현 아키텍처', desc: 'MVP부터 프로덕션까지의 설계' },
    { num: '05', title: '리스크 및 검증', desc: '상충점, 실패 모드, 검증 전략' },
    { num: '06', title: '액션 플랜', desc: '검증 → MVP → 확장의 3단계' },
  ];
  sections.forEach((s, i) => {
    const y = 1.9 + i * 0.85;
    slide.addText(s.num, {
      x: 0.8, y, w: 0.8, h: 0.55,
      fontSize: 22, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: CHART_STYLE.colors[i], valign: 'middle',
    });
    slide.addText(s.title, {
      x: 1.8, y, w: 4, h: 0.35,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary,
    });
    slide.addText(s.desc, {
      x: 1.8, y: y + 0.35, w: 8, h: 0.3,
      fontSize: 14, fontFace: 'Pretendard',
      color: COLORS.text_tertiary,
    });
    if (i < sections.length - 1) {
      slide.addShape('line', {
        x: 1.8, y: y + 0.75, w: 10.5, h: 0,
        line: { color: 'E2E8F0', width: 0.5 },
      });
    }
  });
  addPageNumber(slide);
}

// ============================================================
// SECTION 1: 배경 및 문제 정의
// ============================================================
function slide03_section1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('01', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('배경 및 문제 정의', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('단순 LLM API를 넘어 멀티에이전트 오케스트레이션으로 확장하기 위한 질문과 전제를 정의한다', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide04_situation() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '단순 LLM API를 넘어 멀티에이전트 오케스트레이션이 필요하다');
  const bullets = [
    '회사가 Qwen3-235B-A22B를 자체 서빙하여 OpenAI-compatible API로 제공 중',
    '현재는 단일 요청-응답 패턴의 단순 API 접속 방식',
    '복잡한 태스크는 단일 LLM 호출로 품질 한계가 명확',
    '서브에이전트 병렬 실행 + 결과 통합으로 품질 향상 가능성',
    '핵심 질문: 이 모델로 멀티에이전트 시스템을 구축할 수 있는가?',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide05_claudecode_ref() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Claude Code는 서브에이전트 병렬 실행으로 복잡한 태스크를 처리한다');
  const bullets = [
    'Orchestrator-Worker 패턴: 메인 에이전트가 서브에이전트를 spawn하고 관리',
    '각 서브에이전트는 독립된 200K 토큰 컨텍스트 윈도우 보유',
    '격리된 git worktree에서 서브에이전트 실행 (충돌 방지)',
    '깊이 1 제한: 서브에이전트는 추가 서브에이전트를 생성하지 않음',
    '병렬 실행(background) + 결과 수집 + 메인 통합의 3단계 흐름',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide06_questions() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 질문은 구현 가능성과 모델 능력의 교차점에 있다');

  slide.addText('핵심 질문', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: 'Qwen3의 tool use/IF 능력이 에이전트에 충분한가?', options: { bullet: true } },
      { text: '어떤 프레임워크/아키텍처가 적합한가?', options: { bullet: true } },
      { text: '단순 API로 서브에이전트 spawn이 가능한가?', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top',
    }
  );

  slide.addText('인접 질문 / 반대 시나리오', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: '토큰 비용/지연시간 폭발을 어떻게 관리하는가?', options: { bullet: true } },
      { text: 'Qwen3 패밀리 내 역할 분리(235B vs Coder-480B)가 유효한가?', options: { bullet: true } },
      { text: '반대 시나리오: 모델 능력 부족으로 오케스트레이션 실패 전파', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide07_premise() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '"바로 구현"보다 "먼저 검증"이 올바른 순서다');
  const bullets = [
    '모델의 function calling 안정성이 프로덕션에서 미검증 상태',
    'IFBench 36.6%로 복잡한 시스템 프롬프트 준수에 리스크 존재',
    '대규모 멀티에이전트 배포 사례가 공개 자료에 없음',
    '검증 없는 아키텍처 결정은 추정 위에 건물을 세우는 것',
    '따라서: Step 1(검증) → Step 2(MVP) → Step 3(확장 판단)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

// ============================================================
// SECTION 2: Qwen3-235B-A22B 모델 분석
// ============================================================
function slide08_section2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('모델 성능 분석', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('Qwen3-235B-A22B의 벤치마크 성능, 도구 사용 능력, 비용 효율을 분석한다', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide09_model_spec() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Qwen3-235B-A22B는 235B 중 22B만 활성화하는 효율적 구조다');
  addStyledTable(
    slide,
    ['항목', '값', '비고'],
    [
      ['전체 파라미터', '235B', 'Mixture of Experts'],
      ['활성 파라미터', '22B (토큰당)', '128개 중 8개 전문가 활성'],
      ['컨텍스트 윈도우', '131K ~ 262K', 'Instruct-2507은 262K'],
      ['추론 모드', 'Thinking + Non-Thinking', '동적 전환 가능'],
      ['개발사', 'Alibaba Cloud (Qwen 팀)', '2025년 4월 출시'],
      ['라이선스', 'Apache 2.0', '상업적 사용 가능'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function slide10_benchmark_overview() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '코딩, 수학, 추론에서 오픈소스 최상위권 성능을 보인다');
  const cards = [
    { title: 'LiveCodeBench', body: 'Pass@1 65.9%\n오픈소스 13위\nClaude Sonnet 4(47.1%) 대비 우세' },
    { title: 'MATH-500', body: '90.2%\n수학 문제 해결에서\n오픈소스 최상위 수준' },
    { title: 'SWE-bench Pro', body: '21.4%\n실제 SW 엔지니어링에서\nClaude(42.7%) 대비 절반' },
    { title: 'IFBench', body: '36.6%\nInstruction Following\n중위권 — 에이전트 핵심 리스크' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide11_coding_bench() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LiveCodeBench에서 Claude Sonnet 4를 10pp 이상 앞선다');
  addStyledTable(
    slide,
    ['순위', '모델', 'Pass@1', 'Easy', 'Medium', 'Hard'],
    [
      ['1', 'O4-Mini (High)', '80.2%', '99.1', '89.4', '63.5'],
      ['5', 'DeepSeek-R1-0528', '73.1%', '98.7', '85.2', '50.7'],
      [
        { text: '13', options: { bold: true, color: COLORS.accent_blue } },
        { text: 'Qwen3-235B-A22B', options: { bold: true, color: COLORS.accent_blue } },
        { text: '65.9%', options: { bold: true, color: COLORS.accent_blue } },
        { text: '99.1', options: { color: COLORS.accent_blue } },
        { text: '80.1', options: { color: COLORS.accent_blue } },
        { text: '37.9', options: { color: COLORS.accent_blue } },
      ],
      ['20', 'Claude Sonnet 4 (Thinking)', '55.9%', '97.3', '66.0', '26.6'],
      ['24', 'GPT-4o', '29.5%', '82.5', '26.0', '3.3'],
    ],
    { y: 1.8 }
  );
  slide.addText('출처: LiveCodeBench Leaderboard (2026-03)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary,
  });
  addPageNumber(slide);
}

function slide12_swebench() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'SWE-bench Pro에서는 Claude 대비 절반 수준의 격차가 있다');

  addStyledChart(slide, 'BAR',
    [{
      name: 'SWE-bench Pro Score',
      labels: ['Claude Opus 4.5', 'Claude Sonnet 4', 'Qwen3 Coder 480B', 'Qwen3 235B', 'DeepSeek V3p2'],
      values: [45.9, 42.7, 38.7, 21.4, 15.6],
    }],
    {
      x: 0.6, y: 1.8, w: 7.28, h: 4.9,
      showTitle: false, showLegend: false,
      chartColors: ['4A7BF7'],
      valAxisTitle: 'Score (%)',
      valAxisTitleFontSize: 10,
    }
  );

  // Insight panel
  slide.addShape('roundRect', {
    x: 8.18, y: 1.8, w: 4.55, h: 4.9,
    rectRadius: 0.08, fill: { color: COLORS.bg_secondary },
  });
  slide.addText('21.4%', {
    x: 8.38, y: 2.0, w: 4.15, h: 0.7,
    fontSize: 36, fontFace: FONTS.kpi.fontFace, bold: true,
    color: COLORS.accent_red,
  });
  slide.addText('Qwen3-235B의 SWE-bench Pro 점수. Claude Opus 4.5(45.9%)의 절반 수준', {
    x: 8.38, y: 2.7, w: 4.15, h: 0.7,
    fontSize: 13, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  slide.addShape('line', {
    x: 8.38, y: 3.5, w: 4.15, h: 0,
    line: { color: 'E2E8F0', width: 0.5 },
  });
  slide.addText('핵심 시사점', {
    x: 8.38, y: 3.7, w: 4.15, h: 0.35,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('알고리즘 코딩에서는 강하지만, 실제 소프트웨어 엔지니어링(코드 수정, 디버깅)에서는 상용 모델에 큰 격차. 코딩 에이전트로 사용 시 한계 인식 필요', {
    x: 8.38, y: 4.1, w: 4.15, h: 1.5,
    fontSize: 13, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide13_strengths_weaknesses() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '알고리즘 코딩 강점과 실전 엔지니어링 약점이 공존한다');

  slide.addText('강점', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_cyan,
  });
  slide.addText(
    [
      { text: 'LiveCodeBench 65.9% (오픈소스 최상위)', options: { bullet: true } },
      { text: 'MATH-500 90.2%', options: { bullet: true } },
      { text: '비용 효율: MoE 22B active', options: { bullet: true } },
      { text: 'Thinking/Non-Thinking 하이브리드', options: { bullet: true } },
      { text: '119개 언어 지원 (한국어 포함)', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 4.0,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top',
    }
  );

  slide.addText('약점 (에이전트 관점)', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_red,
  });
  slide.addText(
    [
      { text: 'IFBench 36.6% — IF 능력 중위권', options: { bullet: true } },
      { text: 'SWE-bench Pro 21.4% — 실전 격차', options: { bullet: true } },
      { text: 'Function calling 프로덕션 안정성 미검증', options: { bullet: true } },
      { text: '멀티에이전트 배포 사례 없음', options: { bullet: true } },
      { text: 'VRAM ~470GB (FP16) 필요', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 4.0,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide14_tool_use() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Function Calling, Structured Output, MCP를 공식 지원한다');
  addStyledTable(
    slide,
    ['기능', '지원', '상세'],
    [
      ['Function Calling', 'O', 'OpenAI 호환 tools 파라미터, 병렬 도구 호출'],
      ['Structured Output', 'O', 'JSON mode, Pydantic BaseModel 스키마'],
      ['MCP 통합', 'O', 'Qwen-Agent 프레임워크 경유'],
      ['Thinking + Tool Use', 'O', '두 모드 모두 도구 사용 가능'],
      ['코드 인터프리터', 'O', 'Qwen-Agent 빌트인'],
    ],
    { y: 1.8 }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 5.3, w: 12.13, h: 1.2, rectRadius: 0.08,
    fill: { color: 'FFF8E1' },
  });
  slide.addText('주의: "지원됨"과 "프로덕션에서 안정적"은 다르다. 프로덕션 안정성 데이터가 부재하므로 자체 벤치마크가 필수', {
    x: 0.8, y: 5.4, w: 11.73, h: 1.0,
    fontSize: 14, fontFace: 'Pretendard',
    color: COLORS.text_primary, lineSpacingMultiple: 1.4, valign: 'middle',
  });
  addPageNumber(slide);
}

function slide15_hybrid_mode() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Thinking과 Non-Thinking 모드를 태스크별로 전환할 수 있다');
  const bullets = [
    'Thinking 모드 (/think): 복잡한 추론, 태스크 분해에 적합. CoT 토큰 추가 생성',
    'Non-Thinking 모드 (/no_think): 단순 실행, 빠른 응답에 적합. 비용 최소화',
    '소프트 스위치: 멀티턴 대화 중 /think, /no_think 태그로 동적 전환',
    '에이전트 전략: 메인(Thinking) + 서브(Non-Thinking)로 비용/품질 최적화',
    'Thinking Budget: 할당된 연산 예산에 비례하여 성능 스케일링',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide16_cost_kpi() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'MoE 아키텍처로 비용 효율이 극대화된다');

  const kpis = [
    { value: '22B', label: '활성 파라미터', change: '235B 중 9.4%만 연산' },
    { value: '~$0.30', label: 'API 블렌드 비용/1M tok', change: 'vs Claude $6.00' },
    { value: '~51 tok/s', label: '출력 속도', change: 'Alibaba API 기준' },
  ];
  const gap = 0.3;
  const cardW = (12.13 - gap * 2) / 3;
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: 1.8, w: cardW, h: 1.8, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary },
    });
    slide.addText(kpi.value, {
      x: x + 0.15, y: 1.85, w: cardW - 0.3, h: 0.9,
      fontSize: 44, fontFace: FONTS.kpi.fontFace, bold: true,
      color: CHART_STYLE.colors[i], align: 'center',
    });
    slide.addText(kpi.label, {
      x: x + 0.15, y: 2.8, w: cardW - 0.3, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center',
    });
    slide.addText(kpi.change, {
      x: x + 0.15, y: 3.2, w: cardW - 0.3, h: 0.25,
      fontSize: 11, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center',
    });
  });

  addStyledChart(slide, 'BAR',
    [{
      name: '블렌드 비용 ($/1M tok)',
      labels: ['Qwen3 (SiliconFlow)', 'Qwen3 (Together AI)', 'Qwen3 (OpenRouter)', 'Claude Sonnet 4', 'GPT-4o'],
      values: [0.31, 0.30, 1.23, 6.00, 7.50],
    }],
    {
      x: 0.6, y: 3.9, w: 12.13, h: 2.9,
      showTitle: false, showLegend: false,
      chartColors: ['4A7BF7'],
    }
  );
  addPageNumber(slide);
}

function slide17_cost_detail() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '서드파티 API 가격은 Claude 대비 최대 20배 저렴하다');
  addStyledTable(
    slide,
    ['모델 / 제공자', '입력 ($/1M)', '출력 ($/1M)', '블렌드 (3:1)'],
    [
      ['Qwen3 (SiliconFlow)', '$0.18', '$0.68', '$0.31'],
      ['Qwen3 (Together AI FP8)', '$0.20', '$0.60', '$0.30'],
      ['Qwen3 (OpenRouter)', '$0.70', '$2.80', '$1.23'],
      [
        { text: 'Claude Sonnet 4', options: { bold: true } },
        { text: '$3.00', options: { bold: true } },
        { text: '$15.00', options: { bold: true } },
        { text: '$6.00', options: { bold: true } },
      ],
      ['GPT-4o', '$5.00', '$15.00', '$7.50'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function slide18_tco_warning() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '자체 호스팅 시 GPU 인프라 비용이 진정한 TCO를 결정한다');
  const bullets = [
    '위 비용 비교는 서드파티 API 가격 기준 — 자체 호스팅과 다름',
    'Qwen3-235B-A22B FP16 서빙에 ~470GB GPU 메모리 필요',
    '8xA100 80GB 렌탈: 월 $15,000~40,000 (클라우드별 상이)',
    'GPU 인프라를 이미 보유 중이라면 추가 비용 미미',
    '새로 확보해야 한다면 Claude API 직접 사용이 더 경제적일 수 있음',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide19_role_eval() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '역할별 적합도는 조건부 추천에서 주의 필요까지 분포한다');
  const cards = [
    { title: 'Researcher', body: '조건부 추천\n비용 효율적, 도구 의존도 낮음\nIF 능력 검증 후 확대' },
    { title: 'Synthesizer', body: '조건부 추천\n긴 컨텍스트, 다국어\n요약 품질 벤치마크 필요' },
    { title: 'Code Generator', body: '제한적 추천\nLiveCodeBench 우수\nSWE-bench Pro 약점' },
    { title: 'Orchestrator', body: '주의 필요\nIF 36.6%로 복잡한 분배\n지시 준수 불확실' },
    { title: 'Critic / Verifier', body: '주의 필요\nThinking 모드로 보강\n편향 데이터 없음' },
    { title: 'Instruct-2507 권장', body: '에이전트 최적 버전\n262K 컨텍스트\n강화된 IF + Tool Use' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X3.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X3.w, h: CARD_2X3.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide20_version_rec() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Instruct-2507 버전이 에이전트 용도로 가장 적합하다');
  addStyledTable(
    slide,
    ['버전', '출시', '컨텍스트', '핵심 변경'],
    [
      ['원본 (2025-04)', '2025-04', '131K', '기본. Thinking/Non-Thinking'],
      [
        { text: 'Instruct-2507', options: { bold: true, color: COLORS.accent_blue } },
        { text: '2025-07', options: { bold: true } },
        { text: '262K', options: { bold: true, color: COLORS.accent_blue } },
        { text: 'IF 강화, 도구 사용 개선', options: { bold: true } },
      ],
      ['Coder-480B-A35B', '2025-07', '256K', 'SWE-bench 38.7% (코딩 특화)'],
      ['VL-235B (Vision)', '2025-10', '—', '비전-언어 통합'],
    ],
    { y: 1.8 }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.2, rectRadius: 0.08,
    fill: { color: 'E8F5E9' },
  });
  slide.addText('코딩 전담 에이전트에는 Coder-480B를, 범용 에이전트에는 Instruct-2507을 권장', {
    x: 0.8, y: 5.1, w: 11.73, h: 1.0,
    fontSize: 15, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, valign: 'middle',
  });
  addPageNumber(slide);
}

// ============================================================
// SECTION 3: 프레임워크 비교
// ============================================================
function slide21_section3() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('프레임워크 비교 분석', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('6개 주요 프레임워크의 아키텍처, 호환성, 장단점을 비교한다', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide22_compatibility() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6개 주요 프레임워크 모두 OpenAI-compatible API를 지원한다');
  const bullets = [
    'LangGraph, CrewAI, AutoGen, OpenAI Agents SDK, Mastra, smolagents 모두 호환',
    'Qwen3의 function calling + structured output과 연동 확인',
    'LLM 호환성은 차별화 요인이 아님 — 결정은 아키텍처 적합성에 의존',
    'Qwen3 고유 고려: Thinking 모드 토큰 오버헤드가 프레임워크 비용에 영향',
    'vLLM/SGLang 서빙 시 OpenAI-compatible 엔드포인트 자동 제공',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide23_framework_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '프레임워크별 아키텍처 패턴과 특성이 크게 다르다');
  addStyledTable(
    slide,
    ['프레임워크', '패턴', '언어', '핵심 강점', '핵심 약점'],
    [
      ['LangGraph', '그래프 상태 머신', 'Python', '정밀 제어, 체크포인팅', '학습 곡선 높음'],
      ['CrewAI', '역할 기반 Crew', 'Python', '빠른 프로토타이핑', '세밀한 제어 부족'],
      ['AutoGen', '대화 기반 GroupChat', 'Python', '에이전트 토론 패턴', '토큰 비용 높음'],
      ['Agents SDK', '핸드오프 경량 에이전트', 'Python/JS', '최소 보일러플레이트', '병렬 실행 제한'],
      ['Mastra', '워크플로우+에이전트', 'TypeScript', 'TS 네이티브', '프로덕션 사례 부족'],
      ['smolagents', '코드 중심 최소 루프', 'Python', 'LLM 호출 최소화', '관측성 부족'],
    ],
    { y: 1.8, rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4] }
  );
  addPageNumber(slide);
}

function slide24_langgraph() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LangGraph는 그래프 상태 머신으로 가장 정밀한 제어를 제공한다');
  const cards = [
    { title: '아키텍처', body: '방향성 그래프 상태 머신\n노드(단계) + 엣지(전이)\n순환 그래프로 재방문 가능' },
    { title: '핵심 강점', body: '체크포인팅으로 장애 복구\n조건부 분기, 병렬, 루프\nLangSmith 관측성 통합' },
    { title: '프로덕션', body: '프레임워크 중 최고 수준\n상태 체크포인팅 내장\nHuman-in-the-loop 지원' },
    { title: '주의점', body: '학습 곡선이 높음\nLangChain 의존성\n단순 작업에 과도한 보일러플레이트' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide25_crewai() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'CrewAI는 역할 기반으로 가장 빠른 프로토타이핑이 가능하다');
  const cards = [
    { title: '아키텍처', body: 'Crew 컨테이너 안에 에이전트\n역할(role) + 목표(goal)\n태스크 출력 기반 통신' },
    { title: '핵심 강점', body: '20줄 미만 멀티에이전트\n직관적 역할 기반 설계\nLiteLLM 100+ 모델 지원' },
    { title: '프로덕션', body: '중간 수준\n체크포인팅 미지원\nCrewAI→LangGraph 패턴 흔함' },
    { title: '적합 시나리오', body: '빠른 PoC 구축\n역할 명확한 팀 작업\n리서치+작성+검토 파이프라인' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide26_autogen() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AutoGen은 대화 기반이지만 토큰 비용이 가장 높다');
  slide.addText('강점', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan,
  });
  slide.addText(
    [
      { text: '에이전트 토론/비평 패턴에 최적', options: { bullet: true } },
      { text: 'Docker 코드 실행 샌드박스 내장', options: { bullet: true } },
      { text: 'v0.4 이벤트 드리븐 재설계', options: { bullet: true } },
      { text: 'GroupChat: 여러 에이전트 토론', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addText('약점 / 주의', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red,
  });
  slide.addText(
    [
      { text: '4에이전트 5라운드 = 20회 LLM 호출', options: { bullet: true } },
      { text: '누적 대화 히스토리로 비용 폭발', options: { bullet: true } },
      { text: 'v0.2/v0.4/AG2 분화로 생태계 혼란', options: { bullet: true } },
      { text: 'Qwen3 Thinking 모드 시 비용 심화', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide27_agents_sdk() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'OpenAI Agents SDK는 경량 핸드오프로 빠르게 시작할 수 있다');
  slide.addText('핵심 특징', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: 'Swarm 후속 — 경량 에이전트 런타임', options: { bullet: true } },
      { text: '핸드오프: Agent A → Agent B 전환', options: { bullet: true } },
      { text: '@function_tool 데코레이터로 도구 정의', options: { bullet: true } },
      { text: 'Guardrail 입출력 검증 내장', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addText('Self-hosted 연결', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: 'set_default_openai_client(base_url=...)', options: { bullet: true } },
      { text: 'ModelProvider로 에이전트별 모델 지정', options: { bullet: true } },
      { text: '한계: 병렬 실행 내장 미지원', options: { bullet: true } },
      { text: '한계: 체크포인팅 미지원', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide28_smolagents() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'smolagents는 코드 실행으로 LLM 호출을 최소화한다');
  const bullets = [
    'HuggingFace의 최소주의 코드 중심 에이전트 프레임워크',
    '에이전트가 Python 코드를 생성하고 실행하여 목표 달성 (ReAct 패턴)',
    '여러 도구 호출을 하나의 코드 블록에서 수행 → LLM 호출 횟수 절감',
    'OpenAIServerModel로 Qwen3 직접 연결 가능',
    '매니저 에이전트 패턴으로 서브에이전트 위임/수집',
    '한계: 프로덕션 관측성 부족, 코드 실행 보안 관리 필요',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide29_claude_arch() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Claude Code는 오케스트레이터-워커 패턴에 깊이 1 제한을 적용한다');
  addStyledTable(
    slide,
    ['특성', '부모 에이전트', '서브에이전트'],
    [
      ['컨텍스트', '전체 대화 히스토리', '격리됨 (자체 프롬프트만)'],
      ['컨텍스트 크기', '대화 누적', '독립 200K 토큰'],
      ['도구/스킬', '모든 도구 사용 가능', '상속된 서브셋'],
      ['출력', '결과 조율', '단일 최종 메시지만 반환'],
      ['서브에이전트 생성', '가능', '불가 (깊이 1 제한)'],
      ['실행 환경', '메인 워크스페이스', '격리된 git worktree'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function slide30_self_vs_framework() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '자체 구현과 프레임워크 사용은 상호 배타가 아니다');
  slide.addText('자체 구현', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: '완전한 제어, 최소 의존성', options: { bullet: true } },
      { text: 'Qwen3 특화 최적화 가능', options: { bullet: true } },
      { text: '빠른 PoC에 적합 (검증 단계)', options: { bullet: true } },
      { text: '엣지케이스 처리를 직접 구현해야 함', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addText('프레임워크 사용', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: '수천 시간의 엣지케이스 처리 내장', options: { bullet: true } },
      { text: '체크포인팅, 관측성, 재시도 기본 제공', options: { bullet: true } },
      { text: '확장 단계에 적합 (프로덕션)', options: { bullet: true } },
      { text: '추상화 레이어로 디버깅 복잡', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 6.0, w: 12.13, h: 0.7, rectRadius: 0.08,
    fill: { color: 'E3F2FD' },
  });
  slide.addText('권장: MVP 자체 구현 → 검증 완료 후 LangGraph 마이그레이션', {
    x: 0.8, y: 6.05, w: 11.73, h: 0.6,
    fontSize: 15, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_blue, valign: 'middle',
  });
  addPageNumber(slide);
}

function slide31_decision_guide() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '상황별로 최적의 프레임워크가 달라진다');
  addStyledTable(
    slide,
    ['상황', '1순위', '2순위', '이유'],
    [
      ['복잡한 리서치 파이프라인', 'LangGraph', 'AutoGen', '상태 관리, 체크포인팅'],
      ['빠른 프로토타이핑', 'CrewAI', 'smolagents', '최소 코드, 직관적 역할'],
      ['코드 생성/리뷰', 'AutoGen', 'LangGraph', '에이전트 토론 패턴'],
      ['TypeScript 웹 앱', 'Mastra', 'Agents SDK', 'TS 네이티브'],
      ['오픈소스 LLM 최적화', 'smolagents', 'CrewAI', 'HuggingFace 생태계'],
      ['Claude Code 패턴 재현', 'LangGraph', '자체 구현', '오케스트레이터-워커'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

// ============================================================
// SECTION 4: 구현 아키텍처
// ============================================================
function slide32_section4() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('구현 아키텍처', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('Orchestrator + 독립 Agent 패턴의 구체적 설계와 구현 방법', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide33_arch_overview() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Orchestrator + 독립 컨텍스트 Agent가 핵심 패턴이다');
  const bullets = [
    '메인 Orchestrator: 사용자 대화 + 태스크 분해 + 결과 통합',
    '서브에이전트: 독립 API 세션 (별도 system prompt + messages + tools)',
    '병렬 실행: asyncio.gather로 동시 API 호출',
    '깊이 1 제한: 서브에이전트는 추가 서브에이전트 생성 불가',
    '결과 수집: 메인이 서브에이전트 결과를 자신의 컨텍스트에 삽입',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide34_system_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '각 서브에이전트는 독립된 API 호출 세션으로 동작한다');
  // Simplified architecture diagram using shapes
  // User Interface box
  slide.addShape('roundRect', { x: 4.5, y: 1.6, w: 4.33, h: 0.6, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
  slide.addText('사용자 인터페이스 (CLI / Web / API)', { x: 4.5, y: 1.6, w: 4.33, h: 0.6, fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_primary, align: 'center', valign: 'middle' });
  // Arrow
  slide.addShape('line', { x: 6.665, y: 2.2, w: 0, h: 0.4, line: { color: COLORS.accent_blue, width: 2 } });
  // Main Orchestrator box
  slide.addShape('roundRect', { x: 2.5, y: 2.6, w: 8.33, h: 1.4, rectRadius: 0.08, fill: { color: 'E3F2FD' } });
  slide.addText('Main Orchestrator', { x: 2.5, y: 2.6, w: 8.33, h: 0.5, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue, align: 'center' });
  // Sub-components
  const comps = ['Task\nDecomposer', 'Context\nManager', 'Result\nIntegrator', 'Tool\nRegistry'];
  comps.forEach((c, i) => {
    const cx = 3.0 + i * 2.0;
    slide.addShape('roundRect', { x: cx, y: 3.2, w: 1.6, h: 0.7, rectRadius: 0.06, fill: { color: 'FFFFFF' } });
    slide.addText(c, { x: cx, y: 3.2, w: 1.6, h: 0.7, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_secondary, align: 'center', valign: 'middle', lineSpacingMultiple: 1.1 });
  });
  // Arrows down
  [3.8, 6.665, 9.5].forEach(ax => {
    slide.addShape('line', { x: ax, y: 4.0, w: 0, h: 0.4, line: { color: COLORS.accent_blue, width: 2 } });
  });
  // Sub-agents
  const agents = ['Sub-Agent 1\n(독립 컨텍스트)', 'Sub-Agent 2\n(독립 컨텍스트)', 'Sub-Agent 3\n(독립 컨텍스트)'];
  agents.forEach((a, i) => {
    const ax = 2.3 + i * 3.45;
    slide.addShape('roundRect', { x: ax, y: 4.4, w: 2.8, h: 0.8, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    slide.addText(a, { x: ax, y: 4.4, w: 2.8, h: 0.8, fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_primary, align: 'center', valign: 'middle', lineSpacingMultiple: 1.1 });
  });
  // Arrows to API
  [3.7, 6.665, 9.6].forEach(ax => {
    slide.addShape('line', { x: ax, y: 5.2, w: 0, h: 0.4, line: { color: COLORS.accent_cyan, width: 2 } });
  });
  // Qwen3 API
  slide.addShape('roundRect', { x: 2.5, y: 5.6, w: 8.33, h: 0.7, rectRadius: 0.08, fill: { color: COLORS.bg_dark } });
  slide.addText('Qwen3 API (vLLM Server) — OpenAI-compatible + Continuous Batching', { x: 2.5, y: 5.6, w: 8.33, h: 0.7, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
  addPageNumber(slide);
}

function slide35_components() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3개 핵심 컴포넌트로 MVP를 구성한다');
  const cards = [
    { title: 'Agent 클래스', body: '독립 API 세션 + tool-use 루프\nsystem_prompt, messages, tools\nmax_turns 제한으로 무한 루프 방지' },
    { title: 'Orchestrator 클래스', body: '태스크 분해 → 병렬 실행 → 통합\nasyncio.gather로 동시 실행\n타임아웃 + 에러 핸들링 내장' },
    { title: 'ToolRegistry', body: '중앙 도구 관리 및 에이전트별 할당\nOpenAI function calling 포맷\n동기/비동기 함수 래핑' },
    { title: 'ContextManager', body: '토큰 카운팅 + 컨텍스트 압축\n오래된 메시지 요약\n서브에이전트 결과 핵심 추출' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide36_vllm_config() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'vLLM에서 Function Calling을 Hermes 파서로 활성화한다');
  const bullets = [
    'vLLM serve 명령: --enable-auto-tool-choice --tool-call-parser hermes',
    '--reasoning-parser deepseek_r1 로 Thinking 모드 파싱 활성화',
    '--max-num-seqs 16 으로 동시 처리 시퀀스 수 제한',
    'OpenAI의 tools / tool_choice 파라미터 완전 호환',
    'parallel_tool_calls: 한 턴에 여러 도구 동시 호출 지원',
    'streaming + tool calls 동시 가능',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide37_dataflow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'asyncio.gather로 서브에이전트를 병렬 실행한다');
  // Timeline-style data flow
  const items = [
    { step: 'Phase 1', title: '태스크 분석', description: 'Main Agent가 사용자 입력을 분석하고 태스크를 분해 (API 호출 #1)' },
    { step: 'Phase 2', title: '병렬 실행', description: 'Orchestrator가 asyncio.gather로 서브에이전트 3~5개 동시 실행' },
    { step: 'Phase 3', title: '결과 수집', description: '각 에이전트의 최종 출력을 수집 (타임아웃/에러 포함)' },
    { step: 'Phase 4', title: '통합 응답', description: 'Main Agent가 결과를 통합하여 최종 응답 생성 (API 호출 #2)' },
  ];
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', { x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.step, { x: 1.0, y: itemY, w: 2.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 1.0, y: itemY + 0.35, w: 11.73, h: 0.35, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
    slide.addText(item.description, { x: 1.0, y: itemY + 0.7, w: 11.73, h: itemH - 0.85, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, valign: 'top' });
    if (i < items.length - 1) {
      slide.addShape('line', { x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide);
}

function slide38_mode_strategy() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '메인은 Thinking 모드, 서브는 Non-Thinking으로 비용을 최적화한다');
  slide.addText('메인 Orchestrator', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue,
  });
  slide.addText(
    [
      { text: 'enable_thinking = True', options: { bullet: true } },
      { text: '복잡한 태스크 분해 판단에 활용', options: { bullet: true } },
      { text: '결과 통합 시 품질 향상', options: { bullet: true } },
      { text: '토큰 추가 소비 감수 (품질 우선)', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addText('서브에이전트', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_cyan,
  });
  slide.addText(
    [
      { text: 'enable_thinking = False', options: { bullet: true } },
      { text: '속도와 비용 최적화', options: { bullet: true } },
      { text: '역할 특화 단순 실행에 집중', options: { bullet: true } },
      { text: '토큰 예산 엄격 관리', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.5,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide39_context_mgmt() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '컨텍스트 압축과 핵심 추출로 토큰 예산을 관리한다');
  const bullets = [
    '에이전트별 독립 컨텍스트: 각자의 messages 리스트 유지',
    '컨텍스트 80% 도달 시 자동 압축: system prompt 보존 + 최근 6개 메시지 보존 + 나머지 요약',
    '서브에이전트 결과는 핵심만 추출하여 메인에 삽입 (전문 전달 X)',
    '토큰 예산: 서브에이전트별 max_total_tokens 사전 할당',
    '예산 초과 시 해당 에이전트 조기 종료 (Graceful)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide40_concurrency() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Semaphore로 동시 요청 수를 제한하여 서버 과부하를 방지한다');
  const bullets = [
    'vLLM continuous batching: 동시 요청을 자동 배치 처리',
    'asyncio.Semaphore(max_concurrent=8)로 동시 API 호출 제한',
    'MoE 모델: active 22B이지만 전체 가중치(470GB)가 메모리에 상주',
    'KV Cache에 할당 가능한 메모리가 동시 처리량을 결정',
    '8xA100 또는 4xH100 구성에서 max_num_seqs 16 정도가 현실적',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide41_error_handling() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '서브에이전트 실패 시 재시도와 Graceful Degradation을 적용한다');
  const bullets = [
    '타임아웃(120s) + 재시도(max 2회): 타임아웃 시 max_tokens 줄여서 재시도',
    'Graceful Degradation: 일부 실패해도 가용한 결과로 통합',
    '전체 실패 시: 단일 에이전트 모드로 폴백',
    '실패 에이전트 이름과 사유를 메인에 전달하여 통합 시 반영',
    '메트릭 수집: 에이전트별 토큰, 시간, 성공률, 도구 호출 횟수 기록',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide42_cost_optimization() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6가지 비용 최적화 전략으로 토큰 소비를 통제한다');
  addStyledTable(
    slide,
    ['전략', '설명', '예상 효과'],
    [
      ['서브에이전트 Non-Thinking', 'enable_thinking=False 강제', '토큰 2~3배 절감'],
      ['컨텍스트 압축', '오래된 메시지 요약', '입력 토큰 50~70% 절감'],
      ['결과 핵심 추출', '서브 결과 요약 후 메인 전달', '메인 컨텍스트 절약'],
      ['도구 선택 제한', '에이전트별 필요 도구만 할당', '시스템 프롬프트 절감'],
      ['조기 종료', '충분한 결과 시 남은 에이전트 취소', '불필요한 호출 방지'],
      ['KV Cache 최적화', 'vLLM prefix caching 활용', '동일 프롬프트 공유 효과'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

// ============================================================
// SECTION 5: 리스크와 검증
// ============================================================
function slide43_section5() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('05', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('리스크 및 검증', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('상충점, 실패 모드, 그리고 검증 기반 의사결정 전략', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide44_confidence_matrix() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '근거 신뢰도는 높음에서 낮음까지 혼재되어 있다');
  addStyledTable(
    slide,
    ['핵심 주장', '확신도', '검증 필요'],
    [
      ['LiveCodeBench 65.9%', '높음', '아니오'],
      ['SWE-bench Pro 21.4%', '높음', '아니오'],
      ['Function calling 공식 지원', '높음', '예 (안정성)'],
      ['IFBench 36.6%', '중', '예 (멀티에이전트)'],
      ['비용 81% 저렴', '낮음', '예 (TCO)'],
      ['Thinking 토큰 2~5배', '낮음', '예 (실측)'],
      ['MVP 1~2주', '낮음', '—'],
    ],
    { y: 1.8, rowH: [0.4, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38] }
  );
  addPageNumber(slide);
}

function slide45_conflicts() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3건의 상충점이 발견되어 실측 검증이 필요하다');
  addStyledTable(
    slide,
    ['상충 항목', 'R1 주장', 'R3 주장', '통합 판단'],
    [
      ['Thinking 토큰 오버헤드', '2~5배', '2~3배', '3배 가정, 반드시 검증'],
      ['Function calling 안정성', '긍정적', '부정적', '"지원"은 사실, "안정"은 미검증'],
      ['자체 구현 vs 프레임워크', '—', '자체 구현 우선', '초기 자체→확장 시 프레임워크'],
    ],
    { y: 1.8 }
  );
  slide.addShape('roundRect', {
    x: 0.6, y: 4.5, w: 12.13, h: 1.5, rectRadius: 0.08,
    fill: { color: 'FFF3E0' },
  });
  slide.addText('Critic 결론: "지원 여부"와 "프로덕션 안정성"은 별개 문제. PoC에서 function calling 성공률을 직접 측정해야 이후 결정이 유효하다', {
    x: 0.8, y: 4.6, w: 11.73, h: 1.3,
    fontSize: 14, fontFace: 'Pretendard',
    color: COLORS.text_primary, lineSpacingMultiple: 1.4, valign: 'middle',
  });
  addPageNumber(slide);
}

function slide46_failure_modes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '5가지 핵심 실패 모드에 대비해야 한다');
  const cards = [
    { title: '무한 도구 호출 루프', body: '모델이 도구 결과를 이해 못하고 반복\n대응: max_turns 제한 + 패턴 탐지' },
    { title: 'Hallucinated Tool Call', body: '존재하지 않는 도구 호출\n대응: Registry 검증 + 친절한 에러' },
    { title: '결과 전달 시 핵심 유실', body: 'Truncation으로 정보 손실\n대응: 구조화된 핵심 추출' },
    { title: 'Thinking+Tool 충돌', body: '<think> 블록과 tool call 파싱 혼재\n대응: reasoning-parser 설정' },
    { title: '시스템 프롬프트 무시', body: 'IF 36.6%의 한계\n대응: 프롬프트 단순화 + 출력 검증' },
    { title: '에이전트 간 결과 상충', body: '서브에이전트 간 모순된 결과\n대응: 메인에서 상충점 명시 통합' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X3.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X3.w, h: CARD_2X3.h,
      title: card.title, body: card.body,
      accentColor: i < 3 ? COLORS.accent_red : COLORS.accent_yellow,
    });
  });
  addPageNumber(slide);
}

function slide47_if_risk() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'IFBench 36.6%는 복잡한 시스템 프롬프트 준수에 리스크다');
  const bullets = [
    'Claude Code는 높은 IF 능력의 Claude 모델에 최적화된 설계',
    'Qwen3의 IFBench 36.6%로 동일 패턴 적용 시 실패 가능성 존재',
    '복잡한 시스템 프롬프트(역할+제약+도구 사용 규칙)를 일관되게 따르지 못할 수 있음',
    '대응 전략: 프롬프트 극도로 단순화 + 핵심 지시 반복 + 출력 검증 레이어',
    'Instruct-2507 버전으로 업그레이드 시 개선 기대 (추가 IF 강화)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide48_no_production() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '프로덕션 멀티에이전트 배포 사례가 아직 없다');
  const bullets = [
    '공개 자료에서 Qwen3-235B-A22B 기반 프로덕션 멀티에이전트 사례 미발견',
    '대부분 튜토리얼/PoC 수준 (AutoGen 감정 분석, Qwen-Agent MCP 연동 등)',
    '엔터프라이즈 프로덕션에서의 장기 안정성 데이터 없음',
    '이것이 "불가능"을 의미하지는 않지만, 자체 검증이 필수적',
    '선행자 부재 = 참고 자료 부족 + 예상치 못한 문제 발생 가능성',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide49_experiment() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '단일 에이전트 대비 멀티에이전트의 실질 개선을 검증해야 한다');
  slide.addText('실험 설계', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: '동일 태스크를 (a) 단일, (b) 멀티로 실행', options: { bullet: true } },
      { text: '최소 10개 태스크, 3회 반복', options: { bullet: true } },
      { text: '태스크 복잡도별 분기점 도출', options: { bullet: true } },
    ],
    {
      x: COL_LEFT_X, y: 2.35, w: COL_W, h: 3.0,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  slide.addText('비교 지표', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary,
  });
  slide.addText(
    [
      { text: '결과 품질 (사람 평가)', options: { bullet: true } },
      { text: '총 토큰 소비', options: { bullet: true } },
      { text: '완료 시간', options: { bullet: true } },
      { text: '실패율', options: { bullet: true } },
    ],
    {
      x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 3.0,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide50_decision_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '검증 결과에 따라 전략을 동적으로 전환한다');
  addStyledTable(
    slide,
    ['검증 결과', '권장 전략'],
    [
      ['FC 안정 + IF 충분', '멀티에이전트 전면 도입, LangGraph 추진'],
      ['FC 안정 + IF 부족', '프롬프트 극도 단순화 + 출력 검증 레이어'],
      ['FC 불안정', '멀티에이전트 보류. 단일+도구 확장 또는 모델 교체'],
      ['토큰 비용 과다', '엄격한 예산 + Non-Thinking 강제 + 모델 라우팅'],
      ['동시 요청 병목', 'max_num_seqs 조정 + 에이전트 수 제한'],
    ],
    { y: 1.8 }
  );
  slide.addText('FC = Function Calling, IF = Instruction Following', {
    x: 0.6, y: 5.5, w: 12.13, h: 0.3,
    fontSize: 11, fontFace: 'Pretendard', color: COLORS.text_tertiary,
  });
  addPageNumber(slide);
}

// ============================================================
// SECTION 6: 액션 플랜
// ============================================================
function slide51_section6() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('06', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('액션 플랜', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('검증 → MVP → 확장 판단의 3단계 실행 계획', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide);
}

function slide52_roadmap() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '검증 → MVP → 확장 판단의 3단계로 진행한다');
  const items = [
    { step: 'Step 1', title: '검증 (1주)', description: 'Function calling 안정성, Thinking 토큰 오버헤드, 시스템 프롬프트 준수율 실측' },
    { step: 'Step 2', title: 'MVP (2~4주)', description: 'Agent + Orchestrator + ToolRegistry 구현. 기본 도구 3종. 단일 vs 멀티 비교 실험' },
    { step: 'Step 3', title: '확장 판단', description: '검증/실험 결과 리뷰. 전면 멀티에이전트 / 하이브리드 / 단일+도구 중 전략 결정' },
  ];
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', { x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.step, { x: 1.0, y: itemY, w: 2.0, h: 0.35, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 1.0, y: itemY + 0.4, w: 11.73, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
    slide.addText(item.description, { x: 1.0, y: itemY + 0.85, w: 11.73, h: itemH - 1.1, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, valign: 'top', lineSpacingMultiple: 1.4 });
    if (i < items.length - 1) {
      slide.addShape('line', { x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide);
}

function slide53_step1() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 1: Function Calling 안정성과 IF 능력을 먼저 검증한다');
  const bullets = [
    'Function calling 안정성: 10+ 도구 스키마로 성공률 측정',
    'Thinking 토큰 오버헤드: 5개 태스크에서 thinking vs non-thinking 비교',
    '시스템 프롬프트 준수율: 복잡한 역할 지시 10개로 준수율 측정',
    'JSON 파싱 오류율: 중첩 객체, 다중 도구 동시 호출 테스트',
    '기간: 1주 (풀타임 1명 기준)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide54_step2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 2: Agent + Orchestrator + ToolRegistry MVP를 구현한다');
  const bullets = [
    'Agent 클래스: 독립 API 세션 + tool-use 루프 (max_turns 제한)',
    'Orchestrator: asyncio.gather 병렬 실행 + 타임아웃 + 에러 핸들링',
    'ToolRegistry: 파일 읽기, 웹 검색, 코드 실행 3종 기본 도구',
    '단일 에이전트 vs 멀티에이전트 비교 실험 (10개 태스크, 3회 반복)',
    '기간: 2~4주 (검증 결과에 따라 범위 조정)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide55_step3() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 3: 검증 결과에 따라 전면/하이브리드/단일 전략을 결정한다');
  const bullets = [
    '검증/실험 결과를 종합 리뷰',
    '전략 A: 전면 멀티에이전트 — FC 안정 + IF 충분 시',
    '전략 B: 하이브리드 — 복잡 태스크만 멀티, 단순은 단일',
    '전략 C: 단일 + 도구 확장 — FC 불안정 시',
    '프레임워크 도입 여부 결정 (LangGraph vs 현 구조 유지)',
    '모델 라우팅 전략 수립 (235B + Coder-480B + 소형)',
  ];
  slide.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })),
    {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
    }
  );
  addPageNumber(slide);
}

function slide56_key_findings() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3가지 예상 밖 발견이 전략에 영향을 미친다');
  const cards = [
    { title: 'Qwen3 패밀리 내 역할 분리', body: 'Coder-480B는 SWE-bench 38.7%\nvs 235B의 21.4%\n코딩은 Coder, 범용은 235B\n모델 라우팅이 비용-품질 최적화 핵심' },
    { title: '하이브리드 접근이 더 현실적', body: '모든 태스크에 멀티에이전트 X\n태스크 복잡도별 단일/멀티 동적 선택\n자체 호스팅 제약에 더 적합한 구조' },
    { title: 'Instruct-2507이 최적', body: '262K 컨텍스트\n강화된 IF + Tool Use\n에이전트 용도라면 이 버전 선택' },
    { title: '문제 재정의가 핵심', body: '"Claude Code처럼"이 아니라\n"검증 기반 최적 전략 결정"으로\n문제를 재정의해야 함' },
  ];
  cards.forEach((card, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i],
    });
  });
  addPageNumber(slide);
}

function slide57_follow_up() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3개의 후속 탐색 질문이 다음 리서치를 이끈다');
  const questions = [
    { num: '1', q: 'Qwen3의 function calling 정확도는 실제로 어느 수준인가?', detail: '복잡한 도구 스키마(중첩 객체, 다중 도구 동시 호출)에서의 성공률 직접 측정' },
    { num: '2', q: '모델 라우팅의 실질적 효과는?', detail: '235B(범용) + Coder-480B(코딩) + 소형(단순) 혼합 사용 시 비용-품질 트레이드오프' },
    { num: '3', q: '프롬프트 엔지니어링으로 IF 한계를 보완할 수 있는가?', detail: '단순화된 지시문으로 Claude Code 스타일 에이전트 성능 유지 가능 여부' },
  ];
  questions.forEach((item, i) => {
    const y = 1.9 + i * 1.7;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(item.num, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(item.q, {
      x: 1.5, y: y, w: 11.23, h: 0.5,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(item.detail, {
      x: 1.5, y: y + 0.55, w: 11.23, h: 0.5,
      fontSize: 14, fontFace: 'Pretendard',
      color: COLORS.text_secondary, valign: 'top',
    });
    if (i < questions.length - 1) {
      slide.addShape('line', { x: 1.5, y: y + 1.5, w: 11.23, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide);
}

// ============================================================
// CLOSING
// ============================================================
function slide58_quote() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('\u201C검증 없는 구현은\n추정 위의 아키텍처다\u201D', {
    x: 1.5, y: 2.5, w: 10.33, h: 2.5,
    fontSize: 28, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.text_primary, align: 'center', lineSpacingMultiple: 1.5,
  });
  slide.addText('\u2014 이번 리서치의 핵심 교훈', {
    x: 1.5, y: 5.2, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'center',
  });
  addPageNumber(slide);
}

function slide59_closing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 3가지를 기억하고 검증부터 시작하자');

  const summaryPoints = [
    'Qwen3-235B-A22B는 기술적으로 멀티에이전트 구현이 가능하나, function calling 안정성과 IF 능력의 검증이 선행되어야 한다',
    '자체 구현 MVP → LangGraph 마이그레이션 경로가 가장 현실적이며, 하이브리드 접근(태스크 복잡도별 단일/멀티 선택)이 자체 호스팅 제약에 적합하다',
    '"바로 구현"이 아닌 "먼저 검증" — Step 1 검증(1주) 결과가 전체 프로젝트의 방향을 결정한다',
  ];
  summaryPoints.forEach((point, i) => {
    const y = 1.9 + i * 1.3;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.15, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: y + 0.15, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(point, {
      x: 1.5, y: y, w: 11.23, h: 0.9,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle', lineSpacingMultiple: 1.3,
    });
  });

  const divY = 1.9 + summaryPoints.length * 1.3 + 0.3;
  slide.addShape('line', {
    x: 0.6, y: divY, w: 12.13, h: 0,
    line: { color: 'E2E8F0', width: 0.5 },
  });
  slide.addText('Next Step: Qwen3 function calling 안정성 벤치마크 실행 (1주)', {
    x: 0.6, y: divY + 0.2, w: 12.13, h: 0.5,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
    color: COLORS.accent_blue, align: 'center',
  });
  addPageNumber(slide);
}

// ============================================================
// GENERATE ALL SLIDES
// ============================================================
slide01_title();
slide02_toc();
// Section 1
slide03_section1();
slide04_situation();
slide05_claudecode_ref();
slide06_questions();
slide07_premise();
// Section 2
slide08_section2();
slide09_model_spec();
slide10_benchmark_overview();
slide11_coding_bench();
slide12_swebench();
slide13_strengths_weaknesses();
slide14_tool_use();
slide15_hybrid_mode();
slide16_cost_kpi();
slide17_cost_detail();
slide18_tco_warning();
slide19_role_eval();
slide20_version_rec();
// Section 3
slide21_section3();
slide22_compatibility();
slide23_framework_table();
slide24_langgraph();
slide25_crewai();
slide26_autogen();
slide27_agents_sdk();
slide28_smolagents();
slide29_claude_arch();
slide30_self_vs_framework();
slide31_decision_guide();
// Section 4
slide32_section4();
slide33_arch_overview();
slide34_system_diagram();
slide35_components();
slide36_vllm_config();
slide37_dataflow();
slide38_mode_strategy();
slide39_context_mgmt();
slide40_concurrency();
slide41_error_handling();
slide42_cost_optimization();
// Section 5
slide43_section5();
slide44_confidence_matrix();
slide45_conflicts();
slide46_failure_modes();
slide47_if_risk();
slide48_no_production();
slide49_experiment();
slide50_decision_table();
// Section 6
slide51_section6();
slide52_roadmap();
slide53_step1();
slide54_step2();
slide55_step3();
slide56_key_findings();
slide57_follow_up();
// Closing
slide58_quote();
slide59_closing();

// ============================================================
// SAVE
// ============================================================
const outputPath = path.join(__dirname, 'qwen3-multi-agent-orchestration.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`저장 완료: ${outputPath}`))
  .catch(err => console.error('저장 실패:', err));
