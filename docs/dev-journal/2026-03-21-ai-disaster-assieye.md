# Dev Journal — 2026-03-21: AI 에이전트 재난 대응 시스템 기술 분석 (AssiEye)

## 세션 메타

| 항목 | 값 |
|---|---|
| 날짜 | 2026-03-21 |
| 프로젝트 | AssiEye 기술 분석 및 구현 가이드 |
| 에이전트 구성 | Researcher 1 (기술 심층 조사), Researcher 2 (구현 가이드), Critic, Journal |
| 저장 경로 | `docs/research/2026-03-21-ai-disaster-assieye/` |
| 리서치 출처 | https://jenice-unwrongful-barton.ngrok-free.dev/ |

---

## 사용자 요청 요약

개발자 포스팅에서 발견한 화재 재난 대응 AI 시스템(AssiEye)의 기술 설명, 연동 방식, 구현 가이드 작성 요청.

AssiEye는 AI 에이전트 기반 OSINT 대시보드로, 재난 상황(화재 등)에서 실시간 정보를 수집·분석·시각화한다. 개발자가 구현한 3가지 핵심 기술의 동작 원리와 직접 구현 방법을 이해하고자 함.

---

## 문제 정의

**핵심 질문**: AssiEye에 사용된 3가지 기술(Cheliped Browser, 온톨로지 기반 AI 예측, 하네스 엔지니어링)을 이해하고 직접 구현할 수 있는가?

**3가지 핵심 기술**:
1. **Cheliped Browser** — Agent DOM/접근성 트리 기반 브라우저 스킬. 일반 웹 스크래핑이 아닌 UI 의미론적 구조 활용
2. **온톨로지 기반 AI 예측** — 사건·공간·자원·인명·2차피해 5개 도메인, 자기 진화형 지식 그래프
3. **하네스 엔지니어링** — Claude Code 4개 에이전트, loop 스킬 기반 병렬 처리 아키텍처

---

## 핵심 가정

| 가정 | 검증 필요 여부 | 비고 |
|---|---|---|
| Cheliped Browser가 접근성 트리(AXTree)를 직접 파싱한다 | 필요 | DOM vs AXTree 토큰 효율 차이가 핵심 |
| Claude Code의 loop 스킬이 실제 병렬 에이전트 실행을 지원한다 | 필요 | 공식 문서 확인 필요 |
| 온톨로지 "자기 진화"가 런타임 추론으로 구현된다 | 필요 | 초기 설계 종속 가능성 |
| AssiEye가 오픈소스이거나 핵심 코드가 공개되어 있다 | 확인 필요 | ngrok URL = 로컬 개발 서버 가능성 |
| MapLibre GL이 지도 시각화에 사용된다 | 높음 | 오픈소스 지도 라이브러리 |

---

## Question Expansion 결과

1. **핵심 질문**: AssiEye 3가지 기술의 동작 원리와 직접 구현 방법
2. **검증 필요 전제**:
   - Agent DOM 방식의 실제 토큰 효율 (풀 HTML 대비 AXTree의 토큰 절약 비율)
   - Claude Code loop 스킬의 실제 동작 방식 (병렬 vs 순차, 컨텍스트 공유 여부)
3. **인접 질문**:
   - Cheliped Browser의 오픈소스 여부 및 대안 라이브러리 존재 여부
   - 온톨로지를 코드로 표현하는 방법 (OWL, RDF, JSON-LD, 커스텀)
   - 4개 에이전트 병렬 실행 시 실제 비용과 컨텍스트 관리 전략
4. **반대 시나리오**: "자기 진화" 온톨로지가 초기 설계 도메인에 종속되어 새로운 재난 유형에 취약할 수 있음

---

## 에이전트 구성 및 역할 분배

| 에이전트 | 역할 | 담당 영역 |
|---|---|---|
| Researcher 1 | 기술 심층 조사 | Cheliped Browser 원리, Agent DOM/AXTree, Claude Code loop 스킬, MapLibre |
| Researcher 2 | 구현 가이드 작성 | 단계별 개발 방법, 코드 예시, 통합 아키텍처 |
| Critic | 검토 | 두 리서처 산출물의 논리적 허점, 수치 근거, 상충점 분석 |
| Journal | 세션 기록 | 이 파일 |

---

## 의사결정 로그

| 시점 | 결정 | 근거 |
|---|---|---|
| 리서치 착수 | Researcher 2명 + Critic 구성 선택 | 기술 조사(심층)와 구현 가이드(실용)가 성격이 달라 분리 효과 큼. Critic 필수 조건 충족 |
| 저장 경로 | `docs/research/2026-03-21-ai-disaster-assieye/` | CLAUDE.md 네이밍 컨벤션 준수 |
| 사이트 접근 방식 | tavily extract로 원문 확보 우선 | ngrok 임시 URL이므로 빠른 원문 확보가 중요 |
| 온톨로지 표현 방식 | JSON-LD + 커스텀 구조 우선 탐색 | 재난 도메인 특화 + Claude 컨텍스트 효율 고려 |

---

## 이슈 / 해결

| 이슈 | 상태 | 해결 방안 |
|---|---|---|
| ngrok URL은 임시 서버 — 사이트 소멸 가능성 | 진행 중 | 리서치 중 원문 최대한 확보. 영구 링크 없으면 캡처 내용만으로 분석 |
| Cheliped Browser가 공개 라이브러리인지 불명확 | 조사 중 | Researcher 1이 오픈소스 여부와 대안 조사 |
| "자기 진화" 온톨로지의 구체적 구현 방식 미확인 | 조사 중 | Researcher 1이 런타임 추론 vs 학습 기반 여부 조사 |
| Claude Code loop 스킬 공식 문서 부재 가능성 | 조사 중 | Researcher 1이 Claude Code 공식 문서 + 커뮤니티 확인 |

---

## TODO

- [ ] Researcher 1 산출물 검토 (기술 원리 정확성)
- [ ] Researcher 2 산출물 검토 (구현 가이드 실행 가능성)
- [ ] Critic 리뷰 반영하여 synthesis 보완
- [ ] 00-synthesis.md 완성 후 사용자에게 프레젠테이션 제안
- [ ] ngrok 사이트 소멸 시 대비 — 핵심 내용 quotes 형태로 synthesis에 보존

---

## Rejected Alternatives

| 대안 | 거부 이유 |
|---|---|
| Researcher 1명만 사용 | 기술 조사와 구현 가이드는 성격이 달라 한 에이전트가 모두 처리 시 깊이 부족 우려 |
| WebSearch(내장) 사용 | CLAUDE.md 정책상 조사에는 비효율. search.sh 스크립트 사용 원칙 준수 |
| 온톨로지를 OWL/RDF로 한정 | 재난 AI 시스템에서 LLM 컨텍스트 친화적 JSON-LD가 더 적합할 수 있음. 조사 후 결정 |
| 구현 가이드 생략 | 사용자 요청에 "구현 가이드"가 명시됨. 개념 설명만으로는 요청 불충족 |

---

## 세션 노트

- AssiEye의 ngrok URL은 로컬 개발 서버 노출로 보임. 일시적 접근 가능성 높음.
- "하네스 엔지니어링"이라는 용어는 개발자 독자적 용어일 가능성. Claude Code loop 스킬과의 관계를 명확히 할 필요 있음.
- 5개 도메인 온톨로지(사건·공간·자원·인명·2차피해)는 ICS(Incident Command System) 구조와 유사. 이질 도메인 연결 가능성.
