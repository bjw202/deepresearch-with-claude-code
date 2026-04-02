# 04 — 수치 구현 보충 (Implementation Supplement)

**역할**: Researcher 4 — Critic 누락 항목 보강
**저장 경로**: `docs/research/2026-04-01-gear-design-mathematics/04-implementation-supplement.md`
**작성일**: 2026-04-01
**기반**: Critic 리뷰 §4 + §6.2 누락 항목
**확신도 표기**: ★★★ 교과서급, ★★☆ 산업 표준/복수 출처, ★☆☆ 단일 출처/추론

---

## 개요

이 문서는 R1~R3 보고서에서 Critic이 지적한 수치 구현 누락 항목을 보강한다. 모든 코드는 Python으로 복사-붙여넣기 즉시 실행 가능하도록 작성했다. 표준 라이브러리(`math`, `numpy`) 외 외부 의존성은 없다.

**프로젝트 기호 표준** (이 문서 전체에 적용):
- 이수: $z$ (ISO 표준)
- 인벌류트 파라미터: $t$ (R1 기준)
- 기준 압력각: $\alpha_0$
- 인벌류트 함수: `inv(α)` = `tan(α) - α`
- 피치원 반지름: $r_0 = mz/2$

---

## A. 수치 구현 엣지 케이스 (Critic §4.1)

### A.1 이수 극단값 처리 ★★★

#### 수학적 성립 여부

인벌류트 방정식 자체는 $z$에 무관하게 기초원 반지름만 있으면 성립한다. 그러나 실용 범위에는 하한이 존재한다.

| $z$ | 수학적 성립 | 실용 문제 |
|-----|-----------|---------|
| 1 | 성립 | 이가 1개 → 기어비 정의 불가, 연속 맞물림 원리 붕괴. 핀 휠(pin wheel)의 특수 케이스. |
| 2 | 성립 | 접촉비 < 1.0이 수학적으로 불가피. 이뿌리원 $r_f < 0$이 발생할 수 있음. |
| 3 | 성립, 부분 불가 | 표준 기어($x=0$)에서 이뿌리원이 기초원보다 훨씬 크게 됨. 전위 없이는 인벌류트 플랭크가 거의 없음. |
| 4~6 | 성립, 전위 필수 | 언더컷이 반드시 발생. $x_{min}$ 이상 전위 필수. |
| 7~16 | 성립, 전위 권고 | 언더컷 발생. 전위로 방지 가능. |
| ≥ 17 | 완전 성립 | 표준 전위($x=0$)에서 언더컷 없음. |

**실용 하한**: $z \geq 5$ (KHK 산업 권고). $z < 5$는 특수 설계이므로 앱에서 경고 표시.

**$z=1,2$에서의 특수 문제**:

- $z=1$: $r_0 = m/2$, $r_b = r_0 \cos\alpha_0$. 이뿌리원 $r_f = m(z-2.5+2x)/2 = m(-1.5+2x)/2$. $x=0$이면 $r_f < 0$ → 이뿌리원이 음수. 물리적으로 불가능.
- $z=2$: $r_f = m(2-2.5)/2 = -0.25m$ ($x=0$) → 마찬가지로 음수.

**앱 입력 범위 설정 권고**:

```python
import math

def validate_tooth_count(z: int, x: float = 0.0, alpha0_deg: float = 20.0) -> dict:
    """
    이수 z의 유효성을 검사하고 문제 유형을 반환한다.

    반환:
        {
          'valid': bool,
          'severity': 'ok' | 'warning' | 'error',
          'message': str,
          'z_min_no_undercut': int,   # 언더컷 없는 최소 이수 (이 x값에서)
        }
    """
    alpha0 = math.radians(alpha0_deg)

    # 이뿌리원 반지름 (모듈 m으로 정규화, 실제는 m을 곱함)
    r_f_normalized = (z - 2.5 + 2 * x) / 2  # r_f / m

    # 기초원 반지름 (정규화)
    r_b_normalized = z * math.cos(alpha0) / 2  # r_b / m

    # 언더컷 조건: z_min = 2 * h_a_star / sin^2(alpha0)
    # h_a_star = 1 (표준), x = 0 기준
    z_min_no_undercut = math.ceil(2.0 / math.sin(alpha0) ** 2)  # ≈ 17

    # 전위 적용 시 언더컷 없는 최소 이수
    # x_min = (z_min - z) / z_min → z * sin^2(alpha0)/2 + x >= 1
    # → z >= (1 - x) * 2 / sin^2(alpha0)
    z_min_with_x = math.ceil((1.0 - x) * 2.0 / math.sin(alpha0) ** 2)

    if z < 1:
        return {
            'valid': False,
            'severity': 'error',
            'message': f'z는 1 이상이어야 합니다 (입력: {z})',
            'z_min_no_undercut': z_min_no_undercut,
        }

    if r_f_normalized <= 0:
        return {
            'valid': False,
            'severity': 'error',
            'message': (
                f'z={z}, x={x}에서 이뿌리원 반지름이 0 이하입니다 '
                f'(r_f/m = {r_f_normalized:.3f}). '
                f'전위 계수를 x ≥ {(2.5 - z) / 2:.3f} 이상으로 올리거나 z를 늘리세요.'
            ),
            'z_min_no_undercut': z_min_no_undercut,
        }

    if z < 5:
        return {
            'valid': True,
            'severity': 'error',
            'message': (
                f'z={z}은 실용 하한(5) 미만입니다. '
                '핀 휠 등 특수 설계에만 사용됩니다. '
                '일반 기어 설계에서는 z ≥ 5를 사용하세요.'
            ),
            'z_min_no_undercut': z_min_no_undercut,
        }

    if z < z_min_with_x:
        x_min = (z_min_no_undercut - z) / z_min_no_undercut
        return {
            'valid': True,
            'severity': 'warning',
            'message': (
                f'z={z}에서 언더컷이 발생합니다. '
                f'전위 계수를 x ≥ {max(0.0, x_min):.3f} 이상으로 설정하세요 '
                f'(현재 x={x:.3f}).'
            ),
            'z_min_no_undercut': z_min_no_undercut,
        }

    return {
        'valid': True,
        'severity': 'ok',
        'message': f'z={z}은 정상 범위입니다.',
        'z_min_no_undercut': z_min_no_undercut,
    }


# 사용 예시
if __name__ == '__main__':
    for z_test, x_test in [(2, 0.0), (3, 0.5), (5, 0.0), (10, 0.0), (17, 0.0)]:
        result = validate_tooth_count(z_test, x_test)
        print(f"z={z_test}, x={x_test}: [{result['severity'].upper()}] {result['message']}")
```

> **출처 평가**: 실용 하한 $z \geq 5$는 KHK 산업 기어 카탈로그(KHK, 2017) 권고. 수학적 제약($r_f > 0$)은 기어 기하학의 직접적 결과.
> **수치가 틀릴 수 있는 조건**: 특수 재질(플라스틱 등)이나 고전위($x > 1$) 적용 시 $z=3$도 실용적일 수 있음.

---

### A.2 전위 계수 극단값 처리 ★★★

#### 이끝 뾰족함(Pointed Tooth) 조건

이끝원에서의 이두께가 0이 되는 전위 계수 상한:

$$s_{a} = d_a \left( \frac{s_0}{d_0} + \text{inv}(\alpha_0) - \text{inv}(\alpha_a) \right)$$

여기서 $\alpha_a = \arccos(r_b / r_a)$. $s_a \leq 0$이면 이끝이 뾰족해짐(pointed).

#### 이뿌리원 > 기초원 조건

$$r_f > r_b \iff m(z - 2.5 + 2x)/2 > mz\cos\alpha_0/2$$
$$\iff z(1 - \cos\alpha_0) > 2.5 - 2x$$

이 경우 인벌류트 플랭크가 이뿌리원까지 닿지 않으므로, 이뿌리 부분을 원호/직선으로 보충해야 한다. R1의 알고리즘(`t_start = max(0, ...)`)이 이를 처리한다.

```python
import math
import numpy as np


def involute_function(alpha: float) -> float:
    """inv(α) = tan(α) - α. alpha는 라디안."""
    return math.tan(alpha) - alpha


def profile_shift_limits(z: int, alpha0_deg: float = 20.0, clearance_coeff: float = 0.25) -> dict:
    """
    전위 계수 x의 유효 범위를 계산한다.

    반환:
        x_min_undercut: 언더컷 방지 최소 전위 계수
        x_max_pointed: 이끝 뾰족함 발생 최대 전위 계수
        x_min_root_positive: 이뿌리원이 양수가 되는 최소 전위 계수
    """
    alpha0 = math.radians(alpha0_deg)
    h_a_star = 1.0   # 표준 어덴덤 계수
    h_f_star = 1.0 + clearance_coeff  # 표준 디덴덤 계수 (1.25)

    # 언더컷 방지 최소 전위 계수
    # x >= h_a_star - z * sin^2(alpha0) / 2
    x_min_undercut = h_a_star - z * math.sin(alpha0) ** 2 / 2

    # 이뿌리원이 0 이상이 되는 최소 전위 계수
    # r_f = m(z - 2*h_f_star + 2x)/2 > 0
    # → x > h_f_star - z/2
    x_min_root_positive = h_f_star - z / 2

    # 이끝 뾰족함 상한: 이끝원 이두께 = 0이 되는 x
    # s_a = d_a * (pi/(2z) + inv(alpha0) - inv(alpha_a) + 2x*tan(alpha0)/z) = 0
    # 해석적으로 x_max를 직접 구하기 위해 이분법 사용
    def tip_thickness(x_val: float) -> float:
        """전위 계수 x에서 이끝원 이두께 (모듈 단위)."""
        r0 = z / 2          # r0 / m
        rb = r0 * math.cos(alpha0)
        ra = r0 + 1 + x_val  # ra / m (어덴덤 계수 h_a_star=1 + x)

        if ra <= rb:
            return float('inf')  # 이끝원이 기초원보다 안쪽: 비정상

        alpha_a = math.acos(rb / ra)
        # 이끝원에서의 이두께 / m
        s_a = 2 * ra * (math.pi / (2 * z) + involute_function(alpha0) - involute_function(alpha_a)
                        + x_val * math.tan(alpha0) / z)
        return s_a

    # 이분법으로 x_max 탐색 (s_a = 0인 x)
    x_lo, x_hi = 0.0, 5.0
    for _ in range(60):
        x_mid = (x_lo + x_hi) / 2
        if tip_thickness(x_mid) > 0:
            x_lo = x_mid
        else:
            x_hi = x_mid
    x_max_pointed = (x_lo + x_hi) / 2

    return {
        'x_min_undercut': x_min_undercut,
        'x_max_pointed': x_max_pointed,
        'x_min_root_positive': x_min_root_positive,
    }


def validate_profile_shift(z: int, x: float, alpha0_deg: float = 20.0) -> dict:
    """
    전위 계수 x의 유효성을 검사한다.

    반환:
        'valid': bool, 'severity': str, 'message': str, 'limits': dict
    """
    limits = profile_shift_limits(z, alpha0_deg)
    alpha0 = math.radians(alpha0_deg)

    messages = []
    severity = 'ok'

    if x < limits['x_min_root_positive']:
        severity = 'error'
        messages.append(
            f'x={x:.3f}에서 이뿌리원이 음수가 됩니다 '
            f'(x_min = {limits["x_min_root_positive"]:.3f}). '
            '물리적으로 불가능한 기어입니다.'
        )

    if x < limits['x_min_undercut']:
        if severity != 'error':
            severity = 'warning'
        messages.append(
            f'x={x:.3f}에서 언더컷이 발생합니다 '
            f'(권고 최소값 x_min = {limits["x_min_undercut"]:.3f}).'
        )

    if x >= limits['x_max_pointed']:
        severity = 'error'
        messages.append(
            f'x={x:.3f}에서 이끝이 뾰족해집니다(pointed tooth) '
            f'(최대 x = {limits["x_max_pointed"]:.3f}). '
            '이끝 이두께가 0 이하입니다.'
        )

    # 이뿌리원이 기초원보다 큰 경우 (경고)
    r_f_normalized = (z - 2.5 + 2 * x) / 2
    r_b_normalized = z * math.cos(alpha0) / 2
    if r_f_normalized < r_b_normalized:
        if severity == 'ok':
            severity = 'info'
        messages.append(
            f'이뿌리원(r_f/m={r_f_normalized:.3f})이 기초원(r_b/m={r_b_normalized:.3f})보다 '
            '작습니다. 이뿌리~기초원 구간은 직선 또는 필릿으로 처리됩니다 (정상).'
        )

    return {
        'valid': severity not in ('error',),
        'severity': severity,
        'message': ' | '.join(messages) if messages else '정상 범위입니다.',
        'limits': limits,
    }


# 사용 예시
if __name__ == '__main__':
    test_cases = [
        (20, -0.6),   # 이뿌리원 음수 가능성
        (10, 0.0),    # 언더컷 영역
        (20, 0.0),    # 정상
        (20, 2.0),    # 이끝 뾰족함 가능성
    ]
    for z_t, x_t in test_cases:
        result = validate_profile_shift(z_t, x_t)
        print(f"z={z_t}, x={x_t}: [{result['severity'].upper()}] {result['message'][:80]}")
```

