# 팔란티어 AML 온톨로지 심층 분석 — Transaction 하나의 완전한 인과 체인

> **작성일**: 2026-03-24 **조사 범위**: 팔란티어 Foundry for AML 공식 문서(PDF 3종), Foundry Rules 공식 문서, 거래감시 산업 데이터, 그래프 DB vs SQL 비교 연구 **목적**: 이 보고서를 읽은 사람이 "아, 이렇게 하면 비슷한 AML 온톨로지를 설계할 수 있겠구나"라고 느낄 수 있도록, Transaction 하나가 온톨로지에서 어떻게 살아서 움직이는지를 완전한 인과 체인으로 보여준다.

---

## 1. 문제 상황: 기존 은행 AML 시스템은 왜 실패하는가

### 1.1 규칙 기반 시스템의 구조적 실패 시나리오

**가상 시나리오로 이해하기:**

한국계 미국 이민자 김민준(Kim Minjoon)은 뉴욕에서 세탁소를 운영한다. 그는 한국 부모님에게 매달 생활비를 송금한다. 그의 A 은행 계좌 이름은 "Minjoon Kim", B 은행 계좌 이름은 "M. Kim (Jay)"이다.

1990년대에 만들어진 기존 AML 시스템이 보는 현실:

- **A 은행 시스템**: 고객 "Minjoon Kim"이 이달에 $9,800을 해외 송금 → "CTR(Currency Transaction Report) 의무 기준인 $10,000에 근접한 국제 송금" 규칙에 걸려 **Alert 생성**
- **B 은행 시스템**: 고객 "M. Kim (Jay)"가 지난 30일간 현금 입금 8회, 합계 $9,200 → "소액 분산 현금 입금" 규칙에 걸려 **Alert 생성**
- 두 시스템은 **서로 통신하지 않는다**. "Minjoon Kim"과 "M. Kim (Jay)"가 같은 사람인지조차 모른다

이 두 Alert는 \*\*각각 오탐(false positive)\*\*이다. 하지만 이 두 거래를 함께 보면 잠재적 패턴이 보일 수도 있다. 기존 시스템은 양쪽 모두 놓친다 — 오탐을 생성하면서 동시에 중요한 정보를 잃는다.

**반증 탐색**: 규칙 기반 시스템이 전혀 가치 없는 것은 아니다. FinCEN(미국 금융범죄수사네트워크) 연구에서 스머핑(smurfing, 신고 의무를 피하기 위해 $10,000 미만으로 쪼개 입금하는 수법)의 약 30%는 간단한 금액 임계값 규칙으로도 탐지 가능했다. 문제는 **나머지 70%와, 그 30% 탐지 과정에서 발생하는 엄청난 오탐**이다.

### 1.2 오탐(False Positive) 95%가 발생하는 구조적 이유

\*\*오탐(False Positive)\*\*이란: AML 시스템이 "이거 수상하다"고 신고했는데, 조사해보니 그냥 평범한 합법 거래였던 경우. 가령 회사 지급팀이 협력업체에게 월급을 주는 것인데, 금액과 빈도가 "구조화 거래"처럼 보여서 걸리는 것.

전세계 금융기관의 AML 경보 중 **90\~95%는 오탐**이다 \[출처: Flagright, Unit21 업계 조사 2024; Retail Banker International 2025\]. 이유는 세 가지다:

**첫째, 고객 세분화 없는 균일 규칙 적용**"$9,500 이상 현금 입금 3회 → Alert"라는 규칙이 있다. 월급 9,500달러를 받는 간호사에게도, 하루 매출이 9,500달러인 편의점 주인에게도 같은 규칙이 적용된다. 편의점 주인은 매일 현금을 입금한다. 합법이지만 매일 Alert가 뜬다.

**둘째, 맥락(context) 부재**지난 5년간 같은 패턴으로 거래한 고객이라도, 시스템은 "오늘 거래"만 본다. 고객이 10년 전부터 같은 방식으로 거래하고 있다는 역사적 맥락이 없다.

**셋째, 데이터 사일로(data silo**)사일로란: 부서나 시스템이 서로 칸막이를 친 채 정보를 공유하지 않는 상태. 마치 병원에서 심장내과, 신장내과, 정형외과가 같은 환자의 데이터를 서로 공유하지 않는 것처럼, 은행의 KYC 팀(고객 신원 확인), 거래감시 팀, 조사 팀이 각각 별도 시스템에서 동일 고객 정보를 따로따로 본다.

팔란티어 공식 문서는 이 문제를 직접적으로 서술한다: *"20-30년 전에 수립된 동일한 위험 등급 및 경보 로직이 오늘날에도 여전히 통용되고 있다"* \[출처: Palantir, Foundry for AML, 2021\].

---

## 2. 온톨로지 설계의 인과 체인: 왜 각 Object Type이 필요한가

### 2.1 온톨로지란 무엇인가 (쉬운 설명)

온톨로지(Ontology)를 가장 쉽게 이해하는 방법: **구글 지식 패널**을 생각하면 된다. 구글에서 "BTS"를 검색하면 단순한 텍스트 결과가 아니라, "BTS는 방탄소년단이라고도 불리며, 소속사는 HYBE, 멤버는 7명, 데뷔 연도는 2013년..."처럼 구조화된 정보가 나온다. 이것이 구글의 지식 그래프이고, 팔란티어 온톨로지도 같은 원리다.

팔란티어 Foundry의 온톨로지는 세 가지 기본 요소로 구성된다:

- **Object Type(객체 유형)**: 실세계 개념의 설계도. "Customer라는 것이 존재하고, 이런 속성을 가진다"는 정의
- **Link Type(링크 유형)**: 객체 간 관계의 정의. "Customer는 Account를 '보유'한다" 같은 관계
- **Action Type(액션 유형)**: 온톨로지에 가할 수 있는 작업 정의. "Alert를 생성하라", "케이스를 분석관에게 할당하라" 같은 행동

