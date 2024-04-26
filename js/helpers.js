import { addRows } from './holidays.js';

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

export const onSort = (event, data) => {
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

export const sortTable = (arr, type, isAscending) => {
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