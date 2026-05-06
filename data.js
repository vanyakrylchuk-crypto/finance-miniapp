// ==================== СТАНДАРТНЫЕ ДАННЫЕ ====================
const DEFAULT_ACCOUNTS = [
  { id: 'a1', name: 'Наличные', icon: '💵' },
  { id: 'a2', name: 'Карта', icon: '💳' },
  { id: 'a3', name: 'Вклад', icon: '🏦' }
];

const DEFAULT_INCOME_CATEGORIES = [
  { id: 'i1', name: 'Зарплата', icon: '💰' },
  { id: 'i2', name: 'Подарок', icon: '🎁' },
  { id: 'i3', name: 'Фриланс', icon: '💼' },
  { id: 'i4', name: 'Инвестиции', icon: '📈' },
  { id: 'i5', name: 'Другое', icon: '📌' }
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'e1', name: 'Еда', icon: '🍔' },
  { id: 'e2', name: 'Транспорт', icon: '🚌' },
  { id: 'e3', name: 'Развлечения', icon: '🎉' },
  { id: 'e4', name: 'Жильё', icon: '🏠' },
  { id: 'e5', name: 'Здоровье', icon: '💊' },
  { id: 'e6', name: 'Прочее', icon: '🛒' }
];

// Инициализация или загрузка данных
let accounts = loadAccounts() || [...DEFAULT_ACCOUNTS];
let incomeCategories = loadIncomeCategories() || [...DEFAULT_INCOME_CATEGORIES];
let expenseCategories = loadExpenseCategories() || [...DEFAULT_EXPENSE_CATEGORIES];
let transactions = loadTransactions();