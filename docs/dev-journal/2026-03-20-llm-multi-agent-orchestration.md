# 세션 저널: Self-hosted LLM 멀티에이전트 오케스트레이션 아키텍처 리서치

## 세션 메타

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-03-20 |
| 주제 | Self-hosted LLM(Qwen3-235B-A22B) 멀티에이전트 오케스트레이션 아키텍처 |
| 참여 에이전트 | Researcher 1 (모델 성능), Researcher 2 (프레임워크 비교), Researcher 3 (구현 아키텍처), Critic, Journal |

---

## 사용자 요청 요약

- 회사 내부에서 Qwen3-235B-A22B 모델을 API로 서빙 중
- Claude Code처럼 멀티에이전트 형태로 spawn/orchestration 할 수 있는 아키텍처를 리서치 요청
- 처음에 "235B-A22B 오픈웨이트 모델"이라고만 알려줌 → 조사 결과 Qwen3-235B-A22B (Alibaba Cloud)로 확인됨
- 초기에 DeepSeek V3로 잘못 가정했다가 정정함

---

## 문제 정의

1. **모델 능력 평가**: Qwen3-235B-A22B의 성능이 멀티에이전트 오케스트레이션에 충분한가?
   - Tool use / Function calling 능력
   - Instruction following 정확도
   - 장문 컨텍스트 처리 능력
2. **프레임워크 선택**: 어떤 프레임워크/아키텍처로 구현 가능한가?
   - 기존 멀티에이전트 프레임워크 비교 (LangGraph, CrewAI, AutoGen 등)
   - Self-hosted LLM과의 호환성
3. **구현 방법**: Claude Code 스타일의 서브에이전트 spawn + 병렬 실행 + 결과 통합을 단순 API로 어떻게 구현하는가?

---

## 핵심 가정

| 가정 | 근거 | 위험도 |
|------|------|--------|
| OpenAI-compatible API로 제공됨 | 일반적인 self-hosted LLM 서빙 관행 (vLLM, TGI 등) | 낮음 |
| GPU 자원 이미 확보 | 이미 서빙 중이므로 인프라 존재 | 낮음 |
| 사용자는 개발자 | 구현 방법에 관심, 기술적 질문 | 낮음 |
| 모델이 tool use를 지원 | Qwen3 시리즈의 알려진 특성이나 검증 필요 | 중간 |

---

## Question Expansion 결과

### 1. 핵심 질문
Qwen3-235B-A22B API를 멀티에이전트 오케스트레이션으로 확장하는 최적 아키텍처는?

### 2. 검증 필요 전제
- Qwen3-235B-A22B의 tool use / function calling 능력이 오케스트레이션에 충분한 수준인가?
- 단순 OpenAI-compatible API만으로 서브에이전트 spawn 패턴이 가능한가? (별도 인프라 필요 여부)

### 3. 인접 질문
- 프레임워크별 self-hosted LLM 지원 성숙도 차이는?
- 멀티에이전트에서 토큰 소비량/지연시간 관리는 어떻게 하나?
- Claude Code의 실제 멀티에이전트 아키텍처는 어떤 구조인가?

### 4. 반대 시나리오
모델의 instruction following / tool use 능력이 부족하여, 서브에이전트가 잘못된 결과를 반환하고 오케스트레이터가 이를 감지하지 못해 오류가 전파되는 시나리오

### 5. 이질 도메인 유추
마이크로서비스 오케스트레이션 패턴 (Saga, Choreography vs Orchestration) — 분산 시스템에서의 작업 분배/실패 처리 패턴이 LLM 멀티에이전트에도 적용 가능

---

## 의사결정 로그

