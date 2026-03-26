# 서사 비트 엔진 (Narrative Beat Engine)

## 우선순위 규칙

비트 시스템은 기존 SCQA/피치덱/교육/학술 구조의 **상위 레이어**다. 기존 구조는 비트 시퀀스의 구체적 구현이다. 충돌 시 비트 순서가 우선하되, 기존 구조의 세부 섹션은 유지한다.

예: 피치덱 구조를 사용하면서 비트 순서로 감정 흐름을 설계. 피치덱의 "문제→해결→시장→팀" 섹션은 유지하되, 각 섹션이 어떤 비트에 해당하는지 매핑하여 감정 강도를 조절한다.

---

## 7가지 서사 비트

| Beat | 목적 | 감정 강도 | 권장 슬라이드 타입 | 예시 |
| --- | --- | --- | --- | --- |
| `hook` | 첫 90초에 청중의 관심 포착 | ★★★★ (4/5) | Stat Highlight, Quote, Title | 충격적 통계("매출의 40%가 이 단계에서 사라진다"), 도발적 질문 |
| `problem` | 현재 상태의 고통/비용 드러내기 | ★★★ (3/5) | Content, Before/After, KPI, Funnel | 구체적 손실 수치, 실패 사례, 현재 프로세스의 병목 |
| `insight` | 문제의 근본 원인 또는 새로운 시각 | ★★★★ (4/5) | Venn, Matrix, Cards, Content | "사실은 이것이 진짜 원인", 기존 통념 뒤집기 |
| `comparison` | 대안 비교를 통한 판단 근거 제공 | ★★ (2/5) | Before/After, TwoColumn, Comparison Table, Matrix | 경쟁사 비교, AS-IS vs TO-BE, 옵션 A vs B |
| `framework` | 체계적 해결 구조 제시 | ★★ (2/5) | Process Flow, Pyramid, Roadmap, Timeline, Layered Stack | 3단계 프로세스, 프레임워크, 아키텍처, 실행 로드맵 |
| `proof` | 증거와 데이터로 신뢰 확보 | ★★★ (3/5) | KPI, Table, Chart+Insight, Funnel, Stat Highlight | KPI 실적, 사례 연구, 고객 증언, A/B 테스트 결과 |
| `close` | 행동 촉구와 여운 | ★★★★★ (5/5) | Closing, Quote, Stat Highlight | CTA, 핵심 메시지 3가지 요약, 비전 제시 |

---

## 청중 맞춤형 비트 순서

| 청중 유형 | 비트 순서 | 이유 | 슬라이드 수 가이드 |
| --- | --- | --- | --- |
| **C-level** | hook → insight → proof → close | 시간이 없음, 결론 먼저. "왜 중요한지"만 빠르게 | 5-8장 |
| **실무자** | problem → framework → comparison → proof → close | 구체적 방법론 중시. "어떻게 하는지" 상세히 | 10-20장 |
| **투자자** | hook → problem → insight → proof → close | 설득의 완전한 아크. "왜 지금 우리인지" | 10-15장 |
| **교육 대상** | hook → problem → insight → framework → proof → close | 학습 단계별 이해. 개념→적용 흐름 | 15-30장 |

---

## 3가지 서사 변형

| 변형 | 비트 시퀀스 | 감정 곡선 | 적합한 상황 |
| --- | --- | --- | --- |
| **직접적 (Direct)** | hook → insight → proof → close | 처음부터 높음, 유지 | C-level 보고, 시간 제한 발표, 의사결정 요청 |
| **점진적 (Gradual)** | problem → insight → framework → comparison → proof → close | 낮음→점진적 상승 | 교육, 워크숍, 복잡한 주제 설명 |
| **도발적 (Provocative)** | hook(도발) → problem(과장) → insight(반전) → proof → close | 높음→낮음→반전→높음 | 투자 피치, 변화 제안, 청중 설득 |

### 변형별 감정 곡선 시각화

```
직접적:  ████████████████████
         높음 유지

점진적:  ▁▂▃▄▅▆▇████████████
         낮음 → 점진 상승

도발적:  ████▂▂▂████████████
         높음 → 하락 → 반전 상승
```

---

## 기존 구조 → 비트 시퀀스 매핑

