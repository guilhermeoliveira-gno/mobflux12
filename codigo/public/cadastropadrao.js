// Arquivo: seu_script_comum.js (ou o nome do seu arquivo para usuários comuns)

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// URL da API json-server hospedada no Replit
const apiUrl = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/comum';


registerBtn?.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn?.addEventListener('click', () => {
    container.classList.remove('active');
});

document.querySelector('.register form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.register input[placeholder="nome de usuário"]')?.value.trim();
    const email = document.querySelector('.register input[placeholder="Email"]')?.value.trim();
    const password = document.querySelector('.register input[placeholder="senha"]')?.value;

    if (!username || !email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // --- VERIFICAR SE O USUÁRIO (COMUM) JÁ EXISTE NO DB.JSON ---
    try {
        const res = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}`);
        const existingUsers = await res.json();

        if (existingUsers.length > 0) {
            alert('Nome de usuário já está em uso.');
            return;
        }
    } catch (error) {
        console.error('Erro ao verificar usuário existente (comum):', error);
        alert('Erro ao verificar nome de usuário. Tente novamente.');
        return;
    }

    const novoUsuarioComum = { 
        username,
        email,
        password,
    };

    // --- ENVIAR DADOS PARA O DB.JSON (coleção 'comum') ---
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuarioComum)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        alert('Cadastro de usuário comum realizado com sucesso!');
        // Redirecionar para página específica para comum
        window.location.href = 'cadastropadrao.html'; 
    } catch (error) {
        console.error('Erro ao cadastrar usuário comum:', error);
        alert('Erro ao realizar o cadastro de usuário comum. Tente novamente.');
    }
});

document.querySelector('.login form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]')?.value.trim();
    const password = document.querySelector('.login input[placeholder="senha"]')?.value;

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    try {
        const res = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        const users = await res.json();

        if (users.length > 0) {
            localStorage.setItem('usuarioLogado', JSON.stringify(users[0]));
            alert(`Login de usuário comum bem-sucedido. Bem-vindo, ${users[0].username}!`);
            window.location.href = 'index.html'; // redirecionar para home comum
        } else {
            alert('Nome de usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro durante o login de comum:', error);
        alert('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
    }
});

const emailInput = document.querySelector('input[type="email"]');

emailInput?.addEventListener('input', (e) => {
    let val = e.target.value;

    if (val.includes('@')) {
        const parts = val.split('@');
        let userPart = parts[0].replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
        val = userPart + '@gmail.com';
    } else {
        val = val.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
    }

    e.target.value = val;
});
