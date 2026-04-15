const supabaseClient = supabase.createClient(
  "https://bcouvsffawvvefnwzzdt.supabase.co",
  "sb_publishable_uZ2hX4VAJZvBVA0n5BeogA_8OdA9fr2"
);

const state = {
  user: null,
  allDados: [],
  dados: [],
  allOperadores: [],
  chart: null,
  detailChart: null,
  comissao: 0.3,
  currentPage: "overview",
  selectedOperator: null
};

const $ = (id) => document.getElementById(id);

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateOnly = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

const startOfWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 6);
  return d;
};

const startOfMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  $("toast-container").appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function saveSession() {
  if (state.user) {
    localStorage.setItem("stark_cpa_session", JSON.stringify({ email: state.user.email }));
  }
}

function clearSession() {
  localStorage.removeItem("stark_cpa_session");
}

function isAdmin() {
  return state.user?.email === "admin@email.com";
}

function getOperatorResultado(bruto) {
  const valor = Number(bruto || 0);
  return valor >= 0 ? valor * state.comissao : valor;
}

function getFilteredListByPeriod(list, filtro) {
  const hojeStr = getLocalDateString();
  const semanaInicio = startOfWeek();
  const mesInicio = startOfMonth();
  const agora = new Date();

  return list.filter((item) => {
    if (filtro === "hoje") return item.data_registro === hojeStr;

    const data = item.data_registro
      ? parseDateOnly(item.data_registro)
      : item.created_at
        ? new Date(item.created_at)
        : null;

    if (!data || Number.isNaN(data.getTime())) return false;

    data.setHours(0, 0, 0, 0);

    if (filtro === "semana") return data >= semanaInicio && data <= agora;
    if (filtro === "mes") return data >= mesInicio && data <= agora;

    return true;
  });
}

function sumLucro(list) {
  return list.reduce((acc, item) => acc + Number(item.lucro || 0), 0);
}

function sumContas(list) {
  return list.reduce((acc, item) => acc + Number(item.qtd_contas || 0), 0);
}

function updatePreview() {
  const entrada = Number($("entrada")?.value) || 0;
  const ajuste = Number($("ajuste")?.value) || 0;
  const saida = Number($("saida")?.value) || 0;
  const bruto = saida + ajuste - entrada;

  const el = $("resultado-previo");
  el.textContent = formatCurrency(bruto);
  el.className = `text-3xl font-black mt-2 ${bruto >= 0 ? "positive" : "negative"}`;
}

function setGoalCard(prefix, realizado, meta) {
  const percent = meta > 0 ? Math.min((realizado / meta) * 100, 100) : 0;
  $(`goal-${prefix}`).textContent = `${realizado} / ${meta}`;
  $(`goal-${prefix}-sub`).textContent = `${percent.toFixed(0)}%`;
  $(`goal-${prefix}-bar`).style.width = `${percent}%`;
}

function setDetailGoalCard(prefix, realizado, meta) {
  const percent = meta > 0 ? Math.min((realizado / meta) * 100, 100) : 0;
  $(`detail-goal-${prefix}`).textContent = `${realizado} / ${meta}`;
  $(`detail-goal-${prefix}-sub`).textContent = `${percent.toFixed(0)}%`;
  $(`detail-goal-${prefix}-bar`).style.width = `${percent}%`;
}

function renderOperatorGoalsOverview() {
  if (isAdmin()) {
    $("operator-goals").classList.add("hidden");
    return;
  }

  const mine = state.allDados.filter((item) => item.email === state.user.email);
  setGoalCard("hoje", sumContas(getFilteredListByPeriod(mine, "hoje")), Number(state.user.meta_dia_contas || 0));
  setGoalCard("semana", sumContas(getFilteredListByPeriod(mine, "semana")), Number(state.user.meta_semana_contas || 0));
  setGoalCard("mes", sumContas(getFilteredListByPeriod(mine, "mes")), Number(state.user.meta_mes_contas || 0));

  $("operator-goals").classList.remove("hidden");
}

