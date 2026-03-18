# 코딩 에이전트 + build123d 바이브코딩 실전 전략

> 작성일: 2026-03-18
> 목적: 코딩 에이전트(Claude Code, Cursor 등)로 build123d 3D 모델을 만들 때의 실전 워크플로우와 전략

---

## 1. "바이브코딩"이란 — 3D CAD 맥락에서

### 1.1 바이브코딩의 정의

Andrej Karpathy가 2025년 초 트윗으로 만든 용어다. 원래 정의:

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."
> — Andrej Karpathy, 2025 [^1][^2]

핵심 특징:
- 자연어로 의도를 설명하고, AI가 생성한 코드를 **줄 단위로 검토하지 않고** 받아들인다
- 실행 결과와 후속 프롬프트로 방향을 잡는다
- 대화형 반복 루프: 설명 → 생성 → 실행 → 관찰 → 피드백 → 수정 [^3]

[^1]: https://en.wikipedia.org/wiki/Vibe_coding
[^2]: https://simonwillison.net/2025/Mar/19/vibe-coding/
[^3]: https://cloud.google.com/discover/what-is-vibe-coding

### 1.2 텍스트 코딩 vs 3D CAD 바이브코딩

| 차원 | 텍스트 코딩 바이브코딩 | 3D CAD 바이브코딩 |
|------|----------------------|------------------|
| **피드백** | 코드 실행 → 텍스트 출력/UI 확인 | 코드 실행 → **3D 렌더링** 확인 필요 |
| **검증** | 테스트 통과/실패로 자동 검증 | 시각적 검증이 필수 (형상은 assert만으로 불충분) |
| **오류 유형** | 런타임 에러, 로직 에러 | + **기하학적 오류** (형상이 의도와 다름) |
| **에이전트 한계** | 출력 텍스트로 결과 인식 가능 | 3D 렌더링을 직접 볼 수 없음 (텍스트 기반) |
| **수정 방향** | 에러 메시지가 수정 방향을 제시 | 시각적 차이를 자연어로 설명해야 함 |

**3D CAD 바이브코딩의 핵심 도전**: 코드가 에러 없이 컴파일되어도 형상이 의도와 완전히 다를 수 있다. 텍스트 코딩에서는 테스트를 돌리면 되지만, 3D에서는 "보지 않으면 모른다."

### 1.3 성공/실패 패턴

**성공하는 경우:**
- 파라메트릭 사양이 명확한 표준 부품 (기어, 브래킷, 인클로저)
- 기존 코드에서 치수만 변경하는 수정 요청
- 단순 형상의 조합 (Box + Cylinder + Boolean)
- 단계별 빌드 + 중간 검증을 수행할 때

**실패하는 경우:**
- "멋진 유기적 형상" 같은 모호한 요청
- 복잡한 곡면 (Spline, Loft)의 미세 조정
- 여러 부품의 정밀한 조립/간섭 체크
- 한 번에 전체 모델을 생성하려 할 때

---

## 2. 의도 전달 전략

### 2.1 자연어 설명의 효과적 패턴

**나쁜 프롬프트 (모호):**
```
멋진 기어를 만들어줘
```

**좋은 프롬프트 (구체적 사양):**
```
module 2, 20 teeth, 20도 pressure angle, 두께 10mm인 spur gear를 만들어줘.
shaft hole 직경 8mm, 중심에 위치. keyway 없음.
```

**더 좋은 프롬프트 (단계 포함):**
```
아래 사양의 spur gear를 build123d algebra mode로 만들어줘:

1. 기어 파라미터:
   - module: 2
   - teeth: 20
   - pressure_angle: 20°
   - thickness: 10mm

2. 중심 구멍:
   - diameter: 8mm
   - through hole

3. 검증:
   - 외경이 module * (teeth + 2) = 44mm인지 assert
   - volume을 출력

4. export: STL + STEP
```

### 2.2 효과적 의도 전달 기법

