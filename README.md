# Deep & Wide Research with Claude Code

Claude Code의 멀티 에이전트 오케스트레이션 위에 구축된 **고급 조사 및 개발 자동화 프레임워크**.

하나의 질문을 던지면 여러 Researcher가 병렬로 조사하고, Critic이 검증하고, Journal이 기록하며, 최종 Synthesis와 HTML 프레젠테이션을 자동 생성한다. MoAI-ADK v14.0.0과 Agency v3.2를 기반으로 20+ 특화 에이전트와 40+ 스킬로 구성된 엔터프라이즈급 시스템.

---

## 왜 만들었나

일반적인 AI 리서치는 단일 프롬프트 → 단일 응답 구조다. 이 방식은 관점이 편향되기 쉽고, 검증이 없으며, 결과가 휘발된다.

이 프로젝트는 다르게 접근한다:

- **다관점 조사**: 같은 주제를 여러 Researcher가 서로 다른 관점(학술, 웹, 커뮤니티)에서 동시 조사
- **체계적 비평**: Critic이 논리적 허점, 상충점, 과도한 확신, 누락 관점을 6단계로 검증
- **사실 검증**: Verifier가 주요 주장을 원문 대조로 검증하고 근거 수준을 구분
- **축적과 재활용**: 모든 산출물이 구조화된 마크다운 파일로 저장되어 지식이 쌓임
- **프레젠테이션 자동화**: 리서치 결과를 바로 HTML 프레젠테이션(19개 슬라이드 타입)으로 변환
- **개발 워크플로우**: MoAI-ADK를 통해 SPEC → DDD → Docs 자동화

---

## 시스템 구조

```
deep-wide-research-with-claudecode/
├── CLAUDE.md                          # MoAI 에이전트 오케스트레이션 정책 (핵심)
├── README.md                          # 이 파일
│
├── .claude/
│   ├── agents/                        # 20+ 특화 에이전트
│   │   ├── researcher.md              # 조사자 (학술/웹/커뮤니티 모드)
│   │   ├── critic.md                  # 비평가 (6단계 검증)
│   │   ├── journal.md                 # 저널리스트 (세션 기록)
│   │   ├── verifier.md                # 검증자 (사실 확인)
│   │   ├── security-auditor.md        # 보안 감사자
│   │   ├── moai/                      # MoAI 체계화 에이전트 (19개)
│   │   │   ├── manager-spec.md        # SPEC 작성
│   │   │   ├── manager-ddd.md         # DDD 구현
│   │   │   ├── manager-docs.md        # 문서화
│   │   │   ├── expert-backend.md      # 백엔드
│   │   │   ├── expert-frontend.md     # 프론트엔드
│   │   │   └── ...                    # 13개 추가
│   │   └── agency/                    # Agency 창의 파이프라인 (6개)
│   │       ├── planner.md             # 기획
│   │       ├── copywriter.md          # 카피라이팅
│   │       ├── designer.md            # 디자인
│   │       ├── builder.md             # 빌드
│   │       ├── evaluator.md           # 평가
│   │       └── learner.md             # 학습
│   │
│   ├── skills/                        # 40+ 도메인/언어/워크플로우 스킬
│   │   ├── deep-research/             # 리서치 오케스트레이션
│   │   ├── create-presentation/       # HTML 프레젠테이션 (19 슬라이드 타입)
│   │   ├── moai-foundation-core/      # TRUST 5 + SPEC-First + 위임 패턴
│   │   ├── moai-lang-*/               # 16개 언어 (Python, Go, TypeScript 등)
│   │   ├── moai-domain-*/             # 도메인 (백엔드, 프론트엔드, DB, UI/UX)
│   │   ├── moai-workflow-*/           # 워크플로우 (SPEC, DDD, TDD, 문서화)
│   │   ├── agency-*/                  # Agency 특화 (카피, 디자인, 평가)
│   │   ├── academic-research/         # 학술 검색 전략
│   │   ├── web-research/              # 웹 검색 전략
│   │   └── community-analysis/        # 커뮤니티 분석 전략
│   │
│   └── commands/                      # 커스텀 명령어
│
├── .moai/
│   ├── config/                        # MoAI 설정
│   │   └── sections/                  # 사용자, 언어, 품질, 워크플로우
│   ├── specs/                         # SPEC 문서 (SPEC-001, SPEC-002 등)
│   └── state/                         # 체크포인트 및 상태
│
├── .agency/                           # Agency 설정 및 진화 로그
│   ├── config.yaml                    # Agency 파이프라인 설정
│   ├── context/                       # 브랜드, 목표 청중, 설계 토큰
│   ├── learnings/                     # 자동 학습 항목
│   └── fork-manifest.yaml             # MoAI 스킬 포크 추적
│
├── docs/
│   ├── research/                      # 리서치 산출물 (주제별 폴더)
│   │   └── {YYYY-MM-DD}-{topic}/
│   │       ├── 00-synthesis.md        # 종합 보고서 (시작점)
│   │       ├── 01-academic.md         # 학술 Researcher
│   │       ├── 02-web.md              # 웹 Researcher
│   │       ├── 03-community.md        # 커뮤니티 Researcher
│   │       ├── 04-mixed.md            # 통합 분석
│   │       ├── 97-journal.md          # 세션 저널
│   │       ├── 98-critic-review.md    # Critic 검증 리뷰
│   │       └── presentation.html      # 자동 생성 프레젠테이션
│   │
│   └── research-history.md            # 지금까지 실행한 모든 리서치
│
└── scripts/
    ├── search.sh                      # 검색 API 통합 (Perplexity + Tavily)
    └── validate-code.js               # 코드 검증 유틸리티
```

