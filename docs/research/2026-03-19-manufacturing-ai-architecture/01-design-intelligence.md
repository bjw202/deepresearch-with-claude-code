# 설계 지능 레이어 (Design Intelligence Layer)

> AI 기반 제품 설계의 현재 기술 수준, 실제 작동하는 도구/방법론, 한계

---

## 1. AI-Assisted CAD / Parametric Modeling

### 1.1 LLM → CAD 코드 생성 현황

자연어 텍스트를 파라메트릭 CAD 코드로 변환하는 연구가 2024-2025년에 급격히 활발해졌다. 핵심 접근은 LLM이 CadQuery(Python 기반) 스크립트를 생성하는 것이다.

| 프로젝트 | 시기 | 접근 | 핵심 결과 | 성숙도 |
|---|---|---|---|---|
| **Text-to-CadQuery** [1] | 2025.05 | Text2CAD 데이터셋에 17만 CadQuery 어노테이션 추가, 6개 오픈소스 LLM 파인튜닝 | Top-1 Exact Match 69.3% (기존 58.8%), Chamfer Distance 48.6% 감소. 최적 모델: Qwen2.5-3B (CD median 0.191) | 연구 |
| **CAD-Coder** [2] | 2025.10 (NeurIPS 2025) | SFT + RL(CAD-specific reward), 11만 text-CadQuery-3D triplet + 1.5K CoT 샘플 | Chain-of-Thought + Geometric Reward로 생성 품질 향상 | 연구 |
| **FutureCAD** [3] | 2026 | LLM + B-Rep Grounding Transformer, 자연어로 기하 선택 지정 | 실행 가능한 CadQuery 스크립트 생성 + 텍스트 기반 B-Rep primitive 참조 | 연구 |
| **CAD-MLLM** [4] | 2024.11 (ICLR area) | 멀티모달 입력(텍스트+이미지+포인트클라우드) → 파라메트릭 CAD | Omni-CAD 데이터셋 45만 인스턴스. 기존 조건부 생성 방법 대비 유의미하게 우수 | 연구 |
| **CAD-Recode** [5] | ICCV 2025 | 포인트클라우드 → Python CAD 코드 (역공학) | DeepCAD/Fusion360 데이터셋에서 기존 최고 대비 CD **10배 개선**, IoU 10%+ 향상 | 연구 |
| **Zoo Text-to-CAD** [6] | 2024~ (상용) | 자체 ML 모델 → B-Rep 생성, STEP 출력 | REST API 제공(Python/TS/Go/Rust), 편집 가능한 STEP 파일 출력. Zookeeper(대화형 CAD 에이전트) 출시 | 시제 |

**반증 탐색**: 위 수치의 한계가 명확하다. Text-to-CadQuery의 69.3% exact match는 비교적 단순한 형상(Text2CAD 데이터셋 기반)에서 달성된 것이다. 실제 산업용 CAD 모델은 수백 개의 피처, 어셈블리 구속, 공차 사양을 포함하므로, 현재 연구 벤치마크와 양산 현장 간 격차는 매우 크다. Zoo의 Text-to-CAD도 단일 부품 수준의 비교적 단순한 형상에 한정되며, 복잡한 어셈블리 생성은 아직 불가능하다.

**이 수치가 틀릴 수 있는 조건**: Chamfer Distance와 Exact Match는 데이터셋 내 형상 복잡도에 의존한다. Text2CAD 데이터셋은 주로 단순~중간 복잡도 형상이며, 기어, 베어링 하우징, 금형 등 산업 부품에 적용하면 성능이 크게 하락할 것으로 예상된다.

### 1.2 Parametric CAD 엔진 비교 — AI 친화성

