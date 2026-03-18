# 기어 도메인 온톨로지 강화 전략

> 이전 리서치(02-manufacturing-ontology.md)에서 확립한 MASON 기반 확장 + OWL/Property Graph 하이브리드 전략을 구체화한다.
> 본 문서는 OWL 클래스 계층, SWRL 규칙, SHACL 검증, LLM 그라운딩 메커니즘, 자동 KG 구축, 디지털 트윈 연동까지 설계 수준의 구체 스키마를 제공한다.

---

## 1. 기어 도메인 온톨로지 클래스 계층

### 1.1 최상위 구조 (MASON 확장)

MASON의 3대 상위 클래스(Entity, Operation, Resource)를 기어 도메인으로 확장한다.

```
mason:Thing
├── mason:Entity
│   ├── gear:GearEntity              # 기어 유형
│   │   ├── gear:SpurGear
│   │   ├── gear:HelicalGear
│   │   ├── gear:BevelGear
│   │   │   ├── gear:StraightBevelGear
│   │   │   └── gear:SpiralBevelGear
│   │   ├── gear:WormGear
│   │   │   ├── gear:Worm
│   │   │   └── gear:WormWheel
│   │   ├── gear:RingGear (InternalGear)
│   │   ├── gear:RackGear
│   │   ├── gear:HerringboneGear
│   │   └── gear:PlanetaryGearSet
│   │       ├── gear:SunGear
│   │       ├── gear:PlanetGear
│   │       └── gear:RingGear
│   │
│   ├── gear:GearParameter           # 설계 파라미터
│   │   ├── gear:Module
│   │   ├── gear:PressureAngle
│   │   ├── gear:NumberOfTeeth
│   │   ├── gear:HelixAngle
│   │   ├── gear:FaceWidth
│   │   ├── gear:PitchDiameter
│   │   ├── gear:TipDiameter
│   │   ├── gear:RootDiameter
│   │   ├── gear:ProfileShiftCoefficient
│   │   ├── gear:ContactRatio
│   │   └── gear:Backlash
│   │
│   ├── gear:GearMaterial             # 소재
│   │   ├── gear:CarbonSteel          # S45C, S50C
│   │   ├── gear:AlloySteel           # SCM420, SNCM420
│   │   ├── gear:StainlessSteel       # SUS304, SUS316
│   │   ├── gear:CastIron             # FC250, FCD500
│   │   ├── gear:Polymer              # MC Nylon, POM, PEEK
│   │   ├── gear:SinteredAlloy        # PM 소결
│   │   └── gear:Bronze               # 웜휠용
│   │
│   └── gear:QualityGrade             # 품질 등급
│       ├── gear:ISO1328Grade         # Grade 0-12
│       └── gear:AGMAQuality          # Q5-Q15
│
├── mason:Operation
│   ├── gear:GearManufacturingProcess # 기어 가공 공정
│   │   ├── gear:Hobbing
│   │   ├── gear:GearShaping
│   │   ├── gear:GearGrinding
│   │   │   ├── gear:ProfileGrinding
│   │   │   └── gear:GeneratingGrinding
│   │   ├── gear:PowerSkiving
│   │   ├── gear:GearShaving
│   │   ├── gear:GearLapping
│   │   ├── gear:GearHoning
│   │   ├── gear:Broaching
│   │   └── gear:GearMilling
│   │
│   ├── gear:HeatTreatment           # 열처리
│   │   ├── gear:Carburizing
│   │   ├── gear:Nitriding
│   │   ├── gear:InductionHardening
│   │   ├── gear:QuenchAndTemper
│   │   └── gear:Normalizing
│   │
│   └── gear:Inspection               # 검사
│       ├── gear:ProfileMeasurement
│       ├── gear:LeadMeasurement
│       ├── gear:PitchMeasurement
│       └── gear:RunoutMeasurement
│
└── mason:Resource
    └── gear:GearTool                  # 가공 공구
        ├── gear:Hob
        ├── gear:ShapingCutter
        │   ├── gear:PinionCutter
        │   └── gear:RackCutter
        ├── gear:GrindingWheel
        │   ├── gear:ProfileGrindingWheel
        │   └── gear:ThreadedGrindingWheel
        ├── gear:SkivingCutter
        ├── gear:ShavingCutter
        └── gear:BroachTool
```

### 1.2 클래스별 핵심 속성 매트릭스

| 클래스 | Object Properties | Data Properties |
|--------|------------------|-----------------|
| **GearEntity** | `hasProcess`, `madeOf`, `achievesQuality`, `requiresTool`, `hasHeatTreatment`, `meshsWith` | `hasModule`, `hasPressureAngle`, `hasTeethCount`, `hasHelixAngle`, `hasFaceWidth`, `hasPitchDiameter` |
| **GearManufacturingProcess** | `requiresTool`, `applicableTo`, `achievesQuality`, `followedBy`, `precededBy` | `hasMinModule`, `hasMaxModule`, `hasCycleTime`, `hasCostPerPiece` |
| **GearMaterial** | `compatibleWith` (Process), `requiresHeatTreatment` | `hasHardnessHRC`, `hasTensileStrength`, `hasYieldStrength`, `hasFatigueLimit` |
| **GearTool** | `usedIn` (Process), `suitableFor` (GearEntity) | `hasToolModule`, `hasToolPressureAngle`, `hasToolDiameter`, `hasToolLifeHours` |
| **QualityGrade** | `achievedBy` (Process), `requiredFor` (Application) | `hasGradeNumber`, `hasProfileTolerance`, `hasLeadTolerance`, `hasPitchTolerance` |
| **HeatTreatment** | `appliedTo` (Material), `precedes`/`follows` (Process) | `hasCaseDepth`, `hasSurfaceHardness`, `hasCoreHardness` |

---

## 2. OWL Axioms 및 SWRL 규칙

### 2.1 OWL 클래스 제약 (Restrictions)

```turtle
# 내부 기어는 Hobbing 불가 → Shaping 또는 Skiving 필요
gear:RingGear rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty gear:hasProcess ;
    owl:someValuesFrom [
        owl:unionOf (gear:GearShaping gear:PowerSkiving gear:Broaching)
    ]
] .

# 모든 기어는 최소 1개의 소재를 가짐
gear:GearEntity rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty gear:madeOf ;
    owl:minCardinality "1"^^xsd:nonNegativeInteger
] .

# Grinding은 반드시 GrindingWheel을 사용
gear:GearGrinding rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty gear:requiresTool ;
    owl:someValuesFrom gear:GrindingWheel
] .

# Hobbing은 외부 기어에만 적용
gear:Hobbing rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty gear:applicableTo ;
    owl:allValuesFrom [
        owl:complementOf gear:RingGear
    ]
] .
```

### 2.2 SWRL 규칙

