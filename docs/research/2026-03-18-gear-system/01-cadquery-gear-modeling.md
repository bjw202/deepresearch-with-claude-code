# CadQuery 기어 모델링 심층 리서치

## 1. CadQuery의 기어 모델링 능력

### 1.1 지원 기어 유형

CadQuery 생태계에서 기어 모델링은 주로 **cq_gears** 라이브러리를 통해 이루어진다.

| 기어 유형 | 지원 여부 | 비고 |
| --- | --- | --- |
| Spur Gear (평기어) | O | 기본 involute profile |
| Helical Gear (헬리컬 기어) | O | 각도 지정 가능 |
| Herringbone Gear (헤링본 기어) | O | 양방향 헬리컬 |
| Ring Gear (내접 기어) | O | helical/herringbone 변형 포함 |
| Bevel Gear (베벨 기어) | O | straight + helical |
| Worm Gear | X | cq_gears에 미포함 |
| Gear Rack (랙) | O | 직선 기어 |
| Planetary Gearset | O | 다중 기어 어셈블리 |

**주의**: cq_gears는 CadQuery \*\*개발자 버전(dev)\*\*이 필수이며, 릴리스 버전 2.1에서는 동작하지 않는다.

출처: [meadiode/cq_gears (GitHub)](https://github.com/meadiode/cq_gears)

### 1.2 코드 예제

**cq_gears를 사용한 Spur Gear 생성:**

```python
import cadquery as cq
from cq_gears import SpurGear

spur_gear = SpurGear(module=1.0, teeth_number=19, width=5.0, bore_d=5.0)
wp = cq.Workplane('XY').gear(spur_gear)
```

핵심 파라미터: `module`(치 크기), `teeth_number`(치수), `width`(폭), `bore_d`(보어 직경), `hub_d`/`hub_length`(허브 옵션)

**Involute profile 직접 생성 (cadquery-contrib):**

```python
import cadquery as cq
from math import *

def involute_gear(m, z, alpha=20, shift=0, N=20):
    alpha = radians(alpha)
    r_ref = m*z/2
    r_top = r_ref + m*(1+shift)
    r_base = r_ref*cos(alpha)
    r_d = r_ref - 1.25*m

    inv = lambda a: tan(a) - a
    alpha_inv = inv(alpha)
    alpha_tip = acos(r_base/r_top)
    alpha_tip_inv = inv(alpha_tip)

    # involute curve parametric definition
    # parametricCurve()로 involute curve 직접 생성
    # twistExtrude()로 헬리컬 기어 변환 가능
    # N 파라미터로 곡선 점 밀도 = tooth profile 정밀도 조절
```

출처: [cadquery-contrib/Involute_Gear.py](https://github.com/CadQuery/cadquery-contrib/blob/master/examples/Involute_Gear.py)

### 1.3 cq_warehouse - 스프로켓/체인 시스템

- `Sprocket` 클래스: 파라메트릭 스프로켓 생성
- `Chain` 클래스: 스프로켓 세트에 감긴 체인 어셈블리 생성
- STEP/STL export 지원, 4줄 코드로 생성/저장

출처: [cq_warehouse 문서](https://cq-warehouse.readthedocs.io/en/latest/sprocket.html)

### 1.4 Assembly 기능 (기어박스 구성)

CadQuery는 8가지 constraint 타입을 제공하는 어셈블리 시스템을 갖추고 있다:

- Point, Axis, Plane, PointInPlane, PointOnLine, FixedPoint/FixedRotation/FixedAxis

기어박스 구성은 가능하지만, **기어 이 맞물림(tooth meshing) 구속에는 한계**가 있다 (GitHub Issue #1607).

출처: [CadQuery Assembly 문서](https://cadquery.readthedocs.io/en/latest/assy.html)

---

## 2. CadQuery vs 다른 도구 비교

### 2.1 비교 매트릭스

| 항목 | CadQuery | build123d | FreeCAD (Script) | OpenSCAD |
| --- | --- | --- | --- | --- |
| **커널** | OCCT (BREP) | OCCT (BREP) | OCCT (BREP) | CGAL (CSG) |
| **API 스타일** | Fluent (메서드 체이닝) | Context Manager (Pythonic) | GUI + Python 혼합 | 자체 DSL |
| **STEP export** | O (고품질) | O (고품질) | O | **X** |
| **IGES export** | O | O | O | X |
| **STL export** | O | O | O | O |
| **NURBS 지원** | O | O | O | X |
| **기어 라이브러리** | cq_gears | bd_warehouse, py_gearworks | PartDesign InvoluteGear | chrisspen/gears |
| **Assembly** | O (constraint solver) | O | O (강력) | 제한적 |
| **GUI 없이 사용** | O (핵심 설계) | O | 가능하나 불편 | O |
| **서버 통합** | O | O | 제한적 | 제한적 |

### 2.2 핵심 차이점

**CadQuery vs OpenSCAD**: OpenSCAD는 CSG 기반으로 STEP export가 불가능하며, NURBS/splines를 지원하지 않는다. 제조용 CAD 데이터로서 근본적으로 부적합.

**CadQuery vs build123d**: build123d는 CadQuery의 "진화형"으로, Fluent API 대신 stateful context manager를 사용. 프로덕션 환경(CNC 가공, 레이저 커팅)에 더 적합하다는 평가. 기어 생성용 `bd_warehouse`와 `py_gearworks` 존재.

**CadQuery vs FreeCAD**: FreeCAD는 GUI가 기본. CadQuery는 "Python 라이브러리로서 GUI 없이 설계"되어 서버 통합, CI/CD 파이프라인에 적합.

출처: [Hackaday - CadQuery Comes Of Age](https://hackaday.com/2022/02/04/cadquery-comes-of-age/), [build123d vs CadQuery](https://www.oreateai.com/blog/build123d-vs-cadquery-navigating-the-future-of-python-cad-modeling/b9e17e3134422786a0ab67c0a6d1eeda)

### 2.3 STEP/IGES Export 품질

- OCCT 기반 **loss-less STEP export**
- cq-kit 라이브러리: 유효자릿수 제어, P-Curve 엔티티 제거로 파일 크기 50% 감소 가능
- 어셈블리 단위 STEP/XBF/XML export 지원

출처: [CadQuery Import/Export 문서](https://cadquery.readthedocs.io/en/latest/importexport.html), [cq-kit (GitHub)](https://github.com/michaelgale/cq-kit)

---

## 3. CadQuery의 한계

### 3.1 FEA/시뮬레이션 연동

CadQuery 자체는 FEA 기능이 **없다**. 간접 연동 경로:

```
CadQuery → geometry.toOCC() → gmsh (메싱) → meshio (변환) → FEniCS/SfePy (FEA)
```

주의: OCCT → Gmsh 변환 시 `UContinuity error` 발생 가능 (Issue #1556).

### 3.2 GD&T (기하공차) 표현

**미지원**. STEP AP242 PMI 수준의 공차 정보를 모델에 포함 불가. STEP export 후 별도 도구에서 추가 필요.

### 3.3 대규모 어셈블리 성능

- **Union 연산 성능 저하**: 섹션 수 증가 시 급격히 느려짐 (Issue #336)
- **스레딩 한계**: 수백 개 형상 멀티스레드 생성해도 싱글스레드보다 빠르지 않음 (Issue #579)
- cq-server는 cq-editor 대비 "수 배 이상 우수"한 시각화 성능

### 3.4 CAM 연동

**Toolpath 생성 불가**. STEP export → 외부 CAM (Fusion 360, FreeCAD Path, MasterCAM 등) 경로만 가능.

---

## 4. 실제 산업 적용 사례

### 4.1 프로덕션 사용

- **FxBricks**: 레고 호환 기차 시스템 제품 개발에 CadQuery 파이프라인 사용
- **치과 보철물**: cadquery-plugins를 이용한 맞춤형 의료 기기 자동 설계

### 4.2 자동화된 CAD 생성 파이프라인

- **Text-to-CadQuery** (2025): 자연어 → LLM → CadQuery 코드 → 3D 모델. Top-1 exact match 69.3%. 출처: [arXiv:2505.06507](https://arxiv.org/html/2505.06507v1)
- **CAD-Coder** (2025, MIT): 비전-언어 모델 기반 CadQuery 코드 생성. 출처: [arXiv](https://arxiv.org/html/2505.14646)
- **CADDesigner** (2025): 범용 에이전트 기반 CAD 개념 설계, CadQuery를 실행 백엔드로 활용.

---

## 5. 통합 판단

### 5.1 적합성 평가

| 평가 항목 | 등급 | 근거 |
| --- | --- | --- |
| Spur/Helical 기어 생성 | **A** | cq_gears + involute profile 직접 생성 가능 |
| Bevel 기어 | **B+** | cq_gears 지원, worm gear 미지원 |
| Worm 기어 | **C** | 전용 라이브러리 없음, 직접 구현 필요 |
| Tooth profile 정밀도 | **A-** | Involute curve 파라메트릭 제어, N값 정밀도 조정 |
| 기어박스 어셈블리 | **B** | 기본 constraint 지원, tooth meshing 미흡 |
| STEP export 품질 | **A** | OCCT 기반 loss-less |
| FEA 연동 | **C+** | 간접 경로 존재, 마찰 있음 |
| 대규모 어셈블리 | **C** | union 성능 저하 |
| 자동화 파이프라인 | **A** | GUI-less 설계, 서버 통합 최적 |

### 5.2 권고

1. 기어 모델링 용도로 CadQuery는 충분히 유효 (spur/helical/bevel + STEP export)
2. Worm gear는 직접 구현 또는 build123d py_gearworks 검토
3. **build123d로의 전환 고려** — CadQuery 진화형, 더 Pythonic, 프로덕션 지향
4. **LLM 기반 자동 생성에 CadQuery는 최적의 타겟 언어** — 학술 연구가 입증

### 5.3 불확실성

- cq_gears 장기 유지보수 상태 불확실 (dev 버전 종속)
- py_gearworks 상세 정보 부족
- 대규모 기어 트레인(10+ 기어) 어셈블리 실제 성능 데이터 없음
- 대규모 제조업 적용 사례 미확인

---

## 출처 목록

- [meadiode/cq_gears (GitHub)](https://github.com/meadiode/cq_gears)
- [CadQuery/cadquery-contrib - Involute_Gear.py](https://github.com/CadQuery/cadquery-contrib/blob/master/examples/Involute_Gear.py)
- [cq_warehouse 문서](https://cq-warehouse.readthedocs.io/en/latest/sprocket.html)
- [CadQuery Assembly 문서](https://cadquery.readthedocs.io/en/latest/assy.html)
- [CadQuery Import/Export 문서](https://cadquery.readthedocs.io/en/latest/importexport.html)
- [cq-kit (GitHub)](https://github.com/michaelgale/cq-kit)
- [build123d vs CadQuery (Oreate AI)](https://www.oreateai.com/blog/build123d-vs-cadquery-navigating-the-future-of-python-cad-modeling/b9e17e3134422786a0ab67c0a6d1eeda)
- [build123d (GitHub)](https://github.com/gumyr/build123d)
- [Text-to-CadQuery (arXiv:2505.06507)](https://arxiv.org/html/2505.06507v1)
- [CadQuery Comes Of Age (Hackaday)](https://hackaday.com/2022/02/04/cadquery-comes-of-age/)
- [CadQuery GitHub Issue #336](https://github.com/CadQuery/cadquery/issues/336)
- [CadQuery GitHub Issue #1607](https://github.com/CadQuery/cadquery/issues/1607)
- [CadQuery GitHub Issue #1556](https://github.com/CadQuery/cadquery/issues/1556)