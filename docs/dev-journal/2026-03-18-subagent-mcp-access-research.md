# Sub-Agent MCP Tool Access Research

## Session Meta
- Date: 2026-03-18
- Topic: Claude Code sub-agent의 MCP tool 접근 가능 여부 조사
- Agent: Main (direct research - 서브 에이전트 분해 실익 낮음)

## User Request Summary
Claude Code에서 Agent tool로 spawn된 서브 에이전트가 MCP 도구에 접근할 수 있는 방법 조사

## Problem Definition
- 메인 에이전트: Tavily, Perplexity 등 MCP 도구 사용 가능
- 서브 에이전트(Agent tool spawn): MCP 도구 접근 불가, 내장 도구만 사용 가능
- 이로 인해 멀티에이전트 리서치 패턴에서 서브 에이전트가 직접 웹 검색 불가

## Key Findings

### 1. 공식 문서상 동작 (이론)
- "By default, subagents inherit all tools from the main conversation, including MCP tools" (공식 문서)
- `tools` 필드 생략 시 모든 MCP 도구 상속
- `tools` allowlist 또는 `disallowedTools` denylist로 제한 가능

### 2. 실제 동작 (현실) - 다수의 버그/제한 존재

#### Foreground vs Background 문제
- **Foreground 서브에이전트**: MCP 도구 접근 가능 (이론상)
- **Background 서브에이전트**: MCP 도구 접근 불가 (공식 문서 확인)
- Claude Code가 foreground/background를 자동 결정하므로 비결정적 실패 발생
- Issue #19964: 문서 자체에 모순 존재 (Available tools vs Background 섹션)

#### Project-scoped MCP 문제
- `.mcp.json` (프로젝트 스코프)로 설정된 MCP 서버는 서브에이전트에서 접근 불가
- `~/.claude.json` (글로벌 스코프)로 설정된 MCP 서버는 접근 가능한 경우 있음
- Issue #13898: 프로젝트 스코프 MCP에 접근 못하면 hallucination 발생

#### Task tool 상속 문제
- Task tool로 spawn된 서브에이전트가 MCP 도구 상속 실패
- Issue #5465, #14714: permission context가 제한적
- Issue #14496: 복잡한 프롬프트에서 MCP 도구 접근 실패

#### Custom Subagent 문제
- `.claude/agents/` 에 정의된 커스텀 에이전트가 MCP 도구 접근 불가
- Issue #15810: 플러그인 정의 에이전트가 MCP 도구 미상속

### 3. MCP 설정 파일 구조

| Scope | 파일 위치 | 용도 |
|-------|----------|------|
| Project | `.mcp.json` (프로젝트 루트) | 팀 공유 MCP 서버 |
| User/Local | `~/.claude.json` | 개인 MCP 서버, 인증 토큰 |
| Enterprise | `managed-mcp.json` (시스템 디렉토리) | 중앙 관리 |

### 4. 현재 프로젝트 설정
- `.mcp.json`에 Perplexity와 Tavily 설정됨 (프로젝트 스코프)
- 프로젝트 스코프이므로 서브에이전트 접근 문제에 해당

## Workarounds (대안)

### W1: 메인 에이전트가 검색 후 결과 전달
- 메인이 MCP 도구로 검색 수행
- 검색 결과를 서브 에이전트 프롬프트에 포함하여 전달
- 장점: 안정적, 현재 즉시 적용 가능
- 단점: 메인 에이전트 컨텍스트 소모, 병렬 검색 불가

### W2: 글로벌 스코프로 MCP 설정 이동
- `.mcp.json` -> `~/.claude.json`으로 MCP 서버 설정 이동
- 글로벌 스코프 MCP는 서브에이전트 접근 가능할 수 있음
- 단점: 프로젝트 이식성 저하, 팀 공유 어려움
- 주의: 이것도 100% 보장은 아님 (background 서브에이전트에서는 여전히 불가)

### W3: 서브에이전트에서 WebSearch (내장 도구) 사용
- 서브에이전트는 내장 WebSearch 도구 접근 가능
- Tavily/Perplexity 대비 품질/비용 효율은 낮지만 동작함
- 장점: 즉시 적용 가능, 서브에이전트 독립 검색 가능
- 단점: 요청당 ~$0.145 (Opus 기준), Perplexity 대비 비효율

### W4: Custom Agent + Foreground 강제
- `.claude/agents/`에 커스텀 에이전트 정의
- 가능하면 foreground 실행 유도 (background에서는 MCP 불가)
- 단점: foreground/background 선택을 완전히 제어 불가

### W5: Claude Agent SDK 사용
- Claude Code CLI가 아닌 Agent SDK를 직접 사용
- SDK에서는 MCP 서버를 프로그래밍적으로 서브에이전트에 주입 가능
- 단점: CLI 기반 워크플로우와 별개, 개발 필요

## Decision Log

### 현재 권장 전략
1. **단기**: W1 (메인이 검색 + 결과 전달) + W3 (서브에이전트에서 내장 WebSearch 활용)
2. **중기**: W2 시도 (글로벌 스코프로 MCP 이동 후 테스트)
3. **장기**: Anthropic의 버그 수정 대기 (활발한 이슈 트래킹 중)

### 이 이슈의 상태
- 2025년 12월부터 다수의 GitHub 이슈 보고됨
- 2026년 2월까지도 미해결 이슈 존재
- Anthropic이 인지하고 있으나 아직 완전한 수정은 없음

## TODO
- [ ] `~/.claude.json`에 MCP 서버를 글로벌 스코프로 추가하고 서브에이전트 접근 테스트
- [ ] CLAUDE.md의 Search Tool Usage Policy에 서브에이전트 제한사항 반영
- [ ] 서브에이전트용 WebSearch 비용 최적화 전략 수립

## Rejected Alternatives
- **MCP 서버를 Bash 커맨드로 우회 호출**: API 키 노출, 보안 리스크, 불안정
- **서브에이전트 미사용 (단일 에이전트)**: 멀티에이전트의 핵심 이점 포기
- **서브에이전트마다 별도 Claude Code 인스턴스**: 오버헤드 과다, 비현실적

## Sources
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/mcp
- https://github.com/anthropics/claude-code/issues/13898
- https://github.com/anthropics/claude-code/issues/19964
- https://github.com/anthropics/claude-code/issues/14496
- https://github.com/anthropics/claude-code/issues/5465
- https://github.com/anthropics/claude-code/issues/13254
- https://github.com/anthropics/claude-code/issues/23374
- https://github.com/anthropics/claude-code/issues/15810
- https://github.com/anthropics/claude-code/issues/14714
