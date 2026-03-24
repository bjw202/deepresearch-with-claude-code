// ============================================================
// Part B: Slides 31~60
// ============================================================

function slide31_source_flowchart() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 요구사항에서 소스 선택까지의 의사결정 흐름');
  addFlowDiamond(slide, 1.5, 2.0, 1.8, 1.0, '재료?');
  addFlowDiamond(slide, 5.0, 3.5, 1.8, 1.0, '정밀도?');
  addFlowDiamond(slide, 5.0, 5.2, 1.8, 1.0, '고반사?');
  addFlowBox(slide, 4.5, 1.5, 1.8, 0.7, 'CO₂ 레이저', COLORS.accent_blue);
  addFlowBox(slide, 8.5, 3.2, 2.0, 0.7, '초단펄스 (fs/ps)', COLORS.accent_purple);
  addFlowBox(slide, 8.5, 5.0, 2.0, 0.7, '그린/블루 레이저', '00D4AA');
  addFlowBox(slide, 8.5, 6.0, 2.0, 0.7, '파이버 레이저', COLORS.accent_blue);
  addFlowArrow(slide, 3.3, 2.5, 4.5, 1.85);
  addFlowArrow(slide, 3.3, 2.5, 5.0, 4.0);
  addFlowArrow(slide, 6.8, 4.0, 8.5, 3.55);
  addFlowArrow(slide, 5.9, 4.5, 5.9, 5.2);
  addFlowArrow(slide, 6.8, 5.7, 8.5, 5.35);
  addFlowArrow(slide, 5.9, 6.2, 8.5, 6.35);
  slide.addText('비금속', { x: 3.3, y: 1.6, w: 1.2, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('금속', { x: 3.5, y: 3.0, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('μm급', { x: 7.0, y: 3.2, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('일반', { x: 5.1, y: 4.6, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('예', { x: 7.0, y: 5.0, w: 1.0, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  slide.addText('아니오', { x: 5.1, y: 6.0, w: 1.5, h: 0.3, fontSize: 10, fontFace: 'Pretendard', color: COLORS.text_tertiary });
  addPageNumber(slide, 31, TOTAL_SLIDES);
}

function slide32_part2_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Part 2 핵심: 소스 선택은 파장-재료 매칭이 출발점');
  slide.addText([
    { text: '파장이 재료 흡수율을 결정한다 — 소스 선택의 1차 기준', options: { bullet: true, indentLevel: 0 } },
    { text: '빔 품질(M²/BPP)은 광학 불변량 — 소스에서 결정되면 렌즈로 개선 불가', options: { bullet: true, indentLevel: 0 } },
    { text: 'TCO 관점: WPE 차이가 장기 운영비를 지배한다', options: { bullet: true, indentLevel: 0 } },
    { text: '트렌드: 파이버 레이저가 대부분의 금속 가공 시장을 지배 중', options: { bullet: true, indentLevel: 0 } },
  ], { x: 0.6, y: 1.8, w: 12.13, h: 4.5, fontSize: 20, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.8, paraSpaceAfter: 12, valign: 'top' });
  addPageNumber(slide, 32, TOTAL_SLIDES);
}

function slide33_section3() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('03', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('광학계', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('빔의 형태와 전달, 집속의 원리를 이해한다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.4 });
}

function slide34_beam_metrics() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 빔을 기술하는 4가지 핵심 지표');
  addStyledTable(slide, ['지표', '정의', '가공 영향', '좋은 방향'], [
    ['M²', '이상적 가우시안 대비 빔 품질', 'M²×2 → 스폿×2 → 에너지밀도 1/4', '낮을수록'],
    ['BPP (mm·mrad)', 'w₀ × θ, 광학 불변량', '작을수록 같은 광학계로 작은 스폿', '낮을수록'],
    ['빔 프로파일', '단면 에너지 분포 형태', '가우시안:최소스폿, 탑햇:균일', '공정별 상이'],
    ['DOF (초점심도)', '빔 웨이스트 전후 유효 범위', '짧으면 정밀, 길면 후판 유리', '공정별 상이'],
  ]);
  addPageNumber(slide, 34, TOTAL_SLIDES);
}

function slide35_gaussian() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가우시안 빔: 중심이 가장 강하고 가장자리로 감소한다');
  slide.addText([
    { text: '1/e² 정의', options: { bold: true, fontSize: 18 } },
    { text: '\n빔 반지름 = 중심 세기의 13.5% 지점까지의 거리', options: {} },
    { text: '\n이 범위 안에 전체 에너지의 86.5% 포함', options: {} },
    { text: '\n빔 직경 d = 2w (카탈로그 기본 수치)', options: {} },
  ], { x: 0.6, y: 1.8, w: 5.8, h: 3.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addCard(slide, { x: 7.0, y: 1.8, w: 5.7, h: 3.5, title: '절삭가공 비유', body: '드릴 직경 = 유효 가공 범위와 유사.\n\n차이: 레이저는 경계가 부드러움\n→ 가장자리 에너지가 점진적 감소\n→ 불균일 가공의 원인 가능', accentColor: COLORS.accent_cyan });
  addPageNumber(slide, 35, TOTAL_SLIDES);
}

function slide36_waist_rayleigh() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 웨이스트 = 초점, 레일리 길이 = 유효 초점 범위');
  slide.addText('빔 웨이스트 (Beam Waist)', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: 'w₀: 빔 반지름 최소 위치', options: { bullet: true } },
    { text: '피가공물 표면 = 빔 웨이스트에 배치', options: { bullet: true } },
    { text: 'w₀ 작을수록 정밀 가공 가능', options: { bullet: true } },
  ], { x: 0.6, y: 2.3, w: 5.8, h: 2.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  slide.addText('레일리 길이 (Rayleigh Length)', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: 'z_R: 빔 단면적이 2배 되는 거리', options: { bullet: true } },
    { text: 'z_R = π·w₀² / (M²·λ)', options: { bullet: true } },
    { text: 'DOF ≈ 2·z_R', options: { bullet: true } },
    { text: '핵심: w₀↓ → z_R↓ (정밀 vs DOF 트레이드오프)', options: { bullet: true } },
  ], { x: 6.8, y: 2.3, w: 5.9, h: 2.5, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addPageNumber(slide, 36, TOTAL_SLIDES);
}

function slide37_bpp() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'BPP는 광학 불변량 — 렌즈로는 줄일 수 없다');
  slide.addText([
    { text: '발산각 θ: 원거리에서 빔이 퍼지는 각도', options: { bullet: true } },
    { text: 'BPP = w₀ × θ [mm·mrad]', options: { bullet: true } },
    { text: 'BPP = M² × λ / π', options: { bullet: true } },
    { text: 'BPP는 보존량. w₀↓ → θ↑ (역도 성립)', options: { bullet: true } },
    { text: '파이버 커플링: 코어에 입사 가능한 BPP 상한 존재', options: { bullet: true } },
  ], { x: 0.6, y: 1.8, w: 8.0, h: 4.0, fontSize: 18, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.6, valign: 'top' });
  addCard(slide, { x: 9.0, y: 1.8, w: 3.7, h: 4.0, title: '핵심 인사이트', body: '소스 선택에서\nM²/BPP가 결정적인 이유:\n\n아무리 좋은 렌즈를 써도\n소스 자체의 BPP를\n개선할 수 없다.', accentColor: COLORS.accent_red });
  addPageNumber(slide, 37, TOTAL_SLIDES);
}

function slide38_formulas() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '이 3가지 공식만 알면 빔 파라미터를 추론할 수 있다');
  addCard(slide, { x: 0.6, y: 1.8, w: 3.8, h: 4.5, title: '스폿 직경', body: 'd_s = 4·M²·λ·f / (π·D_beam)\n\n파장↓ → 작은 스폿\nM²↓ → 작은 스폿\n빔 직경↑ → 작은 스폿\n초점거리↓ → 작은 스폿', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 1.8, w: 3.8, h: 4.5, title: '초점심도 (DOF)', body: 'DOF = 2π·w₀² / (M²·λ)\n\n작은 스폿 = 얕은 DOF\n(필연적 트레이드오프)\n\n두꺼운 재료 → 긴 FL\n→ 큰 스폿 감수', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 1.8, w: 3.8, h: 4.5, title: 'BPP', body: 'BPP = M²·λ / π\n\n광학 불변량.\n소스 결정, 변경 불가.\n\n파이버: ~0.3~1.5\nCO₂: ~2~6 mm·mrad', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 38, TOTAL_SLIDES);
}

function slide39_beam_profiles() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 프로파일이 가공 품질을 직접 결정한다');
  addStyledTable(slide, ['프로파일', '형태', '에너지 분포', '적합 용도'], [
    ['가우시안', '종 모양', '중심 최대, 가장자리 감소', '정밀 절단, 마킹, 드릴링'],
    ['탑햇 (Top-hat)', '평탄', '균일 분포', '열처리, 균일 용융, 박막'],
    ['링 (Ring/Donut)', '도넛', '중심 저, 가장자리 고', '키홀 용접 안정화'],
    ['멀티모드', '불규칙', '불균일', '저비용 범용 (정밀도↓)'],
  ]);
  slide.addText('최근 트렌드: 링+코어 빔 성형으로 용접 기공률 90% 감소 사례', { x: 0.6, y: 5.8, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_blue, italic: true });
  addPageNumber(slide, 39, TOTAL_SLIDES);
}

function slide40_optical_components() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6가지 광학 부품의 역할과 선택 기준');
  addStyledTable(slide, ['부품', '역할', '핵심 선택 기준'], [
    ['집속 렌즈', '빔을 스폿으로 모음', '재질(파장 적합), FL(스폿 vs DOF)'],
    ['콜리메이터', '발산 빔 → 평행 빔', '콜리/집속 FL 비율 = 배율 레버'],
    ['빔 익스팬더', '빔 직경 확대', '작은 스폿, 손상 방지, 발산↓'],
    ['보호 윈도우', '내부 광학계 보호', '가장 중요한 소모품'],
    ['미러', '빔 방향 변경', '유전체(고LIDT) vs 금속(광대역)'],
    ['아이솔레이터', '역반사 차단', '고반사 재료 가공 시 필수'],
  ]);
  addPageNumber(slide, 40, TOTAL_SLIDES);
}

function slide41_lens_material() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '잘못된 렌즈 재질 = 즉시 손상');
  addStyledTable(slide, ['재질', '투과 파장', '적합 레이저', '주의'], [
    ['Fused Silica', '200nm~3.5μm', '파이버, Nd:YAG, UV', 'CO₂ 사용 금지(흡수→파손)'],
    ['ZnSe (황화아연)', '0.6~20μm', 'CO₂ (10.6μm) 전용', '독성 물질, 취급 주의'],
    ['CaF₂ (불화칼슘)', 'UV~8μm', '엑시머, UV', '고습도에 약함'],
  ]);
  slide.addText('인서트 재질(초경/CBN/다이아)을 재료에 맞춰 선택하는 것과 같은 원리', { x: 0.6, y: 5.0, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 41, TOTAL_SLIDES);
}

function slide42_collimator_expander() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '콜리메이터는 평행화, 빔 익스팬더는 확대');
  slide.addText('콜리메이터: 파이버 출사 → 발산 빔 → 평행 빔. 콜리/집속 FL 비율 = 스폿 크기 레버', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  slide.addText('빔 익스팬더 — "왜 빔을 키우는가?"', { x: 0.6, y: 2.6, w: 12.13, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addCard(slide, { x: 0.6, y: 3.2, w: 3.8, h: 3.2, title: '1. 발산각 감소', body: '빔 키우면 θ↓\n→ 장거리 전달 시\n빔 퍼짐 최소화', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 3.2, w: 3.8, h: 3.2, title: '2. 작은 스폿', body: 'd_s ∝ 1/D_beam\n→ D_beam↑ = d_s↓\n→ 에너지 밀도↑', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 3.2, w: 3.8, h: 3.2, title: '3. 광학 보호', body: '면적↑ → 단위면적 에너지↓\n→ LIDT 안전 마진 확보\n→ 고출력에서 필수', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 42, TOTAL_SLIDES);
}

function slide43_window_isolator() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '보호 윈도우 관리가 가공 안정성의 핵심');
  addCard(slide, { x: 0.6, y: 1.8, w: 5.8, h: 4.8, title: '보호 윈도우', body: '가공 헤드 최하단, 스패터/흄 차단\n\n오염 연쇄: 투과율↓ → 열흡수↑\n→ 열렌즈 강화 → 초점 이동\n→ 가공 드리프트\n\n예방적 교체가 가장 경제적', accentColor: COLORS.accent_red });
  addCard(slide, { x: 6.8, y: 1.8, w: 5.9, h: 4.8, title: '아이솔레이터', body: '고반사 재료(Cu, Al) 가공 시 필수\n\n역반사 빔 → 소스 영구 손상 위험\n(파이버 레이저 특히 취약)\n\n패러데이 아이솔레이터가 일반적\n→ 편광 회전으로 역방향 차단', accentColor: COLORS.accent_purple });
  addPageNumber(slide, 43, TOTAL_SLIDES);
}

function slide44_beam_delivery() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 전달 방식은 파장과 유연성 요구에 따라 결정');
  addStyledTable(slide, ['방식', '적합 레이저', '장점', '단점'], [
    ['광섬유', '파이버, Nd:YAG (1μm대)', '유연, 정렬 불필요, 로봇 장착', 'CO₂ 불가'],
    ['자유공간 (미러)', 'CO₂, 고출력', '고파워 전달', '정렬 민감, 진동 영향'],
    ['관절 암', 'CO₂ (다축 필요)', '다축 자유도', '유지보수, 손실 누적'],
  ]);
  slide.addText('광섬유 전달의 편의성이 파이버 레이저 시장 지배의 핵심 이유', { x: 0.6, y: 5.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_blue, italic: true });
  addPageNumber(slide, 44, TOTAL_SLIDES);
}

function slide45_processing_head() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '가공 헤드 = 공구홀더 + 인서트에 해당');
  slide.addText('구성: 콜리메이터 → (빔 익스팬더) → 집속 렌즈 → 보호 윈도우 → 노즐', { x: 0.6, y: 1.8, w: 12.13, h: 0.5, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addStyledTable(slide, ['헤드 종류', '특성', '핵심 포인트'], [
    ['절단 헤드', '동축 가스 노즐, 얇은 스폿', '가스 압력/노즐 직경 = 품질 결정'],
    ['용접 헤드', '차폐 가스, 넓은 DOF', '초점 위치 제어 = 용입 결정'],
    ['클래딩 헤드', '파우더/와이어 피더 통합', '재료 공급-빔 동기화 필요'],
  ], { y: 2.5 });
  addPageNumber(slide, 45, TOTAL_SLIDES);
}

function slide46_focal_length() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '초점거리는 스폿 크기와 DOF의 트레이드오프');
  addStyledTable(slide, ['재료 두께', '권장 FL', '스폿', 'DOF', '에너지 밀도'], [
    ['< 6mm (박판)', '100~200 mm', '작음', '얕음', '높음'],
    ['6~25 mm', '200~300 mm', '중간', '중간', '중간'],
    ['> 25mm (후판)', '300~450 mm', '넓음', '깊음', '낮음 (보상 필요)'],
  ]);
  slide.addText('짧은 FL = 작은 공구 반경 + 짧은 돌출 = 정밀하지만 접근성 제한', { x: 0.6, y: 5.2, w: 12.13, h: 0.5, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 46, TOTAL_SLIDES);
}

function slide47_why_expand() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 확대 후 집속 = 더 작은 스폿 + 안전한 광학계');
  addCard(slide, { x: 0.6, y: 1.8, w: 3.8, h: 4.5, title: '1. 작은 스폿', body: 'd_s ∝ λ·f / D_beam\n\nD_beam 2배\n→ 스폿 1/2\n→ 에너지밀도 4배', accentColor: COLORS.accent_blue });
  addCard(slide, { x: 4.7, y: 1.8, w: 3.8, h: 4.5, title: '2. 발산 감소', body: 'BPP = w₀ × θ (불변)\n\n빔 키우면 θ↓\n→ 장거리 전달 유리', accentColor: COLORS.accent_cyan });
  addCard(slide, { x: 8.8, y: 1.8, w: 3.8, h: 4.5, title: '3. 광학 보호', body: 'D 2배 → 면적 4배\n→ 단위면적 에너지 1/4\n→ LIDT 여유 확보', accentColor: COLORS.accent_yellow });
  addPageNumber(slide, 47, TOTAL_SLIDES);
}

