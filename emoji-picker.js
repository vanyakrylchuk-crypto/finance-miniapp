// ==================== ЭМОДЗИ-ПИКЕР ====================
const emojiModal = document.getElementById('emojiModal');
const emojiGrid = document.getElementById('emojiGrid');
const emojiTarget = document.getElementById('emojiTarget');

// Набор часто используемых эмодзи (можно дополнить)
const EMOJIS = ['💰','💵','💳','🏦','💎','🎁','💼','📈','📌','🍔','🚌','🎉','🏠','💊','🛒',
                '🔥','⭐','❤️','👍','✅','📊','⚡','🎯','💡','🛍️','🍕','☕','🚗','✈️','📚'];

function showEmojiPicker() {
  emojiGrid.innerHTML = '';
  EMOJIS.forEach(em => {
    const span = document.createElement('span');
    span.className = 'emoji-item';
    span.textContent = em;
    span.addEventListener('click', () => {
      // Устанавливаем выбранный эмодзи в поле, которое в фокусе
      const target = document.activeElement;
      if (target && target.tagName === 'INPUT' && target.id === 'editIcon') {
        target.value = em;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
      emojiModal.classList.remove('active');
    });
    emojiGrid.appendChild(span);
  });
  emojiModal.classList.add('active');
}

window.showEmojiPicker = showEmojiPicker;

document.getElementById('emojiCancel').addEventListener('click', () => {
  emojiModal.classList.remove('active');
});

emojiModal.addEventListener('click', (e) => {
  if (e.target === emojiModal) emojiModal.classList.remove('active');
});