# 흄/파티클 배출 및 제거 시스템

## Researcher 2: 몰딩 기판 패키지 레이저 절단 시 흄·파티클 관리 기술

---

## 핵심 요약

몰딩 기판(EMC) 패키지 어레이의 레이저 절단에서 흄과 파티클 관리는 **절단 품질, 수율, 후공정 신뢰성을 좌우하는 핵심 변수**이다. 본 보고서는 6개 기술 영역을 조사하여 아래의 핵심 발견을 도출하였다:

1. **어시스트 가스 시스템**: 가스 종류·압력·분사 방식이 절단 품질과 흄 배출을 동시에 결정하며, **과도한 가스 압력은 Mach Stem Disk 형성을 통해 오히려 품질을 악화**시킨다
2. **보호 필름**: DISCO HogoMax 등 수용성 보호 필름은 debris 재증착 방지의 가장 직접적·검증된 방법이며, 30초 DI water 세정으로 완전 제거 가능
3. **후세정 기술**: CO2 스노우 클리닝이 반도체 공정에서 건식·비접촉·잔류물-free 세정으로 가장 유망
4. **LPBF 크로스플로우 기술**: 금속 적층제조의 스패터 관리에서 cross-flow 가스 시스템 설계 원리를 차용할 수 있음

---

## 1. 어시스트 가스 시스템

### 1.1 가스 종류별 특성

| 가스 | 주요 용도 | 절단 특성 | 흄/파티클 영향 |
|------|-----------|-----------|----------------|
| **N2 (질소)** | 반도체 패키지 절단에 가장 보편적 | 비반응성, 산화 방지, 깨끗한 절단면 | 산화물 형성 억제로 파티클 조성 개선 |
| **Ar (아르곤)** | 반응성 재료(Ti 등)에 사용 | 완전 불활성, 높은 밀도 | 밀도 높아 debris 배출 효과적이나 비용 높음 |
| **Air (압축공기)** | 저비용 범용 | 21% O2 포함, 약간의 산화 발생 | EMC 절단 시 탄화물 생성 가능성 |
| **He (헬륨)** | 특수 용도 | 낮은 밀도, 높은 열전도성 | CFD 연구에서 compact flow 형성에 유리 [인접 도메인: 레이저 금속 증착] |

**의사결정 연결**: EMC 기판 패키지 절단에서는 **N2가 최적 선택**이다. 산화를 방지하면서 비용 효율적이고, EMC의 에폭시 수지가 산소와 반응하여 발생하는 추가 탄화물을 억제한다.

> 출처: Riveiro et al., "Laser Cutting: A Review on the Influence of Assist Gas," *Materials* 12(1):157, 2019 (PMC6337310); Accurl, "Laser Cutting Gases," 2025

### 1.2 분사 방식 비교

| 방식 | 구조 | 장점 | 단점 |
|------|------|------|------|
| **Coaxial nozzle** | 레이저 빔과 동축으로 가스 분사 | 균일한 가스 분포, 빔 경로 보호 | 커프 입구에서 ~90% 면적 차단(choking) 발생 |
| **Cross-jet / Side-blow** | 빔 경로와 직각 또는 비스듬히 분사 | choking 감소, 플룸·debris 측면 배출 효과적 | 비대칭 가스 분포, 절단면 일측 품질 차이 가능 |
| **Dual/Hybrid** | Coaxial + side-blow 조합 | 빔 보호 + debris 배출 동시 달성 | 시스템 복잡성 증가, 유량 최적화 필요 |

**핵심 발견**: La Rocca(1991)는 coaxial nozzle에서 가스 제트의 단면적이 커프보다 훨씬 커서 **~90%의 면적 차단(area blockage)**이 발생함을 발견하였다. 이를 해결하기 위해 **커프 폭과 유사한 출구 직경의 비동축 노즐** 사용을 제안하였다. 이 원리는 EMC 패키지 절단에도 직접 적용 가능하다.

> 출처: Riveiro et al., PMC6337310, Section 2.2; La Rocca, 1991

### 1.3 과도한 가스 유량의 역효과 (반증 탐색 결과)

**가스 압력을 높이면 항상 좋은가? — 아니다.**

