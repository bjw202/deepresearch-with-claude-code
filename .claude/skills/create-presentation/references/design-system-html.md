# 디자인 시스템 — HTML/CSS 버전

Pencil MCP → HTML 슬라이드 파이프라인용 디자인 토큰 및 CSS 변수.

---

## CSS 변수 전체 정의

```css
:root {
  /* 배경 (60%) */
  --bg-primary:   #FFFFFF;
  --bg-secondary: #F5F7FA;
  --bg-dark:      #1A1F36;

  /* 텍스트 (30%) */
  --text-primary:   #1A1F36;
  --text-secondary: #4A5568;
  --text-tertiary:  #718096;
  --text-on-dark:   #FFFFFF;

  /* 강조 (10%) */
  --accent-blue:   #4A7BF7;
  --accent-cyan:   #00D4AA;
  --accent-yellow: #FFB020;
  --accent-red:    #FF6B6B;
  --accent-purple: #8B5CF6;

  /* 연한 accent (정보 박스) */
  --light-blue:   #EBF0FF;
  --light-cyan:   #E6FAF5;
  --light-yellow: #FFF8E6;
  --light-red:    #FFF0F0;
  --light-purple: #F3EEFF;

  /* 테두리 */
  --border-light: #E2E8F0;

  /* 타이포그래피 */
  --font-sans: 'Pretendard', -apple-system, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  --font-serif: '조선일보명조', 'Nanum Myeongjo', Georgia, serif;

  /* 슬라이드 치수 */
  --slide-w: 1280px;
  --slide-h: 720px;
  --pad-x: 64px;
  --pad-y: 48px;
}
```

---

## 추가 팔레트

### Warm Corporate

```css
:root {
  --bg-dark:      #2D1B4E;
  --accent-blue:  #E8725A;
  --accent-cyan:  #4ECDC4;
  --accent-yellow:#F9C74F;
  --accent-purple:#7B68EE;
}
```

### Nature Green

```css
:root {
  --bg-dark:      #1B3A2D;
  --accent-blue:  #2D9CDB;
  --accent-cyan:  #27AE60;
  --accent-yellow:#F2C94C;
  --accent-red:   #EB5757;
}
```

### Minimal Mono

```css
:root {
  --bg-dark:      #111111;
  --accent-blue:  #333333;
  --accent-cyan:  #666666;
  --accent-yellow:#AAAAAA;
}
```

---

## 타이포그래피 스케일

| 역할 | CSS | rem | 설명 |
| --- | --- | --- | --- |
| Hero Title (표지) | `.title-hero` | 2.5\~3rem | ExtraBold/Black |
| Slide Title | `.title-slide` | 1.75\~2rem | Bold |
| Section Title | `.title-section` | 2\~2.5rem | ExtraBold |
| Body | `.body-text` | 1\~1.1rem | Regular/Medium |
| Caption | `.caption` | 0.75\~0.875rem | Light/Regular |
| KPI Number | `.kpi-number` | 3\~5rem | Black |
| Quote | `.quote-text` | 1.25\~1.5rem | Serif Italic |
| Badge | `.badge` | 0.75rem | Medium |

### font-weight 매핑

| Pretendard Weight | CSS value |
| --- | --- |
| Thin (100) | 100 |
| ExtraLight (200) | 200 |
| Light (300) | 300 |
| Regular (400) | 400 |
| Medium (500) | 500 |
| SemiBold (600) | 600 |
| Bold (700) | 700 |
| ExtraBold (800) | 800 |
| Black (900) | 900 |

---

## 슬라이드 엔진 기반 CSS

```css
/* 슬라이드 덱 */
.deck {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

/* 개별 슬라이드 */
.slide {
  position: absolute;
  inset: 0;
  width: var(--slide-w);
  height: var(--slide-h);
  /* 뷰포트에 맞게 스케일 */
  transform: scale(var(--scale, 1));
  transform-origin: center center;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  background: var(--bg-primary);
  font-family: var(--font-sans);
  box-sizing: border-box;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  overflow: hidden;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
}

/* 슬라이드 내 기본 패딩 */
.slide-inner {
  padding: var(--pad-y) var(--pad-x);
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
```

### 반응형 스케일 JS (인라인)

