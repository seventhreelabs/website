# Źródła PDF-ów (public/pdf)

`prospekt.html` i `cennik.html` + `style.css` (fonty Manrope i JetBrains Mono z Google Fonts). Render:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-sandbox \
  --user-data-dir=/tmp/chrome-pdf-profile --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf=public/pdf/seventhreelabs-cennik.pdf "file://$PWD/docs/pdf-src/cennik.html"
```

Po renderze wgraj plik do biblioteki mediów cmssy (MCP `upload_media` z URL produkcyjnego) i podmień adresy w stopce oraz w bloku „Cennik” -> „Do pobrania”.
