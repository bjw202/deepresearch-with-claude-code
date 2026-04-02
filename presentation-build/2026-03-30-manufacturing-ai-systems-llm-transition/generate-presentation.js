// === Part 1 시작 ===

const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
const TOTAL_SLIDES = 31;

const COLORS = {
  bg_primary: 'FFFFFF',
  bg_secondary: 'F5F7FA',
  bg_dark: '1A1F36',
  text_primary: '1A1F36',
  text_secondary: '4A5568',
  text_tertiary: '94A3B8',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7',
  accent_cyan: '00D4AA',
  accent_yellow: 'FFB020',
  accent_red: 'FF6B6B',
  accent_purple: '8B5CF6'
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
  header: { bold: true, fill: { color: COLORS.bg_dark }, color: COLORS.text_on_dark, fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle' },
  cell: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, valign: 'middle' },
  cellRight: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, align: 'right', valign: 'middle' },
  cellAlt: { fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_secondary, fill: { color: COLORS.bg_secondary }, valign: 'middle' },
  cellTotal: { bold: true, fontFace: 'Pretendard', fontSize: 11, color: COLORS.text_primary, border: [{ type: 'solid', pt: 1.5, color: COLORS.text_primary }, null, null, null], valign: 'middle' }
};

const TABLE_OPTIONS = {
  x: 0.6, y: 1.8, w: 12.13,
  border: { type: 'solid', pt: 0.5, color: 'E2E8F0' },
  autoPage: false,
  margin: [5, 8, 5, 8]
};

const CHART_STYLE = {
  base: {
    showTitle: true, titleFontFace: 'Pretendard', titleFontSize: 14, titleColor: COLORS.text_primary,
    showLegend: true, legendFontFace: 'Pretendard', legendFontSize: 9, legendColor: COLORS.text_secondary,
    catAxisLabelFontFace: 'Pretendard', catAxisLabelFontSize: 10, catAxisLabelColor: COLORS.text_tertiary,
    valAxisLabelFontFace: 'Pretendard', valAxisLabelFontSize: 10, valAxisLabelColor: COLORS.text_tertiary
  },
  colors: ['4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8']
};

// ===== 헬퍼 함수 =====

function addTitleBar(slide, title, subtitle = '') {
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, charSpacing: -0.3, autoFit: true
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
    text: h,
    options: {
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
  if (type === 'BAR') {
    defaults.barGapWidthPct = 80;
    defaults.catAxisOrientation = 'minMax';
    defaults.valAxisOrientation = 'minMax';
  }
  if (type === 'LINE') {
    defaults.lineDataSymbol = 'circle';
    defaults.lineDataSymbolSize = 8;
    defaults.lineSmooth = false;
  }
  if (type === 'PIE' || type === 'DOUGHNUT') {
    defaults.showPercent = true;
    defaults.showLegend = true;
    defaults.legendPos = 'b';
    defaults.chartColors = CHART_STYLE.colors.slice(0, chartData[0]?.values?.length || 6);
  }
  slide.addChart(typeMap[type], chartData, defaults);
}

function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    line: { color: 'E2E8F0', width: 0.5 }
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

function addPageNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right'
  });
}

function calcTierCoords(tierCount, opts = {}) {
  const startY  = opts.startY  || 1.8;
  const endY    = opts.endY    || 6.8;
  const maxW    = opts.maxW    || 12.13;
  const minW    = opts.minW    || 4.0;
  const centerX = opts.centerX || 6.665;
  const gap     = opts.gap     || 0.15;
  const totalH  = endY - startY;
  const tierH   = (totalH - gap * (tierCount - 1)) / tierCount;
  const tiers   = [];
  for (let i = 0; i < tierCount; i++) {
    const ratio = i / (tierCount - 1 || 1);
    const w     = maxW - ratio * (maxW - minW);
    const x     = centerX - w / 2;
    const y     = startY + i * (tierH + gap);
    tiers.push({ x, y, w, h: tierH });
  }
  return tiers;
}

function addProcessFlow(slide, steps) {
  const stepW = (12.13 - 0.3 * (steps.length - 1)) / steps.length;
  const boxY  = 1.8;
  const boxH  = 4.8;

  steps.forEach((step, i) => {
    const x     = 0.6 + i * (stepW + 0.3);
    const color = step.accentColor || CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x, y: boxY, w: stepW, h: boxH,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });

    slide.addShape('rect', {
      x: x + 0.02, y: boxY, w: stepW - 0.04, h: 0.06,
      fill: { color: color }
    });

    slide.addText(String(i + 1), {
      x: x + 0.15, y: boxY + 0.15, w: 0.4, h: 0.4,
      fontSize: 13, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: color, align: 'center', valign: 'middle'
    });

    slide.addText(step.title, {
      x: x + 0.15, y: boxY + 0.6, w: stepW - 0.3, h: 0.5,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    slide.addText(step.body, {
      x: x + 0.15, y: boxY + 1.15, w: stepW - 0.3, h: boxH - 1.35,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });

    if (i < steps.length - 1) {
      slide.addText('→', {
        x: x + stepW, y: boxY + boxH / 2 - 0.25, w: 0.3, h: 0.5,
        fontSize: 18, fontFace: 'Pretendard',
        color: COLORS.text_tertiary, align: 'center', valign: 'middle'
      });
    }
  });
}

function addFunnel(slide, tiers) {
  const coords = calcTierCoords(tiers.length, { minW: 4.0 });

  tiers.forEach((tier, i) => {
    const { x, y, w, h } = coords[i];
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x, y, w, h,
      rectRadius: 0.08,
      fill: { color: color },
      line: { color: color, width: 0 }
    });

    const label = tier.value ? `${tier.label}  ${tier.value}` : tier.label;
    slide.addText(label, {
      x, y, w, h,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
    });
  });
}

function addMatrix(slide, quadrants, axisLabels) {
  const CARD_2X2 = [
    { x: 0.6,  y: 1.8, w: 5.9, h: 2.45 },
    { x: 6.83, y: 1.8, w: 5.9, h: 2.45 },
    { x: 0.6,  y: 4.4, w: 5.9, h: 2.45 },
    { x: 6.83, y: 4.4, w: 5.9, h: 2.45 }
  ];

  quadrants.forEach((q, i) => {
    const pos   = CARD_2X2[i];
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });

    slide.addShape('rect', {
      x: pos.x + 0.02, y: pos.y, w: pos.w - 0.04, h: 0.06,
      fill: { color: color }
    });

    slide.addText(q.title, {
      x: pos.x + 0.2, y: pos.y + 0.15, w: pos.w - 0.4, h: 0.4,
      fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    slide.addText(q.body, {
      x: pos.x + 0.2, y: pos.y + 0.6, w: pos.w - 0.4, h: pos.h - 0.8,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });
  });

  slide.addShape('rect', {
    x: 6.615, y: 1.8, w: 0.01, h: 5.05,
    fill: { color: 'E2E8F0' }
  });
  slide.addShape('rect', {
    x: 0.6, y: 4.3, w: 12.13, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  if (axisLabels?.x) {
    slide.addText(axisLabels.x, {
      x: 0.6, y: 7.0, w: 12.13, h: 0.3,
      fontSize: 11, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });
  }
  if (axisLabels?.y) {
    slide.addText(axisLabels.y, {
      x: 0.0, y: 1.8, w: 0.55, h: 5.05,
      fontSize: 11, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary, align: 'center', valign: 'middle',
      rotate: 270
    });
  }
}

function addPyramid(slide, tiers) {
  const coords = calcTierCoords(tiers.length, { minW: 4.0 }).reverse();

  tiers.forEach((tier, i) => {
    const { x, y, w, h } = coords[i];
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x, y, w, h,
      rectRadius: 0.08,
      fill: { color: color },
      line: { color: color, width: 0 }
    });

    const text = tier.description
      ? [{ text: tier.label, options: { bold: true } }, { text: `  ${tier.description}` }]
      : tier.label;
    slide.addText(text, {
      x, y, w, h,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
    });
  });
}

