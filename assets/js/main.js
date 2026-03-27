const contentShell = document.getElementById("content-shell");
const themeBtn = document.getElementById("themeBtn");
const html = document.documentElement;
const navLinks = document.querySelectorAll("[data-route]");
const validRoutes = new Set(["home", "infraestrutura", "sobre", "contato"]);
const pageRoot = contentShell || document;

const routeMetadata = {
    home: {
        title: "Avila Core - Solucoes Tecnologicas",
        description: "Avila Core | Desenvolvimento, infraestrutura de TI, suporte tecnico, criacao de sites, landing pages, paginas de pagamento e solucoes tecnologicas para empresas.",
        canonical: "https://www.avilacore.com.br/",
        ogType: "website"
    },
    infraestrutura: {
        title: "Infraestrutura, Desenvolvimento e Suporte | Avila Core",
        description: "Infraestrutura de TI, desenvolvimento continuo e suporte tecnico N1, N2 e N3 para empresas com foco em estabilidade, seguranca e continuidade operacional.",
        canonical: "https://www.avilacore.com.br/infraestrutura/",
        ogType: "article"
    },
    sobre: {
        title: "Sobre Matheus Avila e Avila Core",
        description: "Conheca a proposta da Avila Core e a visao tecnica por tras de infraestrutura, desenvolvimento e sustentacao para empresas.",
        canonical: "https://www.avilacore.com.br/sobre/",
        ogType: "profile"
    },
    contato: {
        title: "Contato | Avila Core",
        description: "Entre em contato com a Avila Core para projetos de infraestrutura, desenvolvimento web, automacoes e suporte tecnico continuo para empresas.",
        canonical: "https://www.avilacore.com.br/contato/",
        ogType: "website"
    }
};

let revealObserver;

function updateThemeIcon(theme) {
    if (!themeBtn) {
        return;
    }

    themeBtn.innerHTML = theme === "dark"
        ? '<i class="fas fa-moon" aria-hidden="true"></i>'
        : '<i class="fas fa-sun" aria-hidden="true"></i>';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    html.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    if (!themeBtn) {
        return;
    }

    themeBtn.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", newTheme);
        updateThemeIcon(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

function setActiveNavigation(pageName) {
    navLinks.forEach((link) => {
        const isActive = link.dataset.route === pageName;
        link.classList.toggle("active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

function initializeRevealObserver() {
    if (revealObserver) {
        revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.12 });
}

function initializeReveals() {
    initializeRevealObserver();

    const revealElements = pageRoot.querySelectorAll(".reveal");
    revealElements.forEach((element, index) => {
        element.classList.remove("active");
        revealObserver.observe(element);

        if (index < 2) {
            setTimeout(() => {
                element.classList.add("active");
            }, index * 180);
        }
    });
}

function initializePageInteractions() {
    const contactForm = pageRoot.querySelector("[data-contact-form]");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.alert("Mensagem enviada com sucesso!");
        });
    }

    pageRoot.querySelectorAll("[data-route-target]").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            const nextPage = trigger.dataset.routeTarget;
            window.location.hash = nextPage;
        });
    });
}

function updateRouteMetadata(pageName) {
    const metadata = routeMetadata[pageName];

    if (!metadata) {
        return;
    }

    document.title = metadata.title;

    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    if (description) {
        description.setAttribute("content", metadata.description);
    }

    if (canonical) {
        canonical.setAttribute("href", metadata.canonical);
    }

    if (ogTitle) {
        ogTitle.setAttribute("content", metadata.title);
    }

    if (ogDescription) {
        ogDescription.setAttribute("content", metadata.description);
    }

    if (ogUrl) {
        ogUrl.setAttribute("content", metadata.canonical);
    }

    if (ogType) {
        ogType.setAttribute("content", metadata.ogType);
    }

    if (twitterTitle) {
        twitterTitle.setAttribute("content", metadata.title);
    }

    if (twitterDescription) {
        twitterDescription.setAttribute("content", metadata.description);
    }
}

function renderError(pageName) {
    if (!contentShell) {
        return;
    }

    contentShell.innerHTML = `
        <section class="error-state">
            <div class="container">
                <h1 class="section-title">Página <span>indisponível</span></h1>
                <p>Não foi possível carregar <strong>${pageName}</strong>. Verifique o arquivo em <code>/pages/${pageName}.html</code>.</p>
                <a href="#home" class="btn btn-primary" data-route-target="home">Voltar ao início</a>
            </div>
        </section>
    `;
    initializePageInteractions();
}

function normalizeRoute(pageName) {
    return validRoutes.has(pageName) ? pageName : "home";
}

async function loadPage(pageName) {
    if (!contentShell) {
        return;
    }

    try {
        const normalizedPage = normalizeRoute(pageName);
        const response = await fetch(`./pages/${normalizedPage}.html`, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Falha ao carregar ${normalizedPage}.html`);
        }

        const pageContent = await response.text();
        contentShell.innerHTML = pageContent;
        setActiveNavigation(normalizedPage);
        updateRouteMetadata(normalizedPage);
        initializeReveals();
        initializePageInteractions();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error(error);
        setActiveNavigation("");
        renderError(pageName);
    }
}

function resolveRoute() {
    if (!contentShell) {
        return;
    }

    const pageName = normalizeRoute(window.location.hash.replace("#", "") || "home");
    loadPage(pageName);
}

document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("[data-route]");

    if (!routeLink) {
        return;
    }

    event.preventDefault();
    const nextPage = normalizeRoute(routeLink.dataset.route);

    if (window.location.hash.replace("#", "") === nextPage) {
        loadPage(nextPage);
        return;
    }

    window.location.hash = nextPage;
});

window.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    initializeReveals();
    initializePageInteractions();

    if (contentShell) {
        resolveRoute();
    }
});

if (contentShell) {
    window.addEventListener("hashchange", resolveRoute);
}
