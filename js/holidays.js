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