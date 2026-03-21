# Qwen3-235B-A22B 멀티에이전트 오케스트레이션 종합 보고서

> 종합 보고서 | 2026-03-20 기반: R1(모델 성능), R2(프레임워크 비교), R3(구현 아키텍처), Critic Review

---

## Executive Summary

회사가 자체 서빙하는 **Qwen3-235B-A22B**(Alibaba Cloud, MoE 235B/22B active)를 Claude Code 스타일의 멀티에이전트 시스템으로 확장하는 것은 **기술적으로 가능하나, 핵심 전제의 검증이 선행되어야 한다**.

**3줄 요약:**

1. Qwen3-235B-A22B는 function calling, structured output, MCP를 공식 지원하며 비용 효율이 뛰어나지만, 멀티에이전트 환경에서의 프로덕션 안정성은 미검증 상태다
2. 구현 방법은 충분하다 — 자체 구현(MVP) → LangGraph(프로덕션) 경로가 가장 현실적이며, 핵심은 Orchestrator + 독립 컨텍스트 Agent 패턴이다
3. **"바로 구현"보다 "먼저 검증"이 올바른 순서다** — function calling 안정성과 instruction following 능력의 실제 벤치마크가 프로젝트 성패를 결정한다

---

## 1. 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치도 | 확신도 | 검증 필요 |
| --- | --- | --- | --- | --- |
| Qwen3 LiveCodeBench 65.9% (오픈소스 최상위) | LiveCodeBench 리더보드 | 중 (알고리즘 코딩 ≠ 에이전트 능력) | 높음 | 아니오 |
| SWE-bench Pro 21.4% (Claude 대비 절반) | SEAL 리더보드 | **높음** (실제 SW엔지니어링) | 높음 | 아니오 |
| Function calling / Structured output 공식 지원 | Qwen 공식 문서, HuggingFace | 높음 | 높음 | **예 (프로덕션 안정성)** |
| IFBench 36.6% (Instruction Following) | DesignForOnline | **높음** (에이전트 핵심 능력) | 중 | **예 (멀티에이전트 시나리오)** |
| 비용 81% 저렴 (vs Claude API) | SiliconFlow, Together AI | 낮음 (API 가격 ≠ 자체 호스팅 TCO) | 낮음 | **예 (GPU 인프라 TCO)** |
| 모든 주요 프레임워크가 OpenAI-compatible API 지원 | 각 프레임워크 문서 | 높음 | 높음 | 아니오 |
| Thinking 모드 토큰 2\~5배 증가 | 출처 없음 (R1/R3 추정치 상충) | 불명 | **낮음** | **예 (실측 필요)** |
| MVP 1\~2주 구현 가능 | R3 추정 | 해당없음 | 낮음 | — |

> **Critic 반영**: R1이 "강력 추천"한 부분은 프로덕션 검증 부재를 감안하여 "조건부 추천"으로 교정. 비용 비교는 자체 호스팅 TCO를 별도 분리.

---

## 2. 모델 평가: Qwen3-235B-A22B

### 강점

- **코딩**: LiveCodeBench Pass@1 65.9% — Claude Sonnet 4(47.1%)보다 우수
- **비용 효율**: MoE 22B active로 235B급 지식 용량 대비 추론 비용 최소
- **유연성**: Thinking/Non-Thinking 하이브리드 모드로 역할별 모드 전환 가능
- **생태계**: Function calling, Structured output, MCP 공식 지원. Qwen-Agent 프레임워크 제공
- **라이선스**: Apache 2.0, 상업적 사용 가능

### 약점 (멀티에이전트 관점에서 중요도 순)

1. **Instruction Following 중위권** — IFBench 36.6%. 복잡한 시스템 프롬프트를 일관되게 따를 수 있는지 미검증. Claude Code는 높은 IF 능력의 Claude 모델에 최적화된 설계이므로, 동일 패턴 적용 시 실패 가능성 존재
2. **실제 SW엔지니어링 격차** — SWE-bench Pro 21.4% (Claude Opus 4.5: 45.9%). 복잡한 코드 수정 에이전트로는 한계
3. **프로덕션 안정성 미검증** — 대규모 멀티에이전트 배포 사례 없음. Tool calling 안정성 데이터 부재
4. **VRAM 요구** — FP16 기준 \~470GB. 자체 호스팅 시 고사양 GPU 클러스터 필수

