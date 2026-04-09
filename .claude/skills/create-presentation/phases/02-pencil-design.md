# Phase 2: Pencil Designer (병렬)

승인된 아웃라인을 기반으로 Pencil MCP로 슬라이드 디자인 구조를 생성하는 서브에이전트.

## 파트 분할 기준

총 슬라이드 수 / 8~10 (각 파트 8~10장). 예: 24장 → 3파트.
batch_design은 최대 25 ops/call이므로 슬라이드당 평균 5~8 ops 예상.

## 서브에이전트 설정

```
model: sonnet
mode: bypassPermissions
allowed-tools: mcp__pencil__get_editor_state, mcp__pencil__open_document, mcp__pencil__batch_design, mcp__pencil__batch_get, mcp__pencil__get_screenshot, mcp__pencil__get_guidelines
```

## 메인이 발사 전 해야 할 일

1. 해당 파트의 아웃라인 슬라이드 전체 내용을 프롬프트에 직접 붙여넣기
2. 필요한 수치/콘텐츠 데이터를 프롬프트 안에 inline으로 제공
3. `references/pencil-to-html.md`의 "슬라이드 타입별 Pencil 노드 구조" 섹션을 프롬프트에 삽입
4. `references/design-system-html.md`의 CSS 변수 전체 정의를 프롬프트에 삽입

## Pencil Designer 프롬프트 템플릿

```
# 역할: Pencil Designer — 슬라이드 디자인 구조 생성

## 임무
아래 아웃라인의 슬라이드 {시작번호}~{끝번호}를 Pencil MCP로 설계하라.
각 슬라이드는 1280×720px frame으로 생성한다 (16:9 비율).

## 아웃라인
{해당 범위의 아웃라인 — 슬라이드 타입 + 액션 타이틀 + 콘텐츠 내용}

## 콘텐츠 소스
{메인이 추출한 슬라이드별 텍스트/수치 데이터}

## Pencil 노드 구조 레퍼런스
{references/pencil-to-html.md의 슬라이드 타입별 노드 구조 전체}

## 디자인 변수
{references/design-system-html.md의 CSS 변수 정의}

## 작업 순서

### 1. 에디터 초기화
- mcp__pencil__get_editor_state({ include_schema: true }) 호출
- 현재 상태 확인. .pen 파일이 없으면 open_document("new") 호출

### 2. 슬라이드 프레임 생성 (슬라이드당 1 batch_design 호출 권장)
각 슬라이드에 대해:
1) 슬라이드 frame 생성 (1280×720, 슬라이드 타입에 맞는 레이아웃)
2) 자식 노드 추가 (타이틀바, 콘텐츠, 텍스트 등)
3) 레퍼런스의 노드 구조를 정확히 따를 것

노드 ID 규칙:
- 메인 프레임: slide-{N} (N은 전체 슬라이드 번호)
- 자식: slide-{N}-titlebar, slide-{N}-content 등

### 3. 배치 후 스크린샷 검증
각 batch_design 완료 후:
- mcp__pencil__get_screenshot({ nodeId: "slide-{N}" }) 호출
- 텍스트가 잘리거나 레이아웃이 깨진 경우 → batch_design으로 수정
- 색상이 design-system 가드레일을 위반한 경우 → 수정

### 4. 산출물
- .pen 파일에 슬라이드 {시작번호}~{끝번호} 프레임이 저장됨
- 각 슬라이드 스크린샷 검증 완료
- 작업 결과 요약 (완료된 슬라이드 목록, 특이사항)

## 중요 가드레일
- bg-dark(#1A1F36)는 표지/섹션 좌측/테이블 헤더에만 사용
- accent 색상은 타이틀바(4px), 뱃지, KPI 숫자에만 — 넓은 배경 금지
- 연속 동일 타입 3장 이상 금지 (아웃라인이 이미 다양성 확보했을 것)
- 액션 타이틀이 길면 font-size 줄이기 (wrap 허용)
```

## Phase 3: HTML 변환으로 전환

모든 파트 완료 후 메인이 phases/03-html-assembly.md를 Read한다.