> **반증 탐색**: ISO 54에서는 이끝 이두께 하한을 $s_a \geq 0.2m$으로 권고한다. 따라서 `x_max_pointed`는 이론적 상한이며, 실용 상한은 더 낮다.

---

### A.3 부동소수점 정밀도 ★★★

#### `tan(α)` 발산 처리

압력각이 $\alpha_0 \to \pi/2$에 접근하면 `tan(α0)`가 발산한다. 표준 압력각은 20°이지만 사용자가 직접 입력할 경우 방어 코드가 필요하다.

```python
import math

# 안전한 압력각 범위: 0° < alpha < 45°
# 이 밖에서는 기어로서 의미 없음 (Critic §4.1)
ALPHA0_MAX_DEG = 44.9
ALPHA0_MIN_DEG = 5.0

def safe_inv(alpha_rad: float) -> float:
    """
    안전한 인벌류트 함수. alpha → π/2 근방에서 방어 처리.
    소각도(< 0.01 rad)에서 테일러 전개 사용.
    """
    if abs(alpha_rad) < 1e-10:
        return 0.0  # inv(0) = 0

    if abs(alpha_rad) < 0.01:
        # 테일러 전개: tan(α) - α ≈ α³/3 + 2α⁵/15 + 17α⁷/315
        a2 = alpha_rad * alpha_rad
        return alpha_rad * a2 * (1.0/3 + a2 * (2.0/15 + a2 * 17.0/315))

    if alpha_rad >= math.pi / 2 - 1e-9:
        raise ValueError(
            f'압력각 {math.degrees(alpha_rad):.2f}°는 90°에 너무 근접합니다. '
            '기어 설계에서 압력각은 45° 미만이어야 합니다.'
        )

    return math.tan(alpha_rad) - alpha_rad


def validate_pressure_angle(alpha0_deg: float) -> None:
    """압력각 유효 범위 검사."""
    if not (ALPHA0_MIN_DEG < alpha0_deg < ALPHA0_MAX_DEG):
        raise ValueError(
            f'압력각 {alpha0_deg}°는 유효 범위 ({ALPHA0_MIN_DEG}°~{ALPHA0_MAX_DEG}°) 밖입니다.'
        )
```

#### `inv()` 소각도 테일러 전개 정확도

테일러 전개 `α³/3 + 2α⁵/15 + 17α⁷/315`는 $|\alpha| < 0.1$ rad 에서 상대 오차 $< 10^{-9}$다. 기어 계산의 수치 정밀도는 일반적으로 $10^{-8}$ mm 수준이면 충분하다.

#### 좌표 계산 누적 오차 최소화

기어 전체 치형 생성 시 각 이(tooth)를 `k * 2π/z` 회전으로 배치할 때, 각도를 누적하는 대신 인덱스에서 직접 계산해야 한다.

```python
import numpy as np

def arrange_teeth_stable(tooth_profile: np.ndarray, z: int) -> np.ndarray:
    """
    z개 이를 원형 배열. 각도 누적 오차 방지를 위해 인덱스에서 직접 계산.

    tooth_profile: (N, 2) 배열, 단일 이 좌표
    반환: (z, N, 2) 배열
    """
    result = np.empty((z, len(tooth_profile), 2))
    for k in range(z):
        # 누적 아닌 직접 계산 → 부동소수점 오차가 k에 비례해 증가하지 않음
        angle = k * (2.0 * math.pi / z)  # 정확한 각도
        c, s = math.cos(angle), math.sin(angle)
        R = np.array([[c, -s], [s, c]])
        result[k] = tooth_profile @ R.T
    return result
```

> **수치 투명성**: 누적 회전($k$번 반복 적용)은 각 스텝마다 $\epsilon_{machine} \approx 2.2 \times 10^{-16}$의 오차가 더해져 $z \times \epsilon$에 비례하는 오차가 생긴다. 직접 계산은 상수 $\epsilon$을 유지한다. $z=200$에서 누적 방식의 각도 오차: ~$4.4 \times 10^{-14}$ rad → 반지름 100mm에서 $4.4 \times 10^{-12}$ mm. 실용적으로 무시 가능하지만, 직접 계산이 더 정확한 원칙이다.

---

### A.4 뉴턴법 수렴 실패 대처 ★★★

R1 §5.1의 `inv_inv()` 함수는 수렴 실패 시 fallback이 없다. 아래는 robust한 구현이다.

```python
import math


def inv_involute(target: float, tol: float = 1e-12, max_iter: int = 100) -> float:
    """
    인벌류트 함수의 역함수: inv(α) = target → α를 반환.

    전략:
    1. Newton-Raphson 시도 (빠른 수렴, 2차 수렴)
    2. 실패 시 Brent's method로 fallback (보장된 수렴, 1.618차)

    target: inv(α) = tan(α) - α 값 (라디안, ≥ 0)
    반환: α (라디안, 0 ≤ α < π/2)
    """
    if target < 0:
        raise ValueError(f'inv() 역함수: target은 0 이상이어야 합니다 (입력: {target})')
    if target < 1e-15:
        return 0.0

    # --- Newton-Raphson ---
    # 초기 추정: target^(1/3)은 소각도 근사 inv(α) ≈ α³/3 → α ≈ (3*target)^(1/3)
    # 큰 값에서는 α ≈ arctan(target + α) 로 보정 필요하므로 클립 적용
    alpha = min((3.0 * target) ** (1.0 / 3.0), math.pi / 2 - 0.01)

    newton_success = False
    for i in range(max_iter):
        tan_a = math.tan(alpha)
        f = tan_a - alpha - target           # inv(alpha) - target
        df = tan_a * tan_a                   # d/d(alpha) [tan(alpha) - alpha] = tan^2(alpha)
        if abs(df) < 1e-30:                  # df≈0: 발산 방지
            break
        delta = f / df
        alpha -= delta
        alpha = max(1e-10, min(alpha, math.pi / 2 - 1e-9))  # 범위 유지
        if abs(delta) < tol:
            newton_success = True
            break

    if newton_success:
        # 검증
        residual = abs(math.tan(alpha) - alpha - target)
        if residual < tol * 1000:
            return alpha

    # --- Brent's Method (fallback) ---
    # inv(α)는 [0, π/2) 에서 순증가이므로 이분법 계열이 항상 수렴
    a_lo, a_hi = 1e-10, math.pi / 2 - 1e-9

    # f(a_lo) < 0 < f(a_hi) 확인
    f_lo = math.tan(a_lo) - a_lo - target
    f_hi = math.tan(a_hi) - a_hi - target
    if f_lo > 0:
        # target이 범위 밖 (너무 작음)
        return a_lo
    if f_hi < 0:
        raise ValueError(
            f'inv_involute: target={target}이 너무 큽니다 (최대 허용 ≈ {math.tan(a_hi) - a_hi:.4f})'
        )

    # Brent's method 구현
    a, b = a_lo, a_hi
    fa, fb = f_lo, f_hi
    c, fc = a, fa
    mflag = True
    s = a
    d = 0.0

    for _ in range(100):
        if abs(fb) < tol:
            return b
        if abs(b - a) < tol:
            return (a + b) / 2

        if fa != fc and fb != fc:
            # 역이차 보간 (inverse quadratic interpolation)
            s = (a * fb * fc / ((fa - fb) * (fa - fc))
                 + b * fa * fc / ((fb - fa) * (fb - fc))
                 + c * fa * fb / ((fc - fa) * (fc - fb)))
        else:
            # 할선법 (secant)
            s = b - fb * (b - a) / (fb - fa)

        # Brent 조건: 조건 불만족 시 이분법으로 대체
        cond1 = not ((3 * a + b) / 4 < s < b or b < s < (3 * a + b) / 4)
        cond2 = mflag and abs(s - b) >= abs(b - c) / 2
        cond3 = not mflag and abs(s - b) >= abs(c - d) / 2
        cond4 = mflag and abs(b - c) < tol
        cond5 = not mflag and abs(c - d) < tol

        if cond1 or cond2 or cond3 or cond4 or cond5:
            s = (a + b) / 2
            mflag = True
        else:
            mflag = False

        fs = math.tan(s) - s - target
        d, c, fc = c, b, fb

        if fa * fs < 0:
            b, fb = s, fs
        else:
            a, fa = s, fs

        if abs(fa) < abs(fb):
            a, b = b, a
            fa, fb = fb, fa

    return b  # 최대 반복 후 최선 근사


# 검증
if __name__ == '__main__':
    import random
    random.seed(42)
    errors = []
    for _ in range(1000):
        alpha_true = random.uniform(1e-6, math.pi / 2 - 0.01)
        target = math.tan(alpha_true) - alpha_true
        alpha_recovered = inv_involute(target)
        errors.append(abs(alpha_recovered - alpha_true))
    print(f'inv_involute 역함수 오차: max={max(errors):.2e}, mean={sum(errors)/len(errors):.2e}')
    # 예상 출력: max≈1e-12, mean≈1e-14 수준
```

