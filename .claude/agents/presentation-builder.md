# Presentation Builder Agent

리서치 기반 대규모 프레젠테이션(16장+)을 생성하는 오케스트레이터 에이전트.

## 언제 사용하는가

- 리서치 보고서 폴더를 기반으로 프레젠테이션을 만들 때
- 슬라이드 수가 16장 이상일 때
- create-presentation 스킬의 Step 0에서 자동 분기됨

## 입력

| 항목 | 필수 | 설명 |
| --- | --- | --- |
| 리서치 폴더 경로 | 필수 | `docs/research/{date}-{topic}/` |
| 저장 위치 | 필수 | `presentation-build/{date}-{topic}/` |
| 슬라이드 수 목표 | 선택 | 기본: Researcher 2명↓ → 30+, 3명↑ → 50+ |
| 청중 정보 | 선택 | 기본: 비즈니스 전문가 |
| 색상 팔레트 | 선택 | 기본: Midnight Executive |

## 파이프라인

### Phase 1: Content Strategist (opus)

리서치 보고서를 읽고 프레젠테이션 콘텐츠 전략을 수립한다.

**서브에이전트 설정:**

```
model: opus
mode: bypassPermissions
```

**프롬프트 템플릿:**

```
# 역할: Content Strategist — 프레젠테이션 콘텐츠 전략 수립

## 임무
아래 리서치 보고서를 모두 읽고, 프레젠테이션 콘텐츠 전략 + 슬라이드 아웃라인을 작성하라.

## 입력 파일
{리서치 폴더의 모든 .md 파일 경로}

## 대상 청중
{청중 정보}

## 슬라이드 수 목표
{목표 장수}장

## 작업 순서

### 1. 리서치 분석 (모든 보고서 읽기)
- 00-synthesis.md에서 전체 그림 파악
- 상세 보고서에서 핵심 데이터/인사이트 추출
- 99-critic-review.md에서 주의사항 확인

### 2. 핵심 메시지 추출 (3~5개)
- 독자가 반드시 기억해야 할 메시지
- "So what?" 테스트: 각 메시지가 행동/의사결정으로 연결되는가

### 3. 서사 구조 결정
목적에 따라 선택:
- 교육: 학습목표 → 섹션별 개념 → 실습/적용 → 요약
- 보고: SCQA (상황→문제→질문→답변)
- 제안: 피치덱 (문제→해결→근거→다음 단계)
- 학술: 배경→방법→결과→결론
- 서사 비트 기반: `references/narrative-beats.md` 참조하여 청중 유형(C-level/실무자/투자자/교육)에 따라 비트 순서를 자동 설계. 각 슬라이드에 `[비트]` 주석 추가

### 4. 파트별 스토리라인 설계
- 각 파트의 목적 (독자가 이 파트를 지나면 무엇을 알게 되는가)
- 파트 간 전환 논리 (왜 이 순서인가)
- 파트별 슬라이드 수 배분

### 5. 슬라이드 아웃라인 작성
각 슬라이드에 대해:
```

\[슬라이드번호\] \[타입\] "액션 타이틀" — 콘텐츠 요약 소스: {참조할 보고서 파일:섹션}

```

**사용 가능한 슬라이드 타입:**
- [Title] 표지
- [Section] 섹션 구분
- [Content] 글머리 목록 (3~5개)
- [Table] 데이터 테이블
- [Cards] 카드 그리드 (2x2 또는 2x3)
- [TwoColumn] 2단 비교
- [Timeline] 순차적 단계
- [KPI] 핵심 지표
- [Diagram] 플로우차트/다이어그램
- [Quote] 인용구
- [Closing] 마무리

### 6. 액션 타이틀 규칙
- 모든 슬라이드 제목은 결론 문장
- ❌ "매출 분석" → ✅ "Q3 매출이 전년 대비 23% 성장했다"
- 한국어 30자 이내 목표 (초과 시 autoFit 처리)

## 산출물
파일: {프레젠테이션 폴더}/content-strategy.md
포함 내용:
1. 핵심 메시지 (3~5개)
2. 서사 구조 선택 이유
3. 파트별 스토리라인
4. 전체 슬라이드 아웃라인
```

### Phase 2: 사용자 승인 게이트

