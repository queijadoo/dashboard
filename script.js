const STORAGE_KEY = "dashboard_financeiro_registros";
const OPERATORS_STORAGE_KEY = "dashboard_financeiro_operadores";
const EXPENSES_STORAGE_KEY = "dashboard_financeiro_gastos";
const SAVINGS_STORAGE_KEY = "dashboard_financeiro_poupanca";
const GOALS_STORAGE_KEY = "dashboard_financeiro_metas";
const SETTINGS_STORAGE_KEY = "dashboard_financeiro_configuracoes";

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

const searchInput = document.getElementById("searchInput");
const periodFilter = document.getElementById("periodFilter");
const operatorForm = document.getElementById("operatorForm");
const operatorName = document.getElementById("operatorName");
const operatorMonth = document.getElementById("operatorMonth");
const operatorGross = document.getElementById("operatorGross");
const operatorNet = document.getElementById("operatorNet");
const operatorValue = document.getElementById("operatorValue");
const grossValue = document.getElementById("grossValue");
const grossCount = document.getElementById("grossCount");
const commissionValue = document.getElementById("commissionValue");
const profitValue = document.getElementById("profitValue");
const expensesOverviewValue = document.getElementById("expensesOverviewValue");
const recordsTableBody = document.getElementById("recordsTableBody");
const rankingList = document.getElementById("rankingList");

const operatorSearchInput = document.getElementById("operatorSearchInput");
const operatorMonthFilter = document.getElementById("operatorMonthFilter");
const operatorsTableBody = document.getElementById("operatorsTableBody");
const operatorsTotalCount = document.getElementById("operatorsTotalCount");
const operatorsGrossTotal = document.getElementById("operatorsGrossTotal");
const operatorsNetTotal = document.getElementById("operatorsNetTotal");
const operatorsCommissionTotal = document.getElementById("operatorsCommissionTotal");
const importOperatorsBtn = document.getElementById("importOperatorsBtn");
const importOperatorsInput = document.getElementById("importOperatorsInput");

const cyclesPeriodFilter = document.getElementById("cyclesPeriodFilter");
const cyclesCount = document.getElementById("cyclesCount");
const cyclesGross = document.getElementById("cyclesGross");
const cyclesCommission = document.getElementById("cyclesCommission");
const cyclesProfit = document.getElementById("cyclesProfit");
const cyclesTableBody = document.getElementById("cyclesTableBody");

const cycleForm = document.getElementById("cycleForm");
const cycleId = document.getElementById("cycleId");
const cycleOperator = document.getElementById("cycleOperator");
const cycleAccounts = document.getElementById("cycleAccounts");
const cycleBau = document.getElementById("cycleBau");
const cycleDeposit = document.getElementById("cycleDeposit");
const cycleWithdraw = document.getElementById("cycleWithdraw");
const cycleCommission = document.getElementById("cycleCommission");
const cycleDate = document.getElementById("cycleDate");
const cycleSubmitBtn = document.getElementById("cycleSubmitBtn");
const cancelCycleEditBtn = document.getElementById("cancelCycleEditBtn");

const expenseSearchInput = document.getElementById("expenseSearchInput");
const expensesPeriodFilter = document.getElementById("expensesPeriodFilter");
const expensesTotalValue = document.getElementById("expensesTotalValue");
const expensesCountLabel = document.getElementById("expensesCountLabel");
const expensesTopCategory = document.getElementById("expensesTopCategory");
const expensesAverageValue = document.getElementById("expensesAverageValue");
const expensesNetResult = document.getElementById("expensesNetResult");
const expensesTableBody = document.getElementById("expensesTableBody");
const importExpensesBtn = document.getElementById("importExpensesBtn");
const importExpensesInput = document.getElementById("importExpensesInput");

const expenseForm = document.getElementById("expenseForm");
const expenseId = document.getElementById("expenseId");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDescription = document.getElementById("expenseDescription");
const expenseValue = document.getElementById("expenseValue");
const expenseDate = document.getElementById("expenseDate");
const expenseSubmitBtn = document.getElementById("expenseSubmitBtn");
const cancelExpenseEditBtn = document.getElementById("cancelExpenseEditBtn");

const savingsSearchInput = document.getElementById("savingsSearchInput");
const savingsTypeFilter = document.getElementById("savingsTypeFilter");
const savingsBalanceValue = document.getElementById("savingsBalanceValue");
const savingsDepositsValue = document.getElementById("savingsDepositsValue");
const savingsWithdrawalsValue = document.getElementById("savingsWithdrawalsValue");
const savingsCountValue = document.getElementById("savingsCountValue");
const savingsTableBody = document.getElementById("savingsTableBody");

const savingsForm = document.getElementById("savingsForm");
const savingsId = document.getElementById("savingsId");
const savingsType = document.getElementById("savingsType");
const savingsValue = document.getElementById("savingsValue");
const savingsDescription = document.getElementById("savingsDescription");
const savingsDate = document.getElementById("savingsDate");
const savingsSubmitBtn = document.getElementById("savingsSubmitBtn");
const cancelSavingsEditBtn = document.getElementById("cancelSavingsEditBtn");

const goalsForm = document.getElementById("goalsForm");
const dailyGoalInput = document.getElementById("dailyGoalInput");
const weeklyGoalInput = document.getElementById("weeklyGoalInput");
const monthlyGoalInput = document.getElementById("monthlyGoalInput");

const fullRankingList = document.getElementById("fullRankingList");

const settingsForm = document.getElementById("settingsForm");
const themeSelect = document.getElementById("themeSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const paletteSelect = document.getElementById("paletteSelect");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");

let records = loadRecords();
let operators = hydrateOperators(loadOperators());
let expenses = loadExpenses();
let savings = loadSavings();
let goals = loadGoals();
let settings = loadSettings();
let performanceChart = null;
let expensePicker = null;
let cyclePicker = null;
let savingsPicker = null;

/* =========================
   TOASTS MODERNOS
========================= */

function getToastContainer() {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  return container;
}

function showToast(title, message = "", type = "info", duration = 2600) {
  const container = getToastContainer();

  const iconMap = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i",
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type] || "i"}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmModalCancel = document.getElementById("confirmModalCancel");
const confirmModalConfirm = document.getElementById("confirmModalConfirm");

