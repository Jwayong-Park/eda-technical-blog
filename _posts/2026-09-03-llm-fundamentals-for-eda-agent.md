---
layout: post
title: "EDA Agent를 이해하기 전에 알아야 할 LLM 기초"
subtitle: "Neural Network · Training · Inference · Prompt · RAG · Fine-Tuning · LMOps"
description: "LLM의 신경망, 학습과 추론, 토큰과 임베딩, Transformer, 환각, Prompt·RAG·Fine-Tuning·LMOps를 이해하고 EDA Agent로 연결하기 위한 기초 지식."
category: "AI Fundamentals"
tags:
  - AI
  - LLM
  - Neural Network
  - Training
  - Inference
  - Prompt
  - RAG
  - Fine-Tuning
  - LMOps
  - EDA Agent
permalink: /posts/llm-fundamentals-for-eda-agent.html
---

EDA 분야에서 **AI Agent**를 이야기할 때 가장 먼저 떠오르는 질문은 보통 다음과 같다.

> "EDA Agent가 알아서 STA를 분석하고, 원인을 찾고, ECO까지 제안할 수 있을까?"

가능성을 이야기하기 전에 먼저 알아야 할 것이 있다. **LLM이 무엇을 학습하고, 어떻게 답을 만들며, 왜 틀릴 수 있는가**이다.

이 글은 발표 자료 **「LLM 신경망(Neural Network) 학습부터 추론 원리, 그리고 실무 적용 솔루션」**을 바탕으로, 이후 EDA Agent와 AI 기반 Design/Implementation Flow를 이해하기 위해 필요한 AI 기초를 하나의 기술 문서로 정리한 것이다. fileciteturn38file0L28-L32

핵심 흐름은 다음과 같다.

```text
원리 이해
   ↓
LLM의 한계 이해
   ↓
문제에 맞는 해결책 선택
   ↓
Prompt / RAG / Fine-Tuning / LMOps
   ↓
AI Agent
   ↓
EDA Agent
```

---

## 1. 왜 EDA Agent를 이야기하기 전에 LLM을 알아야 하는가?

AI Transformation(AX)은 단순히 AI Tool을 사용하는 문제가 아니다. 문제를 정의하고, 그 문제에 맞는 AI 구성 요소를 선택하는 것이 중요하다.

발표 자료에서는 이를 세 가지 관점으로 정리한다.

1. **소통과 의사결정** — 기본 용어와 동작 메커니즘을 알아야 업계와 벤더, 개발자와 제대로 소통할 수 있다.
2. **프롬프트 그 이상** — 학습과 추론 과정을 이해해야 AI 도구와 Pipeline을 설계할 수 있다.
3. **해결책 선택** — 같은 문제라도 Prompt, RAG, Fine-Tuning 중 적절한 선택이 달라진다. fileciteturn38file0L96-L117

EDA Agent도 똑같다.

예를 들어 다음 요구사항을 생각해보자.

> "이 Setup violation의 원인을 분석하고 ECO 방향을 제안해줘."

이것은 단순한 Chat 기능이 아니다. Agent가 무엇을 알고 있어야 하는지, 어떤 데이터를 검색해야 하는지, 어떤 Tool을 호출해야 하는지, 그리고 결과를 어떻게 검증해야 하는지까지 정의해야 한다.

그 출발점이 LLM의 동작 원리다.

---

## 2. AI · Machine Learning · Deep Learning · LLM

먼저 용어의 관계부터 정리해보자.

```text
Artificial Intelligence
└── Machine Learning
    └── Deep Learning
        └── Large Language Model
```

### AI — Artificial Intelligence

사람이 수행하던 지적 작업을 기계가 수행하게 하려는 가장 넓은 개념이다.

### Machine Learning

사람이 모든 규칙을 직접 작성하는 대신, 데이터에서 규칙과 패턴을 학습하도록 하는 방법이다.

### Deep Learning

여러 층의 Neural Network를 이용해 복잡한 패턴을 학습하는 Machine Learning의 한 분야다.

### LLM — Large Language Model

대규모 텍스트를 학습해 언어의 패턴을 모델링하고, 주어진 문맥에서 다음 Token을 예측하는 초대형 Deep Learning 모델이다. fileciteturn38file0L129-L148