SWRL(Semantic Web Rule Language)은 OWL axiom만으로 표현하기 어려운 조건부 추론을 가능하게 한다. Pellet reasoner가 SWRL built-in(수치 비교 등)을 지원한다.

```
# 규칙 1: 모듈 < 1이면 Hobbing 불가 → Shaping 권장
GearEntity(?g) ∧ hasModule(?g, ?m) ∧ swrlb:lessThan(?m, 1.0)
  → hasRecommendedProcess(?g, GearShaping)

# 규칙 2: AGMA Q11 이상 달성하려면 Grinding 필수
GearEntity(?g) ∧ achievesQuality(?g, ?q) ∧ AGMAQuality(?q)
  ∧ hasGradeNumber(?q, ?n) ∧ swrlb:greaterThanOrEqual(?n, 11)
  → hasProcess(?g, GearGrinding)

# 규칙 3: 합금강 + 침탄담금질 → Grinding 필요 (열처리 후 경도 상승)
GearEntity(?g) ∧ madeOf(?g, ?mat) ∧ AlloySteel(?mat)
  ∧ hasHeatTreatment(?g, ?ht) ∧ Carburizing(?ht)
  → hasProcess(?g, GearGrinding)

# 규칙 4: 피치원 지름 자동 계산
GearEntity(?g) ∧ hasModule(?g, ?m) ∧ hasTeethCount(?g, ?z)
  ∧ swrlb:multiply(?d, ?m, ?z)
  → hasPitchDiameter(?g, ?d)

# 규칙 5: 호브 모듈 = 기어 모듈 일치 확인
GearEntity(?g) ∧ hasModule(?g, ?m) ∧ hasProcess(?g, ?p)
  ∧ Hobbing(?p) ∧ requiresTool(?p, ?t) ∧ Hob(?t)
  ∧ hasToolModule(?t, ?tm) ∧ swrlb:notEqual(?m, ?tm)
  → hasViolation(?g, "Hob module mismatch")

# 규칙 6: 소재 경도 기반 열처리 추론
GearEntity(?g) ∧ madeOf(?g, ?mat) ∧ hasHardnessHRC(?mat, ?h)
  ∧ swrlb:lessThan(?h, 30) ∧ achievesQuality(?g, ?q)
  ∧ hasGradeNumber(?q, ?n) ∧ swrlb:greaterThanOrEqual(?n, 10)
  → requiresHeatTreatment(?g, Carburizing)

# 규칙 7: Power Skiving 적합성 (내부 기어 + 중량 생산)
RingGear(?g) ∧ hasProductionVolume(?g, ?v)
  ∧ swrlb:greaterThan(?v, 100)
  → hasRecommendedProcess(?g, PowerSkiving)
```

### 2.3 Owlready2 구현 코드

```python
from owlready2 import *

# 온톨로지 생성
onto = get_ontology("http://gear-ontology.org/onto#")

with onto:
    # === 클래스 계층 ===
    class GearEntity(Thing): pass
    class SpurGear(GearEntity): pass
    class HelicalGear(GearEntity): pass
    class BevelGear(GearEntity): pass
    class StraightBevelGear(BevelGear): pass
    class SpiralBevelGear(BevelGear): pass
    class WormGear(GearEntity): pass
    class RingGear(GearEntity):
        comment = ["Internal gear - cannot use hobbing"]
    class RackGear(GearEntity): pass

    class GearMaterial(Thing): pass
    class CarbonSteel(GearMaterial): pass
    class AlloySteel(GearMaterial): pass
    class StainlessSteel(GearMaterial): pass
    class Polymer(GearMaterial): pass
    class Bronze(GearMaterial): pass

    class ManufacturingProcess(Thing): pass
    class Hobbing(ManufacturingProcess): pass
    class GearShaping(ManufacturingProcess): pass
    class GearGrinding(ManufacturingProcess): pass
    class ProfileGrinding(GearGrinding): pass
    class GeneratingGrinding(GearGrinding): pass
    class PowerSkiving(ManufacturingProcess): pass
    class GearShaving(ManufacturingProcess): pass
    class Broaching(ManufacturingProcess): pass

    class HeatTreatment(Thing): pass
    class Carburizing(HeatTreatment): pass
    class Nitriding(HeatTreatment): pass
    class InductionHardening(HeatTreatment): pass
    class QuenchAndTemper(HeatTreatment): pass

    class GearTool(Thing): pass
    class Hob(GearTool): pass
    class ShapingCutter(GearTool): pass
    class GrindingWheel(GearTool): pass
    class SkivingCutter(GearTool): pass

    class QualityGrade(Thing): pass
    class ISO1328Grade(QualityGrade): pass
    class AGMAQuality(QualityGrade): pass

    # === Object Properties ===
    class hasProcess(ObjectProperty):
        domain = [GearEntity]
        range = [ManufacturingProcess]

    class madeOf(ObjectProperty):
        domain = [GearEntity]
        range = [GearMaterial]

    class achievesQuality(ObjectProperty):
        domain = [GearEntity]
        range = [QualityGrade]

    class requiresTool(ObjectProperty):
        domain = [ManufacturingProcess]
        range = [GearTool]

    class hasHeatTreatment(ObjectProperty):
        domain = [GearEntity]
        range = [HeatTreatment]

    class applicableTo(ObjectProperty):
        domain = [ManufacturingProcess]
        range = [GearEntity]

    class meshsWith(ObjectProperty):
        domain = [GearEntity]
        range = [GearEntity]
        is_symmetric = True

    class followedBy(ObjectProperty):
        domain = [ManufacturingProcess]
        range = [ManufacturingProcess]

    class hasRecommendedProcess(ObjectProperty):
        domain = [GearEntity]
        range = [ManufacturingProcess]

    # === Data Properties ===
    class hasModule(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [float]

    class hasPressureAngle(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [float]

    class hasTeethCount(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [int]

    class hasHelixAngle(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [float]

    class hasFaceWidth(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [float]

    class hasPitchDiameter(DataProperty, FunctionalProperty):
        domain = [GearEntity]
        range = [float]

    class hasGradeNumber(DataProperty, FunctionalProperty):
        domain = [QualityGrade]
        range = [int]

    class hasHardnessHRC(DataProperty, FunctionalProperty):
        domain = [GearMaterial]
        range = [float]

    class hasToolModule(DataProperty, FunctionalProperty):
        domain = [GearTool]
        range = [float]

    class hasToolPressureAngle(DataProperty, FunctionalProperty):
        domain = [GearTool]
        range = [float]

    # === 클래스 제약 (Restrictions) ===
    # 내부 기어는 Shaping/Skiving/Broaching만 가능
    RingGear.is_a.append(
        hasProcess.some(GearShaping | PowerSkiving | Broaching)
    )

    # Grinding은 GrindingWheel 필수
    GearGrinding.is_a.append(
        requiresTool.some(GrindingWheel)
    )

    # Hobbing은 Hob 필수
    Hobbing.is_a.append(
        requiresTool.some(Hob)
    )

    # === Disjoint 선언 ===
    AllDisjoint([SpurGear, HelicalGear, BevelGear,
                 WormGear, RingGear, RackGear])
    AllDisjoint([Hobbing, GearShaping, GearGrinding,
                 PowerSkiving, GearShaving, Broaching])
    AllDisjoint([CarbonSteel, AlloySteel, StainlessSteel,
                 Polymer, Bronze])

    # === SWRL 규칙 ===
    # 모듈 < 1 → Shaping 권장
    rule1 = Imp()
    rule1.set_as_rule("""
        GearEntity(?g) ^ hasModule(?g, ?m) ^ swrlb:lessThan(?m, 1.0)
        -> hasRecommendedProcess(?g, GearShaping)
    """)

    # 합금강 + 침탄 → Grinding 필요
    rule2 = Imp()
    rule2.set_as_rule("""
        GearEntity(?g) ^ madeOf(?g, ?mat) ^ AlloySteel(?mat)
        ^ hasHeatTreatment(?g, ?ht) ^ Carburizing(?ht)
        -> hasProcess(?g, GearGrinding)
    """)

    # 피치원 지름 자동 계산: d = m * z
    rule3 = Imp()
    rule3.set_as_rule("""
        GearEntity(?g) ^ hasModule(?g, ?m) ^ hasTeethCount(?g, ?z)
        ^ swrlb:multiply(?d, ?m, ?z)
        -> hasPitchDiameter(?g, ?d)
    """)

# === 인스턴스 생성 예시 ===
with onto:
    scm420 = AlloySteel("SCM420")
    scm420.hasHardnessHRC = [58.0]  # 침탄 후

    carb = Carburizing("carburizing_process")

    hobbing_op = Hobbing("hobbing_op_1")
    grinding_op = GeneratingGrinding("grinding_op_1")
    hobbing_op.followedBy = [grinding_op]

    my_gear = HelicalGear("helical_gear_001")
    my_gear.hasModule = [2.5]
    my_gear.hasPressureAngle = [20.0]
    my_gear.hasTeethCount = [35]
    my_gear.hasHelixAngle = [15.0]
    my_gear.hasFaceWidth = [25.0]
    my_gear.madeOf = [scm420]
    my_gear.hasHeatTreatment = [carb]
    my_gear.hasProcess = [hobbing_op, grinding_op]

    target_quality = AGMAQuality("agma_q12")
    target_quality.hasGradeNumber = [12]
    my_gear.achievesQuality = [target_quality]

# 추론 실행 (Pellet - SWRL 지원)
sync_reasoner_pellet(infer_property_values=True,
                     infer_data_property_values=True)

# 추론 결과 확인
print(f"Pitch diameter: {my_gear.hasPitchDiameter}")
# 예상: [87.5] (2.5 * 35)
print(f"Recommended processes: {my_gear.hasRecommendedProcess}")

# 저장
onto.save(file="gear_ontology.owl", format="rdfxml")
```