function addVenn(slide, circles, intersection) {
  const r      = 3.2;
  const cy     = 4.3;
  const cx1    = 4.3;
  const cx2    = 9.1;
  const colors = [CHART_STYLE.colors[0], CHART_STYLE.colors[1]];

  slide.addShape('ellipse', {
    x: cx1 - r / 2, y: cy - r / 2, w: r, h: r,
    fill: { color: colors[0], transparency: 40 },
    line: { color: colors[0], width: 1 }
  });

  slide.addShape('ellipse', {
    x: cx2 - r / 2, y: cy - r / 2, w: r, h: r,
    fill: { color: colors[1], transparency: 40 },
    line: { color: colors[1], width: 1 }
  });

  slide.addText(circles[0]?.description
    ? `${circles[0].label}\n${circles[0].description}`
    : (circles[0]?.label || ''), {
    x: cx1 - r / 2, y: cy - 0.6, w: r * 0.6, h: 1.2,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
  });

  slide.addText(circles[1]?.description
    ? `${circles[1].label}\n${circles[1].description}`
    : (circles[1]?.label || ''), {
    x: cx2 - r * 0.1, y: cy - 0.6, w: r * 0.6, h: 1.2,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
  });

  if (intersection) {
    const intX = (cx1 + cx2) / 2;
    const intText = intersection.description
      ? `${intersection.label}\n${intersection.description}`
      : intersection.label;
    slide.addText(intText, {
      x: intX - 1.0, y: cy - 0.6, w: 2.0, h: 1.2,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, align: 'center', valign: 'middle', autoFit: true
    });
  }
}

function addBeforeAfter(slide, before, after) {
  const panelY = 1.8;
  const panelH = 5.05;
  const panelW = 5.9;

  slide.addShape('roundRect', {
    x: 0.6, y: panelY, w: panelW, h: panelH,
    rectRadius: 0.1,
    fill: { color: COLORS.bg_dark },
    line: { color: COLORS.bg_dark, width: 0 }
  });

  slide.addText('BEFORE', {
    x: 0.8, y: panelY + 0.15, w: 1.5, h: 0.3,
    fontSize: 9, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, charSpacing: 1.5
  });

  slide.addText(before.title, {
    x: 0.8, y: panelY + 0.5, w: panelW - 0.4, h: 0.5,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark, autoFit: true
  });

  slide.addShape('rect', {
    x: 0.8, y: panelY + 1.1, w: panelW - 0.4, h: 0.01,
    fill: { color: '3A4A5E' }
  });

  const beforeText = before.bullets.map(b => `• ${b}`).join('\n');
  slide.addText(beforeText, {
    x: 0.8, y: panelY + 1.25, w: panelW - 0.4, h: panelH - 1.45,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_on_dark,
    lineSpacingMultiple: 1.5, valign: 'top', autoFit: true
  });

  slide.addShape('roundRect', {
    x: 6.83, y: panelY, w: panelW, h: panelH,
    rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    line: { color: COLORS.accent_blue, width: 1.5 }
  });

  slide.addText('AFTER', {
    x: 7.03, y: panelY + 0.15, w: 1.5, h: 0.3,
    fontSize: 9, fontFace: FONTS.caption.fontFace,
    color: COLORS.accent_blue, charSpacing: 1.5
  });

  slide.addText(after.title, {
    x: 7.03, y: panelY + 0.5, w: panelW - 0.4, h: 0.5,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, autoFit: true
  });

  slide.addShape('rect', {
    x: 7.03, y: panelY + 1.1, w: panelW - 0.4, h: 0.01,
    fill: { color: COLORS.accent_blue }
  });

  const afterText = after.bullets.map(b => `• ${b}`).join('\n');
  slide.addText(afterText, {
    x: 7.03, y: panelY + 1.25, w: panelW - 0.4, h: panelH - 1.45,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, valign: 'top', autoFit: true
  });

  slide.addShape('rect', {
    x: 6.615, y: panelY, w: 0.01, h: panelH,
    fill: { color: 'E2E8F0' }
  });
}

function addRoadmap(slide, milestones) {
  const lineY  = 4.3;
  const lineX  = 0.6;
  const lineW  = 12.13;
  const dotR   = 0.15;
  const blockW = lineW / milestones.length;

  slide.addShape('rect', {
    x: lineX, y: lineY - 0.01, w: lineW, h: 0.01,
    fill: { color: COLORS.accent_blue }
  });

  milestones.forEach((m, i) => {
    const cx    = lineX + blockW * i + blockW / 2;
    const above = i % 2 === 0;

    slide.addShape('ellipse', {
      x: cx - dotR, y: lineY - dotR, w: dotR * 2, h: dotR * 2,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] },
      line: { color: 'FFFFFF', width: 1 }
    });

    const connH = 0.5;
    slide.addShape('rect', {
      x: cx - 0.005, y: above ? lineY - dotR - connH : lineY + dotR, w: 0.01, h: connH,
      fill: { color: 'CBD5E1' }
    });

    slide.addText(m.date, {
      x: cx - blockW / 2 * 0.9, y: above ? lineY - dotR - connH - 0.25 : lineY + dotR + connH + 0.02,
      w: blockW * 0.9, h: 0.25,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    slide.addText(m.title, {
      x: cx - blockW / 2 * 0.9, y: above ? lineY - dotR - connH - 0.6 : lineY + dotR + connH + 0.28,
      w: blockW * 0.9, h: 0.35,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, align: 'center', autoFit: true
    });

    if (m.description) {
      slide.addText(m.description, {
        x: cx - blockW / 2 * 0.9, y: above ? lineY - dotR - connH - 1.3 : lineY + dotR + connH + 0.65,
        w: blockW * 0.9, h: 0.65,
        fontSize: 11, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, align: 'center',
        lineSpacingMultiple: 1.3, valign: 'top', autoFit: true
      });
    }
  });
}

function addStatHighlight(slide, { number, label, context, trend }) {
  slide.addText(number, {
    x: 0.6, y: 2.2, w: 12.13, h: 1.8,
    fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
    color: COLORS.text_primary, align: 'center', valign: 'middle', autoFit: true
  });

  slide.addShape('rect', {
    x: 5.165, y: 4.1, w: 3.0, h: 0.01,
    fill: { color: COLORS.accent_blue }
  });

  slide.addText(label, {
    x: 0.6, y: 4.2, w: 12.13, h: 0.5,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_secondary, align: 'center', autoFit: true
  });

  if (context) {
    slide.addText(context, {
      x: 0.6, y: 4.85, w: 12.13, h: 0.4,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center', autoFit: true
    });
  }

  if (trend) {
    const isPositive = /[▲+]/.test(trend);
    slide.addText(trend, {
      x: 0.6, y: 5.35, w: 12.13, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: isPositive ? '00D4AA' : 'FF6B6B', align: 'center'
    });
  }
}

function addIconGrid(slide, items, layout) {
  const CARD_2X3 = [
    { x: 0.6,  y: 1.8,  w: 3.8,  h: 2.35 },
    { x: 4.73, y: 1.8,  w: 3.8,  h: 2.35 },
    { x: 8.86, y: 1.8,  w: 3.87, h: 2.35 },
    { x: 0.6,  y: 4.35, w: 3.8,  h: 2.35 },
    { x: 4.73, y: 4.35, w: 3.8,  h: 2.35 },
    { x: 8.86, y: 4.35, w: 3.87, h: 2.35 }
  ];

  let positions;
  if (layout === '3x3') {
    const cols  = 3;
    const rows  = 3;
    const cellW = 12.13 / cols;
    const cellH = 5.05 / rows;
    positions   = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({
          x: 0.6 + c * cellW,
          y: 1.8  + r * cellH,
          w: cellW - 0.1,
          h: cellH - 0.1
        });
      }
    }
  } else {
    positions = CARD_2X3;
  }

  items.forEach((item, i) => {
    if (i >= positions.length) return;
    const pos   = positions[i];
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });

    slide.addText(item.icon, {
      x: pos.x + 0.15, y: pos.y + 0.15, w: 0.55, h: 0.55,
      fontSize: 22, fontFace: 'Pretendard',
      color: color, align: 'center', valign: 'middle'
    });

    slide.addText(item.title, {
      x: pos.x + 0.15, y: pos.y + 0.75, w: pos.w - 0.3, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    slide.addText(item.body, {
      x: pos.x + 0.15, y: pos.y + 1.2, w: pos.w - 0.3, h: pos.h - 1.35,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.35, valign: 'top', autoFit: true
    });
  });
}

