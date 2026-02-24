---
permalink: /blog/
title: "Blog"
excerpt: "Data science notes and project write-ups."
layout: single
author_profile: true
---

Posts and project write-ups.

{% for post in site.posts %}
## [{{ post.title }}]({{ post.url }})
**{{ post.date | date: "%B %d, %Y" }}**  
{{ post.excerpt | markdownify }}

{% endfor %}