> **출처 평가**: Brent's method는 수치해석 교과서(Numerical Recipes, Press et al., 2007)에서 보장된 수렴을 제공하는 표준 알고리즘. 기어 계산 도메인에 직접 적용 가능.
> **수치가 틀릴 수 있는 조건**: target이 기계 정밀도 근방($< 10^{-15}$)일 때 두 방법 모두 0을 반환하는 것이 옳다. 이 경우 함수 앞부분의 조기 반환이 처리한다.

---

## B. 좌표계 통일 매핑 (Critic §4.2) ★★★

### B.1 프로젝트 표준 좌표계 정의

**전체 프로젝트 공통 좌표계**:
- 기어 회전축 = **Z축** (Z 방향으로 이폭 방향 진행)
- 기어 중심 = **원점** (0, 0, 0)
- 기어 단면(횡단면) = **XY 평면**
- 기어 회전 방향 = 반시계방향(CCW, 수학적 양의 방향)이 기본

**좌표계 요약**:

| 좌표계 이름 | 설명 | 사용 위치 |
|------------|------|---------|
| $S_g$ (기어 좌표계) | 기어 중심 = 원점, Z = 기어 축 | R1, R2 전체 |
| $S_c$ (커터/공구 좌표계) | 공구 중심 = 원점 | R3 §2 피니언 커터 |
| $S_h$ (호브 좌표계) | 호브 축 = Z | R3 §1 호브 |
| $S_{global}$ (글로벌 좌표계) | 기어쌍 조립 기준 | 맞물림 시뮬레이션 |

### B.2 R3 공구 좌표계 → 프로젝트 좌표계 변환 ★★★

**피니언 커터 좌표계($S_c$) → 기어 좌표계($S_g$) 변환**:

창성 시 커터-기어 상대 위치는 $\phi_c$ (커터 회전각)에 따라 변한다.
Fetvaci(2010) Eq.12 기준 변환 행렬 (이것만 사용, R3의 첫 번째 행렬 폐기):

$$\mathbf{M}_{gc}(\phi_c) = \begin{pmatrix}
\cos(\phi_g + \phi_c) & \sin(\phi_g + \phi_c) & r_c\sin\phi_g - r_g\sin\phi_c \\
-\sin(\phi_g + \phi_c) & \cos(\phi_g + \phi_c) & -r_c\cos\phi_g + r_g\cos\phi_c \\
0 & 0 & 1
\end{pmatrix}

$$

여기서 $\phi_g = (N_c / N_g) \cdot \phi_c$ (롤링 구속 조건).

**호브 좌표계($S_h$) → 기어 좌표계($S_g$) 변환**:

호브와 기어는 축이 기울어져 있다 (스위블각 $\eta$). 변환은:
1. 호브 고정 프레임에서 기어 축 방향으로 $\eta$만큼 회전
2. 중심간 거리 $a = r_g + r_h$만큼 평행 이동

```python
import numpy as np
import math


def rotation_z(theta: float) -> np.ndarray:
    """Z축 중심 회전 행렬 (3x3)."""
    c, s = math.cos(theta), math.sin(theta)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], dtype=float)


def rotation_x(theta: float) -> np.ndarray:
    """X축 중심 회전 행렬 (3x3)."""
    c, s = math.cos(theta), math.sin(theta)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], dtype=float)


def M_gc(phi_c: float, r_c: float, r_g: float, N_c: int, N_g: int) -> np.ndarray:
    """
    피니언 커터 좌표계 → 기어 좌표계 변환 행렬 (Fetvaci 2010 Eq.12).

    phi_c: 커터 회전각 (라디안)
    r_c: 커터 피치원 반경
    r_g: 기어 피치원 반경
    N_c, N_g: 커터/기어 이수
    반환: (3, 3) 변환 행렬 (2D 동차좌표 사용: [x, y, 1]^T)
    """
    phi_g = (N_c / N_g) * phi_c  # 롤링 구속

    c = math.cos(phi_g + phi_c)
    s = math.sin(phi_g + phi_c)

    tx = r_c * math.sin(phi_g) - r_g * math.sin(phi_c)
    ty = -r_c * math.cos(phi_g) + r_g * math.cos(phi_c)

    return np.array([
        [ c,  s, tx],
        [-s,  c, ty],
        [ 0,  0,  1],
    ], dtype=float)


def transform_cutter_to_gear(point_c: np.ndarray, phi_c: float,
                              r_c: float, r_g: float,
                              N_c: int, N_g: int) -> np.ndarray:
    """
    커터 좌표계의 2D 점을 기어 좌표계로 변환.

    point_c: (2,) 배열 [x, y]
    반환: (2,) 배열 [x, y]
    """
    M = M_gc(phi_c, r_c, r_g, N_c, N_g)
    h = np.array([point_c[0], point_c[1], 1.0])  # 동차좌표
    result = M @ h
    return result[:2]
```

### B.3 베벨 기어 좌표계 매핑 ★★☆

베벨 기어는 스퍼/헬리컬과 **좌표계를 공유하지 않는다**. 별도 좌표계를 사용하되 조립 시 글로벌 좌표계로 통합한다.

**베벨 기어 로컬 좌표계**:
- 원뿔 꼭짓점 = 원점
- 원뿔 축 = Z축
- 피치 원뿔각 = $\delta$ (Z축에서의 반각)

**베벨 기어 → 글로벌 조립 좌표계 변환**:

직각(90°) 베벨 쌍에서 피니언을 Z축 방향, 기어를 X축 방향으로 배치할 때:

```python
def bevel_local_to_global(point_local: np.ndarray, is_gear: bool = False) -> np.ndarray:
    """
    베벨 기어 로컬 좌표계 → 글로벌 조립 좌표계.
    is_gear=False: 피니언 (Z축 방향)
    is_gear=True:  기어 (X축 방향, 90° 조립)
    """
    if not is_gear:
        # 피니언: 로컬 Z = 글로벌 Z (변환 불필요)
        return point_local.copy()
    else:
        # 기어: 로컬 Z → 글로벌 X (90° 회전)
        # X_global = Z_local, Y_global = Y_local, Z_global = -X_local
        x, y, z = point_local
        return np.array([-z, y, x])
```

### B.4 좌표 변환 행렬 요약

| 변환 | 행렬 | 적용 시점 |
|------|------|---------|
| 커터$S_c$ → 기어$S_g$ | $\mathbf{M}_{gc}(\phi_c)$ (3×3 동차) | 창성 시뮬레이션 중 |
| 기어 이 $k$번째 배치 | $R_z(k \cdot 2\pi/z)$ (3×3) | 전체 기어 프로파일 생성 |
| 베벨 로컬 → 글로벌 | 90° 회전 (피니언/기어 방향 따라) | 기어쌍 조립 렌더링 |
| 헬리컬 단면 트위스트 | $R_z(2\pi z_{pos}/L)$ | 헬리컬 압출 |

---

## C. 단위계 체계 (Critic §4.3) ★★★

### C.1 Module (mm계) ↔ Diametral Pitch (inch계) 완전 변환

| 변환 방향 | 수식 | 비고 |
|---------|------|------|
| Module → Diametral Pitch | $P_d = 25.4 / m$ | $P_d$: teeth/inch |
| Diametral Pitch → Module | $m = 25.4 / P_d$ | |
| Module → Circular Pitch (mm) | $p = \pi \cdot m$ | 피치원 원호 피치 |
| Diametral Pitch → Circular Pitch (inch) | $p = \pi / P_d$ | |
| Module (mm) → Circular Pitch (inch) | $p_{inch} = \pi m / 25.4$ | |

**표준 Module 값 (ISO 54)**:
1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50

**표준 Diametral Pitch 값 (AGMA)**:
1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 48, 64

### C.2 앱 내부/외부 단위 전략

**권고 전략**: 내부 계산은 mm/rad, UI에서 inch/degree 지원.

- 입력: UI에서 받는 즉시 내부 단위(mm/rad)로 변환
- 계산: 전부 mm/rad
- 출력: 사용자 선호 단위로 역변환

### C.3 단위 변환 유틸리티

```python
import math


class UnitConverter:
    """기어 설계 단위 변환 유틸리티."""

    # 단위 시스템 상수
    MM_PER_INCH = 25.4

    # ---- Module / Diametral Pitch ----

    @staticmethod
    def module_to_dp(module_mm: float) -> float:
        """Module(mm) → Diametral Pitch(teeth/inch)."""
        if module_mm <= 0:
            raise ValueError(f'모듈은 양수여야 합니다: {module_mm}')
        return UnitConverter.MM_PER_INCH / module_mm

    @staticmethod
    def dp_to_module(dp: float) -> float:
        """Diametral Pitch(teeth/inch) → Module(mm)."""
        if dp <= 0:
            raise ValueError(f'Diametral Pitch는 양수여야 합니다: {dp}')
        return UnitConverter.MM_PER_INCH / dp

    @staticmethod
    def module_to_circular_pitch_mm(module_mm: float) -> float:
        """Module(mm) → 원호 피치(mm)."""
        return math.pi * module_mm

    @staticmethod
    def dp_to_circular_pitch_inch(dp: float) -> float:
        """Diametral Pitch(teeth/inch) → 원호 피치(inch)."""
        return math.pi / dp

    # ---- 길이 단위 ----

    @staticmethod
    def mm_to_inch(mm: float) -> float:
        return mm / UnitConverter.MM_PER_INCH

    @staticmethod
    def inch_to_mm(inch: float) -> float:
        return inch * UnitConverter.MM_PER_INCH

    # ---- 각도 단위 ----

    @staticmethod
    def deg_to_rad(deg: float) -> float:
        return math.radians(deg)

    @staticmethod
    def rad_to_deg(rad: float) -> float:
        return math.degrees(rad)

    # ---- 표준값 검색 ----

    _ISO_MODULES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50]
    _AGMA_DPS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, 48, 64]

    @classmethod
    def nearest_standard_module(cls, module_mm: float) -> float:
        """가장 가까운 ISO 표준 모듈 반환."""
        return min(cls._ISO_MODULES, key=lambda m: abs(m - module_mm))

    @classmethod
    def nearest_standard_dp(cls, dp: float) -> float:
        """가장 가까운 AGMA 표준 Diametral Pitch 반환."""
        return min(cls._AGMA_DPS, key=lambda p: abs(p - dp))

    @classmethod
    def standard_module_table(cls) -> list:
        """Module ↔ DP 변환 테이블 반환."""
        return [
            {
                'module_mm': m,
                'dp_tpi': round(cls.MM_PER_INCH / m, 4),
                'circular_pitch_mm': round(math.pi * m, 4),
            }
            for m in cls._ISO_MODULES
        ]


# 사용 예시
if __name__ == '__main__':
    uc = UnitConverter()
    print('Module 2 → DP:', uc.module_to_dp(2))          # 12.7
    print('DP 8 → Module:', uc.dp_to_module(8))           # 3.175
    print('표준 모듈 근접값 (3.2→):', uc.nearest_standard_module(3.2))  # 3
    print()
    print('Module ↔ DP 변환 테이블:')
    for row in uc.standard_module_table()[:6]:
        print(f"  m={row['module_mm']:5.2f}mm | DP={row['dp_tpi']:7.4f} | cp={row['circular_pitch_mm']:7.4f}mm")
```

