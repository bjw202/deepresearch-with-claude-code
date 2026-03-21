const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== 색상 & 폰트 상수 =====
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
  header: { bold: true, fill: { color: COLORS.bg_dark }, color: COLORS.text_on_dark, fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle' },
  cell: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, valign: 'middle' },
  cellRight: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, align: 'right', valign: 'middle' },
  cellAlt: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, fill: { color: COLORS.bg_secondary }, valign: 'middle' },
};
const TABLE_OPTIONS = { x: 0.6, y: 1.8, w: 12.13, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' }, autoPage: false, margin: [5, 8, 5, 8] };
const CHART_COLORS = ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8'];
const TOTAL_SLIDES = 55;

// ===== 헬퍼 함수 =====
function addTitleBar(slide, title, subtitle = '') {
  slide.addShape('rect', { x: 0.6, y: 0.5, w: 1.2, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText(title, { x: 0.6, y: 0.65, w: 12.13, h: 0.9, fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, charSpacing: -0.3, autoFit: true });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.6, y: 1.45, w: 12.13, h: 0.3, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  }
}

function addStyledTable(slide, headers, dataRows, opts = {}) {
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

function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 } });
  slide.addShape('rect', { x: x + 0.02, y, w: w - 0.04, h: 0.06, fill: { color: accentColor || COLORS.accent_blue } });
  slide.addText(title, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.35, fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, autoFit: true });
  slide.addText(body, { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: h - 0.65, fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.35, valign: 'top', autoFit: true });
}

function addPageNumber(slide, num) {
  slide.addText(`${num} / ${TOTAL_SLIDES}`, { x: 12.0, y: 7.05, w: 1.0, h: 0.3, fontSize: 9, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'right' });
}

function addBullets(slide, bullets, opts = {}) {
  slide.addText(bullets.map(b => ({ text: b, options: { bullet: true, indentLevel: 0 } })), {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8, fontSize: 17, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top', ...opts
  });
}

function addHighlightBox(slide, text, opts = {}) {
  const x = opts.x || 0.6, y = opts.y || 6.2, w = opts.w || 12.13, h = opts.h || 0.65;
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.06, fill: { color: 'EBF0FF' } });
  slide.addText(text, { x: x + 0.15, y, w: w - 0.3, h, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, valign: 'middle' });
}

// ===== 슬라이드 함수들 =====

