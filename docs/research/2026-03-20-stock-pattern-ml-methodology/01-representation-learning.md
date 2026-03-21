# 금융 시계열 표현학습 및 패턴 인식 방법론

> Researcher 1 — 2026-03-20

---

## 요약

Swing Trading에서 변동성 수축/눌림목 패턴(VCP, CWH, HTF, W-bottom 등)을 ML로 인식하기 위한 표현학습 방법론을 조사했다. 핵심 발견은 다음과 같다:

1. **Self-supervised learning은 금융 시계열에서 라벨 부족 문제를 해결할 수 있는 유력한 접근이지만, 금융 도메인 직접 적용 사례는 아직 제한적이다.**
2. **2D 차트 이미지(CNN/ViT)가 1D 시계열보다 패턴 인식에서 우위를 보이는 연구들이 있으나, 과적합 리스크가 크고 일반화 검증이 부족하다.**
3. **시계열 Foundation Model(Chronos, TimesFM 등)은 금융 zero-shot에서 성능이 낮지만, fine-tuning으로 개선 가능하다. 다만 패턴 "분류"가 아닌 "예측"에 최적화되어 있다.**
4. **실행 권고: Contrastive learning(TS2Vec 계열) + 1D-CNN/TCN 조합으로 시작하고, 2D 이미지는 보조 시그널로 활용하는 것이 현실적이다.**

---

## A. Self-Supervised Learning for Financial Time Series

### A.1 방법론 분류

SSL for time series는 크게 3가지로 분류된다 \[arXiv:2306.10125, IEEE TPAMI 2024\]:

| 카테고리 | 대표 방법 | 핵심 아이디어 |
| --- | --- | --- |
| **Contrastive-based** | TS2Vec, TS-TCC, CoST, TimeCLR, TF-C | 같은 시계열의 augmentation을 가깝게, 다른 시계열을 멀게 학습 |
| **Generative-based** | MAE, ExtraMAE, SimMTM, VisionTS | 마스킹된 시계열을 복원하며 구조 학습 |
| **Adversarial-based** | TimeGAN 등 | 생성-판별 적대적 학습 |

### A.2 금융 적용 사례 및 가능성

#### Contrastive Learning 계열

- **TS2Vec** \[Yue et al., 2022\]: 시계열의 hierarchical contrastive learning. 타임스탬프 레벨과 인스턴스 레벨의 대조학습을 동시 수행. 범용 시계열 표현을 생성하며, 분류/예측/이상탐지에서 SOTA 달성.

  - 금융 직접 적용 사례: 공식 논문에서 금융 데이터셋(Yahoo Finance) 포함하여 평가. 분류 정확도 기준 기존 supervised 대비 competitive.
  - **의사결정 연결**: 2,500종목의 OHLCV 데이터로 TS2Vec pre-training 후, 소량의 패턴 라벨로 fine-tuning하는 전략이 가능. 라벨링 비용을 크게 절감할 수 있다.

- **TF-C (Time-Frequency Consistency)** \[Zhang et al., 2022, NeurIPS\]: 시간-주파수 도메인 간 일관성을 학습. 시간 도메인과 주파수 도메인 임베딩을 결합하여 downstream task에 활용.

  - TS2Vec과 TS-TCC를 능가하는 성능 보고.
  - **패턴 인식 관점**: VCP 같은 패턴은 주파수 도메인에서 "고주파 진폭 감소" 시그널로 포착 가능. TF-C의 주파수 branch가 이를 자연스럽게 학습할 수 있다.

- **TNC (Temporal Neighborhood Coding)** \[Tonekaboni et al., 2021\]: ADF 검정으로 stationary region을 식별하고, 시간적 이웃 관계를 활용한 contrastive learning.

  - 금융 시계열의 non-stationarity 문제를 직접 다룬다는 점에서 의미 있음.
  - \[인접 도메인: 의료 시계열\] 원래 ICU 센서 데이터에서 개발. 금융 시계열은 의료보다 noise-to-signal ratio가 훨씬 높아 성능 차이 예상.

#### Masked Autoencoder 계열

- **ExtraMAE** \[arXiv:2201.07006\]: 마스킹 후 extrapolation으로 시계열 생성. Stock 데이터셋에서 실험 수행.

  - 시각화, 판별, 예측 점수 모두에서 주식 데이터 적용 가능성 확인.

