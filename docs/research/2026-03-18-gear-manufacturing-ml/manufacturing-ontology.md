# 제조 분야 온톨로지(Manufacturing Ontology) 심층 조사 보고서

> 조사일: 2026-03-18
> 조사 범위: 제조 온톨로지 표준, 기어 설계·가공 적용 가능성, LLM 결합 방법론

---

## 목차

1. [주요 제조 온톨로지 표준](#1-주요-제조-온톨로지-표준)
2. [기어 관련 온톨로지](#2-기어-관련-온톨로지)
3. [공정계획(CAPP)과 온톨로지 결합](#3-공정계획capp과-온톨로지-결합)
4. [공구 선정 온톨로지](#4-공구-선정-온톨로지)
5. [OWL/RDF 기반 제조 지식 표현](#5-owlrdf-기반-제조-지식-표현)
6. [Knowledge Graph + 제조 도메인 결합](#6-knowledge-graph--제조-도메인-결합)
7. [Digital Twin과 온톨로지 연계](#7-digital-twin과-온톨로지-연계)
8. [설계-제조 연계의 산업 적용 사례](#8-설계-제조-연계의-산업-적용-사례)
9. [한계점 및 실용성 평가](#9-한계점-및-실용성-평가)
10. [LLM + 온톨로지 방법론](#10-llm--온톨로지-방법론)

---

## 1. 주요 제조 온톨로지 표준

### 1.1 STEP / ISO 10303

- **정식 명칭**: STandard for the Exchange of Product model data
- **범위**: 제품 데이터의 컴퓨터 해석 가능한 표현 및 교환을 위한 국제 표준
- **데이터 언어**: EXPRESS (ISO 10303-11)
- **주요 Application Protocol(AP)**:
  - **AP203**: 항공우주, 순수 3D 형상 (2014년 폐지)
  - **AP214**: 자동차, 색상/레이어 추가 (2014년 폐지)
  - **AP224**: 기계 가공 제품 정의
  - **AP238 (STEP-NC)**: CNC 제어기용 feature-based 가공 데이터
  - **AP242**: 현행 통합 표준, 시맨틱 PMI(GD&T 기계 판독 가능) 포함
- **기어 관련**: B-rep/NURBS로 형상 표현 가능하나 기어 파라미터(모듈, 압력각 등)의 시맨틱 엔티티는 없음
- **현황**: AP242 Edition 2가 현행 표준. NIST가 지속 관리

출처: [ISO 10303 - Wikipedia](https://en.wikipedia.org/wiki/ISO_10303), [STEP at NIST](https://www.nist.gov/ctl/smart-connected-systems-division/smart-connected-manufacturing-systems-group/step-nist), [MechProfessor AP 비교](https://mechprofessor.com/step-ap203-vs-ap214-vs-ap242/)

### 1.2 MASON (MAnufacturing's Semantics ONtology)

- **형식**: OWL-DL, 약 270개 기본 개념, 50개 속성
- **구조**: 3개 상위 클래스
  - **Entity**: 제품 기술 추상 개념 (형상, 특징)
  - **Operation**: 제조 공정/가공 작업
  - **Resource**: 기계, 도구 등 제조 자원
- **용도**: 자동 원가 추정, 의미 인지 멀티에이전트 제조 시스템
- **소스**: SourceForge에 mason.owl 공개
- **평가**: 구조가 명확한 상위 온톨로지이나 기어 특화 개념 없음. 확장 기반으로 적합

출처: [IEEE Xplore](https://ieeexplore.ieee.org/document/1633441/), [mason.owl - SourceForge](https://sourceforge.net/projects/mason-onto/)

### 1.3 MSDL (Manufacturing Service Description Language)

- **형식**: OWL (Description Logic 기반)
- **패러다임**: 서비스 지향 (제조 능력을 서비스로 기술)
- **5단계 추상화**: Supplier → Shop → Machine → Device → Process
- **강점**: 높은 공리화(axiomatic) 수준, 기계 가공 서비스 중심으로 가장 포괄적
- **적용**: 기어 가공 서비스를 Process-level에서 확장 가능. 공급자 매칭 패러다임 참고 가치

출처: [MSDL - ASU](https://labs.engineering.asu.edu/semantics/ontology-download/msdl-ontology/), [ResearchGate](https://www.researchgate.net/publication/267486591_An_Upper_Ontology_for_Manufacturing_Service_Description)

### 1.4 OntoSTEP

- **역할**: STEP EXPRESS 스키마 + 인스턴스(P21 파일)를 OWL-DL로 자동 변환
- **도구**: STP2OWL (NIST GitHub 공개)
- **용도**: 기존 STEP 파일을 시맨틱 웹 기술과 연결하는 브릿지
- **적용**: 기어 STEP 파일 → OWL 변환 → 온톨로지 통합 파이프라인 구축 가능

출처: [OntoSTEP - NIST](https://www.nist.gov/publications/ontostep-owl-dl-ontology-step?pub_id=901544), [STP2OWL - GitHub](https://github.com/usnistgov/STP2OWL), [OntoSTEP - GovInfo](https://www.govinfo.gov/content/pkg/GOVPUB-C13-f0429972a83a45bcc4c29d1789edc6a7/pdf/GOVPUB-C13-f0429972a83a45bcc4c29d1789edc6a7.pdf)

### 1.5 ROMAIN (Reference Ontology for Industrial MAINtenance)

- **형식**: OWL, BFO(Basic Formal Ontology) 기반
- **범위**: 산업 유지보수 관리 도메인 전용
- **핵심 개념**: 유지보수 전략, 장비 구조(예비 부품, 고장 감지, 이벤트), 물적 자원, 유지보수 작업자, 기술 문서, 장비 상태 및 생애 주기
- **특징**: BFO 준수로 다른 BFO 기반 온톨로지(IOF Core 등)와 상호운용 가능
- **평가**: 기어 가공 장비의 유지보수 지식 체계화에 직접 활용 가능

출처: [ROMAIN - Applied Ontology (Sage)](https://journals.sagepub.com/doi/10.3233/AO-190208), [IOF Core - NIST](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=935068), [CEUR-WS](https://ceur-ws.org/Vol-2941/paper9.pdf)

### 1.6 IOF Core (Industrial Ontologies Foundry)

- **형식**: OWL, BFO(ISO/IEC 21838) 상위 온톨로지 기반
- **역할**: 제조 도메인 전체를 아우르는 중위(mid-level) 온톨로지
- **핵심 개념**: 물질적 인공물(Material Artifact), 계획된 프로세스(Planned Process), 비즈니스 프로세스, 역할(Role: 원자재, 제품 등), 생애주기 단계
- **확장**: Supply Chain Reference Ontology(SCRO) 등이 IOF Core를 재사용
- **현황**: Version 1 beta 공개. 정식 ISO 표준화는 미완(BFO 자체는 ISO 표준)
- **참여 기관**: NIST, OAGi, Autodesk 등

출처: [IOF Core - NIST](https://www.nist.gov/publications/industrial-ontologies-foundry-iof-core-ontology), [CEUR-WS](https://ceur-ws.org/Vol-3240/paper3.pdf), [Autodesk Research](https://www.research.autodesk.com/app/uploads/2023/03/AFirst-OrderLogicFormalizationoftheIndustrialOntologies.pdf_recbLRa49HGewQ8gF.pdf)

### 1.7 ISO 14649 / STEP-NC / OntoSTEP-NC

- **역할**: CAD/CAM/CNC 간 feature-based 기계 제어 데이터 전송
- **OntoSTEP-NC**: ISO 14649를 OWL로 매핑한 온톨로지
- **한계**: 밀링/선삭 중심. 기어 전용 가공(hobbing, shaping 등)은 직접 지원하지 않음

출처: [STEP-NC - Wikipedia](https://en.wikipedia.org/wiki/STEP-NC), [OntoSTEP-NC Mapping - ResearchGate](https://www.researchgate.net/figure/The-mapping-ontology-for-Machining-workingstep-from-ISO-14649-Machining-Object-with-OWL_fig2_273825945)

### 1.8 종합 비교

| 온톨로지 | 형식 | 상위 온톨로지 | 범위 | 기어 적합도 | 공개 여부 |
|----------|------|-------------|------|-----------|---------|
| STEP/ISO 10303 | EXPRESS | 없음(자체) | 제품 데이터 교환 전반 | 형상만(시맨틱 없음) | ISO 표준 |
| MASON | OWL-DL | 없음(자체) | 제조 상위 개념 | 확장 필요 | 오픈소스 |
| MSDL | OWL | 없음(자체) | 제조 서비스 기술 | Process 확장 가능 | 공개 |
| OntoSTEP | OWL-DL | STEP 매핑 | STEP→OWL 브릿지 | 변환 파이프라인 | 오픈소스 |
| ROMAIN | OWL | BFO | 유지보수 관리 | 장비 유지보수 | 오픈 액세스 |
| IOF Core | OWL | BFO (ISO 21838) | 제조 중위 온톨로지 | 핵심 확장 기반 | Beta 공개 |
| STEP-NC | EXPRESS | STEP | CNC 가공 제어 | 밀링/선삭만 | ISO 표준 |

**2024 서베이 참고**: Sapel et al. (2024)이 65개 제조 온톨로지를 분류·정리. 상위/중위/도메인/지원 온톨로지 분류 및 재사용 우선순위 가이드라인 제공.
출처: [Springer - J. Intelligent Manufacturing](https://link.springer.com/article/10.1007/s10845-024-02425-z)

---

## 2. 기어 관련 온톨로지

### 2.1 현황: 공개된 기어 전용 온톨로지(OWL)는 존재하지 않음

조사 결과 기어 설계·가공에 특화된 OWL 기반 공개 온톨로지는 발견되지 않았다. 다만 관련 연구가 존재한다:
- **Ontological Assembly Representation of a Reduction Gearbox**: OWL로 감속기 어셈블리 표현 (Kang Li 등). 기어 간 관계를 object property로 모델링
- 기존 제조 온톨로지(MASON, IOF Core)를 확장하는 방식이 가장 현실적

출처: [Ontological Assembly - Kang Li](https://kangli.me/_resrc/doc/projects/ONT.pdf)

### 2.2 기어 파라미터의 OWL 표현 가능성

기어 도메인의 핵심 파라미터는 OWL로 체계적으로 표현 가능하다:

**클래스 계층 (예시)**:
```
Gear
  ├── SpurGear
  ├── HelicalGear
  ├── BevelGear
  │     ├── StraightBevelGear
  │     └── SpiralBevelGear
  ├── WormGear
  └── InternalGear

ToothProfile
  ├── InvoluteProfile
  ├── CycloidalProfile
  └── TrochoidalProfile

GearMaterial
  ├── CarbonSteel (S45C 등)
  ├── AlloySteel (SCM420 등)
  ├── StainlessSteel
  └── EngineeringPlastic

HeatTreatment
  ├── Carburizing
  ├── Induction Hardening
  ├── Nitriding
  └── ThroughHardening
```

**데이터 속성 (Datatype Properties)**:

| 속성 | 타입 | 설명 | 관계식 |
|------|------|------|--------|
| module | xsd:float | 이 크기 결정 | m = d/z |
| pressureAngle | xsd:float | 기초원 결정 (보통 20°) | 맞물림률 영향 |
| numberOfTeeth | xsd:integer | 치의 개수 | - |
| pitchDiameter | xsd:float | 기준원 지름 | d = m × z |
| helixAngle | xsd:float | 비틀림각 | 0° = 스퍼 |
| profileShiftCoeff | xsd:float | 전위 계수 | 언더컷 방지 |
| faceWidth | xsd:float | 이너비 | 하중 분포 영향 |
| addendumDiameter | xsd:float | 이끝원 지름 | da = d + 2m |
| dedendumDiameter | xsd:float | 이뿌리원 지름 | df = d - 2.5m |
| toleranceGrade | xsd:integer | ISO 1328 / AGMA 등급 | - |

**OWL Turtle 예시**:
```turtle
@prefix gear: <http://example.org/gear#> .
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

gear:Gear rdf:type owl:Class .
gear:SpurGear rdfs:subClassOf gear:Gear .

gear:hasToothProfile rdf:type owl:ObjectProperty ;
    rdfs:domain gear:Gear ;
    rdfs:range  gear:ToothProfile .

gear:module rdf:type owl:DatatypeProperty ;
    rdfs:domain gear:Gear ;
    rdfs:range  xsd:float .

gear:toleranceGrade rdf:type owl:DatatypeProperty ;
    rdfs:domain gear:Gear ;
    rdfs:range  xsd:integer .

gear:ExampleGear1 rdf:type gear:SpurGear ;
    gear:module "2.5"^^xsd:float ;
    gear:numberOfTeeth "24"^^xsd:integer ;
    gear:pressureAngle "20.0"^^xsd:float ;
    gear:toleranceGrade "6"^^xsd:integer ;
    gear:usesMaterial gear:SCM420 ;
    gear:hasHeatTreatment gear:Carburizing .
```

### 2.3 공차 표현

- ISO 1328 (국제) / AGMA 2000 (미국) 등급을 `toleranceGrade`로 표현
- OWL의 `owl:oneOf`로 등급 열거형 정의 가능
- SWRL 규칙으로 소재-열처리-달성 품질 관계 추론 가능:
  ```
  Gear(?g) ∧ usesMaterial(?g, SCM420) ∧ hasHeatTreatment(?g, Carburizing)
    → achievableQuality(?g, "AGMA_Q11_plus")
  ```

### 2.4 소재-공정-품질 관계

| 소재 | 열처리 | 1차 가공 | 2차 가공 | 달성 품질 |
|------|--------|---------|---------|---------|
| S45C (탄소강) | 조질 | Hobbing | Shaving | AGMA Q10 |
| SCM420 (합금강) | 침탄담금질 | Hobbing | Grinding | AGMA Q11+ |
| SUS304 (스테인리스) | - | Hobbing/Shaping | - | AGMA Q8-9 |
| MC Nylon | - | Hobbing | - | AGMA Q7-8 |

출처: [KHK Gear Terminology](https://khkgears.net/new/gear_knowledge/abcs_of_gears-b/basic_gear_terminology_calculation.html), [Xometry Gear Cutting](https://www.xometry.com/resources/machining/gear-cutting/)

---

## 3. 공정계획(CAPP)과 온톨로지 결합

### 3.1 CAD-CAPP 통합의 온톨로지적 접근

- **Feature Ontology 기반 CAD/CAPP 통합** (Dartigues et al.): 형상 특징(feature)에 의미를 부여하여 CAD에서 CAPP로 "지능적" 제품 데이터를 교환. 엔티티 관계를 보존하며 시맨틱 매핑 수행
- **핵심 개념**: 기하학적 특징(geometric feature)과 공정 의미(process semantics)를 온톨로지로 연결하여 RDF/OWL 기반 규칙 검증 가능

출처: [Semantic Scholar - CAD/CAPP Feature Ontology](https://www.semanticscholar.org/paper/CAD-CAPP-Integration-using-Feature-Ontology-Dartigues-Pallez-Ghodous/52771fc15a2ef3b2b3014f4647f06e5b6ae75268)

### 3.2 온톨로지 자기학습 기반 CNC 능력 통합

- **CNC 기계 능력 정보의 온톨로지 자기학습** (2022): 클라우드 제조 환경에서 CNC 기계의 가공 능력을 자동으로 학습하여 온톨로지에 통합
- 동적 공정 계획을 지원하며, 기어 가공 기계(호빙 머신, 기어 연삭기 등)의 능력 모델링에 적용 가능

출처: [SCILTP - IIIE Review 2020-2025](https://www.sciltp.com/journals/jetia/articles/2511002373)

### 3.3 Core Manufacturing Ontology for Process Planning

- **항공 엔진 사례** (Shah et al., 2023): OWL-DL + SWRL로 가공 공정 시퀀스를 모델링
  - UML로 핵심 개념 설계 → OWL로 형식화
  - 작업 유형(자율/수동/반자동), 선후관계, 병렬 가공을 추론
  - 팬 케이스 부품의 밀링→용접→볼팅→패널접합 시퀀스를 SQWRL로 쿼리
- **기어 적용**: 같은 방법론으로 Hobbing→열처리→Grinding→검사 시퀀스 모델링 가능

출처: [Core Manufacturing Ontology - Coventry Univ.](https://pure.coventry.ac.uk/ws/files/80673725/Pure_Shah_2023_AAM_1_.pdf)

### 3.4 기어 공정계획에 대한 온톨로지 적용 가능성

기어 가공 CAPP에 온톨로지를 적용하면:

1. **공정 시퀀스 추론**: 기어 유형 → 1차 공정 자동 선정 (예: 외부 스퍼 → Hobbing)
2. **기계 능력 매칭**: 온톨로지 기반으로 가용 장비의 가공 범위 확인
3. **품질 달성 예측**: 소재-열처리-공정 조합에 따른 달성 가능 품질 등급 추론
4. **공정 제약 검증**: 내부 기어 시 커터 직경 < 기어 내경 등의 제약 자동 확인

| 기어 유형 | 1차 공정 | 2차/대안 공정 |
|----------|---------|-------------|
| 외부 스퍼 | Hobbing | Shaping, Milling, Broaching |
| 외부 헬리컬 | Hobbing | Shaping |
| 내부 스퍼 | Shaping | Broaching, Power Skiving |
| 스파이럴 베벨 | Face milling/hobbing | Lapping (마감) |
| 웜 기어 | Hobbing(웜), Hobbing/Shaping(웜휠) | - |

---

## 4. 공구 선정 온톨로지

### 4.1 온톨로지 기반 절삭 공구 선정 연구

- **저탄소 가공을 위한 온톨로지 기반 공구 선정** (AMM, 2015): OWL로 공구-소재-절삭조건 관계를 모델링하여 환경 영향(탄소 배출)까지 고려한 최적 공구 선정
- **금속 절삭 온톨로지 기반 공구 선정** (ProQuest): 금속 절삭 데이터에 숨겨진 관계를 온톨로지로 발굴하여 공구 선정 자동화

출처: [AMM - Cutter Selection Ontology](https://www.scientific.net/AMM.799-800.1450), [ProQuest - Novel Cutting Tool Selection](https://search.proquest.com/openview/9da9390c063307a05de8a1dc9d2325d6/1)

### 4.2 기어 가공 공구의 온톨로지 표현

**클래스 구조**:
```
CuttingTool
  ├── GearHob
  │     ├── SingleThreadHob
  │     └── MultiThreadHob
  ├── GearShapingCutter
  │     ├── PinionCutter
  │     └── RackCutter
  ├── GrindingWheel
  │     ├── ProfileGrindingWheel
  │     └── GeneratingGrindingWheel
  ├── ShavingCutter
  └── PowerSkivingCutter
```

**핵심 매칭 규칙 (SWRL 예시)**:
```
GearHob(?h) ∧ Gear(?g) ∧ module(?g, ?m) ∧ module(?h, ?mh)
  ∧ equal(?m, ?mh) ∧ pressureAngle(?g, ?pa) ∧ pressureAngle(?h, ?pah)
  ∧ equal(?pa, ?pah)
  → compatibleTool(?g, ?h)
```

**공구 선정 주요 요소**:
- **호브(Hob)**: 모듈 = 기어 모듈 (동일 필수), 압력각 = 기어 압력각, 리드각 고려
- **셰이퍼 커터**: 모듈/압력각 일치 필수. 내부 기어 시 커터 직경 < 기어 내경
- **연삭 휠**: Profile grinding vs Generating grinding. 입도/결합제는 소재 경도에 따라 선정
- **절삭 조건**: 속도, 이송, 절삭 깊이를 소재 물성(경도, 피삭성 지수)과 연결

출처: [Frigate - Cutting Tool Selection](https://frigate.ai/cnc-machining/how-cutting-tool-selection-impacts-your-cnc-parts-lifespan/), [MoldMaking Technology](https://www.moldmakingtechnology.com/articles/macro-considerations-for-cutting-tool-selection)

---

## 5. OWL/RDF 기반 제조 지식 표현

### 5.1 기술 비교

| 기준 | OWL/RDF | Knowledge Graph (RDF) | Property Graph (Neo4j) |
|------|---------|----------------------|----------------------|
| **표준화** | W3C 표준 | W3C 기반 | 벤더 종속 |
| **추론** | HermiT, Pellet | SPARQL + 추론 | 제한적 (Neosemantics) |
| **관계** | 이진 관계만 | 이진 관계 | n-ary (관계에 속성 부여) |
| **쿼리** | SPARQL | SPARQL | Cypher |
| **확장성** | 대규모 시 성능 이슈 | 트리플스토어 의존 | 대규모에 강점 |
| **상호운용** | 높음 | 높음 | 낮음 |

### 5.2 사례: 항공 엔진 제조 온톨로지 (Core Manufacturing Ontology)

- **구현**: OWL-DL + SWRL 규칙
- **모델링 대상**: 가공(밀링), 용접, 조립, 검사 공정의 시퀀스와 병렬성
- **쿼리**: SQWRL(Semantic Query Web Rule Language)로 작업 유형별 조회, 시퀀스 추론, 병렬 가공 가능성 탐지
- **검증**: 실제 항공 엔진 팬 케이스 부품에 적용하여 공정 순서와 제약 검증

출처: [Core Manufacturing Ontology - Coventry Univ.](https://pure.coventry.ac.uk/ws/files/80673725/Pure_Shah_2023_AAM_1_.pdf)

### 5.3 Python 도구 생태계

| 도구 | 용도 | 핵심 기능 |
|------|------|---------|
| **Owlready2** | OWL 조작 | OWL 2.0, HermiT 추론, SQLite 백엔드 |
| **RDFlib** | RDF 처리 | SPARQL 1.1, 다양한 직렬화 |
| **py2neo / neo4j-driver** | Neo4j 연동 | Cypher 쿼리, Property Graph |

**실용 조합**: Owlready2(스키마+추론) → RDFlib(SPARQL+직렬화) → Neo4j(대규모 인스턴스+시각화)

출처: [Owlready2 - PyPI](https://pypi.org/project/owlready2/), [RDFlib Docs](https://rdflib.readthedocs.io/en/6.1.1/)

---

## 6. Knowledge Graph + 제조 도메인 결합

### 6.1 산업 Knowledge Graph의 주요 활용

| 활용 분야 | 설명 | 효과 |
|----------|------|------|
| **예측적 자산 인텔리전스** | 센서, 절차, 이력 데이터를 KG로 연결하여 고장 진단·해결 | 다운타임 최대 40% 감소 |
| **지식 추출 및 재사용** | 운전자의 암묵지를 생산 데이터에서 추출 | 파라미터 설정 오류 감소 |
| **공정 최적화** | 항공 엔진 블레이드 윤곽 가공 KG | 오차 0.073→0.062mm, 합격률 81.3→85.2% |
| **고장 진단 및 유지보수** | 장비 이력·관계를 그래프로 추적 | 자동화된 문제 해결 |

Gartner 예측: 2025년까지 데이터 혁신의 80%가 그래프 기술을 활용할 것.

### 6.2 주요 산업 플랫폼

| 플랫폼 | 제공자 | 특징 |
|--------|-------|------|
| **Industrial Knowledge Graph** | Siemens | PLM/MES 통합, 스킬 기반 생산 매칭 |
| **Cognite Data Fusion** | Cognite | 데이터 관계 추출, 산업 표준 준수 |
| **Altair Graph Studio** | Altair (구 Anzo) | 검사 보고서 분석, LLM 강화 부식 감지 |
| **SymphonyAI** | SymphonyAI | 예측 분석, 운영 데이터 연결 |
| **Neusoft Industrial KG** | Neusoft | 발전소용 그래프 쿼리/추론/의사결정 |

출처: [Ontotext - KG in Manufacturing](https://www.ontotext.com/blog/knowledge-graphs-in-manufacturing/), [MathCo - Manufacturing Intelligence](https://mathco.com/article/knowledge-graphs-connecting-the-dots-in-manufacturing-intelligence/), [SymphonyAI](https://www.symphonyai.com/glossary/industrial/industrial-knowledge-graph-industrial-data-fabric/)

### 6.3 Siemens Industrial Knowledge Graph 상세

- Siemens의 디지털화 전략 핵심 요소로서 KG를 제조에 통합
- **온톨로지 기반**: ISA-95, ISA-88 표준 통합, ECLASS 정렬, QUDT 단위 체계 사용
- **Smart Manufacturing Planning**: AI 추론으로 기계 스킬을 생산 요청에 매칭, 계획자 작업 시간 단축
- **Smart Manufacturing Execution**: PLM/MES 소프트웨어·하드웨어와 통합, lot-size-one 생산 구현
- **플랫폼**: metaphactory 기반 KG 관리, 시맨틱 검색, 시각화, 추론

출처: [Siemens Ontologies - OntoCommons](https://ontocommons.eu/sites/default/files/20210607_MajaMilicicBrandt_Ontocommons.pdf), [Siemens + metaphactory Case Study](https://metaphacts.com/images/PDFs/case-studies/metaphacts-Case-Study-Smart-Manufacturing-at-Siemens-with-metaphactory-Knowledge-Graph-Platform.pdf), [CEUR-WS Use Cases](https://ceur-ws.org/Vol-2180/paper-86.pdf)

---

## 7. Digital Twin과 온톨로지 연계

### 7.1 Digital Twin의 온톨로지 계층

NIST 제안 프레임워크 (ISO 23247 기반):

| 계층 | 온톨로지 | 역할 |
|------|---------|------|
| Top-level | BFO (ISO/IEC 21838) | 도메인 독립 기본 개념 |
| Mid-level | IOF Core | 제조 공통 개념 |
| Domain-level | 제조 DT 온톨로지 | Observable Manufacturing Elements (OMEs) |
| Application-level | 특정 응용 온톨로지 | 바이오제조, 기어 가공 등 |

출처: [NIST - Ontologizing DT for Manufacturing](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=936637)

### 7.2 DTDL vs OWL 비교

| 측면 | DTDL (Microsoft) | OWL (W3C) |
|------|------------------|-----------|
| **형식** | JSON 기반 | RDF/XML, Turtle |
| **초점** | IoT/Azure DT 운영 | 시맨틱 웹, 지식 표현 |
| **추론** | 제한적 | 형식 논리 추론 (HermiT, Pellet) |
| **강점** | 확장성, 실시간 분석, 클라우드 연계 | 시맨틱 깊이, 표준 준수, AI 통합 |
| **약점** | 형식 논리 부재 | 구현 복잡, 대규모 성능 이슈 |
| **적합 시나리오** | Azure 기반 운영형 DT | 연구/설명가능 AI 기반 DT |

### 7.3 AAS (Asset Administration Shell)와 온톨로지

- Industry 4.0 핵심 개념으로서 AAS는 자산의 시맨틱 모델 제공
- BFO/IOF Core 기반 온톨로지 계층과 정렬하여 시맨틱 상호운용성 확보
- 기어 가공 장비의 AAS를 온톨로지로 모델링하면 장비 능력, 가공 이력, 유지보수 정보를 통합 가능

### 7.4 자기학습 Digital Twin

- OWL 기반 KG를 GraphDB에 구현하여 센서 데이터 + CAD 모델 + 운영 메트릭 통합
- XAI(설명가능 AI)로 인과 패턴을 설명하는 자기학습 DT 구현 (Industry 4.0 Science, 2025)
- 기어 가공에 적용 시: 가공 중 진동·온도 데이터 → KG → 품질 예측 → 공정 파라미터 자동 조정

출처: [Industry 4.0 Science - DT Semantic Modeling](https://industry-science.com/en/articles/digital-twins-modeling-ai/), [arXiv - Ontologies in DT Survey](https://arxiv.org/pdf/2308.15168)

### 7.5 시장 동향

- 2023년 제조 DT 시장: $10.27B
- 2025년 예상: $21B
- 2030년 전망: $149-150B (CAGR ~47.9%)
- 효과: 개발 시간 50% 단축, 다운타임 20% 감소, 노동 비용 40% 절감 사례

출처: [Industrial Sage - DT Stats](https://www.industrialsage.com/digital-twin-manufacturing-statistics-2025/)

---

## 8. 설계-제조 연계의 산업 적용 사례

### 8.1 Siemens: Smart Manufacturing KG

- **분야**: 자동화 제조, 다품종 소량 생산
- **내용**: KG 기반으로 기계 스킬을 생산 요청에 자동 매칭. PLM/MES와 통합하여 lot-size-one 생산 구현
- **결과**: 계획자 작업 시간 단축, 제조 가능성·소재·워크플로 자동 확인
- **기술**: metaphactory, OWL 온톨로지, ISA-95/ISA-88 표준 통합

출처: [Siemens + metaphactory](https://metaphacts.com/images/PDFs/case-studies/metaphacts-Case-Study-Smart-Manufacturing-at-Siemens-with-metaphactory-Knowledge-Graph-Platform.pdf)

### 8.2 항공 엔진 블레이드 가공: KG 기반 공정 최적화

- **분야**: 항공 엔진 블레이드 윤곽 가공
- **내용**: Digital Twin + Knowledge Graph로 가공 공정 최적화
- **결과**: 윤곽 오차 0.073mm → 0.062mm, 합격률 81.3% → 85.2% (5개월간)
- **기술**: 센서 데이터 + KG + AI 추론

출처: [MDPI Sensors](https://www.mdpi.com/1424-8220/24/8/2618)

### 8.3 MARON: 제조 자원 온톨로지 전문가 시스템

- **분야**: 제조 설계 통합 (제조 가능성 분석)
- **내용**: MARON(Manufacturing Restriction Ontology)으로 자원, 공정, 작업, 제약을 구조화. SWRL 규칙으로 자동 제조 가능성 판정 및 자원 추천
- **결과**: 전체 공정 체인에 대한 자동화된 의사결정 지원

출처: [Design Society - MARON](https://www.designsociety.org/download-publication/46849/structuring_and_provision_of_manufacturing_knowledge_through_the_manufacturing_resource_ontology)

### 8.4 바이오제조: 온톨로지 기반 Pharma 4.0

- **분야**: 바이오의약품 제조
- **내용**: BFO 기반 상위 + 도메인 온톨로지로 빅데이터 통합
- **결과**: 교정(calibration) 워크플로 시간 4시간 → 30분으로 단축
- **기술**: KG + 온톨로지, 장비/시스템 독립적 공정 표현

출처: [YouTube - Biomanufacturing Ontology](https://www.youtube.com/watch?v=U7lENvtiAtg)

### 8.5 Wire Harness 조립: Industry 4.0 온톨로지

- **분야**: 와이어 하네스 조립 제조
- **내용**: 온톨로지 기반 다층 네트워크 분석으로 조립 공정 정보 관리
- **결과**: Industry 4.0 환경에서 재현 가능한 정보 관리 모델 제시

출처: [Wiley - Ontology-Based Analysis](https://onlinelibrary.wiley.com/doi/10.1155/2021/8603515)

---

## 9. 한계점 및 실용성 평가

### 9.1 기술적 한계

| 한계 | 설명 | 심각도 |
|------|------|--------|
| **대규모 성능** | OWL 추론기(HermiT, Pellet)의 대규모 인스턴스 처리 시 성능 저하 | 높음 |
| **추론 한계** | OWL-DL은 open-world assumption으로 closed-world 제조 규칙 표현 제약 | 중간 |
| **N-ary 관계** | OWL의 이진 관계만으로는 "소재X + 공정Y → 품질Z" 같은 다항 관계 표현 어려움 (reification 필요) | 중간 |
| **실시간 처리** | 트리플스토어 기반 SPARQL은 실시간 제조 데이터 처리에 부적합 | 높음 |
| **불확실성** | OWL은 확률·퍼지 지식 표현 불가. 제조 현장의 경험적 지식 포착 한계 | 중간 |

### 9.2 실무적 장벽

| 장벽 | 설명 |
|------|------|
| **구축 비용** | 온톨로지 설계·구축에 전문 인력(온톨로지 엔지니어 + 도메인 전문가) 필요. 높은 초기 투자 |
| **유지보수 부담** | 온톨로지 인스턴스(공구, 소재, 기계 등) 갱신이 수작업 중심 |
| **암묵지 포착 한계** | 숙련공의 경험적 지식은 형식화 어려움 |
| **표준화 분절** | MASON, MSDL, IOF Core 등 온톨로지 간 정렬(alignment) 미완성 |
| **ROI 불명확** | 학술 연구 위주, 산업 현장에서의 ROI 증명 사례 부족 |
| **데이터 품질** | 센서·ERP 데이터의 품질 미흡 시 온톨로지 효과 반감 |

### 9.3 기어 도메인 특유의 한계

- 기어 전용 온톨로지가 부재하여 처음부터 구축 필요
- 기어 가공 전용 공정(hobbing, shaping, power skiving 등)이 기존 온톨로지(STEP-NC 등)에 포함되지 않음
- 기어 품질 등급(ISO 1328, AGMA)의 시맨틱 표준화 미흡
- 기어 설계-가공 연계 지식은 업체별 노하우로 공개 데이터 부족

### 9.4 실용성 평가 종합

| 평가 항목 | 등급 | 근거 |
|----------|------|------|
| 기술적 성숙도 | ★★★☆☆ | OWL/RDF 기반 도구·표준은 성숙. 제조 도메인 특화 온톨로지는 발전 중 |
| 산업 채택 수준 | ★★☆☆☆ | Siemens 등 선도 기업 외에는 제한적 |
| 기어 도메인 적용 가능성 | ★★★☆☆ | 표현 가능하나 전용 온톨로지 부재. 구축 시 높은 가치 |
| ROI 입증 | ★★☆☆☆ | 항공 블레이드(오차 개선), 바이오(시간 단축) 외 정량적 사례 부족 |
| LLM 결합 잠재력 | ★★★★☆ | 온톨로지+LLM 결합 시 환각 대폭 감소, 자동화 가능 |

---

## 10. LLM + 온톨로지 방법론

### 10.1 LLM의 온톨로지 활용 4대 패러다임

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **RAG + KG** | KG에서 트리플 검색 → LLM 컨텍스트 주입 | 환각 감소 | 검색 품질 의존 |
| **Structured Prompting** | 온톨로지 스키마를 프롬프트에 포함 | 구조화된 출력 | 토큰 소모 |
| **Tool Use (SPARQL/Cypher)** | LLM이 쿼리 생성 → 실행 → 결과 해석 | 정확한 데이터 접근 | 쿼리 오류 가능 |
| **Ontology-Grounded Generation** | 온톨로지가 생성 과정을 제약 | 환각 대폭 감소 | 유연성 저하 |

### 10.2 LLM의 온톨로지 생성 (Ontology Engineering)

**최신 연구 (2025)**:

- **Ontogenia 방법론** (arXiv, 2025.03): Competency Question(CQ)을 점진적으로 온톨로지에 통합. OpenAI o1-preview + Ontogenia 조합이 최고 성능
- **LLMs4OL Challenge 2차** (TIB-Op, 2025): LLM 기반 온톨로지 학습 공유 과제. 프롬프트 엔지니어링, RAG, 앙상블 학습 전략 평가
- **도메인 독립 워크플로** (CEUR-WS): 인간-LLM 협업 온톨로지 확장. 커스터마이징 가능한 프롬프트로 도메인 전문가와 협업

**성능 평가**:
- LLM은 단일 데이터/객체 속성에 강함
- reification과 restriction 모델링은 아직 약점
- 초보 온톨로지 엔지니어 수준의 결과 산출 가능

출처: [arXiv - Ontology Generation with LLMs](https://arxiv.org/abs/2503.05388), [TIB-Op - LLMs4OL 2025](https://www.tib-op.org/ojs/index.php/ocp/article/view/2913), [CEUR-WS - OE with LLMs](https://ceur-ws.org/Vol-4020/Paper_ID_8.pdf)

### 10.3 LLM의 온톨로지 쿼리 생성

- LLM이 자연어 질문을 SPARQL/Cypher 쿼리로 변환
- 제조 도메인 예시: "SCM420 소재로 AGMA Q11 이상 달성 가능한 공정 조합은?" → SPARQL 생성 → 트리플스토어 실행

### 10.4 온톨로지 추론 vs LLM 추론의 하이브리드

| 기준 | 온톨로지 추론 | LLM 추론 |
|------|------------|---------|
| 논리적 엄밀성 | 강함 (형식 논리) | 약함 (확률적) |
| 설명가능성 | 높음 | 낮음 |
| 도메인 일반화 | 낮음 | 높음 |
| 자연어 처리 | 불가 | 강함 |
| 불완전 지식 | 약함 | 강함 (유추) |

**하이브리드 최적**: 고신뢰도 매핑(소재→공정→품질)은 온톨로지 추론, 불확실한 경우(새로운 소재, 비표준 공정)는 LLM으로 에스컬레이션

### 10.5 핵심 연구 성과

| 연구 | 연도 | 핵심 결과 |
|------|------|---------|
| Ontology-grounded KG for Clinical QA | 2025 | ChatGPT-4 환각률 63% → 1.7%로 감소 |
| GraphRAG for Finance | 2025 | 환각 6% 감소, 토큰 사용 80% 감소 |
| Digital Twin + KG for Manufacturing | 2024 | 블레이드 오차 0.073→0.062mm, 합격률 +3.9%p |
| LLMs for Ontology Engineering Survey | 2025 | Few-shot GPT-4/Claude가 supervised 모델과 동등/우수 |
| Ontogenia (Ontology Generation) | 2025 | 요구사항에서 직접 OWL 초안 생성 가능 |

출처: [PubMed - Ontology-grounded KG](https://pubmed.ncbi.nlm.nih.gov/41610815/), [ACL - GraphRAG](https://aclanthology.org/2025.genaik-1.6/), [MDPI - DT+KG Manufacturing](https://www.mdpi.com/1424-8220/24/8/2618), [SWJ - LLMs for OE](https://www.semantic-web-journal.net/system/files/swj3864.pdf)

### 10.6 기어 도메인에서의 LLM+온톨로지 적용 시나리오

1. **온톨로지 초안 생성**: LLM에 기어 설계 교재의 핵심 개념과 CQ를 제공 → OWL 초안 자동 생성
2. **지식 인스턴스 추출**: 기어 제조 매뉴얼/카탈로그에서 LLM이 개체(인스턴스)와 관계 추출
3. **자연어 쿼리**: "모듈 2.5, SCM420, 침탄담금질 조건에서 최적 호브 선정" → SPARQL 변환 → 실행
4. **설계 검증**: 온톨로지 제약 조건을 LLM이 자연어로 설명하며 설계 오류 지적
5. **공정 추천**: 기어 사양 입력 → 온톨로지 기반 1차 추론 → LLM이 대안·트레이드오프 제시

---

## 부록: 전체 출처 목록

### 표준 및 온톨로지
- [ISO 10303 - Wikipedia](https://en.wikipedia.org/wiki/ISO_10303)
- [STEP at NIST](https://www.nist.gov/ctl/smart-connected-systems-division/smart-connected-manufacturing-systems-group/step-nist)
- [MASON - IEEE Xplore](https://ieeexplore.ieee.org/document/1633441/)
- [mason.owl - SourceForge](https://sourceforge.net/projects/mason-onto/)
- [MSDL - ASU](https://labs.engineering.asu.edu/semantics/ontology-download/msdl-ontology/)
- [OntoSTEP - NIST](https://www.nist.gov/publications/ontostep-owl-dl-ontology-step?pub_id=901544)
- [STP2OWL - GitHub](https://github.com/usnistgov/STP2OWL)
- [ROMAIN - Applied Ontology](https://journals.sagepub.com/doi/10.3233/AO-190208)
- [IOF Core - NIST](https://www.nist.gov/publications/industrial-ontologies-foundry-iof-core-ontology)
- [IOF Core - CEUR-WS](https://ceur-ws.org/Vol-3240/paper3.pdf)
- [BFO-2020 - GitHub](https://github.com/BFO-ontology/BFO-2020)
- [STEP-NC - Wikipedia](https://en.wikipedia.org/wiki/STEP-NC)
- [Manufacturing Ontologies Review 2024 - Springer](https://link.springer.com/article/10.1007/s10845-024-02425-z)

### 기어 및 가공
- [KHK Gear Terminology](https://khkgears.net/new/gear_knowledge/abcs_of_gears-b/basic_gear_terminology_calculation.html)
- [Xometry Gear Cutting](https://www.xometry.com/resources/machining/gear-cutting/)
- [Ontological Assembly of Gearbox - Kang Li](https://kangli.me/_resrc/doc/projects/ONT.pdf)

### CAPP 및 공정 계획
- [CAD/CAPP Feature Ontology - Semantic Scholar](https://www.semanticscholar.org/paper/CAD-CAPP-Integration-using-Feature-Ontology-Dartigues-Pallez-Ghodous/52771fc15a2ef3b2b3014f4647f06e5b6ae75268)
- [Core Manufacturing Ontology - Coventry Univ.](https://pure.coventry.ac.uk/ws/files/80673725/Pure_Shah_2023_AAM_1_.pdf)
- [IIIE Review 2020-2025](https://www.sciltp.com/journals/jetia/articles/2511002373)

### 공구 선정
- [Cutter Selection Ontology - AMM](https://www.scientific.net/AMM.799-800.1450)
- [Novel Cutting Tool Selection - ProQuest](https://search.proquest.com/openview/9da9390c063307a05de8a1dc9d2325d6/1)

### Knowledge Graph
- [Siemens Ontologies - OntoCommons](https://ontocommons.eu/sites/default/files/20210607_MajaMilicicBrandt_Ontocommons.pdf)
- [Siemens + metaphactory Case Study](https://metaphacts.com/images/PDFs/case-studies/metaphacts-Case-Study-Smart-Manufacturing-at-Siemens-with-metaphactory-Knowledge-Graph-Platform.pdf)
- [Siemens Industrial KG Use Cases - CEUR-WS](https://ceur-ws.org/Vol-2180/paper-86.pdf)
- [Ontotext - KG in Manufacturing](https://www.ontotext.com/blog/knowledge-graphs-in-manufacturing/)
- [MathCo - Manufacturing Intelligence](https://mathco.com/article/knowledge-graphs-connecting-the-dots-in-manufacturing-intelligence/)

### Digital Twin
- [NIST - Ontologizing DT for Manufacturing](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=936637)
- [Industry 4.0 Science - DT Semantic Modeling](https://industry-science.com/en/articles/digital-twins-modeling-ai/)
- [arXiv - Ontologies in DT Survey](https://arxiv.org/pdf/2308.15168)
- [Microsoft Fabric - DT Modeling](https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/concept-modeling)

### 산업 적용 사례
- [MARON - Design Society](https://www.designsociety.org/download-publication/46849/structuring_and_provision_of_manufacturing_knowledge_through_the_manufacturing_resource_ontology)
- [Wire Harness Ontology - Wiley](https://onlinelibrary.wiley.com/doi/10.1155/2021/8603515)
- [MDPI - DT+KG Manufacturing](https://www.mdpi.com/1424-8220/24/8/2618)

### LLM + 온톨로지
- [Ontology Generation with LLMs - arXiv](https://arxiv.org/abs/2503.05388)
- [LLMs4OL 2025 - TIB-Op](https://www.tib-op.org/ojs/index.php/ocp/article/view/2913)
- [OE with LLMs - CEUR-WS](https://ceur-ws.org/Vol-4020/Paper_ID_8.pdf)
- [LLMs in Ontology Effectiveness - SRELS](https://www.srels.org/index.php/sjim/article/view/171792)
- [Ontologies in LLM Era - Sage](https://journals.sagepub.com/doi/abs/10.3233/AO-230072)
- [PubMed - Ontology-grounded KG](https://pubmed.ncbi.nlm.nih.gov/41610815/)
- [ACL - GraphRAG](https://aclanthology.org/2025.genaik-1.6/)
- [SWJ - LLMs for OE](https://www.semantic-web-journal.net/system/files/swj3864.pdf)

### 도구
- [Owlready2 - PyPI](https://pypi.org/project/owlready2/)
- [RDFlib Docs](https://rdflib.readthedocs.io/en/6.1.1/)
- [Neo4j RDF Reasoning](https://neo4j.com/blog/knowledge-graph/neo4j-rdf-graph-database-reasoning-engine/)
- [KG-LLM-Papers - GitHub](https://github.com/zjukg/KG-LLM-Papers)
