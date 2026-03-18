# CadQuery를 사용한 기어 모델링 자동화 심층 조사

> 작성일: 2026-03-18
> 조사 방법: Tavily Search (advanced), Perplexity sonar-pro

---

## 1. CadQuery의 현재 기능과 한계

### 1.1 버전 및 릴리스 현황

- **최신 안정 버전**: CadQuery **2.6.0** (2025년 10월 릴리스) [1]
- 이전 버전: 2.5.0 → 2.5.1 → 2.5.2 (PyPI 패키징 수정) → 2.6.0
- Python 3.9~3.12 지원, pip 및 conda 배포
- OCP(OpenCASCADE Python 바인딩)를 통해 OCCT 커널 사용

**출처**: [CadQuery GitHub Releases](https://github.com/CadQuery/cadquery/releases), [CadQuery GitHub Discussions #1851](https://github.com/CadQuery/cadquery/discussions/1851)

### 1.2 커뮤니티 규모

| 지표 | 수치 |
|---|---|
| GitHub Stars | ~4,600 |
| Watchers | 67 |
| Forks | 430 |
| 핵심 기여자 | ~50+ (에코시스템 전체) |
| cadquery-contrib Stars | 58 |
| awesome-cadquery Stars | 159 |
| Stack Overflow 태그 | 활성 (다수 질문) |

CadQuery 1.x는 FreeCAD API 기반이었으나, 2.0부터 OCCT 직접 바인딩(OCP/pybind11)으로 전환하여 독립적인 프로젝트가 되었다.

**출처**: [CadQuery GitHub](https://github.com/cadquery/cadquery), [awesome-cadquery](https://github.com/CadQuery/awesome-cadquery)

### 1.3 산업 활용도

| 사례 | 설명 |
|---|---|
| **FxBricks** | 레고 호환 기차 시스템 제품 개발 파이프라인에 CadQuery 사용 |
| **치과 보철물** | cadquery-plugins 기반 맞춤형 의료 기기 자동 설계 |
| **Text-to-CadQuery** (2025) | 자연어 → LLM → CadQuery 코드 → 3D 모델. Top-1 exact match 69.3% |
| **CAD-Coder** (2025, MIT) | 비전-언어 모델 기반 CadQuery 코드 생성 |
| **CADDesigner** (2025) | 범용 에이전트 기반 CAD 개념 설계, CadQuery 백엔드 |
| **C3D-v0** (2026) | Gemma 3n 기반 CadQuery 코드 생성 모델 (Ollama) |
| **SplineCloud** | Streamlit + CadQuery 웹 앱으로 파라메트릭 기어 모델 생성 서비스 |

LLM 기반 CAD 자동 생성 연구에서 CadQuery는 **사실상 표준 타겟 언어**로 자리잡고 있다. LLM4CAD(2025)는 ~5,000개의 CadQuery 스크립트 데이터셋을 구축했다.

**출처**: [arXiv:2505.06507](https://arxiv.org/html/2505.06507v1), [Ollama C3D-v0](https://ollama.com/joshuaokolo/C3Dv0), [SplineCloud Blog](https://splinecloud.com/blog/creating-parametric-gear-models-with-streamlit-and-cadquery/), [Emergent Mind - CadQuery](https://www.emergentmind.com/topics/cadquery)

---

## 2. CadQuery로 기어를 모델링한 실제 사례/코드/프로젝트

### 2.1 cq_gears (핵심 라이브러리)

- **저장소**: [meadiode/cq_gears](https://github.com/meadiode/cq_gears)
- **버전**: v0.51
- **상태**: "Work in progress... Might be unstable, but somewhat usable."
- **요구사항**: CadQuery **개발자 버전(dev)** 필수. 릴리스 버전 2.1에서 동작하지 않음.
- numpy 의존성

**최소 코드 예제:**
```python
import cadquery as cq
from cq_gears import SpurGear

spur_gear = SpurGear(module=1.0, teeth_number=19, width=5.0, bore_d=5.0)
wp = cq.Workplane('XY').gear(spur_gear)
```

기어 객체 인스턴스화 시 즉시 솔리드가 생성되지 않으며, 곡선/파라미터가 사전 계산된다. `Workplane.gear()` 또는 `Workplane.addGear()`를 호출해야 실제 빌드가 수행된다.

**기어 트레인 예제:**
```python
spur_gear = SpurGear(module=1.0, teeth_number=19, width=5.0)
wp = (cq.Workplane('XY')
      .rarray(spur_gear.r_ref * 2, 0, 3, 1)
      .gear(spur_gear, bore_d=5.0))
```

### 2.2 cadquery-contrib Involute Gear

- **저장소**: [CadQuery/cadquery-contrib - Involute_Gear.py](https://github.com/CadQuery/cadquery-contrib/blob/master/examples/Involute_Gear.py)
- 수학적 인볼루트 커브를 `parametricCurve()`로 직접 생성
- `twistExtrude()`로 헬리컬 기어 변환 가능
- N 파라미터로 곡선 점 밀도(tooth profile 정밀도) 조절

### 2.3 Gear-Generator-Cadquery

- **저장소**: [abdullahburakt06-ctrl/Gear-Generator-Cadquery](https://github.com/abdullahburakt06-ctrl/Gear-Generator-Cadquery) (2026년 2월)
- Spur 및 Helical 기어 생성 스크립트
- CAD 소프트웨어 의존 없이 독립 실행 가능

### 2.4 SplineCloud Streamlit 앱

- **URL**: [splinecloud.com/blog/creating-parametric-gear-models-with-streamlit-and-cadquery](https://splinecloud.com/blog/creating-parametric-gear-models-with-streamlit-and-cadquery/)
- `GearGenerator` 클래스: 인볼루트 커브 기반, module/teeth/height/center_hole 파라미터
- 실시간 슬라이더로 파라미터 조정, STL export
- cadquery-contrib의 기어 로직 기반

### 2.5 cq_warehouse (스프로켓/체인)

- **문서**: [cq-warehouse.readthedocs.io](https://cq-warehouse.readthedocs.io/en/latest/sprocket.html)
- `Sprocket` 클래스: 파라메트릭 스프로켓 생성
- `Chain` 클래스: 스프로켓 세트에 감긴 체인 어셈블리 생성
- STEP/STL export 지원, 4줄 코드로 생성/저장

---

## 3. 지원 가능한 기어 유형

### 3.1 cq_gears 지원 기어 유형

| 기어 유형 | 지원 | 변형 |
|---|---|---|
| **Spur Gear** (평기어) | O | 기본 involute profile |
| **Helical Gear** (헬리컬) | O | 각도 지정 가능 |
| **Herringbone Gear** (헤링본) | O | 양방향 헬리컬 |
| **Ring Gear** (내접 기어) | O | helical/herringbone 변형 포함 |
| **Bevel Gear** (베벨) | O | straight + helical |
| **Gear Rack** (랙) | O | 직선 기어 |
| **Planetary Gearset** | O | 다중 기어 어셈블리 |
| **Worm Gear** | **X** | cq_gears에 미포함 |

### 3.2 Worm Gear 대안

Worm gear는 cq_gears에서 지원되지 않는다. 대안 경로:

1. **직접 구현**: CadQuery의 `Workplane.spline()` + `sweep()` 또는 `twistExtrude()`를 사용하여 웜의 나선형 프로파일 직접 생성
2. **OpenSCAD chrisspen/gears**: Worm gear를 포함한 full-featured gear toolkit (단, STL만 출력, STEP 불가)
3. **build123d 생태계**: build123d의 확장 라이브러리에서 worm gear 지원 가능성 (확인 필요)
4. **수학적 모델링**: Spiroid/worm gear의 수학적 모델링 논문 참조하여 xyz 데이터 포인트를 CadQuery로 변환

**출처**: [chrisspen/gears GitHub](https://github.com/chrisspen/gears), [PowerTransmission.com - Mathematical Modeling for Worm Gears](https://www.powertransmission.com/mathematical-modeling-for-the-design-of-spiroid-helical-spiral-bevel-and-worm-gears)

---

## 4. 인볼루트 치형 생성 및 파라메트릭 설계

### 4.1 인볼루트 치형 생성

CadQuery에서 인볼루트(involute) 치형 생성은 두 가지 경로로 가능하다:

**경로 1: cq_gears 라이브러리 사용**
- 내부적으로 involute curve를 사전 계산
- `SpurGear(module, teeth_number, width, bore_d, pressure_angle)` 파라미터로 제어
- 사용자가 수학을 직접 다룰 필요 없음

**경로 2: 직접 구현 (cadquery-contrib 방식)**
```python
def involute_gear(m, z, alpha=20, shift=0, N=20):
    alpha = radians(alpha)
    r_ref = m * z / 2           # 기준원 반경
    r_top = r_ref + m*(1+shift) # 이끝원 반경
    r_base = r_ref * cos(alpha) # 기초원 반경
    r_d = r_ref - 1.25 * m      # 이뿌리원 반경

    inv = lambda a: tan(a) - a  # 인볼루트 함수
    # parametricCurve()로 인볼루트 커브 직접 생성
    # N 파라미터로 곡선 점 밀도 = tooth profile 정밀도 조절
```

핵심 수학: 인볼루트 함수 `inv(alpha) = tan(alpha) - alpha`를 기반으로 기초원에서 이끝원까지의 곡선을 파라메트릭으로 생성한다.

### 4.2 파라메트릭 설계 능력

CadQuery의 파라메트릭 설계 능력은 **A 등급**이다:

- **모듈(module)**: 치의 크기를 결정하는 핵심 파라미터
- **잇수(teeth_number)**: 기어의 치 개수
- **압력각(pressure_angle)**: 기본 20도, 변경 가능
- **전위계수(shift)**: 프로파일 전위 지원
- **폭(width)**: 기어 폭
- **보어(bore_d)**: 중심 구멍 직경
- **허브(hub_d, hub_length)**: 허브 형상 옵션
- **비틀림각**: 헬리컬 기어용

모든 파라미터가 Python 변수이므로 루프, 조건문, 함수 등으로 자유롭게 제어할 수 있다.

**출처**: [cq_gears GitHub](https://github.com/meadiode/cq_gears), [cadquery-contrib Involute_Gear.py](https://github.com/CadQuery/cadquery-contrib/blob/master/examples/Involute_Gear.py), [SplineCloud Blog](https://splinecloud.com/blog/creating-parametric-gear-models-with-streamlit-and-cadquery/)

---

## 5. STEP/IGES 등 표준 포맷 내보내기 지원

### 5.1 지원 포맷

| 포맷 | Import | Export | 비고 |
|---|---|---|---|
| **STEP** | O | O | 핵심 포맷, loss-less BREP |
| **DXF** | O | O | 2D 교환 |
| **BREP** | O | O | OCCT 내부 포맷 |
| **STL** | - | O | 메시 기반, 손실 있음 |
| **AMF** | - | O | 색상 정보 포함 |
| **3MF** | - | O | 최신 3D 프린팅 포맷 |
| **SVG** | - | O | 2D 벡터 |
| **VRML** | - | O | 시각화 |
| **glTF** | - | O | 어셈블리용 |
| **XML/XBF** | O | O | 어셈블리 저장/로드 |
| **IGES** | O | O | 레거시 지원 |

### 5.2 STEP Export 품질

- OCCT 기반 **loss-less STEP export**
- 어셈블리 단위 STEP export: 이름, 색상, 레이어 메타데이터 포함 가능
- `Assembly.export("out.step")` 한 줄로 export
- FUSED 모드: 모든 파트를 하나의 솔리드로 결합 export 가능
- `Assembly.addSubshape()`: 개별 면/모서리에 이름/색상/레이어 지정 후 STEP에 포함

### 5.3 cq-kit 라이브러리

- 유효자릿수 제어, P-Curve 엔티티 제거로 STEP 파일 크기 **50% 감소** 가능
- 저장소: [michaelgale/cq-kit](https://github.com/michaelgale/cq-kit)

**코드 예제:**
```python
import cadquery as cq

# 단일 파트 export
gear = cq.Workplane().box(10, 10, 10)
gear.export("/path/to/gear.step")

# 어셈블리 export
assy = cq.Assembly()
assy.add(gear, name="gear1", color=cq.Color("green"))
assy.export("gearbox.step")

# FUSED 모드
assy.export("fused.stp", cq.exporters.ExportTypes.STEP,
            mode=cq.exporters.assembly.ExportModes.FUSED)
```

**출처**: [CadQuery Import/Export 문서](https://cadquery.readthedocs.io/en/latest/importexport.html), [cq-kit GitHub](https://github.com/michaelgale/cq-kit), [FOSDEM 2022 CadQuery 발표자료](https://archive.fosdem.org/2022/schedule/event/cadquery/attachments/slides/4895/export/events/attachments/cadquery/slides/4895/cadquery_pdf_fosdem_2022_presentation.pdf)

---

## 6. FreeCAD, OpenCASCADE와의 관계 및 호환성

### 6.1 역사적 관계

```
CadQuery 1.x  →  FreeCAD API 기반 (FreeCAD 의존)
    ↓
CadQuery 2.0+ →  OCP (pybind11 기반 OCCT 바인딩) 직접 사용 (FreeCAD 독립)
    ↓
build123d     →  OCP 사용 (CadQuery 진화형)
```

- CadQuery 1.x는 FreeCAD API 위에 구축되었으나, 고급 작업/셀렉터에서 API 한계에 도달
- CadQuery 2.0부터 OCCT를 직접 pybind11로 감싸는 **OCP** 프로젝트를 사용
- 이로써 FreeCAD 없이 독립 실행 가능해짐

### 6.2 OCCT 커널 관계

| 항목 | CadQuery 2.x | FreeCAD |
|---|---|---|
| **커널** | OCCT (OCP/pybind11) | OCCT (C++ 직접 + Python API) |
| **커널 버전** | 7.5 → 7.6+ 업데이트 진행 | OCCT 7.x |
| **인터페이스** | Python 전용, GUI 없음 | GUI 중심 + Python 스크립팅 |
| **설치** | pip/conda | 독립 앱 또는 snap/flatpak |
| **설계 철학** | 스크립트 우선, 자동화 최적 | 대화형 모델링 우선 |

### 6.3 호환성

- CadQuery와 FreeCAD 간 **STEP 파일**을 통한 완전한 상호 교환 가능
- CadQuery에서 생성한 STEP을 FreeCAD에서 열어 추가 편집 가능 (그 반대도 가능)
- 동일한 OCCT 커널 기반이므로 기하 정밀도 손실 없음
- FreeCAD의 CadQuery Workbench(구버전)은 더 이상 권장되지 않음

**출처**: [CadQuery GitHub README](https://github.com/cadquery/cadquery), [FOSDEM 2022 CadQuery Presentation](https://archive.fosdem.org/2022/schedule/event/cadquery/attachments/slides/4895/export/events/attachments/cadquery/slides/4895/cadquery_pdf_fosdem_2022_presentation.pdf), [PyPI cadquery](https://pypi.org/project/cadquery/)

---

## 7. 경쟁 대안 비교

### 7.1 종합 비교 매트릭스

| 항목 | CadQuery | build123d | FreeCAD (Script) | OpenSCAD |
|---|---|---|---|---|
| **커널** | OCCT (BREP) | OCCT (BREP) | OCCT (BREP) | CGAL (CSG) |
| **API 스타일** | Fluent (메서드 체이닝) | Context Manager (Pythonic) | GUI + Python 혼합 | 자체 DSL |
| **언어** | Python | Python | Python (+ C++) | OpenSCAD DSL |
| **STEP export** | O (고품질) | O (고품질) | O | **X** |
| **IGES export** | O | O | O | X |
| **STL export** | O | O | O | O |
| **NURBS 지원** | O | O | O | **X** |
| **기어 라이브러리** | cq_gears, cq_warehouse | bd_warehouse | PartDesign InvoluteGear | chrisspen/gears |
| **Worm Gear** | X | 미확인 | 가능 (수동) | O (chrisspen/gears) |
| **Assembly** | O (constraint solver) | O | O (강력) | 제한적 |
| **GUI 없이 사용** | O (핵심 설계) | O | 가능하나 불편 | O |
| **서버/CI 통합** | O (최적) | O (최적) | 제한적 | O |
| **LLM 코드 생성 타겟** | O (다수 연구) | 가능 | 제한적 | 일부 |
| **커뮤니티 규모** | ~4.6K stars | ~2K+ stars | ~20K+ stars | ~7K+ stars |

### 7.2 핵심 차별점

**CadQuery vs OpenSCAD**
- OpenSCAD는 CSG(Constructive Solid Geometry) 기반으로 **STEP export 불가**, NURBS/splines 미지원
- 제조용 CAD 데이터(STEP)를 생성할 수 없어 산업용으로 **근본적으로 부적합**
- 다만 OpenSCAD의 chrisspen/gears 라이브러리는 worm gear 포함 가장 완전한 기어 지원

**CadQuery vs build123d**
- build123d는 CadQuery의 "진화형"으로, 동일한 OCP/OCCT 커널 사용
- Fluent API 대신 stateful context manager 사용 (더 Pythonic)
- 프로덕션 환경(CNC 가공, 레이저 커팅)에 더 적합하다는 평가
- 기어 생성용 `bd_warehouse` 존재
- pylint, mypy, codecov 등 코드 품질 도구 적극 활용
- **신규 프로젝트에서는 build123d 고려 권장**

**CadQuery vs FreeCAD Scripting**
- FreeCAD는 GUI가 기본, Python 스크립팅은 내부 객체 모델의 직접 표현
- "사용 편의성이나 합리적 의미론을 위해 설계된 것이 아님" (HN 의견)
- 서버/CI 통합이 어렵고, 런타임이 무거움
- 단, InvoluteGear 워크벤치, FEM, Path(CAM) 등 내장 기능이 풍부

**출처**: [build123d GitHub](https://github.com/gumyr/build123d), [build123d vs OpenSCAD 문서](https://build123d.readthedocs.io/en/latest/OpenSCAD.html), [Hacker News OpenSCAD 토론](https://news.ycombinator.com/item?id=46337984), [chrisspen/gears GitHub](https://github.com/chrisspen/gears)

---

## 8. 대량 변형(Variant) 자동 생성 가능성

### 8.1 핵심 역량: A 등급

CadQuery는 "Python 라이브러리로서 GUI 없이 설계"되었으므로 대량 변형 생성에 **최적화**되어 있다.

**배치 생성 예제:**
```python
import cadquery as cq
from cq_gears import SpurGear

# 모듈과 잇수를 조합한 변형 자동 생성
variants = []
for module in [0.5, 1.0, 1.5, 2.0]:
    for teeth in [12, 16, 20, 24, 32]:
        gear = SpurGear(module=module, teeth_number=teeth, width=module*5)
        solid = cq.Workplane('XY').gear(gear, bore_d=module*3)
        filename = f"gear_m{module}_t{teeth}.step"
        solid.export(filename)
        variants.append(filename)

print(f"Generated {len(variants)} variants")  # 20 variants
```

### 8.2 자동화 파이프라인 구성

```
파라미터 스프레드시트/DB
    ↓
Python 스크립트 (for 루프)
    ↓
CadQuery 기어 생성
    ↓
STEP/STL export
    ↓
CI/CD 파이프라인 (GitHub Actions 등)
    ↓
CAM 소프트웨어 또는 3D 프린터
```

- **CQGI (CadQuery Gateway Interface)**: 스크립트 변수를 외부에서 주입하여 자동 export 가능
- **Jupyter 통합**: 노트북에서 파라미터 스윕, 시각화, export를 한 워크플로우로
- **Streamlit 통합**: 웹 UI로 파라미터 조정 → 실시간 3D 시각화 → STL/STEP download

### 8.3 성능 고려사항

- **Union 연산 성능 저하**: 섹션 수 증가 시 급격히 느려짐 (Issue #336)
- **멀티스레딩 한계**: 수백 개 형상을 멀티스레드로 생성해도 싱글스레드보다 빠르지 않음 (Issue #579)
- 개별 기어를 독립적으로 생성/export하는 것은 빠름; **어셈블리로 결합하는 과정**에서 병목 발생
- cq-server는 cq-editor 대비 "수 배 이상 우수"한 시각화 성능

**출처**: [CadQuery Intro 문서](https://cadquery.readthedocs.io/en/latest/intro.html), [Emergent Mind - CadQuery Library](https://www.emergentmind.com/topics/cadquery-library), [CadQuery Issue #336](https://github.com/CadQuery/cadquery/issues/336), [CadQuery Issue #579](https://github.com/CadQuery/cadquery/issues/579)

---

## 9. Assembly 기능 (기어 트레인, 기어박스 조립)

### 9.1 어셈블리 시스템

CadQuery는 8가지 constraint 타입을 제공하는 어셈블리 시스템을 갖추고 있다:

| Constraint | 설명 |
|---|---|
| Point | 점 일치 |
| Axis | 축 정렬 |
| Plane | 면 정렬 |
| PointInPlane | 점이 면 위에 |
| PointOnLine | 점이 선 위에 |
| FixedPoint | 고정 점 |
| FixedRotation | 고정 회전 |
| FixedAxis | 고정 축 |

### 9.2 기어박스 구성 예제

```python
import cadquery as cq
from cq_gears import SpurGear

# 기어 생성
pinion = SpurGear(module=1.0, teeth_number=12, width=5.0)
gear = SpurGear(module=1.0, teeth_number=36, width=5.0)

pinion_solid = cq.Workplane('XY').gear(pinion, bore_d=4.0)
gear_solid = cq.Workplane('XY').gear(gear, bore_d=8.0)

# 어셈블리 구성
assy = cq.Assembly()
assy.add(pinion_solid, name="pinion", loc=cq.Location((0, 0, 0)))
center_dist = (pinion.r_ref + gear.r_ref)
assy.add(gear_solid, name="gear", loc=cq.Location((center_dist, 0, 0)))

# STEP export
assy.export("gear_pair.step")
```

### 9.3 한계

- **Tooth Meshing 구속 미지원**: 기어 이의 맞물림(tooth meshing)을 constraint로 표현할 수 없음 (GitHub Issue #1607)
- 기어 간의 정확한 각도 동기화(예: 정확히 이와 이 사이에 맞물리도록)는 수동으로 회전 각도를 계산하여 지정해야 함
- **운동 시뮬레이션 불가**: 정적 어셈블리만 가능, 기어 회전 애니메이션/시뮬레이션 미지원
- 대규모 어셈블리(10+ 기어) 성능 데이터 없음

**출처**: [CadQuery Assembly 문서](https://cadquery.readthedocs.io/en/latest/assy.html), [CadQuery Issue #1607](https://github.com/CadQuery/cadquery/issues/1607)

---

## 10. 실무 CAM 워크플로우와의 연결 가능성

### 10.1 CAM 연동 경로

CadQuery 자체는 **toolpath 생성 기능이 없다**. 실무 CAM 워크플로우는 다음 경로로 연결된다:

```
CadQuery (Python 스크립트)
    ↓ STEP export
외부 CAM 소프트웨어
    ↓
G-code / NC 파일
    ↓
CNC 머신
```

### 10.2 외부 CAM 소프트웨어 옵션

| CAM 소프트웨어 | STEP Import | 비고 |
|---|---|---|
| **Fusion 360** | O | 가장 접근성 높은 CAM (개인 무료) |
| **FreeCAD Path** | O | 오픈소스 CAM |
| **MasterCAM** | O | 산업 표준 |
| **NX CAM** | O | 대기업 표준 |
| **Cambam** | DXF 필요 | 2.5D 가공 특화 |

### 10.3 자동화된 CAM 파이프라인 구성 가능성

```
파라미터 DB → CadQuery 기어 생성 → STEP → FreeCAD Path (Python API) → G-code
```

FreeCAD Path는 Python API를 제공하므로 이론적으로 CadQuery → FreeCAD Path → G-code까지 **완전 자동화**가 가능하다. 단, FreeCAD의 Python API가 headless 환경에서 안정적으로 동작하는지는 추가 검증 필요.

### 10.4 3D 프린팅 워크플로우

```
CadQuery → STL/3MF export → 슬라이서 (Cura, PrusaSlicer) → G-code → 3D 프린터
```

3D 프린팅 워크플로우는 단순하고 **즉시 사용 가능**하다. STL/3MF export가 기본 지원된다.

### 10.5 FEA 연동 (간접)

```
CadQuery → geometry.toOCC() → gmsh (메싱) → meshio (변환) → FEniCS/SfePy (FEA)
```

주의: OCCT → Gmsh 변환 시 `UContinuity error` 발생 가능 (Issue #1556).

### 10.6 GD&T (기하공차) 제한

CadQuery는 **GD&T(기하공차 표현)를 지원하지 않는다**. STEP AP242 PMI 수준의 공차 정보를 모델에 포함할 수 없으며, STEP export 후 별도 도구에서 추가해야 한다.

**출처**: [CadQuery Import/Export 문서](https://cadquery.readthedocs.io/en/latest/importexport.html), [V-Squared CAD-CAM-CNC Workflow](https://v-squared.github.io/plan/flow/mechanical/cad-cam-cnc/), [CadQuery Issue #1556](https://github.com/CadQuery/cadquery/issues/1556)

---

## 종합 평가

### 적합성 매트릭스

| 평가 항목 | 등급 | 근거 |
|---|---|---|
| Spur/Helical 기어 생성 | **A** | cq_gears + involute profile 직접 생성 가능 |
| Bevel 기어 | **B+** | cq_gears 지원 (straight + helical) |
| Worm 기어 | **C** | 전용 라이브러리 없음, 직접 구현 필요 |
| Tooth profile 정밀도 | **A-** | Involute curve 파라메트릭 제어, N값 정밀도 조정 |
| 기어박스 어셈블리 | **B** | 기본 constraint 지원, tooth meshing 미흡 |
| STEP export 품질 | **A** | OCCT 기반 loss-less, 메타데이터 포함 |
| 대량 변형 생성 | **A** | Python 루프/자동화에 최적화 |
| FEA 연동 | **C+** | 간접 경로 존재, 안정성 이슈 |
| CAM 연동 | **B-** | STEP export 후 외부 CAM 의존 |
| 대규모 어셈블리 | **C** | union 성능 저하, 멀티스레딩 한계 |
| 자동화 파이프라인 | **A** | GUI-less 설계, 서버/CI 통합 최적 |
| LLM 코드 생성 타겟 | **A+** | 학술 연구 다수 입증 |

### 권고사항

1. **Spur/Helical/Bevel 기어 모델링에 CadQuery는 충분히 유효하다.** cq_gears + STEP export로 산업용 데이터 생성 가능.
2. **Worm gear는 직접 구현이 필요하다.** CadQuery의 spline/sweep 기능으로 구현 가능하나 전용 라이브러리가 없다.
3. **대량 변형 자동 생성에 최적이다.** Python 스크립트로 수백 개의 기어 변형을 배치 생성/export 가능.
4. **build123d로의 전환을 중장기적으로 고려하라.** CadQuery의 진화형이며, 더 Pythonic하고 프로덕션 지향적이다.
5. **CAM 워크플로우는 STEP export → 외부 CAM 경로가 현실적이다.** 완전 자동화는 FreeCAD Path Python API와 결합해야 한다.
6. **LLM 기반 자동 CAD 생성에 CadQuery는 최적의 타겟 언어이다.** 다수의 2025년 학술 연구가 이를 입증한다.

### 불확실성

- cq_gears의 장기 유지보수 상태 불확실 ("Work in progress" 상태, dev 버전 종속)
- CadQuery 2.6과 cq_gears 호환성 미확인 (cq_gears는 dev 버전 요구)
- 대규모 기어 트레인(10+ 기어) 어셈블리의 실제 성능 데이터 없음
- 대규모 제조업 적용 사례 제한적 (FxBricks 외)
- build123d의 기어 생태계(bd_warehouse, py_gearworks) 상세 정보 부족

---

## 출처 목록

1. [CadQuery GitHub Discussions #1851 - CadQuery 2.6.0 Release](https://github.com/CadQuery/cadquery/discussions/1851)
2. [CadQuery GitHub Releases](https://github.com/CadQuery/cadquery/releases)
3. [CadQuery GitHub Repository](https://github.com/cadquery/cadquery)
4. [meadiode/cq_gears - CadQuery Involute Gear Generator](https://github.com/meadiode/cq_gears)
5. [CadQuery/cadquery-contrib - Involute_Gear.py](https://github.com/CadQuery/cadquery-contrib/blob/master/examples/Involute_Gear.py)
6. [abdullahburakt06-ctrl/Gear-Generator-Cadquery](https://github.com/abdullahburakt06-ctrl/Gear-Generator-Cadquery)
7. [SplineCloud - Parametric Gear Models with Streamlit and CadQuery](https://splinecloud.com/blog/creating-parametric-gear-models-with-streamlit-and-cadquery/)
8. [cq_warehouse 문서](https://cq-warehouse.readthedocs.io/en/latest/sprocket.html)
9. [CadQuery Assembly 문서](https://cadquery.readthedocs.io/en/latest/assy.html)
10. [CadQuery Import/Export 문서](https://cadquery.readthedocs.io/en/latest/importexport.html)
11. [cq-kit GitHub](https://github.com/michaelgale/cq-kit)
12. [awesome-cadquery GitHub](https://github.com/CadQuery/awesome-cadquery)
13. [build123d GitHub](https://github.com/gumyr/build123d)
14. [build123d vs OpenSCAD 문서](https://build123d.readthedocs.io/en/latest/OpenSCAD.html)
15. [chrisspen/gears - OpenSCAD Gear Generator](https://github.com/chrisspen/gears)
16. [FOSDEM 2022 CadQuery Ecosystem Presentation](https://archive.fosdem.org/2022/schedule/event/cadquery/attachments/slides/4895/export/events/attachments/cadquery/slides/4895/cadquery_pdf_fosdem_2022_presentation.pdf)
17. [Text-to-CadQuery (arXiv:2505.06507)](https://arxiv.org/html/2505.06507v1)
18. [C3D-v0 - AI CadQuery Code Generation (Ollama)](https://ollama.com/joshuaokolo/C3Dv0)
19. [Emergent Mind - CadQuery Library](https://www.emergentmind.com/topics/cadquery-library)
20. [PyPI cadquery](https://pypi.org/project/cadquery/)
21. [CadQuery Issue #336 - Union Performance](https://github.com/CadQuery/cadquery/issues/336)
22. [CadQuery Issue #579 - Threading](https://github.com/CadQuery/cadquery/issues/579)
23. [CadQuery Issue #1556 - Gmsh UContinuity Error](https://github.com/CadQuery/cadquery/issues/1556)
24. [CadQuery Issue #1607 - Tooth Meshing Constraint](https://github.com/CadQuery/cadquery/issues/1607)
25. [PowerTransmission.com - Mathematical Modeling for Spiroid/Worm Gears](https://www.powertransmission.com/mathematical-modeling-for-the-design-of-spiroid-helical-spiral-bevel-and-worm-gears)
26. [Hacker News - OpenSCAD Discussion](https://news.ycombinator.com/item?id=46337984)
