# Obsidian 핵심 기능 및 아키텍처 소개

**Researcher 산출물** | 2026-04-07
**검색 전략 모드**: web

---

## 개요

Obsidian은 2020년 Shida Li와 Erica Xu(University of Waterloo 출신)가 코로나 팬데믹 격리 기간 중 개발한 **로컬 마크다운 기반 지식관리 도구**다. MediaWiki, TiddlyWiki 등 기존 도구의 한계를 극복하겠다는 철학에서 출발했으며, 2022년 10월 v1.0 정식 출시, 2023년 2월 Steph Ango가 CEO로 합류하며 조직화되었다.

핵심 철학은 세 가지다:

1. **당신의 데이터는 당신 것** — 모든 노트는 로컬 마크다운 파일로 저장. 클라우드 종속 없음
2. **링크가 지식을 만든다** — 개별 노트가 아니라 노트 간 관계망이 지식베이스의 본질
3. **플러그인으로 무한 확장** — 도구를 워크플로우에 맞추는 것이지, 워크플로우를 도구에 맞추지 않음

**현재 규모** (2023년 기준, 이후 성장 중): 약 100만 명 사용자, Discord 커뮤니티 11만 명 이상, 커뮤니티 플러그인 2,700개 이상 ★★☆

---

## 핵심 발견

### 1. 로컬 파일 기반 구조 (Vault)

**[Fact]** Vault는 특정 폴더를 통째로 Obsidian의 작업공간으로 지정한 것이다. 실체는 단순한 폴더 + 숨김 폴더 `.obsidian`(설정 파일)이다. 별도의 독점 데이터베이스가 없다. ★★★

```
~/my-vault/
  ├── .obsidian/          ← 설정, 플러그인, 테마 (숨김)
  ├── projects/
  │   └── note-a.md
  ├── journal/
  │   └── 2026-04-07.md
  └── note-b.md
```

- 앱이 `.md` 파일을 직접 읽고 쓰며, 외부 편집기(VS Code 등)로 같은 파일을 수정해도 Obsidian이 즉시 반영한다
- Dropbox, iCloud, Syncthing 등 어떤 동기화 방식도 사용 가능 (벤더 종속 없음)
- 파일을 삭제해도 데이터는 표준 마크다운으로 남아 다른 도구에서 그대로 열 수 있음

**반증 탐색**: 일부 사용자는 대용량 vault(수만 개 파일)에서 인덱싱 초기 속도 저하를 보고함. 그러나 이는 설계 결함이 아닌 규모에 따른 트레이드오프다. 반증 미발견 (철학 자체를 부정하는 자료 없음).

---

### 2. 마크다운 에디터 — Live Preview와 Source Mode

**[Fact]** Obsidian은 두 가지 편집 모드를 제공한다. ★★★

| 모드 | 특징 |
|------|------|
| **Live Preview** | 마크다운 문법을 타이핑하면 즉시 렌더링. WYSIWYG에 가까운 경험 |
| **Source Mode** | 순수 마크다운 텍스트 표시. 파워 유저 및 복잡한 편집에 적합 |
| **Reading View** | 완전 렌더링된 읽기 전용 뷰 |

표준 마크다운 + Obsidian 확장 문법을 지원한다:
- `[[노트명]]` — 내부 링크 (wikilink)
- `[[노트명|표시텍스트]]` — 별칭 링크
- `![[노트명]]` — 다른 노트/이미지 임베드
- `> [!NOTE]` — 콜아웃(callout) 블록

2026년 2월 업데이트(v1.12.0)에서 Live Preview 내 **이미지 크기 조정**(모서리 드래그)이 추가되었다.

---

### 3. 백링크(Backlink)와 그래프 뷰 — Obsidian의 핵심 차별점

**[Fact]** 백링크는 "이 노트를 링크하는 다른 노트 목록"을 자동으로 역추적한다. 사용자가 명시적으로 연결하지 않아도 시스템이 자동으로 관계를 발견한다. ★★★

백링크 작동 방식:
1. 노트 A에서 `[[노트B]]`를 작성하면
2. 노트 B의 백링크 패널에 자동으로 "노트 A"가 등록된다
3. "잠재적 링크(Unlinked mentions)"도 감지 — 명시적 링크 없이 텍스트에 언급된 경우도 표시

