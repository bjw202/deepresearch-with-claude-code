// === Part 3 시작 ===

function slide25_ophthalmology() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '안과: fs 레이저 3대 수술이 임상 표준으로 확립되었다');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'FS-LASIK',
    body: 'fs로 각막 플랩 생성 → 엑시머로 스트로마 절제. 파라미터: 100 fs~10 ps, 5~50 µJ, 20~200 kHz. 마이크로케라톰 대비 플랩 두께·재현성 우수',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: 'SMILE',
    body: 'fs 레이저 단독, 소절개창 2~4 mm. 42명 RCT(ASCRS 2024): SMILE vs Contoura LASIK 3개월 나안시력 통계적 동등. 각막 전방 스트로마 보존 → 생체역학 안정 ★★★',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'FLACS (백내장)',
    body: '낭원절개 정밀도 우수. CDE 33~70% 감소. 후낭파열 0건(수동 2건). 비용: 시스템 수억원+. 주의: 학습 곡선 초기 후낭파열률 최대 7.5%',
    accentColor: COLORS.accent_yellow
  });

  addPageNumber(slide, 25, TOTAL_SLIDES);
}

function slide26_dermatology() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '피코초가 나노초 대비 타투 제거 세션을 절반으로 줄인다');

  // 좌측 패널
  slide.addShape('roundRect', {
    x: 0.6, y: 1.9, w: 5.9, h: 5.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addText('피코초 레이저 (300~900 ps)', {
    x: 0.8, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_cyan
  });
  const leftItems = [
    '기전: 광음향(photomechanical disruption) — 멜라노솜 미세분쇄',
    '세션 수: 4~8회, 최대 90% 제거',
    '파장: 755/1064 nm (PicoSure, PicoWay)',
    'Fitzpatrick IV~VI형에서도 안전',
    '2024: 2회 후 평균 61% 제거 ★★★'
  ];
  leftItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 0.8, y: 2.52 + i * 0.75, w: 5.5, h: 0.65,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 우측 패널
  slide.addShape('roundRect', {
    x: 6.815, y: 1.9, w: 5.915, h: 5.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
  });
  slide.addText('Q-스위치 나노초 (5~20 ns)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_secondary
  });
  const rightItems = [
    '기전: 광열 효과(photothermal)',
    '세션 수: 8~12회, 50~75% 제거',
    '파장: 1064/532 nm',
    'Fitzpatrick V~VI형 색소 위험 ↑',
    '반증: 황색·형광 색상에서 ps/ns 차이 미미 ★★'
  ];
  rightItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 7.0, y: 2.52 + i * 0.75, w: 5.5, h: 0.65,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 하단 메모
  slide.addText('멜라스마: ps Nd:YAG 1064 nm MASI 개선 35.9% vs ps alex 755 nm 25.5%. 병합요법(ps+트라넥삼산) 1,182명 메타분석 최고 효능 ★★★', {
    x: 0.6, y: 7.0, w: 12.13, h: 0.3,
    fontSize: 10, fontFace: FONTS.body.fontFace,
    color: COLORS.text_tertiary
  });

  addPageNumber(slide, 26, TOTAL_SLIDES);
}

