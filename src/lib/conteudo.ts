/** Acesso às coleções, já com as regras de publicação aplicadas. */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Frente } from '../config/site';

export type Trabalho = CollectionEntry<'trabalhos'>;
export type Servico = CollectionEntry<'servicos'>;
export type Guia = CollectionEntry<'guias'>;

/** Só o que tem `publicado: true`, na ordem definida em cada ficha. */
export async function trabalhosPublicados(frente?: Frente): Promise<Trabalho[]> {
  const todos = await getCollection('trabalhos', ({ data }) => data.publicado);
  return todos
    .filter((t) => !frente || t.data.frente === frente)
    .sort((a, b) => a.data.ordem - b.data.ordem);
}

export async function servicos(): Promise<Servico[]> {
  return (await getCollection('servicos')).sort((a, b) => a.data.ordem - b.data.ordem);
}

export async function servicoDa(frente: Frente): Promise<Servico> {
  const s = (await getCollection('servicos')).find((x) => x.data.frente === frente);
  if (!s) throw new Error(`Falta o arquivo src/content/servicos/${frente}.md`);
  return s;
}

export async function guiasPublicados(): Promise<Guia[]> {
  return (await getCollection('guias', ({ data }) => data.publicado)).sort(
    (a, b) => b.data.atualizado.getTime() - a.data.atualizado.getTime(),
  );
}

/** Depoimentos só aparecem com autorização registrada. */
export async function depoimentosAutorizados(frente?: Frente) {
  const todos = await getCollection('depoimentos', ({ data }) => data.autorizado);
  return todos.filter((d) => !frente || d.data.frente === frente);
}

export const dataISO = (d: Date) => d.toISOString().slice(0, 10);

/** "16:10" -> "16 / 10" (para aspect-ratio no CSS) */
export const razao = (p: string) => p.replace(':', ' / ');
