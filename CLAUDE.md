## Research Output Structure

리서치 결과는 **리서치 주제별 폴더**로 관리한다. 하나의 리서치 세션은 하나의 폴더에 모든 산출물을 보관한다.

### 디렉토리 구조

```
docs/
├── research/
│   └── {date}-{topic}/           # 리서치별 폴더
│       ├── 00-synthesis.md       # 종합 보고서 (여기서 시작)
│       ├── 01-{관점1}.md         # 상세 보고서
│       ├── 02-{관점2}.md         # 상세 보고서
│       ├── ...
│       └── 99-critic-review.md   # 부속 자료
└── dev-journal/
    └── {date}-{project}.md       # 저널 (날짜별 플랫 구조 유지)
```

### 네이밍 컨벤션

- 리서치 폴더: `docs/research/{YYYY-MM-DD}-{topic-slug}/`
- 폴더 내 파일: **숫자 프리픽스 + 관점/역할 기반 이름**
  - `00-`: 종합 보고서(synthesis). `01-`\~`89-`: 상세 보고서. `90-`\~`99-`: 부속 자료.
- 저널: `docs/dev-journal/{YYYY-MM-DD}-{project}.md`

### 서브 에이전트 산출물 규칙

- 서브 에이전트는 **반드시 지정된 리서치 폴더 안에** 결과를 저장한다.
- 메인 에이전트가 리서치 시작 시 폴더를 미리 생성하고, 서브 에이전트 프롬프트에 경로를 명시한다.
- loose 파일을 `docs/research/` 루트에 직접 놓지 않는다.

## Sub-Agent Permissions

서브 에이전트는 리서치 결과를 `docs/` 디렉토리 하위에 자유롭게 저장할 수 있어야 한다.

- `docs/dev-journal/` — 저널 파일 생성/수정 허용
- `docs/research/{date}-{topic}/` — 리서치 보고서 생성/수정 허용
- 서브 에이전트에게 `Write`, `Bash(mkdir)` 권한을 docs/ 하위에 대해 허용한다.

### 검색 도구 접근 방식

- 유료 API 검색: `./scripts/search.sh` 스크립트를 통해 Perplexity/Tavily API를 호출한다.
- 빌트인 검색: `WebSearch`, `WebFetch`를 직접 사용한다 (추가 API 키 불필요).
- API 키는 프로젝트 루트 `.env`에서 자동 로드된다.

---

## Multi-Agent Research Policy

- 기본 원칙: 속도보다 품질을 우선한다.
- **리서치 실행 시** `/deep-research` **스킬을 사용한다.** 스킬이 전체 워크플로우(주제 분석 → 팀 구성 → 병렬 조사 → 검증 → 통합)를 정의한다.
- 메인 에이전트는 오케스트레이터 역할에 집중한다. 중간 레이어(리서치 리드 등)를 두지 않는다.
- 에이전트 정의: `.claude/agents/researcher.md` (범용, 복수 호출 가능), `.claude/agents/critic.md`
- 검색 전략 스킬: `.claude/skills/academic-research/`, `web-research/`, `community-analysis/`

### 에이전트 발사 순서

- **Researcher 복수 발사는 병렬이 기본이다.** 각 Researcher의 조사 범위가 독립적이면 동시 발사한다.
- Journal은 Researcher와 동시에 발사 가능하다 (독립적 기록).
- **Critic은 모든 Researcher 완료 후 발사한다** (선행 산출물 필수).
- Synthesizer는 메인이 직접 수행한다 (컨텍스트 오염 방지).
- 병렬 발사 시 `run_in_background: true`를 사용한다.

### Background 에이전트 모니터링

- **10분 후** 산출물 파일 존재 여부를 확인한다.
- **20분 경과 후** 산출물 파일이 없거나 비어 있으면 스톨로 간주, foreground로 재발사한다.

### 메인 에이전트 직접 처리 예외

- 한 줄 수준의 확인, 사소한 수정, 기존 정보 재구성, 멀티에이전트 분해 실익이 낮은 경우

---

## Journal Policy

- 의미 있는 리서치 세션에서는 저널 전담 에이전트를 반드시 1개 spawn한다.
- 저널 경로: `docs/dev-journal/{date}-{project}.md`
- 저널은 후속 리서치에서 이전 의사결정을 참조하는 **히스토리 메모리** 역할을 한다.

