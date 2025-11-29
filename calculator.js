const serviceData = {
    basic: {
        basePrice: 500,
        hasOptions: false,
        hasProperty: false
    },
    premium: {
        basePrice: 1000,
        hasOptions: true,
        hasProperty: false,
        options: [
            { value: 'standard', label: 'Стандартная опция (+0 руб.)', priceModifier: 0 },
            { value: 'advanced', label: 'Продвинутая опция (+200 руб.)', priceModifier: 200 },
            { value: 'premium', label: 'Премиум опция (+500 руб.)', priceModifier: 500 }
        ]
    },
    custom: {
        basePrice: 1500,
        hasOptions: false,
        hasProperty: true,
        propertyPrice: 300
    }
};

// Получаем элементы DOM
const quantityInput = document.getElementById('quantity');
const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
const optionsContainer = document.getElementById('options-container');
const optionsSelect = document.getElementById('options');
const propertyContainer = document.getElementById('property-container');
const propertyCheckbox = document.getElementById('property');
const priceResult = document.getElementById('price-result');

// Инициализация калькулятора
function initCalculator() {
    // Устанавливаем обработчики событий
    quantityInput.addEventListener('input', calculatePrice);
    
    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateInterface();
            calculatePrice();
        });
    });
    
    optionsSelect.addEventListener('change', calculatePrice);
    propertyCheckbox.addEventListener('change', calculatePrice);
    
    // Инициализируем интерфейс
    updateInterface();
    calculatePrice();
}

// Обновление интерфейса в зависимости от выбранного типа услуги
function updateInterface() {
    const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
    const service = serviceData[selectedType];
    
    // Управляем видимостью контейнера опций
    if (service.hasOptions) {
        optionsContainer.classList.remove('hidden');
        // Заполняем опции
        optionsSelect.innerHTML = '';
        service.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            optionsSelect.appendChild(optionElement);
        });
    } else {
        optionsContainer.classList.add('hidden');
    }
    
    // Управляем видимостью контейнера свойств
    if (service.hasProperty) {
        propertyContainer.classList.remove('hidden');
    } else {
        propertyContainer.classList.add('hidden');
    }
}

// Расчет стоимости
function calculatePrice() {
    const quantity = parseInt(quantityInput.value) || 0;
    const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
    const service = serviceData[selectedType];
    if(quantity < 1){
        let quantity = 0;
    }
    let price = service.basePrice * quantity;
    
    
    // Добавляем стоимость опции для премиум услуги
    if (service.hasOptions) {
        const selectedOption = optionsSelect.value;
        const option = service.options.find(opt => opt.value === selectedOption);
        price += option.priceModifier * quantity;
    }
    
    // Добавляем стоимость свойства для кастомной услуги
    if (service.hasProperty && propertyCheckbox.checked) {
        price += service.propertyPrice * quantity;
    }
    
    // Обновляем отображение цены
    priceResult.textContent = `Стоимость: ${price.toLocaleString('ru-RU')} руб.`;
    
    // Добавляем анимацию обновления
    priceResult.classList.add('updated');
    setTimeout(() => {
        priceResult.classList.remove('updated');
    }, 300);
}

// Инициализируем калькулятор после загрузки DOM
document.addEventListener('DOMContentLoaded', initCalculator);
