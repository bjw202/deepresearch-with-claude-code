# AssiEye 구현 가이드: AI 에이전트 재난 대응 시스템

> **대상 독자**: 파이썬/Node.js 경험이 있는 개발자
> **목표**: 사건 발생 후 6시간 이내에 동작하는 재난 대응 AI 시스템 구축
> **총 예상 소요 시간**: 5~8시간 (숙련자 기준 3~4시간)

---

## 전체 아키텍처 개요

```
[ 수집 레이어 ]           [ 처리 레이어 ]          [ 출력 레이어 ]
Playwright 크롤러    →   Claude API 에이전트   →   MapLibre 대시보드
(네이버/YT/SNS)          (분류 + 예측)              (실시간 지도)
      ↓                        ↓                         ↓
   Raw Events DB          온톨로지 JSON             WebSocket/SSE
   (SQLite/Postgres)      (5개 도메인)              ngrok 외부 공개
```

### 기술 스택 선택 근거

| 레이어 | 선택 | 대안 | 선택 이유 |
|--------|------|------|-----------|
| 백엔드 | Python + FastAPI | Node.js + Express | Claude SDK, ML 라이브러리 생태계 |
| 크롤러 | Playwright (Python) | Selenium, Scrapy | JS 렌더링 + AXTree API 내장 |
| DB | SQLite (개발) → PostgreSQL (운영) | MongoDB | 스키마 안정성, 관계형 쿼리 |
| 지도 | MapLibre GL JS | Leaflet, Deck.gl | 오픈소스, WebGL 성능, 무료 타일 |
| 실시간 | FastAPI SSE | WebSocket | 단방향 스트리밍에 SSE가 단순 |
| 배포 | ngrok | localtunnel | 안정성, 디버깅 UI (port 4040) |

---

## Step 1: 프로젝트 초기화 및 환경 설정

**무엇을**: 개발 환경을 구성하고 기본 디렉토리 구조를 만든다.
**왜**: 4개의 Claude Code 에이전트가 공유 Git 저장소에서 작업하므로 충돌 없는 구조가 필요하다.
**난이도**: ★☆☆☆☆ | **소요 시간**: 20분

### 1.1 디렉토리 구조 생성

```bash
mkdir assieye && cd assieye
git init

# 디렉토리 구조
mkdir -p {src/{crawler,agents,api,frontend},data/{raw,processed},ontology,scripts,.claude/agents}

# 구조 설명
# src/crawler/    - Playwright 크롤러 (수집 에이전트)
# src/agents/     - Claude 멀티에이전트 하네스
# src/api/        - FastAPI 백엔드 (SSE 포함)
# src/frontend/   - MapLibre 대시보드
# ontology/       - 재난 온톨로지 JSON 정의
# .claude/agents/ - 각 에이전트의 CLAUDE.md
```

### 1.2 Python 환경 및 패키지

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 핵심 패키지
pip install playwright anthropic fastapi uvicorn sse-starlette sqlalchemy aiohttp python-dotenv

# Playwright 브라우저 바이너리 설치
playwright install chromium

# 프론트엔드 (Node.js 별도 필요)
npm install maplibre-gl
```

### 1.3 환경 변수 설정

```bash
# .env 파일 생성
cat > .env << 'EOF'
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=sqlite:///./data/assieye.db
NGROK_AUTHTOKEN=...   # https://ngrok.com 에서 무료 발급
COLLECTION_INTERVAL=900  # 15분 (초 단위)
PREDICTION_INTERVAL=1800 # 30분
EOF
```

---

## Step 2: Playwright + AXTree 크롤러 구현

**무엇을**: 헤드리스 브라우저로 뉴스/SNS를 크롤링하되, DOM 대신 접근성 트리(AXTree)로 콘텐츠를 추출한다.
**왜**: AXTree는 렌더링된 시각 구조가 아닌 의미론적 구조를 제공한다. 광고, 배너, 네비게이션을 자동으로 제거하고 핵심 콘텐츠만 추출할 수 있다. Claude Code의 "Cheliped Browser" 방식이 이 원리를 사용한다.
**난이도**: ★★★☆☆ | **소요 시간**: 90분

### 2.1 기본 AXTree 추출 패턴

```python
# src/crawler/base_crawler.py
from playwright.async_api import async_playwright
import json

