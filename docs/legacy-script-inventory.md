# Legacy Script Inventory

This is an inventory, not a port. It records the script surface in
[`BestLemoon/codex-seo`](https://github.com/BestLemoon/codex-seo) at commit
`cab98ce1ed65b52d2ab056c61ccdcddad01aa0ee` so each capability can be rebuilt
with a new, testable contract.

## Local analysis candidates

| Script | Current role |
| --- | --- |
| `fetch_page.py` | Fetch a public page with headers and error handling. |
| `parse_html.py` | Extract SEO-relevant HTML elements. |
| `capture_screenshot.py` | Capture a page with Playwright. |
| `analyze_visual.py` | Analyze page visuals with Playwright. |
| `commoncrawl_graph.py` | Parse Common Crawl Web Graph data. |
| `validate_backlink_report.py` | Validate backlink-report data. |
| `verify_backlinks.py` | Crawl and verify backlinks. |
| `google_report.py` | Generate HTML/PDF reports from supplied data. |

## Configuration and installation candidates

| Script | Current role |
| --- | --- |
| `install_plugin.py` | Install or uninstall the local plugin. |
| `configure_mcp.py` | Add or remove extension MCP entries in `.mcp.json`. |
| `google_auth.py` | Manage Google API credentials. |
| `backlinks_auth.py` | Manage backlink API credentials. |

## External API candidates

| Script | Current role |
| --- | --- |
| `bing_webmaster.py` | Bing Webmaster Tools API client. |
| `crux_history.py` | CrUX history API client. |
| `ga4_report.py` | GA4 organic-traffic reporting. |
| `gsc_inspect.py` | Search Console URL Inspection helper. |
| `gsc_query.py` | Search Console Search Analytics helper. |
| `indexing_notify.py` | Google Indexing API notifier. |
| `keyword_planner.py` | Google Ads Keyword Planner helper. |
| `moz_api.py` | Moz Link Explorer API client. |
| `nlp_analyze.py` | Google Cloud Natural Language API helper. |
| `pagespeed_check.py` | PageSpeed Insights and CrUX checker. |
| `youtube_search.py` | YouTube Data API search helper. |

## Porting rule

Every issue must define its public command or skill interface, structured
output, credential-free behavior, SSRF-safe URL policy where relevant, and
tests. No script is copied from the legacy repository.
