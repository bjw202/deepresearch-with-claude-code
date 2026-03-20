module.exports = function(pptx, COLORS, FONTS, TABLE_STYLE, TABLE_OPTIONS, CHART_STYLE, helpers) {
  const { addTitleBar, addStyledTable, addCard, addPageNumber } = helpers;
  const TOTAL = 57;

  // ============================================================
  // 슬라이드 1: Title
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    // 풀블리드 다크 배경
    slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_dark } });

    // 장식용 accent 라인
    slide.addShape('rect', { x: 1.5, y: 2.3, w: 1.5, h: 0.06, fill: { color: COLORS.accent_cyan } });

    // 메인 제목
    slide.addText('공장의 불량, AI가 원인을 찾고\n레시피를 고칠 수 있을까', {
      x: 1.5, y: 2.5, w: 10.33, h: 1.4,
      fontSize: 40, fontFace: FONTS.title.fontFace, bold: FONTS.title.bold,
      color: COLORS.text_on_dark, align: 'center',
      charSpacing: -0.5, lineSpacingMultiple: 1.1
    });

    // 부제목
    slide.addText('온톨로지 + AI 에이전트 기반 제조 공정 제어 가능성 조사 | 2026-03-20', {
      x: 1.5, y: 4.1, w: 10.33, h: 0.6,
      fontSize: 18, fontFace: FONTS.body.fontFace,
      color: 'FFFFFF', transparency: 30, align: 'center'
    });

    addPageNumber(slide, 1, TOTAL);
  })();

  // ============================================================
  // 슬라이드 2: Content - 오늘 이야기할 것
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '오늘 이야기할 것');

    const roadmap = [
      { num: '01', title: '이미 돌아가고 있는 시스템들', desc: '기존 공정 제어 도구의 역할과 한계' },
      { num: '02', title: 'AI 보조 시스템의 구조', desc: '세 가지 기술의 역할 분담과 전체 흐름' },
      { num: '03', title: '지식의 지도', desc: '불량-원인-파라미터 관계를 컴퓨터가 읽을 수 있게 정리' },
      { num: '04', title: 'AI의 역할과 한계', desc: 'AI가 잘하는 일과 못하는 일 구분' },
      { num: '05', title: '실제 현장 사례', desc: '이미 작동하고 있는 유사 시스템들' },
      { num: '06', title: '위험과 장벽', desc: '안전, 규제, 조직 저항, 데이터 인프라' },
      { num: '07', title: '어디서, 어떻게 시작할 것인가', desc: '단계적 도입 전략과 시작점' }
    ];

    roadmap.forEach(function(item, i) {
      var y = 1.7 + i * 0.72;

      // 번호 원형
      slide.addShape('ellipse', {
        x: 0.7, y: y + 0.05, w: 0.45, h: 0.45,
        fill: { color: COLORS.accent_blue }
      });
      slide.addText(item.num, {
        x: 0.7, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_on_dark, align: 'center', valign: 'middle'
      });

      // 제목
      slide.addText(item.title, {
        x: 1.4, y: y, w: 4.5, h: 0.5,
        fontSize: 17, fontFace: FONTS.subtitle.fontFace, bold: FONTS.subtitle.bold,
        color: COLORS.text_primary, valign: 'middle'
      });

      // 설명
      slide.addText(item.desc, {
        x: 6.0, y: y, w: 6.5, h: 0.5,
        fontSize: 14, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, valign: 'middle'
      });
    });

    addPageNumber(slide, 2, TOTAL);
  })();

  // ============================================================
  // 슬라이드 3: Quote
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    // 라이트 배경
    slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: COLORS.bg_secondary } });

    // 강조 라인
    slide.addShape('rect', { x: 6.17, y: 2.0, w: 1.0, h: 0.06, fill: { color: COLORS.accent_blue } });

    // 인용 텍스트
    slide.addText('\u201C같은 불량이 반복되는데,\n매번 사람이 원인을 찾고 레시피를 수정한다\u201D', {
      x: 1.5, y: 2.5, w: 10.33, h: 2.5,
      fontSize: 26, fontFace: FONTS.serif.fontFace, italic: true,
      color: COLORS.text_primary, align: 'center',
      lineSpacingMultiple: 1.5
    });

    // 출처
    slide.addText('\u2014 제조 현장의 공통 과제', {
      x: 1.5, y: 5.2, w: 10.33, h: 0.4,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    addPageNumber(slide, 3, TOTAL);
  })();

  // ============================================================
  // 슬라이드 4: Content - 지금은 대부분 수동이다
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '불량 감지부터 레시피 수정까지, 지금은 대부분 수동이다');

    slide.addText([
      { text: '불량 감지: SPC(통계적 공정 관리) 관리도가 이상 신호를 띄움', options: { bullet: true, indentLevel: 0 } },
      { text: '원인 분석: 엔지니어가 경험과 데이터를 뒤져서 원인을 찾음', options: { bullet: true, indentLevel: 0 } },
      { text: '레시피 수정: 파라미터를 수동으로 조정하고 시험 생산', options: { bullet: true, indentLevel: 0 } },
      { text: '설비 적용: 수정된 레시피를 설비에 직접 입력', options: { bullet: true, indentLevel: 0 } },
      { text: '결과 확인: 다음 생산 결과를 기다림', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 2.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 병목 강조 박스
    slide.addShape('roundRect', {
      x: 0.6, y: 4.9, w: 12.13, h: 1.6,
      rectRadius: 0.1, fill: { color: 'FFF5F5' },
      line: { color: COLORS.accent_red, width: 1 }
    });

    slide.addText('핵심 병목', {
      x: 0.9, y: 5.0, w: 2.5, h: 0.35,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.accent_red
    });

    slide.addText('원인 분석에 수 시간~수 일 소요, 숙련 엔지니어 의존, 같은 불량이 반복되어도 매번 처음부터 분석, 과거 이력이 체계적으로 축적되지 않음', {
      x: 0.9, y: 5.35, w: 11.53, h: 1.0,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top'
    });

    addPageNumber(slide, 4, TOTAL);
  })();

  // ============================================================
  // 슬라이드 5: Content - 비전
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '만약 AI가 원인을 찾고, 레시피를 제안하고, 설비에 내려준다면?');

    // 흐름도를 수평 단계로 표현
    const steps = [
      { label: '불량 감지', color: COLORS.accent_red },
      { label: '원인 분석', color: COLORS.accent_blue },
      { label: '레시피 제안', color: COLORS.accent_cyan },
      { label: '사람 승인', color: COLORS.accent_yellow },
      { label: '설비 적용', color: COLORS.accent_purple }
    ];

    var stepW = 2.0;
    var stepH = 0.8;
    var gap = 0.28;
    var startX = 0.7;
    var stepY = 2.2;

    steps.forEach(function(step, i) {
      var x = startX + i * (stepW + gap);

      // 단계 박스
      slide.addShape('roundRect', {
        x: x, y: stepY, w: stepW, h: stepH,
        rectRadius: 0.08, fill: { color: step.color }
      });
      slide.addText(step.label, {
        x: x, y: stepY, w: stepW, h: stepH,
        fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: 'FFFFFF', align: 'center', valign: 'middle'
      });

      // 화살표 (마지막 제외)
      if (i < steps.length - 1) {
        slide.addText('\u25B6', {
          x: x + stepW, y: stepY, w: gap, h: stepH,
          fontSize: 14, color: COLORS.text_tertiary, align: 'center', valign: 'middle'
        });
      }
    });

    // 하단 설명
    var descY = 3.4;
    var descItems = [
      '자동 모니터링으로\n즉시 감지',
      'KG + AI가\n유사 사례 탐색',
      '수치는 ML이\n계산하여 제안',
      '위험도별로\n자동/수동 분기',
      'OPC UA로\n설비에 전달'
    ];

    descItems.forEach(function(item, i) {
      var x = startX + i * (stepW + gap);
      slide.addText(item, {
        x: x, y: descY, w: stepW, h: 0.8,
        fontSize: 12, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, align: 'center', valign: 'top',
        lineSpacingMultiple: 1.3
      });
    });

    // 핵심 메시지
    slide.addShape('roundRect', {
      x: 0.6, y: 4.8, w: 12.13, h: 1.8,
      rectRadius: 0.1, fill: { color: COLORS.bg_secondary }
    });

    slide.addText('핵심: 사람을 대체하는 것이 아니라, 분석과 제안을 자동화하여 엔지니어의 판단을 돕는 것', {
      x: 0.9, y: 4.9, w: 11.53, h: 0.5,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary, valign: 'middle'
    });

    slide.addText('모니터링 \u2192 지식 탐색 \u2192 AI 판단 \u2192 ML 계산 \u2192 안전 검증 \u2192 보고서 \u2192 승인 \u2192 설비 전달 \u2192 결과 모니터링 \u2192 지식 축적', {
      x: 0.9, y: 5.5, w: 11.53, h: 0.9,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, valign: 'top'
    });

    addPageNumber(slide, 5, TOTAL);
  })();

  // ============================================================
  // 슬라이드 6: Section - 01
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    // 좌측 다크 패널
    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });

    // 섹션 번호
    slide.addText('01', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.accent_cyan, align: 'center'
    });

    // 섹션 제목
    slide.addText('이미 돌아가고 있는\n시스템들', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 36, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.text_primary, lineSpacingMultiple: 1.1
    });

    // 설명
    slide.addText('제조 현장에는 이미 불량 감지, 원인 분석, 레시피 조정을\n담당하는 시스템들이 있다. AI를 논하기 전에 이들을 먼저 이해해야 한다.', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });

    addPageNumber(slide, 6, TOTAL);
  })();

  // ============================================================
  // 슬라이드 7: Table - 기존 4대 공정 제어 도구 비교
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '공정 제어의 4가지 기존 도구를 비교한다');

    var headers = ['시스템', '역할', '강점', '한계'];
    var dataRows = [
      [
        'SPC\n(통계적 공정 관리)',
        '관리도 기반\n이상 감지',
        '단순하고 검증됨\n25년 이상 실적',
        '체계적 드리프트 감지 못함\n사후 대응'
      ],
      [
        'FDC\n(불량 감지 분류)',
        '센서 데이터로\n실시간 이상 감지',
        '장비 상태\n모니터링에 강함',
        '"왜?"에 대한\n답은 약함'
      ],
      [
        'R2R\n(런투런 제어)',
        '런 간 레시피\n파라미터 자동 조정',
        '피드백/피드포워드\n기반 정밀 보정',
        '정적 모델 기반\n비선형 드리프트에 취약'
      ],
      [
        'APC\n(고급 공정 제어)',
        'R2R + FDC 통합\n공장 전체 최적화',
        '수율/처리량/스크랩\n동시 개선',
        '구축 비용 높음\n모델 유지보수 부담'
      ]
    ];

    addStyledTable(slide, headers, dataRows, {
      y: 1.8, w: 12.13,
      colW: [2.5, 2.8, 3.4, 3.43],
      rowH: [0.45, 1.1, 1.1, 1.1, 1.1]
    });

    addPageNumber(slide, 7, TOTAL);
  })();

  // ============================================================
  // 슬라이드 8: Content - SPC
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '통계적 공정 관리: 25년 검증된 기본기', 'SPC (Statistical Process Control)');

    slide.addText([
      { text: '관리도(Control Chart)로 공정의 이상 여부를 판단하는 가장 전통적인 방법', options: { bullet: true, indentLevel: 0 } },
      { text: 'Western Electric 규칙 등 통계적 기준으로 이상 신호를 탐지', options: { bullet: true, indentLevel: 0 } },
      { text: '단순하고, 25년 이상 현장에서 검증된 높은 신뢰도', options: { bullet: true, indentLevel: 0 } },
      { text: '한계: 도구 마모 같은 체계적 드리프트를 사전에 감지하지 못함', options: { bullet: true, indentLevel: 0 } },
      { text: '한계: 이상이 발생한 뒤에 감지하는 사후 대응 방식', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    addPageNumber(slide, 8, TOTAL);
  })();

  // ============================================================
  // 슬라이드 9: Content - R2R
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '런투런 제어: 매번 조금씩 레시피를 자동 보정한다', 'R2R (Run-to-Run Control)');

    slide.addText([
      { text: '매 생산 런(Run)이 끝날 때마다, 결과를 보고 다음 런의 파라미터를 자동 조정', options: { bullet: true, indentLevel: 0 } },
      { text: '피드백 방식: 이전 결과를 반영하여 보정', options: { bullet: true, indentLevel: 0 } },
      { text: '피드포워드 방식: 입력 재료의 변동을 미리 반영', options: { bullet: true, indentLevel: 0 } },
      { text: '한계: DOE 기반 정적 모델이라 비선형 드리프트를 따라잡지 못함', options: { bullet: true, indentLevel: 0 } },
      { text: '한계: 모델이 실제 공정과 괴리될 수 있음 (부산물 축적, 촉매 열화 등)', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    addPageNumber(slide, 9, TOTAL);
  })();

  // ============================================================
  // 슬라이드 10: Content - APC
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '고급 공정 제어: 공장 전체를 최적화하려는 시도', 'APC (Advanced Process Control)');

    slide.addText([
      { text: 'R2R과 FDC를 통합하여 공장 수준의 제어를 시도하는 상위 시스템', options: { bullet: true, indentLevel: 0 } },
      { text: '수율, 처리량, 스크랩률을 동시에 최적화하는 것이 목표', options: { bullet: true, indentLevel: 0 } },
      { text: '구축 비용이 높고, 전체 배포해야 효과를 볼 수 있음', options: { bullet: true, indentLevel: 0 } },
      { text: '모델 유지보수 부담이 크고, 공정 변경 시 재구축이 필요할 수 있음', options: { bullet: true, indentLevel: 0 } },
      { text: '안정 공정에서 R2R/APC는 95~98% 정확도를 유지하는 검증된 솔루션', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    addPageNumber(slide, 10, TOTAL);
  })();

  // ============================================================
  // 슬라이드 11: TwoColumn - 기존 시스템의 강점 vs 약점
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '기존 시스템이 잘 하는 것 vs 못 하는 것');

    var COL_W = 5.865;
    var COL_GAP = 0.4;
    var COL_LEFT_X = 0.6;
    var COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP; // 6.865

    // 좌측 헤더
    slide.addShape('roundRect', {
      x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.5,
      rectRadius: 0.06, fill: { color: COLORS.accent_cyan }
    });
    slide.addText('잘 하는 것', {
      x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addText([
      { text: '안정적이고 선형적인 공정의 정밀 보정', options: { bullet: true, indentLevel: 0 } },
      { text: '결정론적이고 예측 가능한 제어', options: { bullet: true, indentLevel: 0 } },
      { text: '수십 년간 검증된 높은 신뢰성', options: { bullet: true, indentLevel: 0 } },
      { text: 'PID/R2R 기반 95~98% 정확도 유지', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: COL_LEFT_X, y: 2.5, w: COL_W, h: 4.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 우측 헤더
    slide.addShape('roundRect', {
      x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.5,
      rectRadius: 0.06, fill: { color: COLORS.accent_red }
    });
    slide.addText('못 하는 것', {
      x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addText([
      { text: '비예측적 드리프트 대응 (부산물 축적, 촉매 열화)', options: { bullet: true, indentLevel: 0 } },
      { text: '공정 간 상호작용 파악 (식각\u2192CMP\u2192증착 연쇄 영향)', options: { bullet: true, indentLevel: 0 } },
      { text: '숙련 엔지니어의 암묵지 활용', options: { bullet: true, indentLevel: 0 } },
      { text: '새로운 불량 모드에 대한 빠른 대응', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: COL_RIGHT_X, y: 2.5, w: COL_W, h: 4.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    addPageNumber(slide, 11, TOTAL);
  })();

  // ============================================================
  // 슬라이드 12: Content - AI가 불필요한 곳
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '기존 시스템이 충분한 곳에서는 AI가 불필요한 복잡성만 더한다');

    slide.addText([
      { text: '안정적이고 선형적인 공정: PID/R2R이 95~98% 정확도를 유지하면 AI 추가 실익 미미', options: { bullet: true, indentLevel: 0 } },
      { text: '데이터가 부족한 공정: AI는 대량의 양질 데이터가 필요, 부족하면 전통 방법이 더 신뢰성 있음', options: { bullet: true, indentLevel: 0 } },
      { text: '실시간 결정론적 제어: AI의 확률적 특성은 보장된 응답 시간이 필요한 곳에 부적합', options: { bullet: true, indentLevel: 0 } },
      { text: '기본 CNC 가공, 재고 관리 등 루틴 작업: 전통적 최적화가 충분', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 3.0,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 핵심 판단 기준 박스
    slide.addShape('roundRect', {
      x: 0.6, y: 5.2, w: 12.13, h: 1.2,
      rectRadius: 0.1, fill: { color: COLORS.bg_secondary }
    });

    slide.addText('\u2714  의사결정 질문: "우리 공정이 R2R만으로 못 잡는 변동성이 있는가?"', {
      x: 0.9, y: 5.3, w: 11.53, h: 0.4,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.accent_blue
    });

    slide.addText('없다면 AI 도입 실익이 낮다. "비예측적 드리프트가 있는 특정 공정"에서만 AI가 가치를 더한다.', {
      x: 0.9, y: 5.7, w: 11.53, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, lineSpacingMultiple: 1.3
    });

    addPageNumber(slide, 12, TOTAL);
  })();

  // ============================================================
  // 슬라이드 13: Section - 02
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });

    slide.addText('02', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.accent_cyan, align: 'center'
    });

    slide.addText('AI 보조 시스템은\n어떤 구조로 만들 수 있는가', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 36, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.text_primary, lineSpacingMultiple: 1.1
    });

    slide.addText('기존 시스템을 대체하지 않고, 그 위에 지능형 보조 계층을 올리는 설계', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });

    addPageNumber(slide, 13, TOTAL);
  })();

  // ============================================================
  // 슬라이드 14: Content - 핵심 아이디어: 3계층
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '핵심 아이디어: 세 가지 기술이 각자 잘하는 일을 분담한다');

    slide.addText([
      { text: 'LLM(대규모 언어 모델): "어떤 파라미터를 왜 조정해야 하는지" 판단하고 설명', options: { bullet: true, indentLevel: 0 } },
      { text: '전통 ML/물리 모델: "얼마나 조정할지" 구체적 수치를 계산', options: { bullet: true, indentLevel: 0 } },
      { text: '온톨로지/지식그래프: "조정이 안전 범위 내인지" 검증하고, 지식을 축적', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 2.0,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 10, valign: 'top'
    });

    // 하단 강조
    slide.addShape('roundRect', {
      x: 0.6, y: 4.2, w: 12.13, h: 2.3,
      rectRadius: 0.1, fill: { color: COLORS.bg_secondary }
    });

    slide.addText('왜 이렇게 분리하는가?', {
      x: 0.9, y: 4.3, w: 5, h: 0.4,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });

    slide.addText([
      { text: 'LLM은 비정형 문서(FMEA, 유지보수 기록)를 읽고 추론하는 데 강하지만, 수치 정밀 계산은 구조적으로 취약 (ACL 2025)', options: { bullet: true, indentLevel: 0 } },
      { text: '전통 ML은 수치 정밀도와 결정론적 일관성에서 우위', options: { bullet: true, indentLevel: 0 } },
      { text: '온톨로지는 추론 경로의 감사 추적과 안전 보장에 필수', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.9, y: 4.8, w: 11.53, h: 1.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4, paraSpaceAfter: 4, valign: 'top'
    });

    addPageNumber(slide, 14, TOTAL);
  })();

  // ============================================================
  // 슬라이드 15: CardGrid 1x3 - 세 계층의 역할 분담
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '세 계층의 역할 분담');

    // 1x3: (12.13 - 0.3*2) / 3 = 3.843
    var cardW = 3.843;
    var cardH = 4.2;
    var gap = 0.3;
    var cardY = 1.8;

    var cards = [
      {
        title: 'AI 에이전트 (LLM)',
        body: '핵심 질문: "어떤 파라미터를 왜 조정?"'
          + '\n\n\u2022 지식그래프 질의로 유사 사례 탐색'
          + '\n\u2022 원인 가설 생성 및 순위화'
          + '\n\u2022 자연어 보고서 작성'
          + '\n\u2022 비정형 문서(FMEA, 엔지니어 노트) 활용',
        color: COLORS.accent_blue
      },
      {
        title: '전통 ML / 물리 모델',
        body: '핵심 질문: "얼마나 조정?"'
          + '\n\n\u2022 파라미터 최적화 수치 계산'
          + '\n\u2022 시뮬레이션 기반 예측'
          + '\n\u2022 R2R 보정 모델 연동'
          + '\n\u2022 결정론적 일관성 보장',
        color: COLORS.accent_cyan
      },
      {
        title: '지식 사전 (온톨로지/KG)',
        body: '핵심 질문: "안전 범위 내인가?"'
          + '\n\n\u2022 불량-원인-파라미터 관계 저장'
          + '\n\u2022 안전 제약 조건 검증'
          + '\n\u2022 분석 이력 축적'
          + '\n\u2022 추론 경로 감사 추적',
        color: COLORS.accent_yellow
      }
    ];

    cards.forEach(function(card, i) {
      addCard(slide, {
        x: 0.6 + i * (cardW + gap),
        y: cardY,
        w: cardW,
        h: cardH,
        title: card.title,
        body: card.body,
        accentColor: card.color
      });
    });

    addPageNumber(slide, 15, TOTAL);
  })();

  // ============================================================
  // 슬라이드 16: Content - 전체 흐름
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '전체 흐름: 불량 감지부터 설비 적용까지');

    // 10단계 흐름을 2열 5행으로 배치
    var steps = [
      { num: '1', label: '불량 감지', desc: 'SPC/FDC가 이상 신호 발행' },
      { num: '2', label: '지식 탐색', desc: '온톨로지/KG에서 유사 불량, 원인 후보 조회' },
      { num: '3', label: 'AI 판단', desc: 'LLM이 원인 가설 순위화, 조정할 파라미터 결정' },
      { num: '4', label: 'ML 계산', desc: '전통 ML/물리 모델이 구체적 수치 산출' },
      { num: '5', label: '안전 검증', desc: '온톨로지가 파라미터 허용 범위 확인' },
      { num: '6', label: '보고서 생성', desc: 'LLM이 근거, 변경 diff, 영향 범위 정리' },
      { num: '7', label: '사람 승인', desc: '위험도별로 자동/수동 분기' },
      { num: '8', label: '설비 전달', desc: 'OPC UA / REST API로 레시피 다운로드' },
      { num: '9', label: '결과 모니터링', desc: '적용 후 품질 데이터 추적' },
      { num: '10', label: '지식 축적', desc: '결과를 KG에 피드백하여 시스템 학습' }
    ];

    var colW = 5.865;
    var colGap = 0.4;
    var startY = 1.7;
    var rowH = 0.93;

    steps.forEach(function(step, i) {
      var col = i < 5 ? 0 : 1;
      var row = i < 5 ? i : i - 5;
      var x = 0.6 + col * (colW + colGap);
      var y = startY + row * rowH;

      // 번호 원형
      slide.addShape('ellipse', {
        x: x, y: y + 0.12, w: 0.4, h: 0.4,
        fill: { color: COLORS.accent_blue }
      });
      slide.addText(step.num, {
        x: x, y: y + 0.12, w: 0.4, h: 0.4,
        fontSize: 13, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: 'FFFFFF', align: 'center', valign: 'middle'
      });

      // 라벨
      slide.addText(step.label, {
        x: x + 0.5, y: y + 0.02, w: 1.8, h: 0.35,
        fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_primary, valign: 'middle'
      });

      // 설명
      slide.addText(step.desc, {
        x: x + 0.5, y: y + 0.37, w: colW - 0.6, h: 0.4,
        fontSize: 12, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary, valign: 'top',
        lineSpacingMultiple: 1.2
      });
    });

    addPageNumber(slide, 16, TOTAL);
  })();

  // ============================================================
  // 슬라이드 17: Content - Brownfield 전제
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '이 시스템은 기존을 대체하지 않고, 그 위에 올라간다');

    // 3계층 스택 다이어그램
    var layers = [
      { label: '제안 시스템 (지능형 보조 계층)', sub: '온톨로지/KG + LLM 에이전트 + 전통 ML', color: COLORS.accent_blue, tag: '새로 추가' },
      { label: '기존 APC/R2R 시스템', sub: 'PID/R2R 컨트롤러, SPC, FDC', color: COLORS.accent_cyan, tag: '기존 유지' },
      { label: '설비 (PLC/DCS)', sub: '물리적 장비와 센서', color: COLORS.text_tertiary, tag: '기존 유지' }
    ];

    var layerH = 1.3;
    var layerW = 8.0;
    var startX = 1.5;
    var startY = 2.0;

    layers.forEach(function(layer, i) {
      var y = startY + i * (layerH + 0.2);

      slide.addShape('roundRect', {
        x: startX, y: y, w: layerW, h: layerH,
        rectRadius: 0.08, fill: { color: layer.color }, transparency: 15
      });

      slide.addText(layer.label, {
        x: startX + 0.3, y: y + 0.15, w: layerW - 0.6, h: 0.45,
        fontSize: 16, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_primary
      });

      slide.addText(layer.sub, {
        x: startX + 0.3, y: y + 0.6, w: layerW - 0.6, h: 0.45,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary
      });

      // 태그
      slide.addShape('roundRect', {
        x: startX + layerW + 0.3, y: y + 0.35, w: 1.8, h: 0.45,
        rectRadius: 0.06,
        fill: { color: i === 0 ? COLORS.accent_blue : COLORS.bg_secondary }
      });
      slide.addText(layer.tag, {
        x: startX + layerW + 0.3, y: y + 0.35, w: 1.8, h: 0.45,
        fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: i === 0 ? 'FFFFFF' : COLORS.text_secondary,
        align: 'center', valign: 'middle'
      });

      // 화살표 (마지막 제외)
      if (i < layers.length - 1) {
        slide.addText('\u25BC', {
          x: startX + layerW / 2 - 0.3, y: y + layerH, w: 0.6, h: 0.2,
          fontSize: 12, color: COLORS.text_tertiary, align: 'center'
        });
      }
    });

    // 하단 설명
    slide.addText('Brownfield 전제: 기존 인프라를 걷어내지 않고, 그 위에 보조/추천 계층으로 추가한다', {
      x: 0.6, y: 6.2, w: 12.13, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    addPageNumber(slide, 17, TOTAL);
  })();

  // ============================================================
  // 슬라이드 18: Content - AI 에이전트들의 역할 분담
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, 'AI 에이전트들의 역할 분담');

    var headers = ['에이전트', '역할', '사용 도구'];
    var dataRows = [
      [
        '오케스트레이터',
        '불량 이벤트 분류, 에이전트 호출 조율, 결과를 승인 단계로 전달',
        '라우팅 로직, 상태 관리'
      ],
      [
        '분석 에이전트',
        'KG 질의로 유사 불량 탐색, 통계 분석으로 원인 후보 순위화',
        'KG 질의, SPC 분석, 상관분석'
      ],
      [
        '레시피 생성',
        '파라미터 조정안 생성, 기존 레시피와의 차이(diff) 산출',
        '레시피 DB 조회, 시뮬레이션'
      ],
      [
        '검증 에이전트',
        '제안된 변경이 물리적/공정적 제약을 위반하지 않는지 확인',
        '공정 시뮬레이터, KG 제약 질의'
      ],
      [
        '보고 에이전트',
        '분석 과정과 결론을 사람이 읽을 수 있는 보고서로 정리',
        '템플릿 렌더링, 차트 생성'
      ],
      [
        '이력 학습',
        '승인/거부 결과와 적용 후 품질 데이터를 KG에 피드백',
        'KG 쓰기, 모델 업데이트'
      ]
    ];

    addStyledTable(slide, headers, dataRows, {
      y: 1.8, w: 12.13,
      colW: [2.2, 5.5, 4.43],
      rowH: [0.4, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7]
    });

    addPageNumber(slide, 18, TOTAL);
  })();

  // ============================================================
  // 슬라이드 19: Content - 위험도별 분기
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '사람이 반드시 확인하는 구간: 위험도별 분기');

    var headers = ['위험도', '판단 기준', '처리 방식'];
    var dataRows = [
      [
        { text: 'Critical', options: { color: COLORS.accent_red, bold: true } },
        '안전 관련 파라미터 변경\n설비 손상 가능성',
        '반드시 수동 승인\n+ 상위 관리자 에스컬레이션'
      ],
      [
        { text: 'Major', options: { color: COLORS.accent_yellow, bold: true } },
        '품질에 직접 영향\n고가 원자재 관련',
        '수동 승인 필수'
      ],
      [
        { text: 'Minor', options: { color: COLORS.accent_cyan, bold: true } },
        '미세 조정\n과거 승인 이력 있는 패턴',
        '조건부 자동 승인 가능\n(동일 패턴 3회 이상 승인 이력 시)'
      ]
    ];

    addStyledTable(slide, headers, dataRows, {
      y: 1.8, w: 12.13,
      colW: [2.0, 4.5, 5.63],
      rowH: [0.45, 1.1, 1.1, 1.1]
    });

    // 하단 주의 사항
    slide.addShape('roundRect', {
      x: 0.6, y: 5.5, w: 12.13, h: 1.0,
      rectRadius: 0.08, fill: { color: 'FFF8E1' },
      line: { color: COLORS.accent_yellow, width: 1 }
    });

    slide.addText('자동 승인은 Minor 등급에 한해, 동일 패턴 3회 이상 승인 이력 + 변경 폭 임계값 이내 + 검증 통과일 때만 허용. 자동 승인 후 48시간 이내 결과 모니터링 필수.', {
      x: 0.9, y: 5.6, w: 11.53, h: 0.8,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.3, valign: 'middle'
    });

    addPageNumber(slide, 19, TOTAL);
  })();

  // ============================================================
  // 슬라이드 20: Content - 승인 화면 구성 요소
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '승인 화면에는 무엇이 보여야 하는가');

    var COL_W = 5.865;
    var COL_GAP = 0.4;
    var COL_LEFT_X = 0.6;
    var COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP; // 6.865

    // 좌측: 필수 정보 목록
    slide.addText('승인 화면 필수 정보', {
      x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.4,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });

    slide.addText([
      { text: '불량 요약: 유형, 심각도, 감지 시각, 영향 제품', options: { bullet: true, indentLevel: 0 } },
      { text: '원인 분석: 후보 원인 순위와 확신도 (0~1)', options: { bullet: true, indentLevel: 0 } },
      { text: '레시피 변경 diff: 파라미터별 현재값 \u2192 제안값', options: { bullet: true, indentLevel: 0 } },
      { text: '영향 범위: 대상 설비, 영향 제품, 예상 효과', options: { bullet: true, indentLevel: 0 } },
      { text: '검증 결과: 파라미터 범위, 인접 공정 영향, 과거 유사 조정 이력', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: COL_LEFT_X, y: 2.3, w: COL_W, h: 3.5,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 6, valign: 'top'
    });

    // 우측: 레시피 diff 예시 테이블
    slide.addText('레시피 변경 diff 예시', {
      x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.4,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.text_primary
    });

    var tblHeaders = ['파라미터', '현재값', '제안값', '허용범위'];
    var tblRows = [
      ['Zone3 온도', '260\u00B0C', '248\u00B0C', '230~270'],
      ['컨베이어 속도', '0.8 m/min', '0.7 m/min', '0.5~1.2'],
      ['가스 유량', '150 sccm', '145 sccm', '120~180']
    ];

    addStyledTable(slide, tblHeaders, tblRows, {
      x: COL_RIGHT_X, y: 2.3, w: COL_W,
      colW: [1.6, 1.2, 1.2, 1.2],
      rowH: [0.35, 0.4, 0.4, 0.4]
    });

    // 하단: 버튼 영역 시각화
    slide.addShape('roundRect', {
      x: 3.5, y: 5.8, w: 2.0, h: 0.6,
      rectRadius: 0.06, fill: { color: COLORS.accent_cyan }
    });
    slide.addText('승인', {
      x: 3.5, y: 5.8, w: 2.0, h: 0.6,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addShape('roundRect', {
      x: 5.7, y: 5.8, w: 2.0, h: 0.6,
      rectRadius: 0.06, fill: { color: COLORS.accent_yellow }
    });
    slide.addText('수정 후 승인', {
      x: 5.7, y: 5.8, w: 2.0, h: 0.6,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addShape('roundRect', {
      x: 7.9, y: 5.8, w: 2.0, h: 0.6,
      rectRadius: 0.06, fill: { color: COLORS.accent_red }
    });
    slide.addText('거부', {
      x: 7.9, y: 5.8, w: 2.0, h: 0.6,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    addPageNumber(slide, 20, TOTAL);
  })();

  // ============================================================
  // 슬라이드 21: Section - 03
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });

    slide.addText('03', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.accent_cyan, align: 'center'
    });

    slide.addText('불량의 원인을 찾으려면\n\'지식의 지도\'가 필요하다', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.text_primary, lineSpacingMultiple: 1.1
    });

    slide.addText('불량-원인-파라미터 관계를 컴퓨터가 읽을 수 있도록\n명시적으로 정리하는 온톨로지와 지식그래프', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });

    addPageNumber(slide, 21, TOTAL);
  })();

  // ============================================================
  // 슬라이드 22: Content - 온톨로지/KG 쉽게 설명
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '불량-원인-파라미터의 관계를 컴퓨터가 읽을 수 있게 정리한다');

    slide.addText([
      { text: '온톨로지: 개념과 관계를 정의하는 "사전". 예) "불량"에는 "근본 원인"이 있고, 원인에는 "관련 파라미터"가 있다', options: { bullet: true, indentLevel: 0 } },
      { text: '지식그래프(KG): 그 사전에 실제 데이터를 채운 것. 예) "표면 기포" \u2192 "온도 과다" \u2192 "Zone3 온도"', options: { bullet: true, indentLevel: 0 } },
      { text: '왜 필요한가: AI가 과거 불량의 원인과 해결 방법을 빠르게 찾을 수 있게 해줌', options: { bullet: true, indentLevel: 0 } },
      { text: '단순 검색(RAG) 대비 장점: 관계를 따라가며 추론 가능, 감사 추적 가능, 안전 제약 검증 가능', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 3.2,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 관계 시각화: 간단한 체인
    slide.addShape('roundRect', {
      x: 0.6, y: 5.3, w: 12.13, h: 1.3,
      rectRadius: 0.1, fill: { color: COLORS.bg_secondary }
    });

    var chainItems = ['불량(Defect)', '원인(RootCause)', '파라미터(Parameter)', '레시피(Recipe)'];
    var chainColors = [COLORS.accent_red, COLORS.accent_yellow, COLORS.accent_blue, COLORS.accent_cyan];

    chainItems.forEach(function(item, i) {
      var x = 1.0 + i * 2.9;
      slide.addShape('roundRect', {
        x: x, y: 5.5, w: 2.3, h: 0.7,
        rectRadius: 0.06, fill: { color: chainColors[i] }
      });
      slide.addText(item, {
        x: x, y: 5.5, w: 2.3, h: 0.7,
        fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: 'FFFFFF', align: 'center', valign: 'middle'
      });

      if (i < chainItems.length - 1) {
        slide.addText('\u2192', {
          x: x + 2.3, y: 5.5, w: 0.6, h: 0.7,
          fontSize: 16, color: COLORS.text_tertiary, align: 'center', valign: 'middle'
        });
      }
    });

    addPageNumber(slide, 22, TOTAL);
  })();

  // ============================================================
  // 슬라이드 23: Content - MASON PPR 확장
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '제품-공정-자원 구조 위에 불량과 레시피 개념을 확장한다', 'MASON PPR (제조 온톨로지) 확장');

    // 3열 카드: Product, Process, Resource
    var cardW = 3.843;
    var gap = 0.3;
    var cardY = 1.9;
    var cardH = 4.5;

    var pprCards = [
      {
        title: 'Product (제품/개체)',
        original: '기존: 제품 정의',
        extended: [
          '+ Defect (불량 현상)',
          '+ QualitySpec (품질 규격)',
          '+ Symptom (증상)'
        ],
        color: COLORS.accent_blue
      },
      {
        title: 'Process (공정/작업)',
        original: '기존: 공정 단계 정의',
        extended: [
          '+ Recipe (레시피)',
          '+ Parameter (공정 파라미터)',
          '+ Step (공정 단계)',
          '+ FMEA (고장 모드 분석)'
        ],
        color: COLORS.accent_cyan
      },
      {
        title: 'Resource (자원/설비)',
        original: '기존: 설비/자원 정의',
        extended: [
          '+ Sensor (센서)',
          '+ Setting (설정값)',
          '+ CalibrationStatus (교정 상태)'
        ],
        color: COLORS.accent_yellow
      }
    ];

    pprCards.forEach(function(card, i) {
      var x = 0.6 + i * (cardW + gap);

      // 카드 배경
      slide.addShape('roundRect', {
        x: x, y: cardY, w: cardW, h: cardH,
        rectRadius: 0.1, fill: { color: 'FFFFFF' },
        shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 }
      });

      // 상단 악센트
      slide.addShape('rect', {
        x: x + 0.02, y: cardY, w: cardW - 0.04, h: 0.06,
        fill: { color: card.color }
      });

      // 제목
      slide.addText(card.title, {
        x: x + 0.2, y: cardY + 0.2, w: cardW - 0.4, h: 0.4,
        fontSize: 15, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: COLORS.text_primary
      });

      // 기존
      slide.addText(card.original, {
        x: x + 0.2, y: cardY + 0.7, w: cardW - 0.4, h: 0.35,
        fontSize: 12, fontFace: FONTS.body.fontFace,
        color: COLORS.text_tertiary
      });

      // 구분선
      slide.addShape('line', {
        x: x + 0.2, y: cardY + 1.1, w: cardW - 0.4, h: 0,
        line: { color: 'E2E8F0', width: 0.5 }
      });

      // 확장 항목
      slide.addText('확장 개념:', {
        x: x + 0.2, y: cardY + 1.2, w: cardW - 0.4, h: 0.3,
        fontSize: 12, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: card.color
      });

      slide.addText(card.extended.map(function(item) {
        return { text: item, options: { bullet: true, indentLevel: 0 } };
      }), {
        x: x + 0.2, y: cardY + 1.5, w: cardW - 0.4, h: cardH - 1.9,
        fontSize: 13, fontFace: FONTS.body.fontFace,
        color: COLORS.text_secondary,
        lineSpacingMultiple: 1.5, paraSpaceAfter: 4, valign: 'top'
      });
    });

    addPageNumber(slide, 23, TOTAL);
  })();

  // ============================================================
  // 슬라이드 24: Table - 핵심 연결 관계 7가지
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '지식 지도의 핵심 연결 관계 7가지');

    var headers = ['관계 이름', '출발', '도착', '의미'];
    var dataRows = [
      ['hasRootCause', '불량(Defect)', '근본원인(RootCause)', '이 불량의 원인은 무엇인가'],
      ['detectedIn', '불량(Defect)', '공정(Process)', '어떤 공정에서 발견되었는가'],
      ['causedByParam', '근본원인', '파라미터(Parameter)', '어떤 파라미터가 원인인가'],
      ['relatedToEquip', '근본원인', '설비(Equipment)', '어떤 설비와 관련되는가'],
      ['mitigatedBy', '근본원인', '레시피(Recipe)', '어떤 레시피 조정으로 해결하는가'],
      ['belongsToRecipe', '파라미터', '레시피(Recipe)', '이 파라미터는 어떤 레시피에 속하는가'],
      ['analyzedDefect', '분석기록', '불량(Defect)', '이 분석은 어떤 불량을 다뤘는가']
    ];

    addStyledTable(slide, headers, dataRows, {
      y: 1.8, w: 12.13,
      colW: [2.5, 2.3, 2.8, 4.53],
      rowH: [0.4, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55]
    });

    addPageNumber(slide, 24, TOTAL);
  })();

  // ============================================================
  // 슬라이드 25: Content - 콜드 스타트 문제
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '지식 지도를 처음 만드는 것이 가장 어렵다');

    slide.addText([
      { text: '콜드 스타트 문제: 지식그래프가 비어 있으면 AI가 분석할 근거가 없음', options: { bullet: true, indentLevel: 0 } },
      { text: '해결 방법: FMEA(고장 모드 영향 분석) 문서에서 LLM으로 관계를 자동 추출', options: { bullet: true, indentLevel: 0 } },
      { text: '실제 연구 결과: 온톨로지 기반 LLM 추출이 단순 RAG 대비 F1 점수 약 2배 (0.267 \u2192 0.523)', options: { bullet: true, indentLevel: 0 } },
      { text: '출처: arXiv 2510.15428 (자동차 센서 조립 도메인, 타 도메인 검증 필요)', options: { bullet: true, indentLevel: 0 } },
      { text: '자동 추출 후 반드시 도메인 전문가 검증 필요 (추출 오류가 지식 기반 자체를 오염시킬 수 있음)', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 4.8,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    addPageNumber(slide, 25, TOTAL);
  })();

  // ============================================================
  // 슬라이드 26: Content - 지식 축적 선순환
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, '지식은 쌓일수록 강해진다: 매 분석이 새로운 지식이 된다');

    slide.addText([
      { text: '이력 학습 에이전트가 모든 분석 결과를 지식그래프에 피드백', options: { bullet: true, indentLevel: 0 } },
      { text: '승인된 레시피 변경과 적용 후 품질 데이터가 함께 기록됨', options: { bullet: true, indentLevel: 0 } },
      { text: '거부된 제안도 기록되어 "왜 거부되었는지" 학습', options: { bullet: true, indentLevel: 0 } },
      { text: '시간이 갈수록 유사 사례가 쌓이고, AI의 판단 정확도가 향상', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: 0.6, y: 1.8, w: 12.13, h: 2.8,
      fontSize: 17, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 선순환 다이어그램
    var cycleItems = [
      { label: '불량 발생', color: COLORS.accent_red },
      { label: 'AI 분석', color: COLORS.accent_blue },
      { label: '레시피 제안', color: COLORS.accent_cyan },
      { label: '사람 승인/거부', color: COLORS.accent_yellow },
      { label: '결과 피드백', color: COLORS.accent_purple },
      { label: 'KG 지식 축적', color: COLORS.accent_blue }
    ];

    var boxW = 1.7;
    var boxH = 0.6;
    var startX = 0.8;
    var boxY = 5.2;
    var boxGap = 0.2;

    cycleItems.forEach(function(item, i) {
      var x = startX + i * (boxW + boxGap);

      slide.addShape('roundRect', {
        x: x, y: boxY, w: boxW, h: boxH,
        rectRadius: 0.06, fill: { color: item.color }
      });
      slide.addText(item.label, {
        x: x, y: boxY, w: boxW, h: boxH,
        fontSize: 11, fontFace: FONTS.subtitle.fontFace, bold: true,
        color: 'FFFFFF', align: 'center', valign: 'middle'
      });

      if (i < cycleItems.length - 1) {
        slide.addText('\u2192', {
          x: x + boxW, y: boxY, w: boxGap, h: boxH,
          fontSize: 12, color: COLORS.text_tertiary, align: 'center', valign: 'middle'
        });
      }
    });

    // 순환 설명
    slide.addText('\u21BA  순환: 마지막의 축적된 지식이 다음 분석의 정확도를 높인다', {
      x: 0.6, y: 6.0, w: 12.13, h: 0.5,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_tertiary, align: 'center'
    });

    addPageNumber(slide, 26, TOTAL);
  })();

  // ============================================================
  // 슬라이드 27: Section - 04
  // ============================================================
  (function() {
    const slide = pptx.addSlide();

    slide.addShape('rect', { x: 0, y: 0, w: 5.33, h: 7.5, fill: { color: COLORS.bg_dark } });

    slide.addText('04', {
      x: 1.0, y: 2.5, w: 3.33, h: 1.5,
      fontSize: 72, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.accent_cyan, align: 'center'
    });

    slide.addText('AI는 \'수치 결정자\'가\n아니라 \'지식 통역사\'다', {
      x: 6.0, y: 2.5, w: 6.73, h: 1.2,
      fontSize: 34, fontFace: FONTS.title.fontFace, bold: true,
      color: COLORS.text_primary, lineSpacingMultiple: 1.1
    });

    slide.addText('LLM의 진짜 가치는 비정형 문서를 읽고, 지식과 연결하며,\n사람에게 설명하는 역할에 있다', {
      x: 6.0, y: 3.9, w: 6.73, h: 1.0,
      fontSize: 16, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.4
    });

    addPageNumber(slide, 27, TOTAL);
  })();

  // ============================================================
  // 슬라이드 28: TwoColumn - AI가 잘하는 일 vs 못하는 일
  // ============================================================
  (function() {
    const slide = pptx.addSlide();
    addTitleBar(slide, 'AI가 잘하는 일 vs 못하는 일');

    var COL_W = 5.865;
    var COL_GAP = 0.4;
    var COL_LEFT_X = 0.6;
    var COL_RIGHT_X = COL_LEFT_X + COL_W + COL_GAP; // 6.865

    // 좌측 헤더
    slide.addShape('roundRect', {
      x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.5,
      rectRadius: 0.06, fill: { color: COLORS.accent_cyan }
    });
    slide.addText('AI(LLM)가 잘하는 일', {
      x: COL_LEFT_X, y: 1.8, w: COL_W, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addText([
      { text: '패턴 인식: 과거 불량 사례에서 유사 패턴 탐지', options: { bullet: true, indentLevel: 0 } },
      { text: '비정형 문서 해석: FMEA, 유지보수 기록, 엔지니어 노트를 읽고 활용', options: { bullet: true, indentLevel: 0 } },
      { text: '유사 사례 탐색: KG에서 관련 사례를 찾아 연결', options: { bullet: true, indentLevel: 0 } },
      { text: '자연어 설명 생성: 분석 결과를 사람이 이해할 수 있는 보고서로 작성', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: COL_LEFT_X, y: 2.5, w: COL_W, h: 4.0,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 우측 헤더
    slide.addShape('roundRect', {
      x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.5,
      rectRadius: 0.06, fill: { color: COLORS.accent_red }
    });
    slide.addText('AI(LLM)가 못하는 일', {
      x: COL_RIGHT_X, y: 1.8, w: COL_W, h: 0.5,
      fontSize: 18, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: 'FFFFFF', align: 'center', valign: 'middle'
    });

    slide.addText([
      { text: '수치 정밀 계산: 수치 변동에 따라 정확도 급감 (ACL 2025 검증, 구조적 취약점)', options: { bullet: true, indentLevel: 0 } },
      { text: '결정론적 제어: 같은 입력에 다른 출력 가능 (비결정론적)', options: { bullet: true, indentLevel: 0 } },
      { text: '안전 보장: 환각(Hallucination)으로 그럴듯하지만 틀린 값을 자신 있게 제시', options: { bullet: true, indentLevel: 0 } },
      { text: '실시간 반응: 추론 시간이 길고 보장된 응답 시간 제공 불가', options: { bullet: true, indentLevel: 0 } }
    ], {
      x: COL_RIGHT_X, y: 2.5, w: COL_W, h: 4.0,
      fontSize: 15, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary,
      lineSpacingMultiple: 1.5, paraSpaceAfter: 8, valign: 'top'
    });

    // 하단 핵심 메시지
    slide.addShape('roundRect', {
      x: 0.6, y: 6.2, w: 12.13, h: 0.55,
      rectRadius: 0.06, fill: { color: COLORS.bg_secondary }
    });
    slide.addText('그래서 3계층으로 분리한다: LLM은 판단, ML은 수치 계산, 온톨로지는 안전 검증', {
      x: 0.9, y: 6.2, w: 11.53, h: 0.55,
      fontSize: 14, fontFace: FONTS.subtitle.fontFace, bold: true,
      color: COLORS.accent_blue, align: 'center', valign: 'middle'
    });

    addPageNumber(slide, 28, TOTAL);
  })();
};
