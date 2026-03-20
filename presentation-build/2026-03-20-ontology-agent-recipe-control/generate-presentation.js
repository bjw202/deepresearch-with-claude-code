const PptxGenJS = require('pptxgenjs');

// ===== 색상 시스템 =====
const COLORS = {
  bg_primary:   'FFFFFF',
  bg_secondary: 'F5F7FA',
  bg_dark:      '1A1F36',
  text_primary:   '1A1F36',
  text_secondary: '4A5568',
  text_tertiary:  '718096',
  text_on_dark:   'FFFFFF',
  accent_blue:    '4A7BF7',
  accent_cyan:    '00D4AA',
  accent_yellow:  'FFB020',
  accent_red:     'FF6B6B',
  accent_purple:  '8B5CF6',
};

// ===== 폰트 상수 =====
const FONTS = {
  title:    { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body:     { fontFace: 'Pretendard', bold: false },
  caption:  { fontFace: 'Pretendard Light', bold: false },
  serif:    { fontFace: 'ChosunNm', bold: false },
  kpi:      { fontFace: 'Pretendard Black', bold: true },
  deco:     { fontFace: 'Pretendard Thin', bold: false },
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
  cellAlt: {
    fontFace: 'Pretendard',
    fontSize: 11,
    color: COLORS.text_secondary,
    fill: { color: COLORS.bg_secondary },
    valign: 'middle'
  },
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
  base: {
    showTitle: true,
    titleFontFace: 'Pretendard',
    titleFontSize: 14,
    titleColor: COLORS.text_primary,
  },
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

// ===== 헬퍼 함수 =====
function addTitleBar(slide, title, subtitle) {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 10, h: 0.6,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.25, w: 10, h: 0.4,
      fontSize: 16, fontFace: 'Pretendard',
      color: COLORS.text_tertiary
    });
  }
}

function addStyledTable(slide, headers, dataRows, opts) {
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
    color: COLORS.text_primary
  });
  slide.addText(body, {
    x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.75,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });
}

function addPageNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right'
  });
}

const helpers = { addTitleBar, addStyledTable, addCard, addPageNumber };

// ===== 프레젠테이션 생성 =====
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

// Part 1: 슬라이드 1~28
const part1 = require('./generate-slides-part1.js');
part1(pptx, COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE, helpers);

// Part 2: 슬라이드 29~57
const part2 = require('./generate-slides-part2.js');
part2(pptx, COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE, helpers);

// ===== 저장 =====
const path = require('path');
const outputPath = path.join(__dirname, 'Ontology-LLM-Recipe-Control-System.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log('저장 완료: ' + outputPath))
  .catch(err => console.error('저장 실패:', err));
