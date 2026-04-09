# PptxGenJS 패턴 레퍼런스

## 스타일 상수

```javascript
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

// ===== 차트 스타일 =====
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
  colors: [
    '4A7BF7', '00D4AA', 'FFB020', 'FF6B6B', '8B5CF6', '38BDF8'
  ]
};

// ===== 폰트 상수 =====
// Weight mapping: 특정 weight OTF 파일이 설치된 경우 fontFace로 직접 지정.
// bold: true는 OS 레벨 폴백용 (해당 weight 미설치 시 OS가 볼드 시뮬레이션).
const FONTS = {
  title:    { fontFace: 'Pretendard ExtraBold', bold: true },   // 800, bold: true for fallback
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },    // 600
  body:     { fontFace: 'Pretendard', bold: false },             // 400
  caption:  { fontFace: 'Pretendard Light', bold: false },       // 300
  serif:    { fontFace: 'ChosunNm', bold: false },
  kpi:      { fontFace: 'Pretendard Black', bold: true },        // 900, bold: true for fallback
  deco:     { fontFace: 'Pretendard Thin', bold: false },        // 100
};
```

---

## 헬퍼 함수

### addTitleBar — 표준 제목 바

```javascript
function addTitleBar(slide, title, subtitle = '') {
  // accent 라인
  slide.addShape('rect', {
    x: 0.6, y: 0.5, w: 1.2, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });
  // 제목: 전체 콘텐츠 폭 사용, 2줄 허용, 넘치면 자동 축소
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
```

### addStyledTable — 디자인 테이블

```javascript
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
```

### addTitledTable — 제목 포함 테이블 (colspan)

```javascript
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
```

### addStyledChart — 디자인 차트

주의: `pptx`는 전역 변수로 접근한다. 인자로 전달하지 않는다.

```javascript
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
```

### addCard — 카드 컴포넌트

```javascript
function addCard(slide, { x, y, w, h, title, body, accentColor }) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: 'FFFFFF' },
    // Replace shadow with subtle border
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
```

### addPageNumber — 페이지 번호

```javascript
function addPageNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.0, y: 7.05, w: 1.0, h: 0.3,
    fontSize: 9, fontFace: 'Pretendard',
    color: COLORS.text_tertiary, align: 'right'
  });
}
```

### calcTierCoords — 피라미드/퍼널 공통 좌표 계산 유틸리티

```javascript
/**
 * calcTierCoords(tierCount, opts)
 * Computes x/y/w/h for each tier in a pyramid or funnel shape.
 * @param {number} tierCount - Number of tiers
 * @param {object} opts - { startY, endY, maxW, minW, centerX, gap }
 * @returns {Array<{x, y, w, h}>}
 */
function calcTierCoords(tierCount, opts = {}) {
  const startY   = opts.startY   || 1.8;
  const endY     = opts.endY     || 6.8;
  const maxW     = opts.maxW     || 12.13;
  const minW     = opts.minW     || 4.0;
  const centerX  = opts.centerX  || 6.665;
  const gap      = opts.gap      || 0.15;
  const totalH   = endY - startY;
  const tierH    = (totalH - gap * (tierCount - 1)) / tierCount;
  const tiers    = [];
  for (let i = 0; i < tierCount; i++) {
    const ratio = i / (tierCount - 1 || 1);
    const w     = maxW - ratio * (maxW - minW);
    const x     = centerX - w / 2;
    const y     = startY + i * (tierH + gap);
    tiers.push({ x, y, w, h: tierH });
  }
  return tiers;
}
```

### addProcessFlow — 수평 프로세스 플로우