| 엔진 | 언어 | 커널 | AI 친화성 | 비고 |
|---|---|---|---|---|
| **CadQuery** | Python | OCCT (OpenCASCADE) | **높음** — 대부분의 Text-to-CAD 연구가 채택. Python 생태계 활용, LLM 코드 생성과 직접 호환 | 성숙, 활발한 커뮤니티 |
| **build123d** | Python | OCCT | **높음** — CadQuery의 후속/대안. 더 현대적 API, Builder 패턴. 아직 연구용 데이터셋 부족 | CadQuery와 호환, 최신 API |
| **OpenSCAD** | 자체 DSL | CGAL (CSG) | **중간** — 함수형 CSG 기반이라 LLM이 코드 생성하기 용이하나, B-Rep 미지원. STEP 출력 불가. 메시(STL)만 출력 | 교육/프로토타입에 적합 |
| **FreeCAD Python API** | Python | OCCT | **중간** — 완전한 파라메트릭 모델링 가능하나, API가 복잡하고 문서화 부족. LLM이 올바른 코드를 생성하기 어려움 | 풀 CAD 환경, 학습 곡선 높음 |
| **Zoo KCL** | 자체 DSL | 자체 엔진 | **높음** — AI-native 설계. 자체 ML 파이프라인과 통합 | 상용, 신생 |

**실행 연결**: 제조 AI 시스템에서 설계 생성 엔진을 선택할 때, CadQuery/build123d가 현재 가장 합리적이다. (1) Python 기반으로 LLM 코드 생성과 직접 호환, (2) OCCT 커널로 STEP 출력 가능(다운스트림 CAM/FEA 호환), (3) 연구 데이터셋과 벤치마크가 축적되고 있다. OpenSCAD는 B-Rep 미지원으로 제조 파이프라인에 부적합하다.

### 1.3 Generative Design 상용 도구

| 도구 | 방법 | 실제 사례 | 성숙도 |
|---|---|---|---|
| **Autodesk Fusion Generative Design** [7] | 클라우드 기반 토폴로지 최적화 + 다중 제조 제약 | ISUZU: 디젤 엔진 기어 구조 최적화(기어 래틀 노이즈 저감, 2024 논문). Elara Aerospace: 로켓 구조 경량화. Shute Dynamics: Pikes Peak 레이싱 부품 | **양산** |
| **nTopology (nTop)** [8] | 암시적 모델링(Implicit Modeling) + 필드 기반 래티스 | 26.2B 복셀 멀티머터리얼 설계 → Stratasys J750 3D 프린터 제조(24분 출력). AM 전용 지오메트리 자동 생성 | **양산** |
| **Siemens NX** | 토폴로지 최적화 + Simcenter 통합 | 항공우주/자동차 대기업 도입. FEA-설계 루프 통합 | **양산** |
| **Neural Concept** [9] | 딥러닝 기반 설계 탐색, 실시간 성능 예측 | 자동차/항공 고객사. 설계 반복 시간 단축 주장 | **시제** |

**반증**: Generative Design의 "40-70% 경량화" 수치는 대부분 특정 제약 조건 하의 최적화 결과이며, 실제로는 (1) 후가공 필요성, (2) AM(적층 제조) 전용 형상이 CNC 가공에는 부적합한 경우, (3) 피로 수명 검증 미흡 등의 문제가 있다. ISUZU의 기어 구조 최적화 사례는 토폴로지 최적화 결과를 직접 양산에 적용한 것이 아니라, 설계 탐색 도구로 활용한 것이다.

### 1.4 Topology Optimization AI

| 방법 | 설명 | 현재 수준 |
|---|---|---|
| **SIMP** (Solid Isotropic Material with Penalization) | 밀도 기반 고전적 방법. 수렴 안정적 | **양산** — 대부분 상용 도구의 기반 |
| **BESO** (Bi-directional Evolutionary Structural Optimization) | 요소 추가/제거 기반 | **양산** — SIMP과 함께 가장 많이 사용 |
| **ML-accelerated SIMP/BESO** [10] | 딥러닝 대리 모델(surrogate)로 FEA 반복 대체. 초기 몇 회 반복 → DL 예측 → fine-tuning | **연구/시제** — 반복 횟수 대폭 감소 가능하나, 신뢰성 검증 과제 |
| **RL 기반 토폴로지 최적화** [11] | PPO 등 강화학습으로 재료 배치 학습 | **연구** — 70% 질량 감소(항공 드론) 달성 사례, 안전계수 2.0 유지 |
| **Neural Network Surrogate 후처리** [12] | TO 결과의 후처리(제조성 개선)에 NN 사용 | **연구** — 프린트 층 연속성 등 제조 제약 반영 |

