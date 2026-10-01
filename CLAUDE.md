<!-- categoria: Pessoal — Sites & Clientes -->
<!-- resumo: Site da AvilaCore (Astro 7), marca de Matheus Ávila: audiovisual, drone e sites. Marca nova (símbolo Foco, Archivo, noite + ciano + coral), portfólio em crescimento -->
<!-- gatilhos: meu site; site pessoal; AvilaCore; Ávila Core; avilacore.com.br; portfólio; site do drone; adicionar trabalho; kit da marca; logo da AvilaCore -->
<!-- modificado: 2026-10-01 -->
# AvilaCore: cérebro do projeto

**Categoria:** Pessoal — Sites & Clientes
**O que é:** Site profissional real de Matheus Ávila (Indaiatuba, SP), sob a marca **AvilaCore**. Três frentes: audiovisual, drone e sites. Suporte técnico saiu do site.
**Produção:** https://www.avilacore.com.br (domínio principal na Vercel é o `www`). Repositório público: `DevMathAvila/avilacore`.
**Estado:** remodelagem publicada em 01/10/2026 (`main` = `remodelagem`). O trabalho continua no branch `remodelagem`; nada vai para `main` sem aprovação do Matheus.

> Índice raiz: ../CLAUDE.md

## Stack
Astro 7 (páginas estáticas + rota `/api/contato` no servidor), CSS próprio com tokens, fonte Archivo variável auto-hospedada. Adaptador da Vercel no deploy e de Node no build local. O projeto mora num HD externo lento: `npm ci` e builds rodam muito mais rápido numa cópia em disco interno.

## Comandos
- `npm run dev` · `npm run build` · `npm run preview` · `npm run check`
- `node scripts/marca/gerar-kit.mjs` gera o kit em `public/brand/` e os ícones
- `python scripts/video.py <original> <slug> [--inicio --duracao --capa --vertical]` gera prévia, versão 720p e capa de um vídeo, sem áudio e sem metadados (precisa de ffmpeg)
- `python scripts/testes.py <url>` (axe, teclado, menu, formulário) · `python scripts/revisao.py <url> <pasta>` (capturas em várias larguras) · `python scripts/captura.py <url> <saida.png>`
- Scanner de design: `node ../.agents/skills/avoid-ai-design/scripts/detect.mjs src`

## Onde mexer
- Contatos, cidades, navegação, processo: `src/config/site.ts` (campo vazio = dado que falta; o site esconde o bloco)
- Serviços por frente, com `confirmado: true/false`: `src/content/servicos/*.md`
- Trabalhos (`publicado`), depoimentos (`autorizado`), guias (`publicado`): `src/content/`
- Tokens de cor, tipo, espaço e movimento: só em `src/styles/tokens.css`
- SEO, Open Graph e JSON-LD: `src/layouts/Base.astro`, `src/lib/schema.ts`, `src/lib/og.ts`
- Redirects 301 e sitemap: `astro.config.mjs` · cabeçalhos: `vercel.json`
- Como adicionar um trabalho: `README.md`

## Decisões
- Grafia **AvilaCore**; "Ávila Core" só como `alternateName`. Frase: "Filmo do alto e coloco no ar."
- Marca: símbolo "Foco" (dois cantos + quadrado), wordmark com o pingo do "i" quadrado. Paleta noite `#0E1624`, papel `#EDEBE6`, ciano `#5CC0D0`, coral `#EF6F55`. Ciano e coral nunca juntos no mesmo componente. Regras em `BRAND.md`.
- Archivo variável: largura 125 nos títulos do desktop, 108 no celular, 100 no texto.
- Único momento animado: a entrada do hero da home. Sem Lenis aqui (briefing pede JS mínimo e nada de rolagem sequestrada). Transições de página com View Transitions do CSS.
- `/processo` virou seção da home (`#como-funciona`) e uma versão em cada serviço.
- Redirects 301: `/filmagens` → `/drone`; `/suporte`, `/infraestrutura` e `/home` → `/`.
- Formulário: Resend por `/api/contato`; sem as chaves, o formulário abre o WhatsApp com a mensagem.

## Honestidade (regra do Matheus)
- Não inventar cliente, projeto, depoimento, número, prazo, preço, certificação ou endereço.
- Estudos autorais (Soleira, Beiral, Lívia Carvalhal, Varanda) sempre identificados como estudo; as fotos deles são de banco de imagem.
- Tomadas aéreas autorais publicadas (out/2026): Lago com chafariz e Chácaras no fim da tarde, gravadas com DJI Neo, sem cliente e sem local informado. A tomada vertical da obra (pessoa na janela) NÃO foi publicada: aguarda autorização; arquivos em `_conteudo/04-aereo/`.
- Sites de clientes publicados em 01/10/2026 a pedido do Matheus: Mayara Gaspareto, Deckboost e Tatiane Silva (`tipo: real`, com link para o site no ar). Em `/sites` eles vêm antes dos estudos, em "Sites no ar".
- Vídeos de cliente publicados: Da obra ao projeto e O projeto virando casa (Reels da Mayara Gaspareto).
- Os três depoimentos continuam com `autorizado: false`: só entram quando o Matheus confirmar a autorização de cada pessoa.
- Drone: não afirmar cadastro, seguro ou licença sem dado em `src/config/site.ts`. Regra atual: RBAC nº 100 (Resolução ANAC nº 805, de 15/06/2026).

## Pastas que não fazem parte do site
- `_conteudo/`: material bruto e fichas. Fora do git (o repositório é público).
- `marketing/`: brand-profile, posts e a pasta `remodelagem/` (progresso, aprovação, pendências). Fora do git.
- `claude-ig/`: ferramenta de terceiros. Ignorar.

## Pendências e entrega
`marketing/remodelagem/PENDENCIAS.md` e `marketing/remodelagem/PROGRESSO.md`.