- **SimMTM** \[NeurIPS 2023\]: 마스킹된 시점을 manifold 상의 이웃 가중 평균으로 복원. Cross-domain transfer에서 기존 pre-training 대비 우수.

  - **의사결정 연결**: 다른 도메인(에너지, 교통)에서 pre-training 후 금융으로 transfer하는 전략 검증 가능.

- **VisionTS** \[ICML 2025\]: 1D 시계열을 2D 이미지로 변환하여 MAE 기반 ImageNet pre-trained 모델 활용. Zero-shot으로 시계열 foundation model 대비 MSE 6-84% 감소.

  - **주의**: 주기적/추세적 패턴에 강하나, 금융 시계열의 비정상적 구조에서는 과적합 위험.

### A.3 "차트 구조" 학습이 downstream 성능에 기여하는가?

**긍정적 증거:**

- TS2Vec의 계층적 표현은 downstream 분류에서 supervised 대비 competitive한 성능 달성
- TF-C의 cross-domain transfer 실험에서 pre-training이 일관되게 성능 향상
- ExtraMAE가 stock 데이터에서 유의미한 표현 학습 확인

**부정적/제한적 증거:**

- 금융 시계열은 signal-to-noise ratio가 낮아, 학습된 "구조"가 noise일 가능성 상존
- 대부분의 SSL 벤치마크는 분류/예측 정확도 기준이며, "특정 차트 패턴 인식"을 직접 평가한 연구는 미발견
- 반증 미발견: SSL이 금융 패턴 인식에서 명시적으로 실패했다는 연구도 없음 (연구 자체가 적음)

**의사결정**: SSL pre-training은 "해서 손해 볼 것이 없는" 전략이다. 다만, downstream task 설계(어떤 패턴을 어떤 기준으로 라벨링할 것인지)가 SSL 자체보다 더 중요하다.

---

## B. 데이터 표현 방식 비교

### B.1 1D 시계열 Feature (OHLCV + 기술지표)

**방식**: OHLCV 데이터와 이동평균, RSI, ATR, 볼린저 밴드 등 기술지표를 직접 모델 입력으로 사용.

| 장점 | 단점 |
| --- | --- |
| 정보 손실 없음 (원본 수치 보존) | Feature engineering 의존 (어떤 지표를 넣느냐에 따라 성능 좌우) |
| 연산 효율적 | 시각적 "패턴"을 직접 포착하지 못함 |
| 멀티스케일 분석 용이 (일봉/주봉 concat) | 지표 간 상관관계로 다중공선성 문제 |

- **성능 기준**: LSTM 단독으로 TX 데이터셋에서 52-62% 방향 예측 정확도 \[Nature 2025, arXiv:2501.12239\].
- 1D-CNN으로 차트 패턴 분류: 직접 시계열 입력으로 패턴(H&S, double bottom 등) 분류 가능 \[Semantic Scholar: Liu & Si\].

### B.2 2D 차트 이미지 (CNN/ViT)

**방식**: OHLCV를 캔들차트 이미지로 렌더링하여 CNN 또는 Vision Transformer로 분석.

| 장점 | 단점 |
| --- | --- |
| 시각적 패턴을 직접 학습 (사람 트레이더의 인식 방식과 동일) | 정보 손실 (렌더링 해상도, 색상 인코딩에 의존) |
| Feature engineering 불필요 | 연산 비용 높음 (이미지 처리) |
| Pre-trained 모델(ImageNet) 활용 가능 | 과적합 위험 높음 (특히 짧은 윈도우) |
| Grad-CAM으로 해석 가능 | 볼륨, 지표 등 추가 정보 인코딩이 어려움 |

**핵심 성과:**

- **DPP (Deep Predictor for Price)**: TX 데이터셋에서 2D 캔들차트 CNN으로 80.82% 정확도 달성. LSTM(52-62%) 대비 20-30% 우위 \[Nature 2025\].
- **ViT + Self-supervised (Stanford 2025)**: 캔들차트 이미지에 ViT + MAE(masked autoencoder)를 적용. Self-supervised로 학습한 후 패턴을 클러스터링하여 백테스트. "Transformers are able to learn effective representations of the market through candlestick charts."
- **CNN 기반 추세 분류**: 상승/하락 추세 분류에서 Precision 91-93%, F1 92-93% 달성 \[ASTRJ 2025\].
- **Hybrid OHLCT CNN**: 이미지 + 시계열 결합으로 A-shares 4,454종목에서 61-63% 정확도 (5일 예측).