#### A. 파라메트릭 사양서 (JSON/YAML)

```yaml
part: phone_stand
material_thickness: 3mm
dimensions:
  width: 80mm
  depth: 100mm
  height: 120mm
features:
  - base_plate: {width: 80, depth: 100, thickness: 3}
  - back_support: {angle: 70deg, height: 120, thickness: 3}
  - phone_lip: {height: 5, depth: 10}
  - cable_slot: {width: 15, height: 8, position: center_bottom}
fillets:
  - all_external_edges: 1mm
```

#### B. 참조 이미지 활용 (Claude Vision)

코딩 에이전트가 Vision 모달리티를 지원하면:
- 기존 CAD 모델의 스크린샷
- 손그림 스케치 사진
- 도면 (dimensioned drawing)
- 유사 제품 사진

**프롬프트 예:**
```
첨부한 스케치를 build123d로 구현해줘.
주요 치수: 전체 폭 80mm, 높이 50mm.
스케치에 표시된 구멍은 M4 관통 홀이야.
```

#### C. 기존 코드에서 수정 요청

가장 성공률이 높은 패턴이다:
```
이 코드에서 다음을 변경해줘:
1. 구멍을 3개에서 5개로 (등간격 유지)
2. 전체 높이를 30mm에서 45mm로
3. 상단 모서리에 fillet 2mm 추가
```

#### D. 단계적 설명 (전체 → 세부 → 치수)

```
1. 전체 윤곽: L자 형태의 브래킷
2. 기본 치수: 수직부 60x40mm, 수평부 80x40mm, 두께 5mm
3. 세부 특징:
   - 수직부에 M5 관통홀 2개, 중심 간격 30mm
   - 수평부에 slot (10x20mm), 수평부 중앙
   - 코너에 보강 리브 (삼각형, 빗변 20mm)
4. 마감: 모든 외부 모서리 fillet 1mm
```

---

## 3. 코딩 에이전트별 워크플로우

### 3.1 Claude Code (CLI)

Claude Code는 CLI 기반이므로 3D 뷰어를 직접 볼 수 없다. 이것이 가장 큰 제약이자 워크플로우 설계의 핵심이다.

#### 기본 루프

```
사용자 요청 → Claude Code: build123d 코드 생성
  → 실행 (python script.py)
  → traceback 있으면 자동 수정
  → traceback 없으면 → 수치 검증 (assert)
  → export_stl() / export_step()
  → 사용자가 외부 뷰어에서 확인
  → 자연어로 피드백
  → Claude Code: 코드 수정
  → 반복
```

#### 실전 워크플로우: 코드 생성 + 자동 검증

```python
# Claude Code가 생성하는 코드 패턴
from build123d import *

# === 파라미터 ===
width, depth, height = 80, 60, 30
hole_diameter = 10
fillet_radius = 2

# === 모델링 ===
result = Box(width, depth, height)
result -= Pos(0, 0, 0) * Cylinder(hole_diameter/2, height)
result = fillet(result.edges().filter_by(Axis.Z), radius=fillet_radius)

# === 자동 검증 ===
bbox = result.bounding_box()
print(f"Bounding box: {bbox.size}")
print(f"Volume: {result.volume:.1f} mm³")
print(f"Faces: {len(result.faces())}")
print(f"Edges: {len(result.edges())}")

expected_volume = width * depth * height - 3.14159 * (hole_diameter/2)**2 * height
print(f"Expected volume (approx): {expected_volume:.1f} mm³")
print(f"Volume delta: {abs(result.volume - expected_volume):.1f} mm³")

assert bbox.size.X == width, f"Width mismatch: {bbox.size.X} != {width}"
assert bbox.size.Y == depth, f"Depth mismatch: {bbox.size.Y} != {depth}"
assert result.volume > 0, "Volume is zero or negative"
assert len(result.faces()) > 6, "Expected more than 6 faces (box + hole)"

# === 내보내기 ===
export_stl(result, "output.stl")
export_step(result, "output.step")
print("Export complete: output.stl, output.step")
```