function slide27_neuro_dental() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전임상/연구: 뇌전증 87% 발작 감소, 단일세포 유전자 전달');

  const bullets = [
    '신경외과 — 뇌전증: Cornell 2024, fs 레이저 피질절개 ~20 µm. 발작 87% 감소, 전파 95% 차단. ⚠️ 마우스 모델 ★ — 인간 전환 불확실',
    '치과: 에나멜·상아질 절제 정밀도 확인. 치명적 장벽: AR(절제율)이 임상 요구치에 미달 — 현재 연구 단계',
    '옵토포레이션: 단일세포 선택적 기공 형성 → 유전자/단백질 전달. MCF-7 단일세포 형질전환 실증. CRISPR 전달 벡터 대체 연구',
    'LIBS: 레이저 플라스마 발광 스펙트럼 → 수술 중 암 조직 vs 정상 조직 실시간 구분 연구 중'
  ];

  const accentColors = [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple];

  bullets.forEach((text, i) => {
    const yBase = 2.05 + i * 1.1;
    slide.addShape('roundRect', {
      x: 0.6, y: yBase, w: 12.13, h: 0.95, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 }
    });
    slide.addShape('rect', {
      x: 0.6, y: yBase, w: 0.3, h: 0.95,
      fill: { color: accentColors[i] }
    });
    slide.addText(text, {
      x: 1.05, y: yBase + 0.1, w: 11.5, h: 0.75,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

function slide28_bio_nano() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '바이오: PLAL 나노입자부터 2PP 나노 3D 프린팅까지');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'PLAL 나노입자',
    body: 'fs레이저+액체→플라스마→나노입자. Fe-Au: MRI+CT+NIR 광열 in vitro 100% 암세포 사멸. TiN ~30 nm: 640~700 nm 광열치료 ★★★',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: '2광자 중합 (2PP)',
    body: 'fs 고피크강도 → 초점에서만 2광자 흡수. 해상도 ~100 nm (회절한계 이하). 3D 바이오스캐폴드, 신경세포 가이드, pH 반응형 마이크로그리퍼',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: '2광자 현미경',
    body: 'NIR fs → 심부 조직 이미징. FACED: 400 Hz 전압 이미징, 투과 >800 µm 피질. miniBB2p 헤드피스 2.6 g (Nature Commun. 2025)',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: 'LWFA 방사선치료',
    body: '레이저 웨이크필드 가속 100 GV/m. FLASH 방사선치료 전임상 진입(INRS 2023). VHEE >100 MeV, 정상조직 선량 20~70% 감소(시뮬레이션). ★★ 5~10년 상용화',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

function slide29_science_timeline() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '기초과학: 아토초 → 주파수 빗 → 초고속 분광 → 산업 연결');

  const boxes = [
    {
      x: 0.6, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_blue,
      title: '아토초 과학',
      content: 'HHG로 250 as 펄스 생성\n2023 노벨 물리학상\n전자 동역학 실시간 관측\nXUV→반도체 메트롤로지'
    },
    {
      x: 3.9, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_cyan,
      title: '주파수 빗',
      content: '모드잠금 레이저\n다중 종모드 위상 동기\n광학 원자시계 18자리\nGPS보다 수십억 배 정확'
    },
    {
      x: 7.2, y: 2.2, w: 2.7, h: 3.8,
      fill: COLORS.accent_yellow,
      title: '초고속 분광',
      content: '펌프-프로브 fs 분해\n화학반응 중간체 관측\n단백질 구조변화 관측\nCARS 현미경'
    },
    {
      x: 10.5, y: 2.2, w: 2.23, h: 3.8,
      fill: COLORS.accent_purple,
      title: '산업 연결',
      content: 'HHG 기반 XUV\n→ 반도체 EUV\n마스크 검사 개시\n기초→산업 가속 중'
    }
  ];

  boxes.forEach((box) => {
    slide.addShape('roundRect', {
      x: box.x, y: box.y, w: box.w, h: box.h, rectRadius: 0.1,
      fill: { color: box.fill }, line: { color: box.fill, width: 0.5 }
    });
    slide.addText(box.title, {
      x: box.x + 0.1, y: box.y + 0.15, w: box.w - 0.2, h: 0.45,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_on_dark, align: 'center'
    });
    slide.addText(box.content, {
      x: box.x + 0.1, y: box.y + 0.7, w: box.w - 0.2, h: 3.0,
      fontSize: 10.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_on_dark, lineSpacingMultiple: 1.5
    });
  });

  // 화살표
  slide.addText('→', {
    x: 3.4, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue, align: 'center'
  });
  slide.addText('→', {
    x: 6.7, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan, align: 'center'
  });
  slide.addText('→', {
    x: 10.0, y: 3.7, w: 0.4, h: 0.5,
    fontSize: 24, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_yellow, align: 'center'
  });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

function slide30_medical_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '의료/바이오/과학 성숙도 총괄');

  const headers = ['분야', '어플리케이션', '레이저', '성숙도'];
  const dataRows = [
    ['안과', 'FS-LASIK, SMILE, FLACS', 'fs', '임상 확립'],
    ['피부과', '타투 제거, 멜라스마', 'ps (755/1064 nm)', '임상 확립'],
    ['치과', '경조직 절제', 'fs', '연구 단계 (속도 미달)'],
    ['신경외과', '뇌전증 피질절개', 'fs', '전임상 ★ (마우스)'],
    ['세포 조작', '옵토포레이션', 'fs', '연구'],
    ['나노입자(PLAL)', 'Au/Fe-Au/TiN 합성', 'fs', '연구→상용화'],
    ['2PP', '3D 바이오스캐폴드', 'fs', '연구→상용화'],
    ['2광자 현미경', 'in vivo 뇌 이미징', 'fs', '연구 표준'],
    ['아토초/HHG', '전자 동역학, XUV 광원', 'fs', '연구 인프라'],
    ['LWFA', 'FLASH 방사선치료 전임상', 'fs (TW~PW)', '전임상']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.38 });

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

