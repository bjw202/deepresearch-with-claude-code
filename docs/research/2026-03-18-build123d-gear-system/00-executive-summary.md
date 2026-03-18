# build123d + LLM + 온톨로지 기어 설계-제조 통합 시스템 — 종합 리서치 보고서

**날짜**: 2026-03-18
**선행 리서치**: `../2026-03-18-gear-system/` (CadQuery 기반)
**리서치 구성**: 서브 에이전트 3개 (build123d, 아키텍처, 온톨로지) + Critic 검토 + 메인 통합

---

## 상세 보고서 목차

| # | 파일 | 내용 |
|---|------|------|
| 01 | [01-build123d-gear-modeling.md](./01-build123d-gear-modeling.md) | build123d 기어 모델링 능력, py_gearworks, LLM 친화성, FEA 연동 |
| 02 | [02-integrated-architecture.md](./02-integrated-architecture.md) | Multi-Agent 아키텍처, MCP 도구 설계, Closed-Loop 피드백, 데이터 흐름 |
| 03 | [03-ontology-enhancement.md](./03-ontology-enhancement.md) | MASON 확장 온톨로지 스키마, SWRL 규칙, SHACL 검증, LLM Grounding |

---

## 이전 리서치 대비 핵심 변경점

| 항목 | 이전 (CadQuery 기반) | 이번 (build123d 기반) |
|------|---------------------|----------------------|
| **CAD 엔진** | CadQuery (fluent API) | build123d (Context Manager + Algebra) |
| **기어 라이브러리** | cq_gears (spur 위주) | py_gearworks (spur, helical, bevel, cycloid, ring) |
| **아키텍처** | 개략적 파이프라인 | 6-Agent + 3 MCP Server + Closed-Loop |
| **온톨로지** | MASON 확장 방향 제시 | 구체 OWL 스키마 + 7 SWRL 규칙 + 6 SHACL Shapes + Python 구현 |
| **LLM 통합** | tool_use 개념 | 9개 도구 JSON Schema + 3대 Grounding 패턴 |
| **검증** | 개념적 | SHACL 자동 검증 + VLM 시각 검사 + 코드 실행 피드백 |

---

## 핵심 결론

### 1. build123d 전환: 실질적 이점 있음

| 평가 항목 | build123d 우위 | 근거 |
|----------|---------------|------|
| **기어 커버리지** | 확실 | py_gearworks: 5종 기어 + mesh_to() 자동 배치. cq_gears: spur 위주 |
| **API 구조** | 우수 | Context Manager 스코핑, Algebra 모드, Enum 타입, mypy 완전 지원 |
| **LLM 코드생성** | 유망하나 미실증 | 구조적 이점(스코프, 타입)은 논리적이나 비교 벤치마크 없음 |
| **STEP export** | 동등 | 동일 OCCT 커널 |
| **안정성** | 열세 | Pre-1.0, CadQuery 대비 커뮤니티 1/5 규모, 핵심 개발자 1인 의존 |

**판단**: 기어 도메인 한정으로 build123d + py_gearworks 조합이 CadQuery + cq_gears 대비 우위. 다만 안정성 리스크는 존재.

### 2. 아키텍처: 풀 비전은 강력하지만 MVP 분리 필수

**제안된 풀 아키텍처:**
```
사용자 → [Design Intent Agent] → [Ontology Reasoning Agent] → [Parametric Modeling Agent]
                                                                        ↓
[Manufacturing Planning Agent] ← [Optimization Agent] ← [Verification Agent] ← build123d
                                                              ↑ VLM 시각 검사
```

6-Agent + 3 MCP Server + Neo4j + OWL/SHACL + RAG.

**Critic 판정: 풀 비전은 복잡도 과다. MVP 분리 필요.**

