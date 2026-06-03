---
title: "Denver Metro: Where Buyers Get the Most Walkability for Their Dollar"
date: 2025-01-15
excerpt: "A decision-support example for real estate agents: combine public housing and walkability data to identify which neighborhoods give buyers the most walkability for their budget."
layout: single
author_profile: true
categories:
  - Data
tags:
  - Denver
  - walkability
  - housing
  - Census
  - EPA
  - data science
  - real estate
---

Buyers who want walkability do not always have downtown Denver or Boulder budgets. That creates a practical question for agents: **where can a buyer get the most walkable neighborhood for the money?**

This is a small **Answer** engagement: take public data, turn it into a buyer-facing ranking, and give the agent a clearer recommendation than "look near downtown."

## The data used

Median home value comes from the Census Bureau's American Community Survey 5-year table B25077 for tracts in Adams, Arapahoe, Boulder, Broomfield, Denver, Douglas, and Jefferson counties. Walkability comes from the [EPA National Walkability Index](https://catalog.data.gov/dataset/walkability-index8), aggregated to tract.

The decision metric is the **walk rank ratio**:

`walkability rank / median home value rank`

A ratio above 1 means the tract ranks better on walkability than it does on price. In plain English: more walkability than the price rank would suggest.

---

## What the analysis found

- **Best value for walkability-minded buyers:** Top tracts by walk rank ratio cluster in lower-priced counties (Adams, Arapahoe, Broomfield) where solid walkability meets lower median home values. These tracts rank high on walkability but lower on price—excellent for clients seeking walkable neighborhoods without premium pricing.
- **Denver County & Boulder:** Downtown Denver offers high absolute walkability but also high prices, so the rank ratio is often closer to 1. Boulder has among the highest walkability and highest prices in the metro, so walk rank ratios there are typically below 1—these are premium walkable areas, useful context when clients are weighing location versus budget.
- **Metro-wide spread:** Walk rank ratios vary significantly across the metro, allowing you to quickly identify which neighborhoods offer the best walkability value relative to price. Using this metric helps you surface neighborhoods that deliver walkability for the money and tailor your search strategy to each client's priorities.

## The decision it enables

An agent can use this output in buyer consultations, listing one-pagers, or neighborhood comparisons. It gives a source-based answer to a common client tradeoff: where to look when walkability matters but premium-core pricing is not realistic.

**Top 30 tracts by walk rank ratio** — Use this chart to compare neighborhoods quickly. Hover for tract ID, county, median home value, and walkability index.

<figure style="margin: 1.5em 0;">
  <div id="denver-walkability-chart" style="width:100%; height:720px;"></div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#666;">Top 30 Denver-area tracts by walk rank ratio. Higher ratio = higher walkability rank relative to price rank. Data: Census ACS B25077, EPA Smart Location Database.</figcaption>
</figure>

<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script>
(function() {
  const dataUrl = "{{ site.baseurl }}/assets/data/denver_walk_rank_ratio.json";
  fetch(dataUrl)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || data.length === 0) {
        document.getElementById("denver-walkability-chart").innerHTML = "<p>No data available. Run <code>export_for_blog.py</code> in the denver_zips project to generate the chart data.</p>";
        return;
      }
      var labels = data.map(function(d) { return d.label; });
      var values = data.map(function(d) { return d.walk_rank_ratio; });
      var trace = {
        x: values,
        y: labels,
        type: "bar",
        orientation: "h",
        marker: { color: "rgba(31, 119, 180, 0.8)" },
        text: values.map(function(v) { return v.toFixed(2); }),
        textposition: "outside",
        hovertemplate: "%{y}<br>Walk rank ratio: %{x:.2f}<extra></extra>"
      };
      var layout = {
        margin: { l: 200, r: 60, t: 24, b: 48 },
        xaxis: { title: "Walk rank ratio (walkability rank / price rank)", zeroline: true, zerolinewidth: 2, zerolinecolor: "#333" },
        yaxis: { autorange: "reversed", tickfont: { size: 10 } },
        showlegend: false,
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)"
      };
      var config = { responsive: true };
      Plotly.newPlot("denver-walkability-chart", [trace], layout, config);
    })
    .catch(function(err) {
      document.getElementById("denver-walkability-chart").innerHTML = "<p>Chart data could not be loaded.</p>";
    });
})();
</script>

