#!/bin/bash
set -euo pipefail

export PATH="/usr/bin:/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load .env
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

CURL="$(command -v curl)"
JQ="$(command -v jq)"

# --- Stats tracking ---
STATS_FILE="/tmp/search-stats.jsonl"

log_call() {
  local provider="$1" action="$2" cost="$3" credits="${4:-0}"
  local ts
  ts=$(date -u +"%Y-%m-%dT%H:%M:%S")
  echo "{\"ts\":\"$ts\",\"provider\":\"$provider\",\"action\":\"$action\",\"cost\":$cost,\"credits\":$credits}" >> "$STATS_FILE"
}

show_stats() {
  if [[ ! -f "$STATS_FILE" ]]; then
    echo "=== 검색 API 사용 통계 ==="
    echo "(기록 없음)"
    return
  fi

  echo "=== 검색 API 사용 통계 ==="
  echo ""

  # Perplexity
  local px_search px_research px_reason px_total_cost
  px_search=$($JQ -s '[.[] | select(.provider=="perplexity" and .action=="search")] | length' "$STATS_FILE")
  px_research=$($JQ -s '[.[] | select(.provider=="perplexity" and .action=="research")] | length' "$STATS_FILE")
  px_reason=$($JQ -s '[.[] | select(.provider=="perplexity" and .action=="reason")] | length' "$STATS_FILE")
  px_total_cost=$($JQ -s '[.[] | select(.provider=="perplexity") | .cost] | add // 0 | . * 100 | round / 100' "$STATS_FILE")

  echo "Perplexity:"
  [[ "$px_search" -gt 0 ]] && echo "  search:    ${px_search}회  (~\$$(echo "$px_search * 0.01" | bc))"
  [[ "$px_research" -gt 0 ]] && echo "  research:  ${px_research}회"
  [[ "$px_reason" -gt 0 ]] && echo "  reason:    ${px_reason}회"

  # Tavily
  local tv_search tv_research tv_extract tv_total_credits
  tv_search=$($JQ -s '[.[] | select(.provider=="tavily" and .action=="search")] | length' "$STATS_FILE")
  tv_research=$($JQ -s '[.[] | select(.provider=="tavily" and .action=="research")] | length' "$STATS_FILE")
  tv_extract=$($JQ -s '[.[] | select(.provider=="tavily" and .action=="extract")] | length' "$STATS_FILE")
  tv_total_credits=$($JQ -s '[.[] | select(.provider=="tavily") | .credits] | add // 0' "$STATS_FILE")

  echo ""
  echo "Tavily:"
  [[ "$tv_search" -gt 0 ]] && echo "  search:    ${tv_search}회  ($((tv_search * 2)) 크레딧)"
  [[ "$tv_research" -gt 0 ]] && echo "  research:  ${tv_research}회  ($((tv_research * 5)) 크레딧)"
  [[ "$tv_extract" -gt 0 ]] && echo "  extract:   ${tv_extract}회  (${tv_extract} 크레딧)"

  # Totals
  local total_calls
  total_calls=$($JQ -s 'length' "$STATS_FILE")
  echo ""
  echo "---"
  echo "총 API 호출: ${total_calls}회"
  echo "Perplexity 예상 비용: ~\$${px_total_cost}"
  echo "Tavily 크레딧 사용: ${tv_total_credits} / 1,000 (월간)"
}

reset_stats() {
  rm -f "$STATS_FILE"
  echo "검색 통계가 초기화되었습니다."
}

# --- Handle stats command early ---
if [[ "${1:-}" == "stats" ]]; then
  if [[ "${2:-}" == "--reset" ]]; then
    reset_stats
  else
    show_stats
  fi
  exit 0
fi

# --- Usage ---
usage() {
  cat <<'USAGE'
Usage: search.sh <provider> <command> <query> [options]

Providers & Commands:
  tavily search   "query"  [--depth basic|advanced] [--max N] [--days N]
  tavily research "query"  [--max N] [--days N]
  tavily extract  "url1,url2,..."
  perplexity search   "query"  [--model sonar|sonar-pro]
  perplexity research "query"  [--model sonar-deep-research]
  perplexity reason   "query"  [--model sonar-reasoning-pro]

Statistics:
  stats            Show API usage statistics for current session
  stats --reset    Reset statistics

Options:
  --depth    Search depth for tavily search (default: advanced)
  --max      Max results for tavily (default: 10)
  --days     Recency filter in days for tavily
  --model    Perplexity model override

Environment:
  TAVILY_API_KEY       (or TAVILIY_API_KEY for backward compat)
  PERPLEXITY_API_KEY
USAGE
  exit 1
}

