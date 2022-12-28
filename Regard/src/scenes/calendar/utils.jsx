export function convertToCSV(data) {
  // Initialize an array to hold the rows of the CSV
  const rows = [];

  // Loop through each key in the data object
  for (const key in data) {
    // Get the array of objects for the current key
    const objects = data[key];

    // Loop through each object in the array
    for (const object of objects) {
      // Initialize an array to hold the values for the current object
      const values = [];

      // Loop through each property in the object
      for (const prop in object) {
        // If the property is not "total_time", add its value to the values array
        if (prop !== "total_time") {
          values.push(object[prop]);
        }
      }

      // Add the values array as a row in the rows array
      rows.push(values);
    }
  }

  // Join the rows array with newline characters to create the CSV string
  return rows.join("\n");
}

export const getColors = (colors) => {
  let color_index = 0;

  return function () {
    let color = colors[color_index];
    if (color_index + 1 === colors.length) {
      color_index = 0;
    } else {
      color_index += 1;
    }
    return color;
  };
};

export const convertData = (data, colors, filter) => {
  let convertedData = [];
  let pickColor = getColors(colors);
  for (const watcher in data) {
    if (filter !== "All" && filter !== watcher) {
      continue;
    }
    let color = pickColor();
    for (const watcherTime of data[watcher]) {
      if (watcherTime.start_date !== watcherTime.end_date) {
        convertedData.push({
          title: watcher,
          start: watcherTime.start_date,
          end: watcherTime.end_date,
          color,
        });
      }
    }
  }
  return convertedData;
};

export const getHours = (data, filter) => {
  // Get the current date
  const currentDate = new Date();

  // Initialize the total time variables
  let totalTimeToday = 0;
  let totalTimeThisWeek = 0;
  let totalTimeThisMonth = 0;
  let totalTimeThisYear = 0;

  // Loop through the JSON object

  for (const watcher in data) {
    if (filter !== "All" && filter !== watcher) {
      continue;
    }
    for (const watcherTime of data[watcher]) {
      // Parse the start date
      const startDate = new Date(watcherTime.start_date);

      // Check if the start date is today
      if (
        startDate.getDate() === currentDate.getDate() &&
        startDate.getMonth() === currentDate.getMonth() &&
        startDate.getFullYear() === currentDate.getFullYear()
      ) {
        totalTimeToday += watcherTime.total_time;
      }

      // Check if the start date is in the current week
      if (
        startDate.getTime() >
          currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000 &&
        startDate.getTime() <
          currentDate.getTime() +
            (7 - currentDate.getDay()) * 24 * 60 * 60 * 1000
      ) {
        totalTimeThisWeek += watcherTime.total_time;
      }

      // Check if the start date is in the current month
      if (
        startDate.getMonth() === currentDate.getMonth() &&
        startDate.getFullYear() === currentDate.getFullYear()
      ) {
        totalTimeThisMonth += watcherTime.total_time;
      }

      // Check if the start date is in the current year
      if (startDate.getFullYear() === currentDate.getFullYear()) {
        totalTimeThisYear += watcherTime.total_time;
      }
    }
  }

  // Return the total times
  return {
    day: totalTimeToday === 0 ? 0 : (totalTimeToday / 60).toFixed(2),
    week: totalTimeThisWeek === 0 ? 0 : (totalTimeThisWeek / 60).toFixed(2),
    month: totalTimeThisMonth === 0 ? 0 : (totalTimeThisMonth / 60).toFixed(2),
    year: totalTimeThisYear === 0 ? 0 : (totalTimeThisYear / 60).toFixed(2),
  };
};