/* =========================
   STORAGE
========================= */

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadOperators() {
  try {
    const saved = localStorage.getItem(OPERATORS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadExpenses() {
  try {
    const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadSavings() {
  try {
    const saved = localStorage.getItem(SAVINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function loadGoals() {
  try {
    const saved = localStorage.getItem(GOALS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { daily: 0, weekly: 0, monthly: 0 };
  } catch {
    return { daily: 0, weekly: 0, monthly: 0 };
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { theme: "dark", fontSize: "medium", palette: "blue" };
  } catch {
    return { theme: "dark", fontSize: "medium", palette: "blue" };
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function saveOperators() {
  localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
}

function saveExpenses() {
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
}

function saveSavings() {
  localStorage.setItem(SAVINGS_STORAGE_KEY, JSON.stringify(savings));
}

function saveGoals() {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

/* =========================
   HELPERS
========================= */

function hydrateOperators(list) {
  return (Array.isArray(list) ? list : []).map((item) => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "").trim(),
    month: String(item.month || "").trim(),
    gross: Number(item.gross || 0),
    net: Number(item.net || 0),
    operatorValue: Number(item.operatorValue || 0),
    createdAt: item.createdAt || new Date().toISOString(),
  }));
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";

  return (
    date.toLocaleDateString("pt-BR") +
    " " +
    date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function formatDateOnly(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  return date.toLocaleDateString("pt-BR");
}

function toDateInputValue(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function toFlatpickrDateTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseCycleDate(value) {
  if (!value) return null;

  const text = String(value).trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    const [day, month, year] = text.split("/");
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  }

  if (/^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}$/.test(text)) {
    const [datePart, timePart] = text.split(" ");
    const [day, month, year] = datePart.split("/");
    const date = new Date(`${year}-${month}-${day}T${timePart}:00`);
    return isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return isNaN(date.getTime()) ? null : date;
}

function parseFlexibleNumber(value) {
  if (typeof value === "number") return value;
  if (value === null || value === undefined) return 0;

  let text = String(value).trim();
  if (!text) return 0;

  text = text.replace(/R\$/gi, "").replace(/\s/g, "");

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    text = text.replace(",", ".");
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
}

function calculateCycleProfit(record) {
  const deposit = Number(record.deposit || 0);
  const bau = Number(record.bau || 0);
  const withdraw = Number(record.withdraw || 0);
  return deposit + bau - withdraw;
}

function calculateCycleNetProfit(record) {
  const grossProfit = calculateCycleProfit(record);
  const commission = Number(record.commission || 0);
  return grossProfit - commission;
}

function calculateUnifiedProfit(record) {
  if (record.source === "operator") {
    return Number(record.profit || 0);
  }

  return calculateCycleNetProfit(record);
}

function calculateUnifiedGross(record) {
  if (record.source === "operator") return Number(record.gross || 0);
  return Number(record.withdraw || 0) + Number(record.bau || 0);
}

function calculateUnifiedCommission(record) {
  return Number(record.commission || 0);
}

function checkPeriod(dateString, period) {
  if (period === "todos") return true;

  const recordDate = new Date(dateString);
  const now = new Date();

  if (isNaN(recordDate.getTime())) return false;

  if (period === "hoje") {
    return (
      recordDate.getDate() === now.getDate() &&
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  }

  if (period === "semana") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return recordDate >= startOfWeek;
  }

  if (period === "mes") {
    return (
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  }

  return true;
}

/* =========================
   OVERVIEW
========================= */

function operatorToOverviewRecord(operator) {
  return {
    id: `operator-${operator.id}`,
    source: "operator",
    operator: operator.name || "—",
    gross: Number(operator.gross || 0),
    commission: Number(operator.operatorValue || 0),
    profit: Number(operator.net || 0),
    accounts: 0,
    createdAt: operator.createdAt || new Date().toISOString(),
  };
}

function cycleToOverviewRecord(cycle) {
  return {
    id: cycle.id,
    source: "cycle",
    operator: cycle.operator || "—",
    deposit: Number(cycle.deposit || 0),
    bau: Number(cycle.bau || 0),
    withdraw: Number(cycle.withdraw || 0),
    commission: Number(cycle.commission || 0),
    accounts: Number(cycle.accounts || 0),
    createdAt: cycle.createdAt || new Date().toISOString(),
  };
}

function getOverviewBaseRecords() {
  return [
    ...operators.map(operatorToOverviewRecord),
    ...records.map(cycleToOverviewRecord),
  ];
}

function getFilteredRecords() {
  const search = searchInput.value.trim().toLowerCase();
  const period = periodFilter.value;

  return getOverviewBaseRecords().filter((record) => {
    const matchesSearch = (record.operator || "").toLowerCase().includes(search);
    const matchesPeriod = checkPeriod(record.createdAt, period);
    return matchesSearch && matchesPeriod;
  });
}

function renderSummary() {
  const filtered = getFilteredRecords();

  const totalGross = filtered.reduce((sum, record) => sum + calculateUnifiedGross(record), 0);
  const totalCommission = filtered.reduce((sum, record) => sum + calculateUnifiedCommission(record), 0);
  const totalProfitBeforeExpenses = filtered.reduce((sum, record) => sum + calculateUnifiedProfit(record), 0);
  const periodExpenses = getTotalExpensesForPeriod(periodFilter.value);
  const totalProfit = totalProfitBeforeExpenses - periodExpenses;

  if (grossValue) grossValue.textContent = formatCurrency(totalGross);
  if (grossCount) grossCount.textContent = `${filtered.length} registro(s)`;
  if (commissionValue) commissionValue.textContent = formatCurrency(totalCommission);
  if (expensesOverviewValue) expensesOverviewValue.textContent = formatCurrency(periodExpenses);
  if (profitValue) {
    profitValue.textContent = formatCurrency(totalProfit);
    profitValue.style.color = totalProfit >= 0 ? "#22c55e" : "#ef4444";
  }
}

function renderTable() {
  const filtered = getFilteredRecords();

  if (!recordsTableBody) return;

  if (!filtered.length) {
    recordsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">Nenhum registro encontrado.</td>
      </tr>
    `;
    return;
  }

  recordsTableBody.innerHTML = filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((record) => {
      const gross = calculateUnifiedGross(record);
      const commission = calculateUnifiedCommission(record);
      const profit = calculateUnifiedProfit(record);

      return `
        <tr>
          <td>${record.source === "operator" ? "Operador" : "Ciclo"}</td>
          <td>${record.operator || "—"}</td>
          <td>${formatCurrency(gross)}</td>
          <td>${formatCurrency(commission)}</td>
          <td class="${profit >= 0 ? "profit-positive" : "profit-negative"}">${formatCurrency(profit)}</td>
          <td>${record.accounts || 0}</td>
          <td>${formatDate(record.createdAt)}</td>
        </tr>
      `;
    })
    .join("");
}

function buildRankingData(baseRecords) {
  const grouped = {};

  baseRecords.forEach((record) => {
    const operator = record.operator || "Sem nome";

    if (!grouped[operator]) {
      grouped[operator] = {
        operator,
        gross: 0,
        profit: 0,
        accounts: 0,
      };
    }

    grouped[operator].gross += calculateUnifiedGross(record);
    grouped[operator].profit += calculateUnifiedProfit(record);
    grouped[operator].accounts += Number(record.accounts || 0);
  });

  return Object.values(grouped).sort((a, b) => b.profit - a.profit);
}

function renderRanking() {
  if (!rankingList) return;

  const ranking = buildRankingData(getFilteredRecords());

  if (!ranking.length) {
    rankingList.innerHTML = `<p class="empty-side">Nenhum dado no ranking.</p>`;
    return;
  }

  rankingList.innerHTML = ranking
    .slice(0, 5)
    .map(
      (item, index) => `
        <div class="ranking-item">
          <div class="ranking-left">
            <strong>#${index + 1} ${item.operator}</strong>
            <span>Bruto: ${formatCurrency(item.gross)} • Contas: ${item.accounts}</span>
          </div>
          <div class="ranking-profit">${formatCurrency(item.profit)} lucro</div>
        </div>
      `
    )
    .join("");
}

function renderFullRanking() {
  if (!fullRankingList) return;

  const ranking = buildRankingData(getOverviewBaseRecords());

  if (!ranking.length) {
    fullRankingList.innerHTML = `<p class="empty-side">Nenhum dado disponível.</p>`;
    return;
  }

  fullRankingList.innerHTML = ranking
    .map(
      (item, index) => `
        <div class="ranking-item">
          <div class="ranking-left">
            <strong>#${index + 1} ${item.operator}</strong>
            <span>Bruto: ${formatCurrency(item.gross)} • Contas: ${item.accounts}</span>
          </div>
          <div class="ranking-profit">${formatCurrency(item.profit)} lucro</div>
        </div>
      `
    )
    .join("");
}

function renderChart() {
  const canvas = document.getElementById("performanceChart");
  if (!canvas || typeof Chart === "undefined") return;

  const filtered = getFilteredRecords();
  const grouped = {};

  filtered.forEach((record) => {
    const operator = record.operator || "Sem nome";
    if (!grouped[operator]) grouped[operator] = 0;
    grouped[operator] += calculateUnifiedGross(record);
  });

  if (performanceChart) {
    performanceChart.destroy();
    performanceChart = null;
  }

  const textColor = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#8ea0bf";
  const legendColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#e5eefc";

  performanceChart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Resultado bruto",
          data: Object.values(grouped),
          borderRadius: 10,
          backgroundColor: "rgba(59,130,246,0.75)",
          borderColor: "rgba(59,130,246,1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: legendColor,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: {
            color: textColor,
            callback: (value) => formatCurrency(value),
          },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
    },
  });
}

/* =========================
   OPERATORS
========================= */

function normalizeMonth(value) {
  return (value || "").toString().trim().toLowerCase();
}

function getFilteredOperators() {
  const search = operatorSearchInput.value.trim().toLowerCase();
  const month = normalizeMonth(operatorMonthFilter.value);

  return operators.filter((operator) => {
    const matchesSearch = (operator.name || "").toLowerCase().includes(search);
    const matchesMonth = month === "todos" ? true : normalizeMonth(operator.month) === month;
    return matchesSearch && matchesMonth;
  });
}

function renderOperatorsSummary() {
  const filtered = getFilteredOperators();

  if (operatorsTotalCount) operatorsTotalCount.textContent = filtered.length;
  if (operatorsGrossTotal) {
    operatorsGrossTotal.textContent = formatCurrency(
      filtered.reduce((sum, item) => sum + Number(item.gross || 0), 0)
    );
  }
  if (operatorsNetTotal) {
    operatorsNetTotal.textContent = formatCurrency(
      filtered.reduce((sum, item) => sum + Number(item.net || 0), 0)
    );
  }
  if (operatorsCommissionTotal) {
    operatorsCommissionTotal.textContent = formatCurrency(
      filtered.reduce((sum, item) => sum + Number(item.operatorValue || 0), 0)
    );
  }
}

function renderOperatorsTable() {
  if (!operatorsTableBody) return;

  const filtered = getFilteredOperators();

  if (!filtered.length) {
    operatorsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Nenhum operador encontrado.</td>
      </tr>
    `;
    return;
  }

  operatorsTableBody.innerHTML = filtered
    .slice()
    .reverse()
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.month}</td>
          <td>${formatCurrency(item.gross)}</td>
          <td class="profit-positive">${formatCurrency(item.net)}</td>
          <td>${formatCurrency(item.operatorValue)}</td>
          <td>
            <div class="actions-cell">
              <button class="btn btn-delete" onclick="deleteOperator('${item.id}')">Remover</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderOperatorsPage() {
  renderOperatorsSummary();
  renderOperatorsTable();
}

/* =========================
   CYCLES
========================= */

function getFilteredCycles() {
  return records.filter((record) => checkPeriod(record.createdAt, cyclesPeriodFilter.value));
}

function renderCyclesPage() {
  if (!cyclesTableBody) return;

  const filtered = getFilteredCycles();

  const totalGross = filtered.reduce(
    (sum, record) => sum + Number(record.withdraw || 0) + Number(record.bau || 0),
    0
  );

  const totalCommission = filtered.reduce(
    (sum, record) => sum + Number(record.commission || 0),
    0
  );

  const totalProfit = filtered.reduce(
    (sum, record) => sum + calculateCycleNetProfit(record),
    0
  );

  if (cyclesCount) cyclesCount.textContent = filtered.length;
  if (cyclesGross) cyclesGross.textContent = formatCurrency(totalGross);
  if (cyclesCommission) cyclesCommission.textContent = formatCurrency(totalCommission);
  if (cyclesProfit) {
    cyclesProfit.textContent = formatCurrency(totalProfit);
    cyclesProfit.style.color = totalProfit >= 0 ? "#22c55e" : "#ef4444";
  }

  if (!filtered.length) {
    cyclesTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">Nenhum ciclo encontrado.</td>
      </tr>
    `;
    return;
  }

  cyclesTableBody.innerHTML = filtered
    .slice()
    .reverse()
    .map((record) => {
      const profit = calculateCycleNetProfit(record);

      return `
        <tr>
          <td>${record.operator || "—"}</td>
          <td>${formatCurrency(record.deposit || 0)}</td>
          <td>${formatCurrency(record.bau || 0)}</td>
          <td>${formatCurrency(record.withdraw || 0)}</td>
          <td>${formatCurrency(record.commission || 0)}</td>
          <td>${record.accounts || 0}</td>
          <td class="${profit >= 0 ? "profit-positive" : "profit-negative"}">${formatCurrency(profit)}</td>
          <td>${formatDate(record.createdAt)}</td>
          <td>
            <div class="actions-cell">
              <button class="btn btn-edit" onclick="editCycle('${record.id}')">Editar</button>
              <button class="btn btn-delete" onclick="deleteCycle('${record.id}')">Remover</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function updateCycleBauAutomatically() {
  const accounts = Number(cycleAccounts?.value || 0);
  const totalBau = accounts * 10;
  if (cycleBau) cycleBau.value = totalBau > 0 ? totalBau.toFixed(2) : "";
  updateCycleCommissionAutomatically();
}

function updateCycleCommissionAutomatically() {
  const deposit = Number(cycleDeposit?.value || 0);
  const bau = Number(cycleBau?.value || 0);
  const withdraw = Number(cycleWithdraw?.value || 0);
  const profit = deposit + bau - withdraw;
  const commissionAmount = profit > 0 ? profit * 0.3 : 0;
  if (cycleCommission) cycleCommission.value = commissionAmount > 0 ? commissionAmount.toFixed(2) : "";
}

function resetCycleForm() {
  if (!cycleForm) return;
  cycleForm.reset();
  cycleId.value = "";
  cycleSubmitBtn.textContent = "Salvar ciclo";
  cancelCycleEditBtn.classList.remove("btn-visible");
  cancelCycleEditBtn.classList.add("btn-hidden");
  if (cyclePicker) cyclePicker.clear();
  updateCycleBauAutomatically();
}

function startCycleEdit(record) {
  cycleId.value = record.id;
  cycleOperator.value = record.operator || "";
  cycleAccounts.value = record.accounts || 0;
  cycleDeposit.value = record.deposit || 0;
  cycleWithdraw.value = record.withdraw || 0;
  cycleDate.value = toFlatpickrDateTime(record.createdAt);

  updateCycleBauAutomatically();

  if (cyclePicker) {
    cyclePicker.setDate(record.createdAt, true, "d/m/Y H:i");
  }

  cycleSubmitBtn.textContent = "Atualizar ciclo";
  cancelCycleEditBtn.classList.remove("btn-hidden");
  cancelCycleEditBtn.classList.add("btn-visible");

  showPage("cycles");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   EXPENSES
========================= */

function getFilteredExpenses() {
  const search = expenseSearchInput.value.trim().toLowerCase();
  const period = expensesPeriodFilter.value;

  return expenses.filter((expense) => {
    const matchesSearch =
      (expense.category || "").toLowerCase().includes(search) ||
      (expense.description || "").toLowerCase().includes(search);

    const matchesPeriod = checkPeriod(expense.date, period);
    return matchesSearch && matchesPeriod;
  });
}

function getTotalExpensesForPeriod(period) {
  return expenses
    .filter((expense) => checkPeriod(expense.date, period))
    .reduce((sum, expense) => sum + Number(expense.value || 0), 0);
}

function renderExpensesPage() {
  if (!expensesTableBody) return;

  const filtered = getFilteredExpenses();
  const totalExpenses = filtered.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const averageExpenses = filtered.length ? totalExpenses / filtered.length : 0;

  const categoriesMap = {};
  filtered.forEach((item) => {
    const category = item.category || "Sem categoria";
    categoriesMap[category] = (categoriesMap[category] || 0) + Number(item.value || 0);
  });

  const topCategoryEntry = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry ? topCategoryEntry[0] : "—";

  const operationalProfit = getOverviewBaseRecords().reduce(
    (sum, record) => sum + calculateUnifiedProfit(record),
    0
  );
  const netAfterExpenses = operationalProfit - totalExpenses;

  if (expensesTotalValue) expensesTotalValue.textContent = formatCurrency(totalExpenses);
  if (expensesCountLabel) expensesCountLabel.textContent = `${filtered.length} gasto(s)`;
  if (expensesTopCategory) expensesTopCategory.textContent = topCategory;
  if (expensesAverageValue) expensesAverageValue.textContent = formatCurrency(averageExpenses);
  if (expensesNetResult) {
    expensesNetResult.textContent = formatCurrency(netAfterExpenses);
    expensesNetResult.style.color = netAfterExpenses >= 0 ? "#22c55e" : "#ef4444";
  }

  if (!filtered.length) {
    expensesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Nenhum gasto encontrado.</td>
      </tr>
    `;
    return;
  }

  expensesTableBody.innerHTML = filtered
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (expense) => `
        <tr>
          <td>${expense.category || "Sem categoria"}</td>
          <td>${expense.description || "—"}</td>
          <td class="profit-negative">${formatCurrency(expense.value)}</td>
          <td>${formatDateOnly(expense.date)}</td>
          <td>
            <div class="actions-cell">
              <button class="btn btn-edit" onclick="editExpense('${expense.id}')">Editar</button>
              <button class="btn btn-delete" onclick="deleteExpense('${expense.id}')">Remover</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function resetExpenseForm() {
  if (!expenseForm) return;
  expenseForm.reset();
  expenseId.value = "";
  expenseSubmitBtn.textContent = "Salvar gasto";
  cancelExpenseEditBtn.classList.remove("btn-visible");
  cancelExpenseEditBtn.classList.add("btn-hidden");
  if (expensePicker) expensePicker.clear();
}

function startExpenseEdit(expense) {
  expenseId.value = expense.id;
  expenseCategory.value = expense.category || "";
  expenseDescription.value = expense.description || "";
  expenseValue.value = expense.value || "";
  expenseDate.value = toDateInputValue(expense.date);
  expenseSubmitBtn.textContent = "Atualizar gasto";
  cancelExpenseEditBtn.classList.remove("btn-hidden");
  cancelExpenseEditBtn.classList.add("btn-visible");

  if (expensePicker) {
    expensePicker.setDate(expense.date, true, "d/m/Y");
  }

  showPage("expenses");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   SAVINGS
========================= */

function getFilteredSavings() {
  const search = savingsSearchInput.value.trim().toLowerCase();
  const type = savingsTypeFilter.value;

  return savings.filter((item) => {
    const matchesSearch = (item.description || "").toLowerCase().includes(search);
    const matchesType = type === "todos" ? true : item.type === type;
    return matchesSearch && matchesType;
  });
}

function renderSavingsPage() {
  if (!savingsTableBody) return;

  const filtered = getFilteredSavings();

  const totalDeposits = savings
    .filter((item) => item.type === "deposito")
    .reduce((sum, item) => sum + Number(item.value || 0), 0);

  const totalWithdrawals = savings
    .filter((item) => item.type === "saque")
    .reduce((sum, item) => sum + Number(item.value || 0), 0);

  const balance = totalDeposits - totalWithdrawals;

  if (savingsBalanceValue) savingsBalanceValue.textContent = formatCurrency(balance);
  if (savingsDepositsValue) savingsDepositsValue.textContent = formatCurrency(totalDeposits);
  if (savingsWithdrawalsValue) savingsWithdrawalsValue.textContent = formatCurrency(totalWithdrawals);
  if (savingsCountValue) savingsCountValue.textContent = savings.length;

  if (!filtered.length) {
    savingsTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Nenhuma movimentação encontrada.</td>
      </tr>
    `;
    return;
  }

  savingsTableBody.innerHTML = filtered
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (item) => `
        <tr>
          <td>${item.type === "deposito" ? "Depósito" : "Saque"}</td>
          <td>${item.description || "—"}</td>
          <td class="${item.type === "deposito" ? "profit-positive" : "profit-negative"}">${formatCurrency(item.value)}</td>
          <td>${formatDateOnly(item.date)}</td>
          <td>
            <div class="actions-cell">
              <button class="btn btn-edit" onclick="editSavings('${item.id}')">Editar</button>
              <button class="btn btn-delete" onclick="deleteSavings('${item.id}')">Remover</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function resetSavingsForm() {
  if (!savingsForm) return;
  savingsForm.reset();
  savingsId.value = "";
  savingsSubmitBtn.textContent = "Salvar movimentação";
  cancelSavingsEditBtn.classList.remove("btn-visible");
  cancelSavingsEditBtn.classList.add("btn-hidden");
  if (savingsPicker) savingsPicker.clear();
}

function startSavingsEdit(item) {
  savingsId.value = item.id;
  savingsType.value = item.type || "";
  savingsValue.value = item.value || "";
  savingsDescription.value = item.description || "";
  savingsDate.value = toDateInputValue(item.date);
  savingsSubmitBtn.textContent = "Atualizar movimentação";
  cancelSavingsEditBtn.classList.remove("btn-hidden");
  cancelSavingsEditBtn.classList.add("btn-visible");

  if (savingsPicker) {
    savingsPicker.setDate(item.date, true, "d/m/Y");
  }

  showPage("savings");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   GOALS
========================= */

function populateGoalsForm() {
  if (dailyGoalInput) dailyGoalInput.value = goals.daily ?? "";
  if (weeklyGoalInput) weeklyGoalInput.value = goals.weekly ?? "";
  if (monthlyGoalInput) monthlyGoalInput.value = goals.monthly ?? "";
}

function getProfitByPeriod(period) {
  return getOverviewBaseRecords()
    .filter((record) => checkPeriod(record.createdAt, period))
    .reduce((sum, record) => sum + calculateUnifiedProfit(record), 0);
}

function updateGoalUI(type, current, goal, prefix = "") {
  const valueEl = document.getElementById(`${prefix}${type}GoalValue`);
  const progressEl = document.getElementById(`${prefix}${type}GoalProgress`);
  const remainingEl = document.getElementById(`${prefix}${type}GoalRemaining`);
  const barEl = document.getElementById(`${prefix}${type}GoalBar`);

  if (!valueEl || !progressEl || !remainingEl || !barEl) return;

  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);

  valueEl.textContent = formatCurrency(goal);
  progressEl.textContent =
    goal > 0
      ? `Lucro realizado: ${formatCurrency(current)} • ${percent.toFixed(1)}% atingido`
      : "Defina uma meta";

  remainingEl.textContent =
    goal > 0 ? `Faltam ${formatCurrency(remaining)}` : "Nenhuma meta cadastrada";

  barEl.style.width = `${percent}%`;
}

function renderOverviewGoals() {
  const dailyProfit = getProfitByPeriod("hoje");
  const weeklyProfit = getProfitByPeriod("semana");
  const monthlyProfit = getProfitByPeriod("mes");

  updateGoalUI("Daily", dailyProfit, Number(goals.daily || 0), "overview");
  updateGoalUI("Weekly", weeklyProfit, Number(goals.weekly || 0), "overview");
  updateGoalUI("Monthly", monthlyProfit, Number(goals.monthly || 0), "overview");
}

function renderGoals() {
  const dailyProfit = getProfitByPeriod("hoje");
  const weeklyProfit = getProfitByPeriod("semana");
  const monthlyProfit = getProfitByPeriod("mes");

  updateGoalUI("daily", dailyProfit, Number(goals.daily || 0), "");
  updateGoalUI("weekly", weeklyProfit, Number(goals.weekly || 0), "");
  updateGoalUI("monthly", monthlyProfit, Number(goals.monthly || 0), "");

  renderOverviewGoals();
}

/* =========================
   SETTINGS
========================= */

function applySettings() {
  const root = document.documentElement;

  root.setAttribute("data-theme", settings.theme || "dark");
  root.setAttribute("data-palette", settings.palette || "blue");

  const fontScaleMap = {
    small: "0.92",
    medium: "1",
    large: "1.08",
  };

  root.style.setProperty("--font-scale", fontScaleMap[settings.fontSize] || "1");

  if (themeSelect) themeSelect.value = settings.theme || "dark";
  if (fontSizeSelect) fontSizeSelect.value = settings.fontSize || "medium";
  if (paletteSelect) paletteSelect.value = settings.palette || "blue";
}

function resetSettings() {
  settings = {
    theme: "dark",
    fontSize: "medium",
    palette: "blue",
  };
  saveSettings();
  applySettings();
  renderChart();
}

/* =========================
   IMPORTS
========================= */

function normalizeImportedOperator(item) {
  return {
    id: item.id || crypto.randomUUID(),
    name: String(item.name || item.nome || "").trim(),
    month: String(item.month || item.mes || "").trim(),
    gross: parseFlexibleNumber(item.gross ?? item.bruto ?? 0),
    net: parseFlexibleNumber(item.net ?? item.liquido ?? item["valor liquido"] ?? 0),
    operatorValue: parseFlexibleNumber(
      item.operatorValue ?? item.valorOperador ?? item["valor operador"] ?? item.comissao ?? 0
    ),
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function normalizeImportedExpense(item) {
  const rawDate = item.date || item.data || "";
  const parsedDate = parseCycleDate(rawDate) || new Date();

  return {
    id: item.id || crypto.randomUUID(),
    category: String(item.category || item.categoria || "").trim(),
    description: String(item.description || item.descricao || "").trim(),
    value: parseFlexibleNumber(item.value ?? item.valor ?? 0),
    date: parsedDate.toISOString(),
  };
}

function validateImportedOperators(list) {
  if (!Array.isArray(list) || !list.length) {
    showToast("Importação inválida", "Nenhum dado válido encontrado no arquivo.", "error");
    return false;
  }

  const hasInvalidItem = list.some((item) => !item.name || !item.month);

  if (hasInvalidItem) {
    showToast("Importação inválida", "Alguns registros estão sem nome ou mês.", "error");
    return false;
  }

  return true;
}

function validateImportedExpenses(list) {
  if (!Array.isArray(list) || !list.length) {
    showToast("Importação inválida", "Nenhum gasto válido encontrado no arquivo.", "error");
    return false;
  }

  const hasInvalidItem = list.some((item) => !item.category || Number(item.value || 0) <= 0);

  if (hasInvalidItem) {
    showToast("Importação inválida", "Alguns gastos estão sem categoria ou com valor inválido.", "error");
    return false;
  }

  return true;
}

function finishOperatorsImport(importedOperators) {
  operators = hydrateOperators(importedOperators);
  saveOperators();
  renderAll();
  showToast("Operadores importados", "Os dados foram carregados com sucesso.", "success");
}

function finishExpensesImport(importedExpenses) {
  expenses = importedExpenses;
  saveExpenses();
  renderAll();
  showToast("Gastos importados", "Os dados foram carregados com sucesso.", "success");
}

function importOperatorsFromJSON(text) {
  try {
    const rawData = JSON.parse(text);
    if (!Array.isArray(rawData)) {
      showToast("JSON inválido", "O arquivo precisa conter uma lista de operadores.", "error");
      return;
    }

    const importedOperators = rawData.map(normalizeImportedOperator);
    if (!validateImportedOperators(importedOperators)) return;

    finishOperatorsImport(importedOperators);
  } catch {
    showToast("JSON inválido", "Verifique o arquivo enviado.", "error");
  }
}

function importExpensesFromJSON(text) {
  try {
    const rawData = JSON.parse(text);
    if (!Array.isArray(rawData)) {
      showToast("JSON inválido", "O arquivo precisa conter uma lista de gastos.", "error");
      return;
    }

    const importedExpenses = rawData.map(normalizeImportedExpense);
    if (!validateImportedExpenses(importedExpenses)) return;

    finishExpensesImport(importedExpenses);
  } catch {
    showToast("JSON inválido", "Verifique o arquivo enviado.", "error");
  }
}

function importOperatorsFromTXT(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (!lines.length) {
    showToast("TXT vazio", "O arquivo não possui conteúdo.", "error");
    return;
  }

  const importedOperators = lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length < 5) throw new Error(`Linha ${index + 1} inválida`);

    return normalizeImportedOperator({
      name: parts[0],
      month: parts[1],
      gross: parts[2],
      net: parts[3],
      operatorValue: parts[4],
    });
  });

  if (!validateImportedOperators(importedOperators)) return;
  finishOperatorsImport(importedOperators);
}

function importExpensesFromTXT(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (!lines.length) {
    showToast("TXT vazio", "O arquivo não possui conteúdo.", "error");
    return;
  }

  const importedExpenses = lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length < 4) throw new Error(`Linha ${index + 1} inválida`);

    return normalizeImportedExpense({
      category: parts[0],
      description: parts[1],
      value: parts[2],
      date: parts[3],
    });
  });

  if (!validateImportedExpenses(importedExpenses)) return;
  finishExpensesImport(importedExpenses);
}

function importOperatorsFromExcel(arrayBuffer) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      showToast("Planilha inválida", "A planilha não possui abas.", "error");
      return;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rows.length) {
      showToast("Planilha vazia", "Não há dados para importar.", "error");
      return;
    }

    const importedOperators = rows.map(normalizeImportedOperator);
    if (!validateImportedOperators(importedOperators)) return;

    finishOperatorsImport(importedOperators);
  } catch {
    showToast("Erro ao importar", "Não foi possível ler a planilha Excel.", "error");
  }
}

function importExpensesFromExcel(arrayBuffer) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      showToast("Planilha inválida", "A planilha não possui abas.", "error");
      return;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rows.length) {
      showToast("Planilha vazia", "Não há dados para importar.", "error");
      return;
    }

    const importedExpenses = rows.map(normalizeImportedExpense);
    if (!validateImportedExpenses(importedExpenses)) return;

    finishExpensesImport(importedExpenses);
  } catch {
    showToast("Erro ao importar", "Não foi possível ler a planilha Excel.", "error");
  }
}

function importOperatorsFromFile(file) {
  if (!file) return;
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".json")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importOperatorsFromJSON(event.target.result);
      } finally {
        importOperatorsInput.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
    return;
  }

  if (fileName.endsWith(".txt")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importOperatorsFromTXT(event.target.result);
      } catch {
        showToast("TXT inválido", "Use o formato: Nome|Mês|Bruto|Líquido|ValorOperador", "error");
      } finally {
        importOperatorsInput.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
    return;
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importOperatorsFromExcel(event.target.result);
      } finally {
        importOperatorsInput.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
    return;
  }

  showToast("Formato não suportado", "Use JSON, TXT, XLSX ou XLS.", "error");
  importOperatorsInput.value = "";
}

function importExpensesFromFile(file) {
  if (!file) return;
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".json")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importExpensesFromJSON(event.target.result);
      } finally {
        importExpensesInput.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
    return;
  }

  if (fileName.endsWith(".txt")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importExpensesFromTXT(event.target.result);
      } catch {
        showToast("TXT inválido", "Use o formato: Categoria|Descrição|Valor|Data", "error");
      } finally {
        importExpensesInput.value = "";
      }
    };
    reader.readAsText(file, "utf-8");
    return;
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importExpensesFromExcel(event.target.result);
      } finally {
        importExpensesInput.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
    return;
  }

  showToast("Formato não suportado", "Use JSON, TXT, XLSX ou XLS.", "error");
  importExpensesInput.value = "";
}

/* =========================
   GLOBAL RENDER
========================= */

function renderAll() {
  renderSummary();
  renderTable();
  renderRanking();
  renderChart();
  renderOperatorsPage();
  renderCyclesPage();
  renderExpensesPage();
  renderSavingsPage();
  renderFullRanking();
  renderGoals();
  renderOverviewGoals();
}

function showPage(pageName) {
  pages.forEach((page) => page.classList.remove("active"));
  menuItems.forEach((item) => item.classList.remove("active"));

  const targetPage = document.getElementById(`page-${pageName}`);
  const targetMenu = document.querySelector(`.menu-item[data-page="${pageName}"]`);

  if (targetPage) targetPage.classList.add("active");
  if (targetMenu) targetMenu.classList.add("active");
}

/* =========================
   ACTIONS
========================= */

function editExpense(id) {
  const expense = expenses.find((item) => item.id === id);
  if (!expense) return;
  startExpenseEdit(expense);
}

function deleteExpense(id) {
  if (!askConfirm("Tem certeza que deseja remover este gasto?")) return;
  expenses = expenses.filter((item) => item.id !== id);
  saveExpenses();
  resetExpenseForm();
  renderAll();
  showToast("Gasto removido", "O registro foi excluído com sucesso.", "success");
}

function editSavings(id) {
  const item = savings.find((entry) => entry.id === id);
  if (!item) return;
  startSavingsEdit(item);
}

function deleteSavings(id) {
  if (!askConfirm("Tem certeza que deseja remover esta movimentação?")) return;
  savings = savings.filter((item) => item.id !== id);
  saveSavings();
  resetSavingsForm();
  renderAll();
  showToast("Movimentação removida", "O registro foi excluído com sucesso.", "success");
}

function editCycle(id) {
  const record = records.find((item) => item.id === id);
  if (!record) return;
  startCycleEdit(record);
}

function deleteCycle(id) {
  if (!askConfirm("Tem certeza que deseja remover este ciclo?")) return;
  records = records.filter((item) => item.id !== id);
  saveRecords();
  resetCycleForm();
  renderAll();
  showToast("Ciclo removido", "O registro foi excluído com sucesso.", "success");
}

function deleteOperator(id) {
  if (!askConfirm("Remover operador?")) return;
  operators = operators.filter((op) => op.id !== id);
  saveOperators();
  renderAll();
  showToast("Operador removido", "O registro foi excluído com sucesso.", "success");
}

/* =========================
   EVENTS
========================= */

menuItems.forEach((item) => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderSummary();
    renderTable();
    renderRanking();
    renderChart();
  });
}

if (periodFilter) {
  periodFilter.addEventListener("change", () => {
    renderSummary();
    renderTable();
    renderRanking();
    renderChart();
  });
}

if (operatorSearchInput) operatorSearchInput.addEventListener("input", renderOperatorsPage);
if (operatorMonthFilter) operatorMonthFilter.addEventListener("change", renderOperatorsPage);
if (cyclesPeriodFilter) cyclesPeriodFilter.addEventListener("change", renderCyclesPage);
if (expenseSearchInput) expenseSearchInput.addEventListener("input", renderExpensesPage);
if (expensesPeriodFilter) expensesPeriodFilter.addEventListener("change", renderExpensesPage);
if (savingsSearchInput) savingsSearchInput.addEventListener("input", renderSavingsPage);
if (savingsTypeFilter) savingsTypeFilter.addEventListener("change", renderSavingsPage);

if (importOperatorsBtn) {
  importOperatorsBtn.addEventListener("click", () => importOperatorsInput.click());
}
if (importOperatorsInput) {
  importOperatorsInput.addEventListener("change", (event) => {
    importOperatorsFromFile(event.target.files[0]);
  });
}

if (importExpensesBtn) {
  importExpensesBtn.addEventListener("click", () => importExpensesInput.click());
}
if (importExpensesInput) {
  importExpensesInput.addEventListener("change", (event) => {
    importExpensesFromFile(event.target.files[0]);
  });
}

if (expenseForm) {
  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const parsedDate = expensePicker?.selectedDates?.[0] || parseCycleDate(expenseDate.value);

    const entry = {
      id: expenseId.value || crypto.randomUUID(),
      category: expenseCategory.value.trim(),
      description: expenseDescription.value.trim(),
      value: Number(expenseValue.value || 0),
      date: parsedDate ? parsedDate.toISOString() : "",
    };

    if (!entry.category || entry.value <= 0 || !entry.date) {
      showToast("Dados inválidos", "Preencha categoria, valor e data corretamente.", "error");
      return;
    }

    const existingIndex = expenses.findIndex((item) => item.id === entry.id);
    if (existingIndex >= 0) expenses[existingIndex] = entry;
    else expenses.push(entry);

    saveExpenses();
    resetExpenseForm();
    renderAll();
    showToast(
      existingIndex >= 0 ? "Gasto atualizado" : "Gasto salvo",
      "As informações foram registradas com sucesso.",
      "success"
    );
  });
}