#### 헤드리스 렌더링으로 보완

Claude Code 환경에서 시각적 확인을 자동화하는 방법:

**방법 1: f3d (F3D) 헤드리스 렌더링**

build123d-f3d-render [^4] 를 활용한 CI 수준 자동 렌더링:

```bash
# STL을 PNG로 렌더링 (headless)
f3d output.step --output screenshot.png --rendering-backend osmesa
```

f3d는 `--rendering-backend egl|osmesa` 옵션으로 디스플레이 없이 렌더링을 지원한다 [^5].

[^4]: https://github.com/phillipthelen/awesome-build123d — "jdegenstein/build123d-f3d-render"
[^5]: https://f3d.app/docs/user/OPTIONS/ — rendering-backend 옵션

**방법 2: PyVista 오프스크린 렌더링**

```python
import pyvista as pv

mesh = pv.read("output.stl")
plotter = pv.Plotter(off_screen=True)
plotter.add_mesh(mesh, color="steelblue", show_edges=True)
plotter.camera_position = "iso"
plotter.show(screenshot="preview.png")
```

**방법 3: cad-agent Docker 컨테이너** [^6]

cad-agent는 build123d + VTK 렌더링을 Docker 컨테이너로 제공한다. 에이전트가 HTTP로 코드를 보내고 렌더링 이미지를 받는다:

```bash
# 1. 모델 생성
curl -X POST http://localhost:8123/model/create \
  -H "Content-Type: application/json" \
  -d '{"name": "my_part", "code": "from build123d import *\nresult = Box(60, 40, 30)"}'

# 2. 멀티뷰 렌더링
curl -X POST http://localhost:8123/render/multiview \
  -d '{"model_name": "my_part"}' -o views.png

# 3. 치수 측정
curl http://localhost:8123/model/my_part/measure
# → {"bounding_box": {...}, "volume": ..., "dimensions": {...}}
```

아키텍처:
```
┌─────────────────┐     HTTP      ┌──────────────────────────────┐
│  Claude Code    │ ──────────►  │  cad-agent container          │
│  (AI Agent)     │              │  ├── build123d (모델링)        │
│  • 코드 전송    │  ◄──────────  │  ├── VTK (3D 렌더링)         │
│  • 이미지 수신  │  JSON + PNG   │  ├── matplotlib (2D 도면)     │
│  • 판단/반복    │              │  └── STL/STEP/3MF 내보내기    │
└─────────────────┘              └──────────────────────────────┘
```

이 방식의 장점: 에이전트가 렌더링 이미지를 직접 보고 (Vision 모달리티) 피드백 루프를 자동으로 돌릴 수 있다 [^6].

[^6]: https://github.com/clawd-maf/cad-agent — "CAD Agent: Give your AI agent eyes for CAD work"

#### Claude Code 스크린샷 → Vision 피드백

Claude Code가 스크린샷을 읽을 수 있다면:
```
1. build123d 코드 실행 → export_stl()
2. f3d --output preview.png (또는 cad-agent render)
3. Claude Vision으로 preview.png 분석
4. "이 모델이 20-tooth spur gear처럼 보이는가?" 자가 검증
5. 문제 발견 시 코드 수정 → 반복
```

### 3.2 Cursor

Cursor는 IDE 기반이므로 VS Code 확장(ocp-vscode)과 통합 가능하다.

#### 워크플로우

```
1. .cursor/rules/build123d.mdc 에 규칙 설정
2. ocp-vscode 확장으로 실시간 3D 프리뷰
3. Cursor Agent로 코드 생성/수정
4. split view: 왼쪽 코드 + 오른쪽 3D 뷰어
5. Agent가 코드 수정 → 자동 리프레시
```

#### .cursor/rules 예시