- **Mach Stem Disk(MSD) 형성**: 고압 가스가 커프 입구에서 정상충격파(normal shock wave)를 형성하여 가스 침투력과 운동에너지를 감소시킴
- **경계층 분리**: 커프 내벽에서 가스 흐름이 분리되어 melt 제거 효율 저하
- **외기 혼입**: 강한 충격파와 와류가 주변 공기(특히 질소)를 끌어들여 가스 순도 저하
- **산화성 가스에서 과연소**: O2/Air 사용 시 과도한 압력이 과연소(excessive burning) 유발

**수치 투명성**: Riveiro et al.의 리뷰에서, 7 bar에서 4 bar로 압력을 낮추면 커프 내 질량유량이 오히려 증가하고 품질이 개선되는 사례가 보고됨. 다만 이 수치는 **금속 판재 절단** 기반이며, EMC와 같은 폴리머/복합재에서는 열분해 가스 발생량이 다르므로 임계 압력이 달라질 수 있음.

> 출처: Riveiro et al., PMC6337310, Section 2 (Equations 3-7)

---

## 2. 흡입/배기 시스템

### 2.1 로컬 흡입(Local Extraction) vs 전체 챔버 환기

| 항목 | 로컬 흡입 | 전체 챔버 환기 |
|------|-----------|----------------|
| **흄 포집 효율** | 높음 (발생원 근접) | 중간 (희석 의존) |
| **시스템 크기** | 소형 (노즐/후드) | 대형 (HVAC급) |
| **에너지 효율** | 높음 | 낮음 |
| **옵틱스 보호** | 직접적 | 간접적 |
| **적용 사례** | 반도체 장비 내장형 | 산업용 대형 레이저 |

**권장**: 반도체 패키지 레이저 절단에서는 **로컬 흡입이 필수**이다. 절단점 근방에서 음압(negative pressure)을 형성하여 흄 플룸을 즉시 포집해야 옵틱스 오염과 재증착을 방지할 수 있다.

### 2.2 패키지 절단 전용 가스 배출 시스템 (특허 사례)

**Patent WO2019054945A1** (2019, "Cutting method for polymer resin mold compound based substrates"):
- **가스 튜브가 레이저 빔 경로를 따라 평행하게 배치**되어 절단 스트리트(singulation street)를 따라 압축 공기/가스를 분사
- 기판은 진공 지그 위에 고정 (1-3cm 깊이, 1mm 이상 폭의 트렌치)
- 펄스 레이저(10kHz 이상 반복률)로 다중 패스 절단
- **실시간으로 ablation-generated 파티클, 수지 입자, 열 잔류물을 배출**

**의사결정 연결**: 이 특허 구조는 EMC 기판 절단에 직접 적용된 검증된 설계이다. 가스 튜브의 방향이 레이저 이동 방향과 일치하는 것이 핵심이다.

> 출처: WO2019054945A1 (2018-09-13 출원), FIG. 1, 305 directional arrow

### 2.3 다단 필터 시스템

산업용 레이저 흄 추출기의 표준 구성:

1. **Pre-filter**: 대형 입자·스파크 포집 (금속 메시, 세척 가능)
2. **HEPA filter**: 0.3um 이상 입자 99.97% 포집
3. **활성탄 필터**: VOC, 유기 가스 흡착
4. (선택) **정전기 집진**: 하전 debris 포집

**EMC 절단 특수 고려사항**: EMC의 주성분인 에폭시 수지와 실리카 필러 ablation 시 발생하는 SiO2 미립자와 유기 가스(VOC)를 동시에 처리해야 한다. 따라서 HEPA + 활성탄의 조합이 필수적이다.

> 출처: IP Systems USA, "How Does a Laser Cutter Fume Extractor Work?"; Kern Laser Systems, "Laser Processing Fume Removal"

---

## 3. 보호 필름/코팅

### 3.1 DISCO HogoMax — 업계 표준 솔루션

**DISCO HogoMax는 반도체 레이저 가공용 수용성 보호 필름의 사실상 업계 표준이다.**

| 특성 | 수치/설명 |
|------|-----------|
| 점도 | 235 cP |
| pH | 3.3 |
| 표면장력 | 50.2 mN/m |
| 비중 | 1.012 |
| 금속 불순물 (Na, K, Fe, Cu) | **< 50 ppb** |
| 코팅 두께 (1000rpm) | 1.58 um |
| 코팅 두께 (3000rpm) | 0.82 um |
| 두께 편차 (1000rpm) | 0.04 um (최대) |
| 제거 방법 | DI water, **30초** |

