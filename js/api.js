export const API_KEY = 'AezJyO2qVghUd7RCSO87eMZWIEhKWUIu';

export const getCountries = async () => {
    const response = await fetch(
      `https://calendarific.com/api/v2/countries?api_key=${API_KEY}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }
  
    return data.response.countries;
};

export const getHolidays = async (country, year) => {
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`
    );
    const data = await response.json();
  
    if (!response.ok) {  
      throw new Error(`Something went wrong! Details: ${data.message}`);
    }

    return data.response.holidays;
};