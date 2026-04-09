# 슬라이드 레이아웃 레퍼런스

슬라이드 크기: 16:9 = 13.33" × 7.5" 콘텐츠 영역: x=0.6 \~ 12.73 (우측), y=0.5 \~ 7.0 (하단) 좌표 검증 원칙:

- x &lt; 0.6 금지 (풀블리드 배경 제외)
- x + w &gt; 12.73 금지 (풀블리드 배경 제외)
- y &lt; 0.5 금지 (풀블리드 배경 제외)
- y + h &gt; 7.0 금지 (풀블리드 배경 제외)

**콘텐츠 시작 y 기준값**: addTitleBar 사용 레이아웃은 모두 `y: 1.8`에서 콘텐츠 시작. 이 값을 일관되게 사용한다.

### 테이블 overflow 방지

테이블 행이 많으면 슬라이드 하단(y=7.0)을 넘어간다. 아래 규칙을 따른다:

- 행 8개 이하: 한 슬라이드에 배치 가능
- 행 9개 이상: 2개 슬라이드로 분할하거나, `rowH`를 줄여서 맞춤
- `rowH` 최소값: 0.3" (이하는 가독성 저하)
- 동적 계산: `rowH = Math.max(0.3, (7.0 - 1.8 - 0.4) / (rows + 1))` — 헤더 포함 총 행수로 나눔

---

## 1. Title Slide (표지)

```javascript
function createTitleSlide(pptx, title, subtitle, presenter, date) {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경 (x=0, y=0 허용)
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });

  // 장식용 accent 라인
  slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });

  // 메인 제목: x=1.5, y=2.5, w=10.33, h=1.2
  // 우측 끝: 1.5 + 10.33 = 11.83 < 12.73 ✓
  slide.addText(title, {
    x: 1.5, y: 2.5, w: 10.33, h: 1.2,
    fontSize: 44, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_on_dark, align: 'center',
    charSpacing: -0.5, lineSpacingMultiple: 1.1
  });

  // 부제목: x=1.5, y=3.8, w=10.33, h=0.6
  // 하단 끝: 3.8 + 0.6 = 4.4 < 7.0 ✓
  slide.addText(subtitle, {
    x: 1.5, y: 3.8, w: 10.33, h: 0.6,
    fontSize: 20, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 30, align: 'center'
  });

  // 발표자/날짜: x=1.5, y=6.0, w=10.33, h=0.4
  // 하단 끝: 6.0 + 0.4 = 6.4 < 7.0 ✓
  slide.addText(`${presenter}  |  ${date}`, {
    x: 1.5, y: 6.0, w: 10.33, h: 0.4,
    fontSize: 14, fontFace: 'Pretendard',
    color: 'FFFFFF', transparency: 50, align: 'center'
  });

  return slide;
}
```

---

## 2. Section Divider (섹션 구분)

```javascript
function createSectionSlide(pptx, sectionNum, sectionTitle, description) {
  const slide = pptx.addSlide();

  // 좌측 다크 패널 (40%): x=0, y=0, w=5.33
  // 5.33 / 13.33 ≈ 40% ✓
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });

  // 섹션 번호 (좌측): x=1.0, y=2.5, w=3.33, h=1.5
  // 우측 끝: 1.0 + 3.33 = 4.33 < 5.33 ✓
  slide.addText(String(sectionNum).padStart(2, '0'), {
    x: 1.0, y: 2.5, w: 3.33, h: 1.5,
    fontSize: 72, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });

  // 우측 섹션 제목: x=6.0, y=2.5, w=6.73, h=0.8
  // 우측 끝: 6.0 + 6.73 = 12.73 ≤ 12.73 ✓
  slide.addText(sectionTitle, {
    x: 6.0, y: 2.5, w: 6.73, h: 0.8,
    fontSize: 36, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary
  });

  // 우측 설명: x=6.0, y=3.5, w=6.73, h=1.0
  // 하단 끝: 3.5 + 1.0 = 4.5 < 7.0 ✓
  slide.addText(description, {
    x: 6.0, y: 3.5, w: 6.73, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4
  });

  return slide;
}
```

---

## 3. Two Column (2단 콘텐츠)

```javascript
// 컬럼 계산:
// 가용 폭: 12.13" (13.33 - 0.6 - 0.6)
// 컬럼 간 갭: 0.4"
// 각 컬럼 폭: (12.13 - 0.4) / 2 = 5.865"
// 좌측: x=0.6, w=5.865 → 우측 끝: 0.6 + 5.865 = 6.465
// 우측: x=6.865, w=5.865 → 우측 끝: 6.865 + 5.865 = 12.73 ✓

const COL_W = 5.865;
const COL_GAP = 0.4;
const COL_LEFT_X = 0.6;
const COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP; // 6.865

function createTwoColumnSlide(pptx, title, leftContent, rightContent) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // 좌측 소제목: x=0.6, y=1.8
  slide.addText(leftContent.title, {
    x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary
  });
  // 좌측 본문: x=0.6, y=2.35
  // 하단 끝: 2.35 + 4.35 = 6.7 < 7.0 ✓
  slide.addText(leftContent.body, {
    x: COL_LEFT_X, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });

  // 우측 소제목: x=6.865, y=1.8
  slide.addText(rightContent.title, {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.45,
    fontSize: 20, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary
  });
  // 우측 본문
  slide.addText(rightContent.body, {
    x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 4.35,
    fontSize: 16, fontFace: 'Pretendard',
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.4, valign: 'top'
  });

  return slide;
}
```

---

## 4. Card Grid (카드 그리드)

```javascript
// 2x2 레이아웃 계산:
// 가용 영역: x=0.6~12.73 (12.13"), y=1.8~7.0 (5.2")
// 카드 갭: 0.3"
// 카드 폭: (12.13 - 0.3) / 2 = 5.915"
// 카드 높이: (5.2 - 0.3) / 2 = 2.45"
// 위치:
//   TL: x=0.6,   y=1.8  → 우 끝: 6.515, 하 끝: 4.25 ✓
//   TR: x=6.815, y=1.8  → 우 끝: 12.73, 하 끝: 4.25 ✓
//   BL: x=0.6,   y=4.55 → 우 끝: 6.515, 하 끝: 7.0  ✓
//   BR: x=6.815, y=4.55 → 우 끝: 12.73, 하 끝: 7.0  ✓

const CARD_2X2 = {
  w: 5.915, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6,   y: 1.8  },
    { x: 6.815, y: 1.8  },
    { x: 0.6,   y: 4.55 },
    { x: 6.815, y: 4.55 }
  ]
};

// 2x3 레이아웃 계산:
// 카드 폭: (12.13 - 0.3*2) / 3 = 3.843"
// 카드 높이: (5.2 - 0.3) / 2 = 2.45"
// 위치 (col: 0,1,2 / row: 0,1):
//   Col 0: x=0.6,    Col 1: x=4.743, Col 2: x=8.886
//   우 끝(col2): 8.886 + 3.843 = 12.729 ≈ 12.73 ✓

const CARD_2X3 = {
  w: 3.843, h: 2.45, gap: 0.3,
  positions: [
    { x: 0.6,   y: 1.8  },
    { x: 4.743, y: 1.8  },
    { x: 8.886, y: 1.8  },
    { x: 0.6,   y: 4.55 },
    { x: 4.743, y: 4.55 },
    { x: 8.886, y: 4.55 }
  ]
};

function createCardGridSlide(pptx, title, cards, layout = '2x2') {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const config = layout === '2x3' ? CARD_2X3 : CARD_2X2;
  cards.forEach((card, i) => {
    if (i >= config.positions.length) return;
    const pos = config.positions[i];
    addCard(slide, {
      x: pos.x, y: pos.y, w: config.w, h: config.h,
      title: card.title, body: card.body,
      accentColor: CHART_STYLE.colors[i % CHART_STYLE.colors.length]
    });
  });

  return slide;
}
```