if (cancelExpenseEditBtn) {
  cancelExpenseEditBtn.addEventListener("click", resetExpenseForm);
}

if (savingsForm) {
  savingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const parsedDate = savingsPicker?.selectedDates?.[0] || parseCycleDate(savingsDate.value);

    const entry = {
      id: savingsId.value || crypto.randomUUID(),
      type: savingsType.value,
      value: Number(savingsValue.value || 0),
      description: savingsDescription.value.trim(),
      date: parsedDate ? parsedDate.toISOString() : "",
    };

    if (!entry.type || entry.value <= 0 || !entry.date) {
      showToast("Dados inválidos", "Preencha tipo, valor e data corretamente.", "error");
      return;
    }

    const existingIndex = savings.findIndex((item) => item.id === entry.id);
    if (existingIndex >= 0) savings[existingIndex] = entry;
    else savings.push(entry);

    saveSavings();
    resetSavingsForm();
    renderAll();
    showToast(
      existingIndex >= 0 ? "Movimentação atualizada" : "Movimentação salva",
      "As informações foram registradas com sucesso.",
      "success"
    );
  });
}

if (cancelSavingsEditBtn) {
  cancelSavingsEditBtn.addEventListener("click", resetSavingsForm);
}

if (cycleForm) {
  cycleForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const parsedDate = cyclePicker?.selectedDates?.[0] || parseCycleDate(cycleDate.value);
    const deposit = Number(cycleDeposit.value || 0);
    const accounts = Number(cycleAccounts.value || 0);
    const bau = accounts * 10;
    const withdraw = Number(cycleWithdraw.value || 0);
    const grossProfit = deposit + bau - withdraw;
    const commission = grossProfit > 0 ? grossProfit * 0.3 : 0;

    const entry = {
      id: cycleId.value || crypto.randomUUID(),
      operator: cycleOperator.value.trim(),
      accounts,
      deposit,
      bau,
      withdraw,
      commission,
      createdAt: parsedDate ? parsedDate.toISOString() : "",
    };

    if (!entry.operator || !entry.createdAt) {
      showToast("Dados inválidos", "Preencha corretamente operador e data do ciclo.", "error");
      return;
    }

    const existingIndex = records.findIndex((item) => item.id === entry.id);
    if (existingIndex >= 0) records[existingIndex] = entry;
    else records.push(entry);

    saveRecords();
    resetCycleForm();
    renderAll();
    showToast(
      existingIndex >= 0 ? "Ciclo atualizado" : "Ciclo salvo",
      "As informações foram registradas com sucesso.",
      "success"
    );
  });
}

