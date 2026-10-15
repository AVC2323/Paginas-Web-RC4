
"use strict";

// =====================================
// CONFIGURAÇÕES
// =====================================

const USERS_KEY = "users";
const SESSION_KEY = "rotaExpressSession";
const ATTEMPTS_KEY = "rotaExpressAttempts";
const LOCK_KEY = "rotaExpressLock";

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 60 * 1000;

// =====================================
// UTILIZADORES
// =====================================

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Criar conta de demonstração sem apagar contas existentes
function initializeUsers() {
    const users = getUsers();

    if (!users.some(user => user.username.toLowerCase() === "admin")) {
        users.push({
            username: "admin",
            password: "0000",
            email: "admin@rotaexpress.pt"
        });

        saveUsers(users);
    }
}

// =====================================
// REGISTO DE CONTA
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirmPassword");
        const message = document.getElementById("registerMessage");

        if (
            !emailInput ||
            !usernameInput ||
            !passwordInput ||
            !confirmPasswordInput ||
            !message
        ) {
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        message.className = "register-message";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

        if (password !== confirmPassword) {
            message.textContent = "As passwords não coincidem.";
            message.classList.add("error");
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email &&
            user.email.toLowerCase() === email)) {
            message.textContent = "Este email já está registado.";
            message.classList.add("error");
            return;
        }

        if (users.some(user =>
            user.username.toLowerCase() === username.toLowerCase()
        )) {
            message.textContent = "Este username já existe.";
            message.classList.add("error");
            return;
        }

        users.push({
            email: email,
            username: username,
            password: password
        });

        saveUsers(users);

        message.textContent =
            "Conta criada com sucesso! Já podes iniciar sessão.";

        message.classList.add("success");
        registerForm.reset();
    });
}

// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const profileSection = document.getElementById("profileSection");

const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");

const logoutButton = document.getElementById("logoutButton");
const profileUsername = document.getElementById("profileUsername");

function showLoginMessage(text, type) {
    if (!loginMessage) return;

    loginMessage.textContent = text;
    loginMessage.className = "login-message";

    if (type) {
        loginMessage.classList.add(type);
    }
}

function getAttempts() {
    return Number(sessionStorage.getItem(ATTEMPTS_KEY)) || 0;
}

function getRemainingLockTime() {
    const lockUntil = Number(sessionStorage.getItem(LOCK_KEY)) || 0;
    return Math.max(0, lockUntil - Date.now());
}

function updateLoginState() {
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

    if (sessionStorage.getItem(LOCK_KEY)) {
        sessionStorage.removeItem(LOCK_KEY);
        sessionStorage.removeItem(ATTEMPTS_KEY);
    }

    loginButton.disabled = false;
}

function updateProfile() {
    if (!loginSection || !profileSection) return;

    const username = sessionStorage.getItem(SESSION_KEY);

    if (username) {
        loginSection.hidden = true;
        profileSection.hidden = false;

        if (profileUsername) {
            profileUsername.textContent = username;
        }
    } else {
        loginSection.hidden = false;
        profileSection.hidden = true;

        updateLoginState();
    }
}

// Inicializar a conta demo e o estado da página
initializeUsers();
updateProfile();

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (getRemainingLockTime() > 0) {
            updateLoginState();
            return;
        }

        if (!loginUsername || !loginPassword) return;

        const username = loginUsername.value.trim();
        const password = loginPassword.value;
        const users = getUsers();

        const user = users.find(account =>
            account.username.toLowerCase() === username.toLowerCase() &&
            account.password === password
        );

        if (user) {
            sessionStorage.setItem(SESSION_KEY, user.username);
            sessionStorage.removeItem(ATTEMPTS_KEY);
            sessionStorage.removeItem(LOCK_KEY);

            loginPassword.value = "";
            updateProfile();
            showLoginMessage("", "");
            return;
        }

        const attempts = getAttempts() + 1;
        sessionStorage.setItem(ATTEMPTS_KEY, String(attempts));

        if (attempts >= MAX_ATTEMPTS) {
            sessionStorage.setItem(
                LOCK_KEY,
                String(Date.now() + LOCK_DURATION)
            );

            updateLoginState();
        } else {
            showLoginMessage(
                "Username ou password incorretos. Restam " +
                (MAX_ATTEMPTS - attempts) + " tentativa(s).",
                "error"
            );
        }
    });
}

// =====================================
// LOGOUT
// =====================================

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem(SESSION_KEY);

        if (loginUsername) loginUsername.value = "";
        if (loginPassword) loginPassword.value = "";

        updateProfile();
        showLoginMessage("Terminaste a sessão com sucesso.", "success");
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
