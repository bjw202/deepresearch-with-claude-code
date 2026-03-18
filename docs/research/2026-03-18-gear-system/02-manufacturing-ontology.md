# 기어 제조 온톨로지 및 지식 체계 심층 리서치

## 1. 기존 제조 온톨로지

### 1.1 MASON (MAnufacturing's Semantics ONtology)

- **형식**: OWL-DL, 약 270개 기본 개념, 50개 속성(property)
- **구조**: 3개 주요 상위 클래스
  - **Entity**: 제품을 기술하는 추상적 개념 (형상, 특징 등)
  - **Operation**: 제조 공정/가공 작업
  - **Resource**: 기계, 도구 등 제조 자원
- **용도**: 자동 원가 추정, 의미 인지 멀티에이전트 제조 시스템
- **소스코드**: SourceForge에 mason.owl 공개
- **평가**: 제조 상위 온톨로지로서 구조가 명확하나, 기어 특화 개념은 없음. 확장 기반으로 적합.

출처: [IEEE Xplore](https://ieeexplore.ieee.org/document/1633441/), [mason.owl - SourceForge](https://sourceforge.net/projects/mason-onto/)

### 1.2 MSDL (Manufacturing Service Description Language)

- **형식**: OWL (Description Logic 기반)
- **핵심 특징**: 서비스 지향 패러다임 기반
- **5단계 추상화**: Supplier → Shop → Machine → Device → Process
- **강점**: 높은 공리화(axiomatic) 수준, 기계 가공 서비스 중심으로 가장 포괄적
- **평가**: 기어 가공 서비스를 기술하는 데 Process-level 확장 가능. 공급자 매칭 패러다임 참고 가치.

출처: [MSDL - ASU](https://labs.engineering.asu.edu/semantics/ontology-download/msdl-ontology/), [ResearchGate](https://www.researchgate.net/publication/267486591_An_Upper_Ontology_for_Manufacturing_Service_Description)

### 1.3 ISO 14649 / STEP-NC

- **형식**: EXPRESS (ISO 10303 기반)
- **역할**: CAD/CAM/CNC 간 데이터 전송을 위한 feature-based 기계 제어 언어
- **OntoSTEP-NC**: ISO 14649를 OWL로 매핑한 온톨로지 존재
- **한계**: 밀링/선삭 중심. 기어 전용 가공(hobbing, shaping 등)은 직접 지원하지 않음.

출처: [STEP-NC - Wikipedia](https://en.wikipedia.org/wiki/STEP-NC), [OntoSTEP-NC Mapping](https://www.researchgate.net/figure/The-mapping-ontology-for-Machining-workingstep-from-ISO-14649-Machining-Object-with-OWL_fig2_273825945)

### 1.4 STEP AP203 / AP214 / AP242

| 항목 | AP203 | AP214 | AP242 |
| --- | --- | --- | --- |
| 초점 | 항공우주, 순수 3D 형상 | 자동차, 색상/레이어 추가 | 통합, PMI 포함 |
| GD&T | 폴리라인(비의미적) | 폴리라인 | 기계 판독 가능 시맨틱 |
| 상태 | 폐지(2014) | 폐지(2014) | 현행 표준 (Ed.2) |

- 기어 형상: B-rep/NURBS로 표현 가능. 기어 파라미터(모듈, 압력각 등)의 시맨틱 표현 엔티티는 없음.
- AP242의 시맨틱 PMI가 기어 품질 검사 데이터 교환에 유리.

출처: [MechProfessor](https://mechprofessor.com/step-ap203-vs-ap214-vs-ap242/), [Capvidia](https://www.capvidia.com/blog/best-step-file-to-use-ap203-vs-ap214-vs-ap242)

### 1.5 OntoSTEP

- **역할**: STEP EXPRESS 스키마 + 인스턴스(P21)를 OWL-DL로 변환
- **도구**: STP2OWL (NIST GitHub 공개)
- **평가**: 기어 STEP 파일을 OWL로 변환하여 온톨로지에 통합하는 파이프라인 구축 가능.

출처: [NIST](https://www.nist.gov/publications/ontostep-owl-dl-ontology-step?pub_id=901544), [STP2OWL - GitHub](https://github.com/usnistgov/STP2OWL)

### 1.6 기어 전용 온톨로지

**조사 결과: 공개된 기어 전용 온톨로지(OWL 기반)는 발견되지 않음.**

- 지식 기반 형상 생성 시스템은 있으나 표준 온톨로지 형태는 부재.
- **결론**: 기어 전용 온톨로지는 새로 구축해야 하며, MASON의 상위 구조를 확장하는 접근이 적합.

### 1.7 2024 제조 온톨로지 종합 서베이

Sapel et al. (2024), Journal of Intelligent Manufacturing:

- 65개 제조 온톨로지 분류/정리
- 상위/중위 온톨로지, 도메인 온톨로지, 지원 온톨로지로 분류
- 온톨로지 재사용 우선순위 가이드라인 제공

출처: [Springer](https://link.springer.com/article/10.1007/s10845-024-02425-z)

---

## 2. 기어 제조 도메인 지식 구조화

### 2.1 기어 설계 파라미터 체계

3대 기본 요소: **모듈(m)**, **압력각(α)**, **이수(z)**

| 파라미터 | 기호 | 설명 | 관계식 |
| --- | --- | --- | --- |
| 모듈 | m | 이 크기 결정 | m = d/z |
| 압력각 | α | 기초원 결정 | 맞물림률에 영향 |
| 이수 | z | 치의 개수 | \- |
| 피치원 지름 | d | 기준 원 | d = m × z |
| 비틀림각 | β | 헬리컬 기어 | 0°= 스퍼 |
| 전위계수 | x | 치형 전위량 | 언더컷 방지 |
| 이너비 | b | 치의 폭 | 하중 분포 영향 |
| 이끝원 | da | 이끝 직경 | da = d + 2m |
| 이뿌리원 | df | 이뿌리 직경 | df = d - 2.5m |

### 2.2 기어 제조 공정 종류 및 특성

| 공정 | 원리 | 적합 기어 | 정밀도(AGMA) | 생산성 |
| --- | --- | --- | --- | --- |
| **Hobbing** | 호브 회전 절삭 | 외부 스퍼, 헬리컬, 웜 | Q8-10 | 대량생산 최적 |
| **Shaping** | 피니언 커터 왕복 | 내부/외부 스퍼, 헬리컬 | Q8-10 | 소량/내부기어 |
| **Grinding** | 연삭 | 모든 유형 (2차 가공) | Q11+ | 최종 정밀가공 |
| **Shaving** | 셰이빙 커터 | 외부 스퍼, 헬리컬 | Q10-11 | 열처리 전 정밀화 |
| **Lapping** | 래핑 (쌍으로) | 베벨 기어 | 표면조도 개선 | 소음 감소 |
| **Honing** | 호닝 공구 | 경화 기어 | 표면 마감 | 열처리 후 |
| **Broaching** | 연속 절삭 | 내부 기어 | 높음 | 대량생산 |
| **Power Skiving** | 연속 절삭 | 내부/외부 | ISO 6-8 | Shaping 2-3배 |

### 2.3 공정-기어 유형 매핑

| 기어 유형 | 1차 공정 | 2차/대안 공정 |
| --- | --- | --- |
| 외부 스퍼 | Hobbing | Shaping, Milling, Broaching |
| 외부 헬리컬 | Hobbing | Shaping |
| 내부 스퍼 | Shaping | Broaching, Power Skiving |
| 직선 베벨 | Planing/Shaping | Milling |
| 스파이럴 베벨 | Face milling/hobbing | Lapping (마감) |
| 웜 기어 | Hobbing (웜), Hobbing/Shaping (웜휠) | \- |
| 랙 | Shaping, Milling | Broaching |

### 2.4 공구 선정 기준

**호브(Hob)**: 모듈 = 기어 모듈 (동일 필수), 압력각 = 기어 압력각, 4대 표기: Pitch, Pressure Angle, Whole Depth, Helix Angle

**셰이퍼 커터**: 모듈/압력각 일치 필수. 내부 기어 시 커터 직경 &lt; 기어 내경.

**연삭 휠**: Profile grinding vs Generating grinding. 입도/결합제는 소재 경도에 따라.

### 2.5 소재-공정-품질 관계

| 소재 | 열처리 | 1차 가공 | 2차 가공 | 달성 품질 |
| --- | --- | --- | --- | --- |
| S45C (탄소강) | 조질 | Hobbing | Shaving | AGMA Q10 |
| SCM420 (합금강) | 침탄담금질 | Hobbing | Grinding | AGMA Q11+ |
| SUS304 (스테인리스) | \- | Hobbing/Shaping | \- | AGMA Q8-9 |
| MC Nylon | \- | Hobbing | \- | AGMA Q7-8 |
| 소결 합금 | 소결 | PM 성형 | 사이징 | AGMA Q7-8 |

---

## 3. 온톨로지 구현 기술

### 3.1 OWL/RDF vs Knowledge Graph vs Property Graph

| 기준 | OWL/RDF | Knowledge Graph (RDF) | Property Graph (Neo4j) |
| --- | --- | --- | --- |
| **표준화** | W3C 표준 | W3C 기반 | 벤더 종속 |
| **추론** | HermiT, Pellet | SPARQL + 추론 | 제한적 (Neosemantics) |
| **관계** | 이진 관계만 | 이진 관계 | n-ary (관계에 속성 부여) |
| **쿼리** | SPARQL | SPARQL | Cypher |
| **확장성** | 대규모 시 성능 이슈 | 트리플스토어 의존 | 대규모에 강점 |
| **상호운용** | 높음 | 높음 | 낮음 |

**제조 분야 실사용**: 기존 온톨로지(MASON, MSDL, OntoSTEP) 모두 OWL. Industry 4.0에서는 KG 형태 증가.

**권장**: OWL로 스키마 정의 → Property Graph로 런타임 쿼리 (하이브리드)

### 3.2 Python 온톨로지 도구

| 도구 | 용도 | 핵심 기능 |
| --- | --- | --- |
| **Owlready2** | OWL 조작 | OWL 2.0, HermiT 추론, SQLite 백엔드 |
| **RDFlib** | RDF 처리 | SPARQL 1.1, 다양한 직렬화 |
| **py2neo / neo4j-driver** | Neo4j 연동 | Cypher 쿼리, Property Graph |

**실용 조합**: Owlready2(스키마+추론) → RDFlib(SPARQL+직렬화) → Neo4j(대규모 인스턴스+시각화)

---

## 4. 온톨로지 + LLM 결합 연구

### 4.1 결합 방식

| 방식 | 설명 | 장점 | 단점 |
| --- | --- | --- | --- |
| **RAG + KG** | KG에서 트리플 검색 → LLM 컨텍스트 주입 | 환각 감소 | 검색 품질 의존 |
| **Structured Prompting** | 온톨로지 스키마를 프롬프트에 포함 | 구조화된 출력 | 토큰 소모 |
| **Tool Use** | LLM이 SPARQL/Cypher 쿼리 생성 | 정확한 데이터 접근 | 쿼리 오류 가능 |
| **Ontology-Grounded** | 온톨로지가 생성 과정을 제약 | 환각 대폭 감소 | 유연성 저하 |

### 4.2 온톨로지 추론 vs LLM 추론

| 기준 | 온톨로지 추론 | LLM 추론 |
| --- | --- | --- |
| 논리적 엄밀성 | 강함 (형식 논리) | 약함 (확률적) |
| 설명가능성 | 높음 | 낮음 |
| 도메인 일반화 | 낮음 | 높음 |
| 자연어 처리 | 불가 | 강함 |
| 불완전 지식 | 약함 | 강함 (유추) |

**하이브리드 최적**: 고신뢰도 매핑은 온톨로지 추론, 불확실한 경우는 LLM 에스컬레이션.

### 4.3 핵심 연구 성과

1. **Ontology-grounded KG for Clinical QA** (2025): ChatGPT-4 환각률 \*\*63% → 1.7%\*\*로 감소. [PubMed](https://pubmed.ncbi.nlm.nih.gov/41610815/)
2. **GraphRAG for Finance** (2025): 환각 6% 감소, **토큰 사용 80% 감소**. [ACL](https://aclanthology.org/2025.genaik-1.6/)
3. **Digital Twin + KG for Manufacturing** (2024): 항공 블레이드 윤곽 오차 0.073→0.062mm, 합격률 81.3→85.2%. [MDPI](https://www.mdpi.com/1424-8220/24/8/2618)
4. **LLMs for Ontology Engineering Survey** (2025): Few-shot GPT-4/Claude가 supervised 모델과 동등/우수한 정확도. [SWJ](https://www.semantic-web-journal.net/system/files/swj3864.pdf)

---

## 출처 목록

- [MASON - IEEE Xplore](https://ieeexplore.ieee.org/document/1633441/)
- [mason.owl - SourceForge](https://sourceforge.net/projects/mason-onto/)
- [MSDL - ASU](https://labs.engineering.asu.edu/semantics/ontology-download/msdl-ontology/)
- [STEP-NC - Wikipedia](https://en.wikipedia.org/wiki/STEP-NC)
- [OntoSTEP - NIST](https://www.nist.gov/publications/ontostep-owl-dl-ontology-step?pub_id=901544)
- [STP2OWL - GitHub](https://github.com/usnistgov/STP2OWL)
- [Manufacturing Ontologies Review 2024 - Springer](https://link.springer.com/article/10.1007/s10845-024-02425-z)
- [KHK Gear Terminology](https://khkgears.net/new/gear_knowledge/abcs_of_gears-b/basic_gear_terminology_calculation.html)
- [Gear Cutting - Xometry](https://www.xometry.com/resources/machining/gear-cutting/)
- [Owlready2 - PyPI](https://pypi.org/project/owlready2/)
- [RDFlib Documentation](https://rdflib.readthedocs.io/en/6.1.1/)
- [Neo4j RDF Reasoning](https://neo4j.com/blog/knowledge-graph/neo4j-rdf-graph-database-reasoning-engine/)
- [Neosemantics](https://neo4j.com/labs/neosemantics/4.0/importing-ontologies/)
- [KG-LLM-Papers - GitHub](https://github.com/zjukg/KG-LLM-Papers)