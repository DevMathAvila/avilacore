# WhatsApp Float Button

Este arquivo documenta a implementacao e a correcao do botao flutuante de contato via WhatsApp.

## O que foi feito

- Adicionado um link flutuante em `index.html`, antes de `</body>`
- Confirmado que o elemento esta direto como filho do `body`
- O link aponta para `https://wa.me/5519993808005`
- O icone foi incluido como SVG inline
- O botao abre em nova aba com `target="_blank"` e `rel="noreferrer"`
- O botao recebeu `aria-label` para acessibilidade
- O CSS foi corrigido para garantir que o botao fique fixo no viewport, e nao no fluxo da pagina

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
- JavaScript: nenhum

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
- Nao adicionar JS para comportamento basico
- Antes de alterar a posicao, testar se o botao nao cobre conteudo critico no mobile