class AXTreeCrawler:
    """AXTree 기반 크롤러. DOM 파싱 없이 의미론적 콘텐츠 추출."""

    async def get_axtree(self, url: str) -> dict:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (compatible; DisasterMonitor/1.0)"
            )
            page = await context.new_page()

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                # AXTree 스냅샷 추출 - YAML 형식 반환
                snapshot = await page.locator("body").aria_snapshot()
                return {"url": url, "snapshot": snapshot, "status": "ok"}
            except Exception as e:
                return {"url": url, "snapshot": None, "status": f"error: {e}"}
            finally:
                await browser.close()

    async def extract_articles(self, snapshot: str) -> list[dict]:
        """AXTree YAML에서 기사 목록 추출 (role: article, link 노드 대상)"""
        articles = []
        lines = snapshot.split("\n")
        current = {}

        for line in lines:
            # heading 레벨이 제목
            if "heading" in line and '"' in line:
                if current:
                    articles.append(current)
                title = line.split('"')[1] if '"' in line else ""
                current = {"title": title}
            # link가 href 포함
            elif "link" in line and '"' in line:
                text = line.split('"')[1] if '"' in line else ""
                if current and "url" not in current:
                    current["url"] = text  # 링크 텍스트 (URL은 별도 추출 필요)

        if current:
            articles.append(current)
        return articles
```

### 2.2 네이버 뉴스 크롤러

```python
# src/crawler/naver_crawler.py
from .base_crawler import AXTreeCrawler
import re
from datetime import datetime

NAVER_NEWS_URLS = [
    "https://news.naver.com/main/list.naver?mode=LSD&mid=shm&sid1=102",  # 사회
    "https://news.naver.com/main/list.naver?mode=LSD&mid=shm&sid1=103",  # 생활/문화
]

DISASTER_KEYWORDS = [
    "화재", "지진", "홍수", "태풍", "폭설", "산사태", "해일",
    "사고", "폭발", "붕괴", "실종", "구조", "대피", "긴급"
]

class NaverNewsCrawler(AXTreeCrawler):

    async def crawl(self) -> list[dict]:
        results = []
        for url in NAVER_NEWS_URLS:
            data = await self.get_axtree(url)
            if data["status"] == "ok":
                articles = await self.extract_articles(data["snapshot"])
                # 재난 키워드 필터링
                filtered = [
                    a for a in articles
                    if any(kw in a.get("title", "") for kw in DISASTER_KEYWORDS)
                ]
                results.extend(filtered)
        return results
```

### 2.3 YouTube 크롤러 (라이브/뉴스 채널)

```python
# src/crawler/youtube_crawler.py
YOUTUBE_NEWS_URLS = [
    "https://www.youtube.com/@YTN_News",
    "https://www.youtube.com/@MBCnews",
]

class YouTubeCrawler(AXTreeCrawler):

    async def crawl(self) -> list[dict]:
        results = []
        for channel_url in YOUTUBE_NEWS_URLS:
            data = await self.get_axtree(channel_url + "/videos")
            if data["status"] != "ok":
                continue

            snapshot = data["snapshot"]
            # YouTube AXTree에서 video 제목과 링크 추출
            # role: link 이후 텍스트가 제목
            videos = self._parse_youtube_snapshot(snapshot)
            results.extend(videos)
        return results

    def _parse_youtube_snapshot(self, snapshot: str) -> list[dict]:
        """YouTube AXTree에서 동영상 목록 파싱"""
        videos = []
        for line in snapshot.split("\n"):
            if "link" in line and ("분 전" in line or "시간 전" in line or "일 전" in line):
                title_match = re.search(r'"([^"]+)"', line)
                if title_match:
                    videos.append({
                        "platform": "youtube",
                        "title": title_match.group(1),
                        "collected_at": datetime.now().isoformat()
                    })
        return videos
```

### 2.4 중복 제거 로직

```python
# src/crawler/deduplicator.py
import hashlib

class EventDeduplicator:
    """제목 기반 퍼지 중복 제거"""

    def __init__(self, db_session):
        self.db = db_session
        self.seen_hashes = set()

    def normalize(self, text: str) -> str:
        """정규화: 특수문자 제거, 소문자화, 공백 압축"""
        text = re.sub(r'[^\w\s]', '', text.lower())
        return re.sub(r'\s+', ' ', text).strip()

    def fingerprint(self, title: str) -> str:
        """제목 앞 30자 기반 해시 (편집 거리 대신 단순화)"""
        normalized = self.normalize(title)[:30]
        return hashlib.md5(normalized.encode()).hexdigest()

    def is_duplicate(self, title: str) -> bool:
        fp = self.fingerprint(title)
        if fp in self.seen_hashes:
            return True
        self.seen_hashes.add(fp)
        return False
```

### 주의사항/함정 - 크롤러

- **Anti-bot 감지**: 네이버는 headless 감지가 강하다. `playwright-stealth` 패키지나 `user_agent` 조정이 필요하다. SNS(X/Instagram/Facebook)는 로그인 장벽이 있어 공개 API 또는 개인 계정 세션 쿠키를 별도 관리해야 한다.
- **AXTree 변동성**: 사이트 리디자인 시 `aria_snapshot()` 출력 구조가 바뀐다. 파싱 로직을 너무 하드코딩하지 말고 Claude API에게 AXTree 파싱을 위임하는 방식이 더 유연하다.
- **rate limit**: 15분 간격 수집 시 동일 도메인에 너무 빠르게 요청하면 차단된다. 도메인당 최소 2초 딜레이를 추가하라.

---

## Step 3: Claude Code 멀티에이전트 하네스 구축

**무엇을**: 4개의 Claude Code 에이전트를 Git worktree로 격리하고, /loop 스킬로 주기적 실행을 설정한다.
**왜**: 단일 에이전트는 "개발 + 수집 + 예측 + 테스트"를 직렬로 처리해 병목이 생긴다. 역할 분리로 병렬 실행이 가능하다.
**난이도**: ★★★★☆ | **소요 시간**: 60분

### 3.1 Claude Code 설치 및 초기화

```bash
# Claude Code CLI 설치
npm install -g @anthropic/claude-code

