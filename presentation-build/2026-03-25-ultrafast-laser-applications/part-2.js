// === Part 2 시작 ===

function slide13_sic_dicing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'SiC 다이싱: 3가지 USP 공정이 재료 손실 30~40%를 해결한다');

  const headers = ['공정 방식', '레이저', '핵심 성과', '확신도'];
  const dataRows = [
    [
      '6패스 fs 레이어드 스텔스 다이싱',
      '펨토초 ~270 fs',
      '개질층 <8 µm, Ra 224 nm, 종횡비 9.85',
      '★★★'
    ],
    [
      '멀티포컬 ps 슬라이싱 (4-focal)',
      '피코초 1064 nm',
      'Ra 1.3→0.432 µm, 6인치 4H-SiC 분리',
      '★★'
    ],
    [
      '시간형상 펄스열 슬라이싱',
      '펨토초 (복굴절 결정)',
      '개질층 16.5 µm (재료 손실 최소화)',
      '★★'
    ],
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.9, rowH: 0.75 });

  // 하단 출처/임계값 박스
  slide.addShape('rect', { x: 0.6, y: 5.3, w: 12.13, h: 1.55, fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
  slide.addText('출처: MDPI JMMP SiC 리뷰 2025-12-19', {
    x: 0.8, y: 5.37, w: 11.7, h: 0.32,
    fontSize: 10, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.text_secondary
  });
  slide.addText('SiC 어블레이션 임계값: 2.35 J/cm² (개질) | 4.97 J/cm² (변환) | 1035 nm fs 기준', {
    x: 0.8, y: 5.72, w: 11.7, h: 0.32,
    fontSize: 10.5, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });
  slide.addText('재료 손실 30~40% 저감 = 고단가 SiC 웨이퍼 원가 절감의 핵심 레버', {
    x: 0.8, y: 6.07, w: 11.7, h: 0.32,
    fontSize: 10.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_blue
  });

  addPageNumber(slide, 13, TOTAL_SLIDES);
}

function slide14_pcb_via_tsv() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'PCB/TSV 비아홀: UV fs로 직경 <10 µm, 종횡비 10:1 달성');

  const bullets = [
    { label: 'UV 펨토초 레이저(515 nm)', desc: 'MPI 기판 드릴링, HAZ 없음, 탄화 없음' },
    { label: '공정 파라미터', desc: '단일 펄스 에너지 3.4~8 µJ, 펄스 중첩률 96~98%' },
    { label: '피코초 레이저', desc: '2025년 현재 단일층 PCB 직경 <10 µm 홀, 0~2 µm 간격 실현' },
    { label: 'TSV 적용', desc: 'HBM 3D 패키징에서 삼성·SK하이닉스 배포 중 (Mordor 2026)' },
  ];

  const accentColors = [COLORS.accent_blue, COLORS.accent_cyan, COLORS.accent_yellow, COLORS.accent_purple];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: accentColors[i] } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 인사이트 박스
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_dark } });
  slide.addText('피코초 레이저가 나노초 대비 탄화를 완전히 제거 → 고밀도 HDI 기판 가능', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 14, TOTAL_SLIDES);
}

function slide15_display_oled_utg() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '디스플레이: OLED 형상 커팅 + UTG 필라멘테이션 4가지 핵심 성과');

  addCard(slide, {
    x: 0.6, y: 1.9, w: 5.915, h: 2.45,
    title: 'OLED 형상 커팅',
    body: 'UV fs 레이저, HAZ <10 µm, 카메라홀·비직선 형상, 픽셀 수리(인접 손상 없음)',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.9, w: 5.915, h: 2.45,
    title: 'PI/HC/PET 적층 커팅',
    body: 'UV ps 레이저(IceFyre 355-50, 1.25 MHz, ~10 ps, >50 W), 속도 >400 mm/s, HAZ <10 µm (LiM 2021 ★★★)',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'UTG 필라멘테이션',
    body: 'Bessel 빔/TOP Cleave 광학계, 내부 개질→제어 균열, 제로 테이퍼·제로 커프, 거울 표면, 속도 최대 1 m/s (TRUMPF ★★★)',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: '강화유리 주의',
    body: '화학적 강화유리 잔류응력 → 크랙 이탈 위험. 50 µm 미만 박판: 펄스 <1 ps 필요. 공정 윈도우 협소',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 15, TOTAL_SLIDES);
}

