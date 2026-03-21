# Qwen3-235B-A22B 성능 분석 — 멀티에이전트 오케스트레이션 관점

> Researcher 1 산출물 | 2026-03-20
> 모델명 정정: 초기 요청의 "DeepSeek V3 (235B-A22B)"는 Qwen3-235B-A22B (Alibaba Cloud Qwen3 시리즈)로 확인됨.

## 요약

Qwen3-235B-A22B는 Alibaba Qwen 팀이 개발한 235B 전체 파라미터 / 22B 활성 파라미터 MoE 모델이다 (2025년 4월 29일 출시). Thinking/Non-Thinking 하이브리드 모드를 지원하며, 코딩(LiveCodeBench Pass@1 65.9%), 수학(MATH-500 90.2%), 에이전트 도구 호출 능력에서 오픈소스 모델 중 최상위권 성능을 보인다. API 비용은 Claude Sonnet 4 대비 **81% 이상 저렴**하면서도 일부 벤치마크에서 동등 이상의 성능을 달성한다.

**핵심 판단**: Qwen3-235B-A22B는 function calling, structured output, MCP 통합을 공식 지원하며 에이전트 시스템 구축에 적합한 기반을 제공한다. 비용 대비 성능이 탁월하여 멀티에이전트 시스템의 Researcher/Executor 역할에 강력히 추천되며, Thinking 모드 활용 시 Critic/Synthesizer 역할도 수행 가능하다. 다만 SWE-bench Pro에서 21.4%로 상용 모델(Claude Opus 4.5: 45.9%) 대비 큰 격차가 있어, 복잡한 코드 수정 에이전트로는 한계가 있다.

---

## 1. 모델 사양

| 항목 | 값 |
|------|-----|
| 전체 파라미터 | 235B |
| 활성 파라미터 | 22B (토큰당) |
| 전문가 수 | 128개 (토큰당 8개 활성) |
| 레이어 수 | 94 |
| 어텐션 구조 | GQA (Q: 64헤드, KV: 4헤드) |
| Hidden Dimension | 10,240 |
| 활성화 함수 | SwiGLU |
| 정규화 | RMSNorm (pre-norm) |
| 위치 임베딩 | RoPE + Flash Attention |
| 컨텍스트 윈도우 | 32K 네이티브 / 131K (YaRN) / 262K (Instruct-2507) |
| 추론 모드 | Thinking (CoT) + Non-Thinking 하이브리드 |
| 라이선스 | Apache 2.0 (상업적 사용 가능) |
| 출시일 | 2025년 4월 29일 |
| 후속 버전 | Instruct-2507 (2025-07), VL 변형 (2025-10) |

