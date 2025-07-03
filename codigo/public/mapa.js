let map;
let searchBox;
let imagemBase64 = "";

// URL da sua API hospedada
const apiBaseUrl = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/locais';

// Inicializa o mapa e autocomplete
async function initMap() {
  const beloHorizonte = { lat: -19.9167, lng: -43.9345 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: beloHorizonte,
    zoom: 12,
  });

  const input = document.getElementById("search-input");
  searchBox = new google.maps.places.SearchBox(input);
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let searchMarkers = [];

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    searchMarkers.forEach((marker) => marker.setMap(null));
    searchMarkers = [];

    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) return;

      searchMarkers.push(
        new google.maps.Marker({
          map,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  });

  configurarAutocompleteCadastro();
  await carregarLocaisNoMapa();
}

// Autocomplete no cadastro
function configurarAutocompleteCadastro() {
  const inputCadastro = document.getElementById("autocompleteCadastro");
  const autocomplete = new google.maps.places.Autocomplete(inputCadastro);
  autocomplete.setFields(["geometry", "address_components"]);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.address_components) {
      console.error("Endereço incompleto ou inválido");
      return;
    }

    const endereco = {
      rua: '',
      numero: '',
      bairro: '',
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    };

    for (const componente of place.address_components) {
      const tipos = componente.types;
      if (tipos.includes("route")) endereco.rua = componente.long_name;
      if (tipos.includes("street_number")) endereco.numero = componente.long_name;
      if (tipos.includes("sublocality") || tipos.includes("political")) endereco.bairro = componente.long_name;
    }

    document.getElementById("rua").value = endereco.rua;
    document.getElementById("numero").value = endereco.numero;
    document.getElementById("bairro").value = endereco.bairro;
    document.getElementById("latitude").value = endereco.latitude;
    document.getElementById("longitude").value = endereco.longitude;
  });
}

// Carrega os locais cadastrados no mapa
async function carregarLocaisNoMapa() {
  try {
    const resposta = await fetch(apiBaseUrl);
    const locais = await resposta.json();

    // Limpa marcadores antigos
    if(window.locaisMarkers){
      window.locaisMarkers.forEach(marker => marker.setMap(null));
    }
    window.locaisMarkers = [];

    locais.forEach((local) => {
      const lat = parseFloat(local.latitude);
      const lng = parseFloat(local.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const marcador = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: local.nomeLocal,
        icon: {
          url: "pin.png",
          scaledSize: new google.maps.Size(20, 20)
        }
      });

      window.locaisMarkers.push(marcador);

      const favoritoIcone = local.favorito ? '❤️' : '🤍';

      const info = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px; font-family: 'DM Sans', sans-serif;">
            <img src="${local.imagem || 'https://via.placeholder.com/250'}" style="width: 100%; height: auto; border-radius: 10px; object-fit: cover; margin-bottom: 8px;">
            <h5 style="margin: 0; font-size: 1.1rem; color: #3D405B;">${local.nomeLocal}</h5>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              ${local.rua}, ${local.numero} - ${local.bairro}<br>
              <span style="color: #FFD700;">${'⭐'.repeat(Number(local.nota))}</span><br>
              <em>${getRecomendacao(local.recomendacao)}</em>
            </p>
            <button class="btn btn-sm mt-2 btn-favoritar" data-id="${local.id}" data-favorito="${local.favorito}">${favoritoIcone} Favoritar</button>
          </div>
        `
      });

      marcador.addListener("click", () => {
        info.open(map, marcador);

        setTimeout(() => {
          const btn = document.querySelector(`.btn-favoritar[data-id='${local.id}']`);
          if (btn) {
            btn.addEventListener("click", async () => {
              const novoFavorito = !local.favorito;
              local.favorito = novoFavorito;

              await fetch(`${apiBaseUrl}/${local.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favorito: novoFavorito })
              });

              await carregarLocaisNoMapa();
            }, { once: true });
          }
        }, 200);
      });
    });
  } catch (erro) {
    console.error("Erro ao carregar locais:", erro);
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

document.getElementById('formFileSingle').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemBase64 = e.target.result;
      document.getElementById('preview').src = imagemBase64;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('btnSalvar').addEventListener('click', async () => {
  const local = {
    nomeLocal: document.getElementById('nomeLocal').value,
    bairro: document.getElementById('bairro').value,
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    referencia: document.getElementById('referencia').value,
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    nota: document.getElementById('notaSelect').value,
    recomendacao: document.getElementById('recomendacaoSelect').value,
    comentario: document.getElementById('comentario').value,
    imagem: imagemBase64,
    favorito: false
  };

  await fetch(apiBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(local)
  });

  bootstrap.Modal.getInstance(document.getElementById('modalForm')).hide();
  limparFormulario();
  await carregarLocaisNoMapa();
});

function limparFormulario() {
  document.getElementById('nomeLocal').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('rua').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('referencia').value = '';
  document.getElementById('notaSelect').value = '';
  document.getElementById('recomendacaoSelect').value = '';
  document.getElementById('comentario').value = '';
  document.getElementById('latitude').value = '';
  document.getElementById('longitude').value = '';
  imagemBase64 = "";
  document.getElementById('preview').src = '';
}
