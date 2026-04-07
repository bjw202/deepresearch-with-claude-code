---

## name: deep-research description: "다각도 심층 리서치 오케스트레이터. 주제 분석 → 팀 구성 → 병렬 조사 → 검증 → 통합까지 전체 워크플로우를 실행한다. '리서치해줘', '조사해줘', '분석해줘', '\~에 대해 알아봐' 등의 요청이 있으면 이 스킬을 사용할 것."

# Deep Research — 다각도 심층 리서치 오케스트레이터

## 개요

복잡한 주제를 다각도로 조사하여 검증된 종합 보고서를 생성한다. **Agent Teams 기반**으로 운영되며, 메인(Team Lead)은 오케스트레이션에만 집중한다.

**핵심 원칙**: 메인은 오케스트레이터다. 직접 산출물을 읽거나 정리하지 않는다. Journal이 요약하고, Critic이 검증하고, 메인은 최종 Synthesis만 수행한다.

**실행 모드**:

- **Agent Teams 모드** (기본): TeamCreate로 팀 생성, teammate 간 SendMessage로 실시간 통신
- **Solo 모드** (폴백): Agent Teams 미지원 환경에서 기존 background 에이전트 방식으로 실행

**subagent_type 규칙** [HARD]:

| 에이전트 | subagent_type | 이유 |
|---------|---------------|------|
| Researcher | `researcher` | 사전 정의 타입 (직접 사용 가능) |
| Critic | `critic` | 사전 정의 타입 (직접 사용 가능) |
| Journal | `general-purpose` | 커스텀 에이전트 (프롬프트에서 `.claude/agents/journal.md` Read 지시) |
| Verifier | `general-purpose` | 커스텀 에이전트 (프롬프트에서 `.claude/agents/verifier.md` Read 지시) |

---

## Step 0: 주제 분석 + 팀 구성 결정

### 주제 유형 판단

| Type | 특징 | 팀 구성 | 예시 |
| --- | --- | --- | --- |
| **A** | 기술 수학/공학 — 교과서/논문 기반, 커뮤니티 불필요 | Researcher × N (관점별, mixed 모드) + Critic + Journal | 기어 설계 수학, CNC 열변형 보정 |
| **B** | 기술 동향/전략 — 웹+학술+커뮤니티 모두 유의미 | Researcher × 3 (web/academic/community 모드) + Critic + Journal | 디지털 트윈 도입, AI 시스템 전환 |
| **C** | 하이브리드 — 관점별 + 소스 유형별 혼합 | Researcher × N (관점별 × 모드별 조합) + Critic + Journal | 레이저 가공 산업 동향 + 기술 원리 |
| **D** | 간단 확인 — 에이전트 불필요 | 메인 직접 처리 (팀 생성 안 함) | 단일 사실 확인, 짧은 요약 |

### 팀 규모

- **표준**: Researcher 2\~3 + Critic 1 + Journal 1
- **확장** (3개 이상 독립 관점): Researcher 3\~5 + Critic 1 + Verifier 1 + Journal 1
- **Critic 필수 조건**: Researcher 2명 이상
- **Journal 필수 조건**: Researcher 2명 이상 (1명이면 Journal 불필요)

### 모델 정책

| 역할 | 모델 | 이유 |
| --- | --- | --- |
| Researcher | sonnet | 검색 -&gt; 정리 -&gt; 구조화 중심, 에이전트 정의로 품질 확보 |
| Critic | opus | 상충점 발견, 확신도 교정 등 높은 추론력 필수 |
| Verifier | sonnet | 원문 대조 중심 작업 |
| Journal | sonnet | 구조화된 기록, 실시간 요약 |

---

## Step 1: Question Expansion

서브 에이전트 분배 전에 아래를 작성한다:

1. **사용자의 핵심 질문**
2. **검증이 필요한 전제** 1\~2개
3. **놓쳤을 가능성이 큰 인접 질문** 2\~3개
4. **결론을 뒤집을 수 있는 반대 시나리오** 1개
5. **(선택) 이질 도메인 유추**: 이 문제의 핵심 구조가 다른 분야에서 이미 풀린 적이 있는가?

