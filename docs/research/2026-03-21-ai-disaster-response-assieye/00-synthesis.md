# AssiEye AI 에이전트 재난 대응 시스템: 기술 분석 + 구현 가이드

**작성**: 메인 에이전트 (Researcher 1·2 + Critic 검토 통합) | **날짜**: 2026-03-21

---

## 핵심 요약

사건 발생 6시간 만에 만들어진 AI 에이전트 재난 대응 시스템 **AssiEye**는 3가지 핵심 기술의 조합으로 작동한다.

| 역할 | 기술 | 한 줄 설명 |
|------|------|-----------|
| 눈과 손 | **Cheliped Browser (agent-browser)** | AI가 브라우저를 직접 조작해 뉴스/SNS에서 정보를 효율적으로 수집 |
| 두뇌 | **온톨로지 기반 AI 예측** | 5개 도메인(사건-공간-자원-인명-2차피해) 인과관계를 분석해 미래 시나리오 예측 |
| 조직 체계 | **하네스 엔지니어링** | Claude Code 에이전트 4개가 각자 역할을 맡고 공유 저장소로 협력 |

---

## 1. 기술별 쉬운 설명

### 1-1. Cheliped Browser (Agent DOM 기술)

**비유**: 시각장애인을 위한 스크린 리더처럼, AI도 웹페이지에서 "진짜 중요한 것만" 골라 읽는다

웹페이지를 HTML 전체로 가져오면 광고·메뉴·스크립트까지 포함해 수만 토큰이 든다. Cheliped Browser는 **접근성 트리(Accessibility Tree)**를 활용해 이를 해결한다.

**접근성 트리란?**
모든 브라우저는 시각장애인 보조기술(스크린 리더)을 위해 웹페이지를 "의미 있는 요소만" 추출한 별도의 트리 구조를 내부에 유지한다. 버튼·링크·제목·입력창 등 실제 사용자가 상호작용하는 요소만 포함되며, 광고·CSS·이미지·숨겨진 코드는 자동으로 걸러진다.

**Agent DOM이 하는 일:**
```
일반 HTML 크롤링:
<div class="ad-container"><iframe>...</iframe></div>
<div class="article"><h2 class="tit">기사 제목</h2>
<p class="txt">본문 내용...</p>... (수천 줄)

↓ 접근성 트리 추출 후:

heading "기사 제목" [ref=e1]
paragraph "본문 내용" [ref=e2]
link "원문 보기" [ref=e3]
```

AI는 `click @e3`처럼 ref 번호로 요소를 지정해 조작한다. 토큰 절감률은 51~93% (페이지 복잡도에 따라 다름).

**공식 구현체**: `vercel-labs/agent-browser` (GitHub 23,900+ stars, Apache 2.0, 오픈소스)
- Claude Code의 Bash 도구로 CLI 명령어를 내려 브라우저를 조작
- 내부적으로 Playwright + Chromium 헤드리스 브라우저 사용

> ⚠️ "Cheliped Browser"는 개발자 포스팅의 내부 명칭. 공식 프로젝트명은 `agent-browser`

---

### 1-2. 온톨로지 기반 AI 예측 (자기 진화)

**비유**: 단순 뉴스 정리에서 시작해, 읽을수록 스스로 더 깊이 분석하는 전문가 보고서 시스템

**온톨로지란?** 개념 간 관계 지도. "불이 나면 소방차가 온다" 같은 인과관계를 AI에게 체계적으로 가르쳐주는 구조.

**5개 도메인 구조:**

```
[사건] ←→ [공간]
  ↕            ↕
[자원] ←→ [인명]
  ↕
[2차피해]
```

**인과관계 연쇄 예시:**
```
건물에 나트륨 보관 (자원)
    → 물 사용 진압 불가 (자원 제약)
    → 진압 지연 (사건)
    → 실종자 수색 지연 (인명)
    → 건물 전소 (공간)
    → 새벽 기온 강하 → 구조물 취약화 (2차피해)
    → 붕괴 위험 예측 (확률 0.6)
```

**자기 진화 메커니즘 (30분 주기):**
```
1단계: 이전 예측 검증 — 지난번 예측이 맞았나?
2단계: 새 변수 추가 — 놓친 요인이 생겼나?
3단계: 방법론 개선 — 더 좋은 분석 방식은?
4단계: 다음 과제 설정 — 다음 턴에 집중할 것은?
```

