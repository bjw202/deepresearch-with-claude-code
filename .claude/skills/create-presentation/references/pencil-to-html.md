# Pencil 노드 → HTML/CSS 변환 규칙

Pencil MCP의 .pen 노드 트리를 HTML/CSS 슬라이드로 변환하는 매핑 규칙.

---

## 기본 노드 → CSS 매핑

| Pencil 노드 속성 | CSS 속성 | 비고 |
| --- | --- | --- |
| `layout: "vertical"` | `flex-direction: column` | frame 기본 |
| `layout: "horizontal"` | `flex-direction: row` | frame 가로 배치 |
| `sizing: "fill_container"` | `flex: 1` | 남은 공간 채우기 |
| `sizing: "fit_content"` | `width: fit-content` | 내용 크기 |
| `sizing: "fixed"` + width/height | `width: Npx; height: Npx` | 고정 크기 |
| `gap` | `gap: Npx` | flex gap |
| `paddingTop/Bottom/Left/Right` | `padding: Tpx Rpx Bpx Lpx` | |
| `justifyContent` | `justify-content: value` | flex 주축 정렬 |
| `alignItems` | `align-items: value` | flex 교차축 정렬 |
| `cornerRadius` | `border-radius: Npx` | |
| `fill.color` | `background-color: #HEX` | |
| `fill.opacity` | opacity 또는 rgba 변환 | |
| `border.color` + `border.width` | `border: Npx solid #HEX` | |
| `shadow` | `box-shadow` 변환 | |
| `opacity` | `opacity: N` | |

### text 노드 매핑

| Pencil 텍스트 속성 | CSS 속성 |
| --- | --- |
| `fontSize` | `font-size: Npx` |
| `fontWeight` | `font-weight: N` |
| `fontFamily` | `font-family: 'Pretendard', ...` |
| `fill.color` | `color: #HEX` |
| `textAlign` | `text-align: value` |
| `lineHeight` | `line-height: N` |
| `letterSpacing` | `letter-spacing: Npx` |
| `textDecoration` | `text-decoration: value` |

---

## 슬라이드 타입별 Pencil 노드 구조

### Title (표지)

```
frame#slide-N [1280×720, fill bg-dark, layout:vertical, justify:center, align:center]
  └─ frame.title-content [layout:vertical, gap:16, align:center]
      ├─ text.pretitle [font:Pretendard 500, size:18, color:accent-cyan]
      ├─ text.main-title [font:Pretendard 900, size:56, color:white, align:center]
      ├─ text.subtitle [font:Pretendard 300, size:22, color:#A0AEC0, align:center]
      └─ frame.meta [layout:horizontal, gap:24, padding-top:32]
          ├─ text.date [font:Pretendard 400, size:14, color:#718096]
          └─ text.author [font:Pretendard 400, size:14, color:#718096]
```

HTML 변환:
```html
<div class="slide" id="slide-N" style="background:var(--bg-dark);display:flex;align-items:center;justify-content:center;">
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
    <span style="font-size:18px;font-weight:500;color:var(--accent-cyan);">프리타이틀</span>
    <h1 style="font-size:56px;font-weight:900;color:#fff;line-height:1.1;">메인 타이틀</h1>
    <p style="font-size:22px;font-weight:300;color:#A0AEC0;">부제목</p>
    <div style="display:flex;gap:24px;padding-top:32px;">
      <span style="font-size:14px;color:#718096;">2026-04-09</span>
      <span style="font-size:14px;color:#718096;">발표자</span>
    </div>
  </div>
</div>
```

---

### Section (섹션 디바이더)

```
frame#slide-N [1280×720, layout:horizontal]
  ├─ frame.left-panel [sizing:fixed w:512, fill:bg-dark, layout:vertical, justify:center, padding:48]
  │   ├─ text.section-num [font:Pretendard 900, size:72, color:accent-cyan, opacity:0.3]
  │   ├─ text.section-title [font:Pretendard 800, size:36, color:white]
  │   └─ text.section-desc [font:Pretendard 400, size:16, color:#A0AEC0]
  └─ frame.right-panel [sizing:fill, fill:bg-primary, layout:vertical, justify:center, padding:48]
      └─ frame.toc [layout:vertical, gap:12]
          └─ text.toc-item [font:Pretendard 400, size:16, color:text-secondary] × N
```

---

### Content (일반 글머리)

