# 제조 온톨로지와 AI/LLM 기술의 수렴

> AI 엔지니어가 제조 온톨로지를 어떻게 활용할 수 있는가

---

## 1. 전통적 온톨로지 + AI 접점

### 1.1 지식그래프 기반 추론 (Knowledge Graph Reasoning)

제조 온톨로지(MASON, PSL, FTOnto 등)는 본래 **OWL-DL 기반의 형식 추론**(formal reasoning)을 위해 설계되었다. SPARQL 쿼리와 SWRL 규칙으로 공정 제약, 비용 추정, 공급자 탐색 같은 의사결정을 자동화하는 것이 1세대 활용 방식이다.

**Bosch 사례**: 제조 온톨로지(95개 클래스, 70개 객체 속성, 1,170개 공리)를 저항 점용접(RSW) 품질 모니터링에 적용했다. 431만 건의 용접 기록을 온톨로지로 구조화하고, knowledge graph embedding으로 ML 파이프라인에 연결했다. 이 시스템은 온톨로지가 **ML의 feature space를 정의하는 뼈대** 역할을 한 사례다[^bosch-welding].

**Ford 사례**: 차량 조립 공정 지식을 온톨로지로 저장하고, 내부 AI 시스템이 조립 프로세스 계획(assembly process planning)을 수행한다. 연합 온톨로지(federated ontology)로 공급망 리스크도 식별한다[^thales-paper].

[^bosch-welding]: Zhou et al., "Executable Knowledge Graphs for Machine Learning: A Bosch Case of Welding Monitoring," ISWC 2022.
[^thales-paper]: Music et al., "Integrating LLMs and Knowledge Graphs for Extraction and Validation of Data in Aerospace Manufacturing," arXiv:2408.01700, 2024.

### 1.2 온톨로지 기반 ML Feature Engineering

온톨로지가 ML에 기여하는 가장 실용적인 방식은 **feature engineering의 의미적 뼈대**를 제공하는 것이다.

- **변수 선택**: 온톨로지의 클래스 계층이 어떤 센서 데이터가 어떤 공정 파라미터와 연결되는지 정의한다
- **관계 인코딩**: 장비-공정-제품 사이의 관계를 그래프 구조로 표현하여 GNN(Graph Neural Network) 입력으로 활용한다
- **도메인 제약 주입**: 물리적으로 불가능한 조합을 온톨로지 공리(axiom)로 필터링하여 모델의 탐색 공간을 줄인다

> **의사결정 연결**: 기존 제조 데이터가 이기종 시스템(MES, ERP, SCADA)에 흩어져 있을 때, 온톨로지는 이들을 **의미 기반으로 통합하는 스키마** 역할을 한다. Bosch의 Virtual Knowledge Graph 접근법이 대표적이다—물리적 데이터 이동 없이 온톨로지 매핑만으로 SMT(Surface Mounting) 파이프라인 데이터를 통합 질의한다[^bosch-vkg].

[^bosch-vkg]: Kalayci et al., "Semantic Integration of Bosch Manufacturing Data Using Virtual Knowledge Graphs," ISWC 2020.

---

## 2. LLM 시대의 온톨로지: 대체인가, 보완인가?

### 2.1 핵심 질문의 프레이밍

"LLM이 온톨로지를 대체하는가?"라는 질문은 잘못된 이분법이다. LLM과 온톨로지는 **상보적(complementary)** 특성을 가진다.

| 차원 | LLM 강점 | 온톨로지 강점 |
|------|----------|-------------|
| 지식 표현 | 암묵적, 확률적, 연속 벡터 공간 | 명시적, 논리적, 이산 기호 체계 |
| 유연성 | 비정형 텍스트에서 패턴 추출 | 형식 추론, 일관성 검증 |
| 확장성 | 대규모 코퍼스에서 자동 학습 | 전문가 검증된 도메인 지식 |
| 약점 | 환각(hallucination), 비결정적 | 구축 비용, 유지보수 부담 |
| 검증 가능성 | 블랙박스 | 감사 추적(audit trail) 가능 |

**출처**: Hanna et al., "Augmented Non-Hallucinating LLMs as Medical Information Systems," PMC, 2024. 의료 도메인 연구이나, LLM-KG 상보성 프레임워크는 제조 도메인에도 직접 적용 가능하다. [인접 도메인: 의료 정보학] — 제조는 의료보다 규제 수준이 낮지만, 안전 관련 공정(용접, 열처리)에서는 유사한 감사 추적 요구가 존재한다.