function slide31_section_e() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 좌측 텍스트
  slide.addText('Part E', {
    x: 0.3, y: 2.2, w: 4.7, h: 0.9,
    fontSize: 42, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark
  });
  slide.addText('펨토초 vs 피코초\n무엇을 선택할 것인가', {
    x: 0.3, y: 3.2, w: 4.7, h: 1.2,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.4
  });

  // 우측 텍스트
  slide.addText("핵심 메시지: 'fs가 항상 ps보다 우월하다'는 통념은 틀렸다", {
    x: 5.63, y: 2.6, w: 7.0, h: 0.7,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  slide.addText('재료·요구사항이 선택을 결정한다', {
    x: 5.63, y: 3.4, w: 7.0, h: 0.5,
    fontSize: 13, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });
}

function slide32_fs_ps_comparison() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'fs vs ps 물리적 차이 — 실측 데이터 기반');

  const headers = ['지표', '펨토초 (fs)', '피코초 (ps)', '출처/비고'];
  const dataRows = [
    ['대표 펄스폭', '50~500 fs', '1~100 ps', '—'],
    ['HAZ (Al, 실측)', '≤1.5 µm', '2~5 µm', 'MDPI Micromachines 2014 ★★★'],
    ['Ra (금속)', '0.02~0.1 µm', '0.1~0.5 µm', '복수 학술 출처'],
    ['처리 속도', '기준', '15~30% 빠름', '⚠️ [제조사 주장: opmtlaser.com]'],
    ['MRR (금속, >300 W)', '낮음~중간', '0.1~1 mm³/min/W', '고부피 제거 ps 우위'],
    ['초기 투자비', '매우 높음', '높음 (fs 대비 저렴)', '—']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9 });

  slide.addText('금속 10~50 ps 경계: fs와 ps 품질 차이 미미 → ps가 비용 합리적', {
    x: 0.6, y: 6.35, w: 12.13, h: 0.45,
    fontSize: 12, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue
  });

  addPageNumber(slide, 32, TOTAL_SLIDES);
}

function slide33_decision_flow() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '재료별 경계 조건 의사결정 플로우');

  // 시작 박스
  slide.addShape('roundRect', {
    x: 0.6, y: 2.0, w: 2.5, h: 0.6, rectRadius: 0.08,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0.5 }
  });
  slide.addText('가공 재료는?', {
    x: 0.6, y: 2.0, w: 2.5, h: 0.6,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark, align: 'center', valign: 'middle'
  });

  // 화살표
  slide.addText('↓', {
    x: 0.6, y: 2.65, w: 2.5, h: 0.35,
    fontSize: 18, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.text_secondary, align: 'center'
  });

  // 4개 분기 박스
  const branches = [
    {
      x: 0.3, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '금속\n(Fe/Al/Cu/Ti)',
      content: '10 ps 이하 → fs/ps 품질 유사\n공차 ±0.005 mm / Ra<0.1 µm → fs\n그 외 → ps (비용 효율)'
    },
    {
      x: 3.4, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '투명 유전체\n(유리/사파이어)',
      content: '양산 처리량 우선 → ps (Bessel+필라멘테이션)\nOLED 유리 ps 표준\n특수 박막 → fs'
    },
    {
      x: 6.5, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '생체조직',
      content: '항상 fs 필수\n안과·신경외과\n조직 정밀도 요구'
    },
    {
      x: 9.6, y: 3.1, w: 2.8, h: 2.8,
      fill: COLORS.bg_secondary,
      title: '반도체/\n복합소재',
      content: '서브-10 µm / HAZ<1 µm → fs\n양산 다이싱 → ps\nCFRP 열응력 → fs'
    }
  ];

  branches.forEach((branch) => {
    slide.addShape('roundRect', {
      x: branch.x, y: branch.y, w: branch.w, h: branch.h, rectRadius: 0.08,
      fill: { color: branch.fill }, line: { color: 'E2E8F0', width: 0.75 }
    });
    slide.addText(branch.title, {
      x: branch.x + 0.1, y: branch.y + 0.12, w: branch.w - 0.2, h: 0.7,
      fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary, lineSpacingMultiple: 1.3
    });
    slide.addText(branch.content, {
      x: branch.x + 0.1, y: branch.y + 0.9, w: branch.w - 0.2, h: 1.75,
      fontSize: 10, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.4
    });
  });

  addPageNumber(slide, 33, TOTAL_SLIDES);
}