**그래프 뷰**는 vault 전체의 노트 연결 관계를 인터랙티브한 2D 그래프로 시각화한다:
- 노드 = 노트, 엣지 = 링크
- 색상, 크기, 필터링 옵션으로 커스터마이즈 가능
- 로컬 그래프(현재 노트 중심) vs. 전체 그래프 전환 가능
- Canvas 파일의 링크도 그래프에 포함됨 (최근 업데이트)

**수치 투명성**: 그래프 뷰의 실시간 렌더링 성능은 노트 수에 비례해 저하된다. 수만 개 노트에서는 필터링 없이 전체 그래프를 열면 느려질 수 있다. 출처: 커뮤니티 포럼 보고 [인접 도메인: 네트워크 시각화 - 대규모 그래프 렌더링 문제는 D3.js 기반 시각화 라이브러리의 일반적 한계와 동일한 현상].

---

### 4. 플러그인 시스템 — 생태계의 힘

**[Fact]** Obsidian의 확장성은 두 레이어로 구성된다. ★★★

**코어 플러그인** (공식 기본 제공, 22개+):
- Backlinks, Graph view, Search, Tag pane, Daily notes
- Templates, Outline, Canvas, Bases (2025년 추가)
- File recovery, Sync (유료), Publish (유료)

**커뮤니티 플러그인** (서드파티 개발, 2,700개+):
- 설정 > Community plugins에서 직접 검색·설치
- JavaScript/TypeScript + Obsidian Plugin API로 개발
- 주요 인기 플러그인:

| 플러그인 | 기능 | 다운로드 |
|---------|------|---------|
| **Dataview** | 노트를 데이터베이스처럼 쿼리 (SQL 유사) | ~300만 이상 ★☆☆ |
| **Templater** | 고급 템플릿 (JavaScript 실행 가능) | 상위권 |
| **Calendar** | 일간 노트 달력 뷰 | 상위권 |
| **Excalidraw** | 손그림 스타일 화이트보드 통합 | 상위권 |
| **Periodic Notes** | 일간/주간/월간/연간 노트 자동화 | 상위권 |

**[Claim]** 플러그인 생태계 규모(2,700+)는 동급 도구 중 독보적이라는 것이 커뮤니티 내 공통 인식이다.

---

### 5. Canvas — 인피니트 화이트보드

**[Fact]** Canvas는 2022년 말 코어 플러그인으로 출시된 무한 2D 공간 기능이다. ★★★

주요 특징:
- 노트, 이미지, PDF, 웹페이지, 동영상을 자유롭게 배치·연결
- 카드(Card), 그룹(Group), 화살표 연결선 지원
- `.canvas` 파일 포맷은 **오픈소스**로 공개됨 (JSON 기반)
- Canvas 파일도 vault 내 마크다운 파일처럼 취급 → 백링크/그래프에 포함

활용 사례:
- 프로젝트 로드맵 시각화
- 연구 주제 마인드맵
- 독서 노트 연결 다이어그램
- 프레젠테이션 대안 (슬라이드 없이 공간적 스토리텔링)

---

### 6. Bases — 공식 데이터베이스 뷰 (2025년 신기능)

**[Fact]** Obsidian 1.9.10에서 코어 플러그인으로 추가된 Bases는 마크다운 파일의 프론트매터(YAML)를 기반으로 데이터베이스형 뷰를 생성한다. ★★☆

Dataview 커뮤니티 플러그인의 공식 대안으로, 차이점은:

| 구분 | Dataview | Bases |
|------|---------|-------|
| 설치 | 커뮤니티 플러그인 | 코어 (설치 불필요) |
| 인터페이스 | 코드 블록 쿼리 (DQL) | GUI 기반 |
| 속도 | 상대적으로 느림 | 빠름 (네이티브 구현) |
| 유연성 | 매우 높음 (프로그래밍적) | 중간 (GUI 범위 내) |

지원 뷰: 테이블 뷰, 갤러리 뷰, 지도 뷰

**반증**: 복잡한 쿼리가 필요한 파워 유저는 여전히 Dataview를 선호한다. Bases가 Dataview를 완전히 대체하지는 못한다는 커뮤니티 평가가 있다.

---

### 7. 태그, 폴더, 링크 기반 조직화 시스템

