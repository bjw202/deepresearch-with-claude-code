---

name: create-presentation description: &gt; PPT/프레젠테이션을 디자인하고 생성합니다. 주제·파일·텍스트를 입력받아 한국형 디자인 시스템(Pretendard + 6:3:1 색상)으로 프로페셔널한 .pptx를 생성합니다. PptxGenJS 기반 코드 생성 시 네이티브 요소(테이블·차트·이미지·도형·텍스트)를 목적에 맞게 매핑하여 최적 품질의 PPTX를 생성합니다. MANDATORY TRIGGERS: PPT 만들어, PPT 생성, 프레젠테이션 만들어, 슬라이드 만들어, 발표자료 만들어, 발표 자료, 보고서 PPT, 결과 보고 PPT, 요약 PPT, 피치덱, pitch deck, presentation, PPT 디자인, 슬라이드 디자인, 프레젠테이션 디자인, PPT 템플릿, PPT 폰트, 슬라이드 레이아웃, 프레젠테이션을 생성할까요 allowed-tools:

- Bash
- Write
- Read
- Edit
- Glob
- Grep

---

# 프레젠테이션 생성 스킬

## Step 0: 규모 판단 (분기)

아래 조건 중 하나라도 해당하면 **에이전트 파이프라인**으로 전환한다:

- 슬라이드 수가 16장 이상
- 리서치 폴더(`docs/research/`)가 입력 소스
- 사용자가 "방대한", "교육자료", "전체 내용" 등 대규모를 암시

**에이전트 파이프라인 전환 시:**`.claude/agents/presentation-builder.md`의 4단계 파이프라인을 따른다:

1. Content Strategist (opus) → 콘텐츠 전략 + 아웃라인
2. 사용자 승인
3. Slide Builders (sonnet × 2\~N, 병렬) → 코드 생성
4. Assembler + Validator → 합치기 + `scripts/validate-pptx-code.js` 검증 + 실행

**에이전트 파이프라인 핵심 원칙:**

- 첫 번째 파트만 상수/헬퍼를 정의한다. 후속 파트는 슬라이드 함수만 작성한다.
- **모든 파트(Part 1 포함)에서 함수 호출문(`slideNN_name();`)과 `pptx.writeFile()` 금지.** 합치기 단계에서 자동 생성한다. Part 1이 함수 호출 블록을 포함하면 슬라이드가 중복 생성된다.
- **헬퍼 프로퍼티명 주의:** addProcessFlow/addLayeredStack/addCard/addIconGrid는 `{title, body}`, addFunnel은 `{label, value}`, addPyramid는 `{label, description}`. 잘못된 프로퍼티명은 빈 슬라이드의 원인이다.
- 상세 규칙은 `.claude/agents/presentation-builder.md` Phase 3\~4 참조.

**15장 이하 소규모 프레젠테이션**은 아래 기존 Step 1\~5를 그대로 사용한다.

---

## Step 1: 입력 분석

파일 경로 제공 시 → 파일 읽고 분석 후 Step 2로. 텍스트/주제만 제공 시 → 누락 정보만 확인:

- 대상 청중 (미입력 시 비즈니스 전문가 가정)
- 슬라이드 수 (미입력 시 기본값: 10\~15장)
- 스타일 (미입력 시 기본값: 비즈니스)
- 색상 팔레트 (미입력 시 기본값: Midnight Executive)

### 프레젠테이션 구조 자동 선택

사용자의 목적에 따라 아래 구조 패턴을 선택한다. 상세 구조는 `references/content-strategy.md` 참조.

| 목적 | 구조 패턴 |
| --- | --- |
| 업무 보고, 분석 결과 | SCQA (상황→문제→질문→답변) |
| 투자 유치, 사업 제안 | 피치덱 (문제→해결→시장→팀) |
| 교육, 강의, 워크숍 | 교육 (학습목표→섹션→요약) |
| 연구 발표, 논문 | 학술 (배경→방법→결과→결론) |
| 청중 맞춤형 설득 | 서사 비트 기반 (`references/narrative-beats.md` 참조) |

## Step 2: 아웃라인 생성 및 승인

아웃라인 형식으로 표시:

```
[슬라이드 타입] "액션 타이틀" - [비트] 콘텐츠 형식
예: [Title] "AI가 바꾸는 비즈니스의 미래" - [hook] 표지
    [Stat Highlight] "매출의 40%가 이 단계에서 사라진다" - [hook] 충격 통계
    [Content] "현재 프로세스의 3가지 병목" - [problem] 글머리 3개
    [Before/After] "수동 vs 자동: 처리 시간 80% 단축" - [comparison] 전후 대비
    [Process Flow] "3단계 자동화 프로세스" - [framework] 5단계
    [KPI] "파일럿 결과: ROI 320%" - [proof] KPI 3개
    [Closing] "다음 분기 도입을 제안합니다" - [close] 요약 3가지 + CTA
```

사용자 승인 → Step 3. 수정 요청 → 수정 후 재표시.

## Step 3: PptxGenJS 코드 생성

단일 완성 Node.js 스크립트 생성. 참조 문서를 아래 순서로 활용:

1. **먼저** `references/pptxgenjs-patterns.md` — 헬퍼 함수(addTitleBar, addStyledTable 등)와 스타일 상수(COLORS, FONTS, TABLE_STYLE). 이 파일의 헬퍼를 코드 상단에 그대로 복사하여 사용.
2. **필요한 레이아웃만** `references/slide-layouts.md` — 아웃라인에 포함된 슬라이드 타입의 레이아웃만 참조. 전체를 읽지 않아도 된다.
3. **색상 변경 시에만** `references/design-system.md` — 기본 팔레트(Midnight Executive) 외 다른 팔레트 요청 시.

### 코드 구조화 규칙

슬라이드 수에 따라 코드 구조를 달리한다:

**15장 이하**: 단일 파일에 순차적으로 작성해도 무방.

**16장 이상 (에이전트 파이프라인)**: `.claude/agents/presentation-builder.md`로 자동 분기.

파트 분할 시 역할:

| 파트 | 포함 내용 | 금지 사항 |
| --- | --- | --- |
| 첫 번째 파트 | PptxGenJS 초기화 + 상수 + 헬퍼 + 슬라이드 함수 | 없음 |
| 후속 파트 (2\~N) | 슬라이드 함수만 | 상수/헬퍼 재정의, 축약 상수명, 함수 호출문, writeFile |

합치기는 메인 에이전트가 수행: 마커 주석 기반 추출 + grep으로 함수명 자동 추출 + writeFile 추가. 상세 규칙은 `.claude/agents/presentation-builder.md` Phase 3\~4 참조.

## Step 4: 실행 및 전달

```bash
npm list pptxgenjs 2>/dev/null || npm install pptxgenjs
node generate-presentation.js
```

### 에러 대응

| 에러 | 원인 | 해결 |
| --- | --- | --- |
| `Cannot find module 'pptxgenjs'` | 미설치 | `npm install pptxgenjs` 재실행 |
| `TypeError: ... is not a function` | 헬퍼 함수 누락 또는 오타 | 헬퍼 함수가 코드 상단에 정의되어 있는지 확인 |
| `Invalid chart type` | pptx.charts.XXX 참조 오류 | `pptx.charts.BAR` 등 정확한 상수 사용 확인 |
| PowerPoint 복구 다이얼로그 | 8자리 hex 색상 사용 | 모든 color를 6자리 hex로 변경 (투명도는 `transparency` 속성으로 분리) |

## Step 5: 수정 지원

- 특정 슬라이드 수정: `slideNN_이름()` 함수를 찾아 해당 함수만 교체
- 전체 재생성: Step 2로 돌아가 아웃라인 재작성
- 디자인 변경: COLORS 상수만 교체 (팔레트 변경 방법은 `references/design-system.md` 참조)

---

## 콘텐츠 구조화 핵심 규칙

**액션 타이틀 원칙** — 모든 슬라이드 제목은 결론 문장:

- ❌ "매출 분석" → ✅ "Q3 매출이 전년 대비 23% 성장했습니다"
- ❌ "경쟁사 비교" → ✅ "품질과 서비스에서 경쟁사 대비 우위를 확보했습니다"

