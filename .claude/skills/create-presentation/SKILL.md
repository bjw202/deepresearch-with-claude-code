---

## name: create-presentation description: &gt; Presentation creation skill. Designs slides via Pencil MCP and outputs a single self-contained HTML file with keyboard navigation and CSS transitions. Pretendard font + Midnight Executive color system. MANDATORY TRIGGERS: PPT, presentation, slides, pitch deck allowed-tools: Read, Write, Edit, Bash, Glob, Grep, mcp__pencil__get_editor_state, mcp__pencil__open_document, mcp__pencil__batch_design, mcp__pencil__batch_get, mcp__pencil__get_screenshot, mcp__pencil__get_guidelines, mcp__pencil__snapshot_layout metadata: version: "2.0.0" category: "workflow" status: "active" updated: "2026-04-09"

# Presentation Creator (HTML Slides)

MANDATORY TRIGGERS: PPT 만들어, PPT 생성, 프레젠테이션 만들어, 슬라이드 만들어, 발표자료 만들어, 발표 자료, 보고서 PPT, 결과 보고 PPT, 요약 PPT, 피치덱, pitch deck, presentation, 슬라이드 디자인, 프레젠테이션 디자인

## Step 0: 분기 판단

### 규모 분기

아래 조건 중 하나라도 해당하면 **에이전트 파이프라인**으로 전환한다:

- 슬라이드 수 16장 이상
- 리서치 폴더(`docs/research/`)가 입력 소스
- 사용자가 "방대한", "교육자료", "전체 내용" 등 대규모를 암시

**에이전트 파이프라인 전환 시**, 아래 phase 파일을 순서대로 Read하여 따른다:

1. Read `${CLAUDE_SKILL_DIR}/phases/01-content-strategy.md`
2. (Pencil 비주얼 슬라이드가 아웃라인에 포함된 경우) Read `${CLAUDE_SKILL_DIR}/phases/02-pencil-design.md`
3. Read `${CLAUDE_SKILL_DIR}/phases/03-html-assembly.md`

**15장 이하 소규모**는 아래 Step 1\~5를 직접 실행한다.

### 렌더링 경로 자동 판단 (Step 2 아웃라인 확정 후 적용)

아웃라인의 각 슬라이드 타입을 보고 **슬라이드별로** 렌더링 경로를 자동 결정한다:

**HTML 직접 생성** (기본 경로):

- 텍스트/표/글머리 중심: Title, Content, Table, KPI, StatHighlight, Quote, Closing
- 비교/나열 레이아웃: TwoColumn, Cards, BeforeAfter, ComparisonTable
- 단순 시각화: ProcessFlow, Timeline, Roadmap, Funnel, Pyramid, IconGrid

**Pencil MCP -&gt; PNG -&gt; HTML 삽입** (비주얼 경로):

- 아키텍처 도식: \[Architecture\], \[SystemDiagram\]
- 데이터 플로우: \[DataFlow\], \[NetworkTopology\]
- 커스텀 인포그래픽: \[CustomVisual\], \[Infographic\]
- 복잡한 관계도: 노드 3개 이상의 Venn, 계층이 4단 이상인 LayeredStack

**Pencil 경유 강제 트리거**:

- 사용자가 .pen 파일을 입력으로 제공한 경우
- 사용자가 "디자인 시안", "Pencil에서", "다이어그램 그려줘" 등 명시한 경우

Pencil 비주얼 경로 사용 시:

1. `mcp__pencil__open_document("new")` 또는 기존 .pen 열기
2. `mcp__pencil__batch_design`으로 해당 슬라이드만 디자인
3. `mcp__pencil__get_screenshot`으로 시각 검증
4. `mcp__pencil__export_nodes`로 PNG 내보내기
5. HTML에 `<img src="data:image/png;base64,...">` 또는 외부 파일로 삽입

아웃라인 표시 시 각 슬라이드에 경로를 표기한다:

```
[Content] "현재 프로세스의 3가지 병목" - [problem] 글머리 3개          -> HTML
[Architecture] "시스템 전체 아키텍처" - [framework] 구성도             -> Pencil
```

---

## Step 1: 입력 분석

파일 경로 제공 시 -&gt; 파일 읽고 분석 후 Step 2로. 텍스트/주제만 제공 시 -&gt; 누락 정보 확인:

- 대상 청중 (미입력 시 비즈니스 전문가 가정)
- 슬라이드 수 (미입력 시 기본값: 10\~15장)
- 스타일 (미입력 시 기본값: 비즈니스)
- 색상 팔레트 (미입력 시 기본값: Midnight Executive)
- 출력 파일명 (미입력 시 `presentation.html`)

