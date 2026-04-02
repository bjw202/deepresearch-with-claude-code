---

## name: community-analysis description: "커뮤니티 반응 분석 방법론. researcher.md의 community 모드에서 참조하는 검색 전략 스킬. 기술 동향/전략/비즈니스 주제에서 활성화. 순수 기술 수학에서는 생략."

# Community Analysis — 커뮤니티 반응 분석 방법론

researcher.md 에이전트가 `community` 모드로 지정되었을 때 이 스킬을 Read하여 참조한다.

**활성화 조건**: 기술 동향, 전략, 비즈니스, 제품 주제에서 사용. 순수 기술 수학(기어 설계 수식 등)에서는 이 모드를 사용하지 않는다.

## Step 1: 플랫폼 선정

주제 특성에 따라 조사 대상 플랫폼을 선정한다:

| 주제 유형 | 우선 플랫폼 |
| --- | --- |
| 기술/개발 | Hacker News, Reddit(r/programming, r/technology), Stack Overflow |
| 비즈니스/산업 | Reddit(관련 서브레딧), LinkedIn 토론, Blind |
| 제품/서비스 | Reddit(관련 서브레딧), Product Hunt, 리뷰 사이트 |
| 사회/정책 | Reddit, Twitter/X, 국내 커뮤니티(DC인사이드, 클리앙 등) |
| 학술/과학 | Reddit(r/science, r/askscience), ResearchGate |

## Step 2: 4계층 앙상블 검색

### Layer 0: WebSearch — 제한적 사용

**주의**: reddit.com, news.ycombinator.com 등 주요 커뮤니티 사이트가 Anthropic 크롤러를 차단한다. `allowed_domains` 필터가 작동하지 않으므로 **community 모드에서는 Layer 1을 주력으로 사용**한다.

WebSearch는 차단되지 않는 플랫폼에만 사용:

```
WebSearch(query: "주제 discussion forum", allowed_domains: ["stackoverflow.com"])
```

**WebFetch는 시도 가능**: 스레드 URL을 알고 있으면 WebFetch로 내용 확인을 시도한다. 차단 시 `tavily extract`로 대체.

```
WebFetch(url: "https://news.ycombinator.com/item?id=...", prompt: "주요 의견과 논쟁 포인트를 추출하라.")
```

### Layer 1: Perplexity + Tavily (community 모드 주력)

```bash
./scripts/search.sh perplexity search "주제 reddit hacker news 반응 의견"
./scripts/search.sh tavily search "site:reddit.com 주제 키워드" --depth advanced
```

**한국어 커뮤니티 (주제가 한국 관련이면):**

```bash
./scripts/search.sh tavily search "주제 site:clien.net OR site:dcinside.com" --depth advanced
```

## Step 3: 정서 분석

수집된 의견을 분류한다:

| 정서 | 기준 | 주의사항 |
| --- | --- | --- |
| **긍정** | 지지, 칭찬, 기대, 옹호 | 마케팅/홍보성 구분 |
| **부정** | 비판, 우려, 반대, 실망 | 건설적 비판 vs 감정적 반응 구분 |
| **중립** | 관망, 질문, 정보 요청 |  |

**정서 판단 시 주의:**

- 반어법/풍자를 문자 그대로 해석하지 않는다
- 업보트 수를 정서 강도의 참고 지표로 활용한다
- 극단적 의견이 전체를 대표하지 않음을 인식한다
- 긍정:부정:중립 비율을 구체적 근거와 함께 제시한다

## Step 4: 커뮤니티 편향 보정

각 플랫폼의 고유 편향을 인식하고 보정한다:

| 플랫폼 | 알려진 편향 |
| --- | --- |
| Hacker News | 실리콘밸리 중심, 기술 낙관주의, 스타트업 친화적 |
| Reddit | 서브레딧별 에코챔버, 초기 댓글이 토론 방향 결정 |
| Twitter/X | 극단적 의견이 증폭, 짧은 형식으로 뉘앙스 부족 |
| Stack Overflow | 기술 정확성 중시, 초보 질문에 비우호적 |
| 국내 커뮤니티 | 사이트별 정치/세대 편향 존재 |

## Step 5: 신호 vs 노이즈 구분

- **신호**: 구체적 경험담, 데이터 기반 의견, 전문가 분석, 다수 공감 의견
- **노이즈**: 근거 없는 추측, 감정적 반응만 있는 댓글, 봇/마케팅 의심 게시물
- 노이즈를 완전히 배제하지는 않되, 별도 표기하여 비중을 낮춘다

## Step 6: 조작/편향 감지

다음 신호가 있으면 인위적 여론 가능성을 기록한다:

- 동일 논점을 반복하는 신규 계정 다수
- 일정 시간 내 갑작스러운 의견 급증
- 부자연스러운 문체 패턴 (템플릿 의심)
- 특정 제품/서비스를 과도하게 홍보하는 댓글

## 산출물 품질 기준

- [ ] 최소 2개 이상 플랫폼에서 수집

- [ ] 긍정/부정/중립 비율이 구체적 근거와 함께 제시됨

- [ ] 대표적 인용문 3개 이상 포함

- [ ] 다수 의견과 소수 의견이 구분됨

- [ ] 플랫폼별 편향 특성이 명시됨

- [ ] 조작 가능성/표본 한계가 기록됨