### 2.2 시장 데이터가 말하는 것

온톨로지 기반 지식그래프 시장은 LLM 시대에 오히려 **급성장** 중이다:

- **2024년**: USD 10.7억 → **2030년**: USD 69.4억 (CAGR 36.6%, MarketsAndMarkets)
- **2025년**: USD 14.8억 → **2034년**: USD 257억 (CAGR 37.3%, Fortune Business Insights)

이 성장은 LLM 파이프라인의 **그라운딩(grounding) 인프라**로서 온톨로지/KG 수요가 증가했기 때문이다. 반증 미발견: 온톨로지/KG 시장이 축소되고 있다는 데이터는 발견하지 못했다.

### 2.3 결론: 보완 관계

LLM은 온톨로지를 대체하지 않는다. 오히려 **온톨로지의 구축과 활용을 가속**하고, 온톨로지는 **LLM의 신뢰성을 보강**한다. 이 상호작용의 구체적 기술 접점을 다음 장에서 다룬다.

---

## 3. 구체적 기술 접점

### 3.1 Knowledge Graph + LLM: RAG와 GraphRAG

#### 표준 RAG의 한계와 GraphRAG의 등장

표준 RAG(Retrieval-Augmented Generation)는 텍스트 청크를 벡터 DB에 저장하고 유사도 검색으로 LLM에 컨텍스트를 제공한다. 제조 도메인에서 이 방식의 한계는 명확하다:

- 장비-공정-부품 사이의 **구조적 관계**를 평탄화(flatten)한다
- 다단계 추론(multi-hop reasoning)이 필요한 질문에 약하다
- 용어의 중의성(예: "정밀도"가 기계 정밀도인지 측정 정밀도인지)을 해소하지 못한다

**GraphRAG**는 지식그래프에서 관련 서브그래프를 추출하여 LLM에 제공한다. NVIDIA의 비교 분석에 따르면, GraphRAG가 VectorRAG 대비 correctness에서 우위를 보이고, HybridRAG(벡터 + 그래프 결합)가 균형 잡힌 성능을 보인다[^nvidia-graphrag].

[^nvidia-graphrag]: NVIDIA Developer Blog, "Insights, Techniques, and Evaluation for LLM-Driven Knowledge Graphs," 2024.

#### 제조 도메인의 GraphRAG 구현 사례

**1. Bosch: 제조 유지보수 챗봇을 위한 Graph RAG**

Bosch Corporate Research는 제조 유지보수를 위한 반자동 KG 구축 파이프라인을 개발했다(2025년 SEMANTiCS 워크숍 발표)[^bosch-graphrag].

- **Manufacturing Maintenance Ontology (MMO)** 개발: CIMM(Core Information Model for Manufacturing) 확장
  - 4개 하위 온톨로지: Equipment, Physical Asset, Error/Failure, Maintenance Procedure
- **KG 구축 파이프라인**: 규칙 기반 + SLM(Small Language Model) + LLM 결합
  - 규칙 기반: 구조화된 데이터(장비 계층, 에러 코드) 처리
  - SLM: 반복적 패턴 추출(비용 효율)
  - LLM: 비정형 유지보수 기록에서 원인-조치 관계 추출
- **핵심 교훈**: "고품질 KG 구축에는 앞으로도 전문가 참여가 필수적"이라고 명시. LLM만으로는 부족하며, 방법론 조합이 필요하다.

[^bosch-graphrag]: Zhang et al., "Knowledge Graph Construction towards a Graph RAG-Enhanced Intelligent Maintenance Chatbot," CEUR-WS Vol. 4064, SEMANTiCS/SKGi 2025.

**2. ASME: 제조 공급업체 발견 시스템**

ASME Journal of Computing and Information Science in Engineering에 발표된 시스템은 온톨로지 기반 GraphRAG로 중소 제조업체(SMM) 발견을 자동화한다[^asme-supplier]:

- 온톨로지 기반 트리플 추출: LLM을 fine-tuning하여 제조 역량 데이터에서 트리플 생성
- 엔티티 정규화: RAG + 제조 시소러스(thesaurus)로 용어 표준화
- **핵심 통찰**: "LLM의 역량에도 불구하고, 제조 온톨로지와 시소러스는 도메인 특화 정밀도와 맥락 적합성을 달성하는 데 여전히 필수적"