function addLayeredStack(slide, layers) {
  const baseX  = 1.5;
  const baseY  = 1.8;
  const layerW = 10.0;
  const layerH = 0.9;
  const offsetX = 0.18;
  const offsetY = 0.12;
  const gap    = 0.5;

  layers.forEach((layer, i) => {
    const x = baseX + i * offsetX;
    const y = baseY + i * (layerH + gap + offsetY);
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    slide.addShape('roundRect', {
      x: x + 0.1, y: y + 0.08, w: layerW, h: layerH,
      rectRadius: 0.08,
      fill: { color: 'E2E8F0' },
      line: { color: 'E2E8F0', width: 0 }
    });

    slide.addShape('roundRect', {
      x, y, w: layerW, h: layerH,
      rectRadius: 0.08,
      fill: { color: color },
      line: { color: color, width: 0 }
    });

    slide.addText(layer.title, {
      x: x + 0.3, y, w: 3.0, h: layerH,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: 'FFFFFF', valign: 'middle', autoFit: true
    });

    slide.addShape('rect', {
      x: x + 3.4, y: y + 0.2, w: 0.01, h: layerH - 0.4,
      fill: { color: 'FFFFFF' }
    });

    slide.addText(layer.body, {
      x: x + 3.6, y, w: layerW - 3.9, h: layerH,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: 'FFFFFF', valign: 'middle', autoFit: true
    });
  });
}

function addComparisonTable(slide, features, options) {
  const CHECK = '✓';
  const CROSS = '✗';
  const colW  = (12.13 - 3.0) / options.length;

  const rows = [];

  const headerRow = [
    { text: '기능', options: { ...TABLE_STYLE.header, align: 'left' } },
    ...options.map(opt => ({ text: opt.name, options: { ...TABLE_STYLE.header, align: 'center' } }))
  ];
  rows.push(headerRow);

  features.forEach((feat, fi) => {
    const isAlt = fi % 2 === 1;
    const base  = isAlt ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    const row   = [
      { text: feat, options: { ...base } },
      ...options.map(opt => {
        const checked = opt.checks[fi];
        return {
          text: checked ? CHECK : CROSS,
          options: { ...base, align: 'center', bold: checked, color: checked ? '00A87A' : 'E53E3E' }
        };
      })
    ];
    rows.push(row);
  });

  const colWidths = [3.0, ...options.map(() => colW)];
  slide.addTable(rows, { ...TABLE_OPTIONS, colW: colWidths });
}

// ===== 슬라이드 함수 =====

// [01] 표지
function slide01_title() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 상단 accent 라인
  slide.addShape('rect', {
    x: 0.7, y: 1.6, w: 2.0, h: 0.07,
    fill: { color: COLORS.accent_blue }
  });

  // 메인 제목
  slide.addText('제조 AI 시스템의 동작 방식과\nLLM 전환 가능성', {
    x: 0.7, y: 1.8, w: 11.93, h: 2.4,
    fontSize: 48, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.2, autoFit: true
  });

  // 부제
  slide.addText('7개 기업 비교 분석  |  2026-03-30', {
    x: 0.7, y: 4.4, w: 11.93, h: 0.5,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: false,
    color: COLORS.text_tertiary
  });

  // 하단 장식 라인
  slide.addShape('rect', {
    x: 0.7, y: 5.2, w: 11.93, h: 0.01,
    fill: { color: '3A4A5E' }
  });

  // 조사 대상 태그
  const companies = ['TIGNIS', 'IMUBIT', 'Lam Research', 'Bosch', 'Siemens', 'Samsung', 'Intel'];
  slide.addText(companies.join('  ·  '), {
    x: 0.7, y: 5.4, w: 11.93, h: 0.4,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary, align: 'left'
  });
}

// [02] 조사 개요
function slide02_overview() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    '7개 기업의 AI 접근법은 제어루프 내 자율과 인간 보조 사이 스펙트럼에 분포한다'
  );

  // 조사 대상
  slide.addText('조사 대상', {
    x: 0.6, y: 1.85, w: 3.0, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, charSpacing: 1.0
  });
  slide.addText('TIGNIS  ·  IMUBIT  ·  Lam Research  ·  Bosch  ·  Siemens  ·  Samsung  ·  Intel', {
    x: 0.6, y: 2.2, w: 12.13, h: 0.5,
    fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });

  // 조사 범위
  slide.addText('조사 범위', {
    x: 0.6, y: 2.9, w: 3.0, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, charSpacing: 1.0
  });
  slide.addText('기술 아키텍처  +  LLM 전환 가능성', {
    x: 0.6, y: 3.25, w: 12.13, h: 0.5,
    fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });

  // 핵심 질문 3가지
  slide.addText('핵심 질문', {
    x: 0.6, y: 3.95, w: 3.0, h: 0.35,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, charSpacing: 1.0
  });

  const questions = [
    { num: '01', text: '각 시스템은 어떻게 동작하는가?' },
    { num: '02', text: 'LLM / 온톨로지로 전환할 가능성은?' },
    { num: '03', text: '우리 공정에는 어떤 시사점이 있는가?' },
  ];

  questions.forEach((q, i) => {
    const qY = 4.35 + i * 0.75;

    // 번호 뱃지
    slide.addShape('roundRect', {
      x: 0.6, y: qY, w: 0.45, h: 0.45,
      rectRadius: 0.08,
      fill: { color: COLORS.accent_blue },
      line: { color: COLORS.accent_blue, width: 0 }
    });
    slide.addText(q.num, {
      x: 0.6, y: qY, w: 0.45, h: 0.45,
      fontSize: 12, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    // 질문 텍스트
    slide.addText(q.text, {
      x: 1.2, y: qY + 0.03, w: 11.53, h: 0.42,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle'
    });
  });

  addPageNumber(slide, 2, TOTAL_SLIDES);
}

// [03] StatHighlight
function slide03_stat() {
  const slide = pptx.addSlide();

  addTitleBar(slide, 'PLC 50~100ms vs LLM 수초');

  addStatHighlight(slide, {
    number: '50ms  vs  수초',
    label: 'PLC 제어 루프 주기  vs  LLM 추론 시간',
    context: '가장 적극적인 Siemens조차 LLM은 보조 도구 수준 — 모든 기업에서 LLM은 제어 루프 밖에 있다'
  });

  addPageNumber(slide, 3, TOTAL_SLIDES);
}

// [04] 섹션 디바이더
function slide04_section() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 우 60% 흰색
  slide.addShape('rect', {
    x: 5.33, y: 0, w: 8.0, h: 7.5,
    fill: { color: COLORS.bg_primary }
  });

  // 좌측 섹션 번호
  slide.addText('SECTION 01', {
    x: 0.5, y: 2.8, w: 4.5, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, charSpacing: 2.0
  });

  // 좌측 메인 라벨
  slide.addText('현황', {
    x: 0.5, y: 3.25, w: 4.5, h: 1.0,
    fontSize: 40, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_on_dark
  });

  // 우측 accent 라인
  slide.addShape('rect', {
    x: 6.0, y: 2.5, w: 1.5, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });

  // 우측 제목
  slide.addText('제조 AI 시스템은\n어떻게 동작하는가', {
    x: 6.0, y: 2.7, w: 6.8, h: 1.8,
    fontSize: 32, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.2, autoFit: true
  });

  // 우측 서브텍스트
  slide.addText('7개 기업의 기술 아키텍처와 제어 방식', {
    x: 6.0, y: 4.6, w: 6.8, h: 0.5,
    fontSize: 16, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });
}