**Interactive map** — Tracts are colored by walk rank ratio (darker = higher ratio). Use it to show clients where the best-value walkable areas are; hover for tract details.

<figure style="margin: 1.5em 0;">
  <div id="denver-tracts-map" style="width:100%; height:520px; border:1px solid #ddd;"></div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#666;">Denver metro census tracts by walk rank ratio. Data: Census ACS B25077, EPA Smart Location Database.</figcaption>
</figure>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
(function() {
  var baseUrl = "{{ site.baseurl }}";
  if (!baseUrl) baseUrl = "";
  fetch(baseUrl + "/assets/data/denver_tracts_walkability.geojson")
    .then(function(r) { return r.json(); })
    .then(function(geojson) {
      var features = geojson.features || [];
      var values = features
        .map(function(f) { return f.properties && f.properties.walk_rank_ratio; })
        .filter(function(v) { return v != null && !isNaN(v) && v > 0; });
      var sorted = values.slice().sort(function(a,b){ return a - b; });
      var n = sorted.length;
      function percentile(p) {
        if (n === 0) return 0;
        var idx = Math.max(0, Math.min(n - 1, Math.floor((p / 100) * (n - 1))));
        return sorted[idx];
      }
      var min = n ? percentile(2) : 0;
      var max = n ? percentile(98) : 1;
      if (max <= min) max = min + 1;

      function getColor(d) {
        if (d == null || isNaN(d) || d <= 0) return "#e0e0e0";
        var t = (d - min) / (max - min);
        t = Math.max(0, Math.min(1, t));
        var r = Math.round(239 - t * 156);
        var g = Math.round(243 - t * 168);
        var b = Math.round(255 - t * 184);
        return "#" + [r,g,b].map(function(x){ return x.toString(16).padStart(2,"0"); }).join("");
      }

      var map = L.map("denver-tracts-map", { scrollWheelZoom: true }).setView([39.7392, -104.9903], 9);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap, &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      function onEachFeature(feature, layer) {
        var p = feature.properties || {};
        var ratio = p.walk_rank_ratio;
        var med = p.median_home_value;
        var walk = p.walkability_index;
        var msg = "<b>" + (p.COUNTY || "—") + "</b> (Tract " + (p.GEOID || "—") + ")<br/>";
        msg += "Walk rank ratio: " + (ratio != null ? ratio.toFixed(2) : "—") + "<br/>";
        msg += "Median home value: " + (med != null ? "$" + med.toLocaleString() : "—") + "<br/>";
        msg += "Walkability index: " + (walk != null ? walk.toFixed(1) : "—");
        layer.bindTooltip(msg, { sticky: true, className: "denver-map-tooltip", direction: "top" });
      }

      L.geoJSON(geojson, {
        style: function(feature) {
          var v = feature.properties && feature.properties.walk_rank_ratio;
          return {
            fillColor: getColor(v),
            weight: 0.8,
            opacity: 0.8,
            color: "#333",
            fillOpacity: 0.7
          };
        },
        onEachFeature: onEachFeature
      }).addTo(map);
    })
    .catch(function(err) {
      document.getElementById("denver-tracts-map").innerHTML = "<p>Map data could not be loaded.</p>";
    });
})();
</script>

---

## Who should care

This is for real estate professionals who need more than a generic neighborhood report. The broader pattern applies to any SMB operator with a recurring "where should we focus?" question: combine credible external data with the business decision, then turn it into a ranked action list.

If you would like custom walkability-to-price or neighborhood reports for a specific area, listing presentation, or buyer segment, [get in touch]({{ site.baseurl }}/contact/). I can produce tailored data views and visuals for your practice.
