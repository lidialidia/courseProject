const holidaysTable = document.querySelector('.holidays__table');

export const createTableHeadHolidays = () => {
    if (!holidaysTable.querySelector('.table')) {
        holidaysTable.innerHTML = `
            <div class="table">
                <div class="thead">
                    <div class="tr">
                        <div class="th">Дата</div>
                        <div class="th">Назва свята</div>
                        <div class="th">Тип свята</div>
                    </div>
                </div>
                <div class="tbody"></div>
            </div>
        `;
    }
}