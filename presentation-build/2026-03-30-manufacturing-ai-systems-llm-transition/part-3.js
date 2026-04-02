// === Part 3 시작 ===

function slide22_section_judgment() {
  const slide = pptx.addSlide();

  // 좌 40% 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.33, h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { type: 'none' }
  });

  // 우 60% 밝은 배경
  slide.addShape('rect', {
    x: 5.33, y: 0, w: 8.0, h: 7.5,
    fill: { color: COLORS.bg_primary },
    line: { type: 'none' }
  });

  // 좌측 섹션 번호
  slide.addText('PART 4', {
    x: 0.4, y: 2.5, w: 4.5, h: 0.4,
    fontSize: 11, fontFace: FONTS.caption.fontFace,
    color: COLORS.accent_cyan, bold: true
  });

  // 좌측 큰 제목
  slide.addText('판단', {
    x: 0.4, y: 3.0, w: 4.5, h: 0.8,
    fontSize: 40, fontFace: FONTS.title.fontFace,
    color: COLORS.text_on_dark, bold: true
  });

  slide.addText('우리 공정에 LLM을\n적용해야 하는가', {
    x: 0.4, y: 3.8, w: 4.5, h: 1.5,
    fontSize: 18, fontFace: FONTS.subtitle.fontFace,
    color: COLORS.text_on_dark, bold: false
  });

  // 우측 부제목
  slide.addText('전환 필요성 판단과 의사결정 프레임워크', {
    x: 5.73, y: 3.2, w: 7.2, h: 1.0,
    fontSize: 22, fontFace: FONTS.subtitle.fontFace,
    color: COLORS.text_primary, bold: false
  });
}

function slide23_funnel_transition() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환 필요성 판단 깔때기');

  addFunnel(slide, [
    { label: '우리 공정에 AI가 있는가?' },
    { label: '기존 ML이 충분한가?' },
    { label: 'LLM 추가 실익이 있는가?' },
    { label: '어떤 레이어에 추가할 것인가?' },
    { label: '파일럿 대상 선정' }
  ]);

  addPageNumber(slide, 23, TOTAL_SLIDES);
}

function slide24_table_unnecessary() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '전환이 불필요한 5가지 영역');

  addStyledTable(
    slide,
    ['영역', '이유', '기존 대안'],
    [
      ['단일 파라미터 PID 튜닝', '기존 알고리즘이 이미 최적', 'PID/MPC'],
      ['수렴된 RL 반복 제어', 'LLM 추가 시 응답 지연만 증가', '기존 RL 유지'],
      ['고주파 센서 제어 (ms 단위)', 'LLM 추론 물리적 불가', '엣지 ML'],
      ['대량 제조 (마진 박)', 'LLM API 비용 수십~수백 배', '온프레미스 ML'],
      ['데이터 인프라 미확립', '68% 제조사 데이터 품질 문제', '데이터 정비 우선']
    ],
    { x: 0.6, y: 1.8, w: 12.13 }
  );

  addPageNumber(slide, 24, TOTAL_SLIDES);
}

function slide25_human_ai_responsibility() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '인간-AI 책임 분배를 먼저 설계하라');

  const cases = [
    {
      company: 'IMUBIT',
      desc: '오퍼레이터 개입 권한 유지',
      point: '"85%+ 참여율의 비결"',
      color: COLORS.accent_blue
    },
    {
      company: 'Lam Research',
      desc: 'Human-First, Computer-Last',
      point: '"엔지니어가 먼저, AI가 보조"',
      color: COLORS.accent_cyan
    },
    {
      company: 'Intel',
      desc: '엔지니어 최종 결정',
      point: '"자동 셧다운은 하되, RCA는 사람이"',
      color: COLORS.accent_purple
    }
  ];

  cases.forEach((c, i) => {
    const yPos = 1.85 + i * 1.3;

    // 좌측 accent 바
    slide.addShape('rect', {
      x: 0.6, y: yPos, w: 0.08, h: 1.0,
      fill: { color: c.color },
      line: { type: 'none' }
    });

    // 회사명
    slide.addText(c.company, {
      x: 0.85, y: yPos, w: 3.5, h: 0.4,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: c.color, bold: true
    });

    // 설명
    slide.addText(c.desc, {
      x: 0.85, y: yPos + 0.4, w: 5.5, h: 0.3,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary
    });

    // 포인트
    slide.addText(c.point, {
      x: 6.6, y: yPos + 0.2, w: 6.0, h: 0.5,
      fontSize: 12, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary, italic: true
    });
  });

  // 공통점 텍스트
  slide.addText('공통점: 기술 스택보다 운영 설계가 배포 성공 결정', {
    x: 0.6, y: 5.75, w: 12.13, h: 0.35,
    fontSize: 11, fontFace: FONTS.body.fontFace,
    color: COLORS.text_primary, bold: true
  });

  // 하단 정보 박스
  slide.addShape('rect', {
    x: 0.6, y: 6.2, w: 12.13, h: 0.85,
    fill: { color: 'EBF0FF' },
    line: { color: COLORS.accent_blue, w: 0.5 }
  });

  slide.addText(
    '의료 AI(CDSS)에서도 동일 패턴 — AI 추천 + 의사 최종 결정. 설명가능성과 책임귀속 법제화 진행 중',
    {
      x: 0.85, y: 6.3, w: 11.7, h: 0.65,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.accent_blue
    }
  );

  addPageNumber(slide, 25, TOTAL_SLIDES);
}