**이 수치가 틀릴 수 있는 조건**: RL 기반 70% 질량 감소는 드론 프레임이라는 상대적으로 단순한 구조에서 달성된 것이다. 복잡한 다중 하중, 피로, 열 제약이 있는 산업 부품에서는 달성 불가능할 수 있다.

---

## 2. AI-Driven Design Validation

### 2.1 FEA 자동화

| 도구/연구 | 접근 | 핵심 성과 | 성숙도 |
|---|---|---|---|
| **FeaGPT** [13] | 대화형 에이전트: 지오메트리 생성 → Gmsh 자동 메싱 → 경계조건 → 솔버 → 결과 해석 | 최초의 end-to-end 대화형 FEA 프레임워크. 지오메트리 특성 기반 적응적 메시 밀도 조절 | **연구** |
| **Altair HyperMesh** [14] | ShapeAI: ML 기반 형상 인식으로 볼트/패스너 등 반복 부품 자동 그룹화 | 전처리 시간 수 시간 → 수 분. 상용 제품에 ML 탑재 | **양산** |
| **Cosmon Nexus** [15] | 멀티에이전트 시스템: 전처리(CAD cleanup, 메싱) → 처리(에러 자동 교정, 파라미터 재조정) → 후처리(결과 해석) | ISO 규격 자동 참조, 하중 케이스 자동 설정 | **시제** |
| **ML 대리 모델 기반 시뮬레이션** | FEA 대신 학습된 NN으로 실시간 응답 예측 | 설계 루프 내 실시간 피드백 가능. 정확도는 FEA 대비 90-95% 수준 | **연구/시제** |

**실행 연결**: 제조 AI 시스템에서 FEA 자동화의 역할은 두 가지다. (1) **설계 루프 내 빠른 검증**: ML 대리 모델로 수 초 내 구조 응답 예측 → 설계 에이전트에 실시간 피드백. (2) **최종 검증**: 전통적 FEA를 자동화된 파이프라인으로 실행(FeaGPT/Cosmon 방식) → 규격 준수 확인. 현실적으로 (1)은 탐색 단계, (2)는 확정 단계에 사용해야 한다.

**반증**: FeaGPT는 단순한 지오메트리(빔, 플레이트 수준)에서 시연되었다. 실제 산업 부품의 접촉 비선형, 대변형, 다중 물리 시뮬레이션을 자동화하기에는 아직 거리가 멀다. Cosmon도 시제 단계이며, 산업 현장의 복잡한 경계 조건을 얼마나 정확히 처리하는지 공개 검증 데이터가 부족하다.

### 2.2 VLM 기반 시각 검증

**CADCodeVerify** [16] (ICLR 2025)는 VLM(Vision-Language Model)을 활용한 3D 모델 시각 검증 프레임워크이다.

- **작동 방식**: (1) VLM이 자연어 프롬프트로부터 CadQuery 코드 생성 → (2) 컴파일하여 STL 생성 → (3) VLM이 생성된 3D 객체를 시각적으로 검사, 검증 질문 생성/답변 → (4) 피드백으로 코드 수정. 이 루프를 반복.
- **결과**: GPT-4 적용 시 Point Cloud Distance 7.30% 감소, 성공률 5.0% 향상.
- **CADPrompt 벤치마크**: 200개 자연어 프롬프트 + 전문가 어노테이션 코드.

**성숙도**: 연구. 현재 개선폭이 제한적(5-7%)이며, 복잡한 산업 부품의 치수 정확도, 공차 준수 등을 검증하기에는 VLM의 3D 공간 추론 능력이 부족하다.

**실행 연결**: 제조 AI 시스템에서 VLM 시각 검증은 "1차 sanity check" 역할을 할 수 있다. 명백한 형상 오류(관통 구멍 누락, 대칭 위반 등)를 빠르게 잡되, 정밀 검증은 FEA/DRC에 의존해야 한다.

### 2.3 SHACL/온톨로지 기반 형식 검증

