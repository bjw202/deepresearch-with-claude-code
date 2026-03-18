# 제조 온톨로지 심층 리서치 저널

## 세션 메타
- **일시**: 2026-03-18
- **유형**: 심층 리서치
- **결과 파일**: `docs/research/manufacturing-ontology.md`

## 사용자 요청 요약
제조 분야 온톨로지의 현황과 기어 설계/가공에의 적용 가능성을 10개 항목에 걸쳐 심층 조사

## 문제 정의
기어 설계-가공 파이프라인에 온톨로지를 적용하려면 (1) 기존 표준의 적합성 파악, (2) 기어 특화 지식의 표현 가능성, (3) 실제 산업 적용 사례와 한계, (4) LLM 결합 방법론의 성숙도를 종합적으로 파악해야 한다.

## 핵심 가정
- 기어 전용 OWL 온톨로지가 공개적으로 존재하지 않을 가능성이 높다 → **확인됨**
- MASON/IOF Core 확장이 가장 현실적 경로 → **타당**
- LLM이 온톨로지 초안 생성에 실용적 수준 → **2025 연구로 확인**

## 의사결정 로그
1. 검색 전략: Perplexity sonar-pro를 주 검색 도구로 사용 (가성비 최적)
2. 10개 주제를 병렬 검색으로 수행하여 시간 효율화
3. 기존 연구(02-manufacturing-ontology.md)를 기반으로 하되, 부족한 영역(ROMAIN, CAPP, DT, 산업사례, 한계점, LLM)을 집중 보강
4. ROMAIN의 정식 명칭은 "Reference Ontology for Industrial MAINtenance"로 확인 (사용자 제시 약어 확장과 상이)

## 주요 발견
1. **기어 전용 온톨로지 부재**: 감속기 어셈블리 OWL 표현 연구만 존재. 치형 파라미터 전용 온톨로지는 새로 구축 필요
2. **IOF Core가 유력한 확장 기반**: BFO 기반, NIST 주도, Version 1 beta 공개
3. **Siemens가 가장 진전된 산업 적용**: metaphactory 기반 KG로 lot-size-one 생산 구현
4. **LLM+온톨로지 결합 급성장**: 2025년 Ontogenia 방법론으로 요구사항→OWL 자동 생성 가능
5. **환각 감소 효과**: 온톨로지 grounding으로 ChatGPT-4 환각률 63%→1.7% 감소 사례

## 이슈 / 해결
- 이슈: Perplexity가 ROMAIN, MASON 등 개별 온톨로지에 대해 깊이 있는 정보를 반환하지 않음
- 해결: 각 온톨로지별로 개별 검색 수행 + 기존 조사 결과 병합

## TODO
- [ ] 기어 전용 온톨로지 OWL 프로토타입 설계
- [ ] MASON/IOF Core 확장 경로 vs 신규 구축 경로 비교 분석
- [ ] Owlready2로 기어 온톨로지 PoC 구현
- [ ] 기어 가공 CAPP 규칙의 SWRL 표현 프로토타입

## Rejected Alternatives
- **STEP EXPRESS 직접 사용**: OWL 대비 시맨틱 웹 도구 생태계가 빈약. 추론 능력 제한적
- **Property Graph(Neo4j) 단독 사용**: 표준화·상호운용성 부족. OWL 하이브리드 권장
- **DTDL 채택**: Azure 종속적, 형식 논리 추론 부재. 연구 목적에는 OWL이 적합