[^asme-supplier]: ASME J. Computing & Info. Sci. Eng., "Integrating Graph RAG with LLMs for SMM Supplier Discovery," 2024.

**3. OG-RAG: 온톨로지 기반 하이퍼그래프 검색**

EMNLP 2025에서 발표된 OG-RAG(Ontology-Grounded RAG)는 문서를 온톨로지에 기반한 하이퍼그래프로 표현한다[^og-rag]:

- 각 하이퍼엣지(hyperedge)가 관련 사실 지식을 그룹화
- 그리디 알고리즘으로 쿼리에 대한 최소 하이퍼엣지 집합을 검색 → LLM에 compact한 컨텍스트 제공
- 온톨로지가 검색의 정밀도를 높이고, 출처 귀속(attribution)을 가능하게 함

[^og-rag]: OG-RAG, "Ontology-Grounded Retrieval Augmented Generation for Large Language Models," EMNLP 2025.

### 3.2 온톨로지 기반 프롬프트 엔지니어링

"프롬프트 엔지니어링은 부정 당한 온톨로지 엔지니어링이다(Prompt engineering is ontology engineering in denial)"라는 Reddit AI_Agents 커뮤니티의 통찰은 핵심을 찌른다. 대규모 프롬프트가 결국 하는 일은 시스템에 존재하는 엔티티, 관계, 제약, 예외를 자유 텍스트로 기술하는 것이다.

**온톨로지 기반 프롬프트 설계의 구체적 접근법**:

#### 방법 1: 온톨로지를 프롬프트 구조의 뼈대로 사용

IRT Saint Exupery의 시스템 엔지니어링 어시스턴트는 SEIM 온톨로지를 프롬프트에 직접 주입한다[^seim]:

- 시스템 프롬프트에 온톨로지의 클래스/속성/관계를 포함
- 태스크별로 온톨로지에서 필요한 I/O 개념을 동적으로 선택
- LLM이 온톨로지에 정의된 엔티티와 관계만 사용하도록 제약

[^seim]: Gauthier et al., "Ontology-Driven LLM Assistance for Task-Oriented Systems Engineering," IRT Saint Exupéry, 2025.

#### 방법 2: 온톨로지 기반 장면 표현 → In-Context Learning

건설 현장 활동 인식 연구에서, 시각적 특징을 온톨로지 개념에 매핑하여 기호적(symbolic) 장면 표현을 만들고, 이를 few-shot 예시로 LLM에 제공한다[^construction-onto]. GPT 기반 모델로 29개 활동 유형에서 73.68% 인식 정확도를 달성했다.

[인접 도메인: 건설] — 제조 현장 모니터링에도 동일 패턴 적용 가능. 차이점: 제조는 건설보다 반복적이므로 온톨로지 커버리지가 더 높을 수 있다.

[^construction-onto]: "Ontology-based prompting with LLMs for construction activity recognition," ScienceDirect, 2025.

#### 방법 3: 온톨로지 축소(reduction) 후 컨텍스트 윈도우에 적재

제조 온톨로지 전체를 LLM 컨텍스트에 넣기에는 너무 클 수 있다. 두 가지 축소 전략이 연구되었다[^enhancing-mfg]:

| 전략 | 방법 | 장단점 |
|------|------|--------|
| Naive reduction | rdf:type, rdfs:label, rdfs:subClassOf 등 핵심 속성만 유지 | 단순하지만 맥락 손실 |
| Context-based reduction | 쿼리 관련 서브온톨로지만 RAG로 선택 | 정밀하지만 구현 복잡 |

[^enhancing-mfg]: "Enhancing Manufacturing Knowledge Access with LLMs," arXiv:2507.22619, 2025.

> **실행 연결**: AI 엔지니어가 제조 LLM 시스템을 설계할 때, 프롬프트에 넣을 도메인 지식을 "자유 텍스트 설명"이 아닌 "온톨로지 기반 구조화 표현"으로 전환하면, 프롬프트의 버전 관리, 일관성, 확장성이 크게 개선된다.

### 3.3 LLM을 이용한 온톨로지 자동 구축/확장

