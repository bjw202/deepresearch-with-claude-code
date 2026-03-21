# 이벤트 기반 확률 예측 모델 비교

> Researcher 2 산출물 | 2026-03-20
> 범위: Swing Trading breakout/contraction 셋업의 확률 예측 및 랭킹 모델 아키텍처 비교

---

## 목차

- [A. 모델 아키텍처 비교](#a-모델-아키텍처-비교)
- [B. 멀티-타겟 확률 예측](#b-멀티-타겟-확률-예측)
- [C. 랭킹 모델](#c-랭킹-모델)
- [D. 검증 방법론](#d-검증-방법론)
- [E. 실제 성과 사례](#e-실제-성과-사례)
- [종합 권고](#종합-권고)

---

## A. 모델 아키텍처 비교

### A1. Gradient Boosted Trees (XGBoost, LightGBM, CatBoost)

**핵심 발견**: 금융 tabular 데이터에서 GBT 계열은 가장 안정적이고 실용적인 선택지다.

#### 성능 근거

| 연구 | 데이터셋 | GBT 성과 | 대비 모델 |
|------|---------|----------|----------|
| Atlantis Press (2026) | S&P 500 (기술+펀더멘털) | XGBoost: 연간 수익률 20.81%, MDD 2.80% | LightGBM: 19.73%, MDD 3.25% |
| SCIRP (2025) | Apple 주가 | XGBoost RMSE: 0.65 | LSTM RMSE: 3.82 (회귀 태스크) |
| thesai.org (2025) | Apple/Google/Tesla + 감성분석 | XGBoost R2: 99%/95%/88% | LSTM R2: 91%/88%/73% |
| Kaggle 대회 분석 (mlcontests.com) | 다수 tabular 대회 | GBT 계열 1위 독점 | NN은 보조 역할 |

**출처 평가**: 대부분 주가 예측(regression) 태스크이며, breakout 분류(classification) 태스크와는 차이가 있다. [인접 도메인: 주가 회귀 예측] 분류 문제에서는 feature engineering 품질이 더 큰 영향을 미칠 수 있다.

#### 강점

1. **Feature engineering 친화적**: 사용자의 기존 지표(EMA/SMA/ADR/RS/시장 regime/섹터)를 직접 입력 가능
2. **해석 가능성**: SHAP values로 "이 breakout이 왜 높은 확률로 성공 예측되는지" 개별 설명 가능
3. **과적합 방지**: early stopping, max_depth 제한, L1/L2 정규화, subsample/colsample 내장
4. **학습 속도**: 2,500종목 x 2년치 일봉 데이터는 ~125만 행 수준으로 GBT에 적합한 규모
5. **결측치 처리**: XGBoost/LightGBM은 결측치를 자동으로 처리

#### 약점

- 시계열 순서 정보를 명시적으로 활용하지 못함 (lag feature 등 수동 생성 필요)
- 패턴의 "형태"보다 수치 feature에 의존

#### 실행 연결

> **의사결정**: 1단계 모델로 LightGBM을 선택하라. 학습 속도가 XGBoost 대비 2-5배 빠르고, categorical feature 직접 처리(섹터, 시장 regime) 가능하며, 한국 증시 2,500종목 규모에서 실험 반복이 용이하다. CatBoost는 categorical이 많을 때 추가 검토.

---

### A2. MLP / Tabular 전용 딥러닝

#### TabNet

- Google 제안 (Arik & Pfister, 2021). Attention 메커니즘으로 feature selection을 학습
- 일부 벤치마크에서 XGBoost 대비 우수한 결과 (MLJAR 비교: 분류 정확도 0.9593 vs 0.92)
- **그러나**: "Tabular Data: Deep Learning is Not All You Need" (Shwartz-Ziv & Armon, 2022)에서 XGBoost가 TabNet 포함 4개 DL 모델을 대부분의 데이터셋에서 능가
- TabNet 평균 순위: 7.5/9, FT-Transformer: 1.8/9, ResNet: 3.3/9 (Innopolis 벤치마크)

**수치 투명성**: TabNet 우위를 보고한 MLJAR 비교는 단일 데이터셋 결과이며, 대규모 벤치마크에서는 재현되지 않았다. 이 수치가 틀릴 수 있는 조건: 하이퍼파라미터 튜닝 수준 차이, 데이터셋 특성.

#### FT-Transformer (Feature Tokenizer + Transformer)

- Gorishniy et al. (2021) 제안. Tabular 전용 Transformer
- 대규모 벤치마크에서 평균 순위 1.8로 DL 중 최고 성능
- GBDT와의 비교: "DL vs GBDT는 여전히 열린 문제" — 일부 데이터셋에서 GBDT 우위, 일부에서 FT-Transformer 우위
- 연산 비용이 GBT 대비 10-100배 높음

| 모델 | 평균 순위 (낮을수록 좋음) | 특징 |
|------|-------------------------|------|
| FT-Transformer | 1.8 | DL 중 최고, GBDT와 대등 |
| ResNet (tabular) | 3.3 | 강한 DL 베이스라인 |
| TabNet | 7.5 | 해석 가능하지만 성능 하위 |
| MLP | 4.8 | 여전히 유효한 sanity check |

#### 실행 연결

> **의사결정**: FT-Transformer는 GBT 앙상블의 다양성 확보용으로 2단계에서 고려하라. 1단계에서 GBT로 feature importance를 파악한 후, 중요 feature 집합에 FT-Transformer를 적용하면 앙상블 이득이 있다. TabNet은 우선순위에서 제외.

---

### A3. 시계열 딥러닝 (LSTM, TCN, Transformer)

#### LSTM

- 시계열 순서 정보를 활용하는 데 강점
- 특정 조건(단일 종목, 고변동성 구간)에서 XGBoost 대비 우수한 RMSE
- **그러나**: 금융에서 LSTM의 우위가 보편적이지 않음
  - LSTM RMSE 6.23 vs XGBoost 22.15 (ICCSM 2025) — 이 격차는 XGBoost에 시계열 feature engineering이 부재했을 가능성이 높음
  - 감성분석 통합 시 XGBoost가 LSTM을 능가 (thesai.org)

**반증 탐색**: LSTM이 GBT를 능가한다는 주장에 대해 — 다수 Kaggle 대회에서 GBT가 시계열에서도 우위. LSTM 우위 보고의 대부분은 lag feature 없는 raw price 입력 비교이며, 적절한 feature engineering을 한 GBT와의 공정 비교가 부족하다. 반증으로 볼 수 있는 근거는 충분하다.

#### Temporal Convolutional Network (TCN)

- 병렬 처리 가능, LSTM 대비 학습 속도 빠름
- COVID19-MLSF (PMC, 2023): MA-TCN으로 주가 분해 후 예측에 활용
- breakout 패턴의 수축 기간(contraction period)의 시계열 형태를 캡처하는 데 잠재력

#### 멀티타임프레임 입력

- 일봉 + 주봉 동시 입력은 두 가지 접근법으로 가능:
  1. **Feature-level 결합**: 주봉 지표를 일봉 feature로 추가 (GBT에 적합)
  2. **Sequence-level 결합**: 두 시간 해상도의 시퀀스를 별도 인코더로 처리 후 결합 (듀얼 LSTM/TCN)
- 실무적으로 Feature-level 결합이 구현 난이도 대비 효과가 높음

#### 실행 연결

> **의사결정**: LSTM/TCN은 1단계 구현에서 제외하라. GBT에 적절한 시계열 feature(lag, rolling stats, 패턴 지속 기간)를 추가하면 시계열 DL의 이점 대부분을 흡수할 수 있다. 멀티타임프레임은 주봉 지표를 일봉 feature로 병합하는 방식으로 시작하라.

---

### A4. 하이브리드 모델

#### Tree + Neural Network 앙상블

- **학술 근거**: 하이브리드 LightGBM/XGBoost + LSTM 모델이 개별 모델을 능가 (arXiv 2505.23084)
- Kaggle 우승 솔루션 분석: "LightGBM + GRU 앙상블이 1위" (M5 대회 등)
- 앙상블 방법: stacking (meta-learner), 단순 평균, weighted average

#### CNN Feature Extractor + GBM Classifier

- 가격 차트를 이미지로 변환 후 CNN으로 feature 추출, GBM으로 분류
- base.report (2023): 이미지 클러스터링으로 차트 패턴 분석 시 상승 추세 패턴의 평균 수익 1.97%
- **실용성 문제**: 이미지 변환 파이프라인 복잡도 대비 수치 feature의 정보 손실이 적음
- VCP/CWH 같은 수축 패턴은 ADR 감소율, 볼륨 감소율 등 수치로 더 효과적으로 표현 가능

#### XGBoost for Feature Selection + LSTM

- XGBoost의 feature importance로 중요 feature 선별 후 LSTM 입력 (Vuong et al., 2022)
- RMSE 4.62% 개선 (LSTM-XGBoost 조합 vs XGBoost 단독)

#### 실행 연결

> **의사결정**: 하이브리드는 2단계에서 구현하라. 1단계 GBT 모델의 성능 baseline 확보 후, GBT + FT-Transformer stacking으로 앙상블을 시도하라. CNN 이미지 기반 접근은 ROI가 낮으므로 제외.

---

## B. 멀티-타겟 확률 예측

### B1. 단일 분류 vs 다중 타겟 동시 예측

#### 단일 분류 접근

- Binary: "좋은 breakout" vs "나쁜 breakout" (예: 10일 내 +5% 도달 여부)
- 장점: 단순, 해석 용이, 충분한 학습 데이터 확보 가능
- 한계: "얼마나 좋은/나쁜 breakout인가"의 정보 손실

#### 다중 타겟 동시 예측 (Multi-Task Learning)

**핵심 발견**: MTL은 금융 예측에서 단일 모델 대비 우수한 성과를 보인다.

- NeurIPS 논문: 주식 선택에서 partial parameter sharing으로 **연간 수익률 14% 이상 개선** (vs 독립 모델)
- arXiv 1809.10336: CAPM 기반 attention으로 관련 종목을 공동 학습, 단일 종목 모델 대비 우수

**breakout 매매에 적용 가능한 다중 타겟**:

| 타겟 | 정의 | 예측 방법 |
|------|------|----------|
| 성공 확률 | N일 내 목표가 도달 확률 | Binary classification |
| MFE (Maximum Favorable Excursion) | 진입 후 최대 유리 이동폭 | Regression |
| MAE (Maximum Adverse Excursion) | 진입 후 최대 불리 이동폭 | Regression |
| 도달 시간 | 목표가 도달까지 소요일 | Regression |
| R-multiple | 실현 수익 / 초기 리스크 | Regression |

**구현 방식**:
1. **Shared-bottom MTL**: 공유 레이어 → 태스크별 헤드 (DL에 적합)
2. **Multi-output GBT**: LightGBM의 multi-output regression 또는 개별 모델 학습 후 결합
3. **MMoE (Multi-gate Mixture-of-Experts)**: 태스크별 게이트로 전문가 선택 (Google, 2018)

**수치 투명성**: MTL 14% 수익률 개선은 미국 주식 시장 데이터 기반이며, 한국 증시의 유동성/종목 수 차이로 재현되지 않을 수 있다.

#### 실행 연결

> **의사결정**: 1단계에서는 이진 분류(성공/실패)로 시작하되, MFE/MAE를 별도 regression으로 동시 학습하라. 기대값(EV) = P(성공) × E[MFE] - P(실패) × E[MAE]로 통합 점수를 산출하라. 본격적 MTL은 DL 모델 도입 시(2단계) 적용.

---

### B2. 확률 보정 (Calibration)

**왜 중요한가**: GBT의 출력 확률은 보정되지 않은 경우가 많다. 모델이 "70% 확률"이라고 한 것이 실제로 70%여야 포지션 사이징이 정확하다.

#### Platt Scaling

- 모델 출력에 로지스틱 회귀를 적용하여 보정
- 단순하고 효과적, GBT 출력에 가장 일반적
- `sklearn.calibration.CalibratedClassifierCV(method='sigmoid')`

#### Isotonic Regression

- 비모수적 보정, 더 유연하지만 과적합 위험
- 데이터가 충분할 때 (>1,000 샘플) Platt보다 우수
- `sklearn.calibration.CalibratedClassifierCV(method='isotonic')`

#### 보정 평가

- **Brier Score**: 확률 예측의 MSE (낮을수록 좋음)
- **Reliability Diagram**: 예측 확률 vs 실제 비율 시각화
- **Expected Calibration Error (ECE)**: 구간별 보정 오차의 가중 평균

#### 실행 연결

> **의사결정**: LightGBM 학습 후 반드시 Platt scaling을 적용하라. 검증 데이터에서 Reliability Diagram을 확인하고, ECE < 0.05를 목표로 하라. 보정된 확률이 EV 계산과 Kelly 기반 포지션 사이징의 전제조건이다.

---

### B3. 불균형 데이터 처리

**문제 정의**: 성공적 breakout(예: 10일 내 +10%)은 전체의 10-20% 수준으로 추정. 나머지는 실패 또는 미미한 움직임.

#### 권장 접근법 (우선순위순)

1. **Class Weight 조정**
   - `scale_pos_weight` (XGBoost) 또는 `is_unbalanced=True` (LightGBM)
   - 가장 단순하고 효과적인 1차 방법
   - 데이터 변형 없이 손실 함수 수준에서 처리

2. **임계값 조정 (Threshold Moving)**
   - 기본 0.5 대신 precision-recall 트레이드오프에 맞게 조정
   - breakout 매매에서는 높은 precision(허위 신호 최소화)이 중요

3. **Focal Loss**
   - 잘 분류된 샘플의 가중치를 줄여 어려운 샘플에 집중
   - `gamma` 파라미터로 집중도 조절 (보통 2.0)
   - GBT에서는 커스텀 loss 구현 필요

4. **SMOTE (Synthetic Minority Oversampling)**
   - 소수 클래스의 합성 샘플 생성
   - **주의**: 금융 시계열에서 SMOTE는 시간적 구조를 파괴할 수 있음
   - 적용 시 반드시 학습 데이터에만 적용, temporal split 이후

**반증 탐색**: SMOTE가 금융 데이터에서 효과적이라는 주장에 대해 — 시계열 의존성이 있는 금융 데이터에서 SMOTE의 합성 샘플은 실제로 발생 불가능한 패턴을 생성할 위험이 있다. Class weight 조정이 더 안전하다. 반증 미발견은 아니며, 이 리스크는 실재한다.

#### 실행 연결

> **의사결정**: `is_unbalanced=True`로 시작하고, threshold를 precision 기준으로 최적화하라. Focal loss는 성능 개선이 미미할 경우에만 시도. SMOTE는 시계열 특성 때문에 사용하지 않는 것을 권장한다.

---

## C. 랭킹 모델

### C1. Learning-to-Rank 접근법의 금융 적용

**핵심 발견**: LTR은 금융 자산 선택에서 전통적 회귀/분류 대비 우수한 성과를 보이며, 특히 LambdaMART가 최고 성과를 기록한다.

#### 핵심 논문: Poh et al. (2020) "Building Cross-Sectional Systematic Strategies By Learning to Rank"

- **데이터**: CRSP US 주식 (1980-2019), NYSE 상장, $1 이상, 1년 이상 가격 이력
- **결과**: LambdaMART가 profitability, ranking accuracy, risk metrics 모두에서 최고
- **성과**: Cross-sectional momentum 대비 **Sharpe Ratio 3배 개선**
- Pairwise vs Listwise: 명확한 우위 차이 없음 (금융 데이터의 낮은 SNR로 인해 listwise의 이론적 이점이 상쇄)

| 방법론 | 접근 | 대표 알고리즘 | 금융 성과 |
|--------|------|-------------|----------|
| Pointwise | 개별 점수 예측 → 정렬 | Linear regression, MLP | 하위 |
| Pairwise | 쌍 비교 학습 | RankNet, LambdaMART | **최상위** |
| Listwise | 리스트 전체 최적화 | ListNet, ListMLE | Pairwise와 대등 |

#### LambdaMART 구현

```python
# XGBoost LambdaMART 설정
params = {
    'objective': 'rank:ndcg',
    'eval_metric': 'ndcg',
    'eta': 0.01,  # 학습률
    'max_depth': 6,
    'tree_method': 'gpu_hist'
}
# qid: 날짜별 그룹 (같은 날의 breakout 후보군)
# label: 향후 수익률 기반 등급 (0-4)
```

#### Burdorf (2025) 후속 연구

- 4개 자산 클래스 (2000-2023)에서 LambdaMART 테스트
- 주식에서 특히 강한 개선, Sharpe 최대 3.4 달성
- 거래비용은 미반영 — 실전 적용 시 하락 예상

**수치 투명성**: Sharpe 3배 개선은 미국 대형주 크로스섹션 모멘텀 전략 대비 수치이며, breakout 셋업 랭킹과는 태스크가 다르다. 이 수치가 틀릴 수 있는 조건: 소형주/한국 증시에서의 유동성 제약, 거래비용 포함 시.

---

### C2. EV 기반 랭킹 vs 모델 기반 직접 랭킹

#### EV 기반 랭킹

```
EV = P(성공) × E[MFE] - P(실패) × E[MAE]
```

- **장점**: 경제적 의미가 명확, 해석 가능, 포지션 사이징과 직접 연결
- **한계**: 확률과 기대 수익/손실 예측의 오차가 곱셈으로 증폭

#### LTR 직접 랭킹

- 향후 수익률(R-multiple)을 직접 랭킹 타겟으로 사용
- **장점**: 확률 추정 불필요, end-to-end 최적화
- **한계**: "왜 이 종목이 상위인지" 설명이 어려움

#### 하이브리드 접근 (권장)

1. 확률 예측 모델로 P(성공), E[MFE], E[MAE] 추정
2. EV 점수 산출
3. LTR 모델의 출력과 EV 점수를 종합하여 최종 랭킹

#### 실행 연결

> **의사결정**: 200개 후보에서 5-10개를 고르는 파이프라인은 다음과 같이 구성하라:
> 1. **1차 필터** (rule-based): 유동성, 시장 regime, 섹터 분산 → ~50개
> 2. **2차 스코어링** (ML): EV = P(성공) × E[MFE] - P(실패) × E[MAE] → 상위 20개
> 3. **3차 랭킹** (LambdaMART 또는 수동): 상관관계, 집중도 조정 → 최종 5-10개
>
> EV 기반 접근을 우선하되, LambdaMART는 충분한 학습 데이터(최소 2,000 셋업 × 2년)가 확보된 후 도입하라.

---

## D. 검증 방법론

### D1. Walk-Forward Validation

**정의**: 시간 순서를 유지하며 학습 기간을 확장(expanding) 또는 이동(rolling)하면서 순차적으로 검증.

```
[====학습====][검증]
[=====학습=====][검증]
[======학습======][검증]
```

**구현 방법**:
- **Expanding window**: 학습 데이터 축적, regime 변화 포착에 유리
- **Rolling window**: 고정 길이 학습 창, 최근 데이터에 집중
- **권장**: 한국 증시 2년치에서는 expanding window, 학습 최소 6개월, 검증 1개월, 총 18회 fold

**한계**: 단일 경로만 테스트하므로 결과의 분산이 높음 → CPCV로 보완 필요.

---

### D2. Purged K-Fold + Embargo

**원리** (Lopez de Prado, 2018 "Advances in Financial Machine Learning"):

1. **Purging**: 검증 셋 레이블 기간과 겹치는 학습 데이터 제거
   - 예: breakout 성공 판단이 10일 보유 기반이면, 검증 셋 시작 10일 전까지의 학습 데이터 제거
2. **Embargo**: 검증 셋 직후 일정 기간의 학습 데이터도 제거 (자기상관 차단)
   - 권장: 레이블 기간의 1-2배 (10일 보유 → 10-20일 embargo)

**왜 필요한가**: 표준 K-fold는 IID 가정 위반. 20일 이동평균을 feature로 사용하면 인접 관측치 간 19/20이 중복 — 학습/검증 분리가 환상.

#### 실행 연결

> **의사결정**: 모든 ML 모델 평가에 Purged K-fold를 사용하라. embargo는 보유 기간(예: 10일)과 동일하게 설정. `mlfinlab` 또는 직접 구현 가능.

---

### D3. Combinatorial Purged Cross-Validation (CPCV)

**핵심 발견**: CPCV는 금융 ML 검증의 gold standard이며, Walk-Forward 대비 과적합 탐지 능력이 현저히 우수하다.

#### 원리

- 데이터를 S개의 동일 크기 구간으로 분할
- 조합적으로 학습/검증 분할 생성 → 다수의 독립적 백테스트 경로
- 각 경로에서 Sharpe ratio 등 성과 지표 산출
- **PBO (Probability of Backtest Overfitting)**: IS 성과 > OOS 성과인 비율

#### 성능 비교 (Arian et al., 2024 — Knowledge-Based Systems)

| 방법 | PBO (낮을수록 좋음) | DSR (높을수록 좋음) | 안정성 |
|------|-------------------|-------------------|--------|
| CPCV | **최저** | **최고** | **최고** |
| Purged K-Fold | 중간 | 중간 | 중간 |
| Walk-Forward | 높음 | 낮음 | 낮음 |
| 표준 K-Fold | 높음 | 낮음 | 낮음 |

#### pypbo 라이브러리

```python
import pypbo as pbo
import numpy as np

def metric(x):
    return np.sqrt(252) * x.mean() / x.std()  # 연간화 Sharpe

pbox = pbo.pbo(
    returns_df,        # 전략별 수익률 DataFrame
    S=16,              # 구간 수 (16-32 권장)
    metric_func=metric,
    threshold=0.0,     # OOS Sharpe > 0 기준
    n_jobs=4
)
# PBO < 0.5이면 과적합 위험 낮음
```

**수치 투명성**: S=16 권장은 Lopez de Prado의 원 논문 기준이며, 데이터 길이가 짧으면 (2년) 각 구간이 ~1.5개월로 너무 짧아질 수 있다. 이 경우 S=8-10이 현실적.

---

### D4. 한국 증시에서의 현실적 검증 전략

**2,500종목 × 2년치 제약 조건**:

| 요소 | 수치 | 의미 |
|------|------|------|
| 총 거래일 | ~500일 | Walk-Forward 18회 가능 (6개월 학습 + 1개월 검증) |
| breakout 셋업 수 | ~5,000-15,000 (추정) | 종목당 2-6개/년 |
| 성공 breakout | ~1,000-3,000 (추정) | 20% 성공률 기준 |
| CPCV 경로 수 | S=8이면 C(8,4)=70 경로 | 통계적으로 충분 |

**권장 검증 파이프라인**:

1. **개발 단계**: Purged 5-Fold (빠른 반복)
2. **선택 단계**: CPCV (S=8, PBO < 0.5 확인)
3. **최종 검증**: Walk-Forward (최근 6개월 OOS)
4. **과적합 진단**: PBO + Deflated Sharpe Ratio

---

### D5. 거래비용/슬리피지 포함 시 성과 변화

**한국 증시 비용 구조**:

| 항목 | 비용 |
|------|------|
| 매수 수수료 | 0.015% (온라인 기준) |
| 매도 수수료 | 0.015% |
| 매도 세금 | 0.18% (2026년 기준) |
| 슬리피지 | 0.1-0.3% (소형주 더 높음) |
| **편도 총비용** | **~0.2-0.5%** |
| **왕복 총비용** | **~0.4-1.0%** |

- 연 50회 매매 시 비용만 20-50% (자본 대비)
- **결론**: 모든 백테스트에 왕복 0.5% 이상의 비용을 반영하라. 비용 미반영 성과는 의미 없음.

---

## E. 실제 성과 사례

### E1. 학술 논문의 breakout/pattern 기반 ML 예측

| 연구 | 방법 | 결과 | 한계 |
|------|------|------|------|
| PRML (PMC, 2021) | 2일 캔들스틱 패턴 ML | 연 36.73% 수익, Sharpe 0.81 | 거래비용 미반영, 특정 시장/기간 |
| SVM breakout 탐지 (Faktor Exacta) | SVM + 기술적/펀더멘털 | Precision 0.08→0.18 (개선 후에도 매우 낮음) | Recall 0.05 — 대부분의 breakout 미포착 |
| base.report 차트 패턴 (2023) | 이미지 클러스터링 | 상승 패턴 평균 수익 1.97% | 통계적 유의성 미검증 |
| ANN breakout (IJSAT, 2026) | ANN + SMA/EMA/MACD/RSI | breakout 식별 | 수익률 미보고 |

**핵심 관찰**: 학술 논문에서 보고된 breakout 예측의 실전 수익성은 대부분 검증이 불충분하다. Precision이 낮거나, 거래비용이 미반영되거나, 통계적 유의성이 부족하다.

### E2. Kaggle/Competition 분석

| 대회 | 우승 솔루션 | 핵심 인사이트 |
|------|------------|-------------|
| M5 Forecasting | LightGBM + GRU 앙상블 | 시계열 horizon별 별도 모델 학습 |
| Jane Street Market Prediction | NN + GBT 앙상블 | 금융 특화 feature engineering 핵심 |
| Two Sigma Financial Modeling | GBT 기반 | Feature engineering > 모델 복잡도 |
| Optiver Stock Return | 하이브리드 ML | 주문장 feature 활용 |
| American Express Default | CatBoost/XGBoost | 시계열 tabular에서 GBT 압도적 |

**패턴**: Kaggle 금융/tabular 대회에서 GBT가 지배적이며, NN은 앙상블의 일부로 0.5-2%의 추가 성능을 제공하는 역할.

### E3. 실전 적용 시 논문 성과와의 괴리

**괴리 원인**:

1. **데이터 스누핑**: 수천 개의 전략/파라미터를 시도한 후 최선만 보고
2. **거래비용 미반영**: 왕복 0.5-1.0% 비용이 미반영 시 실제 성과 대비 연 25-50% 과대 추정
3. **슬리피지**: breakout 시점의 급격한 가격 변동으로 의도한 가격에 체결 불가
4. **시장 영향**: 동일 전략의 확산 시 알파 감소 (capacity 제약)
5. **Regime 변화**: 학습 기간의 시장 환경이 미래에 재현되지 않음
6. **Look-ahead bias**: 의도하지 않은 미래 정보 유출

**관점 확장**: 논문 성과 괴리보다 더 중요한 숨은 변수는 **"전략 수명(strategy decay)"**이다. 새로운 알파가 발견되어도 시장 참여자들의 학습으로 6-18개월 내에 소멸하는 경향이 있다. 지속적인 모델 업데이트와 새로운 feature 발굴이 필수적이다.

---

## 종합 권고

### 모델 아키텍처 로드맵

```
[1단계: Baseline]          [2단계: Enhancement]       [3단계: Advanced]
LightGBM 단일 모델    →    LightGBM + FT-Transformer  →  LTR (LambdaMART)
+ Platt scaling             Stacking 앙상블              + MTL (shared-bottom)
+ class weight              + CPCV 검증                  + 온라인 학습
+ EV 기반 랭킹              + EV + LTR 하이브리드         + 강화학습 실행
```

### 모델 선택 근거 신뢰도

| 주장 | 근거 강도 | 도메인 일치도 | 검증 필요 여부 |
|------|----------|-------------|-------------|
| GBT가 tabular 금융 데이터에서 최고 | 강함 | 높음 (주가 예측) | 낮음 |
| LambdaMART가 자산 랭킹에서 최고 | 강함 | 중간 (모멘텀 전략) | breakout 적용 검증 필요 |
| CPCV가 Walk-Forward보다 우수 | 강함 | 높음 (금융 ML) | 낮음 |
| MTL이 단일 태스크보다 우수 | 중간 | 중간 (미국 주식) | 한국 증시 검증 필요 |
| SMOTE가 금융에서 위험 | 중간 | 높음 (시계열 특성) | 경험적 확인 권장 |
| 하이브리드가 단일 모델보다 우수 | 강함 | 높음 (Kaggle/학술) | 구현 복잡도 대비 이득 확인 |

### 문제 재정의

원래 질문 "최적 모델 아키텍처는 무엇인가?"보다 더 적절한 핵심 질문:

> **"주어진 데이터(2,500종목 × 2년치 일봉)에서 과적합 없이 통계적으로 유의미한 예측력을 가진 모델을 어떻게 검증할 수 있는가?"**

모델 아키텍처 선택보다 **검증 방법론의 엄격성**이 최종 성과를 더 크게 좌우한다. CPCV + PBO < 0.5를 통과하지 못하는 모델은 아무리 학습 성과가 좋아도 실전에서 실패할 가능성이 높다.

### 관점 확장: 숨은 변수

1. **Feature engineering의 질**: 모델 아키텍처 차이보다 VCP/CWH 패턴을 얼마나 정확하게 수치화하느냐가 성과에 더 큰 영향. "수축률", "거래량 위축 기울기", "N자 구조의 대칭성" 등 도메인 지식 기반 feature가 핵심.
2. **레이블링 전략**: "성공적 breakout"의 정의 자체가 모델 성능을 결정. Triple barrier method (Lopez de Prado)로 상방/하방/시간 기준 동시 적용 권장.

---

## 출처 목록

1. Atlantis Press (2026). "Predicting Stock Returns Using Machine Learning" - S&P 500 XGBoost vs LightGBM
2. ICCSM 2025. "Comparative Study on Stock Price Prediction: LSTM vs XGBoost"
3. thesai.org (2025). "A Deep Learning-Based LSTM for Stock Price Prediction Using Sentiment Analysis"
4. arXiv:2505.23084 (2025). "Gradient Boosting Decision Tree with LSTM for Investment Prediction"
5. Shwartz-Ziv & Armon (2022). "Tabular Data: Deep Learning is Not All You Need"
6. Gorishniy et al. (2021). "Revisiting Deep Learning Models for Tabular Data" (FT-Transformer)
7. Poh et al. (2020). "Building Cross-Sectional Systematic Strategies By Learning to Rank" [arXiv:2012.07149]
8. Quantitativo (2025). "Learning to Rank" - LambdaMART 전략 분석
9. Lopez de Prado (2018). "Advances in Financial Machine Learning" - Purged K-Fold, CPCV
10. Bailey et al. (2015). "The Probability of Backtest Overfitting" - PBO framework
11. Arian et al. (2024). "Backtest Overfitting in the Machine Learning Era" - CPCV vs Walk-Forward 비교
12. NeurIPS. "Multi-Task Learning for Stock Selection" - MTL 14% 수익률 개선
13. PMC (2021). "Improving Stock Trading Decisions Based on Pattern Recognition" - PRML 36.73%
14. base.report (2023). "Do Chart Patterns Matter?" - ML 차트 패턴 분석
15. mlcontests.com. "Tabular Data Competitions - Winning Strategies" - GBT 지배적
16. pypbo GitHub (esvhd/pypbo). PBO Python 구현
17. MQL5 (2025). "Unified Validation Pipeline Against Backtest Overfitting" - Purged WF 구현
