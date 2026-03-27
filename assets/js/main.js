const contentShell = document.getElementById("content-shell");
const themeBtn = document.getElementById("themeBtn");
const html = document.documentElement;
const navLinks = document.querySelectorAll("[data-route]");
const validRoutes = new Set(["home", "infraestrutura", "sobre", "contato"]);

let revealObserver;

function updateThemeIcon(theme) {
    themeBtn.innerHTML = theme === "dark"
        ? '<i class="fas fa-moon" aria-hidden="true"></i>'
        : '<i class="fas fa-sun" aria-hidden="true"></i>';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    html.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

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

    const revealElements = contentShell.querySelectorAll(".reveal");
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
    const contactForm = contentShell.querySelector("[data-contact-form]");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.alert("Mensagem enviada com sucesso!");
        });
    }

    contentShell.querySelectorAll("[data-route-target]").forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            const nextPage = trigger.dataset.routeTarget;
            window.location.hash = nextPage;
        });
    });
}

function renderError(pageName) {
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
    try {
        const normalizedPage = normalizeRoute(pageName);
        const response = await fetch(`./pages/${normalizedPage}.html`, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Falha ao carregar ${normalizedPage}.html`);
        }

        const pageContent = await response.text();
        contentShell.innerHTML = pageContent;
        setActiveNavigation(normalizedPage);
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

window.addEventListener("hashchange", resolveRoute);
window.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
    resolveRoute();
});
