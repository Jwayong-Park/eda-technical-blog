---
layout: post
title: "Article Title"
subtitle: "Short subtitle"
description: "한두 문장으로 이 글에서 무엇을 설명하는지 요약합니다."
author: "Jwayong Park"
category: "STA"
tags:
  - STA
  - Timing
permalink: /posts/article-slug.html
# read_time: 15
---

본문은 다음 원칙으로 작성합니다.

- **설명 → Figure → 핵심 포인트 → Engineering Insight** 순서로 구성합니다.
- 복잡한 구조는 가능하면 SVG Figure로 시각화합니다.
- 중요한 결론은 `.insight-box`를 사용해 강조할 수 있습니다.

## 1. Introduction

이 섹션에서는 문제와 배경을 설명합니다.

### Concept Cards

필요하면 다음과 같은 3-column Card를 사용할 수 있습니다.

<div class="concept-grid">
  <div class="concept-card">
    <div class="concept-icon">◎</div>
    <h3>핵심 개념</h3>
    <p>이 개념이 무엇인지 짧게 설명합니다.</p>
  </div>
  <div class="concept-card">
    <div class="concept-icon">⌁</div>
    <h3>동작 원리</h3>
    <p>어떻게 동작하는지 설명합니다.</p>
  </div>
  <div class="concept-card">
    <div class="concept-icon">◎</div>
    <h3>Engineering Point</h3>
    <p>실무에서 왜 중요한지 설명합니다.</p>
  </div>
</div>

<div class="insight-box">핵심 Insight: 독자가 이 섹션에서 반드시 기억해야 할 한 문장을 적습니다.</div>

## 2. Main Topic

기술적인 내용을 설명합니다.

<figure class="article-figure">
  <img src="{{ '/assets/images/example.svg' | relative_url }}" alt="Technical architecture diagram" loading="lazy">
  <figcaption>Figure 1. Technical architecture / flow</figcaption>
</figure>

## 3. Engineering Example

필요한 경우 다음과 같이 code block을 사용합니다.

```text
Example architecture or command output
```

## 4. Conclusion

핵심 내용을 정리하고 실제 Engineering 관점의 결론을 작성합니다.
