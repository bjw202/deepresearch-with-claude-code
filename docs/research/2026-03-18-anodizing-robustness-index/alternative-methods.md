# 아노다이징 피막 강건성 평가: EIS 대안 방법론 및 복합 지수 구축 가능성

## 목차
1. [비EIS 평가법](#1-비eis-평가법)
2. [스마트폰/소비전자 산업 특화 평가](#2-스마트폰소비전자-산업-특화-평가)
3. [인라인/비파괴 검사 가능성](#3-인라인비파괴-검사-가능성)
4. [복합 강건성 지수 구축 가능성](#4-복합-강건성-지수-구축-가능성)
5. [출처](#5-출처)

---

## 1. 비EIS 평가법

### 1.1 염수분무시험 (Salt Spray Test, ASTM B117 / ISO 9227)

**원리:** 5% NaCl 용액(pH 6.5~7.2)을 35도C 환경에서 분무하여 가속 부식 환경을 조성하고, 시편의 부식 저항성을 상대적으로 평가한다.

**정량 평가 방법:**
- **시각적 등급 평가**: ISO 4628-2~5에 따라 블리스터링(blistering), 녹(rusting), 크래킹(cracking), 플레이킹(flaking)을 등급화
- **탈층(delamination) 측정**: ISO 4628-8에 따라 스크라이브 라인으로부터의 탈층 폭을 mm 단위로 정량화
- **시간 기반 등급**: 백청(white rust) 또는 적청(red rust) 발생까지의 시간(24~1,000+시간)으로 내식성 서열화
- **질량 변화**: 시험 전후 무게 변화로 부식량 정량화

**한계:** ASTM B117은 실제 환경과의 상관성이 항상 높지 않으며, 상대적 비교 도구로서의 성격이 강하다. 단독으로 절대적 내구성을 예측하기 어렵다.

**표준:** ASTM B117-19, ISO 9227 [1][2]

---

### 1.2 접착력 시험

#### Cross-cut Test (ISO 2409 / ASTM D3359)

**원리:** 피막 표면에 격자 패턴을 새긴 후 감압 접착 테이프를 붙였다 급격히 제거하여, 탈락된 피막의 양을 시각적으로 평가한다.

**등급 체계 (ASTM D3359):**
| 등급 | 설명 |
|------|------|
| 5B | 탈락 없음 |
| 4B | 5% 미만 탈락 |
| 3B | 5~15% 탈락 |
| 2B | 15~35% 탈락 |
| 1B | 35~65% 탈락 |
| 0B | 65% 초과 탈락 |

**정량화 가능성:** 이미지 분석 소프트웨어를 통해 탈락 면적비를 수치화할 수 있으며, 이를 통해 연속적인 점수 변환이 가능하다.

#### Pull-off Test (ASTM D4541 / ISO 4624)

**원리:** 돌리(dolly)를 접착제로 피막 표면에 부착한 후 수직 인장력을 가하여 파단 시 응력(MPa)을 측정한다.

**장점:** Cross-cut보다 정량적이며, MPa 단위의 연속 수치를 제공하여 통계 분석에 유리하다.

---

### 1.3 산용해 시험 (Acid Dissolution Test, ASTM B680 / ISO 3210)

**원리:** 봉공(seal) 처리된 양극산화 피막을 인산-크롬산 용액(20 g/L 크롬산 + 35 g/L 85% 정인산, 100도F)에 15분 침지한 후 질량 감소를 측정하여 봉공 품질을 평가한다.

**합격 기준:** AAMA 611-92 기준 최대 허용 질량 감소 40 mg/dm2 [3]

**특징:**
- 봉공 품질의 "골드 스탠다드"로 널리 인정됨
- 파괴 시험이므로 샘플링 기반으로 운용
- 열수 봉공과 냉간 봉공 결과를 직접 비교하기 어려움

---

### 1.4 염료 얼룩 시험 (Dye Stain Test, ASTM B136)

**원리:** 시편에 질산 용액(35% vol)을 2분 적용 후 세척, 청색 염료를 5분 적용 후 세척, 경석(pumice) 분말로 문질러 염료 잔류 여부를 관찰한다.

**판정:** 청색 염료가 잔류하면 봉공 불완전으로 판정. 정성적이나 빠르고 비용이 낮다.

**QUALANOD 인증에서의 위치:** 어드미턴스 시험, 산용해 시험과 함께 QUALANOD 봉공 품질 검사 3대 시험 중 하나 [4]

---

### 1.5 어드미턴스/임피던스 시험 (ISO 2931)

**원리:** 1,000 Hz 주파수에서 봉공된 양극산화 피막의 어드미턴스(전기적 전도도)를 측정하여 봉공 품질을 비파괴적으로 평가한다.

**측정 범위:** 3 uS ~ 200 uS

**적용 조건:**
- 최소 측정 면적: 직경 약 20mm 원
- 최소 피막 두께: 3 um 이상
- 열수 봉공과 냉간 봉공 결과 직접 비교 불가

**장점:** 비파괴, 빠른 측정, 생산 라인 루틴 검사 및 수락 시험에 적합 [5]

> 참고: ISO 2931의 어드미턴스 시험은 단일 주파수(1 kHz) 측정으로, 다주파수 스캔을 수행하는 EIS와는 정보량에서 큰 차이가 있다. 그러나 인라인 적용 가능성에서는 어드미턴스 시험이 우위에 있다.

---

### 1.6 Machu Test (산성 황산구리 시험)

**원리:** 산성화된 황산구리 용액에 양극산화 시편을 침지하여 피막의 연속성(continuity)과 내식성을 평가하는 가속 시험이다.

**관련 표준:** ISO 2085:2018 — 알루미늄 양극산화 피막의 연속성을 황산구리 시험으로 점검하는 방법을 규정. 5 um 미만의 얇은 피막이나 변형된 피막(코일 양극산화 포함)에 적용된다. [6]

**염산 스팟 테스트 변형:** 약 1N 염산에 약 10 g/L 황산구리를 용해한 산성 구리 용액을 피막 위에 적하하여, 구리 석출(적갈색 변색)의 유무와 속도로 피막 결함을 신속 판별한다.

---

### 1.7 CASS Test (Copper-Accelerated Salt Spray, ASTM B368)

**원리:** NaCl + CuCl2(이수화물) 용액을 아세트산으로 pH 3.1~3.3으로 산성화한 뒤 49도C에서 분무한다. 일반 염수분무(ASTM B117)보다 훨씬 가혹한 가속 부식 환경을 제공한다.

**용액 조성:**
- NaCl 5부 : 물 95부
- CuCl2·2H2O: 1g / 4L
- 빙초산으로 pH 3.1~3.3 조정

**적용:** 장식용 니켈-크롬 도금, 양극산화 알루미늄의 내식성 평가에 특히 적합. 충분한 양극산화 피막 두께가 보호 성능의 핵심 변수이다. [7][8]

---

### 1.8 탈이온수 침지 후 무게변화법

**원리:** 봉공 처리된 양극산화 시편을 탈이온수에 장시간 침지한 후 질량 변화(증가 또는 감소)를 측정하여 봉공의 완전성을 간접 평가한다.

**메커니즘:**
- 질량 증가: 불완전 봉공 → 다공성 잔존 → 수분 흡수
- 질량 감소: 피막 용해

산용해 시험(ASTM B680)과 유사한 원리이나, 가혹한 산 대신 순수(DI water)를 사용하여 더 온건한 조건에서 장기 안정성을 평가한다.

---

### 1.9 와전류(Eddy Current) 측정

**원리:** 고주파 교류 전류(1 MHz 이상)가 흐르는 코일로 교번 자기장을 생성하고, 전도성 기재에 유도된 와전류의 크기 변화를 통해 비전도성 피막(양극산화층)의 두께를 비파괴적으로 측정한다.

**표준:** ASTM B244-09 "Standard Test Method for Measurement of Thickness of Anodic Coatings on Aluminum and of Other Nonconductive Coatings on Nonmagnetic Basis Metals with Eddy-Current Instruments" [9]

**산업용 장비 예시:**
| 장비 | 특징 |
|------|------|
| DeFelsko PosiTector 6000 NAS | 양극산화 전용 프로브, 625 um까지 측정, 100 um 이하에서 최고 정밀도 |
| Helmut Fischer | 진폭 감응 와전류법, 비자성 금속 위 비전도 피막 측정 |

**적용 한계:**
- 곡면에서 측정 오차 발생 (오목면: 낮게, 볼록면: 높게 측정)
- 두께 정보만 제공하며, 피막의 화학적 품질(봉공 상태, 공극 구조)은 평가 불가
- 따라서 EIS와 상호 보완적 관계

**군사/항공 표준:** MIL-A-8625, ISO 7599, ISO 8078-8079, AMS 규격 [9]

---

## 2. 스마트폰/소비전자 산업 특화 평가

### 2.1 인공땀(Artificial Sweat) 시뮬레이션 테스트

**배경:** Apple 등 주요 제조사는 인공땀과 인공 귀지를 이용한 부식 시험을 수행한다. 개인별 땀 성분 차이에 의해 양극산화 알루미늄의 변색과 피팅(pitting)이 발생할 수 있다. [10]

**ISO 3160-2 인공땀 용액 조성:**
| 성분 | 농도 |
|------|------|
| NaCl | 20 g/L |
| NH4Cl | 17.5 g/L |
| 아세트산 | 5 g/L |
| d,l-젖산(lactic acid) | 15 g/L |
| pH | 4.7 (NaOH로 조정) |

**기타 관련 표준:**
- ISO 12870: 안경테 시험 표준이나, 인공땀 내식성 시험 프로토콜을 포함 (55 +/- 5도C에서 인공땀 용액 위에 시편 배치)
- ASTM G31: 금속의 부식 시험에서 인공 체액 사용 표준 [11][12]

**평가 지표:**
- 변색(discoloration) 정도: 색차계(colorimeter) dE* 값
- 피팅 밀도 및 크기: 광학현미경 + 이미지 분석
- 질량 변화: 침지 전후 무게 차이

---

### 2.2 고온고습 가속시험 (85도C / 85% RH)

**원리:** 고온고습 환경에서 수분이 피막 공극에 침투하는 속도와 그에 따른 피막 열화를 가속적으로 평가한다.

**적용:** 소비전자 제품의 장기 내구성 예측에 널리 사용. 통상 500~1,000시간 노출 후 외관, 접착력, 임피던스 변화를 측정한다.

**연구 결과:** PMC 연구에 따르면 습도 노출 1,000시간이 코팅 장벽 특성에 가장 큰 영향을 미치며, 이는 폴리에스터 코팅의 임피던스가 7.96 x 10^10 ohm·cm2에서 2.18 x 10^5 ohm·cm2로 급격히 하락하는 것으로 확인되었다. [13]

---

### 2.3 열충격 시험 (Thermal Cycling)

**원리:** 급격한 온도 변화(-40도C ~ +85도C 등)를 반복하여 열팽창 계수 차이에 의한 피막 크래킹, 탈층을 가속 평가한다.

**Apple 특허 관련:** 일반적인 Type II 봉공 양극산화 피막은 약 80도C에서 크랙이 발생할 수 있으나, Apple의 특허 기술은 150도C 이상에서도 크래킹/크레이징 없는 피막을 목표로 한다. [14]

**소비전자 표준 사이클:**
- MIL-STD-883 Method 1010: -65도C ~ +150도C
- IEC 60068-2-14: 제품 수준에 맞게 조정 가능
- 일반적 소비전자: -40도C ~ +85도C, 100~500 사이클

---

### 2.4 동남아 환경 모사 프로토콜

동남아 시장 대응을 위한 복합 시험 시퀀스 제안:

1. **고온고습** (85도C/85%RH, 500h) → 피막 수분 침투 저항성
2. **인공땀 침지** (ISO 3160-2, 55도C, 168h) → 피부 접촉 내식성
3. **열충격** (-20도C ~ +60도C, 100 사이클) → 열적 안정성
4. **염수분무** (ASTM B117, 336h) → 해안 환경 내식성

Apple의 경우 175개국 기후 환경을 모사하며, 염수 노출 시험을 100시간 이상 수행하는 것으로 알려져 있다. [10]

---

## 3. 인라인/비파괴 검사 가능성

### 3.1 제조 라인 실시간 평가 가능 방법

| 방법 | 인라인 적합성 | 측정 시간 | 정보 유형 | 비파괴 |
|------|-------------|----------|----------|--------|
| 와전류 두께 측정 | 우수 (매우 높음) | <1초 | 두께 | O |
| 어드미턴스 시험 (ISO 2931) | 양호 | 수초 | 봉공 품질 | O |
| 광학 외관 검사 (머신비전) | 우수 | <1초 | 표면 결함 | O |
| OCT (광간섭단층촬영) | 양호~우수 | 수초 | 두께 + 내부 구조 | O |
| EIS (다주파수) | 제한적 | 수분~수십분 | 전기화학적 특성 종합 | O |
| 염료 얼룩 시험 | 불가 | 수분 | 봉공 상태 | X (반파괴) |
| 산용해 시험 | 불가 | 15분+ | 봉공 품질 정량 | X (파괴) |

### 3.2 EIS의 인라인 적용 가능성과 한계

**가능성:**
- SIVONIC 등의 제조사가 산업용 EIS 장비를 공급하며, 온라인 모니터링 기능으로 실시간 공정 데이터 분석 가능 [15]
- 배터리 제조 라인에서는 이미 인라인 EIS가 품질 관리에 사용됨
- 측정 채널의 유연한 확장이 가능

**한계:**
- **측정 시간**: 저주파 영역(0.01 Hz 이하)까지 스캔 시 수십 분 소요 → 생산 택트(tact time)에 부합하기 어려움
- **전해질 접촉 필요**: 습식 측정 셀이 필요하여 자동화 및 건식 라인 통합이 복잡
- **시편 크기/형상 제약**: 다양한 제품 형상에 대한 셀 설계 난이도 높음

**실용적 타협안:**
- 고주파 영역(1 kHz ~ 100 kHz)만 스캔하는 "Fast EIS" → 수십 초 이내 측정 가능
- 어드미턴스 시험(ISO 2931)을 EIS의 단순화 버전으로 활용
- 오프라인 전수 EIS + 인라인 와전류/어드미턴스 조합

### 3.3 광간섭단층촬영 (OCT)

**원리:** 저간섭 광원을 이용하여 피막의 단면 이미지를 비접촉, 비파괴로 실시간 획득한다.

**장점:**
- 마이크로미터 수준의 축 분해능
- 축 분해능과 횡 분해능이 독립적(디커플링)되어, 렌즈를 시편에서 멀리 배치해도 축 분해능 유지 가능
- 화학적 교정 없이 직접 두께 측정 가능
- 인라인 PAT(Process Analytical Technology) 방법으로 적용 사례 증가 [16][17]

**양극산화에의 적용 가능성:**
- 피막 두께 및 내부 층 구조(barrier layer / porous layer) 구분 가능성
- 봉공 전후 공극 구조 변화 관찰 가능성 (연구 단계)

**한계:** 양극산화 피막은 반투명~불투명하여 광 침투 깊이에 제약이 있을 수 있으며, 이에 대한 구체적 연구는 아직 제한적이다.

### 3.4 와전류 검사 (인라인)

와전류 기반 검사는 **비접촉, 초고속**(수 ms 이내) 측정이 가능하여 인라인 적합성이 가장 높다. 와이어, 바, 튜브, 프로파일 등 반제품의 100% 전수 검사에 이미 산업적으로 활용되고 있다. [18]

양극산화 라인에의 통합 시나리오:
- 양극산화 후 즉시 두께 측정 → 공정 파라미터 피드백 제어
- 봉공 후 어드미턴스 측정과 병행하여 두께+봉공 품질 동시 관리

---

## 4. 복합 강건성 지수 구축 가능성

### 4.1 프레임워크 개요

EIS와 물리적 시험 결과를 결합하여 단일 "강건성 지수(Robustness Index, RI)"를 구축하는 것은 개념적으로 타당하며, 유사한 선행 연구가 존재한다.

**기본 구조:**

```
RI = Σ(wi × Si)
```

여기서:
- `wi` = i번째 평가 항목의 가중치 (Σwi = 1)
- `Si` = i번째 평가 항목의 정규화 점수 (0~1)

### 4.2 후보 평가 항목 및 정규화

| 항목 | 시험법 | 원시 지표 | 정규화 방법 |
|------|--------|----------|------------|
| 전기화학적 장벽성 | EIS (|Z| at 0.1 Hz) | ohm·cm2 | log 변환 후 min-max 정규화 |
| 봉공 품질 | 산용해 (ASTM B680) | mg/dm2 | 역변환 (낮을수록 좋으므로) |
| 봉공 품질 (비파괴) | 어드미턴스 (ISO 2931) | uS | 역변환 |
| 피막 두께 | 와전류 (ASTM B244) | um | 목표값 대비 편차 |
| 접착력 | Pull-off (ASTM D4541) | MPa | min-max 정규화 |
| 가속 부식 저항 | 염수분무 (ASTM B117) | 시간 (백청 발생) | min-max 정규화 |
| 가속 부식 저항 (가혹) | CASS (ASTM B368) | 등급/시간 | min-max 정규화 |
| 환경 내구성 | 고온고습 (85/85) | dE* 또는 임피던스 변화율 | 역변환 |

### 4.3 가중치 결정 방법

#### (a) AHP (Analytic Hierarchy Process)

**원리:** 전문가 패널이 평가 항목 쌍별로 상대적 중요도를 비교하여 고유벡터(eigenvector)로 가중치를 도출한다. [19][20]

**장점:**
- 전문가 지식을 체계적으로 반영
- 일관성 검증(Consistency Ratio) 내장
- 코팅 분야에서 이미 적용 사례 있음 (에폭시 코팅 실패 모드 AHP 평가)

**코팅 적용 사례:** 에폭시 코팅에서 5가지 실패 모드(두께 변화, 접착 강도, 블리스터, 크랙, 탈층)를 ISO/ASTM 기준으로 등급화하고, AHP로 가중치를 도출하여 종합 평가 모델을 구축한 연구가 있다. 결과적으로 종합 평가값과 EIS 임피던스 간에 상관관계가 확인되었다. [21]

#### (b) 데이터 기반 가중치 (회귀/상관 분석)

**원리:** 다수의 양극산화 시편에 대해 모든 시험을 수행하고, 실제 필드 성능(field performance)과의 상관성이 높은 항목에 높은 가중치를 부여한다.

**방법:**
- 다중 선형 회귀: 필드 고장률 = f(EIS, 두께, 접착력, ...)
- PCA(주성분 분석): 분산 기여도에 따른 자동 가중
- Random Forest feature importance

**전제 조건:** 충분한 양의 시험-필드 매칭 데이터 필요 (최소 50~100 배치)

#### (c) 동일 가중 (Equal Weighting) + 전문가 조정

초기 도입 단계에서 데이터가 부족할 때의 실용적 대안. 모든 항목에 동일 가중치를 부여하되, 치명적 실패 모드(예: 피막 탈락)에 최소 기준(threshold)을 설정한다.

### 4.4 제조 현장 실용 설계 원칙

**원칙 1: 계층적 구조 (Tiered Approach)**

```
Tier 1 (인라인 전수검사):
  - 와전류 두께: 매 부품
  - 어드미턴스: 매 N번째 부품 (샘플링)
  → 즉시 Pass/Fail 판정

Tier 2 (오프라인 로트 검사):
  - EIS (전주파수 스캔): 로트당 3~5개
  - Cross-cut 접착력: 로트당 2~3개
  - 산용해 시험: 로트당 1~2개
  → RI 산출 및 트렌드 모니터링

Tier 3 (정기 검증):
  - 염수분무 / CASS: 월 1회
  - 인공땀 침지: 분기 1회
  - 고온고습 + 열충격: 분기 1회
  → 가속수명 상관관계 업데이트
```

**원칙 2: 최소 기준 + 종합 점수 병행**

단일 항목이 최소 기준(threshold)을 미달하면 RI 값에 관계없이 불합격 처리한다. 예:

| 항목 | 최소 기준 |
|------|----------|
| 피막 두께 | 사양 하한 -10% 이내 |
| 어드미턴스 | < 20 uS (QUALANOD 기준) |
| Cross-cut | 4B 이상 |
| 산용해 질량 감소 | < 40 mg/dm2 |

최소 기준 통과 시에만 RI를 산출하고 공정 개선 지표로 활용한다.

**원칙 3: 이동 평균 기반 SPC**

RI를 개별 부품이 아닌 로트/배치 단위로 산출하고, 관리도(control chart)에 표시하여 공정 이상(drift)을 조기 감지한다.

**원칙 4: 환경별 가중치 프로파일**

제품 사용 환경에 따라 가중치 세트를 다르게 적용한다:

| 프로파일 | 높은 가중치 항목 | 용도 |
|---------|----------------|------|
| 열대기후 | 인공땀, 고온고습, CASS | 동남아 시장 |
| 해양/산업 | 염수분무, EIS 장벽성 | 해안 도시, 산업 환경 |
| 일반 | 접착력, 외관, 두께 균일성 | 온대 기후 실내 사용 |

### 4.5 선행 연구와 프레임워크 갭

PMC에 게재된 갈바닉 강판 파우더 코팅 연구에서는 EN 13438, Qualisteelcoat, GSB-ST 세 가지 품질 표준이 각각 다른 시험 조합과 기간을 요구하여, **표준 간 상당한 괴리**가 존재함을 보여주었다. EIS 성능이 우수해도 특정 표준의 물리적 시험 기준을 충족하지 못할 수 있으며, 이는 복합 지수가 단일 표준 준수보다 더 종합적인 품질 판단을 제공할 수 있는 근거가 된다. [13]

다만, 양극산화 피막에 특화된 복합 지수 연구는 아직 체계적으로 발표된 것이 드물어, 산업 현장에서의 실증이 선결 과제이다.

---

## 5. 출처

[1] ASTM B117-19, "Standard Practice for Operating Salt Spray (Fog) Apparatus" — https://store.astm.org/b0117-19.html

[2] Salt Spray Test Standard (ASTM B117 & ISO 9227) — https://www.ipqcco.com/blog/salt-spray-test-standard-astm-b117-iso-9227-procedure-chamber-hours-acceptance-criteria-corrosion-test-method

[3] ASTM B680, "Standard Test Method for Seal Quality of Anodic Coatings on Aluminum by Acid Dissolution" — https://store.astm.org/b0680-80r00.html

[4] QUALANOD, Synopsis of ISO standards for anodizing — https://www.qualanod.net/synopsis-of-iso-standards-for-qualanod-specifications.html

[5] ISO 2931:2017, "Anodizing of aluminium and its alloys — Assessment of quality of sealed anodic oxidation coatings by measurement of admittance" — https://www.iso.org/standard/70155.html

[6] ISO 2085:2018, "Anodizing of aluminium and its alloys — Check for continuity of thin anodic oxidation coatings — Copper sulfate test" — https://www.iso.org/standard/72171.html

[7] ASTM B368, "Standard Test Method for Copper-Accelerated Acetic Acid-Salt Spray (Fog) Testing (CASS Test)" — https://store.astm.org/b0368-21.html

[8] Corrosionpedia, "Copper Accelerated Salt Spray Test (CASS Test)" — https://www.corrosionpedia.com/definition/326/copper-accelerated-salt-spray-test-cass-test

[9] DeFelsko, "Measuring Anodizing Thickness on Aluminum" — https://www.defelsko.com/resources/anodizing-thickness-measurement-on-aluminum

[10] 9to5Mac, "A rare look inside the durability lab where Apple tortures its products" — https://9to5mac.com/2025/07/04/a-rare-look-inside-the-durability-lab-where-apple-tortures-its-products/

[11] ISO 3160-2, Artificial Sweat composition — https://www.reagents.com/2381567/Product/Artificial-Sweat-ISO-3160-2

[12] Pickering Test Solutions, "Artificial Perspiration" — https://www.pickeringtestsolutions.com/artificial-perspiration/

[13] PMC, "Accelerated Corrosion Tests in Quality Labels for Powder Coatings on Galvanized Steel" — https://pmc.ncbi.nlm.nih.gov/articles/PMC8585214/

[14] Finishing & Coating, "Apple Patent Application Shows Anodized Coating with High-Temp Tolerance" — https://finishingandcoating.com/index.php/anodizingcat/2101-apple-patent-application-shows-anodized-coating-with-high-temp-tolerance

[15] SIVONIC, "The EIS meter — Precise impedance spectroscopy for research and industry" — https://www.sivonic.com/en/products/eis-meter/

[16] SPIE/Science, "The Progress of Optical Coherence Tomography in Industry Applications" — https://spj.science.org/doi/10.34133/adi.0053

[17] Wiley, "Optical Coherence Tomography for High-Precision Industrial Inspection in Industry 4.0" — https://onlinelibrary.wiley.com/doi/10.1002/lpor.202502290

[18] PMC, "Non-Destructive Techniques Based on Eddy Current Testing" — https://pmc.ncbi.nlm.nih.gov/articles/PMC3231639/

[19] Wikipedia, "Analytic Hierarchy Process" — https://en.wikipedia.org/wiki/Analytic_hierarchy_process

[20] ScienceDirect, "Risk assessment of the corrosion resistance performances for epoxy coatings under drilling environments using AHP method" — https://www.sciencedirect.com/science/article/abs/pii/S0308016121001654

[21] PMC, "Coating matching recommendation based on improved fuzzy comprehensive evaluation and collaborative filtering algorithm" — https://pmc.ncbi.nlm.nih.gov/articles/PMC8263793/
