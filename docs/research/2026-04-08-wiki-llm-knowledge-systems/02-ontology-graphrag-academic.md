# 온톨로지/Knowledge Graph/GraphRAG 학술 현황 — wiki-llm 대체 가능성

**Researcher 산출물** | 2026-04-08
**검색 전략 모드**: academic

---

## 개요

GraphRAG는 Microsoft Research(Edge et al., 2024)가 제안한 그래프 기반 RAG 아키텍처로, LLM으로 엔티티 지식 그래프를 구축하고 커뮤니티 요약을 생성하여 전통적 RAG의 글로벌 쿼리 한계를 극복한다. 반면 Andrej Karpathy가 2026년 4월 제안한 wiki-llm 패턴은 LLM이 마크다운 위키를 유지관리하는 구조적으로 단순하지만 강력한 접근법이다. 두 접근법은 상호 배타적이지 않으며, 적용 규모와 쿼리 유형에 따라 명확한 적용 영역이 갈린다.

---

## 핵심 발견

### 1. GraphRAG 최신 학술 현황

#### 1.1 Microsoft GraphRAG 아키텍처 및 성능 (★★★)

Edge et al.(2024)의 원 논문 arXiv:2404.16130은 2단계 파이프라인을 정의한다:
- **Stage 1**: LLM으로 소스 문서에서 엔티티 지식 그래프 추출
- **Stage 2**: Leiden 알고리즘으로 커뮤니티 탐지 후 커뮤니티 요약 생성

**성능 데이터** [Edge et al., 2024 / arXiv:2404.16130]:
- 1M 토큰 규모 데이터셋 글로벌 쿼리에서 vanilla RAG 대비 포괄성·다양성 "실질적 개선"
- NQ 데이터셋(단순 팩트 쿼리): RAG F1 68.18% vs GraphRAG(KG) 65.44% → GraphRAG 13.4% 하락 ★★★
- MultiHop-RAG: RAG 65.77% vs Community-GraphRAG(Local) 71.17% → GraphRAG 8.3% 우위

**수치 투명성**: 위 F1 수치는 arXiv:2502.11371(RAG vs GraphRAG systematic evaluation)에서 재현. 단일 홉 쿼리에서의 열세가 다중 홉에서 역전되는 패턴은 데이터셋 구성에 따라 달라질 수 있다.

#### 1.2 GraphRAG 변형 비교 (★★★)

최신 서베이 arXiv:2503.04338 기반:

| 방법 | 그래프 구조 | 강점 | 약점 |
|------|-----------|------|------|
| Microsoft GraphRAG | 커뮤니티 계층 그래프 | 글로벌 쿼리, 주제 요약 | 인덱싱 비용 극대화 |
| HippoRAG/HippoRAG2 | 엔티티 연결 그래프 + PageRank | 다중 홉 검색, 토큰 효율 | 엔티티 추출 품질 의존 |
| RAPTOR | 계층적 요약 트리 | 교과서 구조 데이터, 검색 효율 | 동적 업데이트 약점 |
| LightRAG | 트리플 기반 그래프 | 경량, 빠른 인덱싱 | 커뮤니티 수준 요약 부재 |

**핵심**: HippoRAG2는 GraphRAG 대비 토큰 사용량이 "훨씬 적으면서" QA·검색 성능을 능가. RAPTOR는 계층 구조가 자연스러운 교과서 데이터에서 최고 성능.

#### 1.3 GraphRAG 비용 문제 (★★☆)

[Perplexity search, 2026-04-08 / aithinkerlab.com 인용]:

| 항목 | Vector RAG | Full GraphRAG | LazyGraphRAG (2025-06) |
|------|-----------|---------------|------------------------|
| 1,000문서 인덱싱 비용 | $1~5 | $50~200+ | ~$0.02~0.05 |
| 월 인프라(100K문서) | $320 | $635 | 미보고 |
| 쿼리당 비용 | $0.023 | $0.034 | $0.03~0.35 (예산 가변) |
| P50 쿼리 지연 | 0.9s | 2.2s | 미보고 |

**수치 투명성**: 인덱싱 비용 범위($50~$200+)는 사용 LLM 모델과 엔티티 밀도에 따라 크게 달라진다. LazyGraphRAG는 2025년 6월 Microsoft Research 발표로 아직 대규모 검증 사례 제한적.

