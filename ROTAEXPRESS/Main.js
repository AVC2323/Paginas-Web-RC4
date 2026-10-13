
const validarEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarPassword = (password, confirmPassword) =>
    password === confirmPassword;

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email")
        .value.trim().toLowerCase();

    const username = document.getElementById("username")
        .value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message = document.getElementById("registerMessage");

    if (!validarEmail(email)) {
        message.textContent = "Email inválido!";
        return;
    }

    if (!validarPassword(password, confirmPassword)) {
        message.textContent = "As passwords não coincidem!";
        return;
    }

    if (!username || !password) {
        message.textContent = "Preenche todos os campos!";
        return;
    }

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    if (users.some(u => u.email === email)) {
        message.textContent = "Este email já está registado!";
        return;
    }

    if (users.some(u =>
        u.username.toLowerCase() === username.toLowerCase()
    )) {
        message.textContent = "Username já existe!";
        return;
    }

    // Guardar o utilizador localmente
    users.push({
        email: email,
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Registo efetuado com sucesso!";
    registerForm.reset();
});

// PAGINA DE RECUPERAÇÃO DE PASSWORD/CONTA 

    document.getElementById('recover-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Evita que a página recarregue

            const email = document.getElementById('email').value;
            const feedback = document.getElementById('feedback-message');

            if (email) {
                // Simulação de sucesso no envio
                feedback.style.color = 'green';
                feedback.textContent = `Se o e-mail ${email} estiver registado, enviaremos um link de recuperação em breve.`;
                
                // Opcional: limpar o campo
                document.getElementById('email').value = '';
            } else {
                feedback.style.color = 'red';
                feedback.textContent = 'Por favor, insere um e-mail válido.';
            }
        });
 //FIM

 
"use strict";

// Chaves utilizadas para guardar os dados
const USERS_KEY = "rotaExpressUsers";
const SESSION_KEY = "rotaExpressSession";
const ATTEMPTS_KEY = "rotaExpressAttempts";
const LOCK_KEY = "rotaExpressLock";

// Configuração do bloqueio
const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 60 * 1000;

// Elementos do formulário
const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const profileSection = document.getElementById("profileSection");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const profileUsername = document.getElementById("profileUsername");

// Criar uma conta de demonstração na primeira utilização
function initializeUsers() {
    let users;

    try {
        users = JSON.parse(localStorage.getItem(USERS_KEY));
    } catch (error) {
        users = null;
    }

    if (!Array.isArray(users)) {
        users = [
            {
                username: "demo",
                password: "Rota123!"
            }
        ];

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
}

// Mostrar mensagens no formulário
function showMessage(message, type = "") {
    if (!loginMessage) return;

    loginMessage.textContent = message;
    loginMessage.className = "login-message";

    if (type) {
        loginMessage.classList.add(type);
    }
}

// Ler o número de tentativas falhadas
function getAttempts() {
    return Number(sessionStorage.getItem(ATTEMPTS_KEY)) || 0;
}

// Guardar o número de tentativas falhadas
function setAttempts(attempts) {
    sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));
}

// Calcular o tempo que falta para terminar o bloqueio
function getRemainingLockTime() {
    const lockUntil = Number(sessionStorage.getItem(LOCK_KEY)) || 0;

    return Math.max(0, lockUntil - Date.now());
}

// Atualizar o estado do formulário e o temporizador
function updateLoginState() {
    if (!loginForm) return;

    const lockUntil = Number(sessionStorage.getItem(LOCK_KEY)) || 0;
    const remaining = getRemainingLockTime();

    if (remaining > 0) {
        loginButton.disabled = true;

        showMessage(
            "Login bloqueado. Tenta novamente dentro de " +
            Math.ceil(remaining / 1000) + " segundos.",
            "error"
        );

        return;
    }

    // Reiniciar as tentativas apenas quando o bloqueio terminar
    if (lockUntil > 0) {
        sessionStorage.removeItem(LOCK_KEY);
        sessionStorage.removeItem(ATTEMPTS_KEY);
    }

    loginButton.disabled = false;
    showMessage("");
}

// Mostrar o formulário ou o perfil autenticado
function updateProfile() {
    if (!loginSection || !profileSection) return;

    const username = sessionStorage.getItem(SESSION_KEY);

    if (username) {
        loginSection.hidden = true;
        profileSection.hidden = false;
        profileUsername.textContent = username;
    } else {
        loginSection.hidden = false;
        profileSection.hidden = true;

        updateLoginState();
    }
}

// Inicializar os dados e o perfil
initializeUsers();
updateProfile();

// Processar o login
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Verificar se o utilizador continua bloqueado
        if (getRemainingLockTime() > 0) {
            updateLoginState();
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        let users;

        try {
            users = JSON.parse(localStorage.getItem(USERS_KEY));
        } catch (error) {
            users = [];
        }

        if (!Array.isArray(users)) {
            users = [];
        }

        // Comparar o username e a password
        const user = users.find(function (account) {
            return account.username === username &&
                   account.password === password;
        });

        if (user) {
            // Guardar a sessão no separador atual
            sessionStorage.setItem(SESSION_KEY, user.username);

            // Limpar tentativas e bloqueios anteriores
            sessionStorage.removeItem(ATTEMPTS_KEY);
            sessionStorage.removeItem(LOCK_KEY);

            passwordInput.value = "";

            updateProfile();
            return;
        }

        // Registar uma tentativa falhada
        const attempts = getAttempts() + 1;
        setAttempts(attempts);

        if (attempts >= MAX_ATTEMPTS) {
            // Bloquear o login durante 60 segundos
            sessionStorage.setItem(
                LOCK_KEY,
                String(Date.now() + LOCK_DURATION)
            );

            updateLoginState();
        } else {
            const remainingAttempts = MAX_ATTEMPTS - attempts;

            showMessage(
                "Username ou password incorretos. Restam " +
                remainingAttempts + " tentativa(s).",
                "error"
            );
        }
    });
}

// Terminar a sessão
if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem(SESSION_KEY);

        usernameInput.value = "";
        passwordInput.value = "";

        updateProfile();
        showMessage("Terminaste a sessão com sucesso.", "success");
    });
}

// Atualizar o contador do bloqueio a cada segundo
if (loginForm) {
    setInterval(function () {
        if (sessionStorage.getItem(LOCK_KEY)) {
            updateLoginState();
        }
    }, 1000);
}
