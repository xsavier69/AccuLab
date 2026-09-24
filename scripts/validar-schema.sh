#!/usr/bin/env bash
# Valida el JSON-LD de cada página de dist/ con https://validator.schema.org (requiere red).
cd "$(dirname "$0")/.." || exit 1
tmp=$(mktemp); fails=0
for f in $(find dist -name '*.html' | sort); do
  python3 -c "
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
print('<html><head>'+''.join(re.findall(r'<script type=\"application/ld\+json\">.*?</script>',s,re.S))+'</head><body></body></html>')" "$f" > "$tmp"
  res=$(curl -s --max-time 90 -X POST https://validator.schema.org/validate --data-urlencode "html@$tmp" | sed "s/^)]}'//" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['numObjects'], d['totalNumErrors'], d['totalNumWarnings'])" 2>/dev/null)
  echo "$f -> objetos/errores/avisos: ${res:-sin respuesta}"
  set -- $res; [ "${2:-1}" != "0" ] || [ "${3:-1}" != "0" ] && fails=$((fails+1))
done
rm -f "$tmp"; echo "Páginas con errores o avisos: $fails"; exit $fails
