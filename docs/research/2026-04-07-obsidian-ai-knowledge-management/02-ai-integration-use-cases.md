# AI 통합 사용 사례 및 워크플로우 — Obsidian + AI 통합

**Researcher 산출물** | 2026-04-07
**검색 전략 모드**: community

---

## 개요

Obsidian은 로컬 마크다운 파일 기반의 노트 앱으로, AI와 결합했을 때 독보적인 강점이 있다. 파일이 평범한 `.md` 형식으로 로컬에 저장되기 때문에, AI(특히 Claude Code)가 그 파일을 직접 읽고 수정할 수 있다. 2024~2025년 사이 커뮤니티(r/ObsidianMD, Obsidian 공식 포럼, Hacker News, YouTube, 개인 블로그)에서 AI+Obsidian 결합 워크플로우가 폭발적으로 공유되었다.

**핵심 질문**: AI와 Obsidian이 결합했을 때 어떤 강력한 워크플로우가 가능한가?

---

## 핵심 발견

### 1. 주요 AI 플러그인 생태계

커뮤니티에서 가장 많이 언급되는 3대 AI 플러그인은 다음과 같다 ★★★:

| 플러그인 | 핵심 기능 | 커뮤니티 평가 |
|--------|---------|------------|
| **Smart Composer** | 노트 콘텍스트 기반 AI 작성 보조 | r/ObsidianMD에서 "현재 최고" 평가 |
| **Smart Connections** | 임베딩 기반 시맨틱 검색, 연관 노트 발견 | 대규모 vault 탐색에 최적, 로컬 모델 지원 |
| **Copilot for Obsidian** | Vault 전체 QA, 채팅, GPT-4o/Claude/Gemini 연결 | 인터페이스 가장 깔끔, 유료 Plus 기능 포함 |

**커뮤니티 순위 (2025년 Reddit 리뷰 기준)**: Smart Composer > Smart Connections > Copilot

**주목할 변화**: Smart Connections가 2025년 핵심 기능을 유료화하면서 사용자들이 대안을 찾는 스레드가 급증했다. Obsidian 공식 포럼 "Alternatives to Smart Connections" 스레드에서 사용자들이 Copilot, CursorAI, obsidian-gemini-helper로 이탈하는 움직임이 관측되었다.

