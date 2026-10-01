/**
 * Peças de apoio para gerar o kit da marca (scripts/marca/gerar-kit.mjs).
 * Tudo sai dos SVGs de src/brand e das fontes de src/brand/fontes.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';
import satori from 'satori';

export const BRAND = 'src/brand/';
export const SAIDA = 'public/brand/';
export const COR = {
  noite: '#0E1624',
  noite2: '#152033',
  linha: '#26344B',
  borda: '#6A7890',
  papel: '#EDEBE6',
  nevoa: '#A7ADB5',
  ciano: '#5CC0D0',
  coral: '#EF6F55',
  cianoEscuro: '#0B6477',
};

const fontes = [
  { name: 'Titulo', data: readFileSync(`${BRAND}fontes/archivo-titulo.ttf`), weight: 800, style: 'normal' },
  { name: 'Texto', data: readFileSync(`${BRAND}fontes/archivo-texto.ttf`), weight: 500, style: 'normal' },
];

export const ler = (nome) => readFileSync(`${BRAND}${nome}`, 'utf8');
export const semTitulo = (svg) => svg.replace(/<title>.*?<\/title>/, '');
export const garantirPasta = (arquivo) => mkdirSync(dirname(arquivo), { recursive: true });

/** Posiciona um SVG da marca dentro de outro (x, y, largura, altura). */
export const encaixar = (svg, x, y, w, h) =>
  semTitulo(svg).replace(/<svg ([^>]*)>/, (_, attrs) => {
    const limpos = attrs.replace(/ ?(?:^|(?<= ))(x|y|width|height)="[^"]*"/g, '');
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" ${limpos}>`;
  });

/** Troca as cores de um SVG da marca (ex.: versão toda branca). */
export const recolorir = (svg, de, para) => svg.replaceAll(de, para);

export async function png(svg, arquivo, opcoes = {}) {
  garantirPasta(arquivo);
  const { largura, altura, densidade = 300 } = opcoes;
  let img = sharp(Buffer.from(svg), { density: densidade });
  if (largura || altura) img = img.resize(largura, altura);
  await img.png({ compressionLevel: 9 }).toFile(arquivo);
  console.log('  ', arquivo);
}

export function salvar(arquivo, conteudo) {
  garantirPasta(arquivo);
  writeFileSync(arquivo, conteudo);
  console.log('  ', arquivo);
}

export function copiar(origem, destino) {
  garantirPasta(destino);
  copyFileSync(origem, destino);
  console.log('  ', destino);
}

/**
 * Texto em contornos (não depende de fonte instalada). Devolve um <svg> para encaixar.
 * linhas: [{ texto, fonte: 'Titulo' | 'Texto', tamanho, cor, espaco }]
 */
export async function texto(linhas, { largura, altura, alinhar = 'flex-start', justificar = 'flex-start' }) {
  return satori(
    {
      type: 'div',
      props: {
        style: {
          width: largura,
          height: altura,
          display: 'flex',
          flexDirection: 'column',
          alignItems: alinhar,
          justifyContent: justificar,
        },
        children: linhas.map((l) => ({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: l.fonte ?? 'Texto',
              fontSize: l.tamanho,
              color: l.cor ?? COR.papel,
              lineHeight: l.altura ?? 1.15,
              letterSpacing: l.fonte === 'Titulo' ? '-0.015em' : '0',
              marginTop: l.espaco ?? 0,
              textAlign: alinhar === 'center' ? 'center' : 'left',
            },
            children: l.texto,
          },
        })),
      },
    },
    { width: largura, height: altura, fonts: fontes },
  );
}

/** Monta um arquivo .ico a partir de PNGs (16, 32, 48...). */
export function ico(pngs) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(pngs.length, 4);
  let deslocamento = 6 + 16 * pngs.length;
  const entradas = pngs.map(({ tamanho, dados }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(tamanho >= 256 ? 0 : tamanho, 0);
    e.writeUInt8(tamanho >= 256 ? 0 : tamanho, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(dados.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += dados.length;
    return e;
  });
  return Buffer.concat([cabecalho, ...entradas, ...pngs.map((p) => p.dados)]);
}

/** Cantos do Foco (superior esquerdo e inferior direito) num retângulo. */
export const cantos = (x, y, w, h, braco, traco, cor = COR.papel) =>
  `<path d="M${x} ${y + braco}V${y}H${x + braco}M${x + w} ${y + h - braco}V${y + h}H${x + w - braco}" fill="none" stroke="${cor}" stroke-width="${traco}"/>`;
