# 재료별 어블레이션 부산물 특성 및 오염 메커니즘

## 핵심 발견 요약

1. **구리(Cu) 어블레이션은 전도성 나노파티클과 산화물(CuO/Cu2O)을 생성하여, 재증착 시 전기적 단락 위험이 가장 높은 재료이다.**
2. **EMC 어블레이션은 유기 VOC 흄과 비활성 실리카 필러 파티클의 이원적 부산물을 발생시키며, 필러 입자 크기가 어블레이션 효율과 잔류물 특성을 좌우한다.**
3. **FR-4 기판은 유리섬유와 에폭시의 열적 특성 차이(Tg ~150-200 vs ~1725)로 인해 선택적 어블레이션이 일어나며, 이질적 부산물이 혼합 생성된다.**
4. **다층 구조 인터페이스에서 재료가 전환되는 지점이 가장 높은 오염 위험 구간이며, 혼합 부산물이 단일 재료보다 제거가 어렵다.**
5. **펄스폭이 짧을수록(fs > ps > ns) 열영향부(HAZ)와 용융 재증착이 감소하지만, fs 레이저는 오히려 더 작은 나노파티클을 더 많은 수로 생성한다.**

---

## 1. 구리(Cu) 어블레이션 부산물 특성

### 1.1 나노파티클 생성 및 크기 분포

구리는 반도체 패키지에서 리드프레임, 본딩 패드, 배선층으로 사용되며, 레이저 어블레이션 시 **전도성 나노파티클**을 다량 생성한다.

- **ns 레이저 어블레이션**: 단일(single) 구형 파티클이 주로 생성되며, 비교적 균일한 크기 분포를 보인다 (Liu et al., UC Berkeley 연구, 파티클 사이즈 분포 측정)
- **fs 레이저 어블레이션**: ns 대비 **더 높은 수밀도(number density)**의 파티클이 생성되며, 개별 나노 크기 파티클의 응집체(agglomerate)가 주를 이룬다. 응집체 크기는 5-10 um에 달하며, 개별 1차 파티클은 수십 nm 수준이다 (Liu et al., UC Berkeley, SEM 관찰)
- **파티클 형상**: ns 파티클 = 구형/단일, fs 파티클 = 불규칙 응집체

> **수치 투명성**: 위 파티클 크기 데이터는 대기압 Ar 분위기에서의 어블레이션 챔버 실험 결과이다. 반도체 패키지 레이저 싱귤레이션의 실제 공정 환경(assist gas 유무, 진공도)에 따라 크기 분포가 달라질 수 있다. [인접 도메인: 레이저 어블레이션 분석화학(LA-ICP-MS)]

### 1.2 산화물 형성 메커니즘

구리 나노파티클은 대기 노출 시 **빠르게 산화**된다:

- **50 이하**: Cu2O 산화 아일랜드가 핵생성 후 성장, 균일한 산화층으로 합쳐짐 (Cabrera-Mott 메커니즘). 자기제한적(self-limiting) 산화층 두께: **5.5 +/- 0.7 nm** (Nilsson et al., in situ 환경 STEM 관찰)
- **100-200**: 외향 산화 + 내향 산화(Valensi-Carter 메커니즘) 동시 진행, 산화 속도 급격히 증가
- **산화 분율 0.3-0.4 도달 시**: Kirkendall void 형성 시작, 나노파티클 내부 공극 발생 (Nilsson et al.)

**의사결정 연결**: Cu 어블레이션 부산물이 재증착되면, 산화 상태에 따라 전기적 영향이 달라진다. **금속 Cu 파티클은 직접 단락**을, **CuO/Cu2O 파티클은 반도체/절연체로 작용**하여 접촉 저항 불안정을 유발한다. 따라서 구리 어블레이션 후 재증착 방지가 최우선이며, 불가피한 경우 산화 환경 제어가 2차 방어선이다.

### 1.3 재증착 패턴