목적: 사용자 요청을 무시하는 것이 아니라, **더 좋은 문제 정의로 확장**하는 것.

---

## Step 2: 준비

### 2.1 리서치 폴더 생성

```bash
mkdir -p docs/research/{YYYY-MM-DD}-{topic-slug}/
```

### 2.2 공유 근거 캐시 초기화

```markdown
# _shared-facts.md
| 수치/사실 | 출처 URL | 확인 수준(검색/원문확인) |
|----------|---------|------------------------|
```

### 2.3 검색 통계 초기화

```bash
./scripts/search.sh stats --reset
```

### 2.4 Multi-Agent Shared Convention 정의

모든 Researcher 프롬프트에 공통으로 포함할 컨벤션:

- 핵심 질문
- 조사 범위 / 비범위
- 공통 용어 정의
- 인용 형식
- 확신도 표기법 (★★★/★★☆/★☆☆)
- 파일 저장 경로
- 필수 출력 섹션

### 2.5 검색 시간 범위 결정

| 변화 속도 | `--days` | 해당 분야 |
| --- | --- | --- |
| 초고속 | 180 | AI/ML, 개발 도구, LLM |
| 고속 | 365 | SaaS, 클라우드, 사이버보안 |
| 중속 | 730 | 제조, 에너지, 헬스케어 |
| 저속 | 1095 | 규제/법률, 인프라, 인구통계 |

### 2.6 Preflight Check \[HARD\]

에이전트 발사 전 필수 파일 존재 여부를 Glob으로 확인한다. **이 단계를 건너뛰지 않는다.**

```
1. Glob(".claude/agents/researcher.md") — 없으면 중단, 사용자에게 알림
2. Glob(".claude/agents/critic.md") — 없으면 중단, 사용자에게 알림
3. Glob(".claude/agents/journal.md") — 없으면 Solo 모드 폴백 (Journal 없이 진행)
4. Glob(".claude/agents/verifier.md") — 없으면 Repair Pass 비활성화
```

하나라도 누락된 경우 해당 에이전트의 역할과 폴백 전략을 사용자에게 보고한다.

---

## Step 3: 팀 생성 + 병렬 조사

### 3.1 TeamCreate로 팀 생성

```
TeamCreate(
  team_name: "research-{topic-slug}",
  description: "{주제} 심층 리서치 팀"
)
```

### 3.2 Journal 먼저 발사 \[HARD\]

Journal은 모든 Researcher보다 **반드시 먼저** 발사하여 대기 상태로 진입시킨다. Journal이 준비되지 않은 상태에서 Researcher를 발사하면 완료 알림을 수신할 teammate가 없다.

**subagent_type 규칙**: `journal`과 `verifier`는 사전 정의 에이전트 타입이 아니므로, **반드시** `general-purpose`**로 발사**하고 프롬프트에서 에이전트 정의 파일을 Read하도록 지시한다. `researcher`와 `critic`은 사전 정의 타입이므로 직접 사용 가능.

```
Agent(
  description: "Journal: 리서치 기록",
  prompt: "당신은 리서치 저널 에이전트다. 먼저 .claude/agents/journal.md를 Read하여 전체 지침을 숙지하라.

           [초기화 정보]
           핵심 질문: {Question Expansion 결과}
           Researcher 배치:
             - R1: {관점} / {모드}
             - R2: {관점} / {모드}
             - R3: {관점} / {모드}
           저장 경로: docs/research/{date}-{topic}/97-journal.md
           공유 컨벤션: {Step 2에서 정의한 내용}

           초기화 메시지를 받았다. 저널 파일 헤더를 생성하고 Researcher 완료 알림을 대기하라.",
  subagent_type: "general-purpose",
  team_name: "research-{topic-slug}",
  name: "journal",
  model: "sonnet",
  mode: "bypassPermissions"
)
```

