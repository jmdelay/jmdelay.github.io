---
permalink: /blog/
title: "Case Studies"
excerpt: "Worked examples of where margin leaks, trapped cash, and operational waste show up—and what operators can do about it."
layout: single
author_profile: true
---

These are decision-support examples—not vanity content. Each one shows where margin leaks, trapped cash, or operational waste shows up in a real business model, and what an operator could do about it. Healthcare and ops-margin examples first; other verticals show the same decision-support pattern.

If you're wondering whether this kind of work fits your situation, start here—or [book a free audit](/audit/).

{% for post in site.posts %}
## [{{ post.title }}]({{ post.url }})
**{{ post.date | date: "%B %d, %Y" }}**  
{{ post.excerpt | markdownify }}

{% endfor %}