---

## 작동 원리

### 리서치 파이프라인 (Deep Research)

```
사용자 질문
    │
    ▼
┌──────────────────────────┐
│  Researcher x3 (병렬)     │  학술/웹/커뮤니티 다관점 조사
│  + Journal (세션 기록)    │  
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Critic (검증)            │  논리/상충/확신도/누락 검사
│  → Repair 판정            │
└────────┬─────────────────┘
         │
    ┌────┴─────┐
    │           │
  PASS        REPAIR
    │           │
    ▼           ▼
Synthesis   Verifier (사실 검증)
    │           │
    └───┬───────┘
        │
        ▼
 Final Report (00-synthesis.md)
        │
        ▼
 HTML Presentation (자동 생성)
```

### 개발 워크플로우 (MoAI-ADK)

```
/moai:plan (SPEC 작성)          Phase 1: 30K 토큰
        ↓
/moai:run (DDD 구현)             Phase 2: 180K 토큰
        ↓
/moai:sync (문서화 + 커밋)       Phase 3: 40K 토큰
```

### 창의 생산 파이프라인 (Agency v3.2)

```
사용자 요청
    ↓
Planner → 기획서 생성
    ↓
[Copywriter + Designer] → 카피 + 디자인 스펙 (병렬)
    ↓
Builder → 웹 코드 생성
    ↓
Evaluator → 품질 평가 (0.0~1.0)
    ↓
[Pass] → Learner (진화 학습)
[Fail] → Feedback → Builder 재반복 (최대 5회)
```

---

## 에이전트 구조 (3-Tier)

### Tier 1: 핵심 리서치 에이전트
| 역할 | 모델 | 책임 |
|------|------|------|
| **Researcher** | Sonnet | 다관점 조사 (학술/웹/커뮤니티) |
| **Critic** | Opus | 논리/상충/과도한 일반화/누락 점 6단계 검증 |
| **Journal** | Sonnet | 세션 기록, 의사결정 로그, TODO 추적 |
| **Verifier** | Sonnet | 사실 검증, 원문 대조, 근거 수준 구분 |
| **Security Auditor** | Sonnet | 보안 분석, OWASP 검토 |

### Tier 2: MoAI 체계화 에이전트 (19개)
**Manager** (8): spec, ddd, tdd, docs, quality, project, strategy, git  
**Expert** (8): backend, frontend, security, devops, performance, debug, testing, refactoring  
**Builder** (3): agent, skill, plugin

### Tier 3: Agency 창의 파이프라인 (6개)
planner, copywriter, designer, builder, evaluator, learner

---

## 주요 기능

### 다중 검색 도구

외부 검색은 `scripts/search.sh`를 통해 MCP 의존성 없이 수행한다:

| 도구 | 용도 | 비용 |
|------|------|------|
| `perplexity search` | 종합 파악, 개념 정리 | ~$0.01/요청 |
| `tavily search` | 구체적 URL 발견 | 2크레딧 |
| `tavily extract` | 특정 URL 원문 확보 | 1크레딧/URL |
| `tavily research` | 심층 다면적 분석 | 5크레딧 |

### HTML 프레젠테이션 (신규)

기존 PPTX 기반에서 **HTML 단일 파일** 형식으로 진화:
- **19개 슬라이드 타입**: 제목, 콘텐츠, 2단, 이미지, 코드, 차트, 인용, 다음 등
- **16:9 와이드스크린** 기본 설정
- **Pretendard 폰트** 기본 적용
- **키보드 네비게이션**: 화살표 키로 슬라이드 이동
- **브라우저 호환**: 모던 브라우저 모두 지원, 설치 불필요
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 최적화

### 리서치 자동화

**Phase별 자동 처리**:
- Question Expansion: 단순 질문을 5-7개 세부 질문으로 확장
- Multi-Researcher 병렬 조사: 학술, 웹, 커뮤니티 관점 동시 진행
- Critic 검증: 6단계 자동 검증 (도메인 적용성, 수치 근거, 상충점 등)
- Verifier 사실 확인: 높은 확신도 주장을 원문으로 검증
- Journal 메타 분석: 세션 패턴, 의사결정 로그, 비용 추적

---

## 사용법

### 사전 준비

1. Claude Code CLI 설치:
   ```bash
   brew install anthropic/brew/claude
   ```

2. 프로젝트 클론 및 초기화:
   ```bash
   git clone <repo>
   cd deep-wide-research-with-claudecode
   npm install
   ```

3. API 키 설정:
   ```bash
   cp .env.example .env
   # PERPLEXITY_API_KEY, TAVILY_API_KEY 입력
   ```