| 기존 구조 | 비트 시퀀스 매핑 | 비고 |
| --- | --- | --- |
| **SCQA** (상황→문제→질문→답변) | hook(상황) → problem(문제+질문) → insight(답변 핵심) → proof(근거) → close(결론+다음 단계) | 비즈니스 보고의 표준 |
| **피치덱** (문제→해결→시장→팀) | hook(시장 기회) → problem(고객 고통) → insight(우리 해결책) → proof(견인력+팀) → close(CTA) | comparison 비트를 경쟁 분석에 활용 |
| **교육** (학습목표→섹션→요약) | hook(왜 배워야 하는가) → framework(섹션별 개념) → proof(예시/실습) → close(전체 요약) | 섹션마다 insight 비트 반복 가능 |
| **학술** (배경→방법→결과→결론) | hook(연구 필요성) → problem(기존 한계) → framework(방법론) → proof(결과) → insight(해석) → close(결론+함의) | proof→insight 순서 주의 |

---

## 비트↔슬라이드 타입 매핑 테이블

각 비트에 가장 적합한 슬라이드 타입을 자동 추천할 때 사용한다. ★ = 최적, ○ = 적합, - = 부적합.

| 슬라이드 타입 | hook | problem | insight | comparison | framework | proof | close |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Title | ★ | \- | \- | \- | \- | \- | \- |
| Section | \- | \- | \- | \- | \- | \- | \- |
| Content | ○ | ★ | ○ | ○ | ○ | ○ | ○ |
| Table | \- | ○ | \- | ○ | \- | ★ | \- |
| Cards | ○ | ○ | ★ | ○ | ○ | ○ | ○ |
| TwoColumn | \- | ○ | ○ | ★ | \- | ○ | \- |
| Timeline | \- | \- | \- | \- | ★ | \- | \- |
| KPI | ○ | ○ | \- | \- | \- | ★ | \- |
| Chart+Insight | \- | ○ | ○ | ○ | \- | ★ | \- |
| Quote | ★ | \- | ○ | \- | \- | \- | ★ |
| Closing | \- | \- | \- | \- | \- | \- | ★ |
| **Process Flow** | \- | \- | \- | \- | ★ | \- | \- |
| **Funnel** | \- | ○ | \- | ○ | \- | ★ | \- |
| **Matrix** | \- | \- | ★ | ★ | ○ | \- | \- |
| **Pyramid** | \- | \- | ○ | \- | ★ | \- | \- |
| **Venn** | \- | \- | ★ | ○ | \- | \- | \- |
| **Before/After** | \- | ★ | \- | ★ | \- | ○ | \- |
| **Roadmap** | \- | \- | \- | \- | ★ | \- | \- |
| **Stat Highlight** | ★ | \- | \- | \- | \- | ★ | ○ |
| **Icon Grid** | \- | \- | ○ | ○ | ★ | \- | \- |
| **Layered Stack** | \- | \- | \- | \- | ★ | \- | \- |
| **Comparison Table** | \- | \- | \- | ★ | \- | ○ | \- |

---

## 아웃라인에서 비트 주석 사용법

Content Strategist가 아웃라인을 작성할 때, 각 슬라이드에 비트 주석을 추가한다:

```
[Title] "AI가 바꾸는 비즈니스의 미래" - [hook] 표지
[Stat Highlight] "매출의 40%가 이 단계에서 사라진다" - [hook] 충격 통계
[Content] "현재 프로세스의 3가지 병목" - [problem] 글머리 3개
[Before/After] "수동 vs 자동: 처리 시간 80% 단축" - [comparison] 전후 대비
[Process Flow] "3단계 자동화 프로세스" - [framework] 5단계
[KPI] "파일럿 결과: ROI 320%" - [proof] KPI 3개
[Closing] "다음 분기 도입을 제안합니다" - [close] 요약 3가지 + CTA
```

### 복잡 타입의 데이터 스키마

복잡한 시각화 타입은 아웃라인에서 데이터 구조를 명시해야 한다:

```
[Funnel] "전환율이 단계별로 50%씩 감소한다" - [proof] 4단계: 유입(1000)→관심(500)→검토(250)→구매(125)
[Pyramid] "조직의 3계층 의사결정 구조" - [framework] 3계층: 전략(경영진)→전술(중간관리)→실행(실무)
[Venn] "기술과 디자인의 교집합이 UX다" - [insight] 원A(기술), 원B(디자인), 교집합(UX)
[Matrix] "긴급도×중요도 매트릭스" - [framework] 축(긴급도/중요도), Q1(긴급+중요:즉시실행), Q2(비긴급+중요:계획), Q3(긴급+비중요:위임), Q4(비긴급+비중요:제거)
[Roadmap] "2026년 디지털 전환 로드맵" - [framework] Q1(기반구축)→Q2(파일럿)→Q3(확대)→Q4(최적화)
[Comparison Table] "3개 솔루션 기능 비교" - [comparison] 기능(API,보안,가격,지원), 옵션A(✓,✓,$$,24/7), 옵션B(✓,✗,$,업무시간), 옵션C(✓,✓,$$$,24/7)
```