> ⚠️ "자기 진화"의 실제 품질은 초기 프롬프트 설계에 종속된다. 초기 온톨로지와 프롬프트가 부실하면 진화도 빈약한 방향으로 진행된다.

---

### 1-3. 하네스 엔지니어링 (멀티에이전트 협업)

**비유**: 야간 근무 4팀이 인수인계 노트를 통해 24시간 교대로 일하는 구조

Claude Code 4개 인스턴스를 각각 별도 터미널에서 실행, 각자 역할을 맡고 **공유 Git 저장소와 이슈 트래커로 간접 소통**한다.

| 에이전트 | 주기 | 역할 |
|---------|------|------|
| 개발 에이전트 | 30분 | 초기 코드 작성 → 이후 이슈 해결 |
| 테스트/이슈 에이전트 | 30분 | 사이트 직접 테스트 → 버그/개선 이슈 자동 발행 |
| 정보수집 에이전트 | 15분 | 뉴스·SNS·YouTube 크롤링, 중복 제거 후 저장 |
| 예측 에이전트 | 30분 | 수집 데이터로 온톨로지 분석 + 예측 리포트 생성 |

**핵심: 에이전트 간 직접 대화 없음.** 파일과 이슈 트래커를 중재자로 사용:
```
정보수집 에이전트 → data/events.json 저장
                              ↓
예측 에이전트 ← data/events.json 읽기

테스트 에이전트 → GitHub Issues에 버그 #42 발행
                              ↓
개발 에이전트 ← Issues 확인 → 코드 수정 → Issues #42 닫기
```

주기 실행은 Claude Code의 `/loop` 스킬로 설정:
```
/loop 15m 네이버·유튜브에서 대전화재 관련 신규 게시물 수집 후 data/events.json에 추가
```

> ⚠️ `/loop` 스킬은 세션이 종료되면 중단된다. 장시간 운영에는 tmux와 조합 필요

---

## 2. 기술 연동 아키텍처

```
┌─────────────────── 수집 레이어 ───────────────────┐
│                                                    │
│  [정보수집 에이전트 / 15분]                          │
│  Cheliped Browser (agent-browser CLI)              │
│  ↓ 접근성 트리 추출                                 │
│  네이버뉴스 / YouTube / X / Instagram / Facebook   │
│  ↓ 중복 제거                                       │
│  data/events.json + SQLite DB                     │
│                                                    │
└─────────────────────────┬──────────────────────────┘
                          │
┌─────────────────── 처리 레이어 ───────────────────┐
│                         ↓                         │
│  [예측 에이전트 / 30분]                             │
│  data/events.json 읽기                             │
│  ↓ Claude API (온톨로지 프롬프트)                   │
│  사건-공간-자원-인명-2차피해 분류 + 인과관계 분석     │
│  ↓ 자기 진화 루프 (이전 예측 검증 → 방법론 개선)     │
│  ontology/report_039.json 저장                    │
│                                                    │
│  [감성 분석]                                       │
│  수집 콘텐츠 → Claude API → 긍정/부정 분류          │
│                                                    │
└─────────────────────────┬──────────────────────────┘
                          │
┌─────────────────── 출력 레이어 ───────────────────┐
│                         ↓                         │
│  FastAPI 백엔드                                    │
│  SSE(Server-Sent Events)로 실시간 스트리밍          │
│  ↓                                               │
│  MapLibre GL 대시보드                              │
│  - 다크 테마 지도 (Stadia/MapTiler 타일)            │
│  - 사건 마커 (화재 위치, 타임라인)                  │
│  - SNS 채널별 마커 (뉴스/YouTube/X 등)             │
│  - 온톨로지 예측 패널 (30분마다 갱신)               │
│  - 여론 감성 패널 (긍/부정 분류 결과)               │
│  ↓                                               │
│  ngrok → 외부 URL 공개                            │
└────────────────────────────────────────────────────┘

┌─────────────────── 개선 루프 ─────────────────────┐
│                                                    │
│  [테스트/이슈 에이전트 / 30분]                       │
│  Cheliped Browser로 실제 사이트 접속                │
│  기능 테스트 → 버그 발견 → GitHub Issues 발행       │
│                  ↓                               │
│  [개발 에이전트 / 30분]                             │
│  GitHub Issues 확인 → 코드 수정 → commit           │
│                  ↓                               │
│  사이트 자동 개선 (사람 개입 없음)                   │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 3. 실질적인 개발 가이드

### 전제 조건

- Python 3.11+, Node.js 18+
- Claude API Key (`claude.ai/settings/api-keys`)
- GitHub 계정 (이슈 트래커용)
- ngrok 계정 (무료 플랜으로 충분)

---

### Step 1: 환경 초기화 (20분)

```bash
# 프로젝트 생성
mkdir assieye && cd assieye
git init && gh repo create assieye --public