| MVP (3개월) | 풀 비전 (6개월+) |
|-------------|----------------|
| build123d + py_gearworks 직접 호출 | Multi-Agent 오케스트레이션 |
| SHACL 파라미터 검증 (6 shapes) | OWL 추론 + SWRL 규칙 + Neo4j KG |
| 코드 실행 피드백 루프 (최대 3회) | VLM 시각 검증 + 다목적 최적화 |
| Claude tool_use (gear_create + ontology_validate) | 9개 MCP 도구 전체 |

### 3. 온톨로지: 구체적 스키마 확보, 실용적 가치 높음

**확보된 산출물:**
- MASON 확장 기어 온톨로지: 7 기어 유형, 9 공정, 6 공구, 7 소재 클래스
- SWRL 규칙 7개: 공정 추론, 파라미터 자동 계산, 제약 검증
- SHACL shapes 6개: 파라미터 범위, 공정-품질 정합성, 호브-기어 모듈 매칭
- Owlready2 전체 구현 코드
- LLM Grounding 3대 패턴: Schema-in-Prompt, KG-Triple Retrieval, Ontology-Constrained Generation

**실질적 가치**: SHACL 검증만으로도 LLM 출력의 수치적 오류를 형식적으로 걸러낼 수 있다. 이것이 온톨로지 투자의 최우선 ROI.

---

## 핵심 의사결정

| 결정 | 근거 | 기각된 대안 | 리스크 |
|------|------|------------|--------|
| CadQuery → build123d 전환 | py_gearworks 기어 커버리지, Pythonic API | CadQuery 유지 (커뮤니티 더 큼) | Pre-1.0 API 변경 |
| py_gearworks + bd_warehouse 병행 | 각각 강점 상이 | py_gearworks 단독 (spur 외 필수) | 통합 미합의 상태 |
| MASON 기반 기어 온톨로지 신규 구축 | 공개 기어 전용 온톨로지 부재 | MSDL 기반 (서비스 지향, 기어 부적합) | 100-200 클래스 직접 구축 비용 |
| OWL + SHACL + Neo4j 하이브리드 | 형식추론 + 런타임검증 + 대규모쿼리 | 순수 OWL (성능), 순수 PG (추론불가) | 3개 기술 스택 동시 운영 |
| MCP 기반 도구 통합 | MADA 패턴 검증, 에이전트-도구 분리 | 직접 함수 호출 (단순하지만 확장 불가) | MCP 생태계 성숙도 |
| Pellet → HermiT 검토 필요 | Pellet: AGPL, HermiT: BSD | Pellet 유지 (SWRL 지원 우수) | **라이선스 리스크** |

---

## 기술 스택

| 영역 | 도구 | 비고 |
|------|------|------|
| CAD 커널 | **build123d** (OCCT) | Context Manager + Algebra 이중 모드 |
| 기어 라이브러리 | **py_gearworks** + bd_warehouse | 5종 기어 + mesh_to() 자동 배치 |
| LLM | Claude API (tool_use) | Orchestrator + 코드생성 |
| 온톨로지 | Owlready2 + pyshacl + RDFLib | OWL 스키마 + SHACL 검증 |
| KG | Neo4j (확장 시) | 런타임 쿼리, Cypher |
| RAG | LlamaIndex | 규격/핸드북/카탈로그 |
| 추론 | HermiT (권장) 또는 Pellet | SWRL 규칙 실행 (**Pellet AGPL 주의**) |
| 검증 | build123d 실행 + pyshacl | MVP 핵심 |
| VLM | Claude Vision (확장 시) | CADCodeVerify 패턴 |
| FEA 연동 | gmsh + meshio + CalculiX | STEP → 메싱 → FEA |
| Export | STEP AP242, STL, 3MF | STEP이 제조용 기본 |

---

## 로드맵 (현실화)

### Phase 1: MVP — 파라메트릭 기어 생성 + 검증 (2-3개월)
> "module 2, 20 teeth 스퍼 기어 만들어줘" → SHACL 검증 → build123d 실행 → STEP 파일