// [05] 2×2 매트릭스
function slide05_matrix() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    '성숙도와 LLM 전환 적극성으로 7개 기업이 3개 그룹으로 나뉜다'
  );

  // X축 라벨 (하단)
  slide.addText('← 파일럿                        AI 도입 수준                        프로덕션 →', {
    x: 0.6, y: 7.05, w: 12.13, h: 0.3,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });

  // Y축 라벨 (좌측, 세로)
  slide.addText('← ★☆☆  LLM 전환 적극성  ★★★ →', {
    x: 0.0, y: 1.8, w: 0.55, h: 5.05,
    fontSize: 10, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center', valign: 'middle',
    rotate: 270
  });

  // 중앙 분리선
  slide.addShape('rect', {
    x: 6.615, y: 1.8, w: 0.01, h: 5.05,
    fill: { color: 'E2E8F0' }
  });
  slide.addShape('rect', {
    x: 0.6, y: 4.3, w: 12.13, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  // 사분면 카드 [TL, TR, BL, BR]
  const CARD_2X2 = [
    { x: 0.6,  y: 1.8, w: 5.9, h: 2.45 }, // TL: 높은 LLM, 낮은 도입
    { x: 6.83, y: 1.8, w: 5.9, h: 2.45 }, // TR: 높은 LLM, 높은 도입
    { x: 0.6,  y: 4.4, w: 5.9, h: 2.45 }, // BL: 낮은 LLM, 낮은 도입
    { x: 6.83, y: 4.4, w: 5.9, h: 2.45 }  // BR: 낮은 LLM, 높은 도입
  ];

  const quadrants = [
    {
      pos: CARD_2X2[0], color: COLORS.accent_purple,
      label: '선도적 비전',
      title: 'Samsung',
      body: '전략 선언 + 초기 파일럿 단계\nNVIDIA AI Megafactory 구축 중\nLLM 전환 적극성: ★★☆'
    },
    {
      pos: CARD_2X2[1], color: COLORS.accent_cyan,
      label: '적극적 전환',
      title: 'Siemens · Bosch',
      body: 'Siemens: IFM 개발, LLM MCP 연결 (★★★)\nBosch: Co-Intelligence, Agentic AI (★★★)\n실배포 + LLM 통합 동시 진행 중'
    },
    {
      pos: CARD_2X2[2], color: COLORS.text_tertiary,
      label: '해당 없음',
      title: '—',
      body: '낮은 LLM 적극성 + 낮은 도입 수준\n해당 기업 없음'
    },
    {
      pos: CARD_2X2[3], color: COLORS.accent_blue,
      label: '검증된 ML',
      title: 'IMUBIT · TIGNIS · Lam · Intel',
      body: 'IMUBIT: 100+ 배포, Closed-loop (★★☆)\nLam Research: Nature 논문, HF-CL (★★☆)\nTIGNIS: R2R 제어, 물리 AI (★☆☆)\nIntel: 전수검사 ADC 90%+ (★☆☆)'
    }
  ];

  quadrants.forEach((q) => {
    const pos = q.pos;

    slide.addShape('roundRect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: pos.x + 0.02, y: pos.y, w: pos.w - 0.04, h: 0.06,
      fill: { color: q.color }
    });

    // 그룹 라벨
    slide.addText(q.label, {
      x: pos.x + 0.2, y: pos.y + 0.12, w: pos.w - 0.4, h: 0.28,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: q.color, charSpacing: 0.8
    });

    // 기업명
    slide.addText(q.title, {
      x: pos.x + 0.2, y: pos.y + 0.42, w: pos.w - 0.4, h: 0.42,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    // 상세
    slide.addText(q.body, {
      x: pos.x + 0.2, y: pos.y + 0.9, w: pos.w - 0.4, h: pos.h - 1.1,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });
  });

  addPageNumber(slide, 5, TOTAL_SLIDES);
}

// [06] IMUBIT ProcessFlow (4단계)
function slide06_imubit() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    'IMUBIT: DNN+RL로 DCS에 직접 세트포인트를 기입하는 완전 Closed-loop'
  );

  addProcessFlow(slide, [
    {
      title: '데이터 수집',
      body: '2~5년 역사 데이터\n→ 클라우드에서 DLPC 모델 학습',
      accentColor: COLORS.accent_blue
    },
    {
      title: '온프레미스 배포',
      body: 'DMZ/PCN에 배포\nOPC-UA로 DCS 연결',
      accentColor: COLORS.accent_cyan
    },
    {
      title: '실시간 최적화',
      body: '1,000개+ 변수\n최적 세트포인트\n1분 내 계산',
      accentColor: COLORS.accent_yellow
    },
    {
      title: 'Closed-loop 제어',
      body: 'DCS에 세트포인트 직접 기입\n오퍼레이터 개입 권한 유지',
      accentColor: COLORS.accent_purple
    }
  ]);

  addPageNumber(slide, 6, TOTAL_SLIDES);
}

// [07] TIGNIS ProcessFlow (3단계)
function slide07_tignis() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    'TIGNIS: 물리 서로게이트 모델로 웨이퍼-투-웨이퍼 실시간 R2R 제어'
  );

  addProcessFlow(slide, [
    {
      title: '물리 AI',
      body: 'Physics-driven AI +\nML 서로게이트 모델\n물리 시뮬레이션 대비\n고속 추론',
      accentColor: COLORS.accent_blue
    },
    {
      title: '제어',
      body: '웨이퍼-투-웨이퍼\n자동 조정\nDTQL로 코드 없는 분석',
      accentColor: COLORS.accent_cyan
    },
    {
      title: '생태계',
      body: '2024 Cohu 인수\n$2.6B 반도체 계측 시장\nTEL 파트너십',
      accentColor: COLORS.accent_yellow
    }
  ]);

  addPageNumber(slide, 7, TOTAL_SLIDES);
}