한국어 기준 30자 이내를 목표로 하되, 핵심 메시지 전달이 우선이므로 길어져도 괜찮다. addTitleBar가 autoFit으로 자동 축소 처리한다.

**밀도 제어**: 글머리 3\~5개, 슬라이드당 1 메시지, 초과 시 분할. 상세 전략: `references/content-strategy.md`

---

## ★ 시각적 품질 가드레일 (절대 규칙)

**상세 규칙은** `references/design-system.md` **"디자인 가드레일" 섹션 참조. 아래는 핵심 요약:**

 1. **bg_dark 사용 제한**: 표지/섹션디바이더/테이블 헤더에만. 카드·도형 배경 사용 금지
 2. **콘텐츠 폭 12.13" 필수**: w &lt; 11.0 절대 금지
 3. **color 속성 필수**: 모든 addText에 color 명시. 빈 문자열('') 금지
 4. **카드 = 흰 배경 + accent 상단 바**: bg_dark fill 카드 금지
 5. **Funnel/Pyramid = CHART_STYLE.colors**: bg_dark tier 금지
 6. **fontSize ≥ 9pt**: 9 미만 금지
 7. **연속 동일 타입 3장 금지**: 시각적 다양성 확보
 8. **도형 일러스트 금지**: addShape로 장비/공정/물리현상 그림 그리기 금지. 텍스트+표+헬퍼로 대체
 9. **섹션 디바이더 우측은 흰 배경**: 좌측만 dark, 우측은 반드시 흰색
10. **번호 뱃지는 accent 색상**: bg_dark 뱃지 금지 → accent_blue 등 사용
11. **테이블 교대 행**: 흰색/F5F7FA만 교대. bg_dark 행 금지
12. **부드러운 톤**: 정보 박스에 연한 accent (EBF0FF, E6FAF5, FFF8E6, FFF0F0) 활용
13. **조색 레시피**: `references/design-system.md`의 "조색 레시피(Color Recipe)" 참조

---

## ★ 네이티브 요소 매핑 (절대 규칙)

```
콘텐츠 유형 판별
├─ 행×열 구조의 데이터 ──────────→ addTable()
│   (매출표, 일정표, 비교표, 예산표)
├─ 수치의 추이/비교/비율 ─────────→ addChart()
│   (매출 추이, 점유율, KPI 변화)
├─ 외부 이미지/로고/사진 ─────────→ addImage()
├─ 단순 텍스트 블록 ──────────────→ addText()
│   (제목, 본문, 글머리 기호, 인용문)
├─ 장식/배경/구분선 ──────────────→ addShape()
└─ 발표자 노트 ───────────────────→ addNotes()
```

**BAD** (절대 금지):

```javascript
// 표를 도형으로 시뮬레이션 - 금지!
slide.addShape('rect', { x:1, y:1, w:3, h:0.4, fill:'1A1F36' });
slide.addText('항목', { x:1, y:1, w:1, h:0.4, color:'FFFFFF' });
// ... 수십 줄 반복
```

**GOOD** (올바른 사용):

```javascript
// 네이티브 테이블로 처리
const rows = [
  [{ text:'항목', options: TABLE_STYLE.header }, { text:'값', options: TABLE_STYLE.header }],
  [{ text:'매출', options: TABLE_STYLE.cell }, { text:'100M', options: TABLE_STYLE.cellRight }]
];
slide.addTable(rows, TABLE_OPTIONS);
```

---

## 슬라이드 타입 자동 선택