### 리서치 실행

Claude Code 실행:
```bash
claude
```

질문 예시:
```
/deep-research 양극산화 피막의 내구성 평가 방법론

/deep-research Palantir Ontology의 엔터프라이즈 아키텍처

/deep-research 레이저 미세 가공의 정밀도 향상 기술
```

자동 처리:
1. Question Expansion으로 질문 확장
2. Researcher 3명 + Journal 병렬 발사
3. Critic으로 논리적 검증
4. Verifier로 사실 확인
5. Synthesis 작성 및 HTML 프레젠테이션 생성

### 산출물 확인

리서치 결과는 `docs/research/{YYYY-MM-DD}-{주제}/` 폴더에 저장됨. 항상 `00-synthesis.md`부터 읽기.

### 개발 워크플로우 (MoAI)

기능 개발을 위한 SPEC-First DDD:

```bash
# Phase 1: 요구사항 정의
/moai:plan 사용자 인증 API 구현 요청

# Phase 2: 구현 및 테스트
/moai:run SPEC-001

# Phase 3: 문서화 및 커밋
/moai:sync SPEC-001
```

### 창의 프로젝트 (Agency)

웹사이트, 랜딩 페이지, UI 생성:

```bash
/agency:brief "AI 에이전트 마켓플레이스 랜딩 페이지"

/agency:build              # 자동 생성 + GAN 루프 (최대 5회)

/agency:review             # 품질 평가
```

---

## 핵심 철학

### 속도보다 품질
멀티 에이전트를 쓰는 이유는 빠르게 하기 위해서가 아니라, **다른 관점에서 보고, 검증하고, 통합하기 위해서**다. 느려도 괜찮다. 근거 없는 강한 결론은 안 된다.

### 축적과 재활용
모든 리서치와 개발이 구조화된 파일로 저장된다. 한 번의 프로젝트가 끝이 아니라, 다음 프로젝트의 기반이 된다.

### 검증 내장
Researcher 2명 이상이면 Critic은 필수다. 도메인 적용성, 수치 근거, 상충점, 누락 관점, 확신도를 체계적으로 검증한다.

### 설계 우선
새로운 기능은 바로 실행하지 않는다. 먼저 SPEC으로 요구사항을 명확히 하고, 트레이드오프를 논의한다.

### 비용 인식
검색 API와 LLM 호출에는 비용이 따른다. 얕은 곳에서 깊은 곳으로 진행하며, 충분하면 멈춘다.

---

## 지금까지의 리서치

| 날짜 | 주제 |
|------|------|
| 2026-03-20 | 양극산화 내구성 지수 v3 |
| 2026-03-20 | 레이저 흄/파티클 제어 |
| 2026-03-20 | LLM 멀티에이전트 오케스트레이션 |
| 2026-03-20 | MASON 온톨로지 백서 |
| 2026-03-20 | 온톨로지 에이전트 레시피 제어 |
| 2026-03-20 | 주식 패턴 ML 방법론 |
| 2026-03-21 | AI 재난대응 시스템 (AssiEye) |
| 2026-03-23 | OpenClaw AI 에이전트 |
| 2026-03-23 | Palantir 온톨로지 |
| 2026-03-24 | 레이저 기초 가이드 |
| 2026-03-25 | 글라스/메탈 에칭 기술 |
| 2026-03-25 | 초고속 레이저 응용 |
| 2026-03-30 | 제조업 AI/LLM 전환 |
| 2026-04-01 | 기어 설계 수학 기초 |
| 2026-04-01 | 제조업 디지털 트윈 ROI |
| 2026-04-07 | Obsidian AI 지식관리 |
| 2026-04-08 | Karpathy Wiki-LLM |
| 2026-04-08 | Wiki-LLM 지식 시스템 |
| 2026-04-09 | 양극산화 Al EIS 평가법 |

---

## 기술 스택

- **Python 3.13+**: 메인 로직, 검색 API 통합
- **JavaScript/Node.js**: HTML 프레젠테이션 생성
- **Bash**: 스크립트 자동화
- **Claude Opus/Sonnet**: 멀티 에이전트 모델
- **MCP 서버**: Context7 (공식 문서), Pencil (디자인)
- **외부 API**: Perplexity (검색), Tavily (웹 스크래핑)

---

## MoAI-ADK + Agency 통합

이 프로젝트는 **리서치 자동화만이 아니라, 엔터프라이즈급 소프트웨어 개발**도 지원한다:

- **TRUST 5 품질 게이트**: Tested, Readable, Unified, Secured, Trackable
- **SPEC-First DDD**: 요구사항 → 설계 → 구현 → 테스트 → 문서화
- **Delegation 패턴**: 20+ 특화 에이전트로 일감 자동 분배
- **Token 최적화**: 200K 예산으로 Phase별 맞춤 할당
- **Agency 자동 진화**: 완료된 프로젝트를 학습하여 다음 프로젝트 개선

상세 문서: [CLAUDE.md](CLAUDE.md), `.claude/rules/moai/`

---

## 라이선스

개인 프로젝트. CLAUDE.md 및 에이전트 정책 구조는 자유롭게 참고 가능.
