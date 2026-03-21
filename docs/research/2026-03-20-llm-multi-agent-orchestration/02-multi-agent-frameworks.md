# 멀티에이전트 오케스트레이션 프레임워크 비교 분석

> **Researcher 2 산출물** | 2026-03-20
> 핵심 조건: 자체 호스팅(self-hosted) LLM API(Qwen3-235B-A22B, OpenAI-compatible API) 호환

---

## 목차

1. [프레임워크 비교 총괄표](#1-프레임워크-비교-총괄표)
2. [LangGraph](#2-langgraph)
3. [CrewAI](#3-crewai)
4. [AutoGen (AG2)](#4-autogen-ag2)
5. [OpenAI Agents SDK](#5-openai-agents-sdk)
6. [Mastra](#6-mastra)
7. [smolagents](#7-smolagents)
8. [추가 주목 프레임워크](#8-추가-주목-프레임워크)
9. [Claude Code 멀티에이전트 아키텍처 분석](#9-claude-code-멀티에이전트-아키텍처-분석)
10. [자체 구현 vs 프레임워크 사용](#10-자체-구현-vs-프레임워크-사용)
11. [의사결정 가이드](#11-의사결정-가이드)
12. [관점 확장 및 문제 재정의](#12-관점-확장-및-문제-재정의)
13. [출처](#13-출처)

---

## 1. 프레임워크 비교 총괄표

| 항목 | **LangGraph** | **CrewAI** | **AutoGen (AG2)** | **OpenAI Agents SDK** | **Mastra** | **smolagents** |
|------|-------------|-----------|------------------|---------------------|-----------|--------------|
| **아키텍처 패턴** | 방향성 그래프 (상태 머신) | 역할 기반 Crew | 대화 기반 GroupChat | 핸드오프 기반 경량 에이전트 | 워크플로우 + 에이전트 | 코드 중심 최소 루프 |
| **언어** | Python | Python | Python (.NET 지원) | Python (JS 지원) | TypeScript | Python |
| **Self-hosted LLM 호환** | ✅ LangChain 통합 | ✅ Ollama/OpenAI-compatible | ✅ OpenAIChatCompletionClient | ✅ `base_url` 설정 | ✅ AI SDK 어댑터 | ✅ OpenAIServerModel |
| **Tool/Function Calling** | LangChain 도구 체계 | 데코레이터 기반 도구 | 함수 도구 등록 | `function_tool` 데코레이터 | Zod 스키마 기반 | 커스텀 도구 + 코드 실행 |
| **에이전트 간 통신** | 그래프 엣지 + 공유 상태 | 태스크 출력 전달 | 대화 메시지 패싱 | Handoff (에이전트 전환) | 워크플로우 체이닝 | 매니저 에이전트 위임 |
| **컨텍스트 관리** | 체크포인터 + 상태 그래프 | 기본적 컨텍스트 패싱 | 누적 대화 히스토리 | 에이전트별 독립 | 워크플로우 상태 | 에이전트별 독립 |
| **프로덕션 준비도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **GitHub Stars** | ~19,900 | ~39,200 | ~50,600 | ~18,000+ | ~19,000 | ~15,000+ |
| **라이선스** | MIT | MIT | Apache-2.0 | MIT | Apache-2.0 | Apache-2.0 |

> **수치 출처**: GitHub Stars는 agentically.sh 비교 (2026-03 기준). 이 수치는 커뮤니티 관심도를 나타내며 프로덕션 준비도와 직접 비례하지는 않는다.

---

## 2. LangGraph

### 아키텍처

LangGraph는 LangChain 생태계 위에 구축된 **방향성 그래프 상태 머신** 프레임워크다. 각 에이전트 단계를 노드(node)로, 전이를 엣지(edge)로 모델링한다. 순환 그래프를 지원하여 에이전트가 이전 단계를 재방문할 수 있다.

```
State → Node A → Conditional Edge → Node B → Node C → END
                    ↑                              ↓
                    └──────────────────────────────┘
```

### Self-hosted LLM 호환성

- LangChain의 `ChatOpenAI` 클래스에 `base_url`과 `api_key`를 지정하면 Qwen3-235B-A22B 등 OpenAI-compatible API에 직접 연결 가능
- `ChatOllama`, `ChatLiteLLM` 등 다양한 백엔드 어댑터 지원
- **검증**: LangChain은 가장 넓은 LLM 제공자 호환성을 보유 (반증 미발견)

### Tool/Function Calling

- LangChain의 `@tool` 데코레이터 또는 `StructuredTool` 클래스 사용
- 도구 호출은 그래프 노드 내에서 발생하며, 결과는 상태(state)에 기록
- 도구 에러 핸들링과 재시도를 그래프 분기로 구현 가능

### 에이전트 간 통신

- **공유 상태 객체**: 모든 노드가 동일한 TypedDict/Pydantic 상태에 읽기/쓰기
- **서브그래프**: 복잡한 워크플로우를 중첩 그래프로 분리. 부모-자식 간 상태 격리 가능
- 메시지 패싱이 아닌 상태 변이(state mutation)로 통신

### 컨텍스트 관리

- **체크포인터(Checkpointer)**: SQLite, PostgreSQL 등에 실행 상태를 자동 저장/복원
- 장기 실행 워크플로우의 중단/재개 가능
- Human-in-the-loop: `interrupt` 노드로 사람 승인 후 재개

### 프로덕션 준비도

- **최고 수준**. LangSmith와 통합된 관측성(observability), 트레이싱
- 상태 체크포인팅으로 장애 복구 지원
- 커뮤니티 활발, 문서화 우수

### 장단점

| 장점 | 단점 |
|------|------|
| 가장 정밀한 실행 흐름 제어 | 학습 곡선이 높음 (그래프 개념 필요) |
| 체크포인팅으로 장기 워크플로우 안정적 | LangChain 의존성으로 추상화 레이어 깊음 |
| 조건부 분기, 병렬 실행, 루프 자유자재 | 단순 작업에 과도한 보일러플레이트 |
| 최고 수준의 관측성 | 디버깅 시 상태 흐름 추적 복잡 |

> **실행 연결**: 복잡한 멀티스텝 워크플로우(예: 리서치 파이프라인, 코드 리뷰 체인)에서 장애 복구와 세밀한 흐름 제어가 필요하다면 LangGraph가 최적이다.

---

## 3. CrewAI

### 아키텍처

CrewAI는 **역할 기반(role-based) 멀티에이전트 협업** 프레임워크다. "Crew" 컨테이너 안에 각 에이전트가 고유 역할(role), 목표(goal), 배경(backstory)을 가지고 태스크를 수행한다.

```
Crew
├── Agent: Researcher (role="시장 분석가")
├── Agent: Writer (role="보고서 작성자")
└── Agent: Reviewer (role="품질 검토자")
    └── Tasks: [research_task → write_task → review_task]
```

### Self-hosted LLM 호환성

- **모델 무관(model-agnostic)**: OpenAI, Anthropic, Ollama, 그리고 모든 OpenAI-compatible API 지원
- `os.environ["OPENAI_API_BASE"]`를 자체 호스팅 엔드포인트로 설정하면 즉시 사용 가능
- LiteLLM 통합으로 100+ 모델 제공자 접근 가능

### Tool/Function Calling

- `@tool` 데코레이터로 간단히 도구 정의
- 에이전트에 `tools=[...]` 리스트로 할당
- 내장 도구: 웹 검색, 파일 읽기/쓰기, 코드 실행 등

### 에이전트 간 통신

- **태스크 출력 기반**: 이전 태스크의 결과가 다음 태스크의 입력으로 전달
- 직접적인 에이전트-대-에이전트 메시지 패싱은 없음 (태스크 매개)
- 매니저 에이전트를 통한 위임(delegation) 패턴 지원

### 컨텍스트 관리

- 기본적인 컨텍스트 패싱 (태스크 출력 → 다음 태스크 입력)
- 메모리 모듈 (Short-term, Long-term, Entity) 제공
- **한계**: 내장 체크포인팅 없음. 장기 실행 워크플로우에서 장애 복구 취약

### 프로덕션 준비도

- 중간 수준. 프로토타이핑과 중규모 프로덕션에 적합
- Human-in-the-loop 지원 제한적
- **흔한 패턴**: CrewAI로 프로토타입 → LangGraph로 프로덕션 마이그레이션

### 장단점

| 장점 | 단점 |
|------|------|
| 가장 빠른 프로토타이핑 (20줄 미만 멀티에이전트) | 세밀한 제어 부족 |
| 직관적 역할 기반 설계 | 내장 체크포인팅 없음 |
| 학습 곡선 낮음 | 에이전트 간 직접 통신 제한 |
| 넓은 모델 호환성 | 대규모 워크플로우에서 병목 가능 |

> **실행 연결**: 빠른 PoC와 역할이 명확한 팀 기반 작업(리서치+작성+검토)에 최적. 프로덕션 안정성이 필요하면 LangGraph 마이그레이션을 계획해야 한다.

---

## 4. AutoGen (AG2)

### 아키텍처

Microsoft Research 출신. **대화 기반(conversational) 멀티에이전트** 프레임워크. 에이전트들이 그룹 채팅에서 다중 턴 대화를 통해 문제를 해결한다.

v0.4 (AG2) 아키텍처 구조:
```
Core API (이벤트 드리븐, 비동기)
  └── AgentChat API (프로토타이핑용 고수준 API)
      ├── ConversableAgent
      ├── GroupChat (RoundRobin / Selector / Auto)
      └── Handoff 패턴
  └── Extensions API (LLM 제공자, 코드 실행 등)
```

> **주의**: AutoGen은 현재 두 가지 계보로 분화되어 있다:
> 1. **Microsoft AutoGen 0.4+**: 이벤트 드리븐 재설계, Semantic Kernel 통합 방향
> 2. **AG2 (커뮤니티)**: 원 개발자들이 Microsoft를 떠나 유지하는 포크 (`pyautogen` 패키지)
>
> 이 보고서에서는 Microsoft 공식 AutoGen 0.4를 기준으로 한다.

### Self-hosted LLM 호환성

- `OpenAIChatCompletionClient`에 `base_url` 설정으로 OpenAI-compatible API 연결
- **중요**: `api_type: "openai"`로 설정하면 모든 OpenAI-호환 엔드포인트 사용 가능

```python
llm_config = LLMConfig(config_list={
    "api_type": "openai",
    "model": "qwen3-235b-a22b",
    "api_key": os.environ.get("API_KEY"),
    "base_url": "http://your-server:8000/v1"
})
```

- Groq, Perplexity 등 다양한 OpenAI-호환 제공자에서 실제 검증됨

### Tool/Function Calling

- 함수를 에이전트에 등록하여 도구로 사용
- 코드 실행: Docker 샌드박스 내장 (`DockerCommandLineCodeExecutor`)
- Pydantic 모델로 구조화된 출력 강제 가능

### 에이전트 간 통신

- **대화 메시지 패싱**: 에이전트들이 공유 대화 히스토리에 메시지를 게시
- GroupChat: 여러 에이전트가 하나의 대화에 참여, 셀렉터가 발화 순서 결정
- 패턴: RoundRobinGroupChat, SelectorGroupChat, AutoPattern

### 컨텍스트 관리

- 누적 대화 히스토리 (자동 관리)
- **핵심 문제: 토큰 비용**. 4-에이전트 GroupChat이 5라운드를 돌면 최소 20회 LLM 호출, 각각 전체 대화 히스토리 포함
- 이는 비용과 지연 시간 모두에 심각한 영향

### 프로덕션 준비도

- 중간 수준. v0.4 재설계로 이벤트 드리븐/비동기 코어 개선
- OpenTelemetry 지원 추가
- **리스크**: v0.2 → v0.4 마이그레이션이 기존 통합을 깨뜨림. 초기 도입 기업에 재작업 부담

### 장단점

| 장점 | 단점 |
|------|------|
| 코드 리뷰/생성 워크플로우에 탁월 | 토큰 비용이 매우 높음 (대화 누적) |
| 에이전트 토론/비평 패턴 자연스러움 | 학습 곡선 가파름 |
| Docker 코드 실행 내장 | v0.2/v0.4/AG2 분화로 생태계 혼란 |
| Microsoft Research 백업 | 실시간/고볼륨 사용 사례에 부적합 |

> **수치 투명성**: "4-에이전트 5라운드 = 최소 20 LLM 호출"은 각 에이전트 턴마다 전체 대화 히스토리를 보내는 구조에서 발생. Qwen3-235B-A22B는 MoE 아키텍처(22B 활성 파라미터)로 추론 비용이 비교적 효율적이나, thinking mode 활성화 시 추론 토큰이 대폭 증가하여 GroupChat의 토큰 비용 문제가 심화될 수 있다. 128K 컨텍스트 윈도우 제한도 여전히 존재한다.

---

## 5. OpenAI Agents SDK

### 아키텍처

OpenAI Swarm의 후속. **경량 에이전트 런타임**으로, 에이전트 → 핸드오프 → 에이전트 패턴을 핵심으로 한다.

```
Agent A → (handoff) → Agent B → (tool call) → Result
                         ↓
                    Guardrail (입출력 검증)
```

### Self-hosted LLM 호환성

- **3가지 방법으로 커스텀 LLM 연결 가능**:
  1. `set_default_openai_client()`: 전역적으로 `AsyncOpenAI(base_url=...)` 설정
  2. `ModelProvider`: `Runner.run` 수준에서 커스텀 모델 제공자 지정
  3. `Agent.model`: 에이전트 인스턴스별로 모델 지정 (서로 다른 에이전트에 다른 모델 가능)

- `OpenAIChatCompletionsModel`로 OpenAI-compatible API 직접 연결:

```python
model = OpenAIChatCompletionsModel(
    model="qwen3-235b-a22b",
    openai_client=AsyncOpenAI(base_url="http://your-server:8000/v1")
)
```

- **중요 제약**: 도구 호출(tool calling)을 사용하려면 해당 자체 호스팅 모델이 function calling을 지원해야 함. Qwen3-235B-A22B는 function calling과 structured output을 모두 지원하며, Qwen 공식 문서에서도 "excels in tool calling capabilities"로 명시 ([출처](https://huggingface.co/Qwen/Qwen3-235B-A22B))

### Tool/Function Calling

- `@function_tool` 데코레이터로 파이썬 함수를 도구로 변환
- 에이전트에 `tools=[...]`로 할당
- Guardrail: 입력/출력 검증 체크 내장

### 에이전트 간 통신

- **핸드오프(Handoff)**: 한 에이전트가 다른 에이전트에게 제어를 넘김
- 공유 상태나 메시지 패싱이 아닌, 에이전트 전환 방식
- 병렬 실행: 제한적 (내장 지원 부족)

### 컨텍스트 관리

- 에이전트별 독립적 컨텍스트
- 내장 트레이싱으로 실행 추적 가능
- 체크포인팅: 내장 미지원

### 프로덕션 준비도

- 중상 수준. OpenAI의 공식 지원, 문서화 양호
- 트레이싱/관측성 내장
- **한계**: 복잡한 병렬 워크플로우나 상태 관리에는 추가 구현 필요

### 장단점

| 장점 | 단점 |
|------|------|
| 매우 경량, 빠른 시작 | 복잡한 오케스트레이션에 부족 |
| 핸드오프 패턴이 직관적 | 내장 병렬 실행 제한 |
| 커스텀 LLM 연결 유연성 높음 | 체크포인팅 미지원 |
| Guardrail 내장 | OpenAI 생태계에 일부 종속 (트레이싱 등) |

> **반증 탐색**: "OpenAI Agents SDK는 OpenAI에 종속된다"는 주장에 대해 — 실제로 `set_default_openai_client`로 모든 OpenAI-compatible API를 사용할 수 있으며, 모델 제공자 종속은 거의 없다. 단, 트레이싱/관측성은 OpenAI 대시보드에 연결되므로, Langfuse 등 대안이 필요하다. (반증 일부 확인)

---

## 6. Mastra

### 아키텍처

**TypeScript 네이티브** AI 에이전트 프레임워크. Gatsby 개발팀이 만들었으며, Y Combinator W25, $13M 펀딩. v1.0 (2026.01 출시).

```
Mastra
├── Agent (createAgent): 대화형 도구 호출 루프
├── Workflow (createWorkflow): 결정적 실행 순서, 분기, 병렬
└── Tool (createTool): Zod 스키마 기반 타입 안전 도구
```

### Self-hosted LLM 호환성

- Vercel AI SDK (`@ai-sdk/openai`) 기반. `baseURL` 설정으로 OpenAI-compatible API 연결
- **제한**: 검색 결과에서 Ollama/자체 호스팅 LLM에 대한 명시적 문서는 부족. 다만 AI SDK 어댑터를 통해 기술적으로 가능
- **이 수치가 틀릴 수 있는 조건**: Mastra는 아직 v1.0 초기 단계로, 자체 호스팅 관련 문서/사례가 Python 프레임워크 대비 부족할 수 있음

### Tool/Function Calling

- `createTool`로 Zod 입력/출력 스키마 정의 → 타입 안전 도구
- 구조화된 출력(`structuredOutput`)으로 JSON 추출

### 에이전트 간 통신

- 워크플로우 체이닝: `.then()`, `.foreach()`, `Promise.all`로 병렬/순차 실행
- 에이전트 간 직접 통신보다는 워크플로우 파이프라인 기반

### 프로덕션 준비도

- 중간 수준. 로컬 개발 서버, 트레이싱(OpenTelemetry), 평가(eval) 내장
- 주간 npm 다운로드 300k+
- **리스크**: v1.0 출시 직후로 대규모 프로덕션 사례 부족

### 장단점

| 장점 | 단점 |
|------|------|
| TypeScript 네이티브 (프론트엔드 팀에 적합) | Python 대비 AI 에이전트 생태계 얕음 |
| Zod 기반 타입 안전 | 대규모 프로덕션 사례 부족 |
| 워크플로우 + 에이전트 하이브리드 | Self-hosted LLM 관련 문서 부족 |
| OpenTelemetry 네이티브 | 멀티에이전트 협업보다는 워크플로우에 강점 |

> **실행 연결**: TypeScript/Node.js 기반 팀이 웹 애플리케이션에 에이전트를 통합하려 할 때 최적. 순수 멀티에이전트 오케스트레이션보다는 에이전트+워크플로우 하이브리드 패턴에 적합하다.

---

## 7. smolagents

### 아키텍처

HuggingFace의 **최소주의 코드 중심** 에이전트 프레임워크. 에이전트가 Python 코드를 생성하고 실행하여 목표를 달성하는 ReAct 패턴.

```
CodeAgent (매니저)
├── managed_agents=[WebSearchAgent, DataAgent]
├── tools=[calculate, fetch_data]
└── planning_interval=5 (5스텝마다 계획 재수립)
```

### Self-hosted LLM 호환성

- **가장 유연한 모델 호환성**:
  - `HfApiModel`: HuggingFace Inference API
  - `OpenAIServerModel`: 모든 OpenAI-compatible API
  - `TransformersModel`: 로컬 Transformers 모델 직접 로드
  - `LiteLLMModel`: LiteLLM 통한 100+ 제공자
  - Ollama 네이티브 지원

```python
from smolagents import OpenAIServerModel, CodeAgent

model = OpenAIServerModel(
    model_id="Qwen/Qwen3-235B-A22B",
    api_base="http://your-server:8000/v1",
    api_key="any-key"
)
agent = CodeAgent(model=model, tools=[...])
```

### Tool/Function Calling

- 커스텀 도구를 파이썬 함수로 정의
- 에이전트가 도구를 호출하는 대신 **Python 코드를 생성하여 직접 실행**
- 여러 도구 호출을 하나의 코드 블록에서 수행 → LLM 호출 횟수 절감

### 에이전트 간 통신

- **매니저 에이전트 패턴**: `CodeAgent`가 `managed_agents`로 서브에이전트를 관리
- 매니저가 서브에이전트에 태스크를 위임하고 결과를 수집
- 서브에이전트도 자체 도구와 메모리를 가짐

### 프로덕션 준비도

- 초-중간 수준. 프로토타이핑과 연구에 최적화
- Gradio UI 통합 지원
- **한계**: 체크포인팅, 관측성 도구가 제한적

### 장단점

| 장점 | 단점 |
|------|------|
| 가장 간결한 코드 (몇 줄로 에이전트 생성) | 프로덕션 관측성 부족 |
| 오픈소스 LLM 최적화 (HuggingFace 생태계) | 복잡한 워크플로우 제어 제한 |
| 코드 실행으로 LLM 호출 최소화 | 코드 실행 보안 관리 필요 |
| 가장 넓은 모델 호환성 | 커뮤니티 규모가 작음 |

> **관점 확장 [이질 도메인: 소프트웨어 빌드 시스템]**: smolagents의 "코드를 생성하여 도구를 호출" 패턴은 빌드 시스템(Gradle, Bazel)에서 DSL로 빌드 로직을 표현하는 패턴과 유사하다. 중간 추상화 없이 실행 코드를 직접 생성함으로써 오버헤드를 줄인다.

---

## 8. 추가 주목 프레임워크

조사 과정에서 발견된 주요 추가 프레임워크:

### Pydantic AI
- **타입 안전** Python 에이전트 프레임워크. FastAPI 스타일 DX
- Pydantic 모델로 입출력 검증 → 구조화된 에이전트 로직
- OpenAI-compatible API 지원 (반증 미발견)
- **적합**: 타입 안전성을 중시하는 Python 팀

### Google ADK (Agent Development Kit)
- Gemini 모델 네이티브 지원, 멀티에이전트 오케스트레이션
- 세션 관리, 러너 추상화 내장
- **제한**: Google 생태계 중심. 자체 호스팅 LLM과의 호환성 미확인

### Strands Agents (AWS)
- 모델 무관(LiteLLM 통합), AWS 서비스와 깊은 통합
- OpenTelemetry 1등급 지원
- **적합**: AWS 기반 인프라를 사용하는 기업

### Microsoft Agent Framework
- AutoGen/Semantic Kernel과 별개의 범용 에이전트 런타임
- Azure OpenAI + OpenAI 지원, OpenTelemetry
- **적합**: Microsoft 생태계 기업

> **출처**: Langfuse Blog (2025-03-19), agentically.sh (2026-03 기준)

---

## 9. Claude Code 멀티에이전트 아키텍처 분석

### 서브에이전트 Spawn 방식

Claude Code는 `Task` 도구(Agent 도구)를 통해 서브에이전트를 생성한다:

- **부모 에이전트**가 `Task` 도구를 JSON 페이로드와 함께 호출
- 파라미터: `description`, `prompt`, `subagent_type`, `model`, `run_in_background`, `resume`
- 서브에이전트 타입: `general-purpose`, `Explore` (읽기 전용), `Plan`, `claude-code-guide` 등

### 메인-서브 에이전트 간 컨텍스트 관리

| 특성 | 부모 에이전트 | 서브에이전트 |
|------|-------------|------------|
| **컨텍스트** | 전체 대화 히스토리 | 격리됨 (자체 프롬프트 + 프로젝트 파일만) |
| **도구/스킬** | 모든 도구 사용 가능 | 상속된 서브셋 또는 지정된 도구 |
| **출력** | 결과 조율 | 단일 최종 메시지만 반환 |
| **컨텍스트 크기** | 대화 누적 | 독립 200K 토큰 |

핵심 설계: **오케스트레이터-워커 패턴**
- 부모는 위임만 하고, 서브에이전트는 독립 컨텍스트에서 작업
- 서브에이전트는 추가 서브에이전트를 spawn 할 수 없음 (깊이 1 제한)

### 병렬 실행 및 백그라운드 처리

- `run_in_background: true`로 비동기 실행. `TaskOutput`으로 나중에 결과 수집
- 여러 서브에이전트를 동시 spawn하여 독립 태스크 병렬 처리
- **제약**: 같은 파일을 건드리는 태스크는 병렬 충돌 위험

### 격리 메커니즘

- **격리된 git worktree**에서 서브에이전트 실행
- 토큰 추적, fail-fast, `SubagentStart`/`SubagentStop` 훅 제공
- `resume` 파라미터로 이전 히스토리 포함 재개 가능

> **실행 연결**: Claude Code의 아키텍처는 "오케스트레이터 + 격리된 워커" 패턴으로, 프레임워크 선택 시 이 패턴을 지원하는지가 중요한 기준이 된다. LangGraph의 서브그래프, CrewAI의 Crew, AutoGen의 GroupChat이 각각 이 패턴의 변형이다.

---

## 10. 자체 구현 vs 프레임워크 사용

### 자체 구현 (순수 Python/TypeScript)

**접근 방식**: OpenAI-compatible API 클라이언트 + asyncio/이벤트 루프 + 상태 관리 직접 구현

```python
class Agent:
    def __init__(self, name, tools, model_config):
        self.name = name
        self.tools = tools
        self.client = AsyncOpenAI(base_url=model_config["base_url"])

    async def execute(self, task):
        # LLM 호출 + 도구 실행 루프
        response = await self.client.chat.completions.create(...)
        return self.process_tool_calls(response)

class Orchestrator:
    def __init__(self):
        self.agents = {}
        self.state = {}

    async def run(self, tasks):
        results = await asyncio.gather(*[
            self.agents[t["agent"]].execute(t) for t in tasks
        ])
        return self.integrate(results)
```

### 비교 분석

| 항목 | 자체 구현 | 프레임워크 사용 |
|------|----------|--------------|
| **유연성** | 최대. 모든 패턴 자유 구현 | 프레임워크 패턴에 제약 |
| **개발 속도** | 느림 (3-18개월 for 프로덕션급) | 빠름 (수일-수주) |
| **유지보수** | 모든 책임이 팀에 | 커뮤니티/기업 지원 |
| **장애 처리** | 직접 구현 (40% 실패가 상태 관리 이슈) | 체크포인팅, 재시도 내장 (LangGraph) |
| **관측성** | 직접 구현 | LangSmith, Langfuse 등 통합 |
| **추상화 오버헤드** | 없음 | 있음 (디버깅 시 레이어 탐색 필요) |
| **벤더 종속** | 없음 | 프레임워크별 종속 |

### 자체 구현이 적합한 경우

1. **극도로 특수한 오케스트레이션 패턴**: 기존 프레임워크가 지원하지 않는 고유 통신/상태 패턴
2. **최소 의존성 요구**: 보안 감사 등으로 외부 라이브러리 최소화 필요
3. **이미 충분한 인프라 보유**: 관측성, 상태 관리, 재시도 로직이 이미 구축된 환경
4. **단순 오케스트레이션**: 2-3개 에이전트의 선형 파이프라인 수준

### 프레임워크가 적합한 경우

1. **복잡한 워크플로우**: 조건부 분기, 루프, 병렬 실행이 필요한 경우
2. **프로덕션 안정성**: 체크포인팅, 장애 복구, 관측성이 필요한 경우
3. **빠른 반복**: 프로토타입을 빠르게 만들고 검증해야 하는 경우
4. **팀 규모**: 여러 개발자가 공통 패턴으로 협업해야 하는 경우

> **문제 재정의**: "어떤 프레임워크를 쓸까"보다 더 적절한 질문은 "오케스트레이션의 어떤 부분을 프레임워크에 맡기고 어떤 부분을 직접 구현할 것인가"이다. 하이브리드 접근이 실무에서 가장 흔하다.

---

## 11. 의사결정 가이드

### Qwen3-235B-A22B 자체 호스팅 환경에서의 권장 사항

**전제 조건 검증**:
- Qwen3-235B-A22B는 OpenAI-compatible API + function calling + structured output을 지원한다 ✅ ([출처](https://blog.galaxy.ai/model/qwen3-235b-a22b))
- vLLM/SGLang 등으로 서빙 시 OpenAI-compatible 엔드포인트 자동 제공 ✅
- 모든 조사 프레임워크가 OpenAI-compatible API를 지원한다 ✅
- 따라서 **LLM 호환성은 차별화 요인이 아님**. 결정은 아키텍처 적합성에 의존해야 한다.
- **Qwen3 고유 고려사항**: MoE 아키텍처(235B 전체, 22B 활성)로 추론 비용 효율적이나, thinking mode(CoT) 활성화 시 추론 토큰이 대폭 증가하므로 멀티에이전트 토큰 비용 계산에 반영 필요

### 상황별 권장

| 상황 | 1순위 | 2순위 | 이유 |
|------|-------|-------|------|
| **복잡한 멀티스텝 리서치 파이프라인** | LangGraph | AutoGen | 상태 관리, 체크포인팅, 조건부 분기 |
| **빠른 프로토타이핑** | CrewAI | smolagents | 최소 코드, 직관적 역할 설계 |
| **코드 생성/리뷰 워크플로우** | AutoGen | LangGraph | 에이전트 토론/비평 패턴 자연스러움 |
| **TypeScript 웹 앱 통합** | Mastra | OpenAI Agents SDK (JS) | TS 네이티브, 워크플로우 내장 |
| **오픈소스 LLM 최적화** | smolagents | CrewAI | HuggingFace 생태계, 코드 실행 최적화 |
| **경량 에이전트 핸드오프** | OpenAI Agents SDK | LangGraph | 최소 보일러플레이트, 핸드오프 패턴 |
| **Claude Code 패턴 재현** | LangGraph (서브그래프) | 자체 구현 | 오케스트레이터-워커 + 컨텍스트 격리 |

### 역방향 의사결정 가이드

- **"토큰 비용이 중요하다"** → AutoGen 회피. LangGraph 또는 smolagents 선호 (코드 실행으로 LLM 호출 최소화)
- **"개발 속도가 품질보다 중요하다"** → CrewAI 선택
- **"장기 실행 워크플로우의 안정성이 핵심이다"** → LangGraph 필수 (체크포인팅)
- **"팀이 TypeScript만 쓴다"** → Mastra 또는 OpenAI Agents SDK JS
- **"프레임워크 의존성을 최소화하고 싶다"** → OpenAI Agents SDK (최소 추상화) 또는 자체 구현

---

## 12. 관점 확장 및 문제 재정의

### 인접 질문 (결론을 바꿀 수 있는 숨은 변수)

1. **Function Calling 품질**: 프레임워크 선택보다 자체 호스팅 모델의 function calling 정확도가 더 큰 영향을 미칠 수 있다. Qwen3-235B-A22B는 function calling에서 우수한 성능을 보이며 Qwen-Agent 활용이 권장되지만, 복잡한 도구 스키마(예: 중첩 객체, 다중 도구 동시 호출)에서의 안정성은 별도 벤치마크가 필요하다. 또한 MoE(Mixture of Experts) 아키텍처 특성상 활성 파라미터가 22B에 불과하므로, 동시에 복잡한 function calling을 처리하는 정밀도가 dense 모델(예: 70B+)과 동일한지 검증이 필요하다.

2. **컨텍스트 윈도우 전략**: Qwen3-235B-A22B의 컨텍스트 윈도우는 최대 131,072 토큰(128K). 멀티에이전트에서 컨텍스트를 어떻게 분할/공유할지가 프레임워크 선택만큼 중요하다. 에이전트 수를 늘리면 각 에이전트의 유효 컨텍스트가 줄어드는 트레이드오프가 있다. MoE 모델의 특성상 긴 컨텍스트에서의 추론 품질 저하 패턴이 dense 모델과 다를 수 있으므로, 운영 중 컨텍스트 길이별 품질 모니터링이 필요하다.

### 문제 재정의

원래 질문 "어떤 멀티에이전트 프레임워크를 선택할까"보다 더 적절한 핵심 질문:

> **"자체 호스팅 LLM의 function calling 신뢰성과 컨텍스트 윈도우 제약 하에서, 오케스트레이션의 어떤 부분을 프레임워크에 위임하고 어떤 부분을 직접 제어해야 최적의 품질/비용 균형을 달성할 수 있는가?"**

---

## 13. 출처

### 종합 비교 자료
- Langfuse Blog, "Open-Source AI Agent Frameworks: Which One Is Right for You?" (2025-03-19): https://langfuse.com/blog/2025-03-19-ai-agent-comparison
- Composio, "OpenAI Agents SDK vs LangGraph vs Autogen vs CrewAI" (2025-03-21): https://composio.dev/content/openai-agents-sdk-vs-langgraph-vs-autogen-vs-crewai
- Agentically.sh, "AI Agentic Frameworks 2025 - Complete Guide & Comparison": https://www.agentically.sh/ai-agentic-frameworks/
- GuruSup, "Best Multi-Agent Frameworks in 2026": https://gurusup.com/blog/best-multi-agent-frameworks-2026
- Turing, "A Detailed Comparison of Top 6 AI Agent Frameworks in 2026": https://www.turing.com/resources/ai-agent-frameworks

### OpenAI Agents SDK 자체 호스팅
- OpenAI Agents SDK 공식 문서 - Models: https://openai.github.io/openai-agents-python/models/
- GetStream, "How To Run OpenAI Agents SDK Locally With 100+ LLMs": https://getstream.io/blog/local-openai-agents/
- OpenAI, "New tools for building agents": https://openai.com/index/new-tools-for-building-agents/

### AutoGen / AG2
- Galileo, "AutoGen vs. CrewAI vs. LangGraph vs. OpenAI Multi-Agents Framework": https://galileo.ai/blog/autogen-vs-crewai-vs-langgraph-vs-openai-agents-framework
- Sparkco AI, "Deep Dive into AutoGen Multi-Agent Patterns 2025": https://sparkco.ai/blog/deep-dive-into-autogen-multi-agent-patterns-2025
- GettingStarted.ai, "AutoGen 0.4 Tutorial": https://www.gettingstarted.ai/autogen-multi-agent-workflow-tutorial/
- AG2 공식 문서 - Group Chat: https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/introducing-group-chat/

### smolagents
- HuggingFace, "Multi-Agent Systems (smolagents)": https://huggingface.co/learn/agents-course/unit2/smolagents/multi_agent_systems
- AWS Blog, "Agentic AI with smolagents on AWS": https://aws.amazon.com/blogs/machine-learning/agentic-ai-with-multi-model-framework-using-hugging-face-smolagents-on-aws/
- GitHub, "smolagents-guide": https://github.com/ALucek/smolagents-guide

### Mastra
- Mastra 공식 사이트: https://mastra.ai
- Mastra 공식 문서: https://mastra.ai/docs
- Firecrawl, "Mastra Tutorial: How to Build AI Agents in TypeScript": https://www.firecrawl.dev/blog/mastra-tutorial
- GitHub mastra-ai/mastra: https://github.com/mastra-ai/mastra

### Claude Code 아키텍처
- ksred, "Claude Code Agents & Subagents: What They Actually Unlock": https://www.ksred.com/claude-code-agents-and-subagents-what-they-actually-unlock/
- Anthropic 공식 문서 - Subagents in the SDK: https://platform.claude.com/docs/en/agent-sdk/subagents
- TowardsAI, "Subagents in Agent Coding": https://pub.towardsai.net/subagents-in-agent-coding-what-they-are-why-you-need-them-and-how-they-differ-in-cursor-vs-1c81e4f32b8d
- ClaudeFast, "Sub-Agent Best Practices": https://claudefa.st/blog/guide/agents/sub-agent-best-practices

### 자체 구현 관련
- OnAbout AI, "Multi-Agent AI Orchestration: Enterprise Strategy for 2025-2026": https://www.onabout.ai/p/mastering-multi-agent-orchestration-architectures-patterns-roi-benchmarks-for-2025-2026
- TopTenAIAgents UK, "LangGraph vs CrewAI vs AutoGen: Multi-Agent Frameworks for UK": https://toptenaiagents.co.uk/blog/langgraph-crewai-autogen-multi-agent-frameworks-uk-2026.html
- HackerNoon, "The Best AI Agent Frameworks for 2026": https://hackernoon.com/the-best-ai-agent-frameworks-for-2026-ranked-by-someone-whos-shipped-with-all-of-them