LLM은 온톨로지 구축의 가장 큰 병목인 **수작업 비용**을 획기적으로 낮출 수 있다.

#### 주요 파이프라인

**OntoEKG (2026)**: 엔터프라이즈 지식그래프를 위한 LLM 기반 온톨로지 구축 파이프라인[^ontoekq]:
- 추출(extraction): 비정형 데이터에서 클래스/속성 식별
- 수반(entailment): 계층 구조화 → RDF/OWL 생성
- 데이터, 금융, 물류 등 다수 도메인에서 검증
- **한계**: end-to-end 벤치마크 부재

[^ontoekq]: "LLM-Driven Ontology Construction for Enterprise Knowledge Graphs," arXiv:2602.01276, 2026.

**TNO 온톨로지 엔지니어링 프레임워크 (2024)**: GPT-4o를 expert-in-the-loop 프로세스에 투입[^tno]:
- LLM이 용어 추출, 관계 발견 등 반복 작업 수행
- 전문가가 결과를 검증하고 수정
- 농업 온톨로지(Common Greenhouse Ontology)에서 실증

[^tno]: Garcia et al., "Ontology Engineering with Large Language Models," TNO, ESWC 2024.

**LLMs4OL Challenge (ISWC 2024-2025)**: 온톨로지 학습을 위한 LLM 벤치마크 대회[^llms4ol]:
- Text2Onto: 텍스트에서 용어/타입 추출
- Taxonomy Discovery: 계층 구조 발견
- 프롬프트 엔지니어링과 fine-tuning 접근법 비교

[^llms4ol]: "Context-Rich Prompting for Ontology Construction," LLMs4OL 2025, ISWC.

**OntoGenix**: 자기 수리(self-repairing) 멀티에이전트 시스템으로 온톨로지 구축[^ontogenix]:
- PlanSage 에이전트: 데이터셋 분석 → 개념 구조 파악
- 생성 에이전트: OWL 온톨로지 생성
- 검증 에이전트: 일관성 검사 및 수정
- Schema.org 등 외부 지식과 시맨틱 상호운용성 확보

[^ontogenix]: "OntoGenix: LLM-Powered Ontology Engineering with Self-Repairing Multi-Agent Systems," Medium, 2024.

> **수치 투명성**: LLM 기반 온톨로지 구축의 정확도를 직접 비교한 대규모 벤치마크는 아직 부족하다. LLMs4OL 대회가 이 공백을 채우기 시작했지만, 제조 도메인 특화 벤치마크는 존재하지 않는다. 이 수치가 틀릴 수 있는 조건: 제조 온톨로지는 물리적 제약과 공정 시퀀스를 포함하므로, 일반 텍스트 기반 온톨로지 추출보다 난이도가 높을 수 있다.

### 3.4 제조 에이전트 시스템에서의 온톨로지 활용

#### Intent-Driven Smart Manufacturing (2025)

Mistral-7B-Instruct를 ISA-95 표준 기반 온톨로지와 결합한 통합 프레임워크[^isa95-llm]:

- 자연어 의도 → 구조화된 JSON 요구사항 모델로 변환 (instruction-tuned LLM)
- JSON 요구사항 → Neo4j 기반 지식그래프에 의미적 매핑
- ISA-95 표준이 온톨로지의 뼈대 역할
- 2,580개 주석 데이터로 fine-tuning
- **MaaS(Manufacturing-as-a-Service)** 생태계에서 의도 기반 상호작용 지원

[^isa95-llm]: "Intent-Driven Smart Manufacturing Integrating Knowledge Graphs and LLMs," arXiv:2602.12419, 2025.

#### 온톨로지의 에이전트 시스템 내 역할

제조 에이전트 시스템에서 온톨로지는 세 가지 핵심 기능을 수행한다:

1. **공유 어휘(Shared Vocabulary)**: 다중 에이전트 간 의사소통의 기반. 에이전트 A가 "드릴링"이라 하면 에이전트 B도 정확히 같은 개념을 참조
2. **행동 공간 제약(Action Space Constraint)**: 로봇/공정 에이전트의 가능한 행동을 온톨로지로 정의하여 탐색 공간을 줄임. 온톨로지 기반 task planning 연구가 이를 실증[^onto-task]
3. **상태 추적(State Tracking)**: 현재 공정 상태를 온톨로지 인스턴스로 표현하여 에이전트의 상황 인식 지원