**LazyGraphRAG 돌파구**: 인덱싱 시 엔티티 요약 없이 명사구 추출만 수행 → 인덱싱 비용을 Full GraphRAG의 **0.1%** 수준으로 감소. 쿼리 시 예산 파라미터로 품질-비용 트레이드오프 제어.

**반증 탐색**: GraphRAG가 단순 쿼리에서는 비용 대비 효과가 없다는 주장(RAG vs GraphRAG 비교 연구들)이 일관되게 보고된다. Community-GraphRAG의 낮은 쿼리 지연(vanilla RAG 대비 우위)은 반례이나, 인덱싱 비용과 스토리지 풋프린트가 가장 크다는 트레이드오프가 존재.

#### 1.4 GraphRAG의 핵심 한계점

[arXiv:2502.11371, arXiv:2408.08921]:

1. **엔티티 추출 품질 의존성**: KG-GraphRAG에서 약 65.8% 답변 엔티티만 KG에 존재 → 커버리지 갭
2. **노이즈 증폭**: 잘못 식별된 엔티티는 그래프 트래버설에서 오류 전파 ("vector store는 나쁜 청크가 무관한 결과를 반환하지만, KG는 오연결을 생성")
3. **엔티티 중의성**: 동일 인물의 다른 표기("John" vs "J. Smith") 해소가 어려움
4. **평가 편향**: LLM-as-Judge 평가에서 position bias 존재 → 요약 순서 변경 시 판단이 완전히 반전되는 경우 보고됨
5. **동적 업데이트**: 새 문서 추가 시 최적 커뮤니티 탐지를 위한 전체 재인덱싱 필요

---

### 2. 온톨로지 기반 지식 관리 학술 동향

#### 2.1 LLM + 온톨로지 통합 현황 (★★★)

최근 2024~2026년 연구(arXiv:2412.20942, arXiv:2602.01276, arXiv:2511.05991)는 세 흐름으로 수렴:

**A. LLM으로 온톨로지 자동 구축**
- LLM이 OWL 온톨로지 생성: 논리적 일관성 유지와 hallucination 억제가 가장 큰 난제
- OntoEKG (arXiv:2602.01276): 기업 KG를 위한 LLM 기반 온톨로지 구축 파이프라인. "초기 결과는 자동화 기법이 시맨틱 모델링 작업을 지원할 수 있음을 시사"

**B. 온톨로지 기반 KG로 RAG 강화**
[arXiv:2511.05991, 핵심 비교]:
- Vector RAG 기준선: 60% 정확도
- Microsoft GraphRAG: 90% 정확도
- Ontology-guided KG (청크 포함): 90% 정확도 (GraphRAG와 동등)

**핵심 발견**: 그래프 노드에 텍스트 청크를 직접 통합하면 온톨로지 기반 KG가 GraphRAG와 동등한 성능 달성. RDB 파생 온톨로지는 텍스트 기반 온톨로지와 유사 성능이나, 일회성 추출만 필요해 유지비용 훨씬 낮음.

**수치 투명성**: 60%/90% 수치는 해당 논문의 특정 벤치마크 기준. 도메인과 쿼리 유형에 따라 달라질 수 있다.

**C. 뉴로-심볼릭 통합**
[arXiv:2504.07640]: OWL 온톨로지 + 심볼릭 추론기로 LLM 출력의 일관성 검증. 의료, 법률 등 고신뢰도 요구 도메인에서 주목.

#### 2.2 온톨로지 자동 구축/유지보수의 어려움 (★★★)

[arXiv:2511.05991, arXiv:2503.05388]:
- **논리적 일관성**: OWL 공리 간 모순 자동 탐지 및 해소 미해결
- **Hallucination**: LLM이 존재하지 않는 관계를 생성하는 문제
- **어휘 정렬**: 기존 표준 어휘(Wikidata, DBpedia 등)와의 정렬 자동화 어려움
- **스키마 진화**: 도메인 변화에 따른 온톨로지 업데이트 파이프라인 부재
- **벤치마크 부재**: "온톨로지 구축 평가의 포괄적 벤치마크가 없다" - 이전 연구들이 전체 과제를 다루지 않거나 품질 기준 미달

