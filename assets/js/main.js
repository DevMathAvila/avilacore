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
        title: "Ávila Core - Desenvolvimento & Infra",
        description: "Ávila Core - Desenvolvimento & Infra",
        canonical: "https://www.avilacore.com.br/",
        ogType: "website"
    },
    infraestrutura: {
        title: "Infraestrutura, Desenvolvimento e Suporte | Ávila Core - Desenvolvimento & Infra",
        description: "Infraestrutura de TI, desenvolvimento continuo e suporte tecnico N1, N2 e N3 para empresas com foco em estabilidade, seguranca e continuidade operacional.",
        canonical: "https://www.avilacore.com.br/infraestrutura/",
        ogType: "article"
    },
    sobre: {
        title: "Sobre Matheus Avila | Ávila Core - Desenvolvimento & Infra",
        description: "Conheca a proposta da Avila Core e a visao tecnica por tras de infraestrutura, desenvolvimento e sustentacao para empresas.",
        canonical: "https://www.avilacore.com.br/sobre/",
        ogType: "profile"
    },
    contato: {
        title: "Contato | Ávila Core - Desenvolvimento & Infra",
        description: "Entre em contato com a Avila Core para projetos de infraestrutura, desenvolvimento web, automacoes e suporte tecnico continuo para empresas.",
        canonical: "https://www.avilacore.com.br/contato/",
        ogType: "website"
    }
};

let revealObserver;
const networkGlobeControllers = new WeakMap();
const whatsappFloatMessages = ["Me chame!", "Vamos conversar?", "Faça um orçamento"];
let whatsappFloatMessageIndex = 0;
let whatsappFloatMessageTimeout = null;
let whatsappFloatMessageElement = null;
let whatsappFloatResizeBound = false;

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