function slide48_beam_shaping() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '빔 성형으로 가공 품질을 능동적으로 제어한다');
  const pos = [{ x: 0.6, y: 1.8 }, { x: 6.815, y: 1.8 }, { x: 0.6, y: 4.55 }, { x: 6.815, y: 4.55 }];
  const cards = [
    { title: 'DOE (회절 광학 소자)', body: '빔 분할, 패턴 생성.\n멀티빔 병렬 가공 가능.', accentColor: COLORS.accent_blue },
    { title: '빔 호모지나이저', body: '가우시안 → 탑햇 변환.\n균일 열처리에 필수.', accentColor: COLORS.accent_cyan },
    { title: '링+코어 빔', body: '코어: 키홀 유지\n링: 용융풀 안정화.\n기공률 90% 감소 사례.', accentColor: COLORS.accent_yellow },
    { title: '적응 광학', body: '변형 미러 실시간 제어.\n초점 드리프트 보상.\n고비용, 고성능.', accentColor: COLORS.accent_purple },
  ];
  cards.forEach((c, i) => addCard(slide, { ...pos[i], w: 5.915, h: 2.45, ...c }));
  addPageNumber(slide, 48, TOTAL_SLIDES);
}

function slide49_galvo_ftheta() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '갈바노 스캐너: 빔을 수~수십 m/s로 조향한다');
  slide.addText('갈바노 스캐너', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: '2개 미러(X/Y) + 모터로 빔 방향 제어', options: { bullet: true } },
    { text: '관성 극소 → 극고속 위치 변경', options: { bullet: true } },
    { text: '영역: 100×100 ~ 500×500 mm', options: { bullet: true } },
    { text: '마킹, 미세가공, SLM 핵심', options: { bullet: true } },
  ], { x: 0.6, y: 2.3, w: 5.8, h: 3.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  slide.addText('f-theta 렌즈', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 18, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText([
    { text: '미러 각도 θ → 위치 f·θ 선형 변환', options: { bullet: true } },
    { text: '평면 초점 유지 (일반 렌즈는 구면)', options: { bullet: true } },
    { text: 'FL × 스캔 각도 = 작업 범위', options: { bullet: true } },
  ], { x: 6.8, y: 2.3, w: 5.9, h: 3.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.5, valign: 'top' });
  addPageNumber(slide, 49, TOTAL_SLIDES);
}

function slide50_thermal_lensing() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '고출력에서 초점이 움직이는 열렌즈 효과');
  slide.addText('원인: 광학부품 에너지 흡수 → 온도↑ → 굴절률 변화 + 열팽창 → 초점거리 변화', { x: 0.6, y: 1.8, w: 12.13, h: 0.6, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addStyledTable(slide, ['대책', '방법', '효과'], [
    ['1. 예열 루틴', '가동 전 일정 시간 운전', '열 평형에서 시작'],
    ['2. 수냉 광학계', '렌즈/미러에 수냉 채널', '온도 상승 억제'],
    ['3. 저흡수 코팅', 'LIDT 높은 유전체 코팅', '흡수 최소화'],
    ['4. 보호윈도우 교체', '오염 시 주기적 교체', '열렌즈 강화 차단'],
    ['5. 적응 광학', '변형 미러 실시간 보정', '자동 초점 보상'],
  ], { y: 2.6 });
  addPageNumber(slide, 50, TOTAL_SLIDES);
}

function slide51_maintenance() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '예방적 광학 관리 = 가장 경제적인 품질 유지');
  addStyledTable(slide, ['부품', '점검 주기', '교체 기준', '클리닝'], [
    ['보호 윈도우', '매일~매주', '투과율 5%↓, 흐림', '전용 클리너 + 무진 와이프'],
    ['집속 렌즈', '월 1회', '투과율↓, 열렌즈 징후', '전용 클리너'],
    ['파이버 커넥터', '탈착 시마다', '오염/손상 즉시', '현미경 + 클리닝 키트'],
    ['미러 코팅', '분기 1회', '코팅 박리, 반사율↓', '전문 클리닝/교체'],
    ['콜리메이터', '반기 1회', '빔 품질 모니터링', '제조사 지침'],
  ]);
  addPageNumber(slide, 51, TOTAL_SLIDES);
}

