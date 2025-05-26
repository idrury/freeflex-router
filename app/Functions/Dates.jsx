export const Dates = [
  { name: 'January', number: 0, daysInMonth: 31 },
  { name: 'February', number: 1, daysInMonth: 28 },
  { name: 'March', number: 2, daysInMonth: 31 },
  { name: 'April', number: 3, daysInMonth: 30 },
  { name: 'May', number: 4, daysInMonth: 31 },
  { name: 'June', number: 5, daysInMonth: 30 },
  { name: 'July', number: 6, daysInMonth: 31 },
  { name: 'August', number: 7, daysInMonth: 31 },
  { name: 'September', number: 8, daysInMonth: 30 },
  { name: 'October', number: 9, daysInMonth: 31 },
  { name: 'November', number: 10, daysInMonth: 30 },
  { name: 'December', number: 11, daysInMonth: 31 },
];

export const DatesAbbr = [
  { name: 'Jan', number: 0, daysInMonth: 31 },
  { name: 'Feb', number: 1, daysInMonth: 28 },
  { name: 'Mar', number: 2, daysInMonth: 31 },
  { name: 'Apr', number: 3, daysInMonth: 30 },
  { name: 'May', number: 4, daysInMonth: 31 },
  { name: 'Jun', number: 5, daysInMonth: 30 },
  { name: 'Jul', number: 6, daysInMonth: 31 },
  { name: 'Aug', number: 7, daysInMonth: 31 },
  { name: 'Sep', number: 8, daysInMonth: 30 },
  { name: 'Oct', number: 9, daysInMonth: 31 },
  { name: 'Nov', number: 10, daysInMonth: 30 },
  { name: 'Dec', number: 11, daysInMonth: 31 },
];

function extractMonthNames() {
  return Dates.map(month => month.name);
}

function extractAbbrNames() {
  return DatesAbbr.map(month => month.name);
}

export function getMonthName(monthNumber, abbr) {

  let months = [];

  if(!abbr) {
    months = extractMonthNames();
  } else {
    months = extractAbbrNames();
  }
  
  // Ensure the monthNumber is within the valid range (1 to 12)
  if (monthNumber >= 0 && monthNumber <= 11) {
    return months[monthNumber];
  } else
      return 'Invalid month number';
}


export function getLastYearString() {
  let today = new Date();
  return `${today.getFullYear()-1}-${today.getMonth()+1}-${1}`;
}

export function getDaysInMonth(monthNumber) {
  const selectedMonth = Dates.find(month => month.number === monthNumber);

  if (selectedMonth) {
      return selectedMonth.daysInMonth;
  } else
      return null;
}

export function getMonthDates(d) {

  var date = new Date(d);
  date.setDate(1);
  let offset = date.getDay();
  let daysInCurrentMonth = getDaysInMonth(date.getMonth());
  
  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, index) => index + 1);

  const sunArray = [];
  const monArray = [];
  const tuesArray = [];
  const wedArray = [];
  const thursArray = [];
  const FriArray = [];
  const satArray = [];


  //Get Fridays
  daysArray.forEach(day => {

    switch((day+offset) % 7) {
      case 1:
        sunArray.push(day);
        break;
      case 2:
        monArray.push(day);
        break;
      case 3:
        tuesArray.push(day);
        break;
      case 4:
        wedArray.push(day);
        break;
      case 5:
        thursArray.push(day);
        break;
      case 6:
        FriArray.push(day);
        break;
      case 0:
        satArray.push(day);
        break;
    }
  });
  
  return addEmptySpaces([monArray, tuesArray, wedArray, thursArray, FriArray, satArray, sunArray]);
}

function addEmptySpaces(monthData) {

  let firstDayFound = false;

  monthData.forEach((monthDay) => {

    if(monthDay[0] === 1)
    {
      firstDayFound = true;
    }
    
    if(!firstDayFound)
      monthDay.unshift(null);
  })

  return monthData;
}

export function getDayAbbr(day) {

  switch((day) % 7) {
    case 6:
      return "Su";
    case 0:
      return "Mo";
    case 1:
      return "Tu";
    case 2:
      return "We";
    case 3:
      return "Th";
    case 4:
      return "Fr";
    case 5:
      return "Sa";
    default:
      console.log("invalid", day);
      return null;
  }
}

export function isToday(day, month, day2, month2) {

  if (day2 === day && month2 === month)
    return true;

  else 
    return false;

}

export function handleIncreaseMonth(currentDate) {

  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

    if(currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    }
    else {
        currentMonth = (currentMonth + 1);
    }

    return [currentMonth, currentYear];
}

export function handleDecreaseMonth(currentDate) {
 
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

    if(currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    }
    else {                
        currentMonth = (currentMonth - 1);
    }

    return [currentMonth, currentYear];
}

export function formatDatestring(date) {
  let handledDate = new Date(date);

  if(date == undefined || date == null) {
    return "no date"
  }

  let month = handledDate.toLocaleString('default', {month: 'short'})
  let dateString = handledDate.getDate() + " " + month + " " + handledDate.getFullYear();
  
  return dateString;
}

export function compareDates(date1, date2) {
  //check for nulls
  if(date1 == null) {
    if(date2==null) {
      return 0;
    } else 
      return -1;
  } else if(date2==null) {
    return 1;
  }

  var d1 = new Date(date1);
  var d2 = new Date(date2);

  var d1y = d1.getFullYear();
  var d1m = d1.getMonth();
  var d1d = d1.getDate();

  var d2y = d2.getFullYear();
  var d2m = d2.getMonth();
  var d2d = d2.getDate();


  if(d1y > d2y){
    return 1;
  } else if(d1y < d2y) {
    return -1;
  } else if (d1m > d2m) {
    return 1;
  } else if(d1m < d2m) {
    return -1;
  } else if(d1d > d2d) {
    return 1;
  } else if(d1d < d2d) {
    return -1;
  } else {
    return 0;
  }
}

export function createMonthString(d) {
  let date = new Date(d);
  return `${getMonthName(date.getMonth(), true)} ${date.getFullYear()}`;
}

export function getYearMonth(d) {
  let date = new Date(d);
  return `${date.getFullYear()}-${date.getMonth()+1}-1`;
}

export function getValidYearMonths(numMonths) {
  let today = new Date();
  let returnMonths = [];

  today.setMonth(today.getMonth()+1);

  for(let i=0; i<numMonths; i++) {
    today.setMonth(today.getMonth()-1);
    returnMonths.push(getYearMonth(today))
  }

  return returnMonths;
}