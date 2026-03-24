# AssiEye 핵심 기술 심층 분석

**작성**: Researcher 1 | **날짜**: 2026-03-21

---

## 목차

1. [Cheliped(Agent) Browser & Agent DOM 기술](#1-cheliped-agent-browser--agent-dom-%EA%B8%B0%EC%88%A0)
2. [Claude Code의 ](#2-claude-code%EC%9D%98-loop-%EC%8A%A4%ED%82%AC)`/loop`[ 스킬](#2-claude-code%EC%9D%98-loop-%EC%8A%A4%ED%82%AC)
3. [MapLibre GL & 재난 대시보드 UI](#3-maplibre-gl--%EC%9E%AC%EB%82%9C-%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C-ui)
4. [반증 / 한계](#4-%EB%B0%98%EC%A6%9D--%ED%95%9C%EA%B3%84)

---

## 1. Cheliped(Agent) Browser & Agent DOM 기술

### 쉬운 설명

> "AI 에이전트가 실제 브라우저처럼 웹사이트를 돌아다니고, 버튼을 클릭하고, 정보를 수집할 수 있게 해주는 CLI 도구"

일반적으로 AI가 웹을 제어하려면 웹페이지의 전체 HTML 소스를 Claude에게 넘겨야 한다. 문제는 이 HTML이 수만 토큰에 달할 수 있고, 대부분은 AI에게 불필요한 스타일 코드, 광고, 숨겨진 요소들이다. \*\*Agent Browser(Vercel Labs)\*\*는 이 문제를 "접근성 트리(Accessibility Tree)"를 통해 해결한다.

**포지셔닝**: 개발자 포스팅에서 "Cheliped Browser"라고 언급된 것은 `vercel-labs/agent-browser`를 가리키는 것으로 보인다. Cheliped는 별도의 공식 GitHub 프로젝트가 아닌 내부 명명이거나 해당 맥락에서의 별칭일 가능성이 높다. 공식 명칭은 **agent-browser** (GitHub: `vercel-labs/agent-browser`, 2026-03-21 기준 23,900+ stars, Apache 2.0 라이선스).

---

### 실제 동작 원리

#### 1-1. 전체 아키텍처

```
Claude Code 에이전트
    ↓ (Bash 명령)
agent-browser CLI (Rust 바이너리, sub-ms 오버헤드)
    ↓
Node.js 데몬 (Playwright/Chromium 세션 관리)
    ↓
실제 Chromium 브라우저 (headless)
    ↓
웹사이트
```

- **Rust CLI 바이너리**: 명령어 파싱, 서브밀리세컨드 오버헤드
- **Node.js 데몬**: Chromium 세션을 지속 관리 (cold start 없음, 세션 재사용)
- **Playwright**: 실제 브라우저 제어 레이어 (Chromium 드라이버)

출처: [vercel-labs/agent-browser GitHub](https://github.com/vercel-labs/agent-browser), Perplexity 합성 결과

#### 1-2. Accessibility Tree(접근성 트리)란?

브라우저는 내부적으로 두 개의 트리를 유지한다:

| 트리 종류 | 위치 | 용도 |
| --- | --- | --- |
| **DOM 트리** | 렌더러 프로세스 | 실제 HTML 요소 전체 |
| **Accessibility Tree (AX Tree)** | 브라우저 프로세스 | 스크린리더·보조기술용 의미론적 요약 |

Accessibility Tree는 W3C ARIA 표준을 기반으로, 버튼/입력창/링크 등 **사용자가 실제로 상호작용하는 요소만** 추출해 역할(role), 레이블(label), 상태(state)를 표현한다. CSS 스타일, 이미지 픽셀, 광고 iframe 등은 포함되지 않는다.

출처: Chrome DevTools Protocol 문서, Perplexity 검색 결과 (Blink AX Tree 설명)

#### 1-3. Agent DOM — `@e1`, `@e2` 번호 부여 방식

`agent-browser snapshot` 명령 실행 시:

1. Chromium이 현재 페이지의 Accessibility Tree를 CDP(Chrome DevTools Protocol)를 통해 추출
2. agent-browser가 이 트리를 순회하며 상호작용 가능한 요소(버튼, 입력창, 링크, onclick div 등)에 순서대로 ref 번호 부여
3. 결과를 컴팩트한 텍스트로 직렬화

**실제 snapshot 출력 예시**:

```
textbox "Email" [ref=e1]
textbox "Password" [ref=e2]
button "Sign In" [ref=e3]
link "Forgot Password?" [ref=e4]
```

Claude는 이 ref를 그대로 사용해 클릭/입력 명령을 내린다:

```bash
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
```

CSS 셀렉터(`.btn-primary > form > input:nth-child(2)`)나 XPath 없이 동작한다. 페이지 구조가 바뀌어도 의미론적 레이블이 바뀌지 않으면 ref가 안정적으로 매핑된다.

출처: [LinkedIn Cole Medin 포스팅](https://www.linkedin.com/posts/cole-medin-727752184_ive-been-testing-vercels-agent-browser-activity-7418832504754872320-PCA0), Reddit r/ClaudeAI 스레드

#### 1-4. 토큰 절약 수치

| 비교 대상 | 토큰 소비 | 절감율 |
| --- | --- | --- |
| Raw DOM / Full HTML | \~수만 토큰 | baseline |
| Playwright MCP (full AX tree) | \~114,000 토큰 (다단계 작업) | \- |
| agent-browser snapshot | \~27,000 토큰 (다단계 작업) | \~76% 절감 |
| agent-browser snapshot -i (interactive only) | 최소화 | **93% 절감** (Vercel 공식 주장) |

**수치 투명성**: Vercel의 "93% 절감" 수치는 Full AX tree 덤프 대비 상호작용 요소만 추출한 스트림라인 출력을 비교한 것. 페이지 복잡도에 따라 실제 절감율은 달라진다 (Wikipedia 단순 페이지: \~51%, GitHub/Hacker News 복잡 페이지: \~78-79%). 출처: [paddo.dev 벤치마크](https://paddo.dev/blog/agent-browser-context-efficiency/), [testcollab.com Playwright CLI 분석](https://testcollab.com/blog/playwright-cli)

---

### 구현에 필요한 것들

```bash
# 설치
npm install -g agent-browser
agent-browser install  # Chromium 다운로드

# Claude Code에 skill로 등록
# agent-browser의 skill.md 파일을 ~/.claude/skills/ 에 복사
```

**필요 라이브러리/도구**:

- `agent-browser` (npm 전역 설치)
- Node.js 18+ (데몬 실행)
- Chromium (agent-browser install로 자동 다운로드)
- Claude Code (Bash 도구로 agent-browser 명령 실행)

**주요 명령어 (60개 이상의 서브커맨드 중 핵심)**:

```bash
agent-browser open <url>          # 페이지 열기
agent-browser snapshot            # 전체 접근성 트리
agent-browser snapshot -i         # 상호작용 요소만 (토큰 최소화)
agent-browser click @e2           # ref로 클릭
agent-browser fill @e3 "text"     # ref로 텍스트 입력
agent-browser screenshot page.png # 스크린샷 (검증용)
agent-browser close               # 브라우저 종료
```

---

## 2. Claude Code의 `/loop` 스킬

### 쉬운 설명

> "`/loop 30m 작업내용` 이라고 입력하면 Claude Code가 30분마다 그 작업을 자동 반복 실행해준다. 세션이 열려 있는 동안 동작하는 인-세션 cron 작업."

AssiEye 개발에서는 에이전트 4개를 각 터미널에서 독립 실행하고, 각각 다른 주기로 `/loop`를 사용했다:

- 개발 에이전트: 30분 주기
- 테스트/이슈 에이전트: 30분 주기
- 정보수집 에이전트: 15분 주기
- 예측 에이전트: 30분 주기

---

### 실제 동작 원리

#### 2-1. `/loop` 스킬 동작 방식

출처: [Claude Code 공식 skills 문서](https://code.claude.com/docs/en/skills), [verdent.ai 가이드](https://www.verdent.ai/guides/claude-code-loop-command)

`/loop`는 Claude Code에 번들된 내장 스킬로, 세션이 열려 있는 동안 지정된 간격으로 프롬프트를 반복 실행한다.

**기본 문법**:

```
/loop [간격] <프롬프트>
```

**시간 단위**:

| 단위 | 심볼 | 비고 |
| --- | --- | --- |
| 초 | s | 최소 단위는 1분 (cron 제약) |
| 분 | m | 직접 매핑 |
| 시간 | h | 직접 매핑 |
| 일 | d | 직접 매핑 |

기본값: 간격 생략 시 **10분**

**동작 과정**:

1. Claude Code가 `/loop` 명령을 파싱해 cron 표현식으로 변환
2. 내부 스케줄러에 작업 등록 (job ID 반환)
3. 세션 유지 중 백그라운드에서 지정 간격마다 프롬프트 실행
4. 각 실행 결과를 세션에 출력

**전제 조건**: `CLAUDE_CODE_DISABLE_CRON` 환경변수가 `1`이 아니어야 함

#### 2-2. 복수 에이전트 터미널 실행 방법 (AssiEye 패턴)

AssiEye가 사용한 "Harness Engineering" 방식:

```bash
# 터미널 1: 개발 에이전트
claude
# 세션 안에서:
# /loop 30m 재난 데이터 수집 API 개발 및 테스트, 결과를 Git commit

# 터미널 2: 테스트/이슈 에이전트
claude
# /loop 30m GitHub Issues 확인 후 실패 테스트 수정

# 터미널 3: 정보수집 에이전트
claude
# /loop 15m 재난 관련 뉴스·데이터 웹 수집 및 저장

# 터미널 4: 예측 에이전트
claude
# /loop 30m 수집된 데이터로 위험도 예측 모델 실행
```

**tmux로 세션 영속화** (세션 종료 방지):

```bash
tmux new-session -d -s dev-agent "claude"
tmux new-session -d -s test-agent "claude"
tmux new-session -d -s info-agent "claude"
tmux new-session -d -s pred-agent "claude"
# 각 세션에 접속해 /loop 명령 실행
```

출처: [Anthropic 공식 장기 실행 연구 문서](https://www.anthropic.com/research/long-running-tasks)

#### 2-3. Git 저장소 & 이슈 트래커 공유 방식

복수의 에이전트가 하나의 Git 저장소를 공유할 때의 조정 메커니즘:

| 메커니즘 | 설명 | 역할 |
| --- | --- | --- |
| **공유 task list** | CLAUDE.md 또는 JSON 파일 | 할 일 목록, 상태(pending/in-progress/done), 담당자 |
| **파일 락(file lock)** | 에이전트별 `.lock` 파일 | 동시 수정 충돌 방지 |
| **TaskCreate/TaskUpdate 도구** | Claude Code 내장 | 에이전트 간 작업 클레임·완료 보고 |
| **SendMessage 도구** | Claude Code 내장 | 에이전트 간 직접 메시지 |
| **Git commit** | 각 에이전트가 작업 후 커밋 | 변경사항 영속화 |

**Git 이슈 트래커 연동 흐름**:

1. 테스트 에이전트가 `/loop 30m`으로 주기적으로 GitHub Issues 확인
2. 실패 이슈 발견 시 TaskCreate로 개발 에이전트에게 할당
3. 개발 에이전트가 수정 후 commit + 이슈 close

출처: [Claude Code Swarm Orchestration Skill gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea), Perplexity 멀티에이전트 패턴 검색

**비비판적 적용 주의**: 이 패턴은 파일 단위 독립성이 높은 작업(프론트엔드/백엔드/테스트 분리)에서 유효하다. 동일 파일을 동시에 수정하는 작업은 file lock 없이는 충돌 위험이 있다.

---

### 구현에 필요한 것들

- Claude Code 설치 및 인증 (`claude --version`)
- `CLAUDE_CODE_DISABLE_CRON` 환경변수 미설정
- tmux 또는 screen (세션 영속화 시)
- CLAUDE.md에 에이전트별 역할과 공유 규약 명시

---

## 3. MapLibre GL & 재난 대시보드 UI

### 쉬운 설명

> "웹 브라우저에서 Google Maps처럼 돌아가는 지도를 무료로, 라이선스 걱정 없이 구현할 수 있는 오픈소스 라이브러리. Mapbox의 오픈소스 시절 코드를 포크해서 커뮤니티가 유지한다."

---

### 실제 동작 원리

#### 3-1. MapLibre GL vs Mapbox GL — 핵심 차이

| 항목 | MapLibre GL JS | Mapbox GL JS |
| --- | --- | --- |
| 라이선스 | **BSD-2-Clause (완전 오픈소스)** | 상용 라이선스 (v2부터) |
| 출발점 | Mapbox GL JS v1 포크 (2021) | Mapbox 자체 유지 |
| API 키 | 불필요 (타일 서버별도) | Mapbox 계정 필수 |
| 비용 | 무료 | 호출량 기반 과금 |
| GitHub stars | 7,000+ | 11,000+ |
| 호환성 | Mapbox GL JS v1 코드와 대부분 호환 | \- |
| 렌더러 | WebGL (GPU 가속 벡터 타일) | WebGL |
| npm 주간 다운로드 | 2,093,087 (2026-03-21 기준) | 더 많음 |

출처: [geoapify.com 비교](https://www.geoapify.com/map-libraries-comparison-leaflet-vs-maplibre-gl-vs-openlayers-trends-and-statistics/), [npmjs.com maplibre-gl](https://www.npmjs.com/package/maplibre-gl)

**라이선스 이슈가 재난 대응에 중요한 이유**: 공공기관·비영리 재난 대응 시스템은 예산 제약이 크다. BSD-2-Clause는 상업/비상업 모두 자유롭게 사용 가능하며 소스 공개 의무도 없다.

#### 3-2. 다크 테마 지도 구현

MapLibre GL은 기본 내장 다크 테마가 없다. 재난 대시보드에서는 다음 방법을 사용한다:

**방법 1: 외부 다크 스타일 URL 사용**

```javascript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map',
  // MapTiler 또는 Stadia의 다크 스타일
  style: 'https://api.maptiler.com/maps/darkmatter/style.json?key=YOUR_KEY',
  center: [126.978, 37.566],  // 서울 기준
  zoom: 10
});
```

**방법 2: maplibre-theme 커뮤니티 패키지**

- CSS 변수로 다크 모드 전환 (`.dark` 클래스 토글)
- 파일 크기: 20-30KB (기본 65KB 대비 경량)
- 출처: \[Perplexity maplibre-theme 검색 결과\]

**방법 3: 시스템 테마 자동 대응**

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
// prefersDark.matches 에 따라 style URL 전환
```

#### 3-3. 마커/오버레이 추가 방식

재난 대시보드 전형 패턴:

```javascript
map.on('load', () => {
  // GeoJSON 소스 등록 (초기 빈 데이터)
  map.addSource('disaster-events', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });

  // 레이어 추가: 재난 유형별 색상 코딩
  map.addLayer({
    id: 'disaster-circles',
    type: 'circle',
    source: 'disaster-events',
    paint: {
      'circle-radius': 8,
      'circle-color': [
        'case',
        ['==', ['get', 'type'], 'fire'], '#FF4444',
        ['==', ['get', 'type'], 'flood'], '#4488FF',
        ['==', ['get', 'type'], 'earthquake'], '#FF8800',
        '#CCCCCC'
      ],
      'circle-opacity': 0.8
    }
  });

  // 팝업
  map.on('click', 'disaster-circles', (e) => {
    const props = e.features[0].properties;
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<b>${props.type}</b><br>심각도: ${props.severity}`)
      .addTo(map);
  });
});
```

#### 3-4. 실시간 데이터 반영 — WebSocket vs 폴링

**WebSocket 방식** (추천: 재난 대응 실시간성 필요 시):

```javascript
const ws = new WebSocket('wss://disaster-api.example.com/events');

ws.onmessage = (event) => {
  const updates = JSON.parse(event.data);

  const features = updates.map(u => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [u.lng, u.lat] },
    properties: { type: u.eventType, severity: u.severity, timestamp: u.ts }
  }));

  // setData는 GPU 재렌더링만 트리거 (페이지 새로고침 없음)
  map.getSource('disaster-events').setData({
    type: 'FeatureCollection',
    features
  });
};
```

**폴링 방식** (간단한 구현, 수\~수십초 지연 허용 시):

```javascript
const poll = async () => {
  const res = await fetch('/api/disaster-events');
  const data = await res.json();
  map.getSource('disaster-events').setData(data);
};

setInterval(poll, 15000); // 15초마다
```

| 방식 | 장점 | 단점 | 적합 상황 |
| --- | --- | --- | --- |
| WebSocket | 지연 없음, 서버 push | 연결 관리 복잡 | 지진·화재 실시간 경보 |
| HTTP 폴링 | 구현 단순, 방화벽 친화적 | 15-30초 지연 | 기상 데이터 등 준실시간 |
| SSE (Server-Sent Events) | 단방향 push, HTTP | 재연결 처리 필요 | 단방향 이벤트 스트림 |

출처: Perplexity MapLibre GL WebSocket 검색 결과

**성능 참고**: `setData()`는 MapLibre GL 내부적으로 최적화되어 있어 고빈도 업데이트(초당 1-10회)도 처리 가능. 수천 개 마커는 Supercluster(클러스터링 라이브러리)와 조합 권장.

---

### 구현에 필요한 것들

```bash
npm install maplibre-gl
# 타입스크립트 사용 시:
npm install @types/maplibre-gl
```

**필요 서비스**:

- 지도 타일 서버: MapTiler (유료, 무료 플랜 있음), OpenMapTiles (자체 호스팅), Stadia Maps
- 다크 스타일: MapTiler "Dark Matter" 또는 Stadia "Alidade Smooth Dark"

**주요 API**:

- `maplibregl.Map` — 지도 인스턴스 생성
- `map.addSource()` — GeoJSON 데이터 소스 등록
- `map.addLayer()` — 렌더링 레이어 추가
- `map.getSource().setData()` — 실시간 데이터 업데이트
- `maplibregl.Popup` — 클릭 팝업

---

## 4. 반증 / 한계

### Cheliped(Agent) Browser 한계

1. **93% 토큰 절감 수치의 조건 의존성**: 이 수치는 상호작용 요소만 추출하는 `-i` 플래그 사용 시이며, 링크가 많은 위키피디아 같은 페이지에서는 51%로 낮아진다. "93%"를 범용적으로 적용하면 과도한 주장이 된다.

2. **SPA(단일 페이지 앱) 동적 요소**: React/Vue로 구현된 SPA에서 동적으로 생성되는 요소는 접근성 트리 업데이트 타이밍이 맞지 않으면 ref가 잘못 매핑될 수 있다. `snapshot` 재실행이 필요하다.

3. **CAPTCHA 우회 불가**: 세션 재사용으로 일부 로그인 CAPTCHA를 회피할 수 있지만, 서비스별 봇 감지 시스템에 의해 차단될 수 있다.

4. **Cheliped라는 명칭의 불명확성**: 공식 GitHub 프로젝트 이름은 `agent-browser`다. "Cheliped Browser"는 개발자 포스팅의 내부 명칭이거나 오기일 가능성이 있어, 재현 시 `vercel-labs/agent-browser`를 참조해야 한다. \[반증 미발견: Cheliped라는 별도 오픈소스 프로젝트는 확인되지 않음\]

### Claude Code `/loop` 한계

1. **세션 종료 시 루프 소멸**: `/loop`는 in-session 스케줄러다. Claude Code 세션이 닫히면 모든 루프가 사라진다. 진정한 24/7 운영을 위해서는 tmux 조합 + 서버 재시작 시 자동 복구 로직이 별도로 필요하다.

2. **에이전트 간 충돌 위험**: 복수 에이전트가 동일 파일을 동시 수정하면 Git merge conflict 발생. file lock 메커니즘이 없으면 작업 분리 설계가 필수다.

3. **병렬 실행의 비용 선형 증가**: 에이전트 4개를 30분 주기로 돌리면 API 호출 비용이 단일 에이전트 대비 4배. 비용 예측 없이 고빈도 루프를 설정하면 예상치 못한 청구 발생.

4. **MCP 도구 접근 제한**: 백그라운드 서브에이전트에서는 MCP 서버 접근이 불안정할 수 있다 (AssiEye가 `./scripts/search.sh` 직접 호출 방식을 택한 이유가 이것일 수 있음).

### MapLibre GL 한계

1. **Mapbox v2 기능 격차**: MapLibre는 Mapbox GL JS v1 포크이므로, Mapbox v2에서 추가된 3D terrain, fog, sky layer 등의 고급 기능은 일부 미지원이거나 별도 플러그인이 필요하다.

2. **타일 서버 의존성**: MapLibre 자체는 무료지만 지도 타일 데이터는 외부 서비스(MapTiler, Stadia 등)에서 가져와야 한다. 오프라인 재난 환경에서는 자체 타일 서버 구축이 필요하다.

3. **WebGL 지원 의존**: 구형 브라우저나 GPU가 없는 임베디드 단말에서는 렌더링 불가. 재난 현장의 임시 단말을 고려하면 Leaflet 같은 경량 대안을 병행 검토해야 한다.

---

## 관점 확장 (숨은 변수)

1. **접근성 트리의 보안 함의**: 접근성 트리는 원래 장애인 보조기술을 위한 것이다. 이를 AI 에이전트가 자동화에 활용하는 것은 웹 서비스의 봇 감지 로직 우회 수단이 될 수 있어, 서비스 이용약관 위반 여부를 개별적으로 확인해야 한다.

2. **에이전트 루프 실패 감지**: `/loop`로 실행된 에이전트가 오류로 조기 종료하면 어떻게 감지하는가? AssiEye에서 이에 대한 모니터링 메커니즘이 있는지는 추가 조사가 필요하다.

3. **\[이질 도메인: 항공 관제 시스템\]**: 재난 대응 대시보드의 "실시간 지도 + 이벤트 오버레이 + 다중 에이전트 모니터링" 구조는 항공 관제 시스템(ATC)과 구조적으로 유사하다. ATC의 우선순위 큐잉, 충돌 회피 알고리즘, 정보 과부하 방지 UI 패턴을 차용할 수 있다.

---

*문서 작성 기준일: 2026-03-21주요 출처: vercel-labs/agent-browser GitHub (23,900 stars), Claude Code 공식 문서, verdent.ai /loop 가이드, geoapify.com MapLibre 비교, paddo.dev 토큰 벤치마크*