**[Fact]** Obsidian은 세 가지 조직화 방식을 자유롭게 조합할 수 있다. ★★★

- **폴더 구조**: 전통적인 파일 시스템 계층. 직관적이지만 경직됨
- **태그**: `#태그명`으로 다차원 분류. 중첩 태그(`#영역/세부`)도 지원
- **링크 네트워크**: `[[]]`로 자유로운 관계망 생성. 폴더 구조를 초월

많은 사용자들이 세 가지를 혼합한 자신만의 시스템(예: PARA, Zettelkasten, MOC)을 구축한다. 특정 방식을 강제하지 않는 것이 Obsidian의 철학이다.

---

### 8. 최신 업데이트 동향 (2025-2026)

**[Fact]** 공식 changelog 기반. ★★★

**2026년 2월 — CLI 출시 (v1.12.0)**:
- 명령줄 인터페이스 추가 → 스크립팅, 자동화, 외부 도구 통합 가능
- Obsidian을 headless 방식으로 조작하는 새로운 가능성 열림

**2026년 2월 — 모바일 개선 (v1.11.7)**:
- 전체화면, 부동 네비게이션, 슬라이딩 사이드바 모드 추가
- iOS: 공유 확장으로 Safari 등에서 콘텐츠 직접 저장

**2026년 3월 — 에디터 안정화 (v1.12.6-7)**:
- CLI 관련 성능 개선 및 에디터 버그 수정

**[Claim, 단일 출처]** 2026년 예정된 기능으로 "Neuron"(로컬 AI 툴킷)과 실시간 협업 기능이 언급된다. 공식 확인 필요. ★☆☆

---

## 아키텍처적 특징 — AI 시대와의 연결

Obsidian의 기술 아키텍처를 도식화하면 다음과 같다:

```
[데스크톱]                [모바일]
Electron (웹 기술)         Capacitor (WebView)
    |                          |
    └──────────┬───────────────┘
               |
        Obsidian 코어 (JS/HTML/CSS)
               |
    ┌──────────┼──────────────┐
    |          |              |
  App          Vault       MetadataCache
(글로벌 싱글톤) (파일 I/O)   (백링크/태그 인덱스)
    |
 Workspace    FileManager
(UI 레이아웃)  (스마트 파일 조작)
               |
    ──────────────────────
    로컬 파일 시스템 (.md 파일들)
```

**핵심 설계 결정과 그 의미**:

1. **Electron 기반 (데스크톱)**: 웹 기술(JS/HTML/CSS)로 크로스플랫폼 구현. 플러그인을 동일한 JS로 개발 가능
2. **Capacitor 기반 (모바일)**: 동일한 코어 로직을 iOS/Android에서 실행. 데스크톱과 기능 패리티 유지
3. **메타데이터 캐시 분리**: 파일 내용은 디스크에, 관계 정보는 메모리 캐시에. 파일을 삭제해도 데이터는 안전
4. **이벤트 기반 플러그인 API**: 앱 상태 변화를 이벤트로 구독. 플러그인이 핵심 기능과 같은 수준으로 접근 가능

**AI 통합 관점에서의 의미** (본 리서치 범위 외이나 구조적 연결점으로 언급):
- 로컬 파일 = LLM의 RAG 소스로 직접 활용 가능
- 플러그인 API = AI 도구를 Obsidian에 네이티브 통합하는 진입점
- 벤더 락인 없음 = 어떤 AI 제공자든 연결 가능

---

## 구현/실행 참고사항

### Obsidian 도입 시 의사결정 가이드

| 상황 | 권장 접근 |
|------|---------|
| 개인 지식관리 시작 | 폴더 + 태그 + 링크 혼합, Dataview 나중에 추가 |
| 프로젝트 관리 도입 | Bases(코어) 먼저, 복잡해지면 Dataview |
| 시각적 사고 선호 | Canvas + Graph View 조합 |
| AI 워크플로우 통합 | 플러그인 API 기반 커스텀 통합 또는 커뮤니티 플러그인 |
| 팀 협업 필요 | Obsidian Sync(유료) + 공식 협업 기능(2026 예정) |

### 핵심 단축키 (생산성 기반)

- `[[` — 링크 생성 시작
- `Ctrl/Cmd + P` — 커맨드 팔레트 (기능 검색)
- `Ctrl/Cmd + Shift + G` — 그래프 뷰 열기
- `Alt + Enter` — 링크된 노트 새 창에서 열기