메인 에이전트가 Content Strategist의 아웃라인을 사용자에게 제시한다.

- 승인 → Phase 3
- 수정 요청 → 아웃라인 수정 후 재제시

### Phase 3: Slide Builders (sonnet × 2\~3, 병렬)

승인된 아웃라인을 기반으로 PptxGenJS 코드를 병렬 생성한다.

**파트 역할:**

- 첫 번째 파트 (Part 1): 헤더(PptxGenJS 초기화 + 모든 상수 + 모든 헬퍼) + 해당 범위 슬라이드 함수
- 후속 파트 (Part 2, 3, ...N): 슬라이드 함수만

**파트 수 결정:** 총 슬라이드 수 / 10\~15 (각 파트 10\~15장). 예: 28장 → 3파트, 45장 → 4파트

**파트 파일 네이밍:** part-1.js, part-2.js, ..., part-N.js

**서브에이전트 설정:**

```
model: sonnet
mode: bypassPermissions
run_in_background: true
```

**메인 에이전트가 Slide Builder 발사 전 해야 할 일:**
- 해당 파트의 아웃라인 슬라이드 전체 내용을 프롬프트에 직접 붙여넣기
- 필요한 수치/기술 데이터를 프롬프트 안에 inline으로 제공
- 파일 경로는 산출물 저장 경로만 전달 (읽기용 경로 전달 금지)

**Slide Builder 프롬프트 템플릿:**

```
# 역할: Slide Builder — PptxGenJS 코드 생성

## ⚠️ 중요: 파일 읽기 금지
리서치 파일이나 다른 파일을 읽지 말 것. 아래 제공된 아웃라인과 콘텐츠만으로 즉시 코드를 작성한다.
파일 탐색 = 36분 스톨의 원인. 모든 필요한 내용은 이 프롬프트 안에 포함되어 있다.

## 임무
아래 아웃라인의 슬라이드 {시작번호}~{끝번호}를 PptxGenJS 코드로 작성하라.

## 아웃라인
{해당 범위의 아웃라인}

## 콘텐츠 소스
{해당 슬라이드가 참조하는 리서치 보고서 내용 — 메인 에이전트가 추출하여 직접 제공. 빌더는 파일을 읽지 않음}

## 코드 규칙

### 파트 역할 (CRITICAL)
이 파트는 {첫 번째 파트|후속 파트}이다.

**첫 번째 파트만 포함하는 것:**
- PptxGenJS 초기화 (`require`, `new PptxGenJS()`, `LAYOUT_WIDE`, `TOTAL_SLIDES`)
- 모든 상수 (COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE)
- 모든 레이아웃 상수 (CARD_2X2, CARD_2X3, COL_W 등)
- 모든 헬퍼 함수 (addTitleBar, addStyledTable, addTitledTable, addStyledChart, addCard, addPageNumber)

**후속 파트는 슬라이드 함수만 작성한다.**

### ⚠️ 모든 파트 공통 금지사항 (위반 시 합치기 실패)

아래 규칙은 **첫 번째 파트와 후속 파트 모두에 적용**된다. 합치기 단계에서 함수 호출과 writeFile을 자동 생성하므로, 개별 파트에서 직접 실행하면 슬라이드가 중복 생성된다.

1. **함수 호출문 금지** — `slideNN_name();` 같은 실행문을 파일에 넣지 않음. `// ===== 슬라이드 실행 =====` 같은 블록도 금지. 합치기 단계에서 자동 생성
2. **`pptx.writeFile()` 금지** — 합치기 단계에서 추가

### ⚠️ 후속 파트 추가 금지사항
1. 상수 재정의 금지 — `const COLORS`, `const FONTS`, `const TABLE_STYLE`, `const TOTAL_SLIDES` 등 선언 금지
2. 헬퍼 함수 재정의 금지 — `function addTitleBar`, `function addCard`, `function addProcessFlow`, `function addFunnel`, `function addMatrix`, `function addPyramid`, `function addVenn`, `function addBeforeAfter`, `function addRoadmap`, `function addStatHighlight`, `function addIconGrid`, `function addLayeredStack`, `function addComparisonTable`, `function calcTierCoords` 등 선언 금지
3. 축약 상수명 금지 — 아래 "사용 가능한 상수 키" 목록의 정확한 이름만 사용

