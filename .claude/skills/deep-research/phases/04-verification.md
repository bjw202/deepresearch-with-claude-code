# Step 5: 검증

## 5.1 Critic 발사

모든 Researcher 완료 후, Journal의 사전 상충점 보고를 참고하여 발사한다.

```
Agent(
  description: "Critic: {N}개 산출물 검토",
  prompt: "에이전트 정의: .claude/agents/critic.md의 지침을 Read하여 따르라.
           검토 대상: {산출물 파일 경로 목록}
           저장 경로: docs/research/{date}-{topic}/99-critic-review.md

           [사전 감지된 상충점 - Journal 보고]
           {Journal이 보고한 사전 상충점 내용}

           [팀 통신 규칙] (Agent Teams 모드 시)
           리뷰 완료 후 산출물을 저장하고, journal teammate에게 아래 형식으로 SendMessage:
           ---
           Critic 리뷰 완료: {파일 경로}
           ---",
  subagent_type: "critic",
  team_name: "research-{topic-slug}",  // Solo 모드에서는 이 줄 제거
  name: "critic",
  model: "opus",
  mode: "bypassPermissions"
)
```

## 5.2 교차 검증 등급 확인

Critic 산출물에서 아래 등급이 부여되었는지 확인:
- `[확인됨]` — 3개 이상 채널에서 독립 확인
- `[높은 신뢰]` — 2개 채널에서 확인
- `[단일 출처]` — 1개 채널에서만 언급
- `[상충]` — 채널 간 상충 + 양쪽 출처 병기

## 5.3 Repair Pass 판단

Critic이 "Repair Pass 필요"로 판정한 경우에만 수행:

- **트리거**: 핵심 수치 출처 허위, 상충점 추가 조사 필요, 결함 미반영
- **범위**: 결함 직결 보수만. 새 하위 주제/분량 확대 금지
- **Hard Stop**: Repair는 **1회만**

### Verifier 발사

```
Agent(
  description: "Verifier: 원문 대조 검증",
  prompt: "당신은 원문 대조 검증 에이전트다. 먼저 .claude/agents/verifier.md를 Read하여 전체 지침을 숙지하라.

           [결함 목록]
           {Critic이 지적한 구체적 결함 목록}

           [대상 파일]
           {검증할 Researcher 산출물 경로}

           저장 경로: docs/research/{date}-{topic}/98-repair-notes.md

           [팀 통신 규칙] (Agent Teams 모드 시)
           검증 완료 후 산출물을 저장하고, journal teammate에게 SendMessage:
           Verifier 검증 완료: {파일 경로}
           정정 건수: {N}건",
  subagent_type: "general-purpose",
  team_name: "research-{topic-slug}",  // Solo 모드에서는 이 줄 제거
  name: "verifier",
  model: "sonnet",
  mode: "bypassPermissions"
)
```
