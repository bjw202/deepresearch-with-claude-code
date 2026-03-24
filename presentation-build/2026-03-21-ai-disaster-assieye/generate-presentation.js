'use strict';
const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const COLORS = {
  bg_dark: '1A1F36',
  bg_secondary: 'F7F9FC',
  bg_white: 'FFFFFF',
  text_primary: '1A1F36',
  text_secondary: '4A5568',
  text_tertiary: '718096',
  text_on_dark: 'FFFFFF',
  accent_blue: '4A7BF7',
  accent_cyan: '00D4AA',
  accent_gold: 'FFB020',
  accent_red: 'FF6B6B',
  border: 'E2E8F0',
};

const FONTS = {
  title:    { fontFace: 'Pretendard ExtraBold', bold: true },
  subtitle: { fontFace: 'Pretendard SemiBold', bold: true },
  body:     { fontFace: 'Pretendard', bold: false },
  caption:  { fontFace: 'Pretendard Light', bold: false },
  kpi:      { fontFace: 'Pretendard Black', bold: true },
};

const TABLE_STYLE = {
  header:  { bold: true, fill: { color: '1A1F36' }, color: 'FFFFFF', fontFace: 'Pretendard', fontSize: 11, align: 'center', valign: 'middle' },
  cell:    { fontFace: 'Pretendard', fontSize: 11, color: '4A5568', valign: 'middle' },
  cellAlt: { fontFace: 'Pretendard', fontSize: 11, color: '4A5568', fill: { color: 'F7F9FC' }, valign: 'middle' },
};
const TABLE_OPTIONS = { x: 0.6, y: 1.8, w: 12.13, border: { type: 'solid', pt: 0.5, color: 'E2E8F0' }, margin: [5,8,5,8] };

function addTitleBar(slide, title, subtitle) {
  subtitle = subtitle || '';
  slide.addShape('rect', { x:0.6, y:0.5, w:1.2, h:0.06, fill:{color:'4A7BF7'} });
  slide.addText(title, { x:0.6, y:0.65, w:12.13, h:0.9, fontSize:26, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36', autoFit:true });
  if (subtitle) slide.addText(subtitle, { x:0.6, y:1.6, w:12.13, h:0.35, fontSize:14, fontFace:'Pretendard', color:'718096' });
}

function addStyledTable(slide, headers, dataRows, opts) {
  opts = opts || {};
  const rows = [];
  rows.push(headers.map(function(h) { return { text: h, options: Object.assign({}, TABLE_STYLE.header) }; }));
  dataRows.forEach(function(row, i) {
    const base = i % 2 === 1 ? TABLE_STYLE.cellAlt : TABLE_STYLE.cell;
    rows.push(row.map(function(cell) {
      if (typeof cell === 'string') return { text: cell, options: Object.assign({}, base) };
      return { text: cell.text, options: Object.assign({}, base, cell.options) };
    }));
  });
  slide.addTable(rows, Object.assign({}, TABLE_OPTIONS, opts));
}

function addCard(slide, cfg) {
  const x = cfg.x, y = cfg.y, w = cfg.w, h = cfg.h;
  const title = cfg.title, body = cfg.body, accentColor = cfg.accentColor || '4A7BF7';
  slide.addShape('roundRect', { x:x, y:y, w:w, h:h, rectRadius:0.1, fill:{color:'FFFFFF'}, shadow:{type:'outer',blur:6,offset:2,color:'000000',opacity:0.08} });
  slide.addShape('rect', { x:x+0.02, y:y, w:w-0.04, h:0.06, fill:{color:accentColor} });
  slide.addText(title, { x:x+0.2, y:y+0.18, w:w-0.4, h:0.35, fontSize:15, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36', autoFit:true });
  slide.addText(body,  { x:x+0.2, y:y+0.55, w:w-0.4, h:h-0.75, fontSize:12, fontFace:'Pretendard', color:'4A5568', lineSpacingMultiple:1.35, valign:'top', autoFit:true });
}

function addPageNum(slide, num) {
  slide.addText(num + ' / 45', { x:12.0, y:7.05, w:1.0, h:0.3, fontSize:9, fontFace:'Pretendard', color:'718096', align:'right' });
}

const CARD_2X2 = { w:5.915, h:2.45, positions:[{x:0.6,y:1.8},{x:6.815,y:1.8},{x:0.6,y:4.55},{x:6.815,y:4.55}] };
const CARD_2X3 = { w:3.843, h:2.45, positions:[{x:0.6,y:1.8},{x:4.743,y:1.8},{x:8.886,y:1.8},{x:0.6,y:4.55},{x:4.743,y:4.55},{x:8.886,y:4.55}] };
const COLORS_LIST = ['4A7BF7','00D4AA','FFB020','FF6B6B','8B5CF6','38BDF8'];

function addCodeBlock(slide, x, y, w, h, code, dark) {
  dark = dark !== false;
  const bgColor = dark ? '1E2433' : 'F7F9FC';
  const txtColor = dark ? 'E2E8F0' : '2D3748';
  slide.addShape('roundRect', { x:x, y:y, w:w, h:h, rectRadius:0.08, fill:{color:bgColor} });
  slide.addText(code, { x:x+0.18, y:y+0.15, w:w-0.36, h:h-0.3, fontSize:10, fontFace:'Courier New', color:txtColor, lineSpacingMultiple:1.4, valign:'top', autoFit:true });
}

function addSectionDivider(slide, num, title, desc) {
  slide.addShape('rect', { x:0, y:0, w:5.33, h:7.5, fill:{color:'1A1F36'} });
  slide.addShape('rect', { x:5.33, y:0, w:8.0, h:7.5, fill:{color:'F7F9FC'} });
  slide.addText(num, { x:0.5, y:1.5, w:4.33, h:2.0, fontSize:120, fontFace:'Pretendard ExtraBold', bold:true, color:'00D4AA', transparency:20, align:'center' });
  slide.addText(title, { x:5.73, y:2.0, w:7.2, h:1.5, fontSize:32, fontFace:'Pretendard ExtraBold', bold:true, color:'1A1F36', lineSpacingMultiple:1.2 });
  slide.addShape('rect', { x:5.73, y:3.7, w:1.5, h:0.06, fill:{color:'4A7BF7'} });
  slide.addText(desc, { x:5.73, y:3.9, w:7.2, h:1.5, fontSize:15, fontFace:'Pretendard', color:'4A5568', lineSpacingMultiple:1.5 });
}

// ─── SLIDE FUNCTIONS ──────────────────────────────────────────────────────────

function slide01_title() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x:0, y:0, w:13.33, h:7.5, fill:{color:'1A1F36'} });
  slide.addShape('rect', { x:1.5, y:2.2, w:1.5, h:0.06, fill:{color:'00D4AA'} });
  slide.addText('AI 에이전트 재난 대응 시스템\nAssiEye', {
    x:1.5, y:2.35, w:10.33, h:1.6, fontSize:40, fontFace:'Pretendard ExtraBold', bold:true,
    color:'FFFFFF', align:'center', lineSpacingMultiple:1.2
  });
  slide.addText('기술 분석 & 실전 개발 가이드', {
    x:1.5, y:4.1, w:10.33, h:0.5, fontSize:20, fontFace:'Pretendard SemiBold',
    color:'FFFFFF', transparency:30, align:'center'
  });
  const badges = ['사건 발생 6시간 만에 구현', 'Claude Code 4 에이전트', '오픈소스 기술 스택'];
  const badgeX = [1.2, 4.7, 8.2];
  badges.forEach(function(b, i) {
    slide.addShape('roundRect', { x:badgeX[i], y:4.9, w:3.0, h:0.42, rectRadius:0.08, fill:{color:'4A7BF7'} });
    slide.addText(b, { x:badgeX[i], y:4.9, w:3.0, h:0.42, fontSize:12, fontFace:'Pretendard SemiBold', color:'FFFFFF', align:'center', valign:'middle' });
  });
  slide.addText('2026-03-21  |  AssiEye 기술 분석', {
    x:1.5, y:6.6, w:10.33, h:0.3, fontSize:13, fontFace:'Pretendard', color:'FFFFFF', transparency:50, align:'center'
  });
}

function slide02_overview_kpi() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AssiEye는 사건 6시간 만에 수백 건의 정보를 자동 수집·분석하는 시스템이다');
  const kpis = [
    { val:'200건', label:'뉴스 기사 수집', color:'4A7BF7' },
    { val:'149건', label:'YouTube 영상', color:'00D4AA' },
    { val:'105건', label:'SNS 게시물', color:'FFB020' },
    { val:'39회', label:'AI 예측 리포트', color:'FF6B6B' },
  ];
  const kw = 2.808, ky = 1.75, gap = 0.3;
  kpis.forEach(function(k, i) {
    const kx = 0.6 + i * (kw + gap);
    slide.addShape('roundRect', { x:kx, y:ky, w:kw, h:1.8, rectRadius:0.1, fill:{color:'FFFFFF'}, shadow:{type:'outer',blur:5,offset:2,color:'000000',opacity:0.07} });
    slide.addShape('rect', { x:kx+0.02, y:ky, w:kw-0.04, h:0.06, fill:{color:k.color} });
    slide.addText(k.val, { x:kx, y:ky+0.2, w:kw, h:0.75, fontSize:30, fontFace:'Pretendard ExtraBold', bold:true, color:k.color, align:'center' });
    slide.addText(k.label, { x:kx, y:ky+1.0, w:kw, h:0.45, fontSize:13, fontFace:'Pretendard', color:'4A5568', align:'center' });
  });
  slide.addText('에이전트별 24시간 실행 횟수', { x:0.6, y:3.7, w:12.13, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36' });
  const chartData = [{ name:'실행 횟수', labels:['수집 에이전트','개발 에이전트','테스트 에이전트','예측 에이전트'], values:[96,48,48,48] }];
  slide.addChart(pptx.ChartType.bar, chartData, {
    x:0.6, y:4.1, w:12.13, h:2.8,
    barDir:'bar', barGrouping:'clustered',
    showValue:true, dataLabelFontSize:11, dataLabelColor:'FFFFFF',
    chartColors:['4A7BF7','00D4AA','FFB020','FF6B6B'],
    showLegend:false, valAxisHidden:true,
  });
  addPageNum(slide, 2);
}

function slide03_ui_layout() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AssiEye 화면 구성: 지도를 중심으로 6개 정보 패널이 오버레이된다');
  const panels = [
    { title:'배경 레이어', body:'MapLibre GL 다크 지도 + 화재 위치 마커 + 타임라인 마커 + SNS 채널 마커', color:'1A1F36' },
    { title:'왼쪽 패널', body:'뉴스 피드 (네이버뉴스 200건) + YouTube 피드 (149건, 🔴LIVE 뱃지)', color:'4A7BF7' },
    { title:'오른쪽 패널', body:'긍정/부정 여론 분류 + X(트위터) 34건 + Instagram 35건 + Facebook 36건', color:'00D4AA' },
    { title:'하단 패널', body:'시간대별 추이 차트 + 상황 요약 + 통계 (사망11·부상59·실종3) + AI 예측 리포트', color:'FFB020' },
    { title:'중앙 상단', body:'KBS·SBS·MBC 3채널 유튜브 생방송 동시 시청', color:'FF6B6B' },
    { title:'상태 바', body:'동시접속자·열점·FIRMS·기상·마지막 수집 시각', color:'8B5CF6' },
  ];
  CARD_2X3.positions.forEach(function(pos, i) {
    if (i >= panels.length) return;
    addCard(slide, { x:pos.x, y:pos.y, w:CARD_2X3.w, h:CARD_2X3.h, title:panels[i].title, body:panels[i].body, accentColor:panels[i].color });
  });
  addPageNum(slide, 3);
}

function slide04_three_tech_overview() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'AssiEye는 3가지 핵심 기술의 조합으로 작동한다');
  const cards = [
    { title:'Cheliped Browser', body:'AI가 브라우저를 직접 조작해 뉴스·SNS에서 정보를 효율적으로 수집\n• agent-browser CLI\n• 접근성 트리(AXTree)\n• 토큰 51~93% 절약', color:'4A7BF7' },
    { title:'온톨로지 AI 예측', body:'5개 도메인 인과관계 분석으로 미래 시나리오 예측\n• 사건-공간-자원-인명-2차피해\n• 30분마다 자기 진화\n• 확률 기반 예측 리포트', color:'00D4AA' },
    { title:'하네스 엔지니어링', body:'4개 에이전트가 역할 분담해 시스템을 자율 운영\n• /loop 스킬로 주기 실행\n• 공유 파일로 간접 소통\n• tmux 장시간 운영', color:'FFB020' },
    { title:'MapLibre GL', body:'오픈소스 무료 지도에 실시간 재난 이벤트 오버레이\n• BSD-2 라이선스\n• WebGL GPU 가속\n• SSE 실시간 업데이트', color:'FF6B6B' },
    { title:'자기 개선 루프', body:'테스트→이슈→개발→재테스트가 30분마다 자동 반복\n• GitHub Issues 메시지 큐\n• 사람 개입 없는 개선\n• 공유 Git 저장소', color:'8B5CF6' },
    { title:'멀티소스 수집', body:'네이버·YouTube·X·Instagram·Facebook 동시 수집\n• 15분 주기 자동화\n• 중복 제거 로직\n• 오픈그래프 썸네일', color:'38BDF8' },
  ];
  CARD_2X3.positions.forEach(function(pos, i) {
    addCard(slide, { x:pos.x, y:pos.y, w:CARD_2X3.w, h:CARD_2X3.h, title:cards[i].title, body:cards[i].body, accentColor:cards[i].color });
  });
  addPageNum(slide, 4);
}