SHACL(Shapes Constraint Language) [17]은 W3C 표준으로, RDF 그래프에 대한 제약 조건을 정의하는 언어다.

- **설계 검증 적용**: 설계 파라미터를 RDF로 표현하고, SHACL 셰이프로 규칙 정의 → 자동 준수 확인. 예: "기어 모듈 ≥ 1.0", "벽 두께 ≥ 최소값", "재질-열처리 조합 유효성".
- **현재 상태**: 건축/건설 규격 검증에서 활발히 연구 [18]. 기계 설계 분야에서는 아직 초기 단계.
- **한계**: SHACL은 기하학적 제약(간섭, 조립성)이 아닌 속성 수준 제약에 적합. 기하학적 검증은 별도 DRC 엔진 필요.

**성숙도**: 연구 (기계 설계 분야). 건축/건설에서는 시제 수준.

### 2.4 Design Rule Checking (DRC) 자동화

- **상용 CAD의 DRC**: Autodesk Fusion, Siemens NX 등은 이미 규칙 기반 DRC를 내장(언더컷 탐지, 최소 두께, 드래프트 각도 등).
- **AI 기반 DRC**: LLM을 활용하여 DRC 스크립트 자동 생성 연구 진행 중 [19]. IC 설계 분야에서 먼저 발전.
- **제조 AI에서의 역할**: 설계 에이전트가 생성한 형상에 대해 제조 공정별 DRC를 자동 실행 → 불량 가능성이 있는 형상 피처 사전 탐지.

**성숙도**: 규칙 기반 DRC는 양산. AI 기반 DRC 스크립트 자동 생성은 연구.

---

## 3. Knowledge-Augmented Design

### 3.1 설계 지식 그래프 / 온톨로지

| 온톨로지 | 목적 | 현재 상태 |
|---|---|---|
| **MASON** [20] | 제조 도메인 온톨로지. OWL 기반. 자동 원가 추정, 시맨틱 멀티에이전트 시스템 | 2006년 제안. 개념적으로 유효하나 업데이트 중단. 현대 LLM/KG 시스템과 통합 사례 없음 |
| **STEP / STEP-NC** [21] | ISO 10303(제품 데이터 표현) / ISO 14649(CNC 데이터 모델) | **양산** 수준의 표준. STEP-NC를 온톨로지(OntoSTEP-NC)로 변환하여 지식 추론에 활용하는 연구 진행 |
| **자체 구축 KG** | 기업별 설계 지식, 과거 설계 이력, 불량 사례 등을 그래프로 구축 | 선진 기업에서 도입 중. 2024-2025년 KG 구축이 "production maturity" 달성. 300-320% ROI 보고 [22] |

**반증**: MASON은 학술 제안에 머물렀고, 실제 산업 채택 사례를 찾지 못했다. STEP-NC 온톨로지도 연구 수준이다. 현실적으로 제조 기업이 사용하는 지식 시스템은 PLM(Teamcenter, Windchill 등) 내 구조화된 메타데이터이며, 본격적인 온톨로지/KG를 운영하는 곳은 극소수다. "300-320% ROI"는 금융/헬스케어 포함 전 산업 평균이며, 제조 분야 단독 수치는 아니다. [인접 도메인: 전 산업 KG ROI]

### 3.2 RAG 기반 설계 규격 검색

| 접근 | 설명 | 성숙도 |
|---|---|---|
| **Document GraphRAG** [23] | 제조 도메인 문서 QA에 특화된 GraphRAG. 문서 구조 + 키워드 기반 링킹 | **연구** — 벡터 검색 대비 우수한 성능 보고 |
| **표준 RAG (벡터 DB)** | AGMA, ISO, DIN 등 규격 문서를 청크하여 벡터 DB에 저장, 유사도 기반 검색 | **시제** — 다수 스타트업/사내 도구 존재. 정확도는 규격 문서의 구조화 수준에 의존 |
| **GraphRAG (Microsoft)** | 글로벌 요약 + 커뮤니티 탐지로 복합 질의 처리 | **시제** — 제조 특화 적용 사례는 제한적 |

