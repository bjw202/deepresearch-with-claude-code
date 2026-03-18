# 세션 저널: 스윙트레이딩 ML 패턴 분류 리서치

## 세션 메타
- **날짜**: 2026-03-18
- **프로젝트**: 스윙트레이딩 ML 패턴 분류 리서치
- **요청자**: 사용자

## 사용자 요청 요약
ChatGPT가 제안한 주식 차트 ML 학습 4단 구조(표현학습 → 확률예측 → 랭킹 → 실행최적화)를 머신러닝 관점과 주식시장 관점에서 평가하고, 실전 학습 데이터 구성 가이드를 요청함.

## 문제 정의
- 사용자는 CWH/VCP/HTF 돌파 패턴 트레이더
- 미스(실패 진입)가 잦아 ML로 필터링/개선하고 싶음
- ChatGPT 답변의 타당성 검증 + 실전 가이드 필요

## 핵심 가정
- 차트 패턴에 통계적으로 유의미한 edge가 존재한다고 가정
- 그 edge를 ML이 포착할 수 있다고 가정
- 이 두 가정 모두 검증이 필요

## 의사결정 로그
1. 서브 에이전트 3개 병렬 배치:
   - ml-researcher: ML 관점 평가
   - market-researcher: 시장 관점 평가
   - data-researcher: 학습 데이터 실전 가이드
2. 멀티에이전트 분업 이유: 도메인이 명확히 분리됨 (ML이론 / 시장실증 / 데이터엔지니어링)
3. 결과는 메인이 통합하여 최종 보고

## 산출물
- `docs/research/ml-perspective-evaluation.md`
- `docs/research/market-perspective-evaluation.md`
- `docs/research/training-data-practical-guide.md`
- `docs/dev-journal/2026-03-18-stock-ml-research.md` (이 파일)

## TODO
- [ ] 서브 에이전트 결과 통합
- [ ] 상충점 정리
- [ ] 최종 권고안 도출

## Rejected Alternatives
- end-to-end RL 접근: ChatGPT도 비추천했고, 과적합 리스크가 높아 배제
- 단일 에이전트로 전체 리서치: 도메인 분리가 명확하여 병렬 처리가 효율적