function slide16_battery_electrode_patterning() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '배터리 전극 패터닝: kWh당 $1.3~1.5로 4C 충전 성능 2배');

  // 좌 컬럼
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 5.865, h: 4.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.75 } });
  slide.addText('기존 전극 (평면 구조)', {
    x: 0.75, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  const leftPoints = [
    'Li⁺ 이온 확산 거리 길어 → 고속 충전 한계',
    '두꺼운 전극 = 에너지 밀도 ↑ but 충전 속도 ↓',
    '기계적 다이커터: 버(burr)/박리 → 배터리 열화, 쇼트 위험',
  ];
  leftPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 0.8, y: 2.52 + i * 0.9, w: 5.5, h: 0.75,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.35
    });
  });

  // 우 컬럼
  slide.addShape('roundRect', { x: 6.865, y: 1.9, w: 5.865, h: 4.0, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('레이저 패터닝 전극 (마이크로채널)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue
  });
  const rightPoints = [
    'fs 레이저 어블레이션으로 기공·채널 구조 형성',
    'Li⁺ 이동 경로 단축 → NREL: 4C 충전 시 용량 최대 2배, 사이클 수명 향상',
    '경제성: 기존 생산라인 통합 시 비용 증가 ~$1.3~1.5/kWh (~2%)',
    'NREL BatMan 프로젝트: 160 mm 폭 양면 그라파이트 1,200 m+ 롤투롤 처리',
  ];
  rightPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 7.05, y: 2.52 + i * 0.78, w: 5.55, h: 0.68,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 경고 박스
  slide.addShape('roundRect', { x: 0.6, y: 6.05, w: 12.13, h: 0.72, rectRadius: 0.07,
    fill: { color: 'FFF8E7' }, line: { color: COLORS.accent_yellow, width: 1.5 } });
  slide.addText('[양산 검증 필요 ★★] 벤치스케일 결과 — 롤투롤 균일성은 검증 초기 단계', {
    x: 0.8, y: 6.12, w: 11.7, h: 0.55,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_yellow
  });

  addPageNumber(slide, 16, TOTAL_SLIDES);
}

function slide17_battery_cutting_welding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '배터리 전극 커팅 + 모듈 용접: 버 없는 고속 공정 확립');

  const bullets = [
    {
      label: '전극 노칭/슬리팅',
      desc: '120 W fs + 패스트 버스트 모드 (Luxinar LXR® USP) — 버 없는 고속 절삭',
      color: COLORS.accent_blue
    },
    {
      label: '세라믹 전해질 커팅',
      desc: 'LATP/LAGTP 경도·취성 → ps 레이저로 정밀 커팅',
      color: COLORS.accent_cyan
    },
    {
      label: '모듈 용접',
      desc: 'TRUMPF 1 kW USP 레이저 — 배터리 모듈 용접·냉각판 실링·알루미늄 코팅 전처리',
      color: COLORS.accent_yellow
    },
    {
      label: '부식 방지 처리',
      desc: '레이저 표면 활성화로 접착 전처리 대체',
      color: COLORS.accent_purple
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 출처 박스
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_dark } });
  slide.addText('TRUMPF 1kW USP (2024년 8월 출하, Fraunhofer ILT 검증 ★★★)', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 11.5, fontFace: FONTS.body.fontFace, bold: true,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 17, TOTAL_SLIDES);
}

function slide18_lipss_texturing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'LIPSS 표면 텍스처링: 5가지 기능성 표면을 레이저 한 번으로');

  // 행1: 3개 카드
  addCard(slide, {
    x: 0.6, y: 1.9, w: 3.87, h: 2.2,
    title: '초발수(Superhydrophobic)',
    body: '접촉각 >150°, 방오·방빙·방부식. 소재: STS, Al. 조건: fs/ps + 낮은 플루언스',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 4.73, y: 1.9, w: 3.87, h: 2.2,
    title: '저마찰(Tribology)',
    body: '주기적 기둥/홈 패턴. 금형 이형성·베어링 수명. STS 적용',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 8.86, y: 1.9, w: 3.87, h: 2.2,
    title: '항균(Antibacterial)',
    body: 'LIPSS + DLIP 조합. 식품·의료기기 표면. 금속·폴리머',
    accentColor: COLORS.accent_yellow
  });

  // 행2: 2개 카드
  addCard(slide, {
    x: 0.6, y: 4.3, w: 3.87, h: 2.2,
    title: '반사 저감(Anti-reflective)',
    body: 'fs 나노 구조. 광학 코팅 대체 가능. 유리·폴리머',
    accentColor: COLORS.accent_purple
  });

  addCard(slide, {
    x: 4.73, y: 4.3, w: 3.87, h: 2.2,
    title: '대면적 스케일업',
    body: 'Pulsar Photonics 폴리곤 스캐너 + 고출력 USP: 10 m²+ 처리 시스템 구축. 처리 속도 ~0.14 cm²/min (8×8 빔 어레이)',
    accentColor: COLORS.accent_red
  });

  addPageNumber(slide, 18, TOTAL_SLIDES);
}