function slide52_part3_summary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Part 3 핵심: BPP는 불변, 광학은 트레이드오프의 연속');
  slide.addText([
    { text: 'BPP = 광학 불변량. 소스가 결정, 렌즈로 불가', options: { bullet: true } },
    { text: '스폿↓ ↔ DOF↓ = 필연적 트레이드오프', options: { bullet: true } },
    { text: '보호 윈도우 관리 = 열렌즈 억제 = 가공 안정성 핵심', options: { bullet: true } },
    { text: '빔 성형으로 공정별 최적 프로파일 설계 가능', options: { bullet: true } },
  ], { x: 0.6, y: 1.8, w: 12.13, h: 4.5, fontSize: 20, fontFace: 'Pretendard', color: COLORS.text_secondary, lineSpacingMultiple: 1.8, valign: 'top' });
  addPageNumber(slide, 52, TOTAL_SLIDES);
}

function slide53_section4() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
  slide.addText('04', { x: 1.0, y: 2.5, w: 3.33, h: 1.5, fontSize: 72, fontFace: 'Pretendard', bold: true, color: COLORS.accent_cyan, align: 'center' });
  slide.addText('하드웨어/시스템', { x: 6.0, y: 2.5, w: 6.73, h: 0.8, fontSize: 36, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('레이저 시스템의 전체 구성과 주변 장치를 이해한다', { x: 6.0, y: 3.5, w: 6.73, h: 1.0, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
}

function slide54_system_diagram() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 시스템 = 소스 + 빔 전달 + 가공 헤드 + 모션 + 제어');
  addFlowBox(slide, 0.8, 2.0, 2.0, 0.8, '전원 공급', COLORS.bg_dark);
  addFlowArrow(slide, 2.8, 2.4, 3.3, 2.4);
  addFlowBox(slide, 3.3, 2.0, 2.2, 0.8, '레이저 소스', COLORS.accent_blue);
  addFlowArrow(slide, 5.5, 2.4, 6.0, 2.4);
  addFlowBox(slide, 6.0, 2.0, 2.2, 0.8, '빔 전달 광학계', COLORS.accent_cyan);
  addFlowArrow(slide, 8.2, 2.4, 8.7, 2.4);
  addFlowBox(slide, 8.7, 2.0, 2.0, 0.8, '가공 헤드', COLORS.accent_yellow);
  addFlowArrow(slide, 10.7, 2.4, 11.2, 2.4);
  addFlowBox(slide, 11.2, 2.0, 1.8, 0.8, '피가공물', COLORS.accent_red);
  addFlowBox(slide, 3.3, 3.3, 2.2, 0.7, '냉각기 (Chiller)', '718096');
  addFlowArrow(slide, 4.4, 2.8, 4.4, 3.3);
  addFlowBox(slide, 6.5, 3.3, 2.5, 0.7, '모션 시스템', '718096');
  addFlowBox(slide, 3.0, 4.5, 2.5, 0.7, '제어기 (CNC/PLC)', COLORS.bg_dark);
  addFlowBox(slide, 6.5, 4.5, 2.0, 0.7, '안전 (인터록)', COLORS.accent_red);
  addFlowBox(slide, 9.5, 4.5, 2.0, 0.7, '집진기', '718096');
  slide.addText('절삭 대응: 소스=스핀들, 빔전달=주축→공구홀더, 가공헤드=인서트, 모션=CNC축', { x: 0.6, y: 5.8, w: 12.13, h: 0.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.accent_cyan, italic: true });
  addPageNumber(slide, 54, TOTAL_SLIDES);
}

function slide55_motion() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '모션 시스템: 정밀도/속도/유연성 트레이드오프');
  addStyledTable(slide, ['기준', '갠트리', '갈바노 스캐너', '5축 로봇'], [
    ['정밀도', '±0.02~0.05mm', '±수 μm', '±0.1~0.5mm'],
    ['속도', '~120 m/min', '수~수십 m/s', '중간'],
    ['영역', '수백mm~수m', '100~500mm²', '반경 내 전방향'],
    ['용도', '대면적 평판 절단', '마킹, 미세가공', '복잡 3D'],
    ['구동', '볼스크류/선형모터', '전류→미러 각도', '서보+감속기'],
  ]);
  addPageNumber(slide, 55, TOTAL_SLIDES);
}

