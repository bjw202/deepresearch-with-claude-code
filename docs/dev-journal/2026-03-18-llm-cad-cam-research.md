# 2026-03-18 LLM + CAD/CAM 통합 심층 리서치

## 세션 메타
- 요청: LLM과 CAD/CAM 시스템 통합 현황 및 가능성 심층 조사 (11개 항목)
- 방법: 멀티에이전트 병렬 리서치 (Perplexity sonar-pro 3건, Tavily advanced 6건)
- 산출물: `docs/research/llm-cad-cam-integration.md`

## 사용자 요청 요약
LLM + CAD/CAM 통합의 전방위 조사. Text-to-CAD, Zoo.dev, CadQuery/OpenSCAD, 벤치마크, CAM/G-code, 설계 의도 해석, 자연어 쿼리, RAG, TRL, 주요 연구 그룹 등 11개 항목.

## 문제 정의
LLM 기반 CAD/CAM 자동화는 제조업의 핵심 혁신 기회이지만, 기술 성숙도와 실용성에 대한 명확한 현황 파악이 필요한 상태.

## 핵심 가정
- 2025-2026 시점의 최신 정보를 기준으로 함
- 산업용 CAD/CAM(기계 설계 중심)에 초점, 건축/AEC는 제외
- B-Rep/파라메트릭 CAD를 대상으로 함 (메시 기반 3D 생성은 범위 외)

## 의사결정 로그
1. **검색 전략**: Perplexity sonar-pro 3건(종합 개요)과 Tavily advanced 6건(개별 심층)을 병렬 실행 → 비용 효율적이면서 폭넓은 커버리지
2. **보고서 구조**: 사용자 요청의 11개 항목을 그대로 섹션으로 매핑 → 명확한 대응
3. **TRL 평가**: 절대 등급보다 상대 비교에 초점 (근거 기반)

## 핵심 발견
- CAM(CloudNC)이 CAD보다 실무 배치에서 앞서 있음 (TRL 7-8 vs 6-7)
- GPT-4o/4.1의 CadQuery 코드 생성이 90%+ 실행 성공률 달성 (Text-to-CadQuery, 2025)
- CAD 벤더(Siemens, Autodesk, PTC)의 AI는 대부분 문서 지원/학습 도우미 수준
- RAG + 설계 표준이 가장 즉시 적용 가능한 가치

## 이슈 / 해결
- Tavily RAG 검색이 일반 RAG 설명 위주로 반환 → 엔지니어링 특화 RAG 사례는 Perplexity 결과에서 보완

## TODO
- [ ] Zoo.dev KCL 언어의 코드 생성 벤치마크가 나오면 추적
- [ ] CADmium(Mila) 후속 논문 추적
- [ ] CloudNC CAM Assist 2.0 성능 데이터 추적

## Rejected Alternatives
- Perplexity deep-research 사용: 30초+ 소요, 11개 항목 각각에 대해 실행하면 비용/시간 과다 → sonar-pro로 충분
- 개별 논문 원문 extract: 크레딧 과다 소비 → Tavily search + Perplexity 합성으로 대체