---

## 5. Timeline (타임라인)

```javascript
// 좌측 컬러 바: x=0.6, y=1.8, w=0.06, h=5.0
// 하단 끝: 1.8 + 5.0 = 6.8 < 7.0 ✓
// 항목 영역: x=1.0, y=1.8, w=11.73
// 우측 끝: 1.0 + 11.73 = 12.73 ✓

function createTimelineSlide(pptx, title, items) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // 세로 타임라인 바
  slide.addShape('rect', {
    x: 0.6, y: 1.8, w: 0.06, h: 5.0,
    fill: { color: COLORS.accent_blue }
  });

  const itemH = 5.0 / items.length;
  items.forEach((item, i) => {
    const itemY = 1.8 + i * itemH;

    // 타임라인 점
    slide.addShape('ellipse', {
      x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
      fill: { color: COLORS.accent_blue }
    });

    // 날짜/단계 레이블
    slide.addText(item.date || item.step, {
      x: 1.0, y: itemY, w: 2.0, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard', bold: true,
      color: COLORS.accent_blue
    });

    // 내용 제목
    slide.addText(item.title, {
      x: 1.0, y: itemY + 0.35, w: 11.73, h: 0.35,
      fontSize: 15, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary
    });

    // 내용 설명
    if (item.description) {
      slide.addText(item.description, {
        x: 1.0, y: itemY + 0.7, w: 11.73, h: itemH - 0.85,
        fontSize: 13, fontFace: 'Pretendard',
        color: COLORS.text_secondary, valign: 'top'
      });
    }

    // 구분선 (마지막 제외)
    if (i < items.length - 1) {
      slide.addShape('rect', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0.01,
        fill: { color: 'E2E8F0' }
      });
    }
  });

  return slide;
}
```

---

## 6. KPI Dashboard

```javascript
// 3 KPI 카드 계산:
// 카드 폭: (12.13 - 0.3*2) / 3 = 3.843"
// 카드 높이: 1.8"
// 카드 y=1.8, 하단 끝: 1.8 + 1.8 = 3.6 < 7.0 ✓
// 차트 영역: y=3.9, h=2.9, 하단 끝: 3.9 + 2.9 = 6.8 < 7.0 ✓

// 4 KPI 카드 계산:
// 카드 폭: (12.13 - 0.3*3) / 4 = 2.808"

function createKPIDashboardSlide(pptx, title, kpis, chartData) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const n = kpis.length;
  const gap = 0.3;
  const cardW = (12.13 - gap * (n - 1)) / n;
  const cardH = 1.8;

  kpis.forEach((kpi, i) => {
    const x = 0.6 + i * (cardW + gap);
    // 카드 배경
    slide.addShape('roundRect', {
      x, y: 1.8, w: cardW, h: cardH, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });
    // KPI 숫자
    slide.addText(kpi.value, {
      x: x + 0.15, y: 1.85, w: cardW - 0.3, h: 0.9,
      fontSize: 48, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: CHART_STYLE.colors[i % 6], align: 'center'
    });
    // KPI 라벨
    slide.addText(kpi.label, {
      x: x + 0.15, y: 2.8, w: cardW - 0.3, h: 0.35,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center'
    });
    // 변화율 (있을 경우)
    if (kpi.change) {
      slide.addText(kpi.change, {
        x: x + 0.15, y: 3.2, w: cardW - 0.3, h: 0.2,
        fontSize: 11, fontFace: 'Pretendard',
        color: kpi.change.startsWith('+') ? '27AE60' : 'EB5757',
        align: 'center'
      });
    }
  });

  // 차트 영역: x=0.6, y=3.9, w=12.13, h=2.9
  // 하단 끝: 3.9 + 2.9 = 6.8 < 7.0 ✓
  if (chartData) {
    addStyledChart(slide, chartData.type, chartData.data,
      { x: 0.6, y: 3.9, w: 12.13, h: 2.9, showTitle: false });
  }

  return slide;
}
```

---

## 7. Data Table (데이터 테이블)

```javascript
// 테이블: x=0.6, y=1.8, w=12.13
// 우측 끝: 0.6 + 12.13 = 12.73 ✓

function createDataTableSlide(pptx, title, headers, dataRows, opts = {}) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  addStyledTable(slide, headers, dataRows, {
    x: 0.6, y: 1.8, w: 12.13,
    ...opts
  });

  return slide;
}
```

---

## 8. Chart + Insight (차트 + 인사이트)

```javascript
// 계산:
// 가용 폭: 12.13"
// 갭: 0.3"
// 차트 (60%): w = 12.13 * 0.6 = 7.278 → 반올림 7.28"
// 인사이트 (40%): w = 12.13 - 7.28 - 0.3 = 4.55"
// 인사이트 x: 0.6 + 7.28 + 0.3 = 8.18
// 우측 끝: 8.18 + 4.55 = 12.73 ✓

const CHART_W = 7.28;
const INSIGHT_X = 8.18;
const INSIGHT_W = 4.55;

function createChartInsightSlide(pptx, title, chartData, insights) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // 차트: x=0.6, y=1.8, w=7.28, h=4.9
  // 하단 끝: 1.8 + 4.9 = 6.7 < 7.0 ✓
  addStyledChart(slide, chartData.type, chartData.data,
    { x: 0.6, y: 1.8, w: CHART_W, h: 4.9, title: '' });

  // 인사이트 영역 배경
  slide.addShape('roundRect', {
    x: INSIGHT_X, y: 1.8, w: INSIGHT_W, h: 4.9,
    rectRadius: 0.08, fill: { color: COLORS.bg_secondary }
  });

  // 인사이트 항목
  let yOffset = 2.0;
  insights.forEach((item, i) => {
    // 강조 숫자/레이블
    if (item.highlight) {
      slide.addText(item.highlight, {
        x: INSIGHT_X + 0.2, y: yOffset, w: INSIGHT_W - 0.4, h: 0.55,
        fontSize: 28, fontFace: 'Pretendard', bold: true,
        color: CHART_STYLE.colors[i % 6]
      });
      yOffset += 0.55;
    }
    // 설명 텍스트
    slide.addText(item.text, {
      x: INSIGHT_X + 0.2, y: yOffset, w: INSIGHT_W - 0.4, h: 0.5,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
    yOffset += 0.6;

    // 구분선 (마지막 제외)
    if (i < insights.length - 1) {
      slide.addShape('rect', {
        x: INSIGHT_X + 0.2, y: yOffset, w: INSIGHT_W - 0.4, h: 0.01,
        fill: { color: 'E2E8F0' }
      });
      yOffset += 0.2;
    }
  });

  return slide;
}
```

