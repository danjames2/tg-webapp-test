const tg = Telegram.WebApp;
tg.expand();

// Универсальная функция отправки
function sendToBot(data) {
    // Для десктопной версии
    if (tg.platform === 'tdesktop' || tg.platform === 'macos') {
        window.location.href = `https://t.me/${tg.initDataUnsafe.user?.username}?start=webapp_${encodeURIComponent(JSON.stringify(data))}`;
        return;
    }
    
    // Для мобильных версий
    try {
        tg.sendData(JSON.stringify(data));
    } catch (e) {
        // Резервный метод
        fetch(`https://api.telegram.org/bot7392805578:AAH-1UwY07r8Z-Br98TegCfxgYV_fJTJsEM/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chat_id: tg.initDataUnsafe.user?.id,
                text: `WebApp Data:\n${JSON.stringify(data, null, 2)}`
            })
        });
    }
}

// Обработчик кнопки
document.getElementById('testBtn').onclick = () => {
    const testData = {
        _test: true,
        timestamp: Date.now(),
        platform: tg.platform,
        version: tg.version
    };
    
    sendToBot(testData);
    tg.close();
};
