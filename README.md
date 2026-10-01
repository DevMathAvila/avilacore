# AvilaCore

Site da AvilaCore, marca de Matheus Ávila (Indaiatuba, SP): audiovisual, drone e sites.

- Produção: https://www.avilacore.com.br
- Stack: [Astro](https://astro.build) 7, HTML e CSS com tokens próprios, deploy na Vercel.
- Regras da marca: [BRAND.md](BRAND.md). Kit para baixar: `/marca`.

## Rodar

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera dist/
npm run preview   # serve o build (inclui a rota /api/contato)
```

Precisa de Node 22.12 ou mais novo.

## Como adicionar um trabalho

1. Coloque a imagem (ou o poster do vídeo) em `src/assets/trabalhos/`. Use nome sem acento e sem espaço: `por-do-sol-lago.jpg`.
2. Crie um arquivo `.md` em `src/content/trabalhos/`. O nome do arquivo vira o endereço: `por-do-sol-lago.md` vira `/trabalhos/por-do-sol-lago`.
3. Preencha o cabeçalho. O jeito mais rápido é copiar `soleira.md` e trocar os campos:

```yaml
---
titulo: Pôr do sol no lago
frente: drone            # audiovisual, drone ou sites
tipo: real               # real (para cliente) ou estudo (autoral)
categoria: Vídeo aéreo
resumo: Uma frase sobre o trabalho.
local: Indaiatuba, SP
ano: 2026
midia:
  formato: imagem        # imagem, video ou video-externo
  src: ../../assets/trabalhos/por-do-sol-lago.jpg
  alt: Descrição do que aparece na imagem
  proporcao: "16:9"      # 16:9, 9:16, 16:10, 4:5, 1:1, 4:3 ou 21:9
creditos:
  - papel: Captação e edição
    nome: Matheus Ávila
publicado: true          # false deixa fora do site
atualizado: 2026-10-01
---

Texto livre contando o contexto do trabalho.
```

4. Pronto. O trabalho aparece em `/trabalhos`, na página da frente, na home, no sitemap, e ganha a própria imagem de compartilhamento.

Para vídeo:

- **Prepare os arquivos** com `python scripts/video.py "C:\caminho\original.mp4" nome-do-trabalho --inicio=9 --duracao=8 --capa=13` (acrescente `--vertical` para vídeo em pé). O script gera a prévia curta, a versão completa em 720p e a capa, sem áudio e sem os metadados do drone, que incluem GPS e número de série.
- **Arquivo próprio:** `formato: video`, `arquivo: /videos/nome.mp4`, `previa: /videos/nome-previa.mp4` e `poster: ../../assets/trabalhos/nome.jpg`. Com `previa`, o vídeo toca sozinho, sem som, nas molduras da home e da página da frente. Vídeo com mais de uns 10 MB fica fora do repositório: suba no YouTube ou no Vimeo e use o formato abaixo.
- **YouTube ou Vimeo:** `formato: video-externo`, `provedor: youtube` (ou `vimeo`), `id: o-id-do-video` e o `poster`. O player só carrega quando a pessoa clica.
- Se o vídeo tem fala, preencha `transcricao`.

Regras: estudo autoral usa `tipo: estudo`. Trabalho de cliente só com autorização. Imagem de banco nunca entra como trabalho.

## Onde mexer

| O que | Onde |
|---|---|
| WhatsApp, Instagram, e-mail, cidades, dados do drone | `src/config/site.ts` |
| Serviços de cada frente (campo `confirmado`), dúvidas, processo | `src/content/servicos/*.md` |
| Trabalhos | `src/content/trabalhos/*.md` |
| Depoimentos (campo `autorizado`) | `src/content/depoimentos/*.md` |
| Guias (campo `publicado`) | `src/content/guias/*.md` |
| Cores, fontes, espaços, movimento | `src/styles/tokens.css` |
| Foto do Sobre | `src/assets/matheus/retrato.jpg` (aparece sozinha quando o arquivo existir) |
| Redirecionamentos 301 e sitemap | `astro.config.mjs` |
| Cabeçalhos HTTP | `vercel.json` |

Campo vazio em `src/config/site.ts` significa dado que falta: o site esconde o bloco em vez de mostrar texto de preenchimento.

## Formulário de contato

A rota `/api/contato` envia a mensagem por e-mail pelo [Resend](https://resend.com). Variáveis de ambiente (na Vercel, em Settings, Environment Variables; no computador, num arquivo `.env`):

```
RESEND_API_KEY=...
CONTATO_PARA=seu-email@exemplo.com
```

Sem elas, o formulário continua funcionando: monta a mensagem e abre o WhatsApp. Modelo em `.env.example`.

## Métricas

Vercel Web Analytics, sem cookies. Ative no painel da Vercel e defina `PUBLIC_ANALYTICS=vercel`. A política de privacidade passa a citar a ferramenta sozinha.

## Kit da marca

```bash
node scripts/marca/gerar-kit.mjs      # PNGs, favicons, Instagram, peças de vídeo
python scripts/marca/gerar-logo.py    # só se o desenho do logo mudar
```

## Conferir antes de publicar

```bash
npm run build && npm run preview                                  # em um terminal
python scripts/testes.py http://localhost:4321                    # acessibilidade, teclado, formulário
python scripts/revisao.py http://localhost:4321 capturas          # capturas em 360 a 1440 px
node ../.agents/skills/avoid-ai-design/scripts/detect.mjs src     # scanner de design
```

Os scripts em Python usam `playwright` com o Chrome instalado e `axe-core` (já nas dependências).

## Estrutura

```
src/
  brand/        logo e símbolo em SVG, fontes das imagens OG
  components/   cabeçalho, rodapé, molduras, formulário, players
  config/       site.ts: nome, canais, navegação
  content/      servicos, trabalhos, guias, depoimentos
  layouts/      Base.astro: head, SEO, dados estruturados
  lib/          conteúdo, JSON-LD e imagem Open Graph
  pages/        uma página por arquivo
  styles/       tokens.css e global.css
public/
  brand/        kit da marca para baixar
  fonts/        Archivo variável
scripts/        captura, revisão, testes e geração do kit
```