이 관계를 이해하면 LLM을 단순한 "검색 엔진"이나 "대화 프로그램"으로 생각하는 오류를 줄일 수 있다.

---

## 3. Neural Network는 무엇인가?

가장 단순하게 표현하면 Neural Network는 **가중치(Weight)를 조절하는 계산 구조**다.

하나의 뉴런은 입력에 가중치를 곱하고 이를 조합해 다음 층으로 전달한다.

```text
Input
  │
  ▼
┌───────────────┐
│ Hidden Layer  │
│ Hidden Layer  │
│ Hidden Layer  │
└───────────────┘
  │
  ▼
Output
```

중요한 것은 개별 뉴런 하나가 아니라 **수많은 연결과 가중치가 함께 학습된다는 것**이다.

LLM에서는 이러한 파라미터가 매우 큰 규모로 존재한다. 발표 자료에서는 GPT급 모델의 파라미터를 수천억 개 규모로 설명한다. fileciteturn38file0L160-L218

따라서 LLM의 "지능"을 이해할 때는 특정 뉴런 하나보다 **모델 구조, 연결 규모, 그리고 학습된 Weight**를 보는 것이 중요하다.

---

## 4. 학습(Training)은 무엇을 하는가?

LLM의 학습을 아주 단순화하면 다음과 같다.

```text
예측
 ↓
정답과 비교
 ↓
Loss 계산
 ↓
Backpropagation
 ↓
Weight 수정
 ↓
반복
```

즉, **틀린 만큼 Weight를 수정하는 과정**이라고 생각할 수 있다.

### 4.1 Loss

모델의 예측과 정답 사이의 차이를 나타내는 값이다.

Loss가 작아지는 방향으로 모델을 업데이트한다.

### 4.2 Gradient Descent

발표 자료에서는 이를 "안개 속에서 산 내려오기"에 비유한다.

현재 위치에서 어느 방향으로 내려가야 Loss가 줄어드는지를 Gradient로 확인하고, Learning Rate만큼 이동한다.

```text
w ← w − η · ∂L/∂w
```

- `w` : Weight
- `L` : Loss
- `∂L/∂w` : Weight에 대한 Loss의 Gradient
- `η` : Learning Rate

Gradient가 양수이면 Weight를 줄이는 방향으로, 음수이면 Weight를 늘리는 방향으로 이동한다. Gradient가 거의 0이면 해당 지점에서 더 이상 크게 개선할 방향이 없다고 볼 수 있다. fileciteturn38file0L270-L294

### 4.3 Backpropagation

수십억 개의 Weight를 각각 어떻게 수정해야 하는지 계산하기 위해 출력에서 입력 방향으로 미분을 전달한다. 이 과정이 Backpropagation이다.

핵심은 복잡한 수학식을 직접 계산하는 것이 아니라 **"오차가 어느 방향으로 변하는지 계산하고 그 방향으로 Weight를 수정한다"**는 개념을 이해하는 것이다.

---

## 5. Token과 Embedding: 언어를 숫자로 바꾸기

컴퓨터가 문장의 의미를 그대로 읽는 것은 아니다.

LLM은 텍스트를 Token으로 나누고, 이를 숫자 벡터로 변환해 계산한다.

### Token

문장을 모델이 처리하는 단위로 나눈 것이다.

예를 들어 발표 자료에서는 다음과 같이 설명한다.

```text
"인공지능이"
      ↓
[인공] [지능] [이]
```

한국어는 같은 의미를 전달하더라도 영어와 비교해 Token이 더 많이 발생할 수 있기 때문에 Token 수가 비용과 직접 연결될 수 있다. fileciteturn38file0L306-L336

### Embedding

Token을 수백~수천 개 숫자의 좌표로 변환한다.

의미가 비슷한 Token은 벡터 공간에서 상대적으로 가까운 위치에 놓이도록 학습된다.

```text
        여왕
       /
왕 --- 남자
       \
        여자
```

이것이 LLM이 언어의 의미적 관계를 수치 계산으로 다룰 수 있는 기본적인 출발점이다.

---

## 6. Transformer와 Attention

현대 LLM을 이해하기 위해 가장 중요한 구조 중 하나가 **Transformer**다.

