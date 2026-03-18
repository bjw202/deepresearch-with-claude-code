# 2026-03-18 CadQuery 기어 모델링 자동화 심층 조사

## 세션 메타

- **날짜**: 2026-03-18
- **요청자**: 사용자
- **유형**: 심층 리서치
- **결과물**: `docs/research/cadquery-gear-modeling.md`

## 사용자 요청 요약

CadQuery를 사용한 기어 모델링 자동화에 대해 10개 항목의 심층 조사 수행. 기능/한계, 실제 사례, 기어 유형 지원, 인볼루트 치형, 표준 포맷 export, FreeCAD/OCCT 관계, 경쟁 대안 비교, 대량 변형, Assembly, CAM 워크플로우.

## 문제 정의

기어 모델링 자동화를 위한 도구 선정 및 역량 평가. CadQuery가 산업용 기어 CAD 데이터 생성에 적합한지, 어떤 한계가 있는지, 대안은 무엇인지 파악.

## 핵심 가정

- 산업용 기어 CAD 데이터(STEP 포맷) 생성이 핵심 요구사항
- 파라메트릭 자동화가 수동 CAD 모델링보다 중요
- 정밀한 인볼루트 치형이 필요 (단순 근사 아님)

## 의사결정 로그

1. **조사 범위**: 기존 `01-cadquery-gear-modeling.md` 보고서가 존재했으나, 사용자가 별도 경로에 새 보고서를 요청. 기존 데이터를 기반으로 보강 조사 수행.
2. **검색 전략**: Tavily advanced search + Perplexity sonar-pro 병행. 비용 대비 정보 밀도가 높았음.
3. **서브 에이전트 구성**: 단일 에이전트로 수행. 조사 항목이 연관성이 높아 분업의 실익이 낮다고 판단.

## 핵심 발견

- CadQuery 2.6.0 (2025.10), ~4.6K stars, OCCT 커널 직접 사용
- cq_gears v0.51이 핵심 기어 라이브러리이나 "WIP, unstable" 상태
- Worm gear 미지원이 가장 큰 갭
- LLM 기반 CAD 생성에서 CadQuery가 사실상 표준 타겟 언어
- build123d가 CadQuery의 진화형으로 부상 중

## 이슈 / 해결

- cq_gears의 CadQuery dev 버전 종속이 안정성 리스크
- Tooth meshing constraint 미지원으로 기어박스 어셈블리에 한계

## TODO

- [ ] cq_gears와 CadQuery 2.6.0 호환성 실제 테스트
- [ ] Worm gear 직접 구현 가능성 프로토타이핑
- [ ] build123d 기어 생태계(bd_warehouse) 상세 조사
- [ ] FreeCAD Path Python API headless 동작 검증

## Rejected Alternatives

- **OpenSCAD**: STEP export 불가로 산업용 부적합. 기어 라이브러리(chrisspen/gears)는 가장 완전하지만 포맷 한계가 치명적.
- **FreeCAD 단독 사용**: GUI 중심 설계로 자동화 파이프라인에 부적합. 단, CAM(Path) 기능은 보완적으로 활용 가능.
