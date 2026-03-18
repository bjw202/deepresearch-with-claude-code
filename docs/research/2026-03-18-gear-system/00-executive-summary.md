# CadQuery + LLM + 온톨로지 기어 설계-제조 통합 시스템 — 종합 리서치 보고서

**날짜**: 2026-03-18
**리서치 구성**: 서브 에이전트 4개 (CadQuery, 온톨로지, LLM+CAD/CAM, 기어 제조 실무) + 메인 통합

---

## 상세 보고서 목차

| # | 파일 | 내용 |
|---|------|------|
| 01 | [01-cadquery-gear-modeling.md](./01-cadquery-gear-modeling.md) | CadQuery 기어 모델링 능력, 라이브러리, 한계, 대안 비교 |
| 02 | [02-manufacturing-ontology.md](./02-manufacturing-ontology.md) | 제조 온톨로지 (MASON, MSDL, STEP-NC), KG 기술, LLM+KG 결합 연구 |
| 03 | [03-llm-cad-cam-integration.md](./03-llm-cad-cam-integration.md) | LLM+CAD 프로젝트, CAPP, 공구선정, 아키텍처, 리스크 |
| 04 | [04-gear-manufacturing-process-chain.md](./04-gear-manufacturing-process-chain.md) | 기어 제조 프로세스 체인, 공구 선정, 최적화, 디지털화 현황 |

---

## 핵심 결론

### 실현 가능성: "부분적으로 가능, 역할 분리가 핵심"

| 구성요소 | 역할 | 실현 가능성 |
|----------|------|-----------|
| **CadQuery** | 파라메트릭 기어 3D 모델 생성 + STEP 출력 | **높음** — cq_gears 7종, py_gearworks 존재 |
| **LLM** | 자연어 인터페이스 + 지식 검색 (수치 계산 금지) | **높음** — 단, 역할 한정 필수 |
| **온톨로지** | 설계-공정-공구 간 관계 구조화 | **중간** — 기어 전용 온톨로지 세계적 부재, 신규 구축 |
| **통합 시스템** | 설계→공정→공구→최적화 파이프라인 | **중간** — Phase별 점진적 구축 |

### 아키텍처 핵심 원칙

```
사용자 자연어 → [LLM: 의도 해석] → [온톨로지: 검증] → [Python: 수치 계산] → [CadQuery: 모델 생성] → [검증]
```

**LLM은 절대로 수치 계산을 하지 않는다** — 이것이 아키텍처의 철칙.

---

## 핵심 의사결정

| 결정 | 근거 | 기각된 대안 |
|------|------|------------|
| CadQuery 선택 | LLM 코드생성 주류 타겟, Python 네이티브 | OpenSCAD(STEP 불가), FreeCAD(API 복잡) |
| LLM 수치계산 금지 | Text-to-CadQuery 69.3% 정확도 | LLM 자유코드생성(30%+ 오류) |
| MASON 기반 온톨로지 | OWL-DL, 3축 구조, 공개 | MSDL(서비스 지향), STEP-NC(기어 미지원) |
| OWL + Neo4j 하이브리드 | 형식추론 + 런타임쿼리 | 순수 OWL(성능), 순수 PG(추론불가) |
| KISSsoft 보완 전략 | 수십년 검증 대체 비현실적 | KISSsoft 대체 시도 |

---

## 기술 스택

| 영역 | 도구 | 비고 |
|------|------|------|
| CAD 커널 | CadQuery + Build123d | 병행 가능 |
| 기어 라이브러리 | cq_gears / py_gearworks | 부족한 부분 자체 구현 |
| LLM | Claude API (tool_use) | 코드생성 + 도구 호출 |
| 온톨로지 | Owlready2 + RDFLib → Neo4j | MVP: RDFLib, 확장: Neo4j |
| RAG | LlamaIndex | 공구 카탈로그, 규격 문서 |
| 검증 | OpenCASCADE + VLM | 형상 검증 + 시각 검사 |
| 출력 | STEP AP242 | 시맨틱 PMI 지원 |