발표 자료에서는 Transformer를 다음과 같은 흐름으로 설명한다.

```text
Input Embedding
      ↓
Multi-Head Attention
      ↓
Add & Norm
      ↓
Feed-Forward Network
      ↓
Stacked Blocks × N
      ↓
Softmax
      ↓
Next Token Probability
```

핵심 아이디어는 **Attention이 문맥에서 어떤 부분을 중요하게 볼지 계산한다는 것**이다.

예를 들어,

> "그 은행은 강 옆에 있다."

라는 문장에서 `은행`을 해석할 때 `강`과 같은 주변 단어가 문맥 이해에 영향을 줄 수 있다.

발표 자료는 이 구조의 출발점으로 Vaswani et al.의 **Attention Is All You Need**를 소개한다. fileciteturn38file0L348-L379

---

## 7. Pre-training과 Post-training

LLM을 만든다고 해서 처음부터 질문에 잘 답하는 것은 아니다.

발표 자료에서는 모델 학습을 크게 **Pre-training → Post-training**으로 나누어 설명한다. fileciteturn38file0L401-L429

### 7.1 Pre-training

대규모 Corpus를 이용해 다음 Token을 예측하는 능력을 학습한다.

```text
Raw Corpus
   ↓
Cleaning
   ↓
Tokenization
   ↓
Embedding
   ↓
Transformer × N
   ↓
Base Model
```

정답지를 사람이 하나씩 만드는 대신 원래 문장 자체를 학습 신호로 사용할 수 있다는 점이 대규모 학습의 중요한 특징이다. fileciteturn38file0L441-L463

결과물은 **Base Model**이다.

Base Model은 언어 패턴과 지식을 학습하지만, 우리가 기대하는 Chat Assistant처럼 행동하도록 만들어진 것은 아니다.

또한 학습 이후의 사건이나 데이터는 학습 시점 이후의 Knowledge Cutoff 때문에 기본적으로 알 수 없다.

### 7.2 Post-training

Base Model을 실제 사용자와 대화할 수 있는 모델로 만들기 위해 추가 학습을 수행한다.

```text
Base Model
   ↓
SFT
   ↓
Preference Alignment / RLHF
   ↓
Aligned Chat Model
```

SFT는 지시를 따르는 형식을 학습시키고, RLHF와 같은 선호도 기반 정렬은 사람이 선호하는 답변의 특성을 반영한다. fileciteturn38file0L523-L539

즉,

> **Pre-training이 능력을 만들고, Post-training이 그 능력을 사용하기 좋은 형태로 만든다.**

라고 이해하면 된다.

---

## 8. 추론(Inference): LLM은 어떻게 답을 만드는가?

학습이 끝난 모델을 실제로 사용하는 단계가 **Inference**다.

가장 중요한 개념은 **Next Token Prediction**이다.

예를 들어,

```text
오늘
 ↓
회의
 ↓
자료를
 ↓
정리해
 ↓
...
```

처럼 이미 생성한 Token을 다시 입력에 포함시키면서 다음 Token을 하나씩 생성한다.

이를 자기회귀(Autoregressive) 방식이라고 볼 수 있다. 발표 자료의 핵심 표현은 **"LLM은 답을 찾는 것이 아니라 한 Token씩 생성한다"**는 것이다. fileciteturn38file0L607-L637

이 관점이 중요한 이유는 다음 장에서 설명할 **Hallucination**을 이해할 수 있기 때문이다.

---

## 9. Decoding: 같은 질문에 답이 달라지는 이유

LLM은 매 순간 다음 Token 후보들의 확률을 계산하고 그중 하나를 선택한다.

이 선택 과정에 영향을 주는 대표적인 설정이 다음과 같다.

| 설정 | 역할 |
|---|---|
| Temperature | 낮으면 일관성 증가, 높으면 다양성 증가 |
| Top-p | 선택 후보의 확률 범위를 제한 |
| Max Tokens | 생성 가능한 최대 길이 |
| System Prompt | 역할·말투·제약·기본 지시 설정 |

따라서 같은 질문이라도 Sampling 설정에 따라 결과가 달라질 수 있다. 발표 자료에서는 요약·분류처럼 일관성이 중요한 작업은 낮은 Temperature를 사용하는 방향으로 설명한다. fileciteturn38file0L649-L668

