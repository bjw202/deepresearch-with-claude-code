# 리서치 프로세스 기록

**날짜**: 2026-03-18
**주제**: build123d + LLM + 온톨로지 기어 설계-제조 통합 시스템

이 문서는 본 리서치가 어떤 과정으로 수행되었는지를 기록한다. 멀티에이전트 오케스트레이션의 실제 동작, 검색 도구 사용 패턴, 자체 평가 결과를 포함한다.

---

## 1. 전체 프로세스 흐름

```mermaid
flowchart TD
    USER["사용자 요청<br/>build123d 기반 기어 시스템 리서치"]

    subgraph PHASE1["Phase 1: 사전 준비"]
        READ["기존 리서치 5개 파일 읽기<br/>(00~04-*.md)"]
        MKDIR["출력 폴더 생성<br/>2026-03-18-build123d-gear-system/"]
    end

    subgraph PHASE2["Phase 2: 병렬 리서치 (서브 에이전트 4개 동시 발사)"]
        direction LR
        R1["researcher-build123d<br/>build123d 기어 모델링<br/>⏱ 351s / 24 tool_use"]
        R2["researcher-architecture<br/>통합 아키텍처 설계<br/>⏱ 536s / 30 tool_use"]
        R3["researcher-ontology<br/>온톨로지 강화 전략<br/>⏱ 491s / 19 tool_use"]
        J["journal<br/>세션 저널 기록<br/>⏱ 50s / 4 tool_use"]
    end

    subgraph PHASE3["Phase 3: 검토 및 통합"]
        READ2["3개 리서치 문서 전문 읽기"]
        CRITIC["Critic 에이전트 발사<br/>⏱ 151s / 10 tool_use"]
        EXEC["Executive Summary 작성<br/>(Critic 피드백 반영)"]
        JRNL2["저널 업데이트"]
    end

    subgraph PHASE4["Phase 4: 자체 평가"]
        EVAL["검색 도구 호출 분석<br/>오케스트레이션 평가<br/>Critic 평가"]
        CLAUDE["CLAUDE.md 개선점 도출<br/>→ Shared Convention 규칙 추가"]
    end

    USER --> PHASE1
    PHASE1 --> PHASE2
    PHASE2 --> PHASE3
    PHASE3 --> PHASE4

    style PHASE1 fill:#e8f4f8,stroke:#2196F3
    style PHASE2 fill:#e8f8e8,stroke:#4CAF50
    style PHASE3 fill:#fff8e1,stroke:#FF9800
    style PHASE4 fill:#fce4ec,stroke:#E91E63
```

---

## 2. 에이전트 타임라인

```mermaid
gantt
    title 에이전트 실행 타임라인
    dateFormat X
    axisFormat %s초

    section 사전 준비
    기존 리서치 읽기          :done, read, 0, 30
    폴더 생성                 :done, mkdir, 30, 32

    section 병렬 리서치
    journal                   :done, j, 32, 82
    researcher-build123d      :done, r1, 32, 383
    researcher-ontology       :done, r3, 32, 523
    researcher-architecture   :done, r2, 32, 568

    section 검토/통합
    3개 문서 읽기              :done, read2, 568, 590
    Critic                    :done, critic, 590, 741
    Executive Summary 작성     :done, exec, 741, 780
    저널 업데이트              :done, j2, 780, 806

    section 자체 평가
    검색 패턴 분석             :done, eval, 806, 840
    CLAUDE.md 반영             :done, claude, 840, 860
```

---

## 3. 에이전트 간 데이터 흐름