function slide05_section_cheliped() {
  const slide = pptx.addSlide();
  addSectionDivider(slide, '02', 'Cheliped Browser\n& Agent DOM', 'AI가 인터넷을 직접 탐색하는 방법:\n접근성 트리로 토큰을 51~93% 절약한다');
  addPageNum(slide, 5);
}

function slide06_crawling_problem() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '일반 HTML 크롤링의 문제: 필요한 정보보다 잡음이 90% 이상이다');
  const cw = 5.865;
  slide.addText('일반 HTML 크롤링', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FF6B6B' });
  const leftCode = '<!-- 네이버 뉴스 페이지 일부 -->\n<div class="ad-container">\n  <iframe src="...광고..."></iframe>\n</div>\n<nav class="gnb">메뉴1 메뉴2 ...</nav>\n<div class="article-wrap">\n  <h2 class="tit_news">대전 화재 사망자...</h2>\n  <p class="article_body">본문 내용...</p>\n</div>\n<!-- + 수천 줄의 JS/CSS -->\n\n→ 전체: ~15,000 토큰\n→ 실제 필요: ~300 토큰\n→ 잡음 비율: 98%';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, leftCode, true);

  slide.addText('접근성 트리(AXTree)', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const rightCode = 'heading "대전 화재 사망자 11명으로..."\n  [ref=e1]\nparagraph "소방당국은 22일..."\n  [ref=e2]\nlink "기사 전문 보기"\n  [ref=e3]\nlink "다음 기사 →"\n  [ref=e4]\n\n→ 전체: ~180 토큰\n→ 토큰 절약: 98.8%\n→ 잡음 없음';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, rightCode, true);
  addPageNum(slide, 6);
}