- 어블레이션 플루언스 증가 시 debris 양 증가, 스캐닝 속도 감소 시 단위 면적당 펄스 수 증가로 debris 증가 (Springer, micro/nano hybrid surface 연구)
- **가우시안 빔 외곽 영역**에서 LIPSS(Laser-Induced Periodic Surface Structures) 형성이 관찰되며, 이는 어블레이션 임계값 근처의 에너지가 가해지는 그루브 상단부에서 발생
- Cu 재증착물은 와이어본딩 불량, 솔더링 불량, 전기적 단락의 직접적 원인이 됨 (Girardi et al., LTCC 레이저 어블레이션 연구, JMEP 2015)

> **반증 탐색**: Cu 재증착이 항상 유해한가? -- 일부 연구에서 재증착 Cu가 산화되어 절연층 역할을 할 가능성이 언급되나, 신뢰성 시험(온도 사이클, 습도)에서 산화층 불안정으로 인해 **장기 신뢰성 확보 불가**라는 것이 지배적 견해이다. 반증 미발견.

---

## 2. EMC (Epoxy Molding Compound) 어블레이션 부산물 특성

### 2.1 조성과 어블레이션 메커니즘

EMC는 에폭시 수지 매트릭스 + 실리카(SiO2) 필러의 복합재이다. 어블레이션 시 두 성분이 **상이한 거동**을 보인다.

**에폭시 수지 분해:**
- UV/근적외선 레이저 에너지 흡수 시 C-C, C-O, C-H, C-Si 결합 절단
- **VOC(휘발성 유기 화합물)** 생성: 페놀, 비스페놀 A 유도체, 기타 열분해 파편
- fs 레이저의 "cold ablation" 패러다임에도 불구하고, 초점 체적 내 에너지 밀도가 10 MJ/cm3 이상에 달하여 **800-1200 K의 순간 온도** 발생 (Zhang & Shin, J. Manuf. Process, 2025, 두 온도 모델 연구)
- 가스 분해 산물이 어블레이션 플룸 내 파티클 밀도 증가 -> **플라즈마 차폐(plasma shielding)** 유발, 후속 펄스 에너지 감쇄 (Springer, femtosecond laser drilling of epoxy composites review)

**실리카 필러 거동:**
- 실리카의 융점(~1713) 이하에서는 분해 없이 **물리적 방출(ejection)**
- **3가지 어블레이션 메커니즘 영역** 식별 (Zhang & Shin, 2025 TMS):
  1. **증발(evaporation)**: 낮은 플루언스에서 수지만 제거
  2. **직접 방출(direct ejection)**: 높은 플루언스에서 필러 입자가 통째로 방출 -> 재료 제거율 대폭 향상
  3. **전이 구간(transition range)**: 두 메커니즘의 혼합

- **필러 크기의 영향**: 큰 필러 EMC는 동일 조건에서 **어블레이션 효율이 낮으며**, 직접 방출 개시에 더 높은 레이저 파워 필요 (Zhang & Shin, J. Manuf. Process 141:481-493, 2025)

> **수치 투명성**: 800-1200 K 순간 온도는 two-temperature 모델 시뮬레이션 결과이며, 실제 측정값이 아니다. 에폭시 조성(충전재 비율, 수지 종류)에 따라 달라질 수 있다.

### 2.2 부산물 분류

| 부산물 유형 | 특성 | 위험도 |
|------------|------|-------|
| **유기 VOC 흄** | 페놀, 비스페놀A 파생물, CO, CO2 등 가스상 | 호흡기 자극, 작업자 안전 위험 |
| **탄화 잔류물(char)** | 불완전 분해 시 커프 벽면에 탄소질 잔류물 | 표면 오염, 접착 불량 |
| **실리카 파티클** | 미분해 필러의 물리적 방출, um 단위 | 비전도성, 기계적 오염 |
| **혼합 응집체** | 탄화물 + 실리카 + 수지 잔류물 복합체 | 세정 난이도 증가 |

### 2.3 산업 사례: QFN 패키지 EMC 어블레이션

STMicroelectronics에서 수행한 QFN 패키지 EMC 어블레이션 연구 (Antilano & Arellano, IRJAES, 2019):