# 버전 확인 (v2.1.72+ 필요: 스케줄링 기능)
claude --version

# 프로젝트 루트에서 초기화
claude  # 첫 실행 시 인증 진행
```

### 3.2 에이전트 역할 정의 (CLAUDE.md)

루트 CLAUDE.md는 공통 컨텍스트를 정의하고, 각 에이전트별 서브 CLAUDE.md에서 역할을 구체화한다.

```markdown
<!-- CLAUDE.md (루트) -->
# AssiEye 프로젝트 공통 컨텍스트

## 시스템 목적
재난 발생 시 뉴스/SNS를 실시간 수집하여 피해 예측 리포트를 생성하는 AI 시스템.

## 공유 규칙
- 수집된 이벤트: data/raw/events.jsonl
- 처리된 예측: data/processed/predictions.jsonl
- 온톨로지 정의: ontology/disaster_ontology.json
- API 서버: src/api/main.py (포트 8000)

## 에이전트 간 통신
GitHub Issues를 메시지 큐로 사용한다.
- label: "agent:collector" → 수집 에이전트 작업
- label: "agent:predictor" → 예측 에이전트 작업
- label: "agent:dev" → 개발 에이전트 작업
- label: "status:done" → 완료된 이슈 (닫지 않고 레이블로 관리)

## 금지 사항
- 다른 에이전트의 worktree 파일 직접 수정 금지
- ontology/disaster_ontology.json 무단 수정 금지 (예측 에이전트 전용)
```

```markdown
<!-- .claude/agents/collector/CLAUDE.md -->
# 수집 에이전트 역할

## 담당 작업
- 15분마다 src/crawler/ 실행
- 결과를 data/raw/events.jsonl에 append
- 새 이벤트 발생 시 GitHub Issue 생성 (label: agent:predictor)

## 실행 명령
python src/crawler/run_all.py --output data/raw/events.jsonl

## 완료 조건
수집 완료 후 issue body에 수집 건수와 타임스탬프 기록
```

### 3.3 /loop 스킬로 주기 실행 설정

각 에이전트 세션에서 아래 명령으로 주기 실행을 설정한다:

```bash
# 터미널 1: 수집 에이전트 (15분 간격)
claude  # 수집 에이전트 세션
> /loop 15m python src/crawler/run_all.py --output data/raw/events.jsonl

# 터미널 2: 예측 에이전트 (30분 간격)
claude  # 예측 에이전트 세션
> /loop 30m python src/agents/predictor.py --input data/raw/events.jsonl

# 터미널 3: 개발/테스트 에이전트 (30분 간격)
claude  # 개발 에이전트 세션
> /loop 30m python -m pytest src/tests/ --tb=short

# 터미널 4: 테스트/이슈 에이전트 (30분 간격)
claude  # QA 에이전트 세션
> /loop 30m python src/agents/issue_monitor.py
```

**중요**: `/loop`은 세션 종료 시 사라진다. 장기 운영은 crontab 또는 GitHub Actions를 사용하라:

```bash
# crontab 설정 (세션 불필요, 영구 실행)
crontab -e

# 수집: 15분마다
*/15 * * * * cd /path/to/assieye && source venv/bin/activate && python src/crawler/run_all.py

# 예측: 30분마다
*/30 * * * * cd /path/to/assieye && source venv/bin/activate && python src/agents/predictor.py
```

### 3.4 Git Worktree로 에이전트 격리

```bash
# 각 에이전트가 별도 브랜치에서 독립 작업
git worktree add ../assieye-collector feature/collector
git worktree add ../assieye-predictor feature/predictor
git worktree add ../assieye-dashboard feature/dashboard

# 각 worktree에서 별도 Claude 세션 실행
# → 파일 충돌 없이 병렬 개발 가능
```

### 3.5 GitHub Issues를 에이전트 간 통신 채널로 활용

```python
# src/agents/issue_bridge.py
import subprocess
import json