function slide07_axtree_principle() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '접근성 트리는 시각장애인 보조기술용 구조를 AI가 재활용하는 것이다');
  const points = [
    { title:'접근성 트리(AX Tree)란?', body:'모든 브라우저는 스크린리더(시각장애인 보조기술)를 위해 웹페이지를 "의미 있는 요소만" 추출한 별도 트리를 내부에 유지합니다.' },
    { title:'W3C ARIA 표준 기반', body:'버튼·링크·제목·입력창 등 실제 사용자가 상호작용하는 요소만 포함합니다.' },
    { title:'자동 필터링', body:'광고·CSS·이미지 픽셀·숨겨진 코드는 자동으로 제외됩니다.' },
    { title:'DOM 트리 vs AX 트리', body:'DOM은 렌더러 프로세스의 전체 HTML 구조, AX는 브라우저 프로세스의 의미론적 요약입니다.' },
    { title:'왜 AI 에이전트에 적합한가?', body:'AI는 요소의 "역할(role)"과 "레이블(label)"만 알면 조작 가능합니다. 시각적 위치·스타일은 불필요합니다.' },
  ];
  points.forEach(function(p, i) {
    const py = 1.8 + i * 0.98;
    slide.addShape('roundRect', { x:0.6, y:py, w:12.13, h:0.85, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addText(p.title, { x:0.9, y:py+0.08, w:3.5, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
    slide.addText(p.body, { x:4.5, y:py+0.08, w:8.0, h:0.65, fontSize:12, fontFace:'Pretendard', color:'4A5568', valign:'middle', autoFit:true });
  });
  addPageNum(slide, 7);
}

function slide08_agent_dom_mechanism() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Agent DOM: 웹 요소에 @e1, @e2 번호를 붙여 AI가 안정적으로 조작하게 한다');
  const steps = [
    { step:'1단계', title:'페이지 오픈', desc:'agent-browser open \'https://news.naver.com\' → Chromium 헤드리스 브라우저 실행' },
    { step:'2단계', title:'CDP로 AXTree 추출', desc:'Chrome DevTools Protocol(CDP)로 현재 페이지의 접근성 트리 요청 및 수신' },
    { step:'3단계', title:'ref 번호 부여', desc:'트리를 순회하며 상호작용 가능한 요소(버튼·링크·입력창)에 @e1, @e2... 순서 부여' },
    { step:'4단계', title:'AI가 ref로 명령', desc:'agent-browser click @e3 / agent-browser fill @e1 \'대전화재\' → CSS 셀렉터 불필요' },
    { step:'5단계', title:'결과 반환', desc:'클릭/입력 후 페이지 변경 → snapshot 재실행으로 새 상태 확인' },
  ];
  steps.forEach(function(s, i) {
    const sy = 1.75 + i * 1.0;
    slide.addShape('roundRect', { x:0.6, y:sy, w:1.4, h:0.75, rectRadius:0.08, fill:{color:COLORS_LIST[i]} });
    slide.addText(s.step, { x:0.6, y:sy, w:1.4, h:0.75, fontSize:12, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
    slide.addShape('roundRect', { x:2.2, y:sy, w:10.53, h:0.75, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addText(s.title, { x:2.4, y:sy+0.05, w:2.5, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36' });
    slide.addText(s.desc, { x:2.4, y:sy+0.35, w:10.13, h:0.35, fontSize:11, fontFace:'Pretendard', color:'4A5568', autoFit:true });
    if (i < steps.length - 1) {
      slide.addShape('rect', { x:1.1, y:sy+0.78, w:0.06, h:0.22, fill:{color:'4A7BF7'} });
    }
  });
  addPageNum(slide, 8);
}

function slide09_token_table() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '토큰 절감률은 페이지 복잡도에 따라 51%~93%로 달라진다');
  addStyledTable(slide,
    ['페이지 유형','기존 HTML 크롤링','AXTree (전체)','AXTree (-i 옵션)','절감률'],
    [
      ['Wikipedia 단순 페이지','~8,000 토큰','~3,900 토큰','~3,920 토큰','51%'],
      ['GitHub 프로젝트 페이지','~25,000 토큰','~5,500 토큰','~5,200 토큰','79%'],
      ['Hacker News 목록','~18,000 토큰','~4,200 토큰','~3,800 토큰','78%'],
      ['상호작용 요소 전용 페이지','~15,000 토큰','~8,000 토큰','~1,050 토큰','93%'],
      ['네이버 뉴스 (추정)','~20,000 토큰','~4,000 토큰','~2,000 토큰','~90%'],
    ],
    { y:1.8, h:3.5 }
  );
  slide.addShape('roundRect', { x:0.6, y:5.55, w:12.13, h:0.75, rectRadius:0.08, fill:{color:'FFF3E0'} });
  slide.addText('⚠️ 출처: paddo.dev 벤치마크 + Vercel 공식 주장. "93%"는 상호작용 요소만 추출(-i)하는 최적 조건. 범용 적용 시 70~80% 현실적.', {
    x:0.8, y:5.6, w:11.73, h:0.65, fontSize:11, fontFace:'Pretendard', color:'4A5568', valign:'middle', autoFit:true
  });
  addPageNum(slide, 9);
}

function slide10_agent_browser_install() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'agent-browser 설치부터 핵심 명령어까지: 5분이면 준비 완료');
  const cw = 5.865;
  slide.addText('설치', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const installCode = '# Node.js 18+ 필요\nnpm install -g agent-browser\n\n# Chromium 다운로드 (약 200MB)\nagent-browser install\n\n# 설치 확인\nagent-browser --version\n\n# 클로드 코드 스킬로 등록\n# ~/.claude/skills/ 에 skill.md 복사\n# 또는 CLAUDE.md에 직접 사용 지침 작성';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, installCode, true);

  slide.addText('핵심 명령어 6개', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const cmdCode = '# 페이지 열기\nagent-browser open "https://url"\n\n# 전체 AXTree 스냅샷\nagent-browser snapshot\n\n# 상호작용 요소만 (토큰 절약)\nagent-browser snapshot -i\n\n# ref로 클릭\nagent-browser click @e3\n\n# ref로 텍스트 입력\nagent-browser fill @e1 "검색어"\n\n# 스크린샷 (디버깅용)\nagent-browser screenshot page.png';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, cmdCode, true);
  addPageNum(slide, 10);
}

function slide11_claude_code_skill_pattern() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Claude Code 에이전트가 agent-browser를 사용하는 실제 패턴');
  const points = [
    { title:'CLAUDE.md에 작업 절차 정의', body:'에이전트에게 "이 도구로 이렇게 탐색해라"고 지시하는 명세서입니다.' },
    { title:'Bash 도구로 CLI 호출', body:'Claude Code는 Bash 도구를 통해 agent-browser 명령어를 실행합니다.' },
    { title:'결과를 파일로 저장', body:'수집한 데이터를 data/events.json에 append 합니다.' },
  ];
  points.forEach(function(p, i) {
    const py = 1.75 + i * 0.55;
    slide.addShape('roundRect', { x:0.6, y:py, w:12.13, h:0.45, rectRadius:0.06, fill:{color:'EBF4FF'} });
    slide.addText(p.title + ': ', { x:0.8, y:py+0.05, w:3.5, h:0.35, fontSize:12, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
    slide.addText(p.body, { x:4.3, y:py+0.05, w:8.2, h:0.35, fontSize:12, fontFace:'Pretendard', color:'4A5568', autoFit:true });
  });
  slide.addText('실제 CLAUDE.md 예시', { x:0.6, y:3.6, w:12.13, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36' });
  const claudeCode = '## 정보수집 에이전트 역할\n\n### 작업 절차\n1. agent-browser open "https://search.naver.com/search.naver?where=news&query=대전화재"\n2. agent-browser snapshot -i\n3. 기사 링크(@e번호) 목록 확인\n4. 각 기사에 대해:\n   - agent-browser click @e번호\n   - agent-browser snapshot (본문 추출)\n   - URL이 data/collected_urls.txt에 있으면 건너뜀\n   - 없으면 data/events.json에 추가\n5. data/collected_urls.txt에 URL 기록';
  addCodeBlock(slide, 0.6, 4.0, 12.13, 2.75, claudeCode, false);
  addPageNum(slide, 11);
}

function slide12_two_implementation() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '두 가지 구현 방법: agent-browser CLI vs Playwright Python 자동화');
  addStyledTable(slide,
    ['구분','agent-browser CLI','Playwright Python'],
    [
      ['사용 주체','Claude Code 에이전트 (대화형)','독립 Python 스크립트 (자동화)'],
      ['언제 사용','복잡한 탐색, 로그인, 동적 SPA','주기 실행, 대량 수집, 배치 처리'],
      ['코드 위치','CLAUDE.md 지침','src/crawler/*.py'],
      ['중복 제거','에이전트가 직접 파일 확인','스크립트 내 로직으로 처리'],
      ['장점','복잡한 상황 유연하게 대응','스케줄러와 결합 가능, 비용 효율'],
      ['단점','API 비용 높음, 속도 느림','동적 사이트 처리 한계 있음'],
    ],
    { y:1.8, h:4.2 }
  );
  slide.addShape('roundRect', { x:0.6, y:6.2, w:12.13, h:0.55, rectRadius:0.08, fill:{color:'EBF4FF'} });
  slide.addText('💡 AssiEye는 두 방법을 혼용: 에이전트는 CLI로 탐색, 주기 수집은 Python 스크립트', {
    x:0.8, y:6.25, w:11.73, h:0.45, fontSize:12, fontFace:'Pretendard', color:'1A1F36', valign:'middle'
  });
  addPageNum(slide, 12);
}

function slide13_section_ontology() {
  const slide = pptx.addSlide();
  addSectionDivider(slide, '03', '온톨로지 기반\nAI 예측', '인과관계를 모델링해 미래 시나리오를 예측하는 방법:\nRDF/OWL 없이 프롬프트 설계만으로 구현한다');
  addPageNum(slide, 13);
}

function slide14_ontology_concept() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '온톨로지란 AI에게 알려주는 "개념 간 관계 지도"다');
  const points = [
    { title:'온톨로지의 정의', body:'특정 도메인의 개념·관계·규칙을 체계적으로 정의한 지식 구조입니다.', color:'4A7BF7' },
    { title:'기존 방식 (복잡)', body:'RDF(Resource Description Framework), OWL(Web Ontology Language) 같은 전용 포맷이 필요합니다.', color:'FF6B6B' },
    { title:'AssiEye 방식 (단순)', body:'Claude 같은 LLM이 온톨로지 추론 엔진 역할을 대체합니다. 프롬프트 설계가 전부입니다.', color:'00D4AA' },
    { title:'핵심 인사이트', body:'"이런 구조로 사고해라"는 지시문이 JSON 스키마 + 시스템 프롬프트로 구현됩니다.', color:'FFB020' },
    { title:'왜 가능한가', body:'대형 언어 모델은 구조화된 관계 분석과 귀납적 추론을 이미 내재화하고 있습니다.', color:'8B5CF6' },
  ];
  points.forEach(function(p, i) {
    const py = 1.8 + i * 0.98;
    slide.addShape('roundRect', { x:0.6, y:py, w:12.13, h:0.85, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addShape('rect', { x:0.6, y:py, w:0.06, h:0.85, fill:{color:p.color} });
    slide.addText(p.title, { x:0.9, y:py+0.1, w:3.2, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:p.color });
    slide.addText(p.body, { x:4.2, y:py+0.1, w:8.3, h:0.65, fontSize:12, fontFace:'Pretendard', color:'4A5568', valign:'top', autoFit:true });
  });
  addPageNum(slide, 14);
}

function slide15_five_domains() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '재난 상황을 5개 도메인으로 분류해 인과관계를 모델링한다');
  const cards = [
    { title:'사건 (Incident)', body:'• 발생 시각·위치\n• 현재 진행 상태\n• 확산 경로·속도\n• 진화율(%)', color:'4A7BF7' },
    { title:'공간 (Space)', body:'• 건물 층수·유형\n• 주변 위험 건물\n• 위험 물질 목록\n• 구조적 취약점', color:'00D4AA' },
    { title:'자원 (Resources)', body:'• 소방차·인력 수\n• 진압 방법 제약\n• 투입 장비·로봇\n• 가용 의료 자원', color:'FFB020' },
    { title:'인명 (Casualties)', body:'• 사망·부상·실종\n• 부상 중증도\n• 수색 구역·상태\n• 병원 이송 현황', color:'FF6B6B' },
    { title:'2차 피해 (Secondary)', body:'• 건물 붕괴 위험\n• 환경 오염 위험\n• 법적 책임 리스크\n• 경제적 피해 산정', color:'8B5CF6' },
    { title:'인과관계 연결', body:'5개 도메인은 서로 연결됨\n예: 자원(나트륨) → 사건(진압 지연) → 인명(수색 지연) → 공간(전소) → 2차피해(붕괴)', color:'38BDF8' },
  ];
  CARD_2X3.positions.forEach(function(pos, i) {
    addCard(slide, { x:pos.x, y:pos.y, w:CARD_2X3.w, h:CARD_2X3.h, title:cards[i].title, body:cards[i].body, accentColor:cards[i].color });
  });
  addPageNum(slide, 15);
}

function slide16_causal_chain() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '인과관계 연쇄: 하나의 사실이 여러 예측으로 이어진다');
  const boxes = [
    { fill:'EBF4FF', text:'건물에 나트륨(Na) 보관 [자원 도메인]' },
    { fill:'FFF3E0', text:'물(H₂O) 사용 진압 불가 [자원 제약]' },
    { fill:'FFF3E0', text:'진압 지연 → 건물 전소 [사건]' },
    { fill:'FFE8E8', text:'실종자 수색 불가능 [인명]' },
    { fill:'FFE8E8', text:'전소 후 새벽 기온 강하 [공간]' },
    { fill:'F0E8FF', text:'구조물 취약화 → 붕괴 예측 확률 0.6 [2차 피해]' },
  ];
  boxes.forEach(function(b, i) {
    const by = 1.9 + i * 0.75;
    slide.addShape('roundRect', { x:0.6, y:by, w:5.5, h:0.55, rectRadius:0.08, fill:{color:b.fill} });
    slide.addText(b.text, { x:0.8, y:by+0.08, w:5.1, h:0.39, fontSize:12, fontFace:'Pretendard', color:'1A1F36', valign:'middle', autoFit:true });
    if (i < boxes.length - 1) {
      slide.addShape('rect', { x:3.1, y:by+0.56, w:0.06, h:0.19, fill:{color:'4A7BF7'} });
    }
  });
  slide.addShape('roundRect', { x:6.5, y:1.9, w:5.93, h:4.8, rectRadius:0.1, fill:{color:'F7F9FC'} });
  slide.addText('이 연쇄 추론이 가능한 이유', { x:6.7, y:2.05, w:5.53, h:0.4, fontSize:15, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  slide.addText(
    '인과관계 규칙을 온톨로지로 사전 정의했기 때문에, LLM이 새로운 정보를 받으면 자동으로 연쇄 추론을 수행합니다.\n\n"새벽 기온 강하" 정보가 들어오는 순간 "구조물 취약화 → 붕괴 위험"을 즉시 도출합니다.\n\n• 각 도메인의 개념이 JSON으로 정의됨\n• 도메인 간 인과관계 규칙이 시스템 프롬프트에 명시됨\n• LLM이 새 데이터를 받으면 규칙에 따라 연쇄 추론 수행',
    { x:6.7, y:2.55, w:5.53, h:3.9, fontSize:12, fontFace:'Pretendard', color:'4A5568', lineSpacingMultiple:1.4, valign:'top', autoFit:true }
  );
  addPageNum(slide, 16);
}

function slide17_json_schema() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '온톨로지를 JSON 스키마로 정의하는 방법');
  const code = '{\n  "disaster_type": "fire",\n  "location": {\n    "name": "대전 안전공업",\n    "lat": 36.35, "lng": 127.38,\n    "address": "대전광역시 대덕구"\n  },\n  "domains": {\n    "incident": {\n      "start_time": "2026-03-21T13:17:00",\n      "status": "진압완료",\n      "progression": ["발생","확산","진압시작","완전진화"]\n    },\n    "space": {\n      "building_floors": 5,\n      "building_type": "공장",\n      "hazardous_materials": ["나트륨(Na)"]\n    },\n    "resources": {\n      "firefighters": 115, "vehicles": 46, "robots": 2,\n      "constraint": "나트륨으로 인한 물 사용 제한"\n    },\n    "casualties": { "dead":11, "injured":59, "missing":3 },\n    "secondary_risks": [\n      {"type":"건물붕괴","probability":0.6,"basis":"전소 후 기온강하"},\n      {"type":"토양오염","probability":0.4,"basis":"나트륨 반응물"}\n    ]\n  }\n}';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 17);
}

function slide18_prediction_prompt() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Claude API 예측 프롬프트: 시스템 프롬프트 + 사용자 메시지 구조');
  const cw = 5.865;
  slide.addText('시스템 프롬프트', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const sysCode = 'SYSTEM_PROMPT = """\n당신은 재난 분석 전문가입니다.\n5개 도메인(사건/공간/자원/\n인명/2차피해)의 인과관계를\n분석해 향후 시나리오를 예측합니다.\n\n각 예측에는 반드시 포함:\n- probability: 0.0~1.0\n- basis: 근거 한 문장\n- timeframe: 예측 시점\n- domain: 해당 도메인\n\nJSON 형식으로만 응답하세요.\n"""';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, sysCode, true);

  slide.addText('사용자 메시지', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const userCode = 'user_msg = f"""\n현재 재난 상황 (Turn {turn}):\n{json.dumps(ontology, ensure_ascii=False)}\n\n이전 예측 검증:\n{prev_predictions_summary}\n\n요청사항:\n1. 이전 예측 검증\n2. 새 변수/위험 추가\n3. 단기/중기/장기 시나리오\n4. 분석 방법론 개선점 1개\n\nJSON으로 응답:\n{\n  "verified": [...],\n  "new_variables": [...],\n  "predictions": [...],\n  "methodology_update": "..."\n}\n"""';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, userCode, true);
  addPageNum(slide, 18);
}

