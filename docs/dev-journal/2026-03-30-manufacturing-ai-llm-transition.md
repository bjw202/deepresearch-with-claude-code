# 세션 저널: 제조 AI 시스템 LLM/온톨로지 전환 리서치

## 세션 메타
- **날짜**: 2026-03-30
- **주제**: 제조 AI 시스템 동작 방식 및 LLM/온톨로지 전환 가능성 리서치
- **선행 리서치**: `docs/research/2026-03-20-ontology-agent-recipe-control/`

## 사용자 요청 요약
기존 온톨로지+에이전트 레시피 제어 리서치에서 언급된 유사 시스템들(TIGNIS, LAM RESEARCH, IMUBIT, BOSCH, SIEMENS 등)의 구체적 동작 방식과 향후 온톨로지/LLM 시스템으로 이동할 가능성 조사.

## 문제 정의
1. 각 시스템의 기술 아키텍처와 데이터 흐름을 이해
2. LLM/KG 전환 가능성과 장벽을 평가
3. 이전 리서치의 3-layer 하이브리드 아키텍처 제안이 현실적인지 검증

## 핵심 가정
- 제조 AI는 전통 ML/RL → LLM/foundation model 방향으로 진화할 가능성이 있음
- 그러나 실시간 제어, 안전성, 수치 정밀도 요구로 인해 단순 교체는 불가능
- 가장 현실적인 경로는 하이브리드(기존 ML + LLM 보조 레이어)

## Question Expansion 결과
1. **핵심**: 기존 시스템들의 동작 방식과 LLM/온톨로지 전환 가능성
2. **검증 필요 전제**: 보고 성과의 독립 검증 여부, TIGNIS의 "ML only" 판단 유효성
3. **인접 질문**: 고객사/도입 규모, 기술적 장벽, 신규 LLM 기반 스타트업
4. **반대 시나리오**: 기존 ML/RL이 이미 충분하여 LLM 실익 없음
5. **이질 도메인**: 자율주행의 rule-based → ML → foundation model 전환 경로

## 에이전트 구성
| 역할 | 모델 | 산출물 | 상태 |
|------|------|--------|------|
| Researcher 1 | sonnet | 01-system-architectures.md | 진행중 |
| Researcher 2 | sonnet | 02-llm-transition-analysis.md | 진행중 |
| Critic | opus | 99-critic-review.md | 대기 (Researcher 완료 후) |
| Journal | sonnet | 이 파일 | 완료 |

## 의사결정 로그
| 시점 | 결정 | 근거 |
|------|------|------|
| 시작 | Researcher 2명 병렬 발사 | 시스템 분석 vs 전환 가능성은 독립적 조사 가능 |
| 시작 | Critic은 순차 | Researcher 산출물 필요 |
| 시작 | --days 365 적용 | AI/제조 융합은 고속 변화 영역 |

## TODO
- [ ] Researcher 1, 2 완료 확인
- [ ] Critic 발사
- [ ] Synthesis 통합
- [ ] 검색 비용 보고

## Rejected Alternatives
- **Researcher 3명 구성 (기업별 분리)**: 기업 수가 많지만 조사 깊이가 분산될 우려. 2명이 축별로 나누는 것이 효율적.
- **Verifier 추가**: 이전 리서치가 이미 기초 사실을 확인했으므로 이번에는 Critic으로 충분.