class IssueQueue:
    """GitHub Issues를 메시지 큐로 사용 (gh CLI 필요)"""

    def publish(self, title: str, body: str, label: str):
        """새 작업 이슈 생성"""
        cmd = [
            "gh", "issue", "create",
            "--title", title,
            "--body", body,
            "--label", label
        ]
        subprocess.run(cmd, check=True)

    def consume(self, label: str) -> list[dict]:
        """특정 레이블의 open 이슈 조회"""
        result = subprocess.run(
            ["gh", "issue", "list", "--label", label, "--json", "number,title,body"],
            capture_output=True, text=True
        )
        return json.loads(result.stdout) if result.returncode == 0 else []

    def mark_done(self, issue_number: int):
        """완료 레이블 추가 (닫지 않음 - 감사 추적 유지)"""
        subprocess.run(["gh", "issue", "edit", str(issue_number), "--add-label", "status:done"])

# 사용 예시: 수집 에이전트가 예측 에이전트에게 트리거 전달
queue = IssueQueue()
queue.publish(
    title=f"[수집완료] {datetime.now().strftime('%Y-%m-%d %H:%M')} - 화재 이벤트 3건",
    body=json.dumps({"count": 3, "event_ids": ["evt_001", "evt_002", "evt_003"]}),
    label="agent:predictor"
)
```

### 주의사항/함정 - 멀티에이전트

- **/loop 3일 만료**: 공식 문서 확인됨. 3일 후 자동 만료된다. 운영 환경에서는 반드시 crontab이나 GitHub Actions를 사용하라.
- **세션 독립성**: 각 Claude Code 세션은 컨텍스트를 공유하지 않는다. 에이전트 간 상태 전달은 반드시 파일(JSONL)이나 Issues를 통해야 한다.
- **gh CLI 인증**: GitHub Issues 연동에는 `gh auth login`이 선행되어야 한다.

---

## Step 4: 온톨로지 기반 AI 예측 시스템

**무엇을**: 재난 사건을 5개 도메인(사건-공간-자원-인명-2차피해)으로 구조화하고, Claude API로 예측 리포트를 생성한다.
**왜**: 비구조화 뉴스 텍스트를 온톨로지로 매핑하면 에이전트가 "무엇을 물어봐야 하는지"를 알게 되고, 이전 예측과 비교하여 스스로 온톨로지를 확장할 수 있다.
**난이도**: ★★★★☆ | **소요 시간**: 90분

### 4.1 재난 온톨로지 JSON 정의

```json
// ontology/disaster_ontology.json
{
  "version": "1.0",
  "last_updated": "2026-03-21",
  "domains": {
    "incident": {
      "description": "사건 자체의 특성",
      "fields": {
        "type": {"enum": ["화재", "지진", "홍수", "태풍", "폭설", "산사태", "사고", "기타"]},
        "severity": {"enum": ["경보", "주의", "심각", "재난선포"]},
        "trigger": {"type": "string", "description": "발생 원인"},
        "onset_time": {"type": "datetime"},
        "confidence": {"type": "float", "range": [0, 1]}
      }
    },
    "spatial": {
      "description": "피해 공간 정보",
      "fields": {
        "epicenter": {"type": "string", "description": "발생 지점 (시/구/동)"},
        "affected_radius_km": {"type": "float"},
        "coordinates": {"type": "geojson_point"},
        "spread_direction": {"type": "string"},
        "terrain": {"enum": ["도심", "산악", "해안", "농촌"]}
      }
    },
    "resources": {
      "description": "대응 자원 현황",
      "fields": {
        "deployed_units": {"type": "integer", "description": "투입 인력/장비"},
        "required_units": {"type": "integer"},
        "deficit_ratio": {"type": "float", "description": "자원 부족률"},
        "response_eta_min": {"type": "integer"},
        "bottleneck": {"type": "string", "description": "가장 부족한 자원"}
      }
    },
    "casualties": {
      "description": "인명 피해",
      "fields": {
        "confirmed_dead": {"type": "integer"},
        "confirmed_injured": {"type": "integer"},
        "missing": {"type": "integer"},
        "evacuated": {"type": "integer"},
        "at_risk_estimate": {"type": "integer", "description": "추정 위험 인원"}
      }
    },
    "secondary_hazards": {
      "description": "2차 피해 예측",
      "fields": {
        "hazards": {
          "type": "array",
          "items": {
            "type": {"type": "string", "description": "2차 피해 유형"},
            "probability": {"type": "float", "range": [0, 1]},
            "onset_window_hours": {"type": "integer"},
            "prevention_action": {"type": "string"}
          }
        }
      }
    }
  },
  "evolution_log": []
}
```

### 4.2 Claude API 예측 프롬프트

```python
# src/agents/predictor.py
import anthropic
import json

client = anthropic.Anthropic()

PREDICTION_SYSTEM = """
당신은 재난 대응 AI 분석가입니다. 수집된 뉴스 이벤트를 분석하여
구조화된 피해 예측 리포트를 생성합니다.

반드시 아래 온톨로지 스키마에 맞는 JSON을 반환하세요.
확신도가 낮은 필드는 null 대신 confidence 값을 낮게 설정하세요.
추측은 허용되지만, 반드시 근거를 evidence 필드에 명시하세요.
"""

