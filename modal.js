// ==================== МОДАЛЬНОЕ ОКНО ТРАНЗАКЦИИ ====================
const transModal = document.getElementById('transactionModal');
const transTitle = document.getElementById('modalTitle');
const transAmount = document.getElementById('modalAmount');
const transDate = document.getElementById('modalDate');
let pendingTransaction = null;

window.showTransactionModal = function(type, catId, catName, accId, accName) {
  const categoryObj = (type === 'income' ? incomeCategories : expenseCategories).find(c => c.id === catId);
  const accountObj = accounts.find(a => a.id === accId);
  pendingTransaction = { type, categoryId: catId, accountId: accId, categoryName: categoryObj?.name || catName, accountName: accountObj?.name || accName };
  transTitle.textContent = type === 'income'
    ? `${pendingTransaction.categoryName} → ${pendingTransaction.accountName}`
    : `${pendingTransaction.accountName} → ${pendingTransaction.categoryName}`;
  transAmount.value = '';
  transDate.value = new Date().toISOString().split('T')[0];
  transModal.classList.add('active');
};

document.getElementById('modalAdd').addEventListener('click', () => {
  const amount = parseFloat(transAmount.value);
  if (!amount || amount <= 0) return alert('Введите сумму');
  transactions.push({
    id: Date.now().toString(),
    type: pendingTransaction.type,
    amount,
    date: transDate.value,
    categoryId: pendingTransaction.categoryId,
    accountId: pendingTransaction.accountId
  });
  saveTransactions(transactions);
  renderHome();
  transModal.classList.remove('active');
  pendingTransaction = null;
});

document.getElementById('modalCancel').addEventListener('click', () => {
  transModal.classList.remove('active');
  pendingTransaction = null;
});