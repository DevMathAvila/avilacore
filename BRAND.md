# AvilaCore: regras de uso da marca

A AvilaCore é a marca de Matheus Ávila, de Indaiatuba (SP), para três frentes: audiovisual, drone e sites.
Este arquivo diz como usar o nome, o logo, as cores, a tipografia e a linguagem gráfica.
Para ver e baixar as peças, abra `/marca` no site.

## Nome

- Escreva **AvilaCore**: uma palavra, sem acento, com A e C maiúsculos.
- "Ávila Core" é a grafia antiga. Fica só como nome alternativo nos dados estruturados do site (`alternateName`).
- **Matheus Ávila** é a pessoa. A AvilaCore é o estúdio. Os textos falam em primeira pessoa ("eu gravo", "eu faço").
- Instagram: `@avilacore_`. Domínio: `avilacore.com.br`.

## Frase de marca

> Filmo do alto e coloco no ar.

"No ar" vale para o drone voando, para o vídeo publicado e para o site no ar.
Use a frase inteira, sem cortar e sem trocar a ordem.

## A ideia

O assunto da AvilaCore é enquadrar: escolher de onde olhar, pela câmera, do alto ou na tela do celular.
Tudo na marca sai disso.

## Logo

Arquivos em `src/brand/` (fonte) e `public/brand/` (para baixar).

| Versão | Arquivo | Quando usar |
|---|---|---|
| Clara | `logo-avilacore-clara` | Fundo escuro. É a versão principal. |
| Escura | `logo-avilacore-escura` | Fundo claro (papel, e-mail, proposta). |
| Uma cor | `logo-avilacore-uma-cor`, `-branca`, `-noite` | Marca d'água, bordado, carimbo, uma tinta só. |

- O logo parte da fonte Archivo (largura 125, peso 800), com espaçamento próprio.
- O pingo do "i" é um quadrado, um pouco acima da altura normal. É o detalhe da marca: não troque por ponto redondo.
- **Área livre:** deixe em volta do logo um espaço igual à altura da letra A.
- **Tamanho mínimo:** 96 px de largura na tela, 25 mm impresso. Abaixo disso, use o símbolo.
- Não estique, não incline, não contorne, não aplique sombra nem degradê, não troque as cores.

Para refazer o logo: `python scripts/marca/gerar-logo.py` (precisa de `fonttools` e `uharfbuzz`).

## Símbolo "Foco"

Dois cantos de enquadramento (superior esquerdo e inferior direito) com um quadrado no centro.
O quadrado é o núcleo, o pixel e, visto de cima, o drone.

- Use no avatar, no favicon e em qualquer espaço pequeno ou quadrado.
- `favicon.svg` é uma versão redesenhada numa grade de 16 px. Use essa em 16 e 32 px, e a normal acima disso.
- Os cantos também enquadram fotos e vídeos no site (classe `.moldura`). São sempre os mesmos dois cantos.

## Cores

Definidas em `src/styles/tokens.css`. Nenhum componente usa cor fora dos tokens.

| Nome | Hex | Uso |
|---|---|---|
| Noite | `#0E1624` | Fundo |
| Noite 2 | `#152033` | Superfícies e campos |
| Noite 3 | `#1C2A40` | Superfície elevada |
| Linha | `#26344B` | Filetes e grade (decorativo) |
| Borda | `#6A7890` | Borda de campo e controles |
| Papel | `#EDEBE6` | Texto principal |
| Névoa | `#A7ADB5` | Texto de apoio |
| Ciano | `#5CC0D0` | Foco, links, detalhe digital |
| Coral queimado | `#EF6F55` | Ações |
| Ciano escuro | `#0B6477` | Ciano sobre fundo claro |
| Coral escuro | `#B2412A` | Coral sobre fundo claro |

Contraste medido (WCAG 2.2, texto normal precisa de 4,5:1):

| Combinação | Contraste |
|---|---|
| Papel sobre Noite | 15,21:1 |
| Névoa sobre Noite | 8,01:1 |
| Ciano sobre Noite | 8,55:1 |
| Noite sobre Coral (texto do botão) | 6,10:1 |
| Borda sobre Noite 2 (borda de campo, mínimo 3:1) | 3,66:1 |
| Ciano escuro sobre Papel | 5,68:1 |
| Coral escuro sobre Papel | 4,79:1 |
| Ciano sobre Papel | 1,78:1, **não usar** |
| Coral sobre Papel | 2,49:1, **não usar** |