function applyAdminVisibility() {
  const admin = isAdmin();
 $("admin-finance-cards")?.classList.toggle("hidden", !isAdmin());
  $("btn-open-operator-modal")?.classList.toggle("hidden", !admin);
  $("btn-export-excel")?.classList.toggle("hidden", !admin);
  $("nav-operators")?.classList.toggle("hidden", !admin);
  $("nav-goals")?.classList.toggle("hidden", !admin);
  $("nav-operator-detail")?.classList.toggle("hidden", !admin || !state.selectedOperator);
  $("th-acoes")?.classList.toggle("hidden", !admin);
  $("busca-registros")?.classList.toggle("hidden", !admin);

  $("admin-header")?.classList.toggle("hidden", !admin);
  $("operator-header")?.classList.toggle("hidden", admin);

  $("sidebar-subtitle").textContent = admin ? "Admin Dashboard" : "Painel do Operador";
  $("control-title").textContent = admin ? "Controles Administrativos" : "Meus Controles";
  $("control-subtitle").textContent = admin
    ? "Gerencie filtros, exportação e equipe."
    : "Filtre seus registros e acompanhe seu desempenho.";
  $("form-title").textContent = admin ? "Novo registro" : "Meu novo registro";
  $("form-subtitle").textContent = admin
    ? "Lance valores de depósito, saque, BAU e contas."
    : "Registre sua movimentação e suas contas do dia.";
  $("ranking-title").textContent = "Ranking global";
  $("table-title").textContent = admin ? "Registros gerais" : "Meus registros";
  $("table-subtitle").textContent = admin
    ? "Lista de movimentações registradas."
    : "Lista das suas movimentações.";
  $("chart-title").textContent = admin ? "Desempenho da equipe" : "Meu desempenho";

  if (!admin) {
    $("page-operators")?.classList.add("hidden");
    $("page-goals")?.classList.add("hidden");
    $("page-operator-detail")?.classList.add("hidden");
    state.selectedOperator = null;
    $("operator-goals").classList.remove("hidden");
    if (state.currentPage !== "overview") showPage("overview");
  } else {
    $("operator-goals").classList.add("hidden");
  }
}

function startApp() {
  $("usuario-logado").textContent = state.user.email;
  $("usuario-tipo").textContent = isAdmin() ? "Administrador" : "Operador";
  $("login-screen").classList.add("hidden");
  $("app-screen").classList.remove("hidden");

  applyAdminVisibility();
$("admin-finance-cards")?.classList.toggle("hidden", !isAdmin());
  carregar();
  if (isAdmin()) carregarOperadores();
}

async function restoreSession() {
  const saved = localStorage.getItem("stark_cpa_session");
  if (!saved) return;

  try {
    const { email } = JSON.parse(saved);
    if (!email) return;

    const { data, error } = await supabaseClient
      .from("operadores")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return clearSession();

    state.user = data;
    startApp();
    showToast("Sessão restaurada.", "info");
  } catch {
    clearSession();
  }
}

async function login() {
  const email = $("email").value.trim();
  const senha = $("senha").value.trim();

  if (!email || !senha) return showToast("Preencha email e senha.", "error");

  const { data, error } = await supabaseClient
    .from("operadores")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    console.error(error);
    return showToast("Login inválido.", "error");
  }

  state.user = data;
  saveSession();
  startApp();
  showToast("Login realizado com sucesso.");
}

function logout() {
  clearSession();
  location.reload();
}

function showPage(page) {
  if ((page === "operators" || page === "goals" || page === "operator-detail") && !isAdmin()) return;
  if (page === "operator-detail" && !state.selectedOperator) return;

  state.currentPage = page;

  $("page-overview").classList.toggle("hidden", page !== "overview");
  $("page-operators").classList.toggle("hidden", page !== "operators");
  $("page-goals").classList.toggle("hidden", page !== "goals");
  $("page-operator-detail").classList.toggle("hidden", page !== "operator-detail");

  $("nav-overview").classList.toggle("active-link", page === "overview");
  $("nav-operators").classList.toggle("active-link", page === "operators");
  $("nav-goals").classList.toggle("active-link", page === "goals");
  $("nav-operator-detail").classList.toggle("active-link", page === "operator-detail");

  if (page === "operators" && isAdmin()) carregarOperadores();
  if (page === "goals" && isAdmin()) renderGoalsTable();
  if (page === "operator-detail" && isAdmin()) renderOperatorDetail();
}

