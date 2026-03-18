# build123d 실전 가이드

> Python으로 3D CAD를 만들고, VS Code에서 바로 확인하고, STEP/STL로 내보내기까지.

---

## 목차

1. [전체 그림: 무엇이 어떻게 연결되는가](#1-전체-그림)
2. [설치](#2-설치)
3. [OCP CAD Viewer — "왜 VS Code에서 3D가 뜨는가"](#3-ocp-cad-viewer)
4. [첫 번째 모델 만들기](#4-첫-번째-모델-만들기)
5. [핵심 개념 5가지](#5-핵심-개념-5가지)
6. [실전 워크플로우](#6-실전-워크플로우)
7. [뷰어 완전 정복](#7-뷰어-완전-정복)
8. [다른 뷰어 옵션들](#8-다른-뷰어-옵션들)
9. [Export — 모델 내보내기](#9-export)
10. [자주 겪는 문제와 해결법](#10-자주-겪는-문제와-해결법)
11. [참고 자료](#11-참고-자료)

---

## 1. 전체 그림

build123d로 작업할 때 관여하는 소프트웨어 스택을 먼저 이해하자.

```
당신이 작성하는 것          내부에서 일어나는 것              당신이 보는 것
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Python 스크립트    →    build123d (API 레이어)
  (.py 파일)               │
                           ↓
                    cadquery-ocp (Python 바인딩)
                           │
                           ↓
                    OpenCASCADE (OCCT)          →    STEP/STL 파일
                    (C++ 기하 커널)
                           │
                           ↓
                    ocp_tessellate              →    OCP CAD Viewer
                    (BREP → 삼각형 메시)              (VS Code 안의 3D 뷰어)
                           │
                           ↓
                    WebSocket (포트 3939)
                           │
                           ↓
                    three-cad-viewer
                    (Three.js/WebGL 렌더러)
```

**핵심**: build123d는 Python API이고, 실제 3D 기하 계산은 OCCT(C++)가 한다. 뷰어는 별도 프로세스로, WebSocket을 통해 메시 데이터를 받아 WebGL로 그린다.

---

## 2. 설치

### 2.1 기본 설치 (Intel Mac / Linux / Windows)

```bash
# 가상환경 생성 (필수 권장)
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# build123d 설치 (cadquery-ocp 자동 포함)
pip install build123d

# VS Code 뷰어용 패키지
pip install ocp-vscode
```

### 2.2 Apple Silicon Mac (M1/M2/M3/M4)

Apple Silicon에서는 pip만으로 cadquery-ocp 빌드가 실패한다. **conda/mamba 필수**:

```bash
# mamba 설치 (conda보다 빠름)
# https://github.com/conda-forge/miniforge 에서 Miniforge 설치

# 환경 생성 + OCP 바이너리 설치
mamba create -n b123d python=3.12 -c conda-forge cadquery-ocp
mamba activate b123d

# build123d + 뷰어
pip install build123d ocp-vscode
```

> 출처: [GitHub Issue #646](https://github.com/gumyr/build123d/issues/646)

### 2.3 VS Code 확장 설치

1. VS Code 열기
2. Extensions 탭 (`Cmd+Shift+X`)
3. **"OCP CAD Viewer"** 검색 → 설치 (by bernhard-42)
4. 사이드바에 OCP 아이콘이 나타남

또는 사이드바 OCP 패널에서 **"Quickstart build123d"** 버튼을 누르면 필요한 Python 패키지(`build123d`, `ocp_vscode`, `ocp_tessellate`, `ipykernel`)를 자동 설치한다.

### 2.4 설치 확인

```python
from build123d import *
from ocp_vscode import show

box = Box(10, 20, 30)
show(box)
```

이 코드를 실행했을 때 VS Code에 파란 박스가 뜨면 성공.

---

## 3. OCP CAD Viewer

### 3.1 "왜 파이썬 파일을 실행하면 VS Code에 3D가 뜨는가?"

이것이 가장 헷갈리는 부분이다. 단계별로 설명하면:

```
[1] 당신이 show(box) 호출
        │
        ↓
[2] ocp_tessellate가 BREP 형상을 삼각형 메시로 분해
    (곡면 → 수천 개의 작은 삼각형)
        │
        ↓
[3] 메시 데이터를 JSON으로 직렬화
        │
        ↓
[4] WebSocket으로 localhost:3939에 전송
    (포트 정보는 ~/.ocpvscode 파일에 저장)
        │
        ↓
[5] VS Code의 OCP CAD Viewer 확장이 이 포트를 리스닝 중
        │
        ↓
[6] 수신한 메시를 Three.js (WebGL)로 렌더링
        │
        ↓
[7] VS Code 패널에 3D 모델 표시
```

즉, Python 프로세스와 VS Code 뷰어는 **별도 프로세스**다. WebSocket으로 통신한다. 그래서:

- Python 스크립트가 끝나도 뷰어에 모델이 남아 있다 (뷰어는 독립적)
- 뷰어를 먼저 열지 않으면 `show()`가 조용히 실패한다 (에러 없이 무시)
- 포트가 안 맞으면 연결이 안 된다

### 3.2 show() vs show_all() vs show_object()

| 함수 | 동작 | 언제 쓰는가 |
|------|------|------------|
| `show(obj1, obj2, ...)` | 뷰어를 **교체** — 기존 내용 지우고 새로 표시 | 최종 결과 확인 |
| `show_all()` | 현재 스코프의 **모든** CAD 객체를 자동 탐지하여 표시 | 빠른 전체 확인, 디버깅 |
| `show_object(obj, name="...")` | 뷰어에 **추가** — 기존 내용 유지 + 새 객체 추가 | 여러 객체를 하나씩 쌓아 표시 |
| `show_clear()` | 뷰어 비우기 | 다시 시작할 때 |

```python
# show_all() — 변수명이 자동으로 레이블이 됨
base = Box(10, 10, 5)
hole = Cylinder(2, 10)
show_all()  # "base"와 "hole"이 각각 이름 붙어 표시됨

# show() — 색상/투명도 제어
show(base, hole,
     names=["Base", "Hole"],
     colors=["steelblue", "red"],
     alphas=[1.0, 0.3])
```

### 3.3 set_defaults() — 뷰어 전역 설정

스크립트 맨 위에 한 번 호출하면 이후 모든 `show()`에 적용된다:

```python
from ocp_vscode import *

set_defaults(
    axes=True,           # XYZ 축 표시
    axes0=True,          # 원점에 축 표시
    grid=(True, False, False),  # XY 격자만 표시
    ortho=True,          # 정사 투영 (False면 원근)
    transparent=False,   # 불투명
    reset_camera=Camera.ISO,  # 아이소메트릭 뷰
)
```

---

## 4. 첫 번째 모델 만들기

### 4.1 최소 예제 — 구멍 뚫린 블록

```python
# %% [1] 설정
from build123d import *
from ocp_vscode import show, set_defaults, Camera

set_defaults(axes=True, reset_camera=Camera.ISO)

# %% [2] 모델링
with BuildPart() as block:
    # 밑판
    Box(60, 40, 10)

    # 윗면에 구멍 4개
    top = block.faces().sort_by(Axis.Z)[-1]  # Z축 최상단 면
    with BuildSketch(top):
        with GridLocations(40, 20, 2, 2):     # 40x20 간격, 2x2 배열
            Circle(3)                          # 반지름 3mm 원
    extrude(amount=-10, mode=Mode.SUBTRACT)    # 관통 구멍

    # 모서리 라운딩
    fillet(block.edges(), radius=2)

# %% [3] 확인
show(block)

# %% [4] 내보내기
export_step(block.part, "block.step")
```

### 4.2 코드 구조 해부

```
with BuildPart() as block:          ← 3D 파트 빌더 시작 (컨텍스트 매니저)
    Box(60, 40, 10)                 ← 기본 형상 생성 (자동으로 현재 빌더에 추가)

    top = block.faces()             ← Topology 접근: 파트의 모든 면
              .sort_by(Axis.Z)[-1]  ← Z축으로 정렬 → 마지막(=최상단) 면

    with BuildSketch(top):          ← 2D 스케치 빌더, 윗면 위에서 작업
        with GridLocations(...):    ← 위치 패턴 (여러 곳에 반복 배치)
            Circle(3)               ← 각 위치에 원 생성

    extrude(-10, mode=Mode.SUBTRACT) ← 스케치를 아래로 밀어서 구멍 만들기

    fillet(block.edges(), radius=2)  ← 모든 모서리에 필렛(라운딩)
```

---

## 5. 핵심 개념 5가지

### 5.1 세 개의 빌더

build123d는 차원별로 빌더가 나뉜다:

```
BuildLine     →  1D: 선, 호, 스플라인
    ↓
BuildSketch   →  2D: 사각형, 원, 다각형 → Face
    ↓
BuildPart     →  3D: 솔리드 → extrude, revolve, sweep, loft
```

빌더는 중첩 가능하다:

```python
with BuildPart() as part:           # 3D 세계
    with BuildSketch() as sketch:   #   2D 세계 (XY 평면 위)
        with BuildLine() as line:   #     1D 세계
            Line((0, 0), (10, 0))
            Line((10, 0), (10, 10))
        make_face()                 #   선 → 면으로 변환
    extrude(amount=5)               # 면 → 솔리드로 변환
```

### 5.2 Topology 접근 — "이 면", "저 모서리"를 어떻게 지정하는가

```python
part.faces()                     # 모든 면
part.faces().sort_by(Axis.Z)     # Z축으로 정렬
part.faces().sort_by(Axis.Z)[-1] # Z축 최상단 면
part.faces().sort_by(Axis.Z)[0]  # Z축 최하단 면

part.edges()                        # 모든 모서리
part.edges().filter_by(Axis.Z)      # Z축 방향 모서리만
part.edges().group_by(Axis.Z)[-1]   # Z축 최상단 그룹의 모서리들

part.vertices()                  # 모든 꼭짓점
```

CadQuery는 `">Z"`, `"|X"` 같은 문자열을 쓰지만, build123d는 **표준 Python**을 쓴다. IDE 자동완성이 되고, 디버깅이 쉽다.

### 5.3 Mode — 합치기, 빼기, 교차

```python
Box(10, 10, 10)                          # 기본: Mode.ADD (현재 빌더에 추가)
Cylinder(3, 15, mode=Mode.SUBTRACT)       # 빼기 (구멍 뚫기)
Sphere(7, mode=Mode.INTERSECT)            # 교차 (겹치는 부분만 남기기)
Box(5, 5, 5, mode=Mode.PRIVATE)           # 빌더에 추가하지 않음 (독립 객체)
```

또는 Algebra 모드에서 연산자 사용:

```python
result = Box(10, 10, 10) - Cylinder(3, 15)   # 빼기
result = Box(10, 10, 10) + Sphere(5)          # 합치기
result = Box(10, 10, 10) & Sphere(7)          # 교차
```

### 5.4 위치와 회전

```python
# Locations — "여기에 놓아라"
with Locations((0, 0), (20, 0), (40, 0)):
    Circle(5)  # 세 위치에 원 3개

# GridLocations — 격자 배치
with GridLocations(x_spacing=15, y_spacing=15, x_count=3, y_count=3):
    Circle(2)  # 3x3 = 9개 원

# PolarLocations — 원형 배치
with PolarLocations(radius=20, count=6):
    Circle(3)  # 60도 간격 원 6개
```

### 5.5 Export

```python
# STEP — CAD 교환 표준 (제조용)
export_step(part.part, "output.step")

# STL — 3D 프린팅
export_stl(part.part, "output.stl", tolerance=0.001)

# 3MF — 3D 프린팅 (색상/재질 지원)
export_3mf(part.part, "output.3mf")
```

---

## 6. 실전 워크플로우

### 6.1 추천 작업 흐름

```
┌─────────────────────────────────────────────────────┐
│ VS Code                                             │
│                                                     │
│  ┌──────────────────┐    ┌───────────────────────┐  │
│  │  편집기 (왼쪽)    │    │  OCP CAD Viewer (오른쪽)│  │
│  │                  │    │                       │  │
│  │  # %% [셀 1]     │    │    ┌─────────┐        │  │
│  │  from build123d  │───>│    │  3D 뷰   │        │  │
│  │  ...             │    │    │         │        │  │
│  │                  │    │    └─────────┘        │  │
│  │  # %% [셀 2]     │    │                       │  │
│  │  with BuildPart  │    │  ← 마우스로 회전/줌    │  │
│  │  ...             │    │                       │  │
│  │  show_all()      │    │                       │  │
│  │                  │    │                       │  │
│  │  # %% [셀 3]     │    │                       │  │
│  │  export_step()   │    │                       │  │
│  └──────────────────┘    └───────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**핵심 단축키:**

| 단축키 | 동작 |
|--------|------|
| `Ctrl+Enter` (또는 `Shift+Enter`) | 현재 셀(`# %%`) 실행 |
| `F5` | 디버그 모드 실행 (비주얼 디버거 활성화) |

### 6.2 `# %%` 셀 모드 — 가장 편한 방법

파일 확장자는 `.py`지만, `# %%` 주석으로 셀을 나누면 Jupyter처럼 셀 단위 실행이 가능하다:

```python
# %% 설정 (한 번만 실행)
from build123d import *
from ocp_vscode import *
set_defaults(axes=True, grid=(True, False, False), ortho=True)

# %% 파라미터 (수정 후 이 셀만 재실행)
length = 80
width = 60
thickness = 10
hole_d = 5
fillet_r = 3

# %% 모델링 (파라미터 변경 후 이 셀 재실행하면 즉시 업데이트)
with BuildPart() as bracket:
    Box(length, width, thickness)
    top = bracket.faces().sort_by(Axis.Z)[-1]
    with BuildSketch(top):
        with GridLocations(length/3, width/3, 2, 2):
            Circle(hole_d / 2)
    extrude(amount=-thickness, mode=Mode.SUBTRACT)
    fillet(bracket.edges().filter_by(Axis.Z), radius=fillet_r)

show_all()

# %% Export
export_step(bracket.part, "bracket.step")
```

**장점**: 파라미터 셀만 수정하고 모델링 셀을 재실행하면 즉각 뷰어가 갱신된다. 전체 파일을 다시 실행할 필요 없다.

### 6.3 디버깅 워크플로우 — 중간 형상 확인

복잡한 모델에서 "어디서 잘못됐나?" 찾기:

**방법 1: 중간 show() 삽입**

```python
with BuildPart() as part:
    Box(60, 40, 10)
    show(part, colors=["green"], alphas=[0.3])  # ← 중간 확인

    with BuildSketch(part.faces().sort_by(Axis.Z)[-1]):
        Circle(5)
    extrude(amount=-10, mode=Mode.SUBTRACT)
    show(part, colors=["blue"])                  # ← 구멍 뚫린 후 확인
```

**방법 2: 비주얼 디버거 (자동)**

1. 코드에 breakpoint 설정 (줄번호 왼쪽 클릭)
2. `F5`로 디버그 실행
3. breakpoint마다 **자동으로** 현재 스코프의 모든 CAD 객체가 뷰어에 표시됨
4. `F10` (Step Over)으로 한 줄씩 진행하며 형상 변화 관찰

> 주의: 비주얼 디버거가 객체를 인식하려면 빌더에 이름을 지정해야 한다:
> `with BuildPart("my_part") as part:` ← `"my_part"` 필수

**방법 3: 토폴로지 출력**

```python
print(part.part.show_topology())
# Solid              at 0x..., Center(30, 20, 5)
#     Shell          at 0x..., Center(30, 20, 5)
#         Face       at 0x..., Center(30, 20, 10)
#         Face       at 0x..., Center(30, 20, 0)
#         ...
```

### 6.4 여러 객체를 색상으로 구분

```python
base = Box(50, 50, 5)
pillar = Pos(0, 0, 15) * Cylinder(5, 30)
cap = Pos(0, 0, 32.5) * Sphere(8)

show(base, pillar, cap,
     names=["Base Plate", "Pillar", "Cap"],
     colors=["gray", "steelblue", "red"],
     alphas=[1.0, 0.7, 1.0])
```

### 6.5 파라메트릭 함수로 재사용

```python
def mounting_bracket(length, width, thickness, holes, hole_d, fillet_r):
    """파라메트릭 마운팅 브래킷"""
    with BuildPart() as bracket:
        Box(length, width, thickness)
        top = bracket.faces().sort_by(Axis.Z)[-1]
        with BuildSketch(top):
            with GridLocations(length/(holes+1), width/2, holes, 1):
                Circle(hole_d / 2)
        extrude(amount=-thickness, mode=Mode.SUBTRACT)
        fillet(bracket.edges().filter_by(Axis.Z), radius=fillet_r)
    return bracket.part

# 다양한 변형 생성
small = mounting_bracket(40, 20, 3, 2, 3, 1)
large = mounting_bracket(80, 40, 5, 4, 5, 2)

show(small, Pos(0, 50, 0) * large,
     names=["Small", "Large"],
     colors=["steelblue", "orange"])
```

---

## 7. 뷰어 완전 정복

### 7.1 마우스 조작

| 동작 | 마우스 |
|------|--------|
| **회전** | 왼쪽 버튼 드래그 |
| **줌** | 휠 스크롤 |
| **팬 (이동)** | 오른쪽 버튼 드래그 |
| **객체 선택** | 클릭 (측정 모드에서) |

### 7.2 카메라 프리셋

```python
show(part, reset_camera=Camera.ISO)     # 아이소메트릭 (기본)
show(part, reset_camera=Camera.TOP)     # 위에서
show(part, reset_camera=Camera.FRONT)   # 앞에서
show(part, reset_camera=Camera.KEEP)    # 현재 카메라 유지 (수정 후 재실행 시 유용)
```

**팁**: 파라미터를 수정하고 셀을 재실행할 때 `Camera.KEEP`을 쓰면 뷰 각도가 유지되어 비교하기 편하다.

### 7.3 표시 모드

```python
# 솔리드 + 검정 에지 (기본적이고 깔끔)
set_defaults(default_edgecolor="#000000")

# 반투명
show(part, alphas=[0.4])

# 와이어프레임 느낌
show(part, alphas=[0.1])

# 다크 테마
set_defaults(
    default_color="lightgray",
    default_edgecolor="#333333",
)
```

### 7.4 측정

뷰어에서 face, edge, vertex를 클릭하면 정보가 표시된다:
- **Face 클릭**: 면적, 법선 벡터, 중심점
- **Edge 클릭**: 길이
- **두 요소 Shift+클릭**: 거리 측정

### 7.5 뷰어 연결이 안 될 때

```
증상: show()를 호출해도 뷰어에 아무것도 안 뜸
```

**체크리스트:**

```python
# 1. 포트 확인
from ocp_vscode import set_port
set_port(3939)  # VS Code OCP 패널에 표시된 포트와 일치시킨다

# 2. VS Code에서 OCP CAD Viewer가 열려 있는지 확인
#    사이드바 OCP 아이콘 → 뷰어 패널이 열려 있어야 함

# 3. Python 환경 확인
#    VS Code 하단 상태바의 Python 인터프리터가
#    ocp-vscode가 설치된 환경인지 확인

# 4. ~/.ocpvscode 파일 삭제 후 재시도
#    이전 세션의 잘못된 포트 정보가 남아 있을 수 있음

# 5. VS Code를 폴더로 열었는지 확인
#    단일 파일이 아닌 폴더를 열어야 함
```

---

## 8. 다른 뷰어 옵션들

OCP CAD Viewer 외에도 여러 뷰어가 있다:

### 8.1 비교 표

| 뷰어 | 환경 | 장점 | 단점 |
|------|------|------|------|
| **OCP CAD Viewer** | VS Code | 가장 통합적, 비주얼 디버거 | VS Code 필수 |
| **Jupyter + jupyter-cadquery** | 브라우저 | 노트북 문서화, 공유 쉬움 | 설정 복잡 |
| **YACV** | 브라우저 | 가볍고 독립적, 핫 리로딩 | 기능 제한적 |
| **ocp-vscode standalone** | 브라우저 | VS Code 없이 사용 가능 | 디버거 없음 |
| **FreeCAD** | 독립 앱 | STEP 직접 열기, 풍부한 기능 | 무거움, 실시간 연동 아님 |
| **(뷰어 없이)** | 터미널 | CI/CD, 서버, 자동화 | 시각 확인 불가 |

### 8.2 Jupyter notebook에서 사용

```bash
pip install jupyter-cadquery jupyterlab
jupyter lab
```

```python
# Jupyter 셀에서
from build123d import *
from jupyter_cadquery import show

box = Box(10, 20, 30)
show(box)  # 노트북 안에 인터랙티브 3D 뷰어 표시
```

explode 애니메이션, 측정, 단면 보기 등 지원.

### 8.3 YACV (Yet Another CAD Viewer)

```bash
pip install yacv-server
```

```python
from build123d import *
from yacv_server import show

box = Box(10, 20, 30)
show(box)  # 브라우저에서 http://localhost:... 로 열림
```

핫 리로딩 지원: 스크립트를 수정하고 저장하면 자동으로 브라우저가 갱신된다.

> 출처: [build123d External Tools](https://build123d.readthedocs.io/en/latest/external.html)

### 8.4 Headless (뷰어 없이 export만)

CI/CD 파이프라인이나 서버에서는 뷰어 없이 실행:

```python
# ocp_vscode import 없이
from build123d import *

part = Box(10, 20, 30) - Cylinder(3, 40)
export_step(part, "output.step")
export_stl(part, "output.stl")
```

GUI가 전혀 필요 없다. Docker, GitHub Actions 등에서 사용 가능.

### 8.5 FreeCAD로 결과물 확인

build123d에서 STEP으로 내보낸 후 FreeCAD에서 열어 추가 작업(GD&T, 2D 도면, FEA 등)을 할 수 있다:

```bash
# STEP 내보내기
export_step(part, "result.step")

# FreeCAD에서 열기 (FreeCAD 설치 필요)
# File → Open → result.step
```

---

## 9. Export

### 9.1 포맷별 용도

```
                ┌─── STEP (.step) ─── CAD 교환, CNC 가공, 제조
                │
build123d 모델 ─┼─── STL (.stl) ──── 3D 프린팅 (FDM/SLA)
                │
                ├─── 3MF (.3mf) ──── 3D 프린팅 (색상/재질 포함)
                │
                ├─── SVG (.svg) ──── 2D 도면, 레이저 커팅 패턴
                │
                ├─── DXF (.dxf) ──── 2D CAD 교환
                │
                └─── glTF (.glb) ─── 웹 3D 뷰어
```

### 9.2 코드 예제

```python
from build123d import *

part = Box(30, 20, 10) - Pos(0, 0, 5) * Cylinder(3, 15)

# STEP — 제조용 (가장 많이 사용)
export_step(part, "part.step")

# STL — 3D 프린팅 (tolerance로 품질 조절)
export_stl(part, "part.stl", tolerance=0.001, angular_tolerance=0.1)
# tolerance↓ = 파일 크기↑ + 품질↑

# 3MF — 색상/재질 포함 3D 프린팅
export_3mf(part, "part.3mf")

# SVG — 2D 투영 도면
exporter = ExportSVG(scale=2)
exporter.add_layer("outline", line_weight=0.5)
exporter.add_shape(part, layer="outline")
exporter.write("part.svg")

# DXF — 2D CAD
exporter = ExportDXF()
exporter.add_layer("cut")
exporter.add_shape(part, layer="cut")
exporter.write("part.dxf")
```

---

## 10. 자주 겪는 문제와 해결법

| # | 증상 | 원인 | 해결 |
|---|------|------|------|
| 1 | **show() 해도 뷰어 무반응** | 뷰어 미열림 / 포트 불일치 | OCP 패널 열기, `set_port()` 확인, `~/.ocpvscode` 삭제 |
| 2 | **Apple Silicon에서 import 에러** | pip cadquery-ocp 빌드 실패 | `mamba install cadquery-ocp -c conda-forge` |
| 3 | **extrude 방향이 반대** | 작업면 법선 방향 오해 | `show(sketch)` 로 중간 확인. 양수/음수 방향 테스트 |
| 4 | **fillet 실패 (StdFail_NotDone)** | 반경이 너무 크거나 인접 면과 충돌 | 반경 줄이기. 개별 edge를 테스트하여 문제 edge 특정 |
| 5 | **"No current context" 에러** | `with BuildPart()` 밖에서 형상 생성 | 형상 생성은 반드시 빌더 컨텍스트 안에서 |
| 6 | **make_face() 안 됨** | 선이 닫히지 않았거나 자기 교차 | `show(line)` 으로 선 형상 확인. 시작/끝점 일치 확인 |
| 7 | **비주얼 디버거에서 객체 안 보임** | 빌더에 이름 미지정 | `with BuildPart("name") as p:` |
| 8 | **셀 실행 시 "kernel not found"** | ipykernel 미설치 | `pip install ipykernel` |
| 9 | **STEP 열었는데 색상 없음** | STEP은 기본적으로 색상 미포함 | 3MF나 glTF 사용. 또는 CAD에서 수동 색상 지정 |
| 10 | **대형 모델에서 뷰어 느림** | 테셀레이션 데이터 과다 | `export_stl(tolerance=0.01)` 로 해상도 낮추기 |

---

## 11. 참고 자료

| 자료 | URL | 설명 |
|------|-----|------|
| **공식 문서** | https://build123d.readthedocs.io | 튜토리얼, API 레퍼런스, 예제 |
| **GitHub** | https://github.com/gumyr/build123d | 소스코드, 이슈, 디스커션 |
| **OCP CAD Viewer** | https://github.com/bernhard-42/vscode-ocp-cad-viewer | VS Code 확장 소스 |
| **ocp-vscode PyPI** | https://pypi.org/project/ocp-vscode/ | Python 패키지 |
| **Joint 튜토리얼** | https://build123d.readthedocs.io/en/latest/tutorial_joints.html | 어셈블리 가이드 |
| **Import/Export** | https://build123d.readthedocs.io/en/latest/import_export.html | 파일 입출력 |
| **디버깅 가이드** | https://build123d.readthedocs.io/en/latest/debugging_logging.html | 디버깅 방법 |
| **외부 도구 목록** | https://build123d.readthedocs.io/en/latest/external.html | 뷰어, 에디터, 플러그인 |
| **Apple Silicon 이슈** | https://github.com/gumyr/build123d/issues/646 | M1/M2/M3 설치 해결 |
| **Discord** | CadQuery 서버 내 build123d 채널 | 커뮤니티 Q&A |