// [08] Lam Research TwoColumn
function slide08_lam() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    'Lam Research: 가장 엄밀하게 검증된 Human-First 접근'
  );

  // 좌측 카드 — HF-CL 전략
  slide.addShape('roundRect', {
    x: 0.6, y: 1.8, w: 5.9, h: 5.0,
    rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addShape('rect', {
    x: 0.62, y: 1.8, w: 5.86, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  slide.addText('HF-CL 전략', {
    x: 0.8, y: 1.9, w: 5.5, h: 0.45,
    fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });

  const lfItems = [
    '엔지니어 도메인 지식으로 탐색 공간 정의 (Human-First)',
    'Bayesian Optimization이 실험 선택 최적화 (Computer-Last)',
    'SEMulator3D로 레시피 후보 검증'
  ];
  lfItems.forEach((item, i) => {
    const itemY = 2.5 + i * 1.15;
    slide.addShape('ellipse', {
      x: 0.8, y: itemY + 0.06, w: 0.28, h: 0.28,
      fill: { color: COLORS.accent_blue },
      line: { color: COLORS.accent_blue, width: 0 }
    });
    slide.addText(String(i + 1), {
      x: 0.8, y: itemY + 0.06, w: 0.28, h: 0.28,
      fontSize: 10, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });
    slide.addText(item, {
      x: 1.2, y: itemY, w: 5.1, h: 0.85,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.3, valign: 'middle', autoFit: true
    });
  });

  // 우측 카드 — Nature 논문 성과
  slide.addShape('roundRect', {
    x: 6.83, y: 1.8, w: 5.9, h: 5.0,
    rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addShape('rect', {
    x: 6.85, y: 1.8, w: 5.86, h: 0.06,
    fill: { color: COLORS.accent_cyan }
  });
  slide.addText('Nature 논문 성과', {
    x: 7.03, y: 1.9, w: 5.5, h: 0.45,
    fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });

  const achievements = [
    { label: '비용 절감', value: '50%' },
    { label: '시간 단축', value: '50%' }
  ];
  achievements.forEach((a, i) => {
    const aY = 2.5 + i * 0.9;
    slide.addText(a.value, {
      x: 7.03, y: aY, w: 1.5, h: 0.7,
      fontSize: 32, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: COLORS.accent_cyan, align: 'center', valign: 'middle'
    });
    slide.addText(a.label, {
      x: 8.65, y: aY + 0.1, w: 3.9, h: 0.5,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, valign: 'middle'
    });
  });

  // 구분선
  slide.addShape('rect', {
    x: 7.03, y: 4.45, w: 5.5, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  // 검증 방법 및 주의사항
  const notes = [
    '100번 무작위 반복 기반 통계 검증',
    '⚠ 단, 시뮬레이션 환경(SiO2 홀 식각)',
    '실 팹 전이 성능은 별도 검증 필요'
  ];
  notes.forEach((note, i) => {
    const nColor = note.startsWith('⚠') ? COLORS.accent_yellow : COLORS.text_secondary;
    slide.addText(note, {
      x: 7.03, y: 4.6 + i * 0.62, w: 5.5, h: 0.55,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: nColor,
      lineSpacingMultiple: 1.3, valign: 'middle', autoFit: true
    });
  });

  addPageNumber(slide, 8, TOTAL_SLIDES);
}

// [09] Siemens ProcessFlow (4단계)
function slide09_siemens() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    'Siemens: OT→Edge→SCADA→클라우드 LLM 전체 데이터 경로 공개'
  );

  addProcessFlow(slide, [
    {
      title: 'OT 현장',
      body: 'Industrial Edge\nOPC-UA / MQTT\n데이터 수집',
      accentColor: COLORS.accent_blue
    },
    {
      title: 'SCADA',
      body: 'WinCC OA\n이벤트 관리\nDB 통합',
      accentColor: COLORS.accent_cyan
    },
    {
      title: 'MCP Server',
      body: '클라우드 LLM 연결\n(OpenAI, Bedrock,\nClaude, Gemini)',
      accentColor: COLORS.accent_yellow
    },
    {
      title: '인사이트 (Open-loop)',
      body: 'PLC 코드 생성\n음성 보고\nPLM 통합\n⚠ 제어 루프 밖 보조',
      accentColor: COLORS.accent_purple
    }
  ]);

  addPageNumber(slide, 9, TOTAL_SLIDES);
}

// [10] Bosch & Intel Cards (2x2)
function slide10_bosch_intel() {
  const slide = pptx.addSlide();

  addTitleBar(slide,
    'Bosch와 Intel: 각각 다른 방향의 실질적 배포'
  );

  const CARD_2X2 = [
    { x: 0.6,  y: 1.8, w: 5.9, h: 2.45 },
    { x: 6.83, y: 1.8, w: 5.9, h: 2.45 },
    { x: 0.6,  y: 4.4, w: 5.9, h: 2.45 },
    { x: 6.83, y: 4.4, w: 5.9, h: 2.45 }
  ];

  const cards = [
    {
      pos: CARD_2X2[0], color: COLORS.accent_blue,
      title: 'Bosch Agentic AI',
      body: 'Multi-agent + LLM 기반\nPlanning Agent → 실행 에이전트들\nHuman 감독 유지'
    },
    {
      pos: CARD_2X2[1], color: COLORS.accent_cyan,
      title: 'Bosch Jaipur 실배포',
      body: 'GenAI Rework Agent\n채팅/음성 근본원인 진단\n수정 조치 제안'
    },
    {
      pos: CARD_2X2[2], color: COLORS.accent_yellow,
      title: 'Intel 전수 검사',
      body: 'ADC 90%+ 정확도\n100% 웨이퍼 검사\nResNet50 기반'
    },
    {
      pos: CARD_2X2[3], color: COLORS.accent_purple,
      title: 'Intel ROI',
      body: 'IWVI 연간 $200만 절감\n추가 장비 불필요\nLLM 전환 무관 성과'
    }
  ];

  cards.forEach((c) => {
    const pos = c.pos;
    slide.addShape('roundRect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: pos.x + 0.02, y: pos.y, w: pos.w - 0.04, h: 0.06,
      fill: { color: c.color }
    });
    slide.addText(c.title, {
      x: pos.x + 0.2, y: pos.y + 0.15, w: pos.w - 0.4, h: 0.45,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });
    slide.addText(c.body, {
      x: pos.x + 0.2, y: pos.y + 0.65, w: pos.w - 0.4, h: pos.h - 0.85,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });
  });

  // 중앙 분리선
  slide.addShape('rect', {
    x: 6.615, y: 1.8, w: 0.01, h: 5.05,
    fill: { color: 'E2E8F0' }
  });
  slide.addShape('rect', {
    x: 0.6, y: 4.3, w: 12.13, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  addPageNumber(slide, 10, TOTAL_SLIDES);
}

// [11] Samsung BeforeAfter
function slide11_samsung() {
  const slide = pptx.addSlide();

  addTitleBar(slide, 'Samsung: 2030 비전 vs 2026 현실');

  addBeforeAfter(slide,
    {
      title: '2026 현실',
      bullets: [
        '전략 선언 + 초기 파일럿 단계',
        '검증 가능한 운영 성과 없음',
        'NVIDIA AI Megafactory 구축 중',
        '경쟁사(TSMC, Intel, SK하이닉스)도 동시 선언'
      ]
    },
    {
      title: '2030 비전',
      bullets: [
        'NVIDIA 50,000+ GPU 인프라',
        'Omniverse 디지털 트윈 전 공장',
        'AI 에이전트 + 로봇 통합 자율 생산',
        '설계-운영 전환 시간 대폭 단축'
      ]
    }
  );

  addPageNumber(slide, 11, TOTAL_SLIDES);
}

// === Part 1 끝 ===


function slide12_comparisonTable() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '7개 기업 종합 비교: 제어 유형 × AI 기법 × 도입 × 검증');

  const headers = ['기업', '제어 유형', 'AI 기법', '도입 수준', 'LLM 적극성', '검증 수준'];
  const dataRows = [
    ['IMUBIT', 'Closed-loop 자율', 'DNN+RL', 'Production 100+', '★★☆', '★★☆'],
    ['TIGNIS', 'Closed-loop R2R', '물리+ML', 'Production', '★☆☆', '★★☆'],
    ['Lam Research', 'Semi-closed HitL', 'Bayesian Opt.', 'R&D+임베디드', '★★☆', '★★★'],
    ['Siemens', 'Open-loop 보조', 'GPT-4+KG', 'Pilot 100+', '★★★', '★★☆'],
    ['Bosch', 'Semi-auto', 'Multi-agent+LLM', '내부 배포', '★★★', '★☆☆'],
    ['Samsung', '전략 선언', 'GPU+디지털트윈', '파일럿 초기', '★★☆', '★☆☆'],
    ['Intel', 'Closed-loop(결함)', 'CNN+CV', 'Production', '★☆☆', '★★★'],
  ];

  addStyledTable(slide, headers, dataRows, {
    x: 0.6,
    y: 1.8,
    w: 12.13,
    h: 4.9,
    colW: [1.4, 1.9, 1.7, 1.8, 1.7, 1.63],
    fontSize: 11,
  });

  addPageNumber(slide, 12, TOTAL_SLIDES);
}

function slide13_successPatterns() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '성공적 배포의 3가지 공통 패턴');

  const patterns = [
    {
      num: '1',
      title: '인간 개입 권한 유지',
      body: 'IMUBIT(오퍼레이터 개입), Lam(Human-First), Intel(엔지니어 최종 결정) — 모든 성공 사례에서 인간이 최종 결정권을 유지함',
      accent: COLORS.accent_blue,
    },
    {
      num: '2',
      title: '기존 프로토콜 활용 비침습적 통합',
      body: 'OPC-UA, DCS 직접 연결, 추가 장비 불필요 — 기존 인프라를 교체하지 않고 위에 레이어를 추가하는 방식',
      accent: COLORS.accent_cyan,
    },
    {
      num: '3',
      title: '도메인 특화 접근',
      body: '정유(IMUBIT), 반도체(TIGNIS, Lam) — 범용 AI보다 특정 공정에 집중한 사례가 더 높은 성과',
      accent: COLORS.accent_yellow,
    },
  ];

  patterns.forEach((p, i) => {
    const yPos = 1.9 + i * 1.45;

    // 번호 뱃지
    slide.addShape('ellipse', {
      x: 0.6,
      y: yPos,
      w: 0.42,
      h: 0.42,
      fill: { color: p.accent },
      line: { color: p.accent },
    });
    slide.addText(p.num, {
      x: 0.6,
      y: yPos,
      w: 0.42,
      h: 0.42,
      fontSize: 14,
      fontFace: FONTS.kpi.fontFace,
      bold: true,
      color: COLORS.text_on_dark,
      align: 'center',
      valign: 'middle',
    });

    // 제목
    slide.addText(p.title, {
      x: 1.18,
      y: yPos,
      w: 11.55,
      h: 0.38,
      fontSize: 15,
      fontFace: FONTS.subtitle.fontFace,
      bold: FONTS.subtitle.bold,
      color: COLORS.text_primary,
      valign: 'middle',
    });

    // 본문
    slide.addText(p.body, {
      x: 1.18,
      y: yPos + 0.4,
      w: 11.55,
      h: 0.85,
      fontSize: 12,
      fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      valign: 'top',
      lineSpacingMultiple: 1.3,
    });
  });

  // 경고 박스
  slide.addShape('rect', {
    x: 0.6,
    y: 6.25,
    w: 12.13,
    h: 0.6,
    fill: { color: 'FFF0F0' },
    line: { color: 'FFCCCC', pt: 1 },
  });
  slide.addText('⚠️ 주의: 공개된 성공 사례 기반 분석. 실패 사례·TCO 데이터 미포함 (생존자 편향 가능)', {
    x: 0.85,
    y: 6.28,
    w: 11.63,
    h: 0.52,
    fontSize: 11,
    fontFace: FONTS.body.fontFace,
    color: 'CC3333',
    valign: 'middle',
    bold: true,
  });

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

function slide14_sectionTransition() {
  const slide = pptx.addSlide();

  // 좌측 다크 패널 (40%)
  slide.addShape('rect', {
    x: 0,
    y: 0,
    w: 5.12,
    h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { color: COLORS.bg_dark },
  });

  // 좌측 장식 텍스트
  slide.addText('LLM\n&\n온톨로지', {
    x: 0.4,
    y: 2.0,
    w: 4.32,
    h: 3.5,
    fontSize: 42,
    fontFace: FONTS.deco.fontFace,
    bold: true,
    color: COLORS.accent_blue,
    align: 'center',
    valign: 'middle',
    lineSpacingMultiple: 1.2,
  });

  // 우측 밝은 패널 (60%)
  slide.addShape('rect', {
    x: 5.12,
    y: 0,
    w: 7.88,
    h: 7.5,
    fill: { color: COLORS.bg_primary },
    line: { color: COLORS.bg_primary },
  });

  // 우측 제목
  slide.addText('LLM/온톨로지는 제조에 어떻게 들어오는가', {
    x: 5.52,
    y: 2.6,
    w: 7.08,
    h: 1.2,
    fontSize: 26,
    fontFace: FONTS.title.fontFace,
    bold: FONTS.title.bold,
    color: COLORS.text_primary,
    align: 'left',
    valign: 'middle',
  });

  // 우측 부제
  slide.addText('4가지 전환 유형과 구조적 장벽', {
    x: 5.52,
    y: 3.9,
    w: 7.08,
    h: 0.6,
    fontSize: 18,
    fontFace: FONTS.subtitle.fontFace,
    bold: false,
    color: COLORS.text_secondary,
    align: 'left',
    valign: 'middle',
  });

  // 섹션 번호
  slide.addText('SECTION 03', {
    x: 5.52,
    y: 5.2,
    w: 4.0,
    h: 0.4,
    fontSize: 11,
    fontFace: FONTS.caption.fontFace,
    color: COLORS.accent_blue,
    bold: true,
  });
}

function slide15_fourTransitionTypes() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 전환 유형: 현실적인 것은 2가지뿐이다');

  const cards = [
    {
      x: 0.6,
      y: 1.8,
      w: 5.8,
      h: 2.3,
      title: '레이어 추가형 ★★★',
      body: '기존 ML 위에 LLM을 설명/인터페이스로 추가\nSiemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent',
      accentColor: COLORS.accent_blue,
    },
    {
      x: 6.93,
      y: 1.8,
      w: 5.8,
      h: 2.3,
      title: '하이브리드형 ★★☆',
      body: '수치→ML, 판단→LLM, 지식→KG 역할 분리\nSiemens IFM(개발중), ISA-95+LLM+KG(연구)',
      accentColor: COLORS.accent_cyan,
    },
    {
      x: 0.6,
      y: 4.35,
      w: 5.8,
      h: 2.3,
      title: '교체형 ★☆☆',
      body: '전체 파이프라인을 Foundation Model로 교체\n해당 사례 없음, 구조적 장벽 (실시간, 정밀도, 인증)',
      accentColor: COLORS.accent_red,
    },
    {
      x: 6.93,
      y: 4.35,
      w: 5.8,
      h: 2.3,
      title: '불필요형 ★★★',
      body: '기존 ML이 이미 최적\nPID 튜닝, 수렴된 RL, 고주파 제어 — LLM 추가가 오히려 복잡도 증가',
      accentColor: COLORS.accent_yellow,
    },
  ];

  cards.forEach(card => {
    addCard(slide, card);
  });

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

function slide16_layeredStack() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이어 추가형: 기존 ML 위에 LLM을 얹는 현실적 경로');

  const layers = [
    {
      title: 'LLM 레이어',
      body: '설명·인터페이스·코드생성 — Siemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent',
      color: COLORS.accent_blue,
    },
    {
      title: 'ML/RL 모델',
      body: '수치 최적화 유지 — DNN, Bayesian Opt., CNN 등 기존 모델 변경 없음',
      color: COLORS.accent_cyan,
    },
    {
      title: 'PLC/DCS/장비',
      body: '실시간 제어 — OPC-UA, SCADA, MES 기존 인프라 그대로',
      color: COLORS.accent_purple,
    },
  ];

  addLayeredStack(slide, layers);

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

function slide17_hybridProcessFlow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '하이브리드형: 수치→ML, 판단→LLM, 지식→KG 역할 분리');

  const steps = [
    {
      title: 'KG (도메인 지식)',
      body: '온톨로지 기반 공정 지식 구조화, ISA-95 정렬',
    },
    {
      title: 'LLM (의도 파악)',
      body: '자연어 → 공정 파라미터 매핑, 계획 수립, 설명 생성',
    },
    {
      title: 'ML/DO (수치 최적화)',
      body: '정밀 파라미터 계산, 물리 모델 + 데이터 기반',
    },
    {
      title: 'PLC (실행)',
      body: 'Validator 검증 후 실행, 안전 제약 확인',
    },
  ];

  addProcessFlow(slide, steps);

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

function slide18_structuralBarriers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '구조적 장벽 4가지와 해소 시기 전망');

  const headers = ['장벽', '현황', '해소 시기'];
  const dataRows = [
    ['실시간 제약 (LLM 수초 vs PLC ms)', '엣지/클라우드 분리로 우회 중', '~2028'],
    ['수치 정밀도 (LLM 부동소수점 오류)', '수치는 ML, 판단은 LLM 분리', '구조적 한계'],
    ['안전 인증 (IEC 61508 비결정론 미수용)', '인증 경로 미정립', '~2030+'],
    ['데이터 주권 (레시피 기밀 외부 전송)', '온프레미스 LLM/도메인 소형 모델, SemiKong 등 부상', '진행 중'],
    ['온톨로지 구축 (도메인 전문가 노력)', 'LLM 기반 자동 KG 생성 연구 활발', '~2027'],
  ];

  addStyledTable(slide, headers, dataRows, {
    x: 0.6,
    y: 1.8,
    w: 12.13,
    h: 4.8,
    colW: [3.5, 5.5, 3.13],
    fontSize: 12,
  });

  addPageNumber(slide, 18, TOTAL_SLIDES);
}