출처: [HuggingFace Qwen/Qwen3-235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B), [Qwen3 공식 블로그](https://qwenlm.github.io/blog/qwen3/), [APXML 사양](https://apxml.com/models/qwen3-235b-a22b)

---

## 2. 벤치마크 성능

### 2.1 코딩 벤치마크

#### LiveCodeBench (최신 리더보드)

Qwen3-235B-A22B는 LiveCodeBench에서 **Pass@1 65.9%**로, O4-Mini(Low)와 동률 13위에 위치한다.

| 순위 | 모델 | Pass@1 | Easy | Medium | Hard |
|------|------|--------|------|--------|------|
| 1 | O4-Mini (High) | 80.2% | 99.1 | 89.4 | 63.5 |
| 5 | DeepSeek-R1-0528 | 73.1% | 98.7 | 85.2 | 50.7 |
| **13** | **Qwen3-235B-A22B** | **65.9%** | **99.1** | **80.1** | **37.9** |
| 20 | Claude-Sonnet-4 (Thinking) | 55.9% | 97.3 | 66.0 | 26.6 |
| 21 | Claude-Sonnet-4 | 47.1% | 96.4 | 53.9 | 15.8 |
| 24 | GPT-4O-2024-08-06 | 29.5% | 82.5 | 26.0 | 3.3 |

출처: [LiveCodeBench Leaderboard](https://livecodebench.github.io/leaderboard.html)

**주목**: Qwen3-235B-A22B는 Claude Sonnet 4(Thinking 포함)보다 LiveCodeBench에서 10pp 이상 우세하며, GPT-4o 대비 2배 이상의 성능을 보인다.

#### SWE-bench Pro (SEAL 표준 스캐폴딩)

반면 SWE-bench Pro에서는 상용 모델과 큰 격차를 보인다:

| 순위 | 모델 | 점수 |
|------|------|------|
| 1 | Claude Opus 4.5 | 45.9% |
| 4 | Claude Sonnet 4 | 42.7% |
| 8 | Qwen3 Coder 480B | 38.7% |
| **13** | **Qwen3 235B** | **21.4%** |
| 15 | DeepSeek V3p2 | 15.6% |

출처: [SWE-bench Pro / SEAL Leaderboard](https://www.morphllm.com/swe-bench-pro)

**수치 투명성**: SWE-bench Pro는 실제 GitHub 이슈 해결 능력을 측정하며, 250턴 제한 + 표준화된 스캐폴딩을 사용한다. LiveCodeBench(알고리즘 문제)와 SWE-bench Pro(실제 소프트웨어 엔지니어링)는 측정하는 능력이 다르다. 이 수치가 틀릴 수 있는 조건: 스캐폴딩 구성, 에이전트 프레임워크, 프롬프트 전략에 따라 결과가 크게 달라진다.

### 2.2 수학/추론 벤치마크

| 벤치마크 | Qwen3-235B-A22B | 비교 모델 | 비고 |
|-----------|-----------------|-----------|------|
| MATH-500 | 90.2% | — | Qwen 공식 보고 |
| AIME 2024 | 32.7% | AIME 리더보드 18위 | 추론 모델(O3, R1)에 열세 |
| AIME 2025 | 23.7% | — | 최신 문제에서 난이도 상승 |
| GPQA | — | Claude Sonnet 4 우세 | LLM Stats: Claude가 GPQA에서 우위 |
| AIME 2025 (MMMLU) | — | Qwen3 우세 | LLM Stats: Qwen이 AIME 2025, MMMLU에서 우위 |
| AA Intelligence Index | 20 (Reasoning) | 중앙값 이하 | Artificial Analysis 평가 |
| IFBench | 36.6% | — | Instruction Following 벤치마크 |

출처: [DesignForOnline 리뷰](https://designforonline.com/ai-models/qwen-qwen3-235b-a22b/), [LLM Stats](https://llm-stats.com/models/compare/claude-sonnet-4-20250514-vs-qwen3-235b-a22b), [Artificial Analysis](https://artificialanalysis.ai/models/qwen3-235b-a22b-instruct-reasoning)

### 2.3 상용 모델과의 종합 비교

| 항목 | Qwen3-235B-A22B | Claude Sonnet 4 | GPT-4o |
|------|-----------------|-----------------|--------|
| LiveCodeBench Pass@1 | **65.9%** | 47.1% (55.9% Thinking) | 29.5% |
| SWE-bench Pro | 21.4% | **42.7%** | — |
| AIME 2025 | **우세** | 열세 | — |
| GPQA | 열세 | **우세** | — |
| 입력 비용 ($/1M tok) | **$0.10~0.70** | $3.00 | $5.00 |
| 출력 비용 ($/1M tok) | **$0.10~2.80** | $15.00 | $15.00 |
| 컨텍스트 | 131K~262K | 200K | 128K |
| 오픈소스 | Apache 2.0 | 비공개 | 비공개 |

출처: [LLM Stats 비교](https://llm-stats.com/models/compare/claude-sonnet-4-20250514-vs-qwen3-235b-a22b), [AnotherWrapper 비교](https://anotherwrapper.com/tools/llm-pricing/claude-sonnet-4/qwen-3-235b-a22b)

**반증 탐색**: "Qwen3-235B-A22B가 Claude Sonnet 4보다 전반적으로 우수하다"는 주장(AnotherWrapper)에 대해, SWE-bench Pro에서 2배 격차(21.4% vs 42.7%)가 존재하고, GPQA에서도 Claude가 우세하다. 알고리즘 코딩에서는 Qwen이 강하지만, 실제 소프트웨어 엔지니어링과 과학 추론에서는 Claude가 우위. **반증 발견됨**.

---

## 3. Tool Use / Function Calling 능력

### 3.1 공식 지원 현황

Qwen3-235B-A22B는 에이전트 도구 사용에 강점을 가지며 공식적으로 다음을 지원한다:

| 기능 | 지원 여부 | 상세 |
|------|-----------|------|
| **Function Calling** | 지원 | OpenAI 호환 `tools` 파라미터, 병렬 도구 호출 지원 |
| **Structured Output** | 지원 | JSON mode, pydantic BaseModel 기반 스키마 |
| **MCP (Model Context Protocol)** | 공식 지원 | Qwen-Agent 프레임워크를 통한 MCP 서버 연동 |
| **Thinking 모드에서 도구 호출** | 지원 | Thinking/Non-Thinking 모두에서 도구 사용 가능 |
| **코드 인터프리터** | 내장 | Qwen-Agent 빌트인 도구 |

출처: [HuggingFace Qwen3-235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B), [Qwen3 공식 블로그 - Agentic Usages](https://qwenlm.github.io/blog/qwen3/), [Galaxy.ai 비교](https://blog.galaxy.ai/compare/qwen3-235b-a22b-vs-qwen3-coder-30b-a3b-instruct)

### 3.2 에이전트 프레임워크 통합

- **Qwen-Agent**: 공식 에이전트 프레임워크. tool-calling 템플릿과 파서를 내장하여 코딩 복잡성 최소화
- **AutoGen**: structured_output + function calling 지원. pydantic BaseModel을 도구로 전달하여 JSON 스키마 강제 가능
- **vLLM/SGLang**: OpenAI 호환 API 엔드포인트로 배포 가능. `--enable-reasoning --reasoning-parser deepseek_r1` 플래그 사용
- **Google Vertex AI**: 관리형 API로 GA 배포. 배치 예측, 함수 호출, 구조화 출력 지원

출처: [DataLeadsFuture AutoGen 가이드](https://www.dataleadsfuture.com/build-autogen-agents-with-qwen3-structured-output-thinking-mode/), [Together AI](https://www.together.ai/models/qwen3-235b-a22b-thinking-2507), [Google Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/qwen/qwen3-235b)

### 3.3 제약 및 주의점

직접적인 "Qwen3-235B-A22B 도구 호출 안정성 문제" 보고는 검색 결과에서 발견되지 않았다. 그러나:

1. **Thinking 모드 토큰 오버헤드**: Thinking 모드에서 도구 호출 시 추론 토큰이 추가되어 비용과 지연 증가
2. **json_schema 직접 지원**: AutoGen에서 `output_content_type` 직접 지원이 아닌, function calling을 통한 우회 방식 필요 (DataLeadsFuture 가이드 참조)
3. **VRAM 요구**: FP16 기준 ~460GB, Q4 기준 ~115GB로 자체 호스팅 시 고사양 GPU 클러스터 필요

**반증 탐색**: Qwen3 도구 호출 관련 프로덕션 안정성 데이터가 부재하다. Facebook 커뮤니티에서 Qwen3-Coder에 대해 "It is not stable and also not powerful"이라는 의견이 있었으나 (출처 미확인, 개인 의견 수준), 235B-A22B 자체에 대한 체계적 안정성 보고는 없다. **안정성에 대한 반증도 확증도 미발견**.

**실행 연결**: 프로덕션 에이전트 시스템 도입 전, (1) 실제 워크플로우에서의 tool calling 안정성 벤치마크, (2) 긴 멀티턴 대화에서의 스키마 일관성 테스트, (3) Thinking vs Non-Thinking 모드의 도구 호출 성공률 비교가 필요하다.

---

## 4. Instruction Following / 시스템 프롬프트 준수

### 4.1 하이브리드 Thinking 모드

Qwen3의 가장 차별화된 특징은 Thinking/Non-Thinking 하이브리드 모드이다:

- **Thinking 모드** (`/think`): 복잡한 수학, 코딩, 논리 추론에 적합. 단계별 추론 후 답변
- **Non-Thinking 모드** (`/no_think`): 빠른 응답, 단순 질문에 적합. 즉각 답변
- **소프트 스위치**: 멀티턴 대화 중 `/think`, `/no_think` 태그로 동적 전환 가능
- **Thinking Budget 제어**: 할당된 연산 예산에 비례하여 성능이 스케일링됨

출처: [Qwen3 공식 블로그](https://qwenlm.github.io/blog/qwen3/)

### 4.2 에이전트 적합성

| 능력 | 수준 | 근거 |
|------|------|------|
| 시스템 프롬프트 준수 | 양호 | IFBench 36.6%, Instruct-2507 버전에서 instruction following 추가 강화 |
| 역할 분리(persona) | 양호 | 에이전트 역할 할당, role-playing에 강한 것으로 평가 |
| 멀티턴 일관성 | 양호 | Thinking/Non-Thinking 전환 시에도 컨텍스트 유지 |
| 도구 사용 시 지시 준수 | 양호 | Thinking + Non-Thinking 모드 모두에서 도구 호출 지원 |
| 다국어 지시 | 우수 | 119개 언어/방언 지원, 한국어 포함 |

출처: [SiliconFlow 모델 정보](https://www.siliconflow.com/models/qwen3-235b-a22b), [Together AI](https://www.together.ai/models/qwen3-235b-a22b-instruct-2507-fp8)

**관점 확장**: IFBench 36.6%는 instruction following 벤치마크에서 중간 수준이다. 복잡한 멀티에이전트 시스템에서 여러 제약 조건을 동시에 준수해야 하는 경우, 이 수치가 충분한지 실제 테스트가 필요하다.

---

## 5. MoE 아키텍처와 추론 비용

### 5.1 아키텍처의 추론 효율성

Qwen3-235B-A22B의 MoE 구조는 추론 효율성에 직접적 이점을 제공한다:

- **활성화 비율**: 235B 중 22B만 활성화 → 전체의 약 9.4%만 연산
- **동등 Dense 모델 대비**: 22B Dense 모델과 유사한 연산량이지만 235B의 지식 용량 보유
- **Qwen 팀 주장**: "Qwen3-MoE base models achieve similar performance to Qwen2.5 dense base models while using only 10% of the active parameters"
- **128개 전문가 중 8개 활성**: top-K 라우팅으로 토큰별 최적 전문가 선택

출처: [Qwen3 공식 블로그 - Pre-training](https://qwenlm.github.io/blog/qwen3/)

### 5.2 추론 성능

| 지표 | 값 | 조건 |
|------|-----|------|
| 출력 속도 | ~51 tok/s | Alibaba API (Artificial Analysis 측정) |
| 추론 모드 지연 | 추가 사고 시간 포함 | Thinking 모드에서 CoT 토큰 생성 |
| VRAM 요구 | ~460GB (FP16), ~230GB (Q8), ~115GB (Q4) | 자체 호스팅 시 |
| Mac Studio MLX | ~24 tok/s | 4-bit 양자화, 로컬 실행 |

출처: [Artificial Analysis](https://artificialanalysis.ai/models/qwen3-235b-a22b-instruct-reasoning), [MacStories 벤치마크](https://www.macstories.net/notes/notes-on-early-mac-studio-ai-benchmarks-with-qwen3-235b-a22b-and-qwen2-5-vl-72b/), [APXML VRAM](https://apxml.com/models/qwen3-235b-a22b)

### 5.3 비용 비교

| 모델 | 입력 ($/1M tok) | 출력 ($/1M tok) | 블렌드 (3:1) |
|------|-----------------|-----------------|-------------|
| **Qwen3-235B-A22B** (SiliconFlow) | $0.18 | $0.68 | **$0.31** |
| **Qwen3-235B-A22B** (Together AI FP8) | $0.20 | $0.60 | $0.30 |
| **Qwen3-235B-A22B** (OpenRouter) | $0.70 | $2.80 | $1.23 |
| **Claude Sonnet 4** | $3.00 | $15.00 | $6.00 |
| **GPT-4o** | $5.00 | $15.00 | $7.50 |

출처: [SiliconFlow](https://www.siliconflow.com/models/qwen3-235b-a22b), [Together AI](https://www.together.ai/models/qwen3-235b-a22b-fp8-tput), [OpenRouter](https://openrouter.ai/qwen/qwen3-235b-a22b), [LLM Stats](https://llm-stats.com/models/compare/claude-sonnet-4-20250514-vs-qwen3-235b-a22b)

**실행 연결**: 멀티에이전트 시스템에서 다수의 서브에이전트를 병렬 실행할 경우, Qwen3의 비용 우위는 극대화된다. 예: 5개 Researcher 에이전트 x 평균 50K 출력 토큰 = Qwen3 $0.03 vs Claude $0.75 (25배 차이). 단, Thinking 모드 사용 시 실제 출력 토큰이 2~5배 증가하여 비용 차이가 줄어들 수 있다.

---

## 6. 실제 사용 사례 및 에이전트 통합

### 6.1 공식 에이전트 프레임워크

Qwen3는 **Qwen-Agent** 프레임워크를 공식 제공하며, 아래 기능을 포함한다:

- MCP 서버 연동 (시간, fetch, 커스텀 도구)
- 빌트인 코드 인터프리터
- Tool-calling 템플릿/파서 내장
- 스트리밍 생성 지원

```python
# Qwen-Agent 예시 (공식 문서)
from qwen_agent.agents import Assistant
bot = Assistant(llm=llm_cfg, function_list=tools)
for responses in bot.run(messages=messages):
    pass
```

### 6.2 서드파티 프레임워크 통합

| 프레임워크 | 지원 현황 | 비고 |
|------------|-----------|------|
| AutoGen | Structured Output + Function Calling | pydantic BaseModel 기반 |
| vLLM | 완전 지원 | `--enable-reasoning --reasoning-parser deepseek_r1` |
| SGLang | 완전 지원 | `--reasoning-parser qwen3` |
| Ollama | 로컬 실행 | `ollama run qwen3:235b-a22b` |
| Google Vertex AI | GA 배포 | 관리형 API, 배치 예측 지원 |
| NVIDIA NIM | API 제공 | GPU 최적화 추론 |

출처: [Qwen3 공식 블로그](https://qwenlm.github.io/blog/qwen3/), [DataLeadsFuture](https://www.dataleadsfuture.com/build-autogen-agents-with-qwen3-structured-output-thinking-mode/), [NVIDIA NIM](https://build.nvidia.com/qwen/qwen3-235b-a22b)

### 6.3 멀티에이전트 배포 사례

프로덕션 수준의 Qwen3-235B-A22B 기반 멀티에이전트 배포 사례는 공개 자료에서 발견되지 않았다. 다만:

- **AutoGen 기반 에이전트**: Structured output과 function calling을 결합한 감정 분석/분류 에이전트 구현 사례 존재
- **Qwen-Agent + MCP**: 공식 문서에서 웹 크롤링 + 시간 서비스 연동 에이전트 예시 제공
- **Visual Agent (VL 변형)**: PC/모바일 GUI 인식, 요소 이해, 도구 호출, 작업 완료까지 수행하는 시각적 에이전트

**반증 탐색**: 대규모 프로덕션 멀티에이전트 배포 사례 부재. 대부분 튜토리얼/PoC 수준. 엔터프라이즈 프로덕션에서의 장기 안정성 데이터 없음. **반증 미발견(부재 자체가 중립~부정적 신호)**.

---

## 7. 후속 버전 참고

Qwen3-235B-A22B 이후 여러 변형이 출시되었다:

| 버전 | 출시 | 핵심 변경 |
|------|------|-----------|
| Qwen3-235B-A22B (원본) | 2025-04 | 기본 모델. Thinking/Non-Thinking 하이브리드 |
| Qwen3-235B-A22B-Instruct-2507 | 2025-07 | Instruction following, 추론, 코딩, 도구 사용 강화. 262K 컨텍스트 |
| Qwen3-VL-235B-A22B-Instruct | 2025-10 | 비전-언어 통합. 시각적 에이전트 능력 |
| Qwen3-VL-235B-A22B-Thinking | 2025-10 | 멀티모달 + Thinking 모드 결합 |
| Qwen3-Coder-480B-A35B | 2025-07 | 코딩 특화. 160개 전문가, 256K 컨텍스트 |

출처: [SiliconFlow 모델 목록](https://www.siliconflow.com/models/qwen3-235b-a22b), [OpenRouter](https://openrouter.ai/qwen/qwen3-vl-235b-a22b-instruct), [HuggingFace Instruct-2507](https://huggingface.co/Qwen/Qwen3-235B-A22B-Instruct-2507)

**실행 연결**: 멀티에이전트 오케스트레이션 목적이라면 **Instruct-2507** 버전이 가장 적합하다. 262K 컨텍스트, 강화된 instruction following, 도구 사용 능력을 제공한다. 코딩 전담 에이전트에는 **Qwen3-Coder-480B** 또는 경량 **Qwen3-Coder-30B-A3B**가 더 효율적일 수 있다.

---

## 8. 멀티에이전트 오케스트레이션 적합성 평가

### 종합 평가표

| 평가 항목 | 점수 (5점 만점) | 근거 |
|-----------|-----------------|------|
| 코딩 능력 | 4.0 | LiveCodeBench 65.9% (비추론 모델 최상위), SWE-bench Pro 21.4% (약점) |
| 추론 능력 | 3.5 | MATH 90.2%, AIME 32.7%. Thinking 모드로 보강 가능하나 전용 추론 모델(O3, R1) 대비 열세 |
| Tool Use 안정성 | 3.5 | Function calling/Structured output/MCP 공식 지원. 프로덕션 안정성 데이터 부재 |
| Instruction Following | 3.5 | IFBench 36.6%. 하이브리드 모드로 유연한 지시 준수. 119개 언어 지원 |
| 비용 효율성 | 5.0 | Claude 대비 최대 25배 저렴 |
| 멀티턴 일관성 | 3.5 | Thinking/Non-Thinking 전환 지원, 131K~262K 컨텍스트 |
| 자체 호스팅 용이성 | 3.0 | Apache 2.0, vLLM/SGLang 지원, 단 VRAM 460GB(FP16) 필요 |
| 에이전트 생태계 | 4.0 | Qwen-Agent 공식 프레임워크, MCP 지원, AutoGen/vLLM 통합 |

### 역할별 추천

| 에이전트 역할 | 적합도 | 이유 |
|---------------|--------|------|
| **메인 오케스트레이터** | 조건부 추천 | Tool calling + Thinking 모드 결합 가능하나, 프로덕션 안정성 미검증 |
| **Researcher (자료 조사)** | 강력 추천 | 비용 효율적, 충분한 지식/추론 능력, 119개 언어 지원, 도구 의존도 낮은 작업에 최적 |
| **코드 생성 에이전트** | 추천 | LiveCodeBench 65.9% 우수. 단, SWE-bench Pro 21.4%로 복잡한 SW 엔지니어링은 한계 |
| **Critic / 검증 에이전트** | 조건부 추천 | Thinking 모드로 단계별 검증 가능. 안정성/편향 데이터 부재 |
| **Synthesizer** | 추천 | 비용 효율적, 다국어 지원, 긴 컨텍스트로 대량 자료 통합에 적합 |

---

## 9. 관점 확장

### 인접 질문

1. **Qwen3-Coder-480B-A35B vs Qwen3-235B-A22B**: 코딩 전담 에이전트로 Coder 모델을 분리 배치하는 것이 효율적인가? Coder 모델은 SWE-bench Pro 38.7%로 235B의 21.4%보다 크게 우수하다. 비용 대비 코딩 품질 최적화 전략이 필요하다.

2. **Thinking 모드의 비용-품질 트레이드오프**: Thinking 모드는 출력 토큰이 2~5배 증가하여 비용 우위가 줄어든다. 에이전트 역할별로 Thinking/Non-Thinking을 어떻게 배분해야 최적인가?

### 숨은 변수

- **컨텍스트 윈도우와 에이전트 메모리**: 131K~262K 컨텍스트는 긴 멀티에이전트 대화를 수용하나, Thinking 모드의 CoT 토큰이 실효 컨텍스트를 잠식할 수 있다.
- **중국 기업 모델의 지정학적 리스크**: Alibaba Cloud 모델로서 데이터 프라이버시 및 정책 변경 리스크. Apache 2.0 라이선스로 자체 호스팅 가능하나 GPU 비용 발생.

### [이질 도메인: 소프트웨어 엔지니어링 - 마이크로서비스 아키텍처]

MoE의 "전문가 선택적 활성화" 구조는 마이크로서비스 아키텍처에서 "요청 유형별 서비스 라우팅"과 구조적으로 유사하다. 마이크로서비스에서 배운 교훈(서비스 디스커버리, 로드 밸런싱, 서킷 브레이커)을 MoE 기반 에이전트 시스템 설계에 차용할 수 있다.

### 문제 재정의

원래 질문 "Qwen3-235B-A22B의 성능은?"보다 더 적절한 질문: **"멀티에이전트 시스템에서 Qwen3 패밀리(235B/Coder-480B/30B-A3B)를 역할별로 어떻게 배치하고, Thinking/Non-Thinking 예산을 어떻게 할당해야 비용-품질 최적 균형을 달성하는가?"**

---

## 출처 목록

1. [Qwen3 공식 블로그 - Think Deeper, Act Faster](https://qwenlm.github.io/blog/qwen3/)
2. [HuggingFace Qwen/Qwen3-235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B)
3. [HuggingFace Qwen3-235B-A22B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-235B-A22B-Instruct-2507)
4. [Artificial Analysis - Qwen3 235B](https://artificialanalysis.ai/models/qwen3-235b-a22b-instruct-reasoning)
5. [LiveCodeBench Leaderboard](https://livecodebench.github.io/leaderboard.html)
6. [SWE-bench Pro / SEAL Leaderboard](https://www.morphllm.com/swe-bench-pro)
7. [LLM Stats - Claude Sonnet 4 vs Qwen3](https://llm-stats.com/models/compare/claude-sonnet-4-20250514-vs-qwen3-235b-a22b)
8. [DesignForOnline - Qwen3 235B 리뷰](https://designforonline.com/ai-models/qwen-qwen3-235b-a22b/)
9. [APXML - VRAM Requirements](https://apxml.com/models/qwen3-235b-a22b)
10. [SiliconFlow - Qwen3-235B-A22B](https://www.siliconflow.com/models/qwen3-235b-a22b)
11. [Together AI - FP8 Throughput](https://www.together.ai/models/qwen3-235b-a22b-fp8-tput)
12. [OpenRouter - Qwen3 235B A22B](https://openrouter.ai/qwen/qwen3-235b-a22b)
13. [AnotherWrapper - Claude vs Qwen3 비교](https://anotherwrapper.com/tools/llm-pricing/claude-sonnet-4/qwen-3-235b-a22b)
14. [DataLeadsFuture - AutoGen + Qwen3](https://www.dataleadsfuture.com/build-autogen-agents-with-qwen3-structured-output-thinking-mode/)
15. [Google Vertex AI - Qwen3 235B](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/maas/qwen/qwen3-235b)
16. [NVIDIA NIM - Qwen3](https://build.nvidia.com/qwen/qwen3-235b-a22b)
17. [MacStories - Mac Studio 벤치마크](https://www.macstories.net/notes/notes-on-early-mac-studio-ai-benchmarks-with-qwen3-235b-a22b-and-qwen2-5-vl-72b/)
18. [Medium - Qwen3 MoE Architecture, Agent Tools](https://medium.com/aimonks/qwen3-moe-architecture-agent-tools-global-language-llm-6c839bf11584)
19. [Fireworks AI - Qwen3 Decoded](https://fireworks.ai/blog/qwen-3-decoded)
20. [Galaxy.ai - Qwen3 모델 비교](https://blog.galaxy.ai/compare/qwen3-235b-a22b-vs-qwen3-coder-30b-a3b-instruct)