---

## 좌표 검증 요약표

| 레이아웃 | 핵심 좌표 | 검증 |
| --- | --- | --- |
| Title | bg: 0,0,13.33,7.5 / title: 1.5,2.5,10.33,1.2 | 풀블리드 ✓ |
| Section | left panel: 0,0,5.33,7.5 / right title: 6.0,2.5,6.73,0.8 | 끝 12.73 ✓ |
| Two Column | left: 0.6,1.8,5.865 / right: 6.865,1.8,5.865 | 끝 12.73 ✓ |
| Card Grid 2x2 | TL: 0.6,1.8 / BR: 6.815,4.55,5.915,2.45 | 끝 12.73,7.0 ✓ |
| Card Grid 2x3 | col0: 0.6 / col1: 4.743 / col2: 8.886,3.843 | 끝 12.729 ✓ |
| Timeline | bar: 0.6,1.8,0.06,5.0 / items: 1.0,1.8,11.73 | 끝 12.73 ✓ |
| KPI 3cards | card w=3.843,h=1.8 / chart: 0.6,3.9,12.13,2.9 | 끝 12.73,6.8 ✓ |
| Chart+Insight | chart: 0.6,1.8,7.28 / insight: 8.18,1.8,4.55 | 끝 12.73 ✓ |
| Content | content: 0.6,1.8,12.13,4.8 | 끝 12.73,6.6 ✓ |
| Quote | quote: 1.5,2.5,10.33,2.5 | 끝 11.83,5.0 ✓ |
| Process Flow (n=4) | stepW=2.808, steps: 0.6,1.8,h=4.8 / arrows "→" 사이 | 끝 12.73,6.6 ✓ |
| Funnel (n=4) | tier0: 0.6,1.8,12.13 → tier3: center,6.4+,4.0 | 끝 12.73,6.8 ✓ |
| Matrix | quadrants: CARD_2X2 / vline: 6.665,1.8 / hline: 0.6,4.4 | 끝 12.73,7.0 ✓ |
| Pyramid (n=4) | reversed calcTierCoords: top=3.0w, bottom=12.13w | 끝 12.73,6.8 ✓ |
| Venn | L-circle: 1.5,1.8,6.0 / R-circle: 5.83,1.8,6.0 | 끝 11.83,6.3 ✓ |
| Before/After | before: 0,1.8,6.465 / after: 6.865,1.8,5.865 | 끝 12.73,7.0 ✓ |
| Roadmap (n=4) | bar: 0.6,4.0,12.13,0.06 / above: y=1.8~3.8 / below: y=4.3~6.8 | 끝 12.73,6.8 ✓ |
| Stat Highlight | accent: 5.665,1.8,2.0 / stat: 0.6,2.0,12.13,1.5 / trend: 5.665,5.5,2.0 | 끝 12.73,5.9 ✓ |
| Icon Grid (2x3) | col0: 0.6 / col2: 8.686,3.843 / row1: 4.35,2.45 | 끝 12.529,6.8 ✓ |
| Layered Stack (n=4) | i=0(top): 0.6,y,12.13 / i=3(bot): 1.5,1.8,10.93 | 끝 12.73,7.0 ✓ |
| Comparison Table | table: 0.6,1.8,12.13 / rowH=dynamic / ✓green ✗red | 끝 12.73,7.0 ✓ |
| Closing | summary items: 0.6\~12.73 | 끝 12.73 ✓ |

---

## 9. Content Slide (일반 콘텐츠)

```javascript
// 콘텐츠 영역: x=0.6, y=1.8, w=12.13, h=4.8
// 하단 끝: 1.8 + 4.8 = 6.6 < 7.0 ✓
// 우측 끝: 0.6 + 12.13 = 12.73 ✓

function createContentSlide(pptx, title, bullets) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  slide.addText(bullets.map(b => ({
    text: b, options: { bullet: true, indentLevel: 0 }
  })), {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary,
    lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
  });

  return slide;
}
```

---

## 10. Quote Slide (인용구)

```javascript
// 인용 텍스트: x=1.5, y=2.5, w=10.33, h=2.5
// 우측 끝: 1.5 + 10.33 = 11.83 < 12.73 ✓
// 하단 끝: 2.5 + 2.5 = 5.0 < 7.0 ✓

function createQuoteSlide(pptx, quote, source) {
  const slide = pptx.addSlide();

  // 라이트 배경
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });

  // 강조 라인
  slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });

  // 인용 텍스트 (명조체): x=1.5, y=2.5, w=10.33, h=2.5
  slide.addText(`\u201C${quote}\u201D`, {
    x: 1.5, y: 2.5, w: 10.33, h: 2.5,
    fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true,
    color: COLORS.text_primary, align: 'center',
    lineSpacingMultiple: 1.5
  });

  // 출처: x=1.5, y=5.2, w=10.33, h=0.4
  // 하단 끝: 5.2 + 0.4 = 5.6 < 7.0 ✓
  if (source) {
    slide.addText(`\u2014 ${source}`, {
      x: 1.5, y: 5.2, w: 10.33, h: 0.4,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });
  }

  return slide;
}
```

---

## 12. Process Flow (프로세스 플로우)