[[ $# -lt 3 ]] && usage

PROVIDER="$1"; shift
COMMAND="$1"; shift
QUERY="$1"; shift

# Parse optional args
DEPTH="advanced"
MAX_RESULTS=10
DAYS=""
MODEL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --depth) DEPTH="$2"; shift 2 ;;
    --max)   MAX_RESULTS="$2"; shift 2 ;;
    --days)  DAYS="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# --- Tavily ---

tavily_key() {
  local key="${TAVILY_API_KEY:-${TAVILIY_API_KEY:-}}"
  if [[ -z "$key" ]]; then
    echo '{"error":"TAVILY_API_KEY not set"}' >&2
    exit 1
  fi
  echo "$key"
}

tavily_search() {
  local key
  key=$(tavily_key)
  local body
  body=$($JQ -n \
    --arg query "$QUERY" \
    --arg api_key "$key" \
    --arg depth "$DEPTH" \
    --argjson max "$MAX_RESULTS" \
    '{api_key: $api_key, query: $query, search_depth: $depth, max_results: $max, include_raw_content: false}')

  if [[ -n "$DAYS" ]]; then
    body=$($JQ --argjson days "$DAYS" '. + {days: $days}' <<< "$body")
  fi

  local credits=2
  [[ "$DEPTH" == "basic" ]] && credits=1

  $CURL -s -X POST "https://api.tavily.com/search" \
    -H "Content-Type: application/json" \
    -d "$body"

  log_call "tavily" "search" 0 "$credits"
}

tavily_research() {
  DEPTH="advanced"
  local key
  key=$(tavily_key)
  local body
  body=$($JQ -n \
    --arg query "$QUERY" \
    --arg api_key "$key" \
    --argjson max "$MAX_RESULTS" \
    '{api_key: $api_key, query: $query, topic: "general", search_depth: "advanced", max_results: $max, include_raw_content: true}')

  if [[ -n "$DAYS" ]]; then
    body=$($JQ --argjson days "$DAYS" '. + {days: $days}' <<< "$body")
  fi

  $CURL -s -X POST "https://api.tavily.com/search" \
    -H "Content-Type: application/json" \
    -d "$body"

  log_call "tavily" "research" 0 5
}

tavily_extract() {
  local key
  key=$(tavily_key)
  # QUERY contains comma-separated URLs
  local urls_json
  urls_json=$($JQ -n --arg urls "$QUERY" '$urls | split(",") | map(gsub("^\\s+|\\s+$";""))')
  local url_count
  url_count=$(echo "$urls_json" | $JQ 'length')
  local body
  body=$($JQ -n \
    --arg api_key "$key" \
    --argjson urls "$urls_json" \
    '{api_key: $api_key, urls: $urls}')

  $CURL -s -X POST "https://api.tavily.com/extract" \
    -H "Content-Type: application/json" \
    -d "$body"

  log_call "tavily" "extract" 0 "$url_count"
}

# --- Perplexity ---

perplexity_key() {
  if [[ -z "${PERPLEXITY_API_KEY:-}" ]]; then
    echo '{"error":"PERPLEXITY_API_KEY not set"}' >&2
    exit 1
  fi
  echo "$PERPLEXITY_API_KEY"
}

perplexity_chat() {
  local model="$1"
  local key
  key=$(perplexity_key)
  local body
  body=$($JQ -n \
    --arg model "$model" \
    --arg query "$QUERY" \
    '{model: $model, messages: [{role: "user", content: $query}]}')

  local result
  result=$($CURL -s -X POST "https://api.perplexity.ai/chat/completions" \
    -H "Authorization: Bearer $key" \
    -H "Content-Type: application/json" \
    -d "$body")

  echo "$result"

  # Extract cost from response if available
  local cost
  cost=$(echo "$result" | $JQ -r '.usage.cost.total_cost // 0.01' 2>/dev/null || echo "0.01")
  log_call "perplexity" "$COMMAND" "$cost" 0
}

# --- Dispatch ---

case "$PROVIDER" in
  tavily)
    case "$COMMAND" in
      search)   tavily_search ;;
      research) tavily_research ;;
      extract)  tavily_extract ;;
      *) echo "Unknown tavily command: $COMMAND" >&2; exit 1 ;;
    esac
    ;;
  perplexity)
    case "$COMMAND" in
      search)   perplexity_chat "${MODEL:-sonar-pro}" ;;
      research) perplexity_chat "${MODEL:-sonar-deep-research}" ;;
      reason)   perplexity_chat "${MODEL:-sonar-reasoning-pro}" ;;
      *) echo "Unknown perplexity command: $COMMAND" >&2; exit 1 ;;
    esac
    ;;
  *) echo "Unknown provider: $PROVIDER" >&2; exit 1 ;;
esac
