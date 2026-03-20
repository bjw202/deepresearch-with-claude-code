# MASON 제조 온톨로지 백서 리서치 — 세션 저널

## 세션 메타

| 항목 | 내용 |
| --- | --- |
| 날짜 | 2026-03-20 |
| 주제 | MASON(MAnufacturing's Semantics ONtology) 백서 리서치 |
| 리서치 폴더 | `docs/research/2026-03-20-mason-ontology-whitepaper/` |
| 서브에이전트 구성 | Researcher 3 (이론/실무/AI) + Critic 1 + Journal 1 |

---

## 사용자 요청 요약

MASON(MAnufacturing's Semantics ONtology)에 대해 초기 조사(`context-texts/mason-init-research.md`) 결과를 바탕으로, 이론 체계, 실제 활용, 발전 방향, AI 접점을 쉽게 풀어쓴 백서 형태의 심층 리서치 요청.

---

## 문제 정의

- MASON이라는 2006년 제안된 제조 온톨로지의 현재 위치와 가치를 종합적으로 파악
- 비전공자도 이해할 수 있는 수준으로 설명

---

## 핵심 가정

1. MASON은 현재까지도 제조 온톨로지의 참조점으로 유의미하다
2. AI/LLM과의 접점이 실질적으로 존재한다
3. 사용자는 제조 도메인 실무자로서 실제 시스템 구축에 관심이 있다

---

## 의사결정 로그

### Question Expansion

- 인접 질문 3개 + 반대 시나리오 1개 도출 완료
- 확장된 질문을 서브에이전트 태스크 분배에 반영

### 서브에이전트 구성 결정

| 결정 | 근거 |
| --- | --- |
| Researcher 3명 (이론/실무/AI) 분리 | 이론 체계와 실제 적용은 관점이 다르고, 각각 충분한 깊이가 필요 |
| AI 전담 Researcher 배정 | 사용자의 명시적 관심사이며, 최근 빠르게 변화하는 영역 |
| Critic 필수 배정 | Researcher 3명이므로 CLAUDE.md 정책에 따라 필수 |

---

## 이슈 / 해결

| 이슈 | 해결 |
| --- | --- |
| I40GO 발표 시점 불일치 (01: 2020, 02: 2025) | 2020년 시작, 2025년 최신 버전 발표로 해석하여 synthesis에 반영 |
| 03 보고서 AI+온톨로지 과잉 낙관 | Critic 지적 반영하여 확신도를 "중간"으로 교정 |
| MASON 직접 채택 vs 제조 온톨로지 일반 채택 혼동 | synthesis에서 명확히 구분 |
| "10배 비용 절감" 미검증 수치 | synthesis에서 제외 |

---

## TODO

- [x] Researcher 3명 결과 수합

- [x] Critic 리뷰

- [x] 종합 보고서(`00-synthesis.md`) 작성

- [x] 최종 통합 검토

---

## Rejected Alternatives

| 대안 | 기각 이유 |
| --- | --- |
| 단일 Researcher로 전체 조사 | 범위가 넓어 품질 저하 우려 |
| AI 접점을 별도로 분리하지 않는 안 | 사용자의 명시적 관심사이므로 전담 배정이 적절 |