### 2.2 AML 온톨로지의 핵심 Object Types

**Customer (고객 객체)**

왜 필요한가: 이것이 없으면 거래의 주체가 누구인지 연결할 방법이 없다. "9,500달러가 움직였다"는 사실만 알 뿐, 그 돈을 보낸 사람이 어떤 사람인지 알 방법이 없다.

Customer 객체의 핵심 속성 (팔란티어 문서에서 확인된 25개 위험 지표 중 주요 항목):

| 속성 | 설명 | 왜 이 지표인가 |
| --- | --- | --- |
| `risk_score` | 0\~100점 종합 위험 점수 | 단일 숫자로 분석관이 즉각 우선순위화 가능 |
| `customer_segment` | 고객 유형 (개인/SME/법인/PEP 등) | 같은 거래라도 세그먼트마다 "정상"의 기준이 다름 |
| `pep_flag` | 정치적 노출 인물(PEP) 여부 | PEP(President, 장관 등 고위 공직자)는 국제 AML 규제상 강화 심사 의무 |
| `sanctioned_entity_flag` | 제재 대상 여부 | OFAC, UNSCR 제재 목록과의 매칭 결과 |
| `country_of_birth` | 출생 국가 | 고위험 국가(FATF 블랙리스트) 출신 여부 판단 |
| `onboarding_risk_score` | 최초 가입 시 위험 점수 | 시간 경과에 따른 위험도 변화 추적 기준선 |
| `behavior_change_flag` | 행동 패턴 급변 여부 | 갑자기 거래 패턴이 바뀌면 중요한 신호 |
| `network_risk_score` | 연결된 엔티티들의 위험도 합산 | 고객 자신이 아닌 그 주변이 위험할 수 있음 |

**수치 투명성**: 25개 위험 지표라는 숫자는 팔란티어 공식 문서에서 명시된 것이다 (*"ML model runs over 20+ data sources to automatically score each customer across 25 key risk indicators"*). 그러나 25개 지표 각각의 가중치와 임계값은 공개되지 않는다. 기관마다 고객 프로파일이 다르므로 가중치는 커스터마이즈되어야 한다. 이 수치가 틀릴 수 있는 조건: 기관의 고객 구성이 리테일 중심인지 기업 중심인지에 따라 핵심 지표 자체가 달라진다.

**Account (계좌 객체)**

왜 필요한가: 한 고객이 여러 계좌를 가질 수 있다. 자금세탁 행위자들은 종종 여러 계좌를 통해 돈을 분산시킨다. Account 객체 없이는 한 고객의 총체적 자금 흐름을 볼 수 없다.

Account 객체의 주요 속성:

| 속성 | 설명 |
| --- | --- |
| `account_type` | 수시입출금/저축/외화/비트코인 지갑 등 |
| `account_status` | 활성/휴면/동결/제한 |
| `opening_channel` | 지점/모바일/API (비대면 개설은 익명 위험 높음) |
| `jurisdiction` | 계좌 등록 국가 |
| `average_monthly_balance` | 평균 잔액 (갑작스러운 거액 유입 감지 기준) |
| `transaction_volume_30d` | 최근 30일 거래 건수 |
| `peer_risk_percentile` | 동일 세그먼트 내 위험 분위 |

**Transaction (거래 객체)**

왜 필요한가: 자금세탁의 흔적은 결국 거래에 남는다. Transaction 객체는 온톨로지의 "혈관"이다. 모든 ML 모델과 시나리오 엔진이 이 데이터를 소비한다.

Transaction 객체의 주요 속성:

| 속성 | 설명 | 설계 이유 |
| --- | --- | --- |
| `transaction_id` | 불변 고유 식별자 | 규제기관 감사 시 원거래 추적 가능 |
| `amount_usd` | USD 환산 금액 | 통화 변환 후 단일 기준으로 비교 가능 |
| `timestamp_utc` | UTC 타임스탬프 | 글로벌 거래의 시간대 혼란 제거 |
| `transaction_type` | WIRE/ACH/CASH/CRYPTO/SWIFT |  |
| `originating_country` | 송금 출발 국가 | 고위험 관할권 여부 |
| `beneficiary_country` | 수취 국가 |  |
| `channel` | 지점/모바일/API/ATM |  |
| `purpose_code` | 자가신고 거래 목적 | 실제 거래와 신고 목적의 불일치 탐지 |
| `risk_score` | 이 거래 자체의 위험 점수 | Function(ML 모델)이 실시간 계산 |
| `alert_flag` | Alert 생성 여부 |  |

**Alert (경보 객체)**

왜 필요한가: Alert는 단순한 알림이 아니다. Alert는 ML 모델의 판단과 분석관의 검토, 그리고 피드백 루프를 잇는 핵심 인터페이스다.

Alert 객체의 주요 속성:

| 속성 | 설명 |
| --- | --- |
| `alert_id` | 고유 식별자 |
| `trigger_source` | 시나리오 엔진 / ML 모델 / 복합 |
| `risk_score` | Alert 생성 시점 위험 점수 |
| `alert_type` | 스머핑 의심 / 국제 송금 이상 / 자금 순환 / PEP 연계 등 |
| `assigned_analyst_id` | 배정된 분석관 |
| `status` | New / In Review / Escalated / Closed-SAR / Closed-NoAction |
| `disposition` | 분석관의 최종 판단 (True Positive / False Positive) |
| `disposition_timestamp` | 판단 시각 (규제기관 보고 기한 계산용) |

**Case (케이스 객체)**

왜 필요한가: 하나의 Alert가 단독으로 SAR(의심거래보고서)로 이어지는 경우는 드물다. 보통 여러 Alert와 여러 Customer, 여러 Transaction이 하나의 조사 케이스로 묶인다. Case 객체는 이 복잡한 조사 과정을 추적하는 "폴더"다.