function slide56_pso() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'PSO: 코너 감속에서도 균일한 가공 보장');
  addCard(slide, { x: 0.6, y: 1.8, w: 5.8, h: 4.5, title: '문제: 시간 기반 제어', body: '일정 시간 간격 레이저 발사\n\n코너 감속 시:\n이동 거리↓ + 에너지 동일\n→ 단위 길이당 에너지↑\n→ 코너 번인(Burn)\n→ 불균일 가공', accentColor: COLORS.accent_red });
  addCard(slide, { x: 6.8, y: 1.8, w: 5.9, h: 4.5, title: '해결: PSO', body: '위치 기반: x mm마다 레이저 발사\n→ 속도 무관 균일 가공\n\nEtherCAT 실시간 통신\nμs 수준 위치 피드백\n\n비유: mm당 칩 로드 일정 유지', accentColor: COLORS.accent_cyan });
  addPageNumber(slide, 56, TOTAL_SLIDES);
}

function slide57_control() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 제어: 게이팅, 변조, 아날로그의 조합');
  addStyledTable(slide, ['방식', '신호', '기능', '특성'], [
    ['게이팅', '디지털 ON/OFF', '레이저 발사/정지', '가장 기본'],
    ['PWM 변조', '디지털 펄스', '듀티 사이클 출력 조절', '빠른 변경'],
    ['아날로그', '0~10V / 4~20mA', '비례 출력 제어', '연속 조절'],
  ]);
  slide.addText([
    { text: '인터페이스:', options: { bold: true } },
    { text: ' RS232(레거시) | EtherCAT(산업 표준, PSO 적합) | 아날로그(단순 출력)', options: {} },
  ], { x: 0.6, y: 5.0, w: 12.13, h: 0.8, fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_secondary });
  addPageNumber(slide, 57, TOTAL_SLIDES);
}