function openCreateOperatorModal() {
  if (!isAdmin()) return;
  $("novo-operador-email").value = "";
  $("novo-operador-senha").value = "";
  $("operator-modal").classList.remove("hidden");
}

function closeCreateOperatorModal() {
  $("operator-modal").classList.add("hidden");
}

async function createOperatorFromModal() {
  if (!isAdmin()) return;

  const email = $("novo-operador-email").value.trim();
  const senha = $("novo-operador-senha").value.trim();
  if (!email || !senha) return showToast("Preencha email e senha do operador.", "error");

  const { error } = await supabaseClient.from("operadores").insert({
    email,
    senha,
    created_at: new Date().toISOString(),
    meta_dia_contas: 0,
    meta_semana_contas: 0,
    meta_mes_contas: 0
  });

  if (error) {
    console.error(error);
    return showToast("Erro ao criar operador.", "error");
  }

  closeCreateOperatorModal();
  await carregarOperadores();
  showToast("Operador criado com sucesso.");
}

async function carregarOperadores() {
  const { data, error } = await supabaseClient
    .from("operadores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return showToast("Erro ao carregar operadores.", "error");
  }

  state.allOperadores = data || [];
  filtrarOperadoresRender();
  renderGoalsTable();
}

function openOperatorDetail(email) {
  if (!isAdmin()) return;
  state.selectedOperator = email;
  $("detail-subtitle").textContent = `Visualização individual de ${email}`;
  $("nav-operator-detail").classList.remove("hidden");
  showPage("operator-detail");
}

function closeOperatorDetail() {
  state.selectedOperator = null;
  $("nav-operator-detail").classList.add("hidden");
  if (state.detailChart) {
    state.detailChart.destroy();
    state.detailChart = null;
  }
  showPage("operators");
}

function filtrarOperadoresRender() {
  const tbody = $("operators-table");
  if (!tbody || !isAdmin()) return;

  const busca = ($("busca-operadores")?.value || "").trim().toLowerCase();
  const lista = busca
    ? state.allOperadores.filter((op) => String(op.email || "").toLowerCase().includes(busca))
    : state.allOperadores;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400">Nenhum operador encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map((op) => {
    const protegido = op.email === "admin@email.com";
    return `
      <tr class="border-b border-slate-900">
        <td class="py-4 pr-3 font-semibold">
          <button class="operator-link" onclick="openOperatorDetail('${op.email}')">${op.email}</button>
        </td>
        <td class="py-4 pr-3">${op.created_at ? new Date(op.created_at).toLocaleDateString("pt-BR") : "-"}</td>
        <td class="py-4 pr-3">${protegido ? "Administrador" : "Operador"}</td>
        <td class="py-4">
          ${
            protegido
              ? `<span class="text-slate-500 text-sm">Protegido</span>`
              : `<button onclick="removerOperador('${op.id}', '${op.email}')" class="table-action delete-btn">Remover</button>`
          }
        </td>
      </tr>
    `;
  }).join("");
}

function safeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function renderGoalsTable() {
  const tbody = $("goals-table");
  if (!tbody || !isAdmin()) return;

  const busca = ($("busca-metas")?.value || "").trim().toLowerCase();
  const lista = busca
    ? state.allOperadores.filter((op) => String(op.email || "").toLowerCase().includes(busca))
    : state.allOperadores;

  const operadores = lista.filter((op) => op.email !== "admin@email.com");

  if (!operadores.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400">Nenhum operador encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = operadores.map((op) => `
    <tr class="border-b border-slate-900">
      <td class="py-4 pr-3 font-semibold">${op.email}</td>
      <td class="py-4 pr-3"><input id="goal-day-${safeId(op.email)}" type="number" class="app-input no-spinner" value="${Number(op.meta_dia_contas || 0)}" /></td>
      <td class="py-4 pr-3"><input id="goal-week-${safeId(op.email)}" type="number" class="app-input no-spinner" value="${Number(op.meta_semana_contas || 0)}" /></td>
      <td class="py-4 pr-3"><input id="goal-month-${safeId(op.email)}" type="number" class="app-input no-spinner" value="${Number(op.meta_mes_contas || 0)}" /></td>
      <td class="py-4"><button class="success-btn" onclick="saveGoalsFromTable('${op.email}')">Salvar</button></td>
    </tr>
  `).join("");
}

async function saveGoalsFromTable(email) {
  if (!isAdmin()) return;

  const id = safeId(email);
  const metaDia = Number($(`goal-day-${id}`).value) || 0;
  const metaSemana = Number($(`goal-week-${id}`).value) || 0;
  const metaMes = Number($(`goal-month-${id}`).value) || 0;

  const { error } = await supabaseClient
    .from("operadores")
    .update({
      meta_dia_contas: metaDia,
      meta_semana_contas: metaSemana,
      meta_mes_contas: metaMes
    })
    .eq("email", email);

  if (error) {
    console.error(error);
    return showToast("Erro ao salvar metas.", "error");
  }

  const op = state.allOperadores.find((item) => item.email === email);
  if (op) {
    op.meta_dia_contas = metaDia;
    op.meta_semana_contas = metaSemana;
    op.meta_mes_contas = metaMes;
  }

  if (state.selectedOperator === email && state.currentPage === "operator-detail") {
    renderOperatorDetail();
  }

  if (state.user.email === email) {
    state.user.meta_dia_contas = metaDia;
    state.user.meta_semana_contas = metaSemana;
    state.user.meta_mes_contas = metaMes;
    renderOperatorGoalsOverview();
  }

  showToast("Metas salvas com sucesso.");
}

async function removerOperador(id, email) {
  if (!isAdmin()) return;
  if (!confirm(`Remover o operador ${email}?`)) return;

  const { error } = await supabaseClient.from("operadores").delete().eq("id", id);

  if (error) {
    console.error(error);
    return showToast("Erro ao remover operador.", "error");
  }

  await carregarOperadores();
  showToast("Operador removido com sucesso.");
}

async function saveOperatorGoals() {
  if (!isAdmin() || !state.selectedOperator) return;

  const metaDia = Number($("meta-dia-input").value) || 0;
  const metaSemana = Number($("meta-semana-input").value) || 0;
  const metaMes = Number($("meta-mes-input").value) || 0;

  const { error } = await supabaseClient
    .from("operadores")
    .update({
      meta_dia_contas: metaDia,
      meta_semana_contas: metaSemana,
      meta_mes_contas: metaMes
    })
    .eq("email", state.selectedOperator);

  if (error) {
    console.error(error);
    return showToast("Erro ao salvar metas.", "error");
  }

  const op = state.allOperadores.find((item) => item.email === state.selectedOperator);
  if (op) {
    op.meta_dia_contas = metaDia;
    op.meta_semana_contas = metaSemana;
    op.meta_mes_contas = metaMes;
  }

  if (state.user.email === state.selectedOperator) {
    state.user.meta_dia_contas = metaDia;
    state.user.meta_semana_contas = metaSemana;
    state.user.meta_mes_contas = metaMes;
  }

  renderGoalsTable();
  renderOperatorDetail();
  showToast("Metas salvas com sucesso.");
}

async function salvar() {
  if (!state.user) return;

  const entrada = Number($("entrada").value) || 0;
  const ajuste = Number($("ajuste").value) || 0;
  const saida = Number($("saida").value) || 0;
  const qtdContas = Number($("qtd-contas").value) || 0;
  const agora = new Date();

  const { error } = await supabaseClient.from("ciclos").insert({
    email: state.user.email,
    lucro: saida + ajuste - entrada,
    qtd_contas: qtdContas,
    created_at: agora.toISOString(),
    data_registro: getLocalDateString(agora)
  });

  if (error) {
    console.error(error);
    return showToast("Erro ao salvar registro.", "error");
  }

  ["entrada", "ajuste", "saida", "qtd-contas"].forEach((id) => ($(`${id}`).value = ""));
  updatePreview();
  await carregar();
  showToast("Registro salvo com sucesso.");
}

function applyCurrentFilter() {
  const filtro = $("filtroData").value;
  const busca = isAdmin() ? (($("busca-registros")?.value || "").trim().toLowerCase()) : "";

  let listaBase = isAdmin()
    ? state.allDados
    : state.allDados.filter((item) => item.email === state.user.email);

  let lista = getFilteredListByPeriod(listaBase, filtro);

  if (busca) {
    lista = lista.filter((item) =>
      String(item.email || "").toLowerCase().includes(busca)
    );
  }

  state.dados = lista;
  renderTabela();
  renderRanking();
  renderGrafico();
}

async function carregar() {
  const { data, error } = await supabaseClient
    .from("ciclos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return showToast("Erro ao carregar registros.", "error");
  }

  state.allDados = data || [];
  renderMetricasPorPeriodo();
renderOperatorGoalsOverview();
renderFinanceCards(); // 🔥 ADICIONADO
applyCurrentFilter();

  if (isAdmin() && state.selectedOperator && state.currentPage === "operator-detail") {
    renderOperatorDetail();
  }
}

function renderMetricCard(prefix, list) {
  const total = sumLucro(list);
  $(`metric-${prefix}`).textContent = formatCurrency(total);
  $(`metric-${prefix}-count`).textContent = `${list.length} registro${list.length === 1 ? "" : "s"}`;
}

function renderMetricasPorPeriodo() {
  const baseList = isAdmin()
    ? state.allDados
    : state.allDados.filter((item) => item.email === state.user.email);

  renderMetricCard("hoje", getFilteredListByPeriod(baseList, "hoje"));
  renderMetricCard("semana", getFilteredListByPeriod(baseList, "semana"));
  renderMetricCard("mes", getFilteredListByPeriod(baseList, "mes"));
  renderMetricCard("total", getFilteredListByPeriod(baseList, "todos"));
}

function renderTabela() {
  const tabela = $("tabela");

  if (!state.dados.length) {
    tabela.innerHTML = `<tr><td colspan="${isAdmin() ? 7 : 6}" class="py-6 text-center text-slate-400">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tabela.innerHTML = state.dados.map((item) => {
    const bruto = Number(item.lucro || 0);
    const comissaoOperador = getOperatorResultado(bruto);
    const lucroEmpresa = bruto - comissaoOperador;
    const contas = Number(item.qtd_contas || 0);
    const dataTexto = item.data_registro
      ? parseDateOnly(item.data_registro)?.toLocaleDateString("pt-BR") || "-"
      : item.created_at
        ? new Date(item.created_at).toLocaleDateString("pt-BR")
        : "-";

    return `
      <tr class="border-b border-slate-900">
        <td class="py-4 pr-3 font-semibold">${item.email ?? "-"}</td>
        <td class="py-4 pr-3 ${bruto >= 0 ? "positive" : "negative"}">${formatCurrency(bruto)}</td>
        <td class="py-4 pr-3 ${comissaoOperador >= 0 ? "positive" : "negative"}">${formatCurrency(comissaoOperador)}</td>
        <td class="py-4 pr-3 ${lucroEmpresa >= 0 ? "positive" : "negative"}">${formatCurrency(lucroEmpresa)}</td>
        <td class="py-4 pr-3">${contas}</td>
        <td class="py-4 pr-3">${dataTexto}</td>
        ${
          isAdmin()
            ? `<td class="py-4">
                <div class="flex gap-2">
                  <button onclick="editar('${item.id}')" class="table-action edit-btn">Editar</button>
                  <button onclick="excluir('${item.id}')" class="table-action delete-btn">Excluir</button>
                </div>
              </td>`
            : ``
        }
      </tr>
    `;
  }).join("");
}

function renderRanking() {
  const rankingDiv = $("ranking");
  const periodo = $("ranking-period")?.value || "hoje";
  const base = getFilteredListByPeriod(state.allDados, periodo);
  const mapa = {};

  base.forEach((item) => {
    const email = item.email || "Sem operador";
    mapa[email] = (mapa[email] || 0) + Number(item.qtd_contas || 0);
  });

  const lista = Object.entries(mapa)
    .map(([email, contas]) => ({ email, contas }))
    .sort((a, b) => b.contas - a.contas);

  if (!lista.length) {
    rankingDiv.innerHTML = `<div class="text-slate-400">Nenhum dado no ranking.</div>`;
    return;
  }

  rankingDiv.innerHTML = lista.map((u, i) => {
    let style = "";

    if (i === 0) {
      style = `
        background: linear-gradient(135deg, #FFD700, #FFC107, #FFB300);
        color: #000;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
      `;
    } else if (i === 1) {
      style = `
        background: linear-gradient(135deg, #E0E0E0, #BDBDBD, #9E9E9E);
        color: #000;
      `;
    } else if (i === 2) {
      style = `
        background: linear-gradient(135deg, #CD7F32, #B87333, #8B5A2B);
        color: #fff;
      `;
    } else {
      style = `
        background: #1e293b;
        color: #fff;
      `;
    }

    return `
      <div style="
        padding:12px;
        border-radius:12px;
        margin-bottom:8px;
        transition:0.3s;
        ${style}
      ">
        <b>#${i + 1}</b> ${u.email} — ${u.contas} contas
      </div>
    `;
  }).join("");
}

function renderOperatorDetail() {
  if (!isAdmin() || !state.selectedOperator) return;

  const operatorData = state.allDados.filter((item) => item.email === state.selectedOperator);
  const filtro = $("detail-filter").value;
  const filtered = getFilteredListByPeriod(operatorData, filtro);
  const op = state.allOperadores.find((item) => item.email === state.selectedOperator);

  renderDetailMetric("hoje", getFilteredListByPeriod(operatorData, "hoje"));
  renderDetailMetric("semana", getFilteredListByPeriod(operatorData, "semana"));
  renderDetailMetric("mes", getFilteredListByPeriod(operatorData, "mes"));
  renderDetailMetric("total", getFilteredListByPeriod(operatorData, "todos"));

  const contasHoje = sumContas(getFilteredListByPeriod(operatorData, "hoje"));
  const contasSemana = sumContas(getFilteredListByPeriod(operatorData, "semana"));
  const contasMes = sumContas(getFilteredListByPeriod(operatorData, "mes"));

  const metaDia = Number(op?.meta_dia_contas || 0);
  const metaSemana = Number(op?.meta_semana_contas || 0);
  const metaMes = Number(op?.meta_mes_contas || 0);

  setDetailGoalCard("day", contasHoje, metaDia);
  setDetailGoalCard("week", contasSemana, metaSemana);
  setDetailGoalCard("month", contasMes, metaMes);

  $("meta-dia-input").value = metaDia;
  $("meta-semana-input").value = metaSemana;
  $("meta-mes-input").value = metaMes;

  const tbody = $("detail-table");
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Nenhum ciclo encontrado.</td></tr>`;
  } else {
    tbody.innerHTML = filtered.map((item) => {
      const bruto = Number(item.lucro || 0);
      const comissaoOperador = getOperatorResultado(bruto);
      const lucroEmpresa = bruto - comissaoOperador;
      const contas = Number(item.qtd_contas || 0);
      const dataTexto = item.data_registro
        ? parseDateOnly(item.data_registro)?.toLocaleDateString("pt-BR") || "-"
        : item.created_at
          ? new Date(item.created_at).toLocaleDateString("pt-BR")
          : "-";

      return `
        <tr class="border-b border-slate-900">
          <td class="py-4 pr-3 font-semibold">${item.email}</td>
          <td class="py-4 pr-3 ${bruto >= 0 ? "positive" : "negative"}">${formatCurrency(bruto)}</td>
          <td class="py-4 pr-3 ${comissaoOperador >= 0 ? "positive" : "negative"}">${formatCurrency(comissaoOperador)}</td>
          <td class="py-4 pr-3 ${lucroEmpresa >= 0 ? "positive" : "negative"}">${formatCurrency(lucroEmpresa)}</td>
          <td class="py-4 pr-3">${contas}</td>
          <td class="py-4 pr-3">${dataTexto}</td>
        </tr>
      `;
    }).join("");
  }

  const ctx = $("detailChartCanvas").getContext("2d");
  if (state.detailChart) state.detailChart.destroy();

  const agrupado = {};
  filtered.forEach((item) => {
    const chave = item.data_registro || item.created_at?.slice(0, 10) || "Sem data";
    agrupado[chave] = (agrupado[chave] || 0) + Number(item.qtd_contas || 0);
  });

  state.detailChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(agrupado),
      datasets: [{
        label: `Contas de ${state.selectedOperator}`,
        data: Object.values(agrupado),
        backgroundColor: "rgba(34, 197, 94, 0.72)",
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.08)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.08)" } }
      }
    }
  });
}

function renderDetailMetric(prefix, list) {
  const total = sumLucro(list);
  $(`detail-${prefix}`).textContent = formatCurrency(total);
  $(`detail-${prefix}-count`).textContent = `${list.length} registro${list.length === 1 ? "" : "s"}`;
}

async function editar(id) {
  if (!isAdmin()) return;

  const atual = state.dados.find((item) => item.id === id);
  const valor = prompt("Novo valor bruto:", atual ? String(atual.lucro ?? 0) : "");
  if (valor === null) return;

  const numero = Number(valor);
  if (Number.isNaN(numero)) return showToast("Digite um número válido.", "error");

  const { error } = await supabaseClient.from("ciclos").update({ lucro: numero }).eq("id", id);

  if (error) {
    console.error(error);
    return showToast("Erro ao editar registro.", "error");
  }

  await carregar();
  showToast("Registro editado com sucesso.");
}

async function excluir(id) {
  if (!isAdmin()) return;
  if (!confirm("Excluir este registro?")) return;

  const { error } = await supabaseClient.from("ciclos").delete().eq("id", id);

  if (error) {
    console.error(error);
    return showToast("Erro ao excluir registro.", "error");
  }

  await carregar();
  showToast("Registro excluído com sucesso.");
}

function exportarExcel() {
  if (!isAdmin()) return;

  const rows = state.dados.map((item) => {
    const bruto = Number(item.lucro || 0);
    const comissaoOperador = getOperatorResultado(bruto);
    const lucroEmpresa = bruto - comissaoOperador;
    const dataTexto = item.data_registro
      ? parseDateOnly(item.data_registro)?.toLocaleDateString("pt-BR") || ""
      : item.created_at
        ? new Date(item.created_at).toLocaleDateString("pt-BR")
        : "";

    return {
      Operador: item.email || "",
      ResultadoBruto: bruto,
      Comissao: comissaoOperador,
      Lucro: lucroEmpresa,
      Contas: Number(item.qtd_contas || 0),
      Data: dataTexto
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
  XLSX.writeFile(wb, "stark_cpa_relatorio.xlsx");
  showToast("Excel exportado com sucesso.");
}

function renderGrafico() {
  const ctx = $("graficoCanvas").getContext("2d");
  if (state.chart) state.chart.destroy();

  const grouped = {};
  state.dados.forEach((item) => {
    const email = item.email || "Sem operador";
    grouped[email] = (grouped[email] || 0) + Number(item.lucro || 0);
  });

  state.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(grouped),
      datasets: [{
        label: "Resultado bruto",
        data: Object.values(grouped),
        backgroundColor: "rgba(37, 99, 235, 0.72)",
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#cbd5e1" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.08)" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.08)" } }
      }
    }
  });
}

window.addEventListener("load", () => {
  ["entrada", "ajuste", "saida"].forEach((id) => $(id)?.addEventListener("input", updatePreview));
  restoreSession();
});

function renderFinanceCards() {
  if (!isAdmin()) {
    $("admin-finance-cards").classList.add("hidden");
    return;
  }

  let brutoTotal = 0;
  let comissaoTotal = 0;

  state.allDados.forEach(item => {
    const bruto = Number(item.lucro || 0);
    const comissao = getOperatorResultado(bruto);

    brutoTotal += bruto;
    comissaoTotal += comissao;
  });

  const lucroEmpresa = brutoTotal - comissaoTotal;

  $("metric-bruto-total").textContent = formatCurrency(brutoTotal);
  $("metric-comissao-total").textContent = formatCurrency(comissaoTotal);
  $("metric-lucro-empresa").textContent = formatCurrency(lucroEmpresa);

  $("admin-finance-cards").classList.remove("hidden");
}