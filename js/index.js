import { createTableHead, createTableRow, getTableRowData } from './period.js';
import { createTableHeadHolidays, changeDateFormat } from './holidays.js';

// first tab
const formPeriod = document.querySelector('.period__form');
const PERIOD_LOCALSTORAGE_KEY = 'PERIOD_ITEMS';
const resultTable = document.querySelector('.period__table');
const MAX_ROWS = 10;

const addToLocalStorate = (rowData) => {
    let periodData = JSON.parse(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY)) || [];
    periodData.unshift(rowData);
    if(periodData.length == MAX_ROWS + 1) {
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

const selectCountries = document.querySelector('#countries');
const formHolidays = document.querySelector('.holidays__form');
const selectYears = document.querySelector('#years');
const holidaysTable = document.querySelector('.holidays__table');

const API_KEY = 'AezJyO2qVghUd7RCSO87eMZWIEhKWUIu';

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

const fillCountriesSelect = async () => {
    try {
        const countries = await getCountries();

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country['iso-3166'];
            option.textContent = country.country_name;
            selectCountries.append(option);
        })

    } catch (error) {
        document.querySelector('.holidays__error').innerHTML = `<div class="error">Халепа! Сталася помилка при виконанні запиту. Будь ласка, спробуйте ще раз або зверніться до адміністратора сайту.</div>`;
    }
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

    let formattedDate = changeDateFormat(rowData.date);

    result.innerHTML = `
        <div class="td">${formattedDate}</div>
        <div class="td">${rowData.name}</div>
        <div class="td">${rowData.type}</div>
    `;

    return result;
}

const sortTable = (arr, type, isAscending) => {
    return arr.sort((a, b) => {
        if (a[type] > b[type]) {
            return isAscending ? 1 : -1;
        }
        if (a[type] < b[type]) {
            return isAscending ? -1 : 1;
        }
        return 0;
    })
}

const onSort = (event, data) => {
    const target = event.target.closest(".sort");
    
    if(target){
        document.querySelectorAll('.sort').forEach(item => {
            if(item !== target) {
                item.parentElement.classList.remove('active')
                item.classList.remove('asc', 'desc')
            }
        })
        target.parentElement.classList.add('active');
        if (target.classList.contains('asc')) {
            target.classList.remove('asc');
            target.classList.add('desc');
        } else {
            target.classList.remove('desc');
            target.classList.add('asc');
        }
        addRows(sortTable(data, target.getAttribute('data-type'), target.classList.contains('asc')))
    }
}

const addRows = (data) => {
    const tbody = holidaysTable.querySelector('.tbody');

    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = createTableRowHolidays(row);
        tbody.append(tr);
    });
}

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