- build123d + py_gearworks 기반 기어 생성 함수
- Claude tool_use: `gear_create`, `ontology_validate` 2개 도구
- SHACL shapes 6개로 파라미터 자동 검증
- 코드 실행 피드백 루프 (실패 시 자동 재시도 최대 3회)
- STEP/STL 내보내기

**선행 조건**: py_gearworks 다단 기어 트레인 API 실제 테스트

### Phase 2: 온톨로지 + 공정 지식 (3-4개월 추가)
> "이 기어에 적합한 가공 공정은?" → SWRL 추론 + KG 쿼리

- Owlready2 기반 기어 온톨로지 (100-200 클래스)
- SWRL 규칙 7개 + 추론 엔진
- Neo4j KG 구축 (소재-열처리-공정 매핑)
- RAG 기반 공구 카탈로그/규격 검색
- LLM Grounding 3대 패턴 적용

### Phase 3: Multi-Agent + Closed-Loop (4-6개월 추가)
> 설계 → 모델링 → 검증 → 공정계획 → 최적화 전체 자동화

- 6-Agent 오케스트레이션
- MCP 서버 3개 (build123d, Ontology, Process Planner)
- VLM 시각 검증
- 다목적 최적화 (중량/강도/비용)
- FEA 파이프라인 연동

---

## Critic 검토에서 도출된 주요 경고

### 수치의 도메인 한정 ⚠️

| 인용 수치 | 원래 도메인 | 기어 도메인 적용 가능성 |
|-----------|-----------|---------------------|
| 환각률 63% → 1.7% | 임상 QA (PubMed) | **미검증** — 도메인/쿼리 유형이 전혀 다름 |
| 성공률 53% → 85% | Text-to-CadQuery (GPT-4) | **부분 적용** — build123d 기준 동등 수치 없음 |
| Point Cloud 7.3% 개선 | CADCodeVerify (범용 CAD) | **미검증** — 기어 치형 미세 차이 식별 가능성 의문 |

**원칙**: 이 수치들을 "기대값"이 아닌 "참고 벤치마크"로 취급한다. 기어 도메인에서의 실측은 PoC에서 확보해야 한다.

### 식별된 리스크

| 리스크 | 심각도 | 완화 방법 |
|--------|--------|----------|
| py_gearworks 다단 기어 API 미검증 | **높음** | PoC 착수 전 반드시 실제 테스트 |
| build123d pre-1.0 API 변경 | 중간 | 주요 API 래핑, 버전 고정 |
| Pellet AGPL 라이선스 | 중간 | HermiT(BSD) 또는 RDFox 검토 |
| 6-Agent 복잡도 | **높음** | MVP에서 2도구로 시작, 점진적 확장 |
| VLM 기어 치형 식별 한계 | 중간 | 시각 검증은 보조 수단, 수치 검증이 주력 |
| 핵심 개발자 1인 의존 (build123d) | 중간 | CadQuery 동일 OCCT 커널, fallback 가능 |
| 로드맵 과소추정 | 중간 | 7-10주 → 최소 4-6개월으로 현실화 |

### 문서 간 상충 (통합 시 해결 필요)

1. **코드 생성 접근법**: Skill Card(LLM이 라이브러리 직접 호출) vs MCP 템플릿(서버가 내부 코드 생성) — **MVP에서는 Skill Card 방식 채택 권고** (단순, 빠른 검증 가능)
2. **온톨로지 네임스페이스**: `gear:module` vs `gear:hasModule`, URI 불일치 — **`gear:hasModule` + `http://gear-ontology.org/onto#`로 통일**
3. **SHACL 이폭/모듈 비율**: 3-15 vs 6-12 — **6-12를 warning, 3-15를 violation 경계로 2단계 적용**

---

## 가치 vs 하이프 (업데이트)

