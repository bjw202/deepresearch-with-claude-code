---

## name: deep-research description: "다각도 심층 리서치 오케스트레이터. 주제 분석 → 팀 구성 → 병렬 조사 → 검증 → 통합까지 전체 워크플로우를 실행한다. '리서치해줘', '조사해줘', '분석해줘', '\~에 대해 알아봐' 등의 요청이 있으면 이 스킬을 사용할 것."

# Deep Research — 다각도 심층 리서치 오케스트레이터

## 개요

복잡한 주제를 다각도로 조사하여 검증된 종합 보고서를 생성한다. 메인 에이전트가 직접 오케스트레이션하며, 중간 레이어(리서치 리드 등)를 두지 않는다.

**핵심 원칙**: 속도보다 품질 우선. 메인은 오케스트레이터 역할에 집중하고, 복잡한 조사는 서브 에이전트에 분산한다.

---

## Step 0: 주제 분석 + 팀 구성 결정

### 주제 유형 판단

| Type | 특징 | 팀 구성 | 예시 |
| --- | --- | --- | --- |
| **A** | 기술 수학/공학 — 교과서/논문 기반, 커뮤니티 불필요 | researcher.md × N (관점별, mixed 모드) + critic.md | 기어 설계 수학, CNC 열변형 보정 |
| **B** | 기술 동향/전략 — 웹+학술+커뮤니티 모두 유의미 | researcher.md × 3 (web/academic/community 모드) + critic.md | 디지털 트윈 도입, AI 시스템 전환 |
| **C** | 하이브리드 — 관점별 + 소스 유형별 혼합 | researcher.md × N (관점별 × 모드별 조합) + critic.md | 레이저 가공 산업 동향 + 기술 원리 |
| **D** | 간단 확인 — 에이전트 불필요 | 메인 직접 처리 | 단일 사실 확인, 짧은 요약 |

### 팀 규모

- **표준**: Researcher 2\~3 + Critic 1 + Journal 1
- **확장** (3개 이상 독립 관점): Researcher 3\~4 + Critic 1 + Verifier 1 + Journal 1
- **Critic 필수 조건**: Researcher 2명 이상

### 모델 정책

| 역할 | 모델 | 이유 |
| --- | --- | --- |
| Researcher | sonnet | 검색→정리→구조화 중심, 에이전트 정의로 품질 확보 |
| Critic | opus | 상충점 발견, 확신도 교정 등 높은 추론력 필수 |
| Verifier | sonnet | 원문 대조 중심 작업 |
| Journal | sonnet | 구조화된 기록 |

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

---

## Step 3: 병렬 조사

### 3.1 에이전트 발사

**Researcher + Journal 병렬 발사** (독립적이므로 동시):

```
Agent(
  description: "Researcher N: {관점}",
  prompt: "에이전트 정의: .claude/agents/researcher.md의 지침을 따르라.
           검색 전략 모드: {academic/web/community/mixed}
           모드별 상세: .claude/skills/{모드에 해당하는 스킬}/SKILL.md를 Read하여 참조.
           관점: {관점/범위}
           조사 범위 상세: {상세 지시}
           공유 컨벤션: {Step 2에서 정의한 내용}
           저장 경로: docs/research/{date}-{topic}/{NN}-{filename}.md",
  model: "sonnet",
  mode: "bypassPermissions",
  run_in_background: true
)
```

**Critic은 모든 Researcher 완료 후 발사한다.**

### 3.2 Background 모니터링

- `run_in_background: true`로 발사한 에이전트는 완료 알림을 기다린다
- **10분 후** 산출물 파일 존재 여부를 확인한다: `ls -la {출력 파일 경로}`
- **20분 경과 후** 산출물 파일이 없거나 비어 있으면 **스톨**로 간주한다
- **재발사**: foreground(동기)로 재발사. 프롬프트에 "파일 읽지 말 것, 아래 내용만 사용" 지시.

---

## Step 4: 검증

### 4.1 Critic 발사

모든 Researcher 완료 후:

```
Agent(
  description: "Critic: {N}개 산출물 검토",
  prompt: "에이전트 정의: .claude/agents/critic.md의 지침을 따르라.
           검토 대상: {산출물 파일 경로 목록}
           저장 경로: docs/research/{date}-{topic}/99-critic-review.md",
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
- **담당**: Verifier 또는 Focused Researcher 1명만 spawn
- **산출물**: `98-repair-notes.md` 또는 `99-critic-review.md` 하단 추가
- **Hard Stop**: Repair는 **1회만**

---

## Step 5: 통합 (Synthesis)

**메인이 직접 수행한다** (Synthesizer 에이전트 아님 — 컨텍스트 오염 방지).

### 필수 작업

1. **중복 제거** — Researcher 간 중복 수집된 정보 통합
2. **상충점 정리** — Critic이 지적한 상충점 해결
3. **근거 강도 평가** — 교차 검증 등급 반영
4. **결론 우선순위화** — 핵심 발견 순위 결정
5. **불확실성 명시** — 조건부 결론 표시

### Synthesis 필수 섹션

1. **근거 신뢰도 매트릭스**: 핵심 주장별 출처, 도메인 일치도, 확신도, 검증 필요 여부 (표)
2. **상충점 해결 테이블**: 상충 시 각 측 주장 + 판단 근거 (표, 해당 시)
3. **역방향 의사결정 가이드**: "결과가 X이면 → Y를 조정하라" (해당 시)
4. **예상 밖 핵심 발견**: 사용자 질문 범위 밖이지만 의사결정 영향 (해당 시)
5. **후속 탐색 질문**: 다음에 조사해야 할 질문 2\~3개

해당 없으면 "해당 없음, 이유: ..." 명시. 억지로 채우지 않는다.

### 검색 비용 보고

```bash
./scripts/search.sh stats
```

synthesis 보고서 하단에 포함: 도구별 호출 수, Perplexity 예상 비용, Tavily 크레딧 사용량.

### 프레젠테이션 제안

Researcher 2명 이상 리서치이고, "리서치만" 요청이 아닌 경우 프레젠테이션 생성을 제안한다.

- 16장 이상: `.claude/agents/presentation-builder.md` 파이프라인
- 15장 이하: `.claude/skills/create-presentation/SKILL.md`

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

품질 우선은 느려도 된다는 뜻이지, 불필요하게 비효율적이어도 된다는 뜻은 아니다.