```mermaid
flowchart LR
    subgraph INPUT["입력"]
        PREV["이전 리서치<br/>5개 파일<br/>(CadQuery 기반)"]
        REQ["사용자 요청"]
    end

    subgraph MAIN["메인 에이전트"]
        ORCH["오케스트레이터<br/>프롬프트 설계<br/>+ 태스크 분배"]
        INTEG["통합 판단<br/>+ 상충 해결"]
    end

    subgraph AGENTS["서브 에이전트"]
        R1["researcher<br/>-build123d"]
        R2["researcher<br/>-architecture"]
        R3["researcher<br/>-ontology"]
        CR["critic"]
        JR["journal"]
    end

    subgraph SEARCH["검색 도구"]
        PS["Perplexity<br/>search"]
        TS["Tavily<br/>search"]
        TE["Tavily<br/>extract"]
        PR["Perplexity<br/>research"]
    end

    subgraph OUTPUT["산출물"]
        F1["01-build123d<br/>-gear-modeling.md"]
        F2["02-integrated<br/>-architecture.md"]
        F3["03-ontology<br/>-enhancement.md"]
        F0["00-executive<br/>-summary.md"]
        FJ["dev-journal/<br/>2026-03-18-*.md"]
    end

    PREV --> ORCH
    REQ --> ORCH
    ORCH -->|프롬프트| R1 & R2 & R3 & JR
    R1 -->|문서| F1
    R2 -->|문서| F2
    R3 -->|문서| F3
    JR -->|문서| FJ
    R1 & R2 & R3 --> PS & TS & TE & PR
    F1 & F2 & F3 -->|읽기| CR
    CR -->|비판 텍스트| INTEG
    INTEG -->|통합| F0
    INTEG -->|업데이트| JR

    style MAIN fill:#fff3e0,stroke:#E65100
    style AGENTS fill:#e8f5e9,stroke:#2E7D32
    style SEARCH fill:#e3f2fd,stroke:#1565C0
    style OUTPUT fill:#f3e5f5,stroke:#6A1B9A
```

---

## 4. 검색 도구 사용 분석

### 4.1 에이전트별 호출 횟수

```mermaid
xychart-beta
    title "에이전트별 검색 도구 호출 횟수"
    x-axis ["build123d", "architecture", "ontology"]
    y-axis "호출 횟수" 0 --> 20
    bar [7, 18, 7]
    bar [7, 9, 5]
    bar [13, 2, 2]
    bar [1, 1, 1]
```

| 에이전트 | perplexity search | tavily search | tavily extract | perplexity research | **합계** |
|---------|:-:|:-:|:-:|:-:|:-:|
| researcher-build123d | 7 | 7 | 13 | 1 | **28** |
| researcher-architecture | 18 | 9 | 2 | 1 | **30** |
| researcher-ontology | 7 | 5 | 2 | 1 | **15** |
| **합계** | **32** | **21** | **17** | **3** | **73** |

### 4.2 CLAUDE.md 조사 흐름 준수 여부

CLAUDE.md는 "얕은 곳 → 깊은 곳" 3단계 흐름을 정의한다:

```mermaid
flowchart LR
    S1["1단계: 종합 파악<br/>perplexity search<br/>tavily search"]
    S2["2단계: 원문 검증<br/>tavily extract"]
    S3["3단계: 심층 탐구<br/>perplexity research<br/>tavily research"]

    S1 -->|"핵심 수치 발견"| S2
    S2 -->|"정보 부족"| S3
    S1 -->|"충분"| STOP["중단"]
    S2 -->|"충분"| STOP

    style S1 fill:#c8e6c9
    style S2 fill:#fff9c4
    style S3 fill:#ffcdd2
```

**준수 평가:**

| 에이전트 | 1단계 (search) | 2단계 (extract) | 3단계 (research) | 평가 |
|---------|:-:|:-:|:-:|------|
| build123d | 14회 | 13회 | 1회 | 원문 검증 충분 |
| architecture | 27회 | 2회 | 1회 | **extract 부족** — 인용 수치 미검증 |
| ontology | 12회 | 2회 | 1회 | **extract 부족** — 코드 구문 미검증 |

### 4.3 도구 혼용 비율

```mermaid
pie title "전체 검색 도구 비율"
    "Perplexity search (32)" : 32
    "Tavily search (21)" : 21
    "Tavily extract (17)" : 17
    "Perplexity research (3)" : 3
```

CLAUDE.md 원칙 "한 도구에 편중하지 말고 섞어 쓴다" — **Perplexity 35 vs Tavily 38로 균등 혼용, 준수.**

### 4.4 비용 추정

| 도구 | 호출수 | 단가 | 추정 비용 |
|------|:------:|------|:---------:|
| Perplexity search | 32 | ~$0.01 | $0.32 |
| Perplexity research | 3 | ~$0.05 | $0.15 |
| Tavily search (advanced) | 21 | 2 크레딧 | 42 크레딧 |
| Tavily extract | 17 | 1 크레딧 | 17 크레딧 |
| **합계** | **73** | | **~$0.47 + 59 크레딧** |

