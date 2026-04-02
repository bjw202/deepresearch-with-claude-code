---

## name: academic-research description: "학술 자료 기반 리서치 방법론. researcher.md의 academic 모드에서 참조하는 검색 전략 스킬."

# Academic Research — 학술 검색 방법론

researcher.md 에이전트가 `academic` 모드로 지정되었을 때 이 스킬을 Read하여 참조한다.

## Step 1: 학술 키워드 추출

1. 주제에서 학술 키워드를 추출한다 (일반 용어 → 학술 용어 변환)
2. **영어 키워드를 반드시 포함한다** (학술 자료 대부분이 영어)
3. 관련 분야/학제를 식별한다 (CS, 공학, 경제학, 의학 등)
4. 검색 범위를 설정한다 (최신 연구: 3년, 기초 이론: 전체)

## Step 2: 4계층 앙상블 검색

### Layer 0: WebSearch (빌트인, 우선 사용)

학술 데이터베이스를 `allowed_domains`로 타겟팅:

```
WebSearch(query: "involute gear parametric equation", allowed_domains: ["scholar.google.com", "arxiv.org", "ieee.org", "pubmed.ncbi.nlm.nih.gov", "semanticscholar.org", "dl.acm.org", "link.springer.com", "sciencedirect.com"])
```

발견된 논문/보고서의 내용 확인:

```
WebFetch(url: "https://arxiv.org/abs/...", prompt: "이 논문의 주요 주장, 방법론, 핵심 결과를 추출하라")
```

**기관 보고서도 포함**:

```
WebSearch(query: "주제 report", allowed_domains: ["mckinsey.com", "gartner.com", "oecd.org", "who.int"])
```

### Layer 1: Perplexity + Tavily (Layer 0 부족 시)

```bash
./scripts/search.sh perplexity search "academic review {학술용어} {영어}"
./scripts/search.sh tavily search "arXiv {키워드}" --depth advanced
./scripts/search.sh tavily search "IEEE {키워드} journal paper" --depth advanced
```

### Layer 2: 원문 확보

```
WebFetch(url: "논문URL", prompt: "핵심 수치, 실험 조건, 한계를 추출하라")
```

WebFetch가 불충분하면:

```bash
./scripts/search.sh tavily extract "논문URL1,논문URL2"
```

### Layer 3: 심층 탐구 (선행 연구 부족 영역)

```bash
./scripts/search.sh perplexity reason "{학술 질문} state of the art comparison"
```

## Step 3: 자료 신뢰도 평가

| 등급 | 기준 | 예시 |
| --- | --- | --- |
| **Tier 1** | 피어리뷰 저널, 주요 학회 | Nature, Science, ACM/IEEE 컨퍼런스, ASME 저널 |
| **Tier 2** | 프리프린트, 기관 보고서, 컨퍼런스 | arXiv, NBER working papers, 석/박사 논문 |
| **Tier 3** | 백서, 기술 블로그, 포럼 | 기업 백서, 전문가 블로그, Eng-Tips |

## Step 4: 논문 분석 프레임워크

각 핵심 논문에 대해 추출:

- **주요 주장/발견**: 논문의 핵심 결론
- **방법론**: 어떤 방법으로 결론에 도달했는가
- **데이터/증거**: 근거가 되는 데이터의 규모와 품질
- **한계**: 저자가 인정한 한계 + 발견한 한계
- **인용 맥락**: 다른 논문에서 어떻게 인용되는가 (긍정적/비판적)

## Step 5: 합의 수준 판단

| 수준 | 기준 |
| --- | --- |
| **강한 합의** | 복수 피어리뷰 연구가 동일 결론, 메타분석 존재 |
| **약한 합의** | 대체로 동의하나 세부 사항에서 이견 |
| **논쟁 중** | 주요 연구 간 결론이 상충 |
| **미탐구** | 관련 연구가 거의 없음 |

## Step 6: 찬반 균형 분석

의견이 갈리는 주제에서는:

- 각 관점의 핵심 논거와 증거
- 각 관점의 한계와 비판
- 양측이 동의하는 공통 기반

## 산출물 품질 기준

- [ ] Tier 1\~2 출처가 전체의 60% 이상

- [ ] 핵심 논문 3편 이상에 대한 상세 분석

- [ ] 찬반/장단점이 균형 있게 기술됨

- [ ] 학술적 합의 수준이 명시됨

- [ ] 연구 갭/향후 과제가 1개 이상 식별됨

- [ ] 모든 주장에 인용 가능한 출처 첨부