**발사 확인**: Journal 발사 후 Researcher 발사 전에 Journal이 정상 동작하는지 확인한다. Journal이 저널 파일 헤더를 생성했는지 `Glob("docs/research/{date}-{topic}/97-journal.md")`로 확인. 미생성 시 1회 재발사. 재발사도 실패 시 Solo 모드로 폴백.

### 3.3 Researcher 병렬 발사 [HARD]

Journal 발사 직후, 모든 Researcher를 **단일 메시지에서 병렬로** 발사한다.

**스킬 사전 삽입 규칙**: 메인은 Researcher 발사 전에 해당 모드의 스킬 파일을 Read하여, 프롬프트의 `[모드별 상세 지침]` 섹션에 **전문을 삽입**한다. Researcher가 별도로 스킬을 Read하지 않아도 되도록 한다.

| 모드 | 메인이 사전에 Read할 파일 |
|------|------------------------|
| academic | `.claude/skills/academic-research/SKILL.md` |
| web | `.claude/skills/web-research/SKILL.md` |
| community | `.claude/skills/community-analysis/SKILL.md` |
| mixed | 삽입 불필요 |

```
// Step 3.3 실행 전: 메인이 모드별 스킬 파일을 Read
// 예) academic 모드 → Read(".claude/skills/academic-research/SKILL.md") → 내용을 변수로 보관

Agent(
  description: "Researcher 1: {관점}",
  prompt: "에이전트 정의: .claude/agents/researcher.md의 지침을 Read하여 따르라.
           검색 전략 모드: {모드}
           관점: {관점/범위}
           조사 범위 상세: {상세 지시}
           공유 컨벤션: {Step 2에서 정의한 내용}
           저장 경로: docs/research/{date}-{topic}/{NN}-{filename}.md

           [모드별 상세 지침]
           {메인이 Read한 스킬 파일 전문을 여기에 삽입}
           [모드별 상세 지침 끝]

           [팀 통신 규칙]
           조사 완료 후 산출물을 저장하고, journal teammate에게 아래 형식으로 SendMessage:
           ---
           산출물 완료: {파일 경로}
           관점: {관점명}
           모드: {검색 전략 모드}
           ---
           journal의 처리 완료 응답을 기다리지 말고 즉시 작업을 마무리하라.",
  subagent_type: "researcher",
  team_name: "research-{topic-slug}",
  name: "researcher-1",
  model: "sonnet",
  mode: "bypassPermissions"
)

// researcher-2, researcher-3도 동일 패턴. 각 모드에 맞는 스킬을 삽입
```

### 3.4 Researcher 완료 대기 + Journal 중간 보고

모든 Researcher가 완료되면:

1. Journal에게 SendMessage로 "모든 Researcher 완료. 사전 상충점 보고를 Team Lead에게 전달하라" 지시
2. Journal이 사전 상충점 감지 결과를 Team Lead에게 SendMessage
3. Team Lead는 이 보고를 바탕으로 Critic 발사 여부 및 초점을 결정

### 3.5 스톨 감지

- Researcher가 **20분** 경과 후에도 완료되지 않으면 스톨로 간주
- 스톨 감지 시: 해당 Researcher의 output 파일을 확인 (`ls -la {출력 경로}`)
- 파일이 비어있거나 없으면: 해당 teammate에 SendMessage로 상태 확인. 응답 없으면 새 teammate 발사

---

## Step 4: 검증

### 4.1 Critic 발사

모든 Researcher 완료 후, Journal의 사전 상충점 보고를 참고하여 Critic 발사:

