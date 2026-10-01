<!-- categoria: Inativos — Pessoais -->
<!-- resumo: Ávila Core — site pessoal (Astro) das frentes: sites, drone e suporte -->
<!-- gatilhos: meu site; site pessoal; Ávila Core; portfólio; site do drone/suporte -->
<!-- modificado: 2026-08-27 17:33 -->
# Ávila Core — Cérebro do projeto

**Categoria:** Sites & Marketing
**O que é:** Site pessoal de Matheus Ávila (marca "Ávila Core"): apresenta as três frentes — criação de sites, filmagens com drone e suporte técnico.
**Stack:** [Astro](https://astro.build) (estático, multipágina), TypeScript, HTML/CSS com tokens próprios. Tipografia **Satoshi** self-hosted (woff2). Deploy na **Vercel**. Domínio: `avilacore.com.br`.
**Última modificação:** 2026-08-27 17:33 (git — "Feat: páginas de Sites e Suporte com cases, depoimentos e conteúdo"). É repositório git.

## Gatilhos (como me chamar)
- "meu site", "site pessoal", "Ávila Core", "portfólio", "o site do drone/suporte"

## Arquitetura
- `src/pages/` — **index** (home), **sites**, **filmagens** (drone), **suporte**.
- `src/components/` — `Nav.astro`, `WhatsappFab.astro` (botão flutuante do WhatsApp), `EmConstrucao.astro`, `SitePreview.astro`.
- `src/layouts/Base.astro` — layout base com SEO e fontes.
- `src/styles/global.css` — tokens de cor, fontes e base.
- `public/fonts/` — fontes Satoshi (woff2).
- `astro.config.mjs` — `site: avilacore.com.br`, `compressHTML`, integração **sitemap**.
- `.claude/launch.json` — config de preview (skill `run`).

## Como rodar
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
npm run preview  # serve o build
```
- Não commitar `node_modules/`/`dist/`.

## ⚠️ Atenção — pasta `claude-ig/`
- Dentro do projeto há uma pasta `claude-ig/` que é uma **ferramenta de terceiros clonada** (toolkit de automação de Instagram: agents `ig-*`, skills, scripts Python de análise). **Não faz parte do site** — é um repo à parte que foi parar aqui. Não confundir com o código do Astro nem incluir no build. Se for limpar o projeto, avaliar mover/remover.

## Como mexer
- Peça ao Claude pra ler `src/` antes de mudanças maiores. Conteúdo real nas 4 páginas + componentes.

> Índice raiz: ../CLAUDE.md
