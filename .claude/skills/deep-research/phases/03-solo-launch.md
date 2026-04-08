# Step 4: Solo 모드 — 에이전트 발사

Agent Teams가 사용 불가능하거나 Agent Teams 모드 실행이 실패한 경우에만 이 파일을 사용한다.

## Solo 모드 차이점

| 항목 | Agent Teams | Solo |
|------|-----------|------|
| Researcher | team teammate | `run_in_background: true` |
| Journal | team teammate (상주) | **생략** |
| Critic | team teammate | foreground Agent |
| 통신 | SendMessage | 없음 (결과 반환만) |
| 메인 부담 | 낮음 | 높음 (전문 읽기 필요) |

## 4.1 Researcher 병렬 발사

**스킬 사전 삽입**: 발사 전에 해당 모드의 스킬 파일을 Read하여 프롬프트에 삽입한다.

```
Agent(
  description: "Researcher N: {관점}",
  prompt: "에이전트 정의: .claude/agents/researcher.md의 지침을 Read하여 따르라.
           검색 전략 모드: {모드}
           관점: {관점/범위}
           조사 범위 상세: {상세 지시}
           공유 컨벤션: {Step 3에서 정의한 내용}
           저장 경로: docs/research/{date}-{topic}/{NN}-{filename}.md

           [모드별 상세 지침]
           {메인이 Read한 스킬 파일 전문을 여기에 삽입}
           [모드별 상세 지침 끝]",
  subagent_type: "researcher",
  model: "sonnet",
  mode: "bypassPermissions",
  run_in_background: true
)
```

## 4.2 스톨 감지

- **10분 후** 산출물 파일 존재 확인: `ls -la {출력 경로}`
- **20분 경과** 산출물이 없거나 비어있으면 스톨 간주
- 재발사: foreground(동기)로 재발사

## Solo 모드에서의 후속 단계

- Step 5 (검증): Critic을 foreground Agent로 발사
- Step 6 (통합): Journal 마감 없음. 메인이 직접 Researcher 산출물 전문을 읽고 Synthesis
