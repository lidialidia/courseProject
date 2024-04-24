import { createTableHead, createTableRow, getTableRowData, resultTable, endDate } from './period.js';
import { createTableHeadHolidays, getTableRowDataHolidays, addRows, fillCountriesSelect, createYears } from './holidays.js';
import { addToLocalStorate, getFromLocalStorage, MAX_ROWS } from './storage.js';
import { onSort } from './helpers.js';

// first tab
const formPeriod = document.querySelector('.period__form');

const showResult = (event) => {

    event.preventDefault();

    if (!resultTable.querySelector('.table')) {
        createTableHead();
    }

    const tableRowData = getTableRowData();

    addToLocalStorate(tableRowData);

    const tbody = resultTable.querySelector('.tbody');
    
    tbody.prepend(createTableRow(tableRowData));
    
    if(tbody.querySelectorAll('.tr').length === MAX_ROWS + 1) {
        tbody.removeChild(tbody.lastChild)
    }


    const count = document.querySelector('.period__btn_count');
    formPeriod.reset();
    endDate.disabled = true;
    count.classList.add('disabled');
}

formPeriod.addEventListener('submit', showResult);

getFromLocalStorage();

// second tab
const formHolidays = document.querySelector('.holidays__form');

const showHollidays = async (event) => {
    event.preventDefault();

    document.removeEventListener('click', onSort);

    const tableRowData = await getTableRowDataHolidays();

    createTableHeadHolidays();

    let ths = document.querySelectorAll('.th');

    ths.forEach(th => {
        if ( th.classList.contains('active')) {
            th.classList.remove('active');
            th.querySelector('.sort').classList.remove('asc', 'desc');
        }
    })

    addRows(tableRowData);

    document.addEventListener('click', (event) => onSort(event, tableRowData));

}

formHolidays.addEventListener('submit', showHollidays);

// tabs

const tabs = function () {

    const links = document.querySelectorAll('.tabs__link');
    const content = document.querySelectorAll('.tabs__content');

    const showContent = (event, index) => {
        event.preventDefault();

        let link =  event.target;
        const tabId = link.getAttribute('data-tab-id');

        links.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        content.forEach(item => item.classList.remove('active'));
        content[index].classList.add('active');
        if (link.classList.contains('active', 'tabs__link_holidays')) {
            fillCountriesSelect();
            createYears();
        }
        history.pushState(null, null, `?tab=${tabId}`);
    }

    links.forEach((link, index) => {
        link.addEventListener('click', (event) => showContent(event, index));
    });
}

const init = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const links = document.querySelectorAll('.tabs__link');
    const content = document.querySelectorAll('.tabs__content');

    tabs();

    links.forEach((link, index) => {
        const tabId = link.getAttribute('data-tab-id');
    
        if (urlParams.has('tab')) {
            if (urlParams.get('tab') === tabId) {
                link.classList.add('active');
                content[index].classList.add('active');
                if (tabId === 'holidaysList') {
                    fillCountriesSelect();
                    createYears();
                }
            }
        } else {
            links[0].classList.add('active');
            content[0].classList.add('active');
        }
    })

}

init();