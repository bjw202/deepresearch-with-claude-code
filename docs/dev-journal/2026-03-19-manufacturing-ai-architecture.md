# 제조 인공지능 통합 아키텍처 리서치 — 세션 저널

## 세션 메타

| 항목 | 내용 |
|------|------|
| 날짜 | 2026-03-19 |
| 프로젝트 | 제조 인공지능 통합 아키텍처 리서치 |
| 선행 리서치 | 2026-03-18 gear-system, 2026-03-18 build123d-gear-system |

---

## 사용자 요청 요약

기존 build123d/기어 리서치를 발전시켜, 모델링 도구·AI·온톨로지를 활용한 "한 단계 높은 제조 인공지능 시스템" 아키텍처를 구상. 핵심 비전: "인간의 뇌가 여러 레이어로 나뉘어져 있지만 합쳐졌을 때 종합 지능이 되듯이, 이종 시스템이 합쳐져서 시너지를 내는 것." build123d는 하나의 수단일 뿐, 꼭 사용해야만 하는 것은 아님. 뜬구름 금지.

---

## 문제 정의

개별적으로 존재하는 AI 기술들(설계 AI, 공정 계획 AI, 현장 품질/예측 AI)을 어떻게 결합해야 "단순 합산 이상의 시너지"를 내는 통합 제조 AI 시스템이 되는가? 실행 가능한 아키텍처로 구상.

---

## 핵심 가정

- 개별 AI 기술은 이미 상당히 성숙해 있으나, 통합이 부족
- 온톨로지/지식 그래프가 이종 시스템 간 "공통 언어" 역할을 할 수 있음
- Closed-loop feedback이 시너지의 핵심 메커니즘
- build123d/CadQuery 등 기존 리서치 자산은 설계 지능 레이어의 한 구성요소

---

## 의사결정 로그

| # | 결정 | 근거 |
|---|------|------|
| 1 | 4개 Researcher 관점 설정: 설계 지능, 공정 지능, 실행 지능, 통합 아키텍처 | 제조 AI를 계층적으로 분리하되, 통합 관점을 독립 Researcher로 확보 |
| 2 | build123d를 별도 Researcher로 두지 않고 설계 지능의 한 항목으로 포함 | 도구 종속 방지. 사용자 요청에서도 "하나의 수단"임을 명시 |
| 3 | 통합 아키텍처를 별도 Researcher로 분리 | 개별 레이어 조사와 통합 설계를 분리해야 각각의 깊이를 확보 가능 |

---

## 에이전트 구성

| 역할 | ID | 담당 |
|------|----|------|
| Researcher 1 | r1-design | 설계 지능 (Design Intelligence) |
| Researcher 2 | r2-process | 공정 지능 (Process Intelligence) |
| Researcher 3 | r3-execution | 실행 지능 (Execution Intelligence) |
| Researcher 4 | r4-architecture | 통합 아키텍처 (Integration Architecture) |
| Critic | — | Researcher 완료 후 발사 (5개 체크리스트) |
| Journal | — | 현재 에이전트 |
| Synthesizer | — | 메인 에이전트 직접 수행 |

---

## Rejected Alternatives

| 대안 | 기각 이유 |
|------|-----------|
| build123d 전용 Researcher | 도구 종속적. 설계 지능 내 한 항목으로 포함하는 것이 적절 |
| "Industry 4.0 개론" Researcher | 너무 넓고 뜬구름. 구체적 레이어로 분할하는 것이 실행성 확보에 유리 |
| 5번째 "비즈니스/ROI" Researcher | 별도 분리 시 실익 부족. 각 Researcher에 ROI 관점 포함으로 대체 |

---

## 이슈 / 해결

*(리서치 진행 중 발생하는 이슈를 여기에 기록)*

---

## TODO

- [ ] Researcher 4명 결과 확인
- [ ] Critic 에이전트 발사 및 결과 확인
- [ ] 최종 Synthesis 수행
- [ ] 기존 build123d 리서치 자산과의 연결점 명시