```markdown
---
description: build123d CAD 모델링 규칙
globs: ["**/*.py"]
alwaysApply: false
---

# build123d 규칙

## 코딩 스타일
- Algebra mode를 기본으로 사용한다 (Builder mode가 아닌)
- 모든 치수는 명시적 변수로 정의한다
- MM 단위를 사용한다 (build123d의 기본)

## 검증 패턴
- 모든 모델에 bounding_box, volume, faces 수를 출력하는 검증 블록을 포함한다
- 기대값이 있으면 assert로 확인한다

## 내보내기
- 마지막에 export_step()과 export_stl()을 항상 포함한다
- show() 호출을 포함하여 ocp-vscode에서 볼 수 있게 한다

## build123d API 참조
- Boolean: result = part1 + part2 (union), part1 - part2 (difference), part1 & part2 (intersection)
- Fillet: fillet(part.edges().filter_by(Axis.Z), radius=r)
- Chamfer: chamfer(part.edges(), length=l)
- 2D→3D: extrude(sketch, amount=h), revolve(sketch, axis=Axis.X)
- Location: Pos(x,y,z) * object, Rot(rx,ry,rz) * object
```

#### Cursor의 장점

- **실시간 뷰어**: ocp-vscode로 `show()` 결과를 즉시 확인
- **컨텍스트 유지**: 프로젝트 전체를 인덱싱하여 기존 부품과의 관계 이해
- **Composer**: 여러 파일을 동시에 수정하는 복잡한 어셈블리 작업
- **인라인 수정**: "이 fillet의 반경을 3mm로 변경" 같은 정밀 수정

### 3.3 GitHub Copilot

자동완성 기반이므로 전체 모델 생성보다는 부분 코드 제안에 적합하다.

```python
# Copilot이 잘하는 것:
# 1. 기존 패턴 따라가기
hole1 = Pos(10, 0, 0) * Cylinder(3, height)
hole2 = Pos(-10, 0, 0) * Cylinder(3, height)  # ← Copilot 자동완성
hole3 = Pos(0, 10, 0) * Cylinder(3, height)   # ← Copilot 자동완성

# 2. build123d API 자동완성
result = fillet(result.edges().filter_by(  # ← Copilot: Axis.Z), radius=2)

# 3. 파라미터 변형
# width = 80  기존
width = 100  # ← 사용자가 변경하면 관련 계산도 Copilot이 업데이트 제안
```

**한계**: 전체 모델의 "의도"를 파악하지 못하므로, 새 모델 생성보다는 **기존 코드 편집 보조**에 적합하다.

---

## 4. 시각적 오류 감지 및 수정 전략

### 전략 A: 수치적 검증 (에이전트 직접 수행)

에이전트가 코드 실행 결과에서 수치를 읽어 자동으로 검증하는 방식이다. 3D 렌더링 없이도 많은 오류를 잡을 수 있다.

```python
from build123d import *

# === 모델 생성 ===
part = Box(80, 60, 30) - Pos(20, 0, 0) * Cylinder(5, 30)

# === 수치 검증 ===
def verify_part(part, spec):
    """에이전트가 자동으로 수행하는 검증"""
    bbox = part.bounding_box()
    checks = []

    # 1. Bounding box 크기
    if "bbox_size" in spec:
        expected = spec["bbox_size"]
        actual = (bbox.size.X, bbox.size.Y, bbox.size.Z)
        for i, (exp, act, axis) in enumerate(zip(expected, actual, "XYZ")):
            if abs(exp - act) > 0.01:
                checks.append(f"FAIL: {axis} size {act:.2f} != expected {exp:.2f}")
            else:
                checks.append(f"OK: {axis} size = {act:.2f}")

    # 2. 체적
    if "volume_range" in spec:
        lo, hi = spec["volume_range"]
        if lo <= part.volume <= hi:
            checks.append(f"OK: volume = {part.volume:.1f} (in [{lo}, {hi}])")
        else:
            checks.append(f"FAIL: volume = {part.volume:.1f} (expected [{lo}, {hi}])")

    # 3. 면/모서리 수
    if "min_faces" in spec:
        n = len(part.faces())
        if n >= spec["min_faces"]:
            checks.append(f"OK: {n} faces (>= {spec['min_faces']})")
        else:
            checks.append(f"FAIL: {n} faces (expected >= {spec['min_faces']})")

    # 4. 대칭 검사
    if spec.get("symmetric_x"):
        cx = (bbox.min.X + bbox.max.X) / 2
        if abs(cx) < 0.01:
            checks.append("OK: symmetric about X=0")
        else:
            checks.append(f"FAIL: center X = {cx:.2f}, not symmetric")

    return checks

spec = {
    "bbox_size": (80, 60, 30),
    "volume_range": (130000, 145000),  # box - cylinder 범위
    "min_faces": 8,  # 6(box) + 2(cylinder) 이상
    "symmetric_x": False
}

for check in verify_part(part, spec):
    print(check)
```