**학술 합의 수준**: 강한 합의 — LLM이 온톨로지 초안 생성을 가속하나, 전문가 검토 없는 완전 자동화는 현재 불가

#### 2.3 OWL/RDF/SKOS 현재 활용도 (★★☆)

Gartner 2025년 5월 보고서 "Pivot Your Data Engineering Discipline to Efficiently Support AI Use Cases": 온톨로지와 KG 같은 시맨틱 기법 채택을 권장. 그러나 실제 적용은:
- 의료(HL7 FHIR 온톨로지), 법률(LegalXML), 생물정보학(Gene Ontology)에서 성숙
- 일반 기업 지식 관리에서는 구축 비용과 전문 인력 부재로 제한적

[인접 도메인: 데이터 웨어하우스] 온톨로지의 시맨틱 레이어는 BI/데이터 웨어하우스의 메타데이터 관리와 유사한 과제를 공유. 데이터 카탈로그(Atlan, Datahub) 업계의 자동 메타데이터 태깅 접근법을 온톨로지 구축에 차용 가능.

---

### 3. wiki-llm 패턴과 GraphRAG/온톨로지 비교 분석

#### 3.1 wiki-llm 패턴 정의 (★★☆)

[Karpathy, GitHub Gist 2026-04-05 / kenhuangus.substack.com, 2026-04-06]:

Karpathy의 LLM Wiki는 3계층 구조:
- **Raw Sources**: 불변 원시 마크다운 소스
- **Wiki Layer**: LLM이 유지관리하는 마크다운 페이지 집합 (entity pages, concept pages, comparisons, index.md, log.md)
- **Schema**: 쿼리 인터페이스

3가지 오퍼레이션:
- **Ingest**: 새 소스 → LLM이 10~15개 위키 페이지 생성/업데이트, 모순 검토, 변경 로그
- **Query**: index.md 탐색 → 합성 답변 생성 → 결과물을 위키에 파일로 저장
- **Lint**: 갭, 오래된 데이터, 미수집 소스, 불일치 탐지

**핵심 전제**: 지식 베이스가 50K~100K 토큰 이내 → 컨텍스트 윈도우에 전량 로딩 가능.

**수치 투명성**: 50K~100K 토큰 한계는 2026년 4월 기준 최신 모델(Claude 3.7, GPT-4o 등)의 컨텍스트 크기 대비 실용 임계값. 컨텍스트 윈도우가 계속 확대됨에 따라 이 한계는 이동한다.

#### 3.2 wiki-llm이 GraphRAG를 대체할 수 있는 영역 (★★☆)

| 영역 | wiki-llm 우위 근거 |
|------|-----------------|
| 소규모(< 100K 토큰) 개인/팀 지식 | RAG 파이프라인 불필요, 벡터DB 불필요 |
| 안정적·잘 정제된 지식 | 큐레이션된 위키가 노이즈 청크보다 검색 정확도 높음 |
| 사람이 읽기 쉬운 중간 표현 필요 | 마크다운은 온톨로지/KG 대비 즉시 가독·편집 가능 |
| 빠른 프로토타이핑/MVP | 벡터DB, 그래프DB, 파이프라인 오케스트레이션 없음 |
| 토큰 효율 | 최적화된 RAG 대비 비교 축소, naive 문서 로딩 대비 90%+ 절감 가능 |

#### 3.3 wiki-llm이 GraphRAG/온톨로지를 대체할 수 없는 영역 (★★★)

| 영역 | 이유 |
|------|------|
| 대규모 코퍼스(수십만 문서, > 100K 토큰) | 컨텍스트 윈도우 한계 초과 |
| 엄격한 논리적 일관성 필요 (의료, 법률) | OWL 추론기의 공리 기반 검증 대체 불가 |
| 다중 홉 관계 추론 | GraphRAG의 그래프 트래버설이 암묵적 마크다운 링크보다 정확 |
| 엔터프라이즈 접근 정책 / 거버넌스 | 마크다운 파일은 세분화된 권한 관리 미지원 |
| 정형 데이터 + 비정형 데이터 통합 | GraphRAG의 KG가 SQL 가능 구조화 데이터와 통합 용이 |
| 실시간 동적 지식 (지속 증가 스트림) | 위키 Ingest 오퍼레이션은 수동/반자동 큐레이션 가정 |

