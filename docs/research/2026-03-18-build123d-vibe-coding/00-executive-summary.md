# 코딩 에이전트 + build123d 바이브코딩 — 종합 리서치 보고서

**날짜**: 2026-03-18
**핵심 질문**: 코딩 에이전트로 build123d 3D 모델을 시행착오 최소화하여 만들 수 있는가?

---

## 상세 보고서

| # | 파일 | 내용 |
|---|------|------|
| 01 | [01-llm-build123d-current-state.md](./01-llm-build123d-current-state.md) | LLM+build123d 프로젝트 12개, 코드 생성 능력, 시각 피드백, 도구 생태계 |
| 02 | [02-vibe-coding-strategy.md](./02-vibe-coding-strategy.md) | 의도 전달 전략, 에이전트별 워크플로우, 오류 감지 4대 전략, 프롬프트 템플릿 |

---

## 핵심 답변: 4가지 의문에 대한 결론

### Q1. 내 의도를 코딩 에이전트에게 잘 전달할 수 있을까?

**가능하다. 단, "어떻게 말하느냐"가 결정적이다.**

| 전달 방식 | 효과 | 예시 |
|----------|------|------|
| 모호한 자연어 | 낮음 | "멋진 기어 만들어줘" |
| 구체적 사양 | 높음 | "module 2, 20 teeth, 두께 10mm spur gear" |
| 기존 코드 수정 | **가장 높음** | "이 코드에서 구멍을 3개→5개로" |
| 파라메트릭 사양서 | 높음 | JSON/YAML로 치수만 전달 |
| 참조 이미지 | 중간 | 스케치 사진 + Claude Vision |

**가장 효과적인 패턴**: 단계적 설명 (전체 윤곽 → 세부 특징 → 치수) + 검증 기대값 포함.

### Q2. 코딩 에이전트가 build123d 코드를 잘 짜는가?

**단순 형상은 80%+, 복잡한 부품은 20-40%.**

| 복잡도 | 성공률 | 예시 |
|--------|:------:|------|
| 단순 (Box+Hole+Fillet) | 80%+ | 인클로저, 브래킷 |
| 중간 (파라메트릭, 2D→3D) | 50-70% | 힌지, 마운트 |
| 복잡 (전문 형상) | 20-40% | 기어, 열교환기 |
| 고급 (곡면, Loft) | <20% | 터빈 블레이드, 유기적 형상 |

**핵심 문제 — LLM이 전문 라이브러리를 무시한다**: Henqo 발견에 따르면, LLM은 py_gearworks 대신 involute 수학을 직접 구현하려 한다. "모델이 너무 많이 알아서, 역설적으로 이미 만들어진 도구를 무시."

**해결**: **Skill Card** — user message에 구체적 코드 템플릿을 주입. system prompt보다 user message에 넣어야 효과적 (Henqo 발견).

### Q3. 시각적 오류가 있으면 어떻게 수정하는가?

3D CAD의 핵심 도전: **코드가 에러 없이 실행되어도 형상이 의도와 다를 수 있다.**

4대 전략을 조합한다:

```
┌──────────────────────────────────────────────────────────────┐
│                   시각 피드백 갭 메우기                        │
│                                                              │
│  ┌──────────────┐  코드는 돌아가는데  ┌──────────────┐       │
│  │  코드 실행    │  형상이 의도와     │  3D 렌더링    │       │
│  │  (텍스트)    │  다를 수 있다!     │  (시각)      │       │
│  └──────┬───────┘                   └──────┬───────┘       │
│         │                                   │               │
│         ▼                                   ▼               │
│  ┌──────────────┐                   ┌──────────────┐       │
│  │ A. 수치 검증  │ 에이전트 자체     │ B. VLM 피드백  │ 자동  │
│  │  volume      │ 수행 가능         │  렌더링→VLM   │ 가능  │
│  │  bbox        │ ★ 가장 실용적     │  →교정 지시   │       │
│  │  face count  │                   │  7.3% 개선    │       │
│  └──────────────┘                   └──────────────┘       │
│                                                              │
│  ┌──────────────┐                   ┌──────────────┐       │
│  │ C. 사용자     │ 가장 신뢰도      │ D. 단계적     │ ★★    │
│  │  피드백       │ 높음, 가장 느림   │  빌드         │ 가장  │
│  │  (HITL)      │                   │  Step by Step │ 권장  │
│  └──────────────┘                   └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

| 전략 | 자동화 | 정밀도 | 실용성 |
|------|:------:|:------:|:------:|
| **A. 수치 검증** (volume, bbox, faces) | 완전 자동 | 중간 | **★★★** |
| **B. VLM 피드백** (렌더링→Vision) | 반자동 | 중간 | ★★ |
| **C. 사용자 피드백** (Human-in-the-loop) | 수동 | 높음 | ★★ |
| **D. 단계적 빌드** (Step by Step) | 반자동 | 높음 | **★★★** |

**권장 조합**: D(단계적 빌드) + A(수치 검증) → 문제 발견 시 C(사용자 피드백)

### Q4. 바이브코딩이 3D CAD에서 작동하는가?

**"부분적으로 작동한다." 현실적 분담: 에이전트 70-80% + 사용자 20-30%.**

```
에이전트가 하는 것 (70-80%):            사용자가 하는 것 (20-30%):
├── 기본 형상 생성                      ├── 의도 명확화 (프롬프트)
├── Boolean 연산                        ├── 시각적 검증 ("이게 맞나?")
├── 파라미터 정의                       ├── 미세 조정 ("곡면 더 부드럽게")
├── 반복 패턴                           ├── 조립 검증 (다른 부품과 맞나?)
├── 표준 피처                           └── 최종 제조 검증
└── 내보내기 + 기본 검증
```

---

## 주요 발견: 도구와 프로젝트

### 실전에서 바로 쓸 수 있는 도구

| 도구 | 용도 | 환경 |
|------|------|------|
| **VibeCAD** (rawwerks) | Claude Code용 build123d Skill | Claude Code |
| **ocp-viewer-mcp** | OCP Viewer 스크린샷 → AI 시각 피드백 | Cursor, Claude Desktop |
| **cad-agent** | build123d + VTK Docker, HTTP API로 렌더링 | 모든 에이전트 |
| **f3d** | STEP/STL → PNG 헤드리스 렌더링 | CI/CD, CLI |
| **PartCAD** | build123d 부품 카탈로그 + AI 생성 | 독립 |

### 학술 연구에서의 핵심 수치

| 연구 | 핵심 수치 | 비고 |
|------|----------|------|
| Text-to-CadQuery | 실행 성공률 53% → **85%** (피드백 루프) | CadQuery + Gemini fine-tune |
| CADCodeVerify | Point Cloud 거리 **7.3%** 감소 | VLM 시각 검증 |
| CAD-Coder | 7B 모델로 SFT+RL | CadQuery, NeurIPS 2025 |
| BlenderLLM | Claude-3.5-Sonnet 구문 오류율 **15.6%** | Blender Python 기준 |

### Henqo의 핵심 발견 (산업계)

1. **LLM은 system prompt보다 user message에 주의를 기울인다** → Skill Card는 user message에 주입
2. **LLM은 전문 라이브러리를 무시하고 first-principles를 선호한다** → "하지 말 것" 규칙 필수
3. **더 나은 모델이 아니라 더 나은 scaffolding이 답이다**
4. **어셈블리는 미해결 과제** — 개별 부품은 생성 가능, 부품 간 관계는 이해 못 함

---

## 추천 워크플로우: Claude Code + build123d

### Setup

```bash
# 1. 환경
mamba create -n cad python=3.12 -c conda-forge cadquery-ocp
mamba activate cad
pip install build123d ocp-vscode