function slide19_ghz_burst_milling() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'GHz 버스트 모드: Si 어블레이션 속도 23배 향상');

  // KPI 카드 3개
  const kpiCards = [
    { title: 'BiBurst 효과', value: '23× 속도 향상', color: COLORS.accent_blue, x: 0.6 },
    { title: 'MRR (>300 W)', value: '≥40 mm³/min', color: COLORS.accent_cyan, x: 4.73 },
    { title: '버스트 계층', value: '단일→MHz→GHz→BiBurst', color: COLORS.accent_yellow, x: 8.86 },
  ];

  kpiCards.forEach(k => {
    slide.addShape('roundRect', { x: k.x, y: 1.9, w: 3.87, h: 2.1, rectRadius: 0.1,
      fill: { color: COLORS.bg_dark }, line: { color: k.color, width: 2 } });
    slide.addShape('rect', { x: k.x + 0.02, y: 1.9, w: 3.83, h: 0.06,
      fill: { color: k.color } });
    slide.addText(k.title, {
      x: k.x + 0.2, y: 2.02, w: 3.47, h: 0.4,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_tertiary, align: 'center'
    });
    slide.addText(k.value, {
      x: k.x + 0.15, y: 2.52, w: 3.57, h: 1.2,
      fontSize: k.value.length > 12 ? 20 : 28,
      fontFace: FONTS.kpi.fontFace, bold: true,
      color: k.color, align: 'center', valign: 'middle', autoFit: true
    });
  });

  // 하단 비교 테이블
  const bHeaders = ['모드', '구성', '특성'];
  const bRows = [
    ['단일 펄스', '—', '최고 품질 / 낮은 MRR'],
    ['MHz 버스트 (~64.5 MHz)', '복수 펄스, MHz 간격', '품질 유지 + MRR↑'],
    ['GHz 버스트 (~2.5 GHz)', '복수 펄스, GHz 간격', 'MRR 대폭↑ / 일부 품질↓'],
    ['BiBurst (GHz in MHz)', 'GHz 군집 × MHz 반복', '공기이온화 방지 + 고속'],
  ];

  addStyledTable(slide, bHeaders, bRows, { y: 4.2, rowH: 0.42 });

  // 출처/주의
  slide.addShape('rect', { x: 0.6, y: 6.55, w: 12.13, h: 0.62,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('출처: EurekAlert/RIKEN 2023-04  |  주의: 재료 의존성 강함 — Cu, STS에서는 GHz가 단일 대비 MRR 낮을 수 있음', {
    x: 0.8, y: 6.62, w: 11.7, h: 0.45,
    fontSize: 10, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 19, TOTAL_SLIDES);
}

function slide20_ceramic_hard_brittle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '세라믹/경취성 소재: USP로 균열 저항 60% 개선');

  const bullets = [
    {
      label: '사파이어(LED 기판)',
      desc: 'fs 스텔스 다이싱 주류 — 비접촉 고속, 표면 데브리 없음',
      color: COLORS.accent_blue
    },
    {
      label: '석영(Quartz)',
      desc: 'fs 1단계 내부 개질 분리 → 균열 저항 60% 개선 (기계적 다이아몬드 절단 대비)',
      color: COLORS.accent_cyan
    },
    {
      label: '지르코니아(치과 보철)',
      desc: 'ps 텍스처링 → 친수성·생체적합성 향상',
      color: COLORS.accent_yellow
    },
    {
      label: '알루미나',
      desc: 'ps 폴리싱 → 나노입자 재결정화 → 서브마이크론 Ra 달성',
      color: COLORS.accent_purple
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 파라미터 노트
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('가공 파라미터: SiC 어블레이션 임계값 2.35 J/cm²(1035 nm, fs 기준). 결정 방위·도핑·편광 방향에 따라 품질 가변', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 10.5, fontFace: FONTS.body.fontFace,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 20, TOTAL_SLIDES);
}

function slide21_glass_welding() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'USP 유리 용접: 접합 강도가 모재를 초과한다');

  // 좌 컬럼
  slide.addShape('roundRect', { x: 0.6, y: 1.9, w: 5.865, h: 4.1, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.text_tertiary, width: 0.75 } });
  slide.addText('기존 유리 접합', {
    x: 0.75, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.text_primary
  });
  const leftPoints = [
    '접착제: 내열성/화학내성 한계, 두께 증가',
    '패스너/프레임: 설계 제약, 이물질 가능성',
    '유리-금속 직접 접합 불가',
  ];
  leftPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 0.8, y: 2.55 + i * 0.95, w: 5.5, h: 0.82,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.35
    });
  });

  // 우 컬럼
  slide.addShape('roundRect', { x: 6.865, y: 1.9, w: 5.865, h: 4.1, rectRadius: 0.08,
    fill: { color: COLORS.bg_secondary }, line: { color: COLORS.accent_blue, width: 1.5 } });
  slide.addText('USP 레이저 용접 (ps 기반)', {
    x: 7.0, y: 2.0, w: 5.5, h: 0.38,
    fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
    color: COLORS.accent_blue
  });
  const rightPoints = [
    '다광자 흡수로 유리 내부에서만 국소 용융 → 계면 접합',
    '유리-유리 / 유리-세라믹 / 유리-금속(스테인리스, Al) 직접 접합',
    '기계적 파괴 테스트: 모재 파단 (용접부 강도 > 모재)',
    '산업 사례: Spectra-Physics IceFyre® 1064-50 (50 W IR ps) 시연 (★★, MKS AP52)',
  ];
  rightPoints.forEach((p, i) => {
    slide.addText('• ' + p, {
      x: 7.05, y: 2.5 + i * 0.84, w: 5.55, h: 0.72,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });
  });

  // 하단 박스
  slide.addShape('roundRect', { x: 0.6, y: 6.1, w: 12.13, h: 0.72, rectRadius: 0.07,
    fill: { color: COLORS.bg_dark }, line: { color: COLORS.bg_dark, width: 0 } });
  slide.addText('센서 밀봉·의료기기 패키징·전자 케이스에 새로운 설계 자유도 제공. 광접촉(gap ≤ λ/4) 요구가 핵심 공정 과제', {
    x: 0.8, y: 6.17, w: 11.7, h: 0.55,
    fontSize: 11.5, fontFace: FONTS.body.fontFace,
    color: COLORS.accent_cyan
  });

  addPageNumber(slide, 21, TOTAL_SLIDES);
}