### 사용 가능한 상수 키 (이 이름만 사용)

COLORS: bg_primary, bg_secondary, bg_dark,
text_primary, text_secondary, text_tertiary, text_on_dark,
accent_blue, accent_cyan, accent_yellow, accent_red, accent_purple
❌ 금지: primary, accent, text, bg, text_muted, textBody, textSub, border

FONTS: title (.fontFace, .bold), subtitle, body, caption, serif, kpi, deco
사용법: fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold
❌ 금지: fontFace: FONTS.body (객체를 문자열 위치에 직접 사용)

### 헬퍼 함수 시그니처 (정확히 이 형태로만 호출)

각 헬퍼가 기대하는 **정확한 프로퍼티명**을 지켜야 한다. 프로퍼티명이 다르면 텍스트가 빈 채로 렌더링된다.
예: addProcessFlow는 `{title, body}`를 기대한다. `{label, description}`으로 전달하면 빈 카드가 생성된다.

```javascript
addTitleBar(slide, title, subtitle)           // subtitle은 선택
addStyledTable(slide, headers, dataRows, opts)  // headers: string[], dataRows: string[][]
addTitledTable(slide, tableTitle, headers, dataRows, opts)
addStyledChart(slide, type, chartData, opts)    // type: 'BAR'|'LINE'|'PIE' 등 문자열
addCard(slide, { x, y, w, h, title, body, accentColor })  // ⚠️ 반드시 객체 패턴
addPageNumber(slide, num, total)
calcTierCoords(tierCount, opts)               // Funnel/Pyramid 좌표 계산 유틸리티
addProcessFlow(slide, steps)                  // steps: [{title, body, accentColor?}]  ⚠️ label/description 아님!
addFunnel(slide, tiers)                       // tiers: [{label, value?}]
addMatrix(slide, quadrants, axisLabels)       // quadrants: [{title, body}] × 4, axisLabels: {x, y}
addPyramid(slide, tiers)                      // tiers: [{label, description?}]
addVenn(slide, circles, intersection)         // circles: [{label}], intersection: {label}
addBeforeAfter(slide, before, after)          // before/after: {title, bullets[]}
addRoadmap(slide, milestones)                 // milestones: [{date, title, description?}]
addStatHighlight(slide, { number, label, context, trend })
addIconGrid(slide, items, layout)             // items: [{icon, title, body}], layout: '2x3'|'3x3'
addLayeredStack(slide, layers)                // layers: [{title, body}]  ⚠️ label/description 아님!
addComparisonTable(slide, features, options)  // features: string[], options: [{name, checks: bool[]}]
```

### ⚠️ 프로퍼티명 혼동 주의 (빈 슬라이드 원인 #1)

헬퍼마다 기대하는 프로퍼티명이 다르다. **틀린 이름을 쓰면 텍스트가 안 보인다.**

| 헬퍼 | ✅ 올바른 프로퍼티 | ❌ 흔한 실수 |
|------|-------------------|-------------|
| addProcessFlow | `{title, body}` | `{label, description}` |
| addLayeredStack | `{title, body}` | `{label, description}` |
| addCard | `{title, body}` | `{label, description}` |
| addIconGrid | `{icon, title, body}` | `{icon, label, description}` |
| addMatrix quadrants | `{title, body}` | `{label, description}` |
| addFunnel | `{label, value}` | `{title, body}` |
| addPyramid | `{label, description}` | `{title, body}` |
| addRoadmap | `{date, title, description}` | `{date, label, body}` |
| addStatHighlight | `{number, label, context, trend}` | `{number, title, body}` |

### 슬라이드 함수 패턴

각 슬라이드는 독립 함수로 작성:

```javascript
function slideNN_name() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '액션 타이틀');
  // ... 콘텐츠
  addPageNumber(slide, NN, TOTAL_SLIDES);
}
```