- **레이저 사양**: 파장 1030 nm, 평균 출력 40 W, 반복률 200-800 kHz, 펄스 에너지 <200 uJ, **펄스폭 800 +/- 200 fs** (초단 펄스)
- **결과**: EMC 어블레이션 후 리드프레임 측벽 노출 성공, **HAZ 미관찰**
- **잔류물 처리**: 잔류 수지 및 필러는 **화학적 디플래시(chemical deflash) + 고압 워터젯**으로 제거
- **의의**: fs 레이저로 EMC 선택적 제거 가능, 단 후처리(chemical deflash) 필수

> **실행 연결**: EMC 어블레이션 공정 설계 시, fs 레이저 사용으로 HAZ를 최소화하되, 잔류 필러/탄화물 제거를 위한 **후세정 공정(chemical deflash + waterjet)**을 반드시 포함해야 한다. 후세정 없이는 접합 신뢰성 확보 불가.

---

## 3. FR-4 / BT 기판 어블레이션 부산물 특성

### 3.1 복합재의 이원적 어블레이션

FR-4는 유리섬유(E-glass, 융점 ~1725) + 에폭시 수지(Tg ~130-180)의 복합재이다. 두 성분의 **극단적 열적 특성 차이**가 어블레이션 거동을 결정한다.

- **에폭시 수지**: 낮은 용융/분해 온도로 인해 먼저 기화/분해 -> VOC 흄 발생 (EMC와 유사한 유기 분해 산물)
- **유리섬유**: 수지보다 훨씬 높은 에너지 필요, CO2 레이저에서는 수지 선택적 제거 후 유리섬유가 남음
- **탄화(charring)**: CO2 레이저(10.6 um) 사용 시 탄화 경향 증가, UV 레이저(355 nm) 사용 시 광화학적 분해로 탄화 최소화 (LPKF CleanCut 기술)

### 3.2 부산물 특성

| 부산물 | 레이저 종류별 차이 |
|--------|-------------------|
| **에폭시 VOC 흄** | 모든 레이저에서 발생, UV에서 상대적으로 "깨끗한" 분해 |
| **유리섬유 파티클** | CO2 레이저: 미세 유리 분진 발생, UV 레이저: 최소화 |
| **탄화 잔류물** | CO2 > IR >> UV 순서로 탄화 심각 |
| **디라미네이션 debris** | 기계적 방법 대비 레이저 가공이 현저히 적음 |

- LPKF CleanCut 공정: 탄화, 연소, HAZ 없이 **기술적 청정도(technical cleanliness)** 달성 (LPKF 기술 자료)
- 기계적 절단 대비: 먼지, 섬유 delamination, 버(burr) 없음 -> 전기적 단락 위험 감소

> **관점 확장**: FR-4 레이저 가공의 숨은 변수는 **수분 함량**이다. FR-4 변종별 흡수율이 다르며(0.10-0.20%), 수분이 레이저 가공 시 급격한 증기화를 일으켜 디라미네이션 및 예측 불가능한 파티클 방출을 유발할 수 있다.

---

## 4. 솔더마스크 어블레이션 부산물 특성

### 4.1 유기물 분해 메커니즘

솔더마스크는 에폭시 또는 아크릴레이트 기반 유기 절연 코팅이다.

- **UV 레이저(266-355 nm)** 어블레이션 시 **광화학적 분해** 우세: C-C, C-O, C-H, C-Si 결합 직접 절단
- 짧은 펄스(6 ns, 0.6-200 mJ)의 높은 순간 에너지가 재료를 직접 기체로 전환 -> 탄화 잔류물 최소화 (US7081209B2 특허)
- **주요 분해 산물**: VOC 가스 (CO, CO2, 저분자 유기물), 일부 미완전 증발 폴리머(smear)
- Smear 잔류 시 **디스미어(desmear) 후처리**(화학적 또는 플라즈마) 필요

### 4.2 대응 전략

- 레이저 파라미터 최적화로 smear 최소화 (출력, 스캔 속도, 반복률 조정)
- UV 레이저 선택이 핵심: IR/CO2 대비 탄화 극소화
- 국소 배기(fume extraction)로 VOC 포집

