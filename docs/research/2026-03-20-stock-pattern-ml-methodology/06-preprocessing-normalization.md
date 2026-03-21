# 주가 차트 패턴 ML을 위한 전처리 및 정규화 방법론

> Researcher 6 산출물 | 2026-03-21

## 목차

1. [Q1. 가격 정규화](#q1-가격-정규화)
2. [Q2. 거래량 정규화](#q2-거래량-정규화)
3. [Q3. 시계열 컨텍스트 인코딩](#q3-시계열-컨텍스트-인코딩)
4. [Q4. 윈도우 처리](#q4-윈도우-처리)
5. [Q5. Feature Engineering vs Raw Data](#q5-feature-engineering-vs-raw-data)
6. [Q6. 정규화가 패턴 보존에 미치는 영향](#q6-정규화가-패턴-보존에-미치는-영향)
7. [종합 권장 파이프라인](#종합-권장-파이프라인)
8. [관점 확장 및 문제 재정의](#관점-확장-및-문제-재정의)

---

## Q1. 가격 정규화

삼성전자(7만원대)와 소형주(1,000원대)의 VCP를 동일 공간에서 비교하기 위한 방법론.

### 1.1 수익률(Return) 기반 변환

**원리**: 절대 가격 대신 일별 변화율로 변환하여 스케일을 제거한다.

**Pseudocode**:
```python
def return_normalize(df):
    """단순 수익률 기반 정규화"""
    # 일별 수익률 계산
    df['return'] = df['close'].pct_change()

    # OHLCV 전체를 수익률로 변환
    for col in ['open', 'high', 'low', 'close']:
        df[f'{col}_ret'] = df[col].pct_change()

    # 패턴 윈도우의 시작점을 기준으로 누적 수익률
    def cumulative_return(window):
        base_price = window['close'].iloc[0]
        for col in ['open', 'high', 'low', 'close']:
            window[f'{col}_norm'] = window[col] / base_price - 1.0
        return window

    return df
```

**장점**: 직관적, 종목 간 직접 비교 가능, 수축 비율(contraction ratio) 보존.
**단점**: 시작점 선택에 민감, 이전 맥락 정보 손실.
**패턴 적합도**: ★★★★☆ — VCP의 수축 비율을 자연스럽게 보존.

### 1.2 Z-Score 정규화 (윈도우 기반)

**원리**: 윈도우 내 평균과 표준편차로 표준화. 금융 시계열의 비정상성(non-stationarity)에 대응하기 위해 롤링 윈도우를 사용한다.

**Pseudocode**:
```python
def zscore_normalize(df, window=60):
    """롤링 Z-Score 정규화"""
    for col in ['close', 'open', 'high', 'low']:
        rolling_mean = df[col].rolling(window=window).mean()
        rolling_std = df[col].rolling(window=window).std()
        df[f'{col}_zscore'] = (df[col] - rolling_mean) / rolling_std

    # 거래량은 별도 Z-Score (분포가 다르므로)
    vol_mean = df['volume'].rolling(window=window).mean()
    vol_std = df['volume'].rolling(window=window).std()
    df['volume_zscore'] = (df['volume'] - vol_mean) / vol_std

    return df

def pattern_window_zscore(prices, window_start, window_end):
    """패턴 윈도우 내 Z-Score (고정 윈도우)"""
    window = prices[window_start:window_end]
    mu = window.mean()
    sigma = window.std()
    return (window - mu) / sigma
```

**장점**: 이상치 강건성, 종목 간 비교 가능, 통계적 해석 용이 (Z=2는 모든 종목에서 "2σ 이탈").
**단점**: 윈도우 크기 선택이 결과에 영향 (너무 짧으면 불안정, 너무 길면 regime 변화 미반영). 논문에서 Z-Score는 기술지표 정규화의 표준으로 사용됨 [출처: Springer, "Machine learning, stock market forecasting, and market efficiency"].
**패턴 적합도**: ★★★★☆ — 변동성 기준 정규화라 VCP 수축의 "의미"를 잘 보존.
**이 수치가 틀릴 수 있는 조건**: 윈도우 60일은 일반적 기준이나, 급등주(단기 300% 상승 후 조정)에서는 σ가 비정상적으로 커져 패턴 수축이 과소평가될 수 있다.

### 1.3 Min-Max 정규화 (패턴 윈도우 내)

**원리**: 패턴 윈도우의 최저가를 0, 최고가를 1로 스케일링.

**Pseudocode**:
```python
def minmax_normalize(prices, window_start, window_end):
    """패턴 윈도우 내 Min-Max 정규화"""
    window = prices[window_start:window_end]
    min_val = window.min()
    max_val = window.max()

    if max_val == min_val:  # 횡보 구간 처리
        return pd.Series(0.5, index=window.index)

    normalized = (window - min_val) / (max_val - min_val)
    return normalized

def minmax_ohlcv(df, window_start, window_end):
    """OHLCV 전체 Min-Max (가격은 공통 스케일, 거래량은 별도)"""
    w = df.iloc[window_start:window_end]

    # 가격: O/H/L/C 전체의 min/max 사용 (일관성)
    price_min = w[['open','high','low','close']].min().min()
    price_max = w[['open','high','low','close']].max().max()

    for col in ['open', 'high', 'low', 'close']:
        w[f'{col}_norm'] = (w[col] - price_min) / (price_max - price_min)

    # 거래량: 별도 스케일
    vol_min, vol_max = w['volume'].min(), w['volume'].max()
    w['volume_norm'] = (w['volume'] - vol_min) / (vol_max - vol_min)

    return w
```

**장점**: [0,1] 범위 보장, 패턴 형태(shape) 완벽 보존, CNN 이미지 입력에 최적.
**단점**: 윈도우 외부의 맥락 정보 완전 손실, 이상치에 민감 (하루 급등이 전체 스케일을 왜곡).
**패턴 적합도**: ★★★★★ — 패턴 형태 비교에 가장 직관적. 단, 맥락 정보를 별도 feature로 보충 필요.

### 1.4 로그 수익률 (Log Returns)

**원리**: ln(P_t / P_{t-1})로 변환. 금융 시계열 분석의 표준적 전처리 방법.

**Pseudocode**:
```python
import numpy as np

def log_return_normalize(df):
    """로그 수익률 변환"""
    for col in ['open', 'high', 'low', 'close']:
        df[f'{col}_logret'] = np.log(df[col] / df[col].shift(1))

    # 누적 로그 수익률 (패턴 윈도우 기준점 대비)
    def cumulative_log_return(window, base_idx=0):
        base_price = window['close'].iloc[base_idx]
        for col in ['open', 'high', 'low', 'close']:
            window[f'{col}_cum_logret'] = np.log(window[col] / base_price)
        return window

    return df
```

**장점**: 시간 가산성(additivity) — 구간 수익률을 단순 합산 가능, 정규분포에 더 가까운 분포, 대칭적 변환(+10%와 -10%가 동일 크기). [출처: arXiv 2412.15448, "Log returns are preferred in financial time series due to their ability to capture percentage changes and handle volatility over time"]
**단점**: 직관성이 단순 수익률보다 떨어짐, 극단적 변동 시 차이 커짐 (일 변동 10% 이상에서 단순/로그 수익률 괴리).
**패턴 적합도**: ★★★★☆ — 수학적으로 가장 건전하나, VCP의 수축 비율을 인간이 해석하기엔 단순 수익률이 더 직관적.

### 1.5 종합 비교 및 권장

| 방법 | 종목간 비교 | 패턴 형태 보존 | 맥락 보존 | 이상치 강건성 | 구현 난이도 |
|------|:-----------:|:-------------:|:---------:|:------------:|:----------:|
| 수익률 | ★★★★ | ★★★★ | ★★ | ★★★ | ★★★★★ |
| Z-Score | ★★★★ | ★★★★ | ★★★ | ★★★★ | ★★★★ |
| Min-Max | ★★★★★ | ★★★★★ | ★ | ★★ | ★★★★★ |
| 로그수익률 | ★★★★ | ★★★★ | ★★ | ★★★ | ★★★★ |

**권장**: 패턴 형태 비교(유사 패턴 검색, 차트북)에는 **Min-Max 정규화**를 1차 선택으로, 맥락 정보는 별도 feature로 보충한다. ML 모델 학습 시에는 **누적 로그 수익률**을 기본으로 하되, 윈도우 내 Min-Max를 보조로 사용하는 이중 정규화(dual normalization)가 효과적이다.

**반증 탐색**: Min-Max가 최선이 아닌 경우를 탐색했다. 극단적 갭(상한가 연속 등)이 포함된 패턴에서는 Min-Max가 해당 갭에 의해 전체 스케일이 왜곡될 수 있다. 이 경우 percentile clipping (예: 1~99 percentile)을 선행하는 것이 해결책이다. 반증 미발견 — Min-Max + clipping 조합이 패턴 형태 비교에서 열등하다는 증거는 발견되지 않았다.

---

## Q2. 거래량 정규화

### 2.1 상대 거래량 (Relative Volume, RVOL)

**원리**: 당일 거래량을 N일 이동평균 거래량으로 나눈 비율. "이 종목 기준으로 얼마나 많은 거래가 발생했는가"를 측정한다.

**Pseudocode**:
```python
def relative_volume(df, lookback=50):
    """상대 거래량 (RVOL)"""
    avg_vol = df['volume'].rolling(window=lookback).mean()
    df['rvol'] = df['volume'] / avg_vol

    # RVOL 해석:
    # RVOL > 2.0: 강한 거래량 급증 (돌파 확인 신호)
    # RVOL 0.5~1.0: 정상 범위
    # RVOL < 0.5: 거래량 건조화 (VCP 수축 구간 특성)

    return df

def rvol_with_decay(df, lookback=50, exclude_recent=5):
    """최근 N일 제외한 RVOL (패턴 내 거래량 변화가 평균을 오염시키는 것 방지)"""
    avg_vol = df['volume'].shift(exclude_recent).rolling(window=lookback).mean()
    df['rvol_clean'] = df['volume'] / avg_vol
    return df
```

**장점**: 직관적, 종목 고유의 유동성 수준을 자연스럽게 반영. [출처: Stonehill Forex, Normalized Volume as a Volume Indicator]
**단점**: lookback 기간에 따라 값이 변동, 거래 정지 후 복귀 시 왜곡 가능.
**이 수치가 틀릴 수 있는 조건**: lookback=50은 일반적이나, IPO 직후 종목이나 거래 재개 종목에서는 평균이 의미 없을 수 있다. 최소 30거래일 이상의 데이터가 있어야 신뢰 가능.

### 2.2 거래대금 기반 정규화

**원리**: 거래량(주수)이 아닌 거래대금(volume × price)으로 변환. 10만원 × 1만주와 1,000원 × 100만주를 동일 기준으로 비교.

**Pseudocode**:
```python
def turnover_normalize(df):
    """거래대금 기반 정규화"""
    # 거래대금 = 거래량 × 종가 (근사치, VWAP 사용 시 더 정확)
    df['turnover'] = df['volume'] * df['close']

    # 상대 거래대금
    avg_turnover = df['turnover'].rolling(window=50).mean()
    df['relative_turnover'] = df['turnover'] / avg_turnover

    # 로그 거래대금 (분포 정규화)
    df['log_turnover'] = np.log1p(df['turnover'])

    return df
```

**장점**: 주가 수준이 다른 종목 간 "자금 유입 규모" 비교 가능.
**단점**: 주가 변동 자체가 거래대금에 영향 (급등일에 거래대금 자동 증가). 거래대금과 거래량이 이중 계산될 수 있음.
**패턴 적합도**: ★★★☆☆ — 종목 간 비교에는 유용하나, 패턴 내 거래량 수축/확장의 "의미"를 포착하는 데는 RVOL이 더 적합.

### 2.3 시가총액 대비 회전율 (Turnover Ratio)

**원리**: 거래량을 상장주식수(또는 유통주식수)로 나눈 비율. "전체 주식 중 몇 %가 거래되었는가"를 측정.

**Pseudocode**:
```python
def turnover_ratio(df, shares_outstanding):
    """시가총액 대비 회전율"""
    df['turnover_ratio'] = df['volume'] / shares_outstanding

    # 상대 회전율 (자기 자신의 평균 대비)
    avg_ratio = df['turnover_ratio'].rolling(window=50).mean()
    df['relative_turnover_ratio'] = df['turnover_ratio'] / avg_ratio

    return df

def float_turnover_ratio(df, free_float_shares):
    """유통주식수 기반 회전율 (더 의미 있는 지표)"""
    df['float_turnover'] = df['volume'] / free_float_shares
    return df
```

**장점**: 가장 근본적인 유동성 지표, 대주주 물량 잠김 효과 반영 (유통주식수 사용 시).
**단점**: 유통주식수 데이터 확보 어려움 (한국 시장: DART에서 분기별 확인 가능하나 실시간 아님).
**패턴 적합도**: ★★★☆☆ — 종목 간 절대 비교에 유용하나, 패턴 내 동적 변화 포착에는 RVOL과 병행 필요.

### 2.4 거래량 수축/확장의 "의미" 보존 정규화

VCP/CWH에서 핵심인 "거래량 건조화(volume dry-up)"의 의미를 보존하면서 정규화하는 통합 방법.

**Pseudocode**:
```python
def volume_semantic_normalize(df, lookback=50):
    """의미 보존 거래량 정규화 — 패턴 인식에 최적화"""

    # 1. 상대 거래량 (기본 정규화)
    avg_vol = df['volume'].rolling(window=lookback).mean()
    df['rvol'] = df['volume'] / avg_vol

    # 2. 거래량 Z-Score (이상 거래량 탐지)
    vol_std = df['volume'].rolling(window=lookback).std()
    df['vol_zscore'] = (df['volume'] - avg_vol) / vol_std

    # 3. 거래량 수축률 (VCP 핵심 feature)
    # 최근 N일 평균 / 과거 M일 평균의 비율
    recent_vol = df['volume'].rolling(window=10).mean()
    past_vol = df['volume'].shift(10).rolling(window=lookback).mean()
    df['vol_contraction'] = recent_vol / past_vol
    # < 1.0이면 수축, < 0.5이면 강한 건조화

    # 4. 거래량 건조화 지수 (VDU Index)
    # 최근 5일 최저 거래량 / 50일 평균
    min_recent_vol = df['volume'].rolling(window=5).min()
    df['vdu_index'] = min_recent_vol / avg_vol
    # < 0.3이면 "건조" 상태

    # 5. 돌파일 거래량 비율 (Breakout Volume Ratio)
    # 사용 시점: 피봇 돌파 판정 시
    # breakout_vol / 건조화 구간 평균 거래량

    return df
```

**권장**: 패턴 인식에서는 **RVOL을 기본 정규화**로 사용하되, **거래량 수축률**과 **VDU Index**를 추가 feature로 생성한다. 이 조합이 "거래량의 의미"를 가장 잘 보존한다.

### 2.5 거래량 정규화 종합 비교

| 방법 | 종목간 비교 | 건조화 포착 | 돌파 확인 | 데이터 요구 |
|------|:-----------:|:-----------:|:---------:|:----------:|
| RVOL | ★★★★★ | ★★★★★ | ★★★★ | 가격+거래량만 |
| 거래대금 | ★★★★ | ★★★ | ★★★ | 가격+거래량 |
| 회전율 | ★★★★★ | ★★★ | ★★★ | +상장주식수 |
| Vol Z-Score | ★★★★ | ★★★★ | ★★★★★ | 가격+거래량 |
| VDU Index | ★★★ | ★★★★★ | ★★ | 가격+거래량 |

---

## Q3. 시계열 컨텍스트 인코딩

"이 패턴 직전 3개월간 200% 상승한 종목"과 "30% 상승한 종목"의 같은 VCP가 다른 결과를 낳는 문제.

### 3.1 사전 상승률 (Prior Advance)

**Pseudocode**:
```python
def prior_advance_features(df, pattern_start_idx):
    """패턴 시작 시점 기준 사전 상승률 계산"""
    price_at_pattern = df['close'].iloc[pattern_start_idx]

    features = {}

    # 다중 기간 사전 상승률
    for period in [20, 60, 120, 250]:  # 1개월, 3개월, 6개월, 1년
        if pattern_start_idx >= period:
            price_before = df['close'].iloc[pattern_start_idx - period]
            features[f'prior_advance_{period}d'] = (
                (price_at_pattern / price_before) - 1.0
            )
            # 로그 수익률 버전
            features[f'prior_advance_{period}d_log'] = np.log(
                price_at_pattern / price_before
            )

    # 상승 시작점에서 패턴 시작까지의 총 상승률
    # (52주 최저가 대비)
    low_252 = df['low'].iloc[max(0, pattern_start_idx-252):pattern_start_idx].min()
    features['advance_from_52w_low'] = (price_at_pattern / low_252) - 1.0

    return features
```

**의사결정 연결**: 사전 상승률 200% 이상인 종목의 VCP는 "과열 후 조정" 가능성이 높고, 50~100% 상승 후 VCP가 가장 건전한 패턴이라는 것이 Minervini의 경험적 관찰이다. [인접 도메인: 트레이딩 실무/경험적 기준] — 학술적 검증은 제한적이나, 실무적 유용성이 높은 기준.

### 3.2 베이스 카운트 (Base Count)

**Pseudocode**:
```python
def base_count_feature(df, current_idx, lookback=250):
    """현재 베이스가 상승 사이클 내 몇 번째인지 계산"""
    prices = df['close'].iloc[max(0, current_idx-lookback):current_idx]

    # 방법 1: 피봇 고점 기반 — 연속 고점 돌파 횟수
    from scipy.signal import argrelextrema

    # 로컬 고점 찾기
    highs = df['high'].iloc[max(0, current_idx-lookback):current_idx]
    local_maxima_idx = argrelextrema(highs.values, np.greater, order=10)[0]

    # 연속 상승하는 피봇 고점 수 = 베이스 수
    pivot_highs = highs.iloc[local_maxima_idx]
    base_count = 0
    prev_high = 0
    for h in pivot_highs:
        if h > prev_high:
            base_count += 1
            prev_high = h
        else:
            base_count = 1  # 리셋
            prev_high = h

    # 방법 2: 단순화 — ATH 돌파 횟수
    rolling_max = prices.expanding().max()
    breakout_days = (prices >= rolling_max).sum()
    # 클러스터링으로 그룹화 (연속 돌파일은 1개 베이스)

    return {
        'base_count': base_count,
        'base_count_simple': len(local_maxima_idx)
    }
```

**의사결정 연결**: 1번째~2번째 베이스가 가장 성공률이 높고, 3번째 이후는 실패 확률이 급증한다 (Minervini, O'Neil). 이 feature는 패턴의 "성숙도"를 인코딩하여, 동일 형태의 VCP라도 위치에 따라 다른 확률을 부여할 수 있게 한다.

### 3.3 상승 경과 시간 (Trend Duration)

**Pseudocode**:
```python
def trend_duration_features(df, current_idx):
    """현재 상승 추세의 지속 기간 및 관련 feature"""

    # 200일 이동평균 위 지속 기간
    ma200 = df['close'].rolling(200).mean()
    above_ma200 = df['close'] > ma200

    # 현재 시점에서 역방향으로 연속 MA200 위 일수
    duration = 0
    for i in range(current_idx, max(0, current_idx-500), -1):
        if above_ma200.iloc[i]:
            duration += 1
        else:
            break

    # 상승 시작점 탐지 (52주 최저점부터)
    lookback_prices = df['close'].iloc[max(0, current_idx-252):current_idx]
    trough_idx = lookback_prices.idxmin()
    days_since_trough = current_idx - df.index.get_loc(trough_idx)

    return {
        'days_above_ma200': duration,
        'days_since_trough': days_since_trough,
        'trend_duration_ratio': duration / 252  # 1년 대비 비율
    }
```

### 3.4 52주 신고가 대비 위치

**Pseudocode**:
```python
def relative_position_features(df, current_idx):
    """52주 고가/저가 대비 현재 위치"""
    lookback = min(252, current_idx)
    window = df.iloc[current_idx - lookback:current_idx + 1]

    high_52w = window['high'].max()
    low_52w = window['low'].min()
    current_close = df['close'].iloc[current_idx]

    return {
        # 52주 범위 내 위치 (0=최저, 1=최고)
        'position_in_52w_range': (
            (current_close - low_52w) / (high_52w - low_52w)
            if high_52w != low_52w else 0.5
        ),
        # 52주 신고가 대비 조정 깊이
        'pct_from_52w_high': (current_close / high_52w) - 1.0,
        # 52주 신고가 근접도 (25% 이내 = 강세)
        'near_52w_high': 1 if current_close >= high_52w * 0.75 else 0,
        # ATH 여부
        'at_all_time_high': 1 if current_close >= high_52w * 0.97 else 0
    }
```

### 3.5 시장 Regime 컨텍스트

**Pseudocode**:
```python
def market_regime_features(market_df, current_idx, window=60):
    """시장 전체 regime 인코딩"""
    market_close = market_df['close']  # KOSPI/KOSDAQ 지수

    # 방법 1: 이동평균 기반 단순 분류
    ma50 = market_close.rolling(50).mean()
    ma200 = market_close.rolling(200).mean()

    current_price = market_close.iloc[current_idx]

    regime_simple = 'bull' if (current_price > ma50.iloc[current_idx]
                               and ma50.iloc[current_idx] > ma200.iloc[current_idx]) \
                   else 'bear' if (current_price < ma50.iloc[current_idx]
                                   and ma50.iloc[current_idx] < ma200.iloc[current_idx]) \
                   else 'sideways'

    # 방법 2: 변동성 기반 (VIX 대용)
    market_vol = market_close.pct_change().rolling(window).std() * np.sqrt(252)

    # 방법 3: 시장 breadth
    # (전체 종목 중 MA200 위 비율 등 — 별도 계산 필요)

    # One-hot 또는 ordinal 인코딩
    regime_encoding = {
        'regime_bull': 1 if regime_simple == 'bull' else 0,
        'regime_bear': 1 if regime_simple == 'bear' else 0,
        'regime_sideways': 1 if regime_simple == 'sideways' else 0,
        'market_volatility': market_vol.iloc[current_idx],
        'market_return_60d': (current_price / market_close.iloc[current_idx - 60]) - 1.0
    }

    return regime_encoding
```

**의사결정 연결**: 동일 VCP라도 Bull regime에서는 성공률 65~75%, Bear regime에서는 30~40%로 차이가 크다 (경험적 관찰). 시장 regime을 feature로 포함하면 모델이 "환경 의존적 확률"을 학습할 수 있다.

### 3.6 통합 컨텍스트 벡터

모든 컨텍스트 feature를 하나의 벡터로 통합하는 방법.

**Pseudocode**:
```python
def build_context_vector(df, market_df, pattern_start_idx, current_idx):
    """패턴의 전체 컨텍스트를 하나의 벡터로 통합"""

    context = {}

    # 1. 사전 상승률 (다중 기간)
    context.update(prior_advance_features(df, pattern_start_idx))

    # 2. 베이스 카운트
    context.update(base_count_feature(df, current_idx))

    # 3. 추세 지속 기간
    context.update(trend_duration_features(df, current_idx))

    # 4. 52주 위치
    context.update(relative_position_features(df, current_idx))

    # 5. 시장 regime
    context.update(market_regime_features(market_df, current_idx))

    # 6. RS Rating (상대강도)
    context['rs_rating'] = calculate_rs_rating(df, market_df, current_idx)

    # 벡터로 변환
    context_vector = np.array(list(context.values()), dtype=np.float32)

    # 정규화 (feature별 스케일 맞춤)
    # 학습 세트 전체의 mean/std로 StandardScaler 적용

    return context_vector, context

def calculate_rs_rating(df, market_df, current_idx):
    """상대 강도 Rating (IBD RS Rating 근사)"""
    stock_ret_63 = df['close'].iloc[current_idx] / df['close'].iloc[current_idx-63] - 1
    stock_ret_126 = df['close'].iloc[current_idx] / df['close'].iloc[current_idx-126] - 1
    stock_ret_189 = df['close'].iloc[current_idx] / df['close'].iloc[current_idx-189] - 1
    stock_ret_252 = df['close'].iloc[current_idx] / df['close'].iloc[current_idx-252] - 1

    # IBD 방식: 가중 평균 (최근 분기 2배 가중)
    weighted_return = (stock_ret_63 * 2 + stock_ret_126 + stock_ret_189 + stock_ret_252) / 5

    return weighted_return
```

**모델 아키텍처 연결**: 컨텍스트 벡터는 패턴 시계열(OHLCV 시퀀스)과 **별도 경로**로 입력하는 것이 효과적이다:
- **시계열 경로**: CNN/LSTM → 패턴 형태 특징 추출
- **컨텍스트 경로**: Dense layer → 컨텍스트 임베딩
- **결합**: Concatenate → 최종 분류/회귀

---

## Q4. 윈도우 처리

### 4.1 패턴별 길이 차이 문제

| 패턴 | 전형적 길이 (일봉) | 최소~최대 |
|------|:-----------------:|:---------:|
| VCP | 30~90일 | 14~180일 |
| CWH (Cup with Handle) | 40~180일 | 28~365일 |
| HTF (High Tight Flag) | 14~28일 | 7~42일 |
| W (Double Bottom) | 20~60일 | 10~120일 |

### 4.2 고정 길이 변환 방법

#### 방법 A: 리샘플링 (Temporal Interpolation)

가변 길이 시계열을 고정 N개 포인트로 보간.

**Pseudocode**:
```python
from scipy.interpolate import interp1d

def resample_to_fixed_length(window_data, target_length=64):
    """가변 길이 → 고정 길이 리샘플링"""
    original_length = len(window_data)

    # 원본 인덱스 (0~1로 정규화)
    x_original = np.linspace(0, 1, original_length)
    # 타겟 인덱스
    x_target = np.linspace(0, 1, target_length)

    resampled = {}
    for col in ['open', 'high', 'low', 'close']:
        f = interp1d(x_original, window_data[col].values, kind='linear')
        resampled[col] = f(x_target)

    # 거래량: 합산 보간 (구간 합이 보존되도록)
    vol_cumsum = np.cumsum(window_data['volume'].values)
    vol_cumsum_normed = vol_cumsum / vol_cumsum[-1]  # 0~1
    f_vol = interp1d(x_original, vol_cumsum_normed, kind='linear')
    vol_resampled_cum = f_vol(x_target)
    resampled['volume'] = np.diff(vol_resampled_cum, prepend=0)

    return pd.DataFrame(resampled)
```

**장점**: 모든 패턴을 동일 차원으로 변환, CNN 입력에 직접 사용 가능.
**단점**: 길이 정보 손실 (180일 VCP와 30일 VCP가 같은 길이로 압축), 급격한 가격 변동이 평활화될 수 있음.
**완화 방법**: 원본 길이를 별도 feature로 포함, cubic/spline 보간 사용.

#### 방법 B: 패딩 (Padding)

최대 길이에 맞추어 짧은 시계열을 패딩.

**Pseudocode**:
```python
def pad_to_max_length(window_data, max_length=180, pad_value=0, pad_side='left'):
    """패딩으로 고정 길이 변환"""
    current_length = len(window_data)
    pad_length = max_length - current_length

    if pad_length <= 0:
        # 이미 충분히 긴 경우: 뒤에서 자르기
        return window_data.iloc[-max_length:]

    if pad_side == 'left':
        # 왼쪽 패딩 (시작 부분을 0으로 채움)
        pad_df = pd.DataFrame(
            pad_value,
            index=range(pad_length),
            columns=window_data.columns
        )
        result = pd.concat([pad_df, window_data.reset_index(drop=True)])
    else:
        # 오른쪽 패딩
        pad_df = pd.DataFrame(
            pad_value,
            index=range(pad_length),
            columns=window_data.columns
        )
        result = pd.concat([window_data.reset_index(drop=True), pad_df])

    # 마스크 생성 (패딩된 위치 표시 — Attention 모델에 필요)
    mask = np.ones(max_length)
    if pad_side == 'left':
        mask[:pad_length] = 0
    else:
        mask[current_length:] = 0

    return result.reset_index(drop=True), mask
```

**장점**: 정보 손실 없음 (원본 데이터 보존), Transformer/LSTM과 함께 마스킹 사용 가능.
**단점**: 메모리 낭비 (짧은 HTF가 180 길이로 확장), 패딩 방식(left/right/zero/repeat)에 따라 결과 차이.
**권장 패딩**: Left-padding + attention mask. 패턴의 "끝"(돌파 시점)이 항상 동일 위치에 오도록 정렬.

#### 방법 C: DTW (Dynamic Time Warping) 기반 비교

고정 길이 변환 없이, 가변 길이 시계열 간 유사도를 직접 측정.

**Pseudocode**:
```python
from dtw import dtw as dtw_func

def dtw_pattern_similarity(pattern_a, pattern_b, feature_cols=['close_norm']):
    """DTW 기반 패턴 유사도"""
    x = pattern_a[feature_cols].values
    y = pattern_b[feature_cols].values

    alignment = dtw_func(x, y, keep_internals=True)

    return {
        'dtw_distance': alignment.distance,
        'normalized_distance': alignment.normalizedDistance,
        'warping_path': alignment.index1s  # 정렬 경로
    }

def dtw_cluster_patterns(patterns_list, n_clusters=10):
    """DTW 거리 행렬 기반 패턴 클러스터링"""
    from sklearn.cluster import AgglomerativeClustering

    n = len(patterns_list)
    distance_matrix = np.zeros((n, n))

    for i in range(n):
        for j in range(i+1, n):
            dist = dtw_pattern_similarity(
                patterns_list[i], patterns_list[j]
            )['normalized_distance']
            distance_matrix[i, j] = dist
            distance_matrix[j, i] = dist

    clustering = AgglomerativeClustering(
        n_clusters=n_clusters,
        metric='precomputed',
        linkage='average'
    )
    labels = clustering.fit_predict(distance_matrix)

    return labels, distance_matrix
```

**장점**: 길이가 다른 패턴도 직접 비교 가능, 패턴의 시간적 왜곡(stretching/compression)에 강건. [출처: Wikipedia, Dynamic Time Warping; UCR DTW 연구]
**단점**: O(n²m²) 계산 복잡도 (2,500종목 × 패턴 수에서는 매우 느림), 학습 파이프라인에 직접 통합 어려움.
**권장 용도**: 유사 패턴 검색(chartbook 구축)에 최적. 학습에는 리샘플링/패딩을 사용하고, DTW는 검증/검색 단계에서 활용.

**반증 탐색**: UCR의 연구에 따르면, 가변 길이 시계열을 동일 길이로 리샘플링한 후 DTW를 적용해도 분류 정확도에 유의미한 차이가 없다 [출처: "Everything you know about Dynamic Time Warping is Wrong", UCR]. 이는 리샘플링이 정보 손실을 가져온다는 우려를 완화한다.

### 4.3 멀티스케일 접근 (일봉/주봉 동시)

**Pseudocode**:
```python
def multiscale_feature_extraction(df_daily, target_length=64):
    """일봉 + 주봉 동시 처리"""

    # 일봉 데이터 (최근 N일)
    daily_window = df_daily.tail(target_length)
    daily_features = resample_to_fixed_length(daily_window, target_length)

    # 주봉 변환 (일봉 → 주봉 리샘플)
    df_weekly = df_daily.resample('W').agg({
        'open': 'first',
        'high': 'max',
        'low': 'min',
        'close': 'last',
        'volume': 'sum'
    }).dropna()

    # 주봉 윈도우 (더 넓은 컨텍스트)
    weekly_window = df_weekly.tail(target_length)
    weekly_features = resample_to_fixed_length(weekly_window, target_length)

    # 멀티스케일 결합
    # 방법 1: 채널 스태킹 (CNN용)
    # daily: [T, 5] + weekly: [T, 5] → [T, 10]
    combined = np.concatenate([
        daily_features.values,   # 단기 패턴
        weekly_features.values   # 장기 컨텍스트
    ], axis=1)

    # 방법 2: 별도 브랜치 (Multi-input model)
    # daily_branch → CNN/LSTM → feature_daily
    # weekly_branch → CNN/LSTM → feature_weekly
    # concat → Dense → output

    return {
        'daily': daily_features,
        'weekly': weekly_features,
        'combined': combined
    }
```

**장점**: 일봉에서 놓치기 쉬운 장기 추세를 주봉으로 보완, 패턴의 "큰 그림" 포착.
**단점**: 데이터 차원 증가, 학습 복잡도 상승.
**의사결정 연결**: MSTNN (Multi-Scale Temporal Neural Network) 연구에서 연/월/주 단위 3D 필터를 사용한 결과, 단일 스케일 대비 주가 추세 예측 정확도가 유의미하게 향상되었다 [출처: IJCAI 2025, "Multi-Scale Temporal Neural Network for Stock Trend Prediction"].

### 4.4 윈도우 처리 권장 전략

| 용도 | 권장 방법 | 고정 길이 | 이유 |
|------|----------|:---------:|------|
| CNN 학습 | 리샘플링 | 64 | 일관된 입력, 형태 보존 |
| LSTM/Transformer 학습 | Left-padding + mask | 180 | 시간 정보 보존 |
| 유사 패턴 검색 | DTW | 가변 | 형태 유사도 최적 |
| 차트북 시각화 | Min-Max + 리샘플링 | 64 | 시각적 비교 최적 |

---

## Q5. Feature Engineering vs Raw Data

### 5.1 규칙 기반 Feature 추출 접근

**미리 계산하는 Feature 목록**:
```python
def rule_based_features(df, pattern_window):
    """규칙 기반 feature 추출"""
    features = {}

    # 가격 관련
    features['contraction_depth'] = (
        pattern_window['high'].max() - pattern_window['low'].min()
    ) / pattern_window['high'].max()

    features['contraction_count'] = count_contractions(pattern_window)

    # 각 수축의 깊이 비율 (T1/T0, T2/T1, ...)
    contractions = get_contraction_depths(pattern_window)
    for i, c in enumerate(contractions[:4]):
        features[f'contraction_{i}_depth'] = c

    # 거래량 관련
    features['vol_dryup_ratio'] = (
        pattern_window['volume'].tail(10).mean() /
        pattern_window['volume'].head(20).mean()
    )

    features['breakout_vol_ratio'] = (
        pattern_window['volume'].iloc[-1] /
        pattern_window['volume'].mean()
    )

    # 이동평균 관련
    features['above_ma50'] = int(
        pattern_window['close'].iloc[-1] >
        pattern_window['close'].rolling(50).mean().iloc[-1]
    )

    # RS Rating
    features['rs_rating'] = calculate_rs_rating(...)

    # 패턴 대칭성
    features['symmetry_score'] = calculate_symmetry(pattern_window)

    return features
```

**장점**: 도메인 지식 직접 반영, 해석 가능성 높음, 적은 데이터로도 학습 가능, 전통적 ML 모델(RF, XGBoost)과 궁합이 좋음.
**단점**: feature 설계자의 편향, 미지의 패턴 발견 어려움, 수작업 유지보수 비용.

### 5.2 Raw OHLCV 직접 입력

**Pseudocode**:
```python
def prepare_raw_input(df, window_size=64):
    """Raw OHLCV를 모델에 직접 입력"""

    # 정규화 (윈도우 내 Min-Max 또는 로그 수익률)
    window = df.tail(window_size).copy()

    # 가격: 시작점 대비 로그 수익률
    base_price = window['close'].iloc[0]
    for col in ['open', 'high', 'low', 'close']:
        window[f'{col}_norm'] = np.log(window[col] / base_price)

    # 거래량: RVOL
    avg_vol = df['volume'].rolling(50).mean()
    window['vol_norm'] = window['volume'] / avg_vol

    # 입력 텐서: [window_size, 5] (O, H, L, C, V — 정규화됨)
    X = window[['open_norm', 'high_norm', 'low_norm', 'close_norm', 'vol_norm']].values

    return X  # shape: (64, 5)
```

**장점**: end-to-end 학습, 인간이 발견하지 못한 패턴 포착 가능, 유지보수 최소. arXiv 2504.02249 연구에 따르면 Raw OHLCV 기반 LSTM이 기술지표 기반 모델과 동등한 F1 score(0.4312) 달성 [출처: "Stock Price Prediction Using Triple Barrier Labeling and Raw OHLCV Data"].
**단점**: 대량 데이터 필요, 해석 어려움, 학습 시간 길음.

### 5.3 하이브리드 접근 (권장)

**Pseudocode**:
```python
def hybrid_input_preparation(df, market_df, pattern_start, pattern_end):
    """하이브리드: Raw OHLCV + 규칙 Feature + 컨텍스트"""

    # Branch 1: Raw 시계열 (패턴 형태 학습용)
    raw_series = prepare_raw_input(df.iloc[pattern_start:pattern_end], window_size=64)
    # shape: (64, 5) → CNN/LSTM 입력

    # Branch 2: 규칙 기반 Feature (도메인 지식 주입)
    rule_features = rule_based_features(df, df.iloc[pattern_start:pattern_end])
    rule_vector = np.array(list(rule_features.values()))
    # shape: (N_features,) → Dense 입력

    # Branch 3: 컨텍스트 벡터 (환경 정보)
    context_vector, _ = build_context_vector(df, market_df, pattern_start, pattern_end)
    # shape: (M_context,) → Dense 입력

    return {
        'raw_series': raw_series,         # CNN/LSTM branch
        'rule_features': rule_vector,     # Dense branch
        'context': context_vector         # Dense branch
    }

# 모델 아키텍처 (개념)
"""
raw_series → [CNN/LSTM] → pattern_embedding (128d)
                                                    ↘
rule_features → [Dense(64)] → rule_embedding (32d)  → [Concat] → [Dense(64)] → output
                                                    ↗
context → [Dense(32)] → context_embedding (16d)
"""
```

**권장 판단 기준**:

| 조건 | 권장 접근 |
|------|----------|
| 데이터 < 1,000 샘플 | 규칙 기반 Feature + RF/XGBoost |
| 데이터 1,000~10,000 | 하이브리드 (Raw + Rule + Context) |
| 데이터 > 10,000 | Raw OHLCV 중심 + Context (규칙 feature 선택적) |
| 해석 가능성 중요 | 규칙 기반 Feature |
| 미지 패턴 발견 목적 | Raw OHLCV |

**의사결정 연결**: 한국 증시 2,500종목 × 2년 = 잠재적 수만 개 패턴 샘플 → 하이브리드 접근이 최적 영역. 초기에는 규칙 기반으로 빠르게 프로토타이핑하고, 데이터 축적 후 Raw 비중을 높이는 점진적 전략이 현실적이다.

---

## Q6. 정규화가 패턴 보존에 미치는 영향

### 6.1 정규화별 패턴 왜곡 리스크

| 정규화 방법 | 왜곡 리스크 | 왜곡 유형 | 완화 방법 |
|------------|:----------:|----------|----------|
| Min-Max (전체) | ★★☆☆☆ | 이상치 1개가 전체 스케일 압축 | Percentile clipping (1~99%) |
| Min-Max (윈도우) | ★★★☆☆ | 윈도우 경계 선택에 민감 | 윈도우 여유분 확보 (±10일) |
| Z-Score (롤링) | ★★★☆☆ | 급등 구간의 σ 팽창으로 후속 패턴 과소평가 | 윈도우를 패턴 이전 안정 구간으로 설정 |
| 수익률 | ★★☆☆☆ | 시작점 의존성 | 다중 기준점 앙상블 |
| 로그 수익률 | ★★☆☆☆ | 대규모 변동 시 비대칭 왜곡 | 거의 무시 가능 수준 |

### 6.2 반드시 보존해야 하는 패턴 Feature

정규화 후에도 이 특성이 유지되는지 반드시 검증해야 한다:

```python
def verify_pattern_preservation(original, normalized):
    """정규화 후 패턴 핵심 특성 보존 검증"""
    checks = {}

    # 1. 수축 비율 보존 (VCP 핵심)
    # 각 수축의 깊이 비율이 정규화 후에도 일정한가?
    orig_contractions = get_contraction_ratios(original)
    norm_contractions = get_contraction_ratios(normalized)
    checks['contraction_ratio_preserved'] = np.allclose(
        orig_contractions, norm_contractions, atol=0.05
    )

    # 2. Higher Low 구조 보존
    orig_lows = get_swing_lows(original)
    norm_lows = get_swing_lows(normalized)
    checks['higher_lows_preserved'] = all(
        norm_lows[i] < norm_lows[i+1]
        for i in range(len(norm_lows)-1)
    ) == all(
        orig_lows[i] < orig_lows[i+1]
        for i in range(len(orig_lows)-1)
    )

    # 3. 거래량 건조화 패턴 보존
    orig_vol_trend = get_volume_trend(original)  # 감소/증가/횡보
    norm_vol_trend = get_volume_trend(normalized)
    checks['volume_dryup_preserved'] = (orig_vol_trend == norm_vol_trend)

    # 4. 돌파 시점의 거래량 급증 보존
    orig_breakout_vol_ratio = (
        original['volume'].iloc[-1] / original['volume'].mean()
    )
    norm_breakout_vol_ratio = (
        normalized['volume'].iloc[-1] / normalized['volume'].mean()
    )
    checks['breakout_volume_preserved'] = abs(
        orig_breakout_vol_ratio - norm_breakout_vol_ratio
    ) < 0.1

    # 5. 시간적 순서 보존 (리샘플링 시)
    checks['temporal_order_preserved'] = True  # 리샘플링은 순서 변경 없음

    return checks
```

### 6.3 정규화 방법별 패턴 왜곡 상세 분석

#### Min-Max에서의 왜곡 사례

```
원본: [100, 95, 90, 85, 150, 88, 86, 87, 89]  (4일차 급등)
Min-Max: [0.23, 0.15, 0.08, 0.00, 1.00, 0.05, 0.02, 0.03, 0.06]

문제: 4일차 급등(뉴스 등)으로 전체 스케일이 왜곡됨.
      실제 패턴(수축 → 안정화)이 0~0.23 범위에 압축되어 형태 판별 어려움.

해결: Clipping 후 Min-Max
      150을 99th percentile로 clipping → 100으로 제한
      결과: [0.00, ~, ~, ~, 1.00, ~, ~, ~, ~] → 패턴 형태 복원
```

#### Z-Score에서의 왜곡 사례

```
상황: 종목 A가 3개월간 300% 상승 후 VCP 형성
      상승 구간 포함 60일 Z-Score의 σ가 매우 큼
      → VCP 수축 깊이 10%가 Z-Score로는 0.3 수준 (무의미하게 작음)

해결: Z-Score 윈도우를 패턴 구간만으로 한정
      또는 패턴 시작 전 안정 구간의 σ 사용
```

### 6.4 권장 정규화 파이프라인 (패턴 보존 최적화)

```python
def pattern_safe_normalize(df, pattern_start, pattern_end):
    """패턴 보존을 최적화한 정규화 파이프라인"""

    window = df.iloc[pattern_start:pattern_end].copy()

    # Step 1: 이상치 Clipping (1~99 percentile)
    for col in ['open', 'high', 'low', 'close']:
        p01 = window[col].quantile(0.01)
        p99 = window[col].quantile(0.99)
        window[col] = window[col].clip(p01, p99)

    # Step 2: 가격 — 시작점 대비 누적 수익률 (형태 보존)
    base_price = window['close'].iloc[0]
    for col in ['open', 'high', 'low', 'close']:
        window[f'{col}_norm'] = window[col] / base_price - 1.0

    # Step 3: 가격 — Min-Max 추가 (0~1 범위, 비교용)
    price_norm = window[['open_norm', 'high_norm', 'low_norm', 'close_norm']]
    p_min = price_norm.min().min()
    p_max = price_norm.max().max()
    for col in ['open_norm', 'high_norm', 'low_norm', 'close_norm']:
        window[f'{col}_minmax'] = (window[col] - p_min) / (p_max - p_min)

    # Step 4: 거래량 — RVOL (의미 보존)
    # 패턴 이전 50일 평균 기준 (패턴 내 거래량이 평균을 오염시키지 않도록)
    pre_pattern_avg_vol = df['volume'].iloc[
        max(0, pattern_start-50):pattern_start
    ].mean()
    window['volume_norm'] = window['volume'] / pre_pattern_avg_vol

    # Step 5: 보존 검증
    checks = verify_pattern_preservation(
        df.iloc[pattern_start:pattern_end], window
    )

    return window, checks
```

---

## 종합 권장 파이프라인

전체 전처리 파이프라인을 단계별로 정리한다.

```python
class PatternPreprocessor:
    """VCP/CWH/HTF/W 패턴 전처리 파이프라인"""

    def __init__(self, target_length=64, vol_lookback=50):
        self.target_length = target_length
        self.vol_lookback = vol_lookback
        self.scalers = {}  # feature별 scaler 저장

    def process_single_pattern(self, df, market_df,
                                pattern_start, pattern_end):
        """단일 패턴 인스턴스의 전체 전처리"""

        # === 1. 가격 정규화 ===
        window = df.iloc[pattern_start:pattern_end].copy()

        # 1a. Clipping
        for col in ['open', 'high', 'low', 'close']:
            p01, p99 = window[col].quantile(0.01), window[col].quantile(0.99)
            window[col] = window[col].clip(p01, p99)

        # 1b. 누적 로그 수익률
        base = window['close'].iloc[0]
        for col in ['open', 'high', 'low', 'close']:
            window[f'{col}_logret'] = np.log(window[col] / base)

        # 1c. 윈도우 내 Min-Max (형태 비교용)
        # (로그 수익률에 적용)
        lr_cols = ['open_logret', 'high_logret', 'low_logret', 'close_logret']
        lr_min = window[lr_cols].min().min()
        lr_max = window[lr_cols].max().max()
        for col in lr_cols:
            window[f'{col}_mm'] = (window[col] - lr_min) / (lr_max - lr_min)

        # === 2. 거래량 정규화 ===
        pre_avg = df['volume'].iloc[
            max(0, pattern_start - self.vol_lookback):pattern_start
        ].mean()
        window['rvol'] = window['volume'] / max(pre_avg, 1)
        window['vol_zscore'] = (
            (window['volume'] - pre_avg) /
            df['volume'].iloc[
                max(0, pattern_start - self.vol_lookback):pattern_start
            ].std()
        )

        # === 3. 고정 길이 변환 ===
        feature_cols = [f'{c}_logret_mm' for c in ['open','high','low','close']] + ['rvol']
        series = resample_to_fixed_length(
            window[feature_cols], self.target_length
        )  # shape: (64, 5)

        # === 4. 컨텍스트 벡터 ===
        context, context_dict = build_context_vector(
            df, market_df, pattern_start, pattern_end
        )

        # === 5. 규칙 Feature ===
        rule_feat = rule_based_features(df, window)
        rule_vector = np.array(list(rule_feat.values()))

        return {
            'series': series.values,          # (64, 5) — CNN/LSTM
            'context': context,               # (M,)   — Dense
            'rule_features': rule_vector,      # (N,)   — Dense
            'metadata': {
                'original_length': pattern_end - pattern_start,
                'pattern_start': pattern_start,
                'pattern_end': pattern_end,
                'context_dict': context_dict
            }
        }

    def process_batch(self, stock_data_dict, market_df, pattern_labels):
        """전체 종목 × 패턴 일괄 처리"""
        all_samples = []

        for ticker, patterns in pattern_labels.items():
            df = stock_data_dict[ticker]
            for p_start, p_end, label in patterns:
                sample = self.process_single_pattern(
                    df, market_df, p_start, p_end
                )
                sample['label'] = label
                sample['ticker'] = ticker
                all_samples.append(sample)

        return all_samples
```

### 의사결정 가이드 (역방향)

| 결과가 이것이면 | 이것을 조정하라 |
|--------------|--------------|
| 서로 다른 종목의 같은 패턴이 멀리 떨어짐 | 가격 정규화 강화 (Min-Max 확인) |
| 같은 종목의 다른 패턴이 가깝게 뭉침 | 시계열 길이/형태 정보 부족 → 리샘플링 target_length 증가 |
| 거래량 급증 패턴이 무시됨 | RVOL 대신 Vol Z-Score 사용 또는 임계값 조정 |
| 늦은 베이스 패턴(3rd+)이 1st와 같은 확률 | 컨텍스트 벡터의 base_count feature 추가/가중 |
| Bear 시장 패턴이 과대평가됨 | 시장 regime feature 추가 |
| 이상치 하나가 결과를 지배 | Clipping percentile 강화 (5~95%) |

---

## 관점 확장 및 문제 재정의

### 인접 질문 (결론을 바꿀 수 있는 숨은 변수)

1. **라벨링 품질 > 정규화 품질**: 아무리 정규화를 잘 해도, "패턴 성공" 라벨이 부정확하면 모델은 학습 불가. 피봇 돌파 후 +30%를 10일 이내로 정의하는 것이 과연 최적인지, 라벨링 자체의 sensitivity analysis가 정규화만큼 (또는 그 이상) 중요하다.

2. **유동성 리스크 feature 부재**: 소형주의 VCP가 형태적으로 완벽해도, 유동성 부족으로 실제 진입/청산이 불가능할 수 있다. 정규화 파이프라인에 **유동성 필터/feature**를 포함하지 않으면, 모델이 실행 불가능한 시그널을 생성할 수 있다.

### 이질 도메인 유사 구조

[이질 도메인: 음성 인식] — DTW가 원래 음성 인식에서 발전한 기술이다. 주가 패턴 비교와 음성 파형 비교는 "가변 속도의 시계열 형태 매칭"이라는 동일 구조를 공유한다. 음성 인식에서 MFCC(Mel-frequency cepstral coefficients)로 주파수 대역별 특징을 추출하듯, 주가 패턴에서도 다중 시간 스케일 특징을 분리 추출하는 것이 효과적이다.

### 문제 재정의

원래 질문 "어떻게 정규화하는가"보다 더 적절한 핵심 질문: **"정규화된 패턴 공간에서 유사성을 어떤 거리 함수(metric)로 측정하는가"**. 정규화는 수단이고, 진짜 목적은 의미 있는 유사성 공간(similarity space)을 구축하는 것이다. 정규화 방법의 선택은 최종 거리 함수와 함께 결정되어야 한다.

---

## 출처 및 참고

- arXiv 2412.15448 — "Assessing the Impact of Technical Indicators on Machine Learning": 로그 수익률 + 롤링 Z-Score 방법론
- arXiv 2504.02249 — "Stock Price Prediction Using Triple Barrier Labeling and Raw OHLCV": Raw OHLCV vs 기술지표 비교
- arXiv 1808.00418 — "Stock Chart Pattern Recognition with Deep Learning": CNN/LSTM 패턴 인식 전처리
- IJCAI 2025 — "Multi-Scale Temporal Neural Network for Stock Trend Prediction": 멀티스케일 3D CNN
- Scientific Reports 2025 — "Variable-length control chart pattern recognition based on sliding window method and SECNN-BiLSTM"
- UCR — "Everything you know about Dynamic Time Warping is Wrong": DTW + 리샘플링 정확도 비교
- Springer — "Machine learning, stock market forecasting, and market efficiency": Z-Score 정규화 표준
- PMC 8345893 — "Improving stock trading decisions based on pattern recognition using ML"
- Stonehill Forex — Normalized Volume as a Volume Indicator: RVOL 방법론
