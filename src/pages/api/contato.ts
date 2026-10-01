/**
 * Recebe o formulário de contato e envia por e-mail pelo Resend.
 *
 * Variáveis de ambiente (na Vercel e no .env local):
 *   RESEND_API_KEY  chave do Resend
 *   CONTATO_PARA    e-mail que recebe as mensagens
 *   CONTATO_DE      remetente (opcional). Sem domínio verificado no Resend, use o padrão.
 *
 * Sem essas variáveis a rota responde 503 e o formulário mostra o WhatsApp.
 * Anti-spam: campo-isca ("empresa") e tempo mínimo entre abrir a página e enviar.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const TIPOS = ['audiovisual', 'drone', 'site', 'outro'] as const;
const ROTULO: Record<(typeof TIPOS)[number], string> = {
  audiovisual: 'Vídeo',
  drone: 'Drone',
  site: 'Site',
  outro: 'Outro',
};
const TEMPO_MINIMO_MS = 3000;

const limpar = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .trim()
    .slice(0, max);

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const ehEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const ehTelefone = (s: string) => s.replace(/\D/g, '').length >= 10;

function responder(req: Request, status: number, corpo: { ok: boolean; erro?: string }) {
  // Sem JavaScript o navegador envia o formulário direto: devolve uma página.
  if (!(req.headers.get('accept') ?? '').includes('application/json')) {
    const destino = corpo.ok ? '/contato/enviada' : '/contato?erro=1#formulario';
    return new Response(null, { status: 303, headers: { Location: destino } });
  }
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let dados: Record<string, unknown> = {};
  try {
    const tipoConteudo = request.headers.get('content-type') ?? '';
    dados = tipoConteudo.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return responder(request, 400, { ok: false, erro: 'Não consegui ler os dados enviados.' });
  }

  // Isca preenchida ou envio rápido demais: finge sucesso e não envia nada.
  const aberto = Number(dados.aberto);
  const rapidoDemais = Number.isFinite(aberto) && aberto > 0 && Date.now() - aberto < TEMPO_MINIMO_MS;
  if (limpar(dados.empresa, 100) || rapidoDemais) return responder(request, 200, { ok: true });

  const nome = limpar(dados.nome, 80);
  const contato = limpar(dados.contato, 120);
  const mensagem = limpar(dados.mensagem, 2000);
  const tipo = TIPOS.find((t) => t === dados.tipo);

  if (nome.length < 2) return responder(request, 422, { ok: false, erro: 'Escreva o seu nome.' });
  if (!ehEmail(contato) && !ehTelefone(contato)) {
    return responder(request, 422, { ok: false, erro: 'Deixe um e-mail ou um número de WhatsApp para eu responder.' });
  }
  if (!tipo) return responder(request, 422, { ok: false, erro: 'Escolha o tipo de projeto.' });
  if (mensagem.length < 10) {
    return responder(request, 422, { ok: false, erro: 'Conte um pouco mais sobre o projeto.' });
  }

  const chave = import.meta.env.RESEND_API_KEY;
  const para = import.meta.env.CONTATO_PARA;
  if (!chave || !para) {
    return responder(request, 503, { ok: false, erro: 'O envio por e-mail não está configurado.' });
  }

  const de = import.meta.env.CONTATO_DE || 'AvilaCore <onboarding@resend.dev>';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: de,
        to: [para],
        subject: `Contato pelo site: ${ROTULO[tipo]} (${nome})`,
        ...(ehEmail(contato) ? { reply_to: contato } : {}),
        text: `Nome: ${nome}\nContato: ${contato}\nTipo de projeto: ${ROTULO[tipo]}\n\n${mensagem}`,
        html: `<p><strong>Nome:</strong> ${escapar(nome)}<br><strong>Contato:</strong> ${escapar(contato)}<br><strong>Tipo de projeto:</strong> ${ROTULO[tipo]}</p><p>${escapar(mensagem).replace(/\n/g, '<br>')}</p>`,
      }),
    });
    if (!r.ok) {
      console.error('Resend recusou o envio', r.status, await r.text());
      return responder(request, 502, { ok: false, erro: 'O serviço de e-mail recusou o envio.' });
    }
  } catch (e) {
    console.error('Falha ao chamar o Resend', e);
    return responder(request, 502, { ok: false, erro: 'Não consegui falar com o serviço de e-mail.' });
  }

  return responder(request, 200, { ok: true });
};