function slide19_self_evolution() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '자기 진화 4단계: 30분마다 예측이 더 정교해지는 메커니즘');
  const steps = [
    { step:'1단계', title:'이전 예측 검증', desc:'지난 턴의 예측이 실제 발생한 이벤트와 얼마나 일치하는지 비교. 틀린 예측은 원인 분석 후 온톨로지 업데이트', color:'4A7BF7' },
    { step:'2단계', title:'새 변수 추가', desc:'새로 수집된 데이터에서 이전에 고려하지 못한 변수 발굴. 예: "기온 강하" 정보가 들어오면 "구조물 취약화" 변수 추가', color:'00D4AA' },
    { step:'3단계', title:'방법론 개선', desc:'"건물 구조만 봤는데 주변 교통·의료 접근성도 봐야겠다" 같은 분석 접근법 자체를 갱신', color:'FFB020' },
    { step:'4단계', title:'다음 과제 설정', desc:'다음 턴에서 집중 분석할 주제 결정. 턴39에서는 "피해 금액 산정" 같은 고차원 분석으로 발전', color:'FF6B6B' },
  ];
  steps.forEach(function(s, i) {
    const sy = 1.8 + i * 1.28;
    slide.addShape('roundRect', { x:0.6, y:sy, w:1.6, h:1.0, rectRadius:0.08, fill:{color:s.color} });
    slide.addText(s.step, { x:0.6, y:sy, w:1.6, h:1.0, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
    slide.addShape('roundRect', { x:2.4, y:sy, w:10.33, h:1.0, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addText(s.title, { x:2.6, y:sy+0.08, w:10.0, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36' });
    slide.addText(s.desc, { x:2.6, y:sy+0.45, w:10.0, h:0.48, fontSize:12, fontFace:'Pretendard', color:'4A5568', autoFit:true });
    if (i < steps.length - 1) {
      slide.addShape('rect', { x:1.2, y:sy+1.02, w:0.06, h:0.26, fill:{color:s.color} });
    }
  });
  addPageNum(slide, 19);
}

function slide20_prediction_example() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '예측 결과 해석: 확률과 근거를 함께 읽어야 한다');
  const cw = 5.865;
  slide.addText('단기 예측 (24시간 내)', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const shortTerm = [
    { scenario:'실종자 3명 중 2명 이상 발견', prob:'0.70', basis:'잔여 수색 구역 축소', color:'00D4AA' },
    { scenario:'건물 일부 구역 붕괴', prob:'0.60', basis:'전소 후 기온 강하, 나트륨 반응물', color:'FF6B6B' },
    { scenario:'피해 금액 1차 추산 완료', prob:'0.85', basis:'소방청 보고서 관례', color:'4A7BF7' },
  ];
  shortTerm.forEach(function(p, i) {
    const py = 2.2 + i * 0.98;
    slide.addShape('roundRect', { x:0.6, y:py, w:cw, h:0.85, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addShape('roundRect', { x:0.65, y:py+0.08, w:0.7, h:0.7, rectRadius:0.06, fill:{color:p.color} });
    slide.addText(p.prob, { x:0.65, y:py+0.08, w:0.7, h:0.7, fontSize:13, fontFace:'Pretendard ExtraBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
    slide.addText(p.scenario, { x:1.45, y:py+0.08, w:4.8, h:0.35, fontSize:12, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36', autoFit:true });
    slide.addText('근거: ' + p.basis, { x:1.45, y:py+0.45, w:4.8, h:0.35, fontSize:11, fontFace:'Pretendard', color:'718096', autoFit:true });
  });

  slide.addText('장기 예측 (1개월 이상)', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FF6B6B' });
  const longTerm = [
    { scenario:'중대재해처벌법 기소', prob:'0.55', basis:'사망 11명, 안전관리 부실 정황', color:'FF6B6B' },
    { scenario:'1심 선고 2027년 상반기', prob:'0.50', basis:'유사 사건 평균 재판 기간', color:'FFB020' },
    { scenario:'유사 공장 일제 점검', prob:'0.80', basis:'정부 대응 관례', color:'8B5CF6' },
  ];
  longTerm.forEach(function(p, i) {
    const py = 2.2 + i * 0.98;
    slide.addShape('roundRect', { x:6.865, y:py, w:cw, h:0.85, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addShape('roundRect', { x:6.915, y:py+0.08, w:0.7, h:0.7, rectRadius:0.06, fill:{color:p.color} });
    slide.addText(p.prob, { x:6.915, y:py+0.08, w:0.7, h:0.7, fontSize:13, fontFace:'Pretendard ExtraBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
    slide.addText(p.scenario, { x:7.7, y:py+0.08, w:4.8, h:0.35, fontSize:12, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36', autoFit:true });
    slide.addText('근거: ' + p.basis, { x:7.7, y:py+0.45, w:4.8, h:0.35, fontSize:11, fontFace:'Pretendard', color:'718096', autoFit:true });
  });
  slide.addShape('roundRect', { x:0.6, y:5.3, w:12.13, h:0.55, rectRadius:0.08, fill:{color:'FFF3E0'} });
  slide.addText('⚠️ 확률은 AI의 추정이며 공식 기관 발표가 아닙니다. 의사결정 보조 용도로만 활용하세요.', {
    x:0.8, y:5.35, w:11.73, h:0.45, fontSize:12, fontFace:'Pretendard', color:'4A5568', valign:'middle'
  });
  addPageNum(slide, 20);
}

function slide21_section_harness() {
  const slide = pptx.addSlide();
  addSectionDivider(slide, '04', '하네스\n엔지니어링', '4개 AI 에이전트가 사람 없이 협력하는 방법:\n공유 파일과 이슈 트래커로 간접 소통한다');
  addPageNum(slide, 21);
}

function slide22_four_agents() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4개 에이전트가 각자 역할을 맡고 30분마다 자율 운영된다');
  const cards = [
    { title:'개발 에이전트 (30분 주기)', body:'초기: 전체 웹서비스 코드 작성\n이후: GitHub Issues 확인 → 최우선 이슈 1개 해결 → commit\n\n도구: CLAUDE.md, Git, 코드 편집기\n공유: 전체 코드베이스 (소유)', color:'4A7BF7' },
    { title:'테스트/이슈 에이전트 (30분 주기)', body:'agent-browser로 실제 사이트 접속\n기능 테스트 → 버그 발견 → 이슈 자동 발행\n문제 없어도 개선점 이슈 작성\n\n도구: agent-browser, GitHub Issues API\n공유: Issues (쓰기)', color:'00D4AA' },
    { title:'수집 에이전트 (15분 주기)', body:'네이버·YouTube·X·IG·FB 크롤링\n신규 게시물만 저장 (중복 제거)\n오픈그래프 이미지 추출\n\n도구: agent-browser, Playwright\n공유: data/events.json (append)', color:'FFB020' },
    { title:'예측 에이전트 (30분 주기)', body:'events.json 읽기 → 온톨로지 업데이트\n5개 도메인 분석 → 예측 리포트 생성\n자기 진화 루프 실행\n\n도구: Claude API\n공유: ontology/report_NNN.json (쓰기)', color:'FF6B6B' },
  ];
  CARD_2X2.positions.forEach(function(pos, i) {
    addCard(slide, { x:pos.x, y:pos.y, w:CARD_2X2.w, h:CARD_2X2.h, title:cards[i].title, body:cards[i].body, accentColor:cards[i].color });
  });
  addPageNum(slide, 22);
}

function slide23_agent_communication() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에이전트 간 통신: 직접 대화 대신 공유 파일과 이슈 트래커를 사용한다');
  // Left flow
  const leftItems = [
    { label:'[수집 에이전트]', color:'FFB020', y:1.75 },
    { label:'data/events.json', color:'E2E8F0', y:2.55, isFile:true },
    { label:'[예측 에이전트]', color:'FF6B6B', y:3.35 },
    { label:'ontology/report_039.json', color:'E2E8F0', y:4.15, isFile:true },
    { label:'[FastAPI 백엔드]', color:'4A7BF7', y:4.95 },
    { label:'[MapLibre 대시보드]', color:'00D4AA', y:5.75 },
  ];
  leftItems.forEach(function(item) {
    const isFile = item.isFile;
    slide.addShape('roundRect', { x:0.6, y:item.y, w:4.5, h:0.6, rectRadius:0.08, fill:{color:isFile ? 'F7F9FC' : item.color} });
    slide.addText(item.label, { x:0.6, y:item.y, w:4.5, h:0.6, fontSize:isFile ? 11 : 13, fontFace:'Pretendard SemiBold', bold:!isFile, color:isFile ? '4A5568' : 'FFFFFF', align:'center', valign:'middle' });
    if (item.y < 5.75) {
      slide.addShape('rect', { x:2.7, y:item.y+0.62, w:0.06, h:0.15, fill:{color:'4A7BF7'} });
    }
  });
  // Arrow labels
  const arrowLabels = ['append','read','write','serve','SSE'];
  const arrowYs = [2.15, 2.95, 3.75, 4.55, 5.35];
  arrowLabels.forEach(function(lbl, i) {
    slide.addText(lbl, { x:3.05, y:arrowYs[i], w:1.5, h:0.2, fontSize:10, fontFace:'Pretendard', color:'718096' });
  });

  // Right flow
  slide.addShape('roundRect', { x:6.2, y:1.75, w:4.5, h:0.6, rectRadius:0.08, fill:{color:'00D4AA'} });
  slide.addText('[테스트 에이전트]', { x:6.2, y:1.75, w:4.5, h:0.6, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
  slide.addShape('rect', { x:8.3, y:2.37, w:0.06, h:0.2, fill:{color:'4A7BF7'} });
  slide.addText('create issue', { x:8.35, y:2.37, w:1.8, h:0.2, fontSize:10, fontFace:'Pretendard', color:'718096' });
  slide.addShape('roundRect', { x:6.2, y:2.6, w:4.5, h:0.6, rectRadius:0.08, fill:{color:'F7F9FC'} });
  slide.addText('GitHub Issues #42 "버그: 지도 마커 미표시"', { x:6.2, y:2.6, w:4.5, h:0.6, fontSize:11, fontFace:'Pretendard', color:'4A5568', align:'center', valign:'middle' });
  slide.addShape('rect', { x:8.3, y:3.22, w:0.06, h:0.2, fill:{color:'4A7BF7'} });
  slide.addText('read & fix', { x:8.35, y:3.22, w:1.8, h:0.2, fontSize:10, fontFace:'Pretendard', color:'718096' });
  slide.addShape('roundRect', { x:6.2, y:3.45, w:4.5, h:0.6, rectRadius:0.08, fill:{color:'4A7BF7'} });
  slide.addText('[개발 에이전트]', { x:6.2, y:3.45, w:4.5, h:0.6, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
  slide.addShape('rect', { x:8.3, y:4.07, w:0.06, h:0.2, fill:{color:'4A7BF7'} });
  slide.addText('close issue + commit', { x:8.35, y:4.07, w:2.5, h:0.2, fontSize:10, fontFace:'Pretendard', color:'718096' });

  slide.addShape('roundRect', { x:5.9, y:5.1, w:6.83, h:0.8, rectRadius:0.08, fill:{color:'EBF4FF'} });
  slide.addText('핵심: "마이크로서비스의 메시지 큐 패턴과 구조적으로 동일합니다"', {
    x:6.1, y:5.2, w:6.43, h:0.6, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7', valign:'middle'
  });
  addPageNum(slide, 23);
}

function slide24_loop_skill() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Claude Code /loop 스킬: 지정 간격마다 에이전트를 자동 반복 실행한다');
  const cw = 5.865;
  slide.addText('기본 문법과 동작', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const leftCode = '# 기본 문법\n/loop [간격] <프롬프트>\n\n# 간격 단위: m(분), h(시간), d(일)\n# 기본값: 10분\n\n# 예시\n/loop 15m 정보수집 에이전트 작업 실행\n/loop 30m 온톨로지 예측 리포트 생성\n/loop 1h 전체 시스템 상태 점검\n\n# 동작 과정\n1. cron 표현식으로 변환\n2. 내부 스케줄러에 등록\n3. 세션 유지 중 반복 실행\n4. 각 실행 결과 세션에 출력\n\n⚠️ 세션 종료 시 루프도 소멸\n  → tmux 조합 필수';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, leftCode, true);

  slide.addText('4개 에이전트 설정 예시', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const rightCode = '# 터미널 1: 수집 에이전트\nclaude\n> /loop 15m\n  .claude/collector.md 지침에 따라\n  네이버·유튜브·SNS에서\n  대전화재 관련 신규 게시물 수집\n\n# 터미널 2: 예측 에이전트\nclaude\n> /loop 30m\n  data/events.json 읽고\n  온톨로지 예측 리포트 생성\n\n# 터미널 3: 테스트 에이전트\nclaude\n> /loop 30m\n  사이트 기능 테스트 후\n  발견된 이슈 GitHub에 발행\n\n# 터미널 4: 개발 에이전트\nclaude\n> /loop 30m\n  GitHub Issues 확인 후\n  최우선 이슈 1개 해결 및 commit';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, rightCode, true);
  addPageNum(slide, 24);
}

function slide25_tmux_setup() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'tmux로 4개 에이전트를 서버에서 영속적으로 운영하는 방법');
  const code = '# tmux 세션 생성 (서버 재시작 후에도 복구 가능)\ntmux new-session -d -s collector "claude --dangerously-skip-permissions"\ntmux new-session -d -s predictor "claude --dangerously-skip-permissions"\ntmux new-session -d -s tester    "claude --dangerously-skip-permissions"\ntmux new-session -d -s developer "claude --dangerously-skip-permissions"\n\n# 각 세션에 /loop 명령 전송\ntmux send-keys -t collector \\\n  "/loop 15m .claude/collector.md 내용대로 수집 실행" Enter\ntmux send-keys -t predictor \\\n  "/loop 30m .claude/predictor.md 내용대로 예측 실행" Enter\n\n# 모니터링\ntmux ls                           # 세션 목록\ntmux attach-session -t collector  # 수집 에이전트 확인\nCtrl+b d                          # 세션 detach (종료 아님)\n\n# 서버 재시작 후 복구 스크립트\n# tmux-resurrect 플러그인 또는 start_agents.sh 자동 실행';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 4.7, code, true);
  slide.addShape('roundRect', { x:0.6, y:6.6, w:12.13, h:0.5, rectRadius:0.08, fill:{color:'FFF3E0'} });
  slide.addText('⚠️ --dangerously-skip-permissions는 로컬 개발 환경 전용. 프로덕션에서는 권한 설정 검토 필요', {
    x:0.8, y:6.65, w:11.73, h:0.4, fontSize:11, fontFace:'Pretendard', color:'4A5568', valign:'middle'
  });
  addPageNum(slide, 25);
}

function slide26_claude_md_example() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'CLAUDE.md 작성법: 에이전트 역할을 명확히 정의해야 충돌을 막는다');
  const cw = 5.865;
  slide.addText('좋은 CLAUDE.md', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const goodCode = '# 수집 에이전트\n\n## 역할\n15분마다 대전화재 관련 신규\n게시물을 수집해 저장한다.\n\n## 수집 대상\n- 네이버: search.naver.com?query=대전화재\n- YouTube: youtube.com/results?query=대전화재\n\n## 작업 절차\n1. agent-browser open [URL]\n2. agent-browser snapshot -i\n3. data/collected_urls.txt 확인\n4. 신규만 data/events.json에 추가\n5. collected_urls.txt에 URL 기록\n\n## 공유 파일 규칙\n- events.json: append만 (덮어쓰기 금지)\n- collected_urls.txt: append만\n- 다른 파일 수정 금지';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, goodCode, false);

  slide.addText('나쁜 CLAUDE.md', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FF6B6B' });
  const badCode = '# 수집 에이전트\n\n## 역할\n정보를 수집해서 저장해라.\n\n## 방법\n인터넷에서 화재 관련 내용을\n찾아서 저장해라.';
  addCodeBlock(slide, 6.865, 2.15, cw, 1.8, badCode, false);

  slide.addText('왜 나쁜가:', { x:6.865, y:4.1, w:cw, h:0.35, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'FF6B6B' });
  const bads = [
    '• 수집 대상 URL 미명시 → 에이전트가 임의로 선택',
    '• 저장 파일 경로 미명시 → 다른 에이전트 파일 덮어쓸 수 있음',
    '• 중복 제거 로직 미명시 → 동일 게시물 무한 재수집',
    '• append 규칙 미명시 → Git 충돌 발생 가능',
  ];
  bads.forEach(function(b, i) {
    slide.addText(b, { x:6.865, y:4.5 + i * 0.38, w:cw, h:0.35, fontSize:12, fontFace:'Pretendard', color:'4A5568', autoFit:true });
  });
  addPageNum(slide, 26);
}

function slide27_git_conflict_prevention() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '에이전트 간 Git 충돌 방지: 파일 분리 설계가 핵심이다');
  addStyledTable(slide,
    ['에이전트','전담 파일/디렉토리','쓰기 규칙','다른 에이전트 파일'],
    [
      ['수집 에이전트','data/events.json\ndata/collected_urls.txt','append-only','읽기만 가능'],
      ['예측 에이전트','ontology/report_NNN.json\nontology/schema.json','새 파일 생성','읽기만 가능'],
      ['테스트 에이전트','GitHub Issues (API)','생성만 (수정 금지)','읽기만 가능'],
      ['개발 에이전트','src/ 전체\npackage.json\nCLAUDE.md','수정·삭제 가능','읽기만 가능'],
    ],
    { y:1.8, h:3.5 }
  );
  slide.addShape('roundRect', { x:0.6, y:5.55, w:12.13, h:0.75, rectRadius:0.08, fill:{color:'EBF4FF'} });
  slide.addText('💡 동일 파일을 동시에 수정하면 Git merge conflict 발생. 에이전트마다 "소유 파일"을 명확히 지정하고 CLAUDE.md에 명시한다', {
    x:0.8, y:5.6, w:11.73, h:0.65, fontSize:12, fontFace:'Pretendard', color:'1A1F36', valign:'middle', autoFit:true
  });
  addPageNum(slide, 27);
}

function slide28_section_architecture() {
  const slide = pptx.addSlide();
  addSectionDivider(slide, '05', '전체 연동\n아키텍처', '수집 → 처리 → 시각화 → 자기 개선:\n4개 레이어가 유기적으로 연결된다');
  addPageNum(slide, 28);
}

function slide29_full_architecture() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '4개 레이어가 순환하며 실시간 재난 모니터링 시스템을 구성한다');
  const layers = [
    { label:'수집 레이어', fill:'EBF4FF', accent:'4A7BF7', body:'Playwright + agent-browser → 네이버 / YouTube / X / IG / FB\n15분 주기, 중복 제거 → data/events.json', y:1.75 },
    { label:'처리 레이어', fill:'FFF3E0', accent:'FFB020', body:'Claude API → 감성 분석(긍/부정) + 온톨로지 예측\n30분 주기, 자기 진화 → ontology/report_NNN.json', y:3.0 },
    { label:'출력 레이어', fill:'F0E8FF', accent:'8B5CF6', body:'FastAPI SSE → MapLibre GL 대시보드\n실시간 지도 업데이트 + 예측 패널 갱신, ngrok으로 외부 공개', y:4.25 },
    { label:'개선 루프', fill:'E8F5E9', accent:'00D4AA', body:'테스트 에이전트 → GitHub Issues → 개발 에이전트\n30분마다 버그 수정 + UI 개선', y:5.5 },
  ];
  layers.forEach(function(l, i) {
    slide.addShape('roundRect', { x:0.6, y:l.y, w:12.13, h:1.0, rectRadius:0.08, fill:{color:l.fill} });
    slide.addShape('rect', { x:0.6, y:l.y, w:0.08, h:1.0, fill:{color:l.accent} });
    slide.addText(l.label, { x:0.9, y:l.y+0.08, w:2.5, h:0.4, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:l.accent });
    slide.addText(l.body, { x:0.9, y:l.y+0.5, w:11.6, h:0.45, fontSize:12, fontFace:'Pretendard', color:'4A5568', autoFit:true });
    if (i < layers.length - 1) {
      slide.addShape('rect', { x:6.3, y:l.y+1.02, w:0.06, h:0.2, fill:{color:l.accent} });
    }
  });
  addPageNum(slide, 29);
}

function slide30_sse_vs_websocket() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '실시간 전달 방식 선택: 재난 대응에는 SSE가 가장 실용적이다');
  addStyledTable(slide,
    ['항목','HTTP 폴링','SSE','WebSocket'],
    [
      ['방향','클라이언트 요청','서버→클라이언트','양방향'],
      ['구현 복잡도','매우 단순','단순','복잡'],
      ['실시간성','15~30초 지연','즉각 (서버 push)','즉각 (양방향)'],
      ['HTTP 호환','O','O (기존 HTTP 재사용)','X (업그레이드 필요)'],
      ['재연결 처리','자동','브라우저 자동','직접 구현'],
      ['AssiEye 선택','-','✅ 선택','-'],
      ['적합 상황','단순 대시보드','단방향 이벤트 스트림','채팅·실시간 게임'],
    ],
    { y:1.75, h:3.9 }
  );
  const sseCode = 'from sse_starlette.sse import EventSourceResponse\nimport asyncio, json\n\n@app.get("/events")\nasync def stream_events():\n    async def generator():\n        last_count = 0\n        while True:\n            with open("data/events.json") as f:\n                events = json.load(f)\n            if len(events) > last_count:\n                for e in events[last_count:]:\n                    yield {"data": json.dumps(e, ensure_ascii=False)}\n                last_count = len(events)\n            await asyncio.sleep(10)\n    return EventSourceResponse(generator())';
  addCodeBlock(slide, 0.6, 5.85, 12.13, 1.85, sseCode, true);
  addPageNum(slide, 30);
}

function slide31_maplibre() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'MapLibre GL: BSD-2 라이선스 무료 오픈소스로 Mapbox 대신 사용한다');
  const cw = 5.865;
  slide.addText('Mapbox vs MapLibre', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const compCode = '항목          MapLibre    Mapbox GL\n라이선스      BSD-2 무료  상용 (v2+)\nAPI 키        불필요      필수\n비용          타일만      호출량 과금\n출발점        Mapbox v1   Mapbox 자체\nnpm 다운로드  200만/주    더 많음\n3D terrain    플러그인    내장';
  addCodeBlock(slide, 0.6, 2.15, cw, 2.2, compCode, false);

  slide.addText('실시간 업데이트 핵심 코드', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const mapCode = "// 다크 타일 설정 (Stadia 무료)\nconst map = new maplibregl.Map({\n  container: 'map',\n  style: 'https://tiles.stadiamaps.com'\n        + '/styles/alidade_smooth_dark.json',\n  center: [127.38, 36.35],\n  zoom: 12\n});\n\n// GeoJSON 소스 등록\nmap.on('load', () => {\n  map.addSource('events', {\n    type: 'geojson',\n    data: { type:'FeatureCollection', features:[] }\n  });\n  map.addLayer({ id:'circles', type:'circle',\n    source:'events',\n    paint: { 'circle-color': '#4A7BF7',\n             'circle-radius': 8 }\n  });\n});\n\n// SSE 수신 → 실시간 업데이트\nconst es = new EventSource('/events');\nes.onmessage = (e) => {\n  const data = JSON.parse(e.data);\n  const src = map.getSource('events');\n  src._data.features.push({\n    type:'Feature',\n    geometry:{type:'Point',\n      coordinates:[data.lng, data.lat]},\n    properties: data\n  });\n  src.setData(src._data);\n};";
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, mapCode, true);

  slide.addText('Stadia Maps 무료 다크 타일: 월 200,000 요청까지 무료, API 키 불필요', {
    x:0.6, y:4.55, w:cw, h:1.75, fontSize:12, fontFace:'Pretendard', color:'4A5568', lineSpacingMultiple:1.5, valign:'top', autoFit:true
  });
  addPageNum(slide, 31);
}

function slide32_section_implementation() {
  const slide = pptx.addSlide();
  addSectionDivider(slide, '06', '직접 만들기', '환경 초기화부터 ngrok 배포까지:\n6시간 구축 로드맵 + 단계별 코드');
  addPageNum(slide, 32);
}

function slide33_roadmap() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '6시간 구축 로드맵: 각 단계의 완료 기준을 확인하며 진행한다');
  const steps = [
    { step:'Step 1 (20분)', title:'환경 초기화', desc:'완료 기준: agent-browser snapshot 명령이 네이버에서 AXTree를 반환함', color:'4A7BF7' },
    { step:'Step 2 (90분)', title:'AXTree 크롤러 구현', desc:'완료 기준: 대전화재 관련 기사 10개를 data/events.json에 저장 성공', color:'00D4AA' },
    { step:'Step 3 (90분)', title:'온톨로지 예측 시스템', desc:'완료 기준: Claude API가 5개 도메인 분석 + 예측 JSON 1개 생성', color:'FFB020' },
    { step:'Step 4 (60분)', title:'멀티에이전트 하네스', desc:'완료 기준: 4개 터미널에서 /loop 실행 중, 30분 후 자동으로 이슈 1개 생성', color:'FF6B6B' },
    { step:'Step 5 (60분)', title:'실시간 대시보드', desc:'완료 기준: 브라우저에서 다크 지도에 마커가 표시되고 SSE로 실시간 업데이트', color:'8B5CF6' },
    { step:'Step 6 (10분)', title:'ngrok 배포', desc:'완료 기준: https://xxxx.ngrok-free.app 외부 URL로 접속 가능', color:'38BDF8' },
  ];
  steps.forEach(function(s, i) {
    const sy = 1.75 + i * 0.88;
    slide.addShape('roundRect', { x:0.6, y:sy, w:2.2, h:0.72, rectRadius:0.08, fill:{color:s.color} });
    slide.addText(s.step, { x:0.6, y:sy, w:2.2, h:0.72, fontSize:11, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', align:'center', valign:'middle' });
    slide.addShape('roundRect', { x:3.0, y:sy, w:9.73, h:0.72, rectRadius:0.08, fill:{color:'F7F9FC'} });
    slide.addText(s.title, { x:3.2, y:sy+0.05, w:3.0, h:0.3, fontSize:13, fontFace:'Pretendard SemiBold', bold:true, color:'1A1F36' });
    slide.addText('완료 기준: ' + s.desc.replace('완료 기준: ',''), { x:3.2, y:sy+0.37, w:9.3, h:0.3, fontSize:11, fontFace:'Pretendard', color:'4A5568', autoFit:true });
  });
  addPageNum(slide, 33);
}

function slide34_step1_init() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 1: 프로젝트 구조와 환경 초기화 (20분)');
  const cw = 5.865;
  slide.addText('디렉토리 구조', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const dirCode = 'mkdir assieye && cd assieye\ngit init\ngh repo create assieye --public\n\n# 디렉토리 생성\nmkdir -p src/{crawler,agents,api,frontend}\nmkdir -p data ontology scripts .claude/agents\n\n# 역할 설명\n# src/crawler/   - Playwright 크롤러\n# src/api/       - FastAPI 백엔드 (SSE)\n# src/frontend/  - MapLibre 대시보드\n# data/          - events.json, collected_urls.txt\n# ontology/      - JSON 스키마, 예측 리포트\n# .claude/agents/- 각 에이전트 CLAUDE.md';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, dirCode, true);

  slide.addText('패키지 설치', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const pkgCode = '# Python 환경\npython3 -m venv venv\nsource venv/bin/activate\n\npip install \\\n  playwright \\\n  anthropic \\\n  fastapi \\\n  uvicorn \\\n  sse-starlette \\\n  sqlalchemy \\\n  aiohttp \\\n  python-dotenv \\\n  pyngrok\n\n# Playwright 브라우저\nplaywright install chromium\n\n# agent-browser (Node.js 18+ 필요)\nnpm install -g agent-browser\nagent-browser install\n\n# 동작 확인\nagent-browser open "https://www.naver.com"\nagent-browser snapshot -i\n# → AXTree가 출력되면 설치 완료';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, pkgCode, true);
  addPageNum(slide, 34);
}

function slide35_step1_env() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 1 계속: .env 파일 구성과 주의사항');
  const envCode = "# .env 파일 생성\ncat > .env << 'EOF'\n# Claude API (필수)\nANTHROPIC_API_KEY=sk-ant-...\n# https://console.anthropic.com 에서 발급\n\n# 데이터베이스 (개발: SQLite, 운영: PostgreSQL)\nDATABASE_URL=sqlite:///./data/assieye.db\n\n# ngrok (무료 계정)\nNGROK_AUTHTOKEN=...\n# https://ngrok.com/signup 에서 발급\n\n# 수집 주기 (초 단위)\nCOLLECTION_INTERVAL=900   # 15분\nPREDICTION_INTERVAL=1800  # 30분\n\n# 모델 선택\n# 비용 절감: claude-haiku-4-5-20251001\n# 고품질: claude-opus-4-6\nCLAUDE_MODEL=claude-sonnet-4-6\n\n# GitHub (이슈 트래커용)\nGITHUB_TOKEN=ghp_...\nGITHUB_REPO=username/assieye\nEOF";
  addCodeBlock(slide, 0.6, 1.75, 12.13, 4.0, envCode, true);
  const warns = [
    { text:'.env를 절대 git commit하지 마세요 (.gitignore에 추가)', color:'FF6B6B' },
    { text:'ANTHROPIC_API_KEY 노출 시 즉시 revoke 하세요', color:'FF6B6B' },
    { text:'개발 중에는 claude-haiku 사용 권장 (비용 10배 저렴)', color:'4A7BF7' },
  ];
  warns.forEach(function(w, i) {
    slide.addShape('roundRect', { x:0.6, y:5.9 + i * 0.38, w:12.13, h:0.32, rectRadius:0.06, fill:{color:'FFF3E0'} });
    slide.addText('⚠️ ' + w.text, { x:0.8, y:5.92 + i * 0.38, w:11.73, h:0.28, fontSize:12, fontFace:'Pretendard', color:w.color, valign:'middle', autoFit:true });
  });
  addPageNum(slide, 35);
}

function slide36_step2a_crawler_base() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 2-A: Playwright AXTree 크롤러 기본 구조 (45분)');
  const code = '# src/crawler/base_crawler.py\nfrom playwright.async_api import async_playwright\nimport anthropic, json, asyncio\n\nclass AXTreeCrawler:\n    """AXTree 기반 크롤러. DOM 파싱 없이 의미론적 콘텐츠 추출."""\n\n    async def get_axtree(self, url: str) -> str:\n        """페이지의 AXTree 스냅샷 반환"""\n        async with async_playwright() as p:\n            browser = await p.chromium.launch(headless=True)\n            context = await browser.new_context(\n                user_agent="Mozilla/5.0 (compatible; DisasterMonitor/1.0)"\n            )\n            page = await context.new_page()\n            try:\n                await page.goto(url, wait_until="domcontentloaded", timeout=30000)\n                # 핵심: aria_snapshot()으로 AXTree 추출\n                snapshot = await page.locator("body").aria_snapshot()\n                return snapshot\n            except Exception as e:\n                return f"ERROR: {e}"\n            finally:\n                await browser.close()\n\n    async def parse_with_claude(self, snapshot: str, keyword: str) -> list:\n        """AXTree를 Claude로 파싱해 구조화된 데이터 추출"""\n        client = anthropic.AsyncAnthropic()\n        response = await client.messages.create(\n            model="claude-haiku-4-5-20251001",  # 파싱은 Haiku로 절약\n            max_tokens=2000,\n            messages=[{"role":"user","content":\n                f"다음 AXTree에서 \'{keyword}\' 관련 항목을 추출하세요.\\n"\n                f"JSON 배열: [{{\'title\':\'...\',\'url\':\'...\',\'time\':\'...\'}}]\\n\\n"\n                f"{snapshot[:5000]}"\n            }]\n        )\n        try:\n            return json.loads(response.content[0].text)\n        except:\n            return []';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 36);
}

function slide37_step2b_naver_crawler() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 2-B: 네이버 뉴스 크롤러 + 중복 제거 로직 (45분)');
  const cw = 5.865;
  slide.addText('네이버 뉴스 크롤러', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const leftCode = '# src/crawler/naver_crawler.py\nfrom .base_crawler import AXTreeCrawler\nimport json, os\nfrom datetime import datetime\n\nNAVER_URL = (\n  "https://search.naver.com/search.naver"\n  "?where=news&query={keyword}&sort=1"\n  # sort=1: 최신순\n)\n\nclass NaverNewsCrawler(AXTreeCrawler):\n    def __init__(self, keyword: str):\n        self.keyword = keyword\n        self.collected_file = "data/collected_urls.txt"\n        self.events_file = "data/events.json"\n\n    def is_duplicate(self, url: str) -> bool:\n        if not os.path.exists(self.collected_file):\n            return False\n        with open(self.collected_file) as f:\n            return url in f.read().splitlines()\n\n    async def crawl(self) -> int:\n        url = NAVER_URL.format(keyword=self.keyword)\n        snapshot = await self.get_axtree(url)\n        items = await self.parse_with_claude(\n          snapshot, self.keyword)\n        new_count = 0\n        for item in items:\n            if self.is_duplicate(item.get("url","")):\n                continue\n            item["source"] = "naver"\n            item["collected_at"] = datetime.now().isoformat()\n            self._append_event(item)\n            new_count += 1\n        return new_count';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, leftCode, true);

  slide.addText('이벤트 저장 + 중복 제거', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const rightCode = '    def _append_event(self, item: dict):\n        """events.json에 append (덮어쓰기 금지)"""\n        events = []\n        if os.path.exists(self.events_file):\n            with open(self.events_file) as f:\n                events = json.load(f)\n        events.append(item)\n        with open(self.events_file, "w") as f:\n            json.dump(events, f,\n              ensure_ascii=False, indent=2)\n        # URL 기록\n        with open(self.collected_file, "a") as f:\n            f.write(item.get("url","") + "\\n")\n\n# 실행 예시\nasync def main():\n    crawler = NaverNewsCrawler("대전화재")\n    count = await crawler.crawl()\n    print(f"새로 수집: {count}건")\n\nimport asyncio\nasyncio.run(main())';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, rightCode, true);
  addPageNum(slide, 37);
}

function slide38_step3a_ontology_schema() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 3-A: 온톨로지 JSON 스키마 설계와 초기 데이터 입력 (45분)');
  const code = '# ontology/disaster_schema.json 초기 구조 생성\nimport json\n\nschema = {\n    "disaster_id": "daejeon-fire-20260321",\n    "disaster_type": "fire",\n    "location": {\n        "name": "대전 안전공업",\n        "lat": 36.35, "lng": 127.38,\n        "address": "대전광역시 대덕구 산업단지"\n    },\n    "domains": {\n        "incident": {\n            "start_time": "2026-03-21T13:17:00+09:00",\n            "current_status": "진압완료",\n            "fire_suppression_rate": 100,\n            "progression_log": [\n                {"time": "13:17", "event": "화재 발생"},\n                {"time": "13:53", "event": "주변 건물 위협"},\n                {"time": "16:53", "event": "진압 본격화"},\n                {"time": "19:00", "event": "완전 진화"}\n            ]\n        },\n        "space": {\n            "building_floors": 5,\n            "building_type": "화학공장",\n            "area_sqm": 2500,\n            "hazardous_materials": ["나트륨(Na)"],\n            "construction_year": 1998\n        },\n        "resources": {\n            "firefighters": 115, "vehicles": 46, "robots": 2,\n            "suppression_constraints": [\n                "나트륨과 물 반응으로 물 사용 금지",\n                "건물 내부 구조 불명으로 진입 제한"\n            ]\n        },\n        "casualties": {\n            "dead": 11, "injured": 59, "missing": 3,\n            "injury_breakdown": {"critical": 24, "minor": 31, "hospitalized": 18}\n        },\n        "secondary_risks": []\n    },\n    "turn": 0\n}\nwith open("ontology/disaster_schema.json", "w") as f:\n    json.dump(schema, f, ensure_ascii=False, indent=2)\nprint("온톨로지 스키마 생성 완료")';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 38);
}

