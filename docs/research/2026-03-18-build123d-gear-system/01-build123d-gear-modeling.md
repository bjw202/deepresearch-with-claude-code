# build123d 기반 기어 모델링 심층 리서치

**작성일**: 2026-03-18
**목적**: build123d를 핵심 CAD 엔진으로 채택한 기어 설계-제조 시스템 구축을 위한 기술 조사
**상태**: 초판 완료

---

## 목차

1. [build123d 핵심 능력](#1-build123d-핵심-능력)
2. [build123d 기어 모델링 생태계](#2-build123d-기어-모델링-생태계)
3. [LLM 코드생성 관점에서의 build123d](#3-llm-코드생성-관점에서의-build123d)
4. [build123d + FEA/시뮬레이션 연동](#4-build123d--fea시뮬레이션-연동)
5. [실제 사용 사례 및 커뮤니티](#5-실제-사용-사례-및-커뮤니티)
6. [CadQuery 대비 비교 매트릭스](#6-cadquery-대비-비교-매트릭스)
7. [결론 및 권장 사항](#7-결론-및-권장-사항)
8. [출처](#8-출처)

---

## 1. build123d 핵심 능력

### 1.1 개요

build123d는 Python 기반 parametric BREP(Boundary Representation) CAD 프레임워크로, Open Cascade Technology(OCCT) 커널 위에 구축되었다. CadQuery에서 파생되었으나 독립적으로 대폭 리팩토링된 시스템이다. [1][2]

- **GitHub**: https://github.com/gumyr/build123d
- **Stars**: ~1,473 (2026-03 기준) [3]
- **Forks**: ~164, **Contributors**: 64명 [3]
- **커밋 수**: 2,636+ [3]
- **라이선스**: Apache 2.0
- **Python 지원**: 3.10, 3.11, 3.12, 3.13, 3.14 [3]
- **Used by**: 161개 프로젝트 [3]

### 1.2 API 아키텍처: Builder Mode vs Algebra Mode

build123d는 두 가지 핵심 인터페이스를 제공한다.

#### Builder Mode (Context Manager 기반)
```python
from build123d import *

with BuildPart() as pillow_block:
    with BuildSketch() as plan:
        Rectangle(width, height)
        fillet(plan.vertices(), radius=fillet)
    extrude(thickness)
```
- `with` 블록으로 상태를 관리하며, 각 빌더가 자신의 스코프를 가짐
- `BuildLine` (1D), `BuildSketch` (2D), `BuildPart` (3D) 세 레벨 빌더
- 빌더 컨텍스트 내에서 Python for문, print, 조건문 등 자유롭게 사용 가능 [4]

#### Algebra Mode (Stateless)
```python
from build123d import *

sketch = Rectangle(width, height)
sketch = fillet(sketch.vertices(), radius=fillet)
part = extrude(sketch, thickness)
```
- 각 객체를 명시적으로 추적하고 대수적 연산자로 변형
- `+` (union), `-` (subtract), `&` (intersect) 연산자 지원
- `Plane.XZ * Pos(X=5) * Rectangle(1, 1)` 같은 체이닝 가능 [2]

#### Hybrid Mode
두 모드는 자유롭게 혼합 가능하다. Builder 컨텍스트 내에서도 Algebra 스타일 연산을 사용할 수 있다.

### 1.3 Topology 접근 및 Selector 시스템

build123d의 가장 큰 강점 중 하나는 Topology 접근의 유연성이다.

**Topology 계층**: Vertex -> Edge -> Wire -> Face -> Shell -> Solid -> Compound [1]

```python
# 면, 모서리, 꼭짓점 접근
top_face = part.faces().sort_by(Axis.Z)[-1]
long_edges = part.edges().filter_by(Axis.X)
corner_verts = part.vertices()

# Python 표준 filter 사용 가능
outside_verts = filter(
    lambda v: (v.Y == 0.0 or v.Y == height) and -width/2 < v.X < width/2,
    part.vertices()
)
```

CadQuery의 문자열 기반 selector (예: `">Z"`, `"|X"`) 를 **표준 Python 리스트 연산**으로 대체했다:
- `sort_by(Axis)` - 축 기준 정렬
- `filter_by(Axis)` - 축 기준 필터링
- `group_by(Axis)` - 축 기준 그룹핑
- `Select.LAST` - 마지막 연산에서 변경된 요소만 선택 [4]

### 1.4 Assembly 시스템 (Joints)

build123d는 기계적 관계를 정의하는 Joint 시스템을 제공한다:

| Joint 타입 | 자유도 | 설명 | 핵심 파라미터 |
|---|---|---|---|
| **RigidJoint** | 0 DOF | 고정 결합 | `label`, `to_part`, `joint_location` |
| **RevoluteJoint** | 1 DOF (회전) | 힌지형 | `axis`, `angle_reference`, `range` |
| **CylindricalJoint** | 2 DOF (회전+이동) | 나사/실린더형 | `axis`, `angle_reference`, `linear_range` |
| **LinearJoint** | 1 DOF (이동) | 슬라이더형 | `axis`, `linear_range` |

[5]

```python
# Joint 사용 예시 (힌지 어셈블리)
with BuildPart() as box:
    Box(30, 30, 10)
    RigidJoint("hinge_attach",
               joint_location=Location((-15*CM, 0, 4*CM), (180, 90, 0)))

with BuildPart() as lid:
    Box(30, 30, 2)
    RevoluteJoint("hinge", axis=Axis.X, range=(0, 120))

# 연결
box.joints["hinge_attach"].connect_to(lid.joints["hinge"], angle=45)
```

**기어 어셈블리 시사점**: RevoluteJoint로 기어 축을 정의하고, RigidJoint로 기어를 축에 고정하는 방식으로 기어 트레인을 구성할 수 있다.

### 1.5 Export 능력

| 포맷 | 함수/방식 | 용도 |
|---|---|---|
| STEP | `export_step()` | 산업 표준 CAD 교환 |
| STL | `export_stl()` | 3D 프린팅, 메싱 |
| 3MF | `Mesher` 클래스 | 3D 프린팅 (메타데이터 포함) |
| SVG | `export_svg()` | 2D 투영 도면 |
| DXF | `export_dxf()` | 2D 레이저 커팅 |
| glTF/GLB | `export_gltf()` | 웹 3D 뷰어 |
| BREP | `export_brep()` | OCCT 네이티브 |

[2][6]

STL export 시 tolerance 파라미터로 메시 품질 제어 가능:
```python
export_stl(part, "gear.stl", tolerance=1e-3, angular_tolerance=0.1)
```

### 1.6 타입 안전성 및 에러 핸들링

- **mypy 정적 검사** 완전 지원 (CI에서 mypy 검사 통과) [3]
- 모든 Literal 문자열이 **Enum**으로 대체 -> IDE 자동완성 지원 [4]
- Topology 리팩토링: 기존 10,000줄 `topology.py`가 모듈별로 분리 [1]
- 하위 차원 객체가 상위 차원 객체를 직접 생성하지 못하도록 방향 제한 [1]

---

## 2. build123d 기어 모델링 생태계

### 2.1 bd_warehouse - 기어 모듈

**bd_warehouse**는 build123d의 공식 parametric parts 라이브러리이다.

- **GitHub**: https://github.com/gumyr/bd_warehouse
- **문서**: https://bd-warehouse.readthedocs.io/
- 206 커밋, gumyr(build123d 메인 개발자) 관리

#### 기어 관련 클래스

bd_warehouse의 gear 모듈은 **ISO 표준 metric involute spur gear**를 지원한다. [7]

| 클래스 | 설명 | 차원 |
|---|---|---|
| `InvoluteToothProfile` | 단일 치형 윤곽선 | 1D (Wire) |
| `SpurGearPlan` | 기어 2D 평면도 | 2D (Face) |
| `SpurGear` | 3D 스퍼 기어 | 3D (Solid) |

```python
from build123d import *
from bd_warehouse.gear import InvoluteToothProfile, SpurGear, SpurGearPlan

# 단일 치형 프로파일
gear_tooth = InvoluteToothProfile(
    module=2,
    tooth_count=12,
    pressure_angle=14.5,
    root_fillet=0.5 * MM,
)

# 2D 기어 프로파일
gear_profile = SpurGearPlan(
    module=2,
    tooth_count=12,
    pressure_angle=14.5,
    root_fillet=0.5 * MM,
)

# 3D 스퍼 기어
spur_gear = SpurGear(
    module=2,
    tooth_count=12,
    pressure_angle=14.5,
    root_fillet=0.5 * MM,
    thickness=5 * MM,
)
```

**파라미터**:
- `module` (float): 피치 지름/치수 비율 (mm)
- `tooth_count` (int): 치수
- `pressure_angle` (float): 압력각 (일반적으로 14.5 또는 20)
- `root_fillet` (float, optional): 치근 필렛 반경
- `addendum` (float, optional): 이끝원 반경 (기본값: 자동 계산)
- `dedendum` (float, optional): 이뿌리원 반경 (기본값: 자동 계산)
- `thickness` (float): 기어 두께 (SpurGear 전용)

**기어 맞물림 조건** [7]:
- 맞물리는 기어는 동일한 module과 pressure_angle을 가져야 함
- 분리 거리: `separation = module * (n0 + n1) / 2`

**한계**: bd_warehouse의 gear 모듈은 **spur gear만 지원**한다. 2D 프로파일의 단순 extrusion으로 3D 기어를 생성하므로, helical, bevel, worm gear는 지원하지 않는다. [8]

### 2.2 py_gearworks (구 gggears) - 고급 기어 생성기

**py_gearworks**는 build123d 기반의 전문 기어 생성 라이브러리이다.

- **GitHub**: https://github.com/GarryBGoode/py_gearworks (구 gggears)
- **문서**: https://gggears.readthedocs.io/
- 221 커밋, 3명 기여자, Apache 2.0
- 4개 릴리스

#### 지원 기어 타입 및 기능

| 기어 타입 | 프로파일 수정 | 위치 및 정렬 |
|---|---|---|
| Spur | Undercut | 표준 위치 |
| Helical | Profile shift | Backlash 제어 위치* |
| Bevel | Root/tip fillet | 축 정렬 (bevel, helical) |
| Cycloid | Crowning | Geartooth 정렬 (meshing) |
| Inside-ring | | |

[9]

*주의: Backlash 위치 조정은 spur 및 평행축 helical gear에서만 정확. Bevel과 교차축 helical은 공칭 공식만 지원.

#### 코드 예제

```python
from py_gearworks import *
from ocp_vscode import show

# Spur gear pair 생성
gear1 = SpurGear(number_of_teeth=12)
gear2 = SpurGear(number_of_teeth=24)

# gear1을 gear2에 맞물리도록 배치
gear1.mesh_to(gear2, target_dir=UP)

# build123d Part 객체로 변환
gear_part_1 = gear1.build_part()
gear_part_2 = gear2.build_part()

show(gear_part_1, gear_part_2)
```

```python
# Bevel gear pair
bevel1 = BevelGear(number_of_teeth=20, cone_angle=45)
bevel2 = BevelGear(number_of_teeth=40, cone_angle=45)
bevel1.mesh_to(bevel2)

show(bevel1.build_part(), bevel2.build_part())
```

#### bd_warehouse vs py_gearworks 비교

| 항목 | bd_warehouse.gear | py_gearworks |
|---|---|---|
| **기어 타입** | Spur만 | Spur, Helical, Bevel, Cycloid, Inside-ring |
| **프로파일 수정** | Root fillet, addendum/dedendum | Undercut, Profile shift, Crowning, Root/tip fillet |
| **3D 생성 방식** | 2D 프로파일 extrusion | NURBS 기반 복잡 솔버 |
| **기어 쌍 배치** | 수동 (분리 거리 계산) | `mesh_to()` 자동 배치 |
| **성능** | 빠름 (단순 extrusion) | 느림 (복잡 솔버, 병렬화 가능성 있음) [8] |
| **성숙도** | 안정적 (bd_warehouse 일부) | 활발한 개발 중 |
| **GUI** | 없음 | PyQT6 기반 GUI 제공 |

**통합 논의**: build123d 커뮤니티에서 py_gearworks를 bd_warehouse에 통합하는 논의가 진행 중이나, 아키텍처 차이(특히 pickle 직렬화 문제)로 인해 아직 합의되지 않았다. [8]

### 2.3 Involute Gear Profile 직접 구현

bd_warehouse나 py_gearworks를 사용하지 않고 build123d로 involute gear를 직접 구현하는 것도 가능하다.

핵심 수학:
- **Pitch diameter**: D_p = m * z
- **Base diameter**: D_b = D_p * cos(alpha)
- **Addendum diameter**: D_a = D_p + 2m
- **Dedendum diameter**: D_d = D_p - 2.5m
- **Involute curve**: x = r_b(cos(t) + t*sin(t)), y = r_b(sin(t) - t*cos(t))

build123d의 `Polyline`, `Spline`, `make_face`, `revolve`, `extrude` 등을 조합하여 구현할 수 있지만, 검증된 라이브러리 사용이 권장된다.

### 2.4 기어 어셈블리 (Gear Train, Gearbox) 구성

build123d의 Joint 시스템 + py_gearworks의 `mesh_to()` 조합으로 기어 트레인 구성이 가능하다:

```python
from build123d import *
from py_gearworks import SpurGear

# 기어 생성
gear_a = SpurGear(number_of_teeth=12)
gear_b = SpurGear(number_of_teeth=36)
gear_c = SpurGear(number_of_teeth=12)

# 기어 배치
gear_a.mesh_to(gear_b, target_dir=UP)
gear_b.mesh_to(gear_c, target_dir=UP)  # [불확실: 체인 배치 API 확인 필요]

# build123d Part로 변환 후 Assembly 구성
parts = [g.build_part() for g in [gear_a, gear_b, gear_c]]

# Joint를 이용한 축 연결
# RevoluteJoint로 각 기어의 회전축 정의
# RigidJoint로 기어박스 하우징에 축 고정
```

**[불확실]** py_gearworks의 다단 기어 트레인 자동 배치 API의 정확한 인터페이스는 공식 문서에서 추가 확인이 필요하다.

---

## 3. LLM 코드생성 관점에서의 build123d

### 3.1 Context Manager 패턴의 LLM 친화성

build123d의 `with` 블록 패턴은 LLM 코드 생성에 구조적 이점을 제공한다: [10][11]

1. **스코프 제한**: `with BuildPart()`, `with BuildSketch()` 등이 연산 범위를 명확히 구분하여 LLM의 상태 추적 부담 감소
2. **에러 범위 제한**: 한 블록 내의 오류가 다른 블록으로 전파되지 않음
3. **Pythonic 패턴 매칭**: LLM이 학습한 대량의 Python `with` 패턴(파일 I/O, DB 연결 등)과 유사한 구조
4. **반복 패턴의 자연스러움**: `for` 루프를 직접 사용할 수 있어 CadQuery의 lambda/iter 패턴보다 생성 용이

```python
# LLM이 생성하기 쉬운 패턴
with BuildPart() as part:
    with BuildSketch() as base:
        Rectangle(10, 10)
    extrude(5)
    # LLM이 for 루프를 자연스럽게 추가 가능
    for i in range(4):
        with BuildSketch(part.faces().sort_by(Axis.Z)[-1]):
            with Locations((i * 2, 0)):
                Circle(0.5)
        extrude(-2, mode=Mode.SUBTRACT)
```

### 3.2 CadQuery 대비 LLM 코드 오류율

CadQuery의 fluent API는 LLM에게 다음과 같은 문제를 야기한다:
- 메서드 체이닝 중 Workplane 상태 추적 어려움
- 문자열 기반 selector (">Z", "|X") 오류 가능성
- 중간 결과 참조 불가 (체이닝이 끊기면 재시작 필요)

build123d는 이를 해결한다:
- Enum 기반 옵션 -> 오타 가능성 제거
- 중간 객체를 변수에 할당하여 참조 가능
- `Select.LAST`로 마지막 연산 결과 접근 [4]

### 3.3 Skill Card 접근법

실제 산업 사례에서, LLM이 기어를 생성할 때 수학적 기초부터 직접 구현하려는 경향이 관찰되었다. [12][13]

> "LLMs pay far less attention to system prompts than user messages. The instructions were there, they just weren't being heard." [12]

해결책:
1. **Skill Card**: 구체적인 코드 템플릿을 제공하여 LLM이 패턴 매칭하도록 유도
2. **User message에 라이브러리 가이드 주입**: system prompt가 아닌 user message에 `py_gearworks` / `bd_warehouse` 사용 지침 삽입
3. **검증된 API signature 제공**: `SpurGear(module=2, tooth_count=12, ...)` 같은 정확한 호출 패턴

```
# Skill Card 예시: 기어 생성
사용자가 기어를 요청하면 py_gearworks를 사용하라.
- Spur gear: SpurGear(number_of_teeth=N)
- Helical gear: HelicalGear(number_of_teeth=N, helix_angle=A)
- Bevel gear: BevelGear(number_of_teeth=N, cone_angle=A)
- 기어 쌍 배치: gear1.mesh_to(gear2, target_dir=UP)
- 3D 변환: gear.build_part()
절대 involute 수학을 직접 구현하지 마라.
```

### 3.4 Text-to-CAD에 대한 시사점

build123d의 구조화된 코드 패턴은 Text-to-CAD 학습 데이터로서도 우수하다:
- CadQuery의 fluent 체이닝 대비 각 연산의 의미가 명확하여 학습 효율 향상
- build123d 공식 문서에 100+ 예제가 포함되어 있어 fine-tuning 데이터로 활용 가능 [2]
- PartCAD 프로젝트가 build123d 코드 기반 모델 카탈로그를 구축 중이어서 학습 데이터 확장 가능 [14]

---

## 4. build123d + FEA/시뮬레이션 연동

### 4.1 연동 파이프라인 개요

```
build123d (BREP 모델)
    |
    | export_step() / export_stl()
    v
gmsh (메싱)
    |
    | .msh / .inp 출력
    v
meshio (포맷 변환)
    |
    v
FEniCS / Elmer / CalculiX (FEA 솔버)
    |
    v
ParaView (후처리/시각화)
```

### 4.2 STEP -> gmsh 경로 (권장)

build123d가 STEP을 내보내면, gmsh의 OpenCASCADE 커널이 직접 읽을 수 있다: [15][16]

```python
# Step 1: build123d에서 STEP 내보내기
from build123d import *
from bd_warehouse.gear import SpurGear

gear = SpurGear(module=2, tooth_count=20, pressure_angle=20, thickness=10)
export_step(gear, "gear.step")

# Step 2: gmsh에서 메싱
import gmsh
gmsh.initialize()
gmsh.model.add("gear")
gmsh.model.occ.importShapes("gear.step")
gmsh.model.occ.synchronize()

# 메시 크기 설정 (치근 부분에 더 세밀하게)
gmsh.option.setNumber("Mesh.MeshSizeFromCurvature", 20)
gmsh.option.setNumber("Mesh.MeshSizeMax", 0.5)

gmsh.model.mesh.generate(3)  # 3D 메싱
gmsh.write("gear.msh")
gmsh.finalize()
```

STEP 경로의 장점:
- BREP 기하 정보 보존 (곡면 정밀도 유지)
- gmsh가 OCCT 커널을 사용하므로 build123d와 동일 기하 표현
- Physical Group으로 경계 조건 영역 지정 가능

### 4.3 STL -> gmsh 경로 (대안)

STL은 삼각 메시 기반이므로 기하 정밀도가 낮지만, 빠른 프로토타이핑에 유용하다.

```python
# build123d에서 고해상도 STL 내보내기
export_stl(gear, "gear.stl", tolerance=1e-4, angular_tolerance=0.05)
```

### 4.4 meshio를 이용한 포맷 변환

```python
import meshio

# gmsh -> FEniCS 호환 XDMF
mesh = meshio.read("gear.msh")
meshio.write("gear.xdmf", mesh)

# gmsh -> CalculiX 호환 INP
meshio.write("gear.inp", mesh)
```

### 4.5 기어 치근 응력 분석 가능성

기어 치근(tooth root)은 기어 파손의 주요 원인이다. build123d -> gmsh -> FEA 파이프라인으로:

1. **정적 응력 분석**: 단일 치에 하중을 가하여 치근 필렛의 von Mises 응력 계산
2. **접촉 해석**: [제한적] 두 기어 치면 간 접촉 응력은 비선형 해석 필요 (CalculiX, Elmer 지원)
3. **피로 수명 예측**: FEA 결과 + Lewis 공식 또는 AGMA 표준 결합

**[불확실]** build123d에서 FEA까지의 완전 자동화 파이프라인은 아직 표준화되지 않았다. 각 단계를 Python 스크립트로 연결하는 것은 가능하지만, 통합 프레임워크는 존재하지 않는다.

### 4.6 OCCT 내장 메싱

build123d의 `export_stl()` 내부적으로 OCCT의 `BRepMesh_IncrementalMesh`를 사용한다. 3MF export를 위한 `Mesher` 클래스도 제공된다. [6] 이 메시는 시각화 용도이며, FEA용 볼륨 메시 생성에는 gmsh가 필요하다.

---

## 5. 실제 사용 사례 및 커뮤니티

### 5.1 성숙도 및 릴리스 현황

| 항목 | 상태 |
|---|---|
| 최신 릴리스 | v0.10.x (2025-2026) |
| 릴리스 수 | 12개 [3] |
| 1.0 목표 | API 안정화 및 동결 계획 [17] |
| CI/CD | tests, pylint, mypy, codecov 전체 통과 [3] |
| Python 지원 | 3.10-3.14 |
| 문서화 | ReadTheDocs, Sphinx 기반, 100+ 예제 |

### 5.2 커뮤니티

- **Discord**: CadQuery와 공유 서버에서 build123d 전용 채널 운영
- **GitHub Discussions**: 활발한 Q&A 및 기능 요청
- **주요 기여자**: gumyr (핵심 개발), jdegenstein (공동 메인테이너), bernhard-42 (ocp-vscode 뷰어)
- **생태계**: bd_warehouse, py_gearworks, PartCAD, ocp-vscode 등 연관 프로젝트

### 5.3 프로덕션 사용 사례

- **3D 프린팅/CNC 가공**: 파라메트릭 설계 후 STEP/STL 출력 [2]
- **Henqo**: AI CAD 시스템에서 py_gearworks + bd_warehouse 기반 기어/베어링 생성 [12][13]
- **PartCAD**: build123d 코드 기반 부품 카탈로그 및 패키지 매니저 [14]
- **Arrow-air**: build123d 의존 프로젝트로 등록 [3]
- **Vibecad/rawwerks**: Claude용 build123d CAD 모델링 Skill [18]

### 5.4 CadQuery -> build123d 마이그레이션 트렌드

HackerNews 및 커뮤니티 논의에서 일관된 경향이 관찰된다: [19][20]

> "Build123D is the ONLY one that actually justifies its existence because they realized OpenSCAD doesn't only suffer from a syntax problem, it suffers from a representation problem." [20]

> "Or better, Build123D, which is CadQuery-compatible but does not use the frankly rather overcooked fluent API approach." [19]

- build123d는 CadQuery와 동일한 OCCT 커널 (`cadquery-ocp`) 의존
- 라이브러리 레벨에서 호환성 있음 (뷰어 공유)
- 새 프로젝트에서는 build123d를 기본 선택하는 추세

---

## 6. CadQuery 대비 비교 매트릭스

| 항목 | build123d | CadQuery |
|---|---|---|
| **API 스타일** | Context Manager + Algebra (선택 가능) | Fluent API (메서드 체이닝) |
| **Python 통합도** | 높음 (표준 for/if/with) | 낮음 (체이닝 내부에서 제한적) |
| **타입 안전성** | mypy 완전 지원, Enum 사용 | 부분적, Literal 문자열 |
| **Selector 시스템** | Python 리스트/filter/sort | 문자열 기반 ("<Z", "\|X") |
| **중간 결과 접근** | 변수 할당으로 자유 | 체이닝 중 제한적 |
| **IDE 자동완성** | 우수 (Enum, 타입 힌트) | 제한적 (문자열 selector) |
| **Assembly 시스템** | Joint 기반 (Rigid, Revolute, Cylindrical, Linear) | 제한적 |
| **Export 포맷** | STEP, STL, 3MF, SVG, DXF, glTF, BREP | STEP, STL, SVG, DXF |
| **기어 라이브러리** | bd_warehouse (spur) + py_gearworks (다양) | cq_gears (spur 위주) |
| **뷰어** | ocp-vscode (공유) | CQ-editor, ocp-vscode (공유) |
| **LLM 코드생성 적합성** | 높음 (구조화된 패턴) | 중간 (체이닝 추적 어려움) |
| **커뮤니티 규모** | 성장 중 (~1,473 stars) | 성숙 (~8,000+ stars) |
| **문서화** | 우수 (100+ 예제, 튜토리얼) | 우수 |
| **OCCT 커널** | 동일 (cadquery-ocp >= 7.8) | 동일 |
| **성능** | 동등 (동일 커널) | 동등 |
| **안정성** | Pre-1.0 (활발한 API 변경) | 안정 (2.x) |
| **확장성** | 새 클래스 생성으로 확장 (monkey-patch 불필요) | monkey-patch 필요한 경우 있음 |

---

## 7. 결론 및 권장 사항

### 7.1 핵심 판단

**build123d는 기어 설계-제조 시스템의 CAD 엔진으로 적합하다.** 근거:

1. **API 품질**: Context Manager 패턴과 Algebra 모드의 이중 인터페이스가 프로그래매틱 CAD에 최적
2. **기어 생태계**: bd_warehouse(spur gear) + py_gearworks(helical, bevel, cycloid)의 조합으로 대부분의 기어 타입 커버
3. **LLM 친화성**: 구조화된 코드 패턴이 AI 코드 생성에 유리하며, 이미 산업계에서 검증 중
4. **FEA 연동**: STEP export -> gmsh -> FEA 파이프라인 구축 가능
5. **활발한 개발**: 64명 기여자, 2,636 커밋, 1.0 로드맵 진행 중

### 7.2 리스크

1. **Pre-1.0 상태**: API breaking change 가능성 (1.0 이후 deprecation cycle 보장 예정) [17]
2. **py_gearworks 성능**: 복잡 기어(bevel 등)의 NURBS 솔버가 느림 [8]
3. **FEA 자동화 부재**: build123d -> FEA 통합 파이프라인은 직접 구축 필요
4. **CadQuery 대비 작은 커뮤니티**: stars 기준 ~1/5 규모

### 7.3 권장 아키텍처

```
[사용자 요청] -> [LLM + Skill Cards]
                       |
                       v
              [build123d 코드 생성]
                       |
          +------------+------------+
          |            |            |
    [bd_warehouse] [py_gearworks] [직접 모델링]
          |            |            |
          +------------+------------+
                       |
                       v
              [build123d Part/Assembly]
                       |
          +------------+------------+
          |            |            |
    [STEP export] [STL export] [3MF export]
          |            |
          v            v
     [gmsh 메싱]  [3D 프린터]
          |
          v
     [FEA 솔버]
          |
          v
     [응력/피로 결과]
```

### 7.4 다음 단계

1. py_gearworks의 정확한 API surface 및 성능 벤치마크 조사
2. build123d -> gmsh -> FEniCS 파이프라인 PoC 구현
3. LLM용 기어 Skill Card 프로토타입 작성
4. build123d 1.0 로드맵의 Material System이 기어 시뮬레이션에 미치는 영향 추적

---

## 8. 출처

[1] Perplexity search: "build123d API architecture Builder Algebra mode vs CadQuery" (2026-03-18)
[2] GitHub: https://github.com/gumyr/build123d - README 및 프로젝트 구조
[3] PyPI: https://pypi.org/project/build123d/ - GitHub Statistics (1,473 stars, 164 forks, 64 contributors)
[4] build123d Introduction: https://build123d.readthedocs.io/en/latest/introduction.html - "Advantages Over CadQuery" 섹션
[5] Perplexity search: "build123d Assembly system joints RigidJoint RevoluteJoint" (2026-03-18)
[6] build123d Import/Export docs: https://build123d.readthedocs.io/en/latest/import_export.html
[7] bd_warehouse gear docs: https://bd-warehouse.readthedocs.io/en/latest/gear.html
[8] GitHub Discussion: https://github.com/gumyr/build123d/discussions/860 - "bd_warehouse.gears vs gggears"
[9] GitHub: https://github.com/GarryBGoode/py_gearworks - README (features table)
[10] Perplexity search: "build123d LLM code generation Text-to-CAD context manager pattern" (2026-03-18)
[11] HackerNews: https://news.ycombinator.com/item?id=44189323 - "Build123d and Cadquery procedural CAD output"
[12] LinkedIn/Henqo: "Fuzzy Matching for Per-Part Mesh Extraction" - py_gearworks/bd_warehouse skill cards
[13] LinkedIn/Womp: "Shape Library: 6 New Primitives for 3D Modeling" - LLM gear generation 문제점
[14] HackerNews: https://news.ycombinator.com/item?id=38785458 - PartCAD discussion
[15] Grokipedia: "Python CAD libraries" - STEP export to gmsh pipeline 설명
[16] rsmith.home.xs4all.nl: "FEA based on STEP geometry using gmsh and CalculiX"
[17] GitHub Wiki: https://github.com/gumyr/build123d/wiki/Roadmap - build123d 1.0 Roadmap
[18] MCP Market: https://mcpmarket.com/tools/skills/build123d-cad-modeling - Claude용 build123d Skill
[19] HackerNews: https://news.ycombinator.com/item?id=40563489 - CadQuery vs build123d 논의
[20] Hackaday: https://hackaday.com/2025/11/26/microcad-programs-cad/ - "Build123D is the ONLY one..."

---

*이 문서는 Perplexity sonar-pro, Tavily search (advanced), Tavily extract를 통해 수집한 자료를 기반으로 작성되었다. 핵심 수치와 API 정보는 공식 문서 및 GitHub 리포지토리에서 검증하였다.*
