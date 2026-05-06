// ================= НАСТРОЙКИ И ДАННЫЕ =================
const STORAGE_KEY = 'financeData';

// Зашитые счета (потом можно редактировать в настройках)
const DEFAULT_ACCOUNTS = [
    { id: 'a1', name: 'Наличные', icon: '💵', initialBalance: 0 },
    { id: 'a2', name: 'Карта', icon: '💳', initialBalance: 0 },
    { id: 'a3', name: 'Вклад', icon: '🏦', initialBalance: 0 }
];

// Категории доходов и расходов
const INCOME_CATEGORIES = [
    { id: 'i1', name: 'Зарплата', icon: '💰' },
    { id: 'i2', name: 'Подарок', icon: '🎁' },
    { id: 'i3', name: 'Фриланс', icon: '💼' },
    { id: 'i4', name: 'Инвестиции', icon: '📈' },
    { id: 'i5', name: 'Другое', icon: '📌' }
];

const EXPENSE_CATEGORIES = [
    { id: 'e1', name: 'Еда', icon: '🍔' },
    { id: 'e2', name: 'Транспорт', icon: '🚌' },
    { id: 'e3', name: 'Развлечения', icon: '🎉' },
    { id: 'e4', name: 'Жильё', icon: '🏠' },
    { id: 'e5', name: 'Здоровье', icon: '💊' },
    { id: 'e6', name: 'Прочее', icon: '🛒' }
];

// Глобальное состояние
const state = {
    // Массив транзакций: { id, type, amount, date, categoryId, accountId }
    transactions: JSON.parse(localStorage.getItem(STORAGE_KEY + '_transactions')) || [],
    // Счета
    accounts: JSON.parse(localStorage.getItem(STORAGE_KEY + '_accounts')) || DEFAULT_ACCOUNTS
};

// ================= DOM-ЭЛЕМЕНТЫ =================
const screens = {
    home: document.getElementById('screen-home'),
    history: document.getElementById('screen-history'),
    analytics: document.getElementById('screen-analytics'),
    settings: document.getElementById('screen-settings')
};
const tabs = document.querySelectorAll('.tab');
const modal = document.getElementById('transactionModal');
const modalTitle = document.getElementById('modalTitle');
const modalAmount = document.getElementById('modalAmount');
const modalDate = document.getElementById('modalDate');
const modalAdd = document.getElementById('modalAdd');
const modalCancel = document.getElementById('modalCancel');
const dragClone = document.getElementById('dragClone');

// Данные для текущего drag-and-drop
let dragInfo = null;   // { type, id, name, icon, targetType } 
let cloneVisible = false;
let cloneX = 0, cloneY = 0;

// ================= УТИЛИТЫ =================
function saveData() {
    localStorage.setItem(STORAGE_KEY + '_transactions', JSON.stringify(state.transactions));
    localStorage.setItem(STORAGE_KEY + '_accounts', JSON.stringify(state.accounts));
}

function getAccountBalance(accountId) {
    const initial = state.accounts.find(a => a.id === accountId)?.initialBalance || 0;
    const change = state.transactions
        .filter(t => t.accountId === accountId)
        .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
    return initial + change;
}

function getTotalBalance() {
    return state.accounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
}

function getMonthTransactions(type) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return state.transactions.filter(t => {
        const date = new Date(t.date);
        return date >= startOfMonth && t.type === type;
    });
}

function getMonthSum(type) {
    return getMonthTransactions(type).reduce((sum, t) => sum + t.amount, 0);
}

// ================= ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =================
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const screenId = tab.dataset.screen;
        // Скрываем все экраны и показываем нужный
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenId].classList.add('active');
        // Обновляем активный таб
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// ================= ОТОБРАЖЕНИЕ ГЛАВНОЙ =================
function renderHome() {
    // Баланс
    document.getElementById('balanceValue').textContent = getTotalBalance().toFixed(2);

    // Месячные суммы
    document.getElementById('monthIncome').textContent = getMonthSum('income').toFixed(2);
    document.getElementById('monthExpense').textContent = getMonthSum('expense').toFixed(2);

    // Категории доходов
    const incomeContainer = document.getElementById('incomeCategories');
    incomeContainer.innerHTML = '';
    INCOME_CATEGORIES.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `${cat.icon} ${cat.name}`;
        div.dataset.categoryId = cat.id;
        div.dataset.categoryName = cat.name;
        div.dataset.categoryIcon = cat.icon;
        div.setAttribute('data-drag-type', 'income-category');
        incomeContainer.appendChild(div);
    });

    // Категории расходов
    const expenseContainer = document.getElementById('expenseCategories');
    expenseContainer.innerHTML = '';
    EXPENSE_CATEGORIES.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `${cat.icon} ${cat.name}`;
        div.dataset.categoryId = cat.id;
        div.dataset.categoryName = cat.name;
        div.dataset.categoryIcon = cat.icon;
        div.setAttribute('data-drop-type', 'expense-category');
        expenseContainer.appendChild(div);
    });

    // Счета
    const accountsContainer = document.getElementById('accountsList');
    accountsContainer.innerHTML = '';
    state.accounts.forEach(acc => {
        const balance = getAccountBalance(acc.id);
        const div = document.createElement('div');
        div.className = 'account-item';
        div.innerHTML = `
            <span class="account-name">${acc.icon} ${acc.name}</span>
            <span class="account-balance">${balance.toFixed(2)} ₽</span>
        `;
        div.dataset.accountId = acc.id;
        div.dataset.accountName = acc.name;
        div.dataset.accountIcon = acc.icon;
        // Счёт может быть и drag-источником (для расхода) и drop-целью (для дохода)
        div.setAttribute('data-drag-type', 'account');
        div.setAttribute('data-drop-type', 'account');
        accountsContainer.appendChild(div);
    });
}