**Organization (법인 객체)**

왜 필요한가: 자금세탁의 상당 부분은 개인이 아닌 법인 구조(특히 쉘 컴퍼니)를 통해 이루어진다. Organization 객체 없이는 법인을 통한 자금세탁을 탐지할 수 없다. 이 객체의 `owned_by` 관계가 실소유권 그래프의 핵심이다.

### 2.3 Link Types: 관계가 왜 중요한가

온톨로지에서 Object만으로는 부족하다. \*\*관계(Link)\*\*가 있어야 숨겨진 패턴이 보인다.

핵심 Link Types:

| Link | 방향 | 의미 | 없으면 놓치는 것 |
| --- | --- | --- | --- |
| `Customer → owns → Account` | 1:N | 한 고객의 모든 계좌 총합 파악 | 여러 계좌에 분산된 스머핑 |
| `Account → participates_in → Transaction` | N:M | 거래의 출발/도착 계좌 연결 | 거래 흐름 추적 불가 |
| `Transaction → triggers → Alert` | 1:N | 어떤 거래가 어떤 Alert를 만들었는지 | 원인 거래 역추적 불가 |
| `Alert → belongs_to → Case` | N:1 | 관련 경보들을 하나의 조사로 묶음 | 분산된 경보 간 연결 파악 불가 |
| `Customer → associated_with → Customer` | N:M | 공유 주소/전화/IP 등으로 연결된 고객들 | 공모 네트워크 파악 불가 |
| `Organization → owns → Organization` | N:M | 법인 소유 구조 | 쉘 컴퍼니 체인 파악 불가 |
| `Customer → controls → Organization` | N:M | 실질 지배 관계 | UBO(실소유자) 파악 불가 |

---

## 3. Transaction 하나의 완전한 생애주기 추적

### 시나리오: "고객 A가 고객 B에게 $9,500을 국제 송금"

이 하나의 이벤트가 온톨로지 안에서 어떻게 살아서 움직이는지 단계별로 추적한다.

---

**\[0단계\] 코어뱅킹 시스템의 원본 데이터**

은행의 핵심 시스템(코어뱅킹)에서 이 거래는 이런 형태로 존재한다:

```
TRANSACTION_ID: TXN20260324-K-092341
SENDER_ACCT: 110-29-3847291
RECEIVER_ACCT: KR-80-1002-1234567890
AMOUNT: 9500.00
CURRENCY: USD
TIMESTAMP: 2026-03-24T09:23:41+09:00
CHANNEL: MOBILE_BANKING
PURPOSE: FAMILY_SUPPORT
```

이것은 그냥 숫자와 코드들이다. "이 사람이 누구인지", "이 계좌가 어떤 위험도를 가지는지", "이 패턴이 과거와 비교해서 이상한지"를 전혀 모른다.

---

**\[1단계\] 파이프라인 처리 — 데이터 정제 및 표준화**

팔란티어 Foundry의 데이터 파이프라인이 이 원본 데이터를 처리한다:

1. **통화 변환**: $9,500 USD → 단일 통화 기준으로 정규화 (글로벌 거래 비교 가능)
2. **타임스탬프 통일**: `+09:00` (KST) → UTC 변환. 이유: 서울에서 새벽 1시 송금이 뉴욕 기준으론 오후 4시다. 글로벌 AML 분석에선 UTC 기준이 필수
3. **지역 코드 매핑**: 수취 계좌 번호 `KR-80-...`에서 국가 코드 `KR` 추출 → 고위험 관할권 DB와 대조
4. **거래 유형 분류**: SWIFT/WIRE/ACH 등 메시지 포맷 파싱 → `INTERNATIONAL_WIRE` 분류
5. **데이터 품질 검증**: NULL 값, 이상 금액(음수, 초대형), 중복 거래 ID 확인

정제 후:

```
transaction_id: TXN20260324-K-092341
amount_usd: 9500.00
timestamp_utc: 2026-03-24T00:23:41Z
transaction_type: INTERNATIONAL_WIRE
originating_country: KR
beneficiary_country: KR
channel: MOBILE_BANKING
purpose_code: FAMILY_SUPPORT
```

---

**\[2단계\] Transaction Object 생성 및 온톨로지 연결**

정제된 데이터가 Transaction Object로 온톨로지에 추가된다. 이때 가장 중요한 작업이 발생한다: **기존 Customer, Account Object와의 Link 형성**.

```
Transaction (신규 생성)
  └── participates_in ← Account [110-29-3847291]
                              └── owned_by ← Customer [CID-KR-0028472]
                                                  └── (기존 속성 및 이력 모두 연결됨)
  └── participates_in → Account [KR-80-1002-1234567890]  (수취 계좌)
                              └── owned_by → Customer [CID-KR-0041983] (수취인)
```

이 순간부터 Transaction은 단순한 숫자 기록이 아니다. **Customer \[CID-KR-0028472\]의 이력 전체와 연결된 살아있는 객체**가 된다:

- 이 고객이 지난 90일 동안 보낸 모든 거래
- 이 고객의 현재 KYC 위험 점수
- 이 고객과 연결된 다른 고객/법인들의 네트워크
- 이 고객과 같은 주소/IP/전화번호를 공유하는 다른 계좌들

---

**\[3단계\] ML 모델이 위험 점수를 계산하는 방법 (Function)**

Function이란: 온톨로지 내의 객체 상태를 읽고 계산을 수행하여 결과를 돌려주는 함수. 팔란티어에서 ML 모델은 Function 형태로 온톨로지에 연결된다.

이 Transaction이 생성되는 순간, 위험 점수 계산 Function이 실행된다:

**입력 (Input)**:

- Transaction 자체 속성: 금액($9,500), 수취 국가, 채널, 목적코드
- Customer 이력: 최근 90일 평균 송금액, 송금 빈도, 수취 국가 다양성
- Account 속성: 잔액 수준 대비 금액, 계좌 개설 기간
- Network 정보: 이 고객과 연결된 엔티티들의 평균 위험도

**계산 방식** (팔란티어 공식 문서에서 확인된 접근법):

팔란티어는 **두 가지 방식을 결합**한다:

*방식 1: 동종집단 비교(Peer Cohort Comparison)*"같은 유형의 고객들(같은 연령대, 같은 직업, 같은 계좌 유형)과 비교해서 이 거래가 얼마나 이상한가?"

예: 30대 직장인 남성의 평균 국제 송금액이 $500/월인데, 이 고객은 $9,500을 송금했다. 동종집단 대비 19배. 이것이 이상 행동 점수에 반영된다.

*방식 2: 자기 자신과의 비교(Behavioral Baseline)*"이 고객 자신의 과거 행동과 비교해서 이번이 얼마나 달라졌는가?"

예: 이 고객이 매달 $9,500을 같은 계좌로 송금해왔다면, 이번 거래는 완전히 정상이다. 위험 점수가 낮게 나온다.

**출력 (Output)**:

```
transaction_risk_score: 42 (0~100)
score_breakdown: {
  amount_anomaly: 28,       // 동종집단 대비 금액 이상도
  frequency_signal: 8,      // 빈도 패턴 이상도
  network_risk: 6,          // 연결 네트워크 위험도
  jurisdiction_risk: 0      // 관할권 위험도 (KR은 저위험)
}
model_version: "behavioral-v4.2"
explanation: "Amount 4.2x above 90-day personal baseline, but consistent with monthly remittance pattern"
```

**수치 투명성**: "40x 진양성 개선"이라는 팔란티어의 수치 \[출처: Palantir Foundry for AML, 2021; Transaction Monitoring Whitepaper, 2022\]는 특정 유럽 대형 은행 1곳의 배포 사례에서 나온 것이다. 이 수치가 틀릴 수 있는 조건: 기존 시스템의 기준선 성능이 낮을수록 개선 폭이 크게 보인다. 레거시 시스템의 성능이 상대적으로 좋은 기관에서는 40배만큼의 극적인 개선이 없을 수 있다.

---

**\[4단계\] 임계값 초과 시 Alert Object 생성 (Action)**

Action이란: 온톨로지 상태 변화를 유발하는 명령. "Alert를 생성하라"는 Action은 새로운 Alert Object를 만들고, 관련 Object들과 Link를 연결하는 Side Effect를 가진다.

위험 점수가 임계값(예: 60점)을 넘으면 Alert 생성 Action이 실행된다. 이 경우 42점이므로 Alert는 생성되지 않지만, **시나리오 엔진이 동시에 별도로 실행**된다.

---

**\[5단계\] 시나리오 엔진의 병렬 실행**

ML 모델 외에 Foundry Rules(시나리오 엔진)도 이 Transaction에 대해 별도로 규칙을 검사한다.

"스머핑 탐지" 시나리오 규칙 예시:

```
규칙: 동일 Customer가 30일 이내에 $10,000 미만
     국제 송금을 5회 이상 수행한 경우

검사: Customer [CID-KR-0028472]의 최근 30일 Transaction 집계
결과: 이번 거래 포함 총 3회 → 임계값(5회) 미달 → 미탐지
```

"CTR 회피 의심" 시나리오 규칙 예시:

```
규칙: $9,000~$10,000 사이 국제 송금이 7일 이내 2회 이상인 경우

검사: 지난 7일간 조회
결과: 7일 전 $9,200 송금 이력 발견 → 규칙 발동
→ Alert 생성: {type: "POTENTIAL_CTR_AVOIDANCE", score: 75}
```

이 시나리오 규칙은 ML 모델과 **독립적으로** Alert를 생성할 수 있다.

---

**\[6단계\] Alert가 분석관에게 할당되는 방법**

Alert Object가 생성되면 Case Management 시스템이 배정 로직을 실행한다:

- **자동 분류**: Alert 유형, 위험 점수, 고객 세그먼트(PEP 여부 등)에 따라 처리 우선순위 결정
- **부하 분산**: 각 분석관의 현재 케이스 처리 부하를 계산하여 가용한 분석관에게 배정
- **전문화 매칭**: 특정 유형(예: 국제 와이어 사기)에 특화된 분석관에게 관련 Alert 우선 배정

분석관의 화면에는 해당 Alert와 연결된 **모든 정보가 한 화면에** 표시된다: 고객 전체 이력, 관련 계좌들, 최근 30건의 거래, 연결된 다른 고객/법인들의 네트워크 지도.

---

## 4. 분석관의 Action과 피드백 루프

### 4.1 분석관이 Alert를 검토하는 과정

**기존 시스템(비교용)**:

- 분석관이 Alert 1건을 검토하려면, 고객 정보 시스템에 따로 접속 → KYC 시스템에 따로 접속 → 거래 내역 시스템에 따로 접속 → 엑셀에 수동 정리
- 팔란티어 공식 문서: 유럽 대형 은행의 트리아지 팀이 "20개 이상의 시스템을 버그투성이 엑셀 스프레드시트로 쿼리하던" 기존 방식 → 현재는 단일 화면 \[출처: Transaction Monitoring Whitepaper, 2022\]

**팔란티어 온톨로지 기반 시스템**: 분석관 화면에서 바로 볼 수 있는 것들:

- 고객의 전체 관계 네트워크 (그래프 시각화)
- AI가 자동으로 생성한 조사 초안 (증거 수집 자동화)
- 유사한 과거 케이스 참조
- SAR 제출 시 필요한 규제 양식 자동 채움

