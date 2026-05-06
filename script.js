// ================= НАСТРОЙКИ И ДАННЫЕ =================
const STORAGE_KEY = 'financeTransactions'; // Ключ для localStorage

// Категории для расходов и доходов
const CATEGORIES = {
    expense: ['🍔 Еда', '🚌 Транспорт', '🎉 Развлечения', '🏠 Жильё', '📚 Образование', '💊 Здоровье', '🛒 Прочее'],
    income: ['💰 Зарплата', '🎁 Подарок', '📈 Инвестиции', '💼 Фриланс', '🔄 Возврат', '📌 Другое']
};

// Глобальное состояние приложения
const state = {
    type: 'expense',            // текущий тип операции: 'expense' или 'income'
    transactions: JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
};

// ================= DOM-ЭЛЕМЕНТЫ (кэшируем, чтобы не искать каждый раз) =================
const amountInput = document.getElementById('amountInput');
const expenseBtn = document.getElementById('expenseBtn');
const incomeBtn = document.getElementById('incomeBtn');
const categorySelect = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const transactionsList = document.getElementById('transactionsList');
const balanceValue = document.getElementById('balanceValue');

// ================= ФУНКЦИИ УПРАВЛЕНИЯ КАТЕГОРИЯМИ =================
function updateCategories() {
    const catList = CATEGORIES[state.type];
    categorySelect.innerHTML = '';
    catList.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Переключение типа операции (расход/доход)
function setType(type) {
    state.type = type;
    if (type === 'expense') {
        expenseBtn.classList.add('active');
        incomeBtn.classList.remove('active');
    } else {
        incomeBtn.classList.add('active');
        expenseBtn.classList.remove('active');
    }
    updateCategories();
}

// ================= РАБОТА С ДАННЫМИ =================
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

function calculateBalance() {
    return state.transactions.reduce((total, t) => {
        return t.type === 'income' ? total + t.amount : total - t.amount;
    }, 0);
}

// ================= ОТОБРАЖЕНИЕ (РЕНДЕР) =================
function render() {
    // Очищаем список
    transactionsList.innerHTML = '';

    // Проходим по транзакциям в обратном порядке (новые сверху)
    state.transactions.slice().reverse().forEach((t, reversedIndex) => {
        const li = document.createElement('li');
        li.className = t.type === 'income' ? 'income-item' : 'expense-item';

        li.innerHTML = `
            <div class="item-info">
                <span>${t.category}</span>
                <span class="item-category">${new Date(t.date).toLocaleString('ru-RU')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="item-amount" style="color:${t.type === 'income' ? '#31b545' : '#d93939'}">
                    ${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)} ₽
                </span>
                <button class="delete-btn" data-id="${reversedIndex}" title="Удалить">✕</button>
            </div>
        `;
        transactionsList.appendChild(li);
    });

    // Обновляем баланс
    const balance = calculateBalance();
    balanceValue.textContent = balance.toFixed(2);
    balanceValue.classList.toggle('negative', balance < 0);

    // Привязываем кнопки удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reversedIdx = parseInt(e.target.dataset.id);
            // Переводим из reversed порядка в реальный индекс массива
            const realIndex = state.transactions.length - 1 - reversedIdx;
            state.transactions.splice(realIndex, 1);
            saveTransactions();
            render();
        });
    });
}

// ================= ДОБАВЛЕНИЕ ТРАНЗАКЦИИ =================
function addTransaction() {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        alert('Введите корректную сумму');
        return;
    }

    const category = categorySelect.value;
    state.transactions.push({
        type: state.type,
        amount: amount,
        category: category,
        date: new Date().toISOString()
    });

    saveTransactions();
    amountInput.value = '';
    render();
}

// ================= ОБРАБОТЧИКИ СОБЫТИЙ =================
expenseBtn.addEventListener('click', () => setType('expense'));
incomeBtn.addEventListener('click', () => setType('income'));
addBtn.addEventListener('click', addTransaction);
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTransaction();
    }
});

// ================= СТАРТ ПРИЛОЖЕНИЯ =================
setType('expense');
render();