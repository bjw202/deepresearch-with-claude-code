# Perplexity MCP Server Setup for Claude Code - Research

## Session Meta
- Date: 2026-03-18
- Task: Perplexity MCP 서버의 Claude Code 설정 방법 조사
- Sources: GitHub, Perplexity 공식 문서, Claude Code 공식 문서

## User Request Summary
Claude Code에서 Perplexity MCP 서버를 설정하는 방법 조사:
1. 공식 패키지/저장소 존재 여부
2. Claude Code MCP 설정 방법
3. API 키 설정 방법
4. 사용 가능한 도구 목록

## Problem Definition
Perplexity의 검색/추론 기능을 Claude Code 내에서 MCP 프로토콜을 통해 사용하기 위한 설정 방법 파악

## Key Findings

### 1. Official Package / Repository

- **GitHub**: https://github.com/perplexityai/modelcontextprotocol
- **npm 패키지**: `@perplexity-ai/mcp-server` (v0.8.2+)
- **라이선스**: MIT
- **참고**: URL이 `ppl-ai/modelcontextprotocol`에서 `perplexityai/modelcontextprotocol`로 변경됨 (redirect 될 수 있음)

### 2. Claude Code Setup Methods

#### Method A: CLI 명령어 (권장)
```bash
claude mcp add perplexity --env PERPLEXITY_API_KEY="your_key_here" -- npx -y @perplexity-ai/mcp-server
```

#### Method B: .mcp.json (프로젝트 공유용)
```json
{
  "mcpServers": {
    "perplexity": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
      }
    }
  }
}
```

#### Method C: claude mcp add-json
```bash
claude mcp add-json perplexity '{"type":"stdio","command":"npx","args":["-y","@perplexity-ai/mcp-server"],"env":{"PERPLEXITY_API_KEY":"your_key"}}'
```

### 3. API Key Setup

- **획득처**: https://console.perplexity.ai (API Portal)
- **필수 환경변수**: `PERPLEXITY_API_KEY`
- **선택 환경변수**:
  - `PERPLEXITY_TIMEOUT_MS`: 타임아웃 (기본 5분)
  - `PERPLEXITY_BASE_URL`: API base URL (기본 https://api.perplexity.ai)
  - `PERPLEXITY_LOG_LEVEL`: DEBUG|INFO|WARN|ERROR

### 4. Available Tools

| Tool | Model | Purpose | Use Case |
|------|-------|---------|----------|
| `perplexity_search` | Search API | 직접 웹 검색 | 현재 정보, 뉴스, 사실, 특정 웹 콘텐츠 |
| `perplexity_ask` | sonar-pro | 대화형 AI + 실시간 검색 | 빠른 질문, 일상적 검색, 웹 맥락 필요한 쿼리 |
| `perplexity_research` | sonar-deep-research | 심층 리서치 | 복잡한 주제의 상세 조사, 종합 보고서, 심층 분석 |
| `perplexity_reason` | sonar-reasoning-pro | 고급 추론 | 논리적 문제, 복잡한 분석, 의사결정, 단계별 추론 |

### 5. MCP Scope in Claude Code

| Scope | Storage | Use Case |
|-------|---------|----------|
| `local` (default) | `~/.claude.json` (프로젝트별) | 개인 설정, 실험, 민감한 자격증명 |
| `project` | `.mcp.json` (프로젝트 루트) | 팀 공유, VCS 체크인 |
| `user` | `~/.claude.json` (전역) | 여러 프로젝트에서 사용하는 개인 도구 |

### 6. Cost Information
- perplexity_ask (sonar-pro): ~$0.01/요청
- perplexity_research (sonar-deep-research): ~$0.05-0.20/요청
- perplexity_reason (sonar-reasoning-pro): 별도 확인 필요

## Decision Log
- 공식 패키지 `@perplexity-ai/mcp-server`가 존재하므로 비공식 패키지 사용 불필요
- CLI 명령어(`claude mcp add`)가 가장 빠르고 권장되는 설정 방법
- API 키는 환경변수로 관리하며, .mcp.json에 직접 하드코딩하지 않고 `${PERPLEXITY_API_KEY}` 형태로 참조 권장

## Rejected Alternatives
- `perplexity-mcp` (비공식 npm 패키지) - 공식 패키지 존재하므로 불필요
- `jsonallen/perplexity-mcp`, `Alcova-AI/perplexity-mcp` 등 커뮤니티 구현 - 공식 지원이 충분
- Docker 배포 - 로컬 개발 환경에서는 npx가 더 간편

## TODO
- [ ] PERPLEXITY_API_KEY 발급 (https://console.perplexity.ai)
- [ ] `claude mcp add` 명령어로 설정 적용
- [ ] `/mcp` 명령으로 연결 상태 확인
- [ ] CLAUDE.md의 Search Tool Usage Policy 테이블과 실제 도구명 매핑 확인