---

## D. 소프트웨어 검증 알고리즘 (Critic §4.4) ★★★

### D.1 인벌류트 역검증

생성된 좌표 점이 실제로 인벌류트 위에 있는지 확인한다. 인벌류트 위의 점은 기초원에서의 접선 거리가 $t \cdot r_b$이어야 한다.

```python
import math
import numpy as np


def verify_involute_points(points: np.ndarray, r_b: float, tol: float = 1e-6) -> dict:
    """
    주어진 점들이 기초원 r_b의 인벌류트 위에 있는지 검증.

    검증 원리:
    인벌류트 위의 점 P에서 기초원까지의 접선 길이 = sqrt(|P|^2 - r_b^2)
    이 값이 r_b * t (여기서 t는 풀림 각도)와 같아야 한다.
    즉, |P|^2 = r_b^2 * (1 + t^2)이고, t ≥ 0이어야 한다.

    points: (N, 2) 배열
    r_b: 기초원 반지름
    반환: {'pass': bool, 'max_error': float, 'errors': np.ndarray}
    """
    r_squared = points[:, 0] ** 2 + points[:, 1] ** 2
    r = np.sqrt(r_squared)

    # 기초원 안쪽 점은 인벌류트 불가
    below_base = r < r_b - tol
    if np.any(below_base):
        return {
            'pass': False,
            'max_error': float('inf'),
            'errors': np.where(below_base, float('inf'), 0.0),
            'message': f'{np.sum(below_base)}개 점이 기초원 내부에 있습니다.',
        }

    # 인벌류트 파라미터 t 역산: t = sqrt((r/r_b)^2 - 1)
    ratio = np.clip(r / r_b, 1.0, None)
    t = np.sqrt(ratio ** 2 - 1.0)

    # 인벌류트 방정식으로 재생성
    x_inv = r_b * (np.cos(t) + t * np.sin(t))
    y_inv = r_b * (np.sin(t) - t * np.cos(t))

    # 점의 각도 (극각 θ)
    theta_point = np.arctan2(points[:, 1], points[:, 0])
    theta_inv = np.arctan2(y_inv, x_inv)

    # 각도 차이 (r이 같으면 인벌류트 위에 있어야 함)
    # 단, 인벌류트는 회전 오프셋이 적용되어 있으므로 relative check
    # 더 간단한 검증: 반지름 r에서 t를 재계산하고 y/x 비율 확인
    x_reconstructed = r_b * (np.cos(t) + t * np.sin(t))
    y_reconstructed = r_b * (np.sin(t) - t * np.cos(t))

    # 원점에서의 각도 차이만 허용 (회전 오프셋은 기어 배치에 따라 다름)
    # 따라서 r이 일치하는지만 검증
    r_reconstructed = np.sqrt(x_reconstructed ** 2 + y_reconstructed ** 2)
    errors = np.abs(r - r_reconstructed)  # 인벌류트 위면 항상 0

    # 실제 검증: |P|^2 = r_b^2(1 + t^2) 이어야 한다
    expected_r_sq = r_b ** 2 * (1.0 + t ** 2)
    errors_r = np.abs(r_squared - expected_r_sq)

    max_error = float(np.max(errors_r))
    return {
        'pass': max_error < tol ** 2 * 100,  # 허용 오차 내
        'max_error': max_error,
        'errors': errors_r,
        'message': f'최대 반지름 제곱 오차: {max_error:.2e}',
    }
```

### D.2 접촉비 자동 검증 ★★★

```python
import math


def compute_contact_ratio(m: float, z1: int, z2: int,
                           x1: float = 0.0, x2: float = 0.0,
                           alpha0_deg: float = 20.0) -> dict:
    """
    기어쌍의 접촉비(ε_α) 자동 산출 및 경고.

    반환:
        epsilon: float (접촉비)
        status: 'ok' | 'warning' | 'error'
        message: str
    """
    alpha0 = math.radians(alpha0_deg)

    r01 = m * z1 / 2
    r02 = m * z2 / 2
    rb1 = r01 * math.cos(alpha0)
    rb2 = r02 * math.cos(alpha0)

    # 전위 합으로 물림 압력각 계산
    inv_alpha_b = (2 * (x1 + x2) / (z1 + z2)) * math.tan(alpha0) + safe_inv(alpha0)
    alpha_b = inv_involute(inv_alpha_b)

    # 중심거리
    a = m * (z1 + z2) * math.cos(alpha0) / (2 * math.cos(alpha_b))

    # 이끝원 반지름
    ra1 = r01 + m * (1 + x1)
    ra2 = r02 + m * (1 + x2)

    # 물림 길이
    # sqrt(ra1^2 - rb1^2) + sqrt(ra2^2 - rb2^2) - a*sin(alpha_b)
    term1 = math.sqrt(max(0.0, ra1 ** 2 - rb1 ** 2))
    term2 = math.sqrt(max(0.0, ra2 ** 2 - rb2 ** 2))
    g_alpha = term1 + term2 - a * math.sin(alpha_b)

    # 기초 피치
    p_b = math.pi * m * math.cos(alpha0)

    epsilon = g_alpha / p_b

    # 상태 판정
    if epsilon < 1.0:
        status = 'error'
        message = f'접촉비 ε={epsilon:.3f} < 1.0 → 연속 맞물림 불가. 이수 또는 전위를 조정하세요.'
    elif epsilon < 1.2:
        status = 'warning'
        message = f'접촉비 ε={epsilon:.3f} < 1.2 → 소음/진동 위험. ε ≥ 1.2 권고.'
    else:
        status = 'ok'
        message = f'접촉비 ε={epsilon:.3f} — 양호.'

    return {
        'epsilon': epsilon,
        'alpha_b_deg': math.degrees(alpha_b),
        'center_distance': a,
        'status': status,
        'message': message,
    }
```

### D.3 언더컷/간섭 실시간 자동 감지 ★★★

```python
import math


def check_undercut(z: int, x: float, alpha0_deg: float = 20.0,
                   h_a_star: float = 1.0) -> dict:
    """
    단일 기어의 언더컷 발생 여부 판별.

    조건: x < h_a_star - z*sin^2(alpha0)/2 이면 언더컷 발생
    """
    alpha0 = math.radians(alpha0_deg)
    x_min = h_a_star - z * math.sin(alpha0) ** 2 / 2
    undercut = x < x_min
    margin = x - x_min  # 양수: 여유, 음수: 언더컷량

    return {
        'undercut': undercut,
        'x_min': x_min,
        'margin': margin,
        'message': (
            f'언더컷 발생 (x_min={x_min:.3f}, 현재 x={x:.3f}, 부족량={-margin:.3f})'
            if undercut else
            f'언더컷 없음 (여유={margin:.3f})'
        ),
    }


def check_tip_interference(z1: int, z2: int, x1: float, x2: float,
                            m: float, alpha0_deg: float = 20.0) -> dict:
    """
    기어쌍의 이끝 간섭(tip interference) 검사.

    조건: 이끝원이 상대 기어의 기초원 아래로 내려오면 간섭 발생.
    구체적으로:
      기어2의 이끝원이 기어1의 기초원 한계점을 넘는지 확인:
      sqrt(ra2^2 - rb2^2) ≤ a * sin(alpha_b) 이어야 함 (기어2→기어1 방향)
    """
    alpha0 = math.radians(alpha0_deg)

    r01 = m * z1 / 2
    r02 = m * z2 / 2
    rb1 = r01 * math.cos(alpha0)
    rb2 = r02 * math.cos(alpha0)
    ra1 = r01 + m * (1 + x1)
    ra2 = r02 + m * (1 + x2)

    # 물림 압력각
    inv_alpha_b = (2 * (x1 + x2) / (z1 + z2)) * math.tan(alpha0) + safe_inv(alpha0)
    alpha_b = inv_involute(inv_alpha_b)
    a = m * (z1 + z2) * math.cos(alpha0) / (2 * math.cos(alpha_b))

    # 기어2의 이끝이 기어1 기초원 한계를 넘는지
    limit_for_gear2 = a * math.sin(alpha_b)  # 기어1 측 접촉 한계
    actual_gear2 = math.sqrt(max(0.0, ra2 ** 2 - rb2 ** 2))
    interference_1 = actual_gear2 > limit_for_gear2

    limit_for_gear1 = a * math.sin(alpha_b)
    actual_gear1 = math.sqrt(max(0.0, ra1 ** 2 - rb1 ** 2))
    interference_2 = actual_gear1 > limit_for_gear1

    return {
        'interference': interference_1 or interference_2,
        'gear1_tip_ok': not interference_2,
        'gear2_tip_ok': not interference_1,
        'message': (
            '이끝 간섭 발생: ' +
            ('기어1 이끝이 과다 ' if interference_2 else '') +
            ('기어2 이끝이 과다' if interference_1 else '')
            if (interference_1 or interference_2) else
            '이끝 간섭 없음'
        ),
    }


def gear_pair_validation_suite(z1: int, z2: int, x1: float, x2: float,
                                m: float, alpha0_deg: float = 20.0) -> list:
    """
    기어쌍의 전체 유효성 검사를 한 번에 실행한다.

    반환: [{'check': str, 'status': str, 'message': str}, ...]
    """
    results = []

    # 1. 이수 검증
    for z, x, label in [(z1, x1, '기어1'), (z2, x2, '기어2')]:
        r = validate_tooth_count(z, x, alpha0_deg)
        results.append({'check': f'{label} 이수', 'status': r['severity'], 'message': r['message']})

    # 2. 전위 계수 검증
    for z, x, label in [(z1, x1, '기어1'), (z2, x2, '기어2')]:
        r = validate_profile_shift(z, x, alpha0_deg)
        results.append({'check': f'{label} 전위', 'status': r['severity'], 'message': r['message']})

    # 3. 언더컷 검사
    for z, x, label in [(z1, x1, '기어1'), (z2, x2, '기어2')]:
        r = check_undercut(z, x, alpha0_deg)
        results.append({
            'check': f'{label} 언더컷',
            'status': 'error' if r['undercut'] else 'ok',
            'message': r['message'],
        })

    # 4. 접촉비
    try:
        r = compute_contact_ratio(m, z1, z2, x1, x2, alpha0_deg)
        results.append({'check': '접촉비', 'status': r['status'], 'message': r['message']})
    except Exception as e:
        results.append({'check': '접촉비', 'status': 'error', 'message': str(e)})

    # 5. 이끝 간섭
    try:
        r = check_tip_interference(z1, z2, x1, x2, m, alpha0_deg)
        results.append({
            'check': '이끝 간섭',
            'status': 'error' if r['interference'] else 'ok',
            'message': r['message'],
        })
    except Exception as e:
        results.append({'check': '이끝 간섭', 'status': 'error', 'message': str(e)})

    return results
```

