# 디자인 시스템 레퍼런스

## 색상 시스템 (6:3:1 법칙)

### 기본 팔레트: "Midnight Executive"

```javascript
const COLORS = {
  // 메인 60% - 배경/여백
  bg_primary:   'FFFFFF',  // 흰 배경
  bg_secondary: 'F5F7FA',  // 연한 회색 배경
  bg_dark:      '1A1F36',  // 다크 네이비 (표지/구분)

  // 보조 30% - 본문/구조
  text_primary:   '1A1F36', // 제목 텍스트 (다크 네이비)
  text_secondary: '4A5568', // 본문 텍스트 (차콜 그레이)
  text_tertiary:  '718096', // 캡션/보조 (미디엄 그레이)
  text_on_dark:   'FFFFFF', // 다크 배경 위 텍스트

  // 강조 10% - 포인트/CTA
  accent_blue:    '4A7BF7', // 메인 블루
  accent_cyan:    '00D4AA', // 시안 그린
  accent_yellow:  'FFB020', // 골드 옐로우
  accent_red:     'FF6B6B', // 경고/주의 레드
  accent_purple:  '8B5CF6', // 보조 퍼플
};
```

### 추가 팔레트 옵션

#### "Warm Corporate" (따뜻한 기업 톤)

```javascript
const WARM = {
  bg_dark: '2D1B4E', accent_blue: 'E8725A', accent_cyan: '4ECDC4',
  accent_yellow: 'F9C74F', accent_purple: '7B68EE'
};
```

#### "Nature Green" (친환경/ESG)

```javascript
const GREEN = {
  bg_dark: '1B3A2D', accent_blue: '2D9CDB', accent_cyan: '27AE60',
  accent_yellow: 'F2C94C', accent_red: 'EB5757'
};
```

#### "Minimal Mono" (미니멀)

```javascript
const MONO = {
  bg_dark: '111111', accent_blue: '333333', accent_cyan: '666666',
  accent_yellow: 'AAAAAA', text_primary: '111111'
};
```

### 팔레트 전환 방법

다른 팔레트를 사용하려면 기본 COLORS 객체를 스프레드로 덮어쓴다:

```javascript
// 기본 팔레트
const COLORS = {
  bg_primary: 'FFFFFF', bg_secondary: 'F5F7FA', bg_dark: '1A1F36',
  text_primary: '1A1F36', text_secondary: '4A5568', text_tertiary: '718096',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7', accent_cyan: '00D4AA', accent_yellow: 'FFB020',
  accent_red: 'FF6B6B', accent_purple: '8B5CF6',
};

// Warm Corporate로 전환
const WARM_OVERRIDES = {
  bg_dark: '2D1B4E', accent_blue: 'E8725A', accent_cyan: '4ECDC4',
  accent_yellow: 'F9C74F', accent_purple: '7B68EE'
};
Object.assign(COLORS, WARM_OVERRIDES);
```

나머지 속성(bg_primary, text_primary 등)은 유지되므로 변경할 속성만 덮어쓰면 된다.

---

## 폰트 시스템

### 기본 폰트

| 폰트 | 용도 | 파일명 | Weight |
| --- | --- | --- | --- |
| Pretendard | 고딕 (제목/본문/캡션) | Pretendard-{Weight}.otf | 9종: Thin(100)\~Black(900) |
| 조선일보명조 | 명조 (인용/강조/격식) | ChosunNm.ttf | Regular |

### Pretendard 9종 Weight 가이드

| Weight | 파일명 | 용도 |
| --- | --- | --- |
| Thin (100) | Pretendard-Thin.otf | 장식용 대형 텍스트, 워터마크 |
| ExtraLight (200) | Pretendard-ExtraLight.otf | 부제목(라이트 테마), 배경 텍스트 |
| Light (300) | Pretendard-Light.otf | 긴 본문, 설명 텍스트 |
| Regular (400) | Pretendard-Regular.otf | 기본 본문, 캡션 |
| Medium (500) | Pretendard-Medium.otf | 강조 본문, 라벨 |
| SemiBold (600) | Pretendard-SemiBold.otf | 소제목, 카드 제목 |
| Bold (700) | Pretendard-Bold.otf | 섹션 제목, 헤더 |
| ExtraBold (800) | Pretendard-ExtraBold.otf | 메인 제목, 슬라이드 타이틀 |
| Black (900) | Pretendard-Black.otf | KPI 숫자, 히어로 텍스트 |

### 폰트 적용 규칙

```
제목(Title):      Pretendard ExtraBold/Black    36~44pt
소제목(Subtitle): Pretendard SemiBold/Bold      24~28pt
본문(Body):       Pretendard Regular/Medium      16~20pt
캡션(Caption):    Pretendard Light/Regular       12~14pt
인용구(Quote):    조선일보명조 Regular            18~22pt
숫자강조(KPI):    Pretendard Black               36~72pt
장식텍스트:       Pretendard Thin/ExtraLight     60~120pt
```

