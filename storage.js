// ==================== ХРАНИЛИЩЕ ДАННЫХ ====================
const STORAGE_TRANSACTIONS = 'finance_transactions';
const STORAGE_ACCOUNTS = 'finance_accounts';
const STORAGE_INCOME_CATS = 'finance_income_cats';
const STORAGE_EXPENSE_CATS = 'finance_expense_cats';

// Сохранение и загрузка транзакций
function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_TRANSACTIONS);
  return raw ? JSON.parse(raw) : [];
}
function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(transactions));
}

// Сохранение и загрузка счетов
function loadAccounts() {
  const raw = localStorage.getItem(STORAGE_ACCOUNTS);
  return raw ? JSON.parse(raw) : null; // null – использовать стандартные из data.js
}
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(accounts));
}

// Сохранение и загрузка категорий
function loadIncomeCategories() {
  const raw = localStorage.getItem(STORAGE_INCOME_CATS);
  return raw ? JSON.parse(raw) : null;
}
function saveIncomeCategories(cats) {
  localStorage.setItem(STORAGE_INCOME_CATS, JSON.stringify(cats));
}
function loadExpenseCategories() {
  const raw = localStorage.getItem(STORAGE_EXPENSE_CATS);
  return raw ? JSON.parse(raw) : null;
}
function saveExpenseCategories(cats) {
  localStorage.setItem(STORAGE_EXPENSE_CATS, JSON.stringify(cats));
}