---

## 관점 확장 / 문제 재정의

### 인접 질문 1: "Obsidian vs. Notion, 어떤 도구가 AI 시대에 더 유리한가?"

본 조사에서 확인된 구조적 차이가 AI 통합 방식에 직접 영향을 미친다. Obsidian의 로컬 파일 구조는 LLM 컨텍스트 주입에 유리하나, Notion의 클라우드 API는 실시간 동기화에 유리하다. 이 선택이 AI 에이전트 아키텍처 설계에 중요한 변수다.

### 인접 질문 2: "2,700개 플러그인 중 어떤 것이 AI 시대에 실제 가치를 창출하는가?"

플러그인 수 자체보다 "어떤 플러그인이 AI 워크플로우와 시너지를 내는가"가 더 중요한 질문이다. Smart Connections, Text Generator 등 AI 플러그인의 품질과 한계에 대한 별도 조사가 필요하다.

[이질 도메인: 유닉스 철학] "하나의 일을 잘 하라(Do one thing well)"는 원칙이 Obsidian 플러그인 아키텍처에 그대로 적용된다. 각 플러그인이 단일 기능에 집중하고, 조합을 통해 복잡한 시스템을 구성하는 패턴을 차용할 수 있다.

### 문제 재정의

원래 질문 "Obsidian의 주요 기능과 아키텍처가 AI 시대에 왜 중요한 기반이 되는가"는, 조사 후 더 날카롭게 재정의하면:

> **"마크다운 + 로컬 파일이라는 단순한 제약이 오히려 AI 에이전트와의 통합에서 왜 최적의 인터페이스가 되는가?"**

텍스트 파일 = LLM의 자연어, 링크 구조 = 지식 그래프, 플러그인 API = 에이전트 액션 공간 — 이 세 요소의 조합이 Obsidian을 AI 시대 PKM의 기반으로 만드는 핵심 메커니즘이다.

---

## 출처 목록

| # | 출처 | 확신도 | URL |
|---|------|--------|-----|
| 1 | Obsidian 공식 Changelog | ★★★ | https://obsidian.md/changelog/ |
| 2 | Obsidian API — App Architecture (Mintlify) | ★★★ | https://www.mintlify.com/obsidianmd/obsidian-api/concepts/app-architecture |
| 3 | Obsidian Help — Graph View | ★★★ | https://help.obsidian.md/plugins/graph |
| 4 | Obsidian Help — Canvas | ★★★ | https://help.obsidian.md/plugins/canvas |
| 5 | Wikipedia — Obsidian (software) | ★★☆ | https://en.wikipedia.org/wiki/Obsidian_(software) |
| 6 | SitePoint — Obsidian Beginner Guide | ★★☆ | https://www.sitepoint.com/obsidian-beginner-guide/ |
| 7 | eesel AI — Complete Obsidian Overview 2025 | ★★☆ | https://www.eesel.ai/blog/obsidian-overview |
| 8 | Obsidian Rocks — Dataview vs Bases | ★★☆ | https://obsidian.rocks/dataview-vs-datacore-vs-obsidian-bases/ |
| 9 | practicalpkm — 2025 Obsidian Report Card | ★★☆ | https://practicalpkm.com/2025-obsidian-report-card/ |
| 10 | DeepWiki — Internal Links and Graph View | ★★☆ | https://deepwiki.com/obsidianmd/obsidian-help/4.2-internal-links-and-graph-view |
| 11 | Lindy — Obsidian Review 2026 | ★☆☆ | https://www.lindy.ai/blog/obsidian-review |
| 12 | NxCode — Obsidian AI Second Brain 2026 | ★☆☆ | https://www.nxcode.io/resources/news/obsidian-ai-second-brain-complete-guide-2026 |

---

## 검색 비용 보고

| 도구 | 호출 수 |
|------|--------|
| WebSearch | 4회 |
| WebFetch | 4회 (리다이렉트 포함) |
| search.sh (Layer 1) | 0회 |
| search.sh extract (Layer 2) | 0회 |
| search.sh research/reason (Layer 3) | 0회 |
| **합계** | **8회** |

Layer 0 검색만으로 충분한 정보를 확보하여 Layer 1 이상 사용 없이 조사를 완료했다.