function slide22_solar_scribing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '박막 태양전지 P1~P3 스크라이빙: 선폭 ≤25 µm 달성');

  const bullets = [
    {
      label: 'P1 (도전층)',
      desc: 'UV 레이저(355 nm), 펄스폭 <1 ps → 선폭 ≤25 µm',
      color: COLORS.accent_blue
    },
    {
      label: 'P2 (페로브스카이트/수송층)',
      desc: 'UV 레이저 필수 (IR 적용 불가 — 흡수 불충분, 하부 전극 손상)',
      color: COLORS.accent_cyan
    },
    {
      label: 'P3 (후면 전극 분리)',
      desc: 'HAZ 최소화로 인접 셀 광전 활성도 보존 → 모듈 직렬 저항 감소 → PCE 향상',
      color: COLORS.accent_yellow
    },
    {
      label: '반증 사례',
      desc: 'ns 레이저 P1에서 효율 12.5~21% 달성 사례 존재 → USP 대비 비용 분석 필요',
      color: COLORS.accent_red
    },
  ];

  bullets.forEach((b, i) => {
    const yBase = 2.05 + i * 1.05;
    slide.addShape('roundRect', { x: 0.6, y: yBase, w: 12.13, h: 0.9, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }, line: { color: 'E2E8F0', width: 0.5 } });
    slide.addShape('rect', { x: 0.6, y: yBase, w: 0.3, h: 0.9,
      fill: { color: b.color } });
    slide.addText(b.label, {
      x: 1.05, y: yBase + 0.08, w: 11.5, h: 0.33,
      fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary
    });
    slide.addText(b.desc, {
      x: 1.05, y: yBase + 0.46, w: 11.5, h: 0.33,
      fontSize: 11.5, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });
  });

  // 하단 노트
  slide.addShape('rect', { x: 0.6, y: 6.3, w: 12.13, h: 0.55,
    fill: { color: COLORS.bg_secondary } });
  slide.addText('페로브스카이트 조성(할라이드 종류)에 따라 흡수 파장 최적점 달라짐', {
    x: 0.8, y: 6.36, w: 11.7, h: 0.4,
    fontSize: 10.5, fontFace: FONTS.body.fontFace, italic: true,
    color: COLORS.text_secondary
  });

  addPageNumber(slide, 22, TOTAL_SLIDES);
}