**주의 사항:**

- 5일 윈도우 CNN &gt; 20/60일 윈도우 CNN (긴 윈도우에서 과적합 증가)
- 단일 종목 학습 모델의 다른 종목 일반화율: 0.3% (LSTM) — 거의 불가 수준
- 높은 정확도 수치들은 in-sample 또는 제한된 out-of-sample에서의 결과일 가능성

### B.3 Attention 기반 (Transformer)

**방식**: 시계열을 패치(patch)로 분할하여 Transformer에 입력. Self-attention으로 장기 의존성 학습.

| 장점 | 단점 |
| --- | --- |
| 장기 의존성 포착 (수백일 패턴) | 데이터 요구량 많음 |
| Positional encoding으로 시간 구조 학습 | 짧은 시계열에서 CNN 대비 이점 없음 |
| Multi-head attention으로 다중 패턴 동시 포착 | 해석 어려움 |
| Patching으로 연산 효율 개선 (PatchTST 등) | Pre-training 없이는 소규모 데이터에서 성능 저조 |

- **CNN+Transformer 융합**: CNN으로 로컬 피처 추출 + Transformer로 시간 의존성 학습. 4개 종목에서 LSTM 대비 오차율 32-45% 감소 \[Nature 2025\].
- PatchTST 계열: 시계열을 패치로 분할하여 Transformer 입력. 채널 독립 처리로 multivariate에서도 효과적.

### B.4 패턴 인식 목적 비교 종합

| 기준 | 1D 시계열 | 2D 차트 이미지 | Transformer |
| --- | --- | --- | --- |
| **VCP/CWH 같은 시각 패턴** | 간접 (지표 기반) | **직접 포착** | 간접 (패치 기반) |
| **라벨 효율** | 낮음 | 중간 (SSL 가능) | 높음 (SSL/Foundation) |
| **일반화** | 중간 | **낮음** (과적합 위험) | 높음 (pre-training 시) |
| **멀티스케일** | 용이 | 어려움 | 용이 (패치 크기 조절) |
| **실행 복잡도** | **낮음** | 높음 | 중간 |
| **2,500종목 확장성** | **좋음** | 보통 (이미지 생성 비용) | 좋음 |

**권고**: 패턴 인식 목적에서는 **1D-CNN/TCN을 주(primary) 모델로, 2D 이미지를 보조(auxiliary) 시그널로** 활용하는 이중 전략이 리스크-성능 균형에 최적이다. Transformer는 pre-trained foundation model을 feature extractor로 활용.

---

## C. 특정 차트 패턴 인식을 위한 아키텍처

### C.1 VCP (Volatility Contraction Pattern) ML 인식

VCP의 수학적 정의 \[Mark Minervini\]:

- 2-6회 연속 pullback, 각 수축폭 감소 (예: 20% -&gt; 10% -&gt; 5%)
- 볼륨 감소 동반
- 최종 breakout 시 볼륨 급증

**ML 접근법 (문헌 기반 + 추론):**

직접 VCP를 ML로 인식한 학술 논문은 발견되지 않았다. 그러나 유사 패턴(Cup-with-Handle, Head-and-Shoulders, W-bottom)에 대한 연구에서 방법론을 차용할 수 있다:

1. **규칙 기반 특징 추출 + ML 분류기**: 수축폭 비율 (r_n = (H\_{n-1} - L_n) / H\_{n-1}), ATR 변화율, 볼륨 프로파일을 특징으로 추출한 후 분류.
2. **1D-CNN 직접 학습**: OHLCV 시퀀스를 1D-CNN에 입력하여 패턴 존재 여부를 end-to-end 학습.
3. **Object Detection (YOLO 계열)**: 차트 이미지에서 패턴 영역을 bounding box로 탐지 \[ACM 2023\].

### C.2 아키텍처별 패턴 인식 비교

