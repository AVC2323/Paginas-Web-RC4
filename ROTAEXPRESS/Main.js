
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
    // REGISTER
    // IDs: registerForm, email, username,
    // password, confirmPassword, registerMessage
    // =========================

   
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("Não foi encontrado o formulário registerForm.");
        return;
    }

    const emailInput = document.getElementById("email");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const passwordMessage = document.getElementById("passwordMessage");
    const registerMessage = document.getElementById("registerMessage");

    const validarEmail = email =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const passwordsIguais = (password, confirmPassword) =>
        password === confirmPassword;

    // Verificar as passwords enquanto o utilizador escreve
    const verificarPasswords = () => {
        if (confirmInput.value === "") {
            passwordMessage.textContent = "";
            return false;
        }

        const iguais = passwordsIguais(
            passwordInput.value,
            confirmInput.value
        );

        passwordMessage.textContent = iguais
            ? "As passwords coincidem."
            : "As passwords não coincidem.";

        passwordMessage.style.color = iguais ? "green" : "red";

        return iguais;
    };

    passwordInput.addEventListener("input", verificarPasswords);
    confirmInput.addEventListener("input", verificarPasswords);

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        registerMessage.textContent = "";

        if (!validarEmail(email)) {
            registerMessage.textContent = "Introduz um email válido.";
            return;
        }

        if (!username || !password || !confirmPassword) {
            registerMessage.textContent = "Preenche todos os campos.";
            return;
        }

        // A comparação acontece antes de guardar o utilizador
        if (!passwordsIguais(password, confirmPassword)) {
            verificarPasswords();
            registerMessage.textContent =
                "Registo cancelado: as passwords são diferentes.";
            return;
        }

        let users;

        try {
            users = JSON.parse(localStorage.getItem("users") || "[]");

            if (!Array.isArray(users)) {
                users = [];
            }
        } catch {
            users = [];
        }

        if (users.some(user => user.email === email)) {
            registerMessage.textContent = "Este email já está registado.";
            return;
        }

        if (users.some(user =>
            user.username.toLowerCase() === username.toLowerCase()
        )) {
            registerMessage.textContent = "Este username já existe.";
            return;
        }

        users.push({
            email: email,
            username: username,
            password: password
        });

        try {
            localStorage.setItem("users", JSON.stringify(users));
        } catch {
            registerMessage.textContent =
                "Não foi possível guardar o registo no navegador.";
            return;
        }

        registerMessage.textContent = "Registo efetuado com sucesso!";
        form.reset();
        passwordMessage.textContent = "";
    });
});
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