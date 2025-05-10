// Проверяем инициализацию Telegram WebApp
if (!window.Telegram?.WebApp) {
    document.body.innerHTML = '<h1 style="color:red;padding:20px">ERROR: Telegram WebApp API not loaded</h1>';
    throw new Error('Telegram WebApp not available');
}

const tg = Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Функция отправки данных с тремя уровнями резервирования
async function sendFormData(formData) {
    // Метод 1: Основной (через Telegram API)
    try {
        tg.sendData(JSON.stringify(formData));
        console.log('Data sent via sendData()');
        return true;
    } catch (e) {
        console.warn('sendData failed:', e);
    }

    // Метод 2: Через Bot API (резервный)
    try {
        const response = await fetch(`https://api.telegram.org/bot7392805578:AAH-1UwY07r8Z-Br98TegCfxgYV_fJTJsEM/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: tg.initDataUnsafe.user?.id,
                text: `Form data:\n${JSON.stringify(formData, null, 2)}`
            })
        });
        console.log('Data sent via Bot API', await response.json());
        return true;
    } catch (e) {
        console.error('Bot API failed:', e);
    }

    // Метод 3: Крайний случай (для десктопных клиентов)
    if (tg.platform === 'tdesktop') {
        window.location.href = `https://t.me/${tg.initDataUnsafe.user?.username}?start=${encodeURIComponent(JSON.stringify(formData))}`;
        return true;
    }

    return false;
}

// Обработка формы
document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        message: document.getElementById('userMessage').value,
        _webApp: true,
        _timestamp: Date.now()
    };

    const success = await sendFormData(formData);
    
    if (success) {
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('successContainer').style.display = 'block';
        setTimeout(() => tg.close(), 3000);
    } else {
        alert('Failed to send data. Please try again later.');
    }
});

// Инициализация
console.log('WebApp initialized:', {
    version: tg.version,
    platform: tg.platform,
    user: tg.initDataUnsafe.user
});