| # | 시점 | 결정 | 근거 | 대안 |
|---|------|------|------|------|
| 1 | 세션 초기 | DeepSeek V3 → Qwen3-235B-A22B로 모델 정정 | 사용자가 정정 요청. 235B-A22B MoE 구조가 Qwen3와 일치 | - |
| 2 | 에이전트 구성 | Researcher 3명 + Critic + Journal | 모델 평가, 프레임워크 비교, 구현 설계가 각각 독립적 관점. Researcher 3명이므로 Critic 필수 | Researcher 2명으로 축소 (프레임워크+구현 통합) → 관점 분리 이점이 크다고 판단 |
| 3 | 통합 단계 | R1의 "강력 추천" → "조건부 추천"으로 교정 | Critic 피드백: 근거 대비 과도한 확신. tool use 검증 전까지 단정 불가 | 원래 표현 유지 → 검증 없는 강한 결론은 정책 위반 |
| 4 | 통합 단계 | 비용 비교를 API 가격 vs 자체 호스팅 TCO로 분리 | 단순 API 가격 비교는 인프라/운영 비용을 누락. Critic이 누락 관점으로 지적 | 단일 비용 테이블 유지 → 의사결정에 오해 유발 |
| 5 | 통합 단계 | 최우선 액션을 "바로 구현"이 아닌 "먼저 검증"으로 설정 | 모델 tool use 능력이 미검증 상태에서 구현 착수는 위험. Critic 피드백 반영 | 즉시 MVP 구현 → 검증 없이 투자하는 리스크 |
| 6 | 통합 단계 | 문제 재정의: "Claude Code처럼 멀티에이전트" → "검증 기반으로 최적 전략 결정" | 원래 질문이 솔루션에 과도하게 고정. 검증 결과에 따라 단일 에이전트가 최적일 수도 있음 | 원래 프레이밍 유지 → 사용자 요청 존중이나, 더 나은 문제 정의가 가능 |

---

## 에이전트 구성 및 태스크 분배

### Researcher 1: Qwen3-235B-A22B 모델 성능 분석
- Qwen3-235B-A22B의 벤치마크 성능
- Tool use / Function calling 능력
- MoE 구조 특성 (235B total, 22B active)
- 멀티에이전트에서의 적합성 평가

### Researcher 2: 멀티에이전트 프레임워크 비교
- LangGraph, CrewAI, AutoGen, OpenAI Swarm 등 프레임워크 비교
- Self-hosted LLM 호환성
- Claude Code 아키텍처 분석
- 프레임워크 선정 권고

### Researcher 3: 구현 아키텍처 설계
- 서브에이전트 spawn 패턴
- 병렬 실행 및 결과 통합
- 오류 처리 및 폴백
- 레퍼런스 아키텍처 설계

### Critic
- Researcher 3명의 결과를 6개 체크리스트로 검증
- 상충점 식별 및 조정 권고

### Journal (이 에이전트)
- 세션 과정 기록

---

## 이슈 / 해결

| 이슈 | 상태 | 해결 |
|------|------|------|
| 모델 오식별 (DeepSeek V3) | 해결됨 | 사용자 정정으로 Qwen3-235B-A22B 확인 |
| Qwen3-235B-A22B의 tool use 능력 불확실 | 해결됨 | R1 조사 완료. 조건부 적합 판정 (실제 검증 필요) |

---

## 완료 사항

| 에이전트 | 상태 | 비고 |
|----------|------|------|
| R1 (Qwen3 성능) | 완료 | 모델명 정정(DeepSeek→Qwen3) 반영됨 |
| R2 (프레임워크 비교) | 완료 | 6개 프레임워크 + Claude Code 아키텍처 분석 |
| R3 (구현 아키텍처) | 완료 | MVP 코드 구조 + 확장 로드맵 |
| Critic | 완료 | 6개 체크리스트 수행, 상충점 3건, 누락 관점 4건, 확신도 교정 4건 발견 |
| Synthesis (00-synthesis.md) | 완료 | Critic 피드백 반영하여 통합 |

---

## TODO

- [x] Researcher 1~3 결과 수신 대기
- [x] Critic 검증 결과 반영
- [x] 최종 synthesis 보고서에 의사결정 근거 포함 확인
- [ ] 사용자에게 프레젠테이션 생성 여부 확인

---

## Rejected Alternatives

| 대안 | 기각 이유 |
|------|-----------|
| Researcher 2명 구성 (프레임워크+구현 통합) | 프레임워크 비교와 구현 설계는 독립적 관점이며, 분리 시 더 깊은 분석 가능 |
| Critic 생략 | CLAUDE.md 정책상 Researcher 2명 이상이면 Critic 필수 |
| 메인 에이전트 직접 처리 | 3개 독립 관점(모델 성능/프레임워크/구현)이 필요하여 멀티에이전트 분해 실익 있음 |
