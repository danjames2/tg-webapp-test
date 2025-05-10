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

document.getElementById('forceSend').addEventListener('click', () => {
    const testData = {
        test: "123",
        _debug: true,
        timestamp: Date.now()
    };
    
    // Все три метода отправки
    try {
        // 1. Основной метод
        Telegram.WebApp.sendData(JSON.stringify(testData));
        console.log('Sent via sendData()');
        
        // 2. Альтернативный метод
        Telegram.WebApp.postEvent('web_app_data_send', {data: JSON.stringify(testData)});
        
        // 3. Резервный метод
        fetch(`https://api.telegram.org/bot7392805578:AAH-1UwY07r8Z-Br98TegCfxgYV_fJTJsEM/sendMessage`, {
            method: 'POST',
            body: new URLSearchParams({
                chat_id: Telegram.WebApp.initDataUnsafe.user.id,
                text: `DEBUG: ${JSON.stringify(testData)}`
            })
        });
    } catch (e) {
        console.error('Force send failed:', e);
    }
});

// Инициализация
console.log('WebApp initialized:', {
    version: tg.version,
    platform: tg.platform,
    user: tg.initDataUnsafe.user
});