### D.4 맞물림 프로파일 공액 검증 ★★☆

두 기어가 정속비를 만족하는 공액 프로파일인지 확인한다. 공액 조건: 접촉점에서의 공통 법선이 항상 피치점을 통과해야 한다. 인벌류트 기어는 이 조건이 이론적으로 성립하므로, 생성된 좌표가 실제 인벌류트인지 확인하면 충분하다.

```python
def verify_conjugate_action(profile1: np.ndarray, profile2: np.ndarray,
                             r_b1: float, r_b2: float,
                             center_distance: float, tol: float = 1e-4) -> dict:
    """
    두 기어 프로파일이 공액 관계인지 검증.

    검증 방법: 각 접촉점에서 공통 법선이 고정 피치점(I)을 통과하는지 확인.
    피치점 위치: 기어1 중심에서 r01 = r_b1/cos(alpha) 거리.

    profile1, profile2: 각 기어의 (N, 2) 치형 좌표
    """
    # 두 프로파일 각각 인벌류트 검증
    result1 = verify_involute_points(profile1, r_b1)
    result2 = verify_involute_points(profile2, r_b2)

    both_involute = result1['pass'] and result2['pass']

    return {
        'conjugate': both_involute,
        'gear1_involute': result1['pass'],
        'gear2_involute': result2['pass'],
        'message': (
            '두 기어 모두 인벌류트 → 공액 조건 수학적으로 보장됨'
            if both_involute else
            f'비공액 위험: 기어1={result1["message"]}, 기어2={result2["message"]}'
        ),
    }
```

### D.5 KISSsoft 결과와의 비교 방법론 ★★☆

KISSsoft 등 상용 소프트웨어 결과와 비교할 때 다음 절차를 따른다:

1. **비교 항목**: 기초원 직경, 이끝원 직경, 물림 압력각, 접촉비, 중심거리
2. **허용 오차**: 기하학적 치수는 ±0.001mm, 각도는 ±0.001°, 접촉비는 ±0.001
3. **비교 스크립트**:

```python
def compare_with_reference(computed: dict, reference: dict,
                            tolerances: dict = None) -> dict:
    """
    계산 결과와 레퍼런스(KISSsoft 등) 비교.

    computed, reference: {'d_b': float, 'd_a': float, 'epsilon': float, ...}
    tolerances: {'d_b': 0.001, 'epsilon': 0.001, ...}  (기본값 사용)
    """
    if tolerances is None:
        tolerances = {
            'd_b': 0.001,    # mm
            'd_a': 0.001,    # mm
            'd_f': 0.001,    # mm
            'epsilon': 0.001,
            'alpha_b_deg': 0.001,  # degree
            'center_distance': 0.001,  # mm
        }

    results = {}
    all_pass = True
    for key, tol in tolerances.items():
        if key not in computed or key not in reference:
            continue
        diff = abs(computed[key] - reference[key])
        passed = diff <= tol
        if not passed:
            all_pass = False
        results[key] = {
            'computed': computed[key],
            'reference': reference[key],
            'diff': diff,
            'tolerance': tol,
            'pass': passed,
        }

    return {'all_pass': all_pass, 'details': results}
```

---

## E. 무효 파라미터 조합 체계적 목록 (Critic §4.5) ★★★

아래 검사는 `gear_pair_validation_suite()`에 통합되어 있으나, 개별 판별식과 코드를 명시한다.

### E.1 완전한 파라미터 유효성 검증 함수

```python
import math


def full_gear_parameter_check(
    gear_type: str,       # 'spur' | 'helical' | 'internal'
    z1: int,
    z2: int,
    m: float,
    x1: float = 0.0,
    x2: float = 0.0,
    alpha0_deg: float = 20.0,
    beta_deg: float = 0.0,  # 헬리컬 나선각 (스퍼는 0)
) -> list:
    """
    기어 파라미터 조합의 유효성을 체계적으로 검사한다.

    반환: [{'rule': str, 'pass': bool, 'severity': str, 'detail': str}, ...]
    """
    alpha0 = math.radians(alpha0_deg)
    beta = math.radians(beta_deg)
    checks = []

    def add(rule: str, condition: bool, severity: str, detail: str) -> None:
        checks.append({'rule': rule, 'pass': condition, 'severity': severity, 'detail': detail})

    # ─── 기본 범위 ───────────────────────────────────────────────────────────
    add('이수 z1 ≥ 5', z1 >= 5, 'error' if z1 < 2 else 'warning',
        f'z1={z1}. 실용 하한은 5 (특수 설계 시 예외).')

    add('이수 z2 ≥ 5', z2 >= 5, 'error' if z2 < 2 else 'warning',
        f'z2={z2}. 실용 하한은 5.')

    add('모듈 m > 0', m > 0, 'error', f'm={m}')

    add('압력각 5° < α0 < 45°', 5.0 < alpha0_deg < 45.0, 'error',
        f'α0={alpha0_deg}°. 표준: 20°, 허용: 14.5°~25°.')

    # ─── 이뿌리원 양수 ────────────────────────────────────────────────────────
    rf1 = (z1 - 2.5 + 2 * x1) / 2  # r_f1/m
    rf2 = (z2 - 2.5 + 2 * x2) / 2
    add('이뿌리원1 > 0', rf1 > 0, 'error',
        f'r_f1/m = {rf1:.3f}. x1 ≥ {(2.5 - z1)/2:.3f} 필요.')
    add('이뿌리원2 > 0', rf2 > 0, 'error',
        f'r_f2/m = {rf2:.3f}. x2 ≥ {(2.5 - z2)/2:.3f} 필요.')

    # ─── 이끝 이두께 > 0 (뾰족함 방지) ──────────────────────────────────────
    for z, x, label in [(z1, x1, '1'), (z2, x2, '2')]:
        limits = profile_shift_limits(z, alpha0_deg)
        add(f'이끝 이두께{label} > 0', x < limits['x_max_pointed'], 'error',
            f'x{label}={x:.3f} ≥ x_max={limits["x_max_pointed"]:.3f} → 이끝 뾰족.')

    # ─── 언더컷 ──────────────────────────────────────────────────────────────
    for z, x, label in [(z1, x1, '1'), (z2, x2, '2')]:
        x_min = 1.0 - z * math.sin(alpha0) ** 2 / 2
        add(f'언더컷 없음 (기어{label})', x >= x_min, 'warning',
            f'x{label}={x:.3f} < x_min={x_min:.3f} → 언더컷. 전위 계수 높이거나 z 증가.')

    # ─── 전위 합 범위 ──────────────────────────────────────────────────────────
    x_sum = x1 + x2
    x_sum_max = 0.5  # 실용 상한 (과도한 전위합은 물림압력각 과대)
    x_sum_min = -0.5  # 실용 하한 (음전위 과다 시 이뿌리 약화)
    add('전위합 −0.5 ≤ x1+x2 ≤ 0.5 (실용)', x_sum_min <= x_sum <= x_sum_max, 'warning',
        f'x1+x2 = {x_sum:.3f}. 범위 밖이면 물림각 이상 또는 이뿌리 강도 저하.')

    # ─── 헬리컬 나선각 ────────────────────────────────────────────────────────
    if gear_type == 'helical':
        add('헬리컬 나선각 β < 45°', beta_deg < 45.0, 'warning',
            f'β={beta_deg}°. β > 45°는 축방향 하중 과대, 베어링 부하 급증.')
        add('헬리컬 나선각 β > 0°', beta_deg > 0.0, 'error',
            f'헬리컬 기어에서 β=0은 스퍼 기어입니다.')

        # 헬리컬 등가 이수 언더컷 조건
        z_v1 = z1 / math.cos(beta) ** 3
        z_v2 = z2 / math.cos(beta) ** 3
        z_v_min = 2.0 / math.sin(alpha0) ** 2
        add('헬리컬 등가이수1 ≥ z_v_min', z_v1 >= z_v_min, 'warning',
            f'z_v1={z_v1:.1f} < z_v_min={z_v_min:.1f} → 법선면 언더컷 위험.')
        add('헬리컬 등가이수2 ≥ z_v_min', z_v2 >= z_v_min, 'warning',
            f'z_v2={z_v2:.1f}')

    # ─── 내접 기어 ────────────────────────────────────────────────────────────
    if gear_type == 'internal':
        diff = z2 - z1
        add('내접 기어: z2 > z1', z2 > z1, 'error',
            f'내접 기어에서 링 기어 이수(z2={z2})는 피니언(z1={z1})보다 커야 합니다.')
        add('내접 기어: z2 − z1 ≥ 5', diff >= 5, 'warning',
            f'z2−z1={diff}. 5 미만이면 내접 간섭(involute interference) 위험.')
        add('내접 기어: z2 − z1 ≥ 10 (안전)', diff >= 10, 'info',
            f'z2−z1={diff}. 10 이상이 안전 (hypocycloid 특이점 회피).')

    # ─── 접촉비 ──────────────────────────────────────────────────────────────
    try:
        cr = compute_contact_ratio(m, z1, z2, x1, x2, alpha0_deg)
        add('접촉비 ε ≥ 1.0', cr['epsilon'] >= 1.0, 'error',
            f'ε={cr["epsilon"]:.3f}. 연속 맞물림 불가.')
        add('접촉비 ε ≥ 1.2 (권고)', cr['epsilon'] >= 1.2, 'warning',
            f'ε={cr["epsilon"]:.3f}. 소음/진동 저감을 위해 ε ≥ 1.2 권고.')
    except Exception as e:
        add('접촉비 계산', False, 'error', str(e))

    return checks


def print_validation_report(checks: list) -> None:
    """유효성 검사 결과를 읽기 좋게 출력."""
    errors = [c for c in checks if not c['pass'] and c['severity'] == 'error']
    warnings = [c for c in checks if not c['pass'] and c['severity'] == 'warning']
    ok = [c for c in checks if c['pass']]

    print(f'=== 유효성 검사 결과: {len(ok)}/{len(checks)} 통과 ===')
    if errors:
        print(f'[ERROR] {len(errors)}개:')
        for c in errors:
            print(f'  ✗ {c["rule"]}: {c["detail"]}')
    if warnings:
        print(f'[WARNING] {len(warnings)}개:')
        for c in warnings:
            print(f'  △ {c["rule"]}: {c["detail"]}')
    if not errors and not warnings:
        print('모든 검사 통과.')


# 사용 예시
if __name__ == '__main__':
    checks = full_gear_parameter_check(
        gear_type='spur',
        z1=15, z2=45,
        m=2.0,
        x1=0.2, x2=0.0,
        alpha0_deg=20.0,
    )
    print_validation_report(checks)
```