function slide26_matrix_domain() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '도메인 특화 vs 범용: 어디에 투자할 것인가');

  addMatrix(
    slide,
    [
      {
        position: 'TL',
        title: '위험 영역',
        body: '데이터 정비 우선\nAI 도입 시기상조'
      },
      {
        position: 'TR',
        title: '도메인 특화 AI',
        body: 'IMUBIT, TIGNIS형\n단기 최선'
      },
      {
        position: 'BL',
        title: '기존 자동화 충분',
        body: 'PLC/PID\n기존 솔루션'
      },
      {
        position: 'BR',
        title: '범용 AI 탐색',
        body: 'LLM 보조 도구\nSiemens Copilot형'
      }
    ],
    {
      xAxis: { label: '데이터 가용성', from: '부족', to: '풍부' },
      yAxis: { label: '공정 복잡도', from: '단순', to: '복합' }
    }
  );

  addPageNumber(slide, 26, TOTAL_SLIDES);
}

function slide27_table_reverse_decision() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '역방향 의사결정 가이드: 만약 X이면, Y를 하라');

  addStyledTable(
    slide,
    ['만약...', '그러면...'],
    [
      [
        'Siemens IFM이 2027년 Production-ready로 출시',
        '자체 개발 대신 Siemens 생태계 활용 검토'
      ],
      [
        'LLM 추론 지연이 100ms 이하로 감소',
        '실시간 제어 루프 내 LLM 배치 논의 시작'
      ],
      [
        'IEC 61508이 비결정론적 AI 수용 개정',
        '안전 필수 제조에서도 LLM 기반 제어 가능'
      ],
      [
        'SemiKong 등 도메인 LLM 독립 벤치마크 검증',
        '온프레미스 배포로 데이터 주권 해소'
      ],
      [
        '자동 온톨로지 생성 도구 성숙',
        '중소 제조사도 KG 기반 AI 접근 가능'
      ]
    ],
    { x: 0.6, y: 1.8, w: 12.13 }
  );

  addPageNumber(slide, 27, TOTAL_SLIDES);
}

function slide28_limitations() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '분석의 한계를 인식하라');

  const limits = [
    {
      num: '1',
      text: '공개 성공 사례 기반 — 실패 사례·도입 철회 사례 미포함 (생존자 편향)'
    },
    {
      num: '2',
      text: '도입 비용/TCO 미분석 — 라이선스, 컨설팅, 데이터 정비 비용 공개 자료 부족'
    },
    {
      num: '3',
      text: '중소 제조사 관점 부재 — 조사 대상이 모두 대기업 또는 대기업 대상 솔루션'
    },
    {
      num: '4',
      text: '일부 수치 독립 검증 미확인 — SemiKong(20~30% 단축)은 Meta 파트너사 홍보성 블로그 출처'
    }
  ];

  limits.forEach((item, i) => {
    const yPos = 1.85 + i * 1.05;

    // 번호 뱃지
    slide.addShape('ellipse', {
      x: 0.6, y: yPos + 0.05, w: 0.38, h: 0.38,
      fill: { color: COLORS.accent_red },
      line: { type: 'none' }
    });

    slide.addText(item.num, {
      x: 0.6, y: yPos + 0.05, w: 0.38, h: 0.38,
      fontSize: 13, fontFace: FONTS.body.fontFace,
      color: COLORS.text_on_dark, bold: true, align: 'center', valign: 'middle'
    });

    // 내용
    slide.addText(item.text, {
      x: 1.15, y: yPos, w: 11.2, h: 0.7,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, valign: 'middle'
    });
  });

  // 경고 박스
  slide.addShape('rect', {
    x: 0.6, y: 6.15, w: 12.13, h: 0.9,
    fill: { color: 'FFF0F0' },
    line: { color: COLORS.accent_red, w: 0.5 }
  });

  slide.addText(
    '이 보고서의 결론은 조건부입니다. 자사 공정 적용 시 독립 검증과 PoC를 반드시 선행하십시오.',
    {
      x: 0.85, y: 6.25, w: 11.7, h: 0.7,
      fontSize: 10, fontFace: FONTS.caption.fontFace,
      color: COLORS.accent_red, bold: true, valign: 'middle'
    }
  );

  addPageNumber(slide, 28, TOTAL_SLIDES);
}

