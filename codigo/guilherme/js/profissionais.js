
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("containerProfissionais");
    const profissionais = JSON.parse(localStorage.getItem("usuarios"))?.filter(p => p.tipo === "profissional") || [];

    

    profissionais.forEach((prof, index) => {
      const card = document.createElement("div");
      card.className = "col-lg-3 col-md-6 col-12 mb-4 mb-lg-0 mb-md-0";

      card.innerHTML = `
        <div class="member-block">
          <div class="member-block-image-wrap">
            <img src="../guilherme oliveira/images/members/${index % 2 === 0 
              ? 'portrait-young-handsome-businessman-wearing-suit-standing-with-crossed-arms-with-isolated-studio-white-background.jpg' 
              : 'successful-asian-lady-boss-red-blazer-holding-clipboard-with-documens-pen-working-looking-happy-white-background.jpg'}" 
              class="member-block-image img-fluid" alt="Profissional">

            <ul class="social-icon">
              <li><strong>Telefone:</strong> ${prof.telefone || "Não informado"}</li>
              <li><strong>Horário:</strong> ${prof.horarioAtendimento || "Não informado"}</li>
              <li><strong>Localização:</strong> ${prof.localAtendimento || "Não informado"}</li>
            </ul>
          </div>

          <div class="member-block-info d-flex align-items-center">
            <h4>${prof.nome}</h4>
            <p class="ms-auto">${prof.especialidade}</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  });

