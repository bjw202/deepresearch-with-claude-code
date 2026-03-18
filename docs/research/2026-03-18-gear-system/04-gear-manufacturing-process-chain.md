# 기어 제조 실무 프로세스 체인

## 1. 설계 → 제조 프로세스 체인

### 1.1 설계 단계

**요구사양 → 기어 타입 선정 → 매크로 지오메트리 → 마이크로 지오메트리 → 강도 계산 → 도면**

#### Macro Geometry Design

- Module (m), 잇수 (z), 압력각 (표준 20deg), 비틀림각, 중심거리, 이폭, 전위계수 (x)

#### Micro Geometry Design

- **Profile modification**: Tip relief, Root relief — 에지 접촉 방지, 소음 저감
- **Lead modification**: Lead crowning — 축방향 하중 분포 균일화
- 목적: 전달오차(TE) 최소화, NVH 최적화

출처: [Gear Solutions - Micro Geometry](https://gearsolutions.com/features/layout-of-the-gear-micro-geometry/), [Gear Solutions - Macro/Micro Optimization](https://gearsolutions.com/features/optimizing-gear-macro-and-microgeometry-to-minimize-whine-and-maximize-robustness-for-a-diesel-engine-application/)

#### 강도 계산

- ISO 6336 (접촉/굽힘 강도), AGMA 2001
- 접촉 응력 (Hertzian), 치근 굽힘 응력
- 안전계수 (Sf, Sh), S-N 곡선 기반 수명 계산

### 1.2 공정 계획 단계

#### 소재 선택

| 용도 | 소재 | 특성 |
| --- | --- | --- |
| 일반 자동차 기어 | 20MnCr5 (DIN 1.7147) | 침탄강, 표면 58-62 HRC |
| 경량/저비용 | 16MnCr5 (DIN 1.7131) | 깊은 침탄 가능 |
| 고부하 | 18CrNiMo7-6 | 높은 코어 강도 |
| 미국 표준 | SAE 8620 | 범용 침탄강 |

20MnCr5는 16MnCr5 대비: 탄소 함량↑, 경화능↑, 표면 경도↑, 내마모성↑, 저온 충격 인성↑

출처: [Otai Steel](https://www.otaisteel.com/16mncr5-vs-20mncr5/), [Ovako](https://steelnavigator.ovako.com/steel-grades/20mncr5/)

#### 일반적 가공 순서

1. **Blank Forming**: 단조 + 전가공 (기준면)
2. **Turning**: 보어/외경/단면 기준 가공
3. **Tooth Cutting**: Hobbing / Shaping / Skiving
4. **Deburring / Chamfering**
5. **Heat Treatment**: 침탄(900-950°C) → 담금질(810-840°C) → 템퍼링(150-200°C)
6. **Finish Machining**: 기준면 연삭 → 치형 연삭
7. **Inspection**: 치형, 리드, 피치, 런아웃, 경도, 금속조직

#### 검사 방법

| 검사 항목 | 방법 | 장비 |
| --- | --- | --- |
| 치형 프로파일 | Single flank test | 기어 전용 측정기 (Klingelnberg, Gleason) |
| 리드/피치 | CMM 기반 | 브리지 CMM / 수평암 CMM |
| 복합 편차 | Double flank roll test | DFGT 장비 |
| 표면 경도 | Rockwell/Vickers | 경도계 |
| 금속조직 | 단면 관찰 | 금속현미경 |

출처: [Gear Solutions - Gear Inspection](https://gearsolutions.com/features/an-elementary-guide-to-gear-inspection/), [Mitutoyo](https://www.mitutoyo.com/article/consider-a-cmm-for-gear-inspection/)

---

## 2. 기어 종류별 제조 공정

### 2.1 Spur / Helical

**Hobbing → (Shaving) → Heat Treatment → Grinding**

- Hobbing: AGMA 8-10, Shaping 대비 15-25% 빠름
- Grinding: Profile grinding 또는 Generating grinding (나사형 휠)

### 2.2 Bevel Gears

| 항목 | Face Milling | Face Hobbing |
| --- | --- | --- |
| 방식 | 1 치간 순차 | 연속 창성 |
| 치형 | Involute 계열 | Epicycloid 계열 |
| 업체 | Gleason (5-cut) | Klingelnberg/Oerlikon |
| 마무리 | Grinding | Lapping |
| 생산성 | 중간 | 높음 |

출처: [Gear Solutions](https://gearsolutions.com/features/face-off-face-hobbing-vs-face-milling/)

### 2.3 Worm Gears

- Worm: 선삭 + 나사 연삭
- Worm Wheel: 전용 호빙
- 전형적 재질: 강 웜 + 청동 웜 휠
- 매칭 필요 → 가장 비용 높은 유형

### 2.4 Internal Gears

| 항목 | Broaching | Shaping | Power Skiving |
| --- | --- | --- | --- |
| 생산성 | 매우 높음 | 낮음 | Shaping 2-3배 |
| 정밀도 | ISO 8-11 | Ra 0.6-1.2μm | 높음 |
| 유연성 | 매우 낮음 | 높음 | 높음 |
| 적용 크기 | 8인치 미만 | 제한 적음 | 제한 적음 |

Power skiving: Shaping 대비 3-5배 빠름, 1클램핑 황삭+정삭 가능.

출처: [EMAG](https://www.emag.com/industries-solutions/technologies/power-skiving/), [Gear Solutions](https://gearsolutions.com/features/power-skiving-high-quality-productivity-and-cost-efficiency-in-gear-cutting/)

---

## 3. 공구 선정 실무

### 3.1 호브(Hob) 선정

**필수 매칭**: 법선 모듈 = 기어 모듈, 압력각 = 기어 압력각

#### 재질 선택

| 재질 | 용도 |
| --- | --- |
| HSS (M2, M35) | 범용, 습식 |
| PM-HSS (ASP2030/2052) | 고성능, 긴 수명 |
| Solid Carbide | 건식, 소경 다조 |
| Carbide-tipped HSS | 인성 + 내마모 |

#### 코팅 효과

| 코팅 | 효과 | 용도 |
| --- | --- | --- |
| TiN | 수명 4배 향상 | 범용 |
| TiAlN | 고경도, 건식 가능 | 고속 |
| AlCrN | TiAlN+50% 수명 | 건식 hobbing 최적 |

#### 호브 등급 → 기어 등급 대응

| 호브 등급 | 기어 등급 |
| --- | --- |
| AA | ISO Grade 6+ |
| A | ISO Grade 7 |
| B | ISO Grade 8 |
| C | Grade 9+ |

출처: [Gear Solutions](https://gearsolutions.com/features/cutting-tool-selection-criteria-for-cylindrical-gear-manufacturing/), [Gear Technology](https://www.geartechnology.com/cutting-tool-selection-criteria-for-cylindrical-gear-manufacturing)

### 3.2 연삭 휠 선정

| 항목 | Aluminum Oxide | CBN |
| --- | --- | --- |
| 드레싱 간 가공수 | 40-80개 | 2,200-2,500개 |
| 워크 열전달 | \~63% | \~4% |
| 수명 | 단기 | 4-6개월 |
| 초기 비용 | 낮음 | 높음 |

CBN: 드레싱 빈도 대폭↓, 열손상 최소화 → 대량 생산 유리.

출처: [Norton Abrasives](https://www.nortonabrasives.com/en-us/resources/expertise/why-select-gear-grinding-cbn)

### 3.3 공구 카탈로그 데이터 구조

- **ISO 13399 / GTC**: Siemens PLM + Sandvik + Iscar + Kennametal 공동 벤더 중립 분류
- **Liebherr**: 오픈소스 기어 공구 데이터 구조 (hobbing, grinding, shaping, skiving 전 커버)
- 호브 주요 파라미터: Module, Pressure Angle, Starts, OD, Length, Bore, Flutes, Material, Coating, Class, Protuberance, Topping, Vc/f 권장

출처: [Machinery](https://www.machinery.co.uk/content/news/vendor-neutral-cutting-tools-catalogue-structure-supports-standardised-data-exchange-with-plm-and-cadcam-systems), [Liebherr](https://liebherr.com/en/int/products/gear-technology-and-automation-systems/gear-cutting-machines/industry-4.0/industry-4.0.html)

---

## 4. 공정 최적화

### 4.1 절삭 조건 (Hobbing, Steel)

| 파라미터 | 중탄소강 (45#) | 합금강 (40Cr) | 단위 |
| --- | --- | --- | --- |
| 절삭속도 Vc | 50-80 | 40-60 | m/min |
| 이송 f | 0.2-0.4 | 0.2-0.3 | mm/rev |

고속 (Carbide hob, dry): 최대 200-400 m/min

출처: [THORS](https://thors.com/gear-hobbing-cutting-parameters-to-optimize-the-hobbing-process/), [Toman Machines](https://www.tomanmachines.com/news/unveiling-the-machining-parameters-for-hobbing-machines-when-processing-gears-of-different-materials-302707.html)

### 4.2 품질 등급 체계

**ISO 1328-1**: Grade 1(최고) \~ 12(최저). 허용 편차는 모듈 + 기준 직경으로 결정.

**공정별 달성 가능 등급 (ISO)**

| 공정 | 달성 등급 |
| --- | --- |
| Hobbing | 7-10 |
| Shaving | 6-8 |
| Profile Grinding | 3-6 |
| Generating Grinding | 4-7 |
| Power Skiving | 6-8 |

출처: [Motion Control Tips](https://www.motioncontroltips.com/current-status-of-agma-and-iso-gear-quality-standards/)

### 4.3 핵심 Trade-off

- 높은 Vc → 짧은 사이클 타임 BUT 짧은 공구 수명
- 높은 품질 등급 → 연삭 필수 → 추가 비용
- CBN 휠 → 긴 드레싱 주기 BUT 높은 초기 비용
- 건식 가공 → 환경/비용↑ BUT 공구 부하↑

---

## 5. 디지털화 현황

### 5.1 설계 소프트웨어

#### KISSsoft (Gleason)

- ISO 6336 / AGMA 2001 기반 강도 계산
- 내장 스크립팅, COM 인터페이스
- CAD 통합: SolidWorks, NX, CATIA
- 2025: AI 보조 구성, 예측 분석, 클라우드

출처: [Gleason](https://www.gleason.com/design)

#### MASTA (SMT)

- 전체 트랜스미션 설계/시뮬레이션 (75+ 모듈)
- C# 기반, 전기 파워트레인 통합

출처: [SMT](https://www.smartmt.com/masta/)

#### Romax (Hexagon)

- 기어박스/드라이브라인 최적화
- Concept → Enduro 파이프라인

출처: [Hexagon](https://hexagon.com/products/product-groups/computer-aided-engineering-software/romax)

### 5.2 기어 전용 CAM

#### Gleason GEMS

- 베벨 기어 + 일부 원통 기어
- 2D/3D Loaded TCA, 공구 설계, 치면 최적화

#### Klingelnberg KIMoS / KOMET

- KIMoS: 스파이럴 베벨 설계-최적화-생산 통합
- KOMET: 측정 편차 → 기계/공구 보정 자동 계산 (Closed-loop)

출처: [Gleason GEMS](https://www.gleason.com/en/products/design-simulation-products/design-simulation/design-simulation/gems-gleason-engineering-and-manufacturing-system), [Klingelnberg KIMoS](https://klingelnberg.com/en/business-divisions/bevel-gear-technology/software/kimos)

### 5.3 API/자동화 가능성

| Software | API | 개방성 |
| --- | --- | --- |
| KISSsoft | 스크립팅, COM | 중간 |
| MASTA | C# 기반 | 중간 |
| GEMS | CAGE/UNICAL 전송 | 폐쇄적 |
| KIMoS/KOMET | 측정-보정 루프 | 폐쇄적 |

### 5.4 Industry 4.0 동향

- **Liebherr**: 오픈소스 공구 데이터, RFID 공구 관리
- **ISO 13399/GTC**: 벤더 중립 공구 데이터 교환
- **Closed-loop**: 측정→보정 자동 피드백 (Klingelnberg KOMET)
- **디지털 트윈**: 기어 제조 공정 가상 시뮬레이션

---

## 자동화 시스템이 모델링해야 할 핵심 도메인 지식

1. **기어 지오메트리**: macro + micro 파라미터
2. **강도 계산 표준**: ISO 6336 / AGMA 2001 입출력 관계
3. **소재-열처리 매핑**: 소재별 침탄/담금질/템퍼링 조건 및 결과 경도
4. **공정 라우팅 규칙**: 기어 타입 → 공정 체인 → 달성 품질
5. **공구 선정 로직**: 기어 파라미터 → hob/wheel 사양 매핑
6. **절삭 조건 DB**: 소재-공구-기계 조합별 Vc, f 범위
7. **품질 등급 체계**: ISO 1328 등급별 허용 편차 계산식
8. **최적화 모델**: 비용-시간-품질-공구수명 다목적 최적화
9. **SW 연동**: KISSsoft COM API, ISO 13399, Liebherr 오픈 데이터