```
Agent(
  description: "Critic: {N}개 산출물 검토",
  prompt: "에이전트 정의: .claude/agents/critic.md의 지침을 Read하여 따르라.
           검토 대상: {산출물 파일 경로 목록}
           저장 경로: docs/research/{date}-{topic}/99-critic-review.md

           [사전 감지된 상충점 - Journal 보고]
           {Journal이 보고한 사전 상충점 내용}

           [팀 통신 규칙]
           리뷰 완료 후 산출물을 저장하고, journal teammate에게 아래 형식으로 SendMessage:
           ---
           Critic 리뷰 완료: {파일 경로}
           ---",
  subagent_type: "critic",
  team_name: "research-{topic-slug}",
  name: "critic",
  model: "opus",
  mode: "bypassPermissions"
)
```

### 4.2 교차 검증 등급 확인

Critic 산출물에서 교차 검증 등급이 부여되었는지 확인:

- `[확인됨]`, `[높은 신뢰]`, `[단일 출처]`, `[상충]`

### 4.3 Repair Pass 판단

Critic이 "Repair Pass 필요"로 판정한 경우에만 수행:

- **트리거**: 핵심 수치 출처 허위, 상충점 추가 조사 필요, 결함 미반영
- **범위**: 결함 직결 보수만. 새 하위 주제/분량 확대 금지
- **담당**: 팀에 Verifier teammate를 추가 발사 (1명만)
- **산출물**: `98-repair-notes.md` 또는 `99-critic-review.md` 하단 추가
- **Hard Stop**: Repair는 **1회만**

**Verifier 발사 (general-purpose 사용)**:

```
Agent(
  description: "Verifier: 원문 대조 검증",
  prompt: "당신은 원문 대조 검증 에이전트다. 먼저 .claude/agents/verifier.md를 Read하여 전체 지침을 숙지하라.

           [결함 목록]
           {Critic이 지적한 구체적 결함 목록}

           [대상 파일]
           {검증할 Researcher 산출물 경로}

           저장 경로: docs/research/{date}-{topic}/98-repair-notes.md

           [팀 통신 규칙]
           검증 완료 후 산출물을 저장하고, journal teammate에게 SendMessage:
           Verifier 검증 완료: {파일 경로}
           정정 건수: {N}건",
  subagent_type: "general-purpose",
  team_name: "research-{topic-slug}",
  name: "verifier",
  model: "sonnet",
  mode: "bypassPermissions"
)
```

---

## Step 5: Journal 마감 + 팀 해산

### 5.1 Journal 마감

Critic 완료 후 (또는 Repair Pass 완료 후):

```
SendMessage(
  to: "journal",
  content: "저널 마감하고 최종본을 저장하라.
            Repair Pass 수행 여부: {예/아니오}
            최종 저널 완성 후 Team Lead에게 완료 보고하라."
)
```

### 5.2 Journal 완료 보고 수신

Journal이 최종 저널을 저장하고 완료 보고를 보내면, Team Lead는:

1. Journal 산출물 경로를 확인 (`97-journal.md`)
2. 팀 해산 준비

### 5.3 팀 해산

모든 teammate가 작업을 마친 후:

```
TeamDelete(team_name: "research-{topic-slug}")
```

---

## Step 6: 통합 (Synthesis)

**메인이 직접 수행한다.** 단, 이제 메인은 Researcher 산출물 전문 대신 **Journal 요약본을 먼저 읽는다.**

### 읽기 순서

1. `97-journal.md` — Journal 요약본 (전체 리서치의 핵심 요약, 상충점, 메타 분석)
2. `99-critic-review.md` — Critic 리뷰 (결함, 교차 검증 등급, 권고사항)
3. 필요 시에만 개별 Researcher 산출물의 특정 섹션을 Read (Journal이 "핵심 수치"로 표기한 부분 등)

### 필수 작업

1. **중복 제거** — Researcher 간 중복 수집된 정보 통합
2. **상충점 정리** — Critic이 지적한 상충점 해결
3. **근거 강도 평가** — 교차 검증 등급 반영
4. **결론 우선순위화** — 핵심 발견 순위 결정
5. **불확실성 명시** — 조건부 결론 표시

### Synthesis 필수 섹션

