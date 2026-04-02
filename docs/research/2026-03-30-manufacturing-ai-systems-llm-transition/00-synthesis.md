# 종합 보고서: 제조 AI 시스템의 동작 방식과 LLM/온톨로지 전환 가능성

**작성일**: 2026-03-30 **선행 리서치**: `docs/research/2026-03-20-ontology-agent-recipe-control/`

---

## Executive Summary

7개 기업(TIGNIS, IMUBIT, LAM RESEARCH, BOSCH, SIEMENS, SAMSUNG, INTEL)의 제조 AI 시스템을 조사한 결과, 핵심 결론은 다음과 같다:

1. **완전 교체형 LLM 전환은 단기(\~2028) 불가능**. 실시간 제약(PLC 50\~100ms vs LLM 수초), 수치 정밀도 한계, 안전 인증 부재가 구조적 장벽.
2. **레이어 추가형 전환은 이미 진행 중**. Siemens Industrial Copilot, IMUBIT Controllable AI, Bosch Rework Agent 등 복수 기업이 기존 ML 위에 LLM 보조 레이어를 배포 완료.
3. **하이브리드형(ML+LLM+KG)이 중기(2028\~2030) 현실적 경로**. Siemens IFM(Industrial Foundation Model)이 가장 앞선 시도.
4. **도메인 특화 접근이 범용 접근보다 유효**. 정유(IMUBIT), 반도체(TIGNIS, Lam), 도메인 특화 LLM(SemiKong)이 범용 AI 전략(Samsung)보다 구체적 성과 보유.

> **분석의 한계**: 본 보고서는 공개된 성공 사례 기반이며, 실패 사례는 공개 자료 부재로 다루지 못했다 (생존자 편향 가능성). 도입 비용/TCO 분석도 공개 데이터 부족으로 제한적이다.

---

## 시스템별 종합 평가

### 성숙도 매트릭스

| 기업 | 제어 유형 | AI 기법 | 도입 수준 | LLM 전환 적극성 | 검증 수준 |
| --- | --- | --- | --- | --- | --- |
| **IMUBIT** | Closed-loop 자율 | DNN + RL | Production (20+ 고객, 100+ 배포) | ★★☆ (Controllable AI) | ★★☆ 자체 발표 |
| **TIGNIS** | Closed-loop R2R | 물리 서로게이트 + ML | Production (Cohu 인수) | ★☆☆ | ★★☆ 자체 자료 |
| **LAM RESEARCH** | Semi-closed HitL | Bayesian Optimization | R&D + 장비 임베디드 | ★★☆ (Semiverse) | ★★★ Nature 논문 (시뮬레이션 환경) |
| **SIEMENS** | Open-loop 보조 | GPT-4 + KG | Pilot (100+ 고객 테스트) | ★★★ (IFM 개발 중) | ★★☆ 파트너 케이스 |
| **BOSCH** | Semi-autonomous | Multi-agent + LLM | 내부 배포 | ★★★ (Co-Intelligence) | ★☆☆ 정성적 주장 |
| **SAMSUNG** | 전략 선언 | GPU + 디지털트윈 | 파일럿 초기 | ★★☆ | ★☆☆ 발표만 |
| **INTEL** | Closed-loop (결함) | CNN + CV | Production 전수 검사 | ★☆☆ | ★★★ 내부 백서 |

### Tier 1: 실 운영 검증된 Closed-loop 시스템

**IMUBIT** — 가장 구체적 아키텍처 공개. DNN+RL 기반 DLPC(Deep Learning Process Control)로 DCS에 직접 세트포인트를 기입하는 완전 Closed-loop. OPC-UA 표준으로 기존 DCS 연동, 클라우드(학습)↔온프레미스(제어) 단방향 설계가 산업 보안 요구사항을 충족. **단, 정유/석유화학 연속공정 특화**이므로 반도체 등 이산공정(batch/wafer-level)에 직접 일반화 불가.

**TIGNIS** — 물리 기반 서로게이트 모델 + ML로 웨이퍼-투-웨이퍼 R2R 자동 조정. DTQL(도메인 특화 쿼리 언어)로 코드 없는 분석 지원. 2024년 Cohu($2.6B 반도체 계측)에 인수되어 생태계 통합 강화 전망. 독립 검증 데이터는 부족.

