# Phase 3: Assembler + Validator

메인이 직접 수행한다. 모든 Slide Builder 파트를 합치고, 검증하고, 실행한다.

## Step 1: 합치기 전 검증

(a) 후속 파트에서 상수/헬퍼 재정의가 없는지 확인:

```bash
grep -l "const COLORS\|const FONTS\|const TABLE_STYLE\|const TOTAL_SLIDES" part-2.js part-3.js ... && echo "ERROR: 후속 파트에서 상수 재정의 발견"
```

(b) 모든 파트(Part 1 포함)에서 함수 호출문이 없는지 확인:

```bash
grep -nE '^slide[0-9]+_[a-zA-Z0-9_]+\(\);' part-*.js && echo "ERROR: 파트에서 함수 호출문 발견 — 제거 필요"
```

발견 시 해당 호출 블록을 제거한다. Part 1이 "슬라이드 실행" 블록을 포함하는 것은 흔한 실수이다.

## Step 2: 마커 기반 합치기

각 파트 파일에서 `// === Part N 시작 ===`과 `// === Part N 끝 ===` 사이의 내용만 추출하여 합침. sed 줄번호 기반 절삭은 금지한다.

```bash
# Part 1: module.exports 또는 함수 호출 블록 직전까지
awk '/^module\.exports/{exit} /^slide[0-9]+_[a-zA-Z0-9_]+\(\);/{next} /슬라이드 실행/{next} {print}' part-1.js > generate-presentation.js

# Part 2~N: 시작/끝 마커 제외, 함수 본체만
awk 'NR==1 && /Part 2/{next} /Part 2 끝/{next} {print}' part-2.js >> generate-presentation.js
# ... 반복
```

## Step 3: 실행 블록 자동 생성

모든 파트 파일에서 함수명을 grep으로 추출하여 호출 코드 + writeFile 자동 생성:

```bash
grep -ohE 'function (slide[0-9]+_[a-zA-Z0-9_]+)' generate-presentation.js | awk '{print $2"();"}' >> generate-presentation.js
echo "pptx.writeFile({ fileName: 'output.pptx' })..." >> generate-presentation.js
```

## Step 4: 디자인 규칙 검증 + 자동 수정

```bash
# 검증만 실행하여 위반 리포트 확인
node scripts/validate-pptx-code.js generate-presentation.js

# 위반 발견 시 자동 수정
node scripts/validate-pptx-code.js generate-presentation.js --fix

# 수정 후 재검증 (CLEAN 확인)
node scripts/validate-pptx-code.js generate-presentation.js
```

검증 규칙: 미정의 COLORS/LIGHT 키, FONTS 객체 직접 사용, addShape('line'), shadow, 빈 color, rotate

## Step 5: 실행

```bash
node --check generate-presentation.js && node generate-presentation.js
```

## Step 6: 오류 시

- 검증 실패 → 해당 파트의 Slide Builder 재실행 (오류 내용 포함)
- node 실행 실패 → 함수명 불일치 등 수정
- 최대 2회 재시도 후 수동 개입
