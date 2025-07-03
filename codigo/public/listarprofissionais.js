let profissionais = [];
let exibidos = 0;
const LIMITE_INICIAL = 6;
let filtroAtual = "";

async function carregarProfissionais() {
    try {
        // Substitua essa URL pela URL da sua API no Replit
        const apiUrl = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/profissionais';


        const response = await fetch(apiUrl);
        profissionais = await response.json();
        exibidos = 0;
        exibirProximosProfissionais(LIMITE_INICIAL);
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

function filtrarProfissionais() {
    return profissionais.filter(prof => {
        const termo = filtroAtual.toLowerCase();
        return (
            (prof.username && prof.username.toLowerCase().includes(termo)) ||
            (prof.especialidade && prof.especialidade.toLowerCase().includes(termo)) ||
            (prof.telefone && prof.telefone.toLowerCase().includes(termo)) ||
            (prof.localizacao && prof.localizacao.toLowerCase().includes(termo))
        );
    });
}

function exibirProximosProfissionais(qtd) {
    const container = document.getElementById('lista-profissionais');
    if (exibidos === 0) container.innerHTML = '';

    const listaFiltrada = filtrarProfissionais();
    const slice = listaFiltrada.slice(exibidos, exibidos + qtd);

    slice.forEach(prof => {
        const bloco = document.createElement('div');
        bloco.className = 'col-lg-4 col-md-6 col-12 mb-4 profissional';

        // Aplica máscara simples no telefone
        const telefoneFormatado = formatarTelefone(prof.telefone || '');

        bloco.innerHTML = `
            <div class="member-block">
                <div class="member-block-image-wrap">
                    <img src="${prof.imagem || '../guilherme/images/default-user.png'}" class="member-block-image img-fluid" alt="${prof.username}">
                    <ul class="social-icon">
                        <li>${telefoneFormatado}</li>
                        <li>${prof.horario || ''}</li>
                        <li>${prof.localizacao || ''}</li>
                    </ul>
                </div>
                <div class="member-block-info d-flex align-items-center">
                    <h4>${prof.username || ''}</h4>
                    <p class="ms-auto">${prof.especialidade || ''}</p>
                </div>
            </div>
        `;
        container.appendChild(bloco);
    });

    exibidos += slice.length;

    const verMaisBtn = document.getElementById('ver-mais-btn');
    if (exibidos >= listaFiltrada.length) {
        verMaisBtn.style.display = 'none';
    } else {
        verMaisBtn.style.display = 'inline-block';
    }
}

function formatarTelefone(tel) {
    let x = tel.replace(/\D/g, '').slice(0, 11);
    if (x.length > 10) {
        x = x.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (x.length > 5) {
        x = x.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (x.length > 2) {
        x = x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        x = x.replace(/^(\d{0,2})/, '($1');
    }
    return x;
}

document.addEventListener('DOMContentLoaded', carregarProfissionais);

document.getElementById('ver-mais-btn')?.addEventListener('click', () => {
    exibirProximosProfissionais(6);
});

document.getElementById('pesquisa')?.addEventListener('input', e => {
    filtroAtual = e.target.value.trim();
    exibidos = 0;
    exibirProximosProfissionais(LIMITE_INICIAL);
});