**[HARD] 공간 분배 규칙**: 타이틀바는 항상 상단 고정. content-area에만 `flex:1; display:flex; flex-direction:column; justify-content:center`를 적용하여 콘텐츠를 수직 중앙 정렬한다. 슬라이드 최상위 div에 `justify-content:center`를 거는 것은 금지 (타이틀바 위치가 슬라이드마다 달라지는 원인).

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [layout:vertical, gap:8, margin-bottom:24]
  │   ├─ frame.accent-line [sizing:fixed h:4 w:48, fill:accent-blue, radius:2]
  │   └─ text.slide-title [font:Pretendard 700, size:32, color:text-primary]
  └─ frame.content-area [layout:vertical, gap:16, sizing:fill, justify:center]
      └─ frame.bullet-item [layout:horizontal, gap:12] × N
          ├─ frame.bullet-dot [sizing:fixed w:8 h:8, fill:accent-blue, radius:4, margin-top:8]
          └─ text.bullet-text [font:Pretendard 400, size:20, color:text-secondary, sizing:fill]
```

HTML 변환 시 타이틀바는 상단, content-area에 `flex:1` + `justify-content:center`:
```html
<div class="slide" id="slide-N" style="display:flex;flex-direction:column;padding:64px;">
  <div class="title-bar" style="margin-bottom:24px;">...</div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
    <!-- 콘텐츠 여기 -->
  </div>
</div>
```

---

### Cards (카드 그리드)

**[HARD] 카드 너비 공식**: 고정 px 값을 사용하지 않는다. 열 수(cols)와 gap에 따라 `calc()` 공식을 적용:
- 2열: `width: calc((100% - 24px) / 2)` (gap:24px 기준)
- 3열: `width: calc((100% - 48px) / 3)` (gap:24px x 2)
- 4열: `width: calc((100% - 72px) / 4)` (gap:24px x 3)
- 카드 수에 따른 자동 열 수: 2개→2열, 3개→3열, 4개→2열(2x2), 5~6개→3열(2x3)

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [...같은 구조...]
  └─ frame.card-grid [layout:horizontal, gap:24, flex-wrap:wrap, sizing:fill, align-content:center]
      └─ frame.card [sizing:calc, fill:white, radius:8, border:E2E8F0] × N
          ├─ frame.accent-bar [sizing:fixed h:4, fill:accent-* (순환), radius-top:8]
          └─ frame.card-body [layout:vertical, gap:8, padding:20]
              ├─ text.card-title [font:Pretendard 700, size:18, color:text-primary]
              └─ text.card-content [font:Pretendard 400, size:16, color:text-secondary]
```

HTML 변환 시 슬라이드 최상위 div에 flex column 명시, card-grid에 flex:1 + align-content:center 적용:
```html
<div class="slide" id="slide-N" style="display:flex;flex-direction:column;padding:64px;">
  <div class="title-bar">...</div>
  <div style="display:flex;gap:24px;flex-wrap:wrap;flex:1;align-content:center;">
    <!-- 3개 카드 예시 -->
    <div class="card" style="width:calc((100% - 48px) / 3);">...</div>
  </div>
</div>
```

---

### KPI (KPI 대시보드)

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [...]
  └─ frame.kpi-row [layout:horizontal, gap:32, sizing:fill, justify:center]
      └─ frame.kpi-card [sizing:fill, layout:vertical, align:center, padding:32, fill:bg-secondary, radius:12] × 3
          ├─ text.kpi-number [font:Pretendard 900, size:64, color:accent-blue]
          ├─ text.kpi-label [font:Pretendard 700, size:18, color:text-primary]
          └─ text.kpi-desc [font:Pretendard 400, size:16, color:text-secondary]
```

---

### TwoColumn (2단 비교)

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [...]
  └─ frame.columns [layout:horizontal, gap:32, sizing:fill]
      ├─ frame.col-left [sizing:fill, layout:vertical, gap:12, padding:24, fill:light-blue, radius:8]
      └─ frame.col-right [sizing:fill, layout:vertical, gap:12, padding:24, fill:light-cyan, radius:8]
```

---

### ProcessFlow (프로세스 플로우)