**LAM RESEARCH** — Nature 논문(2023)으로 가장 엄밀하게 검증. "Human-First, Computer-Last" Bayesian Optimization으로 레시피 개발 비용/시간 50% 절감 — **단, 시뮬레이션 환경(SiO2 홀 식각) 기반이며 실 팹 전이 성능은 별도 검증 필요**.

### Tier 2: LLM 전환에 가장 적극적

**SIEMENS** — 아키텍처 공개 수준 최고. OT→Industrial Edge→WinCC OA→MCP Server→클라우드 LLM의 전체 데이터 경로를 도식화. Industrial Copilot(Azure OpenAI)으로 PLC 코드 생성, 현장 음성 보고, PLM 통합 구현. 더 중요한 것은 **Industrial Foundation Model(IFM)** 개발 — 3D 모델, P&ID 등 엔지니어링 고유 데이터를 처리하는 도메인 특화 파운데이션 모델. 현재 보조 도구 수준이나, IFM 완성 시 하이브리드형 전환의 선두 주자가 될 가능성.

**BOSCH** — Multi-agent + LLM 기반 공장 자동화에서 가장 실질적 배포. Jaipur 공장에 Generative AI Rework Agent 실 배포, Microsoft 협력 Manufacturing Co-Intelligence 플랫폼 개발 중. 2025년 가을 외부 기업용 no-code/low-code 멀티에이전트 플랫폼 출시 예정. 성과 데이터가 정성적("수백만 유로")이라 실증 부족.

### Tier 3: 전략 선언 또는 내부 최적화 단계

**SAMSUNG** — NVIDIA 50,000+ GPU 기반 AI Megafactory 구축 발표. 디지털 트윈(Omniverse) + AI 에이전트 + 로봇 통합 비전. 2030년 전 공장 배포 목표이나 현재 검증 가능한 운영 성과 없음.

**INTEL** — Inline AI(전수 웨이퍼 검사, ADC 90%+ 정확도)로 가장 명확한 단위 ROI 보유(연간 $200만 절감/공정). 자체 팹 특화 솔루션으로 외부 판매 없음. LLM 전환 움직임 미확인.

---

## LLM/온톨로지 전환 경로 분석

### 4가지 전환 유형

```
[현재]                                        [미래]
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  전통 ML/RL     │ →  │  레이어 추가형   │ →  │  하이브리드형    │
│  (IMUBIT, TIGNIS│    │  (현재 진행 중)  │    │  (중기 방향)    │
│   Lam, Intel)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      │
                       ┌─────────────────┐            ↓
                       │  교체형          │    ┌─────────────────┐
                       │  (장기/연구)     │ ←  │  조건 충족 시    │
                       └─────────────────┘    │  (2030년+)      │
                                              └─────────────────┘
```

| 전환 유형 | 정의 | 현재 사례 | 확신도 |
| --- | --- | --- | --- |
| **레이어 추가형** | 기존 ML 위에 LLM을 설명/인터페이스로 추가 | Siemens Copilot, IMUBIT Controllable AI, Bosch Rework Agent | ★★★ |
| **하이브리드형** | 수치→ML, 판단→LLM, 지식→KG 역할 분리 | Siemens IFM(개발 중), ISA-95+LLM+KG 프레임워크(연구) | ★★☆ |
| **교체형** | 전체 파이프라인을 Foundation Model로 교체 | 해당 사례 없음 | ★☆☆ |
| **불필요형** | 기존 ML이 이미 최적인 영역 | 단일 파라미터 PID 튜닝, 수렴된 RL, 고주파 센서 제어 | ★★★ |

### 전환의 구조적 장벽

