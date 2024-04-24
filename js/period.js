import { changeDateFormat } from "./helpers.js";

export const dateInputs = document.querySelector('.period__inputs');
export const preset = document.querySelector('.period__items_preset');
export const startDate = document.querySelector('#startDate');
export const endDate = document.querySelector('#endDate');
export const resultTable = document.querySelector('.period__table');
export let dayType;
const days = document.querySelectorAll('.period__items_days .period__input');
const dimension = document.querySelectorAll('.period__items_dimension .period__input');
const count = document.querySelector('.period__btn_count');

export const selectDate = (input, value) => {
    let startDateValue = new Date(input.value);
    startDateValue.setDate(startDateValue.getDate() + value);
    return startDateValue.toISOString().split('T')[0];
}

const onChangeDate = (event) => {
    const input = event.target;

    if(input === startDate) {
        endDate.disabled = false;
        endDate.min = selectDate(input, 1)
    }

    if(startDate.value !== '' && endDate.value !== '') {
        count.classList.remove('disabled');
    }
}

// тут я роблю пресет, обираю тиждень або місяць, але якщо користувач не обрав нічого, то за початкову дату - беру сьогодні
export const selectPreset = (value) => {
    if (startDate.value !== '') {
        endDate.value = selectDate(startDate, value);
    }
    else {
        const today = new Date();
        startDate.value = today.toISOString().split('T')[0];
        endDate.disabled = false;
        endDate.value = selectDate(startDate, value);
    }
    if(startDate.value !== '' && endDate.value !== '') {
        count.classList.remove('disabled');
    }
}

const onChangePreset = (event) => {
    event.preventDefault();
    const element = event.target;

    preset.querySelectorAll('.period__btn_preset').forEach(item => {
        if(element !== item) {
            item.removeAttribute('data-state');
        }
    })
    element.setAttribute('data-state', 'selected');
    let presetValue = element.getAttribute('data-value');

    if (presetValue === 'week') {
        selectPreset(7);
    }

    if (presetValue === 'month') {
        selectPreset(30);
    }

}

// переробила 3 функції на одну
const isWeekend = (day) => {

    if (day === 0 || day === 6) { // Якщо це вихідний день
        return true;
    }

    return false;

}

const findDaysAmount = (firstDate, lastDate, type) => {

    let currentDate = new Date(firstDate),
        count = 0;

    while (currentDate < lastDate) {
        let dayOfWeek = currentDate.getDay();
        if (type === 'weekdays') {
            if (!isWeekend(dayOfWeek)) { // Якщо це будній день
                count++;
            }
        } else if (type === 'weekends') {
            if (isWeekend(dayOfWeek)) { // Якщо це вихідний день
                count++;
            }
        } else {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1); // Переходимо до наступного дня
    }

    return count;
}

// тут я вже викликаю ті функції, коли користувач обрав якийсь із радіо баттонів
const onCheckDaysType = () => {
    let daysType;

    let startDateValue = new Date(startDate.value),
        endDateValue = new Date(endDate.value);

    days.forEach(item => {
        if(item.checked === true) {
            daysType = item.value;
        }
    })

    let daysAmount = findDaysAmount(startDateValue, endDateValue, daysType)

    return daysAmount;

}

// ця функція обчислює скільки хвилин, годин і т.д. в проміжку, що обрав користувач і всі результати (бо я робила це як чекбокс, дала можливість обрати всі варіанти) додаю в масив, а потім то все виведу в таблицю
const countResult = () => {

    let daysAmount = onCheckDaysType();
    let result = [];


    dimension.forEach(item => {
        if(item.checked === true) {
            if (item.value === 'days') {
                result.push('Дні: ' + daysAmount);
            }
            else if (item.value === 'hours') {
                result.push('Години: ' + daysAmount * 24);
            }
            else if (item.value === 'minutes') {
                result.push('Хвилини: ' + daysAmount * 1440);
            }
            else if (item.value === 'seconds') {
                result.push('Секунди: ' + daysAmount * 86400);
            }
        }
    })

    if (!result.length) {
        result.push('<span class="error-text">Нічого не обрано</span>');
    }

    return result;
    
}

export const getTableRowData = () => {
    const dayType = Array.from(document.querySelectorAll('.period__items_days .period__input')).find(el => el.checked === true);
    const countResultValue = countResult();

    return {
        'startDate': startDate.value,
        'endDate': endDate.value,
        'dayType': dayType.parentElement.textContent,
        'result': countResultValue
    }
}

export const createTableHead = () => {
    resultTable.innerHTML = `
        <div class="table">
            <div class="thead">
                <div class="tr">
                    <div class="th">Початкова дата</div>
                    <div class="th">Кінцева дата</div>
                    <div class="th">Міра</div>
                    <div class="th">Результат</div>
                </div>
            </div>
            <div class="tbody"></div>
        </div>
    `;
}

export const createTableRow = (rowData) => {
    let result = document.createElement('div');
    result.classList.add('tr');

    let countResultMarkup = `
        <div>
            ${rowData.result.map(item => {
                return `<div>${item}</div>`
            }).join(' ')}
        </div>
    `;

    let formattedStartDate = changeDateFormat(rowData.startDate),
        formattedEndDate = changeDateFormat(rowData.endDate)

    result.innerHTML = `
        <div class="td">${formattedStartDate}</div>
        <div class="td">${formattedEndDate}</div>
        <div class="td">${rowData.dayType}</div>
        <div class="td">${countResultMarkup}</div>
    `;
    return result;
}

dateInputs.addEventListener('input', onChangeDate);
preset.addEventListener('click', onChangePreset);