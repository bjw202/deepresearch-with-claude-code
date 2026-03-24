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