| 조건 | 레이아웃 타입 |
| --- | --- |
| 첫 슬라이드 | Title (다크 전체 배경) |
| 새 섹션 시작 | Section Divider (좌 40% 다크 + 우 60% 밝음) |
| KPI 숫자 2\~4개 | KPI Dashboard |
| 행×열 데이터 | Data Table (addTable) |
| 수치 추이/비교 | Chart+Insight (좌 60% 차트 + 우 40% 텍스트) |
| 두 옵션 비교 | Two Column (50/50) |
| 독립 항목 3\~6개 | Card Grid (2x2 또는 2x3) |
| 순차적 단계 | Timeline |
| 일반 글머리 목록 | Content (기본) |
| 인용구 | Quote (명조체) |
| 순차적 프로세스 3\~7단계 | Process Flow (수평 단계) |
| 단계별 수렴/전환율 | Funnel (깔때기) |
| 2차원 분류/전략 매트릭스 | Matrix (2x2 사분면) |
| 계층 구조/우선순위 | Pyramid (피라미드) |
| 관계/교집합 표현 | Venn (벤 다이어그램) |
| 전후 비교/변화 대조 | Before/After (좌우 대비) |
| 수평 마일스톤 로드맵 | Roadmap (수평 타임라인) |
| 단일 핵심 통계 강조 | Stat Highlight (대형 숫자) |
| 독립 항목 6\~9개 (아이콘형) | Icon Grid (아이콘 그리드) |
| 기술 스택/계층 아키텍처 | Layered Stack (레이어 스택) |
| 기능별 비교 체크리스트 | Comparison Table (✓/✗ 비교표) |
| 마지막 슬라이드 | Closing (요약 + CTA) |

레이아웃 상세 좌표: `references/slide-layouts.md`

---

## 디자인 시스템 요약

**슬라이드 크기**: 16:9 = 13.33" × 7.5" **콘텐츠 영역**: x=0.6, y=0.5 시작, w=12.13, h=6.5 **페이지 번호**: x=12.0, y=7.05, w=1.0, h=0.3

**핵심 색상** (Midnight Executive 팔레트):

- 배경/다크: `FFFFFF` / `1A1F36`
- 제목/본문: `1A1F36` / `4A5568`
- 강조: `4A7BF7` (블루), `00D4AA` (시안), `FFB020` (골드)

**폰트 크기 기준**:

- 메인 타이틀(표지): Pretendard ExtraBold 36\~44pt
- 콘텐츠 제목(TitleBar): Pretendard SemiBold 24\~28pt (autoFit 적용)
- 본문: Pretendard Regular 16\~20pt
- KPI 숫자: Pretendard Black 36\~72pt

전체 상수/팔레트/자간: `references/design-system.md`

---

## 의존성 & 폰트

```bash
npm install pptxgenjs
```

폰트 위치: `fonts/` 디렉토리 (스킬 내장)

- Pretendard-{Thin|ExtraLight|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black}.otf
- ChosunNm.ttf

폰트 폴백: 시스템에 Pretendard 미설치 시 `'Pretendard'` 지정은 유지하되 사용자에게 폰트 설치 안내. macOS의 경우 OTF 파일 더블클릭으로 설치.

PptxGenJS 패턴/헬퍼: `references/pptxgenjs-patterns.md`

---

## QA 체크리스트

**구조 검증**:

- [ ] 모든 슬라이드 제목이 결론 문장인가?

- [ ] 슬라이드당 메시지 1개 원칙 준수?

- [ ] 글머리 기호 6개 이하?

**디자인 검증**:

- [ ] 여백 좌우 0.6" / 상하 0.5" 이상?

- [ ] 색상 6:3:1 비율?

- [ ] 메인 타이틀(표지) 36\~44pt?

- [ ] 콘텐츠 제목(addTitleBar) 24\~28pt?

- [ ] 본문 16\~20pt?

- [ ] 테이블 행 수 8행 이하? (초과 시 슬라이드 분할)

**OOXML 호환성**:

- [ ] 모든 color 속성이 6자리 hex인가? (8자리 사용 시 PowerPoint 복구 다이얼로그 발생)

- [ ] 투명도가 필요하면 transparency 속성으로 분리했는가? (예: `color: 'FFFFFF', transparency: 30`)

- [ ] shadow의 투명도는 opacity 속성으로 분리했는가? (예: `color: '000000', opacity: 0.08`)

**네이티브 요소 검증**:

- [ ] 표 데이터 → addTable() 사용?

- [ ] 수치 비교 → addChart() 사용?

- [ ] 이미지/로고 → addImage() 사용?

- [ ] addShape()로 표/차트 시뮬레이션 없음?

**코드 검증**:

- [ ] 단일 Node.js 파일로 실행 가능?

- [ ] 16장 이상이면 slideNN\_이름() 함수 패턴 사용?

- [ ] `node generate-presentation.js` 오류 없이 실행?

- [ ] .pptx 파일 생성 확인?