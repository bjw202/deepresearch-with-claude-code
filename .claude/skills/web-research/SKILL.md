---

## name: web-research description: "웹 검색 기반 리서치 방법론. researcher.md의 web 모드에서 참조하는 검색 전략 스킬."

# Web Research — 웹 검색 리서치 방법론

researcher.md 에이전트가 `web` 모드로 지정되었을 때 이 스킬을 Read하여 참조한다.

## Step 1: 검색 전략 수립

1. 주제에서 핵심 키워드 3\~5개를 추출한다
2. 키워드를 한국어와 영어로 준비한다
3. 동의어, 약어, 관련 용어로 키워드를 확장한다
4. 시간 범위를 설정한다 (최신 이슈: 1개월, 일반 주제: 1년, 역사적 맥락: 전체)

## Step 2: 4계층 앙상블 검색

### Layer 0: WebSearch (빌트인, 우선 사용)

**1차 — 공식 채널:**

```
WebSearch(query: "주제 공식 발표 2026")
WebSearch(query: "주제", allowed_domains: ["공식사이트.com", "정부기관.go.kr"])
```

**2차 — 신뢰 미디어:**

```
WebSearch(query: "주제 기술 동향")
WebSearch(query: "topic trend analysis", allowed_domains: ["techcrunch.com", "reuters.com", "theverge.com"])
```

**URL 내용 확인:**

```
WebFetch(url: "https://기사URL", prompt: "핵심 내용과 수치를 요약하라")
```

### Layer 1: Perplexity + Tavily (Layer 0 부족 시)

```bash
./scripts/search.sh perplexity search "주제 최신 동향"
./scripts/search.sh tavily search "주제 키워드" --depth advanced --days {시간범위}
```

### Layer 2: 원문 확보

```
WebFetch(url: "기사/보고서URL", prompt: "핵심 수치와 데이터를 추출하라")
```

WebFetch가 불충분하면:

```bash
./scripts/search.sh tavily extract "url1,url2"
```

### Layer 3: 심층 탐구 (필요 시만)

```bash
./scripts/search.sh tavily research "주제 심층 분석"
./scripts/search.sh perplexity research "주제 comprehensive analysis"
```

## Step 3: 출처 신뢰도 평가

| 등급 | 기준 | 예시 |
| --- | --- | --- |
| **official** | 당사자가 직접 발표 | 보도자료, 공식 블로그, 법률 문서 |
| **reliable** | 검증된 제3자 보도 | 주요 언론, 전문 미디어, 전문가 분석 |
| **unverified** | 검증되지 않은 정보 | 익명 소스, 루머, 단일 소스 보도 |

## Step 4: 정보 분류

- **Fact**: 복수 출처에서 확인된 객관적 정보
- **Claim**: 특정 출처의 의견이나 해석
- **Unverified**: 단일 출처이거나 상충하는 정보

## Step 5: 상충 정보 처리

- 상충 정보를 발견하면 **절대 삭제하지 않는다**
- 양쪽 출처를 병기하고, 각각의 신뢰도를 표시한다
- 상충 이유를 추론하여 기록한다 (시점 차이, 관점 차이, 오보 가능성 등)

## 검색 팁

- 따옴표로 정확한 구문 검색: `"exact phrase"`
- 사이트 한정: `allowed_domains` 또는 쿼리에 `site:` 포함
- 다국어 검색으로 편향 줄이기
- 검색 결과 부족 시 키워드를 일반화/구체화하여 재시도

## 산출물 품질 기준

- [ ] 핵심 발견 5개 이상

- [ ] 출처 신뢰도가 모든 항목에 표기됨

- [ ] 타임라인에 최소 3개 이상 시점 포함

- [ ] 미확인/상충 정보가 별도 섹션에 기록됨

- [ ] 검색 키워드와 범위 한계가 명시됨