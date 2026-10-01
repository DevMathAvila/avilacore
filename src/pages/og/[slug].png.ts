/**
 * Gera uma imagem Open Graph por página, no modelo da marca (src/lib/og.ts).
 * Trabalho ou guia novo ganha a sua imagem sozinho, a partir do título.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { imagemOg } from '../../lib/og';
import { site } from '../../config/site';
import { servicos, trabalhosPublicados } from '../../lib/conteudo';

type Cartao = { titulo: string; apoio?: string };

export const getStaticPaths: GetStaticPaths = async () => {
  const fixas: Record<string, Cartao> = {
    home: { titulo: 'Vídeo, imagem aérea e sites para quem precisa ser visto.', apoio: `${site.pessoa}, ${site.cidade} (${site.uf})` },
    trabalhos: { titulo: 'Trabalhos e estudos', apoio: 'Vídeo, drone e sites' },
    sobre: { titulo: site.pessoa, apoio: 'Vídeo, drone e sites. Indaiatuba, SP.' },
    contato: { titulo: 'Conte sua ideia', apoio: `WhatsApp ${site.whatsapp.exibicao}` },
    guias: { titulo: 'Guias', apoio: 'Vídeo, drone e sites, com fontes oficiais.' },
    'politica-de-privacidade': { titulo: 'Política de privacidade' },
    termos: { titulo: 'Termos de uso' },
    marca: { titulo: 'Kit da marca' },
  };
  const paginas: [string, Cartao][] = Object.entries(fixas);
  for (const s of await servicos()) paginas.push([s.data.frente, { titulo: s.data.titulo, apoio: s.data.resumo }]);
  for (const t of await trabalhosPublicados()) {
    paginas.push([
      `trabalhos-${t.id}`,
      { titulo: t.data.titulo, apoio: `${t.data.tipo === 'estudo' ? 'Estudo autoral' : 'Trabalho para cliente'}. ${t.data.categoria}.` },
    ]);
  }
  for (const g of await getCollection('guias')) paginas.push([`guias-${g.id}`, { titulo: g.data.titulo, apoio: 'Guia' }]);
  return paginas.map(([slug, cartao]) => ({ params: { slug }, props: cartao }));
};

export const GET: APIRoute = async ({ props }) => {
  const { titulo, apoio } = props as Cartao;
  const png = await imagemOg(titulo, apoio);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
