document.addEventListener("DOMContentLoaded", function () {
  // Cria aviso fixo no rodapé para usuário não logado
  const avisoLogin = document.createElement('div');
  avisoLogin.id = 'aviso-login';
  avisoLogin.textContent = 'Faça login para visualizar as demais funcionalidades.';
  avisoLogin.style.position = 'fixed';
  avisoLogin.style.bottom = '20px';
  avisoLogin.style.left = '50%';
  avisoLogin.style.transform = 'translateX(-50%)';
  avisoLogin.style.backgroundColor = '#ffc107';
  avisoLogin.style.color = '#000';
  avisoLogin.style.padding = '10px 20px';
  avisoLogin.style.borderRadius = '8px';
  avisoLogin.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
  avisoLogin.style.display = 'none';
  avisoLogin.style.zIndex = '9999';
  document.body.appendChild(avisoLogin);

  function mostrarAviso() {
    avisoLogin.style.display = 'block';
    clearTimeout(avisoLogin.timer);
    avisoLogin.timer = setTimeout(() => {
      avisoLogin.style.display = 'none';
    }, 3000);
  }

  const btnLogin = document.getElementById("btn-login");
  const btnPerfil = document.getElementById("btn-perfil");
  const usuarioLogadoStr = localStorage.getItem("usuarioLogado");

  const inputFotoPerfil = document.getElementById('inputFotoPerfil');
  const imgPreview = document.getElementById('imgPreview');
  const formEditarPerfil = document.getElementById('formEditarPerfil');
  const btnExcluirConta = document.getElementById('btnExcluirConta');
  const profissionalCampos = document.getElementById('profissionalCampos');
  const fotoPerfilContainer = document.getElementById('fotoPerfilContainer');

  const apiProfissionais = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/profissionais';
  const apiComum = 'https://0aecadb3-e8a7-43c2-ab62-e5bf81c2286c-00-1roml84r0ldxr.riker.replit.dev/comum';

  if (usuarioLogadoStr) {
    try {
      const usuario = JSON.parse(usuarioLogadoStr);
      btnLogin.style.display = "none";
      btnPerfil.style.display = "inline-block";
      btnPerfil.textContent = usuario.username || "Perfil";

      btnPerfil.addEventListener("click", function (e) {
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById("modalEditarPerfil"));
        modal.show();
        preencherFormularioEditarPerfil(usuario);
      });
    } catch (e) {
      console.error("Erro ao processar usuário logado:", e);
    }
  } else {
    btnLogin.style.display = "inline-block";
    btnPerfil.style.display = "none";

    // Trava para não deixar scroll passar da section_2
    const secao2 = document.getElementById('section_2');

    window.addEventListener('scroll', () => {
      if (!secao2) return;
      const limite = secao2.offsetTop + secao2.offsetHeight;
      if (window.scrollY + window.innerHeight > limite + 50) {
        window.scrollTo({ top: limite - window.innerHeight + 100, behavior: 'smooth' });
        mostrarAviso();
      }
    });

    // Bloqueia links do menu para seções bloqueadas para não logados
    const bloquearSecoes = ['section_3', 'section_4', 'section_5'];
    document.querySelectorAll('.nav-link').forEach(link => {
      const destino = link.getAttribute('href');
      if (destino && bloquearSecoes.includes(destino.replace('#', ''))) {
        link.addEventListener('click', e => {
          e.preventDefault();
          mostrarAviso();
        });
      }
    });
  }

  function preencherFormularioEditarPerfil(usuario) {
    document.getElementById('editUsername').value = usuario.username || '';
    document.getElementById('editEmail').value = usuario.email || '';

    if (usuario.especialidade) {
      fotoPerfilContainer.style.display = 'block';
      profissionalCampos.style.display = 'block';

      document.getElementById('editEspecialidade').value = usuario.especialidade || '';
      document.getElementById('editLocalizacao').value = usuario.localizacao || '';
      document.getElementById('editHorario').value = usuario.horario || '';
      document.getElementById('editTelefone').value = usuario.telefone || '';
      imgPreview.src = usuario.imagem || 'default-avatar.png';
    } else {
      fotoPerfilContainer.style.display = 'none';
      profissionalCampos.style.display = 'none';
    }
  }

  if (imgPreview && inputFotoPerfil) {
    imgPreview.addEventListener('click', () => {
      inputFotoPerfil.click();
    });

    inputFotoPerfil.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  formEditarPerfil.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!usuarioLogadoStr) {
      mostrarAviso();
      return;
    }

    const usuarioAtual = JSON.parse(usuarioLogadoStr);
    const dadosAtualizados = {
      ...usuarioAtual,
      username: document.getElementById('editUsername').value.trim(),
      email: document.getElementById('editEmail').value.trim(),
      imagem: fotoPerfilContainer.style.display === 'block' ? imgPreview.src : usuarioAtual.imagem || '',
    };

    if (profissionalCampos.style.display === 'block') {
      dadosAtualizados.especialidade = document.getElementById('editEspecialidade').value.trim();
      dadosAtualizados.localizacao = document.getElementById('editLocalizacao').value.trim();
      dadosAtualizados.horario = document.getElementById('editHorario').value.trim();
      dadosAtualizados.telefone = document.getElementById('editTelefone').value.trim();
    } else {
      delete dadosAtualizados.especialidade;
      delete dadosAtualizados.localizacao;
      delete dadosAtualizados.horario;
      delete dadosAtualizados.telefone;
    }

    if (!dadosAtualizados.id) {
      alert('Usuário sem ID.');
      return;
    }

    try {
      const apiUrlBase = dadosAtualizados.especialidade ? apiProfissionais : apiComum;

      const response = await fetch(`${apiUrlBase}/${dadosAtualizados.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!response.ok) throw new Error('Erro ao atualizar perfil.');

      localStorage.setItem('usuarioLogado', JSON.stringify(dadosAtualizados));
      alert('Perfil atualizado com sucesso!');
      location.reload();

    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar o perfil.');
    }
  });

  btnExcluirConta.addEventListener('click', async function () {
    if (!confirm('Tem certeza que deseja excluir sua conta?')) return;

    try {
      if (!usuarioLogadoStr) throw new Error('Nenhum usuário logado.');

      const usuario = JSON.parse(usuarioLogadoStr);
      const apiUrlBase = usuario.especialidade ? apiProfissionais : apiComum;

      if (!usuario.id) throw new Error('Usuário sem ID.');

      const response = await fetch(`${apiUrlBase}/${usuario.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir conta.');

      alert('Conta excluída com sucesso.');
      localStorage.removeItem('usuarioLogado');
      window.location.href = '../public/index.html';

    } catch (error) {
      console.error(error);
      alert('Erro ao excluir conta.');
    }
  });
});
