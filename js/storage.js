export const PERIOD_LOCALSTORAGE_KEY = 'PERIOD_ITEMS';
export const MAX_ROWS = 10;

export const addToLocalStorate = (rowData) => {
    let periodData = JSON.parse(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY)) || [];
    periodData.unshift(rowData);
    if(periodData.length == MAX_ROWS + 1) {
        periodData.pop()
    }
    localStorage.setItem(PERIOD_LOCALSTORAGE_KEY, JSON.stringify(periodData))
}

export const getFromLocalStorage = () => {
    if(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY)) {
        const periodData = JSON.parse(localStorage.getItem(PERIOD_LOCALSTORAGE_KEY));
        return periodData;
    }
}