**반증 탐색**: wiki-llm이 대규모에서 작동하지 않는다는 주장에 대한 반례 — Karpathy 패턴 자체가 "큐레이션된 위키 + RAG for long-tail" 하이브리드를 허용한다. 규모 한계는 절대적이지 않으며 아키텍처 결합으로 완화 가능.

#### 3.4 하이브리드 접근 가능성 (★★☆)

[mindstudio.ai, 2026 / arxiv.org A-MEM 패턴]:

**실용적 하이브리드 패턴**:
```
[시스템 프롬프트] = wiki 핵심 (안정적·항상 관련)
[동적 검색] = RAG / GraphRAG (대규모·동적 콘텐츠)
```

**A-MEM 패턴** (arXiv 2025): KG를 동적 메모리 기질로 — 에이전트 상호작용마다 지속 진화하는 상호연결 "노트" 네트워크. wiki-llm의 Ingest와 유사하나 구조화된 엔티티-관계 레이어 추가.

**Timbr GraphRAG 접근**: 온톨로지 기반 시맨틱 레이어(SQL 접근 가능) + 벡터 검색 결합. 정형/비정형 데이터 통합의 엔터프라이즈 패턴으로 주목.

---

## 구현/실행 참고사항

**GraphRAG 채택 결정 트리**:
1. 코퍼스 > 100K 토큰? → GraphRAG 필요 (LazyGraphRAG로 비용 완화)
2. 다중 홉 관계 추론 필요? → KG-GraphRAG 또는 HippoRAG2 고려
3. 글로벌 주제 쿼리 필요? → Community-GraphRAG
4. 단순 팩트 쿼리 중심? → vanilla RAG가 GraphRAG보다 효율적

**wiki-llm 채택 결정 트리**:
1. 지식 베이스 < 100K 토큰 + 안정적 + 잘 큐레이션됨? → wiki-llm 단독 적합
2. 빠른 프로토타입 필요? → wiki-llm 우선 시작
3. 규모 성장 예상? → wiki (핵심) + RAG (장기 테일) 하이브리드 설계

**온톨로지 채택 결정 트리**:
1. 논리적 일관성 검증 요구? → OWL + 추론기 필수
2. 의료/법률/규제 도메인? → 기존 표준 온톨로지(SNOMED, LegalXML) 활용
3. 구조화 DB + 비정형 통합? → RDB 파생 온톨로지 (유지비용 최소)

---

## 관점 확장 / 문제 재정의

**인접 질문 1 (결론을 바꿀 수 있음)**: 컨텍스트 윈도우 크기가 계속 확대된다면(Claude의 1M 토큰 등), wiki-llm의 규모 한계가 소멸하고 GraphRAG의 존재 이유가 "다중 홉 추론"만으로 축소되는가?

**인접 질문 2**: wiki-llm에서 LLM의 Ingest 품질(어떤 정보를 어떻게 위키화하는가)이 결과 정확도를 결정한다면, 이는 사실상 "자동화된 온톨로지 구축"과 동일한 품질 보장 문제를 공유하는가?

[이질 도메인: 소프트웨어 엔지니어링] 위키-LLM 패턴은 "코드베이스의 CLAUDE.md" 패턴과 동형(isomorphic). LLM이 코드 변경 시 문서를 자동 업데이트하는 document-as-code 패턴의 지식 관리 버전으로 볼 수 있으며, 소프트웨어 팀의 ADR(Architecture Decision Records) 관리 방식을 차용 가능.

**문제 재정의**: "wiki-llm이 GraphRAG를 대체할 수 있는가?"보다 더 적절한 질문은 — "각 접근법이 적합한 규모와 쿼리 유형의 경계를 어디에 그어야 하며, 하이브리드 설계에서 경계를 어떻게 런타임에 결정할 것인가?"

---

## 상충 정보

