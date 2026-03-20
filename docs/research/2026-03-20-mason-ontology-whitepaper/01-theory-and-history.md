# MASON 온톨로지: 이론적 체계와 발전 역사

> 제조 온톨로지의 시작점인 MASON을 중심으로, 제조 도메인 지식 표현의 이론과 흐름을 비전공자도 이해할 수 있게 풀어쓴 보고서.

---

## 1. MASON은 왜 태어났는가

### 배경: 공장은 왜 "공통 언어"가 필요했나

2000년대 초반, 제조업은 급격한 변화를 겪고 있었다. PLM(Product Lifecycle Management, 제품 생애주기 관리)이 확산되면서, 설계-생산-물류-품질 부서가 **같은 데이터를 다르게 해석하는 문제**가 심각해졌다.

비유하자면 이런 상황이다:

> 설계팀이 "이 부품은 알루미늄이다"라고 적어 놓았다. 가공팀은 이 말을 듣고 "그러면 드릴 속도를 3000rpm으로 맞춰야겠군"이라고 이해한다. 물류팀은 "무게가 가벼우니 포장을 줄여도 되겠군"이라고 받아들인다. 하지만 이 연결고리가 사람의 머릿속에만 존재하고, 시스템에는 기록되어 있지 않다.

**"알루미늄 부품"이라는 한마디가 공장의 모든 부서에서 같은 의미로 이해되려면**, 개념들 사이의 관계를 명시적으로 정의한 "공통 사전"이 필요했다. 이것이 바로 **온톨로지(Ontology)**의 역할이다.

### MASON의 탄생 (2006)