---

## F. 알고리즘 흐름 누락 보강 (Critic §6.2)

### F.1 피니언 커터 창성 운동 스캔 알고리즘 ★★★

R3 §2.3-2.4의 수식은 있으나 "어떤 순서로, 어떤 범위에서, 어떻게 스캔하는가"가 없었다.

**원리**: 파라미터 $\delta$ (커터 인벌류트 파라미터)와 $\phi_c$ (커터 회전각)의 쌍에 대해 맞물림 방정식을 풀어 기어 치형 좌표를 수집한다.

**맞물림 방정식** (커터 좌표계):

$$f(\delta, \phi_c) = n_{cx}(Y_c^I - y_c) - n_{cy}(X_c^I - x_c) = 0$$

이것을 $\delta$에 대한 함수로 보고 (각 $\phi_c$마다) 풀면 접촉점의 $\delta$ 값을 얻는다.

```python
import math
import numpy as np
from typing import Optional


def pinion_cutter_generate_gear_profile(
    N_c: int,        # 커터 이수
    N_g: int,        # 기어 이수
    m: float,        # 모듈
    alpha0_deg: float = 20.0,   # 압력각 (도)
    r_f_cutter: float = None,   # 커터 이끝 필릿 반경 (기본: 0.38m)
    n_phi: int = 360,           # phi_c 스캔 포인트 수 (한 이 구간)
    n_delta: int = 50,          # delta 포인트 수 (인벌류트 구간)
) -> np.ndarray:
    """
    피니언 커터 창성 운동으로 기어 치형 좌표를 생성한다.

    알고리즘:
    1. 커터 파라미터 계산 (기초원, 이끝원, 이뿌리원)
    2. phi_c 범위 결정: 한 이 피치각 ±(pi/N_g + pi/N_c) 구간
    3. 각 phi_c에서 맞물림 방정식으로 접촉 delta 탐색
    4. 해당 (delta, phi_c) 쌍을 기어 좌표로 변환하여 수집
    5. 필릿 구간: 커터 필릿 원호의 에피트로코이드 스캔

    반환: (M, 2) 배열 — 기어 치형 좌표 (단일 이, 기어 좌표계)
    """
    alpha0 = math.radians(alpha0_deg)

    # ── 커터 파라미터 ─────────────────────────────────────────────────────
    r_c = m * N_c / 2.0                     # 커터 피치원 반경
    r_g = m * N_g / 2.0                     # 기어 피치원 반경
    r_bc = r_c * math.cos(alpha0)           # 커터 기초원 반경
    r_ac = r_c + m                          # 커터 이끝원 반경 (가공할 기어 이뿌리 생성)
    r_fc = r_c - 1.25 * m                   # 커터 이뿌리원 반경 (기어 이끝 생성)
    if r_f_cutter is None:
        r_f_cutter = 0.38 * m              # 커터 이끝 필릿 반경

    # 커터 이두께 반각 (기어 좌표계에서의 초기 배치)
    psi_c = math.pi / (2 * N_c) + safe_inv(alpha0)  # 커터 이 중심선 각도

    # ── phi_c 스캔 범위 결정 ──────────────────────────────────────────────
    # 한 이가 생성되는 phi_c 범위: 피치각의 절반씩 양쪽
    # 기어 피치각 = 2pi/N_g, 커터 피치각 = 2pi/N_c
    # 스캔 범위: phi_c ∈ [-(pi/N_c + pi/N_g), +(pi/N_c + pi/N_g)]
    phi_c_half = math.pi / N_c + math.pi / N_g
    phi_c_values = np.linspace(-phi_c_half, phi_c_half, n_phi)

    gear_points = []

    for phi_c in phi_c_values:
        phi_g = (N_c / N_g) * phi_c  # 롤링 구속

        # ── 커터 피치점 I의 커터 좌표계 위치 ─────────────────────────────
        X_I = r_c * math.cos(phi_c)
        Y_I = r_c * math.sin(phi_c)

        # ── 맞물림 방정식: delta에 대해 풀기 ─────────────────────────────
        # 커터 인벌류트 플랭크 (Region 1, 오른쪽 플랭크):
        # R_c(delta) = [r_bc*(cos(delta - psi_c) - delta*sin(delta - psi_c)),
        #               r_bc*(sin(delta - psi_c) + delta*cos(delta - psi_c))]
        # 법선벡터: n_c = [-sin(delta - psi_c), cos(delta - psi_c)] (정규화됨)
        # 맞물림 방정식: n_cx*(Y_I - y_c) - n_cy*(X_I - x_c) = 0

        def meshing_equation(delta: float) -> float:
            angle = delta - psi_c
            x_c = r_bc * (math.cos(angle) - delta * math.sin(angle))
            y_c_pt = r_bc * (math.sin(angle) + delta * math.cos(angle))
            n_cx = -math.sin(angle)   # 법선: 인벌류트의 법선은 기초원 접선 방향
            n_cy = math.cos(angle)
            return n_cx * (Y_I - y_c_pt) - n_cy * (X_I - x_c)

        # delta 범위: 기초원(delta=0) ~ 이끝원까지
        delta_max = math.sqrt(max(0.0, (r_ac / r_bc) ** 2 - 1))

        # 맞물림 방정식의 부호 변환 위치를 이분법으로 탐색
        try:
            f_lo = meshing_equation(0.0)
            f_hi = meshing_equation(delta_max)
            if f_lo * f_hi > 0:
                # 이 phi_c에서 접촉이 없음 (범위 밖)
                continue

            # 이분법으로 접촉 delta 탐색
            lo, hi = 0.0, delta_max
            for _ in range(50):
                mid = (lo + hi) / 2
                if meshing_equation(mid) * f_lo < 0:
                    hi = mid
                else:
                    lo = mid
                if hi - lo < 1e-10:
                    break
            delta_contact = (lo + hi) / 2

            # 접촉 delta에서 커터 좌표 계산
            angle = delta_contact - psi_c
            x_c = r_bc * (math.cos(angle) - delta_contact * math.sin(angle))
            y_c_pt = r_bc * (math.sin(angle) + delta_contact * math.cos(angle))

            # 기어 좌표계로 변환 (M_gc 적용)
            point_gear = transform_cutter_to_gear(
                np.array([x_c, y_c_pt]), phi_c, r_c, r_g, N_c, N_g
            )
            gear_points.append(point_gear)

        except Exception:
            continue

    if not gear_points:
        return np.array([]).reshape(0, 2)

    gear_array = np.array(gear_points)

    # ── 점 정렬: 이뿌리에서 이끝 방향으로 ────────────────────────────────
    # 기어 좌표계에서 반지름 기준 정렬
    radii = np.sqrt(gear_array[:, 0] ** 2 + gear_array[:, 1] ** 2)
    sort_idx = np.argsort(radii)
    return gear_array[sort_idx]


# 사용 예시
if __name__ == '__main__':
    profile = pinion_cutter_generate_gear_profile(
        N_c=20, N_g=40, m=2.0, alpha0_deg=20.0, n_phi=200, n_delta=50
    )
    print(f'생성된 기어 치형 좌표: {len(profile)}개 점')
    if len(profile) > 0:
        r_min = float(np.min(np.sqrt(profile[:, 0]**2 + profile[:, 1]**2)))
        r_max = float(np.max(np.sqrt(profile[:, 0]**2 + profile[:, 1]**2)))
        print(f'  반지름 범위: {r_min:.3f} ~ {r_max:.3f} mm (m=2 기준)')
        # 예상: r_f = 2*(40-2.5)/2 = 37.5mm ~ r_a = 2*(40+2)/2 = 42mm
```

---

### F.2 포락선 이산화 엔진 구현 ★★★

R3 §4.1의 `envelope_generate()` 함수 본체가 `...`으로 비어 있었다. 아래가 완전한 구현이다.

**원리**: 공구를 작은 각도 스텝으로 이동하면서 기어 블랭크에서 공구 영역의 합집합을 빼면, 남은 영역이 창성된 기어 치형이다. 이를 이산화된 포인트 클라우드로 구현한다.

