const PptxGenJS = require('pptxgenjs');
const path = require('path');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== 상수 =====
const COLORS = {
  bg_primary: 'FFFFFF', bg_secondary: 'F5F7FA', bg_dark: '1A1F36',
  text_primary: '1A1F36', text_secondary: '4A5568', text_tertiary: '718096', text_on_dark: 'FFFFFF',
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
  cellAlt: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, fill: { color: COLORS.bg_secondary }, valign: 'middle' },
};
const TABLE_OPTIONS = { x: 0.6, y: 1.8, w: 12.13, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' }, autoPage: false, margin: [5, 8, 5, 8] };
const CC = ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8'];
const TOTAL = 60;
const COL_W = 5.865, COL_LEFT_X = 0.6, COL_RIGHT_X = 7.265;

// ===== 헬퍼 =====
function addTitleBar(slide, title, subtitle) {
  slide.addShape('rect', { x: 0.6, y: 0.5, w: 1.2, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText(title, { x: 0.6, y: 0.65, w: 12.13, h: 0.9, fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, charSpacing: -0.3, autoFit: true });
  if (subtitle) slide.addText(subtitle, { x: 0.6, y: 1.55, w: 12.13, h: 0.3, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary });
}
function addStyledTable(slide, headers, dataRows, opts = {}) {
  const rows = [];
  rows.push(headers.map(h => ({ text: h, options: { ...TABLE_STYLE.header } })));
  dataRows.forEach((row, i) => {
    const base = i % 2 === 1 ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    rows.push(row.map(cell => typeof cell === 'string' ? { text: cell, options: { ...base } } : { text: cell.text, options: { ...base, ...cell.options } }));
  });
  slide.addTable(rows, { ...TABLE_OPTIONS, ...opts });
}
function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: 0.1, fill: { color: 'FFFFFF' }, shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 } });
  slide.addShape('rect', { x: x + 0.02, y, w: w - 0.04, h: 0.06, fill: { color: accentColor || COLORS.accent_blue } });
  slide.addText(title, { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.35, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, autoFit: true });
  slide.addText(body, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75, fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4, valign: 'top', autoFit: true });
}
function pgn(slide, n) { slide.addText(`${n} / ${TOTAL}`, { x: 12.0, y: 7.05, w: 1.0, h: 0.3, fontSize: 9, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'right' }); }
function bullets(slide, items, opts = {}) {
  slide.addText(items.map(t => ({ text: t, options: { bullet: true, indentLevel: 0 } })), { x: 0.6, y: opts.y || 1.8, w: 12.13, h: opts.h || 4.8, fontSize: opts.fs || 17, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top' });
}
function sectionSlide(slide, num, title, desc, n) {
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText(num, { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText(title, { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText(desc, { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  pgn(slide, n);
}
function stepSlide(slide, steps, startY) {
  steps.forEach((s, i) => {
    const y = (startY || 1.8) + i * (s.itemH || 0.85);
    slide.addShape('ellipse', { x: 0.7, y: y + 0.05, w: 0.38, h: 0.38, fill: { color: s.color || CC[i % 6] } });
    slide.addText(s.n, { x: 0.7, y: y + 0.05, w: 0.38, h: 0.38, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    slide.addText(s.t, { x: 1.3, y, w: 2.5, h: 0.45, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, valign: 'middle' });
    slide.addText(s.d, { x: 3.9, y, w: 8.83, h: 0.45, fontSize: 12, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, valign: 'middle', autoFit: true });
  });
}

// ===== PART 1: 문제 (1~8) =====
function s01() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  s.addShape('rect', { x: 1.5, y: 2.2, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  s.addText('팔란티어 온톨로지 역설계', { x: 1.5, y: 2.4, w: 10.33, h: 1.2, fontSize: 44, fontFace: 'Pretendard', bold: true, color: COLORS.text_on_dark, align: 'center', charSpacing: -0.5 });
  s.addText('데이터를 의사결정으로 바꾸는 기술의 해부', { x: 1.5, y: 3.7, w: 10.33, h: 0.6, fontSize: 20, fontFace: 'Pretendard', color: 'FFFFFF', transparency: 30, align: 'center' });
  s.addText('Airbus 항공기 500만 개 부품 — 은행 자금세탁 탐지 — 그리고 당신의 도메인', { x: 1.5, y: 4.5, w: 10.33, h: 0.5, fontSize: 15, fontFace: 'Pretendard', color: 'FFFFFF', transparency: 50, align: 'center' });
  s.addText('Deep Research  |  2026-03-24', { x: 1.5, y: 6.0, w: 10.33, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: 'FFFFFF', transparency: 50, align: 'center' });
}
function s02() {
  const s = pptx.addSlide();
  addTitleBar(s, '이 프레젠테이션이 끝나면 알게 되는 3가지');
  const items = [
    { n: '1', t: '온톨로지의 실체', d: '팔란티어가 말하는 "온톨로지"가 정확히 무엇인지, 기존 데이터베이스와 뭐가 다른지 이해한다' },
    { n: '2', t: '역설계 수준의 이해', d: 'Airbus 항공 정비와 은행 자금세탁 탐지를 따라가며, 온톨로지가 실제로 어떻게 설계·구축·운영되는지 안다' },
    { n: '3', t: '직접 설계하는 능력', d: '어떤 도메인이든 같은 원리를 적용하여 온톨로지를 설계할 수 있는 6단계 프로세스를 가져간다' },
  ];
  items.forEach((item, i) => {
    const y = 2.0 + i * 1.6;
    s.addShape('ellipse', { x: 0.8, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: CC[i] } });
    s.addText(item.n, { x: 0.8, y: y + 0.08, w: 0.55, h: 0.55, fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    s.addText(item.t, { x: 1.6, y, w: 11.13, h: 0.5, fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    s.addText(item.d, { x: 1.6, y: y + 0.55, w: 11.13, h: 0.7, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.3 });
  });
  pgn(s, 2);
}
function s03() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Airbus에는 500만 개 부품이 있다');
  bullets(s, [
    'A350 한 대 = 약 500만 개 부품, 4개국 8개 이상 공장에서 제조',
    '프랑스 툴루즈(최종 조립), 독일 함부르크(동체), 영국(날개), 스페인(꼬리)',
    '2015년 목표: A350 생산량 4배 증가',
    '문제: "MSN523 기체에 남은 작업이 몇 건인가?"에 아무도 답할 수 없었다',
    '"no single person could answer — What work remains on a given aircraft?"  — 팔란티어 공식 문서',
  ]);
  pgn(s, 3);
}
function s04() {
  const s = pptx.addSlide();
  addTitleBar(s, '답을 얻으려면 3개 시스템을 수동으로 대조해야 했다');
  stepSlide(s, [
    { n: '1', t: 'SAP ERP 열기', d: '재무 관점의 작업 지시서 목록 조회 — 그런데 실제 진행률은 모른다' },
    { n: '2', t: 'MES 열기', d: '제조 공정 상태 확인 — 그런데 전체 납기 일정과 연동 안 됨' },
    { n: '3', t: '엑셀 열기', d: '부품 조달팀의 납품 지연 현황 수동 확인' },
    { n: '4', t: '수동 대조', d: '세 시스템의 데이터를 사람이 머릿속에서 연결하여 "진짜 잔여 작업" 추산' },
  ]);
  s.addText('결과: 답을 얻는 데 수 시간~수일, 그 사이에 상황은 이미 변해 있다', { x: 0.6, y: 5.5, w: 12.13, h: 0.5, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.accent_red });
  pgn(s, 4);
}
function s05() {
  const s = pptx.addSlide();
  addTitleBar(s, '왜 기존 시스템으로는 안 됐는가');
  bullets(s, [
    '각 시스템은 자기 역할에서는 잘 작동했다 — 문제는 시스템 간 "의미 연결"의 부재',
    'ERP의 "A350-900"과 MES의 "MSN523"이 같은 항공기인지 컴퓨터는 모른다',
    '사람이 두 시스템 사이에서 "번역기" 역할을 해야 했다',
    '핵심 원인: 데이터는 넘치지만, 데이터 간의 관계와 맥락이 없다',
    '팔란티어의 해결책: 새 시스템을 만드는 게 아니라, 기존 시스템 위에 "공통 언어"를 얹는 것',
  ]);
  pgn(s, 5);
}
function s06() {
  const s = pptx.addSlide();
  addTitleBar(s, '팔란티어의 해결: 새 시스템이 아니라 공통 언어를 얹었다');
  const layers = [
    { step: '기존 시스템 (그대로 유지)', desc: 'SAP ERP + MES + 엑셀 + IoT 센서 — 바꾸지 않는다', color: COLORS.text_tertiary },
    { step: '파이프라인 (데이터 정리)', desc: '각 시스템의 데이터를 수집하고 정리하여 공통 형식으로 변환', color: COLORS.accent_purple },
    { step: '온톨로지 (공통 언어)', desc: '"항공기", "센서", "작업지시서"라는 공통 개념으로 모든 데이터를 연결', color: COLORS.accent_blue },
    { step: '앱 (사용자 접점)', desc: '대시보드, AI 비서, 외부 앱 — 온톨로지를 통해 모든 데이터에 접근', color: COLORS.accent_cyan },
  ];
  layers.forEach((l, i) => {
    const y = 1.9 + i * 1.25;
    s.addShape('roundRect', { x: 0.6, y, w: 12.13, h: 1.0, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    s.addShape('rect', { x: 0.6, y, w: 0.08, h: 1.0, fill: { color: l.color } });
    s.addText(l.step, { x: 1.0, y, w: 3.5, h: 1.0, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: l.color, valign: 'middle' });
    s.addText(l.desc, { x: 4.5, y, w: 8.23, h: 1.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, valign: 'middle' });
    if (i < 3) s.addText('▲', { x: 6.0, y: y - 0.25, w: 1.33, h: 0.3, fontSize: 14, color: COLORS.text_tertiary, align: 'center' });
  });
  s.addText('비유: 유엔에서 각국 대표가 자국어로 말하지만, 동시통역이 모든 걸 공통 언어로 연결해주는 것', { x: 0.6, y: 6.4, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  pgn(s, 6);
}
function s07() {
  const s = pptx.addSlide();
  addTitleBar(s, '은행에도 같은 문제가 있다', '금융 AML (자금세탁방지)');
  bullets(s, [
    '김민준은 A은행에서 "Minjoon Kim", B은행에서 "M. Kim (Jay)" — 같은 사람인지 모른다',
    'A은행: $9,800 해외 송금 → "CTR 근접" 규칙에 걸려 Alert 생성',
    'B은행: 현금 입금 8회 합계 $9,200 → "소액 분산" 규칙에 걸려 Alert 생성',
    '두 시스템이 서로 통신하지 않아서, 각각은 오탐이지만 함께 보면 패턴이 보일 수도 있다',
    '전 세계 은행 AML 경보의 90~95%가 오탐(false positive) — 구조적 문제',
  ]);
  s.addText('출처: Flagright, Unit21 업계 조사 2024; Palantir Foundry for AML 2021', { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary });
  pgn(s, 7);
}
function s08() {
  const s = pptx.addSlide();
  addTitleBar(s, '공통점: 데이터는 넘치는데 연결이 없다');
  // 좌측
  s.addText('Airbus', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.4, fontSize: 20, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
  s.addText('ERP + MES + 엑셀\n각각은 잘 작동하지만\n"MSN523 = A350-900"을\n컴퓨터가 모른다\n\n→ 사람이 번역해야 한다', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  // 우측
  s.addText('은행 AML', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.4, fontSize: 20, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('A은행 + B은행 + 규제기관\n각각은 잘 작동하지만\n"Minjoon Kim = M. Kim"\n을 컴퓨터가 모른다\n\n→ 오탐 95%가 발생한다', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  s.addShape('line', { x: 0.6, y: 5.5, w: 12.13, h: 0, line: { color: 'E2E8F0', width: 1 } });
  s.addText('온톨로지가 해결하는 핵심 문제: 분산된 데이터에 "의미"와 "관계"를 부여하여 연결한다', { x: 0.6, y: 5.7, w: 12.13, h: 0.6, fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
  pgn(s, 8);
}

// ===== PART 2: Airbus 역설계 (9~28) =====
function s09() { const s = pptx.addSlide(); sectionSlide(s, '01', '온톨로지 역설계', 'Airbus Skywise 편 — 항공기 정비의 모든 것을 따라간다', 9); }

function s10() {
  const s = pptx.addSlide();
  addTitleBar(s, '첫 번째 질문: 모든 것의 중심은 무엇인가?', '허브 패턴');
  s.addText('비유: 태양계에서 행성들이 태양 주위를 도는 것처럼, 온톨로지에서도 모든 데이터가 하나의 중심을 둔다.', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 15, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  s.addText('식별 질문: "우리 조직이 매일 아침 가장 먼저 확인하는 것은 무엇인가?"', { x: 0.6, y: 2.5, w: 12.13, h: 0.5, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  addStyledTable(s, ['도메인', '중심 Object', '이유'],
    [
      ['Airbus (생산/정비)', 'Aircraft (항공기)', '센서, 정비, 부품, 비행이력이 모두 항공기에 연결된다'],
      ['병원', 'Patient (환자)', '처방, 검사, 입원, 보험이 모두 환자에 연결된다'],
      ['은행 AML', 'Transaction (거래)', '계좌, 고객, 위험도가 모두 거래를 통해 연결된다'],
      ['물류', 'Shipment (배송건)', '위치 추적, 기사, 창고가 모두 배송건에 연결된다'],
    ], { y: 3.2, rowH: [0.45, 0.55, 0.55, 0.55, 0.55] });
  pgn(s, 10);
}
function s11() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Aircraft Object — 엑셀 시트의 "틀"과 같다', 'Object Type이란 무엇인가');
  s.addText('Object Type은 데이터를 담는 그릇의 설계도다. 엑셀에서 시트를 만들기 전에\n"이 시트에는 어떤 컬럼이 있을 것인가"를 정하는 것과 같다.\n실제 항공기 한 대(MSN523)는 그 설계도를 채운 "행"이다.', { x: 0.6, y: 1.8, w: 12.13, h: 0.9, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue, lineSpacingMultiple: 1.4 });
  addStyledTable(s, ['속성 이름', '데이터 타입', '출처', '이것이 없으면?'],
    [
      ['msn (기체 일련번호)', '텍스트 [기본키]', 'Airbus 내부 DB', '항공기를 구별할 수 없다'],
      ['aircraftType (기종)', '텍스트', '등록 DB', 'A320과 A350의 경보 기준이 다른데 구분 불가'],
      ['operatorAirlineCode', '텍스트', '계약 DB', '보안 필터링 불가 (에어프랑스 데이터를 델타가 볼 수 있게 됨)'],
      ['totalFlightHours', '숫자', 'ACARS', '"5,000시간마다 엔진 교체" 같은 규칙 적용 불가'],
      ['totalLandingCycles', '정수', 'ACARS', '랜딩기어 수명 계산 불가'],
    ], { y: 2.9, rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5] });
  pgn(s, 11);
}
function s12() {
  const s = pptx.addSlide();
  addTitleBar(s, '항공기에는 시간순으로 쌓이는 것들이 있다', '이벤트 분리 패턴');
  // 좌측
  s.addText('잘못된 설계', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('Aircraft 시트에 "비행일1, 비행시간1, 비행일2, 비행시간2..." 컬럼 추가\n\n→ 1,000번째 비행부터 컬럼이 없다\n→ "지난달 비행만 필터" 불가능\n→ 비행별 부가 정보 저장 불가', { x: COL_LEFT_X, y: 2.2, w: COL_W, h: 3.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  // 우측
  s.addText('올바른 설계', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('Aircraft + Flight (별도 Object)\n(한 항공기 → 여러 비행: 1:N 관계)\n\n→ 각 비행이 독립 행\n→ 시간 필터, 경로 필터 자유자재\n→ 비행별 센서데이터, 승무원 등 연결 가능', { x: COL_RIGHT_X, y: 2.2, w: COL_W, h: 3.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  s.addText('분리 신호 3가지: ① "언제"가 중요 ② 같은 이벤트가 여러 번 발생 ③ 이벤트에 추가 속성이 붙음', { x: 0.6, y: 5.6, w: 12.13, h: 0.5, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  s.addText('비유: 환자 차트에 진료 기록을 날짜별로 따로 철하는 것. 환자 기본정보 시트에 진료내역을 우겨넣지 않는다.', { x: 0.6, y: 6.2, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  pgn(s, 12);
}
function s13() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Link: VLOOKUP보다 강력한 양방향 연결', '관계(Link)란 무엇인가');
  s.addText('엑셀의 VLOOKUP은 한 방향으로만 찾고, 관계에 이름이 없다.\nLink는 양방향 탐색이 가능하고, 관계 자체에 의미가 있다.\n"항공기 → 비행편" 과 "항공기 → 작업지시서"는 같은 출발점이지만 전혀 다른 의미.', { x: 0.6, y: 1.8, w: 12.13, h: 0.9, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue, lineSpacingMultiple: 1.4 });
  addStyledTable(s, ['Link 이름', '방향', '카디널리티', '설계 이유'],
    [
      ['hasFlight', 'Aircraft → Flight', '1:N', '한 항공기의 전체 비행 이력 추적'],
      ['hasWorkOrder', 'Aircraft → WorkOrder', '1:N', '"이 항공기에 열린 정비 작업" 조회'],
      ['hasComponent', 'Aircraft → Component', '1:N', '현재 장착된 부품 목록, 잔여 수명'],
      ['hasAlert', 'Aircraft → Alert', '1:N', '이 항공기의 경보 전체 이력'],
      ['operatedBy', 'Aircraft → Airline', 'N:1', '항공사별 집계, 보안 필터링 (핵심!)'],
    ], { y: 2.9, rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5] });
  pgn(s, 13);
}
function s14() {
  const s = pptx.addSlide();
  addTitleBar(s, '7개 Object가 이렇게 연결된다', 'Airbus 온톨로지 전체 구조');
  s.addText('비유: 도시의 지하철 노선도처럼, 각 Object가 역이고 Link가 노선이다.\n어느 역에서든 출발해 다른 역으로 갈 수 있다.', { x: 0.6, y: 1.8, w: 12.13, h: 0.5, fontSize: 13, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  // 관계 체인
  const chain = [
    { obj: 'Airline', sub: '(항공사)', color: COLORS.accent_purple, x: 0.6 },
    { obj: 'Aircraft', sub: '(항공기) ← 허브', color: COLORS.accent_blue, x: 2.6 },
    { obj: 'Flight', sub: '(비행편)', color: COLORS.accent_cyan, x: 4.8 },
    { obj: 'SensorReading', sub: '(센서 측정값)', color: CC[2], x: 7.2 },
    { obj: 'Alert', sub: '(정비 경보)', color: COLORS.accent_red, x: 9.6 },
    { obj: 'WorkOrder', sub: '(작업 지시)', color: CC[4], x: 11.4 },
  ];
  chain.forEach((c, i) => {
    const y = 2.8;
    s.addShape('roundRect', { x: c.x, y, w: 1.8, h: 1.1, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    s.addShape('rect', { x: c.x, y, w: 1.8, h: 0.06, fill: { color: c.color } });
    s.addText(c.obj, { x: c.x, y: y + 0.15, w: 1.8, h: 0.45, fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: c.color, align: 'center' });
    s.addText(c.sub, { x: c.x, y: y + 0.6, w: 1.8, h: 0.35, fontSize: 10, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary, align: 'center' });
    if (i < chain.length - 1 && i > 0) {
      s.addText('→', { x: c.x + 1.8, y: y + 0.25, w: 0.4, h: 0.5, fontSize: 18, color: COLORS.text_tertiary, align: 'center' });
    }
  });
  // Component는 별도 위치
  s.addShape('roundRect', { x: 2.6, y: 4.5, w: 1.8, h: 0.9, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
  s.addShape('rect', { x: 2.6, y: 4.5, w: 1.8, h: 0.06, fill: { color: CC[5] } });
  s.addText('Component\n(부품)', { x: 2.6, y: 4.6, w: 1.8, h: 0.7, fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true, color: CC[5], align: 'center' });
  s.addText('↕', { x: 3.2, y: 3.9, w: 0.5, h: 0.6, fontSize: 18, color: COLORS.text_tertiary, align: 'center' });
  s.addText('핵심 인과 체인: SensorReading이 임계값 초과 → Alert 자동 생성 → WorkOrder 트리거 → 정비 대시보드에 표시\n이 연쇄가 3개 시스템을 수동 대조하던 문제를 해결한다.', { x: 0.6, y: 5.8, w: 12.13, h: 0.8, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, lineSpacingMultiple: 1.3 });
  pgn(s, 14);
}
function s15() {
  const s = pptx.addSlide();
  addTitleBar(s, '각 속성에는 "왜 필요한지"가 있다', 'Flight + SensorReading 속성 설계');
  addStyledTable(s, ['Object', '속성', '타입', '이것이 없으면?'],
    [
      ['Flight', 'flightNumber (AF382)', '텍스트', '어느 비행에서 문제가 생겼는지 특정 불가'],
      ['Flight', 'departureAirport', '텍스트', '기후·고도별 맥락 분석 불가'],
      ['Flight', 'phase (이륙/순항/착륙)', '텍스트', '같은 진동도 이륙 중인지 순항 중인지에 따라 의미가 다르다'],
      ['SensorReading', 'sensorType (온도/압력/진동)', '텍스트', '어떤 종류의 이상인지 구분 불가'],
      ['SensorReading', 'value (142.3)', '숫자', '실제 측정값 — ML 모델의 입력 데이터'],
      ['SensorReading', 'isAnomaly (true/false)', '불리언', '파이프라인에서 이상치 여부를 미리 계산해둔 플래그'],
    ], { y: 1.8, rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] });
  pgn(s, 15);
}
function s16() {
  const s = pptx.addSlide();
  addTitleBar(s, '센서 데이터 하나가 Object가 되기까지 6단계', '데이터 생애주기: raw → 온톨로지');
  stepSlide(s, [
    { n: '1', t: '센서 측정', d: 'A350 엔진 오일 온도 센서가 142.3°C 측정 → 항공기 내 컴퓨터(ACMU)에 기록', itemH: 0.82 },
    { n: '2', t: '지상 전송', d: 'ACARS 통신 또는 착륙 후 Wi-Fi로 raw 바이너리 데이터 지상 서버에 전송', itemH: 0.82 },
    { n: '3', t: 'Raw 저장', d: 'Foundry에 원본 그대로 저장. {sensor_id, timestamp, raw_value, flight_id}', itemH: 0.82 },
    { n: '4', t: '파이프라인 변환', d: '타임스탬프 UTC 변환 + 단위 변환(°F→°C) + 기체번호 매핑 + 이상치 플래그 부여', itemH: 0.82 },
    { n: '5', t: 'Object 매핑', d: 'SensorReading Object에 매핑, Aircraft·Flight와 Link 자동 연결', itemH: 0.82 },
    { n: '6', t: '연쇄 반응', d: '값 > 150°C → MaintenanceAlert 생성 → WorkOrder 트리거 → 정비 대시보드', itemH: 0.82, color: COLORS.accent_red },
  ]);
  s.addText('비유: 택배 추적과 같다. 물건이 공장→물류센터→트럭→집 앞까지 추적되듯, 센서 데이터도 각 단계를 거치며 "의미"가 덧붙는다.', { x: 0.6, y: 6.8, w: 12.13, h: 0.4, fontSize: 12, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  pgn(s, 16);
}
function s17() {
  const s = pptx.addSlide();
  addTitleBar(s, '파이프라인: 엑셀 파워쿼리와 비슷하다', '데이터 정리 과정');
  bullets(s, [
    'Pipeline Builder = 여러 소스에서 데이터를 가져와 단계별로 가공하는 도구',
    '엑셀 파워쿼리처럼 박스와 화살표로 변환 과정을 시각적으로 정의',
    '핵심 원칙: 원본 데이터를 절대 수정하지 않는다 — 변환 이력을 Foundry 안에서 완전히 관리',
    '변환 예시: 센서값 "98.2°F" → 36.8°C로 단위 변환 / 로컬 시간 → UTC 통일 / "AF" → "Air France" 매핑',
    '최종 결과: Object Type을 채우는 깨끗한 데이터셋',
  ]);
  pgn(s, 17);
}
function s18() {
  const s = pptx.addSlide();
  addTitleBar(s, '온도 150°C 초과: 자동 연쇄 반응이 시작된다', '데이터가 행동을 일으키는 순간');
  stepSlide(s, [
    { n: '1', t: 'SensorReading', d: '엔진 오일 온도 = 152°C, isAnomaly = true로 기록', itemH: 0.95 },
    { n: '2', t: 'Alert 생성', d: '임계값 초과 → MaintenanceAlert Object 자동 생성. severity = "WARNING"', itemH: 0.95, color: COLORS.accent_yellow },
    { n: '3', t: 'WorkOrder 트리거', d: 'Alert가 WorkOrder 생성 Action을 발동. "엔진 오일 점검" 작업지시 생성', itemH: 0.95 },
    { n: '4', t: '대시보드 표시', d: '항공사 정비팀 대시보드에 즉시 표시. 담당 엔지니어에게 알림 발송', itemH: 0.95 },
    { n: '5', t: '후속 결정', d: '엔지니어가 점검 후 "정비 완료" Action 실행 → 다음 슬라이드의 연쇄로 이어짐', itemH: 0.95 },
  ]);
  s.addText('핵심: "읽기 전용 데이터"와 "운영 시스템"의 차이. 데이터를 보기만 하는 것 vs 데이터가 행동을 일으키는 것.', { x: 0.6, y: 6.7, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  pgn(s, 18);
}
function s19() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Action이란: 버튼 하나에 규칙 묶음', '온톨로지를 운영 시스템으로 만드는 핵심');
  s.addText('비유: 결재 시스템의 "승인" 버튼. 누르면 관련 문서 전부가 연쇄로 업데이트된다.\nAction도 마찬가지: 사용자가 버튼 하나를 누르면, 여러 Object가 한꺼번에 바뀐다.', { x: 0.6, y: 1.8, w: 12.13, h: 0.7, fontSize: 14, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue, lineSpacingMultiple: 1.4 });
  const cards = [
    { title: '① 파라미터 (입력)', body: '사용자가 입력하는 값\n\n예: "교체한 부품 번호",\n"작업 완료 시간",\n"메모"' },
    { title: '② 규칙 (변경 로직)', body: '어떤 Object가 어떻게 바뀌는지\n\n예: WorkOrder.status = "완료"\n+ Alert.status = "해결"\n+ Component 교체' },
    { title: '③ Side Effect (알림)', body: '외부 시스템으로의 트리거\n\n예: 항공사에 이메일 알림\n+ EASA 규정 보고 시스템에\n  자동 기록' },
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    addCard(s, { x, y: 2.7, w: 3.8, h: 3.0, title: c.title, body: c.body, accentColor: CC[i] });
  });
  s.addText('이 3요소가 합쳐져 하나의 Action을 구성한다. 코드 없이 GUI로 설정 가능.', { x: 0.6, y: 6.0, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary });
  pgn(s, 19);
}
function s20() {
  const s = pptx.addSlide();
  addTitleBar(s, '"센서 교체 완료" 버튼: 4개 Object가 동시에 바뀐다', '원자적 트랜잭션');
  const changes = [
    { obj: 'WorkOrder', change: 'status → "Completed" (작업 완료)', color: COLORS.accent_blue },
    { obj: 'MaintenanceAlert', change: 'status → "Resolved" (경보 해제)', color: COLORS.accent_cyan },
    { obj: 'Component (구 부품)', change: 'installedOn → null (장착 해제)', color: COLORS.accent_yellow },
    { obj: 'Component (신 부품)', change: 'installedOn → "MSN523" (장착)', color: COLORS.accent_purple },
  ];
  changes.forEach((c, i) => {
    const y = 1.9 + i * 1.05;
    s.addShape('roundRect', { x: 0.6, y, w: 12.13, h: 0.8, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    s.addShape('rect', { x: 0.6, y, w: 0.08, h: 0.8, fill: { color: c.color } });
    s.addText(c.obj, { x: 1.0, y, w: 3.2, h: 0.8, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: c.color, valign: 'middle' });
    s.addText(c.change, { x: 4.2, y, w: 8.53, h: 0.8, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, valign: 'middle' });
  });
  s.addText('원자적 트랜잭션: 4개 변경이 전부 성공하거나 전부 실패. 부분 변경(구 부품은 빠졌는데 신 부품은 안 들어간 상태)은 절대 없다.', { x: 0.6, y: 6.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
  pgn(s, 20);
}
function s21() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Writeback 7단계: 버튼 클릭부터 전체 반영까지', '구글 독스보다 정교한 실시간 동기화');
  stepSlide(s, [
    { n: '1', t: '버튼 클릭', d: '사용자가 파라미터 입력 후 제출', itemH: 0.7 },
    { n: '2', t: '권한 검사', d: '"이 사용자가 인증된 담당자인가?" 불합격 시 여기서 종료', itemH: 0.7 },
    { n: '3', t: 'Writeback Webhook', d: '외부 시스템(ERP)에 요청. 실패 → 전체 롤백 (온톨로지 변경 없음!)', itemH: 0.7, color: COLORS.accent_red },
    { n: '4', t: '원자적 변경', d: '4개 Object 동시 변경 — 전부 성공 또는 전부 실패', itemH: 0.7 },
    { n: '5', t: '저장', d: 'Writeback 데이터셋에 기록 + 인덱스 업데이트 (~6초)', itemH: 0.7 },
    { n: '6', t: 'Side Effect', d: '알림·웹훅 발송. 실패해도 4단계 변경은 유지됨 (3번과 반대!)', itemH: 0.7, color: COLORS.accent_yellow },
    { n: '7', t: '전체 반영', d: '모든 앱(대시보드, AI 비서, 외부 앱)에서 변경 확인 가능', itemH: 0.7 },
  ]);
  pgn(s, 21);
}
function s22() {
  const s = pptx.addSlide();
  addTitleBar(s, '3번과 6번의 실패는 정반대로 동작한다', 'Writeback Webhook vs Side Effect — 핵심 설계 결정');
  // 좌측
  s.addText('3번: Writeback Webhook 실패 시', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('→ 전체 롤백. 온톨로지 변경 없음.\n\n"ERP에 기록하지 못하면\n아예 안 한 것으로 처리한다"\n\n이유: 외부 시스템과 온톨로지가\n불일치하면 더 큰 문제가 생긴다', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  // 우측
  s.addText('6번: Side Effect 실패 시', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow });
  s.addText('→ 온톨로지 변경은 유지.\n  알림만 재시도.\n\n"작업 완료 처리는 됐는데\n알림은 안 간 상태"\n\n이유: 알림 실패 때문에\n실제 완료된 작업을 취소할 수는 없다', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  s.addText('이 구분이 온톨로지와 외부 시스템 연동의 핵심 설계 결정이다.', { x: 0.6, y: 5.8, w: 12.13, h: 0.5, fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
  pgn(s, 22);
}
function s23() {
  const s = pptx.addSlide();
  addTitleBar(s, '에어프랑스는 에어프랑스 데이터만 본다', '보안 모델: 같은 온톨로지, 다른 뷰');
  bullets(s, [
    'Skywise는 50,000명 이상이 같은 플랫폼을 사용한다',
    '하지만 에어프랑스 정비사는 에어프랑스 항공기 데이터만 볼 수 있다',
    '행 수준 보안: Aircraft.operatorAirlineCode = "AF"인 행만 보임',
    '열 수준 보안: 같은 Aircraft인데 특정 민감 속성(엔진 성능 수치)은 Airbus만 볼 수 있다',
    'Airbus 엔지니어는 전체 항공기 데이터를 볼 수 있지만, 개별 항공사의 비즈니스 데이터는 안 보임',
    'AI 비서(AIP)도 같은 보안 적용: LLM이 사용자 권한 밖의 데이터를 컨텍스트에 아예 포함하지 않음',
  ]);
  s.addText('비유: 같은 건물인데, 카드키에 따라 들어갈 수 있는 층이 다른 것. 5층 카드키 소지자는 5층만 보인다.', { x: 0.6, y: 6.4, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue });
  pgn(s, 23);
}
function s24() {
  const s = pptx.addSlide();
  addTitleBar(s, '"MSN523의 미완료 작업"을 찾는 두 가지 방법', '온톨로지 vs 전통 SQL');
  // 좌측
  s.addText('온톨로지 (3줄)', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('Aircraft("MSN523")\n  .hasWorkOrder\n  .filter(status = "open")\n\n→ 관련 Part, Supplier 정보가\n  Link를 따라 자동으로 딸려온다\n→ 보안이 자동 적용됨\n→ AI 비서도 같은 방식으로 접근', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  // 우측
  s.addText('SQL (20줄+)', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('SELECT wo.*, p.*, s.*\nFROM work_orders wo\nJOIN aircraft a ON ...\nJOIN parts p ON ...\nJOIN suppliers s ON ...\nWHERE a.msn = "MSN523"\n  AND wo.status = "open"\n\n→ 테이블 간 외래키를 직접 명시\n→ 보안을 별도로 구현해야 함\n→ 의미가 코드에 없음 (사람이 해석)', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  s.addText('차이: 온톨로지는 "의미가 내장"되어 있어서, 관계를 매번 새로 설명할 필요가 없다.', { x: 0.6, y: 6.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, align: 'center' });
  pgn(s, 24);
}
function s25() {
  const s = pptx.addSlide();
  addTitleBar(s, 'A350 납품 33% 가속, 50,000명이 사용하는 플랫폼', 'Airbus Skywise 성과');
  const kpis = [
    { label: 'A350 납품 가속화', value: '33%', color: COLORS.accent_blue },
    { label: '플랫폼 사용자', value: '50,000+', color: COLORS.accent_cyan },
    { label: '연결 항공기', value: '12,000+', color: COLORS.accent_yellow },
  ];
  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * 4.1;
    s.addShape('roundRect', { x, y: 1.8, w: 3.8, h: 2.0, rectRadius: 0.08, fill: { color: COLORS.bg_secondary } });
    s.addText(kpi.value, { x: x + 0.15, y: 1.9, w: 3.5, h: 1.0, fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: true, color: kpi.color, align: 'center' });
    s.addText(kpi.label, { x: x + 0.15, y: 2.95, w: 3.5, h: 0.45, fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_tertiary, align: 'center' });
  });
  s.addText('주의: 33% 수치는 팔란티어-에어버스 공동 PDF(2020)에서 나온 것이며 독립 검증은 없다.\n비소프트웨어 요인(추가 인력, 병행 공정 최적화)이 포함됐을 수 있다.', { x: 0.6, y: 4.3, w: 12.13, h: 0.8, fontSize: 12, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary, lineSpacingMultiple: 1.3 });
  pgn(s, 25);
}
function s26() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Airbus 역설계 요약: 이것이 온톨로지의 실체다');
  const cards = [
    { title: '① 허브 중심 설계', body: '모든 데이터가 Aircraft를 중심으로 연결. 아무 지점에서 시작해도 관련 정보에 도달.' },
    { title: '② 이벤트 분리', body: 'Flight, SensorReading, Alert를 별도 Object로. 시간 기반 분석이 자유자재.' },
    { title: '③ 의미 있는 연결', body: 'Link에 이름과 방향이 있어서 "왜 연결되었는지" 시스템이 안다.' },
    { title: '④ 데이터가 행동을 일으킴', body: 'Action으로 4개 Object를 원자적으로 변경. Writeback으로 모든 앱에 반영.' },
  ];
  cards.forEach((c, i) => {
    const pos = [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }][i];
    addCard(s, { x: pos.x, y: pos.y, w: 5.915, h: 2.45, title: c.title, body: c.body, accentColor: CC[i] });
  });
  pgn(s, 26);
}

// ===== PART 3: AML 검증 (27~39) =====
function s27() { const s = pptx.addSlide(); sectionSlide(s, '02', '온톨로지 역설계', '금융 AML 편 — 같은 원리가 다른 분야에서 작동하는지 검증', 27); }

function s28() {
  const s = pptx.addSlide();
  addTitleBar(s, '오탐 95%는 세 가지 구조적 원인 때문이다', 'AML 문제 분석');
  const cards = [
    { title: '① 균일 규칙', body: '월급 $9,500 간호사에게도, 매출 $9,500 편의점 주인에게도 같은 규칙.\n편의점 주인은 매일 현금 입금 → 매일 Alert.' },
    { title: '② 맥락 부재', body: '10년간 같은 패턴으로 거래한 고객도, 시스템은 "오늘 거래"만 본다.\n역사적 행동 패턴 비교가 없다.' },
    { title: '③ 데이터 사일로', body: 'KYC팀(신원확인), 거래감시팀, 조사팀이 각각 별도 시스템.\n같은 고객을 세 번 따로따로 본다.' },
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    addCard(s, { x, y: 1.8, w: 3.8, h: 4.0, title: c.title, body: c.body, accentColor: CC[i] });
  });
  s.addText('팔란티어 공식 문서: "20~30년 전에 수립된 동일한 위험 등급 및 경보 로직이 오늘날에도 여전히 통용되고 있다"', { x: 0.6, y: 6.2, w: 12.13, h: 0.5, fontSize: 12, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary });
  pgn(s, 28);
}
function s29() {
  const s = pptx.addSlide();
  addTitleBar(s, 'AML 온톨로지의 중심은 Transaction이다', '허브 식별 → 전체 구조');
  s.addText('Airbus에서 Aircraft가 중심이었듯, AML에서는 Transaction(거래)이 중심이다.\n모든 ML 모델, 시나리오 규칙, 분석관 작업이 거래 데이터를 소비한다.', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.accent_blue, lineSpacingMultiple: 1.3 });
  addStyledTable(s, ['Object', '역할', '핵심 속성', 'Airbus 대응'],
    [
      ['Customer', '거래의 주체', 'risk_score, pep_flag, behavior_change', 'Aircraft (허브)'],
      ['Account', '자금의 통로', 'type, status, avg_balance', '—'],
      ['Transaction', '자금세탁의 흔적', 'amount_usd, type, timestamp_utc', 'SensorReading (이벤트)'],
      ['Alert', 'ML 판단 결과', 'score, scenario, status', 'MaintenanceAlert'],
      ['Case', '분석관 조사 단위', 'assigned_to, resolution', 'WorkOrder'],
      ['Organization', '실소유권 체인', 'ownership_chain', 'Component'],
    ], { y: 2.6, rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] });
  pgn(s, 29);
}
function s30() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Customer의 25개 위험 지표: 왜 이 지표인가', '속성 설계의 인과 논리');
  addStyledTable(s, ['지표', '설명', '왜 이 지표인가'],
    [
      ['risk_score (0~100)', '종합 위험 점수', '단일 숫자로 분석관이 즉각 우선순위화'],
      ['customer_segment', '개인/SME/법인/PEP', '같은 거래도 세그먼트마다 "정상" 기준이 다르다'],
      ['pep_flag', '정치적 노출인물 여부', '고위 공직자는 국제 규제상 강화 심사 의무'],
      ['behavior_change_flag', '행동 패턴 급변 여부', '갑자기 거래 패턴이 바뀌면 핵심 신호'],
      ['network_risk_score', '연결 엔티티 위험도 합산', '본인은 깨끗해도 주변이 위험할 수 있다'],
      ['onboarding_risk_score', '최초 가입 시 위험 점수', '시간 경과에 따른 위험도 변화 추적 기준선'],
    ], { y: 1.8, rowH: [0.45, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55] });
  s.addText('25개는 팔란티어 공식 문서 명시 수치. 각 지표의 가중치는 은행마다 다르게 커스터마이즈.', { x: 0.6, y: 6.3, w: 12.13, h: 0.4, fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary });
  pgn(s, 30);
}
function s31() {
  const s = pptx.addSlide();
  addTitleBar(s, '$9,500 송금 하나의 여행: 7단계', 'Transaction 생애주기');
  stepSlide(s, [
    { n: '0', t: '코어뱅킹', d: '김민준이 A은행→한국 $9,500 송금. 코어뱅킹 시스템에 raw 기록', itemH: 0.73 },
    { n: '1', t: '파이프라인 정제', d: '통화→USD 변환, UTC 타임스탬프, 국가코드 매핑, 목적코드 표준화', itemH: 0.73 },
    { n: '2', t: 'Object 생성', d: 'Transaction Object: amount_usd=9500, type=WIRE, beneficiary=KR', itemH: 0.73 },
    { n: '3', t: 'Link 연결', d: 'Customer "Minjoon Kim" + Account와 자동 Link', itemH: 0.73 },
    { n: '4', t: 'ML 점수 계산', d: 'Function이 25개 지표 + 이력 기반 risk_score = 72 산출', itemH: 0.73, color: COLORS.accent_yellow },
    { n: '5', t: '시나리오 매칭', d: '"CTR 근접 국제 송금" 규칙에 매칭 → scenario_flag = true', itemH: 0.73, color: COLORS.accent_yellow },
    { n: '6', t: 'Alert 생성', d: 'ML(72) + 시나리오(매칭) → Alert 생성 → 분석관 Case 할당', itemH: 0.73, color: COLORS.accent_red },
  ]);
  pgn(s, 31);
}
function s32() {
  const s = pptx.addSlide();
  addTitleBar(s, 'ML과 규칙이 동시에 판단한다', '하이브리드 탐지: Function의 역할');
  // 좌측
  s.addText('규칙 기반 시나리오', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue });
  s.addText('"7일 내 $10,000 미만 현금 입금 5건 이상"\n→ Function으로 구현\n→ 확실한 패턴은 잡지만,\n   새로운 수법에는 무력\n\n전통 규칙: 스머핑 약 30% 탐지\n나머지 70%는 놓침', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  // 우측
  s.addText('ML 이상 탐지', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('25개 지표 + 거래 이력 + 네트워크 위험도\n→ Function으로 ML 모델 호출\n→ 새로운 패턴도 탐지하지만,\n   왜 수상한지 설명이 어려움\n\n두 결과를 합쳐서 최종 risk_score 산출\n→ 규칙이 잡는 것 + ML이 잡는 것 = 통합 판단', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  pgn(s, 32);
}
function s33() {
  const s = pptx.addSlide();
  addTitleBar(s, '분석관의 판정이 ML을 더 똑똑하게 만든다', '피드백 루프');
  // 좌측
  s.addText('"오탐 해제" 클릭 시', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('→ Alert.status = "Dismissed"\n→ Customer.risk_score 하향\n→ 이 판정 → ML 학습 데이터에 추가\n→ 다음 학습에서 유사 패턴 점수 하향\n\n결과: 같은 패턴의 오탐이 점차 줄어든다\n\nAirbus 대응: 센서 이상치가 사실은\n정상이었다는 피드백 → 임계값 조정', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 4.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  // 우측
  s.addText('"의심 확인" 클릭 시', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('→ Case.status = "Escalated"\n→ SAR(의심거래보고서) 자동 생성\n→ 규제기관(FinCEN)에 자동 전송\n→ Customer.risk_score 상향 고정\n→ 관련 네트워크 전체에 위험 전파\n→ ML이 이 패턴을 강화 학습\n\n결과: 유사 패턴의 탐지율 향상\n\nAirbus 대응: 실제 고장 발견 →\n해당 센서 유형의 경보 민감도 상향', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 4.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  pgn(s, 33);
}
function s34() {
  const s = pptx.addSlide();
  addTitleBar(s, '회사 A → B → C → D: 진짜 주인은 누구인가', '실소유권 그래프 — 그래프 순회 vs SQL');
  bullets(s, [
    'Alpha사가 Beta사를 소유, Beta가 Gamma를, Gamma가 Delta를 소유',
    'Delta사 계좌에 수상한 자금 유입 → "진짜 소유자가 누구인가?"',
    '온톨로지: Organization→Organization Link를 따라 3단계 순회 → Alpha 발견 (수 초)',
    'SQL: 자기참조 조인 3번 중첩, 단계 수를 미리 정해야 함, 4단계면 쿼리 재작성 필요',
    '핵심: SQL은 "몇 단계까지 찾을지" 미리 정해야 하지만, 그래프는 "끝까지" 추적 가능',
  ], { fs: 16 });
  s.addText('비유: 가계도에서 증조부를 찾을 때, 엑셀은 셀을 하나하나 타고 올라가야 하지만\n가계도 그래프에서는 선을 따라가면 된다. 몇 대 위인지 미리 몰라도 된다.', { x: 0.6, y: 5.8, w: 12.13, h: 0.7, fontSize: 14, fontFace: FONTS.body.fontFace, italic: true, color: COLORS.accent_blue, lineSpacingMultiple: 1.3 });
  pgn(s, 34);
}
function s35() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Airbus와 AML에서 추출한 공통 패턴', '크로스 도메인 검증');
  addStyledTable(s, ['설계 요소', 'Airbus Skywise', '금융 AML', '공통 원리'],
    [
      ['허브 Object', 'Aircraft (항공기)', 'Transaction (거래)', '"매일 아침 가장 먼저 확인하는 것"'],
      ['이벤트 Object', 'SensorReading, Flight', 'Transaction, Alert', '시간순으로 쌓이는 것 → 별도 Object'],
      ['경보 체계', 'MaintenanceAlert', 'Alert/Case', '임계값 초과 → 자동 생성'],
      ['행동 체계', 'WorkOrder + "교체 완료"', 'Case + "오탐 해제"/"확인"', 'Action으로 여러 Object 동시 변경'],
      ['피드백 루프', '임계값 조정', 'ML 재학습', '결과가 다음 판단에 반영됨'],
      ['보안', '항공사별 행 필터', '부서별/고객별 필터', '같은 온톨로지, 다른 뷰'],
    ], { y: 1.8, rowH: [0.45, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55] });
  pgn(s, 35);
}
function s36() {
  const s = pptx.addSlide();
  addTitleBar(s, '6개 산업에서 같은 골격이 반복된다', '산업 횡단 공통 패턴');
  addStyledTable(s, ['패턴', '국방', '헬스케어', '항공', '에너지', '금융', '정부'],
    [
      ['허브', 'Person', 'Patient', 'Aircraft', 'Asset', 'Customer', 'Subject'],
      ['이벤트', 'Event', 'Encounter', 'Flight', 'Reading', 'Transaction', 'Encounter'],
      ['경보', '—', '—', 'Alert', 'Alert', 'Alert/Case', 'Case'],
      ['행동', '작전결심', '처방', 'WorkOrder', 'WorkOrder', '의심확인', '집행'],
    ], { y: 1.8, rowH: [0.45, 0.55, 0.55, 0.55, 0.55] });
  s.addText('온톨로지가 푸는 하나의 문제: "이 엔티티와 관련된 모든 정보를 한 화면에 보여줘"\n차이는 도메인별 엔티티와 관계의 구체적 내용뿐이다.', { x: 0.6, y: 5.2, w: 12.13, h: 0.8, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.3, align: 'center' });
  pgn(s, 36);
}

// ===== PART 4: AIP (37~41) =====
function s37() { const s = pptx.addSlide(); sectionSlide(s, '03', 'AI가 온톨로지를 만나면', 'LLM이 환각 대신 사실을 말하게 되는 원리', 37); }
function s38() {
  const s = pptx.addSlide();
  addTitleBar(s, 'LLM은 전체를 보지 않는다 — 선택된 Object만 받는다', 'Grounding: 온톨로지가 AI의 환각을 줄이는 원리');
  // 좌측
  s.addText('온톨로지 없이', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('"물류센터 위치가 어디야?"\n\nLLM이 자체 지식으로 생성\n→ 존재하지 않는 위치를\n  그럴듯하게 답변 (환각)', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  // 우측
  s.addText('온톨로지 경유', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('"물류센터 위치가 어디야?"\n\nLLM이 온톨로지 쿼리로 변환\n→ DistributionCenter Object에서\n  실제 데이터 반환\n→ 사실 기반 정확한 답변', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.0, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.5 });
  s.addText('핵심: LLM은 전체 온톨로지를 스캔하지 않는다. 선택된 Object만 "변수처럼" 주입받는다.\n보안도 자동: 사용자 권한 밖의 데이터는 LLM 컨텍스트에 아예 포함되지 않는다.', { x: 0.6, y: 5.8, w: 12.13, h: 0.7, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, lineSpacingMultiple: 1.3 });
  pgn(s, 38);
}
function s39() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Action이 LLM의 "도구"가 된다', 'AI 에이전트: Function + Action + 온톨로지');
  bullets(s, [
    'AIP Logic: Function과 Action이 LLM의 "도구(Tool)"로 등록된다',
    'LLM이 추론 과정에서 어떤 도구를 호출할지 스스로 결정한다',
    '예: "재고 확인"(Function) → "공급업체 평가"(Function) → "주문 생성"(Action)',
    '각 도구는 온톨로지를 통해 실제 시스템에 작용 (읽기 + 쓰기)',
    'BP 엔지니어: "북해 플랫폼의 압력 이상 설비 목록" → AIP가 온톨로지 그래프 탐색 → 답변',
    'Gotham(2008) → Foundry(2016) → AIP(2023): 정보기관 그래프 → 기업 운영 → AI 결합',
  ], { fs: 16 });
  pgn(s, 39);
}

// ===== PART 5: 설계 가이드 (40~46) =====
function s40() { const s = pptx.addSlide(); sectionSlide(s, '04', '이제 직접 설계해 보자', '어떤 도메인이든 적용 가능한 6단계 프로세스', 40); }
function s41() {
  const s = pptx.addSlide();
  addTitleBar(s, '6단계로 온톨로지를 설계할 수 있다', '실전 설계 프로세스');
  stepSlide(s, [
    { n: '1', t: '허브 식별', d: '"매일 아침 가장 먼저 확인하는 것은?" → 그것이 중심 Object', itemH: 0.82 },
    { n: '2', t: '이벤트 분리', d: '시간순으로 쌓이는 것들을 별도 Object로 (절대 속성에 넣지 않는다)', itemH: 0.82 },
    { n: '3', t: '지원 Object', d: '허브와 이벤트를 보조하는 참조 데이터 (부서, 제품, 지역 등)', itemH: 0.82 },
    { n: '4', t: 'Link 설계', d: '1:N vs M:N 판단 + 방향성 결정 + 조인 Object 필요 여부', itemH: 0.82 },
    { n: '5', t: 'Action 정의', d: '사용자가 수행하는 행동 → 파라미터 / 규칙 / Side Effect', itemH: 0.82 },
    { n: '6', t: 'Security + Test', d: '행/열 수준 보안 적용 + Interface 정의 + 운영 테스트', itemH: 0.82 },
  ]);
  pgn(s, 41);
}
function s42() {
  const s = pptx.addSlide();
  addTitleBar(s, '예시: 물류 회사에 6단계를 적용하면', '실전 적용');
  addStyledTable(s, ['단계', '적용 결과'],
    [
      ['1. 허브 식별', '"매일 확인하는 것?" → Shipment(배송건). 모든 데이터가 배송건 중심으로 연결'],
      ['2. 이벤트 분리', 'TrackingEvent(위치 추적), StatusUpdate(상태 변경), DeliveryAttempt(배송 시도)'],
      ['3. 지원 Object', 'Warehouse(창고), Driver(기사), Vehicle(차량), Customer(고객)'],
      ['4. Link 설계', 'Shipment→TrackingEvent(1:N), Shipment→Driver(N:1), Driver→Vehicle(N:1)'],
      ['5. Action 정의', '"배송 완료": Shipment.status=Delivered + 고객 알림 + ERP Webhook'],
      ['6. Security', '고객은 자기 배송건만, 창고 관리자는 담당 권역만, 본사는 전체'],
    ], { y: 1.8, rowH: [0.45, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65] });
  pgn(s, 42);
}
function s43() {
  const s = pptx.addSlide();
  addTitleBar(s, '5가지 설계 원칙 체크리스트', '설계 시 반드시 확인할 것');
  addStyledTable(s, ['원칙', '체크 질문', '어기면?'],
    [
      ['① 허브 패턴', '"모든 것이 이것을 중심으로 도는가?"', '데이터 목록이 됨, 시작점 불분명'],
      ['② 이벤트 분리', '"시간순 이벤트를 속성에 넣었는가?"', '이력 추적 불가, 컬럼 폭발'],
      ['③ 단일 PK', '"복합 키를 쓰고 있는가?"', 'Link/Action에서 참조가 복잡해짐'],
      ['④ 네이밍', '"V2, New, Legacy가 이름에 있는가?"', '동일 Object의 중복 존재, 혼란'],
      ['⑤ 분리 기준', '"여러 곳에서 공유? 독립 검색 필요?"', 'Yes 하나라도 있으면 별도 Object'],
    ], { y: 1.8, rowH: [0.45, 0.65, 0.65, 0.65, 0.65, 0.65] });
  pgn(s, 43);
}
function s44() {
  const s = pptx.addSlide();
  addTitleBar(s, '기존 방식과 무엇이 다른가', '경쟁사 비교');
  addStyledTable(s, ['차원', 'Palantir 온톨로지', 'Databricks', 'Snowflake'],
    [
      ['핵심 레이어', '실행 가능한 운영 레이어', 'Unity Catalog (메타데이터)', 'YAML 시맨틱 모델'],
      ['Action/Writeback', '기본 내장 (핵심 차별점)', '없음', '없음'],
      ['AI 연동', '온톨로지 → LLM Grounding', 'AI 모델 빌딩/훈련', 'AI 기반 분석'],
      ['주요 사용자', '비즈니스 운영팀', '데이터 엔지니어', '데이터 분석가'],
      ['오픈소스', '코어 폐쇄, SDK 공개', 'Delta Lake 오픈소스', 'Iceberg 지원'],
    ], { y: 1.8, rowH: [0.45, 0.6, 0.6, 0.6, 0.6, 0.6] });
  s.addText('핵심 차별: Databricks는 데이터를 분석하는 도구, 팔란티어는 데이터로 행동하는 도구.\nAction/Writeback이 다른 플랫폼에는 없다.', { x: 0.6, y: 5.6, w: 12.13, h: 0.7, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, lineSpacingMultiple: 1.3 });
  pgn(s, 44);
}
function s45() {
  const s = pptx.addSlide();
  addTitleBar(s, 'Property vs 별도 Object: 가장 흔한 설계 판단', '4가지 질문');
  addStyledTable(s, ['질문', 'Yes → 별도 Object', 'No → Property'],
    [
      ['여러 곳에서 공유?', '부서(여러 직원이 공유)', '이름(이 직원만의 것)'],
      ['독립 검색 필요?', '부서별 예산 조회', '직급(직원 통해서만 조회)'],
      ['자체에 속성 붙음?', '부서(부서장, 위치 있음)', '생년월일(단일 값)'],
      ['독립 존재 가능?', '직원 없는 부서도 존재', '직원 없는 이름은 무의미'],
    ], { y: 1.8, rowH: [0.45, 0.65, 0.65, 0.65, 0.65] });
  s.addText('하나라도 "Yes"이면 별도 Object로 분리한다.\n확신이 안 서면 일단 별도 Object로 만드는 것이 안전하다. 나중에 합치는 것보다 나누는 게 쉽다.', { x: 0.6, y: 5.2, w: 12.13, h: 0.7, fontSize: 15, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, lineSpacingMultiple: 1.3 });
  pgn(s, 45);
}

// ===== PART 6: 평가 (46~60) =====
function s46() { const s = pptx.addSlide(); sectionSlide(s, '05', '빛과 그림자', '팔란티어 온톨로지의 차별점, 한계, 그리고 판단 기준', 46); }
function s47() {
  const s = pptx.addSlide();
  addTitleBar(s, '개념은 동형이나 통합에서 차별화된다', '핵심 평가');
  // 좌측
  s.addText('비판 (Feng, Pigsty 창업자)', { x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 17, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red });
  s.addText('Object = Table, Property = Column,\nLink = Foreign Key, Action = Stored Proc\n\n"같은 것에 다른 이름을 붙여\n3자리 수 배의 가격을 받는다"\n\n아리스토텔레스(BC350) → ER 모델(1976)\n→ OOP(1990s) → OWL(2001)\n→ Palantir(2016): 5번째 재포장', { x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  // 우측
  s.addText('통합 판단', { x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.35, fontSize: 17, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan });
  s.addText('개별 프리미티브의 동형성은 맞다.\n\n그러나 혁신은 개념이 아니라\n"통합과 접근성"에 있다:\n\n① 데이터+로직+액션+보안 → 한 곳에\n② GUI로 비개발자도 사용\n③ AI가 온톨로지에 직접 접근\n\nFeng 자신도 "가치는 온톨로지 개념이\n아니라 그 밖에 있다"고 인정', { x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 3.5, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
  pgn(s, 47);
}
function s48() {
  const s = pptx.addSlide();
  addTitleBar(s, '모든 성과 수치는 팔란티어 자체 출처이다', '근거 신뢰도');
  addStyledTable(s, ['주장', '출처', '확신도', '독립 검증'],
    [
      ['4중 통합이 제품 차별점', '공식 문서', '높음', '불필요(기술 구조)'],
      ['프리미티브가 DB와 동형', 'Feng(vonng)', '중간', '기술적으로 유효'],
      ['A350 33% 가속화', '팔란티어-에어버스 PDF', '중간', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
      ['KYC 20배 효율화', 'AML 브로슈어', '낮음', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
      ['벤더 락인 심각', 'HASH.ai 독립 분석', '높음', '있음(구조적)'],
      ['AIP 환각 감소', '팔란티어 블로그', '중간', { text: '없음', options: { color: COLORS.accent_red, bold: true } }],
    ], { y: 1.8, rowH: [0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] });
  s.addText('구조적 한계: 팔란티어 성과를 위한 독립적 데이터가 시장에 존재하지 않는다.', { x: 0.6, y: 5.8, w: 12.13, h: 0.4, fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.accent_red });
  pgn(s, 48);
}
function s49() {
  const s = pptx.addSlide();
  addTitleBar(s, '벤더 락인은 구조적 문제이다', '한계');
  bullets(s, [
    '코어 플랫폼은 폐쇄 소스 (SDK와 API는 공개)',
    '데이터를 CSV/JSON으로 내보낼 수 있지만, 다른 시스템에서 즉시 사용 불가',
    '온톨로지 위에 워크플로우와 앱이 쌓이면 전환 비용이 기하급수적으로 증가',
    'Databricks(Delta Lake), Snowflake(Iceberg)와 달리 자체 호스팅 불가',
    '상위 20개 고객 평균 계약: $93.9M/년 (약 1,200억 원)',
    'MCP(Model Context Protocol) 표준화가 진행되면 독점적 Grounding 포지션 약화 가능',
  ], { fs: 16 });
  s.addText('출처: HASH.ai "The Problem with Palantir" (2025-04); Palantir 2025 Annual Report', { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 10, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary });
  pgn(s, 49);
}
function s50() {
  const s = pptx.addSlide();
  addTitleBar(s, '도입 검토 시 7가지 조건별 의사결정 가이드');
  addStyledTable(s, ['조건', '판단'],
    [
      ['이종 데이터 10개 미만, 단일 팀', 'ETL + BI로 충분한지 먼저 검토'],
      ['"분석"이 아닌 "운영 실행" 필요', 'Action/Writeback이 차별점. 경쟁사에 없는 기능'],
      ['연간 SW 예산 $5M 미만', 'AIP Bootcamp 활용하되 복잡한 온톨로지는 예산 초과 위험'],
      ['LLM + 운영 워크플로우 통합', '기구축 온톨로지가 있으면 AIP ROI 높음'],
      ['멀티벤더/오픈소스 원칙', '벤더 락인 높음. 오픈소스 조합 검토'],
      ['비즈니스가 빠르게 변화', '"불완전한 온톨로지는 없는 것보다 위험"'],
      ['정부/규제 환경', '조달 경험·보안 인증이 강점. 윤리 리스크 평가 필요'],
    ], { y: 1.8, rowH: [0.4, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52] });
  pgn(s, 50);
}
function s51() {
  const s = pptx.addSlide();
  addTitleBar(s, '예상 밖 발견 4가지');
  const cards = [
    { title: '표준 수용', body: 'N3C에서 팔란티어는 자체 온톨로지 대신 OMOP CDM 업계 표준을 수용. 가치는 "설계"가 아니라 "통합 플랫폼 능력".' },
    { title: '도구 비중립성', body: 'ICE 사례: 온톨로지 설계(엔티티 연결 방식)가 권력 구조를 결정. 기술 질문이 정치 질문이 됨.' },
    { title: 'MCP 위협', body: 'OpenAI/Anthropic의 MCP 표준화가 확산되면 Grounding 독점 포지션 약화 가능.' },
    { title: '오픈소스 재현', body: '3-layer 아키텍처를 오픈소스로 재현한 프로젝트 존재. 진짜 해자는 FDE+정부 관계.' },
  ];
  cards.forEach((c, i) => {
    const pos = [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }][i];
    addCard(s, { x: pos.x, y: pos.y, w: 5.915, h: 2.45, title: c.title, body: c.body, accentColor: CC[i] });
  });
  pgn(s, 51);
}
function s52() {
  const s = pptx.addSlide();
  addTitleBar(s, '다음에 조사해야 할 3가지');
  const qs = [
    { n: '1', t: 'ROI 정량화', d: '"ETL + 범용 LLM" 대비 온톨로지 구축의 경제적 타당성.\n중견기업($50M~$500M)에서의 손익분기점은?' },
    { n: '2', t: '거버넌스 실무', d: '대규모 조직에서 변경 승인, 스튜어드 역할, 팀 간 충돌 해결.\nFDE 철수 후 자체 운영이 가능한가?' },
    { n: '3', t: 'MCP 시대 포지셔닝', d: 'MCP가 표준으로 자리잡으면 온톨로지의 Grounding 역할은?\n팔란티어가 MCP를 수용할 것인가?' },
  ];
  qs.forEach((q, i) => {
    const y = 1.9 + i * 1.6;
    s.addShape('ellipse', { x: 0.8, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: CC[i] } });
    s.addText(q.n, { x: 0.8, y: y + 0.08, w: 0.5, h: 0.5, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    s.addText(q.t, { x: 1.6, y, w: 11.13, h: 0.45, fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_primary });
    s.addText(q.d, { x: 1.6, y: y + 0.5, w: 11.13, h: 1.0, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_secondary, lineSpacingMultiple: 1.3 });
  });
  pgn(s, 52);
}
// 마무리
function s53() {
  const s = pptx.addSlide();
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  s.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  s.addText('\u201C온톨로지는 데이터를 저장하는 것이 아니라,\n이 데이터로 무엇을 해야 하는가까지 포함하는\n의사결정 모델이다.\u201D', { x: 1.5, y: 2.5, w: 10.33, h: 2.5, fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true, color: COLORS.text_primary, align: 'center', lineSpacingMultiple: 1.5 });
  s.addText('\u2014 이 프레젠테이션의 결론', { x: 1.5, y: 5.2, w: 10.33, h: 0.4, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_tertiary, align: 'center' });
  pgn(s, 53);
}
function s54() {
  const s = pptx.addSlide();
  addTitleBar(s, '핵심 요약');
  const pts = [
    '온톨로지는 분산된 데이터에 "의미"와 "관계"를 부여하여, 3개 시스템을 수동 대조하던 문제를 해결한다.',
    'Airbus(센서→Alert→WorkOrder)와 AML(Transaction→ML→Alert→피드백)에서 보듯, 핵심은 "이벤트 → 경보 → 행동 → 피드백"의 인과 체인이다.',
    'Action의 Writeback 7단계가 온톨로지를 "읽기 전용 카탈로그"가 아닌 "운영 시스템"으로 만든다. 이것이 Databricks/Snowflake에 없는 핵심 차별점이다.',
    '5가지 설계 원칙과 6단계 프로세스로 어떤 도메인에서든 온톨로지 설계를 시작할 수 있다.',
  ];
  pts.forEach((p, i) => {
    const y = 1.9 + i * 1.15;
    s.addShape('ellipse', { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fill: { color: COLORS.accent_blue } });
    s.addText(`${i + 1}`, { x: 0.8, y: y + 0.05, w: 0.45, h: 0.45, fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    s.addText(p, { x: 1.5, y, w: 11.23, h: 0.9, fontSize: 14, fontFace: FONTS.body.fontFace, color: COLORS.text_primary, valign: 'middle', lineSpacingMultiple: 1.3 });
  });
  s.addShape('line', { x: 0.6, y: 6.6, w: 12.13, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  s.addText('검색 비용 (1차+2차): Perplexity ~$4.13 | Tavily 86/1,000 크레딧 | 총 100회 API 호출', { x: 0.6, y: 6.75, w: 12.13, h: 0.3, fontSize: 11, fontFace: FONTS.caption.fontFace, color: COLORS.text_tertiary, align: 'center' });
  pgn(s, 54);
}

// ===== 실행 =====
s01(); s02(); s03(); s04(); s05(); s06(); s07(); s08();  // Part 1 (1~8)
s09(); s10(); s11(); s12(); s13(); s14(); s15(); s16();  // Part 2 (9~16)
s17(); s18(); s19(); s20(); s21(); s22(); s23(); s24();  // Part 2 (17~24)
s25(); s26();                                             // Part 2 (25~26)
s27(); s28(); s29(); s30(); s31(); s32(); s33(); s34();  // Part 3 (27~34)
s35(); s36();                                             // Part 3 (35~36)
s37(); s38(); s39();                                      // Part 4 (37~39)
s40(); s41(); s42(); s43(); s44(); s45();                // Part 5 (40~45)
s46(); s47(); s48(); s49(); s50(); s51(); s52();         // Part 6 (46~52)
s53(); s54();                                             // Closing (53~54)

const outputPath = path.join(__dirname, 'palantir-ontology-v3.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log('저장 완료:', outputPath))
  .catch(err => console.error('저장 실패:', err));