---

## 3. SHACL 기반 설계 검증

SHACL(Shapes Constraint Language)은 OWL의 개방 세계 가정(OWA)과 달리 폐쇄 세계 가정(CWA)으로 데이터를 검증한다. 설계 파라미터의 유효 범위, 필수 속성 존재 여부, 관계 무결성을 런타임에 검사할 수 있다.

### 3.1 SHACL Shapes 정의

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix gear: <http://gear-ontology.org/onto#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# === 기어 엔티티 기본 검증 ===
gear:GearEntityShape a sh:NodeShape ;
    sh:targetClass gear:GearEntity ;
    sh:property [
        sh:path gear:hasModule ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:float ;
        sh:minExclusive 0.0 ;
        sh:maxInclusive 50.0 ;
        sh:name "Module" ;
        sh:message "Module must be between 0 and 50 (exclusive 0)"
    ] ;
    sh:property [
        sh:path gear:hasPressureAngle ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:float ;
        sh:in (14.5 20.0 25.0) ;
        sh:name "Pressure Angle" ;
        sh:message "Pressure angle must be 14.5°, 20°, or 25°"
    ] ;
    sh:property [
        sh:path gear:hasTeethCount ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:integer ;
        sh:minInclusive 6 ;
        sh:name "Number of Teeth" ;
        sh:message "Minimum 6 teeth required to avoid severe undercut"
    ] ;
    sh:property [
        sh:path gear:madeOf ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:class gear:GearMaterial ;
        sh:name "Material" ;
        sh:message "Each gear must have exactly one material"
    ] ;
    sh:property [
        sh:path gear:hasProcess ;
        sh:minCount 1 ;
        sh:class gear:ManufacturingProcess ;
        sh:name "Manufacturing Process" ;
        sh:message "At least one manufacturing process must be specified"
    ] .

# === 헬리컬 기어 추가 검증 ===
gear:HelicalGearShape a sh:NodeShape ;
    sh:targetClass gear:HelicalGear ;
    sh:property [
        sh:path gear:hasHelixAngle ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:datatype xsd:float ;
        sh:minExclusive 0.0 ;
        sh:maxInclusive 45.0 ;
        sh:name "Helix Angle" ;
        sh:message "Helix angle must be > 0° and <= 45° for helical gears"
    ] .

# === 내부 기어(RingGear) 공정 제약 ===
gear:RingGearProcessShape a sh:NodeShape ;
    sh:targetClass gear:RingGear ;
    sh:property [
        sh:path gear:hasProcess ;
        sh:qualifiedValueShape [
            sh:class gear:Hobbing
        ] ;
        sh:qualifiedMaxCount 0 ;
        sh:message "Internal gears (RingGear) cannot use Hobbing process"
    ] .

# === 호브 도구-기어 모듈 일치 검증 (SPARQL-based) ===
gear:HobModuleMatchShape a sh:NodeShape ;
    sh:targetClass gear:Hobbing ;
    sh:sparql [
        sh:message "Hob module ({?hobModule}) does not match gear module ({?gearModule})" ;
        sh:prefixes gear: ;
        sh:select """
            SELECT $this ?gearModule ?hobModule
            WHERE {
                ?gear gear:hasProcess $this .
                ?gear gear:hasModule ?gearModule .
                $this gear:requiresTool ?hob .
                ?hob gear:hasToolModule ?hobModule .
                FILTER (?gearModule != ?hobModule)
            }
        """
    ] .