function slide39_step3b_prediction_code() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 3-B: Claude API 예측 리포트 생성 코드 (45분)');
  const code = '# src/agents/prediction_agent.py\nimport anthropic, json, glob, os\nfrom datetime import datetime\n\nSYSTEM_PROMPT = """당신은 재난 분석 전문가입니다.\n5개 도메인의 인과관계를 분석해 향후 시나리오를 예측합니다.\n반드시 JSON 형식으로만 응답하세요."""\n\nasync def generate_prediction_report(turn: int) -> dict:\n    client = anthropic.AsyncAnthropic()\n\n    with open("ontology/disaster_schema.json") as f:\n        ontology = json.load(f)\n\n    prev_report = None\n    prev_files = sorted(glob.glob("ontology/report_*.json"))\n    if prev_files:\n        with open(prev_files[-1]) as f:\n            prev_report = json.load(f)\n\n    events = []\n    if os.path.exists("data/events.json"):\n        with open("data/events.json") as f:\n            events = json.load(f)[-20:]\n\n    user_msg = f"""현재 상황 (Turn {turn}):\n온톨로지: {json.dumps(ontology, ensure_ascii=False)}\n최신 이벤트: {json.dumps(events, ensure_ascii=False)}\n이전 예측: {json.dumps(prev_report, ensure_ascii=False) if prev_report else "없음"}\n\nJSON 응답:\n{{"turn":{turn},"verified_predictions":[],"new_variables":[],"predictions":[{{"scenario":"...","probability":0.0,"basis":"...","timeframe":"단기|중기|장기","domain":"..."}}],"methodology_update":"..."}}"""\n\n    for attempt in range(3):\n        try:\n            response = await client.messages.create(\n                model="claude-opus-4-6", max_tokens=3000,\n                system=SYSTEM_PROMPT,\n                messages=[{"role":"user","content":user_msg}]\n            )\n            result = json.loads(response.content[0].text)\n            result["generated_at"] = datetime.now().isoformat()\n            fname = f"ontology/report_{turn:03d}.json"\n            with open(fname, "w") as f:\n                json.dump(result, f, ensure_ascii=False, indent=2)\n            print(f"Turn {turn} 리포트 생성: {fname}")\n            return result\n        except Exception as e:\n            import asyncio\n            await asyncio.sleep(2 ** attempt)';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 39);
}