| 장벽 | 현황 | 해소 시기 전망 |
| --- | --- | --- |
| **실시간 제약** (LLM 수초 vs PLC ms) | 엣지/클라우드 분리로 우회 중 | 엣지 LLM 성숙 시 (\~2028) |
| **수치 정밀도** (LLM 부동소수점 오류) | 수치는 ML, 판단은 LLM 분리 | 구조적 한계 — 단기 해소 어려움 |
| **안전 인증** (IEC 61508 등 비결정론 미수용) | 인증 경로 미정립 | 규제 프레임워크 확립 필요 (\~2030+) |
| **데이터 주권/IP** (레시피 기밀 외부 전송) | 온프레미스 LLM 또는 특화 소형 모델 | SemiKong 등 도메인 소형 모델 부상 |
| **온톨로지 구축 비용** (도메인 전문가 노력) | LLM 기반 자동 KG 생성 연구 활발 | OntoKGen 등 성숙 시 (\~2027) |

### 주목할 신규 플레이어

**Aitomatic SemiKong** — Llama 기반 반도체 도메인 전용 LLM. 시장 출시 기간 20\~30% 단축, 공정 이해도 15\~25% 향상 주장 — **단, Meta 파트너사 홍보성 블로그 출처로 측정 방법론 미확인. 확신도 ★★☆로 평가** (Critic 교정 반영).

**EthonAI** — 인과 AI(Causal AI) 기반 제조 효율화. LLM보다 인과관계/설명가능성 중심 차별화. Series A $16M (2024).

---

## 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치 | 확신도 | 검증 필요 |
| --- | --- | --- | --- | --- |
| IMUBIT: 정유 클로즈드루프 100+ 배포 | 자사 블로그 + LNS Research | 정유 특화 | ★★★ | 이산공정 전이 가능성 |
| TIGNIS: 물리 서로게이트 R2R 제어 | Cohu 제품 자료 | 반도체 | ★★☆ | 독립 성과 데이터 |
| Lam: HF-CL 50% 비용/시간 절감 | Nature 논문 | 반도체 (시뮬레이션) | ★★★ (시뮬레이션) | 실 팹 전이율 |
| Siemens IFM: 산업 파운데이션 모델 개발 | 공식 발표 + ARC분석 | 산업 전반 | ★★★ | 완성 시기 및 성능 |
| Bosch: Jaipur Rework Agent 배포 | 자사 백서 | 이산 제조 | ★★☆ | 정량적 성과 |
| SemiKong: 반도체 도메인 LLM | Meta 블로그 | 반도체 | ★★☆ | 독립 벤치마크 |
| Intel: IWVI 연간 $200만 절감 | Intel IT 백서 | 반도체 내부 | ★★★ | 외부 재현성 |
| LLM 추론 지연 &gt; PLC 주기 | MDPI + SPS 2025 | 산업 전반 | ★★★ | 엣지 LLM 발전 |
| LLM 수치 추론 구조적 한계 | ACL 2023 + controlsys.org | 범용 | ★★★ | 장기 아키텍처 발전 |

---

## 상충점 해결 테이블

| 상충 | Researcher 1 관점 | Researcher 2 관점 | 판단 |
| --- | --- | --- | --- |
| Lam MFL 용어 | "MFL 미확인, 비공식 추정" | "MFL = Machine-First Learning" | **HF-CL(Human-First, Computer-Last)이 공식 용어**. MFL은 이전 리서치 인용 오류. HF-CL로 통일 |
| TIGNIS LLM 전환 | DTQL 상세 기술, LLM 미언급 | LLM 전환 신호 없음 (★☆☆) | **일관**. DTQL→LLM 자연어 인터페이스 전환은 기술적으로 자연스러운 경로이나, 현재 Cohu는 기존 ML 강화에 집중 |

---

## 역방향 의사결정 가이드

| 만약 ... | 그러면 ... |
| --- | --- |
| Siemens IFM이 2027년 내 Production-ready로 출시되면 | 하이브리드형 전환이 대폭 가속. 자체 IFM 개발 대신 Siemens 생태계 활용 검토 |
| LLM 추론 지연이 100ms 이하로 감소하면 | 실시간 제어 루프 내 LLM 배치 가능. 교체형 전환 논의 시작 |
| IEC 61508이 비결정론적 AI를 수용하는 개정안이 나오면 | 안전 필수 제조에서도 LLM 기반 제어 가능. 전환 속도 급가속 |
| SemiKong 등 도메인 LLM이 독립 벤치마크에서 검증되면 | 온프레미스 배포로 데이터 주권 문제 해소. 반도체 외 도메인 확산 기대 |
| 자동 온톨로지 생성(OntoKGen 등)이 성숙하면 | 중소 제조사도 KG 기반 AI 접근 가능. 진입 장벽 대폭 하락 |

