// ==================== РЕДАКТИРОВАНИЕ И ДОБАВЛЕНИЕ ====================
const editModal = document.getElementById('editModal');
const editTitle = document.getElementById('editModalTitle');
const editName = document.getElementById('editName');
const editIcon = document.getElementById('editIcon');
let currentEdit = null; // { type, id }

function openEditor(type, id, currentName, currentIcon) {
  currentEdit = { type, id };
  editName.value = currentName;
  editIcon.value = currentIcon || '';
  editTitle.textContent = type === 'account' ? 'Редактировать счёт' : 'Редактировать категорию';
  editModal.classList.add('active');
}

function closeEditor() {
  editModal.classList.remove('active');
  currentEdit = null;
}

// Обработчики
document.getElementById('editSave').addEventListener('click', () => {
  const newName = editName.value.trim();
  const newIcon = editIcon.value.trim() || (currentEdit?.type === 'account' ? '💵' : '💰');
  if (!newName) return alert('Введите название');
  const { type, id } = currentEdit;

  if (type === 'account') {
    const acc = accounts.find(a => a.id === id);
    if (acc) { acc.name = newName; acc.icon = newIcon; }
    saveAccounts(accounts);
  } else if (type === 'income-category') {
    const cat = incomeCategories.find(c => c.id === id);
    if (cat) { cat.name = newName; cat.icon = newIcon; }
    saveIncomeCategories(incomeCategories);
  } else if (type === 'expense-category') {
    const cat = expenseCategories.find(c => c.id === id);
    if (cat) { cat.name = newName; cat.icon = newIcon; }
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

// При тапе на поле иконки – открываем emoji picker
editIcon.addEventListener('click', () => {
  window.showEmojiPicker();
});

// Обработчик клика по элементу для открытия редактора
document.body.addEventListener('click', (e) => {
  if (dragInfo || cloneVisible) return;
  const editEl = e.target.closest('[data-edit-type]');
  if (!editEl) return;

  const type = editEl.dataset.editType;
  const id = editEl.dataset.accountId || editEl.dataset.categoryId;
  let name = '', icon = '';
  if (type === 'account') {
    const acc = accounts.find(a => a.id === id);
    if (acc) { name = acc.name; icon = acc.icon; }
  } else if (type === 'income-category') {
    const cat = incomeCategories.find(c => c.id === id);
    if (cat) { name = cat.name; icon = cat.icon; }
  } else if (type === 'expense-category') {
    const cat = expenseCategories.find(c => c.id === id);
    if (cat) { name = cat.name; icon = cat.icon; }
  }
  if (name) openEditor(type, id, name, icon);
});

// Кнопки "+" для добавления
document.body.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (!addBtn) return;
  const addType = addBtn.dataset.add;
  let defaultName, defaultIcon, newId, callback;

  if (addType === 'account') {
    defaultName = 'Новый счёт';
    defaultIcon = '💵';
    newId = 'a' + Date.now();
    callback = (name, icon) => {
      accounts.push({ id: newId, name, icon });
      saveAccounts(accounts);
    };
  } else if (addType === 'income-category') {
    defaultName = 'Категория';
    defaultIcon = '💰';
    newId = 'i' + Date.now();
    callback = (name, icon) => {
      incomeCategories.push({ id: newId, name, icon });
      saveIncomeCategories(incomeCategories);
    };
  } else if (addType === 'expense-category') {
    defaultName = 'Категория';
    defaultIcon = '🛒';
    newId = 'e' + Date.now();
    callback = (name, icon) => {
      expenseCategories.push({ id: newId, name, icon });
      saveExpenseCategories(expenseCategories);
    };
  }

  // Открываем редактор для нового элемента
  currentEdit = { type: addType, id: newId, isNew: true };
  editName.value = defaultName;
  editIcon.value = defaultIcon;
  editTitle.textContent = 'Добавить';
  editModal.classList.add('active');

  // Переопределяем поведение кнопки Сохранить для нового элемента
  const oldSave = document.getElementById('editSave').onclick;
  document.getElementById('editSave').onclick = () => {
    const name = editName.value.trim();
    const icon = editIcon.value.trim() || defaultIcon;
    if (!name) return alert('Введите название');
    callback(name, icon);
    editModal.classList.remove('active');
    currentEdit = null;
    renderHome();
    document.getElementById('editSave').onclick = oldSave; // восстанавливаем
  };
});