```javascript
// 스텝 폭 계산 (n = 스텝 수):
// 가용 폭: 12.13"
// 화살표 텍스트 폭: 0.3" × (n-1)
// stepW = (12.13 - 0.3*(n-1)) / n
// 예) n=4: stepW = (12.13 - 0.9) / 4 = 2.808"
// 스텝 y=1.8, h=4.8 → 하단 끝: 1.8 + 4.8 = 6.6 < 7.0 ✓
// 각 스텝 accent 바: h=0.288 (stepH * 0.06)
// 첫 스텝 x=0.6, 우측 끝: 0.6 + n*(stepW+0.3) - 0.3 = 12.73 ✓

function createProcessFlowSlide(pptx, title, steps) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const n = steps.length;
  const arrowW = 0.3;
  const stepW = (12.13 - arrowW * (n - 1)) / n;
  const stepH = 4.8;
  const stepY = 1.8;

  steps.forEach((step, i) => {
    // 스텝 x 좌표: 0.6 + i*(stepW+arrowW)
    // 우측 끝: 0.6 + i*(stepW+arrowW) + stepW ≤ 12.73 ✓
    const x = 0.6 + i * (stepW + arrowW);

    // 스텝 배경 roundRect
    slide.addShape('roundRect', {
      x, y: stepY, w: stepW, h: stepH,
      rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });

    // 상단 accent 컬러 바: h = stepH*0.06 = 0.288
    // 하단 끝: stepY + 0.288 < 7.0 ✓
    slide.addShape('roundRect', {
      x, y: stepY, w: stepW, h: 0.288,
      rectRadius: 0.08,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] }
    });

    // 스텝 번호 레이블
    slide.addText(`${i + 1}`, {
      x: x + 0.1, y: stepY + 0.35, w: stepW - 0.2, h: 0.4,
      fontSize: 13, fontFace: 'Pretendard', bold: true,
      color: CHART_STYLE.colors[i % CHART_STYLE.colors.length],
      align: 'center'
    });

    // 스텝 제목 (16pt bold)
    slide.addText(step.title, {
      x: x + 0.1, y: stepY + 0.85, w: stepW - 0.2, h: 0.6,
      fontSize: 16, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary, align: 'center',
      autoFit: true
    });

    // 스텝 본문 (13pt)
    // 하단 끝: stepY + 1.55 + 2.9 = 6.25 < 7.0 ✓
    slide.addText(step.body, {
      x: x + 0.1, y: stepY + 1.55, w: stepW - 0.2, h: 2.9,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary,
      align: 'center', valign: 'top',
      lineSpacingMultiple: 1.4, autoFit: true
    });

    // 스텝 사이 화살표 "→" (마지막 스텝 제외)
    if (i < n - 1) {
      // 화살표 x: x + stepW, w=arrowW
      // 우측 끝: x + stepW + arrowW = 다음 스텝 시작 ✓
      slide.addText('→', {
        x: x + stepW, y: stepY + (stepH / 2) - 0.2,
        w: arrowW, h: 0.4,
        fontSize: 18, fontFace: 'Pretendard', bold: true,
        color: COLORS.text_tertiary, align: 'center'
      });
    }
  });

  return slide;
}
```

---

## 13. Funnel (깔때기)

```javascript
// 티어 좌표 계산:
// 가용 y: 1.8 ~ 6.8 (5.0")
// 티어 갭: 0.15"
// tierH = (5.0 - 0.15*(n-1)) / n
// 예) n=4: tierH = (5.0 - 0.45) / 4 = 1.1375"
// 각 티어 폭: maxW → minW (선형 감소)
// 티어 x = 0.6 + (12.13 - tierW) / 2 (센터 정렬)
// 최대 폭 우측 끝: 0.6 + 12.13 = 12.73 ✓
// 하단 끝: 6.8 < 7.0 ✓

function calcTierCoords(tierCount, { startY = 1.8, endY = 6.8, maxW = 12.13, minW = 4.0 } = {}) {
  const totalH = endY - startY;
  const gap = 0.15;
  const tierH = (totalH - gap * (tierCount - 1)) / tierCount;
  const tiers = [];
  for (let i = 0; i < tierCount; i++) {
    // 폭 선형 감소: 상단 maxW → 하단 minW
    const tierW = maxW - (maxW - minW) * (i / (tierCount - 1 || 1));
    const x = 0.6 + (maxW - tierW) / 2;
    // 우측 끝: x + tierW = 0.6 + (maxW - tierW)/2 + tierW ≤ 0.6 + maxW = 12.73 ✓
    const y = startY + i * (tierH + gap);
    tiers.push({ x, y, w: tierW, h: tierH });
  }
  return tiers;
}

function createFunnelSlide(pptx, title, tiers) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const coords = calcTierCoords(tiers.length, {
    startY: 1.8, endY: 6.8, maxW: 12.13, minW: 4.0
  });

  coords.forEach((coord, i) => {
    // 티어 roundRect
    slide.addShape('roundRect', {
      x: coord.x, y: coord.y, w: coord.w, h: coord.h,
      rectRadius: 0.06,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] }
    });

    // 티어 텍스트 (white, centered)
    slide.addText(tiers[i].label || tiers[i], {
      x: coord.x + 0.15, y: coord.y, w: coord.w - 0.3, h: coord.h,
      fontSize: 15, fontFace: 'Pretendard', bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle',
      autoFit: true
    });
  });

  return slide;
}
```

---

## 14. Matrix (2x2 매트릭스)

```javascript
// CARD_2X2 포지션 재사용:
//   TL: x=0.6,   y=1.8  → 우 끝: 6.515, 하 끝: 4.25 ✓
//   TR: x=6.815, y=1.8  → 우 끝: 12.73, 하 끝: 4.25 ✓
//   BL: x=0.6,   y=4.55 → 우 끝: 6.515, 하 끝: 7.0  ✓
//   BR: x=6.815, y=4.55 → 우 끝: 12.73, 하 끝: 7.0  ✓
// X축 레이블: x=0.6, y=6.9, w=12.13, h=0.35 → 하단 끝: 7.25 > 7.0 ⚠ → y=6.6, h=0.35 ✓
// Y축 레이블 (세로쓰기): x=0.1, y=1.8, w=0.4, h=5.2 → 우측 끝: 0.5 < 0.6 (배경 외부 허용)
// 중앙 축 수직선: x=6.665, y=1.8, w=0.01, h=5.2 → 하단 끝: 7.0 ✓
// 중앙 축 수평선: x=0.6, y=4.4, w=12.13, h=0.01 → 우측 끝: 12.73 ✓

function createMatrixSlide(pptx, title, quadrants, axisLabels = {}) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const labels = ['xHigh', 'xLow', 'yHigh', 'yLow'];

  // 4개 사분면 (CARD_2X2 포지션 재사용)
  CARD_2X2.positions.forEach((pos, i) => {
    if (i >= quadrants.length) return;

    slide.addShape('roundRect', {
      x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
      rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });

    // 사분면 제목 (16pt bold)
    slide.addText(quadrants[i].title, {
      x: pos.x + 0.15, y: pos.y + 0.1, w: CARD_2X2.w - 0.3, h: 0.45,
      fontSize: 16, fontFace: 'Pretendard', bold: true,
      color: COLORS.text_primary
    });

    // 사분면 본문 (13pt)
    // 하단 끝: pos.y + 0.65 + 1.65 ≤ 7.0 ✓
    slide.addText(quadrants[i].body, {
      x: pos.x + 0.15, y: pos.y + 0.65, w: CARD_2X2.w - 0.3, h: 1.65,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.3, valign: 'top', autoFit: true
    });
  });

  // 중앙 수직 구분선: x=6.665, y=1.8, w=0.01, h=5.2
  // 우측 끝: 6.665 + 0.01 = 6.675 < 12.73 ✓  하단 끝: 1.8 + 5.2 = 7.0 ✓
  slide.addShape('rect', {
    x: 6.665, y: 1.8, w: 0.01, h: 5.2,
    fill: { color: 'CBD5E0' }
  });

  // 중앙 수평 구분선: x=0.6, y=4.4, w=12.13, h=0.01
  // 우측 끝: 0.6 + 12.13 = 12.73 ✓
  slide.addShape('rect', {
    x: 0.6, y: 4.4, w: 12.13, h: 0.01,
    fill: { color: 'CBD5E0' }
  });

  // X축 레이블 (하단 중앙): x=0.6, y=6.6, w=12.13, h=0.35
  // 하단 끝: 6.6 + 0.35 = 6.95 < 7.0 ✓
  if (axisLabels.x) {
    slide.addText(axisLabels.x, {
      x: 0.6, y: 6.6, w: 12.13, h: 0.35,
      fontSize: 12, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center'
    });
  }

  // Y축 레이블 (세로쓰기 — 수직 텍스트): x=0.1, y=1.8, w=0.4, h=5.2
  // 우측 끝: 0.1 + 0.4 = 0.5 (풀블리드 영역 외부, 좌 여백 허용)
  if (axisLabels.y) {
    slide.addText(axisLabels.y, {
      x: 0.1, y: 1.8, w: 0.4, h: 5.2,
      fontSize: 12, fontFace: 'Pretendard',
      color: COLORS.text_tertiary, align: 'center', valign: 'middle',
      vert: 'eaVert'
    });
  }

  return slide;
}
```