### 프레젠테이션 구조 자동 선택

**반드시 아래 2개 파일을 Read한 후** 아웃라인을 작성한다:

1. `${CLAUDE_SKILL_DIR}/references/content-strategy.md`
2. `${CLAUDE_SKILL_DIR}/references/narrative-beats.md`

## Step 2: 아웃라인 생성 및 승인

아웃라인 형식으로 표시:

```
[슬라이드 타입] "액션 타이틀" - [비트] 콘텐츠 형식
예: [Title] "AI가 바꾸는 비즈니스의 미래" - [hook] 표지
    [StatHighlight] "매출의 40%가 이 단계에서 사라진다" - [hook] 충격 통계
    [Content] "현재 프로세스의 3가지 병목" - [problem] 글머리 3개
    [BeforeAfter] "수동 vs 자동: 처리 시간 80% 단축" - [comparison] 전후 대비
    [ProcessFlow] "3단계 자동화 프로세스" - [framework] 5단계
    [KPI] "파일럿 결과: ROI 320%" - [proof] KPI 3개
    [Closing] "다음 분기 도입을 제안합니다" - [close] 요약 3가지 + CTA
```

사용자 승인 -&gt; Step 3. 수정 요청 -&gt; 수정 후 재표시.

## Step 3: HTML 생성 (+ 선택적 Pencil 비주얼)

**반드시 먼저** `${CLAUDE_SKILL_DIR}/references/pencil-to-html.md`를 Read하여 노드-&gt;CSS 매핑 규칙과 HTML 슬라이드 엔진 템플릿을 로드한다.

### 3-1. HTML 직접 생성 (기본 경로)

pencil-to-html.md의 슬라이드 타입별 HTML 변환 규칙을 따라 HTML을 직접 작성한다.

슬라이드 크기: 1280x720px (16:9). CSS flexbox로 레이아웃 구성.

### 3-2. Pencil 비주얼 생성 (해당 슬라이드만)

Step 0에서 Pencil 경로로 판단된 슬라이드가 있을 때만 실행:

1. `mcp__pencil__open_document("new")` -&gt; 새 .pen 생성
2. `mcp__pencil__batch_design` -&gt; 다이어그램/도식 디자인 (25 ops/call)
3. `mcp__pencil__get_screenshot` -&gt; 시각 검증
4. `mcp__pencil__export_nodes` -&gt; PNG로 내보내기
5. 내보낸 PNG를 HTML 슬라이드에 base64 인라인 또는 외부 파일로 삽입

Pencil 비주얼은 **해당 슬라이드의 메인 콘텐츠 영역에 이미지로 배치**하고, 타이틀바는 HTML로 유지한다.

## Step 4: HTML/CSS 파일 조립

### 4-1. 파일 구조

단일 `.html` 파일로 출력 (self-contained):

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <style>/* 인라인 CSS: 슬라이드 엔진 + 개별 슬라이드 스타일 */</style>
</head>
<body>
  <div class="deck">
    <div class="slide active" id="slide-1">...</div>
  </div>
  <div class="slide-counter"><span id="cur">1</span> / <span id="tot">N</span></div>
  <script>/* 키보드 네비게이션 인라인 */</script>
</body>
</html>
```

### 4-2. HTML 슬라이드 엔진 (인라인 JS/CSS)

**네비게이션**: 좌우 화살표 키 또는 Space/Enter로 전환. 클릭도 지원.

**전환 효과**: CSS `transition: opacity 0.3s ease, transform 0.3s ease`

**인쇄**: `@media print` 쿼리로 각 슬라이드를 별도 페이지로 출력.

**16:9 고정 비율**: `aspect-ratio: 16/9` + `width: 100vw`

---

## Step 5: 수정 지원

- 특정 슬라이드 수정: `#slide-N` 요소 내 CSS/HTML만 수정
- 전체 재생성: Step 2로 돌아가 아웃라인 재작성
- 색상 변경: CSS 변수 `--accent`, `--bg-dark` 등만 교체

---

## 콘텐츠 구조화 핵심 규칙

**액션 타이틀 원칙** -- 모든 슬라이드 제목은 결론 문장:

- X "매출 분석" -&gt; O "Q3 매출이 전년 대비 23% 성장했습니다"
- X "경쟁사 비교" -&gt; O "품질과 서비스에서 경쟁사 대비 우위를 확보했습니다"

**밀도 제어**: 글머리 3\~5개, 슬라이드당 1 메시지.