**실행 연결**: 제조 AI 시스템에서 RAG의 역할은 설계 에이전트가 "AGMA 2001-D04에 따른 기어 벤딩 응력 허용치"를 질의하면 정확한 표/수식을 반환하는 것이다. 현재 기술로 가능하나, (1) 규격 내 수식/표의 정확한 파싱, (2) 단위 변환, (3) 적용 조건 매칭에서 오류 가능성이 있다. 핵심은 청크 전략과 규격 문서의 구조적 파싱 품질이다.

### 3.3 설계 이력 추적 및 재활용

- **PLM 시스템**: 기존 PLM(Teamcenter, Windchill, 3DEXPERIENCE)이 설계 이력 관리의 사실상 표준.
- **AI 활용**: (1) 유사 설계 검색(형상 유사도 기반), (2) 과거 설계 변경 이유 추적, (3) 불량 연관 설계 패턴 탐지.
- **성숙도**: PLM 자체는 양산. AI 기반 설계 재활용은 시제 수준.

---

## 4. 실제 산업 사례와 성숙도

### 4.1 기술별 TRL 요약

| 기술 | TRL | 단계 | 근거 |
|---|---|---|---|
| LLM → CAD 코드 생성 | 3-4 | **연구** | 벤치마크 데이터셋에서 검증. 산업 부품에 대한 실증 없음 |
| Zoo Text-to-CAD (상용) | 5-6 | **시제** | API 공개, B-Rep/STEP 출력. 단순 부품 한정 |
| Generative Design (Fusion/NX) | 7-8 | **양산** | ISUZU, Elara 등 실제 제조 사례. 다만 최종 설계는 엔지니어 수정 필요 |
| nTopology 암시적 모델링 | 7-8 | **양산** | AM 분야에서 실제 생산 적용 |
| 토폴로지 최적화 (SIMP/BESO) | 9 | **양산** | 수십 년 역사. 모든 주요 CAE 소프트웨어에 내장 |
| ML-accelerated TO | 3-4 | **연구** | 속도 향상 증명, 신뢰성 검증 미흡 |
| FEA 자동화 (HyperMesh AI) | 7 | **양산** | ShapeAI 등 상용 기능 |
| FEA 자동화 (FeaGPT/Cosmon) | 3-5 | **연구/시제** | 단순 문제에서 시연 |
| VLM 시각 검증 | 2-3 | **연구** | 개선폭 제한적, 산업 적용 사례 없음 |
| SHACL 기반 설계 검증 | 2-3 | **연구** | 기계 설계 분야 적용 초기 |
| 규칙 기반 DRC | 8-9 | **양산** | 상용 CAD에 내장 |
| 설계 지식 그래프 | 4-5 | **시제** | 개별 기업 도입 사례 있으나 표준화 부재 |
| RAG 기반 규격 검색 | 4-5 | **시제** | 프로토타입 수준. 정확도 검증 필요 |
| PLM 기반 설계 이력 | 9 | **양산** | Teamcenter/Windchill 등 산업 표준 |

### 4.2 스타트업/연구 vs 양산 현장의 격차

**양산에서 실제 쓰이는 AI 설계 도구**:
- Autodesk Fusion Generative Design — 설계 탐색 도구로 활용 (최종 설계는 엔지니어가 수정)
- nTopology — AM 전용 래티스/경량화 설계
- Altair HyperMesh — FEA 전처리 자동화
- 상용 CAD 내장 DRC — 제조성 검증

**격차의 본질**:
1. **데이터**: 연구는 공개 데이터셋(Text2CAD, DeepCAD, Fusion360)을 사용하나, 실제 산업 CAD 데이터는 비공개이고 복잡도가 수배 높다.
2. **복잡도**: 연구 벤치마크의 형상은 단일 스케치-익스트루드 시퀀스가 대부분. 산업 부품은 수백 피처, 어셈블리, 공차, 표면 처리 사양을 포함.
3. **신뢰성**: "69.3% 정확도"는 연구에서 훌륭하지만, 양산에서는 99.9%+ 신뢰성이 필요. 30.7%의 실패율은 수용 불가.
4. **통합**: 연구 도구는 독립적으로 작동하나, 양산에서는 PLM-CAD-CAM-ERP 전체 체인과 통합되어야 한다.
5. **도입 장벽** [24]: 10,000+ 레이블 데이터셋 필요, 워크플로 복잡성, 블랙박스 신뢰 문제, 숙련 인력 부족.

