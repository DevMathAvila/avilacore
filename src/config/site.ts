/**
 * Dados da AvilaCore num lugar só: nome, canais, área de atendimento e navegação.
 * Tudo que o site mostra de contato sai daqui.
 *
 * Campo vazio = dado que ainda falta ([PREENCHER] na lista de pendências).
 * Os componentes escondem o bloco enquanto o campo estiver vazio.
 */

export type Frente = 'audiovisual' | 'drone' | 'sites';

export const site = {
  nome: 'AvilaCore',
  /** grafia antiga, usada só como alternateName nos dados estruturados */
  nomeAlternativo: 'Ávila Core',
  pessoa: 'Matheus Ávila',
  url: 'https://www.avilacore.com.br',
  frase: 'Filmo do alto e coloco no ar.',
  descricao:
    'Matheus Ávila grava e edita vídeos, faz imagens aéreas com drone em Indaiatuba e região e cria sites para todo o Brasil.',

  cidade: 'Indaiatuba',
  uf: 'SP',
  /** Coordenadas da sede do município (conferidas em 28/09/2026) */
  coordenadas: { lat: '23°05′24″ S', lon: '47°13′04″ O' },
  /** Atendimento presencial (drone e audiovisual). Fonte: _conteudo/00-dados/dados.md */
  areaPresencial: ['Indaiatuba', 'Campinas', 'Itu', 'Salto'],

  whatsapp: { numero: '5519993808005', exibicao: '(19) 99380-8005', tel: '+5519993808005' },
  instagram: { usuario: 'avilacore_', url: 'https://www.instagram.com/avilacore_/' },
  /** [PREENCHER] e-mail profissional. Vazio = não aparece em lugar nenhum. */
  email: '',
  /** Perfis da pessoa (entram no sameAs de Person). [PREENCHER] se quiser mostrar. */
  perfisPessoa: [] as string[],

  /** [PREENCHER] dados do drone; só aparecem em /drone quando `mostrar` for true. */
  drone: { modelo: '', cadastro: '', seguro: '', mostrar: false },

  /** Última revisão geral das páginas fixas (lastmod do sitemap). */
  revisadoEm: '2026-10-01',
};

export const frentes: Record<Frente, { nome: string; href: string; whatsapp: string }> = {
  audiovisual: {
    nome: 'Audiovisual',
    href: '/audiovisual',
    whatsapp: 'Olá, Matheus! Vim pelo site e quero conversar sobre um vídeo.',
  },
  drone: {
    nome: 'Drone',
    href: '/drone',
    whatsapp: 'Olá, Matheus! Vim pelo site e quero conversar sobre imagens com drone.',
  },
  sites: {
    nome: 'Sites',
    href: '/sites',
    whatsapp: 'Olá, Matheus! Vim pelo site e quero conversar sobre um site.',
  },
};

export const mensagemPadrao = 'Olá, Matheus! Vim pelo site e quero contar uma ideia.';

/** Link do WhatsApp com a mensagem já escrita. */
export function linkWhatsapp(mensagem: string = mensagemPadrao): string {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

export const menu = [
  { rotulo: 'Audiovisual', href: '/audiovisual' },
  { rotulo: 'Drone', href: '/drone' },
  { rotulo: 'Sites', href: '/sites' },
  { rotulo: 'Trabalhos', href: '/trabalhos' },
  { rotulo: 'Sobre', href: '/sobre' },
];

/** Os cinco passos, iguais nas três frentes. Cada serviço troca o texto em src/content/servicos. */
export const processo = [
  {
    titulo: 'Conversa inicial',
    texto: 'Você me conta o que precisa pelo WhatsApp ou pelo formulário. Quem responde sou eu.',
  },
  {
    titulo: 'Objetivo e escopo',
    texto: 'Combinamos o que vai ser feito, para que serve e o que fica de fora.',
  },
  { titulo: 'Produção', texto: 'Gravo, voo ou desenvolvo, conforme o projeto.' },
  { titulo: 'Revisão', texto: 'Você vê o material, comenta, e eu ajusto o que foi combinado.' },
  { titulo: 'Entrega', texto: 'Você recebe os arquivos finais ou o site no ar.' },
];