function slide19_whyReplacementImpossible() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '교체형은 왜 단기 불가능한가');

  // 좌측 제목
  slide.addText('기술 조건 (미충족)', {
    x: 0.6,
    y: 1.85,
    w: 5.9,
    h: 0.4,
    fontSize: 16,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold,
    color: COLORS.accent_red,
    valign: 'middle',
  });

  const leftItems = [
    'LLM 추론 지연 <10ms 필요 (현재 수초)',
    '수치 정밀도: 온도 ±0.1°C, 두께 ±1nm',
    '안전 인증 프레임워크 확립 필요',
    '결정론적 검증 레이어 없이는 불가',
  ];

  slide.addText(leftItems.map(item => `• ${item}`).join('\n'), {
    x: 0.6,
    y: 2.35,
    w: 5.9,
    h: 4.2,
    fontSize: 13,
    fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.7,
    valign: 'top',
  });

  // 구분선
  slide.addShape('rect', {
    x: 6.615,
    y: 1.85,
    w: 0.01,
    h: 4.95,
    fill: { color: 'E2E8F0' },
    line: { color: 'E2E8F0' },
  });

  // 우측 제목
  slide.addText('전문가 의견', {
    x: 6.83,
    y: 1.85,
    w: 5.9,
    h: 0.4,
    fontSize: 16,
    fontFace: FONTS.subtitle.fontFace,
    bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue,
    valign: 'middle',
  });

  const rightItems = [
    '"LLM의 수치 추론 결함은 학습 데이터나 스케일링으로 해결 불가" — ACL 2023',
    '"미래는 AI가 SCADA를 대체하는 것이 아니라 강화하는 것" — controlsys.org',
    '"안전 기능에 AI 적용 시 56%가 응답 시간 장벽 보고" — 2025 설문',
    '결론: 레이어 추가/하이브리드가 현실적',
  ];

  slide.addText(rightItems.map((item, i) => (i < 3 ? `❝ ${item}` : `→ ${item}`)).join('\n'), {
    x: 6.83,
    y: 2.35,
    w: 5.9,
    h: 4.2,
    fontSize: 12,
    fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.6,
    valign: 'top',
  });

  addPageNumber(slide, 19, TOTAL_SLIDES);
}