def predict_disaster(events: list[dict], ontology: dict) -> dict:
    """이벤트 목록을 받아 온톨로지 기반 예측 생성"""

    events_text = "\n".join([
        f"[{e.get('platform', 'unknown')}] {e.get('title', '')} ({e.get('collected_at', '')})"
        for e in events[:20]  # 최근 20개만 전달 (컨텍스트 절약)
    ])

    prompt = f"""
다음 재난 관련 수집 이벤트를 분석하세요:

{events_text}

아래 온톨로지 스키마에 맞는 JSON 예측 리포트를 생성하세요:
{json.dumps(ontology['domains'], ensure_ascii=False, indent=2)}

추가로 다음을 포함하세요:
- "summary": 3문장 이내의 상황 요약 (한국어)
- "action_items": 향후 1시간 내 필요한 조치 3가지
- "confidence_overall": 전체 예측의 신뢰도 (0~1)
- "evidence": 각 핵심 수치의 근거 뉴스 제목

JSON만 반환하고 다른 텍스트는 포함하지 마세요.
"""

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        system=PREDICTION_SYSTEM,
        messages=[{"role": "user", "content": prompt}]
    )

    return json.loads(response.content[0].text)
```

### 4.3 온톨로지 자기 진화 구현

자기 진화는 "이전 예측 검증 → 새 차원 추가 → 방법론 개선"의 3단계 루프다.

```python
# src/agents/ontology_evolver.py
class OntologyEvolver:
    """온톨로지 자기 진화: 이전 예측을 검증하고 스키마를 개선"""

    def evolve(self, ontology: dict, past_predictions: list[dict], actual_outcomes: list[dict]) -> dict:
        """
        past_predictions: 지난 예측 리스트
        actual_outcomes: 실제 결과 (수동 입력 또는 후속 뉴스 기반)
        """
        validation_prompt = f"""
지난 재난 예측과 실제 결과를 비교 분석하세요:

예측: {json.dumps(past_predictions[-3:], ensure_ascii=False)}
실제: {json.dumps(actual_outcomes[-3:], ensure_ascii=False)}

현재 온톨로지 스키마: {json.dumps(ontology['domains'], ensure_ascii=False)}

다음을 JSON으로 반환하세요:
{{
  "accuracy_analysis": {{
    "well_predicted": ["잘 맞은 필드들"],
    "poorly_predicted": ["맞지 않은 필드들"],
    "missing_dimensions": ["온톨로지에 없지만 필요한 차원들"]
  }},
  "schema_additions": {{
    "새필드명": {{
      "domain": "추가할 도메인",
      "type": "string/integer/float",
      "description": "설명",
      "rationale": "추가 이유"
    }}
  }},
  "methodology_improvements": ["개선 방향 1~3가지"],
  "next_task": "다음 예측 세션에서 집중할 과제"
}}
"""
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1500,
            messages=[{"role": "user", "content": validation_prompt}]
        )

        evolution = json.loads(response.content[0].text)

        # 온톨로지 업데이트
        for field_name, field_def in evolution.get("schema_additions", {}).items():
            domain = field_def.pop("domain")
            if domain in ontology["domains"]:
                ontology["domains"][domain]["fields"][field_name] = field_def

        # 진화 로그 기록
        ontology["evolution_log"].append({
            "timestamp": datetime.now().isoformat(),
            "version": f"1.{len(ontology['evolution_log'])+1}",
            "changes": evolution
        })

        # 저장
        with open("ontology/disaster_ontology.json", "w", encoding="utf-8") as f:
            json.dump(ontology, f, ensure_ascii=False, indent=2)

        return ontology
```

### 4.4 감성 분석 (여론 분류)

```python
# src/agents/sentiment_analyzer.py
def analyze_sentiment_batch(texts: list[str]) -> list[dict]:
    """Claude API로 배치 감성 분석 (Claude 사용 시 비용 효율 위해 배치 처리)"""

    batch_text = "\n".join([f"{i+1}. {text}" for i, text in enumerate(texts[:10])])

    prompt = f"""
다음 재난 관련 게시글들의 감성을 분석하세요.

{batch_text}

각 게시글에 대해 JSON 배열로 반환하세요:
[
  {{
    "index": 1,
    "sentiment": "panic|anger|grief|neutral|relief|informational",
    "intensity": 0.0~1.0,
    "key_emotion": "핵심 감정 키워드",
    "is_misinformation_risk": true/false
  }}
]

JSON만 반환하세요.
"""

    response = client.messages.create(
        model="claude-haiku-4-5",  # 감성 분석은 Haiku로 비용 절감
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    return json.loads(response.content[0].text)
```

**감성 분류 레이블 설명**:
- `panic`: 공황/공포 확산 게시글 → 대피 상황 파악에 활용
- `anger`: 정부/기관 비판 → 대응 불만 지표
- `grief`: 인명 피해 관련 애도 → 사상자 규모 추정 보조
- `informational`: 정보 공유 게시글 → 수집 가치 높음
- `is_misinformation_risk`: 허위정보 위험 플래그 → 수동 검토 트리거

---

## Step 5: FastAPI 백엔드 + SSE 실시간 업데이트

**무엇을**: 예측 결과를 대시보드에 실시간으로 스트리밍하는 API 서버를 구축한다.
**왜**: WebSocket은 양방향이 필요한 채팅에 적합하지만, 재난 대시보드는 서버→클라이언트 단방향 스트림이 전부다. SSE가 더 단순하고 HTTP 인프라와 호환된다.
**난이도**: ★★★☆☆ | **소요 시간**: 45분

### 5.1 FastAPI SSE 서버

```python
# src/api/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import asyncio
import json
from pathlib import Path

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="src/frontend"), name="static")

