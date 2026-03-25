# Presentation Builder Agent

리서치 기반 대규모 프레젠테이션(16장+)을 생성하는 오케스트레이터 에이전트.

## 언제 사용하는가

- 리서치 보고서 폴더를 기반으로 프레젠테이션을 만들 때
- 슬라이드 수가 16장 이상일 때
- create-presentation 스킬의 Step 0에서 자동 분기됨

## 입력

| 항목 | 필수 | 설명 |
|------|------|------|
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

### 4. 파트별 스토리라인 설계
- 각 파트의 목적 (독자가 이 파트를 지나면 무엇을 알게 되는가)
- 파트 간 전환 논리 (왜 이 순서인가)
- 파트별 슬라이드 수 배분

### 5. 슬라이드 아웃라인 작성
각 슬라이드에 대해:
```
[슬라이드번호] [타입] "액션 타이틀" — 콘텐츠 요약
  소스: {참조할 보고서 파일:섹션}
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

### Phase 3: Slide Builders (sonnet × 2~3, 병렬)

승인된 아웃라인을 기반으로 PptxGenJS 코드를 병렬 생성한다.

**파트 역할:**
- 첫 번째 파트 (Part 1): 헤더(PptxGenJS 초기화 + 모든 상수 + 모든 헬퍼) + 해당 범위 슬라이드 함수
- 후속 파트 (Part 2, 3, ...N): 슬라이드 함수만

**파트 수 결정:** 총 슬라이드 수 / 10~15 (각 파트 10~15장). 예: 28장 → 3파트, 45장 → 4파트

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

### ⚠️ 후속 파트 금지사항 (위반 시 합치기 실패)
1. 상수 재정의 금지 — `const COLORS`, `const FONTS`, `const TABLE_STYLE`, `const TOTAL_SLIDES` 등 선언 금지
2. 헬퍼 함수 재정의 금지 — `function addTitleBar`, `function addCard` 등 선언 금지
3. 축약 상수명 금지 — 아래 "사용 가능한 상수 키" 목록의 정확한 이름만 사용
4. 함수 호출문 금지 — `slideNN_name();` 같은 실행문을 파일에 넣지 않음. 합치기 단계에서 자동 생성
5. `pptx.writeFile()` 금지 — 합치기 단계에서 추가

### 사용 가능한 상수 키 (이 이름만 사용)

COLORS: bg_primary, bg_secondary, bg_dark,
text_primary, text_secondary, text_tertiary, text_on_dark,
accent_blue, accent_cyan, accent_yellow, accent_red, accent_purple
❌ 금지: primary, accent, text, bg, text_muted, textBody, textSub, border

FONTS: title (.fontFace, .bold), subtitle, body, caption, serif, kpi, deco
사용법: fontSize: 28, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold
❌ 금지: fontFace: FONTS.body (객체를 문자열 위치에 직접 사용)

### 헬퍼 함수 시그니처 (정확히 이 형태로만 호출)

```javascript
addTitleBar(slide, title, subtitle)           // subtitle은 선택
addStyledTable(slide, headers, dataRows, opts)  // headers: string[], dataRows: string[][]
addTitledTable(slide, tableTitle, headers, dataRows, opts)
addStyledChart(slide, type, chartData, opts)    // type: 'BAR'|'LINE'|'PIE' 등 문자열
addCard(slide, { x, y, w, h, title, body, accentColor })  // ⚠️ 반드시 객체 패턴
addPageNumber(slide, num, total)
```

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
TL: x=0.6, y=1.8, w=5.915, h=2.45
TR: x=6.815, y=1.8
BL: x=0.6, y=4.55
BR: x=6.815, y=4.55

### 표지/섹션 디바이더
- 페이지 번호 없음
- 표지: 풀블리드 다크 배경 (x=0, y=0, w=13.33, h=7.5)
- 섹션: 좌 40% 다크 (w=5.33) + 우 60% (x=6.0)

## 산출물
파일: {프레젠테이션 폴더}/part-{N}.js
- 첫 줄: `// === Part {N} 시작 ===`
- 마지막 줄: `// === Part {N} 끝 ===`
- 후속 파트는 첫 줄과 마지막 줄 사이에 슬라이드 함수만 포함
```

### Phase 4: Assembler + Validator

메인 에이전트가 직접 수행:

**Step 1: 합치기 전 검증**
각 후속 파트에서 상수/헬퍼 재정의가 없는지 확인:
```bash
grep -l "const COLORS\|const FONTS\|const TABLE_STYLE\|const TOTAL_SLIDES" part-2.js part-3.js ... && echo "ERROR: 후속 파트에서 상수 재정의 발견"
```

**Step 2: 마커 기반 합치기**
각 파트 파일에서 `// === Part N 시작 ===`과 `// === Part N 끝 ===` 사이의 내용만 추출하여 합침.
**sed 줄번호 기반 절삭 금지.** Part 1에서 module.exports 블록이 있으면 제거.

```bash
# Part 1: module.exports 직전까지
awk '/^module\.exports/{exit} {print}' part-1.js > generate-presentation.js
# Part 2~N: 시작/끝 마커 제외, 함수 본체만
awk 'NR==1 && /Part 2/{next} /Part 2 끝/{next} {print}' part-2.js >> generate-presentation.js
# ... 반복
```

**Step 3: 실행 블록 자동 생성**
모든 파트 파일에서 함수명을 grep으로 추출하여 호출 코드 + writeFile 자동 생성:
```bash
grep -ohE 'function (slide[0-9]+_[a-zA-Z0-9_]+)' generate-presentation.js | awk '{print $2"();"}' >> generate-presentation.js
echo "pptx.writeFile({ fileName: 'output.pptx' })..." >> generate-presentation.js
```

**Step 4: 자동 검증**
```bash
node scripts/validate-pptx-code.js generate-presentation.js
```

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
