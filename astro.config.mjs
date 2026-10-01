// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://www.avilacore.com.br';
const REVISADO_EM = '2026-10-01';

/** Lê o frontmatter dos .md de uma coleção sem depender do Astro (o config roda antes). */
function lerColecao(pasta) {
  const base = new URL(`./src/content/${pasta}/`, import.meta.url);
  let arquivos = [];
  try {
    arquivos = readdirSync(base).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  return arquivos.map((f) => {
    const txt = readFileSync(new URL(f, base), 'utf8');
    const campo = (nome) => (txt.match(new RegExp('^' + nome + ':[ ]*(.+)$', 'm')) || [])[1]?.trim();
    return {
      slug: f.replace(/\.md$/, ''),
      publicado: campo('publicado') === 'true',
      atualizado: campo('atualizado')?.replace(/['"]/g, ''),
    };
  });
}

const trabalhos = lerColecao('trabalhos');
const guias = lerColecao('guias');
const guiasPublicados = guias.filter((g) => g.publicado);

/** lastmod por URL: data do conteúdo quando existe, senão a última revisão geral */
const datas = new Map();
for (const t of trabalhos) if (t.atualizado) datas.set(`/trabalhos/${t.slug}`, t.atualizado);
for (const g of guias) if (g.atualizado) datas.set(`/guias/${g.slug}`, g.atualizado);

const FORA_DO_SITEMAP = ['/marca', '/404', '/contato/enviada'];

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  compressHTML: true,
  // CSS embutido no HTML: nenhuma folha de estilo bloqueando a primeira renderização
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // Na Vercel usa o adaptador dela. Fora dela (build local, astro preview), o de Node:
  // o empacotador da Vercel falha no Windows (EISDIR em readlink) e o de Node não.
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
  redirects: {
    '/filmagens': { status: 301, destination: '/drone' },
    '/suporte': { status: 301, destination: '/' },
    '/infraestrutura': { status: 301, destination: '/' },
    '/home': { status: 301, destination: '/' },
  },
  integrations: [
    sitemap({
      filter: (url) => {
        const caminho = new URL(url).pathname.replace(/\/$/, '') || '/';
        if (FORA_DO_SITEMAP.includes(caminho)) return false;
        if (caminho === '/guias') return guiasPublicados.length > 0;
        if (caminho.startsWith('/guias/')) {
          return guiasPublicados.some((g) => caminho === `/guias/${g.slug}`);
        }
        return true;
      },
      serialize: (item) => {
        const caminho = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        return { ...item, lastmod: datas.get(caminho) ?? REVISADO_EM };
      },
    }),
  ],
});