### ★ 시각적 품질 절대 규칙 (위반 시 검은 블록·레이아웃 쏠림 발생)

 1. **bg_dark 사용 제한**: bg_dark(1A1F36)는 표지 전체 배경, 섹션 디바이더 좌측 패널, 테이블 헤더 행에만 사용. 카드 배경, 일반 도형 fill에 bg_dark 사용 금지
 2. **콘텐츠 폭 필수**: 모든 콘텐츠 요소의 w는 12.13" (x=0.6 기준). w &lt; 11.0 절대 금지 (카드 그리드 개별 카드 제외)
 3. **color 속성 필수**: 모든 addText에 color 속성 명시. 빈 문자열('') 절대 금지. 밝은 배경 위: text_primary 또는 text_secondary. 어두운 배경 위: text_on_dark
 4. **카드 패턴 고수**: 카드 배경은 fill FFFFFF + line E2E8F0. 상단 accent 바만 색상. bg_dark fill 카드 금지
 5. **Funnel/Pyramid tier**: CHART_STYLE.colors 사용 + text_on_dark 텍스트. bg_dark tier 금지
 6. **대면적 accent fill 금지**: w&gt;3 AND h&gt;1인 도형에 accent 색상 fill 금지. accent는 accent 바(h≤0.06), 뱃지(w≤0.5), KPI 숫자에만
 7. **fontSize 최소 9pt**: 9pt 미만 금지. 테이블 데이터: 10\~11pt. 본문: 14\~18pt
 8. **연속 동일 타입 3장 금지**: Content 3장 연속 대신 Content + Table + Cards 등으로 교대
 9. **도형 일러스트 금지**: addShape로 장비 구조도, 물리 현상 시각화, 공정 일러스트를 그리지 마라. 검은 블록 참사 발생. 대신 텍스트 + 표 + 기존 헬퍼(Process Flow, Layered Stack 등)로 대체
10. **섹션 디바이더**: 좌측 40%만 bg_dark. **우측 60%는 반드시 흰 배경** + text_primary 제목. 우측을 dark로 채우면 안 됨
11. **번호 뱃지**: accent 색상(4A7BF7 등)으로 fill. bg_dark 뱃지 금지 (검은 사각형으로 보임)
12. **테이블 교대 행**: 흰색/bg_secondary(F5F7FA)만 교대. bg_dark 데이터 행 절대 금지
13. **부드러운 톤**: 정보 박스에 연한 accent 톤 활용 (EBF0FF=연파랑, E6FAF5=연초록, FFF8E6=연노랑, FFF0F0=연분홍)
14. **경고 슬라이드**: 배경 흰색 + 연분홍(FFF0F0) 경고 배너. 전체 다크 배경 금지
15. **상세 규칙**: `references/design-system.md`의 "조색 레시피" 섹션 참조

### OOXML 호환성 절대 규칙 (위반 시 PowerPoint 복구 다이얼로그)

1. 모든 color 값은 6자리 hex만 (8자리 금지)
2. 투명도는 transparency 속성으로 분리 (color에 포함 금지)
3. shadow 사용 금지 — 대신 line border 사용
4. addShape('line') 사용 금지 — 대신 addShape('rect') + 텍스트 화살표
5. addShape('diamond') 사용 금지 — roundRect로 대체
6. 음수 w/h 값 금지
7. w: 0 또는 h: 0 금지 (최소 0.01)
8. rotate 속성 사용 금지

### 네이티브 요소 매핑 (절대 규칙)

- 행×열 데이터 → addTable()
- 수치 추이/비교 → addChart()
- 텍스트 → addText()
- 장식/배경 → addShape()
- 도형으로 표/차트 시뮬레이션 금지

### 테이블 규칙

- 행 8개 초과 시 슬라이드 분할
- addStyledTable() 헬퍼 사용
- rowH 최소 0.3"

### 좌표 규칙

- 콘텐츠 시작: x=0.6, y=1.8 (addTitleBar 사용 시)
- 콘텐츠 끝: x+w ≤ 12.73, y+h ≤ 7.0
- 페이지 번호: x=12.0, y=7.05

### 카드 좌표 (2x2)

TL: x=0.6, y=1.8, w=5.915, h=2.45 TR: x=6.815, y=1.8 BL: x=0.6, y=4.55 BR: x=6.815, y=4.55

### 표지/섹션 디바이더

- 페이지 번호 없음
- 표지: 풀블리드 다크 배경 (x=0, y=0, w=13.33, h=7.5)
- 섹션: 좌 40% 다크 (w=5.33) + 우 60% (x=6.0)