# === 품질 등급-공정 정합성 검증 (SPARQL-based) ===
gear:QualityProcessConsistencyShape a sh:NodeShape ;
    sh:targetClass gear:GearEntity ;
    sh:sparql [
        sh:message "AGMA Q{?grade}+ requires Grinding, but no grinding process found" ;
        sh:prefixes gear: ;
        sh:select """
            SELECT $this ?grade
            WHERE {
                $this gear:achievesQuality ?q .
                ?q a gear:AGMAQuality .
                ?q gear:hasGradeNumber ?grade .
                FILTER (?grade >= 11)
                FILTER NOT EXISTS {
                    $this gear:hasProcess ?p .
                    ?p a gear:GearGrinding .
                }
            }
        """
    ] .

# === Face Width 대 Module 비율 검증 ===
gear:FaceWidthRatioShape a sh:NodeShape ;
    sh:targetClass gear:GearEntity ;
    sh:sparql [
        sh:message "Face width to module ratio ({?ratio}) is outside recommended range 6-12" ;
        sh:prefixes gear: ;
        sh:select """
            SELECT $this ?ratio
            WHERE {
                $this gear:hasFaceWidth ?fw .
                $this gear:hasModule ?m .
                BIND (?fw / ?m AS ?ratio)
                FILTER (?ratio < 6 || ?ratio > 12)
            }
        """
    ] .
```

### 3.2 Python에서 SHACL 검증 파이프라인

```python
from pyshacl import validate
from rdflib import Graph

# 데이터 그래프 로드 (Owlready2에서 내보낸 OWL)
data_graph = Graph()
data_graph.parse("gear_ontology.owl", format="xml")

# SHACL shapes 그래프 로드
shapes_graph = Graph()
shapes_graph.parse("gear_shapes.ttl", format="turtle")

# 검증 실행
conforms, results_graph, results_text = validate(
    data_graph,
    shacl_graph=shapes_graph,
    inference='none',           # 추론은 Owlready2에서 이미 완료
    abort_on_first=False,       # 모든 위반 수집
    advanced=True,              # SPARQL-based constraints 활성화
    js=False
)

print(f"Conforms: {conforms}")
if not conforms:
    print(results_text)

    # 프로그래밍적 접근
    from rdflib.namespace import SH
    for result in results_graph.subjects(
        predicate=RDF.type, object=SH.ValidationResult
    ):
        msg = results_graph.value(result, SH.resultMessage)
        path = results_graph.value(result, SH.resultPath)
        focus = results_graph.value(result, SH.focusNode)
        severity = results_graph.value(result, SH.resultSeverity)
        print(f"  [{severity}] {focus}: {path} - {msg}")
```

### 3.3 LLM 생성 결과 자동 검증 파이프라인

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Query  │────>│  LLM + KG    │────>│  Generated   │
│              │     │  Grounding   │     │  Gear Spec   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                          ┌───────▼───────┐
                                          │  RDF Triples   │
                                          │  Conversion    │
                                          └───────┬───────┘
                                                  │
                              ┌────────────────────┼────────────────────┐
                              │                    │                    │
                      ┌───────▼───────┐    ┌──────▼───────┐    ┌──────▼───────┐
                      │  SHACL        │    │  OWL         │    │  SWRL        │
                      │  Validation   │    │  Consistency │    │  Rule Check  │
                      └───────┬───────┘    └──────┬───────┘    └──────┬───────┘
                              │                    │                    │
                              └────────────────────┼────────────────────┘
                                                   │
                                           ┌───────▼───────┐
                                           │  Pass / Fail  │
                                           │  + Details    │
                                           └───────┬───────┘
                                                   │
                                    ┌──────────────┼──────────────┐
                                    │ Pass                        │ Fail
                            ┌───────▼───────┐            ┌───────▼───────┐
                            │  Return to    │            │  Error Report │
                            │  User         │            │  → LLM Retry  │
                            └───────────────┘            └───────────────┘
```

---

## 4. LLM Grounding 구체 메커니즘

### 4.1 세 가지 그라운딩 패턴

#### 패턴 A: Schema-in-Prompt (스키마 주입)

온톨로지의 관련 클래스/속성 정의를 프롬프트에 직접 포함하여 LLM이 도메인 구조를 인식하게 한다.

```python
SCHEMA_PROMPT = """
You are a gear manufacturing expert. Use ONLY the following ontology schema
to structure your answers.

## Gear Types (choose one):
- SpurGear, HelicalGear, BevelGear, WormGear, RingGear, RackGear

## Required Parameters:
- Module (float, 0.1-50): tooth size factor, d = m * z
- PressureAngle (float): 14.5° or 20° or 25°
- NumberOfTeeth (int, >= 6)
- FaceWidth (float): recommended 6-12 * module

## Manufacturing Processes:
- Hobbing: external gears only, module >= 1, achieves AGMA Q8-10
- GearShaping: internal/external, low-medium volume, AGMA Q8-10
- PowerSkiving: internal gears, high volume, ISO 6-8
- GearGrinding: finishing, achieves AGMA Q11+, required after carburizing
- GearShaving: pre-heat-treat finishing, AGMA Q10-11

## Materials → Heat Treatment → Achievable Quality:
- CarbonSteel (S45C) + QuenchAndTemper → Hobbing+Shaving → AGMA Q10
- AlloySteel (SCM420) + Carburizing → Hobbing+Grinding → AGMA Q11+
- Polymer (MC Nylon) + None → Hobbing → AGMA Q7-8

## Constraints:
- RingGear CANNOT use Hobbing
- AGMA Q11+ REQUIRES GearGrinding
- Module < 1 → prefer GearShaping over Hobbing
- Hob module MUST equal gear module
"""
```

#### 패턴 B: KG-Triple Retrieval (트리플 검색 + RAG)

사용자 질의에서 엔티티를 식별하고, KG에서 관련 트리플을 검색하여 컨텍스트로 주입한다.

```python
def retrieve_gear_context(query: str, neo4j_driver, top_k: int = 20) -> str:
    """사용자 질의에서 기어 관련 엔티티를 추출하고 KG 트리플을 검색"""

    # Step 1: 엔티티 추출 (간단한 키워드 매칭 또는 LLM NER)
    entities = extract_entities(query)
    # e.g., ["helical gear", "SCM420", "AGMA Q12"]

    # Step 2: Cypher 쿼리로 관련 서브그래프 검색
    cypher = """
    UNWIND $entities AS entity_name
    MATCH (n)
    WHERE toLower(n.name) CONTAINS toLower(entity_name)
       OR toLower(labels(n)[0]) CONTAINS toLower(entity_name)
    CALL {
        WITH n
        MATCH (n)-[r]-(m)
        RETURN n, type(r) AS rel, m
        LIMIT $top_k
    }
    RETURN n.name AS subject, rel AS predicate,
           m.name AS object, labels(n) AS subjectType,
           labels(m) AS objectType
    """

    with neo4j_driver.session() as session:
        results = session.run(cypher,
                            entities=entities, top_k=top_k)
        triples = [
            f"({r['subject']} [{r['subjectType'][0]}]) "
            f"--[{r['predicate']}]--> "
            f"({r['object']} [{r['objectType'][0]}])"
            for r in results
        ]

    # Step 3: 컨텍스트 프롬프트 구성
    context = "\n".join(triples)
    return f"""
## Retrieved Knowledge Graph Facts:
{context}

Use these facts to ground your answer.
If the facts contradict common knowledge, prefer the KG facts.
Cite specific triples when making claims.
"""
```

