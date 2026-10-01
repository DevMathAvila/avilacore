/** Peças do kit: Instagram (avatar e capas de destaque) e vídeo (marca d'água, lower third, tela final). */
import { png, salvar, encaixar, recolorir, texto, ler, COR, SAIDA } from './kit-base.mjs';

const svg = (w, h, dentro, fundo = true) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${fundo ? `<rect width="${w}" height="${h}" fill="${COR.noite}"/>` : ''}${dentro}</svg>`;

export async function pecasInstagram({ cantos }) {
  // Avatar: quadrado cheio (o Instagram recorta o círculo sozinho)
  const avatar = ler('avatar-instagram.svg').replace(/<circle[^>]*\/>/, `<rect width="1000" height="1000" fill="${COR.noite}"/>`);
  await png(avatar, `${SAIDA}instagram/avatar-1080.png`, { largura: 1080 });

  // Capas de destaque (1080 x 1920). O desenho fica no centro, dentro do recorte redondo.
  const capas = {
    audiovisual: {
      nome: 'Audiovisual',
      arte: `${cantos(450, 800, 180, 320, 46, 12)}<rect x="514" y="934" width="52" height="52" fill="${COR.ciano}"/>`,
    },
    drone: {
      nome: 'Drone',
      arte: `${cantos(380, 860, 320, 200, 46, 12)}<path d="M410 1030C470 1020 540 990 590 950S650 900 668 884" fill="none" stroke="${COR.ciano}" stroke-width="7" stroke-dasharray="14 16"/><rect x="646" y="866" width="36" height="36" fill="${COR.ciano}"/>`,
    },
    sites: {
      nome: 'Sites',
      arte: `${cantos(380, 860, 320, 200, 46, 12)}<path d="M430 930H600M430 962H550" stroke="${COR.borda}" stroke-width="12"/><rect x="430" y="990" width="40" height="40" fill="${COR.ciano}"/>`,
    },
  };
  for (const [slug, c] of Object.entries(capas)) {
    const rotulo = await texto([{ texto: c.nome, fonte: 'Titulo', tamanho: 72 }], { largura: 1080, altura: 120, alinhar: 'center', justificar: 'center' });
    const arte = svg(1080, 1920, `<g transform="translate(540 960) scale(1.8) translate(-540 -960)">${c.arte}</g>${encaixar(rotulo, 0, 1380, 1080, 120)}`);
    await png(arte, `${SAIDA}instagram/destaque-${slug}.png`, { largura: 1080, densidade: 72 });
  }
}

export async function pecasVideo({ focoClara, logoClara, logoUmaCor, focoUmaCor, cantos }) {
  // Marca d'água: logo e símbolo em branco, fundo transparente (a opacidade é ajustada no editor)
  const logoBranco = recolorir(logoUmaCor, 'currentColor', '#FFFFFF');
  const focoBranco = recolorir(focoUmaCor, 'currentColor', '#FFFFFF');
  salvar(`${SAIDA}video/marca-dagua-logo.svg`, logoBranco);
  salvar(`${SAIDA}video/marca-dagua-simbolo.svg`, focoBranco);
  await png(logoBranco, `${SAIDA}video/marca-dagua-logo.png`, { largura: 1200 });
  await png(focoBranco, `${SAIDA}video/marca-dagua-simbolo.png`, { largura: 512 });

  // Lower third (1920 x 1080, transparente): painel no canto inferior esquerdo
  const painel = (linhas) =>
    `<rect x="96" y="836" width="660" height="148" fill="${COR.noite}" fill-opacity=".92"/>${cantos(96, 836, 660, 148, 26, 5)}<rect x="126" y="866" width="22" height="22" fill="${COR.ciano}"/>${linhas}`;
  const exemplo = await texto(
    [
      { texto: 'Matheus Ávila', fonte: 'Titulo', tamanho: 46 },
      { texto: 'AvilaCore', fonte: 'Texto', tamanho: 28, cor: COR.nevoa, espaco: 8 },
    ],
    { largura: 560, altura: 110, justificar: 'center' },
  );
  await png(svg(1920, 1080, painel(encaixar(exemplo, 172, 855, 560, 110)), false), `${SAIDA}video/lower-third-exemplo.png`, { largura: 1920, densidade: 72 });
  // versão editável: troque os dois textos num editor de SVG (a fonte Archivo precisa estar instalada)
  salvar(
    `${SAIDA}video/lower-third-editavel.svg`,
    svg(
      1920,
      1080,
      painel(
        `<text x="172" y="914" font-family="Archivo" font-weight="800" font-stretch="125%" font-size="46" fill="${COR.papel}">Nome da pessoa</text><text x="172" y="956" font-family="Archivo" font-weight="500" font-size="28" fill="${COR.nevoa}">Função ou empresa</text>`,
      ),
      false,
    ),
  );

  // Tela final, horizontal e vertical
  const contatos = ['avilacore.com.br', '@avilacore_', '(19) 99380-8005'];
  const telas = { '1920x1080': [1920, 1080], '1080x1920': [1080, 1920] };
  for (const [nome, [w, h]] of Object.entries(telas)) {
    const vertical = h > w;
    const larguraLogo = vertical ? 700 : 820;
    const alturaLogo = (larguraLogo * 830) / 5888;
    const yLogo = h / 2 - alturaLogo - (vertical ? 60 : 30);
    const bloco = await texto(
      [
        { texto: 'Filmo do alto e coloco no ar.', fonte: 'Titulo', tamanho: vertical ? 44 : 46 },
        ...(vertical
          ? contatos.map((c, i) => ({ texto: c, tamanho: 34, cor: COR.nevoa, espaco: i === 0 ? 70 : 14 }))
          : [{ texto: contatos.join('      '), tamanho: 30, cor: COR.nevoa, espaco: 60 }]),
      ],
      { largura: w, altura: vertical ? 420 : 240, alinhar: 'center' },
    );
    const m = Math.round(w * 0.045);
    const tercos = `<path d="M${w / 3} 0V${h}M${(2 * w) / 3} 0V${h}M0 ${h / 3}H${w}M0 ${(2 * h) / 3}H${w}" stroke="${COR.linha}" stroke-width="2" fill="none"/>`;
    const arte = svg(
      w,
      h,
      `${tercos}${cantos(m, m, w - 2 * m, h - 2 * m, Math.round(w * 0.04), 6)}${encaixar(logoClara, (w - larguraLogo) / 2, yLogo, larguraLogo, alturaLogo)}${encaixar(bloco, 0, h / 2 + (vertical ? 40 : 50), w, vertical ? 420 : 240)}`,
    );
    await png(arte, `${SAIDA}video/tela-final-${nome}.png`, { largura: w, densidade: 72 });
  }
}