function slide01_title() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  s.addText('내 매매를 도와줄\n패턴 인식 보조 시스템', { x: 1.5, y: 2.5, w: 10.33, h: 1.5, fontSize: 44, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', charSpacing: -0.5, lineSpacingMultiple: 1.15 });
  s.addText('스윙 트레이딩 고확률 피봇 포인트 탐지 & 유사 패턴 매칭', { x: 1.5, y: 4.2, w: 10.33, h: 0.6, fontSize: 20, fontFace: 'Pretendard', color: 'FFFFFF', transparency: 30, align: 'center' });
  s.addText('2026-03-21  |  Deep Research with Claude Code', { x: 1.5, y: 6.0, w: 10.33, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: 'FFFFFF', transparency: 50, align: 'center' });
}

function slide02_purpose() {
  const s = pptx.addSlide();
  addTitleBar(s, '이 시스템이 해주는 것과 하지 않는 것');
  addPageNumber(s, 2);
  // 좌 - 해주는 것
  s.addShape('roundRect', { x: 0.6, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.1, fill: { color: 'F0FFF4' } });
  s.addText('✓ 해주는 것', { x: 0.8, y: 1.9, w: 5.465, h: 0.45, fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: '27AE60' });
  s.addText([
    { text: '패턴(VCP, CWH 등)을 자동으로 탐지해서 알려준다', options: { bullet: true } },
    { text: '이 패턴이 성공할 확률을 숫자로 보여준다', options: { bullet: true } },
    { text: '과거 비슷한 차트가 어떻게 됐는지 찾아준다', options: { bullet: true } },
    { text: '성공/실패 사례를 모은 차트북을 자동 생성한다', options: { bullet: true } },
    { text: '시장 상황(강세/약세)에 따라 확률을 보정한다', options: { bullet: true } },
  ], { x: 0.8, y: 2.4, w: 5.465, h: 4.0, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, paraSpaceAfter: 6 });
  // 우 - 하지 않는 것
  s.addShape('roundRect', { x: 6.865, y: 1.8, w: 5.865, h: 4.8, rectRadius: 0.1, fill: { color: 'FFF5F5' } });
  s.addText('✗ 하지 않는 것', { x: 7.065, y: 1.9, w: 5.465, h: 0.45, fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red });
  s.addText([
    { text: '자동으로 매수/매도 주문을 넣지 않는다', options: { bullet: true } },
    { text: '포지션 크기를 자동 결정하지 않는다', options: { bullet: true } },
    { text: '손절/익절을 자동 실행하지 않는다', options: { bullet: true } },
    { text: '종목을 대신 골라주지 않는다', options: { bullet: true } },
    { text: '최종 매매 판단은 항상 내가 한다', options: { bullet: true } },
  ], { x: 7.065, y: 2.4, w: 5.465, h: 4.0, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, paraSpaceAfter: 6 });
}

function slide03_decision_card() {
  const s = pptx.addSlide();
  addTitleBar(s, '시스템이 보여주는 화면은 이렇게 생겼다', '의사결정 보조 카드 예시');
  addPageNumber(s, 3);
  s.addShape('roundRect', { x: 1.5, y: 1.8, w: 10.33, h: 5.0, rectRadius: 0.12, fill: { color: COLORS.bg_secondary }, shadow: { type: 'outer', blur: 8, offset: 3, color: '000000', opacity: 0.1 } });
  s.addShape('rect', { x: 1.52, y: 1.8, w: 10.29, h: 0.06, fill: { color: COLORS.accent_blue } });
  const lines = [
    { text: '[삼성전기 009150]  2026-03-21', options: { fontSize: 16, bold: true, color: COLORS.text_primary, fontFace: FONTS.subtitle.fontFace } },
    { text: '', options: { fontSize: 8 } },
    { text: '패턴: VCP (3차 수축, 품질 82/100)', options: { fontSize: 14, color: COLORS.text_secondary, fontFace: 'Pretendard' } },
    { text: '수축 깊이: 18% → 9% → 4%  |  볼륨 위축: -62%', options: { fontSize: 14, color: COLORS.text_secondary, fontFace: 'Pretendard' } },
    { text: '피봇 가격: 142,500원', options: { fontSize: 14, color: COLORS.text_secondary, fontFace: 'Pretendard' } },
    { text: '', options: { fontSize: 8 } },
    { text: '성공 확률:  P(+30%/10일)=19%  |  P(+20%/10일)=34%', options: { fontSize: 15, bold: true, color: COLORS.accent_blue, fontFace: 'Pretendard' } },
    { text: 'E[최대이익]: +14.8%   |   E[최대손실]: -5.3%', options: { fontSize: 14, color: COLORS.text_secondary, fontFace: 'Pretendard' } },
    { text: '시장: 강세확산 → 보정 확률: P(+30%)=24%', options: { fontSize: 14, color: '27AE60', fontFace: 'Pretendard', bold: true } },
    { text: '', options: { fontSize: 8 } },
    { text: '유사 사례:  한미반도체 25.07 [성공+42%]  |  에코프로 25.03 [실패-8%]  |  리노공업 25.11 [성공+35%]', options: { fontSize: 13, color: COLORS.text_tertiary, fontFace: 'Pretendard' } },
    { text: '', options: { fontSize: 6 } },
    { text: '⚠ 이 패턴 유형의 역사적 base rate = 15%  |  유사 5건 중 2건만 +30% 성공', options: { fontSize: 12, color: COLORS.accent_yellow, fontFace: 'Pretendard', bold: true } },
  ];
  s.addText(lines, { x: 1.8, y: 2.0, w: 9.73, h: 4.5, valign: 'top', lineSpacingMultiple: 1.3 });
}

function slide04_section1() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('01', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('왜 만드는가', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('눈으로 보는 패턴의 한계, 그리고 데이터로 보완하는 방법', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
}

function slide05_problem() {
  const s = pptx.addSlide();
  addTitleBar(s, '눈으로 보는 패턴은 편향이 크고, 기억은 불완전하다');
  addPageNumber(s, 5);
  addBullets(s, [
    '성공한 매매는 선명하게 기억하고, 실패한 매매는 빠르게 잊는다 (확인 편향)',
    '"이건 VCP 같은데..." — 같은 차트를 보고도 날마다 판단이 달라진다',
    '과거에 비슷한 차트가 있었는지 기억에 의존해야 한다',
    '시장이 강세인지 약세인지에 따라 같은 패턴의 의미가 달라지는데, 감으로 판단한다',
    '2,500개 종목을 매일 눈으로 훑기엔 물리적 한계가 있다',
  ]);
}

function slide06_human_vs_system() {
  const s = pptx.addSlide();
  addTitleBar(s, '사람의 눈 vs 시스템의 눈');
  addPageNumber(s, 6);
  addStyledTable(s, ['구분', '사람의 눈', '시스템의 눈'], [
    ['패턴 탐지', '경험과 직관에 의존', '수치 기준으로 일관되게 탐지'],
    ['과거 사례 검색', '기억에 의존 (편향)', '전 종목 DB에서 유사 사례 즉시 검색'],
    ['확률 판단', '"느낌적으로 괜찮다"', '"역사적으로 이 조건에서 성공률 24%"'],
    ['시장 상황 반영', '뉴스/분위기에 좌우', '시장 지표로 정량 보정'],
    ['처리 속도', '하루 50~100종목', '2,500종목 수 초'],
    ['일관성', '컨디션에 따라 변동', '항상 같은 기준 적용'],
  ]);
  addHighlightBox(s, '💡 시스템은 트레이더를 대체하는 것이 아니라, 트레이더가 놓치는 것을 보여주는 것이다');
}

function slide07_core_need() {
  const s = pptx.addSlide();
  addTitleBar(s, '과거 비슷한 차트가 어떻게 됐는지 바로 보고 싶다');
  addPageNumber(s, 7);
  addBullets(s, [
    '"지금 이 차트... 예전에 한미반도체에서 본 것 같은데?"',
    '→ 시스템이 즉시 비슷한 과거 사례 5~10개를 찾아서 보여준다',
    '→ 각 사례가 돌파 후 어떻게 됐는지 (성공/실패) 결과도 함께 표시',
    '→ "비슷한 10개 사례 중 3개만 시원하게 뚫렸다" 같은 통계도 제공',
    '',
    '이것은 의료 영상 AI와 같은 구조다:',
    '→ 의사가 CT를 보면, AI가 유사한 과거 사례를 찾아서 "이런 경우 악성 확률 73%"라고 보조한다',
    '→ 우리 시스템도 차트를 보면, 유사 사례 + 확률로 판단을 보조한다',
  ], { fontSize: 16 });
}

function slide08_quote() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  s.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  s.addText('\u201C같은 VCP라도 첫 번째 베이스와\n세 번째 베이스는 완전히 다른 매매다\u201D', { x: 1.5, y: 2.5, w: 10.33, h: 2.5, fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true, color: COLORS.text_primary, align: 'center', lineSpacingMultiple: 1.5 });
  s.addText('\u2014 Mark Minervini', { x: 1.5, y: 5.2, w: 10.33, h: 0.4, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary, align: 'center' });
  addPageNumber(s, 8);
}

function slide09_section2() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('02', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('어떤 패턴을 찾는가', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('O\'Neil, Minervini, 쿨라메기가 말하는 6가지 고확률 돌파 패턴', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
}

function slide10_stage2() {
  const s = pptx.addSlide();
  addTitleBar(s, '모든 패턴의 전제: Stage 2 상승 추세 종목만 대상으로 한다');
  addPageNumber(s, 10);
  addBullets(s, [
    'Minervini의 Trend Template — 이 조건을 만족하는 종목에서만 패턴을 찾는다',
    '현재가가 50일/150일/200일 이동평균선 위에 있어야 한다 (정배열)',
    '200일선이 최소 1개월 이상 상승 중이어야 한다',
    '52주 최저가 대비 +30% 이상 올라와 있어야 한다',
    '52주 최고가 대비 -25% 이내에 있어야 한다',
    '상대강도(RS Rating)가 상위 30% 안에 들어야 한다',
  ], { fontSize: 16 });
  addHighlightBox(s, '⚠ 이 기준은 미국 시장에서 만들어졌다. 한국 시장에서 수치를 검증하고 조정해야 한다.');
}

function slide11_trend_template() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Minervini Trend Template 8가지 조건');
  addPageNumber(s, 11);
  addStyledTable(s, ['#', '조건', '수치 기준'], [
    ['1', '현재가 > 150일선 그리고 > 200일선', '—'],
    ['2', '150일선 > 200일선', '—'],
    ['3', '200일선이 1개월+ 상승 중', '기울기 > 0'],
    ['4', '50일선 > 150일선 > 200일선', '정배열'],
    ['5', '현재가 > 50일선', '—'],
    ['6', '현재가 >= 52주 최저가 + 30%', '(가격-저점)/저점 >= 0.30'],
    ['7', '현재가 >= 52주 최고가 - 25%', '(고점-가격)/고점 <= 0.25'],
    ['8', 'RS Rating 70 이상 (이상적 80+)', '자체 상대강도 계산'],
  ]);
}

function slide12_6patterns_overview() {
  const s = pptx.addSlide();
  addTitleBar(s, '6가지 핵심 돌파 패턴 한눈에 보기');
  addPageNumber(s, 12);
  const cards = [
    { title: 'VCP', body: '변동폭이 점점 줄어들며\n에너지가 압축되는 패턴\n(Minervini)' },
    { title: 'Cup-with-Handle', body: 'U자형 바닥 후 짧은\n손잡이 구간에서 돌파\n(O\'Neil)' },
    { title: 'HTF (깃발형)', body: '급등 후 좁은 횡보 구간\n(깃발)에서 재돌파\n(O\'Neil/쿨라메기)' },
    { title: 'W패턴 (이중 바닥)', body: '두 번 바닥을 찍고\n중간 고점을 돌파\n(O\'Neil)' },
    { title: 'Low Cheat', body: '피봇 이전에 조기 진입\n거래량 극도 위축 구간\n(쿨라메기/Minervini)' },
    { title: 'Episodic Pivot', body: '실적/뉴스로 갭업 후\n눌림목에서 재돌파\n(쿨라메기)' },
  ];
  const w = 3.843, h = 2.45, gap = 0.3;
  const positions = [
    { x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 },
    { x: 0.6, y: 4.55 }, { x: 4.743, y: 4.55 }, { x: 8.886, y: 4.55 },
  ];
  cards.forEach((c, i) => {
    addCard(s, { x: positions[i].x, y: positions[i].y, w, h, title: c.title, body: c.body, accentColor: CHART_COLORS[i] });
  });
}

function slide13_vcp_explain() {
  const s = pptx.addSlide();
  addTitleBar(s, 'VCP: 변동폭이 점점 줄어들며 에너지가 압축된다');
  addPageNumber(s, 13);
  addBullets(s, [
    '매도 물량(팔려는 사람)이 점점 소진되면서 가격 흔들림이 줄어든다',
    '수축이 2~6번 반복되며, 각 수축의 깊이가 이전보다 얕아진다',
    '예시: 첫 수축 -15% → 두번째 -10% → 세번째 -5%',
    '거래량도 수축과 함께 줄어들어 "거래 정지 수준"까지 말라야 한다',
    '마지막 수축 구간의 고점이 피봇(돌파 가격)이 된다',
    '돌파 시 거래량이 평소의 1.5배 이상으로 급증해야 진짜 돌파',
  ], { fontSize: 16 });
  addHighlightBox(s, '핵심: 스프링이 압축되듯 에너지가 쌓이고, 마지막에 터진다');
}

function slide14_vcp_params() {
  const s = pptx.addSlide();
  addTitleBar(s, 'VCP를 숫자로 정의하면 이렇다');
  addPageNumber(s, 14);
  addStyledTable(s, ['항목', '기준', '출처'], [
    ['수축 횟수', '2~6회 (이상적 3회+)', 'Minervini'],
    ['수축 깊이 감소', '각 수축이 이전 대비 20~30% 작아야 함', 'Minervini'],
    ['첫 수축 최대 깊이', '강세장 ≤25%, 약세장 ≤35%', 'Minervini, TraderLion'],
    ['베이스 기간', '최소 2~3주, 보통 4~12주', 'Minervini'],
    ['수축 중 거래량', '50일 평균의 40~60%까지 감소', 'Minervini'],
    ['거래량 드라이업', '3~5일 연속 극도 낮은 거래량', 'Minervini'],
    ['돌파 시 거래량', '50일 평균의 1.5배 이상', 'Minervini'],
  ]);
  addHighlightBox(s, '⚠ 모든 수치가 미국 시장 경험치. 한국 데이터로 범위를 재확인해야 한다.');
}

function slide15_cwh() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Cup-with-Handle: U자 바닥 후 손잡이에서 돌파한다');
  addPageNumber(s, 15);
  addBullets(s, [
    '주가가 U자형으로 바닥을 만든다 (V자형 급반등은 해당 안 됨)',
    '컵의 깊이는 12~33%가 이상적 (너무 깊으면 약한 종목)',
    '컵 완성 후 짧은 하락 구간(핸들)이 1~4주 형성된다',
    '핸들의 깊이는 컵 깊이의 절반 이하여야 한다',
    '핸들 구간에서 거래량이 줄어들어야 한다',
    '컵 좌측 고점(lip) 근처가 피봇 — 여기를 거래량과 함께 돌파',
  ], { fontSize: 16 });
}

function slide16_cwh_params() {
  const s = pptx.addSlide();
  addTitleBar(s, 'CWH를 숫자로 정의하면');
  addPageNumber(s, 16);
  addStyledTable(s, ['항목', '기준', '출처'], [
    ['컵 깊이', '12~33% (약세장에서 최대 50%)', 'O\'Neil'],
    ['컵 기간', '7~65주', 'O\'Neil'],
    ['핸들 깊이', '컵 깊이의 50% 이하 (이상적 8~12%)', 'O\'Neil'],
    ['핸들 기간', '1~4주', 'O\'Neil'],
    ['핸들 거래량', '감소 추세 (드라이업)', 'O\'Neil'],
    ['좌우 Lip 차이', '±5% 이내', 'O\'Neil'],
    ['컵 바닥 형태', 'U자형 (V자형 제외)', 'O\'Neil'],
  ]);
}

function slide17_htf() {
  const s = pptx.addSlide();
  addTitleBar(s, 'HTF: 급등 후 깃발처럼 좁은 횡보에서 재돌파한다');
  addPageNumber(s, 17);
  addBullets(s, [
    '짧은 기간(8주 이내)에 30% 이상 급등한 종목이 대상',
    '급등 후 5~25일간 좁은 범위에서 횡보한다 (깃발 모양)',
    '횡보 기간의 변동성이 급등 기간의 30% 이하여야 한다',
    '횡보 구간에서 거래량이 줄어들어야 한다',
    '깃발 상단을 돌파하면 재상승 시작',
    '',
    'O\'Neil 원래 기준은 "8주 내 100% 상승"이지만, 쿨라메기는 30%+로 완화',
    '→ 이 시스템에서는 쿨라메기 기준(30%+)을 사용한다',
  ], { fontSize: 16 });
}

function slide18_remaining() {
  const s = pptx.addSlide();
  addTitleBar(s, 'W패턴, Low Cheat, Episodic Pivot');
  addPageNumber(s, 18);
  addStyledTable(s, ['패턴', '핵심 특징', '피봇 위치'], [
    ['W패턴 (이중 바닥)', '두 저점 차이 5% 이내, 간격 2~7주\n중간 반등 10~20%', '중간 고점 돌파'],
    ['Low Cheat', 'VCP/CWH 안에서 피봇 이전에 조기 진입\n거래량이 극도로 말라붙은 구간', '수축 저점 근처에서 진입'],
    ['Episodic Pivot', '실적 발표/뉴스로 갭업 +5% 이상\n거래량 평소 3배+, 이후 눌림목 형성', '갭업일 고가 또는\n5일 내 고점'],
  ], { y: 1.8 });
}

function slide19_overlap() {
  const s = pptx.addSlide();
  addTitleBar(s, '패턴이 겹칠 때: VCP인가 CWH인가?');
  addPageNumber(s, 19);
  addBullets(s, [
    'VCP와 CWH는 자주 겹친다 — 컵의 우측이 수축하면 둘 다에 해당',
    '구분 기준: CWH는 U자형 바닥이 필수, VCP는 수축 깊이 감소가 필수',
    '실무적 해법: 둘 다 해당하면 둘 다 라벨링 (다중 라벨 허용)',
    '',
    '자동 분류는 "후보 제시"까지가 목표이다',
    '최종 판단은 차트를 보고 내가 직접 하는 것이 품질을 보장한다',
  ], { fontSize: 16 });
}

function slide20_us_warning() {
  const s = pptx.addSlide();
  addTitleBar(s, '주의: 모든 수치 기준은 미국 시장에서 나왔다');
  addPageNumber(s, 20);
  addBullets(s, [
    'Minervini, O\'Neil, 쿨라메기 — 전부 미국 나스닥/NYSE 기반 경험칙',
    '한국 시장과의 차이점:',
    '  • 상한가/하한가 ±30% (미국엔 없음)',
    '  • 개인투자자 비중 70~80% (미국보다 훨씬 높음)',
    '  • 매도 시 증권거래세 0.15% + 수수료',
    '  • 공매도 제도 변화 (2020~2025 금지 → 재개)',
    '',
    '→ Phase 0에서 한국 데이터로 각 수치의 분포를 확인하고 조정해야 한다',
    '→ 미국 기준 그대로 쓰면 패턴을 너무 많이/적게 잡을 수 있다',
  ], { fontSize: 15 });
}

function slide21_section3() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('03', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('성공이란 무엇인가', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('"시원하게 뚫리는가"를 기준으로 성공과 실패를 나눈다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
}

function slide22_success_def() {
  const s = pptx.addSlide();
  addTitleBar(s, '성공 = 피봇 돌파 후 10일 내 +30%');
  addPageNumber(s, 22);
  const kpis = [
    { label: '시원한 돌파', value: '+30%', sub: '10일 내', color: '27AE60' },
    { label: '보통 돌파', value: '+10~30%', sub: '10일 내', color: COLORS.accent_yellow },
    { label: '실패', value: '-7~8%', sub: '손절선 도달', color: COLORS.accent_red },
  ];
  kpis.forEach((k, i) => {
    const x = 0.6 + i * 4.1;
    s.addShape('roundRect', { x, y: 1.8, w: 3.8, h: 2.5, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
    s.addText(k.value, { x, y: 1.95, w: 3.8, h: 1.0, fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: true, color: k.color, align: 'center' });
    s.addText(k.sub, { x, y: 2.95, w: 3.8, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'center' });
    s.addText(k.label, { x, y: 3.5, w: 3.8, h: 0.4, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
  });
  s.addText([
    { text: '왜 +30%인가?', options: { bold: true, fontSize: 16, color: COLORS.text_primary } },
    { text: '\n브레이크아웃 매매의 핵심은 "시원하게 뚫리는가". 소폭 상승(+5~10%)은 관심 대상이 아니다.\n한국 상한가가 +30%이므로, 상한가 1회에 해당하는 강한 움직임을 성공으로 본다.', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], { x: 0.6, y: 4.6, w: 12.13, h: 2.0, lineSpacingMultiple: 1.4, valign: 'top' });
}

function slide23_tiered() {
  const s = pptx.addSlide();
  addTitleBar(s, '하나의 확률이 아니라 계층적 확률로 풍부하게 보여준다');
  addPageNumber(s, 23);
  addBullets(s, [
    '+30% 성공만 보면 양성 사례가 너무 적어서 예측이 불안정할 수 있다',
    '그래서 세 단계 확률을 동시에 보여준다:',
    '  • P(+10% / 10일) = "가볍게 올라갈 확률"',
    '  • P(+20% / 10일) = "꽤 괜찮게 올라갈 확률"',
    '  • P(+30% / 10일) = "시원하게 뚫릴 확률"',
    '',
    '예: "시원한 돌파 확률은 19%로 낮지만, 꽤 괜찮은 돌파 확률은 34%"',
    '→ 이 정보를 보고 진입할지, 포지션을 얼마로 할지 내가 결정한다',
  ], { fontSize: 16 });
  addHighlightBox(s, '⚠ +30%/10일 양성 사례가 500건 미만이면 기준을 완화해야 한다 — Phase 0에서 확인');
}

function slide24_section4() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('04', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('시스템 구조', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('4개의 층으로 이루어진 의사결정 보조 파이프라인', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide25_4layers() {
  const s = pptx.addSlide();
  addTitleBar(s, '시스템은 4개의 층으로 이루어져 있다');
  addPageNumber(s, 25);
  const layers = [
    { step: 'Layer 1', title: '패턴 탐지 & 분류', description: '규칙 기반으로 VCP/CWH 등을 자동 탐지하고 품질 점수를 매긴다' },
    { step: 'Layer 2', title: '성공 확률 추정', description: '이 패턴이 시원하게 뚫릴 확률을 숫자로 계산한다' },
    { step: 'Layer 3', title: '유사 사례 검색', description: '과거에 이것과 비슷했던 차트를 찾아서 결과를 보여준다' },
    { step: 'Layer 4', title: '시장 상황 보정', description: '지금이 강세장인지 약세장인지에 따라 확률을 조정한다' },
  ];
  // Timeline style
  s.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  layers.forEach((item, i) => {
    const itemY = 1.8 + i * 1.25;
    s.addShape('ellipse', { x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    s.addText(item.step, { x: 1.0, y: itemY, w: 2.0, h: 0.35, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
    s.addText(item.title, { x: 1.0, y: itemY + 0.3, w: 11.73, h: 0.35, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    s.addText(item.description, { x: 1.0, y: itemY + 0.65, w: 11.73, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary });
    if (i < layers.length - 1) s.addShape('line', { x: 1.0, y: itemY + 1.15, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  });
}

function slide26_layer1() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Layer 1: 규칙 기반으로 패턴을 자동 탐지한다');
  addPageNumber(s, 26);
  addBullets(s, [
    'Minervini/O\'Neil의 패턴 정의를 코드로 번역한다',
    '2,500종목을 매일 스캔해서 "이 종목에 VCP가 형성 중입니다"를 알려준다',
    '각 패턴에 품질 점수(0~100점)를 매긴다',
    '  • 수축이 교과서적으로 깔끔한가?',
    '  • 거래량이 제대로 말라붙었는가?',
    '  • 이동평균선 배열이 깨끗한가?',
    '',
    '규칙이 주(primary), 머신러닝은 보조(secondary)',
    '→ 규칙이 명확하지 않은 경계 사례만 보조적으로 분류',
  ], { fontSize: 15 });
}

function slide27_layer2() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Layer 2: 이 패턴이 성공할 확률을 숫자로 보여준다');
  addPageNumber(s, 27);
  addBullets(s, [
    '과거 데이터를 학습해서 "이 조건에서 시원한 돌파가 일어날 확률"을 계산',
    '입력하는 정보:',
    '  • 패턴 자체: 수축 깊이, 횟수, 거래량 패턴, 품질 점수',
    '  • 맥락: 직전 상승폭, 몇 번째 베이스인지, 상대강도(RS)',
    '  • 시장: 코스피 추세, 업종 강도, 시장 폭',
    '',
    '확률은 반드시 "보정(calibration)"을 거친다',
    '→ 시스템이 "20% 확률"이라고 하면, 실제로 100번 중 20번이 맞아야 한다',
    '→ 보정 안 된 확률은 거짓말이나 마찬가지',
  ], { fontSize: 15 });
}

function slide28_layer3() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Layer 3: 과거에 비슷했던 차트를 찾아온다');
  addPageNumber(s, 28);
  addBullets(s, [
    '현재 종목의 패턴을 숫자 벡터로 변환한다',
    '  → 수축 깊이, 거래량 변화, 패턴 기간, RS 순위 등 ~20개 특성',
    'DB에 저장된 17,500개 과거 패턴과 비교해서 가장 비슷한 것을 찾는다',
    '검색 시간: 1밀리초 미만 (거의 즉시)',
    '',
    '찾은 결과물:',
    '  • 유사 사례 차트 이미지 (캔들차트)',
    '  • 각 사례가 돌파 후 어떻게 됐는지 (10일 후 수익률)',
    '  • 성공/실패 통계: "비슷한 10개 중 3개가 +30% 달성"',
  ], { fontSize: 15 });
}

function slide29_layer4() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Layer 4: 시장이 강세인지 약세인지에 따라 확률을 보정한다');
  addPageNumber(s, 29);
  addStyledTable(s, ['시장 상태', '판별 조건', '패턴 성공률에 미치는 영향'], [
    ['강세 확산', '코스피 > 200일선, 상승종목 > 50%', '성공률 높음 → 확률 상향 보정'],
    ['강세 수렴', '코스피 > 200일선, 상승종목 < 50%', '주의 필요 → 약간 하향'],
    ['중립', '코스피 < 200일선, 상승종목 > 40%', '선별적 → 보수적 보정'],
    ['약세', '코스피 < 200일선, 상승종목 < 40%', '성공률 낮음 → 큰 폭 하향'],
  ], { y: 1.8 });
  s.addText('같은 VCP라도 강세 확산장에서의 성공률과 약세장에서의 성공률은 완전히 다르다.\n시장 상황을 무시한 확률은 의미가 없다.', { x: 0.6, y: 5.0, w: 12.13, h: 1.2, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
}

function slide30_section5() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('05', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('종목 간 비교를\n가능하게 만든다', { x: 6.0, y: 2.3, w: 6.73, h: 1.2, fontSize: 34, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.15 });
  s.addText('가격, 거래량, 맥락을 정규화하는 전처리 방법론', { x: 6.0, y: 3.7, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide31_price_problem() {
  const s = pptx.addSlide();
  addTitleBar(s, '삼성전자 7만원대와 소형주 1천원대의 VCP를 어떻게 비교하는가');
  addPageNumber(s, 31);
  addBullets(s, [
    '절대 가격으로는 비교가 불가능하다',
    '→ 해결: "피봇 가격 대비 비율"로 변환하면 모든 종목이 같은 눈금',
    '  예: 삼성전자 피봇 70,000원 → 현재 63,000원 = 피봇 대비 0.90',
    '  예: 소형주 피봇 1,000원 → 현재 900원 = 피봇 대비 0.90',
    '  → 둘 다 "피봇 대비 -10% 위치"로 동일하게 표현된다',
    '',
    '하나의 방법만 쓰면 정보가 빠진다',
    '→ 여러 방법을 동시에 쓰고, 모델이 어떤 방법이 유용한지 스스로 판단하게 한다',
  ], { fontSize: 15 });
}

function slide32_price_channels() {
  const s = pptx.addSlide();
  addTitleBar(s, '가격 정규화는 4가지 채널을 동시에 쓴다');
  addPageNumber(s, 32);
  const cards = [
    { title: '피봇 대비 비율', body: '피봇 가격을 1.0으로 놓고\n현재가의 상대 위치를 표현\n→ 피봇에서 얼마나 떨어져 있나' },
    { title: '로그 수익률', body: '매일의 변동률을 계산\n+10%와 -10%가 대칭적\n→ 일별 움직임의 패턴 포착' },
    { title: '통계적 위치 (Z점수)', body: '최근 60일 평균 대비\n얼마나 벗어났는지\n→ "평소 대비 비정상적 움직임" 감지' },
    { title: '범위 내 위치', body: '최근 고점-저점 사이에서\n현재 어디에 있는지 (0~1)\n→ 고점 근처인지 저점 근처인지' },
  ];
  const positions = [ { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 } ];
  cards.forEach((c, i) => addCard(s, { x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45, title: c.title, body: c.body, accentColor: CHART_COLORS[i] }));
}

function slide33_volume() {
  const s = pptx.addSlide();
  addTitleBar(s, '거래량 100만주와 1만주에서 "급증"의 의미가 다르다');
  addPageNumber(s, 33);
  addBullets(s, [
    '절대 거래량으로는 종목 간 비교 불가',
    '→ "평소 대비 몇 배"로 바꾸면 비교 가능 (상대 거래량, RVOL)',
    '',
    'VCP에서 거래량의 의미:',
    '  • 수축 중: RVOL < 0.5 (평소의 절반 이하) = "거래량 건조"',
    '  • 돌파 시: RVOL > 2.0 (평소의 2배 이상) = "거래량 폭발"',
    '',
    '거래량도 두 가지 척도를 동시에 쓴다:',
    '  1. 로그 RVOL: "평소 대비 배수" (극단값 압축)',
    '  2. 백분위 순위: "최근 60일 중 오늘이 상위 몇%?"',
  ], { fontSize: 15 });
}

function slide34_volume_channels() {
  const s = pptx.addSlide();
  addTitleBar(s, '거래량 정규화도 여러 채널을 함께 쓴다');
  addPageNumber(s, 34);
  addStyledTable(s, ['채널', '계산 방법', '알 수 있는 것'], [
    ['로그 RVOL', '오늘 거래량 ÷ 20일 평균 (로그 변환)', '평소 대비 몇 배인지 (극단값 안정화)'],
    ['백분위 순위', '최근 60일 중 오늘의 순위', '최근 흐름에서의 상대적 위치'],
    ['거래량 추세', '5일 평균 ÷ 20일 평균', '수축→확장 전환 감지'],
  ], { y: 1.8 });
  s.addText('거래량 수축(건조) → 거래량 확장(폭발)의 전환이 VCP 돌파의 핵심 시그널이다.\n이 전환을 놓치지 않으려면 "추세" 채널이 필수적이다.', { x: 0.6, y: 4.5, w: 12.13, h: 1.2, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
}

function slide35_context() {
  const s = pptx.addSlide();
  addTitleBar(s, '같은 VCP라도 맥락이 다르면 결과도 다르다');
  addPageNumber(s, 35);
  addBullets(s, [
    '"직전 3개월 200% 상승 후 VCP"와 "30% 상승 후 VCP"는 전혀 다르다',
    '"첫 번째 베이스의 VCP"와 "세 번째 베이스의 VCP"는 성공률이 다르다',
    '"강세장에서의 VCP"와 "약세장에서의 VCP"도 다르다',
    '',
    '→ 패턴의 형태만 보면 안 된다. 맥락(context)을 반드시 함께 봐야 한다',
    '→ Minervini와 쿨라메기도 "맥락이 패턴 형태보다 중요할 수 있다"고 강조',
  ], { fontSize: 16 });
}

function slide36_context_table() {
  const s = pptx.addSlide();
  addTitleBar(s, '맥락을 숫자로 바꾸는 6가지 지표');
  addPageNumber(s, 36);
  addStyledTable(s, ['지표', '의미', '왜 중요한가'], [
    ['사전 상승폭', '베이스 전까지 얼마나 올랐나', '너무 많이 오른 종목은 돌파해도 탄력 약함'],
    ['베이스 카운트', '몇 번째 베이스인가 (1st, 2nd, 3rd)', '1st 베이스가 가장 강력, 3rd+ 약화'],
    ['추세 지속 기간', '200일선 위 연속일 수', '추세가 너무 오래되면 성숙/노화'],
    ['52주 고점 근접도', '고점 대비 현재가 위치', '고점에 가까울수록 돌파 가능성 높음'],
    ['상대강도 (RS)', '다른 종목 대비 강도 순위', 'RS 상위 20%가 리더주'],
    ['시장 추세', '코스피 50일선 vs 200일선', '시장이 상승 중인지 하락 중인지'],
  ], { y: 1.8 });
}

function slide37_window() {
  const s = pptx.addSlide();
  addTitleBar(s, '패턴 길이가 다를 때: 멀티스케일로 동시에 본다');
  addPageNumber(s, 37);
  addBullets(s, [
    'VCP는 30~180일, HTF는 14~28일 — 길이가 완전히 다르다',
    '해결: 같은 패턴을 3가지 다른 배율로 동시에 변환',
    '  • 30일 스케일: 세부 구조 (마지막 수축의 형태)',
    '  • 60일 스케일: 중간 구조 (전체 패턴의 윤곽)',
    '  • 120일 스케일: 전체 구조 (패턴 + 사전 상승)',
    '',
    '추가로, 패턴을 의미 단위로 잘라서 요약하는 "세그먼트 분할"도 사용',
    '  → "수축1: 깊이-15%, 기간 8일" / "수축2: 깊이-8%, 기간 5일" ...',
  ], { fontSize: 15 });
}

function slide38_normalization_principle() {
  const s = pptx.addSlide();
  addTitleBar(s, '핵심 원칙: 하나만 고르지 말고, 여러 방법을 채널로 묶어라');
  addPageNumber(s, 38);
  s.addShape('roundRect', { x: 0.6, y: 1.8, w: 12.13, h: 2.0, rectRadius: 0.1, fill: { color: 'EBF0FF' } });
  s.addText('"최적의 정규화 방법을 하나 고르는 것"이 아니라\n"여러 정규화를 채널로 묶어서 모델이 스스로 선택하게 하는 것"이 핵심이다', { x: 0.8, y: 1.9, w: 11.73, h: 1.8, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue, align: 'center', valign: 'middle', lineSpacingMultiple: 1.4 });
  addBullets(s, [
    '각 정규화 방법은 서로 다른 정보를 보존한다',
    '피봇 비율 → 피봇 대비 위치 / 로그 수익률 → 일별 패턴 / Z점수 → 이상치 감지',
    '모델이 어떤 정보가 가장 유용한지 스스로 학습하게 한다',
    '이것은 TV 채널처럼 — 채널마다 다른 각도로 같은 사건을 보여준다',
  ], { y: 4.0, fontSize: 15 });
}

function slide39_section6() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('06', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('차트북과\n유사 패턴 검색', { x: 6.0, y: 2.3, w: 6.73, h: 1.2, fontSize: 34, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.15 });
  s.addText('나만의 사례집을 자동으로 만들고, 비슷한 과거를 즉시 찾는다', { x: 6.0, y: 3.7, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide40_chartbook_concept() {
  const s = pptx.addSlide();
  addTitleBar(s, '차트북은 성공/실패 사례를 모아놓은 나만의 교과서다');
  addPageNumber(s, 40);
  addBullets(s, [
    '시스템이 탐지한 모든 패턴을 자동으로 기록한다',
    '각 사례에 돌파 후 실제 결과(성공/실패)를 자동 태깅한다',
    '차트 이미지 + 수치 요약 + 시장 상황 + 결과를 한 페이지로 정리',
    '',
    '목적: 패턴 인식 능력을 체계적으로 기른다',
    '  • "교과서적 VCP가 실패한 사례"를 보면서 실패 조건을 학습',
    '  • "형태는 별로인데 성공한 사례"를 보면서 핵심 변수를 파악',
    '  • 수백 개의 사례를 축적하면 "감"이 아닌 "경험 데이터"가 된다',
  ], { fontSize: 15 });
}

function slide41_chartbook_content() {
  const s = pptx.addSlide();
  addTitleBar(s, '차트북 한 페이지에 담기는 정보');
  addPageNumber(s, 41);
  addStyledTable(s, ['카테고리', '항목', '왜 필요한가'], [
    ['차트 이미지', '캔들차트 (돌파 전 60일 + 후 20일)', '한눈에 패턴 형태를 파악'],
    ['수치 요약', '수축 횟수/깊이, RS 순위, 품질 점수', '패턴을 숫자로 비교'],
    ['거래량', '돌파일 거래량 / 50일 평균 비율', '돌파의 "진짜"인지 판별'],
    ['시장 상황', '코스피 추세, 업종 강도', '돌파 환경 기록'],
    ['결과', '10일/20일 후 수익률, 최대 이익/손실', '성공/실패 판정'],
    ['패턴 유형', 'VCP / CWH / HTF / W / ...', '유형별 통계 집계용'],
  ], { y: 1.8 });
}

function slide42_curation() {
  const s = pptx.addSlide();
  addTitleBar(s, '전형적 성공보다 "교과서적인데 실패한 사례"가 더 교훈적이다');
  addPageNumber(s, 42);
  addStyledTable(s, ['분류', '기준', '가치'], [
    ['전형적 성공', '품질 점수 상위 25% + 성공(+30%)', '이상적인 패턴이 어떤 모습인지 학습'],
    ['전형적 실패', '품질 점수 상위 25% + 실패', '왜 교과서적 패턴도 실패하는지 학습\n→ 가장 교훈적인 사례'],
    ['경계선', '품질 점수 중간 50%', '판단이 어려운 상황에서의 참고'],
  ], { y: 1.8 });
  s.addText('실패 사례를 의도적으로 포함해야 한다.\n"VCP처럼 보였지만 실패한 사례"가 없으면 확인 편향에 빠진다.', { x: 0.6, y: 4.8, w: 12.13, h: 1.2, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red, lineSpacingMultiple: 1.5 });
}

function slide43_similarity_methods() {
  const s = pptx.addSlide();
  addTitleBar(s, '비슷한 차트를 찾는 3가지 방법');
  addPageNumber(s, 43);
  addStyledTable(s, ['방법', '원리', '장점', '단점', '적합 시기'], [
    ['규칙 기반 피처', '수축 깊이, 거래량 등\n~20개 특성으로 비교', '빠름, 해석 가능\n도메인 지식 반영', '미묘한 형태 차이\n놓칠 수 있음', '초기 (Phase 1)'],
    ['DTW', '시간축을 늘리고 줄여서\n형태를 직접 비교', '길이 다른 패턴 비교 가능\n형태에 충실', '느림 (대규모 비효율)', '정밀 비교 시'],
    ['임베딩', '패턴을 벡터로 압축\n벡터 간 거리로 비교', '범용적, 확장성 좋음\n대규모에 적합', '학습 필요\n해석 어려움', '고도화 (Phase 2)'],
  ], { y: 1.8 });
  addHighlightBox(s, '💡 초기에는 규칙 기반 피처 벡터로 시작하고, 데이터가 쌓이면 임베딩으로 업그레이드한다');
}

function slide44_similarity_evidence() {
  const s = pptx.addSlide();
  addTitleBar(s, '비슷한 패턴이 비슷한 결과를 낳는가? — 반은 맞고 반은 아니다');
  addPageNumber(s, 44);
  // 긍정
  s.addShape('roundRect', { x: 0.6, y: 1.8, w: 5.865, h: 4.5, rectRadius: 0.1, fill: { color: 'F0FFF4' } });
  s.addText('긍정적 증거', { x: 0.8, y: 1.9, w: 5.465, h: 0.4, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: '27AE60' });
  s.addText([
    { text: '• 특정 패턴(H&S)이 5~7% 초과수익 예측 (Savin 2007)', options: { bullet: false } },
    { text: '• DTW 기반 매칭으로 방향 예측 79% (Yao 2017)', options: { bullet: false } },
    { text: '• 패턴 클러스터링으로 벤치마크 대비 60%+ 초과 (Nakagawa 2019)', options: { bullet: false } },
    { text: '• 단, 이 연구들은 미국/중국/일본 시장 기반', options: { bullet: false, color: COLORS.accent_yellow } },
  ], { x: 0.8, y: 2.4, w: 5.465, h: 3.5, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6 });
  // 부정
  s.addShape('roundRect', { x: 6.865, y: 1.8, w: 5.865, h: 4.5, rectRadius: 0.1, fill: { color: 'FFF5F5' } });
  s.addText('부정적 증거', { x: 7.065, y: 1.9, w: 5.465, h: 0.4, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red });
  s.addText([
    { text: '• 범용 클러스터링 = 수익 차이 없음 (JP Morgan)', options: { bullet: false } },
    { text: '• 패턴은 랜덤 발생 가능 (Nature 2025)', options: { bullet: false } },
    { text: '• 거래비용 반영 시 엣지 소멸 가능 (Lo 2000)', options: { bullet: false } },
    { text: '→ 핵심: "어떤 피처로 유사도를 측정하는가"가 예측력을 결정', options: { bullet: false, bold: true, color: COLORS.accent_blue } },
  ], { x: 7.065, y: 2.4, w: 5.465, h: 3.5, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6 });
}

function slide45_medical_analogy() {
  const s = pptx.addSlide();
  addTitleBar(s, '의료 영상 AI에서 배운다: 확률 + 유사 사례 = 전문가 판단 보조');
  addPageNumber(s, 45);
  addStyledTable(s, ['의료 영상 AI', '우리 시스템'], [
    ['CT 스캔 입력', '차트 데이터 입력'],
    ['병변 패턴 인식', '돌파 패턴 탐지 (VCP/CWH)'],
    ['"악성 확률 73%"', '"시원한 돌파 확률 24%"'],
    ['유사 과거 사례 이미지 검색', '유사 과거 차트 검색'],
    ['의사가 최종 진단', '트레이더가 최종 매매 판단'],
  ], { y: 1.8 });
  s.addText('구조가 동일하다. 핵심은 "AI가 판단을 대체하는 것이 아니라, 전문가가 놓치는 것을 보여주는 것"이다.', { x: 0.6, y: 5.2, w: 12.13, h: 1.0, fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, lineSpacingMultiple: 1.4 });
}

function slide46_section7() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('07', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('무엇을 먼저\n만들 것인가', { x: 6.0, y: 2.3, w: 6.73, h: 1.2, fontSize: 34, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.15 });
  s.addText('Phase 0 → 1a → 1b → 2 단계별 로드맵', { x: 6.0, y: 3.7, w: 6.73, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide47_roadmap() {
  const s = pptx.addSlide();
  addTitleBar(s, '전체 로드맵: 약 4.5~6.5개월 (이전 9~13개월에서 단축)');
  addPageNumber(s, 47);
  const items = [
    { step: 'Phase 0', title: '전제 검증 + 패턴 정량화 (4-6주)', description: '+30% 사례 수 확인, 규칙 탐지기 구현, 차트북 v0' },
    { step: 'Phase 1a', title: 'VCP 단독으로 MVP 구축 (3-4주)', description: 'VCP 확률 추정 + 유사 검색 + 의사결정 카드' },
    { step: 'Phase 1b', title: '나머지 5개 패턴 추가 (4-5주)', description: 'CWH/HTF/W/Low Cheat/EP 탐지 + 전체 차트북' },
    { step: 'Phase 2', title: '고도화 (8-12주, 선택)', description: '임베딩 검색 + 시장 보정 + 멀티스케일 유사도' },
  ];
  s.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  items.forEach((item, i) => {
    const itemY = 1.8 + i * 1.25;
    s.addShape('ellipse', { x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23, fill: { color: CHART_COLORS[i] } });
    s.addText(item.step, { x: 1.0, y: itemY, w: 2.0, h: 0.3, fontSize: 13, fontFace: 'Pretendard', bold: true, color: CHART_COLORS[i] });
    s.addText(item.title, { x: 1.0, y: itemY + 0.3, w: 11.73, h: 0.35, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    s.addText(item.description, { x: 1.0, y: itemY + 0.65, w: 11.73, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary });
    if (i < items.length - 1) s.addShape('line', { x: 1.0, y: itemY + 1.15, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  });
}

function slide48_phase0() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Phase 0: 먼저 확인한다 — 이 프로젝트가 의미 있는가');
  addPageNumber(s, 48);
  addBullets(s, [
    '코드를 쓰기 전에 데이터로 확인해야 할 것들:',
    '',
    '1. +30%/10일 달성 사례가 얼마나 있는가?',
    '   → 500건 미만이면 기준을 +20%/10일 또는 +30%/20일로 완화',
    '2. 규칙 기반 패턴 탐지가 실제로 맞는가?',
    '   → 50건을 직접 눈으로 확인해서 60% 이상 동의하는지 체크',
    '3. 패턴 이벤트가 충분한가?',
    '   → 최소 5,000건 이상이어야 통계적으로 의미 있음',
    '',
    '이 Phase가 전체 프로젝트의 성패를 결정한다',
  ], { fontSize: 15 });
}

function slide49_gonogo() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Phase 0의 Go/No-Go 기준 3가지');
  addPageNumber(s, 49);
  const kpis = [
    { label: '패턴 이벤트 수', value: '≥ 5,000건', color: COLORS.accent_blue },
    { label: '+30% 양성 사례', value: '≥ 500건', color: COLORS.accent_cyan },
    { label: '수동 검토 일치율', value: '≥ 60%', color: COLORS.accent_yellow },
  ];
  kpis.forEach((k, i) => {
    const x = 0.6 + i * 4.1;
    s.addShape('roundRect', { x, y: 1.9, w: 3.8, h: 2.8, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
    s.addText(k.value, { x, y: 2.1, w: 3.8, h: 1.0, fontSize: 40, fontFace: FONTS.kpi.fontFace, bold: true, color: k.color, align: 'center' });
    s.addText(k.label, { x, y: 3.2, w: 3.8, h: 0.5, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
  });
  s.addText('3가지 조건을 모두 만족하면 Phase 1으로 진행한다.\n하나라도 미달이면 기준을 조정하거나 접근 방식을 전환한다.', { x: 0.6, y: 5.2, w: 12.13, h: 1.2, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, align: 'center' });
}

function slide50_phase1a() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Phase 1a: VCP 하나만으로 시작한다');
  addPageNumber(s, 50);
  addBullets(s, [
    '6개 패턴을 한번에 만들지 않는다. VCP 하나만 먼저 끝낸다.',
    '',
    '산출물:',
    '  • VCP 규칙 탐지기 (코드)',
    '  • VCP 성공 확률 예측기 (LightGBM)',
    '  • VCP 유사 사례 검색 (피처 벡터 + 코사인 유사도)',
    '  • VCP 차트북 (성공/실패 사례집)',
    '  • 의사결정 카드 생성기',
    '',
    'VCP 하나로 전체 파이프라인이 작동하는 것을 확인한 후',
    '→ 나머지 5개 패턴을 Phase 1b에서 추가한다',
  ], { fontSize: 15 });
}

function slide51_phase1b_2() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Phase 1b → Phase 2: 확장과 고도화');
  addPageNumber(s, 51);
  addStyledTable(s, ['Phase', '기간', '추가되는 것', '사용 기술'], [
    ['1b', '4-5주', 'CWH, HTF, W, Low Cheat, EP 탐지\n전체 차트북 + 패턴별 통계', '규칙 엔진 확장\nmplfinance'],
    ['2', '8-12주', '임베딩 기반 유사 검색 업그레이드\n시장 regime 보정 모듈\n멀티스케일 유사도', 'TS2Vec (자기지도학습)\nFAISS (벡터 검색)\nCPCV (과적합 검증)'],
  ], { y: 1.8 });
  s.addText('Phase 2는 Phase 1이 실용적 가치를 보여준 후에만 진행한다.\nVCP 단독으로도 충분한 가치가 있으면 Phase 2는 보류할 수 있다.', { x: 0.6, y: 4.5, w: 12.13, h: 1.2, fontSize: 15, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
}

function slide52_section8() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addText('08', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  s.addText('주의사항과 리스크', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: FONTS.title.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('알아야 할 한계와 방향 전환 기준', { x: 6.0, y: 3.5, w: 6.73, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide53_risks() {
  const s = pptx.addSlide();
  addTitleBar(s, '이 시스템의 4가지 핵심 리스크');
  addPageNumber(s, 53);
  const cards = [
    { title: '+30% 사례 부족', body: '양성 사례가 300건 미만이면\n의미있는 학습이 불가능\n→ 기준 완화 또는 기간 확장' },
    { title: '미국 파라미터 부적합', body: '한국 시장 구조가 달라\n패턴을 너무 많이/적게 잡을 수 있음\n→ Phase 0에서 교정' },
    { title: '유사도의 예측력 한계', body: '비슷하게 생겼다고\n결과도 비슷하다는 보장 없음\n→ Phase 2에서 통계 검증' },
    { title: '시장 환경 변화', body: '2020~2025 공매도 금지 기간\n데이터가 향후와 다를 수 있음\n→ Regime 보정으로 대응' },
  ];
  const positions = [ { x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 } ];
  cards.forEach((c, i) => addCard(s, { x: positions[i].x, y: positions[i].y, w: 5.915, h: 2.45, title: c.title, body: c.body, accentColor: COLORS.accent_red }));
}

function slide54_pivot_guide() {
  const s = pptx.addSlide();
  addTitleBar(s, '이런 결과가 나오면 방향을 전환한다');
  addPageNumber(s, 54);
  addStyledTable(s, ['관찰 결과', '전환 방향'], [
    ['+30%/10일 양성 사례 300건 미만', '기준을 +20%/10일 또는 +30%/20일로 완화'],
    ['+30%/10일 양성 사례 100건 미만', '패턴 정의 자체를 재검토, 기간 확장 고려'],
    ['규칙 탐지와 내 판단 일치율 50% 미만', '파라미터를 한국 데이터 분포에서 재설정'],
    ['유사 사례의 성과가 전체 평균과 동일', '피처 유사도 폐기, 임베딩 실험 착수'],
    ['특정 시장 상황에서만 성과가 나옴', '시장 상황별 모델을 분리해서 운영'],
    ['VCP 단독 Phase 1a에서 가치 없음', '패턴 기반 접근 자체를 factor 기반으로 전환'],
  ], { y: 1.8 });
}

function slide55_closing() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Phase 0에서 데이터로 확인하는 것이 첫걸음이다');
  addPageNumber(s, 55);
  const points = [
    '규칙 기반 패턴 탐지 + 확률 추정 + 유사 사례 검색이 현실적 MVP 조합이다',
    '전처리는 하나만 고르지 말고, 여러 방법을 채널로 묶어 모델에게 맡긴다',
    '+30%/10일 사례 수와 미국 파라미터의 한국 적합성을 Phase 0에서 먼저 확인한다',
  ];
  points.forEach((point, i) => {
    const y = 2.0 + i * 0.85;
    s.addShape('ellipse', { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fill: { color: COLORS.accent_blue } });
    s.addText(`${i + 1}`, { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    s.addText(point, { x: 1.5, y: y, w: 11.23, h: 0.55, fontSize: 16, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, valign: 'middle' });
  });
  s.addShape('line', { x: 0.6, y: 4.8, w: 12.13, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  s.addText('이 시스템은 트레이더를 대체하는 것이 아니라,\n트레이더가 놓치는 것을 보여주는 도구이다.', { x: 0.6, y: 5.1, w: 12.13, h: 1.0, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_blue, align: 'center', lineSpacingMultiple: 1.4 });
}

// ===== 실행 =====
slide01_title();
slide02_purpose();
slide03_decision_card();
slide04_section1();
slide05_problem();
slide06_human_vs_system();
slide07_core_need();
slide08_quote();
slide09_section2();
slide10_stage2();
slide11_trend_template();
slide12_6patterns_overview();
slide13_vcp_explain();
slide14_vcp_params();
slide15_cwh();
slide16_cwh_params();
slide17_htf();
slide18_remaining();
slide19_overlap();
slide20_us_warning();
slide21_section3();
slide22_success_def();
slide23_tiered();
slide24_section4();
slide25_4layers();
slide26_layer1();
slide27_layer2();
slide28_layer3();
slide29_layer4();
slide30_section5();
slide31_price_problem();
slide32_price_channels();
slide33_volume();
slide34_volume_channels();
slide35_context();
slide36_context_table();
slide37_window();
slide38_normalization_principle();
slide39_section6();
slide40_chartbook_concept();
slide41_chartbook_content();
slide42_curation();
slide43_similarity_methods();
slide44_similarity_evidence();
slide45_medical_analogy();
slide46_section7();
slide47_roadmap();
slide48_phase0();
slide49_gonogo();
slide50_phase1a();
slide51_phase1b_2();
slide52_section8();
slide53_risks();
slide54_pivot_guide();
slide55_closing();

pptx.writeFile({ fileName: 'stock-pattern-decision-tool.pptx' })
  .then(() => console.log('✅ 저장 완료: stock-pattern-decision-tool.pptx (55 slides)'))
  .catch(err => console.error('❌ 저장 실패:', err));
