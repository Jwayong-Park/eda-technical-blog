---
layout: post
title: "Synopsys, Cadence, Siemens EDA Tool을 하나의 Platform에서 사용할 수 있을까?"
subtitle: "VS Code for EDA"
description: "Synopsys · Cadence · Siemens EDA의 서로 다른 Engine을 하나의 Engineering Environment에서 연결하는 EDA Unified IDE의 개념과 Architecture."
category: "EDA Platform"
tags:
  - EDA
  - Implementation
  - AI
permalink: /posts/eda-unified-ide.html
---

## 1. 왜 EDA Unified IDE인가?

반도체 설계에서는 하나의 Vendor Tool만 사용하는 경우보다 Synopsys, Cadence, Siemens EDA의 여러 Tool을 조합해 하나의 Design Flow를 구성하는 경우가 많다.

문제는 각 Tool이 서로 다른 GUI, Database, Command와 실행 환경을 가지고 있다는 것이다. 따라서 Engineer는 Tool마다 다른 환경을 오가야 한다.

> **핵심 아이디어**
>
> 기존 EDA Engine을 대체하는 것이 아니라, 그 위에 하나의 **IDE + Flow Orchestrator + Common Data Model + AI Agent**를 제공한다.

## 2. Vendor Tool Ecosystem

**Synopsys** — PrimeTime, IC Compiler II, Design Compiler, PrimePower

**Cadence** — Tempus, Innovus, Genus, Voltus

**Siemens EDA** — Calibre, Questa, Aprisa

## 3. Proposed Architecture

```text
                    ┌───────────────────────────────┐
                    │       EDA UNIFIED IDE         │
                    │                               │
                    │ Project / Design / Run        │
                    │ Console / Timing / Reports    │
                    └───────────────┬───────────────┘
                                    │
                           EDA ORCHESTRATOR
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
        ┌────▼────┐            ┌────▼────┐            ┌────▼────┐
        │ Synopsys│            │ Cadence │            │ Siemens │
        └────┬────┘            └────┬────┘            └────┬────┘
             │                      │                      │
        PrimeTime               Tempus                  Calibre
        ICC2                    Innovus                 Questa
        DC                      Genus                   Aprisa

                    Common Data / Artifact Layer

              RTL / SDC / LEF / DEF / SPEF / UPF
                    Liberty / GDS / Reports
```

## 4. Tool Adapter Layer

사용자는 공통 명령을 사용하고, Adapter가 실제 Vendor별 command로 변환한다.

```text
run_sta()
   ↓
EDA Tool Adapter
   ├── SynopsysAdapter → PrimeTime
   ├── CadenceAdapter  → Tempus
   └── SiemensAdapter  → Calibre
```

## 5. Unified Timing Closure Flow

예를 들어 사용자가 IDE에서 **“Analyze setup violations”**를 실행하면 다음과 같은 흐름을 만들 수 있다.

1. STA report 분석
2. Critical path 추출
3. PrimeTime / Tempus 결과 비교
4. Physical information 확인
5. Congestion 분석
6. ECO candidate 생성
7. ECO 적용 후 STA 재실행
8. Before / After 결과 비교

## 6. AI EDA Agent

```text
Engineer
   │
   │ "Setup violation 원인을 분석해줘"
   ▼
┌──────────────────────────┐
│       EDA AI Agent       │
├──────────────────────────┤
│ Log Analyzer             │
│ Timing Analyzer          │
│ Constraint Analyzer      │
│ ECO Advisor              │
│ Flow Optimizer           │
└─────────────┬────────────┘
              │
       PrimeTime / Tempus / Innovus
              │
              ▼
       Correlation Analysis
              │
              ▼
       ECO Recommendation
```

## 7. 현실적인 MVP

1. **Phase 1:** Unified Launcher, Project Management, Log Viewer, Job Monitor
2. **Phase 2:** Flow Orchestrator
3. **Phase 3:** Common Data Model 및 Cross-tool correlation
4. **Phase 4:** AI EDA Agent

## 8. 결론

EDA Unified IDE의 목표는 Synopsys, Cadence, Siemens의 강력한 Engine을 하나의 Tool로 대체하는 것이 아니다.

기존 Engine을 그대로 사용하면서 **IDE + Orchestrator + Common Data Model + AI Agent**를 그 위에 제공하는 것이다.
