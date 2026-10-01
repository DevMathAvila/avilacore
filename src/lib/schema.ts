/**
 * Dados estruturados (JSON-LD) em @graph. Só entra o que é verdadeiro e está em src/config/site.ts.
 * Sem Review, AggregateRating, preço ou horário.
 */
import { site, type Frente, frentes } from '../config/site';

const ID = {
  org: `${site.url}/#organizacao`,
  pessoa: `${site.url}/#matheus-avila`,
  site: `${site.url}/#site`,
};

export const absoluta = (caminho: string) =>
  caminho === '/' ? site.url : `${site.url}${caminho.replace(/\/$/, '')}`;

const cidades = site.areaPresencial.map((nome) => ({
  '@type': 'City',
  name: nome,
  containedInPlace: { '@type': 'State', name: 'São Paulo' },
}));
const brasil = { '@type': 'Country', name: 'Brasil' };

export function organizacao() {
  return {
    '@type': 'ProfessionalService',
    '@id': ID.org,
    name: site.nome,
    alternateName: site.nomeAlternativo,
    url: site.url,
    description: site.descricao,
    slogan: site.frase,
    logo: { '@type': 'ImageObject', url: `${site.url}/brand/logo-avilacore-512.png`, width: 512, height: 512 },
    image: `${site.url}/og/home.png`,
    telephone: site.whatsapp.tel,
    ...(site.email ? { email: site.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.cidade,
      addressRegion: site.uf,
      addressCountry: 'BR',
    },
    areaServed: [...cidades, brasil],
    founder: { '@id': ID.pessoa },
    sameAs: [site.instagram.url],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.whatsapp.tel,
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
      url: `https://wa.me/${site.whatsapp.numero}`,
    },
  };
}

export function pessoa() {
  return {
    '@type': 'Person',
    '@id': ID.pessoa,
    name: site.pessoa,
    url: absoluta('/sobre'),
    worksFor: { '@id': ID.org },
    address: { '@type': 'PostalAddress', addressLocality: site.cidade, addressRegion: site.uf, addressCountry: 'BR' },
    ...(site.perfisPessoa.length ? { sameAs: site.perfisPessoa } : {}),
  };
}

export function webSite() {
  return {
    '@type': 'WebSite',
    '@id': ID.site,
    url: site.url,
    name: site.nome,
    alternateName: site.nomeAlternativo,
    inLanguage: 'pt-BR',
    publisher: { '@id': ID.org },
  };
}

export type Migalha = { nome: string; caminho: string };

export function webPage(o: {
  caminho: string;
  titulo: string;
  descricao: string;
  atualizado: string;
  migalhas?: Migalha[];
  tipo?: string;
}) {
  const url = absoluta(o.caminho);
  const nos: Record<string, unknown>[] = [
    {
      '@type': o.tipo ?? 'WebPage',
      '@id': `${url}#pagina`,
      url,
      name: o.titulo,
      description: o.descricao,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': ID.site },
      about: { '@id': ID.org },
      dateModified: o.atualizado,
      ...(o.migalhas?.length ? { breadcrumb: { '@id': `${url}#migalhas` } } : {}),
    },
  ];
  if (o.migalhas?.length) {
    nos.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#migalhas`,
      itemListElement: [{ nome: 'Início', caminho: '/' }, ...o.migalhas].map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: m.nome,
        item: absoluta(m.caminho),
      })),
    });
  }
  return nos;
}

export function servico(o: { frente: Frente; tipo: string; descricao: string; itens: string[] }) {
  const url = absoluta(frentes[o.frente].href);
  return {
    '@type': 'Service',
    '@id': `${url}#servico`,
    name: `${frentes[o.frente].nome} · ${site.nome}`,
    serviceType: o.tipo,
    description: o.descricao,
    url,
    provider: { '@id': ID.org },
    areaServed: o.frente === 'sites' ? [brasil] : cidades,
    ...(o.itens.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `Serviços de ${frentes[o.frente].nome.toLowerCase()}`,
            itemListElement: o.itens.map((nome) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: nome },
            })),
          },
        }
      : {}),
  };
}

export function faq(caminho: string, duvidas: { pergunta: string; resposta: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluta(caminho)}#duvidas`,
    mainEntity: duvidas.map((d) => ({
      '@type': 'Question',
      name: d.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: d.resposta },
    })),
  };
}

export function grafo(nos: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nos.flat() });
}