> **반증 탐색**: 솔더마스크 레이저 제거가 하부 구리 트레이스를 손상시키는가? -- UV 레이저는 구리의 높은 어블레이션 임계값(~3-7 J/cm2 vs 솔더마스크 ~0.5-1 J/cm2)을 활용하여 **선택적 제거**가 가능하다. 단, 과도한 에너지 밀도나 다중 패스 시 구리 표면 산화/roughening 가능. 반증 미발견 -- 적절한 파라미터 범위 내에서 선택적 제거는 산업적으로 검증됨.

---

## 5. 다층 구조 인터페이스의 혼합 부산물 효과

### 5.1 재료 전환 지점의 위험성

반도체 패키지 레이저 싱귤레이션에서 레이저는 순차적으로 **솔더마스크 -> FR-4/BT -> Cu 배선 -> EMC** 등 다층 구조를 관통한다. 각 인터페이스에서:

- **에너지 흡수 특성 급변**: 유기물(낮은 임계값) -> 금속(높은 임계값) 전환 시 과잉 에너지가 금속 표면에서 폭발적 파티클 방출 유발
- **혼합 부산물 생성**: Cu 나노파티클 + 에폭시 탄화물 + 실리카 필러가 혼합된 복합 debris -> 단일 세정 방법으로 제거 곤란
- **재증착 복합 오염**: 전도성(Cu) + 절연성(SiO2) + 유기(탄화물) 파티클이 혼재하여 **전기적 거동 예측 불가**

### 5.2 PCB 단락 수리 사례에서의 교훈

구리/기판 다층 구조의 레이저 선택적 제거 연구 (ScienceDirect, 2025):

- 대부분의 구리는 **직접 레이저 어블레이션**으로 제거
- 잔류 대형 Cu 구체(large copper spheres)가 기판 표면에 부착
- 추가 레이저 조사 시 하부 수지 분해 -> **기계적 박리력(mechanical tearing force)** 발생으로 잔류 Cu 제거
- **직접 어블레이션 + 레이저 유도 능동적 기계적 박리**의 복합 메커니즘 확인

> **[이질 도메인: 항공우주 복합재 표면 처리]** NASA의 CFRP(탄소섬유강화플라스틱) 레이저 어블레이션 연구에서, 수지 선택적 제거 후 탄소섬유 노출 시 **어블레이션 필드 가장자리에 debris 재증착**이 관찰됨. 반도체 패키지의 다층 구조에서도 유사한 가장자리 재증착 패턴이 예상된다 (Palmieri et al., NASA Langley, 2016).

---

## 6. 2차 오염 메커니즘

### 6.1 전기적 단락 (Electrical Short)

| 오염 경로 | 원인 재료 | 메커니즘 | 위험도 |
|-----------|----------|---------|-------|
| Cu 나노파티클 재증착 | Cu 리드프레임/배선 | 전도성 파티클이 인접 패드/트레이스 간 브릿지 형성 | **최고** |
| Cu 산화물 파티클 | Cu 어블레이션 후 산화 | 반도체 특성의 CuO/Cu2O가 조건에 따라 전도 | 높음 |
| 탄화 잔류물 | EMC, 솔더마스크 | 탄소질 잔류물이 부분적 전도성 보유 시 | 중간 |

### 6.2 접합 불량 (Bonding Failure)

- **와이어본딩 불량**: 본딩 패드 위 재증착물이 Au-Cu 또는 Cu-Cu 본딩 계면 오염 (Girardi et al., JMEP 2015: "redeposition must be minimized to prevent foreign-object debris that interferes with wire bonding, soldering, and electrical integrity")
- **솔더링 불량**: Cu 산화물이 솔더 습윤성 저하 유발, EMC 잔류물이 플럭스 활성도 억제
- **디라미네이션**: 유기 잔류물이 EMC-리드프레임 계면 접착력 약화

### 6.3 외관 불량 (Cosmetic Defect)

- 커프 주변 변색, 탄화 흔적
- 패키지 표면의 미세 파티클 부착
- 고객 외관 검사 기준 불합격

> **문제 재정의**: 원래 질문은 "재료별 부산물 특성 차이"에 초점을 맞추었으나, 실제 의사결정에서 더 중요한 질문은 **"어떤 재료 조합이 가장 위험한 혼합 오염을 생성하는가"**이다. Cu + EMC 인터페이스가 전도성/절연성 혼합 debris로 인해 가장 높은 위험을 가진다.

