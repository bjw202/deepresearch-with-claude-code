# 실전 학습 데이터 구성 가이드: CWH/VCP/HTF 돌파 패턴 ML 분류

> 작성일: 2026-03-18 목적: 스윙트레이딩 돌파 패턴의 성공/실패를 ML로 분류하기 위한 데이터 파이프라인 구축 가이드 대상 구조: 표현학습 → 확률예측 → 랭킹 → 실행최적화 (4단 분리 구조)

---

## 목차

1. [데이터 소싱](#1-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%86%8C%EC%8B%B1)
2. [피처 엔지니어링](#2-%ED%94%BC%EC%B2%98-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EB%A7%81)
3. [라벨링](#3-%EB%9D%BC%EB%B2%A8%EB%A7%81)
4. [데이터셋 분할](#4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%85%8B-%EB%B6%84%ED%95%A0)
5. [실제 구현 로드맵](#5-%EC%8B%A4%EC%A0%9C-%EA%B5%AC%ED%98%84-%EB%A1%9C%EB%93%9C%EB%A7%B5)

---

## 1. 데이터 소싱

### 1.1 미국 주식 데이터

#### 무료 옵션

| 소스 | 데이터 | 장점 | 단점 | 비고 |
| --- | --- | --- | --- | --- |
| **yfinance** | OHLCV + 수정주가 | 무료, 간편, 분봉 지원 | 비공식 API, rate limit, 간헐적 데이터 누락 | MVP에 최적 |
| **Alpaca (Basic)** | OHLCV (2016\~) | 무료, 공식 API, 페이퍼 트레이딩 | IEX 데이터만 (실시간은 제한적), 분봉 15분 딜레이 | 실매매 연동 시 유리 |
| **Alpha Vantage** | OHLCV + 기술지표 | 무료 티어, 기술지표 API 내장 | 분당 5회 제한 (무료), 일봉만 실용적 | 보조용 |
| **Tiingo** | EOD + IEX 실시간 | 30년+ 히스토리, 깨끗한 데이터 | 무료 티어 월 500 심볼 제한 | 백테스트용 추천 |
| **EODHD** | 60+ 거래소 | 글로벌 커버리지, 30년 히스토리 | 무료 일 20회 제한 |  |

#### 유료 옵션 (본격 개발 시)

| 소스 | 월 비용 | 장점 | 추천 상황 |
| --- | --- | --- | --- |
| **Polygon.io** | $29\~ | 전 거래소 실시간, 분/틱 데이터, 높은 품질 | 분봉 기반 분석 필요 시 |
| **Tiingo (유료)** | $10\~ | 깨끗한 EOD, 합리적 가격 | 일봉 중심 스윙트레이딩 |
| **Alpaca (Algo Trader Plus)** | $99 | 전 거래소 실시간, 무제한 웹소켓 | 실매매 시스템 |
| **FirstRate Data** | 일회성 | 고품질 히스토리 CSV | 장기 백테스트 |

#### MVP 추천: yfinance로 시작, Tiingo로 검증

```python
# === yfinance로 미국 주식 OHLCV 수집 ===
import yfinance as yf
import pandas as pd

def fetch_us_ohlcv(ticker: str, start: str = "2015-01-01") -> pd.DataFrame:
    """미국 주식 일봉 OHLCV + 거래대금 수집"""
    df = yf.download(ticker, start=start, auto_adjust=True)
    df.columns = df.columns.droplevel(1) if isinstance(df.columns, pd.MultiIndex) else df.columns
    df = df.rename(columns={
        'Open': 'open', 'High': 'high', 'Low': 'low',
        'Close': 'close', 'Volume': 'volume'
    })
    # 거래대금 = 종가 * 거래량 (근사)
    df['dollar_volume'] = df['close'] * df['volume']
    return df

# 사용
df = fetch_us_ohlcv("AAPL", "2015-01-01")
print(df.tail())
```

```python
# === 전체 종목 리스트 + 배치 수집 ===
import time

def get_sp500_tickers() -> list:
    """S&P 500 티커 리스트"""
    table = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")
    return table[0]['Symbol'].tolist()

def fetch_multiple_stocks(tickers: list, start: str = "2015-01-01") -> dict:
    """여러 종목 배치 수집 (rate limit 준수)"""
    data = {}
    for i, ticker in enumerate(tickers):
        try:
            df = fetch_us_ohlcv(ticker, start)
            if len(df) > 100:  # 최소 데이터 검증
                data[ticker] = df
        except Exception as e:
            print(f"Failed {ticker}: {e}")
        if i % 50 == 0 and i > 0:
            time.sleep(2)  # rate limit 존중
    return data
```

### 1.2 한국 주식 데이터

| 소스 | 특징 | 추천도 |
| --- | --- | --- |
| **pykrx** | KRX 직접 크롤링, OHLCV/시가총액/PER/PBR, 수정주가 지원 | 최고 추천 |
| **FinanceDataReader** | KRX/NYSE/NASDAQ 등 다국가 지원, 간편한 인터페이스 | 범용 추천 |
| **KIS Open API** | 한국투자증권 공식 API, 실시간 가능 | 실매매 연동 시 |

```python
# === pykrx로 한국 주식 수집 ===
from pykrx import stock
import pandas as pd
import time

def fetch_kr_ohlcv(ticker: str, start: str = "20150101", end: str = "20260318") -> pd.DataFrame:
    """한국 주식 일봉 OHLCV"""
    df = stock.get_market_ohlcv(start, end, ticker)
    df.columns = ['open', 'high', 'low', 'close', 'volume', 'dollar_volume', 'pct_change']
    return df

def fetch_kr_all_ohlcv(date: str = "20260318", market: str = "KOSPI") -> pd.DataFrame:
    """특정 일자 전체 종목 시세"""
    return stock.get_market_ohlcv(date, market=market)

# 전종목 티커 리스트
tickers = stock.get_market_ticker_list("20260318", market="KOSPI")
```

```python
# === FinanceDataReader 대안 ===
import FinanceDataReader as fdr

# 한국 주식
df_samsung = fdr.DataReader('005930', '2015')  # 삼성전자

# 미국 주식도 가능
df_aapl = fdr.DataReader('AAPL', '2015')

# 거래소 전체 리스트
df_krx = fdr.StockListing('KRX')     # 한국
df_sp500 = fdr.StockListing('S&P500') # 미국
```

### 1.3 필요 데이터 기간

| 용도 | 최소 기간 | 권장 기간 | 이유 |
| --- | --- | --- | --- |
| **MVP / 피처 검증** | 5년 | 7년 | 최소 1\~2개 bear market 포함 |
| **본격 학습** | 7년 | 10\~15년 | 다양한 시장 레짐 포함 (2008, 2020, 2022 등) |
| **Walk-forward 테스트** | 10년 | 15년+ | 학습 5\~7년 + 검증 2\~3년 + 테스트 2\~3년 |

**핵심 원칙**: 최소 2개 이상의 bear market cycle을 포함해야 모델이 방어적 상황을 학습할 수 있다.

### 1.4 분봉 vs 일봉

**결론: 일봉을 기본으로 사용하고, 당일 돌파 확인에만 분봉을 보조적으로 활용한다.**

| 구분 | 일봉 | 분봉 |
| --- | --- | --- |
| 스윙트레이딩 적합성 | 최적 (보유기간 5\~20일) | 과도한 노이즈 |
| 데이터 크기 | 관리 가능 (종목당 \~2,500행/10년) | 거대 (\~390행/일/종목) |
| 피처 계산 | 표준 기술지표 직접 적용 | 리샘플링 필요 |
| 무료 데이터 | 풍부 | 제한적 |
| **추천 보조 사용** | \- | 돌파일 당일의 거래량 프로파일, 첫 1시간 거래 패턴 |

---

## 2. 피처 엔지니어링

### 2.1 ATR 수축률 (ATR Contraction Ratio)

ATR이 줄어든다 = 변동성이 수축한다 = VCP 형성 중.

```python
import numpy as np
import pandas as pd

def calc_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """Average True Range 계산"""
    high = df['high']
    low = df['low']
    close = df['close']

    tr1 = high - low
    tr2 = (high - close.shift(1)).abs()
    tr3 = (low - close.shift(1)).abs()
    true_range = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)

    # Wilder's smoothing (EMA with alpha=1/period)
    atr = true_range.ewm(alpha=1/period, min_periods=period).mean()
    return atr

def atr_contraction_ratio(df: pd.DataFrame, short: int = 5, long: int = 20) -> pd.Series:
    """ATR 수축률: 단기 ATR / 장기 ATR

    값이 1 미만이면 수축 중 (VCP 신호)
    값이 낮을수록 더 강한 수축
    """
    atr_short = calc_atr(df, short)
    atr_long = calc_atr(df, long)
    return atr_short / atr_long

# 사용
df['atr_14'] = calc_atr(df, 14)
df['atr_contraction'] = atr_contraction_ratio(df, short=5, long=20)
```

### 2.2 거래량 수축률 (Volume Contraction Ratio)

VCP에서 거래량이 마르는 현상을 포착한다.

```python
def volume_contraction_ratio(df: pd.DataFrame, short: int = 5, long: int = 50) -> pd.Series:
    """거래량 수축률: 단기 평균 거래량 / 장기 평균 거래량

    값이 낮을수록 거래량이 마르고 있음 (매도 압력 소진)
    """
    vol_short = df['volume'].rolling(short).mean()
    vol_long = df['volume'].rolling(long).mean()
    return vol_short / vol_long

def volume_dry_up_score(df: pd.DataFrame, window: int = 10) -> pd.Series:
    """최근 N일 거래량이 50일 평균 대비 얼마나 마른지 (0~1)"""
    vol_ma50 = df['volume'].rolling(50).mean()
    recent_vol = df['volume'].rolling(window).mean()
    ratio = recent_vol / vol_ma50
    # 0~1로 클리핑 (1이면 정상, 0에 가까울수록 극도로 마름)
    return ratio.clip(0, 2) / 2

df['vol_contraction'] = volume_contraction_ratio(df, 5, 50)
df['vol_dry_up'] = volume_dry_up_score(df, 10)
```

### 2.3 EMA 대비 가격 거리

```python
def ema_distance(df: pd.DataFrame, periods: list = [5, 10, 20, 50]) -> pd.DataFrame:
    """각 EMA 대비 가격 거리 (% 기준)

    양수 = 가격이 EMA 위, 음수 = 가격이 EMA 아래
    """
    result = pd.DataFrame(index=df.index)
    for p in periods:
        ema = df['close'].ewm(span=p, adjust=False).mean()
        result[f'dist_ema{p}'] = (df['close'] - ema) / ema * 100
    return result

# EMA 정렬 상태 (bullish alignment: 5 > 10 > 20 > 50)
def ema_alignment_score(df: pd.DataFrame) -> pd.Series:
    """EMA 정렬 점수: 0~6 (완벽한 bullish alignment = 6)"""
    ema5 = df['close'].ewm(span=5, adjust=False).mean()
    ema10 = df['close'].ewm(span=10, adjust=False).mean()
    ema20 = df['close'].ewm(span=20, adjust=False).mean()
    ema50 = df['close'].ewm(span=50, adjust=False).mean()
    sma150 = df['close'].rolling(150).mean()
    sma200 = df['close'].rolling(200).mean()

    score = (
        (ema5 > ema10).astype(int) +
        (ema10 > ema20).astype(int) +
        (ema20 > ema50).astype(int) +
        (ema50 > sma150).astype(int) +
        (sma150 > sma200).astype(int) +
        (df['close'] > ema5).astype(int)
    )
    return score

ema_dist = ema_distance(df)
df = pd.concat([df, ema_dist], axis=1)
df['ema_alignment'] = ema_alignment_score(df)
```

### 2.4 고점 눌림 횟수 (Tight Closes Near High)

돌파 직전 가격이 고점 부근에서 타이트하게 수렴하는 횟수를 센다.

```python
def tight_closes_near_high(df: pd.DataFrame, lookback: int = 20, threshold_pct: float = 1.5) -> pd.Series:
    """최근 N일 중 고점 대비 threshold% 이내로 마감한 날 수

    높을수록 고점 부근에서 타이트하게 유지 중 (매도 압력 소진 신호)
    """
    rolling_high = df['high'].rolling(lookback).max()
    distance_from_high = (rolling_high - df['close']) / rolling_high * 100

    # 각 날짜에서 lookback 기간 내 tight close 횟수
    tight = (distance_from_high < threshold_pct).astype(int)
    return tight.rolling(lookback).sum()

def price_tightness(df: pd.DataFrame, window: int = 10) -> pd.Series:
    """최근 N일의 고-저 범위 / 종가 (%)

    낮을수록 가격이 타이트 (수축 패턴)
    """
    range_pct = (df['high'].rolling(window).max() - df['low'].rolling(window).min()) / df['close'] * 100
    return range_pct

df['tight_closes_20'] = tight_closes_near_high(df, 20, 1.5)
df['price_tightness_10'] = price_tightness(df, 10)
```

### 2.5 Pivot Point 대비 거리

```python
def pivot_distance(df: pd.DataFrame, lookback: int = 60) -> pd.Series:
    """최근 N일 최고가(pivot) 대비 현재 가격 거리 (%)

    0에 가까울수록 돌파 임박
    음수가 클수록 고점에서 먼 상태
    """
    pivot = df['high'].rolling(lookback).max()
    return (df['close'] - pivot) / pivot * 100

df['pivot_dist_60'] = pivot_distance(df, 60)
df['pivot_dist_120'] = pivot_distance(df, 120)
```

### 2.6 Relative Strength Rank (IBD 방식)

IBD의 RS 랭킹은 연간 수익률에서 최근 분기에 2배 가중치를 준 뒤, 전체 종목 중 백분위를 계산한다.

```python
def calc_rs_raw(close: pd.Series) -> float:
    """단일 종목의 RS 원점수 계산 (IBD 방식)

    공식: 0.4 * ROC(63) + 0.2 * ROC(126) + 0.2 * ROC(189) + 0.2 * ROC(252)
    - 최근 1분기(63일)에 2배 가중
    - 2/3/4분기 각각 동일 가중
    """
    if len(close) < 252:
        return np.nan

    roc_63 = (close.iloc[-1] / close.iloc[-63] - 1) * 100
    roc_126 = (close.iloc[-1] / close.iloc[-126] - 1) * 100
    roc_189 = (close.iloc[-1] / close.iloc[-189] - 1) * 100
    roc_252 = (close.iloc[-1] / close.iloc[-252] - 1) * 100

    return 0.4 * roc_63 + 0.2 * roc_126 + 0.2 * roc_189 + 0.2 * roc_252

def calc_rs_rank(all_stocks: dict, date_idx: int = -1) -> pd.Series:
    """전체 종목의 RS 백분위 랭킹 (0~99)

    Parameters:
        all_stocks: {ticker: DataFrame} 딕셔너리
        date_idx: 계산 시점 인덱스 (-1 = 최근)

    Returns:
        pd.Series: 티커별 RS 랭킹 (0~99)
    """
    rs_scores = {}
    for ticker, df in all_stocks.items():
        if len(df) >= 252:
            close = df['close'].iloc[:date_idx] if date_idx != -1 else df['close']
            rs_scores[ticker] = calc_rs_raw(close)

    rs_series = pd.Series(rs_scores)
    # 백분위 랭킹 (0~99)
    rs_rank = rs_series.rank(pct=True) * 99
    return rs_rank.round(0).astype(int)
```

**참고 구현체**: [skyte/relative-strength](https://github.com/skyte/relative-strength) -- IBD 스타일 RS 백분위 랭킹의 전체 파이프라인 (Python).

#### 단순 모멘텀 RS vs IBD RS

| 방식 | 계산법 | 장점 | 단점 |
| --- | --- | --- | --- |
| **IBD RS** | 분기별 가중 ROC + 전종목 백분위 | 최근 모멘텀 강조, 상대적 위치 파악 | 전종목 계산 필요 |
| **단순 모멘텀** | 단일 기간 ROC (e.g., 6개월) | 간단, 빠름 | 시간 가중 없음 |
| **SPY 대비 RS** | (종목 ROC) / (SPY ROC) | 시장 대비 상대 강도 | 시장 내 순위 모름 |

**추천**: IBD 방식을 기본으로 사용하되, SPY 대비 RS도 보조 피처로 추가.

### 2.7 업종/섹터 강도

```python
def sector_strength(all_stocks: dict, sector_map: dict, lookback: int = 20) -> dict:
    """섹터별 평균 수익률로 섹터 강도 계산

    Parameters:
        all_stocks: {ticker: DataFrame}
        sector_map: {ticker: sector_name}
        lookback: 수익률 계산 기간

    Returns:
        {sector: strength_score}
    """
    sector_returns = {}
    for ticker, df in all_stocks.items():
        if ticker in sector_map and len(df) > lookback:
            ret = (df['close'].iloc[-1] / df['close'].iloc[-lookback] - 1) * 100
            sector = sector_map[ticker]
            if sector not in sector_returns:
                sector_returns[sector] = []
            sector_returns[sector].append(ret)

    return {s: np.mean(rets) for s, rets in sector_returns.items()}

# 섹터 정보는 yfinance에서 가져올 수 있음
def get_sector_map(tickers: list) -> dict:
    """yfinance로 섹터 정보 수집"""
    sector_map = {}
    for t in tickers:
        try:
            info = yf.Ticker(t).info
            sector_map[t] = info.get('sector', 'Unknown')
        except:
            pass
    return sector_map
```

### 2.8 시장 Follow-Through Day 상태

Follow-Through Day (FTD)는 William O'Neil이 개발한 시장 전환 신호이다.

```python
def detect_follow_through_day(
    index_df: pd.DataFrame,
    min_gain_pct: float = 1.5,
    min_volume_increase: bool = True
) -> pd.Series:
    """Follow-Through Day 탐지

    조건:
    1. 시장 조정 중 저점 찍은 날 = Day 1 (attempted rally)
    2. Day 1 이후 저점 하회하지 않아야 함
    3. Day 4 이후, 지수가 min_gain_pct% 이상 상승 + 전일 대비 거래량 증가

    Returns:
        pd.Series: 1 = FTD 발생, 0 = 없음
    """
    close = index_df['close']
    volume = index_df['volume']

    ftd_signal = pd.Series(0, index=index_df.index)

    # 간단한 조정 구간 탐지: 10일 내 5% 이상 하락
    rolling_max = close.rolling(50).max()
    drawdown = (close - rolling_max) / rolling_max * 100
    in_correction = drawdown < -5

    # 조정 후 저점에서 rally attempt
    for i in range(4, len(close)):
        if not in_correction.iloc[i-4]:
            continue

        # 최근 저점 이후 저점 하회하지 않았는지 확인 (간략화)
        recent_low = close.iloc[max(0, i-20):i].min()
        rally_intact = all(close.iloc[i-3:i] >= recent_low * 0.99)

        if not rally_intact:
            continue

        # Day 4+ 조건: 큰 상승 + 거래량 증가
        daily_gain = (close.iloc[i] / close.iloc[i-1] - 1) * 100
        vol_increase = volume.iloc[i] > volume.iloc[i-1]

        if daily_gain >= min_gain_pct and (vol_increase or not min_volume_increase):
            ftd_signal.iloc[i] = 1

    return ftd_signal

def market_regime(index_df: pd.DataFrame) -> pd.Series:
    """시장 레짐 상태 (간단 버전)

    Returns:
        pd.Series: 'uptrend' / 'correction' / 'bear'
    """
    close = index_df['close']
    sma50 = close.rolling(50).mean()
    sma200 = close.rolling(200).mean()

    regime = pd.Series('correction', index=index_df.index)
    regime[close > sma50] = 'uptrend'
    regime[(close < sma50) & (close < sma200)] = 'bear'

    return regime

# S&P 500 지수로 시장 상태 판단
spy = fetch_us_ohlcv("SPY", "2015-01-01")
spy['ftd'] = detect_follow_through_day(spy)
spy['regime'] = market_regime(spy)
```

### 2.9 VCP/CWH 패턴 규칙 기반 탐지

VCP의 핵심: **수축(contraction)이 반복되며 깊이가 감소**하고, **거래량이 마른다**.

```python
def detect_vcp(
    df: pd.DataFrame,
    min_contractions: int = 2,
    max_contractions: int = 5,
    max_first_depth_pct: float = 35.0,
    min_depth_reduction_ratio: float = 0.3,
    max_base_length: int = 150,
    min_base_length: int = 15,
    vol_decline_required: bool = True
) -> dict:
    """VCP 패턴 탐지 알고리즘

    Minervini의 정의:
    - 첫 contraction: 보통 20~35% 깊이
    - 이후 각 contraction은 이전의 약 절반으로 줄어듦
    - 거래량이 점진적으로 감소
    - 최종 수축은 3~8% 이내

    Returns:
        dict: {
            'is_vcp': bool,
            'contractions': list of (depth_pct, length_days),
            'footprint': str (e.g., "19W 19/7 4T"),
            'pivot': float (돌파 가격),
            'tightness': float (최종 수축 깊이 %)
        }
    """
    if len(df) < min_base_length:
        return {'is_vcp': False}

    close = df['close'].values
    high = df['high'].values
    low = df['low'].values
    volume = df['volume'].values

    # 1단계: 스윙 고점/저점 찾기
    swing_points = find_swing_points(high, low, window=5)

    # 2단계: 연속 고점-저점 쌍에서 수축(contraction) 추출
    contractions = []
    prev_high = None

    for sp in swing_points:
        if sp['type'] == 'high':
            prev_high = sp
        elif sp['type'] == 'low' and prev_high is not None:
            depth_pct = (prev_high['price'] - sp['price']) / prev_high['price'] * 100
            length = sp['idx'] - prev_high['idx']
            contractions.append({
                'depth_pct': depth_pct,
                'length': length,
                'high_price': prev_high['price'],
                'low_price': sp['price'],
                'high_idx': prev_high['idx'],
                'low_idx': sp['idx']
            })

    if len(contractions) < min_contractions:
        return {'is_vcp': False}

    # 3단계: 수축 깊이가 감소하는지 확인
    valid_contractions = []
    for i, c in enumerate(contractions):
        if i == 0:
            if c['depth_pct'] <= max_first_depth_pct:
                valid_contractions.append(c)
        else:
            # 이전 수축 대비 깊이가 줄어드는지
            reduction = c['depth_pct'] / valid_contractions[-1]['depth_pct']
            if reduction < 1.0 and reduction > min_depth_reduction_ratio:
                valid_contractions.append(c)
            elif c['depth_pct'] < valid_contractions[-1]['depth_pct']:
                valid_contractions.append(c)

    if len(valid_contractions) < min_contractions:
        return {'is_vcp': False}

    # 4단계: 거래량 감소 확인
    if vol_decline_required:
        first_half_vol = np.mean(volume[:len(volume)//2])
        second_half_vol = np.mean(volume[len(volume)//2:])
        if second_half_vol > first_half_vol * 1.1:  # 10% 이상 증가하면 실패
            return {'is_vcp': False}

    # 5단계: 결과 구성
    total_weeks = (valid_contractions[-1]['low_idx'] - valid_contractions[0]['high_idx']) // 5
    first_depth = round(valid_contractions[0]['depth_pct'], 1)
    last_depth = round(valid_contractions[-1]['depth_pct'], 1)
    num_t = len(valid_contractions)

    # 피벗 = 최근 스윙 고점
    pivot = max(c['high_price'] for c in valid_contractions[-2:])

    return {
        'is_vcp': True,
        'contractions': [(round(c['depth_pct'], 1), c['length']) for c in valid_contractions],
        'footprint': f"{total_weeks}W {first_depth}/{last_depth} {num_t}T",
        'pivot': pivot,
        'tightness': last_depth,
        'num_contractions': num_t
    }


def find_swing_points(high: np.ndarray, low: np.ndarray, window: int = 5) -> list:
    """스윙 고점/저점 탐지

    window일 양쪽으로 더 높은/낮은 값이 없으면 스윙 포인트
    """
    points = []
    for i in range(window, len(high) - window):
        # 스윙 고점
        if high[i] == max(high[i-window:i+window+1]):
            points.append({'type': 'high', 'price': high[i], 'idx': i})
        # 스윙 저점
        if low[i] == min(low[i-window:i+window+1]):
            points.append({'type': 'low', 'price': low[i], 'idx': i})

    return sorted(points, key=lambda x: x['idx'])
```

**VCP Footprint 해석 예시**: "19W 19/7 4T"

- 19W = 19주 동안 형성
- 19/7 = 첫 수축 19%, 마지막 수축 7%
- 4T = 총 4번의 수축

### 2.10 Minervini Trend Template 필터

VCP를 찾기 전에, 종목이 Stage 2 상승 추세에 있는지부터 확인해야 한다.

```python
def minervini_trend_template(df: pd.DataFrame) -> pd.Series:
    """Minervini의 Trend Template 조건 (8개)

    모든 조건을 만족하는 종목만 VCP 후보로 고려

    Returns:
        pd.Series: True/False
    """
    close = df['close']
    sma50 = close.rolling(50).mean()
    sma150 = close.rolling(150).mean()
    sma200 = close.rolling(200).mean()

    # 52주 고가/저가
    high_52w = close.rolling(252).max()
    low_52w = close.rolling(252).min()

    # 200일 이평 기울기 (최근 1개월)
    sma200_slope = sma200 - sma200.shift(22)

    conditions = pd.DataFrame({
        # 1. 현재가 > 150일 이평 AND > 200일 이평
        'c1': (close > sma150) & (close > sma200),
        # 2. 150일 이평 > 200일 이평
        'c2': sma150 > sma200,
        # 3. 200일 이평이 최소 1개월간 상승
        'c3': sma200_slope > 0,
        # 4. 50일 이평 > 150일 이평 AND > 200일 이평
        'c4': (sma50 > sma150) & (sma50 > sma200),
        # 5. 현재가 > 50일 이평
        'c5': close > sma50,
        # 6. 현재가 > 52주 저가 대비 +30% 이상
        'c6': close > low_52w * 1.30,
        # 7. 현재가 > 52주 고가의 75% 이상 (즉, 고점 대비 25% 이내)
        'c7': close > high_52w * 0.75,
        # 8. RS 랭크 70 이상 (별도 계산 필요, 여기선 placeholder)
        'c8': True  # RS 랭킹은 전종목 계산 후 적용
    })

    return conditions.all(axis=1)

df['trend_template'] = minervini_trend_template(df)
```

### 2.11 정규화 방법

종목별 가격 스케일 차이를 처리하는 핵심 전략:

```python
from sklearn.preprocessing import RobustScaler

def normalize_features(df: pd.DataFrame, feature_cols: list) -> pd.DataFrame:
    """피처 정규화 전략

    원칙:
    1. 가격 관련 → 비율(%)로 변환하여 스케일 무관하게 만듦
    2. 거래량 관련 → 자기 자신의 평균 대비 비율로 변환
    3. 순위 관련 → 이미 0~99 범위이므로 그대로 사용
    4. 나머지 → RobustScaler (중앙값/IQR 기반, 이상치에 강건)
    """
    result = df.copy()

    # 이미 비율/순위인 피처는 그대로
    ratio_features = [c for c in feature_cols if any(
        k in c for k in ['dist_ema', 'contraction', 'dry_up', 'tightness', 'pivot_dist']
    )]
    rank_features = [c for c in feature_cols if 'rank' in c or 'rs_' in c]

    # 나머지 피처만 스케일링
    scale_features = [c for c in feature_cols if c not in ratio_features + rank_features]

    if scale_features:
        scaler = RobustScaler()
        result[scale_features] = scaler.fit_transform(result[scale_features])

    return result

# === 종목별 Z-score (시계열 정규화) ===
def per_stock_zscore(series: pd.Series, window: int = 252) -> pd.Series:
    """종목별 rolling z-score

    각 종목의 과거 1년 데이터 기준으로 정규화
    → 종목 간 비교 가능 + 시간에 따른 레짐 변화 반영
    """
    mean = series.rolling(window).mean()
    std = series.rolling(window).std()
    return (series - mean) / (std + 1e-8)
```

### 2.12 전체 피처 테이블 요약

| 카테고리 | 피처 | 계산법 | 범위 | 의미 |
| --- | --- | --- | --- | --- |
| **변동성** | `atr_contraction` | ATR(5) / ATR(20) | 0\~2+ | &lt;1이면 수축 중 |
| **변동성** | `price_tightness_10` | 10일 HH-LL / Close % | 0\~50+ | 낮을수록 타이트 |
| **거래량** | `vol_contraction` | Vol MA(5) / Vol MA(50) | 0\~3+ | &lt;1이면 거래량 마름 |
| **거래량** | `vol_dry_up` | 10일 평균 vol / 50일 평균 vol | 0\~1 | 0에 가까울수록 마름 |
| **추세** | `dist_ema5/10/20/50` | (Close - EMA) / EMA % | \-30\~30 | 이평선 대비 위치 |
| **추세** | `ema_alignment` | EMA 정렬 점수 | 0\~6 | 6=완벽한 상승정렬 |
| **패턴** | `tight_closes_20` | 20일 내 고점 1.5% 이내 마감 수 | 0\~20 | 높을수록 고점 눌림 |
| **피벗** | `pivot_dist_60` | (Close - 60일 고점) / 고점 % | \-40\~0+ | 0 근처=돌파 임박 |
| **상대강도** | `rs_rank` | IBD RS 백분위 | 0\~99 | 높을수록 강한 종목 |
| **섹터** | `sector_strength` | 섹터 평균 ROC | \-20\~20 | 양수=강한 섹터 |
| **시장** | `market_regime` | 인코딩된 시장 상태 | 0/1/2 | 2=상승, 0=약세 |
| **VCP** | `vcp_tightness` | 최종 수축 깊이 % | 0\~35 | 낮을수록 타이트 |
| **VCP** | `vcp_num_contractions` | 수축 횟수 | 0\~5 | 2\~4가 이상적 |

---

## 3. 라벨링

### 3.1 MFE/MAE 계산

```python
def calc_mfe_mae(
    df: pd.DataFrame,
    entry_idx: int,
    max_holding_days: int = 20
) -> dict:
    """진입 후 MFE/MAE 계산

    Parameters:
        df: OHLCV DataFrame
        entry_idx: 진입일 인덱스 (iloc 기준)
        max_holding_days: 최대 보유 기간

    Returns:
        dict: {
            'mfe_pct': 최대 유리 이탈 (%),
            'mae_pct': 최대 불리 이탈 (%),
            'mfe_day': MFE 도달 일수,
            'mae_day': MAE 도달 일수,
            'exit_pct_5d': 5일 후 수익률,
            'exit_pct_10d': 10일 후 수익률,
            'exit_pct_20d': 20일 후 수익률
        }
    """
    entry_price = df['close'].iloc[entry_idx]
    end_idx = min(entry_idx + max_holding_days, len(df) - 1)

    if entry_idx >= len(df) - 1:
        return None

    future = df.iloc[entry_idx + 1 : end_idx + 1]

    if len(future) == 0:
        return None

    # MFE: 진입가 대비 최고 도달점 (고가 기준)
    max_high = future['high'].max()
    mfe_pct = (max_high - entry_price) / entry_price * 100
    mfe_day = (future['high'].idxmax() - df.index[entry_idx]).days if hasattr(future['high'].idxmax(), 'days') else future['high'].values.argmax() + 1

    # MAE: 진입가 대비 최저 도달점 (저가 기준)
    min_low = future['low'].min()
    mae_pct = (min_low - entry_price) / entry_price * 100  # 음수
    mae_day = future['low'].values.argmin() + 1

    # 고정 기간 수익률
    result = {
        'mfe_pct': round(mfe_pct, 2),
        'mae_pct': round(mae_pct, 2),
        'mfe_day': int(mfe_day) if isinstance(mfe_day, (int, np.integer)) else 0,
        'mae_day': int(mae_day),
    }

    for days in [5, 10, 20]:
        if entry_idx + days < len(df):
            exit_price = df['close'].iloc[entry_idx + days]
            result[f'exit_pct_{days}d'] = round((exit_price - entry_price) / entry_price * 100, 2)
        else:
            result[f'exit_pct_{days}d'] = np.nan

    return result
```

### 3.2 성공/실패 라벨 기준

```python
def create_labels(
    df: pd.DataFrame,
    entry_indices: list,
    win_threshold_pct: float = 10.0,
    win_max_days: int = 10,
    lose_threshold_pct: float = -3.0,
    lose_max_days: int = 5
) -> pd.DataFrame:
    """성공/실패 라벨 생성

    라벨 기준 (스윙트레이딩 기준):
    - 성공: win_max_days일 내 win_threshold_pct% 이상 도달
    - 실패: lose_max_days일 내 lose_threshold_pct% 손절 도달

    라벨 체계:
    - label_binary: 1 = 성공, 0 = 실패
    - label_multi: 2 = 대성공(+15%+), 1 = 성공, 0 = 보합, -1 = 실패
    """
    records = []

    for idx in entry_indices:
        mfe_mae = calc_mfe_mae(df, idx, max_holding_days=20)
        if mfe_mae is None:
            continue

        entry_price = df['close'].iloc[idx]

        # 성공 여부: N일 내 목표 도달
        # MFE가 목표 이상이고, MAE가 손절 이전에 목표 도달
        hit_target = mfe_mae['mfe_pct'] >= win_threshold_pct
        hit_stop = mfe_mae['mae_pct'] <= lose_threshold_pct

        # 목표 도달이 손절보다 먼저인지 확인
        if hit_target and hit_stop:
            # 둘 다 도달: 어느 것이 먼저인지 확인
            success = mfe_mae['mfe_day'] < mfe_mae['mae_day']
        elif hit_target:
            success = True
        else:
            success = False

        # 멀티 라벨
        if mfe_mae['mfe_pct'] >= 20 and success:
            multi_label = 2  # 대성공
        elif success:
            multi_label = 1  # 성공
        elif mfe_mae['mae_pct'] <= -5:
            multi_label = -1  # 실패
        else:
            multi_label = 0  # 보합

        records.append({
            'entry_idx': idx,
            'entry_date': df.index[idx],
            'entry_price': entry_price,
            'label_binary': int(success),
            'label_multi': multi_label,
            **mfe_mae
        })

    return pd.DataFrame(records)

# === 사용 예시 ===
# 1. VCP/CWH 돌파 시점을 entry_indices로 넣음
# 2. 라벨 기준은 자신의 전략에 맞게 조정

# 스윙트레이더 권장 기준:
# - 보수적: 5일 +5%, 손절 -3%
# - 표준: 10일 +10%, 손절 -4%
# - 공격적: 20일 +15%, 손절 -5%
```

### 3.3 확률 라벨 (4단 구조의 2단계용)

단순 이진 분류 대신, 확률 + 기대값으로 라벨을 구성한다.

```python
def create_probability_labels(
    df: pd.DataFrame,
    entry_indices: list
) -> pd.DataFrame:
    """확률 예측을 위한 다중 라벨 생성

    모델이 예측해야 할 4개 타겟:
    1. P(win): 10일 내 +10% 도달 확률
    2. P(loss): 5일 내 -3% 도달 확률
    3. E[MFE]: 기대 최대 상승폭
    4. E[MAE]: 기대 최대 하락폭
    """
    records = []

    for idx in entry_indices:
        mfe_mae = calc_mfe_mae(df, idx, max_holding_days=20)
        if mfe_mae is None:
            continue

        # 다중 이벤트 라벨
        records.append({
            'entry_idx': idx,
            # 분류 타겟
            'hit_10pct_10d': int(mfe_mae['mfe_pct'] >= 10),
            'hit_5pct_5d': int(mfe_mae.get('exit_pct_5d', 0) >= 5 if mfe_mae.get('exit_pct_5d') else 0),
            'hit_stop_3pct_5d': int(mfe_mae['mae_pct'] <= -3),
            # 회귀 타겟
            'mfe_pct': mfe_mae['mfe_pct'],
            'mae_pct': mfe_mae['mae_pct'],
            'return_5d': mfe_mae.get('exit_pct_5d', np.nan),
            'return_10d': mfe_mae.get('exit_pct_10d', np.nan),
        })

    return pd.DataFrame(records)
```

### 3.4 라벨 불균형 처리

성공적인 돌파는 전체의 20\~30% 정도이므로 불균형이 발생한다.

```python
# === 방법 1: class_weight (가장 권장) ===
from sklearn.utils.class_weight import compute_class_weight

def get_class_weights(y: np.ndarray) -> dict:
    """클래스 가중치 계산"""
    classes = np.unique(y)
    weights = compute_class_weight('balanced', classes=classes, y=y)
    return dict(zip(classes, weights))

# XGBoost/LightGBM에서 사용
weights = get_class_weights(y_train)
# XGBoost: scale_pos_weight = count(neg) / count(pos)
scale_pos_weight = len(y_train[y_train==0]) / len(y_train[y_train==1])

# === 방법 2: SMOTE (주의사항 있음) ===
from imblearn.over_sampling import SMOTE

# 중요: 반드시 train set에만 적용!
# 시계열 데이터에서 SMOTE는 신중히 사용해야 함
smote = SMOTE(random_state=42, k_neighbors=5)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# === 방법 3: 라벨 기준 조정 (가장 실용적) ===
# 성공 기준을 낮추면 (e.g., +5% 대신 +3%) 클래스가 더 균형적
# 하지만 전략의 의미가 바뀌므로 신중히 결정

# === 방법 4: Focal Loss (딥러닝 시) ===
# 쉽게 분류되는 샘플의 loss를 줄이고, 어려운 샘플에 집중
# XGBoost에서는 custom objective로 구현 가능
```

**권장 전략**:

1. **1순위**: `class_weight='balanced'` 또는 `scale_pos_weight` 사용 (간단하고 효과적)
2. **2순위**: 라벨 기준을 현실적으로 조정
3. **3순위**: SMOTE (시계열 특성 고려하여 신중히)
4. 평가 지표로 accuracy 대신 **F1-score, AUC-ROC, Precision-Recall** 사용

---

## 4. 데이터셋 분할

### 4.1 Walk-Forward Split

금융 시계열에서 가장 기본이 되는 분할 방법이다.

```python
from typing import Generator, Tuple

def walk_forward_split(
    df: pd.DataFrame,
    train_years: float = 3.0,
    valid_months: int = 6,
    test_months: int = 6,
    step_months: int = 6,
    gap_days: int = 5
) -> Generator[Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame], None, None]:
    """Walk-Forward Split 생성기

    |--- train (3년) ---|-- gap --|-- valid (6개월) --|-- gap --|-- test (6개월) --|
                                                                  |--- 다음 train 시작 --|

    Parameters:
        train_years: 학습 기간 (년)
        valid_months: 검증 기간 (월)
        test_months: 테스트 기간 (월)
        step_months: 윈도우 이동 간격 (월)
        gap_days: train-valid, valid-test 사이 gap (라벨 누수 방지)
    """
    dates = df.index
    train_days = int(train_years * 252)
    valid_days = valid_months * 21
    test_days = test_months * 21
    step_days = step_months * 21

    start = 0
    fold = 0

    while start + train_days + valid_days + test_days + 2 * gap_days < len(dates):
        train_end = start + train_days
        valid_start = train_end + gap_days
        valid_end = valid_start + valid_days
        test_start = valid_end + gap_days
        test_end = test_start + test_days

        if test_end > len(dates):
            break

        train_df = df.iloc[start:train_end]
        valid_df = df.iloc[valid_start:valid_end]
        test_df = df.iloc[test_start:test_end]

        print(f"Fold {fold}: "
              f"Train {dates[start].date()}~{dates[train_end-1].date()} | "
              f"Valid {dates[valid_start].date()}~{dates[valid_end-1].date()} | "
              f"Test {dates[test_start].date()}~{dates[test_end-1].date()}")

        yield train_df, valid_df, test_df

        start += step_days
        fold += 1


# === 사용 예시 ===
# 10년 데이터 기준 Walk-Forward
for train, valid, test in walk_forward_split(df, train_years=3, valid_months=6, test_months=6):
    # 각 fold에서 학습/평가
    pass
```

### 4.2 Purged K-Fold with Embargo

Marcos Lopez de Prado가 제안한 방법으로, 시계열 CV에서 정보 누수를 방지한다.

```python
import numpy as np
from sklearn.model_selection import KFold

class PurgedKFoldCV:
    """Purged K-Fold Cross-Validation

    핵심 아이디어:
    1. Purging: test set과 시간적으로 겹치는 train 샘플 제거
    2. Embargo: test set 직후 일정 기간의 train 샘플 추가 제거

    Parameters:
        n_splits: fold 수
        purge_days: 라벨 생성에 사용된 미래 기간 (e.g., 10일 라벨이면 10)
        embargo_pct: embargo 기간 (전체 데이터의 비율, 보통 0.01~0.02)
    """

    def __init__(self, n_splits: int = 5, purge_days: int = 10, embargo_pct: float = 0.01):
        self.n_splits = n_splits
        self.purge_days = purge_days
        self.embargo_pct = embargo_pct

    def split(self, X: pd.DataFrame, y=None):
        """시간 정렬된 데이터에 대해 purged k-fold split 생성"""
        n_samples = len(X)
        embargo_size = int(n_samples * self.embargo_pct)

        indices = np.arange(n_samples)
        fold_size = n_samples // self.n_splits

        for i in range(self.n_splits):
            test_start = i * fold_size
            test_end = min((i + 1) * fold_size, n_samples)

            test_indices = indices[test_start:test_end]

            # Purge: test 시작 전 purge_days만큼 train에서 제거
            purge_start = max(0, test_start - self.purge_days)

            # Embargo: test 종료 후 embargo_size만큼 train에서 제거
            embargo_end = min(n_samples, test_end + embargo_size)

            # Train = 전체 - (test + purge + embargo)
            train_mask = np.ones(n_samples, dtype=bool)
            train_mask[purge_start:embargo_end] = False
            train_indices = indices[train_mask]

            yield train_indices, test_indices

    def get_n_splits(self):
        return self.n_splits


# === 사용 예시 ===
cv = PurgedKFoldCV(n_splits=5, purge_days=10, embargo_pct=0.01)

for fold, (train_idx, test_idx) in enumerate(cv.split(X)):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

    # 모델 학습 및 평가
    print(f"Fold {fold}: Train {len(train_idx)}, Test {len(test_idx)}")
```

### 4.3 Gap/Embargo 크기 설정 가이드

| 라벨 정의 | purge_days | embargo_pct | 이유 |
| --- | --- | --- | --- |
| 5일 후 수익률 | 5 | 0.005 | 라벨이 5일 미래를 봄 |
| 10일 내 +10% | 10 | 0.01 | 라벨이 10일 미래를 봄 |
| 20일 MFE/MAE | 20 | 0.02 | 라벨이 20일 미래를 봄 |
| **권장 기본값** | **10** | **0.01** | 대부분의 스윙 라벨에 적합 |

**핵심 원칙**: `purge_days >= 라벨 생성에 사용된 최대 미래 기간`

### 4.4 Train/Valid/Test 비율

```
전체 데이터: 10년 (2015~2025)

Walk-Forward 설계:
├── Fold 1: Train 2015-2017 | Valid 2018H1 | Test 2018H2
├── Fold 2: Train 2015.5-2018 | Valid 2018.5-2019H1 | Test 2019H1-H2
├── Fold 3: Train 2016-2019 | Valid 2019.5-2020H1 | Test 2020H1-H2
├── ...
└── Fold N: Train 2019-2022 | Valid 2022.5-2023H1 | Test 2023H1-H2

최종 평가: 2023H2~2025 (out-of-time test, 절대 학습에 사용하지 않음)
```

**비율 가이드**:

- Train: 60\~70%
- Validation: 15\~20%
- Test: 15\~20%
- 최종 Hold-out: 별도 10\~15% (마지막 기간)

---

## 5. 실제 구현 로드맵

### 5.1 Python 라이브러리 추천

```python
# === requirements.txt ===

# --- 데이터 수집 ---
# yfinance==0.2.43           # 미국 주식 OHLCV (무료)
# pykrx==1.0.45              # 한국 주식 OHLCV (무료)
# FinanceDataReader==0.9.90  # 멀티 마켓 데이터

# --- 피처 계산 ---
# pandas==2.2.3              # 데이터 처리 기본
# numpy==1.26.4              # 수치 연산
# ta==0.11.0                 # 기술 지표 라이브러리 (ATR, RSI, BB 등)
# ta-lib                     # C 기반 고속 기술 지표 (선택사항, 설치 까다로움)

# --- 모델 학습 ---
# scikit-learn==1.5.2        # 기본 ML 프레임워크
# xgboost==2.1.3             # Gradient Boosting (MVP 핵심)
# lightgbm==4.5.0            # 대안 Gradient Boosting
# imbalanced-learn==0.12.4   # SMOTE 등 불균형 처리

# --- 검증/백테스트 ---
# vectorbt==0.26.2           # 벡터화된 백테스트 (선택)

# --- 시각화 ---
# matplotlib==3.9.3
# seaborn==0.13.2
# plotly==5.24.1             # 인터랙티브 차트

# --- 데이터 저장 ---
# pyarrow==18.1.0            # parquet 포맷 (pandas와 함께)
```

설치 명령:

```bash
pip install yfinance pykrx pandas numpy ta scikit-learn xgboost lightgbm imbalanced-learn matplotlib seaborn
```

### 5.2 MVP 최소 구현 순서

#### Phase 1: 데이터 파이프라인 (1\~2주)

```python
"""
Phase 1 목표: 전종목 OHLCV 수집 + 저장 + 기본 피처 계산
"""

import os
import pandas as pd
import yfinance as yf
from pathlib import Path

DATA_DIR = Path("data")
RAW_DIR = DATA_DIR / "raw"
FEATURE_DIR = DATA_DIR / "features"

def phase1_collect_data():
    """S&P 500 전종목 10년 일봉 수집"""
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    tickers = get_sp500_tickers()

    for ticker in tickers:
        filepath = RAW_DIR / f"{ticker}.parquet"
        if filepath.exists():
            continue
        try:
            df = fetch_us_ohlcv(ticker, "2015-01-01")
            df.to_parquet(filepath)
            print(f"Saved {ticker}: {len(df)} rows")
        except Exception as e:
            print(f"Failed {ticker}: {e}")

def phase1_compute_features():
    """기본 피처 계산"""
    FEATURE_DIR.mkdir(parents=True, exist_ok=True)

    for filepath in RAW_DIR.glob("*.parquet"):
        ticker = filepath.stem
        df = pd.read_parquet(filepath)

        # 피처 계산
        df['atr_14'] = calc_atr(df, 14)
        df['atr_contraction'] = atr_contraction_ratio(df)
        df['vol_contraction'] = volume_contraction_ratio(df)
        df['vol_dry_up'] = volume_dry_up_score(df)

        ema_dist = ema_distance(df)
        df = pd.concat([df, ema_dist], axis=1)
        df['ema_alignment'] = ema_alignment_score(df)

        df['tight_closes_20'] = tight_closes_near_high(df)
        df['price_tightness_10'] = price_tightness(df)
        df['pivot_dist_60'] = pivot_distance(df, 60)

        df['trend_template'] = minervini_trend_template(df)

        df.to_parquet(FEATURE_DIR / f"{ticker}.parquet")

    print("Phase 1 complete!")
```

#### Phase 2: 라벨링 + 데이터셋 구성 (1주)

```python
"""
Phase 2 목표: VCP/돌파 시점 식별 → 라벨 생성 → 학습 데이터셋 구성
"""

def phase2_create_dataset():
    """전체 학습 데이터셋 생성"""
    all_records = []

    for filepath in FEATURE_DIR.glob("*.parquet"):
        ticker = filepath.stem
        df = pd.read_parquet(filepath)

        # Trend Template 통과 + 피벗 근처 종목만
        candidates = df[
            (df['trend_template'] == True) &
            (df['pivot_dist_60'] > -5) &  # 피벗 5% 이내
            (df['atr_contraction'] < 0.9) &  # 변동성 수축 중
            (df['vol_contraction'] < 0.8)  # 거래량 마르는 중
        ]

        if len(candidates) == 0:
            continue

        # 각 후보에 대해 라벨 생성
        for idx in candidates.index:
            iloc_idx = df.index.get_loc(idx)
            mfe_mae = calc_mfe_mae(df, iloc_idx, max_holding_days=20)

            if mfe_mae is None:
                continue

            # 피처 추출
            features = df.loc[idx, [
                'atr_contraction', 'vol_contraction', 'vol_dry_up',
                'dist_ema5', 'dist_ema10', 'dist_ema20', 'dist_ema50',
                'ema_alignment', 'tight_closes_20', 'price_tightness_10',
                'pivot_dist_60'
            ]].to_dict()

            features['ticker'] = ticker
            features['date'] = idx
            features.update(mfe_mae)

            # 이진 라벨
            features['label'] = int(mfe_mae['mfe_pct'] >= 10)

            all_records.append(features)

    dataset = pd.DataFrame(all_records)
    dataset.to_parquet(DATA_DIR / "training_dataset.parquet")

    print(f"Dataset created: {len(dataset)} samples")
    print(f"Label distribution:\n{dataset['label'].value_counts()}")

    return dataset
```

#### Phase 3: MVP 모델 학습 (1주)

```python
"""
Phase 3 목표: XGBoost 분류기 학습 + Walk-Forward 검증
"""

import xgboost as xgb
from sklearn.metrics import classification_report, roc_auc_score
import matplotlib.pyplot as plt

FEATURE_COLS = [
    'atr_contraction', 'vol_contraction', 'vol_dry_up',
    'dist_ema5', 'dist_ema10', 'dist_ema20', 'dist_ema50',
    'ema_alignment', 'tight_closes_20', 'price_tightness_10',
    'pivot_dist_60'
]

def phase3_train_model(dataset: pd.DataFrame):
    """Walk-Forward XGBoost 학습"""

    dataset = dataset.sort_values('date').reset_index(drop=True)

    # 라벨 불균형 비율
    n_pos = dataset['label'].sum()
    n_neg = len(dataset) - n_pos
    scale_pos_weight = n_neg / max(n_pos, 1)

    results = []

    for train_df, valid_df, test_df in walk_forward_split(
        dataset.set_index('date'),
        train_years=3,
        valid_months=6,
        test_months=6
    ):
        X_train = train_df[FEATURE_COLS].values
        y_train = train_df['label'].values
        X_valid = valid_df[FEATURE_COLS].values
        y_valid = valid_df['label'].values
        X_test = test_df[FEATURE_COLS].values
        y_test = test_df['label'].values

        # XGBoost 모델
        model = xgb.XGBClassifier(
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=scale_pos_weight,
            eval_metric='auc',
            early_stopping_rounds=30,
            random_state=42
        )

        model.fit(
            X_train, y_train,
            eval_set=[(X_valid, y_valid)],
            verbose=False
        )

        # 테스트 평가
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        y_pred = (y_pred_proba >= 0.5).astype(int)

        auc = roc_auc_score(y_test, y_pred_proba) if len(set(y_test)) > 1 else 0

        results.append({
            'test_period': f"{test_df.index[0]}~{test_df.index[-1]}",
            'n_test': len(y_test),
            'auc_roc': round(auc, 3),
            'accuracy': round((y_pred == y_test).mean(), 3),
            'precision': round(y_test[y_pred == 1].mean(), 3) if y_pred.sum() > 0 else 0,
            'recall': round(y_pred[y_test == 1].mean(), 3) if y_test.sum() > 0 else 0,
        })

        print(f"  AUC: {auc:.3f}")

    # 피처 중요도 시각화 (마지막 fold 기준)
    importance = pd.Series(
        model.feature_importances_,
        index=FEATURE_COLS
    ).sort_values(ascending=True)

    plt.figure(figsize=(10, 6))
    importance.plot(kind='barh')
    plt.title('Feature Importance (Last Fold)')
    plt.tight_layout()
    plt.savefig('feature_importance.png', dpi=150)
    plt.close()

    results_df = pd.DataFrame(results)
    print("\n=== Walk-Forward Results ===")
    print(results_df)
    print(f"\nMean AUC: {results_df['auc_roc'].mean():.3f}")

    return model, results_df
```

#### Phase 4: 랭킹 + 시뮬레이션 (2주)

```python
"""
Phase 4 목표: 매일 후보군 랭킹 → 상위 N개 선택 → 수익 시뮬레이션
"""

def phase4_daily_ranking(model, all_features: dict, date: str, top_n: int = 5):
    """특정 날짜의 전종목 랭킹"""
    scores = {}

    for ticker, df in all_features.items():
        if date not in df.index:
            continue
        row = df.loc[date]

        # Trend Template 통과 여부
        if not row.get('trend_template', False):
            continue

        features = row[FEATURE_COLS].values.reshape(1, -1)
        prob = model.predict_proba(features)[0][1]

        # Expected Value 계산 (간략화)
        # EV = P(win) * avg_win - P(loss) * avg_loss
        estimated_ev = prob * 10.0 - (1 - prob) * 4.0  # 가정: +10% vs -4%

        scores[ticker] = {
            'prob_win': round(prob, 3),
            'estimated_ev': round(estimated_ev, 2),
            'atr_contraction': row['atr_contraction'],
            'rs_rank': row.get('rs_rank', 0),
        }

    # EV 기준 정렬
    ranking = pd.DataFrame(scores).T.sort_values('estimated_ev', ascending=False)
    return ranking.head(top_n)
```

### 5.3 예상 데이터 크기와 컴퓨팅 요구사항

| 항목 | 규모 | 저장 크기 |
| --- | --- | --- |
| S&P 500 일봉 10년 | 500종목 x 2,520일 = 126만 행 | \~200MB (parquet) |
| KOSPI 일봉 10년 | 800종목 x 2,450일 = 196만 행 | \~300MB (parquet) |
| 피처 추가 후 | 컬럼 20\~30개 추가 | \~500MB\~1GB |
| 학습 데이터셋 (라벨링 후) | 10만\~50만 샘플 | \~100MB |

| 컴퓨팅 | 최소 사양 | 권장 사양 |
| --- | --- | --- |
| **CPU** | 4코어 | 8코어+ |
| **RAM** | 8GB | 16GB+ |
| **GPU** | 불필요 (XGBoost/LightGBM) | Phase 5+ 딥러닝 시 필요 |
| **스토리지** | 5GB | 20GB+ |
| **학습 시간** | XGBoost 1 fold: 30초\~2분 | 전체 WF: 5\~15분 |

**로컬 랩탑에서 충분히 가능하다.** 클라우드는 Phase 5 (딥러닝) 이후에나 고려하면 된다.

### 5.4 전체 개발 타임라인

```
Phase 1 (1~2주): 데이터 수집 + 피처 계산
  → 산출물: data/features/*.parquet

Phase 2 (1주): 라벨링 + 데이터셋 구성
  → 산출물: data/training_dataset.parquet

Phase 3 (1주): XGBoost MVP + Walk-Forward 검증
  → 산출물: 모델, feature importance, fold별 성능 리포트

Phase 4 (2주): 랭킹 시스템 + 수익 시뮬레이션
  → 산출물: 일별 랭킹, 누적 수익 곡선, Sharpe/Drawdown

Phase 5 (이후): 고도화
  → TCN/Transformer 표현학습
  → 포지션 사이징 RL
  → 실시간 파이프라인
```

---

## 부록: 참고 자료

### 오픈소스 구현체

| 프로젝트 | 설명 | URL |
| --- | --- | --- |
| skyte/relative-strength | IBD RS 백분위 랭킹 | https://github.com/skyte/relative-strength |
| shiyu2011/cookstock | Minervini VCP 스크리너 + AI 분석 | https://github.com/shiyu2011/cookstock |
| SENTINEL PRO | VCP 정량화 + 포지션 사이징 | https://github.com/emma019 (dev.to 게시글 참조) |
| stefan-jansen/ML for Trading | GBM 기반 트레이딩 시그널 교과서급 구현 | https://github.com/stefan-jansen/machine-learning-for-trading |

### 핵심 문헌

1. **Marcos Lopez de Prado**, "Advances in Financial Machine Learning" (2018) -- Purged K-Fold, 라벨링, 피처 중요도
2. **Mark Minervini**, "Trade Like a Stock Market Wizard" (2013) -- VCP, Trend Template, RS
3. **William O'Neil**, "How to Make Money in Stocks" -- CWH, Follow-Through Day, RS 원형

### 데이터 소스 정리

- **미국 무료**: yfinance, Alpaca (Basic), Tiingo (Free), Alpha Vantage
- **미국 유료**: Polygon.io, Tiingo (Pro), Alpaca (Plus), FirstRate Data
- **한국 무료**: pykrx (KRX 직접), FinanceDataReader
- **한국 유료**: KIS Open API (한국투자증권)

---

> **다음 단계**: Phase 1부터 시작하여 S&P 500 데이터를 수집하고 피처를 계산하라. MVP 전체를 4\~6주 안에 완성할 수 있다. 모델 성능보다 **데이터 파이프라인의 안정성과 라벨의 정확성**이 더 중요하다.