function slide58_cooling() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '냉각수 관리 실수가 레이저 고장의 주요 원인');
  addStyledTable(slide, ['항목', '파이버 레이저', 'CO₂ 레이저'], [
    ['냉각수', '탈이온수 (DI)', '증류수'],
    ['전도도', '<1~5 μS/cm', '<10 μS/cm'],
    ['교체 주기', '3개월', '3개월'],
    ['배관 세정', '6개월', '6개월'],
    ['온도', '15~25°C', '15~25°C'],
  ]);
  slide.addShape('roundRect', { x: 0.6, y: 5.8, w: 5.8, h: 0.7, rectRadius: 0.06, fill: { color: 'FFF5F5' } });
  slide.addText('수돗물 사용 금지 → 이온 오염 → 전기 단락/부식', { x: 0.8, y: 5.85, w: 5.4, h: 0.6, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_red, valign: 'middle' });
  slide.addShape('roundRect', { x: 6.8, y: 5.8, w: 5.9, h: 0.7, rectRadius: 0.06, fill: { color: 'FFFFF0' } });
  slide.addText('온도 과저 → 결로(Condensation) → 광학계 오염', { x: 7.0, y: 5.85, w: 5.5, h: 0.6, fontSize: 13, fontFace: 'Pretendard', bold: true, color: COLORS.accent_yellow, valign: 'middle' });
  addPageNumber(slide, 58, TOTAL_SLIDES);
}