function slide20_newPlayers() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '주목할 신규 플레이어 3곳');

  addCard(slide, {
    x: 0.6,
    y: 1.8,
    w: 3.7,
    h: 4.8,
    title: 'SemiKong (Aitomatic)',
    body: 'Llama 기반 반도체 도메인 전용 LLM\nMeta AI 협력, 시장 출시 20~30% 단축 주장\n\n⚠️ 독립 벤치마크 미확인 ★★☆',
    accentColor: COLORS.accent_blue,
  });

  addCard(slide, {
    x: 4.52,
    y: 1.8,
    w: 3.7,
    h: 4.8,
    title: 'EthonAI',
    body: '인과 AI(Causal AI) 기반 제조 효율화\nSeries A $16M (2024)\n\nLLM 대신 인과관계/설명가능성으로 차별화',
    accentColor: COLORS.accent_cyan,
  });

  addCard(slide, {
    x: 8.43,
    y: 1.8,
    w: 4.3,
    h: 4.8,
    title: 'Blockbrain',
    body: 'Siemens AI Award 수상\n숍플로어 지식 포착 LLM\n\n현장 암묵지 디지털화 특화',
    accentColor: COLORS.accent_yellow,
  });

  addPageNumber(slide, 20, TOTAL_SLIDES);
}

function slide21_roadmap() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환 로드맵: 2026 → 2028 → 2030+');

  const milestones = [
    {
      date: '2026',
      title: '레이어 추가형 확산',
      description: 'Siemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent 배포 중',
    },
    {
      date: '2027',
      title: '자동 온톨로지 성숙',
      description: 'OntoKGen 등 LLM 기반 KG 자동 생성, 중소 제조 진입 장벽 하락',
    },
    {
      date: '2028',
      title: '하이브리드형 파일럿',
      description: 'Siemens IFM 출시 전망, 엣지 LLM 성숙, 도메인 소형 모델 검증',
    },
    {
      date: '2030+',
      title: '교체형 논의 시작',
      description: 'IEC 61508 개정, LLM 추론 <100ms, 안전 인증 경로 확립 시',
    },
  ];

  addRoadmap(slide, milestones);

  addPageNumber(slide, 21, TOTAL_SLIDES);
}



function slide22_section_judgment() {
  const slide = pptx.addSlide();

  // 좌 40% 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { type: 'none' }
  });

  // 우 60% 밝은 배경
  slide.addShape('rect', {
    x: 5.33, y: 0, w: 8.0, h: 7.5,
    fill: { color: COLORS.bg_primary },
    line: { type: 'none' }
  });

  // 좌측 섹션 번호
  slide.addText('PART 4', {
    x: 0.4, y: 2.5, w: 4.5, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.accent_cyan, bold: true
  });

  // 좌측 큰 제목
  slide.addText('판단', {
    x: 0.4, y: 3.0, w: 4.5, h: 0.8,
    fontSize: 40, fontFace: FONTS.title.fontFace,
    color: COLORS.text_on_dark, bold: true
  });

  slide.addText('우리 공정에 LLM을\n적용해야 하는가', {
    x: 0.4, y: 3.8, w: 4.5, h: 1.5,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace,
    color: COLORS.text_on_dark, bold: false
  });

  // 우측 부제목
  slide.addText('전환 필요성 판단과 의사결정 프레임워크', {
    x: 5.73, y: 3.2, w: 7.2, h: 1.0,
    fontSize: 22, fontFace: FONTS.subtitle.fontFace,
    color: COLORS.text_primary, bold: false
  });
}

function slide23_funnel_transition() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환 필요성 판단 깔때기');

  addFunnel(slide, [
    { label: '우리 공정에 AI가 있는가?' },
    { label: '기존 ML이 충분한가?' },
    { label: 'LLM 추가 실익이 있는가?' },
    { label: '어떤 레이어에 추가할 것인가?' },
    { label: '파일럿 대상 선정' }
  ]);

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

function slide24_table_unnecessary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환이 불필요한 5가지 영역');

  addStyledTable(
    slide,
    ['영역', '이유', '기존 대안'],
    [
      ['단일 파라미터 PID 튜닝', '기존 알고리즘이 이미 최적', 'PID/MPC'],
      ['수렴된 RL 반복 제어', 'LLM 추가 시 응답 지연만 증가', '기존 RL 유지'],
      ['고주파 센서 제어 (ms 단위)', 'LLM 추론 물리적 불가', '엣지 ML'],
      ['대량 제조 (마진 박)', 'LLM API 비용 수십~수백 배', '온프레미스 ML'],
      ['데이터 인프라 미확립', '68% 제조사 데이터 품질 문제', '데이터 정비 우선']
    ],
    { x: 0.6, y: 1.8, w: 12.13 }
  );

  addPageNumber(slide, 24, TOTAL_SLIDES);
}

function slide25_human_ai_responsibility() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '인간-AI 책임 분배를 먼저 설계하라');

  const cases = [
    {
      company: 'IMUBIT',
      desc: '오퍼레이터 개입 권한 유지',
      point: '"85%+ 참여율의 비결"',
      color: COLORS.accent_blue
    },
    {
      company: 'Lam Research',
      desc: 'Human-First, Computer-Last',
      point: '"엔지니어가 먼저, AI가 보조"',
      color: COLORS.accent_cyan
    },
    {
      company: 'Intel',
      desc: '엔지니어 최종 결정',
      point: '"자동 셧다운은 하되, RCA는 사람이"',
      color: COLORS.accent_purple
    }
  ];

  cases.forEach((c, i) => {
    const yPos = 1.85 + i * 1.3;

    // 좌측 accent 바
    slide.addShape('rect', {
      x: 0.6, y: yPos, w: 0.08, h: 1.0,
      fill: { color: c.color },
      line: { type: 'none' }
    });

    // 회사명
    slide.addText(c.company, {
      x: 0.85, y: yPos, w: 3.5, h: 0.4,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: c.color, bold: true
    });

    // 설명
    slide.addText(c.desc, {
      x: 0.85, y: yPos + 0.4, w: 5.5, h: 0.3,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary
    });

    // 포인트
    slide.addText(c.point, {
      x: 6.6, y: yPos + 0.2, w: 6.0, h: 0.5,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, italic: true
    });
  });

  // 공통점 텍스트
  slide.addText('공통점: 기술 스택보다 운영 설계가 배포 성공 결정', {
    x: 0.6, y: 5.75, w: 12.13, h: 0.35,
    fontSize: 11, fontFace: FONTS.body.fontFace,
    color: COLORS.text_primary, bold: true
  });

  // 하단 정보 박스
  slide.addShape('rect', {
    x: 0.6, y: 6.2, w: 12.13, h: 0.85,
    fill: { color: 'EBF0FF' },
    line: { color: COLORS.accent_blue, w: 0.5 }
  });

  slide.addText(
    '의료 AI(CDSS)에서도 동일 패턴 — AI 추천 + 의사 최종 결정. 설명가능성과 책임귀속 법제화 진행 중',
    {
      x: 0.85, y: 6.3, w: 11.7, h: 0.65,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.accent_blue
    }
  );

  addPageNumber(slide, 25, TOTAL_SLIDES);
}