function slide40_step4_harness() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 4: 멀티에이전트 하네스 구성 (60분)');
  const cw = 5.865;
  slide.addText('수집 에이전트 CLAUDE.md', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const mdCode = '# 수집 에이전트 (15분 주기)\n\n## 역할\n인터넷에서 대전화재 관련 신규\n게시물을 수집해 저장한다.\n\n## 수집 순서\n1. 네이버 뉴스\n   URL: https://search.naver.com/...\n2. YouTube\n   URL: https://www.youtube.com/...\n\n## 각 사이트 작업 절차\n1. agent-browser open [URL]\n2. agent-browser snapshot -i\n3. 게시물 제목·링크 추출\n4. data/collected_urls.txt 확인\n5. 신규만 data/events.json에 추가\n6. URL을 collected_urls.txt에 기록\n\n## 절대 규칙\n- events.json: append만 (덮어쓰기 X)\n- 다른 디렉토리 파일 수정 금지\n- 오류 발생 시 건너뛰고 계속';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, mdCode, false);

  slide.addText('tmux 구동 스크립트', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const shCode = '#!/bin/bash\n# scripts/start_agents.sh\n\nPROJECT="/home/user/assieye"\ncd $PROJECT && source venv/bin/activate\n\n# 기존 세션 정리\ntmux kill-session -t collector 2>/dev/null\ntmux kill-session -t predictor 2>/dev/null\ntmux kill-session -t tester    2>/dev/null\ntmux kill-session -t developer 2>/dev/null\n\n# 4개 세션 생성\nfor agent in collector predictor tester developer; do\n  tmux new-session -d -s $agent \\\n    "cd $PROJECT && source venv/bin/activate && claude"\ndone\n\nsleep 3  # Claude 초기화 대기\n\n# /loop 설정\ntmux send-keys -t collector \\\n  "/loop 15m .claude/agents/collector.md 지침 실행" Enter\ntmux send-keys -t predictor \\\n  "/loop 30m .claude/agents/predictor.md 지침 실행" Enter\ntmux send-keys -t tester \\\n  "/loop 30m .claude/agents/tester.md 지침 실행" Enter\ntmux send-keys -t developer \\\n  "/loop 30m GitHub Issues 확인 후 최우선 이슈 해결" Enter\n\necho "4개 에이전트 시작 완료"\ntmux ls';
  addCodeBlock(slide, 6.865, 2.15, cw, 4.5, shCode, true);
  addPageNum(slide, 40);
}

