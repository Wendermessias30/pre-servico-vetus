// ==================================================
// VÉTUS — VALIDAÇÃO DE CPF CORRIGIDA E UNIVERSAL
// ==================================================

const WHATSAPP_VETUS = "5534998242733";

// ------------------------------
// MÁSCARAS
// ------------------------------
function aplicarMascaraCPF(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  valor = valor.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  return valor;
}

function aplicarMascaraWhats(valor) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
  valor = valor.replace(/(\d{5})(\d{4})/, "$1-$2");
  return valor;
}

// ------------------------------
// VALIDAÇÕES
// ------------------------------
function validarNome(nome) {
  return nome.trim().length >= 5;
}

function validarFormatoCPF(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
}

// ✅ VALIDAÇÃO PADRÃO OFICIAL DA RECEITA FEDERAL
function validarCPFCompleto(cpf) {
  const numeros = cpf.replace(/\D/g, "");

  // Tem que ter exatamente 11 dígitos
  if (numeros.length !== 11) return false;

  // Rejeita sequências repetidas (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(numeros)) return false;

  const digitos = numeros.split("").map(Number);

  // ========== PRIMEIRO DÍGITO VERIFICADOR ==========
  let soma1 = 0;
  for (let i = 0; i < 9; i++) {
    soma1 += digitos[i] * (10 - i);
  }
  let resto1 = (soma1 * 10) % 11;
  if (resto1 === 10 || resto1 === 11) resto1 = 0;
  if (resto1 !== digitos[9]) return false;

  // ========== SEGUNDO DÍGITO VERIFICADOR ==========
  let soma2 = 0;
  for (let i = 0; i < 10; i++) {
    soma2 += digitos[i] * (11 - i);
  }
  let resto2 = (soma2 * 10) % 11;
  if (resto2 === 10 || resto2 === 11) resto2 = 0;
  if (resto2 !== digitos[10]) return false;

  // ✅ Tudo certo!
  return true;
}

function validarWhats(whats) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(whats);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ------------------------------
// EXIBIR ERRO
// ------------------------------
function mostrarErro(idCampo, idErro, mensagem) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idErro);
  if (mensagem) {
    if (campo) campo.classList.add("invalido");
    erro.textContent = mensagem;
  } else {
    if (campo) campo.classList.remove("invalido");
    erro.textContent = "";
  }
}

// ------------------------------
// EVENTOS EM TEMPO REAL
// ------------------------------
document.getElementById("pre-cpf").addEventListener("input", function () {
  this.value = aplicarMascaraCPF(this.value);

  if (!this.value) {
    mostrarErro("pre-cpf", "pre-cpf-erro", "");
  } else if (!validarFormatoCPF(this.value)) {
    mostrarErro("pre-cpf", "pre-cpf-erro", "Formato: 000.000.000-00");
  } else if (!validarCPFCompleto(this.value)) {
    mostrarErro("pre-cpf", "pre-cpf-erro", "CPF inválido — confira os números");
  } else {
    mostrarErro("pre-cpf", "pre-cpf-erro", "");
  }
});

document.getElementById("pre-whats").addEventListener("input", function () {
  this.value = aplicarMascaraWhats(this.value);

  if (!this.value) {
    mostrarErro("pre-whats", "pre-whats-erro", "");
  } else if (!validarWhats(this.value)) {
    mostrarErro("pre-whats", "pre-whats-erro", "Formato: (XX) XXXXX-XXXX");
  } else {
    mostrarErro("pre-whats", "pre-whats-erro", "");
  }
});

document.getElementById("pre-email").addEventListener("blur", function () {
  if (!this.value) {
    mostrarErro("pre-email", "pre-email-erro", "");
  } else if (!validarEmail(this.value)) {
    mostrarErro("pre-email", "pre-email-erro", "E-mail inválido");
  } else {
    mostrarErro("pre-email", "pre-email-erro", "");
  }
});

// ------------------------------
// ENVIAR PARA WHATSAPP
// ------------------------------
document
  .getElementById("btn-enviar-whats")
  .addEventListener("click", function () {
    const nome = document.getElementById("pre-nome").value;
    const cpf = document.getElementById("pre-cpf").value;
    const whats = document.getElementById("pre-whats").value;
    const email = document.getElementById("pre-email").value;
    const pacoteValor = document.getElementById("pre-pacote").value;
    const necessidade = document.getElementById("pre-necessidade").value;
    const concordo = document.getElementById("pre-concordo").checked;

    let valido = true;

    if (!validarNome(nome)) {
      mostrarErro("pre-nome", "pre-nome-erro", "Digite seu nome completo");
      valido = false;
    } else {
      mostrarErro("pre-nome", "pre-nome-erro", "");
    }

    if (!validarFormatoCPF(cpf) || !validarCPFCompleto(cpf)) {
      mostrarErro(
        "pre-cpf",
        "pre-cpf-erro",
        "CPF inválido — confira os números",
      );
      valido = false;
    }

    if (!validarWhats(whats)) {
      mostrarErro("pre-whats", "pre-whats-erro", "WhatsApp inválido");
      valido = false;
    }

    if (!validarEmail(email)) {
      mostrarErro("pre-email", "pre-email-erro", "E-mail inválido");
      valido = false;
    }

    if (!pacoteValor) {
      mostrarErro("pre-pacote", "pre-pacote-erro", "Escolha um pacote");
      valido = false;
    } else {
      mostrarErro("pre-pacote", "pre-pacote-erro", "");
    }

    if (!concordo) {
      alert("Atenção: Você precisa concordar com os termos!");
      valido = false;
    }

    if (!valido) return;

    const partes = pacoteValor.split("|");
    const nomePacote = partes[0];
    const valorPacote =
      "R$ " + parseFloat(partes[1]).toFixed(2).replace(".", ",");
    const necessidadeTexto = necessidade.trim() || "Não informada";

    const mensagem =
      "PROPOSTA DE PRESTAÇÃO DE SERVIÇO\n" +
      "=================================\n\n" +
      "Nome: " +
      nome +
      "\n" +
      "CPF: " +
      cpf +
      "\n" +
      "WhatsApp: " +
      whats +
      "\n" +
      "E-mail: " +
      email +
      "\n\n" +
      "Pacote: " +
      nomePacote +
      "\n" +
      "Valor: " +
      valorPacote +
      "\n\n" +
      "NECESSIDADE:\n" +
      necessidadeTexto +
      "\n\n" +
      "Termo de consentimento aceito - LGPD\n\n" +
      "Aguardo retorno!";

    const numeroLimpo = WHATSAPP_VETUS.replace(/\D/g, "");
    if (numeroLimpo.length < 12 || numeroLimpo.length > 13) {
      alert("Verifique o número do WhatsApp no código!");
      return;
    }

    const url =
      "https://wa.me/" + numeroLimpo + "?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank");
  });
