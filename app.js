// 1. ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP
let tg = window.Telegram.WebApp;

// Инициализируем приложение
tg.ready();
tg.expand();

// 2. ПОЛУЧЕНИЕ ДАННЫХ О ПОЛЬЗОВАТЕЛЕ
const userData = tg.initDataUnsafe.user;
console.log("Данные от Telegram:", userData);

// Отображаем имя пользователя на сайте
if (userData && userData.first_name) {
    document.getElementById('user-first-name').textContent = userData.first_name;
} else {
    document.getElementById('user-first-name').textContent = "Друг";
    // Если данных нет (запуск вне Telegram), показываем тестовые кнопки
    showTestModeNotice();
}

// 3. РАБОТА С ГЛАВНОЙ КНОПКОЙ TELEGRAM
tg.MainButton.setText("🎁 Забрать бонус 100 TON");
tg.MainButton.setParams({ color: "#6ab3ff" });
tg.MainButton.onClick(mainButtonClickHandler);
tg.MainButton.show();

function mainButtonClickHandler() {
    tg.showPopup({
        title: "Поздравляем!",
        message: "Бонус в 100 TON зачислен на ваш игровой баланс!",
        buttons: [{ type: "ok" }]
    }, function(buttonId) {
        if (buttonId === 'ok') {
            updateBalance(100);
            tg.MainButton.hide();
        }
    });
}

// 4. ФУНКЦИИ ДЛЯ КНОПОК НА САЙТЕ
function requestDeposit() {
    tg.showAlert("Функция пополнения в разработке. Для демо используйте главную кнопку 'Забрать бонус'.");
}

function claimDailyBonus() {
    const bonusAmount = 50;
    tg.showConfirm(
        `Забрать ежедневный бонус ${bonusAmount} TON?`,
        function(result) {
            if (result) {
                updateBalance(bonusAmount);
                tg.showAlert(`Бонус в ${bonusAmount} TON зачислен!`);
            }
        }
    );
}

function launchGame(gameName) {
    tg.showPopup({
        title: `Запуск игры`,
        message: `Игра "${gameName}" запускается... (Демо-версия)`,
        buttons: [
            { id: "play", type: "default", text: "Играть" },
            { id: "close", type: "cancel" }
        ]
    }, function(buttonId) {
        if (buttonId === 'play') {
            tg.showAlert("В полной версии здесь началась бы игра!");
        }
    });
}

// 5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function updateBalance(amountToAdd) {
    const balanceElement = document.getElementById('user-balance');
    let currentBalance = parseInt(balanceElement.textContent) || 0;
    currentBalance += amountToAdd;
    balanceElement.textContent = currentBalance + " TON";
    // Эффект при обновлении
    balanceElement.style.transform = "scale(1.2)";
    setTimeout(() => balanceElement.style.transform = "scale(1)", 300);
}

// Режим тестирования, если сайт открыт вне Telegram
function showTestModeNotice() {
    const testHtml = `
        <div style="background: #ffcc00; color: #000; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <strong>🔧 Режим тестирования</strong><br>
            Сайт открыт вне Telegram. Для полной функциональности запустите его через бота в Telegram.
            <br><br>
            <button onclick="simulateTelegramLaunch()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Сымитировать запуск в Telegram
            </button>
        </div>
    `;
    document.querySelector('.container').insertAdjacentHTML('afterbegin', testHtml);
}

// Функция для симуляции запуска в Telegram (только для теста)
window.simulateTelegramLaunch = function() {
    alert("В демо-режиме это сымитирует данные пользователя. В реальности эта функция не нужна.");
    document.getElementById('user-first-name').textContent = "ТестовыйПользователь";
    updateBalance(1000);
};