---

## 슬라이드 타입 자동 선택

| 조건 | 레이아웃 타입 |
| --- | --- |
| 첫 슬라이드 | Title (다크 전체 배경) |
| 새 섹션 시작 | Section (좌 40% 다크 + 우 60% 밝음) |
| KPI 숫자 2\~4개 | KPI |
| 행x열 데이터 | Table |
| 수치 추이/비교 | ChartInsight (좌 60% 차트 + 우 40% 인사이트) |
| 두 옵션 비교 | TwoColumn (50/50) |
| 독립 항목 3\~6개 | Cards (2x2 또는 2x3) |
| 순차적 단계 | Timeline |
| 일반 글머리 목록 | Content (기본) |
| 인용구 | Quote (명조체) |
| 순차적 프로세스 3\~7단계 | ProcessFlow |
| 단계별 수렴/전환율 | Funnel |
| 2차원 분류 | Matrix (2x2 사분면) |
| 계층 구조/우선순위 | Pyramid |
| 관계/교집합 | Venn |
| 전후 비교 | BeforeAfter |
| 수평 마일스톤 | Roadmap |
| 단일 핵심 통계 | StatHighlight |
| 독립 항목 6\~9개 | IconGrid |
| 기술 스택/계층 | LayeredStack |
| 기능별 비교 체크리스트 | ComparisonTable |
| 마지막 슬라이드 | Closing |

---

## 디자인 시스템 요약

**슬라이드 크기**: 1280x720px (16:9)

**폰트**: Pretendard (CDN) + 시스템 폴백 ('Pretendard', -apple-system, 'Malgun Gothic', sans-serif)

**명조체**: 'Nanum Myeongjo', Georgia, serif (인용구 전용)

**핵심 색상 (Midnight Executive 팔레트)**:

```css
:root {
  --bg-primary:   #FFFFFF;
  --bg-secondary: #F5F7FA;
  --bg-dark:      #1A1F36;
  --text-primary:   #1A1F36;
  --text-secondary: #4A5568;
  --text-tertiary:  #718096;
  --text-on-dark:   #FFFFFF;
  --accent-blue:   #4A7BF7;
  --accent-cyan:   #00D4AA;
  --accent-yellow: #FFB020;
  --accent-red:    #FF6B6B;
  --accent-purple: #8B5CF6;
}
```

**폰트 크기 기준** (발표 시인성 우선, px 단위):

- 메인 타이틀(표지): 48-56px
- 콘텐츠 제목(TitleBar): 30-36px
- 본문/글머리: 20-24px
- 카드/컬럼 본문: 18-20px
- ProcessFlow/Timeline 설명: 16-18px
- 테이블 본문: 16-18px
- KPI 숫자: 64-96px
- 캡션/출처: 14px (절대 최소)
- [HARD] 14px 미만 사용 금지 (발표 환경에서 읽기 불가)

전체 시스템: `references/design-system-html.md`

---

## HTML 슬라이드 디자인 가드레일

1. **bg-dark 사용 제한**: 표지/섹션디바이더 좌측/테이블 헤더에만
2. **accent 대면적 금지**: 넓은 배경 fill에 accent 색상 사용 금지 (타이틀바/뱃지만 허용)
3. **폰트 크기 최소**: 14px 미만 사용 금지 (발표 환경 시인성 기준)
4. **연속 동일 타입 3장 금지**: 시각적 다양성 확보
5. **액션 타이틀 필수**: 모든 슬라이드 제목은 결론 문장
6. **1슬라이드 1메시지**: 초과 시 분할

---

## QA 체크리스트

**구조**:

- [ ] 모든 슬라이드 제목이 결론 문장?

- [ ] 슬라이드당 메시지 1개 원칙?

- [ ] 글머리 기호 6개 이하?

**HTML 품질**:

- [ ] 단일 .html 파일로 브라우저에서 직접 열림?

- [ ] 좌우 화살표 키 및 Space로 슬라이드 전환됨?

- [ ] 16:9 비율 고정?

- [ ] Pretendard 폰트 로드 (CDN 또는 폴백)?

**디자인**:

- [ ] 색상 6:3:1 비율?

- [ ] bg-dark는 허용 영역에만?

- [ ] 연속 동일 타입 3장 이하?

**오프라인 호환**:

- [ ] CSS/JS 완전 인라인?

- [ ] 폰트 CDN 실패 시 시스템 폰트 폴백 동작?

- [ ] 외부 이미지 의존성 없음 (또는 base64 인라인)?