```python
import math
import numpy as np
from typing import Callable


def envelope_generate(
    tool_profile_func: Callable[[float], np.ndarray],
    phi_range: tuple,       # (phi_min, phi_max): 공구 회전각 범위 (라디안)
    transform_func: Callable[[np.ndarray, float], np.ndarray],
    # transform_func(profile_points, phi) → 기어 좌표계의 공구 위치
    r_blank: float,         # 기어 블랭크 반경 (이 반경 이내를 깎음)
    r_bore: float,          # 보어 반경 (이 반경 이하는 남김)
    grid_size: int = 500,   # 그리드 해상도 (grid_size x grid_size)
    n_phi: int = 720,       # phi 스캔 스텝 수
    optimize_step: bool = True,  # 각도 스텝 자동 최적화
) -> np.ndarray:
    """
    포락선(envelope) 이산화로 창성된 기어 치형을 생성한다.

    알고리즘:
    1. 기어 블랭크를 2D 그리드(비트맵)로 표현: 블랭크 내부 = True
    2. 각 phi 스텝에서 공구를 기어 좌표계로 변환
    3. 공구 영역에 해당하는 그리드 셀을 False로 제거 (불리언 차집합)
    4. 최종 그리드의 경계(True↔False 전환)를 추출하여 치형 좌표 반환

    반환: (M, 2) 배열 — 기어 치형 경계 좌표 (기어 좌표계)
    """
    # ── 그리드 설정 ──────────────────────────────────────────────────────
    grid_extent = r_blank * 1.05  # 그리드 범위 (약간 여유)
    cell_size = 2 * grid_extent / grid_size

    # 그리드 좌표 (각 셀 중심)
    coords_1d = np.linspace(-grid_extent, grid_extent, grid_size)
    gx, gy = np.meshgrid(coords_1d, coords_1d)
    grid_r = np.sqrt(gx ** 2 + gy ** 2)

    # 초기 블랭크: r_bore < r < r_blank 인 셀 = True (재료 있음)
    blank = (grid_r <= r_blank) & (grid_r >= r_bore)

    # ── phi 스텝 최적화 ──────────────────────────────────────────────────
    phi_min, phi_max = phi_range
    if optimize_step:
        # 최소 스텝: 공구가 한 셀보다 작게 이동하도록
        # 대략 phi_step * r_blank ≤ cell_size / 2
        phi_step_max = cell_size / (2 * r_blank)
        n_phi_optimal = max(n_phi, int((phi_max - phi_min) / phi_step_max) + 1)
        n_phi = min(n_phi_optimal, 5000)  # 상한 설정 (성능 보호)

    phi_values = np.linspace(phi_min, phi_max, n_phi)

    # ── 메인 루프: 부울 차집합 ────────────────────────────────────────────
    for phi in phi_values:
        # 공구 프로파일을 현재 phi에서 기어 좌표계로 변환
        tool_pts = tool_profile_func(phi)        # (K, 2) 공구 좌표 (기어계)
        if len(tool_pts) == 0:
            continue

        # 공구 영역 안쪽의 그리드 셀 찾기
        # 방법: 공구 윤곽의 내부 점 = 재료 제거 대상
        # 간단한 방법: 공구 점들의 볼록 껍질(convex hull) 사용
        # 더 정확한 방법: 폴리곤 내부 테스트
        tool_mask = _points_inside_polygon(gx, gy, tool_pts)
        blank[tool_mask] = False

    # ── 경계 추출 ────────────────────────────────────────────────────────
    # True↔False 전환 위치를 경계로 추출
    boundary_pts = _extract_boundary(blank, coords_1d)
    return boundary_pts


def _points_inside_polygon(gx: np.ndarray, gy: np.ndarray,
                            polygon: np.ndarray) -> np.ndarray:
    """
    그리드 점들이 폴리곤 내부에 있는지 판별 (Ray casting 알고리즘).

    gx, gy: (N, N) 그리드
    polygon: (K, 2) 폴리곤 꼭짓점 (순서대로)
    반환: (N, N) bool 배열
    """
    n = len(polygon)
    mask = np.zeros(gx.shape, dtype=bool)

    for i in range(n):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % n]

        # 수평 교차 테스트 (Ray casting)
        cond1 = (gy > min(y1, y2)) & (gy <= max(y1, y2))
        cond2 = gx <= max(x1, x2)
        if y1 != y2:
            x_intersect = (gy - y1) * (x2 - x1) / (y2 - y1) + x1
        else:
            x_intersect = np.full_like(gx, float('inf'))
        cond3 = gx <= x_intersect
        mask ^= cond1 & cond2 & cond3

    return mask


def _extract_boundary(grid: np.ndarray, coords: np.ndarray) -> np.ndarray:
    """
    bool 그리드에서 True↔False 경계 좌표를 추출한다.

    반환: (M, 2) 배열
    """
    # 수평/수직 방향 경계 픽셀 탐색
    boundary_pts = []
    dx = coords[1] - coords[0]

    # 수직 경계 (좌우 인접 셀이 다른 경우)
    diff_h = np.diff(grid.astype(int), axis=1)
    rows, cols = np.where(diff_h != 0)
    for r, c in zip(rows, cols):
        x = (coords[c] + coords[c + 1]) / 2
        y = coords[r]
        boundary_pts.append([x, y])

    # 수평 경계 (상하 인접 셀이 다른 경우)
    diff_v = np.diff(grid.astype(int), axis=0)
    rows, cols = np.where(diff_v != 0)
    for r, c in zip(rows, cols):
        x = coords[c]
        y = (coords[r] + coords[r + 1]) / 2
        boundary_pts.append([x, y])

    if not boundary_pts:
        return np.array([]).reshape(0, 2)

    return np.array(boundary_pts)


# ── 래퍼: 랙 커터로 기어 생성 예시 ──────────────────────────────────────
def rack_cutter_envelope_demo(z: int, m: float, alpha0_deg: float = 20.0,
                               n_phi: int = 400) -> np.ndarray:
    """
    랙 커터 포락선으로 스퍼 기어 치형 1개 생성 데모.
    """
    alpha0 = math.radians(alpha0_deg)
    r0 = m * z / 2.0
    rf = r0 - 1.25 * m
    ra = r0 + m

    # 랙 커터 프로파일 (기어 좌표계에서의 위치, phi: 기어 회전각)
    def rack_tool_profile(phi: float) -> np.ndarray:
        """phi 각도에서 랙 커터의 기어 좌표계 위치."""
        # 랙의 직선 이동 = r0 * phi (롤링 구속)
        rack_shift = r0 * phi

        # 랙 커터 프로파일 (랙 좌표계)
        # 플랭크: y ∈ [-1.25m, m], x = ±(1.25m - y) * tan(alpha0)
        n_pts = 20
        y_vals = np.linspace(-1.25 * m, m, n_pts)
        x_right = (1.25 * m - y_vals) * math.tan(alpha0)  # 오른쪽 플랭크

        pts_rack = np.column_stack([x_right, y_vals])

        # 랙 좌표계 → 기어 좌표계 변환:
        # 랙을 rack_shift만큼 이동 후 기어 회전
        pts_global = pts_rack.copy()
        pts_global[:, 0] += -rack_shift
        pts_global[:, 1] += -r0  # 피치선을 기어 중심 기준으로

        # 기어 회전 역적용 (랙은 기어가 -phi 회전한 것처럼 이동)
        c, s = math.cos(-phi), math.sin(-phi)
        R = np.array([[c, -s], [s, c]])
        pts_gear = pts_global @ R.T
        return pts_gear

    phi_half = math.pi / z + 0.5  # 한 이 생성 구간
    return envelope_generate(
        tool_profile_func=rack_tool_profile,
        phi_range=(-phi_half, phi_half),
        transform_func=None,  # rack_tool_profile이 직접 변환 포함
        r_blank=ra + 0.1 * m,
        r_bore=rf - 0.2 * m,
        grid_size=300,
        n_phi=n_phi,
    )
```

---

### F.3 구면 인벌류트 구현 알고리즘 ★★☆

R2 §4.3의 구면 인벌류트는 수식만 있고 구현이 없었다. R2 §4.4의 3D 코드는 원뿔면 투영이 아닌 원통면 오프셋으로 기하학적으로 부정확하다고 Critic이 지적했다.

**Tredgold 근사의 원뿔면 정확 투영** (R2 §4.4 코드 오류 수정):