**[HARD] 단계 수 대응 규칙**:
- 3단계: step-title 16px, step-desc 14px, badge 48px — 기본 크기
- 4단계: 동일 (공간 여유 있음)
- 5단계 이상: `flex-wrap:nowrap` 유지, step 영역을 축소. badge 40px, step-title 14px, step-desc는 생략하거나 tooltip으로 대체. 또는 2행 배치(상단 3개 + 하단 2개)로 전환.
- **[HARD] step-desc는 최소 14px** (발표 환경 시인성 가드레일). 14px 미만이 필요하면 해당 텍스트를 생략.

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [...]
  └─ frame.flow-row [layout:horizontal, gap:0, sizing:fill, align:center, justify:center]
      ├─ frame.step [layout:vertical, align:center, gap:8, sizing:fill] × N
      │   ├─ frame.badge [sizing:fixed w:48 h:48, fill:accent-blue (순환), radius:24, justify:center, align:center]
      │   │   └─ text.step-num [font:Pretendard 900, size:20, color:white]
      │   ├─ text.step-title [font:Pretendard 700, size:16, color:text-primary, align:center]
      │   └─ text.step-desc [font:Pretendard 400, size:16, color:text-secondary, align:center]
      └─ frame.arrow [sizing:fixed w:24, align:center]
          └─ text.arrow-icon [size:20, color:text-tertiary] "→"
```

**5단계 이상 HTML 2행 배치 패턴**:
```html
<div style="display:flex;flex-direction:column;gap:32px;flex:1;justify-content:center;">
  <div style="display:flex;align-items:center;justify-content:center;gap:0;">
    <!-- 상단 행: step 1~3 + 화살표 -->
  </div>
  <div style="display:flex;align-items:center;justify-content:center;gap:0;">
    <!-- 하단 행: step 4~5 (중앙 정렬) -->
  </div>
</div>
```

---

### BeforeAfter (전후 비교)

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, padding:64]
  ├─ frame.title-bar [...]
  └─ frame.compare [layout:horizontal, gap:24, sizing:fill]
      ├─ frame.before [sizing:fill, layout:vertical, padding:24, fill:light-red, radius:8, border:accent-red 1px]
      │   ├─ text.label-before [font:Pretendard 700, size:14, color:accent-red]
      │   └─ frame.before-content [...]
      └─ frame.after [sizing:fill, layout:vertical, padding:24, fill:light-cyan, radius:8, border:accent-cyan 1px]
          ├─ text.label-after [font:Pretendard 700, size:14, color:accent-cyan]
          └─ frame.after-content [...]
```

---

### StatHighlight (대형 통계)

**[HARD] 수직 센터링 필수**: StatHighlight는 콘텐츠가 적어 반드시 `justify-content:center; align-items:center`를 최상위 frame에 적용해야 한다. HTML에서 `display:flex;justify-content:center;align-items:center;` 누락 시 상단 몰림 발생.

```
frame#slide-N [1280×720, fill:bg-primary, layout:vertical, justify:center, align:center, padding:64]
  └─ frame.stat-container [layout:vertical, align:center, gap:16]
      ├─ text.stat-number [font:Pretendard 900, size:120, color:accent-blue]
      ├─ text.stat-label [font:Pretendard 700, size:24, color:text-primary]
      └─ text.stat-context [font:Pretendard 400, size:18, color:text-secondary, align:center]
```

HTML 변환 시 반드시 포함:
```html
<div class="slide" style="display:flex;align-items:center;justify-content:center;padding:64px;">
```

---

### Quote (인용구)

**[HARD] 따옴표 시인성**: quote-mark는 size:96px, opacity:0.15로 설정. 48px 이하는 금지 (발표 환경에서 장식 요소로 인식 불가).

```
frame#slide-N [1280×720, fill:bg-secondary, layout:vertical, justify:center, align:center, padding:96]
  └─ frame.quote-container [layout:vertical, align:center, gap:24]
      ├─ text.quote-mark [font:serif, size:96, color:text-tertiary, opacity:0.15] '"'
      ├─ text.quote-text [font:serif italic, size:28, color:text-primary, align:center]
      └─ text.quote-source [font:Pretendard 500, size:16, color:text-tertiary]
```

---

### Closing (마무리)

```
frame#slide-N [1280×720, fill:bg-dark, layout:vertical, justify:center, padding:64]
  └─ frame.closing-content [layout:vertical, gap:32]
      ├─ text.closing-title [font:Pretendard 900, size:48, color:white]
      ├─ frame.key-messages [layout:vertical, gap:16]
      │   └─ frame.msg-item [layout:horizontal, gap:12] × 3
      │       ├─ frame.msg-dot [sizing:fixed w:6 h:6, fill:accent-cyan, radius:3, margin-top:10]
      │       └─ text.msg-text [font:Pretendard 500, size:20, color:#E2E8F0]
      └─ frame.cta [layout:vertical, gap:8, padding-top:24, border-top:1px rgba(255,255,255,0.1)]
          └─ text.cta-text [font:Pretendard 700, size:18, color:accent-cyan]
```

---

