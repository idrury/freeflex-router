import { useEffect, useState } from "react";
import {
  getMonthName,
  getMonthDates,
  getDayAbbr,
  handleDecreaseMonth,
  handleIncreaseMonth,
  isToday,
} from "../Functions/Dates";
import IonIcon from "@reacticons/ionicons";

export function DatePicker({ currentDate, setCurrentDate, closeTrigger }) {
  const [monthDates, setMonthDates] = useState(null);
  const [localDate, setLocalDate] = useState(new Date(currentDate || ""));

  useEffect(() => {
    if (!monthDates) {
      currentDate
        ? setMonthDates(getMonthDates(new Date(localDate)))
        : setMonthDates(getMonthDates(new Date()));
    }
  }, []);

  function increaseMonth(increase) {
    var currentMonth;
    var currentYear;
    let returnDate = new Date();

    if (increase === true) {
      [currentMonth, currentYear] = handleIncreaseMonth(
        localDate || new Date()
      );
    } else {
      [currentMonth, currentYear] = handleDecreaseMonth(
        localDate || new Date()
      );
    }
    returnDate.setFullYear(currentYear, currentMonth, 1);
    setMonthDates(getMonthDates(returnDate));
    setLocalDate(returnDate);
  }

  function handleDayPress(day) {
    let date = currentDate ? new Date(currentDate) : new Date();
    date.setDate(day);
    date.setMonth(localDate.getMonth());
    date.setFullYear(localDate.getFullYear());
    setCurrentDate(date);
    closeTrigger(false);
  }

  return (
    <div>
      <MonthPickerHeader
        currentDate={localDate || new Date()}
        onBackPress={() => increaseMonth(false)}
        onForwardPress={() => increaseMonth(true)}
      />
      <div className="centerRow" style={{ alignItems: "start", margin: 10 }}>
        {monthDates?.map((week, i) => (
          <MonthWeek
            key={i}
            days={week}
            index={i}
            selectDate={(id) => handleDayPress(id)}
            currentDate={localDate}
          />
        ))}
      </div>
      <div
        className="boxed"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <IonIcon
          onClick={() => {
            setLocalDate(new Date());
            setMonthDates(getMonthDates(new Date()));
            setCurrentDate(new Date());
          }}
          className="buttonIcon"
          name="refresh"
          style={{ width: 20 }}
        />
        <div>
          <IonIcon
            onClick={() => closeTrigger(false)}
            className="buttonIcon"
            name="close"
            style={{ width: 20 }}
          />
        </div>
      </div>
    </div>
  );
}

export default DatePicker;

export function MonthWeek({ days, index, selectDate, currentDate }) {
  const selectedDate = currentDate.getDate();
  const selectedMonth = currentDate.getMonth();
  const tDate = new Date().getDate();
  const tMonth = new Date().getMonth();

  return (
    <div>
      <p>{getDayAbbr(index)}</p>
      {days.map((day, i) => (
        <button
          style={{ marginBottom: 10 }}
          className={`dateFilled ${
            isToday(selectedDate, selectedMonth, day, selectedMonth) &&
            "highlight"
          } ${isToday(tDate, tMonth, day, selectedMonth) && "light"}`}
          key={i}
          onClick={() => selectDate(day)}
        >
          <p>{day}</p>
        </button>
      ))}
    </div>
  );
}

export function MonthPickerHeader({
  currentDate,
  onForwardPress,
  onBackPress,
}) {
  return (
    <div className="monthPickerHeader">
      <IonIcon
        onClick={() => onBackPress()}
        className="buttonIcon"
        name="chevron-back"
        style={{ width: 20, marginLeft: 20 }}
      />
      <p>
        {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
      </p>
      <IonIcon
        onClick={() => onForwardPress()}
        className="buttonIcon"
        name="chevron-forward"
        style={{ width: 20, marginRight: 20 }}
      />
    </div>
  );
}
