# LLM + CAD/CAM 시스템 통합 현황 및 가능성

## 1. LLM + CAD 통합 현황

### 1.1 주요 프로젝트

#### Zoo.dev (구 KittyCAD) — Text-to-CAD

- B-Rep 표면을 직접 생성하는 유일한 상용 서비스
- "Zookeeper" 대화형 CAD 에이전트: 리서치/추론 + 엔진 레벨 도구
- 엔터프라이즈 fine-tuning 가능
- 가격: $0.50/분 (2025.9\~)
- **평가**: 단순 기계 부품에 유용, 기어 치형 같은 정밀 형상은 미검증. KCL 자체 언어 → CadQuery와 비호환

출처: [Zoo Text-to-CAD](https://zoo.dev/text-to-cad), [Zoo ML API](https://zoo.dev/machine-learning-api)

#### Text-to-CadQuery (2025, arXiv:2505.06507)

- CadQuery를 LLM 코드 생성 타겟으로 사용
- 170,000개 CadQuery 어노테이션 데이터셋
- **피드백 루프**: 코드 실행 실패 → 에러를 LLM에 피드백 → **성공률 53% → 85%**
- Top-1 exact match: 69.3% (기존 58.8%에서 향상)

출처: [arXiv](https://arxiv.org/html/2505.06507v1), [GitHub](https://github.com/Text-to-CadQuery/Text-to-CadQuery)

#### Text2CAD (NeurIPS 2024 Spotlight)

- 최초의 텍스트→파라메트릭 CAD 프레임워크
- **660K개 beginner\~expert 수준 텍스트 설명** 생성
- 340M BERT-Large 인코더 + 23M 디코더 (363M 파라미터)
- 데이터셋 Hugging Face 공개 (605GB)

출처: [Text2CAD Project](https://sadilkhan.github.io/text2cad-project/)

#### CADCodeVerify (ICLR 2025)

- VLM이 생성된 3D 객체를 **시각적으로 검사** → 교정 피드백
- CADPrompt: 최초의 CAD 코드 생성 벤치마크 (200개 프롬프트)
- Point Cloud 거리 7.30% 감소, 컴파일 성공률 5.5% 향상

출처: [arXiv](https://arxiv.org/abs/2410.05340)

#### CAD-MLLM (2024)

- **멀티모달 입력**(텍스트+이미지+point cloud) 조건부 CAD 생성 최초 통합
- 복잡한 기하학(스프링, 기어)에서 멀티모달 특히 효과적
- **전체 성공률 95.71%** (Text-Only 91.43% + Text+Image로 복구)

출처: [CAD-MLLM](https://cad-mllm.github.io/)

#### 기타 주목할 프로젝트

- **CAD-Coder** (NeurIPS 2025): CoT + Geometric Reward RL
- **FutureCAD** (2025): LLM + B-rep grounding transformer 하이브리드
- **CADialogue** (2025): 대화형 파라메트릭 CAD 모델링
- **CAD-LLM / CadVLM** (Autodesk Research): CAD 전용 LLM/VLM

### 1.2 접근법 분류

| 접근법 | 대표 | 장점 | 한계 |
| --- | --- | --- | --- |
| **코드 생성** (CadQuery/OpenSCAD) | Text-to-CadQuery | 검증/편집 가능, 파라메트릭 | 복잡 형상 한계, \~85% 성공률 |
| **시퀀스 생성** (CAD 명령) | Text2CAD, CAD-MLLM | End-to-end, 대규모 학습 | 편집 어려움 |
| **B-Rep 직접 생성** | Zoo.dev | 제조 호환 | 상용 의존, 커스터마이징 제한 |
| **하이브리드** (VLM 피드백) | CADCodeVerify, EvoCAD | 자기 교정 | 반복 비용/지연 |

---

## 2. LLM + 공정 계획 (CAPP)

### 2.1 CAPP-GPT

- 하이브리드 제조의 Macro-CAPP를 GPT 아키텍처로 자동화
- CSG 트리, B-Rep, 메타데이터 토큰화 → 인코더-디코더
- Feature Recognition, Micro-CAPP, Scheduling까지 확장 가능

출처: [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S221384632400066X)

### 2.2 LLM 기반 분산 제조 공정 계획

- **학습 데이터 5%만으로 공정 체인 99%+ 정확도**
- 다양한 부품에 대안적/실행 가능한 공정 체인 생성

출처: [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S073658452600013X)

### 2.3 ARKNESS (KG + LLM 융합)

- 제로샷 Knowledge Graph 구축 + RAG를 CNC 공정 계획에 결합
- 이기종 문서(핸드북, G-code, 벤더 데이터시트) 자동 그래프화
- **3B Llama-3 + ARKNESS가 GPT-4o급 정확도**: MC +25pp, F1 +22.4pp
- **수치 할루시네이션 22pp 감소**, 온프레미스 실시간 추론 가능

출처: [arXiv](https://arxiv.org/html/2506.13026v1)

### 2.4 기존 CAPP vs LLM CAPP 비교

| 항목 | 기존 CAPP | LLM 기반 CAPP |
| --- | --- | --- |
| 지식 표현 | 정적 테이블, IF-THEN 규칙 | 임베딩 + 생성 |
| 새 형상 대응 | 규칙 추가 필요 | 제로샷/퓨샷 일반화 |
| 설명 가능성 | 높음 (규칙 추적) | KG 결합 시 개선 |
| 유지보수 | 수동 | 모델 재학습/RAG 업데이트 |

---

## 3. LLM + 공구 선정/최적화

### 3.1 LLM 직접 활용의 문제점

- 기본 LLM은 절삭 조건에서 **광범위한 범위값만 제시** (예: 60-120 SFM)
- 최적 파라미터 특정 불가

### 3.2 해결: KG + LLM 하이브리드

- ARKNESS 패턴: 도메인 특화 KG로 LLM 출력을 **검증된 제조 표준에 맞게 제약**
- 공구 사이징, 이송-속도 쌍, 다축 라우팅 등 정밀 의사결정 지원

### 3.3 Rule-Based vs LLM 비교

| 항목 | Rule-Based | LLM 하이브리드 |
| --- | --- | --- |
| 지식 획득 | 수동 규칙 (병목) | 문서 자동 파싱/KG |
| 커버리지 | 구축 범위 내 | 범용 + 도메인 특화 |
| 정밀도 | 높음 | KG 있으면 유사 |
| 유지보수 | 높음 (수동) | 중간 (자동화 가능) |

### 3.4 새로운 패러다임: LLM이 전문가 시스템을 생성

- LLM으로 Prolog 기반 전문가 시스템 자동 생성
- 개념 그래프 → Prolog facts/relations → 검증
- **에러 없는 실행 가능 전문가 시스템 자동 생성** 확인

출처: [arXiv](https://arxiv.org/html/2507.13550v1)

---

## 4. 실현 가능한 아키텍처

### 4.1 LLM as Orchestrator 패턴

```
사용자 (자연어/이미지/도면)
         |
    [LLM Orchestrator Agent]
    /        |         \
[CAD 생성]  [공정계획]  [최적화]
  Agent      Agent      Agent
   |          |          |
[CadQuery] [KG+CAPP]  [ML모델]
[Zoo API]  [ARKNESS]   [FEA]
```

**핵심**: LLM은 직접 수치를 생성하지 않고, 도구 호출을 통해 검증된 시스템에 위임.

### 4.2 제안 기술 스택

| 계층 | 기술 | 역할 |
| --- | --- | --- |
| LLM Core | Claude Opus/Sonnet, GPT-4o | Orchestration, 코드 생성 |
| Tool Calling | MCP, Function Calling | 도구 연동 |
| CAD Engine | CadQuery, Zoo.dev API | 파라메트릭 CAD 실행 |
| Knowledge Base | Neo4j + RAG | 제조 핸드북, 벤더 데이터 |
| 공정 계획 | CAPP-GPT, ARKNESS 패턴 | 공정 체인 생성 |
| 최적화 | scikit-learn, DEAP, scipy | 가공 파라미터 |
| 검증 | CadQuery 실행 + VLM 시각 검사 | 자동 검증 |
| UI | 대화형 + 3D 뷰어 | 사용자 인터페이스 |

### 4.3 Agentic Workflow 5대 패턴

1. 적절한 실행 모델 (순차 vs 병렬)
2. 계층적 상태 관리
3. 명시적 실패 복구 경로
4. Human-in-the-loop 체크포인트
5. 구조적 관찰 가능성

---

## 5. 한계와 리스크

### 5.1 Hallucination - 제조에서 치명적

- 수치 할루시네이션: 절삭 속도, 공차, 물성을 "그럴듯하게" 생성하지만 틀린 값
- 산업 보고서: 환각 관련 **연간 $250M+ 재무 손실** (전 산업)

### 5.2 정밀도 보장 다층 전략

| 전략 | 효과 |
| --- | --- |
| RAG | 환각 70-80% 감소 |
| \+ KG grounding | 수치 환각 22pp 추가 감소 |
| \+ 실행 기반 검증 | 컴파일/실행 오류 즉시 포착 |
| \+ VLM 시각 검사 | 형상 오류 7.3% 추가 개선 |
| \+ Human-in-the-loop | 최종 안전장치 |

**전체 조합 시**: 환각률 63% → 1.7% 가능 (임상 QA 기준)

### 5.3 인증/검증

- 제조 AI 전용 인증 프레임워크 **부재**
- 기존 프레임워크(ISO 9001 등) 내에서 AI를 "도구"로 위치시키는 것이 현실적
- 추적 가능성, 재현 가능성, 검증 파이프라인, 책임 소재 구분 필수

### 5.4 리스크 매트릭스

| 리스크 | 심각도 | 발생 가능성 | 완화 |
| --- | --- | --- | --- |
| 수치 할루시네이션 | 치명적 | 높음 | KG+RAG, 실행 검증 |
| 공차 오류 | 치명적 | 중간 | 표준 DB, HITL |
| CAD 코드 실행 실패 | 중간 | 높음 (15-47%) | 피드백 루프 |
| 비재현적 출력 | 중간 | 중간 | Temperature 0, 시드 고정 |

---

## 출처 목록

- [Zoo.dev Text-to-CAD](https://zoo.dev/text-to-cad)
- [Text-to-CadQuery (arXiv 2505.06507)](https://arxiv.org/abs/2505.06507)
- [Text2CAD (NeurIPS 2024)](https://sadilkhan.github.io/text2cad-project/)
- [CADCodeVerify (ICLR 2025)](https://arxiv.org/abs/2410.05340)
- [CAD-MLLM](https://cad-mllm.github.io/)
- [CAD-Coder (NeurIPS 2025)](https://neurips.cc/virtual/2025/poster/118098)
- [FutureCAD (arXiv 2603.11831)](https://arxiv.org/html/2603.11831)
- [CAPP-GPT](https://www.sciencedirect.com/science/article/pii/S221384632400066X)
- [ARKNESS (arXiv 2506.13026)](https://arxiv.org/html/2506.13026v1)
- [LLM 기반 전문가 시스템 생성](https://arxiv.org/html/2507.13550v1)
- [LLM 환각 서베이 (arXiv 2510.06265)](https://arxiv.org/abs/2510.06265)
- [CAD-LLM (Autodesk)](https://www.research.autodesk.com/publications/ai-lab-cad-llm/)
- [LLMs for CAD (ACM)](https://dl.acm.org/doi/pdf/10.1145/3787499)