function slide29_kpi_messages() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4가지 핵심 메시지 재확인');

  addCard(slide, {
    x: 0.6, y: 1.8, w: 5.915, h: 2.45,
    title: 'M1',
    body: 'LLM은 제어 루프 밖에 있다 — 모든 기업에서',
    accentColor: COLORS.accent_blue
  });

  addCard(slide, {
    x: 6.815, y: 1.8, w: 5.915, h: 2.45,
    title: 'M2',
    body: '현실적 경로는 레이어 추가와 하이브리드 2가지',
    accentColor: COLORS.accent_cyan
  });

  addCard(slide, {
    x: 0.6, y: 4.55, w: 5.915, h: 2.45,
    title: 'M3',
    body: '도메인 특화가 범용보다 유효하다',
    accentColor: COLORS.accent_yellow
  });

  addCard(slide, {
    x: 6.815, y: 4.55, w: 5.915, h: 2.45,
    title: 'M4',
    body: '인간 통제 설계가 기술 선정보다 중요하다',
    accentColor: COLORS.accent_purple
  });

  addPageNumber(slide, 29, TOTAL_SLIDES);
}

function slide30_followup_questions() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '후속 탐색 질문 3가지');

  const questions = [
    {
      num: '1',
      title: '레이저 가공 도메인에서 적용 가능한 접근법은?',
      desc: '반도체/정유 중심 조사, 레이저 고유 특성(초고속 열적 변화, 광학 파라미터) 별도 조사 필요',
      color: COLORS.accent_blue
    },
    {
      num: '2',
      title: '온프레미스 LLM의 실질적 성능 트레이드오프는?',
      desc: 'Llama 70B급 공장 엣지 운영 시 추론 품질/속도',
      color: COLORS.accent_cyan
    },
    {
      num: '3',
      title: '기존 APC/R2R이 해결하지 못하는 구체적 문제는?',
      desc: 'LLM/KG 전환 실익의 전제조건',
      color: COLORS.accent_purple
    }
  ];

  questions.forEach((q, i) => {
    const yPos = 1.9 + i * 1.6;

    // 번호 뱃지
    slide.addShape('rect', {
      x: 0.6, y: yPos, w: 0.45, h: 0.45,
      fill: { color: q.color },
      line: { type: 'none' }
    });

    slide.addText(q.num, {
      x: 0.6, y: yPos, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONTS.kpi.fontFace,
      color: COLORS.text_on_dark, bold: true, align: 'center', valign: 'middle'
    });

    // 제목
    slide.addText(q.title, {
      x: 1.25, y: yPos, w: 11.1, h: 0.5,
      fontSize: 14, fontFace: FONTS.body.fontFace,
      color: COLORS.text_primary, bold: true
    });

    // 설명
    slide.addText(q.desc, {
      x: 1.25, y: yPos + 0.55, w: 11.1, h: 0.6,
      fontSize: 11, fontFace: FONTS.body.fontFace,
      color: COLORS.text_secondary
    });

    // 구분선 (마지막 제외)
    if (i < questions.length - 1) {
      slide.addShape('rect', {
        x: 0.6, y: yPos + 1.35, w: 12.13, h: 0.02,
        fill: { color: COLORS.bg_secondary },
        line: { type: 'none' }
      });
    }
  });

  addPageNumber(slide, 30, TOTAL_SLIDES);
}

function slide31_closing() {
  const slide = pptx.addSlide();

  // 풀블리드 다크 배경
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: COLORS.bg_dark },
    line: { type: 'none' }
  });

  // 장식용 accent 라인
  slide.addShape('rect', {
    x: 0, y: 3.5, w: 13.33, h: 0.04,
    fill: { color: COLORS.accent_cyan },
    line: { type: 'none' }
  });

  // 중앙 큰 텍스트
  slide.addText('제조 AI의 미래는 교체가 아니라 통합이다', {
    x: 0.8, y: 2.2, w: 11.73, h: 1.1,
    fontSize: 34, fontFace: FONTS.title.fontFace,
    color: COLORS.text_on_dark, bold: true, align: 'center'
  });

  // 부제
  slide.addText(
    '어떤 공정 레이어에서, 어떤 조건하에 LLM이 명확한 가치를 제공하는가 — 이것이 진짜 질문',
    {
      x: 0.8, y: 3.7, w: 11.73, h: 0.9,
      fontSize: 16, fontFace: FONTS.subtitle.fontFace,
      color: COLORS.text_secondary, align: 'center'
    }
  );

  // 하단 날짜/출처
  slide.addText('2026-03-30 | 7개 기업 비교 분석 리서치', {
    x: 0.8, y: 6.6, w: 11.73, h: 0.4,
    fontSize: 10, fontFace: FONTS.caption.fontFace,
    color: COLORS.text_tertiary, align: 'center'
  });
}

// === Part 3 끝 ===