function initializeWhatsAppFloatMessages() {
    const criarMsgEl = () => {
        if (document.querySelector(".whatsapp-float-message")) {
            whatsappFloatMessageElement = document.querySelector(".whatsapp-float-message");
            return;
        }

        whatsappFloatMessageElement = document.createElement("span");
        whatsappFloatMessageElement.className = "whatsapp-float-message";
        whatsappFloatMessageElement.setAttribute("aria-hidden", "true");
        document.body.appendChild(whatsappFloatMessageElement);
    };

    const posicionarMsg = () => {
        const botao = document.querySelector(".whatsapp-float");

        if (!botao || !whatsappFloatMessageElement) {
            return;
        }

        const rect = botao.getBoundingClientRect();
        whatsappFloatMessageElement.style.top = `${rect.top + rect.height / 2}px`;
        whatsappFloatMessageElement.style.right = `${window.innerWidth - rect.left + 8}px`;
    };

    const mostrarFrase = () => {
        if (window.innerWidth > 768) {
            return;
        }

        if (!whatsappFloatMessageElement) {
            criarMsgEl();
        }

        posicionarMsg();

        whatsappFloatMessageElement.textContent = whatsappFloatMessages[whatsappFloatMessageIndex];
        whatsappFloatMessageIndex = (whatsappFloatMessageIndex + 1) % whatsappFloatMessages.length;

        whatsappFloatMessageElement.classList.remove("visible");
        void whatsappFloatMessageElement.offsetWidth;
        whatsappFloatMessageElement.classList.add("visible");

        window.setTimeout(() => {
            whatsappFloatMessageElement?.classList.remove("visible");
        }, 2500);

        whatsappFloatMessageTimeout = window.setTimeout(mostrarFrase, 15000);
    };

    const iniciarFrases = () => {
        if (window.innerWidth <= 768) {
            criarMsgEl();
            whatsappFloatMessageTimeout = window.setTimeout(mostrarFrase, 3000);
        }
    };

    const syncWhatsAppMessagesOnResize = () => {
        if (whatsappFloatMessageTimeout) {
            window.clearTimeout(whatsappFloatMessageTimeout);
            whatsappFloatMessageTimeout = null;
        }

        if (whatsappFloatMessageElement) {
            whatsappFloatMessageElement.classList.remove("visible");
        }

        if (window.innerWidth <= 768) {
            whatsappFloatMessageTimeout = window.setTimeout(mostrarFrase, 3000);
        }
    };

    iniciarFrases();

    if (!whatsappFloatResizeBound) {
        window.addEventListener("resize", syncWhatsAppMessagesOnResize);
        whatsappFloatResizeBound = true;
    }
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

function lonLatToSpherical(lon, lat) {
    const theta = lon * (Math.PI / 180);
    const phi = (90 - lat) * (Math.PI / 180);
    return { theta, phi };
}

function createSeededPoints(isCompact) {
    const seedPoints = [
        { lon: -122.33, lat: 47.6, accent: true },
        { lon: -46.63, lat: -23.55, accent: true },
        { lon: -0.13, lat: 51.51, accent: false },
        { lon: 13.4, lat: 52.52, accent: false },
        { lon: 31.24, lat: 30.04, accent: false },
        { lon: 55.27, lat: 25.2, accent: true },
        { lon: 72.88, lat: 19.08, accent: false },
        { lon: 103.82, lat: 1.35, accent: true },
        { lon: 139.69, lat: 35.68, accent: false },
        { lon: 151.21, lat: -33.87, accent: true }
    ];

    return (isCompact ? seedPoints.slice(0, 7) : seedPoints).map((point, index) => ({
        ...lonLatToSpherical(point.lon, point.lat),
        accent: point.accent,
        pulseOffset: index * 0.45
    }));
}

function createLandMassPoints() {
    const masses = [
        { lon: -108, lat: 51, width: 44, height: 22, step: 5 },
        { lon: -88, lat: 19, width: 18, height: 10, step: 4 },
        { lon: -60, lat: -17, width: 20, height: 28, step: 4 },
        { lon: 8, lat: 50, width: 20, height: 10, step: 4 },
        { lon: 20, lat: 8, width: 25, height: 33, step: 4 },
        { lon: 78, lat: 45, width: 62, height: 24, step: 5 },
        { lon: 105, lat: 12, width: 28, height: 15, step: 4 },
        { lon: 134, lat: -24, width: 18, height: 12, step: 4 },
        { lon: -41, lat: 73, width: 12, height: 8, step: 4 }
    ];

    const landPoints = [];

    masses.forEach((mass, massIndex) => {
        for (let latOffset = -mass.height; latOffset <= mass.height; latOffset += mass.step) {
            for (let lonOffset = -mass.width; lonOffset <= mass.width; lonOffset += mass.step) {
                const normalizedLon = lonOffset / mass.width;
                const normalizedLat = latOffset / mass.height;
                const wobble = Math.sin((normalizedLon + massIndex) * 2.4) * 0.08
                    + Math.cos((normalizedLat - massIndex) * 2.1) * 0.06;
                const ellipse = normalizedLon ** 2 + normalizedLat ** 2;

                if (ellipse > 0.98 + wobble) {
                    continue;
                }

                landPoints.push({
                    ...lonLatToSpherical(
                        mass.lon + lonOffset + Math.sin((latOffset + massIndex) * 0.2) * 1.4,
                        mass.lat + latOffset + Math.cos((lonOffset - massIndex) * 0.18) * 1.2
                    ),
                    weight: 0.5 + (1 - ellipse) * 0.5
                });
            }
        }
    });

    return landPoints;
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
            landPoints: createLandMassPoints(),
            rotationY: 0.7,
            rotationX: -0.32,
            velocityY: compactViewport.matches ? 0.0014 : 0.002,
            velocityX: compactViewport.matches ? 0.00035 : 0.00055,
            dragging: false,
            dragDistance: 0,
            lastX: 0,
            lastY: 0,
            animationFrame: 0,
            width: 0,
            height: 0,
            radius: 0,
            pixelRatio: 1,
            running: false
        };

        const resize = () => {
            const rect = element.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1.5 : 2);

            state.width = rect.width;
            state.height = rect.height || 320;
            state.radius = Math.min(state.width, state.height) * (compactViewport.matches ? 0.31 : 0.34);
            state.pixelRatio = pixelRatio;

            canvas.width = state.width * pixelRatio;
            canvas.height = state.height * pixelRatio;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const toCartesian = (point) => ({
            x: Math.sin(point.phi) * Math.cos(point.theta),
            y: Math.cos(point.phi),
            z: Math.sin(point.phi) * Math.sin(point.theta)
        });

        const rotatePoint = (point) => {
            const cosY = Math.cos(state.rotationY);
            const sinY = Math.sin(state.rotationY);
            const cosX = Math.cos(state.rotationX);
            const sinX = Math.sin(state.rotationX);

            const x1 = point.x * cosY - point.z * sinY;
            const z1 = point.x * sinY + point.z * cosY;
            const y1 = point.y * cosX - z1 * sinX;
            const z2 = point.y * sinX + z1 * cosX;

            return { x: x1, y: y1, z: z2 };
        };

        const inverseRotatePoint = (point) => {
            const cosX = Math.cos(-state.rotationX);
            const sinX = Math.sin(-state.rotationX);
            const cosY = Math.cos(-state.rotationY);
            const sinY = Math.sin(-state.rotationY);

            const y1 = point.y * cosX - point.z * sinX;
            const z1 = point.y * sinX + point.z * cosX;
            const x2 = point.x * cosY - z1 * sinY;
            const z2 = point.x * sinY + z1 * cosY;

            return { x: x2, y: y1, z: z2 };
        };

        const projectPoint = (point) => {
            const rotated = rotatePoint(toCartesian(point));
            const scale = 0.82 + (rotated.z + 1) * 0.18;

            return {
                x: state.width / 2 + rotated.x * state.radius,
                y: state.height / 2 + rotated.y * state.radius,
                depth: rotated.z,
                size: (point.accent ? 3.2 : 2.1) * scale,
                accent: point.accent,
                pulseOffset: point.pulseOffset
            };
        };

        const drawGeoLine = (samples, strokeStyle, lineWidth) => {
            let started = false;

            context.beginPath();

            samples.forEach((sample) => {
                const rotated = rotatePoint(toCartesian(sample));

                if (rotated.z < -0.12) {
                    started = false;
                    return;
                }

                const x = state.width / 2 + rotated.x * state.radius;
                const y = state.height / 2 + rotated.y * state.radius;

                if (!started) {
                    context.moveTo(x, y);
                    started = true;
                    return;
                }

                context.lineTo(x, y);
            });

            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.stroke();
        };

        const draw = (time) => {
            context.clearRect(0, 0, state.width, state.height);

            const isLightTheme = html.getAttribute("data-theme") === "light";
            const centerX = state.width / 2;
            const centerY = state.height / 2;
            const globeFill = context.createRadialGradient(
                centerX - state.radius * 0.35,
                centerY - state.radius * 0.45,
                state.radius * 0.08,
                centerX,
                centerY,
                state.radius * 1.08
            );

            if (isLightTheme) {
                globeFill.addColorStop(0, "rgba(10, 77, 61, 0.94)");
                globeFill.addColorStop(0.52, "rgba(9, 68, 55, 0.92)");
                globeFill.addColorStop(1, "rgba(8, 50, 44, 0.88)");
            } else {
                globeFill.addColorStop(0, "rgba(8, 56, 43, 0.94)");
                globeFill.addColorStop(0.5, "rgba(8, 52, 41, 0.93)");
                globeFill.addColorStop(1, "rgba(6, 40, 34, 0.9)");
            }

            context.save();
            context.beginPath();
            context.arc(centerX, centerY, state.radius, 0, Math.PI * 2);
            context.fillStyle = globeFill;
            context.fill();
            context.clip();

            const latitudes = [-60, -30, 0, 30, 60];
            const meridians = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
            const gridStroke = isLightTheme ? "rgba(110, 255, 208, 0.16)" : "rgba(0, 255, 157, 0.16)";
            const landFill = isLightTheme ? "rgba(118, 255, 215, 0.28)" : "rgba(0, 255, 157, 0.2)";

            latitudes.forEach((lat) => {
                const samples = [];
                for (let lon = -180; lon <= 180; lon += 6) {
                    samples.push(lonLatToSpherical(lon, lat));
                }
                drawGeoLine(samples, gridStroke, 1);
            });

            meridians.forEach((lon) => {
                const samples = [];
                for (let lat = -80; lat <= 80; lat += 5) {
                    samples.push(lonLatToSpherical(lon, lat));
                }
                drawGeoLine(samples, gridStroke, 1);
            });

            state.landPoints.forEach((point) => {
                const projected = projectPoint(point);

                if (projected.depth < -0.08) {
                    return;
                }

                context.globalAlpha = 0.25 + point.weight * 0.55;
                context.fillStyle = landFill;
                context.beginPath();
                context.arc(projected.x, projected.y, 1.2 + point.weight * 0.9, 0, Math.PI * 2);
                context.fill();
            });

            context.globalAlpha = 1;

            const points2d = state.points
                .map(projectPoint)
                .filter((point) => point.depth > -0.22)
                .sort((a, b) => a.depth - b.depth);
            const maxDistance = state.radius * (compactViewport.matches ? 0.72 : 0.82);
            const lineColor = isLightTheme ? "16, 185, 129" : "0, 255, 157";
            const lineAlpha = isLightTheme ? 0.38 : 0.22;
            const glowCore = isLightTheme
                ? { accent: "rgba(196, 255, 234, 0.98)", base: "rgba(110, 255, 208, 0.92)" }
                : { accent: "rgba(194, 255, 237, 0.98)", base: "rgba(100, 255, 218, 0.88)" };
            const glowMid = isLightTheme ? "rgba(52, 211, 153, 0.22)" : "rgba(0, 255, 157, 0.18)";

            for (let i = 0; i < points2d.length; i += 1) {
                for (let j = i + 1; j < points2d.length; j += 1) {
                    const dx = points2d[i].x - points2d[j].x;
                    const dy = points2d[i].y - points2d[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance > maxDistance) {
                        continue;
                    }

                    const alpha = (1 - distance / maxDistance) * lineAlpha;

                    context.strokeStyle = `rgba(${lineColor}, ${alpha})`;
                    context.lineWidth = points2d[i].accent || points2d[j].accent ? 1.2 : 0.9;
                    context.beginPath();
                    context.moveTo(points2d[i].x, points2d[i].y);
                    context.lineTo(points2d[j].x, points2d[j].y);
                    context.stroke();
                }
            }

            points2d.forEach((point) => {
                const pulse = 0.76 + Math.sin(time * 0.0014 + point.pulseOffset) * 0.24;
                const glowSize = point.size * (point.accent ? 4.2 : 3) * pulse;
                const gradient = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowSize);

                gradient.addColorStop(0, point.accent ? glowCore.accent : glowCore.base);
                gradient.addColorStop(0.52, glowMid);
                gradient.addColorStop(1, isLightTheme ? "rgba(59, 130, 246, 0)" : "rgba(0, 255, 157, 0)");

                context.fillStyle = gradient;
                context.beginPath();
                context.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = point.accent ? glowCore.accent : glowCore.base;
                context.beginPath();
                context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
                context.fill();
            });

            context.restore();

            context.beginPath();
            context.arc(centerX, centerY, state.radius, 0, Math.PI * 2);
            context.strokeStyle = isLightTheme ? "rgba(22, 163, 74, 0.28)" : "rgba(100, 255, 218, 0.22)";
            context.lineWidth = 1.25;
            context.stroke();

            context.beginPath();
            context.arc(centerX, centerY, state.radius + 7, 0, Math.PI * 2);
            context.strokeStyle = isLightTheme ? "rgba(22, 163, 74, 0.09)" : "rgba(0, 255, 157, 0.08)";
            context.lineWidth = 10;
            context.stroke();
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
            state.dragDistance = 0;
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

            state.dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            state.rotationY += deltaX * 0.008;
            state.rotationX = Math.max(-1.15, Math.min(1.15, state.rotationX + deltaY * 0.006));
            state.velocityY = deltaX * (compactViewport.matches ? 0.00016 : 0.00022);
            state.velocityX = deltaY * (compactViewport.matches ? 0.00008 : 0.00012);
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
            if (state.dragDistance > 8) {
                return;
            }

            const position = pointerPosition(event);
            const normalizedX = (position.x - state.width / 2) / state.radius;
            const normalizedY = (position.y - state.height / 2) / state.radius;
            const squaredDistance = normalizedX ** 2 + normalizedY ** 2;

            if (squaredDistance > 1) {
                return;
            }

            const frontPoint = {
                x: normalizedX,
                y: normalizedY,
                z: Math.sqrt(Math.max(0, 1 - squaredDistance))
            };
            const unrotatedPoint = inverseRotatePoint(frontPoint);
            const normalizedLength = Math.hypot(unrotatedPoint.x, unrotatedPoint.y, unrotatedPoint.z) || 1;
            const spherePoint = {
                x: unrotatedPoint.x / normalizedLength,
                y: unrotatedPoint.y / normalizedLength,
                z: unrotatedPoint.z / normalizedLength
            };

            state.points.push({
                theta: Math.atan2(spherePoint.z, spherePoint.x),
                phi: Math.acos(Math.max(-1, Math.min(1, spherePoint.y))),
                accent: true,
                pulseOffset: state.points.length * 0.37
            });

            const maxPoints = compactViewport.matches ? 14 : 20;

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
    initializeWhatsAppFloatMessages();
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