---

## 7. 재료 의존적 대응 전략

### 7.1 재료별 최적 접근 비교

| 재료 | 최우선 과제 | 권장 레이저 | 필수 후처리 | 특수 고려사항 |
|------|-----------|-----------|-----------|-------------|
| **Cu** | 재증착 방지 (전기적 단락) | fs/ps (HAZ 최소화) | 세정 (DI water + IPA) | 산화 방지: N2 assist gas |
| **EMC** | 필러 잔류물 + 탄화물 제거 | fs (cold ablation) | Chemical deflash + waterjet | 필러 크기별 파라미터 최적화 |
| **FR-4** | 유리섬유 분진 + 탄화 방지 | UV (355nm) | 디스미어 (필요 시) | 수분 관리, CO2 회피 |
| **솔더마스크** | 선택적 제거 (하부 Cu 보호) | UV (266-355nm) | 디스미어 (smear 발생 시) | 에너지 밀도 정밀 제어 |
| **다층 인터페이스** | 혼합 debris 방지 | 재료별 파라미터 전환 | 복합 세정 (화학 + 물리) | 인터페이스 통과 시 에너지 점진적 조정 |

### 7.2 Assist Gas 및 진공 추출

- **N2/Ar assist gas**: 45도 각도, 10-50 sccm으로 어블레이션 플룸 실시간 배제, 재증착 50-90% 감소
- **진공 추출 노즐**: 레이저 헤드에 통합된 국소 진공으로 >95% 파티클 포집
- **복합 시스템**: assist gas + 진공 동시 적용이 최적, 특히 Cu 어블레이션에서 필수

### 7.3 펄스폭별 전략 선택

| 펄스폭 | HAZ | 파티클 크기 | 파티클 수 | 탄화 | 적용 권장 |
|--------|-----|-----------|----------|-----|----------|
| **fs (<1 ps)** | <2 um (실질적 없음) | 나노 수준 (응집체 5-10 um) | **많음** | 최소 | EMC, Cu 정밀 가공 |
| **ps (1-100 ps)** | 수 um | 중간 | 중간 | 적음 | 범용, 비용 대비 효율 |
| **ns (>1 ns)** | **40+ um** | 구형, 상대적 대형 | 적음 | 심함 | 두꺼운 재료, 고속 가공 |

출처: Le Harzic et al., Appl. Phys. Lett. 80(21):3886-3888 (HAZ 비교); Liu et al., UC Berkeley (파티클 비교)

> **수치 투명성**: HAZ 40 um은 Al 시편 마이크로드릴링 실험 결과이며, Cu/EMC에 직접 적용 시 재료 열전도도 차이로 값이 달라진다. Cu는 Al보다 높은 열전도도로 HAZ가 더 클 수 있다. 이 수치가 틀릴 수 있는 조건: 고반복률에서 열 축적(heat accumulation) 발생 시 HAZ는 단일 펄스 예측보다 커진다.

---

## 8. 환경/안전 측면

### 8.1 EMC 어블레이션 흄의 독성

- **주요 위험**: 에폭시 수지 열분해 시 **페놀, 비스페놀A 유도체, 이소시아네이트** 등 발생 가능
- EMC SDS(안전보건자료): GHS 위험문구 H314 - 심한 피부 화상 및 눈 손상 유발 (IDI Composites EMC SDS)
- **실리카 필러**: 결정질 실리카 포함 시 호흡성 분진으로 규폐증 위험, 비정질(fused silica)은 상대적으로 낮은 위험
- **경화제 분해물**: 아민계 경화제 사용 EMC의 경우 추가 독성 화합물 가능

### 8.2 배기 및 필터 요구사항

| 필터 단계 | 기능 | 사양 참고 |
|----------|------|----------|
| **프리필터** | 대형 파티클 포집, HEPA 수명 연장 | DeepPleat 등 |
| **HEPA 필터** | 0.3 um 이상 파티클 99.997% 제거 | 클린룸 등급 유지 필수 |
| **활성탄 필터** | VOC, 유기 가스, 악취 흡착 | EMC/솔더마스크 가공 시 필수 |
| **화학 필터** | HCl 등 산성 가스 중화 (PVC 함유 재료 시) | 선택적 적용 |

