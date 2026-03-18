# CadQuery + LLM + Ontology 통합 기어 설계-제조 시스템 아키텍처 조사

**날짜**: 2026-03-18 **역할**: Researcher (실용 시스템 아키텍처) **상태**: 조사 완료

---

## 1. 유사 프로젝트/제품 조사

### 1.1 CAD + AI 통합 시도

#### Zoo.dev (구 KittyCAD) — Text-to-CAD

- **현황**: 2025년 4월 Zoo Design Studio v1.0 출시. Text-to-CAD는 자연어 프롬프트로 B-rep CAD 모델 + KCL 코드를 생성
- **KCL**: Zoo가 만든 CAD 전용 프로그래밍 언어. 오픈소스. 텍스트 기반으로 모델 저장
- **기능**: 최대 1,500단어 설계 문서 입력 가능. 짧은 프롬프트(1-2문장)가 성공률 높음. 빠진 치수는 산업 표준 기반 추정
- **가격**: 2025년 9월부터 $0.50/분 단위 과금
- **솔직한 평가**: 단순 기계 부품(브래킷, 플랜지 등)에는 유용하나, 기어 치형 같은 정밀 형상 생성은 아직 검증 부족. KCL이라는 자체 언어를 사용하므로 CadQuery/Python 생태계와 직접 호환 불가
- **출처**: [Zoo.dev Text-to-CAD](https://zoo.dev/docs/developer-tools/tutorials/text-to-cad), [Zoo Design Studio v1](https://zoo.dev/blog/zoo-design-studio-v1), [KCL 소개](https://zoo.dev/research/introducing-kcl)

#### Hyperganic

- **현황**: Hyperganic Core 3 공개 롤아웃 진행 중 (수백 명 단위 배치). $7.8M 펀딩
- **특징**: 알고리즘 기반 엔지니어링 소프트웨어. 적층제조(AM) 특화
- **솔직한 평가**: 2015년부터 개발했으나 아직 제한적 공개. 격자(lattice) 구조, AM 최적화에 집중. 전통 기어 제조(절삭/연삭)와는 관련성 낮음
- **출처**: [Hyperganic](https://www.hyperganic.com/), [TCT Magazine](https://www.tctmagazine.com/hyperganic-public-rollout-ai-powered-design-software/)

#### nTopology (nTop)

- **현황**: 3세대 래티싱 기술 출시. 클라우드 우선 아키텍처, 오픈 API
- **특징**: 컴퓨테이셔널 엔지니어링 플랫폼. 적층제조용 복잡 구조 설계
- **솔직한 평가**: 토폴로지 최적화/격자 구조에 강함. 기어 설계 자체보다는 경량화/열관리 등에 적합. 기어 설계-제조 파이프라인의 직접적 참조 모델은 아님
- **시장 규모**: 제너레이티브 디자인 시장 전체 2025년 $4.3B, CAGR 14.82% (2030년까지)
- **출처**: [nTop](https://www.ntop.com/software/capabilities/generative-design/)

### 1.2 LLM for CAD 코드 생성 프로젝트 (학술)

#### Text-to-CadQuery (arXiv 2505.06507) — 가장 직접적 관련 연구

- **핵심**: CadQuery 코드를 직접 생성하는 LLM 파이프라인
- **데이터셋**: Text2CAD 데이터셋에 170,000개 CadQuery 어노테이션 추가
- **성능**: Top-1 정확 매치 69.3% (기존 58.8%에서 향상), Chamfer Distance 48.6% 감소
- **모델**: 124M\~7B 파라미터 오픈소스 LLM 6종 평가. 모델 크기에 비례하여 성능 향상
- **의미**: CadQuery가 LLM CAD 생성의 유력한 타겟 언어임을 학술적으로 입증
- **한계**: 69.3% 정확 매치 = 약 30%는 여전히 틀림. 복잡한 기어 치형은 포함되지 않았을 가능성 높음
- **출처**: [arXiv 2505.06507](https://arxiv.org/abs/2505.06507), [GitHub](https://github.com/Text-to-CadQuery/Text-to-CadQuery)

#### CAD-Coder (NeurIPS 2025)

- **핵심**: Chain-of-Thought + Geometric Reward(Chamfer Distance 기반)를 이용한 강화학습
- **데이터셋**: 110K text-CadQuery-3D model 삼중쌍
- **접근**: SFT + RL 2단계 파이프라인
- **출처**: [NeurIPS 2025 Poster](https://neurips.cc/virtual/2025/poster/118098), [MIT DECODE](https://decode.mit.edu/assets/papers/IDETC_CadCode_decodeweb.pdf)

#### FutureCAD (arXiv 2603.11831)

- **핵심**: LLM이 CadQuery 스크립트 생성 + B-rep grounding transformer로 고충실도 모델 생성
- **의미**: LLM 단독이 아닌 하이브리드 접근
- **출처**: [arXiv 2603.11831](https://arxiv.org/html/2603.11831)

#### 실행 성공률 (일반 LLM 기준)

- GPT-4o: 첫 시도 실행 성공률 90%+ (정확한 형상은 별개)
- Claude/Gemini: 피드백 루프 적용 시 약 85%
- **솔직한 평가**: "실행 가능"과 "설계 의도에 정확"은 다른 문제. 실행은 되지만 치수가 틀리거나 형상이 의도와 다를 수 있음

### 1.3 제조 AI 스타트업

#### Sight Machine

- **현황**: 2025년 Microsoft Manufacturing Partner of the Year 후보. NVIDIA NVentures 투자 유치
- **기능**: 공장 데이터 기반 AI 에이전트. 실시간 데이터 분석, 품질 인사이트
- **적용**: 자동차, 식품, 제지 등 다양한 산업
- **솔직한 평가**: CAD 데이터와의 직접 연결보다는 공정 데이터 분석에 집중. 설계-제조 통합보다는 제조 운영 최적화 도구
- **출처**: [Sight Machine](https://www.sightmachine.com/), [PRNewswire](https://www.prnewswire.com/news-releases/sight-machine-announces-industrial-ai-agents-expanded-integration-with-microsoft-fabric-additional-investment-302557179.html)

#### Instrumental, Arch Systems

- **영역**: 제조 품질 검사 AI, 제조 인텔리전스
- **솔직한 평가**: 이들은 모두 "제조 후" 데이터 분석. 설계 단계와의 통합(Design for Manufacturability)은 아직 미개척 영역

### 1.4 상용 기어 설계 소프트웨어

#### KISSsoft (Gleason)

- **위치**: 기어 설계의 업계 표준. AGMA/ISO 규격 준수 계산, 하중 스펙트럼 분석, 효율/열평형, 모달 해석
- **가격**: 고가 (소규모 팀/개인에게 부담)
- **솔직한 평가**: 이것이 진짜 경쟁 상대. KISSsoft가 하는 일(규격 준수 검증, 수명 예측, 최적화)을 LLM+CadQuery로 대체하는 것은 비현실적. 다만 KISSsoft에 없는 것(자연어 인터페이스, 설계 지식 그래프, 빠른 프로토타이핑)을 보완하는 것은 가치 있음

#### GearTrax (Camnetics)

- **위치**: 3D 기어 모델 생성 도구 (SolidWorks 플러그인). 분석보다는 모델링에 집중
- **출처**: [Eng-Tips](https://www.eng-tips.com/threads/gear-design-software.523946/), [GearTechnology](https://www.geartechnology.com/topics/software)

---

## 2. 기술 스택 제안

### 2.1 Python 기반 통합 도구

| 영역 | 추천 도구 | 이유 | 대안 |
| --- | --- | --- | --- |
| CAD 커널 | **CadQuery** | LLM 코드 생성 연구의 주류 타겟, Python 네이티브, 학술 데이터셋 존재 | Build123d (더 Pythonic하나 생태계 작음) |
| CAD 보조 | **Build123d** | CadQuery보다 Pythonic한 문법, 기어 생성 라이브러리(py_gearworks) 존재 | \- |
| 기어 모델링 | **py_gearworks** (Build123d 기반) | 다양한 기어 타입 지원 | CadQuery 기어 패키지 |
| Knowledge Graph | **Neo4j + rdflib-neo4j** | Python 통합 우수, RDF/OWL 지원, GraphRAG 가능 | Apache Jena (Java), RDFLib 단독 (스케일 한계) |
| 온톨로지 | **RDFLib + OWL** | Python 네이티브, W3C 표준, Neo4j 연동 가능 | Protege (편집기), SHACL (검증) |
| LLM 프레임워크 | **Claude API 직접 사용** | 코드 생성 능력 우수, 도구 호출 지원 | LangChain/LangGraph (오버엔지니어링 위험) |
| RAG/검색 | **LlamaIndex** | 데이터 중심 검색 특화, 35% 검색 정확도 향상 (2025) | LangChain (범용적이나 복잡) |
| 검증 | **CadQuery + OpenCascade** | 형상 검증, 간섭 체크, 측정 기능 내장 | FreeCAD Python API |
| 시각화 | **CQ-editor 또는 Jupyter** | 즉시 3D 프리뷰 | Three.js (웹) |

### 2.2 Knowledge Graph 도구 상세 비교

| 도구 | 장점 | 단점 | 제조 온톨로지 적합성 |
| --- | --- | --- | --- |
| **Neo4j** | 성능 우수, Python 드라이버, GraphRAG 생태계 | 라이선스 비용 (Community Edition 무료), RDF 네이티브 아님 | 높음 (rdflib-neo4j로 RDF 호환) |
| **RDFLib** | 순수 Python, 무료, OWL 완전 지원 | 대규모 그래프에서 느림 | 중간 (프로토타입용) |
| **Apache Jena** | RDF/OWL 최강, SPARQL 완전 지원 | Java 기반, Python 통합 불편 | 높음 (하지만 Java) |
| **Stardog** | 엔터프라이즈 KG, 추론 엔진 내장 | 고가, 오버스펙 가능 | 높음 |

**추천**: MVP에서는 RDFLib 단독, 확장 시 Neo4j + rdflib-neo4j

### 2.3 LLM 역할 설계 (핵심 아키텍처)

```
사용자 자연어 입력
    |
    v
[LLM 레이어] — 의도 해석, 파라미터 추출
    |
    v
[검증 레이어] — 온톨로지 기반 파라미터 검증 (AGMA/ISO 규격 범위)
    |
    v
[계산 엔진] — 결정론적 Python 코드 (기어 공식, NOT LLM)
    |
    v
[CadQuery 생성기] — 검증된 파라미터 → 템플릿 기반 CadQuery 코드
    |
    v
[형상 검증] — OpenCascade 기반 간섭/측정 검증
    |
    v
[Knowledge Graph 기록] — 설계 이력, 파라미터, 근거 저장
```

**핵심 원칙: LLM은 수치 계산을 하지 않는다**.LLM의 역할은 자연어 해석과 코드 생성 조정에 한정. 기어 공식(모듈, 압력각, 피치원 직경 등)은 결정론적 Python 함수가 처리.

---

## 3. MVP 단계별 로드맵

### Phase 1: 파라메트릭 기어 생성기 + 자연어 인터페이스 (1-2개월, 1인 가능)

**목표**: "module 2, 20 teeth, 20도 pressure angle인 스퍼 기어 만들어줘" → CadQuery 기어 모델 + STEP 파일

**구성**:

1. CadQuery/Build123d 기반 파라메트릭 기어 생성 함수 (스퍼 기어부터)
2. Claude API로 자연어 → 기어 파라미터 추출
3. AGMA/ISO 기반 파라미터 검증 (경고/에러)
4. STEP/STL 내보내기
5. Jupyter Notebook 기반 인터페이스

**기술 난이도**: 중 (기어 치형 수학이 핵심 난관) **가치**: 기어 설계 초보자 진입 장벽 낮춤, CadQuery 기어 코드 자동 생성

**구체적 작업**:

- 인볼류트 기어 프로파일 생성 코드 (Python/CadQuery)
- Claude tool_use로 파라미터 추출 함수 연결
- ISO 1328 기반 정밀도 등급 검증
- 단위 테스트: 생성된 기어의 치수가 이론값과 ±0.01mm 이내

### Phase 2: 온톨로지 + 설계 지식 기반 (2-3개월 추가)

**목표**: 설계 결정의 근거를 추적 가능하게 만들기. "왜 이 모듈을 선택했는가?"에 답할 수 있는 시스템

**구성**:

1. 기어 설계 온톨로지 (OWL) — 기어 타입, 재료, 규격, 제조 공정 간 관계
2. RDFLib 기반 Knowledge Graph
3. 설계 이력 추적 (어떤 파라미터가 왜 변경되었는지)
4. RAG 기반 설계 가이드 질의 (LlamaIndex + 온톨로지)

**기술 난이도**: 중-고 (온톨로지 설계가 도메인 지식 필요) **가치**: 설계 의사결정 추적, 팀 간 지식 공유, 재사용

**온톨로지 최소 스키마 예시**:

```
GearDesign
  ├── GearType (Spur, Helical, Bevel, Worm...)
  ├── GeometricParams (module, teeth, pressure_angle, helix_angle...)
  ├── Material (steel_grade, hardness, heat_treatment...)
  ├── Standard (ISO_1328, AGMA_2015, DIN_3960...)
  ├── ManufacturingProcess (hobbing, shaping, grinding...)
  ├── QualityGrade (ISO_1328_grade, surface_roughness...)
  └── DesignConstraint (load, speed, life, noise...)
```

### Phase 3: 제조 연결 + 피드백 루프 (3-6개월 추가, 팀 필요)

**목표**: 설계 파라미터에서 가공 파라미터(공구 선정, 절삭 조건)까지 연결

**구성**:

1. 온톨로지 확장 — 제조 공정, 공작기계, 공구 데이터
2. Design-for-Manufacturing 검증 (언더컷 체크, 가공 가능성 판단)
3. 제조 파라미터 추천 (호빙 조건, 연삭 여유 등)
4. 실제 가공 데이터 피드백 (품질 측정 → 설계 개선)

**기술 난이도**: 고 (제조 도메인 전문성 필수) **가치**: 설계-제조 간 단절 해소. 이것이 진짜 차별화 포인트

### 리소스 추정

| Phase | 기간 | 인원 | 핵심 역량 |
| --- | --- | --- | --- |
| 1 | 1-2개월 | 1명 | Python, 기어 공학 기초, CadQuery |
| 2 | 2-3개월 | 1-2명 | 온톨로지 설계, 기어 규격 지식 |
| 3 | 3-6개월 | 2-3명 | 제조 공학, 가공 현장 경험 |

---

## 4. 리스크와 현실적 한계

### 4.1 LLM 수치 정밀도 — 가장 큰 리스크

**현실**:

- 기어 설계는 um 단위 정밀도 필요 (ISO 1328 Grade 5: 피치 오차 ±5um 수준)
- LLM은 "고신뢰 환각(high-confidence hallucination)"을 생성 — 틀린 수치를 확신 있게 출력
- 금융 분야 연구에서도 "의미론적으로 자연스럽지만 수학적으로 틀린 추론 체인" 확인됨

**대응 전략**:

- **LLM은 절대로 수치 계산을 하지 않는다** — 이것이 아키텍처의 철칙
- LLM의 역할: 자연어 해석, 코드 구조 생성, 사용자 의도 파악
- 수치 계산: 결정론적 Python 함수 (검증된 기어 공식)
- 모든 출력에 검증 레이어 필수

**Text-to-CadQuery 연구의 정확도가 69.3%라는 사실이 의미하는 것**:

- 30%+ 오류율은 엔지니어링에서 허용 불가
- "대략적 형상 생성" vs "정밀 기어 설계"는 완전히 다른 문제
- 따라서 "LLM이 전체 CadQuery 코드를 생성"하는 접근은 기어 설계에 부적합
- **템플릿 기반 + 파라미터 주입** 방식이 현실적

### 4.2 온톨로지 구축 비용 vs 효과

**비용**:

- 기어 설계 전체를 커버하는 온톨로지: 수개월 + 도메인 전문가 참여 필수
- ISO 23247 (디지털 트윈 프레임워크)와의 정합성 확보 추가 부담
- 유지보수: 규격 개정, 새 재료, 새 공정 반영 지속 필요

**효과**:

- 명확한 효과: 설계 이력 추적, 규격 준수 자동 검증, 지식 재사용
- 불명확한 효과: 온톨로지 기반 추론이 실제로 설계 품질을 개선하는가? 근거 부족
- 학술 논문(MDPI 2024)에서 제조 온톨로지의 "실용적 준비 완료" 주장했으나, 대부분 방위/대규모 산업 맥락

**솔직한 판단**:

- Phase 1에서는 온톨로지 불필요. 단순 JSON 스키마로 충분
- Phase 2에서 경량 온톨로지 도입 (100-200 클래스 규모)
- 풀스케일 온톨로지는 명확한 필요가 입증된 후에만

### 4.3 산업 현장 채택 장벽

- **신뢰 문제**: "AI가 설계한 기어를 실제로 쓸 수 있나?" — 엔지니어의 당연한 의문
- **규격 인증**: KISSsoft 등 상용 도구는 규격 기관의 검증을 받음. 오픈소스 도구는 이 부분이 약함
- **워크플로 통합**: 현장은 SolidWorks/NX + KISSsoft 조합에 익숙. 새 도구 도입 저항
- **책임 소재**: AI 기반 설계에서 결함 발생 시 책임 문제 미해결

### 4.4 기존 상용 솔루션 대비 경쟁력

| 측면 | KISSsoft (상용) | 제안 시스템 (CadQuery+LLM+Ontology) |
| --- | --- | --- |
| 규격 준수 | 완벽 (AGMA, ISO, DIN 등) | 수동 구현 필요 (Phase 1에서 부분적) |
| UI/UX | GUI 기반, 학습 곡선 있음 | 자연어 + 코드, 진입장벽 다름 |
| 설계 이력 | 제한적 | 온톨로지 기반 추적 (차별화 가능) |
| 지식 검색 | 매뉴얼 참조 | RAG 기반 질의 (차별화 가능) |
| 제조 연결 | 부분적 | 온톨로지로 확장 가능 (장기) |
| 가격 | 고가 | 오픈소스 + API 비용 |
| 신뢰도 | 수십 년 검증 | 미검증 |

**경쟁 전략**: KISSsoft를 대체하려 하지 말고, KISSsoft가 못하는 것을 보완

- 자연어 기반 빠른 탐색 (설계 초기 단계)
- 설계 의사결정 추적 및 지식 공유
- 비전문가의 기어 설계 접근성 향상
- 설계-제조 지식의 구조화된 축적

---

## 5. 핵심 판단 요약

### 현실적인 것

1. **CadQuery 기반 파라메트릭 기어 생성기**: 이미 py_gearworks 등 선례 존재. 확실히 가능
2. **LLM 자연어 → 파라미터 추출**: Claude tool_use 수준이면 충분. 파라미터 명확하면 오류 낮음
3. **설계 이력 Knowledge Graph**: 기존 기술(Neo4j, RDFLib)로 구현 가능. 가치 입증 용이
4. **STEP/STL 내보내기**: CadQuery 기본 기능

### 하이프인 것

1. **"LLM이 기어를 설계한다"**: LLM은 설계가 아니라 인터페이스. 설계 로직은 결정론적이어야 함
2. **"온톨로지가 설계를 혁신한다"**: 온톨로지는 지식 구조화 도구일 뿐. 그 자체로 설계 품질을 높이지 않음
3. **"Text-to-CAD로 복잡한 기어 생성"**: 현재 69.3% 정확도. 단순 형상은 되지만 기어 치형은 다른 문제
4. **"AI가 KISSsoft를 대체한다"**: 불가능. 수십 년의 규격 검증을 단기간에 대체할 수 없음

### 진짜 가치가 있는 방향

1. **비전문가 접근성**: "기어 설계를 모르는 사람도 대략적 설계를 시작할 수 있게"
2. **설계 지식 축적**: "왜 이 결정을 했는가"를 추적 가능하게
3. **설계-제조 연결**: 설계 파라미터에서 제조 파라미터까지의 지식 연결 (장기)
4. **교육 도구**: 기어 설계 학습 도구로서의 가치

---

## 6. 출처

### CAD + AI

- [Zoo.dev Text-to-CAD Tutorial](https://zoo.dev/docs/developer-tools/tutorials/text-to-cad)
- [Zoo Design Studio v1](https://zoo.dev/blog/zoo-design-studio-v1)
- [KCL 소개](https://zoo.dev/research/introducing-kcl)
- [Hyperganic](https://www.hyperganic.com/)
- [nTop Generative Design](https://www.ntop.com/software/capabilities/generative-design/)

### LLM + CAD 학술

- [Text-to-CadQuery (arXiv 2505.06507)](https://arxiv.org/abs/2505.06507)
- [FutureCAD (arXiv 2603.11831)](https://arxiv.org/html/2603.11831)
- [CAD-Coder NeurIPS 2025](https://neurips.cc/virtual/2025/poster/118098)
- [CAD-Recode (ICCV 2025)](https://openaccess.thecvf.com/content/ICCV2025/papers/Rukhovich_CAD-Recode_Reverse_Engineering_CAD_Code_from_Point_Clouds_ICCV_2025_paper.pdf)
- [LLMs for CAD (ACM)](https://dl.acm.org/doi/pdf/10.1145/3787499)

### 제조 AI

- [Sight Machine](https://www.sightmachine.com/)
- [Sight Machine AI Agents 발표](https://www.prnewswire.com/news-releases/sight-machine-announces-industrial-ai-agents-expanded-integration-with-microsoft-fabric-additional-investment-302557179.html)

### Knowledge Graph / 온톨로지

- [rdflib-neo4j](https://neo4j.com/labs/rdflib-neo4j/)
- [Ontology-Driven KG for GraphRAG](https://deepsense.ai/resource/ontology-driven-knowledge-graph-for-graphrag/)
- [제조 온톨로지 프레임워크 (MDPI 2024)](https://www.mdpi.com/2076-3417/14/24/11683)
- [LLM 기반 온톨로지 가속화](https://www.sciencedirect.com/science/article/pii/S1570826825000022)

### 디지털 트윈 표준

- [ISO 23247 분석 (NIST)](https://www.nist.gov/publications/analysis-new-iso-23247-series-standards-digital-twin-framework-manufacturing)
- [ISO 23247 프레임워크](https://www.ap238.org/iso23247/)

### 기어 설계

- [KISSsoft (Gleason)](https://www.gleason.com/design)
- [기어 설계 소프트웨어 비교](https://blog.zwsoft.com/gear-design-software/)
- [Build123d vs CadQuery](https://www.oreateai.com/blog/build123d-vs-cadquery-navigating-the-future-of-python-cad-modeling/b9e17e3134422786a0ab67c0a6d1eeda)

### LLM 한계

- [LLM 환각 종합 서베이 (arXiv 2510.06265)](https://arxiv.org/abs/2510.06265)
- [LLM 환각 가이드 (Lakera 2026)](https://www.lakera.ai/blog/guide-to-hallucinations-in-large-language-models)