---

## 15. Pyramid (피라미드)

```javascript
// 피라미드 = 깔때기의 역순 (하단이 가장 넓음)
// calcTierCoords 사용 후 배열 reverse
// 가용 y: 1.8 ~ 6.8 (5.0"), 갭: 0.15"
// tierH (n=4): (5.0 - 0.45) / 4 = 1.1375"
// 최대 폭 우측 끝: 0.6 + 12.13 = 12.73 ✓  하단 끝: 6.8 < 7.0 ✓

function createPyramidSlide(pptx, title, tiers) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // calcTierCoords 결과를 reverse → 상단이 좁고 하단이 넓어짐
  const coords = calcTierCoords(tiers.length, {
    startY: 1.8, endY: 6.8, maxW: 12.13, minW: 3.0
  }).reverse();

  coords.forEach((coord, i) => {
    // 티어 roundRect
    // 우측 끝: coord.x + coord.w ≤ 0.6 + 12.13 = 12.73 ✓
    slide.addShape('roundRect', {
      x: coord.x, y: coord.y, w: coord.w, h: coord.h,
      rectRadius: 0.06,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] }
    });

    // 티어 텍스트 (white, centered)
    slide.addText(tiers[i].label || tiers[i], {
      x: coord.x + 0.15, y: coord.y, w: coord.w - 0.3, h: coord.h,
      fontSize: 15, fontFace: 'Pretendard', bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle',
      autoFit: true
    });
  });

  return slide;
}
```

---

## 16. Venn (벤 다이어그램)

```javascript
// 2-원 벤 다이어그램:
// 좌측 원: x=1.5, y=1.8, w=6.0, h=4.5
//   우측 끝: 1.5 + 6.0 = 7.5 < 12.73 ✓  하단 끝: 1.8 + 4.5 = 6.3 < 7.0 ✓
// 우측 원: x=5.83, y=1.8, w=6.0, h=4.5
//   우측 끝: 5.83 + 6.0 = 11.83 < 12.73 ✓  하단 끝: 1.8 + 4.5 = 6.3 < 7.0 ✓
// 겹침 영역 x 중심 ≈ (7.5 + 5.83) / 2 = 6.665
// 좌측 레이블: x=1.8, y=3.5, w=3.5 → 우측 끝: 5.3 < 12.73 ✓
// 우측 레이블: x=8.0, y=3.5, w=3.5 → 우측 끝: 11.5 < 12.73 ✓
// 교차 레이블: x=5.0, y=3.5, w=3.33 → 우측 끝: 8.33 < 12.73 ✓

function createVennSlide(pptx, title, leftCircle, rightCircle, intersection) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // 좌측 원 (accent_blue, 40% 투명도)
  slide.addShape('ellipse', {
    x: 1.5, y: 1.8, w: 6.0, h: 4.5,
    fill: { color: COLORS.accent_blue, transparency: 40 },
    line: { color: COLORS.accent_blue, width: 1.5 }
  });

  // 우측 원 (accent_cyan, 40% 투명도)
  slide.addShape('ellipse', {
    x: 5.83, y: 1.8, w: 6.0, h: 4.5,
    fill: { color: COLORS.accent_cyan, transparency: 40 },
    line: { color: COLORS.accent_cyan, width: 1.5 }
  });

  // 좌측 레이블: x=1.8, y=3.5, w=3.5, h=1.0
  // 하단 끝: 3.5 + 1.0 = 4.5 < 7.0 ✓
  slide.addText(leftCircle.label, {
    x: 1.8, y: 3.5, w: 3.5, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, align: 'center', valign: 'middle',
    autoFit: true
  });

  // 좌측 설명 (있을 경우)
  if (leftCircle.body) {
    slide.addText(leftCircle.body, {
      x: 1.8, y: 4.6, w: 3.5, h: 1.0,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary, align: 'center', valign: 'top',
      autoFit: true
    });
  }

  // 우측 레이블: x=8.0, y=3.5, w=3.5, h=1.0
  // 우측 끝: 8.0 + 3.5 = 11.5 < 12.73 ✓
  slide.addText(rightCircle.label, {
    x: 8.0, y: 3.5, w: 3.5, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, align: 'center', valign: 'middle',
    autoFit: true
  });

  // 우측 설명 (있을 경우)
  if (rightCircle.body) {
    slide.addText(rightCircle.body, {
      x: 8.0, y: 4.6, w: 3.5, h: 1.0,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary, align: 'center', valign: 'top',
      autoFit: true
    });
  }

  // 교차 레이블: x=5.0, y=3.5, w=3.33, h=1.0
  // 우측 끝: 5.0 + 3.33 = 8.33 < 12.73 ✓
  slide.addText(intersection.label, {
    x: 5.0, y: 3.5, w: 3.33, h: 1.0,
    fontSize: 16, fontFace: 'Pretendard', bold: true,
    color: COLORS.text_primary, align: 'center', valign: 'middle',
    autoFit: true
  });

  // 교차 설명 (있을 경우)
  if (intersection.body) {
    slide.addText(intersection.body, {
      x: 5.0, y: 4.6, w: 3.33, h: 1.0,
      fontSize: 13, fontFace: 'Pretendard',
      color: COLORS.text_secondary, align: 'center', valign: 'top',
      autoFit: true
    });
  }

  return slide;
}
```

---

## 17. Before/After (전후 비교)

