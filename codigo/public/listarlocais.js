async function carregarFavoritos() {
  const favoritosContainer = document.getElementById('favoritosContainer');
  favoritosContainer.innerHTML = ''; // limpa antes

  try {
    // URL da sua API no Replit (substitua se mudar)
    const apiUrl = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/locais';


    const res = await fetch(apiUrl);
    const dados = await res.json();

    const favoritos = dados.filter(local => local.favorito === true);

    if (favoritos.length === 0) {
      favoritosContainer.innerHTML = '<p>Nenhum local favoritado encontrado.</p>';
      return;
    }

    favoritos.forEach(local => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="member-block">
          <div class="member-block-image-wrap">
            <img src="${local.imagem || 'https://via.placeholder.com/300'}" class="member-block-image img-fluid" alt="Imagem">
            <ul class="social-icon">
              <li>Rua: ${local.rua}, ${local.numero}</li>
              <li>Bairro: ${local.bairro}</li>
              <li>Referência: ${local.referencia}</li>
            </ul>
          </div>
          <div class="member-block-info d-flex align-items-center justify-content-between">
            <div>
              <h4>${local.nomeLocal}</h4>
              <p>${'⭐'.repeat(Number(local.nota))} - ${getRecomendacao(local.recomendacao)}</p>
            </div>
          </div>
        </div>
      `;

      favoritosContainer.appendChild(col);
    });
  } catch (err) {
    favoritosContainer.innerHTML = '<p>Erro ao carregar dados.</p>';
    console.error(err);
  }
}

function getRecomendacao(valor) {
  switch (valor) {
    case '1': return 'Recomendo muito';
    case '2': return 'Recomendo';
    case '3': return 'Recomendo pouco';
    case '4': return 'Não recomendo';
    default: return '';
  }
}

document.addEventListener('DOMContentLoaded', carregarFavoritos);