function slide26_matrix_domain() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '도메인 특화 vs 범용: 어디에 투자할 것인가');

  addMatrix(
    slide,
    [
      {
        position: 'TL',
        title: '위험 영역',
        body: '데이터 정비 우선\nAI 도입 시기상조'
      },
      {
        position: 'TR',
        title: '도메인 특화 AI',
        body: 'IMUBIT, TIGNIS형\n단기 최선'
      },
      {
        position: 'BL',
        title: '기존 자동화 충분',
        body: 'PLC/PID\n기존 솔루션'
      },
      {
        position: 'BR',
        title: '범용 AI 탐색',
        body: 'LLM 보조 도구\nSiemens Copilot형'
      }
    ],
    {
      xAxis: { label: '데이터 가용성', from: '부족', to: '풍부' },
      yAxis: { label: '공정 복잡도', from: '단순', to: '복합' }
    }
  );

  addPageNumber(slide, 26, TOTAL_SLIDES);
}

function slide27_table_reverse_decision() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '역방향 의사결정 가이드: 만약 X이면, Y를 하라');

  addStyledTable(
    slide,
    ['만약...', '그러면...'],
    [
      [
        'Siemens IFM이 2027년 Production-ready로 출시',
        '자체 개발 대신 Siemens 생태계 활용 검토'
      ],
      [
        'LLM 추론 지연이 100ms 이하로 감소',
        '실시간 제어 루프 내 LLM 배치 논의 시작'
      ],
      [
        'IEC 61508이 비결정론적 AI 수용 개정',
        '안전 필수 제조에서도 LLM 기반 제어 가능'
      ],
      [
        'SemiKong 등 도메인 LLM 독립 벤치마크 검증',
        '온프레미스 배포로 데이터 주권 해소'
      ],
      [
        '자동 온톨로지 생성 도구 성숙',
        '중소 제조사도 KG 기반 AI 접근 가능'
      ]
    ],
    { x: 0.6, y: 1.8, w: 12.13 }
  );

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

function slide28_limitations() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '분석의 한계를 인식하라');

  const limits = [
    {
      num: '1',
      text: '공개 성공 사례 기반 — 실패 사례·도입 철회 사례 미포함 (생존자 편향)'
    },
    {
      num: '2',
      text: '도입 비용/TCO 미분석 — 라이선스, 컨설팅, 데이터 정비 비용 공개 자료 부족'
    },
    {
      num: '3',
      text: '중소 제조사 관점 부재 — 조사 대상이 모두 대기업 또는 대기업 대상 솔루션'
    },
    {
      num: '4',
      text: '일부 수치 독립 검증 미확인 — SemiKong(20~30% 단축)은 Meta 파트너사 홍보성 블로그 출처'
    }
  ];

  limits.forEach((item, i) => {
    const yPos = 1.85 + i * 1.05;

    // 번호 뱃지
    slide.addShape('ellipse', {
      x: 0.6, y: yPos + 0.05, w: 0.38, h: 0.38,
      fill: { color: COLORS.accent_red },
      line: { type: 'none' }
    });

    slide.addText(item.num, {
      x: 0.6, y: yPos + 0.05, w: 0.38, h: 0.38,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_on_dark, bold: true, align: 'center', valign: 'middle'
    });

    // 내용
    slide.addText(item.text, {
      x: 1.15, y: yPos, w: 11.2, h: 0.7,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle'
    });
  });

  // 경고 박스
  slide.addShape('rect', {
    x: 0.6, y: 6.15, w: 12.13, h: 0.9,
    fill: { color: 'FFF0F0' },
    line: { color: COLORS.accent_red, w: 0.5 }
  });

  slide.addText(
    '이 보고서의 결론은 조건부입니다. 자사 공정 적용 시 독립 검증과 PoC를 반드시 선행하십시오.',
    {
      x: 0.85, y: 6.25, w: 11.7, h: 0.7,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.accent_red, bold: true, valign: 'middle'
    }
  );

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

function slide29_kpi_messages() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 핵심 메시지 재확인');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.915, h: 2.45,
    title: 'M1',
    body: 'LLM은 제어 루프 밖에 있다 — 모든 기업에서',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.8, w: 5.915, h: 2.45,
    title: 'M2',
    body: '현실적 경로는 레이어 추가와 하이브리드 2가지',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'M3',
    body: '도메인 특화가 범용보다 유효하다',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: 'M4',
    body: '인간 통제 설계가 기술 선정보다 중요하다',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

function slide30_followup_questions() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '후속 탐색 질문 3가지');

  const questions = [
    {
      num: '1',
      title: '레이저 가공 도메인에서 적용 가능한 접근법은?',
      desc: '반도체/정유 중심 조사, 레이저 고유 특성(초고속 열적 변화, 광학 파라미터) 별도 조사 필요',
      color: COLORS.accent_blue
    },
    {
      num: '2',
      title: '온프레미스 LLM의 실질적 성능 트레이드오프는?',
      desc: 'Llama 70B급 공장 엣지 운영 시 추론 품질/속도',
      color: COLORS.accent_cyan
    },
    {
      num: '3',
      title: '기존 APC/R2R이 해결하지 못하는 구체적 문제는?',
      desc: 'LLM/KG 전환 실익의 전제조건',
      color: COLORS.accent_purple
    }
  ];

  questions.forEach((q, i) => {
    const yPos = 1.9 + i * 1.6;

    // 번호 뱃지
    slide.addShape('rect', {
      x: 0.6, y: yPos, w: 0.45, h: 0.45,
      fill: { color: q.color },
      line: { type: 'none' }
    });

    slide.addText(q.num, {
      x: 0.6, y: yPos, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.kpi.fontFace,
      color: COLORS.text_on_dark, bold: true, align: 'center', valign: 'middle'
    });

    // 제목
    slide.addText(q.title, {
      x: 1.25, y: yPos, w: 11.1, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, bold: true
    });

    // 설명
    slide.addText(q.desc, {
      x: 1.25, y: yPos + 0.55, w: 11.1, h: 0.6,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });

    // 구분선 (마지막 제외)
    if (i < questions.length - 1) {
      slide.addShape('rect', {
        x: 0.6, y: yPos + 1.35, w: 12.13, h: 0.02,
        fill: { color: COLORS.bg_secondary },
        line: { type: 'none' }
      });
    }
  });

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

function slide31_closing() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { type: 'none' }
  });

  // 장식용 accent 라인
  slide.addShape('rect', {
    x: 0, y: 3.5, w: 13.33, h: 0.04,
    fill: { color: COLORS.accent_cyan },
    line: { type: 'none' }
  });

  // 중앙 큰 텍스트
  slide.addText('제조 AI의 미래는 교체가 아니라 통합이다', {
    x: 0.8, y: 2.2, w: 11.73, h: 1.1,
    fontSize: 34, fontFace: FONTS.title.fontFace,
    color: COLORS.text_on_dark, bold: true, align: 'center'
  });

  // 부제
  slide.addText(
    '어떤 공정 레이어에서, 어떤 조건하에 LLM이 명확한 가치를 제공하는가 — 이것이 진짜 질문',
    {
      x: 0.8, y: 3.7, w: 11.73, h: 0.9,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace,
      color: COLORS.text_secondary, align: 'center'
    }
  );

  // 하단 날짜/출처
  slide.addText('2026-03-30 | 7개 기업 비교 분석 리서치', {
    x: 0.8, y: 6.6, w: 11.73, h: 0.4,
    fontSize: 10, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });
}


// === 함수 호출 ===
slide01_title();
slide02_overview();
slide03_stat();
slide04_section();
slide05_matrix();
slide06_imubit();
slide07_tignis();
slide08_lam();
slide09_siemens();
slide10_bosch_intel();
slide11_samsung();
slide12_comparisonTable();
slide13_successPatterns();
slide14_sectionTransition();
slide15_fourTransitionTypes();
slide16_layeredStack();
slide17_hybridProcessFlow();
slide18_structuralBarriers();
slide19_whyReplacementImpossible();
slide20_newPlayers();
slide21_roadmap();
slide22_section_judgment();
slide23_funnel_transition();
slide24_table_unnecessary();
slide25_human_ai_responsibility();
slide26_matrix_domain();
slide27_table_reverse_decision();
slide28_limitations();
slide29_kpi_messages();
slide30_followup_questions();
slide31_closing();

pptx.writeFile({ fileName: 'manufacturing-ai-llm-transition.pptx' })
  .then(() => console.log('저장 완료: manufacturing-ai-llm-transition.pptx'))
  .catch(err => console.error('저장 실패:', err));