---

## 5. Critic 에이전트 동작 분석

### 5.1 Critic 프로세스

```mermaid
flowchart TD
    IN["3개 리서치 문서 입력<br/>(01, 02, 03)"]

    subgraph REVIEW["비판적 검토"]
        D1["문서 01 검토<br/>4건 이슈 발견"]
        D2["문서 02 검토<br/>5건 이슈 발견"]
        D3["문서 03 검토<br/>4건 이슈 발견"]
        CROSS["교차 검증<br/>4건 상충 발견"]
        MISSING["누락 고려사항<br/>6건 식별"]
    end

    subgraph OUTPUT["출력"]
        SEV["심각도 분류<br/>높음 3 / 중간 8 / 낮음 2"]
        FEAS["실현 가능성 판정<br/>낮음-중간"]
        REC["권고사항 7건"]
    end

    IN --> D1 & D2 & D3
    D1 & D2 & D3 --> CROSS
    CROSS --> MISSING
    MISSING --> SEV --> FEAS --> REC

    style REVIEW fill:#fff3e0
    style OUTPUT fill:#e8f5e9
```

### 5.2 Critic이 발견한 이슈 매트릭스

```mermaid
quadrantChart
    title Critic 발견 이슈: 심각도 vs 수정 용이성
    x-axis "수정 어려움" --> "수정 쉬움"
    y-axis "심각도 낮음" --> "심각도 높음"

    "환각률 1.7% 도메인 비약": [0.3, 0.85]
    "6-Agent 복잡도 과다": [0.25, 0.9]
    "py_gearworks API 미검증": [0.7, 0.95]
    "네임스페이스 불일치": [0.9, 0.5]
    "Pellet AGPL 라이선스": [0.8, 0.6]
    "코드생성 접근법 상충": [0.5, 0.55]
    "SHACL 범위 불일치": [0.85, 0.4]
    "VLM 기어 치형 한계": [0.2, 0.5]
    "Pellet 성능 미벤치마크": [0.4, 0.45]
    "SWRL 한계 과소평가": [0.35, 0.4]
    "ARKNESS 적합성 미검증": [0.3, 0.5]
    "LLM 친화성 미실증": [0.15, 0.55]
    "출처 수준 혼재": [0.75, 0.25]
```

### 5.3 Critic의 한계

| 항목 | 수행 여부 | 비고 |
|------|:---------:|------|
| 문서 간 교차 검증 | O | 4건 상충 발견 |
| 논리적 일관성 검토 | O | 도메인 이전 비약 지적 |
| 과도한 일반화 탐지 | O | 환각률 수치 한정 |
| 누락 고려사항 | O | 라이선스, 비용, 오프라인 등 6건 |
| **원문 검증 (extract)** | **X** | **search.sh 0회 호출** |
| **코드 실행 검증** | **X** | Owlready2/SHACL 코드 미실행 |
| 긍정적 확인 | △ | 문제 지적에 편중 |

---

## 6. 통합 프로세스

### 6.1 메인 에이전트의 통합 흐름

```mermaid
flowchart TD
    subgraph READ["읽기"]
        R1["01-build123d 전문"]
        R2["02-architecture 전문<br/>(60KB, 분할 읽기)"]
        R3["03-ontology 전문<br/>(52KB, 분할 읽기)"]
    end

    subgraph CRITIC_REVIEW["Critic 결과 수신"]
        C1["높음 3건"]
        C2["중간 8건"]
        C3["상충 4건"]
        C4["누락 6건"]
    end

    subgraph INTEGRATE["통합 판단"]
        DEC1["수치의 도메인 한정 명시"]
        DEC2["MVP vs 풀 비전 분리"]
        DEC3["네임스페이스 통일 방향"]
        DEC4["SHACL 범위 2단계화"]
        DEC5["Pellet → HermiT 권고"]
        DEC6["코드생성: MVP는 Skill Card"]
    end

    subgraph WRITE["산출물"]
        ES["00-executive-summary.md"]
        JU["저널 업데이트"]
    end

    READ --> CRITIC_REVIEW
    CRITIC_REVIEW --> INTEGRATE
    INTEGRATE --> WRITE

    style READ fill:#e3f2fd
    style CRITIC_REVIEW fill:#ffcdd2
    style INTEGRATE fill:#fff9c4
    style WRITE fill:#c8e6c9
```