# Python 환경
python3 -m venv venv && source venv/bin/activate
pip install playwright anthropic fastapi uvicorn sse-starlette sqlalchemy aiohttp python-dotenv
playwright install chromium

# agent-browser 설치 (Cheliped Browser)
npm install -g agent-browser
agent-browser install   # Chromium 바이너리 다운로드

# 디렉토리 구조
mkdir -p src/{crawler,api,frontend} data ontology scripts .claude

# .env 설정
cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=sqlite:///./data/assieye.db
NGROK_AUTHTOKEN=...
EOF
```

---

### Step 2: 크롤러 구현 (90분)

**방법 1: agent-browser CLI 방식** (Claude Code 에이전트가 직접 사용)

Claude Code가 Bash 도구로 agent-browser CLI를 호출한다.
```bash
# Claude Code의 CLAUDE.md에 아래 지침 포함:
# agent-browser open "https://news.naver.com/search?query=대전화재"
# agent-browser snapshot -i   # 상호작용 요소만 추출 (토큰 절약)
# agent-browser click @e3     # 기사 클릭
# agent-browser snapshot      # 본문 추출
```

**방법 2: Playwright Python 직접 구현** (자동화 스크립트)

```python
# src/crawler/base_crawler.py
from playwright.async_api import async_playwright