### 역할별 적합도 (Critic 교정 반영)

| 에이전트 역할 | 적합도 | 근거 |
| --- | --- | --- |
| Researcher (자료 조사) | **조건부 추천** | 비용 효율적, 도구 의존도 낮음. 단, IF 능력 검증 후 |
| Synthesizer (결과 통합) | **조건부 추천** | 긴 컨텍스트, 다국어. 요약 품질 벤치마크 필요 |
| Code Generator | 제한적 추천 | LiveCodeBench 우수하나 SWE-bench Pro 약점 |
| 메인 Orchestrator | **주의 필요** | IF 36.6%로 복잡한 분배 지시 준수 불확실 |
| Critic / Verifier | **주의 필요** | Thinking 모드로 보강 가능하나 편향 데이터 없음 |

---

## 3. 구현 아키텍처: 핵심 설계

### 3.1 아키텍처 패턴

Claude Code와 동일한 **Orchestrator-Worker 패턴**을 채택하되, Qwen3의 제약을 반영한다:

```
사용자 → Main Orchestrator (Qwen3 + thinking mode)
              │
              ├─ Sub-Agent 1 (독립 컨텍스트, non-thinking, 역할 특화)
              ├─ Sub-Agent 2 (독립 컨텍스트, non-thinking, 역할 특화)
              └─ Sub-Agent 3 (독립 컨텍스트, non-thinking, 역할 특화)
              │
         asyncio.gather (병렬 실행)
              │
         결과 통합 → 사용자 응답
```

핵심 원칙:

- 각 서브에이전트 = **독립 API 호출 세션** (별도 system prompt + messages + tools)
- 서브에이전트는 깊이 1 제한 (서브의 서브 없음)
- 메인만 thinking mode, 서브는 non-thinking으로 비용/속도 최적화
- 서브에이전트 결과는 핵심만 추출하여 메인 컨텍스트에 삽입

### 3.2 핵심 컴포넌트 (3개)

1. **Agent 클래스**: 독립된 API 세션 + tool-use 루프. `system_prompt`, `messages`, `tools`를 가짐
2. **Orchestrator 클래스**: 태스크 분해 → 서브에이전트 병렬 실행(`asyncio.gather`) → 결과 통합
3. **ToolRegistry**: 중앙 도구 관리. 에이전트별 필요한 도구만 할당

> 구체적 코드는 `03-implementation-architecture.md` 섹션 4.3 참조

### 3.3 Qwen3 특화 설정

```bash
# vLLM 서빙
vllm serve Qwen/Qwen3-235B-A22B \
  --enable-auto-tool-choice \
  --tool-call-parser hermes \
  --reasoning-parser deepseek_r1 \
  --max-num-seqs 16          # 동시 에이전트 수 제한
```

---

## 4. 프레임워크 선택 가이드

### 상충점 해결

R2는 프레임워크 사용을, R3는 자체 구현을 먼저 제시했다. **Critic 검증 + 통합 판단**:

| 조건 | 권장 접근 | 이유 |
| --- | --- | --- |
| 1\~2명 개발자, 빠른 PoC 필요 | **자체 구현 (MVP)** | 의존성 최소, Qwen3 직접 제어, 안정성 검증에 집중 가능 |
| 3+ 명 팀, 복잡한 워크플로우 | **LangGraph** | 상태 관리, 체크포인팅, 관측성 내장 |
| TypeScript 팀 | **Mastra** 또는 **OpenAI Agents SDK** | TS 네이티브, 웹 앱 통합 용이 |
| 가장 빠른 프로토타이핑 | **CrewAI** | 20줄 미만으로 멀티에이전트 구성 가능 |

### 공통 결론

**LLM 호환성은 차별화 요인이 아니다** — 6개 프레임워크 모두 OpenAI-compatible API를 지원하며 Qwen3과 호환된다. 결정은 아키텍처 적합성과 팀 역량에 의존해야 한다.

### 권장 경로