### 자간(Letter Spacing) & 줄간격(Line Height)

| 요소 | 자간 | 줄간격 | PptxGenJS 속성 |
| --- | --- | --- | --- |
| 제목 | \-0.5pt \~ 0pt | 1.1배 | `charSpacing: -0.5, lineSpacingMultiple: 1.1` |
| 소제목 | 0pt | 1.2배 | `lineSpacingMultiple: 1.2` |
| 본문 | 0.5pt \~ 1pt | 1.4\~1.5배 | `charSpacing: 0.5, lineSpacingMultiple: 1.4` |
| 캡션 | 0.5pt | 1.3배 | `charSpacing: 0.5, lineSpacingMultiple: 1.3` |

---

## 레이아웃 시스템

### 슬라이드 크기

- **발표용**: 16:9 (기본값, 가로 13.33" x 세로 7.5")
- **인쇄/보고서용**: A4 (가로 11.69" x 세로 8.27")

### 여백 가이드 (16:9 기준)

```
+-------------------------------------+
|  0.6"                         0.6"  |
|  +-------------------------------+  |
|  |  콘텐츠 영역                  |  |  상단: 0.5"
|  |  가로: 12.13" / 세로: 6.5"   |  |
|  |  x=0.6, y=0.5 시작            |  |
|  +-------------------------------+  |
|                                0.5" |  하단: 0.5"
+-------------------------------------+
```

| 영역 | 시작 좌표 | 크기 |
| --- | --- | --- |
| 콘텐츠 좌측 | x=0.6 | \- |
| 콘텐츠 우측 끝 | x+w ≤ 12.73 | w=12.13 |
| 콘텐츠 상단 | y=0.5 | \- |
| 콘텐츠 하단 끝 | y+h ≤ 7.0 | h=6.5 |
| 페이지 번호 | x=12.0, y=7.05 | w=1.0, h=0.3 |

### 6x6 콘텐츠 규칙

- 슬라이드 당 글머리 기호 최대 6개
- 글머리 당 단어 6개 이내 (한글 기준 15\~18자)
- 한 슬라이드에 핵심 메시지 1개
- 텍스트가 많으면 2장으로 분할

---

## 2025-2026 한국형 PPT 디자인 트렌드

### 기능적 미니멀리즘