### 저널 최소 기록 항목

- 세션 메타, 사용자 요청 요약, 문제 정의, 핵심 가정
- 의사결정 로그, 이슈/해결, TODO, rejected alternatives

### 저널 생략 가능 예외

- 아주 짧은 확인, 오타 수정, 표현 다듬기, 단순 재포맷팅

---

## Design-First Policy

- 새 기능, 리팩토링, 구조 변경, 방법론 변경은 즉시 구현하지 않는다.
- 먼저 설계 논의를 수행하고, 합의된 전략을 저널에 기록한 뒤 실행한다.

---

## Requirement Validation Policy

- 사용자의 초기 요청을 그대로 실행하지 말고, 최선의 문제 정의인지 먼저 검토한다.
- 질문이 꼭 필요하지 않다면, 가정을 명시하고 가장 타당한 방향으로 진행한다.

---

## Final Integration Policy

- 서브 에이전트 결과를 그대로 병합하지 않는다.
- 메인은 중복 제거, 상충점 정리, 근거 강도 평가, 결론 우선순위화, 불확실성 명시, 후속 액션 제안을 수행한다.
- 검색 비용 보고: `./scripts/search.sh stats`를 synthesis에 포함한다.

---

## Failure Prevention

다음을 피한다.

- 실질 분업 없는 형식적 멀티에이전트
- 검증 없는 통합
- 중복 조사
- 근거 없는 강한 결론
- 기록만 많고 의사결정 이유가 없는 저널
- 인접 도메인 연구를 대상 도메인에 무비판적으로 적용
- Critic 없이 통합하여 상충점과 도메인 적용성 미검증

---

## Search Tool Usage Policy

### 앙상블 검색 정책 (4계층)

검색은 비용 효율 순서로 에스컬레이션한다. **각 레이어에서 충분하면 멈춘다.**

| Layer | 도구 | 용도 | 비용 |
| --- | --- | --- | --- |
| **0** | WebSearch + WebFetch (빌트인) | 빠른 탐색, 사실 확인, URL 확인 | 추가 비용 없음 |
| **1** | Perplexity search + Tavily search | 종합 파악, 구체적 URL 발견 | \~$0.01 + 2크레딧 |
| **2** | WebFetch(정밀) → Tavily extract | 원문 확보, 핵심 수치 확인 | 1크레딧/URL |
| **3** | Tavily research / Perplexity research | 심층 탐구, 선행 연구 부족 영역 | 5크레딧+ |

**WebSearch 특이사항**:

- `allowed_domains` 파라미터로 학술 DB 타겟 가능: `["scholar.google.com", "arxiv.org", "ieee.org"]`
- reddit.com, news.ycombinator.com은 Anthropic 크롤러 차단 → community 모드에서는 Layer 1 주력

**상세 검색 전략은 스킬 파일 참조**:

- `.claude/skills/academic-research/SKILL.md`
- `.claude/skills/web-research/SKILL.md`
- `.claude/skills/community-analysis/SKILL.md`

### 검색 시간 범위 (Recency Policy)

| 변화 속도 | `--days` | 해당 분야 |
| --- | --- | --- |
| 초고속 | 180 | AI/ML, 개발 도구, LLM |
| 고속 | 365 | SaaS, 클라우드, 사이버보안 |
| 중속 | 730 | 제조, 에너지, 헬스케어, 레이저 가공 |
| 저속 | 1095 | 규제/법률, 인프라, 인구통계 |

### 비용 참고

| 도구 | 단가 | 참고 |
| --- | --- | --- |
| WebSearch/WebFetch | 빌트인 | Layer 0 우선 사용 |
| Perplexity sonar-pro | \~$0.01/요청 | 가성비 최고 |
| Tavily search (advanced) | 2 크레딧 | 월 1,000 크레딧 무료 |
| Tavily extract | 1 크레딧/URL |  |
| Tavily research | 5 크레딧 | 필요할 때는 써야 한다 |

---

## Research-to-Presentation Pipeline

리서치 완료 후 프레젠테이션 제안은 create-presentation 스킬(`.claude/skills/create-presentation/SKILL.md`)을 따른다. 대규모(16장+)는 `.claude/agents/presentation-builder.md` 파이프라인을 사용한다. Researcher 1명 이하의 단순 조사, "리서치만" 요청, 짧은 확인에서는 제안하지 않는다.