---

## 5. 시너지 연결점: 설계 지능 → 공정 지능 / 실행 지능

### 5.1 설계 지능 → 공정 지능 (CAPP/공정 최적화)

| 인터페이스 | 데이터 포맷 | 역할 |
|---|---|---|
| **STEP AP242** | ISO 10303-242 (3D PMI 포함) | 설계 형상 + 치수/공차/표면 처리 정보를 공정 계획 시스템에 전달 |
| **설계 피처 → 제조 피처 매핑** | 자체 API 또는 온톨로지 | 설계의 "포켓"이 공정의 "밀링 작업"으로 매핑. AI가 이 매핑을 학습 가능 |
| **DFM 피드백 루프** | JSON/API | 공정 지능이 "이 형상은 5축 가공 필요, 비용 X" 피드백 → 설계 지능이 대안 탐색 |
| **토폴로지 최적화 제약** | 솔버 파라미터 | 공정 제약(최소 두께, 드래프트 각도, 언더컷 금지)을 TO 솔버에 입력 |

### 5.2 설계 지능 → 실행 지능 (MES/현장 AI)

| 인터페이스 | 데이터 포맷 | 역할 |
|---|---|---|
| **STEP-NC** | ISO 14649 | 설계 의도(Feature)를 CNC에 직접 전달. G-code 대비 풍부한 정보 |
| **검사 기준 전달** | QIF (Quality Information Framework) | 설계의 CTQ(Critical-to-Quality) 치수를 검사 시스템에 전달 |
| **실행 결과 피드백** | OPC-UA, MQTT | 현장 측정 데이터 → 설계 지식 그래프에 축적 → 다음 설계에 반영 |

---

## 6. 핵심 판단 및 실행 연결

### 6.1 현재 쓸 수 있는 것 (TRL 7+)

1. **Generative Design / Topology Optimization**: 설계 탐색 도구로 즉시 활용 가능. 단, 최종 설계는 엔지니어 검토 필수.
2. **FEA 전처리 자동화**: HyperMesh 등 상용 도구의 AI 기능.
3. **규칙 기반 DRC**: 제조성 검증 자동화.
4. **PLM 기반 설계 이력**: 기존 인프라 활용.

### 6.2 1-2년 내 실용화 가능 (TRL 4-6)

1. **LLM → CAD 코드 생성**: 단순 부품 또는 기존 설계 수정에 한정하여 보조 도구로 활용 가능. "엔지니어의 초안 생성기" 역할.
2. **RAG 기반 규격 검색**: 규격 문서의 구조적 파싱이 선행되면 실용화 가능.
3. **설계 지식 그래프**: 기업 데이터로 점진적 구축.
4. **Cosmon 류 FEA 에이전트**: 표준 문제에 대해 실용화 가능.

### 6.3 장기 과제 (TRL 2-3)

1. **VLM 시각 검증**: 3D 공간 추론 능력 부족. 보조 역할에 한정.
2. **SHACL 기반 설계 규칙 자동 추론**: 기계 설계 온톨로지 표준화 필요.
3. **완전 자율 설계 에이전트**: "요구사항 → 양산 가능한 설계"까지의 자동화. 현재 기술로는 불가.

### 6.4 제조 AI 시스템에서의 의사결정 가이드

- **설계 탐색 속도가 병목이면** → Generative Design + ML surrogate 도입
- **규격 준수 확인이 병목이면** → RAG + 규칙 기반 DRC 자동화
- **설계 재활용률이 낮으면** → 설계 KG 구축 + 유사 설계 검색
- **FEA가 병목이면** → HyperMesh AI 전처리 + ML surrogate 예측 병행
- **신규 부품 설계 초안이 필요하면** → LLM CAD 생성(CadQuery 기반) + 엔지니어 검토

---