#### 패턴 C: Ontology-Constrained Generation (제약 기반 생성)

LLM 출력을 생성한 후, 온톨로지 제약(SHACL + OWL)으로 검증하고 위반 시 재생성한다.

```python
def constrained_gear_generation(user_query: str, max_retries: int = 3):
    """온톨로지 제약을 적용한 기어 설계 생성"""

    schema_prompt = load_schema_prompt()
    kg_context = retrieve_gear_context(user_query)

    for attempt in range(max_retries):
        # LLM 생성
        response = llm.generate(
            system=schema_prompt,
            context=kg_context,
            query=user_query,
            format="json"  # 구조화된 출력 강제
        )

        # JSON → RDF 트리플 변환
        gear_spec = parse_gear_spec(response)
        rdf_triples = spec_to_rdf(gear_spec)

        # SHACL 검증
        conforms, violations = validate_with_shacl(rdf_triples)

        # OWL 일관성 검사
        consistent = check_owl_consistency(rdf_triples)

        if conforms and consistent:
            return {
                "spec": gear_spec,
                "validated": True,
                "attempt": attempt + 1
            }

        # 위반 사항을 피드백으로 재생성
        error_feedback = format_violations(violations)
        kg_context += f"\n\n## Validation Errors (attempt {attempt+1}):\n{error_feedback}\nPlease fix these issues."

    return {
        "spec": gear_spec,
        "validated": False,
        "violations": violations
    }
```

### 4.2 SPARQL 쿼리 템플릿

```sparql
# === 공정 추천: 기어 유형 + 소재 + 목표 품질 기반 ===
PREFIX gear: <http://gear-ontology.org/onto#>

SELECT ?process ?processType ?achievableGrade ?tool ?toolType
WHERE {
    # 입력: 기어 유형, 소재, 목표 품질
    BIND(gear:HelicalGear AS ?gearType)
    BIND(gear:AlloySteel AS ?materialType)
    BIND(11 AS ?targetGrade)

    ?process a ?processType .
    ?processType rdfs:subClassOf* gear:ManufacturingProcess .

    # 해당 기어 유형에 적용 가능한 공정
    ?process gear:applicableTo ?gearType .

    # 달성 가능한 품질 등급
    ?process gear:achievesQuality ?quality .
    ?quality gear:hasGradeNumber ?achievableGrade .
    FILTER(?achievableGrade >= ?targetGrade)

    # 필요 공구
    ?process gear:requiresTool ?tool .
    ?tool a ?toolType .
}
ORDER BY DESC(?achievableGrade)

# === 소재-열처리-공정 체인 조회 ===
SELECT ?material ?heatTreatment ?primaryProcess ?finishProcess ?quality
WHERE {
    ?gear gear:madeOf ?material .
    ?material a ?matType .
    ?matType rdfs:subClassOf* gear:GearMaterial .

    OPTIONAL { ?gear gear:hasHeatTreatment ?heatTreatment }

    ?gear gear:hasProcess ?primaryProcess .
    ?primaryProcess a ?primaryType .

    OPTIONAL {
        ?primaryProcess gear:followedBy ?finishProcess .
        ?finishProcess a ?finishType .
    }

    ?gear gear:achievesQuality ?q .
    ?q gear:hasGradeNumber ?quality .
}

# === 공구 매칭: 모듈 + 압력각 기반 ===
SELECT ?tool ?toolType ?toolModule ?toolPA
WHERE {
    BIND(2.5 AS ?targetModule)
    BIND(20.0 AS ?targetPA)

    ?tool a ?toolType .
    ?toolType rdfs:subClassOf* gear:GearTool .
    ?tool gear:hasToolModule ?toolModule .
    ?tool gear:hasToolPressureAngle ?toolPA .

    FILTER(?toolModule = ?targetModule)
    FILTER(?toolPA = ?targetPA)
}
```

### 4.3 Neo4j Cypher 쿼리 패턴

```cypher
// === 기어에 적합한 전체 공정 체인 추천 ===
MATCH (g:GearEntity {name: $gearName})
MATCH (g)-[:MADE_OF]->(mat:GearMaterial)
MATCH (p:ManufacturingProcess)-[:APPLICABLE_TO]->(gType)
WHERE gType.name IN labels(g)
OPTIONAL MATCH (p)-[:REQUIRES_TOOL]->(tool:GearTool)
OPTIONAL MATCH (p)-[:ACHIEVES_QUALITY]->(q:QualityGrade)
OPTIONAL MATCH (p)-[:FOLLOWED_BY]->(next:ManufacturingProcess)
RETURN p.name AS process,
       tool.name AS tool,
       q.gradeNumber AS achievableGrade,
       next.name AS nextProcess
ORDER BY q.gradeNumber DESC

// === 소재 기반 가능한 열처리 + 후속 공정 탐색 ===
MATCH (mat:GearMaterial {name: $materialName})
MATCH (mat)<-[:MADE_OF]-(g:GearEntity)
MATCH (g)-[:HAS_HEAT_TREATMENT]->(ht:HeatTreatment)
MATCH (g)-[:HAS_PROCESS]->(proc:ManufacturingProcess)
RETURN DISTINCT mat.name, ht.name AS heatTreatment,
       collect(DISTINCT proc.name) AS processes

// === 유사 기어 검색 (파라미터 유사도 기반) ===
MATCH (g:GearEntity)
WHERE g.module >= $targetModule - 0.5
  AND g.module <= $targetModule + 0.5
  AND g.teethCount >= $targetTeeth - 5
  AND g.teethCount <= $targetTeeth + 5
MATCH (g)-[:HAS_PROCESS]->(p)
MATCH (g)-[:MADE_OF]->(mat)
RETURN g.name, g.module, g.teethCount,
       collect(p.name) AS processes,
       mat.name AS material
ORDER BY abs(g.module - $targetModule) +
         abs(g.teethCount - $targetTeeth) * 0.1
LIMIT 5

// === LLM이 Cypher를 직접 생성하는 패턴용 스키마 프롬프트 ===
// Neo4j 스키마를 LLM에 제공하여 자연어 → Cypher 변환
/*
Node Labels: GearEntity, SpurGear, HelicalGear, BevelGear,
             WormGear, RingGear, GearMaterial, CarbonSteel,
             AlloySteel, ManufacturingProcess, Hobbing,
             GearShaping, GearGrinding, HeatTreatment,
             Carburizing, GearTool, Hob, QualityGrade

Relationships: MADE_OF, HAS_PROCESS, ACHIEVES_QUALITY,
               REQUIRES_TOOL, HAS_HEAT_TREATMENT,
               APPLICABLE_TO, FOLLOWED_BY, MESHES_WITH

Properties: module (float), pressureAngle (float),
            teethCount (int), helixAngle (float),
            faceWidth (float), gradeNumber (int),
            hardnessHRC (float)
*/
```

