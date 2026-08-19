# Ávila Core

Site pessoal de Matheus Ávila, assinado como Ávila Core. Apresenta as três frentes
de trabalho: criação de sites, filmagens com drone e suporte técnico.

## Stack

- [Astro](https://astro.build) (site estático, multipágina)
- HTML/CSS com tokens próprios e tipografia Satoshi (self-hosted)
- Deploy na Vercel

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/
npm run preview  # serve o build localmente
```

## Estrutura

- `src/pages/` — páginas (Home, Sites, Filmagens, Suporte)
- `src/components/` — Nav, botão de WhatsApp, bloco "em construção"
- `src/layouts/Base.astro` — layout base com SEO e fontes
- `src/styles/global.css` — tokens de cor, fontes e base
- `public/fonts/` — fontes Satoshi (woff2)
