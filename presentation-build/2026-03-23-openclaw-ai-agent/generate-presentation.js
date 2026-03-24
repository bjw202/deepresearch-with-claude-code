const PptxGenJS = require('pptxgenjs');
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
    valign: 'middle'
  },
  cell: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    valign: 'middle'
  },
  cellRight: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    align: 'right',
    valign: 'middle'
  },
  cellAlt: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    fill: { color: COLORS.bg_secondary },
    valign: 'middle'
  },
  cellTotal: {
    bold: true,
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_primary,
    border: [{ type: 'solid', pt: 1.5, color: COLORS.text_primary }, null, null, null],
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

const CHART_STYLE = {
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

const TOTAL = 35;

// ===== 헬퍼 함수 =====
function addTitleBar(slide, title, subtitle = '') {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3,
    autoFit: true
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.6, w: 12.13, h: 0.4,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_tertiary
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
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, autoFit: true
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
  });
}

function addPageNumber(slide, num) {
  slide.addText(`${num} / ${TOTAL}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right'
  });
}

function addBullets(slide, bullets, opts = {}) {
  slide.addText(bullets.map(b => ({
    text: b, options: { bullet: true, indentLevel: 0 }
  })), {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top',
    ...opts
  });
}

// ===== 슬라이드 함수 =====

function slide01_title() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('OpenClaw', {
    x: 1.5, y: 2.5, w: 10.33, h: 1.2,
    fontSize: 44, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.1
  });
  slide.addText('내 컴퓨터에서 돌아가는 AI 비서, 쓸모가 있는가?', {
    x: 1.5, y: 3.8, w: 10.33, h: 0.6,
    fontSize: 20, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center'
  });
  slide.addText('리서치 보고서  |  2026-03-23', {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center'
  });
}

function slide02_question() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('\u201CAI가 파일도 관리하고, 이메일도 처리하고,\n메신저로 시키면 알아서 해준다는데\n— 진짜인가?\u201D', {
    x: 1.5, y: 2.5, w: 10.33, h: 2.5,
    fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.text_primary, align: 'center',
    lineSpacingMultiple: 1.5
  });
  slide.addText('OpenClaw — GitHub 역대 최고 성장 프로젝트의 실체를 파헤칩니다', {
    x: 1.5, y: 5.5, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });
  addPageNumber(slide, 2);
}

function slide03_oneline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '일반 챗봇은 "대화만", OpenClaw는 "실행까지"');

  // 좌측: 일반 챗봇
  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.865, h: 4.8,
    title: '일반 챗봇 (ChatGPT, Claude)',
    body: '• 질문하면 답변을 텍스트로 줌\n• 파일을 직접 만들지 못함\n• 웹 브라우저를 조작할 수 없음\n• 대화가 끝나면 기억을 잃음\n• 시키지 않으면 아무것도 안 함',
    accentColor: COLORS.text_tertiary
  });

  // 우측: OpenClaw
  addCard(slide, {
    x: 6.865, y: 1.8, w: 5.865, h: 4.8,
    title: 'OpenClaw (AI 에이전트)',
    body: '• 파일을 만들고, 검색하고, 정리함\n• 웹 브라우저를 열어 정보를 찾아옴\n• 이메일 분류, 답장 초안 작성\n• 메신저에서 직접 AI와 대화\n• 알아서 주기적으로 확인/실행',
    accentColor: COLORS.accent_blue
  });
  addPageNumber(slide, 3);
}

function slide04_timeline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Clawdbot에서 OpenClaw까지, 4개월의 여정');

  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const items = [
    { date: '2025.11', title: 'Clawdbot 최초 공개', desc: 'Peter Steinberger가 오픈소스로 공개. 24시간 만에 9,000 스타' },
    { date: '2026.01 초', title: 'Moltbot으로 리브랜딩', desc: 'Anthropic 상표 경고로 강제 이름 변경' },
    { date: '2026.01 중', title: 'OpenClaw 최종 확정', desc: '"Moltbot은 발음이 어색하다"는 커뮤니티 피드백 반영' },
    { date: '2026.02', title: '창시자 OpenAI 합류', desc: 'Steinberger가 OpenAI 개인 에이전트 부문 리드. 프로젝트는 독립 재단으로 이관' },
    { date: '2026.03', title: 'GitHub 329K+ 스타 달성', desc: '60일 만에 React 10년 기록 추월. 역대 최고 성장 속도' },
  ];
  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;
    slide.addShape('ellipse', { x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.date, { x: 1.0, y: itemY, w: 2.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 3.0, y: itemY, w: 4.0, h: 0.35, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
    slide.addText(item.desc, { x: 3.0, y: itemY + 0.35, w: 9.73, h: itemH - 0.5, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, valign: 'top' });
    if (i < items.length - 1) {
      slide.addShape('line', { x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide, 4);
}

function slide05_creator() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '만든 사람: Peter Steinberger, 44개 AI 프로젝트의 결정체');
  addBullets(slide, [
    '오스트리아 출신 개발자. 14세에 프로그래밍 시작',
    'PSPDFKit 창업 — iPad PDF 도구로 Apple, Dropbox 등 10억 대 기기에 탑재',
    '2025년 AI "패러다임 전환"을 직감하고 44개 AI 프로젝트 실험',
    '그 경험을 집약해서 OpenClaw(당시 Clawdbot) 개발',
    '2026년 2월, OpenAI에 합류하여 개인 AI 에이전트 부문 리드',
    'OpenClaw는 독립 오픈소스 재단으로 이관 (Google-Chromium 모델)',
  ]);
  slide.addText('출처: Fortune 2026/02/19', { x: 0.6, y: 6.8, w: 12.13, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  addPageNumber(slide, 5);
}

function slide06_popularity() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'GitHub 329K+ 스타 — 60일 만에 React 10년 기록을 추월');

  // KPI cards
  const kpis = [
    { value: '329K+', label: 'GitHub 스타', color: COLORS.accent_blue },
    { value: '63.8K', label: '포크 수', color: COLORS.accent_cyan },
    { value: '1,100+', label: '기여자 수', color: COLORS.accent_yellow },
  ];
  const cardW = (12.13 - 0.3 * 2) / 3;
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    slide.addShape('roundRect', { x, y: 1.8, w: cardW, h: 1.8, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    slide.addText(kpi.value, { x: x + 0.15, y: 1.85, w: cardW - 0.3, h: 0.9, fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: true, color: kpi.color, align: 'center' });
    slide.addText(kpi.label, { x: x + 0.15, y: 2.8, w: cardW - 0.3, h: 0.35, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'center' });
  });

  // Star growth chart
  slide.addChart(pptx.charts.LINE,
    [{ name: 'GitHub Stars (K)', labels: ['출시 24h', '1주', '2주', '4주', '6주', '60일'], values: [9, 30, 100, 214, 250, 318] }],
    { x: 0.6, y: 3.9, w: 12.13, h: 2.9, showTitle: false, showLegend: false,
      lineDataSymbol: 'circle', lineDataSymbolSize: 8, lineSmooth: false,
      chartColors: [COLORS.accent_blue],
      catAxisLabelFontFace: 'Pretendard', catAxisLabelFontSize: 10, catAxisLabelColor: COLORS.text_tertiary,
      valAxisLabelFontFace: 'Pretendard', valAxisLabelFontSize: 10, valAxisLabelColor: COLORS.text_tertiary,
    }
  );
  addPageNumber(slide, 6);
}

function slide07_section_concept() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('01', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('어떻게 작동하는가', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('비서 사무실 비유로 이해하는 OpenClaw의 구조', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  addPageNumber(slide, 7);
}

function slide08_4steps() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4단계로 이해하는 OpenClaw 구조');

  const steps = [
    { num: '①', title: '비서 사무실 설치', desc: '내 컴퓨터에 Gateway(Node.js 프로그램)를 설치.\n백그라운드에서 항상 실행된다.', color: COLORS.accent_blue },
    { num: '②', title: 'AI 두뇌 연결', desc: 'Claude, GPT-4o, Gemini 등 AI 모델을\nAPI 키로 연결. 로컬 모델도 가능.', color: COLORS.accent_cyan },
    { num: '③', title: '소통 채널 연결', desc: 'WhatsApp, Telegram, Slack 등\n메신저 앱을 Gateway에 연결.', color: COLORS.accent_yellow },
    { num: '④', title: '자율 실행 루프', desc: '관찰 → 계획 → 실행 → 보고를\n최대 20회 자동 반복.', color: COLORS.accent_purple },
  ];
  const cardW = (12.13 - 0.3 * 3) / 4;
  steps.forEach((step, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    addCard(slide, { x, y: 1.8, w: cardW, h: 4.8, title: `${step.num} ${step.title}`, body: step.desc, accentColor: step.color });
  });
  addPageNumber(slide, 8);
}

function slide09_gateway() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '비서의 사무실: Gateway는 내 PC에서 항상 돌아간다');
  addBullets(slide, [
    '내 컴퓨터(Mac, Linux, Windows)에 설치되는 Node.js 프로그램',
    '기본적으로 내 PC 안에서만 접근 가능 (localhost:18789)',
    '외부 접근이 필요하면 SSH 터널이나 Tailscale 등 별도 보안 설정',
    '설치 방법: 1-click 인스톨러, Docker, 수동 설치 중 선택',
    '"내 데이터가 외부로 나가지 않는다"가 핵심 철학',
  ]);
  addPageNumber(slide, 9);
}

function slide10_brain() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AI 두뇌는 선택할 수 있다 — Claude, GPT-4o, 로컬 모델까지');

  addStyledTable(slide,
    ['AI 모델', '특징', '비용'],
    [
      ['Claude Opus / Sonnet', '복잡한 추론에 강함', 'API 사용량 기반'],
      ['GPT-4o', '범용성 높음, 빠른 응답', 'API 사용량 기반'],
      ['Gemini', 'Google 생태계 연동', 'API 사용량 기반'],
      ['Ollama (로컬)', '인터넷 불필요, 데이터 완전 로컬', '전기세만 (24GB VRAM 권장)'],
    ],
    { y: 1.8 }
  );
  slide.addText('모델이 실패하면 자동으로 대체 모델로 전환(failover)하는 기능도 내장', {
    x: 0.6, y: 4.5, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_blue
  });
  addPageNumber(slide, 10);
}

function slide11_channels() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '10개+ 메신저와 연결 — 익숙한 채팅 앱에서 AI와 대화');

  addStyledTable(slide,
    ['플랫폼', '지원 방식', '활용 예시'],
    [
      ['WhatsApp', '내장 채널', '"오늘 회의 자료 정리해줘"'],
      ['Telegram', '내장 채널', '"서버 상태 확인해줘"'],
      ['Slack', '내장 채널', '"이번 주 할 일 요약해줘"'],
      ['Discord', '내장 채널', '"커뮤니티 질문 답변해줘"'],
      ['iMessage', '내장 채널', '"내일 일정 알려줘"'],
      ['MS Teams', '확장 플러그인', '기업 환경 연동'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide, 11);
}

function slide12_agent_loop() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에이전트 루프: "관찰 → 계획 → 실행 → 보고"를 스스로 반복');

  // Flow diagram using cards
  const steps = [
    { title: '① 관찰', body: '"사장님이 WhatsApp으로\n회의 자료 정리 요청"', color: COLORS.accent_blue },
    { title: '② 계획', body: '"캘린더에서 내일 일정 확인,\n관련 파일 검색, 요약 작성"', color: COLORS.accent_cyan },
    { title: '③ 실행', body: '캘린더 API 호출,\n파일 검색, 요약 문서 작성', color: COLORS.accent_yellow },
    { title: '④ 보고', body: '"결과를 WhatsApp으로\n사장님에게 전송"', color: COLORS.accent_purple },
  ];
  const cardW = (12.13 - 0.3 * 3) / 4;
  steps.forEach((step, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    addCard(slide, { x, y: 1.8, w: cardW, h: 2.8, title: step.title, body: step.body, accentColor: step.color });
  });

  slide.addText('이 과정을 한 세션에서 최대 20회까지 자동 반복 (ReAct 패턴)', {
    x: 0.6, y: 4.9, w: 12.13, h: 0.4, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, align: 'center'
  });
  slide.addText('한 번에 하나의 작업만 순서대로 처리 (Lane Queue) — 동시에 여러 명령을 보내도 꼬이지 않는다', {
    x: 0.6, y: 5.4, w: 12.13, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary, align: 'center'
  });
  addPageNumber(slide, 12);
}

function slide13_memory() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모든 설정이 텍스트 파일 — 메모장으로 열어서 직접 수정 가능');

  addStyledTable(slide,
    ['파일', '역할', '비유'],
    [
      ['AGENTS.md', '행동 규칙', '"이렇게 일해라"'],
      ['SOUL.md', '성격과 톤', '"친근하게 말해라"'],
      ['MEMORY.md', '장기 기억', '"사용자는 커피를 좋아한다"'],
      ['HEARTBEAT.md', '주기적 체크 지침', '"30분마다 이메일 확인해라"'],
      ['TOOLS.md', '사용 가능한 도구 목록', '"브라우저, 셸, 파일 시스템"'],
    ],
    { y: 1.8 }
  );

  slide.addText('과거 대화는 SQLite 벡터 DB에 저장 → 의미 기반 검색 가능. Git으로 버전 관리도 가능.', {
    x: 0.6, y: 5.0, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary
  });
  addPageNumber(slide, 13);
}

function slide14_heartbeat() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Heartbeat: "시키지 않아도 알아서 확인한다"가 핵심 차별점');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.865, h: 4.8,
    title: '작동 방식',
    body: '30분마다(조정 가능) 스스로 깨어나서:\n\n1. HEARTBEAT.md 파일을 읽고\n2. 할 일이 있는지 판단하고\n3. 필요하면 실행\n4. 결과를 사용자에게 알림\n\n비용 절감: 먼저 규칙 기반으로 확인,\n의미 있는 변화만 AI 모델 호출',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.865, y: 1.8, w: 5.865, h: 4.8,
    title: '활용 예시',
    body: '• 아침 브리핑 자동 생성\n  ("오늘의 일정, 이메일 요약, 날씨")\n\n• 새 이메일 도착 시 중요도 분류 후 알림\n\n• 주가 급변 시 Telegram으로 경고\n\n• 예약 항공편 체크인 자동 수행\n\n• 서버 상태 모니터링 + 다운 시 재시작',
    accentColor: COLORS.accent_cyan
  });
  addPageNumber(slide, 14);
}

function slide15_skills() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '162~200+ 커뮤니티 스킬로 기능을 무한 확장');
  addBullets(slide, [
    'ClawHub 마켓플레이스에서 스킬 검색/설치 (npm install 같은 개념)',
    '19개 카테고리: CRM, SEO, 코딩, 보안, 일상 관리 등',
    '스킬은 ~/.openclaw/workspace/skills/ 폴더에 Markdown으로 저장',
    '직접 새 스킬을 만들 수도 있고, AI에게 만들라고 시킬 수도 있음',
    '⚠ 주의: 보안 감사에서 스킬의 12~20%에 악성 코드 발견 — 설치 전 반드시 코드 검토',
  ]);
  slide.addText('출처: Koi Security / Bitdefender 감사 보고서', { x: 0.6, y: 6.8, w: 12.13, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  addPageNumber(slide, 15);
}

function slide16_selfcode() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '필요한 기능이 없으면? AI가 직접 코딩해서 추가한다');
  addBullets(slide, [
    '"이런 기능이 필요해"라고 메신저로 요청하면 스킬을 자동 생성',
    '생성된 스킬은 SKILL.md 파일로 저장되어 재사용 가능',
    '프롬프트(자연어 지시)만으로 기능 확장 — 코딩 지식 불필요',
    '다만, 자동 생성된 코드의 보안성/정확성은 사용자가 검증해야 함',
    '이 "자기 확장" 능력이 OpenClaw를 단순 도구에서 "플랫폼"으로 만든 핵심',
  ]);
  addPageNumber(slide, 16);
}

function slide17_section_usecase() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('실제 사용사례', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('사람들이 진짜로 어디에 쓰고 있는가?', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 17);
}

function slide18_devops() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'DevOps: WhatsApp으로 서버 재시작, CI 실패 알림까지');
  addBullets(slide, [
    'WhatsApp/Telegram에서 승인된 셸 명령 실행 (서비스 재시작 등)',
    'GitHub PR 트리아지, 빌드 실패 시 Telegram 알림 + 원인 분석',
    '서버 모니터링: 5분마다 핑, 다운 시 자동 재시작 + 알림',
    'SSH를 통한 원격 서버 관리 — 노트북 없이 폰만으로',
    '세팅 시간: 30~90분 / 난이도: 중~고',
  ]);
  addPageNumber(slide, 18);
}

function slide19_email() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이메일/캘린더: 수백 개 이메일을 즉시 분류하고 답장 초안까지');
  addBullets(slide, [
    '이메일 수신 → 자동 분류 (중요/일반/스팸)',
    '핵심 사항 추출 → 요약 보고서 생성',
    '답장 초안 작성 → 사용자 확인 후 전송',
    '캘린더 트리아지 — 일정 충돌 감지, 우선순위 제안',
    '실사용 보고: "아침에 수백 개 이메일이 이미 정리되어 있다"',
  ]);
  addPageNumber(slide, 19);
}

function slide20_marketing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '마케팅/콘텐츠: "잠자는 동안 24/7 마케팅"이 현실로');
  addBullets(slide, [
    '소셜 미디어 팔로워 모니터링, LinkedIn 리서치, 개인화 DM 전송',
    '플랫폼별 맞춤 포스트 생성 (Twitter, LinkedIn, 블로그)',
    'UTM 태그 자동 추가, 게시 스케줄링',
    '일일 브리핑 자동 생성 — 경쟁사 동향, 키워드 트렌드',
    '1인 창업자들이 사이드 프로젝트 마케팅 전 과정에 활용',
  ]);
  addPageNumber(slide, 20);
}

function slide21_failure() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '하지만 — "안정적으로 쓸 사례를 못 찾아 셧다운했다"는 보고도');

  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_primary } });
  addTitleBar(slide, '하지만 — "안정적으로 쓸 사례를 못 찾아 셧다운했다"는 보고도');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.865, h: 2.0,
    title: 'Reddit r/openclaw (207K 멤버)',
    body: '"설치는 문제없었지만, 매일 안정적으로 쓸 수 있는 사용사례를 찾지 못해 셧다운했다"',
    accentColor: COLORS.accent_red
  });
  addCard(slide, {
    x: 6.865, y: 1.8, w: 5.865, h: 2.0,
    title: 'API 비용 폭발',
    body: '모델 라우팅/메모리 압축을 제대로 설정하지 않으면 비용 급증. 루핑 버그로 토큰 낭비 사례',
    accentColor: COLORS.accent_red
  });

  slide.addText([
    { text: '핵심 판단: ', options: { bold: true, color: COLORS.text_primary } },
    { text: '"이런 일이 가능하다"와 "이것을 매일 안정적으로 쓰고 있다" 사이에는 큰 차이가 있다.\n기술적 숙련도가 높고 명확한 자동화 니즈가 있어야 실용적이다.', options: { color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 4.2, w: 12.13, h: 1.5,
    fontSize: 16, fontFace: 'Pretendard', lineSpacingMultiple: 1.5, valign: 'top'
  });
  addPageNumber(slide, 21);
}

function slide22_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유사 도구 비교: OpenClaw은 "생활 자동화"에 최적화');

  addStyledTable(slide,
    ['', 'OpenClaw', 'Open Interpreter', 'Claude Code', 'Manus AI'],
    [
      ['핵심', '메신저 + 24/7 자율', '터미널 코드 실행', '코딩 전문 에이전트', '클라우드 자율 에이전트'],
      ['메신저 연결', '10+ 앱', '없음', '없음', '웹만'],
      ['자율 실행', 'Heartbeat 주기적', '사용자 명령만', '사용자 명령만', '가능'],
      ['설치', '내 PC (로컬)', '내 PC', '내 PC', '클라우드'],
      ['강점', '생활 전반 자동화', '가볍고 빠른 시작', '코딩 최적화', '비개발자 친화'],
      ['약점', '보안 우려, 복잡', '기능 제한적', '코딩 외 약함', '비공개, 유료'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide, 22);
}

function slide23_differentiator() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'OpenClaw만의 차별점 4가지');

  const cards = [
    { title: '메시징 네이티브', body: '유일하게 기존 채팅 앱에서 바로 AI와 대화. 별도 앱 불필요.', color: COLORS.accent_blue },
    { title: '24/7 자율성', body: 'Heartbeat로 시키지 않아도 알아서 확인하고 실행.', color: COLORS.accent_cyan },
    { title: '스킬 마켓', body: '162~200+ 커뮤니티 스킬로 기능 확장. 생태계 효과.', color: COLORS.accent_yellow },
    { title: '자기 확장', body: '필요한 기능을 AI가 직접 코딩하여 추가. 무한 확장.', color: COLORS.accent_purple },
  ];
  const cardW = (12.13 - 0.3 * 3) / 4;
  cards.forEach((card, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    addCard(slide, { x, y: 1.8, w: cardW, h: 4.8, title: card.title, body: card.body, accentColor: card.color });
  });
  addPageNumber(slide, 23);
}

function slide24_section_security() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: 'B91C1C' } });
  slide.addText('03', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: 'FECACA', align: 'center' });
  slide.addText('보안 경고', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  slide.addText('이것은 이론이 아니라, 실제로 일어난 사고들이다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 24);
}

function slide25_clawjacked() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'ClawJacked: 악성 웹페이지 방문만으로 전체 관리 권한 탈취');

  addStyledTable(slide,
    ['항목', '내용'],
    [
      ['CVE 번호', 'CVE-2026-25253'],
      ['위험도', 'CVSS 8.8 (고위험)'],
      ['공격 방식', '악성 웹페이지 방문 시 Gateway 인증 토큰 탈취'],
      ['영향', '로컬에서만 실행해도 브라우저가 다리 역할 → 전체 권한 장악'],
      ['패치', '2026.1.29 버전에서 수정 (보고 후 24시간 내)'],
      ['명명', '"ClawJacked" (Oasis Security)'],
    ],
    { y: 1.8 }
  );
  slide.addText('2차 패치(v2026.2.25)와 추가 CVE(CVE-2026-22177, 3월 20일)도 확인됨 — 보안 문제 지속 발견 중', {
    x: 0.6, y: 5.5, w: 12.13, h: 0.5, fontSize: 13, fontFace: 'Pretendard', color: COLORS.accent_red
  });
  addPageNumber(slide, 25);
}

function slide26_exposure() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '40,000+ 인스턴스가 인증 없이 공개 인터넷에 노출');

  const kpis = [
    { value: '40K+', label: '노출된 인스턴스', color: COLORS.accent_red },
    { value: '82', label: '노출 발견 국가 수', color: COLORS.accent_yellow },
    { value: '512', label: '식별된 취약점 수', color: COLORS.accent_red },
  ];
  const cardW = (12.13 - 0.3 * 2) / 3;
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    slide.addShape('roundRect', { x, y: 1.8, w: cardW, h: 1.8, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    slide.addText(kpi.value, { x: x + 0.15, y: 1.85, w: cardW - 0.3, h: 0.9, fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: true, color: kpi.color, align: 'center' });
    slide.addText(kpi.label, { x: x + 0.15, y: 2.8, w: cardW - 0.3, h: 0.35, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'center' });
  });

  addBullets(slide, [
    'Gateway 기본 설정이 인증 없이 실행됨',
    'API 키, OAuth 토큰이 일반 텍스트 설정 파일에 저장',
    '512개 취약점 중 8개가 치명적 (원격 코드 실행, 명령 주입 등)',
    '정보 탈취 악성코드(RedLine, Lumma)가 OpenClaw 설정 파일을 수집 대상에 추가',
  ], { y: 4.0, h: 2.6, fontSize: 15 });
  addPageNumber(slide, 26);
}

function slide27_malicious_skills() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '스킬 마켓의 12~20%가 악성 코드 — "npm 좌의존성" 재현');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.865, h: 4.5,
    title: '감사 결과',
    body: '• Koi Security: 2,857개 스킬 중 341개(12%) 악성\n• Bitdefender: 약 900개(~20%) 추정\n• 단일 계정("hightower6eu")이 354개 단독 업로드\n• Kaspersky: 인포스틸러가 OpenClaw 설정 경로를 수집 대상에 추가\n\n악성 유형: 자격증명 탈취, 원격 코드 실행, 데이터 유출',
    accentColor: COLORS.accent_red
  });

  addCard(slide, {
    x: 6.865, y: 1.8, w: 5.865, h: 4.5,
    title: '프롬프트 인젝션 시연',
    body: '• CEO Matvey Kukuy가 프롬프트 인젝션이 담긴 이메일을 전송\n• 5분 만에 에이전트로부터 개인 키 수신\n\n"프롬프트 인젝션"이란?\nAI에게 읽히는 텍스트 안에 몰래 명령을 숨겨서 AI의 행동을 조종하는 공격.\n\n이 문제는 업계 전체가 아직 풀지 못한 근본 과제.',
    accentColor: COLORS.accent_yellow
  });
  addPageNumber(slide, 27);
}

function slide28_expert_warnings() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전문가와 규제 당국 모두 경고 — 창시자도 "아직 비추천"');

  addStyledTable(slide,
    ['발언자', '소속/역할', '핵심 메시지'],
    [
      ['Peter Steinberger', 'OpenClaw 창시자', '"비기술적 사용자에게 아직 추천하지 않는다"'],
      ['네덜란드 DPA', '데이터보호 당국', 'OpenClaw 사용 자제 권고'],
      ['Cisco', '보안 기업', '"사이버보안 재앙"으로 평가'],
      ['Gartner', 'IT 리서치', '"에이전틱 AI의 위험한 예고편"'],
      ['Simon Willison', '보안 연구자', '"챌린저 우주왕복선 사고에 가장 가까운 후보"'],
    ],
    { y: 1.8 }
  );

  slide.addText('핵심: 창시자가 직접 비추천한 도구라는 점을 주목해야 한다', {
    x: 0.6, y: 5.5, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red
  });
  addPageNumber(slide, 28);
}

function slide29_cost() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '무료지만 공짜는 아니다 — API 비용 시나리오');

  addStyledTable(slide,
    ['사용 패턴', '월 예상 비용', '설명'],
    [
      ['경량 (하루 10회 명령)', '$5~15', '가끔 질문, 간단한 작업'],
      ['적극 (Heartbeat + 다채널)', '$50~200+', '메신저 연결, 주기적 체크, 이메일 관리'],
      ['무제한 자율운영', '$500+', '24/7 풀가동, 복수 채널, 복잡한 작업'],
      [{ text: '참고: 창시자 Steinberger', options: { ...TABLE_STYLE.cellTotal } },
       { text: '월 $10,000', options: { ...TABLE_STYLE.cellTotal, align: 'center' } },
       { text: '개발 과정에서의 서버 비용', options: { ...TABLE_STYLE.cellTotal } }],
    ],
    { y: 1.8 }
  );

  addBullets(slide, [
    'OpenClaw 자체는 MIT 라이선스 무료 — 비용은 AI 모델 API 사용량에 비례',
    '비용 최적화 방법: 로컬 모델(Ollama) 사용, Heartbeat 간격 늘리기, 경량 모델 우선 호출',
    'SOUL.md에 "비용 의식적으로 행동하라"고 지시하면 불필요한 API 호출 감소',
  ], { y: 4.2, h: 2.4, fontSize: 15 });
  addPageNumber(slide, 29);
}

function slide30_section_verdict() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('판단 기준', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('써볼까, 말까? 그리고 안전하게 시작하는 법', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 30);
}

function slide31_decision_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '상황별 판단 가이드: 나에게 맞는가?');

  addStyledTable(slide,
    ['당신의 상황', '추천', '이유'],
    [
      ['개발자 + 반복 업무 많음', { text: '시도 가치 있음', options: { ...TABLE_STYLE.cell, color: '27AE60', bold: true } }, '30~90분 세팅으로 시간 절약'],
      ['개인 사이드 프로젝트', { text: '흥미로운 실험', options: { ...TABLE_STYLE.cellAlt, color: COLORS.accent_blue, bold: true } }, 'Docker에서 최소 권한으로 시도'],
      ['비개발자 + 당장 쓰고 싶음', { text: '아직 이르다', options: { ...TABLE_STYLE.cell, color: COLORS.accent_yellow, bold: true } }, '창시자 본인이 비추천. GUI 부족'],
      ['민감한 데이터 다루는 업무', { text: '강력 비추천', options: { ...TABLE_STYLE.cellAlt, color: COLORS.accent_red, bold: true } }, '실제 보안 사고 다수. 규제 경고'],
      ['기업 RPA 대체 목적', { text: '비추천', options: { ...TABLE_STYLE.cell, color: COLORS.accent_red, bold: true } }, '감사 추적, 규정 준수 기능 부재'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide, 31);
}

function slide32_safe_start() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '안전하게 시작하기 위한 5가지 최소 조건');

  const items = [
    { num: '1', title: '격리된 환경에서 실행', desc: 'Docker 컨테이너 또는 별도 VM. 주 시스템과 분리.', color: COLORS.accent_blue },
    { num: '2', title: '전용 API 키 사용', desc: '주 계정 절대 연결 금지. 별도 키 발급.', color: COLORS.accent_cyan },
    { num: '3', title: '스킬 코드 전체 검토', desc: '설치 전 소스코드 확인. 악성 스킬 12~20%.', color: COLORS.accent_yellow },
    { num: '4', title: '네트워크 화이트리스트', desc: '필요한 곳만 접근 허용. 아웃바운드 제한.', color: COLORS.accent_purple },
    { num: '5', title: '최신 버전 유지', desc: '보안 패치가 빈번함. 자동 업데이트 설정.', color: COLORS.accent_red },
  ];

  items.forEach((item, i) => {
    const y = 1.8 + i * 1.0;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fill: { color: item.color } });
    slide.addText(item.num, { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    slide.addText(item.title, { x: 1.5, y: y, w: 4.0, h: 0.5, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, valign: 'middle' });
    slide.addText(item.desc, { x: 5.5, y: y, w: 7.23, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary, valign: 'middle' });
    if (i < items.length - 1) {
      slide.addShape('line', { x: 1.5, y: y + 0.85, w: 11.23, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide, 32);
}

function slide33_alternatives() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '비개발자를 위한 현실적 대안 4가지');

  const cards = [
    { title: 'Claude / ChatGPT', body: '대화형 AI로 충분한 경우가 많다.\n설치 없이 바로 사용. 가장 낮은 진입장벽.', color: COLORS.accent_blue },
    { title: 'Apple Shortcuts\n/ Google Home', body: '비개발자도 쉽게 쓸 수 있는\n생활 자동화. OS 레벨 통합.', color: COLORS.accent_cyan },
    { title: 'Zapier / Make', body: '앱 간 연결 자동화.\n코딩 불필요. 비주얼 플로우차트.', color: COLORS.accent_yellow },
    { title: 'Manus AI', body: '클라우드 기반 자율 에이전트.\n설치 불필요. 유료 구독.', color: COLORS.accent_purple },
  ];
  const cardW = (12.13 - 0.3) / 2;
  const cardH = 2.3;
  cards.forEach((card, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * (cardW + 0.3);
    const y = 1.8 + row * (cardH + 0.3);
    addCard(slide, { x, y, w: cardW, h: cardH, title: card.title, body: card.body, accentColor: card.color });
  });
  addPageNumber(slide, 33);
}

function slide34_section_future() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('05', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('왜 핫하고, 어디까지 갈까', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('시대적 배경과 미래 전망', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 34);
}

function slide35_why_hot() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '왜 지금 핫한가: 기술 성숙 + 사회적 수요가 동시에 맞물렸다');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.865, h: 2.2,
    title: '기술적 배경',
    body: '• AI 모델이 "대화"를 넘어 "실행" 수준 도달\n• API 비용 하락 → 개인 사용 경제적 가능\n• MCP 등 에이전트 표준 프로토콜 등장',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.865, y: 1.8, w: 5.865, h: 2.2,
    title: '사회적 배경',
    body: '• OpenAI/Google/MS 모두 "에이전트의 해" 선언\n• 영국 직장인 71%가 비승인 AI 사용 (Shadow AI)\n• 원격 근무 확산 → 자동화 니즈 가시화',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.3, w: 12.13, h: 2.3,
    title: 'OpenClaw 특유의 바이럴 요소',
    body: '• 오픈소스 + GitHub 스타 경쟁 → 네트워크 효과\n• 창시자 OpenAI 합류 → "이것이 미래 방향"이라는 시그널\n• Andrej Karpathy(AI 거물) "SF 수준의 이륙" 지지\n• AI 에이전트 소셜 네트워크 "Moltbook" 사건 → 미디어 폭발',
    accentColor: COLORS.accent_yellow
  });
  addPageNumber(slide, 35);
}

function slide36_future() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '미래 전망: 강력하지만, 프롬프트 인젝션이 천장을 결정한다');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 3.843, h: 4.8,
    title: '낙관적 시나리오',
    body: '• AI 에이전트가 "원격 근무자의 모든 일" 수행\n• 여러 에이전트가 팀처럼 협업\n• 음성 + 물리 세계 통합 → 범용 비서',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 4.743, y: 1.8, w: 3.843, h: 4.8,
    title: '현실적 시나리오',
    body: '• 복잡한 추론, 엣지 케이스 여전히 부족\n• 프롬프트 인젝션 미해결 → "완전 자율" 한계\n• RPA와 AI 에이전트가 수렴 중\n• 비개발자 사용: 수년 내 (불확실)',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 8.886, y: 1.8, w: 3.843, h: 4.8,
    title: '숨은 위협',
    body: '• Apple Intelligence, Google Gemini 등 OS 레벨 에이전트 통합\n• OS가 직접 하면 서드파티 존재 이유 약화\n• OpenClaw 장기 생존의 가장 큰 변수',
    accentColor: COLORS.accent_red
  });
  addPageNumber(slide, 36);
}

function slide37_closing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 메시지 3가지');

  const points = [
    '강력하지만 거칠다 — OpenClaw는 실제로 "일"을 하는 AI 비서이지만, 보안 사고가 현실이고 창시자도 비개발자에게 비추천한다',
    '점진적 신뢰 확장이 최선의 전략 — 신입 직원에게 일을 맡기듯, 작은 것부터 시작해서 성공을 확인한 후 범위를 넓혀라',
    '아직은 개발자의 도구 — 하지만 "에이전트의 해"가 시작되었고, AI가 실행까지 하는 시대가 열리고 있다',
  ];

  points.forEach((point, i) => {
    const y = 1.9 + i * 1.5;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.15, w: 0.55, h: 0.55, fill: { color: COLORS.accent_blue } });
    slide.addText(`${i + 1}`, { x: 0.8, y: y + 0.15, w: 0.55, h: 0.55, fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    slide.addText(point, { x: 1.6, y: y, w: 11.13, h: 0.85, fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, valign: 'middle', lineSpacingMultiple: 1.3 });
    if (i < points.length - 1) {
      slide.addShape('line', { x: 1.6, y: y + 1.2, w: 11.13, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });

  const divY = 1.9 + 3 * 1.5 + 0.3;
  slide.addShape('line', { x: 0.6, y: divY, w: 12.13, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('리서치 기반 보고서  |  2026-03-23  |  docs/research/2026-03-23-openclaw-ai-agent/', {
    x: 0.6, y: divY + 0.3, w: 12.13, h: 0.5,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });
  addPageNumber(slide, 37);
}

// ===== 실행 =====
slide01_title();
slide02_question();
slide03_oneline();
slide04_timeline();
slide05_creator();
slide06_popularity();
slide07_section_concept();
slide08_4steps();
slide09_gateway();
slide10_brain();
slide11_channels();
slide12_agent_loop();
slide13_memory();
slide14_heartbeat();
slide15_skills();
slide16_selfcode();
slide17_section_usecase();
slide18_devops();
slide19_email();
slide20_marketing();
slide21_failure();
slide22_comparison();
slide23_differentiator();
slide24_section_security();
slide25_clawjacked();
slide26_exposure();
slide27_malicious_skills();
slide28_expert_warnings();
slide29_cost();
slide30_section_verdict();
slide31_decision_table();
slide32_safe_start();
slide33_alternatives();
slide34_section_future();
slide35_why_hot();
slide36_future();
slide37_closing();

const outputPath = require('path').join(__dirname, 'openclaw-ai-agent.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log('저장 완료:', outputPath))
  .catch(err => console.error('저장 실패:', err));
