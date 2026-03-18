# LLM과 CAD/CAM 시스템 통합 현황 및 가능성

> 조사일: 2026-03-18
> 상태: 심층 리서치 완료

---

## 목차

1. [LLM을 활용한 CAD 모델 생성 연구/제품](#1-llm을-활용한-cad-모델-생성-연구제품)
2. [Zoo.dev (前 KittyCAD) Text-to-CAD API 현황](#2-zoodev-前-kittycad-text-to-cad-api-현황)
3. [LLM + CadQuery/OpenSCAD 코드 생성 사례](#3-llm--cadqueryopenscad-코드-생성-사례)
4. [LLM의 파라메트릭 CAD 코드 생성 능력과 한계](#4-llm의-파라메트릭-cad-코드-생성-능력과-한계)
5. [GPT-4/Claude 등의 CAD 코드 생성 벤치마크/평가](#5-gpt-4claude-등의-cad-코드-생성-벤치마크평가)
6. [LLM + CAM 사례](#6-llm--cam-사례)
7. [LLM 기반 설계 의도 해석 및 설계 검증](#7-llm-기반-설계-의도-해석-및-설계-검증)
8. [CAD 모델의 자연어 설명/쿼리](#8-cad-모델의-자연어-설명쿼리)
9. [RAG를 활용한 설계 표준/핸드북 참조](#9-rag를-활용한-설계-표준핸드북-참조)
10. [기술 성숙도(TRL) 및 실용화 전망](#10-기술-성숙도trl-및-실용화-전망)
11. [주요 연구 그룹/기업](#11-주요-연구-그룹기업)

---

## 1. LLM을 활용한 CAD 모델 생성 연구/제품

### 1.1 Text-to-CAD 패러다임

LLM 기반 CAD 생성은 자연어 프롬프트에서 편집 가능한 CAD 모델을 생성하는 기술로, 실험적 프로토타입에서 기능적 도구 수준으로 발전했다. 기존 Text-to-3D(게임 에셋용 메시 생성)와 달리, Text-to-CAD는 **B-Rep(Boundary Representation) 표면**을 생성하여 STEP 파일로 내보내기가 가능하고, 기존 CAD 소프트웨어에서 편집할 수 있다는 점이 핵심 차별점이다.

### 1.2 주요 접근 방식

| 접근 방식 | 설명 | 대표 사례 |
|-----------|------|-----------|
| **직접 형상 생성** | ML 모델이 B-Rep/메시를 직접 출력 | Zoo.dev Text-to-CAD, Autodesk CAD-LLM |
| **코드 생성 (Text-to-Code-to-CAD)** | LLM이 CadQuery/OpenSCAD 코드를 생성하여 실행 | CADmium, Text-to-CadQuery, CAD-Coder |
| **멀티모달 생성** | 텍스트+이미지+스케치 입력 → CAD | LLM4CAD (GPT-4V 활용) |
| **역공학 (Reverse Engineering)** | 포인트 클라우드 → 실행 가능 Python 코드 | CAD-Recode |

### 1.3 핵심 연구 프로젝트

- **CADmium** (Mila/Montreal, 2025): Qwen2.5-Coder를 fine-tuning하여 자연어 → minimal-JSON CAD 이력으로 변환. 176,017개 CAD 모델에 GPT-4.1으로 생성한 텍스트 설명을 추가한 데이터셋 사용 [Mila, 2025]
- **CAD-Recode** (Univ. Luxembourg): 포인트 클라우드 데이터를 직접 실행 가능한 Python 코드로 변환. 사전 학습된 LLM 디코더와 경량 포인트 클라우드 프로젝터를 결합 [Dupont et al.]
- **CAD-LLM** (Autodesk Research): 사전 학습된 언어 모델을 fine-tuning하여 엔지니어링 스케치를 조작. 자연어 사전학습이 기하학적 이해와 복잡한 설계 추론에 유효함을 입증 [Autodesk Research]
- **LLM4CAD**: GPT-4/GPT-4V를 활용한 멀티모달 CAD 생성. 텍스트, 이미지, 스케치 세 가지 모달리티에서 CAD 프로그램 생성 능력 평가 [ASME JCISE, 2025]

> **출처**: https://mila.quebec/en/article/improving-cad-design-with-llms, https://www.research.autodesk.com/publications/ai-lab-cad-llm/, https://asmedigitalcollection.asme.org/computingengineering/article/25/2/021005/1208543/

---

## 2. Zoo.dev (前 KittyCAD) Text-to-CAD API 현황

### 2.1 개요

Zoo.dev는 2021년 창립된 KittyCAD에서 진화한 회사로, 현재 가장 성숙한 Text-to-CAD 구현체를 보유하고 있다. 공동창립자 Jordan Noone은 Relativity Space의 전 CTO이다.

### 2.2 제품 아키텍처

- **KittyCAD Design API**: GPU-네이티브 커스텀 지오메트리 엔진 기반
- **ML-ephant**: 머신러닝 API. 독점 데이터셋으로 훈련되며, KittyCAD Design API를 활용하여 CAD 파일 생성
- **Text-to-CAD**: ML-ephant의 엔드포인트. 텍스트 프롬프트 → STEP/GLTF 파일 생성
- **Zookeeper**: 대화형 CAD 에이전트. 리서치/추론 기능 + 엔진 레벨 도구(형상 검사, 스냅샷, 디버그)로 production-ready CAD 생성
- **Zoo Modeling App (ZMA)**: 오픈소스(SvelteKit). 포인트 앤 클릭 UI + KCL(KittyCAD Language) 코드 기반 제어

### 2.3 기술 특징

- **B-Rep 표면 생성**: 메시가 아닌 B-Rep을 생성하여 STEP 파일로 기존 CAD 소프트웨어(Fusion 360, SolidWorks 등)에서 편집 가능
- **다중 파일 포맷**: STEP, GLTF 기본 제공
- **KCL 코드 생성 예정**: 향후 생성된 KCL 코드를 함께 제공하여 파라메트릭 편집 가능하도록 계획
- **클라이언트 라이브러리**: Python, TypeScript, Go, Rust

### 2.4 현재 한계

- 프롬프트 명확성 요구: 모호한 프롬프트는 400 에러 반환
- 복잡한 프롬프트의 긴 처리 시간
- 생성 실패 가능성: 프롬프트 조정 및 재시도 필요
- 복잡한 어셈블리나 특수 엔지니어링 제약 조건 처리의 한계

### 2.5 API 사용 예시

```python
# pip install kittycad
from kittycad.api import ml
from kittycad.client import ClientFromEnv

client = ClientFromEnv()
result = ml.create_text_to_cad(
    client=client,
    output_format="step",
    body="Design a gear with 40 teeth"
)
```

> **출처**: https://zoo.dev/blog/introducing-text-to-cad, https://zoo.dev/machine-learning-api, https://zoo.dev/zookeeper, https://develop3d.com/cad/zoo-ecosystem-lays-foundation-for-modern-hardware-design-toolkit/

---

## 3. LLM + CadQuery/OpenSCAD 코드 생성 사례

### 3.1 CadQuery 생태계

CadQuery는 Python 기반 파라메트릭 CAD 스크립팅 라이브러리로, OpenCASCADE(OCCT) 커널 위에 구축되었다. LLM과의 궁합이 좋은 이유:

- **Python 기반**: LLM의 코드 생성 능력을 직접 활용 가능
- **고품질 출력**: STEP, AMF, 3MF 형식 지원 (STL만 지원하는 OpenSCAD 대비 우위)
- **파라메트릭**: 변수 기반 설계로 LLM이 치수 변경 용이
- **버전 관리**: 코드 기반이므로 Git으로 관리 가능

### 3.2 Text-to-CadQuery (2025)

최근 가장 주목할 연구로, CadQuery를 LLM의 CAD 생성 중간 언어로 활용하는 패러다임을 제안:

- **데이터셋**: Text2CAD의 minimal JSON 구조를 Gemini 2.0 Flash로 CadQuery 코드로 변환하여 170,000개 이상의 어노테이션 생성
- **성과**: 69.3% exact match accuracy (fine-tuned 모델)
- **상용 LLM 성능**: GPT-4o는 90% 이상 첫 시도 실행 성공률, Claude/Gemini는 피드백 루프로 약 85% 달성. GPT-4.1은 GPT-4o보다 더 높은 성능
- **도구 비교**: CadQuery가 사용성과 유연성 면에서 최적의 trade-off를 제공 (OpenSCAD, FreeCAD Python 대비)

### 3.3 OpenSCAD와의 비교

| 특성 | CadQuery | OpenSCAD |
|------|----------|----------|
| 커널 | OCCT (B-Rep) | CGAL (CSG) |
| 출력 포맷 | STEP, STL, AMF, 3MF | STL |
| 언어 | Python | 자체 DSL |
| LLM 친화성 | 높음 (Python 코드) | 중간 (자체 언어) |
| 산업 호환성 | 높음 (STEP) | 낮음 (STL만) |

### 3.4 Build123d

CadQuery와 동일한 OCP(Open CASCADE Python) 래퍼를 공유하는 대안적 프레임워크로, 더 직관적인 API를 제공한다. 두 프레임워크 간 객체 교환이 가능하다.

> **출처**: https://arxiv.org/html/2505.06507v1, https://github.com/cadquery/cadquery, https://cadquery.readthedocs.io/, https://timderzhavets.com/blog/cadquery_python_cad_ecosystem/

---

## 4. LLM의 파라메트릭 CAD 코드 생성 능력과 한계

### 4.1 현재 능력

- **단순~중간 복잡도 부품**: 기어, 브래킷, 플레이트, 하우징 등 표준 기계 부품의 파라메트릭 코드 생성이 가능
- **코드 구조 이해**: LLM은 CadQuery의 체인 호출 패턴, 워크플레인 설정, 스케치-익스트루드 시퀀스를 이해
- **디버깅/수정**: 피드백 루프를 통한 자기 수정(self-correction)이 효과적. CADCodeVerify 연구에서 VLM 기반 시각적 피드백으로 성공률 5% 향상 확인
- **파라메트릭 설계**: 변수화된 치수, 조건부 형상 등의 파라메트릭 코드 생성 가능

### 4.2 핵심 한계

| 한계 | 설명 |
|------|------|
| **기하학적 정밀도** | 복잡한 곡면, 필렛, 챔퍼의 정확한 치수 지정이 불안정 |
| **어셈블리 수준 설계** | 다중 부품 어셈블리, 끼워맞춤, 공차 시스템은 아직 미지원 |
| **설계 제약 조건** | GD&T(기하 공차), 제조성 제약의 일관된 적용 곤란 |
| **공간 추론** | 3D 공간에서의 상대적 위치/방향 추론이 불완전 |
| **CAD 데이터 표현** | LLM은 본질적으로 텍스트 기반이므로 3D 기하학, 어셈블리, 공차, 제약조건을 네이티브로 이해하지 못함 |
| **오류 비용** | 소프트웨어와 달리 제조에서의 설계 오류는 수백만 달러의 비용 초래 가능 |
| **복잡한 토폴로지** | 다중 루프 스케치, 스윕, 로프트 등의 고급 형상 연산에서 실패율 증가 |

### 4.3 해결 방향

- **코드로서의 CAD (CAD-as-Code)**: CADmium, Text-to-CadQuery 등이 채택한 접근. CAD를 코드로 표현함으로써 LLM의 코드 생성 능력을 최대한 활용
- **Solver-Aided 언어**: 기하학적 제약을 솔버에 위임하여 LLM의 정밀도 한계를 보완
- **RL 기반 최적화**: 실행 가능성(R_exec), 기하학적 정확도(R_geom), LLM 평가(R_eval)을 결합한 보상 함수로 강화학습 적용
- **멀티모달 입력**: 텍스트만이 아닌 이미지/스케치 입력으로 설계 의도 전달의 모호성 감소

> **출처**: https://arxiv.org/html/2505.06507v1, https://www.getleo.ai/blog/the-complete-guide-to-cad-software-in-2025-desktop-vs.-cloud-features-and-ai-capabilities, https://openreview.net/forum?id=BLWaTeucYX

---

## 5. GPT-4/Claude 등의 CAD 코드 생성 벤치마크/평가

### 5.1 Text-to-CadQuery 벤치마크 (2025)

가장 체계적인 평가로, 상용 및 오픈소스 LLM의 CadQuery 코드 생성 능력을 비교했다:

| 모델 | 첫 시도 실행 성공률 | 피드백 루프 후 성공률 | 기하학적 정확도 |
|------|---------------------|----------------------|----------------|
| **GPT-4.1** | >90% (GPT-4o 대비 우위) | - | 최고 수준 |
| **GPT-4o** | >90% | - | 높음 |
| **Claude** | ~80% | ~85% | GPT-4o와 유사 |
| **Gemini** | ~80% | ~85% | GPT-4o와 유사 |
| **오픈소스 (소형)** | 낮음 | 제한적 개선 | fine-tuning 필요 |

### 5.2 CADCodeVerify 벤치마크 (ICLR 2025)

- **CADPrompt**: 최초의 CAD 코드 생성 벤치마크. 200개 자연어 프롬프트 + 전문가 어노테이션 스크립팅 코드
- **평가 지표**: Point Cloud Distance, 컴파일 성공률
- **GPT-4 결과**: CADCodeVerify 적용 시 Point Cloud distance 7.30% 감소, 성공률 5.0% 향상

### 5.3 평가 지표 체계

| 지표 | 설명 |
|------|------|
| **VSR (Valid Syntax Rate)** | Python/CadQuery 오류 없이 컴파일·실행되는 비율 |
| **Chamfer Distance (CD)** | 생성·정답 메시의 포인트 클라우드 거리 |
| **IOU (Intersection over Union)** | 정규화·축 정렬 후 체적 오버랩 비율 |
| **Exact Match Rate** | 생성 코드와 참조 코드의 문자열 일치율 |
| **외부 LLM 판정** | Vision-LLM이 의미적 동등성을 판단 |

### 5.4 LLM4CAD 평가

ASME 논문에서 GPT-4/GPT-4V를 기어 등 대표 3D 설계 객체에 대해 평가. 디버거를 제안하여 생성 품질 향상. 텍스트, 이미지, 스케치 세 모달리티에서 비교 수행.

> **출처**: https://arxiv.org/html/2505.06507v1, https://openreview.net/forum?id=BLWaTeucYX, https://asmedigitalcollection.asme.org/computingengineering/article/25/2/021005/1208543/

---

## 6. LLM + CAM 사례

### 6.1 G-code 생성: GLLM

**GLLM** (2025)은 fine-tuned StarCoder-3B를 사용하여 자연어 → G-code 직접 변환을 수행하는 도구이다:

- **방법**: 고급 프롬프팅 + RAG(도메인 데이터) + 자기 수정(self-correction) 루프
- **검증**: 구문 검사, G-code 시뮬레이션 검증, Hausdorff distance로 기능적 정확성 평가
- **반복 개선**: 생성된 G-code의 툴패스가 사용자 사양과 일치할 때까지 또는 최대 반복 횟수에 도달할 때까지 반복

### 6.2 CloudNC CAM Assist

**CAM Assist**는 10년 이상, $100M 이상의 R&D 투자로 개발된 산업용 AI CAM 솔루션:

- **현황**: 전 세계 약 1,000개 머신 샵에서 일일 사용 중 (2025 기준)
- **지원 플랫폼**: Mastercam, Fusion, Siemens NX, GibbsCAM(조기 접근), SolidCAM, Creo
- **성능**: 3+2축 부품의 약 80% 툴패스 생성을 자동화
- **CAM Assist 2.0**: 투명성 추가 — 수행/미수행 작업, 누락 사항, 이유를 표시. 작업 제외 선택, 체적 추정, 툴링 제안 기능
- **핵심 차별점**: 단순 프롬프트-응답 방식이 아닌, 자체 팩토리에서 학습한 도메인 전문 AI

### 6.3 Siemens NX CAM Copilot

Siemens NX CAM에 통합된 AI 코파일럿:

- 프로그래밍 시간을 시간 → 분 단위로 단축
- 채터(chatter) 사전 감지로 공구/부품 손상 방지
- 전문가 지식의 팀 전체 확산
- 자연어로 기계와 상호작용 가능
- 설계-엔지니어링-생산을 연결하는 디지털 스레드의 핵심 역할

### 6.4 LLM 기반 공정 계획

Springer 논문(2025)에서 LLM을 활용한 자연어 기반 생산 계획을 제안:

- 산업 도메인 규칙/제약을 프롬프트에 포함(knowledge guardrails)
- 자원 매개변수, 처리 시간 범위, 생산 계획 제약 등의 제조 전문성을 프롬프트 구조에 직접 내장
- 비현실적/부적절한 파라미터 생성 방지

### 6.5 절삭 조건 추천

LLM이 재료 특성(예: 열 변형이 쉬운 금속)을 해석하여 절삭 조건을 최적화하고 툴패스를 추천하는 사례가 보고됨. 다만 도메인 특화 fine-tuning 없이는 복잡한 시나리오에서 오류 위험이 있어 규칙 기반 로직과의 하이브리드 접근이 권장됨.

> **출처**: https://arxiv.org/pdf/2501.17584, https://www.cloudnc.com/blog/ai-the-future-of-machining, https://www.mastercam.com/community/blog/ai-enabled-manufacturing-programs-to-watch-in-2025/, https://link.springer.com/article/10.1007/s10845-025-02732-z

---

## 7. LLM 기반 설계 의도 해석 및 설계 검증

### 7.1 설계 의도 해석

- **From Text to Design** (Cambridge, 2025): LLM 에이전트 프레임워크로 텍스트에서 자동 CAD 생성. 다양한 복잡도와 모호성의 기하학에 대해 세 가지 텍스트 프롬프트로 테스트. 이진 성공/실패 시각 검사로 평가
- **G-Forge**: 멀티모달 LLM을 CAD 모델과 G-code에 대해 훈련. 적층제조용 자연어 쿼리로 설계를 추론하고 변환
- **MecAgent**: SolidWorks, CATIA, Inventor, Fusion 360, Creo와 통합되는 AI 코파일럿. 주변 어셈블리 컨텍스트 기반 파라메트릭 부품 자동 생성, 산업 표준 준수 확인, 실시간 제조 비용 추정

### 7.2 설계 검증

- **LLM 기반 오류 검출**: 구문 오류, 기하학적 불일치, 설정 불일치, 가공 결함 탐지
- **CADCodeVerify**: VLM이 검증 질문을 생성/응답하여 생성된 3D 객체를 확인하고, VLM에게 편차를 수정하도록 프롬프트
- **한계**: 기본 형상에서는 정확도 향상을 보이지만, 도메인 특화 훈련 없이 복잡한 기하학에서는 위험. 대용량 파일의 컨텍스트 길이 제한, 산업용 안전성/신뢰성 검증, AI 출력과 전통적 방법 간 검증 필요

### 7.3 Design for Manufacturing (DFM)

MIT HDSR 논문 "How Can LLMs Help Humans in Design and Manufacturing?"에서 CDaM(Computational Design and Manufacturing) 워크플로우를 5단계로 분석:

1. **설계 생성**: LLM이 DSL(Domain-Specific Language) 코드를 통해 직접 설계 생성
2. **설계 공간 구성**: 설계 변형과 파라메트릭 공간 탐색
3. **제조 준비**: STEP-NC 등 제조 지향 표현으로 변환 (설계 DSL → 제조 DSL 번역)
4. **성능 평가**: 시뮬레이션 설정 및 결과 해석
5. **고성능 설계 발견**: 주어진 성능 메트릭과 설계 공간에서 최적 설계 탐색

> **출처**: https://hdsr.mitpress.mit.edu/pub/15nqmdzl, https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/5BD8D63CFCED28BDD7A01313162FFBE7, https://openreview.net/forum?id=BLWaTeucYX

---

## 8. CAD 모델의 자연어 설명/쿼리

### 8.1 OntoBREP 기반 자연어 쿼리 (TU Munich)

- LLM을 사용하여 자연어를 SPARQL 쿼리로 변환, OntoBREP 온톨로지 위에서 CAD 모델 질의
- 멀티모달 응답: 자연어 답변 + 관련 하위 기하학의 시각적 하이라이트
- 체계적 평가로 다양한 CAD 모델과 쿼리에 대한 효과성 입증

### 8.2 CAD 형상 인식

- **"Do LLMs Understand Shapes?"**: STL 파일을 활용한 자동 CAD 형상 인식 연구
- **Leveraging VLMs for Manufacturing Feature Recognition**: 비전-언어 모델로 CAD 설계에서 제조 피처 인식
- **CADTalk**: CAD 프로그램의 의미적 주석 생성 알고리즘 + 벤치마크

### 8.3 2D CAD → 3D 파라메트릭 모델

"From 2D CAD Drawings to 3D Parametric Models: A Vision-Language Approach" — 비전-언어 모델을 사용하여 2D 도면에서 3D 파라메트릭 모델로 변환하는 연구.

> **출처**: https://mediatum.ub.tum.de/doc/1792874/1792874.pdf, https://github.com/lichengzhanguom/LLMs-CAD-Survey-Taxonomy

---

## 9. RAG를 활용한 설계 표준/핸드북 참조

### 9.1 엔지니어링 RAG 시스템 구축

| 구성 요소 | 모범 사례 | 도구/모델 |
|-----------|-----------|-----------|
| **데이터 준비** | 중복 제거, 정규화, 엔지니어 용어 엔티티 해소 | - |
| **임베딩** | 엔지니어링 코퍼스에 fine-tuned된 도메인 특화 모델 | text-embedding-3-large, SBERT |
| **검색** | 하이브리드 BM25 + 신경망 검색; ANN 인덱싱 | FAISS, Pinecone |
| **저장** | 벡터 DB + CAD 어휘 도메인 적응 시맨틱 청킹 | Weaviate, Chroma |
| **평가** | Precision/Recall/F1; 충실도 검사 | ROUGE/BLEU + 인간 평가 |

### 9.2 사례: FEMMa Oracle RAG

- 전기 기계에 관한 28개 PDF를 처리
- text-embedding-3-large + GPT-4o로 구조화된 엔지니어링 문서의 빠른 검색
- 100명 사용자 대상 정확도/투명성 평가

### 9.3 CAD 워크플로우 통합

- ASME, ISO 핸드북 등 설계 표준을 벡터화하여 RAG 파이프라인에 통합
- NX 저널을 벡터로 파싱하는 도구 등 CAD 특화 LLM 접근
- 설계 프로세스를 위한 명시적 설계 지식을 RAG에서 식별하는 전문화된 방법론
- Azure AI Search 기반 에이전틱 RAG로 복잡한 CAD 쿼리 처리

### 9.4 활용 시나리오

1. **설계 표준 준수 확인**: "이 부품이 ASME Y14.5 공차 기준을 만족하는가?"
2. **재료 선택 지원**: 핸드북 데이터 기반 재료 특성/적합성 조회
3. **과거 설계 참조**: 유사 설계 사례 검색 및 재활용
4. **NX Open 스크립트 자동 생성**: RAG로 API 문서를 참조하여 자동화 코드 생성

> **출처**: FEMMa Oracle RAG 시스템, Azure AI Search 문서, MIT NLP Group

---

## 10. 기술 성숙도(TRL) 및 실용화 전망

### 10.1 분야별 TRL 평가

| 분야 | TRL | 근거 |
|------|-----|------|
| **Text-to-CAD (단순 부품)** | TRL 6-7 | Zoo.dev 상용 API, 다수 연구 프로토타입 |
| **Text-to-CAD (복잡 어셈블리)** | TRL 3-4 | 실험실 수준, 실패율 높음 |
| **CadQuery/OpenSCAD 코드 생성** | TRL 5-6 | 벤치마크 존재, 반복 정제로 실용 수준 접근 |
| **CAM/G-code 생성** | TRL 7-8 | CAM Assist 1,000개 샵 배치. GLLM 프로토타입 |
| **설계 의도 해석** | TRL 4-5 | 학술 연구 활발, 산업 적용 초기 |
| **자연어 CAD 쿼리** | TRL 4-5 | 프로토타입 존재, 산업 검증 부족 |
| **RAG + 설계 표준** | TRL 6-8 | FEMMa Oracle 등 프로토타입 배치, Azure/Databricks 인프라 성숙 |
| **CAD 벤더 AI 코파일럿** | TRL 6-7 | Siemens, PTC, Autodesk 제품화 완료, 기능 범위 제한적 |

### 10.2 실용화 타임라인

| 시기 | 예상 발전 |
|------|-----------|
| **2025 (현재)** | 단순 부품 Text-to-CAD 상용화, CAD 벤더 코파일럿 출시(주로 문서 참조/학습 지원), CAM Assist 확산 |
| **2026** | 하이브리드/에이전틱 RAG 본격 채택, CAD 코퍼스 fine-tuned LLM으로 Siemens NX/Autodesk 실질 통합, 파라메트릭 코드 생성 정확도 90%+ 달성 (상용 LLM) |
| **2027-2028** | 멀티파트 어셈블리 수준의 Text-to-CAD, DFM 자동 검증 통합, CAD-CAM-CAE 통합 AI 워크플로우 |
| **2030+** | 완전 자율 설계 에이전트 (설계-시뮬레이션-최적화-제조 계획의 end-to-end 자동화) |

### 10.3 핵심 장벽

1. **CAD 데이터의 비텍스트 특성**: 3D 기하학을 텍스트 기반 LLM이 네이티브로 이해하기 어려움
2. **오류의 높은 비용**: 제조 분야에서 설계 오류는 소프트웨어 버그와 달리 복구 비용이 극히 높음
3. **CAD 벤더의 보수적 혁신**: 대형 CAD 벤더는 AI 퍼스트 개발 전환이 느림
4. **훈련 데이터 부족**: 고품질 CAD 모델 + 자연어 설명 쌍의 데이터셋이 제한적
5. **검증/인증**: 안전 필수 산업(항공, 의료)에서 AI 생성 설계의 인증 절차 미확립

> **출처**: https://www.getleo.ai/blog/the-complete-guide-to-cad-software-in-2025-desktop-vs.-cloud-features-and-ai-capabilities, https://www.engineering.com/3-ai-features-coming-to-every-cad-program-in-2026/

---

## 11. 주요 연구 그룹/기업

### 11.1 학술 연구 그룹

| 기관 | 연구 초점 | 대표 성과 |
|------|-----------|-----------|
| **MIT** (HDSR, NLP Group) | CDaM 워크플로우 내 LLM 활용, 도메인 특화 임베딩 | "How Can LLMs Help in Design and Manufacturing?" 논문 |
| **Mila / Univ. Montreal** | Text-to-CAD-as-Code | CADmium: Qwen2.5-Coder fine-tuning, 176K 데이터셋 |
| **Univ. Luxembourg** | CAD 역공학 | CAD-Recode: 포인트 클라우드 → Python 코드 |
| **TU Munich** | CAD 모델 자연어 쿼리 | OntoBREP + SPARQL + LLM 통합 |
| **Georgia Tech** | CAD 코드 생성/검증 | CADCodeVerify (ICLR 2025) |
| **Stanford** | 하이브리드 검색, RAG 기초 | RAG 기반 기술의 CAD 시맨틱 적용 |

### 11.2 기업

| 기업 | 제품/접근 | 현황 |
|------|-----------|------|
| **Zoo.dev** (前 KittyCAD) | Text-to-CAD, Zookeeper, KCL | 가장 성숙한 Text-to-CAD 구현. 오픈소스 UI |
| **Autodesk** | CAD-LLM, Autodesk Assistant, Fusion Generative Design | Research Lab에서 CAD-LLM 연구. Autodesk Assistant는 문서 지원 수준 |
| **Siemens** | Design Copilot NX, CAM Copilot, PMI Prediction | Microsoft Phi-3 기반 코파일럿. 자연어 → NX Open 코드 생성 |
| **PTC** | Creo 12 AI 기능, Onshape AI Advisor | 생성적 설계(열역학 통합), 클라우드 네이티브 AI |
| **Dassault Systèmes** | Aura (3DExperience 가상 동반자) | 발표는 화려하나 실질 기능은 제한적이라는 평가 |
| **CloudNC** | CAM Assist (Mastercam, NX, Fusion 등) | 10년+ R&D, 1,000개 샵 배치, 80% 툴패스 자동화 |
| **MecAgent** | 멀티 플랫폼 CAD AI 코파일럿 | SolidWorks/CATIA/Inventor/Fusion/Creo 통합 |
| **Leo AI** | CAD 시스템 불문 AI 엔지니어링 어시스턴트 | CAD 벤더 독립적 접근 |

### 11.3 종합 분석 (LLMs-CAD Survey Taxonomy)

GitHub 저장소 `lichengzhanguom/LLMs-CAD-Survey-Taxonomy`에 LLM+CAD 관련 논문의 포괄적 분류체계가 정리되어 있으며, 다음 카테고리를 포함:

- CAD 코드 생성
- CAD 역공학
- 제조 피처 인식
- 설계 교육에서의 LLM
- 대화형 CAD 워크플로우
- STL 파일 기반 형상 이해

> **출처**: https://github.com/lichengzhanguom/LLMs-CAD-Survey-Taxonomy, https://www.siemens.com/en-us/products/designcenter/nx-cad-software/ai/, https://www.ptc.com/en/technologies/cad/artificial-intelligence

---

## 결론 및 핵심 인사이트

### 현재 상태 요약

1. **Text-to-CAD는 "작동하지만 제한적"**: 단순 기계 부품은 생성 가능하나, 산업 수준의 복잡한 어셈블리에는 미달
2. **Code-as-CAD가 유망한 중간 경로**: CadQuery 코드 생성이 직접 형상 생성보다 LLM 능력과 잘 맞음. GPT-4o/4.1이 90%+ 실행 성공률 달성
3. **CAM이 CAD보다 앞서 있음**: CloudNC CAM Assist는 이미 1,000개 샵에서 실무 사용 중 — AI+제조에서 가장 성숙한 사례
4. **대형 CAD 벤더는 보수적**: Siemens, Autodesk, PTC의 AI 통합은 주로 문서 지원/학습 도우미 수준. 실질적 설계 변경은 초기 단계
5. **RAG는 즉시 적용 가능한 가치 제공**: 설계 표준/핸드북 참조, 과거 설계 재활용 등에서 RAG는 TRL 6-8로 가장 실용적

### 주요 불확실성

- 안전 필수 산업에서 AI 생성 설계의 인증/검증 프로세스
- 대규모 어셈블리/멀티바디 시스템에서의 LLM 확장성
- CAD 벤더의 AI 전략 방향 (자체 개발 vs. 서드파티 통합 vs. 개방 생태계)

---

## 참고 문헌

1. Zoo.dev Blog — "Introducing Text-to-CAD" https://zoo.dev/blog/introducing-text-to-cad
2. Zoo.dev — ML-ephant API https://zoo.dev/machine-learning-api
3. Zoo.dev — Zookeeper https://zoo.dev/zookeeper
4. Develop3D — "Zoo ecosystem lays foundation..." https://develop3d.com/cad/zoo-ecosystem-lays-foundation-for-modern-hardware-design-toolkit/
5. Text-to-CadQuery (arXiv, 2025) https://arxiv.org/html/2505.06507v1
6. CadQuery GitHub https://github.com/cadquery/cadquery
7. LLM4CAD (ASME JCISE) https://asmedigitalcollection.asme.org/computingengineering/article/25/2/021005/1208543/
8. CADCodeVerify (ICLR 2025) https://openreview.net/forum?id=BLWaTeucYX
9. GLLM — G-code via LLM (arXiv, 2025) https://arxiv.org/pdf/2501.17584
10. CloudNC — CAM Assist https://www.cloudnc.com/blog/ai-the-future-of-machining
11. Mastercam — AI Manufacturing Programs 2025 https://www.mastercam.com/community/blog/ai-enabled-manufacturing-programs-to-watch-in-2025/
12. LLM for Production Planning (Springer, 2025) https://link.springer.com/article/10.1007/s10845-025-02732-z
13. MIT HDSR — "How Can LLMs Help in Design and Manufacturing?" https://hdsr.mitpress.mit.edu/pub/15nqmdzl
14. Cambridge — "From Text to Design" https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/5BD8D63CFCED28BDD7A01313162FFBE7
15. CAD-LLM (Autodesk Research) https://www.research.autodesk.com/publications/ai-lab-cad-llm/
16. CADmium (Mila) https://mila.quebec/en/article/improving-cad-design-with-llms
17. CAD-Recode (Univ. Luxembourg) https://orbilu.uni.lu/bitstream/10993/65389/1/Thesis_EDupont.pdf
18. OntoBREP Natural Language CAD Query (TU Munich) https://mediatum.ub.tum.de/doc/1792874/1792874.pdf
19. LLMs-CAD Survey Taxonomy https://github.com/lichengzhanguom/LLMs-CAD-Survey-Taxonomy
20. Siemens NX AI https://www.siemens.com/en-us/products/designcenter/nx-cad-software/ai/
21. Siemens NX Open + AI https://inteliscience.net/siemens-nx-open-and-the-future-of-industrial-engineering-automation/
22. PTC AI in CAD https://www.ptc.com/en/technologies/cad/artificial-intelligence
23. Engineering.com — "3 AI features coming to every CAD program in 2026" https://www.engineering.com/3-ai-features-coming-to-every-cad-program-in-2026/
24. Leo AI — "Complete Guide to CAD Software in 2025" https://www.getleo.ai/blog/the-complete-guide-to-cad-software-in-2025-desktop-vs.-cloud-features-and-ai-capabilities
25. CadQuery Python Ecosystem https://timderzhavets.com/blog/cadquery_python_cad_ecosystem/
26. Siemens NX CAM Copilot (LinkedIn) https://www.linkedin.com/posts/rambs_the-manufacturer-spotlights-how-siemens-industrial-activity-7401876663342727168-gAma
27. MecAgent — AI CAD Copilot https://mecagent.com/blog/ai-in-cad-how-2025-is-reshaping-mechanical-design-workflows
