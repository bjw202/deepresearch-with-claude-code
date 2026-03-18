# Web Search Tool 충분성 평가 및 대안 연구

## Session Meta

- **Date**: 2026-03-18
- **Topic**: WebSearch 도구 충분성 평가 및 Perplexity/Tavily API 대안 연구
- **Agents used**: 3 Researchers (WebSearch 현황, Perplexity API, Tavily API) + 1 Journal

## User Request Summary

Claude Code의 내장 WebSearch 도구가 멀티에이전트 리서치 시스템에서 충분한 품질을 제공하는지 평가하고, Perplexity API 또는 Tavily API 통합이 리서치 품질을 유의미하게 높일 수 있는지 조사.

## Problem Definition

CLAUDE.md의 멀티에이전트 리서치 정책은 "속도보다 품질 우선"을 명시하고 있다. 서브 에이전트(Researcher, Verifier 등)가 웹 검색에 의존하는데, 내장 도구의 한계가 리서치 품질의 병목인지 확인이 필요하다.

## Key Assumptions

- 사용자의 리서치 작업은 단순 사실 확인을 넘어서는 깊이를 요구함
- MCP 서버 통합이 Claude Code에서 가장 자연스러운 확장 방법
- 비용은 고려 사항이지만 최우선 제약은 아님
- 품질과 인용 신뢰성이 최우선

## Core Findings

### WebSearch (Built-in) 한계

| 한계 | 영향 |
| --- | --- |
| WebFetch가 Haiku로 요약 반환 (원문 아님) | 정보 손실 불가피, 정확한 인용 불가 |
| 직접 인용 125자 제한 | 사실 검증용 원문 확보 어려움 |
| 검색당 \~10개 결과 (제목+URL만) | 내용 확인하려면 각각 WebFetch 필요 |
| JavaScript 렌더링 없음 | SPA 기반 사이트 접근 불가 |
| 재귀적 크롤링/링크 추적 없음 | 깊이 있는 조사에 구조적 한계 |
| 검색당 \~$0.145 (Opus 기준) | 여러 번 검색하면 비용 급증 |

### Perplexity API (1순위 추천)

- **Models**: sonar, sonar-pro, sonar-reasoning-pro, sonar-deep-research
- **핵심 강점**: 검색+합성+인용을 한 번에 수행, 자율적 다단계 리서치
- **MCP 서버**: `@perplexity-ai/mcp-server` (공식, 4개 도구 제공)
- **설치**: `claude mcp add perplexity --env PERPLEXITY_API_KEY="key" -- npx -y @perplexity-ai/mcp-server`
- **가격**: sonar $1/1M tokens + $5-12/1K requests
- **주의**: deep-research 5 RPM (Tier 0), MCP vs API 방향성 불확실

### Tavily API (보조 추천)

- **핵심 강점**: Extract 엔드포인트로 원문 배치 추출, Crawl/Map으로 사이트 구조 파악
- **MCP 서버**: `claude mcp add tavily-remote-mcp --transport http https://mcp.tavily.com/mcp/`
- **가격**: 무료 1,000크레딧/월, 유료 $30/월부터
- **주의**: 쿼리 400자 제한, 키워드 기반 검색

## Decision Log

1. 3개 옵션을 병렬 조사 → 각각의 구체적 수치와 한계를 확인
2. **결론**: 내장 WebSearch는 deep research에 불충분
3. **Perplexity MCP를 1순위로 추천**: sonar-pro의 합성 능력 + deep-research의 자율 조사가 가장 높은 ROI
4. **Tavily를 보조로 추천**: 원문 추출과 사이트 크롤링에서 보완적 가치

## Rejected Alternatives

| 대안 | 기각 이유 |
| --- | --- |
| Brave Search MCP | raw search만 제공, 합성/인용 없음 |
| Exa MCP | semantic search는 강점이나 범용 리서치에 부적합 |
| WebSearch+WebFetch 오케스트레이션 강화 | 구조적 한계(Haiku 요약, 125자 인용)는 오케스트레이션으로 해결 불가 |

## Proposed Search Tool Usage Policy

```
서브 에이전트는 다음 기준으로 검색 도구를 선택한다:

1. 빠른 사실 확인 → 기본 WebSearch
2. 일반 조사 → perplexity_ask (sonar-pro)
3. 심층 리서치 → perplexity_research (sonar-deep-research)
4. 복합 추론 → perplexity_reason (sonar-reasoning-pro)
5. 특정 URL 원문 확보 → Tavily extract 또는 WebFetch
6. 사이트 구조 파악/크롤링 → Tavily crawl/map
```

## Risks & Uncertainties

- Perplexity deep-research 레이트 제한 (Tier 0: 5 RPM)이 동시 에이전트 사용 시 병목 가능
- Perplexity CTO가 MCP보다 API/CLI 선호 → 장기적 MCP 지원 불확실
- 두 서비스 모두 API 키 필요, 비용 관리 체계 필요

## TODO

- [ ] Perplexity API 키 발급 및 MCP 서버 설치

- [ ] (선택) Tavily MCP 서버 설치

- [ ] CLAUDE.md에 Search Tool Usage Policy 추가

- [ ] 새 도구로 리서치 품질 테스트 (baseline 대비)

- [ ] 레이트 제한 대응 전략 수립 (deep-research 5 RPM 제약)