- 불필요한 장식 요소 배제, 콘텐츠 중심 디자인
- 넓은 여백(White Space) 적극 활용
- 한 슬라이드 = 한 메시지 원칙 강화
- 배경: 순백(#FFFFFF) 또는 연한 회색(#F5F7FA\~#F8FAFC) 기본

### 모듈형 레이아웃

- 카드 기반 그리드 시스템 (2x2, 2x3, 1+2 변형)
- 각 모듈에 독립적 정보 단위 배치
- 모듈 간 일관된 간격(0.3"\~0.4") 유지

### 포인트 컬러 전략

- 6:3:1 법칙: 배경 60% + 텍스트 30% + 강조 10%
- 그라데이션보다 단색(Flat) 선호
- 포인트: 네이비(#1A1F36) + 1\~2가지 악센트 컬러

### 타이포그래피

- Pretendard — 한국 비즈니스 PPT 표준 폰트
- 제목은 ExtraBold\~Black, 본문은 Regular\~Medium
- 자간: 제목 타이트(-0.5pt), 본문 약간 넓게(+0.5pt)
- 명조체(조선일보명조)는 인용구/강조에만 포인트 사용

### 데이터 시각화 강화

- 숫자 중심 KPI 카드 레이아웃 인기
- 복잡한 3D 차트 대신 2D 플랫 차트
- 아이콘 + 숫자 조합의 인포그래픽 스타일

---

## ★ 디자인 가드레일 (절대 규칙)

아래 규칙은 슬라이드 코드 생성 시 **반드시 준수**해야 한다. 위반 시 시각적 품질이 심각하게 저하된다.

### 색상 용도 매핑 (Color Usage Map)

| 색상 | ✅ 허용 용도 | ❌ 금지 용도 |
|------|------------|------------|
| `bg_dark` (1A1F36) | 표지 전체 배경, 섹션 디바이더 좌측 패널, 테이블 헤더 행 | 카드 배경, 일반 도형 fill, 콘텐츠 슬라이드 배경 |
| `bg_primary` (FFFFFF) | 슬라이드 기본 배경, 카드 배경 | — |
| `bg_secondary` (F5F7FA) | 카드 배경(대안), 교대 테이블 행, 인사이트 패널, Quote 배경 | — |
| `accent_*` (blue/cyan/yellow/red/purple) | 타이틀바 악센트 라인(h≤0.06), 카드 상단 바(h≤0.06), KPI 숫자, 차트 색상, 원형 뱃지(w≤0.5), Funnel/Pyramid tier fill | 대면적(w>3 AND h>1) 도형 배경 fill |
| `text_primary` (1A1F36) | 제목, 강조 텍스트 | — |
| `text_secondary` (4A5568) | 본문, 테이블 데이터 셀 | — |
| `text_on_dark` (FFFFFF) | bg_dark 위의 텍스트, accent 색상 fill 위의 텍스트 | 밝은 배경 위 텍스트 |

**핵심 원칙**: 밝은 배경(FFFFFF/F5F7FA) 위에 어두운 텍스트(1A1F36/4A5568)가 기본. 다크 배경은 표지/섹션 좌측패널/테이블 헤더에만 사용.

### ★ 조색 레시피 (Color Recipe) — 요소별 정확한 색상 조합

금지/허용만으로는 부족하다. 아래는 **각 요소에 정확히 어떤 색 조합을 쓰라**는 레시피이다.

**슬라이드 배경**: 항상 `FFFFFF` (흰색). 예외 없음. (표지만 bg_dark 허용)

**섹션 디바이더**:
- 좌측 40%: `fill bg_dark(1A1F36)` + 섹션 번호 `accent_cyan(00D4AA)` + 설명 `text_on_dark(FFFFFF)`
- **우측 60%: 배경 없음(기본 흰색)** + 제목 `text_primary(1A1F36)` + 부제 `text_secondary(4A5568)`
- ❌ 우측을 dark로 채우면 안 됨

**타이틀바**:
- accent 라인: `accent_blue(4A7BF7)`, h=0.06
- 제목: `text_primary(1A1F36)`, 28pt
- 부제: `text_tertiary(718096)`, 14pt

**카드**:
- 배경: `fill FFFFFF` + `line { color: 'E2E8F0', width: 0.5 }`
- 상단 accent 바: `accent_*(각 카드마다 다른 색)`, h=0.06
- 제목: `text_primary(1A1F36)`, 16pt bold
- 본문: `text_secondary(4A5568)`, 13pt

**번호 뱃지 (Process Flow, 공정 단계 등)**:
- 원형/roundRect: `fill accent_blue(4A7BF7)` 또는 다른 accent 색
- 번호 텍스트: `text_on_dark(FFFFFF)`, 14~16pt bold
- ❌ bg_dark로 뱃지를 채우면 검은 사각형으로 보임

**테이블**:
- 헤더 행: `fill bg_dark(1A1F36)` + `color text_on_dark(FFFFFF)`
- 홀수 데이터 행: 배경 없음(흰색) + `color text_secondary(4A5568)`
- 짝수 데이터 행: `fill bg_secondary(F5F7FA)` + `color text_secondary(4A5568)`
- ❌ 데이터 행에 bg_dark 사용 절대 금지

**강조 정보 박스 (인사이트, 핵심 포인트)**:
- 배경: `fill bg_secondary(F5F7FA)` 또는 연한 accent 톤
- 연한 파랑: `EBF0FF` (accent_blue의 연한 버전)
- 연한 초록: `E6FAF5` (accent_cyan의 연한 버전)
- 연한 노랑: `FFF8E6` (accent_yellow의 연한 버전)
- 연한 분홍: `FFF0F0` (경고/위험 표시용)
- 텍스트: `text_primary(1A1F36)` 또는 해당 accent 진한 색

**KPI/통계 강조 숫자**:
- 숫자: `accent_blue(4A7BF7)` 또는 `accent_cyan(00D4AA)`, 48~72pt
- 라벨: `text_primary(1A1F36)`, 18~20pt bold
- 설명: `text_secondary(4A5568)`, 14~16pt

**Funnel/Pyramid tier**:
- 각 tier fill: `CHART_STYLE.colors[i]` (4A7BF7, 00D4AA, FFB020, FF6B6B, 8B5CF6)
- 텍스트: `text_on_dark(FFFFFF)`, autoFit true

**위험/경고 슬라이드 (HF 등)**:
- 슬라이드 배경: `FFFFFF` (흰색!) — 절대 다크 배경 사용 금지
- 경고 배너: `fill FFF0F0` (연한 분홍) + `accent_red(FF6B6B)` 텍스트
- 위험 라벨: `accent_red(FF6B6B)`, bold
- 본문: `text_primary(1A1F36)`

### 부드러운 톤을 위한 연한 accent 색상 팔레트

딱딱한 느낌을 피하기 위해, 정보 박스나 배경 강조에 아래 연한 색상을 활용한다:

```javascript
const LIGHT_ACCENTS = {
  light_blue:   'EBF0FF',  // accent_blue의 연한 버전 (정보/팁)
  light_cyan:   'E6FAF5',  // accent_cyan의 연한 버전 (성공/완료)
  light_yellow: 'FFF8E6',  // accent_yellow의 연한 버전 (주의/참고)
  light_red:    'FFF0F0',  // accent_red의 연한 버전 (위험/경고)
  light_purple: 'F3EEFF',  // accent_purple의 연한 버전 (심화/선택)
};
```

이 연한 색상은 addShape roundRect의 fill로 사용하여 정보 박스, 강조 영역, 교대 배경에 활용한다.

### 레이아웃 절대 규칙

1. **콘텐츠 폭**: 모든 콘텐츠 요소의 w는 **12.13"** 사용 (x=0.6 → 우측 끝 12.73). w < 11.0은 절대 금지 (카드 그리드의 개별 카드 제외)
2. **콘텐츠 시작 y**: addTitleBar 사용 시 **y=1.8**, addTitleBar 없는 슬라이드는 **y=0.5**
3. **하단 한계**: y+h ≤ **7.0** (페이지 번호 영역 확보)
4. **테이블 행 제한**: 최대 **8행**. 초과 시 슬라이드 분할 또는 rowH 축소 (최소 0.3")

### 텍스트 속성 필수 규칙

1. 모든 addText에 `color` 속성 **필수** — 빈 문자열(`''`) 절대 금지
2. 모든 addText에 `fontFace` 속성 **필수** — FONTS 객체의 .fontFace만 사용
3. 본문 fontSize **최소 9pt** — 9 미만 금지 (가독성)
4. 제목 fontSize: 24~28pt / 본문: 14~18pt / 캡션: 11~13pt / KPI: 36~72pt

### 카드 디자인 규칙

```
올바른 카드:                    잘못된 카드:
┌─────────────────┐           ┌─────────────────┐
│■■■■ accent bar ■│ h=0.06    │█████████████████│ ← bg_dark 전체 fill
│                 │           │  흰 텍스트      │
│ 제목 (16pt)     │           │  흰 텍스트      │
│ 본문 (13pt)     │           │  흰 텍스트      │
│ bg: FFFFFF      │           │  bg: 1A1F36     │ ← 검은 덩어리!
└─────────────────┘           └─────────────────┘
```

- 배경: `fill FFFFFF` + `line { color: 'E2E8F0', width: 0.5 }`
- 상단 accent 바: `h: 0.06`, `fill accent_*`
- 제목: `color text_primary`, `fontSize 16`, `bold true`
- 본문: `color text_secondary`, `fontSize 13`

### Funnel / Pyramid / Process Flow 색상 규칙

- 각 tier/step의 fill: `CHART_STYLE.colors` 배열에서 순서대로 사용 (4A7BF7, 00D4AA, FFB020, FF6B6B, 8B5CF6, 38BDF8)
- 텍스트: `color text_on_dark` (FFFFFF) — accent 색상 위의 흰 텍스트
- **bg_dark로 tier를 채우면 안 됨** — 검은 블록으로 보임

### 일러스트/다이어그램 금지 규칙

PptxGenJS의 addShape로 공정 일러스트, 장비 구조도, 물리 현상 시각화 등을 시도하면 **검은 블록 참사**가 발생한다. 도형 조합으로 복잡한 그림을 그리는 것은 절대 금지.

| ❌ 금지 (도형 조합 일러스트) | ✅ 대안 |
|--------------------------|--------|
| 장비 구조도 (챔버, 스핀들 등) | 텍스트로 구성요소 설명 + 표로 사양 정리 |
| 물리 현상 시각화 (이온 충돌, 열전달) | 비유 텍스트 + 핵심 수치 강조 |
| 화학 반응 시뮬레이션 | 반응식을 addText로 크게 표시 |
| 상태 변화도 (고체→액체→기체) | Process Flow 헬퍼로 단계 표현 (텍스트 기반) |
| 단면도, 층 구조 | Layered Stack 헬퍼 또는 표로 정리 |

**원칙**: addShape는 **기하학적 장식**(accent 바, 배경 rect, 원형 뱃지)에만 사용한다. 공정/과학 일러스트는 **텍스트 + 표 + 기존 헬퍼 함수**로 대체한다. 그림이 필요하면 addImage로 외부 이미지를 삽입하라.

### 시각적 다양성 규칙

- **연속 3장 이상 같은 슬라이드 타입 금지** — Content 3장 연속 대신 Content + Table + Cards 교대
- **테이블만 5장 이상 연속 금지** — 중간에 Content, Cards, Process Flow 등으로 변주
- 같은 accent 색상을 3장 연속 사용 금지 — CHART_STYLE.colors를 순환 활용