```javascript
// Two Column 상수 재사용:
//   COL_W = 5.865, COL_LEFT_X = 0.6, COL_RIGHT_X = 6.865
// Before 패널: x=0, y=1.8, w=6.465, h=5.2 (풀블리드 좌측)
//   우측 끝: 0 + 6.465 = 6.465 (갭 0.4" 전)  하단 끝: 1.8 + 5.2 = 7.0 ✓
// After 패널: x=6.865, y=1.8, w=5.865, h=5.2
//   우측 끝: 6.865 + 5.865 = 12.73 ✓  하단 끝: 1.8 + 5.2 = 7.0 ✓
// Before 레이블: x=0.6, y=1.85, w=5.865, h=0.4 → 하단 끝: 2.25 < 7.0 ✓
// After 레이블: x=COL_RIGHT_X, y=1.85, w=COL_W, h=0.4 → 우측 끝: 12.73 ✓
// 콘텐츠 y 시작: 2.35 (레이블 아래 0.1" 여유)
// 콘텐츠 h: 4.4 → 하단 끝: 2.35 + 4.4 = 6.75 < 7.0 ✓

function createBeforeAfterSlide(pptx, title, before, after) {
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // Before 패널 배경 (다크): x=0, y=1.8, w=6.465, h=5.2
  // 풀블리드 좌측 허용 (x=0)
  slide.addShape('rect', {
    x: 0, y: 1.8, w: 6.465, h: 5.2,
    fill: { color: COLORS.bg_dark }
  });

  // After 패널 배경 (라이트): x=6.865, y=1.8, w=5.865, h=5.2
  // 우측 끝: 6.865 + 5.865 = 12.73 ✓
  slide.addShape('rect', {
    x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 5.2,
    fill: { color: COLORS.bg_secondary }
  });

  // "BEFORE" 레이블: x=0.6, y=1.85, w=5.865, h=0.4
  // 우측 끝: 0.6 + 5.865 = 6.465 < 12.73 ✓
  slide.addText('BEFORE', {
    x: COL_LEFT_X, y: 1.85, w: COL_W, h: 0.4,
    fontSize: 13, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_red, align: 'center',
    charSpacing: 2
  });

  // "AFTER" 레이블: x=6.865, y=1.85, w=5.865, h=0.4
  // 우측 끝: 6.865 + 5.865 = 12.73 ✓
  slide.addText('AFTER', {
    x: COL_RIGHT_X, y: 1.85, w: COL_W, h: 0.4,
    fontSize: 13, fontFace: 'Pretendard', bold: true,
    color: COLORS.accent_cyan, align: 'center',
    charSpacing: 2
  });

  // Before 구분선: x=0.6, y=2.3, w=5.865, h=0.01
  // 우측 끝: 0.6 + 5.865 = 6.465 < 12.73 ✓
  slide.addShape('rect', {
    x: COL_LEFT_X, y: 2.3, w: COL_W, h: 0.01,
    fill: { color: COLORS.accent_red }
  });

  // After 구분선: x=6.865, y=2.3, w=5.865, h=0.01
  // 우측 끝: 6.865 + 5.865 = 12.73 ✓
  slide.addShape('rect', {
    x: COL_RIGHT_X, y: 2.3, w: COL_W, h: 0.01,
    fill: { color: COLORS.accent_cyan }
  });

  // Before 콘텐츠: x=0.6, y=2.35, w=5.865, h=4.4
  // 하단 끝: 2.35 + 4.4 = 6.75 < 7.0 ✓
  slide.addText(before.bullets || before.body || '', {
    x: COL_LEFT_X, y: 2.35, w: COL_W, h: 4.4,
    fontSize: 15, fontFace: 'Pretendard',
    color: COLORS.text_on_dark,
    lineSpacingMultiple: 1.5, valign: 'top', autoFit: true
  });

  // After 콘텐츠: x=6.865, y=2.35, w=5.865, h=4.4
  // 우측 끝: 6.865 + 5.865 = 12.73 ✓  하단 끝: 2.35 + 4.4 = 6.75 < 7.0 ✓
  slide.addText(after.bullets || after.body || '', {
    x: COL_RIGHT_X, y: 2.35, w: COL_W, h: 4.4,
    fontSize: 15, fontFace: 'Pretendard',
    color: COLORS.text_primary,
    lineSpacingMultiple: 1.5, valign: 'top', autoFit: true
  });

  return slide;
}
```

---

## 18. Roadmap (수평 로드맵)

```javascript
// 수평 바: x=0.6, y=4.0, w=12.13, h=0.06
//   우측 끝: 0.6 + 12.13 = 12.73 ✓  하단 끝: 4.0 + 0.06 = 4.06 < 7.0 ✓
// 마일스톤 점 (ellipse, w=0.3, h=0.3): 바 중앙에 걸침 → cy = 4.03, 점 y = 4.03 - 0.15 = 3.88
//   x_i = 0.6 + i * (12.13 / (n-1)) - 0.15  (점 중심 정렬)
// 홀수 i (0,2,4): 콘텐츠 위쪽 y=1.8 ~ 3.8 (h 최대 2.0)
// 짝수 i (1,3,5): 콘텐츠 아래쪽 y=4.3 ~ 6.8 (h 최대 2.5)
// colW = 12.13 / n - 0.2  (n = 마일스톤 개수)
//   n=4 예: colW = 12.13/4 - 0.2 = 2.8325  우측 끝(마지막 col): 0.6 + 3*(12.13/3) + 2.8325 ≤ 12.73 ✓

function createRoadmapSlide(pptx, title, milestones) {
  // milestones: [{ phase, label, title, description }, ...]
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const n = milestones.length;
  const BAR_X = 0.6;
  const BAR_Y = 4.0;
  const BAR_W = 12.13;
  const colW = BAR_W / n - 0.2;
  const step = n > 1 ? BAR_W / (n - 1) : 0;

  // 수평 바: x=0.6, y=4.0, w=12.13, h=0.06
  // 우측 끝: 0.6 + 12.13 = 12.73 ✓
  slide.addShape('rect', {
    x: BAR_X, y: BAR_Y, w: BAR_W, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });

  milestones.forEach((m, i) => {
    const cx = BAR_X + i * step;
    const dotX = cx - 0.15;
    // 우측 끝 검증: dotX + 0.3 = cx + 0.15 ≤ 12.73 ✓ (마지막 i: 0.6+12.13+0.15-0.15=12.73)

    // 마일스톤 점 (ellipse)
    slide.addShape('ellipse', {
      x: dotX, y: BAR_Y - 0.15, w: 0.3, h: 0.3,
      fill: { color: COLORS.accent_blue }
    });

    const isAbove = i % 2 === 0;
    const colX = cx - colW / 2;
    // 콘텐츠 x 범위 보정: 첫 번째는 BAR_X 기준
    const safeX = Math.max(BAR_X, colX);

    if (isAbove) {
      // 위쪽 콘텐츠: y=1.8, 총 h=2.0 (하단 끝 3.8 < 4.0 ✓)
      slide.addText(m.phase || m.label || '', {
        x: safeX, y: 1.8, w: colW, h: 0.35,
        fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.accent_blue, align: 'center', autoFit: true
      });
      slide.addText(m.title || '', {
        x: safeX, y: 2.2, w: colW, h: 0.45,
        fontSize: 15, fontFace: FONTS.body.fontFace, bold: true,
        color: COLORS.text_primary, align: 'center', autoFit: true
      });
      slide.addText(m.description || '', {
        x: safeX, y: 2.7, w: colW, h: 1.1,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, align: 'center',
        lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
      });
    } else {
      // 아래쪽 콘텐츠: y=4.3, 총 h=2.5 (하단 끝 6.8 < 7.0 ✓)
      slide.addText(m.phase || m.label || '', {
        x: safeX, y: 4.3, w: colW, h: 0.35,
        fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.accent_blue, align: 'center', autoFit: true
      });
      slide.addText(m.title || '', {
        x: safeX, y: 4.7, w: colW, h: 0.45,
        fontSize: 15, fontFace: FONTS.body.fontFace, bold: true,
        color: COLORS.text_primary, align: 'center', autoFit: true
      });
      slide.addText(m.description || '', {
        x: safeX, y: 5.2, w: colW, h: 1.6,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, align: 'center',
        lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
      });
    }
  });

  return slide;
}
```

