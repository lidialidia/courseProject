const holidaysTable = document.querySelector('.holidays__table');

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

export const changeDateFormat = (unformattedDate) => {
    let date = new Date(unformattedDate);
    let formattedDate;

    let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    formattedDate = `${day}.${month}.${year}`;

    return formattedDate;
}