- 실시간 모니터링 및 필터 교체 알람 시스템 권장
- 반도체 클린룸 환경에서는 HEPA + 활성탄 복합 시스템이 표준

### 8.3 작업자 보호

- 레이저 가공은 샌드블라스팅 대비 소음, 분진 노출이 현저히 낮음
- 그러나 **국소 배기(LEV: Local Exhaust Ventilation)** 없이는 VOC 노출 위험
- OSHA/산업안전 기준 준수: 작업장 공기 중 유기물 농도 모니터링 필요

---

## 9. 산업 사례 및 특허

### 9.1 주요 특허

- **US6399463B1** (2002): 레이저 싱귤레이션 방법 - 웨이퍼 후면에서 레이저 어블레이션으로 전면 보호, 반사층에서 정지하여 트렌치 형성. Assist gas 및 진공 세정 암시
- **US11400545B2**: 반도체 다이 수용 프레임 제작을 위한 레이저 어블레이션 - 캐비티 형성

### 9.2 산업 관행

- **DISCO Corporation**: 레이저 풀컷 다이싱 시스템, 200 um 미만 웨이퍼 대상, 진공 통합
- **MKS Instruments**: Die Singulation 기술 브리핑 - 레이저 스크라이브 + 기계적 다이싱 하이브리드 방식, DRIE 확장
- **LPKF**: CleanCut 기술로 FR-4 레이저 디패널링 시 탄화/HAZ 없는 가공 달성
- **STMicroelectronics**: fs 레이저로 QFN EMC/Cu 어블레이션, chemical deflash + waterjet 후처리 (Antilano & Arellano, 2019)
- **Stealth Dicing (DISCO)**: 웨이퍼 내부에 변질층 형성 후 테이프 확장으로 분리 -> **debris 제로**, kerf 1-3 um. 단, 평활한 Si 표면 + 특정 저항률 조건 필요

### 9.3 SIA PFAS 방출 매핑

반도체 산업 협회(SIA) 보고서 (2023)에서 패키지 공정 중 레이저 어블레이션 관련 배출 매핑:
- 레이저 라우팅/싱귤레이션 시 어블레이션 물질이 배기로 방출
- 필터 폐기물의 매립/소각 처리 필요
- 몰드 컴파운드의 휘발 성분이 리플로우 공정에서도 방출되어 배기 필터에 포집

---

## 10. 관점 확장 및 인접 질문

### 10.1 결론을 바꿀 수 있는 숨은 변수

1. **레이저 반복률과 열 축적**: 고반복률(>MHz) fs 레이저에서는 단일 펄스 "cold ablation" 가정이 무너지며, **열 축적(heat accumulation)**으로 인해 ns급 열 효과가 나타날 수 있다. 이는 모든 재료에서 부산물 특성을 변화시킨다.

2. **습도/수분 환경**: 패키지 재료의 수분 흡수율이 어블레이션 시 예상치 못한 증기 폭발을 유발할 수 있으며, 이는 파티클 방출 패턴을 크게 변화시킨다.

### 10.2 인접 질문

1. "어블레이션 부산물의 **장거리 이동(far-field transport)** 메커니즘과 클린룸 오염 범위는 어디까지인가?" -- 재증착은 근접장(kerf 주변)만 논의되지만, 미세 나노파티클의 원거리 부유/확산이 후속 공정에 영향을 줄 수 있다.

2. "**인라인 모니터링**(real-time particle counting, 플라즈마 발광 분석)으로 어블레이션 품질을 공정 중 판단할 수 있는가?" -- 현재는 후검사(post-inspection) 의존이 대부분이다.

### 10.3 문제 재정의

조사 결과, 원래 질문 "재료별 부산물 특성 차이"보다 더 적절한 핵심 질문은:

> **"다층 반도체 패키지의 레이저 싱귤레이션에서, 재료 인터페이스 전환 시 발생하는 혼합 부산물의 복합 오염을 최소화하는 최적의 에너지-시간 프로파일(energy-temporal profile)은 무엇인가?"**

---

