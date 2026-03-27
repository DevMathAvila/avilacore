function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function readJsonBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }

    let raw = "";

    for await (const chunk of req) {
        raw += chunk;
    }

    return raw ? JSON.parse(raw) : {};
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
const MESSAGE_REGEX = /^[\p{L}\p{N}\s.,!?;:()'"\/-]+$/u;

function validatePayload({ name, email, message }) {
    if (!name || !email || !message) {
        return "Nome, e-mail e mensagem sao obrigatorios.";
    }

    if (name.length < 2 || name.length > 80 || !NAME_REGEX.test(name)) {
        return "O nome aceita apenas letras, espacos, apostrofo e hifen.";
    }

    if (email.length > 120 || !EMAIL_REGEX.test(email)) {
        return "Digite um e-mail valido.";
    }

    if (message.length < 10 || message.length > 1200) {
        return "A mensagem precisa ter entre 10 e 1200 caracteres.";
    }

    if (!MESSAGE_REGEX.test(message)) {
        return "A mensagem aceita apenas letras, numeros, espacos e pontuacoes comuns.";
    }

    return "";
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return sendJson(res, 405, { error: "Method not allowed." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL;
    const sender = process.env.CONTACT_FROM || "Avila Core <onboarding@resend.dev>";

    if (!apiKey || !recipient) {
        return sendJson(res, 500, { error: "Email service is not configured." });
    }

    try {
        const body = await readJsonBody(req);
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const message = String(body.message || "").trim();
        const company = String(body.company || "").trim();

        if (company) {
            return sendJson(res, 200, { ok: true });
        }

        const validationError = validatePayload({ name, email, message });

        if (validationError) {
            return sendJson(res, 400, { error: validationError });
        }

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: sender,
                to: [recipient],
                subject: `Novo contato do site - ${name}`,
                html: `
                    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #0f172a;">
                        <h2 style="margin-bottom: 16px;">Novo contato vindo do site da Avila Core</h2>
                        <p><strong>Nome:</strong> ${safeName}</p>
                        <p><strong>Email:</strong> ${safeEmail}</p>
                        <p><strong>Mensagem:</strong><br>${safeMessage}</p>
                    </div>
                `
            })
        });

        const resendResult = await resendResponse.json().catch(() => ({}));

        if (!resendResponse.ok) {
            return sendJson(res, 502, {
                error: resendResult?.message || resendResult?.error || "Email provider request failed."
            });
        }

        return sendJson(res, 200, { ok: true, id: resendResult?.id || null });
    } catch (error) {
        return sendJson(res, 500, {
            error: error instanceof Error ? error.message : "Unexpected server error."
        });
    }
};
