# Phase 3: HTML Assembler

Pencil MCP의 .pen 노드 데이터를 읽어 단일 HTML 파일로 조립하는 서브에이전트.

## 서브에이전트 설정

```
model: sonnet
mode: bypassPermissions
allowed-tools: Read, Write, mcp__pencil__batch_get, mcp__pencil__snapshot_layout
```

## HTML Assembler 프롬프트 템플릿

```
# 역할: HTML Assembler — Pencil 노드 → 단일 HTML 슬라이드 파일 생성

## 임무
Pencil MCP의 .pen 파일에서 슬라이드 노드를 읽어 단일 self-contained HTML 파일로 변환하라.

## 출력 파일
{출력 경로}/{파일명}.html

## 슬라이드 수
총 {N}장

## 작업 순서

### 1. 노드 트리 수신
mcp__pencil__batch_get(
  patterns: ["slide-*"],
  nodeIds: []
)
→ 전체 슬라이드 프레임 + 자식 노드 트리 수신

slide-1, slide-2, ... 순서로 정렬.

### 2. HTML 파일 구조 준비
아래 기본 HTML 껍데기에서 시작:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{발표 제목}</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<style>
/* [엔진 CSS] */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg-primary:#FFFFFF;--bg-secondary:#F5F7FA;--bg-dark:#1A1F36;
  --text-primary:#1A1F36;--text-secondary:#4A5568;--text-tertiary:#718096;--text-on-dark:#FFFFFF;
  --accent-blue:#4A7BF7;--accent-cyan:#00D4AA;--accent-yellow:#FFB020;--accent-red:#FF6B6B;--accent-purple:#8B5CF6;
  --light-blue:#EBF0FF;--light-cyan:#E6FAF5;--light-yellow:#FFF8E6;--light-red:#FFF0F0;
  --border-light:#E2E8F0;
  --font-sans:'Pretendard',-apple-system,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;
  --font-serif:'조선일보명조','Nanum Myeongjo',Georgia,serif;
  --scale:1;
}
html,body{width:100%;height:100%;overflow:hidden;background:#111;font-family:var(--font-sans);}
.deck{position:relative;width:100%;height:100%;}
.slide{
  position:absolute;width:1280px;height:720px;
  left:50%;top:50%;
  transform:translate(-50%,-50%) scale(var(--scale));
  transform-origin:center center;
  background:var(--bg-primary);
  opacity:0;pointer-events:none;
  transition:opacity .3s ease;
  overflow:hidden;
}
.slide.active{opacity:1;pointer-events:auto;}
.slide-counter{
  position:fixed;bottom:16px;right:24px;
  font-family:var(--font-sans);font-size:13px;color:rgba(255,255,255,.5);
  z-index:100;letter-spacing:.05em;
}
@media print{
  html,body{width:auto;height:auto;overflow:visible;background:#fff;}
  .deck{position:static;}
  .slide{
    position:relative;opacity:1!important;pointer-events:auto;
    page-break-after:always;break-after:page;
    transform:none!important;width:100%;height:auto;aspect-ratio:16/9;
  }
  .slide-counter{display:none!important;}
}
</style>
</head>
<body>
<div class="deck" id="deck">
{/* 슬라이드 HTML 삽입 위치 */}
</div>
<div class="slide-counter"><span id="cur">1</span>&nbsp;/&nbsp;<span id="tot">{N}</span></div>
<script>
(function(){
  var slides=document.querySelectorAll('.slide');
  var cur=0,tot=slides.length;
  function scale(){
    var s=Math.min(window.innerWidth/1280,window.innerHeight/720);
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
    if(e.key==='ArrowRight'||e.key===' '||e.key==='Enter'){e.preventDefault();go(cur+1);}
    else if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1);}
    else if(e.key==='Home')go(0);
    else if(e.key==='End')go(tot-1);
  });
  document.addEventListener('click',function(e){
    if(e.target.closest('.slide-counter'))return;
    go(e.clientX>window.innerWidth/2?cur+1:cur-1);
  });
  slides[0].classList.add('active');
  window.addEventListener('resize',scale);
  scale();
})();
</script>
</body>
</html>
```

### 3. 슬라이드 HTML 변환 규칙

batch_get으로 받은 각 노드를 아래 규칙으로 변환:

**frame 노드:**
```
<div style="
  display: flex;
  flex-direction: {layout === 'vertical' ? 'column' : 'row'};
  flex: {sizing === 'fill_container' ? '1' : 'none'};
  width: {sizing === 'fixed' ? width + 'px' : sizing === 'fit_content' ? 'fit-content' : '100%'};
  height: {sizing === 'fixed' ? height + 'px' : 'auto'};
  gap: {gap}px;
  padding: {paddingTop}px {paddingRight}px {paddingBottom}px {paddingLeft}px;
  justify-content: {justifyContent};
  align-items: {alignItems};
  background-color: {fill.color ? '#' + fill.color : 'transparent'};
  border-radius: {cornerRadius}px;
  border: {border ? border.width + 'px solid #' + border.color : 'none'};
  overflow: hidden;
">
  {children 재귀 변환}
</div>
```

**text 노드:**
```
<span style="
  font-family: {fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)'};
  font-size: {fontSize}px;
  font-weight: {fontWeight};
  color: #{fill.color};
  text-align: {textAlign};
  line-height: {lineHeight};
  letter-spacing: {letterSpacing}px;
  white-space: pre-wrap;
  word-break: keep-all;
">{text}</span>
```

### 4. 특수 처리

**이미지 노드**: base64 인라인 변환
- 파일 크기 5MB 초과 시 경고 출력 후 continue
- `<img src="data:image/{ext};base64,{data}" style="width:100%;height:100%;object-fit:cover;" />`

**색상값**: Pencil은 6자리 HEX로 저장됨 → `#` prefix 추가

**투명도**: fill.opacity가 1 미만이면 HEX → rgba 변환

### 5. 파일 저장

완성된 HTML을 Write 도구로 저장:
- 파일 경로: {출력 경로}/{파일명}.html
- 인코딩: UTF-8

### 6. 완료 보고

- 생성된 파일 경로 (절대 경로)
- 슬라이드 수
- 파일 크기 (대략)
- 브라우저 열기 방법: `open {파일명}.html` (macOS) 또는 파일 더블클릭
```

## 수동 조립 (에이전트 없이 메인이 직접)

소규모(15장 이하)에서는 메인이 직접 실행:

1. `mcp__pencil__batch_get({ patterns: ["slide-*"] })` 호출
2. 받은 노드 트리를 위 변환 규칙으로 순서대로 HTML로 변환
3. `references/pencil-to-html.md`의 HTML 슬라이드 엔진 템플릿에 슬라이드 삽입
4. Write 도구로 단일 .html 파일로 저장