---

## 예상 밖 핵심 발견

1. **모든 시스템에서 LLM은 제어 루프 "밖"에 있다**: 가장 적극적인 Siemens조차 LLM은 보조 도구(코드 생성, 보고 자동화)이며, 직접 세트포인트를 결정하지 않는다. "AI가 공장을 제어한다"는 서사와 현실 사이의 간극이 크다.

2. **인간-AI 책임 분배가 기술 스택보다 중요**: IMUBIT의 "오퍼레이터 개입 권한 유지", Lam의 "Human-First, Computer-Last", Intel의 "엔지니어 최종 결정" — 성공적 배포의 공통 패턴은 **기술 우수성보다 인간 통제 가능성**에 있다.

3. **DTQL→LLM 전환 가능성 (미논의 경로)**: TIGNIS의 도메인 특화 쿼리 언어(DTQL)는 이미 비프로그래머가 분석을 수행할 수 있게 한다. 이를 LLM 기반 자연어 인터페이스로 확장하는 것은 기술적으로 자연스러우나, 현재 TIGNIS/Cohu는 이 방향을 공개적으로 추구하지 않고 있다.

4. **의료 AI와의 구조적 유사성**: 의료에서 도메인 특화 파운데이션 모델(Med-PaLM) + 결정론적 검증 레이어가 표준이 된 것처럼, 제조 AI도 동일한 패턴(소형 특화 모델 + 결정론적 안전 레이어)으로 수렴할 가능성이 높다.

---

## 후속 탐색 질문

1. **레이저 가공 도메인에서 이들 접근법 중 어떤 것이 적용 가능한가?** — 본 리서치 대상은 반도체/정유/이산제조 중심이며, 레이저 가공의 고유 특성(초고속 열적 변화, 광학 파라미터)에 맞는 AI 접근법은 별도 조사가 필요하다.

2. **온프레미스 LLM의 실질적 성능 저하는 어느 수준인가?** — 데이터 주권 문제를 해결하려면 온프레미스 배포가 필수인데, Llama 70B급 모델을 공장 엣지에서 운영할 때의 추론 품질/속도 트레이드오프는?

3. **기존 APC/R2R 시스템이 해결하지 못하는 구체적 문제는 무엇인가?** — LLM/KG 전환의 실익은 기존 시스템의 "미해결 문제"가 있을 때만 존재한다. 해당 문제를 구체적으로 정의하는 것이 다음 단계.

---

## 이전 리서치와의 연결

2026-03-20 리서치에서 제안한 **3-layer 하이브리드 아키텍처**(LLM 판단 + ML 수치 + KG 안전 검증)는 현재 산업계 움직임과 **방향적으로 일치**한다:

- Siemens IFM = LLM 레이어 + 기존 시뮬레이션/제어 (ML 레이어) + Industrial KG (지식 레이어)
- IMUBIT Controllable AI = LLM 지식 관리 + DLPC 수치 최적화
- Bosch Co-Intelligence = LLM 에이전트 + 기존 PLC/SCADA

**차이점**: 이전 리서치는 Closed-loop 자율 제어를 목표로 했으나, 현실에서는 모든 시스템이 Human-in-the-loop을 유지하고 있다. **완전 자율보다 "인간 감독하 자동화"가 현재의 합의점**이다.

---

## 검색 비용 보고

| 도구 | 호출 수 | 비용/크레딧 |
| --- | --- | --- |
| Perplexity search | 26회 | \~$0.28 |
| Tavily search | 14회 | 28 크레딧 |
| Tavily extract | 5회 | 5 크레딧 |
| **합계** | **45회** | **\~$0.28 + 35 크레딧** |

---

*상세 보고서*:

- `01-system-architectures.md` — 시스템별 기술 아키텍처 및 동작 방식
- `02-llm-transition-analysis.md` — LLM/온톨로지 전환 가능성 분석
- `99-critic-review.md` — Critic 검증 결과