[^onto-task]: "Ontology-driven Prompt Tuning for LLM-based Task and Motion Planning," arXiv:2412.07493, 2024.

---

## 4. Neurosymbolic AI와 제조 온톨로지

### 4.1 개념 정의

Neurosymbolic AI는 신경망(neural)의 패턴 인식 능력과 기호 체계(symbolic)의 논리적 추론 능력을 결합하는 접근법이다. 온톨로지는 이 결합에서 **기호 측의 핵심 인프라**다.

### 4.2 제조 적용 가능성

| 구성 요소 | 신경(Neural) | 기호(Symbolic) | 제조 적용 |
|-----------|-------------|---------------|----------|
| 패턴 인식 | CNN/Transformer로 센서 이상 탐지 | - | 품질 검사, 예지보전 |
| 추론 | - | 온톨로지 공리 + SWRL 규칙 | 공정 순서 검증, 규격 준수 |
| 결합 | GNN이 KG 임베딩 학습 | KG가 GNN의 관계 구조 정의 | 용접 품질 예측(Bosch 사례) |
| 설명 | LLM이 자연어 설명 생성 | 온톨로지가 추론 경로 제공 | 불량 원인 분석 보고서 |

### 4.3 현황과 전망

Gartner는 2024 AI Hype Cycle에서 neurosymbolic AI를 핵심 기술로 선정했다. WEF(World Economic Forum)는 2025년 말 neurosymbolic AI가 환각 없는 감사 가능한 결과를 산출한다고 보고했다[^wef-neuro].

- **SAP 사례**: 기호적 파싱 + 트랜스포머 결합으로 코딩 정확도 99.8% 달성 [인접 도메인: 소프트웨어 엔지니어링]
- **Franz AllegroGraph**: 지식그래프 + 신경망 추론 결합 플랫폼. 제조 온톨로지(ISO 10303 등)를 하이브리드 추론 파이프라인에 적용 가능[^franz]

반증 탐색: neurosymbolic AI가 순수 신경망 대비 제조 도메인에서 열등하다는 증거는 발견하지 못했다. 다만, 제조 특화 neurosymbolic 벤치마크가 부재하여 정량적 비교가 어렵다는 점을 유의해야 한다.

[^wef-neuro]: World Economic Forum, "The Power of Neurosymbolic AI," December 2025.
[^franz]: Franz Inc., "Recognized by Gartner as a Key Neuro-Symbolic AI Provider," 2024.

---

## 5. 실제 연구/프로젝트 사례

### 5.1 학술 연구 사례

| 프로젝트 | 기관 | 핵심 내용 | 온톨로지 역할 |
|----------|------|----------|-------------|
| Graph RAG 유지보수 챗봇 | Bosch + FU Berlin | MMO 온톨로지 + 반자동 KG 구축 → GraphRAG | KG의 스키마 정의, 엔티티 관계 구조화 |
| 항공 전자보드 검증 | Thales Alenia Space | SSN 온톨로지 확장 + LLM으로 테스트 데이터 추출/검증 | 센서/테스트 데이터의 의미 구조 제공 |
| 공급업체 발견 | ASME 저널 | 온톨로지 기반 트리플 추출 + LLM fine-tuning | 제조 역량의 표준화된 분류 체계 |
| Intent-Driven MaaS | arXiv (2025) | Mistral-7B + ISA-95 KG | 의도-공정 매핑의 의미적 기반 |
| Document GraphRAG | MDPI Electronics (2025) | 다국어 제조 문서에서 문서 KG 구축 | 청크 간 의미적 연결의 뼈대 |
| 온톨로지 기반 SPARQL 생성 | arXiv (2025) | LLM으로 제조 온톨로지에 SPARQL 쿼리 자동 생성 | 쿼리 대상의 스키마 정의 |

### 5.2 산업 배포 사례

| 기업 | 적용 영역 | 기술 스택 |
|------|----------|----------|
| **Bosch** | 용접 품질 모니터링, 전자제품 품질관리 | 제조 온톨로지 + KG embedding + 온톨로지 리셰이핑 |
| **Ford** | 조립 공정 계획, 공급망 리스크 | 연합 온톨로지 + 내부 AI 시스템 |
| **Bosch (VKG)** | SMT 데이터 통합 | Virtual Knowledge Graph + 온톨로지 매핑 |
| **Palantir Foundry** | 범용 산업 데이터 통합 | 그래프 기반 온톨로지 모델 (수동 구축 → LLM 가속 가능) |