---

## 19. Stat Highlight (통계 강조)

```javascript
// accent 라인: x=5.665, y=1.8, w=2.0, h=0.06
//   우측 끝: 5.665 + 2.0 = 7.665 < 12.73 ✓
// 큰 숫자: x=0.6, y=2.0, w=12.13, h=1.5
//   우측 끝: 0.6 + 12.13 = 12.73 ✓  하단 끝: 2.0 + 1.5 = 3.5 < 7.0 ✓
// 레이블: x=0.6, y=3.6, w=12.13, h=0.5
//   하단 끝: 3.6 + 0.5 = 4.1 < 7.0 ✓
// 맥락 텍스트: x=1.5, y=4.3, w=10.33, h=1.0
//   우측 끝: 1.5 + 10.33 = 11.83 < 12.73 ✓  하단 끝: 4.3 + 1.0 = 5.3 < 7.0 ✓
// 트렌드 지표: x=5.665, y=5.5, w=2.0, h=0.4
//   우측 끝: 5.665 + 2.0 = 7.665 < 12.73 ✓  하단 끝: 5.5 + 0.4 = 5.9 < 7.0 ✓

function createStatHighlightSlide(pptx, title, stat, label, context, trend) {
  // trend: { value: '+12%', positive: true } or null
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  // accent 라인: x=5.665, y=1.8, w=2.0, h=0.06
  // 우측 끝: 5.665 + 2.0 = 7.665 < 12.73 ✓
  slide.addShape('rect', {
    x: 5.665, y: 1.8, w: 2.0, h: 0.06,
    fill: { color: COLORS.accent_blue }
  });

  // 큰 숫자: x=0.6, y=2.0, w=12.13, h=1.5
  // 우측 끝: 0.6 + 12.13 = 12.73 ✓
  slide.addText(stat, {
    x: 0.6, y: 2.0, w: 12.13, h: 1.5,
    fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
    color: COLORS.accent_blue, align: 'center', valign: 'middle',
    autoFit: true
  });

  // 레이블: x=0.6, y=3.6, w=12.13, h=0.5
  // 하단 끝: 3.6 + 0.5 = 4.1 < 7.0 ✓
  slide.addText(label, {
    x: 0.6, y: 3.6, w: 12.13, h: 0.5,
    fontSize: 20, fontFace: FONTS.subtitle.fontFace,
    color: COLORS.text_primary, align: 'center', autoFit: true
  });

  // 맥락 텍스트: x=1.5, y=4.3, w=10.33, h=1.0
  // 우측 끝: 1.5 + 10.33 = 11.83 < 12.73 ✓
  if (context) {
    slide.addText(context, {
      x: 1.5, y: 4.3, w: 10.33, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, align: 'center',
      lineSpacingMultiple: 1.4, autoFit: true
    });
  }

  // 트렌드 지표 (optional): x=5.665, y=5.5, w=2.0, h=0.4
  // 우측 끝: 5.665 + 2.0 = 7.665 < 12.73 ✓
  if (trend) {
    slide.addText(trend.value, {
      x: 5.665, y: 5.5, w: 2.0, h: 0.4,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: trend.positive ? '27AE60' : 'EB5757',
      align: 'center', autoFit: true
    });
  }

  return slide;
}
```

---

## 20. Icon Grid (아이콘 그리드)

```javascript
// CARD_2X3 재사용: colW=3.843, rowH=2.45
// 2열 3행 레이아웃: 6개 항목
//   col0 x=0.6, col1 x=4.643, col2 x=8.686
//   우측 끝: 8.686 + 3.843 = 12.529 ≤ 12.73 ✓
//   row0 y=1.8, row1 y=4.35
//   하단 끝: 4.35 + 2.45 = 6.8 < 7.0 ✓
// GAP = 0.2 (col), 0.1 (row)
// 각 카드: icon 영역 h=0.6 (28pt), title h=0.4 (16pt bold), body h=1.2 (13pt)

const ICON_GRID_COLS = 3;
const ICON_GRID_COL_W = 3.843;
const ICON_GRID_ROW_H = 2.45;
const ICON_GRID_COL_GAP = 0.2;
const ICON_GRID_ROW_GAP = 0.1;

function createIconGridSlide(pptx, title, items) {
  // items: [{ icon, title, body }, ...] — 최대 6개 (2x3)
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const cols = ICON_GRID_COLS;
  const colW = ICON_GRID_COL_W;
  const rowH = ICON_GRID_ROW_H;
  const colGap = ICON_GRID_COL_GAP;
  const rowGap = ICON_GRID_ROW_GAP;
  const startX = 0.6;
  const startY = 1.8;

  items.slice(0, 6).forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (colW + colGap);
    const y = startY + row * (rowH + rowGap);
    // 우측 끝: x + colW = 0.6 + 2*(3.843+0.2) + 3.843 = 12.529 ≤ 12.73 ✓
    // 하단 끝: y + rowH = 1.8 + 1*(2.45+0.1) + 2.45 = 6.8 < 7.0 ✓

    // 카드 배경 (roundRect)
    slide.addShape('roundRect', {
      x, y, w: colW, h: rowH,
      fill: { color: COLORS.bg_secondary },
      rectRadius: 0.1
    });

    // 아이콘 (emoji/텍스트 심볼): h=0.6, 28pt
    slide.addText(item.icon || '●', {
      x, y: y + 0.1, w: colW, h: 0.6,
      fontSize: 28, align: 'center', valign: 'middle',
      autoFit: true
    });

    // 제목: h=0.4, 16pt bold
    slide.addText(item.title || '', {
      x, y: y + 0.75, w: colW, h: 0.4,
      fontSize: 16, fontFace: FONTS.body.fontFace, bold: true,
      color: COLORS.text_primary, align: 'center', autoFit: true
    });

    // 본문: h=1.2, 13pt
    slide.addText(item.body || '', {
      x, y: y + 1.2, w: colW, h: 1.1,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, align: 'center',
      lineSpacingMultiple: 1.4, valign: 'top', autoFit: true
    });
  });

  return slide;
}
```

---

## 21. Layered Stack (레이어 스택)

