const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// ===== 디자인 시스템 =====
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
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
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
const totalSlides = 55;

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
      fontSize: 14, fontFace: 'Pretendard',
      color: COLORS.text_tertiary
    });
  }
}

function addPageNumber(slide) {
  slideCount++;
  slide.addText(`${slideCount} / ${totalSlides}`, {
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
    x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.4,
    fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.1
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.6, w: w - 0.4, h: h - 0.8,
    fontSize: 12, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
}

// ===== 슬라이드 생성 함수들 =====

// Slide 1: Title
function createSlide01() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });
  slide.addText('아노다이징 피막의 품질,\n숫자 하나로 판단할 수 있을까', {
    x: 1.5, y: 2.5, w: 10.33, h: 1.6,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: true,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.2
  });
  slide.addText('아노다이징 강건성 지수(Anodizing Robustness Index) 설계 리서치', {
    x: 1.5, y: 4.3, w: 10.33, h: 0.6,
    fontSize: 18, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center'
  });
  slide.addText('2026-03-20', {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center'
  });
  addPageNumber(slide);
}

// Slide 2: Section 1
function createSlide02() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('01', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('왜 지금 새로운\n판정 기준이 필요한가', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('현행 Go/No-Go 체계의 한계와 종합 지수의 필요성', {
    x: 6.0, y: 3.9, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 3: 현재 판정은 합격 아니면 불합격
function createSlide03() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '현재 품질 판정은 "합격 아니면 불합격"밖에 없다');
  slide.addText([
    { text: '아노다이징 피막의 현행 품질 판정 체계\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• MIL-PRF-8625 (미군), QUALANOD (유럽), AAMA (미국 건축) 등\n  전 세계 모든 주요 인증 체계는 ', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: 'Go/No-Go(합격/불합격) 판정', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '을 사용\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• 각 시험 항목(두께, 봉공, 내식성, 경도 등)을 개별적으로 판정\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• 하나라도 불합격이면 전체 로트 거부\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• "얼마나 좋은가"의 연속적 판단은 불가능', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 4: 같은 합격인데 불량률이 다르다
function createSlide04() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '같은 합격 제품인데도 현장 불량률이 다르다');
  slide.addText([
    { text: '합격 제품 사이의 품질 차이가 보이지 않는 문제\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• 로트 A: 두께 18µm, 봉공 양호, 내식성 500시간 → ', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '합격', options: { fontSize: 16, bold: true, color: COLORS.accent_cyan } },
    { text: '\n\n• 로트 B: 두께 12µm, 봉공 최소 기준, 내식성 340시간 → ', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '합격', options: { fontSize: 16, bold: true, color: COLORS.accent_cyan } },
    { text: '\n\n→ 둘 다 합격이지만 ', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '동남아 현장에서 B의 불량률이 3배 높다', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '\n\n→ 현행 체계로는 이 차이를 사전에 구분할 수 없다', options: { fontSize: 16, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 5: 60년간 종합 점수가 없었던 이유
function createSlide05() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '60년간 종합 점수가 없었던 3가지 이유');

  const COL_W = 5.865;
  const COL_LEFT_X = 0.6;
  const COL_RIGHT_X = 6.865;

  slide.addText('부재의 이유', {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary
  });
  slide.addText([
    { text: '1. Go/No-Go로 충분했다\n', options: { bold: true, fontSize: 15 } },
    { text: '전통 용도(항공·건축·군사)에서는 합격/불합격만 중요했고, 합격 제품 간 차이는 가격에 반영되지 않았음\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '2. 다축 성능 압축이 어렵다\n', options: { bold: true, fontSize: 15 } },
    { text: '내식성, 내마모성, 외관, 전기절연 등 용도마다 중요한 축이 달라 단일 축 등급화가 불가\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '3. 시험 시간이 이질적이다\n', options: { bold: true, fontSize: 15 } },
    { text: '두께(10초)와 염수분무(336시간)를 동일 시점에 평가하는 것이 비현실적', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: COL_LEFT_X, y: 2.35, w: COL_W, h: 4.35,
    lineSpacingMultiple: 1.3, valign: 'top', color: COLORS.text_primary
  });

  slide.addText('그런데 지금은 달라졌다', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  slide.addText([
    { text: '• 소비전자 OEM이 합격 내 품질 차별화를 요구\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '• 동남아 등 가혹 환경에서 합격 제품 간 불량률 차이가 비즈니스에 직결\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '• 저가 비파괴 검사 장비의 등장으로 정량 데이터 수집 비용이 하락\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '• 다른 산업(자동차, 식품, 반도체)은 이미 종합 점수 체계를 운영 중', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 4.35,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 6: 종합 지수의 가치 조건
function createSlide06() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '종합 지수가 가치를 갖는 3가지 상황');
  slide.addText([
    { text: '1. 공급자 비교 · 프리미엄 가격 차등\n', options: { fontSize: 18, bold: true, color: COLORS.accent_blue } },
    { text: '   동일 인증 합격 공급자 중 누가 더 나은지 단일 수치로 비교\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '2. 공정 개선 추적\n', options: { fontSize: 18, bold: true, color: COLORS.accent_cyan } },
    { text: '   봉공 조건 변경, 전해액 교체 등의 효과를 연속적 점수로 모니터링\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '3. 환경별 차별 판정\n', options: { fontSize: 18, bold: true, color: COLORS.accent_yellow } },
    { text: '   동남아 출하 제품과 온대 지역 제품에 서로 다른 가중치를 적용하여\n   동일 합격 로트 내에서 용도별로 분류', options: { fontSize: 16, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 7: Quote
function createSlide07() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
  slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText('\u201C합격/불합격을 넘어,\n얼마나 좋은가를 측정해야 한다\u201D', {
    x: 1.5, y: 2.5, w: 10.33, h: 2.5,
    fontSize: 28, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.text_primary, align: 'center', lineSpacingMultiple: 1.5
  });
  slide.addText('\u2014 이 리서치의 핵심 전제', {
    x: 1.5, y: 5.2, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });
  addPageNumber(slide);
}

// Slide 8: Section 2
function createSlide08() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('02', {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('전 세계 인증 체계는\n무엇을 검사하는가', {
    x: 6.0, y: 2.5, w: 6.73, h: 1.2,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2
  });
  slide.addText('4대 인증 체계의 판정 항목과 구조를 비교한다', {
    x: 6.0, y: 3.9, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary
  });
  addPageNumber(slide);
}

// Slide 9: MIL-PRF-8625F
function createSlide09() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '미군 사양은 9가지 항목을 개별 합격/불합격으로 판정한다', 'MIL-PRF-8625F — 미국 군사 규격');
  addStyledTable(slide,
    ['시험 항목', '적용 타입', '합격 기준', '불합격 시'],
    [
      ['피막 두께', 'Type II: 5~25µm, Type III: >50µm', '최소값 충족', '로트 거부'],
      ['내식성 (염수분무)', 'Type II: 168~336시간', '허용 범위 이내', '로트 거부'],
      ['봉공 품질', '전체', '염료 흡착 최소', '로트 거부'],
      ['내마모성 (Taber)', 'Type III 필수', '규정 사이클 통과', '로트 거부'],
      ['밀착성 (접착력)', '지정 시', '박리/탈락 없음', '로트 거부'],
      ['내광성 (색변화)', 'Class 2 (착색)', '색차 ΔE ≤ 3', '로트 거부'],
      ['외관', '전체', '균일, 밀착, 결함 없음', '로트 거부'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 하나라도 불합격이면 전체 로트가 거부된다. 종합 점수 개념은 없다.', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red
  });
  addPageNumber(slide);
}

// Slide 10: QUALANOD
function createSlide10() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '유럽 품질 마크는 두께 등급만 구분하고 나머지는 합격/불합격이다', 'QUALANOD — 국제 품질 라벨 (ISO 7599 기반)');
  addStyledTable(slide,
    ['시험 항목', '기준', '비고'],
    [
      ['피막 두께', '등급별: 5, 10, 15, 20, 25µm', '두께 등급은 존재하나 품질 점수는 아님'],
      ['봉공 품질 — 비파괴', '어드미턴스 또는 염료 반점', '전 시료 합격 필요'],
      ['봉공 품질 — 파괴', '규정 중량 손실 이내', '산 용해 시험'],
      ['내식성', '염수분무 336h 또는 1000h', '등급에 따라 차등'],
      ['외관/색상', '규정 거리에서 결함 없음', '육안 검사'],
      ['내광성', '착색 피막 색차 기준', '자외선 노출 시험'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 두께 등급(5~25µm)은 "최소 요구 두께"의 카테고리이지, 품질 점수가 아니다.', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  addPageNumber(slide);
}

// Slide 11: AAMA 611
function createSlide11() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '미국 건축 기준은 두께와 내식성으로 2개 등급을 나눈다', 'AAMA 611 — 미국 건축용 알루미늄 아노다이징');
  addStyledTable(slide,
    ['항목', 'Class I (고성능)', 'Class II (상업용)'],
    [
      ['피막 두께 (최소)', '≥ 17.8µm (0.7mil)', '≥ 10.2µm (0.4mil)'],
      ['내식성 (염수분무)', '3,000시간', '1,000시간'],
      ['봉공 (산 용해)', '< 2.60 mg/in²', '< 2.60 mg/in²'],
      ['색상 안정성', 'ΔE < 5 (10년 야외)', 'ΔE < 5 (10년 야외)'],
      ['용도', '외부 노출 건축물', '내부 또는 경외부'],
      ['보증', '5~10년', '해당 없음'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 2개 등급(Class I/II)은 사실상 "두께 + 내식성 시간" 기반. 등급 내에서는 Go/No-Go.', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  addPageNumber(slide);
}

// Slide 12: GSB
function createSlide12() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '독일 인증만 3단계 등급 체계를 사용한다', 'GSB International — 분체도장 품질 인증 (아노다이징은 전처리)');
  addStyledTable(slide,
    ['등급', '야외 노출 기간', '총 자외선량', '광택 유지 요구'],
    [
      ['Standard', '약 12개월', '300 MJ/m²', '≥ 50%'],
      ['Master', '약 36개월', '840 MJ/m²', '70~80%'],
      ['Premium', '약 60개월', '1,400 MJ/m²', '70~100%'],
    ],
    { y: 1.8 }
  );
  slide.addText([
    { text: '주의: ', options: { bold: true, color: COLORS.accent_yellow } },
    { text: 'GSB는 분체도장 인증이며, "내후성(광택 유지)"이라는 단일 축으로 등급화에 성공했다.\n아노다이징은 내식성·내마모성·외관 등 다축 평가가 필요하므로 같은 방식의 직접 적용은 어렵다.', options: { fontSize: 13, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 4.2, w: 12.13, h: 1.5,
    fontSize: 13, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 13: 4대 인증 비교 CardGrid
function createSlide13() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4대 인증 체계를 한눈에 비교하면');
  const cards = [
    { title: 'MIL-PRF-8625F (미군)', body: '판정: 순수 Go/No-Go\n등급: 없음 (Type 분류만)\n특징: 가장 엄격, 항목별 독립 판정\n대상: 군사·항공' },
    { title: 'QUALANOD (유럽)', body: '판정: Go/No-Go\n등급: 두께 등급 (5~25µm)\n특징: 라이선스 기반, 연 2회 검사\n대상: 건축·장식' },
    { title: 'AAMA 611 (미국 건축)', body: '판정: Go/No-Go\n등급: Class I / II (2단계)\n특징: 두께+내식성 기반 등급\n대상: 건축 외장재' },
    { title: 'GSB (독일)', body: '판정: Go/No-Go\n등급: Standard/Master/Premium\n특징: 유일한 3단계 등급화\n대상: 분체도장 (아노다이징 아님)' },
  ];
  const CARD = { w: 5.915, h: 2.45, positions: [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }] };
  cards.forEach((card, i) => {
    addCard(slide, { x: CARD.positions[i].x, y: CARD.positions[i].y, w: CARD.w, h: CARD.h, title: card.title, body: card.body, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 14: 모든 인증의 공통점
function createSlide14() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모든 인증의 공통점: 종합 점수는 없다');
  slide.addText([
    { text: '핵심 발견\n\n', options: { fontSize: 20, bold: true, color: COLORS.accent_blue } },
    { text: '• 아노다이징 품질을 ', options: { fontSize: 16 } },
    { text: '단일 지수로 통합한 학술 논문, 특허, 산업 표준이 전무', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '\n\n• 등급화(AAMA Class I/II, GSB 3단계)는 존재하지만,\n  이는 "어떤 수준을 충족하는가"의 이산적 분류이지 "얼마나 좋은가"의 연속 점수가 아님\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• 검색 키워드: "anodizing quality index", "anodizing composite score" 등\n  → 해당하는 결과 없음\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '→ 이것은 "혁신 기회"일 수도, "불필요해서 없는 것"일 수도 있다.\n   어느 쪽인지는 파일럿으로 검증해야 한다.', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top', color: COLORS.text_secondary
  });
  addPageNumber(slide);
}

// Slide 15: OEM 비공개 기준
function createSlide15() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '대형 제조사의 내부 기준이 실질적 표준을 견인한다');
  slide.addText([
    { text: '공식 인증 = 최소 기준 / 실질 기준 = 대형 OEM의 비공개 사양\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• Apple: 7000계 알루미늄, "항공우주 등급" 아노다이징 주장,\n  매트 블랙(L* < 10) 등 특정 외관 목표값을 특허로 관리\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• Samsung: "NO SPEC NO WORK" 원칙, 자체 품질 핸드북 운영\n  최근 티타늄으로 전환 추세 (Galaxy S24 Ultra~)\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 공통점: MIL/QUALANOD보다 외관(cosmetic) 기준이 훨씬 엄격\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '시사점: ', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '강건성 지수는 이들 OEM의 "비공개 기준"을 체계화하는 도구가 될 수 있다', options: { fontSize: 16, color: COLORS.text_primary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 16: Section 3
function createSlide16() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('다른 산업의 종합 점수화\n사례에서 배운다', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('자동차, 식품, 소프트웨어 산업의 Gate+Score 구조', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 17: Demerit Scoring
function createSlide17() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '결함을 등급별로 가중치를 매겨 합산하는 감점 체계', '감점 체계 (Demerit Scoring System) — 제조업 범용');
  addStyledTable(slide,
    ['결함 등급', '가중치', '의미', '아노다이징 예시'],
    [
      ['Class A (치명)', '100점', '안전 위험 또는 기능 상실', '피막 완전 박리, 모재 노출'],
      ['Class B (주요)', '50점', '주요 기능 저하', '봉공 불량, 심한 부식'],
      ['Class C (경미)', '10점', '경미한 성능 이슈', '두께 하한 근접, 약한 변색'],
      ['Class D (외관)', '1점', '외관 결함만', '미세 얼룩, 광택 불균일'],
    ],
    { y: 1.8 }
  );
  slide.addText('품질 지수 = (100×nA + 50×nB + 10×nC + 1×nD) ÷ 총 검사 수', {
    x: 0.6, y: 5.0, w: 12.13, h: 0.5,
    fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, align: 'center'
  });
  slide.addText('주의: 가중치 비율(100:50:10:1)은 경험적 설정이며, 아노다이징에 적용 시 전문가 합의로 재설정 필요', {
    x: 0.6, y: 5.7, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// Slide 18: Tupy SQI
function createSlide18() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '브라질 주조 기업은 가중합과 감점 승수를 결합했다', 'Tupy SQI (Supplier Quality Index) — 자동차 주조 산업');
  slide.addText([
    { text: 'SQI 산출 공식\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: 'SQI = [자재품질(50%) + 품질시스템(20%) + 상업자세(30%)]\n       × 시정조치 × 응답속도 × 공정품질 × 서류전달 × 재발방지\n\n', options: { fontSize: 15, bold: true, color: COLORS.accent_blue } },
    { text: '핵심 설계 원칙:\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• 일부 항목은 더하기(가중합) → 부분적 보상 가능\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 일부 항목은 곱하기(승수) → 치명적 실패 시 전체 점수 급락\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 승수가 0에 수렴하면 전체 SQI → 0 (사실상 불합격 관문)\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '→ 이것이 Gate(관문) + Score(점수) 구조와 수학적으로 동일하다', options: { fontSize: 16, bold: true, color: COLORS.accent_cyan } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 19: Tupy 감점 테이블
function createSlide19() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '불량이 어디서 발견되느냐에 따라 감점이 기하급수적으로 커진다');
  addStyledTable(slide,
    ['불량 로트 수', '입고검사 발견', '적용 단계 발견', '고객 발견', '현장(필드) 발견'],
    [
      ['0', '1.00', '1.00', '1.00', '1.00'],
      ['1', '0.80 (−20%)', '0.60 (−40%)', '0.40 (−60%)', '0.20 (−80%)'],
      ['2', '0.64', '0.36', '0.16', '0.04'],
      ['3', '0.51', '0.22', '0.06', '0.01'],
      ['5건 이상', '0.33', '0.08', '0.01', '0.00 (사실상 퇴출)'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 아노다이징에도 적용 가능: "공정 내 발견"보다 "고객 불만"이 훨씬 큰 감점을 받는 구조', {
    x: 0.6, y: 6.0, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  addPageNumber(slide);
}

// Slide 20: 4가지 산업 사례 CardGrid
function createSlide20() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 산업 사례의 공통 구조: 관문(Gate) + 점수(Score)');
  const cards = [
    { title: '식품안전 (HACCP)', body: '관문: 위해요인 임계점\n(온도, 시간 위반 → 즉시 폐기)\n점수: 품질 관련 항목\n(맛, 외관 등 등급화)' },
    { title: '자동차 (Tupy SQI)', body: '관문: 감점 승수 → 0 수렴\n(치명 불량 발견 시)\n점수: 가중합\n(자재·시스템·상업 50:20:30)' },
    { title: '소프트웨어 품질', body: '관문: 컴파일·실행·메모리 안전\n(실패 시 점수 = 0)\n점수: 정확도·성능·코드 품질\n(카테고리별 가중합)' },
    { title: '번역 품질 (MQM)', body: '관문: 치명 오류 발생 시\n(자동 불합격)\n점수: 오류 가중합 → 정규화\n(100점 만점 기준)' },
  ];
  const CARD = { w: 5.915, h: 2.45, positions: [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }] };
  cards.forEach((card, i) => {
    addCard(slide, { ...CARD.positions[i], w: CARD.w, h: CARD.h, ...card, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 21: HACCP 상세
function createSlide21() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '식품 안전의 "관문"과 "품질점수" 2단계가 가장 좋은 모델이다');
  const COL_W = 5.865;
  slide.addText('1단계: 관문 (CCP)', { x: 0.6, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_red });
  slide.addText('Critical Control Point\n= 위해요인 관리 필수 단계\n\n• 살균 온도 < 72°C → 즉시 폐기\n• 금속 검출기 반응 → 즉시 격리\n• 보상 불가: 다른 항목이 아무리 좋아도 무효\n\n→ 아노다이징 대응:\n  두께 미달, 봉공 불합격, 피막 박리', {
    x: 0.6, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  slide.addText('2단계: 점수 (CQP)', { x: 6.865, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_cyan });
  slide.addText('Critical Quality Point\n= 품질 영향 단계 (안전과 무관)\n\n• 외관, 맛, 포장 품질 → 등급/점수화\n• 부분 보상 가능: 한 항목 낮으면 다른 항목으로 보완\n\n→ 아노다이징 대응:\n  색차, 광택, 경도, 두께 여유율', {
    x: 6.865, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 22: Gate 설계 원칙
function createSlide22() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 교훈: 치명 항목은 점수화하지 말고 즉시 불합격 처리한다');
  slide.addText([
    { text: 'Gate(관문) 설계의 3가지 원칙\n\n', options: { fontSize: 18, bold: true, color: COLORS.text_primary } },
    { text: '1. 보상 불가 원칙\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   봉공이 완전 실패한 피막은, 두께가 아무리 두꺼워도 구제할 수 없다.\n   이런 항목은 점수화하지 않고 즉시 불합격(Gate) 처리한다.\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '2. 전수 비파괴 원칙\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   Gate 항목은 모든 제품에 적용해야 하므로,\n   전수 비파괴 검사가 가능한 항목만 Gate에 포함한다.\n   (예: 염수분무 336시간은 Gate 불가 → 자격 인증으로 배치)\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '3. 최소 항목 원칙\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   Gate를 늘리면 유연성이 줄어든다. 정말 치명적인 3~5개만 Gate에 넣는다.', options: { fontSize: 15, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 23: Section 4 - EIS
function createSlide23() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('전기로 피막 속을\n들여다보는 비파괴 검사법', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('전기화학 임피던스 분광법(EIS)의 원리, 지표, 신뢰성', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 24: EIS 개념 설명
function createSlide24() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전기화학 임피던스 분광법이란 무엇인가');
  slide.addText([
    { text: '전기화학 임피던스 분광법\n', options: { fontSize: 20, bold: true, color: COLORS.accent_blue } },
    { text: '(Electrochemical Impedance Spectroscopy, 이하 EIS)\n\n', options: { fontSize: 14, color: COLORS.text_tertiary } },
    { text: '작은 교류 전압을 피막에 가하고, 돌아오는 전류의 크기와 시간차를 분석하여\n피막의 저항성과 구조를 비파괴로 파악하는 방법\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '비유: ', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '의사가 청진기로 심장 소리를 들어 건강 상태를 파악하듯,\nEIS는 전기 신호로 피막 속 상태를 "듣는다"\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• 낮은 주파수(느린 신호) → 피막 전체의 저항(보호 능력) 파악\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 높은 주파수(빠른 신호) → 피막 표면(봉공 상태) 파악\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 중간 주파수 → 내부 구조(다공층/배리어층) 분리 가능', options: { fontSize: 15, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 25: 아노다이징 피막 구조
function createSlide25() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '아노다이징 피막은 2개 층으로 구성되어 있다');
  const COL_W = 5.865;
  slide.addText('다공층 (Porous Layer)', { x: 0.6, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_blue });
  slide.addText('• 벌집 모양의 미세한 구멍이 촘촘히 배열\n• 두께: 5~100µm (공정 조건에 따라)\n• 역할: 전체 피막 두께의 대부분 차지\n• 봉공(sealing) 처리로 구멍을 막아 보호\n\n봉공이 불완전하면:\n→ 수분·염분이 구멍으로 침투\n→ 내부에서 부식 시작\n→ 겉으로 보이지 않다가 갑자기 불량 발생', {
    x: 0.6, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  slide.addText('배리어층 (Barrier Layer)', { x: 6.865, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_cyan });
  slide.addText('• 알루미늄 모재 바로 위의 얇고 치밀한 층\n• 두께: 10~100nm (매우 얇음)\n• 역할: 부식 방지의 최후 방어선\n• EIS로 이 층의 저항(R_barrier)을 측정 가능\n\n배리어층이 손상되면:\n→ 모재 알루미늄이 직접 부식에 노출\n→ 핏팅(국부 부식) 시작\n→ 피막 전체가 의미를 잃음', {
    x: 6.865, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 26: 피팅-프리 지표 3가지
function createSlide26() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '복잡한 모델링 없이도 쓸 수 있는 3가지 간편 지표');
  slide.addText([
    { text: '"피팅-프리(fitting-free) 지표"란?\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '수학적 모델링(등가회로 피팅) 없이 측정 데이터에서 바로 읽어내는 수치.\n전문가가 아니어도 자동화 시스템으로 판정 가능.\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '1. 저주파 임피던스 |Z|₀.₁Hz\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   → 피막 전체의 보호 능력을 한 숫자로 표현\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '2. 열화 지수 CDI%\n', options: { fontSize: 16, bold: true, color: COLORS.accent_cyan } },
    { text: '   → 시간에 따라 피막이 얼마나 나빠졌는지 추적 (Coating Deterioration Index)\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '3. 주파수 전환점 f_b\n', options: { fontSize: 16, bold: true, color: COLORS.accent_yellow } },
    { text: '   → 피막 결함이 차지하는 면적 비율을 추정 (breakpoint frequency)', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 27: |Z| 지표 상세
function createSlide27() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '저주파 임피던스로 피막의 전체 저항성을 한 숫자로 본다', '|Z|₀.₁Hz — 0.1Hz에서의 임피던스 크기');
  addStyledTable(slide,
    ['등급', '임피던스 범위', '의미', '현장 판단'],
    [
      [{ text: '우수', options: { bold: true, color: '27AE60' } }, '> 100,000,000 Ω·cm²', '부식 방지 충분', '출하 적합'],
      ['보통', '10,000,000 ~ 100,000,000 Ω·cm²', '모니터링 필요', '조건부 출하'],
      [{ text: '불량', options: { bold: true, color: COLORS.accent_red } }, '< 1,000,000 Ω·cm²', '보호 불충분', '출하 부적합'],
    ],
    { y: 1.8 }
  );
  slide.addText([
    { text: '⚠️ 주의: ', options: { bold: true, color: COLORS.accent_yellow, fontSize: 13 } },
    { text: '위 기준값은 유기코팅(에폭시, 폴리우레탄)에서 확립된 것이며(출처: USBR 2019),\n아노다이징 피막에 대한 직접 검증 데이터는 부족합니다. 현장 적용 전 합금별·봉공별 검증이 필요합니다.', options: { fontSize: 12, color: COLORS.text_tertiary } },
  ], {
    x: 0.6, y: 4.5, w: 12.13, h: 1.5,
    lineSpacingMultiple: 1.3
  });
  addPageNumber(slide);
}

// Slide 28: CDI% 설명
function createSlide28() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '피막 열화를 시간에 따라 추적하는 열화 지수', 'CDI% (Coating Deterioration Index) — 피막 열화 지수');
  slide.addText([
    { text: '계산 방법\n\n', options: { fontSize: 18, bold: true, color: COLORS.text_primary } },
    { text: 'CDI(t) = [초기 임피던스 − 현재 임피던스] ÷ 초기 임피던스 × 100\n\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '해석\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• CDI = 0% → 초기와 동일, 열화 없음\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• CDI = 30% → 초기 대비 30% 보호 능력 감소\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• CDI > 50% → 심각한 열화, 피막 교체 검토\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '검증 현황\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• Mansfeld 그룹이 제안(1991), 알루미늄 6061 아노다이징에서 직접 검증 ★★★\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '• 초기 측정 시점의 불안정성(수분 침투 과도현상)이 기준점을 왜곡할 수 있음', options: { fontSize: 14, color: COLORS.text_tertiary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 29: f_b 설명
function createSlide29() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '주파수 전환점으로 피막의 활성 결함 비율을 추정한다', 'f_b (breakpoint frequency) — 전환 주파수');
  slide.addText([
    { text: '원리\n\n', options: { fontSize: 18, bold: true, color: COLORS.text_primary } },
    { text: '피막이 전기를 "저장하는 거동"에서 "흘리는 거동"으로 바뀌는 주파수 지점\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• 건전한 피막: 전환 주파수가 낮다 (< 1 Hz) → 결함 면적이 작다\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 결함 있는 피막: 전환 주파수가 높다 (> 10 Hz) → 결함 면적이 크다\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '검증 현황\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '• Huang 등(2008): 알루미늄 6061 경질 아노다이징에서 365일간 직접 검증 ★★★\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '• 전환 주파수가 1년간 안정 유지 → 경질 아노다이징의 우수한 내식성 실증\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '주의: 2개 이상의 전환점이 나타나거나, 전환이 불명확한 경우가 있어\n자동 판정 시 예외 처리 로직 필요', options: { fontSize: 13, color: COLORS.text_tertiary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 30: EEC 지표
function createSlide30() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '등가회로 분석을 하면 각 층의 상태를 개별적으로 파악할 수 있다');
  addStyledTable(slide,
    ['파라미터', '건전 피막 기준', '열화 시 변화', '의미', '검증 도메인'],
    [
      ['R_pore\n(다공층 저항)', '> 200 kΩ·cm²', '감소', '봉공 품질 직접 반영', '아노다이징 직접 ★★★'],
      ['R_barrier\n(배리어층 저항)', '> 1,000,000 Ω·cm²', '감소', '최종 부식 방지 성능', '아노다이징 직접 ★★★'],
      ['C_por\n(다공층 정전용량)', '0.4~1.0 nF/cm²', '증가', '수분 침투도 반영', '아노다이징 직접 ★★★'],
      ['C_bar\n(배리어층 정전용량)', '~1 nF/cm²', '증가', '두께 감소 반영', '아노다이징 직접 ★★'],
    ],
    { y: 1.8, rowH: [0.45, 0.8, 0.8, 0.8, 0.8] }
  );
  slide.addText('※ 등가회로 분석은 전문가 의존도가 높아 자동화가 어렵다. 간편 지표를 우선 권장.', {
    x: 0.6, y: 6.3, w: 12.13, h: 0.5,
    fontSize: 12, fontFace: 'Pretendard', color: COLORS.text_tertiary
  });
  addPageNumber(slide);
}

// Slide 31: 도메인 검증 현황
function createSlide31() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '아노다이징에서 직접 검증된 지표 vs 다른 코팅에서 빌려온 지표');
  const cards = [
    { title: '아노다이징 직접 검증 ★★★', body: '• 비어드미턴스 A_s\n  (봉공 품질, ISO 2931 관련)\n• 전환 주파수 f_b\n  (Huang 2008, Al 6061)\n• 열화 지수 CDI%\n  (Mansfeld 그룹)\n• 다공층/배리어층 저항\n  (Huang, Suay 등)' },
    { title: '유기코팅에서 차용 ★~★★', body: '• 저주파 임피던스 기준값\n  (10⁸/10⁶ Ω 경계)\n  → 유기코팅(USBR 2019)\n\n• 확률 플롯 판정법\n  → 파이프라인 코팅\n\n⚠️ 아노다이징 피막은 유기\n코팅보다 얇고 구조가 다르므로\n기준값 직접 전용은 위험' },
  ];
  const positions = [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }];
  cards.forEach((card, i) => {
    addCard(slide, { x: positions[i].x, y: positions[i].y, w: 5.915, h: 4.9, ...card, accentColor: i === 0 ? COLORS.accent_cyan : COLORS.accent_yellow });
  });
  addPageNumber(slide);
}

// Slide 32: Critic 반영 경고
function createSlide32() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 임계값은 아직 아노다이징에서 충분히 검증되지 않았다');
  slide.addShape('roundRect', { x: 0.6, y: 1.8, w: 12.13, h: 4.8, rectRadius: 0.1, fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 2 } });
  slide.addText([
    { text: '⚠️ 검증 상태 요약 (독립 검증팀 리뷰 결과)\n\n', options: { fontSize: 18, bold: true, color: COLORS.accent_yellow } },
    { text: '1. 저주파 임피던스 기준(10⁸/10⁶ Ω)\n', options: { fontSize: 15, bold: true, color: COLORS.text_primary } },
    { text: '   → 유기코팅에서 확립, 아노다이징 직접 검증은 불충분\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '2. 연구자 간 임계값 불일치\n', options: { fontSize: 15, bold: true, color: COLORS.text_primary } },
    { text: '   → 한 연구자는 10⁶ 미만을 "불량"으로, 다른 연구자는 10⁵ 이상을 "합격"으로 제시\n   → 3자릿수(1,000배) 차이가 미해결\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '3. 합금별 기준값 부재\n', options: { fontSize: 15, bold: true, color: COLORS.text_primary } },
    { text: '   → 6063, 6061, 7075 등 합금에 따라 값이 크게 달라지나 통일 기준 없음\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '결론: 현장 적용 전 반드시 합금별·봉공별 자체 검증 데이터 확보 필요', options: { fontSize: 15, bold: true, color: COLORS.accent_red } },
  ], {
    x: 1.0, y: 2.0, w: 11.33, h: 4.4,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 33: Section 5 - EIS 현장 실용성
function createSlide33() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('05', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('비파괴 전기 검사를\n현장에 도입할 수 있는가', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('장비 비용, 측정 시간, 자동화, 표준화 현황 점검', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 34: ISO 2931 어드미턴스
function createSlide34() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '산업계는 이미 단순화된 전기 검사를 쓰고 있다');
  const COL_W = 5.865;
  slide.addText('어드미턴스 시험 (ISO 2931)', { x: 0.6, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_blue });
  slide.addText('• 봉공 품질 판정의 산업 표준\n• 단일 주파수(~1kHz)로 정전용량 측정\n• 측정 시간: 1~2분\n• 장비: LCR 미터 ($500~2,000)\n• QUALANOD 인증의 핵심 시험\n\n합격 기준:\n어드미턴스 ≤ 400/두께(µm) µS', {
    x: 0.6, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  slide.addText('사실 이것은...', { x: 6.865, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_cyan });
  slide.addText('전기화학 임피던스 분광법(EIS)의\n극단적 간소화 버전이다\n\n• EIS: 수십~수만 개 주파수를 스캔\n  → 피막 전체 구조를 상세 파악\n\n• 어드미턴스: 1개 주파수만 사용\n  → 봉공 상태만 빠르게 확인\n\n결론: 일상 봉공 품질관리에는\n어드미턴스로 충분하다', {
    x: 6.865, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 35: ISO 2931 vs EIS
function createSlide35() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '단일 주파수 검사와 전체 스펙트럼 검사의 차이');
  addStyledTable(slide,
    ['비교 항목', '어드미턴스 (ISO 2931)', '전체 임피던스 분광법 (EIS)'],
    [
      ['주파수 범위', '1개 (~1kHz)', '수십~수만 개 (0.01~100,000 Hz)'],
      ['측정 시간', '수 초', '5~30분 (일반) / 1~2분 (고속)'],
      ['알 수 있는 것', '봉공 상태 (1개 수치)', '다공층·배리어층 개별 상태'],
      ['장비 비용', 'LCR 미터 $500~2,000', '포텐시오스탯 $5,000~50,000'],
      ['표준화 수준', 'ISO 2931, QUALANOD 채택', '아노다이징 전용 표준 없음'],
      ['전문성 요구', '낮음 (기사 수준)', '높음 (전기화학 지식 필요)'],
      ['적합 용도', '일상 봉공 품질관리', '공정 최적화, 불량 원인 분석, R&D'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

// Slide 36: 멀티사인 EIS
function createSlide36() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '여러 주파수를 동시에 보내면 측정 시간을 4배 단축할 수 있다', '멀티사인(Multi-sine) 기법');
  slide.addText([
    { text: '일반 방식: 주파수를 하나씩 순서대로 → 5~30분 소요\n멀티사인: 여러 주파수를 동시에 인가 → 1~2분으로 단축\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
  ], { x: 0.6, y: 1.8, w: 12.13, h: 1.0, valign: 'top' });
  addStyledTable(slide,
    ['기법', '시간 단축', '정확도', '비고'],
    [
      ['표준 멀티사인', '3~4배', '일반 방식과 동등', '상용 장비에 이미 탑재 (Gamry OptiEIS)'],
      ['홀수랜덤위상 방식', '최대 4배', '일반보다 우수한 신뢰구간', '비선형성 자동 감지 가능'],
      ['최적화 멀티사인', '~6배 (30초)', '크기 오차 0.47%', '2025년 최신 연구 결과'],
    ],
    { y: 3.0 }
  );
  slide.addText('→ 30초 내 측정 가능해지면 배치 간 샘플링이 현실적으로 가능해진다', {
    x: 0.6, y: 5.8, w: 12.13, h: 0.5,
    fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan
  });
  addPageNumber(slide);
}

// Slide 37: 저가 장비
function createSlide37() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3만 원짜리 칩으로 임피던스 분석기를 만들 수 있다', 'AD5941 기반 저가 포텐시오스탯의 등장');
  slide.addText([
    { text: 'HunStat2 (2025년 발표)\n\n', options: { fontSize: 18, bold: true, color: COLORS.accent_blue } },
    { text: '• 핵심 부품: Analog Devices AD5941 칩 (~$30)\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 임피던스 측정 범위: 0.2Hz ~ 200kHz\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 기능: 전압-전류 곡선(CV), 개방전위(OCP), 임피던스 분광법(EIS)\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 무료 소프트웨어 제공\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '의미: ', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '$30짜리 장비를 여러 대 설치하는 것이\n$15,000 장비 1대보다 현장 커버리지 측면에서 유리할 수 있다\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '⚠️ 단, 고임피던스(10⁹Ω 이상) 측정 정확도는 미검증.\n아노다이징 피막에서의 직접 검증 데이터가 아직 없다.', options: { fontSize: 13, color: COLORS.accent_yellow } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 38: 장비 가격대 비교
function createSlide38() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '장비 가격대별 선택 가이드');
  addStyledTable(slide,
    ['등급', '대표 제품', '가격', '주파수 범위', '적합 용도'],
    [
      ['연구용', 'Gamry Reference 3000', '$15,000~30,000', '0.00001~1,000,000 Hz', 'R&D, 논문급 데이터'],
      ['중급', 'Gamry Interface 1010', '$8,000~15,000', '0.01~1,000,000 Hz', '공정 최적화'],
      ['현장 휴대용', 'PalmSens4', '$5,000~8,000', '0.01~1,000,000 Hz', '현장 출장 측정'],
      ['초저가 DIY', 'HunStat2 (AD5941)', '~$30', '0.2~200,000 Hz', '다수 배치 (미검증)'],
      ['기존 봉공 QC', 'LCR 미터', '$500~2,000', '단일 주파수', '일상 봉공 판정'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 즉시 적용 가능: LCR 미터 + ISO 2931. 전체 EIS는 Tier 3(자격 인증)용으로만 정당화.', {
    x: 0.6, y: 5.8, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  addPageNumber(slide);
}

// Slide 39: AutoEIS
function createSlide39() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '자동 해석 소프트웨어가 전문가 의존도를 낮춘다', 'AutoEIS — 오픈소스 자동 등가회로 분석');
  slide.addText([
    { text: '• 파이썬(Python) 오픈소스 패키지\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 측정 데이터를 넣으면 자동으로 등가회로 모델을 제안하고 피팅\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 진화 알고리즘 + 베이지안 추론으로 최적 모델 선택\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 수동 편향 제거, 재현성 향상\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '하지만 현장 QC에서는 과잉 투자일 수 있다\n\n', options: { fontSize: 16, bold: true, color: COLORS.accent_yellow } },
    { text: '간편 지표(저주파 임피던스 한 숫자)만으로 합격/불합격 판정이 충분하다면,\n복잡한 등가회로 분석까지 갈 필요가 없다.\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '→ AutoEIS는 불량 원인 분석, 공정 개선 시에만 활용 권장', options: { fontSize: 15, bold: true, color: COLORS.accent_blue } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 40: EIS 미해결 과제 CardGrid
function createSlide40() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '현장 도입의 4가지 미해결 과제');
  const cards = [
    { title: '습식 셀 필수', body: '전기화학 측정이므로 전해질(액체)이 반드시 필요.\n건식(마른 상태) 측정은 현재 불가능.\n→ 생산 라인에서 액체를 다루는 것은 비현실적' },
    { title: '전용 표준 부재', body: '아노다이징 피막 전용 EIS 표준이 없다.\n전해질 종류, 온도, 면적, 주파수 범위가 연구자마다 다름.\n→ 측정값의 비교·호환이 어렵다' },
    { title: '임계값 미확립', body: '합격/불합격을 가르는 수치가 합금별·봉공별로 확정되지 않음.\n유기코팅 기준을 빌려 쓰는 중이나 적합성 미검증.\n→ "얼마여야 합격인가"에 대한 답이 없다' },
    { title: '국소 결함 미감지', body: 'EIS는 전체 면적의 평균 임피던스를 측정.\n면적 1% 미만의 핀홀은 감지하지 못할 수 있다.\n→ 핀홀 탐지는 와전류나 광학 검사가 적합' },
  ];
  const CARD = { w: 5.915, h: 2.45, positions: [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }] };
  cards.forEach((card, i) => {
    addCard(slide, { ...CARD.positions[i], w: CARD.w, h: CARD.h, ...card, accentColor: COLORS.accent_red });
  });
  addPageNumber(slide);
}

// Slide 41: EIS 위치 결론
function createSlide41() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전체 스펙트럼 검사는 연구와 자격 인증에 적합하다');
  addStyledTable(slide,
    ['용도', '적합 도구', '근거'],
    [
      ['봉공 품질관리 (일상)', '어드미턴스 (ISO 2931)', '산업 표준, 비파괴, 2분, $500~2,000'],
      ['공정 최적화', '전체 EIS (간편 지표)', '배리어층/다공층 분리 진단'],
      ['불량 원인 분석', '전체 EIS + 등가회로', '열화 메커니즘 규명'],
      ['자격 인증 (연 1~2회)', '저주파 임피던스 + 전환 주파수', '장기 내식성 예측 지표'],
    ],
    { y: 1.8 }
  );
  slide.addText('핵심 결론: EIS를 일상 품질관리(QC)에 쓰려면 아직 이르다.\n하지만 공정 개선과 자격 인증에서는 다른 도구로 대체할 수 없는 가치가 있다.', {
    x: 0.6, y: 5.0, w: 12.13, h: 1.2,
    fontSize: 15, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary,
    lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 42: Section 6
function createSlide42() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('06', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('파괴/비파괴 시험법\n16종을 정리한다', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('내식성, 봉공, 기계적 성질, 두께, 외관, 가속 노화', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 43-46: 시험법 테이블들
function createSlide43() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '내식성 시험: 염수분무부터 인공땀까지');
  addStyledTable(slide,
    ['시험법', '규격', '시간', '파괴/비파괴', '특징'],
    [
      ['염수분무', 'ASTM B117', '336시간', '파괴', '산업 표준이나 실제 환경 상관성 낮음'],
      ['CASS 시험', 'ASTM B368', '16~48시간', '파괴', '3~6배 가속, 장식 도금에 최적화'],
      ['AASS 시험', 'ISO 9227', '48~96시간', '파괴', 'CASS보다 덜 공격적'],
      ['인공땀 침지', 'ISO 3160-2', '24~72시간', '파괴', '소비전자에 직접 관련, 아노다이징 전용 규격 없음'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function createSlide44() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '봉공 품질 시험: 전기 검사부터 산 용해까지');
  addStyledTable(slide,
    ['시험법', '규격', '시간', '파괴/비파괴', '특징'],
    [
      ['어드미턴스', 'ISO 2931', '1~2분', '비파괴', '정량적, EIS와 상관 높음'],
      ['산 용해', 'ASTM B680', '30분', '파괴', '정량적 (질량 손실 ≤ 40mg/dm²)'],
      ['염색 반점', 'ASTM B136', '7~10분', '비파괴(미세 흔적)', '신속·저비용, 정량성 부족'],
      ['염산 침지', '사내 기준', '5~10분', '파괴', '간단하나 표준화 부족'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function createSlide45() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '기계적 시험: 접착력, 경도, 마모 저항');
  addStyledTable(slide,
    ['시험법', '규격', '시간', '파괴/비파괴', '특징'],
    [
      ['크로스컷 접착력', 'ISO 2409', '5분', '파괴(소면적)', '간편하나 아노다이징은 접착 메커니즘이 다름'],
      ['풀오프 접착력', 'ASTM D4541', '30분+', '파괴', '정량적(MPa), 접착제에 결과 의존'],
      ['경도 (Knoop)', 'ASTM E384', '5분', '비파괴(미소)', 'Type II: 300~400 HK, Type III: 500~700 HK'],
      ['Taber 마모', 'ASTM D4060', '30~60분', '파괴', '실사용 마모 시뮬레이션'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

function createSlide46() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '두께와 외관: 전수 비파괴 검사가 가능한 항목');
  addStyledTable(slide,
    ['시험법', '규격', '시간', '파괴/비파괴', '특징'],
    [
      ['와전류 두께', 'ISO 2360', '수초', '비파괴', '가장 널리 사용, 전수검사 가능, ±1µm'],
      ['현미경 단면', 'ASTM B487', '1~2시간', '파괴', '절대 기준(referee), 층 구조 관찰 가능'],
      ['색차 (ΔE)', 'ASTM D2244', '수초', '비파괴', '정량적, 분광측색기 사용'],
      ['광택도', 'ISO 2813', '수초', '비파괴', '표면 마감 품질 지표'],
      ['육안 검사', '사내 기준', '수초', '비파괴', '즉시 판정, 주관적'],
    ],
    { y: 1.8 }
  );
  addPageNumber(slide);
}

// Slide 47: 상관 분석
function createSlide47() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '시험 항목 간 상관관계: 중복을 줄일 수 있는 조합');
  const cards = [
    { title: '높은 상관 (중복 가능)', body: '• 어드미턴스 ↔ EIS 다공층 저항\n  (같은 물리량 측정)\n• 염색 반점 ↔ 산 용해\n  (둘 다 봉공도 평가)\n• 피막 두께 ↔ 염수분무 시간\n  (두께↑ → 내식↑, 대략 선형)' },
    { title: '낮은 상관 (독립 정보)', body: '• 열화 지수(CDI) ↔ 접착력\n  (다른 메커니즘)\n• 경도/마모 ↔ 내식성\n  (기계적 vs 화학적)\n• 색차(ΔE) ↔ 봉공 품질\n  (역은 성립하지 않음)' },
    { title: '시사점', body: '→ 어드미턴스 + 산 용해는 중복\n  하나만 선택해도 충분\n\n→ 경도와 내식성은 독립적\n  둘 다 측정해야 전체 품질 파악\n\n→ 지수 설계 시 중복 항목은\n  하나만 포함하여 가중치 편중 방지' },
  ];
  const positions = [{ x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 }];
  cards.forEach((card, i) => {
    addCard(slide, { x: positions[i].x, y: positions[i].y, w: 3.843, h: 4.9, ...card, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 48: EIS-염수분무 상관
function createSlide48() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전기 검사 값과 염수분무 합격률은 로그-선형 관계를 보인다');
  const COL_W = 5.865;
  slide.addText('Buchheit 연구 (Sandia 국립연구소)', { x: 0.6, y: 1.8, w: COL_W, h: 0.45, fontSize: 16, bold: true, color: COLORS.accent_blue });
  slide.addText('• 33종 변환 피막 + 5종 알루미늄 합금\n• 전기 저항(EIS) vs 168시간 염수분무 비교\n• 결과: 로그-선형 관계 확인\n• 전기 저항 ≥ 2~5백만 Ω·cm² 이면\n  염수분무 합격 확률 높음\n• EIS가 극단값에서 더 변별력 있음\n  (매우 좋거나 매우 나쁜 코팅 구분)', {
    x: 0.6, y: 2.35, w: COL_W, h: 4.0,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, valign: 'top'
  });
  slide.addShape('roundRect', { x: 6.865, y: 1.8, w: COL_W, h: 4.0, rectRadius: 0.1, fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText([
    { text: '⚠️ 주의\n\n', options: { fontSize: 14, bold: true, color: COLORS.accent_yellow } },
    { text: '이 연구는 아노다이징이 아닌\n크로메이트 변환 피막 대상.\n\n아노다이징 피막(10~25µm)은\n변환 피막(0.1~1µm)의 수십 배\n두께이며 구조가 다르다.\n\n임계값의 직접 전용은 위험하나,\n"EIS가 염수분무보다 변별력 있다"\n는 정성적 결론은 유효할 가능성 높음.', options: { fontSize: 13, color: COLORS.text_secondary } },
  ], {
    x: 7.1, y: 2.0, w: 5.4, h: 3.6,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 49: Section 7 - 동남아 환경
function createSlide49() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('07', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('고온고습 환경과 인체 땀이\n피막을 공격하는 메커니즘', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 32, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('동남아 소비전자 시장의 핵심 열화 원인과 사전 예측법', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 50: 동남아 환경 조건
function createSlide50() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '동남아 열대 환경의 전형적 조건');
  addStyledTable(slide,
    ['파라미터', '동남아 전형값', '온대 지역 비교', '영향'],
    [
      ['온도', '28~35°C (연평균 27°C)', '10~20°C', '반응 속도 2~3배 가속'],
      ['상대습도', '70~90% (연평균 80%)', '40~60%', '조해점 이상 → 연속 부식'],
      ['연간 강수량', '1,500~3,000mm', '600~1,200mm', '습건 사이클 빈번'],
      ['일사량', '4.5~5.5 kWh/m²/day', '2.5~3.5', 'UV 열화 가속'],
    ],
    { y: 1.8 }
  );
  slide.addText('핵심: 습도 70% 이상에서 땀 잔류물(소금)이 공기 중 수분을 흡수하여 마르지 않는다\n→ 온대 지역에서는 건조되어 부식이 멈추지만, 동남아에서는 연속 부식 조건이 성립', {
    x: 0.6, y: 5.3, w: 12.13, h: 1.0,
    fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red,
    lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 51: 땀 조성
function createSlide51() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '인체 땀의 조성: 소금, 젖산, 요소가 혼합된 약산성 전해질');
  addStyledTable(slide,
    ['성분', '농도', '피막에 미치는 영향'],
    [
      ['수분', '~99%', '전해질 용매 역할'],
      ['염화나트륨 (NaCl)', '1~5 g/L', '핏팅(국부) 부식의 주원인 — 염소 이온이 피막을 공격'],
      ['젖산 (Lactic acid)', '1~3 g/L', '산화피막을 균일하게 녹이는 킬레이트제 역할'],
      ['요소 (Urea)', '1~2 g/L', '가수분해 → 암모니아 → 국소 pH 변화'],
      ['pH', '4.0~6.8 (평균 5.5)', '약산성 — 산화알루미늄 안정 영역(pH 4~9)의 하한'],
    ],
    { y: 1.8 }
  );
  slide.addText('→ 염소 이온(Cl⁻) + 젖산의 복합 공격이 핵심. 단독보다 동시 존재 시 부식 가속.', {
    x: 0.6, y: 5.8, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue
  });
  addPageNumber(slide);
}

// Slide 52: 핵심 메커니즘
function createSlide52() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '습도 40% 이상에서 땀 잔류물이 마르지 않아 부식이 멈추지 않는다');
  slide.addText([
    { text: '이것이 동남아 필드 불량의 핵심 원인이다\n\n', options: { fontSize: 18, bold: true, color: COLORS.accent_red } },
    { text: '온대 지역 (습도 40% 미만)\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '  손에서 땀 → 피막 표면에 잔류 → 건조되어 결정화 → 부식 정지\n  → 다음 접촉까지 피막이 회복할 시간 확보\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '동남아 (습도 70~90%)\n', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '  손에서 땀 → 피막 표면에 잔류 → NaCl이 공기 중 수분을 흡수(조해)\n  → 액체 상태 유지 → 부식이 24시간 연속 진행\n  → 봉공 불완전 부위에서 부식이 점점 확대\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '→ 핵심은 "피막의 문제"가 아니라 "봉공 불완전 + 건조 안 되는 환경"의 조합', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 53: 5단계 열화 과정
function createSlide53() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '봉공 불완전에서 시작되는 5단계 열화 과정');
  // Timeline
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const items = [
    { step: '1단계', title: '봉공 미비 영역에 수분 침투', desc: '다공층의 미봉공 구멍으로 습기가 스며든다' },
    { step: '2단계', title: '수화물 생성 및 팽창', desc: '산화알루미늄이 물과 반응하여 부피가 ~33% 팽창 → 미세 균열 발생' },
    { step: '3단계', title: '염화물/유기산 침투 경로 생성', desc: '미세 균열을 통해 NaCl, 젖산이 배리어층까지 도달' },
    { step: '4단계', title: '배리어층 공격 → 국부 부식', desc: '최후 방어선이 뚫려 모재 알루미늄이 직접 부식' },
    { step: '5단계', title: '외관 결함 발현', desc: '백화(흰 점), 지문 부식, 변색, 핀홀 → 고객 불만' },
  ];
  items.forEach((item, i) => {
    const y = 1.8 + i * 1.0;
    slide.addShape('ellipse', { x: 0.515, y: y + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.step, { x: 1.0, y: y, w: 1.5, h: 0.3, fontSize: 12, bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 2.5, y: y, w: 4.5, h: 0.3, fontSize: 14, bold: true, color: COLORS.text_primary });
    slide.addText(item.desc, { x: 7.2, y: y, w: 5.53, h: 0.55, fontSize: 12, color: COLORS.text_secondary, lineSpacingMultiple: 1.2 });
    if (i < items.length - 1) {
      slide.addShape('line', { x: 1.0, y: y + 0.85, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
    }
  });
  addPageNumber(slide);
}

// Slide 54: 변색 메커니즘
function createSlide54() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '피막 변색의 5가지 유형과 원인');
  addStyledTable(slide,
    ['변색 유형', '외관', '주 원인', '주요 조건'],
    [
      ['백화 (White spots)', '흰색 점/반점', '합금 내 아연/구리 산화물 또는\n봉공 부산물 석출', '전처리 불량 + 습도'],
      ['지문 부식', '지문 형상 부식 자국', '땀의 NaCl + 젖산이\n봉공 불완전 영역에서 국부 부식', '인체 접촉 + 고습도'],
      ['얼룩 (Staining)', '불규칙 변색', '세척수 오염물 또는\n봉공액 잔류물의 불균일 건조', '제조 공정 결함'],
      ['색 번짐', '염색 경계 번짐', '봉공 불량으로 염료가\n이동·용출', '봉공 부족 + 습도'],
      ['황변 (Yellowing)', '투명 아노다이징 황변', 'UV에 의한 봉공 수화물 변색\n또는 합금 내 철/실리콘 산화', 'UV + 고온'],
    ],
    { y: 1.8, rowH: [0.4, 0.7, 0.7, 0.7, 0.7, 0.7] }
  );
  addPageNumber(slide);
}

// Slide 55: 에지 박리
function createSlide55() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에지 반경이 피막 두께의 10배 미만이면 박리가 발생한다');
  slide.addText([
    { text: '아노다이징 피막은 모재에서 직접 성장하므로 전체 박리는 드물다\n그러나 아래 조건에서 국부 박리가 발생한다:\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '1. 날카로운 모서리 (에지/코너)\n', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '   모서리 반경 < 피막 두께 × 10 → 피막 균열·박리\n   (실제 사례: 스마트폰 카메라 플래토 에지에서 아노다이징 박리 보고)\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '2. 합금 내 금속간 화합물\n', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '   7000계 알루미늄의 MgZn₂ 등 주위에서 불균일 산화 → 국부 결함 → 언더컷팅\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '3. 열 사이클\n', options: { fontSize: 16, bold: true, color: COLORS.accent_red } },
    { text: '   알루미늄(열팽창 23µm/m·°C)과 산화피막(8µm/m·°C)의 3배 차이\n   → 온도 변화 시 계면 전단 응력 → 반복 피로', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 56: 숨은 변수
function createSlide56() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '합금 선택이 시험 결과보다 중요할 수 있다');
  slide.addText([
    { text: '아노다이징 불량의 원인이 항상 아노다이징 공정 자체는 아니다\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '숨은 변수 1: 합금 선택\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '  6063 (내식성 우수) vs 7075 (강도 우수, 핏팅 감수성 높음)\n  → 7000계는 금속간 화합물이 많아 동남아 환경에서 취약\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '숨은 변수 2: 세척 잔류물\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '  제조 후 세척 불충분 → 잔류 산/알칼리가 열대 환경에서 활성화\n  → 이것은 아노다이징이 아니라 후처리(세척) 문제\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '숨은 변수 3: 물류 결로\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '  해상 컨테이너 내 온도 변화 → 결로 → 백화\n  → 시험 스펙이 아니라 포장/물류 관리 문제', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 57: 가속시험 상관성
function createSlide57() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가속 시험은 실제 환경을 얼마나 잘 예측하는가');
  const COL_W = 5.865;
  slide.addText('예측력이 높은 시험', { x: 0.6, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_cyan });
  slide.addText('• 어드미턴스 + 두께 조합\n  → 봉공 불량 = 대부분 필드 불량의 선행 조건\n\n• 인공땀 침지 72시간\n  → 소비전자 사용 환경 직접 시뮬레이션\n\n• 순환 습열 (25~55°C 사이클)\n  → 열대 주야 사이클 재현\n\n• 전기화학 임피던스 분광법\n  → 봉공 + 배리어층 동시 평가', {
    x: 0.6, y: 2.35, w: COL_W, h: 4.0,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  slide.addText('주의가 필요한 시험', { x: 6.865, y: 1.8, w: COL_W, h: 0.45, fontSize: 18, bold: true, color: COLORS.accent_yellow });
  slide.addText('• 85°C/85% 습열 시험\n  → 반도체에서 유래, 아노다이징에는\n    과도한 가속일 수 있음\n  → 85°C는 열수 봉공 온도(~100°C)에 근접\n  → 실제와 다른 열화 모드 유발 가능\n\n• 연속 염수분무 (ASTM B117)\n  → 습건 사이클 없이 연속 분무\n  → 실제 환경과 상관성 낮다는\n    오래된 비판 존재\n\n→ 60°C/90% RH가 더 현실적 대안', {
    x: 6.865, y: 2.35, w: COL_W, h: 4.0,
    fontSize: 14, fontFace: 'Pretendard', color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 58: Section 8 - ARI 설계
function createSlide58() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('08', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('아노다이징 강건성 지수를\n이렇게 설계한다', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('Gate(관문) + Score(점수) 2단계 구조의 구체적 설계안', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 59: 위치 설정
function createSlide59() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 지수는 기존 인증을 대체하지 않고 보완한다');
  slide.addShape('roundRect', { x: 1.5, y: 2.0, w: 10.33, h: 4.0, rectRadius: 0.1, fill: { color: COLORS.bg_secondary } });
  slide.addText([
    { text: '아노다이징 강건성 지수(ARI)의 위치\n\n', options: { fontSize: 20, bold: true, color: COLORS.accent_blue } },
    { text: '• MIL-PRF-8625, QUALANOD 등 ', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '기존 인증의 합격은 전제 조건', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '\n\n• ARI는 합격 제품 사이의 품질 차이를 정량화하는 보완 도구\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• ARI가 아무리 높아도, 인증 불합격이면 출하 불가\n\n', options: { fontSize: 16, color: COLORS.text_secondary } },
    { text: '• ARI가 낮아도, 인증 합격이면 기본 출하는 가능\n  (단, 가혹 환경 출하에는 ARI 등급 제한 적용 가능)', options: { fontSize: 16, color: COLORS.text_secondary } },
  ], {
    x: 2.0, y: 2.3, w: 9.33, h: 3.4,
    lineSpacingMultiple: 1.2, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 60: ARI 전체 구조
function createSlide60() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '3단계 판정 구조: 인증 확인 → 관문 → 점수');
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const items = [
    { step: 'Stage 0', title: '인증 합격 확인', desc: 'MIL-PRF-8625 / QUALANOD / 고객 사양 합격? → No면 ARI 산출하지 않음' },
    { step: 'Stage 1', title: '관문 (Gate) — 즉시 불합격', desc: '피막 두께 ≥ 규격 하한 / 봉공 합격 / 외관 치명 결함 없음 → 하나라도 FAIL → ARI = 0' },
    { step: 'Stage 2', title: '점수 (Score) — 가중합 0~100점', desc: '봉공(30%) + 내식성(25%) + 두께여유(20%) + 외관(15%) + 기계적(10%) = ARI' },
    { step: '등급 부여', title: 'A(85+) / B(65~84) / C(50~64) / F(<50)', desc: 'A: 가혹 환경 출하 가능 / B: 일반 환경 / C: 모니터링 필요 / F: 출하 부적합' },
  ];
  items.forEach((item, i) => {
    const y = 1.8 + i * 1.25;
    slide.addShape('ellipse', { x: 0.515, y: y + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.step, { x: 1.0, y: y, w: 2.0, h: 0.3, fontSize: 13, bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 1.0, y: y + 0.35, w: 4.5, h: 0.35, fontSize: 15, bold: true, color: COLORS.text_primary });
    slide.addText(item.desc, { x: 5.8, y: y + 0.05, w: 6.93, h: 0.8, fontSize: 13, color: COLORS.text_secondary, lineSpacingMultiple: 1.3, valign: 'top' });
    if (i < items.length - 1) slide.addShape('line', { x: 1.0, y: y + 1.15, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  });
  addPageNumber(slide);
}

// Slide 61: Gate 상세
function createSlide61() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '1단계 관문: 전수 비파괴로 즉시 판정하는 3가지 항목');
  addStyledTable(slide,
    ['관문', '시험', '장비', '시간', '합격 기준', '근거'],
    [
      ['G1', '와전류 두께', '휴대 게이지', '10초', '≥ 규격 두께의 80%', '모든 인증 공통'],
      ['G2', '어드미턴스', '봉공 테스터', '1~2분', '≤ QUALANOD 기준', 'ISO 2931'],
      ['G3', '외관 육안', '육안 + 조명', '30초', '크랙·박리·핀홀 없음', 'MIL-PRF-8625'],
    ],
    { y: 1.8 }
  );
  slide.addText([
    { text: '설계 원칙:\n', options: { fontSize: 14, bold: true, color: COLORS.text_primary } },
    { text: '• 전수 비파괴 검사 가능한 항목만 Gate에 포함\n', options: { fontSize: 13, color: COLORS.text_secondary } },
    { text: '• 파괴 시험(염수분무 336시간)은 Gate 불가 → 자격 인증(Tier 3)으로 배치\n', options: { fontSize: 13, color: COLORS.text_secondary } },
    { text: '• Gate 항목 수를 최소화하여 유연성 확보 (3개)', options: { fontSize: 13, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 4.5, w: 12.13, h: 2.0,
    lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 62: Score 상세
function createSlide62() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '2단계 점수: 5가지 항목의 가중합으로 0~100점 산출');
  addStyledTable(slide,
    ['항목', '측정법', '전수/샘플', '가중치 (초안)', '정규화'],
    [
      ['봉공 품질', '어드미턴스 수치', '전수 비파괴', '30%', '20→0 µS/cm² (낮을수록 우수)'],
      ['내식성', '인공땀 침지 24h 평가', '로트 샘플링', '25%', '5단계 등급 (무결함=100)'],
      ['두께 여유율', '(실측−규격 하한)/규격', '전수 비파괴', '20%', '0%→50% 여유'],
      ['외관 품질', '색차 ΔE + 광택', '전수 비파괴', '15%', 'ΔE 3.0→0 (작을수록 우수)'],
      ['기계적 성질', '경도 (Knoop)', '로트 샘플링', '10%', '규격 하한→규격 150%'],
    ],
    { y: 1.8 }
  );
  slide.addShape('roundRect', { x: 0.6, y: 5.5, w: 12.13, h: 1.2, rectRadius: 0.08, fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('⚠️ 가중치는 검증 전 초안입니다. 소비전자 외장·6063 합금·열수 봉공 가정.\n실제 필드 불량 데이터와 전문가 합의를 통해 결정해야 합니다.', {
    x: 0.8, y: 5.6, w: 11.73, h: 1.0,
    fontSize: 12, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 63: 정규화
function createSlide63() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '점수 정규화 방법: 측정값을 0~100으로 변환하는 공식');
  slide.addText([
    { text: '정규화 공식\n\n', options: { fontSize: 18, bold: true, color: COLORS.text_primary } },
    { text: '점수 = min(100, max(0, (측정값 − 하한) ÷ (상한 − 하한) × 100))\n\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '• 하한: Gate 통과 직후의 최소 수준 → 점수 = 0\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 상한: 최우수 수준의 목표값 → 점수 = 100\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 하한 미만: 0점 (Gate에서 이미 걸러짐)\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '• 상한 초과: 100점 (추가 이득 없음)\n\n', options: { fontSize: 15, color: COLORS.text_secondary } },
    { text: '예시: 두께 여유율\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '  규격 하한 15µm, 실측 20µm → 여유율 = (20−15)/15 = 33%\n  정규화 범위 0%→50% → 점수 = 33/50 × 100 = 66점', options: { fontSize: 15, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.3, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 64: 등급 경계값
function createSlide64() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4단계 등급: 프리미엄, 표준, 한계, 불합격');
  addStyledTable(slide,
    ['등급', 'ARI 범위', '의미', '출하 적합 환경'],
    [
      [{ text: 'A (Premium)', options: { bold: true, color: '27AE60' } }, '85 ~ 100', '전 항목 우수', '열대·고습·가혹 환경'],
      [{ text: 'B (Standard)', options: { bold: true, color: COLORS.accent_blue } }, '65 ~ 84', '대부분 양호', '온대·일반 환경'],
      [{ text: 'C (Marginal)', options: { bold: true, color: COLORS.accent_yellow } }, '50 ~ 64', 'Gate 통과, 여유 적음', '내부 사용, 공정 개선 대상'],
      [{ text: 'F (Fail)', options: { bold: true, color: COLORS.accent_red } }, '0 ~ 49', 'Gate 미통과 또는 Score 미달', '출하 부적합'],
    ],
    { y: 1.8 }
  );
  slide.addShape('roundRect', { x: 0.6, y: 4.5, w: 12.13, h: 2.0, rectRadius: 0.08, fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1 } });
  slide.addText('⚠️ 경계값 85/65/50은 임의 설정입니다.\n초기에는 경계값 없이 ARI 원점수만 기록하고, 3~6개월 데이터 축적 후 설정을 권장합니다.', {
    x: 0.8, y: 4.7, w: 11.73, h: 1.6,
    fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow, lineSpacingMultiple: 1.4
  });
  addPageNumber(slide);
}

// Slide 65: 환경 프로파일
function createSlide65() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '동남아 출하 제품은 봉공 가중치를 높이고 내식성 시험을 강화한다');
  addStyledTable(slide,
    ['조정 항목', '기본 프로파일', '동남아 프로파일', '변경 근거'],
    [
      ['봉공 가중치', '30%', '35%', '봉공 불량 → 고습에서 연속 부식'],
      ['내식성 시험', '인공땀 24시간', '인공땀 72시간 (37°C)', '장기 땀 접촉 시뮬레이션'],
      ['내식성 가중치', '25%', '30%', '필드 불량 주 원인'],
      ['외관 가중치', '15%', '10%', '상대적 중요도 감소'],
      ['기계적 가중치', '10%', '5%', '상대적 중요도 감소'],
      ['Gate G2 강화', 'QUALANOD 기준', '어드미턴스 ≤ 10µS/cm²', '봉공 품질 엄격화'],
      ['추가 자격 시험', '—', '순환 습열 21일', '열대 사이클 시뮬레이션'],
    ],
    { y: 1.8, rowH: [0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] }
  );
  addPageNumber(slide);
}

// Slide 66: Tier 체계
function createSlide66() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '시험을 3단계로 나누어 현실적으로 운영한다');
  const cards = [
    { title: 'Tier 1: 전수 검사 (100%)', body: '비파괴 검사만 포함\n• 와전류 두께 (10초)\n• 어드미턴스 (1~2분)\n• 색차·광택·육안 (30초)\n\n→ Gate G1~G3 + Score S1, S3, S4\n→ 부분 ARI 즉시 산출 가능\n   (가중치 합 65%)' },
    { title: 'Tier 2: 로트 샘플링 (n=3~5)', body: '파괴 시험 허용\n• 산 용해 (30분)\n• 경도 Knoop (10분)\n• 인공땀 침지 (24~72시간)\n\n→ Score S2, S5 추가\n→ 완전 ARI 산출' },
    { title: 'Tier 3: 자격 인증 (연 1~2회)', body: '심층 검증\n• 전체 EIS (30분/시편)\n• 염수분무 (336시간)\n• 순환 습열 (21일)\n• 현미경 단면 (2시간)\n\n→ ARI에 직접 포함 안 함\n→ 프로파일 가중치 유효성 검증' },
  ];
  const positions = [{ x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 }];
  cards.forEach((card, i) => {
    addCard(slide, { x: positions[i].x, y: positions[i].y, w: 3.843, h: 4.9, ...card, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 67: Section 9 - 위험 관리
function createSlide67() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('09', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('지수가 실패하는 5가지\n시나리오와 대응책', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('위험 관리와 대안 검토', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 68: 실패 모드
function createSlide68() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가중치 오류부터 인증 대체 오해까지 — 실패 모드와 방어책');
  addStyledTable(slide,
    ['실패 모드', '설명', '방어책'],
    [
      ['가중치 오류\n→ 위양성', '봉공 불량인데 두께·외관이 우수\n→ 종합 합격', 'Gate에서 봉공 차단 (G2)'],
      ['점수 조작\n(gaming)', '공급자가 Score 높은 항목만 최적화', '정기 Tier 3 자격 검증'],
      ['프로파일 부적합', '소비전자 가중치를 항공 부품에 적용', 'ARI 보고서에 프로파일 필수 기재'],
      ['지수 맹신', 'ARI 숫자만 보고 개별 항목 무시', '보고서에 개별 원점수 병기'],
      ['인증 대체 오해', 'ARI 높으면 인증 불합격도 출하', 'Stage 0(인증 확인)으로 구조적 차단'],
    ],
    { y: 1.8, rowH: [0.4, 0.8, 0.8, 0.8, 0.8, 0.8] }
  );
  addPageNumber(slide);
}

// Slide 69: 대안 3가지
function createSlide69() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '지수 대신 고려할 수 있는 3가지 대안');
  const cards = [
    { title: '대안 1: 핵심지표 대시보드', body: '지수화 없이 개별 수치를 시각화\n• 두께, 봉공, ΔE 등을 그래프로\n• 이상치를 즉시 시각 확인\n\n장점: 도입 비용 최저\n단점: "단일 수치 비교" 불가' },
    { title: '대안 2: 등급 세분화', body: 'AAMA 611의 Class I/II를\n5~6등급으로 확장\n\n장점: 기존 체계와 호환\n단점: 연속적 점수 아닌\n이산적 분류에 그침' },
    { title: '대안 3: 통계적 공정 관리', body: '개별 파라미터의\nCpk(공정능력지수) 모니터링\n\n장점: 통계적 기반 견고\n단점: 항목 간 종합 판단 불가,\n현장 이해도 요구 높음' },
  ];
  const positions = [{ x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 }];
  cards.forEach((card, i) => {
    addCard(slide, { x: positions[i].x, y: positions[i].y, w: 3.843, h: 4.9, ...card, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 70: 조직적 비용
function createSlide70() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '지수 도입에는 장비, 인력, 시스템 투자가 필요하다');
  slide.addText([
    { text: '기술적 설계만으로는 부족하다 — 조직적 비용을 고려해야 한다\n\n', options: { fontSize: 16, bold: true, color: COLORS.text_primary } },
    { text: '1. 교육 비용\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   EIS 해석, 가중치 이해, 점수 산출 프로세스에 대한 QC 인력 교육\n   특히 EIS는 전기화학 전문 지식이 필요\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '2. 시스템 구축\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   데이터 수집 → 정규화 → 가중합 → 판정의 자동화 파이프라인\n   초기에는 Excel로 가능하나, 확장 시 전용 시스템 필요\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '3. 변경 관리\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   Go/No-Go에서 종합 지수로의 전환에 따른 조직 저항\n   고객-공급자 간 ARI 기준 합의 필요\n\n', options: { fontSize: 14, color: COLORS.text_secondary } },
    { text: '4. 가중치 유지보수\n', options: { fontSize: 16, bold: true, color: COLORS.accent_blue } },
    { text: '   용도별·합금별·봉공별 가중치 관리 및 정기 업데이트 프로세스', options: { fontSize: 14, color: COLORS.text_secondary } },
  ], {
    x: 0.6, y: 1.8, w: 12.13, h: 5.0,
    lineSpacingMultiple: 1.1, valign: 'top'
  });
  addPageNumber(slide);
}

// Slide 71: Section 10 - 도입 로드맵
function createSlide71() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('10', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('3단계로\n점진 도입한다', { x: 6.0, y: 2.5, w: 6.73, h: 1.2, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary, lineSpacingMultiple: 1.2 });
  slide.addText('파일럿 → 교정 → 확장', { x: 6.0, y: 3.9, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide);
}

// Slide 72: 로드맵 Timeline
function createSlide72() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '파일럿 → 교정 → 확장의 3단계 로드맵');
  slide.addShape('rect', { x: 0.6, y: 1.8, w: 0.06, h: 5.0, fill: { color: COLORS.accent_blue } });
  const items = [
    { step: 'Phase 1 (3~6개월)', title: '파일럿', desc: '범위: 소비전자 외장, 6063 합금, 열수 봉공\nTier 1만으로 부분 ARI 운영 (경계값 미설정, 원점수만 기록)\n동시에 필드 불량 데이터와 ARI 상관 수집' },
    { step: 'Phase 2 (6~12개월)', title: '가중치 교정', desc: 'Phase 1 데이터로 ARI-필드불량 상관 분석\n전문가 합의로 가중치 확정, 등급 경계값 설정\n환경 프로파일 차등화, Tier 2 추가하여 완전 ARI 산출' },
    { step: 'Phase 3 (12개월+)', title: '확장', desc: '다른 합금(6061, 7075), 봉공 방식(니켈, 냉간)으로 확장\n용도별 프로파일(항공, 건축, 의료기기) 개발\n공급자 간 ARI 벤치마킹 체계 구축' },
  ];
  items.forEach((item, i) => {
    const y = 1.8 + i * 1.7;
    slide.addShape('ellipse', { x: 0.515, y: y + 0.12, w: 0.23, h: 0.23, fill: { color: COLORS.accent_blue } });
    slide.addText(item.step, { x: 1.0, y: y, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: COLORS.accent_blue });
    slide.addText(item.title, { x: 1.0, y: y + 0.35, w: 3.5, h: 0.35, fontSize: 16, bold: true, color: COLORS.text_primary });
    slide.addText(item.desc, { x: 4.8, y: y, w: 7.93, h: 1.4, fontSize: 13, color: COLORS.text_secondary, lineSpacingMultiple: 1.4, valign: 'top' });
    if (i < items.length - 1) slide.addShape('line', { x: 1.0, y: y + 1.55, w: 11.73, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  });
  addPageNumber(slide);
}

// Slide 73: 비용 추정
function createSlide73() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '단계별 투자 비용과 필요 장비');
  addStyledTable(slide,
    ['항목', 'Phase 1 (파일럿)', 'Phase 2 (교정)', 'Phase 3 (확장)'],
    [
      ['장비', '와전류 게이지 +\nLCR 미터 +\n분광측색기\n(~$5,000)', '인공땀 침지 세트 +\n미소경도계\n(~$15,000)', '포텐시오스탯 +\n습열 챔버\n(~$30,000)'],
      ['인력', 'QC 담당 1명 교육\n(1주)', 'QC + 품질 엔지니어\n(2주)', 'EIS 전문가 양성\n또는 외주'],
      ['시스템', 'Excel 기반 기록', '데이터베이스 +\n대시보드', '자동화 파이프라인'],
    ],
    { y: 1.8, rowH: [0.45, 1.3, 1.0, 0.8] }
  );
  slide.addText('→ Phase 1은 $5,000 + 1주 교육으로 시작 가능. 즉시 실행 가능한 범위부터 시작한다.', {
    x: 0.6, y: 6.0, w: 12.13, h: 0.5,
    fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan
  });
  addPageNumber(slide);
}

// Slide 74: 후속 질문
function createSlide74() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '아직 답하지 못한 3가지 후속 질문');
  const cards = [
    { title: '시험 항목 간 상관 데이터', body: '두께, 경도, 내마모성, 봉공 간\n상관 계수를 실측해야 한다.\n\n높은 상관이면 주성분 분석으로\n차원 축소 가능.\n독립적이면 모든 항목에\n개별 가중치가 필요.' },
    { title: '아노다이징 전용 임피던스 임계값', body: '유기코팅의 10⁸/10⁶ 기준이\n아노다이징에서 어떻게 변환되는지\n직접 검증 필요.\n\n합금별·봉공 방식별\n독립적 기준값 확보가 핵심.' },
    { title: '동남아 필드 불량의 근본 원인', body: '실제 반품/불만 데이터에서\n봉공 불량, 세척 잔류물,\n합금 결함, 물류 결로의\n비율을 파악해야 한다.\n\n이것이 ARI 가중치의\n실증적 근거가 된다.' },
  ];
  const positions = [{ x: 0.6, y: 1.8 }, { x: 4.743, y: 1.8 }, { x: 8.886, y: 1.8 }];
  cards.forEach((card, i) => {
    addCard(slide, { x: positions[i].x, y: positions[i].y, w: 3.843, h: 4.9, ...card, accentColor: CHART_STYLE.colors[i] });
  });
  addPageNumber(slide);
}

// Slide 75: Closing
function createSlide75() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '핵심 결론 3가지와 다음 단계');
  const points = [
    'Gate(관문) + Score(점수) 2단계 구조로 아노다이징 강건성 지수(ARI)를 설계할 수 있다. 기존 인증을 대체하지 않고 합격 제품 간 품질 차별화를 가능하게 한다.',
    '핵심 임계값과 가중치는 검증 전 초안이다. 소비전자·6063 합금·열수 봉공으로 범위를 좁혀 3~6개월 파일럿 후 현장 데이터로 교정해야 한다.',
    '동남아 환경의 핵심 대응은 봉공 품질 강화이다. 고습도에서 땀 잔류물이 마르지 않아 연속 부식이 발생하므로, 봉공 가중치를 높이고 어드미턴스 기준을 엄격화한다.',
  ];
  points.forEach((point, i) => {
    const y = 1.9 + i * 1.4;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.1, w: 0.45, h: 0.45, fill: { color: COLORS.accent_blue } });
    slide.addText(`${i + 1}`, { x: 0.8, y: y + 0.1, w: 0.45, h: 0.45, fontSize: 16, bold: true, color: COLORS.text_on_dark, align: 'center', valign: 'middle' });
    slide.addText(point, { x: 1.5, y: y, w: 11.23, h: 1.2, fontSize: 15, color: COLORS.text_primary, valign: 'top', lineSpacingMultiple: 1.4 });
  });
  const divY = 1.9 + 3 * 1.4 + 0.3;
  slide.addShape('line', { x: 0.6, y: divY, w: 12.13, h: 0, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('다음 단계: Phase 1 파일럿 범위 확정 → 장비 구매($5,000) → 3개월 데이터 수집 시작', {
    x: 0.6, y: divY + 0.2, w: 12.13, h: 0.5,
    fontSize: 14, fontFace: 'Pretendard', bold: true, color: COLORS.accent_blue, align: 'center'
  });
  addPageNumber(slide);
}

// ===== 전체 실행 =====
createSlide01(); // Title
createSlide02(); // Section 1
createSlide03(); // Go/No-Go 한계
createSlide04(); // 합격 내 차이
createSlide05(); // 60년간 부재 이유
createSlide06(); // 지수 가치 조건
createSlide07(); // Quote
createSlide08(); // Section 2
createSlide09(); // MIL-PRF-8625
createSlide10(); // QUALANOD
createSlide11(); // AAMA 611
createSlide12(); // GSB
createSlide13(); // 4대 인증 비교
createSlide14(); // 종합 점수 없음
createSlide15(); // OEM 비공개
createSlide16(); // Section 3
createSlide17(); // Demerit Scoring
createSlide18(); // Tupy SQI
createSlide19(); // Tupy 감점 테이블
createSlide20(); // 4가지 Gate+Score
createSlide21(); // HACCP 상세
createSlide22(); // Gate 설계 원칙
createSlide23(); // Section 4
createSlide24(); // EIS 개념
createSlide25(); // 2개 층 구조
createSlide26(); // 피팅-프리 3가지
createSlide27(); // |Z| 상세
createSlide28(); // CDI% 설명
createSlide29(); // f_b 설명
createSlide30(); // EEC 지표
createSlide31(); // 도메인 검증
createSlide32(); // Critic 경고
createSlide33(); // Section 5
createSlide34(); // ISO 2931
createSlide35(); // ISO vs EIS
createSlide36(); // 멀티사인
createSlide37(); // 저가 장비
createSlide38(); // 장비 비교
createSlide39(); // AutoEIS
createSlide40(); // 미해결 과제
createSlide41(); // EIS 위치 결론
createSlide42(); // Section 6
createSlide43(); // 내식성 시험
createSlide44(); // 봉공 시험
createSlide45(); // 기계적 시험
createSlide46(); // 두께/외관
createSlide47(); // 상관 분석
createSlide48(); // EIS-염수분무
createSlide49(); // Section 7
createSlide50(); // 동남아 조건
createSlide51(); // 땀 조성
createSlide52(); // 핵심 메커니즘
createSlide53(); // 5단계 열화
createSlide54(); // 변색 메커니즘
createSlide55(); // 에지 박리
createSlide56(); // 숨은 변수
createSlide57(); // 가속시험
createSlide58(); // Section 8
createSlide59(); // 위치 설정
createSlide60(); // ARI 전체 구조
createSlide61(); // Gate 상세
createSlide62(); // Score 상세
createSlide63(); // 정규화
createSlide64(); // 등급 경계값
createSlide65(); // 환경 프로파일
createSlide66(); // Tier 체계
createSlide67(); // Section 9
createSlide68(); // 실패 모드
createSlide69(); // 대안 3가지
createSlide70(); // 조직적 비용
createSlide71(); // Section 10
createSlide72(); // 로드맵
createSlide73(); // 비용 추정
createSlide74(); // 후속 질문
createSlide75(); // Closing

// 저장
const outputPath = path.join(__dirname, 'anodizing-robustness-index.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`저장 완료: ${outputPath}`))
  .catch(err => console.error('저장 실패:', err));
