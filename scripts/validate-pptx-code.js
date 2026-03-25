#!/usr/bin/env node
/**
 * validate-pptx-code.js
 * PptxGenJS 생성 코드의 OOXML 호환성을 자동 검증한다.
 *
 * 사용법: node scripts/validate-pptx-code.js <파일경로>
 * 결과: PASS 또는 FAIL + 구체적 위치
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node validate-pptx-code.js <file.js>');
  process.exit(1);
}

const code = fs.readFileSync(path.resolve(filePath), 'utf8');
const lines = code.split('\n');

const issues = [];

function addIssue(severity, line, col, message) {
  issues.push({ severity, line, col, message });
}

// 1. 8자리 hex 색상 체크
lines.forEach((l, i) => {
  const matches = l.matchAll(/color:\s*['"]([0-9A-Fa-f]+)['"]/g);
  for (const m of matches) {
    if (m[1].length === 8) {
      addIssue('ERROR', i + 1, m.index, `8자리 hex 색상 '${m[1]}' → PowerPoint 복구 다이얼로그 원인. 6자리로 변경 필요`);
    }
  }
});

// 2. 음수 w/h 체크
lines.forEach((l, i) => {
  const negW = l.match(/w:\s*-[\d.]+/);
  if (negW) addIssue('ERROR', i + 1, negW.index, `음수 width '${negW[0]}' → OOXML 스펙 위반`);
  const negH = l.match(/h:\s*-[\d.]+/);
  if (negH) addIssue('ERROR', i + 1, negH.index, `음수 height '${negH[0]}' → OOXML 스펙 위반`);
});

// 3. w: 0 또는 h: 0 체크
lines.forEach((l, i) => {
  if (l.match(/[wh]:\s*0[,\s}]/) && !l.includes('//')) {
    addIssue('WARN', i + 1, 0, `w:0 또는 h:0 감지 → 일부 PowerPoint에서 렌더링 오류. 최소 0.01 사용 권장`);
  }
});

// 4. shadow + opacity 체크
lines.forEach((l, i) => {
  if (l.includes('shadow') && l.includes('opacity')) {
    addIssue('ERROR', i + 1, 0, `shadow에 opacity 속성 사용 → PowerPoint 복구 원인. shadow 대신 line border 사용`);
  }
});

// 5. addShape('line') 체크
lines.forEach((l, i) => {
  if (l.match(/addShape\s*\(\s*['"]line['"]/)) {
    addIssue('WARN', i + 1, 0, `addShape('line') 사용 → h:0 또는 음수 치수 위험. rect + 텍스트 화살표 권장`);
  }
});

// 6. addShape('diamond') 체크
lines.forEach((l, i) => {
  if (l.match(/addShape\s*\(\s*['"]diamond['"]/)) {
    addIssue('ERROR', i + 1, 0, `addShape('diamond') → PptxGenJS 호환성 불확실. roundRect로 대체`);
  }
});

// 7. rotate 속성 체크
lines.forEach((l, i) => {
  if (l.match(/rotate:\s*\d/) && !l.includes('//')) {
    addIssue('WARN', i + 1, 0, `rotate 속성 사용 → 일부 도형에서 렌더링 문제 가능`);
  }
});

// 8. 함수 정의-호출 일치 체크
const definedFuncs = new Set();
const calledFuncs = new Set();

lines.forEach((l) => {
  const defMatch = l.match(/^function\s+(slide\d+_\w+)\s*\(/);
  if (defMatch) definedFuncs.add(defMatch[1]);

  const callMatches = l.matchAll(/(slide\d+_\w+)\s*\(\s*\)/g);
  for (const m of callMatches) {
    if (!l.trimStart().startsWith('function')) {
      calledFuncs.add(m[1]);
    }
  }
});

for (const func of calledFuncs) {
  if (!definedFuncs.has(func)) {
    addIssue('ERROR', 0, 0, `함수 '${func}' 호출되었으나 정의되지 않음`);
  }
}

for (const func of definedFuncs) {
  if (!calledFuncs.has(func)) {
    addIssue('WARN', 0, 0, `함수 '${func}' 정의되었으나 호출되지 않음`);
  }
}

// 결과 출력
const errors = issues.filter(i => i.severity === 'ERROR');
const warnings = issues.filter(i => i.severity === 'WARN');

console.log('=== PptxGenJS 코드 검증 결과 ===\n');

if (issues.length === 0) {
  console.log('PASS - 문제 없음\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log(`ERROR: ${errors.length}건 (수정 필수)`);
  errors.forEach(e => {
    const loc = e.line > 0 ? `  Line ${e.line}: ` : '  ';
    console.log(`${loc}${e.message}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log(`WARN: ${warnings.length}건 (권장 수정)`);
  warnings.forEach(w => {
    const loc = w.line > 0 ? `  Line ${w.line}: ` : '  ';
    console.log(`${loc}${w.message}`);
  });
  console.log('');
}

if (errors.length > 0) {
  console.log('FAIL - ERROR 수정 후 재실행 필요');
  process.exit(1);
} else {
  console.log('PASS (with warnings) - 경고 확인 후 진행 가능');
  process.exit(0);
}
