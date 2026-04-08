# Step 4: Agent Teams 모드 — 에이전트 발사

## 4.1 TeamCreate

```
TeamCreate(
  team_name: "research-{topic-slug}",
  description: "{주제} 심층 리서치 팀"
)
```

## 4.2 Journal 먼저 발사 [HARD]

Journal은 모든 Researcher보다 반드시 먼저 발사한다. Journal이 없으면 Researcher 완료 알림을 수신할 teammate가 없다.

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
           공유 컨벤션: {Step 3에서 정의한 내용}

           초기화 메시지를 받았다. 저널 파일 헤더를 생성하고 Researcher 완료 알림을 대기하라.",
  subagent_type: "general-purpose",
  team_name: "research-{topic-slug}",
  name: "journal",
  model: "sonnet",
  mode: "bypassPermissions"
)
```

**발사 확인**: Journal이 `97-journal.md` 헤더를 생성했는지 Glob으로 확인. 미생성 시 1회 재발사. 재실패 시 Solo 모드로 폴백 (Read `phases/03-solo-launch.md`).

## 4.3 Researcher 병렬 발사

Journal 발사 직후, 모든 Researcher를 **단일 메시지에서 병렬로** 발사한다.

**스킬 사전 삽입**: 발사 전에 해당 모드의 스킬 파일을 Read하여 프롬프트에 삽입한다.

```
Agent(
  description: "Researcher 1: {관점}",
  prompt: "에이전트 정의: .claude/agents/researcher.md의 지침을 Read하여 따르라.
           검색 전략 모드: {모드}
           관점: {관점/범위}
           조사 범위 상세: {상세 지시}
           공유 컨벤션: {Step 3에서 정의한 내용}
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
           핵심 수치: {핵심 수치 1~3개, '수치명: 값 [출처]' 형식}
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

## 4.4 Researcher 완료 대기 + Journal 중간 보고

모든 Researcher가 완료되면:

1. Journal에게 SendMessage: "모든 Researcher 완료. 사전 상충점 보고를 Team Lead에게 전달하라"
2. Journal이 Team Lead에게 아래 형식으로 SendMessage:

```
사전 상충점 보고
상충 건수: {N}건
---
| 항목 | 관련 Researcher | 상충 내용 요약 |
|------|----------------|---------------|
| {수치/주장} | R1 vs R2 | {한줄 설명} |
---
Critic 초점 제안: {상충이 집중된 영역}
```

3. Team Lead는 이 보고를 바탕으로 Critic 발사 초점을 결정

## 4.5 스톨 감지

- **20분** 경과 후 미완료 → 스톨 간주
- 산출물 파일 존재 확인 (`ls -la {출력 경로}`)
- 비어있거나 없으면 → SendMessage로 상태 확인. 응답 없으면 새 teammate 발사