# 2. VibeCAD Skill (Claude Code)
# Claude Code에서: /install-skill build123d@vibecad

# 3. VS Code에서 OCP CAD Viewer 확장 설치
```

### 일상 워크플로우

```
1. 프롬프트 작성 (구체적 사양 + 검증 기대값)
     │
2. Claude Code → build123d 코드 생성
     │
3. 코드 실행 ─── traceback 있으면 → 자동 수정 (루프)
     │
4. 수치 검증 (volume, bbox, faces) 출력 확인
     │
5. STEP/STL 내보내기
     │
6. VS Code OCP Viewer에서 시각 확인 (사용자)
     │
7. 문제 있으면 자연어 피드백 → 2로 돌아감
     │
8. 완성 → git commit
```

### 수치 검증 패턴 (매번 포함)

```python
# 모든 build123d 스크립트 끝에 포함
bbox = result.bounding_box()
print(f"=== Verification ===")
print(f"Bounding box: {bbox.size.X:.1f} x {bbox.size.Y:.1f} x {bbox.size.Z:.1f}")
print(f"Volume: {result.volume:.1f} mm³")
print(f"Faces: {len(result.faces())}, Edges: {len(result.edges())}")

# 기대값이 있을 때
assert abs(bbox.size.X - EXPECTED_WIDTH) < 0.1, f"Width: {bbox.size.X}"
assert result.volume > 0, "Empty solid"
```

---

## 한계와 솔직한 평가

### 현재 상태 (2026.03)

- **build123d 전용 fine-tuned 모델은 없다**. CadQuery fine-tuning 연구만 존재. 상용 LLM(Claude, GPT-4)의 build123d 지식은 제한적.
- **시각 피드백 자동화는 초기 단계**. cad-agent, ocp-viewer-mcp 등 도구가 등장했으나 성숙하지 않음.
- **복잡한 부품의 성공률은 낮다** (20-40%). 단순 형상에서만 "바이브코딩"이 현실적.
- **어셈블리는 미해결 과제**. 개별 부품은 되지만, 부품 간 관계를 이해하는 AI는 아직 없음.

### 그럼에도 쓸 가치가 있는 이유

1. **반복 작업 자동화**: 파라미터만 바꾸는 변형 생성에 탁월
2. **프로토타이핑 가속**: 대략적 형상을 빠르게 만들고 수동으로 다듬기
3. **학습 도구**: build123d API를 모르는 상태에서 코드 패턴 학습
4. **검증 코드 생성**: assert + volume + bbox 검증을 매번 자동 포함

### 바이브코딩의 현실적 기대치

```
"AI가 CAD를 대신 해준다" ← 하이프
"AI가 CAD의 반복적이고 지루한 부분을 대신 해준다" ← 현실
"AI가 70%를 해주고, 내가 30%를 다듬는다" ← 최적 지점
```

---

## 참고 자료 (핵심)

| 자료 | URL |
|------|-----|
| VibeCAD (Claude Code Skill) | https://github.com/rawwerks/VibeCAD |
| ocp-viewer-mcp (시각 피드백) | https://github.com/dmilad/ocp-viewer-mcp |
| cad-agent (Docker 렌더링) | https://github.com/clawd-maf/cad-agent |
| Text-to-CadQuery (학술) | https://arxiv.org/abs/2505.06507 |
| CADCodeVerify (VLM 검증) | https://arxiv.org/abs/2410.05340 |
| Henqo (Skill Card) | https://www.linkedin.com/company/henqo/ |
| f3d 헤드리스 렌더링 | https://f3d.app/ |
| build123d 공식 문서 | https://build123d.readthedocs.io/ |