| 아키텍처 | 패턴 인식 강점 | 약점 | 추천 용도 |
| --- | --- | --- | --- |
| **1D-CNN** | 로컬 패턴(수축, 돌파) 포착에 강함. 연산 효율적 | 장기 구조 포착 약함 | VCP의 개별 수축 인식 |
| **TCN** | Dilated convolution으로 넓은 수용장. 인과적 구조 보장 | 매우 긴 의존성에서는 한계 | VCP 전체 구조 (60-120일) 인식 |
| **LSTM/GRU** | 시퀀스 의존성 학습. 가변 길이 입력 | 장기 의존성 소실. 병렬화 불가 | 보조 특징 추출기 |
| **Transformer** | 장기 의존성. Multi-head로 다중 패턴 | 데이터 요구량. 위치 무관 | Foundation model backbone |

**실제 성능 비교 (차트 패턴 분류):**

- CNN 기반 trend 분류: 91-93% precision \[ASTRJ 2025\]
- Deep learning (H&S, double top, rounded bottom 포함 5-class): 94.9% accuracy, 94.85% F1 \[Heliyon 2024\]
- LSTM 패턴 인식 recall: 0.97이나 일반화 0.3% — 사실상 종목별 모델 필요 \[Intrinio 분석\]
- 2D-CNN 패턴 인식 recall: 0.73, 1D-CNN: 0.64 — sparse matrix 문제 \[같은 출처\]

### C.3 멀티스케일 분석

**일봉 + 주봉 동시 활용의 효과:**

- Multi-Scale CNN \[arXiv:1603.06995\]: 서로 다른 커널 크기의 CNN branch를 병렬로 두어 다중 스케일 패턴 포착. 시계열 분류에서 단일 스케일 대비 유의미한 개선.

- **실행 방안**:

  - Branch 1: 일봉 5-20일 (단기 수축 탐지)
  - Branch 2: 일봉 20-60일 (전체 VCP 구조)
  - Branch 3: 주봉 4-12주 (상위 추세 확인)
  - 각 branch 출력을 concat 후 분류 헤드

- **Graph Transformer 접근** \[Kumo AI\]: 종목 간 관계를 그래프로 표현하여 섹터/산업 내 공통 패턴 학습. Calendar encoding으로 계절성 반영.

  - \[이질 도메인: 소셜 네트워크 분석\] 노드(종목) 간 관계 학습은 소셜 네트워크의 커뮤니티 탐지와 구조적으로 동일. 섹터 내 패턴 전파를 포착하는 데 차용 가능.

---

## D. Foundation Model / Pre-trained Model

### D.1 주요 시계열 Foundation Model 현황

| 모델 | 개발처 | 아키텍처 | 파라미터 | 금융 데이터 포함 | 특징 |
| --- | --- | --- | --- | --- | --- |
| **Chronos** | Amazon | Decoder-only Transformer | \~710M (large) | 없음 | 토큰화 기반. 금융 fine-tuning 연구 존재 |
| **TimesFM** | Google | Decoder-only Transformer | 200M/500M | M4 (제한적) | 연속값 직접 예측 |
| **Moirai** | Salesforce | Masked Encoder Transformer | 다양 | Monash(Bitcoin 등) | MoE로 65x 적은 활성 파라미터 |
| **Moirai-MoE** | Salesforce | Mixture-of-Experts | — | 동일 | Zero-shot에서 TimesFM, Chronos 대비 최대 17% 우위 |
| **Lag-Llama** | McGill/Mila | LLaMA 기반 | — | 없음 | 확률적 예측. Open-source |
| **Toto** | Datadog/CMU | Decoder-only Transformer | — | Monash(제한적) | Student-t 분포 출력. 2,360B obs. pre-training |
| **TTM** | IBM | MLP/TSMixer | 1-5M | Bitcoin(제한적) | 경량. CPU 추론 가능 |

출처: \[arXiv:2511.18578v1 — Re(Visiting) Time Series Foundation Models in Finance\]

### D.2 금융 Zero-shot vs Fine-tuning 성능

\[arXiv:2511.18578v1\]의 금융 데이터 벤치마크:

| 모델 | Zero-shot R² (window=512) | 방향 정확도 | Fine-tuning 후 |
| --- | --- | --- | --- |
| **Chronos (large)** | \-1.37% | \~51% | R² -0.59% (small, fine-tuned) |
| **TimesFM (500M)** | \-2.80% | &lt;50% | 윈도우/사이즈에 비례 개선 |
| **Moirai** | 직접 벤치마크 없음 | — | — |