```javascript
function scaleSlides() {
  const scaleX = window.innerWidth / 1280;
  const scaleY = window.innerHeight / 720;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--scale', scale);
}
window.addEventListener('resize', scaleSlides);
scaleSlides();
```

---

## 색상 용도 매핑

| 색상 | 허용 용도 | 금지 용도 |
| --- | --- | --- |
| `--bg-dark` | 표지 전체, 섹션 디바이더 좌측(40%), 테이블 헤더 | 카드 배경, 일반 콘텐츠 배경 |
| `--bg-primary` | 슬라이드 기본 배경, 카드 배경 | — |
| `--bg-secondary` | 카드 대안 배경, 교대 테이블 행 | — |
| `--accent-*` | 타이틀바 라인(4px), 카드 상단 바(4px), KPI 숫자, 원형 뱃지, Funnel tier | 넓은 배경(&gt;300px wide 컨테이너) |
| `--light-*` | 정보 박스 배경, 강조 영역 | 주요 배경 |

---

## 카드 디자인 패턴

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-accent-bar {
  height: 4px;
  background: var(--accent-blue); /* 카드마다 다른 accent */
}

.card-body {
  padding: 20px;
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.card-content {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

---

## 타이틀바 패턴

```css
.title-bar {
  margin-bottom: 24px;
}

.title-bar-accent {
  height: 4px;
  width: 48px;
  background: var(--accent-blue);
  border-radius: 2px;
  margin-bottom: 12px;
}

.title-bar-text {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.title-bar-sub {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}
```

---

## 인쇄(@media print) 지원

```css
@media print {
  .deck { position: static; width: auto; height: auto; }
  .slide {
    position: relative;
    opacity: 1 !important;
    pointer-events: auto;
    page-break-after: always;
    transform: none !important;
    translate: none !important;
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
  .slide-counter, .slide-nav { display: none; }
}
```

---

## 폰트 로딩 전략

```html
<!-- 1순위: CDN (온라인) -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />

<!-- CSS 폴백은 font-family 선언으로 처리 -->
<!-- 'Pretendard' → -apple-system → 'Malgun Gothic' → sans-serif -->
```

오프라인 환경에서는 시스템 폰트로 자동 폴백. 발표 전 온라인 환경에서 한번 열면 브라우저 캐시에 저장됨.

---

## 공간 분배 가드레일

### \[HARD\] 빈 공간 방지 규칙

슬라이드 콘텐츠가 전체 높이의 50% 미만을 차지할 때 하단에 빈 공간이 생기는 것은 프레젠테이션 품질을 저하시키는 가장 흔한 문제다.

**적용 대상 슬라이드 타입**:

- Content (글머리 5개 이하)
- StatHighlight
- Quote
- ProcessFlow (3단계 이하)
- Cards (3개 이하)

**해결 방법**: 타이틀바는 상단 고정, 콘텐츠 영역(title-bar 다음 div)에 `flex:1;display:flex;flex-direction:column;justify-content:center;` 적용. **[HARD] 슬라이드 최상위 div에 justify-content:center를 거는 것은 금지** (타이틀바 위치가 슬라이드마다 달라지는 원인).

```css
/* 타이틀바가 있는 슬라이드: 콘텐츠 영역만 센터링 */
.slide-inner {
  display: flex;
  flex-direction: column;
  padding: var(--pad-y) var(--pad-x);
}
.content-area-centered {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

### \[HARD\] 카드 반응형 너비

카드에 고정 px 너비를 사용하면 슬라이드 크기에 맞지 않아 줄바꿈이 깨진다.

| 카드 수 | 열 수 | 너비 공식 |
| --- | --- | --- |
| 2 | 2 | `calc((100% - 24px) / 2)` |
| 3 | 3 | `calc((100% - 48px) / 3)` |
| 4 | 2 | `calc((100% - 24px) / 2)` |
| 5-6 | 3 | `calc((100% - 48px) / 3)` |

### \[HARD\] 최소 폰트 크기 검증

생성된 HTML에서 14px 미만 텍스트가 없는지 검증해야 한다. 특히 ProcessFlow의 step-desc, 카드 내 캡션, 테이블 셀에서 발생하기 쉽다.

검증 패턴: `font-size:\s*(\d+)px` 에서 숫자가 14 미만이면 위반.