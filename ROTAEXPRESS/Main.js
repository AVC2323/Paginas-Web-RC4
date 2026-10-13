
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