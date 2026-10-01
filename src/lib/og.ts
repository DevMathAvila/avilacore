/**
 * Modelo de imagem Open Graph da AvilaCore (1200 x 630).
 * O texto é convertido em contornos pelo satori (não depende de fonte instalada no servidor)
 * e o fundo é a linguagem gráfica da marca: grade de terços, cantos do Foco e trajetória.
 */
import { readFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';
import { site } from '../config/site';

const raiz = `${process.cwd()}/src/brand/`;
const fonteTitulo = readFileSync(`${raiz}fontes/archivo-titulo.ttf`);
const fonteTexto = readFileSync(`${raiz}fontes/archivo-texto.ttf`);
const logo = readFileSync(`${raiz}logo-avilacore-clara.svg`, 'utf8')
  .replace(/<title>.*?<\/title>/, '')
  .replace('<svg ', '<svg x="72" y="64" width="256" height="36" ');

const COR = { noite: '#0E1624', linha: '#26344B', papel: '#EDEBE6', nevoa: '#A7ADB5', ciano: '#5CC0D0' };

const fundo = `
<rect width="1200" height="630" fill="${COR.noite}"/>
<path d="M400 0V630M800 0V630M0 210H1200M0 420H1200" stroke="${COR.linha}" stroke-width="1" fill="none"/>
<path d="M36 84V36H84M1164 546V594H1116" stroke="${COR.papel}" stroke-width="4" fill="none"/>
<path d="M0 588C380 584 700 540 860 410S1060 210 1092 128" stroke="${COR.ciano}" stroke-opacity=".8" stroke-width="2.5" stroke-dasharray="8 11" fill="none"/>
<rect x="539" y="548" width="10" height="10" fill="${COR.papel}" fill-opacity=".75"/>
<rect x="855" y="405" width="10" height="10" fill="${COR.papel}" fill-opacity=".75"/>
<rect x="1080" y="106" width="24" height="24" fill="${COR.ciano}"/>
${logo}`;

export async function imagemOg(titulo: string, apoio = ''): Promise<Buffer> {
  const tamanho = titulo.length <= 24 ? 88 : titulo.length <= 44 ? 70 : 58;
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '110px 72px 70px',
          color: COR.papel,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                maxWidth: 860,
                fontFamily: 'Titulo',
                fontSize: tamanho,
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
              },
              children: titulo,
            },
          },
          apoio
            ? {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    maxWidth: 700,
                    marginTop: 26,
                    fontFamily: 'Texto',
                    fontSize: 30,
                    lineHeight: 1.3,
                    color: COR.nevoa,
                  },
                  children: apoio,
                },
              }
            : null,
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                left: 72,
                bottom: 58,
                fontFamily: 'Texto',
                fontSize: 24,
                color: COR.nevoa,
              },
              children: site.url.replace('https://www.', ''),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                position: 'absolute',
                right: 136,
                top: 92,
                fontFamily: 'Texto',
                fontSize: 20,
                lineHeight: 1.3,
                color: COR.papel,
              },
              children: [
                { type: 'div', props: { children: site.coordenadas.lat } },
                { type: 'div', props: { children: site.coordenadas.lon } },
              ],
            },
          },
        ],
      },
    } as never,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Titulo', data: fonteTitulo, weight: 800, style: 'normal' },
        { name: 'Texto', data: fonteTexto, weight: 500, style: 'normal' },
      ],
    },
  );
  const completo = svg.replace(/(<svg[^>]*>)/, `$1${fundo}`);
  return sharp(Buffer.from(completo)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