# 예측 파일 경로
PREDICTIONS_FILE = Path("data/processed/predictions.jsonl")
EVENTS_FILE = Path("data/raw/events.jsonl")

@app.get("/api/predictions/stream")
async def stream_predictions():
    """최신 예측을 SSE로 스트리밍"""
    async def event_generator():
        last_position = 0
        while True:
            if PREDICTIONS_FILE.exists():
                content = PREDICTIONS_FILE.read_text()
                if len(content) > last_position:
                    new_content = content[last_position:]
                    for line in new_content.strip().split("\n"):
                        if line:
                            yield {"event": "prediction", "data": line}
                    last_position = len(content)
            await asyncio.sleep(5)  # 5초마다 파일 확인

    return EventSourceResponse(event_generator())

@app.get("/api/events/latest")
async def get_latest_events(limit: int = 50):
    """최신 수집 이벤트 반환"""
    if not EVENTS_FILE.exists():
        return []
    lines = EVENTS_FILE.read_text().strip().split("\n")[-limit:]
    return [json.loads(l) for l in lines if l]

@app.get("/api/predictions/latest")
async def get_latest_prediction():
    """가장 최근 예측 리포트 반환"""
    if not PREDICTIONS_FILE.exists():
        return {}
    lines = PREDICTIONS_FILE.read_text().strip().split("\n")
    return json.loads(lines[-1]) if lines else {}

# 서버 실행
# uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Step 6: MapLibre GL 실시간 대시보드 구축

**무엇을**: 다크 테마 지도 위에 재난 이벤트를 레이어로 표시하고, SSE로 실시간 업데이트한다.
**왜**: MapLibre는 WebGL 기반으로 수천 개의 마커를 부드럽게 렌더링한다. Leaflet 대비 애니메이션이 자연스럽고, Mapbox보다 라이선스가 자유롭다.
**난이도**: ★★★☆☆ | **소요 시간**: 60분

### 6.1 HTML 기본 구조

```html
<!-- src/frontend/index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AssiEye - 재난 대응 대시보드</title>
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" />
    <style>
        body { margin: 0; background: #0a0a0f; color: #e0e0e0; font-family: monospace; }
        #map { width: 70vw; height: 100vh; }
        #sidebar { position: fixed; right: 0; top: 0; width: 30vw; height: 100vh;
                   overflow-y: auto; background: #12121a; padding: 16px; }
        .event-card { background: #1a1a2e; border-left: 3px solid #ff4444;
                      padding: 8px 12px; margin: 8px 0; border-radius: 4px; }
        .severity-critical { border-left-color: #ff0000; }
        .severity-warning { border-left-color: #ff9900; }
        .severity-info { border-left-color: #00aaff; }
        #status { position: fixed; top: 10px; left: 10px; background: rgba(0,0,0,0.7);
                  padding: 6px 12px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="sidebar">
        <h3 style="color:#ff4444;">AssiEye</h3>
        <div id="prediction-summary"></div>
        <h4>최근 이벤트</h4>
        <div id="event-list"></div>
    </div>
    <div id="status">연결 중...</div>
    <script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>
    <script src="dashboard.js"></script>
</body>
</html>
```

### 6.2 MapLibre 다크 테마 초기화

```javascript
// src/frontend/dashboard.js

// 무료 다크 스타일 URL (API 키 불필요)
const DARK_STYLE_URL = "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json";
// 대안: "https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json"

const map = new maplibregl.Map({
    container: 'map',
    style: DARK_STYLE_URL,
    center: [127.0, 37.5],  // 한반도 중심
    zoom: 7
});

// GeoJSON 소스 (실시간 업데이트용)
map.on('load', () => {
    map.addSource('disaster-events', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
    });

    // 심각도별 원 레이어
    map.addLayer({
        id: 'events-circle',
        type: 'circle',
        source: 'disaster-events',
        paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'severity_score'], 0, 6, 1, 20],
            'circle-color': [
                'match', ['get', 'severity'],
                '재난선포', '#ff0000',
                '심각', '#ff6600',
                '주의', '#ffaa00',
                '#00aaff'  // 기본값
            ],
            'circle-opacity': 0.8,
            'circle-blur': 0.3
        }
    });

    // 레이블 레이어
    map.addLayer({
        id: 'events-label',
        type: 'symbol',
        source: 'disaster-events',
        layout: {
            'text-field': ['get', 'title'],
            'text-size': 11,
            'text-offset': [0, 1.5],
            'text-anchor': 'top'
        },
        paint: { 'text-color': '#ffffff', 'text-halo-color': '#000000', 'text-halo-width': 1 }
    });

    // SSE 연결
    connectSSE();
    loadLatestEvents();
});
```

