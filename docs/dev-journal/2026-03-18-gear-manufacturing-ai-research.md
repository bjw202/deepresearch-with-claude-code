# 기어 제조 AI 시스템 리서치 저널

## 세션 메타

- 날짜: 2026-03-18
- 주제: CadQuery + LLM + 온톨로지 기반 기어 설계/제조 통합 시스템 가능성 조사
- 에이전트 구성: Researcher x4 (CadQuery, 온톨로지+LLM, 공구/최적화, 아키텍처), Journal x1
- 소요 시간: 리서치 에이전트 평균 \~4분

## 사용자 요청 요약

CadQuery를 사용한 기어 모델링 자동화와 LLM + 온톨로지를 결합하여 설계, 모델링, 공정구성, 공구선정, 공정최적화 제안까지 가능한 시스템의 실현 가능성 리서치. 실제적으로 도움이 되는 방향 중시.

## 문제 정의

- 기어 제조 프로세스(설계→모델링→공정계획→공구선정→최적화)를 AI로 얼마나 자동화할 수 있는가
- CadQuery가 기어 모델링 도구로 적합한가
- LLM + 온톨로지 조합이 제조 지식 시스템으로 실용적인가
- 실현 가능한 MVP는 어떤 형태인가

## 핵심 가정

- 대상: 중소규모 기어 제조 (소품종 다품종 가정)
- 사용자: 기어 설계/가공 경험이 있는 엔지니어
- 목표: 완전 자동화가 아닌, 엔지니어의 의사결정 지원

## 의사결정 로그

### D1: CadQuery를 CAD 커널로 선택

- **결정**: FreeCAD 대신 CadQuery 선택
- **근거**: LLM 연동이 핵심 가치이므로 Python 네이티브 API가 필수. FreeCAD FCGear가 기어 라이브러리는 풍부하나, LLM 코드 생성 친화성에서 CadQuery가 우위. 부족한 기어 로직은 자체 구현.
- **트레이드오프**: 웜기어/사이클로이드 미지원, AGMA/ISO 직접 구현 필요

### D2: LLM 역할을 인터페이스로 한정

- **결정**: LLM은 수치 계산을 하지 않는다. 자연어 파싱 + 지식 검색만 담당.
- **근거**: Text-to-CadQuery 30%+ 오류율, LLM의 수치/공간 추론 한계. 제조에서 수치 오류는 불량품 직결.
- **방식**: 템플릿 기반 코드 생성 + 결정론적 Python 계산 모듈

### D3: 온톨로지는 경량 시작

- **결정**: 풀스케일 온톨로지가 아닌 경량 KG(Neo4j/RDFLib)로 시작
- **근거**: 온톨로지 구축 비용 대비 효과 불확실. ARKNESS가 제로샷 KG 구축으로 성과를 보여 풀스케일 사전 구축 불필요.

### D4: KISSsoft 대체가 아닌 보완 전략

- **결정**: 상용 기어 설계 SW(KISSsoft) 대체 시도하지 않음
- **근거**: 수십년 축적된 기어 설계 전문 SW를 AI로 대체하는 것은 비현실적. 보완(접근성, 지식관리, 공정연결)이 올바른 포지셔닝.

## 이슈 / 해결

| 이슈 | 상태 | 해결/대응 |
| --- | --- | --- |
| cq_gears 마지막 릴리스 2021년, WIP 상태 | 확인됨 | 기본 기하학만 활용하고 AGMA/ISO 계산은 자체 모듈로 구현 |
| LLM 코드 생성 오류율 30%+ | 확인됨 | 자유 생성 금지, 템플릿 + 파라미터 주입 방식으로 전환 |
| 기어 전용 온톨로지 부재 | 확인됨 | 범용 가공 온톨로지(MASON, InPro) 내에서 기어를 부품 유형으로 포함, 기어 가공 지식은 KG 인스턴스로 구축 |
| ISO 13399에서 기어 전용 공구(호브 등) 커버리지 불확실 | 미해결 | 추가 조사 필요 |

## 핵심 조사 결과

### CadQuery 기어 모델링

- cq_gears: 7종 기어 지원 (spur, helical, herringbone, bevel, ring, planetary, rack)
- STEP 무손실 출력 가능 (OpenSCAD는 불가)
- 산업용 정밀 기어에는 부족 (AGMA/ISO 미통합, 공차 미지원)
- 프로토타이핑/LLM 연동에는 최적

### LLM + 제조 지식 시스템

- ARKNESS(2025): 3B Llama-3 + KG-RAG로 GPT-4o급 CNC 공정 계획 정확도
- ChatCNC: 멀티에이전트 CNC 모니터링 93.3% 정확도
- CAPP-GPT: B-rep → 가공 시퀀스 자기회귀 생성 (macro-CAPP 수준)

### 기어 가공 공정 AI

- 공구 카탈로그 RAG, 트러블슈팅 KB, 견적 자동화가 ROI 최고
- 공구 수명 예측 ML은 센서 인프라 필요로 Phase 3 이후
- 상용 시스템(Siemens NX CAM Copilot, CloudNC CAM Assist) 급성장 중

## TODO

- [x] 리서치 결과 통합

- [x] 최종 권고안 도출

- [ ] Phase 1 MVP 상세 설계 (진행 결정 시)

- [ ] AGMA 2001/ISO 6336 계산 모듈 스펙 정의

- [ ] ISO 13399 기어 공구 데이터 커버리지 확인

## Rejected Alternatives

### OpenSCAD 기반 시스템

- 기어 라이브러리는 풍부하나 STEP 출력 불가 → 제조 워크플로우 부적합

### LLM 자유 코드 생성 방식

- 69.3% 정확도로는 제조 용도 불가. 템플릿 기반으로 전환.

### 풀스케일 온톨로지 선행 구축

- 구축 비용 대비 효과 불확실. ARKNESS의 제로샷 KG 구축이 더 실용적.

### AI 완전 자동 CAPP

- 복잡 형상의 micro-CAPP는 연구 단계. "AI 보조" 수준이 현실적.

## 주요 참고 자료

- [cq_gears](https://github.com/meadiode/cq_gears) - CadQuery 기어 라이브러리
- [Text-to-CadQuery (arXiv:2505.06507)](https://arxiv.org/abs/2505.06507) - LLM CadQuery 코드 생성
- [ARKNESS (arXiv:2506.13026)](https://arxiv.org/abs/2506.13026) - KG+RAG CNC 공정 계획
- [CAPP-GPT](https://www.sciencedirect.com/science/article/pii/S221384632400066X) - GPT 기반 CAPP
- [ChatCNC](https://www.sciencedirect.com/science/article/abs/pii/S0278612525000263) - LLM CNC 모니터링
- [OntoSTEP/STP2OWL](https://github.com/usnistgov/STP2OWL) - STEP→OWL 변환
- [Zoo.dev Text-to-CAD](https://zoo.dev) - 상용 AI CAD 생성
- [KISSsoft](https://www.kisssoft.com) - 기어 설계 상용 SW (벤치마크)