```javascript
/**
 * addProcessFlow(slide, steps)
 * Renders a horizontal step-by-step process flow with arrow connectors.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{title: string, body: string, accentColor?: string}>} steps
 */
function addProcessFlow(slide, steps) {
  const stepW   = (12.13 - 0.3 * (steps.length - 1)) / steps.length;
  const boxY    = 1.8;
  const boxH    = 4.8;

  steps.forEach((step, i) => {
    const x     = 0.6 + i * (stepW + 0.3);
    const color = step.accentColor || CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    // Card background
    slide.addShape('roundRect', {
      x, y: boxY, w: stepW, h: boxH,
      rectRadius: 0.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.5 }
    });

    // Accent top bar
    slide.addShape('rect', {
      x: x + 0.02, y: boxY, w: stepW - 0.04, h: 0.06,
      fill: { color: color }
    });

    // Step number
    slide.addText(String(i + 1), {
      x: x + 0.15, y: boxY + 0.15, w: 0.4, h: 0.4,
      fontSize: 13, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: color, align: 'center', valign: 'middle'
    });

    // Title
    slide.addText(step.title, {
      x: x + 0.15, y: boxY + 0.6, w: stepW - 0.3, h: 0.5,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    // Body
    slide.addText(step.body, {
      x: x + 0.15, y: boxY + 1.15, w: stepW - 0.3, h: boxH - 1.35,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });

    // Arrow between steps
    if (i < steps.length - 1) {
      slide.addText('→', {
        x: x + stepW, y: boxY + boxH / 2 - 0.25, w: 0.3, h: 0.5,
        fontSize: 18, fontFace: 'Pretendard',
        color: COLORS.text_tertiary, align: 'center', valign: 'middle'
      });
    }
  });
}
```

### addFunnel — 퍼널 다이어그램

```javascript
/**
 * addFunnel(slide, tiers)
 * Renders a funnel diagram where each tier narrows toward the bottom.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{label: string, value?: string}>} tiers
 */
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
```

### addMatrix — 2×2 매트릭스

```javascript
/**
 * addMatrix(slide, quadrants, axisLabels)
 * Renders a 2×2 matrix with four quadrant cards and labeled axes.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{title: string, body: string}>} quadrants - Exactly 4 items [TL, TR, BL, BR]
 * @param {{x: string, y: string}} axisLabels
 */
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

  // Center dividers
  slide.addShape('rect', {
    x: 6.615, y: 1.8, w: 0.01, h: 5.05,
    fill: { color: 'E2E8F0' }
  });
  slide.addShape('rect', {
    x: 0.6, y: 4.3, w: 12.13, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  // Axis labels
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
```

### addPyramid — 피라미드 다이어그램

```javascript
/**
 * addPyramid(slide, tiers)
 * Renders a pyramid diagram where the base is widest (bottom) and apex is narrowest (top).
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{label: string, description?: string}>} tiers - Bottom tier first
 */
function addPyramid(slide, tiers) {
  // calcTierCoords produces top→bottom order; reverse so index 0 = base (bottom)
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
```

### addVenn — 벤 다이어그램 (2원)

```javascript
/**
 * addVenn(slide, circles, intersection)
 * Renders a two-circle Venn diagram with a labeled intersection area.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{label: string, description?: string}>} circles - Exactly 2 items
 * @param {{label: string, description?: string}} intersection
 */
function addVenn(slide, circles, intersection) {
  const r      = 3.2;   // radius (w = h = r)
  const cy     = 4.3;   // vertical center
  const cx1    = 4.3;   // left circle center x
  const cx2    = 9.1;   // right circle center x
  const colors = [CHART_STYLE.colors[0], CHART_STYLE.colors[1]];

  // Left circle
  slide.addShape('ellipse', {
    x: cx1 - r / 2, y: cy - r / 2, w: r, h: r,
    fill: { color: colors[0], transparency: 40 },
    line: { color: colors[0], width: 1 }
  });

  // Right circle
  slide.addShape('ellipse', {
    x: cx2 - r / 2, y: cy - r / 2, w: r, h: r,
    fill: { color: colors[1], transparency: 40 },
    line: { color: colors[1], width: 1 }
  });

  // Left label
  slide.addText(circles[0]?.description
    ? `${circles[0].label}\n${circles[0].description}`
    : (circles[0]?.label || ''), {
    x: cx1 - r / 2, y: cy - 0.6, w: r * 0.6, h: 1.2,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
  });

  // Right label
  slide.addText(circles[1]?.description
    ? `${circles[1].label}\n${circles[1].description}`
    : (circles[1]?.label || ''), {
    x: cx2 - r * 0.1, y: cy - 0.6, w: r * 0.6, h: 1.2,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: 'FFFFFF', align: 'center', valign: 'middle', autoFit: true
  });

  // Intersection label
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
```

### addBeforeAfter — Before / After 비교 패널