function slide23_industry_maturity_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '산업 제조 8대 분야 성숙도 총괄');

  const headers = ['분야', '핵심 어플리케이션', '권장 레이저', '대표 성과', '성숙도'];
  const dataRows = [
    ['반도체', 'Si/SiC 다이싱, PCB 비아홀', 'fs/ps', 'SiC 개질층 <8 µm, 비아홀 <10 µm', '양산'],
    ['디스플레이', 'OLED 커팅, UTG 필라멘테이션', 'UV ps/fs', 'HAZ <10 µm, 속도 1 m/s', '양산'],
    ['배터리/EV', '전극 노칭·패터닝', 'fs (버스트)', '4C 용량 ~2배(벤치)', '양산 진입'],
    ['표면 텍스처링', 'LIPSS, 초발수/항균', 'fs/ps', '10 m²+ 대면적 시스템', '양산'],
    ['금속 마이크로머시닝', '고속 절삭·드릴링', 'ps (버스트)', 'MRR ≥40 mm³/min', '양산'],
    ['세라믹/경취성', '사파이어·석영·지르코니아', 'fs/ps', '균열 저항 60% 개선', '양산'],
    ['유리 용접', '유리-유리/유리-금속', 'ps', '모재 파단 강도', '산업화 초기'],
    ['태양전지', 'P1~P3 스크라이빙', 'UV fs/ps', '선폭 ≤25 µm', '양산 진입'],
  ];

  addStyledTable(slide, headers, dataRows, { y: 1.85, rowH: 0.52 });

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

function slide24_section_d_divider() {
  const slide = pptx.addSlide();

  // 좌 40% 다크
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  // 우 60% 밝은 배경
  slide.addShape('rect', { x: 5.33, y: 0, w: 8.0, h: 7.5, fill: { color: COLORS.bg_primary } });

  // 섹션 넘버
  slide.addText('SECTION D', {
    x: 0.4, y: 2.2, w: 4.5, h: 0.5,
    fontSize: 11, bold: true, color: COLORS.accent_cyan,
    fontFace: FONTS.body.fontFace, align: 'left'
  });

  // 섹션 타이틀
  slide.addText('의료·바이오·과학', {
    x: 0.4, y: 2.8, w: 4.5, h: 0.7,
    fontSize: 26, bold: true, color: COLORS.text_on_dark,
    fontFace: FONTS.subtitle.fontFace, align: 'left'
  });

  // 부제
  slide.addText('USP의 또 다른 전선', {
    x: 0.4, y: 3.6, w: 4.5, h: 0.45,
    fontSize: 15, bold: false, color: COLORS.text_secondary,
    fontFace: FONTS.body.fontFace, align: 'left'
  });

  // 구분선
  slide.addShape('rect', { x: 0.4, y: 4.2, w: 2.5, h: 0.04, fill: { color: COLORS.accent_cyan } });

  // 우측 커버리지
  slide.addText('의료 3대 어플리케이션 임상 확립 + 바이오/기초과학 확장', {
    x: 5.7, y: 2.5, w: 7.1, h: 0.55,
    fontSize: 17, bold: true, color: COLORS.text_primary,
    fontFace: FONTS.subtitle.fontFace, align: 'left'
  });

  const coverageItems = [
    '안과: FS-LASIK · SMILE · FLACS — 임상 표준 확립',
    '피부과: 피코초 타투 제거 · 멜라스마 — ps가 ns 대비 세션 절반',
    '신경외과·치과·옵토포레이션 — 전임상·연구 단계',
    '바이오: PLAL 나노입자 · 2PP 3D 바이오프린팅 · 2광자 현미경',
    '기초과학: 아토초 과학(2023 노벨상) · 광원자시계 · LWFA',
    '산업 채택의 선행 사례로 읽는 의료 성숙 경로',
  ];

  coverageItems.forEach((item, i) => {
    slide.addText('• ' + item, {
      x: 5.7, y: 3.22 + i * 0.52, w: 7.1, h: 0.45,
      fontSize: 12.5, color: COLORS.text_secondary,
      fontFace: FONTS.body.fontFace, align: 'left'
    });
  });
}

// === Part 2 끝 ===