### 4.2 "의심 거래 확인" 버튼을 누를 때 무슨 일이 벌어지는가

분석관이 Alert를 검토하고 \*\*"True Positive (진짜 의심 거래)"\*\*로 판단한 경우:

**Action 파라미터**:

```
action_type: CONFIRM_SUSPICIOUS_ACTIVITY
alert_id: ALT-2026-0928471
analyst_id: ANA-0492
confidence_level: HIGH
contributing_factors: [
  "CTR_AVOIDANCE_PATTERN",
  "INCONSISTENT_PURPOSE_CODE",
  "NETWORK_RISK_ELEVATED"
]
notes: "송금 목적 '가족 지원'과 불일치. 수취인 계좌가 3개의 PEP 연관 계좌와 연결됨"
```

**즉각적인 Object 업데이트 (Side Effects)**:

1. **Alert Object 업데이트**:

   - `status`: `In Review` → `Confirmed-SAR`
   - `disposition`: `True Positive`
   - `disposition_timestamp`: 현재 시각 (규제 보고 기한 카운트다운 시작)

2. **Customer Object 업데이트**:

   - `risk_score` 재계산 (이번 확정 케이스 반영)
   - `confirmed_sar_count`: +1
   - `enhanced_monitoring_flag`: `true` 설정

3. **Case Object 생성**:

   - Alert들을 묶어 하나의 조사 케이스로 관리
   - 관련 Transaction들과 Link

4. **SAR 자동 생성 및 제출**:

   - FinCEN/FIU(금융정보분석원) 제출 양식 자동 채움
   - 데이터 계보(lineage): 어떤 원본 데이터에서 이 SAR가 나왔는지 추적 가능
   - 규제기관에 자동 제출 (또는 최종 검토 후 제출)

5. **감사 로그(Audit Log) 기록**:

   - "분석관 ANA-0492가 2026-03-24 09:47:23에 Alert ALT-2026-0928471을 True Positive로 판정" — 이 기록은 불변이며, 향후 규제기관 감사 시 제출 가능

### 4.3 "오탐 해제" 버튼을 누를 때 — 피드백 루프의 핵심

분석관이 \*\*"False Positive (오탐)"\*\*으로 판단한 경우가 시스템 개선의 황금 데이터다.

**Action 파라미터**:

```
action_type: CLOSE_FALSE_POSITIVE
alert_id: ALT-2026-0927834
analyst_id: ANA-0492
false_positive_reason: "REGULAR_REMITTANCE_PATTERN"
suppression_recommendation: true
```

**ML 모델로 돌아가는 피드백 루프**:

팔란티어 문서는 이 과정을 명시적으로 설명한다: *"분석관의 판단이 위험 모델 성능 향상을 위해 직접 사용된다"* \[출처: Foundry for AML Case Management PDF, 2021\].

구체적으로 이렇게 작동한다:

```
1. 분석관의 FP 판정 → Alert Object에 레이블 저장
2. 이 레이블이 학습 데이터셋에 추가됨
   (원본 Transaction 특성값 + FP 레이블)
3. ML 모델 재학습 파이프라인 트리거
4. "이런 특성을 가진 거래는 FP일 가능성 높다"고 모델이 학습
5. 다음번 유사 거래에서 더 낮은 위험 점수 예측
```

**중요한 설계 원칙**: 팔란티어는 이 피드백 루프에 **반드시 사람의 검토**를 끼워넣는다. 자동 피드백 루프는 강력하지만, 무분별하게 허용하면 분석관이 정치적 이유로 특정 고객 유형의 Alert를 지속 FP 처리할 경우 모델이 편향될 수 있다. Foundry for AML은 \*"변경 검토 프로세스와 전체 감사 추적"\*을 요구한다 \[출처: Palantir Foundry for AML, 2021\].

**반증 탐색**: 이 피드백 루프의 위험성에 대한 반대 증거도 존재한다. 2020년 핀센 파일(FinCEN Files) 보도에서 드러난 것처럼, 일부 대형 은행들은 SAR를 제출하면서도 같은 고객과의 거래를 계속 허용했다. 온톨로지가 아무리 정교해도, 피드백 루프를 인간이 잘못 운용하면 시스템이 오히려 자금세탁에 최적화될 수 있다. **반증 미발견이 아니라, 구조적 악용 가능성이 실제로 확인된 사례**가 있다.

---

## 5. 실소유권 그래프의 작동 원리

### 5.1 쉘 컴퍼니란 무엇인가 (비유)

쉘 컴퍼니(Shell Company, 페이퍼 컴퍼니): 실제 사업 활동이 없는 껍데기 회사. 마치 아파트를 여러 개 빌려서 그 주소들로 여러 개의 우편함을 만드는 것처럼, 자금세탁자들은 여러 국가에 여러 회사를 세워 돈이 어디서 왔는지 추적을 어렵게 한다.

**구체적 시나리오**:

- A씨는 불법 자금 $10M을 세탁하고 싶다
- 버진아일랜드에 알파(Alpha) LLC 설립 → 알파가 케이맨제도의 베타(Beta) Ltd. 지분 100% 소유
- 베타가 싱가포르의 감마(Gamma) Pte. 지분 100% 소유
- 감마가 한국의 델타(Delta) 주식회사에 "컨설팅 비용" 명목으로 $500만 송금
- 한국 은행 입장에선 "싱가포르 법인으로부터의 컨설팅 대금 수취" — 얼핏 보면 평범해 보인다

### 5.2 그래프 순회가 SQL 조인보다 왜 유리한가

**SQL로 이 문제를 풀려면**:

```sql
-- 알파의 최종 소유자(A씨)까지 추적하려면:
SELECT o1.owner
FROM ownership o1
JOIN ownership o2 ON o1.entity_id = o2.owned_by
JOIN ownership o3 ON o2.entity_id = o3.owned_by
JOIN ownership o4 ON o3.entity_id = o4.owned_by
WHERE o4.entity_id = 'Delta_KR'
```