function slide34_application_matrix() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '어플리케이션별 fs/ps 선택 매트릭스');

  const headers = ['어플리케이션', '권장', '이유', '확신도'];
  const dataRows = [
    ['의료기기 (스텐트·카테터)', 'fs', 'HAZ <1 µm, 생체적합성 유지 필수', '★★★'],
    ['MEMS/반도체 서브-10 µm', 'fs', '크랙·리캐스트층 최소화', '★★★'],
    ['안과 수술 (LASIK·백내장)', 'fs', '조직 정밀 절제', '★★★'],
    ['항공우주 CFRP', 'fs', '열 응력 임계', '★★'],
    ['EV 배터리 전극 구조화', 'fs (고반복률)', '롤투롤, 열 제어 필수', '★★'],
    ['2광자 중합(2PP)', 'fs', '비선형 흡수 필수', '★★★'],
    ['PCD 공구 제작 (자동차)', 'ps', '처리속도+비용 효율 [제조사 주장]', '★★★'],
    ['OLED/FPD 디스플레이 유리', 'ps', 'fs 불필요, 비용 우위, 생산라인 적합', '★★★'],
    ['유리/사파이어 절단 (양산)', 'ps', '50~100 ps 유리도 냉간 절제 달성', '★★★'],
    ['반도체 다이싱 (양산)', 'ps', '높은 처리량, 자동화', '★★'],
    ['텍스처링·마킹 (금속)', 'ps', '속도·비용 균형', '★★★'],
    ['고정밀 금형 마이크로 피처', 'fs', 'Ra <0.1 µm 요구', '★★'],
    ['연구/시간분해 분광/양자', 'fs', '시간 분해능 핵심', '★★★']
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.33 });

  addPageNumber(slide, 34, TOTAL_SLIDES);
}

function slide35_oled_case() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'OLED 유리 절단: ps가 fs를 이긴다 — 칩핑 5 µm, 조도 0.343 µm');

  // KPI 카드 3개
  addCard(slide, {
    x: 0.6, y: 1.9, w: 3.8, h: 1.4,
    title: 'ps 칩핑',
    body: '~5 µm',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 4.77, y: 1.9, w: 3.8, h: 1.4,
    title: 'ps 조도',
    body: 'Ra 0.343 µm',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 8.93, y: 1.9, w: 3.8, h: 1.4,
    title: '처리량',
    body: 'ps 우위',
    accentColor: COLORS.accent_yellow
  });

  // 비교 테이블
  const headers = ['요소', '피코초', '펨토초'];
  const dataRows = [
    ['칩핑', '~5 µm', '거의 없음'],
    ['표면 조도', '0.343 µm (Bessel+CO₂)', '서브마이크론'],
    ['두께 적용성', '0.1~6+ mm 검증', '주로 박막 전문'],
    ['처리량', '높음 (50 kHz, 70 W)', '낮음 (R&D 중심)'],
    ['생산라인 적합성', '우수', '제한적']
  ];

  addStyledTable(slide, headers, dataRows, { y: 3.5, w: 12.13 });

  slide.addText('결론: ps의 \'적합 스펙\'이 OLED 양산 표준 — 초과 스펙(fs) 불필요', {
    x: 0.6, y: 6.65, w: 12.13, h: 0.45,
    fontSize: 12, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 35, TOTAL_SLIDES);
}

function slide36_section_f() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark }
  });

  // 좌측 텍스트
  slide.addText('Part F', {
    x: 0.3, y: 2.2, w: 4.7, h: 0.9,
    fontSize: 42, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_on_dark
  });
  slide.addText('시장과 기술은\n어디로 가고 있는가', {
    x: 0.3, y: 3.2, w: 4.7, h: 1.2,
    fontSize: 18, fontFace: FONTS.body.fontFace,
    color: COLORS.text_on_dark, lineSpacingMultiple: 1.4
  });

  // 우측 텍스트
  slide.addText('시장 규모 + 성장 드라이버 + 최신 기술 + 신흥 어플리케이션', {
    x: 5.63, y: 2.8, w: 7.0, h: 0.9,
    fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary, lineSpacingMultiple: 1.4
  });
}

// === Part 3 끝 ===
