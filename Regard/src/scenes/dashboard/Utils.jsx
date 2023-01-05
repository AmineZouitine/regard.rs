function sameWeek(date1, date2) {
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1[1] === week2[1] && week1[0] === week2[0];
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

export function removeDataWeek(data, date) {
  // Iterate over the keys in the data object
  for (const key of Object.keys(data)) {
    // Get the array of session objects for the current key
    const sessions = data[key];
    // Iterate over the session objects
    for (let i = 0; i < sessions.length; i++) {
      // Get the start date for the current session
      const startDate = new Date(sessions[i].start_date);
      // Check if the start date is in the same week as the given date
      if (!sameWeek(startDate, date)) {
        // If not, remove the session object from the array
        sessions.splice(i, 1);
        i--;
      }
    }
    // If the array is empty, delete the key from the data object
    // if (sessions.length === 0) {
    //   delete data[key];
    // }
  }
  return data;
}

export function removeDataMonth(data, date) {
  console.log("Data", data);
  // Iterate over the keys in the data object
  for (const key of Object.keys(data)) {
    // Get the array of session objects for the current key
    console.log("Key", key);
    const sessions = data[key];
    console.log("sessions", sessions);
    // Iterate over the session objects
    for (let i = 0; i < sessions.length; i++) {
      // Get the start date for the current session
      const startDate = new Date(sessions[i].start_date);
      // Check if the start date is in the same month as the given date
      console.log("Start", startDate.getMonth(), "Cmp", date.getMonth());
      if (startDate.getMonth() !== date.getMonth()) {
        // If not, remove the session object from the array
        sessions.splice(i, 1);
        i--;
      }
    }
    // If the array is empty, delete the key from the data object
    // if (sessions.length === 0) {
    //   delete data[key];
    // }
  }
  return data;
}

export function removeDataByWatcherName(data, watcherNames) {
  let dataCopy = { ...data };
  // Iterate over the keys in the data object
  for (const key of Object.keys(dataCopy)) {
    // Check if the key is not in the list of watcher names
    if (!watcherNames.includes(key)) {
      // If not, delete the key from the data object
      delete dataCopy[key];
    }
  }
  return dataCopy;
}

export function groupDataByDay(data) {
  // Create an empty result object
  const result = {};
  // Iterate over the keys in the data object
  for (const key of Object.keys(data)) {
    // Get the array of session objects for the current key
    const sessions = data[key];
    // Create an empty object for the current key
    result[key] = {};
    // Iterate over the session objects
    for (const session of sessions) {
      // Get the start date for the current session
      const startDate = new Date(session.start_date);
      // Get the day of the week for the start date
      const dayOfWeek = startDate.getDay();
      // Use the day of the week as the key for the result object
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
      // Check if the array for the day of the week exists
      if (result[key][day]) {
        // If it does, add the session object's total time to the existing value
        result[key][day] += session.total_time;
      } else {
        // If it does not, set the value to the session object's total time
        result[key][day] = session.total_time;
      }
    }

    // Add keys for each day of the week with a value of 0
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

// Helper function to get the week number for a given date
function groupDataByWeek(data) {
  // Create an empty result object
  const result = {};
  // Iterate over the keys in the data object
  for (const key of Object.keys(data)) {
    // Get the array of session objects for the current key
    const sessions = data[key];
    // Create an empty object for the current key
    result[key] = {
      week1: 0,
      week2: 0,
      week3: 0,
      week4: 0,
    };
    // Iterate over the session objects
    for (const session of sessions) {
      // Get the start date for the current session
      const startDate = new Date(session.start_date);
      // Get the week of the month for the start date
      const weekOfMonth = getWeekOfMonth(startDate);
      // Use the week of the month as the key for the result object
      const week = `week${weekOfMonth}`;
      // Add the session object's total time to the existing value
      result[key][week] += session.total_time;
    }
  }
  return result;
}

function getWeekOfMonth(date) {
  // Create a new date object for the beginning of the month
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  // Calculate the number of days elapsed from the beginning of the month
  // to the date in question
  const elapsed = (date - start) / 86400000;
  // Divide the elapsed days by 7 and round down to get the week number
  return Math.floor(elapsed / 7) + 1;
}

export function getWeekDateString(offset) {
  // Get the current date
  const date = new Date();

  // Set the date to the first day of the week (Monday)
  date.setDate(date.getDate() - date.getDay() + 1 + offset * 7);

  // Get the week number
  const weekNumber = Math.ceil((date.getDate() - 1) / 7);

  // Get the month and year
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let year = date.getFullYear();

  // Return the date string in the desired format
  return [`${day}/${month}/${year}`, date];
}

export function getMonthDateString(offset) {
  // Get the current date
  const date = new Date();

  // Set the month to the current month plus the offset
  date.setMonth(date.getMonth() + offset);

  // Get the month and year
  let month = date.toLocaleString("en-us", { month: "long" });
  let year = date.getFullYear();

  // Return the month and year string in the desired format
  return [`${month} - ${year}`, date];
}

export function convertData(data) {
  // Create an empty result array
  const result = [];
  // Get the keys for the data object
  const keys = Object.keys(data);
  // Iterate over the days of the week
  for (const day of Object.keys(data[keys[0]])) {
    // Create an object for the current day
    const dayData = { day };
    // Iterate over the keys in the data object
    for (const key of keys) {
      // Add a property to the object for the current key with the value for the current day
      dayData[key] = data[key][day];
    }
    // Add the object for the current day to the result array
    result.push(dayData);
  }
  return result;
}

function convertDataMonth(data) {
  // Create an empty result array
  const result = [];
  // Get the keys for the data object
  const keys = Object.keys(data);
  // Iterate over the weeks of the month
  for (const week of Object.keys(data[keys[0]])) {
    // Create an object for the current week
    const weekData = { week };
    // Iterate over the keys in the data object
    for (const key of keys) {
      // Add a property to the object for the current key with the value for the current week
      weekData[key] = data[key][week];
    }
    // Add the object for the current week to the result array
    result.push(weekData);
  }
  return result;
}

export function addColors(data) {
  // Create a map to store the colors for each key
  const colors = new Map();
  // Iterate over the objects in the data array
  for (const obj of data) {
    // Iterate over the keys in the object
    for (const key of Object.keys(obj)) {
      // Check if the key is not "day"
      if (key !== "day") {
        // Check if the map has a color for the key
        if (colors.has(key)) {
          // If it does, add the color to the object
          obj[`${key}Color`] = colors.get(key);
        } else {
          // If it does not, generate a random color and add it to the map and the object
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
  // Create a map to store the colors for each key
  const colors = new Map();
  // Iterate over the objects in the data array
  for (const obj of data) {
    // Iterate over the keys in the object
    for (const key of Object.keys(obj)) {
      // Check if the key is not "week"
      if (key !== "week") {
        // Check if the map has a color for the key
        if (colors.has(key)) {
          // If it does, add the color to the object
          obj[`${key}Color`] = colors.get(key);
        } else {
          // If it does not, generate a random color and add it to the map and the object
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
