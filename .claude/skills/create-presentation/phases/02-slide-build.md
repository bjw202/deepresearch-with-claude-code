# Phase 2: Slide Builders (병렬)

승인된 아웃라인을 기반으로 PptxGenJS 코드를 병렬 생성하는 서브에이전트.

## 파트 분할 기준

총 슬라이드 수 / 10~15 (각 파트 10~15장). 예: 28장 → 3파트, 45장 → 4파트.

## 서브에이전트 설정

```
model: sonnet
mode: bypassPermissions
run_in_background: true
```

## 메인이 발사 전 해야 할 일

1. 해당 파트의 아웃라인 슬라이드 전체 내용을 프롬프트에 직접 붙여넣기
2. 필요한 수치/기술 데이터를 프롬프트 안에 inline으로 제공
3. 파일 경로는 산출물 저장 경로만 전달 (읽기용 경로 전달 금지 — 파일 탐색은 스톨 원인)
4. SKILL.md의 "시각적 품질 가드레일" + "OOXML 호환성" + "네이티브 요소 매핑" 섹션 전문을 프롬프트에 삽입
5. `references/pptxgenjs-patterns.md`의 상수 + 헬퍼 함수 코드를 **첫 번째 파트의 프롬프트에만** 삽입 (Slide Builder가 직접 Read하지 않도록 — 스톨 방지)
6. `references/slide-layouts.md`에서 **해당 파트에 포함된 슬라이드 타입의 좌표만** 추출하여 프롬프트에 삽입
7. 색상 팔레트 변경 요청 시에만 `references/design-system.md`의 해당 팔레트 섹션을 삽입

## Slide Builder 프롬프트 템플릿

```
# 역할: Slide Builder — PptxGenJS 코드 생성

## 중요: 파일 읽기 금지
리서치 파일이나 다른 파일을 읽지 말 것. 아래 제공된 아웃라인과 콘텐츠만으로 즉시 코드를 작성한다.

## 임무
아래 아웃라인의 슬라이드 {시작번호}~{끝번호}를 PptxGenJS 코드로 작성하라.

## 아웃라인
{해당 범위의 아웃라인}

## 콘텐츠 소스
{메인이 리서치에서 추출한 내용 — 빌더는 파일을 읽지 않음}

## 코드 규칙

### 파트 역할 (중요)
이 파트는 {첫 번째 파트|후속 파트}이다.

**첫 번째 파트만 포함하는 것:**
- PptxGenJS 초기화 (require, new PptxGenJS(), LAYOUT_WIDE, TOTAL_SLIDES)
- 모든 상수 (COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE)
- 모든 레이아웃 상수 (CARD_2X2, CARD_2X3, COL_W 등)
- 모든 헬퍼 함수 (addTitleBar, addStyledTable 등)

**후속 파트는 슬라이드 함수만 작성한다.**

### 모든 파트 공통 금지사항 (위반 시 합치기 실패)
1. 함수 호출문 금지 — slideNN_name(); 같은 실행문 금지. 합치기 단계에서 자동 생성
2. pptx.writeFile() 금지 — 합치기 단계에서 추가

### 후속 파트 추가 금지사항
1. 상수 재정의 금지 — const COLORS, const FONTS, const TABLE_STYLE, const TOTAL_SLIDES 등
2. 헬퍼 함수 재정의 금지 — function addTitleBar, addCard 등
3. 축약 상수명 금지 — 아래 목록의 정확한 이름만 사용

### 사용 가능한 상수 키

COLORS: bg_primary, bg_secondary, bg_dark,
  text_primary, text_secondary, text_tertiary, text_on_dark,
  accent_blue, accent_cyan, accent_yellow, accent_red, accent_purple

FONTS: title (.fontFace, .bold), subtitle, body, caption, serif, kpi, deco
  사용법: fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold

### 헬퍼 함수 시그니처

addTitleBar(slide, title, subtitle)
addStyledTable(slide, headers, dataRows, opts)
addTitledTable(slide, tableTitle, headers, dataRows, opts)
addStyledChart(slide, type, chartData, opts)
addCard(slide, { x, y, w, h, title, body, accentColor })
addPageNumber(slide, num, total)
calcTierCoords(tierCount, opts)
addProcessFlow(slide, steps)        // steps: [{title, body}]
addFunnel(slide, tiers)             // tiers: [{label, value?}]
addMatrix(slide, quadrants, axisLabels)
addPyramid(slide, tiers)            // tiers: [{label, description?}]
addVenn(slide, circles, intersection)
addBeforeAfter(slide, before, after)
addRoadmap(slide, milestones)       // milestones: [{date, title, description?}]
addStatHighlight(slide, { number, label, context, trend })
addIconGrid(slide, items, layout)   // items: [{icon, title, body}]
addLayeredStack(slide, layers)      // layers: [{title, body}]
addComparisonTable(slide, features, options)

### 프로퍼티명 혼동 주의 (빈 슬라이드 원인 #1)

| 헬퍼 | 올바른 프로퍼티 | 흔한 실수 |
|------|----------------|-----------|
| addProcessFlow | {title, body} | {label, description} |
| addLayeredStack | {title, body} | {label, description} |
| addCard | {title, body} | {label, description} |
| addIconGrid | {icon, title, body} | {icon, label, description} |
| addMatrix quadrants | {title, body} | {label, description} |
| addFunnel | {label, value} | {title, body} |
| addPyramid | {label, description} | {title, body} |
| addRoadmap | {date, title, description} | {date, label, body} |
| addStatHighlight | {number, label, context, trend} | {number, title, body} |

### 슬라이드 함수 패턴

function slideNN_name() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '액션 타이틀');
  // ... 콘텐츠
  addPageNumber(slide, NN, TOTAL_SLIDES);
}

[시각적 품질 가드레일]
{메인이 SKILL.md의 "시각적 품질 가드레일" + "OOXML 호환성" + "네이티브 요소 매핑" 섹션을 여기에 삽입}
[시각적 품질 가드레일 끝]
```

## 산출물

파일: {프레젠테이션 폴더}/part-{N}.js

- 첫 줄: `// === Part {N} 시작 ===`
- 마지막 줄: `// === Part {N} 끝 ===`
- 모든 파트: 함수 정의만 포함. 호출문 및 writeFile 포함 금지
