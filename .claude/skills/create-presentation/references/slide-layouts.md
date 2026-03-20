# 슬라이드 레이아웃 레퍼런스

슬라이드 크기: 16:9 = 13.33" × 7.5" 콘텐츠 영역: x=0.6 \~ 12.73 (우측), y=0.5 \~ 7.0 (하단) 좌표 검증 원칙:

- x &lt; 0.6 금지 (풀블리드 배경 제외)
- x + w &gt; 12.73 금지 (풀블리드 배경 제외)
- y &lt; 0.5 금지 (풀블리드 배경 제외)
- y + h &gt; 7.0 금지 (풀블리드 배경 제외)

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
  slide.addText(`0${sectionNum}`, {
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
      slide.addShape('line', {
        x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
        line: { color: 'E2E8F0', width: 0.5 }
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
    addStyledChart(slide, pptx, chartData.type, chartData.data,
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
  addStyledChart(slide, pptx, chartData.type, chartData.data,
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
      slide.addShape('line', {
        x: INSIGHT_X + 0.2, y: yOffset, w: INSIGHT_W - 0.4, h: 0,
        line: { color: 'E2E8F0', width: 0.5 }
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
  slide.addShape('line', {
    x: 0.6, y: divY, w: 12.13, h: 0,
    line: { color: 'E2E8F0', width: 0.5 }
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