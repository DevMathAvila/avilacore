/**
 * Coleções de conteúdo. Cada item é um arquivo .md; o nome do arquivo vira o slug.
 *
 * - servicos:    um arquivo por frente, com os serviços e o campo `confirmado`.
 * - trabalhos:   portfólio. Um trabalho novo = um .md + a mídia. Só aparece com `publicado: true`.
 * - guias:       conteúdo educativo. Só entra no menu e no sitemap com `publicado: true`.
 * - depoimentos: só aparecem com `autorizado: true`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const frente = z.enum(['audiovisual', 'drone', 'sites']);
const proporcao = z.enum(['16:9', '16:10', '9:16', '4:5', '1:1', '4:3', '21:9']);

const servicos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/servicos' }),
  schema: z.object({
    frente,
    ordem: z.number().int(),
    /** nome curto da frente, usado em menus e listas */
    nome: z.string(),
    /** H1 da página */
    titulo: z.string(),
    /** frase de apoio logo abaixo do H1 */
    lead: z.string(),
    /** resumo de uma linha para a home */
    resumo: z.string(),
    seo: z.object({ title: z.string(), description: z.string() }),
    /** tipo de serviço nos dados estruturados (Service.serviceType) */
    tipoServico: z.string(),
    /** itens só aparecem no site com confirmado: true */
    itens: z.array(z.object({ nome: z.string(), descricao: z.string(), confirmado: z.boolean() })),
    paraQuem: z.array(z.string()),
    /** texto de cada um dos 5 passos nesta frente */
    processo: z.array(z.object({ titulo: z.string(), texto: z.string() })).length(5),
    duvidas: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).min(3).max(6),
    /** chamada do bloco final */
    fechamento: z.string(),
    atualizado: z.coerce.date(),
  }),
});

const trabalhos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/trabalhos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      frente,
      /** real = feito para um cliente; estudo = projeto autoral, com marca fictícia */
      tipo: z.enum(['real', 'estudo']),
      /** o que é, em poucas palavras (ex.: "Site para escritório de arquitetura") */
      categoria: z.string(),
      /** descrição curta, usada nas listas e na meta description */
      resumo: z.string(),
      cliente: z.string().optional(),
      ano: z.number().int().optional(),
      local: z.string().optional(),
      midia: z.discriminatedUnion('formato', [
        z.object({
          formato: z.literal('imagem'),
          src: image(),
          alt: z.string().min(10),
          proporcao,
          /** segunda imagem opcional (ex.: a versão de celular de um site) */
          celular: image().optional(),
          altCelular: z.string().optional(),
        }),
        z.object({
          formato: z.literal('video'),
          /** caminho do arquivo em /public (ex.: /videos/meu-video.mp4) */
          arquivo: z.string(),
          /** trecho curto e leve, sem som, para tocar nas molduras (ex.: /videos/meu-video-previa.mp4) */
          previa: z.string().optional(),
          poster: image(),
          alt: z.string().min(10),
          proporcao,
          duracao: z.string().optional(),
          transcricao: z.string().optional(),
        }),
        z.object({
          formato: z.literal('video-externo'),
          provedor: z.enum(['youtube', 'vimeo']),
          /** id do vídeo no YouTube ou no Vimeo */
          id: z.string(),
          poster: image(),
          alt: z.string().min(10),
          proporcao,
          duracao: z.string().optional(),
          transcricao: z.string().optional(),
        }),
      ]),
      creditos: z.array(z.object({ papel: z.string(), nome: z.string() })).default([]),
      /** aviso de honestidade (ex.: fotos de banco de imagem dentro de um estudo) */
      nota: z.string().optional(),
      link: z.object({ rotulo: z.string(), url: z.url() }).optional(),
      ordem: z.number().int().default(100),
      publicado: z.boolean(),
      atualizado: z.coerce.date(),
    }),
});

const guias = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string(),
    description: z.string(),
    resumo: z.string(),
    frente,
    fontes: z.array(z.object({ nome: z.string(), url: z.url() })).default([]),
    /** false = rascunho: fora do menu e do sitemap, com noindex */
    publicado: z.boolean(),
    atualizado: z.coerce.date(),
  }),
});

const depoimentos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/depoimentos' }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      papel: z.string(),
      foto: image().optional(),
      /** slug do trabalho a que o depoimento se refere */
      trabalho: z.string().optional(),
      frente,
      /** só aparece no site com autorização registrada */
      autorizado: z.boolean(),
      autorizadoEm: z.string().optional(),
    }),
});

export const collections = { servicos, trabalhos, guias, depoimentos };
