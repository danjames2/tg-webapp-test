// Проверка инициализации
if (!window.Telegram?.WebApp) {
    document.body.innerHTML = '<h1 style="color:red">Ошибка: Telegram WebApp не загружен</h1>';
    throw new Error('Telegram WebApp API недоступен');
}

const tg = Telegram.WebApp;
tg.expand();

// Функция отправки с тремя методами
async function sendData(formData) {
    // 1. Основной метод
    try {
        tg.sendData(JSON.stringify(formData));
        console.log('Данные отправлены через sendData()');
        return true;
    } catch (e) {
        console.warn('Ошибка sendData:', e);
    }

    // 2. Альтернативный метод через Bot API
    try {
        await fetch(`https://api.telegram.org/bot7392805578:AAH-1UwY07r8Z-Br98TegCfxgYV_fJTJsEM/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: tg.initDataUnsafe.user.id,
                text: `Данные формы:\n${JSON.stringify(formData)}`
            })
        });
        console.log('Данные отправлены через Bot API');
        return true;
    } catch (e) {
        console.error('Ошибка Bot API:', e);
    }

    // 3. Резервный метод (только для десктопных версий)
    if (tg.platform !== 'tdesktop') {
        try {
            window.open(`https://t.me/test3000_test_bot?start=${encodeURIComponent(JSON.stringify(formData))}`);
            return true;
        } catch (e) {
            console.error('Ошибка открытия ссылки:', e);
        }
    }

    return false;
}

// Обработка формы
document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        message: document.getElementById('userMessage').value
    };

    const success = await sendData(formData);
    
    if (success) {
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('successContainer').style.display = 'block';
        setTimeout(() => tg.close(), 2000);
    } else {
        alert('Не удалось отправить данные. Попробуйте позже.');
    }
});

console.log('Init Data:', Telegram.WebApp.initDataUnsafe);