**핵심 발견:**

- Zero-shot으로는 금융 시계열 예측이 사실상 불가 (R² 음수 = 평균 예측보다 나쁨)
- Fine-tuning으로 소폭 개선되나, 여전히 R²가 음수
- Chronos (small) + 금융 factor + data augmentation으로 방향 정확도 51.74% 달성 — CatBoost 대비 소폭 우위
- **이 수치가 틀릴 수 있는 조건**: 벤치마크가 excess return 예측 기준. 패턴 인식(분류)에서는 다른 결과 가능.

### D.3 2,500종목 x 2년 데이터 규모에서의 현실성

**데이터 규모 추정:**

- 2,500종목 x 500거래일(2년) = 1,250,000 시계열 포인트 (종목별)
- OHLCV 5차원 x 1,250,000 = 6,250,000 데이터 포인트 (총)
- Foundation model pre-training 데이터 대비: Chronos 100B, TimesFM 100B vs 우리 \~6M — **0.006% 수준**

**Fine-tuning 전략별 현실성:**

| 전략 | 현실성 | 장점 | 단점 |
| --- | --- | --- | --- |
| **Foundation model zero-shot** | 높음 (즉시 사용) | 추가 학습 불필요 | 금융에서 성능 부족 |
| **Foundation model fine-tuning** | 높음 | Pre-trained 지식 활용 | 패턴 분류가 아닌 예측에 최적화 |
| **SSL pre-training + fine-tuning** | **권장** | 도메인 특화 표현 학습 | SSL 설계 필요 |
| **From-scratch training** | 중간 | 완전 맞춤화 | 데이터 부족 리스크 |

**권고:**

1. **1차**: TS2Vec 또는 TF-C로 2,500종목 OHLCV 데이터에 SSL pre-training (라벨 불필요)
2. **2차**: 학습된 표현 위에 소량의 수동 라벨(VCP, CWH 등 100-500개)로 패턴 분류기 fine-tuning
3. **대안**: Chronos/TimesFM을 feature extractor로 사용하여 임베딩 추출 후, 별도 분류기 학습

---

## E. 실행 권고 및 의사결정 가이드

### E.1 추천 아키텍처 로드맵

```
Phase 1 (MVP, 2-4주):
  - 1D-CNN/TCN + 규칙 기반 특징 (수축폭, 볼륨 변화율)
  - Supervised learning with 수동 라벨 200-500개
  - 단일 패턴(VCP)부터 시작

Phase 2 (확장, 4-8주):
  - TS2Vec/TF-C로 SSL pre-training (2,500종목)
  - Multi-scale branch (일봉 단기 + 중기 + 주봉)
  - 패턴 확장 (CWH, HTF, W-bottom)

Phase 3 (고도화, 선택):
  - Foundation model 임베딩을 추가 feature로 통합
  - 2D 차트 이미지를 보조 시그널로 추가
  - Ensemble: 1D feature + 2D image + Foundation embedding
```

### E.2 역방향 의사결정 가이드

| 결과 | 조정 |
| --- | --- |
| 라벨링 비용이 패턴당 100개 이상 확보 불가 | → SSL pre-training 우선. Zero-shot 클러스터링으로 패턴 후보 생성 |
| 1D-CNN 정확도 &lt; 60% | → 2D 이미지 branch 추가 또는 Multi-scale 적용 |
| 과적합 발생 (train &gt;&gt; val 성능) | → Data augmentation (시간 워핑, 노이즈 주입). SSL pre-training 강화 |
| 특정 종목에서만 작동 | → Graph-based 접근으로 종목 간 패턴 전이 학습 |
| 백테스트에서 수익률 미달 | → 패턴 인식 자체보다 breakout 후 가격 행동 예측 모델 추가 필요 |

### E.3 관점 확장: 숨은 변수

1. **라벨 정의의 모호성**: VCP의 "수축 횟수"나 "충분한 볼륨 감소"의 기준이 트레이더마다 다르다. ML 모델의 성능 상한은 라벨 품질에 의해 결정된다. **이것이 아키텍처 선택보다 더 중요한 변수일 수 있다.**