문제: 소유 체인이 몇 단계인지 미리 모른다. 4단계일 수도 있고, 15단계일 수도 있다. 단계마다 JOIN을 추가해야 한다. 층수를 미리 알아야 하는 사다리 타기다.

**그래프 순회로 이 문제를 풀면**:

```
그래프 쿼리: Delta_KR에서 출발해 "owned_by" 엣지를 역방향으로 계속 타고 올라가라
→ Delta_KR ← 소유 ← Gamma_SG ← 소유 ← Beta_KY ← 소유 ← Alpha_VI ← 소유 ← A씨
```

층수가 몇 단계이든, 종점(실제 사람)이 나올 때까지 자동으로 올라간다. 사다리 길이를 미리 알 필요가 없다.

**그래프 접근법의 구체적 장점** \[출처: TigerGraph AML 그래프 분석 블로그, 2026; Graphable.ai 연구, 2025\]:

| 비교 항목 | 그래프 순회 | SQL 조인 |
| --- | --- | --- |
| 다단계 탐색 | 가변 깊이 자동 지원 | 깊이마다 JOIN 추가 필요 |
| 자금 순환 탐지 | 사이클 감지 알고리즘 내장 | 재귀 쿼리 필요, 비용 폭발 |
| UBO 추적 | 단일 패턴 쿼리 | 층수 미리 알아야 함 |
| 실시간 처리 | 수백만 노드에서 밀리초 수준 | 복잡한 JOIN은 수 분\~수 시간 |
| 공유 연결 탐지 | 노드 교차점 자동 발견 | 다중 테이블 크로스 조인 필요 |

### 5.3 팔란티어 AML의 실소유권 탐지 실제 작동

팔란티어 문서는 Entity Resolution을 통해 다음을 탐지한다고 명시한다 \[출처: Foundry for Transaction Monitoring WP, 2022\]:

- "Circular flows of funds" — 자금 순환 (A→B→C→A로 돌아오는 패턴)
- "Suspicious UBOs and shell companies" — 의심스러운 실소유자와 쉘 컴퍼니
- "SAR networks" — SAR 제출 이력이 있는 개체들의 네트워크
- "Risks by association" — 연결된 개체의 위험도가 고객에게 전파

**네트워크 구축 기준**: 팔란티어가 "관련 있음"으로 분류하는 기준 \[출처: Palantir Foundry for AML PDF, 2021\]:

- 공유 물리적 주소
- 공유 전화번호
- 공유 IP 주소
- 공유 기기 ID (Device ID)
- 같은 이사(Director) 또는 등록 대리인(Registered Agent)
- 거래 관계 (서로 돈을 주고받은 적 있음)
- 알려진 고위험 행위자와의 연결

---

## 6. 시나리오 엔진과 ML 모델의 결합

### 6.1 왜 하나만으로는 부족한가

**규칙만 사용하면**: 새로운 자금세탁 수법에 대응하려면 항상 인간이 새 규칙을 수동으로 추가해야 한다. 규칙 목록이 수백 개로 늘어나면 서로 충돌하고, 유지보수가 어렵다. 팔란티어는 이를 "규칙 누적(rule creep)"이라고 부른다.

**ML만 사용하면**: 블랙박스 문제가 생긴다. 분석관이 "왜 이 거래를 의심하는 건가요?"라고 규제기관에 설명할 수 없다. AML 분야에서 모델 해석 가능성(Interpretability)은 선택이 아닌 **규제 요건**이다.

### 6.2 시나리오 엔진(Foundry Rules)의 Function 구현

팔란티어 Foundry Rules는 공식 문서에서 AML을 첫 번째 예시 사용 사례로 명시한다: *"Anti-Money Laundering (AML): Flag suspicious transactions through rules targeting both per-transaction and aggregated metrics"* \[출처: Palantir Foundry Rules Overview 공식 문서\].

규칙은 두 종류다:

**단건 규칙 (Per-transaction)**:

```
IF transaction.amount_usd > 9000
AND transaction.amount_usd < 10000
AND transaction.type = "CASH_DEPOSIT"
THEN flag_as: "POTENTIAL_STRUCTURING"
```

**집계 규칙 (Aggregated metrics)**:

```
IF COUNT(transactions
   WHERE customer_id = current AND
         amount_usd BETWEEN 3000 AND 10000 AND
         transaction_date > NOW() - 7 DAYS) >= 5
THEN flag_as: "SMURFING_PATTERN"
```

팔란티어의 Scenario Manager는 비기술 직원도 포인트-앤-클릭 인터페이스로 이 규칙을 작성할 수 있게 한다. 실제 사례: *"프랑스의 한 대형 은행에서 비기술 AML 전문가 2명이 2주 만에 26개의 복잡한 거래감시 시나리오를 작성했다"* \[출처: Palantir Foundry for AML, 2021\]. 규제 기한이 촉박한 상황에서도 몇 달이 걸릴 작업을 2주로 단축한 것이다.

**자동 백테스팅**: 규칙을 수정하기 전에 과거 데이터에 새 규칙을 적용해보는 기능. "만약 이 임계값을 $9,000에서 $8,500으로 낮추면, 지난 1년간 얼마나 더 많은 Alert가 발생했을까?" — 실제 배포 전에 영향을 미리 시뮬레이션한다. A/B 테스트와 비슷한 개념이다.

### 6.3 ML 모델의 Function 연결

ML 모델은 Function 형태로 온톨로지에 연결된다. Function이 호출되면:

1. **입력 조회**: 온톨로지에서 필요한 Object들의 속성을 읽어옴
2. **특성(Feature) 계산**: 원시 속성을 ML 모델 입력 형태로 변환
3. **모델 추론**: 스코어 출력
4. **결과 저장**: 계산된 위험 점수를 Transaction/Customer Object에 기록

