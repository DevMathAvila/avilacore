const contentShell = document.getElementById("content-shell");
const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const primaryNav = document.getElementById("primaryNav");
const html = document.documentElement;
const navLinks = document.querySelectorAll("[data-route]");
const validRoutes = new Set(["home", "infraestrutura", "sobre", "contato"]);
const pageRoot = contentShell || document;
const compactViewport = window.matchMedia("(max-width: 768px)");

const routeMetadata = {
    home: {
        title: "Ávila Core - Tecnologia de ponta",
        description: "Ávila Core - Desenvolvimento & Infra",
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
const networkGlobeControllers = new WeakMap();

if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
}

function scrollToPageStart() {
    window.scrollTo(0, 0);
}

function closeMobileMenu() {
    if (!menuBtn || !primaryNav) {
        return;
    }

    document.body.classList.remove("menu-open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
}

function initializeMobileMenu() {
    if (!menuBtn || !primaryNav) {
        return;
    }

    menuBtn.addEventListener("click", () => {
        const willOpen = !primaryNav.classList.contains("is-open");
        document.body.classList.toggle("menu-open", willOpen);
        primaryNav.classList.toggle("is-open", willOpen);
        menuBtn.classList.toggle("is-open", willOpen);
        menuBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    compactViewport.addEventListener("change", (event) => {
        if (!event.matches) {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!primaryNav.classList.contains("is-open")) {
            return;
        }

        const clickedInsideMenu = primaryNav.contains(event.target) || menuBtn.contains(event.target);
        if (!clickedInsideMenu) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });
}

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

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTACT_NAME_REGEX = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
const CONTACT_MESSAGE_REGEX = /^[\p{L}\p{N}\s.,!?;:()'"\/-]+$/u;

function validateContactPayload(payload) {
    if (!payload.name || !payload.email || !payload.message) {
        return "Preencha nome, e-mail e mensagem para continuar.";
    }

    if (!CONTACT_NAME_REGEX.test(payload.name)) {
        return "No nome, use apenas letras. Espacos, apostrofo e hifen sao permitidos.";
    }

    if (!CONTACT_EMAIL_REGEX.test(payload.email)) {
        return "Digite um e-mail valido para continuar.";
    }

    if (payload.message.length < 10) {
        return "A mensagem precisa ter pelo menos 10 caracteres.";
    }

    if (!CONTACT_MESSAGE_REGEX.test(payload.message)) {
        return "Na mensagem, use apenas letras, numeros e pontuacoes comuns.";
    }

    return "";
}

function initializePageInteractions() {
    const contactForm = pageRoot.querySelector("[data-contact-form]");

    if (contactForm) {
        const feedback = contactForm.querySelector("[data-contact-feedback]");
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const defaultLabel = submitButton?.dataset.submitLabel || submitButton?.textContent || "Enviar";

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const payload = {
                name: String(formData.get("name") || "").trim(),
                email: String(formData.get("email") || "").trim(),
                message: String(formData.get("message") || "").trim(),
                company: String(formData.get("company") || "").trim()
            };

            const validationMessage = validateContactPayload(payload);

            if (validationMessage) {
                if (feedback) {
                    feedback.textContent = validationMessage;
                    feedback.dataset.status = "error";
                }
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Enviando...";
            }

            if (feedback) {
                feedback.textContent = "Enviando sua mensagem...";
                feedback.dataset.status = "pending";
            }

            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(result?.error || "Nao foi possivel enviar a mensagem agora.");
                }

                contactForm.reset();

                if (feedback) {
                    feedback.textContent = "Mensagem enviada com sucesso. Vou te responder o quanto antes.";
                    feedback.dataset.status = "success";
                }
            } catch (error) {
                if (feedback) {
                    feedback.textContent = error.message || "Nao foi possivel enviar a mensagem agora.";
                    feedback.dataset.status = "error";
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = defaultLabel;
                }
            }
        });
    }

    initializeNetworkGlobes();
}

function createSeededPoints(isCompact) {
    const seedPoints = [
        { theta: 0.2, phi: 1.0, accent: true },
        { theta: 0.9, phi: 1.35, accent: false },
        { theta: 1.45, phi: 1.85, accent: false },
        { theta: 2.1, phi: 1.1, accent: true },
        { theta: 2.7, phi: 1.6, accent: false },
        { theta: 3.05, phi: 2.05, accent: false },
        { theta: 3.7, phi: 1.2, accent: true },
        { theta: 4.2, phi: 1.72, accent: false },
        { theta: 4.85, phi: 1.28, accent: false },
        { theta: 5.45, phi: 1.9, accent: true },
        { theta: 5.95, phi: 1.42, accent: false }
    ];

    return (isCompact ? seedPoints.slice(0, 8) : seedPoints).map((point, index) => ({
        ...point,
        pulseOffset: index * 0.45
    }));
}

function initializeNetworkGlobes() {
    pageRoot.querySelectorAll("[data-network-globe]").forEach((element) => {
        if (networkGlobeControllers.has(element)) {
            return;
        }

        const canvas = element.querySelector("canvas");

        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const state = {
            canvas,
            context,
            points: createSeededPoints(compactViewport.matches),
            rotationY: 0.5,
            rotationX: -0.28,
            velocityY: compactViewport.matches ? 0.0018 : 0.0026,
            velocityX: compactViewport.matches ? 0.00055 : 0.0008,
            dragging: false,
            lastX: 0,
            lastY: 0,
            animationFrame: 0,
            width: 0,
            height: 0,
            pixelRatio: 1,
            running: false
        };

        const resize = () => {
            const rect = element.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1.5 : 2);

            state.width = rect.width;
            state.height = rect.height || 320;
            state.pixelRatio = pixelRatio;

            canvas.width = state.width * pixelRatio;
            canvas.height = state.height * pixelRatio;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const projectPoint = (point) => {
            const radius = Math.min(state.width, state.height) * 0.28;
            const x = Math.sin(point.phi) * Math.cos(point.theta);
            const y = Math.cos(point.phi);
            const z = Math.sin(point.phi) * Math.sin(point.theta);

            const cosY = Math.cos(state.rotationY);
            const sinY = Math.sin(state.rotationY);
            const cosX = Math.cos(state.rotationX);
            const sinX = Math.sin(state.rotationX);

            const rotatedX = x * cosY - z * sinY;
            const rotatedZ = x * sinY + z * cosY;
            const rotatedY = y * cosX - rotatedZ * sinX;
            const depthZ = y * sinX + rotatedZ * cosX;

            const perspective = 0.72 + (depthZ + 1) * 0.24;

            return {
                x: state.width / 2 + rotatedX * radius * perspective,
                y: state.height / 2 + rotatedY * radius * perspective,
                depth: depthZ,
                size: (point.accent ? 3.4 : 2.2) * perspective,
                accent: point.accent,
                pulseOffset: point.pulseOffset
            };
        };

        const draw = (time) => {
            context.clearRect(0, 0, state.width, state.height);

            const points2d = state.points.map(projectPoint).sort((a, b) => a.depth - b.depth);
            const maxDistance = Math.min(state.width, state.height) * (compactViewport.matches ? 0.24 : 0.28);
            const isLightTheme = html.getAttribute("data-theme") === "light";
            const lineColor = isLightTheme ? "37, 99, 235" : "0, 255, 157";
            const lineAlpha = isLightTheme ? 0.46 : 0.26;
            const glowCore = isLightTheme
                ? { accent: "rgba(29, 78, 216, 0.98)", base: "rgba(59, 130, 246, 0.95)" }
                : { accent: "rgba(100, 255, 218, 0.95)", base: "rgba(0, 255, 157, 0.82)" };
            const glowMid = isLightTheme ? "rgba(59, 130, 246, 0.42)" : "rgba(0, 255, 157, 0.24)";
            const pointFill = isLightTheme
                ? { accent: "rgba(30, 64, 175, 1)", base: "rgba(37, 99, 235, 0.98)" }
                : { accent: "rgba(194, 255, 237, 0.98)", base: "rgba(100, 255, 218, 0.9)" };

            context.save();
            context.globalCompositeOperation = isLightTheme ? "source-over" : "screen";

            for (let i = 0; i < points2d.length; i += 1) {
                for (let j = i + 1; j < points2d.length; j += 1) {
                    const dx = points2d[i].x - points2d[j].x;
                    const dy = points2d[i].y - points2d[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance > maxDistance) {
                        continue;
                    }

                    const alpha = (1 - distance / maxDistance) * (compactViewport.matches ? lineAlpha * 0.78 : lineAlpha);

                    context.strokeStyle = `rgba(${lineColor}, ${alpha})`;
                    context.lineWidth = isLightTheme ? 1.15 : 1;
                    context.beginPath();
                    context.moveTo(points2d[i].x, points2d[i].y);
                    context.lineTo(points2d[j].x, points2d[j].y);
                    context.stroke();
                }
            }

            points2d.forEach((point) => {
                const pulse = 0.7 + Math.sin(time * 0.0014 + point.pulseOffset) * 0.3;
                const glowSize = point.size * (point.accent ? 4.6 : 3.2) * pulse;
                const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowSize);

                gradient.addColorStop(0, point.accent ? glowCore.accent : glowCore.base);
                gradient.addColorStop(0.45, glowMid);
                gradient.addColorStop(1, isLightTheme ? "rgba(59, 130, 246, 0)" : "rgba(0, 255, 157, 0)");

                context.fillStyle = gradient;
                context.beginPath();
                context.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = point.accent ? pointFill.accent : pointFill.base;
                context.beginPath();
                context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
                context.fill();
            });

            context.restore();
        };

        const animate = (time) => {
            if (!state.running) {
                return;
            }

            if (!state.dragging) {
                state.rotationY += state.velocityY;
                state.rotationX += state.velocityX;
            }

            draw(time);
            state.animationFrame = window.requestAnimationFrame(animate);
        };

        const start = () => {
            if (state.running) {
                return;
            }

            state.running = true;
            state.animationFrame = window.requestAnimationFrame(animate);
        };

        const stop = () => {
            state.running = false;

            if (state.animationFrame) {
                window.cancelAnimationFrame(state.animationFrame);
                state.animationFrame = 0;
            }
        };

        const pointerPosition = (event) => {
            const rect = canvas.getBoundingClientRect();

            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        };

        const onPointerDown = (event) => {
            const position = pointerPosition(event);
            state.dragging = true;
            state.lastX = position.x;
            state.lastY = position.y;
            canvas.setPointerCapture?.(event.pointerId);
        };

        const onPointerMove = (event) => {
            if (!state.dragging) {
                return;
            }

            const position = pointerPosition(event);
            const deltaX = position.x - state.lastX;
            const deltaY = position.y - state.lastY;

            state.rotationY += deltaX * 0.008;
            state.rotationX += deltaY * 0.006;
            state.velocityY = deltaX * (compactViewport.matches ? 0.00016 : 0.00022);
            state.velocityX = deltaY * (compactViewport.matches ? 0.00012 : 0.00018);
            state.lastX = position.x;
            state.lastY = position.y;
        };

        const onPointerUp = (event) => {
            if (!state.dragging) {
                return;
            }

            state.dragging = false;
            canvas.releasePointerCapture?.(event.pointerId);
        };

        const onClick = (event) => {
            const position = pointerPosition(event);
            const dx = (position.x - state.width / 2) / (Math.min(state.width, state.height) * 0.28);
            const dy = (position.y - state.height / 2) / (Math.min(state.width, state.height) * 0.28);
            const distance = Math.hypot(dx, dy);

            if (distance > 1) {
                return;
            }

            const phi = Math.acos(Math.max(-1, Math.min(1, -dy)));
            const theta = Math.atan2(dx, Math.sqrt(Math.max(0.0001, 1 - dx * dx - dy * dy)));

            state.points.push({
                theta: theta + state.rotationY + Math.PI / 2,
                phi,
                accent: true,
                pulseOffset: state.points.length * 0.37
            });

            const maxPoints = compactViewport.matches ? 12 : 18;

            if (state.points.length > maxPoints) {
                state.points.splice(0, state.points.length - maxPoints);
            }
        };

        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    start();
                } else {
                    stop();
                }
            });
        }, { threshold: 0.12 });

        resize();

        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointerleave", onPointerUp);
        canvas.addEventListener("click", onClick);
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stop();
                return;
            }

            const rect = element.getBoundingClientRect();
            const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;

            if (inViewport) {
                start();
            }
        });
        visibilityObserver.observe(element);

        networkGlobeControllers.set(element, {
            resize
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
                <a href="/" class="btn btn-primary" data-route="home">Voltar ao início</a>
            </div>
        </section>
    `;
    initializePageInteractions();
}

function normalizeRoute(routeName) {
    return validRoutes.has(routeName) ? routeName : "home";
}

function routeToPath(routeName) {
    return routeName === "home" ? "/" : `/${routeName}`;
}

function pathToRoute(pathname) {
    const trimmedPath = pathname.replace(/\/+$/, "") || "/";
    const routeName = trimmedPath === "/" ? "home" : trimmedPath.replace(/^\//, "");
    return normalizeRoute(routeName);
}

function navigateToRoute(routeName, shouldPushState = true) {
    const normalizedRoute = normalizeRoute(routeName);
    const nextPath = routeToPath(normalizedRoute);

    if (shouldPushState && window.location.pathname !== nextPath) {
        window.history.pushState({ route: normalizedRoute }, "", nextPath);
    }

    loadPage(normalizedRoute);
}

async function loadPage(pathOrRoute) {
    if (!contentShell) {
        return;
    }

    try {
        const normalizedPage = validRoutes.has(pathOrRoute)
            ? normalizeRoute(pathOrRoute)
            : pathToRoute(pathOrRoute);
        scrollToPageStart();
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
        scrollToPageStart();
    } catch (error) {
        console.error(error);
        setActiveNavigation("");
        renderError(pathOrRoute);
    }
}

function resolveRoute() {
    if (!contentShell) {
        return;
    }

    loadPage(window.location.pathname);
}

document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("a");

    if (!routeLink) {
        return;
    }

    if (routeLink.target === "_blank" || routeLink.hasAttribute("download")) {
        return;
    }

    const href = routeLink.getAttribute("href");

    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://") || href.startsWith("http://") && !href.startsWith(window.location.origin)) {
        return;
    }

    const linkUrl = new URL(routeLink.href, window.location.origin);

    if (linkUrl.origin !== window.location.origin) {
        return;
    }

    const nextPage = routeLink.dataset.route
        ? normalizeRoute(routeLink.dataset.route)
        : pathToRoute(linkUrl.pathname);

    if (!validRoutes.has(nextPage)) {
        return;
    }

    event.preventDefault();

    if (pathToRoute(window.location.pathname) === nextPage) {
        loadPage(nextPage);
        return;
    }

    navigateToRoute(nextPage, true);
});

window.addEventListener("DOMContentLoaded", () => {
    scrollToPageStart();
    initializeTheme();
    initializeMobileMenu();
    initializeReveals();
    initializePageInteractions();

    if (contentShell) {
        resolveRoute();
    }
});

if (contentShell) {
    window.addEventListener("popstate", resolveRoute);
}

window.addEventListener("pageshow", () => {
    scrollToPageStart();
});
