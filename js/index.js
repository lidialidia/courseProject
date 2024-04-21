import {tabs} from './tabs.js';
import { createTableRow, getTableRowData } from './period.js';
import { holidays} from './holidays.js';

tabs();

// first tab
const form = document.querySelector('.period__form');
const PERIOD_LOCALSTORAGE_KEY = 'PERIOD_ITEMS';
const resultTable = document.querySelector('.period__table');

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

form.addEventListener('submit', showResult);

getFromLocalStorage();