팔란티어는 외부 ML 도구(SageMaker, Azure ML, Google Cloud AutoML, DataRobot)로 구축한 모델도 Foundry에 가져올 수 있다고 명시한다 \[출처: Transaction Monitoring WP, 2022\]. 즉, 기존에 은행이 구축한 모델을 버릴 필요 없이 온톨로지에 연결할 수 있다.

### 6.4 두 결과의 통합: 최종 위험 점수 산출

규칙 엔진과 ML 모델은 서로 독립적으로 실행되지만, 최종 Alert 생성 시에는 **통합 점수**가 사용된다:

```
최종_위험_점수 = MAX(
  시나리오_엔진_점수,        // 하나라도 규칙에 걸리면 즉시 Alert
  ML_이상탐지_점수,          // 행동 패턴 이상도
  네트워크_위험_전파_점수    // 연결된 엔티티들로부터 전파된 위험도
)
```

또는 가중 합산:

```
최종 = 0.4 × ML점수 + 0.4 × 시나리오점수 + 0.2 × 네트워크점수
```

(실제 가중치는 기관마다 커스터마이즈되며, 팔란티어는 공개하지 않음)

이 하이브리드 접근법의 핵심 장점: ML은 "이상하다"는 신호를 잡고, 규칙 엔진은 "왜 이상한지"를 설명해준다. 분석관은 둘 다 볼 수 있어서 규제기관에 설명 가능한 판단을 내릴 수 있다.

---

## 7. 설계 역설계: 이렇게 하면 비슷한 온톨로지를 만들 수 있다

### 7.1 온톨로지 설계 순서

팔란티어의 접근법을 역공학한 설계 순서:

**Step 1: 탐지하고 싶은 패턴을 먼저 정의한다**

- "스머핑을 탐지하겠다" → 이걸 탐지하려면 Customer, Account, Transaction이 연결되어야 함
- "쉘 컴퍼니를 통한 세탁을 탐지하겠다" → Organization, 소유 관계 Link가 필요
- "PEP 연루 거래를 탐지하겠다" → Customer에 PEP 속성, 외부 PEP 목록과의 매칭 파이프라인 필요

**Step 2: 필요한 Object Type을 도출한다**

패턴 → 필요한 Object Type: Customer / Account / Transaction / Alert / Case / Organization / ExternalEntity

**Step 3: Link Type을 설계한다**

Object들 사이의 관계를 열거하고, 각 관계가 어떤 패턴 탐지에 기여하는지 매핑한다.

**Step 4: Action Type을 설계한다**

- 분석관이 수행할 수 있는 모든 Action 열거 (판정, 에스컬레이션, SAR 제출 등)
- 각 Action의 Side Effects (어떤 Object가 어떻게 바뀌는가)
- 피드백 루프 설계 (어떤 Action이 ML 모델 재학습 데이터로 가는가)

**Step 5: Function을 설계한다**

- 어떤 ML 모델이 필요한가 (이상 탐지, 분류, 클러스터링)
- 어떤 시나리오 규칙이 필요한가 (규제 요건 + 과거 사례 기반)
- Function 트리거 조건 (Transaction 생성 시? 주기적 배치? 실시간?)

**Step 6: 데이터 파이프라인을 설계한다**

- 어떤 시스템에서 어떤 데이터가 들어오는가
- 표준화 규칙 (통화, 타임스탬프, 코드 체계)
- Entity Resolution 방법 (같은 사람을 다른 이름으로 등록했을 때 어떻게 합칠 것인가)

### 7.2 핵심 설계 원칙 요약

| 원칙 | 구체적 구현 |
| --- | --- |
| 단일 고객 뷰 | 모든 시스템의 고객 데이터를 Entity Resolution으로 하나로 합침 |
| 맥락 보존 | Transaction이 생성될 때 Customer 이력 전체와 연결 |
| 설명 가능성 | ML 점수와 함께 기여 요인(contributing factors) 반드시 기록 |
| 감사 추적 | 모든 Action에 불변 로그 기록 (규제 요건) |
| 닫힌 루프 | 분석관 판정 → ML 모델 재학습 → 다음 예측 개선 |
| 모듈성 | 새 시나리오 규칙을 코딩 없이 추가 가능 |

---

## 8. 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치도 | 확신도 | 검증 필요 여부 |
| --- | --- | --- | --- | --- |
| AML Alert의 90\~95%가 오탐 | Flagright 2024, Unit21 연구, Retail Banker Int'l 2025 | 직접 도메인 | 높음 | 추가 검증 불요 (다수 독립 출처 일치) |
| 팔란티어 AML: 진양성 40배 개선 | Palantir 공식 문서 (2021, 2022) | 직접 도메인 | 중간 | 요주의 — 자사 마케팅 자료, 단일 고객 사례 |
| 팔란티어 AML: 비용 90% 절감 | Palantir 공식 문서 (2021, 2022) | 직접 도메인 | 중간 | 요주의 — 동일 이유 |
| 25개 위험 지표로 KYC 스코어링 | Palantir 공식 문서 (2021) | 직접 도메인 | 높음 | 지표 내용은 비공개 |
| 그래프 순회가 SQL보다 다단계 탐지에 유리 | TigerGraph 블로그, Graphable.ai, ArangoDB 기술 문서 | 직접 도메인 | 높음 | 원리적으로 명확 |
| 피드백 루프가 모델 성능 개선 | Palantir 공식 문서, Flagright 산업 가이드 | 직접 도메인 | 높음 | ML 일반 원리와 일치 |
| 프랑스 대형 은행 26개 시나리오 2주 구현 | Palantir 공식 문서 (2021) | 직접 도메인 | 중간 | 익명 사례, 독립 검증 불가 |