> **관점 확장**: 현재 사례 대부분이 **대기업**(Bosch, Ford, Thales) 중심이다. 중소 제조업체의 온톨로지 도입 장벽(전문 인력 부족, ROI 불명확)은 별도로 연구가 필요한 인접 질문이다. LLM 기반 자동 온톨로지 구축이 이 장벽을 낮출 수 있는지가 핵심 변수다.

---

## 6. 반대 관점: "온톨로지는 LLM 시대에 불필요하다"

### 6.1 반대 주장의 논거

| # | 주장 | 구체적 근거 |
|---|------|-----------|
| 1 | **구축/유지 비용이 너무 높다** | 온톨로지 설계에 도메인 전문가 + 지식공학자 필요. Palantir Foundry가 스케일링에 실패한 핵심 이유 |
| 2 | **LLM이 암묵적 온톨로지를 이미 학습했다** | GPT-4 급 모델은 제조 용어, 관계, 제약을 상당 부분 내재화 |
| 3 | **RAG만으로 충분하다** | 벡터 검색 + 텍스트 청크로 대부분의 질의 응답 가능 |
| 4 | **온톨로지는 변화에 취약하다** | 새 공정/장비 추가 시 온톨로지 수정 부담 |
| 5 | **embedding이 의미를 대체한다** | 벡터 유사도가 명시적 관계 정의 없이도 의미적 근접성 포착 |

### 6.2 반박

| # | 반박 | 근거 |
|---|------|------|
| 1 | **LLM이 구축 비용을 10배 이상 낮춘다** | OntoEKG, TNO 프레임워크 등 LLM 기반 반자동 구축 파이프라인이 이미 실증됨. 수동 → expert-in-the-loop로 전환 |
| 2 | **암묵적 지식은 검증 불가** | 제조는 안전/품질 규격 준수가 필수. LLM의 암묵적 지식은 감사 추적이 불가능하여 규제 환경에서 사용 불가 |
| 3 | **RAG는 multi-hop 추론에 실패** | "A 장비에서 B 공정을 거쳐 C 부품을 만들 때의 불량률"처럼 3단계 이상 관계 추론에서 벡터 검색은 한계. GraphRAG가 이를 해결[^nvidia-graphrag] |
| 4 | **LLM이 온톨로지 진화도 자동화한다** | 새 텍스트 데이터에서 LLM이 온톨로지 확장 제안 → 전문가 승인 워크플로우 |
| 5 | **embedding은 관계를 설명하지 못한다** | 두 벡터가 가깝다는 것은 "왜" 관련되는지 설명하지 않음. 온톨로지는 관계의 유형(is-a, part-of, causes)을 명시 |

### 6.3 온톨로지가 정말 불필요한 경우

공정성을 위해, 온톨로지 없이도 충분한 시나리오를 명시한다:

- **일회성 질의응답**: 단순 사실 확인("이 재료의 인장강도는?")
- **프로토타이핑**: 빠른 PoC에서는 온톨로지 구축 오버헤드가 과도
- **비구조적 탐색**: "이 불량의 원인이 뭘까?" 같은 열린 질문의 초기 탐색
- **소규모 단일 공정**: 관계 복잡도가 낮아 온톨로지의 이점이 미미

> **문제 재정의**: 원래 질문 "온톨로지가 LLM 시대에 불필요한가?"보다 더 적절한 질문은 **"어떤 조건에서 온톨로지 투자의 ROI가 양수가 되는가?"**이다. 답: 다중 시스템 통합, 규격 준수, 장기 지식 축적, 다단계 추론이 필요한 경우.

---

## 7. AI 엔지니어를 위한 실용 가이드

### 7.1 온톨로지 활용 의사결정 트리

