# Deep Research Project

## Identity

이 프로젝트는 Claude Code의 멀티 에이전트 시스템을 활용한 **심층 리서치 도구**다.
`/deep-research` 스킬로 주제를 조사하면, Researcher/Journal/Critic/Verifier 에이전트가 협력하여 검증된 보고서를 생성한다.

## Language

- 사용자 응답: 한국어
- 에이전트 간 통신: 영어
- 코드 주석: 한국어

## Agent Catalog

| Agent | Type | subagent_type | Role |
|-------|------|---------------|------|
| Researcher | 사전 정의 | `researcher` | 관점별 조사, 4계층 앙상블 검색 |
| Critic | 사전 정의 | `critic` | 6항목 체크리스트, 교차 검증 등급 |
| Journal | 커스텀 | `general-purpose` | 실시간 요약, 쟁점 추적, 메타 분석 |
| Verifier | 커스텀 | `general-purpose` | 원문 대조 검증, Repair Pass 전용 |

## Skills

| Skill | Path | Purpose |
|-------|------|---------|
| deep-research | `.claude/skills/deep-research/` | 오케스트레이션 (주제 분석 -> 팀 구성 -> 조사 -> 검증 -> 통합) |
| academic-research | `.claude/skills/academic-research/` | 학술 검색 모드 (분야별 DB, Tier 분류) |
| community-analysis | `.claude/skills/community-analysis/` | 커뮤니티 분석 모드 (정서 분석, 편향 보정) |
| web-research | `.claude/skills/web-research/` | 웹 검색 모드 (출처 등급, Fact/Claim 분류) |
| create-presentation | `.claude/skills/create-presentation/` | 리서치 결과 프레젠테이션 생성 |

## Core Rules

1. **스킬 사전 삽입**: Researcher 발사 시 메인이 모드별 스킬을 Read하여 프롬프트에 직접 삽입한다
2. **Preflight Check**: 에이전트 발사 전 `.claude/agents/` 파일 존재를 확인한다
3. **커스텀 에이전트는 general-purpose**: Journal, Verifier는 `subagent_type: "general-purpose"`로 발사하고 프롬프트에서 에이전트 정의를 Read하도록 지시한다
4. **차단 커뮤니티**: DC인사이드, 에펨코리아, 일베 등 극단 사상 커뮤니티는 절대 사용 불가
5. **검색 예산**: Researcher당 최대 22회, Verifier 최대 9회

## Agent Teams

- Claude Code v2.1.50+ 필요
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 설정됨
- TeamCreate/SendMessage/TeamDelete로 팀 관리
- Solo 모드 폴백 지원 (Agent Teams 미사용 환경)

## Search Tools

- Layer 0: WebSearch + WebFetch (빌트인)
- Layer 1: `./scripts/search.sh perplexity/tavily search` (유료)
- Layer 2: `./scripts/search.sh tavily extract` (원문 확보)
- Layer 3: `./scripts/search.sh perplexity/tavily research/reason` (심층)

## Output

리서치 산출물은 `docs/research/{YYYY-MM-DD}-{topic-slug}/`에 저장:
- `01~N`: Researcher 산출물
- `97`: Journal
- `98`: Repair Notes (Verifier)
- `99`: Critic Review
- `00`: Synthesis (최종 통합 보고서)