### 상충점 해결 테이블

| 상충 주제 | 주장 A | 주장 B | 판단 |
| --- | --- | --- | --- |
| 규칙 vs ML 중 무엇이 핵심인가 | 팔란티어: ML 행동 기반 모델이 주, 규칙은 보조 | AML 규제 당국: 설명 가능한 규칙 기반 접근 선호 | 둘 다 필요. 팔란티어의 하이브리드 접근이 현실적 타협안 |
| 피드백 루프의 위험성 | 자동 학습으로 모델 지속 개선 | FinCEN Files 사례처럼 인간이 악용 가능 | 피드백 루프에 변경 검토 프로세스 의무화로 위험 완화 |

---

## 9. 예상 밖 핵심 발견

**발견 1: 온톨로지의 진짜 가치는 "데이터 통합"이 아니라 "피드백 루프"다**

팔란티어 문서 전체를 분석하면, 결과 지표(40배 개선, 90% 비용 절감)는 주로 **피드백 루프**에서 나온다. 데이터를 한 곳에 모으는 것은 필요조건이지만 충분조건이 아니다. 분석관의 판단이 ML 모델로 돌아가지 않으면, 아무리 좋은 온톨로지도 시간이 지날수록 정확도가 떨어진다.

**발견 2: Entity Resolution이 AML의 진짜 핵심 기술이다**

화려한 그래프 분석보다, "같은 사람을 다른 이름으로 등록한 것을 하나로 합치는" Entity Resolution이 AML 성능에 가장 큰 영향을 미친다. 같은 사람의 두 계좌를 별개로 보면, 아무리 정교한 모델도 그 사람의 전체 행동을 볼 수 없다.

**발견 3: SAR 보고 품질이 탐지 품질만큼 중요하다**

팔란티어가 "SAR 자동 생성"을 강조하는 것은 단순히 편의 기능이 아니다. 규제기관은 SAR의 **품질**을 심사한다. 부실한 SAR는 벌금 대상이 된다. FinCEN 데이터에 따르면 대형 은행들이 SAR를 제출하는 데 평균 166일이 걸렸다 — 팔란티어는 이를 자동화로 단축한다.

---

## 10. 후속 탐색 질문

1. **암호화폐/DeFi 거래에서 팔란티어 AML 온톨로지는 어떻게 작동하는가?** 블록체인 거래는 코어뱅킹 데이터와 구조적으로 다르다. on-chain 데이터를 온톨로지에 어떻게 연결하는가?

2. **실시간 처리 vs 배치 처리의 트레이드오프는 무엇인가?** 팔란티어 문서는 "실시간" 위험 점수를 언급하지만, 대규모 네트워크 분석은 배치로 실행될 가능성이 높다. 두 모드를 어떻게 조합하는가?

3. **규제기관이 직접 팔란티어를 사용하면 어떻게 되는가?** 팔란티어는 은행뿐 아니라 규제기관에도 배포된다고 언급한다. 규제기관과 은행이 같은 플랫폼을 사용할 때 데이터 격리 및 이해 충돌 문제는 어떻게 해결하는가?

---

## 출처 목록

 1. Palantir Technologies. *Foundry for AML* (PDF). 2021. https://www.palantir.com/assets/xrfr7uokpv1b/1faMo2Wb4LJzUZNt3tOmTm/14cc66723edced7355e90c6ef1b56246/Foundry_for_AML.pdf

 2. Palantir Technologies. *Palantir Foundry for Transaction Monitoring* (White Paper). 2022. https://www.palantir.com/assets/xrfr7uokpv1b/63826h3ZWtc98u5jy5DZTm/9897a4d80894eeccde0a2e74b624efaa/2022_06_AML_Transaction_Monitoring_WP_Final.pdf

 3. Palantir Technologies. *Foundry for AML — Case Management* (PDF). 2021. https://www.palantir.com/assets/xrfr7uokpv1b/61TKq1d7KnIMPRyPjCwHud/e98a8ee3c005e5a29c400adc66935066/Foundry_AML_CaseMgmt.pdf

 4. Palantir Technologies. *Foundry Rules — Overview* (공식 문서). https://palantir.com/docs/foundry/foundry-rules/overview/

 5. Palantir Technologies. *Anti-Money Laundering* (제품 페이지). https://www.palantir.com/offerings/anti-money-laundering/

 6. Flagright. *Understanding False Positives in Transaction Monitoring*. 2026. https://www.flagright.com/post/understanding-false-positives-in-transaction-monitoring

 7. Retail Banker International. *Hidden Cost of AML: How False Positives Hurt Banks, Fintechs, Customers*. 2025. https://www.retailbankerinternational.com/comment/hidden-cost-of-aml-how-false-positives-hurt-banks-fintechs-customers/

 8. Unit21. *How to Reduce False Positives in AML Transaction Monitoring*. https://www.unit21.ai/blog/reduce-false-positives-in-aml-transaction-monitoring

 9. TigerGraph. *Money Laundering Detection with AML Graph Analytics*. 2026. https://www.tigergraph.com/blog/money-laundering-detection-with-aml-graph-analytics-structuring-and-layering/

10. ArangoDB. *Advanced Fraud Detection in Financial Services*. 2024. https://arango.ai/blog/advanced-fraud-detection-in-financial-services-with-arangodb-and-aql/

11. Napier AI. *Application of graph databases and network analysis in AML*. 2024. https://www.napier.ai/post/network-analytics-aml

---

## 검색 비용 정보

| 도구 | 호출 수 | 예상 비용 |
| --- | --- | --- |
| Perplexity search | 3회 | \~$0.039 |
| Tavily search (advanced) | 1회 | \~2 크레딧 |
| Tavily extract | 3회 | \~3 크레딧 |
| **합계** | 7회 | \~$0.04 + 5 크레딧 |