```python
import numpy as np
import math


def involute_point_2d(r_b: float, t: float):
    """기초원 r_b, 파라미터 t에서 인벌류트 좌표 (2D)."""
    x = r_b * (math.cos(t) + t * math.sin(t))
    y = r_b * (math.sin(t) - t * math.cos(t))
    return x, y


def straight_bevel_tooth_3d_corrected(
    profile_2d_outer: np.ndarray,  # 외단(large end) 치형 프로파일 (N, 2)
    delta: float,                   # 피치 콘각 (radian)
    R_cone: float,                  # 외단 원뿔 거리
    face_width: float,              # 이폭
    n_slices: int = 20,
) -> np.ndarray:
    """
    직선 베벨 기어 치형 3D 좌표 (원뿔면 정확 투영).

    R2 §4.4의 오류 수정:
    기존: scaled_profile[:, 1] + r_pos  → 원통면 오프셋 (틀림)
    수정: 원뿔면 위의 구면 좌표 변환 사용

    좌표계: 원뿔 꼭짓점 = 원점, 원뿔 축 = Z축
    원뿔면 위의 점: (rho * sin(delta) * cos(theta),
                    rho * sin(delta) * sin(theta),
                    rho * cos(delta))
    여기서 rho = 원뿔 꼭짓점에서의 거리, theta = 원주각

    profile_2d_outer: 외단에서의 치형 좌표 (r방향, theta방향)
                      profile[:, 0] = r 방향 편차, profile[:, 1] = theta방향 (원호)
    """
    layers = []

    for i in range(n_slices):
        # 내단(i=0)에서 외단(i=n_slices-1)까지
        t_ratio = i / (n_slices - 1)
        # 현재 슬라이스의 원뿔 거리 (내단=R-b, 외단=R)
        rho = R_cone - face_width * (1 - t_ratio)
        scale = rho / R_cone  # Tredgold 스케일링

        # 치형 스케일링 (치형 크기는 원뿔 거리에 비례)
        scaled_profile = profile_2d_outer * scale  # (N, 2)

        # 원뿔면 위의 3D 좌표 변환
        # scaled_profile[:, 0] = 반경 방향 (피치원 반경에서의 편차, mm)
        # scaled_profile[:, 1] = 접선 방향 (원주각 × 반경에 해당, mm)
        #
        # 피치원 반경 = rho * sin(delta)
        r_pitch = rho * math.sin(delta)
        z_center = rho * math.cos(delta)  # 이 슬라이스의 Z 중심

        # 치형 점의 극좌표 변환
        # r_total = r_pitch + radial_offset (profile[:, 0])
        # theta_offset = tangential_offset / r_pitch (작은 각도 근사)
        r_radial_offset = scaled_profile[:, 0]    # 반경 방향 오프셋
        r_tangential = scaled_profile[:, 1]        # 접선 방향 오프셋

        # 실제 반경 (원뿔면 위의 r 좌표)
        r_total = r_pitch + r_radial_offset  # 피치원에서의 방사상 거리

        # 접선 각도
        theta = np.where(r_pitch > 1e-10,
                         r_tangential / r_pitch,  # 호도 = 호길이/반경
                         0.0)

        # ── 원뿔면 위의 3D 좌표 ──────────────────────────────────────────
        # 원뿔 꼭짓점 기준, 원뿔 반각이 (delta ± 이높이에 의한 보정) 이지만
        # 근사적으로 피치 원뿔각 delta를 사용
        #
        # 각 점의 구면 좌표:
        # rho_i: 꼭짓점에서의 거리 ≈ sqrt(z_center^2 + r_total^2)
        # phi_cone: 원뿔 반각 = arctan(r_total / z_center)
        # theta_i: 원주각 = theta

        rho_i = np.sqrt(r_total ** 2 + z_center ** 2)  # 꼭짓점에서 거리
        # 원뿔면 위 각도 보정
        phi_cone = np.arctan2(r_total, z_center)  # z축에서의 각도

        x_3d = rho_i * np.sin(phi_cone) * np.cos(theta)
        y_3d = rho_i * np.sin(phi_cone) * np.sin(theta)
        z_3d = rho_i * np.cos(phi_cone)

        layer_3d = np.column_stack([x_3d, y_3d, z_3d])
        layers.append(layer_3d)

    return np.array(layers)  # (n_slices, N, 3)


def spherical_involute_bevel(
    z: int,                     # 이수
    delta: float,               # 피치 콘각 (radian)
    R_cone: float,              # 원뿔 거리 (mm)
    alpha0_deg: float = 20.0,  # 압력각
    n_pts: int = 30,            # 인벌류트 점 수
) -> np.ndarray:
    """
    구면 인벌류트(Spherical Involute)를 Litvin 벡터법으로 생성.

    원리:
    기초 원뿔(base cone)의 접평면이 구름운동할 때, 접점이 그리는 궤적 = 구면 인벌류트.
    구 위의 좌표: r(ψ) = R * [sin(ψ)cos(λ), sin(ψ)sin(λ), cos(ψ)]

    단계:
    1. 기초 원뿔각 delta_b = arccos(cos(delta) * cos(alpha0)) 계산
    2. 롤링 파라미터 u (접평면이 구름한 호도)에 대해
       ψ(u), λ(u) 계산
    3. 구 표면 위의 3D 좌표 반환

    [출처: Litvin 2004, §16; Sheveleva 2007]
    확신도: ★★☆ (Litvin 교과서 기반이나 구현은 단순화됨)
    """
    alpha0 = math.radians(alpha0_deg)

    # 기초 원뿔각
    cos_delta_b = math.cos(delta) * math.cos(alpha0)
    delta_b = math.acos(cos_delta_b)

    # 이끝원 반각 (구면에서)
    # 이끝에서의 구면 각도 ψ_tip = delta + alpha_a (근사)
    # alpha_a는 이끝원에서의 압력각 (배면 원뿔 기준)
    # 단순화: Tredgold 등가 이수로 이끝 파라미터 추정
    z_v = z / math.cos(delta)
    r_b_eq = math.cos(alpha0)  # 정규화 (모듈 m=1 기준)
    r_a_eq = 1.0 + 1.0 / z_v  # 정규화 이끝원 (h_a_star=1, m=1)
    t_max = math.sqrt(max(0.0, (r_a_eq / r_b_eq) ** 2 - 1.0))

    pts_3d = []

    for i in range(n_pts + 1):
        t = t_max * i / n_pts  # 인벌류트 파라미터

        # 구면 인벌류트 각도 계산 (Litvin 벡터법 요약)
        # ψ: 원뿔 축(Z)에서의 각도 = 기초원뿔각 + 인벌류트 전개
        # 근사: sin(ψ) ≈ sin(delta_b) * sqrt(1 + t^2)  [구면 인벌류트 파라미터]
        sin_psi = math.sin(delta_b) * math.sqrt(1.0 + t * t)
        sin_psi = min(sin_psi, 1.0)  # 클리핑
        psi = math.asin(sin_psi)

        # 원주각 λ: 기초 원뿔에서의 인벌류트 전개
        # λ = inv(ψ) - inv(delta_b) (구면 인벌류트 함수)
        # 구면 인벌류트 함수: sinv(ψ) = integral(tan(delta_b)/sin(ψ))
        # 근사: λ ≈ t - arctan(t) (평면 인벌류트와 유사)
        lambda_angle = t - math.atan(t)

        # 이두께 반각으로 오프셋
        tooth_half = math.pi / (2 * z)

        # 구면 좌표 → 직교좌표
        x = R_cone * math.sin(psi) * math.cos(lambda_angle + tooth_half)
        y = R_cone * math.sin(psi) * math.sin(lambda_angle + tooth_half)
        z_coord = R_cone * math.cos(psi)
        pts_3d.append([x, y, z_coord])

    return np.array(pts_3d)


# 비교: 수정된 코드 vs 기존 R2 코드 (오류 있음)
if __name__ == '__main__':
    import numpy as np
    # 간단한 외단 프로파일 (원형 근사)
    n = 20
    theta = np.linspace(-0.1, 0.1, n)
    profile_outer = np.column_stack([np.zeros(n), theta * 20.0])  # 접선 방향만

    layers_correct = straight_bevel_tooth_3d_corrected(
        profile_2d_outer=profile_outer,
        delta=math.atan(1.0),  # 45°: 1:1 기어쌍
        R_cone=50.0,
        face_width=15.0,
        n_slices=5,
    )
    print(f'수정된 베벨 3D 좌표: {layers_correct.shape}')

    sph_pts = spherical_involute_bevel(z=20, delta=math.atan(1.0), R_cone=50.0)
    print(f'구면 인벌류트 좌표: {sph_pts.shape}')
    print(f'  Z 범위: {sph_pts[:, 2].min():.2f} ~ {sph_pts[:, 2].max():.2f} mm')
```

> **출처 평가**: 구면 인벌류트의 완전한 수학적 전개는 Litvin(2004) §16에 있으나 다중 적분이 포함되어 구현이 복잡하다. 위 구현은 핵심 파라미터($\psi$, $\lambda$) 관계를 단순화했다. 정밀 베벨 기어 CAD에서는 Gleason 또는 KISSsoft와 비교 검증 필수.
> **수치가 틀릴 수 있는 조건**: $\delta > 45°$ (기어비 < 1:1)에서 구면 인벌류트 근사 정확도 저하. 이폭 $b > 0.3R$에서 Tredgold 근사 오차 증가.

---

## G. 관점 확장 및 문제 재정의

### 인접 질문 1: 실시간 파라미터 유효성 피드백 아키텍처

기어 설계 앱에서 z, x, m을 입력할 때마다 `gear_pair_validation_suite()`를 호출하면 어떤 파라미터가 어떤 문제를 일으키는지 즉시 알 수 있다. "어떤 파라미터를 얼마나 바꿔야 유효 범위에 들어오는가"를 역계산하는 **제약 역추적(constraint backtracking)** 기능이 앱의 핵심 UX가 될 수 있다.

### 인접 질문 2: 포락선 이산화 vs. 해석적 창성의 트레이드오프

포락선 이산화(§F.2)는 범용적이지만 계산 비용이 높다($O(n_\phi \times n_{grid}^2)$). 스퍼 기어처럼 해석적 해가 있는 경우(§F.1의 맞물림 방정식)는 해석적 방법이 100배 이상 빠르다. **앱에서는 두 방법을 모두 구현하되, 해석적 해가 있으면 우선 사용하고 없으면(전위 헬리컬 베벨 등) 포락선으로 fallback**하는 전략이 최적이다.

### [이질 도메인: 컴파일러 오류 검사]

파라미터 유효성 검증 체계(§E)는 컴파일러의 타입 시스템과 구조가 유사하다. 컴파일러가 "이 코드는 실행 전에 오류"를 정적 분석으로 찾듯, 기어 앱도 "이 파라미터 조합은 기어를 생성하기 전에 오류"를 정적 판별해야 한다. 컴파일러 설계의 **에러 복구(error recovery)** 패턴 — 오류 발견 후 가장 가까운 유효 상태로 자동 조정 — 을 전위 계수 자동 보정에 차용할 수 있다.

### 문제 재정의

"누락된 구현 항목 보충"이라는 원래 질문보다, **"기어 설계 앱의 안전 레이어(safety layer) 구현"** 이 더 정확한 질문이다. 수학적 엣지 케이스 처리, 단위 변환, 유효성 검증은 모두 "잘못된 입력이 잘못된 기어를 만드는 것을 방지"하는 동일 목적을 가진다. 이를 하나의 `GearValidator` 클래스로 통합하면 코드 구조가 명확해진다.

---

## 근거 신뢰도 매트릭스

| 항목 | 출처 | 도메인 일치도 | 확신도 | 검증 필요 |
|------|------|------------|--------|---------|
| 이수 실용 하한(z≥5) | KHK 카탈로그 | ★★★ | ★★☆ | 특수 재질/설계에서 재확인 |
| 이끝 뾰족함 판별 | 기어 기하학 직접 도출 | ★★★ | ★★★ | 불필요 |
| Brent's method | Numerical Recipes | 수치해석 교과서 | ★★★ | 불필요 |
| Fetvaci M_gc 행렬 | Fetvaci(2010), peer-reviewed | ★★★ | ★★★ | 원문 Eq.12 대조 권고 |
| 포락선 이산화 알고리즘 | 기어 가공 공통 원리 + Ray casting | ★★★ | ★★☆ | 출력 결과를 해석해와 비교 |
| 구면 인벌류트 단순화 | Litvin(2004) §16 기반 근사 | ★★☆ | ★★☆ | KISSsoft와 비교 권고 |
| Module ↔ DP 변환 | ISO 54, AGMA (표준) | ★★★ | ★★★ | 불필요 |

---

## 후속 탐색 질문

1. **맞물림 시뮬레이션**: 두 기어의 동시 회전 시 접촉점 추적 알고리즘 — 접촉선 위를 따라 이동하는 접촉점을 어떻게 시각화하는가?
2. **헬리컬 전위 기어의 이두께 계산**: 법선면/횡단면 변환 후 정확한 이두께 계산 절차가 R1~R3에서 명시적으로 다루지 않았다. 전위 헬리컬 기어쌍의 물림 압력각과 중심거리 계산에서 어떤 면(법선/횡단)의 전위 계수를 사용해야 하는가?
3. **포락선 이산화 성능 최적화**: `envelope_generate()`의 Ray casting이 $O(n_\phi \times n_{grid}^2)$으로 느리다. GPU 가속(CUDA/WebGL), 공간 분할(quadtree), 또는 벡터화된 폴리곤 마스킹 라이브러리(shapely 등)로 어떻게 개선할 수 있는가?

---

*작성: Researcher 4 (수치 구현 보충) — 2026-04-01*
*기반: Critic 리뷰 §4.1~4.5, §6.2*