```
Phase 1: 자체 구현 MVP (검증 단계)
  └─ Qwen3 function calling 안정성 확인
  └─ 단일 에이전트 vs 멀티에이전트 비교 실험
  └─ Thinking 모드 토큰 오버헤드 실측

Phase 2: 프레임워크 마이그레이션 (확장 단계)
  └─ 검증 결과에 따라 LangGraph 또는 현 구조 유지 판단
  └─ 모니터링(LangSmith/Langfuse), 체크포인팅 추가

Phase 3: 프로덕션 (운영 단계)
  └─ Rate limiting, 보안(샌드박싱), 메트릭
  └─ 모델 라우팅(복잡 태스크→235B, 단순→소형 모델)
```

---

## 5. 상충점 해결 테이블

| 상충 항목 | R1 주장 | R3 주장 | Critic 지적 | **통합 판단** |
| --- | --- | --- | --- | --- |
| Thinking 모드 토큰 오버헤드 | 2\~5배 | 2\~3배 | 둘 다 출처 없음 | **실측 필요. 계획 시 3배로 가정하되 반드시 검증** |
| Function calling 안정성 | "에이전트 도구 사용에 강점" (긍정적) | "GPT-4 대비 파싱 오류 빈번할 수 있음" (부정적) | 지원 여부 ≠ 프로덕션 안정성 | **"지원됨"은 사실. "안정적"은 미검증. PoC에서 실측 필수** |
| 자체 구현 vs 프레임워크 | — | MVP는 자체 구현 추천 | 프레임워크의 엣지케이스 처리 가치 | **초기 검증은 자체 구현, 확장 시 프레임워크 (팀 규모/타임라인 따라)** |

---

## 6. 누락 관점 보완 (Critic 반영)

### 6.1 자체 호스팅 TCO (비용의 실체)

R1이 "81% 저렴"이라 했으나 이는 **서드파티 API 가격 기준**이다. 자체 호스팅 시:

| 항목 | 월 비용 (추정) | 비고 |
| --- | --- | --- |
| 8xA100 80GB (렌탈) | $15,000\~40,000 | 클라우드 제공자별 상이 |
| 4xH100 80GB (렌탈) | $20,000\~50,000 | 더 빠르지만 비쌈 |
| 운영 인력 | 별도 | GPU 인프라 관리 |
| 전력/냉각 (온프레미스) | 별도 | 자체 서버 시 |

> **판단**: 이미 GPU 인프라를 보유/운영 중이라면 추가 비용은 미미하다. 그러나 **멀티에이전트를 위해 새로** GPU를 확보해야 한다면, Claude API 직접 사용이 더 경제적일 수 있다.

### 6.2 핵심 실패 모드 (R3 보완)

| 실패 모드 | 발생 조건 | 대응 전략 |
| --- | --- | --- |
| 무한 도구 호출 루프 | 모델이 도구 결과를 이해 못함 | `max_turns` 제한 + 반복 패턴 탐지 |
| Hallucinated Tool Call | 존재하지 않는 도구 호출 | Tool Registry 검증 + 친절한 에러 반환 |
| 결과 전달 시 핵심 유실 | 메인 컨텍스트 삽입 시 truncation | 요약 대신 구조화된 핵심 추출, 임계 정보 태깅 |
| Thinking + Tool Call 충돌 | `<think>` 블록과 tool call 파싱 혼재 | vLLM `reasoning-parser` 설정 + 출력 후처리 |
| 시스템 프롬프트 무시 | IF 능력 한계 (IFBench 36.6%) | 프롬프트 단순화, 핵심 지시 반복, 출력 검증 레이어 |

### 6.3 단일 에이전트 대비 개선 검증

멀티에이전트가 정말 나은지 확인하기 위한 실험 설계:

1. 동일 태스크를 (a) 단일 에이전트 + 도구, (b) 멀티에이전트로 실행
2. 비교 지표: 결과 품질(사람 평가), 총 토큰 소비, 완료 시간, 실패율
3. 최소 10개 태스크, 3회 반복으로 통계적 유의성 확보
4. 태스크 복잡도별 분기점 도출: "이 수준 이상이면 멀티에이전트가 유리"

---

## 7. 역방향 의사결정 가이드