### 6.3 SSE 실시간 업데이트

```javascript
// src/frontend/dashboard.js (계속)

function connectSSE() {
    const evtSource = new EventSource('/api/predictions/stream');
    const statusEl = document.getElementById('status');

    evtSource.onopen = () => {
        statusEl.textContent = '실시간 연결됨';
        statusEl.style.color = '#00ff88';
    };

    evtSource.addEventListener('prediction', (event) => {
        const prediction = JSON.parse(event.data);
        updateMap(prediction);
        updateSidebar(prediction);
    });

    evtSource.onerror = () => {
        statusEl.textContent = '재연결 중...';
        statusEl.style.color = '#ff4444';
    };
}

function updateMap(prediction) {
    const spatial = prediction.spatial || {};
    if (!spatial.coordinates) return;

    const source = map.getSource('disaster-events');
    const currentData = source._data;  // 현재 GeoJSON
    const newFeature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [spatial.coordinates.lng, spatial.coordinates.lat] },
        properties: {
            title: prediction.summary?.substring(0, 30) + '...',
            severity: prediction.incident?.severity,
            severity_score: ['재난선포', '심각', '주의', '경보'].indexOf(prediction.incident?.severity) / 3,
            timestamp: new Date().toISOString()
        }
    };

    currentData.features.push(newFeature);
    // 최근 50개만 유지
    if (currentData.features.length > 50) currentData.features.shift();
    source.setData(currentData);
}

async function loadLatestEvents() {
    const response = await fetch('/api/events/latest?limit=20');
    const events = await response.json();
    const listEl = document.getElementById('event-list');
    listEl.innerHTML = events.map(e => `
        <div class="event-card">
            <small>${e.platform || 'unknown'}</small>
            <p style="margin:4px 0">${e.title}</p>
            <small style="color:#888">${e.collected_at || ''}</small>
        </div>
    `).join('');
}
```

---

## Step 7: ngrok으로 외부 공개

**무엇을**: 로컬 서버를 외부에서 접근 가능한 HTTPS URL로 공개한다.
**왜**: 재난 대응 시 현장 인원이 스마트폰으로 실시간 대시보드에 접근해야 한다. ngrok은 서버 배포 없이 즉시 공개가 가능하다.
**난이도**: ★☆☆☆☆ | **소요 시간**: 10분

```bash
# 설치
brew install ngrok  # macOS
# 또는: pip install pyngrok

# 인증 토큰 설정 (https://ngrok.com 에서 무료 계정 생성)
ngrok authtoken YOUR_TOKEN

# FastAPI 서버 실행
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 &

# ngrok 터널 생성
ngrok http 8000

# 출력 예시:
# Forwarding  https://abcd1234.ngrok.io -> http://localhost:8000
# 이 URL을 현장 인원과 공유하면 즉시 접근 가능
```

**Python에서 ngrok 자동화 (시작 스크립트에 포함)**:

```python
# scripts/deploy.py
from pyngrok import ngrok
import subprocess

# FastAPI 서버 백그라운드 실행
proc = subprocess.Popen(["uvicorn", "src.api.main:app", "--port", "8000"])

# ngrok 터널 생성
tunnel = ngrok.connect(8000)
public_url = tunnel.public_url

print(f"대시보드 URL: {public_url}")
print(f"디버그 UI: http://127.0.0.1:4040")

# GitHub Issue에 URL 공유 (선택)
subprocess.run([
    "gh", "issue", "create",
    "--title", f"[배포] AssiEye 대시보드 공개됨",
    "--body", f"URL: {public_url}\n시작 시각: {datetime.now()}",
    "--label", "deployment"
])
```

---

## Step 8: 전체 시스템 실행 순서 (6시간 구축 체크리스트)

