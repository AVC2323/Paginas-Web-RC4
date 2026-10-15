
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

   
document.addEventListener("DOMContentLoaded", function () {


const form = document.getElementById("registerForm");

if (!form) {
    console.error("Não foi encontrado o formulário registerForm.");
    return;
}

const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const nameInput = document.getElementById("name");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const login = loginInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const name = nameInput.value.trim();

    if (!login || !password || !confirmPassword || !name) {
        alert("Preenche todos os campos.");
        return;
    }

    if (password !== confirmPassword) {
        alert("As palavras-passe não coincidem!");
        confirmPasswordInput.focus();
        return;
    }

    if (password.length < 8) {
        alert("A palavra-passe deve ter pelo menos 8 caracteres.");
        passwordInput.focus();
        return;
    }

    let users = [];

    try {
        users = JSON.parse(localStorage.getItem("rotaExpressUsers")) || [];
    } catch (error) {
        alert("Não foi possível ler os utilizadores guardados.");
        return;
    }

    const existingUser = users.some(function (user) {
        return user.login.toLowerCase() === login.toLowerCase();
    });

    if (existingUser) {
        alert("Este email ou login já está registado.");
        loginInput.focus();
        return;
    }

    users.push({
        login: login,
        password: password,
        name: name
    });

    localStorage.setItem("rotaExpressUsers", JSON.stringify(users));

    alert("Registo efetuado com sucesso!");

    form.reset();

    window.location.href = "login.html";
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