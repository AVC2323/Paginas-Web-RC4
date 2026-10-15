
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // FUNÇÕES GERAIS
    // =========================

    const validarEmail = email =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const passwordsIguais = (password, confirmPassword) =>
        password === confirmPassword;

    const obterDados = chave => {
        try {
            return JSON.parse(localStorage.getItem(chave) || "[]");
        } catch {
            return [];
        }
    };

    const guardarDados = (chave, dados) => {
        localStorage.setItem(chave, JSON.stringify(dados));
    };

    const mostrarMensagem = (id, mensagem) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = mensagem;
    };


    // =========================
    // UTILIZADORES E AUTENTICAÇÃO
    // =========================

    const sessionKey = "rotaExpressSession";
    const attemptsKey = "rotaExpressAttempts";
    const lockKey = "rotaExpressLock";
    const maxAttempts = 3;
    const lockDuration = 60 * 1000;

    const users = obterDados("users");

    if (!users.some(user =>
        (user.username || "").toLowerCase() === "demo"
    )) {
        users.push({
            username: "demo",
            password: "Rota123!",
            email: "demo@rotaexpress.pt"
        });
        guardarDados("users", users);
    }

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", event => {
            event.preventDefault();

            const email = document.getElementById("email")?.value
                .trim().toLowerCase();
            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("password")?.value;
            const confirmPassword =
                document.getElementById("confirmPassword")?.value;
            const message = document.getElementById("registerMessage");

            if (!email || !username || !password || !confirmPassword || !message) {
                return;
            }

            message.className = "register-message";

            if (!validarEmail(email)) {
                message.textContent = "Introduz um email válido.";
                message.classList.add("error");
                return;
            }

            if (username.length < 3) {
                message.textContent = "O username deve ter pelo menos 3 caracteres.";
                message.classList.add("error");
                return;
            }

            if (password.length < 6) {
                message.textContent = "A password deve ter pelo menos 6 caracteres.";
                message.classList.add("error");
                return;
            }

            if (!passwordsIguais(password, confirmPassword)) {
                message.textContent = "As passwords não coincidem.";
                message.classList.add("error");
                return;
            }

            const savedUsers = obterDados("users");

            if (savedUsers.some(user =>
                (user.email || "").toLowerCase() === email
            )) {
                message.textContent = "Este email já está registado.";
                message.classList.add("error");
                return;
            }

            if (savedUsers.some(user =>
                (user.username || "").toLowerCase() === username.toLowerCase()
            )) {
                message.textContent = "Este username já existe.";
                message.classList.add("error");
                return;
            }

            savedUsers.push({ email, username, password });
            guardarDados("users", savedUsers);

            message.textContent =
                "Conta criada com sucesso! Já podes iniciar sessão.";
            message.classList.add("success");
            registerForm.reset();
        });
    }

    const loginForm = document.getElementById("loginForm");
    const loginSection = document.getElementById("loginSection");
    const profileSection = document.getElementById("profileSection");
    const loginUsername = document.getElementById("username");
    const loginPassword = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const profileUsername = document.getElementById("profileUsername");

    const showLoginMessage = (text, type) => {
        if (!loginMessage) return;

        loginMessage.textContent = text;
        loginMessage.className = "login-message";
        if (type) loginMessage.classList.add(type);
    };

    const getRemainingLockTime = () => {
        const lockUntil = Number(sessionStorage.getItem(lockKey)) || 0;
        return Math.max(0, lockUntil - Date.now());
    };

    const updateLoginState = () => {
        if (!loginForm || !loginButton) return;

        const remaining = getRemainingLockTime();
        if (remaining > 0) {
            loginButton.disabled = true;
            showLoginMessage(
                "Login bloqueado. Tenta novamente dentro de " +
                Math.ceil(remaining / 1000) + " segundos.",
                "error"
            );
            return;
        }

        if (sessionStorage.getItem(lockKey)) {
            sessionStorage.removeItem(lockKey);
            sessionStorage.removeItem(attemptsKey);
        }
        loginButton.disabled = false;
    };

    const updateProfile = () => {
        if (!loginSection || !profileSection) return;

        const username = sessionStorage.getItem(sessionKey);
        loginSection.hidden = Boolean(username);
        profileSection.hidden = !username;

        if (username && profileUsername) {
            profileUsername.textContent = username;
        } else {
            updateLoginState();
        }
    };

    updateProfile();

    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();

            if (getRemainingLockTime() > 0) {
                updateLoginState();
                return;
            }

            if (!loginUsername || !loginPassword) return;

            const username = loginUsername.value.trim();
            const password = loginPassword.value;
            const savedUsers = obterDados("users");
            const user = savedUsers.find(account =>
                (account.username || "").toLowerCase() === username.toLowerCase() &&
                account.password === password
            );

            if (user) {
                sessionStorage.setItem(sessionKey, user.username);
                sessionStorage.removeItem(attemptsKey);
                sessionStorage.removeItem(lockKey);
                loginPassword.value = "";
                updateProfile();
                showLoginMessage("", "");
                return;
            }

            const attempts =
                (Number(sessionStorage.getItem(attemptsKey)) || 0) + 1;
            sessionStorage.setItem(attemptsKey, String(attempts));

            if (attempts >= maxAttempts) {
                sessionStorage.setItem(
                    lockKey,
                    String(Date.now() + lockDuration)
                );
                updateLoginState();
            } else {
                showLoginMessage(
                    "Username ou password incorretos. Restam " +
                    (maxAttempts - attempts) + " tentativa(s).",
                    "error"
                );
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            sessionStorage.removeItem(sessionKey);
            if (loginUsername) loginUsername.value = "";
            if (loginPassword) loginPassword.value = "";
            updateProfile();
            showLoginMessage("Terminaste a sessão com sucesso.", "success");
        });
    }

    if (loginForm) {
        setInterval(() => {
            if (sessionStorage.getItem(lockKey)) updateLoginState();
        }, 1000);
    }

    // =========================
    // RECUPERAR PASSWORD
    // IDs: btnRecuperarPassword, recuperarPasswordForm,
    // formRecuperarPassword, emailRecuperacao,
    // novaPassword, confirmarNovaPassword,
    // mensagemRecuperacao
    // =========================

    const btnRecuperar =
        document.getElementById("btnRecuperarPassword");

    const recuperarForm =
        document.getElementById("recuperarPasswordForm");

    if (btnRecuperar && recuperarForm) {
        btnRecuperar.addEventListener("click", () => {
            recuperarForm.hidden = !recuperarForm.hidden;
        });
    }

    const formRecuperacao =
        document.getElementById("formRecuperarPassword");

    if (formRecuperacao) {
        formRecuperacao.addEventListener("submit", event => {
            event.preventDefault();

            const email = document.getElementById("emailRecuperacao")
                ?.value.trim().toLowerCase();

            const novaPassword =
                document.getElementById("novaPassword")?.value;

            const confirmar =
                document.getElementById("confirmarNovaPassword")?.value;

            if (!email || !novaPassword || !confirmar) {
                mostrarMensagem("mensagemRecuperacao",
                    "Preenche todos os campos.");
                return;
            }

            if (!validarEmail(email)) {
                mostrarMensagem("mensagemRecuperacao", "Email inválido.");
                return;
            }

            if (!passwordsIguais(novaPassword, confirmar)) {
                mostrarMensagem("mensagemRecuperacao",
                    "As passwords não coincidem.");
                return;
            }

            const users = obterDados("users");
            const user = users.find(u => u.email === email);

            if (!user) {
                mostrarMensagem("mensagemRecuperacao",
                    "Não existe uma conta com esse email.");
                return;
            }

            user.password = novaPassword;
            guardarDados("users", users);

            mostrarMensagem("mensagemRecuperacao",
                "Password alterada com sucesso!");

            formRecuperacao.reset();
        });
    }


    // =========================
    // CONTACTOS
    // IDs: contactForm, contactName, contactEmail,
    // contactMessage, contactFeedback
    // =========================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const nome =
                document.getElementById("contactName")?.value.trim();

            const email = document.getElementById("contactEmail")
                ?.value.trim().toLowerCase();

            const mensagem =
                document.getElementById("contactMessage")?.value.trim();

            if (!nome || !email || !mensagem) {
                mostrarMensagem("contactFeedback",
                    "Preenche todos os campos.");
                return;
            }

            if (!validarEmail(email)) {
                mostrarMensagem("contactFeedback", "Email inválido.");
                return;
            }

            const contactos = obterDados("contactMessages");
            contactos.push({
                nome,
                email,
                mensagem,
                data: new Date().toISOString()
            });

            guardarDados("contactMessages", contactos);

            mostrarMensagem("contactFeedback",
                "Mensagem guardada com sucesso!");

            contactForm.reset();
        });
    }


    // =========================
    // TORNA-TE PARCEIRO
    // IDs: partnerForm, partnerName, partnerEmail,
    // partnerPhone, partnerAddress, partnerDescription,
    // partnerFeedback
    // =========================

    const partnerForm = document.getElementById("partnerForm");

    if (partnerForm) {
        partnerForm.addEventListener("submit", event => {
            event.preventDefault();

            const name =
                document.getElementById("partnerName")?.value.trim();

            const email = document.getElementById("partnerEmail")
                ?.value.trim().toLowerCase();

            const phone =
                document.getElementById("partnerPhone")?.value.trim();

            const address =
                document.getElementById("partnerAddress")?.value.trim();

            const description =
                document.getElementById("partnerDescription")?.value.trim();

            if (!name || !email || !phone || !address || !description) {
                mostrarMensagem("partnerFeedback",
                    "Preenche todos os campos.");
                return;
            }

            if (!validarEmail(email)) {
                mostrarMensagem("partnerFeedback", "Email inválido.");
                return;
            }

            const candidaturas = obterDados("partnerApplications");

            candidaturas.push({
                name,
                email,
                phone,
                address,
                description,
                data: new Date().toISOString()
            });

            guardarDados("partnerApplications", candidaturas);

            mostrarMensagem("partnerFeedback",
                "Candidatura guardada com sucesso!");

            partnerForm.reset();
        });
    }


    // =========================
    // PEDIDOS
    // Apresenta os pedidos guardados em localStorage
    // =========================

    const ordersList = document.getElementById("ordersList");

    if (ordersList) {
        const orders = obterDados("orders");

        if (orders.length === 0) {
            ordersList.textContent = "Ainda não tens pedidos.";
        } else {
            ordersList.replaceChildren();

            orders.forEach((order, index) => {
                const card = document.createElement("article");
                const title = document.createElement("h2");
                const details = document.createElement("p");

                title.textContent = `Pedido #${index + 1}`;

                details.textContent =
                    typeof order === "string"
                        ? order
                        : JSON.stringify(order);

                card.append(title, details);
                ordersList.appendChild(card);
            });
        }
    }


    // =========================
    // EXPLORAR
    // Pesquisa os elementos com a classe business-card
    // =========================

    const searchBusiness =
        document.getElementById("searchBusiness");

    if (searchBusiness) {
        searchBusiness.addEventListener("input", () => {
            const pesquisa = searchBusiness.value
                .toLowerCase().trim();

            document.querySelectorAll(".business-card")
                .forEach(card => {
                    card.hidden = !card.textContent
                        .toLowerCase().includes(pesquisa);
                });
        });
    }

});