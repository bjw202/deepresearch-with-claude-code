제조 온톨로지 맥락에서 들은 **“mason**”은 거의 확실하게 **MASON = MAnufacturing’s Semantics ONtology**를 뜻한다. 이것은 어떤 회사 제품명이 아니라, **제조 도메인의 공통 의미체계를 만들기 위해 제안된 상위 제조 온톨로지**다. 2006년 논문으로 제안됐고, 공개 프로젝트 형태로도 배포됐으며, OWL-DL 형식으로 구현됐다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

핵심만 먼저 말하면, MASON은 **“제조에서 쓰는 단어들을 컴퓨터가 헷갈리지 않게 공통 사전으로 정리한 것**”이다. 예를 들어 `제품`, `공정`, `자원`이 무엇인지, 드릴링이 어떤 공정인지, 어떤 공정이 어떤 공구를 쓰는지, 어떤 재질에는 어떤 가공이 가능한지 같은 관계를 기계가 이해할 수 있게 형식화한다. 원 논문은 이런 목적을 “제조 분야의 common semantic net”이라고 설명한다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

이론체계의 출발점은 의외로 단순하다. MASON은 제조를 **Product / Process / Resource**의 결합으로 본다. 원 논문은 이를 거의 그대로 반영해 세 개의 머리 개념, 즉 **Entities, Operations, Resources**로 온톨로지를 구성했다. 여기서 `Entities`는 제품을 규정하는 개념들, `Operations`는 제조·검사·조립·물류 같은 행위, `Resources`는 기계·공구·사람·공장 같은 실행 주체와 설비를 뜻한다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

조금 더 풀어 말하면 이렇다.\
`Entities`에는 형상 특징, 재료, 비용 요소 같은 것이 들어가고, `Operations`에는 가공·조립·검사뿐 아니라 물류와 인간 작업도 포함되며, `Resources`에는 machine-tools, tools, human resources, geographic resources가 들어간다. 즉 MASON은 “기계 가공만” 다루는 좁은 모델이 아니라, **제조 시스템 전체를 의미적으로 엮기 위한 뼈대**에 가깝다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

형식 언어 측면에서는 **OWL/OWL-DL**이 핵심이다. 쉽게 말하면, 클래스·속성·관계를 기계가 추론 가능한 방식으로 적는 언어다. 원 논문은 예시로 드릴링 개념에 `drill_speed` 같은 속성을 붙이고, `uses` 관계로 공정과 공구를 연결하는 식을 보여준다. 또 어떤 재료에는 어떤 공정이 허용되지 않는지 같은 제약도 OWL restriction으로 표현하고, 더 복잡한 규칙은 **SWRL 같은 룰 언어가 더 적합하다**고 설명한다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

