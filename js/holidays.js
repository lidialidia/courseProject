import { changeDateFormat } from "./helpers.js";

export const holidaysTable = document.querySelector('.holidays__table');
export const selectYears = document.querySelector('#years');
export const API_KEY = 'AezJyO2qVghUd7RCSO87eMZWIEhKWUIu';
export const selectCountries = document.querySelector('#countries');

export const createTableHeadHolidays = () => {
    if (!holidaysTable.querySelector('.table')) {
        holidaysTable.innerHTML = `
            <div class="table">
                <div class="thead">
                    <div class="tr">
                        <div class="th">Дата <span class="sort" data-type="date"></span></div>
                        <div class="th">Назва свята <span class="sort" data-type="name"></span></div>
                        <div class="th">Тип свята <span class="sort" data-type="type"></span></div>
                    </div>
                </div>
                <div class="tbody"></div>
            </div>
        `;
    }
}

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

export const fillCountriesSelect = async () => {
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

export const createYears = () => {

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

export const getTableRowDataHolidays = async () => {

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

export const addRows = (data) => {
    const tbody = holidaysTable.querySelector('.tbody');

    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = createTableRowHolidays(row);
        tbody.append(tr);
    });
}