# WhatsApp Float Button

Este arquivo documenta a implementacao, as correcoes e os comportamentos atuais do botao flutuante de contato via WhatsApp.

## O que foi feito

- Adicionado um link flutuante em `index.html`, antes de `</body>`
- Confirmado que o elemento esta direto como filho do `body`
- O link aponta para `https://wa.me/5519993808005`
- O icone foi incluido como SVG inline
- O botao abre em nova aba com `target="_blank"` e `rel="noreferrer"`
- O botao recebeu `aria-label` para acessibilidade
- O CSS foi corrigido para garantir que o botao fique fixo no viewport, e nao no fluxo da pagina
- Foi adicionado um balao de hover no desktop com o texto `Fale comigo!`
- Foi adicionada animacao de pulso no mobile
- Foi adicionada rotacao automatica de frases no mobile via `assets/js/main.js`
- A logica das frases do mobile foi reescrita para garantir que elas aparecam de fato depois que o botao existe no DOM
- A abordagem das frases do mobile foi alterada novamente: agora a mensagem nao fica dentro do botao, ela e criada direto no `body` e posicionada via JavaScript

## Problema corrigido

O botao chegou a aparecer grande e abaixo do footer, dentro do fluxo normal da pagina.

Para corrigir isso:

- foi mantido o elemento fora de `main`, `section`, `div`, `header` e `footer`
- a classe `.whatsapp-float` recebeu `position: fixed !important`
- o `z-index` foi elevado para `9999`
- width, height, display e alinhamento foram definidos de forma explicita
- o SVG recebeu tamanho fixo e `flex-shrink: 0`

## Onde foi implementado

- HTML: `index.html`
- CSS: `assets/css/style.css`
- JavaScript: `assets/js/main.js`

## O que existe hoje no botao

### Estrutura base

- Link flutuante com classe `.whatsapp-float`
- SVG inline do WhatsApp
- Posicionamento fixo no canto inferior direito
- Abertura em nova aba

### Desktop

- Hover com escala leve no botao
- Balao de mensagem saindo para a esquerda
- Texto atual do balao: `Fale comigo!`
- Balao implementado apenas com CSS usando `::before` e `::after`

### Mobile

- Animacao de pulso suave em loop
- Frases rotativas aparecendo ao lado esquerdo do botao
- Frases atuais:
  - `Me chame!`
  - `Vamos conversar?`
  - `Faça um orçamento`
- As frases sao inseridas e controladas por JS
- O elemento da frase agora e inserido no `body`, nao dentro de `.whatsapp-float`
- A logica so ativa em largura `<= 768px`
- A inicializacao acontece uma unica vez

## Regra final de CSS aplicada

```css
.whatsapp-float {
  position: fixed !important;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  width: 52px;
  height: 52px;
  background-color: var(--primary);
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(0, 255, 157, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.whatsapp-float svg {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}

.whatsapp-float:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(0, 255, 157, 0.4);
}

@media (max-width: 768px) {
  .whatsapp-float {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }

  .whatsapp-float svg {
    width: 24px;
    height: 24px;
  }
}
```

## Comportamento adicional inserido depois

### Balao no hover do desktop

- Feito com pseudo-elementos do `.whatsapp-float`
- Nao usa JavaScript
- Fica oculto por padrao
- Aparece no `hover` e no `focus-visible`
- Usa:
  - `var(--surface)` no fundo
  - `var(--border)` na borda
  - `var(--text-main)` no texto

### Pulso no mobile

- Feito com `@keyframes whatsappFloatPulse`
- Loop infinito
- Escala sutil para chamar atencao sem exagero

### Frases rotativas no mobile

- Elemento criado no DOM como filho de `.whatsapp-float`
- Classe usada: `.whatsapp-float-message`
- Controle feito em `assets/js/main.js`
- Rotacao feita por `setTimeout`
- A frase recebe a classe `.visible` para aparecer
- A primeira exibicao comeca alguns segundos depois do carregamento em mobile
- Ao sair do breakpoint mobile, o timer ativo e limpo
- Quando volta para mobile, a rotacao reinicia
- A implementacao busca o botao com `document.querySelector('.whatsapp-float')` antes de continuar
- A mensagem e posicionada por `getBoundingClientRect()` com base na posicao real do botao na tela

## Correcao mais recente

Problema encontrado:

- o JavaScript rodava, mas a frase continuava sem aparecer no mobile

Nova abordagem aplicada:

- a mensagem deixou de ser filha do botao
- agora o elemento `.whatsapp-float-message` e criado como filho direto do `body`
- a posicao da mensagem e recalculada por JS com base na posicao real do botao
- isso evita corte visual por contexto do pai, overflow ou empilhamento local

O que mudou no JS:

- criada funcao para montar o elemento no `body`
- criada funcao para posicionar a mensagem com `getBoundingClientRect()`
- a exibicao continua por `setTimeout`
- o resize limpa o timer e agenda novamente

O que mudou no CSS:

- `.whatsapp-float-message` passou de `position: absolute` para `position: fixed`
- o elemento recebeu `z-index: 9998`
- o estilo continua com fade e slide usando a classe `.visible`

## Comportamento visual esperado

- Posicao fixa no canto inferior direito da tela
- Desktop:
  - `right: 28px`
  - `bottom: 28px`
  - `width: 52px`
  - `height: 52px`
- Mobile:
  - `right: 20px`
  - `bottom: 20px`
  - `width: 48px`
  - `height: 48px`
- `z-index: 9999`
- Cor principal baseada em `var(--primary)`

## Regras de manutencao

- Se o numero mudar, atualizar o `href` em `index.html`
- Se a identidade visual mudar, ajustar somente em `assets/css/style.css`
- Nao criar CSS separado para esse botao
- O comportamento basico continua sem JS
- Os textos rotativos do mobile ficam em `assets/js/main.js`
- Se mudar as frases, atualizar tambem esta documentacao
- Se mudar o texto do balao desktop, atualizar tambem esta documentacao
- Se mudar timings, animacoes ou breakpoint, atualizar tambem esta documentacao
- Antes de alterar a posicao, testar se o botao nao cobre conteudo critico no mobile

## Regra de processo

- Sempre que esse botao for alterado, este arquivo `whatsapp.md` deve ser atualizado junto
- A documentacao deve refletir:
  - o que foi feito
  - o que foi inserido
  - o que mudou no HTML
  - o que mudou no CSS
  - o que mudou no JS