```javascript
/**
 * addBeforeAfter(slide, before, after)
 * Renders a split-panel Before/After comparison layout.
 * @param {object} slide - PptxGenJS slide instance
 * @param {{title: string, bullets: string[]}} before
 * @param {{title: string, bullets: string[]}} after
 */
function addBeforeAfter(slide, before, after) {
  const panelY = 1.8;
  const panelH = 5.05;
  const panelW = 5.9;

  // Left — dark "Before" panel
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

  // Right — light "After" panel
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

  // Center divider
  slide.addShape('rect', {
    x: 6.615, y: panelY, w: 0.01, h: panelH,
    fill: { color: 'E2E8F0' }
  });
}
```

### addRoadmap — 타임라인 로드맵

```javascript
/**
 * addRoadmap(slide, milestones)
 * Renders a horizontal timeline roadmap with alternating above/below content blocks.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{date: string, title: string, description?: string}>} milestones
 */
function addRoadmap(slide, milestones) {
  const lineY    = 4.3;
  const lineX    = 0.6;
  const lineW    = 12.13;
  const dotR     = 0.15;
  const blockW   = lineW / milestones.length;

  // Horizontal axis bar
  slide.addShape('rect', {
    x: lineX, y: lineY - 0.01, w: lineW, h: 0.01,
    fill: { color: COLORS.accent_blue }
  });

  milestones.forEach((m, i) => {
    const cx    = lineX + blockW * i + blockW / 2;
    const above = i % 2 === 0;

    // Dot
    slide.addShape('ellipse', {
      x: cx - dotR, y: lineY - dotR, w: dotR * 2, h: dotR * 2,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] },
      line: { color: 'FFFFFF', width: 1 }
    });

    // Connector line
    const connH = 0.5;
    slide.addShape('rect', {
      x: cx - 0.005, y: above ? lineY - dotR - connH : lineY + dotR, w: 0.01, h: connH,
      fill: { color: 'CBD5E1' }
    });

    // Date label
    slide.addText(m.date, {
      x: cx - blockW / 2 * 0.9, y: above ? lineY - dotR - connH - 0.25 : lineY + dotR + connH + 0.02,
      w: blockW * 0.9, h: 0.25,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    // Title
    slide.addText(m.title, {
      x: cx - blockW / 2 * 0.9, y: above ? lineY - dotR - connH - 0.6 : lineY + dotR + connH + 0.28,
      w: blockW * 0.9, h: 0.35,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, align: 'center', autoFit: true
    });

    // Description
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
```

### addStatHighlight — KPI 강조 수치 슬라이드

```javascript
/**
 * addStatHighlight(slide, { number, label, context, trend })
 * Renders a large centered KPI number with supporting label, context, and optional trend indicator.
 * @param {object} slide - PptxGenJS slide instance
 * @param {object} stat
 * @param {string} stat.number   - The large display value (e.g. '₩3.2B', '94%')
 * @param {string} stat.label    - Short descriptor below the number
 * @param {string} [stat.context]  - Smaller explanatory text
 * @param {string} [stat.trend]  - Trend string, e.g. '▲ +18% YoY' (positive) or '▼ -5%' (negative)
 */
function addStatHighlight(slide, { number, label, context, trend }) {
  // Large KPI number
  slide.addText(number, {
    x: 0.6, y: 2.2, w: 12.13, h: 1.8,
    fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
    color: COLORS.text_primary, align: 'center', valign: 'middle', autoFit: true
  });

  // Divider below number
  slide.addShape('rect', {
    x: 5.165, y: 4.1, w: 3.0, h: 0.01,
    fill: { color: COLORS.accent_blue }
  });

  // Label
  slide.addText(label, {
    x: 0.6, y: 4.2, w: 12.13, h: 0.5,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_secondary, align: 'center', autoFit: true
  });

  // Context
  if (context) {
    slide.addText(context, {
      x: 0.6, y: 4.85, w: 12.13, h: 0.4,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center', autoFit: true
    });
  }

  // Trend indicator
  if (trend) {
    const isPositive = /[▲+]/.test(trend);
    slide.addText(trend, {
      x: 0.6, y: 5.35, w: 12.13, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: isPositive ? '00D4AA' : 'FF6B6B', align: 'center'
    });
  }
}
```

### addIconGrid — 아이콘 그리드 (2×3 또는 3×3)

