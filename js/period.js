export const period = () => {

    const PERIOD_LOCALSTORAGE_KEY = 'PERIOD_ITEMS';

    const dateInputs = document.querySelector('.period__inputs');
    const preset = document.querySelector('.period__items_preset');
    const days = document.querySelectorAll('.period__items_days .period__input');
    const startDate = document.querySelector('#startDate');
    const endDate = document.querySelector('#endDate');
    const dimension = document.querySelectorAll('.period__items_dimension .period__input');
    const count = document.querySelector('.period__btn_count');
    const resultTable = document.querySelector('.period__table');
    const form = document.querySelector('.period__form');
    let dayType;
        
    // це я винесла, бо код дублювався
    const selectDate = (input, value) => {
        let startDateValue = new Date(input.value);
        startDateValue.setDate(startDateValue.getDate() + value);
        return startDateValue.toISOString().split('T')[0];
    }
        
    // тут я перевіряю яке поле обрано перший, і в залежності від того перше чи друге - задаю мінімальне чи максимальне значення іншому полю
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
    const selectPreset = (value) => {
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

    // тут в залежності від того, на яку кнопку клікнув користувач додаю дата атрибут, він мені знадобиться нижче, коди я хочу в таблицю додату інформацію про пресет, який обрав користувач; а ще задаю час проміжок часу
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

        return result;
        
    }

    const getTableRowData = () => {
        const dayType = Array.from(document.querySelectorAll('.period__items_days .period__input')).find(el => el.checked === true);
        const countResultValue = countResult();

        return {
            'startDate': startDate.value,
            'endDate': endDate.value,
            'dayType': dayType.parentElement.textContent,
            'result': countResultValue
        }
    }

    const createTableRow = (rowData) => {
        let result = document.createElement('div');
        result.classList.add('tr');

        let countResultMarkup = `
            <div>
                ${rowData.result.map(item => {
                    return `<div>${item}</div>`
                }).join(' ')}
            </div>
        `

        result.innerHTML = `
            <div class="td">${rowData.startDate}</div>
            <div class="td">${rowData.endDate}</div>
            <div class="td">${rowData.dayType}</div>
            <div class="td">${countResultMarkup}</div>
        `;
        return result;
    }

    const createTableHead = () => {
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

    const addToLocalStorate = (rowData) => {
        let periodData = JSON.parse(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY)) || [];
        periodData.unshift(rowData);
        if(periodData.length == 11) {
            periodData.pop()
        }
        localStorage.setItem(PERIOD_LOCALSTORAGE_KEY, JSON.stringify(periodData))
    }

    const getFromLocalStorage = () => {
        if(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY)) {
            createTableHead();
            let tbody = document.querySelector('.tbody');
            const periodData = JSON.parse(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY));
            periodData.forEach(item => {
                const tr = createTableRow(item);
                tbody.append(tr);
            })
        }
    }

    // ця функція у мене працює при кліку на кнопку "Порахувати", вона виводить таблицю результатів (в результати я виводжу все, що обрав користувач), але у мене виводиться лише один варіант, останній, тобто я щоразу перезаписую таблицю
    //переробила, тепер добавляється нова інформація
    const showResult = (event) => {

        event.preventDefault();

        if (!resultTable.querySelector('.table')) {
            createTableHead();
        }

        const tableRowData = getTableRowData();

        addToLocalStorate(tableRowData);

        const tbody = document.querySelector('.tbody');
        const tr = createTableRow(tableRowData);
        tbody.prepend(tr);

        form.reset();
        endDate.disabled = true;
    }

    dateInputs.addEventListener('input', (event) => onChangeDate(event));
    preset.addEventListener('click', (event) => onChangePreset(event));
    form.addEventListener('submit', (event) => showResult(event));

    getFromLocalStorage()
}

period();