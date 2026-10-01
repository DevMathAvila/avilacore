/**
 * Gera o kit da marca AvilaCore em public/brand e os ícones do site em public/.
 * Uso: node scripts/marca/gerar-kit.mjs
 *
 * Os SVGs de src/brand são a fonte. Se o logo mudar, rode scripts/marca/gerar-logo.py
 * e depois este script.
 */
import sharp from 'sharp';
import { ler, png, salvar, copiar, encaixar, recolorir, ico, cantos, COR, BRAND, SAIDA } from './kit-base.mjs';
import { pecasInstagram, pecasVideo } from './kit-pecas.mjs';

const logoClara = ler('logo-avilacore-clara.svg');
const logoEscura = ler('logo-avilacore-escura.svg');
const logoUmaCor = ler('logo-avilacore-uma-cor.svg');
const focoClara = ler('simbolo-foco-clara.svg');
const focoEscura = ler('simbolo-foco-escura.svg');
const focoUmaCor = ler('simbolo-foco-uma-cor.svg');
const focoApp = ler('simbolo-foco-app.svg');
const favicon = ler('favicon.svg');

console.log('Logo e símbolo');
for (const arquivo of [
  'logo-avilacore-clara.svg',
  'logo-avilacore-escura.svg',
  'logo-avilacore-uma-cor.svg',
  'simbolo-foco-clara.svg',
  'simbolo-foco-escura.svg',
  'simbolo-foco-uma-cor.svg',
  'simbolo-foco-app.svg',
]) {
  copiar(`${BRAND}${arquivo}`, `${SAIDA}${arquivo}`);
}
await png(logoClara, `${SAIDA}logo-avilacore-clara.png`, { largura: 2400 });
await png(logoEscura, `${SAIDA}logo-avilacore-escura.png`, { largura: 2400 });
await png(recolorir(logoUmaCor, 'currentColor', '#FFFFFF'), `${SAIDA}logo-avilacore-branca.png`, { largura: 2400 });
await png(recolorir(logoUmaCor, 'currentColor', COR.noite), `${SAIDA}logo-avilacore-noite.png`, { largura: 2400 });
await png(focoClara, `${SAIDA}simbolo-foco-clara.png`, { largura: 1024 });
await png(focoEscura, `${SAIDA}simbolo-foco-escura.png`, { largura: 1024 });
await png(recolorir(focoUmaCor, 'currentColor', '#FFFFFF'), `${SAIDA}simbolo-foco-branca.png`, { largura: 1024 });
await png(focoApp, `${SAIDA}simbolo-foco-app.png`, { largura: 1024 });
// logo quadrado usado nos dados estruturados (Organization.logo)
await png(focoApp.replace('rx="220"', 'rx="0"'), `${SAIDA}logo-avilacore-512.png`, { largura: 512 });

console.log('Ícones do site');
copiar(`${BRAND}favicon.svg`, 'public/favicon.svg');
const quadrado = focoApp.replace('rx="220"', 'rx="0"');
await png(quadrado, 'public/apple-touch-icon.png', { largura: 180 });
await png(focoApp, 'public/icon-192.png', { largura: 192 });
await png(focoApp, 'public/icon-512.png', { largura: 512 });
const mascaravel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${COR.noite}"/>${encaixar(focoClara, 100, 100, 800, 800)}</svg>`;
await png(mascaravel, 'public/icon-maskable-512.png', { largura: 512 });
const entradas = [];
for (const tamanho of [16, 32, 48]) {
  const dados = await sharp(Buffer.from(favicon), { density: 600 }).resize(tamanho, tamanho).png().toBuffer();
  entradas.push({ tamanho, dados });
}
salvar('public/favicon.ico', ico(entradas));
salvar(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'AvilaCore',
      short_name: 'AvilaCore',
      description: 'Vídeo, imagens aéreas com drone e sites. Matheus Ávila, Indaiatuba (SP).',
      lang: 'pt-BR',
      start_url: '/',
      display: 'browser',
      background_color: COR.noite,
      theme_color: COR.noite,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ),
);

console.log('Instagram');
await pecasInstagram({ focoClara, logoClara, cantos });

console.log('Vídeo');
await pecasVideo({ focoClara, logoClara, logoUmaCor, focoUmaCor, cantos });

console.log('Kit gerado.');