## HTML 슬라이드 엔진 전체 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>프레젠테이션</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg-primary:#FFFFFF;--bg-secondary:#F5F7FA;--bg-dark:#1A1F36;
  --text-primary:#1A1F36;--text-secondary:#4A5568;--text-tertiary:#718096;--text-on-dark:#FFFFFF;
  --accent-blue:#4A7BF7;--accent-cyan:#00D4AA;--accent-yellow:#FFB020;--accent-red:#FF6B6B;--accent-purple:#8B5CF6;
  --light-blue:#EBF0FF;--light-cyan:#E6FAF5;--light-yellow:#FFF8E6;--light-red:#FFF0F0;
  --border-light:#E2E8F0;
  --font-sans:'Pretendard',-apple-system,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;
  --font-serif:'조선일보명조','Nanum Myeongjo',Georgia,serif;
  --sw:1280;--sh:720;--scale:1;
}
html,body{width:100%;height:100%;overflow:hidden;background:#111;font-family:var(--font-sans);}
.deck{position:relative;width:100%;height:100%;}
.slide{
  position:absolute;
  width:1280px;height:720px;
  left:50%;top:50%;
  transform:translate(-50%,-50%) scale(var(--scale));
  transform-origin:center center;
  background:var(--bg-primary);
  opacity:0;pointer-events:none;
  transition:opacity .3s ease;
  overflow:hidden;
}
.slide.active{opacity:1;pointer-events:auto;}
.slide.slide-out-left{animation:slideOutLeft .3s ease forwards;}
.slide.slide-in-right{animation:slideInRight .3s ease forwards;}
@keyframes slideOutLeft{to{opacity:0;transform:translate(calc(-50% - 60px),-50%) scale(var(--scale));}}
@keyframes slideInRight{from{opacity:0;transform:translate(calc(-50% + 60px),-50%) scale(var(--scale));}to{opacity:1;transform:translate(-50%,-50%) scale(var(--scale));}}
.slide-counter{
  position:fixed;bottom:16px;right:24px;
  font-family:var(--font-sans);font-size:13px;color:rgba(255,255,255,.5);
  z-index:100;
}
@media print{
  html,body{width:auto;height:auto;overflow:visible;background:#fff;}
  .deck{position:static;width:auto;height:auto;}
  .slide{
    position:relative;opacity:1!important;pointer-events:auto;
    page-break-after:always;transform:none!important;
    width:100%;height:auto;aspect-ratio:16/9;
  }
  .slide-counter{display:none;}
}
</style>
</head>
<body>
<div class="deck" id="deck">
  <!-- 슬라이드들이 여기 들어감 -->
</div>
<div class="slide-counter"><span id="cur">1</span> / <span id="tot">N</span></div>
<script>
(function(){
  var slides=document.querySelectorAll('.slide');
  var cur=0,tot=slides.length;
  document.getElementById('tot').textContent=tot;
  function scale(){
    var sx=window.innerWidth/1280,sy=window.innerHeight/720;
    var s=Math.min(sx,sy);
    document.documentElement.style.setProperty('--scale',s);
  }
  function go(n){
    if(n<0||n>=tot)return;
    slides[cur].classList.remove('active');
    cur=n;
    slides[cur].classList.add('active');
    document.getElementById('cur').textContent=cur+1;
  }
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key===' '||e.key==='Enter')go(cur+1);
    else if(e.key==='ArrowLeft')go(cur-1);
    else if(e.key==='Home')go(0);
    else if(e.key==='End')go(tot-1);
  });
  document.addEventListener('click',function(e){
    if(e.clientX>window.innerWidth/2)go(cur+1);
    else go(cur-1);
  });
  slides[0].classList.add('active');
  window.addEventListener('resize',scale);
  scale();
})();
</script>
</body>
</html>
```

---

## batch_get 결과 파싱 방법

batch_get 호출 후 받은 노드 JSON에서 HTML로 변환:

1. 최상위 frame들을 슬라이드 순서대로 정렬 (name 패턴: `slide-1`, `slide-2`, ...)
2. 각 frame의 children을 재귀적으로 순회
3. 노드 타입별 변환:
   - `frame` → `<div style="display:flex; ...">`
   - `text` → 내용에 따라 `<h1>`, `<h2>`, `<p>`, `<span>` 선택
   - `image` → `<img src="data:image/...;base64,..." />` (base64 인라인)
4. 모든 스타일은 `style=""` 인라인으로 작성 (CSS 클래스 불필요)
5. CSS 변수 참조는 `var(--accent-blue)` 형태로 유지 (JS scale 재사용)