if (cancelCycleEditBtn) {
  cancelCycleEditBtn.addEventListener("click", resetCycleForm);
}
if (cycleAccounts) cycleAccounts.addEventListener("input", updateCycleBauAutomatically);
if (cycleDeposit) cycleDeposit.addEventListener("input", updateCycleCommissionAutomatically);
if (cycleWithdraw) cycleWithdraw.addEventListener("input", updateCycleCommissionAutomatically);

if (goalsForm) {
  goalsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    goals = {
      daily: parseFlexibleNumber(dailyGoalInput.value),
      weekly: parseFlexibleNumber(weeklyGoalInput.value),
      monthly: parseFlexibleNumber(monthlyGoalInput.value),
    };

    saveGoals();
    populateGoalsForm();
    renderGoals();
    renderOverviewGoals();
    showToast("Metas salvas", "As metas foram atualizadas com sucesso.", "success");
  });
}

if (operatorForm) {
  operatorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newOperator = {
      id: crypto.randomUUID(),
      name: operatorName.value.trim(),
      month: operatorMonth.value,
      gross: Number(operatorGross.value || 0),
      net: Number(operatorNet.value || 0),
      operatorValue: Number(operatorValue.value || 0),
      createdAt: new Date().toISOString(),
    };

    if (!newOperator.name || !newOperator.month) {
      showToast("Dados inválidos", "Preencha todos os campos obrigatórios.", "error");
      return;
    }

    operators.push(newOperator);
    saveOperators();
    operatorForm.reset();
    renderAll();
    showToast("Operador salvo", "O novo operador foi cadastrado com sucesso.", "success");
  });
}