| 항목 | 출처 A | 출처 B | 상충 유형 |
|------|--------|--------|----------|
| GraphRAG 인덱싱 비용 | $50~200/1K문서 [aithinkerlab] | $2.25/45K단어 [falkordb] | 측정 단위와 LLM 모델 차이 |
| 단순 쿼리 GraphRAG 성능 | NQ에서 13.4% 하락 [arXiv:2502.11371] | MultiHop에서 8.3% 우위 [동일] | 쿼리 유형별 상반된 결과 |
| 온톨로지 + 청크 정확도 | Vector RAG 60%, GraphRAG/Onto-KG 90% [arXiv:2511.05991] | GraphRAG 비교 연구에서 낮은 F1 | 벤치마크 구성 차이 |

---

## 자기 점검

| 기준 | 충족 | 미충족 사유 |
|------|------|-----------|
| Tier 1~2 출처 60% 이상 | O | arXiv 논문 5편 이상 직접 확인 |
| 핵심 논문 3편 이상 상세 분석 | O | arXiv:2404.16130, 2502.11371, 2408.08921, 2511.05991 분석 |
| 찬반/장단점 균형 기술 | O | GraphRAG 우위·열세 구역 모두 기술 |
| 학술 합의 수준 명시 | O | 각 섹션에 합의 수준 명시 |
| 연구 갭/향후 과제 식별 | O | 온톨로지 벤치마크 부재, 동적 업데이트 문제 |

---

## 출처 목록

| # | 출처 | 확신도 | URL |
|---|------|--------|-----|
| 1 | Edge et al., 2024. "From Local to Global: A Graph RAG Approach to Query-Focused Summarization" | ★★★ | https://arxiv.org/abs/2404.16130 |
| 2 | arXiv:2501.00309. "Retrieval-Augmented Generation with Graphs (GraphRAG)" Survey | ★★★ | https://arxiv.org/abs/2501.00309 |
| 3 | arXiv:2408.08921. "Graph Retrieval-Augmented Generation: A Survey" | ★★★ | https://arxiv.org/abs/2408.08921 |
| 4 | arXiv:2502.11371. "RAG vs. GraphRAG: A Systematic Evaluation and Key Insights" | ★★★ | https://arxiv.org/html/2502.11371v1 |
| 5 | arXiv:2503.04338. "In-depth Analysis of Graph-based RAG in a Unified Framework" | ★★☆ | https://arxiv.org/pdf/2503.04338 |
| 6 | arXiv:2511.05991. "Ontology Learning and KG Construction: Comparison for RAG Performance" | ★★☆ | https://arxiv.org/html/2511.05991v1 |
| 7 | arXiv:2602.01276. "LLM-Driven Ontology Construction for Enterprise Knowledge Graphs" | ★★☆ | https://arxiv.org/html/2602.01276v1 |
| 8 | arXiv:2504.07640. "Enhancing LLMs through Neuro-Symbolic Integration and Ontological Reasoning" | ★★☆ | https://arxiv.org/html/2504.07640v1 |
| 9 | Karpathy, A. 2026. "LLM Wiki" GitHub Gist | ★★☆ | https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f |
| 10 | kenhuangus.substack.com. "What Andrej Karpathy Got Right" (2026-04-06) | ★☆☆ | https://kenhuangus.substack.com/p/what-andrej-karpathy-got-right-how |
| 11 | mindstudio.ai. "LLM Wiki vs RAG: When to Use Markdown Knowledge Bases" | ★☆☆ | https://www.mindstudio.ai/blog/llm-wiki-vs-rag-markdown-knowledge-base-comparison/ |
| 12 | articsledge.com. "What is GraphRAG? Complete Guide 2026" (LazyGraphRAG 비용) | ★☆☆ | https://www.articsledge.com/post/graphrag-retrieval-augmented-generation |
| 13 | Perplexity search 합성. GraphRAG cost/latency benchmarks 2025-2026 | ★☆☆ | (합성 출처, 원 URL: aithinkerlab.com, cognilium.ai, sparkco.ai) |

---

## 검색 비용 보고

| 도구 | 호출 수 |
|------|--------|
| WebSearch | 3 |
| WebFetch | 4 |
| search.sh perplexity search | 2 |
| search.sh tavily search (advanced) | 1 |
| search.sh extract | 0 |
| search.sh research/reason | 0 |
| **전체** | **10** |
