"""
Testes do site no navegador (Playwright + Chrome instalado).

Uso: python scripts/testes.py <base>

Confere em cada pagina: axe-core (WCAG A/AA), um unico H1, title e description unicos,
canonical, imagem Open Graph, texto entre colchetes e areas de toque.
Confere tambem teclado (link de pular, foco visivel), menu do celular e formulario.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip("/")
PAGINAS = ["/", "/audiovisual", "/drone", "/sites", "/trabalhos", "/trabalhos/soleira", "/sobre", "/contato",
           "/guias", "/guias/preparar-filmagem-drone", "/politica-de-privacidade", "/termos", "/marca"]
AXE = Path("node_modules/axe-core/axe.min.js").read_text(encoding="utf-8")
falhas, avisos = [], []


def falha(msg):
    falhas.append(msg)
    print("FALHA", msg)


with sync_playwright() as p:
    nav = p.chromium.launch(channel="chrome")

    # ---------- por pagina, no celular e no desktop ----------
    titulos, descricoes = {}, {}
    for largura, celular in [(390, True), (1280, False)]:
        ctx = nav.new_context(viewport={"width": largura, "height": 844 if celular else 800}, is_mobile=celular,
                              has_touch=celular, reduced_motion="reduce", locale="pt-BR")
        for caminho in PAGINAS:
            pg = ctx.new_page()
            pg.goto(BASE + caminho, wait_until="networkidle")
            pg.add_script_tag(content=AXE)
            r = pg.evaluate("axe.run(document, {runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']})")
            for v in r["violations"]:
                alvos = "; ".join(n["target"][0] for n in v["nodes"][:3])
                falha(f"[{largura}] {caminho}: axe {v['id']} ({v['impact']}): {alvos}")
            if pg.locator("h1").count() != 1:
                falha(f"[{largura}] {caminho}: {pg.locator('h1').count()} H1")
            texto = pg.inner_text("body")
            if "[PREENCHER" in texto or "[REVISAR" in texto or "[CONFIRMAR" in texto:
                falha(f"{caminho}: texto entre colchetes aparece na pagina")
            if "\u2014" in texto:
                avisos.append(f"{caminho}: travessao no texto")
            if not celular:
                t, d = pg.title(), pg.get_attribute('meta[name="description"]', "content")
                titulos.setdefault(t, []).append(caminho)
                descricoes.setdefault(d, []).append(caminho)
                canonical = pg.get_attribute('link[rel="canonical"]', "href")
                esperado = "https://www.avilacore.com.br" + ("" if caminho == "/" else caminho)
                if canonical != esperado:
                    falha(f"{caminho}: canonical {canonical}")
                og = pg.get_attribute('meta[property="og:image"]', "content")
                local = og.replace("https://www.avilacore.com.br", BASE)
                if pg.request.get(local).status != 200:
                    falha(f"{caminho}: imagem OG nao encontrada ({og})")
                if len(t) > 62:
                    avisos.append(f"{caminho}: title com {len(t)} caracteres")
            else:
                # areas de toque: links e botoes fora de texto corrido precisam de 44 px
                pequenos = pg.evaluate("""() => [...document.querySelectorAll('a, button, summary, label.tipo')]
                  .filter(e => e.offsetParent && !e.closest('p, li p, .prosa, .migalhas, dd, .so-leitor, figcaption'))
                  .map(e => ({r: e.getBoundingClientRect(), t: (e.textContent || '').trim().slice(0, 30)}))
                  .filter(o => o.r.width > 0 && (o.r.height < 44 || o.r.width < 44))
                  .map(o => `${o.t} (${Math.round(o.r.width)}x${Math.round(o.r.height)})`)""")
                if pequenos:
                    falha(f"{caminho}: area de toque menor que 44 px: {pequenos[:5]}")
            pg.close()
        ctx.close()
    for t, cs in titulos.items():
        if len(cs) > 1:
            falha(f"title repetido em {cs}: {t}")
    for d, cs in descricoes.items():
        if len(cs) > 1:
            falha(f"description repetida em {cs}")

    # ---------- teclado no desktop ----------
    ctx = nav.new_context(viewport={"width": 1280, "height": 800}, locale="pt-BR")
    pg = ctx.new_page()
    pg.goto(BASE + "/", wait_until="networkidle")
    pg.keyboard.press("Tab")
    if "Pular" not in pg.evaluate("document.activeElement.textContent"):
        falha("teclado: o primeiro Tab nao cai no link de pular para o conteudo")
    sem_foco = []
    for _ in range(14):
        pg.keyboard.press("Tab")
        info = pg.evaluate("""() => { const e = document.activeElement, s = getComputedStyle(e);
          return {t: (e.textContent || '').trim().slice(0, 24), ok: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2}; }""")
        if not info["ok"]:
            sem_foco.append(info["t"])
    if sem_foco:
        falha(f"teclado: sem anel de foco visivel em {sem_foco}")
    ctx.close()

    # ---------- menu do celular ----------
    ctx = nav.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, locale="pt-BR")
    pg = ctx.new_page()
    pg.goto(BASE + "/", wait_until="networkidle")
    pg.click("[data-abrir-menu]")
    if not pg.evaluate("document.getElementById('menu').open"):
        falha("menu: nao abriu")
    if not pg.evaluate("document.getElementById('menu').contains(document.activeElement)"):
        falha("menu: o foco nao entrou no menu")
    pg.screenshot(path="marketing/remodelagem/menu-390.png")
    pg.keyboard.press("Escape")
    if pg.evaluate("document.getElementById('menu').open"):
        falha("menu: Esc nao fechou")
    pg.click("[data-abrir-menu]")
    pg.click("#menu a[href='/drone']")
    pg.wait_for_url("**/drone")

    # ---------- formulario ----------
    pg.goto(BASE + "/contato?tipo=drone", wait_until="networkidle")
    if not pg.is_checked("input[name='tipo'][value='drone']"):
        falha("formulario: ?tipo=drone nao marcou o tipo de projeto")
    modo = pg.get_attribute("[data-form]", "data-modo")
    pg.click("[data-enviar]")
    erros = pg.locator("[data-erro]:not([hidden])").count()
    if erros != 3:
        falha(f"formulario: esperava 3 erros com o formulario vazio, vieram {erros}")
    if pg.evaluate("document.activeElement.name") != "nome":
        falha("formulario: o foco nao foi para o primeiro campo com erro")
    if pg.get_attribute("#f-nome", "aria-invalid") != "true":
        falha("formulario: aria-invalid ausente")
    pg.screenshot(path="marketing/remodelagem/form-erros-390.png", full_page=True)
    pg.fill("#f-nome", "Teste Automatico")
    pg.fill("#f-contato", "teste@exemplo.com.br")
    pg.fill("#f-mensagem", "Mensagem de teste do formulario.")
    if pg.locator("[data-erro]:not([hidden])").count() != 0:
        falha("formulario: os erros nao sumiram ao corrigir os campos")
    if modo == "whatsapp":
        pg.evaluate("window.__aberto = null; window.open = (u) => { window.__aberto = u; return null; }")
        pg.click("[data-enviar]")
        url = pg.evaluate("window.__aberto") or ""
        if not url.startswith("https://wa.me/5519993808005?text=") or "Teste%20Automatico" not in url:
            falha(f"formulario: link do WhatsApp inesperado: {url[:90]}")
    else:
        # sucesso
        pg.route("**/api/contato", lambda rota: rota.fulfill(status=200, content_type="application/json", body='{"ok":true}'))
        pg.click("[data-enviar]")
        pg.wait_for_selector("[data-sucesso]:not([hidden])")
        pg.screenshot(path="marketing/remodelagem/form-sucesso-390.png")
    ctx.close()

    # ---------- anti-spam e validacao na rota (so quando o servidor local esta no ar) ----------
    ctx = nav.new_context()
    api = ctx.request
    r = api.post(BASE + "/api/contato", headers={"Accept": "application/json"},
                 data={"nome": "Robo", "contato": "a@b.com", "tipo": "site", "mensagem": "mensagem de teste", "empresa": "spam"})
    if not (r.status == 200 and r.json().get("ok")):
        falha(f"api: isca preenchida deveria responder ok sem enviar (veio {r.status})")
    r = api.post(BASE + "/api/contato", headers={"Accept": "application/json"},
                 data={"nome": "", "contato": "x", "tipo": "site", "mensagem": "curta"})
    if r.status != 422:
        falha(f"api: dados invalidos deveriam dar 422 (veio {r.status})")
    r = api.post(BASE + "/api/contato", headers={"Accept": "application/json"},
                 data={"nome": "Teste", "contato": "teste@exemplo.com.br", "tipo": "site", "mensagem": "mensagem de teste valida"})
    print("api: envio valido respondeu", r.status, "(503 = envio por e-mail nao configurado; 200 = enviado)")
    ctx.close()
    nav.close()

print()
for a in avisos:
    print("AVISO", a)
print(f"{len(falhas)} falha(s), {len(avisos)} aviso(s)")
sys.exit(1 if falhas else 0)
