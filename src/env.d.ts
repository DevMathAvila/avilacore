/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** chave do Resend para o formulário de contato */
  readonly RESEND_API_KEY?: string;
  /** e-mail que recebe as mensagens do formulário */
  readonly CONTATO_PARA?: string;
  /** remetente do e-mail (opcional) */
  readonly CONTATO_DE?: string;
  /** "vercel" liga o Vercel Web Analytics (sem cookies) */
  readonly PUBLIC_ANALYTICS?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
