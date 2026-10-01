"""
Revisao em lote: captura todas as paginas em varias larguras e aponta problemas.

Uso: python scripts/revisao.py <base> <pasta_saida> [larguras separadas por virgula] [--so=/caminho,/outro]

Para cada pagina e largura: screenshot da pagina inteira, erros de console,
respostas HTTP >= 400 e estouro horizontal (scrollWidth maior que a janela).
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

PAGINAS = ["/", "/audiovisual", "/drone", "/sites", "/trabalhos", "/trabalhos/soleira", "/sobre", "/contato",
           "/guias", "/guias/preparar-filmagem-drone", "/politica-de-privacidade", "/termos", "/marca", "/pagina-que-nao-existe"]

args = [a for a in sys.argv[1:] if not a.startswith("--")]
flags = [a for a in sys.argv[1:] if a.startswith("--")]
base, saida = args[0].rstrip("/"), Path(args[1])
larguras = [int(x) for x in args[2].split(",")] if len(args) > 2 else [360, 390, 430, 768, 1280, 1440]
so = next((f.split("=", 1)[1].split(",") for f in flags if f.startswith("--so=")), None)
paginas = so or PAGINAS
saida.mkdir(parents=True, exist_ok=True)
problemas = []

with sync_playwright() as p:
    nav = p.chromium.launch(channel="chrome")
    for largura in larguras:
        celular = largura < 700
        ctx = nav.new_context(viewport={"width": largura, "height": 844 if celular else 900},
                              device_scale_factor=1, is_mobile=celular, has_touch=celular,
                              reduced_motion="reduce", locale="pt-BR")
        for caminho in paginas:
            pg = ctx.new_page()
            erros = []
            pg.on("console", lambda m, e=erros: e.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
            pg.on("response", lambda r, e=erros, c=caminho: e.append(f"HTTP {r.status}: {r.url}")
                  if r.status >= 400 and "nao-existe" not in c else None)
            pg.goto(base + caminho, wait_until="networkidle")
            pg.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); }""")
            pg.wait_for_timeout(400)
            sobra = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            if sobra > 1:
                culpados = pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 4).map(e => e.tagName + '.' + e.className)""")
                erros.append(f"estouro horizontal de {sobra}px: {culpados}")
            nome = (caminho.strip("/").replace("/", "_") or "home") + f"-{largura}.png"
            pg.screenshot(path=str(saida / nome), full_page=True)
            for e in erros:
                problemas.append(f"[{largura}] {caminho}: {e}")
            pg.close()
        ctx.close()
    nav.close()

print("\n".join(problemas) if problemas else "sem problemas de console, HTTP ou estouro horizontal")
print(f"{len(paginas) * len(larguras)} capturas em {saida}")