| 시간 | 작업 | 에이전트 | 완료 기준 |
|------|------|---------|-----------|
| 0:00~0:30 | 환경 설정, 디렉토리 구조, 패키지 설치 | 개발 에이전트 | `playwright install` 완료 |
| 0:30~1:30 | 네이버 크롤러 + AXTree 파서 구현 | 개발 에이전트 | 10건 이상 이벤트 수집 확인 |
| 1:30~2:30 | 온톨로지 JSON + Claude API 예측 구현 | 개발 에이전트 | 예측 JSON 생성 확인 |
| 2:30~3:30 | FastAPI SSE 서버 + 데이터 파이프라인 | 개발 에이전트 | `/api/predictions/stream` 응답 확인 |
| 3:30~4:30 | MapLibre 대시보드 구현 | 개발 에이전트 | 지도에 마커 표시 확인 |
| 4:30~5:00 | 멀티에이전트 설정 (CLAUDE.md, /loop) | 모든 에이전트 | 4개 터미널에서 /loop 실행 확인 |
| 5:00~5:30 | ngrok 배포 + 감성 분석 연동 | 개발 에이전트 | 외부 URL 접근 확인 |
| 5:30~6:00 | 통합 테스트 + 버그 수정 | 테스트 에이전트 | 실시간 업데이트 15분 이상 안정 운영 |

---

## 비용 추정

### Claude API 비용

| 작업 | 모델 | 주기 | 추정 토큰/회 | 일 비용 |
|------|------|------|------------|---------|
| 예측 리포트 생성 | claude-opus-4-5 | 30분 | 3,000 in + 2,000 out | ~$1.5 |
| 감성 분석 | claude-haiku-4-5 | 15분 | 500 in + 200 out | ~$0.05 |
| 온톨로지 진화 | claude-opus-4-5 | 6시간 | 4,000 in + 1,500 out | ~$0.4 |
| **일 합계** | | | | **~$2/일** |

- 가격 기준: claude-opus-4-5 $15/M input, $75/M output; haiku-4-5 $0.8/M input, $4/M output (2026-03 기준, 변동 가능)
- 재난 비상 운영(24시간): ~$48/일. 평상시 모니터링(6시간): ~$12/일

### 인프라 비용

| 서비스 | 비용 |
|--------|------|
| ngrok (무료 플랜) | $0 (도메인 무작위, 월 10,000 연결 제한) |
| ngrok (Pro 플랜) | $10/월 (고정 도메인, 무제한 연결) |
| MapLibre 타일 (Stadia Maps 무료) | $0 (월 20만 tile 요청 이하) |
| 서버 (로컬 PC 사용 시) | $0 |
| **합계 (무료 플랜)** | **~$2~$50/일 (Claude API만)** |

---

## 주의사항/함정 종합

1. **법적 이슈**: 네이버, YouTube, SNS 크롤링은 이용약관 위반 가능성이 있다. 공식 API 사용을 우선 검토하라. 재난 대응 목적이라도 법적 보호를 받지 못한다.

2. **좌표 정확도**: 뉴스에서 추출한 위치 정보("서울 강남구")는 Claude가 대략적인 좌표로 변환하는데, 오차가 수 킬로미터에 달할 수 있다. 카카오 지역 검색 API로 정확한 좌표를 조회하는 레이어 추가를 권장한다.

3. **AXTree API 지원 중단 주의**: Playwright의 `accessibility.snapshot()` API는 공식적으로 deprecated 상태다. `page.locator().aria_snapshot()`이 현재 권장 방식이나, 이 역시 이후 변경될 수 있다.

4. **SSE 연결 끊김**: 모바일 환경에서 SSE는 배터리 최적화로 인해 자주 끊긴다. 클라이언트에 `reconnect` 로직과 `EventSource` 재생성을 구현하라.

5. **온톨로지 버전 충돌**: 예측 에이전트가 진화 중인 온톨로지를 수집 에이전트와 동시에 읽으면 파싱 오류가 발생한다. 파일에 읽기 잠금(flock)을 적용하거나, 버전 번호를 각 예측 JSON에 포함시켜라.

6. **Claude API rate limit**: Opus 모델은 분당 토큰 제한이 있다. 동시에 여러 에이전트가 Opus를 호출하면 429 오류가 발생한다. 재시도 로직과 지수 백오프(exponential backoff)를 반드시 구현하라.

---

*출처 및 참고 자료*

- [Playwright Python - ARIA Snapshots](https://playwright.dev/python/docs/aria-snapshots)
- [Claude Code Scheduled Tasks - /loop 공식 문서](https://code.claude.com/docs/en/scheduled-tasks)
- [MapLibre GL JS 공식 문서](https://maplibre.org/maplibre-gl-js/docs/)
- [Stadia Maps - Alidade Smooth Dark 스타일](https://docs.stadiamaps.com/map-styles/alidade-smooth-dark/)
- [FastAPI SSE - sse-starlette](https://fastapi.tiangolo.com/tutorial/server-sent-events/)
- [Git Worktrees for Parallel AI Agents](https://devcenter.upsun.com/posts/git-worktrees-for-parallel-ai-coding-agents/)
- [Evontree: Ontology-Guided Self-Evolution of LLMs](https://arxiv.org/html/2510.26683)
- [Claude API Tool Use - Structured JSON](https://platform.claude.com/cookbook/tool-use-extracting-structured-json)
- [OGC Disaster Pilot JSON-LD](https://docs.ogc.org/per/21-054.html)
- [ngrok Quick Setup Guide](https://ngrok.com)
