# CadQuery + LLM + Ontology 기어 설계-제조 통합 시스템 실현 가능성 리서치

## 세션 메타
- 날짜: 2026-03-18
- 에이전트 구성: Researcher x4 (CadQuery, 온톨로지, LLM+CAD, 기어제조), Critic/Verifier/Synthesizer는 메인이 수행
- 검색 도구: WebSearch, Perplexity(일부), Tavily(권한 제한)

## 사용자 요청 요약
CadQuery + LLM + 온톨로지를 결합한 기어 설계-모델링-공정구성-공구선정-공정최적화 시스템의 실현 가능성 리서치. 실용적 방향 중시.

## 문제 정의
기어 제조 전체 프로세스(설계→모델링→공정계획→공구선정→최적화)를 CadQuery(CAD) + LLM(인터페이스/지식) + 온톨로지(구조화된 도메인 지식)로 통합하는 시스템이 실현 가능한가, 그리고 실제로 가치가 있는가.

## 핵심 결론

### 실현 가능성: "부분적으로 가능, 단 역할 분리가 핵심"

1. **CadQuery 기어 모델링**: 가능. cq_gears(7종 기어), py_gearworks 존재. STEP 출력 지원. 산업용 정밀 기어에는 보완 필요.
2. **LLM 역할**: 인터페이스(자연어→파라미터)로 한정해야 함. 수치 계산/코드 자유생성은 30%+ 오류율로 부적합.
3. **온톨로지**: 기어 전용 온톨로지는 세계적으로 부재. MASON(270개 개념) 기반 확장이 현실적. 경량 시작 권장.
4. **통합 시스템**: Phase별 점진적 구축이 타당. KISSsoft 대체가 아닌 보완 전략.

### 가장 큰 리스크
- LLM hallucination (제조에서는 치명적)
- 온톨로지 구축 비용 vs 효과 불확실
- 산업 현장 신뢰/채택 장벽

## 의사결정 로그

| 결정 | 근거 | 기각된 대안 |
|------|------|------------|
| CadQuery 선택 (FreeCAD 대신) | LLM 코드생성 연구의 주류 타겟, Python 네이티브 | OpenSCAD(STEP 불가), FreeCAD(API 복잡) |
| LLM은 수치계산 금지 | Text-to-CadQuery 69.3% 정확도, 제조 오류 허용불가 | LLM 자유코드생성(30%+ 오류) |
| MASON 기반 온톨로지 확장 | OWL-DL, 명확한 3축구조, 기존 공개 | MSDL(서비스 지향), STEP-NC(기어가공 미지원) |
| OWL + Neo4j 하이브리드 | 형식추론(OWL) + 런타임쿼리(Neo4j) | 순수 OWL(성능), 순수 PG(추론불가) |
| KISSsoft 보완 전략 | 수십년 검증된 상용SW 대체 비현실적 | KISSsoft 대체 시도 |

## Rejected Alternatives
- OpenSCAD 기반: STEP 출력 불가 → 제조 워크플로우 부적합
- LLM 자유 코드 생성: 69.3% 정확도, 기어에는 허용불가
- 풀스케일 온톨로지 선행 구축: 비용 대비 효과 불확실, ARKNESS의 제로샷 KG가 더 실용적
- AI 완전 자동 CAPP: 복잡 형상의 micro-CAPP는 연구 단계

## 주요 참고 자료
- Text-to-CadQuery (arXiv:2505.06507) - LLM CadQuery 코드 생성
- ARKNESS (arXiv:2506.13026) - KG+RAG CNC 공정 계획
- CAPP-GPT - GPT 기반 CAPP
- Sapel et al. (2024) - 65개 제조 온톨로지 서베이
- MASON OWL - 제조 상위 온톨로지
- OntoSTEP/STP2OWL (NIST GitHub) - STEP→OWL 변환
- cq_gears (GitHub) - CadQuery 기어 라이브러리
- KISSsoft - 기어 설계 상용 SW 벤치마크