EDA Agent에서도 이 부분은 중요하다.

예를 들어 **"원인을 분석해줘"**라는 요청과 **"아래 report에서 violation을 모두 추출하고 path별 근거를 표로 출력해줘"**라는 요청은 AI가 수행해야 하는 작업의 성격이 다르다.

---

## 10. Context Window: 모델의 작업 공간

LLM이 한 번에 처리할 수 있는 정보의 양에는 한계가 있다.

이를 **Context Window**라고 생각할 수 있다.

```text
┌─────────────────────────────────┐
│ System Instruction              │
│                                 │
│ Attached Documents              │
│                                 │
│ Conversation History            │
│                                 │
│ User Question                   │
│                                 │
│ Output Space                    │
└─────────────────────────────────┘
```

입력과 출력이 같은 Context 공간을 나누어 사용하기 때문에 무조건 많은 문서를 넣는 것이 좋은 전략은 아니다.

발표 자료는 다음 세 가지 실무 관점을 강조한다.

- 긴 Context는 비용과 속도에 영향을 준다.
- 긴 문서를 통째로 넣는 것보다 필요한 부분만 넣는 것이 유리하다.
- 대화가 길어지면 초반 지시가 희석될 수 있으므로 중요한 지시는 다시 명시할 필요가 있다. fileciteturn38file0L680-L700

이것은 EDA Agent 설계에서 매우 중요하다.

수백 MB의 STA log나 수많은 report를 무작정 LLM에게 전달하는 것은 좋은 Agent Architecture가 아니다.

**필요한 데이터를 먼저 찾고, 필요한 부분만 LLM에 전달해야 한다.**

---

## 11. Hallucination: 왜 LLM은 틀린 답도 그럴듯하게 말하는가?

Hallucination은 LLM의 대표적인 한계다.

발표 자료에서는 세 가지 원인을 제시한다.

### 원인 1. 모르는 것도 그럴듯하게 생성

모델은 사실 여부를 직접 검증하는 검색 엔진이 아니다. 주어진 문맥에서 그럴듯한 다음 Token을 생성한다.

### 원인 2. Knowledge Cutoff

학습 데이터에 존재하지 않는 최신 정보나 사내 데이터는 기본 모델이 알지 못할 수 있다.

### 원인 3. 출처 없는 생성

모델이 답변을 생성한다고 해서 그 답변에 실제 근거 문서가 자동으로 연결되는 것은 아니다. fileciteturn38file0L713-L736

그래서 실무에서는 중요한 질문이 생긴다.

> **"모델이 모르는 것을 어떻게 알려줄 것인가?"**

여기서 Prompt, RAG, Fine-Tuning이라는 세 가지 접근이 등장한다.

---

## 12. Prompt Engineering

가장 먼저 시도할 수 있는 방법은 **모델을 바꾸지 않고 지시를 바꾸는 것**이다.

좋은 Prompt에는 일반적으로 다음 요소를 명확하게 넣을 수 있다.

- Role
- Goal
- Constraint
- Output Format
- Example
- 금지사항
- 모르는 경우의 처리 방법

예를 들어,

```text
나쁜 Prompt
"이 회의록 요약해줘"
```

보다

```text
당신은 PM입니다.
회의록에서
1. 결정사항
2. 담당자
3. 기한
을 표로 정리하세요.
각 항목의 근거 문장을 함께 표시하고,
언급되지 않은 항목은 '미정'으로 표시하세요.
```

와 같이 구체적으로 정의하는 것이 좋다.

Prompt Engineering은 문서 요약, 분류, 지정된 형식으로의 변환 등 다양한 작업에 빠르게 적용할 수 있지만, **모델이 모르는 사실 자체를 새롭게 만들어 주지는 않는다.** fileciteturn38file0L748-L768

---

## 13. RAG: 모델에게 외부 지식을 찾아서 읽게 하기

**RAG(Retrieval-Augmented Generation)**는 모델을 다시 학습시키는 대신, 질문과 관련된 외부 문서를 찾아 Context에 넣어주는 방식이다.

```text
User Question
      ↓
Search
      ↓
Vector DB
      ↓
Relevant Chunks
      ↓
Question + Evidence
      ↓
LLM
      ↓
Answer + Source
```