그래서 MASON을 이해할 때 중요한 포인트는, 이것이 단순 데이터베이스 스키마가 아니라는 점이다. 스키마가 “컬럼 구조”라면, 온톨로지는 **의미 + 관계 + 제약 + 일부 추론 규칙**까지 포함한다. 최근 Industry 4.0/지식그래프 문헌도 온톨로지의 기본 요소를 개념·관계·공리로 보고, TBox(개념 정의)와 ABox(개별 인스턴스 데이터)로 나눠 지식베이스/그래프로 운용한다고 정리한다. ([MDPI](https://www.mdpi.com/2076-3417/11/11/5110 "Semantic Web and Knowledge Graphs for Industry 4.0 | MDPI"))

그럼 실제로 어떻게 활용하느냐. MASON의 원 논문이 직접 제시한 1차 활용은 두 가지다. 첫째는 **자동 원가 추정**이다. 제품 정보, 공정 계획, 제조 자원을 MASON으로 통일되게 기술한 뒤, 전문가 시스템이 그 정보를 읽어 필요한 활동들을 인스턴스화하고 각 활동에 비용을 붙여 원가를 계산하는 방식이다. 둘째는 **제조용 멀티에이전트 시스템**이다. 여러 에이전트가 서로 다른 시스템/위치에 있어도 MASON을 공통 어휘로 쓰면 메시지 해석과 세계 모델 공유가 쉬워지고, OWL-기반 지식을 JADE 같은 에이전트 프레임워크와 연결해 제조 체인 시뮬레이션과 의사결정을 수행할 수 있게 된다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

여기서 중요한 것은, MASON이 **앱 그 자체**라기보다 **앱 위에서 공통 언어 역할을 하는 기반 모델**이라는 점이다. 그래서 현장에서는 보통 “MASON을 그대로 완제품처럼 쓴다”기보다, MASON의 상위 개념을 가져와 자기 회사 도메인에 맞게 확장한다. 최근 논문들도 MASON을 제조 핵심 개념을 위한 **upper/core ontology**로 보거나, 다른 온톨로지의 상위 정렬 기준으로 사용한다고 설명한다.

실제 사례를 몇 가지로 나누면 더 이해가 쉽다.

첫 번째 사례는 **기계 부품 원가 추정**이다. 이것이 MASON의 가장 직접적인 초기 사례다. 제품 정의 → 필요한 활동 전개 → 활동별 비용 연결이라는 구조라서, 당신이 관심 갖는 공정 체인·가공 레시피·전후 치수·설비별 실행 비용 같은 문제와도 결이 맞는다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

두 번째 사례는 **제조 멀티에이전트/시뮬레이션**이다. 원 논문은 OWL 온톨로지와 JADE 에이전트 프레임워크를 매핑해, 제조 체인의 에이전트 간 상호작용이 온톨로지에서 파생되도록 설계했다. 쉽게 말해 “설비 에이전트, 물류 에이전트, 계획 에이전트가 각자 말을 하는데, 그 말의 뜻을 다 같이 MASON으로 맞춘다”는 구조다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

세 번째 사례는 **후속 제조 온톨로지들의 기반 레이어**다. 예를 들어 ExtruOnt라는 압출기용 온톨로지는 MASON을 제조 핵심 개념을 표현하는 상위 온톨로지로 정렬했고, 제품·공정·자원이라는 MASON의 큰 틀 위에 기계 구성요소, 3D 표현, 센서 정보까지 붙였다. 이것은 MASON이 개별 설비용 세부 모델의 “모체”로 쓰일 수 있음을 보여준다.

네 번째 사례는 **Industry 4.0 지식그래프/스마트 제조 스케줄링**이다. 2021년 서베이는 제약 제품 포장 수요 대응형 생산 사례에서, perception layer의 지식그래프가 **MASON 기반 제조 의미체계**를 사용해 생산계획 스케줄링을 담당했다고 정리한다. 즉 MASON이 단지 이론 모델이 아니라, 실제 CPS/지식그래프/스케줄링 구조의 의미 레이어로 쓰였다는 뜻이다. ([MDPI](https://www.mdpi.com/2076-3417/11/11/5110 "Semantic Web and Knowledge Graphs for Industry 4.0 | MDPI"))

다섯 번째 사례는 **현대 온톨로지·디지털트윈 연구에서의 간접 활용**이다. 최근 제조 디지털트윈과 자산관리셸(AAS), 생산계획·제어(PPC), 자원 capability 모델 논문들은 MASON을 기존의 대표 제조 상위 온톨로지 중 하나로 참조하면서, 그 위에 더 구체적인 capability, 장비 사전, 도메인별 vocabulary를 쌓는다. 예컨대 2023년 injection molding PPC 온톨로지는 제조사 독립 vocabulary와 표준화된 디지털트윈/AAS 기반을 만들려 했고, 2025년 I40GO는 다양한 Industry 4.0 온톨로지를 계층·모듈 구조로 통합하려고 했다. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2452414X23000614 "Towards an ontology-based dictionary for production planning and control in the domain of injection molding as a basis for standardized asset administration shells - ScienceDirect"))

그래서 현재 시점에서 MASON의 위치를 한 문장으로 정리하면 이렇다.\
**MASON은 지금 당장 MES/PLM/SCADA를 대체하는 산업 표준 솔루션이라기보다, 제조 지식그래프·디지털트윈·자원 매칭·공정 추론 시스템의 상위 개념 골격으로 읽는 것이 맞다.** 최근 연구들이 MASON을 직접 완성품처럼 쓰기보다, capability ontology, AAS dictionary, Industry 4.0 global ontology 같은 더 구체적 모델의 참조점으로 삼는 흐름이 이를 보여준다. 이 부분은 최근 문헌을 종합한 해석이다. ([Springer](https://link.springer.com/article/10.1007/s10845-018-1427-6 "The development of an ontology for describing the capabilities of manufacturing resources | Journal of Intelligent Manufacturing | Springer Nature Link"))

스타팅 포인트로는 이렇게 잡으면 된다.

1. **MASON은 무엇인가?**\
   제조용 공통 의미체계다. 제품-공정-자원(PPR)을 컴퓨터가 읽을 수 있게 정리한 상위 온톨로지다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

2. **왜 필요한가?**\
   ERP, MES, 설비, 시뮬레이터, 에이전트, 디지털트윈이 서로 다른 단어를 쓰면 연결이 안 되는데, MASON은 그 사이의 “공통 사전” 역할을 한다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

3. **무엇을 잘하는가?**\
   의미 통일, 관계 표현, 제약 정의, 룰 기반 추론, 이기종 시스템 간 의미적 상호운용성이다. ([Academia](https://academia.skadge.org/publis/Lemaignan2006.pdf "untitled"))

4. **무엇이 부족한가?**\
   최신 공장에 필요한 capability, 센서, AAS, 실시간 이벤트, 도메인별 세부 공정 표현은 부족할 수 있어서 보통 후속 온톨로지로 확장해야 한다. 최근 capability ontology, injection molding dictionary, I40GO가 바로 그 방향이다. ([Springer](https://link.springer.com/article/10.1007/s10845-018-1427-6 "The development of an ontology for describing the capabilities of manufacturing resources | Journal of Intelligent Manufacturing | Springer Nature Link"))

당신처럼 제조 도메인에서 실제 시스템을 만들려는 입장이라면, MASON을 이렇게 해석하면 가장 실용적이다.\
**“우리 회사의 공정 디지털트윈/판단지원/에이전트 시스템을 설계할 때, 제일 위 레벨의 개념 사전으로 MASON 같은 PPR 온톨로지를 두고, 그 아래에 설비 capability, 측정값, 품질 규칙, 공정 체인 규칙을 붙인다.**”즉 MASON은 시작점이고, 현장 적용은 반드시 회사 맞춤 확장이 필요하다. 이 방향은 최근 제조 자원 capability 모델과 디지털트윈 온톨로지 연구 흐름과도 맞닿아 있다. ([Springer](https://link.springer.com/article/10.1007/s10845-018-1427-6 "The development of an ontology for describing the capabilities of manufacturing resources | Journal of Intelligent Manufacturing | Springer Nature Link"))