Regras:

- **Ciano sem brilho.** Nada de glow, neon ou degradê. Ele marca foco, links e pequenos detalhes, e não pinta áreas grandes.
- **Coral só para ação:** o botão principal de cada bloco e detalhes pequenos.
- **Nunca os dois juntos** no mesmo componente. Por isso o anel de foco do teclado é na cor Papel.
- Em fundo claro, ciano e coral viram as versões escuras.

## Tipografia

Uma família só: **Archivo** variável (Omnibus-Type, licença OFL), em `public/fonts/archivo-var.woff2`
(42 KB, subconjunto latino, peso 400 a 800, largura 100 a 125).

| Papel | Peso | Largura |
|---|---|---|
| Título principal | 800 | 108 no celular, 116 no tablet, 125 no desktop |
| Títulos | 780 | 108, 114 e 118 |
| Texto | 400 | 100 |
| Destaque no texto | 620 | 100 |

- A largura é a ideia: títulos largos como uma tela panorâmica no desktop e mais estreitos no celular, como o vídeo vertical.
- Só a primeira letra do título em maiúscula. Sem caixa-alta em rótulos.
- Texto de 17 a 19 px, altura de linha 1,6, até 36 caracteres por linha no celular e 62 no desktop.
- Números tabulares da própria Archivo (`.numeros`). Sem fonte monoespaçada.

## Linguagem gráfica

- **Cantos do Foco** enquadrando a primeira tela e as mídias.
- **Grade de terços** em linhas de 1 px na cor Linha.
- **Trajetória** tracejada em ciano, com pontos de passagem quadrados e o ponto de chegada em ciano.
- **Molduras na proporção do meio:** 9:16 para vídeo vertical, 16:9 para drone, 16:10 para site.
- **Coordenadas:** as de Indaiatuba, 23°05′24″ S, 47°13′04″ O. Não invente outras.
- **Grão** de filme bem leve por cima de tudo (`public/grao.svg`).

O que a marca não usa: ícone de drone, câmera, código ou foguete; cards em tudo; vidro e desfoque;
emoji; rótulo em caixa-alta acima de título; números 01/02/03 decorativos; uma palavra do título em outra cor;
dourado e clichês de luxo; foto de banco como se fosse trabalho próprio.

## Movimento

- Um momento orquestrado: a entrada da primeira tela da home (o foco fecha, o título sobe, a trajetória aparece).
- Fora isso, só resposta a ações: hover, abrir dúvida, menu, troca de página.
- Só `transform` e `opacity`. Com `prefers-reduced-motion`, nada se move.

## Voz

Português do Brasil, direto, em primeira pessoa. Detalhes em `marketing/brand-profile.md`.

- Botões dizem a ação: "Conte sua ideia", "Falar no WhatsApp", "Ver como funciona".
- Não escreva: "soluções inovadoras", "transformar sua presença digital", "próximo nível", "alavancar",
  "experiências únicas", "paixão por", "saiba mais".
- Sem travessão como recurso de estilo, sem superlativo sem prova, sem promessa de resultado.

## Honestidade

- Não invente cliente, projeto, depoimento, número, prazo, preço, certificação ou endereço.
- Estudo autoral aparece sempre como "Estudo autoral".
- Cliente e depoimento só entram com autorização registrada.
- O que falta fica vazio em `src/config/site.ts` e o site esconde o bloco.

## Peças do kit

Geradas por `node scripts/marca/gerar-kit.mjs`, em `public/brand/`:

- Logo e símbolo em SVG e PNG.
- Ícones do site: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, ícones do manifest.
- Imagem Open Graph: uma por página, gerada no build por `src/lib/og.ts`.
- Instagram: avatar 1080 x 1080 e três capas de destaque.
- Vídeo: marca d'água, lower third (editável e exemplo) e tela final horizontal e vertical.
- Assinatura de e-mail (`assinatura-email.html`) e modelo de proposta (`proposta-comercial.html`).