1. **근거 신뢰도 매트릭스**: 핵심 주장별 출처, 도메인 일치도, 확신도, 검증 필요 여부 (표)
2. **상충점 해결 테이블**: 상충 시 각 측 주장 + 판단 근거 (표, 해당 시)
3. **역방향 의사결정 가이드**: "결과가 X이면 -&gt; Y를 조정하라" (해당 시)
4. **예상 밖 핵심 발견**: 사용자 질문 범위 밖이지만 의사결정 영향 (해당 시)
5. **후속 탐색 질문**: 다음에 조사해야 할 질문 2\~3개

해당 없으면 "해당 없음, 이유: ..." 명시. 억지로 채우지 않는다.

### 검색 비용 보고

Journal의 메타 분석 섹션에서 검색 비용 집계를 가져온다. 별도로 `./scripts/search.sh stats` 실행 불필요.

synthesis 보고서 하단에 포함: 도구별 호출 수, Perplexity 예상 비용, Tavily 크레딧 사용량.

### 프레젠테이션 제안

Researcher 2명 이상 리서치이고, "리서치만" 요청이 아닌 경우 프레젠테이션 생성을 제안한다.

- 16장 이상: `.claude/agents/presentation-builder.md` 파이프라인
- 15장 이하: `.claude/skills/create-presentation/SKILL.md`

---

## Solo 모드 폴백

Agent Teams가 사용 불가능한 환경에서는 Solo 모드로 실행한다.

### Solo 모드 차이점

| 항목 | Agent Teams 모드 | Solo 모드 |
| --- | --- | --- |
| 팀 생성 | TeamCreate | 사용 안 함 |
| Researcher | team teammate | `run_in_background: true` |
| Journal | team teammate (상주) | **생략** (메인이 직접 기록) |
| Critic | team teammate | foreground Agent |
| 통신 | SendMessage | 없음 (결과 반환만) |
| 메인 부담 | 낮음 (Journal이 요약) | 높음 (전문 읽기 필요) |

### Solo 모드 실행 절차

Step 0\~2는 동일. Step 3부터 차이:

**Step 3 (Solo)**: Researcher를 `run_in_background: true`로 병렬 발사. Journal은 생략.

```
Agent(
  description: "Researcher N: {관점}",
  prompt: "에이전트 정의: .claude/agents/researcher.md의 지침을 Read하여 따르라.
           검색 전략 모드: {academic/web/community/mixed}
           ...
           저장 경로: docs/research/{date}-{topic}/{NN}-{filename}.md",
  subagent_type: "researcher",
  model: "sonnet",
  mode: "bypassPermissions",
  run_in_background: true
)
```

**Step 4 (Solo)**: 모든 Researcher 완료 후 Critic을 foreground로 발사.

**Step 5 (Solo)**: Journal 마감 없음. 메인이 직접 Researcher 산출물 전문을 읽고 Synthesis.

---

## 모드 자동 선택

```
Agent Teams 환경변수 설정됨?
  NO -> Solo 모드
  YES -> workflow.yaml의 team.enabled가 true?
    NO -> Solo 모드
    YES -> Agent Teams 모드
```

---

## Failure Prevention

다음을 피한다:

- 실질 분업 없는 형식적 멀티에이전트
- 검증 없는 통합
- 중복 조사
- 근거 없는 강한 결론
- 기록만 많고 의사결정 이유가 없는 저널
- 인접 도메인 연구를 대상 도메인에 무비판적으로 적용
- Critic 없이 통합하여 상충점과 도메인 적용성 미검증
- **메인이 Researcher 산출물을 직접 전문 읽는 것** (Journal 요약을 먼저 읽을 것)
- **Journal에게 판단을 시키는 것** (Journal은 기록만, 판단은 Critic)
- **Researcher에게 Journal 완료를 기다리게 하는 것** (비동기 통신, 기다리지 않고 즉시 종료)

품질 우선은 느려도 된다는 뜻이지, 불필요하게 비효율적이어도 된다는 뜻은 아니다.