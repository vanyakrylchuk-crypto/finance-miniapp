// ==================== DRAG-AND-DROP ====================
let dragInfo = null;
let cloneVisible = false;

const dragClone = document.getElementById('dragClone');

function onDragStart(e, el) {
  e.preventDefault();
  const dragType = el.dataset.dragType;
  if (!dragType) return;

  const id = el.dataset.categoryId || el.dataset.accountId;
  const icon = el.querySelector('.cat-icon, .account-icon')?.textContent || '';
  const name = el.querySelector('.account-name')?.textContent || el.dataset.categoryName || el.dataset.accountName || '';

  dragInfo = { type: dragType, id, icon, name };

  dragClone.textContent = `${icon} ${name}`;
  dragClone.style.display = 'block';
  moveClone(e);
  cloneVisible = true;
}

function moveClone(e) {
  const pos = e.touches ? e.touches[0] : e;
  dragClone.style.left = (pos.clientX - 50) + 'px';
  dragClone.style.top = (pos.clientY - 20) + 'px';
}

function onDragMove(e) {
  if (!cloneVisible) return;
  e.preventDefault();
  moveClone(e);
}

function onDragEnd(e) {
  if (!cloneVisible) return;
  e.preventDefault();
  dragClone.style.display = 'none';
  cloneVisible = false;

  const pos = e.changedTouches ? e.changedTouches[0] : e;
  const target = document.elementFromPoint(pos.clientX, pos.clientY);
  if (!target || !dragInfo) return;

  let dropEl = target.closest('[data-drop-type]');
  if (!dropEl) return;

  const dropType = dropEl.dataset.dropType;

  // Доход: категория -> счёт
  if (dragInfo.type === 'income-category' && dropType === 'account') {
    window.showTransactionModal('income', dragInfo.id, dragInfo.name, dropEl.dataset.accountId, dropEl.querySelector('.account-name')?.textContent || '');
  }
  // Расход: счёт -> категория расхода
  else if (dragInfo.type === 'account' && dropType === 'expense-category') {
    window.showTransactionModal('expense', dropEl.dataset.categoryId, dropEl.querySelector('.cat-icon')?.nextSibling?.textContent || '', dragInfo.id, dragInfo.name);
  }

  dragInfo = null;
}

// Глобальные обработчики
document.body.addEventListener('pointerdown', (e) => {
  const dragEl = e.target.closest('[data-drag-type]');
  if (dragEl) onDragStart(e, dragEl);
});
document.body.addEventListener('pointermove', onDragMove);
document.body.addEventListener('pointerup', onDragEnd);
document.body.addEventListener('pointercancel', onDragEnd);