---

## 로드맵

### Phase 1: 파라메트릭 기어 생성기 + 자연어 (1-2개월, 1인)
> "module 2, 20 teeth 스퍼 기어 만들어줘" → STEP 파일

- CadQuery 기반 기어 생성 함수
- Claude tool_use로 자연어 → 파라미터 추출
- AGMA/ISO 파라미터 검증
- STEP/STL 내보내기

### Phase 2: 온톨로지 + 설계 지식 기반 (2-3개월 추가)
> "이 기어에 적합한 가공 공정은?" → 온톨로지 추론 + RAG

- MASON 기반 기어 온톨로지 (100-200 클래스)
- 설계 이력 추적
- RAG 기반 설계 가이드

### Phase 3: 제조 연결 + 피드백 (3-6개월 추가, 팀)
> 설계 파라미터 → 공정 순서 → 공구 선정 → 절삭 조건 추천

- 공구 카탈로그 연동 (ISO 13399/GTC)
- DFM 검증
- 가공 데이터 피드백 루프

---

## 가치 vs 하이프

### 진짜 가치
1. **비전문가 접근성**: 기어 설계 진입장벽 낮춤
2. **설계 지식 축적**: "왜 이 결정을 했는가" 추적
3. **공구/공정 RAG**: 카탈로그 검색, 트러블슈팅 — **ROI 최고**
4. **설계-제조 연결**: 파라미터 자동 매핑

### 하이프
1. "LLM이 기어를 설계한다" → 인터페이스일 뿐
2. "AI가 KISSsoft를 대체한다" → 수십년 검증 대체 불가
3. "Text-to-CAD로 정밀 기어" → 69.3% 정확도, 단순 형상에만 유효
4. "온톨로지가 혁신을 만든다" → 지식 구조화 도구일 뿐

### 경쟁 전략
**KISSsoft를 대체하지 말고 보완하라:**
- 자연어 인터페이스, 설계 지식 그래프, 빠른 탐색
- 오픈소스 + LLM API로 접근성 확보
- 교육/중소규모 제조 시장

---

## 할루시네이션 방어 전략

| 전략 | 효과 |
|------|------|
| RAG | 환각 70-80% 감소 |
| + KG grounding | 수치 환각 22pp 추가 감소 |
| + 실행 기반 검증 | 코드 오류 즉시 포착 |
| + VLM 시각 검사 | 형상 오류 7.3% 개선 |
| + Human-in-the-loop | 최종 안전장치 |

**전체 조합**: 환각률 63% → 1.7% 가능

---

## 핵심 참고 자료

- [cq_gears](https://github.com/meadiode/cq_gears) — CadQuery 기어 라이브러리
- [Text-to-CadQuery (arXiv:2505.06507)](https://arxiv.org/abs/2505.06507) — LLM→CadQuery
- [ARKNESS (arXiv:2506.13026)](https://arxiv.org/abs/2506.13026) — KG+RAG CNC 공정 계획
- [CAPP-GPT](https://www.sciencedirect.com/science/article/pii/S221384632400066X) — GPT 기반 CAPP
- [MASON OWL](https://sourceforge.net/projects/mason-onto/) — 제조 상위 온톨로지
- [Sapel et al. (2024)](https://link.springer.com/article/10.1007/s10845-024-02425-z) — 65개 제조 온톨로지 서베이
- [OntoSTEP/STP2OWL](https://github.com/usnistgov/STP2OWL) — STEP→OWL 변환
- [CAD-MLLM](https://cad-mllm.github.io/) — 멀티모달 CAD 생성 95.71%
- [KISSsoft](https://www.gleason.com/design) — 기어 설계 상용 벤치마크

---

**핵심 메시지**: 이 시스템은 "AI가 기어를 설계하는 시스템"이 아니라 **"엔지니어가 기어를 더 빠르고 체계적으로 설계하도록 돕는 시스템"**이다.
