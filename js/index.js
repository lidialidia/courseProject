import { createTableHead, createTableRow, getTableRowData } from './period.js';
import { createTableHeadHolidays } from './holidays.js';

// first tab
const formPeriod = document.querySelector('.period__form');
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

const showResult = (event) => {

    event.preventDefault();

    if (!resultTable.querySelector('.table')) {
        createTableHead();
    }

    const tableRowData = getTableRowData();

    addToLocalStorate(tableRowData);

    const tbody = resultTable.querySelector('.tbody');
    const tr = createTableRow(tableRowData);
    tbody.prepend(tr);

    formPeriod.reset();
    endDate.disabled = true;
}

formPeriod.addEventListener('submit', showResult);

getFromLocalStorage();

// second tab

const selectCountries = document.querySelector('#countries');
const formHolidays = document.querySelector('.holidays__form');
const selectYears = document.querySelector('#years');
const holidaysTable = document.querySelector('.holidays__table');

const API_KEY = 'ubivWwsPRVmcPHVzsOuq8eN56b1OwdEV';

const getCountries = async () => {
    const response = await fetch(
      `https://calendarific.com/api/v2/countries?api_key=${API_KEY}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }
  
    return data.response.countries;
};

const createOption = async () => {
    try {
        const countries = await getCountries();

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country['iso-3166'];
            option.textContent = country.country_name;
            selectCountries.append(option);
        })

    } catch (error) {
        console.error('Error creating country options:', error.message);
    }
};

const getHolidays = async (country, year) => {
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }

    return data.response.holidays;
};

const createYears = () => {

    const currentYear = new Date().getFullYear();

    for(let year = 2001; year <= 2049; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        if (Number(option.value) === Number(currentYear)) {
            option.selected = true;
        }
        selectYears.append(option);
    }
}

const getTableRowDataHolidays = async () => {

    let country,
        year;

    Array.from(selectCountries.options).forEach(option => {
        if(option.selected === true) {
            country = option.value;
        }
    });
    Array.from(selectYears.options).forEach(option => {
        if(option.selected === true) {
            year = option.value;
        
        }
    });

    const holidays = await getHolidays(country, year);

    return holidays.map(holiday => {
        return {
            'date': holiday.date.iso,
            'name': holiday.name,
            'type': holiday.type[0]
        }
    })
}

const createTableRowHolidays = (rowData) => {
    let result = document.createElement('div');
    result.classList.add('tr');

    console.log(rowData);

    result.innerHTML = `
        <div class="td">${rowData.date}</div>
        <div class="td">${rowData.name}</div>
        <div class="td">${rowData.type}</div>
    `;

    return result;
}

const showHollidays = async (event) => {
    event.preventDefault();

    const tableRowData = await getTableRowDataHolidays();

    createTableHeadHolidays();

    const tbody = holidaysTable.querySelector('.tbody');

    tbody.innerHTML = '';

    tableRowData.forEach(row => {
        const tr = createTableRowHolidays(row);
        tbody.append(tr);
    })
    
}

formHolidays.addEventListener('submit', showHollidays);

// tabs
const tabs = function () {

    const links = document.querySelectorAll('.tabs__link');
    const content = document.querySelectorAll('.tabs__content');

    const showContent = (event, index) => {
        let link =  event.target;
        links.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        content.forEach(item => item.classList.remove('active'));
        content[index].classList.add('active');
        if (link.classList.contains('active', 'tabs__link_holidays')) {
            createOption();
            createYears();
        }
    }

    links.forEach((link, index) => {
        link.addEventListener('click', (event) => showContent(event, index));
    });
}

tabs();