### 4.4 LLM SPARQL/Cypher 생성 vs 사전 정의 쿼리 비교

| 기준 | LLM 동적 생성 | 사전 정의 쿼리 | 권장 하이브리드 |
|------|---------------|---------------|---------------|
| **유연성** | 높음 (임의 질문) | 낮음 (정해진 패턴) | 사전 정의 우선 + fallback으로 동적 |
| **정확도** | 중간 (구문 오류 가능) | 높음 (검증됨) | 동적 생성 시 구문 검증 레이어 추가 |
| **보안** | 낮음 (injection 위험) | 높음 | 동적 쿼리에 화이트리스트 적용 |
| **성능** | 예측 불가 | 최적화 가능 | 자주 쓰는 패턴은 캐시 |
| **구현 복잡도** | 낮음 | 중간 | 중간-높음 |

**권장 전략**: 핵심 업무(공정 추천, 공구 매칭, 품질 검증)는 사전 정의 쿼리 템플릿을 사용하고, 탐색적 질의에만 LLM Cypher 생성을 허용한다. GraphCypherQAChain(LangChain) 패턴을 참고한다.

---

## 5. Knowledge Graph 자동 구축 (ARKNESS 패턴)

### 5.1 ARKNESS 프레임워크 개요

ARKNESS(Augmented Retrieval Knowledge Network Enhanced Search & Synthesis)는 이기종 문서에서 자동으로 KG를 구축하는 end-to-end 프레임워크이다.

| 항목 | 내용 |
|------|------|
| **입력** | .pdf, .docx, .pptx 등 이기종 문서 |
| **전처리** | Docling 패키지로 텍스트 추출 → Markdown 변환 |
| **트리플 추출** | LLM (GPT-4o)로 (entity, relation, entity) 추출 |
| **성능** | 3B Llama-3 + ARKNESS가 GPT-4o 정확도 매칭 |
| **개선폭** | MC 정확도 +25pp, F1 +22.4pp, ROUGE-L 8.1x |
| **환각 감소** | 수치 환각 22pp 감소 |

