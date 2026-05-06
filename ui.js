// ==================== РЕНДЕР ГЛАВНОЙ ====================
function getAccountBalance(accountId) {
  return transactions
    .filter(t => t.accountId === accountId)
    .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
}

function getTotalBalance() {
  return accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
}

function getMonthSum(type) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return transactions
    .filter(t => t.type === type && new Date(t.date) >= start)
    .reduce((sum, t) => sum + t.amount, 0);
}

function renderHome() {
  // Баланс
  document.getElementById('balanceValue').textContent = getTotalBalance().toFixed(2);

  // Месячные суммы
  document.getElementById('monthIncome').textContent = getMonthSum('income').toFixed(2);
  document.getElementById('monthExpense').textContent = getMonthSum('expense').toFixed(2);

  // Расходы (категории) — сверху
  const expEl = document.getElementById('expenseCategories');
  expEl.innerHTML = '';
  expenseCategories.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.dataset.categoryId = cat.id;
    div.dataset.dropType = 'expense-category';
    div.dataset.editType = 'expense-category';
    div.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    expEl.appendChild(div);
  });

  // Счета (центр)
  const accountsEl = document.getElementById('accountsList');
  accountsEl.innerHTML = '';
  accounts.forEach(acc => {
    const bal = getAccountBalance(acc.id);
    const div = document.createElement('div');
    div.className = 'account-card';
    div.dataset.accountId = acc.id;
    div.dataset.dragType = 'account';
    div.dataset.dropType = 'account';
    div.dataset.editType = 'account';
    div.innerHTML = `
      <span class="account-icon">${acc.icon}</span>
      <div class="account-info">
        <span class="account-name">${acc.name}</span>
        <span class="account-balance">${bal.toFixed(2)} ₽</span>
      </div>
    `;
    accountsEl.appendChild(div);
  });

  // Доходы (категории) — снизу
  const incEl = document.getElementById('incomeCategories');
  incEl.innerHTML = '';
  incomeCategories.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.dataset.categoryId = cat.id;
    div.dataset.dragType = 'income-category';
    div.dataset.editType = 'income-category';
    div.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.name}`;
    incEl.appendChild(div);
  });
}