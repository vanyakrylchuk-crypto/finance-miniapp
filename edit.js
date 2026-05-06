// ==================== РЕДАКТИРОВАНИЕ КАТЕГОРИЙ И СЧЕТОВ ====================
const editModal = document.getElementById('editModal');
const editTitle = document.getElementById('editModalTitle');
const editName = document.getElementById('editName');
let currentEdit = null; // { type, id }

// Открыть редактор
function openEditor(type, id, currentName) {
  currentEdit = { type, id };
  editName.value = currentName;
  editTitle.textContent = type === 'account' ? 'Редактировать счёт' : 'Редактировать категорию';
  editModal.classList.add('active');
}

// Закрыть редактор
function closeEditor() {
  editModal.classList.remove('active');
  currentEdit = null;
}

// Обработчики кнопок
document.getElementById('editSave').addEventListener('click', () => {
  const newName = editName.value.trim();
  if (!newName) return alert('Введите название');
  const { type, id } = currentEdit;

  if (type === 'account') {
    const acc = accounts.find(a => a.id === id);
    if (acc) acc.name = newName;
    saveAccounts(accounts);
  } else if (type === 'income-category') {
    const cat = incomeCategories.find(c => c.id === id);
    if (cat) cat.name = newName;
    saveIncomeCategories(incomeCategories);
  } else if (type === 'expense-category') {
    const cat = expenseCategories.find(c => c.id === id);
    if (cat) cat.name = newName;
    saveExpenseCategories(expenseCategories);
  }
  renderHome();
  closeEditor();
});

document.getElementById('editDelete').addEventListener('click', () => {
  if (!confirm('Точно удалить?')) return;
  const { type, id } = currentEdit;
  if (type === 'account') {
    accounts = accounts.filter(a => a.id !== id);
    saveAccounts(accounts);
  } else if (type === 'income-category') {
    incomeCategories = incomeCategories.filter(c => c.id !== id);
    saveIncomeCategories(incomeCategories);
  } else if (type === 'expense-category') {
    expenseCategories = expenseCategories.filter(c => c.id !== id);
    saveExpenseCategories(expenseCategories);
  }
  renderHome();
  closeEditor();
});

document.getElementById('editCancel').addEventListener('click', closeEditor);

// Открытие редактора по тапу на элементе (не drag)
document.body.addEventListener('click', (e) => {
  // Проверяем, что это был не drag (не было перемещения)
  if (dragInfo || cloneVisible) return;

  const editEl = e.target.closest('[data-edit-type]');
  if (!editEl) return;

  const type = editEl.dataset.editType;
  const id = editEl.dataset.accountId || editEl.dataset.categoryId;
  let name = '';
  if (type === 'account') {
    const acc = accounts.find(a => a.id === id);
    if (acc) name = acc.name;
  } else if (type === 'income-category') {
    const cat = incomeCategories.find(c => c.id === id);
    if (cat) name = cat.name;
  } else if (type === 'expense-category') {
    const cat = expenseCategories.find(c => c.id === id);
    if (cat) name = cat.name;
  }
  if (name) openEditor(type, id, name);
});

// Кнопки "+" на заголовках
document.body.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (!addBtn) return;
  const addType = addBtn.dataset.add;
  let newId, newName;

  if (addType === 'account') {
    newName = prompt('Название нового счёта:');
    if (!newName) return;
    newId = 'a' + Date.now();
    accounts.push({ id: newId, name: newName, icon: '💵' });
    saveAccounts(accounts);
  } else if (addType === 'income-category') {
    newName = prompt('Название категории дохода:');
    if (!newName) return;
    newId = 'i' + Date.now();
    incomeCategories.push({ id: newId, name: newName, icon: '💰' });
    saveIncomeCategories(incomeCategories);
  } else if (addType === 'expense-category') {
    newName = prompt('Название категории расхода:');
    if (!newName) return;
    newId = 'e' + Date.now();
    expenseCategories.push({ id: newId, name: newName, icon: '🛒' });
    saveExpenseCategories(expenseCategories);
  }
  renderHome();
});