```javascript
/**
 * addIconGrid(slide, items, layout)
 * Renders a grid of icon+title+body cards.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{icon: string, title: string, body: string}>} items
 * @param {'2x3'|'3x3'} layout
 */
function addIconGrid(slide, items, layout) {
  const CARD_2X3 = [
    { x: 0.6,  y: 1.8,  w: 3.8, h: 2.35 },
    { x: 4.73, y: 1.8,  w: 3.8, h: 2.35 },
    { x: 8.86, y: 1.8,  w: 3.87, h: 2.35 },
    { x: 0.6,  y: 4.35, w: 3.8, h: 2.35 },
    { x: 4.73, y: 4.35, w: 3.8, h: 2.35 },
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

    // Icon
    slide.addText(item.icon, {
      x: pos.x + 0.15, y: pos.y + 0.15, w: 0.55, h: 0.55,
      fontSize: 22, fontFace: 'Pretendard',
      color: color, align: 'center', valign: 'middle'
    });

    // Title
    slide.addText(item.title, {
      x: pos.x + 0.15, y: pos.y + 0.75, w: pos.w - 0.3, h: 0.4,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, autoFit: true
    });

    // Body
    slide.addText(item.body, {
      x: pos.x + 0.15, y: pos.y + 1.2, w: pos.w - 0.3, h: pos.h - 1.35,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.35, valign: 'top', autoFit: true
    });
  });
}
```

### addLayeredStack — 레이어드 스택 다이어그램

```javascript
/**
 * addLayeredStack(slide, layers)
 * Renders overlapping offset rectangles to represent layered architecture or stack diagrams.
 * @param {object} slide - PptxGenJS slide instance
 * @param {Array<{title: string, body: string}>} layers - Top layer first
 */
function addLayeredStack(slide, layers) {
  const baseX   = 1.5;
  const baseY   = 1.8;
  const layerW  = 10.0;
  const layerH  = 0.9;
  const offsetX = 0.18;
  const offsetY = 0.12;
  const gap     = 0.5;

  layers.forEach((layer, i) => {
    const x = baseX + i * offsetX;
    const y = baseY + i * (layerH + gap + offsetY);
    const color = CHART_STYLE.colors[i % CHART_STYLE.colors.length];

    // Shadow-like back rect
    slide.addShape('roundRect', {
      x: x + 0.1, y: y + 0.08, w: layerW, h: layerH,
      rectRadius: 0.08,
      fill: { color: 'E2E8F0' },
      line: { color: 'E2E8F0', width: 0 }
    });

    // Main layer rect
    slide.addShape('roundRect', {
      x, y, w: layerW, h: layerH,
      rectRadius: 0.08,
      fill: { color: color },
      line: { color: color, width: 0 }
    });

    // Title
    slide.addText(layer.title, {
      x: x + 0.3, y, w: 3.0, h: layerH,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: 'FFFFFF', valign: 'middle', autoFit: true
    });

    // Divider
    slide.addShape('rect', {
      x: x + 3.4, y: y + 0.2, w: 0.01, h: layerH - 0.4,
      fill: { color: 'FFFFFF' }
    });

    // Body
    slide.addText(layer.body, {
      x: x + 3.6, y, w: layerW - 3.9, h: layerH,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: 'FFFFFF', valign: 'middle', autoFit: true
    });
  });
}
```

### addComparisonTable — 기능 비교 체크 테이블

```javascript
/**
 * addComparisonTable(slide, features, options)
 * Renders a feature comparison table with ✓/✗ marks for each option.
 * @param {object} slide - PptxGenJS slide instance
 * @param {string[]} features - Row labels (feature names)
 * @param {Array<{name: string, checks: boolean[]}>} options - Column definitions
 */
function addComparisonTable(slide, features, options) {
  const CHECK   = '✓';
  const CROSS   = '✗';
  const colW    = (12.13 - 3.0) / options.length;

  const rows = [];

  // Header row
  const headerRow = [
    {
      text: '기능',
      options: { ...TABLE_STYLE.header, align: 'left' }
    },
    ...options.map(opt => ({
      text: opt.name,
      options: { ...TABLE_STYLE.header, align: 'center' }
    }))
  ];
  rows.push(headerRow);

  // Data rows
  features.forEach((feat, fi) => {
    const isAlt = fi % 2 === 1;
    const base  = isAlt ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    const row   = [
      { text: feat, options: { ...base } },
      ...options.map(opt => {
        const checked = opt.checks[fi];
        return {
          text: checked ? CHECK : CROSS,
          options: {
            ...base,
            align: 'center',
            bold: checked,
            color: checked ? '00A87A' : 'E53E3E'
          }
        };
      })
    ];
    rows.push(row);
  });

  const colWidths = [3.0, ...options.map(() => colW)];
  slide.addTable(rows, {
    ...TABLE_OPTIONS,
    colW: colWidths
  });
}
```