사내 문서나 최신 자료를 Embedding하여 Vector DB에 저장해두고, 질문과 의미가 가까운 문서 조각을 검색한다.

그 결과를 LLM의 Context에 추가하면 모델이 해당 문서를 근거로 답변할 수 있다. 발표 자료에서는 이를 최신·보안 문서를 반영하고 Hallucination을 줄이는 대표적인 방법으로 설명한다. fileciteturn38file0L780-L810

### Vector DB

Vector DB는 일반 DB와 검색 방식이 다르다.

| | 일반 DB | Vector DB |
|---|---|---|
| 저장 | 행·열 데이터 | 문서 조각 + Embedding |
| 검색 | Keyword / 조건 | 의미적 유사도 |
| 질의 | SQL | Similarity Search |
| 목적 | 정확한 값 조회 | 관련 내용 탐색 |

RAG의 품질은 LLM 자체뿐 아니라 **문서 Chunking, Embedding, Indexing, Retrieval 품질**에 크게 영향을 받는다. fileciteturn38file0L822-L873

---

## 14. Fine-Tuning: 모델의 Weight를 바꾸기

Fine-Tuning은 RAG와 완전히 다른 접근이다.

```text
Domain Dataset
      ↓
Fine-Tuning
      ↓
Updated Model Weights
      ↓
Domain-specific Model
```

즉, 외부 문서를 매번 검색해서 넣는 것이 아니라 **모델의 Weight 자체를 추가 학습**한다.

발표 자료에서는 Fine-Tuning이 지식을 단순히 넣는 것보다 **특정 형식과 태도, 전문적인 응답 방식**을 학습시키는 데 강하다고 설명한다. LoRA와 같은 경량화 방법을 이용하면 학습 비용을 낮출 수 있다. fileciteturn38file0L885-L904

따라서 다음과 같이 생각하면 이해하기 쉽다.

```text
Prompt
  → 지시를 잘한다

RAG
  → 필요한 지식을 찾아준다

Fine-Tuning
  → 모델의 응답 방식 자체를 바꾼다
```

---

## 15. Prompt vs RAG vs Fine-Tuning

실무에서는 세 가지 방법 중 하나만 고르는 것이 아니라 문제의 원인에 따라 조합한다.

| | Prompt | RAG | Fine-Tuning |
|---|---|---|---|
| 해결 문제 | 지시가 모호함 | 사실·최신성 부족 | 형식·말투·전문 응답 |
| 도입 속도 | 즉시 | 수 주 수준 | 수 주~수 개월 수준 |
| 초기 비용 | 낮음 | 중간 | 높음 |
| 최신 정보 | 어려움 | 쉬움 | 재학습 필요 |
| 출처 제시 | 어려움 | 가능 | 어려움 |

발표 자료가 제시하는 실무 원칙은 간단하다.

> **Prompt로 먼저 검증하고, 근거가 필요하면 RAG를 얹고, 그래도 응답 형식이나 동작 특성이 충분하지 않다면 Fine-Tuning을 검토한다.** fileciteturn38file0L916-L951

---

## 16. LLM 비용을 이해하려면 Token을 봐야 한다

AI 서비스를 실제 시스템에 넣기 시작하면 정확도만큼 중요한 것이 **Cost**다.

발표 자료에서는 토큰 비용이 증가하는 주요 원인으로 다음을 제시한다.

1. 긴 Context
2. 추론형 모델의 긴 생성 과정
3. Agent의 반복적인 모델 호출
4. 멀티모달 입력과 대형 모델 사용 fileciteturn38file0L1045-L1061

그리고 다음과 같은 최적화 방법을 제안한다.

- Model Routing
- Prompt Caching
- Context Compression
- 정밀한 RAG 검색
- 출력 길이 제한
- Quantization / Distillation

핵심 원칙은 **먼저 Token을 적게 사용하도록 Architecture를 설계한 다음, 더 저렴한 Infrastructure를 선택하는 것**이다. fileciteturn38file0L1062-L1081

이 원칙은 EDA Agent에서도 그대로 적용된다.

