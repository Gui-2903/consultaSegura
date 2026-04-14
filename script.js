// Configuração
const BASE_URL = "https://vt-backend-consultasegura-1.onrender.com";
const resultArea = document.getElementById("result");

/**
 * Exibe o estado de carregamento.
 */
function showLoading() {
  resultArea.style.display = "block";
  resultArea.innerHTML = `
    <div class="loading-box">
      <span class="loading-icon">⏳</span>
      Processando análise profissional... Aguarde alguns instantes.
    </div>
  `;
}

/**
 * Exibe uma mensagem de erro formatada.
 * @param {string} msg - A mensagem de erro a ser exibida.
 */
function showError(msg) {
  resultArea.style.display = "block";
  resultArea.innerHTML = `
    <div class="error-box">
      <span class="error-icon">❌</span>
      Erro: ${msg}
    </div>
  `;
}

/**
 * Renderiza os resultados da análise na tela.
 * @param {object} data - Os dados da análise retornados pelo VirusTotal.
 * @param {string} link - O link completo do relatório no VirusTotal.
 */
function renderResult(data, link) {
  const stats = data.attributes.stats;
  const results = data.attributes.results;

  // 1. Gera o HTML da lista de motores, ordenando os maliciosos primeiro
  let engineHtml = "";
  const sortedEngineNames = Object.keys(results).sort((a, b) => {
    // Categoria 'malicious' ou 'suspicious' vêm primeiro
    const catA = results[a].category;
    const catB = results[b].category;
    if (catA === "malicious" || catA === "suspicious") return -1;
    if (catB === "malicious" || catB === "suspicious") return 1;
    return 0; // Mantém a ordem original para outros casos
  });

  for (const engineName of sortedEngineNames) {
    const res = results[engineName];
    const isClean = res.category === "harmless" || res.category === "undetected";
    
    // Define a classe do badge de status
    const statusBadgeClass = isClean ? "status-clean" : "status-detected";
    const statusText = res.result || (isClean ? 'Limpo' : 'Detectado');
    
    engineHtml += `
      <div class="engine-item">
        <span class="engine-name">${res.engine_name}</span>
        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
      </div>
    `;
  }

  // 2. Monta o HTML completo da área de resultados
  resultArea.innerHTML = `
    <h3 class="result-header">Resultado da Varredura</h3>
    
    <div class="stats-grid">
      <div class="stat-card malicious">
        <span class="stat-icon">💀</span>
        <span class="stat-label">Maliciosos</span>
        <span class="stat-value">${stats.malicious}</span>
      </div>
      
      <div class="stat-card suspicious">
        <span class="stat-icon">⚠️</span>
        <span class="stat-label">Suspeitos</span>
        <span class="stat-value">${stats.suspicious}</span>
      </div>
      
      <div class="stat-card harmless">
        <span class="stat-icon">✅</span>
        <span class="stat-label">Seguros</span>
        <span class="stat-value">${stats.harmless}</span>
      </div>
    </div>

    <div class="engines-section">
      <label class="engines-label">Detalhes dos Motores (${Object.keys(results).length}):</label>
      <div class="engine-list">
        ${engineHtml}
      </div>
    </div>

    <div class="report-link-container">
      <a href="${link}" target="_blank" class="view-report-btn">
        🔗 Ver Relatório Completo no VirusTotal
      </a>
    </div>
  `;
}

/**
 * Função principal para iniciar a varredura da URL.
 */
async function scanURL() {
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();

  // Validação básica
  if (!url) {
    alert("Por favor, cole um endereço web (URL) válido.");
    urlInput.focus();
    return;
  }

  showLoading();

  try {
    // Faz a requisição POST para o backend
    const response = await fetch(`${BASE_URL}/scan-url`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent(url)}`
    });

    if (!response.ok) {
      throw new Error(`Falha na resposta do servidor (${response.status})`);
    }

    const data = await response.json();
    
    if (data.data && data.data.id) {
      // Inicia o processo de polling para obter o resultado
      await pollResult(data.data.id);
    } else {
      throw new Error("ID de análise não recebido do servidor.");
    }

  } catch (err) {
    console.error("Erro na varredura:", err);
    showError("Não foi possível iniciar a análise da URL. Tente novamente mais tarde.");
  }
}

/**
 * Realiza polling (consultas repetidas) para obter o resultado final da análise.
 * @param {string} analysisId - O ID da análise retornado inicialmente.
 */
async function pollResult(analysisId) {
  let tries = 0;
  const maxTries = 20; // Aumentado ligeiramente para garantir
  const pollInterval = 3000; // 3 segundos

  while (tries < maxTries) {
    try {
      const res = await fetch(`${BASE_URL}/analysis/${analysisId}`);
      
      if (!res.ok) {
        throw new Error(`Erro ao consultar status (${res.status})`);
      }
      
      const data = await res.json();
      const status = data.data.attributes.status;
      
      console.log(`Polling status (tentativa ${tries + 1}):`, status);

      if (status === "completed") {
        // Sucesso! Formata o link e exibe o resultado
        const cleanId = analysisId.split('-')[1]; // Extrai o ID limpo
        const link = `https://www.virustotal.com/gui/url/${cleanId}`;

        renderResult(data.data, link);
        return; // Encerra o polling
      }

      // Se não completou, espera e tenta novamente
      tries++;
      await new Promise(resolve => setTimeout(resolve, pollInterval));

    } catch (error) {
      console.error("Erro no polling:", error);
      showError("Ocorreu um erro ao recuperar os detalhes da análise.");
      return; // Encerra o polling em caso de erro crítico
    }
  }

  // Se exceder o número máximo de tentativas
  showError("A análise está demorando mais que o esperado. O link oficial do VirusTotal pode estar disponível mais tarde.");
}
