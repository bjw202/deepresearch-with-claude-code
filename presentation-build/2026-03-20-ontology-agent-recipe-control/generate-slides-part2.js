module.exports = function(pptx, COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE, helpers) {
  const TOTAL = 57;

  // ============================================================
  // 슬라이드 29: Content — AI의 수치 추론은 구조적으로 취약하다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'AI의 수치 추론은 구조적으로 취약하다');

    const bullets = [
      { text: 'ACL 2025: 수학 문제의 숫자만 바꿔도 정확도가 급감한다', options: { bullet: true, indentLevel: 0 } },
      { text: '   Llama-3-8B 기준, 어려운 변형에서 69%가 계산 오류, 31%가 추론 오류', options: { bullet: false, indentLevel: 1 } },
      { text: 'arXiv:2509.06332: 소수 판별, 24 게임 등 기초 수학에서도 불안정', options: { bullet: true, indentLevel: 0 } },
      { text: '   큰 수에서 체계적으로 실패하며, 이 불안정성이 복잡한 문제에서 증폭된다', options: { bullet: false, indentLevel: 1 } },
      { text: 'FILLIS: 제조 현장 맥락에서도 수학 연산 한계를 확인', options: { bullet: true, indentLevel: 0 } },
      { text: '   LLM이 기계 작동 설명에는 강하나, 수치 계산에는 외부 도구가 필수', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });
    helpers.addPageNumber(slide, 29, TOTAL);
  })();

  // ============================================================
  // 슬라이드 30: Content — 수치는 전통 기술이, 판단은 AI가 맡는다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '그래서 수치는 전통 기술이, 판단은 AI가 맡는다');

    // 3단계 카드
    var stepW = 3.5;
    var stepH = 2.8;
    var startY = 1.9;
    var arrowW = 0.7;

    helpers.addCard(slide, {
      x: 0.6, y: startY, w: stepW, h: stepH,
      title: 'LLM이 판단한다',
      body: '"어떤 파라미터를 조정할지"\n결정한다.\n\nKG 질의, 유사 사례 탐색,\n원인 가설 생성을 수행',
      accentColor: COLORS.accent_blue
    });

    slide.addText('\u2192', {
      x: 0.6 + stepW, y: startY + 1.0, w: arrowW, h: 0.8,
      fontSize: 36, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center', valign: 'middle'
    });

    helpers.addCard(slide, {
      x: 0.6 + stepW + arrowW, y: startY, w: stepW, h: stepH,
      title: '전통 ML이 계산한다',
      body: '"얼마나 조정할지"\n수치를 산출한다.\n\n물리 모델, R2R 보정,\n베이지안 최적화를 활용',
      accentColor: COLORS.accent_cyan
    });

    slide.addText('\u2192', {
      x: 0.6 + (stepW + arrowW) * 2 - arrowW, y: startY + 1.0, w: arrowW, h: 0.8,
      fontSize: 36, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center', valign: 'middle'
    });

    helpers.addCard(slide, {
      x: 0.6 + (stepW + arrowW) * 2, y: startY, w: stepW, h: stepH,
      title: '온톨로지가 검증한다',
      body: '"안전 범위 내인지"\n확인한다.\n\n파라미터 허용 범위 검증,\n추론 경로 감사 추적',
      accentColor: COLORS.accent_yellow
    });

    // 하단 요약 바
    slide.addShape('roundRect', {
      x: 0.6, y: 5.5, w: 12.13, h: 0.6, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });
    slide.addText('각 계층이 자기 강점에 집중하는 3계층 하이브리드 구조', {
      x: 0.8, y: 5.5, w: 11.73, h: 0.6,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.accent_blue, align: 'center', valign: 'middle'
    });

    helpers.addPageNumber(slide, 30, TOTAL);
  })();

  // ============================================================
  // 슬라이드 31: Content — Bosch 용접 품질 관리 사례
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '실제 사례: Bosch의 용접 품질 관리');

    const bullets = [
      { text: '95개 클래스로 구성된 온톨로지로 용접 품질 지식을 구조화', options: { bullet: true, indentLevel: 0 } },
      { text: '431만 건의 용접 기록 데이터를 지식그래프에 연결', options: { bullet: true, indentLevel: 0 } },
      { text: '지식그래프 임베딩(Knowledge Graph Embedding)으로 ML 파이프라인과 통합', options: { bullet: true, indentLevel: 0 } },
      { text: '결함-원인-파라미터 관계를 명시적으로 추적 가능', options: { bullet: true, indentLevel: 0 } },
      { text: '출처: arXiv, ISWC 2022 (국제 시맨틱 웹 컨퍼런스)', options: { bullet: true, indentLevel: 0 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 31, TOTAL);
  })();

  // ============================================================
  // 슬라이드 32: Content — Bosch 설비 유지보수 챗봇
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '실제 사례: Bosch의 설비 유지보수 챗봇');

    const bullets = [
      { text: 'MMO(Manufacturing Maintenance Ontology) 기반의 지식 구조', options: { bullet: true, indentLevel: 0 } },
      { text: '규칙 기반 + 소형 AI + 대형 AI를 단계적으로 결합', options: { bullet: true, indentLevel: 0 } },
      { text: '   단순 질의는 규칙으로, 복잡한 추론은 LLM으로 처리하는 하이브리드 구조', options: { bullet: false, indentLevel: 1 } },
      { text: '핵심 교훈: "고품질 지식 구축에는 전문가 참여가 필수"', options: { bullet: true, indentLevel: 0 } },
      { text: '   LLM이 지식 추출을 도울 수 있지만, 검증은 도메인 전문가의 몫', options: { bullet: false, indentLevel: 1 } },
      { text: '출처: CEUR-WS 2025', options: { bullet: true, indentLevel: 0 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });
    helpers.addPageNumber(slide, 32, TOTAL);
  })();

  // ============================================================
  // 슬라이드 33: Content — 작은 AI + 지식그래프가 거대 AI를 이길 수 있다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '작은 AI + 지식그래프가 거대 AI를 이길 수 있다');

    const bullets = [
      { text: 'ARKNESS: 3B 파라미터 Llama-3 + 지식그래프 조합', options: { bullet: true, indentLevel: 0 } },
      { text: '   GPT-4o 수준의 정확도를 CNC 가공 공정 계획에서 달성', options: { bullet: false, indentLevel: 1 } },
      { text: '수치 환각(Numerical Hallucination)을 22%p 감소시킴', options: { bullet: true, indentLevel: 0 } },
      { text: '   지식그래프가 수치의 근거를 명시적으로 제공하기 때문', options: { bullet: false, indentLevel: 1 } },
      { text: '완전한 온프레미스 운영이 가능하다', options: { bullet: true, indentLevel: 0 } },
      { text: '   공정 노하우(영업비밀)를 외부에 보내지 않아도 된다', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.0,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });

    // 출처 바
    slide.addShape('roundRect', {
      x: 0.6, y: 6.0, w: 12.13, h: 0.5, rectRadius: 0.08,
      fill: { color: COLORS.bg_secondary }
    });
    slide.addText('출처: arXiv:2506.13026 (ARKNESS, 2025)', {
      x: 0.8, y: 6.0, w: 11.73, h: 0.5,
      fontSize: 13, fontFace: FONTS.caption.fontFace,
      color: COLORS.text_tertiary, align: 'left', valign: 'middle'
    });

    helpers.addPageNumber(slide, 33, TOTAL);
  })();

  // ============================================================
  // 슬라이드 34: Table — 기술별 검증 수준 정리
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '기술별 검증 수준 정리');

    var headers = ['기술', '확신도', '근거', '비고'];
    var dataRows = [
      [
        { text: '지식그래프 기반 불량 추적', options: { bold: true } },
        { text: '높음', options: { color: '27AE60', bold: true } },
        'FMEA 그래프 학습이 RAG 대비 F1 2배 향상',
        '자동차 센서 도메인 검증'
      ],
      [
        { text: '폐쇄 루프 AI (연속 공정)', options: { bold: true } },
        { text: '높음', options: { color: '27AE60', bold: true } },
        'Imubit이 정유/화학에서 상용 운영 중',
        'DCS 직접 제어 수준'
      ],
      [
        { text: 'AI 기반 온톨로지 자동 구축', options: {} },
        { text: '중간', options: { color: COLORS.accent_yellow, bold: true } },
        'ARKNESS zero-shot KG 구축 가능성 제시',
        '산업 규모 검증 부족'
      ],
      [
        { text: '멀티에이전트 제조 시스템', options: {} },
        { text: '중간', options: { color: COLORS.accent_yellow, bold: true } },
        'Bosch 현장 배포, 학술 연구 진행',
        '레시피 자동 조정까지는 미도달'
      ],
      [
        { text: '소형 LLM + KG 조합', options: {} },
        { text: '중간', options: { color: COLORS.accent_yellow, bold: true } },
        '3B 모델이 GPT-4o 수준 달성',
        '현장 배포 사례 미확인'
      ],
      [
        { text: '이산 제조 폐쇄 루프', options: {} },
        { text: '낮음', options: { color: COLORS.accent_red, bold: true } },
        '연속 공정 대비 사례 부족',
        '초기 연구 단계'
      ]
    ];

    helpers.addStyledTable(slide, headers, dataRows, {
      y: 1.8,
      colW: [3.5, 1.3, 4.83, 2.5]
    });
    helpers.addPageNumber(slide, 34, TOTAL);
  })();

  // ============================================================
  // 슬라이드 35: Section — 05. 모든 공장에 필요한 것은 아니다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
    slide.addText('05', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: COLORS.accent_cyan, align: 'center'
    });
    slide.addText('모든 공장에\n필요한 것은 아니다', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 36, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary,
      lineSpacingMultiple: 1.1
    });
    slide.addText('도메인별 적합도와 현실적 시작점을 점검한다', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });
    helpers.addPageNumber(slide, 35, TOTAL);
  })();

  // ============================================================
  // 슬라이드 36: Table — 7개 산업별 적용 가능성 비교
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '7개 산업별 적용 가능성 비교');

    var headers = ['도메인', '적용 가능성', '핵심 이유'];
    var dataRows = [
      [
        { text: '반도체', options: { bold: true } },
        { text: '높음', options: { color: '27AE60', bold: true } },
        '데이터 풍부, 변동성 큼, 기존 APC 위에 추가 용이'
      ],
      [
        { text: '디스플레이', options: { bold: true } },
        { text: '높음', options: { color: '27AE60', bold: true } },
        '반도체와 유사. 대면적 갈수록 균일성 제어 난도 증가'
      ],
      [
        '자동차 부품',
        { text: '중간', options: { color: COLORS.accent_yellow, bold: true } },
        '공정은 단순하나 IATF 16949 인증이 자동 변경을 제한'
      ],
      [
        '화학/정유',
        { text: '중~높음', options: { color: COLORS.accent_yellow, bold: true } },
        '연속 공정, MPC 기반. Imubit 등이 폐쇄 루프 상용화'
      ],
      [
        '제약',
        { text: '낮~중', options: { color: COLORS.accent_red, bold: true } },
        'FDA 21 CFR Part 11이 레시피 자동 변경에 매우 엄격'
      ],
      [
        '식품',
        { text: '낮음', options: { color: COLORS.accent_red, bold: true } },
        '비교적 단순한 공정. HACCP이 자동 변경에 제한적'
      ],
      [
        '표면처리',
        { text: '중간', options: { color: COLORS.accent_yellow, bold: true } },
        '변수 간 상호작용 복잡하나, 소규모 사업장 데이터 부족'
      ]
    ];

    helpers.addStyledTable(slide, headers, dataRows, {
      y: 1.8,
      colW: [2.5, 1.8, 7.83]
    });
    helpers.addPageNumber(slide, 36, TOTAL);
  })();

  // ============================================================
  // 슬라이드 37: Content — 가장 유효한 시작점
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '가장 유효한 시작점: 반도체/디스플레이 증착/식각 공정');

    const bullets = [
      { text: '수십 개 파라미터의 비선형 상호작용이 존재한다', options: { bullet: true, indentLevel: 0 } },
      { text: '비예측적 드리프트가 실재한다 (부산물 축적, 장비 노화)', options: { bullet: true, indentLevel: 0 } },
      { text: '풍부한 센서 데이터와 기존 APC 인프라가 이미 갖춰져 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '불량 비용이 높아 ROI 입증이 상대적으로 쉽다', options: { bullet: true, indentLevel: 0 } },
      { text: 'Tignis가 ML 기반 폐쇄 루프를 이미 상용 운영 중이다', options: { bullet: true, indentLevel: 0 } },
      { text: '   CSManTech 2023-2024에서 발표 (반도체 제조 기술 학회)', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 37, TOTAL);
  })();

  // ============================================================
  // 슬라이드 38: Content — 이미 작동 중인 유사 시스템들
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '이미 작동 중인 유사 시스템들');

    // 3개 카드
    var cardW = 3.843;
    var cardH = 4.0;
    var gap = 0.3;

    helpers.addCard(slide, {
      x: 0.6, y: 1.9, w: cardW, h: cardH,
      title: 'Tignis',
      body: '반도체 증착 공정에서\nML 기반 R2R 제어기를\n실제 팹에 배포.\n\n드리프트 보정에서\n기존 정적 APC 대비\n우수한 성능 입증.',
      accentColor: COLORS.accent_blue
    });

    helpers.addCard(slide, {
      x: 0.6 + cardW + gap, y: 1.9, w: cardW, h: cardH,
      title: 'Lam Research',
      body: '베이지안 최적화 + 인간 협업\n방식으로 5회 반복만에\n올바른 레시피 도출.\n\n비교: 자체 방법 45회,\n시니어 엔지니어 84회.',
      accentColor: COLORS.accent_cyan
    });

    helpers.addCard(slide, {
      x: 0.6 + (cardW + gap) * 2, y: 1.9, w: cardW, h: cardH,
      title: 'Imubit',
      body: '정유/화학 공장에서\nDCS에 직접 명령을 쓰는\n폐쇄 루프 AI 최적화.\n\n기존 주간/월간 업데이트를\n수분 단위로 단축.',
      accentColor: COLORS.accent_yellow
    });

    // 하단 주석
    slide.addText('주의: 위 사례 모두 온톨로지/LLM이 아닌 전통 ML/베이지안 기반이다', {
      x: 0.6, y: 6.2, w: 12.13, h: 0.4,
      fontSize: 13, fontFace: FONTS.caption.fontFace,
      color: COLORS.accent_red,
      lineSpacingMultiple: 1.3
    });

    helpers.addPageNumber(slide, 38, TOTAL);
  })();

  // ============================================================
  // 슬라이드 39: Content — 완전한 폐쇄 루프 사례는 아직 없다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '완전한 폐쇄 루프를 AI+지식그래프로 돌리는 사례는 아직 없다');

    const bullets = [
      { text: '가장 가까운 것은 ML/RL 기반 시스템이다 (Tignis, Imubit)', options: { bullet: true, indentLevel: 0 } },
      { text: 'LLM은 보조 역할에 머물러 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '   문서 분석, 근본원인 추론 보조, 자연어 보고서 생성 수준', options: { bullet: false, indentLevel: 1 } },
      { text: '삼성전자가 AI 에이전트 기반 스마트 팩토리를 발표했으나 아직 계획 단계', options: { bullet: true, indentLevel: 0 } },
      { text: 'OPC 레시피 생성에 LLM을 적용한 연구(arXiv 2024)가 가장 유사하나 연구 단계', options: { bullet: true, indentLevel: 0 } },
      { text: '현실: 전체 루프를 LLM+KG로 돌린 사례는 없다', options: { bullet: true, indentLevel: 0 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });
    helpers.addPageNumber(slide, 39, TOTAL);
  })();

  // ============================================================
  // 슬라이드 40: Content — 안정적 공정에서는 기존 방법이 충분하다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '안정적 공정에서는 기존 방법이 충분하다');

    const bullets = [
      { text: 'R2R(Run-to-Run) 제어가 95~98% 정확도를 유지하는 공정이 많다', options: { bullet: true, indentLevel: 0 } },
      { text: '이런 공정에 AI를 추가해도 개선 폭이 미미하다', options: { bullet: true, indentLevel: 0 } },
      { text: '오히려 불필요한 복잡성만 추가될 수 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '첫 번째 질문: "우리 공정에 R2R로 못 잡는 변동성이 있는가?"', options: { bullet: true, indentLevel: 0 } },
      { text: '   없다면 AI 도입의 실익이 낮다. 있다면 구체적으로 무엇인지 정의해야 한다', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 40, TOTAL);
  })();

  // ============================================================
  // 슬라이드 41: Section — 06. 왜 쉽지 않은가: 장벽과 위험
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
    slide.addText('06', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: COLORS.accent_cyan, align: 'center'
    });
    slide.addText('왜 쉽지 않은가:\n장벽과 위험', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 36, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary,
      lineSpacingMultiple: 1.1
    });
    slide.addText('기술적 가능성과 현실적 도입 사이의 간극을 직시한다', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });
    helpers.addPageNumber(slide, 41, TOTAL);
  })();

  // ============================================================
  // 슬라이드 42: CardGrid 2x3 — 도입을 가로막는 6가지 벽
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '도입을 가로막는 6가지 벽');

    var CARD_2X3 = {
      w: 3.843, h: 2.45,
      positions: [
        { x: 0.6,   y: 1.8  },
        { x: 4.743, y: 1.8  },
        { x: 8.886, y: 1.8  },
        { x: 0.6,   y: 4.55 },
        { x: 4.743, y: 4.55 },
        { x: 8.886, y: 4.55 }
      ]
    };

    var cards = [
      { title: '1. 데이터 인프라 부재', body: '센서 데이터가 MES에\n통합되지 않은 공장이\n대다수. AI 이전에\n데이터 연결부터 필요.', color: COLORS.accent_blue },
      { title: '2. 유지보수 부담', body: '공정이 변경되면\n온톨로지도 갱신해야 한다.\n지속적 전문가 참여 없이는\n지식이 노후화된다.', color: COLORS.accent_cyan },
      { title: '3. 전문인력 부족', body: '온톨로지 + ML +\nOPC UA + 제조 도메인을\n모두 아는 인력 확보가\n그 자체로 과제.', color: COLORS.accent_yellow },
      { title: '4. 효과 불확실', body: 'ROI를 사전에\n증명하기 어렵다.\nAI 프로젝트의 87%가\nPoC를 넘지 못한다.', color: COLORS.accent_red },
      { title: '5. 안전 위험', body: '잘못된 레시피 제안은\n장비 손상, 제품 불량,\n심하면 인명 사고로\n이어질 수 있다.', color: COLORS.accent_purple },
      { title: '6. 조직 저항', body: '"AI가 내 레시피를\n바꾼다"는 불안감.\n엔지니어의 저항은\n합리적 우려이기도 하다.', color: '38BDF8' }
    ];

    cards.forEach(function(card, i) {
      var pos = CARD_2X3.positions[i];
      helpers.addCard(slide, {
        x: pos.x, y: pos.y, w: CARD_2X3.w, h: CARD_2X3.h,
        title: card.title, body: card.body,
        accentColor: card.color
      });
    });

    helpers.addPageNumber(slide, 42, TOTAL);
  })();

  // ============================================================
  // 슬라이드 43: Content — 가장 큰 위험: 과잉 설계
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '가장 큰 위험: 과잉 설계');

    const bullets = [
      { text: '온톨로지 + LLM + 멀티에이전트 전체가 정말 필요한가?', options: { bullet: true, indentLevel: 0 } },
      { text: '많은 경우 전통 ML/RL만으로도 충분할 수 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '   Tignis, Lam Research는 LLM 없이 실제 성과를 내고 있다', options: { bullet: false, indentLevel: 1 } },
      { text: '"기존 시스템이 못 잡는 문제가 구체적으로 무엇인가"를 먼저 정의해야 한다', options: { bullet: true, indentLevel: 0 } },
      { text: '문제 정의 없이 기술을 도입하면, 해결할 문제보다 유지할 시스템이 더 많아진다', options: { bullet: true, indentLevel: 0 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 43, TOTAL);
  })();

  // ============================================================
  // 슬라이드 44: Content — AI의 환각이 공장에서는 더 위험하다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'AI의 환각이 공장에서는 더 위험하다');

    const bullets = [
      { text: '틀린 파라미터를 자신 있게 제시하는 것이 환각(Hallucination)이다', options: { bullet: true, indentLevel: 0 } },
      { text: '   복잡한 태스크에서 LLM 정확도는 약 73% 수준', options: { bullet: false, indentLevel: 1 } },
      { text: '승인 피로: 하루 50건 알림이 오면 형식적으로 승인하게 된다', options: { bullet: true, indentLevel: 0 } },
      { text: '   사람 승인이 최후 방어선이지만, 피로로 무력화될 수 있다', options: { bullet: false, indentLevel: 1 } },
      { text: '연쇄 오류 전파: 초기 단계의 잘못된 판단이 후속 공정에 파급된다', options: { bullet: true, indentLevel: 0 } },
      { text: '   식각 파라미터 오류 \u2192 CMP 두께 이상 \u2192 증착 불량의 연쇄 반응', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });
    helpers.addPageNumber(slide, 44, TOTAL);
  })();

  // ============================================================
  // 슬라이드 45: Table — 규제가 자동 레시피 변경을 제한한다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '규제가 자동 레시피 변경을 제한한다');

    var headers = ['규제/표준', '핵심 요구사항', 'AI 레시피 변경에 대한 영향'];
    var dataRows = [
      [
        { text: 'ISO 9001', options: { bold: true } },
        'QMS 내 검증, 변경 문서화',
        '모든 자동 변경에 문서화된 프로세스 필요'
      ],
      [
        { text: 'IATF 16949', options: { bold: true } },
        '자동차 고유 요건, 위험 기반 관리',
        '레시피 변경에 사전 통제 필수. 자동 변경에 까다로움'
      ],
      [
        { text: 'FDA 21 CFR Part 11', options: { bold: true } },
        '전자 기록/서명, 감사 추적',
        '자동 변경은 "변경 통제 이벤트"로 취급. 매우 엄격'
      ],
      [
        { text: 'EU Annex 22', options: { bold: true } },
        '결정론적 모델만 허용',
        'LLM은 본질적으로 비결정론적. 고위험 공정 적용 불가'
      ],
      [
        { text: 'SEMI 표준', options: { bold: true } },
        '장비 통신 규격 (SECS/GEM)',
        '레시피 전달 인터페이스 표준 준수 필요'
      ]
    ];

    helpers.addStyledTable(slide, headers, dataRows, {
      y: 1.8,
      colW: [2.8, 3.83, 5.5]
    });
    helpers.addPageNumber(slide, 45, TOTAL);
  })();

  // ============================================================
  // 슬라이드 46: Content — 책임 소재 문제
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'AI가 제안하고 사람이 승인했는데 불량이 나면, 누구 책임인가?');

    const bullets = [
      { text: '이 질문에 대한 명확한 법적 프레임워크는 아직 없다', options: { bullet: true, indentLevel: 0 } },
      { text: '현실적으로 AI 제안을 승인한 엔지니어에게 책임이 간다', options: { bullet: true, indentLevel: 0 } },
      { text: '"AI가 근거를 제시했고, 판단 시간이 부족했다면?"이라는 반론이 가능하다', options: { bullet: true, indentLevel: 0 } },
      { text: '회사 차원에서 AI 시스템의 검증 절차가 충분했는지가 쟁점이 된다', options: { bullet: true, indentLevel: 0 } },
      { text: 'EU Annex 22(2026 시행)는 고위험 공정에서 결정론적 모델만 허용한다', options: { bullet: true, indentLevel: 0 } },
      { text: '   LLM은 같은 입력에 다른 출력이 가능하여 본질적으로 비결정론적이다', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });
    helpers.addPageNumber(slide, 46, TOTAL);
  })();

  // ============================================================
  // 슬라이드 47: Content — 놓치기 쉬운 문제들
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '놓치기 쉬운 문제들');

    // 3개 카드 (1행)
    var cardW = 3.843;
    var cardH = 3.5;
    var gap = 0.3;

    helpers.addCard(slide, {
      x: 0.6, y: 1.9, w: cardW, h: cardH,
      title: 'KG 데이터 오염',
      body: 'LLM이 FMEA 문서에서\n잘못된 관계를 추출하면,\n지식 기반 자체가 오염된다.\n\n잘못된 추출이 체계적\n오분석으로 이어진다.',
      accentColor: COLORS.accent_red
    });

    helpers.addCard(slide, {
      x: 0.6 + cardW + gap, y: 1.9, w: cardW, h: cardH,
      title: '데이터 보안',
      body: '공정 노하우는 영업비밀이다.\n\n클라우드 LLM에 공정 데이터를\n보내는 것 자체가 위험.\n온프레미스 소형 모델이\n현실적 대안.',
      accentColor: COLORS.accent_yellow
    });

    helpers.addCard(slide, {
      x: 0.6 + (cardW + gap) * 2, y: 1.9, w: cardW, h: cardH,
      title: '시스템 장애 시 폴백',
      body: '클라우드 LLM이 다운되면\n공정 제어는 어떻게 되는가?\n\nAI 없이도 기존 APC/R2R로\n돌아갈 수 있는 구조가\n반드시 필요하다.',
      accentColor: COLORS.accent_purple
    });

    helpers.addPageNumber(slide, 47, TOTAL);
  })();

  // ============================================================
  // 슬라이드 48: Section — 07. 현실적 시작법: 4단계 접근
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });
    slide.addText('07', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.kpi.fontFace, bold: FONTS.kpi.bold,
      color: COLORS.accent_cyan, align: 'center'
    });
    slide.addText('현실적 시작법:\n4단계 접근', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 36, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
      color: COLORS.text_primary,
      lineSpacingMultiple: 1.1
    });
    slide.addText('진단에서 반자동 제어까지, 검증하며 올라간다', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });
    helpers.addPageNumber(slide, 48, TOTAL);
  })();

  // ============================================================
  // 슬라이드 49: Timeline — Phase 0~3
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'Phase 0~3: 진단에서 반자동 제어까지');

    // 세로 타임라인 바
    slide.addShape('rect', {
      x: 0.6, y: 1.8, w: 0.06, h: 5.0,
      fill: { color: COLORS.accent_blue }
    });

    var items = [
      { step: 'Phase 0: 진단 (1개월)', title: '"이 시스템이 정말 필요한가"를 확인한다', description: '기존 APC/R2R baseline 측정, 데이터 인프라 성숙도 평가.\n"AI 불필요"라는 결론도 가치 있는 결과다.' },
      { step: 'Phase 1: 읽기 전용 보조 (2~3개월)', title: 'AI가 분석만 하고, 레시피에는 손대지 않는다', description: '근본원인 가설 제시(변경 권한 없음).\n엔지니어와 AI 판단을 비교하며 신뢰를 쌓는다.' },
      { step: 'Phase 2: 승인 기반 제안 (3~6개월)', title: 'AI가 제안하되, 사람이 반드시 승인한다', description: '안전 범위 하드코딩.\nAI vs 엔지니어 vs 실제 결과 3자 비교 데이터를 축적한다.' },
      { step: 'Phase 3: 반자동 제어 (6~12개월)', title: '검증된 범위 내에서 자동 조정을 허용한다', description: '범위 밖 조정은 여전히 사람 승인 필수.\n이상 시 자동 롤백. OEE 개선 효과를 측정한다.' }
    ];

    var itemH = 5.0 / items.length;
    items.forEach(function(item, i) {
      var itemY = 1.8 + i * itemH;
      // 타임라인 점
      slide.addShape('ellipse', {
        x: 0.515, y: itemY + 0.12, w: 0.23, h: 0.23,
        fill: { color: COLORS.accent_blue }
      });
      // 단계 레이블
      slide.addText(item.step, {
        x: 1.0, y: itemY, w: 4.5, h: 0.35,
        fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
        color: COLORS.accent_blue
      });
      // 제목
      slide.addText(item.title, {
        x: 1.0, y: itemY + 0.35, w: 11.73, h: 0.35,
        fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
        color: COLORS.text_primary
      });
      // 설명
      slide.addText(item.description, {
        x: 1.0, y: itemY + 0.7, w: 11.73, h: itemH - 0.85,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, valign: 'top',
        lineSpacingMultiple: 1.4
      });
      // 구분선 (마지막 제외)
      if (i < items.length - 1) {
        slide.addShape('line', {
          x: 1.0, y: itemY + itemH - 0.05, w: 11.73, h: 0,
          line: { color: 'E2E8F0', width: 0.5 }
        });
      }
    });

    helpers.addPageNumber(slide, 49, TOTAL);
  })();

  // ============================================================
  // 슬라이드 50: Content — Phase 0 상세
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'Phase 0: 먼저 "이 시스템이 정말 필요한가"를 확인한다');

    const bullets = [
      { text: '대상 공정의 기존 APC/R2R 성능 baseline을 측정한다', options: { bullet: true, indentLevel: 0 } },
      { text: '"기존 시스템이 못 잡는 변동성"이 실제로 존재하는지 확인한다', options: { bullet: true, indentLevel: 0 } },
      { text: '데이터 인프라 성숙도를 평가한다', options: { bullet: true, indentLevel: 0 } },
      { text: '   센서 \u2192 MES 연결 상태, 데이터 품질, 수집 주기 등', options: { bullet: false, indentLevel: 1 } },
      { text: '이 단계에서 "AI가 필요 없다"는 결론이 나올 수 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '   그것도 가치 있는 결과다. 불필요한 투자를 막았기 때문이다', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 50, TOTAL);
  })();

  // ============================================================
  // 슬라이드 51: Content — Phase 1 상세
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'Phase 1: AI가 분석만 하고, 레시피에는 손대지 않는다');

    const bullets = [
      { text: '불량 데이터 분석 후 근본원인 가설을 제시한다 (레시피 변경 권한 없음)', options: { bullet: true, indentLevel: 0 } },
      { text: '엔지니어가 AI 제안과 자신의 판단을 비교한다', options: { bullet: true, indentLevel: 0 } },
      { text: '온톨로지 기반 지식 탐색이 실제로 유용한지 검증한다', options: { bullet: true, indentLevel: 0 } },
      { text: '핵심 지표 1: AI 가설의 정확도', options: { bullet: true, indentLevel: 0 } },
      { text: '핵심 지표 2: 엔지니어의 의사결정 시간 단축 여부', options: { bullet: true, indentLevel: 0 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 51, TOTAL);
  })();

  // ============================================================
  // 슬라이드 52: Content — Phase 2 상세
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, 'Phase 2: AI가 레시피를 제안하되, 사람이 반드시 승인한다');

    const bullets = [
      { text: '안전 범위(허용 파라미터 범위)를 하드코딩하여 위험한 제안을 차단한다', options: { bullet: true, indentLevel: 0 } },
      { text: '"AI 제안 vs 엔지니어 판단 vs 실제 결과" 3자 비교 데이터를 축적한다', options: { bullet: true, indentLevel: 0 } },
      { text: '핵심 지표 1: 승인된 제안의 불량률 개선 효과', options: { bullet: true, indentLevel: 0 } },
      { text: '핵심 지표 2: 거부된 제안의 사유 분석', options: { bullet: true, indentLevel: 0 } },
      { text: '   거부 패턴을 분석하면 시스템 개선 방향이 보인다', options: { bullet: false, indentLevel: 1 } }
    ];

    slide.addText(bullets, {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });
    helpers.addPageNumber(slide, 52, TOTAL);
  })();

  // ============================================================
  // 슬라이드 53: Table — 의사결정 가이드
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '우리 상황에 맞는 길을 찾는 의사결정 가이드');

    var headers = ['현재 상황', '추천 접근'];
    var dataRows = [
      [
        '공장 간 데이터/레시피 호환이 안 된다',
        'AAS(자산관리셸) 기반 표준화부터 도입'
      ],
      [
        '새 설비를 도입하는 시점이다',
        '설비 전문 사전(온톨로지)을 먼저 개발하여 처음부터 구조화'
      ],
      [
        'AI가 공정 맥락을 이해하지 못한다',
        '지식그래프 + 경량 도메인 사전 구축으로 맥락 제공'
      ],
      [
        '온톨로지/KG를 만들 인력이 부족하다',
        'AI 반자동 구축(ARKNESS 접근) 후 전문가 검증'
      ],
      [
        'ROI를 먼저 증명해야 한다',
        '가장 좁은 범위(1개 공정, 1개 파라미터)부터 시작'
      ]
    ];

    helpers.addStyledTable(slide, headers, dataRows, {
      y: 1.8,
      colW: [5.0, 7.13]
    });
    helpers.addPageNumber(slide, 53, TOTAL);
  })();

  // ============================================================
  // 슬라이드 54: Table — 핵심 주장들의 근거 신뢰도 매트릭스
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '핵심 주장들의 근거는 얼마나 확실한가');

    var headers = ['핵심 주장', '확신도', '출처', '비고'];
    var dataRows = [
      [
        'KG 기반 불량 추적이 효과적',
        { text: '중-상', options: { color: COLORS.accent_yellow, bold: true } },
        'arXiv:2510.15428',
        '자동차 도메인, 타 도메인 검증 필요'
      ],
      [
        '소형 LLM + KG 조합 가능',
        { text: '중', options: { color: COLORS.accent_yellow, bold: true } },
        'arXiv:2506.13026',
        'CNC 한정, 현장 배포 미확인'
      ],
      [
        '폐쇄 루프 AI (연속 공정)',
        { text: '높음', options: { color: '27AE60', bold: true } },
        'Imubit 상용 운영',
        '이산 제조에서는 미검증'
      ],
      [
        'LLM 수치 추론 취약',
        { text: '높음', options: { color: '27AE60', bold: true } },
        'ACL 2025, arXiv',
        '반증 미발견'
      ],
      [
        '온톨로지 자동 구축',
        { text: '중', options: { color: COLORS.accent_yellow, bold: true } },
        'ARKNESS 등',
        '산업 규모 검증 부족'
      ],
      [
        '멀티에이전트 제조',
        { text: '중', options: { color: COLORS.accent_yellow, bold: true } },
        'Bosch, PHM 2025',
        '레시피 자동 조정까지는 미도달'
      ],
      [
        '기존 APC/R2R 충분',
        { text: '높음', options: { color: '27AE60', bold: true } },
        'Tignis CSManTech',
        '안정 공정에서 AI 추가 실익 미미'
      ]
    ];

    helpers.addStyledTable(slide, headers, dataRows, {
      y: 1.8,
      colW: [3.2, 1.2, 3.0, 4.73]
    });
    helpers.addPageNumber(slide, 54, TOTAL);
  })();

  // ============================================================
  // 슬라이드 55: Content — 앞으로 탐색해야 할 네 가지 질문
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '앞으로 탐색해야 할 네 가지 질문');

    // 4개 카드 (2x2)
    var CARD_2X2 = {
      w: 5.915, h: 2.45,
      positions: [
        { x: 0.6,   y: 1.8  },
        { x: 6.815, y: 1.8  },
        { x: 0.6,   y: 4.55 },
        { x: 6.815, y: 4.55 }
      ]
    };

    var cards = [
      { title: '1. 기존 APC와의 통합 방법', body: '기존 APC/R2R 시스템과\n새로운 AI 보조 계층을\n구체적으로 어떻게\n연결하고 공존시킬 것인가?', color: COLORS.accent_blue },
      { title: '2. 자동 vs 전문가 온톨로지', body: 'LLM이 자동 생성한 온톨로지와\n전문가가 수작업으로 구축한\n온톨로지의 품질 차이를\n정량적으로 비교해야 한다.', color: COLORS.accent_cyan },
      { title: '3. 승인 피로 방지 설계', body: 'AI 제안이 빈번할 때\n엔지니어가 형식적으로\n승인하는 문제를\n어떻게 구조적으로 방지할 것인가?', color: COLORS.accent_yellow },
      { title: '4. 규제 환경의 인증 경로', body: 'IATF, FDA, EU Annex 22 등\n규제 환경에서 LLM 기반\n공정 제어의 인증이\n실제로 가능한 경로가 있는가?', color: COLORS.accent_purple }
    ];

    cards.forEach(function(card, i) {
      var pos = CARD_2X2.positions[i];
      helpers.addCard(slide, {
        x: pos.x, y: pos.y, w: CARD_2X2.w, h: CARD_2X2.h,
        title: card.title, body: card.body,
        accentColor: card.color
      });
    });

    helpers.addPageNumber(slide, 55, TOTAL);
  })();

  // ============================================================
  // 슬라이드 56: Quote — AI의 진짜 역할
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    // 라이트 배경
    slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });
    // 강조 라인
    slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });
    // 인용 텍스트
    slide.addText('\u201CAI의 진짜 역할은 레시피를 만드는 것이 아니라,\n엔지니어가 더 빠르게 판단하도록 돕는 것이다\u201D', {
      x: 1.5, y: 2.5, w: 10.33, h: 2.5,
      fontSize: 24, fontFace: FONTS.serif.fontFace, italic: true,
      color: COLORS.text_primary, align: 'center',
      lineSpacingMultiple: 1.5
    });
    // 출처
    slide.addText('\u2014 3개 보고서 + Critic이 수렴한 핵심 결론', {
      x: 1.5, y: 5.2, w: 10.33, h: 0.4,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });
    helpers.addPageNumber(slide, 56, TOTAL);
  })();

  // ============================================================
  // 슬라이드 57: Closing — 기존 시스템 위에, 한 단계씩, 검증하며 올라가라
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    helpers.addTitleBar(slide, '기존 시스템 위에, 한 단계씩, 검증하며 올라가라');

    var summaryPoints = [
      'LLM은 수치 결정자가 아니라 지식 통역사다. 판단은 LLM이, 수치는 전통 ML이 맡는다.',
      '기존 APC/R2R을 대체하는 것이 아니라 그 위에 보완하는 지능형 계층으로 올린다.',
      'Phase 0에서 "이 시스템이 정말 필요한가"부터 확인한다. "불필요"도 가치 있는 결론이다.'
    ];

    summaryPoints.forEach(function(point, i) {
      var y = 1.9 + i * 0.85;
      // 번호 원형
      slide.addShape('ellipse', {
        x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
        fill: { color: COLORS.accent_blue }
      });
      slide.addText(String(i + 1), {
        x: 0.8, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_on_dark, align: 'center', valign: 'middle'
      });
      // 포인트 텍스트
      slide.addText(point, {
        x: 1.5, y: y, w: 11.23, h: 0.55,
        fontSize: 16, fontFace: FONTS.body.fontFace,
        color: COLORS.text_primary, valign: 'middle'
      });
    });

    // 구분선
    var divY = 1.9 + summaryPoints.length * 0.85 + 0.3;
    slide.addShape('line', {
      x: 0.6, y: divY, w: 12.13, h: 0,
      line: { color: 'E2E8F0', width: 0.5 }
    });

    // 하단 메시지
    slide.addText('2026-03-20  |  제조 불량 분석-레시피 제어 시스템 리서치', {
      x: 0.6, y: divY + 0.3, w: 12.13, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    helpers.addPageNumber(slide, 57, TOTAL);
  })();
};