```javascript
// n개 레이어, offset=0.3
// layerH = (7.0 - 1.8 - offset*(n-1)) / n  — 각 레이어 높이 (균등 분할 아님, 전체 채움)
// 실제로는 전체 높이 H = 7.0 - 1.8 = 5.2를 n개로 나누되 offset 고려
// 레이어 i (0=맨위, n-1=맨아래):
//   x_i = 0.6 + offset*i
//   y_i = 1.8 + offset*(n-1-i)
//   w_i = 12.13 - offset*i*2
//   h_i = layerH (고정)
// 그리기 순서: i=n-1(맨아래/가장 큰 것)부터 i=0(맨위/가장 작은 것)까지
// n=4, offset=0.3 예시:
//   layerH = (5.2 - 0.3*3) / 1 → 전체를 채우는 방식이므로:
//   layer i=3 (bottom): x=1.5, y=1.8, w=10.93, h=layerH
//   layer i=0 (top):    x=0.6, y=2.7, w=12.13, h=layerH
//   우측 끝 (i=0): 0.6 + 12.13 = 12.73 ✓
//   하단 끝: y_i + layerH ≤ 7.0 ✓ (설계상)

function createLayeredStackSlide(pptx, title, layers) {
  // layers: [{ title, body }, ...] — index 0 = 맨 위 (최상위 레이어)
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const n = layers.length;
  const offset = 0.3;
  const totalH = 7.0 - 1.8 - offset * (n - 1);
  const layerH = totalH / n;

  // 맨 아래(i=n-1)부터 위로 그려야 z-order 정확
  for (let i = n - 1; i >= 0; i--) {
    const lx = 0.6 + offset * i;
    const ly = 1.8 + offset * (n - 1 - i);
    const lw = 12.13 - offset * i * 2;
    // 우측 끝: lx + lw = 0.6 + offset*i + 12.13 - offset*i*2 = 12.73 - offset*i ≤ 12.73 ✓
    // 하단 끝: ly + layerH ≤ 7.0 ✓

    slide.addShape('roundRect', {
      x: lx, y: ly, w: lw, h: layerH,
      fill: { color: CHART_STYLE.colors[i % CHART_STYLE.colors.length] },
      rectRadius: 0.08
    });

    // 제목: 16pt white bold, 좌측 패딩 0.3
    slide.addText(layers[i].title || '', {
      x: lx + 0.3, y: ly + 0.05, w: lw - 0.6, h: layerH * 0.4,
      fontSize: 16, fontFace: FONTS.body.fontFace, bold: true,
      color: 'FFFFFF', valign: 'middle', autoFit: true
    });

    // 본문: 13pt white
    if (layers[i].body) {
      slide.addText(layers[i].body, {
        x: lx + 0.3, y: ly + layerH * 0.4, w: lw - 0.6, h: layerH * 0.55,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: 'FFFFFF', valign: 'top',
        lineSpacingMultiple: 1.3, autoFit: true
      });
    }
  }

  return slide;
}
```

---

## 22. Comparison Table (비교표)

```javascript
// addStyledTable 기반: x=0.6, y=1.8, w=12.13
// 우측 끝: 0.6 + 12.13 = 12.73 ✓
// 첫 번째 열: 기능명 (bold, left-aligned)
// 이후 열: 옵션명 헤더 + ✓/✗ 마크
// ✓ = color '27AE60' (green), bold
// ✗ = color 'EB5757' (red), bold
// 헤더 행: CHART_STYLE.colors[colIdx] 배경
// 동적 rowH: rowH = Math.max(0.3, (7.0 - 1.8 - 0.4) / (rows + 1))
// 예: rows=5, n=3 options → rowH = Math.max(0.3, 4.8/6) = 0.8
// 하단 끝: 1.8 + (rows+1)*rowH ≤ 7.0 ✓ (동적 계산 보장)

function createComparisonTableSlide(pptx, title, features, options, matrix) {
  // features: ['기능A', '기능B', ...]
  // options:  ['플랜1', '플랜2', '플랜3']
  // matrix:   2D boolean array [featureIdx][optionIdx]
  const slide = pptx.addSlide();
  addTitleBar(slide, title);

  const rows = features.length;
  const cols = options.length + 1; // +1 for feature column
  const rowH = Math.max(0.3, (7.0 - 1.8 - 0.4) / (rows + 1));
  // 하단 끝: 1.8 + (rows+1)*rowH ≤ 7.0 ✓
  const colW = 12.13 / cols;

  // 헤더 행 구성
  const headerRow = [
    { text: '', options: { bold: true, fill: COLORS.bg_secondary } },
    ...options.map((opt, ci) => ({
      text: opt,
      options: {
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        fill: CHART_STYLE.colors[ci % CHART_STYLE.colors.length]
      }
    }))
  ];

  // 데이터 행 구성
  const dataRows = features.map((feat, ri) => [
    { text: feat, options: { bold: true, align: 'left', color: COLORS.text_primary } },
    ...options.map((_, ci) => ({
      text: matrix[ri][ci] ? '✓' : '✗',
      options: {
        bold: true,
        align: 'center',
        color: matrix[ri][ci] ? '27AE60' : 'EB5757'
      }
    }))
  ]);

  // 테이블 렌더링: x=0.6, y=1.8, w=12.13
  // 우측 끝: 0.6 + 12.13 = 12.73 ✓
  addStyledTable(slide, [headerRow, ...dataRows], {
    x: 0.6, y: 1.8, w: 12.13,
    colW: Array(cols).fill(colW),
    rowH,
    fontSize: 14,
    fontFace: FONTS.body.fontFace,
    border: { pt: 1, color: COLORS.border }
  });

  return slide;
}
```

---

## 11. Closing Slide (마무리)

```javascript
// 요약 항목: y=1.9 시작, 항목당 0.75" 간격
// 3개 항목 시: 마지막 y = 1.9 + 2*0.75 = 3.4, 하단 끝 3.4+0.55=3.95 < 7.0 ✓
// 구분선 이후 연락처: divY + 0.3 + 0.5 < 7.0 ✓

function createClosingSlide(pptx, summaryPoints, cta, contact) {
  const slide = pptx.addSlide();
  addTitleBar(slide, cta || '감사합니다');

  // 요약 포인트
  if (summaryPoints && summaryPoints.length > 0) {
    summaryPoints.forEach((point, i) => {
      const y = 1.9 + i * 0.75;
      // 번호 원형
      slide.addShape('ellipse', {
        x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
        fill: { color: COLORS.accent_blue }
      });
      slide.addText(`${i + 1}`, {
        x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_on_dark, align: 'center', valign: 'middle'
      });
      // 포인트 텍스트
      // 우측 끝: 1.5 + 11.23 = 12.73 ✓
      slide.addText(point, {
        x: 1.5, y: y, w: 11.23, h: 0.55,
        fontSize: 16, fontFace: FONTS.body.fontFace,
        color: COLORS.text_primary, valign: 'middle'
      });
    });
  }

  // 구분선
  const divY = summaryPoints ? 1.9 + summaryPoints.length * 0.75 + 0.3 : 3.5;
  slide.addShape('rect', {
    x: 0.6, y: divY, w: 12.13, h: 0.01,
    fill: { color: 'E2E8F0' }
  });

  // 연락처 (있을 경우)
  if (contact) {
    slide.addText(contact, {
      x: 0.6, y: divY + 0.3, w: 12.13, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });
  }

  return slide;
}
```