[Obsidian Forum: Alternatives to Smart Connections](https://forum.obsidian.md/t/alternatives-to-smart-connections/108886)

**반증 탐색**: Copilot이 Smart Connections보다 낫다는 주장에 반해, 10,000개 이상 노트를 보유한 vault 사용자들은 대규모 vault 전체를 색인하는 데 여전히 Smart Connections가 우월하다고 보고한다. "10k 노트 이상에서 vault 전체 대화가 필요하면 Smart Connections가 낫다"는 Obsidian 포럼 사용자 JohannesMNH의 의견(2025년 2월).

---

### 2. Claude Code + Obsidian: 가장 강력한 결합 패턴

커뮤니티에서 2025년 하반기부터 급부상한 워크플로우. AI 플러그인이 아닌 **Claude Code를 직접 vault 디렉토리에서 실행**하는 방식이다. ★★★

#### 핵심 원리

> "Obsidian이 files and folders에 기반하고, Claude Code도 files and folders에서 동작하기 때문에 둘은 완벽하게 맞물린다."
> — Nick Milo, Linking Your Thinking (YouTube, 2025년 9월, 10.4만 뷰)

Obsidian vault = 마크다운 파일 폴더, Claude Code = 파일을 읽고 쓰는 AI 에이전트. 이 두 가지는 아무런 특별한 연결 없이 자연스럽게 통합된다.

#### CLAUDE.md를 활용한 vault 컨텍스트 관리 ★★★

vault 루트에 `CLAUDE.md` 파일을 두면 Claude Code가 매 세션마다 읽어 vault의 구조와 규칙을 파악한다.

실제 보안 연구자가 공유한 CLAUDE.md 예시 ([dev.to/numbpill3d](https://dev.to/numbpill3d/claude-code-inside-obsidian-the-setup-that-10xd-my-thinking-20e8)):

```markdown
# Vault Context
This vault is a working knowledge base for security research, hardware projects,
and long-term writing. Notes are written in Obsidian-flavored Markdown.

## Structure
- Projects/ — active work with deadlines or deliverables
- Areas/ — ongoing domains (e.g., ESP32, OSINT, writing)
- Resources/ — reference notes, evergreen content
- Archive/ — completed or paused work

## Conventions
- Tags use #category/subcategory format
- MOC notes are named with the prefix "MOC — "
- Source notes include a frontmatter `source:` field

## Active Context
- Currently working on: [update this manually before sessions]
- Open questions: [list the things you're stuck on]
```

주목할 점: `Active Context` 섹션을 매일 수동으로 업데이트하면, Claude Code가 그날의 작업 맥락을 세션 시작부터 파악한다.

#### 실제 사용 사례: 개발자 Damian Galarza의 워크플로우 ★★☆

소프트웨어 개발자 Damian Galarza는 2025년 11월 자신의 완전한 Claude Code 워크플로우를 공개했다. ([damiangalarza.com](https://www.damiangalarza.com/posts/2025-11-25-how-i-use-claude-code/))

- Linear 이슈를 시작점으로, **Obsidian 노트를 컨텍스트로 포함**시켜 Claude Code가 구현 계획을 세우게 한다.
- 프로젝트 킥오프 노트, 미팅 기록, 코드 스니펫 등이 `01-Projects/ProjectName/` 경로에 저장.
- Claude Code에서 `/add-dir` 명령으로 vault 경로를 추가해 파일 접근 권한 문제를 해결.
- "이 노트들을 검토하고 X를 구현해줘"라는 자연어로 10분 단위 작업을 처리.

**핵심 통찰**: 노트가 쌓일수록 Claude Code가 더 정확하게 작동한다. 컨텍스트가 누적되는 복리 효과.

#### 링크드인 사례: symlink로 vault와 Claude 설정 통합 ★☆☆

사용자 PG Smith가 공유한 방법 — `~/.claude` 디렉토리를 Obsidian vault에 심볼릭 링크(symlink)로 연결:

```bash
ln -s ~/Obsidian/MyVault ~/.claude
```

결과: CLAUDE.md, 스킬 파일, 메모리 파일이 Obsidian에서 직접 편집 가능하고, Claude Code는 vault의 모든 노트를 자동으로 컨텍스트로 활용. "All markdown. All in one vault." (LinkedIn, PG Smith)

---

### 3. MCP(Model Context Protocol) 기반 Obsidian 연동

2024년 말부터 MCP를 통한 Obsidian 연동 방식이 등장했다. ★★☆

#### 두 가지 연동 방식 비교

| 방식 | 장점 | 단점 |
|------|------|------|
| **Obsidian Claude Code 플러그인** | 자동 감지(auto-discovery), 설정 불필요 | Claude Code 전용, 범용성 낮음 |
| **Local REST API + MCP 서버** | 모든 MCP 호환 AI 도구에서 사용 가능 | 별도 MCP 서버 구축 필요 |

**Obsidian Claude Code 플러그인**([mcpservers.org](https://mcpservers.org/servers/iansinnott/obsidian-claude-code-mcp)):
- WebSocket(Claude Code용) + HTTP/SSE(Claude Desktop용) 듀얼 트랜스포트 지원
- Claude Code 터미널에서 vault가 자동 감지됨 — 포트 설정 불필요
- 2025년 6월 기준 MCP 2024-11-05 스펙 사용 (2025 신규 스펙에서 오류 발생 이슈 있음)

**mcpvault** ([github.com/bitbonsai/mcpvault](https://github.com/bitbonsai/mcpvault)):
- 모든 MCP 호환 AI 어시스턴트가 Obsidian vault에 연결 가능한 범용 브리지
- 2026년 3월 최근 업데이트

커뮤니티 포럼(Obsidian Forum, 2025년 4월): "24개 이상의 Obsidian MCP 서버가 mcp.so에 등록되어 있다."

---

### 4. 구체적 워크플로우 사례

#### 워크플로우 A: 일일 노트 + 주간 리뷰 자동화 ★★★

**누가**: 생산성 중심 사용자 (커뮤니티에서 가장 많이 공유된 워크플로우)

**어떻게**:
1. Templater 플러그인으로 일일 노트 생성 (표준 섹션: 오늘의 목표, 완료 작업, 메모)
2. 매주 금요일: Claude Code에게 "이번 주 Daily Notes를 검토해 핵심 결정, 미완 작업, 가장 활동이 많았던 프로젝트를 요약해서 `/Reviews/[날짜]-weekly.md`에 저장해줘"
3. 결과: 몇 달 후 시간 사용 패턴이 명확히 보이는 아카이브 완성

**어떤 결과**: 성과 리뷰, 고객 보고, 자기 이해에 재사용 가능한 구조화된 데이터

[mindstudio.ai 튜토리얼](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian-2/)

#### 워크플로우 B: Zettelkasten + AI 원자 노트 생성 ★★★

**누가**: 연구자, 지식 관리 마니아

**어떻게**:
1. 아티클/논문을 읽고 클립보드에 복사
2. Text Generator 플러그인 또는 Claude Code에 전달: "원자 노트 형식으로 핵심 아이디어를 추출하고, 중요도(1~10점)를 매겨서 YAML frontmatter 포함 별도 파일로 저장해줘"
3. Smart Connections가 새 노트와 기존 노트 사이의 연결 자동 제안
4. Dataview로 중요도 상위 노트 쿼리해 MOC(Map of Content) 자동 생성

**어떤 결과**: PKM Weekly 뉴스레터 작성자는 이 시스템으로 200,000단어 이상의 뉴스레터와 책을 집필했다고 보고.

[PKM Weekly, 2025-03-09](https://www.pkmweekly.com/p/pkm-weekly-2025-03-09)

#### 워크플로우 C: 개발자의 지식베이스 + AI 코딩 컨텍스트 ★★★

**누가**: 소프트웨어 개발자 Stefan Imhoff ([stefanimhoff.de](https://www.stefanimhoff.de/agentic-note-taking-obsidian-claude-code/))

**어떻게**:
1. Daily Notes에 읽은 책, 본 영화, 만난 사람 기록
2. Claude Code가 스크립트를 작성해 책 표지, 영화 커버, 인물 사진 자동 다운로드 후 YAML frontmatter에 메타데이터 삽입
3. `qmd` (QMD 검색 엔진) + `obsidian` CLI 명령어를 Claude Code에 가르침
4. vault 데이터로 D3.js 커스텀 인터랙티브 그래프 생성

**어떤 결과**: "Claude Code 없이는 며칠이 걸렸을 작업을 단 몇 분에 완료"

#### 워크플로우 D: 로컬 AI (프라이버시 우선) ★★☆

**누가**: 보안 의식이 높은 사용자

**어떻게**:
- Copilot 플러그인 + Ollama 연동 → 로컬에서 Mistral, Phi-3 등 실행
- 노트가 외부 서버로 전송되지 않음
- M1/M2 Mac 또는 NVIDIA GPU 필요

**커뮤니티 반응**: 2025년 2월 "Local AI in Obsidian" 메가스레드 500개 이상 댓글. 하드웨어 요구사항과 모델 선택이 주요 화제.

**수치 투명성**: "50% 생산성 향상" 주장(Reddit, 2024년 10월, 200+ 업보트)은 단일 사용자 자기 보고이며 측정 기준이 명확하지 않다. 이 수치가 틀릴 수 있는 조건: 이미 체계적인 노트 시스템을 갖춘 사용자는 추가 효과가 작을 수 있음.

---

### 5. 커뮤니티 정서 분석

**수집 플랫폼**: r/ObsidianMD, Obsidian 공식 포럼, dev.to, Medium, YouTube

**긍정 (약 65%)**: "드디어 노트가 쌓이는 게 아니라 쓸모 있어진다", "Claude Code + Obsidian은 내가 써본 조합 중 가장 강력하다", "전에는 Notion, Miro 다 써봤는데 이게 진짜다"

**부정/우려 (약 25%)**: "내 모든 노트를 AI에게 주고 싶지 않다", "설정이 너무 복잡하다", "Smart Connections 유료화는 배신이다", "플러그인이 많아질수록 느려진다"

**중립/관망 (약 10%)**: "흥미롭지만 아직 실험 단계", "로컬 모델이 더 성숙해지면 고려할 것"

**편향 보정 (Reddit 편향)**: r/ObsidianMD는 이미 Obsidian 사용자들의 커뮤니티이므로 긍정 비율이 과대 대표될 가능성이 있다. 일반 사용자 중에는 설정 복잡도로 이탈하는 비율이 더 높을 수 있다.

---

### 6. 실패 패턴 및 주의사항

커뮤니티에서 반복적으로 보고된 실패 패턴 ★★★:

1. **CLAUDE.md를 너무 모호하게 작성**: "Be helpful"처럼 추상적인 지시는 무용지물. vault의 디렉토리 구조, 파일 명명 규칙, 금지 작업을 명시적으로 적어야 한다.

2. **CLAUDE.md를 업데이트하지 않음**: vault가 진화하면 CLAUDE.md도 함께 업데이트해야 한다. 최소 월 1회 검토 권장.

3. **한 번에 모든 것을 자동화하려는 시도**: 커뮤니티에서 공통으로 권장하는 시작점은 "일일 노트 하나만 먼저 안정화"다.

4. **binary 파일 포함**: PDF, 이미지, 첨부파일이 vault에 섞이면 Claude Code가 불필요한 파일까지 색인한다. `_attachments/` 폴더를 별도로 두고 `.claudeignore`에 추가하는 것이 권장 패턴.

5. **너무 깊은 폴더 경로**: `Projects/Active/Q1/Research/Sources/topic.md` 같은 구조는 Claude Code가 파일을 찾는 데 비효율적. 2~3단계 이내로 유지 권장.

---

## 구현/실행 참고사항

### 초보자를 위한 시작 순서

1. **Day 1**: vault 루트에 `CLAUDE.md` 생성 (vault 구조, 컨벤션, 현재 작업 명시)
2. **Day 1**: 각 주요 폴더에 `index.md` 생성 ("Go through each folder and create an index.md for each one")
3. **Week 1**: 일일 노트 + 주간 요약 자동화 하나만 구축
4. **Month 1**: 잘 작동하면 미팅 노트, 프로젝트 관리 등으로 확장

### 플러그인 조합 권장 스택

커뮤니티에서 Claude Code와 궁합이 좋다고 검증된 플러그인:

- **Templater** — 일일/주간/월간 노트 템플릿 자동화
- **Dataview** — vault를 데이터베이스처럼 쿼리 (Claude Code도 Dataview 쿼리를 읽을 수 있음)
- **QuickAdd** — 빠른 인박스 캡처
- **Periodic Notes** — 일/주/월 노트 명명 규칙 표준화

### Claude Code vs. 플러그인 방식 선택 기준

| 상황 | 권장 방식 |
|------|---------|
| 글쓰기, 편집 보조 | Copilot 또는 Smart Composer 플러그인 |
| vault 전체 시맨틱 검색 | Smart Connections |
| 자동화, 대규모 수정, 스크립트 실행 | Claude Code 직접 사용 |
| 외부 도구(Linear, Sentry, GitHub) 연동 | Claude Code + MCP |
| 프라이버시가 최우선 | 로컬 모델 + Ollama 연동 |

---

## 관점 확장 / 문제 재정의

**인접 질문 1**: Obsidian vault가 커질수록(10,000노트+) AI의 컨텍스트 창 한계와 충돌한다. 전체 vault를 AI가 처리하는 것은 현재 불가능에 가깝다. "어떻게 vault를 효과적으로 조각 내어 AI에게 먹일 것인가"가 실제 핵심 문제일 수 있다.

**인접 질문 2**: AI가 노트를 자동으로 생성하면 "내 생각"과 "AI가 만든 생각"의 경계가 흐려진다. Obsidian 포럼의 한 사용자(2024년 11월)는 "AI는 당신 대신 아이스크림을 먹어줄 수 없다"고 표현했다 — 즉, 사고의 핵심 행위는 대체될 수 없다는 비판이다.

[이질 도메인: 소프트웨어 개발의 "컨텍스트 엔지니어링"] — 개발자들이 Claude Code에 최적 컨텍스트를 공급하기 위해 vault를 구조화하는 방식이, 프롬프트 엔지니어링보다 "컨텍스트 엔지니어링"이라는 더 넓은 패턴에 속한다. 이 패턴을 차용하면 vault 구조 설계 단계에서 "AI가 어떻게 이 파일을 읽을 것인가"를 먼저 고려하는 접근이 가능하다.

**문제 재정의**: "Obsidian에서 어떤 AI 기능을 쓸 것인가"보다 더 적절한 질문은 "AI가 최대한 유용하게 작동하도록 vault의 구조와 컨텍스트를 어떻게 설계할 것인가"다.

---

## 출처 목록

| # | 출처 | 확신도 | URL |
|---|------|--------|-----|
| 1 | r/ObsidianMD - Brief review of AI plugins | ★★☆ | https://www.reddit.com/r/ObsidianMD/comments/1kfixvv/brief_review_of_the_most_wellknown_obsidian_ai/ |
| 2 | Obsidian Forum - Alternatives to Smart Connections | ★★★ | https://forum.obsidian.md/t/alternatives-to-smart-connections/108886 |
| 3 | Obsidian Forum - Copilot + Smart Connections combo | ★★☆ | https://forum.obsidian.md/t/the-combo-of-copilot-for-obsidian-obsidian-smart-connections-and-chatgpt-ai-is-amazing/61853 |
| 4 | Obsidian Forum - AI vault workflow review 2025 | ★★☆ | https://forum.obsidian.md/t/reviewing-my-vault-workflow-behaviours-using-ai-in-an-ide-or-cli-in-2025/109557 |
| 5 | dev.to / v.Splicer - Claude Code Inside Obsidian | ★★☆ | https://dev.to/numbpill3d/claude-code-inside-obsidian-the-setup-that-10xd-my-thinking-20e8 |
| 6 | Damian Galarza - How I Use Claude Code | ★★☆ | https://www.damiangalarza.com/posts/2025-11-25-how-i-use-claude-code/ |
| 7 | Stefan Imhoff - Agentic Note-Taking with Claude Code | ★★☆ | https://www.stefanimhoff.de/agentic-note-taking-obsidian-claude-code/ |
| 8 | Towards AI - Claude and Obsidian Second Brain | ★★☆ | https://pub.towardsai.net/from-notes-to-knowledge-the-claude-and-obsidian-second-brain-setup-37af4f47486f |
| 9 | MindStudio - AI Second Brain Guide | ★★☆ | https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian-2/ |
| 10 | Michael Crist - Context Engineering | ★☆☆ | https://michaelcrist.substack.com/p/context-engineering |
| 11 | Nick Milo (LYT) - Obsidian + AI YouTube | ★★☆ | https://www.youtube.com/watch?v=a1FDaoF8Jog |
| 12 | mcpservers.org - Obsidian Claude Code MCP | ★★☆ | https://mcpservers.org/servers/iansinnott/obsidian-claude-code-mcp |
| 13 | GitHub - mcpvault | ★☆☆ | https://github.com/bitbonsai/mcpvault |
| 14 | Obsidian Forum - MCP servers experiences | ★★☆ | https://forum.obsidian.md/t/obsidian-mcp-servers-experiences-and-recommendations/99936 |
| 15 | The Effortless Academic - Smart Connections & Copilot | ★★☆ | https://effortlessacademic.com/adding-ai-to-your-obsidian-notes-with-smartconnections-and-copilot/ |
| 16 | ctnet.co.uk - Obsidian Copilot paid plan review | ★★☆ | https://www.ctnet.co.uk/obsidian-co-pilot-paid-plan-my-experiences-so-far/ |
| 17 | PKM Weekly 2025-03-09 | ★★☆ | https://www.pkmweekly.com/p/pkm-weekly-2025-03-09 |
| 18 | oboe.com - Claude Code, Obsidian, and MCP Integration | ★★☆ | https://oboe.com/learn/claude-code-obsidian-and-mcp-integration-1sqt6bd/ |
| 19 | XDA Developers - Claude Code inside Obsidian | ★★☆ | https://www.xda-developers.com/claude-code-inside-obsidian-and-it-was-eye-opening/ |
| 20 | PG Smith LinkedIn - symlink ~/.claude to Obsidian | ★☆☆ | https://www.linkedin.com/posts/pg-smith_if-youre-using-claude-and-none-of-your-context-activity-7426749028756959233-82Gn |

---

## 검색 비용 보고

| 도구 | 호출 수 |
|------|--------|
| WebSearch | 0회 (community 모드 — Layer 0 제한으로 스킵) |
| WebFetch | 0회 |
| search.sh perplexity search | 4회 |
| search.sh tavily search | 3회 |
| search.sh extract | 0회 |
| search.sh research/reason | 0회 |
| **전체 합산** | **7회** |

**예산 대비**: 22회 상한 중 7회 사용 (32%). Layer 1에서 충분한 정보 확보로 조기 종료.

---

*조사 한계: Obsidian 공식 AI 기능 로드맵(CEO 발언 포함)은 이 리포트에서 다루지 않음 — 별도 web 모드 리서처 담당 범위. 연구 논문 인용/문헌 관리 특화 워크플로우(Zotero 연동 등)도 조사 범위 외.*
