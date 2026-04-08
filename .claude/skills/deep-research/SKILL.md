---

## name: deep-research description: "다각도 심층 리서치 오케스트레이터. 주제 분석 → 팀 구성 → 병렬 조사 → 검증 → 통합까지 전체 워크플로우를 실행한다. '리서치해줘', '조사해줘', '분석해줘', '\~에 대해 알아봐' 등의 요청이 있으면 이 스킬을 사용할 것."

# Deep Research — 오케스트레이터

## 핵심 원칙

메인은 오케스트레이터다. 직접 조사하거나 산출물을 읽지 않는다. Researcher가 조사하고, Journal이 요약하고, Critic이 검증하고, 메인은 최종 Synthesis만 수행한다.

## Step 0: 실행 모드 결정 \[HARD\]

**이 단계를 건너뛰거나 자의적으로 판단하지 않는다.** 아래 조건을 기계적으로 평가하고, 결과를 사용자에게 반드시 출력한다.

```
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 환경변수가 "1"?
  YES → Agent Teams 모드
  NO → Solo 모드
```

결정 후 사용자에게 출력: `실행 모드: Agent Teams / Solo`

Agent Teams 모드가 결정되면 Step 3\~5에서 반드시 TeamCreate/SendMessage/TeamDelete를 사용한다. Solo 폴백은 Agent Teams 실행이 실패한 경우에만 허용된다.

## Step 1: 주제 분석 + 팀 구성

### 1.1 조사 패턴 판별

주제의 **도메인이 아니라 조사에 필요한 관점 수와 소스 유형**으로 판별한다.

| 패턴 | 판별 기준 | 팀 구성 | 예시 |
| --- | --- | --- | --- |
| **단일 관점** | 하나의 관점에서 깊이 파고들면 충분 | R1 (모드 자유) | 특정 기술 원리, 수학 공식, 단일 제품 분석 |
| **다관점 비교** | 2\~3개 관점의 비교/대조가 필요 | R2\~3 (관점별 모드 배정) | 기술 A vs B, 찬반 분석, 산업별 비교 |
| **다차원 탐색** | 4\~5개 이상의 독립적 차원이 존재 | R4\~5 (차원별 관점+모드) | 정책의 경제/사회/기술/법률 영향, 복합 전략 |
| **간단 확인** | 단일 소스에서 5분 내 확인 가능 | 메인 직접 처리 (에이전트 불필요) | 사실 확인, 정의 조회, 단순 비교 |

### 1.2 관점 설계 (모드와 관점은 독립 차원)

**모드**(academic/web/community/mixed)는 검색 전략이고, **관점**은 조사 범위다. 같은 모드로 여러 관점을 병렬 조사할 수 있다.

설계 예시:

- "A 기술의 시장 전망" → R1(web: 산업 동향) + R2(academic: 기술 성숙도) + R3(web: 경쟁 구도) — 같은 web이지만 관점이 다름
- "X 정책 영향 분석" → R1(web: 경제 영향) + R2(academic: 사회과학 연구) + R3(web: 해외 사례) + R4(community: 여론/반응)
- "수학적 모델링 검증" → R1(academic: 이론) + R2(academic: 실험 데이터) — 같은 모드, 다른 범위

### 1.3 팀 규모 결정

| Researcher 수 | 조건 | Critic | Journal |
| --- | --- | --- | --- |
| 1명 | 단일 관점 패턴 | 선택 | 선택 |
| 2\~3명 | 다관점 비교 (표준) | 필수 | 필수 |
| 4\~5명 | 다차원 탐색 (복잡 주제) | 필수 | 필수 |

5명 초과는 Journal의 상충점 추적 부담이 급증하므로 권장하지 않는다. 차원이 6개 이상이면 2라운드로 분할한다.

모델: Researcher/Journal/Verifier = sonnet, Critic = opus

## Step 2: Question Expansion

1. 사용자의 핵심 질문
2. 검증이 필요한 전제 1\~2개
3. 놓쳤을 가능성이 큰 인접 질문 2\~3개
4. 결론을 뒤집을 수 있는 반대 시나리오 1개
5. (선택) 이질 도메인 유추

## Step 3: 준비

1. `mkdir -p docs/research/{YYYY-MM-DD}-{topic-slug}/`
2. 검색 시간 범위 결정: 초고속(180일) / 고속(365) / 중속(730) / 저속(1095)
3. 공유 컨벤션 정의 (핵심 질문, 범위, 확신도 표기법, 저장 경로)
4. **Preflight Check \[HARD\]**: 4개 에이전트 파일 존재 확인
   - `researcher.md` 없음 → 중단
   - `critic.md` 없음 + Researcher 2명 이상 → 중단
   - `critic.md` 없음 + Researcher 1명 → Critic 생략 (경고 출력)
   - `journal.md` 없음 → Solo 폴백
   - `verifier.md` 없음 → Repair Pass 비활성화

## Step 4: 에이전트 발사

**이 단계의 상세 지침을 Read한다:**

- Agent Teams 모드 → Read `.claude/skills/deep-research/phases/03-team-launch.md`
- Solo 모드 → Read `.claude/skills/deep-research/phases/03-solo-launch.md`

핵심 규칙 (Read 전에 숙지):

- 스킬 사전 삽입: 메인이 모드별 스킬을 Read하여 Researcher 프롬프트에 직접 삽입
- subagent_type: Researcher=`researcher`, Critic=`critic`, Journal/Verifier=`general-purpose`

| 모드 | 메인이 사전 Read할 스킬 |
| --- | --- |
| academic | `.claude/skills/academic-research/SKILL.md` |
| web | `.claude/skills/web-research/SKILL.md` |
| community | `.claude/skills/community-analysis/SKILL.md` |
| mixed | 삽입 불필요 |

## Step 5: 검증

**상세 지침**: Read `.claude/skills/deep-research/phases/04-verification.md`

핵심 흐름: Critic 발사 → 교차 검증 등급 확인 → (필요 시) Repair Pass 1회

## Step 6: 통합 (Synthesis)

**상세 지침**: Read `.claude/skills/deep-research/phases/05-synthesis.md`

핵심 흐름: Journal 마감 → 팀 해산 → Journal 요약 + Critic 리뷰 읽기 → 최종 보고서 작성

---

## Failure Prevention \[HARD\]

다음을 피한다:

- 실질 분업 없는 형식적 멀티에이전트
- 검증 없는 통합 / 근거 없는 강한 결론
- 메인이 Researcher 산출물을 직접 전문 읽는 것 (Journal 요약을 먼저)
- Journal에게 판단을 시키는 것 (Journal은 기록만, 판단은 Critic)
- Researcher에게 Journal 완료를 기다리게 하는 것 (비동기 통신)
- **차단 커뮤니티 소스 사용** (DC인사이드, 에펨코리아, 일베 — 예외 없음)
- **검색 예산 초과** (각 Researcher 개별 상한 22회, Verifier 9회. 전체 합산 상한은 없으나 Synthesis에서 총 사용량을 명시한다)
- **Step 0 모드 결정을 건너뛰거나 자의적으로 Solo 선택하는 것**