예를 들어 하나의 STA 분석 작업에서 Agent가 LLM을 10번 호출하는 구조와, 필요한 정보를 한 번에 정리해 2~3번 호출하는 구조는 동일한 기능이라도 비용과 Latency가 크게 달라질 수 있다.

---

## 17. KV Cache와 Memory Budget

LLM Inference 성능을 이해하려면 **KV Cache**도 알아둘 필요가 있다.

LLM은 새로운 Token을 생성할 때 이전 Context의 Key와 Value 정보를 반복해서 계산하지 않도록 Cache에 저장해 재사용할 수 있다.

```text
Previous Context
      ↓
Key / Value 계산
      ↓
KV Cache
      ↓
새 Token 생성 시 재사용
```

발표 자료에서는 KV Cache가 긴 Context에서 GPU Memory 사용량의 중요한 요소가 되며, MQA/GQA, PagedAttention, Cache Quantization 등의 방법과 함께 고려할 수 있다고 설명한다. fileciteturn38file0L1093-L1117

LLM Serving의 Memory를 단순화하면 다음과 같이 볼 수 있다.

```text
GPU Memory
├── Model Weights   ← 고정비
├── KV Cache        ← Context × 요청 수에 따라 증가
└── Runtime Overhead
```

발표 자료의 개략적인 식은 다음과 같다.

```text
Weight Memory ≈ Parameter Count × Bytes per Parameter

KV Cache ≈
2 × Layers × Hidden Dimension × Tokens
× Precision × Concurrent Requests
```

따라서 **모델이 GPU에 올라간다고 끝나는 것이 아니라, 남은 Memory가 Context와 동시 요청을 얼마나 수용할 수 있는지를 결정한다.** fileciteturn38file0L1129-L1155

---

## 18. LMOps: 모델을 운영하는 단계

LLM을 실제 서비스에 적용하면 "어떤 모델을 사용할까?"라는 질문만으로 끝나지 않는다.

데이터를 수집하고, 모델을 적용하고, 운영하면서 품질과 비용을 계속 개선해야 한다.

발표 자료에서는 이를 **LMOps(Language Model Operations)** 관점에서 다음과 같이 구성한다.

```text
1. Data Collection
   ├── 사내 문서·로그
   ├── 정제·중복 제거
   └── 보안 등급 분류

          ↓

2. Model Development / Adaptation
   ├── Prompt
   ├── RAG
   └── Fine-Tuning

          ↓

3. Deployment / Operation
   ├── API Serving
   ├── Quality Monitoring
   ├── Hallucination Monitoring
   └── Feedback

          ↓

4. Cost Optimization
   ├── Model Selection
   ├── Cache
   └── Quantization

          ↺
       Continuous Improvement
```

평가 지표도 하나가 아니다.

- **Quality** — 정확도, Hallucination
- **Latency** — 응답 시간
- **Cost** — Token 및 운영 비용

이 세 가지를 함께 관리해야 실제 AI 시스템이 된다. fileciteturn38file0L1167-L1208

---

## 19. 이제 EDA Agent를 생각해보자

여기까지 이해하면 EDA Agent의 구조를 훨씬 현실적으로 볼 수 있다.

EDA Agent를 단순히 **"LLM에게 EDA 질문을 하는 Chatbot"**으로 생각하면 한계가 명확하다.

실제 EDA Agent는 다음과 같은 여러 요소의 결합으로 보는 것이 적절하다.

```text
                    Engineer
                       │
                       ▼
              ┌─────────────────┐
              │   EDA Agent     │
              │                 │
              │ Planning        │
              │ Reasoning       │
              │ Tool Selection  │
              │ Context Mgmt    │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       RAG / DB     EDA Tools     Reports
          │            │            │
          ▼            ▼            ▼
      Knowledge    PrimeTime     STA / P&R
      Base        Tempus        Logs
                  Innovus       SDC
                       │
                       ▼
                Result / Evidence
                       │
                       ▼
                 Engineer Review
```

예를 들어 다음 요청을 생각해보자.

> **"Setup violation의 주요 원인을 분석하고 개선 방향을 제안해줘."**

Agent는 단순히 LLM 내부 지식만 사용해서 답해서는 안 된다.

### Step 1 — Context 확보

현재 Design, Scenario, Corner, Mode, Constraint 등의 정보를 확인한다.