| 검증 결과 | 권장 전략 |
| --- | --- |
| Function calling 안정적 + IF 충분 | → 멀티에이전트 전면 도입, LangGraph 마이그레이션 추진 |
| Function calling 안정적 + IF 부족 | → 서브에이전트 프롬프트를 극도로 단순화, 메인 오케스트레이터에 출력 검증 레이어 추가 |
| Function calling 불안정 | → 멀티에이전트 보류. 단일 에이전트 + 도구 확장 전략으로 전환. 또는 Qwen3-Coder-480B/Instruct-2507로 모델 교체 검토 |
| 토큰 비용이 예상보다 높음 | → 서브에이전트에 엄격한 토큰 예산 할당 + non-thinking 강제 + 모델 라우팅(단순 태스크→소형 모델) |
| 동시 요청 처리에 병목 | → `max_num_seqs` 조정, 에이전트 수 제한, 서브에이전트 순차 실행으로 폴백 |

---

## 8. 예상 밖 핵심 발견

1. **Qwen3 패밀리 내 역할 분리가 유효할 수 있다** — Qwen3-Coder-480B-A35B는 SWE-bench Pro 38.7%로 235B(21.4%)보다 훨씬 우수하다. 코딩 에이전트에는 Coder 모델을, 리서치/요약에는 235B를 쓰는 **모델 라우팅** 전략이 비용-품질 최적화에 효과적일 수 있다.

2. **"Claude Code처럼"보다 "하이브리드 접근"이 더 현실적이다** — 모든 태스크에 멀티에이전트를 적용하는 것이 아니라, 태스크 복잡도에 따라 단일/멀티를 동적으로 선택하는 구조가 자체 호스팅 환경의 제약(동시성, IF 능력, function calling)에 더 적합하다.

3. **Instruct-2507 버전이 에이전트용으로 더 적합하다** — 원본 대비 instruction following, 도구 사용이 강화되었고 컨텍스트가 262K로 확장되었다. 회사에서 모델 선택이 가능하다면 이 버전을 권장한다.

---

## 9. 후속 탐색 질문

1. **Qwen3-235B-A22B의 function calling 정확도는 실제로 어느 수준인가?** — 복잡한 도구 스키마(중첩 객체, 다중 도구 동시 호출)에서의 성공률을 직접 측정해야 한다.

2. **모델 라우팅의 실질적 효과는?** — 235B(범용) + Coder-480B(코딩) + 소형 모델(단순 태스크)을 혼합 사용할 때의 비용-품질 트레이드오프 실측이 필요하다.

3. **프롬프트 엔지니어링으로 IFBench 36.6%의 한계를 얼마나 보완할 수 있는가?** — Claude Code 스타일의 복잡한 시스템 프롬프트 대신 단순화된 지시문으로 에이전트 성능을 유지할 수 있는지 검증이 필요하다.

---

## 10. 즉시 실행 가능한 액션 플랜

### Step 1: 검증 (1주)

```
□ Qwen3 function calling 안정성 테스트 (10+ 도구 스키마, 성공률 측정)
□ Thinking 모드 토큰 오버헤드 실측 (5개 태스크, thinking vs non-thinking 비교)
□ 시스템 프롬프트 준수율 테스트 (복잡한 역할 지시 10개, 준수율 측정)
```

### Step 2: MVP (2\~4주, 검증 결과에 따라)

```
□ Agent + Orchestrator + ToolRegistry 구현 (R3 코드 기반)
□ 기본 도구 3종 (파일 읽기, 웹 검색, 코드 실행)
□ 단일 에이전트 vs 멀티에이전트 비교 실험
```

### Step 3: 확장 판단

```
□ 검증/실험 결과 리뷰
□ 전면 멀티에이전트 / 하이브리드 / 단일+도구 중 전략 결정
□ 프레임워크 도입 여부 결정
```

---

## 출처 (주요)

- [Qwen3 공식 블로그](https://qwenlm.github.io/blog/qwen3/)
- [LiveCodeBench Leaderboard](https://livecodebench.github.io/leaderboard.html)
- [SWE-bench Pro / SEAL Leaderboard](https://www.morphllm.com/swe-bench-pro)
- [Qwen Function Calling Docs](https://qwen.readthedocs.io/en/latest/framework/function_call.html)
- [HuggingFace Qwen3-235B-A22B](https://huggingface.co/Qwen/Qwen3-235B-A22B)
- [Langfuse Blog - AI Agent Framework Comparison](https://langfuse.com/blog/2025-03-19-ai-agent-comparison)
- [Anthropic - Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

> 전체 출처 목록은 각 상세 보고서(01\~03, 99) 참조