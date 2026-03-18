# LLM + build123d 코드 생성 현황 리서치

> 작성일: 2026-03-18
> 목적: 코딩 에이전트로 build123d 3D 모델을 만드는 방법에 대한 현황 조사

---

## 목차
1. [현존하는 LLM + build123d/CadQuery 프로젝트들](#1-현존하는-llm--build123dcadquery-프로젝트들)
2. [코딩 에이전트의 3D CAD 코드 생성 능력](#2-코딩-에이전트의-3d-cad-코드-생성-능력)
3. [시각 피드백 루프 메커니즘](#3-시각-피드백-루프-메커니즘)
4. [프롬프트 엔지니어링 / Skill Card 전략](#4-프롬프트-엔지니어링--skill-card-전략)
5. [도구/플러그인 생태계](#5-도구플러그인-생태계)
6. [핵심 결론 및 권고](#6-핵심-결론-및-권고)

---

## 1. 현존하는 LLM + build123d/CadQuery 프로젝트들

### 1.1 VibeCAD (rawwerks)

Claude Code용 build123d Skill 라이브러리. neThing.xyz가 후원한다.

- **GitHub**: rawwerks/VibeCAD
- **동작 방식**: Claude Code의 Skill/Plugin 시스템을 활용. `SKILL.md` 파일에 build123d API 지식, 코드 패턴, "하지 말 것" 규칙을 정의하여 Claude가 build123d 코드를 생성할 때 참조하도록 한다.
- **설치**: `/plugin install build123d@vibecad`
- **제공 Skill**:
  - `build123d:build123d` — 3D 솔리드, boolean 연산, 파라메트릭 어셈블리 생성
  - `build123d:model-compare` — 모델 비교
  - `render-glb:render-glb` — GLB → PNG 렌더링 (시각 검증용)
  - `gltf-transform:gltf-transform` — GLB/glTF 최적화
- **핵심 전략**: uv 패키지 매니저로 zero-setup 환경 구성. bd_warehouse (기어, 나사, 베어링), py_gearworks 등 전문 라이브러리 활용을 Skill에 포함.
- **한계**: 시각 피드백 루프가 `render-glb`을 통한 수동 확인에 의존. 자동화된 형상 검증은 미구현.

**출처**: [MCP Market](https://mcpmarket.com/tools/skills/build123d-cad-modeling), [GitHub rawwerks/VibeCAD](https://github.com/rawwerks/VibeCAD)

### 1.2 Henqo — AI-Native CAD System

build123d 기반 AI CAD 시스템을 구축 중인 스타트업. 스스로를 "Claude Code for CAD"라 정의한다.

- **핵심 발견 — Skill Card 접근법**:
  - LLM은 system prompt보다 user message에 훨씬 더 주의를 기울인다. 라이브러리 사용 지침을 system prompt에만 넣으면 무시된다.
  - **해결**: 라이브러리별 가이드를 user message에 직접 주입. 예: 사용자가 "기어를 만들어"라 하면, py_gearworks의 구체적 API와 코드 템플릿이 user message에 삽입됨.
  - **Skill Card**: 추상적 문서가 아닌, "build123d에서 이것은 정확히 이렇게 생겼다"는 구체적 코드 템플릿. 모델이 pattern-match할 수 있는 형태.
- **핵심 문제 — LLM이 전문 라이브러리를 무시함**:
  - LLM은 py_gearworks 대신 involute 기어 프로파일을 처음부터 수학적으로 구현하려 함. "기술적으로는 맞지만 완전히 불필요."
  - 같은 문제가 베어링(bd_warehouse 대신 직접 구현)에서도 발생.
  - **원인**: "모델이 너무 많이 알아서, 역설적으로 이미 인간이 만든 도구 대신 first-principles 해법을 기본 선택."
  - **해결**: 더 나은 모델이 아니라 더 나은 **scaffolding**. 모델이 실제로 보는 곳에 올바른 정보를 배치.
- **현재 상태**: 42개 검증된 패턴(spur gear, living hinge, NURBS 유기적 형상 등)의 Skill Card 보유. "fuzzy matching for per-part mesh extraction" 기능 출시.
- **미해결 과제**: "AI는 개별 부품을 생성할 수 있지만, 그 부품은 공간에 떠 있다. 어셈블리 컨텍스트(하우징과의 끼워맞춤, 0.3mm 클리어런스 등)를 이해하지 못함."

**출처**: [LinkedIn — Henqo](https://www.linkedin.com/posts/henqo_every-engineer-i-talk-to-eventually-says-activity-7428472621002006529-QbVV), [LinkedIn — Skill Cards](https://www.linkedin.com/posts/henqo_last-week-we-shipped-a-feature-that-sounds-activity-7437543687997456384-_Xst)

### 1.3 Henning Klinke — AI-Native CAD Client

build123d 기반으로 완전히 "vibe coded"된 AI-Native CAD 클라이언트.

- **워크플로우**: Gemini 3 Flash가 UI 스크린샷 + 기존 build123d 코드를 읽고, 1976년 보트 설계서의 공간 데이터와 교차 참조하여 새 build123d 코드를 생성.
- **핵심 통찰 — "코드가 진실의 원천"**: UI에서 잘못 클릭하여 측정값이 틀렸을 때, AI는 잘못된 GUI 값을 무시하고 자신이 생성한 코드에서 직접 정확한 치수를 추출함. "코드를 생성했기 때문에 기하학을 본질적으로 이해한다."
- **의의**: 멀티에이전트 설정에서 에이전트가 결정론적이고 검토 가능한 무언가(코드)에 대해 추론할 때 훨씬 강력해진다는 증거.

**출처**: [LinkedIn — Henning Klinke](https://www.linkedin.com/posts/henning-klinke-0a784265_vibeengineering-cadascode-build123d-activity-7433050836626448385-Wkbz)

### 1.4 Text-to-CadQuery (arXiv:2505.06507)

LLM을 CadQuery 코드 생성에 fine-tune한 학술 연구.

- **방법**: Text2CAD 데이터셋의 minimal JSON 구조 → Gemini 2.0 Flash로 CadQuery 코드 변환 → 170K 개 CadQuery annotation 생성.
- **피드백 루프**: 코드 실행 실패 시 에러 메시지를 Gemini에 돌려 자동 수정. **실행 성공률이 53% → 85%로 상승**.
- **시각 검증**: 성공한 코드의 STL을 Blender로 렌더링 → ground truth와 나란히 비교하여 형상 일치 확인.
- **Fine-tuning 결과**: 6개 오픈소스 LLM fine-tune. 최고 모델 top-1 exact match **69.3%** (base 58.8%), Chamfer Distance 48.6% 감소.
- **핵심 발견**: "대부분의 오픈소스 모델(Gemma, Qwen, Mistral, Llama)은 CadQuery를 전혀 인식하지 못한다. 문법이나 의미를 이해하지 못하고 유효한 CadQuery를 생성하지 못함." → **fine-tuning 없이는 CadQuery 코드 생성이 대부분의 오픈소스 모델에서 불가능**.

**출처**: [arXiv:2505.06507](https://arxiv.org/abs/2505.06507), [HuggingFace Papers](https://huggingface.co/papers/2505.06507)

### 1.5 CADCodeVerify (ICLR 2025)

VLM(Vision-Language Model)이 3D 렌더링을 보고 CAD 코드를 교정하는 방법.

- **접근**: VLM에게 렌더링된 3D 이미지를 보여주고 검증 질문을 생성/답변하게 하여, 자연어 명세와의 편차를 교정. 반복적으로 수행.
- **벤치마크**: CADPrompt — 200개 자연어 프롬프트 + 전문가 주석 CAD 코드.
- **성과**: GPT-4에 적용 시 Point Cloud distance **7.30% 감소**, 컴파일 성공률 **5.0% 향상**.
- **메커니즘**: 코드 생성 → 렌더링 → VLM이 렌더링 분석 → 교정 지시 → 코드 수정 → 반복.
- **한계**: 개선폭이 극적이지는 않음. 검증 질문의 품질에 의존.

**출처**: [ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/81a934cd364e18ea6fdeaf57a93c17d4-Abstract-Conference.html), [GitHub Kamel773/CAD_Code_Generation](https://github.com/Kamel773/CAD_Code_Generation), [arXiv:2410.05340](https://arxiv.org/abs/2410.05340)

### 1.6 CAD-Coder (NeurIPS 2025)

CadQuery 스크립트 생성을 위한 SFT + RL 프레임워크.

- **핵심**: Qwen2.5-7B를 base로 사용. (1) SFT로 CadQuery 기본 문법 학습, (2) GRPO(Group Reward Policy Optimization)로 기하학적 정확도 강화.
- **데이터**: 110K text-CadQuery-3D model triplets + 1.5K CoT(Chain-of-Thought) 샘플.
- **보상 함수**: Chamfer Distance(기하학적 보상) + 포맷 보상.
- **의의**: RL이 CAD 코드 생성 품질을 크게 향상시킬 수 있음을 입증. 단순 SFT 대비 유의미한 개선.

**출처**: [NeurIPS 2025](https://neurips.cc/virtual/2025/poster/118098), [OpenReview](https://openreview.net/forum?id=QoiFdfZUJv)

### 1.7 CAD-MLLM

멀티모달(텍스트+이미지+포인트클라우드) → CAD 명령 시퀀스 생성.

- **방식**: MLLM(Multimodal LLM)에 LoRA fine-tuning. 텍스트/멀티뷰 이미지/포인트클라우드를 동시 입력으로 받아 CAD 명령 시퀀스 생성.
- **데이터**: Omni-CAD — 450K 인스턴스의 멀티모달 CAD 데이터셋 (최초).
- **한계**: 명령 시퀀스(DeepCAD 스타일)를 생성하지, CadQuery/build123d 코드를 직접 생성하지는 않음. 즉, extrude/sketch/circle 같은 추상 명령을 생성하며, 이를 실행하려면 별도 변환이 필요.
- **의의**: 멀티모달 조건부 CAD 생성의 가능성을 입증. 노이즈와 부분 데이터에 강건.

**출처**: [arXiv:2411.04954](https://arxiv.org/abs/2411.04954), [프로젝트 페이지](https://cad-mllm.github.io/)

### 1.8 CADDesigner

에이전트 기반 CAD 개념 설계 프레임워크.

- **구성**: LLM 기반 에이전트가 텍스트 설명 + 스케치를 입력으로 받아, 대화형으로 요구사항을 정제하고, CAD 모델링 코드를 생성.
- **핵심 기여**:
  - **Explicit Context Imperative Paradigm (ECIP)**: 개별 CAD 연산을 분리하고, 명시적 타입 주석 + LLM 친화적 에러 표현 + 자기 진화 능력으로 코드 생성 품질 향상.
  - **SketchPad Tool**: 컨텍스트 폭발 문제 해결을 위한 key-value 저장소. 이미지 경로, 참조 코드, 실행 결과 등을 저장.
  - **시각 피드백**: 생성 과정 중 시각 피드백을 활용하여 모델 충실도를 점진적으로 개선.
  - **지식 베이스**: 성공적 설계 사례를 구조화된 지식 베이스에 저장하여 지속적 개선.
- **지원 연산**: extrusion, revolution, fillet, chamfer, sweeping, lofting 등.

**출처**: [arXiv:2508.01031](https://arxiv.org/abs/2508.01031)

### 1.9 PartCAD

build123d 기반 부품 카탈로그 + AI 생성을 지원하는 패키지 매니저.

- **AI 생성 지원**: Google AI (Gemini), OpenAI (ChatGPT), Ollama 모델(Llama 3.1, DeepSeek-Coder-V2, CodeGemma, Code Llama 등)을 통해 CadQuery, build123d, OpenSCAD 스크립트를 자동 생성.
- **설정 예시**:
  ```yaml
  parts:
    my_part:
      type: ai-cadquery  # 또는 ai-build123d
      desc: "텍스트 설명"
  ```
- **핵심 가치**: 대규모 code-CAD 프로젝트의 모듈성. 부품을 개별 파일로 분리하고, 인터페이스/포트 시스템으로 어셈블리를 구성. build123d의 joint 시스템과 통합.
- **한계**: AI 생성은 개별 부품 수준. 어셈블리 AI 생성은 "in progress".

**출처**: [PartCAD GitHub](https://github.com/partcad/partcad), [PartCAD 문서](https://partcad.readthedocs.io/en/latest/configuration.html)

### 1.10 neThing.xyz

polySpectra가 만든 텍스트-to-3D CAD 플랫폼. VibeCAD를 후원.

- **방식**: 자연어 프롬프트 → AI가 코드 작성 → 3D CAD 모델 생성. LlamaIndex RAG를 활용하여 code-CAD 도메인 지식을 긴 프롬프트로 제공.
- **출력**: STL, GLTF(GLB), STEP 형식 내보내기.
- **특징**: AR 미리보기, 색상/재질 조정, 코드 직접 편집, polySpectra 통한 직접 3D 프린팅.
- **기술적 접근** (LlamaIndex 블로그 기준): "AI가 코딩할 수 있고, 코드로 CAD를 할 수 있다면, AI가 CAD를 할 수 없을 이유가 없다." RAG가 핵심 — 매우 긴 프롬프트가 필요하며, 이를 효율적으로 제공하기 위해 RAG 사용.

**출처**: [3D Printing Industry](https://3dprintingindustry.com/news/polyspectras-nething-xyz-democratizes-3d-printing-with-free-ai-powered-cad-software-228056/), [LlamaIndex Blog](https://www.llamaindex.ai/blog/unlocking-the-3rd-dimension-for-generative-ai-part-1)

### 1.11 FutureCAD (arXiv:2603.11831)

CadQuery 스크립트 생성 + B-Rep grounding 트랜스포머 결합.

- **방식**: LLM이 CadQuery 스크립트를 생성하되, B-Rep primitive 참조가 필요할 때 자연어 쿼리를 생성 → BRepGround 트랜스포머가 해당 기하학적 엔티티를 찾아줌.
- **학습**: SFT + RL. Claude-Sonnet-4.5를 baseline으로 사용.
- **의의**: LLM의 코드 생성 강점과 자연어 쿼리 능력을 결합하여 CadQuery 워크플로우에 자연스럽게 통합.

**출처**: [arXiv:2603.11831](https://arxiv.org/html/2603.11831v1)

### 1.12 LL3M (Large Language 3D Modelers)

멀티에이전트 LLM 시스템으로 Blender Python 스크립트를 생성하여 3D 에셋 제작.

- **에이전트 구성**: planning, RAG(BlenderRAG — Blender 문서), coding, debugging, refinement.
- **특징**: 커스텀 학습 없이 사전학습된 LLM만 활용. RAG로 Blender 문서를 검색하여 정확한 API 사용.

**출처**: [arXiv:2508.08228](https://arxiv.org/html/2508.08228v1)

---

## 2. 코딩 에이전트의 3D CAD 코드 생성 능력

### 2.1 build123d vs CadQuery — LLM 생성 비교

| 측면 | build123d | CadQuery |
|------|-----------|----------|
| **LLM 친화성** | `with` 블록 기반 Pythonic 패턴. Enum + type hint로 IDE/LLM 자동완성 지원. 변수 할당 자유로움 | Fluent API (메서드 체이닝). 상태 추적이 복잡. 람다/monkey patching 필요한 경우 있음 |
| **학습 데이터 양** | 상대적으로 새로움 (CadQuery 진화). 학습 데이터 적음 | 더 오래됨. Hackaday, 튜토리얼 등 공개 자료 더 많음. fine-tuning 연구도 CadQuery 중심 |
| **학술 연구** | 일부 논문에서 언급 (LL3M 등). 직접적 fine-tuning 연구는 아직 적음 | Text-to-CadQuery, CAD-Coder, FutureCAD 등 다수 논문 |
| **비전문 LLM 성능** | fine-tuning 없이는 API 오용 빈번. 그러나 Python 패턴이 자연스러워 기본 구조는 올바른 경우 많음 | "대부분의 오픈소스 모델은 CadQuery를 인식조차 못함" (Text-to-CadQuery) |
| **상용 LLM 성능** | GPT-4, Claude가 기본적 코드 생성 가능. "가끔 공간적으로 비일관적" | GPT-4o, Claude-3.5-Sonnet 벤치마크 존재 (BlenderLLM 비교) |

**핵심**: CadQuery가 학술 fine-tuning 연구에서 우세하나, build123d의 Pythonic API가 프롬프트 엔지니어링 기반(fine-tuning 없는) 접근에서는 더 유리할 수 있다. 두 라이브러리 모두 같은 OCP 래퍼를 사용하므로 상호 운용 가능.

### 2.2 LLM별 CAD 코드 생성 벤치마크

BlenderLLM 논문(Blender Python 기준)의 벤치마크:

| 모델 | CADBench-Sim Avg.↑ | Syntax Error↓ | CADBench-Wild Avg.↑ |
|------|---------------------|---------------|----------------------|
| BlenderLLM (fine-tuned) | **0.748** | **3.4%** | **0.664** |
| o1-Preview | 0.687 | 15.6% | 0.583 |
| GPT-4-Turbo | 0.589 | 18.2% | 0.515 |
| Claude-3.5-Sonnet | 0.593 | 15.6% | 0.489 |
| GPT-4o | 0.565 | 21.4% | 0.444 |

LLM 평가 (Cursor에서 OpenSCAD 기반, KerrickStaley):
- **Claude 4.6 Opus, Gemini 3.1 Pro**: 어느 정도 사용 가능한 CAD 모델 생성 가능. 그러나 "3D 모델이 종종 어떤 식으로든 부족하다."
- **o3, Gemini 2.5 Pro**: 추론(reasoning)이 특히 중요한 enabler. 최근 급격히 성능 향상.
- **핵심**: reasoning 모델이 CAD 코드 생성에 특히 강함. 공간 추론이 요구되기 때문.

### 2.3 흔한 실수 패턴

1. **API 오용**: 존재하지 않는 함수 호출, 파라미터 순서/이름 오류. 특히 build123d의 Algebra Mode와 Builder Mode 혼용.
2. **전문 라이브러리 무시**: py_gearworks, bd_warehouse 대신 first-principles 구현 (Henqo 사례).
3. **공간적 비일관성**: "spatially incoherent sometimes" — 부품 위치, 방향, 상대적 크기가 의도와 다름 (HN 커뮤니티 보고).
4. **엣지 선택 오류**: fillet/chamfer에서 올바른 엣지를 선택하지 못함. build123d의 `.edges().filter_by()` 패턴이 복잡.
5. **컨텍스트 손실**: 긴 코드에서 이전에 정의한 객체/평면의 참조를 잃어버림.
6. **어셈블리 무능력**: 개별 부품은 생성하지만, 부품 간 관계(끼워맞춤, 클리어런스, 공차)를 이해하지 못함.

### 2.4 복잡도별 성공률 (정성적 추정)

| 복잡도 | 설명 | 예시 | 성공 가능성 |
|--------|------|------|------------|
| **단순** | 기본 프리미티브 + boolean | Box with hole, cylinder with fillet | 높음 (80%+). Skill/RAG 없이도 가능 |
| **중간** | 파라메트릭 부품, 2D→3D 변환 | 브래킷, 인클로저, 힌지 | 중간 (50-70%). Skill Card/RAG 필요 |
| **복잡** | 멀티피처, 어셈블리, 전문 형상 | 기어, 베어링 하우징, 열교환기 | 낮음 (20-40%). 전문 라이브러리 + 반복적 수정 필수 |
| **고급** | 곡면, loft, sweep, 유기적 형상 | NURBS 기반 디자인, 터빈 블레이드 | 매우 낮음 (<20%). 인간 개입 필수 |

---

## 3. 시각 피드백 루프 메커니즘

### 3.1 코드 실행 오류 피드백 (가장 효과적)

- **방식**: traceback → LLM에 피드백 → 재생성.
- **효과**: Text-to-CadQuery에서 실행 성공률 53% → 85%로 상승. 가장 직접적이고 효과적인 피드백.
- **적용**: 모든 코딩 에이전트(Claude Code, Cursor 등)에서 기본적으로 지원 가능.

### 3.2 VLM 기반 시각 검증

**CADCodeVerify 접근**:
1. CAD 코드 생성 → 실행 → 3D 모델 렌더링
2. VLM에 렌더링 이미지 제시
3. VLM이 자연어 명세와 비교하여 검증 질문 생성/답변
4. 편차 발견 시 교정 지시 생성
5. 코드 수정 → 반복

**성과**: GPT-4 기준 Point Cloud distance 7.3% 감소, 성공률 5% 향상. 유의미하지만 극적이지는 않음.

### 3.3 스크린샷 기반 피드백 (실용적 접근)

**AI IDE (Bigreddazer 프로젝트)**:
- 렌더링된 3D 객체의 스크린샷을 캡처하여 AI에 전송.
- AI가 시각 정보를 활용하여 기하학 오류를 식별하고 수정.
- OpenSCAD와 build123d 모두 지원.

**ocp-viewer-mcp (dmilad)**:
- OCP CAD Viewer의 스크린샷을 캡처하는 MCP 서버.
- **Cursor, Claude Desktop에서 사용 가능**.
- `show(my_part)` → 뷰어에 모델 표시 → AI가 `capture_ocp_screenshot` 도구로 스크린샷 획득.
- 이를 통해 AI가 생성한 3D 모델을 "볼" 수 있음.

### 3.4 수치적 검증

- **Bounding box 확인**: 예상 크기와 실제 크기 비교.
- **체적(volume) 확인**: `part.volume`으로 예상 체적과 비교.
- **면 수(face count) 확인**: 예상되는 면의 개수와 비교.
- **Chamfer Distance**: 학술 연구에서 사용하는 표준 메트릭. 생성된 3D 모델과 ground truth 간의 거리.

### 3.5 사용자 자연어 피드백

가장 직관적이지만 가장 비효율적인 방법. "구멍이 관통되지 않았어", "이 모서리를 둥글게 해줘" 등.

### 3.6 Claude Code에서의 시각 피드백 가능성

- **ocp-viewer-mcp**: Claude Desktop에서 설정 가능. Claude Code에서는 MCP 서버로 추가 가능.
- **VibeCAD의 render-glb**: GLB → PNG 렌더링 후 Claude가 이미지를 볼 수 있음 (CLI에서는 한계, Claude Desktop에서 가능).
- **OCP CAD Viewer standalone 모드**: `python -m ocp_vscode`로 Flask 기반 웹서버 실행. 브라우저에서 접근 가능.
- **현실적 한계**: Claude Code CLI 환경에서는 이미지를 직접 볼 수 없음. MCP를 통한 스크린샷 캡처 + multimodal 입력이 필요.

---

## 4. 프롬프트 엔지니어링 / Skill Card 전략

### 4.1 Skill Card 패턴 (Henqo가 발견한 최적 패턴)

```
// Skill Card: Spur Gear (py_gearworks)
// 이 카드는 사용자가 기어를 요청할 때 user message에 주입됨

## 사용할 라이브러리
from py_gearworks import SpurGear

## 올바른 패턴
gear = SpurGear(module=2, teeth=20, width=10)
solid = gear.build()

## 하지 말 것
- involute 프로파일을 수학적으로 직접 계산하지 말 것
- 치형을 수동으로 그리지 말 것
- py_gearworks의 BevelGear과 SpurGear API 시그니처를 혼동하지 말 것
```

### 4.2 VibeCAD Skill 구조

```
plugins/
  build123d/
    skills/
      build123d/
        SKILL.md        # 핵심 API 지식, 코드 패턴, 규칙
        references/     # 추가 참조 문서
        scripts/        # 유틸리티 스크립트
```

SKILL.md에는 YAML frontmatter로 메타데이터 정의:
- 트리거 조건 (명시적: "build123d로 만들어줘" / 암묵적: 3D 모델링 맥락 감지)
- build123d의 두 모드 (Algebra Mode vs Builder Mode) 사용 지침
- 공통 연산 레퍼런스 (extrude, fillet, chamfer, boolean 등)

### 4.3 단계적 생성 전략

CADDesigner의 접근:
1. **요구사항 분석**: 대화형으로 설계 의도 파악
2. **2D 스케치 생성**: 먼저 프로파일 정의
3. **3D 변환**: extrude/revolve/loft
4. **피처 추가**: fillet, chamfer, 구멍 등
5. **시각 검증**: 각 단계에서 렌더링 확인
6. **지식 베이스 저장**: 성공적 패턴을 재사용

### 4.4 RAG 기반 접근 (neThing.xyz / LlamaIndex)

- build123d/CadQuery 문서 전체를 벡터 DB에 인덱싱
- 사용자 프롬프트에 따라 관련 API 문서, 예제 코드를 검색하여 프롬프트에 주입
- "매우 긴 프롬프트가 필요" → RAG로 효율적 제공

### 4.5 체크리스트 기반 자기 검증

효과적인 패턴:
- [ ] 모든 import가 올바른가?
- [ ] Algebra Mode와 Builder Mode가 혼용되지 않았는가?
- [ ] 모든 2D 스케치가 닫혀 있는가 (closed)?
- [ ] extrude 방향이 올바른가?
- [ ] boolean 연산 순서가 맞는가?
- [ ] fillet/chamfer 반경이 형상보다 크지 않은가?
- [ ] 최종 모델이 watertight solid인가?

### 4.6 "하지 말 것" 규칙 (Negative Instructions)

Henqo와 VibeCAD에서 공통적으로 발견된 패턴:
- involute 기어 수학을 직접 구현하지 말 것 → py_gearworks 사용
- deprecated API를 사용하지 말 것
- Builder Mode에서 `with` 블록 밖에서 연산하지 말 것
- `show()` 호출 전에 객체가 존재하는지 확인할 것
- 복잡한 sweep 경로를 한 번에 정의하지 말 것 → 단계적으로

---

## 5. 도구/플러그인 생태계

### 5.1 Claude Code 환경

| 도구 | 유형 | 설명 |
|------|------|------|
| **VibeCAD** | Claude Skill/Plugin | build123d Skill Card + render-glb + gltf-transform |
| **ocp-viewer-mcp** | MCP Server | OCP CAD Viewer 스크린샷 캡처 → AI에 시각 피드백 |
| **PartCAD** | Python 패키지 | build123d 부품 카탈로그 + AI 생성 |

### 5.2 Cursor / VS Code 환경

| 도구 | 유형 | 설명 |
|------|------|------|
| **OCP CAD Viewer** | VS Code Extension | CadQuery/build123d 모델을 VS Code 내에서 실시간 렌더링 |
| **ocp-viewer-mcp** | MCP Server | Cursor에서 AI가 OCP Viewer 스크린샷을 볼 수 있게 함 |
| **.cursorrules** | 설정 파일 | build123d API 지식을 Cursor에 주입 가능 |
| **lobehub Skill** | Skill Card | helmecke-dotfiles-build123d — build123d 개발 지침 |

### 5.3 독립 도구

| 도구 | 설명 |
|------|------|
| **Yet Another CAD Viewer** | 웹 기반 OCP 뷰어. 브라우저에서 build123d 모델 편집/공유 |
| **OCP.wasm** | WebAssembly로 build123d를 브라우저에서 실행 |
| **iteration3d** | build123d + Blender 기반 파라메트릭 3D 모델 생성 서비스 |
| **neThing.xyz** | 텍스트-to-3D CAD 플랫폼 (build123d 기반, VibeCAD 후원) |

### 5.4 GitHub Copilot의 build123d 코드 제안 품질

직접적 벤치마크는 발견되지 않았으나, 커뮤니티 보고에 따르면:
- "Copilot + GPT-4가 build123d Python 코드를 생성할 수 있다. 가끔 공간적으로 비일관적이지만, 코드 예제는 컴파일에 가깝고 도움이 된다." (HN westurner)
- 생성 품질은 OpenSCAD보다 제한적이라는 보고도 있음 (avipeltz — "reliably generate compiling code" 가능하지만 "generation quality is still more limited than openscad").

### 5.5 LLM ↔ OCP Viewer 직접 연동

**ocp-viewer-mcp**가 이 문제의 핵심 해답:
- OCP CAD Viewer가 실행 중일 때, MCP 서버가 스크린샷을 캡처하여 AI에 전달.
- Cursor와 Claude Desktop에서 모두 설정 가능.
- `port` (기본 3939)와 `wait_ms` (렌더링 대기 시간) 파라미터 지원.
- 반환: Base64 인코딩된 PNG 이미지.

---

## 6. 핵심 결론 및 권고

### 6.1 현재 상태 요약

1. **LLM의 build123d 코드 생성은 가능하지만, 신뢰성이 낮다.** Fine-tuning 없는 상용 LLM(GPT-4, Claude)은 기본적 형상을 생성할 수 있으나, 복잡한 부품에서는 API 오용, 공간적 오류가 빈번하다.

2. **Skill Card / RAG가 가장 실용적인 개선 방법이다.** Henqo의 발견: user message에 구체적 코드 템플릿을 주입하는 것이 system prompt보다 효과적. VibeCAD이 이를 Claude Code에서 구현.

3. **시각 피드백 루프는 아직 초기 단계이다.** CADCodeVerify가 학술적으로 입증했으나 개선폭이 제한적(7.3%). ocp-viewer-mcp가 실용적 도구로 등장했으나 자동화된 루프는 아님.

4. **CadQuery가 학술 연구에서 우세하나, build123d가 프롬프트 엔지니어링에 유리할 수 있다.** Python의 `with` 블록 패턴, Enum, type hint가 LLM의 코드 생성에 자연스럽다.

5. **어셈블리는 미해결 과제이다.** 모든 프로젝트가 개별 부품 수준에 머물러 있으며, 부품 간 관계를 이해하는 AI CAD는 아직 없다.

### 6.2 코딩 에이전트로 build123d를 사용하기 위한 권고

1. **VibeCAD Skill 설치**: Claude Code에서 가장 쉬운 시작점.
2. **OCP CAD Viewer + ocp-viewer-mcp 설정**: VS Code에서 시각 피드백 확보.
3. **단계적 생성**: 한 번에 완성하려 하지 말고, 2D 스케치 → 3D → 피처 순으로.
4. **전문 라이브러리 활용 강제**: py_gearworks, bd_warehouse 사용을 Skill/프롬프트에 명시.
5. **코드 실행 피드백 루프 활용**: traceback → 수정이 가장 효과적.
6. **수치 검증 추가**: volume, bounding box, face count 확인을 워크플로우에 포함.
7. **Algebra Mode 선호**: Builder Mode보다 LLM이 더 일관성 있게 생성하는 경향 (상태 관리가 단순하므로).

### 6.3 불확실한 영역

- build123d 전용 fine-tuned 모델은 아직 존재하지 않음 (CadQuery만 있음).
- Claude Code CLI에서의 시각 피드백 자동화는 아직 성숙하지 않음.
- 복잡도가 높은 모델에서의 성공률에 대한 체계적 벤치마크가 없음.
- Henqo의 Skill Card 42개 패턴의 구체적 내용은 공개되지 않음.

---

## 출처 목록

1. rawwerks/VibeCAD — https://github.com/rawwerks/VibeCAD
2. MCP Market: build123d CAD Modeling — https://mcpmarket.com/tools/skills/build123d-cad-modeling
3. Henqo LinkedIn (Skill Card 접근) — https://www.linkedin.com/posts/henqo_every-engineer-i-talk-to-eventually-says-activity-7428472621002006529-QbVV
4. Henqo LinkedIn (Fuzzy Matching) — https://www.linkedin.com/posts/henqo_last-week-we-shipped-a-feature-that-sounds-activity-7437543687997456384-_Xst
5. Henning Klinke LinkedIn — https://www.linkedin.com/posts/henning-klinke-0a784265_vibeengineering-cadascode-build123d-activity-7433050836626448385-Wkbz
6. Text-to-CadQuery (arXiv:2505.06507) — https://arxiv.org/abs/2505.06507
7. CADCodeVerify (ICLR 2025) — https://arxiv.org/abs/2410.05340
8. CADCodeVerify GitHub — https://github.com/Kamel773/CAD_Code_Generation
9. CAD-Coder (NeurIPS 2025) — https://openreview.net/forum?id=QoiFdfZUJv
10. CAD-MLLM — https://arxiv.org/abs/2411.04954
11. CADDesigner — https://arxiv.org/abs/2508.01031
12. PartCAD — https://github.com/partcad/partcad
13. neThing.xyz — https://3dprintingindustry.com/news/polyspectras-nething-xyz-democratizes-3d-printing-with-free-ai-powered-cad-software-228056/
14. LlamaIndex Blog (RAG for CAD) — https://www.llamaindex.ai/blog/unlocking-the-3rd-dimension-for-generative-ai-part-1
15. FutureCAD — https://arxiv.org/html/2603.11831v1
16. LL3M — https://arxiv.org/html/2508.08228v1
17. ocp-viewer-mcp — https://github.com/dmilad/ocp-viewer-mcp
18. OCP CAD Viewer — https://marketplace.visualstudio.com/items?itemName=bernhard-42.ocp-cad-viewer
19. build123d 공식 문서 — https://build123d.readthedocs.io/
20. BlenderLLM 벤치마크 — https://github.com/FreedomIntelligence/BlenderLLM
21. HN: build123d + LLM 논의 — https://news.ycombinator.com/item?id=44189323
22. Learning From Design Procedure (arXiv:2603.06894) — https://arxiv.org/html/2603.06894v1
23. lobehub build123d Skill — https://lobehub.com/skills/helmecke-dotfiles-build123d
24. Will Patrick / KerrickStaley LLM CAD eval — https://news.ycombinator.com/item?id=47213509
25. Yet Another CAD Viewer / OCP.wasm — https://github.com/CadQuery/cadquery/discussions/1876
