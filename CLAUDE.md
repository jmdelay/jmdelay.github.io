# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bundle install

# Local development server
bundle exec jekyll serve --port 5000
# Opens at http://localhost:5000

# Build only (no server)
bundle exec jekyll build
```

## Architecture

**Stack:** Jekyll + Minimal Mistakes v4.24.0 (remote theme) + GitHub Pages

**Deployment:** Pushes to `master` branch auto-deploy via GitHub Pages to `changepointdata.com` (custom domain via CNAME).

**Theme:** All layouts come from the remote Minimal Mistakes theme — no local `_layouts/` overrides. Custom styling lives entirely in `_includes/head/custom.html`. Two theme partials are overridden locally: `_includes/author-profile.html` and `_includes/page__date.html`.

### Content Structure

| Location | Purpose |
|----------|---------|
| `index.md` | Home page with brand hero and services overview |
| `_pages/` | Static pages (about, blog, contact, faq, 404) |
| `_posts/` | Blog posts — filename format: `YYYY-MM-DD-slug.md` |
| `_data/navigation.yml` | Main nav menu links |
| `_includes/head/custom.html` | All custom CSS and brand styling |
| `assets/images/` | Images organized per post/project; `logo.svg` is the masthead logo |
| `assets/data/` | JSON/GeoJSON files loaded by posts for interactive D3/Leaflet visualizations |
| `_site/` | Generated output — never edit directly |

### Brand Colors

Defined in `_includes/head/custom.html`:
- Primary (dark blue): `#1B2A4A`
- Secondary (steel blue): `#2A5FA5`
- Accent (orange): `#E06B2E`
- Growth green: `#2E9B6A`

### Front Matter Conventions

All blog posts use:
```yaml
---
layout: single
title: "..."
author_profile: true
categories: Data
tags: [...]
---
```

Pages in `_pages/` use `layout: single` or `layout: splash` with a `permalink:` set explicitly. The `_config.yml` defaults set `author_profile: true` for all pages; `index.md` overrides this to `false` so the homepage hero is full-width.

### Jekyll Plugin Notes

The `Gemfile` uses `github-pages` gem for compatibility. Extra gems (`fiddle`, `ostruct`, `faraday-retry`, `tzinfo-data`) exist to patch Windows/Ruby version gaps. The `_config.yml` explicitly includes `_pages` in `include:` so Jekyll processes that directory.

### Legacy Directory

`mm-github-pages-starter/` at the repo root is an unused starter template remnant and can be removed.