---

## 차트 유형별 사용 기준

| 데이터 유형 | 차트 유형 | PptxGenJS 상수 |
| --- | --- | --- |
| 항목별 크기 비교 | 세로 막대 | `pptx.charts.BAR` |
| 시계열 추이/변화 | 꺾은선 | `pptx.charts.LINE` |
| 전체 대비 비율 (5개 이하) | 원형 | `pptx.charts.PIE` |
| 전체 대비 비율 (중앙 KPI) | 도넛 | `pptx.charts.DOUGHNUT` |
| 추이 + 누적량 | 영역 | `pptx.charts.AREA` |
| 다차원 항목 비교 | 방사형 | `pptx.charts.RADAR` |
| 두 변수 간 관계 | 산점도 | `pptx.charts.SCATTER` |
| 세 변수 관계 | 버블 | `pptx.charts.BUBBLE` |

---

## 실전 슬라이드 패턴

### 패턴 A: 매출 보고

```javascript
const slide = pptx.addSlide();
addTitleBar(slide, '월별 매출 실적', '2026년 상반기');

// KPI 카드 3개
['매출 합계|₩3.2B', '전년 대비|+18%', '목표 달성률|94%'].forEach((item, i) => {
  const [label, value] = item.split('|');
  addCard(slide, {
    x: 0.6 + i * 4.1, y: 1.6, w: 3.8, h: 1.2,
    title: label, body: value, accentColor: CHART_STYLE.colors[i]
  });
});

// 데이터 테이블
addStyledTable(slide, ['월','매출','비용','영업이익','이익률'], [...data],
  { y: 3.1, rowH: [0.4, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35] });
```

### 패턴 B: 비교 분석

```javascript
const slide = pptx.addSlide();
addTitleBar(slide, '경쟁사 비교 분석');

// 좌측: 차트
addStyledChart(slide, 'BAR',
  [
    { name: '자사', labels: ['가격','품질','서비스','인지도'], values: [85, 92, 88, 70] },
    { name: '경쟁A', labels: ['가격','품질','서비스','인지도'], values: [90, 80, 75, 85] }
  ],
  { x: 0.6, y: 1.6, w: 6.5, h: 5.2, title: '' }
);

// 우측: 비교표
addStyledTable(slide, ['항목','자사','경쟁A'],
  [['가격', '85', '90'], ['품질', '92', '80'], ['서비스', '88', '75']],
  { x: 7.5, y: 1.6, w: 5.2 }
);
```

### 패턴 C: 프로젝트 대시보드

```javascript
const slide = pptx.addSlide();
addTitleBar(slide, '프로젝트 현황 대시보드', '2026년 2월 기준');

// 진행률 도넛
addStyledChart(slide, 'DOUGHNUT',
  [{ name: '진행', labels: ['완료','잔여'], values: [72, 28] }],
  { x: 0.6, y: 1.6, w: 4, h: 3, showTitle: false,
    chartColors: ['00D4AA', 'E2E8F0'] }
);

// 이슈 테이블
addStyledTable(slide, ['이슈','담당','상태','기한'],
  [['서버 지연', '김개발', '진행중', '2/20'],
   ['UI 버그', '박디자', '완료', '2/18']],
  { x: 5, y: 1.6, w: 7.7, rowH: [0.4, 0.35, 0.35] }
);

// 마일스톤 테이블
addStyledTable(slide, ['마일스톤','시작일','종료일','진행률','상태'],
  [['기획', '1/15', '2/10', '100%', '✅'],
   ['개발', '2/11', '4/30', '45%', '🔧'],
   ['테스트', '5/1', '5/31', '0%', '⏳']],
  { x: 0.6, y: 5.0, w: 12.13, rowH: [0.4, 0.35, 0.35, 0.35] }
);
```

---

## PptxGenJS 코드 컨벤션

```javascript
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 16:9

// 슬라이드 생성
const slide = pptx.addSlide();

// 저장
pptx.writeFile({ fileName: 'presentation.pptx' })
  .then(() => console.log('저장 완료: presentation.pptx'))
  .catch(err => console.error('저장 실패:', err));
```