---
title: "Birmingham MSA Business Penetration: How the Metro Compares to the Top 50"
date: 2025-02-23
excerpt: "Using Census County Business Patterns data, I compared the Birmingham-Hoover metro's industry mix to the 50 most populous U.S. MSAs—where we're over- or under-represented and why it matters."
layout: single
author_profile: true
categories:
  - Data
tags:
  - Census
  - Birmingham
  - NAICS
  - business penetration
  - data science
---

How does the Birmingham-Hoover metro's business landscape compare to the rest of the country? In the Brookings report *[Birmingham's Tipping Point](https://www.brookings.edu/articles/achieving-inclusive-prosperity-in-birmingham/)* (2021), the region is described as at a crossroads: either tip toward inclusive prosperity—buoyed by efforts like the Switch innovation district, Birmingham Promise, HealthTech, and Black-owned business acceleration—or lapse into the same structural headwinds that left Birmingham with the second-lowest job growth among large metros after the Great Recession and the worst racial disparities in business ownership. A central theme of that work is **job creation**: the region needs more growth in dynamic, tradable industries and in young and scaling businesses, not only in locally serving sectors. Knowing *where* Birmingham's industry mix stands relative to the nation's largest metros is one way to ground that conversation in data.

I used **U.S. Census Bureau County Business Patterns (CBP)** data to measure *business penetration*—establishments per 10,000 people—by NAICS 3-digit subsector for the Birmingham MSA and the aggregate of the 50 most populous MSAs. Same methodology, same year (2023), so the comparison is apples-to-apples. The result is a snapshot of which subsectors Birmingham is over- or under-represented in relative to those peers. That doesn't tell the full story (ownership, job quality, and firm age matter too), but it does show whether the metro's business mix looks more like a typical top-50 metro or skewed toward certain industries—information that matters for economic development, talent strategy, and the kind of inclusive growth the Brookings report and efforts like Prosper are aiming for.

**Data and definitions:** CBP provides establishment and employment counts by industry and geography. I pulled 2023 CBP at the MSA level, matched it with ACS population for the top 50 MSAs by population, and computed penetration as (establishments / population) × 10,000. Industries are NAICS 3-digit (subsectors). Birmingham-Hoover is MSA code 13820 and sits in that top-50 list, so it's included in both the “Birmingham” slice and the “top 50” aggregate (with Birmingham excluded from the aggregate when comparing).

**Headline findings:**

- **Over-represented:** Birmingham’s highest penetration ratios vs. the top-50 average are in **logging** (7.3×), **lime and gypsum product manufacturing** (5.4×), **support activities for forestry** (4.9×), **sawmills and wood preservation** (4.3×), and **timber tract operations** (4.3×). Also well above average: **clay product and refractory manufacturing**, **nonmetallic mineral mining**, **foundries**, **specialty hospitals**, **iron and steel**, **gasoline stations**, **religious organizations**, **cement and concrete**, and **nondepository credit intermediation**—reflecting the metro’s natural-resource, manufacturing, and brick-and-mortar retail base.
- **Under-represented:** The metro runs below the top-50 average in **independent artists, writers, and performers** (0.17×), **taxi and limousine service** (0.18×), **sound recording** (0.21×), **cut and sew apparel manufacturing** (0.22×), **agents and managers for artists/athletes/entertainers** (0.24×), plus **motion picture and video**, **performing arts**, **electronic shopping and mail-order**, **computer systems design**, **management consulting**, and **scientific R&D**—typical for a mid-sized Southern metro vs. the aggregate of the largest U.S. metros.
- **Overall:** The average ratio (Birmingham / top-50) across all NAICS 3-digit subsectors in this run is **1.10**—so Birmingham has about **10% more** business establishments per capita than the top-50 average overall, despite being under-represented in many tech and professional-services sectors.

**Why this analysis matters:** The Brookings report argues that Birmingham’s recovery and long-term transformation depend on *job creation* in the right kinds of industries—startups, “missing middle” businesses that scale, and clusters like HealthTech that sell beyond the local market. Penetration is a simple proxy for industry mix: where Birmingham is over-represented, the metro has more establishments per capita than the top-50 average; where it’s under-represented, it has fewer. The pattern we see—strong in natural resources, manufacturing, and some locally serving sectors; weaker in information, professional and technical services, and performing arts—lines up with the report’s point that the region has not yet replaced the industries that once drove growth with enough new, tradable-industry dynamism. That doesn’t mean the over-represented sectors are “bad” or the under-represented ones “good” in isolation; it means that if the goal is to tip toward inclusive prosperity, strategies that target job creation (startups, HealthTech, Black-owned business acceleration, business advisory services) can use this kind of benchmark to see where the metro already has density and where there’s room to grow.

The charts below summarize the comparison: where Birmingham is over- or under-represented (ratio &gt; 1 or &lt; 1), the scatter of Birmingham vs. top-50 average penetration by industry, and the full percentage difference by industry.

![Top 15 over- and under-represented industries in Birmingham vs top 50 MSAs](/assets/images/birmingham-penetration/birmingham_over_under_bars.png)

*Green: over-represented (ratio &gt; 1). Red: under-represented (ratio &lt; 1).*

![Birmingham vs Top 50 average penetration by NAICS subsector](/assets/images/birmingham-penetration/birmingham_scatter.png)

*Points above the diagonal line indicate higher penetration in Birmingham than in the top-50 average.*

<figure style="margin: 1.5em 0;">
  <div id="birmingham-pct-difference-chart" style="width:100%; height:720px;"></div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#666;">Percentage difference: Birmingham vs Top 50 MSAs by NAICS subsector. Hover for values. Green = over-represented, red = under-represented.</figcaption>
</figure>

<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script>
(function() {
  const dataUrl = "{{ site.baseurl }}/assets/data/birmingham_pct_difference.json";
  fetch(dataUrl)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var labels = data.map(function(d) { return d.naics + ": " + d.label; });
      var pct = data.map(function(d) { return d.pct_difference; });
      var colors = pct.map(function(v) { return v >= 0 ? "#2ecc71" : "#e74c3c"; });
      var trace = {
        x: pct,
        y: labels,
        type: "bar",
        orientation: "h",
        marker: { color: colors },
        text: pct.map(function(v) { return v.toFixed(1) + "%"; }),
        textposition: "outside",
        hovertemplate: "%{y}<br>%{x:.1f}%<extra></extra>"
      };
      var layout = {
        margin: { l: 220, r: 40, t: 24, b: 48 },
        xaxis: { title: "Percentage difference (%)", zeroline: true, zerolinewidth: 2, zerolinecolor: "#333" },
        yaxis: { autorange: "reversed", tickfont: { size: 10 } },
        showlegend: false,
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)"
      };
      var config = { responsive: true };
      Plotly.newPlot("birmingham-pct-difference-chart", [trace], layout, config);
    })
    .catch(function(err) {
      document.getElementById("birmingham-pct-difference-chart").innerHTML = "<p>Chart data could not be loaded. <a href=\"/assets/images/birmingham-penetration/birmingham_pct_difference_bars.png\">View static image</a>.</p>";
    });
})();
</script>
