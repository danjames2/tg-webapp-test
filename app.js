// Проверка инициализации Telegram API
if (!window.Telegram?.WebApp) {
    alert('Telegram WebApp API не загружен!');
    throw new Error('Telegram WebApp not available');
}

const tg = Telegram.WebApp;
tg.expand();

// Тестовая функция отправки
function sendTestData() {
    const testData = {
        _test: true,
        timestamp: Date.now(),
        user_id: tg.initDataUnsafe.user?.id
    };
    
    console.log('Отправка данных:', testData);
    
    try {
        // Основной метод
        tg.sendData(JSON.stringify(testData));
        alert('Данные отправлены через sendData()');
        
        // Резервный метод
        fetch(`https://api.telegram.org/bot7392805578:AAH-1UwY07r8Z-Br98TegCfxgYV_fJTJsEM/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: tg.initDataUnsafe.user?.id,
                text: `Резервная отправка: ${JSON.stringify(testData)}`
            })
        });
    } catch (e) {
        alert(`Ошибка: ${e.message}`);
        console.error('Ошибка отправки:', e);
    }
}

// Добавляем кнопку для теста
const testBtn = document.createElement('button');
testBtn.textContent = 'ТЕСТ: Отправить данные';
testBtn.style.cssText = 'position:fixed; top:10px; right:10px; z-index:9999; padding:10px; background:red; color:white;';
testBtn.onclick = sendTestData;
document.body.appendChild(testBtn);
