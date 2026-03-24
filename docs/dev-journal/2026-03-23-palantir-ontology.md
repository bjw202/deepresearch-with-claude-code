# 저널: 팔란티어 온톨로지 기술 구조·운영·사례 리서치

## 세션 메타
- **날짜**: 2026-03-23
- **주제**: 팔란티어 온톨로지 기술 구조·운영·사례 리서치
- **참여 에이전트**: Researcher 3명 + Critic 1명 + Synthesizer 1명 + Journal 1명
- **리서치 폴더**: `docs/research/2026-03-23-palantir-ontology/`

---

## 사용자 요청 요약

팔란티어가 내세우는 온톨로지로 어떤 문제들을 해결하고 어떻게 운영하는지 실제적인 사례들을 상세하게 리서치. 단순 결과가 아니라 온톨로지 구축/운영의 기술적·원리적 측면이 잘 나타나야 함. 다양한 분야의 사례를 통해 궁극적으로 온톨로지 작동 방식을 이해시키는 것이 목표.

---

## 문제 정의

- 팔란티어 온톨로지의 기술 아키텍처와 핵심 원리
- 산업별 실제 적용 사례 (국방/헬스케어/제조/에너지/금융/정부)
- AIP와 온톨로지의 결합, 최신 발전
- 한계와 비판적 관점

---

## 핵심 가정

- 팔란티어의 공식 문서와 공개 사례에서 충분한 기술적 상세를 얻을 수 있다
- "온톨로지"가 단순 마케팅 용어가 아닌 실질적 기술 구조를 가진다

---

## Question Expansion

1. **핵심 질문**: 온톨로지의 기술 구조, 구축/운영 방식, 다양한 분야의 실제 사례
2. **검증 필요 전제**: 전통적 시맨틱 웹 온톨로지와의 관계, 진정한 기술적 차별점 여부
3. **인접 질문**: 기존 데이터 통합과의 구조적 차이, AIP에서의 LLM 결합, 구축/유지 비용과 한계
4. **반대 시나리오**: 과대포장된 데이터 모델링일 가능성
5. **이질 도메인 유추**: Gene Ontology (생물학) — 도메인 객체 간 관계를 계층적으로 정의하는 구조가 팔란티어 온톨로지와 유사한 원리를 공유할 수 있음

---

## 서브에이전트 구성

| 역할 | 담당 | 산출물 |
|------|------|--------|
| Researcher 1 | 기술 아키텍처·핵심 원리 | `01-technical-architecture.md` |
| Researcher 2 | 산업별 적용 사례 | `02-industry-cases.md` |
| Researcher 3 | AIP·발전·한계 | `03-aip-evolution-limits.md` |
| Critic | 6개 체크리스트 검증 | `99-critic-review.md` |
| Synthesizer | 최종 통합 | `00-synthesis.md` |

---

## 의사결정 로그

| 시각 | 결정 | 이유 |
|------|------|------|
| 세션 시작 | Researcher 3명 병렬 구성 | 기술 아키텍처 / 산업 사례 / AIP·한계로 관점 분리. 병렬 처리로 시간 절약 |
| 세션 시작 | Critic 필수 지정 | Researcher 3명 이상이므로 CLAUDE.md 정책에 따라 Critic 의무 |
| 세션 시작 | Synthesizer는 opus 모델 사용 | 최종 통합 판단은 품질의 마지막 방어선 (모델 정책 준수) |

---

## 진행 상황

- [x] 리서치 폴더 생성
- [x] 저널 파일 생성
- [x] Researcher 3명 병렬 발사
- [x] Researcher 결과 수집
- [x] Critic 검증
- [x] Synthesizer 통합
- [x] 검색 비용 보고

---

## 완료 상태

- [x] Researcher 3명 결과 수집 완료
- [x] Critic 검증 완료 (핵심 결함 2건, Repair 불필요)
- [x] Synthesizer 통합 완료

---

## Critic 핵심 지적

1. **R1-R3 기술적 독창성 평가 상충** → Synthesis에서 균형 잡힌 결론 도출
2. **모든 성과 수치가 팔란티어 자체 출처** → 구조적 한계로 명시

---

## 검색 비용

- **Perplexity**: search 25회 + research 1회, 예상 비용 ~$1.76
- **Tavily**: search 11회(22 크레딧) + extract 20회(20 크레딧) = 42 크레딧
- **총 57회 API 호출**

---

## 산출물

| 파일 | 설명 |
|------|------|
| `00-synthesis.md` | 종합 보고서 |
| `01-technical-architecture.md` | 기술 아키텍처 |
| `02-industry-cases.md` | 산업별 사례 |
| `03-aip-evolution-limits.md` | AIP·한계 |
| `99-critic-review.md` | Critic 리뷰 |

---

## 이슈 / 해결

1. Critic 지적: R1-R3 간 기술적 독창성 평가 상충 → Synthesis에서 균형 잡힌 결론으로 해결
2. Critic 지적: 성과 수치 출처 편향 → 구조적 한계로 명시하여 해결. Repair Pass 불필요 판단

---

## TODO (후속)

- [x] Researcher 결과 수신 후 Critic 발사
- [x] Critic 결과에서 핵심 결론을 바꿀 결함 발견 시 Repair Pass 여부 판단 → 불필요
- [ ] 최종 synthesis 완료 후 프레젠테이션 제안 (슬라이드 50장 이상, Researcher 3명)

---

## Rejected Alternatives

- **Researcher 2명 구성**: 기술/사례로만 나누면 AIP·한계가 다른 리서치에 희석될 위험. 3명으로 분리.
- **메인 에이전트 직접 통합**: Critic 없이 통합 시 상충점·도메인 적용성 미검증 위험 (CLAUDE.md Failure Prevention 참조)