class AXTreeCrawler:
    async def crawl(self, url: str, keyword: str) -> list[dict]:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded")

            # 접근성 트리 스냅샷 추출
            snapshot = await page.locator("body").aria_snapshot()

            # Claude API로 스냅샷 파싱 (핵심 정보 추출)
            items = await self.parse_with_claude(snapshot, keyword)
            await browser.close()
            return items

    async def parse_with_claude(self, snapshot: str, keyword: str) -> list[dict]:
        import anthropic
        client = anthropic.AsyncAnthropic()

        response = await client.messages.create(
            model="claude-opus-4-6",
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": f"""다음 접근성 트리에서 '{keyword}' 관련 기사 목록을 추출하세요.
JSON 배열 형식으로: [{{"title": "...", "url": "...", "time": "..."}}]

접근성 트리:
{snapshot[:5000]}"""  # 너무 길면 자름
            }]
        )
        import json
        return json.loads(response.content[0].text)
```

**두 방법의 역할 구분:**
| 방법 | 언제 사용 | 장점 |
|------|---------|------|
| agent-browser CLI | Claude Code 에이전트가 직접 탐색/조작 | 복잡한 로그인, 동적 페이지 |
| Playwright Python | 반복 자동화 스크립트 | 주기 실행, 대량 수집 |

**중복 제거 로직:**
```python
# data/collected_urls.txt에 수집된 URL 기록
# 새 URL 수집 전 파일에서 중복 확인
import hashlib

def is_duplicate(url: str) -> bool:
    with open("data/collected_urls.txt", "r") as f:
        collected = f.read().splitlines()
    return url in collected

def save_url(url: str):
    with open("data/collected_urls.txt", "a") as f:
        f.write(url + "\n")
```

---

### Step 3: 온톨로지 예측 시스템 (90분)

**3.1 온톨로지 JSON 구조 정의:**

```json
// ontology/disaster_schema.json
{
  "disaster_type": "fire",
  "location": {"name": "대전 안전공업", "lat": 36.35, "lng": 127.38},
  "domains": {
    "incident": {
      "start_time": "2026-03-21T13:17:00",
      "current_status": "진압완료",
      "progression": ["발생", "확산", "주변건물 위협", "진압", "잔불처리"]
    },
    "space": {
      "building_floors": 5,
      "building_type": "공장",
      "hazardous_materials": ["나트륨"]
    },
    "resources": {
      "firefighters": 115,
      "vehicles": 46,
      "robots": 2,
      "constraint": "나트륨으로 인한 물 사용 제한"
    },
    "casualties": {
      "dead": 11, "injured": 59, "missing": 3
    },
    "secondary_risks": [
      {"type": "건물붕괴", "probability": 0.6, "basis": "전소 후 기온강하"},
      {"type": "토양오염", "probability": 0.4, "basis": "나트륨 반응물"}
    ]
  }
}
```

**3.2 예측 리포트 생성 프롬프트:**

```python
# src/agents/prediction_agent.py
import anthropic, json

ONTOLOGY_SYSTEM_PROMPT = """당신은 재난 분석 전문가입니다.
5개 도메인(사건/공간/자원/인명/2차피해)의 인과관계를 분석해 향후 시나리오를 예측합니다.

각 예측에는:
- probability: 0.0~1.0 확률
- basis: 근거 한 문장
- timeframe: 예측 시점
을 포함하세요."""

async def generate_report(ontology: dict, prev_report: dict | None, turn: int) -> dict:
    client = anthropic.AsyncAnthropic()

    prev_context = ""
    if prev_report:
        prev_context = f"""
이전 예측 (Turn {turn-1}):
{json.dumps(prev_report.get('predictions', []), ensure_ascii=False)}

검증: 위 예측 중 실제 발생한 것과 오류를 먼저 평가하세요.
"""

    response = await client.messages.create(
        model="claude-opus-4-6",
        max_tokens=3000,
        system=ONTOLOGY_SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"""현재 재난 상황 (Turn {turn}):
{json.dumps(ontology, ensure_ascii=False, indent=2)}
{prev_context}

지시사항:
1. 이전 예측 검증 (prev_report가 있는 경우)
2. 새로운 변수/위험 요소 추가
3. 단기(24시간 내), 중기(1주일 내), 장기(1개월 내) 시나리오 예측
4. 이번 턴의 분석 방법론 개선점 1개 제시

JSON 형식으로 응답하세요."""
        }]
    )

    result = json.loads(response.content[0].text)
    result["turn"] = turn
    result["timestamp"] = "now"

    # 저장
    with open(f"ontology/report_{turn:03d}.json", "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    return result
```

---

### Step 4: 멀티에이전트 하네스 구성 (60분)

**4.1 각 에이전트의 CLAUDE.md 작성:**

```markdown
<!-- .claude/collector_agent.md -->
# 정보수집 에이전트

## 역할
15분마다 재난 관련 정보를 수집하여 data/events.json에 저장.

## 수집 대상
- 네이버뉴스: https://search.naver.com/search.naver?where=news&query=대전화재
- YouTube: https://www.youtube.com/results?search_query=대전화재
- X(트위터): https://twitter.com/search?q=대전화재

## 작업 절차
1. agent-browser로 각 사이트 접속
2. 신규 게시물 확인 (data/collected_urls.txt와 비교)
3. 새 항목만 data/events.json에 추가
4. data/collected_urls.txt에 URL 기록

## 공유 파일 규칙
- data/events.json: append 방식 (덮어쓰기 금지)
- data/collected_urls.txt: append 방식
```

**4.2 터미널 4개에서 에이전트 실행:**

```bash
# tmux 세션 생성 (서버 재시작 후에도 유지)
tmux new-session -d -s collector "claude --dangerously-skip-permissions"
tmux new-session -d -s predictor "claude --dangerously-skip-permissions"
tmux new-session -d -s tester    "claude --dangerously-skip-permissions"
tmux new-session -d -s developer "claude --dangerously-skip-permissions"

# 각 세션에 접속해 /loop 스킬 실행
tmux send-keys -t collector "/loop 15m .claude/collector_agent.md 내용에 따라 정보 수집 실행" Enter
tmux send-keys -t predictor "/loop 30m .claude/predictor_agent.md 내용에 따라 예측 리포트 생성" Enter
tmux send-keys -t tester    "/loop 30m .claude/tester_agent.md 내용에 따라 사이트 테스트 후 이슈 발행" Enter
tmux send-keys -t developer "/loop 30m GitHub Issues 확인 후 최우선 이슈 1개 해결 후 commit" Enter
```

> **주의**: `/loop` 스킬은 Claude Code 세션이 활성화된 동안만 동작. tmux로 세션을 유지해야 한다.

---

### Step 5: 실시간 대시보드 (60분)

**5.1 FastAPI + SSE 백엔드:**

```python
# src/api/main.py
from fastapi import FastAPI
from sse_starlette.sse import EventSourceResponse
import asyncio, json

app = FastAPI()

async def event_generator():
    """data/events.json의 신규 항목을 SSE로 스트리밍"""
    last_count = 0
    while True:
        with open("data/events.json") as f:
            events = json.load(f)

        if len(events) > last_count:
            new_events = events[last_count:]
            for event in new_events:
                yield {"data": json.dumps(event, ensure_ascii=False)}
            last_count = len(events)

        await asyncio.sleep(10)  # 10초 폴링

@app.get("/events")
async def stream_events():
    return EventSourceResponse(event_generator())

@app.get("/ontology/latest")
async def latest_report():
    import glob, os
    reports = sorted(glob.glob("ontology/report_*.json"))
    if not reports:
        return {}
    with open(reports[-1]) as f:
        return json.load(f)
```

**5.2 MapLibre GL 대시보드 (핵심 부분):**

```html
<!-- src/frontend/index.html -->
<script>
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: 'map',
  // Stadia Maps - 무료, API 키 불필요 (월 200K 요청)
  style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  center: [127.38, 36.35],  // 대전
  zoom: 12
});

// 재난 이벤트 소스 등록
map.on('load', () => {
  map.addSource('events', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

  map.addLayer({
    id: 'event-circles',
    type: 'circle',
    source: 'events',
    paint: {
      'circle-radius': 8,
      'circle-color': [
        'match', ['get', 'channel'],
        'news', '#FF4444',
        'youtube', '#FF0000',
        'twitter', '#1DA1F2',
        '#FFFFFF'
      ]
    }
  });
});

// SSE로 실시간 데이터 수신
const es = new EventSource('/events');
es.onmessage = (e) => {
  const event = JSON.parse(e.data);
  const source = map.getSource('events');
  const currentData = source._data;

  currentData.features.push({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [event.lng, event.lat] },
    properties: { channel: event.channel, title: event.title }
  });

  source.setData(currentData);  // 페이지 새로고침 없이 업데이트
};
</script>
```

---

### Step 6: 외부 공개 (10분)

```python
# ngrok으로 로컬 서버 외부 공개
from pyngrok import ngrok
import os

os.environ["NGROK_AUTHTOKEN"] = os.getenv("NGROK_AUTHTOKEN")

# FastAPI 서버 시작 후
tunnel = ngrok.connect(8000)
print(f"공개 URL: {tunnel.public_url}")
# https://xxxx-xxxx.ngrok-free.app 형태의 URL 출력
```

---

### 6시간 구축 체크리스트

| 시간 | 단계 | 완료 기준 |
|------|------|---------|
| 0~30분 | 환경 초기화 | `agent-browser snapshot` 명령이 작동함 |
| 30~120분 | 크롤러 구현 | 네이버뉴스에서 기사 10개 수집 성공 |
| 120~210분 | 온톨로지 예측 | Claude API로 예측 리포트 1개 생성 |
| 210~270분 | 에이전트 하네스 | 4개 에이전트 `/loop` 실행 중 |
| 270~330분 | 대시보드 | 지도에 마커 표시 + SSE 실시간 업데이트 |
| 330~360분 | ngrok 공개 | 외부 URL 접속 가능 |

> **현실적 단서**: 사전에 Playwright, Claude API, agent-browser 사용 경험이 있는 숙련 개발자 기준. 초보자는 2배 이상 소요 예상.

---

## 4. 근거 신뢰도 매트릭스

| 핵심 주장 | 출처 | 도메인 일치 | 확신도 | 검증 필요 |
|---------|------|-----------|--------|---------|
| agent-browser = vercel-labs/agent-browser | GitHub 직접 확인 | ✅ 일치 | 높음 | 불필요 |
| 토큰 절감 51~93% | paddo.dev 벤치마크 + Vercel 공식 | ⚠️ 범용 페이지 기준 | 중간 | 재난뉴스 특화 테스트 필요 |
| `/loop` 스킬 존재 및 동작 | Claude Code 공식 스킬 시스템 | ✅ 일치 | 높음 | 구체적 문법 실제 테스트 필요 |
| MapLibre GPL 무료 오픈소스 | BSD-2 라이선스 직접 확인 | ✅ 일치 | 높음 | 불필요 |
| 비용 ~$48/일 (24시간) | 계산 추정 | ⚠️ 가정 의존적 | 낮음 | 실사용 측정 필요 |

**비용 추정 상세 (수정):**
- Claude API: 에이전트 4개 × 30분 주기 × 48회/일 × ~$0.15/호출 = ~$30/일
- 실제 사용량은 프롬프트 길이와 호출 복잡도에 따라 $10~$100/일 범위
- "~$48/일"은 중간 추정값으로 신뢰 구간이 크다

---

## 5. 상충점 해결 테이블

| 상충 | Researcher 1 주장 | Researcher 2 주장 | 판단 |
|------|------------------|------------------|------|
| 크롤링 방법 | agent-browser CLI가 핵심 | Playwright Python으로 구현 | **보완적**: Claude Code 에이전트는 agent-browser CLI 사용, 독립 자동화 스크립트는 Playwright Python 사용. 상호 배타적이지 않음 |
| 비용 추정 | 제시 없음 | $2/일 표 + $48/일 텍스트 | **결함**: $2/일 추정은 과소 계산. 실제 $20~$100/일 범위로 수정 |

---

## 6. 예상 밖 핵심 발견

1. **접근성 트리 = AI 에이전트의 보편 인터페이스**: AXTree는 원래 장애인 보조기술용으로 설계됐지만, AI 에이전트의 웹 조작 효율화에 가장 적합한 구조임이 드러났다. 이는 "접근성 기술이 AI의 인프라가 된다"는 반전이다.

2. **에이전트 간 통신 = 파일 시스템**: 직관적으로는 에이전트가 서로 메시지를 교환할 것 같지만, AssiEye의 핵심은 에이전트들이 **공유 파일과 이슈 트래커를 통해 간접 소통**한다는 것이다. 이는 마이크로서비스의 메시지 큐 패턴과 구조적으로 동일하다.

3. **온톨로지가 코드가 아닌 프롬프트**: 온톨로지 구현에 RDF, OWL, 지식 그래프 같은 복잡한 기술이 필요할 것 같지만, 실제로는 "이런 구조로 생각해라"는 프롬프트 설계가 전부다. LLM이 온톨로지 추론 엔진 역할을 대체한다.

---

## 7. 주의사항 및 법적 리스크

> **중요**: 아래 항목은 구현 전 반드시 확인해야 한다.

1. **크롤링 이용약관**: 네이버, YouTube, X(트위터), Instagram, Facebook은 자동화 크롤링을 이용약관으로 금지하거나 제한한다. 공개 재난 정보 수집이라도 법적 리스크가 있다.
   - 대안: 공식 API 사용 (YouTube Data API, Twitter/X API 등)
   - 네이버: 개발자 API (https://developers.naver.com) 활용 권장

2. **CAPTCHA 및 봇 감지**: 자동화 크롤러는 서비스별 봇 감지에 의해 IP가 차단될 수 있다.

3. **`/loop` 스킬 세션 의존성**: 세션 종료 시 모든 루프 종료. 실제 24/7 운영은 별도 cron 또는 GitHub Actions 설계 필요.

4. **재난 정보 정확성**: AI 예측을 공개 재난 대응에 사용하는 경우, 오예측으로 인한 피해 가능성을 충분히 고지해야 한다.

---

## 8. 후속 탐색 질문

1. **API 전환 시 아키텍처 변화**: 네이버/YouTube 공식 API를 사용할 때 수집 레이어가 어떻게 달라지는가? Playwright 크롤러를 API 클라이언트로 대체 가능한가?

2. **자기 진화의 품질 측정**: 온톨로지 예측의 "진화"가 실제로 예측 정확도를 높이는지 어떻게 측정하는가? 턴별 예측 vs 실제 결과 비교 데이터가 필요하다.

3. **멀티토픽 확장 설계**: AssiEye가 "BTS 광화문 공연"으로도 전환 가능하다고 언급했다. 재난 특화 온톨로지를 범용 이벤트 모니터링으로 일반화하면 어떤 구조 변경이 필요한가?

---

*Researcher 1 (기술 심층), Researcher 2 (구현 가이드), Critic (검토) 통합 | 2026-03-21*