**수치 검증이 잡을 수 있는 오류:**
- 치수 오류 (bounding box)
- Boolean 연산 실패 (체적 변화 없음)
- 누락된 피처 (면 수 부족)
- 위치 오류 (중심 좌표)

**잡을 수 없는 오류:**
- 시각적으로만 보이는 형상 왜곡
- fillet/chamfer의 미세한 품질 문제
- 미학적 판단이 필요한 경우

### 전략 B: VLM 피드백 (CADCodeVerify 패턴)

CADCodeVerify [^7] 는 ICLR 2025에서 발표된 접근법으로, VLM(Vision-Language Model)을 사용하여 3D CAD 코드를 자동으로 검증/개선한다.

**핵심 메커니즘:**

```
1. LLM이 CAD 코드 생성
2. 코드 실행 → 3D 렌더링 이미지 생성
3. VLM에게 검증 질문 생성 요청:
   - "이 물체에 구멍이 있는가?"
   - "상단이 평평한가?"
   - "전체적으로 원통형인가?"
4. VLM이 렌더링 이미지를 보고 질문에 답변
5. 답변 기반으로 교정 피드백 생성
6. LLM이 피드백을 받아 코드 수정
7. 반복 (보통 2-3회)
```

**피드백 유형 (논문 결과):**
- **Structural Feedback** (52% → 감소): "원통형으로 만들어라", "모서리 형상 수정"
- **Dimensional Feedback**: "높이 증가", "폭 축소"
- **Positional Feedback**: "중심 정렬", "베이스에 맞춤"

**성능**: GPT-4 적용 시 Point Cloud 거리 7.30% 감소, 컴파일 성공률 5.5% 향상 [^7].

[^7]: Alrashedy et al., "Generating CAD Code with Vision-Language Models for 3D Designs," ICLR 2025. https://arxiv.org/abs/2410.05340

**build123d 환경에서의 적용 예:**

```python
# Step 1: 코드 생성 및 실행
code = """
from build123d import *
gear = ...  # LLM이 생성한 코드
export_step(gear, "gear.step")
"""

# Step 2: 헤드리스 렌더링
# f3d gear.step --output gear_front.png --rendering-backend osmesa

# Step 3: VLM 검증 (Claude Vision 등)
verification_prompt = """
이 이미지는 build123d로 생성한 spur gear의 렌더링이다.
다음 질문에 답하라:
1. 톱니가 보이는가? 대략 몇 개인가?
2. 중심에 축 구멍이 있는가?
3. 톱니의 형상이 인벌류트 곡선처럼 보이는가?
4. 전체적으로 대칭인가?
문제가 있다면 구체적인 수정 방향을 제시하라.
"""

# Step 4: 피드백 기반 수정
# VLM: "톱니가 15개 정도 보임. 20개여야 함. 톱니 프로파일이 삼각형이라 인벌류트가 아님."
# → LLM이 톱니 수와 프로파일 코드 수정
```