### 진짜 가치
1. **SHACL 기반 자동 검증**: LLM 출력의 수치 오류를 형식적으로 걸러냄 — **가장 높은 ROI**
2. **py_gearworks 기어 커버리지**: 5종 기어 + 자동 배치, 기존 CadQuery 대비 확실한 진전
3. **Skill Card 패턴**: LLM이 involute 수학을 직접 구현하려는 함정을 회피, 산업계 검증
4. **설계 지식 구조화**: SWRL 규칙으로 "왜 이 공정인가" 추적 가능

### 하이프
1. "환각률 1.7%" → 임상 QA 수치, 기어 도메인 미검증
2. "6-Agent가 자동으로 기어를 설계한다" → 풀 비전은 6개월+, MVP가 현실
3. "build123d가 LLM에 확실히 더 좋다" → 논리적이나 비교 벤치마크 없음
4. "VLM이 기어 치형 오류를 잡는다" → 마이크로미터 단위 오차는 렌더링으로 식별 불가능할 수 있음
5. "온톨로지가 모든 기어 지식을 표현한다" → herringbone, planetary는 라이브러리 미지원

---

## 실패 시나리오

이 시스템이 실패할 가능성이 높은 경우:

1. **비표준 기어 요청**: 온톨로지에 정의되지 않은 기어 유형 (예: 이중 헬리컬 + 전위)
2. **py_gearworks 미지원 유형**: herringbone, planetary gearset → 직접 build123d 구현 필요
3. **FEA 메시 품질 불량**: 기어 치근 필렛의 요소 크기가 부적절하면 응력 결과 부정확
4. **KG 자동 구축 한계**: 기어 핸드북의 다중 조건 표(AGMA 등급별 모듈별 허용 공차) 파싱 실패
5. **오프라인 제조 환경**: LLM API 의존 아키텍처, 에어갭 환경 배포 불가

---

## 핵심 참고 자료 (추가)

- [build123d GitHub](https://github.com/gumyr/build123d) — 핵심 CAD 엔진
- [py_gearworks GitHub](https://github.com/GarryBGoode/py_gearworks) — 기어 전문 라이브러리
- [bd_warehouse gear docs](https://bd-warehouse.readthedocs.io/en/latest/gear.html) — Spur gear 기본
- [MADA (arXiv:2603.11515)](https://arxiv.org/abs/2603.11515) — MCP + Multi-Agent 패턴
- [CADCodeVerify (ICLR 2025)](https://arxiv.org/abs/2410.05340) — VLM 기반 CAD 검증
- [Text-to-CadQuery (arXiv:2505.06507)](https://arxiv.org/abs/2505.06507) — LLM→CadQuery 69.3%
- [ARKNESS (arXiv:2506.13026)](https://arxiv.org/abs/2506.13026) — KG+RAG CNC 공정 계획
- [Henqo Skill Card](https://www.linkedin.com/company/henqo/) — LLM 기어 생성 산업 사례
- 이전 리서치 전체: `../2026-03-18-gear-system/`

---

## 다음 단계 (우선순위)

1. **[즉시]** py_gearworks 다단 기어 트레인 API 실제 테스트 → 아키텍처 전제 검증
2. **[1주]** build123d + py_gearworks 기어 생성 PoC (spur + helical 기어 쌍)
3. **[2주]** SHACL shapes 6개 + pyshacl 검증 파이프라인 구축
4. **[3주]** Claude tool_use: gear_create + ontology_validate MVP
5. **[4주]** 코드 실행 피드백 루프 (실패 → 에러 분석 → 재생성)
6. **[6주+]** 온톨로지 확장 (Neo4j, SWRL, RAG)

---

**핵심 메시지**: 이전 리서치의 "CadQuery + 개략적 아키텍처"에서 **"build123d/py_gearworks + SHACL 형식 검증 + Skill Card 패턴"**이라는 구체적 실행 가능한 조합으로 진전했다. 풀 비전(6-Agent)은 장기 목표로 두되, **MVP는 "기어 파라미터 자동 검증 + 코드 실행 피드백 루프"로 시작**하는 것이 핵심이다.
