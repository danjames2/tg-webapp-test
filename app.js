const tg = Telegram.WebApp;
tg.expand();

async function sendFormData() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
    platform: tg.platform,
    is_tdesktop: tg.platform === 'tdesktop'
  };

  // 1. Основной метод для всех платформ
  try {
    tg.sendData(JSON.stringify(formData));
    console.log('Данные отправлены через sendData');
    return true;
  } catch (e) {
    console.warn('Ошибка sendData:', e);
  }

  // 2. Специальная обработка для десктопной версии
  if (tg.platform === 'tdesktop') {
    try {
      const response = await fetch('https://api.telegram.org/bot8029087587:AAFgw827hRvzNtmakLBtfNZx1ZJTd4vRY3Q/sendMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          chat_id: tg.initDataUnsafe.user.id,
          text: `Форма с десктопа:\n${JSON.stringify(formData, null, 2)}`,
          disable_web_page_preview: true
        })
      });
      console.log('Десктоп данные отправлены через API');
      return true;
    } catch (e) {
      console.error('Ошибка отправки для десктопа:', e);
    }
  }

  // 3. Универсальный резервный метод
  try {
    window.location.href = `https://t.me/${tg.initDataUnsafe.user.username}?start=webappdata_${encodeURIComponent(JSON.stringify(formData))}`;
    return true;
  } catch (e) {
    console.error('Ошибка универсального метода:', e);
    return false;
  }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const success = await sendFormData();
  
  if (success) {
    document.getElementById('form').style.display = 'none';
    document.getElementById('success').style.display = 'block';
    setTimeout(() => tg.close(), 1500);
  } else {
    alert('Не удалось отправить данные. Попробуйте позже.');
  }
});