**핵심 기술적 차별점**:
- 표면장력 최적화로 **볼 범프, 전극 등 요철부에서도 균일 코팅** (경쟁 제품은 미도포 영역 발생)
- 레이저 열에 의한 **가교결합(cross-linking) 억제** 설계 (경쟁 제품은 열에 의해 응고되어 제거 곤란)
- FT-IR 검증: 30초 DI water 세정 후 코팅 전과 동일한 스펙트럼 확인 (잔류물 없음)

**수치가 틀릴 수 있는 조건**: 50 ppb 미만 금속 불순물 사양은 표준 공정 조건에서의 값이다. 고출력 레이저나 장시간 노출 시 보호 필름 자체의 열분해로 불순물이 추가 용출될 가능성이 있다.

> 출처: DISCO Technical Review TR21-02, "Highly purified water-soluble protective film for semiconductor processes," March 2022 (원문 확인 완료)

### 3.2 대안 제품

| 제품/기술 | 공급사 | 특징 |
|-----------|--------|------|
| **Protective Coating Materials** | Tokyo Ohka Kogyo (TOK) | 수용성 수지 용액, 레이저 가공용 |
| **Washable Hard Coat** | Water Wash Tech | 고내열성 수용성 하드코트, 디스플레이·반도체용 |
| **Hybrid Mask (US9177864B2)** | Applied Materials 등 | 이중층 수용성 마스크 + 플라즈마 에칭 결합 |

### 3.3 보호 필름의 한계

- 코팅·세정 공정 추가로 인한 **택트타임 증가**
- 매우 좁은 스트리트(< 30um)에서는 코팅 두께가 실질적 커프 폭에 영향
- 3D 구조(캐비티, 딥 트렌치)에서 균일 코팅 곤란

---

## 4. 세정 기술

### 4.1 기술 비교

| 방법 | 세정 원리 | 입자 제거 능력 | 반도체 적합성 | 주요 장단점 |
|------|-----------|---------------|--------------|-------------|
| **CO2 스노우 클리닝** | 액체 CO2 → 스노우 결정, 열충격 + 기계적 충격 + 용매 작용 + 승화 | **3-5 nm까지, 99.9%+** | 높음 (건식, 무잔류) | 인라인 자동화 가능, 비접촉 |
| **플라즈마 클리닝** | 이온화 가스의 화학적 에칭 | 유기물에 우수 | 중간 (공격적 가능) | 진공 필요, 민감 구조 손상 우려 |
| **초음파 세정** | 액체 내 캐비테이션 | 마이크론급, 가변적 | 낮음 (습식) | 액체 잔류, 재오염 위험, 기판 손상 가능 |

### 4.2 CO2 스노우 클리닝 — 최적 후세정 기술

**CO2 스노우 클리닝이 EMC 패키지 레이저 절단 후세정에 가장 적합한 이유:**

1. **건식 공정**: DI water 사용 없이 입자와 유기 잔류물 동시 제거
2. **나노스케일 제거**: 3-5nm 입자까지 제거 가능 (Bruker Wafer Clean 2200)
3. **비파괴**: 기계적 연마나 화학적 에칭 없음 — 와이어본딩 패드, 범프 손상 없음
4. **인라인 통합**: 레이저 절단 장비와 인라인 배치 가능 (acp systems quattroClean)
5. **환경 친화**: 별도 세정액·폐수 불필요

**수치 투명성**: "99.9%+ 제거 효율"은 Bruker/Eco-Snow의 마케팅 자료 기반이다. 실제 EMC ablation debris(SiO2 필러 + 탄화 에폭시)에 대한 독립 검증 데이터는 확인하지 못하였다.

> 출처: Bruker WC-2200 제품 사양; Hills, "Dry surface cleaning using CO2 snow," J. Vac. Sci. Technol. B, 9(4):1970, 1991 (AIP); acp systems, "CO2 snow-jet cleaning," 2026; co2clean.com

### 4.3 세정 기술 선택 의사결정 가이드

```
if (잔류 debris가 주로 입자성) → CO2 스노우 클리닝
if (잔류 debris가 유기 박막/탄화물) → 플라즈마 클리닝 (O2 plasma)
if (대면적 일괄 세정 필요) → 초음파 세정 (단, 습식 허용 시)
if (HogoMax 사용 중) → DI water 세정만으로 충분
```