if (settingsForm) {
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    settings = {
      theme: themeSelect.value,
      fontSize: fontSizeSelect.value,
      palette: paletteSelect.value,
    };

    saveSettings();
    applySettings();
    renderChart();
    showToast("Configurações salvas", "As preferências foram atualizadas.", "success");
  });
}

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    settings.theme = themeSelect.value;
    applySettings();
    renderChart();
  });
}

if (fontSizeSelect) {
  fontSizeSelect.addEventListener("change", () => {
    settings.fontSize = fontSizeSelect.value;
    applySettings();
  });
}

if (paletteSelect) {
  paletteSelect.addEventListener("change", () => {
    settings.palette = paletteSelect.value;
    applySettings();
    renderChart();
  });
}

if (resetSettingsBtn) {
  resetSettingsBtn.addEventListener("click", () => {
    resetSettings();
    showToast("Configurações restauradas", "O padrão do dashboard foi aplicado.", "info");
  });
}

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.editSavings = editSavings;
window.deleteSavings = deleteSavings;
window.deleteOperator = deleteOperator;
window.editCycle = editCycle;
window.deleteCycle = deleteCycle;

/* =========================
   INIT
========================= */

applySettings();
resetExpenseForm();
resetSavingsForm();
resetCycleForm();
populateGoalsForm();
renderAll();
showPage("overview");

if (window.flatpickr) {
  flatpickr.localize(flatpickr.l10ns.pt);

  expensePicker = flatpickr("#expenseDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  cyclePicker = flatpickr("#cycleDate", {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    time_24hr: true,
    allowInput: true,
  });

  savingsPicker = flatpickr("#savingsDate", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });
}
