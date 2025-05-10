const tg = Telegram.WebApp;
tg.expand();

async function sendToBot(data) {
  // 1. Основной метод (для мобильных)
  if (tg.isExpanded) {
    try {
      tg.sendData(JSON.stringify(data));
      console.log('Данные отправлены через sendData');
      return true;
    } catch (e) {
      console.error('Ошибка sendData:', e);
    }
  }

  // 2. Метод для десктопной версии
  if (tg.platform === 'tdesktop' || tg.platform === 'macos') {
    const url = `https://t.me/${tg.initDataUnsafe.user?.username}?start=webapp_${encodeURIComponent(JSON.stringify(data))}`;
    window.open(url, '_blank');
    return true;
  }

  // 3. Резервный метод через Bot API
  try {
    await fetch(`https://api.telegram.org/bot8029087587:AAFgw827hRvzNtmakLBtfNZx1ZJTd4vRY3Q/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: tg.initDataUnsafe.user?.id,
        text: `Данные формы:\n${JSON.stringify(data, null, 2)}`
      })
    });
    console.log('Данные отправлены через Bot API');
    return true;
  } catch (e) {
    console.error('Ошибка резервной отправки:', e);
    return false;
  }
}

// Обработчик формы
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
    platform: tg.platform,
    via: 'webapp'
  };

  const success = await sendToBot(formData);
  
  if (success) {
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    setTimeout(() => tg.close(), 2000);
  } else {
    alert('Не удалось отправить данные. Попробуйте позже.');
  }
});
