# OpenClaw AI 에이전트 프레임워크: 핵심 개념과 구조

> Researcher 1 산출물 | 2026-03-23

---

## 1. OpenClaw가 정확히 무엇인가

### 한 줄 정의

OpenClaw은 **내 컴퓨터에서 직접 돌아가는 자율 AI 비서**다. 일반 챗봇처럼 질문-답변만 하는 것이 아니라, 파일을 관리하고, 브라우저를 조작하고, 이메일을 처리하고, 메시징 앱(WhatsApp, Telegram, Slack 등)을 통해 실제로 '일'을 수행한다.

### 기원: Clawdbot에서 OpenClaw까지

| 시기 | 이름 | 변경 이유 |
|------|------|-----------|
| 2025년 11월 | **Clawdbot** | Anthropic의 Claude에서 따온 이름으로 최초 공개 |
| 2026년 1월 초 | **Moltbot** | Anthropic 상표권 경고로 강제 리브랜딩 |
| 2026년 1월 중 | **OpenClaw** | "Moltbot은 발음이 어색하다"는 이유로 최종 변경 |

창시자는 **Peter Steinberger**(오스트리아 출신 개발자). 14세에 컴퓨터에 빠져, 2011년 PSPDFKit(iPad PDF 렌더링 도구)을 만들어 Apple, Dropbox 등 10억 대 이상 기기에 탑재시킨 경력자다. 2025년 AI의 "패러다임 전환"을 직감하고 44개 AI 프로젝트 경험을 바탕으로 OpenClaw을 만들었다. [출처: Fortune, 2026-02-19](https://fortune.com/2026/02/19/openclaw-who-is-peter-steinberger-openai-sam-altman-anthropic-moltbook/)

2026년 2월 15일, Steinberger는 **OpenAI에 합류**(개인 에이전트 부문 리드)하였고, OpenClaw 자체는 OpenAI 후원 하에 **독립 오픈소스 재단**으로 이관되었다. Google이 Chromium을 지원하면서 Chrome을 만드는 구조와 유사하다. [출처: MindStudio, 2026-02-23](https://www.mindstudio.ai/blog/what-is-openclaw-ai-agent/)

### 핵심 철학

- **로컬 우선(Local-first)**: 클라우드 의존 없이 내 하드웨어에서 실행
- **"실제로 일하는 AI"**: 대화만 하는 챗봇이 아닌, 명령 실행·파일 조작·웹 탐색이 가능한 자율 에이전트
- **투명한 구조**: 설정·기억·행동 규칙이 모두 Markdown 텍스트 파일. Git으로 버전 관리 가능
- **MIT 라이선스**: 상업적 사용, 수정, 재배포 자유

---

## 2. 어떻게 작동하는가 (비개발자용 설명)

OpenClaw의 작동 방식을 일상 비유로 설명한다.

### 2.1 설치: 내 컴퓨터에 "비서 사무실" 만들기

OpenClaw은 내 컴퓨터(Mac Mini, Linux 서버, VPS 등)에 설치되는 **Node.js 프로그램**이다. 설치하면 "Gateway"라는 프로세스가 백그라운드에서 항상 돌아간다. 이 Gateway가 비서의 "사무실"에 해당한다.

- 기본적으로 내 컴퓨터 안에서만 접근 가능 (`127.0.0.1:18789`)
- 외부 접근이 필요하면 SSH 터널이나 Tailscale 같은 보안 경로를 별도 설정해야 한다

### 2.2 AI 모델 연결: 비서의 "두뇌" 선택

Gateway 자체는 '손발'이고, '두뇌'는 별도의 AI 모델이다. 사용자가 선택할 수 있다:

- **클라우드 모델**: Claude Opus, GPT-4o, Gemini 등 (API 키 필요)
- **로컬 모델**: Ollama를 통해 직접 돌리는 모델 (24GB 이상 VRAM 권장)

설정 파일(`openclaw.json`)에서 모델을 지정하면 된다. 모델이 실패하면 자동으로 대체 모델로 전환(failover)하는 기능도 있다. [출처: Milvus Blog](https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md)

### 2.3 에이전트 루프: 관찰 → 계획 → 실행 → 관찰

메시지가 도착하면 다음 순환이 시작된다:

```
[메시지 수신] → [컨텍스트 조립] → [AI 모델에 전달] → [도구 실행] → [결과 관찰] → (반복, 최대 20회) → [최종 응답 전송]
```

이것을 **ReAct 패턴**이라 부른다. 비유하자면:

1. **관찰**: "사장님이 '내일 회의 자료 정리해줘'라고 WhatsApp으로 보냈구나"
2. **계획**: "캘린더에서 내일 일정 확인하고, 관련 파일을 찾아서 요약해야겠다"
3. **실행**: 캘린더 API 호출, 파일 검색, 요약 작성
4. **관찰**: "결과가 나왔다. 사장님에게 보내자"

한 세션 안에서는 **한 번에 하나의 작업만 순서대로 처리**한다(Lane Queue). 동시에 여러 명령을 보내도 꼬이지 않는다.

### 2.4 지속 메모리: "비서가 어제 한 일을 기억한다"

일반 챗봇은 대화가 끝나면 기억을 잃는다. OpenClaw은 다르다:

| 파일 | 역할 |
|------|------|
| `AGENTS.md` | 에이전트의 행동 규칙 ("이렇게 일해라") |
| `SOUL.md` | 성격과 톤 ("친근하게 말해라") |
| `TOOLS.md` | 사용 가능한 도구 목록 |
| `MEMORY.md` | 장기 기억 ("사용자는 매주 월요일 보고서를 원한다") |
| `HEARTBEAT.md` | 주기적 체크 지침 ("30분마다 이메일 확인해라") |

모든 것이 **Markdown 텍스트 파일**이므로, 메모장으로 열어서 직접 수정할 수 있다. 과거 대화는 SQLite 벡터 데이터베이스에 저장되어 의미 기반 검색도 가능하다. [출처: MindStudio](https://www.mindstudio.ai/blog/what-is-openclaw-ai-agent/)

### 2.5 Heartbeat: "비서가 알아서 체크한다"

OpenClaw의 가장 차별적인 기능이다. **30분마다(설정 변경 가능)** 에이전트가 스스로 깨어나서:

1. `HEARTBEAT.md` 파일을 읽고
2. 할 일이 있는지 판단하고
3. 필요하면 실행하고 사용자에게 알림

예시:
- 아침 브리핑 자동 생성
- 새 이메일 도착 시 알림
- 주가 급변 시 경고
- 예약한 항공편 체크인 자동 수행

비용 절감을 위해 먼저 간단한 규칙 기반 확인(패턴 매칭, API 조회)을 수행하고, 실제로 의미 있는 변화가 감지될 때만 비싼 AI 모델을 호출한다. [출처: MindStudio](https://www.mindstudio.ai/blog/what-is-openclaw-ai-agent/)

---

## 3. 핵심 기능 정리

### 3.1 내장 도구 (Built-in Tools)

| 도구 | 설명 |
|------|------|
| **셸 실행** | 터미널 명령어를 직접 실행 |
| **파일 시스템** | 워크스페이스 내 파일 읽기/쓰기 |
| **브라우저 제어** | Chrome/Chromium을 CDP로 조작 (웹 탐색, 폼 입력, 데이터 추출) |
| **크론 작업** | 반복 작업 스케줄링 |
| **웹훅** | 외부 이벤트 수신 및 반응 |

### 3.2 AgentSkills 시스템

내장 도구 외에 **스킬(Skills)**을 설치하여 기능을 확장할 수 있다. 스킬은 `~/.openclaw/workspace/skills/<skill>/SKILL.md` 형태로 저장된다.

- **ClawHub**: 커뮤니티가 만든 스킬 마켓플레이스. 162개 이상의 프로덕션 레디 템플릿이 19개 카테고리로 분류되어 있다.
  [출처: GitHub - awesome-openclaw-agents](https://github.com/mergisi/awesome-openclaw-agents)
- 스킬 예시: CRM 연동, SEO 감사, 골프 핸디캡 추적, 코딩 에이전트 연동, 보안 감사 등
- **보안 주의**: 보안 연구자들이 ClawHub 스킬의 약 20%에서 악성 코드를 발견했다는 보고가 있다. 스킬 설치 시 반드시 코드를 검토해야 한다. [출처: ByteMonk YouTube, 2026-02-26](https://www.youtube.com/watch?v=Hv84JhzKvKQ)

### 3.3 메시징 통합 (Multi-Channel Gateway)

| 플랫폼 | 지원 방식 |
|---------|-----------|
| WhatsApp | 내장 채널 (Web 기반) |
| Telegram | 내장 채널 |
| Discord | 내장 채널 |
| Slack | 내장 채널 |
| Signal | 내장 채널 |
| iMessage | 내장 채널 |
| MS Teams | 확장 플러그인 |
| Matrix | 확장 플러그인 |
| Zalo | 확장 플러그인 |

하나의 Gateway가 **모든 채널을 동시에 관리**한다. WhatsApp으로 "회의 정리해줘"라고 보내면, 같은 에이전트가 Slack으로 결과를 공유할 수도 있다.

### 3.4 Heartbeat (스케줄링)

위 2.5절에서 설명한 대로, 주기적으로 에이전트가 자율적으로 작업을 수행하는 시스템이다. 단순 크론잡이 아니라, AI가 "지금 할 일이 있는가?"를 판단하는 점이 차별점이다.

---

## 4. 설치와 사용 난이도

### 4.1 설치 방식

| 방식 | 난이도 | 설명 |
|------|--------|------|
| **1-click 인스톨러** | 낮음 | 공식 사이트(`openclaw.ai`)에서 제공. Mac/Linux/Windows용 설치 스크립트 |
| **Docker** | 중간 | `docker run` 한 줄로 실행 가능 |
| **Docker Swarm** | 높음 | 24/7 자율 스웜 운영 시. 호스트 노드당 32GB 통합 메모리 권장 |
| **수동 설치** | 높음 | Git clone → 환경 설정 → 수동 실행 |

[출처: GitHub pano135/openclaw-ai](https://github.com/pano135/openclaw-ai)

### 4.2 실제 시작 난이도 평가

**터미널 경험이 있는 사용자**: 비교적 쉽다. 설치 스크립트 실행 → `openclaw.json`에 API 키 입력 → 메시징 앱 연결이 기본 흐름이다.

**비개발자**: 난이도가 높다. 이유:
- API 키 발급(Anthropic/OpenAI 계정 필요)이 진입장벽
- 메시징 앱 연결(특히 WhatsApp)에 QR 코드 스캔 등 추가 설정 필요
- 문제 발생 시 터미널 로그를 읽을 줄 알아야 디버깅 가능
- 로컬 모델 사용 시 GPU 사양 이해 필요

**관리형 대안**: OpenClawd(openclawd.com) 같은 서드파티 관리형 플랫폼이 등장하여, 서버 설정 없이 OpenClaw을 사용할 수 있는 옵션도 생겼다. [출처: Yahoo Finance](https://finance.yahoo.com/news/openclawd-releases-major-platform-openclaw-150000544.html)

### 4.3 Mission Control (GUI 대시보드)

터미널 없이 에이전트를 관리하고 싶다면, **OpenClaw Mission Control**(GitHub 스타 2,900개)이라는 웹 대시보드가 있다. AI 에이전트 배정, 작업 할당, 멀티 에이전트 협업을 GUI로 관리할 수 있다. [출처: GitHub abhi1693/openclaw-mission-control](https://github.com/abhi1693/openclaw-mission-control)

---

## 5. 실제 인기도 지표

### GitHub 스타 추이

| 시점 | 스타 수 | 비고 |
|------|---------|------|
| 2025년 11월 (출시 24시간) | ~9,000 | Clawdbot 이름으로 최초 공개 |
| 2026년 1월 말 | ~100,000 | 48시간 만에 10만 도달 |
| 2026년 2월 중 | ~214,000 | React의 10년 기록을 60일 만에 추월 |
| 2026년 2월 말 | ~250,000 | Linux(218K)도 추월하여 GitHub 14위 |
| 2026년 3월 초 | ~318,000 | 60일 기준 역대 최고 성장 속도 |

[출처: MLQ.ai](https://mlq.ai/news/openclaws-viral-surge-mirrors-chatgpt-launch-fueling-fears-of-ai-model-commoditization/), [Star History](https://www.star-history.com/blog/openclaw-surpasses-linux-14th-most-starred)

### 커뮤니티 규모

| 지표 | 수치 | 출처 |
|------|------|------|
| GitHub 스타 | ~318,000+ (2026년 3월) | GitHub |
| 포크 수 | 57,000+ | MLQ.ai |
| 기여자 수 | 1,100+ | MLQ.ai |
| 주간 방문자 | 200만+ | Fortune |
| 코드 라인 수 | 300,000+ | 36kr |
| 월간 트래픽 증가율 | 925% (2-3월) | Panto AI |

> **수치 투명성**: 위 GitHub 스타 수치는 2026년 2-3월 시점의 기사 기준이며, 실제 수치는 시점에 따라 차이가 있을 수 있다. 특히 "봇 스타"(자동화된 가짜 스타) 의혹이 일부 제기된 바 있으나, 포크 수와 기여자 수가 동반 성장한 점은 실질적 인기를 뒷받침한다.

### 릴리즈 빈도

공식 저장소(`openclaw/openclaw`)의 커밋 히스토리를 보면 **거의 매일 업데이트**가 이루어지고 있으며, 2026년 3월 20일에도 `AGENTS.md` 문서 업데이트가 확인된다. 다만 공식 "릴리즈(태그)" 형태보다는 `main` 브랜치에 지속적으로 병합하는 **롤링 릴리즈** 방식을 채택하고 있다. [출처: GitHub 커밋 로그](https://github.com/openclaw/openclaw)

---

## 6. 보안 우려 사항

OpenClaw의 인기만큼 보안 문제도 심각하게 제기되고 있다. 이 섹션은 의사결정에 중요하므로 포함한다.

| 우려 사항 | 상세 |
|-----------|------|
| **악성 스킬** | ClawHub 마켓플레이스 스킬 중 ~20%에서 악성 코드 발견 |
| **공개 노출** | 30,000개 이상의 인스턴스가 인터넷에 직접 노출됨 |
| **기업 내부 제한** | Meta가 내부 사용 금지. 여러 기업이 사용 제한 |
| **권한 범위** | 셸 실행 + 파일 접근 + 브라우저 제어 = 매우 넓은 공격 표면 |

[출처: ByteMonk YouTube](https://www.youtube.com/watch?v=Hv84JhzKvKQ)

**대응책**: OpenClaw은 도구별 **allowlist**(허용 목록) 방식으로 보안을 관리한다. 기본적으로 localhost 바인딩이며, 도구 실행도 구조화된 실행 경로를 따른다. 그러나 궁극적으로 **Gateway가 돌아가는 호스트 머신이 신뢰 경계선**이다. 이 머신이 뚫리면 에이전트 전체가 위험해진다. [출처: centminmod/explain-openclaw](https://github.com/centminmod/explain-openclaw)

---

## 7. Researcher 사고 지침 적용

### 반증 탐색

"OpenClaw이 비개발자도 쉽게 쓸 수 있다"는 주장에 대한 반증:
- 실제로는 API 키 발급, 터미널 사용, 환경 설정 등 **기술적 진입장벽이 상당하다**
- 보안 설정을 제대로 하지 않으면 데이터 유출 위험이 크다
- "1-click 설치"라고 해도 이후 설정 과정은 터미널 지식을 요구한다

### 실행 연결

이 정보로 가능한 의사결정:
1. **개인 자동화 도구로 도입 여부**: 기술 역량이 충분하고, 보안 관리를 직접 할 수 있다면 강력한 도구. 그렇지 않으면 관리형 서비스(OpenClawd 등) 고려
2. **기업 도입 여부**: 보안 감사 없이는 권장하지 않음. 특히 스킬 마켓플레이스의 악성 코드 문제가 해결되기 전까지는 신중해야 함
3. **경쟁 제품 비교 기준**: Claude Code, GitHub Copilot 등 "포그라운드 에이전트"와 달리 "백그라운드 자율 에이전트"라는 점이 핵심 차별점. 비교 시 이 축을 기준으로 해야 함

### 관점 확장

1. **숨은 변수 - AI 모델 비용**: OpenClaw 자체는 무료(MIT)지만, AI 모델 API 호출 비용은 사용자 부담이다. Heartbeat가 30분마다 작동하면 월간 API 비용이 상당할 수 있다. Steinberger 본인도 월 $10,000의 서버 비용을 감당했다고 밝혔다.
2. **인접 질문 - 에이전트 생태계의 표준화**: OpenClaw의 스킬 시스템은 Anthropic의 MCP(Model Context Protocol)와 유사한 방향이다. 향후 이 두 표준이 통합될지, 경쟁할지가 OpenClaw의 장기 생존에 영향을 줄 수 있다.

### 문제 재정의

원래 질문 "OpenClaw가 무엇이고 어떻게 작동하는가?"보다 더 적절한 핵심 질문:
> **"자율 AI 에이전트를 내 환경에서 안전하게 운영하려면 어떤 조건이 필요하며, OpenClaw은 그 조건을 얼마나 충족하는가?"**

---

## 출처 목록

1. Fortune (2026-02-19): [Who is OpenClaw creator Peter Steinberger?](https://fortune.com/2026/02/19/openclaw-who-is-peter-steinberger-openai-sam-altman-anthropic-moltbook/)
2. MindStudio (2026-02-23): [What Is OpenClaw? The Open-Source AI Agent That Actually Does Things](https://www.mindstudio.ai/blog/what-is-openclaw-ai-agent/)
3. Milvus Blog: [Complete Guide to OpenClaw](https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md)
4. GitHub openclaw/openclaw: [공식 저장소](https://github.com/openclaw/openclaw)
5. MLQ.ai: [OpenClaw's Viral Surge](https://mlq.ai/news/openclaws-viral-surge-mirrors-chatgpt-launch-fueling-fears-of-ai-model-commoditization/)
6. Star History (2026-02-24): [OpenClaw Surpasses Linux](https://www.star-history.com/blog/openclaw-surpasses-linux-14th-most-starred)
7. ByteMonk YouTube (2026-02-26): [The Most Dangerous AI Project on GitHub?](https://www.youtube.com/watch?v=Hv84JhzKvKQ)
8. Peter Steinberger Blog (2026-02-14): [OpenClaw, OpenAI and the future](https://steipete.me/posts/2026/openclaw)
9. Panto AI: [OpenClaw AI Platform Statistics 2026](https://www.getpanto.ai/blog/openclaw-ai-platform-statistics)
10. GitHub centminmod/explain-openclaw: [Multi-AI documentation](https://github.com/centminmod/explain-openclaw)
11. GitHub abhi1693/openclaw-mission-control: [Mission Control Dashboard](https://github.com/abhi1693/openclaw-mission-control)
12. Yahoo Finance (2026-03-04): [OpenClawd Releases Major Platform Update](https://finance.yahoo.com/news/openclawd-releases-major-platform-openclaw-150000544.html)
13. Wikipedia: [OpenClaw](https://en.wikipedia.org/wiki/OpenClaw)
14. 36kr (2026-02-02): [The Father of OpenClaw](https://eu.36kr.com/en/p/3667047170044420)