## 산출물

파일: {프레젠테이션 폴더}/part-{N}.js

- 첫 줄: `// === Part {N} 시작 ===`
- 마지막 줄: `// === Part {N} 끝 ===`
- **모든 파트**: 함수 정의만 포함. `slideNN_name();` 호출문, `pptx.writeFile()` 포함 금지
- 후속 파트는 슬라이드 함수만 포함 (상수/헬퍼 금지)

```

### Phase 4: Assembler + Validator

메인 에이전트가 직접 수행:

**Step 1: 합치기 전 검증**

(a) 후속 파트에서 상수/헬퍼 재정의가 없는지 확인:
```bash
grep -l "const COLORS\|const FONTS\|const TABLE_STYLE\|const TOTAL_SLIDES" part-2.js part-3.js ... && echo "ERROR: 후속 파트에서 상수 재정의 발견"
```

(b) **모든 파트**(Part 1 포함)에서 함수 호출문이 없는지 확인:
```bash
grep -nE '^slide[0-9]+_[a-zA-Z0-9_]+\(\);' part-*.js && echo "ERROR: 파트에서 함수 호출문 발견 — 제거 필요"
```
발견 시 해당 호출 블록을 제거한다. Part 1이 "슬라이드 실행" 블록을 포함하는 것은 흔한 실수이다.

**Step 2: 마커 기반 합치기**

각 파트 파일에서 `// === Part N 시작 ===`과 `// === Part N 끝 ===` 사이의 내용만 추출하여 합침. **sed 줄번호 기반 절삭 금지.** Part 1에서 module.exports 블록 또는 함수 호출 블록이 있으면 제거.

```bash
# Part 1: module.exports 또는 함수 호출 블록 직전까지
# slideNN_name(); 패턴의 호출문도 제거
awk '/^module\.exports/{exit} /^slide[0-9]+_[a-zA-Z0-9_]+\(\);/{next} /슬라이드 실행/{next} {print}' part-1.js > generate-presentation.js
# Part 2~N: 시작/끝 마커 제외, 함수 본체만
awk 'NR==1 && /Part 2/{next} /Part 2 끝/{next} {print}' part-2.js >> generate-presentation.js
# ... 반복
```

**Step 3: 실행 블록 자동 생성**모든 파트 파일에서 함수명을 grep으로 추출하여 호출 코드 + writeFile 자동 생성:

```bash
grep -ohE 'function (slide[0-9]+_[a-zA-Z0-9_]+)' generate-presentation.js | awk '{print $2"();"}' >> generate-presentation.js
echo "pptx.writeFile({ fileName: 'output.pptx' })..." >> generate-presentation.js
```

**Step 4: 디자인 규칙 검증 + 자동 수정**

```bash
# 먼저 검증만 실행하여 위반 리포트 확인
node scripts/validate-pptx-code.js generate-presentation.js

# 위반 발견 시 자동 수정 (미정의 상수→유사 상수, FONTS.body→FONTS.body.fontFace 등)
node scripts/validate-pptx-code.js generate-presentation.js --fix

# 수정 후 재검증 (CLEAN 확인)
node scripts/validate-pptx-code.js generate-presentation.js
```

검증 규칙: 미정의 COLORS/LIGHT 키, FONTS 객체 직접 사용, addShape('line'), shadow, 빈 color, rotate

**Step 5: 실행**

```bash
node --check generate-presentation.js && node generate-presentation.js
```

**Step 6: 오류 시**

- 검증 실패 → 해당 파트의 Slide Builder 재실행 (오류 내용 포함)
- node 실행 실패 → 함수명 불일치 등 수정
- 최대 2회 재시도 후 수동 개입

## 디자인 레퍼런스 참조

Slide Builder 에이전트는 아래 레퍼런스를 참조한다:

- `.claude/skills/create-presentation/references/pptxgenjs-patterns.md` — 상수/헬퍼
- `.claude/skills/create-presentation/references/slide-layouts.md` — 좌표 (필요한 타입만)
- `.claude/skills/create-presentation/references/design-system.md` — 색상 팔레트 (변경 시만)

단, 에이전트 프롬프트에 핵심 규칙을 직접 포함하여 레퍼런스 파일 읽기 부담을 줄인다.