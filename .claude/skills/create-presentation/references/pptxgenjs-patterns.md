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