### 전략 C: Human-in-the-Loop (사용자 피드백)

가장 신뢰도 높은 방식이지만, 자동화가 아니다.

```
에이전트 → 코드 생성 → export_stl()
  → 사용자: 3D 뷰어에서 확인 (f3d, FreeCAD, PrusaSlicer 등)
  → 사용자: 자연어 피드백
    "구멍이 너무 작아. 8mm로 키워줘"
    "이 모서리에 fillet 추가해줘"
    "왼쪽 면에 텍스트 각인 넣어줘"
  → 에이전트: 코드 수정
  → 반복
```

**효과적인 사용자 피드백 패턴:**

| 비효과적 | 효과적 |
|---------|--------|
| "이상하게 생겼어" | "상단 면이 경사져 있어야 하는데 수평이야" |
| "구멍이 이상해" | "구멍 위치가 중심에서 10mm 왼쪽으로 치우쳐 있어" |
| "더 예쁘게" | "모든 외부 모서리에 2mm fillet 적용해줘" |

### 전략 D: 단계적 빌드 (Progressive Build)

한 번에 전체를 만들지 않고, 단계별로 검증하며 쌓아가는 전략이다. **시각 오류를 최소화하는 가장 실용적인 방법.**

```python
from build123d import *

# === Step 1: 기본 블록 ===
base = Box(80, 60, 30)
print(f"Step 1 - Base: volume={base.volume:.0f}, faces={len(base.faces())}")
assert base.volume == 80 * 60 * 30
export_step(base, "step1_base.step")
# → 확인 후 진행

# === Step 2: 구멍 추가 ===
with_holes = base - Pos(20, 0, 0) * Cylinder(5, 30) - Pos(-20, 0, 0) * Cylinder(5, 30)
print(f"Step 2 - Holes: volume={with_holes.volume:.0f}, faces={len(with_holes.faces())}")
assert with_holes.volume < base.volume, "Holes didn't subtract"
assert len(with_holes.faces()) > len(base.faces()), "No new faces from holes"
export_step(with_holes, "step2_holes.step")
# → 확인 후 진행

# === Step 3: Fillet 추가 ===
filleted = fillet(with_holes.edges().filter_by(Axis.Z), radius=2)
print(f"Step 3 - Fillet: volume={filleted.volume:.0f}, faces={len(filleted.faces())}")
export_step(filleted, "step3_fillet.step")
# → 확인 후 진행

# === Step 4: 텍스트 각인 ===
with BuildPart() as final:
    add(filleted)
    with BuildSketch(filleted.faces().sort_by(Axis.Z).last):
        Text("PART-001", font_size=8)
    extrude(amount=-0.5, mode=Mode.SUBTRACT)

print(f"Step 4 - Text: volume={final.part.volume:.0f}")
export_step(final.part, "step4_final.step")
```

각 단계에서:
1. 수치 검증 (assert + print)
2. STEP 내보내기 (수동/자동 시각 확인용)
3. 문제 발견 시 해당 단계만 수정
4. 이전 단계가 파괴되지 않음을 보장

---

## 5. 실전 프롬프트 템플릿

### 5.1 모델 생성 요청 프롬프트

```
build123d algebra mode로 아래 부품을 만들어줘.

## 부품 사양
- 이름: {part_name}
- 용도: {purpose}
- 단위: mm

## 기본 형상
{shape_description}

## 치수
{dimensions_table}

## 피처
{features_list}

## 제약 조건
{constraints}

## 코드 요구사항
1. algebra mode 사용 (Builder mode 아님)
2. 모든 치수를 상단에 변수로 정의
3. 각 단계 후 검증 (volume, bbox, faces 출력)
4. 마지막에 export_step(), export_stl() 포함
5. 검증 assert 포함
```

### 5.2 수정 요청 프롬프트