function slide59_assist_gas() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '어시스트 가스: 용융물 제거 + 산화 제어');
  addStyledTable(slide, ['가스', '적합 재료', '메커니즘', '압력'], [
    ['O₂', '연강, 탄소강', '발열 산화 반응', '3~10 bar'],
    ['N₂', 'SUS, 알루미늄', '비반응, 블로', '15~30 bar'],
    ['압축 공기', '박판 ≤6mm', 'N₂+O₂ 혼합', '3~8 bar'],
    ['Ar', '티타늄, 특수합금', '완전 불활성', '2~5 bar'],
  ]);
  slide.addText('압력은 Linde 기준. 노즐/장비/두께별로 차이 큼', { x: 0.6, y: 5.5, w: 12.13, h: 0.4, fontSize: 13, fontFace: 'Pretendard', color: COLORS.text_tertiary, italic: true });
  addPageNumber(slide, 59, TOTAL_SLIDES);
}

function slide60_fume_safety() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '레이저 흄은 나노입자 — 집진 필수 + 안전 등급');
  slide.addText('집진: 프리필터 → HEPA → 활성탄 3단 구성', { x: 0.6, y: 1.8, w: 5.8, h: 0.4, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  slide.addText('레이저 안전 등급 (IEC 60825)', { x: 6.8, y: 1.8, w: 5.9, h: 0.4, fontSize: 16, fontFace: 'Pretendard', bold: true, color: COLORS.text_primary });
  addStyledTable(slide, ['Class', '위험도', '필요 조치'], [
    ['1', '안전', '없음 (인클로저 내장)'],
    ['2', '저위험', '눈 보호 (가시광)'],
    ['3B', '위험', '보호 고글 필수'],
    ['4', '매우 위험', '인클로저+인터록+고글+교육'],
  ], { x: 6.8, y: 2.3, w: 5.9 });
  slide.addText('산업용 가공 레이저 = 대부분 Class 4', { x: 0.6, y: 6.2, w: 12.13, h: 0.4, fontSize: 14, fontFace: 'Pretendard', color: COLORS.accent_red, italic: true });
  addPageNumber(slide, 60, TOTAL_SLIDES);
}

// === Part B 끝 (슬라이드 31~60) ===