## 참고문헌

[1] Xie et al., "Text-to-CadQuery: A New Paradigm for CAD Generation with Scalable Large Model Capabilities," arXiv:2505.06507, May 2025. https://arxiv.org/abs/2505.06507

[2] "CAD-Coder: Text-to-CAD Generation with Chain-of-Thought and Geometric Reward," NeurIPS 2025. https://arxiv.org/html/2505.19713

[3] "Towards High-Fidelity CAD Generation via LLM-Driven Program Generation and Text-Based B-Rep Primitive Grounding," arXiv:2603.11831, 2026. https://arxiv.org/html/2603.11831

[4] "CAD-MLLM: Unifying Multimodality-Conditioned CAD Generation With MLLM," arXiv:2411.04954, Nov 2024. https://arxiv.org/abs/2411.04954

[5] Rukhovich et al., "CAD-Recode: Reverse Engineering CAD Code from Point Clouds," ICCV 2025. https://openaccess.thecvf.com/content/ICCV2025/html/Rukhovich_CAD-Recode_Reverse_Engineering_CAD_Code_from_Point_Clouds_ICCV_2025_paper.html

[6] Zoo, "Text-to-CAD: Generating Editable, Parametric B-Rep." https://zoo.dev/research/introducing-text-to-cad

[7] Autodesk, "Generative Design for Manufacturing." https://www.autodesk.com/solutions/generative-design/manufacturing

[8] nTopology, "Implicit Modeling for Engineering Design." https://www.ntop.com/resources/blog/implicit-modeling-for-mechanical-design/

[9] Neural Concept, "Topology Optimization VS Generative Design." https://www.neuralconcept.com/post/topology-optimization-vs-generative-design

[10] "Deep learning accelerated efficient framework for topology optimization," Expert Systems with Applications, 2024. https://www.sciencedirect.com/science/article/abs/pii/S0952197624007176

[11] "Reinforcement learning-based topology optimization for generative designed lightweight structures," PMC, 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12355488/

[12] "Neural network-based surrogate model in postprocessing of topology optimized structures," Neural Computing and Applications, 2025. https://link.springer.com/article/10.1007/s00521-025-11039-2

[13] "FeaGPT: an End-to-End agentic-AI for Finite Element Analysis," arXiv:2510.21993, Oct 2025. https://arxiv.org/abs/2510.21993

[14] Altair, "AI-Powered Finite Element Modeling Software | HyperMesh." https://altair.com/hypermesh

[15] Cosmon, "Multi-Agent Systems for Finite Element Analysis." https://www.cosmon.com/insights/multi-agent-systems-for-finite-element-analysis

[16] "Generating CAD Code with Vision-Language Models for 3D Designs," ICLR 2025. https://arxiv.org/abs/2410.05340

[17] W3C, "Shapes Constraint Language (SHACL)." https://www.w3.org/TR/shacl/

[18] "Semantic and ontology-based analysis of regulatory documents for construction industry digitalization," Frontiers in Built Environment, 2025. https://www.frontiersin.org/journals/built-environment/articles/10.3389/fbuil.2025.1575913/full

[19] "DRC-SG 2.0: Efficient Design Rule Checking Script Generation via Key Information Extraction," ACM TODAES. https://dl.acm.org/doi/10.1145/3594666

[20] Lemaignan et al., "MASON: A Proposal For An Ontology Of Manufacturing Domain," IEEE, 2006. https://ieeexplore.ieee.org/document/1633441/

[21] "An ontology self-learning approach for CNC machine capability information integration," ScienceDirect. https://www.sciencedirect.com/science/article/abs/pii/S2452414X21000960

[22] Branzan, "From LLMs to Knowledge Graphs: Building Production-Ready Graph Systems in 2025," Medium. https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a

[23] "Document GraphRAG: Knowledge Graph Enhanced RAG for Document QA Within Manufacturing Domain," MDPI Electronics 14(11), 2025. https://www.mdpi.com/2078-2489/15/12/759

[24] "AI Trustworthiness in Manufacturing: Challenges, Toolkits, and the Path to Industry 5.0," PMC, 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12298069/