function slide41_step5a_fastapi() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 5-A: FastAPI + SSE 백엔드 구현 (30분)');
  const code = '# src/api/main.py\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.staticfiles import StaticFiles\nfrom sse_starlette.sse import EventSourceResponse\nimport asyncio, json, glob, os\n\napp = FastAPI(title="AssiEye API")\n\napp.add_middleware(CORSMiddleware,\n    allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])\n\napp.mount("/static", StaticFiles(directory="src/frontend"), name="static")\n\n@app.get("/events")\nasync def stream_events(since: int = 0):\n    """SSE: data/events.json의 신규 항목을 실시간 스트리밍"""\n    async def generator():\n        last_count = since\n        while True:\n            try:\n                with open("data/events.json") as f:\n                    events = json.load(f)\n                if len(events) > last_count:\n                    for event in events[last_count:]:\n                        yield {"event": "new_event",\n                               "data": json.dumps(event, ensure_ascii=False)}\n                    last_count = len(events)\n            except FileNotFoundError:\n                pass\n            await asyncio.sleep(10)\n    return EventSourceResponse(generator())\n\n@app.get("/ontology/latest")\nasync def get_latest_report():\n    """최신 예측 리포트 반환"""\n    reports = sorted(glob.glob("ontology/report_*.json"))\n    if not reports:\n        return {"error": "no reports yet"}\n    with open(reports[-1]) as f:\n        return json.load(f)\n\n@app.get("/stats")\nasync def get_stats():\n    events = []\n    if os.path.exists("data/events.json"):\n        with open("data/events.json") as f:\n            events = json.load(f)\n    return {"total_events": len(events),\n            "by_source": {s: len([e for e in events if e.get("source")==s])\n                         for s in ["naver","youtube","twitter","instagram"]}}\n\n# 실행: uvicorn src.api.main:app --reload --port 8000';
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 41);
}