2. **생존 편향**: 성공적으로 breakout한 VCP만 라벨링하면, 실패한 VCP(fake breakout)를 모델이 학습하지 못한다. 부정 샘플의 품질이 모델 실용성을 결정한다.

### E.4 문제 재정의

> 원래 질문: "어떤 표현학습/아키텍처가 차트 패턴 인식에 최적인가?"
> ****더 적절한 핵심 질문: "패턴 인식 정확도가 아닌, 패턴 인식 후 수익성 있는 트레이딩으로 연결되는 전체 파이프라인에서 어떤 표현이 가장 높은 risk-adjusted return을 만드는가?"**

패턴을 정확히 인식하는 것과 수익을 내는 것은 별개의 문제이다. 인식 정확도 90%라도 false positive에서의 손실이 true positive에서의 수익을 초과하면 무의미하다. 따라서 표현학습 선택 시 precision/recall tradeoff를 수익 관점에서 최적화해야 한다.

---

## F. 근거 신뢰도 정리

| 주장 | 출처 | 도메인 일치 | 확신도 | 검증 필요 |
| --- | --- | --- | --- | --- |
| TS2Vec이 범용 시계열 표현에서 SOTA | AAAI 2022 논문 | 범용 (금융 포함) | 높음 | 금융 패턴 분류 직접 평가 필요 |
| 2D CNN이 1D LSTM 대비 20-30% 우위 | Nature 2025, TX 데이터셋 | 금융 직접 | 중간 | 다른 시장, 패턴에서 재현 필요 |
| Foundation model zero-shot 금융 R² 음수 | arXiv:2511.18578 | 금융 직접 | 높음 | excess return 외 다른 task에서 확인 |
| VCP ML 인식 선행 연구 없음 | 검색 기반 | — | 중간 | 비공개/산업 연구 존재 가능 |
| 멀티스케일 CNN이 단일 스케일 대비 우수 | arXiv:1603.06995 | 범용 시계열 | 중간 | 금융 패턴 직접 평가 필요 |
| 패턴 분류기 일반화율 0.3% (LSTM) | Intrinio 블로그 | 금융 직접 | 낮음 (비학술) | 학술 연구로 검증 필요 |

---

## 참고 문헌

 1. Yue et al., "TS2Vec: Towards Universal Representation of Time Series," AAAI 2022
 2. Zhang et al., "Self-Supervised Contrastive Pre-Training for Time Series via Time-Frequency Consistency," NeurIPS 2022
 3. Tonekaboni et al., "Unsupervised Representation Learning for Time Series with Temporal Neighborhood Coding," ICLR 2021
 4. arXiv:2306.10125 — "Self-Supervised Learning for Time Series Analysis: Taxonomy, Progress, and Prospects"
 5. IEEE TPAMI 2024 — "Self-Supervised Learning for Time Series Analysis: Taxonomy..."
 6. arXiv:2511.18578v1 — "Re(Visiting) Time Series Foundation Models in Finance"
 7. Stanford CVPR Workshop 2025 — "Learning Predictive Candlestick Patterns: Vision Transformers for Technical Analysis"
 8. Nature 2025 — "Stock market trend prediction using deep neural network via chart analysis"
 9. arXiv:2501.12239 — "Investigating Market Strength Prediction with CNNs on Candlestick Charts"
10. ASTRJ 2025 — "Image-based time series trend classification using deep learning"
11. Heliyon 2024 — "An explainable deep learning approach for stock market trend prediction"
12. arXiv:2201.07006 — "Time Series Generation with Masked Autoencoder (ExtraMAE)"
13. NeurIPS 2023 — "SimMTM: A Simple Pre-Training Framework for Masked Time-Series Modeling"
14. ICML 2025 — "VisionTS: Visual Masked Autoencoders Are Free-Lunch Zero-Shot Time Series Forecasters"
15. arXiv:1603.06995 — "Multi-Scale Convolutional Neural Networks for Time Series Classification"
16. github.com/qingsongedu/Awesome-SSL4TS — SSL for Time Series curated list
17. Kumo AI — "Time Series Forecasting with Graph Transformers"
18. ACM 2023 — "Object Detection Approach for Stock Chart Patterns Recognition"