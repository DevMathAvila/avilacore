"""
Capturas de tela (Playwright + Chrome instalado).

Uso: python scripts/captura.py <url> <saida.png> [largura] [--mobile] [--movimento] [--altura=900] [--visivel] [--escuro]
  largura padrao 1440; --mobile emula celular (isMobile, touch, DPR 2);
  por padrao emula prefers-reduced-motion para capturar o estado final (--movimento desliga);
  --visivel captura so a primeira tela (sem ele, pagina inteira).
Imprime erros de console e respostas HTTP >= 400.
"""
import sys

from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith("--")]
flags = [a for a in sys.argv[1:] if a.startswith("--")]
url, out = args[0], args[1]
largura = int(args[2]) if len(args) > 2 else 1440
mobile = "--mobile" in flags
altura = next((int(f.split("=")[1]) for f in flags if f.startswith("--altura=")), 812 if mobile else 900)
dpr = next((float(f.split("=")[1]) for f in flags if f.startswith("--dpr=")), 2 if mobile else 1)

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    ctx = b.new_context(viewport={"width": largura, "height": altura}, device_scale_factor=dpr,
                        is_mobile=mobile, has_touch=mobile,
                        reduced_motion="no-preference" if "--movimento" in flags else "reduce", locale="pt-BR")
    pg = ctx.new_page()
    erros = []
    pg.on("console", lambda m: erros.append(f"console.{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    pg.on("response", lambda r: erros.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)
    pg.goto(url, wait_until="networkidle")
    pg.add_style_tag(content=".secao{content-visibility:visible!important}")
    if "--visivel" not in flags:
        pg.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); }""")
    pg.wait_for_timeout(900)
    pg.screenshot(path=out, full_page="--visivel" not in flags)
    b.close()
print("\n".join(erros) if erros else "sem erros de console/HTTP")