### Step 2 — Tool 실행

필요하면 PrimeTime, Tempus 등의 STA Tool을 실행하거나 이미 생성된 Report를 조회한다.

### Step 3 — 관련 데이터 검색

과거 ECO 결과, Methodology 문서, Constraint 가이드 등의 내부 Knowledge를 RAG로 검색할 수 있다.

### Step 4 — 분석

LLM은 수집된 데이터를 기반으로 violation의 패턴과 원인을 설명한다.

### Step 5 — Recommendation

가능한 ECO 방향을 제안한다.

### Step 6 — 검증

실제 Tool을 다시 실행해 Before/After 결과를 비교한다.

즉,

```text
LLM
 +
EDA Tool
 +
EDA Data
 +
RAG / Knowledge
 +
Workflow / Orchestration
 +
Verification
```

의 조합이 EDA Agent의 핵심이 된다.

---

## 20. EDA Agent에서 특히 중요한 세 가지

앞에서 설명한 LLM 기초를 EDA 관점으로 다시 보면 중요한 포인트가 세 가지로 정리된다.

### 20.1 LLM은 모든 EDA 지식을 기억하는 Database가 아니다

최신 Design 상태, 현재 STA 결과, 사내 Methodology, 특정 Project의 Constraint는 모델 Weight 안에 들어 있지 않을 수 있다.

따라서 **RAG + Tool Access + Context Management**가 필요하다.

### 20.2 LLM의 답은 반드시 Evidence와 연결해야 한다

EDA에서는 "그럴듯한 답"보다 **근거가 있는 답**이 중요하다.

예를 들어,

```text
Violation: U123/A → U456/Z
Slack: -0.083 ns
Corner: SS / 0.72V / 125C
Path Group: reg2reg

Root Cause:
  → Cell delay 증가
  → Congestion 영향 가능성

Evidence:
  report_timing line 2381~2410
```

처럼 분석 결과와 근거를 연결하는 구조가 필요하다.

### 20.3 Agent는 반드시 Verification Loop를 가져야 한다

AI가 ECO를 제안했다고 해서 그것이 실제로 Timing Closure를 달성하는 것은 아니다.

따라서 다음과 같은 Loop가 필요하다.

```text
Analyze
  ↓
Recommend
  ↓
Apply
  ↓
Run EDA Tool
  ↓
Measure
  ↓
Verify
  ↓
Next Action
```

이 부분에서 **EDA Agent는 일반적인 Chatbot보다 훨씬 더 Engineering System에 가깝다.**

---

## 21. 정리

이 글의 전체 내용을 하나의 흐름으로 압축하면 다음과 같다.

```text
Neural Network
      ↓
Training
      ↓
Pre-training / Post-training
      ↓
LLM
      ↓
Inference
      ↓
Next Token Prediction
      ↓
Hallucination / Context Limitation
      ↓
Prompt / RAG / Fine-Tuning
      ↓
LMOps
      ↓
AI Agent
      ↓
EDA Agent
```

발표 자료의 결론처럼 중요한 것은 단순히 "AI를 잘 사용하는 것"이 아니다.

> **원리를 이해하면 질문이 달라지고, 질문이 달라지면 결과가 달라진다.** fileciteturn38file0L1017-L1037

그리고 EDA Agent를 만들 때는 한 단계 더 나아가야 한다.

> **LLM을 EDA에 붙이는 것이 목적이 아니라, LLM + EDA Tool + Design Data + Knowledge + Verification을 하나의 Engineering Loop로 만드는 것이 목적이다.**

다음 단계에서는 이 개념을 바탕으로 **EDA Agent Architecture**, **Tool Calling**, **RAG 기반 EDA Knowledge Base**, **STA/Timing Closure Agent**, 그리고 궁극적으로 **EDA Unified IDE + AI Agent**로 확장할 수 있다.

---

## 참고 자료

- 발표 자료: *LLM 신경망(Neural Network) 학습부터 추론 원리, 그리고 실무 적용 솔루션* fileciteturn38file0L28-L32
- Vaswani et al., *Attention Is All You Need* — Transformer와 Self-Attention의 출발점으로 발표 자료에서 소개됨. fileciteturn38file0L348-L379