```
제조 AI 시스템 설계 시:

1. 다중 데이터 소스 통합이 필요한가?
   → Yes: 온톨로지 기반 통합 스키마 (Virtual KG 또는 물리적 KG)
   → No: 단일 소스면 직접 접근

2. 규격/안전 감사 추적이 필요한가?
   → Yes: 온톨로지 필수 (추론 경로 기록)
   → No: LLM 직접 출력 가능

3. Multi-hop 추론이 필요한가?
   → Yes: GraphRAG + 온톨로지
   → No: 표준 RAG로 충분할 수 있음

4. 시스템이 장기 운영되는가?
   → Yes: 온톨로지로 지식 축적 구조 확보
   → No: 프롬프트 기반 빠른 구현
```

### 7.2 기술 스택 권장 조합

| 시나리오 | 추천 스택 | 온톨로지 역할 |
|----------|----------|-------------|
| **유지보수 챗봇** | MMO + Neo4j + GraphRAG + LLM | KG 스키마, 검색 그라운딩 |
| **공정 계획 자동화** | ISA-95 온톨로지 + fine-tuned LLM + Neo4j | 의도→공정 매핑 |
| **품질 예측** | 제조 온톨로지 + KG embedding + GNN/ML | Feature space 정의 |
| **공급업체 탐색** | 제조 역량 온톨로지 + LLM + 시소러스 | 용어 정규화, 트리플 구조 |
| **빠른 프로토타입** | LLM + 프롬프트에 온톨로지 개념 주입 | 프롬프트 구조화 |

### 7.3 시작점: MASON 온톨로지의 현대적 활용

MASON(MAnufacturing's Semantics ONtology)은 2006년 OWL-DL로 개발된 제조 상위 온톨로지다. SourceForge에서 OWL 파일을 다운로드할 수 있다. 현대적 활용 방법:

1. **Protege에서 로드** → 클래스 계층과 속성 파악
2. **Neo4j로 변환** → RDF 트리플을 그래프 DB에 적재 (neosemantics/n10s 플러그인)
3. **LLM 프롬프트에 주입** → MASON의 클래스 계층을 프롬프트의 도메인 지식 섹션에 포함
4. **LLM으로 확장** → 자사 공정에 맞는 하위 온톨로지를 LLM으로 반자동 생성
5. **GraphRAG 파이프라인 구축** → MASON 기반 KG + 사내 문서 → LLM 그라운딩

---

## 8. 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 유형 | 도메인 일치도 | 확신도 | 검증 필요 |
|----------|----------|-------------|--------|----------|
| GraphRAG가 VectorRAG보다 정확도 우위 | NVIDIA 블로그 + 학술 논문 | 범용 (제조 특화 아님) | 중-상 | 제조 도메인 벤치마크 필요 |
| Bosch MMO + GraphRAG 파이프라인 | 학술 워크숍 논문 (CEUR-WS) | 제조 직접 | 상 | 재현 실험 |
| LLM 기반 온톨로지 구축 가능 | 복수 학술 논문 | 범용 (제조 특화 부족) | 중 | 제조 온톨로지 특화 벤치마크 부재 |
| KG 시장 CAGR 36-37% | MarketsAndMarkets, Fortune BI | 범용 시장 데이터 | 상 | - |
| Neurosymbolic AI 제조 우위 | WEF, Gartner 보고서 | 범용 산업 | 중 | 제조 특화 정량 비교 부재 |
| 온톨로지가 LLM 환각을 줄임 | 복수 학술 서베이 | 범용 NLP | 상 | 제조 도메인 특화 실험 필요 |

---

## 9. 후속 탐색 질문

1. **중소 제조업체용 경량 온톨로지**: MASON 같은 상위 온톨로지를 LLM으로 자동 커스터마이징하여 중소기업이 1주일 내에 배포할 수 있는 파이프라인이 가능한가?
2. **온톨로지 진화의 자동화**: 새 장비/공정이 추가될 때 기존 온톨로지를 LLM이 자동으로 확장하고, 일관성을 검증하는 CI/CD 파이프라인은 어떻게 설계하는가?
3. **멀티모달 제조 데이터와 온톨로지**: 이미지(불량 사진), 시계열(센서), 텍스트(작업 지시서)를 온톨로지 기반으로 통합하는 멀티모달 GraphRAG의 현실적 구현 경로는?

---

*조사 일자: 2026-03-20*
*검색 도구: Perplexity sonar-pro, Tavily search/extract*
*핵심 출처: CEUR-WS Vol.4064, arXiv:2408.01700, arXiv:2602.12419, EMNLP 2025 OG-RAG, ASME JCISE 2024, NVIDIA Developer Blog*