// ================= DRAG-AND-DROP (Touch) =================
function getEventPos(e) {
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX, y: touch.clientY };
}

function onDragStart(e, el) {
    e.preventDefault();
    const dragType = el.dataset.dragType;
    if (!dragType) return;

    dragInfo = {
        type: dragType, // 'income-category' или 'account'
        id: el.dataset.categoryId || el.dataset.accountId,
        name: el.dataset.categoryName || el.dataset.accountName,
        icon: el.dataset.categoryIcon || el.dataset.accountIcon
    };

    // Показываем клон
    dragClone.textContent = `${dragInfo.icon} ${dragInfo.name}`;
    dragClone.style.display = 'block';
    const pos = getEventPos(e);
    cloneX = pos.x - 50;
    cloneY = pos.y - 20;
    dragClone.style.left = cloneX + 'px';
    dragClone.style.top = cloneY + 'px';
    cloneVisible = true;
}

function onDragMove(e) {
    if (!cloneVisible) return;
    e.preventDefault();
    const pos = getEventPos(e);
    cloneX = pos.x - 50;
    cloneY = pos.y - 20;
    dragClone.style.left = cloneX + 'px';
    dragClone.style.top = cloneY + 'px';
}

function onDragEnd(e) {
    if (!cloneVisible) return;
    e.preventDefault();
    cloneVisible = false;
    dragClone.style.display = 'none';

    // Определяем элемент под пальцем
    const pos = getEventPos(e);
    const targetElement = document.elementFromPoint(pos.x, pos.y);
    if (!targetElement || !dragInfo) return;

    // Ищем цель, поднимаясь по DOM (элемент может быть вложенным)
    let dropTarget = targetElement;
    while (dropTarget && !dropTarget.dataset.dropType) {
        dropTarget = dropTarget.parentElement;
    }
    if (!dropTarget) return;

    const dropType = dropTarget.dataset.dropType;

    // Проверяем комбинации
    if (dragInfo.type === 'income-category' && dropType === 'account') {
        // Доход: категория дохода перетянута на счёт
        showTransactionModal('income', dragInfo.id, dragInfo.name, dragInfo.icon, dropTarget.dataset.accountId, dropTarget.dataset.accountName);
    } else if (dragInfo.type === 'account' && dropType === 'expense-category') {
        // Расход: счёт перетянут на категорию расхода
        showTransactionModal('expense', dropTarget.dataset.categoryId, dropTarget.dataset.categoryName, dropTarget.dataset.categoryIcon, dragInfo.id, dragInfo.name);
    }

    // Сбрасываем
    dragInfo = null;
}

// Навешиваем обработчики на все потенциальные drag-элементы динамически
document.body.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-drag-type]')) {
        const el = e.target.closest('[data-drag-type]');
        onDragStart(e, el);
    }
});
document.body.addEventListener('pointermove', onDragMove);
document.body.addEventListener('pointerup', onDragEnd);
document.body.addEventListener('pointercancel', onDragEnd);

// ================= МОДАЛЬНОЕ ОКНО =================
let pendingTransaction = null; // { type, categoryId, categoryName, categoryIcon, accountId, accountName }

function showTransactionModal(type, categoryId, categoryName, categoryIcon, accountId, accountName) {
    pendingTransaction = { type, categoryId, categoryName, categoryIcon, accountId, accountName };
    modalTitle.textContent = type === 'income' ? `Доход: ${categoryName} → ${accountName}` : `Расход: ${accountName} → ${categoryName}`;
    modalAmount.value = '';
    modalDate.value = new Date().toISOString().split('T')[0]; // сегодня
    modal.classList.add('active');
}

function hideTransactionModal() {
    modal.classList.remove('active');
    pendingTransaction = null;
}

modalAdd.addEventListener('click', () => {
    const amount = parseFloat(modalAmount.value);
    if (!amount || amount <= 0) {
        alert('Введите корректную сумму');
        return;
    }
    const date = modalDate.value || new Date().toISOString().split('T')[0];

    if (pendingTransaction) {
        const newTrans = {
            id: Date.now().toString(),
            type: pendingTransaction.type,
            amount: amount,
            date: date,
            categoryId: pendingTransaction.categoryId,
            accountId: pendingTransaction.accountId
        };
        state.transactions.push(newTrans);
        saveData();
        renderHome();
        hideTransactionModal();
    }
});

modalCancel.addEventListener('click', hideTransactionModal);

// Закрытие по клику на фон
modal.addEventListener('click', (e) => {
    if (e.target === modal) hideTransactionModal();
});

// ================= ЗАПУСК =================
function init() {
    // Восстановление счетов, если локальные есть
    if (!localStorage.getItem(STORAGE_KEY + '_accounts')) {
        state.accounts = DEFAULT_ACCOUNTS;
        saveData();
    }
    renderHome();
}

init();