function slide42_step5b_maplibre() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 5-B: MapLibre GL 다크 대시보드 구현 (30분)');
  const code = "<!-- src/frontend/index.html 핵심 부분 -->\n<link rel=\"stylesheet\" href=\"https://unpkg.com/maplibre-gl/dist/maplibre-gl.css\">\n<script src=\"https://unpkg.com/maplibre-gl/dist/maplibre-gl.js\"></script>\n\n<div id=\"map\" style=\"width:100%;height:100vh;\"></div>\n\n<script>\nconst map = new maplibregl.Map({\n  container: 'map',\n  style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',\n  center: [127.38, 36.35], zoom: 12\n});\n\nmap.on('load', () => {\n  map.addSource('events', { type:'geojson', data:{type:'FeatureCollection',features:[]} });\n  map.addLayer({ id:'circles', type:'circle', source:'events',\n    paint:{\n      'circle-radius': ['case',\n        ['==',['get','source'],'naver'], 8,\n        ['==',['get','source'],'youtube'], 10, 7],\n      'circle-color': ['case',\n        ['==',['get','source'],'naver'],   '#4A7BF7',\n        ['==',['get','source'],'youtube'], '#FF0000',\n        ['==',['get','source'],'twitter'], '#1DA1F2', '#AAAAAA'],\n      'circle-opacity': 0.85\n    }\n  });\n  map.on('click','circles', e => {\n    const p = e.features[0].properties;\n    new maplibregl.Popup()\n      .setLngLat(e.lngLat)\n      .setHTML(`<b>${p.title}</b><br>${p.source}`)\n      .addTo(map);\n  });\n});\n\n// SSE 연결: 실시간 업데이트\nconst es = new EventSource('/events');\nes.addEventListener('new_event', e => {\n  const event = JSON.parse(e.data);\n  if (!event.lat || !event.lng) return;\n  const src = map.getSource('events');\n  const data = src._data;\n  data.features.push({\n    type:'Feature',\n    geometry:{type:'Point',coordinates:[event.lng,event.lat]},\n    properties: event\n  });\n  src.setData(data);\n});\n</script>";
  addCodeBlock(slide, 0.6, 1.75, 12.13, 5.0, code, true);
  addPageNum(slide, 42);
}

function slide43_step6_deploy() {
  const slide = pptx.addSlide();
  addTitleBar(slide, 'Step 6: ngrok으로 로컬 서버를 외부에 공개 (10분)');
  const cw = 5.865;
  slide.addText('Python에서 자동화', { x:0.6, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'4A7BF7' });
  const pyCode = '# scripts/start_server.py\nimport uvicorn\nfrom pyngrok import ngrok\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\n# ngrok 인증\nngrok.set_auth_token(os.getenv("NGROK_AUTHTOKEN"))\n\n# 터널 생성\ntunnel = ngrok.connect(8000)\npublic_url = tunnel.public_url\nprint(f"외부 URL: {public_url}")\nprint(f"ngrok 대시보드: http://localhost:4040")\n\n# URL을 파일에 저장\nwith open("data/public_url.txt", "w") as f:\n    f.write(public_url)\n\n# FastAPI 서버 시작\nuvicorn.run(\n    "src.api.main:app",\n    host="0.0.0.0",\n    port=8000,\n    reload=False\n)';
  addCodeBlock(slide, 0.6, 2.15, cw, 4.5, pyCode, true);

  slide.addText('ngrok 제약 & 대안', { x:6.865, y:1.75, w:cw, h:0.35, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FF6B6B' });
  const altText = '무료 플랜 제약:\n• 터널 1개 (동시)\n• 랜덤 URL (재시작마다 변경)\n• 월 20,000 요청 제한\n• HTTP 기본 인증 없음\n\n해결 방법 (무료):\n• Cloudflare Tunnel (고정 URL)\n  cloudflared tunnel create assieye\n  → 무료, 도메인 연결 가능\n\n유료 대안:\n• ngrok 개인 플랜 $8/월\n  → 고정 URL, 기본 인증\n\n공개 서버 배포:\n• Railway.app / Render.com\n  → 무료 플랜으로 24/7 운영';
  slide.addShape('roundRect', { x:6.865, y:2.15, w:cw, h:4.5, rectRadius:0.08, fill:{color:'F7F9FC'} });
  slide.addText(altText, { x:7.065, y:2.3, w:cw-0.4, h:4.2, fontSize:12, fontFace:'Pretendard', color:'4A5568', lineSpacingMultiple:1.35, valign:'top', autoFit:true });
  addPageNum(slide, 43);
}

function slide44_cost_and_pitfalls() {
  const slide = pptx.addSlide();
  addTitleBar(slide, '비용 추정과 반드시 피해야 할 5가지 함정');
  addStyledTable(slide,
    ['서비스','무료 한도','초과 시 단가','24시간 예상 비용'],
    [
      ['Claude API (Sonnet)','없음','$3/M input + $15/M output','$20~60/일'],
      ['Claude API (Haiku)','없음','$0.25/M input + $1.25/M output','$2~8/일 (권장)'],
      ['Stadia Maps','200K 요청/월','$0.15/1K','$0 (한도 내)'],
      ['ngrok 무료','20K 요청/월','-','$0 (단기 시연용)'],
      ['Cloudflare Tunnel','무제한','무료','$0'],
      ['합계 (Haiku 혼용)','-','-','$5~15/일 현실적 추정'],
    ],
    { y:1.75, h:3.3 }
  );
  const pitfalls = [
    '❶ 크롤링 이용약관 위반 → 네이버/YouTube/SNS 공식 API로 대체 (네이버: developers.naver.com)',
    '❷ /loop 세션 종료 → tmux 필수, 서버 재시작 시 start_agents.sh 자동 실행 등록',
    '❸ 에이전트 Git 충돌 → 에이전트별 전담 파일 지정, CLAUDE.md에 명시',
    '❹ Claude API rate limit 429 → 지수 백오프 (2^attempt 초 대기)',
    '❺ 온톨로지 품질 저하 → 초기 JSON 스키마와 시스템 프롬프트 설계에 집중 투자',
  ];
  pitfalls.forEach(function(p, i) {
    slide.addShape('roundRect', { x:0.6, y:5.25 + i * 0.38, w:12.13, h:0.32, rectRadius:0.06, fill:{color: i % 2 === 0 ? 'FFF3E0' : 'F7F9FC'} });
    slide.addText(p, { x:0.8, y:5.27 + i * 0.38, w:11.73, h:0.28, fontSize:11, fontFace:'Pretendard', color:'4A5568', valign:'middle', autoFit:true });
  });
  addPageNum(slide, 44);
}

function slide45_closing() {
  const slide = pptx.addSlide();
  slide.addShape('rect', { x:0, y:0, w:13.33, h:7.5, fill:{color:'1A1F36'} });
  slide.addShape('rect', { x:0, y:5.8, w:13.33, h:1.7, fill:{color:'0F1424'} });
  slide.addShape('rect', { x:1.0, y:1.0, w:1.5, h:0.06, fill:{color:'00D4AA'} });
  slide.addText('3가지 기술이 만드는\n자율 재난 대응 AI 시스템', {
    x:1.0, y:1.1, w:11.33, h:1.5, fontSize:32, fontFace:'Pretendard ExtraBold', bold:true,
    color:'FFFFFF', lineSpacingMultiple:1.2
  });
  const summaries = [
    { num:'01', title:'Cheliped Browser', body:'접근성 트리(AXTree)로 웹을 탐색\n토큰 51~93% 절약, vercel-labs/agent-browser 오픈소스', color:'4A7BF7' },
    { num:'02', title:'온톨로지 AI 예측', body:'5개 도메인 JSON + 프롬프트 설계만으로\n인과관계 분석 → 30분마다 자기 진화', color:'00D4AA' },
    { num:'03', title:'하네스 엔지니어링', body:'/loop + tmux + 공유 파일로\n4개 에이전트가 사람 없이 협력', color:'FFB020' },
  ];
  summaries.forEach(function(s, i) {
    const sx = 0.7 + i * 4.0;
    slide.addShape('roundRect', { x:sx, y:2.85, w:3.7, h:2.55, rectRadius:0.1, fill:{color:'252C45'} });
    slide.addShape('rect', { x:sx+0.02, y:2.85, w:3.66, h:0.06, fill:{color:s.color} });
    slide.addText(s.num, { x:sx+0.15, y:2.97, w:0.6, h:0.45, fontSize:18, fontFace:'Pretendard ExtraBold', bold:true, color:s.color });
    slide.addText(s.title, { x:sx+0.8, y:3.0, w:2.7, h:0.4, fontSize:14, fontFace:'Pretendard SemiBold', bold:true, color:'FFFFFF', autoFit:true });
    slide.addText(s.body, { x:sx+0.15, y:3.5, w:3.4, h:0.85, fontSize:11, fontFace:'Pretendard', color:'A0AEC0', lineSpacingMultiple:1.35, valign:'top', autoFit:true });
  });
  slide.addText('후속 탐색 질문', { x:1.0, y:5.5, w:3.0, h:0.3, fontSize:12, fontFace:'Pretendard SemiBold', bold:true, color:'00D4AA' });
  const qs = [
    '크롤링 대신 공식 API 전환 시 아키텍처 변화는?',
    '온톨로지 예측 정확도를 어떻게 측정하고 개선할 수 있나?',
    '재난 외 다른 토픽으로 확장 시 온톨로지 재설계 방법은?',
  ];
  qs.forEach(function(q, i) {
    slide.addText('Q' + (i+1) + '. ' + q, { x:1.0, y:5.85 + i * 0.3, w:11.33, h:0.28, fontSize:11, fontFace:'Pretendard', color:'718096', autoFit:true });
  });
  slide.addText('리서치 저장 경로: docs/research/2026-03-21-ai-disaster-response-assieye/', {
    x:1.0, y:6.8, w:11.33, h:0.28, fontSize:11, fontFace:'Pretendard', color:'4A5568'
  });
  addPageNum(slide, 45);
}

// ─── EXECUTE ALL SLIDES ───────────────────────────────────────────────────────
slide01_title();
slide02_overview_kpi();
slide03_ui_layout();
slide04_three_tech_overview();
slide05_section_cheliped();
slide06_crawling_problem();
slide07_axtree_principle();
slide08_agent_dom_mechanism();
slide09_token_table();
slide10_agent_browser_install();
slide11_claude_code_skill_pattern();
slide12_two_implementation();
slide13_section_ontology();
slide14_ontology_concept();
slide15_five_domains();
slide16_causal_chain();
slide17_json_schema();
slide18_prediction_prompt();
slide19_self_evolution();
slide20_prediction_example();
slide21_section_harness();
slide22_four_agents();
slide23_agent_communication();
slide24_loop_skill();
slide25_tmux_setup();
slide26_claude_md_example();
slide27_git_conflict_prevention();
slide28_section_architecture();
slide29_full_architecture();
slide30_sse_vs_websocket();
slide31_maplibre();
slide32_section_implementation();
slide33_roadmap();
slide34_step1_init();
slide35_step1_env();
slide36_step2a_crawler_base();
slide37_step2b_naver_crawler();
slide38_step3a_ontology_schema();
slide39_step3b_prediction_code();
slide40_step4_harness();
slide41_step5a_fastapi();
slide42_step5b_maplibre();
slide43_step6_deploy();
slide44_cost_and_pitfalls();
slide45_closing();

// ─── SAVE ─────────────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: 'AssiEye_AI재난대응시스템_개발가이드.pptx' })
  .then(function() { console.log('PPTX 생성 완료: AssiEye_AI재난대응시스템_개발가이드.pptx'); })
  .catch(function(err) { console.error('오류:', err); process.exit(1); });

