---
title: "rePRICE: Know What It's Worth Before You Name a Number"
date: 2026-03-06
excerpt: "Pricing used inventory is a guessing game—until you ground it in real market data. rePRICE scrapes live eBay listings and uses AI to reason over actual comparables, producing confident price estimates in under a second."
layout: single
author_profile: true
categories:
  - Data
tags:
  - RAG
  - LLM
  - Claude
  - vector database
  - eBay
  - Python
  - bicycles
---

Pricing used inventory is a guessing game. You either trust gut feel, scan a few recent listings yourself, or lean on a reference sheet that was accurate six months ago—and any of those approaches will cost you, either in margin left behind or deals that fall apart because you came in too high. The real answer is to look at what comparable items are actually selling for right now, and reason from that.

## The demo

I built **rePRICE** to do exactly that for used bikes. You give it a make, model, year, and condition—it pulls live comparable sales, computes market statistics, and hands back a price card in under a second:

```
====================================================
  Trek FX 3  [good]
====================================================
  Estimated price : $310
  Price range     : $260 – $360
  Confidence      : high
  Reasoning       : Strong comparable sales in Seattle market with recent
                    2021 models selling at this range.
  Key factors     :
    - Aluminum frame holds value well
    - Minor cosmetic wear typical for good condition
    - Active Seattle commuter bike demand
```

That estimate is grounded in the same listings a buyer would find if they searched eBay themselves—not a static table, not a guess.

## How it works

The tool scrapes live eBay listings for whatever bike you're valuing, stores them in a searchable database, and when you ask for a price, it finds the closest real-world comparables—matching on make, model, condition, and geography—then hands those listings and their statistics to an AI model to reason over. If the database doesn't have an exact match, it widens the search automatically until it finds enough evidence to work with. The number you get isn't a guess; it's the same conclusion a careful human would reach after an hour of research, done in seconds.

![rePRICE system architecture: scrape, store, retrieve, price](/assets/images/reprice/architecture.png)

## This isn't really about bikes

Used bikes are a convenient example, but the problem is universal. A **pawn shop** deciding what to offer on a guitar before the customer walks out. A **used furniture dealer** sizing up an estate purchase without time to do a full market sweep. A **consignment shop** trying to move inventory at the right price without leaving margin behind. Anywhere you price assets in a market that moves—week to week, city to city—the cost of being wrong adds up fast, and the solution is the same: ground your estimates in real, current data.

---

If you price something for a living and want to stop relying on gut feel, I'd like to hear about your situation. [Get in touch](/contact).
