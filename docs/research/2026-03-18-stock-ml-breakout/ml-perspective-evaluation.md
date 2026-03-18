# 스윙트레이딩 ML 4단 파이프라인: ML 관점 평가

> 작성일: 2026-03-18
> 범위: ChatGPT 제안 4단 분리 구조(표현학습 - 확률예측 - 랭킹 - 실행최적화)의 ML적 타당성 평가

---

## 목차

1. [4단 분리 구조의 ML적 타당성](#1-4단-분리-구조의-ml적-타당성)
2. [시계열 표현학습의 현실성](#2-시계열-표현학습의-현실성)
3. [확률 예측 vs 방향 예측](#3-확률-예측-vs-방향-예측)
4. [모델 선택: XGBoost vs 딥러닝](#4-모델-선택-xgboost-vs-딥러닝)
5. [검증 방법론](#5-검증-방법론)
6. [과적합 리스크](#6-과적합-리스크)
7. [종합 평가 및 권고](#7-종합-평가-및-권고)

---

## 1. 4단 분리 구조의 ML적 타당성

### 평가: 강하게 지지됨 (High Confidence)

**파이프라인 요약:**
```
표현학습(self-supervised) → 확률 예측 → 랭킹 → 실행 최적화(RL)
```

### 1.1 분리 구조의 학술적 근거

End-to-end RL을 금융 트레이딩 전체에 적용하는 접근법은 이론적으로 매력적이나, 실증적으로 심각한 한계가 보고되어 있다.

**End-to-end RL의 문제점:**

- **정책 메모라이제이션(Policy Memorization)**: 고정된 과거 데이터에서 학습한 RL 정책이 실현 불가능한 매매를 외워버리는 현상이 반복 보고됨. FinRL-Meta 논문은 이를 "low signal-to-noise ratio, survivorship bias, backtesting overfitting"의 세 가지 핵심 도전으로 정리함 [1].
- **Sim-to-Real Gap**: FinRL 문서조차 "Sim-to-real gaps loom large. Paper trade before going live; treat FinRL and FinRL-Trading as experimental platforms rather than profit guarantees"라고 경고함 [2].
- **비정상성(Non-stationarity)**: 금융 데이터의 비정상적 분포 변화가 RL의 정책 안정성을 근본적으로 위협함.

**분리 구조의 장점:**

- **모듈별 디버깅 가능**: 각 단계의 성능을 독립적으로 측정하고 개선 가능
- **과적합 국소화**: 특정 단계에서 과적합이 발생해도 전체 시스템에 전파되지 않음
- **단계별 검증**: 각 모듈에 적합한 검증 방법을 적용할 수 있음
- **해석 가능성**: 특히 2단계(확률 예측)의 출력이 인간이 해석 가능한 형태

**학술적 선례:**

- Yao (2024) Stevens PhD 논문은 hierarchical RL framework을 제안하여 포트폴리오 선택과 주문 실행을 분리된 RL 에이전트로 처리. 두 에이전트를 분리하는 것이 단일 end-to-end보다 안정적임을 실증 [3].
- Moallemi & Saglam (2021)은 예측(SL)과 실행(RL)을 분리하여 "SL predicts price change trajectories, which are exogenous to the trader's policy"라는 점이 학습 안정성에 기여함을 보임 [4].
- Modular Machine Learning 서베이(2025, arXiv)는 복잡한 문제를 의미적으로 독립된 모듈로 분해하는 것이 일반화와 디버깅 양면에서 우수함을 체계적으로 정리 [5].

### 1.2 판단

4단 분리 구조는 **ML 모범 관행에 부합**한다. 특히 금융처럼 신호 대 잡음비(SNR)가 낮은 도메인에서는 end-to-end 접근이 잡음을 신호로 착각할 위험이 크므로, 단계별 분리가 더 안전하다. 다만 "4단계"라는 구체적 숫자가 최적이라는 학술적 증거는 없으며, 실무적 판단에 가깝다.

---

## 2. 시계열 표현학습의 현실성

### 평가: 조건부 지지 (Medium-High Confidence)

### 2.1 Self-Supervised 시계열 학습의 현황

최근 self-supervised 시계열 표현학습은 급속히 발전하고 있으며, 주요 방법론은 다음과 같다:

| 방법 | 핵심 기법 | 주요 성과 |
|------|-----------|-----------|
| **TS2Vec** (Yue et al., 2022) | 계층적 대조학습, timestamp masking | UCR 125개 데이터셋에서 평균 정확도 83.0% (+2.4%), UEA 29개에서 71.2% (+3.0%) [6] |
| **TNC** (Tonekaboni et al., 2021) | 시간적 이웃 코딩 | UCR 76.1%, 시간적 국소성 보존에 강점 [6] |
| **CoST** (Woo et al., 2022) | 계절-추세 분리 대조학습, MoCo 변형 | 시계열 예측에서 계절적 패턴 분리에 효과적 [7] |
| **SoftCLT** (2024, ICLR) | TS2Vec 위에 soft contrastive loss 적용 | TS2Vec 대비 유의미한 성능 향상 [8] |
| **SAMformer** (Ilbert et al., 2024) | 얕은 Transformer + Sharpness-Aware Minimization | 기존 깊은 Transformer 대비 일반화 우수 [9] |

### 2.2 금융 데이터에서의 적용 현실

**긍정적 증거:**

- RBC Borealis(캐나다 왕립은행 AI 연구소)가 금융 시계열에 대한 대조 학습 접근을 적극 연구 중. "자본 시장에서 자산 가격 결정, 변동성 추정, 시장 레짐 분류 등에 활용"을 언급 [7].
- CSMAR 데이터베이스(중국 상장사)에 대한 self-supervised 회계 데이터 이상 탐지 연구가 "temporal contrastive learning + dual-channel LSTM autoencoder"로 유의미한 성과를 보고 [10].
- Universal Time-Series Representation Learning 서베이(2024, arXiv)는 금융을 포함한 다양한 도메인에서 self-supervised 방법의 유효성을 확인 [11].

**주의가 필요한 부분:**

- **금융 데이터의 특수성**: 금융 시계열은 다른 도메인(의료, 센서) 대비 SNR이 극히 낮음. FinRL-Meta가 지적한 "low signal-to-noise ratio"가 표현학습에도 적용됨 [1].
- **직접 비교 부재**: TS2Vec, TNC 등의 벤치마크는 주로 UCR/UEA 분류 데이터셋이며, 금융 수익률 예측에 대한 직접 비교는 아직 제한적.
- **전이 가능성 미확인**: 일반 시계열에서 학습한 표현이 금융 특유의 패턴(VCP, contraction 등)을 포착할 수 있는지는 별도 검증 필요.
- **Foundation model 한계**: "foundation models demand significant computational resources, creating bottlenecks in scenarios requiring near-real-time predictions, such as high-frequency financial trading" [9].

### 2.3 판단

Self-supervised 시계열 표현학습은 **기술적으로 성숙했으나, 금융 도메인 특화 검증이 부족**하다. 도메인 특화 augmentation(차트 패턴 보존)과 금융 특화 pretext task 설계가 핵심이 될 것이다. "먼저 XGBoost로 hand-crafted feature 기반 baseline을 세운 후, 표현학습으로 교체"하는 점진적 접근이 현실적이다.

---

## 3. 확률 예측 vs 방향 예측

### 평가: 강하게 지지됨 (High Confidence)

### 3.1 MFE/MAE 기반 Multi-Target 예측의 이론적 근거

제안된 4개 라벨:
1. 성공 확률 (P(win))
2. 실패 확률 (P(loss))
3. 기대 확장폭 (MFE)
4. 기대 역행폭 (MAE)

**MFE/MAE의 학술적 배경:**

- John Sweeney가 원래 개발한 MAE 개념은 트레이딩 문헌에서 오래 사용되어 온 표준 메트릭 [12].
- MFE/MAE 분석은 "최적 손절/익절 수준 결정"에 직접 활용 가능하며, Van Tharp 등이 체계화 [12].
- Edge Ratio = sum(MFE*) / sum(MAE*)로 정의되며, ATR로 정규화하여 전략 품질을 측정하는 데 사용됨 [13].

**Multi-Target 예측의 장점:**

- **기대값(EV) 직접 계산 가능**: `EV = P(win) * avg_MFE - P(loss) * avg_MAE - cost`. 단순 방향 예측(up/down)은 이 계산이 불가능.
- **비대칭 수익 구조 포착**: 스윙트레이딩은 "승률 45%이지만 수익비 3:1"인 전략이 유효할 수 있으며, 방향 예측만으로는 이를 포착할 수 없음.
- **포지션 사이징 정보 제공**: MAE 예측값은 손절 수준 결정에, MFE는 목표가 설정에 직접 활용 가능.
- **확률 보정(Calibration) 가능**: 예측 확률을 보정하면 실제 기대값과의 정합성을 높일 수 있음 [14].

### 3.2 방향 예측의 한계

- **정보 손실**: 이진 분류(up/down)는 "얼마나 오르는지/내리는지"를 무시
- **임계값 의존성**: "+5% 이상을 성공으로" 같은 임의적 임계값에 따라 모델 행동이 크게 달라짐
- **Kelly Criterion 적용 불가**: 방향만 알면 최적 베팅 크기를 계산할 수 없음

### 3.3 실무적 주의점

- **Multi-target 학습의 어려움**: 4개 타겟 간 상관관계가 강함(MFE가 높으면 성공 확률도 높은 경향). Multi-task learning 또는 독립 모델 앙상블이 필요.
- **MFE/MAE는 사후 메트릭**: 실시간으로 관찰할 수 없는 미래 값이므로, 라벨 생성 시 holding period 정의가 중요.
- **확률 보정 필수**: 모델이 출력하는 "60%"가 실제 60%와 일치하는지 검증해야 함 (Platt scaling, isotonic regression 등).

### 3.4 판단

MFE/MAE 기반 multi-target 예측은 **단순 방향 예측보다 이론적으로 우수하며, 스윙트레이딩의 비대칭 수익 구조에 특히 적합**하다. 다만, multi-target 학습의 복잡성과 확률 보정의 필요성을 과소평가하지 않아야 한다.

---

## 4. 모델 선택: XGBoost vs 딥러닝

### 평가: XGBoost 우선 접근이 강하게 지지됨 (Very High Confidence)

### 4.1 핵심 실증 연구

**Grinsztajn et al. (2022), NeurIPS -- "Why do tree-based models still outperform deep learning on typical tabular data?"**

이 논문은 45개 데이터셋, 표준화된 벤치마크에서 다음을 실증:

- **중간 규모 데이터(~10K 샘플)에서 tree-based 모델이 SOTA** [15]
- 분류: Random Forest, XGBoost가 85-95% 정규화 정확도, 신경망은 60-80% [15]
- 회귀: 트리 모델 90-95% R2, 딥러닝은 80% 미만 [15]

**핵심 발견 -- Tree가 강한 이유:**
1. **불필요한 특성에 대한 강건성**: 트리는 irrelevant feature를 자연적으로 무시
2. **비평활(non-smooth) 목적 함수 학습**: 트리는 불연속적 결정 경계를 잘 포착
3. **회전 불변성 불필요**: 테이블 데이터는 특성 간 회전 변환이 의미 없음 [15]

**Shwartz-Ziv & Armon (2022), "Tabular data: Deep learning is not all you need"**

- XGBoost가 최근 제안된 딥러닝 모델(TabNet, NODE 등)을 **해당 논문이 사용한 데이터셋에서도** 능가 [16]
- XGBoost는 하이퍼파라미터 튜닝도 훨씬 적게 필요 [16]
- **단, XGBoost + 딥러닝 앙상블이 XGBoost 단독보다 우수** [16]

**McElfresh et al. (2023), "When Do Neural Nets Outperform Boosted Trees on Tabular Data?"**

- 19개 알고리즘, 176개 데이터셋 비교 [17]
- 데이터셋 크기, 특성 수, 타겟 유형에 따라 최적 모델이 달라짐
- 소규모-중규모에서는 여전히 GBDT 우위

### 4.2 금융 시계열 특화 비교

**Scilit 2025 비교 연구:**

- ARIMA, Random Forest, RNN, LSTM, CNN, Transformer를 6개 미국 주식에 대해 비교
- "Results are asset-dependent: ARIMA and Random Forest remain strong baselines; deep learning models show [mixed results]" [18]
- Walk-forward 평가에서 단순 모델이 복잡한 모델을 자주 능가

**PMC 2024 고빈도 데이터 비교:**

- "XGBoost outperformed the algorithms for prediction on data with these characteristics"
- "Deep Learning models tend to neutralize the excessive number of peaks in the time series, producing a smoother prediction but not corresponding to reality" [19]

**TCN-XGBoost 하이브리드 (PMC 2025):**

| 모델 | RMSE | MAE | MAPE(%) |
|------|------|-----|---------|
| TCN | 0.33 | 0.25 | 7.8 |
| XGBoost | 0.30 | 0.23 | 6.5 |
| TCN-XGBoost | 0.26 | 0.21 | 5.3 |
| LSTM | 0.34 | 0.26 | 8.1 |
| Transformer-XGBoost | 0.28 | 0.22 | 6.2 |

TCN-XGBoost 앙상블이 최고 성능을 보이나, XGBoost 단독도 대부분의 딥러닝 모델보다 우수 [20].

### 4.3 권장 순서

```
Phase 1: XGBoost/LightGBM (hand-crafted features)
   ↓ baseline 확립
Phase 2: TCN 또는 얕은 1D CNN 추가 (시계열 패턴 직접 학습)
   ↓ 개선 확인 시
Phase 3: 앙상블 (XGBoost + TCN) 또는 얕은 Transformer
   ↓ 필요 시
Phase 4: Self-supervised pre-training + supervised fine-tuning
```

### 4.4 판단

"XGBoost/LightGBM으로 시작하고, 필요하면 TCN/얕은 Transformer로 확장"이라는 원래 제안은 **실증 문헌과 완벽히 일치**한다. 특히 금융 데이터의 낮은 SNR에서는 복잡한 모델이 잡음을 학습할 위험이 크다. SAMformer의 핵심 메시지도 "얕은 구조 + 안정화 최적화가 깊은 모델보다 일반화가 나을 수 있다"는 것이다 [9].

---

## 5. 검증 방법론

### 평가: 제안된 방법론이 학술적으로 정확함 (Very High Confidence)

### 5.1 일반 K-Fold의 위험성

금융 시계열에 일반 K-Fold를 적용하면 **정보 누수(leakage)** 가 발생한다:

- 미래 데이터가 학습 세트에 포함되어 비현실적으로 높은 성능 추정
- 라벨 자체가 미래 이벤트에 의존하는 경우(예: "10일 후 +10% 달성 여부") 누수가 더 심각
- Lopez de Prado(2018)가 이 문제를 체계적으로 정리 [21]

### 5.2 Purged K-Fold Cross-Validation

**개발:** Marcos Lopez de Prado (2017, Guggenheim Partners & Cornell University) [21]

**핵심 메커니즘:**
1. **Purging**: 테스트 세트와 시간적으로 겹치는 라벨을 가진 학습 샘플 제거
2. **Embargo**: 테스트 세트 직후 일정 기간의 학습 샘플 추가 제거 (자기상관 대응)

```
[Train] ... [Purged] [Test] [Embargo] [Train continues] ...
```

**장점:**
- 표준 K-Fold보다 정보 누수를 대폭 감소
- Walk-forward보다 데이터 효율적 (모든 데이터 포인트가 테스트에 한 번 사용)

### 5.3 Combinatorial Purged Cross-Validation (CPCV)

**Arian et al. (2024) -- "Backtest overfitting in the machine learning era" (Knowledge-Based Systems)**

이 논문은 CPCV, Purged K-Fold, Walk-Forward를 체계적으로 비교하여:

- **CPCV가 PBO(Probability of Backtest Overfitting)에서 가장 낮은 값** [22]
- **CPCV가 DSR(Deflated Sharpe Ratio) 통계량에서 가장 우수** [22]
- **Walk-Forward는 "notable shortcomings in false discovery prevention, characterized by increased temporal variability and weaker stationarity"** [22]
- 신규 변형인 Bagged CPCV와 Adaptive CPCV도 제안 [22]

**CPCV의 핵심:**
- N개 폴드에서 k개를 테스트로 선택하는 모든 조합(nCk)을 사용
- 이를 통해 **복수의 백테스트 경로(path)** 를 생성하여 단일 경로 의존성 제거
- "single historical path에 과적합되는 것을 방지" [23]

### 5.4 Walk-Forward의 약점

Walk-Forward는 직관적이고 시간 순서를 존중하지만:

- **단일 경로 의존성**: 특정 역사적 순서에 결과가 좌우됨
- **초기 결정의 편향**: 초기에는 학습 데이터가 적어 불안정한 결정
- **높은 분산**: CPCV 대비 성능 추정의 분산이 큼 [22]

### 5.5 실무 권장

```
필수:
  - Walk-Forward (최소 baseline)
  - 거래비용 + 슬리피지 포함
  - 시간순 train/valid/test 분리

강력 권장:
  - Purged K-Fold + Embargo
  - CPCV (복수 백테스트 경로 평가)
  - Deflated Sharpe Ratio 적용

성능 지표:
  - CAGR, Max Drawdown, Profit Factor
  - Win Rate, Expectancy, Turnover
  - PBO (Probability of Backtest Overfitting)
```

### 5.6 판단

원래 제안의 검증 방법론(Walk-forward, Purged+embargo CV, CPCV)은 **Lopez de Prado의 연구와 2024년 최신 실증 비교 논문에 의해 강하게 뒷받침**된다. 특히 CPCV가 Walk-Forward보다 과적합 방지에 우수하다는 실증이 있으므로, CPCV를 핵심 검증 방법으로 채택하는 것이 바람직하다.

---

## 6. 과적합 리스크

### 평가: 가장 심각한 위험 요소 (Critical)

### 6.1 금융 ML 과적합의 본질

**Bailey & Lopez de Prado (2014, Journal of Portfolio Management) -- "The Deflated Sharpe Ratio":**

- "Competition among investment managers means that the ratio of signal to noise in financial series is low, increasing the probability of 'discovering' a chance configuration, rather than an actual signal" [24]
- 백테스트 과적합은 "금융 시리즈의 메모리 효과(memory effects)"로 인해 특히 비용이 큰 선택 편향(selection bias) [24]

**Bailey et al. (2016) -- "The Probability of Backtest Overfitting":**

- **IS Sharpe가 높을수록 OOS Sharpe가 낮은** 역설적 관계를 실증 [25]
- "We cannot hope escaping the risk of overfitting by exceeding some SR IS threshold. On the contrary, it appears that the higher the SR IS, the lower the SR OOS." [25]
- 이는 "더 많이 최적화할수록 더 많이 과적합된다"는 것을 의미

**실증 데이터 (Portfolio123 cohort study):**

- 실제 트레이더들의 대규모 백테스트 데이터를 분석한 결과, **백테스트 횟수가 많을수록 IS-OOS Sharpe 격차가 커짐** [26]
- "A direct indication of the detrimental effect of backtest overfitting" [26]

### 6.2 과적합의 유형

| 유형 | 설명 | 위험도 |
|------|------|--------|
| **Parameter overfitting** | 모델 하이퍼파라미터를 반복 튜닝 | 높음 |
| **Strategy overfitting** | 여러 전략 중 가장 좋아 보이는 것만 선택 | 매우 높음 |
| **Meta-overfitting** | CPCV 등 검증 방법까지 포함한 전체 연구 프로세스 과적합 | 극히 높음 |
| **Feature overfitting** | 금융 "feature zoo"에서 우연히 유효해 보이는 특성 선택 | 높음 |

### 6.3 방지 전략

**통계적 보정:**

- **Deflated Sharpe Ratio (DSR)**: 비정규성과 다중 검정을 보정한 Sharpe 비율 [24]
- **Minimum Track Record Length (MinTRL)**: Sharpe 비율이 통계적으로 유의하려면 필요한 최소 기록 길이 [24]
- **Probability of Backtest Overfitting (PBO)**: CSCV 프레임워크를 통한 과적합 확률 추정 [25]
- t-stat >= 3.0 기준 적용 (전통적 2.0 대신) [27]

**프로세스적 방지:**

- "Do not backtest until all your research is complete" [28]
- 백테스트 횟수를 기록하여 DSR 보정에 사용 [28]
- 전체 자산 클래스에 대해 모델 개발 (개별 종목 특화 회피) [28]
- **Model averaging**으로 분산 감소와 과적합 방지 동시 달성 [28]
- 최종 hold-out 데이터를 CPCV 과정에서도 사용하지 않음 [23]

**구조적 방지:**

- 복잡한 모델보다 단순한 모델 우선 (Occam's razor)
- Feature 수를 최소화하고, 경제적 근거가 있는 feature만 사용
- 앙상블로 단일 모델 의존성 감소

### 6.4 이 프로젝트에 특히 중요한 점

스윙트레이딩 패턴(VCP, CWH, HTF)은 본질적으로 **수가 제한된 이벤트**다:

- 연간 발생하는 유효한 VCP 패턴은 시장 전체에서 수백~수천 건 수준
- 이 정도 샘플 크기에서 복잡한 모델은 과적합 위험이 극히 높음
- **단순 모델 + 엄격한 검증**이 유일한 현실적 접근

### 6.5 판단

과적합은 이 프로젝트의 **가장 큰 리스크**다. 모델 성능보다 검증 엄격성이 더 중요하다. "IS에서 좋아 보이는 모델"보다 "OOS에서 안정적인 모델"을 선택해야 하며, DSR과 PBO를 반드시 적용해야 한다.

---

## 7. 종합 평가 및 권고

### 7.1 원래 제안에 대한 전반적 평가

| 항목 | 평가 | 신뢰도 |
|------|------|--------|
| 4단 분리 구조 | 강하게 지지 | High |
| Self-supervised 표현학습 | 조건부 지지 (금융 특화 검증 부족) | Medium-High |
| MFE/MAE multi-target 예측 | 강하게 지지 | High |
| XGBoost → TCN/Transformer 순서 | 매우 강하게 지지 | Very High |
| Purged CV / CPCV / Walk-forward | 매우 강하게 지지 | Very High |
| 실행에만 제한적 RL | 지지 (end-to-end RL 대비 안전) | High |

### 7.2 핵심 권고

1. **Phase 1에서 baseline을 확실히 세워라**. XGBoost + hand-crafted features + Walk-forward 검증으로 시작. 이것이 이길 수 없는 baseline이 아닌 한 딥러닝으로 갈 필요 없다.

2. **표현학습은 Phase 2 이후에 도입하라**. 직접 설계한 피처(ATR 수축률, 거래량 수축률, EMA 거리 등)가 먼저이고, self-supervised 표현은 이것이 한계에 도달한 후에 시도.

3. **검증에 투자하라**. 모델 개발 시간의 최소 50%를 검증에 할애. CPCV + DSR + PBO를 기본으로 적용.

4. **샘플 크기를 인식하라**. VCP 같은 특정 패턴은 연간 발생 빈도가 제한적. 모델 복잡도를 샘플 크기에 맞춰라.

5. **랭킹 모델에 Learning-to-Rank를 고려하라**. LambdaMART가 cross-sectional momentum 전략에서 Sharpe 비율을 3배 향상시킨 실증이 있다 [29].

### 7.3 주요 리스크

- **가장 큰 리스크**: 과적합 (특히 적은 패턴 샘플에서)
- **두 번째 리스크**: 레짐 변화에 대한 모델 취약성 (비정상성)
- **세 번째 리스크**: 표현학습 단계에서 금융 특화 패턴 미포착

---

## 출처

[1] Liu et al. (2022). "FinRL-Meta: Market Environments and Benchmarks for Data-Driven Financial Reinforcement Learning." NeurIPS 2022 Datasets and Benchmarks. https://papers.neurips.cc/paper_files/paper/2022/file/0bf54b80686d2c4dc0808c2e98d430f7-Paper-Datasets_and_Benchmarks.pdf

[2] FinRL Documentation. "Practical tips, limitations, and risk considerations." https://medium.com/@online-inference/getting-started-with-finrl-for-quantitative-trading-strategies

[3] Yao, Zhiyuan (2024). "Application of Reinforcement Learning in Financial Trading and Execution." PhD Dissertation, Stevens Institute of Technology. https://fsc.stevens.edu/application-of-reinforcement-learning-in-financial-trading-and-execution

[4] Moallemi & Saglam (2021). "A Reinforcement Learning Approach to Optimal Execution." https://moallemi.com/ciamac/papers/rl-exec-2021.pdf

[5] "Modular Machine Learning: An Indispensable Path towards New-Generation AI." arXiv:2504.20020, 2025. https://arxiv.org/html/2504.20020v2

[6] Yue et al. (2022). "TS2Vec: Towards Universal Representation of Time Series." AAAI 2022. https://ojs.aaai.org/index.php/AAAI/article/download/20881/20640

[7] RBC Borealis. "Self-supervised Learning in Time-Series Forecasting: A Contrastive Learning Approach." https://rbcborealis.com/research-blogs/self-supervised-learning-in-time-series-forecasting-a-contrastive-learning-approach/

[8] "Soft Contrastive Learning for Time Series." ICLR 2024. https://proceedings.iclr.cc/paper_files/paper/2024/file/ccc48eade8845cbc0b44384e8c49889a-Paper-Conference.pdf

[9] Ilbert et al. (2024). "SAMformer: Unlocking the Potential of Transformers in Time Series Forecasting." https://arxiv.org/abs/2402.10198

[10] "Accounting data anomaly detection and prediction based on self-supervised learning." Frontiers in Applied Mathematics and Statistics, 2025. https://www.frontiersin.org/journals/applied-mathematics-and-statistics/articles/10.3389/fams.2025.1628652/full

[11] "Universal Time-Series Representation Learning: A Survey." arXiv:2401.03717, 2024. https://arxiv.org/html/2401.03717v3

[12] "How to Track MFE and MAE to Optimize Exit Strategies." https://spreadsheetshub.com/blogs/articles/how-to-track-mfe-and-mae-to-optimize-exit-strategies

[13] Windmann (2020). "Machine Learning in Finance." RWTH Aachen University. http://www.instmath.rwth-aachen.de/~maier/publications/Windmann2020.pdf

[14] Messoudi et al. (2022). "Ellipsoidal Conformal Inference for Multi-Target Regression." PMLR vol. 179. https://proceedings.mlr.press/v179/messoudi22a/messoudi22a.pdf

[15] Grinsztajn, Oyallon & Varoquaux (2022). "Why do tree-based models still outperform deep learning on typical tabular data?" NeurIPS 2022. https://papers.neurips.cc/paper_files/paper/2022/file/0378c7692da36807bdec87ab043cdadc-Paper-Datasets_and_Benchmarks.pdf

[16] Shwartz-Ziv & Armon (2022). "Tabular data: Deep learning is not all you need." Information Fusion. https://www.sciencedirect.com/science/article/abs/pii/S1566253521002360

[17] McElfresh et al. (2023). "When Do Neural Nets Outperform Boosted Trees on Tabular Data?" https://arxiv.org/html/2305.02997v4

[18] "A Comparative Study of Transformer-Based and Classical Approaches for Financial Time Series." MDPI Algorithms, 2025. https://www.mdpi.com/1999-4893/18/10/662

[19] "A comparison between machine and deep learning models on high frequency data." PMC, 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11339414/

[20] "A hybrid TCN-XGBoost model for agricultural product market price prediction." PMC, 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12047798/

[21] Lopez de Prado, M. (2018). *Advances in Financial Machine Learning.* John Wiley & Sons. Wikipedia: https://en.wikipedia.org/wiki/Purged_cross-validation

[22] Arian et al. (2024). "Backtest overfitting in the machine learning era: A comparison of out-of-sample testing methods in a synthetic controlled environment." Knowledge-Based Systems. https://www.sciencedirect.com/science/article/abs/pii/S0950705124011110

[23] "Combinatorial Purged Cross Validation for Optimization." https://www.quantbeckman.com/p/with-code-combinatorial-purged-cross

[24] Bailey & Lopez de Prado (2014). "The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting and Non-Normality." Journal of Portfolio Management, 40(5), 94-107. https://www.davidhbailey.com/dhbpapers/deflated-sharpe.pdf

[25] Bailey et al. (2016). "The Probability of Backtest Overfitting." Journal of Computational Finance. https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf

[26] Portfolio123 Cohort Study. "Sample performance on a large cohort of trading algorithms." https://community.portfolio123.com/uploads/short-url/3WHpAUOzhCG8QAUez71HpoWnA62.pdf

[27] "Overfitting & Data-Snooping in Backtests: How to Avoid It." Surmount. https://surmount.ai/blogs/backtests-overfitting-data-snooping-avoid

[28] "The Dangers of Backtesting." Portfolio Optimization Book. https://portfoliooptimizationbook.com/book/8.3-dangers-backtesting.html

[29] "Building Cross-Sectional Systematic Strategies By Learning to Rank." arXiv:2012.07149. https://arxiv.org/pdf/2012.07149
