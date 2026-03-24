const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== 색상 상수 =====
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

// ===== 폰트 상수 =====
const FONTS = {
  title: { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body: { fontFace: 'Pretendard', bold: false },
  caption: { fontFace: 'Pretendard Light', bold: false },
  serif: { fontFace: 'ChosunNm', bold: false },
  kpi: { fontFace: 'Pretendard Black', bold: true },
  deco: { fontFace: 'Pretendard Thin', bold: false },
};

// ===== 테이블 스타일 =====
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
  cellTotal: {
    bold: true,
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_primary,
    border: [{ type: 'solid', pt: 1.5, color: COLORS.text_primary }, null, null, null],
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
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8'],
};

// ===== 헬퍼 함수 =====
const TOTAL_SLIDES = 65;

function addTitleBar(slide, title, subtitle = '') {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue },
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3,
    autoFit: true,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.6, w: 12.13, h: 0.4,
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
    color: COLORS.text_primary, autoFit: true,
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top', autoFit: true,
  });
}

function addPageNumber(slide, num) {
  slide.addText(`${num} / ${TOTAL_SLIDES}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right',
  });
}

// Card grid layouts
const CARD_2X2 = {
  w: 5.915, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6, y: 1.8 },
    { x: 6.815, y: 1.8 },
    { x: 0.6, y: 4.55 },
    { x: 6.815, y: 4.55 },
  ],
};

const CARD_2X3 = {
  w: 3.843, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6, y: 1.8 },
    { x: 4.743, y: 1.8 },
    { x: 8.886, y: 1.8 },
    { x: 0.6, y: 4.55 },
    { x: 4.743, y: 4.55 },
    { x: 8.886, y: 4.55 },
  ],
};

// Two column constants
const COL_W = 5.865;
const COL_GAP = 0.4;
const COL_LEFT_X = 0.6;
const COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP;

// ================================================================
// 슬라이드 함수
// ================================================================

function slide01_title() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('팔란티어 온톨로지', {
    x: 1.5, y: 2.5, w: 10.33, h: 1.2,
    fontSize: 44, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.1,
  });
  slide.addText('기업 의사결정을 모델링하는 운영 레이어', {
    x: 1.5, y: 3.8, w: 10.33, h: 0.6,
    fontSize: 20, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center',
  });
  slide.addText('기술 구조 · 구축/운영 방식 · 산업별 실제 사례 · AIP와의 결합', {
    x: 1.5, y: 4.5, w: 10.33, h: 0.5,
    fontSize: 16, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center',
  });
  slide.addText('Deep Research  |  2026-03-24', {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center',
  });
}

function slide02_learningGoals() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 프레젠테이션에서 다루는 5가지 핵심 질문');
  const questions = [
    '팔란티어 온톨로지는 무엇이고, 왜 이렇게 설계되었는가?',
    '실제로 어떻게 구축하고, 어떻게 유지보수하는가?',
    '어떤 산업에서 어떤 문제를 어떻게 해결하고 있는가?',
    'AIP 시대에 LLM과 온톨로지는 어떻게 결합되는가?',
    '기술적 독창성 vs 과대포장 비판, 진실은 어디에 있는가?',
  ];
  questions.forEach((q, i) => {
    const y = 1.9 + i * 1.0;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.5, h: 0.5,
      fill: { color: CHART_STYLE.colors[i % 6] },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: y + 0.05, w: 0.5, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(q, {
      x: 1.6, y: y, w: 11.13, h: 0.6,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle',
    });
  });
  addPageNumber(slide, 2);
}

function slide03_toc() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '목차: 원리에서 사례, 그리고 평가까지');
  const sections = [
    { num: '01', title: '온톨로지의 핵심 원리', desc: '정의, 4개 프리미티브, OWL과의 차이' },
    { num: '02', title: '플랫폼 아키텍처', desc: '4개 레이어, 마이크로서비스, Writeback' },
    { num: '03', title: '구축과 운영의 실제', desc: 'Object Type 생성, 6단계 구축 여정, FDE 모델' },
    { num: '04', title: '산업별 사례', desc: '국방, 항공, 헬스케어, 에너지, 금융, 정부' },
    { num: '05', title: 'AIP: LLM과의 결합', desc: 'Grounding, 환각 감소, Agent Studio' },
    { num: '06', title: '균형 잡힌 평가', desc: '차별점, 벤더 락인, 과대포장 비판, 의사결정 가이드' },
  ];
  sections.forEach((s, i) => {
    const y = 1.9 + i * 0.85;
    slide.addText(s.num, {
      x: 0.6, y, w: 0.8, h: 0.65,
      fontSize: 24, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.accent_blue, valign: 'middle',
    });
    slide.addText(s.title, {
      x: 1.6, y, w: 4.0, h: 0.35,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary,
    });
    slide.addText(s.desc, {
      x: 1.6, y: y + 0.35, w: 10.73, h: 0.3,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary,
    });
    if (i < sections.length - 1) {
      slide.addShape('line', {
        x: 1.6, y: y + 0.75, w: 11.13, h: 0,
        line: { color: 'E2E8F0', width: 0.5 },
      });
    }
  });
  addPageNumber(slide, 3);
}

// --- 섹션 1: 온톨로지의 핵심 원리 ---

function slide04_section1() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('01', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('온톨로지란 무엇인가', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('정의, 설계 철학, 4개 프리미티브, 그리고 기존 기술과의 비교', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide, 4);
}

function slide05_quote_definition() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('\u201CThe Ontology is designed to represent the complex, interconnected decisions of an enterprise, not simply the data.\u201D', {
    x: 1.5, y: 2.5, w: 10.33, h: 2.5,
    fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.text_primary, align: 'center',
    lineSpacingMultiple: 1.5,
  });
  slide.addText('\u2014 Palantir Foundry 공식 문서', {
    x: 1.5, y: 5.2, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'center',
  });
  addPageNumber(slide, 5);
}

function slide06_philosophy() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '온톨로지는 데이터가 아니라 의사결정을 표현한다');
  const bullets = [
    { text: '기존 데이터베이스: "무엇이 있는가"를 저장', options: { bullet: true, indentLevel: 0 } },
    { text: '팔란티어 온톨로지: "이 데이터로 무엇을 해야 하는가"까지 포함', options: { bullet: true, indentLevel: 0 } },
    { text: '시맨틱 요소(명사): Objects, Properties, Links — 세계를 기술', options: { bullet: true, indentLevel: 0 } },
    { text: '키네틱 요소(동사): Actions, Functions — 세계를 변화시킴', options: { bullet: true, indentLevel: 0 } },
    { text: '이 둘의 결합이 "운영 디지털 트윈"을 형성한다', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 6);
}

function slide07_primitives_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4개 프리미티브가 기업의 디지털 트윈을 구성한다');
  addStyledTable(slide,
    ['팔란티어 용어', 'DB 유사 개념', '설명', '추가된 차원'],
    [
      ['Object Type', 'Table / Class', '비즈니스 엔티티 (고객, 항공기, 주문)', 'GUI 기반 생성, 비즈니스 컨텍스트 내장'],
      ['Property', 'Column / Field', '엔티티의 속성', 'Value Types로 도메인 특화 타입'],
      ['Link', 'Foreign Key', '엔티티 간 관계', '명시적 의미와 방향성, 다형성'],
      ['Action', 'Stored Procedure', '실세계 변경을 일으키는 동사형 작업', '보안 상속, Side Effects, 히스토리 로그'],
      ['Function', 'UDF', '계산 로직, ML 모델 호출', 'AIP Logic 연동, LLM 호출 통합'],
      ['Interface', '다형성', '여러 Object Type의 공통 구조', '서로 다른 타입의 추상화'],
    ],
    { rowH: [0.45, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide, 7);
}

function slide08_semantic_kinetic() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '시맨틱 요소(명사)와 키네틱 요소(동사)로 이분화된다');
  // 좌측: 시맨틱
  slide.addText('시맨틱 요소', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_blue,
  });
  slide.addText('"세계를 기술하는 명사"', {
    x: COL_LEFT_X, y: 2.3, w: COL_W, h: 0.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary,
  });
  const semItems = [
    'Object Type: 비즈니스 엔티티 정의',
    'Property: 엔티티의 속성과 타입',
    'Link: 엔티티 간 관계와 방향성',
    'Interface: 공통 구조 추상화',
  ];
  slide.addText(semItems.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_LEFT_X, y: 2.8, w: COL_W, h: 3.8,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8,
  });
  // 우측: 키네틱
  slide.addText('키네틱 요소', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan,
  });
  slide.addText('"세계를 변화시키는 동사"', {
    x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 0.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary,
  });
  const kinItems = [
    'Action: 실세계 변경 + 보안 상속',
    'Function: 계산 로직 + ML/LLM 호출',
    'Side Effects: 웹훅, 알림, CDC 연동',
    'Writeback: 양방향 데이터 흐름',
  ];
  slide.addText(kinItems.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_RIGHT_X, y: 2.8, w: COL_W, h: 3.8,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8,
  });
  addPageNumber(slide, 8);
}

function slide09_db_isomorphism() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'DB 모델링과 개념적으로 동형이나 통합에서 차별화된다');
  const bullets = [
    { text: '개별 프리미티브는 Table/Column/FK/Stored Procedure와 동형 (Feng 분석)', options: { bullet: true, indentLevel: 0 } },
    { text: '아리스토텔레스(BC350) → ER 모델(1976) → OOP(1990s) → OWL(2001) → Palantir(2016)', options: { bullet: true, indentLevel: 0 } },
    { text: '그러나 혁신의 소재는 개념이 아니라 "통합과 접근성"에 있다:', options: { bullet: true, indentLevel: 0 } },
    { text: '  ① 데이터+로직+액션+보안의 4중 통합을 단일 플랫폼에서 제공', options: { bullet: true, indentLevel: 1 } },
    { text: '  ② GUI 기반으로 비개발자도 Object Type 생성/수정 가능', options: { bullet: true, indentLevel: 1 } },
    { text: '  ③ AIP를 통해 LLM의 컨텍스트로 직접 주입 가능', options: { bullet: true, indentLevel: 1 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
  });
  addPageNumber(slide, 9);
}

function slide10_owl_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'OWL/RDF와는 목적부터 다르다');
  addStyledTable(slide,
    ['비교 항목', '팔란티어 온톨로지', 'OWL/RDF'],
    [
      ['주 목적', '운영 워크플로우, 의사결정 실행', '형식적 시맨틱, 기계 추론'],
      ['추론 능력', '없음 (규칙 기반 액션으로 대체)', 'OWL 추론 엔진으로 새 사실 도출'],
      ['실시간 운영', '핵심: 실시간 라이트백, 스트리밍', '일반적으로 정적, 주기적 갱신'],
      ['UI/워크플로우', '기본 내장 (Workshop, AIP)', '표준에 없음'],
      ['보안 모델', '행/열 수준 세분화 보안 내장', '표준에 없음'],
      ['상호운용성', '독점적 (JSON/OpenAPI 내보내기)', 'W3C 표준, 오픈 생태계'],
    ],
    { rowH: [0.45, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide, 10);
}

function slide11_quad_integration() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '데이터+로직+액션+보안의 4중 통합이 핵심 혁신이다');
  const cards = [
    { title: '데이터 모델', body: 'Object Type, Property, Link로 비즈니스 엔티티를 구조화. GUI 기반 생성 및 관리.' },
    { title: '비즈니스 로직', body: 'Function으로 계산/ML/LLM 호출 통합. 별도 앱 코드 없이 온톨로지 안에서 로직 실행.' },
    { title: '실행 동작', body: 'Action으로 실세계 변경. Writeback + Side Effects(웹훅, 알림)로 외부 시스템과 연동.' },
    { title: '권한 관리', body: '행/열 수준 세분화 보안이 온톨로지에 내장. 별도 IAM 없이 데이터 접근 통제.' },
  ];
  cards.forEach((c, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, { x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h, title: c.title, body: c.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide, 11);
}

// --- 섹션 2: 플랫폼 아키텍처 ---

function slide12_section2() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('플랫폼 아키텍처', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('4개 레이어, 백엔드 마이크로서비스, 데이터 흐름 원칙', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
  });
  addPageNumber(slide, 12);
}

function slide13_four_layers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4개 레이어가 외부 소스에서 앱까지 연결한다');
  const layers = [
    { step: '① 데이터 연결', desc: '외부 소스(ERP, CRM, IoT, DB)에서 raw 데이터 수집', color: COLORS.accent_purple },
    { step: '② 파이프라인', desc: 'Pipeline Builder에서 raw → clean 변환 (타입 캐스팅, UTC 정규화)', color: COLORS.accent_red },
    { step: '③ 온톨로지', desc: 'OMS(메타데이터) + OSS(쿼리) + Object Storage V2 + Actions Service', color: COLORS.accent_blue },
    { step: '④ 애플리케이션', desc: 'Workshop(대시보드), AIP(AI), OSDK(외부 앱)를 통해 사용자와 상호작용', color: COLORS.accent_cyan },
  ];
  layers.forEach((l, i) => {
    const y = 1.9 + i * 1.25;
    slide.addShape('roundRect', {
      x: 0.6, y, w: 12.13, h: 1.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary },
    });
    slide.addShape('rect', { x: 0.6, y, w: 0.08, h: 1.0, fill: { color: l.color } });
    slide.addText(l.step, {
      x: 1.0, y, w: 3.0, h: 1.0,
      fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: l.color, valign: 'middle',
    });
    slide.addText(l.desc, {
      x: 4.0, y, w: 8.73, h: 1.0,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
    if (i < layers.length - 1) {
      slide.addText('▼', {
        x: 6.0, y: y + 0.95, w: 1.33, h: 0.35,
        fontSize: 14, color: COLORS.text_tertiary, align: 'center',
      });
    }
  });
  addPageNumber(slide, 13);
}

function slide14_microservices() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '백엔드 마이크로서비스가 온톨로지를 운영한다');
  const cards = [
    { title: 'OMS', body: 'Ontology Metadata Service\n\nObject Type, Link, Action의 정의(스키마)를 관리하는 메타데이터 저장소' },
    { title: 'OSS', body: 'Object Set Service\n\n온톨로지 객체의 읽기, 검색, 집계 쿼리를 처리하는 서비스' },
    { title: 'Actions Service', body: '사용자 편집을 원자적 트랜잭션으로 커밋하고 writeback 데이터셋에 저장' },
    { title: 'Object Data Funnel', body: '소스 데이터셋의 변경을 감지하여 Object Storage V2 인덱스와 동기화' },
  ];
  cards.forEach((c, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, { x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h, title: c.title, body: c.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide, 14);
}

function slide15_data_flow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '데이터는 원본 그대로 수집하고 파이프라인에서 변환한다');
  const bullets = [
    { text: '핵심 원칙: 데이터를 원본 그대로(as-is) 수집', options: { bullet: true, indentLevel: 0 } },
    { text: '변환 이력을 Foundry 파이프라인 내부에서 완전히 관리', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지 정의는 JSON 형식으로 저장되며 다운로드 가능', options: { bullet: true, indentLevel: 0 } },
    { text: '파이프라인 단계: Data Connection → Pipeline Builder → Ontology Hydration', options: { bullet: true, indentLevel: 0 } },
    { text: 'Object Data Funnel이 데이터셋 변경 → 오브젝트 인덱스를 자동 동기화', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 15);
}

function slide16_writeback() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Writeback이 온톨로지를 읽기 전용이 아닌 운영 시스템으로 만든다');
  const steps = [
    { step: '1', title: '사용자 편집', desc: 'Action을 통해 오브젝트 수정 요청' },
    { step: '2', title: '원자적 트랜잭션', desc: '변경이 원자적으로 커밋 (전체 성공 또는 전체 실패)' },
    { step: '3', title: 'Writeback 저장', desc: '변경 내용이 writeback 데이터셋에 기록' },
    { step: '4', title: '파이프라인 재처리', desc: '원본 데이터와 writeback을 병합 처리' },
    { step: '5', title: '실시간 반영', desc: '모든 앱(Workshop, AIP, 외부)에 즉시 반영' },
  ];
  steps.forEach((s, i) => {
    const y = 1.9 + i * 1.0;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(s.step, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(s.title, {
      x: 1.5, y, w: 3.0, h: 0.55,
      fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(s.desc, {
      x: 4.5, y, w: 8.23, h: 0.55,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  addPageNumber(slide, 16);
}

// --- 섹션 3: 구축과 운영의 실제 ---

function slide17_section3() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('구축과 운영의 실제', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('Object Type 생성, 6단계 여정, FDE 모델, 유지보수', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
  });
  addPageNumber(slide, 17);
}

function slide18_two_paths() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Object Type 생성에는 두 가지 경로가 있다');
  // 좌측
  slide.addText('경로 A: Ontology Manager', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_blue,
  });
  const pathA = [
    'Ontology Manager에서 New → Object Type',
    '백킹 데이터셋 없이 스키마 먼저 정의 가능',
    '데이터셋 컬럼 → Properties 자동 매핑',
    '기본 키(PK)와 타이틀 키 설정',
    '메타데이터(아이콘, 설명) 추가',
  ];
  slide.addText(pathA.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_LEFT_X, y: 2.4, w: COL_W, h: 4.2,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6,
  });
  // 우측
  slide.addText('경로 B: Pipeline Builder', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan,
  });
  const pathB = [
    'Pipeline Builder에서 transform 출력으로 생성',
    'Object type 이름·온톨로지 지정',
    '데이터 컬럼 → Properties 자동 처리',
    'Link Types 추가 (소스/타겟 지정)',
    '파이프라인 배포로 온톨로지 업데이트',
  ];
  slide.addText(pathB.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_RIGHT_X, y: 2.4, w: COL_W, h: 4.2,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6,
  });
  addPageNumber(slide, 18);
}

function slide19_build_journey() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '온톨로지 구축은 6단계 여정을 거친다');
  const items = [
    { step: '1단계', title: '도메인 모델링', description: '핵심 비즈니스 엔티티·관계 정의 | 도메인 전문가 + FDE | 수 주' },
    { step: '2단계', title: '데이터 연결', description: '외부 소스 수집 파이프라인 구축 | 데이터 엔지니어 + FDE | 수 주~수 개월' },
    { step: '3단계', title: '파이프라인 구축', description: 'raw → clean 변환, 품질 규칙 적용 | 데이터 엔지니어 | 수 주' },
    { step: '4단계', title: '온톨로지 정의', description: 'Object Type / Link / Action 생성 | FDE + 도메인 전문가 | 수 주' },
    { step: '5단계', title: '앱 구축', description: 'Workshop 대시보드, 워크플로우 구성 | FDE + 비즈니스 팀 | 수 주~수 개월' },
    { step: '6단계', title: '운영 전환', description: '교육, 피드백, 반복 개선 | 전체 팀 | 지속적' },
  ];
  // Timeline
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', {
      x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(item.step, {
      x: 1.0, y: itemY, w: 1.5, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard', bold: true,
      color: COLORS.accent_blue,
    });
    slide.addText(item.title, {
      x: 2.5, y: itemY, w: 3.0, h: 0.35,
      fontSize: 15, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary,
    });
    slide.addText(item.description, {
      x: 2.5, y: itemY + 0.35, w: 10.23, h: itemH - 0.45,
      fontSize: 12, fontFace: 'Pretendard',
      color: COLORS.text_secondary, valign: 'top',
    });
    if (i < items.length - 1) {
      slide.addShape('line', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
        line: { color: 'E2E8F0', width: 0.5 },
      });
    }
  });
  addPageNumber(slide, 19);
}

function slide20_fde() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'FDE 모델이 품질을 높이지만 비용도 높인다');
  const bullets = [
    { text: 'Forward-Deployed Engineer: 팔란티어 엔지니어가 고객사에 상주하며 구축 지원', options: { bullet: true, indentLevel: 0 } },
    { text: '도메인 전문가 + 데이터 모델링 + 팔란티어 플랫폼 전문가의 삼중 교집합 필요', options: { bullet: true, indentLevel: 0 } },
    { text: '상위 20개 고객 평균 연간 계약: $93.9M (약 1,200억 원)', options: { bullet: true, indentLevel: 0 } },
    { text: '전체 954개 고객 평균: $4.7M/년 (약 60억 원)', options: { bullet: true, indentLevel: 0 } },
    { text: 'AIP Bootcamp: 1,000+ 기업 참여 집중 도입 프로그램으로 진입 장벽 완화 시도', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.0,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  slide.addText('출처: Palantir 2025 Annual Report. 수치는 2025년 기준이며 AIP Bootcamp 확대로 향후 평균 계약 규모 변동 가능.', {
    x: 0.6, y: 6.2, w: 12.13, h: 0.5,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 20);
}

function slide21_maintenance() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '스키마 변경은 버전 명 대신 속성 추가로 관리한다');
  const bullets = [
    { text: '버전 명 금지: Message_v2, Customer_old 같은 이름 사용 금지', options: { bullet: true, indentLevel: 0 } },
    { text: '속성 추가/deprecated 처리로 점진적 진화', options: { bullet: true, indentLevel: 0 } },
    { text: '안정적 ID 전략: 복합 키보다 단일 비즈니스 ID 사용', options: { bullet: true, indentLevel: 0 } },
    { text: 'Branch 활용: 운영 환경 영향 없이 변경 테스트 가능', options: { bullet: true, indentLevel: 0 } },
    { text: '배포 후 Object type ID, 링크, 소스/타겟은 수정 불가 → 초기 설계가 중요', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 21);
}

function slide22_risks() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '대규모 온톨로지에는 3가지 운영 리스크가 있다');
  const cards = [
    { title: '시스템 경계 충돌', body: '팀이 많아질수록 동일 비즈니스 개념의 Object Type이 중복 생성되는 문제 발생' },
    { title: 'DRY 원칙 위반', body: '유사한 Logic이 여러 Function에 반복 구현되면 유지보수 비용이 급증' },
    { title: '데이터 신선도', body: '백킹 데이터셋의 업데이트 빈도를 모니터링하지 않으면 "stale ontology" 문제' },
    { title: 'OSDK 확장성', body: 'TypeScript/Python/Java SDK로 외부 앱에서 접근 가능하나 일부 타입은 아직 미지원' },
  ];
  cards.forEach((c, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, { x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h, title: c.title, body: c.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide, 22);
}

// --- 섹션 4: 산업별 사례 ---

function slide23_section4() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('산업별 사례', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('국방, 항공 제조, 헬스케어, 에너지, 금융, 정부 — 6개 분야의 실제 적용', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide, 23);
}

function slide24_gotham_er() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Gotham의 핵심은 Entity Resolution이다', '국방/정보기관');
  const bullets = [
    { text: '동일한 실세계 개체가 복수 데이터 소스에서 서로 다른 ID로 존재', options: { bullet: true, indentLevel: 0 } },
    { text: 'NSA, CIA, FBI 각각에 다른 ID로 등록된 동일 인물', options: { bullet: true, indentLevel: 0 } },
    { text: '유사도 임계값(s_ij > θ) 기반으로 캐노니컬 객체로 통합', options: { bullet: true, indentLevel: 0 } },
    { text: 'canonicalObjectPrimaryKey / winnerObjectPrimaryKey 체계', options: { bullet: true, indentLevel: 0 } },
    { text: '주의: 임계값 θ는 비공개이며, 오설정 시 무고한 민간인 포함 위험', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 24);
}

function slide25_gotham_mechanism() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유사도 임계값 기반으로 캐노니컬 객체를 생성한다', '국방/정보기관');
  addStyledTable(slide,
    ['핵심 Object Type', '역할', '관계'],
    [
      ['Person', '인물 엔티티', '→ Organization, Vehicle, Event'],
      ['Organization', '조직 엔티티', '→ Person, Location'],
      ['Vehicle', '차량/장비', '→ Person, Location'],
      ['Location', '장소', '→ Event, Person'],
      ['Event', '사건/활동', '→ Person, Location, Organization'],
      ['Asset', '정보 자산', '→ Person, Event'],
    ],
    { rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  addPageNumber(slide, 25);
}

function slide26_gotham_workflow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '다중 소스에서 작전 결심까지의 워크플로우', '국방/정보기관');
  const steps = [
    { step: '1', title: '다중 소스 수집', desc: '신호정보, 내부고발자 보고서, 감시 데이터 등 이종 출처' },
    { step: '2', title: 'Entity Resolution', desc: '유사도 기반으로 동일 인물/조직/장소를 캐노니컬 객체로 통합' },
    { step: '3', title: '관계 그래프 구축', desc: 'Person-Organization-Event-Location 간 관계 자동 연결' },
    { step: '4', title: '분석관 탐색', desc: '그래프 탐색을 통한 위협 네트워크 패턴 발견' },
    { step: '5', title: 'AI 경보 + 작전 결심', desc: '이상 패턴 자동 감지 → 인간 분석관 최종 판단' },
  ];
  steps.forEach((s, i) => {
    const y = 1.9 + i * 1.0;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(s.step, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(s.title, {
      x: 1.5, y, w: 3.5, h: 0.55,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(s.desc, {
      x: 5.0, y, w: 7.73, h: 0.55,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  addPageNumber(slide, 26);
}

function slide27_gotham_ied() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'IED 탐지에서 기존 군 시스템보다 우수한 성능을 보였다', '국방/정보기관');
  const bullets = [
    { text: '아프가니스탄 IED 탐지에서 DCGS-A(기존 군 시스템) 대비 우수한 성능 보고', options: { bullet: true, indentLevel: 0 } },
    { text: '그러나 전군 표준화(DCGS-A 대체)는 실패', options: { bullet: true, indentLevel: 0 } },
    { text: '다중 정보 소스의 관계 그래프가 IED 네트워크 패턴 탐지에 효과적', options: { bullet: true, indentLevel: 0 } },
    { text: 'Intelligence Augmentation 철학: 완전 자동화가 아닌 인간+소프트웨어 협업', options: { bullet: true, indentLevel: 0 } },
    { text: '출처: Wikipedia. 독립 성능 비교 데이터는 제한적.', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 27);
}

function slide28_airbus_problem() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '"남은 작업이 무엇인가"라는 질문에 아무도 답할 수 없었다', 'Airbus Skywise');
  const bullets = [
    { text: 'A350 생산량 4배 증가 목표 → 5백만 개 부품, 4개국, 8+ 공장 데이터 통합 필요', options: { bullet: true, indentLevel: 0 } },
    { text: '"특정 항공기에 현재 남은 작업이 무엇인가?"에 답하는 시스템이 없었음', options: { bullet: true, indentLevel: 0 } },
    { text: '각 공장, 부서, 시스템이 독립적으로 데이터를 관리하는 사일로 상태', options: { bullet: true, indentLevel: 0 } },
    { text: '항공기 한 대당 최대 20,000개 센서, 비행당 100만 데이터 포인트', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 28);
}

function slide29_airbus_ontology() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '항공기-센서-부품-공급업체의 이중 그래프를 구축했다', 'Airbus Skywise');
  addStyledTable(slide,
    ['그래프 1: 운용', '역할', '그래프 2: 공급망', '역할'],
    [
      ['Aircraft', '기종별 꼬리번호', 'Supplier', '부품 공급업체'],
      ['Sensor', '항공기당 2만개', 'Part', '5백만 개 부품'],
      ['Reading', '센서 측정값', 'WorkOrder', '작업 지시서'],
      ['MaintenanceEvent', '정비 이력', 'ProductionSchedule', '생산 일정'],
    ],
    { rowH: [0.45, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide, 29);
}

function slide30_airbus_result() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'A350 납품이 33% 가속화되었다 (팔란티어 발표)', 'Airbus Skywise');
  // KPI cards
  const kpis = [
    { label: 'A350 납품 가속화', value: '33%', color: COLORS.accent_blue },
    { label: '현재 사용자 수', value: '50,000+', color: COLORS.accent_cyan },
    { label: '연결 항공기', value: '10,500+', color: COLORS.accent_yellow },
  ];
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * 4.1;
    slide.addShape('roundRect', {
      x, y: 1.8, w: 3.8, h: 2.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary },
    });
    slide.addText(kpi.value, {
      x: x + 0.15, y: 1.9, w: 3.5, h: 1.0,
      fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: kpi.color, align: 'center',
    });
    slide.addText(kpi.label, {
      x: x + 0.15, y: 2.95, w: 3.5, h: 0.45,
      fontSize: 14, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center',
    });
  });
  slide.addText('출처: 팔란티어-에어버스 공동 PDF (2020). 독립 검증 없음. 2026년 다년간 협력 연장 계약 체결.', {
    x: 0.6, y: 4.2, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 30);
}

function slide31_airbus_growth() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Skywise는 50,000명 사용자, 10,500대 항공기를 연결한다', 'Airbus Skywise');
  const bullets = [
    { text: '세계 최대 항공 데이터 통합 플랫폼으로 성장', options: { bullet: true, indentLevel: 0 } },
    { text: '항공사, MRO, 제조사가 하나의 온톨로지를 공유', options: { bullet: true, indentLevel: 0 } },
    { text: '예측 정비: 센서 Reading → Alert → WorkOrder 자동 생성', options: { bullet: true, indentLevel: 0 } },
    { text: '공급망 최적화: Supplier → Part → ProductionSchedule 연계로 병목 조기 탐지', options: { bullet: true, indentLevel: 0 } },
    { text: '이 사례가 보여주는 핵심: 온톨로지의 가치는 단일 사용처가 아닌 다중 앱의 공유 데이터 모델', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 31);
}

function slide32_n3c_standard() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '팔란티어는 자체 온톨로지 대신 OMOP 표준을 수용했다', 'N3C (헬스케어)');
  const bullets = [
    { text: 'N3C = National COVID Cohort Collaborative, 75개+ 의료기관 참여', options: { bullet: true, indentLevel: 0 } },
    { text: '팔란티어가 자체 온톨로지를 설계하지 않고 OMOP 5.3.1 CDM 업계 표준 수용', options: { bullet: true, indentLevel: 0 } },
    { text: '핵심 Object Types: Patient, Encounter, Lab Result, Diagnosis, Procedure, Medication', options: { bullet: true, indentLevel: 0 } },
    { text: '시사점: 팔란티어의 가치는 "온톨로지 설계"보다 "어떤 표준이든 그 위에서 통합·운영"하는 능력', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 32);
}

function slide33_n3c_scale() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '1,300만 환자, 50억 행의 COVID 데이터를 통합했다', 'N3C (헬스케어)');
  const kpis = [
    { label: '환자 수', value: '13M+', color: COLORS.accent_blue },
    { label: '데이터 행', value: '50억+', color: COLORS.accent_cyan },
    { label: '참여 기관', value: '75+', color: COLORS.accent_yellow },
  ];
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * 4.1;
    slide.addShape('roundRect', {
      x, y: 1.8, w: 3.8, h: 2.0, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary },
    });
    slide.addText(kpi.value, {
      x: x + 0.15, y: 1.9, w: 3.5, h: 1.0,
      fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: kpi.color, align: 'center',
    });
    slide.addText(kpi.label, {
      x: x + 0.15, y: 2.95, w: 3.5, h: 0.45,
      fontSize: 14, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center',
    });
  });
  slide.addText('출처: PMC 학술 논문 (PMID 32761549). N3C 데이터 규모는 학술적으로 검증된 독립 수치.', {
    x: 0.6, y: 4.2, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 33);
}

function slide34_n3c_decision() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '백신 배분과 약물 재창출 의사결정을 지원했다', 'Tiberius (헬스케어)');
  const bullets = [
    { text: 'Tiberius 시스템: 연방-주정부-약국 체인까지 연결하는 백신 배분 플랫폼', options: { bullet: true, indentLevel: 0 } },
    { text: '취약 집단 우선 백신 배분 최적화', options: { bullet: true, indentLevel: 0 } },
    { text: '코로나19-기저질환 상관관계 분석', options: { bullet: true, indentLevel: 0 } },
    { text: '약물 재창출 후보 탐색: 기존 약물의 새로운 적응증 발견', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지의 역할: 다기관 데이터를 하나의 Patient 중심 뷰로 통합', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 34);
}

function slide35_bp() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'BP는 200만 센서의 실시간 디지털 트윈을 구축했다', '에너지');
  const bullets = [
    { text: '2014년부터 팔란티어와 협력, 200만+ 센서 실시간 통합', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지: Asset(설비) → Sensor → Reading → Alert → WorkOrder', options: { bullet: true, indentLevel: 0 } },
    { text: '생산 최적화: Well/Field → ProductionForecast 연계', options: { bullet: true, indentLevel: 0 } },
    { text: 'AIP 추가 이후: 자연어로 "북해 플랫폼의 압력 이상 설비 목록" 질의 가능', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지가 LLM의 배경 지식 역할 — 엔지니어의 질문을 구조화된 쿼리로 변환', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 35);
}

function slide36_aml() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '금융 AML에서 25개 위험 지표를 관계 그래프로 연결했다', '금융');
  addStyledTable(slide,
    ['Object Type', '역할', '핵심 관계'],
    [
      ['Customer', '고객 (25+ 위험 지표)', '→ Account, Entity'],
      ['Account', '계좌', '→ Transaction'],
      ['Transaction', '거래', '→ Account(from/to)'],
      ['Entity/Network', '실소유권 그래프', '→ Organization (체인)'],
      ['Alert/Case', '경보 및 사건', '→ Customer, Transaction'],
      ['Sanction/PEP', '제재·정치적 노출인', '→ Customer Match'],
    ],
    { rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  slide.addText('출처: 팔란티어 AML 브로슈어. KYC 10일→10시간, TP 40배 등은 자체 주장 (독립 검증 없음).', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 36);
}

function slide37_ice() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'ICE 사례는 온톨로지의 도구 비중립성을 보여준다', '정부/이민집행');
  const bullets = [
    { text: 'FALCON/ICM 플랫폼: Subject, Case, Travel, Location, Vehicle, Encounter 통합', options: { bullet: true, indentLevel: 0 } },
    { text: 'FOIA 공개: 민사 추방 대상을 형사 수사로 등록하여 데이터 접근 확대', options: { bullet: true, indentLevel: 0 } },
    { text: 'ELITE 도구(2026): 메디케이드 건강 데이터를 이민 집행에 연계 — 심각한 프라이버시 문제', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지 설계(어떤 엔티티를 어떻게 연결하는가)가 권력 구조를 결정한다', options: { bullet: true, indentLevel: 0 } },
    { text: '기술적 질문이 곧 정치적 질문이 되는 사례', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 37);
}

function slide38_cross_pattern() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6개 산업에서 온톨로지는 동일한 설계 패턴을 따른다');
  addStyledTable(slide,
    ['패턴', '국방', '헬스케어', '항공', '에너지', '금융', '이민'],
    [
      ['핵심 엔티티', 'Person', 'Patient', 'Aircraft', 'Asset', 'Customer', 'Subject'],
      ['이벤트', 'Event', 'Encounter', 'FlightPhase', 'Reading', 'Transaction', 'Encounter'],
      ['계층 소속', 'Org→Person', '—', 'Supplier→Part', 'Well→Asset', 'Org→Account', 'Case→Subject'],
      ['경보/결과', '—', '—', 'WorkOrder', 'Alert', 'Alert/Case', 'Case'],
    ],
    { rowH: [0.45, 0.55, 0.55, 0.55, 0.55] }
  );
  addPageNumber(slide, 38);
}

function slide39_common_principle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심은 "이 엔티티의 모든 정보를 한 뷰로" 보는 것이다');
  const bullets = [
    { text: '모든 사례에서 동일한 문제 해결: "이 엔티티와 관련된 모든 정보를 하나의 뷰에서"', options: { bullet: true, indentLevel: 0 } },
    { text: '차이는 도메인별 엔티티와 관계의 구체적 내용뿐', options: { bullet: true, indentLevel: 0 } },
    { text: '공통 구조: 핵심 엔티티 허브 + 이벤트 타임라인 + 계층적 소속 + 경보/결과', options: { bullet: true, indentLevel: 0 } },
    { text: '이 패턴이 반복 가능하다는 것이 팔란티어의 산업 횡단 확장력의 근거', options: { bullet: true, indentLevel: 0 } },
    { text: '동시에, 각 도메인의 구체적 온톨로지 구축에는 FDE의 도메인 전문성이 필수', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 39);
}

// --- 섹션 5: AIP ---

function slide40_section5() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('05', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('AIP: LLM과 온톨로지의 결합', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('Grounding, 환각 감소, 도구 호출, Agent Studio, 진화 역사', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
  });
  addPageNumber(slide, 40);
}

function slide41_grounding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LLM은 전체가 아닌 선택된 Object만 변수로 받는다', 'Grounding 메커니즘');
  const bullets = [
    { text: '"AIP does not magically scan the entire ontology."', options: { bullet: true, indentLevel: 0 } },
    { text: 'AIP Logic 함수 실행 시 특정 Object들이 변수처럼 주입된다', options: { bullet: true, indentLevel: 0 } },
    { text: 'LLM은 사용자/프로젝트의 권한 범위 안에서만 온톨로지에 접근', options: { bullet: true, indentLevel: 0 } },
    { text: 'Google Knowledge Graph와 구조적으로 유사 (검색 정확도 향상 원리)', options: { bullet: true, indentLevel: 0 } },
    { text: '차이: 팔란티어는 엔터프라이즈 특정 지식을 폐쇄적 그래프로 관리', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  slide.addText('출처: Sainath Palla, Towards AI (2025-11)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 41);
}

function slide42_hallucination() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '온톨로지 쿼리가 LLM의 환각을 줄인다');
  // 좌측
  slide.addText('온톨로지 없이 (직접 생성)', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_red,
  });
  slide.addText('"Distribution Center 위치는 어디인가?"\n\nLLM이 자체 생성 → 환각 발생\n존재하지 않는 위치를 그럴듯하게 답변', {
    x: COL_LEFT_X, y: 2.4, w: COL_W, h: 3.5,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5,
  });
  // 우측
  slide.addText('온톨로지 경유 (쿼리 실행)', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan,
  });
  slide.addText('"Distribution Center 위치는 어디인가?"\n\nLLM이 온톨로지 쿼리로 변환\n→ 실제 Object에서 데이터 반환\n→ 사실 기반 정확한 답변', {
    x: COL_RIGHT_X, y: 2.4, w: COL_W, h: 3.5,
    fontSize: 15, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5,
  });
  slide.addText('출처: Palantir Blog (2024-07). 자체 사례이며 독립 벤치마크는 확인되지 않음.', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 42);
}

function slide43_tool_use() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Actions와 Functions가 LLM의 도구로 등록된다');
  const bullets = [
    { text: 'AIP Logic에서 Actions와 Functions가 LLM의 "도구(Tool)"로 등록', options: { bullet: true, indentLevel: 0 } },
    { text: 'LLM이 추론 과정에서 어떤 도구를 호출할지 스스로 결정', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지를 통해 실제 시스템에 작용 (읽기 + 쓰기)', options: { bullet: true, indentLevel: 0 } },
    { text: '권한 상속: LLM은 사용자의 권한 범위 안에서만 작동', options: { bullet: true, indentLevel: 0 } },
    { text: '예시: 재고 확인(Function) → 공급업체 평가(Function) → 주문 생성(Action)', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  addPageNumber(slide, 43);
}

function slide44_evolution() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Gotham(2008) → Foundry(2016) → AIP(2023)로 진화했다');
  const items = [
    { step: '2008', title: 'Gotham: 정보기관용', description: '엔티티 관계 그래프. CIA/NSA용 Intelligence Augmentation. In-Q-Tel 초기 투자.' },
    { step: '2016', title: 'Foundry: 기업용', description: 'Object/Property/Link/Action 4요소 정형화. 비즈니스 디지털 트윈. Airbus, Morgan Stanley 도입.' },
    { step: '2023', title: 'AIP: AI 결합', description: 'LLM + 온톨로지 연결. AIP Logic (노코드 LLM 함수). Grounding layer 역할.' },
    { step: '2024', title: 'Agent Studio', description: '멀티스텝 에이전트. AIP Evals (신뢰성 테스트). 1,000+ 기업 Bootcamp.' },
    { step: '2025', title: '최신 확장', description: 'Claude Opus 4 에이전트, Python SDK v2, Qualcomm 엣지 AI 연동.' },
  ];
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', {
      x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(item.step, {
      x: 1.0, y: itemY, w: 1.2, h: 0.35,
      fontSize: 14, fontFace: 'Pretendard', bold: true,
      color: COLORS.accent_blue,
    });
    slide.addText(item.title, {
      x: 2.3, y: itemY, w: 4.0, h: 0.35,
      fontSize: 15, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: 2.3, y: itemY + 0.35, w: 10.43, h: itemH - 0.45,
        fontSize: 12, fontFace: 'Pretendard',
        color: COLORS.text_secondary, valign: 'top',
      });
    }
    if (i < items.length - 1) {
      slide.addShape('line', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
        line: { color: 'E2E8F0', width: 0.5 },
      });
    }
  });
  addPageNumber(slide, 44);
}

function slide45_agent_studio() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AIP Agent Studio가 멀티스텝 자동화를 지원한다');
  const cards = [
    { title: 'AIP Logic', body: '노코드 LLM 함수 빌더\n\n입력: Ontology Object\n출력: 추천, 편집, 새 Object\n보안: 사용자 권한 상속' },
    { title: 'Agent Studio', body: '멀티스텝 에이전트 워크플로우\n\n재고 확인 → 공급업체 평가 → 주문 생성 같은 연속 작업 자동화' },
    { title: 'AIP Evals', body: '에이전트 신뢰성 테스트\n\n도구 호출 정확도, 출력 품질, 엣지 케이스 자동 검증' },
    { title: 'OSDK 연동', body: 'Ontology SDK로 외부 앱 배포\n\nTypeScript/Python/Java\n2024년 말 베타 출시' },
  ];
  cards.forEach((c, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, { x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h, title: c.title, body: c.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide, 45);
}

// --- 섹션 6: 균형 잡힌 평가 ---

function slide46_section6() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('06', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('균형 잡힌 평가', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('차별점, 벤더 락인, 과대포장 비판, 의사결정 가이드', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
  });
  addPageNumber(slide, 46);
}

function slide47_competitors() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '경쟁사 대비 실행 가능한 운영 레이어가 차별점이다');
  addStyledTable(slide,
    ['차원', 'Palantir Foundry/AIP', 'Databricks', 'Snowflake'],
    [
      ['시맨틱 레이어', '실행 가능한 운영 레이어', 'Unity Catalog (메타데이터)', 'YAML 시맨틱 모델 (분석)'],
      ['AI 집중', '운영 워크플로우에 AI 배포', 'AI 모델 빌딩·훈련', 'AI 기반 분석'],
      ['주요 사용자', '비즈니스 분석가, 운영팀', '데이터 엔지니어, 과학자', '분석가, 데이터 엔지니어'],
      ['오픈소스', '코어 폐쇄, SDK/API 공개', '오픈소스 (Delta Lake)', 'Apache Iceberg 지원'],
      ['대상 규모', '$500M+ 연매출 기업', '유연', '유연'],
    ],
    { rowH: [0.45, 0.6, 0.6, 0.6, 0.6, 0.6] }
  );
  addPageNumber(slide, 47);
}

function slide48_isomorphism_verdict() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '개념은 동형이나 통합에서 제품 레벨 차별점이 있다');
  // 좌측: Feng 비판
  slide.addText('Feng의 비판 (근거 강도: 중간)', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_red,
  });
  const fengItems = [
    'Object/Property/Link/Action은 Table/Column/FK/SP와 동형',
    '아리스토텔레스 → ER → OOP → OWL → Palantir: 5번째 재포장',
    '"같은 것에 다른 이름을 붙여 3자리 수 배의 가격"',
    'PostgreSQL 전문가의 외부 관찰에 기반',
  ];
  slide.addText(fengItems.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_LEFT_X, y: 2.4, w: COL_W, h: 4.2,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4, paraSpaceAfter: 6,
  });
  // 우측: 통합 판단
  slide.addText('통합 판단', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan,
  });
  const verdictItems = [
    '개별 프리미티브 동형성은 기술적으로 유효',
    '그러나 4중 통합(데이터+로직+액션+보안)은 기존 개별 시스템 조합으로 달성 어려움',
    'GUI 기반 비개발자 접근성 + AI 연동 내장',
    'Feng 자신도 "가치는 개념 밖에 있다" 인정',
  ];
  slide.addText(verdictItems.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), {
    x: COL_RIGHT_X, y: 2.4, w: COL_W, h: 4.2,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4, paraSpaceAfter: 6,
  });
  addPageNumber(slide, 48);
}

function slide49_vendor_lockin() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '벤더 락인은 구조적 문제이나 SDK/API는 공개되어 있다');
  const bullets = [
    { text: '코어 플랫폼은 폐쇄 소스이나, OSDK(GitHub 공개), JSON/OpenAPI 내보내기 지원', options: { bullet: true, indentLevel: 0 } },
    { text: '데이터를 CSV/JSON으로 내보낼 수 있지만 다른 시스템에서 즉시 사용 불가', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지 위에 워크플로우와 앱이 쌓이면 전환 비용이 기하급수적으로 증가', options: { bullet: true, indentLevel: 0 } },
    { text: 'Databricks(Delta Lake), Snowflake(Iceberg)와 달리 자체 호스팅 불가', options: { bullet: true, indentLevel: 0 } },
    { text: '정부 계약의 경우 기술 주권(technological sovereignty) 장기 리스크', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
  });
  slide.addText('출처: HASH.ai "The Problem with Palantir" (2025-04)', {
    x: 0.6, y: 6.5, w: 12.13, h: 0.3,
    fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 49);
}

function slide50_confidence_matrix() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모든 정량적 성과 데이터는 팔란티어 자체 출처이다', '근거 신뢰도 매트릭스');
  addStyledTable(slide,
    ['핵심 주장', '출처', '확신도', '독립 검증'],
    [
      ['4중 통합이 제품 차별점', '팔란티어 공식 문서', '높음', '불필요 (기술 구조 사실)'],
      ['프리미티브가 DB와 동형', 'Feng (vonng.com)', '중간', '기술적으로 유효'],
      ['A350 33% 가속화', '팔란티어-에어버스 PDF', '중간', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
      ['KYC 20배 효율화', '팔란티어 AML 브로슈어', '낮음', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
      ['벤더 락인 심각', 'HASH.ai 독립 분석', '높음', '있음 (구조적 논거)'],
      ['AIP 환각 감소', '팔란티어 블로그', '중간', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
      ['정부 매출 비중 54%', 'Annual Report (IR)', '높음', '있음 (공시)'],
    ],
    { rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  addPageNumber(slide, 50);
}

function slide51_conflicts() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 상충점 4건의 통합 판단', '상충점 해결 테이블');
  addStyledTable(slide,
    ['상충 주제', '통합 판단'],
    [
      ['기술적 독창성', '개념은 동형이나, 통합·접근성에서 제품 레벨 차별점 존재'],
      ['벤더 락인 심각도', '코어 폐쇄이나 SDK/API 공개; 전환 비용은 실질적으로 높음'],
      ['Feng 비판 근거 강도', '중간으로 하향 조정 (비사용자 외부 관찰, 제품 가치 미포함)'],
      ['성과 수치 신뢰도', '모든 정량적 성과에 "팔란티어 주장" 태그 부착'],
    ],
    { rowH: [0.45, 0.7, 0.7, 0.7, 0.7] }
  );
  addPageNumber(slide, 51);
}

function slide52_decision_guide() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '도입 검토 시 7가지 조건별 의사결정 가이드', '역방향 의사결정 가이드');
  addStyledTable(slide,
    ['조건', '의사결정'],
    [
      ['이종 데이터 소스 10개 미만, 단일 팀', 'ETL + BI 도구로 충분한지 먼저 검토'],
      ['"분석"이 아닌 "운영 실행" 수준 필요', 'Action/Writeback이 차별점. 경쟁사에 없는 기능'],
      ['연간 SW 예산 $5M 미만', 'AIP Bootcamp 활용하되 복잡한 온톨로지는 예산 초과 위험'],
      ['LLM + 운영 워크플로우 통합 목표', '기구축 온톨로지가 있으면 AIP ROI 높음'],
      ['멀티벤더/오픈소스 원칙', '벤더 락인 리스크. 오픈소스 조합 검토'],
      ['비즈니스 도메인이 빠르게 변화', '온톨로지 유지보수 부담. "불완전한 온톨로지는 위험"'],
      ['정부/규제 환경 데이터 통합', '조달 경험·보안 인증이 강점. 윤리적 리스크 평가 필요'],
    ],
    { rowH: [0.4, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52] }
  );
  addPageNumber(slide, 52);
}

// --- 예상 밖 발견 ---

function slide53_unexpected() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '리서치에서 발견된 4가지 예상 밖 사실');
  const cards = [
    { title: 'N3C: 표준 수용', body: '팔란티어가 자체 온톨로지 대신 OMOP CDM 업계 표준을 수용. 가치는 설계가 아닌 통합 플랫폼 능력에.' },
    { title: 'ICE: 도구 비중립성', body: '온톨로지 설계(엔티티 연결 방식)가 권력 구조를 결정. 기술적 질문이 정치적 질문이 되는 사례.' },
    { title: 'MCP: 독점적 위치 위협', body: 'OpenAI/Anthropic의 MCP 표준화가 확산되면 grounding layer 독점 포지션 약화 가능.' },
    { title: '오픈소스 재현', body: '3-layer 온톨로지 아키텍처를 오픈소스로 재현한 프로젝트 존재. 진짜 해자는 FDE+정부 관계.' },
  ];
  cards.forEach((c, i) => {
    const pos = CARD_2X2.positions[i];
    addCard(slide, { x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h, title: c.title, body: c.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide, 53);
}

function slide54_follow_up() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '다음에 조사해야 할 3가지 후속 질문');
  const questions = [
    { num: '1', title: '온톨로지 구축의 실제 ROI', desc: '"ETL + 범용 LLM" 대비 팔란티어 온톨로지의 경제적 타당성.\n중견기업($50M~$500M)에서의 손익분기점은 어디인가?' },
    { num: '2', title: '온톨로지 거버넌스 실무', desc: '대규모 조직(Object Type 수백 개)에서 변경 승인, 스튜어드 역할, 팀 간 충돌 해결.\nFDE 철수 후 자체 운영이 가능한가?' },
    { num: '3', title: 'MCP 시대의 포지셔닝', desc: 'MCP가 표준으로 자리잡을 경우 온톨로지의 grounding layer 역할은 어떻게 변하는가?\n팔란티어가 MCP를 수용할 것인가, 독자 생태계를 유지할 것인가?' },
  ];
  questions.forEach((q, i) => {
    const y = 1.9 + i * 1.7;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.1, w: 0.5, h: 0.5,
      fill: { color: CHART_STYLE.colors[i] },
    });
    slide.addText(q.num, {
      x: 0.8, y: y + 0.1, w: 0.5, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(q.title, {
      x: 1.6, y, w: 11.13, h: 0.45,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary,
    });
    slide.addText(q.desc, {
      x: 1.6, y: y + 0.5, w: 11.13, h: 1.1,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
    });
  });
  addPageNumber(slide, 54);
}

// --- 마무리 ---

function slide55_closing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 요약');
  const summaryPoints = [
    '팔란티어 온톨로지의 개념은 기존 DB 모델링과 동형이나, 데이터+로직+액션+보안의 4중 통합으로 제품 레벨 차별화를 달성했다.',
    '6개 산업에서 "핵심 엔티티 허브 + 이벤트 타임라인 + 계층적 소속"이라는 일관된 패턴으로 작동하며, AIP를 통해 LLM의 grounding layer로 진화했다.',
    '모든 성과 수치가 자체 출처이며 벤더 락인이 구조적으로 존재하므로, 도입 검토 시 ROI 정량화와 대안 비교가 필수적이다.',
  ];
  summaryPoints.forEach((point, i) => {
    const y = 1.9 + i * 1.2;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(point, {
      x: 1.5, y, w: 11.23, h: 0.95,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle', lineSpacingMultiple: 1.3,
    });
  });
  // 구분선
  const divY = 1.9 + 3 * 1.2 + 0.3;
  slide.addShape('line', {
    x: 0.6, y: divY, w: 12.13, h: 0,
    line: { color: 'E2E8F0', width: 0.5 },
  });
  slide.addText('검색 비용: Perplexity ~$1.76 (26회) | Tavily 42/1,000 크레딧 (31회) | 총 57회 API 호출', {
    x: 0.6, y: divY + 0.3, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center',
  });
  addPageNumber(slide, 55);
}

// ================================================================
// 보강 슬라이드 함수 (v2)
// ================================================================

function slideN_hub_pattern() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모든 도메인에는 "중심 Object"가 있다', '설계 원칙 1: 허브 패턴');
  slide.addText('비유: 태양계에서 행성이 태양 주위를 도는 것처럼, 온톨로지에서도 모든 Object가 하나의 허브를 중심으로 연결된다.', {
    x: 0.6, y: 1.8, w: 12.13, h: 0.6,
    fontSize: 15, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.accent_blue, lineSpacingMultiple: 1.3,
  });
  addStyledTable(slide,
    ['도메인', '허브 Object', '이유', '식별 질문'],
    [
      ['항공 MRO', 'Aircraft (항공기)', '센서, 정비, 부품이 모두 항공기에 연결', '"매일 아침 가장 먼저 확인하는 것은?"'],
      ['병원', 'Patient (환자)', '처방, 검사, 입원이 모두 환자에 연결', ''],
      ['제조업', 'WorkOrder (작업지시)', '자재, 기계, 작업자가 모두 연결', ''],
      ['금융 AML', 'Transaction (거래)', '계좌, 고객, 위험도가 모두 거래를 통해 연결', ''],
    ],
    { y: 2.6, rowH: [0.45, 0.55, 0.55, 0.55, 0.55] }
  );
  slide.addText('허브 없이 설계하면 온톨로지가 "데이터 목록"이 된다. 모든 Object가 동등하면 "어디서 시작해야 하는가"가 불분명해진다.', {
    x: 0.6, y: 5.6, w: 12.13, h: 0.8,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, lineSpacingMultiple: 1.3,
  });
  addPageNumber(slide, 9);
}

function slideN_event_timeline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '상태 변화는 반드시 별도 Object로 분리한다', '설계 원칙 2: 이벤트 타임라인 패턴');
  // 좌측: 잘못된 설계
  slide.addText('잘못된 설계', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.4,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
  });
  slide.addText('Patient 시트에 "진료일1, 진료내용1, 진료일2, 진료내용2..."를 컬럼으로 추가\n\n→ 하나의 거대한 행이 됨\n→ 10번째 진료부터 컬럼 부족\n→ "지난 3개월 진료만 조회" 불가능', {
    x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.5,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5,
  });
  // 우측: 올바른 설계
  slide.addText('올바른 설계', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.4,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan,
  });
  slide.addText('Patient Object + MedicalVisit Object\n(1:N Link로 연결)\n\n→ 각 진료가 독립 행\n→ 시간 기반 필터링 가능\n→ 진료별 담당의사, 비용 등 속성 자유롭게 추가', {
    x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.5,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5,
  });
  slide.addText('3가지 분리 신호: ① "언제"가 중요 ② 같은 이벤트가 여러 번 발생 ③ 이벤트에 추가 속성이 붙음', {
    x: 0.6, y: 6.2, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary,
  });
  addPageNumber(slide, 10);
}

function slideN_property_vs_object() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '"이 데이터가 독립적 생명체인가?"로 분리를 판단한다', '설계 원칙 3~5: PK 전략 · 네이밍 · 분리 기준');
  addStyledTable(slide,
    ['판단 질문', 'Yes → 별도 Object', 'No → Property'],
    [
      ['여러 오브젝트에서 공유되는가?', '부서는 여러 직원이 공유 → Object', '이름은 이 직원만의 것 → Property'],
      ['독립적으로 검색될 필요가 있는가?', '부서별 예산 조회 → Object', '직급은 직원을 통해서만 → Property'],
      ['자체에 추가 속성이 붙는가?', '부서에는 부서장, 위치 → Object', '생년월일은 단일 값 → Property'],
      ['독립적으로 존재할 수 있는가?', '직원 없는 부서도 존재 → Object', '직원 없는 이름은 무의미 → Property'],
    ],
    { y: 1.8, rowH: [0.45, 0.6, 0.6, 0.6, 0.6] }
  );
  const bullets = [
    { text: 'PK 전략: 복합 키 대신 단일 비즈니스 ID (직원번호, 주문번호)', options: { bullet: true, indentLevel: 0 } },
    { text: '네이밍: EmployeeV2, FlightNew 금지 → 기존 Object에 속성 추가/삭제로 진화', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 5.3, w: 12.13, h: 1.3,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4, paraSpaceAfter: 4,
  });
  addPageNumber(slide, 11);
}

function slideN_writeback_7steps() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '버튼 하나를 누르면 7단계 연쇄가 일어난다', 'Writeback 완전 인과 체인');
  const steps = [
    { n: '1', t: 'Action 버튼 클릭', d: '사용자가 파라미터 입력 후 제출 (예: "작업 완료" + 교체 부품 번호)' },
    { n: '2', t: 'Submission Criteria 검사', d: '"이 사용자가 인증된 담당자인가?" → 불합격 시 여기서 종료' },
    { n: '3', t: 'Writeback Webhook', d: '외부 시스템(ERP)에 요청. 실패 → 전체 롤백 (온톨로지 변경 없음)' },
    { n: '4', t: 'Ontology Rules 실행', d: '원자적 트랜잭션: WorkOrder 완료 + Alert 해결 + 부품 교체 한꺼번에' },
    { n: '5', t: 'Writeback 데이터셋 저장', d: 'Object Storage V2에 즉시 인덱스 업데이트 (~6-7초)' },
    { n: '6', t: 'Side Effect 실행', d: '알림·웹훅 발송. 실패해도 4단계 변경은 유지됨 (핵심 차이!)' },
    { n: '7', t: '전체 앱 반영', d: 'Workshop, AIP, 외부 앱 모두에서 변경 즉시 확인 가능' },
  ];
  steps.forEach((s, i) => {
    const y = 1.8 + i * 0.72;
    slide.addShape('ellipse', {
      x: 0.7, y: y + 0.02, w: 0.35, h: 0.35,
      fill: { color: i === 2 ? COLORS.accent_red : i === 5 ? COLORS.accent_yellow : COLORS.accent_blue },
    });
    slide.addText(s.n, {
      x: 0.7, y: y + 0.02, w: 0.35, h: 0.35,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(s.t, {
      x: 1.2, y, w: 2.8, h: 0.4,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(s.d, {
      x: 4.1, y, w: 8.63, h: 0.4,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  addPageNumber(slide, 20);
}

function slideN_airbus_sensor_lifecycle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '센서 데이터 하나가 Object가 되기까지의 6단계', 'Airbus 역설계: 데이터 생애주기');
  const steps = [
    { n: '1', t: '센서 측정', d: 'A350 엔진 오일 온도 센서가 142.3°C 측정 → ACMU(항공기 내 컴퓨터)에 기록' },
    { n: '2', t: '지상 전송', d: 'ACARS(항공-지상 통신) 또는 착륙 후 Wi-Fi로 raw 바이너리 데이터 전송' },
    { n: '3', t: 'Raw 데이터셋', d: 'Foundry에 원본 그대로 저장: {sensor_id, timestamp, value, unit, flight_id}' },
    { n: '4', t: '파이프라인 변환', d: 'UTC 타임스탬프 정규화 + 단위 변환 + 기체 번호 매핑 + 이상치 플래그' },
    { n: '5', t: 'Object 매핑', d: 'SensorReading Object Type에 매핑 → Aircraft, Flight과 Link 자동 연결' },
    { n: '6', t: '연쇄 반응', d: '온도 > 150°C → MaintenanceAlert 생성 → WorkOrder 트리거 → 정비 대시보드 표시' },
  ];
  steps.forEach((s, i) => {
    const y = 1.8 + i * 0.85;
    slide.addShape('ellipse', {
      x: 0.7, y: y + 0.05, w: 0.35, h: 0.35,
      fill: { color: CHART_STYLE.colors[i % 6] },
    });
    slide.addText(s.n, {
      x: 0.7, y: y + 0.05, w: 0.35, h: 0.35,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(s.t, {
      x: 1.2, y, w: 2.3, h: 0.5,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(s.d, {
      x: 3.6, y, w: 9.13, h: 0.5,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  addPageNumber(slide, 35);
}

function slideN_airbus_action_chain() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '"센서 교체 완료" 버튼을 누르면 4개 Object가 동시에 바뀐다', 'Airbus 역설계: Action 연쇄');
  const changes = [
    { obj: 'WorkOrder', change: 'status → "Completed"', color: COLORS.accent_blue },
    { obj: 'MaintenanceAlert', change: 'status → "Resolved"', color: COLORS.accent_cyan },
    { obj: 'Component (구 부품)', change: 'installedOn → null (장착 해제)', color: COLORS.accent_yellow },
    { obj: 'Component (신 부품)', change: 'installedOn → Aircraft (장착)', color: COLORS.accent_purple },
  ];
  changes.forEach((c, i) => {
    const y = 1.9 + i * 1.1;
    slide.addShape('roundRect', {
      x: 0.6, y, w: 12.13, h: 0.85, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary },
    });
    slide.addShape('rect', { x: 0.6, y, w: 0.08, h: 0.85, fill: { color: c.color } });
    slide.addText(c.obj, {
      x: 1.0, y, w: 3.5, h: 0.85,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: c.color, valign: 'middle',
    });
    slide.addText(c.change, {
      x: 4.5, y, w: 8.23, h: 0.85,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  slide.addText('이 4개 변경은 하나의 원자적 트랜잭션: 전부 성공하거나 전부 실패. 부분 변경은 없다.\nSide Effect: 항공사 운항팀에 알림 + EASA 규정 보고 시스템에 Webhook', {
    x: 0.6, y: 6.0, w: 12.13, h: 0.7,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, lineSpacingMultiple: 1.3,
  });
  addPageNumber(slide, 36);
}

function slideN_aml_transaction_lifecycle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '$9,500 국제 송금 하나가 Alert가 되기까지', 'AML 역설계: Transaction 생애주기');
  const steps = [
    { n: '0', t: '코어뱅킹', d: '김민준이 A은행에서 한국으로 $9,500 송금 → 코어뱅킹 시스템에 raw 기록' },
    { n: '1', t: '파이프라인 정제', d: '통화→USD 변환, UTC 타임스탬프, 국가 코드 매핑, 목적 코드 표준화' },
    { n: '2', t: 'Transaction Object', d: 'amount_usd: 9500, type: WIRE, originating: US, beneficiary: KR 생성' },
    { n: '3', t: 'Link 연결', d: 'Customer "Minjoon Kim" + Account "A-2024-7890"과 자동 Link' },
    { n: '4', t: 'ML 점수 계산', d: 'Function이 25개 지표 + 이력 기반으로 risk_score = 72 (중위험) 산출' },
    { n: '5', t: '시나리오 엔진', d: '"CTR 근접 국제 송금" 규칙 매칭 → scenario_flag = true' },
    { n: '6', t: 'Alert 생성', d: 'ML(72점) + 시나리오(매칭) → Alert Object 생성 → 분석관 Case 할당' },
  ];
  steps.forEach((s, i) => {
    const y = 1.7 + i * 0.73;
    slide.addShape('ellipse', {
      x: 0.7, y: y + 0.02, w: 0.32, h: 0.32,
      fill: { color: i >= 5 ? COLORS.accent_red : CHART_STYLE.colors[i % 6] },
    });
    slide.addText(s.n, {
      x: 0.7, y: y + 0.02, w: 0.32, h: 0.32,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(s.t, {
      x: 1.2, y, w: 2.3, h: 0.4,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle',
    });
    slide.addText(s.d, {
      x: 3.5, y, w: 9.23, h: 0.4,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle',
    });
  });
  addPageNumber(slide, 41);
}

function slideN_aml_feedback_loop() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '분석관의 판정이 ML 모델을 더 똑똑하게 만든다', 'AML 역설계: 피드백 루프');
  // 좌측: 오탐 해제
  slide.addText('"오탐(False Positive) 해제"', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.4,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan,
  });
  slide.addText('분석관이 "이건 합법 거래" 판정\n\n→ Alert.status = "Dismissed"\n→ Alert.resolution_reason 기록\n→ Customer.risk_score 하향 조정\n→ 이 판정 데이터가 ML 학습 데이터셋에 추가\n→ 다음 학습 주기에 유사 패턴의 점수 하향\n\n결과: 같은 패턴의 오탐이 점차 줄어듦', {
    x: COL_LEFT_X, y: 2.3, w: COL_W, h: 4.0,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  // 우측: 진양성 확인
  slide.addText('"의심 거래 확인(True Positive)"', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.4,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
  });
  slide.addText('분석관이 "이건 의심 거래" 판정\n\n→ Case.status = "Escalated"\n→ SAR(의심거래보고서) 자동 생성\n→ 규제기관(FinCEN)에 전송\n→ Customer.risk_score 상향 고정\n→ 관련 네트워크 전체에 위험 전파\n→ ML이 이 패턴을 강화 학습\n\n결과: 유사 패턴의 탐지율 향상', {
    x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 4.0,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide, 42);
}

function slideN_beneficial_ownership() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '실소유권 그래프로 쉘 컴퍼니 네트워크를 탐지한다', 'AML 역설계: 그래프 순회 vs SQL');
  const bullets = [
    { text: '시나리오: Alpha사 → Beta사 → Gamma사 → Delta사로 소유권 체인이 이어진다', options: { bullet: true, indentLevel: 0 } },
    { text: 'Delta사 계좌에 수상한 자금이 유입 → "진짜 소유자가 누구인가?"', options: { bullet: true, indentLevel: 0 } },
    { text: '온톨로지 그래프: Organization→Organization Link를 따라 3단계 순회 → Alpha사 발견 (수 초)', options: { bullet: true, indentLevel: 0 } },
    { text: 'SQL 방식: 자기참조 조인 3번 중첩 → 단계가 늘어날수록 기하급수적 복잡도', options: { bullet: true, indentLevel: 0 } },
    { text: '핵심 차이: SQL은 "몇 단계까지 찾을지" 미리 정해야 하지만, 그래프는 "끝까지" 추적 가능', options: { bullet: true, indentLevel: 0 } },
  ];
  slide.addText(bullets, {
    x: 0.6, y: 1.8, w: 12.13, h: 3.5,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top',
  });
  slide.addText('비유: 가계도에서 "이 사람의 증조부가 누구인가"를 찾을 때,\n엑셀에서는 셀을 하나하나 타고 올라가야 하지만, 가계도 그래프에서는 선을 따라가면 된다.', {
    x: 0.6, y: 5.5, w: 12.13, h: 1.0,
    fontSize: 14, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.accent_blue, lineSpacingMultiple: 1.4,
  });
  addPageNumber(slide, 43);
}

function slideN_design_guide() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('07', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
  });
  slide.addText('온톨로지 설계 가이드', {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary,
  });
  slide.addText('어떤 도메인이든 적용 가능한 6단계 설계 프로세스', {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
  });
  addPageNumber(slide, 59);
}

function slideN_6step_process() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6단계로 온톨로지를 설계할 수 있다', '실전 설계 프로세스');
  const items = [
    { step: '1단계', title: '허브 식별', description: '"매일 아침 가장 먼저 확인하는 것은?" → 그것이 중심 Object' },
    { step: '2단계', title: '이벤트 분리', description: '허브에 시간순으로 쌓이는 것들을 별도 Object로 분리' },
    { step: '3단계', title: '지원 Object 추가', description: '허브와 이벤트를 보조하는 참조 데이터 (부서, 제품, 지역 등)' },
    { step: '4단계', title: 'Link 설계', description: '1:N vs M:N 판단 + 방향성 결정 + 조인 Object 필요 여부' },
    { step: '5단계', title: 'Action 정의', description: '운영 워크플로우에서 사용자가 수행하는 행동 → 파라미터/규칙/Side Effect' },
    { step: '6단계', title: 'Security + Interface', description: '행/열 수준 보안 적용 + 공통 구조에 Interface 정의 + 테스트' },
  ];
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', {
      x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(item.step, {
      x: 1.0, y: itemY, w: 1.5, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue,
    });
    slide.addText(item.title, {
      x: 2.5, y: itemY, w: 3.0, h: 0.35,
      fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
    });
    slide.addText(item.description, {
      x: 2.5, y: itemY + 0.35, w: 10.23, h: itemH - 0.45,
      fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_secondary, valign: 'top',
    });
    if (i < items.length - 1) {
      slide.addShape('line', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
        line: { color: 'E2E8F0', width: 0.5 },
      });
    }
  });
  addPageNumber(slide, 60);
}

function slideN_design_example() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '예시: 물류 회사에 6단계를 적용하면', '실전 적용 예시');
  addStyledTable(slide,
    ['단계', '적용 결과'],
    [
      ['1. 허브 식별', '"매일 아침 확인하는 것?" → Shipment (배송건). 모든 데이터가 배송건 중심으로 연결'],
      ['2. 이벤트 분리', 'TrackingEvent (위치 추적), StatusUpdate (상태 변경), DeliveryAttempt (배송 시도)를 별도 Object로'],
      ['3. 지원 Object', 'Warehouse (창고), Driver (기사), Vehicle (차량), Customer (고객)'],
      ['4. Link 설계', 'Shipment→TrackingEvent (1:N), Shipment→Driver (N:1), Driver→Vehicle (N:1)'],
      ['5. Action 정의', '"배송 완료" Action: Shipment.status = Delivered + 고객에게 알림 + ERP에 Webhook'],
      ['6. Security', '고객은 자기 배송건만, 창고 관리자는 담당 권역만, 본사는 전체 접근'],
    ],
    { rowH: [0.45, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7] }
  );
  addPageNumber(slide, 61);
}

// 보강된 Closing
function slideN_closing_v2() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 요약');
  const summaryPoints = [
    '온톨로지는 데이터를 저장하는 것이 아니라, "이 데이터로 무엇을 해야 하는가"까지 포함하는 의사결정 모델이다.',
    'Airbus(센서→Alert→WorkOrder)와 AML(Transaction→ML점수→Alert→분석관→피드백)에서 보듯, 핵심은 "이벤트 → 경보 → 조사 → 해결"의 인과 체인이다.',
    'Action/Writeback의 7단계 체인이 온톨로지를 "읽기 전용 카탈로그"가 아닌 "운영 시스템"으로 만든다.',
    '5가지 설계 원칙(허브·이벤트분리·PK·네이밍·분리기준)과 6단계 프로세스로 어떤 도메인에서든 설계를 시작할 수 있다.',
  ];
  summaryPoints.forEach((point, i) => {
    const y = 1.9 + i * 1.1;
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fill: { color: COLORS.accent_blue },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_on_dark, align: 'center', valign: 'middle',
    });
    slide.addText(point, {
      x: 1.5, y, w: 11.23, h: 0.85,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle', lineSpacingMultiple: 1.3,
    });
  });
  const divY = 1.9 + 4 * 1.1 + 0.3;
  slide.addShape('line', {
    x: 0.6, y: divY, w: 12.13, h: 0,
    line: { color: 'E2E8F0', width: 0.5 },
  });
  slide.addText('검색 비용 (1차+2차): Perplexity ~$4.13 | Tavily 86/1,000 크레딧 | 총 100회 API 호출', {
    x: 0.6, y: divY + 0.2, w: 12.13, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center',
  });
  addPageNumber(slide, 65);
}

// ================================================================
// 실행 (65장)
// ================================================================

// 섹션 1: 온톨로지 핵심 원리 (슬라이드 1~14)
slide01_title();                    // 1
slide02_learningGoals();            // 2
slide03_toc();                      // 3
slide04_section1();                 // 4
slide05_quote_definition();         // 5
slide06_philosophy();               // 6
slide07_primitives_table();         // 7
slide08_semantic_kinetic();         // 8
slideN_hub_pattern();               // 9  ★ NEW
slideN_event_timeline();            // 10 ★ NEW
slideN_property_vs_object();        // 11 ★ NEW
slide09_db_isomorphism();           // 12
slide10_owl_comparison();           // 13
slide11_quad_integration();         // 14

// 섹션 2: 아키텍처 + 구축/운영 (15~25)
slide12_section2();                 // 15
slide13_four_layers();              // 16
slide14_microservices();            // 17
slide15_data_flow();                // 18
slide16_writeback();                // 19
slideN_writeback_7steps();          // 20 ★ NEW
slide17_section3();                 // 21
slide18_two_paths();                // 22
slide19_build_journey();            // 23
slide20_fde();                      // 24
slide22_risks();                    // 25

// 섹션 3: 산업별 사례 (26~46)
slide23_section4();                 // 26
slide24_gotham_er();                // 27
slide26_gotham_workflow();          // 28
slide28_airbus_problem();           // 29
slide29_airbus_ontology();          // 30
slide30_airbus_result();            // 31
slide31_airbus_growth();            // 32
slide32_n3c_standard();             // 33
slide33_n3c_scale();                // 34
slideN_airbus_sensor_lifecycle();   // 35 ★ NEW
slideN_airbus_action_chain();       // 36 ★ NEW
slide35_bp();                       // 37
slide36_aml();                      // 38
slide37_ice();                      // 39
slide38_cross_pattern();            // 40
slideN_aml_transaction_lifecycle(); // 41 ★ NEW
slideN_aml_feedback_loop();         // 42 ★ NEW
slideN_beneficial_ownership();      // 43 ★ NEW
slide39_common_principle();         // 44

// 섹션 4: AIP (45~50)
slide40_section5();                 // 45
slide41_grounding();                // 46
slide42_hallucination();            // 47
slide43_tool_use();                 // 48
slide44_evolution();                // 49
slide45_agent_studio();             // 50

// 섹션 5: 평가 (51~58)
slide46_section6();                 // 51
slide47_competitors();              // 52
slide48_isomorphism_verdict();      // 53
slide49_vendor_lockin();            // 54
slide50_confidence_matrix();        // 55
slide51_conflicts();                // 56
slide52_decision_guide();           // 57
slide53_unexpected();               // 58

// 섹션 6: 설계 가이드 (59~61) ★ NEW
slideN_design_guide();              // 59
slideN_6step_process();             // 60
slideN_design_example();            // 61

// 마무리 (62~65)
slide54_follow_up();                // 62
slide21_maintenance();              // 63
slide34_n3c_decision();             // 64
slideN_closing_v2();                // 65

const outputPath = path.join(__dirname, 'palantir-ontology-v2.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log('저장 완료:', outputPath))
  .catch(err => console.error('저장 실패:', err));