**MASON**(MAnufacturing's Semantics ONtology)은 2006년 프랑스 ENSAM(국립고등예술공학교)의 Severin Lemaignan, Ali Siadat 등이 IEEE DIS'06(Distributed Intelligent Systems) 워크숍에서 발표한 **제조 도메인 상위 온톨로지(upper ontology)** 제안이다[^1].

MASON의 목적은 단순했다:

1. 제조 도메인의 **공통 의미망(common semantic net)**을 만들자
2. 이 의미망 위에서 **자동 원가 추정**, **멀티에이전트 시뮬레이션** 같은 응용을 구동하자
3. 부서-공장-기업 간 **데이터 교환의 의미적 일관성**을 보장하자

MASON은 프랑스 Metz의 ENSAM LGIPM 연구실과 독일 Karlsruhe 대학교 RPK 연구실의 협력으로 탄생했으며, 유럽 ICAMS 프로젝트의 일환이었다.

[^1]: Lemaignan, S., Siadat, A., Dantan, J.-Y., & Semenenko, A. (2006). MASON: A Proposal For An Ontology Of Manufacturing Domain. *Proc. IEEE Workshop on DIS'06*. 원문: https://academia.skadge.org/publis/Lemaignan2006.pdf

---

## 2. 핵심 이론 체계: Product-Process-Resource (PPR)

### PPR이란 무엇인가

제조 도메인을 이해하는 가장 기본적인 프레임워크는 **PPR(Product-Process-Resource)**이다. Martin & D'Acunto(2003)가 제시한 이 개념은 단순하면서도 강력하다:

| 개념 | 의미 | 쉬운 비유 |
|------|------|-----------|
| **Product (제품/엔터티)** | 무엇을 만드는가 | 요리의 "메뉴" |
| **Process (공정/오퍼레이션)** | 어떻게 만드는가 | 요리의 "레시피" |
| **Resource (자원)** | 무엇으로 만드는가 | 요리의 "도구와 재료" |

**제조란 이 세 가지 개념의 조합이다.** "알루미늄 판재(Product)를 CNC 밀링(Process)으로 5축 가공기(Resource)를 써서 깎는다"는 문장이 바로 PPR의 한 인스턴스다.

### MASON에서의 PPR 구현

MASON은 PPR을 세 가지 **최상위 클래스(head concept)**로 구현했다. 다만 이름이 약간 다르다:

```
owl:Thing
├── Entities    ← Product에 해당 (제품을 설명하는 개념들)
├── Operations  ← Process에 해당 (제조 공정들)
└── Resources   ← Resource에 해당 (제조에 쓰이는 자원들)
```

#### Entities (엔터티): 제품을 설명하는 개념 모음

"이 부품이 어떤 물건인가"를 표현하기 위한 보조 개념들이다:

- **기하학적 엔터티(Geometric Entities)**: 추상적 기하 관계 (예: "접선이다", "평행이다")
- **제조용 기하 엔터티(Geometric Entities for Manufacturing)**: 구체적 형상 피처 (예: 챔퍼, 홀, 슬롯)
- **원재료(Raw Material)**: 부품의 소재 (예: 알루미늄, SUS304)
- **원가 엔터티(Cost Entities)**: 원가 구조 표현 (H'Mida의 원가 모델 기반)

#### Operations (오퍼레이션): 공정의 세계

"이 부품을 어떻게 만드는가"를 체계적으로 분류한다:

- **제조 오퍼레이션**: 가공(기계가공, 조립, 검사 포함). 기계가공은 물리적 특성으로 추가 분류 (고속/저속, 고온/저온, 체적 손실 유무 등)
- **물류 오퍼레이션**: 자재 이동, 보관
- **인적 오퍼레이션**: 사람이 수행하는 작업
- **시작 오퍼레이션(Launching)**: 생산 개시 관련 활동

#### Resources (리소스): 자원의 세계

"무엇을 써서 만드는가"를 표현한다:

- **공작기계(Machine-tools)**: CNC, 프레스 등
- **공구(Tools)**: 드릴, 엔드밀 등
- **인적 자원(Human Resources)**: 작업자, 엔지니어
- **지리적 자원(Geographic Resources)**: 공장, 작업장, 라인

### 개념들의 연결: 프로퍼티(Property)

핵심은 이 세 영역을 **관계(프로퍼티)**로 연결하는 것이다. MASON의 원 논문에서 제시한 주요 관계:

- `canBeMachinedBy`: 원재료 → 오퍼레이션 (예: 알루미늄은 드릴링으로 가공 가능)
- `uses`: 오퍼레이션 → 공구 (예: 드릴링은 드릴 비트를 사용)

이런 관계 덕분에 **추론**이 가능해진다. "이 부품은 알루미늄이다" + "알루미늄은 드릴링으로 가공 가능하다" + "드릴링은 드릴 비트를 사용한다" → **시스템이 자동으로 필요한 공구와 공정을 도출**할 수 있다.

MASON은 발표 시점에 약 **270개의 기본 개념(클래스)**과 **50개의 프로퍼티(관계)**를 포함하고 있었다.

> **실행 연결**: PPR 프레임워크의 가치는 단순한 분류가 아니라, **자동 공정 계획(CAPP)**, **원가 추정**, **공급망 매칭** 같은 의사결정 자동화의 기반이 된다는 점이다. MASON의 두 가지 응용(자동 원가 추정, 멀티에이전트 제조 시뮬레이션)이 이를 입증한다.

---

## 3. OWL과 OWL-DL: 왜 이 언어를 썼는가

### 온톨로지에 왜 "언어"가 필요한가

온톨로지는 결국 컴퓨터가 읽고 추론할 수 있어야 의미가 있다. 사람끼리만 공유하는 용어집이라면 그냥 엑셀이면 된다. 하지만 **"알루미늄이면 플라즈마 용접은 안 된다"** 같은 규칙을 컴퓨터가 이해하고 자동으로 적용하려면, 엄밀한 논리 체계가 필요하다.

### OWL을 쉽게 이해하는 비유

**OWL(Web Ontology Language)**은 2004년 W3C(웹 표준 기구)가 공식 권고한 온톨로지 표현 언어다.

레고에 비유하면 이렇다:

| OWL 요소 | 레고 비유 | 예시 |
|----------|----------|------|
| **클래스(Class)** | 레고 블록의 "종류" | `드릴링`은 `오퍼레이션`의 하위 종류 |
| **프로퍼티(Property)** | 블록들을 연결하는 "커넥터" | `uses` 커넥터로 `드릴링`과 `드릴비트`를 연결 |
| **개체(Individual)** | 실제 조립된 "레고 완성품" | `3호기CNC밀링머신`은 `공작기계`의 실제 사례 |
| **제약조건(Restriction)** | "이 블록은 여기에만 꽂을 수 있다"는 규칙 | `알루미늄`에 `플라즈마용접`은 적용 불가 |

OWL로 작성하면 이런 식이다 (실제 MASON 논문의 예시를 단순화):

```xml
<!-- "드릴링은 오퍼레이션의 한 종류다" -->
<owl:Class rdf:ID="Drilling">
  <rdfs:subClassOf rdf:resource="#Operation"/>
</owl:Class>

<!-- "드릴링은 공구를 사용한다" -->
<owl:ObjectProperty rdf:ID="uses">
  <rdfs:domain rdf:resource="#Operation"/>
  <rdfs:range rdf:resource="#Tool"/>
</owl:ObjectProperty>
```

### OWL-DL이 뭔가: "자유"와 "계산 가능성"의 균형

OWL에는 세 가지 "레벨"이 있다:

| 레벨 | 특징 | 비유 |
|------|------|------|
| **OWL Lite** | 가장 단순. 간단한 분류 체계만 가능 | 초등학교 수학: 덧셈, 뺄셈만 |
| **OWL DL** | 표현력이 높으면서도 **모든 추론이 유한 시간에 끝남을 보장** | 고등학교 수학: 미적분까지 하되, 반드시 답이 나옴 |
| **OWL Full** | 제한 없는 자유. 하지만 **추론이 끝나지 않을 수 있음** | 대학원 수학: 뭐든 쓸 수 있지만, 풀 수 없는 문제도 존재 |

**MASON은 OWL-DL을 선택했다.** 이유는 명확하다:

1. **계산 완전성(Completeness)**: 모든 논리적 귀결을 빠짐없이 도출 가능
2. **결정 가능성(Decidability)**: 추론이 반드시 유한 시간에 종료
3. **충분한 표현력**: 제조 도메인의 복잡한 관계를 표현하기에 충분

기술적으로 OWL-DL은 **기술 논리(Description Logic)** 중 SHOIN(D)에 해당한다. "기술 논리"란 1980년대부터 발전한 논리학의 한 분야로, **"개념(클래스)을 정의하고, 그 관계를 추론하는 것"에 특화된 형식 체계**다.

> **왜 이게 중요한가**: OWL-DL로 작성된 온톨로지는 **Reasoner(추론기)**라는 소프트웨어가 자동으로 모순을 검출하고, 암묵적 관계를 발견할 수 있다. 예를 들어 "드릴링은 체적 손실이 있는 가공이다"와 "체적 손실 가공에는 절삭유가 필요하다"를 입력하면, 추론기가 자동으로 "드릴링에는 절삭유가 필요하다"를 도출한다.

### OWL의 한계와 보완: SWRL

MASON 논문은 OWL의 한계도 솔직히 인정했다. OWL의 제약조건(Restriction)만으로는 **동적인 규칙**을 표현하기 어렵다. 예를 들어:

> "알루미늄이고, 드릴 직경이 5mm 미만이면, 드릴 속도는 3000rpm이어야 한다"

이런 조건부 규칙은 **SWRL(Semantic Web Rule Language)**이라는 별도의 규칙 언어로 보완한다. MASON 논문은 "OWL + SWRL" 조합의 필요성을 이미 2006년에 지적했다.

> **반증 탐색**: OWL-DL 대신 다른 형식을 쓸 수도 있었을까? 당시 대안으로 NIST의 PSL(Process Specification Language)이 있었으나, PSL은 공정 명세에 특화되어 있고 범용 온톨로지 프레임워크로서의 확장성이 제한적이었다. OWL-DL은 시맨틱 웹 생태계와의 호환성, 추론기 지원, 확장성 측면에서 당시 최선의 선택이었다. **반증 미발견**.

---

## 4. MASON 이후의 제조 온톨로지 지형

MASON은 제조 온톨로지의 "첫 주자" 중 하나로, 이후 수많은 후속 온톨로지가 등장했다. 2024년 Sapel 등의 서베이 논문[^2]은 **65개의 제조 온톨로지**를 분류했다. 주요 온톨로지와 MASON과의 관계를 정리한다.

[^2]: Sapel, P., Molinas Comet, L., et al. (2024). A review and classification of manufacturing ontologies. *Journal of Intelligent Manufacturing*. https://doi.org/10.1007/s10845-024-02425-z

### 주요 후속 온톨로지

#### MSDL (Manufacturing Service Description Language, 2006~)

- **개발**: Farhad Ameri, 미시간대학교 PLM Alliance → 이후 Texas State University
- **초점**: 제조 **서비스 역량(capability)** 기술. "이 업체가 무엇을 만들 수 있는가"를 형식화
- **특징**: 역량을 5단계(공급자-공장-기계-장치-공정)로 분해하는 **계층적 역량 모델**
- **MASON과의 관계**: MASON이 공장 내부의 "무엇이 있는가"를 정의한다면, MSDL은 "무엇을 할 수 있는가"를 정의. 관점이 다르지만 상호 보완적. COMPOSITION 온톨로지는 MSDL과 MASON 모두에 정렬(align)
- **응용**: 분산 환경에서의 자동 공급자 매칭, 디지털 제조 마켓플레이스

#### MCCO (Manufacturing Core Concepts Ontology, 2011)

- **개발**: Usman 등, Loughborough University
- **초점**: 제품 생애주기 전체에 걸친 **핵심 제조 개념** 통합 (설계 → 생산 → 스케줄링 → 자원 관리)
- **특징**: 부품 패밀리, 버전 관리, 피처 정의에 강점
- **MASON과의 관계**: MASON의 PPR 구조를 확장하여 생애주기 관점을 추가

#### MRO (Manufacturing Reference Ontology, 2013)

- **개발**: Usman 등 (MCCO와 같은 그룹)
- **초점**: 원자재 → 완제품으로의 변환 과정을 중심으로 설계/생산 버전 관리
- **MASON과의 관계**: MASON의 Entity/Operation/Resource 구조를 더 세밀한 버전 관리 체계로 발전

#### MaRCO (Manufacturing Resource Capability Ontology, 2019)

- **개발**: Jarvenpaa 등, Tampere University (핀란드)
- **초점**: 제조 자원의 **역량(Capability)** — 단순 역량뿐 아니라 역량의 조합, 벤더 오퍼링, 후보 자원 매칭
- **MASON과의 관계**: MASON의 Resource 클래스를 역량 중심으로 대폭 확장. ExtruOnt 개발 시 MASON이 MaRCO보다 범용성이 높아 정렬 대상으로 선택됨

#### ExtruOnt (Extruder Ontology, 2020)

- **개발**: Ramirez-Duran 등, University of the Basque Country (스페인)
- **초점**: 압출기(Extruder) 한 종류의 제조 기계를 매우 상세히 기술 (부품, 공간 관계, 센서, 3D 표현)
- **특징**: NeOn 방법론 적용, OWL 2 DL 기반, 모듈형 구조
- **MASON과의 관계**: **MASON에 직접 정렬(align)**. 개발 시 MaRCO, MSDL 등도 검토했으나, MASON의 범용 상위 온톨로지 역할이 가장 적합하다고 판단. 이는 **MASON이 2020년에도 여전히 상위 온톨로지로서 레퍼런스 가치를 인정받고 있음**을 보여준다.

#### I40KG (Industry 4.0 Knowledge Graph, 2017)

- **개발**: Grangel-Gonzalez 등
- **초점**: Industry 4.0 표준들(RAMI4.0, 참조 아키텍처 등)을 온톨로지로 통합한 지식 그래프
- **MASON과의 관계**: MASON의 공장 수준 온톨로지와는 다른 층위 — I4.0의 거시적 프레임워크를 다룸

#### IOF (Industrial Ontologies Foundry, 2019~)

- **개발**: OAGi 주도, NIST 등 참여하는 국제 이니셔티브
- **초점**: 제조 도메인 전체를 포괄하는 **상호운용 가능한 온톨로지 스위트(suite)** 구축
- **구조**: BFO(Basic Formal Ontology) 상위 온톨로지 위에 IOF Core(2022)를 구축하고, 도메인별 확장 (유지보수: MaintRefOnto, 공급망: SCRO 등)
- **MASON과의 관계**: IOF는 MASON을 포함한 기존 온톨로지들의 **단편화(fragmentation) 문제**를 해결하려는 시도. MASON이 개별 연구실의 제안이었다면, IOF는 산업계-학계-표준기구가 함께 만드는 **표준화 노력**이다.

> **관점 확장**: "RAMP"라는 이름의 독립적 온톨로지는 문헌에서 확인되지 않았다. ARUM 프로젝트의 "ramp-up phase(양산 전환 단계)" 온톨로지가 유사한 개념을 다루나, MASON 계열의 주요 온톨로지로 분류되지는 않는다. "I40GO(Industry 4.0 Global Ontology)"도 I40KG와 구별되는 별도 프로젝트로, Mondragon University에서 개발한 모듈형 온톨로지이며 제조공정, 제품, 비용 등의 모듈을 포함한다.

### MASON의 위상: 여전히 "뿌리"

65개 제조 온톨로지를 조사한 2024년 서베이에서 MASON은 여전히 **가장 빈번하게 인용되는 상위 온톨로지 중 하나**다. MASON의 가장 큰 기여는:

1. **PPR 구조의 표준화**: 제품-공정-자원이라는 삼각 구조가 이후 거의 모든 제조 온톨로지의 기본 뼈대가 됨
2. **OWL-DL 적용의 선례**: 제조 도메인에 기술 논리 기반 온톨로지를 적용한 초기 사례로서, 후속 연구의 방법론적 기준을 제시
3. **오픈소스 공개**: SourceForge에 소스를 공개하여 재사용을 가능하게 함 (https://sourceforge.net/projects/mason-onto/)

---

## 5. 발전 타임라인 (2006~현재)

| 연도 | 이정표 | 의의 |
|------|--------|------|
| **1998** | NIST의 PSL(Process Specification Language) | 제조 공정 교환을 위한 초기 표준 시도. MASON의 선행 연구로 인용됨 |
| **2004** | W3C OWL 1.0 권고 | 온톨로지 표현 언어의 표준화. MASON이 채택한 기반 기술 |
| **2005~2006** | **MASON 발표** + MSDL 초기 버전 | 제조 도메인 상위 온톨로지의 본격적 등장. PPR 구조 + OWL-DL 조합의 시작 |
| **2009** | OntoSTEP (NIST) | STEP 표준을 OWL-DL로 변환. 제조 데이터 교환 표준과 온톨로지의 접점 |
| **2009** | OWL 2 W3C 권고 | OWL-DL의 표현력 향상 (SROIQ(D)). 이후 온톨로지들이 OWL 2 DL로 마이그레이션 |
| **2011** | MCCO (Usman 등) | 제품 생애주기 전반을 포괄하는 핵심 개념 온톨로지 |
| **2013** | MRO (Usman 등) | 제조 참조 온톨로지. 버전 관리와 피처 체계 강화 |
| **2016** | CDM-Core (CREMA 프로젝트) | 자동차 배기 생산, 금속 프레스 유지보수 등 유즈케이스 기반 온톨로지 |
| **2017** | I40KG (Grangel-Gonzalez 등) | Industry 4.0 표준들의 지식 그래프 통합 |
| **2019** | MaRCO (Jarvenpaa 등) | 자원 역량의 조합과 매칭에 특화 |
| **2019~** | **IOF 이니셔티브 시작** | 산업계-학계-표준기구의 공동 온톨로지 표준화 프로젝트 |
| **2020** | ExtruOnt (Ramirez-Duran 등) | MASON에 정렬된 도메인 특화 온톨로지. Industry 4.0 센서/3D 표현 포함 |
| **2020** | I40GO (Mondragon Univ.) | Industry 4.0 글로벌 온톨로지. 제조공정, 제품, 비용 모듈 |
| **2022** | **IOF Core 발표** | BFO 기반 중간 수준 핵심 온톨로지. 공급망, 유지보수 등 도메인 확장 모듈 포함 |
| **2024** | Sapel 등 서베이 (65개 온톨로지 분류) | 제조 온톨로지 생태계의 전체 지도. MASON은 여전히 주요 참조점으로 인용 |

### 큰 흐름: 세 가지 시대

**1세대 (2005~2012): 개별 제안의 시대**
- MASON, MSDL 등 개별 연구팀이 자체 온톨로지를 제안
- PPR 구조의 확립과 OWL-DL 활용 패턴이 형성됨
- 한계: 온톨로지 간 상호운용성 부재, 재사용 어려움

**2세대 (2013~2019): 확장과 특화의 시대**
- MRO, MaRCO 등 특정 관점(역량, 버전 관리)을 깊이 파고드는 온톨로지 등장
- Industry 4.0의 등장으로 IoT 센서, 사이버-물리 시스템 관련 온톨로지 수요 급증
- 한계: 온톨로지가 65개 이상으로 파편화. "어떤 것을 쓸지" 자체가 문제

**3세대 (2019~현재): 통합과 표준화의 시대**
- IOF가 BFO라는 상위 온톨로지 위에 모듈형 표준을 구축하려는 시도
- 개별 온톨로지를 새로 만드는 것이 아니라, 기존 온톨로지를 **정렬(align)하고 재사용**하는 방향으로 전환
- ExtruOnt가 MASON에 정렬한 것이 이 흐름의 대표적 사례

---

## 6. 숨은 변수와 열린 질문

### 인접 질문 1: 온톨로지가 실제 공장에서 쓰이고 있는가?

학술 논문 수는 많지만, **실제 산업 현장 채택률은 낮다.** 2024년 서베이에 따르면, 대부분의 온톨로지가 "논문에만 존재(only available on paper)"하며 OWL 파일이 공개되지 않은 경우가 많다. 이는 이론과 실무의 간극을 보여주는 중요한 신호다.

### 인접 질문 2: LLM 시대에 온톨로지는 여전히 유효한가?

LLM(Large Language Model)이 자연어로 제조 지식을 다룰 수 있게 되면서, 형식적 온톨로지의 역할이 변할 수 있다. 그러나 온톨로지는 **추론의 엄밀성과 재현 가능성**에서 LLM이 대체하기 어려운 강점을 갖는다. 오히려 "LLM + 온톨로지" 결합이 유망한 방향이며, 이는 LLM이 온톨로지를 읽고 추론하거나, 온톨로지 기반으로 LLM의 할루시네이션을 검증하는 패턴으로 발전할 수 있다.

### 문제 재정의

> 원래 질문 "MASON의 이론적 체계와 발전 역사"보다 더 적절한 핵심 질문은 아마도 이것이다: **"2006년의 PPR 기반 상위 온톨로지 설계가 2025년 Industry 4.0/5.0 환경에서 여전히 유효한 아키텍처인가, 아니면 근본적으로 다른 접근이 필요한가?"**

---

## 근거 신뢰도 요약

| 핵심 주장 | 출처 유형 | 도메인 일치 | 확신도 | 검증 필요 |
|-----------|-----------|-------------|--------|-----------|
| MASON은 PPR 기반 상위 온톨로지다 | 원 논문 (2006) | 직접 일치 | 높음 | 아니오 |
| 270개 클래스, 50개 프로퍼티 | 원 논문 본문 기술 | 직접 일치 | 높음 | OWL 파일로 검증 가능 |
| OWL-DL은 SHOIN(D)에 해당 | W3C 표준 문서 | 직접 일치 | 높음 | 아니오 |
| ExtruOnt이 MASON에 정렬됨 | ExtruOnt 논문 (2020) | 직접 일치 | 높음 | 아니오 |
| 65개 제조 온톨로지 존재 | 서베이 논문 (2024) | 직접 일치 | 높음 | 아니오 |
| 산업 현장 채택률이 낮음 | 서베이 논문의 관찰 | 직접 일치 | 중간 | 산업 사례 추가 조사 필요 |
| LLM+온톨로지 결합의 유망성 | 연구자 추론 | 인접 도메인: AI/NLP | 낮음 | 실증 연구 필요 |

---

## 참고 문헌

1. Lemaignan, S., Siadat, A., Dantan, J.-Y., & Semenenko, A. (2006). MASON: A Proposal For An Ontology Of Manufacturing Domain. *Proc. IEEE Workshop on DIS'06*. https://academia.skadge.org/publis/Lemaignan2006.pdf
2. Sapel, P., Molinas Comet, L., Dimitriadis, I., Hopmann, C., & Decker, S. (2024). A review and classification of manufacturing ontologies. *Journal of Intelligent Manufacturing*. https://doi.org/10.1007/s10845-024-02425-z
3. Ameri, F. & Dutta, D. (2006). An Upper Ontology for Manufacturing Service Description. *ASME DETC'06*.
4. Ramirez-Duran, V.J., Berges, I., & Illarramendi, A. (2020). ExtruOnt: An ontology for describing a type of manufacturing machine for Industry 4.0 systems. *Semantic Web*, 11, 887-909.
5. Karray, M.H., et al. (2021). The Industrial Ontologies Foundry (IOF) Core Ontology. *NIST*.
6. Usman, Z., et al. (2011). A Manufacturing Core Concepts Ontology for Product Lifecycle Interoperability. *IFIP IWEI 2011*.
7. Jarvenpaa, E., et al. (2019). The development of an ontology for describing the capabilities of manufacturing resources. *Journal of Intelligent Manufacturing*.
8. Martin, P. & D'Acunto, A. (2003). Design of a production system: an application of integration product-process. *Int. J. Computer Integrated Manufacturing*, 16(7-8), 509-516.
9. Horrocks, I. (2005). OWL: a Description Logic Based Ontology Language. *Lecture Notes in Computer Science*.
10. MASON SourceForge 프로젝트: https://sourceforge.net/projects/mason-onto/