출처: [ARKNESS - arXiv 2506.13026](https://arxiv.org/html/2506.13026v1)

### 5.2 기어 도메인 적용 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│                    문서 수집 (Document Pool)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ ISO 1328 │ │ Gear     │ │ Material │ │ 제조사 카탈로그    │ │
│  │ / AGMA   │ │ Handbook │ │ 데이터시트│ │ (호브,연삭휠 등) │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬──────────┘ │
└───────┼─────────────┼───────────┼────────────────┼───────────┘
        │             │           │                │
        ▼             ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 1: 문서 파싱 (Docling)                      │
│  PDF/DOCX/PPTX → Markdown (표, 수식, 도표 보존)               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Step 2: 청킹 (Chunking)                         │
│  - 섹션 기반 분할 (500-1000 토큰)                              │
│  - 표는 행 단위로 트리플화                                      │
│  - 수식은 파라미터 관계로 변환                                   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 3: 온톨로지 가이드 엔티티/관계 추출                  │
│  LLM Prompt:                                                 │
│  "Extract (entity1, relation, entity2) triples from the      │
│   text. Use ONLY the following entity types and relations:   │
│   Entity types: GearType, Material, Process, Tool, Quality,  │
│                 Parameter, HeatTreatment                     │
│   Relations: hasProcess, madeOf, requiresTool, achieves-     │
│              Quality, hasParameter, followedBy, applicableTo"│
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 4: 엔티티 정규화 + 중복 제거                       │
│  - 동의어 통합: "hobbing" = "gear hobbing" = "호빙"            │
│  - 온톨로지 클래스에 매핑: "SCM420" → AlloySteel 인스턴스        │
│  - 수치 정규화: "module 2.5" → hasModule(2.5)                  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         Step 5: 트리플 검증 + KG 적재                          │
│  - SHACL shapes로 추출된 트리플 검증                            │
│  - 온톨로지 일관성 검사 (HermiT/Pellet)                         │
│  - 검증 통과 트리플 → Neo4j + OWL 인스턴스로 적재               │
│  - 검증 실패 → 수동 검토 큐                                     │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 문서 유형별 파싱 전략

| 문서 유형 | 주요 추출 대상 | 파싱 전략 | 예상 트리플 |
|-----------|---------------|----------|-----------|
| **ISO 1328 / AGMA** | 등급별 공차 테이블, 검사 규격 | 표 → 행 단위 트리플 | (ISO1328_Grade5, hasProfileTolerance, 5.0μm) |
| **기어 핸드북** | 설계 공식, 공정 가이드라인, 소재 특성 | 섹션 분할 + 수식 파싱 | (HelicalGear, hasProcess, Hobbing) |
| **소재 데이터시트** | 기계적 성질, 화학 성분, 열처리 조건 | 표 + 텍스트 복합 | (SCM420, hasHardnessHRC, 58-62) |
| **공구 카탈로그** | 공구 사양, 적용 범위, 수명 | 제품 정보 표 파싱 | (Hob_M2.5, hasToolModule, 2.5) |
| **가공 기술 논문** | 최적 조건, 실험 데이터, 비교 결과 | NER + RE (관계 추출) | (PowerSkiving, achievesQuality, ISO_Grade7) |

### 5.4 품질 보증 방법

```python
def validate_extracted_triples(triples: list, onto, shapes_graph) -> dict:
    """추출된 트리플의 품질을 다층 검증"""
    results = {
        "accepted": [],
        "rejected": [],
        "needs_review": []
    }

    for triple in triples:
        subj, pred, obj = triple

        # Layer 1: 온톨로지 스키마 적합성
        if not is_valid_predicate(pred, onto):
            results["rejected"].append((triple, "Unknown predicate"))
            continue

        # Layer 2: 도메인/레인지 확인
        if not check_domain_range(subj, pred, obj, onto):
            results["rejected"].append((triple, "Domain/range violation"))
            continue

        # Layer 3: SHACL 제약 확인
        rdf_triple = to_rdf(triple)
        conforms, _ = validate_shacl(rdf_triple, shapes_graph)
        if not conforms:
            results["needs_review"].append((triple, "SHACL violation"))
            continue

        # Layer 4: 수치 범위 상식 확인
        if is_numeric(obj):
            if not check_numeric_plausibility(subj, pred, float(obj)):
                results["needs_review"].append((triple, "Value out of typical range"))
                continue

        # Layer 5: 중복 / 모순 검사
        if has_contradiction(triple, existing_triples):
            results["needs_review"].append((triple, "Contradicts existing knowledge"))
            continue

        results["accepted"].append(triple)

    return results
```

---

## 6. 온톨로지 추론 활용

### 6.1 추론 엔진 선택 가이드

| 추론 엔진 | OWL 프로파일 | SWRL 지원 | 성능 | 적합 용도 |
|-----------|------------|----------|------|----------|
| **HermiT** | OWL 2 DL (SROIQ) | DL-Safe only (built-in 제외) | 중간 | 클래스 분류, 일관성 검사 |
| **Pellet** | OWL 2 DL | Full SWRL + built-ins | 중간 | 수치 비교 포함 규칙 (기어에 최적) |
| **ELK** | OWL 2 EL | 미지원 | 빠름 | 대규모 분류 (의료 등) |
| **RDFox** | OWL 2 RL | SWRL + Datalog | 매우 빠름 | 대규모 인스턴스 추론 |

**기어 도메인 권장**: **Pellet** (SWRL built-in 수치 비교 필수) → 대규모 인스턴스 시 **RDFox** 검토.

Owlready2에서 Pellet 사용:
```python
# Pellet은 SWRL built-in (swrlb:lessThan, swrlb:multiply 등) 지원
sync_reasoner_pellet(
    infer_property_values=True,
    infer_data_property_values=True
)
```

출처: [Owlready2 Reasoning Documentation](https://owlready2.readthedocs.io/en/latest/reasoning.html), [OWL Reasoners 2023 Survey - arXiv](https://arxiv.org/pdf/2309.06888), [Drools vs Pellet for SWRL](https://www.michaeldebellis.com/post/drools-vs-pellet-for-swrl-rules)

### 6.2 추론으로 해결할 수 있는 실제 문제

#### 문제 1: "이 기어에 적합한 공정은 무엇인가?"

```python
# 입력: 기어 사양
with onto:
    test_gear = RingGear("test_internal_gear")
    test_gear.hasModule = [3.0]
    test_gear.hasTeethCount = [80]
    test_gear.madeOf = [AlloySteel("SCM420_instance")]
    test_gear.hasHeatTreatment = [Carburizing("carb_instance")]
    test_gear.achievesQuality = [AGMAQuality("target_q11")]
    onto["target_q11"].hasGradeNumber = [11]

# 추론 실행
sync_reasoner_pellet(infer_property_values=True,
                     infer_data_property_values=True)

# 결과: SWRL 규칙에 의해 자동 추론됨
# - RingGear → Hobbing 제외 (OWL 제약)
# - AlloySteel + Carburizing → GearGrinding 추가 (SWRL rule2)
# - AGMA Q11+ → GearGrinding 필수 (확인)
print(test_gear.hasProcess)           # [GearShaping/PowerSkiving]
print(test_gear.hasRecommendedProcess)  # 추론된 공정
```

#### 문제 2: "이 공정으로 달성 가능한 최대 품질은?"

```sparql
PREFIX gear: <http://gear-ontology.org/onto#>

SELECT ?process (MAX(?grade) AS ?maxGrade)
WHERE {
    ?process a/rdfs:subClassOf* gear:ManufacturingProcess .
    ?gear gear:hasProcess ?process .
    ?gear gear:achievesQuality ?q .
    ?q gear:hasGradeNumber ?grade .
}
GROUP BY ?process
ORDER BY DESC(?maxGrade)
```

#### 문제 3: "이 소재에 필요한 열처리는?"

```sparql
PREFIX gear: <http://gear-ontology.org/onto#>

SELECT ?material ?heatTreatment ?resultingHardness
WHERE {
    ?gear gear:madeOf ?material .
    ?material a gear:AlloySteel .
    ?gear gear:hasHeatTreatment ?heatTreatment .
    OPTIONAL { ?material gear:hasHardnessHRC ?resultingHardness }
}
```

### 6.3 추론 성능 및 한계

| 측면 | 현실적 평가 |
|------|-----------|
| **분류 속도** | 수백 클래스 + 수천 인스턴스 → Pellet 수 초 내 완료 |
| **SWRL 규칙** | 인스턴스 수에 비례하여 증가. 1만 인스턴스 이상에서 분 단위 가능 |
| **메모리** | Pellet은 전체 온톨로지를 메모리에 적재. 대규모 시 JVM 힙 조정 필요 |
| **한계** | SWRL은 생성적(create new individuals) 규칙 불가, 속성 값만 추론. 복잡한 수학 연산은 Python에서 처리 후 주입이 실용적 |
| **운영 전략** | 배치 추론 (설계 변경 시) + 캐시된 결과를 Neo4j에서 쿼리 |

---

## 7. Digital Twin 연동 가능성

### 7.1 온톨로지 기반 디지털 트윈 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Digital Twin Layer                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────────┐ │
│  │ Design DT │  │ Mfg DT    │  │ Operation DT          │ │
│  │ (CAD/CAE) │  │ (CAM/CNC) │  │ (Sensor/Monitoring)   │ │
│  └─────┬─────┘  └─────┬─────┘  └──────────┬────────────┘ │
└────────┼──────────────┼─────────────────────┼─────────────┘
         │              │                     │
         ▼              ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│              Ontology Mediation Layer                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  gear:GearEntity (unified semantic model)          │  │
│  │  - Design params (Module, PressureAngle, ...)      │  │
│  │  - Mfg process (Hobbing → HeatTreat → Grinding)   │  │
│  │  - Operation data (vibration, temperature, wear)   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Standards: ISA-95 (operations) + MASON (manufacturing)   │
│             + Gear Ontology (domain-specific)              │
└─────────────────────────────┬───────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│              Knowledge Graph (Neo4j)                      │
│  Runtime queries, analytics, LLM grounding               │
└─────────────────────────────────────────────────────────┘
```

### 7.2 설계-제조-운용 데이터 통합

| 라이프사이클 단계 | 데이터 소스 | 온톨로지 매핑 | 업데이트 주기 |
|-----------------|-----------|-------------|------------|
| **설계** | build123d 파라미터, STEP 파일 | GearEntity 인스턴스 + GearParameter | 설계 변경 시 |
| **제조** | CAM 프로그램, CNC 로그, CMM 검사 | ManufacturingProcess 인스턴스 + 실측값 | 가공 완료 시 |
| **운용** | 진동 센서, 온도, 마모 측정 | OperationData (확장 클래스) | 실시간/주기적 |

### 7.3 가공 데이터 피드백 → 온톨로지 인스턴스 업데이트

```python
def update_ontology_from_machining_data(
    onto, gear_instance_name: str, machining_report: dict
):
    """가공 완료 후 실측 데이터로 온톨로지 인스턴스 업데이트"""

    with onto:
        gear = onto[gear_instance_name]

        # 실측 품질 등급 업데이트
        if "measured_quality" in machining_report:
            actual_quality = AGMAQuality(
                f"{gear_instance_name}_actual_quality"
            )
            actual_quality.hasGradeNumber = [
                machining_report["measured_quality"]
            ]
            gear.achievesQuality = [actual_quality]

        # 실제 사용된 공정 파라미터 기록
        if "actual_parameters" in machining_report:
            params = machining_report["actual_parameters"]
            # 예: 실제 절삭 속도, 이송률, 가공 시간
            process = gear.hasProcess[0]
            process.hasCycleTime = [params.get("cycle_time")]
            process.hasCutSpeed = [params.get("cut_speed")]

        # 공구 수명 데이터 피드백
        if "tool_wear" in machining_report:
            tool = gear.hasProcess[0].requiresTool[0]
            tool.hasActualLifeHours = [
                machining_report["tool_wear"]["hours_used"]
            ]

    # 추론 재실행 → 새 지식 도출
    sync_reasoner_pellet(infer_property_values=True)

    # 변경 사항 Neo4j 동기화
    sync_to_neo4j(onto, gear_instance_name)
```

### 7.4 관련 프레임워크 참고

- **NIST Digital Twin Framework**: 상위/중위 온톨로지 기반 도메인 레벨 온톨로지 구축 제안. 출처: [NIST Publication](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=936637)
- **Azure Digital Twins + ISA-95**: ISA-95 온톨로지 기반 DTDL 모델. 출처: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/digital-twins/concepts-ontologies-adopt)
- **Digital Twin Consortium Manufacturing Ontologies**: ISA-95 기반 참조 구현. 출처: [GitHub](https://github.com/digitaltwinconsortium/ManufacturingOntologies)

---

## 8. 구현 로드맵

### Phase 1: 핵심 온톨로지 구축 (2-3주)

1. Owlready2로 기어 도메인 OWL 스키마 구현 (Section 1-2의 클래스/속성/규칙)
2. SHACL shapes 정의 (Section 3)
3. 기본 인스턴스 100개 수동 생성 (주요 기어 유형 x 소재 x 공정 조합)
4. 추론 검증 (Pellet SWRL 규칙 동작 확인)

### Phase 2: LLM Grounding 파이프라인 (2-3주)

5. Schema-in-Prompt 템플릿 작성 + 테스트
6. Neo4j Property Graph 구축 (OWL → Cypher 변환)
7. KG-Triple Retrieval 구현 (엔티티 추출 → Cypher 검색)
8. SHACL 자동 검증 파이프라인 통합

### Phase 3: 자동 KG 구축 (3-4주)

9. ARKNESS 패턴 적용: 기어 핸드북, ISO 규격에서 자동 트리플 추출
10. 추출 품질 검증 레이어 구현
11. 누적 KG 규모 목표: 10,000+ 트리플

### Phase 4: 디지털 트윈 연동 (선택)

12. build123d → OWL 인스턴스 자동 변환
13. 가공 데이터 피드백 루프

---

## 출처 목록

### 온톨로지/OWL
- MASON Ontology: [IEEE Xplore](https://ieeexplore.ieee.org/document/1633441/), [SourceForge](https://sourceforge.net/projects/mason-onto/)
- Manufacturing Ontologies Review 2024: [Springer](https://link.springer.com/article/10.1007/s10845-024-02425-z)
- CDM-Core Manufacturing Domain Ontology: [DFKI](https://www.dfki.de/~makl01/i2s/CDM-Core_v.2.0.1.pdf)
- Owlready2 Documentation: [ReadTheDocs](https://owlready2.readthedocs.io/)

### SWRL/추론
- OWL Reasoners 2023 Survey: [arXiv:2309.06888](https://arxiv.org/pdf/2309.06888)
- Pellet SWRL Support: [michaeldebellis.com](https://www.michaeldebellis.com/post/drools-vs-pellet-for-swrl-rules)
- OWL 2 Rules Syntax: [Oxford CS](https://www.cs.ox.ac.uk/files/2445/rulesyntaxTR.pdf)
- Whelk OWL EL+RL Reasoner: [Dagstuhl](https://drops.dagstuhl.de/storage/08tgdk/tgdk-vol002/tgdk-vol002-issue002/html/TGDK.2.2.7/TGDK.2.2.7.html)

### SHACL
- W3C SHACL Recommendation: [W3C TR](https://www.w3.org/TR/shacl/)
- Astrea: Automatic SHACL Generation from Ontologies: [PMC 7250618](https://pmc.ncbi.nlm.nih.gov/articles/PMC7250618/)
- ODP to SHACL Shapes: [CEUR-WS Vol-2195](https://ceur-ws.org/Vol-2195/research_paper_3.pdf)

### LLM + Knowledge Graph
- ARKNESS Framework: [arXiv:2506.13026](https://arxiv.org/html/2506.13026v1)
- Unifying LLMs and Knowledge Graphs: [arXiv:2306.08302](https://arxiv.org/pdf/2306.08302)
- KG Grounding for LLMs: [DataWalk](https://datawalk.com/grounding-large-language-models-with-knowledge-graphs/)
- KG for Trustworthy AI: [Latitude](https://latitude.so/blog/knowledge-graphs-llms-trustworthy-ai)
- Neo4j GraphCypherQAChain: [Neo4j Blog](https://neo4j.com/blog/developer/rag-tutorial/)

### Neo4j / Cypher
- SPARQL to Cypher Translation: [Dagstuhl SLATE 2020](https://drops.dagstuhl.de/storage/01oasics/oasics-vol083-slate2020/OASIcs.SLATE.2020.17/OASIcs.SLATE.2020.17.pdf)
- Neo4j Knowledge Graph Guide: [Neo4j](https://go.neo4j.com/rs/710-RRC-335/images/developers-guide-how-to-build-knowledge-graph.pdf)

### 디지털 트윈
- NIST Digital Twin Ontology: [NIST](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=936637)
- Digital Twin Manufacturing Ontologies: [GitHub](https://github.com/digitaltwinconsortium/ManufacturingOntologies)
- Azure DTDL Industry Ontologies: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/digital-twins/concepts-ontologies-adopt)

### 기어 제조
- Gear Manufacturing Process Selection: [RapidDirect](https://www.rapiddirect.com/blog/gear-manufacturing/)
- ISO 1328 / AGMA Quality Standards: [Sandvik Coromant](https://www.sandvik.coromant.com/en-us/knowledge/milling/gear-manufacturing)
- Gear Manufacturing Overview: [PairGears](https://www.pairgears.com/blog/Gear-Manufacturing-Process-A-Step-by-Step-Overview_b19083)
