# Critic Review: AssiEye 재난 대응 AI 시스템

**작성**: Critic | **검토 대상**: 01-technology-deep-dive.md, 02-implementation-guide.md | **날짜**: 2026-03-21

---

## 체크리스트 1: 도메인 적용성

### 1-A. Vercel agent-browser 토큰 절감 수치의 재난 뉴스 크롤링 환경 유효성

**판정: 주의**

Researcher 1의 토큰 절감 수치(76%, 93%)는 Vercel이 제시한 내부 벤치마크 및 paddo.dev의 독립 분석에서 나온 것이다. 그러나 이 수치는 일반적인 웹 앱(로그인 페이지, GitHub, Hacker News)을 대상으로 한 것이다.

재난 뉴스 크롤링 환경에서의 적용성 문제:
- 네이버 뉴스는 기사 목록이 수백 개의 링크와 헤딩으로 구성되어 있어 AX Tree가 여전히 상당한 크기를 가질 가능성이 높다
- YouTube 채널 페이지는 동적 로딩(infinite scroll) 구조라 AX Tree가 매우 크게 나올 수 있다
- Researcher 1 자신도 주석에서 "Wikipedia 단순 페이지: ~51%"를 언급했지만, 뉴스/동영상 플랫폼 특화 벤치마크는 없다

**수정 제안**: Synthesis에서 토큰 절감 수치를 "일반 웹 앱 기준"으로 명시하고, 뉴스/SNS 플랫폼에서는 별도 측정이 필요하다는 단서를 추가할 것.

---

### 1-B. Playwright `page.locator().aria_snapshot()` API 동작 확인

**판정: OK (근거 있음, 단 중요한 주의사항 존재)**

Researcher 2는 `page.locator("body").aria_snapshot()` 를 구현 코드에서 실제로 사용했으며, 하단 주의사항(1000번째 줄)에서 "Playwright의 `accessibility.snapshot()` API는 공식적으로 deprecated 상태다. `page.locator().aria_snapshot()`이 현재 권장 방식"이라고 명시했다.