```
아래 build123d 코드를 수정해줘.

## 현재 코드
{existing_code}

## 변경 사항
1. {change_1}
2. {change_2}

## 유지 사항
- {preserve_1}
- {preserve_2}

## 검증
변경 후 다음을 확인:
- volume이 이전보다 {larger/smaller}
- bounding box {dimension}이 {value}
```

### 5.3 검증 요청 프롬프트

```
이 build123d 코드의 결과를 검증해줘.

## 코드
{code}

## 기대 결과
- 전체 크기: {width} x {depth} x {height} mm
- 구멍 개수: {n}
- 대칭: {axis}
- 체적 범위: {min} ~ {max} mm³

## 검증 방법
1. bounding_box 크기 확인
2. volume 범위 확인
3. faces 수 확인 (구멍 하나당 +2~3개)
4. 각 피처의 존재 확인
```

### 5.4 CLAUDE.md에 넣을 build123d 규칙

```markdown
## build123d 코딩 규칙

### 기본 원칙
- Algebra mode를 기본으로 사용한다
- 모든 치수를 파일 상단에 UPPER_CASE 변수로 정의한다
- 한 파일에 한 부품만 정의한다

### 코드 구조
1. imports
2. 파라미터 정의
3. 모델링 (단계별, 주석 포함)
4. 검증 블록 (volume, bbox, faces 출력 + assert)
5. 내보내기 (STL + STEP)

### 검증 필수 항목
- bounding_box 크기 출력
- volume 출력 및 기대값 비교
- faces 수 출력
- Boolean 연산 후 volume 변화 확인

### API 패턴
```python
# Boolean
result = part1 + part2          # union
result = part1 - part2          # difference
result = part1 & part2          # intersection

# Transform
moved = Pos(x, y, z) * part     # translate
rotated = Rot(rx, ry, rz) * part # rotate

# 2D → 3D
solid = extrude(sketch, amount=h)
solid = revolve(sketch, axis=Axis.X)
solid = sweep(profile, path)
solid = loft([sketch1, sketch2])

# 마감
result = fillet(part.edges().filter_by(Axis.Z), radius=r)
result = chamfer(part.edges(), length=l)

# 선택
top_face = part.faces().sort_by(Axis.Z).last
z_edges = part.edges().filter_by(Axis.Z)
largest_face = part.faces().sort_by(SortBy.AREA).last
```

### 피해야 할 패턴
- Builder mode와 Algebra mode 혼용 금지
- show() 없이 코드 작성 금지 (ocp-vscode 연동 시)
- 매직 넘버 금지 (모든 수치는 변수로)
- 한 번에 전체 모델 생성 시도 (단계별 빌드 권장)
```

---

## 6. 한계와 현실적 기대치

### 6.1 코딩 에이전트가 잘 만드는 것

| 부품 유형 | 성공률 | 이유 |
|----------|--------|------|
| 단순 인클로저 (박스 + 구멍) | 높음 | 파라미터가 명확, Boolean 연산 단순 |
| 표준 브래킷/마운트 | 높음 | L/U/T 형상이 정형화됨 |
| 파라메트릭 변형 | 매우 높음 | 기존 코드의 변수만 변경 |
| 기어 (표준 치형) | 중간 | 수학적 정의가 명확하나 곡선 복잡 |
| PCB 인클로저 | 높음 | 사양이 수치화되어 있음 |
| 파이프 피팅 | 중간 | revolve + Boolean 패턴 |

### 6.2 에이전트가 못 만드는 것

| 부품 유형 | 난이도 | 이유 |
|----------|--------|------|
| 유기적 형상 (생체모방) | 극히 어려움 | 수학적 정의 불가, Spline 제어점 조정 필요 |
| 복잡한 곡면 블렌드 | 어려움 | G2 연속성, 시각적 미세 조정 필요 |
| 다중 부품 간섭 체크 | 어려움 | 조립 상태의 3D 이해 필요 |
| 미세 치형 (헬리컬 기어 등) | 어려움 | 3D involute curve 정밀 제어 |
| 미학적 디자인 | 불가능 | "보기 좋은" 판단은 시각 필요 |

