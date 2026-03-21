// 수정 후: addTitleBar의 w:12.13, h:0.9, autoFit:true
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';

const COLORS = {
  bg_dark: '1A1F36', text_primary: '1A1F36', text_secondary: '4A5568',
  text_tertiary: '718096', accent_blue: '4A7BF7', text_on_dark: 'FFFFFF',
};

// 수정 버전 addTitleBar (w:12.13, h:0.9, autoFit:true)
function addTitleBar_AFTER(slide, title, subtitle = '') {
  slide.addShape('rect', { x: 0.6, y: 0.5, w: 1.2, h: 0.06, fill: { color: COLORS.accent_blue } });
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    fontSize: 28, fontFace: 'Pretendard SemiBold', bold: true,
    color: COLORS.text_primary, charSpacing: -0.3,
    autoFit: true
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6, y: 1.6, w: 12.13, h: 0.4,
      fontSize: 16, fontFace: 'Pretendard', color: COLORS.text_tertiary
    });
  }
}

// 동일한 테스트 케이스
const testTitles = [
  'Q3 매출이 전년 대비 23% 성장했습니다',
  '멀티에이전트 프레임워크 6개 모두 OpenAI-compatible API를 지원한다',
  '서브에이전트 실패 시 재시도와 Graceful Degradation을 적용한다',
  'Qwen3-235B-A22B의 Function Calling 안정성과 Instruction Following 능력을 먼저 검증한다',
  'Self-hosted LLM의 제약을 고려한 하이브리드 멀티에이전트 오케스트레이션 아키텍처를 설계한다',
];

testTitles.forEach((title, i) => {
  const slide = pptx.addSlide();
  addTitleBar_AFTER(slide, title);
  slide.addText(`테스트 ${i + 1}: "${title.substring(0, 20)}..." 의 본문 콘텐츠가 여기에 위치합니다.`, {
    x: 0.6, y: 1.8, w: 12.13, h: 4.8,
    fontSize: 18, fontFace: 'Pretendard', color: COLORS.text_secondary,
    valign: 'top',
  });
  // 제목 영역 경계를 시각화하는 디버그 박스
  slide.addShape('rect', {
    x: 0.6, y: 0.65, w: 12.13, h: 0.9,
    line: { color: '00D4AA', width: 1 },
    fill: { color: 'FFFFFF', transparency: 100 }
  });
});

const outputPath = path.join(__dirname, 'with_skill/outputs/after-fix.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`저장: ${outputPath}`))
  .catch(err => console.error(err));