---

## 5. 인라인 모니터링

### 5.1 실시간 파티클 모니터링

반도체 공정에서의 인라인 파티클 모니터링 기술은 레이저 절단 공정에 적용 가능하다:

| 기술 | 대표 제품 | 검출 한계 | 적용 방식 |
|------|-----------|-----------|-----------|
| **에어로졸 파티클 카운터** | Particle Measuring Systems Airnet II 201-4 | 0.2 um+ | 챔버 배기 라인에 설치, 실시간 입자 농도 모니터링 |
| **인라인 파티클 센서 (IPS)** | CyberOptics IPS | **0.1 um** | 프로세스 챔버 배기 라인, 고출력 블루 레이저 기반 |
| **LIBS (레이저 유도 플라즈마 분광)** | 연구 단계 | 원소 수준 | 실시간 ablation 플라즈마 모니터링, 조성 분석 |
| **광다이오드 기반 모니터링** | 다수 연구 | 프로세스 의존적 | 방출 광 강도로 가공 상태 간접 추론 |

### 5.2 피드백 제어 가능성

ScienceDirect(2025)의 리뷰에 따르면, 초단펄스(USP) 레이저 가공의 인-시투 모니터링은 다음 센서 조합으로 실현 가능하다:
- **광다이오드**: 빠른 응답, 플라즈마 방출 강도 측정
- **LIBS**: 재료 조성 실시간 확인 — EMC의 경우 Si, Cu, epoxy 분해물 검출
- **신경망 기반 피드백**: 플라즈마 신호 → hole depth 예측 → 보상 가공 (Chang et al., Optics & Laser Technology, 2025)

**실행 연결**: 현재 기술 수준에서 EMC 패키지 절단의 **실시간 품질 제어**(흄 농도 기반 레이저 파라미터 자동 조정)는 연구 단계이다. 단, **이상 감지**(파티클 카운터 기반 threshold alarm)는 즉시 구현 가능하다.

> 출처: ScienceDirect, "Review of in-situ process monitoring for ultra-short pulse laser micromachining," 2024; Particle Measuring Systems, Airnet II application note; CyberOptics IPS product documentation

---

## 6. CFD 시뮬레이션 기반 최적화

### 6.1 레이저 절단 가스 플로우 CFD

| 시뮬레이션 도구 | 모델링 방법 | 주요 적용 | 출처 |
|----------------|------------|-----------|------|
| **OpenFOAM** | Eulerian-Lagrangian (LE), Eulerian-Eulerian (EE) | 노즐 내외 가스·파티클 유동 | Murer PhD thesis, Univ. Pavia |
| **COMSOL Multiphysics** | 열전달 + 유체 + level-set 결합 | 커프 진행, 용융 흐름, 가스 배출 | COMSOL paper 122991, 2025 |
| **ANSYS Fluent** | VOF + UDF | 다상 레이저 절단, 흄 생성·경로 | CFD-Online forum, 2024 |

**핵심 설계 원리**:
1. **노즐 형상**: 수렴형(convergent) 노즐이 가스 스트림을 커프 방향으로 집중시켜 흄 포집 효율 향상
2. **가스 속도 최적화**: 고속 불활성 가스(He)가 compact flow를 형성하나, EMC에서는 N2의 비용 대비 효과가 우수
3. **재순환 방지**: 흡입 위치와 유량을 최적화하여 흄의 챔버 내 재순환(recirculation) 최소화

### 6.2 LPBF 크로스플로우에서 차용 가능한 설계 원리

[이질 도메인: 금속 적층제조 (LPBF/SLM)]

LPBF에서의 가스 플로우 최적화 연구는 EMC 레이저 절단 시스템 설계에 직접 차용 가능한 원리를 제공한다:

| LPBF 원리 | EMC 절단 적용 | 근거 |
|-----------|--------------|------|
| **Cross-flow 균일성이 부품 품질 결정** | 절단 스트리트 전체에 걸쳐 균일한 가스 흐름 필요 | Ferrar et al.: 균일 flow → 균일 부품 특성 |
| **바이패스 시스템으로 재순환 감소** | 흄 재순환 방지용 바이패스 설계 | IJCESEN paper, ANSYS Fluent 시뮬레이션 |
| **노즐 최적화로 난류 감소 + 스패터 배출 향상** | 좁은 스트리트에 맞춘 노즐 단면 설계 | Chen et al., IHPC Singapore, SFF Symposium |
| **Coanda 효과 고려** | 가스가 챔버 벽면을 따라 흐르는 현상 관리 | IJCESEN paper |
| **가스 유속 ~1.5 m/s (빌드 영역 기준)** | 시작점으로 활용, EMC 특성에 맞게 조정 필요 | ScienceDirect, SLM 125 HL 데이터 |

**수치가 틀릴 수 있는 조건**: LPBF의 1.5 m/s 가스 유속은 금속 분말층 위의 수평 흐름 기준이다. EMC 절단에서는 (1) 물리적 스케일 차이, (2) debris 특성(용융 금속 vs 탄화 폴리머), (3) 레이저-재료 상호작용의 차이로 인해 최적 유속이 상이할 것이다.

> 출처: Chen et al., "Optimization of inert gas flow inside LPBF chamber with CFD," IHPC Singapore; IJCESEN, "Analysis of LPBF using CFD," 2025; NIST AMS 100-43, "Inert Gas Flow Speed Measurements in LPBF"

---

## 7. 통합 시스템 설계 권고

### 7.1 EMC 패키지 레이저 절단을 위한 최적 흄·파티클 관리 전략

```
[가공 전]
  └─ HogoMax 수용성 보호 필름 코팅 (spin coat, 0.82-1.58um)
      └─ debris 재증착의 1차 방어선

[가공 중]
  ├─ 어시스트 가스: N2, 최적 압력 (choking 발생하지 않는 범위)
  ├─ 분사 방식: Side-blow 또는 Cross-jet (coaxial의 choking 문제 회피)
  ├─ 로컬 흡입: 절단점 근방 음압 형성 (gas tube 평행 배치, WO2019054945A1)
  └─ 파티클 모니터링: 배기 라인 인라인 파티클 카운터 (threshold alarm)

[가공 후]
  ├─ 1차: DI water 세정 (HogoMax + debris 동시 제거, 30초)
  └─ 2차 (필요 시): CO2 스노우 클리닝 (잔류 나노파티클 제거)
```

### 7.2 핵심 설계 파라미터 매트릭스

| 파라미터 | 권장 범위 | 근거 | 주의사항 |
|----------|-----------|------|----------|
| 어시스트 가스 종류 | N2 (순도 99.9%+) | 산화 방지, EMC 호환 | O2/Air는 EMC 탄화 촉진 |
| 가스 압력 | **MSD 형성 임계 이하** (재료·두께별 실험 필요) | Riveiro et al., choking 모델 | 과도 압력 시 품질 악화 |
| 흡입 유량 | 로컬 흡입 10-50 L/min (규모 의존) | 유사 마이크로가공 사례 추정 | 과도 흡입 시 기판 진동 |
| 보호 필름 두께 | 0.82-1.58 um (회전수 조절) | DISCO TR21-02 | 스트리트 폭 대비 검토 필요 |
| 파티클 모니터링 검출 한계 | 0.1 um | CyberOptics IPS | 비용 대비 0.2 um도 실용적 |

---

## 8. 관점 확장

### 8.1 인접 질문: 결론을 바꿀 수 있는 변수

1. **레이저 펄스폭에 따른 흄 특성 차이**: fs/ps 레이저는 열영향부(HAZ)가 작아 흄 발생량 자체가 적다. ns 레이저 대비 흄 관리 시스템 요구 사양이 크게 달라질 수 있다. TechBriefs(2024)의 실험에서 ps 레이저는 **ns 대비 현저히 적은 debris**를 생성하여 후세정 없이도 양호한 품질을 달성하였다.

2. **EMC 필러 조성의 영향**: EMC의 SiO2 필러 함량(통상 70-85 wt%)이 높을수록 ablation debris 중 경질 입자 비율이 높아져, 흡입 시스템의 필터 마모와 교체 주기에 영향을 준다.

### 8.2 문제 재정의

원래 질문 "흄과 파티클을 효율적으로 배출·제거하는 시스템과 기술은 무엇인가?"보다 더 적절한 핵심 질문:

> **"레이저 파라미터(펄스폭, 출력, 반복률)와 흄·파티클 관리 시스템을 동시 최적화하여, 후세정 부담을 최소화하면서 목표 절단 품질을 달성하는 통합 설계 전략은 무엇인가?"**

이 재정의는 흄 관리를 단독 문제가 아니라 레이저 공정 파라미터와의 **결합 최적화 문제**로 바라보아야 함을 시사한다.

---

## 근거 신뢰도 요약

| 주장 | 출처 유형 | 도메인 일치도 | 확신도 |
|------|-----------|--------------|--------|
| Coaxial nozzle의 ~90% choking | 학술 리뷰 (PMC) | 금속 절단 → EMC 적용 시 차이 가능 | 중-높 |
| HogoMax 50ppb 불순물, 30초 세정 | 1차 기술 리뷰 (DISCO) | EMC/GaAs 직접 테스트 | 높 |
| CO2 스노우 99.9%+ 입자 제거 | 제조사 자료 + 학술 논문 | Si wafer 기반, EMC 미검증 | 중 |
| 과도 가스 압력 → MSD → 품질 저하 | 학술 리뷰 (PMC) | 금속 절단 기반 | 중 |
| LPBF cross-flow 1.5 m/s | 학술 논문 | [인접 도메인: 적층제조] 직접 적용 불가 | 낮-중 |
| 인라인 파티클 센서 0.1um | 제품 사양 (CyberOptics) | 반도체 fab 범용 | 높 |
| Patent WO2019054945A1 가스 튜브 방식 | 특허 | EMC 기판 직접 대상 | 높 |

---

## 출처 목록

1. Riveiro et al., "Laser Cutting: A Review on the Influence of Assist Gas," *Materials* 12(1):157, 2019. https://pmc.ncbi.nlm.nih.gov/articles/PMC6337310/
2. WO2019054945A1, "Cutting method for polymer resin mold compound based substrates and system thereof," 2019. https://patents.google.com/patent/WO2019054945A1/en
3. DISCO Technical Review TR21-02, "Highly purified water-soluble protective film for semiconductor processes," 2022. https://www.disco.co.jp/eg/solution/technical_review/doc/TR21-02
4. Hills, "Dry surface cleaning using CO2 snow," *J. Vac. Sci. Technol. B* 9(4):1970, 1991. https://pubs.aip.org/avs/jvb/article/9/4/1970/468088
5. TechBriefs, "Optimizing Laser Cutting in Semiconductor Advanced Packaging," 2024. https://www.techbriefs.com/component/content/article/53707
6. Chen et al., "Optimization of inert gas flow inside LPBF chamber with CFD," IHPC Singapore. https://repositories.lib.utexas.edu/bitstreams/d9152b01-255b-4d83-9888-a3e9ac9ef01e/download
7. NIST AMS 100-43, "Inert Gas Flow Speed Measurements in LPBF Additive Manufacturing." https://nvlpubs.nist.gov/nistpubs/ams/NIST.AMS.100-43.pdf
8. Particle Measuring Systems, "Real-Time Aerosol Particle Monitoring Inside Semiconductor Process Tools." https://www.pmeasuring.com/real-time-aerosol-particle-monitoring-inside-of-semiconductor-process-tools-using-the-airnet-ii/
9. CyberOptics, "In-Line Particle Sensor." https://www.semiconductor-digest.com/in-line-airborne-particle-sensing/
10. acp systems AG, "CO2 snow-jet cleaning." https://www.acp-systems.com/en/co2-snow-jet-cleaning/
11. IP Systems USA, "How Does a Laser Cutter Fume Extractor Work?" https://ipsystemsusa.com/how-does-a-laser-cutter-fume-extractor-work/
12. ScienceDirect, "Review of in-situ process monitoring for ultra-short pulse laser micromachining," 2024. https://www.sciencedirect.com/science/article/abs/pii/S1526612524012908
13. TW202120630A, "Protective film composition for semiconductor processes." https://patents.google.com/patent/TW202120630A/en
14. US9177864B2, "Method of coating water soluble mask for laser scribing and plasma etch." https://patents.google.com/patent/US9177864B2/en
15. IJCESEN, "Analysis of LPBF Using CFD," 2025. https://www.ijcesen.com/index.php/ijcesen/article/view/3317