### 6.3 현실적 워크플로우 분담

```
에이전트 70-80%:
  ├── 기본 형상 생성
  ├── Boolean 연산
  ├── 파라미터 정의
  ├── 반복 패턴 (PolarLocations, GridLocations)
  ├── 표준 피처 (구멍, 슬롯, fillet, chamfer)
  └── 내보내기 + 기본 검증

사용자 20-30%:
  ├── 의도 명확화 (프롬프트 작성)
  ├── 시각적 검증 ("이게 맞는 형상인가?")
  ├── 미세 조정 ("이 곡면 좀 더 부드럽게")
  ├── 조립 검증 (다른 부품과 맞는가?)
  └── 최종 제조 검증 (프린트 가능성 등)
```

### 6.4 생산성 향상 전략

1. **라이브러리 축적**: 자주 쓰는 부품을 함수/모듈로 만들어 재사용
2. **검증 템플릿 표준화**: 부품 유형별 assert 세트 미리 정의
3. **단계별 커밋**: 각 피처 추가 후 git commit으로 롤백 가능하게
4. **참조 모델**: 이전에 만든 유사 부품 코드를 에이전트에게 제공
5. **뷰어 자동화**: f3d/cad-agent로 렌더링 → Vision 피드백 루프 구축

---

## 참고문헌

| # | 출처 | URL |
|---|------|-----|
| 1 | Wikipedia: Vibe coding | https://en.wikipedia.org/wiki/Vibe_coding |
| 2 | Simon Willison: Not all AI-assisted programming is vibe coding | https://simonwillison.net/2025/Mar/19/vibe-coding/ |
| 3 | Google Cloud: Vibe Coding Explained | https://cloud.google.com/discover/what-is-vibe-coding |
| 4 | awesome-build123d (f3d-render 등 도구 목록) | https://github.com/phillipthelen/awesome-build123d |
| 5 | f3d headless rendering options | https://f3d.app/docs/user/OPTIONS/ |
| 6 | cad-agent: AI-driven CAD modeling server | https://github.com/clawd-maf/cad-agent |
| 7 | CADCodeVerify (ICLR 2025) | https://arxiv.org/abs/2410.05340 |
| 8 | build123d 공식 문서 | https://build123d.readthedocs.io/ |
| 9 | LobeHub build123d skill (API 패턴 참조) | https://lobehub.com/skills/helmecke-dotfiles-build123d |
| 10 | Cambridge: LLM Agents for CAD Generation | https://www.cambridge.org/core/journals/proceedings-of-the-design-society/article/from-text-to-design-a-framework-to-leverage-llm-agents-for-automated-cad-generation/5BD8D63CFCED28BDD7A01313162FFBE7 |
| 11 | MIT DeCoDe Lab: CAD-Coder survey | https://decode.mit.edu/assets/papers/IDETC_CadCode_decodeweb.pdf |
| 12 | HN: Build123d + Copilot 경험 | https://news.ycombinator.com/item?id=44189323 |
| 13 | Karpathy: Programming is Unrecognizable (2026) | https://www.businessinsider.com/andrej-karpathy-programming-unrecognizable-ai-2026-2 |
| 14 | Reddit: AI-based IDE for 3D modeling (build123d) | https://www.reddit.com/r/SideProject/comments/1r19hp9/ |
| 15 | build123d OpenSCAD 전환 가이드 | https://build123d.readthedocs.io/en/latest/OpenSCAD.html |
| 16 | ocp-vscode viewer | https://github.com/bernhard-42/vscode-ocp-cad-viewer |
| 17 | moltbook: Test-driven CAD on headless Pi | https://www.moltbook.com/post/a1e56710-f6ed-48be-9062-e8550f06cc4d |