### 6.2 Critic 피드백 → Executive Summary 반영 추적

| Critic 지적 | 반영 여부 | 반영 위치 | 반영 방식 |
|------------|:---------:|----------|----------|
| 환각률 1.7% 도메인 한정 | O | "수치의 도메인 한정" 표 | "미검증" 명시 |
| 6-Agent 복잡도 | O | "MVP vs 풀 비전" 표 | 3컴포넌트 MVP 분리 |
| py_gearworks API 미검증 | O | "리스크" 표 | "PoC 전 반드시 테스트" |
| 네임스페이스 불일치 | O | "문서 간 상충" 섹션 | 통일 방향 제시 |
| Pellet AGPL | O | "기술 스택" 표 | HermiT(BSD) 권고 |
| 코드생성 접근법 상충 | O | "문서 간 상충" 섹션 | MVP=Skill Card |
| SHACL 범위 불일치 | O | "문서 간 상충" 섹션 | 2단계 적용 |
| 라이선스/비용/오프라인 | △ | "실패 시나리오" | 일부만 반영 |
| **하위 문서 실제 수정** | **X** | — | **미수행** |

---

## 7. 자체 평가 요약

### 7.1 평점

```mermaid
xychart-beta
    title "프로세스 자체 평가 (5점 만점)"
    x-axis ["검색 도구", "오케스트레이션", "Critic", "통합", "종합"]
    y-axis "점수" 0 --> 5
    bar [3.7, 3.3, 4.0, 3.7, 3.7]
```

| 항목 | 평점 | 잘 된 점 | 핵심 이슈 |
|------|:---:|---------|----------|
| 검색 도구 | B+ | 3단계 흐름 준수, 도구 균등 혼용 | architecture의 extract 부족 |
| 오케스트레이션 | B | 병렬 발사, 역할 분리 명확 | 에이전트 간 컨벤션 미합의 |
| Critic | A- | 교차 검증 우수, 상충 4건 발견 | 원문 검증 미수행 |
| 통합 | B+ | Critic 피드백 전면 반영 | 하위 문서 미수정 |
| **종합** | **B+** | | |

### 7.2 도출된 개선점

```mermaid
flowchart LR
    subgraph PROBLEM["발견된 문제"]
        P1["에이전트 간<br/>네임스페이스 불일치"]
        P2["Critic의<br/>원문 미검증"]
        P3["하위 문서<br/>미수정"]
    end

    subgraph SOLUTION["개선 방안"]
        S1["사전 컨벤션 문서<br/>✅ CLAUDE.md 반영"]
        S2["Critic 프롬프트에<br/>검색 도구 사용 지시<br/>(세션별 판단)"]
        S3["통합 후 수정 패스<br/>(세션별 판단)"]
    end

    P1 --> S1
    P2 --> S2
    P3 --> S3

    style S1 fill:#c8e6c9,stroke:#2E7D32
    style S2 fill:#fff9c4,stroke:#F57F17
    style S3 fill:#fff9c4,stroke:#F57F17
```

CLAUDE.md에는 **가장 효과 대비 비용이 낮은 "사전 컨벤션 문서" 규칙만 반영**했다. 나머지는 세션별 오케스트레이션 판단으로 둔다.

---

## 8. 전체 리소스 소비

| 항목 | 수치 |
|------|------|
| 서브 에이전트 수 | 5개 (Researcher 3 + Journal 1 + Critic 1) |
| 총 tool_use | 87회 (R1:24 + R2:30 + R3:19 + J:4+2 + C:10) |
| 총 토큰 | ~363K (R1:77K + R2:95K + R3:72K + J:34K + C:85K) |
| 검색 호출 | 73회 (P-search:32 + T-search:21 + T-extract:17 + P-research:3) |
| 추정 검색 비용 | ~$0.47 + 59 Tavily 크레딧 |
| 산출물 | 6개 파일 (연구 4 + 저널 1 + 프로세스 기록 1) |
| 총 소요 시간 | ~15분 (병렬 실행, 가장 긴 에이전트 기준) |