## 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치도 | 확신도 | 검증 필요 |
|-----------|------|-------------|-------|----------|
| fs 레이저 HAZ < 2 um | Le Harzic et al., Appl. Phys. Lett. 2002 | 중간 (Al, 직접 Cu 아님) | 높음 | Cu/EMC 실측 필요 |
| Cu 나노파티클 자기제한 산화 5.5nm | Nilsson et al., in situ STEM | 높음 (Cu 직접 연구) | 높음 | 패키지 환경에서 검증 |
| EMC fs 어블레이션 시 800-1200K 순간 온도 | Zhang & Shin, 2025 (시뮬레이션) | 높음 (EMC 직접) | 중간 (시뮬레이션) | 실험 검증 필요 |
| fs vs ns 파티클 크기/수 차이 | Liu et al., UC Berkeley | 중간 (분석화학 용도) | 높음 | 패키지 조건 확인 |
| QFN EMC 어블레이션 후 chemical deflash 필수 | Antilano & Arellano, 2019 | **높음 (직접 사례)** | 높음 | - |
| Cu 재증착이 와이어본딩 불량 유발 | Girardi et al., JMEP 2015 | 중간 (LTCC) | 높음 | 패키지 환경 확인 |
| 필러 크기가 EMC 어블레이션 효율 좌우 | Zhang & Shin, J. Manuf. Process 2025 | **높음** | 높음 | - |

---

## 출처 목록

1. Antilano, E. Jr. & Arellano, I.H. "Ultra-Short Pulsed Laser Ablation of Epoxy Mold Compound or Copper Frames for Partial Cut QFNs." IRJAES, Vol. 4, Issue 2, pp. 123-125, 2019.
2. Zhang, S. & Shin, Y.C. "Analysis of ultrafast laser ablation of fused silica filled epoxy molding compound (EMC) using an improved two-temperature model." J. Manuf. Process 141:481-493, 2025.
3. Zhang, S. & Shin, Y.C. "Ultrafast Laser Dicing of Fused Silica Filled Epoxy Molding Compound (EMC): Process Mechanisms." 2025 TMS Annual Meeting.
4. Le Harzic, R. et al. "Comparison of Heat Affected Zone due to nanosecond and femtosecond laser pulses using Transmission Electronic Microscopy." Appl. Phys. Lett. 80(21):3886-3888, 2002.
5. Liu et al. "A study of particle generation during laser ablation with applications." UC Berkeley, escholarship.org.
6. Nilsson, S. et al. in situ plasmonic nanospectroscopy/STEM studies of Cu nanoparticle oxidation. (Referenced in PMC review article PMC12522047)
7. Girardi, M.A. et al. "Laser Ablation of Thin Films on Low Temperature Cofired Ceramic." J. Microelectronics Electronic Packaging (2015) 12:72-79.
8. Palmieri, F. et al. "Controlled Contamination of Epoxy Composites with PDMS and Removal by Laser Ablation." NASA Langley, 2016. (NTRS 20160009092)
9. LPKF laser depaneling FR4 materials. https://laser-depaneling.lpkf.com/en/applications/fr4-materials
10. Semiconductor Industry Association (SIA). "PFAS Release Mapping from Semiconductor Assembly, Test and Packaging Processes." Rev. 0, 2023.
11. IDI Composites. "Epoxy Molding Compound Safety Data Sheet." 2022.
12. Springer. "Femtosecond laser drilling of epoxy composites: a review." https://link.springer.com/article/10.1007/s00170-025-16896-8
13. Springer. "Generation of micro/nano hybrid surface structures on copper by femtosecond laser." https://link.springer.com/article/10.1007/s41871-022-00135-9
14. ScienceDirect. "Low damage regulation process and mechanism of laser selective removal of copper." 2025.
15. US Patent US6399463B1. "Method of singulation using laser cutting." 2002.
16. US Patent US7081209B2. "Solder mask removal method." 2006.
17. DISCO Corporation. Laser Full Cut Dicing. https://www.disco.co.jp/eg/solution/library/laser/laser.html
18. SK Hynix. "Singulation, the Moment When a Wafer is Separated into Multiple Semiconductor Chips." https://news.skhynix.com/
