---
title: "Denver Metro: Walkability-to-Price Ratio by Census Tract"
date: 2025-01-15
excerpt: "Where do you get the most walkability per dollar in the Denver metro? I combined Census median home values with the EPA walkability index to rank census tracts by walkability per $100k of home value."
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
---

The most useful way to compare neighborhoods for someone who cares about both walkability and cost is the **walkability-to-price ratio**: how much walkability you get per dollar of housing. In the Denver metro and Boulder County, I combined **Census ACS 5-year median home value** (B25077) with the **EPA National Walkability Index** (Smart Location Database) at the census tract level, then computed *walkability per $100k*—(walkability index × 100,000) ÷ median home value. Higher means more walkability per dollar; the best-value tracts often have moderate walkability and lower prices rather than the highest absolute walkability.

**Data:** Median home value is from the Census Bureau’s American Community Survey 5-year (table B25077, owner-occupied units) for tracts in Adams, Arapahoe, Boulder, Broomfield, Denver, Douglas, and Jefferson counties. Walkability is from the [EPA National Walkability Index](https://catalog.data.gov/dataset/walkability-index8) (block groups averaged to tract; missing tracts imputed from adjacent tracts). The ratio is sensitive to very low or very high home values, so tracts with non-typical values can rank at the top or bottom.

**Headline findings:**

- **Best walkability per $100k:** The top tracts by this ratio are mostly in **Adams County**, with lower median home values ($63k–$158k) and walkability scores in the 8–15 range. Tract 08001009316 (Adams) leads with about **17.0** walkability points per $100k (median value ~$82k, walkability 14.0).
- **Denver County** tracts tend to have higher walkability but also higher prices, so their ratio is often in the middle of the pack. **Boulder County** has some of the highest absolute walkability and highest prices, so ratios there are generally lower.
- The **metro-wide spread** in the ratio is large: from around 2 to over 17 points per $100k, so choosing by this metric can surface neighborhoods that offer a lot of walkability for the money.

The chart below shows the **top 30 census tracts** in the Denver metro by walkability per $100k. Hover for tract ID, county, median home value, and walkability index.

<figure style="margin: 1.5em 0;">
  <div id="denver-walkability-chart" style="width:100%; height:720px;"></div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#666;">Top 30 Denver-area tracts by walkability per $100k home value. Higher = more walkability per dollar. Data: Census ACS B25077, EPA Smart Location Database.</figcaption>
</figure>

<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<script>
(function() {
  const dataUrl = "{{ site.baseurl }}/assets/data/denver_walkability_per_100k.json";
  fetch(dataUrl)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || data.length === 0) {
        document.getElementById("denver-walkability-chart").innerHTML = "<p>No data available. Run <code>export_for_blog.py</code> in the denver_zips project to generate the chart data.</p>";
        return;
      }
      var labels = data.map(function(d) { return d.label; });
      var values = data.map(function(d) { return d.walkability_per_100k; });
      var trace = {
        x: values,
        y: labels,
        type: "bar",
        orientation: "h",
        marker: { color: "rgba(31, 119, 180, 0.8)" },
        text: values.map(function(v) { return v.toFixed(2); }),
        textposition: "outside",
        hovertemplate: "%{y}<br>Walkability per $100k: %{x:.2f}<extra></extra>"
      };
      var layout = {
        margin: { l: 200, r: 60, t: 24, b: 48 },
        xaxis: { title: "Walkability per $100k", zeroline: true, zerolinewidth: 2, zerolinecolor: "#333" },
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

**Interactive map:** Tracts are colored by walkability per $100k (darker = higher ratio). Hover for tract details.

<figure style="margin: 1.5em 0;">
  <div id="denver-tracts-map" style="width:100%; height:520px; border:1px solid #ddd;"></div>
  <figcaption style="margin-top:0.5em; font-size:0.9em; color:#666;">Denver metro census tracts by walkability per $100k home value. Data: Census ACS B25077, EPA Smart Location Database.</figcaption>
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
        .map(function(f) { return f.properties && f.properties.walkability_per_100k; })
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
        var ratio = p.walkability_per_100k;
        var med = p.median_home_value;
        var walk = p.walkability_index;
        var msg = "<b>" + (p.COUNTY || "—") + "</b> (Tract " + (p.GEOID || "—") + ")<br/>";
        msg += "Walkability per $100k: " + (ratio != null ? ratio.toFixed(2) : "—") + "<br/>";
        msg += "Median home value: " + (med != null ? "$" + med.toLocaleString() : "—") + "<br/>";
        msg += "Walkability index: " + (walk != null ? walk.toFixed(1) : "—");
        layer.bindTooltip(msg, { sticky: true, className: "denver-map-tooltip", direction: "top" });
      }

      L.geoJSON(geojson, {
        style: function(feature) {
          var v = feature.properties && feature.properties.walkability_per_100k;
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