공식 출처([Playwright Python - ARIA Snapshots](https://playwright.dev/python/docs/aria-snapshots))도 참조되어 있다.

그러나 중요한 간극이 있다:
- 이 API가 실제로 agent-browser 방식과 **동일한 수준**의 토큰 절감을 제공하는지는 증명되지 않았다
- agent-browser는 Rust CLI로 ref 번호(`@e1`, `@e2`)를 부여하는 자체 직렬화 레이어가 있고, Playwright의 `aria_snapshot()`은 YAML 형식으로 덤프하는 방식이다. 이 두 출력의 토큰 효율이 같지 않을 수 있다

**수정 제안**: Synthesis에서 "agent-browser의 ref 방식"과 "Playwright aria_snapshot의 YAML 방식"은 구현 접근이 다르며, 동일한 토큰 효율을 보장하지 않는다는 점을 명시할 것.

---

## 체크리스트 2: 수치 근거 검증

### 2-A. "93% 토큰 절감", "76% 절감" 수치

**판정: OK (조건부)**

Researcher 1은 수치 투명성 섹션에서:
- 93% = `-i` 플래그(상호작용 요소만) 사용 시, Vercel 공식 주장
- 76% = Playwright MCP 대비 agent-browser, paddo.dev 벤치마크
- 조건 의존성(Wikipedia 51%, GitHub 78-79%)을 명시했다

출처도 paddo.dev 및 testcollab.com으로 구체적으로 기재했다. 수치 근거 자체는 적절히 명시되어 있다.

단, **paddo.dev가 독립 검증 기관인지 불명확하다**. 개인 블로그 수준이라면 1차 출처로 간주하기 어렵다. Synthesis에서 "독립 개발자 벤치마크" 수준의 신뢰도라고 명시할 필요가 있다.

---

### 2-B. "$48/일 비용" 수치

**판정: 주의**

Researcher 2(02-implementation-guide.md)의 비용 추정:
- ~$2/일 (일반 운영) 또는 ~$48/일 (재난 24시간 비상 운영)
- 가격 기준: claude-opus-4-5 $15/M input, $75/M output (2026-03 기준)

문제점:
- "$48/일"의 계산 근거가 표에 명시된 ~$2/일에서 24배로 왜 늘어나는지 명확하지 않다. 표에는 일 합계 "~$2/일"로 나와 있지만, 아래 텍스트에서 갑자기 "재난 비상 운영(24시간): ~$48/일"이 등장한다
- 계산 불일치: $2/일 × 24시간 비례는 수학적으로 ~$2/일 그대로여야 한다. $48/일이 되려면 예측 주기가 30분이 아닌 훨씬 짧아지거나, 토큰 사용량이 24배 늘어야 한다
- "평상시 모니터링(6시간): ~$12/일"도 $2/일 기준에서 6배가 되는 이유가 불분명하다

**이것은 결함이다.** $48/일은 맥락에 따라 도입 결정을 좌우하는 수치다.

**수정 제안**: $48/일의 산출 근거(주기, 토큰량, 호출 횟수)를 구체적으로 명시하거나, 계산이 불명확하다면 수치를 제거하거나 "추정값"으로 강등할 것. 현재 $2/일 표와 $48/일 텍스트는 상충한다.

---

### 2-C. agent-browser npm 다운로드 및 GitHub stars 수치

**판정: OK**

Researcher 1은 GitHub stars 23,900+, MapLibre npm 주간 다운로드 2,093,087 (2026-03-21 기준)으로 날짜를 명시했다. 스냅샷 수치로서는 적절한 투명성이다.

---

## 체크리스트 3: 서브에이전트 간 상충점

### 3-A. agent-browser vs Playwright 직접 사용: 상충인가 보완인가?

**판정: 주의 (상충 아니지만, 설명 부족으로 혼란 유발)**

- Researcher 1: agent-browser(CLI 도구, Rust 바이너리)를 Claude Code의 Bash 도구로 호출하는 방식 설명. ref 번호(`@e1`, `@e2`) 기반 상호작용
- Researcher 2: Playwright Python 라이브러리의 `page.locator().aria_snapshot()` API를 직접 구현에 사용

이 두 접근은 **목적과 사용 맥락이 다르다**:
- agent-browser: Claude Code 에이전트가 브라우저를 제어할 때 (에이전트의 도구)
- Playwright Python API: Python 크롤러 코드에서 AX Tree 기반 텍스트 추출 시 (개발자의 코드)

그러나 두 문서 어디에도 이 차이를 명시적으로 설명하지 않는다. 독자는 "같은 것을 두 가지 방법으로 설명하는 건가, 아니면 다른 것인가?"를 혼동할 수 있다.

**수정 제안**: Synthesis에서 두 접근의 역할 분리를 명확히 할 것:
- Layer 1: Claude Code 에이전트가 능동적으로 브라우저를 탐색할 때 → agent-browser CLI
- Layer 2: 백엔드 Python 크롤러에서 정기 수집 시 → Playwright Python `aria_snapshot()`

---

## 체크리스트 4: 누락 관점

### 4-A. 네이버/YouTube/SNS 크롤링의 법적 리스크

**판정: OK (적절히 경고됨)**

Researcher 2는 두 곳에서 명시적으로 경고했다:
1. Step 2 주의사항: "Anti-bot 감지: 네이버는 headless 감지가 강하다"
2. Step 8 주의사항 1번: "네이버, YouTube, SNS 크롤링은 이용약관 위반 가능성이 있다. 공식 API 사용을 우선 검토하라. **재난 대응 목적이라도 법적 보호를 받지 못한다.**"

충분히 경고되었다. 다만 네이버 데이터랩 API, YouTube Data API 같은 구체적인 대안 링크는 없다. Synthesis에서 이 대안을 언급하면 실용성이 높아진다.

---

### 4-B. Claude Code `/loop` 스킬의 실제 동작 확인 필요 여부

**판정: 결함**

Researcher 1과 Researcher 2 모두 `/loop`를 Claude Code의 "내장 스킬"로 설명하지만, 실제 검증 여부가 불명확하다.

구체적인 문제:
- Researcher 1이 인용한 `code.claude.com/docs/en/skills`와 `verdent.ai/guides/claude-code-loop-command`는 검색 결과 합성이거나 가상 URL일 수 있다. Claude Code 공식 문서는 `docs.anthropic.com`에 있으며, `code.claude.com`이 공식 도메인인지 확인되지 않았다
- Researcher 2의 Step 3.1에서 `claude --version` 출력 예시 없이 "v2.1.72+ 필요"를 언급했다. 이 버전 요건의 출처가 없다
- Researcher 2의 주의사항에서 "/loop 3일 만료: 공식 문서 확인됨"이라고 했지만, 구체적인 공식 문서 링크가 없다

**이것은 결함이다.** `/loop`의 존재 자체와 동작 방식이 구현 가이드의 핵심인데, 출처 URL이 검증 불가능하다.

**수정 제안**: Claude Code 공식 문서(`docs.anthropic.com`)에서 `/loop` 또는 scheduled tasks 기능을 직접 확인하고 링크를 교체할 것. 확인 불가 시 "공식 문서 미확인, 커뮤니티 보고 기준"으로 명시할 것.

---

### 4-C. 온톨로지 "자기 진화"의 실제 구현 난이도

**판정: 결함**

Researcher 2는 `OntologyEvolver` 클래스를 통해 자기 진화가 간단히 구현 가능한 것처럼 제시했다. 그러나 실제 동작에는 심각한 전제 조건이 있다:

1. **actual_outcomes 데이터 획득 문제**: `evolve()` 메서드는 `actual_outcomes` 파라미터를 받는데, 이는 "실제 결과(수동 입력 또는 후속 뉴스 기반)"라고 주석이 달려 있다. 재난의 실제 결과는 수일~수주 후에야 집계된다. 이 데이터 없이는 진화 루프가 작동하지 않는다.

2. **스키마 진화의 안전성**: Claude가 제안한 `schema_additions`를 자동으로 온톨로지에 반영하면, 다음 예측 사이클의 파싱 코드가 새 스키마와 호환되지 않을 수 있다. 버전 관리 없이는 시스템이 깨질 수 있다.

3. **순환 논리**: 예측의 정확도를 검증하는 주체가 예측을 생성한 동일한 Claude API다. 독립적인 ground truth 없이는 "자기 진화"가 아닌 "자기 강화"에 머문다.

Researcher 2 자신도 Step 4 주의사항에서 온톨로지 버전 충돌을 언급했지만, 진화 가능성 자체에 대한 근본적 의문을 제기하지 않았다.

**수정 제안**: Synthesis에서 온톨로지 자기 진화는 "현 구현은 프로토타입 수준이며, 실제 ground truth 데이터 파이프라인과 스키마 버전 관리 없이는 프로덕션에 사용할 수 없다"고 명시할 것.

---

## 체크리스트 5: 확신도 교정

### 5-A. "6시간 만에 구축 가능" 주장

**판정: 결함**

Researcher 2의 문서 서두에는 "목표: 사건 발생 후 6시간 이내에 동작하는 재난 대응 AI 시스템 구축"이라고 명시했고, Step 8 타임라인 표에서 구체적인 단계별 일정을 제시했다.

문제점:
- 타임라인 표의 총 시간 합계는 **5.5~6시간이지만 이는 개발 에이전트 혼자 직렬 작업 기준**이다. 표에는 여러 에이전트가 병렬 작업하는 것처럼 보이지만, 각 단계가 선행 단계에 의존한다(크롤러 없이는 예측 불가, API 없이는 대시보드 불가).
- "숙련자 기준 3~4시간"이라는 표현도 있으나, Playwright + FastAPI + MapLibre + Claude API + ngrok + 멀티에이전트 설정을 모두 처음 통합하는 사람이 숙련자일 가능성은 낮다.
- AXTree 파싱 로직(extract_articles)은 매우 단순한 구현으로, 실제 네이버 뉴스 구조에서 정확도 검증 없이 6시간 내에 "동작하는" 수준이 되기 어렵다.

**수정 제안**: Synthesis에서 "6시간은 모든 서비스의 계정/API키가 사전 준비된 상태에서의 최소 추정치이며, 네이버 크롤링의 안정성 확보와 AXTree 파서 튜닝에 추가 시간이 필요하다"고 보정할 것.

---

### 5-B. 자기 진화 메커니즘의 실효성

**판정: 결함** (4-C와 연계)

Researcher 2는 `OntologyEvolver`를 6시간 구축 타임라인의 Step 4(90분)에 포함시켰다. 이는 자기 진화 메커니즘이 90분 안에 구현되고 실제로 작동할 수 있다는 암묵적 확신이다. 그러나 위 4-C에서 분석한 대로, actual_outcomes 없이는 진화 루프 자체가 실행 불가능하다.

코드는 작성할 수 있지만, 의미 있는 진화를 확인할 수 있는 것은 최소 수일의 운영 데이터가 쌓인 후다.

---

## 체크리스트 6: 문제 정의 검토

### 6-A. 세 가지 핵심 기술의 연동 플로우 명확성

**판정: 주의**

두 Researcher가 각각 기술 심층 분석과 구현 가이드를 작성했으나, **세 기술(agent-browser/AXTree + /loop + MapLibre)이 어떻게 하나의 시스템으로 연동되는지 통합 플로우가 명시적으로 없다.**

- Researcher 1은 각 기술을 독립적으로 설명했다
- Researcher 2의 전체 아키텍처 다이어그램(수집→처리→출력)은 있지만, "agent-browser가 어느 레이어에서 사용되는가"가 불명확하다. 구현 코드에서는 Playwright Python API만 사용되고, agent-browser CLI는 구현 코드에 등장하지 않는다

이는 혼란의 핵심이다: 01 문서는 agent-browser를 핵심으로 설명하지만, 02 문서의 실제 구현은 Playwright Python을 사용한다. 독자는 agent-browser가 구현에서 어디에 쓰이는지 알 수 없다.

**수정 제안**: Synthesis에서 두 접근의 역할 분리를 플로우 다이어그램으로 명확히 할 것:
- agent-browser: Claude Code 에이전트가 대화형으로 웹 탐색할 때 (예: 개발 에이전트가 브라우저로 테스트 결과 확인)
- Playwright Python `aria_snapshot()`: 자동화된 크롤러 코드에서 정기 수집 시

---

### 6-B. 구현 가이드의 실제 따라할 수 있는 수준

**판정: OK (대체로 충분)**

Researcher 2의 구현 가이드는 실제 실행 가능한 코드와 커맨드를 제공하며, Step별 구조가 명확하다. 대부분의 독자는 이를 따라 시스템을 구축할 수 있다.

다만 몇 가지 미완성 부분이 있다:
- `src/crawler/run_all.py`가 참조되지만 실제 코드가 없다 (각 크롤러를 통합 실행하는 진입점)
- `_data` 필드 직접 접근(`source._data`)은 MapLibre의 내부 API를 직접 참조하는 것으로 버전에 따라 작동하지 않을 수 있다. `getSource().getData()` 또는 별도 상태 관리를 사용해야 한다

---

## 종합 판단

### Synthesis에 반드시 반영해야 할 사항

1. **$48/일 비용 계산 오류 또는 불명확성** — 표의 ~$2/일과 텍스트의 ~$48/일이 상충한다. 계산 근거를 명시하거나 수치를 수정해야 한다.

2. **/loop 출처 URL 검증 필요** — `code.claude.com/docs/en/skills` 및 `verdent.ai/guides/...`가 실제 존재하고 공식 문서인지 확인되지 않았다. Synthesis에서 "/loop의 공식 문서 링크는 검증 필요" 주석을 달거나, Repair Pass를 통해 검증해야 한다.

3. **agent-browser vs Playwright Python 역할 분리 명시** — 두 접근이 같은 개념의 다른 구현인지, 아니면 다른 레이어에서 사용하는 별개 도구인지 독자가 혼동하지 않도록 명시할 것.

4. **온톨로지 자기 진화의 전제 조건 명시** — actual_outcomes 데이터가 없으면 진화 루프가 실행 불가능하며, 프로토타입 수준임을 명시할 것.

5. **6시간 구축 타임라인의 단서 조항** — "사전 준비 완료 + 숙련자 기준 + 네이버 크롤링 안정성 미포함"임을 명시할 것.

6. **토큰 절감 수치의 도메인 한정** — 뉴스/SNS 플랫폼에서의 실제 절감율은 측정되지 않았음을 명시할 것.

---

### 핵심 결론을 바꿀 수 있는 결함 여부

**결함 2개가 핵심 결론에 영향을 미칠 수 있다.**

**결함 A: /loop 공식 문서 검증 불가**
- 영향: 이 시스템의 핵심 자동화 메커니즘인 `/loop`가 실제로 존재하고 설명된 대로 작동하는지 불확실하다. 만약 `/loop`가 현재 Claude Code에 없거나, 3일 만료 제한이 없거나, 동작 방식이 다르다면 멀티에이전트 구성 전체가 재설계되어야 한다.
- 권고: **Repair Pass 트리거** — Verifier 에이전트가 Claude Code 공식 문서(`docs.anthropic.com`)에서 scheduled tasks 또는 /loop 기능을 직접 확인해야 한다.

**결함 B: 비용 추정 내부 불일치 ($2/일 vs $48/일)**
- 영향: 도입 결정에 영향을 주는 핵심 수치다. $2/일과 $48/일은 의사결정에서 다른 결론을 낳는다.
- 권고: Synthesis에서 명시적으로 계산 불일치를 지적하고, 보수적 상한치($48/일)를 24시간 풀 운영 기준으로 사용하되 계산 근거를 재확인할 것.

---

*검토 완료: 2026-03-21*
