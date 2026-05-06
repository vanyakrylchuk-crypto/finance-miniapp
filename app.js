// ==================== ЗАПУСК ПРИЛОЖЕНИЯ ====================
// Переключение вкладок
const tabs = document.querySelectorAll('.tab');
const screens = {
  home: document.getElementById('screen-home'),
  history: document.getElementById('screen-history'),
  analytics: document.getElementById('screen-analytics'),
  settings: document.getElementById('screen-settings')
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const screenId = tab.dataset.screen;
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Первичный рендер
if (!loadAccounts()) saveAccounts(accounts);
if (!loadIncomeCategories()) saveIncomeCategories(incomeCategories);
if (!loadExpenseCategories()) saveExpenseCategories(expenseCategories);
saveTransactions(transactions);
renderHome();