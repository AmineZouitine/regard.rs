function sameWeek(date1, date2) {
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1[1] === week2[1] && week1[0] === week2[0];
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
}

export function removeDataWeek(data, date) {
  for (const key of Object.keys(data)) {
    const sessions = data[key];
    for (let i = 0; i < sessions.length; i++) {
      const startDate = new Date(sessions[i].start_date);
      if (!sameWeek(startDate, date)) {
        sessions.splice(i, 1);
        i--;
      }
    }
  }
  return data;
}

export function removeDataMonth(data, date) {
  console.log("Data", data);
  for (const key of Object.keys(data)) {
    console.log("Key", key);
    const sessions = data[key];
    console.log("sessions", sessions);
    for (let i = 0; i < sessions.length; i++) {
      const startDate = new Date(sessions[i].start_date);
      console.log("Start", startDate.getMonth(), "Cmp", date.getMonth());
      if (startDate.getMonth() !== date.getMonth()) {
        sessions.splice(i, 1);
        i--;
      }
    }
  }
  return data;
}

export function removeDataByWatcherName(data, watcherNames) {
  let dataCopy = { ...data };
  for (const key of Object.keys(dataCopy)) {
    if (!watcherNames.includes(key)) {
      delete dataCopy[key];
    }
  }
  return dataCopy;
}

export function groupDataByDay(data) {
  const result = {};
  for (const key of Object.keys(data)) {
    const sessions = data[key];
    result[key] = {};
    for (const session of sessions) {
      const startDate = new Date(session.start_date);
      const dayOfWeek = startDate.getDay();
      const day =
        dayOfWeek === 0
          ? "sunday"
          : dayOfWeek === 1
          ? "monday"
          : dayOfWeek === 2
          ? "tuesday"
          : dayOfWeek === 3
          ? "wednesday"
          : dayOfWeek === 4
          ? "thursday"
          : dayOfWeek === 5
          ? "friday"
          : "saturday";
      if (result[key][day]) {
        result[key][day] += session.total_time;
      } else {
        result[key][day] = session.total_time;
      }
    }

    result[key] = {
      sunday: result[key].sunday || 0,
      monday: result[key].monday || 0,
      tuesday: result[key].tuesday || 0,
      wednesday: result[key].wednesday || 0,
      thursday: result[key].thursday || 0,
      friday: result[key].friday || 0,
      saturday: result[key].saturday || 0,
    };
  }
  return result;
}

function groupDataByWeek(data) {
  const result = {};
  for (const key of Object.keys(data)) {
    const sessions = data[key];
    result[key] = {
      week1: 0,
      week2: 0,
      week3: 0,
      week4: 0,
    };
    for (const session of sessions) {
      const startDate = new Date(session.start_date);
      const weekOfMonth = getWeekOfMonth(startDate);
      const week = `week${weekOfMonth}`;
      result[key][week] += session.total_time;
    }
  }
  return result;
}

function getWeekOfMonth(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const elapsed = (date - start) / 86400000;
  return Math.floor(elapsed / 7) + 1;
}

export function getWeekDateString(offset) {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + 1 + offset * 7);
  const weekNumber = Math.ceil((date.getDate() - 1) / 7);
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let year = date.getFullYear();
  return [`${day}/${month}/${year}`, date];
}

export function getMonthDateString(offset) {
  const date = new Date();
  date.setMonth(date.getMonth() + offset);
  let month = date.toLocaleString("en-us", { month: "long" });
  let year = date.getFullYear();

  return [`${month} - ${year}`, date];
}

export function convertData(data) {
  const result = [];
  const keys = Object.keys(data);
  if (keys.length === 0) return [];
  for (const day of Object.keys(data[keys[0]])) {
    const dayData = { day };
    for (const key of keys) {
      dayData[key] = data[key][day];
    }
    result.push(dayData);
  }
  return result;
}

function convertDataMonth(data) {
  const result = [];
  const keys = Object.keys(data);
  if (keys.length === 0) return [];
  for (const week of Object.keys(data[keys[0]])) {
    const weekData = { week };
    for (const key of keys) {
      weekData[key] = data[key][week];
    }
    result.push(weekData);
  }
  return result;
}

export function addColors(data) {
  const colors = new Map();
  for (const obj of data) {
    for (const key of Object.keys(obj)) {
      if (key !== "day") {
        if (colors.has(key)) {
          obj[`${key}Color`] = colors.get(key);
        } else {
          const hue = Math.floor(Math.random() * 360);
          const saturation = Math.floor(Math.random() * 30) + 70;
          const lightness = Math.floor(Math.random() * 10) + 50;
          const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          colors.set(key, color);
          obj[`${key}Color`] = color;
        }
      }
    }
  }
  return data;
}

function addColorsMonth(data) {
  const colors = new Map();
  for (const obj of data) {
    for (const key of Object.keys(obj)) {
      if (key !== "week") {
        if (colors.has(key)) {
          obj[`${key}Color`] = colors.get(key);
        } else {
          const hue = Math.floor(Math.random() * 360);
          const saturation = Math.floor(Math.random() * 30) + 70;
          const lightness = Math.floor(Math.random() * 10) + 50;
          const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          colors.set(key, color);
          obj[`${key}Color`] = color;
        }
      }
    }
  }
  return data;
}

function sortDays(days) {
  return days.sort((a, b) => {
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
  });
}

function sortWeeks(weeks) {
  return weeks.sort((a, b) => {
    const weeksOfMonth = ["week1", "week2", "week3", "week4"];
    return weeksOfMonth.indexOf(a.week) - weeksOfMonth.indexOf(b.week);
  });
}

export function barData(data, filter, isWeek, date) {
  let copyData = JSON.parse(JSON.stringify(data));

  if (isWeek) {
    copyData = removeDataWeek(copyData, date);
    copyData =
      filter !== "All" ? removeDataByWatcherName(copyData, [filter]) : copyData;
    return sortDays(addColors(convertData(groupDataByDay(copyData))));
  }
  copyData = removeDataMonth(copyData, date);
  copyData =
    filter !== "All" ? removeDataByWatcherName(copyData, [filter]) : copyData;
  return addColorsMonth(convertDataMonth(groupDataByWeek(copyData)));
}
